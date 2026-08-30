const mongoose = require('mongoose');

const weatherConditionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  section_id: { type: String, required: true },
  weather_condition: { type: String },
  rainfall_mm: { type: Number },
  visibility_km: { type: Number },
  weather_severity: { type: Number }
}, {
  collection: 'weather_condition', // Using singular as per prompt
  timestamps: false
});

module.exports = mongoose.model('WeatherCondition', weatherConditionSchema);
