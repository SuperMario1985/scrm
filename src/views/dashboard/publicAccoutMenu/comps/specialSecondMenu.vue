<template>
  <div class="secondmenu">
    <second :lockToContainerEdges="true" lockAxis="y" @input="changesort" v-model="newChild">
      <secondItem :lockToContainerEdges="true" slot="child" v-for="(item, index) in newChild" :index="index" :key="index" :item="item"/>
    </second>
  </div>
</template>

<script>
import second from './specialSecond';
import secondItem from './specialSecondItem';
import { mapGetters } from 'vuex';
import _ from 'lodash'
export default {
  components:{second,secondItem},
  props:['firstidx','child'],
  data(){
    return {
      newChild:[]
    }
  },
  mounted() {
    this.newChild = this.child
  },
  methods:{
    changesort(newVal){
      let m = _.cloneDeep(this.menuList),
          idx = this.firstidx
      m[idx].sub_button = newVal
      this.newChild = newVal
      this.$store.commit('updateSpecialMenuList',m)
    }
  },
  watch:{
    child(){
      this.newChild = this.child
    }
  },
  computed:{
    ...mapGetters({
      menuList:'getSpecialMenuList'
    })
  }
}
</script>

<style scoped>
.secondmenu{position: absolute;bottom: 60px;left: 0;width: 100%; border:1px solid #e6e6e6}
.secondmenu > div .seconditem:last-child{border-bottom: 0;}
</style>