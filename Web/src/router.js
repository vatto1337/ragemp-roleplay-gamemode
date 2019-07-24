import Vue from 'vue'
import Router from 'vue-router'
import Hud from './views/Hud.vue';
import Home from './views/Home.vue';
import Auth from './views/Auth.vue';

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/auth', name: 'Auth', component: Auth },
    { path: '/hud', name: 'gui', component: Hud } 
  ]
})
