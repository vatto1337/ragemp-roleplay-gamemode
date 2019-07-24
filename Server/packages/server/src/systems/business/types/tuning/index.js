mp.events.add("loadVariables", player => {
  player.vars.lsCustoms = null;
});

mp.events.add("exitCustomLS", (player) => {
  if(player.vehicle && player.seat == -1) {
    let pos = player.vars.lsCustoms;
    player.vehicle.position = new mp.Vector3(pos.position.x, pos.position.y, pos.position.z);
    player.vehicle.rotation = new mp.Vector3(pos.rotation.x, pos.rotation.y, pos.rotation.z);
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.vehicle == player.vehicle) {
        _player.dimension = 0;
        _player.call('freezePlayer', [false]);
      }
    });
    player.vehicle.dimension = 0;
    player.vars.bizzEntered = null;
  }
});

mp.events.add('enterEvent', cmd_tuneVehicle);
mp.events.add('commandEnterEvent', cmd_tuneVehicle);

function cmd_tuneVehicle (player, fullText) {
  let result = false;
  Business.forEach((custom, index) => {
    if(result == true) return;
    if(custom == false) return;
    if(custom.type != 2) return;
    if(player.IsInRange(custom.buyPoint.x,custom.buyPoint.y, custom.buyPoint.z, 10)) {
      if(!player.vehicle || player.seat != -1) return player.pushError("You must use this command inside a vehicle as the driver.");
      if(custom.owned == true && custom.products < 1) return player.pushError("This business is out of products.");
      player.vars.bizzEntered = index;
      player.vars.lsCustoms = { position: player.vehicle.position, rotation: player.vehicle.rotation }
      player.call('toggleModal',[7, 'nothing', JSON.stringify(
        { 
        page: 0, 
        plate: player.vehicle.numberPlate,
        color: {
          color1: '#ffffff',
          color2: '#ffffff'
        },
        mods: [
          { 
            id: 11,
            currentMod: player.vehicle.getMod(11) == 255 || player.vehicle.getMod(11) == 0 ? -1 : player.vehicle.getMod(11),
            selected: player.vehicle.getMod(11) == 255  || player.vehicle.getMod(11) == 0 ? -1 : player.vehicle.getMod(11),
            title: 'Engine ',
            upgradeTitle: 'EMS-Improvement',
            max: 3,
            camera: 1,
            price: 200,
            increasePrice: true
          },
          { 
            id: 12,
            currentMod: player.vehicle.getMod(12) == 255 || player.vehicle.getMod(12) == 0 ? -1 : player.vehicle.getMod(12),
            selected: player.vehicle.getMod(12) == 255 || player.vehicle.getMod(12) == 0 ? -1 : player.vehicle.getMod(12),
            title: 'Brakes ',
            upgradeTitle: 'Type',
            max: 2,
            camera: 1,
            price: 300,
            increasePrice: true
          },
          { 
            id: 14,
            currentMod: player.vehicle.getMod(14) == 255 || player.vehicle.getMod(14) == 0 ? -1 : player.vehicle.getMod(14),
            selected: player.vehicle.getMod(14) == 255 || player.vehicle.getMod(14) == 0 ? -1 : player.vehicle.getMod(14),
            title: 'Horn',
            upgradeTitle: 'Option',
            max: 34,
            camera: 1,
            price: 50,
            increasePrice: false
          },
          { 
            id: 4,
            currentMod: player.vehicle.getMod(4) == 255 || player.vehicle.getMod(4) == 0 ? -1 : player.vehicle.getMod(4),
            selected: player.vehicle.getMod(4) == 255 || player.vehicle.getMod(4) == 0 ? -1 : player.vehicle.getMod(4),
            title: 'Exhaust',
            upgradeTitle: 'Type',
            max: 10,
            camera: 2,
            price: 100,
            increasePrice: false
          },
          { 
            id: 13,
            currentMod: player.vehicle.getMod(13) == 255 || player.vehicle.getMod(13) == 0 ? -1 : player.vehicle.getMod(13),
            selected: player.vehicle.getMod(13) == 255 || player.vehicle.getMod(13) == 0 ? -1 : player.vehicle.getMod(13),
            title: 'Transmission',
            upgradeTitle: 'Type',
            max: 2,
            camera: 1,
            price: 150,
            increasePrice: true
          },
          { 
            id: 15,
            currentMod: player.vehicle.getMod(15) == 255 || player.vehicle.getMod(15) == 0 ? -1 : player.vehicle.getMod(15),
            selected: player.vehicle.getMod(15) == 255 || player.vehicle.getMod(15) == 0 ? -1 : player.vehicle.getMod(15),
            title: 'Suspensions',
            upgradeTitle: 'Type',
            max: 3,
            camera: 1,
            price: 150,
            increasePrice: true
          },
          { 
            id: 0,
            currentMod: player.vehicle.getMod(0) == 255 || player.vehicle.getMod(0) == 0 ? -1 : player.vehicle.getMod(0),
            selected: player.vehicle.getMod(0) == 255 || player.vehicle.getMod(0) == 0 ? -1 : player.vehicle.getMod(0),
            title: 'Spoiler',
            upgradeTitle: 'Type',
            max: 10,
            camera: 2,
            price: 300,
            increasePrice: false
          },
          { 
            id: 1,
            currentMod: player.vehicle.getMod(1) == 255 || player.vehicle.getMod(1) == 0 ? -1 : player.vehicle.getMod(1),
            selected: player.vehicle.getMod(1) == 255 || player.vehicle.getMod(1) == 0 ? -1 : player.vehicle.getMod(1),
            title: 'Front Bumper',
            upgradeTitle: 'Type',
            max: 10,
            camera: 1,
            price: 200,
            increasePrice: false
          },
          { 
            id: 2,
            currentMod: player.vehicle.getMod(2) == 255 || player.vehicle.getMod(2) == 0 ? -1 : player.vehicle.getMod(2),
            selected: player.vehicle.getMod(2) == 255 || player.vehicle.getMod(2) == 0 ? -1 : player.vehicle.getMod(2),
            title: 'Rear Bumper',
            upgradeTitle: 'Type',
            max: 10,
            camera: 2,
            price: 200,
            increasePrice: false
          },
          { 
            id: 18,
            currentMod: player.vehicle.getMod(18) == 255 || player.vehicle.getMod(18) == -1 ? -1 : player.vehicle.getMod(18),
            selected: player.vehicle.getMod(18) == 255 || player.vehicle.getMod(18) == -1 ? -1 : player.vehicle.getMod(18),
            title: 'Turbo',
            upgradeTitle: 'Stage',
            max: 0,
            camera: 1,
            price: 1000,
            increasePrice: false
          },
          { 
            id: 40,
            currentMod: player.vehicle.getMod(40) == 255 || player.vehicle.getMod(40) == -1 ? -1 : player.vehicle.getMod(40),
            selected: player.vehicle.getMod(40) == 255 || player.vehicle.getMod(40) == -1 ? -1 : player.vehicle.getMod(40),
            title: 'Boost',
            upgradeTitle: 'Stage',
            max: 3,
            camera: 1,
            price: 800,
            increasePrice: true
          },
          { 
            id: 22,
            currentMod: player.vehicle.getMod(22) == 255 || player.vehicle.getMod(22) == 0 ? -1 : player.vehicle.getMod(22),
            selected: player.vehicle.getMod(22) == 255 || player.vehicle.getMod(22) == 0 ? -1 : player.vehicle.getMod(22),
            title: 'Xenon Headlights',
            upgradeTitle: 'Stage',
            max: 0,
            camera: 1,
            price: 800,
            increasePrice: false
          }  

        ]
      })]);

      player.vehicle.position = new mp.Vector3(-336.1090, -135.5913, 38.6496 + 0.5);
      player.vehicle.rotation = new mp.Vector3(0.0, 0.0, 240.02175903320312);
      player.vehicle.dimension = (player.id + 300);
      player.call('prepareCameraForCustom');
      player.dimension = (player.id + 300);
      mp.players.forEach((_player) => {
        if(!_player.loggedIn || _player.loggedIn == false) return;
        if(_player.vehicle != player.vehicle) return;
        if(_player == player) return;
        _player.call('freezePlayer', [true]);
        _player.dimension = (player.id + 300);
      });
      result = true;
    }
  });
}


