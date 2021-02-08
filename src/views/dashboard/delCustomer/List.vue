<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<div style="height: 100%;padding-top: 20px;">
				<div style="padding: 0 20px;">
					<span @click="changeTabs('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}"
					      v-has="'deleteCustomer-look'">删除记录</span>
					<span @click="changeTabs('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}"
					      v-has="'deleteCustomer-list'">生效员工</span>
				</div>
				<div style="background: #fff;margin: 0 20px 20px;padding: 12px 20px;">
					<Record v-has="'deleteCustomer-look'" @changeCorpId="changeCorpId" :id="corpId" @changeScroll="changeScroll" v-if="tabKey == 1"></Record>
					<EffectEmployee v-has="'deleteCustomer-list'" @changeCorpId="changeCorpId" :id="corpId" @changeScroll="changeScroll" v-if="tabKey == 2"></EffectEmployee>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Record from './Record'
	import EffectEmployee from "./EffectEmployee";

	export default {
		name      : "delCustomer",
		components: {
			EffectEmployee,
			Record
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
				if(permissionButton.indexOf('deleteCustomer-look') != -1){
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
		}
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