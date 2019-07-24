<template>
  <div class="basic-modal modal-menu" v-if="activeModal == 18">
    <div class="card">
      <div class="card-header card-header-gta card-header-gta-smaller d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">Jobs</div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="scrollable">
          <div @click="modalData.selected = index" :class="modalData.selected == index ? 'entry active' : 'entry'" v-for="(job, index) in modalData.jobsList" :key="index">
            {{job.title}}
          </div>
        </div>
        <button @click="selectJob(modalData.selected)" :disabled="modalData.selected == null" class="btn btn-block w-100 btn-primary">Get this job</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Banned",
  computed: {
    modalData() {
      return this.$store.state.others.modalData;
    },
    activeModal() {
      return this.$store.state.others.activeModal;
    }
  },
  methods: {
    selectJob: function(index) {
      mp.trigger('onJobSelected', index);
      this.disableModals();
    },
    disableModals: function() {
      appData.commit("others/disableModals");
    }
  }
};
</script>

