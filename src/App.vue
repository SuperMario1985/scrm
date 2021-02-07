<template>
	<a-locale-provider :locale="zh_CN">
		<router-view v-if="isRouterAlive"></router-view>
	</a-locale-provider>
</template>

<script>
	import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
	import MD5 from "js-md5";
	import {message} from "ant-design-vue";

	export default {
		name     : "app",
		provide () {
			return {
				reload     : this.reload,
				getFileType: this.getFileType
			}
		},
		data () {
			return {
				zh_CN,
				isRouterAlive: true
			};
		},
		created () {
			Notification.requestPermission();

			this.initSessionId();
			//页面刚进入时开启长连接
			this.ws.initWebSocket();
			//页面刚进入时获取微信公众号列表，设置第一个公众号为默认
			// if (localStorage.getItem('wxNum')) {
			// 	this.$store.commit('changeWxNum', localStorage.getItem('wxNum'));
			// } else if (localStorage.getItem('authorizer_type')) {
			// 	this.$store.commit('changeAuthorizerType', localStorage.getItem('authorizer_type'));
			// } else if (localStorage.getItem('nick_name')) {
			// 	this.$store.commit('changeWxNickName', localStorage.getItem('nick_name'));
			// } else {
			// 	this.$store.dispatch('getWx')
			// }

			// if (localStorage.getItem('corpId')) {
			// 	this.$store.commit('changeCorpId', localStorage.getItem('corpId'));
			// } else if (localStorage.getItem('corpAuthType')) {
			// 	this.$store.commit('changeCorpAuthType', localStorage.getItem('corpAuthType'));
			// } else if (localStorage.getItem('corpName')) {
			// 	this.$store.commit('changeCorpName', localStorage.getItem('corpName'));
			// } else {
			// 	this.$store.dispatch('getCorp')
			// }

			//在页面加载时读取sessionStorage里的状态信息
			// if (localStorage.getItem("store")) {
			// 	this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(localStorage.getItem("store"))))
			// }
			//在页面刷新时将vuex里的信息保存到sessionStorage里
			// window.addEventListener("beforeunload", () => {
			// 	if (!this.$store.state.ignorePath.includes(this.$route.path)) {
			// 		localStorage.setItem("store", JSON.stringify(this.$store.state))
			// 	}
			// })
		},
		destroyed: function () {
			//页面销毁时关闭长连接
			this.ws.websocketClose();
		},
		methods  : {
			initSessionId () {
				let sessionId = this.global.session_id;
				if (!sessionId) {
					let userAgent = navigator.userAgent.toLowerCase();
					let sessionId = MD5(userAgent + new Date().valueOf());
					this.global.setSessionId(sessionId);
				}
			},
			saveState () {
				// localStorage.setItem('wxNum', this.$store.state.wxNum)
				// localStorage.setItem('authorizer_type', this.$store.state.authorizer_type)
				// localStorage.setItem('wxNickName', this.$store.state.wxNickName)
			},
			reload (home = false) {
				this.isRouterAlive = false
				this.$nextTick(() => {
					if (home) {
						if (this.$route.name != 'home') {
							this.$router.push('/home')
						}
					}

					this.isRouterAlive = true
				})
			},
			getFileType (file) {
				let fileType = ''
				let nameData = file.name.split('.')
				switch (nameData[nameData.length - 1]) {
					case "doc":
						fileType = 'application/msword'

						break
					case "docx":
						fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

						break
					case "xls":
						fileType = 'application/vnd.ms-excel'

						break
					case "xlsx":
						fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

						break
					case "csv":
						fileType = 'text/csv'

						break
					case "ppt":
						fileType = 'application/vnd.ms-powerpoint'

						break
					case "pptx":
						fileType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

						break
					case "txt":
						fileType = 'text/plain'

						break
					case "pdf":
						fileType = 'application/pdf'

						break
					case "xmind":
						fileType = 'application/octet-stream'

						break
					default:
						break
				}

				return fileType
			}
		},
		mounted () {
			window.addEventListener('beforeunload', this.saveState)
		},
	};
</script>

<style>
	#app {
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2C3E50;
		margin-top: 60px;
	}

	.float-left {
		float: left;
	}

	.float-right {
		float: right;
	}

	.text-left {
		text-align: left;
	}

	.text-right {
		text-align: right;
	}

</style>
