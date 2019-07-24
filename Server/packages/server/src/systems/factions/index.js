const accounts = require("../account/schema/accounts.js");

global.Factions = [];
global.FactionVehicles = [];
global.FactionBlips = [];
global.FactionTurfs = [];
global.FactionPickups = [];

global.loadFactions = function() {
  let factions = databox[4].data.factions;
  factions.forEach((faction, findex) => {
    Factions.push(faction);
    let objBlip = {
      FactionID: findex,
      FactionType: faction.type,
      entity: null,
      index: findex
    }
    FactionBlips.push(objBlip);
    let indexblip = FactionBlips.indexOf(objBlip);
    FactionBlips[indexblip].entity = mp.blips.new(faction.blip, new mp.Vector3(faction.blipPosition[0], faction.blipPosition[1], faction.blipPosition[2]),{ name: faction.title,  color: faction.blipColor, shortRange: true,  dimension: 0});
    faction.pickups.forEach((pickup, pindex) => {
      let pickupObject = {
        FactionID: findex,
        FactionType: faction.type,
        pickup: null,
        marker: null,
        index: pindex
      }
      FactionPickups.push(pickupObject);
      let pickupID = FactionPickups.indexOf(pickupObject);
      FactionPickups[pickupID].pickup = mp.labels.new('~y~' + faction.title + '~n~~w~'  + pickup.text, new mp.Vector3(pickup.pos[0], pickup.pos[1], pickup.pos[2]),
      {
          los: false,
          font: 4,
          drawDistance: 10,
          los: true,
          dimension: pickup.dimension
      });
      if(pickup.hasMarker == true) {
        FactionPickups[pickupID].marker = mp.markers.new(1, new mp.Vector3(pickup.pos[0], pickup.pos[1], pickup.pos[2] - 1.4), 1,
        {
            color: [246,205,97, 200],
            dimension: pickup.dimension
        });
      }

    });
    faction.vehicles.forEach((vehicle, vindex) => {
      let obj = {
        FactionID: findex,
        FactionType: faction.type,
        entity: null,
        index: vindex
      }
      FactionVehicles.push(obj);
      let vIndex = FactionVehicles.indexOf(obj);
      FactionVehicles[vIndex].entity = mp.vehicles.new(mp.joaat(vehicle[0]), new mp.Vector3(vehicle[1], vehicle[2],vehicle[3]), {
        dimension: 0,
        locked: false
      });
      FactionVehicles[vIndex].entity.setColor(faction.vehiclesColors[0], faction.vehiclesColors[1]);
      FactionVehicles[vIndex].entity.rotation = new mp.Vector3(vehicle[4], vehicle[5], vehicle[6]);
      FactionVehicles[vIndex].entity.params = {
        fuel: 100,
        owner: 'State of San Andreas',
        engine: false,
        type: 'Faction Vehicle',
        FactionID: findex,
        FactionTitle: faction.title,
        FactionType: faction.type
      }
      let pos = FactionVehicles[vIndex].entity.position;
      let roty = FactionVehicles[vIndex].entity.rotation;
      FactionVehicles[vIndex].entity.params.spawn = { x: pos.x, y: pos.y, z: pos.z, rot: { x: roty.x, y: roty.y, z: roty.z } }
      FactionVehicles[vIndex].entity.numberPlate = 'Faction';
    });
  });
}

global.destroyFactions = function() {
  FactionVehicles.forEach((elm, index) => {
    elm.entity.destroy();
  });
  FactionBlips.forEach((elm, index) => {
    elm.entity.destroy();
  });
  FactionPickups.forEach((elm, index) => {
    elm.pickup.destroy();
    if(elm.hasMarker == true) {
      elm.marker.destroy();
    }
  });
  Factions = [];
  FactionBlips = [];
  FactionVehicles = [];
  FactionTurfs = [];
  FactionPickups = [];
}

mp.events.add('loadVariables', (player) => {
  player.vars.factionEntered = null;
  player.vars.factionDuty = false;
});

mp.events.add('registeredJoin', (player) => {
  player.info.member = null;
  player.info.leader = null;
  player.info.rank = null;
  player.info.fpunish = 0;
  player.info.fwarns = 0;
  player.info.fJoined = null;
});

mp.events.addCommand("missedservices", (player) => {
  if(player.info.member == null) return player.pushError("You're not part of a faction.");
  mp.events.call("missedServices", player);
});

