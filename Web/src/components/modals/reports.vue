<template>
  <div class="basic-modal" v-if="activeModal == 1 || activeModal == 2 || activeModal == 3">
    <div v-if="activeModal == 1" class="card">
      <div class="card-header d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">Submit report</div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div v-if="alert.type != null" class="alert" v-bind:class="'alert-' + alert.type" role="alert">
          {{ alert.message}}</div>
        <form>
          <div class="form-group">
            <label>Title:</label>
            <input type="text" class="form-control" id="title" placeholder="Report title" maxlength="40" required>
          </div>
          <div class="form-group">
            <label>Message:</label>
            <textarea class="form-control" id="message" placeholder="Write the problem you're facing here."
              rows="3"></textarea>
          </div>
          <button @click="submitMyReport" type="submit" class="btn btn-primary">Submit my report</button>
        </form>
      </div>
    </div>
    <div v-if="activeModal == 2" class="card">
      <div class="card-header d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">{{ modalData.list ? modalData.list.length : '0' }} Reports in total</div>
        <div @click="reloadReports" class="mr-3 cancel-button">
          <i class="fas fa-sync-alt"></i>
        </div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div v-if="modalData.list && modalData.list.length > 0" class="reports-container">
        <div v-for="(report, index) in modalData.list" v-bind:key="index" @click="readReport(report.id)" class="entry">
          <div class="d-flex align-items-center">
            <div class="d-flex">
              <b class="d-block m-0 time">{{report.time}}</b>
              <p class="m-0 title">{{ report.title }}</p>
            </div>
            <p class="m-0 ml-auto">- {{ report.name }} ({{ report.id }})</p>
          </div>
        </div>
      </div>
      <div v-else class="py-5 text-center">
        <p>No reports.</p>
      </div>
    </div>
    <div v-if="activeModal == 3" class="card">
      <div class="card-header d-flex">
        <div class="modal-title m-0 mr-auto">Report sent by: {{modalData.name}} ({{modalData.id}})</div>
        <div @click="deleteReport(modalData.id)" class="cancel-button mr-2">
          <i class="fas fa-trash-alt"></i>
        </div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div v-if="alert.type != null" class="alert" v-bind:class="'alert-' + alert.type" role="alert">
          {{ alert.message}}</div>
        <div class="d-flex mb-3">
          <div>{{modalData.title}}</div>
          <div class="ml-auto small">{{modalData.time}}</div>
        </div>
        <div class="text-container">
          <p>{{modalData.message}}</p>
        </div>
        <hr>
        <div class="form-group">
          <textarea class="form-control mt-2" id="message" placeholder="Write your answer here." rows="3"></textarea>

          <div class="form-group d-flex mt-2">
            <input type="text" class="form-control rounded-0" id="title" v-model="modalData.command"
              placeholder="Use commands here" maxlength="40">
            <button class="btn btn-primary rounded-0" v-on:click="executeCommand">Execute</button>
          </div>
          <div class="d-flex align-items-center mt-3">
            <button @click="sendAnswer(modalData.id)" class="btn btn-primary">Send message</button>
            <button @click="reloadReports" class="btn btn-primary ml-auto">Back to reports list</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Reports",
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
        alert: {
          type: null,
          message: null
        }
      };
    },
    methods: {
      disableModals: function () {
        appData.commit('others/disableModals');
      },
      executeCommand: function () {
        let command = this.modalData.command.substr(1);
        this.modalData.command = "";
        mp.invoke("command", command);
      },
      submitMyReport: function (event) {
        event.preventDefault();

        var data = { title: $("#title").val(), message: $("#message").val() };

        if (data.title == "" || data.message == "") {
          return Swal({
            title: "Error!",
            text: "Please fill in the empty fields!",
            type: "error",
            confirmButtonText: "Ok"
          });
        } else if (this.submitExecuted == true) {
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
        setTimeout(() => {
          mp.trigger("submitMyReport", JSON.stringify(data));
          this.disableModals();
        }, 2000);
        this.alert = {
          message: "Your report was sent to all administrators online.",
          type: "success"
        };
      },
      readReport: function (name) {
        mp.trigger("readReport", name);
      },
      sendAnswer: function (to) {
        var data = { to: to, message: $("#message").val() };

        if (data.message == "") {
          return Swal({
            title: "Error!",
            text: "Please fill in the empty fields!",
            type: "error",
            confirmButtonText: "Ok"
          });
        } else if (this.submitExecuted == true) {
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
        setTimeout(() => {
          mp.trigger("sendReportAnswer", JSON.stringify(data));
          this.disableModals();
          this.reloadReports();
        }, 2000);
        this.alert = {
          message: "Your answer has been sent to this player.",
          type: "success"
        };
      },
      deleteReport: function (id) {
        mp.trigger("deleteReport", id);
        mp.trigger("requestReports");
      },
      reloadReports: function () {
        mp.trigger("requestReports");
      }
    },
    watch:  {
      activeModal: function(val) {
        if(this.activeModal == 1 || this.activeModal == 2 || this.activeModal == 3) {
          this.alert = {
            type: null,
            message: null
          }
        }
      }
    }
  };
</script>