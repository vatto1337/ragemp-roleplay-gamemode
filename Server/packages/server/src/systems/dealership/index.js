mp.labels.new('~y~Premium Deluxe Motorsport~n~~w~Usage: /buyvehicles', new mp.Vector3(-57.110, -1096.947, 26.422),
{
  los: false,
  font: 4,
  drawDistance: 10,
  dimension: 0
});

mp.markers.new(1, new mp.Vector3(-57.110, -1096.947, 26.422 - 1.4), 1,
{
    color: [246,205,97,200],
    dimension: 0
});

mp.blips.new(225, new mp.Vector3(-57.110, -1096.947, 26.422), { name: 'Premium Deluxe Motorsport', color: 71, shortRange: true, dimension: 0 });

let veh1 = mp.vehicles.new(mp.joaat('zentorno'), new mp.Vector3(-37.911, -1098.888, 25.998), {
  dimension: 0,
  color: [[160,33,27], [160,33,27]],
  locked: true
});

veh1.rotation = new mp.Vector3(-0.04227445274591446, 0.06602535396814346, 121.1331787109375);

let veh2 = mp.vehicles.new(mp.joaat('sheava'), new mp.Vector3(-45.561, -1099.977, 25.853), {
  dimension: 0,
  color: [[216,182,37], [216,182,37]],
  locked: true
});

veh2.rotation = new mp.Vector3(-0.062398649752140045, -0.08102186769247055, 44.69061279296875);

let veh3 = mp.vehicles.new(mp.joaat('spectre'), new mp.Vector3(-43.858, -1094.333, 25.684), {
  dimension: 0,
  color: [[162,61,219], [162,61,219]],
  locked: true
});

veh3.rotation = new mp.Vector3(0.05466603860259056, -0.0884760245680809, 116.9122314453125);

veh1.params = { fuel: 100, owner: 'State of San Andreas', engine: false, type: 'Dealership Example' }
veh2.params = { fuel: 100, owner: 'State of San Andreas', engine: false, type: 'Dealership Example' }
veh3.params = { fuel: 100, owner: 'State of San Andreas', engine: false, type: 'Dealership Example' }
let pos = veh1.position;
let roty = veh1.rotation;
veh1.params.spawn = { x: pos.x, y: pos.y, z: pos.z, rot: { x: roty.x, y: roty.y, z: roty.z } }
pos = veh2.position;
roty = veh2.rotation;
veh2.params.spawn = { x: pos.x, y: pos.y, z: pos.z, rot: { x: roty.x, y: roty.y, z: roty.z } }
pos = veh3.position;
roty = veh3.rotation;
veh3.params.spawn = { x: pos.x, y: pos.y, z: pos.z, rot: { x: roty.x, y: roty.y, z: roty.z } }

mp.events.add("leaveDealership", player => {
  player.vars.dealership.status = false;
  player.vars.dealership.vehicle.destroy();
  player.position = player.vars.dealership.lastPosition;
  player.dimension = 0;
  player.unfreeze();
  player.clearSubtitles();
});

mp.events.add("loggedQuit", (player, exitType, reason) => {
  if(player.vars) {
    if(player.vars.dealership.status == true) {
      player.vars.dealership.vehicle.destroy();
    }
  }
});

mp.events.add("loadVariables", player => {
  player.vars.dealership = {
    status: false,
    vehicle: null,
    lastPosition: null
  }
});

mp.events.add("changeDealershipModel", (player, object) => {
  object = JSON.parse(object);
  let color1 = convertHex(object.color.color1);
  let color2 = convertHex(object.color.color2);
  player.vars.dealership.vehicle.destroy();
  player.vars.dealership.vehicle = mp.vehicles.new(mp.joaat(object.model), new mp.Vector3(-46.062, -1094.572, 25.700), {
    dimension: player.dimension,
    color: [[color1[0], color1[1], color1[2]],[color2[0], color2[1], color2[2]]],
    locked: true
  });
  player.vars.dealership.vehicle.rotation = new mp.Vector3(0.03143909201025963, 0.04579741880297661, 243.33645629882812);
});

