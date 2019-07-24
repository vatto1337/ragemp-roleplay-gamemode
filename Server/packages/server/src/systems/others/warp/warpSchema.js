var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var warpSchema = new Schema({
  title: String,
  position: { type: Schema.Types.Mixed, default: null }
});

var warpLocations = mongoose.model('warps', warpSchema);

module.exports = warpLocations;