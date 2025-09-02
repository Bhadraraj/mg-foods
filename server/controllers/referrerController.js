const Referrer = require('../models/Referrer');

// Helper function to build query filter
const buildReferrerFilter = (reqQuery) => {
    const filter = {};
    if (reqQuery.status !== undefined) filter.isActive = reqQuery.status === 'true';

    if (reqQuery.search) {
        filter.$or = [
            { name: { $regex: reqQuery.search, $options: 'i' } },
            { mobileNumber: { $regex: reqQuery.search, $options: 'i' } },
            { gstNumber: { $regex: reqQuery.search, $options: 'i' } },
            { address: { $regex: reqQuery.search, $options: 'i' } },
            { location: { $regex: reqQuery.search, $options: 'i' } }
        ];
    }
    return filter;
};

// @desc    Get all referrers
// @route   GET /api/referrers
// @access  Private (referrer.view)
const getReferrers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = buildReferrerFilter(req.query);

    const referrers = await Referrer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Referrer.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: referrers.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { referrers }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching referrers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single referrer
// @route   GET /api/referrers/:id
// @access  Private (referrer.view)
const getReferrer = async (req, res) => {
  try {
    const referrer = await Referrer.findById(req.params.id);

    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Referrer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { referrer }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching referrer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new referrer
// @route   POST /api/referrers
// @access  Private (referrer.create)
const createReferrer = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check for unique mobile number
    const existingReferrer = await Referrer.findOne({ mobileNumber });
    if (existingReferrer) {
      return res.status(400).json({
        success: false,
        message: 'Referrer with this mobile number already exists'
      });
    }

    const referrer = await Referrer.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Referrer created successfully',
      data: { referrer }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating referrer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update referrer
// @route   PUT /api/referrers/:id
// @access  Private (referrer.update)
const updateReferrer = async (req, res) => {
  try {
    const referrer = await Referrer.findById(req.params.id);

    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Referrer not found'
      });
    }

    const { mobileNumber, ...updateData } = req.body;

    // Check for unique mobile number if it's being updated
    if (mobileNumber && mobileNumber !== referrer.mobileNumber) {
      const existingReferrer = await Referrer.findOne({ mobileNumber });
      if (existingReferrer && existingReferrer._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: 'Mobile number already in use by another referrer' });
      }
      updateData.mobileNumber = mobileNumber;
    }

    const updatedReferrer = await Referrer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Referrer updated successfully',
      data: { referrer: updatedReferrer }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating referrer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete referrer
// @route   DELETE /api/referrers/:id
// @access  Private (referrer.delete)
const deleteReferrer = async (req, res) => {
  try {
    const referrer = await Referrer.findById(req.params.id);

    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Referrer not found'
      });
    }

    // Add checks here if a referrer cannot be deleted if associated with sales/etc.
    // For now, assuming direct deletion is allowed.

    await Referrer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Referrer deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting referrer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle referrer status (active/inactive)
// @route   PUT /api/referrers/:id/toggle-status
// @access  Private (referrer.update)
const toggleReferrerStatus = async (req, res) => {
    try {
        const referrer = await Referrer.findById(req.params.id);

        if (!referrer) {
            return res.status(404).json({ success: false, message: 'Referrer not found' });
        }

        referrer.isActive = !referrer.isActive;
        await referrer.save();

        res.status(200).json({
            success: true,
            message: `Referrer ${referrer.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { referrer }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error toggling referrer status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = {
  getReferrers,
  getReferrer,
  createReferrer,
  updateReferrer,
  deleteReferrer,
  toggleReferrerStatus
};
