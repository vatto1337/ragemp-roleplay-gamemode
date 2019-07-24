<template>
  <div class="gui-chat">
    <div class="chatWindow">
      <div class="chatEntries" :style="`opacity: ${hudStatus > 0 ? '1' : '0'}`"></div>
      <div class="chatInputs form-group m-0">
        <input
          placeholder="Write your message and then press enter."
          v-model="chatText"
          id="text"
          type="text"
          class="form-control rounded-0"
          maxlength="200"
          @keyup.esc="closeChat"
          @keyup.up="chatText = lastMessage"
          @keyup.down="lastMessage(false)"
        >
        <div class="currentLength">{{chatText.length + '/200'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat",
  data: function() {
    return {
      search: "",
      timestamp: false,
      entries: [],
      toggle: false,
      lastMessage: '',
      chatText: "",
      spamActive: false
    };
  },
  computed: {
    hudStatus() {
      return this.$store.state.others.hudStatus;
    },
    activeModal() {
      return this.$store.state.others.activeModal;
    }
  },
  watch: {
    entries: function(val) {
      this.updateChat();
    }
  },
  methods: {
    closeChat: function() {
      mp.trigger("disableChatInput");
    },
    updateChat: function() {
      $(".chatEntries").empty();
      this.entries.forEach(entry => {
        $(".chatEntries").append(
          this.timestamp == false ? entry.text : entry.textTime
        );
      });
      $(".chatEntries").scrollTop(9999);
    },
    toggleTimestamp: function(toggle) {
      this.timestamp = toggle;
      this.updateChat();
    },
    push: function(text, color, clasa) {
      text = unescape(text);
      var date = new Date();
      var seconds = date.getSeconds();
      seconds = seconds < 10 ? "0" + seconds : seconds;
      var minutes = date.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var hour = date.getHours();
      hour = hour < 10 ? "0" + hour : hour;

      let object = {
        text: `<p class="${clasa == null ? "" : clasa}" style="${
          color == null ? "" : "color: " + color
        }">${text}</p>`,
        textTime: `<p class="${clasa == null ? "" : clasa}" style="${
          color == null ? "" : "color: " + color
        }">[${hour}:${minutes}:${seconds}] ${text}</p>`,
        time: {
          minutes: minutes,
          seconds: seconds
        }
      };
      this.entries.push(object);
    },
    clear: function() {
      this.entries = [];
    },
    hasEmoji: function(str) {
      var ranges = [
      '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
      '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
      '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
      ];
      if (str.match(ranges.join('|'))) {
          return true;
      } else {
          return false;
      }
    },
    toggleInput: function(toggle) {
      this.toggle = toggle;
      mp.invoke("focus", toggle);
      mp.trigger("setChatState", toggle);
      if (toggle == true) {
        $(".chatInputs").css("display", "flex");
        $(".chatWindow").addClass("active");
        $("#text").focus();
      } else {
        $(".chatInputs").fadeOut("fast", () => {
          $(".chatInputs").css("display", "none");
          $(".chatWindow").removeClass("active");
        });
      }
    },
    sendMessage: function() {
      if(this.spamActive == true) return false;
      this.spamActive = true; 
      setTimeout(() => { this.spamActive = false; }, 1500);
      this.toggleInput(false);
      let value = this.chatText;
      if (value && value.length > 0) {
        this.lastMessage = value;
        if (value[0] == "/" && !this.hasEmoji(value)) {
          value = value.substr(1);
          mp.invoke("command", value);
        } else {
          mp.invoke("chatMessage", value);
        }
      }


      this.chatText = "";
			// mp.trigger("disableChatInput");
    }
  },
  mounted: function() {
    let self = this;
    $("body").keydown(function(event) {
			if(event.which == 13 && self.toggle == true) {
				self.sendMessage();
      }
      if(event.which == 84) {
        if(self.hudStatus > 0 && self.activeModal == null) {
          self.toggleInput(true);
        }
      }
    });
  }
};
</script>