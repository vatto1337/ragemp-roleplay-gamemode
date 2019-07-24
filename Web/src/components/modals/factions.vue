<template>
  <div class="basic-modal modal-menu" v-if="activeModal == 19">
    <div class="card factions" v-if="activeModal == 19">
      <div class="card-header card-header-gta card-header-gta-smaller d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">Factions</div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="scrollable">
          <div v-for="(faction, index) in modalData.factions" :key=index class="entry d-flex align-items-center">
            <div class="text">
              <p class="m-0">{{faction}}</p>
              <p class="text-muted small m-0 mt-1">Lead by {{modalData.leaders[index]}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Factions",
  computed: {
    modalData() {
      return this.$store.state.others.modalData;
    },
    activeModal() {
      return this.$store.state.others.activeModal;
    }
  },
  methods: {
    getTimeFormat: function(time) {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let hour = date.getHours();
      let minutes = date.getMinutes();
      let message = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year} (${hour < 10 ? '0' + hour : hour }:${minutes < 10 ? '0' + minutes : minutes})`;
      return message;
    },
    updateMember: function(index) {
      let obj = {
        member: this.modalData.myFaction.members[this.modalData.selectedMember],
        warn_reason: $("#warn_reason").val() || "No Reason",
        index: this.modalData.selectedMember
      }
      mp.trigger("updateFactionMember", JSON.stringify(obj));
      this.modalData.initialMembers = this.modalData.myFaction.members;
    },
    disableModals: function() {
      appData.commit("others/disableModals");
    }
  }
};
</script>

