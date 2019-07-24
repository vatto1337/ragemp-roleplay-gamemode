const table = require("./schema.js");

global.Houses = [];

let houseQuery = table.find({}, null, { sort: 'index'}, function (err, house) {
  if (err) return console.log(err);
});

houseQuery.then((houses) => {

  let loadQuery = new Promise(function(resolve, reject) {
    houses.forEach((house, index) => {
      let object = {
        index: index,
        id: house._id,
        entrance: house.entrance,
        exit: house.exit,
        owner: house.owner,
        owned: house.owned,
        rentable: house.rentable,
        rentPrice: house.rentPrice,
        price: house.price,
        level: house.level,
        upgradeLevel: house.upgradeLevel,
        taxes: house.taxes,
        safe: house.safe,
        marker: null,
        text3D: null,
        blip: null
      };
      Houses.push(object);
    });
    resolve(Houses.length);
  });

  loadQuery.then((nr) => {
    console.log(`[Houses] ${nr} loaded.`);
    Houses.forEach((house, index) => {
      UpdateHouse3D(index);
      SaveHouse(index);
    });
  });

});

mp.events.add("playerTimer", (player) => {
  // if(player.vars && player.vars.houseEntered == null) {
  //   let pos = player.position;
  //   if(pos == player.vars.AfkPosition) {
  //     player.vars.AfkTime ++;
  //     if(player.vars.AfkTime > 60) {
  //       player.vars.Afk = true;
  //       player.setVariable('Afk', true);
  //       player.setVariable('AfkTime', player.vars.AfkTime);
  //     }
  //     // if(player.vars.AfkTime == 3600) {
  //     //   player.pushChatToAll(`AdmBot kicked ${player.name}. ( Reason: Afk more than 60 minutes outside house )`, null, 'admin-message');
  //     //   player.kick();
  //     // }
  //   } else {
  //     player.setVariable('Afk', false);
  //     player.vars.Afk = false;
  //     player.vars.AfkTime = 0;
  //     player.vars.AfkPosition = pos;
  //   }
  // }
  if(player.vars && player.vars.houseEntered != null) {
    let h = player.vars.houseEntered;
    if(player.health < 50) {
      player.health += 0.50 * Houses[h].upgradeLevel;
    }
  }
});

