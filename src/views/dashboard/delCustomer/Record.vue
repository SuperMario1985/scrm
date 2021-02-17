<template>
	<div>
		<div>
			<div class="content-msg">
				<p style="margin-bottom: 2px;">
					为了防止员工恶意删除客户的行为，本系统里采用了员工删除客户提醒功能，来监督员工删除客户的行为，一旦发现，可以根据其行为的影响程度给予相应的处罚。
				</p>
				<p style="margin-bottom: 0px; color: #FF562D;">
					根据当前子账号所设置的员工可见范围，查看员工删除客户的数据记录。如部门负责人，只看到该部门成员删除客户的数据。
				</p>
			</div>
			<div class="content-hd">
				<a-select @change="changeTimeType" v-model="timeType" style="width: 120px;margin-left: 10px;">
					<a-select-option :value="1">删除时间</a-select-option>
					<a-select-option :value="2">添加时间</a-select-option>
				</a-select>
				——
				<a-range-picker
						style="width: 220px; margin-right: 10px;"
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
			</div>
			<div style="margin-bottom: 15px;">
				共
				<span style="color: blue">{{total}}</span>
				条
				<div style="float: right;">
					<a-dropdown>
						<a-menu slot="overlay" @click="chooseDownType">
							<a-menu-item key="0">当前页导出</a-menu-item>
							<a-menu-item key="1">全部导出</a-menu-item>
						</a-menu>
						<a-button type="primary"  style="float: right;">导出
							<a-icon style="color: #FFFFFF;" type="down"/>
						</a-button>
					</a-dropdown>
				</div>
			</div>
			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<a-table :columns="columns" :dataSource="deleteList" :pagination="false"
					         :rowClassName="rowClassName">
						<div slot="userName" slot-scope="text, record, index">
							<!--							<a-avatar v-if="record.work_avatar" shape="square" :size="42" :src="record.work_avatar"-->
							<!--							          style="float: left;"/>-->
							<!--							<img style="width: 42px;height: 42px;float: left;" v-if="!record.work_avatar"-->
							<!--							     src="../../../assets/useradvart.png"/>-->
							<div style="float: left;margin-left:10px;line-height: 42px;">
								<div>{{record.userName}}
									<a-icon slot="prefix" type="man" style="color: #427EBA;"
									        v-if="record.sex=='1'"/>
									<a-icon
											slot="prefix"
											type="woman"
											style="color: #ED4997;"
											v-if="record.sex=='2'"
									/>
								</div>
							</div>
						</div>
						<div slot="name" slot-scope="text, record, index">
							<a-avatar v-if="record.avatar" shape="square" :size="42" :src="record.avatar"
							          style="float: left;"/>
							<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
							     src="../../../assets/useradvart.png"/>
							<div style="float: left;margin-left:10px;line-height: 42px;">
								<div>{{record.name}}
									<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
													<template
															v-if="record.corp_name != null">@{{record.corp_name}}</template>
													<template v-else>@微信</template>
												</span>
									<a-icon slot="prefix" type="man" style="color: #427EBA;"
									        v-if="record.gender=='1'"/>
									<a-icon
											slot="prefix"
											type="woman"
											style="color: #ED4997;"
											v-if="record.gender=='2'"
									/>
								</div>
							</div>
						</div>
						<div slot="tagName" slot-scope="text, record, index">
							<span v-if="record.tagName.length == 0 && record.perName.length == 0">--</span>
							<span v-if="record.perName.length == 0 && record.tagName.length > 0">
											<a-tag v-for="item in record.tagName" style="margin-top: 5px;"
											       color="blue">
												{{item}}
											</a-tag>
										</span>
							<span v-if="record.tagName.length == 0 && record.perName.length > 0">
											私有标签：<a-tag v-for="item in record.perName" style="margin-top: 5px;"
											            color="blue">
											{{item}}
										</a-tag>
										</span>
							<template v-if="record.tagName.length > 0 && record.perName.length > 0">
								<div>
									公有标签：
									<a-tag v-for="item in record.tagName"
									       style="margin-top: 5px;" color="blue">
										{{item}}
									</a-tag>
								</div>
								<div>
									私有标签：
									<a-tag v-for="item in record.perName"
									       style="margin-top: 5px;" color="blue">
										{{item}}
									</a-tag>
								</div>
							</template>
						</div>
						<div slot="create_time" slot-scope="text, record, index">
							{{record.create_time}}<span v-if="record.status == 1">（重复删除）</span>
						</div>
						<div slot="tag_name2">
							标签
							<a-tooltip placement="bottom">
								<template slot="title">
									<div>企业微信给客户打标签：分公有标签和私有标签</div>
									<div>1、公有标签：即企业标签。管理员创建，所有员工可见，在本系统定义为“公有标签”。</div>
									<div>2、私有标签：即个人标签。员工创建，仅自己可见。在本系统定义为“私有标签”）。</div>
								</template>
								<a-icon type="question-circle" style="margin-left:5px;"/>
							</a-tooltip>
						</div>
					</a-table>
					<!--分页-->
					<div class="pagination" style="width: 100%;padding: 20px 15px;overflow: hidden;"
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
			<!--选择自建应用成员-->
			<chooseDepartment :id="corpId"
			                  ref="user"
			                  :is_special="1"
			                  :show="showModalDepartment"
			                  :chooseNum="chooseNum"
			                  :callback="modalVisibleChange3" :disabledVal="0"></chooseDepartment>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'
	import chooseDepartment from '../../../components/ChooseDepartment'

	const columns = [
		{
			title      : "企业成员",
			dataIndex  : "userName",
			key        : "userName",
			scopedSlots: {customRender: "userName"},
		},
		{
			title      : "删除客户",
			dataIndex  : "name",
			width      : "200",
			scopedSlots: {customRender: "name"},
			key        : "name"
		},
		{
			// title      : "所属标签",
			dataIndex  : "tagName",
			key        : "tagName",
			width      : "30%",
			slots      : {title: "tag_name2"},
			scopedSlots: {customRender: "tagName"},
		},
		{
			title      : "删除时间",
			dataIndex  : "create_time",
			key        : "create_time",
			scopedSlots: {customRender: "create_time"},
		}, {
			title    : "添加时间",
			dataIndex: "add_time",
			key      : "add_time",
		},

	];

	export default {
		name      : "userNotice",
		props     : {
			id: {
				type   : String,
				default: ''
			}
		},
		components: {
			chooseDepartment
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				settingVisible     : false,
				isAudit            : 0,
				/* 敏感词 */
				suite_id           : 1,         //应用ID
				corpId             : corpId,    //企业微信选中的id
				corpInfo           : [],        // 企业微信列表
				agentId            : '',
				agentList          : [],
				checkedList        : [],//选择的成员id数组
				user               : [],//选择的成员数据
				showModalDepartment: false, //成员选择框显示与隐藏
				chooseNum          : 0,//部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				deleteDate         : null, // 删除时间筛选
				timeType           : 1, // 时间类型 1添加 2删除
				deleteList         : [],
				isLoading          : true,      //Loading 组件显示与隐藏
				corpLen            : JSON.parse(localStorage.getItem('corpArr')).length,
				//表格部分
				columns,
				//分页
				total              : 0, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				page               : 1, //页码
				pageSize           : 15, //每页数据条数
				showModalDepartment: false
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

			// 切换筛选时间类型
			changeTimeType () {
				this.deleteDate = null
				this.getDeleteList()
			},
			// 时间禁选
			disabledDateDay (current) {
				return current.valueOf() > new Date().getTime();
			},
			// 选择时间
			changeSelectDate (date, dateString) {
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
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getDeleteList(page, pageSize);
				this.$emit('changeScroll')
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getDeleteList(1, pageSize);
			},
			handleWxId (value) {
				this.corpId = value
				this.getAgentList()
				this.chooseNum = 0
				this.checkedList = []
				this.$emit('changeCorpId', this.corpId)
			},
			// 获取自建应用
			async getAgentList (agentId) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.corpId,
					agent_type: 2,
					suite_id  : this.suite_id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.agentList = res.data
					if (agentId) {
						this.agentId = agentId
						this.getDeleteList()
					} else {
						if (this.agentList.length > 0) {
							this.agentId = this.agentList[0].id
							this.getDeleteList()
						} else {
							this.agentList = res.data
							this.isLoading = false
						}
					}
				}
			},
			changeAgentId () {
				this.getDeleteList()
			},
			clear () {
				this.corpId = localStorage.getItem('corpId')
				this.$emit('changeCorpId', this.corpId)
				this.checkedList = []
				this.chooseNum1 = 0
				// this.getAgentList()
				this.getDeleteList()
			},
			// 选择下载方式
			chooseDownType (e) {
				this.getDeleteList(this.page, this.pageSize, 1, e.key)
			},
			moment,
			//获取表格内容
			async getDeleteList (page = 1, pageSize = this.pageSize, is_export = 0, is_all = 0) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-user-del-follow-user/user-del-follow-lists-detail", {
					corp_id  : this.corpId,
					// agent_id : this.agentId,
					time_type: this.timeType,
					sData    : this.deleteDate == null || this.deleteDate.length == 0 ? '' : moment(this.deleteDate[0]).format('YYYY-MM-DD'),
					eData    : this.deleteDate == null || this.deleteDate.length == 0 ? '' : moment(this.deleteDate[1]).format('YYYY-MM-DD'),
					user_ids  : this.checkedList,
					page     : page,
					pageSize : pageSize,
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
						this.deleteList = res.data.data;
						this.isLoading = false;
						this.total = parseInt(res.data.count);
						this.page = page;
						this.pageSize = pageSize;
						this.quickJumper = this.total > this.pageSize
					}
				}
			},
		},

		mounted () {
			// this.$store.dispatch('getCorp', (info) => {
			// 	this.corpInfo = info;
			// 	this.corpId = this.id
			// 	this.isAudit = this.corpInfo.find(i => i.corpid == this.corpId).isAudit
			// 	this.isLoading = true
			// 	this.selectedRowKeys = []
			// 	if (this.corpInfo.length > 0) {
			this.getAgentList()
			// 	}
			// });

		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 0 5px;
		padding: 3px 15px;
		cursor: pointer;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
		margin-bottom: 10px;
	}

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
		overflow: hidden;
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

	.setting-day {
		margin: 10px;
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

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}
</style>
