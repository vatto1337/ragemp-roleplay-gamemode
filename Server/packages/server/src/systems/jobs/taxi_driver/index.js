// Todo:
// Sa fac in asa fel ca jucatorii sa poata da /fare pentru a face taximetrie.

mp.labels.new('~y~Job: Taxi Driver~n~~w~Usage: /startwork', new mp.Vector3(895.090, -179.098, 74.700),
{
    los: false,
    font: 4,
    drawDistance: 10,
    dimension: 0
});

mp.markers.new(1, new mp.Vector3(895.090, -179.098, 74.700 - 1.4), 1,
{
    color: [246,205,97, 200],
    dimension: 0
});


mp.events.add('onJobSelected', (player, job) => {
  if(job == 2) {
    if(player.info.job != null) {
      if(player.vars.job.working == true) {
        mp.events.call('stopWork', player);
      }
      player.info.job = null;
    }    
    player.info.job = 2;
    player.notifySuccess(`You're now hired as Taxi Driver.`, null, 'server-message');
    player.call('createGPSBlip', [895.090, -179.098, 74.700, `Taxi Driver - Job`]);
  }
});

mp.events.add('startWork', player => {
  if(player.info.job == 2) {
    if(!player.IsInRange(895.090, -179.098, 74.700, 10)) {
      player.pushChat("You can't start the job " + player.info.jobSkills[player.info.job].title + " here. Go to this location to start working.", null, 'server-message');
      player.call('createGPSBlip', [895.090, -179.098, 74.700, `Taxi Driver - Work`]);
      return false;
    }
    if(!player.hasItemInInventory("Driving License")) return player.pushError("You must have a driving license to do this job.");
    player.vars.job.jobStage = 1;
    player.vars.job.stageStarted = 0;
    player.vars.job.working = true;
    let spawn = vehicleTaxiSpawns[Math.floor(Math.random() * vehicleTaxiSpawns.length)];
    let color = [255,144,52];
    player.vars.job.jobVehicle = mp.vehicles.new(mp.joaat('taxi'), new mp.Vector3(spawn[0], spawn[1], spawn[2]), {
      dimension: player.dimension,
      color: [color, color],
      locked: false
    });
    player.vars.job.jobVehicle.rotation = new mp.Vector3(spawn[3], spawn[4], spawn[5]);
    player.vars.job.jobVehicle.params = {
      fuel: 100,
      owner: 'State of San Andreas',
      engine: false,
      type: 'Job Vehicle', 
      owner: player.name
    }
    player.vars.job.jobVehicle.setColor(42, 42);
    player.putIntoVehicle(player.vars.job.jobVehicle, -1);
    player.call('setEngineState', [player.vehicle.params.engine]);
    player.vars.job.jobVehicle.numberPlate = 'Job';
    player.vars.job.jobVehicle.setVariable('fuel',player.vars.job.jobVehicle.params.fuel);
    let cpos = player.vars.job.jobVehicle.position;
    let croty = player.vars.job.jobVehicle.rotation;
    player.vars.job.jobVehicle.params.spawn = { x: cpos.x, y: cpos.y, z: cpos.z, rot: { x: croty.x, y: croty.y, z: croty.z } }
    player.vars.job.outOfVehicle = 0;
    let npc = CivilliansNPC[Math.floor(Math.random() * CivilliansNPC.length)];
    player.call('job_setBlip', ['Job: Taxi Client', npc[0], npc[1], npc[2]]);
    player.call('job_setCheckpoint', [npc[0], npc[1], npc[2], 4]);
    let object = {
      model: 'csb_agent',
      pos: npc
    }
    player.call('job_createNPC', [JSON.stringify(object)]);
    player.clearSubtitles();
    player.giveSubtitle('~w~Someone needs a cab at ~y~[location]~w~. Go and pick up the client.', 60, { x: npc[0], y: npc[1], z: npc[2] });
  }
});

