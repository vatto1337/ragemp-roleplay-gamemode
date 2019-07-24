var hash = require('simple-encryptor')('bZgl4bXFJ3HNQ4Rkozpzzhurdock');
const accounts = require("../../schema/accounts.js");

mp.events.addCommand("help", (player, fullText) => {
  player.pushChat("You want to see the commands ? Press F2 for that.")
});

mp.events.addCommand("stats", (player, fullText) => {
  player.pushChat("You want to see your account stats ? Press F2 for that.");
});

function cmd_HelpMe(player, fullText, target, ...message) {
  if(player.info.admin == 0) {
    if(player.info.muted != null) return player.notifyError("You're still muted for " + (player.info.muted / 1000).toFixed(0) + " seconds.");
    if(player.vars.newbie != null) return player.pushError(`Wait ${player.vars.newbie} seconds before asking questions again.`);
    if(fullText == undefined) return player.pushExample('/n [Question]');
    let count = 0;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.vars.tog.newbie == false) return;
      if(_player.info.admin == 0) return;
      count ++;
    });    
    if(count == 0) return player.pushError("There are no administrators online at the moment, check our server guide (F2) for help!");
    player.vars.newbie = 30;
    fullText = stripStuff(fullText);
    player.vars.newbieQuestion = fullText;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.vars.tog.newbie == false) return;
      if(_player.info.admin == 0) return;
      _player.pushChat(`(Newbie) ${player.name} asks: ${fullText} [/n ${player.id}]`, '#81ecec');
    });
    player.pushChat(`(Newbie) ${player.name} asks: ${fullText} [/n ${player.id}]`, '#81ecec');

  } else {
    message = message.join(" ");
    if(target == undefined || message == undefined) return player.pushExample("/n [Player ID / Name] [Answer]");
    target = getPlayerID(target);
    if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
    if(target.vars.newbieQuestion == null) return player.pushError("This player has no question for the staff.");
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.vars.tog.newbie == false) return;
      _player.pushChat(`(Newbie) ${target.name} asks: ${target.vars.newbieQuestion}.`, '#81ecec');
      _player.pushChat(`(Newbie) ${player.name} responds: ${message}.`, '#81ecec');
    });
    target.vars.newbieQuestion = null;
  }
}

mp.events.addCommand("n", cmd_HelpMe);
mp.events.addCommand("newbie", cmd_HelpMe);

function cmd_tog(player, fullText, togName) {
  if(togName == undefined) return player.pushExample("/tog [Name]"), player.pushInfo('Available togs: ' + Object.keys(player.vars.tog).join(', '));;
  if(player.vars.tog[togName] == undefined) return player.pushError("Invalid tog name.");
  player.vars.tog[togName] = !player.vars.tog[togName];
}

mp.events.addCommand("tog", cmd_tog); 
mp.events.addCommand("togs", cmd_tog); 

mp.events.addCommand("pay", (player, fullText, target, value) => {
  if(target == undefined || value == undefined) return player.pushExample('/pay [Target ID / Name] [Value]');
  target = getPlayerID(target), value = parseInt(value);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  let pos = target.position;
  if(!player.IsInRange(pos.x, pos.y, pos.z, 5)) return player.pushError("You're too far away from this player!");
  if(player.info.level < 2) return player.pushError('You need to be level 2 at least to use this command.');
  if(value < 0 || value > 5000) return player.pushError('You can give someone a value of money between 0$ - 5.000$. Go to a bank.')  
  if(player == target) return player.pushError("You can't give yourself money.");
  if(!player.haveMoney(value)) return player.pushError("You don't have that much money.");
  player.takeMoney(value);
  target.giveMoney(value);
  player.notify(`~r~You've given: ${player.formatMoney(value, 0)}$ `);
  target.notify(`~g~You've received: ${player.formatMoney(value, 0)}$ `);
  player.pushLocalChat(`${player.name} takes out some cash, and hands it to ${target.name}.`, null, 'action-message');
});

