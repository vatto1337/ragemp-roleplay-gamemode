const accounts = require("../../account/schema/accounts.js");

let ServerStart = 1;
let lastProcessedHour = -1;
let TimeOfDay = null;
let Weather = 1;

function hourlyFunction () {
  let d = new Date(),
      h = d.getHours();

  if (h != lastProcessedHour) {
    if(ServerStart == 0) {
      PayDay();
      SaveDatas();
      saveHouses();
      saveBusinesses();
      unbanPlayers();
      reducePremium();
    }
    lastProcessedHour = h;
    setWorldWeatherAndTime();
    ServerStart = 0;
  }
  PlayerTimer();
}

setInterval(hourlyFunction, 1000);

hourlyFunction();

function PlayerTimer() {
  mp.players.forEach((player) => {
    if(!player.vars || !player.info) return;
    if(player.loggedIn == false) return;
    mp.events.call("playerTimer", player);
  });  
}

function setWorldWeatherAndTime() {
  let d = new Date(), h = d.getHours(), m = d.getMonth() + 1, ms = d.getMinutes(), s = d.getSeconds(); 
  if(TimeOfDay != null) {
    mp.world.time.set(TimeOfDay, ms, s);
  } else {
    mp.world.time.set(h, ms, s);
  }

  if(Weather == 0) {
    mp.world.weather = 'EXTRASUNNY';
  } else if(Weather == 1) {
    mp.world.weather = 'CLOUDS';
  } else if(Weather == 2) {
    mp.world.weather = 'RAIN';
  } else if(Weather == 3) {
    mp.world.weather = 'SNOW';
  }
}

global.setTimeOfDay = function(time) {
  TimeOfDay = time;
  if(time == 24) { TimeOfDay = null; }
  setWorldWeatherAndTime();
}

global.setWeather = function(id) {
  Weather = id;
  setWorldWeatherAndTime();
}

function unbanPlayers() {

  let unBanQuery = accounts.find({ 'banStatus.status' : true }, function (err, user) {
    if(err) return console.log(err);
  });

  unBanQuery.then((users) => {
    users.forEach((user) => {
      user.set({ 'banStatus.timeLeft' : user.banStatus.timeLeft - 1 });
      user.save(function (err, updatedUser) {
        if(err) return console.log(err);
        if(updatedUser.banStatus.timeLeft < 1) {
          updatedUser.set({ 'banStatus' : null });
          updatedUser.save(function (err, _updatedUser) {
            if(err) return console.log(err);
          });
        }
      });
    });
  });
}

function reducePremium() {
  let premiumQuery = accounts.find({ 'info.premium' : { $gt: 0 }, 'info.online': false }, function (err, user) {
    if(err) return console.log(err);
  });
  premiumQuery.then((users) => {
    users.forEach((user) => {
      user.set({ 'info.premium' : user.info.premium - 1 });
      user.save();
    });
  });
}

