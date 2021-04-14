<template>
  <div class="menu_form_area">
    <div id='js_rightBox' class="menu_rightBox" style='display:block'>
      <div class="editor_inner">
        <div class="menu_form_hd clearfix f14">
          <h4 class='fl'>{{currentMenu.name}}</h4>
          <div v-has="'publicAccoutMenu-delete'" class='fr del' @click="delMenu"><a class="maincl" href="javascript:void(0);" id="jsDelBt">删除{{currentMenu.leveltype == 'second' ? '子' : ''}}菜单</a></div>
        </div>
        <div class="setNameBox mt30 mb10 clearfix f14">
          <div class='fl'>{{currentMenu.leveltype == 'second' ? '子' : ''}}菜单名称</div>
          <div class='rightInp'>
            <a-input type='text'  @input="changeTitle" v-model="currentMenu.name" @blur="checkSave" class='frm_input'/>
            <!--            <div class="fontcl" v-if="checklen">超过指定长度</div>-->
            <div class="fontcl" v-if="!currentMenu.name.trim()"><span style="color: red">请输入{{currentMenu.leveltype == 'second' ? '子' : ''}}菜单名称</span></div>
            <div class="tiptxt" v-if="currentMenu.leveltype == 'first'">字数建议不超过4个汉字或8个字母,如需要添加二级菜单,一级菜单最多4个汉字</div>
            <div class="tiptxt" v-else>字数建议不超过8个汉字或16个字母</div>
          </div>
        </div>
        <div class=" mt30 mb10 clearfix f14" v-if="currentMenu.sub_button && currentMenu.sub_button.length == 0 && currentMenu.leveltype == 'first' || currentMenu.leveltype == 'second' || !currentMenu.sub_button">
          <div class='fl mr-10'>{{currentMenu.leveltype == 'second' ? '子' : ''}}菜单内容</div>

          <div class="content-type">
            <a-radio-group v-model="contentType" :default-value="1" @change="changeContentType">
              <a-radio :value="1">
               发送消息
              </a-radio>
              <a-radio :value="2">
                跳转网页
              </a-radio>
              <a-radio :value="3">
                跳转小程序
              </a-radio>
            </a-radio-group>
          </div>
          <!-- 跳转小程序 -->
          <div v-if="contentType==3" class="content_type_one">
            <a-form-item :label-col="{ span: 4 }"
                         :wrapper-col="{ span: 20 }">
              <template slot="label" ><span
                  style="color: red">*</span>AppID
              </template>
              <a-input style="width: 400px;"  v-model="minProgramAppid" @input="appidChange" @blur="inputChangeAppId"  placeholder="请填写小程序AppID，必须是关联到当前公众号的小程序应用"></a-input>

            </a-form-item>
            <a-form-item :label-col="{ span: 4 }"
                         :wrapper-col="{ span: 20 }">
              <template slot="label" ><span
                  style="color: red">*</span>page路径
              </template>
              <a-input style="width: 400px;"  v-model="pagePath" @input="pathChange" @blur="inputChangePath" placeholder="请输入小程序的页面路径，必须是关联到当前公众号的小程序应用"></a-input>
            </a-form-item>
            <a-form-item :label-col="{ span: 4 }"
                         :wrapper-col="{ span: 20 }">
              <template slot="label" ><span
                  style="color: red">*</span>备用网址
              </template>
              <a-input style="width: 400px;"  v-model="backUpUrl" @blur="inputChangeBackUpUrl" placeholder="请输入备用打开网页地址"></a-input>
            </a-form-item>
          </div>
          <!-- 跳转网页 -->
          <div v-if="contentType==2" class="content_type_one">
            <a-form-item :label-col="{ span: 4 }"
                         :wrapper-col="{ span: 20 }">
              <template slot="label" ><span
                  style="color: red">*</span>网页链接
              </template>
              <a-input style="width: 400px;"  v-model="netUrl" @input="netUrlChange" @blur="inputChange" placeholder="请输入网页链接，且必须以http://或https://开头"></a-input>
            </a-form-item>

          </div>
          <!-- 发送消息 -->
          <div style="margin-top: 15px;" v-if="contentType==1">
            <div class="pull-left fl">
              <vuedraggable v-model="list" :move="checkMove">
                <transition-group>
                  <div class="push-type-list"
                       :class="{active: index==current}"
                       @click="clickTab(index)"
                       v-for="(element,index) in list"
                       :key="index">
                    <div class="push-type-item">
                      <span class="index">{{index+1}}</span>
                      <span
                          class="type">{{element.typeName[element.typeValue]}}</span>
                    </div>
                  </div>
                </transition-group>
              </vuedraggable>
              <div slot="footer" class="add-new" @click="createPullLeft"
                   v-show="list.length < 6">
		                                                <span class="add-icon">
		                                                    <a-icon type="plus"/>
		                                                </span>
                <span class="add-btn">新建</span>
              </div>
            </div>

            <div class="pull-right fl" v-for="(element,index) in list"
                 v-if="index == current">
              <uploadMedia v-if="index < list.length"
                           :key="listKey + (index + 'list')"
                           :tip="tip"
                           @deleteMsg="deleteMsg" @changeMsg="changeMsg"
                           :msg="element">
              </uploadMedia>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import uploadMedia from '@/components/sendMsg/Home'
