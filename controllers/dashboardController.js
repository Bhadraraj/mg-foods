const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Item = require('../models/Item');
const Party = require('../models/Party');
const Expense = require('../models/Expense');
const KOT = require('../models/KOT');

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Today's sales stats
    const todaySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$pricing.grandTotal' },
          totalOrders: { $sum: 1 },
          cashSales: {
            $sum: {
              $cond: [{ $eq: ['$payment.method', 'cash'] }, '$pricing.grandTotal', 0]
            }
          },
          upiSales: {
            $sum: {
              $cond: [{ $eq: ['$payment.method', 'upi'] }, '$pricing.grandTotal', 0]
            }
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$payment.status', 'pending'] }, '$pricing.grandTotal', 0]
            }
          }
        }
      }
    ]);

    // Monthly stats
    const monthlySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$pricing.grandTotal' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    // Inventory stats
    const inventoryStats = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
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
          totalStockValue: {
            $sum: {
              $multiply: ['$stock.currentStock', '$pricing.purchasePrice']
            }
          }
        }
      }
    ]);

    // Customer stats
    const customerStats = await Party.aggregate([
      {
        $match: { type: 'customer' }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          activeCustomers: {
            $sum: {
              $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Recent transactions
    const recentTransactions = await Sale.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .limit(10)
    .select('billNo customer.name payment.method pricing.grandTotal createdAt');

    // KOT stats
    const kotStats = await KOT.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top selling items today
    const topSellingItems = await Sale.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.item',
          itemName: { $first: '$items.itemName' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // Pending credits
    const pendingCredits = await Sale.aggregate([
      {
        $match: {
          'payment.method': 'credit',
          'payment.status': 'pending'
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$pricing.grandTotal' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        today: todaySales[0] || {
          totalSales: 0,
          totalOrders: 0,
          cashSales: 0,
          upiSales: 0,
          pendingAmount: 0
        },
        monthly: monthlySales[0] || {
          totalSales: 0,
          totalOrders: 0
        },
        inventory: inventoryStats[0] || {
          totalItems: 0,
          lowStockItems: 0,
          outOfStockItems: 0,
          totalStockValue: 0
        },
        customers: customerStats[0] || {
          totalCustomers: 0,
          activeCustomers: 0
        },
        recentTransactions,
        kotStats: kotStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        topSellingItems,
        pendingCredits: pendingCredits[0] || {
          totalAmount: 0,
          count: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard overview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get sales analytics
// @route   GET /api/dashboard/sales-analytics
// @access  Private
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate;
    const endDate = new Date();

    switch (period) {
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    // Daily sales trend
    const salesTrend = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalSales: { $sum: '$pricing.grandTotal' },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Payment method distribution
    const paymentDistribution = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: '$payment.method',
          totalAmount: { $sum: '$pricing.grandTotal' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Category wise sales
    const categorySales = await Sale.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
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
        $lookup: {
          from: 'categories',
          localField: 'itemDetails.category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: '$categoryDetails' },
      {
        $group: {
          _id: '$categoryDetails.name',
          totalRevenue: { $sum: '$items.total' },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        salesTrend,
        paymentDistribution,
        categorySales
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getDashboardOverview,
  getSalesAnalytics
};