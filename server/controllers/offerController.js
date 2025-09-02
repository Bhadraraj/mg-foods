const Offer = require('../models/Offer');
const asyncHandler = require('express-async-handler');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Private
const getOffers = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search,
        status,
        discountType,
        applicableType,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { store: req.user.store };

    // Search functionality
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { slug: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Status filter
    if (status) {
        const now = new Date();
        switch (status) {
            case 'Running':
                filter.isActive = true;
                filter.offerEffectiveFrom = { $lte: now };
                filter.offerEffectiveUpto = { $gte: now };
                break;
            case 'Inactive':
                filter.isActive = false;
                break;
            case 'Expired':
                filter.offerEffectiveUpto = { $lt: now };
                break;
            case 'Scheduled':
                filter.offerEffectiveFrom = { $gt: now };
                break;
        }
    }

    // Discount type filter
    if (discountType) {
        filter.discountType = discountType;
    }

    // Applicable type filter
    if (applicableType) {
        filter.applicableType = applicableType;
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
        const offers = await Offer.find(filter)
            .populate(options.populate)
            .sort(options.sort)
            .limit(options.limit * 1)
            .skip((options.page - 1) * options.limit)
            .exec();

        const total = await Offer.countDocuments(filter);

        res.json({
            success: true,
            data: offers,
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
            message: 'Error fetching offers',
            error: error.message
        });
    }
});

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Private
const getOfferById = asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');

    if (!offer) {
        return res.status(404).json({
            success: false,
            message: 'Offer not found'
        });
    }

    res.json({
        success: true,
        data: offer
    });
});

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private
const createOffer = asyncHandler(async (req, res) => {
    try {
        const offerData = {
            ...req.body,
            store: req.user.store,
            createdBy: req.user._id
        };

        const offer = await Offer.create(offerData);

        // Populate the created offer
        await offer.populate([
            { path: 'createdBy', select: 'name email' }
        ]);

        res.status(201).json({
            success: true,
            data: offer,
            message: 'Offer created successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Offer with this ${field} already exists`
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
            message: 'Error creating offer',
            error: error.message
        });
    }
});

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private
const updateOffer = asyncHandler(async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                offer[key] = req.body[key];
            }
        });

        offer.updatedBy = req.user._id;
        
        await offer.save();

        // Populate the updated offer
        await offer.populate([
            { path: 'createdBy', select: 'name email' },
            { path: 'updatedBy', select: 'name email' }
        ]);

        res.json({
            success: true,
            data: offer,
            message: 'Offer updated successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Offer with this ${field} already exists`
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
            message: 'Error updating offer',
            error: error.message
        });
    }
});

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private
const deleteOffer = asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
        return res.status(404).json({
            success: false,
            message: 'Offer not found'
        });
    }

    await offer.deleteOne();

    res.json({
        success: true,
        message: 'Offer deleted successfully'
    });
});

// @desc    Toggle offer status
// @route   PATCH /api/offers/:id/toggle-status
// @access  Private
const toggleOfferStatus = asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
        return res.status(404).json({
            success: false,
            message: 'Offer not found'
        });
    }

    offer.isActive = !offer.isActive;
    offer.updatedBy = req.user._id;
    
    await offer.save();

    res.json({
        success: true,
        data: offer,
        message: `Offer ${offer.isActive ? 'activated' : 'deactivated'} successfully`
    });
});

// @desc    Get offer options for dropdowns
// @route   GET /api/offers/options
// @access  Private
const getOfferOptions = asyncHandler(async (req, res) => {
    const discountTypes = ['Percentage', 'Fixed Amount', 'Buy One Get One', 'Flat Discount'];
    const applicableTypes = ['Product', 'Category', 'Store', 'Customer Group'];
    const customerGroups = ['All', 'Premium', 'Regular', 'New', 'VIP'];
    const statusOptions = ['Running', 'Inactive', 'Expired', 'Scheduled'];

    res.json({
        success: true,
        data: {
            discountTypes,
            applicableTypes,
            customerGroups,
            statusOptions
        }
    });
});

// @desc    Get active offers
// @route   GET /api/offers/active
// @access  Private
const getActiveOffers = asyncHandler(async (req, res) => {
    const now = new Date();
    
    const offers = await Offer.find({
        store: req.user.store,
        isActive: true,
        isVisible: true,
        offerEffectiveFrom: { $lte: now },
        offerEffectiveUpto: { $gte: now }
    })
    .sort({ priority: -1, createdAt: -1 })
    .populate('createdBy', 'name email');

    res.json({
        success: true,
        data: offers
    });
});

// @desc    Get offers by type
// @route   GET /api/offers/by-type/:type
// @access  Private
const getOffersByType = asyncHandler(async (req, res) => {
    const { type } = req.params;
    
    if (!['Product', 'Category', 'Store', 'Customer Group'].includes(type)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid offer type'
        });
    }

    const offers = await Offer.find({
        store: req.user.store,
        applicableType: type,
        isActive: true
    })
    .sort({ priority: -1, createdAt: -1 })
    .populate('createdBy', 'name email');

    res.json({
        success: true,
        data: offers
    });
});

// @desc    Validate offer applicability
// @route   POST /api/offers/validate
// @access  Private
const validateOffer = asyncHandler(async (req, res) => {
    const { offerSlug, orderAmount, orderItems, customerId } = req.body;

    const offer = await Offer.findOne({ 
        slug: offerSlug, 
        store: req.user.store 
    });

    if (!offer) {
        return res.status(404).json({
            success: false,
            message: 'Offer not found'
        });
    }

    const validationResult = {
        valid: false,
        message: '',
        discountAmount: 0
    };

    // Check if offer is currently active
    if (!offer.isCurrentlyActive) {
        validationResult.message = 'Offer is not currently active';
        return res.json({ success: true, data: validationResult });
    }

    // Check minimum order amount
    if (offer.minOrderAmount > 0 && orderAmount < offer.minOrderAmount) {
        validationResult.message = `Minimum order amount of ₹${offer.minOrderAmount} required`;
        return res.json({ success: true, data: validationResult });
    }

    // Check minimum order quantity
    if (offer.minOrderQuantity > 0) {
        const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
        if (totalQuantity < offer.minOrderQuantity) {
            validationResult.message = `Minimum order quantity of ${offer.minOrderQuantity} items required`;
            return res.json({ success: true, data: validationResult });
        }
    }

    // Calculate discount
    let discountAmount = 0;
    switch (offer.discountType) {
        case 'Percentage':
            discountAmount = (orderAmount * offer.discount) / 100;
            break;
        case 'Fixed Amount':
            discountAmount = offer.discount;
            break;
        case 'Flat Discount':
            discountAmount = offer.discount;
            break;
        // Add more discount type calculations as needed
    }

    validationResult.valid = true;
    validationResult.message = 'Offer is valid';
    validationResult.discountAmount = discountAmount;

    res.json({
        success: true,
        data: validationResult
    });
});

module.exports = {
    getOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
    getOfferOptions,
    getActiveOffers,
    getOffersByType,
    validateOffer
};