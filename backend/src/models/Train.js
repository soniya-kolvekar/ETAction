const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  train_id: { type: String, required: true },
  train_number: { type: Number },
  train_name: { type: String },
  train_type: { type: String },
  service_type: { type: String },
  priority_class: { type: Number },
  origin_station_id: { type: String },
  destination_station_id: { type: String },
  scheduled_distance_km: { type: Number }
}, {
  collection: 'trains',
  timestamps: false
});

module.exports = mongoose.model('Train', trainSchema);
