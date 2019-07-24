mp.events.addCommand("buylook", (player, fullText) => {
  let result = false;
  Business.forEach((b, index) => {
    if (result == true) return;
    if (b == false) return;
    if (b.haveBuyPoint == false) return;
    if (b.type != 8) return;
    if (player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if (player.vehicle) return player.pushError("You can't use this command inside a vehicle."), result = true;
      if (player.info.character.gender == 0 && player.model != mp.joaat("mp_m_freemode_01")) return player.pushError("You must have the online skin to use this command."), result = true;
      if (player.info.character.gender == 1 && player.model != mp.joaat("mp_f_freemode_01")) return player.pushError("You must have the online skin to use this command."), result = true;
      player.vars.usingBizz = index;
      player.dimension = (300 + index) + player.id;
      player.call("prepareBarber", [JSON.stringify(player.info.character.options)]);
      result = true;
    }
  });
  if (result == false) return player.pushError("This command can't be used here.");
});
