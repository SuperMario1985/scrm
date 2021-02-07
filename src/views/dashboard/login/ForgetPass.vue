<template>
	<div class="login">
		<div class="login-header">
			<div class="login-header-left">
				<a href="/home" class="login-header-left-img">
					<img src="../../../assets/logo.png" alt=""/>
				</a>
				<span class="login-header-left-line"></span>
				<span class="login-header-left-login">忘记密码</span>
			</div>
			<div class="login-header-right">已有账号，<a href="/login">登录</a></div>
		</div>
		<div class="login-swiper">
			<img src="../../../assets/login_head.png" alt="">
		</div>

		<div class="login-body" v-show="flag">
			<div class="two" :class="isActive ? 'border-blue' : 'border-grey'" @focusin="inDiv" @focusout="outDiv">
				<span>手机号</span>
				<input type="text" placeholder="请输入手机号" @keyup.enter="nextStep" v-model="account" @keyup="getAccount"
				       :maxLength="11">
			</div>
			<div class="three" :class="isActive2 ? 'border-blue' : 'border-grey'" @focusin="inDiv2" @focusout="outDiv2"
			     v-show="flag3">
				<span>图形验证码</span>
				<input type="text" placeholder="请输入图形验证码" @keyup.enter="nextStep" v-model="identifyCode"
				       @keyup="getIdentifyCode" :maxLength="4">
				<img :src="this.pic" alt="" class="picpassword" @click="reloadPic">
			</div>
			<div class="password" :class="isActive3 ? 'border-blue' : 'border-grey'" @focusin="inDiv3"
			     @focusout="outDiv3">
				<span>验证码</span>
				<input type="text" placeholder="请填写验证码" @keyup.enter="nextStep" v-model="code">
				<a-button type="link" class="getpassword" :disabled="disabled" @click="getCode">{{this.btnTitle}}
				</a-button>
			</div>
			<a-button type="primary" block class="login-button" @click="nextStep">下一步</a-button>
		</div>
		<div class="login-body" v-show="flag2">
			<a-select
					showSearch
					:defaultValue="accountList[0].id"
					optionFilterProp="children"
					style="width: 100%;"
					@change="handleChange"
					:filterOption="filterOption"
					v-if="accountList[0]"
			>
				<a-select-option v-for="d in accountList" :value="d.id">
					<template v-if="d.company_name == '' || d.company_name == null">{{d.account}}</template>
					<template v-if="d.company_name != ''">{{d.company_name}}</template>
					<template v-if="d.type == 1">（主账户）</template>
					<template v-if="d.type == 2">（子账户）</template>
				</a-select-option>
			</a-select>
			<div class="two" :class="isActive ? 'border-blue' : 'border-grey'" @focusin="inDiv" @focusout="outDiv">
				<span>新密码</span>
				<input type="text" placeholder="请填写6-20位密码" @keyup.enter="successSetPass" v-model="password"/>
			</div>
			<div class="three" :class="isActive2 ? 'border-blue' : 'border-grey'" @focusin="inDiv2" @focusout="outDiv2">
				<span>重复输入</span>
				<input type="text" placeholder="请输入新的密码" @keyup.enter="successSetPass" v-model="password2"/>
			</div>
			<a-button type="primary" block class="login-button" @click="successSetPass">完成</a-button>
		</div>
		<!--        <div class="footer">-->
		<!--            Copyright © 安徽小猪科技有限公司 All Rights Reserved-->
		<!--        </div>-->
	</div>
</template>

