<template>
  <div class="flex-1 firstitem cp ellipsis w80">
    <div class="ellipsis"><a-icon type="align-left" style="color: #01b065" />{{item.name}}</div>
    <slot name="secondMenu"></slot>
  </div>
</template>

<script>
import { ElementMixin } from 'vue-slicksort';
import { mapGetters } from 'vuex';
export default {
    name: "firstItem",
    mixins:[ElementMixin],
    props:['item','index'],
    computed:{
    ...mapGetters({
      currentMenu:'getCurrentMenu'
    })
  },
}
</script>

<style scoped>
.firstitem{height: 52px;line-height: 52px;text-align: center;position: relative;background: #fafafa;border-left: 1px solid #e6e6e6;}
.firstitem.active{border: 1px solid #44b549;color: #44b549;box-sizing: border-box;background: #fff;}
.ellipsis{
  text-overflow: ellipsis;
  white-space: nowrap;
  /*overflow: hidden;*/
  cursor: pointer;
}
.w80{
  /*width: 80px;*/
}
</style>