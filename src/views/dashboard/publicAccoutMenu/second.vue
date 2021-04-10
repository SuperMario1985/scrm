<template>
  <div>
    <slot name="child"/>
  </div>
</template>

<script>
import { ContainerMixin } from 'vue-slicksort';
export default {
    name: "second",
    mixins:[ContainerMixin],
}
</script>

<style scoped>

</style>