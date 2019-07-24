const accounts = require("../../schema/accounts.js");

mp.events.addCommand("savedata", (player, fullText) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  mp.players.forEach((p) => {
    if(!p.loggedIn || p.loggedIn == false) return;
    p.savePlayerInfo();
  });
  saveHouses();
  saveBusinesses();
  SaveDatas();
  // SaveGroups();
  player.pushChat('* All server data has been saved.');
});

mp.events.addCommand("pse", (player, fullText, collection, set) => {
  if(collection == undefined || set == undefined) return player.pushExample("/pse [collection] [set]");
  player.call("playSoundEffect", [collection, set]);
});

mp.events.addCommand("makeadmin", (player, fullText, target, rank) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || rank == undefined) return player.pushExample(`/makeadmin [Target ID / Name] [Rank]`); 
  target = getPlayerID(target), rank = parseInt(rank);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.sendMessageToAdmins(`[Staff] ${player.name} has ${ target.info.admin >= rank ? 'demoted' : 'promoted'} ${target.name} to administration level ${rank}.`, null, 'admin-message');
  target.info.admin = rank;
  target.savePlayerInfo();
});

mp.events.addCommand("setinfo", (player, fullText, target, info, value) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || info == undefined || value == undefined) return player.pushExample(`/setinfo [Target ID / Name] [Info] [Value]`); 
  if(value == 'null') { value = null; }
  else { value = parseInt(value); }
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.info[info] == undefined) return player.pushError('Invalid infos. Example of available infos: ' + Object.keys(player.info).join(', '));
  target.info[info] = value;
  target.savePlayerInfo();
  player.pushChat(`You've changed info ${info} to ${value} for ${target.name}.`);
});

mp.events.addCommand("setvars", (player, fullText, target, info, value) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || info == undefined || value == undefined) return player.pushExample(`/setvars [Target ID / Name] [Info] [Value]`); 
  if(value == 'null') { value = null; }
  else { value = parseInt(value); }
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.vars[info] == undefined) return player.pushError('Invalid infos. Example of available infos: ' + Object.keys(player.info).join(', '));
  target.vars[info] = value;
  player.pushChat(`You've changed var ${info} to ${value} for ${target.name}.`);
});

mp.events.addCommand("setclothes", (player, fullText, component, draw, texture) => {
  player.setClothes(parseInt(component), parseInt(draw), parseInt(texture), 0);
}); 

mp.events.addCommand("setmask", (player, fullText, target, mask) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || mask == undefined || parseInt(mask) < 0 || parseInt(mask) > 147) return player.pushExample(`/setmask [Target ID / Name] [0-147]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.info.character.mask = parseInt(mask);
  mp.events.call("loadClothes", target);
  player.notify(`~r~${target.name} mask is now ${parseInt(mask)}.`);
});


mp.events.addCommand("setname", (player, fullText, target, ...name) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || name == undefined) return player.pushExample(`/setname [Target ID / Name] [Fake Name]`); 
  target = getPlayerID(target), name = name.join(" ");
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(name == 'null') {
    target.vars.fakeName = null;
    player.notify(`~r~${target.name} fake name is disabled.`);
  } else {
    target.vars.fakeName = name;
    player.notify(`~r~${target.name} display name is ${name}.`);
  }  
});

mp.events.addCommand("reloaddata", (player, fullText) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  player.sendMessageToAdmins(`[Staff] ${player.name} reloaded server data.`, null, 'admin-message');
  LoadServerData(1);
});

mp.events.addCommand("check", (player, fullText, target) => {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/check [Target ID / Name]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  mp.events.call("requestPlayerInventory", player, target);
});

mp.events.addCommand("setmoney", (player, fullText, target, money) => {
  if(!player.checkAdminRank(5)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || money == undefined) return player.pushExample(`/setmoney [Target ID / Name] [money]`); 
  target = getPlayerID(target), money = parseInt(money);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.sendMessageToAdmins(`[Staff] ${player.name} set ${target.name} cash (${player.formatMoney(money, 0)}$)`, null, 'admin-message');
  target.info.wallet = money;
  target.savePlayerInfo();
});

mp.events.addCommand("givemoney", (player, fullText, target, money) => {
  if(!player.checkAdminRank(5)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || money == undefined) return player.pushExample(`/givemoney [Target ID / Name] [Money]`); 
  target = getPlayerID(target), money = parseInt(money);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.sendMessageToAdmins(`[Staff] ${player.name} gave ${target.name} cash (${player.formatMoney(money, 0)}$)`, null, 'admin-message');
  target.giveMoney(money);
  target.savePlayerInfo();
});

mp.events.addCommand("takemoney", (player, fullText, target, money) => {
  if(!player.checkAdminRank(5)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || money == undefined) return player.pushExample(`/takemoney [Target ID / Name] [Money]`); 
  target = getPlayerID(target), money = parseInt(money);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.sendMessageToAdmins(`[Staff] ${player.name} took cash from ${target.name} (${player.formatMoney(money, 0)}$)`, null, 'admin-message');
  target.takeMoney(money);
  target.savePlayerInfo();
});

mp.events.addCommand("setbank", (player, fullText, target, money) => {
  if(!player.checkAdminRank(5)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || money == undefined) return player.pushExample(`/setbank [Target ID / Name] [Money]`); 
  target = getPlayerID(target), money = parseInt(money);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.sendMessageToAdmins(`[Staff] ${player.name} set ${target.name} bank (${player.formatMoney(money, 0)}$)`, null, 'admin-message');
  target.info.bank = money;
  target.savePlayerInfo();
});

mp.events.addCommand("a", (player, fullText) => {
  if(fullText == undefined) return player.pushExample("/a [Message]");
  if(!player.checkAdminRank(1)) return player.pushError(`You don't have permission to use this.`);
  let message = stripStuff(fullText);
  message = `Admin ${player.info.admin} ${player.name} says: ${message}`;
  player.sendMessageToAdmins(message, '#FF7518');
});

