
mp.labels.new('~y~City Hall of Los Santos~n~~w~Usage: /enter', new mp.Vector3(-544.962, -204.232, 38.215),
{
    los: false,
    font: 4,
    drawDistance: 10,
    dimension: 0
});

mp.markers.new(1, new mp.Vector3(-544.962, -204.232, 38.215 - 1.4), 1,
{
    color: [246,205,97, 200],
    dimension: 0
});


mp.labels.new('~y~City Hall of Los Santos~n~~w~Usage: /exit', new mp.Vector3(-137.663, -624.165, 168.821),
{
    los: false,
    font: 4,
    drawDistance: 10,
    dimension: 0
});

mp.markers.new(1, new mp.Vector3(-137.663, -624.165, 168.821 - 1.4), 1,
{
    color: [246,205,97, 200],
    dimension: 0
});


mp.labels.new('~y~City Hall of Los Santos~n~~w~Usage: /jobs', new mp.Vector3(-139.086, -632.228, 168.821),
{
    los: false,
    font: 4,
    drawDistance: 10,
    dimension: 0
});

mp.markers.new(1, new mp.Vector3(-139.086, -632.228, 168.821 - 1.4), 1,
{
    color: [246,205,97, 200],
    dimension: 0
});


mp.blips.new(351, new mp.Vector3(-544.962, -204.232, 38.215),{ name: 'City Hall of Los Santos',  color: 45, shortRange: true,  dimension: 0});

mp.events.add('commandEnterEvent', (player) => {
  if(player.IsInRange(-544.962, -204.232, 38.215, 3)) {
    player.position = new mp.Vector3(-137.663, -624.165, 168.821);
    player.dimension = 0;
    player.heading = 83.434;
    player.call('requestIPL', ['ex_dt1_02_office_03a']);
  }
});

mp.events.add('commandExitEvent', (player) => {
  if(player.IsInRange(-137.663, -624.165, 168.821, 3)) {
    player.position = new mp.Vector3(-544.962, -204.232, 38.215);
    player.dimension = 0;
  }
});
