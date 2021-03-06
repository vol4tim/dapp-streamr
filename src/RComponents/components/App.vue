<template>
  <web3-check>
    <template v-slot:error="props">
      <RErrorDepNetwork v-if="props.error.type === 'network'" />
      <RErrorNotAccounts
        @requestAccount="requestAccount"
        v-else-if="props.error.type === 'account'"
      />
      <RErrorNotWeb3 v-else />
    </template>
    <template slot="load">
      <ROverlayLoader />
    </template>
    <template>
      <slot v-if="isReadyRobonomics" />
      <ROverlayLoader v-else />
    </template>
  </web3-check>
</template>

<script>
import Vue from "vue";
import Web3Check from "vue-web3-check";
import { init as initRobonomics } from "../tools/robonomics";
import { init as initIpfs } from "../tools/ipfs";
import getConfig from "../config";

export default {
  data() {
    return {
      isReadyRobonomics: false
    };
  },
  mounted() {
    Web3Check.store.on("load", async state => {
      const config = getConfig();
      Vue.prototype.$ipfs = await initIpfs(config.ipfs);
      Vue.prototype.$robonomics = initRobonomics(
        {
          ens: {
            address: config.robonomics.chain(state.networkId).ens,
            suffix: config.robonomics.chain(state.networkId).ensSuffix,
            version: config.robonomics.version
          },
          lighthouse: config.robonomics.chain(state.networkId).lighthouse
        },
        state.web3,
        this.$ipfs
      );
      await this.$robonomics.ready();
      this.isReadyRobonomics = true;
    });
  },
  methods: {
    requestAccount() {
      Web3Check.access();
    }
  }
};
</script>
