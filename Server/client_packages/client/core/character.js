mp.events.add('prepareCharacter', () => {
  player.freezePosition(true);
  player.position = new mp.Vector3(402.8664, -996.4108, -99.00027);
  camera = mp.cameras.new("camera", new mp.Vector3(402.8664, -997.5515, -98.5), new mp.Vector3(0, 0, 0), 45);
  camera.pointAtCoord(new mp.Vector3(402.8664, -996.4108, -98.5));
  camera.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
  mp.gui.cursor.show(true, true);
  if (mp.browsers.exists(browser)) { browser.destroy(); }
  player.setHeading(185.0);
  player.clearTasksImmediately();
  if(hud == null) {
    hud = mp.browsers.new(cefDomain + '/hud');
    hud.markAsChat();      
  }
  hud.execute(`gui.modals[2].setUsingMethod('register');`);
  mp.events.call("toggleModal", 13, 'nothing');
  mp.game.graphics.setTimecycleModifier('default');
  mp.events.callRemote("playPedAnimation", "misshair_shop@barbers" , "idle_a_cam", 1);
});

// player.getNumberOfTextureVariations(componentId, drawableId); => Find a way to use this.
// when player updates ped, send a modal with array of avaiables textures ? and sets availableTexture.tops = true/ flase ?

// let palleteID = 0;
// let textureID = 0;

// mp.keys.bind(0x26, true, function() {
//   if(loggedIn == false) return;
//   palleteID ++;
// });

// mp.keys.bind(0x28, true, function() {
//   if(loggedIn == false) return;
//   palleteID --;
// });

// mp.keys.bind(0x27, true, function() {
//   if(loggedIn == false) return;
//   textureID ++;
// });

// mp.keys.bind(0x25, true, function() {
//   if(loggedIn == false) return;
//   textureID --;
// });

// mp.keys.bind(0x73, true, function() {
//   if(loggedIn == false) return;
//   notifyError('Texture: ' + textureID + ' Pallete: ' + palleteID);
// });

mp.events.add('updateClientCharacter', (gender, facial, facialColor, eyebrows, ageing, makeup, lipstick, lipstickColor, hair, hairColor1, hairColor2, tops, pants, shoes, hat, glasses, eyes, mask) => {

  // player.clearTasksImmediately();
  // mp.events.callRemote("playPedAnimation", "misshair_shop@barbers" , "idle_a_cam", 1);

  if (player.model != data.freemodeSkins[gender]) {
    player.model = data.freemodeSkins[gender];
  }

  setTimeout(() => {
    player.setHeadOverlay(1, facial == 0 ? -1 : facial, 1, facialColor, facialColor);
    player.setHeadOverlay(2, eyebrows, 1, facialColor, facialColor);
    player.setHeadOverlay(3, ageing == 0 ? -1 : ageing, 1, 255, 255);
    player.setHeadOverlay(4, makeup == 0 ? -1 : makeup, 1, 255, 255);
    player.setHeadOverlay(8, lipstick == 0 ? -1 : lipstick, 1, lipstickColor, lipstickColor);
    player.setComponentVariation(1, 0, 0, 0);
    player.setEyeColor(eyes);
    player.setComponentVariation(8, data.tops[gender][tops].Undershirt, 0, 0);
    player.setComponentVariation(3, data.tops[gender][tops].Torso, 0, 0);
    player.setComponentVariation(11, data.tops[gender][tops].Top, 0, 0);
    player.setComponentVariation(4, data.pants[gender][pants], 0, 0);
    player.setComponentVariation(6, data.shoes[gender][shoes], 0, 0);
    player.setComponentVariation(2, hair, 0, 0);
    player.setHairColor(hairColor1, hairColor2);
    player.setPropIndex(0, data.hats[gender][hat], 0, true);
    player.setPropIndex(1, data.glasses[gender][glasses], 0, true);
    player.setComponentVariation(1, data.masks[mask], 0, 0);

  }, 100);

});

mp.events.add('changeCharacterFov', (fov) => {
  camera.setFov(fov);
});

mp.events.add('changeCharacterRot', (rot) => {
  player.setHeading(rot);
});

