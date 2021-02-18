<template>
<div style="height:100%;">
  <TopNavbar/>
  <div class="home-page">
    <div class="content">
      <ul class="tabs">
        <li :class="{active: currentActive == 1}" style="border-left:0;" @click="changeTab(1,'yunmeilai')">
          <img src="~@/assets/homePage/yunmeilai.png" alt="">
          <span>云美来</span>
        </li>
        <li :class="{active: currentActive == 2}" @click="changeTab(2, 'company')">
          <img src="~@/assets/homePage/qiyeweixin.png" alt="">
          <span>{{wxInfo.corp_name}}</span>
        </li>
        <li :class="{active: currentActive == 3}" @click="changeTab(3, 'mine')" v-if="authrize.nick_name">
          <img src="~@/assets/homePage/gongzhonghao.png" alt="">
          <span>{{authrize.nick_name}}</span>
        </li>
        <!-- <li class="last">
          <img src="~@/assets/homePage/setting.png" alt="">
        </li> -->
      </ul>
      <div class="tab-content">
        <component :is="currentComponent" :corpid="wxInfo.corpid"></component>
      </div>
    </div>
</div>
  </div>
</template>

<script>
import TopNavbar from "@/layouts/TopNavbar.vue"
import yunmeilai from "./yunmeilai.vue"
import company from "./company.vue"
import mine from "./mine.vue"
import axios from 'axios'
export default {
  data() {
    return {
      currentActive: 1,
      currentComponent: "yunmeilai",
      wxInfo:{
        corp_name: "",
        corpid: ''
      },
      authrize: {
        nick_name: "",
        wx_id: ""
      }
    }
  },
  components:{
    yunmeilai, company, mine, TopNavbar
  },
  mounted() {  
    this.getWxInfo();
    this.getAuthrize();
  },
  methods: {
    changeTab(index, component) {
      this.currentActive = index;
      this.currentComponent = component;
    },
    getAuthrize() {
      axios.post("/wx-authorize-info/get-authrize-info",{
        uid: localStorage.getItem('uid')
      }).then( res => {
        this.authrize.nick_name = res.data.data.info[0].nick_name;
        this.authrize.wx_id = res.data.data.info[0].wx_id;
      })
    },
    getWxInfo() {
      axios.post("/work-corp/list",{
        uid: localStorage.getItem('uid')
      }).then( res => {
        this.wxInfo.corp_name = res.data.data.info[0].corp_name;
        this.wxInfo.corpid = res.data.data.info[0].corpid;
      })
    }
  }
}
</script>

<style scoped>
  .home-page {
    /* padding: 32px 148px; */
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    background: #f0f2f5;
  }
  .content {
    width: 1080px;
    height: 100%;
    margin: 0 auto;
    padding: 32px 0;
    box-sizing: border-box;
  }
  .tabs {
    width:100%;
    height: 64px;
    display: flex;
    background: #FAFAFA;
    margin: 0;
    padding: 0;
  }
  .tabs li {
    height:64px;
    line-height: 64px;
    padding:0 20px;
    color:#222;
    font-size: 14px;
    border-left: 1px solid #DCDCDC;
    cursor: pointer;
  }
  .tabs li img {
    width: 23px;
    margin-right: 12px;
  }
  .tabs li.active {
    background:#fff;
  }
  .tab-content {
    max-height: calc(100% - 64px);
    overflow: auto;
  }
  .tabs li.last{
    margin-left: auto;
    border-left: 0;
  }
  .tabs li.last img{
    width: 24px;
  }
</style>