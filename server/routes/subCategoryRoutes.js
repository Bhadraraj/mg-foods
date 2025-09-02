const express = require('express');
const {
    getSubCategories,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getAvailableItems,
    assignItemsToSubCategory,
    removeItemsFromSubCategory,
    getSubCategoriesByCategory
} = require('../controllers/subCategoryController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Routes
router.route('/')
    .get(checkPermission('itemSubCategory.view'), getSubCategories)
    .post(checkPermission('itemSubCategory.create'), createSubCategory);

router.route('/available-items')
    .get(checkPermission('itemSubCategory.view'), getAvailableItems);

router.route('/by-category/:categoryId')
    .get(checkPermission('itemSubCategory.view'), getSubCategoriesByCategory);

router.route('/:id')
    .get(checkPermission('itemSubCategory.view'), getSubCategoryById)
    .put(checkPermission('itemSubCategory.update'), updateSubCategory)
    .delete(checkPermission('itemSubCategory.delete'), deleteSubCategory);

router.route('/:id/items')
    .post(checkPermission('itemSubCategory.update'), assignItemsToSubCategory)
    .delete(checkPermission('itemSubCategory.update'), removeItemsFromSubCategory);

module.exports = router;