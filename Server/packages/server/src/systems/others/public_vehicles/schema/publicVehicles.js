var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaCreated = new Schema({
  model: String,
  x:  Number,
  y: Number,
  z: Number,
  rot: { type: Schema.Types.Mixed, default: null }
}, { strict: false });

var collection = mongoose.model('public_vehicles', schemaCreated);


module.exports = collection;