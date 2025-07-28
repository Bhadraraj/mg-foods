const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseId: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: [true, 'Expense description is required'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Expense category is required'],
    enum: [
      'rent', 'utilities', 'salaries', 'supplies', 'maintenance',
      'marketing', 'insurance', 'taxes', 'fuel', 'travel',
      'equipment', 'software', 'professional-services', 'other'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'card', 'upi', 'cheque'],
    required: [true, 'Payment method is required']
  },
  paymentDetails: {
    transactionId: String,
    chequeNumber: String,
    bankName: String,
    accountNumber: String
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party'
  },
  billDetails: {
    billNumber: String,
    billDate: Date,
    gstAmount: {
      type: Number,
      default: 0,
      min: [0, 'GST amount cannot be negative']
    },
    cgstAmount: {
      type: Number,
      default: 0,
      min: [0, 'CGST amount cannot be negative']
    },
    sgstAmount: {
      type: Number,
      default: 0,
      min: [0, 'SGST amount cannot be negative']
    },
    igstAmount: {
      type: Number,
      default: 0,
      min: [0, 'IGST amount cannot be negative']
    }
  },
  date: {
    type: Date,
    required: [true, 'Expense date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  attachments: [{
    url: String,
    publicId: String,
    filename: String,
    fileType: String
  }],
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

// Generate expense ID before saving
expenseSchema.pre('save', async function(next) {
  if (!this.expenseId && this.isNew) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = 'EXP';
    const dateStr = `${year}${month}${day}`;
    
    // Find the last expense for today
    const lastExpense = await this.constructor.findOne({
      expenseId: new RegExp(`^${prefix}${dateStr}`),
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999))
      }
    }).sort({ expenseId: -1 });
    
    let sequence = 1;
    if (lastExpense) {
      const lastSequence = parseInt(lastExpense.expenseId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.expenseId = `${prefix}${dateStr}${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Index for better performance
expenseSchema.index({ expenseId: 1 });
expenseSchema.index({ category: 1, status: 1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Expense', expenseSchema);