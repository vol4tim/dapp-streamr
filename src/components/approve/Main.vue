<template>
  <fragment>
    <section>
      <Info
        v-if="cost > 0"
        style="margin-bottom:10px"
        :cost="cost"
        :balance="balance"
        :allowance="allowance"
        :decimals="decimals"
        :symbol="symbol"
      />
    </section>
    <Button
      v-if="allowance < cost"
      :address="address"
      :cost="cost"
      :onInit="init"
      :onFetch="fetch"
    />
  </fragment>
</template>

<script>
import Button from "./Button";
import Info from "./Info";

export default {
  props: ["address", "cost", "onFetch"],
  components: {
    Button,
    Info
  },
  data() {
    return {
      symbol: "",
      decimals: 0,
      balance: 0,
      allowance: 0
    };
  },
  methods: {
    init(data) {
      this.decimals = data.decimals;
      this.symbol = data.symbol;
    },
    fetch(data) {
      this.balance = data.balance;
      this.allowance = data.allowance;
      if (this.onFetch) {
        this.onFetch(data);
      }
    }
  }
};
</script>
