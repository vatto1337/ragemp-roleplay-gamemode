// Gas Stations

let { GasStations } = require("./data.js");

GasStations.forEach((station, index) => {
  mp.blips.new(361, new mp.Vector3(station.coordinates.X, station.coordinates.Y, station.coordinates.Z),{ name: 'Gas Station',  color: 75, drawDistance: 5, shortRange: true, dimension: 0, alpha: 0.3});
  station.pumps.forEach((pump) => {
      mp.labels.new('~y~Gas Station Pump~n~~g~Price: 50$~n~~w~Usage: /fillup', new mp.Vector3(pump.X, pump.Y, pump.Z),
      {
          los: false,
          font: 4,
          drawDistance: 5,
          dimension: 0
      });
  });
});

mp.events.addCommand("fillup", (player, fullText) => {
  let result = false;
  GasStations.forEach((station) => {
    station.pumps.forEach((pump) => {
      if(player.IsInRange(pump.X, pump.Y, pump.Z, 5)) {
        if(result == true) return;
        if(!player.vehicle || player.seat != -1) return player.pushError(`Only the driver of a vehicle can use this command.`), result = true;
        if(!player.vehicleModelHaveEngine(player.vehicle.model)) return player.pushError(`This vehicle doesn't need fuel.`), result = true;
        if(player.vehicle.params.engine == true)  return player.pushError(`You must stop the engine before filling up.`), result = true;
        if(player.vehicle.params.fuel >= 95) return player.pushError(`This vehicle has enough fuel. Please come back later.`), result = true;
        if(!player.haveMoney(50)) return player.pushError(`You don't have 50$ in your wallet.`), result = true;
        let veh = player.vehicle;
        player.takeMoney(50);
        veh.params.fuel = 100;    
        player.pushChat("You have filled this vehicle for 50$.");
        result = true;
        let result2 = false;
        Business.forEach((b, index) => {
          if(result2 == true) return;
          if(b.type != 1) return;
          if(b.haveBuyPoint == false) return;
          if(player.IsInRange(b.buyPoint.x, b.buyPoint.y, b.buyPoint.z, 30)) {
            if(Business[index].owned == true) {
              Business[index].safe += 50;
              Business[index].taxes += ( 50  / 100 ) * databox[0].data.taxes.business;
              Business[index].products -= 5;
            }
            result2 = true;
          }
        }); 
      }
    });
  });
  if(result == false && player.weapon == 883325847) {
    if(!player.vehicle) return player.pushError("You must use this command while holding the petrol can inside the vehicle.");
    player.vehicle.params.fuel += 30;
    if(player.vehicle.params.fuel > 100) { player.vehicle.params.fuel = 100; }
    player.removeWeapon(883325847);
    player.pushChat("Vehicle fueled up with this petrol can!", null, 'server-message');
  }
});

setInterval(() => {
  mp.players.forEach((player) => {
    if(!player.vehicle) return;
    if(!player.seat == -1) return;
    if(!player.vehicleModelHaveEngine(player.vehicle.model)) return;
    
    let veh = player.vehicle;
    if(veh.params && veh.params.engine == true) {
      if(veh.params.fuel > 0) {
        veh.params.fuel -= 1;
        if(player.vars && player.vars.dmv.status == true && player.vehicle == player.vars.dmv.vehicle) {
          if(veh.params.fuel < 50) {
            veh.params.fuel = 100;
          }
        }
        veh.setVariable('fuel', veh.params.fuel);

        if(veh.params.fuel == 10) {
          player.giveSubtitle('You have only 10% fuel left. Go to a ~r~Gas Station!');
        }
      }
      else {
        veh.params.engine = false;
        player.call('setEngineState', [veh.params.engine]);
        player.giveSubtitle('Vehicle out of fuel. Go to a 24/7 Store and buy a Petrol can.');
      }
    }
    
  });
}, 30000);