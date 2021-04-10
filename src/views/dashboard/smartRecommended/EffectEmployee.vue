<template>
	<div>
		<div>
			<!--			<div class="content-msg">-->
			<!--				<p style="margin-bottom: 2px;">-->
			<!--					在企业微信体系里，虽然我们无法防止员工删除客户，但我们可以使用员工删人提醒功能，来监督员工删除客户的行为。-->
			<!--				</p>-->
			<!--				<p style="margin-bottom: 0px;">-->
			<!--					比如，设置部门负责人监督其部门所有成员删除客户的情况，那么一旦发现，有客户被部门员工删除时，部门负责人会在企业微信端收到一条【员工删人提醒】通知，即哪个员工在什么时间删除了哪个客户，其可以根据成员删人行为的影响程度给予相应的处罚。-->
			<!--				</p>-->
			<!--			</div>-->
			<div class="content-hd">
				<a-col style="float:left;">
					<a-select
							v-if="corpLen > 1"
							showSearch
							optionFilterProp="children"
							style="width: 170px;margin-right: 5px;"
							@change="handleWxId"
							v-model="corpId"
					>
						<template v-for="item in corpInfo">
							<a-select-option :value="item.corpid">{{item.corp_full_name ||
								item.corp_name}}
							</a-select-option>
						</template>
					</a-select>
					<a-button @click="showDepartmentList(2)"
					          style="width: 240px;margin-right: 5px;">
						<span v-if="selectNum != 0">已选择{{selectUserNum}}名成员，{{selectNum - selectUserNum}}个部门</span>
						<span v-else>选择企业成员</span>
					</a-button>
					<a-select
							optionFilterProp="children"
							style="width: 170px;margin-bottom: 20px;margin-right: 5px;"
							v-model="status"
					>
						<a-select-option :value="''">全部状态</a-select-option>
						<a-select-option :value="1">开启</a-select-option>
						<a-select-option :value="2">关闭</a-select-option>
					</a-select>
					<a-button type="primary" style="margin: 0px 5px;" @click="find">查找</a-button>
					<a-button @click="clear">清空</a-button>
				</a-col>
				<a-col style="float:right;">
					<a-button class="btn-primary" icon="plus" v-has="'smartRecommended-employee-add'"
					          @click="addUser" type="primary">
						生效员工
					</a-button>
				</a-col>
			</div>
			<div style="margin-bottom: 15px;">
				共
				<span style="color: blue">{{total}}</span>
				条
			</div>
			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
					<a-table :columns="columns" :dataSource="userList" :pagination="false"
					         :rowClassName="rowClassName" v-has="'smartRecommended-employee-list'">
									<span slot="checkedBoxTitle">
									</span>
						<span slot="checkedBox" slot-scope="text, record, index">
										<a-checkbox style=""
										            v-model="checkBoxValue[index]"
										            @click="changeSelectKey(record.id)"></a-checkbox>
									</span>
						<template slot="userinfo" slot-scope="text, record, index">
							<a-avatar v-if="record.avatar" shape="square"
							          :src="record.avatar" style="float: left;"/>
							<img style="width: 32px;height: 32px;float: left;"
							     v-if="!record.avatar" src="../../../assets/useradvart.png"/>
							<div style="max-width: 300px;word-wrap:break-word;display: inline-block;line-height: 32px;">
								<a-popover placement="right">
													<span slot="content">
														{{record.user_name}}
													</span>
									<p style="cursor: pointer; display: inline-block; margin-left: 10px;max-width: 170px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-bottom: 0px;">
										{{record.user_name}}
									</p>
								</a-popover>
							</div>
							<span style="display: inline-block; line-height: 32px; vertical-align: top">
											<a-icon slot="prefix" type="man"
											        style="margin-left: 10px;color: #427EBA;"
											        v-if="record.gender==1"/>
											<a-icon
													slot="prefix"
													type="woman"
													style="margin-left: 10px;color: #ED4997;"
													v-if="record.gender==2"
											/>
										</span>
						</template>
						<span slot="open_status" slot-scope="text, record, index">
							<span v-if="record.keyword_status == 1">已开启</span>
							<span v-if="record.keyword_status == 2">已关闭</span>
						</span>
						<span slot="action" slot-scope="text, record, index">
							<a-button v-has="'smartRecommended-employee-status'" type="primary" v-if="record.keyword_status == 1"
							          @click="changeSatus(record.id, 2)" style="margin: 0 5px 5px 0">
								关闭
							</a-button>
							<a-button v-has="'smartRecommended-employee-status'" type="primary" v-if="record.keyword_status == 2"
							          @click="changeSatus(record.id, 1)" style="margin: 0 5px 5px 0">
								开启
							</a-button>
							<a-button v-has="'smartRecommended-employee-del'" @click="changeSatus(record.id, 0)" style="margin: 0 5px 5px 0">
								删除
							</a-button>
						</span>
					</a-table>

					<!-- 分页 -->
					<div class="pagination" style="margin: 20px 15px;overflow: hidden;"
					     v-show="total > 0" v-has="'smartRecommended-employee-list'">
						<div style="height: 32px;float: left;line-height: 32px;">
							<a-checkbox v-model="batchTypeValue"
							            @click="batchTypeChange"></a-checkbox>
							<a-select optionFilterProp="children"
							          v-model="batchType"
							          @change="changeBatchType"
							          style="width: 150px; margin: 0 5px;">
								<a-select-option value="0">选择当前页</a-select-option>
								<a-select-option value="1">选择所有</a-select-option>
							</a-select>
							<a-button v-has="'smartRecommended-employee-status'" class="btn-primary" icon="unlock"
							          :disabled="selectedRowKeys.length == 0"
							          @click="releaseEffect" type="primary">
								批量开启
							</a-button>
							<a-button v-has="'smartRecommended-employee-status'" class="btn-primary" icon="lock"
							          :disabled="selectedRowKeys.length == 0"
							          @click="failure" type="primary">
								批量关闭
							</a-button>
							<a-button v-has="'smartRecommended-employee-del'" class="btn-primary" icon="lock"
							          :disabled="selectedRowKeys.length == 0"
							          @click="deleteEffect">
								批量删除
							</a-button>
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
			<a-modal :visible="editVisible" :title="editTitle" @cancel="cancelEdit" width="888px!important;">
				<template slot="footer">
					<a-button key="back" @click="cancelEdit">取消</a-button>
					<a-button
							key="submit"
							type="primary"
							:loading="loading4"
							@click="handleEdit"
					>提交
					</a-button>
				</template>
				<a-form>
					<div class="content-msg">
						基于员工开启会话存档功能，当客户与员工聊天时，客户命中关键词，系统可智能推荐对应内容素材，无需查找，一键发送。
					</div>
					<a-form-item label="企业成员" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
						<!--						<div style="color: #FF562D;">推送成员会在企业微信端收到一条【员工删人提醒】通知，告知哪个员工在什么时间删除了哪个客户</div>-->
						<a-button v-if="is_edit == 0" @click="showDepartmentList(1)"
						          style="width: 240px;margin-right: 5px;">
							<span v-if="chooseNum != 0">已选择{{chooseUserNum}}名成员，{{chooseNum - chooseUserNum}}个部门</span>
							<span v-else>选择企业成员</span>
						</a-button>
						<span style="font-weight: 700; font-size: 20px;" v-if="is_edit != 0">已选择
							<span style="font-weight: 700; font-size: 20px;color: #F56C6C">{{userNum}}</span>
							名员工
						</span>
					</a-form-item>
					<a-form-item label="生效状态" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
						<a-radio-group name="radioGroup" v-model="effectStatus">
							<a-radio :value="1">开启</a-radio>
							<a-radio :value="2">关闭</a-radio>
						</a-radio-group>
					</a-form-item>
				</a-form>
			</a-modal>
			<!--选择自建应用成员-->
			<chooseDepartment :id="corpId" ref="user" :show="showModalDepartment"
			                  :chooseNum="userAndPartyNum"
			                  isAudit="1"
			                  :isAuditUserAll="1"
			                  noticeTitle="只显示当前开启会话存档的企业成员。"
			                  :callback="modalVisibleChange3" :disabledVal="0"></chooseDepartment>
		</div>
	</div>
