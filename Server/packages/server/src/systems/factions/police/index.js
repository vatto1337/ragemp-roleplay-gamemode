// sa pun script de scos din jail la /accept free

mp.events.add('registeredJoin', (player) => {
  player.info.wanted = 0;
  player.info.prisonTime = 0;
});

mp.events.add('loadVariables', (player) => {
  player.vars.uniformEquipped = false;
  player.vars.handcuffed = false;
});

mp.events.add('playerTimer', (player) => {
  player.setVariable('wantedLevel', player.info.wanted);
  player.setVariable('prisonTime', player.info.prisonTime);
  player.setVariable('faction', player.info.member);

  if(player.info.prisonTime > 0) {
    player.info.prisonTime --;
    if(player.info.prisonTime < 1) {
      player.info.prisonTime = 0;
      player.pushChat(`You have been released from jail.`, null, 'server-message');
      if(player.IsInRange(464.087, -1001.268, 24.915, 50)) {
        player.position = new mp.Vector3(464.087, -1001.268, 24.915);
      }
    }
  }
});

function cmd_megaphone(player, fullText) {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  if(fullText == undefined) return player.pushExample("/megaphone [Message]");
  let message = stripStuff(fullText);
  message = `(Megaphone) Officer ${player.name} shouts: ${message}!!`;
  player.pushLocalChat(message, '#ffff00', null, 30);
}

mp.events.addCommand("m", cmd_megaphone);
mp.events.addCommand("megaphone", cmd_megaphone);

function cmd_suspect(player, fullText, target, ...reason) {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  if(target == undefined || reason == undefined) return player.pushExample("/(su)spect [Player ID / Name] [Reason]");  
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.info.member == 0 || target.info.member == 1) return player.pushError("You can't suspect a member of our departments.");
  reason = reason.join(" ");
  if(target.info.wanted + 1 > 6) return player.pushError("The limti is wanted level 6 and this player already has wanted level " + target.info.wanted + ".");
  target.info.wanted ++;
  target.pushChat(`You've commited a crime. (${reason}) - Reporter: ${player.name}.`, null, 'faction-message');
  player.sendMessageToFaction(`HQ: All units APB: Reporter: ${player.name}`, null, 'faction-message');
  player.sendMessageToFaction(`HQ: Crime: ${reason}, Suspect: ${target.name} (${target.id}), Wanted Level: ${target.info.wanted}`, null, 'faction-message');
}

mp.events.addCommand("su", cmd_suspect); 
mp.events.addCommand("suspect", cmd_suspect); 

mp.events.addCommand("mdc", (player, fullText, target) => {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  let checked = 0;
  if(player.vehicle && player.vehicle.params.type == 'Faction Vehicle' && player.vehicle.params.FactionID == 0) { checked = 1; }
  else if(player.IsInRange(448.535, -984.995, 30.690, 50)) { checked = 1; }
  if(checked == 0) return player.pushError("This command must be used only near police station or inside a police vehicle.");
  if(target == undefined) return player.pushExample("/mdc [Player ID / Name]");  
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  let drivingLicense = target.hasItemInInventory('Driving License') ? 'Licensed' : 'Not licensed';
  let weaponLicense = target.hasItemInInventory('Weapon License') ? 'Licensed' : 'Not licensed';
  player.pushChat('[Mobile Data Computer - Results]', null, 'faction-message');
  player.pushChat(`- Name: ${target.name} (${target.id})`, null, 'faction-message');
  player.pushChat(`- Crimes: ${target.info.crimes}`, null, 'faction-message')
  player.pushChat(`- Current Wanted: ${target.info.wanted}`, null, 'faction-message')
  player.pushChat(`- Driving License: ${drivingLicense}`, null, 'faction-message');
  player.pushChat(`- Weapon License: ${weaponLicense}`, null, 'faction-message');
});

