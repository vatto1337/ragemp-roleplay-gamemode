const collection = require("../schema/publicVehicles");

mp.events.addCommand("pv", (player, fullText, command, param1, param2, param3) => {
  if(!player.checkAdminRank(7)) return player.pushError(`You don't have enough admin permissions.`);
  if(command == undefined) return player.pushExample(`/pv [add, remove, park, lock, goto]`); 
  if(command == 'add') {
    if(param1 == undefined) return player.pushExample(`/pv add [model]`); 
    if(!player.vehicleValid(param1)) return player.pushError(`The vehicle model name is not valid.`);
    let pos = player.position, entry;
    let color1 = generateRGB();
    entry = mp.vehicles.new(mp.joaat(param1), new mp.Vector3(pos.x, pos.y, pos.z), {
        dimension: player.dimension,
        color: [color1, color1],
        locked: false
    });
    let roty = entry.rotation;
    const veh = new collection({ model: param1, x: pos.x, y: pos.y, z: pos.z, rot: { x: roty.x, y: roty.y, z: roty.z } });
    veh.save((err) => {
      if(err) return console.log(err);
        entry.params = {
          id: veh._id,
          spawn: {
            x: pos.x,
            y: pos.y,
            z: pos.z,
            rot: {
              x: roty.x,
              y: roty.z,
              z: roty.z
            }
          },
          fuel: 100,
          owner: 'State of San Andreas',
          engine: false,
          type: 'Public vehicle'
        }
        // entry.locked = false; // bugfix
        player.sendMessageToAdmins(`[Staff] ${player.name} created a public vehicle: ${param1}.`, null, 'admin-message');
        player.putIntoVehicle(entry, -1);
        player.call('setEngineState', [player.vehicle.params.engine]);
    });
  }
  if(command == 'goto') {
    if(param1 == undefined) return player.pushExample(`/pv goto [id]`); 
    param1 = parseInt(param1);
    let calc = 0;
    let result = false;
    mp.vehicles.forEach((vehicle) => {
      if(vehicle.params.type != 'Public vehicle') return false;
      if(result == true) return;
      calc ++; 
      if(param1 != calc) return;
      result = true;
      let veh = vehicle;
      if(!player.vehicle) {
          veh.position.z += 5.0;
          player.position = veh.position;
      } else {
        veh.position.x += 2.0;
        player.vehicle.position = veh.position;
      }
      player.notify(`Teleported to public veh ~r~${param1}`);
    });  
    if(result == false) return player.pushError(`The public vehicle id is not valid.`);
  }
  if(command == 'remove' || command == 'delete') {
    if(!player.vehicle || player.vehicle.params.type != 'Public vehicle') return player.pushError(`You must use this command inside a public vehicle.`);
    let result = false;
    mp.vehicles.forEach((vehicle) => {
      if(vehicle != player.vehicle) return false;
      if(vehicle.params.type != 'Public vehicle') return false;
      if(result == true) return;
      result = true;
      collection.deleteOne({ _id : vehicle.params.id }, function (err, veh) {
        if (err) return handleError(err);
        player.sendMessageToAdmins(`[Staff] ${player.name} just deleted a public vehicle.`, null, 'admin-message');
        vehicle.destroy();
        vehicle.params = {}
      });
    });   
  }
  if(command == 'park') {
    if(!player.vehicle || player.vehicle.params.type != 'Public vehicle') return player.pushError(`You must use this command inside a public vehicle.`);
    let result = false;
    mp.vehicles.forEach((vehicle) => {
      if(vehicle != player.vehicle) return false;
      if(vehicle.params.type != 'Public vehicle') return false;
      if(result == true) return;
      result = true;
      let pos = vehicle.position;
      let roty = vehicle.rotation;
      collection.findOne({ _id : vehicle.params.id }, function (err, veh) {
        if (err) return console.log(err);
        veh.set({ x: pos.x, y: pos.y, z: pos.z, rot: { x: roty.x, y: roty.y, z: roty.z } });
        veh.save((err) => {
          if(err) return console.log(err);
          vehicle.params.spawn = { x: pos.x, y: pos.y, z: pos.z, rot: { x: roty.x, y: roty.y, z: roty.z } }
          player.notify('~R~You updated this public vehicle parking position.');
        });
      });
    });    
  }
  if(command == 'lock') {
    let result = false;
    mp.vehicles.forEachInRange(player.position, 10,
      (vehicle) => {
        if(vehicle.params.type != 'Public vehicle') return false;
        if(result == true) return;
        result = true;
        let newState = !vehicle.locked;
        vehicle.locked = newState;
        player.notify(`Doors state: ${newState ? `~r~closed` : `~g~opened`}`);
      }
    );
    if(result == false) return player.pushError(`You must use this command near a public vehicle.`);
  }
});