mp.events.addCommand("o", (player, fullText) => {
  if(fullText == undefined) return player.pushExample("/o [Message]");
  if(!player.checkAdminRank(7)) return player.pushError(`You don't have permission to use this.`);
  let message = stripStuff(fullText);
  mp.players.forEach((_player) => {
    if(!_player.loggedIn || _player.loggedIn == false) return;
    _player.pushChat(`(( ${player.name} says: ${message} ))`, null, 'server-message');
    _player.giveSubtitle(`(( ~y~${player.name}: ~w~says ${message.length > 60 ? message.substring(0, 60) : message} ))`, 20);
  });
});

mp.events.addCommand("sm", (player, fullText, time, ...msg) => {
  if(!player.checkAdminRank(7)) return player.pushError(`You don't have permission to use this.`);
  if(time == undefined || msg == undefined || parseInt(time) < 0) return player.pushExample('/sm [seconds] [message]');
  let message = stripStuff(msg.join(" "));
  mp.players.forEach((_player) => {
    if(!_player.loggedIn || _player.loggedIn == false) return;
    _player.giveSubtitle(`${message}`, parseInt(time));
  });
  player.sendMessageToAdmins(`[Staff] ${player.name} has sent a server message that lasted ${parseInt(time)} seconds.`, null, 'admin-message');
});

mp.events.addCommand("restartserver", (player, fullText) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  if(fullText == undefined) return player.pushExample(`/restartserver [Reason]`); 
  let message = stripStuff(fullText);
  message = `(Warning) The server will restart in 30 seconds. [${fullText} - ${player.name}]`;
  player.pushChatToAll(message, null, 'admin-message');
  setTimeout(() => {
    mp.players.forEach((_player) => {
      _player.notify('Server restarted.');
      _player.kick();
    });
  }, 30000);
});

mp.events.addCommand("goto", (player, fullText, target) => {
  if(!player.checkAdminRank(1)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/goto [Target ID / Name]`); 
  target = getPlayerID(target);
  if(target == player) return player.pushError(`You're not supposed to use this command on yourself.`);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.position = target.position;
  player.dimension = target.dimension;
  player.vars.bizzEntered = target.vars.bizzEntered;
  player.vars.houseEntered = target.vars.houseEntered;
  player.sendMessageToAdmins(`[Staff] ${player.name} teleported to ${target.name} with admin command.`, null, 'admin-message');
});

mp.events.addCommand("gotoxyz", (player, fullText, x,y,z) => {
  if(!player.checkAdminRank(1)) return player.pushError(`You don't have permission to use this.`);
  if(x == undefined || y == undefined || z == undefined) return player.pushExample(`/gotoxyz [x] [y] [z]`); 
  x = parseFloat(x), y = parseFloat(y), z = parseFloat(z);
  if(!player.vehicle) {
    player.position = new mp.Vector3(x,y,z);
  } else {
    player.vehicle.position = new mp.Vector3(x,y,z);
  }
  player.notify(`You teleported to position: ${x}, ${y}, ${z}`);
});

mp.events.addCommand("eject", (player, fullText, target) => {
  if(!player.vehicle) return player.pushError("This command can be used only inside a vehicle.");
  if(player.seat != -1) return player.pushError("Only the driver of a vehicle can use this command.");
  if(target == undefined) return player.pushExample("/eject [Player ID / Name]");
  target = getPlayerID(target);
  if(target == player) return player.pushError(`You're not supposed to use this command on yourself.`);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.vehicle != player.vehicle) return player.pushError("This player is not inside your vehicle.");
  target.call('playerLeaveVehicle');
  player.pushChat(`* ${player.name} asks ${target.name} to get out of the vehicle.`, null, 'action-message');
  target.pushChat(`* ${player.name} asks ${target.name} to get out of the vehicle.`, null, 'action-message');
});

