//To-do: Comanda prin intermediul carei sa setezi un checkpoint pe harta altei persoane. (/sendlocation)  ( Sau in SMS sa ai un buton de trimis locatie si daca da click sa dea gps)
// Phone UI
// ^ Youtube App.
// ^ SMS app (Sa le trimiti un mesaj, o variabila SMS Messages in Vue, cand jucatoru trimite cuiva, sa ii treaca lui si celuiallt ap, sms.push :D :D )
// ^ Custom contacts, sa le treci numaru si apoi telefonu.
// ^ App cu toti jucatorii din joc + nr lor
// Animatie de vorbit la tel in masina:   if(player.vehicle) { player.playAnimation("anim@cellphone@in_car@ds", "cellphone_call_listen_base", 1, 49); }


mp.events.add("loadVariables", player => {
  player.vars.phone = {
    callingTo: null,
    speaking: false,
    speakingTo: null,
    callingTime: null,
    calling: false,
    animated: false,
    animatedFix: false
  }
});

mp.events.addCommand("youtube", (player, fullText) => {
  if(!player.hasItemInInventory('Cell Phone')) return player.pushError("You must own a cell phone to use this command.");
  if(player.vars.tog.youtube == false) return player.pushError("You must enable youtube to use this. Use /tog to do so.");
  if(player.vars.bizzEntered != null && Business[player.vars.bizzEntered].type == 7) return player.pushError("You can't use this command inside the club.");
  player.call('toggleModal', [11, 'chat', JSON.stringify({ youtube: { search: '', result: [] } })]);
});

mp.events.addCommand("number", (player, fullText, target) => {
  if(!player.hasItemInInventory('Phone Book')) return player.pushError("You don't own a phone book.");
  if(target == undefined) return player.pushExample('/number [Player ID / Name]');
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(!target.hasItemInInventory('Cell Phone')) return player.pushError("This player is not owning a phone!");
  let phone = target.getItemFromInventory('Cell Phone')[0];
  player.pushChat(`* ${target.name} phone number is: ${formatMoney(phone.number, 0, '-', '-')}.`);
});

mp.events.addCommand("sms", (player, fullText, number, ...message) => {
  if(!player.hasItemInInventory('Cell Phone')) return player.pushError("You don't own a cell phone.");
  if(player.vars.tog.phone == false) return player.pushError("Your cell phone is turned off. Use /tog to turn it on.");
  if(number == undefined || message == undefined) return player.pushExample('/sms [Phone Number] [Message]');
  message = stripStuff(message.join(" "));
  let found = false;
  mp.players.forEach((p) => {
    if(found == true) return;
    if(!p.loggedIn || p.loggedIn == false) return;
    if(!p.hasItemInInventory('Cell Phone')) return;
    if(p.vars.tog.phone == false) return player.pushError("This player has his phone turned off."), result = true;
    if(p == player) return player.pushError("You can't send a message to yourself."), result = true;
    let phone = player.getItemFromInventory('Cell Phone')[0];
    if(phone.number == number || number == formatMoney(phone.number, 0, '-', '-')) {
      p.pushChat(`SMS from ${player.name} (${formatMoney(phone.number, 0, '-', '-')}): ${message}`, '#eccd2d');
      player.pushChat(`SMS sent to ${p.name}: ${message}`, '#eee854');
      found = true;
    }
  });
  if(found == false) return player.pushError('There is no player with this phone number.');
});

