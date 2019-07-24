mp.events.add('authCamera', (stage, path) => {
  if(stage == 1) 
  {
    player.position = new mp.Vector3(-1263.4312744140625, -716.9706420898438, 30);
    camera = mp.cameras.new("camera", new mp.Vector3(-1263.4312744140625, -716.9706420898438, 65.55624389648438), new mp.Vector3(0, 0, 30), 30);
    camera.pointAtCoord(new mp.Vector3(-1075.4251708984375, -1276.5439453125, 4.83953857421875));
    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    mp.gui.chat.show(false); 
    mp.gui.cursor.show(true, true);
    mp.game.ui.displayRadar(false);
    mp.game.ui.displayAreaName(false);
    mp.game.ui.displayCash(true);
    player.freezePosition(true);
    browser = mp.browsers.new(cefDomain + '/auth'); 
    browser.execute(`appData.commit('auth/setPageMethod', '${path}');`);
    // mp.discord.update('GTA V: Romania', player.name);
    mp.game.graphics.setTimecycleModifier('hud_def_blur');
  }
  else if(stage == 2) {
    mp.game.cam.renderScriptCams(false, false, 0, false, false);
    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(true);
    player.freezePosition(false);
    if (mp.browsers.exists(browser)) { browser.destroy(); }
    showMoney = true;
    mp.game.graphics.setTimecycleModifier('default');
    if(hud == null) {
      hud = mp.browsers.new(cefDomain + '/hud');
      hud.markAsChat();      
    }
  }
});

mp.events.add('loadBanClient', () => {
  mp.gui.chat.show(false); 
  hud = mp.browsers.new(cefDomain + '/hud');
  hud.markAsChat();
  mp.game.graphics.setTimecycleModifier('hud_def_blur');
  player.position = new mp.Vector3(-1263.4312744140625, -716.9706420898438, 30);
  camera = mp.cameras.new("camera", new mp.Vector3(-1263.4312744140625, -716.9706420898438, 65.55624389648438), new mp.Vector3(0, 0, 30), 30);
  camera.pointAtCoord(new mp.Vector3(-1075.4251708984375, -1276.5439453125, 4.83953857421875));
  camera.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
  mp.gui.cursor.show(true, true);
  mp.game.ui.displayRadar(false);
  mp.game.ui.displayAreaName(false);
  mp.game.ui.displayCash(true);
  player.freezePosition(true);

});
mp.events.add('destroyBrowserAuth', () => {
  if (mp.browsers.exists(browser)) { browser.destroy(); }
});

mp.events.add('sendLoginData', password => {
  mp.events.callRemote("receiveLoginData", password);
});

mp.events.add('sendRegisterData', password => {
  mp.events.callRemote("receiveRegisterData", password);
});

mp.events.add('sendAuthResponse', (data, target) => {
  browser.execute(`appData.commit('auth/setAlert', '${data}');`);
});