const Party = require('../models/Party');

// Helper function to build query filter
const buildPartyFilter = (reqQuery) => {
    const filter = {};
    if (reqQuery.type) filter.type = reqQuery.type;
    if (reqQuery.status !== undefined) filter.isActive = reqQuery.status === 'true';

    if (reqQuery.search) {
        filter.$or = [
            { name: { $regex: reqQuery.search, $options: 'i' } },
            { mobileNumber: { $regex: reqQuery.search, $options: 'i' } },
            { gstNumber: { $regex: reqQuery.search, $options: 'i' } },
            { address: { $regex: reqQuery.search, $options: 'i' } },
            { location: { $regex: reqQuery.search, $options: 'i' } },
            { vendorCode: { $regex: reqQuery.search, $options: 'i' } }
        ];
    }
    return filter;
};

// @desc    Get all parties (customers, vendors, referrers)
// @route   GET /api/parties
// @access  Private (party.view)
const getParties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = buildPartyFilter(req.query);

    const parties = await Party.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Party.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: parties.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { parties }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching parties',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single party
// @route   GET /api/parties/:id
// @access  Private (party.view)
const getParty = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { party }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching party',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new party
// @route   POST /api/parties
// @access  Private (party.create)
const createParty = async (req, res) => {
  try {
    const { mobileNumber, vendorCode } = req.body;

    // Check for unique mobile number
    const existingPartyByMobile = await Party.findOne({ mobileNumber });
    if (existingPartyByMobile) {
      return res.status(400).json({
        success: false,
        message: 'Party with this mobile number already exists'
      });
    }

    // Check for unique vendor code if type is 'vendor'
    if (req.body.type === 'vendor' && vendorCode) {
        const existingPartyByVendorCode = await Party.findOne({ vendorCode });
        if (existingPartyByVendorCode) {
            return res.status(400).json({
                success: false,
                message: 'Vendor with this code already exists'
            });
        }
    }

    const party = await Party.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Party created successfully',
      data: { party }
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
      message: 'Error creating party',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update party
// @route   PUT /api/parties/:id
// @access  Private (party.update)
const updateParty = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    const { mobileNumber, vendorCode, ...updateData } = req.body;

    // Check for unique mobile number if it's being updated
    if (mobileNumber && mobileNumber !== party.mobileNumber) {
      const existingParty = await Party.findOne({ mobileNumber });
      if (existingParty && existingParty._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: 'Mobile number already in use by another party' });
      }
      updateData.mobileNumber = mobileNumber;
    }

    // Check for unique vendor code if it's a vendor and code is being updated
    if (party.type === 'vendor' && vendorCode && vendorCode !== party.vendorCode) {
        const existingParty = await Party.findOne({ vendorCode });
        if (existingParty && existingParty._id.toString() !== req.params.id) {
            return res.status(400).json({ success: false, message: 'Vendor code already in use by another vendor' });
        }
        updateData.vendorCode = vendorCode;
    }

    const updatedParty = await Party.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Return updated document, run schema validators
    );

    res.status(200).json({
      success: true,
      message: 'Party updated successfully',
      data: { party: updatedParty }
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
      message: 'Error updating party',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete party
// @route   DELETE /api/parties/:id
// @access  Private (party.delete)
const deleteParty = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    // Add checks here if a party (customer/vendor) cannot be deleted if associated with sales/purchases
    // For now, assuming direct deletion is allowed.

    await Party.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Party deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting party',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle party status (active/inactive)
// @route   PUT /api/parties/:id/toggle-status
// @access  Private (party.update)
const togglePartyStatus = async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);

        if (!party) {
            return res.status(404).json({ success: false, message: 'Party not found' });
        }

        party.isActive = !party.isActive;
        await party.save();

        res.status(200).json({
            success: true,
            message: `Party ${party.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { party }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error toggling party status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = {
  getParties,
  getParty,
  createParty,
  updateParty,
  deleteParty,
  togglePartyStatus
};
