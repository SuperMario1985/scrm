<template>
  <div class="cp seconditem ellipsis">
    <a-icon type="align-left" style="color: #01b065" />{{item.name}}
  </div>
</template>

<script>
import { ElementMixin } from 'vue-slicksort';
export default {
  name: "secondItem",
  mixins:[ElementMixin],
  props:['item']
}
</script>

<style scoped>
.seconditem{text-align: center;line-height: 50px;background: #fafafa;border-bottom: 1px solid #e6e6e6;}
.ellipsis{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  /*width: 80px;*/
  cursor: pointer;
}
</style>