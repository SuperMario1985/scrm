<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<div style="height: 100%;padding-top: 20px;">
				<div class="content-msg" style="margin: 10px 20px 20px 20px;">
					基于员工开启会话存档功能，当客户与员工聊天时，客户命中关键词，系统可智能推荐对应内容素材，无需查找，一键发送。
				</div>
				<div style="padding: 0 20px;">
					<span v-has="'smartRecommended-employee'" @click="changeTabs('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}">生效员工</span>
					<span v-has="'smartRecommended-rule'" @click="changeTabs('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}">推荐规则</span>
				</div>
				<div style="background: #fff;margin: 0 20px 20px;padding: 12px 20px;">
					<EffectEmployee @changeCorpId="changeCorpId" :id="corpId" @changeScroll="changeScroll" v-show="tabKey == 1"></EffectEmployee>
					<RecommendedRule ref="recommendedRule" @changeCorpId="changeCorpId" :id="corpId" @changeScroll="changeScroll" v-show="tabKey == 2"></RecommendedRule>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import RecommendedRule from './RecommendedRule'
	import EffectEmployee from "./EffectEmployee";

	export default {
		name      : "smartRecommendedList",
		components: {
			EffectEmployee,
			RecommendedRule
		},
		data () {
			return {
				tabKey  : 1,
				corpId : localStorage.getItem('corpId')
			}
		},
		created () {
			if(localStorage.getItem('isMasterAccount') == 2){
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				let that = this
				if(permissionButton.indexOf('smartRecommended-employee') != -1){
					that.tabKey = '1'
				}else if(permissionButton.indexOf('smartRecommended-rule') != -1) {
					that.tabKey = '2'
				} else {
					that.tabKey = '3'
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
			if (from.path == '/smartRecommended/ruleAdd' && typeof to.query.isRefresh != 'undefined') {
				next(vm => {
					vm.tabKey = 2
					if(typeof vm.$refs.recommendedRule.page != 'undefined') {
						let page = vm.$refs.recommendedRule.page
						let pageSize = vm.$refs.recommendedRule.pageSize
						vm.$refs.recommendedRule.getRuleList(page, pageSize)
					}
				});
			} else if(from.path == '/smartRecommended/ruleAdd' && typeof to.query.isRefresh == 'undefined') {
				next(vm => {
					vm.tabKey = 2
					if(typeof vm.$refs.recommendedRule.getRuleList == 'function') {
						vm.$refs.recommendedRule.getRuleList()
					}
				});
			} else {
				next()
			}
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	.list {
		width: 100%;
		max-height: 100%;
		position: absolute;
		overflow-y: auto;
	}
	.content-msg {
		width: calc(100% - 40px);
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
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
		width: 100%;
		padding-right: 40px;
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