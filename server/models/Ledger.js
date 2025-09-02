const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ledger name is required'],
        trim: true,
        maxlength: [100, 'Ledger name cannot exceed 100 characters']
    },
    ledgerCategory: {
        type: String,
        required: [true, 'Ledger category is required'],
        enum: [
            'Current Assets',
            'Fixed Assets',
            'Current Liabilities',
            'Long Term Liabilities',
            'Capital Account',
            'Direct Income',
            'Indirect Income',
            'Direct Expenses',
            'Indirect Expenses'
        ]
    },
    ledgerGroup: {
        type: String,
        required: [true, 'Ledger group is required'],
        enum: [
            'Cash in Hand',
            'Bank Accounts',
            'Stock in Hand',
            'Sundry Debtors',
            'Loans & Advances',
            'Fixed Assets',
            'Sundry Creditors',
            'Duties & Taxes',
            'Provisions',
            'Capital Account',
            'Reserves & Surplus',
            'Sales Account',
            'Service Income',
            'Other Income',
            'Purchase Account',
            'Direct Expenses',
            'Administrative Expenses',
            'Selling & Distribution',
            'Financial Charges'
        ]
    },
    isTaxLedger: {
        type: Boolean,
        default: false
    },
    taxPercentage: {
        type: Number,
        default: 0,
        min: [0, 'Tax percentage cannot be negative'],
        max: [100, 'Tax percentage cannot exceed 100']
    },
    openingBalance: {
        type: Number,
        default: 0
    },
    balanceType: {
        type: String,
        enum: ['Debit', 'Credit'],
        default: 'Debit'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
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

// Compound index for uniqueness within store
ledgerSchema.index({ name: 1, store: 1 }, { unique: true });
ledgerSchema.index({ ledgerCategory: 1 });
ledgerSchema.index({ ledgerGroup: 1 });
ledgerSchema.index({ isActive: 1 });
ledgerSchema.index({ isTaxLedger: 1 });

// Virtual for current balance (you can extend this with actual transaction calculations)
ledgerSchema.virtual('currentBalance').get(function() {
    return this.openingBalance; // This would be calculated from transactions in real implementation
});

// Ensure virtual fields are serialized
ledgerSchema.set('toJSON', { virtuals: true });
ledgerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Ledger || mongoose.model('Ledger', ledgerSchema);