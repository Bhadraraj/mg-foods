const Item = require('../models/Item');
const Category = require('../models/Category');

// @desc    Create new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      itemData.images = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        alt: req.body.name
      }));
    }

    const item = await Item.create(itemData);

    const populatedItem = await Item.findById(item._id)
      .populate('category', 'name')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item: populatedItem }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all items with pagination and filtering
// @route   GET /api/items
// @access  Private
const getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.stockStatus) {
      switch (req.query.stockStatus) {
        case 'low-stock':
          filter.$expr = { $lte: ['$stock.currentStock', '$stock.minStock'] };
          break;
        case 'out-of-stock':
          filter['stock.currentStock'] = 0;
          break;
        case 'overstock':
          filter.$expr = { $gte: ['$stock.currentStock', '$stock.maxStock'] };
          break;
        case 'in-stock':
          filter.$expr = { 
            $and: [
              { $gt: ['$stock.currentStock', '$stock.minStock'] },
              { $lt: ['$stock.currentStock', '$stock.maxStock'] }
            ]
          };
          break;
      }
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { itemCode: { $regex: req.query.search, $options: 'i' } },
        { hsnCode: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter['pricing.sellingPrice'] = {};
      if (req.query.minPrice) filter['pricing.sellingPrice'].$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter['pricing.sellingPrice'].$lte = parseFloat(req.query.maxPrice);
    }

    const items = await Item.find(filter)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .populate('vendor', 'name contact')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: items.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { items }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Private
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('category', 'name description')
      .populate('subCategory', 'name description')
      .populate('vendor', 'name contact business')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        alt: req.body.name || item.name
      }));
      
      // Append to existing images or replace
      if (req.body.replaceImages === 'true') {
        updateData.images = newImages;
      } else {
        updateData.images = [...(item.images || []), ...newImages];
      }
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .populate('vendor', 'name contact');

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if item is used in any active sales or recipes
    const Sale = require('../models/Sale');
    const Recipe = require('../models/Recipe');

    const activeSales = await Sale.countDocuments({
      'items.item': item._id,
      status: { $in: ['draft', 'confirmed'] }
    });

    const activeRecipes = await Recipe.countDocuments({
      'ingredients.ingredient': item._id,
      status: 'active'
    });

    if (activeSales > 0 || activeRecipes > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete item as it is used in active sales or recipes'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update item stock
// @route   PUT /api/items/:id/stock
// @access  Private
const updateStock = async (req, res) => {
  try {
    const { currentStock, minStock, maxStock, reason } = req.body;

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Update stock
    if (currentStock !== undefined) item.stock.currentStock = currentStock;
    if (minStock !== undefined) item.stock.minStock = minStock;
    if (maxStock !== undefined) item.stock.maxStock = maxStock;
    
    item.updatedBy = req.user.id;
    await item.save();

    // Log stock adjustment (you can create a StockAdjustment model for this)
    console.log(`Stock updated for ${item.name} by ${req.user.name}. Reason: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating stock',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get low stock items
// @route   GET /api/items/low-stock
// @access  Private
const getLowStockItems = async (req, res) => {
  try {
    const items = await Item.find({
      $expr: { $lte: ['$stock.currentStock', '$stock.minStock'] },
      status: 'active'
    })
    .populate('category', 'name')
    .sort({ 'stock.currentStock': 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: { items }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock items',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get items by category
// @route   GET /api/items/category/:categoryId
// @access  Private
const getItemsByCategory = async (req, res) => {
  try {
    const items = await Item.find({
      category: req.params.categoryId,
      status: 'active'
    })
    .populate('category', 'name')
    .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: { items }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items by category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Bulk update stock
// @route   POST /api/items/bulk-stock-update
// @access  Private
const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { itemId, currentStock, minStock, maxStock }

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required'
      });
    }

    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.itemId },
        update: {
          $set: {
            'stock.currentStock': update.currentStock,
            'stock.minStock': update.minStock,
            'stock.maxStock': update.maxStock,
            updatedBy: req.user.id
          }
        }
      }
    }));

    const result = await Item.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Bulk stock update completed',
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in bulk stock update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  updateStock,
  getLowStockItems,
  getItemsByCategory,
  bulkUpdateStock
};