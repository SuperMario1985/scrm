<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<div style="height: 100%;">
				<div style="padding: 0 20px;background: #FFF;height: 45px;line-height: 45px;font-size: 16px">
					待办提醒
				</div>
				<div style="margin: 0 0 20px;padding: 12px 20px;">
					<div class="content-msg">
						<p style="margin-bottom: 0px;">
							使用场景：指定成员在企业微信端接收员工待办项目完成情况的通知，在一定程度上起到监督作用。<span style="color: #ff562D;">在设置前，需要先有自建应用，只有在该自建应用下的可见成员才具备接收应用消息通知的能力。</span>
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
							         v-model="name" @keydown.enter="find"></a-input>
							<a-button type="primary" style="margin: 0px 5px;" @click="find">查询</a-button>
							<a-button @click="clear">重置</a-button>
						</a-col>
						<a-col style="float:right;" v-has="'todoManagementRemind-add'">
							<a-button class="btn-primary" icon="plus"
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
							         :rowClassName="rowClassName" v-has="'todoManagementRemind-list'">
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
									<div style="max-width: 380px;word-wrap:break-word;display: inline-block;line-height: 32px;">
										<a-popover placement="top">
													<span slot="content">
														{{record.name}}<span v-if="record.department_name">-</span>{{record.department_name}}
													</span>
											<p style="cursor: pointer; display: inline-block; margin-left: 10px;max-width: 250px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-bottom: 0px;">
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
				                    <span v-if="record.type != 1" color="orange"
				                          style="margin-bottom: 5px;cursor: pointer;">
										<template v-if="record.user_names.length>5">
											<a-popover trigger="hover">
												<span slot="content"
												      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;max-height: 300px;overflow-y: auto;">
													<a-tag style="margin: 5px;"
													       v-for="(item,index) in record.user_names" color="orange">
														{{item}}
													</a-tag>
												</span>
												<a-tag v-for="(item,index) in record.user_names" color="orange"
												       v-if="index < 5" style="cursor: pointer;">
													{{item}}
												</a-tag>
												<span v-if="record.user_names" style="cursor: pointer;">等共计{{record.user_names.length}}位成员</span>
											</a-popover>
										</template>
										<template v-else>
											<a-tag v-for="(item,index) in record.user_names" color="orange">
												{{item}}
											</a-tag>
										</template>
				                    </span>
								</span>
								<span slot="open_status" slot-scope="text, record, index">
										<span v-if="record.open_status == 1">已开启</span>
										<span v-if="record.open_status == 0">已关闭</span>
									</span>
								<span slot="action" slot-scope="text, record, index">
										<a-button @click="edit(record.id)"
										          style="margin: 0 5px 5px 0"
										          v-has="'todoManagementRemind-edit'">编辑</a-button>
										<a-button v-if="record.open_status == 1"
										          @click="changeSatus(record.id, 0,record.agent, index)"
										          style="margin: 0 5px 5px 0"
										          v-has="'todoManagementRemind-open'">关闭</a-button>
										<a-button v-if="record.open_status == 0"
										          @click="changeSatus(record.id, 1,record.agent, index)"
										          style="margin: 0 5px 5px 0"
										          v-has="'todoManagementRemind-open'">开启</a-button>
									</span>
							</a-table>

							<!-- 分页 -->
							<div class="pagination" style="margin: 20px 15px;overflow: hidden;"
							     v-show="total > 0" v-has="'todoManagementRemind-list'">
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
									<a-button class="btn-primary" icon="edit"
									          :disabled="selectedRowKeys.length == 0"
									          @click="batchEdit" type="primary" v-has="'todoManagementRemind-edit'">
										批量编辑
									</a-button>
									<a-button class="btn-primary" icon="unlock"
									          :disabled="selectedRowKeys.length == 0"
									          @click="releaseFollow" type="primary" v-has="'todoManagementRemind-open'">
										批量开启
									</a-button>
									<a-button class="btn-primary" icon="lock"
									          :disabled="selectedRowKeys.length == 0"
									          @click="failure" type="primary" v-has="'todoManagementRemind-open'">
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
							<!--					<div class="content-msg" style="font-size: 13px;">-->
							<!--						<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">-->
							<!--							开启通知后，选择的【接收通知管理员】将会在企业微信中收到提醒通知-->
							<!--						</p>-->
							<!--					</div>-->
							<a-form-item label="选择应用" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
								<a-select v-if="agentList.length > 0"
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
<!--								<div class="content-msg" style="font-size: 13px;">-->
<!--									<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">-->
<!--										开启通知后，选择的【接收通知管理员】将会在企业微信中收到提醒通知-->
<!--									</p>-->
<!--								</div>-->
								<a-button v-if="is_edit == 0" @click="showDepartmentList"
								          style="width: 170px;margin-right: 5px;">
									<span v-if="chooseNum > 0">已选择{{chooseNum}}名成员</span>
									<span v-else>选择企业成员</span>
								</a-button>
								<template  v-if="is_edit == 0 && chooseUserNum > 0">已选择{{chooseUserNum}}名成员</template>
								<span style="font-weight: 700; font-size: 20px;" v-if="is_edit != 0 && userNum > 0">已选择
									<span style="font-weight: 700; font-size: 20px;color: #F56C6C">{{userNum}}</span>
									名员工
								</span>
								<span style="color:#FF562D;">(推送给指定成员查看待办项目完成的情况)</span>
							</a-form-item>
							<a-form-item label="待办进度数据" :label-col="{ span: 3 }"
							             :wrapper-col="{ span: 21 }">
								<p style="margin-bottom: 5px;color: #FF562D;">查看员工服务待办进度完成情况</p>
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
<!--												已选择{{userNum1}}名成员，{{departmentNum1}}个部门-->
											</a-checkbox>
										</div>
									</a-checkbox-group>
								</div>
							</a-form-item>
							<a-form-item label="通知频率" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
								<a-checkbox-group :value="frequency">
									<a-checkbox value="1"
									            style="margin: 5px 10px 5px 0;height: 33px; line-height: 33px;"
									            @click="changeFrequency('1')">
										每天分时段通知
									</a-checkbox>
									<br/>
									<div v-show="frequency.includes('1')==true">
										<div>当天推送时间： <span
												style="margin-bottom: 5px;color: #FF562D;">推送截至到当前所设置时间</span>
										</div>
										<span v-for="(item,index) in time" style="margin-right: 7px;display: inline-block; margin-bottom: 10px;">
											<span>时间点{{index+1}}：</span>
											<!--									               :minuteStep="60"-->
											<a-time-picker :allowClear="false"
											               style="width: 120px;"
											               :minuteStep="60"
											               v-model="time2[index]"
											               @change="e => changeSpecialStartTime(e, index, timeIndex)"
											               :defaultOpenValue="moment('00:00', 'HH:mm')"
											               format="HH:mm">
											</a-time-picker>
											<a-icon v-if="time2.length > 1" style="color: #F56C6C;margin: 0 5px" type="delete"
											        @click="deleteSpecialDate(index)"/>
										</span>
										<div v-if="time2.length < 24">
											<a-button type="primary"
											          style="height: 26px;width: 94px;padding: 0px 5px;margin-right: 10px; font-size: 12px;"
											          icon="plus"
											          @click="addSpecialDate()">
												添加时间点
											</a-button>
										</div>
									</div>

									<a-checkbox value="2" @click="changeFrequency('2')"
									            style="margin: 5px 0px;height: 33px; line-height: 33px;">
										每天早上9点推送昨日汇总
									</a-checkbox>
									<br/>
									<a-checkbox value="3" @click="changeFrequency('3')"
									            style="margin: 5px 0px;height: 33px; line-height: 33px;">
										当月第一天9点推送上月汇总
									</a-checkbox>
								</a-checkbox-group>
							</a-form-item>
						</a-form>
					</a-modal>
					<!--选择自建应用成员-->
					<chooseDepartment :key="1" :id="corpId" :agentid="typeof agentId1 == 'object' ? '' : agentId1"
					                  ref="user"
					                  :show="showModalDepartment"
					                  :chooseNum="chooseNum"
					                  noticeTitle="只展示在企业微信官方后台创建自建应用时，所设置的可见成员，只有他们才拥有接收待办提醒的权限。"
					                  :departmentDisabled="1" :is_from="3"
					                  :callback="modalVisibleChange3"></chooseDepartment>
					<chooseDepartment :key="2" ref="user1" :show="showModalDepartment1" :chooseNum="chooseNum1"
					                   :callback="modalVisibleChange5" :is_special="1"></chooseDepartment>
				</div>

			</div>
		</div>

	</div>
