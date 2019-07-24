let weaponsData = ["weapon_dagger", "weapon_bat", "weapon_bottle", "weapon_crowbar", "weapon_unarmed", "weapon_flashlight", "weapon_golfclub", "weapon_hammer", "weapon_hatchet", "weapon_knuckle", "weapon_knife", "weapon_machete", "weapon_switchblade", "weapon_nightstick", "weapon_wrench", "weapon_battleaxe", "weapon_poolcue", "weapon_stone_hatchet", "weapon_pistol", "weapon_pistol_mk2", "weapon_combatpistol", "weapon_appistol", "weapon_stungun", "weapon_pistol50", "weapon_snspistol", "weapon_snspistol_mk2", "weapon_heavypistol", "weapon_vintagepistol", "weapon_flaregun", "weapon_marksmanpistol", "weapon_revolver", "weapon_revolver_mk2", "weapon_doubleaction", "weapon_raypistol", "weapon_microsmg", "weapon_smg", "weapon_smg_mk2", "weapon_assaultsmg", "weapon_combatpdw", "weapon_machinepistol", "weapon_minismg", "weapon_raycarbine", "weapon_pumpshotgun", "weapon_pumpshotgun_mk2", "weapon_sawnoffshotgun", "weapon_assaultshotgun", "weapon_bullpupshotgun", "weapon_musket", "weapon_heavyshotgun", "weapon_dbshotgun", "weapon_autoshotgun", "weapon_assaultrifle", "weapon_assaultrifle_mk2", "weapon_carbinerifle", "weapon_carbinerifle_mk2", "weapon_advancedrifle", "weapon_specialcarbine", "weapon_specialcarbine_mk2", "weapon_bullpuprifle", "weapon_bullpuprifle_mk2", "weapon_compactrifle", "weapon_mg", "weapon_combatmg", "weapon_combatmg_mk2", "weapon_gusenberg", "weapon_sniperrifle", "weapon_heavysniper", "weapon_heavysniper_mk2", "weapon_marksmanrifle", "weapon_marksmanrifle_mk2", "weapon_rpg", "weapon_grenadelauncher", "weapon_grenadelauncher_smoke", "weapon_minigun", "weapon_firework", "weapon_railgun", "weapon_hominglauncher", "weapon_compactlauncher", "weapon_rayminigun", "weapon_grenade", "weapon_bzgas", "weapon_molotov", "weapon_stickybomb", "weapon_proxmine", "weapon_snowball", "weapon_pipebomb", "weapon_ball", "weapon_smokegrenade", "weapon_flare", "weapon_petrolcan", "gadget_parachute", "weapon_fireextinguisher"];
let vehiclesData = ["impaler3", "monster4", "monster5", "slamvan6", "issi6", "cerberus2", "cerberus3", "deathbike2", "dominator6", "deathbike3", "impaler4", "slamvan4", "slamvan5", "brutus", "brutus2", "brutus3", "deathbike", "dominator4", "dominator5", "bruiser", "bruiser2", "bruiser3", "rcbandito", "italigto", "cerberus", "impaler2", "monster3", "tulip", "scarab", "scarab2", "scarab3", "issi4", "issi5", "clique", "deveste", "vamos", "imperator", "imperator2", "imperator3", "toros", "deviant", "schlagen", "impaler", "zr380", "zr3802", "zr3803", "dinghy", "dinghy2", "dinghy3", "dinghy4", "jetmax", "marquis", "seashark", "seashark2", "seashark3", "speeder", "speeder2", "squalo", "submersible", "submersible2", "suntrap", "toro", "toro2", "tropic", "tropic2", "tug", "benson", "biff", "hauler", "hauler2", "mule", "mule2", "mule3", "mule4", "packer", "phantom", "phantom2", "phantom3", "pounder", "pounder2", "stockade", "stockade3", "terbyte", "blista", "brioso", "dilettante", "dilettante2", "issi2", "panto", "prairie", "rhapsody", "cogcabrio", "exemplar", "f620", "felon", "felon2", "jackal", "oracle", "oracle2", "sentinel", "sentinel2", "windsor", "windsor2", "zion", "zion2", "bmx", "cruiser", "fixter", "scorcher", "tribike", "tribike2", "tribike3", "ambulance", "fbi", "fbi2", "firetruk", "lguard", "pbus", "police", "police2", "police3", "police4", "policeb", "polmav", "policeold1", "policeold2", "policet", "pranger", "predator", "riot", "riot2", "sheriff", "sheriff2", "akula", "annihilator", "buzzard", "buzzard2", "cargobob", "cargobob2", "cargobob3", "cargobob4", "frogger", "frogger2", "havok", "hunter", "maverick", "savage", "skylift", "supervolito", "supervolito2", "swift", "swift2", "valkyrie", "valkyrie2", "volatus", "bulldozer", "cutter", "dump", "flatbed", "guardian", "handler", "mixer", "mixer2", "rubble", "tiptruck", "tiptruck2", "apc", "barracks", "barracks2", "barracks3", "barrage", "chernobog", "crusader", "halftrack", "khanjali", "rhino", "thruster", "trailersmall2", "akuma", "avarus", "bagger", "bati", "bati2", "bf400", "carbonrs", "chimera", "cliffhanger", "daemon", "daemon2", "defiler", "diablous", "diablous2", "double", "enduro", "esskey", "faggio", "faggio2", "faggio3", "fcr", "fcr2", "gargoyle", "hakuchou", "hakuchou2", "hexer", "innovation", "lectro", "manchez", "nemesis", "nightblade", "oppressor", "oppressor2", "pcj", "ratbike", "ruffian", "sanchez2", "sanctus", "shotaro", "sovereign", "thrust", "vader", "vindicator", "vortex", "wolfsbane", "zombiea", "zombieb", "blade", "buccaneer", "buccaneer2", "chino", "chino2", "coquette3", "dominator", "dominator2", "dukes", "dukes2", "faction", "faction2", "faction3", "gauntlet", "gauntlet2", "hermes", "hotknife", "lurcher", "moonbeam", "moonbeam2", "nightshade", "pheonix", "picador", "ratloader", "ratloader2", "ruiner", "ruiner2", "ruiner3", "sabregt", "sabregt2", "slamvan", "slamvan2", "slamvan3", "stalion", "stalion2", "tampa", "tampa3", "vigero", "virgo", "virgo2", "virgo3", "voodoo", "voodoo2", "yosemite", "bfinjection", "bifta", "blazer", "blazer2", "blazer3", "blazer4", "blazer5", "bodhi2", "brawler", "dloader", "dubsta3", "dune", "dune2", "dune3", "dune4", "dune5", "freecrawler", "insurgent", "insurgent2", "insurgent3", "kalahari", "marshall", "mesa3", "monster", "menacer", "nightshark", "rancherxl", "rancherxl2", "rebel", "rebel2", "riata", "sandking", "sandking2", "technical", "technical2", "technical3", "trophytruck", "trophytruck2", "alphaz1", "avenger", "besra", "blimp", "blimp2", "blimp3", "bombushka", "cargoplane", "cuban800", "dodo", "duster", "howard", "hydra", "jet", "lazer", "luxor", "luxor2", "mammatus", "microlight", "miljet", "mogul", "molotok", "nimbus", "nokota", "pyro", "rogue", "seabreeze", "shamal", "starling", "strikeforce", "stunt", "titan", "tula", "velum", "velum2", "vestra", "volatol", "baller", "baller2", "baller3", "baller4", "baller5", "baller6", "bjxl", "cavalcade", "cavalcade2", "contender", "dubsta", "dubsta2", "fq2", "granger", "gresley", "habanero", "huntley", "landstalker", "mesa", "mesa2", "patriot", "patriot2", "radi", "rocoto", "seminole", "serrano", "xls", "xls2", "asea", "asea2", "asterope", "cog55", "cog552", "cognoscenti", "cognoscenti2", "emperor", "emperor2", "emperor3", "fugitive", "glendale", "ingot", "intruder", "limo2", "premier", "primo", "primo2", "regina", "romero", "schafter2", "schafter5", "schafter6", "stafford", "stanier", "stratum", "stretch", "superd", "surge", "tailgater", "warrener", "washington", "airbus", "brickade", "bus", "coach", "pbus2", "rallytruck", "rentalbus", "taxi", "tourbus", "trash", "trash2", "wastelander", "alpha", "banshee", "bestiagts", "blista2", "blista3", "buffalo", "buffalo2", "buffalo3", "carbonizzare", "comet2", "comet3", "comet4", "coquette", "elegy", "elegy2", "feltzer2", "furoregt", "fusilade", "futo", "jester", "jester2", "khamelion", "kuruma", "kuruma2", "lynx2", "massacro", "massacro2", "neon", "ninef", "ninef2", "omnis", "pariah", "penumbra", "raiden", "rapidgt", "rapidgt2", "raptor", "revolter", "ruston", "schafter3", "schafter4", "schwarzer", "sentinel3", "seven70", "specter", "specter2", "streiter", "sultan", "surano", "tampa2", "tropos", "verlierer2", "ardent", "btype", "btype2", "btype3", "casco", "cheetah2", "coquette2", "deluxo", "feltzer3", "gt500", "infernus2", "jb700", "mamba", "manana", "monroe", "peyote", "pigalle", "rapidgt3", "retinue", "savestra", "stinger", "stingergt", "stromberg", "swinger", "torero", "tornado", "tornado2", "tornado3", "tornado4", "tornado5", "tornado6", "turismo2", "viseris", "ztype", "adder", "autarch", "banshee2", "bullet", "cheetah", "cyclone", "entityxf", "fmj", "gp1", "infernus", "italigtb", "italigtb2", "le7b", "nero", "nero2", "osiris", "penetrator", "pfister811", "prototipo", "reaper", "sc1", "scramjet", "sheava", "sultanrs", "t20", "tempesta", "turismor", "tyrus", "vacca", "vagner", "vigilante", "visione", "voltic", "voltic2", "xa21", "zentorno", "armytanker", "armytrailer2", "baletrailer", "boattrailer", "cablecar", "docktrailer", "graintrailer", "proptrailer", "raketrailer", "tr2", "tr3", "tr4", "trflat", "tvtrailer", "tanker", "tanker2", "trailerlogs", "trailersmall", "trailers", "trailers2", "trailers3", "freight", "freightcar", "freightcont1", "freightcont2", "freightgrain", "tankercar", "airtug", "caddy", "caddy2", "caddy3", "docktug", "forklift", "mower", "ripley", "sadler", "sadler2", "scrap", "towtruck", "towtruck2", "tractor", "tractor2", "tractor3", "utillitruck", "utillitruck2", "utillitruck3", "bison", "bison2", "bison3", "bobcatxl", "boxville", "boxville2", "boxville3", "boxville4", "boxville5", "burrito", "burrito2", "burrito3", "burrito4", "burrito5", "camper", "gburrito", "gburrito2", "journey", "minivan", "minivan2", "paradise", "pony", "pony2", "rumpo", "rumpo2", "rumpo3", "speedo", "speedo2", "speedo4", "surfer", "surfer2", "taco", "youga", "youga2"]
let vehiclesWithEngines = [2053223216, 850991848, 1518533038, 387748548, 904750859, 3244501995, 2242229361, 1945374990, 569305213, 2157618379, 2645431192, 177270108, 2112052861, 1653666139, 1747439474, 4080511798, 2306538597, 3950024287, 1549126457, 3164157193, 1682114128, 3117103977, 3863274624, 2844316578, 841808271, 330661258, 4289813342, 3703357000, 3903372712, 4205676014, 3670438162, 1348744438, 3783366066, 1349725314, 873639469, 1581459400, 2364918497, 3172678083, 3101863448, 1171614426, 1127131465, 2647026068, 1938952078, 469291905, 2287941233, 2046537925, 2667966721, 1912215274, 2321795001, 4260343491, 353883353, 2758042359, 2515846680, 456714581, 741586030, 3089277354, 2601952180, 2611638396, 1922257928, 1886712733, 3288047904, 2164484578, 1353720154, 2186977100, 444583674, 3510150843, 475220373, 2589662668, 48339065, 3347205726, 562680400, 3471458123, 1074326203, 630371791, 4081974053, 3602674979, 321739290, 4262731174, 2859440138, 782665360, 1672195559, 2179174271, 2154536131, 4180675781, 3403504941, 86520421, 11251904, 6774487, 390201602, 2006142190, 2890830793, 822018448, 4055125828, 1790834270, 2623969160, 1753414259, 2035069708, 2452219115, 55628203, 3005788552, 627535535, 3537231886, 741090084, 1265391242, 4039289119, 301427732, 4135840458, 640818791, 2771538552, 3660088182, 2688780135, 884483972, 2069146067, 3385765638, 1873600305, 3401388520, 2841686334, 1491277511, 3889340782, 743478836, 1836027715, 4154065143, 2941886209, 3685342204, 3676349299, 3285698347, 3724934023, 3089165662, 3612755468, 3281516360, 349605904, 2933279331, 784565758, 80636076, 3379262425, 723973206, 3968823444, 2175389151, 2504420315, 2255212070, 2494797253, 349315417, 15219735, 37348240, 2068293287, 525509695, 1896491931, 2351681756, 1312550391, 1507916787, 3627815886, 3705788919, 4067225593, 941494461, 777714999, 2609945748, 223258115, 729783779, 833469436, 1119641113, 1923400478, 3893323758, 972671128, 3084515313, 3469130167, 3796912450, 3395457658, 16646064, 2006667053, 523724515, 1871995513, 1126868326, 3945366167, 2166734073, 4246935337, 3025077634, 3854198872, 2704629607, 2859047862, 2815302597, 1770332643, 3057713523, 2633113103, 534258863, 1897744184, 3467805257, 3982671785, 4240635011, 2434067162, 2071877360, 2370534026, 92612664, 1233534620, 2230595153, 3449006043, 2044532910, 433954513, 1645267888, 1933662059, 3087195462, 2249373259, 2762269779, 3105951696, 989381445, 2198148358, 1180875963, 1356124575, 101905590, 3631668194, 3486135912, 142944341, 1878062887, 634118882, 470404958, 666166960, 850565707, 2006918058, 3505073125, 683047626, 1177543287, 3900892662, 3157435195, 2519238556, 2751205197, 884422927, 486987393, 1269098716, 914654722, 3546958660, 3486509883, 3874056184, 2643899483, 2136773105, 1221512915, 1337041428, 1203490606, 3862958888, 2485144969, 2487343317, 2391954683, 906642318, 704435172, 2264796000, 3690124666, 3609690755, 2411965148, 3053254478, 1909141499, 75131841, 3005245074, 886934177, 4180339789, 2411098011, 3144368207, 2254540506, 4280472072, 627094268, 3039514899, 3406724313, 1922255844, 321186144, 2817386317, 1723137093, 2333339779, 1123216662, 2400073108, 3286105550, 1373123368, 1777363799, 1283517198, 3989239879, 3581397346, 2222034228, 345756458, 2191146052, 3196165219, 3338918751, 1941029835, 1917016601, 3039269212, 2382949506, 767087018, 3253274834, 1274868363, 1039032026, 3703315515, 3990165190, 736902334, 237764926, 2072687711, 3249425686, 2272483501, 1561920505, 108773431, 196747873, 3728579874, 2299640309, 3205927392, 499169875, 2016857647, 2997294755, 3188613414, 544021352, 2922118804, 410882957, 1573551258, 4152024626, 3663206819, 2445973230, 1032823388, 2833484545, 3517794615, 867799010, 3917501776, 2765724541, 2360515092, 1737773231, 3620039993, 3884762073, 719660200, 2809443750, 1489967196, 3548084598, 1104234922, 2537130571, 1886268224, 1074745671, 1741861769, 970598228, 384071873, 3223586949, 1887331236, 1102544804, 159274291, 117401876, 3463132580, 3692679425, 941800958, 223240013, 1011753235, 1483171323, 2728226064, 2215179066, 2889029532, 1051415893, 2634021974, 2170765704, 3861591579, 1830407356, 1078682497, 2049897956, 1841130506, 903794909, 1545842587, 2196019706, 886810209, 500482303, 1504306544, 464687292, 1531094468, 1762279763, 2261744861, 2497353967, 2736567667, 3312836369, 3903371924, 758895617, 3078201489, 3981782132, 633712403, 2598821281, 2983812512, 1392481335, 3003014393, 1426219628, 1234311532, 418536135, 2246633323, 3812247419, 3062131285, 1034187331, 1093792632, 1987142870, 2536829930, 2465164804, 2123327359, 234062309, 1352136073, 3656405053, 819197656, 3999278268, 1663218586, 272929391, 408192225, 2067820283, 338562499, 1939284556, 3052358707, 3296789504, 2672523198, 989294410, 917809321, 2891838741, 1030400667, 184361638, 920453016, 240201337, 642617954, 586013744, 1560980623, 1147287684, 3757070668, 3525819835, 3410276810, 1491375716, 1783355638, 3448987385, 3695398481, 734217681, 2594165727, 2971866336, 3852654278, 1641462412, 2218488798, 1445631933, 516990260, 887537515, 2132890591, 4278019151, 2072156101, 1739845664, 1069929536, 2307837162, 4061868990, 121658888, 444171386, 682434785, 2948279460, 3387490166, 2551651283, 893081117, 1132262048, 1876516712, 2549763894, 296357396, 4174679674, 3984502180, 3168702960, 1488164764, 4175309224, 943752001, 1162065741, 2518351607, 1475773103, 3484649228, 728614474, 219613597, 699456151, 2983726598, 1951180813, 65402552, 1026149675];


