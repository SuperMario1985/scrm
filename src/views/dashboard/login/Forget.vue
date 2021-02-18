<template>
	<div class="login">
		<div class="login-left">
			<div class="img"></div>
			<div class="text">
				<p>云 美 来 <span>SCRM</span> </p>
				<p>私 域 流 量 运 营 时 代 的 全 新 增 长 引 擎</p>
			</div>
		</div>
		<div class="login-right">
			<div class="content">
				<div class="top">
					<div class="back"><img src="~@/assets/logo_back.png" alt=""> 返回SCRM主页</div>
					<img src="~@/assets/login_logo.png" alt="">
				</div>
				<div class="form" >
					<div class="title">重置密码</div>
					<div class="register">已有账号？<a href="/login">立即登录</a></div>
					<a-form :form="form" v-show="flag">
						<a-form-item class="account">
							<a-input
							  v-decorator="[
									'account',
									{ rules: [{ required: true, validator: checkPhone,trigger:'blur' }] },
								]"
							 @keyup.enter="nextStep"
							 placeholder="请输入用户手机号码"
							 ></a-input>
						</a-form-item>
						<a-form-item class="verify" v-show="flag3">
							<a-input
								 v-decorator="[
									'identifyCode',
									{ rules: [{ required: true, message: '请填写验证码!' }] },
								]"
							  placeholder="请输入验证码"
								type="text"
								@keyup="getIdentifyCode"
								@keyup.enter="nextStep"
								:maxLength="4"
							></a-input>
							<img :src="pic" alt="" @click="reloadPic">
						</a-form-item>
						<a-form-item class="verify">
							<a-input
								 v-decorator="[
									'code',
									{ rules: [{ required: true, message: '请填写验证码!' }] },
								]"
							  placeholder="请输入验证码"
								type="text"
								@keyup.enter="nextStep"
							></a-input>
							<a-button type="link" class="getcode" :disabled="disabled" @click="getCode">{{this.btnTitle}}</a-button>
						</a-form-item>
						<a-button type="primary" @click="submit" class="login-form-button">下一步</a-button>
					</a-form>
					<a-form :form="form2" v-show="flag2">
						<a-form-item v-if="accountList[0]">
							<a-select
							  size="large"
								showSearch
								:defaultValue="accountList[0].id"
								optionFilterProp="children"
								style="width: 100%;"
								@change="handleChange"
								:filterOption="filterOption"
						  >
								<a-select-option v-for="d in accountList" :key="d.id" :value="d.id">
									<template v-if="d.company_name == '' || d.company_name == null">{{d.account}}</template>
									<template v-if="d.company_name != ''">{{d.company_name}}</template>
									<template v-if="d.type == 1">（主账户）</template>
									<template v-if="d.type == 2">（子账户）</template>
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item class="password">
							<a-input
							  v-decorator="[
									'password',
									{ rules: [{ required: true, validator: checkPassWord,trigger:'blur' }] },
								]"
							 @keyup.enter="nextStep"
							 placeholder="请填写6-20位密码"
							 ></a-input>
						</a-form-item>
						<a-form-item class="password">
							<a-input
							  v-decorator="[
									'password2',
									{ rules: [{ required: true, validator: checkPassWord2,trigger:'blur' }] },
								]"
							 @keyup.enter="nextStep"
							 placeholder="请输入新的密码"
							 ></a-input>
						</a-form-item>
						<a-button type="primary" @click="confirm" class="login-form-button">完成</a-button>
					</a-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import MyIcon from "@/components/MyIcon.vue"
	import global from "../../../common/js/global";

	export default {
		components: {
			MyIcon
		},
		data () {
			return {
				form:this.$form.createForm(this, { name: 'form1' }),
				form2:this.$form.createForm(this, { name: 'form2' }),
				loginSpinning: false,
				pic            : '',//图形验证码图片
				btnTitle       : "获取验证码",
				password       : "", //密码
				password2      : "", //重复密码
				message      : "", //警告信息内容
				isShow       : false, //消息提示框的显示与隐藏
				token        : '',//登录状态
				flag:   true,
				flag2:  false,
				flag3          : false,//图形验证码行显示与隐藏
				redirectUrl  : '',//重新跳转链接
				disabled: true,
				accountList    : [],//账户列表
				isMasterAccount: '',//1子账户，2主账户
				sub_id         : '',//选择的账户id
			};
		},
		methods: {
			//判断是否显示 获取验证码 按钮
			getIdentifyCode () {
				let identifyCode = this.form.getFieldValue('identifyCode') || ''
				if (this.pic != '' && identifyCode.length == 4) {
					this.disabled = false
				}
			},
			checkPhone(rule, value, callback){
				 // 验证手机号
				 if(!value || !value.trim()){
					 callback("手机号码不能为空")
				 }
				let reg=/^1\d{10}$/
				if (!reg.exec(value)){

					callback("手机号码格式不正确")
				}else{
					callback()
					if(!this.pic){
						this.getAccount();
					}
				}
			},
			// 校验密码格式
			checkPassWord(rule, value, callback){
				if(!value.trim()){
					callback("密码不能为空")
				}
				if(value.length < 6 || value.length > 20){
					callback('请输入6-20位的密码')
				}
				callback();
			},
			// 校验再次输入密码的格式
			checkPassWord2(rule, value, callback){
				if(!value.trim()){
					callback("密码不能为空")
				}
				if(value.length < 6 || value.length > 20){
					callback('请输入6-20位的密码')
				}
				let password = this.form2.getFieldValue('password');
				if(password && password !== value){
					callback('请输入相同的密码');
				}
				callback();
			},
				//输入框判断手机号格式并请求图形验证码
			async getAccount () {
						// console.log('发送请求获取图形验证码')
						let account = this.form.getFieldValue('account')
						var {data: res} = await this.axios.post('login/identify-code', {
							account
						})
						if(!res.error){
							this.pic = res.data[0];
							this.flag3 = true
						}
			},
			//点击重新加载图形验证码
			async reloadPic () {
				let account = this.form.getFieldValue('account')
				if (this.pic != '') {
					var {data: res} = await this.axios.post('login/identify-code', {
						account
					})
					this.pic = res.data[0]
				}
			},
			//获取短信验证码
			async getCode () {
				let {account,identifyCode} = this.form.getFieldsValue();
				var {data: res} = await this.axios.post('login/get-code', {
					account,
					type        : 'forgetPwd',
					identifyCode
				})
				if (res.error == 0) {
					this.$message.destroy()
					this.$message.success('发送成功')
					//倒计时
					let time = 60;
					let timer = setInterval(() => {
						if (time == 0) {
							clearInterval(timer);
							this.disabled = false;
							this.btnTitle = "获取验证码";
						} else {
							this.btnTitle = time + '秒后重试';
							this.disabled = true;
							time--
						}
					}, 1000)
				} else {
					this.$message.destroy()
					this.$message.error(res.error_msg)
				}
			},
				// 提交表单
			submit(){
				this.form.validateFields(err => {
					if (!err) {
						this.nextStep();
					}
				});
			},
			//下一步进入设置密码页面
			async nextStep () {
				let {account,identifyCode,code} = this.form.getFieldsValue();

				var {data: res} = await this.axios.post('login/forget-pwd', {
					account,
					identifyCode,
					code ,
					step: 'first'
				})
				// console.log(res)
				if (res.error == 0) {
					this.flag = false
					this.flag2 = true
					this.getAccountList()
				} else {
					this.$message.error(res.error_msg)
				}
			},
			confirm(){
				this.form.validateFields(err => {
					if (!err) {
						this.successSetPass();
					}
				});
			},
				//获取账户信息
			async getAccountList () {
				let phone = this.form.getFieldValue('account')
				var {data: res} = await this.axios.post('login/get-account-new', {
					phone,
				})
				if (res.error == 0) {
					this.accountList = res.data.user_info
					this.sub_id = this.accountList[0] && this.accountList[0].id
					this.isMasterAccount = this.accountList[0] && this.accountList[0].type
				} else {
					this.$message.error(res.error_msg)
				}
			},
			//切换账户
			handleChange (value) {
				if (typeof value != 'undefined') {
					this.accountList.map(x => {
						if (x.id == value) {
							this.isMasterAccount = x.type
						}
					})
					this.sub_id = value
				}
			},
			filterOption (input, option) {
				return (
					option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
				);
			},
				//完成判断两次密码，成功进入登录页
			async successSetPass () {
				let {account,identifyCode,code} = this.form.getFieldsValue();
				let {password,password2} = this.form2.getFieldsValue();
				var {data: res} = await this.axios.post('login/forget-pwd', {
					account,
					identifyCode,
					code,
					step           : 'second',
					password,
					password2,
					sub_id         : this.sub_id,
					isMasterAccount: this.isMasterAccount
				})
				// console.log(res)
				if (res.error == 0) {
					this.$router.push("/login");
				} else {
					this.$message.error(res.error_msg)
				}
			}
		},
	};
