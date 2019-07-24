mp.events.add("youtube_queueVideo", (player, video, title, kind) => {
  if(kind == "youtube#playlist") {
    video = video.split("?list=")[1];
  } else {
    video = video.split("?v=")[1];  
  }
  if(video == player.vars.youtubePlay) return player.notifyError("You already play this video.");
  if(player.vehicle && player.seat != -1) return player.notifyError("Only the driver of the vehicle can play music.");
  if(player.vars.usingBizz != null && Business[player.vars.usingBizz].type == 7) {
    let bizz = player.vars.usingBizz;
    if(Business[bizz].club.waitLine == true) return player.notifyError("Someone already played a song. Wait 60 seconds to change it.");
    Business[bizz].club.status = true;
    Business[bizz].club.music = {
      link: video,
      title: title,
      kind: kind
    }
    Business[bizz].club.dj = player.name;
    player.takeMoney(100);
    if(Business[bizz].owned == true) {
      Business[bizz].safe += 100;
      Business[bizz].taxes += ( 100  / 100 ) * databox[0].data.taxes.business;
    }
    setTimeout(() => {
      Business[bizz].club.waitLine = false;
    }, 60000);

    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.vars.bizzEntered != bizz) return;
      if(_player.vars.tog.youtube == false) return;
      _player.vars.youtubePlay = video;
      _player.vars.youtubeTitle = title;
      _player.vars.youtubeKind = kind;
      _player.call("youtube_play", [video, kind]);
      _player.notify(`~r~Press ~w~F3~r~ to show cursor and stop it or change volume.`);
    });
    player.pushLocalChat(`* DJ ${player.name} plays: ${title}.`, null, 'action-message');
    player.vars.usingBizz = null;
  }
  else if(player.vehicle) {
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.vehicle != player.vehicle) return;
      if(_player.vars.tog.youtube == false) return;
      _player.vars.youtubePlay = video;
      _player.vars.youtubeTitle = title;
      _player.vars.youtubeKind = kind;
      _player.call("youtube_play", [video, kind]);
      _player.notify(`~r~Press ~w~F3~r~ to show cursor and stop it or change volume.`);
    });
    player.pushLocalChat(`* ${player.name} plays on car bluetooth: ${title}.`, null, 'action-message');
  } else {
    player.vars.youtubePlay = video;
    player.vars.youtubeTitle = title;
    player.vars.youtubeKind = kind;
    player.call("youtube_play", [video, kind]);
    player.pushLocalChat(`* ${player.name} plays on his mobile: ${title}.`, null, 'action-message');
    player.notify(`~r~Press ~w~F3~r~ to show cursor and stop it or change volume.`);
  }
});

mp.events.add("youtube_stop", (player) => {
  if(player.vars.bizzEntered != null && Business[player.vars.bizzEntered].type == 7) {
    if(Business[player.vars.bizzEntered].club.status == true) {
      if(Business[player.vars.bizzEntered].club.dj == player.name) {
        mp.players.forEach((_player) => {
          if(!_player.loggedIn || _player.loggedIn == false) return;
          if(_player.vars.bizzEntered != player.vars.bizzEntered) return;
          _player.vars.youtubePlay = null;
          _player.vars.youtubeTitle = null;
          _player.call("youtube_forceStop");
        });
        let bizzId = player.vars.bizzEntered;
        Business[bizzId].club.status = false;
        Business[bizzId].club.waitLine = false;
        player.pushLocalChat(`* DJ ${player.name} stops the music.`, null, 'action-message');
      }
    }
  }
  else if(player.vehicle && player.seat == -1) {
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.vehicle != player.vehicle) return;
      _player.vars.youtubePlay = null;
      _player.vars.youtubeTitle = null;
      _player.call("youtube_forceStop");
    });
    player.pushLocalChat(`* ${player.name} stops car bluetooth.`, null, 'action-message');

  } else {
    player.vars.youtubePlay = null;
    player.vars.youtubeTitle = null;
    player.pushLocalChat(`* ${player.name} closes youtube on his mobile.`, null, 'action-message');
  }
});

mp.events.add("loadVariables", player => {
  player.vars.youtubePlay = null;
  player.vars.youtubeTitle = null;
  player.vars.youtubeKind = null;
});

mp.events.add("playerEnterVehicle", (player, vehicle, seat) => {
  if(seat != -1 && player.vars.tog.youtube == true) {
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.vehicle != player.vehicle) return;
      if(_player.seat != -1) return;
      if(_player.vars.youtubePlay == null) return;
      player.vars.youtubePlay = _player.vars.youtubePlay;
      player.call("youtube_play", [player.vars.youtubePlay, player.vars.youtubeKind]);
      player.notify(`~r~Driver was playing: ~w~${player.vars.youtubeTitle}.`);
      player.notify(`~r~Press ~w~F3~r~ to show cursor and stop it or change volume.`);
    });
  }
});