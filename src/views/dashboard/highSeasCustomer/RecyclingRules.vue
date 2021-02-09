<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;"  id="components-layout-demo-basic" class="scroll">
		<!-- <a-card style="margin-bottom:20px;padding:10px 20px;">
			<label class="tpl-title">客户回收</label>
		</a-card> -->
		<a-layout-content class="kehuconent">
			<div style="font-size:16px;font-weight:700;color:#333333;margin-left:16px">客户回收</div>
			<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7">
				<p style="margin-bottom: 2px;">
					当通用规则（指所有员工）和特殊化规则（指个人规则）同时存在的情况下，员工则执行某执行特殊化规则。比如，张三既在通用规则，又在特殊化规则，那么，就按特殊化规则执行。</p>
			</div>
			<a-row style="margin-bottom:20px;padding:0 20px;">
				<a-col style="float:left;">
					<a-select
							v-if="corpLen > 1"
							showSearch
							optionFilterProp="children"
							style="width: 210px;margin-right: 5px;"
							@change="handleChange"
							v-model="corpId"
					>
						<template v-for="item in corpInfo">
							<a-select-option :value="item.corpid">{{item.corp_full_name ||
								item.corp_name}}
							</a-select-option>
						</template>
					</a-select>
				</a-col>
				<a-col style="float:right;">
					<a-button
							type="primary"
							icon="plus" @click="addRules" v-has="'highSeasCustomerRecyclingRules-add'"
					>客户回收规则
					</a-button>
				</a-col>
			</a-row>

			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-table
								:columns="columns"
								:dataSource="list"
								:pagination="false"
								:rowClassName="rowClassName" v-has="'highSeasCustomerRecyclingRules-list'"
						>
							<template slot="nameArr" slot-scope="text, record, index">
								<template v-if="record.valid_type == 1">
									<a-tag color="purple" v-for="item in record.nameArr">
										{{item}}
									</a-tag>
								</template>
								<template v-if="record.valid_type == 2">
									<template v-for="user in record.user_key">
										<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'"
													color="orange"
													style="margin-top: 5px;">{{user.title}}
										</a-tag>
									</template>
									<template v-for="user in record.user_key">
										<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'"
													color="blue"
													style="margin-top: 5px;">{{user.title}}
										</a-tag>
									</template>
								</template>
							</template>
							<template slot="ruleData" slot-scope="text, record, index">
								<div v-for="item in record.ruleData">
									{{item}}
								</div>
							</template>
							<template slot="userLimit" slot-scope="text, record, index">
								<div v-for="item in record.userLimit">{{item}}</div>
								<div>每个员工可保护客户数量{{record.protect_num}}个</div>
							</template>
							<template slot="action" slot-scope="text, record, index">
								<a-button style="margin: 10px 5px 0 0;" @click="editList(record)"
													v-has="'highSeasCustomerRecyclingRules-edit'">编辑
								</a-button>
								<a-popconfirm
										title="确定删除吗?"
										@confirm="delList(record.id)"
										okText="确定"
										cancelText="取消"
								>
									<a-button v-has="'highSeasCustomerRecyclingRules-del'">删除</a-button>
								</a-popconfirm>
							</template>
						</a-table>
						<!--分页 -->
						<div class="pagination"
								style="width: 100%;position: absolute;margin: 20px 0px 80px;"
								v-show="total > 0" v-has="'highSeasCustomerRecyclingRules-list'">
							<div style="height: 32px;float: left;line-height: 32px;">
								共
								<span style="color: blue">{{total}}</span>
								条
							</div>
							<div class="pagination" style="height: 32px;float: right;">
								<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
															:current="page"
															:pageSize="pageSize"
															:pageSizeOptions="['15','30','50','100']"
															@change="changePage"
															@showSizeChange="showSizeChange"/>
							</div>
						</div>
					</div>
				</a-spin>
			</div>
		</a-layout-content>
		<!--客户回收规则弹窗 -->
		<a-modal title="客户回收规则" v-model="addVisible" @ok="handleOk"
		         :confirmLoading="confirmLoading" @cancel="cancel" width="888px">
			<div style="color: red;margin-bottom: 8px;">当客户满足回收条件后，将其自动回收至公海池，交给新员工认领。</div>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }" v-if="corpLen > 1">
				<template slot="label">
					<span style="color: red;">*</span>选择企业微信
				</template>
				<a-select
						v-if="corpLen > 1"
						showSearch
						optionFilterProp="children"
						style="width: 210px;"
						@change="handleChange2"
						v-model="corpId2"
				>
					<template v-for="item in corpInfo">
						<a-select-option :value="item.corpid">{{item.corp_full_name ||
							item.corp_name}}
						</a-select-option>
					</template>
				</a-select>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					<span style="color: red;">*</span>生效成员
				</template>
				<div style="color: red;">针对不同员工配置不同的客户回收规则</div>
				<a-radio-group v-model="effectiveMemberType">
					<a-radio :value="1" :disabled="isAll == 1">通用</a-radio>
					<a-radio :value="2">仅企业成员适用
						<a-button :disabled="effectiveMemberType == 1" style="margin-left: 10px;"
						          @click="showDepartmentList">
							选择
						</a-button>
						<span style="margin-left: 5px"
						      v-show="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
						<a style="margin-left: 10px;" v-show="chooseNum > 0"
						   @click="clearDepartmentList">
							重置
						</a>
						<!--						<a-select-->
						<!--								showSearch optionFilterProp="children"-->
						<!--								mode="multiple"-->
						<!--								v-model="departmentId"-->
						<!--								style="width: 250px;margin-left: 20px;"-->
						<!--								placeholder="选择部门"-->
						<!--								:disabled="effectiveMemberType == 1"-->
						<!--						>-->
						<!--							<a-select-option v-for="(name, departmentId) in partyList"-->
						<!--							                 :key="name.id" :disabled="name.disabled">-->
						<!--								{{name.name}}-->
						<!--							</a-select-option>-->
						<!--						</a-select>-->
						<a-tooltip placement="top">
							<template slot="title">
								企业成员和动态部门必须选择一个。选择部门后，如原来某部门是5人，后新增1人，则对这6位企业成员分别发送提醒。
							</template>
							<span style="margin-left: 10px;">
						<a-icon type="question-circle"></a-icon>
					</span>
						</a-tooltip>
					</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }" v-for="(item,index) in ruleList">
				<template slot="label">
					<span style="color: red;">*</span>规则{{index+1}}
				</template>
				<div>进入
					<a-select style="width: 120px"
					          v-model="item.follow_id">
						<a-select-option v-for="item in follows" :value="item.id">
							{{item.title}}
						</a-select-option>
					</a-select>
					阶段
					<a-input-number
							class="brush-input"
							:min="0" :max="9999"
							:formatter="limitDecimals"
							:parse="limitDecimals"
							v-model="item.day"></a-input-number>
					天未添加跟进记录，自动回收至公海池
				</div>
				<div style="margin: 10px 0;">在回收前
					<a-input-number
							class="brush-input"
							:min="0" :max="9999"
							:formatter="limitDecimals"
							:parse="limitDecimals"
							v-model="item.reclaim_day"></a-input-number>
					天提醒员工
					<a-tooltip placement="top">
						<template slot="title">
							比如进入某阶段，3个自然日未添加记录自动回收至公海池，在回收前1天提醒，那么在1号 10:30客户跟进，在5号00:00自动回收至公海池，4号早上9点发送即将回收通知给该员工。
						</template>
						<span>
						<a-icon type="question-circle"></a-icon>
					</span>
					</a-tooltip>
				</div>
				<div>
					<a-button type="primary" @click="addRule"
					          v-if="index == ruleList.length-1 && ruleList.length < follows.length">添加规则
					</a-button>
					<a-button style="margin-left: 10px;" @click="delRule(index)" v-if="ruleList.length != 1">删除
					</a-button>
				</div>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }" v-if="agentList.length > 1"
			             style="border-bottom: 1px dashed #CCC;padding: 10px 0;">
				<template slot="label">
					<span style="color: red;">*</span>员工提醒应用
				</template>
				<a-select
						showSearch
						optionFilterProp="children"
						style="width: 210px;"
						v-model="agentId" placeholder="请选择应用">
					<template v-for="item in agentList">
						<a-select-option :value="item.id">{{item.name}}
						</a-select-option>
					</template>
				</a-select>
				<a-tooltip placement="top">
					<template slot="title">
						在回收前，发送应用通知提醒员工，该客户即将进入公海池。
					</template>
					<span style="margin-left: 10px;">
						<a-icon type="question-circle"></a-icon>
					</span>
				</a-tooltip>
			</a-form-item>
			<div style="border: 1px dashed #CCC;padding: 10px 0;">
				<a-form-item :label-col="{ span: 4 }"
				             :wrapper-col="{ span: 20 }">
					<template slot="label">
						<span style="color: red;">*</span>非企微客户认领数量
					</template>
					每个员工个人所持有的非企微客户认领上限数量
					<a-input-number
							class="brush-input"
							:min="0" :max="9999"
							:formatter="limitDecimals"
							:parse="limitDecimals"
							v-model="distributionLimit"></a-input-number>
					位
					<div>（在【客户管理】-【非企微客户】列表，员工录入/批量导入客户数量不计入在其中。）</div>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }"
				             :wrapper-col="{ span: 20 }">
					<template slot="label">
						<span style="color: red;">*</span>客户保护
					</template>
					<a-switch v-model="isProtect"/>
					<div v-if="isProtect">允许客户保护数量
						<a-input-number
								class="brush-input"
								:min="0" :max="99999"
								:formatter="limitDecimals"
								:parse="limitDecimals"
								v-model="protectNum"></a-input-number>
						个
					</div>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }"
				             :wrapper-col="{ span: 20 }">
					<template slot="label">
						<span style="color: red;">*</span>允许延期
					</template>
					<a-switch v-model="isDelay"/>
					<div v-if="isDelay">允许员工延期
						<a-input-number
								class="brush-input"
								:min="0" :max="9999"
								:formatter="limitDecimals"
								:parse="limitDecimals"
								v-model="delayDay"></a-input-number>
						天
					</div>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }"
				             :wrapper-col="{ span: 20 }">
					<template slot="label">
						<span style="color: red;">*</span>员工捡回
						<a-tooltip placement="top">
							<template slot="title">
								在某员工手上丢失的客户，回收至公海池，只可在规定的时间后才可重新认领。如设置7天后可重新捡回，1号回收至公海池，8号00：00该员工才能重新认领。
							</template>
							<span>
						<a-icon type="question-circle"></a-icon>
					</span>
						</a-tooltip>
					</template>
					<div>自回收至公海池
						<a-input-number
								class="brush-input"
								:min="0" :max="9999"
								:formatter="limitDecimals"
								:parse="limitDecimals"
								v-model="againDay"></a-input-number>
						天后可重新捡回（在某员工手上丢失的客户，回收至公海池，只可在规定的时间后才可重新认领）
					</div>
				</a-form-item>
			</div>
		</a-modal>

		<!--部门选择框-->
		<chooseDepartment ref="user" :show="showModalDepartment" :id="corpId2"
		                  :chooseNum="chooseNum" :is_from="1" :is_from_edit="1" :from_id="id"
		                  :callback="modalVisibleChange" :disabled_id="disabled_id"></chooseDepartment>
	</div>
