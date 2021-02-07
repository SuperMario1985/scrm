<template>
  <div>
    <!-- 点击添加公众号弹窗 -->
    <a-modal v-model="showModal" width="750px" @cancel="handleCancel" @ok="handleOk" title="添加企业微信号">
      <!-- 企业名称 -->
      <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="padding-top: 15px;" >
        <span slot="label">
          <span style="color: red;"> * </span>企业名称
        </span>
        <a-input v-model="corp_name" style="width: calc(100% - 60px)" placeholder="请输入企业名称" />
      </a-form-item>
      <!-- 企业ID -->
      <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="padding-top: 15px;" >
					<span slot="label">
	                    <span style="color: red;"> * </span>企业ID（CorpID）
	                </span>
        <a-input v-model="corpid" style="width: calc(100% - 60px)" placeholder="请输入企业ID" :maxLength="20" />
		<div>
			<a target="_blank" href="https://support.qq.com/products/104790/faqs/61151">如何获取CorpId？</a>
		</div>
      </a-form-item>
      <!-- 通讯录管理secret -->
      <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="padding-top: 15px;" >
					<span slot="label">
	                    <span style="color: red;"> * </span>通讯录管理secret
	                </span>
        <a-input v-model="book_secret" style="width: calc(100% - 60px)" placeholder="请输入通讯录管理secret" />
		<div>
			<a target="_blank" href="https://support.qq.com/products/104790/faqs/61151">如何获取secret？</a>
		</div>
      </a-form-item>
      <!-- 外部联系人管理secret -->
      <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="padding-top: 15px;padding-bottom: 15px;" >
					<span slot="label">
	                    <span style="color: red;"> * </span>外部联系人管理secret
	                </span>
        <a-input v-model="external_secret" style="width: calc(100% - 60px)" placeholder="请输入外部联系人管理secret" />
		<div>
			<a target="_blank" href="https://support.qq.com/products/104790/faqs/61151">如何获取secret？</a>
		</div>
      </a-form-item>
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
        corp_name:'',//企业名称
        corpid:'',//企业ID
        book_secret:'',//通讯录管理
        external_secret:'',//外部联系人管理
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
      async handleOk(){
        if (this.corp_name == '') {
          this.$message.error('请输入企业名称！');
          return false;
        }
        if (this.corpid == '') {
          this.$message.error('请输入企业ID！');
          return false;
        }
        if (this.book_secret == '') {
          this.$message.error('请输入通讯录管理secret！');
          return false;
        }
        if (this.external_secret == '') {
          this.$message.error('请输入外部联系人管理secret！');
          return false;
        }
        const {data: res} = await this.axios.post("work-corp/bind", {
          uid            : localStorage.getItem("uid"),
          corpid         : this.corpid,
          corp_name      : this.corp_name,
          book_secret    : this.book_secret,
          external_secret: this.external_secret,
        });
        if (res.error != 0) {
          this.$message.error(res.error_msg);
        } else {
          this.showModal = false;
          this.$message.success('操作成功');
          location.reload()
        }
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


</style>