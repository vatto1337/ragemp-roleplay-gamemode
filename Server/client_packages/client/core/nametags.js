mp.events.add('render', () => {
  mp.game.player.setHealthRechargeMultiplier(0.0);
  mp.game.ui.hideHudComponentThisFrame(6);
  mp.game.ui.hideHudComponentThisFrame(7);
  mp.game.ui.hideHudComponentThisFrame(8);
  mp.game.ui.hideHudComponentThisFrame(4);
  mp.game.ui.hideHudComponentThisFrame(9);
  mp.game.ui.hideHudComponentThisFrame(22);
  mp.game.ui.hideHudComponentThisFrame(20);
  mp.game.ui.hideHudComponentThisFrame(3);
  mp.game.ui.hideHudComponentThisFrame(2);
});

const width = 0.03;
const height = 0.0065;
const border = 0.001;
const color = [255,255,255,255];

mp.nametags.enabled = false;

mp.events.add('render', (nametags) => {
  if (loggedIn == false) return;

  const graphics = mp.game.graphics;
  const screenRes = graphics.getScreenResolution(0, 0);

  if (HideState == false) {

    nametags.forEach(nametag => {

      let [_player, x, y, distance] = nametag;
      if(_player.dimension != player.dimension) return;
      if (distance < 10 * 10) {
        // var chatText = ''; // dispare textu dupa 1 secunda, dracu stie de ce
        // if(_player.getVariable('chatText') && _player.getVariable('chatVisible') == true) {
        //   let initialText = _player.getVariable('chatText');
        //   initialText = initialText.replace("~", "");
        //   initialText = initialText.substr(0, 40);
        //   initialText = chunk(initialText, 20);
        //   initialText = initialText.join("~n~");
        //   chatText = `~n~~w~${initialText}`;
        // }
        const pos = _player.getBoneCoords(12844, 0.5, 0, 0);
        let playerName = _player.name;
        if(_player.getVariable('fakeName') != null) { playerName = _player.getVariable('fakeName'); }
        let playerText = `${_player.getVariable('voiceSpeaking') == true ? '~y~': '~w~'}[${_player.remoteId}] ${playerName}</font>`;
        graphics.drawText(playerText, [pos.x, pos.y, pos.z], {
          font: 0,
          color: [255, 255, 255, 200],
          scale: [0.30, 0.30],
          outline: true
        });
      }
    })
  }

});

const Natives = {
  SET_BLIP_CATEGORY: "0x234CDD44D996FD9A",
  SHOW_HEADING_INDICATOR_ON_BLIP: "0x5FBCA48327B914DF"
};

mp.events.add("entityStreamIn", (entity) => {
  if (entity.type === "player") {
      let color = parseInt(entity.getVariable("blipColor"));
      if (entity.blip == 0) entity.createBlip(1);

      entity.setBlipColor(isNaN(color) ? 0 : color);
      mp.game.invoke(Natives.SET_BLIP_CATEGORY, entity.blip, 7);
      mp.game.invoke(Natives.SHOW_HEADING_INDICATOR_ON_BLIP, entity.blip, true);
  }
});

mp.events.addDataHandler("blipColor", (entity, value) => {
  if (entity.type === "player") {
      let color = parseInt(value);
      entity.setBlipColor(isNaN(color) ? 0 : color);
  }
});

function chunk(str, n) {
  var ret = [];
  var i;
  var len;

  for(i = 0, len = str.length; i < len; i += n) {
     ret.push(str.substr(i, n))
  }

  return ret
};