mp.events.add('saveCharacterCreated', (father, mother, resemblance, skinTone, gender, facial, facialColor, eyebrows, ageing, makeup, lipstick, lipstickColor, hair, hairColor1, hairColor2, tops, pants, shoes, hat, glasses, eyes, mask, price) => {

  let character = {
    father: data.fathers[father],
    mother: data.mothers[mother],
    resemblance: resemblance,
    skinTone: skinTone,
    model: player.model,
    facial: facial,
    facialColor: facialColor,
    eyebrows: eyebrows,
    ageing: ageing,
    makeup: makeup,
    lipstick: lipstick,
    lipstickColor: lipstickColor,
    hair: hair,
    hairColor1: hairColor1,
    hairColor2: hairColor2,
    undershirt: data.tops[gender][tops].Undershirt,
    torso: data.tops[gender][tops].Torso,
    top: data.tops[gender][tops].Top,
    pants: data.pants[gender][pants],
    shoes: data.shoes[gender][shoes],
    gender: gender,
    eyes: eyes,
    mask: data.masks[mask],
    hat: data.hats[gender][hat],
    glasses: data.glasses[gender][glasses],
    options: {}
  }

  character.options = {
    father: father,
    mother: mother,
    resemblance: resemblance,
    skinTone: skinTone,
    model: player.model,
    facial: facial,
    facialColor: facialColor,
    eyebrows: eyebrows,
    ageing: ageing,
    makeup: makeup,
    lipstick: lipstick,
    lipstickColor: lipstickColor,
    hair: hair,
    hairColor1: hairColor1,
    hairColor2: hairColor2,
    tops: tops,
    pants: pants,
    shoes: shoes,
    gender: gender,
    eyes: eyes,
    mask: mask,
    hat: hat,
    glasses: glasses
  }

  character = JSON.stringify(character);
  mp.events.call("comeBackFromBrowser");
  mp.events.callRemote("saveCharacter", character, price);
  mp.events.callRemote("stopAnimation");
});

mp.events.add('updateClientRace', (father, mother, resemblance, skinTone) => {
  player.setHeadBlendData(data.mothers[mother], data.fathers[father], 0, data.mothers[mother], data.fathers[father], 0, resemblance, skinTone, 0.0, false);
});

