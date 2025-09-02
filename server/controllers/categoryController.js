const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const Item = require("../models/itemModel");

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      user: req.user._id,
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    // Create category with proper error handling
    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      user: req.user._id,
    });

    // Get the created category with user info (avoid populate virtuals that might cause issues)
    const createdCategory = await Category.findById(category._id).populate(
      "user",
      "name email"
    );

    // Get item count manually to avoid virtual population issues
    const itemCount = await Item.countDocuments({
      category: createdCategory.name,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        ...createdCategory.toJSON(),
        totalItems: itemCount,
      },
    });
  } catch (error) {
    console.error("Create category error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    // Handle custom errors from pre-save middleware
    if (error.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @desc    Get all categories with item counts
// @route   GET /api/categories
// @access  Private
 const getCategories = asyncHandler(async (req, res) => {
    try {
        console.log('=== getCategories called ===');
        console.log('User ID:', req.user._id);
        console.log('Query params:', req.query);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        // Build filter
        const filter = { user: req.user._id };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        console.log('Category filter:', filter);

        // Get categories with pagination
        const categories = await Category.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        console.log('Categories found:', categories.length);

        // FIXED: Manually calculate item counts for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const categoryObj = category.toJSON();
                
                // Try both approaches to count items
                let itemCount = 0;
                
                try {
                    // Approach 1: Count using categories array (most likely correct)
                    const countArray = await Item.countDocuments({
                        categories: { $in: [category.name] },
                        user: req.user._id
                    });
                    
                    // Approach 2: Count using category string field
                    const countString = await Item.countDocuments({
                        category: category.name,
                        user: req.user._id
                    });
                    
                    console.log(`Category "${category.name}": Array count = ${countArray}, String count = ${countString}`);
                    
                    // Use whichever approach finds items
                    itemCount = Math.max(countArray, countString);
                    
                    // Also get sample items for debugging
                    const sampleItems = await Item.find({
                        $or: [
                            { categories: { $in: [category.name] } },
                            { category: category.name }
                        ],
                        user: req.user._id
                    }).select('productName categories category').limit(3);
                    
                    console.log(`Sample items for "${category.name}":`, sampleItems.map(item => ({
                        name: item.productName,
                        category: item.category,
                        categories: item.categories
                    })));
                    
                } catch (countError) {
                    console.error(`Error counting items for category ${category.name}:`, countError);
                    itemCount = 0;
                }
                
                categoryObj.totalItems = itemCount;
                return categoryObj;
            })
        );

        // Get total count for pagination
        const total = await Category.countDocuments(filter);

        console.log('Final categories with counts:', categoriesWithCounts.map(cat => ({
            name: cat.name,
            totalItems: cat.totalItems
        })));

        res.status(200).json({
            success: true,
            count: categories.length,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            data: categoriesWithCounts
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @desc    Get a single category by ID with its items
// @route   GET /api/categories/:id
// @access  Private
 const getCategoryById = asyncHandler(async (req, res) => {
    try {
        console.log('=== getCategoryById called ===');
        console.log('Category ID:', req.params.id);
        console.log('User ID:', req.user._id);

        const categoryId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            console.log('Invalid ObjectId format');
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        const category = await Category.findOne({
            _id: categoryId,
            user: req.user._id
        }).populate('user', 'name email');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or not authorized'
            });
        }

        console.log('Category found:', category.name);

        // DEBUG: Try multiple approaches to find items
        let items = [];
        let totalItems = 0;

        try {
            console.log('=== DEBUGGING ITEM RETRIEVAL ===');

            // Approach 1: Try categories array
            console.log('\n--- Trying categories array query ---');
            const itemsWithCategoriesArray = await Item.find({
                categories: { $in: [category.name] },
                user: req.user._id
            }).select('productName brandName subCategory stockDetails priceDetails categories category');
            
            console.log('Items found with categories array:', itemsWithCategoriesArray.length);
            itemsWithCategoriesArray.forEach(item => {
                console.log(`  - ${item.productName}: categories=${JSON.stringify(item.categories)}, category=${item.category}`);
            });

            // Approach 2: Try category string
            console.log('\n--- Trying category string query ---');
            const itemsWithCategoryString = await Item.find({
                category: category.name,
                user: req.user._id
            }).select('productName brandName subCategory stockDetails priceDetails categories category');
            
            console.log('Items found with category string:', itemsWithCategoryString.length);
            itemsWithCategoryString.forEach(item => {
                console.log(`  - ${item.productName}: categories=${JSON.stringify(item.categories)}, category=${item.category}`);
            });

            // Approach 3: Try case-insensitive search
            console.log('\n--- Trying case-insensitive search ---');
            const itemsCaseInsensitive = await Item.find({
                $or: [
                    { categories: { $regex: new RegExp('^' + category.name + '$', 'i') } },
                    { category: { $regex: new RegExp('^' + category.name + '$', 'i') } }
                ],
                user: req.user._id
            }).select('productName brandName subCategory stockDetails priceDetails categories category');
            
            console.log('Items found with case-insensitive:', itemsCaseInsensitive.length);

            // Approach 4: Check if the specific item exists at all
            console.log('\n--- Checking if specific item exists ---');
            const specificItem = await Item.findOne({
                _id: "68aaa2925a23976161747bd0"
            }).select('productName brandName categories category user');
            
            if (specificItem) {
                console.log('Specific item exists:', {
                    productName: specificItem.productName,
                    category: specificItem.category,
                    categories: specificItem.categories,
                    userId: specificItem.user.toString(),
                    matchesUser: specificItem.user.toString() === req.user._id.toString()
                });
            } else {
                console.log('Specific item does not exist in database');
            }

            // Use the approach that found the most items
            if (itemsWithCategoriesArray.length > 0) {
                items = itemsWithCategoriesArray;
                console.log('Using categories array result');
            } else if (itemsWithCategoryString.length > 0) {
                items = itemsWithCategoryString;
                console.log('Using category string result');
            } else if (itemsCaseInsensitive.length > 0) {
                items = itemsCaseInsensitive;
                console.log('Using case-insensitive result');
            } else {
                console.log('No items found with any approach');
                items = [];
            }

            totalItems = items.length;

        } catch (itemError) {
            console.error('Error getting items:', itemError);
            items = [];
            totalItems = 0;
        }

        console.log('Final result - Items found:', items.length);

        const categoryWithItems = {
            ...category.toJSON(),
            items,
            totalItems
        };

        res.status(200).json({
            success: true,
            data: categoryWithItems
        });

    } catch (error) {
        console.error('Get category by ID error:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// @desc    Update a category by ID
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  try {
    console.log("Updating category ID:", req.params.id);
    console.log("Update data:", req.body);
    console.log("User ID:", req.user._id);

    const { name, description, status } = req.body;
    const categoryId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format",
      });
    }

    // Find category with user check in one query
    const category = await Category.findOne({
      _id: categoryId,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or not authorized",
      });
    }

    const oldName = category.name;

    // Check if updating name and if it already exists
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        user: req.user._id,
        _id: { $ne: categoryId },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "A category with this name already exists",
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description ? description.trim() : "";
    if (status) updateData.status = status;

    // Only update if there's something to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    console.log("Update data to apply:", updateData);

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found after update",
      });
    }

    console.log("Category updated successfully:", updatedCategory.name);

    // If category name was updated, update all items with the old category name
    let updatedItemsCount = 0;
    if (name && name.trim() !== oldName) {
      console.log(
        `Updating items from '${oldName}' to '${updatedCategory.name}'`
      );

      const updateResult = await Item.updateMany(
        { category: oldName, user: req.user._id },
        { category: updatedCategory.name }
      );

      updatedItemsCount = updateResult.modifiedCount;
      console.log(`Updated ${updatedItemsCount} items with new category name`);
    }

    // Get current item count for response
    const itemCount = await Item.countDocuments({
      category: updatedCategory.name,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        ...updatedCategory.toJSON(),
        totalItems: itemCount,
      },
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
});

