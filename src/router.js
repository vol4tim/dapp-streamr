import Vue from 'vue';
import Router from 'vue-router';
import Main from './views/Main';
import Liability from './views/Liability';

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/liability/:liability',
      name: 'liability',
      component: Liability,
      props: true
    }
  ]
});
