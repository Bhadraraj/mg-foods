const express = require('express');
const {
    getReferrerPoints,
    getReferrerPointsSummary,
    getReferrerPointById,
    createReferrerPoint,
    updateReferrerPoint,
    deleteReferrerPoint,
    redeemReferrerPoints,
    getReferrerPointOptions,
    getCustomerTransactions
} = require('../controllers/referrerPointController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Get referrer point options (commission types, transaction types, referrers, etc.)
router.route('/options')
    .get(checkPermission('referrer_point.view'), getReferrerPointOptions);

// Get summary of all referrer points grouped by customer
router.route('/summary')
    .get(checkPermission('referrer_point.view'), getReferrerPointsSummary);

// Redeem points
router.route('/redeem')
    .post(checkPermission('referrer_point.create'), redeemReferrerPoints);

// Get customer specific transactions and summary
router.route('/customer/:customerId')
    .get(checkPermission('referrer_point.view'), getCustomerTransactions);

// Main CRUD routes
router.route('/')
    .get(checkPermission('referrer_point.view'), getReferrerPoints)
    .post(checkPermission('referrer_point.create'), createReferrerPoint);

// Individual referrer point record routes
router.route('/:id')
    .get(checkPermission('referrer_point.view'), getReferrerPointById)
    .put(checkPermission('referrer_point.update'), updateReferrerPoint)
    .delete(checkPermission('referrer_point.delete'), deleteReferrerPoint);

module.exports = router;