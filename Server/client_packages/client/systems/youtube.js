let YoutubeStarted = false; 

mp.events.add('youtube_playVideo', (link, title, kind) => {
  mp.events.callRemote("youtube_queueVideo", link, title, kind);
});

mp.events.add('youtube_stop', () => {
  mp.events.callRemote("youtube_stop");
  mp.gui.cursor.show(false, false);
  f3State = false;
  hud.execute(`appData.commit('others/setStatusF3', false);`); 
  YoutubeStarted = false;
  if(!player.vehicle) {
    mp.events.callRemote("stopAnimation");
  }
});

mp.events.add('youtube_forceStop', () => {
  hud.execute(`gui.hud.stopForceYoutube();`);
  YoutubeStarted = false;
  
});

mp.events.add('youtube_play', (videoCode, kind) => {
  hud.execute(`gui.hud.updateYoutube('${videoCode}', '${kind}');`);
  YoutubeStarted = true;
});

let f3State = false;

mp.keys.bind(0x72, true, function() {
  if(loggedIn == false) return;
  mp.gui.cursor.show(!f3State, !f3State);
  f3State = !f3State;

  hud.execute(`appData.commit('others/setStatusF3', ${f3State});`); 
});

mp.events.add('render', () => {
  if(YoutubeStarted == true) {
    mp.game.ui.hideHudComponentThisFrame(16); // Radio Stations
    if (player.vehicle) {
      mp.game.audio.setRadioToStationName("OFF");
      mp.game.audio.setUserRadioControlEnabled(false);
    }
  } else {
    mp.game.ui.showHudComponentThisFrame(16);
    mp.game.audio.setUserRadioControlEnabled(true);
  }
});