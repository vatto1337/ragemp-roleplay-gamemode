let vehicleRadio = null;
let playerRadio = null;

mp.events.add('render', () => {
  if(!player.vehicle) return;
  let veh = player.vehicle;
  vehicleRadio = veh.getVariable('radioIndex') == null ? 255 : veh.getVariable('radioIndex');
  if(veh.getPedInSeat(-1) == player.handle) {
    if(vehicleRadio != mp.game.invoke("0xE8AF77C4C06ADC93")) {
      vehicleRadio = mp.game.invoke("0xE8AF77C4C06ADC93");
      mp.events.callRemote('onRadioStationChanged', vehicleRadio);
    }
  } else {
    if(vehicleRadio == 255) {
      mp.game.audio.setRadioToStationName("OFF");
    }
    else if(playerRadio != vehicleRadio) {
      mp.game.invoke("0xF7F26C6E9CC9EBB8", true);
      mp.game.invoke("0xA619B168B8A8570F ", vehicleRadio); 
      playerRadio = vehicleRadio;       
    }
  }
});