import _ from 'lodash'
import vuedraggable from "vuedraggable"
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
  props: ['cansave'],
  data() {
    return {
      backUpUrl:'',
      tip:['请填写小程序AppID，必须是关联到当前公众号的小程序应用','请输入小程序的页面路径，必须是关联到当前公众号的小程序应用'],
      minProgramAppid:'',//跳转小程序的appid
      pagePath:'',//跳转小程序的路径
      netUrl:'',//网页地址
      contentType:1,//菜单的内容类型
      current            : 0,//当前选中的tab值的index值
      listKey            : 0,
      list: [],
      type: '',
      checklen: false
    }
  },
  components:{uploadMedia,vuedraggable},
  computed: {
    ...mapGetters({
      currentMenu: 'getSpecialCurrentMenu',
      activeMenu: 'getSpecialActiveMenu',
      menulist: 'getSpecialMenuList'
    }),
  },
  watch: {
    currentMenu: {
      handler (newVal, oldVal) {
          if(newVal==null){
            this.$store.commit('updateSpecialCurrentMenu',{})
            return
          }
        if (JSON.stringify(newVal) != JSON.stringify(oldVal) ) {
          this.netUrl=''
          this.backUpUrl=''
          this.list =( newVal&&newVal.menu_content)?_.cloneDeep(newVal.menu_content):[_.cloneDeep(templateObj)]
          //当前菜单切换时，需要把菜单下的tab重置
          this.current = 0
          this.contentType = (newVal&&newVal.content_type)?newVal.content_type:1

          if(!newVal.appid){
            this.netUrl = newVal.url
          }
          if(newVal.appid){
            this.backUpUrl = newVal.url
          }
          this.minProgramAppid=newVal.appid
          this.pagePath =newVal.pagepath

        }
      },
      deep: true //对象内部属性的监听，关键。
    },
  },
  mounted() {
    this.list = this.currentMenu.menu_content?this.currentMenu.menu_content:[_.cloneDeep(templateObj)]
    this.contentType =this.currentMenu.content_type
    if(this.currentMenu.content_type==2){
      this.netUrl=this.currentMenu.url
    }
    if(this.currentMenu.content_type==3){
      this.minProgramAppid = this.currentMenu.appid
      this.backUpUrl = this.currentMenu.url
      this.pagePath = this.currentMenu.pagepath
    }
  },
  methods: {
    //获取字符串长度（汉字算两个字符，字母数字算一个）
    getByteLen(val) {

      let len = 0;
      for (let i = 0; i < val.length; i++) {
        let a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        }
        else {
          len += 1;
        }
      }
      return len;
    },

    inputChangeBackUpUrl(){
      this.$set(this.currentMenu,'url',this.backUpUrl)

    },
    appidChange(){
      this.$set(this.currentMenu,'appid',this.minProgramAppid)
    },
    netUrlChange(){

      this.$set(this.currentMenu,'url',this.netUrl)
    },
    pathChange(){
      this.$set(this.currentMenu,'pagepath',this.pagePath)
    },
    //菜单内容类型变更
    changeContentType(){
      this.currentMenu.content_type = this.contentType
      this.currentMenu.url=this.contentType==2?this.netUrl:this.backUpUrl
      let type =  'click'
      switch (this.contentType){
              case 1 :
                        type = 'click'
                        delete this.currentMenu['url']
                        break;
              case 2 :
                        type = 'view'
                        delete this.currentMenu['menu_content']
                        break;
              case 3 :
                        type = 'miniprogram'
                        delete this.currentMenu['menu_content']
                break;
              default:
            }
            this.currentMenu.type = type

          this.$store.commit('updateSpecialCurrentMenu',this.currentMenu)
    },
    inputChangeAppId(){
      this.currentMenu.appid = this.minProgramAppid
      this.$store.commit('updateSpecialCurrentMenu',this.currentMenu)
    },
    inputChangePath(){
      this.currentMenu.pagepath = this.pagePath
      this.$store.commit('updateSpecialCurrentMenu',this.currentMenu)
    },
    //验证网址
    inputChange(e){
      let regX=/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
      if(regX.test(e.target.value)){
        this.currentMenu.url = this.netUrl
        this.$store.commit('updateSpecialCurrentMenu',this.currentMenu)
      }else {
        // this.netUrl = ''
        // this.$message.error('格式不正确')
      }
    },
    clickTab (index) {
      this.current = index
      let hasTypeValue = false
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].typeValue == 5) {
          hasTypeValue = true
        }
      }
      for (let i = 0; i < this.list.length; i++) {
        if (hasTypeValue) {
          if (this.list[i].typeValue == 5) {
            this.list[i].disabled = false
          } else {
            this.list[i].disabled = true
          }
        } else {
          this.list[i].disabled = false
        }
      }
    },
    checkMove(){


    },
    createPullLeft(){
      this.current = this.list.length
      this.list.push(JSON.parse(JSON.stringify(templateObj)))
      var hasTypeValue = false
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].typeValue == 5) {
          hasTypeValue = true
        }
      }
      for (let i = 0; i < this.list.length; i++) {
        if (hasTypeValue) {
          if (this.list[i].typeValue == 5) {
            this.list[i].disabled = false
          } else {
            this.list[i].disabled = true
          }
        } else {
          this.list[i].disabled = false
        }
      }
      // var divscroll = document.getElementsByClassName('left-sider-content')[0]
      // divscroll.scrollTop = divscroll.clientHeight

    },
    deleteMsg(){
      let index = this.current
      this.current = this.current == 0 ? 0 : this.current - 1
      if (this.list.length > 1) {
        this.list.splice(index, 1)
      } else {
        this.list = [JSON.parse(JSON.stringify(templateObj))]
      }
    },

    checkSave() {
      let c = _.cloneDeep(this.currentMenu)
      // let len = c.leveltype == 'first' ? 8 : 16
      let n = c.leveltype == 'first' ? '菜单名称' : '子菜单名称'
      !c.name.trim() ? c.name = n : ''
      // c.name = publicFun.newV(c.name.trim(), len)
      this.$store.commit('updateSpecialCurrentMenu', c)
    },
    //切换  发送消息 | 跳转网页 | 跳转小程序
    // changetype(val) {
    //   this.type = val;
    //   let c = this.currentMenu;
    //   c.radiotype = val;//新的type;
    //   this.$store.commit('updateCurrentMenu', c)
    // },

    changeMsg(obj){
      this.list[this.current] = obj
        this.$set(this.currentMenu,'menu_content', this.list)
        this.$store.commit('updateSpecialCurrentMenu', this.currentMenu)
    },

    changeTitle(val) {
      //限制中文和字符输入长度
      if(this.currentMenu.leveltype=='first'){
        if(8-this.getByteLen(this.currentMenu.name)<0){

          let length =0
          for(let i=0;i<this.currentMenu.name.length;i++){

              if(this.currentMenu.name.charCodeAt(i)>255){

                length+=2
              }else{
                length++
              }

              if(length>8){
                return   this.currentMenu.name = this.currentMenu.name.substring(0,i)
              }

          }

          // return  this.currentMenu.name=this.currentMenu.name.substring(0,4)
        }
      }else{
        if(16-this.getByteLen(this.currentMenu.name)<0){
          let length =0
          for(let i=0;i<this.currentMenu.name.length;i++){

            if(this.currentMenu.name.charCodeAt(i)>255){

              length+=2
            }else{
              length++
            }

            if(length>16){
              return   this.currentMenu.name = this.currentMenu.name.substring(0,i)
            }

          }

        }
      }

      let currentM = _.cloneDeep(this.currentMenu)
      currentM.name = val.target.value
      this.$store.commit('updateSpecialCurrentMenu', currentM)
    },
    delMenu() {


        let that = this

      let c = _.cloneDeep(this.currentMenu),
          m = _.cloneDeep(this.menulist),
          activeMenu = this.activeMenu
      if (c.leveltype == 'first') {

        this.$confirm({title:`删除后“${c.name}”菜单下设置的内容将被删除`,onOk(){

            m.splice(activeMenu, 1)

            if(m.length>0){
              that.$store.commit('updateSpecialCurrentMenu',m[m.length-1])
              that.$store.commit('updateSpecialMenuList', m)
              that.$store.commit('updateSpecialactiveMenu', m.length-1)
            }else {
              that.$store.commit('clearSpecialCurrentMenu')
              that.$store.commit('updateSpecialMenuList', m)
              that.$store.commit('updateSpecialactiveMenu', null)
            }
          },

        })
      } else {
        let child = m[activeMenu].sub_button,
            idx = child.findIndex(item => {
              return item.timeid == c.timeid
            })
        this.$confirm({
          title: '删除确认',
          content:`删除后“${c.name}”菜单下设置的内容将被删除`,
          onOk() {
            child.splice(idx, 1)

            if(child.length>0){
              that.$store.commit('updateSpecialCurrentMenu',child[child.length-1])
              that.$store.commit('updateSpecialMenuList', m)

            }else {
              let currentMenu= {
                content_type:1,
                leveltype:'first',
                menu_content: [_.cloneDeep(templateObj)],
                name:m[that.activeMenu].name,
                net_url:'',
                radiotype:m[that.activeMenu].radiotype,
                sub_button:[],
                timeid:m[that.activeMenu].timeid,
                type:'click'
              }

              that.$store.commit('updateSpecialCurrentMenu',currentMenu)
              that.$store.commit('updateSpecialMenuList', m)
              that.$store.commit('updateSpecialactiveMenu', m.length-1)

            }

          },
        });


      }
    },
  },
}
</script>

