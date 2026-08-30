const mongoose = require('mongoose');

// Note: The prompt mentions stations are sometimes stored with keys like:
// "@lat\t@lon\tname\tname:en\tref\trailway"
// We'll define a flexible schema and use Schema.Types.Mixed or just key specific fields
// if we plan to normalize it, but since we are advised NOT to destroy existing data,
// we will allow flexible structure via `strict: false`.
// We will still define the likely normalized fields for easy access if they exist.

const stationSchema = new mongoose.Schema({
  station_id: { type: String },
  name: { type: String },
  name_en: { type: String },
  code: { type: String }, // might map to 'ref'
  latitude: { type: Number },
  longitude: { type: Number }
}, {
  collection: 'stations',
  timestamps: false,
  strict: false // IMPORTANT: Allows the weird key-based fields to persist and be queryable without error
});

module.exports = mongoose.model('Station', stationSchema);