</template>

<script>
	import chooseDepartment from "@/components/ChooseDepartment.vue"

	const columns = [
		{
			title      : "生效成员",
			dataIndex  : "nameArr",
			key        : "nameArr",
			scopedSlots: {customRender: "nameArr"}
		},
		{
			title      : "回收规则",
			dataIndex  : "ruleData",
			key        : "ruleData",
			scopedSlots: {customRender: "ruleData"}
		},
		{
			title      : "成员限制",
			dataIndex  : "userLimit",
			key        : "userLimit",
			scopedSlots: {customRender: "userLimit"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		components: {
			chooseDepartment
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				// corpLen            : JSON.parse(localStorage.getItem('corpArr')).length,
				corpLen            : 1,
				corpInfo           : [], //企业微信列表
				corpId             : corpId,//企业微信选中的id
				isLoading          : false,//loading的显示与隐藏
				list               : [],//表格数据
				//表格部分
				columns,
				page               : 1, //页码
				pageSize           : 15, //每页数据量，默认15
				//分页
				total              : 0, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				//客户回收规则弹窗
				addVisible         : false,//弹窗的显示与隐藏
				confirmLoading     : false,//确定按钮loading的显示与隐藏
				corpId2            : corpId,//企业微信选中的id
				agentList          : [],//应用列表
				agentId            : '',//选择的应用id
				effectiveMemberType: 1,//生效成员类型，1通用，2选择
				showModalDepartment: false, //成员选择框显示与隐藏
				checkedList        : [],//选择的成员id数组
				chooseNum          : 0,//已选择的成员数量
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				partyList          : [], // 部门列表
				departmentId       : [],//选择的部门id
				follows            : [],//跟进状态列表
				ruleList           : [
					{
						follow_id  : 0,
						day        : 3,
						reclaim_day: 1
					}
				],//规则列表
				distributionLimit  : 300,//分配客户上限
				isProtect          : false,//是否客户保护
				protectNum         : 99999,//客户保护数量
				isDelay            : false,//是否延期
				delayDay           : 15,//员工延期天数
				againDay           : 7,//重新捡回天数
				id                 : 0,//编辑时id
				isAll              : 0,//有没有设置过全部成员
				disabled_id        : [],//选择成员组件内需要禁选的
			};
		},
		methods   : {
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//切换企业微信
			handleChange (value) {
				this.corpId = value;
				this.getList()
			},
			//获取表格内容
			async getList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post(
					"public-sea-customer/reclaim",
					{
						corp_id : this.corpId,
						page    : page,
						pageSize: pageSize
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
					this.list = res.data.claimData;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.page_size;
					this.isLoading = false;
				}
			},
			changePage (page, page_size) {
				this.getList(page, page_size);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 40)
				})
			},
			showSizeChange (page, pageSize) {
				this.getList(1, pageSize);
			},
			//客户回收规则
			addRules () {
				this.corpId2 = this.corpId
				this.addVisible = true
				this.getFollowStatus()
				this.getAgentList()
				let that = this
				that.editList({
					id: 0
				})
				// Promise.all([that.getPartyList()]).then(res => {
				// 	that.editList({
				// 		id: 0
				// 	})
				// }).catch(e => {
				// })
			},
			async handleOk () {
				if (this.agentId == '') {
					this.$message.warning("请选择员工提醒应用")
					return false
				}
				if (this.effectiveMemberType == 2) {
					this.departmentId = []
					this.checkedList.map(x => {
						if (x.scopedSlots.title == 'title') {
							this.departmentId.push(x.id.replace('d-', ''))
						}
					})
					if (this.departmentId.length == 0 && this.checkedList.length == 0) {
						this.$message.warning("成员或者部门要选择一个")
						return false
					}
				}
				let map = new Map()
				let arr = []
				this.ruleList.forEach(obj => {
					if (map.get(obj.follow_id) !== obj.follow_id) {
						map.set(obj.follow_id, obj.follow_id)
						obj.repeat = false
						arr.unshift(obj)
					} else {
						obj.repeat = true
						arr.unshift(obj)
					}
				})

				for (let k = 0; k < arr.length; k++) {
					if (arr[k].repeat) {
						this.$message.warning("规则中的阶段不可重复")
						return false
					}
				}

				for (let i = 0; i < this.ruleList.length; i++) {
					if (this.ruleList[i].day == null || this.ruleList[i].day == 0) {
						this.$message.warning("请正确填写规则" + (i + 1) + "的时间限制")
						return false
					}
					if (this.ruleList[i].day < this.ruleList[i].reclaim_day) {
						this.$message.warning("规则" + (i + 1) + "的回收提醒天数要小于未跟进记录天数")
						return false
					}
				}
				if (this.distributionLimit == null) {
					this.$message.warning("请设置私有池数量")
					return false
				}
				if (this.isDelay) {
					if (this.delayDay == null) {
						this.$message.warning("请设置员工延期时间")
						return false
					}
				}
				if (this.isProtect) {
					if (this.protectNum == null) {
						this.$message.warning("请设置客户保护数量")
						return false
					}
				}
				if (this.againDay == null) {
					this.$message.warning("请设置员工捡回天数")
					return false
				}
				const {data: res} = await this.axios.post("public-sea-customer/reclaim-set", {
					uid        : localStorage.getItem("uid"),
					corp_id    : this.corpId2,
					agent_id   : this.agentId,
					valid_type : this.effectiveMemberType,
					user_key   : this.checkedList,
					party      : this.departmentId,
					ruleData   : this.ruleList,
					private_num: this.distributionLimit,
					is_protect : this.isProtect,
					protect_num: this.protectNum,
					is_delay   : this.isDelay,
					delay_day  : this.delayDay,
					reclaim_day: this.againDay,
					id         : this.id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.cancel()
					this.getList()
				}
			},
			cancel () {
				this.corpId2 = this.corpId;
				this.effectiveMemberType = 1
				this.checkedList = []
				this.chooseNum = 0
				this.departmentId = []
				this.ruleList = [
					{
						follow_id  : 0,
						day        : 3,
						reclaim_day: 1
					}
				]
				this.distributionLimit = 300
				this.isProtect = false
				this.protectNum = 99999
				this.isDelay = false
				this.delayDay = 15
				this.againDay = 7
				this.addVisible = false
				this.id = 0
			},
			//获取应用列表
			async getAgentList () {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.corpId2,
					suite_id  : 1,
					agent_type: 2
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.agentList = res.data
					if (this.id == 0) {
						if (this.agentList.length > 0) {
							this.agentId = this.agentList[0].id
						} else {
							this.agentId = ''
						}
					}
				}
			},
			//回收规则中的选择企业微信
			handleChange2 (value) {
				this.corpId2 = value;
				this.getAgentList()
				this.departmentId = []
				// this.getPartyList()
			},
			//选择应用
			chooseAgent (e) {
				// this.staffList = []
				// this.chooseNum = 0
				// this.$refs.user.checkedKeys = []
				// this.$refs.user.staffList = []
				// this.$refs.user.keyList = []
				// this.$refs.user.staffListArr = []
				// this.departmentId = []
				this.getPartyList()
			},
			//部门选择弹窗组件
			showDepartmentList () {
				let arr = []
				this.checkedList.map(x => {
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
				this.showModalDepartment = true
			},
			modalVisibleChange (event, arr, userNum, departmentNum, list) {
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
			//重置
			clearDepartmentList () {
				this.checkedList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
			},
			// 获取部门列表
			async getPartyList () {
				const {data: res} = await this.axios.post('work-follow-msg/get-party-list', {
					suite_id: 1,
					corp_id : this.corpId2
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.partyList = res.data.party_list
					this.partyList.map(x => {
						x.disabled = false
					})
				}
			},
			//获取跟进状态
			async getFollowStatus () {
				const {data: res} = await this.axios.post(
					"custom-field/follow",
					{
						uid   : localStorage.getItem("uid"),
						status: 1
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.follows = res.data.follow
					if (this.id == 0) {
						this.ruleList.map((x, index) => {
							x.follow_id = this.follows[index].id
						})
					}
				}
			},
			// 数字输入框限制
			limitDecimals (value) {
				const reg = /[^\d]/g
				if (typeof value == 'string') {
					return !isNaN(Number(value)) ? value.replace(reg, '') : ''
				} else if (typeof value == 'number') {
					return !isNaN(value) ? String(value).replace(reg, '') : ''
				} else {
					return ''
				}
			},
			//添加规则
			addRule () {
				let obj = {
					follow_id  : this.follows[0].id,
					day        : 3,
					reclaim_day: 1
				}
				this.ruleList.push(obj)
			},
			//删除规则
			delRule (index) {
				this.ruleList.splice(index, 1)
			},
			//删除列表
			async delList (id) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("public-sea-customer/reclaim-del", {
					claim_id: id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.getList()
				}
			},
			//编辑
			async editList (record) {
				this.id = record.id
				const {data: res} = await this.axios.post("public-sea-customer/reclaim-info", {
					corp_id : this.corpId,
					claim_id: record.id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (record.id != 0) {
						//编辑时
						this.$refs.user.getDepartmentList()
						this.addVisible = true
						this.agentId = String(res.data.agent_id)
						this.getAgentList()
						// this.getPartyList()
						this.effectiveMemberType = res.data.valid_type
						if (this.effectiveMemberType == 2) {
							this.chooseNum = res.data.user_key.length
							this.checkedList = res.data.user_key
							this.chooseUserNum = 0
							this.chooseDepartmentNum = 0
							this.checkedList.map(x => {
								if (x.scopedSlots.title == 'custom') {
									this.chooseUserNum++
								} else if (x.scopedSlots.title == 'title') {
									this.chooseDepartmentNum++
								}
							})
							this.departmentId = res.data.party
						}
						this.ruleList = res.data.reclaim_rule
						this.distributionLimit = res.data.private_num
						if (res.data.is_protect == 0) {
							this.isProtect = false
						} else {
							this.isProtect = true
							this.protectNum = res.data.protect_num
						}
						if (res.data.is_delay == 0) {
							this.isDelay = false
						} else {
							this.isDelay = true
							this.delayDay = res.data.delay_day
						}
						this.againDay = res.data.reclaim_day
					}
					this.partyList.map(k => {
						k.disabled = false
					})
					res.data.notParty.map(x => {
						this.partyList.map(y => {
							if (x == y.id) {
								y.disabled = true
							}
						})
					})
					// this.disabled_id = res.data.notParty
					this.isAll = res.data.isAll
					if (this.isAll == 1) {
						this.effectiveMemberType = 2
					}
				}
			}
		},

		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				// this.corpId = this.corpInfo[0].corpid
				//TODO 获取teams
				// this.$emit('changeTeamId', this.teamId)
				this.$emit('changeCorpId', this.corpId)
				this.getList();
				this.getFollowStatus()
				this.getPartyList()
			});
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		margin: 0 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	a:link {
		text-decoration: none;
	}

	a:visited {
		text-decoration: none;
	}

	a:hover {
		text-decoration: none;
	}

	a:active {
		text-decoration: none;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}
	#components-layout-demo-basic .kehuconent {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		line-height: 50px;
		height: 100%;
		margin: 20px 20px;
	}
	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		text-align: left;
		margin: 12px 20px 20px;
	}
</style>