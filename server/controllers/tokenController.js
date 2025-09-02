const Token = require("../models/Token");
const Item = require("../models/itemModel");
const asyncHandler = require("express-async-handler");

// @desc    Get all tokens with filtering and pagination
// @route   GET /api/tokens
// @access  Private (token.view)
const getTokens = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    orderStatus,
    paymentStatus,
    orderType,
    startDate,
    endDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build query
  let query = { store: req.user.store, isActive: true };

  // Search functionality
  if (search) {
    query.$or = [
      { tokenNumber: { $regex: search, $options: "i" } },
      { "customerDetails.name": { $regex: search, $options: "i" } },
      { "customerDetails.mobile": { $regex: search, $options: "i" } },
    ];
  }

  // Apply filters
  if (orderStatus) query.orderStatus = orderStatus;
  if (paymentStatus) query["paymentDetails.status"] = paymentStatus;
  if (orderType) query.orderType = orderType;

  // Date range filter
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const startIndex = (pageNum - 1) * limitNum;

  // Sort
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  try {
    const tokens = await Token.find(query)
      .populate("orderItems.item", "productName priceDetails images")
      .populate("createdBy", "name")
      .sort(sort)
      .limit(limitNum)
      .skip(startIndex);

    const total = await Token.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tokens,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get single token
// @route   GET /api/tokens/:id
// @access  Private (token.view)
const getTokenById = asyncHandler(async (req, res) => {
  try {
    const token = await Token.findById(req.params.id)
      .populate("orderItems.item", "productName priceDetails images")
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .populate("servedBy", "name");

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }

    res.status(200).json({
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status, method, paidAmount, transactionId } = req.body;

  try {
    const token = await Token.findById(req.params.id);

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }

    const updateData = {
      "paymentDetails.status": status,
      "paymentDetails.method": method,
      "paymentDetails.paidAmount": paidAmount,
      "paymentDetails.transactionId": transactionId,
      "paymentDetails.paymentDate": new Date(),
      updatedBy: req.user._id,
    };

    const updatedToken = await Token.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedToken,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
// @desc    Create new token
// @route   POST /api/tokens
// @access  Private (token.create)
const createToken = asyncHandler(async (req, res) => {
  const {
    customerDetails,
    orderItems,
    orderType,
    priority,
    orderNotes,
    estimatedTime,
  } = req.body;

  try {
    // Validate items exist
    const itemIds = orderItems.map((item) => item.item);
    const items = await Item.find({ _id: { $in: itemIds } });

    if (items.length !== itemIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more items not found",
      });
    }

    // Process order items with current prices
    const processedOrderItems = orderItems.map((orderItem) => {
      const item = items.find(
        (i) => i._id.toString() === orderItem.item.toString()
      );
      const unitPrice = item.priceDetails?.sellingPrice || 0;
      const totalPrice = unitPrice * orderItem.quantity;

      return {
        item: orderItem.item,
        itemName: item.productName,
        quantity: orderItem.quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        specialInstructions: orderItem.specialInstructions || "",
      };
    });

    // Generate token
    const tokenData = await Token.generateNextTokenNumber(
      req.user.store || "MG Food Court"
    );

    const tokenPayload = {
      tokenNumber: tokenData.tokenNumber,
      serialNumber: tokenData.serialNumber,
      customerDetails,
      orderItems: processedOrderItems,
      orderType: orderType || "Takeaway",
      priority: priority || "Normal",
      orderNotes: orderNotes || "",
      estimatedTime: estimatedTime || 15,
      store: req.user.store || "MG Food Court",
      createdBy: req.user._id,
    };

    const token = await Token.create(tokenPayload);

    const populatedToken = await Token.findById(token._id)
      .populate("orderItems.item", "productName priceDetails")
      .populate("createdBy", "name");

    res.status(201).json({
      success: true,
      data: populatedToken,
      message: "Token created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update token (handles status, payment, cancellation, etc.)
// @route   PUT /api/tokens/:id
// @access  Private (token.update)
const updateToken = asyncHandler(async (req, res) => {
  try {
    let token = await Token.findById(req.params.id);

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }

    // Check if token can be updated
    if (
      token.orderStatus === "Delivered" ||
      token.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot update delivered or cancelled orders",
      });
    }

    const updateData = { ...req.body, updatedBy: req.user._id };

    // Handle order status changes
    if (req.body.orderStatus === "Delivered") {
      updateData.actualDeliveryTime = new Date();
      if (req.body.servedBy) {
        updateData.servedBy = req.body.servedBy;
      }
    }

    // Handle cancellation
    if (req.body.orderStatus === "Cancelled") {
      if (req.body.cancelReason) {
        updateData.orderNotes = `${token.orderNotes || ""}\nCancelled: ${
          req.body.cancelReason
        }`.trim();
      }
      // Handle payment refund if paid
      if (token.paymentDetails.paidAmount > 0) {
        updateData["paymentDetails.status"] = "Refunded";
      }
    }

    // Handle payment updates
    if (req.body.paymentDetails) {
      Object.assign(updateData, {
        "paymentDetails.status": req.body.paymentDetails.status,
        "paymentDetails.method": req.body.paymentDetails.method,
        "paymentDetails.paidAmount": req.body.paymentDetails.paidAmount,
        "paymentDetails.transactionId": req.body.paymentDetails.transactionId,
        "paymentDetails.paymentDate": new Date(),
      });
    }

    // Handle order items update
    if (req.body.orderItems) {
      const itemIds = req.body.orderItems.map((item) => item.item);
      const items = await Item.find({ _id: { $in: itemIds } });

      const processedOrderItems = req.body.orderItems.map((orderItem) => {
        const item = items.find(
          (i) => i._id.toString() === orderItem.item.toString()
        );
        const unitPrice = item.priceDetails?.sellingPrice || 0;
        const totalPrice = unitPrice * orderItem.quantity;

        return {
          item: orderItem.item,
          itemName: item.productName,
          quantity: orderItem.quantity,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          specialInstructions: orderItem.specialInstructions || "",
        };
      });

      updateData.orderItems = processedOrderItems;
    }

    token = await Token.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("orderItems.item", "productName priceDetails")
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .populate("servedBy", "name");

    res.status(200).json({
      success: true,
      data: token,
      message: "Token updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete token (soft delete)
// @route   DELETE /api/tokens/:id
// @access  Private (token.delete)
const deleteToken = asyncHandler(async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }

    await Token.findByIdAndUpdate(req.params.id, {
      isActive: false,
      updatedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Token deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get available items for token creation
// @route   GET /api/tokens/available-items
// @access  Private (token.view)
const getAvailableItems = asyncHandler(async (req, res) => {
  const { category, subCategory, search } = req.query;

  try {
    let query = { status: "active" };

    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (search) query.productName = { $regex: search, $options: "i" };

    const items = await Item.find(query)
      .populate("category", "name")
      .populate("subCategory", "name")
      .select("productName priceDetails images category subCategory")
      .sort({ productName: 1 });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  getTokens,
  getTokenById,
  createToken,
  updateToken,
  deleteToken,
  getAvailableItems,
  updatePaymentStatus,
};
