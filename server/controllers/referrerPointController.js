const mongoose = require("mongoose");
const ReferrerPoint = require("../models/ReferrerPoint");
const Customer = require("../models/Customer");
const Referrer = require("../models/Referrer"); 
const asyncHandler = require("express-async-handler");

// @desc    Get all referrer points with pagination and filters
// @route   GET /api/referrer-points
// @access  Private
const getReferrerPoints = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    transactionType,
    referrerId,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build filter object
  const filter = { store: req.user.store };

  // Search functionality (by referrer name or phone)
  if (search) {
    const customers = await Customer.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const customerIds = customers.map((customer) => customer._id);
    filter.referrer = { $in: customerIds };
  }

  // Status filter
  if (status) {
    filter.status = status;
  }

  // Transaction type filter
  if (transactionType) {
    filter.transactionType = transactionType;
  }

  // Specific referrer filter
  if (referrerId) {
    filter.referrer = referrerId;
  }

  // Execute query with pagination
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
  };

  try {
    const referrerPoints = await ReferrerPoint.find(filter)
      .populate("referrer", "name phone email")
      .populate("referred", "name phone email")
      .populate("orderId", "orderNumber totalAmount")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .exec();

    const total = await ReferrerPoint.countDocuments(filter);

    res.json({
      success: true,
      data: referrerPoints,
      pagination: {
        current: options.page,
        pages: Math.ceil(total / options.limit),
        total,
        limit: options.limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching referrer points",
      error: error.message,
    });
  }
});

// @desc    Get referrer points summary
// @route   GET /api/referrer-points/summary
// @access  Private
const getReferrerPointsSummary = asyncHandler(async (req, res) => {
  try {
    const summary = await ReferrerPoint.aggregate([
      {
        $match: {
          store: req.user.store,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "referrer",
          foreignField: "_id",
          as: "referrerInfo",
        },
      },
      {
        $unwind: "$referrerInfo",
      },
      {
        $group: {
          _id: "$referrer",
          customerName: { $first: "$referrerInfo.name" },
          customerPhone: { $first: "$referrerInfo.phone" },
          commissionPoints: {
            $sum: {
              $cond: [
                { $eq: ["$transactionType", "Referral Commission"] },
                "$pointsEarned",
                0,
              ],
            },
          },
          yearlyPoints: {
            $sum: {
              $cond: [
                { $eq: ["$transactionType", "Yearly Bonus"] },
                "$pointsEarned",
                0,
              ],
            },
          },
          totalPoints: { $sum: "$pointsEarned" },
          balancePoints: { $sum: "$balancePoints" },
        },
      },
      {
        $sort: { totalPoints: -1 },
      },
    ]);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching referrer points summary",
      error: error.message,
    });
  }
});

// @desc    Get single referrer point record
// @route   GET /api/referrer-points/:id
// @access  Private
const getReferrerPointById = asyncHandler(async (req, res) => {
  const referrerPoint = await ReferrerPoint.findById(req.params.id)
    .populate("referrer", "name phone email")
    .populate("referred", "name phone email")
    .populate("orderId", "orderNumber totalAmount")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!referrerPoint) {
    return res.status(404).json({
      success: false,
      message: "Referrer point record not found",
    });
  }

  res.json({
    success: true,
    data: referrerPoint,
  });
});

// @desc    Create new referrer point record (manual adjustment)
// @route   POST /api/referrer-points
// @access  Private
// @desc    Create new referrer point record (manual adjustment)
// @route   POST /api/referrer-points
// @access  Private
const createReferrerPoint = asyncHandler(async (req, res) => {
  try {
    const {
      referrerId,
      commissionType,
      commissionValue,
      pointsEarned,
      transactionType = "Manual Adjustment",
      description,
      expiryDate,
    } = req.body;

    // Validate referrer exists
    const referrer = await Referrer.findById(referrerId);
    if (!referrer) {
      return res.status(400).json({
        success: false,
        message: "Referrer not found",
      });
    }

    const referrerPointData = {
      store: req.user.store, // Now works as string (e.g., "MG Food Court")
      referrer: referrerId,
      commissionType,
      commissionValue,
      pointsEarned,
      transactionType,
      description,
      expiryDate,
      createdBy: req.user._id,
    };

    const referrerPoint = await ReferrerPoint.create(referrerPointData);

    // Populate the created record
    await referrerPoint.populate([
      { path: "referrer", select: "name mobileNumber" },
      { path: "createdBy", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      data: referrerPoint,
      message: "Referrer point record created successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating referrer point record",
      error: error.message,
    });
  }
});

// @desc    Update referrer point record
// @route   PUT /api/referrer-points/:id
// @access  Private
const updateReferrerPoint = asyncHandler(async (req, res) => {
  try {
    const referrerPoint = await ReferrerPoint.findById(req.params.id);

    if (!referrerPoint) {
      return res.status(404).json({
        success: false,
        message: "Referrer point record not found",
      });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        referrerPoint[key] = req.body[key];
      }
    });

    referrerPoint.updatedBy = req.user._id;

    await referrerPoint.save();

    // Populate the updated record
    await referrerPoint.populate([
      { path: "referrer", select: "name phone email" },
      { path: "referred", select: "name phone email" },
      { path: "createdBy", select: "name email" },
      { path: "updatedBy", select: "name email" },
    ]);

    res.json({
      success: true,
      data: referrerPoint,
      message: "Referrer point record updated successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating referrer point record",
      error: error.message,
    });
  }
});

