const mongoose = require('mongoose');

const speedRestrictionSchema = new mongoose.Schema({
  restriction_id: { type: String, required: true },
  section_id: { type: String, required: true },
  date: { type: String, required: true },
  start_time: { type: String },
  end_time: { type: String },
  normal_speed_kmph: { type: Number },
  restricted_speed_kmph: { type: Number },
  reason: { type: String }
}, {
  collection: 'speed_restrictions',
  timestamps: false
});

module.exports = mongoose.model('SpeedRestriction', speedRestrictionSchema);
