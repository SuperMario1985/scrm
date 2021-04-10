<template>
  <div class="menufirst flex">
    <slot name="firstitem"/>
  </div>
</template>

<script>
import { ContainerMixin } from 'vue-slicksort';
export default {
  name: "menuFirst",
  mixins:[ContainerMixin],
}
</script>

<style scoped>
.menufirst{height: 52px;line-height: 52px;text-align: center;}
.menufirst .fitstitem:last-child{border-right: 0;}
</style>