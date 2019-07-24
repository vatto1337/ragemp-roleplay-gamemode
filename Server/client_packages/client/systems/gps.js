
var gps_blip = null;
var gps_checkpoint = null;
var gps_coords = null;
let gps_arrived = false;

mp.events.add('createGPSBlip', (x,y,z, title) => {
  
  if(gps_blip != null) {
    mp.events.call("destroyGPSBlip");
  }

  mp.game.graphics.notify("~p~GPS Route set for ~w~" + title + ".~p~ You can disable it from the GPS Menu.");
  gps_coords = new mp.Vector3(x,y,z);
  gps_blip = mp.blips.new(1, new mp.Vector3(x,y,z),
  {
      name: 'GPS Location: ' + title,
      scale: 1,
      color: 83,
      alpha: 255,
      shortRange: false,
      dimension: player.dimension,
  });

  gps_checkpoint = mp.checkpoints.new(4, new mp.Vector3(x,y,z - 1.0), 4,
  {
      direction: new mp.Vector3(0, 0, 75),
      color: [ 255, 0, 255, 100 ],
      visible: true,
      dimension: player.dimension
  });
  gps_blip.setRoute(true);
  gps_arrived = false;

});

mp.events.add('destroyGPSBlip', () => {
  if(gps_blip != null) {
    if(gps_arrived == true) {
      mp.game.graphics.notify("~p~GPS Location removed.~n~~w~You've arrived at destination.");
    }
    else {
      mp.game.graphics.notify("~p~GPS Location removed.");
    }
    gps_blip.setRoute(false);
    gps_blip.destroy();
    gps_checkpoint.destroy();
    gps_blip = null;
    gps_coords = null;
  }
});


mp.events.add("playerEnterCheckpoint", (checkpoint) => {
  if(gps_blip != null && checkpoint == gps_checkpoint) {
    gps_arrived = true;
    mp.events.call("destroyGPSBlip");
  }
});
