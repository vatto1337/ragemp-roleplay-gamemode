mp.events.add('prepareCameraForCustom', () => {
  camera = mp.cameras.new("camera", new mp.Vector3(-332.80712890625, -141.66856384277344, 39.83681106567383), new mp.Vector3(0, 0, 30), 50);
  camera.pointAtCoord(new mp.Vector3(-326.63397216796875, -147.62355041503906, 39.069000244140625));
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
  showMoney = true;
  // if(player.vehicle) {
  //   player.vehicle.freezePosition(true);
  // }

});

mp.events.add('setCamera', (x, y, z, x1, y2, z2, fov) => {
  camera = mp.cameras.new("camera", new mp.Vector3(x, y, z), new mp.Vector3(0, 0, 30), fov);
  camera.pointAtCoord(new mp.Vector3(x1, y2, z2));
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
});

mp.events.add('stopCamera', () => {
  mp.game.cam.renderScriptCams(false, false, 0, false, false);
});

mp.events.add('comeBackFromCustom', () => {
  mp.events.callRemote("exitCustomLS");
  mp.game.cam.renderScriptCams(false, false, 0, false, false);
  mp.events.call("comeBackFromBrowser");
  // if(player.vehicle) {
  //   player.vehicle.freezePosition(false);
  // }
});

mp.events.add('custom_fixVehicle', () => {
  if(player.getVariable('money') < 500) {
    notifyError(`You don't have enough money.`);      
  } else {
    mp.events.callRemote("custom_fixVehicle");
    notifySuccess('This vehicle has been repaired.');
  }
});

mp.events.add('custom_setVehiclePaint', (rgb1, rgb2) => {
  if(player.getVariable('money') < 300) {
    notifyError(`You don't have enough money.`);      
  } else {
    notifySuccess(`Vehicle colors changed to ${rgb1} - ${rgb2} with success.`);
    mp.events.callRemote("custom_setVehiclePaint", rgb1, rgb2);
    mp.events.callRemote("custom_takeMoney", 300);
  }
});

mp.events.add('custom_buyVehiclePlate', (plate) => {
  if(player.getVariable('money') < 100) {
    notifyError(`You don't have enough money.`);      
  } else {
    notifySuccess(`Vehicle plate changed with success.`);
    mp.events.callRemote("custom_setVehiclePlate", plate);
    mp.events.callRemote("custom_takeMoney", 100);
  }
});

mp.events.add('custom_applyVehicleMod', (type, index, toggle) => {
  mp.events.callRemote("custom_upgradeVehicle", type, index, toggle);
});

mp.events.add('custom_buyVehicleMod', (type, index, cash, title) => {
  if(player.vehicle.getNumMods(type) < index) {
    notifyError(`This ${title} is not available for this vehicle.`);
  } else {
    if(player.getVariable('money') < cash) {
      notifyError(`You don't have enough money.`);      
    } else {
      if(index != -1 ) {
        notifySuccess(`${title} modifications have been purchased.`);
        hud.execute(`gui.modals[0].currentMod(${type}, ${index});`);
        mp.events.callRemote("custom_takeMoney", cash);
      } else {
        notifySuccess(`${title} is now back to standard.`);
        hud.execute(`gui.modals[0].currentMod(${type}, ${index});`);
      }
    } 
  }
});

mp.events.add('custom_setRotation', (type) => {
  mp.events.callRemote("custom_setRotation", type);
});

