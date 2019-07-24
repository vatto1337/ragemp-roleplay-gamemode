var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  members: { type: Schema.Types.Mixed, default: null }
});

var groups = mongoose.model('groups', schema);

module.exports = groups;