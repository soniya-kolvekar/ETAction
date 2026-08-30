const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  schedule_id: { type: String, required: true },
  train_id: { type: String, required: true },
  service_date: { type: String, required: true },
  station_id: { type: String, required: true },
  scheduled_arrival: { type: String },
  scheduled_departure: { type: String },
  scheduled_dwell_min: { type: Number },
  scheduled_section_runtime_min: { type: Number }
}, {
  collection: 'schedules',
  timestamps: false
});

module.exports = mongoose.model('Schedule', scheduleSchema);