</script>

<style lang='less' scoped>
	.login {
		display: flex;
		width: 100%;
		height: 100vh;
		.login-left{
			width: 63%;
			.img{
				width: 100%;
				height: calc(100vh - 140px);
				background: url("~@/assets/login_bg.png") no-repeat center bottom;
		    background-size: cover;
			}
			.text{
				background: #01B065;
				color: #FFFFFF;
				font-size: 16px;
				padding-top: 20px;
				height: 140px;
				text-align: center;
				p:first-child{
					font-size: 24px;
					span{
						letter-spacing: 10px;
					}
				}
			}
		}
		.login-right{
			width: 37%;
			display: flex;
			justify-content: center;
			align-items: center;
			.content{
				width: 320px;
				margin-top: -10vh;
				.top{
					display: flex;
					justify-content: space-between;
					.back{
						color: #666;
						font-size: 14px;
						line-height: 28px;
						cursor: pointer;
						img{
							width: 14px;
							height: 14px;
							vertical-align: -2px;
						}
					}
					img{
						width: 77px;
						height: 28px;
					}
				}
				.form{
					margin-top: 60px;
					.title{
						font-size: 18px;
						display: inline-block;
						line-height: 34px;
						color: #01B065;
						border-bottom: 2px solid;
					}
					/deep/.ant-form{
						margin-top: 30px;
						.ant-form-item{
							margin-bottom: 24px;
							position: relative;
							&::before{
								content:'';
								position: absolute;
								left: 4px;
								top: 0;
								z-index: 1;
								width: 38px;
								height: 46px;
								background-position: center;
								background-size: 14px;
								background-repeat: no-repeat;
							}
							&.account::before{
								background-image: url('~@/assets/login-icon3.png');
							}
							&.verify{
								img{
									height: 31px;
									width: auto;
									position: absolute;
									right: 10px;
									top: -6px;
								}
								.getcode{
									position: absolute;
									right: 0px;
									top: -14px;
									width: unset;
									color: #01B065;
								}
								&::before{
									background-image: url('~@/assets/login-icon4.png');
								}
							}
							&.password::before{
								background-image: url('~@/assets/login-icon2.png');
							}
							.ant-input{
								height: 44px;
								border-radius: 22px;
								padding-left: 38px;
							}
							input:-webkit-autofill{
								box-shadow:0 0 0 1000px #fff inset;
							}
						}
					}
					.operate{
						padding: 0 15px;
						margin-bottom: 40px;
						display: flex;
						justify-content: space-between;
						span{
							color: #666
						}
						.forget{
							color: #01B065;
						}
					}
					/deep/.ant-btn{
						display: block;
						width: 100%;
						height: 44px;
						line-height: 44px;
						border-radius: 22px;
						margin-bottom: 12px;
					}
					.register{
						margin-top: 6px;
						color: #666;
						font-size: 14px;
						float: right;
						a{
							color: #01B065;
						}
					}
				}
			}
		}
	}
</style>