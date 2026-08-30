const mongoose = require('mongoose');

const blockEventSchema = new mongoose.Schema({
  event_id: { type: String, required: true },
  timestamp: { type: String, required: true },
  section_id: { type: String, required: true },
  event_type: { type: String, required: true }, // e.g., TRAIN_ENTERED, TRAIN_EXITED
  train_id: { type: String, required: true },
  occupancy_status: { type: String, required: true } // e.g., OCCUPIED, CLEAR
}, {
  collection: 'block_events',
  timestamps: false
});

module.exports = mongoose.model('BlockEvent', blockEventSchema);