mp.events.addCommand("loadipl", (player, fullText, ipl) => {
  if(!player.checkAdminRank(1)) return player.pushError(`You don't have permission to use this.`);
  if(ipl == undefined) return player.pushExample(`/loadipl [ipl]`); 
  player.call('requestIPL', ipl);
  player.notify(`You loaded ipl: ${ipl}`);
});

mp.events.addCommand("gethere", (player, fullText, target) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/gethere [Target ID / Name]`); 
  target = getPlayerID(target);
  if(target == player) return player.pushError(`You're not supposed to use this command on yourself.`);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(!target.vehicle) {
    target.position = player.position;
  } else {
    target.vehicle.position = player.position;
    target.vehicle.dimension = player.dimension;
  }
  if(!target.checkAdminRank(1)) {
    target.pushChat(`${player.name} brought you to his position.`, null, 'admin-message');
  }
  target.dimension = player.dimension;
  target.vars.bizzEntered = player.vars.bizzEntered;
  target.vars.houseEntered = player.vars.houseEntered;
  player.sendMessageToAdmins(`[Staff] ${player.name} teleported ${target.name} to him with admin command.`, null, 'admin-message');
});

mp.events.addCommand("createobject", (player, fullText, object) => {
  if(object == undefined) return player.pushExample("/object name");
  mp.objects.new(mp.joaat(object), new mp.Vector3(player.position),
  {
        rotation: player.heading,
        alpha: 1,
        dimension: player.dimension
  });
});

mp.events.addCommand("givegun", (player, fullText, target, weapon, ammo) => {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || weapon == undefined) return player.pushExample(`/givegun [Target ID / Name] [Weapon] [Ammo]`); 
  target = getPlayerID(target), ammo = parseInt(ammo);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(!player.weaponValid('weapon_' + weapon)) return player.pushError(`The weapon name is not valid.`);
  if(!target.checkAdminRank(1)) {
    target.pushChat(`${player.name} gave you you a weapon: ${weapon} with ${ammo || 1000} ammo.`, null, 'admin-message');
  }
  target.notify(`~c~New item: ~w~${weapon}.~n~~w~Press F2 to use it.`);
  let found = false;
  target.info.inventory.forEach((item, index) => {
    if(item.type == 11) {
      if(item.weapon_name == 'weapon_' + weapon) {
        found = true;
        item.quantity += ammo || 100;
      }
    }
  });
  if(found == false) {
    target.info.inventory.push({
      title: weapon, // Title
      type: 11, // Type
      stackable: true, // Stackable,
      quantity: ammo || 100, // Quantity
      canBeUsed: true, // Can be used
      canBeTradable: true, // Can be traded,
      weapon_name: 'weapon_' + weapon,
      markedForTrade: false
    });
  }
  player.sendMessageToAdmins(`[Staff] ${player.name} gave ${target.name} a weapon: ${weapon} with ${ ammo || 100 } ammo.`, null, 'admin-message');
});

mp.events.addCommand("disarm", (player, fullText, target) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/disarm [Target ID / Name]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.removeAllWeapons();
  player.sendMessageToAdmins(`[Staff] ${player.name} removed ${target.name}'s weapons.`, null, 'admin-message');
});

mp.events.addCommand("respawn", (player, fullText, target) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/respawn [Target ID / Name]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.respawnMyself();
  player.sendMessageToAdmins(`[Staff] ${player.name} respawned ${target.name}.`, null, 'admin-message');
});

