let skinsList = require("./skins.js");

mp.events.addCommand("buyskins", (player, fullText) => {
  let result = false;
  Business.forEach((b, index) => {
    if (result == true) return;
    if (b == false) return;
    if (b.haveBuyPoint == false) return;
    if (b.type != 6) return;
    if (player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if (player.vehicle) return player.pushError("You can't use this command inside a vehicle."), result = true;
      skinsList[0] = player.info.character.gender == 0 ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
      // player.position = new mp.Vector3(123.883, -219.677, 54.558);
      player.dimension = (300 + index) + player.id;
      player.call('toggleModal', [10, 'nothing', JSON.stringify({ skins: skinsList, selected: 0, bizz: index })]);
      player.call("prepareClothes", [true]);
      result = true;
    }
  });
  if (result == false) return player.pushError("This command can't be used here.");
});

mp.events.add("clothes_applySkin", (player, skinName) => {
  player.model = mp.joaat(skinName);
  if (mp.joaat(skinName) == mp.joaat("mp_m_freemode_01") && player.info.character.gender == 0) { mp.events.call("loadClothes", player); }
  if (mp.joaat(skinName) == mp.joaat("mp_f_freemode_01") && player.info.character.gender == 1) { mp.events.call("loadClothes", player); }
});

mp.events.add("clothes_exit", (player, bizz) => {
  player.model = player.info.character.model;
  if (player.model == mp.joaat("mp_m_freemode_01") && player.info.character.gender == 0) { mp.events.call("loadClothes", player); }
  if (player.model == mp.joaat("mp_f_freemode_01") && player.info.character.gender == 1) { mp.events.call("loadClothes", player); }
  bizz = Business[bizz];
  // player.position = new mp.Vector3(bizz.buyPoint.x, bizz.buyPoint.y, bizz.buyPoint.z);
  player.dimension = 0;
  player.vars.usingBizz = null;
});

mp.events.add("clothes_cancel", (player) => {
  let bizz = player.vars.usingBizz;
  player.model = player.info.character.model;
  if (player.model == mp.joaat("mp_m_freemode_01") && player.info.character.gender == 0) { mp.events.call("loadClothes", player); }
  if (player.model == mp.joaat("mp_f_freemode_01") && player.info.character.gender == 1) { mp.events.call("loadClothes", player); }
  bizz = Business[bizz];
  // player.position = new mp.Vector3(bizz.buyPoint.x, bizz.buyPoint.y, bizz.buyPoint.z);
  player.dimension = 0;
  player.vars.usingBizz = null;
});


mp.events.add("clothes_buySkin", (player, skinName, bizz) => {
  if (mp.joaat(skinName) == player.info.character.model) return player.notifyError("You already have this skin.");
  player.takeMoney(300);
  player.model = mp.joaat(skinName);
  player.info.character.model = player.model;
  player.notifySuccess("You have purchased this skin.");
  if (Business[bizz].owned == true) {
    Business[bizz].safe += 300;
    Business[bizz].taxes += (300 / 100) * databox[0].data.taxes.business;
    Business[bizz].products--;
  }
});

mp.events.addCommand("buyclothes", (player, fullText) => {
  let result = false;
  Business.forEach((b, index) => {
    if (result == true) return;
    if (b == false) return;
    if (b.haveBuyPoint == false) return;
    if (b.type != 6) return;
    if (player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if (player.vehicle) return player.pushError("You can't use this command inside a vehicle."), result = true;
      if (player.info.character.gender == 0 && player.model != mp.joaat("mp_m_freemode_01")) return player.pushError("You must have the online skin to use this command."), result = true;
      if (player.info.character.gender == 1 && player.model != mp.joaat("mp_f_freemode_01")) return player.pushError("You must have the online skin to use this command."), result = true;
      player.vars.usingBizz = index;
      player.dimension = (300 + index) + player.id;
      player.call("prepareClothes", [false, JSON.stringify(player.info.character.options)]);
      result = true;
    }
  });
  if (result == false) return player.pushError("This command can't be used here.");
});

