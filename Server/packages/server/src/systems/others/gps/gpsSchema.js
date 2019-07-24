var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gpsSchema = new Schema({
  title: String,
  position: { type: Schema.Types.Mixed, default: null }
});

var gpsLocations = mongoose.model('gps', gpsSchema);

module.exports = gpsLocations;