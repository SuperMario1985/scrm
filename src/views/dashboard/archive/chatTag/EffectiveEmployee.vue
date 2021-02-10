<template>
	<div>
		<div class="content-hd">
			<a-col>
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
				<a-button @click="showDepartmentList(1)"
				          style="min-width: 170px;margin-right: 5px;">
					<span v-if="chooseNum0 > 0">已选择{{chooseUserNum0}}名成员，{{chooseDepartmentNum0}}个部门</span>
					<span v-else>选择部门成员</span>
				</a-button>
				<a-button @click="showChooseTag"
				          style="width: 170px;margin-right: 5px;">
					<span v-if="tags.length > 0">已选择{{tags.length}}个标签</span>
					<span v-else>选择标签</span>
				</a-button>
				<a-select
						optionFilterProp="children"
						style="width: 170px;margin-right: 5px;"
						v-model="status"
				>
					<a-select-option :value="0">全部状态</a-select-option>
					<a-select-option :value="2">开启</a-select-option>
					<a-select-option :value="1">关闭</a-select-option>
				</a-select>
				<a-button type="primary" style="margin: 0px 5px;" @click="find">查询</a-button>
				<a-button @click="clear">重置</a-button>
				<a-button @click="setEmployee([])" class="btn-primary" style="float: right;"type="primary" v-has="'chatTag-employee-add'">
					生效员工
				</a-button>
			</a-col>
			<div style="margin: 15px 0;">
				共
				<span style="color: blue">{{total}}</span>
				条
			</div>
			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<a-table :columns="columns" :dataSource="employeeList" :pagination="false"
					         :rowClassName="rowClassName" v-has="'chatTag-employee-list'">
						<span slot="checkedBoxTitle">
						</span>
						<span slot="external_num">
							已打客户数
							<a-tooltip placement="bottom">
			                    <template slot="title">
			                        <span>只统计实际已打客户数，若打上该标签，再移除，不计入统计。</span>
			                    </template>
			                    <a-icon type="question-circle" style="margin-left:5px;"/>
		                    </a-tooltip>
						</span>
						<span slot="checkedBox" slot-scope="text, record, index">
							<a-checkbox style=""
							            v-model="checkBoxValue[index]"
							            @click="changeSelectKey(record.key)">
							</a-checkbox>
						</span>
						<template slot="user_name" slot-scope="text, record, index">
							<a-avatar v-if="record.avatar" shape="square" :size="32"
							          :src="record.avatar" style="float: left;"/>
							<img style="width: 32px;height: 32px;float: left;"
							     v-if="!record.avatar" src="../../../../assets/useradvart.png"/>
							<div style="float: left; height: 32px; line-height: 32px; margin-left: 10px;">{{record.user_name}}</div>
						</template>
						<span slot="tagData" slot-scope="text, record, index">
							<span v-if="record.tagData.length == 0">--</span>
							<a-popover v-for="item in record.tagData" placement="right">
								<span slot="content">
									聊天中提到含
									<a-tag v-for="key in item.keyword"  color="blue"
									        style="margin-bottom: 5px;cursor: pointer;">
				                        {{key}}
			                        </a-tag>
									关键词将自动打上标签
								</span>
								 <a-tag  color="orange"
								        style="margin-bottom: 5px;cursor: pointer;">
			                        {{item.title}}
		                        </a-tag>
							</a-popover>

						</span>
						<span slot="status" slot-scope="text, record, index">
							<span v-if="record.status == 2">已开启</span>
							<span v-if="record.status == 1">已关闭</span>
						</span>
						<span slot="action" slot-scope="text, record, index">
							<a-button @click="detail(record.id)"
							          style="margin: 0 5px 5px 0" v-has="'chatTag-employee-info'">详情</a-button>
							<a-button @click="edit(index)"
							          style="margin: 0 5px 5px 0" v-has="'chatTag-employee-edit'">编辑</a-button>
							<a-button v-if="record.status == 2" @click="changeSatus(record.id, 1)"
							          style="margin: 0 5px 5px 0" v-has="'chatTag-employee-open'">关闭</a-button>
							<a-button v-if="record.status == 1" @click="changeSatus(record.id, 2)"
							          style="margin: 0 5px 5px 0" v-has="'chatTag-employee-open'">开启</a-button>
							<a-button @click="changeSatus(record.id, 0)"
							          style="margin: 0 5px 5px 0" v-has="'chatTag-employee-delete'">删除</a-button>
						</span>
					</a-table>
					<!-- 分页 -->
					<div class="pagination" style="margin: 20px 15px;overflow: hidden;"
					     v-show="total > 0" v-has="'chatTag-employee-list'">
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
							          :disabled="selectedRowKeys.length == 0" type="primary" v-has="'chatTag-employee-edit'">
								批量编辑
							</a-button>
							<a-button class="btn-primary" icon="delete"
							          @click="deleteUser"
							          :disabled="selectedRowKeys.length == 0" type="primary" v-has="'chatTag-employee-delete'">
								批量删除
							</a-button>
							<a-button class="btn-primary" icon="unlock"
							          :disabled="selectedRowKeys.length == 0"
							          @click="releaseFollow" type="primary" v-has="'chatTag-employee-open'">
								批量开启
							</a-button>
							<a-button class="btn-primary" icon="lock"
							          :disabled="selectedRowKeys.length == 0"
							          @click="failure" type="primary" v-has="'chatTag-employee-open'">
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
			<!--    添加、修改、批量修改弹窗    -->
			<a-modal v-model="employeeVisible" :title="modalTitle" @cancel="cancleEmployee"
			         width="666px!important">
				<template slot="footer">
					<a-button @click="cancleEmployee">关闭</a-button>
					<a-button type="primary" :disabled="settingDisabled" @click="handleEmployee">确定</a-button>
				</template>
				<h3 v-if="selectedKeys.length > 0">已选择<span style="color: #FF562D;">{{selectedKeys.length}}</span>名成员
				</h3>
				<a-form>
					<a-form-item v-if="selectedKeys.length == 0" label="企业成员" :label-col="{ span: 4 }"
					             :wrapper-col="{ span: 20 }">
						<a-button @click="showDepartmentList(2)"
						          style="min-width: 170px;margin-right: 5px;">
							<span v-if="chooseNum1 > 0">已选择{{chooseUserNum1}}名成员</span>
							<span v-else>选择部门成员</span>
						</a-button>
					</a-form-item>
					<a-form-item label="聊天打标签" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<a-button @click="showChooseTag1()"
						          style="width: 170px;margin-right: 5px;">
							<span v-if="addOrEditTags.length > 0">已选择{{addOrEditTags.length}}个标签</span>
							<span v-else>选择标签</span>
						</a-button>
					</a-form-item>
					<a-form-item v-if="selectedKeys.length == 0" label="生效状态" :label-col="{ span: 4 }"
					             :wrapper-col="{ span: 20 }">
						<a-radio-group v-model="ruleStatus">
							<a-radio :value="2">
								开启
							</a-radio>
							<a-radio :value="1">
								关闭
							</a-radio>
						</a-radio-group>
					</a-form-item>
				</a-form>

			</a-modal>
			<!--    选择成员    -->
			<chooseDepartment v-if="!isLoading" :departmentDisabled="departmentDisabled" :id="corpId" ref="user" :show="showModalDepartment"
			                  :chooseNum="chooseNum" isAudit="2" :isAuditEdit="isAuditEdit"
			                  :isAuditUserAll="isAuditUserAll" noticeTitle="只显示当前开启会话存档的企业成员。"
			                  :callback="modalVisibleChange3"></chooseDepartment>
			<!--    选择标签弹窗  -->
			<a-modal v-model="chooseTagVisible" title="选择标签" @cancel="cancleChooseTag"
			         width="700px !important">
				<template slot="footer">
					<a-button @click="cancleChooseTag">关闭</a-button>
					<a-button @click="handleChoose">确定</a-button>
				</template>
				<corpChooseTag :id="corpId" ref="chooseTag" :isNotAdd="1" v-if="chooseTagVisible" :callback="modalVisibleChange"
				               :hasChoose="wordIds">
				</corpChooseTag>
			</a-modal>
			<!--    选择规则标签弹窗    -->
			<a-modal v-model="chooseTagVisible1" title="选择标签" @cancel="cancleChooseTag1"
			         width="700px !important">
				<template slot="footer">
					<a-button @click="cancleChooseTag1">关闭</a-button>
					<a-button @click="handleChoose1">确定</a-button>
				</template>
				<div style="color: #FF562D;margin-bottom: 10px;">仅显示已关联标签规则的客户标签。</div>
				<corpChooseTag1 :id="corpId" ref="chooseTag1" v-if="chooseTagVisible1" :callback="modalVisibleChange1"
				                :hasChoose="editTags">
				</corpChooseTag1>
			</a-modal>
			<!--    详情   -->
			<a-drawer
					:destroyOnClose='true'
					:title="userName"
					placement="right"
					:closable="false"
					@close="onClose"
					width="1000px!important"
					:visible="detailVisible"
			>
				<div style="padding: 10px 20px;">
					<div v-if="tagRule.length > 0">
						<div style="margin: 10px 0;">打标签规则：</div>
						<p style="margin-bottom: 5px;" v-for="item in tagRule">
							聊天中提到含
							<a-tag v-for="word in item.keyWord" color="blue">{{word}}</a-tag>
							关键词将自动打上标签
							<a-tag color="orange">{{item.tag_name}}</a-tag>
						</p>
					</div>
					<a-row style="background-color: #F9F9F9;margin-top: 10px;">
						<a-col :span="12" style="text-align: center; padding: 10px;border: 1px solid #E9E9E9;">
							<p style="color: #000;font-weight: 700;font-size: 34px;margin-bottom: 10px;">{{todayNum}}</p>
							<p style="margin-bottom: 0px; color: #000000a6;">今日打上标签的客户数</p>
						</a-col>
						<a-col :span="12" style="text-align: center; padding: 10px;border: 1px solid #E9E9E9;border-left: 0;">
							<p style="color: #000;font-weight: 700;font-size: 34px;margin-bottom: 10px;">{{allNum}}</p>
							<p style="margin-bottom: 0px; color: #000000a6;">累计打上标签的客户数</p>
						</a-col>
					</a-row>
					<div style="background-color: #FFFFFF;padding: 10px 10px 10px 10px;">
						<div style="height: 32px;line-height: 32px;">
							共
							<span style="color: blue">{{total1}}</span>
							条
						</div>
						<a-input :allowClear="true" @keyup.enter="searchStaff" style="width: 210px; margin-right: 10px;" placeholder="请输入要搜索的客户"
						         v-model="customName"></a-input>
						<a-select
								showSearch
								optionFilterProp="children"
								style="width: 210px;margin-right: 10px;"
								v-model="tagId"
								placeholder="请选择标签"
								v-if="tagList.length > 1"
						>
							<a-select-option :value="''">全部标签</a-select-option>
							<template v-for="item in tagList">
								<a-select-option :value="item.id">{{item.title}}</a-select-option>
							</template>
						</a-select>
						<a-button type="primary" style="margin-right: 10px;"
						          @click="searchStaff">查找
						</a-button>
						<a-button style="margin-right: 10px;" @click="reset">重置</a-button>
					</div>
					<div class="content-bd" style="padding: 10px;">
						<a-spin tip="加载中..." size="large" :spinning="isLoading1">
							<a-table
									:columns="columns1"
									:dataSource="customList"
									:pagination="false"
									:rowClassName="rowClassName"
							>
								<span slot="userInfo" slot-scope="text, record, index" >
									<div style="white-space: nowrap;">
										<a-avatar v-if="record.avatar" shape="square" :size="42" :src="record.avatar"
										          style="float: left;"/>
										<img style="width: 42px;height: 42px;" v-if="!record.avatar"
										     src="../../../../assets/useradvart.png"/>
										<span style="display:inline-block;height: 42px; line-height: 42px;margin-left: 10px;">
											{{record.name}}
											<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
												<template
														v-if="record.corp_name != null">@{{record.corp_name}}</template>
												<template v-else>@微信</template>
											</span>
										</span>
									</div>
								</span>
								<span slot="contentData" slot-scope="text, record, index">
									<span v-html="record.content"></span>
								</span>
								<span slot="tagName" slot-scope="text, record, index">
									<a-tag color="orange">{{record.tag_name}}</a-tag>
								</span>
							</a-table>
							<!--								 分页 -->
							<div class="pagination"
							     style="width: 100%;position: absolute;margin: 20px 0px 80px;"
							     v-show="total1 > 0">
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total1" showSizeChanger :showQuickJumper="quickJumper"
									              :current="page1"
									              :pageSize="pageSize1"
									              :pageSizeOptions="['15','30','50','100']"
									              @change="changePage1"
									              @showSizeChange="showSizeChange1"/>
								</div>
							</div>
						</a-spin>
					</div>
				</div>
			</a-drawer>
		</div>
	</div>