mp.events.addCommand("savepos", (player, fullText, param1, param2) => {
  if(!player.checkAdminRank(1)) return player.pushError(`You don't have permission to use this.`);
  if(param1 == undefined || param2 == undefined) return player.pushExample("/savepos [0/1] [Name]");
  param1 = parseInt(param1);
  let pos = player.position;
  player.pushChat(`Your position has been sent to the server console log.`, null, 'server-message');
  if(param1 == 1) {
    if(!player.vehicle) {
      console.log(`[${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)}, ${player.heading.toFixed(3)}] // ${param2} (ped)`);
    } else {
      let rot = player.vehicle.rotation;
      console.log(`[${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)}, ${rot.x}, ${rot.y}, ${rot.z}] // ${param2} (vehicle)`);
    }
  } else {
    if(!player.vehicle) {
      console.log(`{ "x": ${pos.x.toFixed(3)}, "y": ${pos.y.toFixed(3)}, "z": ${pos.z.toFixed(3)}, "heading": ${player.heading} } // ${param2} (ped) `);
    } else {
      let rot = player.vehicle.rotation;
      console.log(`{ "x": ${pos.x.toFixed(3)}, "y": ${pos.y.toFixed(3)}, "z": ${pos.z.toFixed(3)}, "rotx": ${rot.x}, "roty": ${rot.y}, "rotz": ${rot.z} } // ${param2} (vehicle)`);
    }
  }
});

mp.events.addCommand("rac", (player, fullText) => {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  player.pushChatToAll(`[Staff] ${player.name} will respawn vehicles in 30 seconds.`, null, 'admin-message');
  setTimeout(() => {
    RespawnAllVehicles(); 
    mp.players.forEach((_player) => {
      if(_player.loggedIn != true) return;
      _player.notify('~c~Vehicles respawned.');
    });
  }, 30000);
});

mp.events.addCommand("gotoveh", (player, fullText, veh) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(veh == undefined) return player.pushExample(`/gotoveh [Vehicle id]`); 
  veh = mp.vehicles.at(parseInt(veh));
  if(!veh) return player.pushError(`The vehicle doesn't exist.`);
  player.notify(`You teleported to vehicle id ~r~${veh.id}`);
  if(!player.vehicle) {
    veh.position.z += 5.0;
    player.position = veh.position;
    player.dimension = veh.dimension;
  } else {
    veh.position.x += 2.0;
    player.vehicle.position = veh.position;
    player.vehicle.dimension = veh.dimension;
  }
});

function cmd_fixVehicle(player, fullText) {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  if(!player.vehicle) return player.pushError(`This command can be executed only inside a damaged vehicle.`); 
  player.vehicle.repair();
  player.notify('~g~You repaired the vehicle.');  
}
mp.events.addCommand("fixveh", cmd_fixVehicle);
mp.events.addCommand("fv", cmd_fixVehicle);

mp.events.addCommand("rtc", (player, fullText, ) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(!player.vehicle) return player.pushError("You must be inside a vehicle to use this command.");
  RespawnVehicle(player.vehicle);
  player.pushChat('The vehicle has been respawned.');
});

mp.events.addCommand("getveh", (player, fullText, veh) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(veh == undefined) return player.pushExample(`/getveh [Vehicle id]`); 
  veh = mp.vehicles.at(parseInt(veh));
  if(!veh) return player.pushError(`The vehicle doesn't exist.`);
  player.notify(`You teleported the vehicle id ~r~${veh.id}`);
  let pos = player.position, vehpos = player.position;
  vehpos.x += 2.5;
  veh.position = vehpos;
  player.position = pos;
  veh.dimension = player.dimension;
});

mp.events.addCommand("mark", (player) => {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  player.info.markPosition = player.position;
  player.notify('You ~r~marked ~w~this position!');
});

mp.events.addCommand("lipl", (player, fullText, ipl) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  mp.world.requestIpl(ipl);
  player.pushChat('World load ipl: ' + ipl);
});

mp.events.addCommand("ripl", (player, fullText, ipl) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  mp.world.removeIpl(ipl);
  player.pushChat('World removed ipl: ' + ipl);
});

mp.events.addCommand("gotomark", (player) => {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  if(!player.info.markPosition) return player.pushError(`You don't have a marked position.`);
  if(!player.vehicle) {
    player.position = player.info.markPosition;
  } else {
    player.vehicle.position = player.info.markPosition;
  }
  player.notify('Teleported to ~r~mark');
  player.dimension = 0;
  player.vars.bizzEntered = null;
  player.vars.houseEntered = null;
});

function cmd_Clearchat(player, fullText) {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  if(fullText == undefined) return player.pushExample(`/cc [Reason]`);
  mp.players.forEach((_player) => {
    if(!_player.loggedIn || _player.loggedIn == false) return;
    _player.call('clearChat');
  });
  player.pushChatToAll(`${player.name} cleared the chat. ( Reason: ${fullText} )`, null, 'admin-message');  
}

mp.events.addCommand("cc", cmd_Clearchat);
mp.events.addCommand("clearchat", cmd_Clearchat);

mp.events.addCommand("cmc", (player, fullText) => {
  if(!player.checkAdminRank(1)) return player.pushError(`You don't have permission to use this.`);
  player.call('clearChat');
  player.pushChat('You have cleared your chat.', null, 'server-message');
});

