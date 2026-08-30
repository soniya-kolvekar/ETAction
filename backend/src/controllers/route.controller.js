const routeService = require('../services/route.service');

exports.getRoutes = async (req, res, next) => {
  try {
    const routes = await routeService.getRoutes();
    res.json({ success: true, data: routes });
  } catch (error) {
    next(error);
  }
};

exports.getRouteById = async (req, res, next) => {
  try {
    const route = await routeService.getRouteById(req.params.routeId);
    res.json({ success: true, data: route });
  } catch (error) {
    if (error.code) {
      res.status(404).json({ success: false, error });
    } else {
      next(error);
    }
  }
};

exports.getRouteTrains = async (req, res, next) => {
  try {
    const { date } = req.query;
    const trains = await routeService.getRouteTrains(req.params.routeId, date);
    res.json({ success: true, data: trains });
  } catch (error) { next(error); }
};

exports.getRouteSectionsStatus = async (req, res, next) => {
  try {
    const { date } = req.query;
    const status = await routeService.getRouteSectionsStatus(req.params.routeId, date);
    res.json({ success: true, data: status });
  } catch (error) { next(error); }
};

exports.getRouteOccupancy = async (req, res, next) => {
  try {
    const { date } = req.query;
    const occupancy = await routeService.getRouteOccupancy(req.params.routeId, date);
    res.json({ success: true, data: occupancy });
  } catch (error) { next(error); }
};

