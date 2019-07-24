mp.events.addCommand("buylic", (player, fullText, value) => {
  let result = false;
  Business.forEach((b, index) => {
    if(result == true) return;
    if(b == false) return;
    if(b.haveBuyPoint == false) return;
    if(b.type != 4) return;
    if(player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if(player.info.level < 3) return player.pushError("You must have at least level 3 to buy this.");
      if(player.hasItemInInventory('Weapon License')) return player.pushError("You already own a weapon license.");
      if(player.getMoney() < 1500) return player.pushError("You don't have enough money. (1.500$)"), result = true;
      player.takeMoney(1500);
      player.giveItemToInventory(
        `Weapon License`, // Title
        10, // Type
        false, // Stackable,
        1, // Quantity
        false, // Can be used
        false // Can be traded
      );
      player.notify(`~c~New item: ~w~Weapon License.~n~~w~Now you can buy guns.`)
      result = true;
    }
  }); 
  if(result == false) return player.pushError("This command can't be used here.");
});

mp.events.addCommand("buygun", (player, fullText) => {
  let result = false;
  Business.forEach((b, index) => {
    if(result == true) return;
    if(b == false) return;
    if(b.haveBuyPoint == false) return;
    if(b.type != 4) return;
    if(player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 3)) {
      if(!player.hasItemInInventory('Weapon License')) return player.pushError("You don't own a weapon license.");
      if(b.products < 1 && b.owned == true) return player.pushError("This business is out of products."), result = true;
      let products = [
        { title: 'Knife', price: 50, weapon_name: 'weapon_knife', ammo: 1 },
        { title: 'Pistol', price: 150, weapon_name: 'weapon_pistol', ammo: 100 },
        { title: 'Grenade', price: 200, weapon_name: 'weapon_grenade', ammo: 1 },
        { title: 'Revolver', price: 250, weapon_name: 'weapon_revolver', ammo: 100 },
        { title: 'SMG', price: 300, weapon_name: 'weapon_smg', ammo: 100 },
        { title: 'Pump Shotgun', price: 320, weapon_name: 'weapon_pumpshotgun', ammo: 100 },
        { title: 'Assault Rifle', price: 350, weapon_name: 'weapon_assaultrifle', ammo: 100 },
        { title: 'Compact Rifle', price: 400, weapon_name: 'weapon_compactrifle', ammo: 100 },
        { title: 'Sniper Rifle', price: 800, weapon_name: 'weapon_sniperrifle', ammo: 30 }
      ];
      player.call('toggleModal', [9, 'chat', JSON.stringify({ products: products, selected: null, bizz: index })]);
      result = true;
    }
  }); 
  if(result == false) return player.pushError("This command can't be used here.");
});

mp.events.add("bizz_buyGun", (player, title, cash, weapon_name, ammo, bizz) => {
  
  if(Business[bizz].owned == true) {
    Business[bizz].safe += cash;
    Business[bizz].taxes += ( cash  / 100 ) * databox[0].data.taxes.business;
    Business[bizz].products --;
  }
  player.takeMoney(cash);
  player.notify(`~c~New item: ~w~${title}.~n~~w~Press F2 to access inventory and use it.`);
  let found = false;
  player.info.inventory.forEach((item, index) => {
    if(item.type == 11) {
      if(item.weapon_name == weapon_name) {
        found = true;
        item.quantity += ammo;
      }
    }
  });
  if(found == false) {
    player.info.inventory.push({
      title: title, // Title
      type: 11, // Type
      stackable: true, // Stackable,
      quantity: ammo, // Quantity
      canBeUsed: true, // Can be used
      canBeTradable: true, // Can be traded,
      weapon_name: weapon_name,
      markedForTrade: false
    });
  }
  player.call("playSoundEffect", ["PURCHASE", "HUD_FRONTEND_TATTOO_SHOP_SOUNDSET"]);
});