mp.events.addCommand("buyvehicles", (player) => {
  if (player.IsInRange(-57.110, -1096.947, 26.422, 5)) {
    if (databox[3].data.status == false) return player.pushError("This dealership is disabled by administrators.");
    let dataVehicles = databox[3].data.vehicles;
    player.call('toggleModal', [4, 'nothing', JSON.stringify({ vehicles: dataVehicles, selected: 0, color: { color1: '#ffffff', color2: '#ffffff' } })]);
    player.vars.dealership.status = true;
    player.vars.dealership.lastPosition = player.position;
    player.dimension = (player.id + 355);
    player.call("prepareDealership", [player.dimension]);
    player.vars.dealership.vehicle = mp.vehicles.new(mp.joaat(dataVehicles[0].model), new mp.Vector3(-46.062, -1094.572, 25.700), {
      dimension: player.dimension,
      color: [[255,255,255],[255,255,255]],
      locked: true
    });
    player.vars.dealership.vehicle.rotation = new mp.Vector3(0.03143909201025963, 0.04579741880297661, 243.33645629882812);
    player.position = new mp.Vector3(-46.829, -1097.478, 26.422);
    player.heading = 323.919;
    player.freeze();
    player.clearSubtitles();
    player.giveSubtitle("~y~Simeon Yetarian: ~w~ I think i know what you'll like. I understand money is an issue, eh.");
    if(player.getMoney() > dataVehicles[0].price) {
      player.giveSubtitle("~y~" + player.name + ":~w~ Money isn't an issue.");
    } else {
      player.giveSubtitle("~y~" + player.name + ":~w~ Don't worry about the money, i'll get it.");
    }
  } else return player.pushError("This command can be used only at Dealership.");
});

mp.events.addCommand("editdealership", (player) => {
  if(!player.checkAdminRank(6)) return player.pushError(`You don't have permission to use this.`);
  let dataVehicles = databox[3].data;
  player.call('toggleModal', [16, 'chat', JSON.stringify({ data: dataVehicles })]);
});

mp.events.add('saveDealership', (player, object) => {
  object = JSON.parse(object);
  if(!player.checkAdminRank(6)) return player.pushError(`You don't have permission to use this.`);
  databox[3].data = object;
  SaveDatas();
  player.sendMessageToAdmins(`[Staff] ${player.name} has modified the dealership.`, null, 'admin-message');
});

mp.events.add("buyVehicleFromDealership", (player, object) => {
  object = JSON.parse(object);
  let index = object.index;
  let color1 = convertHex(object.color.color1);
  let color2 = convertHex(object.color.color2); 
  if (databox[3].data.vehicles[index] == undefined) return player.pushError("This vehicle is not available anymore.");
  let veh = databox[3].data.vehicles[index];
  if (veh.stock < 1) return player.notifyError("This model is out of stocks.");
  if(veh.goldOnly == true && player.info.premium == 0) return player.notifyError("Only premium users can buy this vehicle.");
  if(player.info.inventory.filter(item => item.type == 15).length + 1 > player.info.personalSlots) return player.notifyError("You don't have any vehicle slots available. Use /shop.")
  if(veh.goldPrice == 0) {
    if (player.getMoney() < veh.price) return player.notifyError("You don't have enough money for this " + capitalize(veh.model) + ".");
    player.takeMoney(veh.price);
  } else {
    if(!player.hasItemInInventory('Gold')) return player.notifyError("You don't have enough gold to pay for this.");
    if(!player.getItemFromInventory('Gold')[0].quantity > veh.goldPrice) return player.notifyError("You don't have enough gold to pay for this.");
    player.info.inventory.forEach((item, index) => {
      if(item.type == 16) {
        item.quantity -= veh.goldPrice;
        if(item.quantity < 1) {
          player.info.inventory.splice(index, 1);
        }
      }
    });
  }
  databox[3].data.vehicles[index].stock--;
  player.call('disableModals');
  player.call('leaveDealership');
  player.notify(`~c~New item: ~w~Vehicle Key.~n~Press F2 to acces your inventory and spawn it.`);
  let initialObject = {
    title: 'Vehicle Key',
    type: 15,
    stackable: false,
    quantity: 1,
    canBeUsed: true,
    canBeTradable: true,
    markedForTrade: false,
    price: veh.price,
    model: veh.model,
    modelName: capitalize(veh.model),
    paint: {
      color1: color1,
      color2: color2
    },
    fuel: 100,
    locked: true,
    dimension: 0,
    pos: {
      park: {
        x: null,
        y: null,
        z: null
      },
      rot: {
        x: null,
        y: null,
        z: null
      }
    },
    tuning: [],
    plate: 'No plate',
    spawned: false,
    firstSpawn: true,
    despawnSeconds: 0,
    insurance: 20,
    needMechanic: false,
    spawnedIndex: null
  }
  for (let i = 0; i < 75; i++) { 
    initialObject.tuning[i] = -1;
  }
  player.info.inventory.push(initialObject);
});
