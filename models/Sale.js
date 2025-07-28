const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
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
  kotNote: String,
  variant: String
});

const saleSchema = new mongoose.Schema({
  billNo: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required']
    },
    mobile: String,
    email: String,
    address: String,
    gstNumber: String
  },
  table: {
    type: String,
    required: [true, 'Table information is required']
  },
  items: [saleItemSchema],
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
    serviceCharge: {
      type: Number,
      default: 0,
      min: [0, 'Service charge cannot be negative']
    },
    acCharge: {
      type: Number,
      default: 0,
      min: [0, 'AC charge cannot be negative']
    },
    waiterTip: {
      type: Number,
      default: 0,
      min: [0, 'Waiter tip cannot be negative']
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
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'credit'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending'
    },
    amountReceived: {
      type: Number,
      default: 0,
      min: [0, 'Amount received cannot be negative']
    },
    cashReturn: {
      type: Number,
      default: 0,
      min: [0, 'Cash return cannot be negative']
    },
    transactionId: String,
    paidAt: Date
  },
  billType: {
    type: String,
    enum: ['GST', 'Non-GST', 'Estimation', 'Proforma'],
    default: 'GST'
  },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'completed', 'cancelled'],
    default: 'draft'
  },
  kotStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  deliveryDate: Date,
  notes: String,
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party'
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
  timestamps: true
});

// Generate bill number before saving
saleSchema.pre('save', async function(next) {
  if (!this.billNo && this.isNew) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = this.billType === 'GST' ? 'MGGST' : 'MGEST';
    const dateStr = `${year}${month}${day}`;
    
    // Find the last bill number for today
    const lastSale = await this.constructor.findOne({
      billNo: new RegExp(`^${prefix}${dateStr}`),
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999))
      }
    }).sort({ billNo: -1 });
    
    let sequence = 1;
    if (lastSale) {
      const lastSequence = parseInt(lastSale.billNo.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.billNo = `${prefix}${dateStr}${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Index for better performance
saleSchema.index({ billNo: 1 });
saleSchema.index({ 'customer.mobile': 1 });
saleSchema.index({ createdAt: -1 });
saleSchema.index({ status: 1, kotStatus: 1 });

module.exports = mongoose.model('Sale', saleSchema);