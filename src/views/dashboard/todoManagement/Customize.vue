<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 80px;">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">待办设置</label>

			</a-card>
			<div style="padding: 0 20px;">
				<span @click="changeCurrent(0)" v-has="'todoManagementCustomizeNew-list'" class="tabBtn" :class="{activeBtn:current == 0}">自定义项目处理阶段</span>
				<span @click="changeCurrent(1)" v-has="'todoLevel-list'" class="tabBtn" :class="{activeBtn:current == 1}">自定义优先级</span>
			</div>
			<a-card style="margin:0 20px 0px 20px;padding:10px 20px 0px 20px;">
<!--				<label class="right" v-if="init==1">-->
<!--					<a-button v-show="stateAll==false" type="primary" @click="editAll">批量编辑</a-button>-->
<!--					<a-button v-show="stateAll==true" @click="notEditAll">取消</a-button>-->
<!--				</label>-->
				<!--   步骤条 	-->
				<div>
<!--					<a-steps :current="current" style="padding: 0 30px;cursor: pointer;">-->
<!--						<a-step @click="changeCurrent(index)" v-for="(item, index) in steps"-->
<!--						        :title="item.title"/>-->
<!--					</a-steps>-->
					<!--自定义项目执行阶段表格-->
					<div v-show="current==0" class="steps-content">
						<div style="background: #FFF;padding: 0 0 20px 0;">
							<!--							<a-row style="margin-top: 10px; margin-left: 4.16%;">-->
							<a-row style="margin-top: 10px;">
								<template v-for="(item,index) in executionStatusList">
									<a-col :span="2"
									       :style="{float : (index % 16 > 7 ? 'right' : 'left' ), marginRight : (index % 16 == 8 ? '4.17%' : '' )}">
										<a-button :style="{color:item.color}" class="btn-tag">{{item.title}}
										</a-button>
									</a-col>
									<a-col :span="1" v-if="index % 8 != 7 && index != executionStatusList.length - 1"
									       style="padding: 2px 0;text-align: center;"
									       :style="{float : (index % 16 > 7 ? 'right' : 'left' )}">
										<div v-if="index % 16 > 7"
										     class="arrow-left"></div>
										<div class="line"></div>
										<div v-if="index % 16 < 7"
										     class="arrow-right"></div>
									</a-col>
									<a-col :span="23" v-if="index % 16 == 7 && index != executionStatusList.length - 1"
									       style="margin-top: 10px;">
										<div class="line-right"></div>
									</a-col>
									<a-col :span="23" v-if="index % 16 == 7 && index != executionStatusList.length - 1"
									       style="margin-bottom: 5px;">
										<div class="arrow-bottom arrow-bottom-right"></div>
									</a-col>
									<a-col :span="23" v-if="index % 16 == 15 && index != executionStatusList.length - 1"
									       style="margin-top: 10px;">
										<div class="line-left"></div>
									</a-col>
									<a-col :span="23" v-if="index % 16 == 15 && index != executionStatusList.length - 1"
									       style="margin-bottom: 5px;">
										<div class="arrow-bottom arrow-bottom-left"></div>
									</a-col>
								</template>
							</a-row>
							<div style="height: 40px; line-height: 40px;margin: 20px 0 10px 0;">
								<span style="color: #FF562D;margin-left: 20px;">鼠标移动面板更改阶段排序，但第一个和最后一个的阶段顺序不可移动，亦不能删除。</span>
								<a-button type="primary"@click="addFollow" v-has="'todoManagementCustomizeNew-add'"
								          style="margin-right: 20px;vertical-align: middle;float: right;">新增处理阶段
								</a-button>
							</div>
							<a-spin tip="加载中..." size="large" :spinning="isLoading1">
								<!--								<a-table class="follow-table" :columns="columns" :dataSource="executionStatusList"-->
								<!--								         :pagination="false"-->
								<!--								         :rowClassName="rowClassName"-->
								<!--								         :rowSelection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange,type:'radio'}"-->
								<!--								>	-->
								<a-table class="follow-table" :columns="columns" :dataSource="executionStatusList"
								         :pagination="false"
								         :rowClassName="rowClassName"
								>
								<span slot="sort" slot-scope="text,record, index">
										{{ index + 1 }}
									</span>

									<span slot="desc" slot-scope="text,record,index">
										<span v-show="stateAll==false">
											<span v-if="record.desc != ''">{{ record.desc }}</span>
											<span v-if="record.desc == ''">--</span>
										</span>

								<span v-show="stateAll==true"><a-textarea allow-clear
								                                          @change="editChange1(index, text)"
								                                          :maxLength="50" v-model="text"
								                                          placeholder="请输入状态描述，50个字以内">
