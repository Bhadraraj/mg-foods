const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email');

const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

const validateRequired = (field) => 
  body(field)
    .notEmpty()
    .trim()
    .withMessage(`${field} is required`);

const validateNumber = (field, min = 0) =>
  body(field)
    .isNumeric()
    .isFloat({ min })
    .withMessage(`${field} must be a valid number greater than or equal to ${min}`);

const validateDate = (field) =>
  body(field)
    .isISO8601()
    .withMessage(`${field} must be a valid date`);

const validateObjectId = (field) =>
  body(field)
    .isMongoId()
    .withMessage(`${field} must be a valid ID`);

// User validation rules
const userValidationRules = () => {
  return [
    validateRequired('name'),
    validateEmail,
    validatePassword,
    validateRequired('role'),
    body('role').isIn(['admin', 'manager', 'cashier']).withMessage('Invalid role'),
    body('mobile').isMobilePhone().withMessage('Please provide a valid mobile number')
  ];
};

// Login validation rules
const loginValidationRules = () => {
  return [
    validateEmail,
    validateRequired('password')
  ];
};

// Item validation rules
const itemValidationRules = () => {
  return [
    validateRequired('name'),
    validateRequired('category'),
    validateNumber('sellingPrice'),
    validateNumber('purchasePrice'),
    validateNumber('currentStock'),
    validateNumber('minStock'),
    validateNumber('maxStock')
  ];
};

// Sale validation rules
const saleValidationRules = () => {
  return [
    validateRequired('customerName'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.itemId').isMongoId().withMessage('Invalid item ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    validateRequired('paymentMethod'),
    body('paymentMethod').isIn(['cash', 'card', 'upi', 'credit']).withMessage('Invalid payment method')
  ];
};

// Purchase validation rules
const purchaseValidationRules = () => {
  return [
    validateRequired('vendorId'),
    validateObjectId('vendorId'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.itemId').isMongoId().withMessage('Invalid item ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    validateDate('invoiceDate')
  ];
};

// Recipe validation rules
const recipeValidationRules = () => {
  return [
    validateRequired('productName'),
    body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
    body('ingredients.*.ingredientId').isMongoId().withMessage('Invalid ingredient ID'),
    body('ingredients.*.quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    validateNumber('manufacturingPrice'),
    validateNumber('sellingPrice')
  ];
};

// Party validation rules
const partyValidationRules = () => {
  return [
    validateRequired('name'),
    validateRequired('type'),
    body('type').isIn(['customer', 'vendor', 'referrer']).withMessage('Invalid party type'),
    body('mobile').isMobilePhone().withMessage('Please provide a valid mobile number'),
    body('email').optional().isEmail().withMessage('Please provide a valid email')
  ];
};

// Expense validation rules
const expenseValidationRules = () => {
  return [
    validateRequired('description'),
    validateNumber('amount'),
    validateRequired('category'),
    validateDate('date'),
    validateRequired('paymentMethod'),
    body('paymentMethod').isIn(['cash', 'bank', 'card']).withMessage('Invalid payment method')
  ];
};

module.exports = {
  handleValidationErrors,
  userValidationRules,
  loginValidationRules,
  itemValidationRules,
  saleValidationRules,
  purchaseValidationRules,
  recipeValidationRules,
  partyValidationRules,
  expenseValidationRules,
  validateRequired,
  validateNumber,
  validateDate,
  validateObjectId
};