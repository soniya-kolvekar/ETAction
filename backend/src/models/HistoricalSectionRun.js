const mongoose = require('mongoose');

const historicalSectionRunSchema = new mongoose.Schema({
  run_id: { type: String, required: true },
  service_date: { type: String, required: true },
  train_id: { type: String, required: true },
  train_type: { type: String },
  section_id: { type: String, required: true },
  from_station_id: { type: String },
  to_station_id: { type: String },
  scheduled_entry_time: { type: String },
  actual_entry_time: { type: String },
  scheduled_exit_time: { type: String },
  actual_exit_time: { type: String },
  scheduled_runtime_min: { type: Number },
  actual_runtime_min: { type: Number },
  entry_delay_min: { type: Number },
  exit_delay_min: { type: Number },
  speed_restriction_flag: { type: Number, default: 0 },
  congestion_flag: { type: Number, default: 0 },
  maintenance_block_flag: { type: Number, default: 0 },
  weather_flag: { type: Number, default: 0 },
  unscheduled_stop_flag: { type: Number, default: 0 },
  num_signal_halts: { type: Number, default: 0 },
  unscheduled_stop_duration_min: { type: Number, default: 0 },
  physics_baseline_runtime_min: { type: Number },
  residual_runtime_min: { type: Number }
}, {
  collection: 'historical_section_runs',
  timestamps: false
});

module.exports = mongoose.model('HistoricalSectionRun', historicalSectionRunSchema);
