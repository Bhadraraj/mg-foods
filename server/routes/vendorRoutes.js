const express = require('express');
const {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  toggleVendorStatus
} = require('../controllers/vendorController');
const { protect, checkPermission } = require('../middleware/auth');
// Removed: const { vendorValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes in this file are protected
router.use(protect);

router.route('/')
  .get(checkPermission('vendor.view'), getVendors)
  .post(
    checkPermission('vendor.create'),
    // Removed validation middleware as per request
    createVendor
  );

router.route('/:id')
  .get(checkPermission('vendor.view'), getVendor)
  .put(
    checkPermission('vendor.update'),
    // Removed validation middleware as per request
    updateVendor
  )
  .delete(checkPermission('vendor.delete'), deleteVendor);

router.put('/:id/toggle-status', checkPermission('vendor.update'), toggleVendorStatus);

module.exports = router;
