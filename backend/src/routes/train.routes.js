const express = require('express');
const router = express.Router();
const trainController = require('../controllers/train.controller');
const etaController = require('../controllers/eta.controller');
const delayController = require('../controllers/delay.controller');
const alertController = require('../controllers/alert.controller');

router.get('/:trainId', trainController.getTrainById);
router.get('/:trainId/route', trainController.getTrainRoute);
router.get('/:trainId/position', trainController.getTrainPosition);
router.get('/:trainId/status', trainController.getTrainStatus);
router.get('/:trainId/schedule', trainController.getTrainSchedule);

// ETA
router.get('/:trainId/eta', etaController.getTrainEta);

// Delays
router.get('/:trainId/delays', delayController.getTrainDelays);
router.get('/:trainId/delay-analysis', delayController.getTrainDelayAnalysis);

// Alerts
router.get('/:trainId/alerts', alertController.getTrainAlerts);

module.exports = router;
