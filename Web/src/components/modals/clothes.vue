<template>
  <div class="basic-modal clothes" v-if="activeModal == 13">
    <div class="content">
      <div class="header">
        <h1 v-if="usingMethod == 'register'">Character creation</h1>
        <h1 v-if="usingMethod == 'clothes'">Clothes Shop</h1>
        <h1 v-if="usingMethod == 'barber'">Barber Shop</h1>
      </div>
      <div class="scrollable">
        <div v-if="usingMethod == 'register'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Gender</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="sex = 0, tops = 0, pants = 0, shoes = 0, hat = 0, updatePed()" :disabled="sex == 0"
              class="btn btn-primary mr-1">Male</button>
            <button @click="sex = 1, tops = 0, pants = 0, shoes = 0, hat = 0, updatePed()" :disabled="sex == 1"
              class="btn btn-primary">Female</button>
          </div>
        </div>
        <div v-if="usingMethod == 'register'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Parents</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="father --, updatePed()" :disabled="father == 0" class="btn btn-primary mr-1">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="father ++, updatePed()" :disabled="father == 23" class="btn btn-primary mr-1">
              <i class="fas fa-chevron-right"></i>
            </button>
            <button @click="mother --, updatePed()" :disabled="mother == 0" class="btn btn-primary ml-2 mr-1">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="mother ++, updatePed()" :disabled="mother == 21" class="btn btn-primary mr-1">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'register'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Skin tone - {{skinTone}}%</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="skinTone --, updatePed()" :disabled="skinTone == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="100" v-model="skinTone">
            <button @click="skinTone ++, updatePed()" :disabled="skinTone == 100" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'register'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Resemblance - {{resemblance}}%</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="resemblance --, updatePed()" :disabled="resemblance == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="100" v-model="resemblance">
            <button @click="resemblance ++, updatePed()" :disabled="resemblance == 100" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <hr v-if="usingMethod == 'register'" />
        <div v-if="usingMethod == 'register' || usingMethod == 'barber'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Hair</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="hair --, updatePed()" :disabled="hair == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="73" v-model="hair">
            <button @click="hair ++, updatePed()" :disabled="hair == 73" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'register' || usingMethod == 'barber'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Color 1 - {{hairColor1}}</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="hairColor1 --, updatePed()" :disabled="hairColor1 == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="200" v-model="hairColor1">
            <button @click="hairColor1 ++, updatePed()" :disabled="hairColor1 == 200" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'register' || usingMethod == 'barber'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Color 2 - {{hairColor2}}</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="hairColor2 --, updatePed()" :disabled="hairColor2 == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="200" v-model="hairColor2">
            <button @click="hairColor2 ++, updatePed()" :disabled="hairColor2 == 200" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <hr  v-if="usingMethod == 'register' || usingMethod == 'barber'">
        <div v-if="usingMethod == 'register' || usingMethod == 'barber'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Facial Hair</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="facialHair --, updatePed()" :disabled="facialHair == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="27" v-model="facialHair">
            <button @click="facialHair ++, updatePed()" :disabled="facialHair == 27" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'register' || usingMethod == 'barber'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Color - {{facialHairColor}}</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="facialHairColor --, updatePed()" :disabled="facialHairColor == 0"
              class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="200" v-model="facialHairColor">
            <button @click="facialHairColor ++, updatePed()" :disabled="facialHairColor == 200"
              class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <hr v-if="usingMethod == 'register' || usingMethod == 'barber'">
        <div v-if="usingMethod == 'register' || usingMethod == 'barber'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Eyebrows</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="eyebrows --, updatePed()" :disabled="eyebrows == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="32" v-model="eyebrows">
            <button @click="eyebrows ++, updatePed()" :disabled="eyebrows == 32" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'register' || usingMethod == 'barber'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Eyes color</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="eyes --, updatePed()" :disabled="eyes == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" :max="usingMethod == 'barber' ? 32 : 10" v-model="eyes">
            <button @click="eyes ++, updatePed()" :disabled="eyes == (usingMethod == 'barber' ? 32 : 10)"
              class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'register' || usingMethod == 'barber'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Ageing effect</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="ageing --, updatePed()" :disabled="ageing == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="13" v-model="ageing">
            <button @click="ageing ++, updatePed()" :disabled="ageing == 13" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <hr v-if="usingMethod == 'barber'">
        <div v-if="usingMethod == 'clothes'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Tops</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="tops --, updatePed()" :disabled="tops == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0"
              :max="sex == 0 ? usingMethod == 'clothes' ? 51 : 52 / 2 : usingMethod == 'clothes' ? 72 : 72 / 2"
              v-model="tops">
            <button @click="tops ++, updatePed()"
              :disabled="tops == (sex == 0 ? usingMethod == 'clothes' ? 51 : 52 / 2 : usingMethod == 'clothes' ? 72 : 72 / 2)"
              class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'clothes'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Pants</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="pants --, updatePed()" :disabled="pants == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0"
              :max="sex == 0 ? usingMethod == 'clothes' ? 43 : 43 / 2 : usingMethod == 'clothes' ? 46 : 46 / 2"
              v-model="pants">
            <button @click="pants ++, updatePed()"
              :disabled="pants == (sex == 0 ? usingMethod == 'clothes' ? 43 : 43 / 2 : usingMethod == 'clothes' ? 46 : 46 / 2)"
              class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'clothes'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Shoes</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="shoes --, updatePed()" :disabled="shoes== 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0"
              :max="sex == 0 ? usingMethod == 'clothes' ? 48 : 48 / 2 : usingMethod == 'clothes' ? 42 : 42 / 2"
              v-model="shoes">
            <button @click="shoes ++, updatePed()"
              :disabled="shoes == (sex == 0 ? usingMethod == 'clothes' ? 48 : 48 / 2 : usingMethod == 'clothes' ? 42 : 42 / 2)"
              class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <hr v-if="usingMethod == 'clothes'">
        <div v-if="usingMethod == 'clothes'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Hat</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="hat --, updatePed()" :disabled="hat == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" :max="sex == 0 ? 34 : 7" v-model="hat">
            <button @click="hat ++, updatePed()" :disabled="hat == (sex == 0 ? 34 : 7)" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'clothes'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Mask</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="mask --, updatePed()" :disabled="mask == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="28" v-model="mask">
            <button @click="mask ++, updatePed()" :disabled="mask == 28" class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'clothes'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Glasses</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="glasses --, updatePed()" :disabled="glasses == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" max="17"
              v-model="glasses">
            <button @click="glasses ++, updatePed()" :disabled="glasses == 17"
              class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div v-if="usingMethod == 'barber'" class="d-flex mb-1">
          <div class="d-flex align-items-center mr-auto">
            <p>Makeup</p>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <button @click="makeup --, updatePed()" :disabled="makeup == 0" class="btn btn-primary mr-2">
              <i class="fas fa-chevron-left"></i>
            </button>
            <input @input="updatePed" type="range" min="0" :max="usingMethod == 'register' ? 10 : 74" v-model="makeup">
            <button @click="makeup ++, updatePed()" :disabled="makeup == (usingMethod == 'register' ? 10 : 74)"
              class="btn btn-primary ml-2">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="d-flex mb-1 justify-content-center">
        <div class="d-flex justify-content-center align-items-center mb-3">
          <i @click="rotation = 210, updateRotation()" class="fas fa-sync-alt mr-2 text-white"></i>
          <input @input="updateRotation" type="range" min="0" max="360" v-model="rotation">
          <input @input="updateFov" class="ml-2" type="range" min="12" max="120" v-model="fov">
          <i class="fas fa-search ml-2 text-white"></i>
        </div>
      </div>
      <div v-if="usingMethod != 'register' && finalPrice > 0" class="py-2 text-center">
        <p class="h4 font-weight-bold price">Total cost: {{formatMoney(finalPrice, 0)}}$</p>
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <button @click="saveCharacter"
          class="btn btn-primary mt-2 mr-2">{{usingMethod == 'register' == true ? 'Proceed' : 'Purchase' }}</button>
        <button v-if="usingMethod != 'register'" @click="exitCharacter" class="btn btn-primary mt-2">Cancel
          purchase</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Clothes",
    computed: {
      modalData() {
        return this.$store.state.others.modalData;
      },
      activeModal() {
        return this.$store.state.others.activeModal;
      }
    },
    data: function () {
      return {
        usingMethod: 'register',
        clothes: null,
        finalPrice: 0,
        hat: 0,
        glasses: 0,
        sex: 0,
        father: 0,
        mother: 0,
        resemblance: 50,
        skinTone: 50,
        facialHair: 0,
        facialHairColor: 0,
        eyebrows: 1,
        ageing: 0,
        makeup: 0,
        lipstick: 0,
        lipstickColor: 0,
        hair: 1,
        hairColor1: 0,
        hairColor2: 0,
        tops: 1,
        pants: 1,
        shoes: 0,
        submitExecuted: false,
        fov: 50,
        rotation: 220,
        eyes: 0,
        mask: 0,
        owned: null
      };
    },
    mounted: function () {
      if (this.activeModal == 13) {
        this.updateFov();
        this.updatePed();
      }
    },
    methods: {
      setClothes: function (data) {
        let clothes = JSON.parse(data);
        this.owned = clothes;
        this.father = clothes.father;
        this.mother = clothes.mother;
        this.resemblance = clothes.resemblance;
        this.skinTone = clothes.skinTone;
        this.model = clothes.model;
        this.facialHair = clothes.facial;
        this.facialHairColor = clothes.facialColor;
        this.eyebrows = clothes.eyebrows;
        this.ageing = clothes.ageing;
        this.makeup = clothes.makeup;
        this.lipstick = clothes.lipstick;
        this.lipstickColor = clothes.lipstickColor;
        this.hair = clothes.hair;
        this.hairColor1 = clothes.hairColor1;
        this.hairColor2 = clothes.hairColor2;
        this.tops = clothes.tops;
        this.pants = clothes.pants;
        this.shoes = clothes.shoes;
        this.gender = clothes.gender;
        this.eyes = clothes.eyes;
        this.mask = clothes.mask;
        this.hat = clothes.hat;
        this.glasses = clothes.glasses;
        this.updatePed();
      },
      setUsingMethod: function (title) {
        this.usingMethod = title;
      },
      exitCharacter: function () {
        appData.commit("others/disableModals");
        mp.trigger("clothes_cancel");
      },
      formatMoney: function (n, c, d, t) {
        var c = isNaN((c = Math.abs(c))) ? 2 : c,
          d = d == undefined ? "." : d,
          t = t == undefined ? "," : t,
          s = n < 0 ? "-" : "",
          i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
          j = (j = i.length) > 3 ? j % 3 : 0;
        return (
          s +
          (j ? i.substr(0, j) + t : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
          (c
            ? d +
            Math.abs(n - i)
              .toFixed(c)
              .slice(2)
            : "")
        );
      },
      saveCharacter: function () {
        if (this.submitExecuted == true) {
          return Swal({
            title: "Error!",
            text: "Wait 5 seconds before submitting again!",
            type: "error",
            confirmButtonText: "Ok"
          });
        }
        this.submitExecuted = true;
        setTimeout(() => {
          this.submitExecuted = false;
        }, 5000);

        mp.trigger(
          "saveCharacterCreated",
          this.father,
          this.mother,
          parseInt(this.resemblance / 100),
          parseInt(this.skinTone / 100),
          this.sex,
          parseInt(this.facialHair),
          parseInt(this.facialHairColor),
          parseInt(this.eyebrows),
          parseInt(this.ageing),
          parseInt(this.makeup),
          parseInt(this.lipstick),
          parseInt(this.lipstickColor),
          parseInt(this.hair),
          parseInt(this.hairColor1),
          parseInt(this.hairColor2),
          parseInt(this.tops),
          parseInt(this.pants),
          parseInt(this.shoes),
          parseInt(this.hat),
          parseInt(this.glasses),
          parseInt(this.eyes),
          parseInt(this.mask),
          parseInt(this.finalPrice)
        );
      },
      updatePed: function () {
        mp.trigger(
          "updateClientRace",
          this.father,
          this.mother,
          this.resemblance / 100,
          this.skinTone / 100
        );
        mp.trigger(
          "updateClientCharacter",
          this.sex,
          parseInt(this.facialHair),
          parseInt(this.facialHairColor),
          parseInt(this.eyebrows),
          parseInt(this.ageing),
          parseInt(this.makeup),
          parseInt(this.lipstick),
          parseInt(this.lipstickColor),
          parseInt(this.hair),
          parseInt(this.hairColor1),
          parseInt(this.hairColor2),
          parseInt(this.tops),
          parseInt(this.pants),
          parseInt(this.shoes),
          parseInt(this.hat),
          parseInt(this.glasses),
          parseInt(this.eyes),
          parseInt(this.mask)
        );

        this.finalPrice = 0;

        if (this.owned) {
          if (this.tops != this.owned.tops && this.tops != 0) {
            this.finalPrice += 500;
          }
          if (this.shoes != this.owned.shoes && this.shoes != 0) {
            this.finalPrice += 250;
          }
          if (this.pants != this.owned.pants && this.pants != 0) {
            this.finalPrice += 300;
          }
          if (this.hat != this.owned.hat && this.hat != 0) {
            this.finalPrice += 50;
          }
          if (this.mask != this.owned.mask && this.mask != 0) {
            this.finalPrice += 350;
          }
          if (this.glasses != this.owned.glasses && this.glasses != 0) {
            this.finalPrice += 100;
          }
          if (this.makeup != this.owned.makeup && this.makeup != 0) {
            this.finalPrice += 800;
          }
          if (this.hair != this.owned.hair && this.hair != 0) {
            this.finalPrice += 100;
          }
          if (this.facialHair != this.owned.facial && this.facialHair != 0) {
            this.finalPrice += 50;
          }
        }

      },
      updateFov: function () {
        mp.trigger("changeCharacterFov", parseInt(this.fov));
      },
      updateRotation: function () {
        mp.trigger("changeCharacterRot", parseInt(this.rotation));
      }
    }

  };
</script>