const { body, validationResult,query } = require('express-validator');

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

// Generic validator for required fields (checks for not empty and trims)
const validateRequiredOnly = (field, message) =>
  body(field)
    .notEmpty().withMessage(message || `${field} is required`)
    .trim();

// Generic validator for optional fields (checks if present and not empty, then trims)
const validateOptionalOnly = (field, message) =>
  body(field)
    .optional()
    .notEmpty().withMessage(message || `${field} cannot be empty if provided`)
    .trim();

// User validation rules
const userValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('name', 'Name is required'),
    validator('email', 'Email is required'),
    validator('password', 'Password is required'),
    validator('role', 'Role is required'),
    validator('mobile', 'Mobile number is required')
  );
  return rules;
};

// Login validation rules
const loginValidationRules = () => {
  return [
    validateRequiredOnly('email', 'Email is required'),
    validateRequiredOnly('password', 'Password is required')
  ];
};

// Item validation rules
const itemValidationRules = (isUpdate = false, isQuery = false) => {
    const rules = [];
    const validator = isUpdate || isQuery ? validateOptionalOnly : validateRequiredOnly;
    const bodyValidator = isUpdate ? body().optional() : body();

    if (isQuery) {
        rules.push(
            query('search').optional().trim(),
            query('category').optional().trim().isMongoId().withMessage('Category ID must be a valid Mongo ID'),
            query('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid item status')
        );
    } else {
        rules.push(
            validator('productName', 'Product name is required'),
            body('category').notEmpty().withMessage('Category ID is required').trim().isMongoId().withMessage('Category ID must be a valid Mongo ID'),
            body('type').optional().isIn(['Product', 'Service', 'Token']).withMessage('Invalid item type'),
            body('subCategory').optional().trim(),
            body('brandName').optional().trim(),
            body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid item status'),
            body('vendorName').optional().trim(),
            body('vendorContact').optional().trim(),
            body('unit').optional().trim(),
            body('currentQuantity').optional().isFloat({ min: 0 }).withMessage('Current quantity must be a non-negative number'),
            body('minimumStock').optional().isFloat({ min: 0 }).withMessage('Minimum stock must be a non-negative number'),
            body('maximumStock').optional().isFloat({ min: 0 }).withMessage('Maximum stock must be a non-negative number'),
            body('manufacturingDate').optional().isISO8601().withMessage('Manufacturing date must be a valid date'),
            body('expirationDate').optional().isISO8601().withMessage('Expiration date must be a valid date'),
            body('sellingPrice').isFloat({ min: 0 }).withMessage('Selling price must be a non-negative number'),
            body('purchasePrice').optional().isFloat({ min: 0 }).withMessage('Purchase price must be a non-negative number'),
            body('mrp').optional().isFloat({ min: 0 }).withMessage('MRP must be a non-negative number'),
            body('taxPercentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax percentage must be between 0 and 100'),
            body('onlineDeliveryPrice').optional().isFloat({ min: 0 }).withMessage('Online delivery price must be a non-negative number'),
            body('onlineSellingPrice').optional().isFloat({ min: 0 }).withMessage('Online selling price must be a non-negative number'),
            body('actualCost').optional().isFloat({ min: 0 }).withMessage('Actual cost must be a non-negative number'),
            body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a non-negative number'),
            body('swiggyPrice').optional().isFloat({ min: 0 }).withMessage('Swiggy price must be a non-negative number'),
            body('zomatoPrice').optional().isFloat({ min: 0 }).withMessage('Zomato price must be a non-negative number'),
            body('dineInPrice').optional().isFloat({ min: 0 }).withMessage('Dine-in price must be a non-negative number'),
            body('barcode1').optional().trim(),
            body('barcode2').optional().trim(),
            body('barcode3').optional().trim(),
            body('qrCode').optional().trim(),
            body('imageUrl').optional().trim()
        );
    }
    return rules;
};
// Category validation rules
const categoryValidationRules = (isUpdate = false, isQuery = false, isItemArray = false) => {
    const rules = [];
    const validator = isUpdate || isQuery ? validateOptionalOnly : validateRequiredOnly;

    if (isQuery) {
        rules.push(
            query('search').optional().trim()
        );
    } else if (isItemArray) { // For add/remove items to category
        rules.push(
            body('itemIds').isArray({ min: 1 }).withMessage('Item IDs must be an array with at least one ID'),
            body('itemIds.*').notEmpty().withMessage('Item ID cannot be empty').trim().isMongoId().withMessage('Each item ID must be a valid Mongo ID')
        );
    } else { // For create/update category
        rules.push(
            validator('name', 'Category name is required'),
            body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
            body('items').optional().isArray().withMessage('Items must be an array of item IDs'),
            body('items.*').optional().isMongoId().withMessage('Each item ID must be a valid Mongo ID')
        );
    }
    return rules;
};
// Sale validation rules
const saleValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('customerName', 'Customer name is required'),
    body('items').optional().isArray().withMessage('Items must be an array'),
    body('items.*.itemId').optional().notEmpty().withMessage('Item ID cannot be empty if provided').trim(),
    body('items.*.quantity').optional().notEmpty().withMessage('Quantity cannot be empty if provided').trim(),
    body('items.*.price').optional().notEmpty().withMessage('Price cannot be empty if provided').trim(),
    validator('paymentMethod', 'Payment method is required')
  );
  return rules;
};

