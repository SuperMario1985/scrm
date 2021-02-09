<template>
	<div class="container msg-container" style="top:0; right: 0; bottom: 0; left: 0; position: absolute;">
		<a-spin tip="加载中..." size="large" :spinning="isLoading">
			<fans-msg v-if="isWx"></fans-msg>
			<mini-msg v-if="isMini"></mini-msg>
		</a-spin>
	</div>

</template>

<script>
	import FansMsg from "./FansMsg.vue";
	import MiniMsg from "./MiniMsg.vue";

	export default {
		name      : "Msg",
		provide () {
			return {
				changeLoading: this.changeLoading,
				changeType   : this.changeType,
			}
		},
		components: {
			FansMsg,
			MiniMsg,
		},
		data () {
			return {
				isLoading: true, //Loading 组件显示与隐藏
				isWx     : true,    // 是否为公众号消息
				isMini   : true,   // 是否为小程序消息
			}
		},
		methods   : {
			changeLoading (flag = false) {
				this.isLoading = flag
			},
			changeType (type = 'wx') {
				if (type == "wx") {
					this.isWx = true
					this.isMini = false
				} else if (type == "mini") {
					this.isWx = false
					this.isMini = true
				}
			},
		},
		created () {
			if (localStorage.getItem('permissionButton') == 'all') {
				this.isWx = true
				this.isMini = false
			} else {
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				this.isWx = permissionButton.indexOf('fansMsg') == -1 ? false : true
				if(this.isWx){
					this.isMini = false
				}else {
					this.isMini = permissionButton.indexOf('miniMsg') == -1 ? false : true
				}
			}
		},
		destroyed () {
			// 注销粉丝消息页面的获取消息后的回调
			this.ws.setCallback();
		}
	}
</script>

<style lang='less' scoped>
	/deep/ .ant-spin-nested-loading,
	/deep/ .ant-spin-container {
		height: 100%;
	}
</style>
<style lang="less">
	.msg-container {
		.ant-tabs {
			&.ant-tabs-left {
				.ant-tabs-left-content {
					padding: 0;
					height: 100%;
				}

				.ant-tabs-left-bar {
					.ant-tabs-tab {
						text-align: left;
					}
				}
			}
		}
	}
</style>