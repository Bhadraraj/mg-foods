const express = require('express');
const {
    getLedgers,
    getLedgerById,
    createLedger,
    updateLedger,
    deleteLedger,
    toggleLedgerStatus,
    getLedgerOptions,
    getTaxLedgers,
    getLedgersByCategory
} = require('../controllers/ledgerController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Get ledger options (categories, groups, tax percentages)
router.route('/options')
    .get(checkPermission('ledger.view'), getLedgerOptions);

// Get tax ledgers only
router.route('/tax-ledgers')
    .get(checkPermission('ledger.view'), getTaxLedgers);

// Get ledgers by category
router.route('/by-category/:category')
    .get(checkPermission('ledger.view'), getLedgersByCategory);

// Main CRUD routes
router.route('/')
    .get(checkPermission('ledger.view'), getLedgers)
    .post(checkPermission('ledger.create'), createLedger);

// Toggle status route
router.route('/:id/toggle-status')
    .patch(checkPermission('ledger.update'), toggleLedgerStatus);

// Individual ledger routes
router.route('/:id')
    .get(checkPermission('ledger.view'), getLedgerById)
    .put(checkPermission('ledger.update'), updateLedger)
    .delete(checkPermission('ledger.delete'), deleteLedger);

module.exports = router;