mp.events.addCommand("house", (player, fullText, param1, param2, param3) => {
  if(!player.hasItemInInventory('House Contract')) return player.pushError("You don't own a house.");
  let HouseIndex = null;
  let ownedHouses = player.getItemFromInventory('House Contract');
  ownedHouses.forEach((house_owned, index) => {
    if(HouseIndex != null) return;
    let h = house_owned.house_id;
    if(player.IsInRange(Houses[h].entrance.x, Houses[h].entrance.y, Houses[h].entrance.z, 3) || player.vars.houseEntered == h) {
      if(Houses[h].owner == player.name) {
        HouseIndex = h;
      }
    }
  });
  if(HouseIndex == null) return player.pushError("This command must be used inside the house you want to manage.");
  if(param1 == undefined) return player.pushExample('/house [stats, rent, upgrade, evict, withdraw, deposit, tax]');
  if(param1 == 'stats') {
    let count = 0;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player == player) return;
      let houseKeys = _player.getItemFromInventory('House Key');
      houseKeys.forEach((hkey, index) => {
        if(hkey.house_id == HouseIndex) {
          count ++;
        }
      });
    });
    player.pushChat('[House Stats]', null, 'house-message');
    player.pushChat(`* Safe balance: ${player.formatMoney(Houses[HouseIndex].safe, 0)}$`, null, 'house-message');
    player.pushChat(`* Players renting here: ${count} online.`, null, 'house-message');
    player.pushChat(`* Upgrade level: ${Houses[HouseIndex].upgradeLevel}/4`, null, 'house-message');
    player.pushChat(`* Unpaid taxes: ${formatMoney(Houses[HouseIndex].taxes,0)}$`, null, 'house-message');
    if(Houses[HouseIndex].rentable == true) {
      player.pushChat(`* Renting: ${player.formatMoney(Houses[HouseIndex].rentPrice,0)}$`, null, 'house-message');
    } else {
      player.pushChat(`* Renting: No.`, null, 'house-message');
    }
    player.pushChat('---------', null, 'house-message');
  }
  else if(param1 == 'rent') {
    if(param2 == undefined) return player.pushExample('/house rent [Value]'), player.pushInfo("A value greater than 0 will set the price, while value 0 will disable the rent.");
    param2 = parseInt(param2);
    if(param2 > 300 || param2 < 0) return player.pushError('Rent price must be between 0$ - 300$.');
    Houses[HouseIndex].rentPrice = param2;
    if(param2 > 0) { Houses[HouseIndex].rentable = true; }
    if(param2 == 0) { Houses[HouseIndex].rentable = false; }
    UpdateHouse3D(HouseIndex);
    SaveHouse(HouseIndex);
    if(param2 > 0) {
      player.pushChat(`${player.name} has changed the rent of the house ${HouseIndex} to ${player.formatMoney(param2, 0)}$`, null, 'house-message');
    } else {
      player.pushChat(`House ${HouseIndex} is ${Houses[HouseIndex].rentable == true ? 'now renting.' : 'not renting anymore.'}`, null, 'house-message');
    }
   
  }
  else if(param1 == 'upgrade') {
    if(Houses[HouseIndex].upgradeLevel == 4) return player.pushError('This house is already upgraded to the max level.');
    if(player.getMoney() < (1000 * Houses[HouseIndex].upgradeLevel + 1)) return player.pushError(`You don't have enough money (${player.formatMoney((Houses[HouseIndex].upgradeLevel + 1) * 10000, 0)})`);
    Houses[HouseIndex].upgradeLevel ++;
    player.takeMoney(1000 * Houses[HouseIndex].upgradeLevel);
    UpdateHouse3D(HouseIndex);
    SaveHouse(HouseIndex);
    player.pushChat(`House ${HouseIndex} is now upgraded to level ${Houses[HouseIndex].upgradeLevel}.`, null, 'house-message')
 
  }
  else if(param1 == 'evict') {
    if(param2 == undefined) return player.pushExample('/house evict [Player ID / Name]');
    param2 = getPlayerID(param2);  
    if(!param2 || param2.loggedIn == false) return player.pushError(`Invalid Player ID / Name.`);
    if(!param2.hasItemInInventory('House Key')) return player.pushError("This player is not renting.");
    if(param2.getItemFromInventory('House Key')[0].house_id != HouseIndex) return player.pushError('This player is not staying inside your house as a renter.');
    if(param2 == player) return player.pushError("You can't evict yourself.");
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.hasItemInInventory('House Key') && _player.getItemFromInventory('House Key')[0].house_id == HouseIndex || _player == p) {
        _player.pushChat(`${player.name} has evicted ${param2.name} from his house.`, null, 'house-message');
      }
    });
    UpdateHouse3D(HouseIndex);
    SaveHouse(HouseIndex);
    param2.removeItemByName('House Key');
    param2.info.spawn = 0;
  }
  else if(param1 == 'withdraw') {
    if(param2 == undefined) return player.pushExample('/house withdraw [Value]');
    param2 = parseInt(param2);
    if(param2 > Houses[HouseIndex].safe || param2 < 1) return player.pushError('Invalid value. Check balance first with /house stats.');
    Houses[HouseIndex].safe -= param2;
    player.giveMoney(param2);
    player.pushChat(`You took ${player.formatMoney(param2, 0)}$ from the house.`, null, 'house-message');
    SaveHouse(HouseIndex);
  }
  else if(param1 == 'deposit') {
    if(param2 == undefined) return player.pushExample('/house deposit [Value]');
    param2 = parseInt(param2);
    if(param2 > player.getMoney() || param2 < 1) return player.pushError("You don't have enough money.");
    Houses[HouseIndex].safe += param2;
    player.takeMoney(param2);
    player.pushChat(`You put ${player.formatMoney(param2, 0)}$ in the house.`, null, 'house-message');
    SaveHouse(HouseIndex);
  }
  else if(param1 == 'tax') {
    if(Houses[HouseIndex].taxes < 1) return player.pushError("You don't have any unpaid taxes for this house.");
    if(Houses[HouseIndex].safe < Houses[HouseIndex].taxes) return player.pushError("There is not enough money in the house to pay for it. Use /house deposit first.");
    Houses[HouseIndex].safe -= Houses[HouseIndex].taxes;
    databox[0].data.safe += Houses[HouseIndex].taxes;
    Houses[HouseIndex].taxes = 0;
    player.pushChat("You have paid the house unpaid taxes.", null, 'house-message');
    SaveHouse(HouseIndex);
  }
});