<!--										<span slot="suffix">-->
									<!--						                    <span>{{executionStatusList[index].desc.length}}</span>/50-->
									<!--										</span>-->
									</a-textarea></span>
									</span>

									<span slot="title1" slot-scope="text,record,index" :style="{color:record.color}">
										<span v-show="stateAll==false">{{record.title}}</span>
										<span v-show="stateAll==true">
											<a-input
													class="editInput"
													style="width: 220px"
													@change="editChange2(index, record.title)"
													:maxLength="8" v-model="record.title" placeholder="请输入状态，8个字以内">
												<span slot="suffix" :style="{color:record.color}">
								                    <span>{{(executionStatusList[index].title || '').length}}</span>/8
												</span>
											</a-input>
											<a-popover
													trigger="click"
													placement="right"
											>
												<color-picker slot="content" v-model="record.color"></color-picker>
												<div style="display: inline-block;" class="color-box">
															<span class="color-show"
															      :style="{'background-color': fcRemark3(record,index)}"></span>
												</div>
											</a-popover>
										</span>
					                </span>

									<span slot="action"
									      slot-scope="text, record, index">
										<a-button v-if="!stateAll" style="margin: 0 5px;"
										          v-has="'todoManagementCustomizeNew-edit'"
										          @click="editOldFollow(index)">
											编辑
										</a-button>
										<a-button v-if="index != 0 && index != executionStatusList.length - 1"
										          v-has="'todoManagementCustomizeNew-delete'"
										          @click="delFollow(record.sort, record.title)">
											删除
										</a-button>
							        </span>
								</a-table>
							</a-spin>
						</div>
						<!--自定义项目执行阶段增加/修改弹框-->
						<a-modal :visible="followVisible" :title="addOrEditTitle" @cancel="handleCancelFollow"
						         width="720px">
							<template slot="footer">
								<a-button @click="handleCancelFollow">取消</a-button>
								<a-button :loading="isLoading1" type="primary" @click="handleFollow">确定</a-button>
							</template>
							<a-form-model ref="ruleFormOne" :rules="rulesOne">
								<a-form-model-item :label-col="{ span: 3 }"
								                   :wrapper-col="{ span: 21 }">
									<template slot="label"><span
											style="color: red">*</span>处理阶段
									</template>
									<a-input :maxLength="8" v-model="title"
									         placeholder="请输入处理阶段，8个字以内">
						<span slot="suffix">
		                    <span>{{title.length}}</span>/8
						</span>
									</a-input>
								</a-form-model-item>
								<a-form-model-item :label-col="{ span: 3 }"
								                   :wrapper-col="{ span: 21 }">
									<template slot="label">
										阶段描述
									</template>
									<a-textarea allow-clear style="margin-top: 12px;"
									            :maxLength="50" v-model="desc"
									            placeholder="请输入阶段描述，50个字以内">
									</a-textarea>
									<div style="text-align: right;">{{desc.length}} / 50</div>
									<!--									<a-input :maxLength="50" v-model="desc" placeholder="请输入状态描述，50个字以内">-->
									<!--						<span slot="suffix">-->
									<!--		                    <span>{{desc.length}}</span>/50-->
									<!--						</span>-->
									<!--									</a-input>-->
								</a-form-model-item>
								<a-form-item :label-col="{ span: 3 }"
								             :wrapper-col="{ span: 21 }">
									<template slot="label">
										选择颜色
									</template>
									<div>
										<template>
											<a-popover
													trigger="click"
													placement="right"
											>
												<color-picker slot="content" v-model="color"></color-picker>
												<div style="display: inline-block;" class="color-box">
															<span class="color-show"
															      :style="{'background-color': fcRemark()}"></span>
												</div>
											</a-popover>
										</template>
									</div>
								</a-form-item>
							</a-form-model>
						</a-modal>
					</div>

					<!--自定义项目优先级表格-->
					<div v-show="current==1" class="steps-content">
						<div style="background: #FFF;padding: 0 0 20px 0;">
							<div style="height: 40px; line-height: 40px;margin: 20px 0 10px 0;">
								<span style="color: #FF562D;margin-left: 20px;">鼠标移动面板更改优先级排序</span>
								<div style="display:inline-block;float:right;">
									<a-button type="primary"@click="addPriority" v-has="'todoLevel-add'"
									          style="margin-right: 20px;vertical-align: middle;">新增优先级
									</a-button>
								</div>
							</div>
							<!--							<a-spin tip="加载中..." size="large" :spinning="isLoading1">-->
							<!--							<a-table class="follow-table2" :columns="columns2" :dataSource="priorityList"-->
							<!--							         :pagination="false"-->
							<!--							         :rowClassName="rowClassName"-->
							<!--							         :rowSelection="{selectedRowKeys: prioritySelectedRowKeys,onChange: onSelectChange2,type:'radio'}"-->
							<!--							>-->
							<a-table class="follow-table2" :columns="columns2" :dataSource="priorityList"
							         :pagination="false"
							         :rowClassName="rowClassName"
							>
								<span slot="sort" slot-scope="text,record,index">
										 {{ index + 1 }}
									</span>

								<span slot="title2" slot-scope="text,record,index" :style="{color:record.color}">
										<span v-show="stateAll==false" style="padding: 2px 7px;border-radius: 4px;" :style="{border: '1px solid ' + record.color}">{{ record.title }}</span>
										<span v-show="stateAll==true">
											<a-input
													class="editInput2"
													style="width: 220px"
													@change="editChange3(index, record.title)"
													:maxLength="8" v-model="record.title" placeholder="请输入状态，8个字以内">
										<span slot="suffix" :style="{color:record.color}">
						                    <span>{{(priorityList[index].title || '').length}}</span>/8
										</span>
									</a-input>
										<a-popover
												trigger="click"
												placement="right"
										>
												<color-picker slot="content" v-model="record.color"></color-picker>
												<div style="display: inline-block;" class="color-box">
															<span class="color-show"
															      :style="{'background-color': fcRemark4(record,index)}"></span>
												</div>
											</a-popover>
										</span>
									</span>

								<span slot="desc" slot-scope="text,record,index">
										<span v-show="stateAll==false">
											<span v-if="record.desc != ''">{{ record.desc }}</span>
											<span v-if="record.desc == ''">--</span>
										</span>
										<span v-show="stateAll==true"><a-textarea allow-clear
										                                          @change="editChange4(index, text)"
										                                          :maxLength="50" v-model="text"
										                                          placeholder="请输入优先级描述，50个字以内">
