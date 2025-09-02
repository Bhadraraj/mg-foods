const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: [true, 'Invoice number is required'],
        unique: true,
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Invoice date is required']
    },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: [true, 'Party is required for the invoice']
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: [true, 'Item is required']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        unitPrice: {
            type: Number,
            required: [true, 'Unit price is required'],
            min: [0, 'Unit price cannot be negative']
        },
        totalPrice: {
            type: Number,
            required: [true, 'Total price is required'],
            min: [0, 'Total price cannot be negative']
        }
    }],
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be negative']
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: [true, 'Grand total is required'],
        min: [0, 'Grand total cannot be negative']
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Cancelled'],
        default: 'Pending'
    },
    billType: {
        type: String,
        enum: ['GST', 'Non-GST'],
        default: 'GST'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

invoiceSchema.index({ invoiceNumber: 1 });

// The key line: This checks if the model exists before compiling it.
module.exports = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
