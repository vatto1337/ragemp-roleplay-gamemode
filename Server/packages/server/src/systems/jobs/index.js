mp.events.add('registeredJoin', (player) => {
  player.info.job = null;
  player.info.paycheck = 0;
  player.info.jobSkills = [];

  player.info.jobSkills[0] = { title: 'Vehicle Repossession' }
  player.info.jobSkills[1] = { title: 'Pizza Delivery' }
  player.info.jobSkills[2] = { title: 'Taxi Driver' }
  player.info.jobSkills[3] = { title: 'Bus Driver' }
  player.info.jobSkills[4] = { title: 'Trucker' }
  player.info.jobSkills[5] = { title: 'Detective' }
  player.info.jobSkills[6] = { title: 'Lawyer' }
  
  player.info.jobSkills.forEach((job, index) => {
    job.level = 1;
    job.currentPoints = 0;
    job.neededPoints = 60;
  });
  
});

mp.events.add('loadVariables', player => {
  player.vars.job = {
    jobVehicle: null,
    jobTrailer: null,
    working: false,
    jobStage: null
  }
});

mp.events.addCommand('jobs', (player) => {
  if(player.IsInRange(-139.086, -632.228, 168.821, 3)) {
    let jobs = [
      { title: 'Vehicle Repossession' },
      { title: 'Pizza Delivery' },
      { title: 'Taxi Driver' },
      { title: 'Bus Driver' },
      { title: 'Trucker' },
      { title: 'Detective' },
      { title: 'Lawyer' }
    ];
    player.call('toggleModal', [18, 'chat', JSON.stringify({ selected: null, jobsList: jobs })]);
  } else return player.pushError("You must be at City Hall to use this command. Use /gps.")
});

mp.events.addCommand('startwork', (player) => {
  if(player.vars.job.working == true) return player.pushError("You have already started working.");
  if(player.vehicle) return player.pushError("You can't use this command inside a vehicle.");
  mp.events.call('startWork', player);
});


mp.events.addCommand('stopwork', (player) => {
  if(player.vars.job.working == false) return player.pushError("You have not started working yet.");
  mp.events.call('stopWork', player, 'Command');
});

mp.events.addCommand('quitjob', (player) => {
  if(player.vars.job.working == true) {
    mp.events.call('stopWork', player, 'Job Quit');
  } 
  player.info.job = null;
  player.pushChat('You just left your current job. Go to City Hall if you want to find other jobs.', null, 'server-message');
});

mp.events.add('playerTimer', (player) => {
  if(player.vars.job.working == true) {
    player.vars.job.stageStarted ++;
    // console.log('player timer:', player.vars.job.stageStarted);
    let checked = 0;
    if(player.info.job == 0 && player.vars.job.jobStage != 2) { checked = 0; }
    else if(player.info.job == 5 || player.info.job == 6) { checked = 0; }
    else { checked = 1; }
    if(checked == 1) {
      if(player.vehicle != player.vars.job.jobVehicle) {
        player.vars.job.outOfVehicle ++;
        if(player.vars.job.outOfVehicle == 15) {
          player.notify("~r~You have ~w~15~r~ seconds to get back in your job vehicle or you're gonna stop working.");
        }
        if(player.vars.job.outOfVehicle > 30) {
          mp.events.call('stopWork', player, "You've been outside the vehicle too much");
        }
      } else {
        player.vars.job.outOfVehicle = 0;
      }
    }
  }
});

mp.events.add('lockVehicle', (player) => {
  if(player.info.job != null) {
    if(player.vars.job.working == true) {
      let checked = 0;
      if(player.info.job == 0 && player.vars.job.jobStage != 2) { checked = 0; }
      else if(player.info.job == 5 || player.info.job == 6) { checked = 0; }
      else { checked = 1; }
      if(checked == 1) {
        let dist = player.vars.job.jobVehicle.position;
        if(player.IsInRange(dist.x, dist.y, dist.z, 5)) {
          player.vars.job.jobVehicle.locked = !player.vars.job.jobVehicle.locked;
          player.notify('~w~Vehicle is now ' + (player.vars.job.jobVehicle.locked == true ? '~r~locked.' : '~g~unlocked.')); 
        }
      }
    }
  }
});

mp.events.add('loggedQuit', (player) => {
  if(player.vars && player.vars.job.working == true) {
    mp.events.call('stopWork', player, 'Quit Game');
  }
});

mp.events.add('onJobVehicleDeath', (vehicle) => {
  if(vehicle.params && vehicle.params.type == 'Job Vehicle') {
    let target = vehicle.params.owner;
    target = getPlayerID(target);
    mp.events.call('stopWork', target, 'Vehicle Death');
  }
});

mp.events.add("playerEnterVehicle", (player, vehicle, seat) => { 
  if(vehicle.params && vehicle.params.type == 'Job Vehicle') {
    if(seat == -1 && vehicle.params.owner != player.name) {
      player.stopAnimation();
      player.notify("You can't steal a job vehicle.~n~Created for ~y~" + vehicle.params.owner + ".");
    }
  }
});

// let npc = CivilliansNPC[Math.floor(Math.random() * CivilliansNPC.length)];

global.CivilliansNPC = [
  [-700.186, -1087.566, 13.327, 356.258],
  [-1325.100, -1302.282, 5.037, 348.715],
  [-1452.398, -952.057, 7.473, 252.650],
  [-1673.034, -472.859, 38.483, 229.304],
  [-1558.873, -289.060, 48.271, 183.583],
  [-1535.641, -319.497, 47.676, 85.546],
  [-1495.896, -281.089, 49.745, 298.913],
  [-1411.146, -199.548, 47.247, 316.641],
  [-1395.458, -177.174, 47.337, 112.265],
  [-1413.771, -152.264, 47.707, 183.800],
  [-777.777, -124.082, 37.625, 344.048],
  [-798.251, -111.311, 37.483, 208.201],
  [-790.213, -97.958, 37.712, 302.536],
  [-485.704, -91.307, 38.777, 140.047],
  [-453.807, -106.330, 39.401, 19.471],
  [-425.051, -65.493, 43.020, 226.572],
  [-329.283, -5.788, 47.884, 162.401],
  [-319.193, -41.062, 48.245, 341.956],
  [-274.455, -59.032, 49.416, 302.099],
  [-293.586, -17.894, 48.844, 164.096],
  [-231.689, -5.000, 50.988, 84.058],
  [-42.181, -104.450, 57.717, 164.639],
  [-30.230, -140.555, 57.044, 351.452],
  [769.819, -157.086, 74.512, 154.024],
  [895.476, -248.781, 69.519, 326.745],
  [1074.293, -414.456, 67.142, 323.473],
  [1008.473, -637.329, 58.412, 255.516],
  [1349.069, -740.591, 67.165, 336.441],
  [1247.342, -349.796, 69.210, 332.952]
]