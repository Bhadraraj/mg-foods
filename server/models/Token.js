const mongoose = require('mongoose');

const tokenItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: [true, 'Item is required']
    },
    itemName: {
        type: String,
        required: true
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
        required: true,
        min: [0, 'Total price cannot be negative']
    },
    specialInstructions: {
        type: String,
        trim: true,
        maxlength: [200, 'Special instructions cannot exceed 200 characters']
    }
}, { _id: true });

const tokenSchema = new mongoose.Schema({
    tokenNumber: {
        type: String,
        required: [true, 'Token number is required'],
        unique: true,
        trim: true
    },
    serialNumber: {
        type: Number,
        required: true,
        min: 1
    },
    customerDetails: {
        name: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
            maxlength: [100, 'Customer name cannot exceed 100 characters']
        },
        mobile: {
            type: String,
            required: [true, 'Customer mobile is required'],
            trim: true,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number']
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
        },
        address: {
            type: String,
            trim: true,
            maxlength: [300, 'Address cannot exceed 300 characters']
        }
    },
    orderItems: [tokenItemSchema],
    orderSummary: {
        totalQuantity: {
            type: Number,
            required: true,
            min: [0, 'Total quantity cannot be negative'],
            default: 0
        },
        totalTea: {
            type: Number,
            default: 0,
            min: [0, 'Total tea count cannot be negative']
        },
        totalVada: {
            type: Number,
            default: 0,
            min: [0, 'Total vada count cannot be negative']
        },
        subTotal: {
            type: Number,
            required: true,
            min: [0, 'Subtotal cannot be negative'],
            default: 0
        },
        taxAmount: {
            type: Number,
            default: 0,
            min: [0, 'Tax amount cannot be negative']
        },
        discountAmount: {
            type: Number,
            default: 0,
            min: [0, 'Discount amount cannot be negative']
        },
        grandTotal: {
            type: Number,
            required: true,
            min: [0, 'Grand total cannot be negative'],
            default: 0
        }
    },
    paymentDetails: {
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded', 'Cancelled'],
            default: 'Pending'
        },
        method: {
            type: String,
            enum: ['Cash', 'Card', 'UPI', 'Online', 'Wallet'],
            default: 'Cash'
        },
        paidAmount: {
            type: Number,
            default: 0,
            min: [0, 'Paid amount cannot be negative']
        },
        pendingAmount: {
            type: Number,
            default: 0,
            min: [0, 'Pending amount cannot be negative']
        },
        transactionId: {
            type: String,
            trim: true
        },
        paymentDate: {
            type: Date
        }
    },
    orderStatus: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    orderType: {
        type: String,
        enum: ['Dine-In', 'Takeaway', 'Delivery'],
        default: 'Takeaway'
    },
    priority: {
        type: String,
        enum: ['Normal', 'High', 'Urgent'],
        default: 'Normal'
    },
    estimatedTime: {
        type: Number, // in minutes
        default: 15
    },
    actualDeliveryTime: {
        type: Date
    },
    orderNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Order notes cannot exceed 500 characters']
    },
    store: {
        type: String,
        default: 'MG Food Court'
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
        ref: 'User'
    },
    servedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
tokenSchema.index({ tokenNumber: 1 }, { unique: true });
tokenSchema.index({ serialNumber: 1, store: 1 });
tokenSchema.index({ 'customerDetails.mobile': 1 });
tokenSchema.index({ orderStatus: 1 });
tokenSchema.index({ 'paymentDetails.status': 1 });
tokenSchema.index({ createdAt: -1 });
tokenSchema.index({ store: 1, isActive: 1 });

// Virtual for formatted token display
tokenSchema.virtual('displayToken').get(function() {
    return `#${this.serialNumber.toString().padStart(3, '0')}`;
});

// Virtual for order timing
tokenSchema.virtual('orderTiming').get(function() {
    const now = new Date();
    const orderTime = this.createdAt;
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
});

// Static method to generate next token number
tokenSchema.statics.generateNextTokenNumber = async function(store = 'MG Food Court') {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    
    // Get the highest serial number for today
    const lastToken = await this.findOne({
        store: store,
        createdAt: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        }
    }).sort({ serialNumber: -1 });
    
    const nextSerial = lastToken ? lastToken.serialNumber + 1 : 1;
    const tokenNumber = `TKN${dateStr}${nextSerial.toString().padStart(3, '0')}`;
    
    return {
        tokenNumber,
        serialNumber: nextSerial
    };
};

// Method to calculate order totals
tokenSchema.methods.calculateOrderTotals = function() {
    let totalQuantity = 0;
    let totalTea = 0;
    let totalVada = 0;
    let subTotal = 0;
    
    this.orderItems.forEach(item => {
        totalQuantity += item.quantity;
        subTotal += item.totalPrice;
        
        // Count tea and vada items based on item name
        const itemNameLower = item.itemName.toLowerCase();
        if (itemNameLower.includes('tea')) {
            totalTea += item.quantity;
        } else if (itemNameLower.includes('vada')) {
            totalVada += item.quantity;
        }
    });
    
    // Calculate tax and discount
    const taxAmount = this.orderSummary.taxAmount || 0;
    const discountAmount = this.orderSummary.discountAmount || 0;
    const grandTotal = subTotal + taxAmount - discountAmount;
    
    // Update order summary
    this.orderSummary = {
        totalQuantity,
        totalTea,
        totalVada,
        subTotal,
        taxAmount,
        discountAmount,
        grandTotal
    };
    
    // Update pending amount
    this.paymentDetails.pendingAmount = Math.max(0, grandTotal - (this.paymentDetails.paidAmount || 0));
    
    return this.orderSummary;
};

// Pre-save middleware to calculate totals and generate token number
tokenSchema.pre('save', async function(next) {
    try {
        // Generate token number for new tokens
        if (this.isNew && !this.tokenNumber) {
            const tokenData = await this.constructor.generateNextTokenNumber(this.store);
            this.tokenNumber = tokenData.tokenNumber;
            this.serialNumber = tokenData.serialNumber;
        }
        
        // Calculate order totals
        this.calculateOrderTotals();
        
        // Update payment status based on amounts
        if (this.paymentDetails.paidAmount >= this.orderSummary.grandTotal) {
            this.paymentDetails.status = 'Paid';
            this.paymentDetails.pendingAmount = 0;
        } else if (this.paymentDetails.paidAmount > 0) {
            this.paymentDetails.status = 'Partially Paid';
        } else {
            this.paymentDetails.status = 'Pending';
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check if order can be cancelled
tokenSchema.methods.canBeCancelled = function() {
    const nonCancellableStatuses = ['Ready', 'Delivered'];
    return !nonCancellableStatuses.includes(this.orderStatus);
};

// Method to check if order is overdue
tokenSchema.methods.isOverdue = function() {
    if (this.orderStatus === 'Delivered' || this.orderStatus === 'Cancelled') {
        return false;
    }
    
    const now = new Date();
    const orderTime = this.createdAt;
    const elapsedMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    return elapsedMinutes > this.estimatedTime;
};

module.exports = mongoose.models.Token || mongoose.model('Token', tokenSchema);