</template>

<script>
	import linkAgent from '@/components/addAgent/index.vue'
	import groupChat from "@/components/GroupChat.vue"
	import corpSensitiveWord from '@/components/corpSensitiveWord/CorpSensitiveWord.vue'
	import chooseDepartment from "@/components/ChooseDepartment.vue"

	// 活动列表
	const columns = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "60px",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "企业成员",
			dataIndex  : "userinfo",
			key        : "userinfo",
			width      : '50%',
			scopedSlots: {customRender: "userinfo"}
		},
		{
			title      : "状态",
			dataIndex  : "open_status",
			key        : "open_status",
			scopedSlots: {customRender: "open_status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '16%',
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "effectEmployee",
		components: {linkAgent, groupChat, corpSensitiveWord, chooseDepartment},
		props     : {
			id: {
				type   : String,
				default: ''
			}
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				checkBoxValue      : [],        // 选择框
				batchType          : '0',       //0当前页 1所有
				batchTypeValue     : false,     //当前页/所有 是否选中
				selectedRowKeys    : [],        //选中的敏感词key
				suite_id           : 1,         //应用ID
				corpId             : corpId,    //企业微信选中的id
				corpInfo           : [],        // 企业微信列表
				status             : '',        // 筛选状态
				selectList         : [],        // 筛选成员数据
				selectNum          : 0,         // 筛选成员部门总数量
				selectUserNum      : 0,         // 筛选成员数量
				showAddAgentModal  : false,   // 添加应用弹窗
				userList           : [],        // 表格数组
				isLoading          : true,      //Loading 组件显示与隐藏
				corpLen            : JSON.parse(localStorage.getItem('corpArr')).length,
				//表格部分
				columns,
				//分页
				total              : 0, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				page               : 1, //页码
				pageSize           : 15, //每页数据条数
				checkedList        : [], // 弹窗选择成员数据
				chooseNum          : 0, // 弹窗选择成员部门总数量
				chooseUserNum      : 0, // 弹窗选择成员数量
				effectStatus       : 1, // 弹窗生效状态
				showModalDepartment: false, // 选择成员组件展示
				userAndPartyNum    : 0, // 选择组件成员和部门的数量
				userType           : 1, // 1生效成员选择组件 2筛选选择组件
				editVisible        : false, // 新建或编辑生效员工弹窗
				loading4           : false, // 生效员工弹窗提交按钮loading
				is_edit            : 0,    // 是否是编辑
				userNum            : 0,    // 生效员工编辑的员工数
				editTitle          : '新建生效员工', // 生效员工弹窗标题
				userDelId          : [], // 批量编辑时生效规则id
			};
		},

		methods: {
			//部门选择弹窗组件
			showDepartmentList (type) {
				if (type == 1) {
					this.userAndPartyNum = this.chooseNum
					let arr = []
					this.checkedList.map(x => {
						arr.push(x.id)
					})
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
				} else {
					this.userAndPartyNum = this.selectNum
					let arr = []
					this.selectList.map(x => {
						arr.push(x.id)
					})
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.selectList))
				}
				this.userType = type
				this.showModalDepartment = true
			},
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.userType == 1) {
						this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum = userNum
						this.chooseDepartmentNum = departmentNum
						this.checkedList = JSON.parse(JSON.stringify(list))
					} else {
						this.selectNum = parseInt(userNum) + parseInt(departmentNum)
						this.selectUserNum = userNum
						this.selectList = JSON.parse(JSON.stringify(list))
					}
				}
				this.showModalDepartment = false
			},
			// 卡片选择
			changeSelectKey (id) {
				for (let i = 0; i < this.selectedRowKeys.length; i++) {
					if (id == this.selectedRowKeys[i]) {
						this.selectedRowKeys.splice(i, 1)
						this.setBox()
						return false
					}
				}
				this.selectedRowKeys.push(id)
				this.setBox()
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					// 添加
					if (this.batchType == 0) {
						// 当前页
						this.addKey(this.userList)
						this.setCheckedBox(this.userList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = JSON.parse(JSON.stringify(this.userKeys))
						this.setBox()
					}
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						// 当前
						this.removeKey(this.userList)
						this.setCheckedBox(this.userList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
						this.setBox()
					}
					this.batchTypeValue = false
				}
			},
			setBox () {
				this.setCheckedBox(this.userList)
			},
			// 设置列表卡片多选框选中状态
			setCheckedBox (userList) {
				this.checkBoxValue = new Array(userList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < userList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (userList[i].id == this.selectedRowKeys[j]) {
							this.checkBoxValue[i] = true
						}
					}
				}
				if (this.batchType == 0) {
					this.batchTypeValue = true
					for (let i = 0; i < this.checkBoxValue.length; i++) {
						if (!this.checkBoxValue[i]) {
							this.batchTypeValue = false
						}
					}
				} else {
					if (this.selectedRowKeys.length == this.userKeys.length && this.userKeys.length != 0) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}
				if (userList.length == 0) {
					this.batchTypeValue = false
				}

			},
			// 当前/所有 类型选择框变化
			changeBatchType (type) {
				this.batchType = type
				if (this.batchTypeValue) {
					if (this.batchType == 0) {
						this.selectedRowKeys = []
					}
					this.batchTypeValue = false
					this.batchTypeChange()
				} else {
					this.setBox()
				}
			},
			// 增加当前页key
			addKey (userList) {
				for (let i = 0; i < userList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === userList[i].id)
					if (index == -1) {
						this.selectedRowKeys.push(userList[i].id)
					}
				}
			},
			// 删除当前页key
			removeKey (userList) {
				for (let i = 0; i < userList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === userList[i].id);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			handleWxId (value) {
				this.corpId = value
				let corp = this.corpInfo.find(corp => corp.corpid == this.corpId)
				this.$store.dispatch("changeCorp", corp);
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 点击搜索
			find () {
				this.isLoading = true
				this.getUserList()
			},
			// 点击清空
			clear () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.isLoading = true
				this.status = ''
				this.name = ''
				this.selectList = []
				this.selectNum = 0
				this.selectUserNum = 0
				this.page = 1
				this.pageSize = 15
				this.getUserList()
			},
			// 新建提醒
			addUser () {
				let isAudit = 0
				if(localStorage.getItem('corpArr') && JSON.parse(localStorage.getItem('corpArr')).length > 0) {
					isAudit = JSON.parse(localStorage.getItem('corpArr')).find(x=> x.corpid == this.corpId).isAudit
				}
				if(isAudit == 0) {
					this.$message.destroy()
					this.$message.warning('尚未开启会话存档功能，暂无法操作')
					return false
				}
				this.is_edit = 0
				this.editTitle = '新建生效员工'
				this.resetModal()
				this.editVisible = true
			},
			cancelEdit () {
				this.editVisible = false
				this.resetModal()
			},
			async handleEdit () {
				this.loading4 = true
				if (this.checkedList.length == 0 && this.is_edit == 0) {
					this.$message.destroy()
					this.$message.warning('请选择企业成员！')
					this.loading4 = false
					return false
				}
				let checkedList = []
				let party = []
				this.checkedList.map(x => {
					if (x.scopedSlots.title == 'custom') {
						checkedList.push(x.id)
					} else {
						party.push(x.key)
					}
				})
				const {data: res} = await this.axios.post('work-msg-keyword-attachment/keyword-user-set', {
					corp_id : this.corpId,
					user_ids: checkedList,
					party   : party,
					status  : this.effectStatus
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.loading4 = false
					this.$message.error(res.error_msg);
				} else {
					this.getUserList(this.page, this.pageSize)
					this.selectedRowKeys = []
					this.editVisible = false
					this.resetModal()
				}
			},
			resetModal () {
				this.loading4 = false
				this.checkedList = []
				this.chooseNum = 0
				this.userNum = 0
				this.is_edit = 0
				this.effectStatus = 1
			},
			changeAgentId () {
				this.selectedRowKeys = []
				this.getUserList()
			},
			// 获取表格内容
			async getUserList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				let checkedList = []
				let party = []
				this.selectList.map(x => {
					if (x.scopedSlots.title == 'custom') {
						checkedList.push(x.id)
					} else {
						party.push(x.key)
					}
				})
				const {data: res} = await this.axios.post("work-msg-keyword-attachment/keyword-user-list", {
					corp_id : this.corpId,
					status  : this.status,
					user_ids: checkedList,
					party   : party,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.userList = res.data.list
					this.userKeys = res.data.all_user
					this.setCheckedBox(this.userList)
					this.isLoading = false
					this.total = parseInt(res.data.count)
					this.page = page
					this.pageSize = pageSize
					this.quickJumper = this.total > this.pageSize
				}
			},
			// 批量删除
			deleteEffect () {
				let that = this;
				that.$confirm({
					title     : "确定删除选中的员工生效状态?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeUserStatus(that.selectedRowKeys, 0)
					}
				});
			},
			// 批量开启
			releaseEffect () {
				let that = this;
				that.$confirm({
					title     : "确定开启选中的员工生效状态?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeUserStatus(that.selectedRowKeys, 1)
					}
				});
			},
			// 批量关闭
			failure () {
				let that = this;
				that.$confirm({
					title     : "确定关闭选中的员工生效状态?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeUserStatus(that.selectedRowKeys, 2)
					}
				});
			},
			// 关闭
			changeSatus (id, status) {
				let that = this;
				let title = ''
				if (status == 1) {
					title = '开启'
				} else if (status == 2) {
					title = '关闭'
				} else {
					title = '删除'
				}
				that.$confirm({
					title     : "确定" + title + "该成员生效状态？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						let ids = []
						ids.push(id)
						that.changeUserStatus(ids, status)
					}
				});
			},
			// 
			async changeUserStatus (ids, status) {
				const {data: res} = await this.axios.post("work-msg-keyword-attachment/keyword-user-status-set", {
					rule_ids: ids,
					status  : status,
					corp_id : this.corpId
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.getUserList(this.page, this.pageSize)
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getUserList(page, pageSize);
				this.$emit('changeScroll')
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getUserList(1, pageSize);
			},
		},

		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.corpId = this.id
				this.isLoading = true
				this.selectedRowKeys = []
				if (this.corpInfo.length > 0) {
					this.getUserList()
				}
			});
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
		width: 100%;
		padding-right: 40px;
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
		margin: 12px 0 24px;
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
