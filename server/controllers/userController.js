const User = require('../models/User');
const Role = require('../models/Role');
 
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
 
    const filter = {};
    
    if (req.query.role) filter.role = req.query.role;
    // Ensure status is correctly parsed as a boolean
    if (req.query.status !== undefined) {
        filter.isActive = req.query.status === 'true';
    }
    if (req.query.store) filter.store = req.query.store;

    // Search filter for name, email, mobile
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { mobile: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -refreshToken') // Exclude sensitive fields
      .populate('roleDetails') // Populate role details
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { users }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
 
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken') // Exclude sensitive fields
      .populate('roleDetails'); // Populate role details

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
 
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, mobile, store, billType, permissions } = req.body;

    // Check if user already exists by email or mobile
    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or mobile number'
      });
    }

    // Get default role if none provided
    let defaultRole = 'cashier';
    if (!role) {
      // Try to get default role from Role collection
      const cashierRole = await Role.findOne({ roleName: 'cashier', isActive: true });
      if (cashierRole) {
        defaultRole = cashierRole.roleName;
      } else {
        // If no cashier role exists, get any active role
        const anyActiveRole = await Role.findOne({ isActive: true });
        if (anyActiveRole) {
          defaultRole = anyActiveRole.roleName;
        }
      }
    }

    const userData = {
      name,
      email,
      password,
      role: role || defaultRole,
      mobile,
      store: store || 'MG Food Court', // Default store
      billType: billType || 'GST' // Default bill type
    };

    // Set custom permissions if provided and valid
    if (permissions && Array.isArray(permissions)) {
      userData.permissions = permissions;
    }

    const user = await User.create(userData);

    // Remove password and refresh token from the response object before sending
    user.password = undefined;
    user.refreshToken = undefined;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user }
    });
  } catch (error) {
    console.error(error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
 
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent updating password through this route; use change-password route instead
    const { password, ...updateData } = req.body;

    // If email or mobile is being updated, check for uniqueness
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }
    if (updateData.mobile && updateData.mobile !== user.mobile) {
      const existingUser = await User.findOne({ mobile: updateData.mobile });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: 'Mobile number already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Return updated document, run schema validators
    ).select('-password -refreshToken') // Exclude sensitive fields from response
     .populate('roleDetails'); // Populate role details

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
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
      message: 'Error updating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('roleDetails');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if this user has admin role and prevent deleting the last active admin
    if (user.roleDetails && user.roleDetails.roleName === 'admin' && user.isActive) {
      const activeAdminCount = await User.countDocuments({ 
        role: 'admin', 
        isActive: true 
      });
      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last active admin user'
        });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
 
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('roleDetails');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if this user has admin role and prevent deactivating the last active admin
    if (user.roleDetails && user.roleDetails.roleName === 'admin' && user.isActive) {
      const activeAdminCount = await User.countDocuments({ 
        role: 'admin', 
        isActive: true,
        _id: { $ne: user._id } // Exclude the current user from the count
      });
      
      if (activeAdminCount === 0) { // If this user is the only active admin
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the last active admin user'
        });
      }
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error toggling user status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 

const updateUserPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: 'Permissions must be an array'
      });
    }

    const user = await User.findById(req.params.id).populate('roleDetails');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } 

    // Prevent modifying admin permissions if this is the only active admin
    if (user.roleDetails && user.roleDetails.roleName === 'admin' && user.isActive && req.user.id.toString() !== user._id.toString()) {
      const activeAdminCount = await User.countDocuments({ 
        role: 'admin', 
        isActive: true 
      });
      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot modify permissions of the last active admin user'
        });
      }
    }

    user.permissions = permissions;
    await user.save({ validateBeforeSave: false });  

    res.status(200).json({
      success: true,
      message: 'User permissions updated successfully',
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating user permissions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to get available roles
const getAvailableRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true })
      .select('roleName permissions')
      .sort({ roleName: 1 });

    res.status(200).json({
      success: true,
      data: { roles }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available roles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserPermissions,
  getAvailableRoles
};