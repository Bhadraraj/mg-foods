const express = require('express');
const {
  createPurchase,
  getPurchases,
  getPurchase,
  updatePurchase,
  deletePurchase,
  updatePurchaseStatus,
  getPurchaseStats
} = require('../controllers/purchaseController');
const { protect, checkPermission } = require('../middleware/auth');
const { purchaseValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(checkPermission('purchase.view'), getPurchases)
  .post(checkPermission('purchase.create'), purchaseValidationRules(), handleValidationErrors, createPurchase);

router.get('/stats', checkPermission('purchase.view'), getPurchaseStats);

router.route('/:id')
  .get(checkPermission('purchase.view'), getPurchase)
  .put(checkPermission('purchase.update'), updatePurchase)
  .delete(checkPermission('purchase.delete'), deletePurchase);

router.put('/:id/status', checkPermission('purchase.update'), updatePurchaseStatus);

module.exports = router;