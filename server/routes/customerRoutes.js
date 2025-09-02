const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  toggleCustomerStatus
} = require('../controllers/customerController');
const { protect, checkPermission } = require('../middleware/auth');
// Removed: const { customerValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes in this file are protected
router.use(protect);

router.route('/')
  .get(checkPermission('customer.view'), getCustomers)
  .post(
    checkPermission('customer.create'),
    // Removed validation middleware as per request
    createCustomer
  );

router.route('/:id')
  .get(checkPermission('customer.view'), getCustomer)
  .put(
    checkPermission('customer.update'),
    // Removed validation middleware as per request
    updateCustomer
  )
  .delete(checkPermission('customer.delete'), deleteCustomer);

router.put('/:id/toggle-status', checkPermission('customer.update'), toggleCustomerStatus);

module.exports = router;
