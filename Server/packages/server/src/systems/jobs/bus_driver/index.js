mp.labels.new('~y~Job: Bus Driver~n~~w~Usage: /startwork', new mp.Vector3(437.608, -624.514, 28.708),
{
  los: false,
  font: 4,
  drawDistance: 10,
  dimension: 0
});

mp.markers.new(1, new mp.Vector3(437.608, -624.514, 28.708 - 1.4), 1,
{
  color: [246, 205, 97, 200],
  dimension: 0
});


mp.events.add('onJobSelected', (player, job) => {
  if (job == 3) {
    if(player.info.job != null) {
      if(player.vars.job.working == true) {
        mp.events.call('stopWork', player);
      }
      player.info.job = null;
    }    
    player.info.job = 3;
    player.notifySuccess(`You're now hired as Bus Driver.`, null, 'server-message');
    player.call('createGPSBlip', [437.608, -624.514, 28.708, `Bus Driver - Job`]);
  }
});

mp.events.add('startWork', player => {
  if (player.info.job == 3) {
    if (!player.IsInRange(437.608, -624.514, 28.708, 20)) {
      player.pushChat("You can't start the job " + player.info.jobSkills[player.info.job].title + " here. Go to this location to start working.", null, 'server-message');
      player.call('createGPSBlip', [437.608, -624.514, 28.708, `Bus Driver - Work`]);
      return false;
    }
    if (!player.hasItemInInventory("Driving License")) return player.pushError("You must have a driving license to do this job.");
    player.vars.job.jobStage = 0;
    player.vars.job.stageStarted = 0;
    player.vars.job.working = true;
    let spawn = vehicleSpawnLocation[Math.floor(Math.random() * vehicleSpawnLocation.length)];
    let color = [246, 226, 14];
    player.vars.job.jobVehicle = mp.vehicles.new(mp.joaat('bus'), new mp.Vector3(spawn[0], spawn[1], spawn[2]), {
      dimension: player.dimension,
      color: [color, color],
      locked: false
    });
    player.vars.job.jobVehicle.params = {
      fuel: 100,
      owner: 'State of San Andreas',
      engine: false,
      type: 'Job Vehicle',
      owner: player.name
    }
    player.vars.job.jobVehicle.rotation = new mp.Vector3(spawn[3], spawn[4], spawn[5]);
    player.putIntoVehicle(player.vars.job.jobVehicle, -1);
    player.call('setEngineState', [player.vehicle.params.engine]);
    player.vars.job.jobVehicle.numberPlate = 'Job';
    let cpos = player.vars.job.jobVehicle.position;
    let croty = player.vars.job.jobVehicle.rotation;
    player.vars.job.jobVehicle.params.spawn = { x: cpos.x, y: cpos.y, z: cpos.z, rot: { x: croty.x, y: croty.y, z: croty.z } }
    player.vars.job.jobVehicle.setVariable('fuel', player.vars.job.jobVehicle.params.fuel);
    player.vars.job.outOfVehicle = 0;
    let bus_route = bus_routes[player.vars.job.jobStage];
    player.call('job_setBlip', ['First Station', bus_route[0], bus_route[1], bus_route[2]]);
    player.call('job_setCheckpoint', [bus_route[0], bus_route[1], bus_route[2], 4]);
    player.clearSubtitles();
    player.giveSubtitle("You've started your shift. Drive to the first ~y~bus station.", 60);
    let dist = player.dist(new mp.Vector3(bus_route[0], bus_route[1], bus_route[2]));
    player.vars.job.payment = (40 * 1 + dist / 1000) * player.info.jobSkills[3].level;
  }
});

