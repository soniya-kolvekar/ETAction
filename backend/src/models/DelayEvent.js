const mongoose = require('mongoose');

const delayEventSchema = new mongoose.Schema({
  event_id: { type: String, required: true },
  service_date: { type: String, required: true },
  train_id: { type: String, required: true },
  section_id: { type: String, required: true },
  event_type: { type: String, required: true }, // e.g., SPEED_RESTRICTION, WEATHER
  event_start_time: { type: String },
  event_end_time: { type: String },
  delay_minutes: { type: Number, default: 0 },
  severity: { type: String }, // e.g., MEDIUM, HIGH
  description: { type: String }
}, {
  collection: 'delay_events',
  timestamps: false
});

module.exports = mongoose.model('DelayEvent', delayEventSchema);
