const express = require('express');
const {
    getPurchases,
    getPurchaseById,
    createPurchase,
    updatePurchase,
    deletePurchase,
    updatePurchaseStatus,
    completeStockEntry,
    addProductsToRack,
    getPurchaseStats,
    getAvailableItems,
    getVendorsForPurchase,
    getBrandsForPurchase,
    updatePaymentStatus,
    updateLedgerEntries,
    transferStock,
    getPurchaseByPurchaseId,
     completePurchaseOrder,
    completePurchaseInvoice,
    completeInvoice,
    completeFulfillment,
    completeRackAssignment,
    completeWorkflow
} = require('../controllers/purchaseController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);



 
router.route('/stats')
    .get(checkPermission('purchase.view'), getPurchaseStats);

// Helper routes for dropdowns
router.route('/available-items')
    .get(checkPermission('purchase.view'), getAvailableItems);

router.route('/vendors')
    .get(checkPermission('purchase.view'), getVendorsForPurchase);

router.route('/brands')
    .get(checkPermission('purchase.view'), getBrandsForPurchase);

// Get purchase by purchase ID (not MongoDB _id)
router.route('/by-purchase-id/:purchaseId')
    .get(checkPermission('purchase.view'), getPurchaseByPurchaseId);

// Main CRUD routes
router.route('/')
    .get(checkPermission('purchase.view'), getPurchases)
    .post(checkPermission('purchase.create'), createPurchase);

router.route('/:id')
    .get(checkPermission('purchase.view'), getPurchaseById)
    .put(checkPermission('purchase.update'), updatePurchase)
    .delete(checkPermission('purchase.delete'), deletePurchase);

// Status management routes
router.route('/:id/status')
    .put(checkPermission('purchase.update'), updatePurchaseStatus);

router.route('/:id/payment-status')
    .put(checkPermission('purchase.update'), updatePaymentStatus);

// Stock management routes
router.route('/:id/stock-entry')
    .post(checkPermission('purchase.update'), completeStockEntry);


    router.route('/:id/complete-po')
    .post(checkPermission('purchase.update'), completePurchaseOrder);

// Step 2: Complete Purchase Invoice (PI)
router.route('/:id/complete-pi')
    .post(checkPermission('purchase.update'), completePurchaseInvoice);

// Step 3: Complete Final Invoice
router.route('/:id/complete-invoice')
    .put(checkPermission('purchase.update'), completeInvoice);

// Step 4: Complete Fulfillment (after invoice)
router.route('/:id/complete-fulfillment')
    .put(checkPermission('purchase.update'), completeFulfillment);

// Step 5: Complete Stock Entry (existing function - enhanced)
router.route('/:id/stock-entry')
    .post(checkPermission('purchase.update'), completeStockEntry);

// Step 6: Complete Product to Rack Assignment
router.route('/:id/complete-rack-assignment')
    .put(checkPermission('purchase.update'), completeRackAssignment);

// Complete entire workflow in one call
router.route('/:id/complete-workflow')
    .put(checkPermission('purchase.update'), completeWorkflow);


    
router.route('/:id/add-to-rack')
    .post(checkPermission('purchase.update'), addProductsToRack);

router.route('/:id/transfer-stock')
    .post(checkPermission('purchase.update'), transferStock);

// Ledger management route
router.route('/:id/ledger')
    .put(checkPermission('purchase.update'), updateLedgerEntries);

module.exports = router;