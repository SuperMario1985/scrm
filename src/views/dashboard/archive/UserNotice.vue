<template>
	<div>
		<div>
			<div class="content-msg">
				<p style="margin-bottom: 0px;">
					员工及员工的客户触发敏感词，系统会立即给相应的成员发消息提醒，提醒该员工或是该员工的客户可能出现违规行为，不对群起效，只监控单聊。
				</p>
			</div>
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
					<a-select v-if="agentList.length > 0"
					          showSearch
					          optionFilterProp="children"
					          style="width: 170px;margin-bottom: 20px;margin-right: 5px;"
					          @change="changeAgentId"
					          v-model="agentId"
					>
						<template v-for="item in agentList">
							<a-select-option :value="item.id">{{item.name}}</a-select-option>
						</template>
					</a-select>
					<a-select
							optionFilterProp="children"
							style="width: 170px;margin-bottom: 20px;margin-right: 5px;"
							v-model="status"
					>
						<a-select-option :value="0">全部状态</a-select-option>
						<a-select-option :value="2">开启</a-select-option>
						<a-select-option :value="1">关闭</a-select-option>
					</a-select>
					<a-button @click="showDepartmentList1"
					          style="min-width: 170px;margin-right: 5px;">
						<span v-if="chooseNum1 > 0">已选择{{chooseUserNum1}}名成员，{{chooseDepartmentNum1}}个部门</span>
						<span v-else>选择部门成员</span>
					</a-button>
					<a-button type="primary" style="margin: 0px 5px;" @click="find">查找</a-button>
					<a-button @click="clear">清空</a-button>
				</a-col>
				<a-col style="float:right;">
					<a-button class="btn-primary" icon="plus"
					          @click="addNotice" type="primary" v-has="'violations-employee-set'">
						设置违规员工
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
					         :rowClassName="rowClassName" v-has="'violations-employee-list'">
									<span slot="checkedBoxTitle">
									</span>
						<span slot="send_user">
							通知人
							<a-tooltip trigger="hover">
								<span slot="title"
								      style="display: inline-block;word-wrap: break-word;word-break: break-all;">
									通过自建应用通知提醒给指定的成员
								</span>
								<a-icon type="question-circle"/>
							</a-tooltip>
						</span>
						<span slot="checkedBox" slot-scope="text, record, index">
										<a-checkbox style=""
										            v-model="checkBoxValue[index]"
										            @click="changeSelectKey(record.key)"></a-checkbox>
									</span>
						<template slot="userinfo" slot-scope="text, record, index">
							<a-avatar v-if="record.avatar" shape="square"
							          :src="record.avatar" style="float: left;"/>
							<img style="width: 32px;height: 32px;float: left;"
							     v-if="!record.avatar" src="../../../assets/useradvart.png"/>
							<div style="max-width: 300px;word-wrap:break-word;display: inline-block;line-height: 32px;">
								<a-popover placement="top">
													<span slot="content">
														{{record.name}}<span v-if="record.department_name">-</span>{{record.department_name}}
													</span>
									<p style="cursor: pointer; display: inline-block; margin-left: 10px;max-width: 170px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-bottom: 0px;">
										{{record.name}}<span v-if="record.department_name">-</span>{{record.department_name}}
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
						<span slot="word_name" slot-scope="text, record, index">
										<span v-if="record.word_name.length == 0">--</span>
						                    <a-tag v-for="item in record.word_name" color="orange"
						                           style="margin-bottom: 5px;cursor: pointer;">
							                    {{item}}
						                    </a-tag>
									</span>
						<span slot="user_name" slot-scope="text, record, index">
										<span v-if="record.user_name.length == 0">--</span>
						                    <a-tag v-for="item in record.user_name" color="blue"
						                           style="margin-bottom: 5px;cursor: pointer;">
							                    {{item}}
						                    </a-tag>
									</span>
						<span slot="status" slot-scope="text, record, index">
										<span v-if="record.status == 2">已开启</span>
										<span v-if="record.status == 1">已关闭</span>
									</span>
						<span slot="action" slot-scope="text, record, index">
										<a-button @click="edit(record.id, record.name)"
										          style="margin: 0 5px 5px 0"
										          v-has="'violations-employee-edit'">编辑</a-button>
										<a-button v-if="record.status == 2" @click="changeSatus(record.id, 1)"
										          style="margin: 0 5px 5px 0"
										          v-has="'violations-employee-close'">关闭</a-button>
										<a-button v-if="record.status == 1" @click="changeSatus(record.id, 2)"
										          style="margin: 0 5px 5px 0"
										          v-has="'violations-employee-close'">开启</a-button>
									</span>
					</a-table>

					<!-- 分页 -->
					<div class="pagination" style="margin: 20px 15px;overflow: hidden;"
					     v-show="total > 0" v-has="'violations-employee-list'">
						<div style="float: left;">
							<a-checkbox v-model="batchTypeValue"
							            @click="batchTypeChange"></a-checkbox>
							<a-select optionFilterProp="children"
							          v-model="batchType"
							          @change="changeBatchType"
							          style="width: 150px; margin: 0 5px;">
								<a-select-option value="0">选择当前页</a-select-option>
								<a-select-option value="1">选择所有</a-select-option>
							</a-select>
							<a-button class="btn-primary" icon="edit"
							          @click="showModalWord"
							          :disabled="selectedRowKeys.length == 0" type="primary"
							          v-has="'violations-employee-edit'">
								批量修改敏感词
							</a-button>
							<a-button class="btn-primary" icon="edit"
							          @click="showModalUser"
							          :disabled="selectedRowKeys.length == 0" type="primary"
							          v-has="'violations-employee-edit'">
								批量修改通知人
							</a-button>
							<a-button class="btn-primary" icon="unlock"
							          :disabled="selectedRowKeys.length == 0"
							          @click="releaseFollow" type="primary" v-has="'violations-employee-close'">
								批量开启
							</a-button>
							<a-button class="btn-primary" icon="lock"
							          :disabled="selectedRowKeys.length == 0"
							          @click="failure" type="primary" v-has="'violations-employee-close'">
								批量关闭
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
			<a-modal v-model="sensitiveVisible" title="批量修改敏感词" @cancel="cancleSensitive"
			         width="888px!important">
				<template slot="footer">
					<a-button @click="cancleSensitive">关闭</a-button>
					<a-button type="primary" :disabled="settingDisabled" @click="handleSensitive">确定</a-button>
				</template>
				<h3>已选择<span style="color: #FF562D;">{{selectedRowKeys.length}}</span>名成员</h3>
				<corpSensitiveWord :callback="modalVisibleChange"
				                   :hasChoose="wordIds"
				></corpSensitiveWord>
			</a-modal>
			<a-modal v-model="userVisible" title="批量修改通知人" @cancel="cancleUser"
			         width="888px!important">
				<template slot="footer">
					<a-button @click="cancleUser">关闭</a-button>
					<a-button :disabled="settingUserDisabled" @click="handleUser">确定</a-button>
				</template>
				<h3>已选择<span style="color: #FF562D;">{{selectedRowKeys.length}}</span>名成员</h3>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<template slot="label">
						提醒通知成员
					</template>
					<div style="color: #FF562D;line-height: 20px; margin: 11px 0;">
						员工与员工的客户触发敏感词，系统会立即给相应的成员发消息提醒，提醒该员工或是该员工的客户可能出现违规行为。【不对群起效，只监控单聊】
					</div>
					<a-checkbox v-model="isLeader">对应部门负责人（按照企业微信组织架构）</a-checkbox>
					<a-checkbox v-model="isUser">指定成员</a-checkbox>
					<a-button v-if="isUser" @click="showDepartmentList"
					          style="width: 210px;margin-right: 5px;">
						<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
						<span v-else>选择部门成员</span>
					</a-button>
				</a-form-item>
			</a-modal>
			<linkAgent :showAddAgent="showAddAgentModal" :agent_is_money='0' @addOk="addOk" @linkOk="linkOk"
			           @addCancel="addCancel"></linkAgent>
			<a-modal v-model="settingVisible" title="开通会话存档流程图" @cancel="cancleSetting"
			         width="700px !important">
				<template slot="footer">
					<a-button key="back" @click="cancleSetting">关闭</a-button>
				</template>
				<img style="width: 600px;" src="../../../assets/baidu/token.png"/>
			</a-modal>
			<!-- 选择会话存档成员 -->
			<chooseDepartment ref="user1" :id="corpId" :show="showModalDepartment1" isAudit="1"
			                  :chooseNum="chooseNum1" :isAuditUserAll="1"
			                  noticeTitle="只显示当前开启会话存档的企业成员。"
			                  :callback="modalVisibleChange5"></chooseDepartment>
			<!--选择自建应用成员-->
			<chooseDepartment :id="corpId" :agentid="agentId" tipType="2" ref="user" :show="showModalDepartment"
			                  :chooseNum="chooseNum"
			                  :callback="modalVisibleChange3"></chooseDepartment>
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
			width      : "300px",
			scopedSlots: {customRender: "userinfo"}
		},
		{
			title      : "敏感词",
			dataIndex  : "word_name",
			key        : "word_name",
			width      : "26%",
			scopedSlots: {customRender: "word_name"}
		},
		{
			dataIndex  : "user_name",
			width      : "16%",
			key        : "user_name",
			scopedSlots: {customRender: "user_name", title: "send_user"}
		},
		{
			title      : "状态",
			dataIndex  : "status",
			width      : "12%",
			key        : "status",
			scopedSlots: {customRender: "status"}
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
		name      : "userNotice",
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
				settingVisible      : false,
				isAudit             : 0,
				/* 敏感词 */
				sensitiveVisible    : false,
				settingDisabled     : false,
				wordIds             : [],
				checkBoxValue       : [],        // 敏感词选择框
				batchType           : '0',       //0当前页 1所有
				batchTypeValue      : false,     //当前页/所有 是否选中
				selectedRowKeys     : [],        //选中的敏感词key
				suite_id            : 1,         //应用ID
				corpId              : corpId,    //企业微信选中的id
				corpInfo            : [],        // 企业微信列表
				agentId             : '',        // 自建应用ID
				status              : 0,
				userIds1             : [],
				checkedList1        : [],
				chooseNum1          : 0,//部门成员总个数
				chooseUserNum1      : 0,//成员个数
				chooseDepartmentNum1: 0,//部门个数
				showModalDepartment1: false,
				agentList           : [],        // 自建应用列表
				showAddAgentModal   : false,   // 添加应用弹窗
				userList            : [],        // 表格数组
				isLoading           : true,      //Loading 组件显示与隐藏
				corpLen             : JSON.parse(localStorage.getItem('corpArr')).length,
				//表格部分
				columns,
				//分页
				total               : 0, //总条数
				quickJumper         : false, // 是否显示快速跳转的控件
				page                : 1, //页码
				pageSize            : 15, //每页数据条数
				userIds             : [],
				checkedList         : [],
				chooseNum           : 0,//部门成员总个数
				chooseUserNum       : 0,//成员个数
				chooseDepartmentNum : 0,//部门个数
				isLeader            : false,
				isUser              : false,
				userVisible         : false,
				showModalDepartment : false,
				settingUserDisabled : false,
			};
		},

		methods: {
			showModalUser () {
				if (this.isAudit != 1) {
					this.$message.destroy()
					this.$message.warning('需要先开启【会话存档】功能，开启后才能正常设置员工违规', 2)
					return false
					// this.settingVisible = true
				}
				this.checkedList = []
				this.userIds = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.userVisible = true
			},
			//部门选择弹窗组件
			showDepartmentList () {
				this.$refs.user1.rightIdList = JSON.parse(JSON.stringify(this.userIds))
				this.$refs.user1.rightList = JSON.parse(JSON.stringify(this.checkedList))
				this.showModalDepartment = true
			},
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.userIds = arr
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.checkedList = JSON.parse(JSON.stringify(list))
					} else {
						this.checkedList = []
					}
				}
				this.showModalDepartment = false
			},
			cancleUser () {
				this.checkedList = []
				this.userIds = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.isLeader = false
				this.isUser = false
				this.userVisible = false
			},
			async handleUser () {
				this.settingUserDisabled = true
				if (!this.isLeader && !this.isUser) {
					this.$message.warning('请选择通知人！')
					this.settingUserDisabled = false
					return false
				}
				if (this.isUser && this.chooseNum == 0) {
					this.$message.warning('请选择通知人！')
					this.settingUserDisabled = false
					return false
				}
				const {data: res} = await this.axios.post("limit-word/batch-user", {
					ids        : this.selectedRowKeys,
					is_leader  : this.isLeader ? 1 : 0,
					remind_user: this.checkedList
				});
				if (res.error != 0) {
					this.settingUserDisabled = false
					this.$message.error(res.error_msg);
				} else {
					this.checkedList = []
					this.userIds = []
					this.chooseNum = 0
					this.userIds = []
					this.chooseNum = 0
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					this.isLeader = false
					this.isUser = false
					this.userVisible = false
					this.settingUserDisabled = false
					this.selectedRowKeys = []
					this.$message.success('修改通知人成功！')
					this.getNoticeList(this.page, this.pageSize)
					this.sensitiveVisible = false
				}

			},
			showModalWord () {
				if (this.isAudit != 1) {
					this.$message.destroy()
					this.$message.warning('需要先开启【会话存档】功能，开启后才能正常设置员工违规', 2)
					return false
					// this.settingVisible = true
				}
				this.wordIds = []
				this.sensitiveVisible = true
			},
			async handleSensitive () {
				this.settingDisabled = true
				if (this.wordIds.length == 0) {
					this.$message.warning('请选择敏感词！')
					this.settingDisabled = false
					return false
				}
				const {data: res} = await this.axios.post("limit-word/user-batch-word", {
					corp_id : this.corpId,
					uid     : localStorage.getItem('uid'),
					ids     : this.selectedRowKeys,
					word_ids: this.wordIds
				});
				if (res.error != 0) {
					this.settingDisabled = false
					this.$message.error(res.error_msg);
				} else {
					this.settingDisabled = false
					this.wordIds = []
					this.selectedRowKeys = []
					this.$message.success('修改敏感词成功！')
					this.getNoticeList(this.page, this.pageSize)
					this.sensitiveVisible = false
				}

			},
			cancleSensitive () {
				this.wordIds = []
				this.sensitiveVisible = false
			},
			modalVisibleChange (event, ids) {
				if (event == 'ok') {
					this.wordIds = ids
				}
			},
			// 卡片选择
			changeSelectKey (key) {
				for (let i = 0; i < this.selectedRowKeys.length; i++) {
					if (key == this.selectedRowKeys[i]) {
						this.selectedRowKeys.splice(i, 1)
						this.setBox()
						return false
					}
				}
				this.selectedRowKeys.push(key)
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
						if (userList[i].key == this.selectedRowKeys[j]) {
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
					let index = this.selectedRowKeys.findIndex((id) => id === userList[i].key)
					if (index == -1) {
						this.selectedRowKeys.push(userList[i].key)
					}
				}
			},
			// 删除当前页key
			removeKey (userList) {
				for (let i = 0; i < userList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === userList[i].key);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			handleWxId (value) {
				this.corpId = value
				if (this.corpInfo.length > 0) {
					this.isAudit = this.corpInfo.find(i => i.corpid == this.corpId).isAudit
				}
				this.getAgentList()
				this.chooseNum1 = 0
				this.chooseUserNum1 = 0
				this.chooseDepartmentNum1 = 0
				this.checkedList1 = []
				this.userIds1 = []
				this.$emit('changeCorpId', this.corpId)
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 关闭开通会话存档引导弹窗
			cancleSetting () {
				this.settingVisible = false
			},
			showDepartmentList1 () {
				this.$refs.user1.rightIdList = JSON.parse(JSON.stringify(this.userIds1))
				this.$refs.user1.rightList = JSON.parse(JSON.stringify(this.checkedList1))
				this.showModalDepartment1 = true
			},
			modalVisibleChange5 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.userIds1 = arr
					this.chooseNum1 = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum1 = userNum
					this.chooseDepartmentNum1 = departmentNum
					if (this.chooseNum1 > 0) {
						this.checkedList1 = list
					}else {
						this.checkedList1 = []
					}
				}
				this.showModalDepartment1 = false
			},
			// 点击搜索
			find () {
				this.isLoading = true
				this.getNoticeList()
			},
			// 点击清空
			clear () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.isLoading = true
				this.userIds1 = []
				this.checkedList1 = []
				this.status = 0
				this.chooseNum1 = 0
				this.chooseUserNum1 = 0
				this.chooseDepartmentNum1 = 0
				this.page = 1
				this.pageSize = 15
				this.getAgentList()
			},
			addOk () {
				this.showAddAgentModal = false
				this.getAgentList()
			},
			linkOk () {
				this.showAddAgentModal = false
				this.getAgentList()
			},
			addCancel () {
				this.showAddAgentModal = false
			},
			// 新建提醒
			addNotice () {
				if (this.isAudit != 1) {
					this.$message.destroy()
					this.$message.warning('需要先开启【会话存档】功能，开启后才能正常设置员工违规', 2)
					return false
					// this.settingVisible = true
				} else if (this.agentList.length == 0) {
					this.showAddAgentModal = true
				} else {
					this.$router.push('/archive/userNoticeAdd?agentid=' + this.agentId + '&corpid=' + this.corpId)
				}
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
						this.getNoticeList()
					} else {
						if (this.agentList.length > 0) {
							this.agentId = this.agentList[0].id
							this.getNoticeList()
						} else {
							this.agentList = res.data
							this.isLoading = false
						}
					}
				}
			},
			changeAgentId () {
				this.selectedRowKeys = []
				this.getNoticeList()
			},
			// 获取表格内容
			async getNoticeList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("limit-word/user-remind", {
					corp_id : this.corpId,
					agent_id: this.agentId,
					status  : this.status,
					user_id : this.userIds1,
					title   : this.name,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.userList = res.data.limitWord;
					this.userKeys = res.data.keys
					this.setCheckedBox(this.userList)
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 编辑
			edit (id, name) {
				this.$router.push("/archive/userNoticeAdd?id=" + id + '&agentid=' + this.agentId + '&corpid=' + this.corpId + "&name=" + encodeURIComponent(name))
			},
			// 批量开启
			releaseFollow () {
				let that = this;
				that.$confirm({
					title     : "确定开启选中的员工违规提醒?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeNoticeStatus(that.selectedRowKeys, 2)
					}
				});
			},
			// 批量关闭
			failure () {
				let that = this;
				that.$confirm({
					title     : "确定关闭选中的员工违规提醒?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeNoticeStatus(that.selectedRowKeys, 1)
					}
				});
			},
			// 关闭
			changeSatus (id, status) {
				let that = this;
				let title = ''
				if (status == 2) {
					title = '开启'
				} else {
					title = '关闭'
				}
				that.$confirm({
					title     : "确定" + title + "该提醒？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						let ids = []
						ids.push(id)
						that.changeNoticeStatus(ids, status)
					}
				});
			},
			async changeNoticeStatus (ids, status) {
				const {data: res} = await this.axios.post("limit-word/user-remind-status", {
					ids   : ids,
					status: status
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.getNoticeList(this.page, this.pageSize)
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getNoticeList(page, pageSize);
				this.$emit('changeScroll')
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getNoticeList(1, pageSize);
			}
		},

		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.corpId = this.id
				if (this.corpInfo.length > 0) {
					this.isAudit = this.corpInfo.find(i => i.corpid == this.corpId).isAudit
				}
				this.isLoading = true
				this.selectedRowKeys = []
				if (this.corpInfo.length > 0) {
					this.getAgentList()
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
