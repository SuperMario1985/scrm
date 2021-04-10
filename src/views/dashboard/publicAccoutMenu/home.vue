<template>
    <div class="home">
      <a-spin :spinning="isLoading"  size="large"  class="flex justify-center algin-center loading-content">
      </a-spin>

      <div class="components-layout-demo-basic">
        <a-layout style="position: relative; height: 100%; overflow: hidden">
          <a-layout-sider class="contain-sider">
            <!-- 公众号s -->
            <div class="sider-one">
              <div class="sider-one-txt">选择公众号</div>
              <a-select showSearch optionFilterProp="children" style="width: 200px;margin-bottom: 20px;"
                        @change="handleChange" v-model="changeBackground" v-if="wxInfo[0]">
                <template v-for="item in wxInfo">
                  <a-select-option :value="item.wx_id">{{item.nick_name}}</a-select-option>
                </template>
              </a-select>
              <div class="wx-info" ref="wxInfo" style="" >
                <template v-for="(item) in wxInfo">

                  <div @click="selectWx(item.wx_id,item.authorizer_type,item.nick_name, item.verify_type)" class="selectWx"
                       :class="{ active:changeBackground == item.wx_id}">
                    <a-avatar :src="item.head_img" shape="square"/>
                    <span style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;float: right;width: calc(100% - 35px);">{{item.nick_name}}</span>
                  </div>
                </template>
              </div>
            </div>
            <!-- 公众号e -->
          </a-layout-sider>

          <a-layout v-if="isSetMode==0&&isLoading==false&&isAuth">
            <!-- header tab栏s -->
            <a-layout-header class="contain-header">
              <div class="scroll-box-list">
                <div class="flex algin-center" style="height: 100%;">
                  <div class="common-menu-btn" :class="{'menu-active':selectedMenuTabId==-10}" @click="changeMenuType(-10)">
                    通用菜单
                  </div>
                  <div class="special-menu-list">
                    <div class="special-menu-item"   :class="{'menu-active':selectedMenuTabId==(item.id?item.id:item.special_menu_id)}"
                         v-for="(item,index) in specialTotalMenu" :key="(item.special_menu_id?item.special_menu_id:item.id)" @click="changeMenuType((item.id?item.id:item.special_menu_id))">
                      {{item.menu_name}}
                    </div>
                  </div>
                  <a-button class="special-menu-btn-add"  @click="addMenu" v-has="'publicAccoutMenu-add'">
                    <a-icon type="plus-circle"  />
                    个性化菜单
                  </a-button>
                </div>
              </div>



            </a-layout-header>
            <!-- header tab栏e -->

            <a-layout-content style="margin: 10px 0 0 5px;height: 400px;overflow-y: auto;">
              <a-layout-header style="background-color: #fff"  v-if="isSpecialMenuSet==1">
                <div class="flex space-between algin-center">
                  <div class="menu-add-tip" style="color: red">个性化自定义菜单将根据以下设置的规则，让公众号的不同用户群体看到不一样的自定义菜单</div>
                  <a-button style="color: red" @click="deleteSpecialMenu" v-has="'publicAccoutMenu-delete'">删除菜单</a-button>
                </div>

              </a-layout-header>

              <!-- 通用菜单设置界面-->
                <a-layout v-if="isSpecialMenuSet!=1&&isSpecialMenuSet!=2">

                  <a-layout>
                      <a-layout-sider id="slider-content">
                        <menuList :isdrag="isdrag" :wxname="wxName">
                          <fixMenu slot="fixmenu"></fixMenu>
                        </menuList>

                      </a-layout-sider>

                    <a-layout-content style="width: 70%;height: 600px;overflow-y: auto;position: relative">
                      <a-spin :spinning="isLock"  size="large"  class="save-loading"/>
                      <Right v-if="currentMenu&&isLock==false"></Right>
                      <div class="menu_form_area" v-else-if="!currentMenu">
                        <div id="js_none" class="menu_initial_tips black9">点击左侧添加菜单进行编辑操作</div>
                      </div>
                    </a-layout-content>
                  </a-layout>
                  <a-layout-footer style="padding: 0!important;">
                        <div class="flex">
                          <div class="fl w294">
                            <a-button class="drag" v-if="!isdrag" @click="drag" :disabled="menulist.length == 0 || (menulist.length == 1 && menulist[0].sub_button &&  menulist[0].sub_button.length < 2 ) || (menulist.length == 1 && !menulist[0].sub_button)">
                              菜单排序
                            </a-button>
                            <a-button class="drag" v-else @click="drag" v-hasMore2one="'publicAccoutMenu-edit,publicAccoutMenu-add'">完成</a-button>
                          </div>
                          <div class="fr flex-justify">
                            <a-button @click="saveCommonMenu(0)" type="primary" v-hasMore2one="'publicAccoutMenu-edit,publicAccoutMenu-add'" style="margin-right: 5px;">保存</a-button>
                            <a-button @click="saveCommonMenu(1)" type="primary" v-hasMore2one="'publicAccoutMenu-edit,publicAccoutMenu-add'">发布</a-button>
                          </div>
                        </div>
                  </a-layout-footer>
                </a-layout>


                <!-- 个性化菜单             -->
              <a-layout v-if="isSpecialMenuSet==2">

                <a-layout>
                  <a-layout-sider id="slider-content1">
                    <menu-list1 :isdrag="isdrag" :wxname="wxName">
                      <fix-menu1 slot="fixmenu"></fix-menu1>
                    </menu-list1>

                  </a-layout-sider>

                  <a-layout-content style="width: 70%;height: 600px;overflow-y: auto;">
                    <a-spin :spinning="isLock"  size="large"  class="save-loading"/>
                    <Right1 v-if="specialCurrentMenu!=null&&Object.keys(specialCurrentMenu).length>0&&isLock==false"></Right1>
                    <div class="menu_form_area" v-else>
                      <div id="js_none1" class="menu_initial_tips black9">点击左侧添加菜单进行编辑操作</div>
                    </div>
                  </a-layout-content>
                </a-layout>
                <a-layout-footer style="padding: 0!important;">
                  <div class="flex">
                    <div class="fl w294">
                      <a-button class="drag" v-if="!isdrag" @click="drag" :disabled="specialMenuList.length == 0 || (specialMenuList.length == 1 && specialMenuList[0].sub_button &&  specialMenuList[0].sub_button.length < 2 ) || (specialMenuList.length == 1 && !specialMenuList[0].sub_button)">
                        菜单排序
                      </a-button>
                      <a-button class="drag" v-else @click="drag">完成</a-button>
                    </div>
                    <div class="fr flex-justify">
                      <a-button @click="beforeStep" class="mr-20" v-hasMore2one="'publicAccoutMenu-edit,publicAccoutMenu-add'">上一步</a-button>
                      <a-button @click="saveSpecialMenu(0)" type="primary" class="ml-20" v-hasMore2one="'publicAccoutMenu-edit,publicAccoutMenu-add'">保存</a-button>
                      <a-button @click="saveSpecialMenu(1)" type="primary" class="ml-5" v-hasMore2one="'publicAccoutMenu-edit,publicAccoutMenu-add'">发布</a-button>
                    </div>
                  </div>
                </a-layout-footer>
              </a-layout>

              <!-- 个性菜单设置界面 -->
              <a-spin :spinning="isLock1"  size="large"  class="save-loading"/>
              <div v-if="isSpecialMenuSet==1&&isLock1==false" class="special-menu-container">

                <!-- 名称 -->
                <a-form-item class="mb-20" :label-col="{ span: 4 }"
                             :wrapper-col="{ span: 20 }">
                  <template slot="label" ><span
                      style="color: red">*</span>个性化菜单名称
                  </template>
                  <a-input style="width: 400px;" v-model="specialMenuName" @input="changeCurrentSpecialMenuname"  placeholder="请填写名称" :maxLength="10">
                    <span slot="suffix">
                        <span>{{specialMenuName.length}}/10</span>
                    </span>
                  </a-input>
                </a-form-item>
                <!-- 手机系统 -->
                <a-form-item class="mt-20 mb-20" :label-col="{ span: 4 }"
                             :wrapper-col="{ span: 20 }">
                  <template slot="label" ><span
                      style="color: red"></span>手机系统
                  </template>
                  <a-radio-group name="radioGroup" v-model="matchrule.client_platform_type">
                    <a-radio :value="0">
                      全部
                    </a-radio>
                    <a-radio :value="2">
                      安卓
                    </a-radio>
                    <a-radio :value="1">
                      IOS
                    </a-radio>
                    <a-radio :value="3">
                      其他
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
                <!-- 性别 -->
                <a-form-item class="mt-20 mb-20" :label-col="{ span: 4 }"
                             :wrapper-col="{ span: 20 }">
                  <template slot="label" ><span
                      style="color: red"></span>性别
                  </template>
                  <a-radio-group name="radioGroup" v-model="matchrule.sex">
                    <a-radio :value="0">
                      全部
                    </a-radio>
                    <a-radio :value="1">
                      男
                    </a-radio>
                    <a-radio :value="2">
                      女
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
                <!-- 标签 -->
                <a-form-item class="mt-20 mb-20" :label-col="{ span: 4 }"
                             :wrapper-col="{ span: 20 }">
                  <template slot="label" ><span
                      style="color: red"></span>粉丝标签
                  </template>
                  <a-select  placeholder="请选择粉丝标签" v-model="matchrule.tag_id" :allowClear="true" style="width: 185px;">
