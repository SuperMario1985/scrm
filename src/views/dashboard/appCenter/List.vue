<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<div style="height: 100%;padding-top: 20px;">
				<div style="padding: 0 20px;">
					<span @click="changeTabs('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}" v-has="'chatTag-employee'">应用中心</span>
					<!-- <span @click="changeTabs('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}" v-has="'chatTag-rule'">行业集成</span> -->
				</div>
				<div style="background: #fff;margin: 0 20px 20px;padding: 12px 20px;">
					<Application v-if="tabKey == 1"></Application>
					<Integration style="margin-top: 27px;" v-if="tabKey == 2"></Integration>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Application from "./Application";
	import Integration from  '../Integration'
	export default {
		name      : "archiveChat",
		components: {Application, Integration},
		data () {
			return {
				tabKey  : 1,
				tabindex: 3,
			}
		},
		created () {
		},
		methods   : {
			changeTabs (key) {
				this.tabKey = key
			},
		}
	}
</script>

<style scoped lang="less">
	@import '../../../style/_style.less';
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
		color: #01b065;
		background: #FFF;
	}
	.content-msg {
		min-width: 845px;
		width: calc(100% - 40px);
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 20px 0px 0px 20px;
		text-align: left;

	}
</style>