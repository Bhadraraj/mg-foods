const mongoose = require('mongoose');

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
  }
});

const purchaseSchema = new mongoose.Schema({
  purchaseId: {
    type: String,
    unique: true,
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: [true, 'Vendor is required']
  },
  invoiceNo: {
    type: String,
    required: [true, 'Invoice number is required']
  },
  invoiceDate: {
    type: Date,
    required: [true, 'Invoice date is required']
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
    enum: ['sales', 'recipe'],
    default: 'sales'
  },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'received', 'cancelled'],
    default: 'draft'
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
  notes: String,
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
  timestamps: true
});

// Generate purchase ID before saving
purchaseSchema.pre('save', async function(next) {
  if (!this.purchaseId && this.isNew) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = 'PUR';
    const dateStr = `${year}${month}${day}`;
    
    // Find the last purchase for today
    const lastPurchase = await this.constructor.findOne({
      purchaseId: new RegExp(`^${prefix}${dateStr}`),
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999))
      }
    }).sort({ purchaseId: -1 });
    
    let sequence = 1;
    if (lastPurchase) {
      const lastSequence = parseInt(lastPurchase.purchaseId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.purchaseId = `${prefix}${dateStr}${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Index for better performance
purchaseSchema.index({ purchaseId: 1 });
purchaseSchema.index({ vendor: 1 });
purchaseSchema.index({ invoiceDate: -1 });
purchaseSchema.index({ status: 1, paymentStatus: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);