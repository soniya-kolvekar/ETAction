const express = require('express');
const router = express.Router();
const passengerController = require('../controllers/passenger.controller');

router.get('/trains/search', passengerController.searchTrains);
router.get('/trains/:trainId/status', passengerController.getTrainStatus);
router.get('/trains/:trainId/stations', passengerController.getTrainStations);

module.exports = router;
