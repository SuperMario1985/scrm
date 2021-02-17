<template>
  <a-layout
    id="dashboard"
    style="min-height: 100vh; position: fixed; width: 100%; min-width: 1360px"
  >
    <top-navbar></top-navbar>
    <div>123</div>
  </a-layout>
</template>

<script>
import TopNavbar from "./TopNavbar";
export default {
  name: "Index",
  provide() {
    return {
      wxType: this.type,
    };
  },
  data() {
    return {
      
    };
  },
  components: {
    TopNavbar,
  },
  methods: {
    
  },
  watch: {
    
  },
  mounted() {
  },
};
</script>

<style lang="less">
@import "../common/css/dashboard.less";
</style>