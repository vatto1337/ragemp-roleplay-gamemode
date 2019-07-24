mp.events.add("VehicleEngine", (player) => {
  if(player.vehicle && player.vehicleModelHaveEngine(player.vehicle.model) && player.seat == -1) {
    if(player.vehicle.params.fuel == 0) return player.notify("~r~Vehicle out of fuel.");
    let veh = player.vehicle;
    if(veh.params.engine == false) {
      let issuesEngine = false;
      if(veh.params.type == 'Personal Vehicle') {
        let target = getPlayerID(veh.params.owner);
        target.info.inventory.forEach((item, index) => {
          if(item.type != 15) return;
          target.vars.personalVehicles.forEach((pers, index2) => {
            if(pers.id != item.guid) return;
            if(pers.entity == veh) {
              if(item.needMechanic == true) {
                issuesEngine = item.insurance;
              }
            }
          });
        });
        if(issuesEngine != false) return player.pushChat(`This vehicle has been damaged. You must pay the insurance of ${formatMoney(issuesEngine, 0)}$ before using it. [/v pay]`, null, 'vehicle-message');
      }
    }
    player.call('setEngineState', [!veh.params.engine]);
    veh.params.engine = !veh.params.engine;
    player.notify(`Vehicle engine ${veh.params.engine == true ? '~g~started' : '~r~stopped' }.`);
    if(player.vars.dmv.status == true && player.vars.dmv.stage == 0) {
      player.clearSubtitles();
      player.giveSubtitle("~y~Instructor:~w~ Good. Now look on the right side of the minimap.", 15);
      player.giveSubtitle("~y~Instructor:~w~ The fuel of the vehicle will decrease once every 30 seconds.", 15);
      player.giveSubtitle("~y~Instructor:~w~ When it lowers too much, you must go to a ~r~Gas Station.", 15);
      player.giveSubtitle("~y~Instructor:~w~ Now let's just drive around town. ~r~(Follow the red checkpoints)", 15);
    }
  }
});

mp.events.add("playerEnterVehicle", (player, vehicle, seat) => {
  if(player.vehicleModelHaveEngine(player.vehicle.model) && seat == -1) {
    player.call('setEngineState', [player.vehicle.params.engine]);
    if(player.vehicle.params.engine == false && player.hasItemInInventory("Driving License")) {
      player.notify("Engine is off. Press ~y~2");
    }
  } else {
    player.call('setEngineState', [true]);
  }
  player.setVariable('seat', seat);
  vehicle.setVariable('fuel', vehicle.params.fuel);
});

mp.events.add("setDoorShut", (player, vehicle, id, toggle) => {
  mp.players.forEach((_player) => {
    if(!_player.loggedIn || _player.loggedIn == false) return;
    player.call('setDoorShut', [vehicle, id, toggle]);
  });
});

mp.events.add("setDoorOpen", (player, vehicle, id, toggle) => {
  mp.players.forEach((_player) => {
    if(!_player.loggedIn || _player.loggedIn == false) return;
    player.call('setDoorOpen', [vehicle, id, toggle]);
  });
});

global.RespawnVehicle = function(vehicle) {
  mp.players.forEach((player) => {
    if(player.vehicle == vehicle) {
      let pos = player.position;
      pos.z += 1.5;
      player.position = pos;
    }
  });
  let pos = vehicle.params.spawn;
  vehicle.position = new mp.Vector3(pos.x, pos.y, pos.z);
  vehicle.rotation = new mp.Vector3(pos.rot.x, pos.rot.y, pos.rot.z);
  if(vehicle.params.type != 'Personal Vehicle') {
    vehicle.params.fuel = 100;
    vehicle.repair();
  }
  vehicle.params.engine = false;
}

global.RespawnAllVehicles = function() {
  mp.vehicles.forEach((vehicle) => {
    if(IsVehicleUsed(vehicle)) return;
    let pos = vehicle.params.spawn;
    vehicle.position = new mp.Vector3(pos.x, pos.y, pos.z);
    vehicle.rotation = new mp.Vector3(pos.rot.x, pos.rot.y, pos.rot.z);
    vehicle.params.fuel = 100;
    vehicle.repair();
  });
}

global.IsVehicleUsed = (vehicle) => {
  let result = false;
  mp.players.forEach((_player) => {
    if(_player.loggedIn != true) return;
    if(result == true) return;
    if(_player.vehicle == vehicle) { result = true; }
  });
  return result;
}