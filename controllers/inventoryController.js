const Item = require('../models/Item');
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');

// @desc    Get inventory overview
// @route   GET /api/inventory/overview
// @access  Private
const getInventoryOverview = async (req, res) => {
  try {
    // Overall inventory stats
    const inventoryStats = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalStockValue: {
            $sum: {
              $multiply: ['$stock.currentStock', '$pricing.purchasePrice']
            }
          },
          lowStockItems: {
            $sum: {
              $cond: [{ $lte: ['$stock.currentStock', '$stock.minStock'] }, 1, 0]
            }
          },
          outOfStockItems: {
            $sum: {
              $cond: [{ $eq: ['$stock.currentStock', 0] }, 1, 0]
            }
          },
          overstockItems: {
            $sum: {
              $cond: [{ $gte: ['$stock.currentStock', '$stock.maxStock'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Category wise inventory
    const categoryStats = await Item.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: '$categoryDetails' },
      {
        $group: {
          _id: '$categoryDetails.name',
          totalItems: { $sum: 1 },
          totalValue: {
            $sum: {
              $multiply: ['$stock.currentStock', '$pricing.purchasePrice']
            }
          },
          lowStockItems: {
            $sum: {
              $cond: [{ $lte: ['$stock.currentStock', '$stock.minStock'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    // Recent stock movements (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentMovements = await Sale.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.item',
          itemName: { $first: '$items.itemName' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: inventoryStats[0] || {
          totalItems: 0,
          totalStockValue: 0,
          lowStockItems: 0,
          outOfStockItems: 0,
          overstockItems: 0
        },
        categoryStats,
        recentMovements
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory overview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get stock movements
// @route   GET /api/inventory/movements
// @access  Private
const getStockMovements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get sales movements (stock out)
    const salesMovements = await Sale.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'items',
          localField: 'items.item',
          foreignField: '_id',
          as: 'itemDetails'
        }
      },
      { $unwind: '$itemDetails' },
      {
        $project: {
          type: 'sale',
          item: '$items.item',
          itemName: '$items.itemName',
          quantity: { $multiply: ['$items.quantity', -1] }, // Negative for stock out
          reference: '$billNo',
          date: '$createdAt',
          user: '$createdBy'
        }
      }
    ]);

    // Get purchase movements (stock in)
    const purchaseMovements = await Purchase.aggregate([
      { $match: { status: 'received' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'items',
          localField: 'items.item',
          foreignField: '_id',
          as: 'itemDetails'
        }
      },
      { $unwind: '$itemDetails' },
      {
        $project: {
          type: 'purchase',
          item: '$items.item',
          itemName: '$items.itemName',
          quantity: '$items.quantity', // Positive for stock in
          reference: '$purchaseId',
          date: '$createdAt',
          user: '$createdBy'
        }
      }
    ]);

    // Combine and sort movements
    const allMovements = [...salesMovements, ...purchaseMovements]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(skip, skip + limit);

    // Get total count for pagination
    const totalMovements = salesMovements.length + purchaseMovements.length;

    res.status(200).json({
      success: true,
      count: allMovements.length,
      pagination: {
        page,
        limit,
        total: totalMovements,
        pages: Math.ceil(totalMovements / limit)
      },
      data: { movements: allMovements }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock movements',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Adjust stock
// @route   POST /api/inventory/adjust
// @access  Private
const adjustStock = async (req, res) => {
  try {
    const { itemId, adjustment, reason, type } = req.body; // type: 'increase' or 'decrease'

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const oldStock = item.stock.currentStock;
    
    if (type === 'increase') {
      item.stock.currentStock += adjustment;
    } else if (type === 'decrease') {
      if (item.stock.currentStock < adjustment) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock for adjustment'
        });
      }
      item.stock.currentStock -= adjustment;
    }

    item.updatedBy = req.user.id;
    await item.save();

    // Log the adjustment (you can create a StockAdjustment model for detailed logging)
    console.log(`Stock adjusted for ${item.name}: ${oldStock} -> ${item.stock.currentStock}. Reason: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'Stock adjusted successfully',
      data: {
        item,
        adjustment: {
          oldStock,
          newStock: item.stock.currentStock,
          adjustment,
          type,
          reason
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adjusting stock',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Transfer stock between locations
// @route   POST /api/inventory/transfer
// @access  Private
const transferStock = async (req, res) => {
  try {
    const { fromItemId, toItemId, quantity, reason } = req.body;

    const fromItem = await Item.findById(fromItemId);
    const toItem = await Item.findById(toItemId);

    if (!fromItem || !toItem) {
      return res.status(404).json({
        success: false,
        message: 'One or both items not found'
      });
    }

    if (fromItem.stock.currentStock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock in source item'
      });
    }

    // Transfer stock
    fromItem.stock.currentStock -= quantity;
    toItem.stock.currentStock += quantity;

    fromItem.updatedBy = req.user.id;
    toItem.updatedBy = req.user.id;

    await fromItem.save();
    await toItem.save();

    res.status(200).json({
      success: true,
      message: 'Stock transferred successfully',
      data: {
        transfer: {
          from: { item: fromItem.name, newStock: fromItem.stock.currentStock },
          to: { item: toItem.name, newStock: toItem.stock.currentStock },
          quantity,
          reason
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error transferring stock',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get stock alerts
// @route   GET /api/inventory/alerts
// @access  Private
const getStockAlerts = async (req, res) => {
  try {
    // Low stock items
    const lowStockItems = await Item.find({
      $expr: { $lte: ['$stock.currentStock', '$stock.minStock'] },
      status: 'active'
    })
    .populate('category', 'name')
    .sort({ 'stock.currentStock': 1 });

    // Out of stock items
    const outOfStockItems = await Item.find({
      'stock.currentStock': 0,
      status: 'active'
    })
    .populate('category', 'name')
    .sort({ name: 1 });

    // Overstock items
    const overstockItems = await Item.find({
      $expr: { $gte: ['$stock.currentStock', '$stock.maxStock'] },
      status: 'active'
    })
    .populate('category', 'name')
    .sort({ 'stock.currentStock': -1 });

    // Expiring items (within 30 days)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiringItems = await Item.find({
      expirationDate: { $lte: thirtyDaysFromNow, $gte: new Date() },
      status: 'active'
    })
    .populate('category', 'name')
    .sort({ expirationDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        lowStock: lowStockItems,
        outOfStock: outOfStockItems,
        overstock: overstockItems,
        expiring: expiringItems,
        summary: {
          lowStockCount: lowStockItems.length,
          outOfStockCount: outOfStockItems.length,
          overstockCount: overstockItems.length,
          expiringCount: expiringItems.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock alerts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getInventoryOverview,
  getStockMovements,
  adjustStock,
  transferStock,
  getStockAlerts
};