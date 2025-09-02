const express = require('express');
const {
    getCoupons,
    getCouponById,
    getCouponByCode,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getCouponOptions,
    getActiveCoupons,
    getCouponsByType,
    validateCoupon,
    applyCoupon,
    getCouponStats  // Add this import
} = require('../controllers/couponController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Get coupon statistics - Add this route
router.route('/stats')
    .get(checkPermission('coupon.view'), getCouponStats);

// Get coupon options (coupon types, discount types, applicable types, customer groups, etc.)
router.route('/options')
    .get(checkPermission('coupon.view'), getCouponOptions);

// Get active coupons only
router.route('/active')
    .get(checkPermission('coupon.view'), getActiveCoupons);

// Validate coupon for order
router.route('/validate')
    .post(checkPermission('coupon.view'), validateCoupon);

// Apply coupon to order (increment usage count)
router.route('/apply')
    .post(checkPermission('coupon.view'), applyCoupon);

// Get coupons by type (Promotional, Loyalty, Welcome, Seasonal, Referral)
router.route('/by-type/:type')
    .get(checkPermission('coupon.view'), getCouponsByType);

// Get coupon by code
router.route('/code/:code')
    .get(checkPermission('coupon.view'), getCouponByCode);

// Main CRUD routes
router.route('/')
    .get(checkPermission('coupon.view'), getCoupons)
    .post(checkPermission('coupon.create'), createCoupon);

// Toggle status route
router.route('/:id/toggle-status')
    .patch(checkPermission('coupon.update'), toggleCouponStatus);

// Individual coupon routes
router.route('/:id')
    .get(checkPermission('coupon.view'), getCouponById)
    .put(checkPermission('coupon.update'), updateCoupon)
    .delete(checkPermission('coupon.delete'), deleteCoupon);

module.exports = router;