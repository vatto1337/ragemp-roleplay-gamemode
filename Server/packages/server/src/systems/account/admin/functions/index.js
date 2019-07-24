mp.events.add('loggedJoin', player => {
  player.sendMessageToAdmins(`${player.name} logged in with ip: ${player.ip}`, null, 'admin-message');
});

mp.events.add('registeredJoin', player => {
  player.info.muted = null;
  player.info.admin = 0;
  player.info.warns = 0;
});

mp.events.add('loadVariables', player => {

  let count = 0;
  
  mp.players.forEach((target, index) => {
    if(target.loggedIn && target.loggedIn != true) return;
    count ++;
  });

  mp.players.forEach((target, index) => {
    target.setVariable('playersOnline', count);
  });

  player.vars.adminDuty = false;

  player.checkAdminRank = function (level) {
    if (player.info.admin >= level) {
      return true;
    } else {
      return false;
    }
  }

  player.sendMessageToDutyAdmins = (message, color, clasa) => {
    mp.players.forEach(
      (toplayer) => {
        if(toplayer.loggedIn != true || !toplayer.loggedIn) return;
        if(toplayer.vars.adminDuty == false) return;
        if (toplayer.info.admin != 0) {
          toplayer.pushChat(message, color || null, clasa || null);
        }
      });
  }
  player.sendMessageToAdmins = (message, color, clasa) => {
    mp.players.forEach(
      (toplayer) => {
        if(toplayer.loggedIn != true || !toplayer.loggedIn) return;
        if (toplayer.info.admin != 0) {
          toplayer.pushChat(message, color || null, clasa || null);
        }
      });
  }

  player.sendMessageToFaction = (message, color, clasa) => {
    mp.players.forEach(
      (toplayer) => {
        if(toplayer.loggedIn != true || !toplayer.loggedIn) return;
        if (toplayer.info.member != null && toplayer.info.member == player.info.member) {
          toplayer.pushChat(message, color || null, clasa || null);
        }
      });
  }

  player.respawnMyself = () => {
    mp.events.call("spawnPlayer", player); 
  }

  player.freeze = () => {
    player.call('freezePlayer', [true]);
  }

  player.unfreeze = () => {
    player.call('freezePlayer', [false]);
  }

  player.IsInRange = (x,y,z, range) => {
    x = parseFloat(x), y = parseFloat(y), z = parseFloat(z), range = parseInt(range);
    let dist = player.dist(new mp.Vector3(x,y,z));
    if(dist < range) return true;
    return false;
  }
});

mp.events.add("playerTimer", (player) => {
  player.setVariable('admin', player.info.admin);
  player.setVariable('money', player.info.wallet);
  player.setVariable('bank', player.info.bank);
  player.setVariable('fakeName', player.vars.fakeName);
  let pos = player.position;
  player.setVariable('location', JSON.stringify({ x: pos.x, y: pos.y, z: pos.z }));
});