let data = {
  pants: [
    [0, 1, 3, 4, 6, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 19, 20, 21, 26, 27, 29, 33, 36, 37, 42, 48, 50, 51, 52, 53, 54, 55, 56, 65, 69, 71, 78, 79, 80, 81, 82, 83, 88, 100],
    [0, 2, 4, 6, 7, 8, 10, 11, 12, 14, 15, 18, 19, 20, 24, 25, 27, 28, 31, 34, 41, 43, 44, 49, 50, 51, 52, 53, 55, 57, 58, 62, 63, 67, 71, 73, 74, 76, 78, 80, 81, 82, 83, 84, 85, 87, 88]
  ],
  shoes: [
    [1, 3, 4, 5, 6, 10, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 40, 41, 43, 44, 46, 48, 49, 50, 52, 53, 55, 57, 60, 62, 77, 79, 80, 81, 82],
    [0, 2, 3, 5, 6, 7, 8, 9, 10, 11, 14, 15, 17, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 35, 38, 43, 44, 56, 58, 60, 61, 65, 66, 67, 68, 77, 79, 80, 81, 83, 84]
  ],
  tops: [
    [{ Top: 15, Torso: 15, Undershirt: 15 },
    { Top: 1, Torso: 0, Undershirt: 15 },
    { Top: 3, Torso: 1, Undershirt: 106 },
    { Top: 4, Torso: 1, Undershirt: 4 },
    { Top: 4, Torso: 1, Undershirt: 16 },
    { Top: 5, Torso: 5, Undershirt: 15 },
    { Top: 109, Torso: 5, Undershirt: 15 },
    { Top: 125, Torso: 5, Undershirt: 15 },
    { Top: 129, Torso: 5, Undershirt: 15 },
    { Top: 137, Torso: 5, Undershirt: 15 },
    { Top: 176, Torso: 15, Undershirt: 15 },
    { Top: 179, Torso: 15, Undershirt: 15 },
    { Top: 205, Torso: 15, Undershirt: 15 },
    { Top: 223, Torso: 15, Undershirt: 15 },
    { Top: 6, Torso: 1, Undershirt: 2 },
    { Top: 7, Torso: 1, Undershirt: 1 },
    { Top: 42, Torso: 8, Undershirt: 15 },
    { Top: 38, Torso: 8, Undershirt: 15 },
    { Top: 81, Torso: 8, Undershirt: 15 },
    { Top: 86, Torso: 8, Undershirt: 15 },
    { Top: 87, Torso: 8, Undershirt: 15 },
    { Top: 89, Torso: 8, Undershirt: 15 },
    { Top: 96, Torso: 8, Undershirt: 15 },
    { Top: 98, Torso: 8, Undershirt: 15 },
    { Top: 107, Torso: 8, Undershirt: 15 },
    { Top: 110, Torso: 8, Undershirt: 15 },
    { Top: 121, Torso: 8, Undershirt: 15 },
    { Top: 126, Torso: 8, Undershirt: 15 },
    { Top: 128, Torso: 8, Undershirt: 15 },
    { Top: 143, Torso: 8, Undershirt: 15 },
    { Top: 171, Torso: 8, Undershirt: 15 },
    { Top: 184, Torso: 8, Undershirt: 15 },
    { Top: 190, Torso: 8, Undershirt: 15 },
    { Top: 217, Torso: 8, Undershirt: 15 },
    { Top: 245, Torso: 8, Undershirt: 15 },
    { Top: 251, Torso: 8, Undershirt: 15 },
    { Top: 11, Torso: 0, Undershirt: 6 },
    { Top: 14, Torso: 1, Undershirt: 15 },
    { Top: 135, Torso: 0, Undershirt: 15 },
    { Top: 193, Torso: 0, Undershirt: 15 },
    { Top: 20, Torso: 1, Undershirt: 26 },
    { Top: 115, Torso: 12, Undershirt: 25 },
    { Top: 106, Torso: 12, Undershirt: 25 },
    { Top: 77, Torso: 12, Undershirt: 25 },
    { Top: 76, Torso: 12, Undershirt: 25 },
    { Top: 70, Torso: 12, Undershirt: 25 },
    { Top: 69, Torso: 12, Undershirt: 25 },
    { Top: 64, Torso: 12, Undershirt: 25 },
    { Top: 27, Torso: 12, Undershirt: 25 },
    { Top: 76, Torso: 12, Undershirt: 27 },
    { Top: 119, Torso: 12, Undershirt: 27 },
    { Top: 167, Torso: 12, Undershirt: 27 }],
    [{ Top: 2, Torso: 2, Undershirt: 9 },
    { Top: 7, Torso: 5, Undershirt: 39 },
    { Top: 9, Torso: 0, Undershirt: 34 },
    { Top: 13, Torso: 15, Undershirt: 152 },
    { Top: 14, Torso: 14, Undershirt: 34 },
    { Top: 15, Torso: 15, Undershirt: 34 },
    { Top: 16, Torso: 15, Undershirt: 34 },
    { Top: 17, Torso: 15, Undershirt: 34 },
    { Top: 19, Torso: 15, Undershirt: 34 },
    { Top: 20, Torso: 5, Undershirt: 64 },
    { Top: 21, Torso: 11, Undershirt: 34 },
    { Top: 25, Torso: 5, Undershirt: 39 },
    { Top: 26, Torso: 15, Undershirt: 34 },
    { Top: 32, Torso: 4, Undershirt: 34 },
    { Top: 35, Torso: 5, Undershirt: 21 },
    { Top: 36, Torso: 4, Undershirt: 34 },
    { Top: 37, Torso: 15, Undershirt: 34 },
    { Top: 44, Torso: 3, Undershirt: 34 },
    { Top: 50, Torso: 14, Undershirt: 34 },
    { Top: 51, Torso: 14, Undershirt: 41 },
    { Top: 52, Torso: 14, Undershirt: 39 },
    { Top: 55, Torso: 9, Undershirt: 34 },
    { Top: 56, Torso: 14, Undershirt: 34 },
    { Top: 59, Torso: 2, Undershirt: 34 },
    { Top: 63, Torso: 5, Undershirt: 34 },
    { Top: 64, Torso: 5, Undershirt: 40 },
    { Top: 65, Torso: 6, Undershirt: 34 },
    { Top: 66, Torso: 6, Undershirt: 34 },
    { Top: 68, Torso: 14, Undershirt: 34 },
    { Top: 70, Torso: 9, Undershirt: 34 },
    { Top: 71, Torso: 9, Undershirt: 34 },
    { Top: 72, Torso: 9, Undershirt: 34 },
    { Top: 76, Torso: 9, Undershirt: 34 },
    { Top: 77, Torso: 9, Undershirt: 34 },
    { Top: 83, Torso: 1, Undershirt: 34 },
    { Top: 94, Torso: 14, Undershirt: 38 },
    { Top: 96, Torso: 14, Undershirt: 34 },
    { Top: 99, Torso: 5, Undershirt: 37 },
    { Top: 102, Torso: 3, Undershirt: 34 },
    { Top: 109, Torso: 7, Undershirt: 34 },
    { Top: 112, Torso: 15, Undershirt: 34 },
    { Top: 125, Torso: 14, Undershirt: 1 },
    { Top: 132, Torso: 9, Undershirt: 34 },
    { Top: 135, Torso: 3, Undershirt: 34 },
    { Top: 148, Torso: 5, Undershirt: 51 },
    { Top: 154, Torso: 12, Undershirt: 29 },
    { Top: 163, Torso: 12, Undershirt: 20 },
    { Top: 164, Torso: 12, Undershirt: 52 },
    { Top: 165, Torso: 9, Undershirt: 51 },
    { Top: 166, Torso: 9, Undershirt: 57 },
    { Top: 167, Torso: 11, Undershirt: 72 },
    { Top: 168, Torso: 15, Undershirt: 34 },
    { Top: 169, Torso: 15, Undershirt: 34 },
    { Top: 170, Torso: 15, Undershirt: 34 },
    { Top: 171, Torso: 15, Undershirt: 34 },
    { Top: 172, Torso: 14, Undershirt: 34 },
    { Top: 173, Torso: 15, Undershirt: 34 },
    { Top: 185, Torso: 9, Undershirt: 38 },
    { Top: 186, Torso: 9, Undershirt: 34 },
    { Top: 189, Torso: 7, Undershirt: 34 },
    { Top: 192, Torso: 9, Undershirt: 34 },
    { Top: 193, Torso: 9, Undershirt: 108 },
    { Top: 194, Torso: 7, Undershirt: 39 },
    { Top: 195, Torso: 14, Undershirt: 34 },
    { Top: 196, Torso: 14, Undershirt: 34 },
    { Top: 198, Torso: 14, Undershirt: 34 },
    { Top: 201, Torso: 14, Undershirt: 34 },
    { Top: 202, Torso: 14, Undershirt: 34 },
    { Top: 203, Torso: 13, Undershirt: 34 },
    { Top: 208, Torso: 11, Undershirt: 34 },
    { Top: 240, Torso: 14, Undershirt: 39 },
    { Top: 248, Torso: 5, Undershirt: 34 },
    { Top: 262, Torso: 14, Undershirt: 34 },
    { Top: 264, Torso: 14, Undershirt: 34 }]
  ],
  hats: [
    [8, 2, 4, 12, 13, 14, 15, 20 ,21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ,32, 37, 40, 41, 42, 43, 44, 45, 54, 55 ,56, 65 ,66, 76, 77, 83],
    [57, 4, 5, 9, 13, 14, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 36, 41, 42, 43, 44, 56, 65, 82, 97, 98, 99]
  ],
  glasses: [
    [0, 2, 3, 4 ,5, 7, 8, 9, 10, 12, 13, 15, 16, 17, 18, 19, 20, 23],
    [15, 0, 1, 2, 3, 4, 6, 7, 8, 11, 16, 17, 18, 19 , 20, 21, 24, 25]
  ],
  fathers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44],
  mothers: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45],
  masks: [0, 32, 35, 37, 51, 52,53 ,54 ,57, 58, 1, 2, 3, 4, 5, 11, 12, 14, 15, 16, 17, 18 ,19, 20, 21, 22, 23, 24, 26],
  freemodeSkins: [mp.game.joaat("mp_m_freemode_01"), mp.game.joaat("mp_f_freemode_01")]
}