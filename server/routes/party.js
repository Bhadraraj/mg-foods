const express = require('express');
const {
  getParties,
  getParty,
  createParty,
  updateParty,
  deleteParty,
  togglePartyStatus
} = require('../controllers/partyController');
const { protect, checkPermission } = require('../middleware/auth');
// If you uncomment partyValidationRules(), remember to uncomment handleValidationErrors as well.
// const { partyValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes in this file are protected
router.use(protect);

router.route('/')
  .get(checkPermission('party.view'), getParties)
  .post(
    checkPermission('party.create'),
    // If you want validation for POST, uncomment the following two lines:
    // partyValidationRules(),
    // handleValidationErrors,
    createParty // Directly call the controller function if validation is skipped
  );

router.route('/:id')
  .get(checkPermission('party.view'), getParty)
  .put(
    checkPermission('party.update'),
    // Validation middleware for PUT requests is removed as per your request
    updateParty // Directly call the controller function
  )
  .delete(checkPermission('party.delete'), deleteParty);

router.put('/:id/toggle-status', checkPermission('party.update'), togglePartyStatus);

module.exports = router;
