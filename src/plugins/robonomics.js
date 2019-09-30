import Vue from 'vue';
import RComponents, { filters } from '../RComponents';
import config from '../config';

Vue.filter('urlExplorer', filters.urlExplorer);
Vue.filter('fromWei', filters.fromWei);

Vue.use(RComponents, {
  ipfs: config.IPFS || null,
  robonomics: {
    version: 5,
    chain: networkId => config.chain(networkId).ROBONOMICS
  }
});