mp.events.addCommand("rentroom", (player, fullText) => {
  let result = false;
  Houses.forEach((h, index) => {
    if(h == false) return;
    if(result == true) return;
    if(player.IsInRange(h.entrance.x, h.entrance.y, h.entrance.z, 3)) {
      if(player.hasItemInInventory('House Key')) return player.pushError("You're already renting a place somewhere.");
      if(player.hasItemInInventory("House Contract")) return player.pushError("You can't rent here because you own a house.");
      player.giveItemToInventory(
        `House Key`, // Title
        12, // Type
        false, // Stackable,
        1, // Quantity
        false, // Can be used
        false, // Can be traded,
        { house_id: index }
      );   
      player.info.spawn = 1;
      player.info.houseSpawn = h.index;
      player.pushChat("You're now renting a room here.", null, 'house-message');
      player.pushChat("Destroy the House Key from inventory when you want to leave.", null, 'house-message');
      player.pushChat("Type /enter to get inside.", null, 'house-message');
      player.notify(`~c~New item: ~w~House Key.~n~You're going to respawn here.`);
    }
  });
});

mp.events.add('onItemDelete', (player, item) => {
  if(item.type == 12) {
    player.notifyInfo("You're not renting anymore.");
    player.info.spawn = 0;
    player.info.houseSpawn = null;
  }
  if(item.type == 13) {
    let houseIndex = item.house_id;
    if(Houses[houseIndex].owner == player.name) {
      Houses[houseIndex].rentable = false;
      Houses[houseIndex].owned = false;
      Houses[houseIndex].owner = 'No-One';
      UpdateHouse3D(houseIndex);
      SaveHouse(houseIndex);
      player.notifyError(`House Contract ${houseIndex} have been removed from inventory.`);
    }
    player.info.spawn = 0;
    player.info.houseSpawn = null;
    if(player.hasItemInInventory('House Contract')) {
      player.info.spawn = 1;
      player.info.houseSpawn = player.getItemFromInventory('House Contract')[0].house_id;
    }
  }
});

