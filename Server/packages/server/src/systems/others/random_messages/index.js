mp.events.add("playerTimer", (player) => {
  player.vars.randomMessage.timer --;
  if(player.vars.randomMessage.timer < 0) {
    let messages = databox[1].data.messages;   
    player.vars.randomMessage.timer = 300;
    player.vars.randomMessage.number ++;
    if(player.vars.randomMessage.number > (messages.length - 1)) { player.vars.randomMessage.number = 0; }
    let number = (Math.random() * (messages.length - 1)).toFixed(0);
    let message = messages[number]; 
    player.notify(message);
  }
});

mp.events.add("loadVariables", player => {
  player.vars.randomMessage = {
    timer: 300,
    number: 0
  }
}); 