<style scoped>
.content_type_one{
  height: 150px;
  padding-top: 20px;
  margin-top: 20px;
  background-color: #fff;
}
.menu_form_area {

  width: 100%;
  height: 100%;
}
#js_rightBox {
  position: relative;
  padding-left: 12px;
  height: 100%;
}
.editor_inner {
  min-height: 600px;
  padding: 0 20px 20px;
  background-color: #f4f5f9;
  border: 1px solid #e7e7eb;
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
.menu_form_hd {
  padding: 9px 0;
  border-bottom: 1px solid #e7e7eb;
}
.f14 {
  font-size: 14px!important;
}
.mb10 {
  margin-bottom: 10px;
}
.mt30 {
  margin-top: 30px;
}
.f14 {
  font-size: 14px!important;
}
.clearfix:before, .clearfix:after {
  display: table;
  content: "";
  line-height: 0;
}
.fl {
  float: left;
}
.rightselect {
  margin-left: 80px;
}
.del {
  color: #576b95;
}
.fr {
  float: right;
}
.menu_form_hd {
  padding: 9px 0;
  border-bottom: 1px solid #e7e7eb;
}
.setNameBox .rightInp {
  margin-left: 80px;
}
.pull-left {
  width: 88px;
}
.active {
  background: #FFF;
  color: #01b065;
  margin-right: -1px;
}
.push-type-item {
  position: relative;
  margin-bottom: 8px;
  border: 1px solid #D8D8D8;
  border-right: 0;
  z-index: 1;
  cursor: pointer;
  line-height: 38px;
}
.index {
  float: left;
  width: 30px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  border-right: 1px solid #D8D8D8;
}
.type {
  display: inline-block;
  width: 55px;
  border-right: 1px solid transparent;
  text-align: center;
}
.add-new {
  background: #F9F9F9;
  cursor: pointer;
}
.add-btn {
  float: left;
  width: 58px;
  text-align: center;
  height: 38px;
  line-height: 38px;
  border: 1px dashed #D8D8D8;
  border-right: 0;
}
.add-icon {
  font-size: 12px;
  float: left;
  width: 30px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  border: 1px dashed #D8D8D8;
  border-right: 0;
}
.pull-right {
  width: 560px;
  max-height: 860px;
  min-height: 300px;
  background: #FFF;
  border: 1px solid #D8D8D8;
  padding: 24px;
  overflow: auto;
}
.tiptxt{
  margin-top: 5px;
}
</style>