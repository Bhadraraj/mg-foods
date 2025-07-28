const mongoose = require('mongoose');

const recipeIngredientSchema = new mongoose.Schema({
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  ingredientName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: [0, 'Cost cannot be negative']
  }
});

const recipeSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  recipeCode: {
    type: String,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  ingredients: [recipeIngredientSchema],
  production: {
    totalManufactured: {
      type: Number,
      required: true,
      min: [0, 'Total manufactured cannot be negative'],
      default: 0
    },
    totalSold: {
      type: Number,
      required: true,
      min: [0, 'Total sold cannot be negative'],
      default: 0
    },
    balance: {
      type: Number,
      default: 0
    },
    wastage: {
      type: Number,
      default: 0,
      min: [0, 'Wastage cannot be negative']
    }
  },
  pricing: {
    totalCostOfIngredients: {
      type: Number,
      required: true,
      min: [0, 'Total cost cannot be negative']
    },
    serviceCharge: {
      type: Number,
      default: 0,
      min: [0, 'Service charge cannot be negative']
    },
    manufacturingPrice: {
      type: Number,
      required: true,
      min: [0, 'Manufacturing price cannot be negative']
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: [0, 'Selling price cannot be negative']
    },
    profitMargin: {
      type: Number,
      default: 0
    }
  },
  instructions: {
    type: String,
    maxlength: [1000, 'Instructions cannot be more than 1000 characters']
  },
  preparationTime: {
    type: Number, // in minutes
    min: [0, 'Preparation time cannot be negative']
  },
  servingSize: {
    type: Number,
    min: [1, 'Serving size must be at least 1'],
    default: 1
  },
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
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

// Virtual for profit calculation
recipeSchema.virtual('profit').get(function() {
  return this.pricing.sellingPrice - this.pricing.manufacturingPrice;
});

// Virtual for profit percentage
recipeSchema.virtual('profitPercentage').get(function() {
  if (this.pricing.manufacturingPrice === 0) return 0;
  return ((this.pricing.sellingPrice - this.pricing.manufacturingPrice) / this.pricing.manufacturingPrice) * 100;
});

// Pre-save middleware to calculate values
recipeSchema.pre('save', function(next) {
  // Calculate balance
  this.production.balance = this.production.totalManufactured - this.production.totalSold - this.production.wastage;
  
  // Calculate total cost of ingredients
  this.pricing.totalCostOfIngredients = this.ingredients.reduce((total, ingredient) => {
    return total + ingredient.cost;
  }, 0);
  
  // Calculate manufacturing price
  this.pricing.manufacturingPrice = this.pricing.totalCostOfIngredients + this.pricing.serviceCharge;
  
  // Calculate profit margin
  this.pricing.profitMargin = this.pricing.sellingPrice - this.pricing.manufacturingPrice;
  
  // Generate recipe code if not provided
  if (!this.recipeCode && this.isNew) {
    this.recipeCode = `REC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  
  next();
});

// Index for better performance
recipeSchema.index({ productName: 'text' });
recipeSchema.index({ category: 1, status: 1 });
recipeSchema.index({ recipeCode: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);