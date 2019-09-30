<template>
  <Page>
    <RCard>
      <div>liability: {{liability}}</div>
      <div>streamId: {{streamId}}</div>
      <div v-if="historyData.length > 0">History: {{historyData}}</div>
      <div v-if="!result">Stream: {{streamData}}</div>
    </RCard>
  </Page>
</template>

<script>
import { Liability } from "robonomics-js";
import Page from "../components/Page";
import { readRosbagIpfs } from "../utils/utils";

export default {
  props: ["liability"],
  components: { Page },
  data() {
    return {
      streamId: "",
      result: false,
      historyData: [],
      streamData: []
    };
  },
  mounted() {
    this.getStream().then(result => {
      this.history();
      if (result === false) {
        this.subscribe();
      }
    });
  },
  methods: {
    async getStream() {
      const liability = new Liability(this.$robonomics.web3, this.liability);
      return liability
        .getInfo()
        .then(info => {
          this.result = Boolean(info.result);
          return this.rosbagObjective(info.objective);
        })
        .then(data => {
          this.streamId = data.stream_id;
          return this.result;
        });
    },
    rosbagObjective(objective) {
      const data = {
        period: 0,
        email: "",
        stream_id: ""
      };
      return readRosbagIpfs(objective, bag => {
        data[bag.topic.replace(/\//, "")] = bag.message.data;
      }).then(() => {
        return data;
      });
    },
    history() {
      this.$streamr.resend(
        {
          stream: this.streamId,
          resend: {
            from: {
              timestamp: 1
            }
          }
        },
        message => {
          this.historyData.push(message);
        }
      );
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
    }
  }
};
</script>
