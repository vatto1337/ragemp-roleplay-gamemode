mp.events.addCommand("buy", (player, fullText) => {
  let result = false;
  Business.forEach((b, index) => {
    if(result == true) return;
    if(b == false) return;
    if(b.haveBuyPoint == false) return;
    if(b.type != 1) return;
    if(player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 3)) {
      if(b.products < 1 && b.owned == true) return player.pushError("This business is out of products."), result = true;
      let products = [
        { title: 'Cell Phone', price: 150 },
        { title: 'Phone Book', price: 50 },
        { title: 'Petrol Can', price: 45 },
        { title: 'Sandwich', price: 35 },
        { title: 'Dice', price: 30 },
        { title: 'Pack of cigarettes', price: 20 },
        { title: 'Beer', price: 15 },
        { title: 'Flashlight', price: 10 }
      ];
      player.call('toggleModal', [8, 'chat', JSON.stringify({ products: products, selected: null, bizz: index })]);
      result = true;
    }
  });
  if(result == false) return player.pushError("This command can't be used here."); 
});

mp.events.add("bizz_buyItem", (player, cash, id, bizz) => {
  if(id == 0) {
    if(player.hasItemInInventory('Cell Phone')) return player.notifyError("You already own a cell phone.");
    let phoneNumber = ( 100000 + Math.random() * 500000 ).toFixed(0);
    player.giveItemToInventory(
      `Cell Phone`, // Title
      0, // Type
      false, // Stackable,
      1, // Quantity
      false, // Can be used
      false, // Can be traded
      { number: phoneNumber } // Extra object properties
    );
    player.takeMoney(cash);
    if(Business[bizz].owned == true) {
      Business[bizz].safe += cash;
      Business[bizz].taxes += ( cash  / 100 ) * databox[0].data.taxes.business;
      Business[bizz].products --;
    }
    player.notify(`~c~New item: ~w~Cell Phone.~n~~w~Press F2 to see your phone number & find commands for this item.`)
    player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"]);
  }
  else if(id == 1) {
    if(player.hasItemInInventory('Phone Book')) return player.notifyError("You already own a Phone Book.");
    player.giveItemToInventory(
      `Phone Book`, // Title
      1, // Type
      false, // Stackable,
      1, // Quantity
      false, // Can be used
      true // Can be traded
    );
    player.takeMoney(cash);
    if(Business[bizz].owned == true) {
      Business[bizz].safe += cash;
      Business[bizz].taxes += ( cash  / 100 ) * databox[0].data.taxes.business;
      Business[bizz].products --;
    }
    player.notify(`~c~New item: ~w~Phone Book.~n~~w~Now you can use /number to find players phone number.`)
    player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"])
  } 
  else if(id == 2) {
    player.giveItemToInventory(
      `Petrol Can`, // Title
      2, // Type
      true, // Stackable,
      1, // Quantity
      true, // Can be used
      true // Can be traded
    );
    player.takeMoney(cash);
    if(Business[bizz].owned == true) {
      Business[bizz].safe += cash;
      Business[bizz].taxes += ( cash  / 100 ) * databox[0].data.taxes.business;
      Business[bizz].products --;
    }
    player.notify(`~c~New item: ~w~Petrol Can.~n~~w~Press F2 to use it, then go inside a vehicle and type /fillup.`)
    player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"])
  }
  else if(id == 3) {
    player.giveItemToInventory(
      `Sandwich`, // Title
      3, // Type
      true, // Stackable,
      1, // Quantity
      true, // Can be used
      true // Can be traded
    );
    player.takeMoney(cash);
    if(Business[bizz].owned == true) {
      Business[bizz].safe += cash;
      Business[bizz].taxes += ( cash  / 100 ) * databox[0].data.taxes.business;
      Business[bizz].products --;
    }
    player.notify(`~c~New item: ~w~Sandwich.~n~~w~Press F2 to access your inventory and eat it.`)
    player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"])
  }
  else if(id == 4) {
    if(player.hasItemInInventory("Dices")) return player.notifyError("You already own a pair of dices.");
    player.giveItemToInventory(
      `Dices`, // Title
      4, // Type
      false, // Stackable,
      1, // Quantity
      false, // Can be used
      true // Can be traded
    );
    player.takeMoney(cash);
    if(Business[bizz].owned == true) {
      Business[bizz].safe += cash;
      Business[bizz].taxes += ( cash  / 100 ) * databox[0].data.taxes.business;
      Business[bizz].products --;
    }
    player.notify(`~c~New item: ~w~Dices.~n~~w~Type /dice to play craps.`)
    player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"])
  }
  else if(id == 5) {
    player.giveItemToInventory(
      `Pack of cigarettes`, // Title
      5, // Type
      true, // Stackable,
      20, // Quantity
      true, // Can be used
      true // Can be traded
    );
    player.takeMoney(cash);
    if(Business[bizz].owned == true) {
      Business[bizz].safe += cash;
      Business[bizz].taxes += ( cash  / 100 ) * databox[0].data.taxes.business;
      Business[bizz].products --;
    }
    player.notify(`~c~New item: ~w~Cigarettes.~n~~w~Press F2 to smoke them.`)
    player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"])
  }
  else if(id == 6) {
    player.giveItemToInventory(
      `Beer`, // Title
      6, // Type
      true, // Stackable,
      1, // Quantity
      true, // Can be used
      true // Can be traded
    );
    player.takeMoney(cash);
    if(Business[bizz].owned == true) {
      Business[bizz].safe += cash;
      Business[bizz].taxes += ( cash  / 100 ) * databox[0].data.taxes.business;
      Business[bizz].products --;
    }
    player.notify(`~c~New item: ~w~Beer.~n~~w~Press F2 to drink it.`)
    player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"])
  }
  else if(id == 7) {
    player.giveItemToInventory(
      `Flashlight`, // Title
      8, // Type
      true, // Stackable,
      1, // Quantity
      true, // Can be used
      true // Can be traded
    );
    player.takeMoney(cash);
    if(Business[bizz].owned == true) {
      Business[bizz].safe += cash;
      Business[bizz].taxes += ( cash  / 100 ) * databox[0].data.taxes.business;
      Business[bizz].products --;
    }
    player.notify(`~c~New item: ~w~Flashlight.~n~~w~Press F2 to use it.`)
    player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"]);
  }
});

