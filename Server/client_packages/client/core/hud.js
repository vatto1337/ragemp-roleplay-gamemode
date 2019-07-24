const useSpeedo = true;
const updateInterval = 500; 

const Natives = {
  IS_RADAR_HIDDEN: "0x157F93B036700462",
  IS_RADAR_ENABLED: "0xAF754F20EB5CD51A",
  SET_TEXT_OUTLINE: "0x2513DFB0FB8400FE"
};

let streetName = null;
let zoneName = null;
let isMetric = false;
let dayName = null;
let dateText = null;
let minimap = {};

function getMinimapAnchor() {
  let sfX = 1.0 / 20.0;
  let sfY = 1.0 / 20.0;
  let safeZone = mp.game.graphics.getSafeZoneSize();
  let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
  let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
  let scaleX = 1.0 / resolution.x;
  let scaleY = 1.0 / resolution.y;

  let minimap = {
    width: scaleX * (resolution.x / (4 * aspectRatio)),
    height: scaleY * (resolution.y / 5.674),
    scaleX: scaleX,
    scaleY: scaleY,
    leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
    bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
  };

  minimap.rightX = minimap.leftX + minimap.width;
  minimap.topY = minimap.bottomY - minimap.height;
  return minimap;
}

global.drawText = function(text, drawXY, font, color, scale, alignRight = false) {
  mp.game.ui.setTextEntry("STRING");
  mp.game.ui.addTextComponentSubstringPlayerName(text);
  mp.game.ui.setTextFont(font);
  mp.game.ui.setTextScale(scale, scale);
  mp.game.ui.setTextColour(color[0], color[1], color[2], color[3]);
  mp.game.invoke(Natives.SET_TEXT_OUTLINE);

  if (alignRight) {
    mp.game.ui.setTextRightJustify(true);
    mp.game.ui.setTextWrap(0, drawXY[0]);
  }

  mp.game.ui.drawText(drawXY[0], drawXY[1]);
}

setInterval(() => {
  // only do stuff if radar is enabled and visible
  if (mp.game.invoke(Natives.IS_RADAR_ENABLED) && !mp.game.invoke(Natives.IS_RADAR_HIDDEN)) {
    isMetric = mp.game.gameplay.getProfileSetting(227) == 1;
    minimap = getMinimapAnchor();
    const position = mp.players.local.position;
    let getStreet = mp.game.pathfind.getStreetNameAtCoord(position.x, position.y, position.z, 0, 0);
    zoneName = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(position.x, position.y, position.z));
    streetName = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName);
    if (getStreet.crossingRoad && getStreet.crossingRoad != getStreet.streetName) streetName += ` / ${mp.game.ui.getStreetNameFromHashKey(getStreet.crossingRoad)}`;
    let d = new Date(),
      h = d.getHours(),
      m = d.getMinutes();
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    // month = month < 10 ? "0" + month : month;
    dayName = `${h}:${m}`;
  } else {
    streetName = null;
    zoneName = null;
  }
}, updateInterval);

mp.events.add("render", () => {
  if (loggedIn == false) return;

  if (streetName && zoneName) {
    let playersText = `${player.getVariable('playersOnline')} Online ${player.getVariable('playersOnline') == 1 ? 'player' : 'players'}`;
    drawText(playersText, [minimap.rightX + 0.01, minimap.bottomY - 0.108], 4, [255, 255, 255, 200], 0.4);
    if(voiceChannelStatus == true) {
      let voiceText = `Voice ${player.getVariable('voiceSpeaking') == true ? '~g~On' : '~r~Off'}`;
      drawText(voiceText, [minimap.rightX + 0.01, minimap.bottomY - 0.130], 4, [255, 255, 255, 200], 0.4);
    }
    drawText(dayName, [minimap.rightX + 0.01, minimap.bottomY - 0.086], 4, [255, 255, 255, 200], 0.4);
    drawText('~y~' + streetName, [minimap.rightX + 0.01, minimap.bottomY - 0.065], 4, [255, 255, 255, 255], 0.4);
    drawText(zoneName, [minimap.rightX + 0.01, minimap.bottomY - 0.042], 4, [255, 255, 255, 255], 0.4);
    mp.game.graphics.drawText("www.gta-ls.ro", [0.967, 0.963], { 
      font: 4, 
      color: [255, 255, 255, 200], 
      scale: [0.5, 0.5], 
      outline: true,
      center: false
    });
  }

  if (player.vehicle && mp.game.invoke(Natives.IS_RADAR_ENABLED) && !mp.game.invoke(Natives.IS_RADAR_HIDDEN)) {

    let vehicle = player.vehicle;
    if (vehicle && vehicleModelHaveEngine(vehicle.model) && player.getVariable('seat') == -1) {
      if (vehicle.getIsEngineRunning() == true && vehicle.getVariable('fuel')) {
        let vehicleText = `${(vehicle.getSpeed() * (isMetric ? 3.6 : 2.236936)).toFixed(0)} ${(isMetric) ? "KM/H" : "MPH"}`;
        vehicleText = vehicleText + `~n~${vehicle.getVariable('fuel')}% Fuel`;
        drawText(vehicleText, [minimap.rightX - 0.003, minimap.bottomY - 0.0730], 4, [255, 255, 255, 255], 0.45, true);
      }
    }

  }

  if (showMoney == true) {
    let moneyText = `${formatMoney(player.getVariable('money'), 0)}$`;
    let bankText = `${formatMoney(player.getVariable('bank'), 0)}$`;
    let myWanted = player.getVariable('wantedLevel');
    let myPrisonTime = player.getVariable('prisonTime');
    let crimeText = ``;
    if(myWanted > 0) { crimeText = `~y~Wanted Level ${myWanted}`; }
    if(myPrisonTime > 0) { crimeText = `~y~Time left: ${myPrisonTime > 60 ? (myPrisonTime / 60).toFixed(0) + ' mins (' + (myPrisonTime).toFixed(0) + ' secs)' : (myPrisonTime).toFixed(0) + 'secs'}`}
    drawText(moneyText, [0.99, 0.01], 4, [110, 202, 110, 255], 0.75, true);
    drawText(bankText, [0.99, 0.05], 4, [104, 167, 104, 255], 0.60, true);
    drawText(crimeText, [0.99, 0.09], 4, [104, 167, 104, 220], 0.60, true);
  }

});