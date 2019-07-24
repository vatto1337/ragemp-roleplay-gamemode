mp.events.add('onJobSelected', (player, job) => {
  if(job == 6) {
    if(player.info.job != null) {
      if(player.vars.job.working == true) {
        mp.events.call('stopWork', player);
      }
      player.info.job = null;
    }
    if(player.info.level < 5) return player.notifyError("You must have level 5 at least to get this job.");
    player.info.job = 6;
    player.notifySuccess(`You're now hired as Lawyer. You can use now /free.`, null, 'server-message');
  }
});

mp.events.addCommand("free", (player, fullText, target, money) => {
  if(player.info.job != 6) return player.pushError("You must have the job of a lawyer to use this command.");
  if(target == undefined || money == undefined) return player.pushExample("/free [Player ID / Name] [Money]");
  target = getPlayerID(target), money = parseInt(money);
  if(!target || target.loggedIn == false || target.info.justRegistered == true || !target.loggedIn) return player.pushError(`Invalid Player ID / Name.`);
  if(target == player) return player.pushError("You can't free yourself.");
  let dist = player.dist(target.position);
  if(dist > 10) return player.pushError("Player is too far away.");
  if(target.info.prisonTime == 0) return player.pushError("This player is not jailed.");
  if(money < 100 || money > 1000) return player.pushError("The money value must be between 100$ - 1.000$")
  player.vars.invitations.free.to = target;
  player.vars.invitations.free.money = money;
  player.pushChat(`You have send ${target.name} an offer to get him out of jail for ${formatMoney(money, 0)}$.`, null, 'server-message');
  target.pushChat(`Lawyer ${player.name} will get you out of jail for ${formatMoney(money, 0)}$. (/accept free ${player.id})`, null, 'server-message');
});