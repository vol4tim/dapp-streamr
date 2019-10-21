<template>
  <Page>
    <RCard>
      <div v-if="stream">
        <div>StreamId: {{streamId}}</div>
        <div>Stream: {{streamData}}</div>
      </div>
      <template v-else>
        <Form ref="form" :onChange="onChange" :onSubmit="onSubmit" />
        <Approve v-if="cost > 0" :address="token" :cost="cost" :onFetch="onAllowance" />
        <RButton v-if="allowance >= cost" @click.native="submit" :disabled="run">Submit</RButton>
      </template>
    </RCard>
  </Page>
</template>

<script>
import Page from "@/components/Page";
import Form from "@/components/Form";
import Approve from "@/components/approve/Main";
import { genRosbagIpfs } from "../utils/utils";
import config from "../config";

export default {
  data() {
    return {
      stream: false,
      streamId: "",
      streamData: [],
      run: false,
      model: config.MODEL,
      token: "",
      cost: 0,
      allowance: 0,
      demandId: 0
    };
  },
  components: {
    Page,
    Form,
    Approve
  },
  created() {
    this.token = this.$robonomics.xrt.address;
    this.$robonomics.onDemand(this.model, msg => {
      console.log("demand", msg);
    });
    this.$robonomics.onOffer(this.model, msg => {
      console.log("offer", msg);
    });
  },
  methods: {
    submit() {
      this.$refs.form.submit();
    },
    onChange(fields) {
      this.cost = fields.period.value * config.PRICE;
    },
    onSubmit(e, fields) {
      if (!e) {
        this.run = true;
        this.createStream()
          .then(() => this.getObjective(fields))
          .then(objective => {
            this.$robonomics.web3.eth.getBlock("latest", (e, r) => {
              const demand = {
                model: this.model,
                objective: objective,
                token: this.$robonomics.xrt.address,
                cost: this.cost,
                lighthouse: this.$robonomics.lighthouse.address,
                validator: "0x0000000000000000000000000000000000000000",
                validatorFee: 0,
                deadline: r.number + 1000
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
    },
    onAllowance({ allowance }) {
      this.allowance = allowance;
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
    getObjective(fields) {
      const payload = {
        period: Number(fields.period.value),
        email: fields.email.value,
        stream_id: this.streamId
      };
      return genRosbagIpfs(payload);
    }
  }
};
</script>
