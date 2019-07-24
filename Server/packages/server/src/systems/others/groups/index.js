// To-Do: Cand faci Rob sa adaugi asta inapoi, atm nu are rost un grup.

// const table = require("./schema.js");
// global.Groups = [];


// let groupsQuery = table.find({}, function (err, groups) {
//   if (err) return console.log(err);
// });

// groupsQuery.then((result) => {
//   let query = new Promise(function(resolve, reject) {
//     result.forEach((group) => {
//       let obj = {
//         id: group._id,
//         name: group.name,
//         members: group.members
//       }
//       Groups.push(obj);
//       resolve(Groups.length);
//     }); 
//   });

//   query.then((resolve) => {
//     console.log(`[Groups] ${resolve} loaded.`);
//   });

// });

// global.SaveGroups = function() {
//   Groups.forEach((g, index) => {
//     SaveGroup(index);
//   });
// }

// global.SaveGroup = function(index) {
//   let g = Groups[index];
//   table.findOne({ _id: g.id }, function(err, group) {
//     if(group == null) {
//       if(err) return console.log(`Group ${index} save erorr: ${err}`);
//     } else {
//       group.name = g.name;
//       group.members = g.members;
//       group.save();
//     }
//   });
// }

// global.getGroupID = function(title) {
//   let group = null;
//   Groups.forEach((g, index) => {
//     if(group != null) return;
//     if(g.name == title) return group = index;
//   });
//   return group;
// }

// mp.events.add('registeredJoin', player => {
//   player.info.group = null;
// });

// function cmd_group(player, fullText, param1, ...param2) {
//   if(param1 == undefined) {
//     if(player.info.group == null) return player.pushError("You're not part of a group. Use /group create to make one.");
//     if(player.info.group != null) return player.pushExample("/group stats, invite, kick, leave");
//   }
//   if(param1 == 'stats') {
//     if(player.info.group == null) return player.pushError("You can't use this command.");
//     let members = [];
//     Groups[getGroupID(player.info.group)].members.forEach((p) => {
//       let obj = `${p.name}${p.online == true ? ' (' + getPlayerID(p.name).id + ')' : ''}`;
//       members.push(obj);
//     });
//     members = members.join(", ");
//     player.pushChat(`[Group ${Groups[getGroupID(player.info.group)].name} Stats]`, null, 'group-message');
//     player.pushChat(`Members: ${members}`, null, 'group-message');
//     player.pushChat(`Leader: ${Groups[getGroupID(player.info.group)].members.filter(user => user.owner == true)[0].name}`, null, 'group-message');
//     player.pushChat('_____________', null, 'group-message');
//   }
//   if(param1 == 'create') {
//     if(player.info.group != null) return player.pushError("Leave this group before creating your new one.");
//     if(param2 == undefined) return player.pushExample("/group create [Name]");
//     param2 = param2.join(" ");
//     if(player.info.level < 5) return player.pushError("You must be level 5 at least to create a group.");
//     if(param2.length < 4) return player.pushError("The group name is too short. Must have at least 5 characters.");
//     if(param2.length > 20) return player.pushError("The group name is too long. You reached the limit of 20 characters.");
//     let result = false;
//     Groups.forEach((group) => {
//       if(result == true) return;
//       if(group.name == param2) return result = true, console.log(group);
//     });
//     if(result == true) return player.pushError("This group name already exists.");
    
//     let group = {
//       id: null,
//       name: param2,
//       members: [
//         {
//           name: player.name,
//           owner: true,
//           joinDate: new Date(),
//           lastOnline: new Date(),
//           online: true
//         }
//       ]
//     }

