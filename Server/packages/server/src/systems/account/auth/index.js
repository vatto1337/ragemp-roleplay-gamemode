const accounts = require("../schema/accounts.js");
var hash = require('simple-encryptor')('bZgl4bXFJ3HNQ4Rkozpzzhurdock');

mp.events.add('receiveLoginData', (player, password) => {
  password = hash.hmac(password);
  accounts.findOne({ username: player.name }, function(err, account) {
    if(err) return console.log(err);
    if(account == null) {
      player.call('sendAuthResponse', [`Username ${player.name} is not registered.`, 'login']);  
      return false;        
    }
    if(account.password != password) {
      player.call('sendAuthResponse', ['Password is incorrect.', 'login']);  
      return false;          
    }
    player.loadAccountTimer = setTimeout(function(){ mp.events.call("loadAccount", player); }, 1000);
    return true;
  });
});

mp.events.add('receiveRegisterData', (player, password) => {
  password = hash.hmac(password);
  accounts.findOne({ username: player.name })
  .exec(function (err, user) {
    if(err) return console.log(err);
    if (user) { 
      if (user.username == player.name) {
        player.call('sendAuthResponse', [`${player.name} is already registered.`, 'register']);  
      }
    } 
    else { 
      const account = new accounts({ 
        username: player.name, 
        password: password,
        registered: new Date(),
        lastConnected: new Date(),
        lastDisconnected: new Date(), 
        ip: player.ip,
        socialClub: player.socialClub,
        info: {
          justRegistered: true,
          level: 1,
          wallet: 500,
          bank: 0,
          online: true
        },
        character: null
      });
      account.save().then(() => {
        player.call('prepareCharacter'); 
      });
    }
  });
});

mp.events.add('saveCharacter', (player, character, price) => {
  character = JSON.parse(character);
  if(player.vars && player.vars.usingBizz != null) {
    if(player.getMoney() < price) {
      player.notifyError(`You don't have enough money to pay for this. (${formatMoney(price, 0)}$)`);
    } else {
      player.info.character = character;
      player.takeMoney(price);
      let bizz = Business[player.vars.usingBizz];
      if (bizz.owned == true) {
        bizz.safe += 100;
        bizz.taxes += (100 / 100) * databox[0].data.taxes.business;
        bizz.products--;
      }
      player.notifySuccess("You have purchased new clothes.");
    }
    player.call("clothes_exit", [player.vars.usingBizz, true]);
  } 
  else {
    accounts.findOne({ username: player.name }, function (err, user) {
      if(err) return console.log(err);
      user.set({ "info.character": character });
      user.save(function (err, updatedUser) {
        if(err) return console.log(err);
        mp.events.call("loadAccount", player); 
      });
    });
  }
});

mp.events.add("playerStreamIn", (player, forPlayer) => {
  mp.events.call('loadProps', player);
  mp.events.call('loadProps', forPlayer);
});


mp.events.add('loadProps', player => {
  let char = player.info.character;
  if(player.model ==  mp.joaat("mp_m_freemode_01") || player.model == mp.joaat("mp_f_freemode_01")) 
  {
    player.setProp(0, char.hat, 0);
    player.setProp(1, char.glasses, 0);
    if(player.info.member == 0 && player.vars.uniformEquipped == true) {
      if(player.info.character.gender == 0) {
        player.setProp(0, 46, 0);   
      }
      else {
        player.setProp(0, 45, 0); 
      }
    }
  }
});

mp.events.add('loadClothes', player => {
  let char = player.info.character;
  if(player.model ==  mp.joaat("mp_m_freemode_01") || player.model == mp.joaat("mp_f_freemode_01")) 
  {
      player.setHeadOverlay(1, [char.facial == 0 ? -1 : char.facial, 1.0, char.facialColor, char.facialColor]);
      player.setHeadOverlay(2, [char.eyebrows, 1, char.facialColor, char.facialColor]);
      player.setHeadOverlay(3, [char.ageing == 0 ? -1 : char.ageing, 1, 255, 255]);
      player.setHeadOverlay(4, [char.makeup == 0 ? -1 : char.makeup, 1, 255, 255]);
      player.setHeadOverlay(8, [char.lipstick == 0 ? -1 : char.lipstick, 1, char.lipstickColor, char.lipstickColor]);
      player.setClothes(1, char.mask, 0,0);
      player.setClothes(2, char.hair, 0, 0);
      player.setClothes(3, char.torso, 0,0);
      player.setClothes(11, char.top, 0,0);
      player.setClothes(4, char.pants, 0,0);
      player.setClothes(6, char.shoes, 0,0);
      player.setClothes(8, char.undershirt, 0,0);
      player.setProp(0, char.hat, 0);
      player.setHairColor(char.hairColor1, char.hairColor2);
      player.setProp(1, char.glasses, 0);
      player.eyeColor = char.eyes;
      player.setHeadBlend(char.mother, char.father, 0, char.mother, char.father, 0, char.resemblance, char.skinTone, 0.0);
      if(player.info.member == 1 && player.vars.uniformEquipped == true) {
        if(player.info.character.gender == 0) {
          player.setClothes(3, 92, 0,0);
          player.setClothes(8, 15, 0,0);
          player.setClothes(6, 10, 0, 0);
          player.setClothes(4, 24, 0, 0);
          player.setClothes(11, 113, 3, 0);
          player.setClothes(7, 126, 0, 0);
        }
        else {
          player.setClothes(3, 101, 0,0);
          player.setClothes(8, 3, 0,0);
          player.setClothes(6, 29, 0, 0);
          player.setClothes(4, 37, 0, 0);
          player.setClothes(7, 96, 0, 0);
          player.setClothes(11, 106, 3, 0);
        }
      }
      if(player.info.member == 0 && player.vars.uniformEquipped == true) {
        if(player.info.character.gender == 0) {
          player.setClothes(3, 0, 0,0);
          player.setClothes(8, 58, 0,0);
          player.setClothes(6, 10, 0, 0);
          player.setClothes(4, 24, 0, 0);
          player.setClothes(11, 55, 0,0);     
          player.setProp(0, 46, 0);   
        }
        else {
          player.setClothes(3, 0, 0,0);
          player.setClothes(8, 152, 0,0);
          player.setClothes(6, 29, 0, 0);
          player.setClothes(4, 37, 0, 0);
          player.setClothes(11, 48, 0,0);     
          player.setProp(0, 45, 0); 
        }
      }
  }
});


