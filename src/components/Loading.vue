<template>
  <div style="width:100%;height:100%;">
    <div class="example">
      <a-spin tip="加载中..." size="large">
        <div class="spin-content">
          <slot></slot>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  data() {
    return {};
  },

  methods: {},

  created() {}
};
</script>

<style lang='less' scoped>
.example {
  text-align: center;
  padding: 200px 50px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 999999;
}
</style>