mp.events.add("loadVariables", player => {
  player.vars.drunk = 0;
});

mp.events.add("playerTimer", (player) => {
  if(player.vars && player.vars.drunk > 0) {
    player.vars.drunk --;
    if(player.vars.drunk == 1) { 
      player.call("setClientTimeEffect", ["default"]); 
      player.notify("~r~You're now sober again.");
      if(!player.vehicle) {
        player.stopAnimation();
      }
      
    }
    if(player.vars.drunk > 150) {
      player.call("setClientTimeEffect", ["Drunk"]);
    }
    if(player.vars.drunk > 300) {
        player.call("setClientTimeEffect", ["BlackOut"]);
      player.health -= 10;
      if(player.health < 1) {
        player.vars.drunk = 0;
        player.call("setClientTimeEffect", ["default"]); 
        player.pushLocalChat(`* ${player.name} falls to the ground due to alcoholic coma.`, null, 'action-message');
      }
    }
  }
});

mp.events.addCommand("dice", (player, fullText, target, money) => {
  if(!player.hasItemInInventory("Dices")) return player.pushError("You don't own a pair of dices.");
  if(target == undefined || money == undefined) return player.pushExample("/dice [Player ID / Name] [Money]");
  target = getPlayerID(target), money = parseInt(money);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target == player) return player.pushError("You can't play dice with yourself.");
  let dist = player.dist(target.position);
  if(dist > 10) return player.pushError("Player is too far away.");
  if(player.getMoney() < money || money < 1) return player.pushError("You don't have that much money!");
  player.vars.invitations.dice.to = target;
  player.vars.invitations.dice.money = money;
  player.pushChat(`You have invited ${target.name} to play craps with you for ${formatMoney(money, 0)}$.`);
  target.pushChat(`${player.name} invited you to play craps for ${formatMoney(money, 0)}$. (/accept dice ${player.id})`);
});