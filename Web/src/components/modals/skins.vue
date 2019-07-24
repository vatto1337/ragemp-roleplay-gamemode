<template>
  <div class="basic-modal justify-content-start ml-3" v-if="activeModal == 10">
    <div class="card">
      <div class="card-header card-header-gta card-header-gta-smaller">
        <div class="d-flex">
          <div class="modal-title m-0 mr-auto">Skins Store</div>
          <div v-on:click="disableModals" class="cancel-button">
            <i class="fas fa-times"></i>
          </div>
        </div>
        <p>Price: 300$</p>
      </div>
      <div class="card-body">
        <div class="bizz-container">
          <div class="entry mb-3">
            <div class="fields">
              <div class="text">
                <b class="mr-1">Current skin:</b>
                ({{modalData.selected}})
                {{ modalData.skins[modalData.selected] }}
              </div>
            </div>
          </div>
          <div class="entry mb-3">
            <div class="fields">
              <input
                class="range"
                v-model="modalData.selected"
                type="range"
                min="0"
                :max="modalData.skins.length - 1"
              >
            </div>
          </div>
          <button
            @click="modalData.selected --, setCurrentskin()"
            class="btn btn-primary mr-2"
            :disabled="modalData.selected == 0"
          >Previous skin</button>
          <button
            @click="modalData.selected ++, setCurrentskin()"
            class="btn btn-primary mr-2"
            :disabled="modalData.selected == modalData.skins.length - 1"
          >Next skin</button>
          <button @click="buySkin(modalData.selected)" class="btn btn-primary">Buy skin</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "skinsStore",
  computed: {
    modalData() {
      return this.$store.state.others.modalData;
    },
    activeModal() {
      return this.$store.state.others.activeModal;
    }
  },
  methods: {
    disableModals: function() {
      mp.trigger("clothes_exit", this.modalData.bizz);
      appData.commit("others/disableModals");
    },
    setCurrentskin: function() {
      mp.trigger(
        "clothes_applySkin",
        this.modalData.skins[this.modalData.selected]
      );
    },
    buySkin: function() {
      mp.trigger(
        "clothes_buySkin",
        this.modalData.skins[this.modalData.selected],
        this.modalData.bizz
      );
    }
  },
  watch: {
    "modalData.selected": function(val) {
      if(this.activeModal == 10 && this.modalData != null) {
        this.setCurrentskin();
      }
    }
  }
};
</script>

