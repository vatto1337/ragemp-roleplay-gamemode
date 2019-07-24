// Beneficii premium:
// 0.3 interes la payday inloc de 0.1.
// la /buylevel iti raman punctele de rp.
// IDEE: la rob sa ai nevoie de doar 8 ore, nu 10.
// IDEE: Sa poti cumpara sloturi la clan.

mp.events.addCommand("makepremium", (player, fullText, target, rank) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || rank == undefined) return player.pushExample(`/makepremium [Target ID / Name] [0-3]`); 
  target = getPlayerID(target), rank = parseInt(rank);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.sendMessageToAdmins(`[Staff] ${player.name} has changed ${target.name}'s premium level to ${rank}.`, null, 'admin-message');
  target.info.premium = rank;
  target.savePlayerInfo();
});

mp.events.addCommand("givegold", (player, fullText, target, rank) => {
  if(!player.checkAdminRank(8)) return player.pushError(`You don't have permission to use this.`);
  if(target == undefined || rank == undefined) return player.pushExample(`/givegold [Target ID / Name] [Quantity]`); 
  target = getPlayerID(target), rank = parseInt(rank);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  player.sendMessageToAdmins(`[Staff] ${player.name} has given ${target.name} ${rank} gold.`, null, 'admin-message');
  target.notify(`~c~New item: ~w~Gold.~n~~w~Use /shop to buy premium.`);
  target.giveItemToInventory(
    `Gold`, // Title
    16, // Type
    true, // Stackable,
    rank, // Quantity
    false, // Can be used
    true, // Can be traded
  ); 
  target.savePlayerInfo();
});

mp.events.addCommand("shop", (player, fullText) => {
  let products = [
    { title: 'Premium (1 Week)', price: 50 },
    { title: 'Premium (1 Month)', price: 200 },
    { title: 'Premium (6 Months)', price: 1300 },
    { title: 'Personal vehicle slot', price: 100 },
    { title: 'Clear warns', price: 200 }
  ];
  player.call('toggleModal', [17, 'chat', JSON.stringify({ products: products, selected: 0 })]);
});

mp.events.add('buyFromShop', (player, index) => {
  if(!player.hasItemInInventory('Gold')) return player.notifyError("You don't have enough gold in yoru inventory.");
  let ownGold = player.getItemFromInventory('Gold')[0].quantity;
  if(index == 0) {
    if(ownGold < 50) return player.notifyError("You don't have enough gold in your inventory.");
    player.info.premium += 168;
    player.info.inventory.forEach((item, index) => {
      if(item.type == 16) {
        item.quantity -= 50;
        if(item.quantity < 1) {
          player.info.inventory.splice(index, 1);
        }
      }
    });
    player.pushChat('You have purchased one week of premium.', null, 'premium-message');
  }
  else if(index == 1) {
    if(ownGold < 200) return player.notifyError("You don't have enough gold in your inventory.");
    player.info.premium += 730;
    player.info.inventory.forEach((item, index) => {
      if(item.type == 16) {
        item.quantity -= 200;
        if(item.quantity < 1) {
          player.info.inventory.splice(index, 1);
        }
      }
    });
    player.pushChat('You have purchased one month of premium.', null, 'premium-message');
  }
  else if(index == 2) {
    if(ownGold < 1300) return player.notifyError("You don't have enough gold in your inventory.");
    player.info.premium += 4382;
    player.info.inventory.forEach((item, index) => {
      if(item.type == 16) {
        item.quantity -= 1300;
        if(item.quantity < 1) {
          player.info.inventory.splice(index, 1);
        }
      }
    });
    player.pushChat('You have purchased 6 months of premium.', null, 'premium-message');
  }
  else if(index == 3) {
    if(ownGold < 100) return player.notifyError("You don't have enough gold in your inventory.");
    player.info.personalSlots += 1;
    player.info.inventory.forEach((item, index) => {
      if(item.type == 16) {
        item.quantity -= 100;
        if(item.quantity < 1) {
          player.info.inventory.splice(index, 1);
        }
      }
    });
    player.pushChat('You have increased your personal vehicles limit (New limit: ' + player.info.personalSlots + ' vehicles).', null, 'premium-message');
  }
  else if(index == 4) {
    if(ownGold < 200) return player.notifyError("You don't have enough gold in your inventory.");
    if(player.info.warns == 0) return player.pushError("You don't have any warn to remove.");
    player.info.warns = 0;
    player.info.inventory.forEach((item, index) => {
      if(item.type == 16) {
        item.quantity -= 200;
        if(item.quantity < 1) {
          player.info.inventory.splice(index, 1);
        }
      }
    });
    player.pushChat("Your account's warns have been removed.", null, 'premium-message');
  }
});

mp.events.add('registeredJoin', player => {
  player.info.premium = 0;
  player.info.personalSlots = 3;
});

// function cmd_premiumChat(player, fullText) { 
//   if(player.info.premium == 0) return player.pushError("You must have premium account status to use this.");
//   if(fullText == undefined) return player.pushExample("/pc [Message]");
//   let message = stripStuff(fullText);
//   mp.players.forEach((_player) => {
//     if(!_player.loggedIn || _player.loggedIn == false) return;
//     if(_player.info.premium == 0) return;
//     _player.pushChat(`Premium ${player.name} says: ${message}`, null, 'premium-message');
//   });
// }

// mp.events.addCommand("pc", cmd_premiumChat);
// mp.events.addCommand("premiumchat", cmd_premiumChat);