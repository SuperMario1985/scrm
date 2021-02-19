<template>
	<div class="login">
		<div v-if="bindFlag">
			<div class="login-header">
				<div class="login-header-left">
					<a href="/home" class="login-header-left-img">
						<img src="../../../assets/logo.png" alt=""/>
					</a>
					<span class="login-header-left-line"></span>
					<span class="login-header-left-login">企业微信绑定</span>
				</div>
			</div>
			<div class="login-swiper">
				<!-- <img src="../../../assets/login_head.png" alt=""> -->
			</div>
			<div class="login-body">
				<div class="alert" v-show="isShow">{{this.message}}</div>
				<div class="one">
					<span class="one-txt" @click="bind">企业微信绑定</span>
				</div>
				<a-spin :spinning="bindSpinning" tip="绑定中...">
					<div class="spin-content">
						<div class="two" :class="isActive ? 'border-blue' : 'border-grey'" @focusin="inDiv"
						     @focusout="outDiv">
							<span>手机号码</span>
							<input
									v-model="loginForm.phone"
									@change="phoneChange"
									placeholder="请输入手机号码"
									:maxLength="11"
									@keyup.enter="bind"
							/>
						</div>
						<div class="password" :class="isActive2 ? 'border-blue' : 'border-grey'" @focusin="inDiv2"
						     @focusout="outDiv2">
							<span>短信验证码</span>
							<input type="text" placeholder="请填写验证码" @keyup.enter="bind" v-model="loginForm.code"
							       autoComplete="off"/>
							<a-button type="link" class="getpassword" @click="getPassword"
							          :disabled="!(loginForm.phone.length == 11 && disabled)">
								{{btnTitle}}
							</a-button>
						</div>
						<a-button :loading="bindLoading" type="primary" block class="login-button" @click="bind">绑定</a-button>
					</div>
				</a-spin>
			</div>
		</div>
		<div v-if="!bindFlag">
			<div class="login-header">
				<div class="login-header-left">
					<a href="/home" class="login-header-left-img">
						<img src="../../../assets/logo.png" alt=""/>
					</a>
					<span class="login-header-left-line"></span>
					<span class="login-header-left-login">密码设置</span>
				</div>
			</div>
			<div class="login-swiper">
				<!-- <img src="../../../assets/login_head.png" alt=""> -->
			</div>
			<div class="login-body">
				<div class="alert" v-show="isShow">{{this.message}}</div>
				<div class="one">
					<span class="one-txt" @click="login">密码设置</span>
				</div>
				<a-spin :spinning="loginSpinning" tip="登录中...">
					<div class="spin-content">
						<div class="two" :class="isActive ? 'border-blue' : 'border-grey'" @focusin="inDiv"
						     @focusout="outDiv">
							<span>设置密码</span>
							<input type="password" placeholder="请填写6-20位密码" @keyup.enter="login" v-model="password"
							       autoComplete="new-password" maxLength="20"/>
						</div>
						<div class="two" :class="isActive2 ? 'border-blue' : 'border-grey'" @focusin="inDiv2"
						     @focusout="outDiv2">
							<span>确认密码</span>
							<input type="password" placeholder="请填写6-20位密码" @keyup.enter="login" v-model="password2"
							       autoComplete="new-password" maxLength="20"/>
						</div>
						<a-button type="primary" style="width: 45%; margin-right: 10%;" class="login-button"
						          @click="login">提交
						</a-button>
						<a-button style="width: 45%;" class="sub-button" @click="skip">跳过</a-button>
					</div>
				</a-spin>
			</div>
		</div>
	</div>
</template>

