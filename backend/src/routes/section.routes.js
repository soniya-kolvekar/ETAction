const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/section.controller');

router.get('/:sectionId', sectionController.getSectionById);
router.get('/:sectionId/maintenance', sectionController.getMaintenanceBlocks);
router.get('/:sectionId/speed-restrictions', sectionController.getSpeedRestrictions);
router.get('/:sectionId/weather', sectionController.getWeather);
router.get('/:sectionId/block-events', sectionController.getBlockEvents);
router.get('/:sectionId/occupancy', sectionController.getOccupancy);

module.exports = router;
