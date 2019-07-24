global.voiceChannelStatus = true;
mp.keys.bind(0x4D, true, function () {
  if (interfaceOpened == false && loggedIn == true) {
    mp.events.callRemote("toggleVoice");
  }
});

mp.keys.bind(0x4E, true, function () {
  if (interfaceOpened == false && loggedIn == true) {
    mp.events.callRemote("startTalking");
    player.voiceVolume = 1.0;
    mp.voiceChat.muted = false;
  }
});

mp.keys.bind(0x4E, false, function () {
  if (interfaceOpened == false && loggedIn == true) {
    mp.events.callRemote("stopTalking");
    mp.voiceChat.muted = true;
  }
});

mp.events.add('setVoiceToggle', (toggle) => {
  voiceChannelStatus = toggle;
  mp.game.graphics.notify(`~y~Voice Chat is now: ~w~${toggle == true ? 'Enabled' : 'Disabled'}`);
});