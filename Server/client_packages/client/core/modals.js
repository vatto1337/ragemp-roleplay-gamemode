mp.events.add('toggleModal', (toggle, hide, data) => {
  let finaldata = {};  
  if(data) {
    finaldata = JSON.parse(data);
  }
  hud.execute(`appData.commit('others/setModalData', '${JSON.stringify(finaldata)}');`);
  hud.execute(`appData.commit('others/setModalActive', ${toggle});`);
  mp.events.call("prepareForBrowser", `${hide}`);
});

mp.events.add('disableModals', () => {
  mp.events.call("comeBackFromBrowser");
});

mp.events.add('submitMyReport', (data) =>{
  mp.events.callRemote("submitMyReport", data);
});

mp.events.add('requestReports', () =>{
  mp.events.callRemote("requestReports");
});

mp.events.add('sendReportAnswer', (data) =>{
  mp.events.callRemote("sendReportAnswer", data);
});

mp.events.add('readReport', (name) =>{
  mp.events.callRemote("readReport", name);
});


mp.events.add('deleteReport', (id) =>{
  mp.events.callRemote("deleteReport", id);
});

    