<script>
	export default {

		data () {
			return {
				account        : '',//手机号
				identifyCode   : '',//图形验证码
				code           : '',//短信验证码
				password       : "", //密码
				password2      : "", //重复密码
				isActive       : false,//控制输入框下底边是否变蓝
				isActive2      : false,//控制输入框下底边是否变蓝
				isActive3      : false,//控制输入框下底边是否变蓝
				disabled       : true,//获取验证码按钮能不能点击
				pic            : '',//图形验证码图片
				btnTitle       : "获取验证码",
				flag           : true,//第一页的显示与隐藏
				flag2          : false,//重置密码页的显示与隐藏
				flag3          : false,//图形验证码行显示与隐藏
				accountList    : [],//账户列表
				isMasterAccount: '',//1子账户，2主账户
				sub_id         : '',//选择的账户id
			}
		},

		methods: {
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
			//输入框判断手机号格式并请求图形验证码
			async getAccount () {
				var regPhone = /^(86)?(1[3,4,5,6,7,8,9]\d{9})$/;
				if (this.account == '') {
					this.$message.destroy()
					this.$message.error('请填写您的手机号码')
				} else if (this.account.length == 11) {
					if (!regPhone.test(this.account)) {
						this.$message.destroy()
						this.$message.error('手机号格式不正确')
					} else {
						// console.log('发送请求获取图形验证码')
						var {data: res} = await this.axios.post('login/identify-code', {
							account: this.account
						})
						// console.log(res)
						this.pic = res.data[0]
						this.flag3 = true
					}
				} else {
					this.flag3 = false
				}
			},
			//点击重新加载图形验证码
			async reloadPic () {
				if (this.pic != '') {
					var {data: res} = await this.axios.post('login/identify-code', {
						account: this.account
					})
					this.pic = res.data[0]
				}
			},
			//判断是否显示 获取验证码 按钮
			getIdentifyCode () {
				if (this.pic != '' && this.identifyCode.length == 4) {
					this.disabled = false
				}
			},
			//获取短信验证码
			async getCode () {
				var {data: res} = await this.axios.post('login/get-code', {
					account     : this.account,
					type        : 'forgetPwd',
					identifyCode: this.identifyCode
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
			//下一步进入设置密码页面
			async nextStep () {
				// console.log(this.identifyCode)
				if (this.account.length != 11) {
					this.$message.destroy()
					this.$message.error('手机号格式不正确')

					return false
				}

				if (this.identifyCode.length != 4) {
					this.$message.destroy()
					this.$message.error('图形验证码不正确')

					return false
				}

				if (this.code.length != 6) {
					this.$message.destroy()
					this.$message.error('验证码格式不正确')

					return false
				}

				var {data: res} = await this.axios.post('login/forget-pwd', {
					account     : this.account,
					identifyCode: this.identifyCode,
					code        : this.code,
					step        : 'first'
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
			//获取账户信息
			async getAccountList () {
				var {data: res} = await this.axios.post('login/get-account-new', {
					phone: this.account,
				})
				if (res.error == 0) {
					this.accountList = res.data.user_info
					this.sub_id = this.accountList[0].id
					this.isMasterAccount = this.accountList[0].type
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
				if (this.password == this.password2) {
					var {data: res} = await this.axios.post('login/forget-pwd', {
						account        : this.account,
						identifyCode   : this.identifyCode,
						code           : this.code,
						step           : 'second',
						password       : this.password,
						password2      : this.password2,
						sub_id         : this.sub_id,
						isMasterAccount: this.isMasterAccount
					})
					// console.log(res)
					if (res.error == 0) {
						this.$router.push("/login");
					} else {
						this.$message.error(res.error_msg)
					}
				} else {
					this.$message.error("两次输入的密码不一致");
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

	.login-button:hover,
	.ant-btn-primary:focus {
		border-color: #4C69FC !important;
		background-color: #4C69FC !important;
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
		color: #9E9E9E;
		margin-top: 145px;
	}

	.getpassword {
		position: absolute;
		right: 0px;
		bottom: 14px;
	}

	.password,
	.three {
		position: relative;
	}

	.picpassword {
		width: 87px;
		height: 30px;
		border: 1px solid #CCC;
		position: absolute;
		right: 0px;
		bottom: 14px;
		cursor: pointer;
	}
</style>