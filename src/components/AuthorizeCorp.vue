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
          <img src="../assets/corpAuthorize/1.png" alt />
          <p class="txt-1">企业微信CRM</p>
          <p class="txt-2">深度客户管理，挖掘客户价值，洞察客户行为，高效跟进客户</p>
        </li>
        <li>
          <img src="../assets/corpAuthorize/2.png" alt />
          <p class="txt-1">营销引流</p>
          <p class="txt-2">利用企业微信沉淀私域流量，裂变获客</p>
        </li>
        <li>
          <img src="../assets/corpAuthorize/3.png" alt />
          <p class="txt-1">企业微信社群运营</p>
          <p class="txt-2">完善的企业微信群功能，包括自动拉群群营销、群管理及群分析等</p>
        </li>
        <li>
          <img src="../assets/corpAuthorize/4.png" alt />
          <p class="txt-1">渠道活码</p>
          <p class="txt-2">灵活排班、分析渠道质量、分时段欢迎语及自动标签等，实现客户精准化管理</p>
        </li>
        <li>
          <img src="../assets/corpAuthorize/5.png" alt />
          <p class="txt-1">聊天增强侧边栏功能</p>
          <p class="txt-2">在聊天侧边栏看客户画像、客户轨迹及订单记录等，同时可将话术素材一键发给客户</p>
        </li>
        <li>
          <img src="../assets/corpAuthorize/6.png" alt />
          <p class="txt-1">会话存档功能</p>
          <p class="txt-2">通过企业微信会话存档监控管理，降低风险，分析工作量</p>
        </li>
      </ul>
      <div class="addAccount-footer">
<!--        <a-checkbox @change="onChangeCheck" class="checkbox">-->
<!--          授权即表示知晓并同意-->
<!--          <a href="https://support.qq.com/products/104790/faqs/57072" target="_blank">《授权相关事项和风险》</a>-->
<!--        </a-checkbox>-->
<!--        :disabled="disabled"-->
        <a-button type="primary" class="aButton" @click="authorize">立即授权</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  export default {
    name: "authorizeCorp",
    props: {
      show: {
        type: Boolean,
        default: false
      },
      cnfId: {
        type: Number,
        default: 0,
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
        let cnfId = this.cnfId != 0 ? this.cnfId : this.$store.state.sid;
        let uid = localStorage.getItem("uid");
        let redirctUri = encodeURIComponent(this.$store.state.siteUrl + "/agent/list");
        window.open(
                `${this.commonUrl}/work-bind/index?cnf_id=${cnfId}&uid=${uid}&redirect_uri=${redirctUri}&auth_type=0`,
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
      },
      cnfId (newValue,old) {
        this.cnfId = newValue;
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
      height: 109px;
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
    margin-top: 56px;

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