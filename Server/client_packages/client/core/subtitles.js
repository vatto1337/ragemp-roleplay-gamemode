let PlayerSubtitles = [];
let intervalSubtitles = null;
mp.events.add('addSubtitle', (object) => {
  PlayerSubtitles.push(JSON.parse(object));
  if(intervalSubtitles == null) {
    intervalSubtitles = setInterval(() => {
      if(PlayerSubtitles.length > 0) {
        PlayerSubtitles.forEach((subtitle, index) => {
          subtitle.seconds --;
          if(subtitle.seconds < 1) {
            PlayerSubtitles.splice(index, 1);
          }
        });
      } else {
        clearInterval(intervalSubtitles);
        intervalSubtitles = null;
      } 
    }, 1000);
  }
});

mp.events.add('clearSubtitles', () => {
  PlayerSubtitles = [];
});

mp.events.add('render', () => {
  if(loggedIn == false) return;
  if(showSubtitles == false) return;
  if(PlayerSubtitles.length) {
    PlayerSubtitles.slice().reverse().forEach((sub, index) => {
      if(sub.location != null) {
        const position = sub.location;
        let getStreet = mp.game.pathfind.getStreetNameAtCoord(position.x, position.y, position.z, 0, 0);
        let streetName = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName);
        if(sub.exactDistance == true) {
          let mypos = player.position;
          let dist = mp.game.gameplay.getDistanceBetweenCoords(mypos.x, mypos.y, mypos.z, position.x, position.y, position.z, true);
          streetName = streetName + " (" + dist.toFixed(0) + "m)";
        }
        sub.text = sub.text.replace("[location]", streetName);
      }
      mp.game.graphics.drawText(sub.text, [0.5, (0.92 - (index / 100 * 3))], { 
        font: 4, 
        color: [255, 255, 255, 255], 
        scale: [0.45, 0.45], 
        outline: true,
        centre: true
      });
    });
  }
});