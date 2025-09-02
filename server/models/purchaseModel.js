const mongoose = require('mongoose');

// AGGRESSIVE MODEL CACHE CLEARING
console.log('=== CLEARING MONGOOSE MODEL CACHE ===');

// Method 1: Clear from mongoose.models
if (mongoose.models.Purchase) {
  delete mongoose.models.Purchase;
  console.log('✓ Cleared mongoose.models.Purchase');
}

// Method 2: Clear from connection models
if (mongoose.connection.models.Purchase) {
  delete mongoose.connection.models.Purchase;
  console.log('✓ Cleared mongoose.connection.models.Purchase');
}

// Method 3: Clear from model schemas
if (mongoose.modelSchemas && mongoose.modelSchemas.Purchase) {
  delete mongoose.modelSchemas.Purchase;
  console.log('✓ Cleared mongoose.modelSchemas.Purchase');
}

// Method 4: Clear from all connections if multiple exist
mongoose.connections.forEach((connection, index) => {
  if (connection.models && connection.models.Purchase) {
    delete connection.models.Purchase;
    console.log(`✓ Cleared connection[${index}].models.Purchase`);
  }
});

console.log('=== DEFINING NEW PURCHASE SCHEMA ===');

const purchaseItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  taxPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Tax percentage cannot be negative']
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  hsn: {
    type: String,
    required: [true, 'HSN code is required']
  },
  poQty: {
    type: Number,
    required: [true, 'PO quantity is required'],
    min: [1, 'PO quantity must be at least 1']
  },
  piQty: {
    type: Number,
    default: function() { return this.poQty; }
  },
  invQty: {
    type: Number,
    default: function() { return this.piQty || this.poQty; }
  },
  receivedQty: {
    type: Number,
    default: 0
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price cannot be negative']
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: [0, 'MRP cannot be negative']
  },
  retailPrice: {
    type: Number,
    default: 0
  },
  wholesalePrice: {
    type: Number,
    default: 0
  },
  estimationPrice: {
    type: Number,
    default: 0
  },
  quotationPrice: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'Pcs'
  },
  description: String,
  discount: {
    type: Number,
    default: 0
  },
  taxType: {
    type: String,
    enum: ['IGST', 'SGST+CGST'],
    default: 'SGST+CGST'
  },
  cgst: {
    type: Number,
    default: 0
  },
  sgst: {
    type: Number,
    default: 0
  },
  igst: {
    type: Number,
    default: 0
  },
  taxableAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  rackAssignments: [{
    rack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rack'
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  printSelected: {
    type: Boolean,
    default: false
  },
  scanCode: String
});

const purchaseSchema = new mongoose.Schema({
  purchaseId: {
    type: String,
    unique: true  // This automatically creates an index
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: [true, 'Vendor is required']
  },
  vendorName: {
    type: String
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  brandName: {
    type: String
  },
  invoiceNo: {
    type: String,
    required: [true, 'Invoice number is required']
  },
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    get: function() {
      return this.invoiceNo || this._doc.invoiceNumber;
    },
    set: function(value) {
      if (value) {
        this.invoiceNo = value;
      }
      return value;
    }
  },
  invoiceDate: {
    type: Date,
    required: [true, 'Invoice date is required'],
    index: true  // Creates index directly on field
  },
  expectedDeliveryDate: {
    type: Date
  },
  uid: {
    type: String
  },
  items: [purchaseItemSchema],
  pricing: {
    subTotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: [0, 'Tax amount cannot be negative']
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount amount cannot be negative']
    },
    roundOff: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, 'Grand total cannot be negative']
    }
  },
  taxType: {
    type: String,
    enum: ['IGST', 'SGST+CGST'],
    default: 'SGST+CGST'
  },
  billingType: {
    type: String,
    enum: ['GST', 'Non-GST'],
    default: 'GST'
  },
  purchaseType: {
    type: String,
    enum: ['sales', 'recipe', 'purchase'],
    default: 'purchase'
  },
  status: {
    po: {
      type: String,
      enum: ['Draft', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Draft'
    },
    pi: {
      type: String,
      enum: ['Draft', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Draft'
    },
    invoice: {
      type: String,
      enum: ['Draft', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Draft'
    },
    stockEntry: {
      type: String,
      enum: ['Draft', 'Completed', 'Pending'],
      default: 'Pending'
    },
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending'
  },
  fulfillmentStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  poSummary: {
    totalTaxableAmount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    netTotal: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 }
  },
  piSummary: {
    totalTaxableAmount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    netTotal: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 }
  },
  invoiceSummary: {
    totalTaxableAmount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    netTotal: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 }
  },
  stockEntryDetails: {
    entryDate: Date,
    entryBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  },
  fulfillmentDetails: {
    actualDeliveryDate: Date,
    deliveryNotes: String
  },
  rackAssignmentDetails: {
    completedDate: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  },
  ledgerEntries: [{
    account: {
      type: String,
      enum: ['Sales', 'Purchase', 'Service', 'Asset', 'Liability', 'Expense', 'Income']
    },
    type: {
      type: String,
      enum: ['debit', 'credit']
    },
    amount: Number,
    description: String
  }],
  notes: String,
  store: {
    type: String,
    default: 'MG Food Court',
    index: true  // Creates index directly on field
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Middleware to handle the transition from old string-based 'status' to new nested object
purchaseSchema.pre('save', function(next) {
  if (typeof this.status === 'string') {
    const oldStatus = this.status;
    this.status = {
      po: oldStatus,
      pi: 'Draft',
      invoice: 'Draft',
      stockEntry: 'Pending'
    };
  }
  next();
});

purchaseSchema.pre('save', async function(next) {
  try {
    if (this.invoiceNumber && !this.invoiceNo) {
      this.invoiceNo = this.invoiceNumber;
    }

    if (!this.purchaseId && this.isNew) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      const prefix = 'PUR';
      const dateStr = `${year}${month}${day}`;

      try {
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const lastPurchase = await this.constructor.findOne({
          purchaseId: { $regex: `^${prefix}${dateStr}` },
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        }).sort({ purchaseId: -1 }).exec();

        let sequence = 1;
        if (lastPurchase && lastPurchase.purchaseId) {
          const lastSequence = parseInt(lastPurchase.purchaseId.slice(-4));
          if (!isNaN(lastSequence)) {
            sequence = lastSequence + 1;
          }
        }

        this.purchaseId = `${prefix}${dateStr}${String(sequence).padStart(4, '0')}`;
      } catch (error) {
        console.error('Error generating purchaseId:', error);
        const timestamp = Date.now().toString().slice(-6);
        this.purchaseId = `${prefix}${dateStr}${timestamp}`;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Only create indexes for fields that don't already have them via field-level indexing
purchaseSchema.index({ vendor: 1 });  // vendor field doesn't have index: true, so this is fine

// REMOVED DUPLICATE INDEXES:
// purchaseSchema.index({ purchaseId: 1 }); // REMOVED - already indexed via unique: true
// purchaseSchema.index({ invoiceDate: -1 }); // REMOVED - already indexed via index: true
// purchaseSchema.index({ store: 1 }); // REMOVED - already indexed via index: true

module.exports = mongoose.model('Purchase', purchaseSchema);