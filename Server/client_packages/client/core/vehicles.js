var signal1, signal2, comboSpam = false, comboSpamTimer;


mp.game.vehicle.defaultEngineBehaviour = false;

mp.keys.bind(0x32, true, function() {
	if(interfaceOpened == false && loggedIn == true) {
		if (player.vehicle) {
			mp.events.callRemote("VehicleEngine");	
		}
	}
});

mp.events.add('setEngineState', (status) => {
	if(player.vehicle) {
		player.vehicle.setEngineOn(status, false, !status);
		player.vehicle.setUndriveable(!status);
	}
});

mp.events.add('render', () => { // G KEY
	const controls = mp.game.controls;
	if(interfaceOpened == false && loggedIn == true) {
		controls.disableControlAction(0, 58, true);		
		if (controls.isDisabledControlJustPressed(0, 58)) {
			let position = player.position;
			let vehHandle = mp.game.vehicle.getClosestVehicle(position.x, position.y, position.z, 5, 0, 70);
			let vehicle = mp.vehicles.atHandle(vehHandle);
			if (vehicle && vehicle.isAnySeatEmpty() && vehicle.getSpeed() < 5) {
				for(let i = 0; i < 3; i++) {
					if(vehicle.isSeatFree(i)) {
						player.taskEnterVehicle(vehicle.handle, 5000, i, 2, 1, 0);
						return true;
					}
				}
			}
		}
	}
});

mp.events.add('playerLeaveVehicle', () => {
	if(player.vehicle) {
	  player.taskLeaveVehicle(player.vehicle.handle, 0);
	}
});


mp.events.add('setDoorShut', (vehicle, id, toggle) => {
	vehicle.setDoorShut(id, toggle);
	if(id == 4) {
		vehicle.hood = toggle;
	}
	if(id == 5) {
		vehicle.trunk = toggle;
	}
});

mp.events.add('setDoorOpen', (vehicle, id, toggle) => {
	vehicle.setDoorOpen(id, toggle, true);
	if(id == 4) {
		vehicle.hood = toggle;
	}
	if(id == 5) {
		vehicle.trunk = toggle;
	}
});

mp.keys.bind(0x33, true, function () { // Tasta 3
	if(interfaceOpened == false && loggedIn == true) {
		if(player.vehicle) {
			if (player.vehicle.hood) {
				// player.vehicle.hood = false;
				mp.events.callRemote("setDoorShut", player.vehicle, 4, false);
			} else {
				// player.vehicle.hood = true;
				mp.events.callRemote("setDoorOpen", player.vehicle, 4, true);
			}
		}
	}
});

mp.keys.bind(0x34, true, function () { // Tasta 4
	if(interfaceOpened == false && loggedIn == true) {
		if(player.vehicle) {
			if (player.vehicle.trunk) {
				// player.vehicle.trunk = false;
				mp.events.callRemote("setDoorShut", player.vehicle, 5, false);
			} else {
				// player.vehicle.trunk = true;
				mp.events.callRemote("setDoorOpen", player.vehicle, 5, true);
			}
		}
	}
});

mp.keys.bind(0x35, true, function () { // Tasta 5
	if(interfaceOpened == false && loggedIn == true) {
		if(player.vehicle) {
			let roofState = mp.players.local.vehicle.getConvertibleRoofState();
			if (roofState === 0) {
				mp.players.local.vehicle.lowerConvertibleRoof(false);
			} 
			else if (roofState === 2) {
				mp.players.local.vehicle.raiseConvertibleRoof(false);
			}	
		}
	}
});

