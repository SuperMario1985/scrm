<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<div style="height: 100%;padding-top: 20px;">
				<div style="padding: 0 20px;">
					<span @click="changeTabs('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}"
					      v-has="'violations-employee'">员工违规</span>
					<span @click="changeTabs('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}"
					      v-has="'violations-chat'">群聊违规</span>
				</div>
				<div style="background: #fff;margin: 0 20px 20px;padding: 12px 20px;">
					<userNotice @changeCorpId="changeCorpId" :id="corpId" @changeScroll="changeScroll" ref="userNotice" v-if="tabKey == 1"></userNotice>
					<groupNotice @changeCorpId="changeCorpId" :id="corpId" @changeScroll="changeScroll" ref="groupNotice" v-if="tabKey == 2"></groupNotice>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import groupNotice from './GroupNotice'
	import userNotice from './UserNotice'

	export default {
		name      : "ViolationsNotice",
		components: {
			groupNotice, userNotice
		},
		data () {
			return {
				tabKey  : 1,
				tabindex: 3,
				corpId : localStorage.getItem('corpId')
			}
		},
		created () {
			if(localStorage.getItem('isMasterAccount') == 2){
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				let that = this
				if(permissionButton.indexOf('violations-employee') != -1){
					that.tabKey = '1'
				}else {
					that.tabKey = '2'
				}
				that.$forceUpdate()
			}else {
				this.tabKey = '1'
			}
		},
		methods   : {
			changeTabs (key) {
				this.tabKey = key
			},
			changeScroll() {
				document.getElementsByClassName('list')[0].scrollTo(0, 0)
			},
			changeCorpId(corpId) {
				this.corpId = corpId
			}
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if ((from.path != '/archive/userNoticeAdd' || typeof to.query.isRefresh == 'undefined') && from.path != '/archive/groupNoticeAdd') {
				// 员工违规新建提醒
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.tabindex++
					if(localStorage.getItem('isMasterAccount') == 2){
						let permissionButton = localStorage.getItem('permissionButton').split(',')
						if(permissionButton.indexOf('violations-employee') != -1){
							vm.tabKey = '1'
						}else {
							vm.tabKey = '2'
						}
						vm.$forceUpdate()
					}else {
						vm.tabKey = '1'
					}
					vm.$nextTick(function () {
						vm.$refs.userNotice.isLoading = true
						vm.$refs.userNotice.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
						vm.$refs.userNotice.name = ''
						vm.$refs.userNotice.status = 0
						vm.$refs.userNotice.chooseNum1 = 0
						vm.$refs.userNotice.checkedList1 = []
						vm.$refs.userNotice.selectedRowKeys = []
						vm.$refs.userNotice.page = 1
						vm.$refs.userNotice.pageSize = 15
						if (to.query.agentId) {
							vm.agentId = to.query.agentId
						}
						vm.$refs.userNotice.selectedRowKeys = []
						vm.$refs.userNotice.getAgentList(vm.agentId)
					})
				});
			} else if (from.path == '/archive/groupNoticeAdd' && typeof to.query.isRefresh == 'undefined') {
				// 群聊违规提醒新建
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.tabKey = '2'
					vm.$nextTick(function () {
						vm.$refs.groupNotice.isLoading = true
						vm.$refs.groupNotice.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
						vm.$refs.groupNotice.name = ''
						vm.$refs.groupNotice.chooseNum1 = 0
						vm.$refs.groupNotice.chatArr = []
						vm.$refs.groupNotice.selectedRowKeys = []
						vm.$refs.groupNotice.page = 1
						vm.$refs.groupNotice.pageSize = 15
						if (to.query.agentId) {
							vm.agentId = to.query.agentId
						}
						vm.$refs.groupNotice.getAgentList(vm.agentId)
					})
				});
			} else if (from.path == '/archive/groupNoticeAdd') {
				// 群聊违规提醒编辑或返回
				next(vm => {
					vm.tabKey = '2'
					vm.$nextTick(function () {
						vm.$refs.groupNotice.agentId = to.query.agentId || ''
						vm.$refs.groupNotice.getNoticeList(vm.$refs.groupNotice.page, vm.$refs.groupNotice.pageSize)
					})
				})
			} else if (from.path == '/archive/userNoticeAdd') {
				// 员工违规提醒编辑或返回
				next(vm => {
					vm.tabKey = '1'
					vm.$nextTick(function () {
						vm.$refs.userNotice.agentId = to.query.agentId
						vm.$refs.userNotice.getNoticeList(vm.$refs.userNotice.page, vm.$refs.userNotice.pageSize)
					})
				})
			}
		},
	}
</script>

<style scoped>
	.list {
		width: 100%;
		max-height: 100%;
		position: absolute;
		overflow-y: auto;
	}

	/deep/ .ant-tabs-bar {
		margin: 0;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0px;
	}

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 835px;
		width: 100%;
		line-height: 50px;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
		border-right: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px 20px;
		min-width: 835px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.tabBtn {
		margin: 0;
		margin-right: 2px;
		padding: 10px 16px;
		line-height: 38px;
		background: #FAFAFA;
		border: 1px solid #E8E8E8;
		border-bottom: 0;
		border-radius: 4px 4px 0 0;
		cursor: pointer;
	}

	.activeBtn {
		color: #1890FF;
		background: #FFF;
	}
</style>