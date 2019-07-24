mp.events.add('prepareForBrowser', (visible) => {
  if (visible == 'chat') {
    hud.execute(`appData.commit('others/setHudStatus', 1);`);
  }
  else if (visible == 'nothing') {
    hud.execute(`appData.commit('others/setHudStatus', 0);`);
    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);
    showMoney = false;
    showSubtitles = false;
  }
  mp.gui.cursor.show(true, true);
  interfaceOpened = true;
});

mp.events.add('comeBackFromBrowser', () => {
  hud.execute(`appData.commit('others/setHudStatus', 2);`);
  hud.execute(`appData.commit('others/setModalActive', null);`);
  mp.game.ui.displayRadar(true);
  mp.game.ui.displayHud(true);
  mp.gui.cursor.show(false, false);
  interfaceOpened = false;
  showMoney = true;
  showSubtitles = true;
  if(useInventory == true) {
    mp.game.graphics.setTimecycleModifier('default');
    useInventory = false;
    // mp.events.callRemote("stopAnimation");
  }
});