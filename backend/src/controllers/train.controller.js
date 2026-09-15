const Train = require('../models/Train');
const TrainRoute = require('../models/TrainRoute');
const DailyTrainState = require('../models/DailyTrainState');
const Schedule = require('../models/Schedule');

// Helper to resolve train_id from train_number
const resolveTrainId = async (paramId) => {
  if (!isNaN(paramId)) {
    const train = await Train.findOne({ train_number: Number(paramId) });
    if (train) return train.train_id;
  }
  return paramId;
};

exports.getTrainById = async (req, res, next) => {
  try {
    const trainId = await resolveTrainId(req.params.trainId);
    const train = await Train.findOne({ train_id: trainId });
    if (!train) return res.status(404).json({ success: false, error: { code: 'TRAIN_NOT_FOUND', message: 'Train not found' } });
    res.json({ success: true, data: train });
  } catch (error) { next(error); }
};

exports.getTrainRoute = async (req, res, next) => {
  try {
    const trainId = await resolveTrainId(req.params.trainId);
    const route = await TrainRoute.find({ train_id: trainId }).sort({ sequence_number: 1 });
    res.json({ success: true, data: route });
  } catch (error) { next(error); }
};

exports.getTrainPosition = async (req, res, next) => {
  try {
    const trainId = await resolveTrainId(req.params.trainId);
    const state = await DailyTrainState.findOne({ train_id: trainId }).sort({ snapshot_time: -1 });
    if (!state) return res.status(404).json({ success: false, error: { code: 'POSITION_NOT_FOUND', message: 'Position not found' } });
    
    res.json({
      success: true,
      data: {
        timestamp: state.snapshot_time,
        current_section_id: state.current_section_id,
        previous_section_id: state.previous_section_id,
        next_section_id: state.next_section_id,
        status: state.status,
        current_delay_min: state.current_delay_min,
        last_event_time: state.last_event_time
      }
    });
  } catch (error) { next(error); }
};

exports.getTrainStatus = async (req, res, next) => {
  try {
    const trainId = await resolveTrainId(req.params.trainId);
    const state = await DailyTrainState.findOne({ train_id: trainId }).sort({ snapshot_time: -1 });
    if (!state) return res.status(404).json({ success: false, error: { code: 'STATUS_NOT_FOUND', message: 'Status not found' } });
    
    res.json({
      success: true,
      data: {
        status: state.status,
        current_delay_min: state.current_delay_min,
        current_section_id: state.current_section_id,
        estimated_destination_eta: state.estimated_destination_eta
      }
    });
  } catch (error) { next(error); }
};

exports.getTrainSchedule = async (req, res, next) => {
  try {
    const trainId = await resolveTrainId(req.params.trainId);
    const { date } = req.query;
    const query = { train_id: trainId };
    if (date) query.service_date = date;
    
    const schedule = await Schedule.find(query);
    res.json({ success: true, data: schedule });
  } catch (error) { next(error); }
};
