mp.events.addCommand("enter", (player, fullText) => {
  mp.events.call("commandEnterEvent", player);
});

mp.events.addCommand("exit", (player, fullText) => {
  mp.events.call("commandExitEvent", player);
});

mp.events.add('registeredJoin', player => {
  player.info.spawn = 0;
  player.info.houseSpawn = null;
  player.info.respect = 0;
  player.info.hoursPlayed = 0;
  player.info.licenses = {
    driving: false,
    weapon: false
  }
});

mp.events.add("loadVariables", player => {
  player.vars.hospitalized = false;
  player.vars.fakeName = null;
  player.vars.ConnectedTime = new Date();
  player.vars.newbie = null;
  player.vars.newbieQuestion = null;
  player.vars.tog = {
    newbie: true,
    phone: true,
    youtube: true,
    group: true
  };
  player.vars.invitations = {
    ticket: {
      to: null,
      money: null
    },
    dice: {
      to: null,
      money: null
    },
    faction: null,
    group: null,
    free: {
      to: null,
      money: null
    }
  }
});

mp.events.add("playerTimer", (player) => {

  if(player.info.muted != null) {
    player.info.muted -= 1000;
    if(player.info.muted < 1) {
      player.notify("You're no longer muted.~n~ You can speak again!");
      player.info.muted = null;
    }  
  }  

  if(player.vars.newbie > 0) {
    player.vars.newbie --;
    if(player.vars.newbie < 1) {
      player.vars.newbie = null;
    }
  }

});


global.PayDay = function () {
  mp.players.forEach((player) => {
    if(!player.vars || !player.info) return;
    if(!player.loggedIn || player.loggedIn == false) return;
    // if(player.vars.AfkTime > 1800) return player.pushError("You did not get this payday because of too much afk time.");
    // console.log('afk time', player.vars.AfkTime);
    let paycheck = player.info.paycheck;
    if(player.info.premium != 0) {
      paycheck = paycheck + ((paycheck / 100) * 10);
    }
    if(player.info.fpunish > 0) { player.info.fpunish --; }
    if(!(player.vars.ConnectedTime - new Date()) / 1000 < 600) {
      player.pushChat(`___[PAYDAY ARRIVED]___`, null, 'server-message');
      player.pushChat(`Income received: ${player.formatMoney(paycheck, 0)}$`, null, 'server-message');
      
  
      // if(player.info.premium != 0) {
      //   player.pushChat(`Income bonus: ${player.formatMoney(500, 0)}$`, null, 'server-message');
      // }
  
      let RentStatus = 1;
      let RentPaid = 0;
  
      player.pushChat(`Balance: ${player.formatMoney(player.info.bank, 0)}$`, null, 'server-message');    
      player.info.bank += paycheck;
      if(player.hasItemInInventory('House Key')) {
        let h = player.getItemFromInventory('House Key')[0].house_id;
        if(player.info.bank >= Houses[h].rentPrice) {
          player.pushChat(`Rent price: ${player.formatMoney(Houses[h].rentPrice, 0)}$ `, null, 'server-message');
          player.info.bank -= Houses[h].rentPrice;
          Houses[h].safe += Houses[h].rentPrice;
          Houses[h].taxes += ( Houses[h].rentPrice / 100 ) * databox[0].data.taxes.house;
          RentPaid = 1;
        }
        else if(player.getMoney() >= Houses[h].rentPrice && RentPaid == 0) {
          player.pushChat(`Rent price: ${player.formatMoney(Houses[h].rentPrice, 0)}$ `, null, 'server-message');
          player.takeMoney(Houses[h].rentPrice);
          Houses[h].safe += Houses[h].rentPrice;
          Houses[h].taxes += ( Houses[h].rentPrice / 100 ) * databox[0].data.taxes.house;
          RentPaid = 1;
        }
        else {
          RentStatus = 0;
        }
      }
      player.pushChat(`Interest rate: ${player.info.premium != 0 ? '0.3' : '0.1'}%`, null, 'server-message');
      player.pushChat(`Interest gained: ${player.formatMoney(( (player.info.premium != 0 ? 0.3 : 0.1 ) / 100 ) * player.info.bank, 0)}$`, null, 'server-message');
      player.info.bank += ( (player.info.premium != 0 ? 0.3 : 0.1 ) / 100 ) * player.info.bank;
      player.info.respect ++;
      player.info.hoursPlayed ++;
      player.pushChat(`New balance: ${player.formatMoney(player.info.bank, 0)}$`, null, 'server-message');
      if(RentStatus == 0) {
        player.pushChat(`Rent: You're now homeless because you did not paid the rent. `, null, 'server-message');
        player.removeItemByName('House Key');
        player.info.spawn = 0;
        player.info.houseSpawn = null;
      }
      player.pushChat(`____________________`, null, 'server-message');
    } else {
      player.pushError(`You did not get this payday. Not enough time played.`, null, 'server-error');
    }
    if(player.info.premium != 0) {
      player.info.premium --;
      if(player.info.premium < 1) {
        player.pushChat('Your premium account status has expired.', null, 'premium-message');
        player.info.premium = 0;
      }
    }
    player.savePlayerInfo();
  });
}

mp.events.add('playerCommand', (player, command) => {        
  player.pushError(`/${command} is not a valid command. Press F2 to find a list of commands.`);
});