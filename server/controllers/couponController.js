const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private
const getCoupons = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search,
        status,
        couponType,
        discountType,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { store: req.user.store };

    // Search functionality
    if (search) {
        filter.$or = [
            { code: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Status filter
    if (status) {
        const now = new Date();
        switch (status) {
            case 'Active':
                filter.isActive = true;
                filter.validFrom = { $lte: now };
                filter.validTo = { $gte: now };
                break;
            case 'Inactive':
                filter.isActive = false;
                break;
            case 'Expired':
                filter.validTo = { $lt: now };
                break;
            case 'Scheduled':
                filter.validFrom = { $gt: now };
                break;
            case 'Exhausted':
                filter.isActive = true;
                filter.$expr = {
                    $and: [
                        { $ne: ['$totalUsageLimit', null] },
                        { $gte: ['$currentUsageCount', '$totalUsageLimit'] }
                    ]
                };
                break;
        }
    }

    // Coupon type filter
    if (couponType) {
        filter.couponType = couponType;
    }

    // Discount type filter
    if (discountType) {
        filter.discountType = discountType;
    }

    // Execute query with pagination
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
        populate: [
            { path: 'createdBy', select: 'name email' },
            { path: 'updatedBy', select: 'name email' }
        ]
    };

    try {
        const coupons = await Coupon.find(filter)
            .populate(options.populate)
            .sort(options.sort)
            .limit(options.limit * 1)
            .skip((options.page - 1) * options.limit)
            .exec();

        const total = await Coupon.countDocuments(filter);

        res.json({
            success: true,
            data: coupons,
            pagination: {
                current: options.page,
                pages: Math.ceil(total / options.limit),
                total,
                limit: options.limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching coupons',
            error: error.message
        });
    }
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private
const getCouponById = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.json({
            success: true,
            data: coupon
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid coupon ID'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error fetching coupon',
            error: error.message
        });
    }
});

