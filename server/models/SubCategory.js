const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'SubCategory name is required'],
        trim: true,
        maxlength: [100, 'SubCategory name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Parent category is required']
    },
    image: {
        type: String, // URL to subcategory image
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    store: {
        type: String,
        default: 'MG Food Court'
    },
    sortOrder: {
        type: Number,
        default: 0
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

// Compound unique index to prevent duplicate subcategory names within the same category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });
subCategorySchema.index({ category: 1 });
subCategorySchema.index({ isActive: 1 });
subCategorySchema.index({ sortOrder: 1 });

// Virtual for item count
subCategorySchema.virtual('itemCount', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'subCategory',
    count: true
});

// Ensure virtual fields are serialized
subCategorySchema.set('toJSON', { virtuals: true });
subCategorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);