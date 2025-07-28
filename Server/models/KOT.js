const mongoose = require('mongoose');

const kotItemSchema = new mongoose.Schema({
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
  variant: String,
  kotNote: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  completedAt: Date
});

const kotSchema = new mongoose.Schema({
  kotNo: {
    type: String,
    unique: true,
    required: true
  },
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: true
  },
  table: {
    type: String,
    required: true
  },
  customer: {
    name: String,
    mobile: String
  },
  items: [kotItemSchema],
  dineType: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'completed', 'cancelled'],
    default: 'new'
  },
  kitchen: {
    type: String,
    enum: ['main', 'beverage', 'dessert', 'grill'],
    default: 'main'
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 15
  },
  actualTime: Number, // in minutes
  startedAt: Date,
  completedAt: Date,
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items
kotSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for completion percentage
kotSchema.virtual('completionPercentage').get(function() {
  if (this.items.length === 0) return 0;
  const completedItems = this.items.filter(item => item.status === 'completed').length;
  return Math.round((completedItems / this.items.length) * 100);
});

// Generate KOT number before saving
kotSchema.pre('save', async function(next) {
  if (!this.kotNo && this.isNew) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = 'KOT';
    const dateStr = `${year}${month}${day}`;
    
    // Find the last KOT for today
    const lastKot = await this.constructor.findOne({
      kotNo: new RegExp(`^${prefix}${dateStr}`),
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999))
      }
    }).sort({ kotNo: -1 });
    
    let sequence = 1;
    if (lastKot) {
      const lastSequence = parseInt(lastKot.kotNo.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.kotNo = `${prefix}${dateStr}${String(sequence).padStart(4, '0')}`;
  }
  
  // Update status based on items
  if (this.items.length > 0) {
    const allCompleted = this.items.every(item => item.status === 'completed');
    const anyInProgress = this.items.some(item => item.status === 'in-progress');
    
    if (allCompleted) {
      this.status = 'completed';
      if (!this.completedAt) {
        this.completedAt = new Date();
      }
    } else if (anyInProgress) {
      this.status = 'in-progress';
      if (!this.startedAt) {
        this.startedAt = new Date();
      }
    }
  }
  
  next();
});

// Index for better performance
kotSchema.index({ kotNo: 1 });
kotSchema.index({ sale: 1 });
kotSchema.index({ status: 1, kitchen: 1 });
kotSchema.index({ createdAt: -1 });

module.exports = mongoose.model('KOT', kotSchema);