// Purchase validation rules
const purchaseValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('vendorId', 'Vendor ID is required'),
    body('items').optional().isArray().withMessage('Items must be an array'),
    body('items.*.itemId').optional().notEmpty().withMessage('Item ID cannot be empty if provided').trim(),
    body('items.*.quantity').optional().notEmpty().withMessage('Quantity cannot be empty if provided').trim(),
    body('items.*.price').optional().notEmpty().withMessage('Price cannot be empty if provided').trim(),
    validator('invoiceDate', 'Invoice date is required')
  );
  return rules;
};

// Recipe validation rules
const recipeValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('productName', 'Product name is required'),
    body('ingredients').optional().isArray().withMessage('Ingredients must be an array'),
    body('ingredients.*.ingredientId').optional().notEmpty().withMessage('Ingredient ID cannot be empty if provided').trim(),
    body('ingredients.*.quantity').optional().notEmpty().withMessage('Quantity cannot be empty if provided').trim(),
    validator('manufacturingPrice', 'Manufacturing price is required'),
    validator('sellingPrice', 'Selling price is required')
  );
  return rules;
};

// Customer validation rules
const customerValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('name', 'Customer name is required'),
    validator('mobileNumber', 'Mobile number is required'),
    validator('address', 'Address is required'),
    validator('gstNumber', 'GST number is required'), // Changed to required for consistency, adjust if truly optional in schema
    validator('location', 'Location is required'),
    validator('creditAmount', 'Credit amount is required'),
    validator('rateType', 'Rate type is required'),
    validator('creditLimitAmount', 'Credit limit amount is required'),
    validator('creditLimitDays', 'Credit limit days is required')
  );
  return rules;
};

// Vendor validation rules
const vendorValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('name', 'Vendor name is required'),
    validator('mobileNumber', 'Mobile number is required'),
    validator('address', 'Address is required'),
    validator('gstNumber', 'GST number is required'), // Changed to required for consistency, adjust if truly optional in schema
    validator('location', 'Location is required'),
    validator('vendorCode', 'Vendor code is required'),
    // Nested account details validation (only check if parent exists and is not empty)
    body('accountDetails').optional().notEmpty().withMessage('Account details cannot be empty if provided').trim(),
    body('accountDetails.accountName').optional().notEmpty().withMessage('Account name cannot be empty if provided').trim(),
    body('accountDetails.accountBankName').optional().notEmpty().withMessage('Bank name cannot be empty if provided').trim(),
    body('accountDetails.branchName').optional().notEmpty().withMessage('Branch name cannot be empty if provided').trim(),
    body('accountDetails.accountNumber').optional().notEmpty().withMessage('Account number cannot be empty if provided').trim(),
    body('accountDetails.accountIFSCCode').optional().notEmpty().withMessage('IFSC code cannot be empty if provided').trim(),
    body('accountDetails.upiID').optional().notEmpty().withMessage('UPI ID cannot be empty if provided').trim()
  );
  return rules;
};

