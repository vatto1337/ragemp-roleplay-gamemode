//To-do:
// - Daca lovesti masina, sa tipe la tine si sa te dea jos si apoi sa dispara masina.


mp.labels.new('~y~Department of Motor Vehicles~n~~w~Usage: /exam', new mp.Vector3(-828.446, -1086.113, 11.132),
{
    los: false,
    font: 4,
    drawDistance: 10,
    dimension: 0
});

mp.markers.new(1, new mp.Vector3(-828.446, -1086.113, 11.132 - 1.4), 1,
{
    color: [246,205,97, 200],
    dimension: 0
});

mp.blips.new(525, new mp.Vector3(-828.446, -1086.113, 11.132),{ name: 'Department of Motor Vehicles',  color: 45, shortRange: true,  dimension: 0});

let dmvspawns = [
    [-821.454, -1088.609, 10.485, -0.2835722267627716, -0.4513219892978668, 299.6590270996094], 
    [-818.617, -1091.009, 10.447, -0.444151908159256, -0.9982399344444275, 299.0224609375], 
    [-816.591, -1094.195, 10.390, -1.301724910736084, -1.8528965711593628, 298.6676330566406],
    [-814.765, -1097.691, 10.334, 0.46231839060783386, -1.9978301525115967, 297.5511474609375], 
    [-813.095, -1101.004, 10.327, 0.9116913080215454, -2.0444161891937256, 299.11700439453125], 
    [-811.232, -1104.564, 10.309, 0.6197792291641235, -2.7659339904785156, 299.4364013671875], 
    [-809.052, -1107.877, 10.277, 1.064461588859558, -2.71596360206604, 299.40716552734375], 
    [-807.340, -1111.115, 10.259, 1.1855008602142334, -3.1336748600006104, 298.0769348144531] 
  ];

mp.events.addCommand("exam", (player) => {
  if(player.IsInRange(-828.446, -1086.113, 11.132, 5)) {
    if(player.hasItemInInventory('Driving License')) return player.pushError("You already have a driving license.");
    if(!player.haveMoney(100)) return player.pushError("You don't have enough money (100$).");
    if(player.vars.dmv.status == true) return player.pushError("You already started this exam.");
    player.takeMoney(100);
    let spawn = dmvspawns[Math.floor(Math.random() * dmvspawns.length)];
    player.vars.dmv.vehicle =  mp.vehicles.new(mp.joaat('blista'), new mp.Vector3(spawn[0], spawn[1], spawn[2]), {
      dimension: player.dimension,
      color: [[57,172,244],[57,172,244]],
      locked: true
    });
    player.vars.dmv.vehicle.params = {
      fuel: 100,
      owner: 'State of San Andreas',
      engine: false,
      type: 'DMV Vehicle'
    }
    player.putIntoVehicle(player.vars.dmv.vehicle, -1);
    player.call('ToggleVehicleCollision', [true]);
    player.call('setEngineState', [player.vehicle.params.engine]);
    player.vars.dmv.vehicle.numberPlate = 'DMV';
    player.vars.dmv.vehicle.rotation = new mp.Vector3(spawn[3], spawn[4], spawn[5]);
    player.vars.dmv.vehicle.setVariable('fuel', player.vars.dmv.vehicle.params.fuel);
    player.vars.dmv.stage = 0;
    player.call('createDMVCheckpoint', [0]);
    player.call('createDMVBlip', [0]);
    player.vars.dmv.status = true;
    player.vars.dmv.waitVehicle = 2;
    player.call('dmv_ped');
    player.clearSubtitles();
    player.giveSubtitle("~y~Instructor:~w~ Hello " + player.name + ", today i'm going to be your instructor. ", 60);
    player.giveSubtitle("~y~Instructor:~w~ Good let's start with the basics.", 60);
    player.giveSubtitle("~y~Instructor:~w~ Start the engine first. ~r~(Press 2 on your keyboard)", 60);
  }
});

mp.events.add("loadVariables", player => {
  player.vars.dmv = {
    status: false,
    started: true,
    blip: null,
    stage: 0,
    waitVehicle: null
  }
});

mp.events.add("failedDMV", player => {
  player.call('ToggleVehicleCollision', [false]);
  player.pushChat("* You failed the driving exam by getting out of the vehicle.", null, 'server-message');
  player.clearSubtitles();
  player.giveSubtitle("Instructor screams: You can't leave the car in the middle of the street! ~r~Failed!")
  player.vars.dmv.status = false;
  player.vars.dmv.vehicle.destroy();
  player.call('destroyDMVCheckpoint');
  player.call('destroyDMVblip');
  player.call('dmv_ped_destroyInstant');
});


mp.events.add("playerQuit", (player, exitType, reason) => {
  if(player.vars && player.vars.dmv && player.vars.dmv.status == true) {
    mp.events.call("failedDMV", player);
  }
});

mp.events.add("playerTimer", (player) => {
  if(player.info && !player.hasItemInInventory('Driving License')) {
    if(player.vars && player.vars.dmv.status == false) {
      if(player.vehicle && player.seat == -1 && player.vehicleModelHaveEngine(player.vehicle.model) && player.vehicle.params.type != 'DMV Vehicle' ) {
        player.call('playerLeaveVehicle');
        player.notify("~o~You don't know how to drive."); 
        player.notify("~o~Go to DMV to get licensed!"); 
      } 
    }
  }
  if(player.vars && player.vars.dmv.status == true) {
    if(player.vehicle != player.vars.dmv.vehicle) {
      if(player.vars.dmv.waitVehicle != null) {
        player.vars.dmv.waitVehicle --;
        if(player.vars.dmv.waitVehicle < 1) {
          player.vars.dmv.waitVehicle = null;
        }
      } else {
        mp.events.call("failedDMV", player);
      }
    }
  }
});

mp.events.add("onPlayerEnterDMV", (player) => {
  if(player.vars && player.vars.dmv.status == true) {
    player.vars.dmv.stage ++;
    let c = player.vars.dmv.stage;
    if(player.vars.dmv.stage != 13) {
      player.call('destroyDMVblip');
      player.call('destroyDMVCheckpoint');
      player.call('createDMVCheckpoint', [c]);
      player.call('createDMVBlip', [c]);
      player.vehicle.repair();
    } else {
      player.clearSubtitles();
      player.giveSubtitle('~y~Instructor:~w~ You have earned your new Driving License. ~g~Congratulations!');
      player.notify(`~c~New item: ~w~Driving License.~n~~w~Now you can drive vehicles.`)
      player.giveItemToInventory(
        `Driving License`, // Title
        9, // Type
        false, // Stackable,
        1, // Quantity
        false, // Can be used
        false // Can be traded
      );
      player.call('ToggleVehicleCollision', [false]);
      player.call('destroyDMVCheckpoint');
      player.call('destroyDMVblip');
      player.call('dmv_ped_destroy');
      player.vars.dmv.vehicle.destroy();
      player.vars.dmv.status = false;
    }
  }
});
