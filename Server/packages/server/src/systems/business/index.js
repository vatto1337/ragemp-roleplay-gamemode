// To-Do:
// Pe viitor niste joburi care sa fie administrate de un bizz. 'Bizz Job'

const table = require("./schema.js");

global.Business = [];

let bussinessQuery = table.find({}, null, { sort: 'index' }, function (err, business) {
  if (err) return console.log(err);
});

bussinessQuery.then((result) => {

  let query = new Promise(function (resolve, reject) {
    result.forEach((bizz, index) => {
      let object = {
        index: index,
        id: bizz._id,
        title: bizz.title,
        entrance: bizz.entrance,
        exit: bizz.exit,
        ipls: bizz.ipls,
        buyPoint: bizz.buyPoint,
        robPoint: bizz.robPoint,
        extraPoints: bizz.extraPoints,
        haveEntrance: bizz.haveEntrance,
        haveBuyPoint: bizz.haveBuyPoint,
        haveRobPoint: bizz.haveRobPoint,
        haveExtra: bizz.haveExtra,
        owner: bizz.owner,
        owned: bizz.owned,
        price: bizz.price,
        level: bizz.level,
        products: bizz.products,
        type: bizz.type,
        safe: bizz.safe,
        blipIcon: bizz.blipIcon,
        blipColor: bizz.blipColor,
        robTime: bizz.robTime,
        taxes: bizz.taxes,
        markers: {
          entrance: null,
          rob: null,
          buy: null,
          extra: null
        },
        texts3D: {
          entrance: null,
          exit: null,
          rob: null,
          buy: null,
          extra: null
        },
        blip: null,
        club: {
          music: {
            kind: null,
            link: null,
            title: null
          },
          status: false,
          dj: null,
          waitLine: false
        }
      };
      Business.push(object);
    });
    resolve(Business.length);
  });

  query.then((nr) => {
    console.log(`[Business] ${nr} loaded.`);
    Business.forEach((bizz, index) => {
      UpdateBizz3D(index);
      SaveBizz(index);
    });
  });
});

function DestroyBizz3D(index) {
  if (Business[index] == undefined) return console.log('Failed to delete bizz 3d the business with index: ' + index);
  let bizz = Business[index];
  if (bizz.blip != null) { bizz.blip.destroy(); }
  if (bizz.markers.entrance != null) { bizz.markers.entrance.destroy(); }
  if (bizz.texts3D.entrance != null) { bizz.texts3D.entrance.destroy(); }
  if (bizz.texts3D.exit != null) { bizz.texts3D.exit.destroy(); }
  if (bizz.markers.rob != null) { bizz.markers.rob.destroy(); }
  if (bizz.texts3D.rob != null) { bizz.texts3D.rob.destroy(); }
  if (bizz.markers.extra != null) { bizz.markers.extra.forEach((exMark) => { exMark.destroy(); }); }
  if (bizz.texts3D.extra != null) { bizz.texts3D.extra.forEach((exTest) => { exTest.destroy(); }) }
  if (bizz.markers.buy != null) { bizz.markers.buy.destroy(); }
  if (bizz.texts3D.buy != null) { bizz.texts3D.buy.destroy(); }
}

