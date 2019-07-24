<template>
  <div class="basic-modal" v-if="activeModal == 0">
    <div class="card">
      <div class="card-header card-header-gta card-header-gta-smaller d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">You've been banned</div>
      </div>
      <div class="card-body">
        <p>You have been banned on this server by
          <b class="text-danger">{{modalData.ban.bannedBy}}</b>.
        </p>
        <p>The reason was:
          <b class="text-danger">{{modalData.ban.reason}}</b>
        </p>
        <p>
          Your ban is still active for
          <b
            class="text-danger"
          >{{(modalData.ban.timeLeft / 24).toFixed(0)}}</b> days
          <b class="text-danger">({{modalData.ban.timeLeft}} minutes)</b>
        </p>
        <p>If you think this ban was unjust please check our forum for help.</p>
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
    disableModals: function() {
      appData.commit("others/disableModals");
    }
  }
};
</script>

