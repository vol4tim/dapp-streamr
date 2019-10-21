<template>
  <div>
    Cost: {{cost | fromWei(decimals, symbol)}} |
    Balance: {{balance | fromWei(decimals, symbol)}} |
    Allowance: {{allowance | fromWei(decimals, symbol)}}
  </div>
</template>

<script>
export default {
  props: ["cost", "balance", "allowance", "decimals", "symbol"]
};
</script>
