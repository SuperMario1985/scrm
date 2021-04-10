<template>
  <div class="flex">
    <div class="keyboard"><i class="fa fa-keyboard-o" aria-hidden="true"></i></div>
    <div class="menufirst flex flex-1">
      <div class="flex-1 firstitem cp"  v-for="(item, index) in menulist" :index="index" :key="index" :item="item" @click="changeActive(index)" :class="{active:currentMenu && item.timeid == currentMenu.timeid}">
        <div class="w85 ellipsis">
          {{item.name}}
        </div>
        <div class="secondmenu" v-if="activeMenu == index">
          <div class="cp seconditem"  :class="{active:currentMenu && child.timeid == currentMenu.timeid}" @click.stop="changeChild(idx)" v-for="(child,idx) in item.sub_button" :key="idx">
            {{child.name}}
          </div>
          <div class="cp addicon seconditem" v-if="item.sub_button && item.sub_button.length < 5 || !item.sub_button" @click.stop="addSecond" style="border-bottom:0">
            +
          </div>
        </div>
      </div>
      <div class="flex-1 addicon firstitem cp" style="border-right:0" v-if="menulist.length < 3" @click="addFirst">
        +
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash'
import {defaulImg} from "@/assets/img.png";
const news = {
  id                : 0,
  addSketchVisible  : true,//控制添加图文按钮显示与隐藏
  addType           : 1,//添加方式
  inputTitle        : '',//标题
  digest            : '',//图文描述
  content_source_url: '',//跳转链接
  material_id       : '',//图文消息导入的素材id
  local_path        : {
    img  : defaulImg,
    audio: ""
  },
  showTextContent   : false,
  isAdvance         : false,
  closeShowModal3   : false,//每个图文消息是否选好素材
  materialSync      : 0,//素材是否同步，0不同步，1同步
  selectGroupId     : '',// 上传选择的分组id
}
const templateObj = {
  typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
  typeName           : {
    1: '文字',
    2: '图片',
    3: '音频',
    4: '视频',
    5: '图文',
    6: '小程序'
  },
  id                 : 0,
  closeShowModal3    : false,//是否选好素材
  disabled           : false,//消息类型图文能否被选
  file_name          : "", //手机上展示的素材标题
  material_id        : "", //选中的素材id
  local_path         : {
    img  : "",
    audio: ""
  }, //手机上展示的图片、音频、视频链接
  addType            : 1,
  sketchList         : [JSON.parse(JSON.stringify(news))],//图文消息添加的数组
  appletUrl          : '',// 小程序的封面链接
  appletInputTitle   : '',// 小程序的标题
  appid              : '',// 小程序的appid
  pageUrl            : '',// 小程序page路径
  materialSync       : 0, // 小程序是否同步，0不同步，1同步
  selectGroupId      : '',// 上传选择的分组id
  textAreaValueHeader: "", //模板展示的内容
  textContent        : '',//编辑框传给后台的内容
}
export default {
name: "fixMenu",
  data(){
    return {
    }
  },
  computed:{
    ...mapGetters({
      menulist:'getMenuList',
      currentMenu:'getCurrentMenu',
      activeMenu:'getActiveMenu'
    })
  },
  methods:{
    changeActive(idx){

      this.$store.commit('changeCom')
      this.$store.commit('updateActiveMenu',idx)
      let params = this.menulist[idx]
      this.$store.commit('updateCurrentMenu',params)
    },
    addFirst(){
      this.$store.commit('changeCom')
      let l = this.menulist.length,
          params = {
            name:'菜单名称',
            timeid:Number(new Date()),
            leveltype:'first',
            type:'click',
            radiotype:'click',
            events:null,
            content_type:1,//菜单内容类型
            net_url:'',//菜单跳转网络地址
            sub_button:[],
          }
      this.$store.commit('updateActiveMenu',l)
      this.$store.commit('updateCurrentMenu',params)
      // this.save()
    },
    addSecond(){
      let that = this
      let c = _.cloneDeep(this.currentMenu)
      if( c.leveltype == 'first' && c.timeid ){

        this.$confirm({title:'添加子菜单后，一级菜单的内容将被清除。确定添加子菜单？',onOk(){
            c.type = ''
            delete(c['url'])
            delete(c['key'])
            delete(c['appid'])
            delete(c['pagepath'])
            delete(c['message'])
            delete(c['events'])
            delete(c['link'])
            that.$store.commit('updateCurrentMenu',c)
            that.addTwo()

          },})
      }else{
        this.addTwo()
      }

    },
    addTwo(){
      this.$store.commit('changeCom')
      let params = {
        name:'子菜单名称',
        timeid:Number(new Date()),
        leveltype:'second',
        activeMenu:1,
        type:'click',
        radiotype:'click',
        content_type:1,//菜单内容类型
        net_url:'',//菜单跳转网络地址
        events:null
      }
      this.$store.commit('updateCurrentMenu',params)
      // this.save()
    },
    changeChild(idx){
      this.$store.commit('changeCom')
      let parentmenu = _.cloneDeep(this.menulist)[this.activeMenu]
      this.$store.commit('updateCurrentMenu',parentmenu.sub_button[idx])
    },
  },
}
</script>
<style scoped>
@import "../../../style/fontawesome/css/font-awesome.css";
.flex{
  display: flex;
}
.flex-1{
  flex: 1;
}
.keyboard{width: 40px;line-height: 50px;text-align: center;font-size:20px;}
.keyboard i{font-size:20px;}
.addicon{font-size: 24px;color: #999;}
.firstitem{height: 52px;line-height: 52px;text-align: center;position: relative;background: #fafafa;border-left: 1px solid #e6e6e6;}
.firstitem.active{border: 1px solid #1E90FF;color: #1E90FF;box-sizing: border-box;background:#fff;}
.seconditem.active{border: 1px solid #1E90FF;color: #1E90FF;box-sizing: border-box;background:#fff;}
.keyboard{width: 40px;line-height: 50px;text-align: center;font-size:20px;}
.keyboard i{font-size:20px;}
.mobile_menu_preview .secondmenu {
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 100%;
  border: 1px solid #e6e6e6;
  color: #666;
}
.mobile_menu_preview .secondmenu::before {
  content: '';
  display: block;
  position: absolute;
  border: 6px solid transparent;
  border-top-color: #fafafa;
  bottom: -12px;
  left: 50%;
  margin-left: -6px;
  z-index: 10;
}
.addicon[data-v-6fbd3625] {
  font-size: 24px;
  color: #999;
}
.mobile_menu_preview .secondmenu::after {
  content: '';
  display: block;
  position: absolute;
  border: 7px solid transparent;
  border-top-color: #e6e6e6;
  bottom: -14px;
  left: 50%;
  margin-left: -7px;
}
.seconditem {
  text-align: center;
  line-height: 50px;
  background: #fafafa;
  border-bottom: 1px solid #e6e6e6;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  height: 50px;
}
.ellipsis{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  /*width: 80px;*/
}
.cp {
  cursor: pointer;
}
</style>