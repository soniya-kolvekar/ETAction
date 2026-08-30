const mongoose = require('mongoose');

const trainRouteSchema = new mongoose.Schema({
  train_id: { type: String, required: true },
  sequence_number: { type: Number, required: true },
  station_id: { type: String, required: true },
  section_id_to_next: { type: String, default: '' }
}, {
  collection: 'train_routes',
  timestamps: false
});

module.exports = mongoose.model('TrainRoute', trainRouteSchema);
