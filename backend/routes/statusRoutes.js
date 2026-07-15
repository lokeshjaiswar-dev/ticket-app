const express = require('express');
const router = express.Router();
const { seedStatuses, getStatuses } = require('../controllers/statusController');

router.get('/seed', seedStatuses);
router.get('/', getStatuses);

module.exports = router;