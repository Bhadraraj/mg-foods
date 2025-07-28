const Offer = require('../models/Offer');

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private
const createOffer = async (req, res) => {
  try {
    const offerData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Handle image upload
    if (req.file) {
      offerData.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    const offer = await Offer.create(offerData);

    const populatedOffer = await Offer.findById(offer._id)
      .populate('conditions.applicableItems', 'name pricing')
      .populate('conditions.applicableCategories', 'name')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: { offer: populatedOffer }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating offer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all offers with pagination and filtering
// @route   GET /api/offers
// @access  Private
const getOffers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    
    // Date range filter for validity
    if (req.query.validFrom || req.query.validTo) {
      if (req.query.validFrom) filter['validity.startDate'] = { $gte: new Date(req.query.validFrom) };
      if (req.query.validTo) filter['validity.endDate'] = { $lte: new Date(req.query.validTo) };
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { offerCode: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const offers = await Offer.find(filter)
      .populate('conditions.applicableItems', 'name')
      .populate('conditions.applicableCategories', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Offer.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: offers.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { offers }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching offers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Private
const getOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('conditions.applicableItems', 'name pricing')
      .populate('conditions.applicableCategories', 'name')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { offer }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching offer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private
const updateOffer = async (req, res) => {
  try {
    let offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    // Handle new image upload
    if (req.file) {
      updateData.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('conditions.applicableItems', 'name')
    .populate('conditions.applicableCategories', 'name');

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: { offer }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating offer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    await Offer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting offer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Validate offer for order
// @route   POST /api/offers/validate
// @access  Public
const validateOffer = async (req, res) => {
  try {
    const { offerCode, orderValue, items, customerId } = req.body;

    const offer = await Offer.findOne({ offerCode, status: 'active' })
      .populate('conditions.applicableItems')
      .populate('conditions.applicableCategories');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found or inactive'
      });
    }

    // Check validity dates
    const now = new Date();
    if (now < offer.validity.startDate || now > offer.validity.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Offer is not valid at this time'
      });
    }

    // Check minimum order value
    if (orderValue < offer.conditions.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${offer.conditions.minOrderValue} required`
      });
    }

    // Check usage limit
    if (offer.conditions.usageLimit && offer.usage.totalUsed >= offer.conditions.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Offer usage limit exceeded'
      });
    }

    // Calculate discount
    let discountAmount = 0;
    
    if (offer.type === 'discount') {
      if (offer.discountType === 'percentage') {
        discountAmount = (orderValue * offer.discountValue) / 100;
      } else {
        discountAmount = offer.discountValue;
      }

      // Apply maximum discount limit
      if (offer.conditions.maxDiscountAmount && discountAmount > offer.conditions.maxDiscountAmount) {
        discountAmount = offer.conditions.maxDiscountAmount;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Offer is valid',
      data: {
        offer: {
          id: offer._id,
          name: offer.name,
          offerCode: offer.offerCode,
          type: offer.type,
          discountAmount
        },
        discountAmount,
        finalAmount: orderValue - discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating offer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get active offers
// @route   GET /api/offers/active
// @access  Public
const getActiveOffers = async (req, res) => {
  try {
    const now = new Date();
    
    const activeOffers = await Offer.find({
      status: 'active',
      'validity.startDate': { $lte: now },
      'validity.endDate': { $gte: now }
    })
    .populate('conditions.applicableItems', 'name pricing')
    .populate('conditions.applicableCategories', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activeOffers.length,
      data: { offers: activeOffers }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active offers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  validateOffer,
  getActiveOffers
};