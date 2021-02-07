<template>
	<div class="login">
		<div class="login-header">
			<div class="login-header-left">
				<a href="/home" class="login-header-left-img">
					<img src="../../../assets/logo.png" alt/>
				</a>
				<span class="login-header-left-line"></span>
				<span class="login-header-left-login">登录</span>
			</div>
			<a href="/register" class="login-header-right">免费注册</a>
		</div>
		<div class="login-swiper">
			<img src="../../../assets/login_head.png" alt/>
		</div>
		<a-spin :spinning="loginSpinning" tip="登录中...">
			<div class="spin-content">
				<div class="login-body">
					<div class="one">
						<span class="one-txt" @click="login">账号登录</span>
						<!--				<span class="one-paopao" @click="taggerScancode">-->
						<!--          <img src="../../../assets/pic1.png" alt/>-->
						<!--					          扫码登录-->
						<!--        </span>-->
						<!--				<span class="one-erweima" @click="taggerScancode">-->
						<!--          <img src="../../../assets/erweima.png" alt/>-->
						<!--        </span>-->
					</div>
					<!-- <span>{{$store.state.username}}</span>
					  <button @click="press">测试全局js</button>
					  <button @click="vuex">测试vuex</button>
					  <button @click="vuex2">测试vuex2</button>
					<button @click="login">登录</button>-->
					<div class="alert" v-show="isShow">{{this.message}}</div>
					<div class="two" :class="isActive ? 'border-blue' : 'border-grey'" @focusin="inDiv"
					     @focusout="outDiv">
						<span>手机号码</span>
						<a-input
								:value="loginForm.account"
								@change="phoneChange"
								placeholder="请输入手机号码"
								:maxLength="11"
								@keyup.enter="login"
						/>
					</div>
					<div class="three" :class="isActive2 ? 'border-blue' : 'border-grey'" @focusin="inDiv2"
					     @focusout="outDiv2">
						<span>登录密码</span>
						<input type="password" placeholder="请输入密码" @keyup.enter="login" v-model="loginForm.password"/>
					</div>
					<div class="four">
						<a-checkbox @change="onChange" class="checkbox" :checked="loginForm.autoLogin">三天内自动登录
						</a-checkbox>
						<a href="/forgetPass">忘记密码？</a>
					</div>
					<a-button type="primary" block class="login-button" @click="login">登录</a-button>

					<a-button
							block
							class="work-login-button"
							@click="toWork">
						<MyIcon type="icon-work-wx"></MyIcon>
						企业微信登录
					</a-button>


					<a-button block class="register-button" @click="register">免费注册</a-button>
				</div>
			</div>
		</a-spin>
		<!--		<div class="footer">Copyright © 安徽小猪科技有限公司 All Rights Reserved</div>-->
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
				loginSpinning: false,
				loginForm    : {
					account  : "", //手机号
					password : "", //密码
					autoLogin: localStorage.getItem('autoLogin') == "true", // 三天内自动登录
				},
				isActive     : false, //控制输入框下底边是否变蓝
				isActive2    : false, //控制输入框下底边是否变蓝
				message      : "", //警告信息内容
				isShow       : false, //消息提示框的显示与隐藏
				token        : '',//登录状态
				redirectUrl  : '',//重新跳转链接
			};
		},

		methods: {
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
			toWork () {
				location.href = 'https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=' + this.$store.state.proCorpId + '&redirect_uri=' + encodeURIComponent(this.$store.state.siteUrl + '/login') + '&state=web_login&usertype=member'
			},
			// press() {
			//   this.utils.text();
			// },
			// vuex() {
			//   this.$store.commit('changeName', 'lily')
			// },
			// vuex2() {
			//   this.$store.dispatch('changeNameAsync', 'xiaomin')
			// },
			// async login() {
			//   var { data: res } = await this.axios.get('login', this.loginForm)
			// }
			phoneChange (e) {
				const {value} = e.target;
				const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
				if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
					this.loginForm.account = value;
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
			//三天自动登录
			onChange (e) {
				this.loginForm.autoLogin = e.target.checked
				localStorage.setItem('autoLogin', this.loginForm.autoLogin)
			},
			//点击跳转到Scancode页面
			taggerScancode () {
				this.$router.push({path: "/scancode"});
			},
			//跳转到免费注册
			register () {
				this.$router.push({path: "/register"});
			},
			//登录
			async login () {
				this.redirectUrl = this.$route.query.redirect
				var regPhone = /^(86)?(1[3,4,5,6,7,8,9]\d{9})$/;
				// console.log(this.$store.state.account)
				// console.log(this.loginForm.account, this.loginForm.password);
				if (this.loginForm.account == "") {
					this.message = "请填写您的手机号码";
					this.isShow = true;
				} else if (this.loginForm.account.replace(/(^\s*)|(\s*$)/g, "").split("").length < 11) {
					this.message = "手机号不能低于11个字符";
					this.isShow = true;
				} else if (this.loginForm.account.replace(/(^\s*)|(\s*$)/g, "").split("").length > 11) {
					this.message = "手机号不能高于11个字符";
					this.isShow = true;
				} else if (this.loginForm.password == "") {
					this.message = "密码不能为空";
					this.isShow = true;
				} else {
					//手机号正确发送登录请求
					this.isShow = false;
					const {data: res} = await this.axios.post('login/sign', this.loginForm)
					// console.log(res)
					if (res.error == 0) {
						localStorage.setItem('phoneNumber', this.loginForm.account)

						let encryptPassword = this.encode(this.loginForm.password);

						localStorage.setItem('password', encryptPassword)
						localStorage.setItem('accountNum', res.data.num)
						localStorage.setItem('masterAccountPhone', res.data.masterAccount)//主账户的手机号

						this.token = res.data.access_token

						this.$store.commit('changeAccount', this.loginForm.account);
						this.$store.commit('changePassword', this.loginForm.password);

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

							this.$message.success('登录成功')
							if (typeof this.redirectUrl != 'undefined' && this.redirectUrl != '') {
								if (typeof this.$route.query.userToken != 'undefined' && this.$route.query.userToken != '') {
									console.log('登录时redirectUrl', this.redirectUrl)
									this.$router.push(this.redirectUrl + "?userToken=" + this.$route.query.userToken)
								} else {
									console.log('登录时redirectUrl2', this.redirectUrl)
									this.$router.push(this.redirectUrl)
								}
							} else {
								this.$router.push('/home')
							}

						} else if (res.data.num > 1) {
							if (typeof this.redirectUrl != 'undefined' && this.redirectUrl != '') {
								if (typeof this.$route.query.userToken != 'undefined' && this.$route.query.userToken != '') {
									this.$router.push('/chooseAccount?redirectUrl=' + this.redirectUrl + '&userToken=' + this.$route.query.userToken)
								} else {
									this.$router.push('/chooseAccount?redirectUrl=' + this.redirectUrl)
								}
							} else {
								this.$router.push('/chooseAccount')
							}
						}
						// console.log(this.$store.state.account)
					} else {
						this.message = res.error_msg;
						this.isShow = true;
					}
				}
			},
			async workLogin () {
				this.redirectUrl = this.$route.query.redirect
				this.loginSpinning = true
				const {data: res} = await this.axios.post('login/work-login', {
					provider_id: this.$store.state.pid,
					auth_code  : this.$route.query.auth_code
				})

				if (res.error != 0) {
					if (res.error == 4003) {
						localStorage.setItem('bind_corp_id', res.data.corp_id)
						localStorage.setItem('bind_userid', res.data.userid)

						this.$router.push('/workBinding')
					}

					this.loginSpinning = false
					this.message = res.error_msg
					this.isShow = true
				} else {
					this.isShow = false

					localStorage.setItem('phoneNumber', res.data.phone)
					localStorage.setItem('password', '')
					localStorage.setItem('accountNum', res.data.num)
					localStorage.setItem('masterAccountPhone', res.data.masterAccount)

					this.token = res.data.access_token

					this.$store.commit('changeAccount', res.data.phone)
					this.$store.commit('changePassword', '')

					// 更新websocket中的登录信息
					this.ws.websocketSend(JSON.stringify({
						'channel': 'bind',
						'info'   : {
							'uid'  : res.data.uid,
							'subId': res.data.sub_id == 0 ? '' : res.data.sub_id
						}
					}))

					localStorage.setItem('uid', res.data.uid)
					localStorage.setItem('token', res.data.access_token)
					localStorage.setItem('accountKey', 1)
					this.$store.commit('changeProd', res.data.prod);

					if (res.data.type == 1) {
						localStorage.setItem('sub_id', res.data.uid)
					} else {
						localStorage.setItem('sub_id', res.data.sub_id)
					}

					//登录成功给官网localstorage发送phoneNumber
					this.global.sendPhoneNumber()

					if (res.data.type == 1) {
						localStorage.setItem('isMasterAccount', 1)
						this.$store.commit("changePermissionButton", "all");
					} else {
						localStorage.setItem('isMasterAccount', 2)
					}

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
				}
			}
		},

		created () {
			let websocketInterval
			websocketInterval = setInterval(() => {
				if (this.ws.websocket.readyState == 1) {
					clearInterval(websocketInterval)

					this.ws.websocketSend(JSON.stringify({
						'channel': 'bind',
						'info'   : {
							session_id: this.global.session_id,
							uid       : '',
							subId     : ''
						}
					}))
				}
			}, 300)

			console.log(this.loginForm.autoLogin)
			if (this.$route.query.auth_code) {
				this.workLogin()
			}
		}
	};
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
		width: 72px;
		height: 17px;
		font-family: MicrosoftYaHei;
		font-size: 16px;
		line-height: 30px;
		color: #4C69FC;
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
		color: #4C69FC;
		float: left;
		border-bottom: 2px solid #4C69FC;
	}

	.one-erweima {
		cursor: pointer;

		img {
			width: 54px;
			height: 54px;
			float: right;
		}
	}

	.one-paopao {
		cursor: pointer;
		width: 120px;
		height: 35px;
		background-color: #FFB637;
		border-radius: 4px;
		display: inline-block;
		position: absolute;
		right: 50px;
		top: 10px;
		color: #FFF;
		font-size: 14px;
		box-sizing: border-box;
		padding-top: 6px;

		img {
			margin-left: 20px;
		}
	}

	.one-paopao::after {
		content: "";
		width: 10px;
		height: 10px;
		background-color: #FFB637;
		display: inline-block;
		transform: rotate(45deg);
		position: absolute;
		right: -5px;
		top: 10px;
	}

	.two,
	.three {
		height: 60px;
		width: 100%;
		margin-top: 45px;

		span {
			line-height: 60px;
			float: left;
		}

		input {
			float: right;
			width: 330px;
			height: 58px;
			border: none;
			padding: 4px 11px;
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

	.four {
		height: 80px;
		width: 100%;
		line-height: 80px;

		.checkbox {
			float: left;
			color: #999;
		}

		a {
			float: right;
			cursor: pointer;
		}

		span:hover {
			color: red;
		}
	}

	.login-button {
		height: 52px;
		background-color: #4C69FC;
		font-family: MicrosoftYaHei;
		font-size: 16px;
	}

	.login-button:hover,
	.ant-btn-primary:focus {
		border-color: #4C69FC !important;
		background-color: #4C69FC !important;
	}

	.register-button,
	.work-login-button {
		height: 52px;
		font-family: MicrosoftYaHei;
		font-size: 16px;
		margin-top: 20px;
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
		margin-top: 90px;
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

	/deep/ .ant-input:focus {
		box-shadow: none;
	}
</style>