// @desc    Delete a category by ID
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format",
      });
    }

    const category = await Category.findOne({
      _id: categoryId,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or not authorized",
      });
    }

    // Check if category has items
    const itemCount = await Item.countDocuments({
      category: category.name,
      user: req.user._id,
    });

    if (itemCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${itemCount} items are still using this category. Please reassign or delete these items first.`,
      });
    }

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
});

// @desc    Get available items for category assignment
// @route   GET /api/categories/available-items
// @access  Private
const getAvailableItems = asyncHandler(async (req, res) => {
  try {
    const search = req.query.search || "";
    const categoryName = req.query.category || "";

    const filter = { user: req.user._id };

    // Search filter
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter - get items without category or with specific category
    if (categoryName) {
      filter.$or = [
        { category: { $exists: false } },
        { category: null },
        { category: "" },
        { category: categoryName },
      ];
    }

    const items = await Item.find(filter)
      .select("productName brandName category subCategory")
      .sort({ productName: 1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get available items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available items",
    });
  }
});

// @desc    Assign items to category
// @route   POST /api/categories/:id/assign-items
// @access  Private
 const assignItemsToCategory = asyncHandler(async (req, res) => {
    try {
        console.log('=== assignItemsToCategory called ===');
        console.log('Category ID:', req.params.id);
        console.log('Request body:', req.body);
        console.log('User ID:', req.user._id);

        const { itemIds } = req.body;
        
        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            console.log('Invalid itemIds:', itemIds);
            return res.status(400).json({
                success: false,
                message: 'Item IDs are required and must be a non-empty array'
            });
        }

        // Validate all item IDs are valid ObjectIds
        const invalidItemIds = itemIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidItemIds.length > 0) {
            console.log('Invalid ObjectId formats:', invalidItemIds);
            return res.status(400).json({
                success: false,
                message: 'Invalid item ID format',
                invalidIds: invalidItemIds
            });
        }

        // Validate ObjectId format for category
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log('Invalid category ObjectId format');
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        console.log('Looking for category...');
        const category = await Category.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!category) {
            console.log('Category not found or unauthorized');
            return res.status(404).json({
                success: false,
                message: 'Category not found or not authorized'
            });
        }

        console.log('Category found:', category.name);
        console.log('Looking for items...');

        // Validate items belong to user
        const items = await Item.find({
            _id: { $in: itemIds },
            user: req.user._id
        });

        console.log('Items found:', items.length, 'out of', itemIds.length, 'requested');

        if (items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items found for the provided IDs'
            });
        }

        if (items.length !== itemIds.length) {
            const foundIds = items.map(item => item._id.toString());
            const missingIds = itemIds.filter(id => !foundIds.includes(id));
            console.log('Missing items:', missingIds);
            
            return res.status(400).json({
                success: false,
                message: 'Some items were not found or do not belong to you',
                missingIds: missingIds
            });
        }

        console.log('All items validated, updating...');

        // FIXED: Add category to categories array instead of setting category field
        const updateResult = await Item.updateMany(
            { _id: { $in: itemIds } },
            { $addToSet: { categories: category.name } } // CHANGED: Add to categories array
        );

        console.log('Update result:', updateResult);

        // FIXED: Get updated item count using categories array
        const itemCount = await Item.countDocuments({
            categories: { $in: [category.name] }, // CHANGED: Count from categories array
            user: req.user._id
        });

        console.log('Final item count:', itemCount);

        res.status(200).json({
            success: true,
            message: `${items.length} items assigned to category successfully`,
            data: {
                ...category.toJSON(),
                totalItems: itemCount
            }
        });

    } catch (error) {
        console.error('Assign items to category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign items to category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// @desc    Remove items from category
// @route   DELETE /api/categories/:id/items
// @access  Private
const removeItemsFromCategory = asyncHandler(async (req, res) => {
    try {
        const { itemIds } = req.body;
        
        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Item IDs are required'
            });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        const category = await Category.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or not authorized'
            });
        }

        // FIXED: Remove category from categories array
        await Item.updateMany(
            { 
                _id: { $in: itemIds },
                categories: { $in: [category.name] }, // CHANGED: Check in categories array
                user: req.user._id
            },
            { $pull: { categories: category.name } } // CHANGED: Pull from categories array
        );

        // FIXED: Get updated item count using categories array
        const itemCount = await Item.countDocuments({
            categories: { $in: [category.name] }, // CHANGED: Count from categories array
            user: req.user._id
        });

        res.status(200).json({
            success: true,
            message: 'Items removed from category successfully',
            data: {
                ...category.toJSON(),
                totalItems: itemCount
            }
        });

    } catch (error) {
        console.error('Remove items from category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove items from category'
        });
    }
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAvailableItems,
  assignItemsToCategory,
  removeItemsFromCategory,
};
