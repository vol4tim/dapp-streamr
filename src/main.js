import Vue from 'vue';
import StreamrClient from 'streamr-client';
import App from './App.vue';
import router from './router';
import config from './config';
import './plugins';

Vue.config.productionTip = false;

Vue.prototype.$streamr = new StreamrClient({
  auth: {
    apiKey: config.STREAMR_KEY
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
