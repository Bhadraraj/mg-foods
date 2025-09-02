// models/kotModel.js
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
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    variant: {
        type: String,
        trim: true
    },
    kotNote: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'],
        default: 'pending'
    },
    preparedAt: {
        type: Date
    },
    servedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const kotSchema = new mongoose.Schema({
    kotNumber: {
        type: String,
        unique: true,
        required: true
    },
    tableNumber: {
        type: String,
        required: true
    },
    orderReference: {
        type: String, // Reference to your order system
        trim: true
    },
    items: [kotItemSchema],
    customerDetails: {
        name: {
            type: String,
            trim: true
        },
        mobile: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            enum: ['Individual', 'Business'],
            default: 'Individual'
        }
    },
    kotType: {
        type: String,
        enum: ['Tea Shop (KOT1)', 'Juice shop (KOT2)', 'Ice cream shop (KOT3)'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    },
    printedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
kotSchema.index({ kotNumber: 1 });
kotSchema.index({ tableNumber: 1 });
kotSchema.index({ status: 1 });
kotSchema.index({ kotType: 1 });
kotSchema.index({ createdAt: -1 });
kotSchema.index({ user: 1 });

// Virtual for calculating total amount
kotSchema.virtual('calculatedTotal').get(function() {
    return this.items.reduce((total, item) => total + item.totalAmount, 0);
});

// Pre-save middleware to calculate total amount
kotSchema.pre('save', function(next) {
    this.totalAmount = this.items.reduce((total, item) => total + item.totalAmount, 0);
    next();
});

// Static method to generate KOT number
kotSchema.statics.generateKotNumber = async function() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    const lastKot = await this.findOne({
        kotNumber: { $regex: `^KOT${dateStr}` }
    }).sort({ kotNumber: -1 });

    let sequence = 1;
    if (lastKot) {
        const lastSequence = parseInt(lastKot.kotNumber.slice(-3));
        sequence = lastSequence + 1;
    }

    return `KOT${dateStr}${sequence.toString().padStart(3, '0')}`;
};

module.exports = mongoose.model('KOT', kotSchema);