mp.events.add('loadVariables', player => {
  
  player.vars.killedBy = null;
  player.vars.killedSeconds = 0;

  player.notifyError = function (message) {
    player.call('sendNotify', [0, message]);
  }

  player.notifySuccess = function (message) {
    player.call('sendNotify', [1, message]);
  }

  player.notifyInfo = function (message) {
    player.call('sendNotify', [2, message]);
  }

  player.notifyWarning = function (message) {
    player.call('sendNotify', [3, message]);
  }

  player.giveSubtitle = function (text, seconds, location, exactDistance) {
    let sub = {
      text: text,
      seconds: seconds || 30,
      location: location || null,
      exactDistance: exactDistance || false
    }
    player.call('addSubtitle', [JSON.stringify(sub)]);
  }

  player.clearSubtitles = function (object) {
    player.call('clearSubtitles');
  }

  player.formatMoney = function (n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
      j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };

  player.getMoney = function () {
    return player.info.wallet;
  }

  player.haveMoney = function (money) {
    if (player.info.wallet >= money) return true;
    return false;
  }

  player.takeMoney = function (money) {
    if (money < 1) return false;
    player.info.wallet -= parseInt(money);
    if (player.info.wallet < 1) { player.info.wallet = 0; }
  }

  player.giveMoney = function (money) {
    if (money < 1 || money > 999999999) return false;
    player.info.wallet += parseInt(money);
    player.call("playSoundEffect", ["LOCAL_PLYR_CASH_COUNTER_COMPLETE", "DLC_HEISTS_GENERAL_FRONTEND_SOUNDS"])
  }

  player.setNotificationMessage = function(picName1, picName2, flash, iconType, sender, subject, message) {
    player.call('setNotificationMessage', [picName1, picName2, flash, iconType, sender, subject, message]);
  }

  player.weaponValid = function (name) {
    if (weaponsData.includes(name)) {
      return true;
    } else {
      return false;
    }
  }
  player.vehicleValid = function (name) {
    if (vehiclesData.includes(name)) {
      return true;
    } else {
      return false;
    }
  }

  player.vehicleModelHaveEngine = function (name) {
    if (vehiclesWithEngines.includes(name)) {
      return true;
    } else {
      return false;
    }
  }

});

