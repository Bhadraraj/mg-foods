const Sale = require('../models/Sale');
const Item = require('../models/Item');
const KOT = require('../models/KOT');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
  try {
    const {
      customer,
      table,
      items,
      pricing,
      payment,
      billType,
      deliveryDate,
      notes,
      referrer
    } = req.body;

    // Validate items and calculate totals
    let calculatedSubTotal = 0;
    const processedItems = [];

    for (const item of items) {
      const dbItem = await Item.findById(item.itemId);
      if (!dbItem) {
        return res.status(400).json({
          success: false,
          message: `Item with ID ${item.itemId} not found`
        });
      }

      // Check stock availability
      if (dbItem.stock.currentStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${dbItem.name}. Available: ${dbItem.stock.currentStock}, Required: ${item.quantity}`
        });
      }

      const itemTotal = item.quantity * item.price;
      calculatedSubTotal += itemTotal;

      processedItems.push({
        item: item.itemId,
        itemName: dbItem.name,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
        kotNote: item.kotNote,
        variant: item.variant
      });

      // Update item stock
      dbItem.stock.currentStock -= item.quantity;
      await dbItem.save();
    }

    // Create sale
    const sale = await Sale.create({
      customer,
      table,
      items: processedItems,
      pricing: {
        ...pricing,
        subTotal: calculatedSubTotal
      },
      payment,
      billType: billType || 'GST',
      deliveryDate,
      notes,
      referrer,
      createdBy: req.user.id
    });

    // Create KOT if items exist
    if (processedItems.length > 0) {
      const kotItems = processedItems.map(item => ({
        item: item.item,
        itemName: item.itemName,
        quantity: item.quantity,
        variant: item.variant,
        kotNote: item.kotNote
      }));

      await KOT.create({
        sale: sale._id,
        table,
        customer: {
          name: customer.name,
          mobile: customer.mobile
        },
        items: kotItems,
        dineType: table.startsWith('P') ? 'takeaway' : 'dine-in',
        createdBy: req.user.id
      });
    }

    const populatedSale = await Sale.findById(sale._id)
      .populate('items.item', 'name category')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      data: { sale: populatedSale }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating sale',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all sales with pagination and filtering
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.billType) filter.billType = req.query.billType;
    if (req.query.paymentMethod) filter['payment.method'] = req.query.paymentMethod;
    if (req.query.paymentStatus) filter['payment.status'] = req.query.paymentStatus;
    if (req.query.kotStatus) filter.kotStatus = req.query.kotStatus;
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { billNo: { $regex: req.query.search, $options: 'i' } },
        { 'customer.name': { $regex: req.query.search, $options: 'i' } },
        { 'customer.mobile': { $regex: req.query.search, $options: 'i' } },
        { table: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const sales = await Sale.find(filter)
      .populate('items.item', 'name category')
      .populate('createdBy', 'name')
      .populate('referrer', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sale.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: sales.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { sales }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('items.item', 'name category pricing stock')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('referrer', 'name contact');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { sale }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sale',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private
const updateSale = async (req, res) => {
  try {
    let sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    // Check if sale can be updated
    if (sale.status === 'completed' || sale.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update completed or cancelled sale'
      });
    }

    // Update sale
    sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true }
    ).populate('items.item', 'name category');

    res.status(200).json({
      success: true,
      message: 'Sale updated successfully',
      data: { sale }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating sale',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    // Check if sale can be deleted
    if (sale.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete completed sale'
      });
    }

    // Restore stock for items
    for (const item of sale.items) {
      await Item.findByIdAndUpdate(
        item.item,
        { $inc: { 'stock.currentStock': item.quantity } }
      );
    }

    // Delete associated KOTs
    await KOT.deleteMany({ sale: sale._id });

    await Sale.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting sale',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get sales by date range
// @route   GET /api/sales/date-range
// @access  Private
const getSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const sales = await Sale.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .populate('items.item', 'name category')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sales.length,
      data: { sales }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales by date range',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get sales statistics
// @route   GET /api/sales/stats
// @access  Private
const getSalesStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Today's stats
    const todayStats = await Sale.aggregate([
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
      }
    ]);

    // This month's stats
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStats = await Sale.aggregate([
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

    // Top selling items
    const topItems = await Sale.aggregate([
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

    res.status(200).json({
      success: true,
      data: {
        today: todayStats[0] || {
          totalSales: 0,
          totalOrders: 0,
          cashSales: 0,
          cardSales: 0,
          upiSales: 0,
          creditSales: 0
        },
        month: monthStats[0] || {
          totalSales: 0,
          totalOrders: 0
        },
        topItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate bill for sale
// @route   POST /api/sales/:id/generate-bill
// @access  Private
const generateBill = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('items.item', 'name category pricing');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    // Update sale status
    sale.status = 'confirmed';
    sale.updatedBy = req.user.id;
    await sale.save();

    res.status(200).json({
      success: true,
      message: 'Bill generated successfully',
      data: { sale }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating bill',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Process payment for sale
// @route   POST /api/sales/:id/payment
// @access  Private
const processPayment = async (req, res) => {
  try {
    const { amountReceived, paymentMethod, transactionId } = req.body;

    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    // Calculate cash return
    const cashReturn = Math.max(0, amountReceived - sale.pricing.grandTotal);

    // Update payment details
    sale.payment.amountReceived = amountReceived;
    sale.payment.method = paymentMethod;
    sale.payment.transactionId = transactionId;
    sale.payment.cashReturn = cashReturn;
    sale.payment.paidAt = new Date();

    // Update payment status
    if (amountReceived >= sale.pricing.grandTotal) {
      sale.payment.status = 'paid';
      sale.status = 'completed';
    } else if (amountReceived > 0) {
      sale.payment.status = 'partial';
    }

    sale.updatedBy = req.user.id;
    await sale.save();

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: { 
        sale,
        cashReturn
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Refund sale
// @route   POST /api/sales/:id/refund
// @access  Private
const refundSale = async (req, res) => {
  try {
    const { refundAmount, reason } = req.body;

    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    if (sale.payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund paid sales'
      });
    }

    // Restore stock for items
    for (const item of sale.items) {
      await Item.findByIdAndUpdate(
        item.item,
        { $inc: { 'stock.currentStock': item.quantity } }
      );
    }

    // Update sale
    sale.payment.status = 'refunded';
    sale.status = 'cancelled';
    sale.notes = `${sale.notes || ''}\nRefund: ${reason}`;
    sale.updatedBy = req.user.id;
    await sale.save();

    res.status(200).json({
      success: true,
      message: 'Sale refunded successfully',
      data: { sale }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale,
  getSalesByDateRange,
  getSalesStats,
  generateBill,
  processPayment,
  refundSale
};