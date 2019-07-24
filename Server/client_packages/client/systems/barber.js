mp.events.add("prepareBarber", (clothes) => {
  camera = mp.cameras.new('default', new mp.Vector3(0,  0,  0), new mp.Vector3(0,0,0), 40);
  mp.events.call("prepareForBrowser", `nothing`);
  showMoney = true;
  let playerPosition = mp.players.local.position;
  camera.setActive(true);
  camera.pointAtPedBone(mp.players.local.handle, 31086, 0, 0, 0, true);
  camera.setCoord(playerPosition.x + 1, playerPosition.y + 1, playerPosition.z);
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
  hud.execute(`gui.modals[2].setUsingMethod('barber');`);
  hud.execute(`gui.modals[2].setClothes('${clothes}');`);
  mp.events.call("toggleModal", 13, 'nothing');
  mp.events.callRemote("playPedAnimation", "misshair_shop@barbers" , "idle_a_cam", 1);
});