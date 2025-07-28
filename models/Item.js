const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true,
    maxlength: [100, 'Item name cannot be more than 100 characters']
  },
  itemCode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  hsnCode: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide item category']
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  },
  brand: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    required: [true, 'Please provide unit'],
    enum: ['kg', 'gram', 'liter', 'ml', 'piece', 'packet', 'box']
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    default: 'product'
  },
  pricing: {
    sellingPrice: {
      type: Number,
      required: [true, 'Please provide selling price'],
      min: [0, 'Selling price cannot be negative']
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Please provide purchase price'],
      min: [0, 'Purchase price cannot be negative']
    },
    mrp: {
      type: Number,
      min: [0, 'MRP cannot be negative']
    },
    onlineDeliveryPrice: {
      type: Number,
      min: [0, 'Online delivery price cannot be negative']
    },
    onlineSellingPrice: {
      type: Number,
      min: [0, 'Online selling price cannot be negative']
    },
    acSellingPrice: {
      type: Number,
      min: [0, 'AC selling price cannot be negative']
    },
    nonAcSellingPrice: {
      type: Number,
      min: [0, 'Non-AC selling price cannot be negative']
    }
  },
  stock: {
    currentStock: {
      type: Number,
      required: [true, 'Please provide current stock'],
      min: [0, 'Current stock cannot be negative'],
      default: 0
    },
    minStock: {
      type: Number,
      required: [true, 'Please provide minimum stock'],
      min: [0, 'Minimum stock cannot be negative'],
      default: 0
    },
    maxStock: {
      type: Number,
      required: [true, 'Please provide maximum stock'],
      min: [0, 'Maximum stock cannot be negative'],
      default: 100
    }
  },
  tax: {
    taxPercentage: {
      type: Number,
      min: [0, 'Tax percentage cannot be negative'],
      max: [100, 'Tax percentage cannot be more than 100'],
      default: 0
    },
    taxType: {
      type: String,
      enum: ['inclusive', 'exclusive'],
      default: 'exclusive'
    }
  },
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party'
  },
  barcodes: {
    barcode1: String,
    barcode2: String,
    barcode3: String,
    qrCode: String
  },
  manufacturingDate: Date,
  expirationDate: Date,
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

// Virtual for stock status
itemSchema.virtual('stockStatus').get(function() {
  if (this.stock.currentStock === 0) return 'out-of-stock';
  if (this.stock.currentStock <= this.stock.minStock) return 'low-stock';
  if (this.stock.currentStock >= this.stock.maxStock) return 'overstock';
  return 'in-stock';
});

// Index for better performance
itemSchema.index({ name: 'text', itemCode: 'text', hsnCode: 'text' });
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ 'stock.currentStock': 1 });

// Pre-save middleware to generate item code if not provided
itemSchema.pre('save', function(next) {
  if (!this.itemCode && this.isNew) {
    this.itemCode = `ITM${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);