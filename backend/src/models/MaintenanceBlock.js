const mongoose = require('mongoose');

const maintenanceBlockSchema = new mongoose.Schema({
  block_id: { type: String, required: true },
  section_id: { type: String, required: true },
  date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  severity: { type: String },
  speed_reduction_percent: { type: Number }
}, {
  collection: 'maintenance_blocks',
  timestamps: false
});

module.exports = mongoose.model('MaintenanceBlock', maintenanceBlockSchema);