mp.events.addCommand("mute", (player, fullText, target, minutes, ...reason) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  reason = reason.join(" ");
  if(target == undefined || minutes == undefined || parseInt(minutes) < 1 || reason == undefined || reason.length < 3) return player.pushExample(`/mute [Target ID / Name] [minutes] [reason]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.info.muted != null) return player.pushError(`This player already is muted.`);
  target.info.muted = parseInt(minutes) * 1000 * 60;
  player.pushChatToAll(`${player.name} muted ${target.name} for ${minutes} ${minutes > 1 ? 'minutes' : 'minute' }. ( Reason: ${reason} )`, null, 'admin-message');
});

mp.events.addCommand("setdimension", (player, fullText, target, id) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || id == undefined) return player.pushExample(`/setdimension [Target ID / Name] [ID]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.sendMessageToAdmins(`[Staff] ${player.name} updated the dimension of ${target.name} to ${parseInt(id)} from ${target.dimension}.`, null, 'admin-message');
  target.dimension = parseInt(id);
});

mp.events.addCommand("unmute", (player, fullText, target) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/unmute [Target ID / Name]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.info.muted == null) return player.pushError(`This player is not muted.`);
  target.info.muted = null;
  player.sendMessageToAdmins(`[Staff] ${player.name} lifted the mute of ${target.name}.`, null, 'admin-message');
});

mp.events.addCommand("kick", (player, fullText, target, ...reason) => {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  reason = reason.join(" ");
  if(target == undefined || reason == undefined || reason.length < 3) return player.pushExample(`/kick [Target ID / Name] [reason]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.pushChatToAll(`${player.name} kicked ${target.name}. ( Reason: ${reason} )`, null, 'admin-message');
  target.kick(`Kicked by ${player.name} for ${reason}.`);
});

mp.events.addCommand("warn", (player, fullText, target, ...reason) => {
  if(!player.checkAdminRank(4)) return player.pushError(`You don't have permission to use this.`);
  reason = reason.join(" ");
  if(target == undefined || reason == undefined || reason.length < 3) return player.pushExample(`/warn [Target ID / Name] [reason]`); 
  target = getPlayerID(target);
  if(target == player) return player.pushError("You can't warn yourself.");
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.info.warns ++;
  let name = target.name;
  if(target.info.warns != 3) {
    player.pushChatToAll(`${player.name} warned ${target.name} (${target.info.warns}/3). ( Reason: ${reason} )`, null, 'admin-message');
  }
  else {
    player.pushChatToAll(`${player.name} warned and banned ${target.name} (${target.info.warns}/3). ( Reason: ${reason} )`, null, 'admin-message');
    target.info.warns = 0;
    target.kick(`~r~Banned by ${player.name}. (3/3 Warns)`);
      
    accounts.findOne({ username: name }, function (err, user) {
      if(err) return console.log(err);
  
      let banStatus = {
        status: true,
        reason: '3/3 Warns',
        bannedBy: player.name,
        timeLeft: 30 * 24,
        date: new Date()
      }
  
      user.set({ banStatus: banStatus });
  
      user.save(function (err, updatedUser) {
        if(err) return console.log(err);
      });
    });
  }
});


mp.events.addCommand("unwarn", (player, fullText, target) => {
  if(!player.checkAdminRank(4)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/unwarn [Target ID / Name]`); 
  target = getPlayerID(target);
  if(target == player) return player.pushError("You can't warn yourself.");
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.info.warns == 0) return player.pushError("This player does not have warns.");
  target.info.warns --;
  player.sendMessageToAdmins(`${player.name} has decreased the warning level of ${target.name} (${target.info.warns}/3)`, null, 'admin-message');
});


mp.events.addCommand("ban", (player, fullText, name, days, ...reason) => {
  if(!player.checkAdminRank(5)) return player.pushError(`You don't have permission to use this.`);
  reason = reason.join(" ");
  if(name == undefined || reason == undefined || days == undefined || reason.length < 3 || name == player.name || parseInt(days) < 1) return player.pushExample(`/ban [player name] [days] [reason]`); 
  if(name == player.name) return player.pushError("You can't ban yourself.");
  days = parseInt(days);
  let result = false;
  accounts.findOne({ username: name }, function (err, user) {
    if(err) return console.log(err);
    if(user != null) { result = true; }
  }).then(() => {
    if(result == false) return player.pushError(`This account name has not been found in our database.`);
    player.pushChatToAll(`${player.name} banned ${name} for ${days} days. ( Reason: ${reason} )`, null, 'admin-message');
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.name != name) return;
      _player.notify(`~r~Banned by: ~w~${player.name}~n~~r~Reason: ~w~${reason}~n~~r~Time: ~w~${days} days~n~`);
      _player.kick();
    });
  
    accounts.findOne({ username: name }, function (err, user) {
      if(err) return console.log(err);
  
      let banStatus = {
        status: true,
        reason: reason,
        bannedBy: player.name,
        timeLeft: days * 24,
        date: new Date()
      }
  
      user.set({ banStatus: banStatus });
  
      user.save(function (err, updatedUser) {
        if(err) return console.log(err);
      });
    });
  });
});

