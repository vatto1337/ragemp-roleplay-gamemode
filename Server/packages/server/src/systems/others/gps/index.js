const gpsLocations = require("./gpsSchema.js");
global.gpsLocation = [];

let query = gpsLocations.find({}, function(err, gps){
  if(err) { console.log(err); }
});

query.then((locations) => {
  gpsLocation = locations;
});

mp.events.addCommand("gps", (player, fullText) => {
  if(gpsLocation.lengh < 1) return player.pushError("There are no available gps locations.");
  player.call('toggleModal',[6, 'chat', JSON.stringify({ locations: gpsLocation, selected: -1 })]);
});

mp.events.addCommand("agps", (player, fullText, param1, ...param2) => {
  if(!player.checkAdminRank(4)) return player.pushError(`You don't have permission to use this.`);
  if(param1 == undefined) return player.pushExample('/agps [add, remove]');
  if(param1 == 'add') {
    if(param2 == undefined || param2.join(" ").length < 2) return player.pushExample('/agps add [Name]');
    param2 = param2.join(" ");
    let pos = player.position;
    const gps = new gpsLocations({ title: param2, position: { x: pos.x, y: pos.y, z: pos.z } });
    gps.save((err) => {
      if(err) return console.log(err);
      player.sendMessageToAdmins(`[Staff] ${player.name} created a gps location: ${param2}.`, null, 'admin-message');
      query = gpsLocations.find({}, function(err, gps){ if(err) { console.log(err); } });
      query.then((locations) => { gpsLocation = locations; });    
    });

  }
  else if(param1 == "remove") {
    if(param2 == undefined || param2.join(" ").length < 2) return player.pushExample('/agps remove [Name]');
    param2 = param2.join(" ");
    gpsLocations.findOne({ title: param2 }, function(err, gps){
      if(gps == null) {
        return player.pushError("I can't find this gps location's name.");
      } else {
        player.sendMessageToAdmins(`[Staff] ${player.name} deleted ${gps.title} from gps.`, null, 'admin-message');
        gps.remove();
        query = gpsLocations.find({}, function(err, gps){ if(err) { console.log(err); } });
        query.then((locations) => { gpsLocation = locations; });  
      }
      if(err) { console.log(err); }
    });
  }
});

