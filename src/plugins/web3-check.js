import Vue from 'vue';
import Web3Check, { ACTIONS } from 'vue-web3-check';
import config from '../config';

Web3Check.store.on('update', data => {
  if (
    (data.state.old.account !== null && data.action === ACTIONS.UPD_ACCOUNT) ||
    (data.state.old.networkId !== null &&
      data.action === ACTIONS.UPD_NETWORK_ID)
  ) {
    window.location.reload(false);
  }
});
Vue.use(Web3Check, {
  Web3: Web3,
  networks: config.CHAINS,
  requireAccount: true
});