// Referrer validation rules
const referrerValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('name', 'Referrer name is required'),
    validator('mobileNumber', 'Mobile number is required'),
    validator('address', 'Address is required'),
    validator('gstNumber', 'GST number is required'), // Changed to required for consistency, adjust if truly optional in schema
    validator('location', 'Location is required')
  );
  return rules;
};

// Expense validation rules
const expenseValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('description', 'Description is required'),
    validator('amount', 'Amount is required'),
    validator('category', 'Category is required'),
    validator('date', 'Date is required'),
    validator('paymentMethod', 'Payment method is required')
  );
  return rules;
};

// Role validation rules
const roleValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('roleName', 'Role name is required'),
    body('permissions').optional().isArray().withMessage('Permissions must be an array')
  );
  return rules;
};

// Labour validation rules
const labourValidationRules = (isUpdate = false) => {
  const rules = [];
  const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

  rules.push(
    validator('name', 'Name is required'),
    validator('mobileNumber', 'Mobile number is required'),
    validator('address', 'Address is required'),
    validator('monthlySalary', 'Monthly salary is required')
  );
  return rules;
};

// Labour Attendance validation rules
const labourAttendanceValidationRules = (isUpdate = false) => {
    const rules = [];
    const validator = isUpdate ? validateOptionalOnly : validateRequiredOnly;

    rules.push(
        body('labourId').notEmpty().withMessage('Labour ID is required').trim(),
        body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid ISO 8601 date').trim(),
        body('status').notEmpty().withMessage('Status is required').trim(),
        body('status').isIn(['Present', 'Absent', 'Half-day', 'Leave']).withMessage('Invalid attendance status'),
        body('clockInTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Clock-in time must be in HH:MM format (24-hour)').trim(),
        body('clockOutTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Clock-out time must be in HH:MM format (24-hour)').trim(),
        body('notes').optional().trim()
    );

    // Conditional validation for clock-in/out times based on status
    rules.push(
        body('status').custom((value, { req }) => {
            if (value === 'Present' || value === 'Half-day') {
                if (!req.body.clockInTime) {
                    throw new Error('Clock-in time is required for Present or Half-day status');
                }
            }
            return true;
        })
    );

    // Validation for query parameters (for GET /api/labour-attendance)
    const queryRules = [
        query('date').optional().isISO8601().withMessage('Date query parameter must be a valid ISO 8601 date'),
        query('startDate').optional().isISO8601().withMessage('Start Date query parameter must be a valid ISO 8601 date'),
        query('endDate').optional().isISO8601().withMessage('End Date query parameter must be a valid ISO 8601 date'),
        query('week').optional().isInt({ min: 1, max: 53 }).withMessage('Week must be an integer between 1 and 53'),
        query('year').optional().isInt({ min: 1900, max: 2100 }).withMessage('Year must be a valid year'),
        query('status').optional().isIn(['Present', 'Absent', 'Half-day', 'Leave']).withMessage('Invalid status query parameter'),
        query('labourId').optional().trim().notEmpty().withMessage('Labour ID query parameter cannot be empty if provided')
    ];

    // Apply query rules only for GET requests (not POST/PUT).
    // The `isUpdate` parameter is typically used to differentiate between POST and PUT body validations.
    // For query parameters, we apply them universally when the function is called for a GET request.
    // The `getAttendanceRecords` function in the controller will call this without `isUpdate=true`.
    // So, we can simply return `rules` for body validation and append `queryRules` if not `isUpdate`.
    return isUpdate ? rules : [...rules, ...queryRules];
};



module.exports = {
  handleValidationErrors,
  userValidationRules,
  loginValidationRules,
  itemValidationRules,
  saleValidationRules,
  labourAttendanceValidationRules,
  purchaseValidationRules,
  recipeValidationRules,
  categoryValidationRules,
  customerValidationRules,
  vendorValidationRules,
  referrerValidationRules,
  expenseValidationRules,
  roleValidationRules,
  labourValidationRules,
  // Removed individual exports for validateRequired, validateNumber, etc.
  // as they are now internal helper functions used within the main validation rule sets.
};