mp.events.add("playerDeath", (player, reason, killer) => {
  if (player.loggedIn == true) {
    if(killer) {
      if(killer.info.member == 0 && player.info.wanted != 0) {
        player.info.prisonTime = player.info.wanted * 250;
        let cash = 50 + Math.floor(Math.random() * 100) * player.info.wanted + (100 * killer.info.rank);
        killer.notify(`~g~${formatMoney(cash, 0)}$~r~ reward for arresting suspect ${player.name}.`);
        killer.pushChatToAll(`Officer ${kiler.name} has shot & arrested suspect ${player.name}, issuing a fine of ${formatMoney(cash, 0)}$ with a sentence of ${(player.info.prisonTime / 60).toFixed(0)} minutes.`, '#f07a7a', null);
        player.takeMoney(cash);
        killer.giveMoney(cash);
        player.info.wanted = 0;
        player.respawnMyself();
        player.vars.hospitalized = false;
      }
      if(player.info.prisonTime > 0 && killer.info.prisonTime > 0) {
        killer.info.prisonTime += 60;
      }
    }
  }
});

mp.events.addCommand("surrender", (player, fullText) => {
  if(!player.IsInRange(440.778, -981.154, 30.690, 5)) return player.pushError("You're not at the police department.");
  if(player.info.wanted == 0) return player.pushError("You have not commited any crimes.");
  player.info.prisonTime = 250 / 2 * player.info.wanted;
  player.pushChat(`You have been jailed for ${(player.info.prisonTime / 60).toFixed(0)} minutes.`, '#f07a7a', null);
  player.respawnMyself();
});

