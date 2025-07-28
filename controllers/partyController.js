const Party = require('../models/Party');

// @desc    Create new party
// @route   POST /api/party
// @access  Private
const createParty = async (req, res) => {
  try {
    const partyData = {
      ...req.body,
      createdBy: req.user.id
    };

    const party = await Party.create(partyData);

    const populatedParty = await Party.findById(party._id)
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Party created successfully',
      data: { party: populatedParty }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating party',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all parties with pagination and filtering
// @route   GET /api/party
// @access  Private
const getParties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    
    // Search filter
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { 'contact.mobile': { $regex: req.query.search, $options: 'i' } },
        { 'contact.email': { $regex: req.query.search, $options: 'i' } },
        { 'business.gstNumber': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const parties = await Party.find(filter)
      .populate('createdBy', 'name')
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
    res.status(500).json({
      success: false,
      message: 'Error fetching parties',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single party
// @route   GET /api/party/:id
// @access  Private
const getParty = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

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
    res.status(500).json({
      success: false,
      message: 'Error fetching party',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update party
// @route   PUT /api/party/:id
// @access  Private
const updateParty = async (req, res) => {
  try {
    let party = await Party.findById(req.params.id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    party = await Party.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      message: 'Party updated successfully',
      data: { party }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating party',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete party
// @route   DELETE /api/party/:id
// @access  Private
const deleteParty = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    // Check if party is used in any transactions
    const Sale = require('../models/Sale');
    const Purchase = require('../models/Purchase');

    const salesCount = await Sale.countDocuments({
      $or: [
        { 'customer.mobile': party.contact.mobile },
        { referrer: party._id }
      ]
    });

    const purchaseCount = await Purchase.countDocuments({ vendor: party._id });

    if (salesCount > 0 || purchaseCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete party as it has associated transactions'
      });
    }

    await Party.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Party deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting party',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get customers
// @route   GET /api/party/customers
// @access  Private
const getCustomers = async (req, res) => {
  try {
    const customers = await Party.find({ type: 'customer', status: 'active' })
      .sort({ name: 1 })
      .select('name contact customerDetails financial');

    res.status(200).json({
      success: true,
      count: customers.length,
      data: { customers }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get vendors
// @route   GET /api/party/vendors
// @access  Private
const getVendors = async (req, res) => {
  try {
    const vendors = await Party.find({ type: 'vendor', status: 'active' })
      .sort({ name: 1 })
      .select('name contact vendorDetails business financial');

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: { vendors }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get referrers
// @route   GET /api/party/referrers
// @access  Private
const getReferrers = async (req, res) => {
  try {
    const referrers = await Party.find({ type: 'referrer', status: 'active' })
      .sort({ name: 1 })
      .select('name contact referrerDetails');

    res.status(200).json({
      success: true,
      count: referrers.length,
      data: { referrers }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching referrers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createParty,
  getParties,
  getParty,
  updateParty,
  deleteParty,
  getCustomers,
  getVendors,
  getReferrers
};