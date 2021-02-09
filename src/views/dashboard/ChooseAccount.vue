<template>
	<div class="home">
		<div class="login-swiper">
			<img src="../../assets/login_head.png" alt/>
		</div>
		<h2 style="padding: 20px;">当前检测到<span style="color: red;">{{phone}}</span>存在多个账户，请先选择</h2>
		<div style="padding: 0 20px;">
			<template v-for="(item,index) in accountList" style="display: inline-block;">
				<a-radio-group @change="changeAccount(item)" v-model="changeBackground">
					<a-radio-button :value="item.key">
						<div>
							<template v-if="item.company_logo == '' || item.company_name == null">
								<a-avatar
										:src="img"
										shape="square" :size="48"/>
							</template>
							<template v-if="item.company_logo != '' && item.company_logo != null">
								<a-avatar :src="commonUrl + item.company_logo" shape="square" :size="48"/>
							</template>

							<template v-if="item.company_name == '' || item.company_name == null">
								<span class="text">{{item.account}}</span>
							</template>
							<template v-if="item.company_name != '' && item.company_name != null">
								<span class="text">{{item.company_name}}</span>
							</template>
							<div class="tab" v-if="item.type == 1">主账户</div>
							<div class="tab" v-if="item.type == 2">子账户</div>
						</div>
					</a-radio-button>
				</a-radio-group>
			</template>
		</div>
	</div>
</template>

<script>
	import store from "../../store";
	import img from "../../assets/default.png"

	export default {
		components: {},
		data () {
			let changeBackground =
				localStorage.getItem('phoneNumber') ? localStorage.getItem('phoneNumber') : "";
			return {
				img,
				commonUrl       : this.$store.state.commonUrl,//公共的链接
				accountList     : [],//账户列表
				phone           : changeBackground,//手机号
				password        : localStorage.getItem('password'),//密码
				changeBackground: '',//被选中的账户的key
				id              : '',//选择的账户id
				type            : '',//选择的账户类型，1主账户，2子账户
				redirectUrl     : '',//重新跳转链接
			};
		},
		methods   : {
			//获取子账户
			async getList () {
				const {data: res} = await this.axios.post(
					"login/get-account",
					{
						phone   : this.phone,
						password: this.password,
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.accountList = res.data.user_info
				}
			},
			//切换账户
			async changeAccount (item) {
				const {data: res} = await this.axios.post(
					"login/get-last-user",
					{
						id       : item.id,
						type     : item.type,
						autoLogin: localStorage.getItem('autoLogin') == "true"
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					// 更新websocket中的登录信息
					this.ws.websocketSend(JSON.stringify({
						'channel': 'bind',
						'info'   : {
							'uid'  : res.data.uid,
							'subId': item.type == 2 ? item.id : ''
						}
					}))

					this.$message.success('登录成功')
					localStorage.setItem('uid', res.data.uid)
					localStorage.setItem('token', res.data.access_token)
					localStorage.setItem('accountKey', this.changeBackground)
					localStorage.setItem('masterAccountPhone', res.data.masterAccount)
					localStorage.setItem('sub_id', item.id)
					localStorage.setItem('isMasterAccount', item.type)

					if (item.type == 1) {
						this.$store.commit("changePermissionButton", "all");
					}

					//登录成功给官网localstorage发送phoneNumber
					this.global.sendPhoneNumber()
					this.$store.commit('changeProd', res.data.prod);

					if (typeof this.redirectUrl != 'undefined' && this.redirectUrl != '') {
						if (typeof this.$route.query.userToken != 'undefined' && this.$route.query.userToken != '') {
							this.$router.push(this.redirectUrl + '?userToken=' + encodeURIComponent(this.$route.query.userToken))
						} else {
							this.$router.push(this.redirectUrl)
						}
					} else {
						this.$router.push('/home')
					}

				}
			},
		},

		created () {
			this.redirectUrl = this.$route.query.redirectUrl
			this.getList()
		}
	};
</script>

<style lang='less' scoped>
	.home {
		width: 100%;
		height: 100%;
		min-width: 1200px;
		overflow-y: auto;
	}

	.login-swiper {
		width: 100%;
		height: 100px;
		background-image: url("../../assets/background.png");
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

	/deep/ .ant-radio-group {
		width: 100%;
		display: inline;
	}

	/deep/ .ant-radio-button-wrapper-checked {
		border: 2px solid #01b065 !important;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 300px;
		height: 100px;
		line-height: 100px;
		padding: 0 10px;
		margin: 10px 5px;
		font-size: 18px;
		border: 1px solid rgba(0, 0, 0, 0.09);
		transition: all 0.3s;
		border-radius: 2px;
		box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
	}

	/deep/ .ant-radio-button-wrapper:hover {
		box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.25);
	}

	.text {
		margin-left: 5px;
		vertical-align: bottom;
		display: inline-block;
		width: calc(100% - 70px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tab {
		position: absolute;
		line-height: 40px;
		background: #E9E9E9;
		width: 80px;
		font-size: 16px;
		right: 0;
		top: -20px;
		text-align: center;
		border-radius: 4px;
	}

	.box {
		border: 1px solid #E8E8E8;
		transition: all 0.3s;
		border-radius: 2px;
	}

	.box:hover {
		box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.15) !important;
		border-color: rgba(0, 0, 0, 0.09);
	}
</style>