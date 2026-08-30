const TrainRoute = require('../models/TrainRoute');
const DailyTrainState = require('../models/DailyTrainState');
const SpeedRestriction = require('../models/SpeedRestriction');
const MaintenanceBlock = require('../models/MaintenanceBlock');
const WeatherCondition = require('../models/WeatherCondition');

exports.generateAlerts = async (trainId) => {
  const state = await DailyTrainState.findOne({ train_id: trainId }).sort({ snapshot_time: -1 });
  if (!state) return [];
  
  const routes = await TrainRoute.find({ train_id: trainId }).sort({ sequence_number: 1 });
  let currentSeqIndex = routes.findIndex(r => r.section_id_to_next === state.current_section_id);
  if (currentSeqIndex === -1 && state.previous_section_id) {
    currentSeqIndex = routes.findIndex(r => r.section_id_to_next === state.previous_section_id) + 1;
  }
  if (currentSeqIndex === -1) currentSeqIndex = 0;

  const remainingRoutes = routes.slice(currentSeqIndex);
  const alerts = [];
  const dateStr = state.service_date;

  for (const r of remainingRoutes) {
    if (r.section_id_to_next) {
      const sectionId = r.section_id_to_next;
      
      const restriction = await SpeedRestriction.findOne({ section_id: sectionId, date: dateStr });
      if (restriction) {
        alerts.push({
          type: 'SPEED_RESTRICTION_AHEAD',
          severity: 'MEDIUM',
          section_id: sectionId,
          expected_delay_min: 5,
          message: `Speed restriction active: ${restriction.reason || 'Temporary'}`
        });
      }
      
      const maintenance = await MaintenanceBlock.findOne({ section_id: sectionId, date: dateStr });
      if (maintenance) {
        alerts.push({
          type: 'MAINTENANCE_BLOCK_AHEAD',
          severity: maintenance.severity || 'HIGH',
          section_id: sectionId,
          expected_delay_min: 15,
          message: `Maintenance block active with expected delay.`
        });
      }
      
      const weather = await WeatherCondition.findOne({ section_id: sectionId, date: dateStr });
      if (weather && weather.weather_severity > 2) {
        alerts.push({
          type: 'WEATHER_IMPACT',
          severity: 'HIGH',
          section_id: sectionId,
          expected_delay_min: 10,
          message: `Bad weather condition: ${weather.weather_condition}`
        });
      }
    }
  }

  if (state.current_delay_min > 30) {
    alerts.push({
      type: 'DELAY_PROPAGATION',
      severity: 'CRITICAL',
      section_id: state.current_section_id,
      expected_delay_min: state.current_delay_min,
      message: 'Train is significantly delayed, expect cascading effects.'
    });
  }

  return alerts;
};
