<template>
  <a :href="href" target="_blank" :class="classStyle" :title="text">
    <img v-if="type === 'chain'" :src="icon()" class="avatar-small align-vertical m-r-10" alt />
    <b>{{ label }}</b>
  </a>
</template>

<script>
import makeBlockie from "ethereum-blockies-base64";
import * as filters from "../tools/filters";

export default {
  props: {
    type: {
      type: String,
      default: "chain",
      validator: val => ["chain", "ipfs"].includes(val)
    },
    chainid: {
      type: Number,
      default: 1
    },
    text: {
      type: String
    },
    category: {
      type: String,
      default: ""
    },
    classStyle: {
      type: String,
      default: "align-vertical m-r-10"
    },
    isSlice: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    href: function() {
      return this.type === "chain"
        ? filters.urlExplorer(this.text, this.category, this.chainid)
        : filters.urlIpfs(this.text, this.category);
    },
    label: function() {
      return this.isSlice
        ? this.text.slice(0, 6) + "..." + this.text.slice(-4)
        : this.text;
    }
  },
  methods: {
    icon() {
      return this.text ? makeBlockie(this.text) : "";
    }
  }
};
</script>
