// Ammunation
mp.game.object.doorControl(-8873588, 18.572, -1115.495, 29.94694, false, 0, 0, 0); // Enter Left
mp.game.object.doorControl(97297972, 16.12787, -1114.606, 29.94694, false, 0, 0, 0); // Enter right
mp.game.object.doorControl(452874391, 6.81789, -1098.209, 29.94685, true, 0, 0, 0); // Shotoing Range Enter
//Clothes store 
mp.game.object.doorControl(-1922281023, -156.439, -304.4294, 39.99308, false, 0, 0, 0); // Ponsonbys Rockford Plaza Door	
mp.game.object.doorControl(-1922281023, -157.1293, -306.4341, 39.99308, false, 0, 0, 0); // Ponsonbys Rockford Plaza Door	

mp.events.add('createBizzPed', (skin, pos, dimension) => {
  pos = JSON.parse(pos);
  pos.x = parseFloat(pos.x), 
  pos.y = parseFloat(pos.y), 
  pos.z = parseFloat(pos.z), 
  pos.heading = parseFloat(pos.heading),
  dimension = parseInt(dimension);

  mp.peds.new(mp.game.joaat(`${skin}`), new mp.Vector3(pos.x, pos.y, pos.z), pos.heading, (streamPed) => {
    streamPed.setAlpha(0);
  }, dimension);
  
});

mp.events.add('bizz_saveBusiness', (bizz) => {
  mp.events.callRemote("business_createBizz", bizz);
});

mp.events.add('bizz_getCurrentPosition', () => {
  let pos = player.position;
  let angle = player.getHeading();
  hud.execute(`gui.modals[1].setCurrentPosition(${pos.x.toFixed(4)},${pos.y.toFixed(4)},${pos.z.toFixed(4)},${angle.toFixed(4)});`);

});

mp.events.add('bizz_buyItem', (cash, id, bizz) => {
  if(player.getVariable('money') < cash) {
    notifyError(`You don't have enough money.`);      
  } else {
    mp.events.callRemote("bizz_buyItem", cash, id, bizz);
  } 
});

mp.events.add('bizz_buyGun', (title, cash, weapon_name, ammo, bizz) => {
  if(player.getVariable('money') < cash) {
    notifyError(`You don't have enough money.`);      
  } else {
    mp.events.callRemote("bizz_buyGun", title, cash, weapon_name, ammo, bizz);
  } 
});