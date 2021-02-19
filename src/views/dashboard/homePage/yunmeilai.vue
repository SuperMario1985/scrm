<template>
  <div class="yunmeilai">
    <div class="welcome"><span class='time'>{{time>11?'下午':'上午'}}好</span>欢迎使用云美来SCRM系统</div>
    <div class="container">
      <div class="entrance">
        <div class="title">常用入口</div>
        <ul>
          <li @click="goNewPage('wechatManagement')">
            <img src="~@/assets/homePage/qiyeweixin.png" alt="">
            <span>授权企业微信</span>
          </li>
          <li @click="goNewPage('account')">
            <img src="~@/assets/homePage/gongzhonghao.png" alt="">
            <span>授权公众号</span>
          </li>
          <li style="margin-top:24px;" @click="goNewPage('subAccount')">
            <img src="~@/assets/homePage/tianjiachengyuan.png" alt="">
            <span>添加成员</span>
          </li>
          <li style="margin-top:24px;" @click="goNewPage('user/userUpdate')">
            <img src="~@/assets/homePage/zhanghaoshezhi.png" alt="">
            <span>账号设置</span>
          </li>
        </ul>
      </div>
      <div class="version">
        <div class="top">
          <div class="top-l">
            <div class="title">当前版本：</div>  
          </div>
          <!-- <div class="more">更多帮助></div> -->
          <div>
            <span class="type">{{ package_name }}</span>
            <span class="time">有效期：{{dateTime}}</span>
          </div>
        </div>
        <a-carousel autoplay>
          <div class="banner-box"><img src="~@/assets/homePage/banner.png" alt=""></div>
        </a-carousel>
        <div class="disc" @click="goYunmeilai">云美来官网</div>
      </div>
    </div>
    <div class="container">
      <div class="qustion">
        <div class="top">
          <div class="title">常见问题</div>
          <div class="more">更多帮助></div>
        </div>
        <ul>
          <li @click="goQuestionInfo('https://shimo.im/docs/WhYT8D9VQgjRGWJ6#anchor-J6Ve')">
            <span class="text">如何注册企业微信？企业微信注册常见问题</span>
            <span>></span>
          </li>
          <li @click="goQuestionInfo('https://shimo.im/docs/WhYT8D9VQgjRGWJ6#anchor-tstL')">
            <span class="text">如何创建企业微信自建应用？</span>
            <span>></span>
          </li>
          <li @click="goQuestionInfo('https://shimo.im/docs/WhYT8D9VQgjRGWJ6#anchor-n6Ja')">
            <span class="text">如何进行【微信支付】的相关配置？</span>
            <span>></span>
          </li>
          <li @click="goQuestionInfo('https://shimo.im/docs/WhYT8D9VQgjRGWJ6#anchor-bygB')">
            <span class="text">关于企业微信客户朋友圈的那点事</span>
            <span>></span>
          </li>
          <li @click="goQuestionInfo('https://shimo.im/docs/WhYT8D9VQgjRGWJ6#anchor-BEgs')">
            <span class="text">社群变“死群” 教你如何起死回生【教程向】</span>
            <span>></span>
          </li>
        </ul>
      </div>
      <div class="contact">
        <div class="title">联系我们</div>
        <div class="contact-way">
          <div class="item">
            <img src="~@/assets/homePage/erwenma2.png" alt="">
            <p>企业微信（推荐）</p>
          </div>
          <div  class="item">
            <img src="~@/assets/homePage/erweima1.png" alt="">
            <p>云美来</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      time: new Date().getHours(),
      dateTime: "",
      package_name: '免费套餐'
    }
  },
  mounted() {
    this.getValidateTime();
  },
  methods:{
    goNewPage(link){
      if (this.checkPower(link)){
        this.$router.push("/" + link);
      }else{
        this.$message.warning("您没有权限,请联系管理员")
      }
    },
    getValidateTime() {
      axios.post("/menu/get-menu-list").then( res => {
        console.log(res)
        this.dateTime = res.data.data.package_endtime
        this.package_name = res.data.data.package_name
      })
    },
    goYunmeilai(){
      window.open('http://www.wemero.cn/')
    },
    goQuestionInfo(link){
      window.open(link)
    },
    //判断权限
    checkPower(link) {
      let menuList = this.$store.state.menuData;
      return menuList.some( menuListItem => {
        return  menuListItem.some(menu => {
          if (menu.link==link) {
            return true
          } else {
           return  menu.children.some( menuChild => menuChild.link==link)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  .yunmeilai {
    padding:24px;
    background:#fff;
  }
  .welcome {
    color:#330000;
    font-size: 14px;
    line-height: 30px;
  }
  .welcome .time {
    color: #333;
    font-size: 18px;
    font-weight: bold;
    margin-right: 5px;
  }
  .title{
    font-size: 14px;
    color: #222;
    font-weight: bold;
  }
  .container {
    display: flex;
    margin-top:20px;
  }
  .entrance ul{
    margin: 0;
    padding: 0;
    display: flex;
    width: 536px;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .entrance li{
    width:256px;
    height: 90px;
    border-radius: 8px;
    border: 1px solid #DCDCDC;
    color: #333;
    font-size: 18px;
    line-height: 90px;
    padding: 0 28px;
    cursor: pointer;
  }
  .entrance li img {
    width:24px;
    height: auto;
    margin-right: 12px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .container{
    display: flex;
    justify-content: space-between;
  }
  .version, .contact{
    width:376px;
  }
  .version .top{
    display: flex;
    justify-content: space-between;
  }
  .version .type{
    display: inline-block;
    background: #04B065;
    color: #fff;
    border-radius: 2px;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    padding: 0 8px;
  }
  .version .time{
    color: #797979;
    font-size: 12px;
    line-height: 22px;
    margin-left: 8px;
  }
  .version .top-l {
    display: flex;
  }
  .more {
    color:#00AF63;
    font-size: 14px;
    cursor: pointer;
  }
  .version .ant-carousel{
    width: 100%;
    height: 160px;
    margin-top: 20px;
  }
  .version .disc{
    color: #797979;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .qustion{
    width: 536px;
  }
  .qustion .top{
    display: flex;
    justify-content: space-between;
  }
  .qustion ul{
    width: 100%;
    margin-top: 16px;
    margin: 0;
    padding: 0;
  }
  .qustion ul li{
    height:36px;
    line-height: 36px;
    color: #666666;
    font-size: 12px;
    border-bottom:1px solid #DCDCDC;
    display: flex;
    justify-content: space-between;
    padding-right: 8px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .qustion ul li .text{
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .contact-way {
    padding: 0 56px;
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
  .contact-way .item img{
    width: 100px;
    height: 100px;
  }
  .contact-way .item p{
    color: #797979;
    font-size: 12px;
    text-align: center;
    line-height: 12px;
    margin-top: 8px;
  }
  .banner-box {
    width: 376px;
    height: 161px;
  }
  .banner-box img {
    width: 100%;
    height: 100%;
  }
</style>