mp.events.addCommand("service", (player, fullText, name) => {
  if(name == undefined) return player.pushExample("/service [Name]"), player.pushInfo("Available services: Medic");
  mp.events.call("cmd_service", player, name);
});

mp.events.addCommand("factions", (player, fullText) => {
  player.call('toggleModal', [19, 'chat', JSON.stringify({ 
    factions: Factions.map(faction => faction.title), 
    leaders: Factions.map(faction => faction.leader),
    questions: Factions.map(faction => faction.questions),
    recruiting: Factions.map(faction => faction.recruiting),
    info: player.info,
    author: player.name
  })]);
});

mp.events.addCommand("d", (player, fullText) => {
  if(player.info.member == null) return player.pushError("You need to be part of a faction to use this command.");
  if(fullText == undefined) return player.pushExample("/d [Message]");
  if(player.info.member == 0 || player.info.member == 1) {
    let message = stripStuff(fullText);
    let rankText = '';
    if(player.info.leader != null) { rankText = 'Leader of '  + Factions[player.info.leader].title }
    else { rankText = `${player.info.member == 0 ? 'Officer' : 'Medic' } Rank ${player.info.rank}`;}
    message = `** ${rankText} ${player.name} says: ${message}`;
    mp.players.forEach((target, index) => {
      if(!target.loggedIn || target.loggedIn != true) return;
      if(target.info.member == null || target.info.member > 1) return;
      target.pushChat(message, '#f07a7a', null);
    });
  } else return player.pushError("Your faction can't use this command.");
});

mp.events.addCommand("f", (player, fullText) => {
  if(player.info.member == null) return player.pushError("You need to be part of a faction to use this command.");
  if(player.info.member < 2) return player.pushError("Your faction can't use this command.");
  if(fullText == undefined) return player.pushExample("/f [Message]");
  let message = stripStuff(fullText);
  let rankText = '';
  if(player.info.leader != null) { rankText = 'Leader' }
  else { rankText = `Rank ${player.info.rank}` }
  message = `** ${rankText} ${player.name} says: ${message}`;
  player.sendMessageToFaction(message, null, 'faction-message');
});

mp.events.addCommand("lc", (player, fullText) => {
  if(fullText == undefined) return player.pushExample("/lc [Message]");
  if(player.info.leader == null) return player.pushError("You need to be a faction leader to use this command.");
  let message = stripStuff(fullText);
  message = `Leader ${Factions[player.info.leader].title} ${player.name} says: ${message}`;
  mp.players.forEach((target, index) => {
    if(!target.loggedIn || target.loggedIn == false || target.info.justRegistered == true) return;
    if(target.info.leader != null) {
      target.pushChat(message, null, 'faction-message');
    }
  });
});

mp.events.addCommand("fvr", (player) => {
  let checked = 0, factionID = null;
  if(player.info.leader != null) { checked = 1, factionID = player.info.leader; }
  if(player.info.member != null && player.info.rank >= 5) { checked = 1, factionID = player.info.member; }
  if(checked == 1) {
    FactionVehicles.forEach((item, index) => {
      if(item.FactionID != factionID) return;
      if(IsVehicleUsed(item.entity)) return;
      let vehicle = item.entity;
      let pos = vehicle.params.spawn;
      vehicle.position = new mp.Vector3(pos.x, pos.y, pos.z);
      vehicle.rotation = new mp.Vector3(pos.rot.x, pos.rot.y, pos.rot.z);
      vehicle.params.fuel = 100;
      vehicle.repair();
    });
    player.sendMessageToFaction(`${player.name} has respawned all unused faction vehicles.`, null, 'faction-message');
  }
  else return player.pushError("You need to be a faction leader or rank 5 at least to use this command.");
});

mp.events.addCommand("makeleader", (player, fullText, target, rank) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || rank == undefined) return player.pushExample(`/makeleader [Target ID / Name] [Faction | None]`); 
  target = getPlayerID(target), rank = rank == 'None' ? null : parseInt(rank);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(rank != null && Factions[rank] == undefined) return player.pushError("This faction is not valid.");
  if(rank != null) {
    player.sendMessageToAdmins(`[Staff] ${player.name} has placed ${target.name} as leader of faction ${Factions[rank].title}.`, null, 'admin-message');
    target.info.leader = rank;
    target.info.member = rank;
    target.info.rank = 7;
    target.info.spawn = 2;
    target.info.fJoined = new Date();
    Factions[target.info.leader].leader = target.name;
    databox[4].data.factions[target.info.leader] = Factions[target.info.leader];
  }
  else {
    player.sendMessageToAdmins(`[Staff] ${player.name} has removed ${target.name}'s leader rank.`, null, 'admin-message');
    Factions[target.info.leader].leader = 'No-One';
    databox[4].data.factions[target.info.leader] = Factions[target.info.leader];
    target.info.leader = null;
    target.info.member = rank;
    target.info.spawn = 0;
  }
  target.respawnMyself();
  target.savePlayerInfo();
  SaveData(4);
});

