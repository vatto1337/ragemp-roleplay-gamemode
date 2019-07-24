var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
  username: String,
  password: String,
  registered: { type: Date, default: Date.now },
  lastConnected: { type: Date, default: Date.now },
  lastDisconnected: { type: Date, default: Date.now },
  info: { type: Schema.Types.Mixed, default: null },
  ip: { type: Schema.Types.Mixed, default: null },
  socialClub: { type: Schema.Types.Mixed, default: null },
  banStatus: { type: Schema.Types.Mixed, default: null }
});


var account = mongoose.model('accounts', accountSchema);

module.exports = account;