<!--										<span slot="suffix">-->
											<!--						                    <span>{{executionStatusList[index].desc.length}}</span>/50-->
											<!--										</span>-->
									</a-textarea></span>
					                </span>

								<span slot="action" slot-scope="text, record,index">
									<a-button
											style="margin: 0 5px;"
											v-show="!stateAll"
											v-has="'todoLevel-edit'"
											@click="editPriority(index)">
										编辑
									</a-button>
									<a-button v-if="index != 0" v-has="'todoLevel-delete'" @click="delPriority(record.sort, record.title)">
										删除
									</a-button>
							    </span>
							</a-table>
							<!--												</a-spin>&ndash;&gt;-->
						</div>
						<!--自定义项目优先级阶段增加/修改弹框-->
						<a-modal :visible="priorityVisible" :title="priorityAddOrEditTitle"
						         @cancel="handleCancelPriority"
						         width="720px">
							<template slot="footer">
								<a-button @click="handleCancelPriority">取消</a-button>
								<a-button :loading="isLoading1" type="primary" @click="handlePriority">确定</a-button>
							</template>
							<a-form-model ref="ruleFormTwo" :rules="rulesTwo">
								<a-form-model-item :label-col="{ span: 4 }"
								                   :wrapper-col="{ span: 20 }">
									<template slot="label"><span
											style="color: red">*</span>优先级名称
									</template>
									<a-input :maxLength="8" v-model="priorityTitle"
									         placeholder="请输入优先级名称，8个字以内">
						<span slot="suffix">
		                    <span>{{priorityTitle.length}}</span>/8
						</span>
									</a-input>
								</a-form-model-item>
								<a-form-model-item :label-col="{ span: 4 }"
								                   :wrapper-col="{ span: 20 }">
									<template slot="label">
										优先级描述
									</template>
									<a-textarea allow-clear style="margin-top: 12px;"
									            :maxLength="50" v-model="priorityDesc"
									            placeholder="请输入优先级描述，50个字以内">
									</a-textarea>
									<div style="text-align: right;">{{priorityDesc.length}} / 50</div>
									<!--									<a-input :maxLength="50" v-model="priorityDesc" placeholder="请输入优先级描述，50个字以内">-->
									<!--						<span slot="suffix">-->
									<!--		                    <span>{{priorityDesc.length}}</span>/50-->
									<!--						</span>-->
									<!--									</a-input>-->
								</a-form-model-item>
								<a-form-item :label-col="{ span: 4 }"
								             :wrapper-col="{ span: 20 }">
									<template slot="label">
										选择颜色
									</template>
									<div>
										<template>
											<a-popover
													trigger="click"
													placement="right"
											>
												<color-picker slot="content" v-model="priorityColor"></color-picker>
												<div style="display: inline-block;" class="color-box">
															<span class="color-show"
															      :style="{'background-color': fcRemark2()}"></span>
												</div>
											</a-popover>
										</template>
									</div>
								</a-form-item>
							</a-form-model>
						</a-modal>
					</div>


					<div class="steps-action" v-show="stateAll==true">
						<div style="display: inline-block; margin-left: -200px;">
							<a-button v-if="current>0" @click="prev">
								上一步
							</a-button>
							<a-button v-if="current < steps.length - 1" style="margin-left: 8px"
							          type="primary"
							          @click="next">
								下一步
							</a-button>
							<a-button style="margin-left: 8px"
							          :loading="isLoadingb"
							          v-if="current == steps.length - 1"
							          type="primary"
							          @click="createActivity"
							>
								提交
							</a-button>
						</div>
					</div>
				</div>
			</a-card>

		</div>
	</div>
</template>