global.UpdateBizz3D = function(index) {
  if (Business[index] == undefined) return console.log('Failed to update 3d the business with index: ' + index);
  let bizz = Business[index];
  let enter;
  if (bizz.haveEntrance == true) {
    enter = {
      x: bizz.entrance.x,
      y: bizz.entrance.y,
      z: bizz.entrance.z
    }
  } else {
    enter = {
      x: bizz.buyPoint.x,
      y: bizz.buyPoint.y,
      z: bizz.buyPoint.z
    }
  }

  if (bizz.blip != null) { bizz.blip.destroy(); }
  bizz.blip = mp.blips.new(bizz.blipIcon, new mp.Vector3(enter.x, enter.y, enter.z), {
    name: bizz.title,
    scale: 1,
    color: bizz.blipColor,
    drawDistance: 15,
    shortRange: true,
    dimension: 0,
  });

  if (bizz.haveEntrance == true) {
    if (bizz.markers.entrance != null) { bizz.markers.entrance.destroy(); }

    bizz.markers.entrance = mp.markers.new(1, new mp.Vector3(enter.x, enter.y, enter.z - 1.4), 1,
      {
        color: [250, 152, 58, 255],
        dimension: 0
      });

    if (bizz.texts3D.entrance != null) { bizz.texts3D.entrance.destroy(); }
    if (bizz.texts3D.exit != null) { bizz.texts3D.exit.destroy(); }

    let text = `~y~${bizz.title}~n~Bizz ID: ${bizz.index}`;
    if (bizz.owned == true) { text = text + `~n~Owned by ${bizz.owner}`; }
    text = text + '~n~Commands: /enter';
    if (bizz.owned == false) { text = text + ' /buybizz'; }

    bizz.texts3D.entrance = mp.labels.new(text, new mp.Vector3(enter.x, enter.y, enter.z),
      {
        los: false,
        font: 4,
        drawDistance: 5,
        dimension: 0
      });

    text = `~y~${bizz.title}`;
    if (bizz.owned == true) { text = text + `~n~Owned by ${bizz.owner}`; }
    text = text + '~n~Type ~r~/exit~y~ to get out.';

    let exit = bizz.exit;
    bizz.texts3D.exit = mp.labels.new(text, new mp.Vector3(exit.x, exit.y, exit.z),
      {
        los: false,
        font: 4,
        drawDistance: 3,
        dimension: bizz.haveEntrance == true ? (index + 300) : 0
      });
  }

  // if (bizz.haveRobPoint == true) {
  //   if (bizz.markers.rob != null) { bizz.markers.rob.destroy(); }
  //   let pos = bizz.robPoint;
  //   bizz.markers.rob = mp.markers.new(29, new mp.Vector3(pos.x, pos.y, pos.z), 1,
  //     {
  //       color: [250, 152, 58, 255],
  //       dimension: bizz.haveEntrance == true ? (index + 300) : 0
  //     });

  //   if (bizz.texts3D.rob != null) { bizz.texts3D.rob.destroy(); }
  //   let text = `~y~${bizz.title}~n~Bizz ID: ${bizz.index}`;
  //   if (bizz.owned == true) { text = text + `~n~Owned by ${bizz.owner}`; }
  //   text = text + '~n~Type /rob to rob this bizz';
  //   bizz.texts3D.rob = mp.labels.new(text, new mp.Vector3(pos.x, pos.y, pos.z),
  //     {
  //       los: false,
  //       font: 4,
  //       drawDistance: 5,
  //       dimension: bizz.haveEntrance == true ? (index + 300) : 0
  //     });
  // }

  if (bizz.haveExtra == true) {

    if (bizz.markers.extra != null) { bizz.markers.extra.forEach((exMark) => { exMark.destroy(); }); }
    bizz.markers.extra = [];
    bizz.extraPoints.forEach((extra) => {
      let marker = mp.markers.new(29, new mp.Vector3(extra.x, extra.y, extra.z), 1,
        {
          color: [250, 152, 58, 255],
          dimension: bizz.haveEntrance == true ? (index + 300) : 0
        });
      bizz.markers.extra.push(marker);
    });

    if (bizz.texts3D.extra != null) { bizz.texts3D.extra.forEach((exTest) => { exTest.destroy(); }) }
    bizz.texts3D.extra = [];
    bizz.extraPoints.forEach((extra) => {
      let text = `~y~${bizz.title}~n~${extra.message}`;
      let Text3D = mp.labels.new(text, new mp.Vector3(extra.x, extra.y, extra.z),
        {
          los: false,
          font: 4,
          drawDistance: 5,
          dimension: bizz.haveEntrance == true ? (index + 300) : 0
        });
      bizz.texts3D.extra.push(Text3D);
    });
  }

  if (bizz.haveBuyPoint == true) {
    if (bizz.markers.buy != null) { bizz.markers.buy.destroy(); }
    let pos = bizz.buyPoint;
    bizz.markers.buy = mp.markers.new(29, new mp.Vector3(pos.x, pos.y, pos.z), 1,
      {
        color: [250, 152, 58, 255],
        dimension: bizz.haveEntrance == true ? (index + 300) : 0
      });

    if (bizz.texts3D.buy != null) { bizz.texts3D.buy.destroy(); }
    let text = `~y~${bizz.title}~n~Bizz ID: ${bizz.index}`;
    if (bizz.owned == true) { text = text + `~n~Owned by ${bizz.owner}`; }
    if (bizz.type == 1) { text = text + `~n~Usage: /buy`; }
    if (bizz.type == 2) { text = text + `~n~Usage: /enter`; }
    if (bizz.type == 3) { text = text + `~n~Usage: /bizzhelp`; }
    if (bizz.type == 4) { text = text + `~n~Usage: /buygun /buylic`; }
    if (bizz.type == 5) { text = text + `~n~Usage: /ad`; }
    if (bizz.type == 6) { text = text + `~n~Usage: /buyclothes /buyskins`; }
    if (bizz.type == 7) { text = text + `~n~Usage: /buydrink`; }
    if (bizz.type == 8) { text = text + `~n~Usage: /buylook`; }
    if (bizz.owned == false && bizz.haveEntrance == false) { text = text + ' /buybizz'; }

    bizz.texts3D.buy = mp.labels.new(text, new mp.Vector3(pos.x, pos.y, pos.z),
      {
        los: false,
        font: 4,
        drawDistance: 5,
        dimension: bizz.haveEntrance == true ? (index + 300) : 0
      });
  }
}