</template>

<script>
	import linkAgent from '@/components/addAgent/index.vue'
	import groupChat from "@/components/GroupChat.vue"
	import corpSensitiveWord from '@/components/corpSensitiveWord/CorpSensitiveWord.vue'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import moment from "moment";

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
			width      : "37%",
			scopedSlots: {customRender: "userinfo"}
		},
		{
			title      : '查看员工待办事项',
			dataIndex  : "user_names",
			width      : "37%",
			key        : "user_names",
			scopedSlots: {customRender: "user_names"}
		},
		{
			title      : "状态",
			dataIndex  : "open_status",
			key        : "open_status",
			width      : '10%',
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
		name      : 'todoManagementRemind',
		components: {linkAgent, groupChat, corpSensitiveWord, chooseDepartment},
		props     : {
			// id: {
			// 	type   : String,
			// 	default: ''
			// }
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				time2               : ['09:00'],
				time                : [null], // 添加的时间段数组
				timeIndex           : '',
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
				checkedList1        : [],
				userNum1            : 0,
				departmentNum1      : 0,
				chooseNum1          : 0,
				batchEditFlag       : 0,         // 是否是批量开启关闭
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
				chooseNum           : 0,
				chooseUserNum       : 0,
				chooseDepartmentNum : 0,
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
				frequency           : ['1'], // 通知频率
				userDelId           : [],
			};
		},

		methods: {
			addSpecialDate () {
				let t = moment('09:00','HH:mm')
				if (this.is_edit == 0 || this.is_edit == 2) {
					this.time.push('09:00')
					this.time2.push(t)
				} else if (this.is_edit == 1) {
					this.time.push('09:00')
					this.time2.push(t)
				}
			},
			deleteSpecialDate (index) {
				this.time.splice(index, 1)
				this.time2.splice(index, 1)
			},
			changeSpecialStartTime (e, index, timeIndex) {
				let T = moment(e._d, "HH:mm")
				console.log(T)
				// T = e.format("HH:mm")
				// // console.log(a,b)
				this.time.splice(index, 1, T.format("HH:mm"))
				this.time2.splice(index, 1, T)
				console.log(this.time)
			},
			moment,
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
			changeFrequency (val) {
				let index = this.frequency.indexOf(val)
				if (index > -1) {
					this.frequency.splice(index, 1)
				} else {
					this.frequency.push(val)
					if(this.time2.length == 0) {
						this.time = ['09:00']
						this.time2 = [moment('09:00', 'HH:mm')]
					}
				}
			},
			changeAgentId1 () {
				this.checkedList = []
				this.chooseNum = 0
			},
			//部门选择弹窗组件
			showDepartmentList () {
				let arr = []
				this.checkedList.map(x=>{
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
				this.showModalDepartment = true
			},
			// 自建应用
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					this.checkedList = JSON.parse(JSON.stringify(list))
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
				this.selectedRowKeys = []
				this.page = 1
				this.pageSize = 15
				this.total = 0
				this.userList = []
				this.getPartyList()
				this.getAgentList()
				// this.$emit('changeCorpId', this.corpId)
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
					this.checkedList1 = JSON.parse(JSON.stringify(list))
					this.userNum1 = userNum
					this.departmentNum1 = departmentNum
					this.party = []
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
				this.status = ''
				this.name = ''
				this.page = 1
				this.pageSize = 15
				this.selectedRowKeys = []
				this.userList = []
				this.getAgentList()
				// this.getNoticeList()
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
				if (this.agentId1 == '') {
					this.$message.destroy()
					this.$message.warning('请选择自建应用！')
					this.loading4 = false
					return false
				}
				if (this.checkedList == 0 && this.is_edit == 0) {
					this.$message.destroy()
					this.$message.warning('请选择推送成员！')
					this.loading4 = false
					return false
				}
				if (this.typeArr.length == 0) {
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
				if (this.frequency.length == 0) {
					this.$message.destroy()
					this.$message.warning('请选择推送频率')
					this.createDisabled = false
					this.loading4 = false
					return false
				}
				let nary = JSON.parse(JSON.stringify(this.time))
				nary = nary.sort();
				if(this.frequency.includes('1')) {
					for (let i = 0; i < nary.length; i++) {
						if (nary[i] == nary[i + 1]) {
							this.$message.destroy()
							this.$message.warning('时间选择不能重复')
							this.createDisabled = false
							this.loading4 = false
							return false
						}
					}
				}
				let params = {}
				let url = ''
				if (this.is_edit == 0) {
					params = {
						corp_id    : this.corpId,
						agent_id   : this.agentId1,
						user_id    : this.checkedList,
						inform_user: this.checkedList1,
						department : this.party,
						frequency  : this.frequency,
						remindId   : this.userDelId,
						time_select: nary
					}
					url = "work-user-commission-remind/add-remind"
				} else {
					params = {
						is_edit    : this.is_edit,
						remindId   : this.userDelId,
						// open_status:this.status,
						corp_id    : this.corpId,
						inform_user: this.checkedList1,
						department : this.party,
						frequency  : this.frequency,
						time_select: nary
					}
					url = "work-user-commission-remind/user-remind-edit"
				}
				const {data: res} = await this.axios.post(url, params);
				if (res.error != 0) {
					this.loading4 = false
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.editVisible = false
					this.resetModal()
					this.getNoticeList(this.page, this.pageSize)
				}
			},
			resetModal () {
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
				this.frequency = ['1']
				// this.agentId = this.agentList[0].id
				// this.agentId1 = this.agentList[0].id
				this.time = ['09:00']
				this.time2 = [moment('09:00', 'HH:mm')]
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
				const {data: res} = await this.axios.post("work-user-commission-remind/user-remind-lists", {
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
			batchEdit () {
				this.resetModal()
				this.is_edit = 2
				this.userNum = this.selectedRowKeys.length
				this.editTitle = '批量编辑生效员工'
				this.userDelId = JSON.parse(JSON.stringify(this.selectedRowKeys))
				this.editVisible = true
			},
			// 编辑
			async edit (id) {
				this.resetModal()
				this.is_edit = 1
				this.userNum = 1
				this.editTitle = '编辑生效员工'
				const {data: res} = await this.axios.post("work-user-commission-remind/add-remind", {
					remindId: id,
					is_edit : 1,
					corp_id : this.corpId
				});
				console.log(res)
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.userDelId = [id]
					this.typeArr = []
					this.agentId1 = res.data.agent
					if (res.data.type == 1) {
						this.typeArr = [0]
					} else {
						this.party = res.data.department
						// if (this.party.length > 0) {
						// 	this.typeArr.push(1)
						// }
						this.checkedList1 = res.data.inform_user
						this.departmentNum1 = this.party.length
						this.userNum1 = this.checkedList1.length - this.party.length
						this.chooseNum1 = this.checkedList1.length
						if (this.checkedList1.length > 0) {
							this.typeArr.push(2)
						}
					}
					this.checkedList = [res.data.user_id]
					this.frequency = res.data.frequency
					this.time = []
					this.time2 = []
					if (res.data.selectData.length > 0) {
						let a = []
						res.data.selectData.forEach(item => {
							let T = moment(item.time, 'HH:mm')
							this.time.push(item.time)
							this.time2.push(T)
						})

					}
					// this.time=res.data.selectData
					this.editVisible = true
				}
			},
			// 批量开启
			releaseFollow () {
				this.batchEditFlag = 1
				let that = this;
				that.$confirm({
					title     : "确定开启选中的待办提醒?",
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
				this.batchEditFlag = 1
				that.$confirm({
					title     : "确定关闭选中的待办提醒?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeNoticeStatus(that.selectedRowKeys, 0)
					}
				});
			},
			// 关闭、开启
			changeSatus (id, status, agent, index) {
				this.batchEditFlag = 0
				let that = this;
				let title = ''
				if (status == 1) {
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
						that.changeNoticeStatus(ids, status, agent, index)
					}
				});
			},
			async changeNoticeStatus (ids, status, agent, index) {
				const {data: res} = await this.axios.post("work-user-commission-remind/add-remind", {
					agent_id   : agent,
					remindId   : ids,
					open_status: status,
					is_edit    : 1,
					corp_id    : this.corpId
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					if (this.batchEditFlag == 1) {
						this.getNoticeList(1, this.pageSize)
					} else {
						if((this.page - 1) * this.pageSize + index == this.total - 1 && index%this.pageSize == 0) {
							this.getNoticeList(this.page - 1 == 0 ? 1 : this.page - 1, this.pageSize)
						} else {
							this.getNoticeList(this.page, this.pageSize)
						}
					}
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getNoticeList(page, pageSize);
				// this.$emit('changeScroll')
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
				// this.corpId = this.id
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

	.list {
		width: 100%;
		max-height: 100%;
		position: absolute;
		overflow-y: auto;
	}

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 835px;
		width: 100%;
		line-height: 50px;
	}

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
