const express = require('express');
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  toggleRoleStatus,
  updateRolePermissions
} = require('../controllers/roleController');
const { protect, authorize, checkPermission } = require('../middleware/auth');
const { roleValidationRules, handleValidationErrors } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Ensure only 'admin' role can access role management routes
// This middleware applies to all routes defined AFTER it in this router.
router.use(authorize('admin')); 

router.route('/')
  .get(checkPermission('roles.view'), getRoles)
  .post(checkPermission('roles.create'), roleValidationRules(), handleValidationErrors, createRole);

router.route('/:id')
  .get(checkPermission('roles.view'), getRole)
  .put(
    checkPermission('roles.update'), 
    roleValidationRules().filter(rule => 
      rule.builder.fields.includes('roleName') || 
      rule.builder.fields.includes('permissions') ||
      rule.builder.fields.includes('isActive') // Include isActive for update validation if needed
    ), 
    handleValidationErrors, 
    updateRole
  )
  .delete(checkPermission('roles.delete'), deleteRole);

router.put('/:id/toggle-status', checkPermission('roles.update'), toggleRoleStatus);
router.put('/:id/permissions', 
  checkPermission('roles.update'), 
  body('permissions').isArray().withMessage('Permissions must be an array'),
  handleValidationErrors, 
  updateRolePermissions
);

module.exports = router;