// @desc    Delete referrer point record
// @route   DELETE /api/referrer-points/:id
// @access  Private
const deleteReferrerPoint = asyncHandler(async (req, res) => {
  const referrerPoint = await ReferrerPoint.findById(req.params.id);

  if (!referrerPoint) {
    return res.status(404).json({
      success: false,
      message: "Referrer point record not found",
    });
  }

  await referrerPoint.deleteOne();

  res.json({
    success: true,
    message: "Referrer point record deleted successfully",
  });
});

// @desc    Redeem referrer points
// @route   POST /api/referrer-points/redeem
// @access  Private
const redeemReferrerPoints = asyncHandler(async (req, res) => {
    try {
        const { referrerId, pointsToRedeem, description } = req.body;

        // First, validate that the referrer exists
        const referrer = await Referrer.findById(referrerId);
        if (!referrer) {
            return res.status(400).json({
                success: false,
                message: 'Referrer not found'
            });
        }

        // Debug: Check if there are any points records for this referrer
        const allPointsRecords = await ReferrerPoint.find({
            store: req.user.store,
            referrer: referrerId
        });

        console.log('Debug - All points records for referrer:', allPointsRecords);

        // Get referrer's current balance
        const summary = await ReferrerPoint.getReferrerSummary(req.user.store, referrerId);
        
        console.log('Debug - Referrer summary:', summary);
        console.log('Debug - Points to redeem:', pointsToRedeem);
        console.log('Debug - Total balance:', summary.totalBalance);

        // Check if summary exists and has balance
        if (!summary || typeof summary.totalBalance !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Unable to calculate points balance. Referrer may not have any points.'
            });
        }
        
        if (summary.totalBalance < pointsToRedeem) {
            return res.status(400).json({
                success: false,
                message: `Insufficient points balance. Available: ${summary.totalBalance}, Requested: ${pointsToRedeem}`
            });
        }

        // Create redemption record
        const redemption = await ReferrerPoint.create({
            store: req.user.store,
            referrer: referrerId,
            commissionType: 'Fixed Amount',
            commissionValue: 0,
            pointsEarned: 0,
            pointsRedeemed: pointsToRedeem,
            transactionType: 'Redemption',
            description: description || 'Points redemption',
            createdBy: req.user._id
        });

        await redemption.populate([
            { path: 'referrer', select: 'name mobileNumber' },
            { path: 'createdBy', select: 'name email' }
        ]);

        res.status(201).json({
            success: true,
            data: redemption,
            message: 'Points redeemed successfully'
        });
    } catch (error) {
        console.error('Error in redeemReferrerPoints:', error);
        res.status(500).json({
            success: false,
            message: 'Error redeeming points',
            error: error.message
        });
    }
});

// @desc    Get referrer options for dropdowns
// @route   GET /api/referrer-points/options
// @access  Private
const getReferrerPointOptions = asyncHandler(async (req, res) => {
  const commissionTypes = ["Percentage", "Fixed Amount"];
  const transactionTypes = [
    "Referral Commission",
    "Manual Adjustment",
    "Redemption",
    "Yearly Bonus",
  ];
  const statusOptions = ["Active", "Pending", "Expired", "Redeemed"];

  // Get all referrers (customers who have made referrals)
  const referrers = await Customer.find({
    store: req.user.store,
    isActive: true,
  })
    .select("_id name phone")
    .sort({ name: 1 });

  res.json({
    success: true,
    data: {
      commissionTypes,
      transactionTypes,
      statusOptions,
      referrers,
    },
  });
});

// @desc    Get customer transactions
// @route   GET /api/referrer-points/customer/:customerId
// @access  Private
const getCustomerTransactions = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const transactions = await ReferrerPoint.find({
    store: req.user.store,
    referrer: customerId,
  })
    .populate("referred", "name phone")
    .populate("orderId", "orderNumber totalAmount")
    .sort({ createdAt: -1 });

  const summary = await ReferrerPoint.getReferrerSummary(
    req.user.store,
    customerId
  );

  res.json({
    success: true,
    data: {
      transactions,
      summary,
    },
  });
});

module.exports = {
  getReferrerPoints,
  getReferrerPointsSummary,
  getReferrerPointById,
  createReferrerPoint,
  updateReferrerPoint,
  deleteReferrerPoint,
  redeemReferrerPoints,
  getReferrerPointOptions,
  getCustomerTransactions,
};
