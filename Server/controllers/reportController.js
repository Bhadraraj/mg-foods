const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Item = require('../models/Item');
const Party = require('../models/Party');
const Expense = require('../models/Expense');

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const matchStage = {
      status: { $ne: 'cancelled' }
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    let groupStage;
    switch (groupBy) {
      case 'hour':
        groupStage = {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
            hour: { $hour: '$createdAt' }
          }
        };
        break;
      case 'day':
        groupStage = {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          }
        };
        break;
      case 'month':
        groupStage = {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          }
        };
        break;
      default:
        groupStage = {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          }
        };
    }

    const salesReport = await Sale.aggregate([
      { $match: matchStage },
      {
        $group: {
          ...groupStage,
          totalSales: { $sum: '$pricing.grandTotal' },
          totalOrders: { $sum: 1 },
          totalTax: { $sum: '$pricing.taxAmount' },
          totalDiscount: { $sum: '$pricing.discountAmount' },
          cashSales: {
            $sum: {
              $cond: [{ $eq: ['$payment.method', 'cash'] }, '$pricing.grandTotal', 0]
            }
          },
          cardSales: {
            $sum: {
              $cond: [{ $eq: ['$payment.method', 'card'] }, '$pricing.grandTotal', 0]
            }
          },
          upiSales: {
            $sum: {
              $cond: [{ $eq: ['$payment.method', 'upi'] }, '$pricing.grandTotal', 0]
            }
          },
          creditSales: {
            $sum: {
              $cond: [{ $eq: ['$payment.method', 'credit'] }, '$pricing.grandTotal', 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
    ]);

    // Calculate totals
    const totals = salesReport.reduce((acc, curr) => ({
      totalSales: acc.totalSales + curr.totalSales,
      totalOrders: acc.totalOrders + curr.totalOrders,
      totalTax: acc.totalTax + curr.totalTax,
      totalDiscount: acc.totalDiscount + curr.totalDiscount,
      cashSales: acc.cashSales + curr.cashSales,
      cardSales: acc.cardSales + curr.cardSales,
      upiSales: acc.upiSales + curr.upiSales,
      creditSales: acc.creditSales + curr.creditSales
    }), {
      totalSales: 0,
      totalOrders: 0,
      totalTax: 0,
      totalDiscount: 0,
      cashSales: 0,
      cardSales: 0,
      upiSales: 0,
      creditSales: 0
    });

    res.status(200).json({
      success: true,
      data: {
        report: salesReport,
        totals,
        period: { startDate, endDate },
        groupBy
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating sales report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get GST report
// @route   GET /api/reports/gst
// @access  Private
const getGSTReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {
      status: { $ne: 'cancelled' },
      billType: 'GST'
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const gstReport = await Sale.aggregate([
      { $match: matchStage },
      {
        $project: {
          billNo: 1,
          billDate: '$createdAt',
          customerName: '$customer.name',
          gstNo: '$customer.gstNumber',
          subTotal: '$pricing.subTotal',
          taxAmount: '$pricing.taxAmount',
          grandTotal: '$pricing.grandTotal',
          // Calculate tax breakdown (assuming 18% GST split into 9% CGST + 9% SGST)
          cgst: { $multiply: ['$pricing.taxAmount', 0.5] },
          sgst: { $multiply: ['$pricing.taxAmount', 0.5] },
          igst: 0 // For inter-state transactions
        }
      },
      { $sort: { billDate: -1 } }
    ]);

    // Calculate totals
    const totals = gstReport.reduce((acc, curr) => ({
      totalSubTotal: acc.totalSubTotal + curr.subTotal,
      totalTax: acc.totalTax + curr.taxAmount,
      totalCGST: acc.totalCGST + curr.cgst,
      totalSGST: acc.totalSGST + curr.sgst,
      totalIGST: acc.totalIGST + curr.igst,
      totalAmount: acc.totalAmount + curr.grandTotal
    }), {
      totalSubTotal: 0,
      totalTax: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
      totalAmount: 0
    });

    res.status(200).json({
      success: true,
      data: {
        report: gstReport,
        totals,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating GST report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get profit & loss report
// @route   GET /api/reports/profit-loss
// @access  Private
const getProfitLossReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Revenue from sales
    const revenue = await Sale.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.grandTotal' },
          totalTax: { $sum: '$pricing.taxAmount' },
          totalDiscount: { $sum: '$pricing.discountAmount' }
        }
      }
    ]);

    // Cost of goods sold (from purchases)
    const cogs = await Purchase.aggregate([
      {
        $match: {
          ...dateFilter,
          status: 'received'
        }
      },
      {
        $group: {
          _id: null,
          totalCOGS: { $sum: '$pricing.grandTotal' }
        }
      }
    ]);

    // Operating expenses
    const expenses = await Expense.aggregate([
      {
        $match: {
          date: dateFilter.createdAt || { $exists: true },
          status: { $in: ['approved', 'paid'] }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.totalAmount, 0);

    // Calculate profit/loss
    const totalRevenue = revenue[0]?.totalRevenue || 0;
    const totalCOGS = cogs[0]?.totalCOGS || 0;
    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;

    res.status(200).json({
      success: true,
      data: {
        revenue: {
          totalRevenue,
          totalTax: revenue[0]?.totalTax || 0,
          totalDiscount: revenue[0]?.totalDiscount || 0
        },
        costs: {
          totalCOGS,
          totalExpenses,
          expenseBreakdown: expenses
        },
        profit: {
          grossProfit,
          netProfit,
          grossProfitMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
          netProfitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
        },
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating profit & loss report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Private
const getInventoryReport = async (req, res) => {
  try {
    const { category, stockStatus } = req.query;

    const filter = { status: 'active' };
    if (category) filter.category = category;

    // Add stock status filter
    if (stockStatus) {
      switch (stockStatus) {
        case 'low-stock':
          filter.$expr = { $lte: ['$stock.currentStock', '$stock.minStock'] };
          break;
        case 'out-of-stock':
          filter['stock.currentStock'] = 0;
          break;
        case 'overstock':
          filter.$expr = { $gte: ['$stock.currentStock', '$stock.maxStock'] };
          break;
      }
    }

    const inventoryReport = await Item.find(filter)
      .populate('category', 'name')
      .select('name itemCode stock pricing category')
      .sort({ name: 1 });

    // Calculate totals
    const totals = inventoryReport.reduce((acc, item) => ({
      totalItems: acc.totalItems + 1,
      totalStockValue: acc.totalStockValue + (item.stock.currentStock * item.pricing.purchasePrice),
      totalSellingValue: acc.totalSellingValue + (item.stock.currentStock * item.pricing.sellingPrice)
    }), {
      totalItems: 0,
      totalStockValue: 0,
      totalSellingValue: 0
    });

    res.status(200).json({
      success: true,
      count: inventoryReport.length,
      data: {
        items: inventoryReport,
        totals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating inventory report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get purchase report
// @route   GET /api/reports/purchase
// @access  Private
const getPurchaseReport = async (req, res) => {
  try {
    const { startDate, endDate, vendor, status } = req.query;

    const filter = {};
    if (vendor) filter.vendor = vendor;
    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.invoiceDate = {};
      if (startDate) filter.invoiceDate.$gte = new Date(startDate);
      if (endDate) filter.invoiceDate.$lte = new Date(endDate);
    }

    const purchaseReport = await Purchase.find(filter)
      .populate('vendor', 'name contact business')
      .populate('items.item', 'name category')
      .sort({ invoiceDate: -1 });

    // Calculate totals
    const totals = purchaseReport.reduce((acc, purchase) => ({
      totalPurchases: acc.totalPurchases + purchase.pricing.grandTotal,
      totalOrders: acc.totalOrders + 1,
      totalTax: acc.totalTax + purchase.pricing.taxAmount,
      totalDiscount: acc.totalDiscount + purchase.pricing.discountAmount
    }), {
      totalPurchases: 0,
      totalOrders: 0,
      totalTax: 0,
      totalDiscount: 0
    });

    res.status(200).json({
      success: true,
      count: purchaseReport.length,
      data: {
        purchases: purchaseReport,
        totals,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating purchase report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get tax report
// @route   GET /api/reports/tax
// @access  Private
const getTaxReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Sales tax
    const salesTax = await Sale.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $ne: 'cancelled' },
          billType: 'GST'
        }
      },
      {
        $group: {
          _id: null,
          totalTaxCollected: { $sum: '$pricing.taxAmount' },
          totalSales: { $sum: '$pricing.grandTotal' }
        }
      }
    ]);

    // Purchase tax
    const purchaseTax = await Purchase.aggregate([
      {
        $match: {
          ...dateFilter,
          status: 'received',
          billingType: 'GST'
        }
      },
      {
        $group: {
          _id: null,
          totalTaxPaid: { $sum: '$pricing.taxAmount' },
          totalPurchases: { $sum: '$pricing.grandTotal' }
        }
      }
    ]);

    const salesTaxData = salesTax[0] || { totalTaxCollected: 0, totalSales: 0 };
    const purchaseTaxData = purchaseTax[0] || { totalTaxPaid: 0, totalPurchases: 0 };

    // Calculate net tax liability
    const netTaxLiability = salesTaxData.totalTaxCollected - purchaseTaxData.totalTaxPaid;

    res.status(200).json({
      success: true,
      data: {
        salesTax: salesTaxData,
        purchaseTax: purchaseTaxData,
        netTaxLiability,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating tax report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get customer report
// @route   GET /api/reports/customers
// @access  Private
const getCustomerReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const customerReport = await Sale.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: '$customer.mobile',
          customerName: { $first: '$customer.name' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$pricing.grandTotal' },
          lastOrderDate: { $max: '$createdAt' },
          avgOrderValue: { $avg: '$pricing.grandTotal' }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: customerReport.length,
      data: {
        customers: customerReport,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating customer report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get vendor report
// @route   GET /api/reports/vendors
// @access  Private
const getVendorReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.invoiceDate = {};
      if (startDate) dateFilter.invoiceDate.$gte = new Date(startDate);
      if (endDate) dateFilter.invoiceDate.$lte = new Date(endDate);
    }

    const vendorReport = await Purchase.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $ne: 'cancelled' }
        }
      },
      {
        $lookup: {
          from: 'parties',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorDetails'
        }
      },
      { $unwind: '$vendorDetails' },
      {
        $group: {
          _id: '$vendor',
          vendorName: { $first: '$vendorDetails.name' },
          vendorGST: { $first: '$vendorDetails.business.gstNumber' },
          totalOrders: { $sum: 1 },
          totalPurchases: { $sum: '$pricing.grandTotal' },
          lastOrderDate: { $max: '$invoiceDate' },
          avgOrderValue: { $avg: '$pricing.grandTotal' }
        }
      },
      { $sort: { totalPurchases: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: vendorReport.length,
      data: {
        vendors: vendorReport,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating vendor report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get item-wise report
// @route   GET /api/reports/items
// @access  Private
const getItemWiseReport = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const itemReport = await Sale.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $ne: 'cancelled' }
        }
      },
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
      ...(category ? [{
        $match: { 'itemDetails.category': mongoose.Types.ObjectId(category) }
      }] : []),
      {
        $group: {
          _id: '$items.item',
          itemName: { $first: '$items.itemName' },
          category: { $first: '$itemDetails.category' },
          totalQuantitySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' },
          avgSellingPrice: { $avg: '$items.price' },
          totalOrders: { $sum: 1 }
        }
      },
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
        $project: {
          itemName: 1,
          categoryName: '$categoryDetails.name',
          totalQuantitySold: 1,
          totalRevenue: 1,
          avgSellingPrice: 1,
          totalOrders: 1
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: itemReport.length,
      data: {
        items: itemReport,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating item-wise report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get cash book report
// @route   GET /api/reports/cash-book
// @access  Private
const getCashBookReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
    }

    // Cash inflows (sales)
    const cashInflows = await Sale.aggregate([
      {
        $match: {
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
          'payment.method': 'cash',
          status: { $ne: 'cancelled' }
        }
      },
      {
        $project: {
          date: '$createdAt',
          description: { $concat: ['Sale - ', '$billNo'] },
          inflow: '$pricing.grandTotal',
          outflow: 0,
          type: 'sale'
        }
      }
    ]);

    // Cash outflows (expenses)
    const cashOutflows = await Expense.aggregate([
      {
        $match: {
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
          paymentMethod: 'cash',
          status: 'paid'
        }
      },
      {
        $project: {
          date: '$date',
          description: '$description',
          inflow: 0,
          outflow: '$amount',
          type: 'expense'
        }
      }
    ]);

    // Combine and sort by date
    const cashBook = [...cashInflows, ...cashOutflows]
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance
    let runningBalance = 0;
    const cashBookWithBalance = cashBook.map(entry => {
      runningBalance += entry.inflow - entry.outflow;
      return {
        ...entry,
        balance: runningBalance
      };
    });

    // Calculate totals
    const totals = {
      totalInflows: cashInflows.reduce((sum, entry) => sum + entry.inflow, 0),
      totalOutflows: cashOutflows.reduce((sum, entry) => sum + entry.outflow, 0),
      netCashFlow: 0
    };
    totals.netCashFlow = totals.totalInflows - totals.totalOutflows;

    res.status(200).json({
      success: true,
      count: cashBookWithBalance.length,
      data: {
        entries: cashBookWithBalance,
        totals,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating cash book report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getSalesReport,
  getPurchaseReport,
  getInventoryReport,
  getGSTReport,
  getProfitLossReport,
  getTaxReport,
  getCustomerReport,
  getVendorReport,
  getItemWiseReport,
  getCashBookReport
};