mp.events.addCommand("call", (player, fullText, number) => {
  if(!player.hasItemInInventory('Cell Phone')) return player.pushError("You don't own a cell phone.");
  if(number == undefined) return player.pushExample('/call [Phone Number]');
  if(player.vars.phone.speaking == true) return player.pushError("You're already speaking to someone. Use /h(angup) first.");
  if(player.vars.phone.callingTo != null) return player.pushError("You're already calling someone. Use /h(angup) first.");
  if(player.vars.tog.phone == false) return player.pushError("Your phone is turned off. Use /tog to turn it on.");
  let found = false;
  if(number == 911) {
    if(player.vars.killedSeconds != 0) {
      let target = player.vars.killedBy;
      target.info.wanted += wanted;
      target.pushChat(`You've commited a crime. (Homicide) - Reporter: ${player.name}.`, null, 'faction-message');
      player.sendMessageToFaction(`HQ: All units APB: Reporter: ${player.name}`, null, 'faction-message');
      player.sendMessageToFaction(`HQ: Crime: Homicide, Suspect: ${target.name} (${target.id}), Wanted Level: ${target.info.wanted}`, null, 'faction-message');
      player.vars.killedSeconds = 0;
      return false;
    }
  }

  mp.players.forEach((p) => {
    if(found == true) return;
    if(!p.loggedIn || p.loggedIn == false) return;
    if(!p.hasItemInInventory('Cell Phone')) return;
    if(p.vars.tog.phone == false) return player.pushError("This player has his phone turned off."), found = true;
    if(p.vars.phone.speaking == true) return player.pushError("This player is already speaking with someone."), found = true;
    if(p.getItemFromInventory('Cell Phone')[0].number == number || number == formatMoney(p.getItemFromInventory('Cell Phone')[0].number,0, '-', '-')) {
      if(p == player) return player.pushError("You can't call yourself."), found = true;
      player.vars.phone.callingTo = p;
      player.vars.phone.calling = true;
      player.pushChat(`* You're calling ${formatMoney(number, 0, '-', '-')} ..  (Use /h(angup) to stop calling)`, null, 'action-message');
      p.pushChat(`* Your phone is ringing, ${player.name} calls you .. (/p(ickup) ${player.id})`, null, 'action-message');
      found = true;
    }
  });
  if(found == false) return player.pushError('There is no player with this phone number.');
});

function cmd_hangup(player, fullText) {
  if(!player.hasItemInInventory('Cell Phone')) return player.pushError("You don't own a cell phone.");
  if(player.vars.phone.callingTo != null || player.vars.phone.speakingTo != null) {
    if(player.vars.phone.speakingTo != null) {
      let p = player.vars.phone.speakingTo;
      p.vars.phone.callingTo = null;
      p.vars.phone.speakingTo = null;
      p.vars.phone.speaking = false;
      // if(p.vars.phone.calling == true) {
      //   p.giveSubtitle(`This phone conversation took ${p.vars.phone.callingTime} credits.`, 20);
      // }
      p.vars.phone.callingTime = null;
      p.vars.phone.calling = false;
      p.pushLocalChat(`* ${p.name} put his phone back into his pocket.`, null, 'action-message');
      p.call("playSoundEffect", ["Hang_Up", "Phone_SoundSet_Michael"]);
      if(p.vars.phone.animated == true) {
        if(!p.vehicle) {
          p.stopAnimation();
        } else {
          p.vars.phone.animatedFix = true;
        }
        p.vars.phone.animated = false;
      }
    }
    player.vars.phone.callingTo = null;
    player.vars.phone.speakingTo = null;
    // if(player.vars.phone.speaking == true && player.vars.phone.calling == true) {
    //   player.giveSubtitle(`This phone conversation took ${player.vars.phone.callingTime} credits.`, 20);
    // }
    player.vars.phone.speaking = false;
    player.vars.phone.calling = false;
    player.vars.phone.callingTime = null;
    player.pushLocalChat(`* ${player.name} put his phone back into his pocket.`, null, 'action-message');
    player.call("playSoundEffect", ["Hang_Up", "Phone_SoundSet_Michael"]);
    if(player.vars.phone.animated == true) {
      if(!player.vehicle) {
        player.stopAnimation();
      } else {
        player.vars.phone.animatedFix = true;
      }
      player.vars.phone.animated = false;
    }
  }
}

mp.events.addCommand("h", cmd_hangup);
mp.events.addCommand("hangup", cmd_hangup);

