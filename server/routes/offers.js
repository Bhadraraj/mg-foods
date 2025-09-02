const express = require('express');
const {
    getOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
    getOfferOptions,
    getActiveOffers,
    getOffersByType,
    validateOffer
} = require('../controllers/offerController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Get offer options (discount types, applicable types, customer groups, etc.)
router.route('/options')
    .get(checkPermission('offer.view'), getOfferOptions);

// Get active offers only
router.route('/active')
    .get(checkPermission('offer.view'), getActiveOffers);

// Validate offer for order
router.route('/validate')
    .post(checkPermission('offer.view'), validateOffer);

// Get offers by type (Product, Category, Store, Customer Group)
router.route('/by-type/:type')
    .get(checkPermission('offer.view'), getOffersByType);

// Main CRUD routes
router.route('/')
    .get(checkPermission('offer.view'), getOffers)
    .post(checkPermission('offer.create'), createOffer);

// Toggle status route
router.route('/:id/toggle-status')
    .patch(checkPermission('offer.update'), toggleOfferStatus);

// Individual offer routes
router.route('/:id')
    .get(checkPermission('offer.view'), getOfferById)
    .put(checkPermission('offer.update'), updateOffer)
    .delete(checkPermission('offer.delete'), deleteOffer);

module.exports = router;