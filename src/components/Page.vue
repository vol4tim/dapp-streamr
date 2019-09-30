<template>
  <Layout>
    <h1>Streamr</h1>
    <div>
      Account:
      <RLinkExplorer v-if="account" :text="account" :chainid="1" />
    </div>

    <div>
      <b>
        <a :href="lighthouse.address | urlExplorer" target="_blank">{{lighthouse.name}}</a>
      </b> pubsub peers
      <b
        :style="{color: peers.length>0 ? 'green' : 'red'}"
        :title="peers.join('\n')"
      >{{peers.length}}</b>
    </div>
    <slot />
  </Layout>
</template>

<script>
import Layout from "./Layout";

export default {
  components: {
    Layout
  },
  data() {
    return {
      account: "",
      lighthouse: {
        name: "",
        address: ""
      },
      peers: [],
      nonce: 0
    };
  },
  mounted() {
    this.account = this.$robonomics.account.address;

    this.lighthouse = {
      name: this.$robonomics.lighthouse.name,
      address: this.$robonomics.lighthouse.address
    };

    const upPeers = () => {
      this.$ipfs.pubsub.peers(this.$robonomics.lighthouse.name, (e, r) => {
        this.peers = r;
      });
      setTimeout(() => {
        upPeers();
      }, 15000);
    };
    upPeers();
  }
};
</script>