<!--                    <a-select-option  value="">请选择粉丝标签</a-select-option>-->
                    <a-select-option :value="item.tag_id" v-for="item in tagList" :key="item.tag_id">
                          {{item.name}}
                    </a-select-option>
                  </a-select>
                  <div style="color: #aaa;font-size: 12px">如粉丝有多个标签,微信将根据粉丝最新被打上的标签进行匹配</div>
                </a-form-item>
                <!-- 语言 -->
                <a-form-item class="mt-20 mb-20" :label-col="{ span: 4 }"
                             :wrapper-col="{ span: 20 }">
                  <template slot="label" ><span
                      style="color: red"></span>语言
                  </template>
                  <a-select  placeholder="请选择语言" v-model="matchrule.language" style="width: 185px" :allowClear="true">
                    <a-select-option value="zh_CN">
                      简体中文
                    </a-select-option>
                    <a-select-option value="en">
                      英文
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <!-- 地区 -->
                <a-form-item class="mt-20 mb-20" :label-col="{ span: 4 }"
                             :wrapper-col="{ span: 20 }">
                  <template slot="label" ><span
                      style="color: red"></span>地区
                  </template>
                  <a-cascader :options="options" placeholder="请选择地区"  v-model="area" @change="areaChange" />
                </a-form-item>
                <div class="flex justify-center mt-100">
                  <a-button @click="nextStep" v-hasMore2one="'publicAccoutMenu-edit,publicAccoutMenu-add'">下一步</a-button>
                </div>

              </div>
            </a-layout-content>
          </a-layout>

          <!--    未检测到线上设置公众号        -->

          <a-layout v-if="isSetMode==1&&isLoading==false&&isAuth">
              <div  style="height: 100%;position: relative">
                <div style="width: 420px;" class="set-tip">检测到您的公众号已存在线上自定义菜单，您可以立即同步，或者重新设置。<span style="color: red">同步仅拉取菜单结构，请重新设置菜单内容后发布。</span>
                  <div class="set-btn">
                    <a-button class="mr-10" @click="resetSet">重新设置</a-button>
                    <a-button class="ml-20" type="primary" @click="imiteSync">立即同步</a-button>
                  </div>
                </div>
              </div>
          </a-layout>
          <!--     公众号未授权显示页面     -->
          <a-layout v-if="isAuth==false&&isLoading==false">
            <div  style="height: 100%;position: relative">
              <div style="width: 420px;" class="set-tip">
                  <div style="text-align: center">系统检测到您的公众号已解除授权，请重新授权后继续使用。</div>
                <div style="display: flex;justify-content: center;margin-top: 20px">
                  <a-button  @click="resetAuth" type="primary">重新授权</a-button>
                </div>
              </div>
            </div>
          </a-layout>

        </a-layout>
      </div>
    </div>
</template>

<script>
import menuList from "@/views/dashboard/publicAccoutMenu/menuList";
import fixMenu from "@/views/dashboard/publicAccoutMenu/fixMenu";
import Right from "@/views/dashboard/publicAccoutMenu/right";

