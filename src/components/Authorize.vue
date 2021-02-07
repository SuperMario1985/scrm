<template>
  <div>
    <!-- 点击添加公众号弹窗 -->
    <a-modal v-model="showModal" style="top: 65px;" :footer="null" width="984px" @cancel="handleCancel">
      <div class="addAccount-head">
        <p>授权后管理更高效</p>
        <p>仅支持认证号授权</p>
      </div>
      <ul class="addAccount-body">
        <li>
          <img src="//s.weituibao.com/static/1545879105817/3.png" alt />
          <p class="txt-1">多账号同时管理</p>
          <p class="txt-2">同时登录多个公众号、一键切换，无需重复扫码</p>
        </li>
        <li>
          <img src="//s.weituibao.com/static/1545879105817/2.png" alt />
          <p class="txt-1">一键同步素材</p>
          <p class="txt-2">一键同步到多个公众号，无需重复编辑</p>
        </li>
        <li>
          <img src="//s.weituibao.com/static/1545879105817/5.png" alt />
          <p class="txt-1">数据实时更新</p>
          <p class="txt-2">粉丝数据实时更新，图文详情及时分析</p>
        </li>
        <li>
          <img src="//s.weituibao.com/static/1545879105817/1.png" alt />
          <p class="txt-1">素材编辑更顺畅</p>
          <p class="txt-2">一键抓取图文、添加模版、精选样式排版</p>
        </li>
        <li>
          <img src="//s.weituibao.com/static/1545879105817/6.png" alt />
          <p class="txt-1">多样化推送</p>
          <p class="txt-2">素材定时定向推送&客服消息，服务号可以发送模版消息</p>
        </li>
        <li>
          <img src="//s.weituibao.com/static/1545879105817/4.png" alt />
          <p class="txt-1">发送预览即视</p>
          <p class="txt-2">可随时发送到微信预览，避免发送后再纠正</p>
        </li>
      </ul>
      <div class="addAccount-footer">
        <a-checkbox @change="onChangeCheck" class="checkbox">
          授权即表示知晓并同意
          <a href="https://support.qq.com/products/104790/faqs/57072" target="_blank">《授权相关事项和风险》</a>
        </a-checkbox>
        <a-button type="primary" class="aButton" :disabled="disabled" @click="authorize">立即授权</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  export default {
    name: "authorize",
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        disabled: true, //授权按钮
        commonUrl:this.$store.state.commonUrl,//公共的链接
      };
    },
    computed: {
      showModal:{
        get: function() {
          return this.show
        },
        set: function(val) {
        }
      }
    },
    methods: {
      //授权同意
      onChangeCheck(e) {
        //   console.log(e.target.checked);
        if (e.target.checked == true) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      },
      //点击按钮立即授权
      authorize() {
        let uid = localStorage.getItem("uid");
        let redirctUri = this.$store.state.siteUrl + "/fans/list";
        window.open(
                `${this.commonUrl}/bind/index?uid=${uid}&cnf_id=1&redirect_uri=${redirctUri}`,
                "_blank"
        );
      },
      handleCancel(){
        this.$emit('cancel')
      }
    },

    watch: {
      show (newValue,old) {
        this.showModal = newValue;
      }
    },

    created() {}
  };
</script>

<style lang='less' scoped>
  .addAccount-head {
    height: 105px;
    overflow: hidden;

    p:nth-child(1) {
      font-size: 20px;
      color: #333;
      text-align: center;
      margin: 32px 0 10px;
    }

    p:nth-child(2) {
      font-size: 14px;
      color: #666;
      text-align: center;
    }
  }

  .addAccount-body {
    height: 298px;
    padding: 0;

    li {
      background-color: #f5f7ff;
      width: 49.5%;
      height: 94px;
      float: left;
      margin-bottom: 8px;
      border-radius: 4px;
      border: solid 1px #c9daff;

      img {
        width: 48px;
        height: 48px;
        margin: 23px 25px;
        float: left;
      }

      .txt-1 {
        font-size: 16px;
        color: #1a1a1a;
        margin: 22px 0 6px;
      }

      .txt-2 {
        font-size: 14px;
        color: #767676;
      }
    }

    li:nth-child(1),
    li:nth-child(3),
    li:nth-child(5) {
      margin-right: 8px;
    }
  }

  .addAccount-footer {
    height: 60px;
    background-color: #f2f2f2;
    padding: 0 50px;
    line-height: 60px;
    margin-top: 10px;

    .checkbox {
      color: #5d5d5d;
      font-size: 14px;
      border-top: 1px solid #e9eae9;
      float: left;
    }

    .aButton {
      float: right;
      margin-top: 14px;
    }
    .aButton[disabled] {
      color: #C0C0C0;
      border: 1px solid #C0C0C0;
    }
  }

</style>