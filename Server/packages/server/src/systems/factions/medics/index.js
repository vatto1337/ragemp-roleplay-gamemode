mp.events.add('heal_command', (player) => {
  if(player.info.member == 1 && player.IsInRange(269.831, -1354.650, 24.538, 5)) {
    player.health = 100;
    player.armour = 100;
    player.notify("~g~You've equipped armour and got some pills to feel better.");
  }
  if(player.info.member == 1 && player.IsInRange(294.473, -1448.138, 29.967, 5)) {
    if(player.health == 100) return player.pushError("You don't need medical attention.");
    if(player.getMoney() < 150) return player.pushError("You don't have enough money.");
    let count = 0;
    mp.players.forEach((target, ix) => {
      if(!target.loggedIn || target.loggedIn == false || target.info.justRegistered == true) return;
      if(target.info.member != 1) return;
      if(target.vars.factionDuty == false) return;
      count ++;
    });
    if(count != 0) return player.pushError("All paramedics are on-duty. Please use /service medic to ask for help.", null, 'faction-message'); 
    player.takeMoney(150);
    player.health = 100;
    player.pushChat("Our doctors have given you some pills and now you feel better. The bill cost 150$", null, 'server-message');
  }
});

mp.events.add("equipCommand", (player, params) => {
  if(player.IsInRange(249.403, -1358.867, 24.538, 5)) {
    if(player.info.member != 1) return player.pushError("You're not part of the medic department.");
    player.vars.uniformEquipped = !player.vars.uniformEquipped;
    mp.events.call('loadClothes', player);
    player.notify("Type /equip again to (un)equip the uniform.");
  }
  // if(player.IsInRange(259.089, -1337.685, 24.538, 5)) {
  //   if(player.info.member != 1) return player.pushError("You're not part of the medic department.");
  //   if(player.vars.uniformEquipped == false) return player.pushError("You must wear your uniform to equip new weapons.");
  //   let weapon = parseInt(params[0]);
  //   if(params == undefined || !weapon) return player.pushExample("/equip [Item Number]"), player.pushInfo("Available items: (1) Tazer, (2) Flashlight");
  //   if(weapon < 1 || weapon > 9) return player.pushError("Invalid item id.");
  //   switch(weapon) {
  //     case 1: player.giveWeapon(mp.joaat("weapon_stungun"), 100); break;
  //     case 2: player.giveWeapon(mp.joaat("weapon_flashlight"), 100); break;
  //   }
  //   player.pushChat('Item ' + weapon + ' has been equiped.', null, 'faction-message');
  // }
});

mp.events.add('faction_duty', (player) => {
  if(player.info.member == 1) {
    if(player.vars.uniformEquipped == false) return player.pushError("You must wear your faction clothes to use this command.");
    player.vars.factionDuty = !player.vars.factionDuty;
    if(player.vars.factionDuty == true) {
      player.pushChatToAll(`Paramedic ${player.name} is now On-Duty. You need medical attention ? Use /service medic.`, '#f07a7a', null);
    } else {
      player.pushChatToAll(`Paramedic ${player.name} is now Off-Duty.`, '#f07a7a', null);
    }
  }
});

mp.events.add("loadVariables", (player) => {
  player.vars.needMedic = false;
  player.vars.needMedicSeconds = 0;
  player.vars.offersHealTo = null;
  player.vars.healPrice = null;
});

mp.events.add("missedServices", (player) => {
  if(player.info.member == 1) {
    let count = 0;
    player.pushChat("[Service Requests]", null, 'faction-message');
    mp.players.forEach((target, ix) => {
      if(!target.loggedIn || target.loggedIn == false || target.info.justRegistered == true) return;
      if(target.vars.needMedic == false) return;
      count ++;
      target.pushChat(`* ${target.name} (${target.id}) - Health: ${target.health}`, null, 'faction-message');
    });
    if(count == 0) return player.pushChat("- There are no requests.", null, 'faction-message'); 
  } 
});

mp.events.add("playerTimer", (player) => {
  if(player.vars.needMedic == true) {
    player.vars.needMedicSeconds --;
    if(player.vars.needMedicSeconds < 1) {
      player.vars.needMedic = false;
    }
  }
});

mp.events.add("cmd_service", (player, name) => {
  if(name == 'medic' || name == 'Medic') {
    if(player.info.member == 1) return player.pushError("You can't request your faction service.");
    if(player.vars.needMedic == true) return player.pushError("Wait " + player.vars.needMedicSeconds + " seconds before requesting a medic again.")
    let count = 0;
    mp.players.forEach((target, ix) => {
      if(!target.loggedIn || target.loggedIn == false || target.info.justRegistered == true) return;
      if(target.info.member != 1) return;
      if(target.vars.factionDuty == false) return;
      count ++;
      player.vars.needMedic = true;
      player.vars.needMedicSeconds = 30;
      let dist = target.dist(player.position);
      target.pushChat(`${player.name} needs a medic (Distance: ${dist.toFixed(1)} m). (/accept service ${player.id})`, null, 'faction-message');
    });
    if(count == 0) return player.pushError("There are no paramedics available at this moment.");
  }
});

mp.events.addCommand("heal", (player, fullText, target) => {
  if(player.info.member != 1) return player.pushError("You're not a medic.");
  if(target == undefined) return player.pushExample("/heal [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(player.dist(target.position) > 10) return player.pushError("This player is too far away.");
  if(target.healh == 100) return player.pushError("This player does not need medical attention.");
  let price = 50 + 50 * (player.info.rank / 10);
  player.vars.healPrice = price;
  player.pushChat(`Paramedic ${player.name} has offered to heal ${target.name} for ${formatMoney(price, 0)}$`, null, 'faction-message');
  target.pushChat(`Paramedic ${player.name} will heal you for ${formatMoney(price, 0)}$ (/accept heal ${player.id})`, null, 'faction-message');
  player.vars.offersHealTo = target;
});