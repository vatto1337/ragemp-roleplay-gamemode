// info.inventory => sa aiba toate obicetele detinute de jucator. la masini sa fie vehicle.inventory.
// Sa ai inventar cu useItem(index), fiecare item sa aiba un title, type.
// sa poti pune iteme din inventaru tau in inv masinii si invers
// sa folosesc asta: https://wiki.rage.mp/index.php?title=Raycasting::testPointToPoint sa imi arate sa dau click pe jucator  sa fac trade
// Cand dai trade, sa iti apara sus inventarul, jos oferta, sa dai click pe itemele care vrei sa le dai si apoi updateo offer, trimita oferta si celuilalt cand o updatezi.
// Sa ai button accept trade, si te treci ca active, si trimite si celuilalt status active, si cand da si el active, atunci se face.
// Masinile personale sa fie contorlate printr-o cheie, care o ai inventar.
// La casa sa fie doar cheie de propietar. Daca nu ai cheie, sa nu poti fol.. 
// Dar asta inseamna sa fac toate comenzile de la casa sa le dai de la intrare, si la fel la business.


mp.events.add('registeredJoin', player => {
  player.info.inventory = [];
});

mp.events.add('requestInventory', player => {

  let playersList = [];

  mp.players.forEach((_player) => {
    if (_player.loggedIn != true) return false;
    let obj = {
      id: _player.id,
      name: _player.name,
      ping: _player.ping,
      admin: _player.info.admin,
      premium: _player.info.premium,
      member: _player.info.member,
      leader: _player.info.leader,
      rank: _player.info.rank
    }
    playersList.push(obj);
  });

  let finalObject = {
    players: playersList,
    info: player.info,
    owner: player.name,
    viewer: player.name,
    selectedItem: null,
    selectedPage: 1,
    connectedTime: player.vars.ConnectedTime,
    bullets: 1,
    admin: player.info.admin
  }
  player.call('toggleModal', [14, 'nothing', JSON.stringify(finalObject)]);
});

mp.events.add('requestPlayerInventory', (player, target) => {

  let playersList = [];

  mp.players.forEach((_player) => {
    if (_player.loggedIn != true) return false;
    let obj = {
      id: _player.id,
      name: _player.name,
      ping: _player.ping,
      admin: _player.info.admin,
      premium: _player.info.premium,
      leader: _player.info.leader,
      member: _player.info.member,
      rank: _player.info.rank
    }
    playersList.push(obj);
  });

  let finalObject = {
    players: playersList,
    info: target.info,
    owner: target.name,
    viewer: player.name,
    selectedItem: null,
    selectedPage: 1,
    connectedTime: target.vars.ConnectedTime,
    bullets: 1,
    admin: player.info.admin
  }
  player.call('toggleModal', [14, 'nothing', JSON.stringify(finalObject)]);
});

mp.events.add('inventory_use', function (player, obj) {
  obj = JSON.parse(obj);

  let target = obj.owner, viewer = obj.viewer, entity = obj.item, itemIndex = obj.index, bullets = obj.bullets;

  target = getPlayerID(target);
  viewer = getPlayerID(viewer);

  let result = false;
  if (target.loggedIn == false) return viewer.notifyError(`Player not logged on this server.`), result = true;
  target.info.inventory.forEach((item, index) => {
    if (result == true) return;
    if (index == itemIndex) {
      if(target.info.prisonTime != 0) return viewer.notifyError("You can't use items while imprisoned.");
      let extraData = { index: index };
      if(item.type == 11) {
        extraData.bullets = bullets;
      }
      mp.events.call("onItemUse", target, item, extraData);
      viewer.call("updateInventory", [JSON.stringify(target.info)]);
      result = true;
    }
  });
  if (result == false) return viewer.notifyError("Item does not exist in inventory anymore.");
});

mp.events.add('inventory_confiscate', function (player, obj) {

  obj = JSON.parse(obj);
  let target = obj.owner, viewer = obj.viewer, itemIndex = obj.index;

  target = getPlayerID(target);
  viewer = getPlayerID(viewer);

  let result = false;
  if (target.loggedIn == false) return viewer.notifyError(`Player not logged on this server.`), result = true;
  target.info.inventory.forEach((item, index) => {
    if (result == true) return;
    if (itemIndex == index) {
      if(item.type == 11)  {
        let found = false;
        viewer.info.inventory.forEach((itemx, index) => {
          if(found == true) return;
          if(itemx.type == 11) {
            if(itemx.weapon_name == item.weapon_name) {
              found = true;
              itemx.quantity += item.quantity;
            }
          }
        });
        if(found == false) {
          viewer.info.inventory.push(item);
        }
      } else {
        viewer.info.inventory.push(item);
      }
      if(item.type == 13) {
        Houses[item.house_id].owner = viewer.name;
        UpdateHouse3D(item.house_id);
        SaveHouse(item.house_id)
      }
      if(item.type == 14) {
        Business[item.business_id].owner = viewer.name;
        UpdateBizz3D(item.business_id);
        SaveBizz(item.business_id);
      }

      if(item.type == 15) {
        if(item.spawned == true) {
          let found = false;
          target.vars.personalVehicles.forEach((pers, xx) => {
            if(found == true) return;
            if(pers.id == item.guid) {
              item.spawned = false;
              item.firstSpawn = true;
              pers.entity.destroy();
              target.vars.personalVehicles.splice(xx, 1);
            }
          });
        }
      }

      target.info.inventory.splice(index, 1);
      viewer.notifyError(`<b>${item.title}</b> has been confiscated from ${viewer != target ? target.name + "'s" : "your"} inventory.`);
      viewer.call("updateInventory", [JSON.stringify(target.info)]);
      result = true;
    }
  });
  if (result == false) return viewer.notifyError("Item does not exist in inventory anymore.");
});

