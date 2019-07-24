// Pe viitor remorca sa fie server-side, cand gasesc o solutie la atasare.
// Sa le fac mai multe destinatii + masina in functie de skill si de tipul de marfa.

mp.labels.new('~y~Job: Trucker~n~~w~Usage: /startwork', new mp.Vector3(-126.356, -2530.900, 6.096),
{
    los: false,
    font: 4,
    drawDistance: 10,
    dimension: 0
});

mp.markers.new(1, new mp.Vector3(-126.356, -2530.900, 6.096 - 1.4), 1,
{
    color: [246,205,97, 200],
    dimension: 0
});

mp.events.add('onJobSelected', (player, job) => {
  if(job == 4) {
    if(player.info.job != null) {
      if(player.vars.job.working == true) {
        mp.events.call('stopWork', player);
      }
      player.info.job = null;
    }   
    player.info.job = 4;
    player.notifySuccess(`You're now hired as Trucker.`, null, 'server-message');
    player.call('createGPSBlip', [-126.356, -2530.900, 6.096, `Trucker - Job`]);
  }
});

mp.events.add('startWork', player => {
  if(player.info.job == 4) {
    if(!player.IsInRange(-126.356, -2530.900, 6.096, 10)) {
      player.pushChat("You can't start the job " + player.info.jobSkills[player.info.job].title + " here. Go to this location to start working.", null, 'server-message');
      player.call('createGPSBlip', [-126.356, -2530.900, 6.096, `Trucker - Work`]);
      return false;
    }
    if(!player.hasItemInInventory("Driving License")) return player.pushError("You must have a driving license to do this job.");
    player.vars.job.jobStage = 1;
    player.vars.job.stageStarted = 0;
    player.vars.job.working = true;
    let spawn = truckerVehicleSpawns[Math.floor(Math.random() * truckerVehicleSpawns.length)];
    let color = [246,226,14];
    player.vars.job.jobVehicle =  mp.vehicles.new(mp.joaat('phantom'), new mp.Vector3(spawn[0], spawn[1], spawn[2]), {
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
    player.vars.job.jobVehicle.setVariable('fuel',player.vars.job.jobVehicle.params.fuel);
    player.vars.job.outOfVehicle = 0;
    player.call('job_setBlip', ['Job: Load Materials', -525.703, -2819.802, 6.066]);
    player.call('job_setCheckpoint', [-525.703, -2819.802, 6.066, 8]);
    player.clearSubtitles();
    player.giveSubtitle('~w~Get the ~y~trailer needed~w~ for this delivery from the ~y~Port of Los Santos.', 60);
  }
});

let truckerVehicleSpawns = [
  [-108.738, -2519.161, 6.067, 0.17373888194561005, 0.25951874256134033, 235.77349853515625],
  [-110.714, -2522.004, 6.068, 0.1714956909418106, 0.22889159619808197, 234.3045654296875],
  [-112.486, -2524.680, 6.067, 0.1982620358467102, 0.29485946893692017, 236.7715301513672],
  [-114.466, -2527.281, 6.068, 0.19382831454277039, 0.2704533636569977, 235.442138671875],
  [-116.361, -2529.846, 6.067, 0.17484065890312195, 0.2532716989517212, 235.87249755859375],
  [-118.504, -2532.214, 6.067, 0.1981816589832306, 0.26706939935684204, 234.39089965820312],
  [-119.838, -2535.142, 6.067, 0.1693672090768814, 0.24286621809005737, 235.52928161621094]
];

mp.events.add('onJobCheckpointEntered', (player) => {
  if(player.info.job == 4) {
    if(player.vars.job.working == true) {
      if(player.vars.job.jobStage == 1) {
        if(!player.vehicle || player.vehicle != player.vars.job.jobVehicle) return mp.events.call('stopWork', player, "You've lost the vehicle");
        player.call('job_destroyCheckpoint');
        player.call('job_destroyBlip');
        player.vars.job.stageStarted = 0;
        player.vars.job.jobStage = 2;
        let delivery = deliveryDestinations[Math.floor(Math.random() * deliveryDestinations.length)];
        player.call('job_setBlip', ['Job: Deliver Materials', delivery[0], delivery[1], delivery[2]]);
        player.call('job_setCheckpoint', [delivery[0], delivery[1], delivery[2], 8]);
        let object = {
          pos: [-401.774, -2189.641, 9.889, -4.861441612243652, -0.022953756153583527, 6.613983154296875],
          modelName: 'trailers2'
        }
        player.call('job_createVehicle', [JSON.stringify(object)]);
        player.call('job:attachTrailer');
        let dist = player.dist(new mp.Vector3(delivery[0], delivery[1], delivery[2])); 
        player.vars.job.payment = (120 * dist / 1000) * player.info.jobSkills[4].level;
        player.clearSubtitles();
        player.giveSubtitle('~w~Deliver this trailer of materials to ~y~[location]~w~.', 60, { x: delivery[0], y: delivery[1], z: delivery[2]});
      }
      else if(player.vars.job.jobStage == 2) {
        if(!player.vehicle || player.vehicle != player.vars.job.jobVehicle) return mp.events.call('stopWork', player, "You've lost the vehicle");
        player.call('job:checkTrucker');
      }
    }
  }
});

mp.events.add('truckerResponse', (player, trailerResponse) => {
  if(trailerResponse == false) return mp.events.call('stopWork', player, "You've lost the trailer");
  player.call('job_destroyCheckpoint');
  player.call('job_destroyBlip');
  player.call('job_destroyVehicle');
  let payment = player.vars.job.payment;
  player.info.paycheck += payment;
  player.notify(`~y~${formatMoney(payment, 0)}$ added to paycheck.`);
  player.notify('~y~The money will be wired to your bank account at PayDay.');
  let jobIndex = 4;
  player.info.jobSkills[jobIndex].currentPoints ++;
  if(player.info.jobSkills[jobIndex].currentPoints >= player.info.jobSkills[jobIndex].neededPoints) {
    player.info.jobSkills[jobIndex].currentPoints = 0;
    player.info.jobSkills[jobIndex].neededPoints = player.info.jobSkills[jobIndex].neededPoints * 2;
    player.info.jobSkills[jobIndex].level ++;
    player.pushChat("This job's skill level upgraded to " + player.info.jobSkills[jobIndex].level + ". Congratulations!", null, 'server-message');
  }
  player.vars.job.stageStarted = 0;
  player.vars.job.jobStage = 1;
  player.call('job_setBlip', ['Job: Load Materials', -413.556, -2175.359, 10.386]);
  player.call('job_setCheckpoint', [-413.556, -2175.359, 10.386, 4]);
  player.clearSubtitles();
  player.giveSubtitle('~w~Go back to the ~y~Port of Los Santos~w~ for a new transport.', 60);
});

mp.events.add('stopWork', (player, reason) => {
  if(player.info.job == 4 && player.vars.job.working == true) {
    player.vars.job.jobVehicle.destroy();
    player.vars.job.working = false;
    player.call('job_destroyBlip');
    player.call('job_destroyCheckpoint');
    player.call('job_destroyVehicle');
    player.clearSubtitles();
    player.pushChat('You have stopped working on this job. (' + reason + ')', null, 'server-message');
  }
});


let deliveryDestinations = [
  [3571.413, 3665.202, 33.652, 0.31014284491539, -0.17869456112384796, 10.2481689453125], // delivery_oil (vehicle)
  [2745.408, 1642.497, 24.330, -0.3279716670513153, 0.12938322126865387, 89.51995849609375] // delivery2 (vehicle)
]