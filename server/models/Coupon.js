const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        trim: true,
        uppercase: true,
        maxlength: [20, 'Coupon code cannot exceed 20 characters'],
        minlength: [3, 'Coupon code must be at least 3 characters']
    },
    name: {
        type: String,
        required: [true, 'Coupon name is required'],
        trim: true,
        maxlength: [100, 'Coupon name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    couponType: {
        type: String,
        required: [true, 'Coupon type is required'],
        enum: ['Promotional', 'Loyalty', 'Welcome', 'Seasonal', 'Referral'],
        default: 'Promotional'
    },
    discountType: {
        type: String,
        required: [true, 'Discount type is required'],
        enum: ['Percentage', 'Fixed Amount', 'Buy One Get One', 'Flat Discount']
    },
    couponValue: {
        type: Number,
        required: [true, 'Coupon value is required'],
        min: [0, 'Coupon value cannot be negative'],
        validate: {
            validator: function(value) {
                if (this.discountType === 'Percentage') {
                    return value >= 0 && value <= 100;
                }
                return value >= 0;
            },
            message: 'Percentage discount must be between 0 and 100%'
        }
    },
    validFrom: {
        type: Date,
        required: [true, 'Valid from date is required']
    },
    validTo: {
        type: Date,
        required: [true, 'Valid to date is required'],
        validate: {
            validator: function(value) {
                return value > this.validFrom;
            },
            message: 'Valid to date must be after valid from date'
        }
    },
    // Applicable to products, categories, or entire store
    applicableType: {
        type: String,
        required: [true, 'Applicable type is required'],
        enum: ['Product', 'Category', 'Store', 'Customer Group'],
        default: 'Store'
    },
    // Array of applicable items (product IDs, category IDs, etc.)
    applicableItems: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'applicableType'
    }],
    // Minimum order conditions
    minOrderAmount: {
        type: Number,
        default: 0,
        min: [0, 'Minimum order amount cannot be negative']
    },
    minOrderQuantity: {
        type: Number,
        default: 0,
        min: [0, 'Minimum order quantity cannot be negative']
    },
    // Usage limitations
    maxUsagePerCustomer: {
        type: Number,
        default: 1,
        min: [1, 'Max usage per customer must be at least 1']
    },
    totalUsageLimit: {
        type: Number,
        default: null, // null means unlimited
        min: [1, 'Total usage limit must be at least 1']
    },
    currentUsageCount: {
        type: Number,
        default: 0,
        min: [0, 'Current usage count cannot be negative']
    },
    // Customer eligibility
    customerGroups: [{
        type: String,
        enum: ['All', 'Premium', 'Regular', 'New', 'VIP']
    }],
    isFirstTimeCustomerOnly: {
        type: Boolean,
        default: false
    },
    // Status and visibility
    isActive: {
        type: Boolean,
        default: true
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    // Additional settings
    stackable: {
        type: Boolean,
        default: false // Can be combined with other coupons
    },
    terms: {
        type: String,
        trim: true,
        maxlength: [1000, 'Terms and conditions cannot exceed 1000 characters']
    },
    priority: {
        type: Number,
        default: 0,
        min: [0, 'Priority cannot be negative']
    },
    store: {
        type: String,
        default: 'MG Food Court'
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

// Indexes for better performance
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validTo: 1 });
couponSchema.index({ couponType: 1 });
couponSchema.index({ store: 1 });
couponSchema.index({ priority: -1 }); // Descending for priority

// Virtual for checking if coupon is currently active
couponSchema.virtual('isCurrentlyActive').get(function() {
    const now = new Date();
    return this.isActive && 
           now >= this.validFrom && 
           now <= this.validTo &&
           (this.totalUsageLimit === null || this.currentUsageCount < this.totalUsageLimit);
});

// Virtual for remaining usage count
couponSchema.virtual('remainingUsage').get(function() {
    if (this.totalUsageLimit === null) return 'Unlimited';
    return Math.max(0, this.totalUsageLimit - this.currentUsageCount);
});

// Virtual for coupon status based on dates and usage
couponSchema.virtual('status').get(function() {
    const now = new Date();
    
    if (!this.isActive) return 'Inactive';
    if (now < this.validFrom) return 'Scheduled';
    if (now > this.validTo) return 'Expired';
    if (this.totalUsageLimit && this.currentUsageCount >= this.totalUsageLimit) return 'Exhausted';
    
    return 'Active';
});

// Method to check if coupon can be used by a customer
couponSchema.methods.canBeUsedByCustomer = function(customerId, customerGroup = 'Regular', isFirstTime = false) {
    // Check if currently active
    if (!this.isCurrentlyActive) return false;
    
    // Check first time customer restriction
    if (this.isFirstTimeCustomerOnly && !isFirstTime) return false;
    
    // Check customer group eligibility
    if (this.customerGroups.length > 0 && !this.customerGroups.includes(customerGroup) && !this.customerGroups.includes('All')) {
        return false;
    }
    
    return true;
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(orderAmount, orderItems = []) {
    if (!this.isCurrentlyActive) return 0;
    
    // Check minimum order amount
    if (this.minOrderAmount > 0 && orderAmount < this.minOrderAmount) return 0;
    
    // Check minimum order quantity
    if (this.minOrderQuantity > 0) {
        const totalQuantity = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        if (totalQuantity < this.minOrderQuantity) return 0;
    }
    
    let discountAmount = 0;
    switch (this.discountType) {
        case 'Percentage':
            discountAmount = (orderAmount * this.couponValue) / 100;
            break;
        case 'Fixed Amount':
        case 'Flat Discount':
            discountAmount = Math.min(this.couponValue, orderAmount);
            break;
        case 'Buy One Get One':
            // Logic for BOGO can be implemented based on specific requirements
            discountAmount = 0;
            break;
        default:
            discountAmount = 0;
    }
    
    return Math.round(discountAmount * 100) / 100; // Round to 2 decimal places
};

// Pre-save middleware to generate code if not provided
couponSchema.pre('save', function(next) {
    if (!this.code && this.name) {
        // Generate code from name
        let generatedCode = this.name
            .toUpperCase()
            .replace(/[^A-Z0-9\s]/g, '')
            .replace(/\s+/g, '')
            .substring(0, 8);
        
        // Add random suffix if code is too short
        if (generatedCode.length < 6) {
            const randomSuffix = Math.random().toString(36).substr(2, 6).toUpperCase();
            generatedCode += randomSuffix;
        }
        
        // Truncate if too long
        this.code = generatedCode.substring(0, 20);
    }
    next();
});

// Pre-save middleware to validate dates
couponSchema.pre('save', function(next) {
    if (this.validTo <= this.validFrom) {
        return next(new Error('Valid to date must be after valid from date'));
    }
    
    // Ensure currentUsageCount doesn't exceed totalUsageLimit
    if (this.totalUsageLimit && this.currentUsageCount > this.totalUsageLimit) {
        return next(new Error('Current usage count cannot exceed total usage limit'));
    }
    
    next();
});

// Static method to find active coupons
couponSchema.statics.findActiveCoupons = function(store = null) {
    const now = new Date();
    const filter = {
        isActive: true,
        isVisible: true,
        validFrom: { $lte: now },
        validTo: { $gte: now }
    };
    
    if (store) {
        filter.store = store;
    }
    
    return this.find(filter).sort({ priority: -1, createdAt: -1 });
};

// Static method to find coupon by code
couponSchema.statics.findByCode = function(code, store = null) {
    const filter = { code: code.toUpperCase() };
    if (store) {
        filter.store = store;
    }
    return this.findOne(filter);
};

// Ensure virtual fields are serialized
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);