mp.events.addCommand("bizzhelp", (player, fullText, value) => {
  let result = false;
  Business.forEach((b, index) => {
    if (b == false) return;
    if (result == true) return;
    if (b.haveBuyPoint == false) return;
    if (player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if (b.type == 3) {
        player.pushChat("[Bizz Help] /balance /transfer /deposit /withdraw", null, 'bizz-message');
      }
      if (b.type == 4) {
        player.pushChat("[Bizz Help] /buyguns /buygunlicense", null, 'bizz-message');
      }
      result = true;
    }
  });
  if (result == false) return player.pushError("This command must be used inside a business.");
});

mp.events.add("business_createBizz", (player, bizz) => {
  if (player.info.admin < 8) return false;
  bizz = JSON.parse(bizz);
  let bizzIndex = null;
  Business.forEach((bx, index) => {
    if (bizzIndex != null) return;
    if (bx == false) {
      bizzIndex = index;
    }
  });

  let bizzObject = {
    index: bizzIndex == null ? (Business.length - 1) + 1 : bizzIndex,
    id: null,
    title: bizz.title,
    entrance: bizz.haveEntrance == true ? bizz.entrance : null,
    exit: bizz.haveEntrance == true ? bizz.exit : null,
    ipls: bizz.ipls,
    buyPoint: bizz.haveBuyPoint == true ? bizz.buyPoint : null,
    robPoint: bizz.haveRobPoint == true ? bizz.robPoint : null,
    extraPoints: bizz.haveExtra == true ? bizz.extraPoints : null,
    haveEntrance: bizz.haveEntrance,
    haveBuyPoint: bizz.haveBuyPoint,
    haveRobPoint: bizz.haveRobPoint,
    haveExtra: bizz.haveExtra,
    owner: 'No-One',
    owned: false,
    price: bizz.price,
    level: bizz.level,
    products: 5000,
    type: bizz.type,
    safe: 0,
    blipIcon: bizz.blipIcon,
    blipColor: bizz.blipColor,
    robTime: 0,
    taxes: 0
  }

  const bizzDoc = new table(bizzObject);
  bizzDoc.save((err, doc) => {
    if (err) return console.log('Bizz save error: ' + err);
    if (bizzIndex == null) {
      Business.push(bizzObject);
      let bindex = Business.indexOf(bizzObject);
      Business[bindex].index = Business.indexOf(bizzObject);
      Business[bindex].id = doc._id;
      Business[bindex].markers = {
        entrance: null,
        rob: null,
        buy: null,
        extra: null
      }
      Business[bindex].texts3D = {
        entrance: null,
        exit: null,
        rob: null,
        buy: null,
        extra: null
      }
      Business[bindex].blip = null;
      Business[bindex].club = {
        music: {
          kind: null,
          link: null,
          title: null
        },
        status: false,
        dj: null,
        waitLine: false
      }
      UpdateBizz3D(bindex);
      player.sendMessageToAdmins(`[Staff] ${player.name} created a business (ID: ${bindex}).`, null, 'admin-message');
    } else {
      let bindex = bizzIndex;
      Business[bindex] = bizzObject;
      Business[bindex].index = bindex;
      Business[bindex].id = doc._id;
      Business[bindex].markers = {
        entrance: null,
        rob: null,
        buy: null,
        extra: null
      }
      Business[bindex].texts3D = {
        entrance: null,
        exit: null,
        rob: null,
        buy: null,
        extra: null
      }
      Business[bindex].blip = null;
      Business[bindex].club = {
        music: {
          kind: null,
          link: null,
          title: null
        },
        status: false,
        dj: null,
        waitLine: false
      }
      UpdateBizz3D(bindex);
      player.sendMessageToAdmins(`[Staff] ${player.name} created a business (ID: ${bindex}).`, null, 'admin-message');
    }
  });

});

