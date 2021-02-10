<template>
	<div class="login">
		<img src="~@/assets/login_logo.png" alt="">
		<div class="box">
			<div class="item">
				<p>还没有企业微信？</p>
				<div>注册包含云美来SCRM的企业微信</div>
				<a-button type="primary">注册企业微信</a-button>
			</div>
			<div class="item">
				<p>已有企业微信？</p>
				<div>极速安装云美来SCRM到企业微信</div>
				<a-button type="primary">安装到企业微信</a-button>
			</div>
		</div>
		<!-- <div class="login-header">
			<div class="login-header-left">
				<a href="/home" class="login-header-left-img">
					<img src="../../../assets/logo.png" alt/>
				</a>
				<span class="login-header-left-line"></span>
				<span class="login-header-left-login">免费注册</span>
			</div>
			<div class="login-header-right">
				已有账号，
				<a href="/login">登录</a>
			</div>
		</div>
		<div class="login-swiper">
			<img src="../../../assets/login_head.png" alt/>
		</div>
		<div class="alert" v-show="isShow">{{this.message}}</div>
		<div class="login-body">
			<div>
				<div class="two" :class="isActive ? 'border-blue' : 'border-grey'" @focusin="inDiv" @focusout="outDiv">
					<span>手机号码</span>
					<a-input
							:value="registerForm.account"
							@change="phoneChange"
							placeholder="请输入手机号码"
							:maxLength="11"
					/>
				</div>
				<div class="password" :class="isActive3 ? 'border-blue' : 'border-grey'" @focusin="inDiv3"
				     @focusout="outDiv3">
					<span>短信验证码</span>
					<input type="text" placeholder="请填写验证码" @keyup.enter="sureRegister" v-model="code"
					       autoComplete="off"/>
					<a-button type="link" class="getpassword" @click="getPassword"
					          :disabled="!(registerForm.account.length == 11 && disabled)">
						{{this.btnTitle}}
					</a-button>
				</div>
				<div class="three" :class="isActive2 ? 'border-blue' : 'border-grey'" @focusin="inDiv2"
				     @focusout="outDiv2">
					<span>设置密码</span>
					<input type="password" placeholder="请填写6-20位密码" @keyup.enter="sureRegister" v-model="password"
					       autoComplete="new-password" maxLength="20"/>
				</div>
			</div>
			<a-button type="primary" block class="login-button" @click="sureRegister" :loading="iconLoading">确认注册
			</a-button>
		</div> -->
		<!--        <div class="footer">Copyright © 安徽小猪科技有限公司 All Rights Reserved</div>-->
	</div>
</template>

<script>
	export default {

		data () {
			return {
				registerForm: {
					account: "", //手机号
					type   : 'register',//获取手机验证码来源类型
				},
				isActive    : false,//控制输入框下底边是否变蓝
				isActive2   : false,//控制输入框下底边是否变蓝
				isActive3   : false,//控制输入框下底边是否变蓝
				disabled    : true,//获取验证码按钮能不能点击
				code        : "", //短信验证码
				btnTitle    : "获取验证码",
				password    : '',//密码
				message     : "", //警告信息内容
				isShow      : false, //消息提示框的显示与隐藏
				iconLoading : false,//确认注册按钮的加载显示与隐藏
			}
		},

		methods: {
			phoneChange (e) {
				const {value} = e.target;
				const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
				if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
					this.registerForm.account = value;
				}
			},
			//点击输入框，外部div下边框变蓝
			inDiv  : function (event) {
				this.isActive = true
			},
			outDiv : function (event) {
				this.isActive = false
			},
			inDiv2 : function (event) {
				this.isActive2 = true
			},
			outDiv2: function (event) {
				this.isActive2 = false
			},
			inDiv3 : function (event) {
				this.isActive3 = true
			},
			outDiv3: function (event) {
				this.isActive3 = false
			},
			//获取验证码
			async getPassword () {
				var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.registerForm.account)) {
					this.disabled = true;
					this.$message.error('手机号格式不正确')
					return false;
				} else {
					var {data: res} = await this.axios.post('login/get-code', this.registerForm)
					if (res.error == 0) {
						//获取验证码成功弹出气泡
						this.$message.success('发送成功')
						//倒计时
						let time = 60;
						let timer = setInterval(() => {
							if (time == 0) {
								clearInterval(timer);
								this.disabled = true;
								this.btnTitle = "获取验证码";
							} else {
								this.btnTitle = time + '秒后重试';
								this.disabled = false;
								time--
							}
						}, 1000)
					} else {
						this.$message.error(res.error_msg)
						this.disabled = true;
					}
				}
			},
			//注册
			async sureRegister () {
				this.iconLoading = true
				var regPhone = /^(86)?(1[3,4,5,6,7,8,9]\d{9})$/;
				if (this.registerForm.account == '') {
					this.message = "请填写您的手机号码";
					this.isShow = true;
					this.iconLoading = false
					return false
				} else if (this.registerForm.account.split("").length < 11) {
					this.message = "手机号不能低于11个字符";
					this.isShow = true;
					this.iconLoading = false
					return false
				} else if (this.registerForm.account.split("").length > 11) {
					this.message = "手机号不能高于11个字符";
					this.isShow = true;
					this.iconLoading = false
					return false
				} else if (this.code == '') {
					this.message = "验证码不能为空";
					this.isShow = true;
					this.iconLoading = false
					return false
				} else if (this.password == '') {
					this.message = "密码不能为空";
					this.isShow = true;
					this.iconLoading = false
					return false
				} else if (this.password.split("").length < 6) {
					this.message = "密码不能低于6个字符";
					this.isShow = true;
					this.iconLoading = false
					return false
				} else if (this.password.split("").length > 20) {
					this.message = "密码不能高于20个字符";
					this.isShow = true;
					this.iconLoading = false
					return false
				} else {
					this.isShow = false;
					var {data: res} = await this.axios.post('login/register', {
						account : this.registerForm.account,
						password: this.password,
						code    : this.code
					})
					// console.log(res)
					if (res.error == 0) {
						this.iconLoading = false
						this.$message.success('注册成功')
						localStorage.setItem('token', res.data.access_token)
						localStorage.setItem('uid', res.data.uid)
						localStorage.setItem('phoneNumber', this.registerForm.account)
						this.$store.commit('changeAccount', this.registerForm.account)

						//登录成功给官网localstorage发送phoneNumber
						this.global.sendPhoneNumber()

						this.$router.push('/home')
					} else {
						this.message = res.error_msg;
						this.isShow = true;
						this.iconLoading = false
					}
				}
			}
		},


		created () {
		}
	}
