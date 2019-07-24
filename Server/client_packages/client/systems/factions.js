mp.game.object.doorControl(631614199, 461.8065, -994.4086, 25.06443, true, 0, 0, 0); // Jaill Cell 1
mp.game.object.doorControl(631614199, 461.8065, -997.6583, 25.06443, true, 0, 0, 0); // Jaill Cell 2
mp.game.object.doorControl(631614199, 461.8065, -1001.302, 25.06443, true, 0, 0, 0); // Jaill Cell 3
mp.game.object.doorControl(749848321, 453.0793, -983.1895, 30.83926, false, 0, 0, 0); // Armoury

mp.events.add('handcuff', () => {
  player.setEnableHandcuffs(true);
});

mp.events.add('unhandcuff', () => {
  player.setEnableHandcuffs(false);
});