</template>

<script>
	import linkAgent from '@/components/addAgent/index.vue'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import corpChooseTag1 from "@/components/corpChooseTag/CorpChooseRuleTag.vue"

	// 活动列表
	const columns = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "60px",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "生效员工",
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {customRender: "user_name"}
		},
		{
			title      : "聊天自动打标签",
			dataIndex  : "tagData",
			key        : "tagData",
			width      : '30%',
			scopedSlots: {customRender: "tagData"}
		},
		{

			dataIndex: "external_num",
			key      : "external_num",
			scopedSlots: {title: "external_num"}
		},
		{
			title      : "状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '180px',
			scopedSlots: {customRender: "action"}
		}
	];
	const columns1 = [
		{
			title      : "客户",
			dataIndex  : "userInfo",
			key        : "userInfo",
			scopedSlots: {customRender: "userInfo"}
		},
		{
			title      : "关键词",
			dataIndex  : "contentData",
			key        : "contentData",
			width      : '20%',
			scopedSlots: {customRender: "contentData"}
		},
		{
			title      : "自动打标签",
			dataIndex  : "tagName",
			key        : "tagName",
			scopedSlots: {customRender: "tagName"}
		},
		{
			title      : "添加时间",
			dataIndex  : "add_time",
			key        : "add_time"
		},
	];
	export default {
		name      : "EffectiveEmployee",
		components: {linkAgent, chooseDepartment, corpChooseTag, corpChooseTag1},
		props: {
			id: {
				type: String,
				default: ''
			}
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				departmentDisabled  : 0,
				isAudit             : 0, // 是否开启会话存档
				employeeVisible     : false, // 添加、修改、批量修改 弹窗是否显示
				selectedKeys        : [],    // 选中的员工规则id， []表示添加
				modalTitle          : '添加生效员工', // 添加、修改、批量修改弹窗标题
				settingDisabled     : false,     // 添加、修改、批量弹窗确认按钮disabled
				checkBoxValue       : [],        // 员工规则多选框
				batchType           : '0',       //0当前页 1所有
				batchTypeValue      : false,     //当前页/所有 是否选中
				selectedRowKeys     : [],        //选中的员工规则key
				suite_id            : 1,         //应用ID
				corpId              : corpId,    //企业微信选中的id
				corpInfo            : [],        // 企业微信列表
				chooseTagVisible    : false,     // 选择标签弹窗显示隐藏
				tags                : [],        // 筛选选择的标签
				wordIds             : [],        // 选择标签弹窗的标签
				status              : 0,         // 状态
				employeeList        : [],        // 表格数组
				isLoading           : true,      //Loading 组件显示与隐藏
				corpLen             : JSON.parse(localStorage.getItem('corpArr')).length,
				//表格部分
				columns,
				//分页
				total               : 0, //总条数
				quickJumper         : false, // 是否显示快速跳转的控件
				page                : 1, //页码
				pageSize            : 15, //每页数据条数
				chooseNum0          : 0, // 部门成员总个数
				chooseUserNum0      : 0,//成员个数
				chooseDepartmentNum0: 0,//部门个数
				checkedList         : [], // 筛选员工数据
				chooseNum           : 0, // 选择成员组件选中数量
				showModalDepartment : false, // 选择成员组件是否显示
				isUserTag           : 0,
				userType            : 0,  // 选择成员的标识
				isAuditEdit         : 0,
				isAuditUserAll      : 0,
				checkedList1        : [], // 添加规则选中的成员
				chooseNum1          : 0, // 添加规则选中的部门成员总个数
				chooseUserNum1      : 0,//成员个数
				chooseDepartmentNum1: 0,//部门个数
				addOrEditTags       : [], // 添加或编辑标签数据
				ruleStatus          : 2, // 规则状态
				chooseTagVisible1   : false, // 选择规则标签弹窗是否显示
				editTags            : [],    // 添加或编辑弹窗标签弹窗选中的数据

				detailVisible     : false,  // 详情弹窗是否显示
				ruleId            : '',     // 详情的规则id
				customName        : '',     // 客户名筛选
				tagId             : '',     // 标签筛选
				tagList           : [],     // 标签列表
				tagRule           : [],     // 规则数据
				todayNum          : '0',    // 今日打标签客户数
				allNum            : '0',    // 累计打标签客户数
				userName          : '',     // 详情title
				columns1,
				customList        : [],     // 客户列表
				total1            : 0,
				page1             : 1,
				pageSize1         : 15,
				isLoading1        : false,
				customAndDetaiFlag: 0       // 取消详情数据加载标识
			}
		},
		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info
				this.isLoading = true
				this.corpId = this.id
				if(this.corpInfo.length > 0) {
					// this.isAudit = 1
					this.isAudit = this.corpInfo.find(i => i.corpid == this.corpId).isAudit
				}
				this.selectedRowKeys = []
				this.getEmployeeList()
			});
		},
		methods   : {
			// 标签选择弹窗取消
			cancleChooseTag () {
				this.chooseTagVisible = false
			},
			// 标签选择弹窗打开
			showChooseTag () {
				this.chooseTagVisible = true
				this.wordIds = JSON.parse(JSON.stringify(this.tags))
			},
			// 标签选择确认
			handleChoose () {
				this.tags = JSON.parse(JSON.stringify(this.wordIds))
				this.chooseTagVisible = false
			},
			// 选择标签回调
			modalVisibleChange (event, ids) {
				if (event == 'ok') {
					if (ids == '') {
						this.wordIds = []
					} else {
						this.wordIds = ids.split(',')
					}
				}
			},
			// 规则标签选择弹窗取消
			cancleChooseTag1 () {
				this.chooseTagVisible1 = false
			},
			// 规则标签选择弹窗打开
			showChooseTag1 () {
				this.chooseTagVisible1 = true
				this.editTags = JSON.parse(JSON.stringify(this.addOrEditTags))
			},
			// 规则标签选择确认
			handleChoose1 () {
				this.addOrEditTags = JSON.parse(JSON.stringify(this.editTags))
				this.editTags = []
				this.chooseTagVisible1 = false
			},
			// 规则选择标签回调
			modalVisibleChange1 (event, ids) {
				if (event == 'ok') {
					if (ids == '') {
						this.editTags = []
					} else {
						this.editTags = ids.split(',')
					}
				}
			},
			// 批量删除
			deleteUser () {
				let that = this;
				that.$confirm({
					title     : "确定删除选中的员工规则?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeEmployeeStatus(that.selectedRowKeys, 0)
					}
				});
			},
			//部门选择弹窗组件
			showDepartmentList (type) {
				this.userType = type
				if (this.userType == 1) {
					this.isAuditEdit = 0
					this.isAuditUserAll = 1
					this.chooseNum = this.chooseNum0
					this.departmentDisabled = 0
					let arr = []
					this.checkedList.map(x=>{
						arr.push(x.id)
					})
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
					this.isUserTag = 0
				} else {
					this.isAuditEdit = 1
					this.isAuditUserAll = 0
					this.chooseNum = this.chooseNum1
					let arr = []
					this.checkedList1.map(x=>{
						arr.push(x.id)
					})
					this.departmentDisabled = 1
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList1))
					this.isUserTag = 1
				}

				this.showModalDepartment = true
			},
			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.userType == 1) {
						this.checkedList = list
						this.chooseNum0 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum0 = userNum
						this.chooseDepartmentNum0 = departmentNum
					} else {
						this.checkedList1 = list
						this.chooseNum1 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum1 = userNum
						this.chooseDepartmentNum1 = departmentNum
					}
				}
				this.showModalDepartment = false
			},
			// 批量修改
			showModalWord () {
				this.modalTitle = '批量编辑生效员工'
				this.selectedKeys = JSON.parse(JSON.stringify(this.selectedRowKeys))
				this.addOrEditTags = []
				this.employeeVisible = true
			},
			// 添加或修改员工规则
			async handleEmployee () {
				this.settingDisabled = true
				let url = ''
				let params = {}
				if (this.addOrEditTags.length == 0) {
					this.$message.warning('请选择标签！')
					this.settingDisabled = false
					return false
				}
				if (this.selectedKeys.length == 0) {
					url = 'work-tag-keyword-rule/user-tag-add'
					if (this.checkedList1.length == 0) {
						this.$message.warning('请选择企业成员！')
						this.settingDisabled = false
						return false
					}
					let userIds = []
					for (let user of this.checkedList1) {
						userIds.push(user.id)
					}
					params = {
						corp_id : this.corpId,
						user_ids: userIds,
						tag_ids : this.addOrEditTags,
						status  : this.ruleStatus
					}
				} else {
					url = 'work-tag-keyword-rule/user-tag-update'
					params = {
						ids    : this.selectedKeys,
						tag_ids: this.addOrEditTags
					}
				}
				const {data: res} = await this.axios.post(url, params);
				if (res.error != 0) {
					this.settingDisabled = false
					this.$message.error(res.error_msg);
				} else {
					this.settingDisabled = false
					this.addOrEditTags = []
					this.selectedRowKeys = []
					if (this.selectedKeys.length == 0) {
						this.$message.success('添加成功！')
						this.clear()
					} else {
						this.$message.success('修改成功！')
						this.getEmployeeList(this.page, this.pageSize)
					}
					this.selectedKeys = []
					this.employeeVisible = false
				}

			},
			cancleEmployee () {
				this.checkedList1 = []
				this.chooseNum1 = 0
				this.chooseUserNum1 = 0
				this.chooseDepartmentNum1 = 0
				this.addOrEditTags = []
				this.ruleStatus = 2
				this.employeeVisible = false
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
						this.addKey(this.employeeList)
						this.setCheckedBox(this.employeeList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = JSON.parse(JSON.stringify(this.employeeKeys))
						this.setBox()
					}
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						// 当前
						this.removeKey(this.employeeList)
						this.setCheckedBox(this.employeeList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
						this.setBox()
					}
					this.batchTypeValue = false
				}
			},
			setBox () {
				this.setCheckedBox(this.employeeList)
			},
			// 设置列表卡片多选框选中状态
			setCheckedBox (employeeList) {
				this.checkBoxValue = new Array(employeeList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < employeeList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (employeeList[i].key == this.selectedRowKeys[j]) {
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
					if (this.selectedRowKeys.length == this.employeeKeys.length && this.employeeKeys.length != 0) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}
				if (employeeList.length == 0) {
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
			addKey (employeeList) {
				for (let i = 0; i < employeeList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === employeeList[i].key)
					if (index == -1) {
						this.selectedRowKeys.push(employeeList[i].key)
					}
				}
			},
			// 删除当前页key
			removeKey (employeeList) {
				for (let i = 0; i < employeeList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === employeeList[i].key);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			handleWxId (value) {
				this.corpId = value
				if(this.corpInfo.length > 0) {
					this.isAudit = this.corpInfo.find(i => i.corpid == this.corpId).isAudit
				}
				this.tags = []
				this.checkedList = []
				this.chooseNum0 = 0
				this.chooseUserNum0 = 0
				this.chooseDepartmentNum0 = 0
				this.$emit('changeCorpId', this.corpId)
				// this.$store.dispatch('changeCorp', this.corpInfo.find(c => c.corpid == value))
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
				this.getEmployeeList()
			},
			// 设置生效员工
			setEmployee (ids) {
				if (this.isAudit != 1) {
					this.$message.destroy()
					this.$message.warning('需要先开启【会话存档】功能，开启后才能正常设置员工违规', 2)
					return false
					// this.settingVisible = true
				}
				this.chooseNum1 = 0
				this.chooseUserNum1 = 0
				this.chooseDepartmentNum1 = 0
				this.checkedList1 = []
				this.modalTitle = '添加生效员工'
				this.selectedKeys = ids
				this.addOrEditTags = []
				this.ruleStatus = 2
				this.employeeVisible = true
			},
			// 点击清空
			clear () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.isLoading = true
				this.checkedList = []
				this.chooseNum0 = 0
				this.chooseUserNum0 = 0
				this.chooseDepartmentNum0 = 0
				this.tags = []
				this.status = 0
				this.page = 1
				this.pageSize = 15
				this.getEmployeeList()
			},
			// 获取表格内容
			async getEmployeeList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				let checkedList = []
				for (let user of this.checkedList) {
					checkedList.push(user.id)
				}
				const {data: res} = await this.axios.post("work-tag-keyword-rule/user-list", {
					corp_id : this.corpId,
					status  : this.status,
					user_id : checkedList,
					tag_ids : this.tags,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.employeeList = res.data.userData;
					this.employeeKeys = res.data.keys
					this.setCheckedBox(this.employeeList)
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 编辑
			edit (index) {
				this.modalTitle = '编辑生效员工'
				this.selectedKeys = [this.employeeList[index].key]

				this.addOrEditTags = []
				for (let tag of this.employeeList[index].tagData) {
					this.addOrEditTags.push(tag.id)
				}
				this.employeeVisible = true
			},
			// 批量开启
			releaseFollow () {
				let that = this;
				that.$confirm({
					title     : "确定开启选中的员工规则?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeEmployeeStatus(that.selectedRowKeys, 2)
					}
				});
			},
			// 批量关闭
			failure () {
				let that = this;
				that.$confirm({
					title     : "确定关闭选中的员工规则?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeEmployeeStatus(that.selectedRowKeys, 1)
					}
				});
			},
			// 关闭
			changeSatus (id, status) {
				let that = this;
				let title = ''
				if (status == 2) {
					title = '开启'
				} else if (status == 1) {
					title = '关闭'
				} else {
					title = '删除'
				}
				that.$confirm({
					title     : "确定" + title + "该员工规则？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						let ids = []
						ids.push(id)
						that.changeEmployeeStatus(ids, status)
					}
				});
			},
			// 改变员工规则状态
			async changeEmployeeStatus (ids, status) {
				const {data: res} = await this.axios.post("work-tag-keyword-rule/user-change-status", {
					corp_id: localStorage.getItem('corpId'),
					ids    : ids,
					status : status
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.getEmployeeList(this.page, this.pageSize)
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getEmployeeList(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getEmployeeList(1, pageSize);
			},
			// 详情
			detail (id) {
				this.ruleId = id
				this.detailVisible = true
				this.customAndDetaiFlag = 0
				this.getCustomList()
				this.getTagDetail()
			},
			// 关闭详情弹窗
			onClose () {
				this.customAndDetaiFlag = 0
				this.detailVisible = false
				this.customList = []
				this.customName = ''
				this.tagId = []
				this.tagList = []
			},
			// 查找
			searchStaff () {
				this.getCustomList()
			},
			// 获取详情 规则数据
			async getTagDetail () {
				const {data: res} = await this.axios.post("work-tag-keyword-rule/user-tag-detail", {
					rule_id: this.ruleId,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagList = res.data.tagData
					this.tagRule = res.data.ruleData
					this.todayNum = res.data.today_num
					this.allNum = res.data.total
					this.userName = res.data.user_name
					this.customAndDetaiFlag++
					if (this.customAndDetaiFlag >= 2) {
						this.isLoading1 = false
					}
				}
			},
			// 获取客户数据
			async getCustomList (page = 1, pageSize = this.pageSize1) {
				this.isLoading1 = true
				const {data: res} = await this.axios.post("work-tag-keyword-rule/user-tag-custom", {
					rule_id : this.ruleId,
					name    : this.customName,
					tag_id  : this.tagId,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading1 = false;
					this.$message.error(res.error_msg);
				} else {
					this.customList = res.data.externalData
					this.total1 = parseInt(res.data.count)
					this.page1 = page
					this.pageSize1 = pageSize
					this.customAndDetaiFlag++
					if (this.customAndDetaiFlag >= 2) {
						this.isLoading1 = false
					}
				}
			},
			// 清空
			reset () {
				this.customName = ''
				this.tagId = []
				this.getCustomList()
			},
			// 客户数据分页
			changePage1 (page, pageSize) {
				this.isLoading = true
				this.getCustomList(page, pageSize);
				this.$emit('changeScroll')
			},
			showSizeChange1 (page, pageSize) {
				this.isLoading = true
				this.getCustomList(1, pageSize);
			},
		},
	}
</script>

<style scoped>
	.btn-primary {
		margin-left: 20px;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 0 5px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}
</style>