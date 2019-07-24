// String Event

let stringEvent = {
  status: false,
  answer: null,
  reward: 0,
  playersMin: 2,
}

setInterval(() => {
  let count = 0;
  mp.players.forEach((p) => {
    if(!p.loggedIn || p.loggedIn == false) return;
    count ++;
  });
  if(count >= stringEvent.playersMin) {
    let answer = randomString();
    let bonusPerPlayers = (2 * count);
    let reward = ((Math.random() * 80) + +50 + bonusPerPlayers).toFixed(0);
    stringEvent.status = true;
    stringEvent.answer = answer;
    stringEvent.reward = reward;
    setTimeout(() => {
      if(stringEvent.status == true) {
        mp.players.forEach((p) => {
          if(!p.loggedIn || p.loggedIn == false) return;
          p.pushChat(`[Fast Event] Time expired! The reward of ${formatMoney(reward, 0)}$ is lost.`, null, 'event-message');
        });
        stringEvent.status = false;       
      }
    }, 30000);
    mp.players.forEach((p) => {
      if(!p.loggedIn || p.loggedIn == false) return;
      p.pushChat(`[Fast Event] Who is the first to write '${answer}' in chat wins ${formatMoney(reward, 0)}$`, null, 'event-message');
    });
  }
}, 1200000);


function randomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 7; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

mp.events.add("playerChat", (player,message) => {
  if(player.loggedIn == true) {
    if(player.info.muted != null) return;
    if(stringEvent.status == true && message == stringEvent.answer) {
      player.pushChatToAll(`[Fast Event] ${player.name} wrote fast and won ${formatMoney(stringEvent.reward, 0)}$ `, null, 'event-message');
      player.giveMoney(stringEvent.reward);
      stringEvent.status = false;
      stringEvent.reward = 0;
      stringEvent.answer = null;
    } 
  }
});
