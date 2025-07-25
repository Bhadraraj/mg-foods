const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide party name'],
    trim: true,
    maxlength: [100, 'Party name cannot be more than 100 characters']
  },
  type: {
    type: String,
    enum: ['customer', 'vendor', 'referrer'],
    required: [true, 'Please specify party type']
  },
  contact: {
    mobile: {
      type: String,
      required: [true, 'Mobile number is required']
    },
    email: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
    }
  },
  business: {
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    businessType: {
      type: String,
      enum: ['individual', 'proprietorship', 'partnership', 'company', 'llp'],
      default: 'individual'
    }
  },
  financial: {
    openingBalance: {
      type: Number,
      default: 0
    },
    currentBalance: {
      type: Number,
      default: 0
    },
    creditLimit: {
      type: Number,
      default: 0,
      min: [0, 'Credit limit cannot be negative']
    },
    creditDays: {
      type: Number,
      default: 0,
      min: [0, 'Credit days cannot be negative']
    }
  },
  // Vendor specific fields
  vendorDetails: {
    vendorCode: String,
    paymentTerms: String,
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
      branchName: String
    }
  },
  // Customer specific fields
  customerDetails: {
    customerCode: String,
    rateType: {
      type: String,
      enum: ['retail', 'wholesale', 'special'],
      default: 'retail'
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: [0, 'Loyalty points cannot be negative']
    }
  },
  // Referrer specific fields
  referrerDetails: {
    commissionRate: {
      type: Number,
      default: 0,
      min: [0, 'Commission rate cannot be negative'],
      max: [100, 'Commission rate cannot be more than 100%']
    },
    commissionPoints: {
      type: Number,
      default: 0,
      min: [0, 'Commission points cannot be negative']
    },
    yearlyPoints: {
      type: Number,
      default: 0,
      min: [0, 'Yearly points cannot be negative']
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
partySchema.virtual('fullAddress').get(function() {
  const addr = this.contact.address;
  if (!addr) return '';
  
  return [addr.street, addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(', ');
});

// Index for better performance
partySchema.index({ name: 'text', 'contact.mobile': 'text' });
partySchema.index({ type: 1, status: 1 });
partySchema.index({ 'business.gstNumber': 1 });

// Pre-save middleware to generate codes
partySchema.pre('save', function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    
    if (this.type === 'vendor' && !this.vendorDetails.vendorCode) {
      this.vendorDetails.vendorCode = `VEN${timestamp}${random}`;
    } else if (this.type === 'customer' && !this.customerDetails.customerCode) {
      this.customerDetails.customerCode = `CUS${timestamp}${random}`;
    }
  }
  next();
});

module.exports = mongoose.model('Party', partySchema);