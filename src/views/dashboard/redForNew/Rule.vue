<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout
					style="position: absolute; top:0; bottom:0;left: 0; right:0; overflow-x: hidden; overflow-y: auto;"
					class="scroll">
				<!-- 头部 -->
				<a-layout-header>红包规则</a-layout-header>
				<!-- 内容 -->
				<a-layout-content>
					<div class="content-hd">
						<a-col style="float:left;">
							<a-input placeholder="搜索规则名称" @keyup.enter="find" v-model="title"
							         style="width: 150px;margin-right: 10px;"/>
							<a-button type="primary" style="margin: 0px 10px;" @click="find">查找</a-button>
							<a-button @click="clear">清空</a-button>
						</a-col>
						<a-col style="float:right;" v-has="'redRuleList-add'">
							<a-button class="btn-primary" icon="plus" @click="addRule" type="primary">
								新增红包规则
							</a-button>
						</a-col>
					</div>
					<!-- 表格部分 -->
					<div class="content-bd">
						<a-spin tip="Loading..." size="large" :spinning="isLoading">
							<a-table :columns="columns" :dataSource="ruleList" :pagination="false"
							         :rowClassName="rowClassName" v-has="'redRuleList-list'">
								<span slot="type" slot-scope="text, record">
									<span v-if="record.type == 1">定额 {{record.fixed_amount}}元</span>
									<span v-if="record.type == 2">拼手气 {{record.min_random_amount}}-{{record.max_random_amount}}元</span>
								</span>
								<span slot="sketch" slot-scope="text, record">
									<div style="display: inline-block">
										<img :src="commonUrl + record.pic_url"
										     style="max-width: 100px;max-height: 100px;"/>
									</div>
									<div style="display: inline-block;margin-left: 10px;vertical-align: middle;width: calc(100% - 120px);">
										<p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{record.title}}</p>
										<p style="word-break: break-word;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;line-clamp: 2;-webkit-box-orient: vertical;">{{record.des || '--'}}</p>
									</div>
								</span>
								<span slot="thanking" slot-scope="text, record">
									<p>{{record.thanking || '--'}}</p>
								</span>
								<span slot="action" slot-scope="text, record, index">
										<div style="width: 150px;">
											<div style="display: inline-block">
												<a-button v-has="'redRuleList-edit'" @click="edit(record.id)"
											          style="margin: 0 5px 5px 0">编辑</a-button>
											</div>
											<!--										<a-button @click="detailActivity(record.id)"-->
											<!--										          style="margin: 0 5px 5px 0">详情</a-button>-->
											<div style="display: inline-block">
												<a-button v-has="'redRuleList-delete'"
											          @click="deleteActivity(record.id, record.name)"
											          style="margin: 0 5px 5px 0">删除</a-button>
											</div>
										</div>
									</span>
							</a-table>

							<!-- 分页 -->
							<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
							     v-has="'redRuleList-list'"
							     v-show="total > 0">
								<div style="height: 32px;float: left;line-height: 32px;">
									共
									<span style="color: blue">{{total}}</span>条
								</div>
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
									              :current="page"
									              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
									              @change="changePage"
									              @showSizeChange="showSizeChange"/>
								</div>
							</div>
						</a-spin>
					</div>
				</a-layout-content>

			</a-layout>
		</div>
	</div>
</template>

<script>
	// 规则列表
	const columns = [
		{
			title    : "规则名称",
			dataIndex: "name",
			key      : "name",
			width    : '180px'
		},
		{
			title      : "发放类型",
			dataIndex  : "type",
			key        : "type",
			width      : '20%',
			scopedSlots: {customRender: "type"}
		},
		{
			title      : "推送文案",
			dataIndex  : "sketch",
			key        : "sketch",
			width      : '25%',
			scopedSlots: {customRender: "sketch"}
		},
		{
			title      : "感谢语",
			dataIndex  : "thanking",
			key        : "thanking",
			width      : '180px',
			scopedSlots: {customRender: "thanking"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '200px',
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name: "redForNewRule",
		data () {
			return {
				suite_id   : 1,//应用ID
				title      : '',// 输入框内容
				ruleList   : [],// 表格数组
				isLoading  : true, //Loading 组件显示与隐藏
				commonUrl  : this.$store.state.commonUrl,
				//表格部分
				columns,
				//分页
				total      : 0, //总条数
				quickJumper: false, // 是否显示快速跳转的控件
				page       : 1, //页码
				pageSize   : 15, //每页数据条数
			};
		},

		methods: {
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 点击搜索
			find () {
				this.getRuleList()
			},
			// 点击清空
			clear () {
				this.status = []
				this.title = ''
				this.page = 1
				this.pageSize = 15
				this.getRuleList()
			},
			addRule () {
				this.$router.push('/redForNew/ruleAdd')
			},
			// 获取表格内容
			async getRuleList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("red-pack-rule/rule-list", {
					uid     : localStorage.getItem('uid'),
					name    : this.title,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.ruleList = res.data.list;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			//删除
			deleteActivity (id, name) {
				let that = this;
				that.$confirm({
					title     : "确定删除规则【" + name + "】？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id)
					}
				});
			},
			// 改变规则状态
			async changeStatus (id) {
				const {data: res} = await this.axios.post("red-pack-rule/rule-change-status", {
					uid: localStorage.getItem("uid"),
					id : id,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					//删除判断最后一页是否只有一条
					if (this.ruleList.length == 1 && this.page > 1) {
						this.getRuleList(this.page - 1, this.pageSize)
					} else {
						this.getRuleList(this.page, this.pageSize)
					}
				}
			},
			// 编辑
			edit (id) {
				this.$router.push('/redForNew/ruleAdd?id=' + id)
			},
			// 分页
			changePage (page, pageSize) {
				this.getRuleList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
				})
			},
			showSizeChange (page, pageSize) {
				this.getRuleList(1, pageSize);
			}
		},

		mounted () {
			this.getRuleList()
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/redForNew/ruleAdd' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getRuleList(vm.page, vm.pageSize)
				});
			} else if ((from.path == '/redForNew/ruleAdd' && typeof to.query.isRefresh == 'undefined') || from.path != '/redForNew/ruleAdd') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.status = []
					vm.title = ''
					vm.activityTime = []
					vm.page = 1
					vm.pageSize = 15
					vm.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
					vm.getRuleList()
				});
			} else {
				next()
			}
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
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
		margin: 0 20px 20px;
		min-width: 885px;
		width: 100%;
		padding-right: 40px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.btn-primary {
		margin-left: 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 90px;
		margin: 0px;
		text-align: center;
	}
</style>