import menuList1 from "@/views/dashboard/publicAccoutMenu/comps/specialMenuList";
import fixMenu1 from "@/views/dashboard/publicAccoutMenu/comps/specialFixMenu";
import Right1 from "@/views/dashboard/publicAccoutMenu/comps/specialRight";
import _ from 'lodash'
import {options} from '@/assets/city'
import {
  mapGetters
} from 'vuex'
export default {
name: "home",
  components:{menuList,fixMenu,Right,menuList1,fixMenu1,Right1},
  data(){
  return {
    isAuth:true,//公众号是否授权
    isLock1:false,//删除个性化菜单loading
    isLock:false,//防止快递点击按钮多次请求接口
    isLoading:false,
    isSetMode:0,//检测用户线上是否设置了公众号的模板 0不需要设置   1需要设置
    tagList:[],//微信标签
    area:[],//地区
    options:options,
    specialMenuName:'',//当前个性化菜单tab名称
    personalizedMenu:[],//个性化菜单列表
    currentSpecialContent:{},//当前选中的个性化菜单内容
    matchrule:{
      city: "",
      client_platform_type: 0,
      country: "中国",
      language: "",
      province: "",
      sex: 0,
      tag_id: '',
    },
    sepcialMenuTabId:'',
    selectedMenuTabId:-10,//被选中的tab栏菜单id
    isdrag:false,
    // commonMenuId:10,//通用菜单tab栏id
    commonMenu:[],//通用菜单
    // specialMenu:[],//个性化菜单
    specialMenuTabs:[{id:2,title:'个性化菜单'}],//个性化菜单tab栏
    wxInfo: [], //微信公众号列表
    changeBackground:'',//选中背景色,值为公众号的id
    activeTab:1,
    tabList:[{id:2,title:'个性化菜单'}],
    }
  },
  computed: {
    ...mapGetters({
      currentMenu: 'getCurrentMenu',
      menulist: 'getMenuList',
      activeMenu: 'getActiveMenu',
      specialTotalMenu:'getSpecialTotalMenuList',
      isSpecialMenuSet:'getIsSpecialMenuSet',//是否在个性化菜单设置界面 1在第一步 2在第二步，其余数字表示不在个性设置界面
      specialMenuList:'getSpecialMenuList',
      specialCurrentMenu:'getSpecialCurrentMenu',
      specialActiveMenu:'getSpecialActiveMenu',//个性化菜单下的菜单列表的index
      specialTotalMenuActive:'getSpecialTotalMenuActive',//个性化菜单列表的index

    }),
    wxName(){
     let wxInfo = this.wxInfo.find(item=>{
        return  item.wx_id == this.changeBackground
      })
      return  wxInfo&&wxInfo.nick_name
    },

  },
  watch:{
    area(newVal){
      this.matchrule.province =newVal[0]
      this.matchrule.city =newVal[1]
    },
    //监控公众号id变更
    changeBackground(){
      this.selectedMenuTabId =-10
      this.$store.commit('clearCurrentMenu')
      this.$store.commit('clearMenuList')
      this.$store.commit('clearSpecialCurrentMenu')
      this.$store.commit('clearSpecialMenuList')
      this.$store.commit('updateIsSpecialMenuSet',3)
      this.$store.commit('updateSpecialTotalMenuActive',0)
      this.getWeChatInfo()
      this.getSignList()
    },
    //监控个性化菜单tab栏变更
    specialTotalMenuActive(newVal){
      if(newVal!=-1){ //如果是个性化菜单tab

        if(this.specialTotalMenu.length>0){
          this.specialMenuName = this.specialTotalMenu[newVal].menu_name
          this.$store.commit('updateSpecialMenuList',this.specialTotalMenu[this.specialTotalMenuActive].menu)
          let specialCurrentMenu = this.specialTotalMenu[this.specialTotalMenuActive].menu.length==0?{}:this.specialTotalMenu[this.specialTotalMenuActive].menu[0]
          this.$store.commit('updateSpecialCurrentMenu',specialCurrentMenu)
        }
      }
    },
    //监控当前个性化菜单栏所有属性变更
    specialCurrentMenu: {
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal) != JSON.stringify(oldVal) ) {
            if(this.specialTotalMenu.length>0){
              this.specialTotalMenu[this.specialTotalMenuActive].menu  = this.specialMenuList
            }

        }
      },
      deep: true //对象内部属性的监听，关键。
    },
  },
  mounted() {
    this.wxInfo = this.$store.state.wxArr
    this.changeBackground =this.wxInfo.length>0?this.wxInfo[0].wx_id:''
  },
  methods:{
    //公众号重新授权
    resetAuth(){
      let uid = localStorage.getItem("uid");
      let redirctUri = this.$store.state.siteUrl + "/message/publicAccoutMenu";
      window.open(
          `${this.$store.state.commonUrl}/bind/index?uid=${uid}&cnf_id=1&redirect_uri=${redirctUri}`,
          "_blank"
      );
    },
    //立即同步
    imiteSync(){
        this.axios.post('wechat-menu/sync-official-wechat-menus',{wx_id:this.changeBackground}).then(({data:res})=>{
            if(res.error!=0){
              this.$message.error(res.error_msg)
            }else {
              this.getWeChatInfo(5,this.changeBackground)
            }
        })
    },
    resetSet(){
      this.isSetMode =0
    },
    //同步当前个性化菜单名称
    changeCurrentSpecialMenuname(){
      this.specialTotalMenu[this.specialTotalMenuActive].menu_name =this.specialMenuName
    },
    //获取客户标签
    async getSignList(){
        const {data:res} = await  this.axios.post('tags/tags-get-all',{only_tag:1,type:1,wx_id:this.changeBackground})
      if(res.error!=0){
         this.$message.error(res.error_msg)
      }else{
        this.tagList = res.data.info
      }
    },
    //删除当前个性化菜单
    deleteSpecialMenu(){
      let that = this
      if(this.isLock1){
        return
      }

        this.$confirm({title:'确认删除该个性化菜单吗?',onOk(){

          if(!that.specialTotalMenu[that.specialTotalMenuActive].id){ //如果该菜单还没提交保存过，就直接删除
              that.specialTotalMenu.splice(that.specialTotalMenuActive,1)
              that.$store.commit('updateSpecialTotalMenuActive',that.specialTotalMenu.length-1)
              that.$message.success('删除成功！')
            if(that.specialTotalMenu.length==0){
              that.$store.commit('clearSpecialCurrentMenu')
              that.$store.commit('clearSpecialMenuList')
                that.$store.commit('updateIsSpecialMenuSet',3)
                that.selectedMenuTabId=-10
                that.$store.commit('updateSpecialTotalMenuActive',0)
            }else{
              that.$store.commit('updateIsSpecialMenuSet',1)
              that.$store.commit('updateSpecialTotalMenuActive',that.specialTotalMenu.length-1)
              that.matchrule=that.specialTotalMenu[that.specialTotalMenu.length-1].matchrule
              that.selectedMenuTabId = that.specialTotalMenu[that.specialTotalMenu.length-1].id?that.specialTotalMenu[that.specialTotalMenu.length-1].id:that.specialTotalMenu[that.specialTotalMenu.length-1].special_menu_id
            }

              // that.getWeChatInfo()
          }else {
            that.isLock1=true
            that.axios.post('wechat-menu/del-personalized-menu',{wx_id:that.changeBackground,id:that.specialTotalMenu[that.specialTotalMenuActive].id}).then(({data:res})=>{
              if(res.error!=0){
                that.isLock1=false
                that.$message.error(res.error_msg)
              }else{
                that.isLock1=false
                that.specialTotalMenu.splice(that.specialTotalMenuActive,1)
                that.$store.commit('updateSpecialTotalMenuActive',that.specialTotalMenu.length-1)

                if(that.specialTotalMenu.length==0){
                  that.$store.commit('clearSpecialCurrentMenu')
                  that.$store.commit('clearSpecialMenuList')
                  that.$store.commit('updateIsSpecialMenuSet',3)
                  that.selectedMenuTabId=-10
                  that.$store.commit('updateSpecialTotalMenuActive',0)
                }else{
                  that.$store.commit('updateIsSpecialMenuSet',1)
                  that.$store.commit('updateSpecialTotalMenuActive',that.specialTotalMenu.length-1)
                  that.matchrule=that.specialTotalMenu[that.specialTotalMenu.length-1].matchrule
                  that.selectedMenuTabId = that.specialTotalMenu[that.specialTotalMenu.length-1].id?that.specialTotalMenu[that.specialTotalMenu.length-1].id:that.specialTotalMenu[that.specialTotalMenu.length-1].special_menu_id
                }


                that.$message.success('删除成功！')
                // that.getWeChatInfo(3)

              }
            })
          }

          },
        })
    },
    areaChange(val){

    },
    //保存个性化菜单
    saveSpecialMenu(flag=0){//flag 0 保存   1保存发布

      let that = this
      //验证当前个性化菜单填写项
      if(this.specialTotalMenu[this.specialTotalMenuActive].menu.length==0){
         return  this.$message.error('请设置菜单！')
      }
      if(this.specialTotalMenu[this.specialTotalMenuActive].menu.length>0){
        var currentSpecialMenu = this.specialTotalMenu[this.specialTotalMenuActive].menu

        for(var i =0; i<currentSpecialMenu.length;i++){
          var menuName=currentSpecialMenu[i].name

          if( currentSpecialMenu[i].name.trim().length==0){
            return  this.$message.error(`请填写${menuName}的菜单名称`)
          }
          if(currentSpecialMenu[i].sub_button.length==0){ //如果一级菜单下没有二级菜单

            if(currentSpecialMenu[i].content_type==1){ //验证发送消息相关菜单内容

              var  submenu =   currentSpecialMenu[i].menu_content

              for(var k=0;k<submenu.length;k++){
                  if(submenu[k].typeValue==5){//验证图文选项
                    let regX=/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
                    if(!regX.test(submenu[k].sketchList[0].content_source_url)){

                      return  this.$message.error(`请正确填写${menuName}下的网页地址！`)
                    }
                      if(submenu[k].sketchList[0].content_source_url.trim().length==0){
                          return  this.$message.error(`请填写${menuName}下的图文链接！`)
                      }
                    if(submenu[k].sketchList[0].isAdvance){//高级设置开启
                      if(submenu[k].sketchList[0].inputTitle.trim().length==0){

                        return  this.$message.error(`请填写${menuName}高级设置下的标题！`)
                      }

                    }

                  }

                if(submenu[k].typeValue==2){//验证图片选项
                  if(submenu[k].local_path.img.trim().length==0){
                    return  this.$message.error(`请上传${menuName}下的图片！`)
                  }

                }

                if(submenu[k].typeValue==1){//验证文字选项
                  if(submenu[k].textContent.trim().length==0){
                    return  this.$message.error(`请填写${menuName}下的文字！`)
                  }

                }

                if(submenu[k].typeValue==3){//验证音频选项
                  if(submenu[k].local_path.audio.trim().length==0){
                    return  this.$message.error(`请上传${menuName}下的音频！`)
                  }

                }

                if(submenu[k].typeValue==4){//验证视频选项
                  if(submenu[k].material_id==''){
                    return  this.$message.error(`请上传${menuName}下的视频！`)
                  }

                }

                if(submenu[k].typeValue==6){//验证小程序


                  if( submenu[k].addType==0){//如果是导入的

                    if( submenu[k].appletUrl.trim().length==0){
                      return  this.$message.error(`请选择${menuName}下的小程序！`)
                    }
                  }else{//如果是新建的

                    if(submenu[k].appid.trim().length==0){
                      return  this.$message.error(`请填写${menuName}下的appid！`)
                    }
                    if(submenu[k].appletInputTitle.trim().length<4){
                      return  this.$message.error(`${menuName}下的小程序标题长度需在4-12个字符！`)
                    }
                    if(submenu[k].pageUrl.trim().length==0){
                      return  this.$message.error(`请填写${menuName}下的小程序路径！`)
                    }
                    if(submenu[k].appletUrl.trim().length==0){
                      return  this.$message.error(`请上传${menuName}下的小程序封面！`)
                    }
                  }


                }

              }

            }else if(currentSpecialMenu[i].content_type==2){//验证跳转网页事件

                if(currentSpecialMenu[i].url&&currentSpecialMenu[i].url.trim().length==0){
                  return  this.$message.error(`请填写${menuName}下的网页链接！`)
                }
              let regX=/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
              if(!regX.test(currentSpecialMenu[i].url)){

                return  this.$message.error(`请正确填写${menuName}下的网页链接！`)
              }

            }else if(currentSpecialMenu[i].content_type==3){//验证跳转小程序事件

              if(!currentSpecialMenu[i].appid){
                return  this.$message.error(`请填写${menuName}下的appid！`)
              }
              if(!currentSpecialMenu[i].pagepath){
                return  this.$message.error(`请填写${menuName}下的小程序page路径！`)
              }
              if(!currentSpecialMenu[i].url){
                return  this.$message.error(`请填写${menuName}下的备用网址！`)
              }

            }

          }else{//如果一级菜单下有二级菜单
                  var sub_button  =    currentSpecialMenu[i].sub_button
                  for(let j=0;j<sub_button.length;j++){
                    var subMenuName = sub_button[j].name
                    if(sub_button[j].content_type==1){//验证发送消息相关菜单内容
                      var menu_contentV =  sub_button[j].menu_content

                      for(let g=0;g<menu_contentV.length;g++){

                        if(menu_contentV[g].typeValue==5){//验证图文选项

                          let regX=/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
                          if(!regX.test(menu_contentV[g].sketchList[0].content_source_url)){

                            return  this.$message.error(`请正确填写${subMenuName}下的网页地址！`)
                          }
                          if(menu_contentV[g].sketchList[0].content_source_url.trim().length==0){
                            return  this.$message.error(`请填写${subMenuName}下的图文链接！`)
                          }

                          if(menu_contentV[g].sketchList[0].isAdvance){//高级设置开启
                            if(menu_contentV[g].sketchList[0].inputTitle.trim().length==0){

                              return  this.$message.error(`请填写${subMenuName}高级设置下的标题！`)
                            }

                          }

                        }

                        if(menu_contentV[g].typeValue==2){//验证图片选项
                          if(menu_contentV[g].local_path.img.trim().length==0){
                            return  this.$message.error(`请上传${subMenuName}下的图片！`)
                          }

                        }

                        if(menu_contentV[g].typeValue==1){//验证文字选项
                          if(menu_contentV[g].textContent.trim().length==0){
                            return  this.$message.error(`请填写${subMenuName}下的文字！`)
                          }

                        }

                        if(menu_contentV[g].typeValue==3){//验证音频选项
                          if(menu_contentV[g].local_path.audio.trim().length==0){
                            return  this.$message.error(`请上传${subMenuName}下的音频！`)
                          }

                        }

                        if(menu_contentV[g].typeValue==4){//验证视频选项
                          if(menu_contentV[g].material_id==''){
                            return  this.$message.error(`请上传${subMenuName}下的视频！`)
                          }

                        }


                        if(menu_contentV[g].typeValue==6){//验证小程序

                            if(menu_contentV[g].addType==0){//如果是导入的

                              if( menu_contentV[g].appletUrl.trim().length==0){
                                return  this.$message.error(`请选择${subMenuName}下的小程序！`)
                              }

                            }else{//如果是新建的

                              if( menu_contentV[g].appid.trim().length==0){
                                return  this.$message.error(`请填写${subMenuName}下的appid！`)
                              }
                              if( menu_contentV[g].appletInputTitle.trim().length<4){
                                return  this.$message.error(`${subMenuName}下的小程序标题长度需在4-12个字符！`)
                              }
                              if( menu_contentV[g].appletUrl.trim().length==0){
                                return  this.$message.error(`请上传${subMenuName}下的小程序封面！`)
                              }

                              if(menu_contentV[g].pageUrl.trim().length==0){
                                return  this.$message.error(`请填写${subMenuName}下的小程序路径！`)
                              }

                            }

                        }


                      }

                    }else if(sub_button[j].content_type==2){//验证跳转网页事件
                      if(sub_button[j].url&&sub_button[j].url.trim().length==0){
                        return  this.$message.error(`请填写${subMenuName}下的网页链接！`)
                      }
                      let regX=/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
                      if(!regX.test(sub_button[j].url)){

                        return  this.$message.error(`请填写${subMenuName}下的网页链接！`)
                      }
                    }else if(sub_button[j].content_type==3){//验证跳转小程序事件
                      if(!sub_button[j].appid){
                        return  this.$message.error(`请填写${subMenuName}下的appid！`)
                      }

                      if(!sub_button[j].pagepath){
                        return  this.$message.error(`请填写${subMenuName}下的小程序page路径！`)
                      }

                      if(!sub_button[j].url){
                        return  this.$message.error(`请填写${subMenuName}下的备用网址！`)
                      }

                    }


                  }

            }

        }

      }

      let params = {
        menu_name:this.specialMenuName,
        matchrule:this.specialTotalMenu[this.specialTotalMenuActive].matchrule,
        wx_id:this.changeBackground,
        type:2,uid:localStorage.getItem('uid'),
        confirm_save:0,
        menu:this.specialTotalMenu[this.specialTotalMenuActive].menu
      }

      if(this.specialTotalMenu[this.specialTotalMenuActive].id){//如果是编辑
        //confirm_save 0 保存   1保存发布  type 1通用菜单  2个性化菜单
        params.id = this.specialTotalMenu[this.specialTotalMenuActive].id
        if(this.isLock){
          return
        }

        this.isLock=true
        this.axios.post('wechat-menu/save-wechat-menu',params).then(({data:res})=>{

            if(res.error!=0){
              this.$message.error(res.error_msg)
              this.isLock=false
            }else{
              this.isLock=false
              if(flag==1){ //发布
                this.$confirm({title:'确认发布',content:'发布后将覆盖线上菜单内容，大约需要5分钟才能生效，或取消重新关注公众号立即生效',onOk(){
                    params.confirm_save =1 //发布
                    that.isLock=true
                    params.id = res.data.menuID
                    that.axios.post('wechat-menu/save-wechat-menu',params).then(({data:res})=>{
                      if(res.error!=0){
                        that.isLock=false
                        that.$message.error(res.error_msg)
                      }else{
                        that.isLock=false
                        that.$store.commit('updateIsSpecialMenuSet',1)
                        // that.selectedMenuTabId = res.data.menuID
                        that.$message.success('发布成功！')
                        // that.getWeChatInfo(2)
                      }
                    })
                  },
                  onCancel(){
                    that.isLock=false
                    that.selectedMenuTabId = res.data.menuID
                    that.$store.commit('updateIsSpecialMenuSet',1)
                    that.$message.success('保存成功！')
                    // that.getWeChatInfo(2)
                  },
                })
              }else {//保存
                that.$store.commit('updateIsSpecialMenuSet',1)
                that.$message.success('保存成功！')
              }


            }
        })
      }else{//如果是新建
        this.isLock=true
        //confirm_save 0 保存   1保存发布  type 1通用菜单  2个性化菜单
        this.axios.post('wechat-menu/save-wechat-menu',params).then(({data:res})=>{
          if(res.error!=0){
            this.isLock=false
            this.$message.error(res.error_msg)
          }else{
            this.isLock=false
            if(flag==1){//发布
              this.$confirm({title:'确认发布',content:'发布后将覆盖线上菜单内容，大约需要5分钟才能生效，或取消重新关注公众号立即生效',
                onOk(){
                  that.isLock=true
                  params.confirm_save =1 //发布
                  params.id = res.data.menuID
                  that.axios.post('wechat-menu/save-wechat-menu',params).then(({data:res})=>{
                    if(res.error!=0){
                      that.isLock=false
                      that.$message.error(res.error_msg)
                    }else{
                      that.isLock=false
                      that.selectedMenuTabId = res.data.menuID
                      that.specialTotalMenu[that.specialTotalMenuActive].id= res.data.menuID
                      that.specialTotalMenu[that.specialTotalMenuActive].matchrule=that.matchrule
                      that.$store.commit('updateIsSpecialMenuSet',1)
                      that.$message.success('发布成功！')
                      // that.getWeChatInfo(2)
                    }
                  })
                },
                onCancel(){
                  that.isLock=false
                  that.selectedMenuTabId = res.data.menuID
                  that.specialTotalMenu[that.specialTotalMenuActive].id= res.data.menuID
                  that.specialTotalMenu[that.specialTotalMenuActive].matchrule=that.matchrule
                  that.$store.commit('updateIsSpecialMenuSet',1)
                  that.$message.success('保存成功！')
                  // that.getWeChatInfo(2)
                },
              })
            }else {//保存
              this.selectedMenuTabId = res.data.menuID
              this.specialTotalMenu[that.specialTotalMenuActive].id= res.data.menuID
              this.specialTotalMenu[that.specialTotalMenuActive].matchrule=that.matchrule
              this.$store.commit('updateIsSpecialMenuSet',1)
              this.$message.success('保存成功！')
            }

          }
        })
      }

    },
    //保存通用菜单
    saveCommonMenu(flag=0){//flag 0 保存   1保存并发布
      let that = this

      let params = {
        wx_id:this.changeBackground,confirm_save:0,type:1,uid:localStorage.getItem('uid'),menu:this.menulist
      }

      //验证通用菜单填写项
      if(this.currentMenu==null||this.menulist.length==0){
       return  this.$message.error('请设置通用菜单！')
      }

      for(let i=0;i<this.menulist.length;i++){
        var menuName=this.menulist[i].name
        if( this.menulist[i].name.trim().length==0){
          return  this.$message.error(`请填写${menuName}的菜单名称`)
        }

        if(this.menulist[i].sub_button.length==0){//如果没有一级菜单下没有子菜单

          if(this.menulist[i].content_type==1){//如果是设置发送消息类型的事件
            let menu_content = this.menulist[i].menu_content
            for(let j=0;j<menu_content.length;j++){

              if( menu_content[j].typeValue==5){//验证图文链接
                let regX=/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
                if(!regX.test(menu_content[j].sketchList[0].content_source_url)){

                  return  this.$message.error(`请正确填写${menuName}下的网页链接！`)
                }

                if(menu_content[j].sketchList[0].content_source_url.trim().length==0){
                  return  this.$message.error(`请填写${menuName}下的图文链接！`)
                }
                if(menu_content[j].sketchList[0].isAdvance){//高级设置开启
                  if(menu_content[j].sketchList[0].inputTitle.trim().length==0){

                    return  this.$message.error(`请填写${menuName}高级设置下的标题！`)
                  }

                }

              }

              if( menu_content[j].typeValue==2){//验证图片选项

                if(menu_content[j].local_path.img.trim().length==0){
                  return  this.$message.error(`请上传${menuName}下的图片！`)
                }
              }

              if( menu_content[j].typeValue==1){//验证文字选项

                if(menu_content[j].textContent.trim().length==0){
                  return  this.$message.error(`请填写${menuName}下的文字！`)
                }
              }

              if( menu_content[j].typeValue==3){//验证音频选项

                if(menu_content[j].local_path.audio.trim().length==0){
                  return  this.$message.error(`请上传${menuName}下的音频！`)
                }
              }

              if( menu_content[j].typeValue==4){//验证视频选项

                if(menu_content[j].material_id==''){
                  return  this.$message.error(`请上传${menuName}下的视频！`)
                }
              }

              if( menu_content[j].typeValue==6){//验证小程序

                  if(menu_content[j].addType==0){//如果是导入的
                    if(menu_content[j].appletUrl.trim().length==0){
                      return  this.$message.error(`请选择${menuName}下的小程序！`)
                    }

                  }else{//如果是新建的
                      if(menu_content[j].appid.trim().length==0){
                        return  this.$message.error(`请填写${menuName}下的appid！`)
                      }
                      if(menu_content[j].appletInputTitle.trim().length<4){
                        return  this.$message.error(`${menuName}下的小程序标题长度需在4-12个字符！`)
                      }

                    if(menu_content[j].pageUrl.trim().length==0){
                      return  this.$message.error(`请填写${menuName}下的小程序路径！`)
                    }
                    if(menu_content[j].appletUrl.trim().length==0){
                      return  this.$message.error(`请上传${menuName}下的小程序封面！`)
                    }

                  }

              }

            }

          }else if(this.menulist[i].content_type==2){//如果是设置跳转网页类型事件
            if(this.menulist[i].url&&this.menulist[i].url.trim().length==0){
              return  this.$message.error(`请填写${menuName}下的网页链接！`)
            }
            let regX=/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
            if(!regX.test(this.menulist[i].url)){

              return  this.$message.error(`请正确填写${menuName}下的网页链接！`)
            }

          }else if(this.menulist[i].content_type==3){//如果是设置跳转小程序类型事件
            if(!this.menulist[i].appid){
              return  this.$message.error(`请填写${menuName}下的appid！`)
            }

            if(!this.menulist[i].pagepath){
              return  this.$message.error(`请填写${menuName}下的小程序page路径！`)
            }

            if(!this.menulist[i].url){
              return  this.$message.error(`请填写${menuName}下的备用网址！`)
            }

          }

        }else{//如果一级菜单下有子菜单

          let sub_button = this.menulist[i].sub_button
          for(let k=0;k<sub_button.length;k++){
              var subMenuName =  sub_button[k].name
            if( sub_button[k].content_type==1){//验证发送消息相关菜单内容
                let menu_contentV = sub_button[k].menu_content
                for(let g=0;g<menu_contentV.length;g++){
                  if(menu_contentV[g].typeValue==5){//验证图文选项

                    let regX=/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
                    if(!regX.test(menu_contentV[g].sketchList[0].content_source_url)){

                      return  this.$message.error(`请正确填写${subMenuName}下的网页地址！`)
                    }

                    if(menu_contentV[g].sketchList[0].content_source_url.trim().length==0){
                      return  this.$message.error(`请填写${subMenuName}下的图文链接！`)
                    }

                    if(menu_contentV[g].sketchList[0].isAdvance){//高级设置开启
                      if(menu_contentV[g].sketchList[0].inputTitle.trim().length==0){

                        return  this.$message.error(`请填写${menuName}高级设置下的标题！`)
                      }

                    }
                  }

                  if(menu_contentV[g].typeValue==2){//验证图片选项

                    if(menu_contentV[g].local_path.img.trim().length==0){
                      return  this.$message.error(`请上传${subMenuName}下的图片！`)
                    }
                  }

                  if(menu_contentV[g].typeValue==1){//验证文字选项

                    if(menu_contentV[g].textContent.trim().length==0){
                      return  this.$message.error(`请填写${subMenuName}下的文字！`)
                    }
                  }

                  if(menu_contentV[g].typeValue==3){//验证音频选项

                    if(menu_contentV[g].local_path.audio.trim().length==0){
                      return  this.$message.error(`请上传${subMenuName}下的音频！`)
                    }
                  }

                  if(menu_contentV[g].typeValue==4){//验证视频选项

                    if(menu_contentV[g].material_id==''){
                      return  this.$message.error(`请上传${subMenuName}下的视频！`)
                    }
                  }

                  if(menu_contentV[g].typeValue==6){//验证小程序

                    if(menu_contentV[g].addType==0){//如果是导入的

                      if( menu_contentV[g].appletUrl.trim().length==0){
                        return  this.$message.error(`请选择${subMenuName}下的小程序！`)
                      }

                    }else{//如果是新建的

                      if( menu_contentV[g].appid.trim().length==0){
                        return  this.$message.error(`请填写${subMenuName}下的appid！`)
                      }
                      if( menu_contentV[g].appletInputTitle.trim().length<4){
                        return  this.$message.error(`${subMenuName}下的小程序标题长度需在4-12个字符！`)
                      }
                      if( menu_contentV[g].appletUrl.trim().length==0){
                        return  this.$message.error(`请上传${subMenuName}下的小程序封面！`)
                      }

                      if(menu_contentV[g].pageUrl.trim().length==0){
                        return  this.$message.error(`请填写${subMenuName}下的小程序路径！`)
                      }

                    }

                  }

                }

            }else if(sub_button[k].content_type==2){//验证跳转网页类型事件

              if(sub_button[k].url&&sub_button[k].url.trim().length==0){
                return  this.$message.error(`请填写${subMenuName}下的网页链接！`)
              }
              let regX=/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
              if(!regX.test(sub_button[k].url)){

                return  this.$message.error(`请正确填写${subMenuName}下的网页链接！`)
              }

            }else if(sub_button[k].content_type==3){//验证跳转小程序事件类型

              if(!sub_button[k].appid){
                return  this.$message.error(`请填写${subMenuName}下的appid！`)
              }
              if(!sub_button[k].pagepath){
                return  this.$message.error(`请填写${subMenuName}下的小程序page路径！`)
              }

              if(!sub_button[k].url){
                return  this.$message.error(`请填写${subMenuName}下的备用网址！`)
              }


            }


          }

        }

      }


      if(this.isLock){
        return
      }

      this.isLock=true
      //confirm_save 0 保存   1保存发布  type 1通用菜单  2个性化菜单
        this.axios.post('wechat-menu/save-wechat-menu',params).then(({data:res})=>{

              if(res.error!=0){
                this.$message.error(res.error_msg)
                this.isLock=false
              }else{
                this.isLock=false
                if(flag==1){//发布
                  this.$confirm({title:'确认发布',content:'发布后将覆盖线上菜单内容，大约需要5分钟才能生效，或取消重新关注公众号立即生效',onOk(){
                      params.confirm_save =1 //发布

                      that.isLock=true
                      that.axios.post('wechat-menu/save-wechat-menu',params).then(({data:res})=>{
                        if(res.error!=0){
                          that.isLock=false
                          that.$message.error(res.error_msg)
                        }else{
                          that.isLock=false
                          that.$message.success('发布成功！')
                          // that.getWeChatInfo()
                        }
                      })

                    },
                    onCancel(){
                      that.isLock=false
                      that.$message.success('保存成功！')
                    },
                  })
                }else {

                  that.$message.success('保存成功！')
                }

              }
        })
    },
    nextStep(){
      if(this.specialMenuName.trim().length==0){
        return this.$message.error('请填写个性化菜单名称！')
      }


      this.$store.commit('updateIsSpecialMenuSet',2)
      //从总的个性化菜单中筛选出当前选中个性化菜单
      let k =  this.specialTotalMenu.findIndex(item=>{
        let id = item.id? item.id:item.special_menu_id
          return id == this.selectedMenuTabId
      })

        this.specialTotalMenu[k].matchrule = _.cloneDeep(this.matchrule)
      // this.currentSpecialContent = _.cloneDeep(this.specialTotalMenu[k])

    },
    beforeStep(){
      this.$store.commit('updateIsSpecialMenuSet',1)
    },
    //切换菜单tab
    changeMenuType(val){

      if(this.isLock){
        return
      }
      if(this.selectedMenuTabId==val){
        return
      }
      // if(!this.specialTotalMenu[this.specialTotalMenuActive].id){
      //   this.$confirm('')
      //
      // }

      //从总的个性化菜单中筛选出当前选中个性化菜单
      let k =  this.specialTotalMenu.findIndex(item=>{
            let id = item.id? item.id:item.special_menu_id
            return id == val
      })

      this.currentSpecialContent =  this.specialTotalMenu[k]


      //更新当前个性化菜单index
      this.$store.commit('updateSpecialTotalMenuActive',k)
      if( val==-10){ //通用菜单时
        this.$store.commit('updateIsSpecialMenuSet',3)
      }else{
        this.specialMenuName= this.specialTotalMenu[k].menu_name
        this.area = []
        //数据回显和让placeholder显示
        if(this.specialTotalMenu[k].matchrule.province=='' || this.specialTotalMenu[k].matchrule.city==''||this.specialTotalMenu[k].matchrule.province==undefined||this.specialTotalMenu[k].matchrule.city==undefined){
          this.area = []
        }else{
          this.area.splice(0,0,this.specialTotalMenu[k].matchrule.province)
          this.area.splice(1,0,this.specialTotalMenu[k].matchrule.city)
        }
        this.matchrule = _.cloneDeep(this.specialTotalMenu[k].matchrule)
        this.$store.commit('updateIsSpecialMenuSet',1)

        this.$store.commit('updateSpecialMenuList',this.specialTotalMenu[this.specialTotalMenuActive].menu)
        let specialCurrentMenu = this.specialTotalMenu[this.specialTotalMenuActive].menu.length==0?{}:this.specialTotalMenu[this.specialTotalMenuActive].menu[0]

        this.$store.commit('updateSpecialCurrentMenu',specialCurrentMenu)

      }
      this.selectedMenuTabId =val
    },
    //请求公众号菜单信息
   async getWeChatInfo(flag=1,id=-1){//id 公众号点击立即同步成功后，初始化使用 //flag 1 保存通用菜单使用，2保存个性化菜单使用，3删除个性化菜单使用 4同步线上菜单成功后使用

        this.isLoading =true //开启loading
      let {data:res} = await this.axios.post('wechat-menu/wechat-menu-list',{wx_id:this.changeBackground})
      if(res.error!=0){
        this.isSetMode=0
        this.isLoading =false
          if(res.error!=400188){//公众号未授权 是 400188
            this.$message.error(res.error_msg)
            this.isAuth=true
          }else {
            this.isAuth=false
          }

      }else{
        this.isAuth=true
          this.isLoading =false
          this.isSetMode = res.data.initMenu
          this.personalizedMenu=res.data.list.personalizedMenu
        if(flag==4){ //同步线上已有的菜单成功后，需要做的操作
          this.changeBackground =id
          this.isSetMode = 0
        }
          if(res.data.list.ordinaryMenu!=null){
            let menuList = _.cloneDeep(res.data.list.ordinaryMenu.menu)
            let currentList = _.cloneDeep(res.data.list.ordinaryMenu.menu[0])
            this.commonMenuId = res.data.list.ordinaryMenu.id

            this.$store.commit('updateMenuList', menuList)
            this.$store.commit('updateCurrentMenu',currentList )
            this.$store.commit('updateActiveMenu', 0)
            this.commonMenu = _.cloneDeep(res.data.list.ordinaryMenu.menu)
          }

          if(res.data.list.personalizedMenu.length>0){//如果个性化菜单列表不为零

            //更新全局的当前个性化菜单index
            this.$store.commit('updateSpecialTotalMenuActive',res.data.list.personalizedMenu.length-1)
            this.$store.commit('updateSpecialTotalMenuList',res.data.list.personalizedMenu)
            this.$store.commit('updateSpecialMenuList',res.data.list.personalizedMenu[this.specialTotalMenuActive].menu)
            this.$store.commit('updateSpecialCurrentMenu',res.data.list.personalizedMenu[this.specialTotalMenuActive].menu[0])
            if(flag==3){//删除个性化菜单时
              this.$store.commit('updateIsSpecialMenuSet',3)
              this.selectedMenuTabId=-10
            }else if(flag==2){//保存或修改个性化菜单时
              this.$store.commit('updateIsSpecialMenuSet',1)
              this.selectedMenuTabId=res.data.list.personalizedMenu[this.specialTotalMenuActive].id
            }

          }else {//如果个性化列表被删除完了
            this.$store.commit('updateIsSpecialMenuSet',3)
            this.$store.commit('updateSpecialTotalMenuList',[])

            this.$store.commit('updateSpecialTotalMenuActive',0)

            this.selectedMenuTabId=-10
          }

        if(flag!=2){
          this.$store.commit('clearSpecialCurrentMenu')
          this.$store.commit('clearSpecialMenuList')
          }

      }

    },
    drag(){
      this.isdrag = !this.isdrag

      // this.$store.commit('changeCom')
      // this.$store.commit('updateActiveMenu',0)
      // let params = this.menulist[0]
      // this.$store.commit('updateCurrentMenu',params)
      // !this.isdrag ? this.save() : ''
    },
    addMenu(){

        this.matchrule={
          city: '',
          client_platform_type: 0,
          country: "中国",
          language: undefined,
          province: '',
          sex: 0,
          tag_id:'',
        }

        let tag_id =undefined
      if(this.tagList.length>0){
        // tag_id = this.tagList[0].tag_id
        this.matchrule.tag_id= tag_id
      }
      this.area=[]
        let params = {
          special_menu_id:Number(new Date()),
          menu_name:`个性化菜单${this.specialTotalMenu.length+1}`,
          matchrule:{
            city: '',
            client_platform_type: 0,
            country: "中国",
            language: undefined,
            province: '',
            sex: 0,
            tag_id,
          },
          menu:[],
        }
      this.specialMenuName = `个性化菜单${this.specialTotalMenu.length+1}`
        this.$store.commit('updateSpecialTotalMenuList',params)
        //更新到个性化菜单第一步设置页面
        this.$store.commit('updateIsSpecialMenuSet',1)
        this.$store.commit('updateSpecialTotalMenuActive',this.specialTotalMenu.length-1)

      //更新菜单显示
      // this.$store.commit('updateSpecialMenuList',this.specialTotalMenu[this.specialTotalMenuActive].menu)
      // let specialCurrentMenu = this.specialTotalMenu[this.specialTotalMenuActive].menu.length==0?{}:this.specialTotalMenu[this.specialTotalMenuActive].menu[0]
      // this.$store.commit('updateSpecialCurrentMenu',specialCurrentMenu)


      this.selectedMenuTabId = params.special_menu_id
    },
    selectWx(id, authorizer_type, nick_name, verify_type){
        if(this.isLoading){
          return
        }else {
          this.changeBackground = id
        }

    },
    handleChange(val){
      this.changeBackground = val
    }
  },
}
</script>