function cmd_pickup(player, fullText, target) {
  if(!player.hasItemInInventory('Cell Phone')) return player.pushError("You don't own a cell phone.");
  if(target == undefined) return player.pushExample("/p(ickup) [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target.vars.phone.callingTo != player) return player.pushError("This player is not calling you.");
  if(target.vars.phone.speaking == true) return player.pushError("This player is already speaking to someone.");
  target.vars.phone.callingTo = null;
  target.vars.phone.speaking = true;
  target.vars.phone.speakingTo = player;
  player.vars.phone.speaking = true;
  player.vars.phone.speakingTo = target;
  if(!player.vehicle) { 
    player.playAnimation("amb@world_human_stand_mobile@male@standing@call@idle_a", "idle_a", 1, 49); 
  } else {
    player.playAnimation("anim@cellphone@in_car@ds", "cellphone_call_listen_base", 1, 49);
  }
  if(!target.vehicle) { 
    target.playAnimation("amb@world_human_stand_mobile@male@standing@call@idle_a", "idle_a", 1, 49); 
  } else {
    target.playAnimation("anim@cellphone@in_car@ds", "cellphone_call_listen_base", 1, 49);
  }
  player.vars.phone.animated = true; 
  target.vars.phone.animated = true;
  player.pushLocalChat(`* ${player.name} picks up the phone from his pocket and starts talking.`, null, 'action-message');
  target.pushLocalChat(`* ${target.name} picks up the phone from his pocket and starts talking`, null, 'action-message');
}

mp.events.addCommand("p", cmd_pickup);
mp.events.addCommand("pickup", cmd_pickup);

mp.events.add("loggedQuit", (player, exitType, reason) => {
  if(player.vars && player.vars.phone) {
    if(player.hasItemInInventory('Cell Phone') && player.vars.phone.speaking == true) {
      let p = player.vars.phone.speakingTo;
      p.vars.phone.callingTo = null;
      p.vars.phone.speakingTo = null;
      p.vars.phone.speaking = false;
      // if(p.vars.phone.calling == true) {
      //   p.giveSubtitle(`This phone conversation took ${p.vars.phone.callingTime} credits. (Player quit)`, 20);
      // }
      p.call("playSoundEffect", ["Hang_Up", "Phone_SoundSet_Michael"]);
      p.vars.phone.callingTime = null;
      p.vars.phone.calling = false;
      p.pushLocalChat(`* ${p.name} put his phone back into his pocket.`, null, 'action-message');
      player.vars.phone.callingTo = null;
      player.vars.phone.speakingTo = null;
      player.vars.phone.speaking = false;
      player.vars.phone.calling = false;
      p.vars.phone.callingTime = null;
      if(p.vars.phone.animated == true) {
        if(!p.vehicle) {
          p.stopAnimation();
        } else {
          p.vars.phone.animatedFix = true;
        }
      }
    }
  }
});

mp.events.add("playerChat", (player,message) => {
  if(player.loggedIn == true && player.vars.phone.speaking == true) {
    if(player.info.muted != null) return;
    message = stripStuff(message);
    mp.players.forEach((p) => {
      if(!p.loggedIn || p.loggedIn == false) return;
      if(player == p || p != player.vars.phone.speakingTo) return;
      message = `(Cellphone) ${player.name} says: ${message}`;
      p.pushChat(message, '#eccd2d');
    });
    message = `(Cellphone) ${player.name} says: ${message}`;
    player.pushChat(message, '#eee854');
  }
});

// mp.events.add("playerTimer", (player) => {
//   if(player.vars.phone.speaking == true && player.vars.phone.calling == true) {
//     player.info.phoneCredits --;
//     player.vars.phone.callingTime ++;
//     if(player.info.phoneCredits == 0) {
//       let p = player.vars.phone.speakingTo;
//       p.vars.phone.callingTo = null;
//       p.vars.phone.speakingTo = null;
//       p.vars.phone.speaking = false;
//       p.vars.phone.callingTime = null;
//       if(p.vars.phone.calling == true) {
//         p.giveSubtitle(`This phone conversation took ${player.vars.phone.callingTime} credits.`, 20);
//       }
//       p.vars.phone.calling = false;
//       p.vars.phone.callingTime = null;
//       p.pushLocalChat(`* ${p.name} put his phone back into his pocket.`, null, 'action-message');
//       if(p.vars.phone.animated == true) {
//         if(!p.vehicle) {
//           p.stopAnimation();
//         }
//       }
//       player.vars.phone.callingTo = null;
//       player.vars.phone.speakingTo = null;
//       player.vars.phone.speaking = false;
//       player.vars.phone.callingTime = null;
//       if(player.vars.phone.calling == true) {
//         player.giveSubtitle(`This phone conversation took ${player.vars.phone.callingTime} credits.`, 20);
//       }
//       player.vars.phone.calling = false;
//       if(player.vars.phone.animated == true) {
//         if(!player.vehicle) {
//           player.stopAnimation();
//         }
//       }      
//       player.pushLocalChat(`* ${player.name} put his phone back into his pocket.`, null, 'action-message');
//     }
//   }
// });

mp.events.add("playerEnterVehicle", (player, vehicle, seat) => { 
  if(player.vars.phone.animated == true) {
    player.playAnimation("anim@cellphone@in_car@ds", "cellphone_call_listen_base", 1, 49);
  }
});

mp.events.add("playerExitVehicle", (player, vehicle) => {
  if(player.vars.phone.animated == true) {
    player.playAnimation("amb@world_human_stand_mobile@male@standing@call@idle_a", "idle_a", 1, 49); 
  }

  if(player.vars.phone.animatedFix == true && player.vars.phone.animated == false) {
    player.stopAnimation();
    player.vars.phone.animatedFix = false;
  }
});