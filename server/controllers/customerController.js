const Customer = require('../models/Customer');

// Helper function to build query filter
const buildCustomerFilter = (reqQuery) => {
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

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private (customer.view)
const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = buildCustomerFilter(req.query);

    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: customers.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { customers }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private (customer.view)
const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { customer }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private (customer.create)
const createCustomer = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check for unique mobile number
    const existingCustomer = await Customer.findOne({ mobileNumber });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this mobile number already exists'
      });
    }

    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: { customer }
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
      message: 'Error creating customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private (customer.update)
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const { mobileNumber, ...updateData } = req.body;

    // Check for unique mobile number if it's being updated
    if (mobileNumber && mobileNumber !== customer.mobileNumber) {
      const existingCustomer = await Customer.findOne({ mobileNumber });
      if (existingCustomer && existingCustomer._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: 'Mobile number already in use by another customer' });
      }
      updateData.mobileNumber = mobileNumber;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: { customer: updatedCustomer }
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
      message: 'Error updating customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (customer.delete)
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Add checks here if a customer cannot be deleted if associated with sales
    // For now, assuming direct deletion is allowed.

    await Customer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle customer status (active/inactive)
// @route   PUT /api/customers/:id/toggle-status
// @access  Private (customer.update)
const toggleCustomerStatus = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        customer.isActive = !customer.isActive;
        await customer.save();

        res.status(200).json({
            success: true,
            message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { customer }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error toggling customer status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  toggleCustomerStatus
};
