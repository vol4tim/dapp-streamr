<template>
  <form>
    <section>
      <div class="form-item form-line-label">
        <label>
          Email:
          <span
            v-if="form.fields.email.error"
            class="input-msg"
          >Check if data correct, please.</span>
        </label>
        <input
          v-model="form.fields.email.value"
          class="container-full"
          :class="{ error: form.fields.email.error }"
          type="text"
        />
      </div>
      <div class="form-item form-line-label">
        <label>
          Period (sec):
          <span
            v-if="form.fields.period.error"
            class="input-msg"
          >Check if data correct, please.</span>
        </label>
        <input
          v-model="form.fields.period.value"
          class="container-full"
          :class="{ error: form.fields.period.error }"
          type="text"
        />
      </div>
    </section>
  </form>
</template>

<script>
export default {
  props: {
    onSubmit: {
      type: Function
    },
    onChange: {
      type: Function
    },
    isDisabled: {
      default: false
    }
  },
  data() {
    return {
      form: {
        fields: {
          email: {
            value: "",
            rules: ["require", "email"],
            error: false
          },
          period: {
            value: "60",
            rules: ["require"],
            error: false
          }
        },
        error: false
      }
    };
  },
  created() {
    this.onChange(this.form.fields);
  },
  updated() {
    this.onChange(this.form.fields);
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
            rule === "email" &&
            !/.+@.+/.test(this.form.fields[field].value)
          ) {
            this.form.fields[field].error = true;
            this.form.error = true;
          }
        });
      }
      return !this.form.error;
    },
    submit() {
      this.validate();
      if (this.onSubmit) {
        this.onSubmit(this.form.error, this.form.fields);
      }
    }
  }
};
</script>
