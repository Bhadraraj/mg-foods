const SubCategory = require('../models/SubCategory');
const Category = require('../models/categoryModel');
const Item = require('../models/itemModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Private (itemSubCategory.view)
const getSubCategories = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        isActive,
        category,
        sortBy = 'sortOrder',
        sortOrder = 'asc'
    } = req.query;

    // Build query
    let query = { store: req.user.store };

    // Search functionality
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by active status
    if (isActive !== undefined) {
        query.isActive = isActive === 'true';
    }

    // Filter by category
    if (category) {
        query.category = category;
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    try {
        const subCategories = await SubCategory.find(query)
            .populate('category', 'name')
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name')
            .populate('itemCount')
            .sort(sort)
            .limit(limitNum)
            .skip(startIndex);

        const total = await SubCategory.countDocuments(query);

        res.status(200).json({
            success: true,
            data: subCategories,
            pagination: {
                current: pageNum,
                pages: Math.ceil(total / limitNum),
                total,
                limit: limitNum
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get single subcategory
// @route   GET /api/subcategories/:id
// @access  Private (itemSubCategory.view)
const getSubCategoryById = asyncHandler(async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id)
            .populate('category', 'name description')
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name')
            .populate('items', 'name price isActive');

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found'
            });
        }

        res.status(200).json({
            success: true,
            data: subCategory
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Create new subcategory
// @route   POST /api/subcategories
// @access  Private (itemSubCategory.create)
const createSubCategory = asyncHandler(async (req, res) => {
    try {
        // Check if parent category exists
        const parentCategory = await Category.findById(req.body.category);
        if (!parentCategory) {
            return res.status(404).json({
                success: false,
                message: 'Parent category not found'
            });
        }

        const subCategoryData = {
            ...req.body,
            store: req.user.store,
            createdBy: req.user._id
        };

        const subCategory = await SubCategory.create(subCategoryData);

        const populatedSubCategory = await SubCategory.findById(subCategory._id)
            .populate('category', 'name')
            .populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            data: populatedSubCategory,
            message: 'SubCategory created successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'SubCategory name already exists in this category'
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
});

// @desc    Update subcategory
// @route   PUT /api/subcategories/:id
// @access  Private (itemSubCategory.update)
const updateSubCategory = asyncHandler(async (req, res) => {
    try {
        let subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found'
            });
        }

        // If category is being changed, check if new category exists
        if (req.body.category && req.body.category !== subCategory.category.toString()) {
            const newCategory = await Category.findById(req.body.category);
            if (!newCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'New parent category not found'
                });
            }
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user._id
        };

        subCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('category', 'name')
         .populate('createdBy', 'name')
         .populate('updatedBy', 'name');

        res.status(200).json({
            success: true,
            data: subCategory,
            message: 'SubCategory updated successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'SubCategory name already exists in this category'
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
});

// @desc    Delete subcategory
// @route   DELETE /api/subcategories/:id
// @access  Private (itemSubCategory.delete)
const deleteSubCategory = asyncHandler(async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found'
            });
        }

        // Check if subcategory has associated items
        const itemCount = await Item.countDocuments({ subCategory: req.params.id });
        if (itemCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete subcategory. It has ${itemCount} associated items.`
            });
        }

        await SubCategory.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'SubCategory deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get available items for subcategory assignment
// @route   GET /api/subcategories/available-items
// @access  Private (itemSubCategory.view)
const getAvailableItems = asyncHandler(async (req, res) => {
    const { category } = req.query;
    
    try {
        let query = {
            store: req.user.store,
            isActive: true,
            $or: [
                { subCategory: { $exists: false } },
                { subCategory: null }
            ]
        };

        // If category is specified, filter items by category
        if (category) {
            query.category = category;
        }

        const items = await Item.find(query)
            .populate('category', 'name')
            .select('name price category');

        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Assign items to subcategory
// @route   POST /api/subcategories/:id/items
// @access  Private (itemSubCategory.update)
const assignItemsToSubCategory = asyncHandler(async (req, res) => {
    const { itemIds } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid item IDs array'
        });
    }

    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found'
            });
        }

        // Update items to assign them to this subcategory
        await Item.updateMany(
            { _id: { $in: itemIds } },
            { subCategory: req.params.id }
        );

        // Add items to subcategory's items array (avoid duplicates)
        const uniqueItemIds = [...new Set([...subCategory.items, ...itemIds])];
        subCategory.items = uniqueItemIds;
        subCategory.updatedBy = req.user._id;
        await subCategory.save();

        res.status(200).json({
            success: true,
            message: `${itemIds.length} items assigned to subcategory successfully`
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Remove items from subcategory
// @route   DELETE /api/subcategories/:id/items
// @access  Private (itemSubCategory.update)
const removeItemsFromSubCategory = asyncHandler(async (req, res) => {
    const { itemIds } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid item IDs array'
        });
    }

    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found'
            });
        }

        // Remove subcategory reference from items
        await Item.updateMany(
            { _id: { $in: itemIds } },
            { $unset: { subCategory: 1 } }
        );

        // Remove items from subcategory's items array
        subCategory.items = subCategory.items.filter(itemId => !itemIds.includes(itemId.toString()));
        subCategory.updatedBy = req.user._id;
        await subCategory.save();

        res.status(200).json({
            success: true,
            message: `${itemIds.length} items removed from subcategory successfully`
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get subcategories by category
// @route   GET /api/subcategories/by-category/:categoryId
// @access  Private (itemSubCategory.view)
const getSubCategoriesByCategory = asyncHandler(async (req, res) => {
    try {
        const subCategories = await SubCategory.find({
            category: req.params.categoryId,
            store: req.user.store,
            isActive: true
        })
        .select('name description sortOrder')
        .sort({ sortOrder: 1, name: 1 });

        res.status(200).json({
            success: true,
            data: subCategories
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = {
    getSubCategories,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getAvailableItems,
    assignItemsToSubCategory,
    removeItemsFromSubCategory,
    getSubCategoriesByCategory
};