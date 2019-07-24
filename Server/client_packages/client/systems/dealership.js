// let SimeonNPC = null;
mp.game.streaming.removeIpl("fakeint");
mp.game.streaming.requestIpl("shr_int");
mp.game.streaming.requestIpl("v_carshowroom");
mp.game.interior.enableInteriorProp(mp.game.interior.getInteriorAtCoordsWithType(-38.62, -1099.01, 27.31, "v_carshowroom"), "csr_beforeMission");
mp.game.interior.enableInteriorProp(mp.game.interior.getInteriorAtCoordsWithType(-38.62, -1099.01, 27.31, "v_carshowroom"), "shutter_closed");
mp.game.object.doorControl(1417577297, -37.33113, -1108.873, 26.7198, false, 0, 0, 0); // Park Doors (Right)
mp.game.object.doorControl(2059227086, -39.13366, -1108.218, 26.7198, false, 0, 0, 0); // Park Doors(Left)
mp.game.object.doorControl(1417577297, -60.54582, -1094.749, 26.88872, false, 0, 0, 0); // Main Doors (Right)
mp.game.object.doorControl(2059227086, -59.89302, -1092.952, 26.88362, false, 0, 0, 0); // Main Doors (Left)

let dsped0 = mp.peds.new(mp.game.joaat(`ig_siemonyetarian`), new mp.Vector3(-56.397, -1098.570, 26.422), 353.741, (streamPed) => { streamPed.setAlpha(0); }, 0);
let dsped1 = mp.peds.new(mp.game.joaat(`s_f_y_hooker_01`), new mp.Vector3(-39.412, -1097.582, 26.422), 95.135, (streamPed) => { streamPed.setAlpha(0); }, 0);
let dsped2 = mp.peds.new(mp.game.joaat(`s_f_y_hooker_02`), new mp.Vector3(-46.913, -1100.610, 26.422), 29.155193328, (streamPed) => { streamPed.setAlpha(0); }, 0);
let dsped3 = mp.peds.new(mp.game.joaat(`s_f_y_hooker_03`), new mp.Vector3(-44.477, -1092.680, 26.422), 96.100, (streamPed) => { streamPed.setAlpha(0); }, 0);

mp.events.add('entityStreamIn', (entity) => {
  if(entity == dsped1 || entity == dsped2 || entity == dsped3) {
    dsped1.taskStartScenarioInPlace('WORLD_HUMAN_PROSTITUTE_HIGH_CLASS', -1, false);
    dsped2.taskStartScenarioInPlace('WORLD_HUMAN_PROSTITUTE_HIGH_CLASS', -1, false);
    dsped3.taskStartScenarioInPlace('WORLD_HUMAN_PROSTITUTE_HIGH_CLASS', -1, false);
  }
});

mp.events.add('buyVehicleDealership', (index) => {
  mp.events.callRemote("dealership_buy", index);
});

mp.events.add('changeDealershipModel', (object) => {
  mp.events.callRemote('changeDealershipModel', object);  
});

mp.events.add('buyVehicleFromDealership', (object) => {
  mp.events.callRemote('buyVehicleFromDealership', object);  
});

mp.events.add('saveDealership', (object) => {
  mp.events.callRemote('saveDealership', object);
});

mp.events.add('leaveDealership', () => {
  mp.game.cam.renderScriptCams(false, false, 0, false, false);
  mp.events.call("comeBackFromBrowser");
  mp.events.callRemote('leaveDealership');
});

mp.events.add('prepareDealership', (dimension) => {
  showMoney = true;
  camera = mp.cameras.new("camera", new mp.Vector3(-42.90960693359375, -1099.7279052734375, 27.230844497680664), new mp.Vector3(0, 0, 30), 60);
  camera.pointAtCoord(new mp.Vector3(-27.769546508789062, -1106.1680908203125, 25.521928787231445));
  camera.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
  // Bug: Ped stays in dimension 0.
  // SimeonNPC = mp.peds.new(mp.game.joaat(`ig_siemonyetarian`), new mp.Vector3(-48.228, -1096.028, 26.422), 293.478, (streamPed) => { 
  //   streamPed.setAlpha(0); 
  //   streamPed.dimension = player.dimension; 
  // }, player.dimension);
  showMoney = true;
  showSubtitles = true;
});