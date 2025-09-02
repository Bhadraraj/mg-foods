const Role = require('../models/Role');
const User = require('../models/User'); // Needed to check if roles are in use

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private (Admin)
const getRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status !== undefined) {
        filter.isActive = req.query.status === 'true';
    }
    if (req.query.search) {
        filter.roleName = { $regex: req.query.search, $options: 'i' };
    }

    const roles = await Role.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Role.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: roles.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { roles }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Private (Admin)
const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new role
// @route   POST /api/roles
// @access  Private (Admin)
const createRole = async (req, res) => {
  try {
    const { roleName, permissions } = req.body;

    // Check if role name already exists
    const existingRole = await Role.findOne({ roleName: { $regex: new RegExp(`^${roleName}$`, 'i') } });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    const roleData = { roleName };
    if (permissions && Array.isArray(permissions)) {
      roleData.permissions = permissions;
    }

    const role = await Role.create(roleData);

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: { role }
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
      message: 'Error creating role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private (Admin)
const updateRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const { roleName, permissions, isActive } = req.body;
    const updateData = {};

    if (roleName !== undefined) {
      // Check for duplicate role name if it's being changed
      if (roleName.toLowerCase() !== role.roleName.toLowerCase()) {
        const existingRole = await Role.findOne({ roleName: { $regex: new RegExp(`^${roleName}$`, 'i') } });
        if (existingRole && existingRole._id.toString() !== req.params.id) {
          return res.status(400).json({ success: false, message: 'Role with this name already exists' });
        }
      }
      updateData.roleName = roleName;
    }
    if (permissions !== undefined) {
      if (!Array.isArray(permissions)) {
        return res.status(400).json({ success: false, message: 'Permissions must be an array' });
      }
      updateData.permissions = permissions;
    }
    if (isActive !== undefined) {
        // Prevent deactivating a role if active users are assigned to it
        if (isActive === false) {
            const usersWithRole = await User.countDocuments({ role: role.roleName, isActive: true });
            if (usersWithRole > 0) {
                return res.status(400).json({ success: false, message: `Cannot deactivate role. ${usersWithRole} active user(s) are currently assigned to it.` });
            }
        }
        updateData.isActive = isActive;
    }

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: { role: updatedRole }
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
      message: 'Error updating role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private (Admin)
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Prevent deleting a role if any user is assigned to it
    const usersWithRole = await User.countDocuments({ role: role.roleName });
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. ${usersWithRole} user(s) are currently assigned to it.`
      });
    }

    await Role.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle role status (active/inactive)
// @route   PUT /api/roles/:id/toggle-status
// @access  Private (Admin)
const toggleRoleStatus = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        // If trying to deactivate, check if any active users are assigned
        if (role.isActive === true) {
            const usersWithRole = await User.countDocuments({ role: role.roleName, isActive: true });
            if (usersWithRole > 0) {
                return res.status(400).json({ success: false, message: `Cannot deactivate role. ${usersWithRole} active user(s) are currently assigned to it.` });
            }
        }

        role.isActive = !role.isActive;
        await role.save();

        res.status(200).json({
            success: true,
            message: `Role ${role.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error toggling role status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update role permissions
// @route   PUT /api/roles/:id/permissions
// @access  Private (Admin)
const updateRolePermissions = async (req, res) => {
    try {
        const { permissions } = req.body;

        if (!Array.isArray(permissions)) {
            return res.status(400).json({ success: false, message: 'Permissions must be an array' });
        }

        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        role.permissions = permissions;
        await role.save({ validateBeforeSave: false }); // Bypass validation if needed for permissions

        res.status(200).json({
            success: true,
            message: 'Role permissions updated successfully',
            data: { role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating role permissions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  toggleRoleStatus,
  updateRolePermissions
};