mp.events.add('onItemDelete', (player, item) => { 
  if(item.type == 14) {
    if(Business[item.business_id].owner == player.name) {
      let bizzIndex = item.business_id;
      Business[bizzIndex].owned = false;
      Business[bizzIndex].owner = 'No-One';
      UpdateBizz3D(bizzIndex);
      SaveBizz(bizzIndex);
      player.notifyerror(`Business Contract ${bizzIndex} have been removed from inventory.`);
    }
  }
});

mp.events.addCommand("buybizz", (player, fullText) => {
  let result = false, position = false;
  Business.forEach((b, index) => {
    position = false;
    if (b == false) return;
    if (result == true) return;
    if (b.haveEntrance == true && player.IsInRange(b.entrance.x, b.entrance.y, b.entrance.z, 3)) { position = true; }
    if (b.haveBuyPoint == true && player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 3)) { position = true; }
    if (position == true) {
      if (b.owned != false) return player.pushError('This business is not for sale.');
      if (player.getMoney() < b.price) return player.pushError(`You don't have enough money. (${formatMoney(b.price, 0)}$)`);
      if (player.info.level < b.level) return player.pushError(`You must be level ${b.level} at least to buy this.`);
      if(player.hasItemInInventory('Business Contract')) return player.pushError("You already own a business.");      
      player.takeMoney(b.price);
      Business[index].owned = true;
      Business[index].owner = player.name;
      player.pushChat('You have purchased this business! Type /bizz to manage it.', null,  'bizz-message');
      player.notify(`~c~New item: ~w~Business Contract.~n~You're owning this business.`);
      player.giveItemToInventory(
        `Business Contract`, // Title
        14, // Type
        false, // Stackable,
        1, // Quantity
        false, // Can be used
        true, // Can be traded,
        { business_id: index }
      );   
      result = true;
      SaveBizz(index);
      UpdateBizz3D(index);
      player.savePlayerInfo();
      result = true;
      player.call("playSoundEffect", ["PROPERTY_PURCHASE", "HUD_AWARDS"]);
    }
  });
});