mp.events.add('onRadioStationChanged', (player, hash) => {
  if(!player.vehicle) return;
  player.vehicle.setVariable('radioIndex', hash);
});

mp.events.add("loggedQuit", (player, exitType, reason) => {
  if (player.loadAccountTimer) {
    clearTimeout(player.loadAccountTimer);
  }

  let count = 0;
  mp.players.forEach((target, index) => {
    if(target.loggedIn && target.loggedIn != true) return;
    if(target.name == player.name) return;
    count ++;
  });

  mp.players.forEach((target, index) => {
    target.setVariable('playersOnline', count);
  });

});

mp.events.add("playPedAnimation", (player, collection, name, flag) => {
  player.playAnimation(collection, name, 1, flag);
});

mp.events.add("LookingAtPhone", (player) => {
  if (!player.vehicle) {
    player.playScenario('WORLD_HUMAN_STAND_MOBILE');
  }
});

mp.events.add("stopAnimation", (player) => {
  if (!player.vehicle) {
    player.stopAnimation();
  }
});

global.formatMoney = function (n, c, d, t) {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

global.capitalize = function (s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


global.getPlayerID = (value) => {
  if (!isNaN(value) == true) {
    return mp.players.at(value);
  } else {
    let result = null;
    mp.players.forEach((player) => {
      if (result != null) return;
      if (player.name == value) {
        result = mp.players.at(player.id);
      }
    });
    return result;
  }
}

mp.events.add('playerTimer', (player) => {
  if(player.vars.killedSeconds != 0) {
    player.vars.killedSeconds --;
  }
});

mp.events.add("playerDeath", (player, reason, killer) => {
  if (player.loggedIn == true) {
    if (killer && killer != player) {
      if(killer.info.member == 0 && player.info.wanted != 0) return;
      killer.info.crimes++;
      player.vars.killedBy = killer;
      player.vars.killedSeconds = 10;
      player.pushChat('You have been killed by ' + killer.name + '. You have 10 seconds to report this crime (/call 911)', null, 'server-message');
    }
    player.vars.hospitalized = true;
  }
});

mp.events.add('registeredJoin', player => {
  player.info.crimes = 0;
});