mp.events.addCommand("ahouse", (player, fullText, param1, param2, param3, param4) => {
  if(!player.checkAdminRank(7)) return player.pushError(`You don't have permission to use this.`);
  if(param1 == undefined) return player.pushExample('/ahouse [goto, stats, create, delete, resell, set, entrance, interior]');
  if(param1 == 'stats') {
    if(param2 == undefined ) return player.pushExample('/ahouse stats [House ID]');
    param2 = parseInt(param2);
    if(Houses[param2] == undefined) return player.pushError('Invalid House ID!');
    let count = 0;
    mp.players.forEach((_player) => {
      if(!_player.loggedIn || _player.loggedIn == false) return;
      if(_player.getItemFromInventory('House Key')[0].house_id == param2) {
        count ++;
      }
    });
    player.pushChat(`[House ${param2} Stats]`, null, 'house-message');
    player.pushChat(`* Safe balance: ${formatMoney(Houses[param2].safe, 0)}$`, null, 'house-message');
    player.pushChat(`* Players renting here: ${count} online.`, null, 'house-message');
    player.pushChat(`* Owner: ${Houses[param2].owner}`, null, 'house-message');
    player.pushChat(`* Upgrade level: ${Houses[param2].upgradeLevel}/4`, null, 'house-message');
    player.pushChat(`* Unpaid taxes: ${formatMoney(Houses[param2].taxes,0)}$`, null, 'house-message');
    if(Houses[param2].rentable == true) {
      player.pushChat(`* Renting: ${player.formatMoney(Houses[param2].rentPrice,0)}$`, null, 'house-message');
    } else {
      player.pushChat(`* Renting: No.`, null, 'house-message');
    }
    player.pushChat('---------', null, 'house-message');
  }
  else if(param1 == 'create') {
    if(param2 == undefined || param3 == undefined || param4 == undefined) return player.pushExample('/ahouse create [Interior ID: 0 - 7] [Price] [Level]');
    param2 = parseInt(param2), param3 = parseInt(param3), param4 = parseInt(param4);
    let Interiors = [
      [266.1314, -1007.3995, -101.0086],
      [346.5525, -1012.7350, -99.1962],
      [-17.2094, -588.4208, 90.1148],
      [-30.6847, -595.4903, 80.0309],
      [-1452.4143, -540.1414, 74.0443],
      [-1451.5750, -524.0780, 56.9290],
      [-912.5695, -365.1822, 114.2748],
      [-1289.8276, 448.9533, 97.9025]
    ];
    if(param2 > Interiors.length -1 || param2 < 0) return player.pushError('Interior id must be between 0-' + (Interiors.length -1)); 
    let exit = player.position;
    
    let houseIndex = null;
    Houses.forEach((hx, index) => {
      if(houseIndex != null) return;
      if(hx == false) {
        houseIndex = index;
      }
    });

    let House = {
      index: houseIndex == null ? (Houses.length - 1) + 1 : houseIndex,
      entrance: {
        x: exit.x,
        y: exit.y,
        z: exit.z
      },
      exit: {
        x: Interiors[param2][0],
        y: Interiors[param2][1],
        z: Interiors[param2][2]
      },
      owner: 'No-One',
      owned: false,
      rentable: false,
      rentPrice: 0,
      price: param3,
      level: param4,
      upgradeLevel: 1,
      safe: 0
    }

    const houseDoc = new table(House);
    houseDoc.save((err, doc) => {
      if(err) return console.log('House save error: ' + err);
      if(houseIndex == null) {
        Houses.push(House);
        Houses[Houses.indexOf(House)].index = Houses.indexOf(House);
        Houses[Houses.indexOf(House)].id = doc._id;
        Houses[Houses.indexOf(House)].marker = null;
        Houses[Houses.indexOf(House)].text3D = null;
        Houses[Houses.indexOf(House)].blip = null;
        UpdateHouse3D(Houses.indexOf(House));
      } else {
        Houses[houseIndex] = House;
        Houses[houseIndex].index = houseIndex;
        Houses[houseIndex].id = doc._id;
        Houses[houseIndex].marker = null;
        Houses[houseIndex].text3D = null;
        Houses[houseIndex].blip = null;
        UpdateHouse3D(houseIndex);
      }
      player.sendMessageToAdmins(`[Staff] ${player.name} created a house. (Level ${param4}, Price: ${formatMoney(param3, 0)}$)`, null, 'admin-message');
    });
  }
  else if(param1 == 'delete') {
    if(param2 == undefined ) return player.pushExample('/ahouse delete [House ID]');
    param2 = parseInt(param2);
    if(Houses[param2] == undefined) return player.pushError('Invalid House ID!');
    table.findOne({ _id: Houses[param2].id }, function(err, house) {
      if(house == null) {
        return player.pushError("I can't find this house in database.");
      } else {
        player.sendMessageToAdmins(`[Staff] ${player.name} deleted house ${param2}.`, null, 'admin-message');
        player.pushChat('Warning: You must create now a house to replace this one you have deleted.', null, 'admin-message');
        mp.players.forEach((_player) => {
          if(!_player.loggedIn || _player.loggedIn == false) return;
          if(_player.vars.houseEntered == param2) {
            _player.vars.houseEntered = null;
            _player.dimension = 0;
            _player.position = new mp.Vector3(Houses[param2].entrance.x, Houses[param2].entrance.y, Houses[param2].entrance.z); 
          }
        });
        DestroyHouse3D(param2);
        house.remove();
        Houses[param2] = false;
        saveHouses();
      }
      if(err) return console.log('House delete error: ' + err);
    });
  }
  else if(param1 == 'resell') {
    if(param2 == undefined ) return player.pushExample('/ahouse resell [House ID]');
    param2 = parseInt(param2);
    if(Houses[param2] == undefined) return player.pushError('Invalid House ID!');
    if(Houses[param2].owned == false) return player.pushError('This house already is for sale.');
    Houses[param2].owned = false;
    Houses[param2].owner = 'No-One';
    Houses[param2].safe = 0;
    Houses[param2].taxes = 0;
    player.sendMessageToAdmins(`[Staff] ${player.name} put house ${param2} for sale.`, null, 'admin-message');
    SaveHouse(param2);
    UpdateHouse3D(param2);
  }
  else if(param1 == 'set') {
    if(param2 == undefined  || param3 == undefined || param4 == undefined) return player.pushExample('/ahouse set [House ID] [Price] [Level]');
    param2 = parseInt(param2), param3 = parseInt(param3), param4 = parseInt(param4);
    if(Houses[param2] == undefined) return player.pushError('Invalid House ID!');
    Houses[param2].price = param3;
    Houses[param2].level = param4;
    UpdateHouse3D(param2);
    SaveHouse(param2);
    player.sendMessageToAdmins(`[Staff] ${player.name} updated house ${param2} (Price: ${formatMoney(param3,0)}$ - Level: ${param4})`, null, 'admin-message');
  }
  else if(param1 == 'goto') {
    if(param2 == undefined) return player.pushExample('/ahouse goto [House ID]');
    param2 = parseInt(param2);
    if(Houses[param2] == undefined) return player.pushError('Invalid house id.');
    player.position = new mp.Vector3(Houses[param2].entrance.x, Houses[param2].entrance.y, Houses[param2].entrance.z);
    player.notify('~r~Teleported to house ' + param2);
  }
  else if(param1 == 'entrance') {
    if(param2 == undefined) return player.pushExample('/ahouse entrance [House ID]');
    param2 = parseInt(param2);
    if(Houses[param2] == undefined) return player.pushError('Invalid house id.');
    let pos = player.position;
    Houses[param2].entrance = {
      x: pos.x,
      y: pos.y,
      z: pos.z
    }
    player.sendMessageToAdmins(`[Staff] ${player.name} changed the entrance of house ${param2}.`, null, 'admin-message');
    UpdateHouse3D(param2);
    SaveHouse(param2);
  }
  else if(param1 == 'interior') {
    if(param2 == undefined || param3 == undefined) return player.pushExample('/ahouse interior [House ID] [Interior ID]');
    param2 = parseInt(param2), param3 = parseInt(param3);
    if(Houses[param2] == undefined) return player.pushError('Invalid house id.');
    let Interiors = [
      [266.1314, -1007.3995, -101.0086],
      [346.5525, -1012.7350, -99.1962],
      [-17.2094, -588.4208, 90.1148],
      [-30.6847, -595.4903, 80.0309],
      [-1452.4143, -540.1414, 74.0443],
      [-1451.5750, -524.0780, 56.9290],
      [-912.5695, -365.1822, 114.2748],
      [-1289.8276, 448.9533, 97.9025]
    ];
    if(parseInt(param3) > Interiors.length -1 || parseInt(param3) < 0) return player.pushError('Interior id must be between 0-' + (Interiors.length -1)); 
    Houses[param2].exit = {
      x: Interiors[param3][0],
      y: Interiors[param3][1],
      z: Interiors[param3][2]
    }
    player.sendMessageToAdmins(`[Staff] ${player.name} changed the interior of house ${param2} to ${param3}.`, null, 'admin-message');
    UpdateHouse3D(param2);
    SaveHouse(param2);
  }
});

