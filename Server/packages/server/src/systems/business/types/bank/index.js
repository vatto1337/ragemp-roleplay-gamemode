mp.events.addCommand("balance", (player, fullText, value) => {
  let result = false;
  Business.forEach((b, index) => {
    if(result == true) return;
    if(b == false) return;
    if(b.haveBuyPoint == false) return;
    if(b.type != 3) return;
    if(player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      player.pushChat(`Your bank account balance is ${formatMoney(player.info.bank, 0)}$.`, null, 'bizz-message');
      result = true;
    }
  }); 
  if(result == false) return player.pushError("This command must be used only inside a bank.");
});

mp.events.addCommand("withdraw", (player, fullText, value) => {
  let result = false;
  Business.forEach((b, index) => {
    if(result == true) return;
    if(b == false) return;
    if(b.haveBuyPoint == false) return;
    if(b.type != 3) return;
    if(player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if(value == undefined) return player.pushExample("/withdraw [Value]"), result = true;
      value = parseInt(value);
      if(value < 1 || value > player.info.bank) return player.pushError("You don't have that much in your bank account."), result = true;
      player.info.bank -= value;
      player.giveMoney(value);
      player.pushChat(`You have withdrawn ${formatMoney(value, 0)}$ from your bank account.`, null, 'bizz-message');
      result = true;
    }
  }); 
  if(result == false) return player.pushError("This command can't be used here.");
});

mp.events.addCommand("deposit", (player, fullText, value) => {
  let result = false;
  Business.forEach((b, index) => {
    if(result == true) return;
    if(b == false) return;
    if(b.haveBuyPoint == false) return;
    if(b.type != 3) return;
    if(player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if(value == undefined) return player.pushExample("/deposit [Value]");
      value = parseInt(value);
      if(value < 1 || value > player.getMoney()) return player.pushError("You don't have that much money."), result = true;
      player.info.bank += value;
      player.takeMoney(value);
      player.pushChat(`You have deposited ${formatMoney(value, 0)}$ in your bank account.`, null, 'bizz-message');
      result = true;
    }
  }); 
  if(result == false) return player.pushError("This command can't be used here.");
});

mp.events.addCommand("transfer", (player, fullText, target, value) => {
  let result = false;
  
  Business.forEach((b, index) => {
    if(result == true) return;
    if(b.haveBuyPoint == false) return;
    if(b == false) return;
    if(b.type != 3) return;
    if(player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if(target == undefined || value == undefined) return player.pushExample("/transfer [Player ID / Name] [Value]"), result = true;
      target = getPlayerID(target);
      if(!target || target.loggedIn == false || target.info.justRegistered == true) return player.pushError(`Invalid Player ID / Name.`), result = true;
      if(player == target) return player.pushError("You can't sent money to yourself."), result = true;
      if(player.info.bank < value) return player.pushError("You don't have that much money in your bank account."), result = true;
      if(player.info.level < 3) return player.pushError("You can use this feature only when you have level 3 at least."), result = true;
      let fee = ( value / 100 ) * databox[0].data.taxes.bankFee;
      value -= fee;
      player.info.bank -= value;
      target.info.bank += value; 
      if(Business[index].owned == true) {
        Business[index].safe += fee;
        Business[index].taxes += ( fee  / 100 ) * databox[0].data.taxes.business;
      } 
      player.pushChat(`You have transfered ${formatMoney(value, 0)} $ (${formatMoney(fee, 0)}$ Fee) into ${target.name}'s bank account.`, null, 'bizz-message');
      target.pushChat(`You have received ${formatMoney(value, 0)}$ (${formatMoney(fee, 0)}$ Fee) into your bank account from ${player.name}.`, null, 'bizz-message');
      player.pushChat(`The bank has a fee of ${databox[0].data.taxes.bankFee}% of the money you want to transfer.`, null, 'bizz-message');
      result = true;
    }
  }); 
  if(result == false) return player.pushError("This command can't be used here.");
});