mp.events.addCommand("clear", (player, fullText, target) => {
  if(!player.IsInRange(452.094, -973.701, 30.690, 5)) return player.pushError("You're not at the police department.");
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  if(player.info.rank < 4) return player.pushError("You must be rank 4 at least to use this command.");
  if(target == undefined) return player.pushExample("/clear [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.info.wanted == 0) return player.pushError("This player is not wanted.");
  target.info.wanted = 0;
  player.sendMessageToFaction(`HQ: All charges on ${target.name} has been dropped.`, null, 'faction-message');
});

mp.events.addCommand("drag", (player, fullText, target) => {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  if(target == undefined) return player.pushExample("/drag [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(player.dist(target.position) > 10) return player.pushError("This player is too far away from you.");
  if(!player.vehicle) return player.pushError("You must be inside a vehicle to use this command.");
  if(player == target) return player.pushError("You can't use this command on yourself.");
  if(target.vars.handcuffed == false) return player.pushError("This player is not cuffed.");
  player.pushLocalChat(`* ${player.name} drags ${target.name} into his vehicle.`, null, 'action-message');
  target.putIntoVehicle(player.vehicle, 0);
});

mp.events.addCommand("cuff", (player, fullText, target) => {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  if(target == undefined) return player.pushExample("/cuff [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(player.dist(target.position) > 5) return player.pushError("This player is too far away from you.");
  target.call("handcuff");
  player.pushLocalChat(`* ${player.name} puts ${target.name}'s hands behind his back and cuffs him.`, null, 'action-message');
  target.vars.handcuffed = true;
  target.playAnimation("mp_arresting", "idle", 1, 49);
  if(target.info.character.gender == 0) {
    target.setClothes(7, 41, 0,0);     
  } else {
    target.setClothes(7, 25, 0,0);     
  }
});

mp.events.addCommand("uncuff", (player, fullText, target) => {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  if(target == undefined) return player.pushExample("/cuff [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(player.dist(target.position) > 5) return player.pushError("This player is too far away from you.");
  target.call("unhandcuff");
  player.pushLocalChat(`* ${player.name} uncuffs ${target.name}.`, null, 'action-message');
  target.vars.handcuffed = false;
  let isInVehicle = target.vehicle ? { seat: target.seat, veh: target.vehicle } : false;
  target.stopAnimation();
  if(isInVehicle != false) {
    target.putIntoVehicle(isInVehicle.veh, isInVehicle.seat);
  }
  target.setClothes(7, 0, 0,0);
});

mp.events.addCommand("frisk", (player, fullText, target) => {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  if(target == undefined) return player.pushExample("/frisk [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(player.dist(target.position) > 5) return player.pushError("This player is too far away from you.");
  player.pushChat(`[${target.name}'s Inventory]`, null, 'faction-message');
  let drivingLicense = target.hasItemInInventory('Driving License') ? 'Owned' : 'Not owned';
  let weaponLicense = target.hasItemInInventory('Weapon License') ? 'Owned' : 'Not owned';
  player.pushChat(`- Driving license: ${drivingLicense}.`, null, 'faction-message');
  player.pushChat(`- Weapon license: ${weaponLicense}.`, null, 'faction-message');
  target.info.inventory.forEach((item, index) => {
    if(item.type != 11) return;
    player.pushChat(`- ${item.title}: (x${item.quantity}) `, null, 'faction-message');
  });
});

mp.events.addCommand("ticket", (player, fullText, target, money, ...reason) => {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  if(target == undefined || money == undefined || reason == undefined) return player.pushExample("/ticket [Player ID / Name] [Value] [Reason]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(player.dist(target.position) > 5) return player.pushError("This player is too far away from you.");
  money = parseInt(money);
  reason = reason.join(" ");
  player.vars.invitations.ticket.to = target;
  player.vars.invitations.ticket.money = money;
  player.pushChat(`${player.name} has issued a fine of ${formatMoney(money, 0)}$ for ${reason} to ${target.name}.`, null, 'faction-message');
  target.pushChat(`${player.name} has issued a fine of ${formatMoney(money, 0)}$ for ${reason} to ${target.name}. (/accept ticket ${player.id})`, null, 'faction-message');
});

mp.events.addCommand("confiscate", (player, fullText, target, item) => {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  if(target == undefined || item == undefined) return player.pushExample("/confiscate [Player ID / Name] [Item Number]"), player.pushInfo("Available numbers: (1) Driving License, (2) Weapon License, (3) Weapons");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(player.dist(target.position) > 5) return player.pushError("This player is too far away from you.");
  if(target.vars.handcuffed == false) return player.pushError("You must first cuff the player before confiscating his items.");
  if(target.info.member == 0) return player.pushError("You can't confiscate a member of our departments.");
  item = parseInt(item);
  if(!item || item > 3 || item < 1) return player.pushError("Invalid item number.");
  if(item == 1) {
    if(!target.hasItemInInventory('Driving License')) return player.pushError("This player does not own a driving license.");
    target.removeItemByName("Driving License");
    player.pushChat(`${player.name} has confiscated ${target.name}'s driving license.`, null, 'faction-message');
    target.pushChat(`${player.name} has confiscated ${target.name}'s driving license.`, null, 'faction-message');
  }
  if(item == 2) {
    if(!target.hasItemInInventory('Weapon License')) return player.pushError("This player does not own a weapon license.");
    target.removeItemByName("Weapon License");
    player.pushChat(`${player.name} has confiscated ${target.name}'s weapon license.`, null, 'faction-message');
    target.pushChat(`${player.name} has confiscated ${target.name}'s weapon license.`, null, 'faction-message');
  }
  if(item == 3) {
    target.removeAllWeapons();
    target.info.inventory.forEach((item, index) => {
      if(item.type != 11) return;
      target.info.inventory.splice(index, 1);
    });
    player.pushChat(`${player.name} has confiscated ${target.name}'s weapons.`, null, 'faction-message');
    target.pushChat(`${player.name} has confiscated ${target.name}'s weapons.`, null, 'faction-message');
  }
});

mp.events.addCommand("equip", (player, fullText, ...params) => {
  mp.events.call("equipCommand", player, params);
});

mp.events.add("equipCommand", (player, params) => {
  if(player.IsInRange(450.511, -991.989, 30.690, 5)) {
    if(player.info.member != 0) return player.pushError("You're not part of the police department.");
    player.vars.uniformEquipped = !player.vars.uniformEquipped;
    mp.events.call('loadClothes', player);
    player.notify("Type /equip again to (un)equip the uniform.");
  }
  if(player.IsInRange(451.961, -980.174, 30.690, 5)) {
    if(player.info.member != 0) return player.pushError("You're not part of the police department.");
    if(player.vars.uniformEquipped == false) return player.pushError("You must wear your uniform to equip new weapons.");
    let weapon = parseInt(params[0]);
    if(params == undefined || !weapon) return player.pushExample("/equip [Item Number]"), player.pushInfo("Available items: (1) Nightstick, (2) Pistol, (3) SMG, (4) Shotgun, (5) Assault Rifle, (6) Tear Gas, (7) Grenade, (8) Tazer, (9) Flashlight");
    if(weapon < 1 || weapon > 9) return player.pushError("Invalid item id.");
    switch(weapon) {
      case 1: player.giveWeapon(mp.joaat("weapon_nightstick"), 1); break;
      case 2: player.giveWeapon(mp.joaat("weapon_pistol_mk2"), 100); break;
      case 3: player.giveWeapon(mp.joaat("weapon_assaultsmg"), 100); break;
      case 4: player.giveWeapon(mp.joaat("weapon_pumpshotgun_mk2"), 100); break;
      case 5: player.giveWeapon(mp.joaat("weapon_assaultrifle_mk2"), 100); break;
      case 6: player.giveWeapon(mp.joaat("weapon_smokegrenade"), 100); break;
      case 7: player.giveWeapon(mp.joaat("weapon_grenade"), 10); break;
      case 8: player.giveWeapon(mp.joaat("weapon_stungun"), 100); break;
      case 9: player.giveWeapon(mp.joaat("weapon_flashlight"), 100); break;
    }
    player.pushChat('Item ' + weapon + ' has been equiped.', null, 'faction-message');
  }
});

// mp.events.addCommand("showbadge", )
//sa fac numele din nametag colorat pt politisti

mp.events.addCommand("arrest", (player, fullText, target) => {
  if(player.info.member != 0) return player.pushError("You're not part of the police department.");
  let checked = 0;
  if(player.vehicle && player.vehicle.params.type == 'Faction Vehicle' && player.vehicle.params.FactionID == 0) { checked = 1; }
  else if(player.IsInRange(448.535, -984.995, 30.690, 50)) { checked = 1; }
  if(checked == 0) return player.pushError("This command must be used only near police station or inside a police vehicle.");
  if(target == undefined) return player.pushExample("/arrest [Player ID / Name]");  
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(!player.IsInRange(448.535, -984.995, 30.690, 50)) return player.pushError("You must be near the police department to use this command.");
  if(target.info.wanted == 0) return player.pushError("This player is not wanted for any crime.");
  if(player.dist(target.position) > 30) return player.pushError("This player is too far away from you.");
  if(target.info.prisonTime != 0) return player.pushError("This player is already jailed.");
  if(target.info.member == 0 || target.info.member == 1) return player.pushError("You can't arrest a member of our departments.");
  target.info.prisonTime = target.info.wanted * 250;
  let cash = 50 + Math.floor(Math.random() * 100) * target.info.wanted + (100 * player.info.rank);
  player.pushChatToAll(`Officer ${player.name} has arrested suspect ${target.name}, issuing a fine of ${formatMoney(cash, 0)}$ with a sentence of ${(target.info.prisonTime / 60).toFixed(0)} minutes.`, '#f07a7a', null);
  player.notify(`~g~${formatMoney(cash, 0)}$~r~ reward for arresting suspect ${target.name}.`);
  player.giveMoney(cash);
  target.takeMoney(cash);
  target.info.wanted = 0;
  target.respawnMyself();
});

mp.events.addCommand("wanted", (player, fullText) => {
  if(player.info.member == null) return player.pushError("You must be part of a faction to use this command.");
  player.pushChat("[Wanted list]", null, 'faction-message');
  let count = 0;
  mp.players.forEach((target, index) => {
    if(player.info.wanted == 0) return;
    count ++;
    player.pushChat(`- ${target.name} (${target.id}) - Wanted ${target.info.wanted}`, null, 'faction-message');
  });
  if(count == 0) return player.pushChat("- There are no suspects online.", null, 'faction-message');
});

mp.events.add('heal_command', (player) => {
  if(player.info.member == 0 && player.IsInRange(436.196, -986.676, 30.690, 5)) {
    player.health = 100;
    player.armour = 100;
    player.notify("~g~You've equipped armour and got some pills to feel better.");
  }
});