mp.events.addCommand("accept", (player, fullText, accept, target) => {
  if(accept == undefined) return player.pushExample("/accept [Option]");
  // if(accept == 'group') {
  //   if(target == undefined) return player.pushExample("/accept dice [Player ID / Name]");
  //   target = getPlayerID(target);
  //   if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);    
  //   if(target.vars.invitations.group != player) return player.pushError("This player don't have an group invitation for you.");
  //   if(Groups[getGroupID(target.info.group)].members.length > 9) return player.pushError("This player's group has reached its limit of 10 players.");
  //   if(player.info.group != null) return player.pushError("You already are in a group.");
  //   player.info.group = target.info.group;
  //   let obj = {
  //     name: player.name,
  //     owner: false,
  //     joinDate: new Date(),
  //     lastOnline: new Date(),
  //     online: true
  //   }
  //   Groups[getGroupID(player.info.group)].members.push(obj);
  //   saveGroup(Groups[getGroupID(player.info.group)].id);
  //   mp.players.forEach((p) => {
  //     if(p.loggedIn == false || !p.loggedIn) return;
  //     if(p.info.group != player.info.group) return;
  //     p.pushChat(`${player.name} has joined this group.`, null, 'group-message');
  //   });

  // }
  if(accept == 'heal') {
    if(target == undefined) return player.pushExample("/accept heal [Player ID / Name]");
    target = getPlayerID(target);
    if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
    if(target.info.member != 1) return player.pushError("This player is not part of Medicine Department.");
    if(target.vars.offersHealTo != player) return player.pushError("This player is not having an healing offer for you.");
    if(player.getMoney() < target.vars.healPrice) return player.pushError("You don't have enough money.");
    target.vars.offersHealTo = null;
    player.takeMoney(target.vars.healPrice);
    target.giveMoney(target.vars.healPrice);
    player.pushLocalChat(`${target.name} prescribes pills for ${player.name} to feel better.`, null, 'action-message');
    player.health = 100;
  }
  if(accept == 'service') {
    if(player.info.member == null) return player.pushError("This command is only for faction members.");
    if(target == undefined) return player.pushExample("/accept service [Player ID / Name]");
    target = getPlayerID(target);
    if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
    if(player.info.member == 1) {
      if(target.vars.needMedic == false) return player.pushError("This player does not need a medic.");
      target.vars.needMedic = false;
      player.sendMessageToFaction(`${player.name} has picked up ${target.name}'s service request for a medic.`, null, 'faction-message');
      target.pushChat(`${player.name} has picked up your service request for a medic.`, null, 'faction-message');
      target.pushChat(`Please stay at this position so the paramedic can find you easily.`, null, 'faction-message');
      player.call('createGPSBlip', [target.position.x, target.position.y, target.position.z, `${target.name} - Service request location`]);
    }
  }
  if(accept == 'invite') {
    if(target == undefined) return player.pushExample("/accept free [Player ID / Name]");
    target = getPlayerID(target);
    if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
    if(target.vars.invitations.faction != player) return player.pushError("This player has not invited you into his faction.");
    let dist = player.dist(target.position);
    if(player.info.leader != null || player.info.member != null) return player.pushError("You can't join another faction.");
    if(dist > 10) return player.pushError("Player is too far away.");
    player.pushChat(`[Faction] You have accepted ${target.name}'s faction invitation.`, null,'faction-message');
    target.pushChat(`[Faction] ${player.name} has accepted your faction invite.`, null,'faction-message');
    target.vars.invitations.faction = null;
    player.info.member = target.info.leader;
    player.info.rank = 0;
    player.info.leader = null;
    player.info.fwarns = 0;
    player.info.spawn = 2;
    player.info.fJoined = new Date();
    player.respawnMyself();
  }
  if(accept == 'ticket') {
    if(target == undefined) return player.pushExample("/accept ticket [Player ID / Name]");
    target = getPlayerID(target);
    if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
    if(target.vars.invitations.ticket.to != player) return player.pushError("This player don't have an ticket offer for you.");
    if(player.getMoney() < target.vars.invitations.ticket.money) return player.pushError("You don't have enough money to pay.");
    let dist = player.dist(target.position);
    if(dist > 10) return player.pushError("Player is too far away.");
    player.takeMoney(target.vars.invitations.ticket.money);
    target.giveMoney(target.vars.invitations.ticket.money);
    target.pushChat(`${player.name} pays the ticket received from Officer ${target.name}.`, null, 'server-message');
    target.vars.invitations.ticket.to = null;
    target.vars.invitations.ticket.money = null;
  }
  if(accept == 'free') {
    if(target == undefined) return player.pushExample("/accept free [Player ID / Name]");
    target = getPlayerID(target);
    if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
    if(target.vars.invitations.free.to != player) return player.pushError("This player don't have an free offer for you.");
    if(player.getMoney() < target.vars.invitations.free.money) return player.pushError("You don't have enough money to pay.");
    let dist = player.dist(target.position);
    if(dist > 10) return player.pushError("Player is too far away.");
    if(player.info.prisonTime == 0) return player.pushError("You're not jailed.");
    player.takeMoney(target.vars.invitations.free.money);
    target.giveMoney(target.vars.invitations.free.money);
    player.pushChat(`Lawyer ${target.name} got you out of prison for ${formatMoney(target.vars.invitations.free.money, 0)}$`, null, 'server-message');
    target.pushChat(`You got ${player.name} out of prison for ${formatMoney(target.vars.invitations.free.money, 0)}$`, null, 'server-message');
    player.info.prisonTime = 1;
    target.vars.invitations.free.to = null;
    target.vars.invitations.free.money = null;
  }
  if(accept == 'dice') {
    if(target == undefined) return player.pushExample("/accept dice [Player ID / Name]");
    target = getPlayerID(target);
    if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
    if(target.vars.invitations.dice.to != player) return player.pushError("This player don't have an dice invitation for you.");
    if(player.getMoney() < target.vars.invitations.dice.money) return player.pushError("You don't have enough money to play.");
    if(target.getMoney() < target.vars.invitations.dice.money) return player.pushError("The player don't have enough money to play.");
    if(!target.hasItemInInventory("Dices")) return player.pushError("This player don't own a pair of dices.");
    if(target == player) return player.pushError("You can't play with yourself dices.");
    let dist = player.dist(target.position);
    if(dist > 10) return player.pushError("Player is too far away.");
    let number1, number2, number3, number4;
    number1 = (1 + Math.random() * 6).toFixed(0);
    number2 = (1 + Math.random() * 6).toFixed(0);
    number3 = (1 + Math.random() * 6).toFixed(0);
    number4 = (1 + Math.random() * 6).toFixed(0);
    let final1, final2, result, winner = null, loser = null;
    final1 = (number1 + number2);
    final2 = (number3 + number4);
    if(final1 > final2) {
      result = `${player.name} won`;
      winner = player;
      loser = target;
    }
    else if(final2 > final1) {
      result = `${target.name} won`;
      winner = target;
      loser = player;
    }
    else {
      result = `Nobody won`;
    }

    player.pushLocalChat(`* ${player.name} rolls ${number1}:${number2} and ${target.name} rolls ${number3}:${number4} (${result})`, null, 'action-message');
    
    if(winner != null) {
      winner.giveMoney(target.vars.invitations.dice.money);
      loser.takeMoney(target.vars.invitations.dice.money);
    }
    player.vars.invitations.dice.to = null;
    player.vars.invitations.dice.money = null;
    target.vars.invitations.dice.to = null;
    target.vars.invitations.dice.money = null;
  }
  if(accept == 'trade') {
    if(target == undefined) return player.pushExample("/accept trade [Player ID / Name]");
    target = getPlayerID(target);
    if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);    
    if(target.vars.trade.trading == true) return player.pushError("This player is already trading with someone.");
    if(target.vars.trade.tradeInvitation != player) return player.pushError("This player did not invited you to trade.");
    player.vars.trade.tradeWith = target;
    player.vars.trade.trading = true;
    target.vars.trade.trading = true;
    target.vars.trade.tradeWith = player;
    player.vars.trade.tradeOffer = [];
    target.vars.trade.tradeOffer = [];
    target.vars.trade.tradeAccept = false;
    player.vars.trade.tradeAccept = false;
    target.vars.trade.Chat = [];
    player.vars.trade.Chat = [];
    player.vars.trade.moneyOffer = 0;
    target.vars.trade.moneyOffer = 0;
    player.vars.trade.tradeReady = false,
    target.vars.trade.tradeReady = false;
    player.info.inventory.forEach((im) => {
      im.markedForTrade = false;
    });
    target.info.inventory.forEach((im) => {
      im.markedForTrade = false;
    });
    player.call('toggleModal', [15, 'nothing', JSON.stringify({ 
      yourInventory: player.info.inventory,
      yourOffer: player.vars.trade.tradeOffer,
      yourAccept: player.vars.trade.tradeAccept,
      hisOffer: target.vars.trade.tradeOffer,
      hisAccept: target.vars.trade.tradeAccept,
      tradeChat: player.vars.trade.Chat,
      yourName: player.name,
      hisName: target.name,
      yourMoney: player.info.wallet,
      yourMoneyOffer: player.vars.trade.moneyOffer,
      hisMoneyOffer: target.vars.trade.moneyOffer
    })]);

    target.call('toggleModal', [15, 'nothing', JSON.stringify({ 
      yourInventory: target.info.inventory,
      yourOffer: target.vars.trade.tradeOffer,
      yourAccept: target.vars.trade.tradeAccept,
      hisOffer: player.vars.trade.tradeOffer,
      hisAccept: player.vars.trade.tradeAccept,
      tradeChat: target.vars.trade.Chat,
      yourName: target.name,
      hisName: player.name,
      yourMoney: target.info.wallet,
      yourMoneyOffer: target.vars.trade.moneyOffer,
      hisMoneyOffer: player.vars.trade.moneyOffer
    })]);

    player.call("inventory_start");
    target.call("inventory_start");
    player.call('resetTrade');
    target.call('resetTrade');
    
  }
});

