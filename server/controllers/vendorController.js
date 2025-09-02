const Vendor = require('../models/Vendor');

// Helper function to build query filter
const buildVendorFilter = (reqQuery) => {
    const filter = {};
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

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Private (vendor.view)
const getVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = buildVendorFilter(req.query);

    const vendors = await Vendor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Vendor.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: vendors.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { vendors }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Private (vendor.view)
const getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { vendor }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new vendor
// @route   POST /api/vendors
// @access  Private (vendor.create)
const createVendor = async (req, res) => {
  try {
    const { mobileNumber, vendorCode } = req.body;

    // Check for unique mobile number
    const existingVendorByMobile = await Vendor.findOne({ mobileNumber });
    if (existingVendorByMobile) {
      return res.status(400).json({
        success: false,
        message: 'Vendor with this mobile number already exists'
      });
    }

    // Check for unique vendor code
    if (vendorCode) {
        const existingVendorByCode = await Vendor.findOne({ vendorCode });
        if (existingVendorByCode) {
            return res.status(400).json({
                success: false,
                message: 'Vendor with this code already exists'
            });
        }
    }

    const vendor = await Vendor.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: { vendor }
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
      message: 'Error creating vendor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private (vendor.update)
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    const { mobileNumber, vendorCode, ...updateData } = req.body;

    // Check for unique mobile number if it's being updated
    if (mobileNumber && mobileNumber !== vendor.mobileNumber) {
      const existingVendor = await Vendor.findOne({ mobileNumber });
      if (existingVendor && existingVendor._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: 'Mobile number already in use by another vendor' });
      }
      updateData.mobileNumber = mobileNumber;
    }

    // Check for unique vendor code if it's being updated
    if (vendorCode && vendorCode !== vendor.vendorCode) {
        const existingVendor = await Vendor.findOne({ vendorCode });
        if (existingVendor && existingVendor._id.toString() !== req.params.id) {
            return res.status(400).json({ success: false, message: 'Vendor code already in use by another vendor' });
        }
        updateData.vendorCode = vendorCode;
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Vendor updated successfully',
      data: { vendor: updatedVendor }
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
      message: 'Error updating vendor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private (vendor.delete)
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Add checks here if a vendor cannot be deleted if associated with purchases
    // For now, assuming direct deletion is allowed.

    await Vendor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vendor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle vendor status (active/inactive)
// @route   PUT /api/vendors/:id/toggle-status
// @access  Private (vendor.update)
const toggleVendorStatus = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        vendor.isActive = !vendor.isActive;
        await vendor.save();

        res.status(200).json({
            success: true,
            message: `Vendor ${vendor.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { vendor }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error toggling vendor status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  toggleVendorStatus
};
