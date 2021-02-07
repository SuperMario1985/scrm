<template>
	<div class="login">
	</div>
</template>

<script>

	export default {
		components: {},
		data () {
			return {};
		},

		methods: {
			//登录
			async changeAccount (code) {
				const {data: res} = await this.axios.post(
					"login/quick-sign",
					{
						code       : code,
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
							'subId': ''
						}
					}))

					localStorage.setItem('uid', res.data.uid)
					localStorage.setItem('token', res.data.access_token)
					localStorage.setItem('accountKey', 1)
					this.$store.commit('changeProd', res.data.prod);
					localStorage.setItem('masterAccountPhone', res.data.masterAccount)
					//登录成功给官网localstorage发送phoneNumber
					this.global.sendPhoneNumber()

					localStorage.setItem('sub_id', res.data.uid)
					localStorage.setItem('isMasterAccount', 1)
					this.$store.commit("changePermissionButton", "all");

					this.$message.success('登录成功')
					localStorage.setItem('phoneNumber', res.data.account)
					localStorage.setItem('accountNum', res.data.num)
					localStorage.setItem('masterAccountPhone', res.data.masterAccount)//主账户的手机号

					localStorage.removeItem('wxArr')
					localStorage.removeItem('corpArr')

					this.$router.push('/home')
				}
			},
		},

		created () {
			let code = this.$route.query.code
			let referrer = window.document.referrer.split('?')[0]
			if(referrer == this.$store.state.commonUrl + '/admin/user-manage/user-statistics' || referrer == this.$store.state.commonUrl + '/admin/user-manage/user-merchant-statistics'){
				//登录成功给官网localstorage发送登录状态false
				this.global.sendPhoneNumber(false)

				this.global.clearLocalStorage()
				this.$store.commit('clear');
				this.changeAccount(code)
			}else {
				this.$message.error('非正常登录，请重新登录进入')
				this.$router.push('/login')
			}
		}
	};
</script>

<style lang='less' scoped>
</style>