mp.events.addCommand("abizz", (player, fullText, param1, param2, param3, param4, param5) => {
  if (!player.checkAdminRank(7)) return player.pushError(`You don't have permission to use this.`);
  if (param1 == undefined) return player.pushExample('/abizz [stats, goto, resell, set, create, delete]');
  if (param1 == 'stats') {
    if (param2 == undefined) return player.pushExample('/abizz stats [Bizz ID]');
    param2 = parseInt(param2);
    if (Business[param2] == undefined) return player.pushError('Invalid Bizz ID!');
    player.pushChat(`[Bizz ${param2} Stats]`, null, 'bizz-message');
    player.pushChat(`* Safe balance: ${formatMoney(Business[param2].safe, 0)}$`, null, 'bizz-message');
    if(Business[param2].type != 3) {
      player.pushChat(`* Products: ${Business[param2].products}`, null, 'bizz-message');
    }
    player.pushChat(`* Unpaid taxes: ${formatMoney(Business[param2].taxes, 0)}$`, null, 'bizz-message');
    player.pushChat('---------', null, 'bizz-message');
  }
  else if (param1 == 'delete') {
    if (param2 == undefined) return player.pushExample('/abizz delete [Bizz ID]');
    param2 = parseInt(param2);
    if (Business[param2] == undefined) return player.pushError('Invalid Bizz ID!');
    table.findOne({ _id: Business[param2].id }, function (err, bizz) {
      if (bizz == null) {
        return player.pushError("I can't find this bizz in database.");
      } else {
        player.sendMessageToAdmins(`[Staff] ${player.name} deleted business ${param2}.`, null, 'admin-message');
        player.pushChat('Warning: You must create now a business to replace this one you have deleted.', null, 'admin-message');

        mp.players.forEach((_player) => {
          if (!_player.loggedIn || _player.loggedIn == false) return;
          if (_player.vars.bizzEntered == param2) {
            _player.vars.bizzEntered = null;
            _player.dimension = 0;
            _player.position = new mp.Vector3(Business[param2].entrance.x, Business[param2].entrance.y, Business[param2].entrance.z);
          }
        });
        DestroyBizz3D(param2);
        bizz.remove();
        Business[param2] = false;
        saveBusinesses();
      }
      if (err) return console.log('Bizz delete error: ' + err);
    });
  }
  else if (param1 == 'create') {
    player.call('toggleModal', [12, 'chat', JSON.stringify({})]);
  }
  else if (param1 == 'resell') {
    if (param2 == undefined) return player.pushExample('/abizz resell [Bizz ID]');
    param2 = parseInt(param2);
    if (Business[param2] == undefined) return player.pushError('Invalid Bizz ID!');
    if (Business[param2].owned == false) return player.pushError('This bizz already is for sale.');
    Business[param2].owned = false;
    Business[param2].owner = 'No-One';
    player.sendMessageToAdmins(`[Staff] ${player.name} put business ${param2} for sale.`, null, 'admin-message');
    SaveBizz(param2);
    UpdateBizz3D(param2);
  }
  else if (param1 == 'set') {
    if (param2 == undefined || param3 == undefined || param4 == undefined || param5 == undefined) return player.pushExample('/abizz set [Bizz ID] [Price] [Level] [Products]');
    param2 = parseInt(param2), param3 = parseInt(param3), param4 = parseInt(param4), param5 = parseInt(param5);
    if (Business[param2] == undefined) return player.pushError('Invalid Bizz ID!');
    Business[param2].price = param3;
    Business[param2].level = param4;
    Business[param2].products = param5;
    UpdateBizz3D(param2);
    SaveBizz(param2);
    player.sendMessageToAdmins(`[Staff] ${player.name} updated bizz ${param2} (Price: ${formatMoney(param3, 0)}$ - Level: ${param4} - Products: ${param5})`, null, 'admin-message');
  }
  else if (param1 == 'goto') {
    if (param2 == undefined) return player.pushExample('/abizz goto [Bizz ID]');
    param2 = parseInt(param2);
    if (Business[param2] == undefined) return player.pushError('Invalid bizz id.');
    if (Business[param2].haveEntrance == true) {
      player.position = new mp.Vector3(Business[param2].entrance.x, Business[param2].entrance.y, Business[param2].entrance.z);
    } else {
      player.position = new mp.Vector3(Business[param2].buyPoint.x, Business[param2].buyPoint.y, Business[param2].buyPoint.z);
    }
    player.notify('~r~Teleported to Bizz ' + param2);
  }
});

