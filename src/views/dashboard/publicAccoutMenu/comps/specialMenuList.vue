<template>
  <div class="menu_preview_area fl">
    <div class="mobile_menu_preview">
      <div class="mobile_hd tc">{{wxname}}</div>
      <div class="menus">

        <div class="flex" v-if="menulist.length == 0" >
          <div class="keyboard"><i class="fa fa-keyboard-o" aria-hidden="true"></i></div>
          <div class="addfirst cp flex-1" @click="addFirst">+ 添加菜单</div>
        </div>

        <div v-else-if="!isdrag">
          <slot name="fixmenu"></slot>
        </div>

        <div class="flex" v-else>
          <div class="keyboard"><i class="fa fa-keyboard-o" aria-hidden="true"></i></div>
          <menuFirst class="flex-1" :lockToContainerEdges="true" axis="xy" @sort-start="start" @sort-end="end" @input="changesort" v-model="menu">
            <firstItem :lockToContainerEdges="true" slot="firstitem" v-for="(item, index) in menu" :index="index" :key="index" :item="item">
              <secondMenu :lockToContainerEdges="true" slot="secondMenu" :firstidx="index" v-if="activeMenu == index && item.sub_button && item.sub_button.length > 0" :child="item.sub_button"></secondMenu>
            </firstItem>
          </menuFirst>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import menuFirst from './specialMenuFirst'
import firstItem from './specialFirstItem'
import secondMenu from './specialSecondMenu'
import { mapGetters } from 'vuex';
import {defaulImg} from "@/assets/img.png";
let start = '',end = ''
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
name: "menuList",
  components:{secondMenu,menuFirst,firstItem},
  props:['isdrag','wxname'],
  data(){
    return {
      menu:[],
      // name:'请晓云网课',//公众号名称

      // menulist:[
      //   // {appid: "wxf1ac922a0dbb9917",events:null,leveltype: "first",name: "☀解决方案",radiotype: "miniprogram",timeid: "1552961685985",url: ""},
      //   // {appid: "wxf1ac922a0dbb9917",events:null,leveltype: "first",name: "演示",radiotype: "miniprogram",timeid: "1546665341688",url: ""},
      //   // {appid: "wxf1ac922a0dbb9917",events:null,leveltype: "first",name: "关于我们",radiotype: "miniprogram",timeid: "1552961686705",url: "",type:'click',
      //   //   sub_button:[
      //   //     {activeMenu: "1",leveltype: "second",name: "子菜单名称",radiotype: "click",timeid: "1614664822447",type: "click"}
      //   //   ]
      //   // },
      // ],
    }
  },
  mounted() {
    this.menu = this.menulist
    // // this.$store.commit('updateMenuList',this.menulist)
    // this.menu = this.menulist
    // let obj =  {appid: "wxf1ac922a0dbb9917",events:null,leveltype: "first",name: "关于我们",radiotype: "miniprogram",timeid: "1552961686705",url: "",type:'click',
    //       sub_button:[
    //         {activeMenu: "1",leveltype: "second",name: "子菜单名称",radiotype: "click",timeid: "1614664822447",type: "click"}
    //       ]
    //     }
    // this.$store.commit('updateCurrentMenu',obj)
  },
  methods:{
    //添加一级菜单
    addFirst(){
      let params = {
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
      this.$store.commit('updateSpecialCurrentMenu',params)
      this.$store.commit('updateSpecialactiveMenu',0)
    },
    changesort(newVal){
      this.$store.commit('updateSpecialMenuList',newVal)
      let c = this.currentMenu,
          m = this.menulist
      let idx = m.findIndex(item => {
        return item.timeid == c.timeid
      })
      // this.$store.commit('updateSpecialactiveMenu',idx)
    },
    start(){
      start = Number(new Date())
    },
    end(e){
      end = Number(new Date())
      let newV = e.newIndex,old = e.oldIndex
      this.$store.commit('updateSpecialactiveMenu',newV)
      // this.$store.commit('updateSpecialCurrentMenu',this.menulist[newV])
      if(newV == old && end - start < 500){
        this.$store.commit('updateSpecialactiveMenu',newV)
        this.$store.commit('updateSpecialCurrentMenu',this.menulist[newV])
      }
    }
  },
  computed:{
    ...mapGetters({
      menulist:'getSpecialMenuList',
      currentMenu:'getSpecialCurrentMenu',
      activeMenu:'getSpecialActiveMenu'
    })
  },
  watch:{
    menulist(){
      this.menu = this.menulist
    }
  }
}
</script>

<style scoped>
.flex{
  display: flex;
}
.flex-1{
  flex: 1;
}
  .mobile_menu_preview{
    width: 294px;
    position: relative;
    height: 600px;
    background: transparent url(https://tapi.fastwhale.com.cn/upload/images/2/20210303/s_1614738494603ef43e10d97.png) no-repeat 0 0;
    background-position: 0 0;
    border: 1px solid #e7e7eb;
    background-size: contain;
  }
  .mobile_menu_preview .mobile_hd{
    color: #fff;
    text-align: center;
    padding-top: 30px;
    font-size: 15px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    margin: 0 30px;
  }
  .menus{
    height: 52px;
    width: 100%;
    background: #fafafa;
    position: absolute;
    bottom: 0;
    left: 0;
  }
.menus .addfirst {
  border: 1px solid #4c69fc;
  color: #4c69fc;
  height: 100%;
  text-align: center;
  line-height: 50px;
}
.keyboard{width: 40px;line-height: 50px;text-align: center;font-size:20px;}
.keyboard i{font-size:20px;}
.addicon{font-size: 24px;color: #999;}
.firstitem{height: 52px;line-height: 52px;text-align: center;position: relative;background: #fafafa;border-left: 1px solid #e6e6e6;}
.firstitem.active{border: 1px solid #4c69fc;color: #4c69fc;box-sizing: border-box;background:#fff;}
.seconditem.active{border: 1px solid #4c69fc;color: #4c69fc;box-sizing: border-box;background:#fff;}
.keyboard{width: 40px;line-height: 50px;text-align: center;font-size:20px;}
.keyboard i{font-size:20px;}
</style>