mp.events.addCommand("setrank", (player, fullText, target, rank) => {
  if(player.info.leader == null) return player.pushError("You need to be a faction leader to use this command.");
  if(target == undefined || rank == undefined) return player.pushExample(`/setrank [Target ID / Name] [Rank]`); 
  target = getPlayerID(target), rank = parseInt(rank);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target == player) return player.pushError("You can't use this command on yourself.");
  if(rank < 0 || rank > 6) return player.pushError("Choose a rank between 0-6 for this player.")
  player.sendMessageToFaction(`${player.name} has promoted ${target.name} to rank ${rank}.`, null, 'faction-message');
  target.info.rank = rank;
  target.savePlayerInfo();
});

mp.events.addCommand("invite", (player, fullText, target) => {
  if(player.info.leader == null) return player.pushError("You need to be a faction leader to use this command.");
  if(target == undefined ) return player.pushExample("/invite [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target == player) return player.pushError("You can't use this command on yourself.");
  let dist = player.dist(target.position);
  if(dist > 10) return player.pushError("Player is too far away.");
  if(target.info.leader != null || target.info.member != null) return player.pushError("This player already is in a faction.");
  if(target.info.fpunish != 0) return player.pushError("This player has faction punish for another " + target.info.fpunish + " hours.");
  player.vars.invitations.faction = target;
  player.pushChat(`You have invited ${target.name} to join ${Factions[player.info.leader].title}.`, null,'faction-message');
  target.pushChat(`${player.name} invited you to join faction ${Factions[player.info.leader].title}. (/accept invite ${player.id})`, null,'faction-message');
});

mp.events.addCommand("fmotd", (player, fullText) => {
  if(player.info.leader == null) return player.pushError("You need to be a faction leader to use this command.");
  if(fullText == undefined) return player.pushExample("/fmotd [Motd | None]");
  if(fullText == 'None' || fullText == 'none') {
    databox[4].data.factions[player.info.leader].motd = null;
    player.pushChat('The faction motd has been removed.', null, 'faction-message')
  }
  else {
    let message = stripStuff(fullText);
    player.pushChat(`The new faction motd is : '${message}'.`, null, 'faction-message');
    player.pushChat('This message will be shown to every faction member when they log in.', null, 'faction-message');
    databox[4].data.factions[player.info.leader].motd = message;    
  }
  SaveData(4);
});

mp.events.addCommand("uninvite", (player, fullText, target, fpunish, ...reason) => {
  if(player.info.leader == null) return player.pushError("You need to be a faction leader to use this command.");
  if(target == undefined || fpunish == undefined || reason == undefined) return player.pushExample("/uninvite [Player ID / Name] [fPunish] [Reason]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target == player) return player.pushError("You can't use this command on yourself.");
  if(target.info.member != player.info.leader) return player.pushError("This player is not part of your faction.");
  fpunish = parseInt(fpunish);
  reason = reason.join(" ");
  player.sendMessageToFaction(`${player.name} has kicked ${target.name} out of this faction (${fpunish} FP - Reason: ${reason}).`, null, 'faction-message');
  target.info.member = null;
  target.info.leader = null;
  target.info.rank = null;
  target.info.fpunish = fpunish;
  target.info.spawn = 0;
  target.respawnMyself();
});

mp.events.addCommand("fwarn", (player, fullText, target, ...reason) => {
  if(player.info.leader == null) return player.pushError("You need to be a faction leader to use this command.");
  reason = reason.join(" ");
  if(target == undefined || reason == undefined || reason.length < 3) return player.pushExample(`/fwarn [Target ID / Name] [reason]`); 
  target = getPlayerID(target);
  if(target == player) return player.pushError("You can't give a warn to yourself.");
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.info.member != player.info.leader) return player.pushError("This player is not a member of your faction.");
  target.info.fwarns ++;
  if(target.info.fwarns == 3) {
    player.sendMessageToFaction(`${player.name} has removed ${target.name} from this faction due to reaching the limit of faction warns.`, null, 'faction-message');
    target.info.member = null;
    target.info.leader = null;
    target.info.rank = null;
    target.respawnMyself();
    target.info.fwarns = 0;
    target.info.fpunish = 60;
    target.info.spawn = 0;
  } else {
    player.sendMessageToFaction(`${player.name} has gave ${target.name} a faction warn (${target.info.fwarns}/3) for ${reason}.`, null, 'faction-message');
  }
});

mp.events.addCommand("duty", (player) => {
  mp.events.call("faction_duty", player);
});

mp.events.addCommand("members", (player, fullText) => {
  if(player.info.member == null) return player.pushError("You must be part of a faction to use this command.");
  player.pushChat("[Faction Members - Online]", null, 'faction-message');
  mp.players.forEach((target, index) => {
    if(player.info.member != target.info.member) return;
    player.pushChat(`* ${target.name} - ${target.info.leader == null ? 'Rank ' + target.info.rank : 'Leader' }`, null, 'faction-message');
  });
});

mp.events.addCommand("unfwarn", (player, fullText, target) => {
  if(player.info.leader == null) return player.pushError("Only a leader can use this command.");
  if(target == undefined) return player.pushExample(`/unwarn [Target ID / Name]`); 
  target = getPlayerID(target);
  if(target == player) return player.pushError("You can't use this command on yourself.");
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.info.member != player.info.leader) return player.pushError("This player is not part of your faction.");
  if(target.info.fwarns == 0) return player.pushError("This player does not have faction warns.");
  target.info.fwarns --;
  player.sendMessageToFaction(`${player.name} has decreased the warning level of ${target.name} (${target.info.fwarns}/3)`, null, 'admin-message');
});

