<template>
  <Page>
    <RCard>
      <div v-if="stream">
        <div>StreamId: {{streamId}}</div>
        <div>Stream: {{streamData}}</div>
      </div>
      <template v-else>
        <Form ref="form" />

        <div v-if="cost > 0" style="margin-bottom:10px">
          cost: {{cost | fromWei(tokenInfo.decimals, tokenInfo.symbol)}} |
          balance: {{balance | fromWei(tokenInfo.decimals, tokenInfo.symbol)}} |
          approved: {{allowance | fromWei(tokenInfo.decimals, tokenInfo.symbol)}}
        </div>
        <RButton
          v-if="allowance < cost"
          :disabled="loadingApprove || balance < cost"
          @click.native="sendApproveTrade"
        >Approve</RButton>

        <RButton v-else @click.native="send" :disabled="run">Submit</RButton>
      </template>
    </RCard>
  </Page>
</template>

<script>
import { Token } from "robonomics-js";
import Page from "../components/Page";
import Form from "../components/Form";
import config from "../config";
import { genRosbagIpfs } from "../utils/utils";

export default {
  components: { Page, Form },
  data() {
    return {
      stream: false,
      streamId: "",
      streamData: [],
      run: false,

      token: null,
      tokenInfo: {
        symbol: "",
        decimals: 0
      },
      cost: 0,
      balance: 0,
      allowance: 0,
      loadingApprove: false,

      nonce: 0
    };
  },
  mounted() {
    this.calc(Number(this.$refs.form.form.fields.period.value));
    this.$watch(
      () => {
        return this.$refs.form.form.fields.period.value;
      },
      val => {
        this.calc(Number(val));
      }
    );

    this.$robonomics.onDemand(config.MODEL, msg => {
      console.log("demand", msg);
    });
    this.$robonomics.onOffer(config.MODEL, msg => {
      console.log("offer", msg);
    });

    this.$robonomics.factory.call
      .nonceOf(this.$robonomics.account.address)
      .then(r => {
        this.nonce = Number(r);
      });

    this.initToken(this.$robonomics.xrt.address).then(this.fetchData);
  },
  methods: {
    calc(period) {
      this.cost = period * config.PRICE;
    },
    async initToken(address) {
      this.token = new Token(this.$robonomics.web3, address);
      this.tokenInfo.decimals = await this.token.call.decimals();
      this.tokenInfo.symbol = await this.token.call.symbol();
    },
    async fetchData() {
      this.balance = await this.token.call.balanceOf(
        this.$robonomics.account.address
      );
      this.allowance = await this.token.call.allowance(
        this.$robonomics.account.address,
        this.$robonomics.factory.address
      );
    },
    sendApproveTrade() {
      this.loadingApprove = true;
      return this.token.send
        .approve(this.$robonomics.factory.address, this.cost, {
          from: this.$robonomics.account.address
        })
        .then(() => {
          this.loadingApprove = false;
          return this.fetchData();
        })
        .catch(() => {
          this.loadingApprove = false;
        });
    },

    createStream() {
      return this.$streamr
        .getOrCreateStream({
          name:
            "robonomics-" + this.$robonomics.account.address + "-" + this.nonce,
          config: {
            fields: [
              {
                random: "number"
              }
            ]
          }
        })
        .then(stream => {
          this.streamId = stream.id;
        });
    },
    subscribe() {
      this.$streamr.subscribe(
        {
          stream: this.streamId
        },
        message => {
          this.streamData.push(message);
        }
      );
    },
    getObjective() {
      const payload = {
        period: Number(this.$refs.form.form.fields.period.value),
        email: this.$refs.form.form.fields.email.value,
        stream_id: this.streamId
      };
      return genRosbagIpfs(payload);
    },
    send() {
      if (this.$refs.form.validateForm()) {
        this.run = true;
        this.createStream()
          .then(() => this.getObjective())
          .then(objective => {
            this.$robonomics.web3.eth.getBlock("latest", (e, r) => {
              const demand = {
                model: config.MODEL,
                objective: objective,
                token: this.$robonomics.xrt.address,
                cost: this.cost,
                lighthouse: this.$robonomics.lighthouse.address,
                validator: "0x0000000000000000000000000000000000000000",
                validatorFee: 0,
                deadline: r.number + 1000,
                nonce: this.nonce
              };
              this.$robonomics
                .sendDemand(demand, true, () => {
                  this.stream = true;
                  this.subscribe();
                })
                .then(liability => {
                  console.log("liability demand", liability.address);
                })
                .catch(e => {
                  this.run = false;
                  console.log(e);
                });
            });
          })
          .catch(() => {
            this.run = false;
          });
      }
    }
  }
};
</script>