mp.events.addCommand("healme", (player, fullText) => {
  mp.events.call('heal_command', player);
});

mp.events.addCommand("buylevel", (player, fullText) => {
  if(!player.haveMoney(player.info.level * 250)) return player.pushError(`You don't have enough money. (You need ${player.formatMoney(player.info.level * 250, 0)}$)`);
  if(player.info.respect < player.info.level * 4 - 2) return player.pushError(`You don't have enough respect points. (You need ${ player.info.level * 4 - 2} respect points)`);
  player.takeMoney(player.info.level * 250);
  player.info.respect -= player.info.level * 4 - 2;
  if(player.info.premium == 0) {
    player.info.respect = 0;
  }
  player.info.level ++;
  player.pushChat(`You've advanced to level ${player.info.level}. Next level is going to need ${player.info.level * 4 - 2} respect points!`);
  player.savePlayerInfo();
  player.call("playSoundEffect", ["MP_RANK_UP", "HUD_FRONTEND_DEFAULT_SOUNDSET"])
});

mp.events.addCommand("changepassword", (player, fullText, old, newPass) => {
  if(old == undefined || newPass == undefined) return player.pushChat(`Example of command usage: /changepassword [Actual Password] [New Password]`, null, 'server-error'); 
  if(hash.hmac(old) != player.password) return player.pushError(`The actual password is not correct.`);
  player.pushChat(`You've changed your password to '${newPass}' with success.`);
  newPass = hash.hmac(newPass);
  accounts.findOne({ username: player.name }, function (err, user) {
    if(err) return console.log(err);
    user.set({ password: newPass });
    user.save(function (err, updatedUser) {
      if(err) return console.log(err);
    });
  });
});

