module.exports = {
  loadSystems: function() {
    var systems = require('require-all') ({
      dirname : __dirname + '../../systems',
      filter  : /^(index)\.js$/
    });
  }
}

