const Recipe = require('../models/Recipe');
const Item = require('../models/Item');

// @desc    Create new recipe
// @route   POST /api/recipe
// @access  Private
const createRecipe = async (req, res) => {
  try {
    const {
      productName,
      category,
      ingredients,
      production,     pricing,
      instructions,
      preparationTime,
      servingSize
    } = req.body;

    // Validate and process ingredients
    const processedIngredients = [];
    let totalCost = 0;

    for (const ingredient of ingredients) {
      const dbItem = await Item.findById(ingredient.ingredientId);
      if (!dbItem) {
        return res.status(400).json({
          success: false,
          message: `Ingredient with ID ${ingredient.ingredientId} not found`
        });
      }

      const cost = ingredient.quantity * dbItem.pricing.purchasePrice;
      totalCost += cost;

      processedIngredients.push({
        ingredient: ingredient.ingredientId,
        ingredientName: dbItem.name,
        quantity: ingredient.quantity,
        unit: dbItem.unit,
        cost
      });
    }

    const recipeData = {
      productName,
      category,
      ingredients: processedIngredients,
      production,
      pricing: {
        ...pricing,
        totalCostOfIngredients: totalCost
      },
      instructions,
      preparationTime,
      servingSize,
      createdBy: req.user.id
    };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      recipeData.images = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        alt: productName
      }));
    }

    const recipe = await Recipe.create(recipeData);

    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('category', 'name')
      .populate('ingredients.ingredient', 'name unit pricing')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: { recipe: populatedRecipe }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating recipe',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all recipes with pagination and filtering
// @route   GET /api/recipe
// @access  Private
const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { productName: { $regex: req.query.search, $options: 'i' } },
        { recipeCode: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const recipes = await Recipe.find(filter)
      .populate('category', 'name')
      .populate('ingredients.ingredient', 'name unit')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: recipes.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { recipes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single recipe
// @route   GET /api/recipe/:id
// @access  Private
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('category', 'name description')
      .populate('ingredients.ingredient', 'name unit pricing stock')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { recipe }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipe/:id
// @access  Private
const updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        alt: req.body.productName || recipe.productName
      }));
      
      updateData.images = [...(recipe.images || []), ...newImages];
    }

    // Recalculate ingredient costs if ingredients are updated
    if (req.body.ingredients) {
      let totalCost = 0;
      const processedIngredients = [];

      for (const ingredient of req.body.ingredients) {
        const dbItem = await Item.findById(ingredient.ingredientId);
        if (dbItem) {
          const cost = ingredient.quantity * dbItem.pricing.purchasePrice;
          totalCost += cost;

          processedIngredients.push({
            ingredient: ingredient.ingredientId,
            ingredientName: dbItem.name,
            quantity: ingredient.quantity,
            unit: dbItem.unit,
            cost
          });
        }
      }

      updateData.ingredients = processedIngredients;
      updateData.pricing = {
        ...updateData.pricing,
        totalCostOfIngredients: totalCost
      };
    }

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('category', 'name')
    .populate('ingredients.ingredient', 'name unit');

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      data: { recipe }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating recipe',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipe/:id
// @access  Private
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Calculate recipe cost
// @route   POST /api/recipe/calculate-cost
// @access  Private
const calculateRecipeCost = async (req, res) => {
  try {
    const { ingredients } = req.body;

    let totalCost = 0;
    const costBreakdown = [];

    for (const ingredient of ingredients) {
      const item = await Item.findById(ingredient.ingredientId);
      if (!item) {
        return res.status(400).json({
          success: false,
          message: `Ingredient with ID ${ingredient.ingredientId} not found`
        });
      }

      const cost = ingredient.quantity * item.pricing.purchasePrice;
      totalCost += cost;

      costBreakdown.push({
        ingredientName: item.name,
        quantity: ingredient.quantity,
        unit: item.unit,
        unitCost: item.pricing.purchasePrice,
        totalCost: cost
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalCost,
        costBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating recipe cost',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  calculateRecipeCost
};