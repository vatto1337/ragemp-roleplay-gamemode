mp.events.add('SendToChat', (message, color, clasa) => {
  message = escape(message);
  hud.execute(`gui.chat.push('${message}', '${color}', '${clasa}');`);
});

mp.events.add('setChatState', (toggle) => {
  interfaceOpened = toggle;
});

mp.events.add('clearChat', () =>{
  hud.execute(`gui.chat.clear();`);
});

mp.events.add('chat_timestamp', (toggle) =>{
  hud.execute(`gui.chat.toggleTimestamp(${toggle});`);
});


// let chatSpam = false;

// mp.keys.bind(0x54, true, function() {
//   if(loggedIn == true && interfaceOpened == false && chatSpam == false && DeathScreen == false) {
//     hud.execute(`gui.chat.toggleInput(true);`);
//     mp.gui.cursor.show(true, true);
//     interfaceOpened = true;
//     chatSpam = true;
//     setTimeout(() => { chatSpam = false }, 1500);
//   }
// });

// mp.events.add('disableChatInput', () => {
//   hud.execute(`gui.chat.toggleInput(false);`);
//   mp.gui.cursor.show(false, false);
//   interfaceOpened = false;
// });
