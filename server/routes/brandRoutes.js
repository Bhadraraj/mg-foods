const express = require('express');
const {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
    getAvailableItems,
    assignItemsToBrand,
    removeItemsFromBrand
} = require('../controllers/brandController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Routes
router.route('/')
    .get(checkPermission('brand.view'), getBrands)
    .post(checkPermission('brand.create'), createBrand);

router.route('/available-items')
    .get(checkPermission('brand.view'), getAvailableItems);

router.route('/:id')
    .get(checkPermission('brand.view'), getBrandById)
    .put(checkPermission('brand.update'), updateBrand)
    .delete(checkPermission('brand.delete'), deleteBrand);

router.route('/:id/items')
    .post(checkPermission('brand.update'), assignItemsToBrand)
    .delete(checkPermission('brand.update'), removeItemsFromBrand);

module.exports = router;