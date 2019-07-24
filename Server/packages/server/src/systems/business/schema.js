var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  index: Number,
  title: String,
  entrance: { type: Schema.Types.Mixed, default: null },
  exit: { type: Schema.Types.Mixed, default: null },
  ipls: { type: Schema.Types.Mixed, default: null },
  buyPoint: { type: Schema.Types.Mixed, default: null },
  robPoint: { type: Schema.Types.Mixed, default: null },
  extraPoints: { type: Schema.Types.Mixed, default: null },
  haveEntrance: Boolean,
  haveBuyPoint: Boolean,
  haveRobPoint: Boolean,
  haveExtra: Boolean,
  owner: String,
  owned: Boolean,
  price: Number,
  level: Number,
  products: Number,
  type: Number,
  safe: Number,
  blipIcon: Number,
  blipColor: Number,
  robTime: Number,
  taxes: Number
});

var business = mongoose.model('businesses', schema);

module.exports = business;