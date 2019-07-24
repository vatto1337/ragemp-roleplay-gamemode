<template>
  <div class="basic-modal customs" v-if="activeModal == 7">
    <div class="card">
      <div class="card-header card-header-gta d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">Vehicle Customs</div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="customs-container">
          <div v-if="modalData.page == 0">
            <div @click="repairVehicle" class="entry">
              <div class="fields">
                <div class="text">Repair vehicle</div>
                <div class="price">500$</div>
              </div>
            </div>
            <div @click="modalData.page = 1, setRotation(1)" class="entry">
              <div class="fields">
                <div class="text">Paint this vehicle</div>
                <div class="price">
                  <i class="fas fa-palette"></i>
                </div>
              </div>
            </div>
            <div @click="modalData.page = 2, setRotation(2)" class="entry">
              <div class="fields">
                <div class="text">Change vehicle plate</div>
                <div class="price">
                  <i class="fas fa-pen-square"></i>
                </div>
              </div>
            </div>
            <hr>
            <div class="scrollable">
              <div v-for="(mod, index) in modalData.mods" :key="index" class="entry">
                <div class="fields">
                  <div class="text">
                    <div>
                      {{mod.title}} -
                      {{ mod.selected == -1 ? 'Standard' : `${mod.upgradeTitle} ${(mod.selected + 1)}` }}
                    </div>
                    <div class="mt-1">
                      <button
                        @click="mod.selected --, setRotation(mod.camera), applyMod(mod.id, mod.selected, false)"
                        :disabled="mod.selected == -1"
                        class="btn btn-primary"
                      >
                        <i class="fas fa-angle-left"></i>
                      </button>
                      <button
                        @click="mod.selected ++, setRotation(mod.camera), applyMod(mod.id, mod.selected, false)"
                        :disabled="mod.selected == mod.max"
                        class="btn btn-primary ml-2"
                      >
                        <i class="fas fa-angle-right"></i>
                      </button>
                      <button
                        @click="buyMod(mod.id, mod.selected, mod.selected == -1 ? 0 : (mod.increasePrice == true ? (mod.selected == -1 ? mod.price : mod.price * (mod.selected + 1)) : mod.price), mod.title)"
                        :disabled="mod.currentMod == mod.selected"
                        :class="mod.currentMod == mod.selected ? 'btn btn-secondary ml-2' : 'btn btn-primary ml-2'"
                      >{{ mod.currentMod == mod.selected ? 'Current' : 'Purchase'}}</button>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div
                      v-if="mod.selected != -1"
                      class="price"
                    >{{formatMoney(mod.increasePrice == true ? (mod.selected == -1 ? mod.price : mod.price * (mod.selected + 1)) : mod.price, 0)}}$</div>
                    <div v-if="mod.selected == -1" class="price">Stock</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="modalData.page == 1">
            <div @click="buyPaint" class="entry">
              <div class="fields">
                <div class="text">Buy this paint</div>
                <div class="price">300$</div>
              </div>
            </div>
            <div class="entry">
              <div class="fields">
                <div class="text">Primary color</div>
                <div class="price">
                  <swatches
                    class="mt-3 swatch"
                    colors="text-advanced"
                    v-model="modalData.color.color1"
                  />
                </div>
              </div>
            </div>
            <div class="entry">
              <div class="fields">
                <div class="text">Second color</div>
                <div class="price">
                  <swatches
                    class="mt-3 swatch"
                    colors="text-advanced"
                    v-model="modalData.color.color2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-if="modalData.page == 2">
            <div @click="buyPlate" class="entry">
              <div class="fields">
                <div class="text">Buy this plate</div>
                <div class="price">100$</div>
              </div>
            </div>
            <div class="entry">
              <div class="fields">
                <div class="text">Plate text</div>
                <div class="price">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      maxlength="8"
                      v-model="modalData.plate"
                      :placeholder="modalData.plate || 'Write your plate here'"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="modalData.page != 0" class="customs-container">
          <div @click="modalData.page = 0, setRotation(1)" class="entry">
            <div class="fields">
              <div class="text">Go back</div>
              <div class="price text-white">
                <i class="fas fa-arrow-left"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.min.css";

export default {
  name: "Customs",
  components: { Swatches },
  data: function() {
    return {
      color: "#fff"
    };
  },
  computed: {
    modalData() {
      return this.$store.state.others.modalData;
    },
    activeModal() {
      return this.$store.state.others.activeModal;
    }
  },
  methods: {
    formatMoney: function(n, c, d, t) {
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
    disableModals: function() {
      mp.trigger("comeBackFromCustom");
      this.modalData.mods.forEach(mod => {
        this.applyMod(mod.id, mod.currentMod, true);
      });
      appData.commit("others/disableModals");
    },
    currentMod: function(type, index) {
      this.modalData.mods.forEach(mod => {
        if (mod.id == type) {
          mod.currentMod = index;
        }
      });
    },
    applyMod: function(type, index, toggle) {
      mp.trigger("custom_applyVehicleMod", type, index, toggle);
    },
    buyPlate: function() {
      mp.trigger("custom_buyVehiclePlate", this.modalData.plate);
    },
    buyMod: function(type, index, cash, title) {
      mp.trigger("custom_buyVehicleMod", type, index, cash, title);
    },
    buyPaint: function() {
      mp.trigger(
        "custom_setVehiclePaint",
        this.modalData.color.color1,
        this.modalData.color.color2
      );
    },
    repairVehicle: function() {
      mp.trigger("custom_fixVehicle");
    },
    setRotation: function(type) {
      mp.trigger("custom_setRotation", type);
    }
  }
};
</script>