mp.events.add('loadAccount', player => {
  accounts.findOne({ username: player.name }, function (err, user) {
    if (err) return handleError(err);

    player.info = user.info;
    player.lastConnected = user.lastConnected;
    player.password = user.password;
    user.set({ 'info.online' : true });
    user.save();
    var month = player.lastConnected.getMonth() + 1, day = player.lastConnected.getDate(), hour = player.lastConnected.getHours(), minutes = player.lastConnected.getMinutes();
    day = day < 10 ? '0' + day : day, month = month < 10 ? '0' + month : month, minutes = minutes < 10 ? '0' + minutes : minutes,  hour = hour < 10 ? '0' + hour : hour;
    var year = player.lastConnected.getFullYear();

    if(user.info.character != null) {
      player.loggedIn = true;
      player.call('updateAuthClient'); 
      player.call('authCamera', [2]); 
      mp.events.call("loadVariables", player);
      mp.events.call("spawnPlayer", player); 
      player.updateSecurityInfo();
      player.setVariable('money', player.info.wallet);
      player.setVariable('bank', player.info.bank);
      player.call('updateHud'); 

      if(player.info.justRegistered == true) {
        player.pushChat(`[Info] You have registered successfully.`, null, 'server-message');   
        player.pushChat(`[Info] Go to the purple checkpoint on your map to get your driving license.`, null, 'server-message');   
        player.pushChat(`[Info] Open your chat (Press T) and type /guide to read our server tutorial.`, null, 'server-message');   
        player.sendMessageToAdmins(`${player.name} just registered with ip: ${player.ip}`, null, 'admin-message');  
        mp.events.call("registeredJoin", player);
        player.info.justRegistered = false;   
        player.giveSubtitle(`You have just arrived in ~r~Los Santos~w~ by plane.`, parseInt(30));
        player.giveSubtitle(`After reaching a certain age you decided to move to San Andreas.`, parseInt(30));
        player.giveSubtitle(`In order to get your driving license in this state you must go to ~p~DMV~w~.`, parseInt(30));
        player.call('createGPSBlip', [-828.446, -1086.113, 11.132, `DMV`]);

      } else {
        player.pushChat(`[Info] Welcome back ${player.name} (ID: ${player.id})`, null, 'server-message');
        player.pushChat(`[Info] Last online: ${day}.${month}.${year} at ${hour}:${minutes}.`, null, 'server-message');
        if(player.info.admin != 0) {
          player.pushChat(`[Info] Logged in as Admin ${player.info.admin}.`, null, 'server-message');
        }
        if(databox[4].data.factions[player.info.member].motd != null) {
          player.pushChat('[Faction Motd] ' + databox[4].data.factions[player.info.member].motd, null, 'faction-message');
        }
        mp.events.call("loggedJoin", player);
      }
    } else {
      player.call('prepareCharacter'); 
    }
  });
});

mp.events.add('checkBanStatus', player => {
  let result = false;
  accounts.findOne({ username: player.name }, function (err, user) {
    if (err) return handleError(err);
    if(user != null ) {
      if(user.banStatus && user.banStatus.status == true) {
        let banInfo = user.banStatus;
        player.call('loadBanClient'); 
        player.call('toggleModal', [0, 'nothing', JSON.stringify({ ban: banInfo })]);
        player.kick();
        result = true;
      }
    }
  }).then(() => {
    if(result == false) {
      mp.events.call("setClientAuthPage", player);
    }
  });
});

mp.events.add('setClientAuthPage', player => {
  accounts.findOne({ username: player.name }, function (err, user) {
    if (err) return handleError(err);
    if(user != null ) {
      player.call('authCamera', [1, 'login']);
    } else {
      player.call('authCamera', [1, 'register']);
    }
  });
});

mp.events.add('playerReady', player => {
  player.vars = {};
  player.loggedIn = false;
  player.dimension = ( 1000 + player.id );
  mp.events.call("checkBanStatus", player);
  console.log(`[${player.ip}] ${player.name} has connected to server.`);
});

mp.events.add("playerQuit", (player, exitType, reason) => {
  if(player.loggedIn == true) {
    player.info.online = false;
    player.savePlayerInfo();
    mp.events.call("loggedQuit", player);
  }
});

mp.events.add("loadVariables", player => {

  player.updateSecurityInfo = function() {
    accounts.findOne({ username: player.name }, function (err, user) {
      if(err) return console.log(err);
      user.set({ ip: player.ip, socialClub: player.socialClub, lastConnected: new Date() });
      user.save(function (err, _) {
        if(err) return console.log(err);
      });
    });  
  }
  
  player.savePlayerInfo = function() {
    accounts.findOne({ username: player.name }, function (err, user) {
      if(err) return console.log(err);
      user.set({ 
        info: player.info,
        lastDisconnected: new Date()
      });
      user.save(function (err, _) {
        if(err) return console.log(err);
      });
    });
  }
});
