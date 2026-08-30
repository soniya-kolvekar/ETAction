const mongoose = require('mongoose');

const dailyTrainStateSchema = new mongoose.Schema({
  snapshot_time: { type: String, required: true },
  train_id: { type: String, required: true },
  service_date: { type: String, required: true },
  current_section_id: { type: String, default: '' },
  previous_section_id: { type: String, default: '' },
  next_section_id: { type: String, default: '' },
  current_delay_min: { type: Number, default: 0 },
  status: { type: String, required: true }, // e.g., ON_TIME, DELAYED
  last_event_time: { type: String },
  estimated_destination_eta: { type: String },
  prediction_confidence: { type: Number, default: 0 }
}, {
  collection: 'daily_train_state',
  timestamps: false
});

module.exports = mongoose.model('DailyTrainState', dailyTrainStateSchema);