mp.events.addCommand("unban", (player, fullText, name, ...reason) => {
  if(!player.checkAdminRank(5)) return player.pushError(`You don't have permission to use this.`);
  reason = reason.join(" ");
  if(name == undefined || reason == undefined || reason.length < 3) return player.pushExample(`/unban [Target Name] [Reason]`); 
  let result = false;
  accounts.findOne({ username: name, 'banStatus.status' : true }, function (err, user) {
    if(err) return console.log(err);
    if(user != null) { result = true; }
  }).then(() => {
    if(result == false) return player.pushError(`This account name has not been found in our database as a banned one.`);
    accounts.findOne({ username: name, 'banStatus.status' : true }, function (err, user) {
      if(err) return console.log(err);
      user.set({ banStatus: null });
      user.save(function (err, updatedUser) {
        if(err) return console.log(err);
        player.sendMessageToAdmins(`[Staff] ${player.name} lifted the ban of ${name}. ( Reason: ${reason} ) `, null, 'admin-message');
      });
    });
  });
});

mp.events.addCommand("sethp", (player, fullText, target, value) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || value == undefined) return player.pushExample(`/sethealth [Target ID / Name] [Value]`); 
  target = getPlayerID(target), value = parseInt(value);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.health = value;
  player.notify(`~w~${target.name} ~r~health is now ~w~${value}`);
});

mp.events.addCommand("setarmour", (player, fullText, target, value) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || value == undefined) return player.pushExample(`/setarmour [Target ID / Name] [Value]`); 
  target = getPlayerID(target), value = parseInt(value);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.armour = value;
  player.notify(`~w~${target.name} ~r~armour is now ~w~${value}`);
});