mp.events.add('inventory_drop', function (player, obj) {

  obj = JSON.parse(obj);
  let target = obj.owner, viewer = obj.viewer, entity = obj.item, itemIndex = obj.index;

  target = getPlayerID(target);
  viewer = getPlayerID(viewer);

  let result = false;
  if (target.loggedIn == false) return viewer.notifyError(`Player not logged on this server.`), result = true;
  target.info.inventory.forEach((item, index) => {
    if (result == true) return;
    if (itemIndex == index) {
      mp.events.call("onItemDelete", target, item);
      target.info.inventory.splice(index, 1);
      viewer.call("updateInventory", [JSON.stringify(target.info)]);
      result = true;
    }
  });
  if (result == false) return viewer.notifyError("Item does not exist in inventory anymore.");
});

mp.events.add('onItemDelete', (player, item) => {

});

mp.events.add('onItemUse', (player, item, extraData) => {
  if(item.type == 2) {
    player.removeItemByIndex(player.info.inventory.indexOf(item));
    player.giveWeapon(mp.joaat('weapon_petrolcan'), 1);
  }
  if(item.type == 3) {
    if(player.health + 20 > 70) {
      if(player.health == 100) {
        player.notifyError("Your health is perfect. You don't need to eat.");
      } else {
        player.notifyError("You're not hungry anymore. Go to a Hospital if you want to get healed!");
      }
    } else {
      player.health += 20;
      player.notifySuccess("You just ate this sandwich. Your health is now " + player.health.toFixed(0) + " HP.");
      player.removeItemByIndex(player.info.inventory.indexOf(item));
    }
  }
  if(item.type == 5) {
    if(player.vehicle) return player.notifyError("You can't use this item inside a vehicle.");
    player.playScenario('WORLD_HUMAN_SMOKING');
    player.removeItemByIndex(player.info.inventory.indexOf(item));
    player.notify("~c~Hint: ~w~/stopanim to stop.");
  }
  if(item.type == 6) {
    if(player.vehicle) return player.notifyError("You can't use this item inside a vehicle.");
    player.playScenario('WORLD_HUMAN_DRINKING_FACILITY');
    player.vars.drunk += 30;
    player.removeItemByIndex(player.info.inventory.indexOf(item));
    player.notify("~c~Hint: ~w~/stopanim to stop.");
  }
  if(item.type == 7) {
    if(player.vehicle) return player.notifyError("You can't use this item inside a vehicle.");
    player.playScenario('WORLD_HUMAN_DRINKING');
    player.vars.drunk += 75;
    player.removeItemByIndex(player.info.inventory.indexOf(item));
    player.notify("~c~Hint: ~w~/stopanim to stop.");
  }
  if(item.type == 8) {
    player.removeItemByIndex(player.info.inventory.indexOf(item));
    player.giveWeapon(mp.joaat('weapon_flashlight'), 1);
  }
  if(item.type == 11) {
    // player.pushLocalChat(`* ${player.name} loads ${extraData.bullets} bullets into their ${item.title} Magazine. `, null, 'action-message');
    player.giveWeapon(mp.joaat(item.weapon_name), parseInt(extraData.bullets));
    player.info.inventory.forEach((itemx, ix) => {
      if(itemx.type == 11 && itemx.weapon_name == item.weapon_name) {
        player.info.inventory[player.info.inventory.indexOf(itemx)].quantity -= parseInt(extraData.bullets);
        if(player.info.inventory[player.info.inventory.indexOf(itemx)].quantity < 1) {
          player.info.inventory.splice(player.info.inventory.indexOf(itemx), 1);
        }
      }
    });
  }
});

mp.events.add("loadVariables", player => {
  player.removeItemByIndex = function(index) {
    player.info.inventory.forEach((item, ix) => {
      if(ix == index) {
        if (item.stackable == false) {
          player.info.inventory.splice(index, 1);
        } else {
          player.info.inventory[index].quantity--;
          if (player.info.inventory[index].quantity < 1) {
            player.info.inventory.splice(index, 1);
          }
        }
      }
    });
  }

  player.removeItemByName = function(title) {
    player.info.inventory.forEach((item, ix) => {
      if(title == item.title) {
        if (item.stackable == false) {
          player.info.inventory.splice(ix, 1);
        } else {
          player.info.inventory[ix].quantity--;
          if (player.info.inventory[ix].quantity < 1) {
            player.info.inventory.splice(ix, 1);
          }
        }
      }
    });
  }
  
  player.hasItemInInventory = function(title) {
    let result = false;
    player.info.inventory.forEach((item, index) => {
      if(result == true) return;
      if(item.title == title) return result = true;
    });
    return result;
  }

  player.getItemFromInventory = function(title) {
    let result = [];
    player.info.inventory.forEach((item, index) => {
      if(item.title == title) {
        result.push(item);
      }
    });
    return result;
  }
  
  player.giveItemToInventory = function(title, type, stackable, quantity, canBeUsed, canBeTradable, object) {
    
    let initialObject = {
      title: title,
      type: type,
      stackable: stackable,
      quantity: quantity,
      canBeUsed: canBeUsed,
      canBeTradable: canBeTradable,
      markedForTrade: false
    }
    let returnedObject = Object.assign(initialObject, object);
    if(stackable == true) {
      let found = false;
      player.info.inventory.forEach((item ,index) => {
        if(found == true) return;
        if(item.type == type && item.stackable == true) {
          item.quantity += quantity;
          found = true;
        }
      });
      if(found == false) {
        player.info.inventory.push(returnedObject);
      }
    } else {
      player.info.inventory.push(returnedObject);
    }
  }
});
