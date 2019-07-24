
mp.events.addCommand("muscle", (player, fullText, id) => {
  if (id == undefined || parseInt(id) > 3 || parseInt(id) < 1) return player.pushExample('/muscle 1-3');
  switch (parseInt(id)) {
    case 1:
      player.playScenario('WORLD_HUMAN_PUSH_UPS');
      break;
    case 2:
      player.playScenario('WORLD_HUMAN_MUSCLE_FLEX');
      break;
    case 3:
      player.playScenario('WORLD_HUMAN_SIT_UPS');
      break;
  }
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("bird", (player, fullText, id) => {
  if (id == undefined || parseInt(id) > 2 || parseInt(id) < 1) return player.pushExample('/bird 1-2')
  switch (parseInt(id)) {
    case 1:
      player.playAnimation("anim@mp_player_intselfiethe_bird", "idle_a", 1, 18);
      break;
    case 2:
      player.playAnimation("anim@mp_player_intupperfinger", "idle_a", 1, 18);
      break;
  }
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("facepalm", (player, fullText) => {
  player.playAnimation("anim@mp_player_intupperface_palm", "idle_a", 1, 18);
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("prostitute", (player, fullText, id) => {
  if (id == undefined || parseInt(id) > 2 || parseInt(id) < 1) return player.pushExample('/prostitute 1-2')
  switch (parseInt(id)) {
    case 1:
      player.playScenario('WORLD_HUMAN_PROSTITUTE_HIGH_CLASS');
      break;
    case 2:
      player.playScenario('WORLD_HUMAN_PROSTITUTE_LOW_CLASS');
      break;
  }
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("sit", (player, fullText, id) => {
  if (id == undefined || parseInt(id) > 4 || parseInt(id) < 1) return player.pushExample('/sit 1-4')
  switch (parseInt(id)) {
    case 1:
      player.playScenario('WORLD_HUMAN_PICNIC');
      break;
    case 2:
      player.playScenario('WORLD_HUMAN_STUPOR');
      break;
    case 3:
      player.playScenario('WORLD_HUMAN_SUNBATHE');
      break;
    case 4:
      player.playScenario('WORLD_HUMAN_SUNBATHE_BACK');
      break;
  }
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("chairsit", (player, fullText, id) => {
  if (id == undefined || parseInt(id) > 4 || parseInt(id) < 1) return player.pushExample('/chairsit 1-4')
  switch (parseInt(id)) {
    case 1:
      player.playScenario('PROP_HUMAN_SEAT_ARMCHAIR');
      break;
    case 2:
      player.playScenario('PROP_HUMAN_SEAT_BENCH');
      break;
    case 3:
      player.playScenario('PROP_HUMAN_SEAT_CHAIR');
      break;
    case 4:
      player.playScenario('PROP_HUMAN_SEAT_DECKCHAIR');
      break;
  }
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});


mp.events.addCommand("stopanim", (player, fullText) => {
  if(player.vars.handcuffed == true) return player.pushError("You can't use this command while being cuffed.");
  player.stopAnimation();
});

mp.events.addCommand("sleep", (player, fullText) => {
  player.playScenario('WORLD_HUMAN_BUM_SLUMPED');
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("partying", (player, fullText) => {
  player.playScenario('WORLD_HUMAN_PARTYING');
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("cheering", (player, fullText) => {
  player.playScenario('WORLD_HUMAN_CHEERING');
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("leaning", (player, fullText) => {
  player.playScenario('WORLD_HUMAN_LEANING');
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("yoga", (player, fullText) => {
  player.playScenario('WORLD_HUMAN_YOGA');
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});


let dances = ["hi_dance_crowd_09_v1_female^1", "hi_dance_crowd_09_v1_female^2", "hi_dance_crowd_09_v1_female^3", "hi_dance_crowd_09_v1_female^4", "hi_dance_crowd_09_v1_female^5", "hi_dance_crowd_09_v1_female^6", "hi_dance_crowd_09_v1_male^1", "hi_dance_crowd_09_v1_male^2", "hi_dance_crowd_09_v1_male^3", "hi_dance_crowd_09_v1_male^4", "hi_dance_crowd_09_v1_male^5", "hi_dance_crowd_09_v1_male^6", "hi_dance_crowd_09_v2_female^1", "hi_dance_crowd_09_v2_female^2", "hi_dance_crowd_09_v2_female^3", "hi_dance_crowd_09_v2_female^4", "hi_dance_crowd_09_v2_female^5", "hi_dance_crowd_09_v2_female^6", "hi_dance_crowd_09_v2_male^1", "hi_dance_crowd_09_v2_male^2", "hi_dance_crowd_09_v2_male^3", "hi_dance_crowd_09_v2_male^4", "hi_dance_crowd_09_v2_male^5", "hi_dance_crowd_09_v2_male^6", "hi_dance_crowd_11_v1_female^1", "hi_dance_crowd_11_v1_female^2", "hi_dance_crowd_11_v1_female^3", "hi_dance_crowd_11_v1_female^4", "hi_dance_crowd_11_v1_female^5", "hi_dance_crowd_11_v1_female^6", "hi_dance_crowd_11_v1_male^1", "hi_dance_crowd_11_v1_male^2", "hi_dance_crowd_11_v1_male^3", "hi_dance_crowd_11_v1_male^4", "hi_dance_crowd_11_v1_male^5", "hi_dance_crowd_11_v1_male^6", "hi_dance_crowd_13_v2_female^1", "hi_dance_crowd_13_v2_female^2", "hi_dance_crowd_13_v2_female^3", "hi_dance_crowd_13_v2_female^4", "hi_dance_crowd_13_v2_female^5", "hi_dance_crowd_13_v2_female^6", "hi_dance_crowd_13_v2_male^1", "hi_dance_crowd_13_v2_male^2", "hi_dance_crowd_13_v2_male^3", "hi_dance_crowd_13_v2_male^4", "hi_dance_crowd_13_v2_male^5", "hi_dance_crowd_13_v2_male^6", "hi_dance_crowd_15_v1_female^1", "hi_dance_crowd_15_v1_female^2", "hi_dance_crowd_15_v1_female^3", "hi_dance_crowd_15_v1_female^4", "hi_dance_crowd_15_v1_female^5", "hi_dance_crowd_15_v1_female^6", "hi_dance_crowd_15_v1_male^1", "hi_dance_crowd_15_v1_male^2", "hi_dance_crowd_15_v1_male^3", "hi_dance_crowd_15_v1_male^4", "hi_dance_crowd_15_v1_male^5", "hi_dance_crowd_15_v1_male^6", "hi_dance_crowd_15_v2_female^1", "hi_dance_crowd_15_v2_female^2", "hi_dance_crowd_15_v2_female^3", "hi_dance_crowd_15_v2_female^4", "hi_dance_crowd_15_v2_female^5", "hi_dance_crowd_15_v2_female^6", "hi_dance_crowd_15_v2_male^1", "hi_dance_crowd_15_v2_male^2", "hi_dance_crowd_15_v2_male^3", "hi_dance_crowd_15_v2_male^4", "hi_dance_crowd_15_v2_male^5", "hi_dance_crowd_15_v2_male^6", "hi_dance_crowd_17_v1_female^1", "hi_dance_crowd_17_v1_female^2", "hi_dance_crowd_17_v1_female^3", "hi_dance_crowd_17_v1_female^4", "hi_dance_crowd_17_v1_female^5", "hi_dance_crowd_17_v1_female^6", "hi_dance_crowd_17_v1_male^1", "hi_dance_crowd_17_v1_male^2", "hi_dance_crowd_17_v1_male^3", "hi_dance_crowd_17_v1_male^4", "hi_dance_crowd_17_v1_male^5", "hi_dance_crowd_17_v1_male^6", "hi_dance_crowd_17_v2_female^1", "hi_dance_crowd_17_v2_female^2", "hi_dance_crowd_17_v2_female^3", "hi_dance_crowd_17_v2_female^4", "hi_dance_crowd_17_v2_female^5", "hi_dance_crowd_17_v2_female^6", "hi_dance_crowd_17_v2_male^1", "hi_dance_crowd_17_v2_male^2", "hi_dance_crowd_17_v2_male^3", "hi_dance_crowd_17_v2_male^4", "hi_dance_crowd_17_v2_male^5", "hi_dance_crowd_17_v2_male^6", "li_dance_crowd_09_v1_female^1", "li_dance_crowd_09_v1_female^2", "li_dance_crowd_09_v1_female^3", "li_dance_crowd_09_v1_female^4", "li_dance_crowd_09_v1_female^5", "li_dance_crowd_09_v1_female^6", "li_dance_crowd_09_v1_male^1", "li_dance_crowd_09_v1_male^2", "li_dance_crowd_09_v1_male^3", "li_dance_crowd_09_v1_male^4", "li_dance_crowd_09_v1_male^5", "li_dance_crowd_09_v1_male^6", "li_dance_crowd_09_v2_female^1", "li_dance_crowd_09_v2_female^2", "li_dance_crowd_09_v2_female^3", "li_dance_crowd_09_v2_female^4", "li_dance_crowd_09_v2_female^5", "li_dance_crowd_09_v2_female^6", "li_dance_crowd_09_v2_male^1", "li_dance_crowd_09_v2_male^2", "li_dance_crowd_09_v2_male^3", "li_dance_crowd_09_v2_male^4", "li_dance_crowd_09_v2_male^5", "li_dance_crowd_09_v2_male^6", "li_dance_crowd_11_v1_female^1", "li_dance_crowd_11_v1_female^2", "li_dance_crowd_11_v1_female^3", "li_dance_crowd_11_v1_female^4", "li_dance_crowd_11_v1_female^5", "li_dance_crowd_11_v1_female^6", "li_dance_crowd_11_v1_male^1", "li_dance_crowd_11_v1_male^2", "li_dance_crowd_11_v1_male^3", "li_dance_crowd_11_v1_male^4", "li_dance_crowd_11_v1_male^5", "li_dance_crowd_11_v1_male^6", "li_dance_crowd_11_v2_female^1", "li_dance_crowd_11_v2_female^2", "li_dance_crowd_11_v2_female^3", "li_dance_crowd_11_v2_female^4", "li_dance_crowd_11_v2_female^5", "li_dance_crowd_11_v2_female^6", "li_dance_crowd_11_v2_male^1", "li_dance_crowd_11_v2_male^2", "li_dance_crowd_11_v2_male^3", "li_dance_crowd_11_v2_male^4", "li_dance_crowd_11_v2_male^5", "li_dance_crowd_11_v2_male^6", "li_dance_crowd_13_v1_female^1", "li_dance_crowd_13_v1_female^2", "li_dance_crowd_13_v1_female^3", "li_dance_crowd_13_v1_female^4", "li_dance_crowd_13_v1_female^5", "li_dance_crowd_13_v1_female^6", "li_dance_crowd_13_v1_male^1", "li_dance_crowd_13_v1_male^2", "li_dance_crowd_13_v1_male^3", "li_dance_crowd_13_v1_male^4", "li_dance_crowd_13_v1_male^5", "li_dance_crowd_13_v1_male^6", "li_dance_crowd_13_v2_female^1", "li_dance_crowd_13_v2_female^2", "li_dance_crowd_13_v2_female^3", "li_dance_crowd_13_v2_female^4", "li_dance_crowd_13_v2_female^5", "li_dance_crowd_13_v2_female^6", "li_dance_crowd_13_v2_male^1", "li_dance_crowd_13_v2_male^2", "li_dance_crowd_13_v2_male^3", "li_dance_crowd_13_v2_male^4", "li_dance_crowd_13_v2_male^5", "li_dance_crowd_13_v2_male^6", "li_dance_crowd_15_v1_female^1", "li_dance_crowd_15_v1_female^2", "li_dance_crowd_15_v1_female^3", "li_dance_crowd_15_v1_female^4", "li_dance_crowd_15_v1_female^5", "li_dance_crowd_15_v1_female^6", "li_dance_crowd_15_v1_male^1", "li_dance_crowd_15_v1_male^2", "li_dance_crowd_15_v1_male^3", "li_dance_crowd_15_v1_male^4", "li_dance_crowd_15_v1_male^5", "li_dance_crowd_15_v1_male^6", "li_dance_crowd_15_v2_female^1", "li_dance_crowd_15_v2_female^2", "li_dance_crowd_15_v2_female^3", "li_dance_crowd_15_v2_female^4", "li_dance_crowd_15_v2_female^5", "li_dance_crowd_15_v2_female^6", "li_dance_crowd_15_v2_male^1", "li_dance_crowd_15_v2_male^2", "li_dance_crowd_15_v2_male^3", "li_dance_crowd_15_v2_male^4", "li_dance_crowd_15_v2_male^5", "li_dance_crowd_15_v2_male^6", "li_dance_crowd_17_v1_female^1", "li_dance_crowd_17_v1_female^2", "li_dance_crowd_17_v1_female^3", "li_dance_crowd_17_v1_female^4", "li_dance_crowd_17_v1_female^5", "li_dance_crowd_17_v1_female^6", "li_dance_crowd_17_v1_male^1", "li_dance_crowd_17_v1_male^2", "li_dance_crowd_17_v1_male^3", "li_dance_crowd_17_v1_male^4", "li_dance_crowd_17_v1_male^5", "li_dance_crowd_17_v1_male^6", "li_dance_crowd_17_v2_female^1", "li_dance_crowd_17_v2_female^2", "li_dance_crowd_17_v2_female^3", "li_dance_crowd_17_v2_female^4", "li_dance_crowd_17_v2_female^5", "li_dance_crowd_17_v2_female^6", "li_dance_crowd_17_v2_male^1", "li_dance_crowd_17_v2_male^2", "li_dance_crowd_17_v2_male^3", "li_dance_crowd_17_v2_male^4", "li_dance_crowd_17_v2_male^5", "li_dance_crowd_17_v2_male^6", "mi_dance_crowd_09_v2_female^1", "mi_dance_crowd_09_v2_female^2", "mi_dance_crowd_09_v2_female^3", "mi_dance_crowd_09_v2_female^4", "mi_dance_crowd_09_v2_female^5", "mi_dance_crowd_09_v2_female^6", "mi_dance_crowd_09_v2_male^1", "mi_dance_crowd_09_v2_male^2", "mi_dance_crowd_09_v2_male^3", "mi_dance_crowd_09_v2_male^4", "mi_dance_crowd_09_v2_male^5", "mi_dance_crowd_09_v2_male^6", "mi_dance_crowd_10_v2_female^1", "mi_dance_crowd_10_v2_female^2", "mi_dance_crowd_10_v2_female^3", "mi_dance_crowd_10_v2_female^4", "mi_dance_crowd_10_v2_female^5", "mi_dance_crowd_10_v2_female^6", "mi_dance_crowd_10_v2_male^1", "mi_dance_crowd_10_v2_male^2", "mi_dance_crowd_10_v2_male^3", "mi_dance_crowd_10_v2_male^4", "mi_dance_crowd_10_v2_male^5", "mi_dance_crowd_10_v2_male^6", "mi_dance_crowd_11_v1_female^1", "mi_dance_crowd_11_v1_female^2", "mi_dance_crowd_11_v1_female^3", "mi_dance_crowd_11_v1_female^4", "mi_dance_crowd_11_v1_female^5", "mi_dance_crowd_11_v1_female^6", "mi_dance_crowd_11_v1_male^1", "mi_dance_crowd_11_v1_male^2", "mi_dance_crowd_11_v1_male^3", "mi_dance_crowd_11_v1_male^4", "mi_dance_crowd_11_v1_male^5", "mi_dance_crowd_11_v1_male^6", "mi_dance_crowd_11_v2_female^1", "mi_dance_crowd_11_v2_female^2", "mi_dance_crowd_11_v2_female^3", "mi_dance_crowd_11_v2_female^4", "mi_dance_crowd_11_v2_female^5", "mi_dance_crowd_11_v2_female^6", "mi_dance_crowd_11_v2_male^1", "mi_dance_crowd_11_v2_male^2", "mi_dance_crowd_11_v2_male^3", "mi_dance_crowd_11_v2_male^4", "mi_dance_crowd_11_v2_male^5", "mi_dance_crowd_11_v2_male^6", "mi_dance_crowd_13_v1_female^1", "mi_dance_crowd_13_v1_female^2", "mi_dance_crowd_13_v1_female^3", "mi_dance_crowd_13_v1_female^4", "mi_dance_crowd_13_v1_female^5", "mi_dance_crowd_13_v1_female^6", "mi_dance_crowd_13_v1_male^1", "mi_dance_crowd_13_v1_male^2", "mi_dance_crowd_13_v1_male^3", "mi_dance_crowd_13_v1_male^4", "mi_dance_crowd_13_v1_male^5", "mi_dance_crowd_13_v1_male^6", "mi_dance_crowd_13_v2_female^1", "mi_dance_crowd_13_v2_female^2", "mi_dance_crowd_13_v2_female^3", "mi_dance_crowd_13_v2_female^4", "mi_dance_crowd_13_v2_female^5", "mi_dance_crowd_13_v2_female^6", "mi_dance_crowd_13_v2_male^1", "mi_dance_crowd_13_v2_male^2", "mi_dance_crowd_13_v2_male^3", "mi_dance_crowd_13_v2_male^4", "mi_dance_crowd_13_v2_male^5", "mi_dance_crowd_13_v2_male^6", "mi_dance_crowd_15_v1_female^1", "mi_dance_crowd_15_v1_female^2", "mi_dance_crowd_15_v1_female^3", "mi_dance_crowd_15_v1_female^4", "mi_dance_crowd_15_v1_female^5", "mi_dance_crowd_15_v1_female^6", "mi_dance_crowd_15_v1_male^1", "mi_dance_crowd_15_v1_male^2", "mi_dance_crowd_15_v1_male^3", "mi_dance_crowd_15_v1_male^4", "mi_dance_crowd_15_v1_male^5", "mi_dance_crowd_15_v1_male^6", "mi_dance_crowd_15_v2_female^1", "mi_dance_crowd_15_v2_female^2", "mi_dance_crowd_15_v2_female^3", "mi_dance_crowd_15_v2_female^4", "mi_dance_crowd_15_v2_female^5", "mi_dance_crowd_15_v2_female^6", "mi_dance_crowd_15_v2_male^1", "mi_dance_crowd_15_v2_male^2", "mi_dance_crowd_15_v2_male^3", "mi_dance_crowd_15_v2_male^4", "mi_dance_crowd_15_v2_male^5", "mi_dance_crowd_15_v2_male^6", "mi_dance_crowd_17_v1_female^1", "mi_dance_crowd_17_v1_female^2", "mi_dance_crowd_17_v1_female^3", "mi_dance_crowd_17_v1_female^4", "mi_dance_crowd_17_v1_female^5", "mi_dance_crowd_17_v1_female^6", "mi_dance_crowd_17_v1_male^1", "mi_dance_crowd_17_v1_male^2", "mi_dance_crowd_17_v1_male^3", "mi_dance_crowd_17_v1_male^4", "mi_dance_crowd_17_v1_male^5", "mi_dance_crowd_17_v1_male^6", "mi_dance_crowd_17_v2_female^1", "mi_dance_crowd_17_v2_female^2", "mi_dance_crowd_17_v2_female^3", "mi_dance_crowd_17_v2_female^4", "mi_dance_crowd_17_v2_female^5", "mi_dance_crowd_17_v2_female^6", "mi_dance_crowd_17_v2_male^1", "mi_dance_crowd_17_v2_male^2", "mi_dance_crowd_17_v2_male^3", "mi_dance_crowd_17_v2_male^4", "mi_dance_crowd_17_v2_male^5", "mi_dance_crowd_17_v2_male^6"];

mp.events.addCommand("handsup", player => {
  player.playAnimation("mp_bank_heist_1", "guard_handsup_loop", 1, 49); // se pune in genuchi cu mainie la cap!!
});

mp.events.addCommand("handsbehind", (player, fullText, id) => {
  if (id == undefined || parseInt(id) > 2 || parseInt(id) < 1) return player.pushExample('/holdhands 1-2')
  if (id == 1) {
    player.playAnimation("random@shop_robbery", "robbery_action_p", 1, 18); // pune mainile in cap si nu se poate misca.
  } else {
    player.playAnimation("random@shop_robbery", "robbery_action_p", 1, 2); // se pune in genuchi cu mainie la cap!!
  }
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});

mp.events.addCommand("dance", (player, fullText, id) => {
  if (id == undefined || parseInt(id) > dances.length - 1 || parseInt(id) < 0) return player.pushExample('/dance 0-' + parseInt(dances.length - 1))
  player.playAnimation("anim@amb@nightclub@dancers@crowddance_groups@", dances[parseInt(id)].toString(), 1, 39);
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});


mp.events.addCommand("holdhands", (player, fullText, id) => {
  if (id == undefined || parseInt(id) > 2 || parseInt(id) < 1) return player.pushExample('/holdhands 1-2')
  if (id == 1) {
    player.playAnimation("switch@michael@rejected_entry", "001396_01_mics3_6_rejected_entry_idle_bouncer", 1, 18);
  }
  else if (id == 2) {
    player.playAnimation("amb@lo_res_idles@", "world_human_lean_female_hand_up_lo_res_base", 1, 18);
  }
  player.notify("Type ~r~/stopanim~w~ to stop this.");
});