<style scoped>
.fl{
  float: left;
}
.fr{
  float: right;
}
.flex{
  display: flex;
}
.space-between{
  justify-content: space-between;
}
.algin-center{
  align-items:center;
}
.flex-justify{
  width: 75%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.w294{
  width: 294px;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.home{
  position: relative;
  margin-left: 16px;
  height: 100%;
}
.contain-sider{
  background-color: #fff;
}
.contain-header{
  background-color: #fff;
  height: 80px;
  margin-left: 5px;
}
.components-layout-demo-basic{
  height: 100%;
}
>>> .components-layout-demo-basic .ant-layout-sider {
  background: #FFF;
  -webkit-box-flex: 0 !important;
  -ms-flex: 0 0 250px !important;
  flex: 0 0 250px !important;
  max-width: 250px !important;
  min-width: 250px !important;
  width: 250px !important;
  border-right: 1px solid #E2E2E2;
}
.sider-one {
  padding: 0 20px;
}
.sider-one-txt {
  height: 60px;
  line-height: 60px;
  text-align: left;
}

.selectWx {
  width: 200px;
  /*margin-left: 20px;*/
  /*margin: auto;*/
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  padding-left: 10px;
}

.active {
  background: #1E90FF;
  color: white;
}

.tag-name {
  padding: 6px 14px;
  height: 34px;
  font-size: 13px;
  border: 1px solid #D9D9D9;
  background-color: transparent !important;
  color: rgba(0, 0, 0, 0.65);
}

/deep/ .dark-row {
  background: #FAFAFA;
}

/deep/ .light-row {
  background: #FFF;
}
.contain-header{
  padding: 0!important;

}

>>> .contain-header .ant-radio-button-wrapper{
  width: unset!important;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  border-radius: unset!important;
}

>>> .contain-header .ant-radio-button-wrapper:last-child::before{
  width: 0px!important;
}
.scroll-box-list{
  white-space: nowrap;
  overflow-x: auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
#slider-content{
  min-width: unset!important;
  max-width: unset!important;
  width: 294px!important;
}
#slider-content1{
  min-width: unset!important;
  max-width: unset!important;
  width: 294px!important;
}
.menu_initial_tips {
  text-align: center;
  padding-top: 200px;
}
.black9 {
  color: #999!important;
}
>>>.special-menu-btn-add{
  width: 160px;
  border: 1px dashed #d9d9d9;
  height: 67px!important;
  border-radius: unset!important;
}
.special-menu-container{
  height: 100%;
  background-color: #fff;
}
.special-menu-list{
  display: flex;
  align-items: center;
  height: 100%;
}
.common-menu-btn,.special-menu-item{
  width: 160px;
  height: 72px;
  text-align: center;
  border: 1px solid #eee;
  margin-right: 10px;
  cursor: pointer;
}
.menu-active{
  color: #1E90FF;
  border: 1px solid #1E90FF;
}
.set-tip{
  position: absolute;
  left: 35%;
  top: 35%;
}
.set-btn{
  position: absolute;
  bottom:-85px;
  left:25%;
}
.loading-content{
  position: absolute;
  top: 40%;
  left: 60%;
  z-index: 1000;
}
.save-loading{
  position: absolute;
  top: 40%;
  left: 50%;
  z-index: 1000;
}
</style>