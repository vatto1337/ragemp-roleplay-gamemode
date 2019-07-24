global.databox = [];

const table = require("./schema.js");

global.LoadServerData = (inst) => {

  databox = [];

  let loadingQuery = table.find({}, function (err, res) {
    if (err) return console.log('Data loading error: ' + err);
  });

  loadingQuery.then((datas) => {
    let prom = new Promise(function (resolve, reject) {
      datas.forEach((x) => {
        let obj = {
          id: x._id,
          data: x.data
        }
        databox.push(obj);
      });
      resolve(datas.length);
    });
    prom.then((nr) => {
      console.log(`[Data] ${nr} ${inst == 0 ? 'loaded' : 'reloaded'}.`);
      if(inst == 1) { 
        destroyFactions();
      }
      loadFactions();
    });
  });
};

LoadServerData(0);

global.SaveDatas = function () {
  databox.forEach((data, index) => {
    SaveData(index);
  });
}

global.SaveData = function (index) {
  let d = databox[index];
  table.findOne({ _id: d.id }, function (err, obj) {
    if (obj == null) {
      if (err) return console.log(`Data ${index} save erorr: ${err}`);
    } else {
      obj.data = d.data;
      obj.save();
    }
  });
}