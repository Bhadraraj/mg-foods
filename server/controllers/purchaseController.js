const Purchase = require("../models/purchaseModel");
const Item = require("../models/itemModel");
const Vendor = require("../models/vendorModel");
const Brand = require("../models/Brand");
const asyncHandler = require("express-async-handler");
const Rack = require("../models/rackModel");
 
const getPurchases = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    vendor,
    brand,
    status,
    paymentStatus,
    dateFrom,
    dateTo,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build query
  let query = { store: req.user.store };

  // Search functionality
  if (search) {
    query.$or = [
      { purchaseId: { $regex: search, $options: "i" } },
      { invoiceNumber: { $regex: search, $options: "i" } },
      { vendorName: { $regex: search, $options: "i" } },
      { uid: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by vendor
  if (vendor) {
    query.vendor = vendor;
  }

  // Filter by brand
  if (brand) {
    query.brand = brand;
  }

  // Filter by status
  if (status) {
    const [statusType, statusValue] = status.split(".");
    if (statusType && statusValue) {
      query[`status.${statusType}`] = statusValue;
    }
  }

  // Filter by payment status
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  // Date range filter
  if (dateFrom || dateTo) {
    query.invoiceDate = {};
    if (dateFrom) query.invoiceDate.$gte = new Date(dateFrom);
    if (dateTo) query.invoiceDate.$lte = new Date(dateTo);
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const startIndex = (pageNum - 1) * limitNum;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  try {
    const purchases = await Purchase.find(query)
      .populate("vendor", "name email phone")
      .populate("brand", "name")
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .sort(sort)
      .limit(limitNum)
      .skip(startIndex)
      .lean();

    const total = await Purchase.countDocuments(query);

    res.status(200).json({
      success: true,
      data: purchases,
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
 
const getPurchaseById = asyncHandler(async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("vendor", "name email phone address")
      .populate("brand", "name description")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("items.product", "name category subCategory")
      .populate("items.rackAssignments.rack", "name location")
      .populate("stockEntryDetails.entryBy", "name");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema({
  // Keep your existing fields
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  total: {
    type: Number,
    required: true,
    min: [0, "Total cannot be negative"],
  },
  taxPercentage: {
    type: Number,
    default: 0,
    min: [0, "Tax percentage cannot be negative"],
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, "Tax amount cannot be negative"],
  },
  // ADD THE MISSING FIELDS THAT CONTROLLER EXPECTS
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  hsn: {
    type: String,
    required: [true, "HSN code is required"],
  },
  poQty: {
    type: Number,
    required: [true, "PO quantity is required"],
    min: [1, "PO quantity must be at least 1"],
  },
  piQty: {
    type: Number,
    default: function () {
      return this.poQty;
    },
  },
  invQty: {
    type: Number,
    default: function () {
      return this.piQty || this.poQty;
    },
  },
  receivedQty: {
    type: Number,
    default: 0,
  },
  purchasePrice: {
    type: Number,
    required: [true, "Purchase price is required"],
    min: [0, "Purchase price cannot be negative"],
  },
  mrp: {
    type: Number,
    required: [true, "MRP is required"],
    min: [0, "MRP cannot be negative"],
  },
  retailPrice: {
    type: Number,
    default: 0,
  },
  wholesalePrice: {
    type: Number,
    default: 0,
  },
  estimationPrice: {
    type: Number,
    default: 0,
  },
  quotationPrice: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    default: "Pcs",
  },
  description: String,
  discount: {
    type: Number,
    default: 0,
  },
  taxType: {
    type: String,
    enum: ["IGST", "SGST+CGST"],
    default: "SGST+CGST",
  },
  cgst: {
    type: Number,
    default: 0,
  },
  sgst: {
    type: Number,
    default: 0,
  },
  igst: {
    type: Number,
    default: 0,
  },
  taxableAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  rackAssignments: [
    {
      rack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rack",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  printSelected: {
    type: Boolean,
    default: false,
  },
  scanCode: String,
});

const purchaseSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: String,
      unique: true,
      // NOT required since it's auto-generated
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: [true, "Vendor is required"],
    },
    vendorName: {
      type: String,
      // Made optional since controller sets it
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    brandName: {
      type: String,
    },
    invoiceNo: {
      type: String,
      required: [true, "Invoice number is required"],
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      // Create getter that returns invoiceNo if invoiceNumber is empty
      get: function () {
        return this.invoiceNo || this._doc.invoiceNumber;
      },
      set: function (value) {
        if (value) {
          this.invoiceNo = value;
        }
        return value;
      },
    },
    invoiceDate: {
      type: Date,
      required: [true, "Invoice date is required"],
    },
    expectedDeliveryDate: {
      type: Date,
    },
    uid: {
      type: String,
    },
    items: [purchaseItemSchema],
    pricing: {
      subTotal: {
        type: Number,
        required: true,
        min: [0, "Subtotal cannot be negative"],
      },
      taxAmount: {
        type: Number,
        default: 0,
        min: [0, "Tax amount cannot be negative"],
      },
      discountAmount: {
        type: Number,
        default: 0,
        min: [0, "Discount amount cannot be negative"],
      },
      roundOff: {
        type: Number,
        default: 0,
      },
      grandTotal: {
        type: Number,
        required: true,
        min: [0, "Grand total cannot be negative"],
      },
    },
    taxType: {
      type: String,
      enum: ["IGST", "SGST+CGST"],
      default: "SGST+CGST",
    },
    billingType: {
      type: String,
      enum: ["GST", "Non-GST"],
      default: "GST",
    },
    purchaseType: {
      type: String,
      enum: ["sales", "recipe", "purchase"], // ADD 'purchase'
      default: "purchase", // CHANGE default
    },
    status: {
      type: String,
      enum: ["draft", "confirmed", "received", "cancelled"],
      default: "draft",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    fulfillmentStatus: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    }, 
    poSummary: {
      totalTaxableAmount: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 },
      netTotal: { type: Number, default: 0 },
      roundOff: { type: Number, default: 0 },
    },
    piSummary: {
      totalTaxableAmount: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 },
      netTotal: { type: Number, default: 0 },
      roundOff: { type: Number, default: 0 },
    },
    invoiceSummary: {
      totalTaxableAmount: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 },
      netTotal: { type: Number, default: 0 },
      roundOff: { type: Number, default: 0 },
    },
    stockEntryDetails: {
      entryDate: Date,
      entryBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      notes: String,
    },
    fulfillmentDetails: {
      actualDeliveryDate: Date,
      deliveryNotes: String,
    },
    rackAssignmentDetails: {
      completedDate: Date,
      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      notes: String,
    },
    ledgerEntries: [
      {
        account: {
          type: String,
          enum: [
            "Sales",
            "Purchase",
            "Service",
            "Asset",
            "Liability",
            "Expense",
            "Income",
          ],
        },
        type: {
          type: String,
          enum: ["debit", "credit"],
        },
        amount: Number,
        description: String,
      },
    ],
    notes: String,
    store: {
      type: String,
      default: "MG Food Court",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
); 
purchaseSchema.pre("save", async function (next) {
  try {
    // Handle invoiceNumber/invoiceNo sync
    if (this.invoiceNumber && !this.invoiceNo) {
      this.invoiceNo = this.invoiceNumber;
    }

    // Only generate purchaseId for new documents that don't have one
    if (!this.purchaseId && this.isNew) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      const prefix = "PUR";
      const dateStr = `${year}${month}${day}`;

      try {
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const lastPurchase = await this.constructor
          .findOne({
            purchaseId: { $regex: `^${prefix}${dateStr}` },
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          })
          .sort({ purchaseId: -1 })
          .exec();

        let sequence = 1;
        if (lastPurchase && lastPurchase.purchaseId) {
          const lastSequence = parseInt(lastPurchase.purchaseId.slice(-4));
          if (!isNaN(lastSequence)) {
            sequence = lastSequence + 1;
          }
        }

        this.purchaseId = `${prefix}${dateStr}${String(sequence).padStart(
          4,
          "0"
        )}`;
      } catch (error) {
        console.error("Error generating purchaseId:", error);
        const timestamp = Date.now().toString().slice(-6);
        this.purchaseId = `${prefix}${dateStr}${timestamp}`;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Index for better performance
purchaseSchema.index({ purchaseId: 1 });
purchaseSchema.index({ vendor: 1 });
purchaseSchema.index({ invoiceDate: -1 });
purchaseSchema.index({ status: 1, paymentStatus: 1 });
purchaseSchema.index({ store: 1 }); 

const createPurchase = asyncHandler(async (req, res) => {
  try {
    console.log("=== DEBUG: Starting purchase creation ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    // Validate required fields first
    if (!req.body.vendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID is required",
      });
    }

    if (
      !req.body.items ||
      !Array.isArray(req.body.items) ||
      req.body.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required",
      });
    }

    // Validate vendor exists
    const vendor = await Vendor.findById(req.body.vendor);
    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Validate and get brand if provided
    let brandData = null;
    if (req.body.brand) {
      brandData = await Brand.findById(req.body.brand);
      if (!brandData) {
        return res.status(400).json({
          success: false,
          message: "Brand not found",
        });
      }
    }

    // Get item details for validation and auto-population
    const itemDetails = {};
    for (const item of req.body.items) {
      const itemId = item.item || item.product;
      if (itemId) {
        try {
          const itemDoc = await Item.findById(itemId);
          if (itemDoc) {
            itemDetails[itemId] = itemDoc;
          }
        } catch (error) {
          console.log(`Could not fetch item ${itemId}:`, error.message);
        }
      }
    }

    // Prepare purchase data with safe defaults
    const purchaseData = {
      // Required fields
      vendor: req.body.vendor,
      vendorName: vendor.name || "Unknown Vendor",

      // Invoice information
      invoiceNo:
        req.body.invoiceNo || req.body.invoiceNumber || `INV-${Date.now()}`,
      invoiceNumber:
        req.body.invoiceNumber || req.body.invoiceNo || `INV-${Date.now()}`,
      invoiceDate: req.body.invoiceDate
        ? new Date(req.body.invoiceDate)
        : new Date(),

      // Optional brand
      ...(req.body.brand && { brand: req.body.brand }),
      ...(brandData && { brandName: brandData.name }),

      // Optional fields
      expectedDeliveryDate: req.body.expectedDeliveryDate
        ? new Date(req.body.expectedDeliveryDate)
        : null,
      uid: req.body.uid || null,
      notes: req.body.notes || "",

      // Process and validate items
      items: req.body.items.map((item, index) => {
        const itemId = item.item || item.product;
        const itemDoc = itemDetails[itemId];

        // Validate required item fields
        if (!itemId) {
          throw new Error(`Item ${index + 1}: Item ID is required`);
        }
        if (!item.quantity || item.quantity <= 0) {
          throw new Error(`Item ${index + 1}: Valid quantity is required`);
        }
        if (!item.price && !item.purchasePrice) {
          throw new Error(`Item ${index + 1}: Price is required`);
        }

        const price = item.price || item.purchasePrice || 0;
        const quantity = item.quantity || 1;
        const total = item.total || price * quantity;
        const taxPercentage = item.taxPercentage || 0;
        const taxAmount = item.taxAmount || (total * taxPercentage) / 100;

        return {
          // IDs (both for compatibility)
          item: itemId,
          product: itemId,

          // Names
          itemName:
            item.itemName ||
            item.productName ||
            (itemDoc ? itemDoc.name : "Unknown Item"),
          productName:
            item.productName ||
            item.itemName ||
            (itemDoc ? itemDoc.name : "Unknown Item"),

          // Quantities
          quantity: quantity,
          poQty: item.poQty || quantity,
          piQty: item.piQty || item.poQty || quantity,
          invQty: item.invQty || item.piQty || item.poQty || quantity,
          receivedQty: item.receivedQty || 0,

          // Prices
          price: price,
          purchasePrice: item.purchasePrice || price,
          mrp: item.mrp || price * 1.2 || 100,
          retailPrice: item.retailPrice || 0,
          wholesalePrice: item.wholesalePrice || 0,
          estimationPrice: item.estimationPrice || 0,
          quotationPrice: item.quotationPrice || 0,

          // Financial calculations
          total: total,
          taxPercentage: taxPercentage,
          taxAmount: taxAmount,
          discount: item.discount || 0,
          taxableAmount: item.taxableAmount || total - (item.discount || 0),
          totalAmount: item.totalAmount || total + taxAmount,

          // Tax details
          taxType: item.taxType || "SGST+CGST",
          cgst: item.cgst || 0,
          sgst: item.sgst || 0,
          igst: item.igst || 0,

          // Additional info
          hsn: item.hsn || (itemDoc ? itemDoc.hsn : "00000000"),
          unit: item.unit || "Pcs",
          description: item.description || "",

          // Rack assignments
          rackAssignments: item.rackAssignments || [],
          printSelected: item.printSelected || false,
          scanCode: item.scanCode || null,
        };
      }),

      // Pricing summary - calculate from items or use provided
      pricing: (() => {
        if (req.body.pricing) {
          return {
            subTotal: req.body.pricing.subTotal || 0,
            taxAmount: req.body.pricing.taxAmount || 0,
            discountAmount: req.body.pricing.discountAmount || 0,
            roundOff: req.body.pricing.roundOff || 0,
            grandTotal: req.body.pricing.grandTotal || 0,
          };
        } else {
          // Calculate from items
          const subTotal = req.body.items.reduce(
            (sum, item) => sum + (item.total || 0),
            0
          );
          const taxAmount = req.body.items.reduce(
            (sum, item) => sum + (item.taxAmount || 0),
            0
          );
          const grandTotal = subTotal + taxAmount;

          return {
            subTotal: subTotal,
            taxAmount: taxAmount,
            discountAmount: 0,
            roundOff: 0,
            grandTotal: grandTotal,
          };
        }
      })(),

      // Type and status fields with safe defaults
      taxType: req.body.taxType || "SGST+CGST",
      billingType: req.body.billingType || "GST",
      purchaseType: req.body.purchaseType || "purchase",
      status: req.body.status || "draft",
      paymentStatus: req.body.paymentStatus || "pending",
      fulfillmentStatus: req.body.fulfillmentStatus || "pending",

      // Summary objects with defaults
      poSummary: req.body.poSummary || {
        totalTaxableAmount: 0,
        totalTax: 0,
        netTotal: 0,
        roundOff: 0,
      },
      piSummary: req.body.piSummary || {
        totalTaxableAmount: 0,
        totalTax: 0,
        netTotal: 0,
        roundOff: 0,
      },
      invoiceSummary: req.body.invoiceSummary || {
        totalTaxableAmount: 0,
        totalTax: 0,
        netTotal: 0,
        roundOff: 0,
      },

      // System fields
      store: req.user?.store || "MG Food Court",
      createdBy: req.user?._id,
    };

    console.log("=== DEBUG: Final purchase data ===");
    console.log(JSON.stringify(purchaseData, null, 2));

    // Create the purchase
    const purchase = await Purchase.create(purchaseData);

    console.log("=== DEBUG: Purchase created successfully ===");
    console.log("Generated purchaseId:", purchase.purchaseId);

    // Populate and return
    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate("vendor", "name email phone")
      .populate("brand", "name")
      .populate("createdBy", "name")
      .lean();

    res.status(201).json({
      success: true,
      data: populatedPurchase,
      message: "Purchase created successfully",
    });
  } catch (error) {
    console.error("=== DEBUG: Purchase creation error ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    // Handle different error types
    if (error.name === "ValidationError") {
      console.error("Validation errors:", error.errors);
      const errors = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message,
        value: err.value,
        kind: err.kind,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.map((e) => `${e.path}: ${e.message}`),
        details: errors,
      });
    }

    if (error.code === 11000) {
      console.error("Duplicate key error:", error.keyPattern);
      return res.status(400).json({
        success: false,
        message:
          "Duplicate key error - Purchase ID or invoice number already exists",
      });
    }

    if (error.message.includes("Item") && error.message.includes(":")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        error.message || "Internal server error during purchase creation",
    });
  }
});
 
const updatePurchase = asyncHandler(async (req, res) => {
  try {
    let purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Check store ownership
    if (purchase.store !== req.user.store) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this purchase",
      });
    }

    // Validate vendor if being updated
    if (req.body.vendor && req.body.vendor !== purchase.vendor.toString()) {
      const vendor = await Vendor.findById(req.body.vendor);
      if (!vendor) {
        return res.status(400).json({
          success: false,
          message: "Vendor not found",
        });
      }
      req.body.vendorName = vendor.name;
    }

    // Validate brand if being updated
    if (req.body.brand && req.body.brand !== purchase.brand?.toString()) {
      const brand = await Brand.findById(req.body.brand);
      if (!brand) {
        return res.status(400).json({
          success: false,
          message: "Brand not found",
        });
      }
      req.body.brandName = brand.name;
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user._id,
    };

    purchase = await Purchase.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("vendor", "name email phone")
      .populate("brand", "name")
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    res.status(200).json({
      success: true,
      data: purchase,
      message: "Purchase updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const deletePurchase = asyncHandler(async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Check store ownership
    if (purchase.store !== req.user.store) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this purchase",
      });
    }

    // Check if purchase can be deleted (only if no stock entries completed)
    if (purchase.status.stockEntry === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete purchase with completed stock entries",
      });
    }

    await Purchase.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const updatePurchaseStatus = asyncHandler(async (req, res) => {
  const { statusType, statusValue } = req.body;

  if (!statusType || !statusValue) {
    return res.status(400).json({
      success: false,
      message: "Status type and value are required",
    });
  }

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Update specific status
    purchase.status[statusType] = statusValue;
    purchase.updatedBy = req.user._id;

    await purchase.save();

    res.status(200).json({
      success: true,
      data: purchase.status,
      message: "Purchase status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}); 
const completeStockEntry = asyncHandler(async (req, res) => {
  const { items, notes } = req.body;

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Update item quantities and rack assignments
    if (items && Array.isArray(items)) {
      items.forEach((updatedItem) => {
        const purchaseItem = purchase.items.id(updatedItem.itemId);
        if (purchaseItem) {
          purchaseItem.receivedQty =
            updatedItem.receivedQty || purchaseItem.poQty;
          purchaseItem.invQty = updatedItem.invQty || purchaseItem.receivedQty;

          if (updatedItem.rackAssignments) {
            purchaseItem.rackAssignments = updatedItem.rackAssignments;
          }

          if (updatedItem.printSelected !== undefined) {
            purchaseItem.printSelected = updatedItem.printSelected;
          }

          if (updatedItem.scanCode) {
            purchaseItem.scanCode = updatedItem.scanCode;
          }
        }
      });
    }

    // Update stock entry details
    purchase.stockEntryDetails = {
      entryDate: new Date(),
      entryBy: req.user._id,
      notes: notes || "",
    };

    // Update status
    purchase.status.stockEntry = "Completed";
    purchase.status.fulfillment = "Completed";
    purchase.updatedBy = req.user._id;

    await purchase.save();

    // Update inventory quantities for items
    for (const item of purchase.items) {
      if (item.product && item.receivedQty > 0) {
        await Item.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.receivedQty },
        });
      }
    }

    const updatedPurchase = await Purchase.findById(req.params.id).populate(
      "stockEntryDetails.entryBy",
      "name"
    );

    res.status(200).json({
      success: true,
      data: updatedPurchase,
      message: "Stock entry completed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const addProductsToRack = asyncHandler(async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({
      success: false,
      message: "Products array is required",
    });
  }

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Create new products and add them to purchase
    const newItems = [];

    for (const productData of products) {
      // Create new item if it doesn't exist
      let item = await Item.findOne({
        name: productData.name,
        store: req.user.store,
      });

      if (!item) {
        item = await Item.create({
          name: productData.name,
          category: productData.category,
          sellPrice: productData.sellPrice || 0,
          purchasePrice: productData.purchasePrice || 0,
          hsn: productData.hsn || "",
          store: req.user.store,
          createdBy: req.user._id,
        });
      }

      // Add to purchase items
      const purchaseItem = {
        product: item._id,
        productName: item.name,
        mrp: productData.mrp || productData.sellPrice || 0,
        purchasePrice: productData.purchasePrice || 0,
        retailPrice: productData.retailPrice || 0,
        wholesalePrice: productData.wholesalePrice || 0,
        estimationPrice: productData.estimationPrice || 0,
        quotationPrice: productData.quotationPrice || 0,
        poQty: productData.quantity || 1,
        piQty: productData.quantity || 1,
        invQty: productData.quantity || 1,
        hsn: productData.hsn || "",
        unit: productData.unit || "Pcs",
        description: productData.description || "",
        rackAssignments: productData.rackAssignments || [],
      };

      newItems.push(purchaseItem);
    }

    // Add new items to purchase
    purchase.items.push(...newItems);
    purchase.updatedBy = req.user._id;

    await purchase.save();

    res.status(200).json({
      success: true,
      data: purchase,
      message: `${newItems.length} products added successfully`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const getPurchaseStats = asyncHandler(async (req, res) => {
  try {
    const stats = await Purchase.aggregate([
      { $match: { store: req.user.store } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalValue: { $sum: "$poSummary.netTotal" },
          pendingPO: {
            $sum: {
              $cond: [{ $eq: ["$status.po", "Pending"] }, 1, 0],
            },
          },
          completedPurchases: {
            $sum: {
              $cond: [{ $eq: ["$status.stockEntry", "Completed"] }, 1, 0],
            },
          },
          pendingPayments: {
            $sum: {
              $cond: [
                { $ne: ["$paymentStatus", "Completed"] },
                "$poSummary.netTotal",
                0,
              ],
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalPurchases: 0,
      totalValue: 0,
      pendingPO: 0,
      completedPurchases: 0,
      pendingPayments: 0,
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const getAvailableItems = asyncHandler(async (req, res) => {
  const { search = "", category, brand } = req.query;

  try {
    let query = {
      store: req.user.store,
      isActive: true,
    };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { hsn: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by brand
    if (brand) {
      query.brand = brand;
    }

    const items = await Item.find(query)
      .select(
        "name sellPrice purchasePrice hsn category subCategory brand quantity"
      )
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name")
      .limit(50)
      .sort({ name: 1 });

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
 
const getVendorsForPurchase = asyncHandler(async (req, res) => {
  try {
    const vendors = await Vendor.find({
      store: req.user.store,
      isActive: true,
    })
      .select("name email phone address")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const getBrandsForPurchase = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find({
      store: req.user.store,
      isActive: true,
    })
      .select("name description")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return res.status(400).json({
      success: false,
      message: "Payment status is required",
    });
  }

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    purchase.paymentStatus = paymentStatus;
    purchase.updatedBy = req.user._id;

    await purchase.save();

    res.status(200).json({
      success: true,
      data: { paymentStatus: purchase.paymentStatus },
      message: "Payment status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}); 
const updateLedgerEntries = asyncHandler(async (req, res) => {
  const { ledgerEntries } = req.body;

  if (!ledgerEntries || !Array.isArray(ledgerEntries)) {
    return res.status(400).json({
      success: false,
      message: "Ledger entries array is required",
    });
  }

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Validate ledger entries
    const validAccounts = [
      "Sales",
      "Purchase",
      "Service",
      "Asset",
      "Liability",
      "Expense",
      "Income",
    ];
    const validTypes = ["debit", "credit"];

    for (const entry of ledgerEntries) {
      if (!validAccounts.includes(entry.account)) {
        return res.status(400).json({
          success: false,
          message: `Invalid account type: ${entry.account}`,
        });
      }
      if (!validTypes.includes(entry.type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid entry type: ${entry.type}`,
        });
      }
      if (!entry.amount || entry.amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than 0",
        });
      }
    }

    // Check if debits equal credits
    const totalDebits = ledgerEntries
      .filter((entry) => entry.type === "debit")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalCredits = ledgerEntries
      .filter((entry) => entry.type === "credit")
      .reduce((sum, entry) => sum + entry.amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      // Allow small rounding differences
      return res.status(400).json({
        success: false,
        message: "Total debits must equal total credits",
      });
    }

    purchase.ledgerEntries = ledgerEntries;
    purchase.updatedBy = req.user._id;

    await purchase.save();

    res.status(200).json({
      success: true,
      data: { ledgerEntries: purchase.ledgerEntries },
      message: "Ledger entries updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const transferStock = asyncHandler(async (req, res) => {
  const { transfers } = req.body;

  if (!transfers || !Array.isArray(transfers)) {
    return res.status(400).json({
      success: false,
      message: "Transfers array is required",
    });
  }

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Process each transfer
    for (const transfer of transfers) {
      const { itemId, fromRack, toRack, quantity } = transfer;

      if (!itemId || !fromRack || !toRack || !quantity) {
        return res.status(400).json({
          success: false,
          message: "Item ID, from rack, to rack, and quantity are required",
        });
      }

      const purchaseItem = purchase.items.id(itemId);
      if (!purchaseItem) {
        return res.status(400).json({
          success: false,
          message: `Item ${itemId} not found in purchase`,
        });
      }

      // Find source rack assignment
      const fromRackAssignment = purchaseItem.rackAssignments.find(
        (ra) => ra.rack.toString() === fromRack
      );

      if (!fromRackAssignment || fromRackAssignment.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient quantity in source rack",
        });
      }

      // Update source rack
      fromRackAssignment.quantity -= quantity;
      if (fromRackAssignment.quantity === 0) {
        purchaseItem.rackAssignments.pull(fromRackAssignment._id);
      }

      // Update or create destination rack assignment
      let toRackAssignment = purchaseItem.rackAssignments.find(
        (ra) => ra.rack.toString() === toRack
      );

      if (toRackAssignment) {
        toRackAssignment.quantity += quantity;
      } else {
        purchaseItem.rackAssignments.push({
          rack: toRack,
          quantity: quantity,
        });
      }
    }

    purchase.updatedBy = req.user._id;
    await purchase.save();

    res.status(200).json({
      success: true,
      data: purchase,
      message: "Stock transferred successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 

const getPurchaseByPurchaseId = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching purchase with ID:", req.params.purchaseId);

    const purchase = await Purchase.findOne({
      purchaseId: req.params.purchaseId,
      store: req.user.store,
    })
      .populate("vendor", "name email phone address")
      .populate("brand", "name description")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("items.product", "name category subCategory")
      .populate({
        path: "items.rackAssignments.rack",
        select: "name code location rackType capacity currentOccupancy",
        model: "Rack",
      })
      .populate("stockEntryDetails.entryBy", "name");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    console.log("Purchase found successfully");

    res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    console.error("Error in getPurchaseByPurchaseId:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

const completePurchaseOrder = asyncHandler(async (req, res) => {
  const { poSummary, notes } = req.body;

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Check if PO is already completed
    if (purchase.status.po === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Purchase Order is already completed",
      });
    }

    // Update PO summary if provided
    if (poSummary) {
      purchase.poSummary = {
        ...purchase.poSummary,
        ...poSummary,
      };
    }

    // Update status to completed
    purchase.status.po = "Completed";
    purchase.updatedBy = req.user._id;

    // Add notes if provided
    if (notes) {
      purchase.notes = notes;
    }

    await purchase.save();

    const updatedPurchase = await Purchase.findById(req.params.id)
      .populate("vendor", "name email phone")
      .populate("brand", "name")
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    res.status(200).json({
      success: true,
      data: updatedPurchase,
      message: "Purchase Order completed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const completePurchaseInvoice = asyncHandler(async (req, res) => {
  const { piSummary, items, notes } = req.body;

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    } // Check if PO is completed first

    if (purchase.status.po !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Purchase Order must be completed before completing PI",
      });
    }
    if (items && Array.isArray(items)) {
      for (const updatedItem of items) {
        const purchaseItem = purchase.items.id(updatedItem.itemId);
        if (purchaseItem) {
          purchaseItem.piQty = updatedItem.piQty || purchaseItem.poQty;
          const itemTaxableAmount =
            purchaseItem.purchasePrice * purchaseItem.piQty -
            (purchaseItem.discount || 0);
          let itemTaxAmount = 0;

          if (purchaseItem.taxType === "IGST") {
            itemTaxAmount = (itemTaxableAmount * purchaseItem.igst) / 100;
          } else {
            itemTaxAmount =
              (itemTaxableAmount * (purchaseItem.cgst + purchaseItem.sgst)) /
              100;
          }

          purchaseItem.taxableAmount = itemTaxableAmount;
          purchaseItem.taxAmount = itemTaxAmount;
          purchaseItem.totalAmount = itemTaxableAmount + itemTaxAmount;
        }
      }
      let piTaxableAmount = 0;
      let piTaxAmount = 0;

      purchase.items.forEach((item) => {
        const itemTaxableAmount =
          item.purchasePrice * item.piQty - (item.discount || 0);
        let itemTaxAmount = 0;

        if (item.taxType === "IGST") {
          itemTaxAmount = (itemTaxableAmount * item.igst) / 100;
        } else {
          itemTaxAmount = (itemTaxableAmount * (item.cgst + item.sgst)) / 100;
        }

        piTaxableAmount += itemTaxableAmount;
        piTaxAmount += itemTaxAmount;
      });

      purchase.piSummary.totalTaxableAmount = piTaxableAmount;
      purchase.piSummary.totalTax = piTaxAmount;
      purchase.piSummary.netTotal =
        piTaxableAmount + piTaxAmount + (purchase.piSummary.roundOff || 0);
    }

    if (piSummary) {
      purchase.piSummary = {
        ...purchase.piSummary,
        ...piSummary,
      };
    } // Update the nested status

    purchase.status.pi = "Completed";
    purchase.updatedBy = req.user._id;

    if (notes) {
      purchase.notes = notes;
    }

    await purchase.save();

    const updatedPurchase = await Purchase.findById(req.params.id)
      .populate("vendor", "name email phone")
      .populate("brand", "name")
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .lean();

    res.status(200).json({
      success: true,
      data: updatedPurchase,
      message: "Purchase Invoice completed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const completeInvoice = asyncHandler(async (req, res) => {
  const { invoiceSummary, items, notes } = req.body;

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Check if PI is completed first
    if (purchase.status.pi !== "Completed") {
      return res.status(400).json({
        success: false,
        message:
          "Purchase Invoice must be completed before completing final invoice",
      });
    }

    // Check if invoice is already completed
    if (purchase.status.invoice === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Invoice is already completed",
      });
    }

    // Update item invoice quantities if provided
    if (items && Array.isArray(items)) {
      items.forEach((updatedItem) => {
        const purchaseItem = purchase.items.id(updatedItem.itemId);
        if (purchaseItem) {
          purchaseItem.invQty = updatedItem.invQty || purchaseItem.piQty;

          // Recalculate invoice amounts based on new quantities
          const itemTaxableAmount =
            purchaseItem.purchasePrice * purchaseItem.invQty -
            (purchaseItem.discount || 0);
          let itemTaxAmount = 0;

          if (purchaseItem.taxType === "IGST") {
            itemTaxAmount = (itemTaxableAmount * purchaseItem.igst) / 100;
          } else {
            itemTaxAmount =
              (itemTaxableAmount * (purchaseItem.cgst + purchaseItem.sgst)) /
              100;
          }

          purchaseItem.taxableAmount = itemTaxableAmount;
          purchaseItem.taxAmount = itemTaxAmount;
          purchaseItem.totalAmount = itemTaxableAmount + itemTaxAmount;
        }
      });

      // Recalculate invoice summary
      let invTaxableAmount = 0;
      let invTaxAmount = 0;

      purchase.items.forEach((item) => {
        const itemTaxableAmount =
          item.purchasePrice * item.invQty - (item.discount || 0);
        let itemTaxAmount = 0;

        if (item.taxType === "IGST") {
          itemTaxAmount = (itemTaxableAmount * item.igst) / 100;
        } else {
          itemTaxAmount = (itemTaxableAmount * (item.cgst + item.sgst)) / 100;
        }

        invTaxableAmount += itemTaxableAmount;
        invTaxAmount += itemTaxAmount;
      });

      purchase.invoiceSummary.totalTaxableAmount = invTaxableAmount;
      purchase.invoiceSummary.totalTax = invTaxAmount;
      purchase.invoiceSummary.netTotal =
        invTaxableAmount +
        invTaxAmount +
        (purchase.invoiceSummary.roundOff || 0);
    }

    // Update invoice summary if provided
    if (invoiceSummary) {
      purchase.invoiceSummary = {
        ...purchase.invoiceSummary,
        ...invoiceSummary,
      };
    }

    // Update status to completed
    purchase.status.invoice = "Completed";
    purchase.updatedBy = req.user._id;

    // Add notes if provided
    if (notes) {
      purchase.notes = notes;
    }

    await purchase.save();

    const updatedPurchase = await Purchase.findById(req.params.id)
      .populate("vendor", "name email phone")
      .populate("brand", "name")
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    res.status(200).json({
      success: true,
      data: updatedPurchase,
      message: "Invoice completed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const completeFulfillment = asyncHandler(async (req, res) => {
  const { fulfillmentDetails, notes } = req.body;

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Check if invoice is completed first
    if (purchase.status.invoice !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Invoice must be completed before completing fulfillment",
      });
    }

    // Check if fulfillment is already completed
    if (purchase.status.fulfillment === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Fulfillment is already completed",
      });
    }

    // Update fulfillment details
    if (fulfillmentDetails) {
      purchase.fulfillmentDetails = {
        ...purchase.fulfillmentDetails,
        ...fulfillmentDetails,
        actualDeliveryDate: fulfillmentDetails.actualDeliveryDate || new Date(),
      };
    } else {
      purchase.fulfillmentDetails = {
        actualDeliveryDate: new Date(),
        deliveryNotes: notes || "",
      };
    }

    // Update status to completed
    purchase.status.fulfillment = "Completed";
    purchase.updatedBy = req.user._id;

    // Add notes if provided
    if (notes) {
      purchase.notes = notes;
    }

    await purchase.save();

    const updatedPurchase = await Purchase.findById(req.params.id)
      .populate("vendor", "name email phone")
      .populate("brand", "name")
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    res.status(200).json({
      success: true,
      data: updatedPurchase,
      message: "Fulfillment completed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const completeRackAssignment = asyncHandler(async (req, res) => {
  const { rackAssignments, notes } = req.body;

  if (!rackAssignments || !Array.isArray(rackAssignments)) {
    return res.status(400).json({
      success: false,
      message: "Rack assignments array is required",
    });
  }

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Check if stock entry is completed first
    if (purchase.status.stockEntry !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Stock entry must be completed before rack assignment",
      });
    }

    // Update rack assignments for items
    rackAssignments.forEach((assignment) => {
      const { itemId, assignments } = assignment;
      const purchaseItem = purchase.items.id(itemId);

      if (purchaseItem && assignments) {
        purchaseItem.rackAssignments = assignments.map((assign) => ({
          rack: assign.rackId,
          quantity: assign.quantity,
        }));
      }
    });

    // Add completion timestamp
    purchase.rackAssignmentDetails = {
      completedDate: new Date(),
      completedBy: req.user._id,
      notes: notes || "",
    };

    purchase.updatedBy = req.user._id;

    // Add notes if provided
    if (notes) {
      purchase.notes = notes;
    }

    await purchase.save();

    const updatedPurchase = await Purchase.findById(req.params.id)
      .populate("items.rackAssignments.rack", "name location")
      .populate("vendor", "name email phone")
      .populate("brand", "name")
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    res.status(200).json({
      success: true,
      data: updatedPurchase,
      message: "Product to rack assignment completed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
 
const completeWorkflow = asyncHandler(async (req, res) => {
  const {
    completeAll = false,
    poData,
    piData,
    invoiceData,
    fulfillmentData,
    stockEntryData,
    rackAssignmentData,
    notes,
  } = req.body;

  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // If completeAll is true, complete all pending statuses
    if (completeAll) {
      // Complete PO if pending
      if (purchase.status.po !== "Completed") {
        purchase.status.po = "Completed";
      }

      // Complete PI if pending
      if (purchase.status.pi !== "Completed") {
        purchase.status.pi = "Completed";
      }

      // Complete Invoice if pending
      if (purchase.status.invoice !== "Completed") {
        purchase.status.invoice = "Completed";
      }

      // Complete Fulfillment if pending
      if (purchase.status.fulfillment !== "Completed") {
        purchase.status.fulfillment = "Completed";
        purchase.fulfillmentDetails = {
          actualDeliveryDate: new Date(),
          deliveryNotes: "Auto-completed via workflow",
        };
      }

      // Complete Stock Entry if pending
      if (purchase.status.stockEntry !== "Completed") {
        // Set received quantities to invoice quantities
        purchase.items.forEach((item) => {
          item.receivedQty = item.invQty || item.piQty || item.poQty;
        });

        purchase.status.stockEntry = "Completed";
        purchase.stockEntryDetails = {
          entryDate: new Date(),
          entryBy: req.user._id,
          notes: "Auto-completed via workflow",
        };

        // Update inventory quantities
        for (const item of purchase.items) {
          if (item.product && item.receivedQty > 0) {
            await Item.findByIdAndUpdate(item.product, {
              $inc: { quantity: item.receivedQty },
            });
          }
        }
      }
    } else {
      // Selective completion based on provided data
      if (poData && purchase.status.po !== "Completed") {
        purchase.status.po = "Completed";
        if (poData.poSummary) {
          purchase.poSummary = { ...purchase.poSummary, ...poData.poSummary };
        }
      }

      if (piData && purchase.status.pi !== "Completed") {
        purchase.status.pi = "Completed";
        if (piData.piSummary) {
          purchase.piSummary = { ...purchase.piSummary, ...piData.piSummary };
        }
      }

      if (invoiceData && purchase.status.invoice !== "Completed") {
        purchase.status.invoice = "Completed";
        if (invoiceData.invoiceSummary) {
          purchase.invoiceSummary = {
            ...purchase.invoiceSummary,
            ...invoiceData.invoiceSummary,
          };
        }
      }

      if (fulfillmentData && purchase.status.fulfillment !== "Completed") {
        purchase.status.fulfillment = "Completed";
        purchase.fulfillmentDetails = {
          ...purchase.fulfillmentDetails,
          ...fulfillmentData,
          actualDeliveryDate: fulfillmentData.actualDeliveryDate || new Date(),
        };
      }

      if (stockEntryData && purchase.status.stockEntry !== "Completed") {
        purchase.status.stockEntry = "Completed";
        purchase.stockEntryDetails = {
          entryDate: new Date(),
          entryBy: req.user._id,
          notes: stockEntryData.notes || "",
        };

        // Update item quantities if provided
        if (stockEntryData.items) {
          stockEntryData.items.forEach((updatedItem) => {
            const purchaseItem = purchase.items.id(updatedItem.itemId);
            if (purchaseItem) {
              purchaseItem.receivedQty =
                updatedItem.receivedQty || purchaseItem.invQty;
            }
          });
        }

        // Update inventory
        for (const item of purchase.items) {
          if (item.product && item.receivedQty > 0) {
            await Item.findByIdAndUpdate(item.product, {
              $inc: { quantity: item.receivedQty },
            });
          }
        }
      }

      if (rackAssignmentData && rackAssignmentData.assignments) {
        rackAssignmentData.assignments.forEach((assignment) => {
          const { itemId, assignments } = assignment;
          const purchaseItem = purchase.items.id(itemId);

          if (purchaseItem && assignments) {
            purchaseItem.rackAssignments = assignments.map((assign) => ({
              rack: assign.rackId,
              quantity: assign.quantity,
            }));
          }
        });
      }
    }

    purchase.updatedBy = req.user._id;

    if (notes) {
      purchase.notes = notes;
    }

    await purchase.save();

    const updatedPurchase = await Purchase.findById(req.params.id)
      .populate("vendor", "name email phone")
      .populate("brand", "name")
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .populate("items.product", "name category")
      .populate("items.rackAssignments.rack", "name location")
      .populate("stockEntryDetails.entryBy", "name");

    res.status(200).json({
      success: true,
      data: updatedPurchase,
      message: "Purchase workflow completed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  getPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  updatePurchaseStatus,
  completeStockEntry,
  addProductsToRack,
  getPurchaseStats,
  getAvailableItems,
  getVendorsForPurchase,
  getBrandsForPurchase,
  updatePaymentStatus,
  updateLedgerEntries,
  transferStock,
  getPurchaseByPurchaseId,
  completePurchaseOrder,
  completePurchaseInvoice,
  completeInvoice,
  completeFulfillment,
  completeRackAssignment,
  completeWorkflow,
};
