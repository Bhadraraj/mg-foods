const express = require('express');
const {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  calculateRecipeCost
} = require('../controllers/recipeController');
const { protect, checkPermission } = require('../middleware/auth');
const { recipeValidationRules, handleValidationErrors } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(checkPermission('recipe.view'), getRecipes)
  .post(checkPermission('recipe.create'), upload.array('images', 3), handleUploadError, recipeValidationRules(), handleValidationErrors, createRecipe);

router.post('/calculate-cost', checkPermission('recipe.view'), calculateRecipeCost);

router.route('/:id')
  .get(checkPermission('recipe.view'), getRecipe)
  .put(checkPermission('recipe.update'), upload.array('images', 3), handleUploadError, updateRecipe)
  .delete(checkPermission('recipe.delete'), deleteRecipe);

module.exports = router;