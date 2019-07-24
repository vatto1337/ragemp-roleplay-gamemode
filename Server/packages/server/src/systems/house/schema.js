var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  index: Number,
  entrance: { type: Schema.Types.Mixed, default: null },
  exit: { type: Schema.Types.Mixed, default: null },
  owner: String,
  owned: Boolean,
  rentable: Boolean,
  rentPrice: Number,
  price: Number,
  level: Number,
  upgradeLevel: Number,
  taxes: Number,
  safe: Number
});

var houses = mongoose.model('houses', schema);

module.exports = houses;