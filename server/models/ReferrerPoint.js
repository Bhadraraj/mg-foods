const mongoose = require('mongoose');

const referrerPointSchema = new mongoose.Schema({
    store: {
        type: String, // Changed from ObjectId to String
        required: true,
        default: 'MG Food Court' // You can set your default store name
    },
    // The 'referrer' field now correctly references the 'Referrer' model,
    // which is a separate collection from 'Customer'.
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Referrer', // <-- Corrected reference
        required: true
    },
    referred: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: false // For manual point adjustments
    },
    commissionType: {
        type: String,
        enum: ['Percentage', 'Fixed Amount'],
        required: true
    },
    commissionValue: {
        type: Number,
        required: true,
        min: 0
    },
    pointsEarned: {
        type: Number,
        required: true,
        default: 0
    },
    pointsRedeemed: {
        type: Number,
        default: 0
    },
    balancePoints: {
        type: Number,
        default: function() {
            return this.pointsEarned - this.pointsRedeemed;
        }
    },
    yearlyPoints: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: function() {
            return this.pointsEarned;
        }
    },
    transactionType: {
        type: String,
        enum: ['Referral Commission', 'Manual Adjustment', 'Redemption', 'Yearly Bonus'],
        default: 'Referral Commission'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false
    },
    orderAmount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Expired', 'Redeemed'],
        default: 'Active'
    },
    expiryDate: {
        type: Date,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

// Index for better query performance
referrerPointSchema.index({ store: 1, referrer: 1 });
referrerPointSchema.index({ store: 1, status: 1 });
referrerPointSchema.index({ createdAt: -1 });

// Virtual for checking if points are expired
referrerPointSchema.virtual('isExpired').get(function() {
    return this.expiryDate && this.expiryDate < new Date();
});

// Pre-save middleware to calculate balance points
referrerPointSchema.pre('save', function(next) {
    this.balancePoints = this.pointsEarned - this.pointsRedeemed;
    this.totalPoints = this.pointsEarned;
    next();
});

// Static method to get referrer summary (updated to use string store)
referrerPointSchema.statics.getReferrerSummary = async function(storeId, referrerId) {
    const result = await this.aggregate([
        {
            $match: {
                store: storeId, // Now expects a string, not ObjectId
                referrer: new mongoose.Types.ObjectId(referrerId), // Added 'new' keyword
                isActive: true
            }
        },
        {
            $group: {
                _id: '$referrer',
                totalCommissionPoints: { $sum: '$pointsEarned' },
                totalYearlyPoints: { $sum: '$yearlyPoints' },
                totalRedeemed: { $sum: '$pointsRedeemed' },
                totalBalance: { $sum: { $subtract: ['$pointsEarned', '$pointsRedeemed'] } } // Calculate balance properly
            }
        }
    ]);

    return result[0] || {
        totalCommissionPoints: 0,
        totalYearlyPoints: 0,
        totalRedeemed: 0,
        totalBalance: 0
    };
};

module.exports = mongoose.model('ReferrerPoint', referrerPointSchema);