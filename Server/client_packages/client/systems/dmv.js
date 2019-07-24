var dmv_actor = null;
var dmvblip = null;
var dmvcheckpoint = null;

var dmv_route = [
  [-794.898, -1086.529, 10.446, -3.008, 0.740, 229.786],
  [-737.349, -1105.399, 10.674, -1.991, 2.617, 301.016],
  [-630.108, -861.506, 24.372, -0.226, -1.097, 355.830],
  [-621.190, -395.009, 34.204, 0.047, -2.353, 359.555],
  [-771.932, -315.105, 36.351, 1.005, -2.215, 67.261],
  [-1264.419, -62.062, 44.591, 1.647, -4.502, 64.027],
  [-1549.062, -155.748, 54.512, 4.428, -2.323, 128.969],
  [-1699.645, -357.560, 47.574, -0.339, 2.159, 106.779],
  [-1729.005, -528.565, 36.989, -1.973, -1.781, 237.527],
  [-1300.891, -886.816, 11.069, -2.232, -1.909, 212.800],
  [-1092.103, -786.544, 18.641, -2.233, -0.867, 309.087],
  [-840.946, -1003.283, 13.086, -3.217, 0.752, 206.182],
  [-806.614, -1064.109, 11.647, -3.376, 0.384, 207.406]
];

mp.events.add('createDMVCheckpoint', (c) => {
  dmvcheckpoint = mp.checkpoints.new(c == dmv_route.length - 1 ? 4 : 1, new mp.Vector3(dmv_route[c][0], dmv_route[c][1], dmv_route[c][2]), 5,
    {
      direction: c != dmv_route.length - 1 ? new mp.Vector3(dmv_route[c + 1][0], dmv_route[c + 1][1], dmv_route[c + 1][2]) : null,
      color: [206, 47, 47, 255],
      visible: true,
      dimension: 0
    });
});


mp.events.add('destroyDMVCheckpoint', () => {
  dmvcheckpoint.destroy();
});


mp.events.add('createDMVBlip', (c) => {
  dmvblip = mp.blips.new(1, new mp.Vector3(dmv_route[c][0], dmv_route[c][1], dmv_route[c][2]),
    {
      name: 'Checkpoint for DMV',
      scale: 1,
      color: 1,
      alpha: 255,
      shortRange: false,
      dimension: player.dimension,
    });
  dmvblip.setRoute(true);
});

mp.events.add('destroyDMVblip', () => {
  dmvblip.setRoute(false);
  dmvblip.destroy();
});

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
  if (checkpoint == dmvcheckpoint) {
    mp.events.callRemote("onPlayerEnterDMV");
  }
});

mp.events.add('dmv_ped', () => {
  dmv_actor = mp.peds.new(mp.game.joaat('s_m_m_ciasec_01'), new mp.Vector3(-827.975, -1086.574, 11.132), 217.416, (streamPed) => {
    streamPed.setAlpha(0);
  }, player.dimension);
  // dmv_actor.taskEnterVehicle(player.vehicle.handle, 1000, 0, 1, 1, 0);
  dmv_actor.taskWarpIntoVehicle(player.vehicle.handle, 0);
});

mp.events.add('dmv_ped_destroy', () => {
  dmv_actor.taskStartScenarioInPlace('WORLD_HUMAN_CHEERING', 0, false);
  setTimeout(() => {
    dmv_actor.destroy();
    dmv_actor = null;
  }, 5000);
});

mp.events.add('dmv_ped_destroyInstant', () => {
  dmv_actor.destroy();
  dmv_actor = null;
});