mp.events.addCommand("id", (player, fullText, param1) => {
  if(param1 == undefined) return player.pushExample('/id [Name]');
  let result = false;
  mp.players.forEach((x) => {
    if(x.loggedIn == false) return;
    if(x.name === param1) {
      result = true;
      player.pushChat(`(Level ${x.info.level}) ${x.name} - ID ${x.id}.`);
    }
  });
  if(result == false) return player.pushError('There is no player with that name.');
});

mp.events.addCommand("playanim", (player, fullText, dict, name, id) => {
  if(dict == undefined || name == undefined || id == undefined) return player.pushExample('/playanim [dict] [name] [id]');
  player.playAnimation(dict, name, 1, parseInt(id));
});

mp.events.addCommand("settat", (player, fullText, collection, overlay) => {
  if(collection == undefined || overlay == undefined) return player.pushExample('/tat coll name');
  player.setDecoration(parseInt(collection), parseInt(overlay));
});

mp.events.addCommand("ps", (player, fullText, scen) => {
  if(scen == undefined) return player.pushExample('/ps [scenary]');
  player.playScenario(scen);
});

mp.events.addCommand("changespawn", (player, fullText, id) => {
  if(id == undefined) return player.pushExample("/changespawn [0-2]");
  if(id < 0 || id > 2) return player.pushError("Invalid spawn option.");
  id = parseInt(id);
  if(id == 0) {
    player.info.spawn = 0;
    player.pushChat("You're now going spawn at server spawn.", null, 'server-message');
  }
  if(id == 1) {
    if(player.hasItemInInventory('House Key') || player.hasItemInInventory('House Contract')) {
      player.info.spawn = 1;
      player.pushChat("You're now going spawn at house.", null, 'server-message');
    } else {
      player.pushError("You don't have a house to spawn at.");
    }
  }
  if(id == 2) {
    if(player.info.member == null) return player.pushError("You're not member of a faction.");
    player.info.spawn = 2;
    player.pushChat("You're now going to spawn at faction headquarters.", null, 'faction-message');
  }
});
