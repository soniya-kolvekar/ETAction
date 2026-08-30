const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  section_id: { type: String, required: true },
  from_station_id: { type: String },
  to_station_id: { type: String },
  distance_km: { type: Number },
  nominal_speed_kmph: { type: Number },
  max_speed_kmph: { type: Number },
  gradient_percent: { type: Number },
  section_type: { type: String },
  electrified: { type: String },
  track_type: { type: String },
  historical_avg_runtime_min: { type: Number },
  historical_std_runtime_min: { type: Number },
  recovery_time_min: { type: Number }
}, {
  collection: 'sections',
  timestamps: false
});

module.exports = mongoose.model('Section', sectionSchema);
