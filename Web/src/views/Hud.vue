<template>
  <div class="gui-screen">
    <Chat ref="chat" />
    <notify ref="notify" />
    <Hud ref="hud" />
    <Modals />
  </div>
</template>

<script>

import notify from '@/components/notify.vue' 
import Modals from '@/components/modals.vue' 
import Hud from '@/components/hud.vue' 
import Chat from '@/components/chat.vue' 
 
export default {
  name: "gui",
  components: {
    notify,
    Modals,
    Hud,
    Chat
  },
  mounted: function() {    
    gui.notify = this.$refs.notify;
    // gui.modals = this.$refs.modals;
    gui.hud = this.$refs.hud;
    gui.chat = this.$refs.chat;
  }
};
</script>