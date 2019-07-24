mp.events.add('onJobSelected', (player, job) => {
  if(job == 5) {
    if(player.info.job != null) {
      if(player.vars.job.working == true) {
        mp.events.call('stopWork', player);
      }
      player.info.job = null;
    }
    if(player.info.level < 3) return player.notifyError("You must have level 3 at least to get this job.");
    player.info.job = 5;
    player.notifySuccess(`You're now hired as Detective. You can use now /find.`, null, 'server-message');
  }
});

mp.events.add('loadVariables', (player) => {
  player.vars.findSystem = {
    active: false,
    findingID: null,
    secondsLeft: null,
    antiSpam: 0
  }
});

mp.events.add('playerTimer', (player) => {
  if(player.vars.findSystem.antiSpam > 0) {
    player.vars.findSystem.antiSpam --;
  }
  if(player.info.job == 5 && player.vars.job.working == true) {
    player.vars.findSystem.secondsLeft --;
    let target = player.vars.findSystem.findingID;
    let pos = target.position;
    player.call('job_destroyBlip');
    player.call('job_destroyCheckpoint');
    player.call('job_setBlip', ['Phone signal of ' + target.name, pos.x, pos.y, pos.z]);
    player.call('job_setCheckpoint', [pos.x, pos.y, pos.z, 2]);
    player.clearSubtitles();
    player.giveSubtitle('~w~Phone signal of ~y~' + target.name + '~w~ has been traced down at ~y~[location]', 60, { x: pos.x , y: pos.y, z: pos.z }, true);
    if(player.vars.findSystem.secondsLeft < 1) {
      player.vars.findSystem.active = false;
      player.vars.job.working = false;
      player.call('job_destroyBlip');
      player.call('job_destroyCheckpoint');
      player.clearSubtitles();
    }
  }
});

mp.events.addCommand('find', (player, fullText, target) => {
  if(player.info.job != 5) return player.pushError("You must have the job of a detective to use this command.");
  if(target == undefined) player.pushExample("/find [Player ID / Name]");
  target = getPlayerID(target);
  if(!target || target.loggedIn == false || target.info.justRegistered == true) return player.pushError(`Invalid Player ID / Name.`);
  // if(!target.hasItemInInventory('Cell Phone')) return player.pushError("This player can't be traced because he is not owning a phone.");
  // if(target.vars.tog.phone == false) return player.pushError("You can't follow this player phone's signal because his phone is turned off.");
  if(player.vars.job.working == true) return player.pushError("You're already finding someone. Use /stopwork");
  if(player.vars.findSystem.antiSpam != 0) return player.pushError("Wait " + player.vars.findSystem.antiSpam + " seconds before using this command again.");
  player.vars.findSystem.active = true;
  player.vars.findSystem.findingID = target;
  player.vars.findSystem.secondsLeft = 30 * player.info.jobSkills[5].level;
  player.vars.findSystem.antiSpam = 30;
  player.vars.job.working = true;
  let jobIndex = 5;
  player.info.jobSkills[jobIndex].currentPoints ++;
  if(player.info.jobSkills[jobIndex].currentPoints >= player.info.jobSkills[jobIndex].neededPoints) {
    player.info.jobSkills[jobIndex].currentPoints = 0;
    player.info.jobSkills[jobIndex].neededPoints = player.info.jobSkills[jobIndex].neededPoints * 2;
    player.info.jobSkills[jobIndex].level ++;
    player.pushChat("This job's skill level upgraded to " + player.info.jobSkills[jobIndex].level + ". Congratulations!", null, 'server-message');
  }

});

mp.events.add('stopWork', (player, reason) => {
  if(player.info.job ==5 && player.vars.job.working == true) {
    player.call('job_destroyBlip');
    player.call('job_destroyCheckpoint');
    player.vars.job.working = 0;
    player.clearSubtitles();
    player.pushChat('You have stopped working on this job. (' + reason + ')', null, 'server-message');
  }
});