<script>
	export default {

		data () {
			let bindingCorpId = localStorage.getItem('bind_corp_id') ? localStorage.getItem('bind_corp_id') : ""
			let bindingUserId = localStorage.getItem('bind_userid') ? localStorage.getItem('bind_userid') : ""

			return {
				bindFlag     : true, // true 绑定 false 设置密码
				isShow       : false, //消息提示框的显示与隐藏
				message      : "",    //警告信息内容
				loginSpinning: false,
				bindSpinning : false,
				isActive     : false, //控制输入框下底边是否变蓝
				isActive2    : false, //控制输入框下底边是否变蓝
				disabled     : true,//获取验证码按钮能不能点击

				btnTitle : "获取验证码",
				loginForm: {
					code    : "",
					phone   : "", //手机号
					cacheKey: bindingCorpId,
					userid  : bindingUserId,
				},
				password : '', // 密码
				password2: '', // 确认密码
				bindLoading : false, // 绑定防止多点
			}
		},
		created () {
			if (this.$route.query.auth_corpid) {
				localStorage.setItem('bind_corp_id', this.$route.query.auth_corpid)
			}
			this.loginForm.cacheKey = localStorage.getItem('bind_corp_id')
			if(!localStorage.getItem('bind_corp_id')) {
				this.$router.push('/login')
			}
			this.redirectUrl = this.$route.query.redirect
		},
		methods: {
			callback (key) {
				console.log(key);
			},
			phoneChange (e) {
				const {value} = e.target;
				const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
				if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
					this.loginForm.phone = value;
				}
			},
			//点击输入框，外部div下边框变蓝
			inDiv  : function (event) {
				this.isActive = true;
			},
			outDiv : function (event) {
				this.isActive = false;
			},
			inDiv2 : function (event) {
				this.isActive2 = true;
			},
			outDiv2: function (event) {
				this.isActive2 = false;
			},
			encode (_str) {
				var staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
				var encodechars = "";
				for (var i = 0; i < _str.length; i++) {
					var num0 = staticchars.indexOf(_str[i]);
					if (num0 == -1) {
						var code = _str[i];
					} else {
						var code = staticchars[(num0 + 3) % 62];
					}
					var num1 = parseInt(Math.random() * 62, 10);
					var num2 = parseInt(Math.random() * 62, 10);
					encodechars += staticchars[num1] + code + staticchars[num2];
				}
				return encodechars;
			},
			//获取验证码
			async getPassword () {
				var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.loginForm.phone)) {
					this.disabled = true;
					this.$message.error('手机号格式不正确')
					return false;
				} else {
					var {data: res} = await this.axios.post('login/get-code', {
						account: this.loginForm.phone, //手机号
						type   : 'bind',//获取手机验证码来源类型
					})
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
			// 跳过密码
			skip () {
				if (typeof this.redirectUrl != 'undefined' && this.redirectUrl != '') {
					if (typeof this.$route.query.userToken != 'undefined' && this.$route.query.userToken != '') {
						this.$router.push(this.redirectUrl + "?userToken=" + this.$route.query.userToken)
					} else {
						this.$router.push(this.redirectUrl)
					}
				} else {
					this.$router.push('/home')
				}
			},
			// 设置密码
			async login () {
				if (this.password.length < 6 || this.password2.length < 6) {
					this.message = "请检查您的密码长度";
					this.isShow = true;
					return false
				} else if (this.password.length < 6 || this.password2.length < 6) {
					this.message = "两次密码不同，请检查";
					this.isShow = true;
					return false
				} else {
					this.isShow = false;
					const {data: res} = await this.axios.post('login/update-pwd', {
						uid      : localStorage.getItem('uid'),
						password : this.password,
						password2: this.password2
					})
					// console.log(res)
					if (res.error == 0) {
						if (typeof this.redirectUrl != 'undefined' && this.redirectUrl != '') {
							if (typeof this.$route.query.userToken != 'undefined' && this.$route.query.userToken != '') {
								this.$router.push(this.redirectUrl + "?userToken=" + this.$route.query.userToken)
							} else {
								this.$router.push(this.redirectUrl)
							}
						} else {
							this.$router.push('/home')
						}
					} else {
						this.message = res.error_msg;
						this.isShow = true;
					}
				}
			},
			// 绑定
			async bind () {
				if(this.bindLoading) {
					return false
				}
				this.bindLoading = true
				// var regPhone = /^(86)?(1[3,4,5,6,7,8,9]\d{9})$/;
				if (this.loginForm.phone == "") {
					this.message = "请填写您的手机号码";
					this.bindLoading = false
					this.isShow = true;
					return false
				} else if (this.loginForm.phone.replace(/(^\s*)|(\s*$)/g, "").split("").length < 11) {
					this.message = "手机号不能低于11个字符";
					this.bindLoading = false
					this.isShow = true;
					return false
				} else if (this.loginForm.phone.replace(/(^\s*)|(\s*$)/g, "").split("").length > 11) {
					this.message = "手机号不能高于11个字符";
					this.bindLoading = false
					this.isShow = true;
					return false;
				} else if (this.loginForm.code == "") {
					this.message = "请填写验证码";
					this.bindLoading = false
					this.isShow = true;
					return false;
					// } else if (this.loginForm.cacheKey == "" || this.loginForm.userid == "") {
					// 	this.message = "不存在绑定关系";
					// 	this.isShow = true;
					// 	return false;
				} else {
					//手机号正确发送登录请求
					this.isShow = false;
					const {data: res} = await this.axios.post('login/work-bind-sign', this.loginForm)
					// console.log(res)
					if (res.error == 0) {
						localStorage.setItem('phoneNumber', this.loginForm.phone)

						let encryptPassword = this.encode(this.password);

						localStorage.setItem('password', encryptPassword)
						localStorage.setItem('accountNum', res.data.num)
						localStorage.setItem('masterAccountPhone', res.data.masterAccount)//主账户的手机号

						this.token = res.data.access_token

						this.$store.commit('changeAccount', this.loginForm.phone);
						this.$store.commit('changePassword', this.password);

						if (res.data.num == 1) {
							// 更新websocket中的登录信息
							this.ws.websocketSend(JSON.stringify({
								'channel': 'bind',
								'info'   : {
									'uid'  : res.data.uid,
									'subId': ''
								}
							}))

							localStorage.setItem('uid', res.data.uid)
							localStorage.setItem('token', res.data.access_token)
							localStorage.setItem('accountKey', 1)
							this.$store.commit('changeProd', res.data.prod);

							//登录成功给官网localstorage发送phoneNumber
							this.global.sendPhoneNumber()

							if (res.data.type == 1) {
								localStorage.setItem('isMasterAccount', 1)
								localStorage.setItem('sub_id', res.data.uid)
								this.$store.commit("changePermissionButton", "all");
							} else {
								localStorage.setItem('isMasterAccount', 2)
								localStorage.setItem('sub_id', res.data.sub_id)
							}
							if (res.data.password == 1) {
								this.$message.success('登录成功')
								if (typeof this.redirectUrl != 'undefined' && this.redirectUrl != '') {
									if (typeof this.$route.query.userToken != 'undefined' && this.$route.query.userToken != '') {
										this.$router.push(this.redirectUrl + "?userToken=" + this.$route.query.userToken)
									} else {
										this.$router.push(this.redirectUrl)
									}
								} else {
									this.$router.push('/home')
								}
							} else {
								this.bindFlag = false
							}
						}
						this.bindLoading = false
					} else {
						this.bindLoading = false
						this.message = res.error_msg;
						this.isShow = true;
					}
				}
			},
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

	.login-body {
		width: 435px;
		margin: 0 auto;
		position: relative;
		margin-top: 94px;
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

	.two,
	.three,
	.password {
		position: relative;
		height: 60px;
		width: 100%;
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
			padding: 4px 11px;
		}

		input:focus {
			outline: none;
			border: 0;
			border-color: #FFFFFF !important;
		}
	}

	.getpassword {
		position: absolute;
		right: 0px;
		bottom: 14px;
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

	.alert {
		margin-top: 20px;
		width: 100%;
		height: 30px;
		background-color: rgba(234, 106, 90, 0.8);
		font-size: 16px;
		color: #FFF;
		text-align: center;
		line-height: 30px;
	}

	.border-blue {
		border-bottom: 2px solid #01b065 !important;
	}

	.border-grey {
		border-bottom: 1px solid #E5E5E5 !important;
	}

	.one {
		height: 52px;
		border-bottom: 1px solid #E5E5E5;
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

	.login-button {
		height: 52px;
		// background-color: #4C69FC;
		font-family: MicrosoftYaHei;
		font-size: 16px;
		margin-top: 45px;
	}

	.sub-button {
		height: 52px;
		font-family: MicrosoftYaHei;
		font-size: 16px;
		margin-top: 45px;
	}

	.login-button:hover,
	.ant-btn-primary:focus {
		/*border-color: #4C69FC !important;*/
		// background-color: #4C69FC !important;
	}
</style>