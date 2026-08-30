const Section = require('../models/Section');
const MaintenanceBlock = require('../models/MaintenanceBlock');
const SpeedRestriction = require('../models/SpeedRestriction');
const WeatherCondition = require('../models/WeatherCondition');
const BlockEvent = require('../models/BlockEvent');

exports.getSectionById = async (req, res, next) => {
  try {
    const section = await Section.findOne({ section_id: req.params.sectionId });
    if (!section) return res.status(404).json({ success: false, error: { code: 'SECTION_NOT_FOUND', message: 'Section not found' } });
    res.json({ success: true, data: section });
  } catch (error) { next(error); }
};

exports.getMaintenanceBlocks = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { section_id: req.params.sectionId };
    if (date) query.date = date;
    const blocks = await MaintenanceBlock.find(query);
    res.json({ success: true, data: blocks });
  } catch (error) { next(error); }
};

exports.getSpeedRestrictions = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { section_id: req.params.sectionId };
    if (date) query.date = date;
    const restrictions = await SpeedRestriction.find(query);
    res.json({ success: true, data: restrictions });
  } catch (error) { next(error); }
};

exports.getWeather = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { section_id: req.params.sectionId };
    if (date) query.date = date;
    const weather = await WeatherCondition.findOne(query);
    res.json({ success: true, data: weather || null });
  } catch (error) { next(error); }
};

exports.getBlockEvents = async (req, res, next) => {
  try {
    const { date } = req.query; // Would need to parse timestamp if filtering by date string exactly
    const query = { section_id: req.params.sectionId };
    if (date) {
      query.timestamp = { $regex: `^${date}` }; // Simple prefix match assuming YYYY-MM-DD HH:mm:ss
    }
    const events = await BlockEvent.find(query).sort({ timestamp: -1 });
    res.json({ success: true, data: events });
  } catch (error) { next(error); }
};

exports.getOccupancy = async (req, res, next) => {
  try {
    // Current occupancy logic: Get the latest block event for this section
    const latestEvent = await BlockEvent.findOne({ section_id: req.params.sectionId }).sort({ timestamp: -1 });
    const isOccupied = latestEvent && latestEvent.occupancy_status === 'OCCUPIED';
    
    res.json({
      success: true,
      data: {
        section_id: req.params.sectionId,
        is_occupied: isOccupied,
        occupying_train_id: isOccupied ? latestEvent.train_id : null,
        last_event: latestEvent
      }
    });
  } catch (error) { next(error); }
};
