// Math Event

let mathEvent = {
  status: false,
  answer: 0,
  reward: 0,
  method: 0,
  numbers: [0,0],
  playersMin: 2, 
}

setInterval(() => {
  let count = 0;
  mp.players.forEach((p) => {
    if(!p.loggedIn || p.loggedIn == false) return;
    count ++;
  });
  if(count >= mathEvent.playersMin) {
    let randomMethod = (Math.random() * 1).toFixed(0);
    let number1 = (1 + Math.random() * 100).toFixed(0);
    let number2 = (1 + Math.random() * 100).toFixed(0);
    let bonusPerPlayers = (2 * count);
    let reward = ((Math.random() * 200) + +50 + bonusPerPlayers).toFixed(0);
    let result = randomMethod == 0 ? +number1 + +number2 : number1 - number2;
    mathEvent.status = true;      
    mathEvent.answer = result;
    mathEvent.reward = reward;
    mathEvent.numbers = [number1, number2];
    mathEvent.method = randomMethod;
    setTimeout(() => {
      if(mathEvent.status == true) {
        mp.players.forEach((p) => {
          if(!p.loggedIn || p.loggedIn == false) return;
          p.pushChat(`[Math Event] Time expired! The answer to ${number1} ${randomMethod == 0 ? '+' : '-'} ${number2} = ${result}.`, null, 'event-message');
        });
        mathEvent.status = false;       
      }
    }, 30000);
    mp.players.forEach((p) => {
      if(!p.loggedIn || p.loggedIn == false) return;
      p.pushChat(`[Math Event] Win ${formatMoney(reward, 0)}$ by answering this: ${number1} ${randomMethod == 0 ? '+' : '-'} ${number2} equals what?`, null, 'event-message');
    });

  }
}, 600000);


mp.events.add("playerChat", (player,message) => {
  if(player.loggedIn == true) {
    if(player.info.muted != null) return;
    if(mathEvent.status == true && message == mathEvent.answer) {
      player.pushChatToAll(`[Math Event] ${player.name} did the math and won ${formatMoney(mathEvent.reward, 0)}$ (${mathEvent.numbers[0]} ${mathEvent.method == 0 ? '+' : '-'} ${mathEvent.numbers[1]} = ${mathEvent.answer})`, null, 'event-message');
      player.giveMoney(mathEvent.reward);
      mathEvent.status = false;
      mathEvent.reward = 0;
      mathEvent.answer = 0;
      mathEvent.method = 0;
    } 
  }
});