const express = require('express');
const {
  createParty,
  getParties,
  getParty,
  updateParty,
  deleteParty,
  getCustomers,
  getVendors,
  getReferrers
} = require('../controllers/partyController');
const { protect, checkPermission } = require('../middleware/auth');
const { partyValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(checkPermission('party.view'), getParties)
  .post(checkPermission('party.create'), partyValidationRules(), handleValidationErrors, createParty);

router.get('/customers', checkPermission('party.view'), getCustomers);
router.get('/vendors', checkPermission('party.view'), getVendors);
router.get('/referrers', checkPermission('party.view'), getReferrers);

router.route('/:id')
  .get(checkPermission('party.view'), getParty)
  .put(checkPermission('party.update'), updateParty)
  .delete(checkPermission('party.delete'), deleteParty);

module.exports = router;