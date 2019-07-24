// N KEY

mp.keys.bind(0x4B, true, function() {
  if(loggedIn == false || interfaceOpened == true) return; 
  mp.events.callRemote('lockVehicle');
});

mp.events.add('vehicleExplosionEffect', () => {
  mp.events.call('setClientTimeEffect', 'BlackOut');
  setTimeout(() => {
    mp.events.call('setClientTimeEffect', 'default');
  }, 3000);
});

mp.events.add('createExplosionVehicle', (pos) => {
  mp.game.fire.addExplosion(pos.x, pos.y, pos.z, 7, 1.0, true, false, 0.5);
});