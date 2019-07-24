// To-Do: 
// Insurances per vehicle death
// Comanda la admini prin care vad despre masina detinuta

mp.events.add("loadVariables", player => {
  player.vars.personalVehicles = [];
});

mp.events.add("playerEnterVehicle", (player, vehicle, seat) => {
  if(vehicle.params.type == 'Personal Vehicle') {
    if(seat != -1) return false;
    if(player.name != vehicle.params.owner) {
      player.pushChat('* This ' + vehicle.params.modelName + ' is owned by ' + vehicle.params.owner + '.', null, 'vehicle-message');
    }
    else {
      player.pushChat('* Welcome back to your ' + vehicle.params.modelName + ', ' + vehicle.params.owner + '.', null, 'vehicle-message');
    }
  }
});

mp.events.add('lockVehicle', (player) => {
  if(player.hasItemInInventory('Vehicle Key')) {
    let found = false;
    player.info.inventory.forEach((item, index) => {
      if(item.type != 15) return;
      if(found == true) return;
      player.vars.personalVehicles.forEach((pers, xx) => {
        if(pers.id != item.guid) return;
        let pos = pers.entity.position;
        if (player.IsInRange(pos.x, pos.y, pos.z, 4)) {
          item.locked = !item.locked;
          pers.entity.locked = item.locked;
          player.pushChat(`(${xx}) ${item.modelName} is now ${item.locked == true ? 'locked' : 'unlocked'}.`, null, 'vehicle-message');
          found = true;
        }
      });
    });
  }
});