// @desc    Get coupon by code
// @route   GET /api/coupons/code/:code
// @access  Private
const getCouponByCode = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findByCode(req.params.code, req.user.store)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        res.json({
            success: true,
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching coupon',
            error: error.message
        });
    }
});

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const couponData = {
            ...req.body,
            store: req.user.store,
            createdBy: req.user._id
        };

        // Validate required fields
        if (!couponData.name || !couponData.discountType || !couponData.couponValue || 
            !couponData.validFrom || !couponData.validTo) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate dates
        if (new Date(couponData.validTo) <= new Date(couponData.validFrom)) {
            return res.status(400).json({
                success: false,
                message: 'Valid to date must be after valid from date'
            });
        }

        const coupon = await Coupon.create(couponData);

        // Populate the created coupon
        await coupon.populate([
            { path: 'createdBy', select: 'name email' }
        ]);

        res.status(201).json({
            success: true,
            data: coupon,
            message: 'Coupon created successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Coupon with this ${field} already exists`
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating coupon',
            error: error.message
        });
    }
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private
const updateCoupon = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        // Check if coupon belongs to user's store
        if (coupon.store !== req.user.store) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                coupon[key] = req.body[key];
            }
        });

        coupon.updatedBy = req.user._id;
        
        await coupon.save();

        // Populate the updated coupon
        await coupon.populate([
            { path: 'createdBy', select: 'name email' },
            { path: 'updatedBy', select: 'name email' }
        ]);

        res.json({
            success: true,
            data: coupon,
            message: 'Coupon updated successfully'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid coupon ID'
            });
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Coupon with this ${field} already exists`
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating coupon',
            error: error.message
        });
    }
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private
const deleteCoupon = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        // Check if coupon belongs to user's store
        if (coupon.store !== req.user.store) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        await coupon.deleteOne();

        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid coupon ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting coupon',
            error: error.message
        });
    }
});

// @desc    Toggle coupon status
// @route   PATCH /api/coupons/:id/toggle-status
// @access  Private
const toggleCouponStatus = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        // Check if coupon belongs to user's store
        if (coupon.store !== req.user.store) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        coupon.isActive = !coupon.isActive;
        coupon.updatedBy = req.user._id;
        
        await coupon.save();

        res.json({
            success: true,
            data: coupon,
            message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid coupon ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error toggling coupon status',
            error: error.message
        });
    }
});

// @desc    Get coupon options for dropdowns
// @route   GET /api/coupons/options
// @access  Private
const getCouponOptions = asyncHandler(async (req, res) => {
    try {
        const couponTypes = ['Promotional', 'Loyalty', 'Welcome', 'Seasonal', 'Referral'];
        const discountTypes = ['Percentage', 'Fixed Amount', 'Buy One Get One', 'Flat Discount'];
        const applicableTypes = ['Product', 'Category', 'Store', 'Customer Group'];
        const customerGroups = ['All', 'Premium', 'Regular', 'New', 'VIP'];
        const statusOptions = ['Active', 'Inactive', 'Expired', 'Scheduled', 'Exhausted'];

        res.json({
            success: true,
            data: {
                couponTypes,
                discountTypes,
                applicableTypes,
                customerGroups,
                statusOptions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching coupon options',
            error: error.message
        });
    }
});

// @desc    Get active coupons
// @route   GET /api/coupons/active
// @access  Private
const getActiveCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.findActiveCoupons(req.user.store)
            .populate('createdBy', 'name email');

        res.json({
            success: true,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching active coupons',
            error: error.message
        });
    }
});

// @desc    Get coupons by type
// @route   GET /api/coupons/by-type/:type
// @access  Private
const getCouponsByType = asyncHandler(async (req, res) => {
    const { type } = req.params;
    
    try {
        if (!['Promotional', 'Loyalty', 'Welcome', 'Seasonal', 'Referral'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coupon type'
            });
        }

        const coupons = await Coupon.find({
            store: req.user.store,
            couponType: type,
            isActive: true
        })
        .sort({ priority: -1, createdAt: -1 })
        .populate('createdBy', 'name email');

        res.json({
            success: true,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching coupons by type',
            error: error.message
        });
    }
});

// @desc    Validate coupon for order
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
    try {
        const { couponCode, orderAmount, orderItems = [], customerId, customerGroup = 'Regular', isFirstTime = false } = req.body;

        if (!couponCode || !orderAmount) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code and order amount are required'
            });
        }

        const coupon = await Coupon.findByCode(couponCode, req.user.store);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        const validationResult = {
            valid: false,
            message: '',
            discountAmount: 0,
            coupon: coupon
        };

        // Check if coupon can be used by customer
        if (!coupon.canBeUsedByCustomer(customerId, customerGroup, isFirstTime)) {
            validationResult.message = 'Coupon is not eligible for this customer';
            return res.json({ success: true, data: validationResult });
        }

        // Check minimum order conditions and calculate discount
        const discountAmount = coupon.calculateDiscount(orderAmount, orderItems);
        
        if (discountAmount === 0) {
            if (coupon.minOrderAmount > 0 && orderAmount < coupon.minOrderAmount) {
                validationResult.message = `Minimum order amount of ₹${coupon.minOrderAmount} required`;
            } else if (coupon.minOrderQuantity > 0) {
                const totalQuantity = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                if (totalQuantity < coupon.minOrderQuantity) {
                    validationResult.message = `Minimum order quantity of ${coupon.minOrderQuantity} items required`;
                }
            } else {
                validationResult.message = 'Coupon cannot be applied to this order';
            }
        } else {
            validationResult.valid = true;
            validationResult.message = 'Coupon is valid';
            validationResult.discountAmount = discountAmount;
        }

        res.json({
            success: true,
            data: validationResult
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error validating coupon',
            error: error.message
        });
    }
});

// @desc    Apply coupon to order
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
    try {
        const { couponCode, customerId, orderAmount } = req.body;

        if (!couponCode) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code is required'
            });
        }

        const coupon = await Coupon.findByCode(couponCode, req.user.store);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        if (!coupon.isCurrentlyActive) {
            return res.status(400).json({
                success: false,
                message: 'Coupon is not currently active'
            });
        }

        // Check if usage limit would be exceeded
        if (coupon.totalUsageLimit && coupon.currentUsageCount >= coupon.totalUsageLimit) {
            return res.status(400).json({
                success: false,
                message: 'Coupon usage limit has been reached'
            });
        }

        // Increment usage count
        coupon.currentUsageCount += 1;
        await coupon.save();

        res.json({
            success: true,
            data: coupon,
            message: 'Coupon applied successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error applying coupon',
            error: error.message
        });
    }
});

// @desc    Get coupon usage statistics
// @route   GET /api/coupons/stats
// @access  Private
const getCouponStats = asyncHandler(async (req, res) => {
    try {
        const now = new Date();
        const stats = await Coupon.aggregate([
            { $match: { store: req.user.store } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    active: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$isActive', true] },
                                        { $lte: ['$validFrom', now] },
                                        { $gte: ['$validTo', now] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    expired: {
                        $sum: {
                            $cond: [{ $lt: ['$validTo', now] }, 1, 0]
                        }
                    },
                    scheduled: {
                        $sum: {
                            $cond: [{ $gt: ['$validFrom', now] }, 1, 0]
                        }
                    },
                    totalUsage: { $sum: '$currentUsageCount' }
                }
            }
        ]);

        const result = stats[0] || {
            total: 0,
            active: 0,
            expired: 0,
            scheduled: 0,
            totalUsage: 0
        };

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching coupon statistics',
            error: error.message
        });
    }
});

module.exports = {
    getCoupons,
    getCouponById,
    getCouponByCode,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getCouponOptions,
    getActiveCoupons,
    getCouponsByType,
    validateCoupon,
    applyCoupon,
  getCouponStats  
};