const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Brand name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    logo: {
        type: String, // URL to brand logo
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

// Index for better performance
brandSchema.index({ name: 1, store: 1 });
brandSchema.index({ isActive: 1 });

// Virtual for item count
brandSchema.virtual('itemCount', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'brand',
    count: true
});

// Ensure virtual fields are serialized
brandSchema.set('toJSON', { virtuals: true });
brandSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Brand || mongoose.model('Brand', brandSchema);