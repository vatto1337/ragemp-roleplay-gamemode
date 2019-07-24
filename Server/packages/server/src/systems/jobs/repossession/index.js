mp.labels.new('~y~Job: Vehicle Repossession~n~~w~Usage: /startwork', new mp.Vector3(-291.557, -430.609, 30.238),
{
    los: false,
    font: 4,
    drawDistance: 10,
    dimension: 0
});

mp.markers.new(1, new mp.Vector3(-291.557, -430.609, 30.238 - 1.4), 1,
{
    color: [246,205,97, 200],
    dimension: 0
});


mp.events.add('onJobSelected', (player, job) => {
  if(job == 0) {
    if(player.info.job != null) {
      if(player.vars.job.working == true) {
        mp.events.call('stopWork', player);
      }
      player.info.job = null;
    }    
    player.info.job = 0;
    player.notifySuccess(`You're now hired as Vehicle Repossession.`, null, 'server-message');
    player.call('createGPSBlip', [-291.557, -430.609, 30.238, `Repossession - Job`]);
  }
});

mp.events.add('startWork', player => {
  if(player.info.job == 0) {
    if(!player.IsInRange(-291.557, -430.609, 30.238, 10)) {
      player.pushChat("You can't start the job " + player.info.jobSkills[player.info.job].title + " here. Go to this location to start working.", null, 'server-message');
      player.call('createGPSBlip', [-291.557, -430.609, 30.238, `Repossession - Job`]);
      return false;
    }
    if(!player.hasItemInInventory("Driving License")) return player.pushError("You must have a driving license to do this job.");
    player.vars.job.jobStage = 1;
    player.vars.job.stageStarted = 0;
    player.vars.job.working = true;
    player.vars.job.outOfVehicle = 0;
    player.vars.job.jobVehicle = null;
    let vehicleCarJack = carJackervehicles[Math.floor(Math.random() * carJackervehicles.length)];
    let object = {
      pos: vehicleCarJack,
      modelName: carJackerModels[Math.floor(Math.random() * carJackerModels.length)] 
    }
    player.vars.job.carJacked = object;
    player.call('job_setBlip', ['Job: Vehicle requested', object.pos[0], object.pos[1], object.pos[2]]);
    player.call('job_setCheckpoint', [object.pos[0], object.pos[1], object.pos[2], 8]);
    player.call('job_createVehicle', [JSON.stringify(object)]);
    player.clearSubtitles();
    player.giveSubtitle('~w~Go to ~y~[location]~w~ and retrieve the vehicle.', 60, { x: object.pos[0], y: object.pos[1], z: object.pos[2]});
    let dist = player.dist(new mp.Vector3(object.pos[0], object.pos[1], object.pos[2])); 
    player.vars.job.payment = (150 * 1 + dist / 1000) * player.info.jobSkills[0].level;
  }
});

