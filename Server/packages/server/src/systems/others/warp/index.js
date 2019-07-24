const warpLocations = require("./warpSchema.js");
global.warps = [];

let query = warpLocations.find({}, function(err, gps){
  if(err) { console.log(err); }
});

query.then((locations) => {
  warps = locations;
});


mp.events.addCommand("gotowarp", (player, fullText, ...param2) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(param2 == undefined) return player.pushExample('/gotowarp [Destination]');
  let found = false;
  param2 = param2.join(" ");
  warps.forEach((entity, index) => {
    if(entity.title == param2) {
      player.sendMessageToAdmins(`[Staff] ${player.name} teleported to warp: ${entity.title}.`, null, 'admin-message');
      if(!player.vehicle) {
        player.position = new mp.Vector3(entity.position.x, entity.position.y, entity.position.z);
      } else {
        player.vehicle.position = new mp.Vector3(entity.position.x, entity.position.y, entity.position.z);
      }
      found = true; 
    }
  });
  if(found == false) return player.pushError("Invalid warp name. Use /warps.");
});

mp.events.addCommand("tptowarp", (player, fullText, target, ...warpName) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || warpName == undefined) return player.pushExample('/tptowarp [Player ID / Name] [Destination]');
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  warpName = warpName.join(" ");
  let found = false;
  warps.forEach((entity, index) => {
    if(entity.title == warpName) {
      player.sendMessageToAdmins(`[Staff] ${player.name} teleported ${target.name} to warp: ${entity.title}.`, null, 'admin-message');
      if(!player.vehicle) {
        target.position = new mp.Vector3(entity.position.x, entity.position.y, entity.position.z);
      } else {
        target.vehicle.position = new mp.Vector3(entity.position.x, entity.position.y, entity.position.z);
      }
      target.pushChat(`${player.name} teleported you to warp ${warpName}`, null, 'admin-message');
      found = true; 
    }
  });
  if(found == false) return player.pushError("Invalid warp name. Use /warps.");
});

mp.events.addCommand("warps", (player, fullText, param1, ...param2) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  let finalWarps = [];
  warps.forEach((x) => {
    finalWarps.push(x.title);
  });
  finalWarps = finalWarps.join(", ");
  player.pushChat(`[Warps] ${finalWarps}`, null, 'server-message');
});

mp.events.addCommand("awarps", (player, fullText, param1, ...param2) => {
  if(!player.checkAdminRank(4)) return player.pushError(`You don't have permission to use this.`);
  if(param1 == undefined) return player.pushExample('/awarps [add, remove]');
  if(param1 == 'add') {
    if(param2 == undefined || param2.join(" ").length < 2) return player.pushExample('/awarps add [Name]');
    param2 = param2.join(" ");
    let pos = player.position;
    const warp = new warpLocations({ title: param2, position: { x: pos.x, y: pos.y, z: pos.z } });
    warp.save((err) => {
      if(err) return console.log(err);
      player.sendMessageToAdmins(`[Staff] ${player.name} created a warp destination: ${param2}.`, null, 'admin-message');
      query = warpLocations.find({}, function(err, gps){ if(err) { console.log(err); } });
      query.then((locations) => { warps = locations; });
    });
  }
  else if(param1 == "remove") {
    if(param2 == undefined || param2.join(" ").length < 2) return player.pushExample('/awarps remove [Name]');
    param2 = param2.join(" ");
    warpLocations.findOne({ title: param2 }, function(err, warp){
      if(warp == null) {
        return player.pushError("Invalid warp destination.");
      } else {
        player.sendMessageToAdmins(`[Staff] ${player.name} deleted warp: ${warp.title}.`, null, 'admin-message');
        warp.remove();
        query = warpLocations.find({}, function(err, gps){ if(err) { console.log(err); } });
        query.then((locations) => { warps = locations; });
      }
      if(err) { console.log(err); }
    });
  }
});

