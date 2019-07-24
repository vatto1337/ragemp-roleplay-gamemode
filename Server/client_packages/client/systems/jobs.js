let jobBlip = null;
let jobCheckpoint = null;
let jobNPC = null;
let jobVehicle = null;

mp.events.add('onJobSelected', (job) => {
  mp.events.callRemote("onJobSelected", job);
});


mp.events.add('job_createVehicle', (obj) => {
  obj = JSON.parse(obj);
  let color = obj.rgb;

  jobVehicle = mp.vehicles.new(mp.game.joaat(obj.modelName), new mp.Vector3(obj.pos[0], obj.pos[1], obj.pos[2]),
  {
      color: [color, color],
      locked: false,
      engine: false,
      dimension: player.dimension
  });
  
  jobVehicle.rotation = new mp.Vector3(obj.pos[3], obj.pos[4], obj.pos[5]);

});

mp.events.add('job_destroyVehicle', () => {
  if(jobVehicle != null) {
    jobVehicle.destroy();
  }
  jobVehicle = null;
});

mp.events.add('job:attachTrailer', () => {
  player.vehicle.attachToTrailer(jobVehicle.handle, 100);
});

mp.events.add('job:checkTrucker', () => {
  mp.events.callRemote('truckerResponse', player.vehicle.isAttachedToTrailer());
});

mp.events.add('job_setBlip', (title, x,y,z) => {
  jobBlip = mp.blips.new(1, new mp.Vector3(x,y,z),
  {
      name:  title,
      scale: 1,
      color: 66,
      alpha: 255,
      shortRange: false,
      dimension: player.dimension,
  });
  jobBlip.setRoute(true);
});

mp.events.add('job_setCheckpoint', (x,y,z, range) => {

  jobCheckpoint = mp.checkpoints.new(4, new mp.Vector3(x,y,z - 1.0), range,
  {
      direction: new mp.Vector3(0, 0, 75),
      color: [ 225, 177, 44, 100 ],
      visible: true,
      dimension: player.dimension
  });

});

mp.events.add('job_destroyCheckpoint', () => {
  if(jobCheckpoint != null && jobCheckpoint) {
    jobCheckpoint.destroy();
  }
});

mp.events.add('job_createNPC', (obj) => {
  obj = JSON.parse(obj);
  jobNPC = mp.peds.new(mp.game.joaat(obj.model), new mp.Vector3(obj.pos[0], obj.pos[1], obj.pos[2]), obj.pos[3], (streamPed) => { streamPed.setAlpha(0); }, 0);
});
mp.events.add('job_npcAction:Passenger', () => {
  if(jobNPC != null && player.vehicle) {
    jobNPC.taskWarpIntoVehicle(player.vehicle.handle, 0);
  }
});
mp.events.add('job_destroyNPC', () => {
  if(jobNPC != null) {
    jobNPC.destroy();
    jobNPC = null;
  }
});

mp.events.add('entityStreamIn', (entity) => {
  if(jobNPC != null) {
    if(entity == jobNPC) {
      jobNPC.taskStartScenarioInPlace('WORLD_HUMAN_HANG_OUT_STREET', -1, false);
    }
  }
});

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
  if(jobCheckpoint != null && checkpoint == jobCheckpoint) {
    mp.events.callRemote("onJobCheckpointEntered");
  }
});

mp.events.add('job_destroyBlip', () => {
  if(jobBlip != null && jobBlip) {
    jobBlip.setRoute(false);
    jobBlip.destroy();
    jobBlip = null;
  }
});