mp.events.add('onJobCheckpointEntered', (player) => {
  if(player.info.job == 2) {
    if(player.vars.job.working == true) {
      if(!player.vehicle || player.vehicle != player.vars.job.jobVehicle) return mp.events.call('stopWork', player, "You've lost the vehicle");
      if(player.vars.job.stageStarted < 30) {
        mp.events.call('stopWork', player, "Suspected of using Hacks");
        player.sendMessageToAdmins(`${player.name} completed his job stage in ` + player.vars.job.stageStarted + ` seconds. (Suspected of using Hacks)`, null, 'admin-message');
        return false;
      }
      if(player.vars.job.jobStage == 1) {
        player.call('job_destroyCheckpoint');
        player.call('job_destroyBlip');
        player.call('job_npcAction:Passenger');
        player.clearSubtitles();
        player.vars.job.jobStage = 2;
        player.vars.job.stageStarted = 0;
        let found = 0, distance = 0;
        CivilliansNPC.forEach((npc, index) => {
          let dist = player.dist(new mp.Vector3(npc[0], npc[1], npc[2]));
          if(dist > distance) {
            distance = dist;
            found = index;
          }
        });
        let npc = CivilliansNPC[found];
        let dist = player.dist(new mp.Vector3(npc[0], npc[1], npc[2])); 
        player.vars.job.payment = (90 * 1 + dist / 1000) * player.info.jobSkills[2].level;
        player.giveSubtitle('~w~Client needs to get to ~y~[location].~w~ Drive him there.', 60, { x: npc[0], y: npc[1], z: npc[2] });
        player.call('job_setBlip', ['Job: Client Destination', npc[0], npc[1], npc[2]]);
        player.call('job_setCheckpoint', [npc[0], npc[1], npc[2], 8]);
      }
      else if(player.vars.job.jobStage == 2) {
        player.call('job_destroyCheckpoint');
        player.call('job_destroyBlip');
        player.call('job_destroyNPC');
        player.clearSubtitles();
        let payment = player.vars.job.payment;
        player.info.paycheck += payment;
        player.notify(`~y~${formatMoney(payment, 0)}$ added to paycheck.`);
        player.notify('~y~The money will be wired to your bank account at PayDay.');
        let jobIndex = 2;
        player.info.jobSkills[jobIndex].currentPoints ++;
        if(player.info.jobSkills[jobIndex].currentPoints >= player.info.jobSkills[jobIndex].neededPoints) {
          player.info.jobSkills[jobIndex].currentPoints = 0;
          player.info.jobSkills[jobIndex].neededPoints = player.info.jobSkills[jobIndex].neededPoints * 2;
          player.info.jobSkills[jobIndex].level ++;
          player.pushChat("This job's skill level upgraded to " + player.info.jobSkills[jobIndex].level + ". Congratulations!", null, 'server-message');
        }
        player.vars.job.stageStarted = 0; 
        let npc = CivilliansNPC[Math.floor(Math.random() * CivilliansNPC.length)];
        player.call('job_setBlip', ['Job: Taxi Client', npc[0], npc[1], npc[2]]);
        player.call('job_setCheckpoint', [npc[0], npc[1], npc[2], 4]);
        let object = {
          model: 'csb_agent',
          pos: npc
        }
        player.call('job_createNPC', [JSON.stringify(object)]);
        player.giveSubtitle('~w~Next client is at ~y~[location]~w~. Go and pick up the client.', 60, { x: npc[0], y: npc[1], z: npc[2] });
        player.vars.job.jobStage = 1;
      }
    }
  }
});

mp.events.add('stopWork', (player, reason) => {
  if(player.info.job == 2 && player.vars.job.working == true) {
    player.vars.job.jobVehicle.destroy();
    player.vars.job.working = false;
    player.call('job_destroyBlip');
    player.call('job_destroyCheckpoint');
    player.call('job_destroyNPC');
    player.clearSubtitles();
    player.pushChat('You have stopped working on this job. (' + reason + ')', null, 'server-message');
  }
});

let vehicleTaxiSpawns = [
  [915.535, -170.851, 74.007, -0.44753211736679077, 2.864739418029785, 100.2274169921875],
  [917.479, -167.347, 74.156, -1.6691068410873413, 3.896448850631714, 99.70541381835938],
  [919.677, -163.721, 74.407, -0.8644842505455017, 2.224748134613037, 98.28567504882812],
  [913.932, -160.352, 74.353, -3.5400452613830566, 2.2609126567840576, 195.3765106201172],
  [911.649, -163.745, 73.975, -3.431643009185791, 4.500588417053223, 193.9409637451172],
  [899.928, -180.717, 73.466, 0.33203914761543274, 2.8437087535858154, 237.38009643554688],
  [897.836, -183.710, 73.381, 0.15592646598815918, 1.768542766571045, 237.74526977539062],
  [908.428, -183.183, 73.771, -0.9946990013122559, 0.9544326066970825, 59.7376708984375],
  [906.941, -186.461, 73.628, -2.10268497467041, 2.351876735687256, 58.481964111328125],
  [904.874, -188.820, 73.436, -1.7197872400283813, 1.8219612836837769, 60.093231201171875],
  [903.084, -191.757, 73.405, 0.21874195337295532, 0.04079774022102356, 58.70751953125]
]