mp.events.addCommand("bizz", (player, fullText, param1, param2, param3) => {
  if(!player.hasItemInInventory('Business Contract')) return player.pushError("You don't own a business.");
  let BizzIndex = null;
  let ownedBusinesses = player.getItemFromInventory('Business Contract');
  ownedBusinesses.forEach((bizz_owned, index) => {
    if(BizzIndex != null) return;
    let b = Business[bizz_owned.business_id];
    let position = false;
    if (b.haveEntrance == true && player.IsInRange(b.entrance.x, b.entrance.y, b.entrance.z, 10)) { position = true; }
    if (b.haveBuyPoint == true && player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) { position = true; }
    if (b.haveEntrance == true && player.vars.bizzEntered == b.index) { position = true; }
    if(Business[bizz_owned.business_id].owner == player.name && position == true) {
      BizzIndex = b.index;
    }
  });
  if(BizzIndex == null) return player.pushError("This command must be used near the business you want to manage.");
  if (param1 == undefined) return player.pushExample(`/bizz [stats, withdraw, deposit, tax, products]`);
  if (param1 == 'stats') {
    player.pushChat('[Bizz ' + BizzIndex + ' Stats]', null, 'bizz-message');
    player.pushChat(`* Safe balance: ${formatMoney(Business[BizzIndex].safe, 0)}$`, null, 'bizz-message');
    if(Business[BizzIndex].type != 3) {
      player.pushChat(`* Products: ${Business[BizzIndex].products}`, null, 'bizz-message');
    }
    player.pushChat(`* Unpaid taxes: ${formatMoney(Business[BizzIndex].taxes, 0)}$`, null, 'bizz-message');
    player.pushChat('---------', null, 'bizz-message');
  }
  else if (param1 == 'withdraw') {
    if (param2 == undefined) return player.pushExample('/bizz withdraw [Value]');
    param2 = parseInt(param2);
    if (param2 > Business[BizzIndex].safe || param2 < 0) return player.pushError('Invalid value. Check balance first with /bizz stats.');
    Business[BizzIndex].safe -= param2;
    player.giveMoney(param2);
    player.pushChat(`You took ${player.formatMoney(param2, 0)}$ from the business.`, null, 'bizz-message');
    SaveBizz(BizzIndex);
  }
  else if (param1 == 'deposit') {
    if (param2 == undefined) return player.pushExample('/bizz deposit [Value]');
    param2 = parseInt(param2);
    if (param2 > player.getMoney() || param2 < 0) return player.pushError("You don't have enough money.");
    Business[BizzIndex].safe += param2;
    player.takeMoney(param2);
    player.pushChat(`You put ${player.formatMoney(param2, 0)}$ into the business.`, null, 'bizz-message');
    SaveBizz(BizzIndex);
  }
  else if (param1 == 'products') {
    if (Business[BizzIndex].type == 3) return player.pushError("This business don't need any products.");
    if (param2 == undefined) return player.pushExample('/bizz products [How much products you want to buy]');
    param2 = parseInt(param2);
    let cost = param2 * databox[0].data.productsPrice;
    if (Business[BizzIndex].safe < cost) return player.pushError(`You don't have enough money in the business (${formatMoney(cost, 0)}$)`);
    Business[BizzIndex].safe -= cost;
    Business[BizzIndex].products += param2;
    player.pushChat(`You purchased ${param2} products for ${formatMoney(cost, 0)}$ for this business.`, null, 'bizz-message');
    SaveBizz(BizzIndex);
  }
  else if (param1 == 'tax') {
    if (Business[BizzIndex].taxes < 1) return player.pushError("You don't have any unpaid taxes for this business.");
    if (Business[BizzIndex].safe < Business[BizzIndex].taxes) return player.pushError("There is not enough money in the business to pay for it. Use /bizz deposit first.");
    databox[0].data.safe += Business[BizzIndex].taxes;
    Business[BizzIndex].safe -= Business[BizzIndex].taxes;
    Business[BizzIndex].taxes = 0;
    player.pushChat("You have paid the business unpaid taxes.", null, 'bizz-message');
    SaveBizz(BizzIndex);
  }
});