mp.events.addCommand("slap", (player, fullText, target) => {
  if(!player.checkAdminRank(1)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/slap [Target ID / Name]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  let pos = target.position;
  pos.z += 2.5;
  target.position = pos;
  player.notify(`~r~You slapped ~w~${target.name}`);
  target.notify(`~w~${player.name} ~r~slapped you`);
});

mp.events.addCommand("setskin", (player, fullText, target, skinName) => {
  if(!player.checkAdminRank(2)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || skinName == undefined) return player.pushExample(`/setskin [Target ID / Name] [Skin name]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.model = mp.joaat(skinName);
  target.info.character.model = target.model;
  mp.events.call("loadClothes", target);
  player.sendMessageToAdmins(`[Staff] ${player.name} changed the skin of ${target.name} `, null, 'admin-message');
});

mp.events.addCommand("freeze", (player, fullText, target) => {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/freeze [Target ID / Name]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.call('freezePlayer', [true])
  player.sendMessageToAdmins(`[Staff] ${player.name} freeze ${target.name} `, null, 'admin-message');
});

mp.events.addCommand("unfreeze", (player, fullText, target) => {
  if(!player.checkAdminRank(3)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined) return player.pushExample(`/unfreeze [Target ID / Name]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.call('freezePlayer', [false])
  player.sendMessageToAdmins(`[Staff] ${player.name} unfreeze ${target.name} `, null, 'admin-message');
});

mp.events.addCommand("tod", (player, fullText, time) => {
  if(!player.checkAdminRank(4)) return player.pushError(`You don't have permission to use this.`);
  if(time == undefined || parseInt(time) > 24 || parseInt(time) < 0) return player.pushExample(`/tod [0-23 || 24 == disables it]`); 
  setTimeOfDay(parseInt(time));
  player.sendMessageToAdmins(`[Staff] ${player.name} changed the time of day to ${time}:00 `, null, 'admin-message');
});

mp.events.addCommand("setweather", (player, fullText, weather) => {
  if(!player.checkAdminRank(4)) return player.pushError(`You don't have permission to use this.`);
  if(weather == undefined || parseInt(weather) > 3 || parseInt(weather) < 0) return player.pushExample(`/setweather [0-3]`); 
  setWeather(parseInt(weather));
  player.sendMessageToAdmins(`[Staff] ${player.name} changed the weather to ${weather} `, null, 'admin-message');
});


mp.events.addCommand("aduty", (player, fullText) => {
  if(!player.checkAdminRank(1)) return player.pushError(`You don't have permission to use this.`);
  player.vars.adminDuty = !player.vars.adminDuty;
  player.pushChatToAll(`Administrator ${player.name} is now ${player.vars.adminDuty == true ? 'On-Duty. Use /report if you need support!' : 'Off-Duty.'}`, null, 'admin-message');
});

mp.events.addCommand("pm", (player, fullText, target, ...message) => {
  if(!player.checkAdminRank(1)) return player.pushError(`You don't have permission to use this.`);
  message = message.join(" ");
  if(target == undefined || message == undefined || message.length < 3) return player.pushExample(`/pm [Target ID / Name] [Message]`); 
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  target.pushChat(`(( PM from ${player.name} ( ID ${player.id} ): ${message} ))`, '#eccd2d');
  player.pushChat(`(( PM sent to ${target.name} ( ID ${target.id} ): ${message} ))`, '#eccd2d');
});

mp.events.addCommand("givetoall", (player, fullText, param1, param2) => {
  if(!player.checkAdminRank(6)) return player.pushError(`You don't have permission to use this.`);
  if(param1 == undefined) return player.pushExample(`/givetoall [Money/Respect/Level]`); 
  if(param1 == 'Money' || param1 == 'money') {
    if(param2 == undefined) return player.pushExample(`/givetoall [Money] [Value]`); 
    param2 = parseInt(param2);
    if(param2 > 1000000 || param2 < 1) return player.pushError("You must set a value between 0$ - 1.000.000$ when using this command.");
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      _player.giveMoney(param2);
    });
    player.pushChatToAll(`[Server announcement] ${player.name} gave everyone ${player.formatMoney(param2, 0)}$`, null, 'admin-message');
  }
  else if(param1 == 'Respect' || param1 == 'respect') {
    if(param2 == undefined) return player.pushExample(`/givetoall [Respect] [Value]`); 
    param2 = parseInt(param2);
    if(param2 > 10 || param2 < 1) return player.pushError("You must set a value between 1 - 10 when using this command.");
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      _player.info.respect += param2;
    });
    player.pushChatToAll(`[Server announcement] ${player.name} gave everyone ${param2} respect point(s).`, null, 'admin-message');
  }
  else if(param1 == 'Level' || param1 == 'level') {
    if(param2 == undefined) return player.pushExample(`/givetoall [Level] [Value]`); 
    param2 = parseInt(param2);
    if(param2 > 3 || param2 < 1) return player.pushError("You must set a value between 1 - 3 when using this command.");
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      _player.info.level += param2;
    });
    player.pushChatToAll(`[Server announcement] ${player.name} gave everyone ${param2} level(s).`, null, 'admin-message');
  }
});

mp.events.addCommand("agl", (player, fullText, param1, param2) => {
  if(!player.checkAdminRank(4)) return player.pushError(`You don't have permission to use this.`);
  if(param1 == undefined) return player.pushExample(`/agl [Driving/Weapon]`); 
  if(param1 == 'driving' || param1 == 'Driving') {
    if(param2 == undefined) return player.pushExample(`/agl [Driving] [Target ID / Name]`); 
    param2 = getPlayerID(param2);
    if(!param2 || param2.loggedIn == false) return player.pushError(`Invalid Player ID / Name.`);
    param2.giveItemToInventory(
      `Driving License`, // Title
      9, // Type
      false, // Stackable,
      1, // Quantity
      false, // Can be used
      false // Can be traded
    );
    player.pushChat(`${player.name} gave ${param2.name} a Driving License.`, null, 'server-message');
    param2.pushChat(`${player.name} gave ${param2.name} a Driving License.`, null, 'server-message');
  } else if(param1 == 'weapon' || param1 == 'Weapon') {
    if(param2 == undefined) return player.pushExample(`/agl [Weapon] [Target ID / Name]`); 
    param2 = getPlayerID(param2);
    if(!param2 || param2.loggedIn == false) return player.pushError(`Invalid Player ID / Name.`);
    param2.giveItemToInventory(
      `Weapon License`, // Title
      10, // Type
      false, // Stackable,
      1, // Quantity
      false, // Can be used
      false // Can be traded
    );    
    player.pushChat(`${player.name} gave ${param2.name} a Weapon License.`, null, 'server-message');
    param2.pushChat(`${player.name} gave ${param2.name} a Weapon License.`, null, 'server-message');
  }
});

let EventPosition = null;

mp.events.addCommand("gotoevent", (player, fullText) => {
  if(EventPosition != null) {
    player.position = EventPosition;
  }
});

