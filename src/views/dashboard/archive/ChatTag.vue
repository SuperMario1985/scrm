<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<div class="content-msg">
				<p style="margin-bottom: 2px;">
					基于开启会话存档功能，当客户与员工聊天中，客户命中关键词时，该员工可自动打上客户标签，实现对客户标签的自动化管理，客户画像更智能精准。</p>
				<p style="margin-bottom: 2px;">
					1、标签规则删除后，其关联的客户标签，在生效员工列表，该标签不再显示。</p>
				<p style="margin-bottom: 0px;">
					2、标签规则设置的关键词，当其被修改或是删除，在生效员工列表，查看详情时，依然可看到之前所触发关键词的客户打标签的记录。</p>
			</div>
			<div style="height: 100%;padding-top: 20px;">
				<div style="padding: 0 20px;">
					<span @click="changeTabs('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}" v-has="'chatTag-employee'">生效员工</span>
					<span @click="changeTabs('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}" v-has="'chatTag-rule'">标签规则</span>
				</div>
				<div style="background: #fff;margin: 0 20px 20px;padding: 12px 20px;">
					<EffectiveEmployee @changeCorpId="changeCorpId" @changeScroll="changeScroll" :id="corpId" ref="employee" v-if="tabKey == 1"></EffectiveEmployee>
					<TagRule @changeCorpId="changeCorpId" @changeScroll="changeScroll" :id="corpId" ref="tagRule" v-if="tabKey == 2"></TagRule>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import EffectiveEmployee from  './chatTag/EffectiveEmployee'
	import TagRule from "./chatTag/TagRule";
	export default {
		name      : "archiveChat",
		components: {TagRule, EffectiveEmployee},
		data () {
			return {
				tabKey  : 1,
				tabindex: 3,
				corpId : localStorage.getItem('corpId')
			}
		},
		created () {
		},
		methods   : {
			changeTabs (key) {
				this.tabKey = key
			},
			changeCorpId(corpId) {
				this.corpId = corpId
				// this.$refs.employee.corpId = corpId
				// this.$refs.employee.chooseNum0 = 0
				// this.$refs.employee.checkedList = []
				// this.$refs.tagRule.corpId = corpId
			},
			changeScroll() {
				document.getElementsByClassName('list')[0].scrollTo(0, 0)
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