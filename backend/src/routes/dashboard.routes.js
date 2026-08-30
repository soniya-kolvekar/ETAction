const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/summary', dashboardController.getSummary);
router.get('/trains', dashboardController.getTrains);

module.exports = router;
