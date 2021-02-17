<template>
	<div>
		<div>
			<div class="content-msg">
				<p style="margin-bottom: 2px;">
					为了防止员工恶意删除客户的行为，本系统里采用了员工删除客户提醒功能，来监督员工删除客户的行为。
				</p>
				<p style="margin-bottom: 0px;">
					比如，设置部门负责人监督其部门所有成员删除客户的情况，那么一旦发现，有客户被部门员工删除时，部门负责人会在企业微信端收到一条【员工删人提醒】通知，即哪个员工在什么时间删除了哪个客户，其可以根据成员删人行为的影响程度给予相应的处罚。
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
						<a-select-option :value="''">全部状态</a-select-option>
						<a-select-option :value="1">开启</a-select-option>
						<a-select-option :value="0">关闭</a-select-option>
					</a-select>
					<a-input style="width: 170px;margin-bottom: 20px;margin-right: 5px;" placeholder="员工姓名搜索"
					         v-model="name"></a-input>
					<a-button type="primary" style="margin: 0px 5px;" @click="find">查询</a-button>
					<a-button @click="clear">重置</a-button>
				</a-col>
				<a-col style="float:right;" v-has="'deleteCustomer-add'">
					<a-button class="btn-primary" 
					          @click="addNotice" type="primary">
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
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<a-table :columns="columns" :dataSource="userList" :pagination="false"
					         :rowClassName="rowClassName">
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
						<span slot="user_names" slot-scope="text, record, index">
							<span v-if="record.type == 1">全员</span>
							<a-tag v-if="record.type != 1" v-for="item in record.part" color="blue"
							       style="margin-bottom: 5px;cursor: pointer;">
			                    {{item}}
		                    </a-tag>
		                    <a-tag v-if="record.type != 1" v-for="item in record.user_names" color="orange"
		                           style="margin-bottom: 5px;cursor: pointer;">
			                    {{item}}
		                    </a-tag>
						</span>
						<span slot="open_status" slot-scope="text, record, index">
										<span v-if="record.open_status == 1">已开启</span>
										<span v-if="record.open_status == 0">已关闭</span>
									</span>
						<span slot="action" slot-scope="text, record, index">
										<a-button v-has="'deleteCustomer-edit'" @click="edit(record.id)"
										          style="margin: 0 5px 5px 0">编辑</a-button>
										<a-button v-has="'deleteCustomer-taggle'" v-if="record.open_status == 1" @click="changeSatus(record.id, 0)"
										          style="margin: 0 5px 5px 0">关闭</a-button>
										<a-button v-has="'deleteCustomer-taggle'" v-if="record.open_status == 0" @click="changeSatus(record.id, 1)"
										          style="margin: 0 5px 5px 0">开启</a-button>
									</span>
					</a-table>

					<!-- 分页 -->
					<div class="pagination" style="margin: 20px 15px;overflow: hidden;"
					     v-show="total > 0">
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
							<a-button v-has="'deleteCustomer-edit'" class="btn-primary" 
							          :disabled="selectedRowKeys.length == 0"
							          @click="batchEdit" type="primary">
								批量编辑
							</a-button>
							<a-button class="btn-primary" 
							          v-has="'deleteCustomer-taggle'"
							          :disabled="selectedRowKeys.length == 0"
							          @click="releaseFollow" type="primary">
								批量开启
							</a-button>
							<a-button v-has="'deleteCustomer-taggle'" class="btn-primary" 
							          :disabled="selectedRowKeys.length == 0"
							          @click="failure" type="primary">
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
					<a-form-item v-if="agentList.length > 0" label="选择应用" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
						<a-select
						          :disabled="is_edit == 0 ? false : true"
						          showSearch
						          optionFilterProp="children"
						          style="width: 170px; margin-right: 5px;"
						          @change="changeAgentId1"
						          v-model="agentId1"
						>
							<template v-for="item in agentList">
								<a-select-option :value="item.id">{{item.name}}</a-select-option>
							</template>
						</a-select>
						<div class="content-msg" style="font-size: 13px;">
							<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a
									target="_blank"
									href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
								企业微信后台</a>创建自建应用。<a target="_blank"
							                        href="https://support.qq.com/products/104790/faqs/63937">
								教程</a></p>
							<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">
								2、选择此应用，请确认已设置过应用的可信域名。
								<a :href="$store.state.commonUrl+'/upload/slider.png'" target="_blank"
								   class="el-link el-link--primary">
									<span class="el-link--inner">查看图示</span>
								</a>
							</p>
						</div>
					</a-form-item>
					<a-form-item label="推送成员" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
						<div style="color: #FF562D;">推送成员会在企业微信端收到一条【员工删人提醒】通知，告知哪个员工在什么时间删除了哪个客户</div>
						<a-button v-if="is_edit == 0" @click="showDepartmentList"
						          style="width: 170px;margin-right: 5px;">
							<span v-if="chooseNum > 0">已选择{{chooseNum}}名成员</span>
							<span v-else>选择企业成员</span>
						</a-button>
						<span style="font-weight: 700; font-size: 20px;" v-if="is_edit != 0">已选择
							<span style="font-weight: 700; font-size: 20px;color: #F56C6C">{{userNum}}</span>
							名员工
						</span>
					</a-form-item>
					<a-form-item label="员工删除" :label-col="{ span: 3 }"
					             :wrapper-col="{ span: 21 }">
						<p style="margin-bottom: 5px;color: #FF562D;">设置查看哪些员工删除客户的数据。</p>
						<div>
							<a-checkbox-group :value="typeArr">
								<a-checkbox :value="0"
								            style="display: block;margin: 5px 0px;height: 33px; line-height: 33px;"
								            @click="chooseType(0)">
									全员
								</a-checkbox>
								<div>
									<a-checkbox :value="2"
									            style="margin: 5px 0px;height: 33px; line-height: 33px;"
									            :disabled="typeArr.length == 1 && typeArr[0] == 0"
									            @click="chooseType(2)">
										部分员工
										<a-button style="margin-left: 10px;"
										          v-if="typeArr.indexOf(2) > -1"
										          @click="showDepartmentList1">
											选择
										</a-button>
										<span style="margin-left: 5px"
										      v-show="chooseNum1 > 0">已选择{{userNum1}}名成员，{{departmentNum1}}个部门</span>
									</a-checkbox>
								</div>
							</a-checkbox-group>
						</div>
					</a-form-item>
					<a-form-item label="通知频率" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
						<a-checkbox-group :value="frequency">
							<a-checkbox value="1"
							            style="margin: 5px 10px 5px 0;height: 33px; line-height: 33px;" @click="changeFrequency('1')">
								每次
							</a-checkbox>
							<a-checkbox value="2"  @click="changeFrequency('2')"
							            style="margin: 5px 0px;height: 33px; line-height: 33px;">
								每天早上9点推送昨日汇总
							</a-checkbox>
						</a-checkbox-group>
					</a-form-item>
				</a-form>
			</a-modal>
			<!--选择自建应用成员-->
			<chooseDepartment :key="1" :id="corpId" :agentid="agentId" tipType="5" ref="user"
			                  :chooseNum="chooseNum"
			                  :show="showModalDepartment"
			                  noticeTitle="只展示在企业微信官方后台创建自建应用时，所设置的可见成员，只有他们才拥有接收员工删人提醒的权限。"
			                  :departmentDisabled="1" :is_from="2"
			                  :callback="modalVisibleChange3"></chooseDepartment>
			<chooseDepartment :key="2" ref="user1" :show="showModalDepartment1" :chooseNum="chooseNum1"
			                  :callback="modalVisibleChange5" :disabledVal="0"></chooseDepartment>

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
			title    : "所属部门",
			dataIndex: "department_name",
			key      : "department_name",
			width    : "26%",
		},
		{
			title      : '查看员工删人数据',
			dataIndex  : "user_names",
			width      : "16%",
			key        : "user_names",
			scopedSlots: {customRender: "user_names"}
		},
		{
			title      : "状态",
			dataIndex  : "open_status",
			width      : "12%",
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
				checkBoxValue       : [],        // 敏感词选择框
				batchType           : '0',       //0当前页 1所有
				batchTypeValue      : false,     //当前页/所有 是否选中
				selectedRowKeys     : [],        //选中的敏感词key
				suite_id            : 1,         //应用ID
				corpId              : corpId,    //企业微信选中的id
				corpInfo            : [],        // 企业微信列表
				agentId             : '',        // 自建应用ID
				status              : '',
				name                : '',
				userIds             : [],
				checkedList1        : [],
				userNum1            : 0,
				departmentNum1      : 0,
				chooseNum1          : 0,
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
				checkedList         : [],
				userNum             : 0,
				chooseNum           : 0,
				departmentNum       : 0,
				showModalDepartment : false,
				showModalDepartment1: false,
				editVisible         : false,
				loading4            : false,
				is_edit             : 0,
				userNum             : 0,
				editTitle           : '新建生效员工',
				agentId1            : [],
				typeArr             : [], // 接收数据类型
				party               : [], // 部门
				partyList           : [], // 部门列表
				frequency           : [], // 通知频率
				userDelId           : [],
			};
		},

		methods: {
			// 接收人员类型选择
			chooseType (type) {
				if (type == 0) {
					if (this.typeArr.length > 0 && this.typeArr[0] == 0) {
						this.typeArr = []
					} else {
						this.typeArr = [0]
						this.checkedList1 = []
						this.chooseNum1 = 0
						this.party = []
					}
				} else {
					Array.prototype.indexOf = function (val) {
						for (let i = 0; i < this.length; i++) {
							if (this[i] == val) return i;
						}
						return -1;
					};
					let i = this.typeArr.indexOf(type)
					if (i > -1) {
						this.typeArr.splice(i, 1)
						if (type == 1) {
							this.party = []
						} else {
							this.checkedList1 = []
							this.chooseNum1 = 0
						}
					} else {
						this.typeArr.push(type)
					}
				}
			},
			changeFrequency(val) {
				let index = this.frequency.indexOf(val)
				if(index > -1) {
					this.frequency.splice(index, 1)
				} else {
					this.frequency.push(val)
				}
			},
			changeAgentId1 () {
				this.checkedList = []
				this.chooseNum = 0
			},
			//部门选择弹窗组件
			showDepartmentList () {
				this.setUser(this.checkedList)
				this.showModalDepartment = true
			},
			setUser (users) {
				let that = this
				let checkedKeys = []
				let user = []
				let selectUser = []
				let u = {
					avatar     : "",
					disabled   : false,
					id         : '',
					key        : '',
					scopedSlots: {
						title: "custom"
					},
					title      : ''
				}
				if (users.length > 0) {
					users.map(item => {
						u.avatar = item.avatar
						u.id = item.id
						u.title = item.title
						checkedKeys.push(item.key)
						u.key = item.key
						user.push(JSON.parse(JSON.stringify(u)))
						selectUser.push(JSON.parse(JSON.stringify(u)))
					})
				}
				that.$refs.user.checkedKeys = checkedKeys
				that.$refs.user.checkedKeysArr = checkedKeys
				that.$refs.user.checkedNodes = checkedKeys
				that.$refs.user.staffListArr = user
				that.chooseNum = user.length
				that.$refs.user.keyList = selectUser
			},
			modalVisibleChange3 ( event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
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
				this.getPartyList()
				this.getAgentList()
				this.$emit('changeCorpId', this.corpId)
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			showDepartmentList1 () {
				let arr = []
				this.checkedList1.map(x=>{
					arr.push(x.id)
				})
				this.$refs.user1.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user1.rightList = JSON.parse(JSON.stringify(this.checkedList1))
				this.showModalDepartment1 = true
			},
			modalVisibleChange5 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.party = []
					this.userNum1 = userNum
					this.departmentNum1 = departmentNum
					this.checkedList1 = JSON.parse(JSON.stringify(list))
					this.userIds = arr
					if(this.checkedList1.length > 0){
						for (let i = 0; i < this.checkedList1.length; i++) {
							delete this.checkedList1[i].avatar
							if(this.checkedList1[i].scopedSlots.title == 'title') {
								this.party.push(this.checkedList1[i].id.replace('d-', ''))
							}
						}
					}
					this.chooseNum1 = userNum + departmentNum
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
				this.status = 0
				this.name = ''
				this.page = 1
				this.pageSize = 15
				this.getAgentList()
			},
			// 新建提醒
			addNotice () {
				this.is_edit = 0
				this.editTitle = '新建生效员工'
				this.resetModal()
				this.agentId1 = this.agentId
				this.editVisible = true
			},
			cancelEdit () {
				this.editVisible = false
				this.resetModal()
			},
			async handleEdit () {
				this.loading4 = true
				if(this.agentId == '') {
					this.$message.destroy()
					this.$message.warning('请选择自建应用！')
					this.loading4 = false
					return false
				}
				if(this.checkedList == 0 && this.is_edit == 0) {
					this.$message.destroy()
					this.$message.warning('请选择推送成员！')
					this.loading4 = false
					return false
				}
				if(this.typeArr.length == 0) {
					this.$message.destroy()
					this.$message.warning('请选择跟进数据')
					this.createDisabled = false
					this.loading4 = false
					return false
				}
				if (this.typeArr.indexOf(1) > -1 && this.party.length == 0) {
					this.$message.destroy()
					this.$message.warning('请选择跟进数据部门')
					this.createDisabled = false
					this.loading4 = false
					return false
				} else if (this.typeArr.indexOf(2) > -1 && this.checkedList1.length == 0) {
					this.$message.destroy()
					this.$message.warning('请选择跟进数据员工')
					this.createDisabled = false
					this.loading4 = false
					return false
				}
				if(this.frequency.length == 0) {
					this.$message.destroy()
					this.$message.warning('请选择推送频率')
					this.createDisabled = false
					this.loading4 = false
					return false
				}
				let params = {}
				let url = ''
				if(this.is_edit == 0) {
					params = {
						corp_id   : this.corpId,
						agent_id  : this.agentId1,
						user_id   : this.checkedList,
						inform_user: this.checkedList1,
						department : this.party,
						frequency : this.frequency
					}
					url = "work-user-del-follow-user/add-user-del-data"
				} else {
					params = {
						is_edit   : this.is_edit,
						userDelId : this.userDelId,
						corp_id   : this.corpId,
						inform_user: this.checkedList1,
						department : this.party,
						frequency : this.frequency,
					}
					url = "work-user-del-follow-user/user-del-user-edit"
				}
				const {data: res} = await this.axios.post(url, params);
				if (res.error != 0) {
					this.isLoading = false;
					this.loading4 = false
					this.$message.error(res.error_msg);
				} else {
					this.getNoticeList(this.page, this.pageSize)
					this.selectedRowKeys = []
					this.editVisible = false
					this.resetModal()
				}
			},
			resetModal() {
				this.loading4 = false
				this.checkedList = []
				this.chooseNum = 0
				this.checkedList1 = []
				this.chooseNum1 = 0
				this.userDelId = []
				this.userNum = 0
				this.is_edit = 0
				this.typeArr = []
				this.party = []
				this.frequency = []
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
							this.agentId1 = this.agentList[0].id
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
				const {data: res} = await this.axios.post("work-user-del-follow-user/user-del-lists", {
					corp_id    : this.corpId,
					agent_id   : this.agentId,
					open_status: this.status,
					name       : this.name,
					page       : page,
					pageSize   : pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.userList = res.data.data
					this.userKeys = res.data.dataIds
					this.setCheckedBox(this.userList)
					this.isLoading = false
					this.total = parseInt(res.data.count)
					this.page = page
					this.pageSize = pageSize
					this.quickJumper = this.total > this.pageSize
				}
			},
			batchEdit() {
				this.resetModal()
				this.is_edit = 2
				this.userNum = this.selectedRowKeys.length
				this.editTitle = '批量编辑'
				this.userDelId = JSON.parse(JSON.stringify(this.selectedRowKeys))
				this.agentId1 = this.agentId
				this.editVisible = true
			},
			// 编辑
			async edit (id) {
				this.resetModal()
				this.is_edit = 1
				this.userNum = 1
				this.editTitle = '编辑生效员工'
				const {data: res} = await this.axios.post("work-user-del-follow-user/add-user-del-data", {
					userDelId  : id,
					is_edit    : 1,
					corp_id    : this.corpId
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.userDelId = [id]
					this.typeArr = []
					if(res.data.type == 1) {
						this.typeArr = [0]
					} else {
						this.party = res.data.department
						if(this.party.length > 0) {
							this.typeArr.push(1)
						}
						this.checkedList1 = res.data.inform_user
						this.chooseNum1 = this.checkedList1.length
						this.departmentNum1 = this.party.length
						this.userNum1 = this.chooseNum1 - this.departmentNum1
						if(this.checkedList1.length > 0) {
							this.typeArr.push(2)
						}
					}
					this.agentId1 = res.data.agent.toString()
					this.checkedList = [res.data.user_id]
					this.frequency = res.data.frequency
					this.editVisible = true
				}
			},
			// 批量开启
			releaseFollow () {
				let that = this;
				that.$confirm({
					title     : "确定开启选中的员工删人提醒?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeNoticeStatus(that.selectedRowKeys, 1)
					}
				});
			},
			// 批量关闭
			failure () {
				let that = this;
				that.$confirm({
					title     : "确定关闭选中的员工删人提醒?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeNoticeStatus(that.selectedRowKeys, 0)
					}
				});
			},
			// 关闭
			changeSatus (id, status) {
				let that = this;
				let title = ''
				if (status == 1) {
					title = '开启'
				} else {
					title = '关闭'
				}
				that.$confirm({
					title     : "确定" + title + "该员工删人提醒？",
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
				const {data: res} = await this.axios.post("work-user-del-follow-user/add-user-del-data", {
					userDelId  : ids,
					open_status: status,
					is_edit    : 1,
					corp_id    : this.corpId
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
			},
			async getPartyList () {
				const {data: res} = await this.axios.post('work-follow-msg/get-party-list', {
					suite_id: 1,
					corp_id : this.corpId
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.partyList = res.data.party_list
				}
			},
		},

		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.corpId = this.id
				this.isLoading = true
				this.selectedRowKeys = []
				if (this.corpInfo.length > 0) {
					this.getPartyList()
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