<script>

	import {Sketch} from "vue-color";
	import chooseStaffSelect from "@/components/ChooseStaffSelect";
	import WeChatModal from "@/components/WeChatModal.vue"

	const columns = [
		{
			title      : '排序',
			dataIndex  : "sort",
			width      : "10%",
			key        : "sort",
			scopedSlots: {customRender: 'sort'},
		},
		{
			title      : '项目处理阶段',
			dataIndex  : 'title1',
			width      : '30%',
			key        : "title1",
			scopedSlots: {customRender: 'title1'},
		},
		{
			title      : '阶段描述',
			dataIndex  : "desc",
			width      : "40%",
			key        : "desc",
			scopedSlots: {customRender: 'desc'},
		},
		{
			dataIndex  : "action",
			title      : '操作',
			key        : 'action',
			width      : "20%",
			scopedSlots: {customRender: 'action'},
		},
	];
	const columns2 = [
		{
			title      : '排序',
			dataIndex  : "sort",
			width      : "10%",
			key        : "sort",
			scopedSlots: {customRender: 'sort'},
		}, {
			title      : '优先级名称',
			dataIndex  : "title2",
			width      : "30%",
			key        : "title",
			scopedSlots: {customRender: 'title2'},
		},
		{
			title      : '优先级描述',
			dataIndex  : 'desc',
			width      : '40%',
			key        : 'desc',
			scopedSlots: {customRender: 'desc'},
		},

		{
			dataIndex  : "action",
			title      : '操作',
			key        : 'action',
			width      : "20%",
			scopedSlots: {customRender: 'action'},
		},
	];

	export default {
		name      : 'todoManagementCustomize',
		components: {
			"color-picker": Sketch,
			chooseStaffSelect,
			WeChatModal,
			VNodes        : {
				functional: true,
				render    : (h, ctx) => ctx.props.vnodes,
			},
		},
		data () {
			// let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId              : localStorage.getItem("corpId"),   //企业微信选中的id
				// isShow:0,
				stateAll            : false,
				// openValue:1, // 选择开启时间
				// 选择企业微信
				showState           : false,
				showModal2          : false,// 企业微信选择弹窗
				corpName            : localStorage.getItem("corpName"),
				init                : null,
				// 客户阶段关联待办项目
				obj4                : [],
				isLoadingb          : false,
				editIndex           : null, // 编辑时获得当前行的下标
				showName            : null, // 表格内添加或编辑的时候显示的阶段名称
				isAddOrEdit         : null, // 判断是添加还是编辑
				isIndex             : null,
				projectName         : '',// 阶段名称
				nums                : null,// 完成多少项
				way                 : [],// 进入下阶段条件选二时选中的选项数组
				follow_id           : '请选择跟进状态',//展示的跟进状态
				follows             : [],
				followTitle         : '',
				switchState         : 0, // 是否改变跟进状态
				value2              : [],
				value3              : [],
				// userInfo:[],
				delIndex            : false, // 删除按钮的显示null隐藏
				userIndex           : null,
				sortSum             : 1,
				// openDay             : null, // 输入的开启时间
				openDate            : 1, // 自定义开启时间选项值
				need                : 1,
				value               : 1,
				radioStyle          : {
					display     : 'block',
					height      : '30px',
					lineHeight  : '40px',
					marginBottom: '10px'
				},
				customVisible       : false, // 控制添加项目弹框的显示隐藏
				customAddOrEditTitle: '', // 添加or修改弹窗文字提示
				content             : [
					{
						task_id   : 0,
						title     : '请选择项目名称', //项目不能重复
						project_id: 0,  //初始化传0 后面传对应的
						userInfo  : '', // 项目处理人
						descTitle : [],// 项目提醒
						type      : 1, //1手动开启 2 自动开启 3 N天后开启
						days      : '', //选N天填写 必须大于0
						date      : null,
					}
				], // 选择的待办项目对象
				customList          : [],

				// 自定义待办项目
				// 自定义项目提醒
				tableList            : [],
				page1                : 1,// 成员列表页码
				count1               : 0,
				isLoading5           : false,
				openIndex            : null,
				openStyle            : null,
				obj3                 : [],
				suite_id             : 1,//应用ID
				appList              : [], // 应用列表
				appId                : '',   // 企业微信应用id
				projectRemind        : [
					{
						type: '1',
						days: ''
					}
				],
				userList             : [], // 所有成员列表
				startId3             : null,
				endId3               : null,
				projectUserId        : '请选择企业成员', // 项目处理人id
				projectUserName      : null, // 项目处理人name
				// projectDay2          : 0, // 截止之前提醒
				// projectDay1          : 0,// 完成前几天提醒
				projectDay           : '', // 项目完成时间
				projectLevelTitle    : '选择优先级', // 项目优先级
				index                : 0,
				isLoading3           : false,
				projectColor         : '#000',
				projectTitle         : '', // 添加项目名称
				projectDesc          : '', // 添加项目描述
				projectVisible       : false, // 控制自定义项目执行阶段弹框的显示隐藏
				projectAddOrEditTitle: '', // 添加or修改弹窗文字提示
				// projectSelectedRowKeys: ['1'], // 单选框选中数据
				projectList          : [],

				// 自定义项目优先级数据
				obj2                  : [],
				user                  : '', // 项目完成人
				remind                : '', // 项目提醒
				startId2              : null,
				endId2                : null,
				priorityColor         : '#000',
				isLoading             : false,
				priorityTitle         : '', // 添加阶段名称
				priorityDesc          : '', // 添加阶段描述
				priorityVisible       : false, // 控制自定义项目执行阶段弹框的显示隐藏
				priorityAddOrEditTitle: '', // 添加or修改弹窗文字提示
				// prioritySelectedRowKeys: [0], // 单选框选中数据
				priorityList          : [],

				// 自定义项目执行阶段数据
				obj1               : [],
				startId            : null,
				endId              : null,
				color              : '#000',
				isLoading1         : false,
				followVisible      : false, // 控制自定义项目执行阶段弹框的显示隐藏
				addOrEditTitle     : '', // 添加or修改弹窗文字提示
				editId             : '',
				title              : '', // 添加阶段名称
				desc               : '', // 添加阶段描述
				// selectedRowKeys    : [0], // 单选框选中数据
				// 列表数据
				executionStatusList: [],
				// 步骤条设置
				current            : 0, // 步骤index
				todoManagementCustomize : true,
				todoLevel          : true,
				steps              : [  // 步骤名
					{
						title: '自定义项目处理阶段',
					},
					{
						title: '自定义优先级',
					}
				],
				createLoading      : false, // 活动创建按钮loading
				// 表格部分
				columns,
				columns2,
				page               : 1, // 页码
				// pages:1,
				pageSize           : 15, // 每页数据量，默认15
				// 分页
				total              : 0, // 总条数
				quickJumper        : false, // 是否显示快速跳转的控件

				rules      : {
					name: [
						{required: true, message: '项目名称不能为空', trigger: 'blur'}
					],
					desc: [
						{required: true, message: '项目描述不能为空', trigger: 'blur'}
					],
				}, rulesOne: {
					stepName: [
						{required: true, message: '项目名称不能为空', trigger: 'blur'}
					],
					stepDesc: [
						{required: true, message: '项目描述不能为空', trigger: 'blur'}
					],
				}, rulesTwo: {
					name: [
						{required: true, message: '项目名称不能为空', trigger: 'blur'}
					],
					desc: [
						{required: true, message: '项目描述不能为空', trigger: 'blur'}
					],
				},

			};
		},
		mounted () {
			let that = this
			if (localStorage.getItem('isMasterAccount') == 2) {
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				let that = this
				if (permissionButton.indexOf('todoManagementCustomizeNew-list') != -1) {
					that.current = 0
				} else {
					that.current = 1
				}
				if (permissionButton.indexOf('todoManagementCustomizeNew-remove') != -1) {
					that.todoManagementCustomize = true
				} else {
					that.todoManagementCustomize = false
				}
				if (permissionButton.indexOf('todoLevel-remove') != -1) {
					that.todoLevel = true
				} else {
					that.todoLevel = false
				}
				that.$forceUpdate()
			} else {
				that.current = 0
			}
			this.getDefaultData()
		},
		watch     : {
			current: function () {
				if (this.current == 0) {
					this.setDragTable()
				} else if (this.current == 1) {
					this.setDragTable2()
				}
			},
			init   : function () {
				if (this.init == 0) {
					this.stateAll = true
				}
			},
		},
		methods   : {
			// 批量编辑优先级
			editChange3 (index, text) {
				this.priorityList[index].title = text
			},
			editChange4 (index, text) {
				this.priorityList[index].desc = text
			},
			// 批量编辑自定义状态
			editChange2 (index, text) {
				this.executionStatusList[index].title = text
			},
			editChange1 (index, text) {

				this.executionStatusList[index].desc = text
			},
			// 批量编辑
			editAll () {
				this.obj1 = JSON.parse(JSON.stringify(this.executionStatusList))
				this.obj2 = JSON.parse(JSON.stringify(this.priorityList))
				this.obj3 = JSON.parse(JSON.stringify(this.projectList))
				this.obj4 = JSON.parse(JSON.stringify(this.customList))

				this.stateAll = true
			},
			// 确认批量编辑
			// showEditAll () {
			// 	// this.priorityList=this.obj2
			// 	this.stateAll = false
			// },
			// 取消批量编辑
			notEditAll () {
				this.executionStatusList = JSON.parse(JSON.stringify(this.obj1))
				this.priorityList = JSON.parse(JSON.stringify(this.obj2))
				this.projectList = JSON.parse(JSON.stringify(this.obj3))
				this.customList = JSON.parse(JSON.stringify(this.obj4))
				this.$message.warning("已取消编辑")
				this.stateAll = false
			},

			// 获取默认数据
			async getDefaultData () {
				this.isLoading1 = true
				const {data: res} = await this.axios.post('wait-project/common-detail', {
					uid: localStorage.getItem('uid')
				})
				if (res.error != 0) {
					this.isLoading1 = false
					this.$message.error(res.error_msg);
				} else {
					this.init = res.data.init
					if (this.init == 0) {
						this.stateAll = true
					}
					this.executionStatusList = res.data.project_status
					this.priorityList = res.data.project_level
					if (this.current == 0) {
						this.setDragTable()
					} else if (this.current == 1) {
						this.setDragTable2()
					}
					this.isLoading1 = false
				}
			},
			setDragTable () {
				if(this.todoManagementCustomize) {
					let that = this
					this.$nextTick(function () {
						let trs = document.getElementsByClassName('follow-table')[0].getElementsByTagName('tr')
						for (let i = 2; i < trs.length - 1; i++) {
							trs[i].setAttribute('draggable', true)
							trs[i].setAttribute('data-id', i - 1)
							trs[i].addEventListener('dragstart', that.dragStart)
							trs[i].addEventListener('drop', that.drop)
							trs[i].addEventListener('dragover', that.dragOver)
						}
					})
				}
			},
			setDragTable2 () {
				if(this.todoLevel) {
					let that = this
					this.$nextTick(function () {
						let trs2 = document.getElementsByClassName('follow-table2')[0].getElementsByTagName('tr')
						for (let i = 1; i < trs2.length; i++) {
							trs2[i].setAttribute('draggable', true)
							trs2[i].setAttribute('data-id2', i - 1)
							trs2[i].addEventListener('dragstart', that.dragStart)
							trs2[i].addEventListener('drop', that.drop)
							trs2[i].addEventListener('dragover', that.dragOver)
						}
					})
				}
			},

			changeOpenDate1 (item) {
				item.days = null
			},

			// 拖动改变表格排序
			dragOver (ev) {
				ev.preventDefault();
			},
			dragStart (e) {
				if (this.current == 0) {
					this.startId = parseInt(e.currentTarget.attributes['data-id'].value)
				} else if (this.current == 1) {
					this.startId2 = parseInt(e.currentTarget.attributes['data-id2'].value)
				}

			},
			drop (e) {
				let startIndex
				let endIndex
				if (this.current == 0) {
					this.endId = parseInt(e.currentTarget.attributes['data-id'].value)
					startIndex = this.startId
					endIndex = this.endId
					if (endIndex < startIndex) {
						let startFollow = JSON.parse(JSON.stringify(this.executionStatusList[startIndex]))
						for (let i = startIndex; i > endIndex; i--) {
							this.executionStatusList[i] = JSON.parse(JSON.stringify(this.executionStatusList[i - 1]))
						}
						this.executionStatusList[endIndex] = JSON.parse(JSON.stringify(startFollow))
					} else {
						let startFollow = JSON.parse(JSON.stringify(this.executionStatusList[startIndex]))
						for (let i = startIndex; i < endIndex; i++) {
							this.executionStatusList[i] = JSON.parse(JSON.stringify(this.executionStatusList[i + 1]))
						}
						this.executionStatusList[endIndex] = JSON.parse(JSON.stringify(startFollow))
					}
					if (!this.stateAll) {
						this.sortFollowList()
					} else {
						this.executionStatusList = JSON.parse(JSON.stringify(this.executionStatusList))
						this.setDragTable()
					}
				} else if (this.current == 1) {
					this.endId2 = parseInt(e.currentTarget.attributes['data-id2'].value)
					startIndex = this.startId2
					endIndex = this.endId2
					if (endIndex < startIndex) {
						let startFollow = JSON.parse(JSON.stringify(this.priorityList[startIndex]))
						for (let i = startIndex; i > endIndex; i--) {
							this.priorityList[i] = JSON.parse(JSON.stringify(this.priorityList[i - 1]))
						}
						this.priorityList[endIndex] = JSON.parse(JSON.stringify(startFollow))
					} else {
						let startFollow = JSON.parse(JSON.stringify(this.priorityList[startIndex]))
						for (let i = startIndex; i < endIndex; i++) {
							this.priorityList[i] = JSON.parse(JSON.stringify(this.priorityList[i + 1]))
						}
						this.priorityList[endIndex] = JSON.parse(JSON.stringify(startFollow))
					}
					if (!this.stateAll) {
						this.sortPriorityList()
					} else {
						this.priorityList = JSON.parse(JSON.stringify(this.priorityList))
						this.setDragTable2()
					}
				}
			},
			async sortFollowList () {
				let ids = []
				for (let i = 0; i < this.executionStatusList.length; i++) {
					ids.push(this.executionStatusList[i].id)
				}
				const {data: res} = await this.axios.post('wait-project/wait-status-sort', {
					uid: localStorage.getItem('uid'),
					ids: ids,
				})
				if (res.error != 0) {
					this.isLoadingb = false
					this.$message.error(res.error_msg)
					this.getDefaultData()
				} else {
					this.getDefaultData()
				}
			},
			async sortPriorityList () {
				let ids = []
				for (let i = 0; i < this.priorityList.length; i++) {
					ids.push(this.priorityList[i].id)
				}
				const {data: res} = await this.axios.post('wait-project/wait-level-sort', {
					uid: localStorage.getItem('uid'),
					ids: ids,
				})
				if (res.error != 0) {
					this.isLoadingb = false
					this.$message.error(res.error_msg)
					this.getDefaultData()
				} else {
					this.getDefaultData()
				}
			},
			//自定义项目优先级
			//自定义优先级弹窗
			addPriority () {
				this.editId = ''
				this.priorityTitle = ''
				this.priorityDesc = ''
				this.priorityColor = '#000'
				this.priorityAddOrEditTitle = '新增优先级'
				this.priorityVisible = true
			},
			editPriority (index) {
				this.editId = this.priorityList[index].id
				this.priorityTitle = this.priorityList[index].title
				this.priorityDesc = this.priorityList[index].desc
				this.priorityColor = this.priorityList[index].color
				this.priorityAddOrEditTitle = '编辑优先级'
				this.priorityVisible = true
			},
			//弹框取消
			handleCancelPriority () {
				this.priorityVisible = false
				this.editId = ''
				this.priorityTitle = ''
				this.priorityDesc = ''
				this.priorityColor = '#000'
			},

			//弹框确认
			handlePriority () {
				if (this.priorityTitle == '') {
					this.$message.destroy()
					this.$message.warning("优先级名称不能为空")
					return false
				}

				let status = false
				this.priorityList.filter(item => {
					if (this.editId != item.id || this.editId == '') {
						if (item.title == this.priorityTitle) {
							status = true
							this.$message.destroy()
							this.$message.warning("优先级名称已存在")
							return false
						}
					}
				})
				if (status == true) {
					return false
				}
				if (this.stateAll) {
					let sort = this.executionStatusList[this.executionStatusList.length - 1].sort + 1
					for (let i = 0; ; i++) {
						if (this.executionStatusList.findIndex(e => e.sort == sort) != -1) {
							sort++
						} else {
							break
						}
					}
					let b = {
						id   : 0,
						sort : sort,
						title: this.priorityTitle,
						desc : this.priorityDesc,
						color: this.priorityColor,
						key  : sort
					}
					this.priorityList.push(b)
					this.setDragTable2()
					this.priorityVisible = false
				} else {
					this.addNewPriority()
				}
			},
			async addNewPriority () {
				let sort = ''
				if (this.editId == '') {
					sort = this.priorityList[this.priorityList.length - 1].sort + 1
					for (let i = 0; ; i++) {
						if (this.priorityList.findIndex(e => e.sort == sort) != -1) {
							sort++
						} else {
							break
						}
					}
				} else {
					sort = this.priorityList.find(e => e.id == this.editId).sort
				}
				const {data: res} = await this.axios.post('wait-project/add-wait-level', {
					uid  : localStorage.getItem('uid'),
					id   : this.editId,
					title: this.priorityTitle,
					color: this.priorityColor,
					desc : this.priorityDesc,
					sort : sort,
					key  : sort
				})
				if (res.error != 0) {
					this.isLoadingb = false
					this.$message.error(res.error_msg)
				} else {
					this.getDefaultData()
					this.priorityVisible = false
				}
			},
			//删除优先级
			delPriority (index, title) {
				let that = this
				this.$confirm({
					title     : '一旦删除后，处于【' + title + '】的项目自动回到排序为1的优先级。确定删除吗？',
					// content: '确认后所有任务将被清空',
					okText    : '是',
					okType    : 'danger',
					cancelText: '否',
					onOk () {
						that.deletePriority(index)
					},
					onCancel () {

					},
				});
			},
			async deletePriority (index) {
				let that = this
				let priority = that.priorityList.findIndex(e => e.sort == index)
				if (that.priorityList[priority].id != 0) {
					const {data: res} = await this.axios.post('wait-project/del-wait-level', {
						id: that.priorityList[priority].id,
					})
					if (res.error != 0) {
						this.isLoadingb = false
						this.$message.error(res.error_msg)
					} else {
						if (that.stateAll) {
							if (that.priorityList.length > 1) {
								that.priorityList = that.priorityList.filter(item => {
									if (item.sort != index) {
										return item
									}
								})
								for (let i = 0; i < this.priorityList.length; i++) {
									this.priorityList[i].sort = i + 1
								}
							} else {
								that.$message.warning('当前已是最后一个，不可删除')
							}
						} else {
							that.getDefaultData()
						}
					}
				} else {
					if (that.priorityList.length > 1) {
						that.priorityList = that.priorityList.filter(item => {
							if (item.sort != index) {
								return item
							}
						})
						for (let i = 0; i < this.priorityList.length; i++) {
							this.priorityList[i].sort = i + 1
						}
					} else {
						that.$message.warning('当前已是最后一个，不可删除')
					}
				}
			},
			//自定义优先级颜色
			fcRemark2 () {
				if (typeof this.priorityColor.hex != "undefined") {
					this.priorityColor = this.priorityColor.hex
				}
				return this.priorityColor;
			},


			// 关闭项目阶段添加/修改的弹窗
			handleCancelFollow () {
				this.followVisible = false
				this.title = ''
				this.desc = ''
				this.color = '#000'
			},

			// 样式
			fcRemark () {
				if (typeof this.color.hex != "undefined") {
					this.color = this.color.hex
				}
				return this.color;
			},	// 样式
			fcRemark3 (item, index) {
				// if (typeof item.color.hex != "undefined") {
				this.executionStatusList.find(k => {
					if (k.sort == item.sort) {
						k.color = typeof item.color.hex == "undefined" ? item.color : item.color.hex
					}
				})
				// this.color = this.color.hex
				// }
				if (this.stateAll) {
					this.$nextTick(() => {
						document.getElementsByClassName('editInput')[index].getElementsByClassName('ant-input')[0].style.color = this.executionStatusList[index].color
					})
				}
				return this.executionStatusList[index].color;
			},
			fcRemark4 (item, index) {
				// if (typeof item.color.hex != "undefined") {
				this.priorityList.find(k => {
					if (k.sort == item.sort) {
						k.color = typeof item.color.hex == "undefined" ? item.color : item.color.hex
					}
				})
				// this.color = this.color.hex
				// }
				if (this.stateAll) {
					this.$nextTick(() => {
						document.getElementsByClassName('editInput2')[index].getElementsByClassName('ant-input')[0].style.color = this.priorityList[index].color
					})
				}
				return this.priorityList[index].color;
			},

			// 确认项目阶段添加/修改
			handleFollow () {
				if (this.title.trim() == '') {
					this.$message.destroy()
					this.$message.warning("处理阶段不能为空")
					return false
				}

				let status = false
				this.executionStatusList.filter(item => {
					if (this.editId != item.id || this.editId == '') {
						if (item.title == this.title) {
							status = true
							this.$message.destroy()
							this.$message.warning("处理阶段已存在")
							return false
						}
					}
				})
				if (status == true) {
					return false
				}
				if(this.editId) {
					this.addNewFollow()
				} else {
					if (this.stateAll) {
						let sort = this.executionStatusList[this.executionStatusList.length - 1].sort + 1
						for (let i = 0; ; i++) {
							if (this.executionStatusList.findIndex(e => e.sort == sort) != -1) {
								sort++
							} else {
								break
							}
						}
						let obj = {
							id   : 0,
							sort : this.executionStatusList[this.executionStatusList.length - 1].sort,
							title: this.title,
							desc : this.desc,
							color: this.color,
							key  : this.executionStatusList[this.executionStatusList.length - 1].sort,
						}
						let lastExecute = JSON.parse(JSON.stringify(this.executionStatusList[this.executionStatusList.length - 1]))
						lastExecute.sort = sort
						lastExecute.key = sort
						this.executionStatusList.splice(this.executionStatusList.length - 1, 1, obj)
						this.executionStatusList.push(lastExecute)
						this.setDragTable()
						this.followVisible = false
					} else {
						this.addNewFollow()
					}
				}
			},
			async addNewFollow () {
				let sort = ''
				if (this.editId == '') {
					sort = this.executionStatusList[this.executionStatusList.length - 1].sort + 1
					for (let i = 0; ; i++) {
						if (this.executionStatusList.findIndex(e => e.sort == sort) != -1) {
							sort++
						} else {
							break
						}
					}
				} else {
					sort = this.executionStatusList.find(e => e.id == this.editId).sort
				}

				const {data: res} = await this.axios.post('wait-project/add-wait-status', {
					uid  : localStorage.getItem('uid'),
					id   : this.editId,
					sort : sort,
					title: this.title,
					desc : this.desc,
					color: this.color,
					key  : sort
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.getDefaultData()
					this.followVisible = false
				}
			},
			//下拉框滚动事件
			popScroll (e) {
				let target = e.target
				if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
					//到底了，加载下一页
					if (this.userList.length < this.count1) {
						this.page1++
						this.getAllStaffList(this.page1)
					}
				}

			},

			// 添加项目执行阶段
			addFollow () {
				this.editId = ''
				this.addOrEditTitle = '添加处理阶段'
				this.title = ''
				this.desc = ''
				this.color = '#000'
				this.followVisible = true
			},
			editOldFollow (index) {
				this.editId = this.executionStatusList[index].id
				this.addOrEditTitle = '编辑处理阶段'
				this.title = this.executionStatusList[index].title
				this.desc = this.executionStatusList[index].desc
				this.color = this.executionStatusList[index].color
				this.followVisible = true
			},
			// 删除项目执行阶段
			delFollow (index, title) {
				let that = this
				this.$confirm({
					title     : '一旦删除后，停留在【' + title + '】的客户自动回到排序为1的阶段。确定删除吗?',
					// content: '确认后所有任务将被清空',
					okText    : '是',
					okType    : 'danger',
					cancelText: '否',
					onOk () {
						that.deleteFollow(index)
					},
					onCancel () {
						// console.log('Cancel');
					},
				});
			},
			async deleteFollow (index) {
				let that = this
				let excute = that.executionStatusList.find(e => e.sort == index)
				if (excute.id != 0) {
					const {data: res} = await this.axios.post('wait-project/del-wait-status', {
						id: excute.id,
					})
					if (res.error != 0) {
						this.isLoadingb = false
						this.$message.error(res.error_msg)
					} else {
						if (that.stateAll) {
							that.executionStatusList = that.executionStatusList.filter(item => {
								if (item.sort != index) {
									return item
								}
							})
							for (let i = 0; i < this.executionStatusList.length; i++) {
								this.executionStatusList[i].sort = i + 1
							}
						} else {
							that.getDefaultData()
						}
					}
				} else {
					that.executionStatusList = that.executionStatusList.filter(item => {
						if (item.sort != index) {
							return item
						}
					})
					for (let i = 0; i < this.executionStatusList.length; i++) {
						this.executionStatusList[i].sort = i + 1
					}
				}
			},
			// 编辑项目执行阶段
			editFollow (obj) {
				this.title = obj.tag_ids
				this.desc = obj.add_num
				this.color = obj.color
				this.addOrEditTitle = '编辑处理阶段'
				this.followVisible = true
			},

			// 确认项目提交方法
			async createActivity () {
				this.isLoadingb = true
				for (let i = 0; i < this.executionStatusList.length; i++) {
					this.executionStatusList[i].sort = i + 1
				}
				for (let i = 0; i < this.priorityList.length; i++) {
					this.priorityList[i].sort = i + 1
				}
				const {data: res} = await this.axios.post('wait-project/set', {
					uid           : localStorage.getItem("uid"),
					project_status: this.executionStatusList,
					project_level : this.priorityList,
				})
				if (res.error != 0) {
					this.isLoadingb = false
					this.$message.error(res.error_msg)
				} else {
					this.isLoadingb = false
					this.current = 0
					this.stateAll = false
					this.getDefaultData()
				}
			},

			// 步骤条上下步方法
			changeCurrent (index) {
				this.current = index
			},

			next () {
				if (this.current == 0) {
					let list = this.executionStatusList
					let arr = list.map(item => item.title);
					let new_arr = Array.from(new Set(arr));
					if (new_arr.length < arr.length) {
						this.$message.destroy()
						this.$message.warning("处理阶段已存在")
						return false
					}

				} else if (this.current == 1) {
					let list2 = this.priorityList
					let arr2 = list2.map(item => item.title);
					let new_arr2 = Array.from(new Set(arr2));
					if (new_arr2.length < arr2.length) {
						this.$message.destroy()
						this.$message.warning("优先级名称已存在")
						return false
					}
				}
				this.current++;
			},

			prev () {
				this.current--;
			},

			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},

		},

		created () {
			// this.getAccount();
		}
	};
