<template>
  <div class="basic-modal gps" v-if="activeModal == 6">
    <div class="card">
      <div class="card-header d-flex">
        <div class="modal-title m-0 mr-auto">GPS Locations</div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="gps-locations">
          <div
            v-for="(gps, index) in modalData.locations"
            :key="index"
            :class="modalData.selected == index ? 'entry active' : 'entry'"
            @click="modalData.selected=index"
          >
            <div class="fields">{{gps.title}}</div>
          </div>
        </div>
        <div class="d-flex">
          <button
            @click="setGPS"
            class="btn btn-primary mr-auto"
            :disabled="modalData.selected == -1"
          >
            Set route
            for this location
          </button>
          <button class="btn btn-primary" @click="destroyGPS">Remove minimap icon</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GPS",
  computed: {
    modalData() {
      return this.$store.state.others.modalData;
    },
    activeModal() {
      return this.$store.state.others.activeModal;
    }
  },
  methods: {
    destroyGPS: function() {
      mp.trigger("destroyGPSBlip");
    },
    setGPS: function(id) {
      if (this.modalData.selected == -1)
        return Swal({
          title: "Error!",
          text: "Click a location first in order to set route for!",
          type: "error",
          confirmButtonText: "Ok"
        });

      let pos = this.modalData.locations[this.modalData.selected].position;
      let title = this.modalData.locations[this.modalData.selected].title;
      mp.trigger("createGPSBlip", pos.x, pos.y, pos.z, title);
      this.modalData.selected = -1;
    },
    disableModals: function() {
      appData.commit("others/disableModals");
    }
  }
};
</script>

