const DailyTrainState = require('../models/DailyTrainState');
const TrainRoute = require('../models/TrainRoute');
const Section = require('../models/Section');
const Station = require('../models/Station');
const SpeedRestriction = require('../models/SpeedRestriction');
const MaintenanceBlock = require('../models/MaintenanceBlock');
const WeatherCondition = require('../models/WeatherCondition');

exports.calculateETA = async (trainId) => {
  // 1. Get current train state
  const state = await DailyTrainState.findOne({ train_id: trainId }).sort({ snapshot_time: -1 });
  if (!state) {
    throw { code: 'STATE_NOT_FOUND', message: 'Current state not found for train' };
  }

  // 2. Find remaining route
  const routes = await TrainRoute.find({ train_id: trainId }).sort({ sequence_number: 1 });
  
  let currentSeqIndex = routes.findIndex(r => r.section_id_to_next === state.current_section_id);
  if (currentSeqIndex === -1 && state.previous_section_id) {
    currentSeqIndex = routes.findIndex(r => r.section_id_to_next === state.previous_section_id) + 1;
  }
  if (currentSeqIndex === -1) currentSeqIndex = 0; // fallback

  const remainingRoutes = routes.slice(currentSeqIndex);

  // Parse start time - using snapshot time for the demo
  let currentTime = new Date(state.snapshot_time || new Date().toISOString());
  // Apply current delay to current time
  currentTime.setMinutes(currentTime.getMinutes() + (state.current_delay_min || 0));

  const upcomingStations = [];
  let currentDelayMin = state.current_delay_min || 0;

  for (let i = 0; i < remainingRoutes.length; i++) {
    const r = remainingRoutes[i];
    
    // Calculate ETA for this station
    const station = await Station.findOne({ station_id: r.station_id });
    upcomingStations.push({
      station_id: r.station_id,
      station_name: station ? station.name : r.station_id,
      eta: new Date(currentTime).toISOString() // Simulated ETA
    });

    if (r.section_id_to_next) {
      const section = await Section.findOne({ section_id: r.section_id_to_next });
      if (section) {
        // Base runtime
        let runtime = section.historical_avg_runtime_min || 30; // fallback

        // Adjustments
        const dateStr = state.service_date; // Assuming YYYY-MM-DD
        const restriction = await SpeedRestriction.findOne({ section_id: section.section_id, date: dateStr });
        const maintenance = await MaintenanceBlock.findOne({ section_id: section.section_id, date: dateStr });
        
        if (restriction) {
          // simple demo penalty
          runtime += 10;
        }
        if (maintenance) {
           runtime += 15;
        }
        
        // apply recovery time if any
        const recovery = section.recovery_time_min || 0;
        if (currentDelayMin > recovery) {
          currentDelayMin -= recovery;
        } else {
          currentDelayMin = 0;
        }

        currentTime.setMinutes(currentTime.getMinutes() + runtime);
      }
    }
  }

  const destinationEta = upcomingStations.length > 0 ? upcomingStations[upcomingStations.length - 1].eta : null;

  return {
    train_id: trainId,
    prediction_time: new Date().toISOString(),
    current_delay_min: currentDelayMin,
    prediction_confidence: state.prediction_confidence || 0.90, // Fallback confidence
    upcoming_stations: upcomingStations,
    destination_eta: destinationEta
  };
};
