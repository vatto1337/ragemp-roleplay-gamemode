<template>
    <div v-if="activeModal == 4 || activeModal == 16">
       <div class="basic-modal dealership" v-if="activeModal == 4">
        <div class="card">
          <div class="card-header card-header-gta d-flex align-items-center">
            <div class="modal-title m-0 mr-auto">Dealership</div>
            <div v-on:click="disableModals" class="cancel-button">
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="card-body">
            <div class="car-info">
              <div class="data">
                <div class="title">
                  {{modalData.vehicles[modalData.selected].model}}
                  <i v-if="modalData.vehicles[modalData.selected].goldOnly == true" class="fas fa-star ml-1 text-warning"></i>
                </div>
                <div v-if="modalData.vehicles[modalData.selected].goldPrice == 0" class="price">{{formatMoney(modalData.vehicles[modalData.selected].price, 0)}}$</div>
                <div v-else class="price text-warning">{{formatMoney(modalData.vehicles[modalData.selected].goldPrice, 0)}} Gold</div>
                <div class="stock">{{modalData.vehicles[modalData.selected].stock}} in stock left.</div>
                <div class="d-flex py-1">
                  <swatches
                    class="swatch"
                    colors="text-advanced"
                    v-model="modalData.color.color1"
                    @input="updateDealershipModel"
                  />
                  <swatches
                    class="swatch ml-1"
                    colors="text-advanced"
                    v-model="modalData.color.color2"
                    @input="updateDealershipModel"
                  />
                </div>
              </div>
              <div class="d-flex align-items-center">
                <button @click="modalData.selected --, updateDealershipModel()" :disabled="modalData.selected == 0" class="btn btn-primary"><i class="fas fa-chevron-left"></i></button>
                <input @input="updateDealershipModel" v-model="modalData.selected" type="range" min="0" :max="modalData.vehicles.length - 1" class="ml-2 mr-2" />
                <button @click="modalData.selected ++, updateDealershipModel()" :disabled="modalData.selected == modalData.vehicles.length - 1" class="btn btn-primary"><i class="fas fa-chevron-right"></i></button>
              </div>
              <div class="d-flex align-items-center justify-content-center py-1 pt-3">
                <button @click="buyVehicle" class="btn btn-primary">Purchase vehicle</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="basic-modal edit-dealership" v-if="activeModal == 16">
        <div class="card">
          <div class="card-header d-flex align-items-center">
            <div class="modal-title m-0 mr-auto">Edit Dealership</div>
            <div v-on:click="disableModals" class="cancel-button">
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="card-body">
            <div class="bizz-container">
              <div class="scrollable">
                <div v-for="(vehicle, index) in modalData.data.vehicles" :key="index" class="entry">
                  <div class="form-group w-100 d-flex m-0 mb-1">
                    <div class="input-group-prepend"><div class="input-group-text small">Model</div></div>
                    <input type="text" v-model="vehicle.model" class="form-control mr-1" />
                    <div class="input-group-prepend"><div class="input-group-text">Price</div></div>
                    <input type="number" v-tooltip="formatMoney(vehicle.price, 0) + '$'" v-model="vehicle.price" class="form-control mr-1" />
                    <div class="input-group-prepend"><div class="input-group-text">Stock</div></div>
                    <input type="number" v-model="vehicle.stock" class="form-control" />
                    <div class="input-group-prepend"><div class="input-group-text">Gold</div></div>
                    <input type="number" v-tooltip="formatMoney(vehicle.goldPrice, 0) + ' Gold'" v-model="vehicle.goldPrice" class="form-control" />
                    <button @click="vehicle.goldOnly = !vehicle.goldOnly" class="btn btn-primary small ml-1 mr-1">
                      <i v-if="vehicle.goldOnly == false" class="far fa-star"></i>
                      <i v-if="vehicle.goldOnly == true" class="fas fa-star"></i>
                    </button>
                    <button @click="deleteVehicle(index)" class="btn btn-primary small">Delete</button>
                  </div>
                </div>
              </div>
              <button @click="saveDealership" class="btn btn-primary">Save Modifications</button>
              <button @click="addNewVehicle" class="btn btn-primary ml-2">Add new vehicle in dealership</button>
              <button @click="resetallStock" class="btn btn-primary ml-2">Reset all stock</button>
              <button @click="modalData.data.status = !modalData.data.status" class="btn btn-primary ml-2">Dealership State: {{modalData.data.status == true ? 'Opened' : 'Closed'}}</button>
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
  name: "Dealership",
  components: { Swatches },
  computed: {
    modalData() {
      return this.$store.state.others.modalData;
    },
    activeModal() {
      return this.$store.state.others.activeModal;
    }
  },
  mounted: function() {
    if (this.activeModal == 16) {
      $(".entry").tooltip({ boundary: "window" });
    }
  },
  methods: {
    buyVehicle: function() {
      let object = {
        color: this.modalData.color,
        index: this.modalData.selected
      }
      console.log(object);
      mp.trigger("buyVehicleFromDealership", JSON.stringify(object));
    },
    updateDealershipModel: function() {

      let object = {
        color: this.modalData.color,
        model: this.modalData.vehicles[this.modalData.selected].model
      }
      mp.trigger("changeDealershipModel", JSON.stringify(object));
    },
    deleteVehicle: function(index) {
      this.modalData.data.vehicles.splice(index, 1);
    },
    saveDealership: function() {
      mp.trigger("saveDealership", JSON.stringify(this.modalData.data));
    },
    addNewVehicle: function() {
      this.modalData.data.vehicles.push({
        price: 1000,
        stock: 100,
        model: 'faggio',
        goldOnly: false,
        goldPrice: 0
      })
    },
    resetallStock: function() {
      this.modalData.data.vehicles.forEach((veh, index) => {
        veh.stock = 100;
      });
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
    disableModals: function () {
      if(this.activeModal == 4) {
        mp.trigger("leaveDealership");
      }
      appData.commit("others/disableModals");
    }
  }
};
</script>