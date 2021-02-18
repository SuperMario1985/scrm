<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden;">
				<!-- 左侧 -->
				<a-layout-sider>
					<!-- 企业微信 -->
					<eWechat @changeWxId="handleWxId" v-if="corpLen > 1"></eWechat>
				</a-layout-sider>
				<a-layout style="position: absolute; top:0; bottom:0; right:0;  overflow-x: hidden; overflow-y: auto;"
				          :style="corpLen > 1 ? {left: '250px'} : {left: '0px'}" class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>被客户删除记录</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">被客户删除记录</div>
						<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
							当你被微信联系人从好友列表中删除，企业微信营销工具会自动发一条消息通知你。你也可以在企业微信营销工具后台查看历史被删除记录，知道是谁在什么时间把你删除。配合带参数的对外名片功能，也可以知道这个人是从什么渠道来的。
						</div>
						<div class="content-hd">
							<a-select @change="changeTimeType" v-model="timeType" style="width: 120px;margin-right:10px">
								<a-select-option :value="1">删除时间</a-select-option>
								<a-select-option :value="2">添加时间</a-select-option>
							</a-select>
							<a-range-picker
									style="width: 220px;margin-right: 10px;"
									:disabledDate="disabledDateDay"
									format="YYYY-MM-DD"
									@change="changeSelectDate"
									v-model="deleteDate"
							/>
							<a-button @click="showDepartmentList">
								选择部门成员
							</a-button>
							<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
							<a style="margin-left: 10px;" v-show="chooseNum > 0"
							   @click="clearDepartmentList">
								重置
							</a>
							<div style="height: 60px; float: right;">
								<a-dropdown v-has="'customRecord-export'">
									<a-menu slot="overlay" @click="chooseDownType">
										<a-menu-item key="0">当前页导出</a-menu-item>
										<a-menu-item key="1">全部导出</a-menu-item>
									</a-menu>
									<a-button type="primary"  style="float: right;margin-top: 14px;">导出
										<a-icon style="color: #FFFFFF;" type="down"/>
									</a-button>
								</a-dropdown>
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="deleteList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'customRecord-list'">
									<div slot="customerInfo" style="width: 200px;" slot-scope="text, record, index">
										<a-avatar v-if="text.avatar" shape="square" :size="42" :src="text.avatar"
										          style="display: inline-block; vertical-align: top;"/>
										<img style="width: 42px;height: 42px;display: inline-block; vertical-align: top;" v-if="!text.avatar"
										     src="../../../assets/useradvart.png"/>
										<div style="display: inline-block; margin-left:10px; line-height: 42px;">
											<div style="width: 140px;line-height: 20px;">{{text.name}}
												<span :class="text.corp_name != null ? 'corp-name' : 'wx-name'">
													<template
															v-if="text.corp_name != null">@{{text.corp_name}}</template>
													<template v-else>@微信</template>
												</span>
												<a-icon slot="prefix" type="man" style="color: #427EBA;"
												        v-if="text.gender=='男性'"/>
												<a-icon
														slot="prefix"
														type="woman"
														style="color: #ED4997;"
														v-if="text.gender=='女性'"
												/>
											</div>
										</div>
									</div>
									<div slot="tag_name" slot-scope="text, record, index">
										<span v-if="record.customerInfo.tag_name.length == 0 && record.customerInfo.per_name.length == 0">--</span>
										<span v-if="record.customerInfo.per_name.length == 0 && record.customerInfo.tag_name.length > 0">
											<a-tag v-for="item in record.customerInfo.tag_name" style="margin-top: 5px;"
											       color="blue">
												{{item}}
											</a-tag>
										</span>
										<span v-if="record.customerInfo.tag_name.length == 0 && record.customerInfo.per_name.length > 0">
											私有标签：<a-tag v-for="item in record.customerInfo.per_name"
											            style="margin-top: 5px;"
											            color="blue">
											{{item}}
										</a-tag>
										</span>
										<template
												v-if="record.customerInfo.tag_name.length > 0 && record.customerInfo.per_name.length > 0">
											<div>
												公有标签：
												<a-tag v-for="item in record.customerInfo.tag_name"
												       style="margin-top: 5px;" color="blue">
													{{item}}
												</a-tag>
											</div>
											<div>
												私有标签：
												<a-tag v-for="item in record.customerInfo.per_name"
												       style="margin-top: 5px;" color="blue">
													{{item}}
												</a-tag>
											</div>
										</template>
									</div>
									<div slot="tag_name2">
										标签
										<a-tooltip placement="bottom">
											<template slot="title">
												<div>企业微信给客户打标签：分公有标签和私有标签</div>
												<div>公有标签：即企业标签。管理员创建，所有员工可见。</div>
												<div>私有标签：即个人标签。员工创建，仅自己可见。</div>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</div>
									<div slot="action" slot-scope="text, record, index">
										<a-button @click="handleShowDetail(record.key)"
										          style="margin: 0 5px 5px 0">客户详情</a-button>
									</div>
								</a-table>
								<!--分页-->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'customRecord-list'">
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
						<!--部门选择框-->
						<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum"
						                  :callback="modalVisibleChange3" :is_special="1"></chooseDepartment>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import eWechat from "@/components/eWeChat/eWechat.vue";
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import moment from 'moment'

	const columns = [
		{
			title      : "客户信息",
			dataIndex  : "customerInfo",
			width      : "200",
			scopedSlots: {customRender: "customerInfo"},
			key        : "customerInfo"
		},
		{
			// title      : "所属标签",
			dataIndex  : "tag_name",
			key        : "tag_name",
			width      : "30%",
			slots      : {title: "tag_name2"},
			scopedSlots: {customRender: "tag_name"},
		},
		{
			title    : "归属成员",
			dataIndex: "member",
			key      : "member"
		},
		{
			title    : "备注",
			dataIndex: "remark",
			key      : "remark"
		},
		{
			title    : "删除时间",
			dataIndex: "del_time",
			key      : "del_time"
		},
		{
			title    : "添加时间",
			dataIndex: "createtime",
			key      : "createtime"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"},
		}
	];

	export default {
		name      : 'customRecord',
		components: {eWechat, chooseDepartment},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpLen            : JSON.parse(localStorage.getItem('corpArr')).length,
				corpId             : corpId,//企业微信选中的id
				isLoading          : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				//分页
				total              : 1, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				page               : 1, //页码
				pageSize           : 15, //每页数据条数，默认15
				deleteList         : [],//表格中删除列表
				checkedList        : [],//选择的成员id数组
				user               : [],//选择的成员数据
				showModalDepartment: false, //成员选择框显示与隐藏
				chooseNum          : 0,//部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				deleteDate         : null, // 删除时间筛选
				timeType           : 1,
			};
		},

		methods: {
			//左侧企业微信
			handleWxId (value) {
				this.isLoading = true
				this.corpId = value
				this.getDeleteList()
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			changeTimeType() {
				this.deleteDate = null
				this.getDeleteList()
			},
			disabledDateDay (current) {
				return current.valueOf() > new Date().getTime();
			},
			changeSelectDate(date, dateString) {
				this.deleteDate = date
				this.getDeleteList()
			},
			//部门选择弹窗组件
			showDepartmentList () {
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
			},
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.checkedList = arr
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.user = JSON.parse(JSON.stringify(list))
					} else {
						this.user = []
					}
					this.getDeleteList()
				}
				this.showModalDepartment = false
			},
			//重置
			clearDepartmentList () {
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.getDeleteList()
			},
			// 选择下载方式
			chooseDownType (e) {
				this.is_export = 1
				this.getDeleteList(this.page, this.pageSize, 1, e.key)
			},
			//详情
			handleShowDetail (id) {
				debugger
				let query = {
					id: id
				}
				this.$router.push({path: '/customRecord/detail', query: query})
			},
			moment,
			//获取表格内容
			async getDeleteList (page = 1, pageSize = this.pageSize, is_export = '', is_all = 0) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-external-contact-follow-user/list", {
					suite_id : 1,
					corp_id  : this.corpId,
					user_ids : this.checkedList,
					time_type: this.timeType,
					sData    : this.deleteDate == null || this.deleteDate.length == 0 ? '' : moment(this.deleteDate[0]).format('YYYY-MM-DD'),
					eData    : this.deleteDate == null || this.deleteDate.length == 0 ? '' : moment(this.deleteDate[1]).format('YYYY-MM-DD'),
					page     : page,
					page_size: pageSize,
					is_all   : is_all,
					is_export: is_export
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if (is_export == 1) {
						window.open(res.data.url);
						this.isLoading = false;
					} else {
						this.deleteList = res.data.info;
						this.isLoading = false;
						this.total = parseInt(res.data.count);
						this.page = page;
						this.pageSize = pageSize;
						this.quickJumper = this.total > this.pageSize;
					}
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getDeleteList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 90)
				})
			},
			showSizeChange (page, pageSize) {
				this.getDeleteList(1, pageSize);
			}
		},

		created () {
			this.getDeleteList()
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建

			if (from.path == '/customRecord/detail') {
				next(vm => {
					vm.getDeleteList(vm.page)
				})
			} else {
				next(vm => {
					vm.getDeleteList();
				});
			}

			next()
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
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
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
		/*width: 145px;*/
		/*height: 30px;*/
		margin-left: 20px;
		/*text-align: left;*/
		/*padding: 0;*/

		/*span {*/
		/*	display: inline-block;*/
		/*	width: 90px;*/
		/*	height: 30px;*/
		/*	line-height: 30px;*/
		/*	text-align: center;*/
		/*}*/
	}

	.tag-name {
		padding: 6px 14px;
		height: 34px;
		font-size: 13px;
		border: 1px solid #D9D9D9;
		background-color: transparent !important;
		color: rgba(0, 0, 0, 0.65);
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}
</style>