mp.events.addCommand("findbizz", (player, fullText, id) => {
  if (id == undefined) return player.pushExample('/findbizz [Bizz ID]');
  if (Business[id] == undefined) return player.pushError('Invalid business ID!');
  let b = Business[id];
  let pos = b.haveEntrance == true ? b.entrance : b.buyPoint;
  player.call('createGPSBlip', [pos.x, pos.y, pos.z, `Business ${id}`]);
});

global.saveBusinesses = function () {
  Business.forEach((b, index) => {
    if (b == false) return;
    SaveBizz(index);
  });
}

global.SaveBizz = function (index) {
  let b = Business[index];
  table.findOne({ _id: b.id }, function (err, bizz) {
    if (bizz == null) {
      if (err) return console.log(`Bizz ${index} save erorr: ${err}`);
    } else {
      bizz.index = b.index;
      bizz.owner = b.owner;
      bizz.owned = b.owned;
      bizz.price = b.price;
      bizz.level = b.level;
      bizz.robTime = b.robTime;
      bizz.products = b.products;
      bizz.safe = b.safe;
      bizz.save();
    }
  });
}

mp.events.add('commandEnterEvent', cmd_enterBizz);
mp.events.add('commandExitEvent', cmd_leaveBizz);

function cmd_enterBizz(player, fullText) {
  let result = false;
  Business.forEach((b, index) => {
    if (result == true) return;
    if (b == false) return;
    if (b.haveEntrance == false) return;
    if (player.IsInRange(b.entrance.x, b.entrance.y, b.entrance.z, 3)) {
      if (b.type == 7) {
        if (player.getMoney() < 20) return player.pushError("Entrance fee is 20$.");
        player.takeMoney(20);
        if (Business[index].owned == true) {
          Business[index].safe += 20;
          Business[index].taxes += (20 / 100) * databox[0].data.taxes.business;
          Business[index].products--;
        }
        if (Business[index].club.status == true) {
          player.vars.youtubePlay = Business[index].club.music.link;
          player.vars.youtubeTitle = Business[index].club.music.title;
          player.call("youtube_play", [Business[index].club.music.link, Business[index].club.music.kind]);
          player.notify(`~r~Press ~w~F3~r~ to show cursor and stop it or change volume.`);
        }
      }
      player.vars.bizzEntered = index;
      player.dimension = (300 + index);
      player.position = new mp.Vector3(b.exit.x, b.exit.y, b.exit.z);
      player.notify(`~g~Welcome to business ${b.index}.~n~ Type /exit here to get out.`);
      result = true;
    }
  });
}

function cmd_leaveBizz(player, fullText) {
  let result = false;
  Business.forEach((b, index) => {
    if (b == false) return;
    if (b.haveEntrance == false) return;
    if (result == true) return;
    if (player.IsInRange(b.exit.x, b.exit.y, b.exit.z, 3) && player.vars.bizzEntered == index) {
      if (b.type == 7) {
        if (Business[index].club.status == true) {
          player.vars.youtubePlay = null;
          player.vars.youtubeTitle = null;
          player.call("youtube_forceStop");
        }
      }
      player.vars.bizzEntered = null;
      player.dimension = 0;
      player.position = new mp.Vector3(b.entrance.x, b.entrance.y, b.entrance.z);
      result = true;
    }
  });
}

mp.events.add("loadVariables", player => {
  player.vars.bizzEntered = null;
  player.vars.usingBizz = null;

  Business.forEach((b, index) => {
    if (b == false) return;
    if (b.ipls != null) {
      b.ipls.forEach((ipl) => {
        player.call('requestIPL', [ipl]);
      });
    }
  });
  // Business.forEach((b, index) => {
  //   if(b.havePeds == false) return;
  //   b.peds.forEach((ped) => {
  //     player.call("createBizzPed", [ped.skin, JSON.stringify(ped.pos), b.haveEntrance == true ? (300 + index) : 0]);
  //   });
  // });
});
