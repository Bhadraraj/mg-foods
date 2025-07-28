const Purchase = require('../models/Purchase');
const Item = require('../models/Item');
const Party = require('../models/Party');

// @desc    Create new purchase
// @route   POST /api/purchase
// @access  Private
const createPurchase = async (req, res) => {
  try {
    const {
      vendorId,
      invoiceNo,
      invoiceDate,
      items,
      pricing,
      taxType,
      billingType,
      purchaseType,
      notes
    } = req.body;

    // Validate vendor
    const vendor = await Party.findOne({ _id: vendorId, type: 'vendor' });
    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Process items and calculate totals
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

      const itemTotal = item.quantity * item.price;
      const taxAmount = (itemTotal * (item.taxPercentage || 0)) / 100;
      
      calculatedSubTotal += itemTotal;

      processedItems.push({
        item: item.itemId,
        itemName: dbItem.name,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
        taxPercentage: item.taxPercentage || 0,
        taxAmount
      });

      // Update item stock if purchase is confirmed
      if (req.body.autoUpdateStock) {
        dbItem.stock.currentStock += item.quantity;
        await dbItem.save();
      }
    }

    // Create purchase
    const purchase = await Purchase.create({
      vendor: vendorId,
      invoiceNo,
      invoiceDate,
      items: processedItems,
      pricing: {
        ...pricing,
        subTotal: calculatedSubTotal
      },
      taxType: taxType || 'SGST+CGST',
      billingType: billingType || 'GST',
      purchaseType: purchaseType || 'sales',
      notes,
      createdBy: req.user.id
    });

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('vendor', 'name contact business')
      .populate('items.item', 'name category')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: { purchase: populatedPurchase }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating purchase',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all purchases with pagination and filtering
// @route   GET /api/purchase
// @access  Private
const getPurchases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    if (req.query.fulfillmentStatus) filter.fulfillmentStatus = req.query.fulfillmentStatus;
    if (req.query.vendor) filter.vendor = req.query.vendor;
    if (req.query.billingType) filter.billingType = req.query.billingType;
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.invoiceDate = {};
      if (req.query.startDate) filter.invoiceDate.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.invoiceDate.$lte = new Date(req.query.endDate);
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { purchaseId: { $regex: req.query.search, $options: 'i' } },
        { invoiceNo: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const purchases = await Purchase.find(filter)
      .populate('vendor', 'name contact business')
      .populate('items.item', 'name category')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Purchase.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: purchases.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { purchases }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching purchases',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single purchase
// @route   GET /api/purchase/:id
// @access  Private
const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('vendor', 'name contact business')
      .populate('items.item', 'name category pricing stock')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { purchase }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update purchase
// @route   PUT /api/purchase/:id
// @access  Private
const updatePurchase = async (req, res) => {
  try {
    let purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Check if purchase can be updated
    if (purchase.status === 'received' || purchase.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update received or cancelled purchase'
      });
    }

    purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true }
    )
    .populate('vendor', 'name contact')
    .populate('items.item', 'name category');

    res.status(200).json({
      success: true,
      message: 'Purchase updated successfully',
      data: { purchase }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating purchase',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete purchase
// @route   DELETE /api/purchase/:id
// @access  Private
const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Check if purchase can be deleted
    if (purchase.status === 'received') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete received purchase'
      });
    }

    await Purchase.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Purchase deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting purchase',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update purchase status
// @route   PUT /api/purchase/:id/status
// @access  Private
const updatePurchaseStatus = async (req, res) => {
  try {
    const { status, paymentStatus, fulfillmentStatus } = req.body;

    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Update status
    if (status) purchase.status = status;
    if (paymentStatus) purchase.paymentStatus = paymentStatus;
    if (fulfillmentStatus) purchase.fulfillmentStatus = fulfillmentStatus;
    
    purchase.updatedBy = req.user.id;

    // If status is received, update item stocks
    if (status === 'received') {
      for (const item of purchase.items) {
        await Item.findByIdAndUpdate(
          item.item,
          { $inc: { 'stock.currentStock': item.quantity } }
        );
      }
    }

    await purchase.save();

    res.status(200).json({
      success: true,
      message: 'Purchase status updated successfully',
      data: { purchase }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating purchase status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get purchase statistics
// @route   GET /api/purchase/stats
// @access  Private
const getPurchaseStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Monthly stats
    const monthlyStats = await Purchase.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: '$pricing.grandTotal' },
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'draft'] }, 1, 0]
            }
          },
          receivedOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'received'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Vendor wise stats
    const vendorStats = await Purchase.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$vendor',
          totalAmount: { $sum: '$pricing.grandTotal' },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'parties',
          localField: '_id',
          foreignField: '_id',
          as: 'vendorDetails'
        }
      },
      { $unwind: '$vendorDetails' },
      {
        $project: {
          vendorName: '$vendorDetails.name',
          totalAmount: 1,
          totalOrders: 1
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthly: monthlyStats[0] || {
          totalPurchases: 0,
          totalOrders: 0,
          pendingOrders: 0,
          receivedOrders: 0
        },
        topVendors: vendorStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createPurchase,
  getPurchases,
  getPurchase,
  updatePurchase,
  deletePurchase,
  updatePurchaseStatus,
  getPurchaseStats
};