function cmd_v(player,fullText, option, id) {
  if(!player.hasItemInInventory('Vehicle Key')) return player.pushError("You don't own any vehicles.");
  if(!player.vars.personalVehicles.length > 0) return player.pushError("You don't have any vehicles spawned. Use the vehicle keys item to spawn them.");
  let vehicleIndex = null, vehicleIDsArray = [];
  player.info.inventory.forEach((i, x) => {
    if(i.type == 15) {
      player.vars.personalVehicles.forEach((p, x2) => {
        if(p.id == i.guid) {
          vehicleIDsArray.push(`(${x2}) ${i.modelName}`);
        }
      });
    }
  });
  if(id == undefined) {
    player.vars.personalVehicles.forEach((veh, index) => {
      let pos = veh.entity.position;
      if (player.IsInRange(pos.x, pos.y, pos.z, 5) || player.vehicle == veh.entity) {
        id = index;
      }
    });
  }
  if(option == undefined || id == undefined) { 
    player.pushExample(`/v [stats, (un)lock, park, find, tow, pay] ${id == undefined ? '[Vehicle ID]' : ''}`);
    if(id == undefined) {
      player.pushInfo('Spawned vehicles: ' + vehicleIDsArray.join(", "));
      player.pushExample('/v stats 0');
    }
    return false;
  }
  id = parseInt(id);
  if(player.vars.personalVehicles[id] == undefined) return player.pushError("Invalid number. Spawned vehicles: " + vehicleIDsArray.join(", "));
  if(option == 'stats') {
    let found = false;
    player.info.inventory.forEach((item, itemIndex) => {
      if(found == true) return;
      if(item.type == 15 && item.spawned == true) {
        if(item.guid != player.vars.personalVehicles[id].id) return;
        let vehicleID = null;
        mp.vehicles.forEach((veh, ixx) => {
          if(veh == player.vars.personalVehicles[id].entity) {
            vehicleID = veh.id;
          }
        });
        player.pushChat(`(${id}) ${item.modelName} - Insurance cost: ${formatMoney(item.insurance, 0)}$, Locked: ${item.locked == true ? 'Yes' : 'No'}, Plate: ${item.plate}, Vehicle ID: ${vehicleID}.`, null, 'vehicle-message');
        found = true;
      }
    });
  }
  if(option == 'pay') {
    let found = false;
    player.info.inventory.forEach((item, itemIndex) => {
      if(found == true) return;
      if(item.type == 15 && item.spawned == true) {
        if(item.guid != player.vars.personalVehicles[id].id) return;
        if(item.needMechanic == false) return player.pushChat('This vehicle does not require another insurance payment.');
        if(player.getMoney() < item.insurance) return player.pushError("You don't have enough money.");
        player.takeMoney(item.insurance);
        item.needMechanic = false;
        player.pushChat(`(${id}) ${item.modelName}'s insurance costs have been paid.`, null, 'vehicle-message');
        found = true;
      }
    });    
  }
  if(option == 'lock' || option == 'unlock') {
    let found = false;
    player.info.inventory.forEach((item, itemIndex) => {
      if(found == true) return;
      if(item.type == 15 && item.spawned == true) {
        if(item.guid != player.vars.personalVehicles[id].id) return;
        item.locked = option == 'lock' ? true : false;
        player.vars.personalVehicles[id].entity.locked = item.locked;
        player.pushChat(`(${id}) ${item.modelName} is now ${item.locked == true ? 'locked' : 'unlocked'}.`, null, 'vehicle-message');
        found = true;
      }
    });
  }
  if(option == 'park') {
    let found = false;
    player.info.inventory.forEach((item, itemIndex) => {
      if(found == true) return;
      if(item.type == 15 && item.spawned == true) {
        if(item.guid != player.vars.personalVehicles[id].id) return;
        if(player.vehicle != player.vars.personalVehicles[id].entity) return player.pushError("You must be inside the vehicle to park it.");
        let foundgps = false;
        gpsLocation.forEach((gps, index) => {
          if(player.IsInRange(gps.position.x, gps.position.y, gps.position.z, 30)) {
            foundgps = true;
          }
        });
        if(foundgps == true) return player.pushError("You can't park the vehicle in this popular area.");
        let pers = player.vars.personalVehicles[id];
        let pos = pers.entity.position;
        let rot = pers.entity.rotation;
        item.pos.park = pos;
        item.pos.rot = rot;
        pers.entity.params.spawn = { x: pos.x, y: pos.y, z: pos.z, rot: { x: rot.x, y: rot.y, z: rot.z } }
        player.pushChat(`(${id}) ${item.modelName} has been parked here.`, null, 'vehicle-message');
        found = true;
      }
    });
  }
  if(option == 'find') {
    let found = false;
    player.info.inventory.forEach((item, itemIndex) => {
      if(found == true) return;
      if(item.type == 15 && item.spawned == true) {
        if(item.guid != player.vars.personalVehicles[id].id) return;
        let pers = player.vars.personalVehicles[id];
        let pos = pers.entity.position;
        player.call('createGPSBlip', [pos.x,pos.y,pos.z, `(${id}) ${item.modelName}`]);
        player.pushChat(`(${id}) ${item.modelName}'s location is now shown on your map.`, null, 'vehicle-message');
        found = true;
      }
    });
  }
  if(option == 'tow') {
    let found = false;
    player.info.inventory.forEach((item, itemIndex) => {
      if(found == true) return;
      if(item.type == 15 && item.spawned == true) {
        if(item.guid != player.vars.personalVehicles[id].id) return;
        if(player.getMoney() < 100) return player.pushError("You don't have 100$ to pay for the towing services.");
        let found = false;
        mp.players.forEach((target, index) => {
          if(!target.loggedIn || target.loggedIn == false || target.info.justRegistered == true) return;
          if(found == true) return;
          if(target.vehicle == player.vars.personalVehicles[id].entity) { found = true; }
        });
        if(found == true) return player.pushError("You can't respawn your vehicle while someone is using it.");
        RespawnVehicle(player.vars.personalVehicles[id].entity);
        player.takeMoney(100);
        player.pushChat(`(${id}) ${item.modelName} has been towed for 100$ to its parking location.`, null, 'vehicle-message');
        found = true;
      }
    });
  }
}

mp.events.addCommand("v", cmd_v);
mp.events.addCommand("vehicle", cmd_v);


