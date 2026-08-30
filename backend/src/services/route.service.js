const Train = require('../models/Train');
const TrainRoute = require('../models/TrainRoute');
const Station = require('../models/Station');
const Section = require('../models/Section');

/**
 * Returns available routes. 
 * Since there's no routes collection, we aggregate from train_routes or trains.
 * For simplicity, a route can be identified by origin to destination.
 */
exports.getRoutes = async () => {
  // Aggregate unique origin-destination pairs from trains
  const routes = await Train.aggregate([
    {
      $group: {
        _id: { origin: '$origin_station_id', destination: '$destination_station_id' },
        trainCount: { $sum: 1 }
      }
    }
  ]);

  // Optionally fetch station names
  const formattedRoutes = await Promise.all(routes.map(async (r) => {
    const origin = await Station.findOne({ station_id: r._id.origin });
    const dest = await Station.findOne({ station_id: r._id.destination });
    
    // Create a deterministic route ID based on origin and dest
    const routeId = `${r._id.origin}-${r._id.destination}`;
    
    return {
      route_id: routeId,
      origin_station_id: r._id.origin,
      origin_station_name: origin ? origin.name : r._id.origin,
      destination_station_id: r._id.destination,
      destination_station_name: dest ? dest.name : r._id.destination,
      train_count: r.trainCount
    };
  }));

  return formattedRoutes;
};

/**
 * Returns details of a specific route (stations and sections in sequence)
 * Since route is dynamic, we'll pick a representative train for this OD pair 
 * and fetch its train_route.
 */
exports.getRouteById = async (routeId) => {
  const [origin, destination] = routeId.split('-');
  if (!origin || !destination) {
    throw { code: 'INVALID_ROUTE_ID', message: 'Route ID must be in format origin-destination' };
  }

  const train = await Train.findOne({ origin_station_id: origin, destination_station_id: destination });
  if (!train) {
    throw { code: 'ROUTE_NOT_FOUND', message: `No trains operate on route ${routeId}` };
  }

  // Get the ordered route
  const trainRoutes = await TrainRoute.find({ train_id: train.train_id }).sort({ sequence_number: 1 });
  
  const stations = [];
  const sections = [];
  let totalDistance = 0;

  for (const tr of trainRoutes) {
    const station = await Station.findOne({ station_id: tr.station_id });
    stations.push(station);

    if (tr.section_id_to_next) {
      const section = await Section.findOne({ section_id: tr.section_id_to_next });
      sections.push(section);
      if (section && section.distance_km) {
        totalDistance += section.distance_km;
      }
    }
  }

  return {
    route_id: routeId,
    origin_station_id: origin,
    destination_station_id: destination,
    total_distance_km: totalDistance,
    stations: stations.filter(Boolean),
    sections: sections.filter(Boolean)
  };
};

const DailyTrainState = require('../models/DailyTrainState');

exports.getRouteTrains = async (routeId, date) => {
  const [origin, destination] = routeId.split('-');
  const trains = await Train.find({ origin_station_id: origin, destination_station_id: destination });
  const trainIds = trains.map(t => t.train_id);
  
  const query = { train_id: { $in: trainIds } };
  if (date) query.service_date = date;
  
  const states = await DailyTrainState.find(query);
  return states;
};

const BlockEvent = require('../models/BlockEvent');
const SpeedRestriction = require('../models/SpeedRestriction');
const MaintenanceBlock = require('../models/MaintenanceBlock');
const WeatherCondition = require('../models/WeatherCondition');

exports.getRouteSectionsStatus = async (routeId, date) => {
  const route = await this.getRouteById(routeId);
  const sections = route.sections;
  
  const result = await Promise.all(sections.map(async (sec) => {
    // Basic rules to determine status (NORMAL, CONGESTED, CRITICAL)
    const latestEvent = await BlockEvent.findOne({ section_id: sec.section_id }).sort({ timestamp: -1 });
    const isOccupied = latestEvent && latestEvent.occupancy_status === 'OCCUPIED';
    
    // Check maintenance & restrictions for the date
    const dateQuery = { section_id: sec.section_id };
    if (date) dateQuery.date = date;
    
    const restriction = await SpeedRestriction.findOne(dateQuery);
    const maintenance = await MaintenanceBlock.findOne(dateQuery);
    const weather = await WeatherCondition.findOne(dateQuery);
    
    let status = 'NORMAL';
    if (maintenance && maintenance.severity === 'CRITICAL') status = 'CRITICAL';
    else if (restriction || (maintenance && maintenance.severity !== 'MINOR')) status = 'CONGESTED';
    
    return {
      section_id: sec.section_id,
      from_station: sec.from_station_id,
      to_station: sec.to_station_id,
      distance: sec.distance_km,
      historical_avg_runtime: sec.historical_avg_runtime_min,
      occupancy_count: isOccupied ? 1 : 0, // Simplified for demo
      occupancy_status: isOccupied ? 'OCCUPIED' : 'CLEAR',
      congestion_level: status,
      active_speed_restriction: restriction || null,
      active_maintenance_block: maintenance || null,
      weather_condition: weather ? weather.weather_condition : 'NORMAL'
    };
  }));
  
  return result;
};

exports.getRouteOccupancy = async (routeId, date) => {
  const route = await this.getRouteById(routeId);
  const sections = route.sections;
  
  const result = await Promise.all(sections.map(async (sec) => {
    const latestEvent = await BlockEvent.findOne({ section_id: sec.section_id }).sort({ timestamp: -1 });
    const isOccupied = latestEvent && latestEvent.occupancy_status === 'OCCUPIED';
    return {
      section_id: sec.section_id,
      is_occupied: isOccupied,
      train_id: isOccupied ? latestEvent.train_id : null
    };
  }));
  
  return result;
};

