const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route.controller');

// Dashboard and Occupancy routes will also attach here later if they share the prefix, 
// but based on prompt, dashboard is /dashboard and occupancy is under /routes/:routeId
router.get('/', routeController.getRoutes);
router.get('/:routeId', routeController.getRouteById);

router.get('/:routeId/trains', routeController.getRouteTrains);
router.get('/:routeId/sections/status', routeController.getRouteSectionsStatus);
router.get('/:routeId/occupancy', routeController.getRouteOccupancy);

module.exports = router;