mp.events.add('onItemUse', (player, itemx, extraData) => {
  let found = false;
  if(itemx.type != 15) return false;
  player.info.inventory.forEach((item, index) => {
    if(found == true) return false;
    if(item.type == 15 && index == extraData.index) {
      if(item.spawned == false) {
        if(item.firstSpawn == true) {
          if (player.vehicle) return player.notifyError("You can't use this item inside a vehicle."), found = true;
          let foundgps = false;
          gpsLocation.forEach((gps, index) => {
            if(player.IsInRange(gps.position.x, gps.position.y, gps.position.z, 30)) {
              foundgps = true;
            }
          });
          if(foundgps == true) return player.notifyError("You can't spawn the vehicle in this popular area."), found = true;
          let pos = player.position;
          pos.x + 5.0;
          item.pos.park = { x: pos.x, y: pos.y, z: pos.z }
          item.pos.rot = { x: 0, y: 0, z: 90 };
        }
        let park = item.pos.park;
        let rot = item.pos.rot;
        let carObject = { id: guidGenerator(), entity: null }
        player.vars.personalVehicles.push(carObject);
        item.guid = carObject.id;
        player.vars.personalVehicles[player.vars.personalVehicles.indexOf(carObject)].entity = mp.vehicles.new(mp.joaat(item.model), new mp.Vector3(park.x, park.y, park.z),
        {
          locked: item.locked,
          engine: false,
          dimension: item.dimension
        });
        let persVehicle = player.vars.personalVehicles[player.vars.personalVehicles.indexOf(carObject)].entity;
        persVehicle.params = {
          fuel: item.fuel,
          owner: player.name,
          engine: false,
          type: 'Personal Vehicle',
          modelName: item.modelName
        }
        persVehicle.params.spawn = { x: park.x, y: park.y, z: park.z, rot: { x: rot.x, y: rot.y, z: rot.z } }
        persVehicle.numberPlate = item.plate;
        persVehicle.setColorRGB(item.paint.color1[0], item.paint.color1[1], item.paint.color1[2], item.paint.color2[0], item.paint.color2[1], item.paint.color2[2]);
        persVehicle.rotation = new mp.Vector3(rot.x, rot.y, rot.z);
        persVehicle.dimension = item.dimension;
        item.spawned = true;
        item.spawnedIndex = player.vars.personalVehicles.indexOf(carObject);
        persVehicle.setVariable('fuel', item.fuel);
        item.tuning.forEach((mod, index) => {
          persVehicle.setMod(index, parseInt(mod));
        });
        if(item.firstSpawn == true) {
          item.firstSpawn = false;
          player.notifySuccess(`${item.modelName} has been spawned for the first time.`);
          player.pushChat('Information: Use /v to manage your vehicle.', null, 'vehicle-message');
          player.pushChat("Information: Press K near the vehicle to (un)lock it.", null, 'vehicle-message');
          player.putIntoVehicle(persVehicle, -1);
          player.call('setEngineState', [persVehicle.params.engine]);
        } else {
          player.notifySuccess(`${item.modelName} has been spawned. Use /v to manage it.`);
        }
        item.despawnSeconds = 1800;
        found = true;
      }
      else if(item.spawned == true) {
        return player.notifyError("This vehicle is already spawned.");
        let foundx = false;
        player.vars.personalVehicles.forEach((pers, index) => {
          if(foundx == true) return;
          if(pers.id == item.guid) {
            item.guid = null;
            item.fuel = pers.entity.params.fuel;
            pers.entity.destroy();
            foundx = true;
            found = true;
            player.vars.personalVehicles.splice(index, 1);
            player.notifyError(`${item.modelName} has been despawned.`);
            item.spawned = false;
          }
        });
      }
    }
  });
});

mp.events.add('loggedJoin', player => {
  player.info.inventory.forEach((item, index) => {
    if(item.type == 15) {
      item.spawned = false; // Bugfix cand mai sunt crash-uri de la server.
      item.despawnSeconds = 0;
    }
  });
});