mp.events.addCommand("aevent", (player, fullText, param1, ...param2) => {
  if(!player.checkAdminRank(6)) return player.pushError(`You don't have permission to use this.`);
  if(param1 == undefined) return player.pushExample(`/aevent [say, gg, rv, fv, (un)freeze, (un)mute, heal, disarm, (un)mark]`); 
  if(param1 === 'say') {
    if(param2 == undefined) return player.pushExample('/aevent say [message]'); 
    param2 = param2.join(" ");
    param2 = stripStuff(param2);
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      _player.pushChat(`[Admin Event] ${player.name} says: ${param2}`, null, 'admin-message');
    }); 
  }
  else if(param1 === 'mark') {
    EventPosition = player.position;
    player.sendMessageToAdmins(`[Staff] ${player.name} marked the event position. (/gotoevent)`, null, 'admin-message');
  }
  else if(param1 === 'unmark') {
    EventPosition = null;
    player.sendMessageToAdmins(`[Staff] ${player.name} deleted the event position.`, null, 'admin-message');
  }
  else if(param1 === 'gg') {
    if(param2 == undefined) return player.pushExample(`/aevent gg [Gun Name]`); 
    if(!player.weaponValid('weapon_' + param2)) return player.pushError(`The weapon name is not valid.`);
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      _player.giveWeapon(mp.joaat('weapon_' + param2), 100);
      _player.pushChat(`[Admin Event] ${player.name} gave everyone a weapon: ${param2}.`, null, 'admin-message');
    });
    player.sendMessageToAdmins(`[Staff] ${player.name} used admin event to give weapons to everyone around him.`, null, 'admin-message');
  }
  else if(param1 === 'heal') {
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      _player.health = 100;
      _player.pushChat(`[Admin Event] ${player.name} healed everyone.`, null, 'admin-message');
    });
    player.sendMessageToAdmins(`[Staff] ${player.name} used admin event to heal everyone around him.`, null, 'admin-message');
  }
  else if(param1 === 'disarm') {
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      _player.removeAllWeapons();
      _player.pushChat(`[Admin Event] ${player.name} disarmed everyone.`, null, 'admin-message');
    });
    player.sendMessageToAdmins(`[Staff] ${player.name} used admin event to heal everyone around him.`, null, 'admin-message');
  }
  else if(param1 === 'rv') {
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      if(!_player.vehicle) return;
      _player.vehicle.repair();
      _player.pushChat(`[Admin Event] ${player.name} repaired every vehicle.`, null, 'admin-message');
    });
    player.sendMessageToAdmins(`[Staff] ${player.name} used admin event to repair vehicles.`, null, 'admin-message');
  }
  else if(param1 === 'fv') {
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      if(!_player.vehicle) return;
      _player.vehicle.params.fuel = 100;
      _player.pushChat(`[Admin Event] ${player.name} filled up every vehicle.`, null, 'admin-message');
    });
    player.sendMessageToAdmins(`[Staff] ${player.name} used admin event to fill up vehicles.`, null, 'admin-message');
  }
  else if(param1 === 'freeze') {
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      _player.call('freezePlayer', [true]);
      _player.pushChat(`[Admin Event] ${player.name} freezed everyone.`, null, 'admin-message');
    });
    player.sendMessageToAdmins(`[Staff] ${player.name} used admin event to freeze everyone around him.`, null, 'admin-message');
  }
  else if(param1 === 'unfreeze') {
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      _player.call('freezePlayer', [false]);
      _player.pushChat(`[Admin Event] ${player.name} unfreezed everyone.`, null, 'admin-message');
    });
    player.sendMessageToAdmins(`[Staff] ${player.name} used admin event to unfreeze everyone around him.`, null, 'admin-message');
  }
  else if(param1 === 'mute') {
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      if(_player.info.admin > 0) return;
      _player.info.muted = parseInt(60) * 1000 * 60;
      _player.pushChat(`[Admin Event] ${player.name} muted everyone.`, null, 'admin-message');
    });
    player.sendMessageToAdmins(`[Staff] ${player.name} used admin event to mute everyone around him.`, null, 'admin-message');
  }
  else if(param1 === 'unmute') {
    let pos = player.position;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(!_player.IsInRange(pos.x, pos.y, pos.z, 20)) return;
      if(_player.info.admin > 0) return;
      _player.info.muted = null;
      _player.pushChat(`[Admin Event] ${player.name} unmuted everyone.`, null, 'admin-message');
    });
    player.sendMessageToAdmins(`[Staff] ${player.name} used admin event to unmute everyone around him.`, null, 'admin-message');
  }
});