mp.events.add('onJobCheckpointEntered', (player) => {
  if(player.info.job == 0) {
    if(player.vars.job.working == true) {
      if(player.vars.job.stageStarted < 20) {
        mp.events.call('stopWork', player, "Suspected of using Hacks");
        player.sendMessageToAdmins(`${player.name} completed his job stage in ` + player.vars.job.stageStarted + ` seconds. (Suspected of using Hacks)`, null, 'admin-message');
        return false;
      }
      if(player.vars.job.jobStage == 1) {
        player.call('job_destroyVehicle');
        player.call('job_destroyCheckpoint');
        player.call('job_destroyBlip');
        player.clearSubtitles();
        player.giveSubtitle("~w~Drive to the ~y~marked location.", 60);
        player.vars.job.jobStage = 2;
        player.vars.job.stageStarted = 0;
        let spawn = player.vars.job.carJacked.pos;
        let color = player.vars.job.carJacked.rgb;
        player.vars.job.jobVehicle =  mp.vehicles.new(mp.joaat(player.vars.job.carJacked.modelName), new mp.Vector3(spawn[0], spawn[1], spawn[2]), {
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
        let cpos = player.vars.job.jobVehicle.position;
        let croty = player.vars.job.jobVehicle.rotation;
        player.vars.job.jobVehicle.params.spawn = { x: cpos.x, y: cpos.y, z: cpos.z, rot: { x: croty.x, y: croty.y, z: croty.z } }
        player.putIntoVehicle(player.vars.job.jobVehicle, -1);
        player.call('setEngineState', [player.vehicle.params.engine]);
        player.vars.job.jobVehicle.numberPlate = 'Stolen';
        player.vars.job.jobVehicle.rotation = new mp.Vector3(spawn[3], spawn[4], spawn[5]);
        player.vars.job.jobVehicle.setVariable('fuel', player.vars.job.jobVehicle.params.fuel);
        player.call('job_setBlip', ['Job: Vehicle destination', -357.599, -441.559, 26.455]);
        player.call('job_setCheckpoint', [-357.599, -441.559, 26.455, 8]);
      }
      else if(player.vars.job.jobStage == 2) {
        player.call('job_destroyCheckpoint');
        player.call('job_destroyBlip');
        player.vars.job.jobVehicle.destroy();
        player.vars.job.jobVehicle = null;
        player.vars.job.jobStage = 1;
        player.vars.job.stageStarted = 0;
        let payment = player.vars.job.payment;
        player.info.paycheck += payment;
        player.notify(`~y~${formatMoney(payment, 0)}$ added to paycheck.`);
        player.notify('~y~The money will be wired to your bank account at PayDay.');
        let jobIndex = 0;
        player.info.jobSkills[jobIndex].currentPoints ++;
        if(player.info.jobSkills[jobIndex].currentPoints >= player.info.jobSkills[jobIndex].neededPoints) {
          player.info.jobSkills[jobIndex].currentPoints = 0;
          player.info.jobSkills[jobIndex].neededPoints = player.info.jobSkills[jobIndex].neededPoints * 2;
          player.info.jobSkills[jobIndex].level ++;
          player.pushChat("This job's skill level upgraded to " + player.info.jobSkills[jobIndex].level + ". Congratulations!", null, 'server-message');
        }
        let vehicleCarJack = carJackervehicles[Math.floor(Math.random() * carJackervehicles.length)];
        let object = {
          pos: vehicleCarJack,
          modelName: carJackerModels[Math.floor(Math.random() * carJackerModels.length)],
          rgb: generateRGB() 
        }
        player.vars.job.carJacked = object;
        player.call('job_setBlip', ['Job: Vehicle requested', object.pos[0], object.pos[1], object.pos[2]]);
        player.call('job_setCheckpoint', [object.pos[0], object.pos[1], object.pos[2], 8]);
        player.call('job_createVehicle', [JSON.stringify(object)]);
        player.clearSubtitles();
        player.giveSubtitle('~w~Go to ~y~[location]~w~ and retrieve the next vehicle.', 60, { x: object.pos[0], y: object.pos[1], z: object.pos[2]});
        let dist = player.dist(new mp.Vector3(object.pos[0], object.pos[1], object.pos[2])); 
        player.vars.job.payment = (150 * 1 + dist / 1000) * player.info.jobSkills[0].level;
      }
    }
  }
});

mp.events.add('stopWork', (player, reason) => {
  if(player.info.job == 0 && player.vars.job.working == true) {
    if(player.vars.job.jobStage == 2) {
      player.vars.job.jobVehicle.destroy();
    }
    player.vars.job.working = false;
    player.call('job_destroyBlip');
    player.call('job_destroyCheckpoint');
    player.call('job_destroyVehicle');
    player.clearSubtitles();
    player.pushChat('You have stopped working on this job. (' + reason + ')', null, 'server-message');
  }
});


global.carJackerModels = ['tampa', 'xls', 'blista', 'felon2', 'habanero', 'huntley', 'asea', 'primo'];

let carJackervehicles = [
  [-1899.892, -333.942, 48.743, -0.008092780597507954, -0.04026466980576515, 232.22286987304688],
  [-756.598, 439.666, 99.228, 2.007988929748535, 7.194823265075684, 205.89283752441406], 
  [-564.255, 302.718, 82.670, -1.4972820281982422, 0.5212265253067017, 83.38980102539062], 
  [-428.074, -43.130, 45.732, 0.09668217599391937, -0.01429098378866911, 356.81561279296875], 
  [-1212.887, -376.843, 36.795, -0.038472820073366165, -0.014314597472548485, 27.285797119140625], 
  [-1526.440, -424.194, 34.947, 0.02236093021929264, -0.039212461560964584, 229.48768615722656],
  [-1666.386, 79.502, 63.123, -2.129822015762329, -1.5903829336166382, 171.505126953125]
];