mp.events.add('onItemUse', (player, item, extraData) => { 
  if(item.type == 13) {
    if(Houses[item.house_id].owner != player.name) {
      player.removeItemByIndex(player.info.inventory.indexOf(item));
      player.info.spawn = 0;
      player.info.houseSpawn = null;
    } else {
      player.info.houseSpawn = item.house_id;
      player.info.spawn = 1;
      player.notifyInfo("House " + item.house_id + " is now your primary spawn.");      
    }
  }
});

mp.events.addCommand("buyhouse", (player, fullText) => { 
  let result = false;
  Houses.forEach((h, index) => {
    if(h == false) return;
    if(result == true) return;
    if(player.IsInRange(h.entrance.x, h.entrance.y, h.entrance.z, 3)) {
      if(h.owned != false) return player.pushError('This house is not for sale.');
      if(player.getMoney() < h.price) return player.pushError(`You don't have enough money. (${formatMoney(h.price,0)}$)`);
      if(player.info.level < h.level) return player.pushError(`You must be level ${h.level} at least to buy this.`);
      if(player.hasItemInInventory('House Contract')) return player.pushError("You already own a house.");
      player.takeMoney(h.price);
      Houses[index].owned = true;
      Houses[index].owner = player.name;
      player.pushChat('You have purchased this house! Type /house to manage it.', null,  'house-message');
      player.notify(`~c~New item: ~w~House Contract.~n~You're owning this house.`);
      player.vars.houseEntered = h.index;
      player.dimension = h.index;
      player.position = new mp.Vector3(Houses[h.index].exit.x, Houses[h.index].exit.y, Houses[h.index].exit.z);
      player.info.spawn = 1;
      player.info.houseSpawn = h.index;
      result = true;
      SaveHouse(h.index);
      UpdateHouse3D(h.index);
      player.giveItemToInventory(
        `House Contract`, // Title
        13, // Type
        false, // Stackable,
        1, // Quantity
        true, // Can be used
        true, // Can be traded,
        { house_id: h.index }
      );   
      if(player.getItemFromInventory('House Key')) {
        player.removeItemByName('House Key');
      }
      if(player.getItemFromInventory('House Contract') && player.getItemFromInventory('House Contract').length > 1) {
        player.notify("~c~Inventory tip: ~w~~n~Press F2 and use the Contract to set your main house, you'll always be spawned at your main house.");
      }
      player.savePlayerInfo();
      result = true;
      player.call("playSoundEffect", ["PROPERTY_PURCHASE", "HUD_AWARDS"])
    }
  });
});

