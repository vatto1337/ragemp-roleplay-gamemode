let spawns = {
  general: 
  [
    [ -1041.917, -2745.744, 21.359, 330.450 ]
  ]
}

mp.events.add("hospitalized", (player) => {
  player.spawn(new mp.Vector3(307.212, -1433.899, 29.889));
  player.position = new mp.Vector3(307.212, -1433.899, 29.889);
  player.heading = 141.800;
  player.health = player.getMoney() > 150 ? 100 : 50;
  player.armour = 0;
  player.dimension = 0;
  player.pushChat(`You were injured in an accident and needed to be hospitalized.`, null, 'server-message');
  player.pushChat(`You have been discharged from hospital today. Bill cost: ${player.getMoney() > 150 ? '150$' : 'None' }`, null, 'server-message');
  player.vars.hospitalized = false;
  if(player.getMoney > 150) {
    player.takeMoney(150);
  }
  player.model = player.info.character.model;
  mp.events.call("loadClothes", player);
});

mp.events.add("spawnPlayer", (player) => {
  
  if(player.vars.houseEntered != null) { player.vars.houseEntered = null ; }
  if(player.vars.bizzEntered != null) { player.vars.bizzEntered = null; }
  if(player.vars.usingBizz != null) { player.vars.usingBizz = null; }
  if(player.info.prisonTime && player.info.prisonTime != 0) {
    let jailCells = [
      [459.784, -994.225, 24.915, 280.496], // jail1 (ped)
      [459.431, -998.052, 24.915, 273.883], // jail2 (ped)
      [459.310, -1001.653, 24.915, 262.609] // jail3 (ped)
    ]
    let cell = jailCells[Math.floor(Math.random() * jailCells.length)];
    player.spawn(new mp.Vector3(cell[0], cell[1], cell[2]));
    player.position = new mp.Vector3(cell[0], cell[1], cell[2]);
    player.health = 100;
    player.armour = 0;
    player.model = player.info.character.model;
    mp.events.call("loadClothes", player);
    return false;
  }
  if(player.vars.hospitalized == true) return mp.events.call("hospitalized", player);
  if(player.info.spawn == 1) {
    if(player.getItemFromInventory('House Key') || player.getItemFromInventory('House Contract')) {
      let h = player.info.houseSpawn;
      player.vars.houseEntered = h;
      player.dimension = h;
      player.spawn(new mp.Vector3(Houses[h].exit.x, Houses[h].exit.y, Houses[h].exit.z));
      player.position = new mp.Vector3(Houses[h].exit.x, Houses[h].exit.y, Houses[h].exit.z);
      player.health = 100;
      player.armour = 0;
      player.model = player.info.character.model;
      mp.events.call("loadClothes", player);
    }
  }
  else if(player.info.spawn == 2) {
    if(player.info.member != null && Factions[player.info.member] != undefined) {
      let f = player.info.member;
      if(Factions[f].hasEntrance == true) {
        player.vars.factionEntered = f;
      }
      player.dimension = Factions[f].dimension;
      player.spawn(new mp.Vector3(Factions[f].spawn[0], Factions[f].spawn[1], Factions[f].spawn[2]));
      player.position = new mp.Vector3(Factions[f].spawn[0], Factions[f].spawn[1], Factions[f].spawn[2]);
      player.health = 100;
      player.armour = 0;
      player.model = player.info.character.model;
      mp.events.call("loadClothes", player);
    }
  } 
  else {
    let chosenSpawn = Math.floor(Math.random() * spawns.general.length);
    player.spawn(new mp.Vector3(spawns.general[chosenSpawn][0], spawns.general[chosenSpawn][1], spawns.general[chosenSpawn][2]));
    player.position = new mp.Vector3(spawns.general[chosenSpawn][0], spawns.general[chosenSpawn][1], spawns.general[chosenSpawn][2]);
    player.heading = spawns.general[chosenSpawn][3];
    player.armour = 0;
    player.health = 100;
    player.dimension = 0;
    player.model = player.info.character.model;
    mp.events.call("loadClothes", player);
  }
});

mp.events.add("loggedQuit", (player, exitType, reason) => {
  if(player.vars && player.vars.deathTimer) {
    clearTimeout(player.vars.deathTimer);
  }
});

mp.blips.new(120, new mp.Vector3(spawns.general[0][0], spawns.general[0][1], spawns.general[0][2]),{ name: 'General Spawn',  color: 45, shortRange: true,  dimension: 0});