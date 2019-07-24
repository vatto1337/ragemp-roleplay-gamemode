mp.keys.bind(0x71, true, function() {
  if(loggedIn == true) {
    if(interfaceOpened == false && useInventory == false) {
      mp.events.callRemote("requestInventory");
      mp.events.call("inventory_start");
    } else if(useInventory == true) {
      mp.events.call('disableModals');
    }
  }
});

mp.events.add('inventory_start', () => {
  mp.game.graphics.setTimecycleModifier('heliGunCam');
  useInventory = true;
  // mp.events.callRemote("LookingAtPhone");
});

mp.events.add('inventory_use', (object) => {
  mp.events.callRemote("inventory_use", object);
});

mp.events.add('inventory_drop', (object) => {
  mp.events.callRemote("inventory_drop", object);
});

mp.events.add('updateInventory', (inventory) => {
  hud.execute(`gui.modals[3].setInventory('${inventory}');`);
});

mp.events.add('resetTrade', () => {
  hud.execute(`gui.modals[3].clearTrade();`);
});

mp.events.add('addItemToOffer', (index) => {
  mp.events.callRemote("trade_addItemToOffer", index);
});

mp.events.add('removedItemFromOffer', (index) => {
  mp.events.callRemote("trade_removedItemFromOffer", index);
});

mp.events.add('updateMoneyOffer', (money) => {
  mp.events.callRemote("trade_updateMoneyOffer", money);
});

mp.events.add('sendTradeMessage', (chat) => {
  mp.events.callRemote("trade_sendTradeMessage", chat);
});

mp.events.add('switchTradeStatus', () => {
  mp.events.callRemote("trade_switchTradeStatus");
});

mp.events.add('cancelTrade', () => {
  mp.events.callRemote("trade_cancel");
});

mp.events.add('finishTrade', () => {
  mp.events.callRemote("trade_finishTrade");
});

mp.events.add('inventory_confiscate', (object) => {
  mp.events.callRemote("inventory_confiscate", object);
});