mp.events.addCommand("findhouse", (player, fullText, id) => {
  if(id == undefined) return player.pushExample('/findbizz [Bizz ID]');
  if(Houses[id] == undefined) return player.pushError('Invalid house ID!');
  let h = Houses[id];
  let pos = h.entrance;
  player.call('createGPSBlip', [pos.x,pos.y,pos.z, `House ${id}`]);
}); 

mp.events.add('commandEnterEvent', cmd_EnterHouse);
mp.events.add('commandExitEvent', cmd_LeaveHouse);

function cmd_EnterHouse (player, fullText) {
  let result = false;
  Houses.forEach((h, index) => {
    if(h == false) return;
    if(result == true) return;
    if(player.IsInRange(h.entrance.x, h.entrance.y, h.entrance.z, 3)) {
      let enter = false;
      if(player.hasItemInInventory('House Key') && player.getItemFromInventory('House Key')[0].house_id == h.index) {
        enter = true;
      } else if(h.owner == player.name) {
        enter = true;
      } 
      else if(player.info.member == 0) {
        mp.players.forEach((target, index) => {
          if(target.vars && target.vars.houseEntered == index) {
            if(target.info.wanted != 0) {
              enter = true;
            }
          }
        });
      }
      if(enter == true) {
        player.vars.houseEntered = index;
        player.dimension = index;
        player.position = new mp.Vector3(h.exit.x, h.exit.y, h.exit.z);
        player.notify(`~g~House ${index}.~n~Owned by ${h.owner}~n~Type /exit here to get out.`);
        result = true; 
      } else {
        return player.pushError("You don't have a key to enter this house."), result = true;
      }
    }
  });
}

