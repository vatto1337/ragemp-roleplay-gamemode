// Sa fie un interior, sa iei comenzi la telefon si apoi sa faci comanda, si sa o livrezi. (Sa  risti sa gresesti comanda)

mp.labels.new('~y~Job: Pizza Delivery~n~~w~Usage: /startwork', new mp.Vector3(1249.376, -350.094, 69.210),
{
    los: false,
    font: 4,
    drawDistance: 10,
    dimension: 0
});

mp.markers.new(1, new mp.Vector3(1249.376, -350.094, 69.210 - 1.4), 1,
{
    color: [246,205,97, 200],
    dimension: 0
});

mp.events.add('onJobSelected', (player, job) => {
  if(job == 1) {
    if(player.info.job != null) {
      if(player.vars.job.working == true) {
        mp.events.call('stopWork', player);
      }
      player.info.job = null;
    }
    player.info.job = 1;
    player.notifySuccess(`You're now hired as Pizza Delivery.`, null, 'server-message');
    player.call('createGPSBlip', [1249.376, -350.094, 69.210, `Pizza Delivery - Job`]);
  }
});

mp.events.add('startWork', player => {
  if(player.info.job == 1) {
    if(!player.IsInRange(1249.376, -350.094, 69.210, 10)) {
      player.pushChat("You can't start the job " + player.info.jobSkills[player.info.job].title + " here. Go to this location to start working.", null, 'server-message');
      player.call('createGPSBlip', [1249.376, -350.094, 69.210, `Pizza Delivery - Job`]);
      return false;
    }
    if(!player.hasItemInInventory("Driving License")) return player.pushError("You must have a driving license to do this job.");
    player.vars.job.jobStage = 1;
    player.vars.job.stageStarted = 0;
    player.vars.job.working = true;
    let color = [246,226,14];
    player.vars.job.jobVehicle =  mp.vehicles.new(mp.joaat('brioso'), new mp.Vector3(1256.257, -357.365, 68.280), {
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
    player.vars.job.jobVehicle.rotation = new mp.Vector3(0.12627486884593964, 0.012339375913143158, 345.53582763671875);
    player.putIntoVehicle(player.vars.job.jobVehicle, -1);
    player.call('setEngineState', [player.vehicle.params.engine]);
    player.vars.job.jobVehicle.numberPlate = 'Job';
    player.vars.job.jobVehicle.setVariable('fuel',player.vars.job.jobVehicle.params.fuel);
    let cpos = player.vars.job.jobVehicle.position;
    let croty = player.vars.job.jobVehicle.rotation;
    player.vars.job.jobVehicle.params.spawn = { x: cpos.x, y: cpos.y, z: cpos.z, rot: { x: croty.x, y: croty.y, z: croty.z } }
    player.vars.job.outOfVehicle = 0;
    let house = Houses[Math.floor(Math.random() * Houses.length)];
    player.call('job_setBlip', ['Deliver to: House' + house.index, house.entrance.x, house.entrance.y, house.entrance.z]);
    player.call('job_setCheckpoint', [house.entrance.x, house.entrance.y, house.entrance.z, 4]);
    player.clearSubtitles();
    player.giveSubtitle('~w~This is your first order. Go to ~y~[location]~w~ and deliver this pizza.', 60, { x: house.entrance.x, y: house.entrance.y, z: house.entrance.z });
    let dist = player.dist(new mp.Vector3(house.entrance.x, house.entrance.y, house.entrance.z)); 
    player.vars.job.payment = (99 * 1 + dist / 1000) * player.info.jobSkills[1].level;
  }
});

mp.events.add('onJobCheckpointEntered', (player) => {
  if(player.info.job == 1) {
    if(player.vars.job.working == true) {
      if(player.vars.job.stageStarted < 20) {
        mp.events.call('stopWork', player, "Suspected of using Hacks");
        player.sendMessageToAdmins(`${player.name} completed his job stage in ` + player.vars.job.stageStarted + ` seconds. (Suspected of using Hacks)`, null, 'admin-message');
        return false;
      }
      if(player.vars.job.jobStage == 1) {
        let dist = player.dist(player.vars.job.jobVehicle.position);
        if(dist > 200) return mp.events.call('stopWork', player, "You're too away from the job vehicle");
        player.vars.job.stageStarted = 0;
        player.vars.job.jobStage = 2;
        player.call('job_destroyCheckpoint');
        player.call('job_destroyBlip');
        player.call('job_setCheckpoint', [1255.706, -360.952, 68.279, 5]);
        player.call('job_setBlip', ['Job: Back to HQ', 1255.706, -360.952, 68.279]);
        player.clearSubtitles();
        player.giveSubtitle("~w~Get back to ~y~Horny's Burgers~w~ to take a new delivery.", 60);
      }
      else if(player.vars.job.jobStage == 2) {
        if(!player.vehicle || player.vehicle != player.vars.job.jobVehicle) return mp.events.call('stopWork', player, "You've lost the vehicle");
        player.call('job_destroyCheckpoint');
        player.call('job_destroyBlip');
        let payment = player.vars.job.payment;
        player.info.paycheck += payment;
        player.notify(`~y~${formatMoney(payment, 0)}$ added to paycheck.`);
        player.notify('~y~The money will be wired to your bank account at PayDay.');
        let jobIndex = 1;
        player.info.jobSkills[jobIndex].currentPoints ++;
        if(player.info.jobSkills[jobIndex].currentPoints >= player.info.jobSkills[jobIndex].neededPoints) {
          player.info.jobSkills[jobIndex].currentPoints = 0;
          player.info.jobSkills[jobIndex].neededPoints = player.info.jobSkills[jobIndex].neededPoints * 2;
          player.info.jobSkills[jobIndex].level ++;
          player.pushChat("This job's skill level upgraded to " + player.info.jobSkills[jobIndex].level + ". Congratulations!", null, 'server-message');
        }
        let house = Houses[Math.floor(Math.random() * Houses.length)];
        let dist = player.dist(new mp.Vector3(house.entrance.x, house.entrance.y, house.entrance.z)); 
        player.clearSubtitles();
        player.giveSubtitle('~w~ Go to ~y~[location]~w~ and deliver the pizza.', 60, { x: house.entrance.x, y: house.entrance.y, z: house.entrance.z });
        player.vars.job.payment = (99 * 1 + dist / 1000) * player.info.jobSkills[1].level;
        player.vars.job.stageStarted = 0;
        player.vars.job.jobStage = 1;
        player.call('job_setBlip', ['Deliver to: House' + house.index, house.entrance.x, house.entrance.y, house.entrance.z]);
        player.call('job_setCheckpoint', [house.entrance.x, house.entrance.y, house.entrance.z, 4]);
      }
    }
  }
});

mp.events.add('stopWork', (player, reason) => {
  if(player.info.job == 1 && player.vars.job.working == true) {
    player.vars.job.jobVehicle.destroy();
    player.vars.job.working = false;
    player.call('job_destroyBlip');
    player.call('job_destroyCheckpoint');
    player.clearSubtitles();
    player.pushChat('You have stopped working on this job. (' + reason + ')', null, 'server-message');
  }
});