mp.events.add("playerEnterVehicle", (player, vehicle, seat) => { 
  if(vehicle.params && vehicle.params.type == 'Faction Vehicle') {
    if(seat == -1) {
      let checked = 0;
      if(player.info.leader == vehicle.params.FactionID || player.info.member == vehicle.params.FactionID) { checked = 1; }
      if(checked == 0) {
        player.stopAnimation();
        player.notify("You can't drive a faction vehicle.~n~Property of" + vehicle.params.factionName + ".");
      }
    }
  }
});

mp.events.add('commandEnterEvent', cmd_EnterFaction);
mp.events.add('commandExitEvent', cmd_LeaveFaction);

function cmd_EnterFaction (player, fullText) {
  let result = false;
  Factions.forEach((f, index) => {
    if(f.hasEntrance == false) return;
    if(result == true) return;
    if(player.IsInRange(f.entrancePos.x, f.entrancePos.y, f.entrancePos.z, 3)) {
      let checked = 0;
      if(player.info.member == index || player.info.leader == index) { checked = 1; }
      if(player.info.member == 0) {
        mp.players.forEach((target, index) => {
          if(target.vars && target.vars.factionEntered == index) {
            if(target.info.wanted != 0) {
              checked = 1;
            }
          }
        });
      }
      if(checked == 1) {
        player.vars.factionEntered = index;
        player.dimension = f.dimension;
        player.position = new mp.Vector3(f.exitPos.x, f.exitPos.y, f.exitPos.z);
        result = true; 
      }
    }
  });
}

function cmd_LeaveFaction (player, fullText) {
  let result = false;
  Factions.forEach((f, index) => {
    if(f.hasEntrance == false) return;
    if(result == true) return;
    if(player.IsInRange(f.exitPos.x, f.exitPos.y, f.exitPos.z, 3) && player.vars.factionEntered == index) {
      player.vars.factionEntered = null;
      player.dimension = 0;
      player.position = new mp.Vector3(f.entrancePos.x, f.entrancePos.y, f.entrancePos.z);
      result = true;
    }
  });
}

mp.events.add('lockVehicle', (player) => {
  if(player.info.member != null) {
    mp.vehicles.forEach((vehicle, index) => {
      if(vehicle.params && vehicle.params.type != 'Faction Vehicle') return;
      if(vehicle.params.FactionID != player.info.member) return;
      if(!player.IsInRange(vehicle.position.x, vehicle.position.y, vehicle.position.z, 5)) return;
      vehicle.locked = !vehicle.locked;
      player.notify('~w~Vehicle is now ' + (vehicle.locked == true ? '~r~locked.' : '~g~unlocked.')); 
    });    
  }
});