</script>

<style lang='less' scoped>
	.login {
		width: 100%;
		height: 100%;
		position: relative;
		img{
			width: 77px;
			height: 28px;
			position: absolute;
			left: 160px;
			top: 60px;
		}
		.box{
			width: 900px;
			height: 438px;
			box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
			border-radius: 20px;
			display: flex;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			.item{
				flex: 1;
				text-align: center;
				color: #666;
				font-size: 14px;
				p{
					font-weight: 500;
					color: #01B065;
					font-size: 20px;
					margin-top: 120px;
					margin-bottom: 40px;
				}
				/deep/.ant-btn{
					height: 40px;
					margin-top: 86px;
					border-radius: 8px;
				}
			}
		}
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
		background-color: #DFDFDF;
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
		background-image: url("../../../assets/background.png");
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
		background-color: #F1F0F3;
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
		margin-top: 45px;

		span {
			line-height: 60px;
			float: left;
		}

		input {
			float: right;
			width: 280px;
			height: 58px;
			border: none;
			padding: 0;
		}

		input:focus {
			outline: none;
		}
	}

	::-webkit-input-placeholder {
		/* WebKit browsers */
		color: #CACACA;
	}

	::-moz-placeholder {
		/* Mozilla Firefox 19+ */
		color: #CACACA;
	}

	:-ms-input-placeholder {
		/* Internet Explorer 10+ */
		color: #CACACA;
	}

	.border-blue {
		border-bottom: 2px solid #4C69FC !important;
	}

	.border-grey {
		border-bottom: 1px solid #E5E5E5 !important;
	}

	.login-button {
		height: 52px;
		background-color: #4C69FC;
		font-family: MicrosoftYaHei;
		font-size: 16px;
		display: block;
		margin-top: 50px;
	}

	// .login-button:hover,
	// .ant-btn-primary:focus {
	// 	border-color: #4C69FC !important;
	// 	background-color: #4C69FC !important;
	// }

	.footer {
		text-align: center;
		width: 100%;
		font-family: MicrosoftYaHei;
		font-size: 12px;
		font-weight: normal;
		font-stretch: normal;
		line-height: 22px;
		letter-spacing: 0px;
		color: #9E9E9E;
		margin-top: 55px;
	}

	.getpassword {
		position: absolute;
		right: 0px;
		bottom: 14px;
	}

	.password,
	.two {
		position: relative;
	}

	.alert {
		margin-top: 20px;
		width: 435px;
		height: 30px;
		background-color: rgba(234, 106, 90, 0.8);
		font-size: 16px;
		color: #FFF;
		text-align: center;
		line-height: 30px;
		margin: 0 auto;
	}

	/deep/ .ant-input:focus {
		box-shadow: none;
	}
</style>