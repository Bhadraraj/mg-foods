const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Offer name is required'],
    trim: true,
    maxlength: [100, 'Offer name cannot be more than 100 characters']
  },
  offerCode: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['discount', 'buy-get', 'cashback', 'free-item'],
    required: [true, 'Offer type is required']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: function() {
      return this.type === 'discount' || this.type === 'cashback';
    }
  },
  discountValue: {
    type: Number,
    required: function() {
      return this.type === 'discount' || this.type === 'cashback';
    },
    min: [0, 'Discount value cannot be negative']
  },
  conditions: {
    minOrderValue: {
      type: Number,
      default: 0,
      min: [0, 'Minimum order value cannot be negative']
    },
    maxDiscountAmount: {
      type: Number,
      min: [0, 'Maximum discount amount cannot be negative']
    },
    applicableItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }],
    applicableCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    customerType: {
      type: String,
      enum: ['all', 'new', 'existing', 'premium'],
      default: 'all'
    },
    usageLimit: {
      type: Number,
      min: [1, 'Usage limit must be at least 1']
    },
    usagePerCustomer: {
      type: Number,
      min: [1, 'Usage per customer must be at least 1'],
      default: 1
    }
  },
  validity: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    validDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    validHours: {
      start: String, // HH:MM format
      end: String    // HH:MM format
    }
  },
  usage: {
    totalUsed: {
      type: Number,
      default: 0,
      min: [0, 'Total used cannot be negative']
    },
    totalSavings: {
      type: Number,
      default: 0,
      min: [0, 'Total savings cannot be negative']
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'expired', 'cancelled'],
    default: 'draft'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    url: String,
    publicId: String
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for offer status based on dates
offerSchema.virtual('currentStatus').get(function() {
  const now = new Date();
  if (now < this.validity.startDate) return 'upcoming';
  if (now > this.validity.endDate) return 'expired';
  if (this.status === 'active') return 'running';
  return this.status;
});

// Virtual for remaining usage
offerSchema.virtual('remainingUsage').get(function() {
  if (!this.conditions.usageLimit) return null;
  return Math.max(0, this.conditions.usageLimit - this.usage.totalUsed);
});

// Pre-save middleware
offerSchema.pre('save', function(next) {
  // Generate offer code if not provided
  if (!this.offerCode && this.isNew) {
    this.offerCode = `OFF${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
  }
  
  // Validate end date is after start date
  if (this.validity.endDate <= this.validity.startDate) {
    return next(new Error('End date must be after start date'));
  }
  
  next();
});

// Index for better performance
offerSchema.index({ offerCode: 1 });
offerSchema.index({ type: 1, status: 1 });
offerSchema.index({ 'validity.startDate': 1, 'validity.endDate': 1 });

module.exports = mongoose.model('Offer', offerSchema);