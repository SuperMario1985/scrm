<template>
	<div class="login">
		<div class="login-header">
			<div class="login-header-left">
				<a href="/home" class="login-header-left-img">
					<img src="../../../assets/logo.png" alt=""/>
				</a>
				<span class="login-header-left-line"></span>
				<span class="login-header-left-login">验证密码</span>
			</div>
		</div>
		<div class="login-swiper">
			<img src="../../../assets/login_head.png" alt="">
		</div>

		<div class="login-body">
			<div class="alert" v-show="isShow">{{this.message}}</div>
			<div class="two" :class="isActive ? 'border-blue' : 'border-grey'" @focusin="inDiv" @focusout="outDiv">
				<span style="line-height: 60px;float: left;">密码</span>
				<a-input-password type="password" placeholder="请输入密码" @keyup.enter="nextStep" v-model="password"/>
			</div>
			<a-button type="primary" block class="login-button" @click="nextStep">确定登录</a-button>
		</div>
	</div>
</template>

<script>
	export default {

		data () {
			return {
				account    : '',//手机号
				password   : "", //密码
				isActive   : false,//控制输入框下底边是否变蓝
				isShow     : false, //消息提示框的显示与隐藏
				message    : "", //警告信息内容
				redirectUrl: '',//重新跳转链接
			}
		},

		methods: {
			//点击输入框，外部div下边框变蓝
			inDiv : function (event) {
				this.isActive = true
			},
			outDiv: function (event) {
				this.isActive = false
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
			//发送登录请求
			async nextStep () {
				if (this.password == "") {
					this.message = "密码不能为空";
					this.isShow = true;
				} else {
					this.isShow = false;
					const {data: res} = await this.axios.post('login/check-sign', {
						account : this.account,
						password: this.password
					})
					// console.log(res)
					if (res.error == 0) {
						localStorage.setItem('phoneNumber', this.account)

						let encryptPassword = this.encode(this.password);

						localStorage.setItem('password', encryptPassword)
						localStorage.setItem('accountNum', res.data.num)
						localStorage.setItem('masterAccountPhone', res.data.masterAccount)

						this.token = res.data.access_token

						this.$store.commit('changeAccount', this.account);
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

							this.$message.success('登录成功')
							console.log('this.redirectUrlvc',this.redirectUrl)
							if (typeof this.redirectUrl != 'undefined' && this.redirectUrl != '') {
								this.$router.push(this.redirectUrl)
							} else {
								this.$router.push('/home')
							}

						} else if (res.data.num > 1) {
							if (typeof this.redirectUrl != 'undefined' && this.redirectUrl != '') {
								this.$router.push('/chooseAccount?redirectUrl=' + this.redirectUrl)
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
		},


		created () {
			this.redirectUrl = this.$route.query.redirect
			this.account = window.atob(this.$route.query.ava)//对手机号进行解密
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
		margin-top: 94px;
		position: relative;
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


	.two {
		height: 60px;
		margin-top: 45px;

		.ant-input-password {
			float: right;
			width: 280px;
			height: 58px;
			border: none;
		}

		/deep/ .ant-input {
			border: none;
		}

		.ant-input-password:focus {
			outline: none;
		}

		/deep/ .ant-input:focus {
			border: none;
			box-shadow: none;
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

</style>