mp.events.add('onJobCheckpointEntered', (player) => {
  if (player.info.job == 3) {
    if (player.vars.job.working == true) {
      if (player.vars.job.stageStarted < 5) {
        mp.events.call('stopWork', player, "Suspected of using Hacks");
        player.sendMessageToAdmins(`${player.name} completed his job stage in ` + player.vars.job.stageStarted + ` seconds. (Suspected of using Hacks)`, null, 'admin-message');
        return false;
      }
      player.call('job_destroyCheckpoint');
      player.call('job_destroyBlip');
      player.vars.job.stageStarted = 0;
      player.vars.job.jobStage++;
      if (player.vars.job.jobStage == bus_routes.length) {
        player.vars.job.jobStage = 0;
        let payment = 500 * player.info.jobSkills[3];
        player.info.paycheck += payment;
        player.notify(`~y~${formatMoney(payment, 0)}$ added to paycheck.`);
        player.notify('~y~The money will be wired to your bank account at PayDay.');
        let jobIndex = 3;
        player.info.jobSkills[jobIndex].currentPoints++;
        if (player.info.jobSkills[jobIndex].currentPoints >= player.info.jobSkills[jobIndex].neededPoints) {
          player.info.jobSkills[jobIndex].currentPoints = 0;
          player.info.jobSkills[jobIndex].neededPoints = player.info.jobSkills[jobIndex].neededPoints * 2;
          player.info.jobSkills[jobIndex].level++;
          player.pushChat("This job's skill level upgraded to " + player.info.jobSkills[jobIndex].level + ". Congratulations!", null, 'server-message');
        }
      }
      let bus_route = bus_routes[player.vars.job.jobStage];
      player.call('job_setBlip', ['Bus Station ' + player.vars.job.jobStage, bus_route[0], bus_route[1], bus_route[2]]);
      player.call('job_setCheckpoint', [bus_route[0], bus_route[1], bus_route[2], 4]);
      player.clearSubtitles();
      player.giveSubtitle(`${player.vars.job.jobStage == bus_routes.length - 1 ? 'final station' : 'next station'} is at ~y~[location] (${player.vars.job.jobStage + '/' + bus_routes.length})`, 60, { x: bus_route[0], y: bus_route[1], z: bus_route[2] });

    }
  }
});

mp.events.add('stopWork', (player, reason) => {
  if (player.info.job == 3 && player.vars.job.working == true) {
    player.vars.job.jobVehicle.destroy();
    player.vars.job.working = false;
    player.call('job_destroyBlip');
    player.call('job_destroyCheckpoint');
    player.clearSubtitles();
    player.pushChat('You have stopped working on this job. (' + reason + ')', null, 'server-message');
  }
});

let bus_routes = [
  [400.360, -932.247, 29.365, 0.06832011789083481, 3.006943702697754, 177.8155517578125],
  [240.073, -1128.163, 29.258, 2.3465521335601807, 0.38101324439048767, 89.3184814453125],
  [78.335, -1466.767, 29.240, 1.5689013004302979, 2.0544965267181396, 138.3316650390625],
  [-107.187, -1688.211, 29.259, 1.436134696006775, 1.7833129167556763, 140.56402587890625],
  [-1013.572, -2473.941, 20.118, 1.3090293407440186, 2.2705914974212646, 149.04180908203125],
  [-273.437, -1841.607, 27.296, -3.5774831771850586, 3.0926201343536377, 283.1205139160156],
  [330.354, -1718.512, 29.319, -1.49311101436615, 1.553489327430725, 230.60787963867188],
  [532.468, -1577.286, 29.180, -1.9344122409820557, -2.284412384033203, 318.828369140625],
  [460.101, -1127.859, 29.332, 3.2185630798339844, -0.008983061648905277, 90.205810546875],
  [407.921, -913.484, 29.350, -0.026690920814871788, -3.1158974170684814, 357.7442626953125],
  [466.973, -631.800, 28.496, 0.08638101071119308, 0.03826450556516647, 354.1318359375]
]

let vehicleSpawnLocation = [
  [396.722, -655.086, 28.496, 0.0007100795628502965, -0.025928661227226257, 270.536376953125],
  [397.464, -649.530, 28.496, 0.0006723000551573932, 0.04116472601890564, 270.7640380859375],
  [396.841, -644.124, 28.496, 0.00011304747022222728, -0.019313199445605278, 271.2867431640625],
  [428.947, -640.860, 28.497, -0.04969261214137077, -0.09251465648412704, 180.92445373535156]
];