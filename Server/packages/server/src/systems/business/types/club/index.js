mp.events.addCommand("buydrink", (player, fullText, drink) => {
  let result = false;
  Business.forEach((b, index) => {
    if (result == true) return;
    if(b == false) return;
    if (b.haveBuyPoint == false) return;
    if (b.type != 7) return;
    if (player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if(player.getMoney() < 25) return player.pushError("You don't have enough money. (25$)"), result = true;
      if(drink == undefined) return player.pushExample("/buydrink [Vodka - 50$, Beer - 25$]"), result = true;
      if(drink == 'Beer') {
        let price = 25;
        if(player.getMoney() < price) return player.pushError("You don't have enough money."), result = true;
        player.giveItemToInventory(
          `Beer`, // Title
          6, // Type
          true, // Stackable,
          1, // Quantity
          true, // Can be used
          true // Can be traded
        );      
        player.takeMoney(price);
        if(Business[index].owned == true) {
          Business[index].safe += price;
          Business[index].taxes += ( price  / 100 ) * databox[0].data.taxes.business;
          Business[index].products --;
        }
        player.notify(`~c~New item: ~w~Beer.~n~~w~Press F2 to drink it.`);
        player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"]);
        result = true;
      } else if(drink == 'Vodka') {
        let price = 55;
        if(player.getMoney() < price) return player.pushError("You don't have enough money."), result = true;
        player.giveItemToInventory(
          `Vodka`, // Title
          7, // Type
          true, // Stackable,
          1, // Quantity
          true, // Can be used
          true // Can be traded
        );      
        player.takeMoney(price);
        if(Business[index].owned == true) {
          Business[index].safe += price;
          Business[index].taxes += ( price  / 100 ) * databox[0].data.taxes.business;
          Business[index].products --;
        }
        player.notify(`~c~New item: ~w~Vodka.~n~~w~Press F2 to drink it.`);
        player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"]);
        result = true;
      }
      else return player.pushError("Invalid drink name."), result = true;
    }
  });
  if(result == false) return player.pushError("This command can't be used here.");
});

mp.events.addCommand("playmusic", (player, fullText) => {
  let result = false;
  Business.forEach((b, index) => {
    if (result == true) return;
    if(b == false) return;
    if (b.haveBuyPoint == false) return;
    if (b.type != 7) return;
    b.extraPoints.forEach((extra) => {
      if(extra.command == "playmusic") {
        if (player.IsInRange(extra.x, extra.y, extra.z, 10)) {
          if(player.getMoney() < 100) return player.pushError("You don't have enough money. (100$)"), result = true;
          if(!player.hasItemInInventory('Cell Phone')) return player.pushError("You must own a phone to use this command."), result = true;
          if(player.vars.tog.youtube == false) return player.pushError("You must enable youtube to use this. Use /tog to do so."), result = true;
          player.call('toggleModal', [11, 'chat', JSON.stringify({ youtube: { search: '', result: [] } })]);
          player.vars.usingBizz = index;
          result = true;
        }
      }
    });
  });
  if(result == false) return player.pushError("This command can't be used here.");
});