mp.events.add("playerTimer", (player) => {
  if(player.vars) {
    if(player.hasItemInInventory('Vehicle Key')) {
      player.info.inventory.forEach((item, index) => {
        if(item.type == 15) {
          if(item.spawned == false) return;
          player.vars.personalVehicles.forEach((pers, ix) => {
            if(pers.id == item.guid) {
              item.despawnSeconds --;
              if(item.despawnSeconds < 1) {
                item.spawned = false;
                item.guid = null;
                item.fuel = pers.entity.params.fuel;
                pers.entity.destroy();
                player.vars.personalVehicles.splice(ix, 1);
                player.pushChat(`${item.modelName} has been despawned after 30 minutes. (Unused vehicle)`, null, 'vehicle-message');
                player.pushChat(`If you wish to spawn ${item.modelName} again, use the item in your inventory to do so.`, null, 'vehicle-message');
              }
            }
          });
        }
      });
    } 
    if(player.vehicle) {
      if(player.vehicle.params.type == 'Personal Vehicle') {
        let owner = player.vehicle.params.owner;
        let target = getPlayerID(owner);
        if(!target || target.loggedIn == false || target.info.justRegistered == true) return;
        target.info.inventory.forEach((item, index) => {
          if(item.type == 15) {
            target.vars.personalVehicles.forEach((pers, ix) => {
              if(pers.id == item.guid) {
                if(pers.entity == player.vehicle) {
                  item.despawnSeconds = 1800;
                }
              }
            });
          }
        });
      }
    }
  }
});

mp.events.add('onItemDelete', (player, item) => { 
  if(item.type == 15) {
    if(item.spawned == true) {
      let found = false;
      player.vars.personalVehicles.forEach((pers, index) => {
        if(found == true) return;
        if(pers.id == item.guid) {
          item.spawned = false;
          item.guid = null;
          item.fuel = pers.entity.params.fuel;
          pers.entity.destroy();
          found = true;
          player.vars.personalVehicles.splice(index, 1);
        }
      });
    }
    player.notifyError(`You have removed ${item.modelName} from inventory.`);
  }
});

mp.events.add("loggedQuit", (player, exitType, reason) => {
  if(player.hasItemInInventory('Vehicle Key')) {
    player.info.inventory.forEach((item, index) => {
      if(item.type == 15) {
        if(item.spawned != true) return;
        if(item.spawned == true) {
          let found = false;
          player.vars.personalVehicles.forEach((pers, persIndex) => {
            if(found == true) return;
            if(pers.id == item.guid) {
              item.spawned = false;
              item.guid = null;
              item.fuel = pers.entity.params.fuel;
              pers.entity.destroy();
              found = true;
              player.vars.personalVehicles.splice(persIndex, 1);
            }
          });
        }
      }
    });
  }
});

function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

mp.events.add("vehicleDamage", (vehicle, bodyHealthLoss, engineHealthLoss) => {
  console.log(vehicle.engineHealth, vehicle.bodyHealth);
  if(vehicle.bodyHealth < 300) {
    mp.players.forEach((player) => {
      if(player.vehicle == vehicle) {
        player.health = 0;
      }
    });
    let pos = vehicle.params.spawn;
    console.log(vehicle.params.spawn);
    vehicle.position = new mp.Vector3(pos.x, pos.y, pos.z);
    vehicle.rotation = new mp.Vector3(pos.rot.x, pos.rot.y, pos.rot.z);
    vehicle.params.engine = false;
    vehicle.repair();
    if(vehicle.params.type == 'Job Vehicle') {
      mp.events.call('onJobVehicleDeath', vehicle);
    }
    if(vehicle.params.type == 'Personal Vehicle') {
      let target = getPlayerID(vehicle.params.owner);
      target.info.inventory.forEach((item, index) => {
        if(item.type != 15) return;
        target.vars.personalVehicles.forEach((pers, index2) => {
          if(pers.id != item.guid) return;
          if(pers.entity == vehicle) {
            item.insurance += 5;
            item.needMechanic = true;
          }
        });
      });
    }
  }
});