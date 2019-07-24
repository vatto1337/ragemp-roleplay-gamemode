mp.events.addCommand("reports", (player, fullText) => {
  mp.events.call("requestReports", player);
});

mp.events.add("loadVariables", player => {
  player.vars.myReport = null;
});

mp.events.addCommand("report", (player, fullText) => {
  player.call('toggleModal', [1, 'chat']);
});

mp.events.add('submitMyReport', (player, data) => {

  data = JSON.parse(data);
  let d = new Date(), h = d.getHours(), m = d.getMinutes();
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;

  let timeText = `${h}:${m}`;
  data.message = stripStuff(data.message);
  data.title = stripStuff(data.title);

  player.vars.myReport = {
    name: player.name,
    id: player.id,
    title: data.title,
    message: data.message,
    time: timeText
  }
  mp.players.forEach((_player) => {
    if(!_player.loggedIn || _player.loggedIn == false) return;
    if(!_player.checkAdminRank(1)) return;
    if(_player.vars.adminDuty == false) return;
    _player.notify(`~y~${player.name} submitted a report.`);
  });
  player.notify('~y~Your report has been sent.');

});

mp.events.add('requestReports', (player) => {
  if(!player.checkAdminRank(1)) return player.pushChat(`Error: You don't have enough admin permissions.`, null, 'server-error');
  let reports = [];
  mp.players.forEach((_player) => {
    if(!_player.loggedIn || _player.loggedIn == false) return;
    if(_player.vars.myReport == null) return;
    reports.push(_player.vars.myReport)
  });
  player.call('toggleModal', [2, 'chat', JSON.stringify({ list: reports })]);
});

mp.events.add('readReport', (player, id) => {
  if(!player.checkAdminRank(1)) return player.pushChat(`Error: You don't have enough admin permissions.`, null, 'server-error');
  _player = getPlayerID(id);
  if(!_player || _player.loggedIn == false) return player.pushChat(`Error: The player is either offline or doesn't exist.`, null, 'server-error'), mp.events.call("requestReports", player);
  if(!_player.vars.myReport == null) return player.pushChat(`Error: This player don't have a report anymore.`, null, 'server-error'), mp.events.call("requestReports", player);
  player.call('toggleModal', [3, 'chat', JSON.stringify(_player.vars.myReport)]);
});

mp.events.add('sendReportAnswer', (player, data) => {
  data = JSON.parse(data);
  data.message = stripStuff(data.message);
  if(!player.checkAdminRank(1)) return player.pushChat(`Error: You don't have enough admin permissions.`, null, 'server-error'), mp.events.call("requestReports", player);
  let _player = getPlayerID(data.to);
  if(!_player || _player.loggedIn == false) return player.pushChat(`Error: The player is either offline or doesn't exist.`, null, 'server-error'), mp.events.call("requestReports", player);
  if(!_player.vars.myReport == null) return player.pushChat(`Error: This player don't have a report anymore.`, null, 'server-error'), mp.events.call("requestReports", player);
  _player.pushChat(`Report answer from ${player.name}: ${data.message}`, '#eee854'); 
  _player.notify('~r~Your report got an answer.');
  player.sendMessageToDutyAdmins(`[Staff] ${player.name} answered to ${_player.name}'s report. `, null, 'admin-message');
  _player.vars.myReport = null;
});

mp.events.add('deleteReport', (player, id) => {
  if(!player.checkAdminRank(1)) return player.pushChat(`Error: You don't have enough admin permissions.`, null, 'server-error');
  _player = getPlayerID(id);
  if(!_player || _player.loggedIn == false) return player.pushChat(`Error: The player is either offline or doesn't exist.`, null, 'server-error'), mp.events.call("requestReports", player);
  if(!_player.vars.myReport == null) return player.pushChat(`Error: This player don't have a report anymore.`, null, 'server-error'), mp.events.call("requestReports", player);
  _player.notify(`~r~${player.name} deleted your report.`);
  _player.vars.myReport = null;
  player.sendMessageToDutyAdmins(`[Staff] ${player.name} deleted ${_player.name}'s report. `, null, 'admin-message');
});
