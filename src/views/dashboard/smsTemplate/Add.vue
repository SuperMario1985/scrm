<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout>
				<!-- 头部 -->
				<a-layout-header>
					新建模版申请
					<router-link to="/smsTemplate/list" style="font-size: 16px;float: right;margin-right: 15px;">
						<a-button type="primary" >返回列表</a-button>
					</router-link>
				</a-layout-header>
				<a-layout style class="fans-content">
					<!-- 左侧 -->
					<a-layout-sider>
						<div style="border:1px solid #E2D6D6;margin:auto;height:100%;width:100%;background:#FAFAFA;box-sizing: content-box;overflow-y: auto;" >
							<img src="../../../assets/wxHeader.png" alt style="width:100%;border-bottom:1px solid #E2D6D6;"/>
							<div style="padding-top: 20px;padding-left: 20px;" v-show="template_content.length > 0">
								<span>字数：<span style="padding:0px;color:#40a9ff; ">{{template_content.length + sign_title.length + 6}}</span>
								</span>
								<span style="float: right;margin-right: 20px;">短信按<span style="color:#40a9ff;">66</span>字/条</span>
							</div>
							<div style="padding: 20px;overflow: hidden;" v-show="template_content.length > 0">
								<div style="padding: 10px;background-color: #E6E6FA;border-radius: 5px;">
									<span class="item-info msg_content_txt"><p>【{{sign_title}}】{{template_content}} 回T退订</p></span>
								</div>
							</div>
						</div>
					</a-layout-sider>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content">
							<div class="content-bd">
								<a-form>
									<!-- 短信签名 -->
									<a-form-item label="短信签名" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="padding-top: 15px;" >
										<a-select v-model="sign_id" style="width: 150px;margin-right:15px;" @change="changeSignId" >
											<template v-for="(item,index) in signArr" style="display: inline-block;">
												<a-select-option :value="item.id" @click="changeSign(item.title)">{{item.title}}</a-select-option>
											</template>
										</a-select>
									</a-form-item>
									<!-- 发送场景 -->
									<a-form-item label="发送场景" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="padding-top: 15px;" >
										<template v-for="(item,index) in typeArr" style="display: inline-block;">
											<a-radio-group @change="changeType(item.id)" v-model="type_id" >
												<a-radio-button :value="item.id">
													<div style="text-align: center;">{{item.title}}</div>
												</a-radio-button>
											</a-radio-group>
										</template>
									</a-form-item>
									<!-- 短信模版内容 -->
									<a-form-item label="短信模版内容" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="padding-top: 15px;" >
										<a-select v-model="template_id" style="width: 400px;margin-right:15px;" >
											<template v-for="(item,index) in templateArr" style="display: inline-block;">
												<a-select-option :value="item.id" @click="changeContent(item.content)" >{{item.content}}</a-select-option>
											</template>
										</a-select>
									</a-form-item>
									<!-- 短信内容 -->
									<a-form-item label="短信内容" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="padding-top: 15px;">
										<a-textarea style="height: 110px;border: 1px solid #d9d9d9;resize: none;width: calc(100% - 250px);" placeholder="请填写短信内容" v-model="template_content" :maxLength="250" :autosize="false"/>
										<div style="overflow: hidden;width: calc(100% - 250px);">
											<span style="float:right;color: #F56C6C">{{template_content.length}} / 250</span>
										</div>
										<div class="content-msg">
											<p style="margin-bottom: 0px;line-height: 25px;">模板内容填写注意：</p>
											<p style="margin-bottom: 0px;line-height: 25px;">1、禁止发送金融、地产、教育、招聘、股票、相关的所有内容。</p>
											<p style="margin-bottom: 0px;line-height: 25px;">2、验证码以及系统通知类短信不支持营销内容。</p>
											<p style="margin-bottom: 0px;line-height: 25px;">3、营销推广短信不支持给非会员用户发送营销短信；</p>
											<p style="margin-bottom: 0px;line-height: 25px;">4、链接前后需加空格，以保证手机短信能够正常接收。</p>
											<p style="margin-bottom: 0px;line-height: 25px;">5、营销短信发送时间：每日9：00-20:00，尽量避免夜间发送，减少用户投诉。</p>
											<p style="margin-bottom: 0px;line-height: 25px;">6、营销短信类型系统会在短信末尾统一添加“退订回T”。</p>
										</div>
										<div style="height: 20px;border-bottom: 1px solid #E0E0E0;"></div>
										<div style="margin-top: 15px;">
											<a-button type="primary" @click="createdMsg">提交模版申请</a-button>
										</div>
									</a-form-item>
								</a-form>
							</div>
						</div>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				isLoading       : false, //Loading 组件显示与隐藏
				isAddLoading  : false, //Loading 组件显示与隐藏
				signArr         : [], //短信签名
				typeArr         : [], //发送场景
				templateArr     : [], //短信内容数据
				sign_id         : "", //短信签名id
				sign_title      : "", //短信签名名称
				type_id         : "", //发送场景id
				template_id     : "", //短信内容id
				template_content: "", //短信内容
			};
		},

		methods: {
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//选择签名
			changeSignId (id) {
				this.sign_id = id;
				this.changeTemplate(this.sign_id,this.type_id);
			},
			//选择签名
			changeSign (title) {
				this.sign_title = title;
			},
			//选择发送场景
			changeType (id) {
				this.type_id = id;
				this.changeTemplate(this.sign_id,id);
			},
			//修改发送场景获取模版内容
			async changeTemplate (sign_id,type_id) {
				const {data: res} = await this.axios.post("short-message/get-template", {
					uid : localStorage.getItem("uid"),
					sign_id : sign_id,
					type_id : type_id,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.templateArr = res.data.templateArr;
					if(this.templateArr.length > 0){
						this.template_id = this.templateArr[0].id;
						this.template_content = this.templateArr[0].content;
					}else{
						this.template_id = '';
						this.template_content = '';
					}
				}
			},
			changeContent(content){
				this.template_content = content;
			},
			// 分页
			changePage (page, pageSize) {
				this.getPhone(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getPhone(1, pageSize);
			},
			//确定并创建消息
			async createdMsg () {
				if (this.sign_id == '') {
					this.$message.error('请选择短信签名！');
					return false;
				}
				if (this.type_id == '') {
					this.$message.error('请选择发送场景！');
					return false;
				}
				if (this.template_content == '') {
					this.$message.error('请填写短信内容！');
					return false;
				}
				this.isLoading = true;
				const {data: res} = await this.axios.post("short-message/add-template", {
					uid        : localStorage.getItem("uid"),
					sign_id    : this.sign_id,
					type_id    : this.type_id,
					template_id: this.template_id,
					content    : this.template_content
				});
				if (res.error == 0) {
					this.isLoading = false;
					this.$message.success("创建成功");
					this.$router.push("/smsTemplate/list?isRefresh=1")
				} else {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				}
			},
			//获取短信群发所需数据
			async getAccount () {
				const {data: res} = await this.axios.post("short-message/push-data", {
					uid : localStorage.getItem("uid"),
				});
				// console.log(res)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.signArr = res.data.signArr;
					if(this.signArr.length > 0){
						this.sign_id = this.signArr[0].id;
						this.sign_title = this.signArr[0].title;
					}
					this.typeArr = res.data.typeArr;
					if(this.typeArr.length > 0){
						this.type_id = this.typeArr[0].id;
					}
					this.templateArr = res.data.templateArr;
					if(this.templateArr.length > 0){
						this.template_id = this.templateArr[0].id;
						this.template_content = this.templateArr[0].content;
					}else{
						this.template_id = '';
						this.template_content = '';
					}
				}
			},

		},
		created () {
			this.getAccount();
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 100px;
		height: 25px;
		line-height: 23px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .ant-col-20 {
		margin-left: 15px;
	}

	#components-layout-demo-basic {
		.ant-layout-sider {
			background: #FFF;
			flex: 0 0 380px !important;
			max-width: 380px !important;
			min-width: 380px !important;
			width: 380px !important;
			border-right: 1px solid #E2E2E2;
			padding: 20px 0;
		}
	}

	#components-layout-demo-basic .ant-layout-content {
		min-width: 885px;
		width: 100%;
		position: relative;
	}

	.content {
		border: 1px solid #E2E2E2;
		min-width: 885px;
		position: absolute;
		top: 20px;
		left: 20px;
		right: 20px;
		background-color: #fafafa;
		margin-bottom: 20px;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
		height: 100%;
	}

	.list {
		height: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: absolute;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.content-hd {
		height: 80px;
		padding: 20px 0;
		border-bottom: 1px solid #E2E2E2;
	}

	.changeType {

	}

	.content-bd {
		background: #FAFAFA;
		padding: 20px;
	}

	.audio {
		width: 100%;
		height: 65px;
		padding: 10px 20px;
	}

	.box {
		float: right;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
		border: 2px solid #01b065;
	}

	.wifi-symbol {
		width: 30px;
		height: 30px;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(135deg);
		position: absolute;
		left: 13px;
		top: 6px;
	}

	.wifi-circle {
		border: 2px solid #01b065;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 5px;
		height: 5px;
		background: #01b065;
		top: 25px;
		left: 25px;
	}

	.second {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
	}

	.third {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
	}

	.second1 {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
		animation: fadeInOut 1s infinite 0.2s;
	}

	.third1 {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
		animation: fadeInOut 1s infinite 0.4s;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	.changeType-text {
		background: @color-bgc;
		border: 1px solid @border-color;
		border-radius: 2px;
		padding: 7px 27px 6px 10px;
		font-size: 12px;
		color: #1A1A1A;
		width: 100%;
		margin-top: 12px;
		max-width: 673px;
		line-height: 20px;
	}

	.changeFans {
		background: #FFFFFF;
		border: 1px solid #D8D8D8;
		padding: 12px 16px;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 5px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	i {
		font-style: normal;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			display: inline-block;
			word-break: break-word;
		}
	}

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		height: 110px;
		overflow: auto;
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	/deep/ .ant-tag {
		height: 26px;
		line-height: 25px;
	}
	/deep/ #components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		-webkit-box-flex: 0 !important;
		-ms-flex: 0 0 24% !important;
		flex: 0 0 24% !important;
		max-width: 24% !important;
		min-width: 24% !important;
		width: 24% !important;
		border-right: 1px solid #E2E2E2;
		padding: 20px 20px;
	}
	/deep/ .ant-col-3 {
		text-align: center;
	}
	.content-msg {
		width: calc(100% - 250px);
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 5px 10px;
		margin-top: 12px;
		text-align: left;
	}
</style>