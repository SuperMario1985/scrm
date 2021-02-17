<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden;">
				<!-- 左侧 -->
				<!--				<a-layout-sider v-if="corpLen > 1">-->
				<!--					&lt;!&ndash; 公众号 &ndash;&gt;-->
				<!--					<eWechat @changeWxId="handleWxId"></eWechat>-->
				<!--				</a-layout-sider>-->
				<a-layout
						style="position: absolute;top:0;left: 0; bottom:0;right:0; overflow-x: hidden; overflow-y: auto;"
						class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>跟进提醒</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">跟进提醒</div>
						<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7">
							<p style="margin-bottom: 0px;">
								使用场景：一方面可以有效的帮助销售人员把握跟单节奏，系统会自动提醒销售该跟进的客户，让销售做好合理的安排调度，再也不用担心因为工作忙而忘记跟进客户，一方面也有利于管理层每日对销售人员客户跟进的情况了如指掌，在一定程度上起到监督作用。<span
									style="color:#FF562D;">在设置前，需要先有自建应用，只有在该自建应用下的可见成员才具备接收应用消息通知的能力。</span>
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
										showSearch
										optionFilterProp="children"
										style="width: 165px;margin-bottom: 20px;"
										v-model="status"
								>
									<a-select-option :value="-1">全部状态</a-select-option>
									<a-select-option :value="1">已开启</a-select-option>
									<a-select-option :value="0">已关闭</a-select-option>
								</a-select>
								<a-input style="width: 165px;margin: 0 5px;" @keyup.enter="find" v-model="name"
								         placeholder="员工姓名搜索"></a-input>
								<a-button type="primary" style="margin: 0px 5px;" @click="find">查询</a-button>
								<a-button @click="clear">重置</a-button>
							</a-col>
							<a-col style="float:right;">
								<a-button class="btn-primary" 
								          @click="addSetting" type="primary" v-has="'follow-hign'">
									高级设置
								</a-button>
								<a-button class="btn-primary" 
								          @click="addFollow" type="primary" v-has="'follow-rule'">
									新建
								</a-button>
							</a-col>
						</div>
						<div style="padding-bottom: 10px;">
							共
							<span style="color: blue">{{total}}</span>
							条
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="userList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'follow-list'">
									<span slot="checkedBoxTitle">
									</span>
									<span slot="user" slot-scope="text, record, index">
										<a-avatar v-if="record.avatar" shape="square" :src="record.avatar"
										          style="float: left;height: 42px; width: 42px;"/>
										<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
										     src="../../../assets/useradvart.png"/>
										<div style="float: left;max-width: 270px;word-wrap:break-word;line-height: 32px;">
											<a-popover placement="top">
													<span slot="content">
														{{record.name}}
													</span>
												<p style="display: inline-block;margin-bottom: 0px; margin-left: 10px;max-width: 140px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{record.name}}</p>
											</a-popover>

											<!--											<p style="margin-left: 10px;" v-show="record.position !== ''">-->
											<!--												（{{record.position}}）</p>-->
										</div>
										<span style="line-height: 32px;">
												<a-icon slot="prefix" type="man"
												        style="margin-left: 10px;color: #427EBA;"
												        v-if="record.sex==1"/>
												<a-icon
														slot="prefix"
														type="woman"
														style="margin-left: 10px;color: #ED4997;"
														v-if="record.sex==2"
												/>
											</span>
									</span>
									<span slot="checkedBox" slot-scope="text, record, index">
										<a-checkbox style=""
										            v-model="checkBoxValue[index]"
										            @click="changeSelectKey(record.user_id)"></a-checkbox>
									</span>
									<span slot="follow_name" slot-scope="text, record">
										<span v-if="record.follow_name">
											{{record.follow_name}}
										</span>
										<span v-if="!record.follow_name">--</span>
									</span>
									<span slot="send_time" slot-scope="text, record">
										<span v-for="(item, index) in record.send_time">
											{{item}}<span v-if="index != record.send_time.length - 1">、</span>
										</span>
										<span v-if="record.send_time.length == 0">--</span>
									</span>
									<span slot="send_content" slot-scope="text, record">
										<a-popover placement="left" v-if="record.send_content.length != 0">
											<span slot="content">
												<div style="max-height: 500px; overflow-y: auto;">
													<p v-html="replaceContent(record.send_content)"
													   style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;"></p>
												</div>
											</span>
											<span
													style="color: #01b065; cursor: pointer;">预览</span>
										</a-popover>

										<span v-if="record.send_content.length == 0">--</span>
									</span>
									<span slot="status" slot-scope="text, record">
										<span v-if="record.status == 0">已关闭</span>
										<span v-if="record.status == 1">已开启</span>
									</span>
									<span slot="action" slot-scope="text, record, index">
										<a-button @click="failure(record.user_id)"
										          v-if="record.follow_id && record.status == 1"
										          style="margin: 0 5px 5px 0" v-has="'follow-open'">关闭</a-button>
										<a-button @click="releaseFollow(record.user_id)"
										          v-if="record.follow_id && record.status == 0"
										          style="margin: 0 5px 5px 0" v-has="'follow-open'">开启</a-button>
										<a-button @click="edit(record.user_id)"
										          style="margin: 0 5px 5px 0" v-has="'follow-edit'">编辑</a-button>
									</span>
								</a-table>

								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'follow-list'">
									<div style="height: 32px;float: left;line-height: 32px;">
										<a-checkbox v-model="batchTypeValue"
										            @click="batchTypeChange"></a-checkbox>
										<a-select optionFilterProp="children"
										          v-model="batchType"
										          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
											<a-select-option value="0">选择当前页</a-select-option>
											<a-select-option value="1">选择所有</a-select-option>
										</a-select>
										<a-button class="btn-primary" 
										          :disabled="selectedRowKeys.length == 0"
										          @click="addFollowMore" type="primary" v-has="'follow-edit'">
											批量编辑
										</a-button>
										<a-button class="btn-primary" 
										          :disabled="selectedRowKeys.length == 0"
										          @click="releaseFollow('')" type="primary" v-has="'follow-open'">
											批量开启
										</a-button>
										<a-button class="btn-primary" 
										          :disabled="selectedRowKeys.length == 0"
										          @click="failure('')" type="primary" v-has="'follow-open'">
											批量关闭
										</a-button>
										<!--										<a-popover placement="bottom">-->
										<!--											<span slot="content">-->
										<!--												<p :style="{color: batchType == 0 ? '#01b065': ''}" style="margin: 2px 2px 4px 2px;"-->
										<!--												   @click="changeBatchType(0)">选择当前页</p>-->
										<!--												<p :style="{color: batchType == 1 ? '#01b065': ''}" style="margin: 2px;"-->
										<!--												   @click="changeBatchType(1)">选择所有</p>-->
										<!--											</span>-->
										<!--											<a-icon style="margin-left: 5px; color: rgba(0, 0, 0, 0.85);"-->
										<!--											        type="down"></a-icon>-->
										<!--										</a-popover>-->
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
					</a-layout-content>

				</a-layout>
			</a-layout>
			<a-modal v-model="settingVisible" title="高级设置" @cancel="cancleSetting">
				<template slot="footer">
					<a-button key="back" @click="cancleSetting">取消</a-button>
					<a-button
							key="submit"
							type="primary"
							:loading="setLoading"
							@click="handleSetitng"
					>提交
					</a-button>
				</template>
				<div style="color: #FF562D;">
					超过天数统计未跟进人数：距上次添加跟进记录的时间到当前的时间差。比如上次跟进时间是1号10:30，当前时间是2号09:30，未超过1天，但是如果当前时间在2号10:31，则超过1天未跟进
				</div>
				<div class="setting-day">
					超过 1 天未跟进人数
				</div>
				<div class="setting-day">
					超过 3 天未跟进人数
				</div>
				<div class="setting-day" v-for="(item,index) in settingList1">
					超过
					<a-input-number :min="1" :step="0" :precision="0" style="width: 100px;margin-right: 5px;"
					                v-model="item.day"/>
					天未跟进人数
					<span style="margin-left: 15px;cursor: pointer;color: #FF562D;" @click="removeSet(index)">删除
					</span>
				</div>
				<div style="text-align: center;">
					<a-button type="primary" @click="addSet">添加</a-button>
				</div>
			</a-modal>
			<linkAgent :corpId="corpId" :showAddAgent="showAddAgentModal" :agent_is_money='0' @addOk="addOk" @linkOk="linkOk"
			           @addCancel="addCancel"></linkAgent>
		</div>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import eWechat from "../../../components/eWeChat/eWechat";
	import MyIcon from "@/components/MyIcon.vue"
	import moment from 'moment';
	import linkAgent from '@/components/addAgent/index.vue'
	// 活动列表
	const columns = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "9%",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "企业成员",
			dataIndex  : "user",
			key        : "user",
			width      : 270,
			scopedSlots: {customRender: "user"}
		},
		{
			title    : "所属部门",
			dataIndex: "department_name",
			key      : "department_name",
			width    : "12%",
		},
		{
			title      : "员工数据",
			dataIndex  : "follow_name",
			key        : "follow_name",
			width      : "16%",
			scopedSlots: {customRender: "follow_name"}
		},
		{
			title      : "推送时间",
			dataIndex  : "send_time",
			width      : "10%",
			key        : "send_time",
			scopedSlots: {customRender: "send_time"}
		},
		{
			title      : "提醒内容",
			dataIndex  : "send_content",
			width      : "12.8%",
			key        : "send_content",
			scopedSlots: {customRender: "send_content"}
		},
		{
			title      : "状态",
			dataIndex  : "status",
			width      : "10%",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '12.8%',
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "fissionList",
		components: {eWechat, MyIcon, linkAgent},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				suite_id         : 1,         //应用ID
				corpId           : corpId,    //企业微信选中的id
				corpInfo         : [],        // 企业微信列表
				agentId          : '',        // 自建应用ID
				status           : -1,
				name             : '',        // 员工姓名
				agentList        : [],        // 自建应用列表
				settingVisible   : false,     // 高级设置弹窗显示/隐藏
				showAddAgentModal: false,   // 添加应用弹窗
				setLoading       : false,     // 高级设置提交loading
				settingList      : [],        // 高级设置数据
				settingList1     : [],        // 高级设置弹窗数据
				batchType        : '0',       // 0当前页 1所有
				batchTypeValue   : false,     // 当前页/所有 是否选中
				selectedRowKeys  : [],        // 选中的员工id
				checkBoxValue    : [],        // 表格多选框选中状态
				userKeys         : [],        // 所有员工的key
				userList         : [],        // 表格数组
				isLoading        : true,      //Loading 组件显示与隐藏
				corpLen          : JSON.parse(localStorage.getItem('corpArr')).length,
				//表格部分
				columns,
				//分页
				total            : 0, //总条数
				quickJumper      : false, // 是否显示快速跳转的控件
				page             : 1, //页码
				page_size        : 15, //每页数据量，默认15
				pageSize         : 15, //每页数据条数
			};
		},

		methods: {
			handleWxId (value) {
				this.corpId = value
				this.getAgentList()
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
				this.name = ''
				this.status = -1
				this.page = 1
				this.pageSize = 15
				this.getAgentList()
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
						if (userList[i].user_id == this.selectedRowKeys[j]) {
							this.checkBoxValue[i] = true
						}
					}
				}
				if (this.batchType == 0) {
					this.batchTypeValue = true
					this.checkBoxValue.map(item => {
						if (!item) {
							this.batchTypeValue = false
						}
					})
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
					let index = this.selectedRowKeys.findIndex((id) => id === userList[i].user_id);
					if (index == -1) {
						this.selectedRowKeys.push(userList[i].user_id)
					}
				}
			},
			// 删除当前页key
			removeKey (userList) {
				for (let i = 0; i < userList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === userList[i].user_id);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			// 高级设置取消
			cancleSetting () {
				this.settingList1 = JSON.parse(JSON.stringify(this.settingList))
				this.settingVisible = false
			},
			// 高级设置提交
			async handleSetitng () {
				this.setLoading = true
				let dayArr = []
				for (let setting of this.settingList1) {
					if (setting.day < 1) {
						this.$message.warning('请输入正确的天数')
						this.setLoading = false
						return false
					}
					dayArr.push(setting.day)
				}
				for (let i = 0; i < dayArr.length; i++) {
					if (dayArr[i] == 1 || dayArr[i] == 3) {
						this.$message.warning('时间存在重复')
						this.setLoading = false
						return false
					}
					for (let j = i + 1; j < dayArr.length; j++) {
						if (dayArr[i] == dayArr[j]) {
							this.$message.warning('时间存在重复')
							this.setLoading = false
							return false
						}
					}
				}
				const {data: res} = await this.axios.post("work-follow-msg/not-follow-day-post", {
					uid   : localStorage.getItem('uid'),
					dayArr: dayArr
				});
				if (res.error != 0) {
					this.setLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.settingList = JSON.parse(JSON.stringify(this.settingList1))
					this.settingVisible = false
					this.setLoading = false
				}

			},
			// 高级设置弹窗
			addSetting () {
				if (this.agentList.length == 0) {
					this.showAddAgentModal = true
				} else {
					this.settingList1 = JSON.parse(JSON.stringify(this.settingList))
					this.settingVisible = true
				}
			},
			addOk () {
				this.showAddAgentModal = false
				this.getAgentList()
				this.settingList1 = JSON.parse(JSON.stringify(this.settingList))
				this.settingVisible = true
			},
			linkOk () {
				this.showAddAgentModal = false
				this.getAgentList()
			},
			addCancel () {
				this.showAddAgentModal = false
			},
			// 高级设置删除
			removeSet (index) {
				this.settingList1.splice(index, 1)
			},
			// 高级设置添加
			addSet () {
				this.settingList1.push({
					day: 1
				})
			},
			// 新建标签
			addFollow () {
				if (this.agentList.length == 0) {
					this.showAddAgentModal = true
				} else {
					this.$router.push('/follow/add?agentid=' + this.agentId + '&corpid=' + this.corpId)
				}
			},
			// 新建标签
			addFollowMore () {
				if (this.agentList.length == 0) {
					this.showAddAgentModal = true
				} else {
					let id = ''
					for (let s of this.selectedRowKeys) {
						id += s + ','
					}
					if (id.length > 0) {
						id = id.substring(0, id.length - 1)
					}
					this.$router.push('/follow/add?id=' + id + '&agentid=' + this.agentId + '&corpid=' + this.corpId)
				}
			},
			// 获取自建应用
			async getAgentList () {
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
					if (this.agentList.length > 0) {
						this.agentId = this.agentList[0].id
						this.getUserList()
					} else {
						this.agentList = res.data
						this.isLoading = false
					}
				}
			},
			// 获取高级设置
			async getSettingList () {
				const {data: res} = await this.axios.post("work-follow-msg/not-follow-day-list", {
					uid: localStorage.getItem('uid'),
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.settingList = []
					for (let day of res.data) {
						this.settingList.push({
							day: day
						})
					}
				}
			},
			changeAgentId () {
				this.selectedRowKeys = []
				this.getUserList()
			},
			// 获取表格内容
			async getUserList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-follow-msg/follow-user-list", {
					corp_id  : this.corpId,
					agentid  : this.agentId,
					name     : this.name,
					status   : this.status,
					page     : page,
					page_size: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg)
				} else {
					this.userList = res.data.list
					this.userKeys = res.data.keys
					this.isLoading = false
					this.total = parseInt(res.data.count)
					this.page = page
					this.pageSize = pageSize
					this.quickJumper = this.total > this.pageSize
					this.setCheckedBox(this.userList)
				}
			},
			replaceContent (textContent) {
				return "<p>" + textContent.replace(/{username}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">员工姓名</span>&nbsp;</span>'
				).replace(/{newMemberNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">新增客户数</span>&nbsp;</span>'
				).replace(/{followMemberNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已跟进人数</span>&nbsp;</span>'
				).replace(/{followNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已跟进条数</span>&nbsp;</span>'
				).replace(/{changeFollowNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前状态变化人数</span>&nbsp;</span>'
				).replace(/{notChangeNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前阶段状态未改人数</span>&nbsp;</span>'
				).replace(/{sendTime}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">发送时间点</span>&nbsp;</span>'
				).replace(/{followUser}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">可见员工</span>&nbsp;</span>'
				).replace(/{notFollowDay_([\d]*)}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">超过$1天数未跟进人数</span>&nbsp;</span>'
				).replace(/{follow_id}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前状态</span>&nbsp;</span>'
				).replace(/\n/g, '<br>') + "</p>"
			},
			// 关闭
			failure (id) {
				let that = this;
				that.$confirm({
					title     : "确定关闭该提醒？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						let selectId = []
						if (id) {
							selectId.push(id)
						} else {
							selectId = that.selectedRowKeys
						}
						that.changeStatus(selectId, 0)
					}
				});
			},
			// 开启
			releaseFollow (id) {
				let that = this;
				that.$confirm({
					title     : "确定开启该提醒？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						let selectId = []
						if (id) {
							selectId.push(id)
						} else {
							selectId = that.selectedRowKeys
						}
						that.changeStatus(selectId, 1)
					}
				});
			},
			async changeStatus (id, status) {
				const {data: res} = await this.axios.post("work-follow-msg/follow-user-set-status", {
					corp_id  : this.corpId,
					agentid  : this.agentId,
					follow_id: id,
					status   : status
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.getUserList(this.page, this.pageSize)
				}
			},
			// 编辑
			edit (id) {
				this.$router.push("/follow/add?id=" + id + '&agentid=' + this.agentId + '&corpid=' + this.corpId)
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getUserList(page, pageSize);
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getUserList(1, pageSize);
			}
		},

		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.isLoading = true
				this.selectedRowKeys = []
				if (this.corpInfo.length > 0) {
					this.getSettingList()
					this.getAgentList()
				}
			});

		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/follow/add' && to.query.isRefresh == '1') {
				next(vm => {
					vm.selectedRowKeys = []
					vm.getUserList(vm.page, vm.pageSize)
				})
			} else {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
					vm.name = ''
					vm.selectedRowKeys = []
					vm.page = 1
					vm.pageSize = 15
					vm.getAgentList()
				});
			}
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
		overflow: hidden;
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