//     const groupDoc = new table(group);
//     groupDoc.save((err, doc) => {
//       if(err) return console.log('Group save error: ' + err);
//       group.id = doc._id;
//       Groups.push(group);
//       player.pushChat(`Group ${param2} has been created. Type /group for commands.`, null, 'group-message');
//       player.info.group = param2;
//       SaveGroup(getGroupID(player.info.group));
//     });
//   }
//   if(param1 == 'invite') {
//     if(player.info.group == null) return player.pushError("You're not part of a group.");
//     if(Groups[getGroupID(player.info.group)].members.filter(member => member.name == player.name)[0].owner != true) return player.pushError("You're not the leader of this group.");
//     param2 = !isNaN(param2) == true ? parseInt(param2) : param2.toString();
//     param2 = getPlayerID(param2);
//     if(!param2 || param2.loggedIn == false) return player.pushExample("/group invite [Player ID / Name]");
//     if(param2 == player) return player.pushError("You can't invite yourself.");
//     let max = Groups[getGroupID(player.info.group)].members.length;
//     if(max > 9) return player.pushError("This group has reached its limit of 10 players.");
//     let dist = player.dist(param2.position);
//     if(dist > 10) return player.pushError("Player is too far away.");
//     if(param2.info.group != null) return player.pushError("This player already is in a group.");
//     player.vars.invitations.group = param2;
//     player.pushChat(`You have invited ${param2.name} to join your group.`, null, 'group-message');
//     param2.pushChat(`${player.name} invited you to join the group ${Groups[getGroupID(player.info.group)].name} (/accept group ${player.id}).`, null, 'group-message');
//   }
//   if(param1 == 'kick') {
//     if(player.info.group == null) return player.pushError("You're not part of a group.");
//     if(Groups[getGroupID(player.info.group)].members.filter(member => member.name == player.name)[0].owner != true) return player.pushError("You're not the leader of this group.");
//     param2 = !isNaN(param2) == true ? parseInt(param2) : param2.toString();
//     param2 = getPlayerID(param2);
//     if(!param2 || param2.loggedIn == false) return player.pushExample("/group kick [Player ID / Name]");
//     if(param2 == player) return player.pushError("You can't kick yourself. Use /group leave.");
//     mp.players.forEach((p) => {
//       if(p.loggedIn == false || !p.loggedIn) return;
//       if(p.info.group != player.info.group) return;
//       p.pushChat(`Group leader ${player.name} kicked ${param2.name} out of this group.`, null, 'group-message');
//     });
//     param2.info.group = null;
//     Groups[getGroupID(player.info.group)].members.filter(member => member.name == param2.name)[0].splice();
//     SaveGroup(getGroupID(player.info.group));
//   }
//   if(param1 == 'leave') {
//     if(player.info.group == null) return player.pushError("You're not part of a group.");
//     let rank = Groups[getGroupID(player.info.group)].members.filter(member => member.name == player.name)[0].owner;
//     if(rank == false) {
//       mp.players.forEach((p) => {
//         if(p.loggedIn == false || !p.loggedIn) return;
//         if(p.info.group != player.info.group) return;
//         p.pushChat(`${player.name} left this group.`, null, 'group-message');
//       });
//       Groups[getGroupID(player.info.group)].members.forEach((g, index) => {
//         if(g.name == player.name) {
//           Groups[getGroupID(player.info.group)].members.splice(index, 1);
//         }
//       });
//       SaveGroup(getGroupID(player.info.group));
//       player.info.group = null;
//     } else {
//       let found = false;
//       let group = player.info.group;
//       Groups[getGroupID(player.info.group)].members.forEach((g, index) => {
//         if(g.name == player.name) {
//           Groups[getGroupID(player.info.group)].members.splice(index, 1);
//         }
//       });     
//       player.info.group = null;
//       mp.players.forEach((p) => {
//         if(p.loggedIn == false || !p.loggedIn) return;
//         if(p.info.group != group) return;
//         if(found == true) return;
//         p.pushChat(`${p.name} is the new leader of this group.`, null, 'group-message');
//         Groups[getGroupID(group)].members.filter(member => member.name == p.name)[0].owner = true;
//         found = true;
//       });
//       if(found == false) {
//         table.findOne({ _id: Groups[getGroupID(group)].id }, function(err, grp) {
//           if(grp == null) {
//             if(err) return console.log(`Group ${index} delete erorr: ${err}`);
//           } else {
//             grp.delete();
//             Groups.splice(getGroupID(group), 1);
//           }
//         });
//       }
//       else {
//         SaveGroup(getGroupID(group));
//       }
//       player.pushChat(`You have left the group. ${found == false ? 'The group was removed.' : ''}`, null, 'group-message');
//     }
//   }
// }

// mp.events.addCommand("group", cmd_group);

// mp.events.add('loggedJoin', player => {
//   if(player.info.group != null) {
//     let groupOnline = [];
//     mp.players.forEach((p) => {
//       if(!p.loggedIn || p.loggedIn == false) return;
//       if(p.info.group != player.info.group) return;
//       if(p == player) return;
//       p.notify(`Group: ~p~${player.name} joined.`); 
//       groupOnline.push(player.name);
//     });
//     if(groupOnline.length > 0) {
//       player.notify(`Group: ~p~Welcome back.~n~Members online: ${groupOnline.join(", ")}`)
//     }
//     Groups[getGroupID(player.info.group)].members.filter(user => user.name == player.name)[0].online = true;
//     Groups[getGroupID(player.info.group)].members.filter(user => user.name == player.name)[0].lastOnline = new Date();
//     SaveGroup(getGroupID(player.info.group));
//   }
// });

// mp.events.add('loggedQuit', player => {
//   if(player.info.group != null) {

//     mp.players.forEach((p) => {
//       if(!p.loggedIn || p.loggedIn == false) return;
//       if(p.info.group != player.info.group) return;
//       if(p == player) return;
//       p.notify(`Group: ~p~${player.name} quit.`); 
//     });

//     Groups[getGroupID(player.info.group)].members.filter(user => user.name == player.name)[0].online = false;
//     Groups[getGroupID(player.info.group)].members.filter(user => user.name == player.name)[0].lastOnline = new Date();
//     SaveGroup(getGroupID(player.info.group));
//   }
// });