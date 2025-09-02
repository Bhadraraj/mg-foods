const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Offer name is required'],
        trim: true,
        maxlength: [100, 'Offer name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [50, 'Slug cannot exceed 50 characters']
    },
    offerEffectiveFrom: {
        type: Date,
        required: [true, 'Offer effective from date is required']
    },
    offerEffectiveUpto: {
        type: Date,
        required: [true, 'Offer effective upto date is required'],
        validate: {
            validator: function(value) {
                return value > this.offerEffectiveFrom;
            },
            message: 'Offer end date must be after start date'
        }
    },
    discountType: {
        type: String,
        required: [true, 'Discount type is required'],
        enum: ['Percentage', 'Fixed Amount', 'Buy One Get One', 'Flat Discount']
    },
    discount: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount cannot be negative'],
        validate: {
            validator: function(value) {
                if (this.discountType === 'Percentage') {
                    return value <= 100;
                }
                return true;
            },
            message: 'Percentage discount cannot exceed 100%'
        }
    },
    // Applicable to products, categories, or entire store
    applicableType: {
        type: String,
        required: [true, 'Applicable type is required'],
        enum: ['Product', 'Category', 'Store', 'Customer Group'],
        default: 'Product'
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
        default: null, // null means unlimited
        min: [1, 'Max usage per customer must be at least 1']
    },
    totalUsageLimit: {
        type: Number,
        default: null, // null means unlimited
        min: [1, 'Total usage limit must be at least 1']
    },
    currentUsageCount: {
        type: Number,
        default: 0
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
        default: false // Can be combined with other offers
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    terms: {
        type: String,
        trim: true,
        maxlength: [1000, 'Terms and conditions cannot exceed 1000 characters']
    },
    bannerImage: {
        type: String,
        trim: true
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
offerSchema.index({ slug: 1 }, { unique: true });
offerSchema.index({ isActive: 1 });
offerSchema.index({ offerEffectiveFrom: 1, offerEffectiveUpto: 1 });
offerSchema.index({ applicableType: 1 });
offerSchema.index({ store: 1 });
offerSchema.index({ priority: -1 }); // Descending for priority

// Virtual for checking if offer is currently active
offerSchema.virtual('isCurrentlyActive').get(function() {
    const now = new Date();
    return this.isActive && 
           now >= this.offerEffectiveFrom && 
           now <= this.offerEffectiveUpto &&
           (this.totalUsageLimit === null || this.currentUsageCount < this.totalUsageLimit);
});

// Virtual for remaining usage count
offerSchema.virtual('remainingUsage').get(function() {
    if (this.totalUsageLimit === null) return 'Unlimited';
    return Math.max(0, this.totalUsageLimit - this.currentUsageCount);
});

// Virtual for offer status based on dates and usage
offerSchema.virtual('status').get(function() {
    const now = new Date();
    
    if (!this.isActive) return 'Inactive';
    if (now < this.offerEffectiveFrom) return 'Scheduled';
    if (now > this.offerEffectiveUpto) return 'Expired';
    if (this.totalUsageLimit && this.currentUsageCount >= this.totalUsageLimit) return 'Exhausted';
    
    return 'Running';
});

// Pre-save middleware to generate slug if not provided
offerSchema.pre('save', function(next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    next();
});

// Pre-save middleware to validate dates
offerSchema.pre('save', function(next) {
    if (this.offerEffectiveUpto <= this.offerEffectiveFrom) {
        next(new Error('Offer end date must be after start date'));
    }
    next();
});

// Ensure virtual fields are serialized
offerSchema.set('toJSON', { virtuals: true });
offerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Offer || mongoose.model('Offer', offerSchema);