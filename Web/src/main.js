import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores/index.js';
import VTooltip from 'v-tooltip';

Vue.config.productionTip = false;

Vue.use(VTooltip);

global.gui = { chat: null, hud: null, notify: null, modals: [] }

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');



global.app = app;
global.appData = app.$store;
global.router = app.$router;
