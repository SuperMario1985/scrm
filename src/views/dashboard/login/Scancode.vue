<template>
  <div class="login">
    <div class="login-header">
      <div class="login-header-left">
        <a href="/home" class="login-header-left-img">
          <img src="../../../assets/logo.png" alt="" />
        </a>
        <span class="login-header-left-line"></span>
        <span class="login-header-left-login">首页</span>
      </div>
      <a href="/register" class="login-header-right" style="color:#01b065">免费注册</a>
    </div>
    <div class="login-swiper">
      <!-- <img src="../../../assets/login_head.png" alt=""> -->
    </div>
    <div class="login-body">
      <div class="one">
        <span class="one-txt">微信二维码登录</span>
        <span class="one-paopao" @click="taggerLogin">
          <img src="../../../assets/suo.png" alt="">
          密码登录
        </span>
        <span class="one-erweima" @click="taggerLogin">
          <img src="../../../assets/computer.png" alt="">
        </span>
      </div>
      <div class="ma">
        <img src="../../../assets/ma.png" alt="">
      </div>
      <p class="txt">
        请使用微信扫码二维码登录
      </p>
    </div>
<!--    <div class="footer">-->
<!--      Copyright © 安徽小猪科技有限公司 All Rights Reserved-->
<!--    </div>-->
  </div>
</template>

<script>
  export default {

    data() {
      return {

      }
    },

    methods: {
      taggerLogin(){
        this.$router.push({ path:'/login'})
      }
    },


    created() {
    }
  }
</script>

<style lang='less' scoped>
  .login {
    width: 100%;
    height: 100%;
    min-width: 1200px;
    overflow-y: auto;
  }

  .login-header {
    width: 100%;
    height: 78px;
    padding-top: 24px;
  }

  .login-header-left {
    height: 31px;
    margin-left: 18.5%;
    float: left;

    img {
      height: 31px;
      width: auto;
    }
  }

  .login-header-left-img {
    float: left;
    height: 31px;
    width: auto;
  }

  .ma {
    width: 280px;
    height: 280px;

    img {
      width: 100%;
      height: 100%;
      margin-left: 50%;
      margin-top: 50%;
      transform: translate(-25%, -30%)
    }
  }


  .login-header-left-line {
    width: 1px;
    height: 20px;
    background-color: #dfdfdf;
    display: inline-block;
    margin: 6px 15px 5px 19px;
    float: left;
  }

  .login-header-left-login {
    height: 17px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    line-height: 30px;
    color: #666666;
    float: left;
  }

  .login-header-right {
    width: 72px;
    height: 17px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    line-height: 30px;
    color: #4c69fc;
    cursor: pointer;
    float: right;
    margin-right: 18.5%;
  }

  .login-swiper {
    width: 100%;
    height: 100px;
    background-image: url('../../../assets/background.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding-top: 8px;

    img {
      width: 482px;
      height: 59px;
      margin: 0 auto;
      margin-top: 15px;
      display: block;
    }
  }

  .login-body {
    width: 435px;
    height: 455px;
    margin: 0 auto;
    margin-top: 94px;
  }

  .one {
    height: 52px;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
  }

  .one-txt {
    height: 52px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    line-height: 54px;
    letter-spacing: 0px;
    color: #01b065;
    float: left;
    border-bottom: 2px solid #01b065;
  }

  .one-erweima {
    cursor: pointer;
    img {
      width: 52px;
      height: 52px;
      float: right;
    }
  }

  .one-paopao {
    cursor: pointer;
    width: 120px;
    height: 35px;
    background-color: #ffb637;
    border-radius: 4px;
    display: inline-block;
    position: absolute;
    right: 50px;
    top: 10px;
    color: #fff;
    font-size: 14px;
    box-sizing: border-box;
    padding-top: 6px;

    img {
      margin-left: 20px;
    }
  }

  .one-paopao::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: #ffb637;
    display: inline-block;
    transform: rotate(45deg);
    position: absolute;
    right: -5px;
    top: 10px;
  }

  .txt {
    width: 100%;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #999999;
    margin-top: 75px;
  }

  .footer {
    text-align: center;
    width: 100%;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 22px;
    letter-spacing: 0px;
    color: #9e9e9e;
    margin-top: 30px;
  }
</style>