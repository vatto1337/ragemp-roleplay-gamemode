import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.js';
import others from './others.js';

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth: auth,
    others: others
  }
})

export default store;