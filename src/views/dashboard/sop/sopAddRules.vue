<template>
	<a-spin tip="Loading..." size="large" :spinning="isLoading" class='h-full'>
		<div class="ss-scroll-list w-full">
			<div class="flex items-center justify-between bg-white px-30 py-11 relative b-line text-16">
				<div class='flex items-center'>
					<div class="text-gray-900 text-16">{{sop_id?'编辑SOP规则' : '添加SOP规则'}}</div>
				</div>
				<a-button type="primary" icon="rollback" @click="goBack(0)">返回列表</a-button>
			</div>

			<div class="mx-20 p-30 bg-white mt-20">
				<div class="text-16 font-bold pb-20 relative b-line mb-20  text-gray-900">规则基本信息</div>

				<div class="flex items-center py-15">
					<div class="pr-20 w-150 text-right"><span class="text-red-501 text-12">*</span>规则名称:</div>
					<a-input class="w-300" placeholder='请输入规则名称' v-model="detailData.title" :maxLength='20'></a-input>
					<div class='text-gray-501 pl-5'>{{detailData.title.length}}/20</div>
				</div>

				<div v-if="!detailData.is_chat">
					<div class="flex items-center py-15">
						<div class="pr-20 w-150 text-right"><span class="text-red-501 text-12">*</span>选择执行人:</div>
						<div>
							<a-button @click="showDepartmentList">
								<span v-if="chooseUserNum +  chooseDepartmentNum> 0">已选择{{chooseUserNum}}名成员{{chooseDepartmentNum}}个部门 </span>
								<span v-else>选择部门成员</span>
							</a-button>
						</div>
					</div>
					<div v-if="detailData.type == 2">
						<div class="flex items-center py-15">
							<div class="pr-20 w-150 text-right"><span class="text-red-501 text-12">*</span>跟进状态:</div>

							<a-select
									class='w-200'
									showSearch
									allowClearf
									placeholder="请选择跟进状态"
									optionFilterProp="children"
									v-model="detailData.follow_id"
							>
								<template v-for="(item,index) in follows">
									<a-select-option :value="item.id">
										{{item.title}}
									</a-select-option>
								</template>
							</a-select>

						</div>

						<!--暂时不上-->
						<!--<div class="flex items-center py-15">
							<div class="pr-20 w-150 text-right"><span class="text-red-501 text-12">*</span>目标客户:</div>
							<div class="flex items-center">
								<a-radio-group name="radioGroup" :value="detailData.is_all" @change="isAllChange">
									<a-radio :value="1">
										全部客户
									</a-radio>
									<a-radio :value="0">
										按条件筛选客户
									</a-radio>
								</a-radio-group>
							</div>
						</div>-->

						<div v-if="detailData.is_all == 0">
							<div class="ml-150">
								<div class="py-10 flex items-center flex-wrap">
									<div class="text-14 text-blue-501 mr-20 cursor-pointer"
									     @click="isShowConditionPop = true, isGet = true">
										选择已有标签
									</div>
									<div v-if="tags.length>0">
										<div class="text-12 text-gray-501 mr-10">最近使用</div>
										<div class="flex flex-wrap items-center">
											<div class="text-gray-501 bg-gray-201 br1000 px-20 py-5 mr-10 my-5"
											     v-for='(item, index) in tags' :key='index'>
												{{item.tagname}}
											</div>
										</div>
									</div>

									<a-button @click="isShowConditionPop = true , isGet = false">添加标签</a-button>
								</div>
							</div>

							<div class="ml-150 flex items-center" v-if="detailData.task_id>0">
								<div class="text-white bg-blue-501 br1000 px-20 py-5 mr-10 my-5">
									{{detailData.task_name}}
								</div>
								<div class="pl-5">符合条件约 <span class="text-red-501 font-bold">{{member_num}}</span> 人
								</div>
							</div>
						</div>


					</div>
				</div>

				<div class="flex items-center py-15" v-if="!!detailData.is_chat">
					<div class="pr-20 w-150 text-right"><span class="text-red-501 text-12">*</span>选择客户群:</div>
					<div>
						<a-button @click="showChatVisible">
							<span v-if="detailData.user_ids.length > 0">已选择{{detailData.user_ids.length}}个群</span>
							<span v-else>选择群聊</span>
						</a-button>
					</div>
				</div>

				<!--占时不上-->
				<!--<div class="flex items-center py-15">
					<div class="pr-20 w-150 text-right"><span class="text-red-501 text-12">*</span>不推送时间:</div>
					<div class="flex items-center h-30">
						<div>
							<a-switch :checked="detailData.no_send_type == 1" @change="changeType"></a-switch>
						</div>
						<div class="flex items-center" v-if="detailData.no_send_type == 1">
							<div class="px-10">
								<a-time-picker @change="onChangeTimePickerS" :default-value="moment(detailData.no_send_stime, 'HH:mm')" format="HH:mm" />
							</div>
							<div class='text-14 text-gray-900'>至</div>
							<div class="px-10">
								<a-time-picker @change="onChangeTimePickerE" :default-value="moment(detailData.no_send_etime, 'HH:mm')" format="HH:mm" />
							</div>
							<div class='text-14 text-gray-900'>期间不推送</div>
						</div>
					</div>
				</div>-->

			</div>

			<div class="mx-20 p-30 bg-white mb-20  ">
				<div class="text-16 font-bold pb-20 relative b-line mb-20 text-gray-900">设置推送周期及内容</div>
				<div class='flex items-center'>
					<div class="text-gray-900 text-14" v-if="!detailData.is_chat">设置规则后，将会通过应用通知去提醒所选部门成员发送内容</div>
					<div class="text-gray-900 text-14" v-else>设置规则内容后，将会通过应用通知去提醒所选群聊群主发送内容</div>
					<!-- <div class='text-14 text-gray-501 pl-10'><a target='_blank'
					                                            :href="detailData.is_chat==1?'https://support.qq.com/products/104790/faqs/89642':'https://support.qq.com/products/104790/faqs/89640'">如何发送</a>
					</div> -->
				</div>

				<div class="mt-30  flex ss-rules-l">
					<div class='ss-rules-l flex flex-col items-center mr-15'
					     v-if='!$test.empty(this.detailData.timeData)'>
						<img src="../../../assets/rules-point.png" class="mt-10" alt="">
						<div class=' ss-rules-l-b h-40'></div>
					</div>
					<a-button class='ss-add-btn' @click='openShowAddRulesPop'>+添加内容规则</a-button>
				</div>
				<div>
					<rulesList :is_chat="detailData.is_chat" :follow_name='detailData.follow_name'
					           :type='detailData.type' :rulesData="detailData.timeData"
					           @updateTimeData='updateTimeData'></rulesList>
					<a-empty v-show="detailData.timeData.length == 0" class='py-60'>
						<span slot="description" class="text-gray-501">请添加规则</span>
					</a-empty>
				</div>
				<div class="sticky bottom-0 z-100 bg-white py-20 t-line">
					<a-button class="" type="primary" @click='confirmAddSop'>提交</a-button>
				</div>
			</div>

			<addRulesPop :is_chat="detailData.is_chat" :type='detailData.type' :follow_name='detailData.follow_name'
			             ref='addRulesPop'
			             :rulesAdd="{ time_type: detailData.is_chat==1?1:2,time_one: '1',time_two:detailData.is_chat==1?'0':'00:00',contentData: [{}]}"
			             :callback="addRulesPopCallback" v-if='isShowAddRulesPop'></addRulesPop>


			<!--选择标签-->
			<conditionPop
					@delTagHandle='delTagHandle'
					:isGet='isGet'
					:task_id='detailData.task_id'
					:callback="conditionPopCallback"
					v-if="isShowConditionPop"
			></conditionPop>

			<!--部门选择框-->
			<chooseDepartment
					ref="user"
					:show="showModalDepartment"
					:callback="modalVisibleChange"
					:is_special="1"
					:is-sop="1"
					:is_external='1'
					:sop-arr='sop_has_user'
			></chooseDepartment>

			<!--选择群聊弹窗-->
			<groupChat
					:show="chatVisible"
					:chatArr="detailData.user_ids"
					:chatArrt="chatArr2"
					:isSop='1'
					:is_list='1'
					:isShowGroupOwner="1"
					:callback="groupChatCallBack"
			>
			</groupChat>


		</div>
	</a-spin>
