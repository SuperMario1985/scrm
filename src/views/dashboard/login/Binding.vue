<template>
  <div class="login">
    <div class="login-header">
      <div class="login-header-left">
        <a href="/home" class="login-header-left-img">
          <img src="../../../assets/logo.png" alt="" />
        </a>
        <span class="login-header-left-line"></span>
        <a href="/forgetPass" class="login-header-left-login">忘记密码</a>
      </div>
      <div class="login-header-right">已有账号，<a href="#">登录</a></div>
    </div>
    <div class="login-swiper">
      <img src="../../../assets/login_head.png" alt="">
    </div>
    <div class="login-body">
      <div class="message">
        <a-avatar :size="46" icon="user" class="avatar" />
        <span class="data">hi，微信昵称！完成绑定后更安全</span>
      </div>
      <a-card style="width:100%" :tabList="tabListNoTitle" :activeTabKey="noTitleKey"
        @tabChange="key => onTabChange(key, 'noTitleKey')">
        <div v-if="noTitleKey === 'article'">
          <div class="two" :class="isActive ? 'border-blue' : 'border-grey'" @focusin="inDiv" @focusout="outDiv">
            <span>手机号码</span>
            <input type="text" placeholder="请输入手机号码">
          </div>
          <div class="three" :class="isActive2 ? 'border-blue' : 'border-grey'" @focusin="inDiv2" @focusout="outDiv2">
            <span>登录密码</span>
            <input type="text" placeholder="请输入密码">
          </div>
        </div>
        <div v-if="noTitleKey === 'app'">
          <div class="two" :class="isActive ? 'border-blue' : 'border-grey'" @focusin="inDiv" @focusout="outDiv">
            <span>手机号</span>
            <input type="text" placeholder="请输入手机号">
          </div>
          <div class="three" :class="isActive2 ? 'border-blue' : 'border-grey'" @focusin="inDiv2" @focusout="outDiv2">
            <span>验证码</span>
            <input type="text" placeholder="请填写验证码">
          </div>
          <div class="password" :class="isActive3 ? 'border-blue' : 'border-grey'" @focusin="inDiv3" @focusout="outDiv3">
            <span>设置密码</span>
            <input type="text" placeholder="请填写6-20位密码">
            <a-button type="link" class="getpassword">获取验证码</a-button>
          </div>
        </div>
      </a-card>
      <a-button type="primary" block class="login-button">绑定</a-button>
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
        isActive: false,//控制输入框下底边是否变蓝
        isActive2: false,//控制输入框下底边是否变蓝
        isActive3: false,//控制输入框下底边是否变蓝
        //one中切换
        tabListNoTitle: [{
          key: 'article',
          tab: '已有账号请绑定',
        }, {
          key: 'app',
          tab: '暂无账号，请完善',
        }],
        key: 'tab1',
        noTitleKey: 'article',
      }
    },

    methods: {
      //点击输入框，外部div下边框变蓝
      inDiv: function (event) {
        this.isActive = true
      },
      outDiv: function (event) {
        this.isActive = false
      },
      inDiv2: function (event) {
        this.isActive2 = true
      },
      outDiv2: function (event) {
        this.isActive2 = false
      },
      inDiv3: function (event) {
        this.isActive3 = true
      },
      outDiv3: function (event) {
        this.isActive3 = false
      },
      onTabChange(key, type) {
        console.log(key, type)
        this[type] = key
      },
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
    height: 17px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    line-height: 30px;
    color: #666;
    cursor: pointer;
    float: right;
    margin-right: 18.5%;
  }

  .login-swiper {
    width: 100%;
    height: 100px;
    background-image: url('../../../assets/background.png');
    background-size: 100%;
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
    position: relative;
  }

  .message {
    width: 100%;
    height: 76px;
    background-color: #f1f0f3;
    padding-top: 16px;
    box-sizing: border-box;
    margin-bottom: 30px;

    .avatar {
      margin-left: 80px;
    }

    .data {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      line-height: 22px;
      color: #333333;
      margin-left: 20px;
    }
  }


  .two,
  .three,
  .password {
    height: 60px;
    width: 350px;
    margin-top: 45px;
    margin-left: 42.5px;

    span {
      line-height: 60px;
      float: left;
    }

    input {
      float: right;
      width: 280px;
      height: 58px;
      border: none;
    }

    input:focus {
      outline: none;
    }
  }

  ::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #cacaca;
  }

  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #cacaca;
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #cacaca;
  }

  .border-blue {
    border-bottom: 2px solid #4c69fc !important;
  }

  .border-grey {
    border-bottom: 1px solid #e5e5e5 !important;
  }


  .login-button {
    height: 52px;
    width: 350px;
    background-color: #4c69fc;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    display: block;
    margin: 0 auto;
    margin-top: 50px;
  }

  .login-button:hover,
  .ant-btn-primary:focus {
    border-color: #4c69fc !important;
    background-color: #4c69fc !important;
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
    margin-top: 145px;
  }
  /deep/.ant-tabs-nav .ant-tabs-tab {
    margin: 0 83px 0 0;
  }
  /deep/.ant-tabs .ant-tabs-large-bar .ant-tabs-tab {
    width: 175px;
    text-align: center;
  }
  /deep/.ant-card-body {
    padding: 0;
  }
  /deep/.ant-card-bordered {
    border: 0;
  }
  /deep/.ant-card-head {
    padding: 0;
  }
  .getpassword {
    position: absolute;
    right: 40px;
    bottom: 14px;
  }
</style>