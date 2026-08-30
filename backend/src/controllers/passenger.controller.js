const Train = require('../models/Train');
const DailyTrainState = require('../models/DailyTrainState');
const etaService = require('../services/eta.service');

exports.searchTrains = async (req, res, next) => {
  try {
    const { query, origin, destination, date } = req.query;
    const dbQuery = {};
    
    if (query) {
      // Very simple text search on name or number
      dbQuery.$or = [
        { train_name: { $regex: query, $options: 'i' } }
      ];
      if (!isNaN(Number(query))) {
        dbQuery.$or.push({ train_number: Number(query) });
      }
    }
    
    if (origin) dbQuery.origin_station_id = origin;
    if (destination) dbQuery.destination_station_id = destination;
    
    const trains = await Train.find(dbQuery);
    res.json({ success: true, data: trains });
  } catch (error) { next(error); }
};

exports.getTrainStatus = async (req, res, next) => {
  try {
    const train = await Train.findOne({ train_id: req.params.trainId });
    if (!train) return res.status(404).json({ success: false, error: { code: 'TRAIN_NOT_FOUND', message: 'Train not found' } });
    
    const state = await DailyTrainState.findOne({ train_id: req.params.trainId }).sort({ snapshot_time: -1 });
    
    res.json({
      success: true,
      data: {
        train_number: train.train_number,
        train_name: train.train_name,
        status: state ? state.status : 'UNKNOWN',
        delay: state ? state.current_delay_min : 0,
        current_location: state ? state.current_section_id : null,
        destination_eta: state ? state.estimated_destination_eta : null
      }
    });
  } catch (error) { next(error); }
};

exports.getTrainStations = async (req, res, next) => {
  try {
    const etaData = await etaService.calculateETA(req.params.trainId);
    res.json({ success: true, data: etaData.upcoming_stations });
  } catch (error) { next(error); }
};