</script>

<style lang='less' scoped>
	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.right {
		float: right;
		font-size: 16px;
		vertical-align: top;
		margin: 10px 0;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		margin: 20px 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.steps-content {
		/*margin-top: 20px;*/
		border-radius: 6px;
		height: calc(100% - 52px);
		padding: 0 30px;
		overflow-y: auto;
	}

	.steps-action {
		position: fixed;
		bottom: 0px;
		z-index: 999;
		height: 60px;
		line-height: 60px;
		width: 100%;
		transform: translateX(-40px);
		text-align: center;
		border-top: 1px solid #F1F1F1;
		background-color: #F0F2F5;
	}


	.arrow-left {
		vertical-align: middle;
		display: inline-block;
		width: 0;
		height: 0;
		border: 5px solid;
		border-color: transparent #01b065 transparent transparent;
	}

	.arrow-right {
		vertical-align: middle;
		display: inline-block;
		width: 0;
		height: 0;
		border: 5px solid;
		border-color: transparent transparent transparent #01b065;
	}

	.line {
		display: inline-block;
		height: 0;
		width: calc(100% - 10px);
		border-top: 2px solid #01b065;
		vertical-align: middle;
	}

	.line-right {
		height: 20px;
		width: 0;
		border-right: 2px solid #01b065;
		margin-right: 4.17%;
		float: right;
	}

	.line-left {
		height: 20px;
		width: 0;
		border-right: 2px solid #01b065;
		margin-left: 4.17%;
		float: left;
	}

	.arrow-bottom {
		display: inline-block;
		color: #C3C3C3;
		-moz-transform: rotate(90deg);
		-webkit-transform: rotate(90deg);
		-o-transform: rotate(90deg);
		transform: rotate(90deg);
		width: 0;
		height: 0;
		border: 5px solid;
		border-color: transparent transparent transparent #01b065;
	}

	.arrow-bottom-right {
		line-height: 10px;
		float: right;
		margin-right: calc(4.17% - 4px);
	}

	.arrow-bottom-left {
		line-height: 9px;
		float: left;
		margin-left: calc(4.17% - 4px);
	}

	.color-show {
		width: 20px;
		height: 20px;
		display: inline-block;
		margin: 0 10px;
		vertical-align: sub;
		border: 1px solid #BFBFBF;
	}

	.btn-tag {
		border: 1px solid #01b065;
		color: #01b065;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.active {
		margin-bottom: 20px;
	}

	.ant-checkbox-wrapper + .ant-checkbox-wrapper {
		margin-left: 0;
	}

	/deep/ .ant-select-selection--multiple {
		margin-bottom: 10px;
	}

	/deep/ .ant-input-number-handler-down {
		display: none;
	}

	/deep/ .ant-input-number-handler-up {
		display: none;
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
		color: #01b065;
		background: #FFF;
	}
</style>