mp.events.add("custom_fixVehicle", (player) => {
  if(player.vehicle) {
    player.vehicle.repair();
    player.takeMoney(500);
    let bizz = player.vars.bizzEntered;
    if(Business[bizz].owned == true) {
      Business[bizz].safe += 500;
      Business[bizz].taxes += ( 500  / 100 ) * databox[0].data.taxes.business;
    }
    player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"])
  }
});

global.convertHex = function(hex){
  hex = hex.replace('#','');
  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);

  result = [r , g, b];
  return result;
}

mp.events.add("custom_setVehiclePaint", (player, rgb1, rgb2) => {
  if(player.vehicle) {
    let color1 = convertHex(rgb1);
    let color2 = convertHex(rgb2);
    player.vehicle.setColorRGB(color1[0], color1[1], color1[2], color2[0], color2[1], color2[2]);
    player.vars.personalVehicles.forEach((pers, index) => {
      if(player.vehicle == pers.entity) {
        let found = false;
        player.info.inventory.forEach((item, index) => {
          if(found == true) return;
          if(item.type == 15 && item.guid == pers.id) {
            item.paint = {
              color1: [color1[0], color1[1], color1[2]],
              color2: [color2[0], color2[1], color2[2]]
            }
            found = true;
          } 
        });
      }
    });
  }
});

mp.events.add("custom_setVehiclePlate", (player, text) => {
  if(player.vehicle) {
    text = stripStuff(text);
    player.vehicle.numberPlate = text;
    player.vars.personalVehicles.forEach((pers) => {
      if(player.vehicle == pers.entity) {
        let found = false;
        player.info.inventory.forEach((item) => {
          if(found == true) return;
          if(item.type == 15 && item.guid == pers.id) {
            item.plate = text;
            found = true;
          } 
        });
      }
    });
  }
});

mp.events.add("custom_upgradeVehicle", (player, type, index, toggle) => {
  if(player.vehicle) {
    player.vehicle.setMod(parseInt(type), parseInt(index));
    if(toggle == true) {
      player.vars.personalVehicles.forEach((pers) => {
        if(player.vehicle == pers.entity) {
          let found = false;
          player.info.inventory.forEach((item) => {
            if(found == true) return;
            if(item.type == 15 && item.guid == pers.id) {
              item.tuning[parseInt(type)] = parseInt(index);
              found = true;
            } 
          });
        }
      });
    }
  }
});

mp.events.add("custom_setRotation", (player, type) => {
  if(player.vehicle) {
    if(type == 1) {
      player.vehicle.rotation = new mp.Vector3(0, 0, 240.02175903320312);
    }
    if(type == 2) {
      player.vehicle.rotation = new mp.Vector3(0, 0, 35.164947509765625);
    }
  }
});

mp.events.add("custom_takeMoney", (player, price) => {

  let bizz = player.vars.bizzEntered;
  if(Business[bizz].owned == true) {
    Business[bizz].safe += price;
    Business[bizz].taxes += ( price  / 100 ) * databox[0].data.taxes.business;
    Business[bizz].products --;
  }
  player.takeMoney(price);
  player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"])
});