</template>

<script>
	import moment from 'moment';
	import addRulesPop from './comps/addRulesPop'
	import conditionPop from './comps/conditionPop'
	import rulesList from './comps/rulesList'
	import ChooseDepartment from '../../../components/ChooseDepartment'
	import groupChat from "../../../components/GroupChat.vue"

	import _ from 'lodash'

	export default {
		name      : "customSopAddRules",
		components: {addRulesPop, rulesList, ChooseDepartment, conditionPop, groupChat},
		data () {
			return {
				sop_id             : 0, // 编辑需要的id
				showModalDepartment: false, // 是否选择部门弹框
				corp_id            : localStorage.getItem('corpId') || "", // 企业微信id
				uid                : localStorage.getItem('uid'),  // 用户ID
				sub_id             : localStorage.getItem('sub_id') || 0, // 子账户ID
				isMasterAccount    : localStorage.getItem('isMasterAccount'), // 1主账户2子账户
				isShowAddRulesPop  : false, // 是否打开规则弹框
				detailData         : { // 规则详细名
					type         : 1,   // SOP类型：1新客培育、2客户生命周期
					title        : '',  // 规则名称
					user_ids     : [], // 规则成员集合（is_chat=0）/群id集合（is_chat=1）
					is_chat      : 0, // 是否是群聊
					chat_data    : [], // 是群聊的数据
					// follow_id: '',  // 跟进状态id
					follow_name  : '',// 状态名称
					is_all       : 1, // 是否全部客户1是0否
					task_name    : '', // 抓取文章的
					task_id      : 0, // 任务标签id
					no_send_type : 0,  // 不推送时间段1开启0关闭
					no_send_stime: '00:00', // 不推送时间段开始时间
					no_send_etime: '07:00', // 不推送时间段结束时间
					timeData     : [], // 规则时间及内容数据  timeData.time_type（必选）： 时间一，  timeData.time_one（可选）：时间二， timeData.time_two（可选）：时间二，  timeData.contentData：内容数据
					hasSopUser   : [], // 已有sop规则的人员
				},

				rulesAdd           : { // 添加默认的数据
					time_type  : 2,
					time_one   : 0,
					time_two   : 0,
					contentData: [{}]
				},
				follows            : [], // 跟进列表
				isShowConditionPop : false, // 是否显示选择标签弹框
				isGet              : false, // 是否获取标签
				chooseTag          : {}, // 选中的某个
				tags               : [],// 最近使用的标签
				userList           : [], // 选中的人
				chooseUserNum      : 0,//已选择的成员个数
				chooseDepartmentNum: 0, // 已选择的部门成员总个数
				member_num         : 0, // 标签客户数
				chatVisible        : false,
				isLoading          : false, // 是否在加载中
				sop_has_user       : [], // 有规则sop的人
				chatArr2           : [], // 为了配合群聊的
			}
		},

		beforeRouteEnter (to, from, next) {
			next(vm => {
				if (/chatSop/.test(to.path)) { // 点击了自由容器
					vm.detailData.is_chat = 1
				}
			})
		},

		watch: {
			'detailData.type'     : {
				handler (v) {
					v == 1 && this.getFollowStatus(), this.taskTags();  // 获取更加状态
				},
				immediate: true
			},
			'detailData.task_id'  : {
				handler (v) {
					if (v && this.detailData.type == 2) {
						this._taskTagMemberNum(v)
					}
				},
				immediate: true
			},
			'detailData.follow_id': {
				handler (v) {
					for (var i = 0; i < this.follows.length; i++) {
						if (this.follows[i].id == v && !this.sop_id) {
							this.detailData.follow_name = this.follows[i].title
							break
						}
					}
				},
				immediate: true
			}
		},

		created () {
			this.sop_id = this.$route.query.sop_id || 0
			this.detailData.type = this.$route.query.type || 0 // SOP类型：1新客培育、2客户生命周期
			this.sop_id && this._sopDetail()
			this.sopHasUser() // 获取有规则的sop人
		},
		methods: {
			moment,
			async _sopDetail () { // 初始化数据
				return new Promise(async (resolve, reject) => {
					this.isLoading = true
					var params = {
						corp_id: this.corp_id,
						sop_id : this.sop_id,
					}
					const {data: res} = await this.axios.post("work-sop/sop-detail", params);
					this.isLoading = false
					if (res.error == 0) {
						this.detailData = res.data.sopInfo
						this.userList = res.data.sopInfo.user_names
						if (this.detailData.is_chat == 1) { //  为了解决一个选中的问题
							this.chatArr2 = res.data.sopInfo.user_ids
						}
						this.detailData.is_chat == 0 && (this.userList.map((item) => {
							if (item.scopedSlots.title == 'title') {
								this.chooseDepartmentNum++
							} else if (item.scopedSlots.title == 'custom') {
								this.chooseUserNum++
							}
						}))
					} else {
						this.$message.error(res.error_msg);
					}
				})
			},

			sopHasUser () {
				return new Promise(async (resolve, reject) => {
					var params = {
						corp_id: this.corp_id,
						type   : this.detailData.type
					}
					const {data: res} = await this.axios.post("work-sop/sop-has-user", params);
					if (res.error == 0) {
						this.sop_has_user = res.data.hasSopUser
					} else {
						this.$message.error(res.error_msg);
					}
				})
			},

			async _taskTagMemberNum (task_id) { // 标签客户数
				return new Promise(async (resolve, reject) => {
					var params = {
						corp_id: this.corp_id,
						task_id
					}
					const {data: res} = await this.axios.post("work-sop/task-tag-member-num", params);
					if (res.error == 0) {
						this.member_num = res.data.member_num
					} else {
						this.$message.error(res.error_msg);
					}
				})
			},


			taskTags () { // 获取最近使用的标签
				return new Promise(async (resolve, reject) => {
					var params = {
						corp_id: this.corp_id,
						task_id: null,
						type   : 2, // 0 都显示 1 仅任务标签数据， 2仅最近使用
					}

					const {data: res} = await this.axios.post("work-task/task-tags", params);
					if (res.error == 0) {
						this.tags = res.data.taskTags
						resolve()
					} else {
						this.$message.error(res.error_msg);
					}
				})
			},

			async getFollowStatus () { // 获取跟进状态
				const {data: res} = await this.axios.post("custom-field/follow", {
						uid   : localStorage.getItem("uid"),
						status: 1
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.follows = res.data.follow
				}
			},

			delTagHandle (e) {
				if (this.detailData.task_id = e) {
					this.detailData.task_id = 0
					this.detailData.task_name = ''
				}
			},

			isAllChange (e) {
				this.detailData.is_all = e.target.value
			},

			openShowAddRulesPop () {
				this.isShowAddRulesPop = true
				this.$nextTick(() => {
					this.$refs.addRulesPop.visible = true
				})
			},

			//部门选择弹窗组件
			showDepartmentList () { // 打开选择部门成员的弹框
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.detailData.user_ids))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.userList))
				this.showModalDepartment = true
			},

			modalVisibleChange (event, arr, userNum, departmentNum, list) { // 选择部门成员的回调
				if (event == "ok") {
					if (arr.length > 0) {
						this.detailData.user_ids = JSON.parse(JSON.stringify(arr))
						this.userList = JSON.parse(JSON.stringify(list))
						this.chooseUserNum = userNum
						this.chooseDepartmentNum = departmentNum
					} else {
						this.detailData.user_ids = []
						this.userList = []
						this.chooseUserNum = 0
						this.chooseDepartmentNum = 0
					}
				}
				this.showModalDepartment = false
			},
			changeType (e) { // 推送时间的状态
				if (e) {
					this.detailData.no_send_type = 1
					this.detailData.no_send_stime = '00:00'
					this.detailData.no_send_etime = '07:00'
				} else {
					this.detailData.no_send_type = 0
				}
			},

			updateTimeData (e, index) {
				var timeData = _.cloneDeep(this.detailData.timeData)
				timeData[index] = e
				this.detailData.timeData = timeData
			},

			onChangeTimePickerS (e1, e2,) { // 时间选择
				this.detailData.no_send_stime = e2 + ''
			},

			onChangeTimePickerE (e1, e2,) { // 时间选择
				this.detailData.no_send_etime = e2 + ''
			},

			addRulesPopCallback (event, e) { // 选择规则的回调
				event == 'ok' && (this.detailData.timeData = [...this.detailData.timeData, _.cloneDeep(e)])
				this.isShowAddRulesPop = false
			},

			confirmAddSop () {
				if (this.$test.empty(this.detailData.title)) {
					return this.$message.warning('请输入规则名称')
				} else if (this.$test.empty(this.detailData.user_ids)) {
					return this.$message.warning(this.detailData.is_chat == 1 ? '请选择群聊' : '请选择执行人')
				} else if (this.detailData.type == 2 && this.$test.empty(this.detailData.follow_id)) {
					return this.$message.warning('请选择一个跟进状态')
				} else if (this.detailData.type == 2 && this.detailData.is_all == 0 && this.$test.empty(this.detailData.task_id)) {
					return this.$message.warning('请选择一个标签')
				} else if (this.detailData.no_send_type == 1 && this.detailData.no_send_stime.split(':').join('') > this.detailData.no_send_etime.split(':').join('')) {
					return this.$message.warning('推送开始时间不能大于结束时间')
				} else if (this.$test.empty(this.detailData.timeData)) {
					return this.$message.warning('请设置一个规则')
				} else {
					this.addSop()
				}
			},
			addSop () { // 添加一个规则
				return new Promise(async (resolve, reject) => {
					var detailData = _.pick(this.detailData, ['type', 'title', 'user_ids', 'is_chat', 'follow_id', 'is_all', 'task_id', 'task_name', 'no_send_type', 'no_send_stime', 'no_send_etime', 'timeData']);
					var params = {
						corp_id        : this.corp_id,
						isMasterAccount: this.isMasterAccount,
						uid            : this.uid,
						sub_id         : this.sub_id,
						...detailData
					}
					this.sop_id && (params = {...params, sop_id: this.sop_id})

					const {data: res} = await this.axios.post("work-sop/add-sop", params);
					if (res.error == 0) {
						this.$message.success(this.sop_id ? '修改完成' : '添加成功')
						this.goBack()
					} else {
						this.$message.error(res.error_msg);
					}
				})
			},

			conditionPopCallback (e, data) {
				if (e == 'ok') {
					data && (this.detailData.task_name = data.tagname, this.detailData.task_id = data.id)
					console.log(data)
				}
				this.isShowConditionPop = false
			},

			//选择群聊
			showChatVisible () {
				this.chatVisible = true
			},

			// 群聊回调
			groupChatCallBack (event, num, arr) {
				if (event == "ok") {
					this.detailData.user_ids = arr
				}
				this.chatVisible = false
			},

			goBack (t = 1500) {
				setTimeout(() => {
					this.$router.go(-1)
				}, t)
			}
		}
	}
</script>

<style scoped>
	.ss-rules-l-b {
		width: 1px;
		background: url("../../../assets/rules-l-bg.png") repeat-y
	}

	.ss-scroll-list {
		height: 100%;
		overflow: auto;
		position: absolute;
		width: 100%
	}

	>>> .ant-layout-header {
		background: #FFF
	}

	>>> .ant-spin-container {
		height: 100%
	}

	.ss-add-btn {
		border-color: #1890FF;
		color: #1890FF
	}

	.z-100 {
		z-index: 100
	}
</style>
