// Updated Item Model Schema to support multiple categories
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    brandName: {
        type: String,
        trim: true,
        maxlength: [100, 'Brand name cannot exceed 100 characters']
    },
    vendorName: {
        type: String,
        trim: true,
        maxlength: [100, 'Vendor name cannot exceed 100 characters']
    },
    
    // UPDATED: Change from single category string to array of category names
    categories: [{
        type: String,
        trim: true,
        maxlength: [100, 'Category name cannot exceed 100 characters']
    }],
    
    // Keep existing fields...
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    
    stockDetails: {
        currentQuantity: {
            type: Number,
            default: 0,
            min: [0, 'Quantity cannot be negative']
        },
        minimumStock: {
            type: Number,
            default: 0,
            min: [0, 'Minimum stock cannot be negative']
        },
        maximumStock: {
            type: Number,
            min: [0, 'Maximum stock cannot be negative']
        },
        unit: {
            type: String,
            enum: ['pieces', 'kg', 'grams', 'liters', 'ml', 'boxes', 'packets'],
            default: 'pieces'
        },
        location: {
            type: String,
            trim: true,
            maxlength: [100, 'Location cannot exceed 100 characters']
        }
    },
    
    priceDetails: {
        costPrice: {
            type: Number,
            min: [0, 'Cost price cannot be negative']
        },
        sellingPrice: {
            type: Number,
            min: [0, 'Selling price cannot be negative']
        },
        mrp: {
            type: Number,
            min: [0, 'MRP cannot be negative']
        },
        discount: {
            type: Number,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%']
        },
        taxRate: {
            type: Number,
            default: 0,
            min: [0, 'Tax rate cannot be negative'],
            max: [100, 'Tax rate cannot exceed 100%']
        }
    },
    
    codeDetails: {
        sku: {
            type: String,
            trim: true,
            maxlength: [50, 'SKU cannot exceed 50 characters']
        },
        barcode: {
            type: String,
            trim: true,
            maxlength: [50, 'Barcode cannot exceed 50 characters']
        },
        qrCode: {
            type: String,
            trim: true
        }
    },
    
    images: {
        primaryImage: {
            filename: String,
            originalName: String,
            path: String,
            size: Number,
            mimetype: String
        },
        additionalImages: [{
            filename: String,
            originalName: String,
            path: String,
            size: Number,
            mimetype: String
        }]
    },
    
    specifications: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            unit: {
                type: String,
                enum: ['cm', 'inch', 'mm'],
                default: 'cm'
            }
        },
        color: String,
        material: String,
        warranty: String
    },
    
    status: {
        type: String,
        enum: ['active', 'inactive', 'discontinued'],
        default: 'active'
    },
    
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// UPDATED: Indexes for better performance with multiple categories
itemSchema.index({ user: 1, productName: 1 }, { unique: true });
itemSchema.index({ user: 1, categories: 1 }); // Updated index for categories array
itemSchema.index({ user: 1, subCategory: 1 });
itemSchema.index({ user: 1, brand: 1 });
itemSchema.index({ user: 1, status: 1 });
itemSchema.index({ user: 1, 'stockDetails.currentQuantity': 1 });
itemSchema.index({ user: 1, 'priceDetails.sellingPrice': 1 });

// UPDATED: Virtual for backward compatibility (if needed)
itemSchema.virtual('category').get(function() {
    return this.categories && this.categories.length > 0 ? this.categories[0] : null;
});

itemSchema.virtual('category').set(function(categoryName) {
    if (categoryName) {
        if (!this.categories) {
            this.categories = [];
        }
        if (!this.categories.includes(categoryName)) {
            this.categories.push(categoryName);
        }
    }
});

// UPDATED: Pre-save middleware to ensure categories array is clean
itemSchema.pre('save', function(next) {
    // Remove empty strings and duplicates from categories
    if (this.categories) {
        this.categories = [...new Set(this.categories.filter(cat => cat && cat.trim()))];
    }
    next();
});

// UPDATED: Methods for category management
itemSchema.methods.addCategory = function(categoryName) {
    if (!this.categories) {
        this.categories = [];
    }
    if (categoryName && !this.categories.includes(categoryName)) {
        this.categories.push(categoryName);
    }
    return this;
};

itemSchema.methods.removeCategory = function(categoryName) {
    if (this.categories) {
        this.categories = this.categories.filter(cat => cat !== categoryName);
    }
    return this;
};

itemSchema.methods.hasCategory = function(categoryName) {
    return this.categories && this.categories.includes(categoryName);
};

itemSchema.methods.getCategoryCount = function() {
    return this.categories ? this.categories.length : 0;
};

module.exports = mongoose.model('Item', itemSchema);