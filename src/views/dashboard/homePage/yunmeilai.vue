<template>
  <div class="yunmeilai">
    <div class="welcome"><span class='time'>{{time>11?'下午':'上午'}}好</span>欢迎使用云美来SCRM系统</div>
    <div class="container">
      <div class="entrance">
        <div class="title">常用入口</div>
        <ul>
          <li @click="goNewPage(1)">
            <img src="~@/assets/homePage/qiyeweixin.png" alt="">
            <span>授权企业微信</span>
          </li>
          <li @click="goNewPage(2)">
            <img src="~@/assets/homePage/gongzhonghao.png" alt="">
            <span>授权公众号</span>
          </li>
          <li style="margin-top:24px;" @click="goNewPage(3)">
            <img src="~@/assets/homePage/tianjiachengyuan.png" alt="">
            <span>添加成员</span>
          </li>
          <li style="margin-top:24px;" @click="goNewPage(4)">
            <img src="~@/assets/homePage/zhanghaoshezhi.png" alt="">
            <span>账号设置</span>
          </li>
        </ul>
      </div>
      <div class="version">
        <div class="top">
          <div class="top-l">
            <div class="title">当前版本：</div>
            <span class="type">旗舰版</span>
            <span class="time">{{dateTime}}到期</span>
          </div>
          <div class="more">更多帮助></div>
        </div>
        <a-carousel autoplay>
          <div><h3>1</h3></div>
          <div><h3>2</h3></div>
          <div><h3>3</h3></div>
        </a-carousel>
        <div class="disc">决胜双十一！微博2020「U微计划」全新合作亮相</div>
      </div>
    </div>
    <div class="container">
      <div class="qustion">
        <div class="top">
          <div class="title">常见问题</div>
          <div class="more">更多帮助></div>
        </div>
        <ul>
          <li>
            <span class="text">为什么同步通讯录的时候提示“企业微信未认证，同步失败”？</span>
            <span>></span>
          </li>
          <li>
            <span class="text">添加客户的时候可以通知同事么，我们公司需要通知上级。</span>
            <span>></span>
          </li>
          <li>
            <span class="text">为什么同步通讯录的时候提示“企业微信未认证，同步失败”？</span>
            <span>></span>
          </li>
          <li>
            <span class="text">如何群发消息？群发消息有什么限制？</span>
            <span>></span>
          </li>
          <li>
            <span class="text">公众号提示权限不足需要重新授权，如何重新授权？</span>
            <span>></span>
          </li>
        </ul>
      </div>
      <div class="contact">
        <div class="title">联系我们</div>
        <div class="contact-way">
          <div class="item">
            <img src="~@/assets/homePage/erweima1.png" alt="">
            <p>企业微信（推荐）</p>
          </div>
          <div  class="item">
            <img src="~@/assets/homePage/erwenma2.png" alt="">
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
      dateTime: ""
    }
  },
  mounted() {
    this.getValidateTime();
  },
  methods:{
    goNewPage(type){
      this.$store.dispatch('changeMenu',2);
      setTimeout(()=>{
        switch(type) {
          case 1:
            this.$router.push("/wechatManagement")
            break;
          case 2:
            this.$router.push("/account")
            break;
          case 3:
            this.$router.push("/staff/list")
            break;
          case 4:
            this.$router.push("/user/userUpdate")
            break;
        } 
      },200)
    },
    getValidateTime() {
      axios.post("/menu/get-menu-list").then( res => {
        console.log(res)
        this.dateTime = res.data.data.package_endtime
      })
    },
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
</style>