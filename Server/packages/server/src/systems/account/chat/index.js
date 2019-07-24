let escape = require('escape-html');

// mp.events.add('loadVariables', player => {
//   player.vars.chatVisible = 0;
// });

// mp.events.add("playerTimer", (player) => {
//   if(player.vars.chatVisible > 0) {
//     player.vars.chatVisible --;
//     console.log(player.getVariable('chatText'));
//     player.setVariable('chatVisible', false);
//   }
// });

mp.events.add("playerChat", (player,message) =>{
  if(player.loggedIn == true) {
    if(player.info.muted != null) return player.notifyError("You're muted for " + (player.info.muted / 1000).toFixed(0) + " seconds.");
    message = stripStuff(message);
    // player.setVariable('chatText', message);
    // player.setVariable('chatVisible', true);
    message = `${player.name} says: ${message}`;
    player.vars.chatVisible = 10;
    mp.players.forEach((p) => {
      if(p.loggedIn == false) return;
      if(player.vars.phone.speaking == true && player.vars.phone.speakingTo == p) return;
      if(player.vars.phone.speaking == true && p == player) return;
      if(player.vars.phone.speaking) { message = '(On the cellphone) ' + message; }
      let dist = player.dist(p.position);
      if(dist < 10) {
        p.pushChat(message, '#fff');
      } else if(dist > 10 && dist < 20) {
        p.pushChat(message, null, 'server-error');
      }
    });
  }
});

mp.events.addCommand("me", (player, fullText) => {
  if(player.info.muted != null) return player.notifyError("You're muted for " + (player.info.muted / 1000).toFixed(0) + " seconds.");
  let message = stripStuff(fullText);
  message = `* ${player.name} ${message}.`;
  player.pushLocalChat(message, null, 'action-message');
});


mp.events.add('loadVariables', player => {

  player.pushChat = function(message, color, clasa) {
    player.call('SendToChat', [message, color || null, clasa || null]);
  }

  player.pushError = function(message) {
    player.call('SendToChat', ['<span>Error:</span> ' + message, null, 'error-message']);
  }

  player.pushExample = function(message) {
    player.call('SendToChat', ['<span>Example of usage:</span> ' + message, null, 'error-message']);
  }

  player.pushInfo = function(message) {
    player.call('SendToChat', ['<span>Information:</span> ' + message, null, 'error-message']);
  }


  player.pushLocalChat = function(message, color, clasa, range) {
    mp.players.forEachInRange(player.position, range || 10,
      (toplayer) => {
        if(toplayer.loggedIn != true || !toplayer.loggedIn) return;
        toplayer.call('SendToChat',[message, color || null, clasa || null]);        
      }
    );
  }
  
  player.pushChatToAll = function(message, color, clasa) {
    mp.players.forEach(
      (toplayer) => {
        if(toplayer.loggedIn != true || !toplayer.loggedIn) return;
        toplayer.call('SendToChat',[message, color || null, clasa || null]);
    });
  }
  player.vars.timestamp = false;

});


global.stripStuff = function(content) {
  return escape(content);
}

mp.events.addCommand("timestamp", (player) => {
  if(player.vars.timestamp == false) {
    player.pushChat(`Timestamp is now enabled.`);
    player.vars.timestamp = true;
    player.call('chat_timestamp', [true]);

  } else {
    player.pushChat(`Timestamp is now disabled.`);
    player.vars.timestamp = false;
    player.call('chat_timestamp', [false]);
  }
});

