// Import necessary modules
const express = require('express');
const {
    getTokens,
    getTokenById,
    createToken,
    updatePaymentStatus,
    updateToken,
    deleteToken,
    getAvailableItems
} = require('../controllers/tokenController');
const { protect, checkPermission } = require('../middleware/auth');

// Initialize Express router
const router = express.Router();

// Apply the authentication middleware to all token routes
router.use(protect);

// ESSENTIAL ROUTES ONLY

// Available items route - needed for token creation UI
router.route('/available-items')
    .get(checkPermission('token.view'), getAvailableItems);

// Base routes for tokens collection
router.route('/')
    .get(checkPermission('token.view'), getTokens) // GET all tokens with pagination and filtering
    .post(checkPermission('token.create'), createToken); // POST a new token

// Individual token routes
router.route('/:id')
    .get(checkPermission('token.view'), getTokenById) // GET a single token by ID
    .put(checkPermission('token.update'), updateToken) // PUT to update token (handles status, payment, etc.)
    .delete(checkPermission('token.delete'), deleteToken); // DELETE to soft-delete a token
router.route('/:id/payment')
    .put(checkPermission('token.update'), updatePaymentStatus);
module.exports = router;