function cmd_LeaveHouse (player, fullText) {
  let result = false;
  Houses.forEach((h, index) => {
    if(h == false) return;
    if(result == true) return;
    if(player.IsInRange(h.exit.x, h.exit.y, h.exit.z, 3) && player.vars.houseEntered == h.index) {
      player.vars.houseEntered = null;
      player.dimension = 0;
      player.position = new mp.Vector3(h.entrance.x, h.entrance.y, h.entrance.z);
      result = true;
    }
  });
}

function DestroyHouse3D(index) {
  let house = Houses[index];
  // if(house.marker != null) { house.marker.destroy(); }
  // house.marker = null;
  if(house.text3D != null) { house.text3D.destroy(); }
  house.text3D = null;
  if(house.blip != null) { house.blip.destroy(); }
  house.blip = null;
}

global.UpdateHouse3D = function(index) {
  if(Houses[index] == undefined) return console.log('Failed to update 3d the house with index: ' + index);
  let house = Houses[index];
  let enter = house.entrance;

  // if(house.marker != null) { house.marker.destroy(); }

  // house.marker = mp.markers.new(1, new mp.Vector3(enter.x, enter.y, enter.z - 1.2), 1,
  // {
  //   color: [20, 167, 108, 200],
  //   dimension: 0
  // });

  let houseText = ``;
  let lockText = ``;

  lockText = `~n~Usage: /enter`;

  if(house.rentable == true) {
    lockText = '~n~Usage: /enter /rentroom';
  }

  if(house.owned == false) {
    lockText = lockText + ' /buyhouse';
  }


  if (house.owned == false) {
    houseText = `~g~House ${house.index} for sale (Level ${house.level})~n~Price: ${formatMoney(house.price, 0)}$${lockText}`;
  } else {
    houseText = `~g~House ${house.index}~n~Owned by ${house.owner}${lockText}`;
  }

  if(house.text3D != null) { house.text3D.destroy(); }

  house.text3D = mp.labels.new(houseText, new mp.Vector3(enter.x, enter.y, enter.z),
  {
    los: false,
    font: 4,
    drawDistance: 5,
    dimension: 0
  });
  
  if(house.blip != null) { house.blip.destroy(); }
  house.blip = mp.blips.new(411, new mp.Vector3(enter.x, enter.y, enter.z), {
    name: house.owned == true ? 'House owned' : 'House for sale',
    scale: 0.8,
    color: 25,
    drawDistance: 5,
    shortRange: true,
    dimension: 0,
  });
}

global.saveHouses = function() {
  Houses.forEach((h, index) => {
    if(h == false) return;
    SaveHouse(index);
  });
}

global.SaveHouse = function(index) {
  let h = Houses[index];
  table.findOne({ _id: h.id }, function(err, house) {
    if(house == null) {
      if(err) return console.log('House save house error: ' + err);
    } else {
      house.index = index;
      house.owner = h.owner;
      house.owned = h.owned;
      house.rentable = h.rentable;
      house.rentPrice = h.rentPrice;
      house.price = h.price;
      house.level = h.level;
      house.upgradeLevel = h.upgradeLevel;
      house.safe = h.safe;
      house.entrance = h.entrance;
      house.exit = h.exit;
      house.save();
    }
  });
}

mp.events.add("loadVariables", player => {
  player.vars.houseEntered = null;
  player.vars.Afk = false;
  player.vars.AfkPosition = null;
  player.vars.AfkTime = 0;
});

