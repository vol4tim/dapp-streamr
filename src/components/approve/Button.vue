<template>
  <form v-on:submit.prevent="sendApproveTrade">
    <section>
      <div class="form-item form-line-label">
        <label for="inputdata-amount">
          Amount *
          <span
            v-if="form.fields.amount.error"
            class="input-msg"
          >Check if data correct, please.</span>
        </label>
        <input
          v-model="form.fields.amount.value"
          class="container-full"
          :class="{ error: form.fields.amount.error }"
          type="text"
          required
        />
      </div>
    </section>
    <button
      class="container-full btn-big"
      :disabled="loadingApprove || balance < form.fields.amount.value"
      @click="sendApproveTrade"
    >Approve</button>
  </form>
</template>

<script>
import { Token } from "robonomics-js";
import { number } from "../../RComponents/tools/filters";

export default {
  props: ["address", "cost", "onInit", "onFetch"],
  data() {
    return {
      form: {
        fields: {
          amount: {
            value: "0",
            rules: ["require", "min", "max"],
            error: false
          }
        },
        error: false
      },
      token: null,
      symbol: "",
      decimals: 0,
      balance: 0,
      allowance: 0,
      loadingApprove: false
    };
  },
  mounted() {
    this.form.fields.amount.value = this.cost;
    this.initToken(this.address).then(this.fetchData);
  },
  methods: {
    validate() {
      this.form.error = false;
      for (let field in this.form.fields) {
        this.form.fields[field].error = false;
        this.form.fields[field].rules.forEach(rule => {
          if (rule === "require" && !this.form.fields[field].value) {
            this.form.fields[field].error = true;
            this.form.error = true;
          } else if (
            rule === "min" &&
            Number(this.form.fields[field].value) < 1
          ) {
            this.form.fields[field].error = true;
            this.form.error = true;
          } else if (
            rule === "max" &&
            Number(this.form.fields[field].value) >
              number.fromWei(this.balance, this.decimals)
          ) {
            this.form.fields[field].error = true;
            this.form.error = true;
          }
        });
      }
      return !this.form.error;
    },
    async initToken(address) {
      this.token = new Token(this.$robonomics.web3, address);
      this.decimals = await this.token.call.decimals();
      this.symbol = await this.token.call.symbol();
      if (this.onInit) {
        this.onInit({
          decimals: this.decimals,
          symbol: this.symbol
        });
      }
    },
    async fetchData() {
      this.balance = await this.token.call.balanceOf(
        this.$robonomics.account.address
      );
      this.allowance = await this.token.call.allowance(
        this.$robonomics.account.address,
        this.$robonomics.factory.address
      );
      this.form.fields.amount.value = number.fromWei(
        this.balance,
        this.decimals
      );
      if (this.onFetch) {
        this.onFetch({
          balance: this.balance,
          allowance: this.allowance
        });
      }
    },
    sendApproveTrade() {
      if (this.validate()) {
        this.loadingApprove = true;
        return this.token.send
          .approve(
            this.$robonomics.factory.address,
            number.fromWei(this.form.fields.amount.value, this.decimals),
            {
              from: this.$robonomics.account.address
            }
          )
          .then(() => {
            this.loadingApprove = false;
            return this.fetchData();
          })
          .catch(() => {
            this.loadingApprove = false;
          });
      }
    }
  }
};
</script>
