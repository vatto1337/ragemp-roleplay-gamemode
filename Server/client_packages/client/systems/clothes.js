mp.events.add("prepareClothes", (toggler, clothes) => {
  camera = mp.cameras.new('default', new mp.Vector3(0,  0,  0), new mp.Vector3(0,0,0), 40);
  mp.events.call("prepareForBrowser", `nothing`);
  showMoney = true;
	let playerPosition = mp.players.local.position;
  camera.setActive(true);
  camera.pointAtPedBone(mp.players.local.handle, 0, 0, 0, 0, true);
  camera.setCoord(playerPosition.x + 1, playerPosition.y + 1, playerPosition.z);
	mp.game.cam.renderScriptCams(true, false, 0, true, false);
	if(toggler == false) {
		hud.execute(`gui.modals[2].setUsingMethod('clothes');`);
		hud.execute(`gui.modals[2].setClothes('${clothes}');`);
		mp.events.call("toggleModal", 13, 'nothing');
	}
	mp.events.callRemote("playPedAnimation", "misshair_shop@barbers" , "idle_a_cam", 1);
	camera.setFov(80);
});

mp.events.add("clothes_applySkin", (skinName) => {
	mp.events.callRemote("clothes_applySkin", skinName);
});

mp.events.add("clothes_buySkin", (skinName, bizz) => {
	if(player.getVariable('money') < 300) {
    notifyError(`You don't have enough money.`);      
  } else {
		mp.events.callRemote("clothes_buySkin", skinName, bizz);
	}
});

mp.events.add("clothes_exit", (bizz, toggler) => {
	player.freezePosition(false);
	mp.game.cam.renderScriptCams(false, false, 0, false, false);
	mp.events.call("comeBackFromBrowser");
	mp.events.callRemote("clothes_exit", bizz);
});

mp.events.add("clothes_cancel", () => {
	player.freezePosition(false);
	mp.game.cam.renderScriptCams(false, false, 0, false, false);
	mp.events.call("comeBackFromBrowser");
	mp.events.callRemote("clothes_cancel");
});

