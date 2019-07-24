mp.events.add('loadVariables', player => {
  player.vars.voice = {
    status: true,
    channel: 0
  }
});

mp.events.add('playerReady', player => {

  mp.players.forEach((_player) => {
      if(player == _player) return false;
      player.disableVoiceTo(_player);
  });

});
mp.events.add('toggleVoice', player => {

  if(player.loggedIn == true) {
    if(player.vars.voice.status == true) {
      player.vars.voice.status = false;
    } 
    else {
      player.vars.voice.status = true;
    }
    player.call('setVoiceToggle', [player.vars.voice.status]);
  }
});

mp.events.add('startTalking', player => {
  if(player.loggedIn == true && player.info.muted == null && player.vars.voice.status == true) { 
    if(player.vars.voice.channel == 0)
    {
      mp.players.forEachInRange(player.position, 10, (_player) => { 
          if(player == _player) return false;
          if(_player.vars.voice.channel != 0) return false;
          if(_player.vars.voice.status != true) return false;
          if(_player.loggedIn == false) return false;
          if(_player.dimension != player.dimension) return false;
          player.enableVoiceTo(_player);
          mp.events.call("updateListeners", _player); 
        }
      );
      player.setVariable('voiceSpeaking', true);
    }
  }
});

mp.events.add('stopTalking', player => {
  if(player.loggedIn == true) {
    player.voiceListeners.forEach((listener) => {
      player.disableVoiceTo(listener);
    });
    player.setVariable('voiceSpeaking', false);
  }
});

