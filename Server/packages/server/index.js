const mongoose = require('mongoose');

const { loadSystems } = require("./src/utils/core");

mongoose.connect('mongodb://localhost:27017/project_v', { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', function (error) {
  console.log('[DEBUG] MongoDB Connection error: ' + error.message);
});

db.once('open', function () {
  console.log("[DEBUG] Server started at " + Date());
  loadSystems();
});

