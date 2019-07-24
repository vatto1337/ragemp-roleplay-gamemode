const collection = require("./schema/publicVehicles.js");

let query = collection.find({}, function(err, x){
  if(err) { console.log(err); }
});

query.then((vehicles) => {
  vehicles.forEach((x) => {

    let color1 = generateRGB();

    let entry = mp.vehicles.new(mp.joaat(x.model), new mp.Vector3( x.x, x.y, x.z ), { 
      dimension: 0, 
      color: [color1,color1],
      locked: false
    });

    entry.rotation = new mp.Vector3(x.rot.x, x.rot.y, x.rot.z);
    
    entry.params = {
      id: x._id,
      spawn: {
        x: x.x,
        y: x.y,
        z: x.z,
        rot: {
          x: x.rot.x,
          y: x.rot.y,
          z: x.rot.z
        }
      },
      engine: false,
      fuel: 100,
      owner: 'State of San Andreas',
      type: 'Public vehicle'
    }
  });
});

var randomColor = require('randomcolor'); 

global.generateRGB = function() {
  let color = randomColor({ luminosity: 'bright', format: 'rgb' });
  color = color.replace("rgb(", "");
  color = color.replace(")", "");
  color = color.replace(" ", "");
  color = color.split(",");
  return color;
  console.log('heard');
}
