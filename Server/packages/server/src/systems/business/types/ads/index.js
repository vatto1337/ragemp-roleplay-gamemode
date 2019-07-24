let AdsDisabled = false;

mp.events.addCommand("ad", (player, fullText) => {
  let result = false;
  Business.forEach((b, index) => {
    if(result == true) return;
    if(b == false) return;
    if(b.haveBuyPoint == false) return;
    if(b.type != 5) return;
    if(player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 10)) {
      if(player.info.level < 3) return player.pushError("You must be level 3 at least to use this command."), result = true;
      if(fullText == undefined) return player.pushExample("/ad [Your ad]"), result = true;
      if(AdsDisabled == true) return player.pushError("Wait 30 seconds after the last Ad to place another one."), result = true;
      let cost = fullText.toString().length * 3;
      if(player.getMoney() < cost) return player.pushError(`This ad will cost ${formatMoney(cost,0)}$. You don't have enough money.`), result = true;
      player.takeMoney(cost);
      let adText = `Ad published by ${player.name} (Phone: ${formatMoney(player.getItemFromInventory('Cell Phone')[0].number, 0, '-', '-')}): ${fullText}`;
      player.notify(`~r~This ad costed ${formatMoney(cost, 0)}$`);
      player.pushChatToAll(adText, '#33AA33');
      result = true;
      AdsDisabled = true;
      setTimeout(() => { AdsDisabled = false; }, 30000);
      if(Business[index].owned == true) {
        Business[index].safe += cost;
        Business[index].taxes += ( cost  / 100 ) * databox[0].data.taxes.business;
        Business[index].products --;
      }
    }
  }); 
  if(result == false) return player.pushError("This command can't be used here.");
});
