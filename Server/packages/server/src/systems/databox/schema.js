var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  data: { type: Schema.Types.Mixed, default: null }
});

var table = mongoose.model('databoxes', schema);

module.exports = table;