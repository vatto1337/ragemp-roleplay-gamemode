// Inventory Addon: Trade.

mp.events.add("loadVariables", player => {
  player.vars.trade = {
    trading: false,
    tradeInvitation: null,
    tradeWith: null,
    tradeOffer: null,
    tradeAccept: null,
    Chat: null,
    moneyOffer: null,
    tradeReady: null
  }

  player.updateTrade = function() {
    if(player.vars.trade.trading == true) {
      let target = player.vars.trade.tradeWith;

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
        hisMoneyOffer: target.vars.trade.moneyOffer,
        hisReady: target.vars.trade.tradeReady,
        yourReady: player.vars.trade.tradeReady
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
        hisMoneyOffer: player.vars.trade.moneyOffer,
        hisReady: player.vars.trade.tradeReady,
        yourReady: target.vars.trade.tradeReady
      })]);
    }
  }
});

mp.events.addCommand("trade", (player, fullText, target) => {
  if(target == undefined) return player.pushExample("/trade [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target == player) return player.pushError("You can't trade with yourself.");
  let dist = player.dist(target.position);
  if(dist > 10) return player.pushError("Player is too far away.");
  if(target.vars.trade.trading == true) return player.pushError("This player is already trading with someone else!");
  player.vars.trade.tradeInvitation = target;
  player.pushChat(`You have invited ${target.name} to trade items with you.`, null, 'trade-message');
  target.pushChat(`${player.name} invited you to trade items. (/accept trade ${player.id})`, null, 'trade-message');
});

mp.events.add("loggedQuit", (player, exitType, reason) => {
  if(player.vars && player.vars.trade) {
    if(player.vars.trade.trading == true) {
      let target = player.vars.trade.tradeWith;
      target.call('disableModals');
      target.vars.trade.trading = false;
      player.vars.trade.trading = false;
      player.vars.trade.tradeInvitation = null;
      target.vars.trade.tradeInvitation = null;
      target.pushChat(`Trade has been cancelled. ${player.name} has left the game.`, null, 'trade-message');
    }
  }
});

mp.events.add('trade_cancel', (player) => {
  if(player.vars.trade.trading == false) return;
  let target = player.vars.trade.tradeWith;
  player.pushChat(`Trade with ${target.name} has been cancelled.`, null, 'trade-message');
  target.pushChat(`${player.name} cancelled the trade.`, null, 'trade-message');
  player.vars.trade.trading = false;
  target.vars.trade.trading = false;
  player.vars.trade.tradeInvitation = null;
  target.vars.trade.tradeInvitation = null;
  target.call('disableModals');
});

mp.events.add('trade_finishTrade', (player) => {
  let target = player.vars.trade.tradeWith;
  if(player.vars.trade.trading == false) return;

  player.vars.trade.tradeAccept = !player.vars.trade.tradeAccept;

  if(target.vars.trade.tradeAccept == true && player.vars.trade.tradeAccept == true) {
    
    // Vehicle Limitations.

    let ownedVehicles = 0;
    let vehicleLimit = player.info.personalSlots;
    player.info.inventory.forEach((owned, index) => { if(owned.type == 15) { ownedVehicles ++;  } })
    player.vars.trade.tradeOffer.forEach((traded, index) => { if(traded.type == 15) { ownedVehicles --; } });
    target.vars.trade.tradeOffer.forEach((traded, index) => { if(traded.type == 15) { ownedVehicles ++; } });
    if(ownedVehicles > vehicleLimit) return player.notifyError("You can't own more than " + vehicleLimit + " vehicles.");
    
    ownedVehicles = 0;
    vehicleLimit = target.info.personalSlots;
    target.info.inventory.forEach((owned, index) => { if(owned.type == 15) { ownedVehicles ++;  } })
    target.vars.trade.tradeOffer.forEach((traded, index) => { if(traded.type == 15) { ownedVehicles --; } });
    player.vars.trade.tradeOffer.forEach((traded, index) => { if(traded.type == 15) { ownedVehicles ++; } });
    if(ownedVehicles > vehicleLimit) return player.notifyError(target.name + " can't own more than " + vehicleLimit + " vehicles.");
    
    // House Limitations.

    let ownedHouses = 0;
    let houseLimit = 1;
    player.info.inventory.forEach((owned, index) => { if(owned.type == 13) { ownedHouses ++; }})
    player.vars.trade.tradeOffer.forEach((owned, index) => { if(owned.type == 13) { ownedHouses --; }})
    target.vars.trade.tradeOffer.forEach((owned, index) => { if(owned.type == 13) { ownedHouses ++; }})
    if(ownedHouses > houseLimit) return player.notifyError("You can't own more than " + houseLimit + " houses.");

    ownedHouses = 0;
    houseLimit = 1;
    target.info.inventory.forEach((owned, index) => { if(owned.type == 13) { ownedHouses ++; }})
    target.vars.trade.tradeOffer.forEach((owned, index) => { if(owned.type == 13) { ownedHouses --; }})
    player.vars.trade.tradeOffer.forEach((owned, index) => { if(owned.type == 13) { ownedHouses ++; }})
    if(ownedHouses > houseLimit) return player.notifyError(target.name + " can't own more than " + houseLimit + " houses.");
    
    // Business Limitations

    ownedHouses = 0;
    houseLimit = 1;
    player.info.inventory.forEach((owned, index) => { if(owned.type == 14) { ownedHouses ++; }})
    player.vars.trade.tradeOffer.forEach((owned, index) => { if(owned.type == 14) { ownedHouses --; }})
    target.vars.trade.tradeOffer.forEach((owned, index) => { if(owned.type == 14) { ownedHouses ++; }})
    if(ownedHouses > houseLimit) return player.notifyError("You can't own more than " + houseLimit + " businesses.");

    ownedHouses = 0;
    houseLimit = 1;
    target.info.inventory.forEach((owned, index) => { if(owned.type == 14) { ownedHouses ++; }})
    target.vars.trade.tradeOffer.forEach((owned, index) => { if(owned.type == 14) { ownedHouses --; }})
    player.vars.trade.tradeOffer.forEach((owned, index) => { if(owned.type == 14) { ownedHouses ++; }})
    if(ownedHouses > houseLimit) return player.notifyError(target.name + " can't own more than " + houseLimit + " businesses.");
    

    player.vars.trade.tradeInvitation = null;
    target.vars.trade.tradeInvitation = null;
    
    player.call('disableModals');
    target.call('disableModals');
    player.pushChat(`Trade with ${target.name} went successfully. ${target.vars.trade.tradeOffer.length > 0 ? 'Check your inventory for new items!' : ''}`, null, 'trade-message');
    target.pushChat(`Trade with ${player.name} went successfully. ${player.vars.trade.tradeOffer.length > 0 ? 'Check your inventory for new items!' : ''}`, null, 'trade-message');
   
    player.vars.trade.trading = false;
    target.vars.trade.trading = false;

    if(player.vars.trade.moneyOffer > 0 && player.getMoney() > player.vars.trade.moneyOffer) {
      player.takeMoney(player.vars.trade.moneyOffer);
      target.giveMoney(player.vars.trade.moneyOffer);
    }

    if(target.vars.trade.moneyOffer > 0 && target.getMoney() > target.vars.trade.moneyOffer) {
      target.takeMoney(target.vars.trade.moneyOffer);
      player.giveMoney(target.vars.trade.moneyOffer);
    }

    player.vars.trade.tradeOffer.forEach((tradeItem, index) => {
      if(tradeItem.canBeTradable == false) return;
      if(tradeItem.type == 11) {
        let found = false;
        target.info.inventory.forEach((item, index) => {
          if(found == true) return;
          if(item.type == 11) {
            if(item.weapon_name == tradeItem.weapon_name) {
              found = true;
              item.quantity += tradeItem.quantity;
            }
          }
        });
        if(found == false) {
          target.info.inventory.push(tradeItem);
        }
      } 
      else if(tradeItem.type == 13) {
        Houses[tradeItem.house_id].owner = target.name;
        UpdateHouse3D(tradeItem.house_id);
        SaveHouse(tradeItem.house_id)
      }
      else if(tradeItem.type == 14) {
        Business[tradeItem.business_id].owner = target.name;
        UpdateBizz3D(tradeItem.business_id);
        SaveBizz(tradeItem.business_id);
      }
      else if(tradeItem.type == 15) {
        if(tradeItem.spawned == true) {
          let found = false;
          player.vars.personalVehicles.forEach((pers, xx) => {
            if(found == true) return;
            if(pers.id == tradeItem.guid) {
              tradeItem.spawned = false;
              tradeItem.firstSpawn = true;
              pers.entity.destroy();
              player.vars.personalVehicles.splice(xx, 1);
            }
          });
        }
      }
      else {
        if(tradeItem.stackable == true) {
          let foundStackale = false;
          target.info.inventory.forEach((itemx, index) => {
            if(foundStackale == true) return;
            if(tradeItem.type == itemx.type) {
              itemx.quantity += tradeItem.quantity;
              foundStackale = true;
            }
          });
          if(foundStackale == false) {
            target.info.inventory.push(tradeItem);        
          }
        } 
        else {
          target.info.inventory.push(tradeItem);        
        }
      }
    });

    player.vars.trade.tradeOffer.forEach((item, index) => {
      if(item.canBeTradable == false) return;
      player.info.inventory.splice(player.info.inventory.indexOf(item), 1);
    });

    target.vars.trade.tradeOffer.forEach((tradeItem, index) => {
      if(tradeItem.canBeTradable == false) return;
      if(tradeItem.type == 11) {
        let found = false;
        player.info.inventory.forEach((item, index) => {
          if(found == true) return;
          if(item.type == 11) {
            if(item.weapon_name == tradeItem.weapon_name) {
              found = true;
              item.quantity += tradeItem.quantity;
            }
          }
        });
        if(found == false) {
          player.info.inventory.push(tradeItem);
        }
      } 
      else if(tradeItem.type == 13) {
        Houses[tradeItem.house_id].owner = player.name;
        UpdateHouse3D(tradeItem.house_id);
        SaveHouse(tradeItem.house_id)
      }
      else if(tradeItem.type == 14) {
        Business[tradeItem.business_id].owner = player.name;
        UpdateBizz3D(tradeItem.business_id);
        SaveBizz(tradeItem.business_id);
      }
      else if(tradeItem.type == 15) {
        if(tradeItem.spawned == true) {
          let found = false;
          target.vars.personalVehicles.forEach((pers, xx) => {
            if(found == true) return;
            if(pers.id == tradeItem.guid) {
              tradeItem.spawned = false;
              tradeItem.firstSpawn = true;
              pers.entity.destroy();
              target.vars.personalVehicles.splice(xx, 1);
            }
          });
        }
      }
      else {
        if(tradeItem.stackable == true) {
          let foundStackale = false;
          player.info.inventory.forEach((itemx, index) => {
            if(foundStackale == true) return;
            if(tradeItem.type == itemx.type) {
              itemx.quantity += tradeItem.quantity;
              foundStackale = true;
            }
          });
          if(foundStackale == false) {
            player.info.inventory.push(tradeItem);        
          }
        } 
        else {
          player.info.inventory.push(tradeItem);        
        }
      }      
    });

    target.vars.trade.tradeOffer.forEach((item, index) => {
      if(item.canBeTradable == false) return;
      target.info.inventory.splice(target.info.inventory.indexOf(item), 1);
    });

    target.info.inventory.forEach((item, index) => {
      item.markedForTrade = false;
    });

    player.info.inventory.forEach((item, index) => {
      item.markedForTrade = false;
    });

    // Delete house key once they get a house.

    if(player.hasItemInInventory('House Key')) {
      if(player.hasItemInInventory('House Contract')) {
        player.removeItemByName('House Key');
        player.info.spawn = 1;
        player.info.houseSpawn = player.getItemFromInventory('House Contract')[0].house_id;
      }
    }

    if(target.hasItemInInventory('House Key')) {
      if(target.hasItemInInventory('House Contract')) {
        target.removeItemByName('House Key');
        target.info.spawn = 1;
        target.info.houseSpawn = target.getItemFromInventory('House Contract')[0].house_id;
      }
    }

  }
  else {
    let d = new Date(), h = d.getHours(), ms = d.getMinutes(); 
    h = h < 10 ? '0' + h : h;
    ms = ms < 10 ? '0' + ms : ms;
    let message = `<b>[${h}:${ms}] ${player.name} ${player.vars.trade.tradeAccept == true ? 'is accepting your offer.' : 'is not accepting your offer anymore.'}</b>`;
    player.vars.trade.Chat.push(message);
    target.vars.trade.Chat.push(message);  
    player.updateTrade();
  }
});

mp.events.add('trade_switchTradeStatus', (player) => {
  let target = player.vars.trade.tradeWith;
  if(player.vars.trade.trading == false) return;
  player.vars.trade.tradeReady = !player.vars.trade.tradeReady;
  let d = new Date(), h = d.getHours(), ms = d.getMinutes(); 
  h = h < 10 ? '0' + h : h;
  ms = ms < 10 ? '0' + ms : ms;
  let message = `<b>[${h}:${ms}] ${player.name} ${player.vars.trade.tradeReady == true ? "is ready to trade." : "is not ready for trade anymore."}</b>`;
  player.vars.trade.Chat.push(message);
  target.vars.trade.Chat.push(message);  
  player.updateTrade();
});

mp.events.add('trade_sendTradeMessage', (player, message) => {
  let target = player.vars.trade.tradeWith;
  message = stripStuff(message);
  let d = new Date(), h = d.getHours(), ms = d.getMinutes(); 
  h = h < 10 ? '0' + h : h;
  ms = ms < 10 ? '0' + ms : ms;
  message = `<p>[${h}:${ms}] ${player.name} says: ${message}</p>`;
  player.vars.trade.Chat.push(message);
  target.vars.trade.Chat.push(message);
  player.updateTrade();
});

mp.events.add('trade_removedItemFromOffer', (player, index) => {
  let target = player.vars.trade.tradeWith;
  player.info.inventory[player.info.inventory.indexOf(player.vars.trade.tradeOffer[index])].markedForTrade = false;
  player.vars.trade.tradeOffer.splice(index, 1);
  player.updateTrade();
});

mp.events.add('trade_updateMoneyOffer', (player, money) => {
  let target = player.vars.trade.tradeWith;
  if(player.getMoney() < money) return false;
  player.vars.trade.moneyOffer = parseInt(money);
  player.updateTrade();
});

mp.events.add('trade_addItemToOffer', (player, index) => {
  let target = player.vars.trade.tradeWith;
  if(player.info.inventory[index].markedForTrade == true) return false;
  player.vars.trade.tradeOffer.push(player.info.inventory[index]);
  player.info.inventory[index].markedForTrade = true;
  player.updateTrade();
});
