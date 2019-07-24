//Evenimentul este gata. Necesita trivia questions.

// let triviaEvent = {
//   status: false,
//   answer: null,
//   reward: 0,
//   playersMin: 0,
// }

// let triviaQuestions = [
//   { 
//     title: 'What is the capital of Romania ?',
//     answer: 'Bucharest'
//   },
//   {
//     title: 'What game is this ? ',
//     answer: 'GTA 5'
//   }
// ];

// setInterval(() => {

//   let count = 0;
//   mp.players.forEach((p) => {
//     if(!p.loggedIn || p.loggedIn == false) return;
//     count ++;
//   });
//   if(count >= triviaEvent.playersMin) {
//     let question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
//     let answer = question.answer;
//     let bonusPerPlayers = (2 * count);
//     let reward = ((Math.random() * 500) + +50 + bonusPerPlayers).toFixed(0);
//     triviaEvent.status = true;
//     triviaEvent.answer = answer;
//     triviaEvent.reward = reward;
//     setTimeout(() => {
//       if(triviaEvent.status == true) {
//         mp.players.forEach((p) => {
//           if(!p.loggedIn || p.loggedIn == false) return;
//           p.pushChat(`[Trivia Event] Time expired! The reward of ${formatMoney(reward, 0)}$ is lost. The answer was ${triviaEvent.answer}.`, null, 'event-message');
//         });
//         triviaEvent.status = false;       
//       }
//     }, 30000);
//     mp.players.forEach((p) => {
//       if(!p.loggedIn || p.loggedIn == false) return;
//       let str = answer, i, hashedpart = '';
//       let res = str.slice(str.length / 2, str.length);
//       for (i = 0; i < res.length; i++) { hashedpart = hashedpart + '#'; }
//       let hint = str.replace(res, hashedpart);
//       p.pushChat(`[Trivia Event] ${question.title} (Reward ${formatMoney(reward, 0)}$)`, null, 'event-message');
//       p.pushChat(answer);    
//     });
//   } else {
//     triviaEvent.status = false;
//   }
  
// }, 2400000);


// mp.events.add("playerChat", (player,message) => {
//   if(player.loggedIn == true) {
//     if(player.info.muted != null) return;
//     if(triviaEvent.status == true && message == triviaEvent.answer) {
//       player.pushChatToAll(`[Trivia Event] ${player.name} answered ${triviaEvent.answer} and won ${formatMoney(triviaEvent.reward, 0)}$ `, null, 'event-message');
//       player.giveMoney(triviaEvent.reward);
//       triviaEvent.status = false;
//       triviaEvent.reward = 0;
//       triviaEvent.answer = null;
//     } 
//   }
// });
