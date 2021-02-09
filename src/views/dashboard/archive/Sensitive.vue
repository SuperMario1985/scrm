<template>
	<div class="list">
		<div id="components-layout-demo-basic"><!-- 头部 -->
			<a-layout-header>违规监控</a-layout-header>
			<div class="content-msg">
				<p style="margin-bottom: 2px;">
					1、当敏感词被不启用时，曾经所触发的内容依然在列表中可见。</p>
				<p style="margin-bottom: 2px;">
					2、显示历史上开启会话存档的企业成员。若曾经设置过某员工违规提醒，现在对该员工关闭、不再开启会话存档或是该员工离职，那么其历史触发敏感词的监控内容，依然在列表中可见。</p>
				<p style="margin-bottom: 0;">
					3、显示历史上设置过违规提醒的群聊。如曾经设置过某群聊违规提醒，现在该群聊不再设置，那么其历史触发敏感词的监控内容，依然在列表中可见。</p>
			</div>
			<div style="padding-top: 20px;width: 100%;position: absolute;height: calc(100% - 190px);">
				<div style="padding: 0 20px;">
					<span @click="changeTabs('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}"
					      v-has="'sensitive-control'">敏感词监控</span>
					<span @click="changeTabs('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}"
					      v-has="'sensitive-words'">敏感词词库</span>
				</div>
				<div v-if="tabKey == 1"
				     style="background: #FAFAFA;margin: 0 20px 20px;padding: 12px 18px;height: calc(100% - 40px);">
					<a-layout style="position: relative;padding-top: 10px;">
						<!-- 左侧 -->
						<a-layout-sider>
							<!-- 敏感词 -->
							<Sensitive
									:isClose='1'
									:isSystem='1'
									ref="sensitive"
									style="position: absolute;height: 100%;overflow-y: auto;width: 100%;padding: 10px 0 0 10px;"
									:callback="modalVisibleChange3"></Sensitive>
						</a-layout-sider>
						<a-layout style="overflow: hidden;" class="content">
							<!-- 头部 -->
							<a-layout-header>
								<div class="content-hd">
									<a-select
											v-if="corpInfo.length > 1"
											showSearch
											optionFilterProp="children"
											style="width: 145px;margin-right: 5px;"
											@change="handleWxId"
											v-model="corpId"
									>
										<template v-for="item in corpInfo">
											<a-select-option :value="item.corpid">{{item.corp_full_name ||
												item.corp_name}}
											</a-select-option>
										</template>
									</a-select>
									<a-button @click="showDepartmentList1"
									          style="min-width: 150px;margin-right: 5px;">
										<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
										<span v-else>选择部门成员</span>
									</a-button>
									<a-button @click="showChatVisible" style="width: 145px;margin-right: 5px;">
											<span style="text-align: center;"
											      v-if="chooseNum1 > 0">已选择{{chooseNum1}}个群</span>
										<span style="text-align: center;" v-else>选择群聊</span>
									</a-button>
									<a-range-picker
											format="YYYY-MM-DD"
											allowClear
											style="width:210px;"
											:disabled-date="disabledDate"
											v-model="sendTime"
									/>
									<a-button type="primary" style="margin: 0px 5px;"
									          @click="getSensitiveList(1, 15)">查找
									</a-button>
									<a-button @click="clearSensitive">清空</a-button>
								</div>
								<div v-if="total1 > 0" style="font-size: 14px; height: 40px;line-height: 40px;">
									共有
									<span style="color: blue">{{total1}}
									</span>
									个违规内容
								</div>

							</a-layout-header>
							<!-- 内容 -->
							<a-layout-content style="overflow-x: hidden; overflow-y: auto;" class="scroll">
								<!-- 表格部分 -->
								<div class="page-spinning" style="margin-top: 10px;">
									<a-empty v-if="sensitiveList.length == 0 && !isLoading" style="margin-top: 100px;"/>
									<a-spin tip="Loading..." size="large" :spinning="isLoading">
										<div class="spin-content">
											<div v-for="item in sensitiveList"
											     style="width: 100%;background-color: #FFFFFF;margin-bottom: 10px;box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">
												<div style="padding: 10px 20px;border-bottom: 1px solid #F8F8FF;">
													<span v-if="item.from_type == 1">成员</span>
													<span v-if="item.from_type == 2">客户</span>
													<span style="font-weight: 700;">【{{item.from_name}}】</span>
													<span v-if="item.is_chat != 1"> 对 </span>
													<span v-if="item.is_chat == 1"> 在 </span>
													<span v-if="item.is_chat == 1">群聊</span>
													<span v-if="item.is_chat != 1 && item.to_type == 1">成员</span>
													<span v-if="item.is_chat != 1 && item.to_type == 2">客户</span>
													<span style="font-weight: 700;">【{{item.to_name}}】</span> 说
													<span style="float: right;">{{item.msg_time}}</span>
												</div>
												<div style="padding: 20px 20px;">
													<div style="display: inline-block;vertical-align: top;margin-right: 10px;">
														<a-avatar style="width: 50px; height: 50px;" :src="item.avatar"
														          shape="square"/>
													</div>
													<div style="display: inline-block;width: calc(100% - 60px);">
														<p style="margin-bottom: 5px;">{{item.from_name}}</p>
														<p v-html="item.content"
														   style="display: inline-block; margin-bottom: 0px;"></p>
													</div>
												</div>
											</div>
											<!-- 分页 -->
											<div class="pagination" v-show="total1 > 0"
											     style="background-color: #FFFFFF;">
												<div class="pagination" style="height: 32px;float: right;margin:20px;">
													<a-pagination :total="total1" showSizeChanger
													              :showQuickJumper="quickJumper"
													              :current="page1"
													              :pageSize="pageSize1"
													              :pageSizeOptions="['15','30','50','100']"
													              @change="changePage1"
													              @showSizeChange="showSizeChange1"/>
												</div>
											</div>
										</div>
									</a-spin>
								</div>
							</a-layout-content>
						</a-layout>
					</a-layout>
					<!--选择群聊弹窗-->
					<groupChat :isRemindAll='1' :corpId="corpId" :show="chatVisible" :chatArr="chatArr" :is_list="2"
					           noticeTitle="只显示历史上设置过违规提醒的群聊。如曾经设置过某群聊违规提醒，现在该群聊不再设置，那么其历史触发敏感词的监控内容，依然在列表中可见。"
					           :callback="groupChatCallBack"></groupChat>
				</div>
				<div v-if="tabKey == 2"
				     style="background: #FAFAFA;margin: 0 20px 20px;padding: 12px 20px;height: calc(100% - 40px);">
					<a-layout style="position: relative;padding-top: 10px;">
						<!-- 左侧 -->
						<a-layout-sider>
							<!-- 公众号 -->
							<team
									:isForbid="2"
									:isSystem="1"
									sortUrl="limit-word/group-sort"
									addUrl="limit-word/group-add"
									editUrl="limit-word/group-add"
									delUrl="limit-word/del-group"
									listUrl="limit-word/group"
									name="敏感词"
									:callback="modalVisibleChange"></team>
						</a-layout-sider>
						<a-layout style="overflow: hidden;" class="content">
							<!-- 头部 -->
							<a-layout-header>
								<div class="content-hd">
									<div style="float: left;">
										<a-input style="width: 165px;margin: 0 5px;"
										         @keyup.enter="getSensitiveWords(1, 15)"
										         v-model="title" placeholder="查找敏感词"></a-input>
										<a-button type="primary" style="margin: 0px 5px;"
										          @click="getSensitiveWords(1, 15)">查找
										</a-button>
										<a-button @click="clear">清空</a-button>
									</div>
									<div class="content-hd-right">
										<a-button class="btn-primary" icon="plus" @click="showModal('add')"
										          type="primary" v-has="'sensitive-words-add'">
											新建敏感词
										</a-button>
										<a-modal title="新建敏感词" v-model="visible" @ok="handleOk(inputValue)"
										         :confirmLoading="confirmLoading3" @cancel="cancel"
										         width="550px!important">
											<a-form-item :label-col="{ span: 4 }"
											             :wrapper-col="{ span: 20 }">
												<template slot="label">
													选择分组
												</template>
												<a-select showSearch optionFilterProp="children" v-model="editGroupId"
												          style="width: 180px"
												          :dropdownStyle="{ overflow: 'hidden' }">
													<a-select-option v-for="item in groupList" :value="item.id">
														{{item.title}}
													</a-select-option>
												</a-select>
											</a-form-item>
											<a-form-item :label-col="{ span: 4 }"
											             :wrapper-col="{ span: 20 }">
												<template slot="label">
													敏感词名称
												</template>
												<p style="margin: 0px;font-size: 13px; color: #909399;">
													每个敏感词名称最多6个字。同时新建多个敏感词时，请用“空格”隔开</p>
												<a-input placeholder="请输入敏感词（不得超过6个字符）" v-model="inputValue"/>
											</a-form-item>

										</a-modal>
									</div>
								</div>
								<div style="font-size: 14px; height: 40px; line-height: 40px;">
									共有
									<span style="color: blue">{{total}}
									</span>
									个敏感词
								</div>
							</a-layout-header>
							<!-- 内容 -->
							<a-layout-content style="overflow-x: hidden; overflow-y: auto;" class="scroll">
								<!-- 表格部分 -->
								<div class="content-bd" style="margin-top: 10px;">
									<a-spin tip="Loading..." size="large" :spinning="isLoading">
										<div class="spin-content">
											<a-table :columns="columns" :dataSource="wordsList" :pagination="false"
											         :rowClassName="rowClassName" v-has="'sensitive-words-list'">
												<span slot="checkedBoxTitle">
												</span>
												<span slot="checkedBox" slot-scope="text, record, index">
												<a-checkbox style=""
												            :disabled="record.is_forbid == 1"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.key)"></a-checkbox>
												</span>
												<span slot="name" slot-scope="text, record">
													<a-tag color="#2db7f5" class="tag-name">
													    {{record.title}}
													</a-tag>
								                </span>
												<span slot="status" slot-scope="text, record">
													<span v-if="record.status == 1">已开启</span>
													<span v-if="record.status == 2">已关闭</span>
								                </span>
												<span slot="action" slot-scope="text, record">
													<span v-if="record.is_forbid != 1 && record.status == 2"
													      @click="openStatus(text, record)"
													      style="color: #01b065;cursor: pointer;margin: 5px;"
													      v-has="'sensitive-words-close'">开启</span>
													<span v-if="record.is_forbid != 1 && record.status == 1"
													      @click="closeStatus(text, record)"
													      style="color: #01b065;cursor: pointer;margin: 5px;"
													      v-has="'sensitive-words-close'">关闭</span>
													<span v-if="record.is_forbid != 1" @click="showModal3(text, record)"
													      style="color: #01b065;cursor: pointer;margin: 5px;"
													      v-has="'sensitive-words-delete'">删除</span>
													<span v-if="record.is_forbid != 1"
													      @click="showModalGroup(record.key)"
													      style="color: #01b065;cursor: pointer;margin: 5px;"
													      v-has="'sensitive-words-remove'">移动</span>
								                </span>
											</a-table>
											<!-- 分页 -->
											<div class="pagination" v-show="total > 0">
												<div style="height: 32px;float: left;line-height: 32px;margin:20px 0px 0px 10px;">
													<a-checkbox v-model="batchTypeValue"
													            @click="batchTypeChange"></a-checkbox>
													<a-select optionFilterProp="children"
													          v-model="batchType"
													          @change="changeBatchType"
													          style="width: 150px; margin: 0 5px;">
														<a-select-option value="0">选择当前页</a-select-option>
														<a-select-option value="1">选择所有</a-select-option>
													</a-select>
													<a-button class="btn-primary" icon="unlock"
													          :disabled="selectedRowKeys.length == 0"
													          @click="releaseFollow()" type="primary"
													          v-has="'sensitive-words-close'">
														批量开启
													</a-button>
													<a-button class="btn-primary" icon="lock"
													          :disabled="selectedRowKeys.length == 0"
													          @click="failure()" type="primary"
													          v-has="'sensitive-words-close'">
														批量关闭
													</a-button>
													<a-button class="btn-primary" icon="delete"
													          @click="deleteCoustomTags()"
													          :disabled="selectedRowKeys.length == 0" type="primary"
													          v-has="'sensitive-words-delete'">
														删除敏感词
													</a-button>
													<a-button class="btn-primary" icon="retweet"
													          @click="showModalGroup(0)"
													          :disabled="selectedRowKeys.length == 0" type="primary"
													          v-has="'sensitive-words-remove'">
														移动敏感词
													</a-button>
												</div>
												<div class="pagination" style="height: 32px;float: right;margin:20px;"
												     v-has="'sensitive-words-list'">
													<a-pagination :total="total" showSizeChanger
													              :showQuickJumper="quickJumper"
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
							<!-- 删除按钮弹窗 -->
							<a-modal title="删除敏感词" v-model="visible3" @ok="handleOk3"
							         :confirmLoading="confirmLoading2">
								<div style="margin: 19px 0px;">
									<a-icon type="exclamation-circle"
									        style="color: #F7BA2A; font-size: 22px;margin-right: 10px;"/>
									<span style="font-size: 16px;display: inline-block;width:90%;line-height: 22px;vertical-align: top;white-space: normal;word-break: break-all;"><span
											style="color: red;">{{inputValue3}}</span>确定删除吗？</span>
								</div>
							</a-modal>

							<a-modal title="选择分组" v-model="visibleGroup" @ok="handleGroupOk" @cancel="handleCancel"
							         width="888">
								<div style="height: 340px;">
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 200px;margin-bottom: 20px;margin-left: 5px;"
											@change="changeGroup"
											v-model="moveGroupId"
									>
										<template v-for="item in groupList">
											<a-select-option :value="item.id">
												{{item.title}}
											</a-select-option>
										</template>
									</a-select>
									<div style="height: 300px;" class="wxtpl">
										<template v-for="(item,index) in groupList" style="display: inline-block;">
											<template>
												<a-radio-group @change="changeGroup(item.id)" v-model="moveGroupId">
													<a-radio-button :value="item.id">
														<div>
															<span style="display: inline-block; width: 100%;margin-left: 5px; white-space:nowrap;text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow: hidden;vertical-align: middle;">{{item.title}}</span>
														</div>
													</a-radio-button>
												</a-radio-group>
											</template>
										</template>
									</div>
								</div>
							</a-modal>

						</a-layout>
					</a-layout>
				</div>
			</div>
		</div>
		<a-modal v-model="settingVisible" title="开通会话存档流程图" @cancel="cancleSetting"
		         width="700px !important">
			<template slot="footer">
				<a-button key="back" @click="cancleSetting">关闭</a-button>
			</template>
			<img style="width: 600px;" src="../../../assets/baidu/token.png"/>
		</a-modal>
		<!-- 选择会话存档成员 -->
		<chooseDepartment ref="user" :id="corpId" :show="showModalDepartment1" isAudit="1"
		                  noticeTitle="显示历史上开启会话存档的企业成员。若曾经设置过某员工违规提醒，现在对该员工关闭、不再开启会话存档或是该员工离职，那么其历史触发敏感词的监控内容，依然在列表中可见。"
		                  :isAuditUserAll="1"
		                  :chooseNum="chooseNum"
		                  :callback="modalVisibleChange5" :is_from="7" :is_special="1"></chooseDepartment>
	</div>
</template>

<script>
	import team from "@/components/team/Index.vue";
	import Sensitive from "../../../components/sensitiveWords/Sensitive";
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import groupChat from "@/components/GroupChat.vue"
	import moment from 'moment'

	const columns = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "9%",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "敏感词名称",
			dataIndex  : "name",
			scopedSlots: {customRender: "name"},
			key        : "name"
		},
		{
			title    : "员工触发次数",
			dataIndex: "staff_times",
			key      : "staff_times"
		},
		{
			title    : "客户触发次数",
			dataIndex: "custom_times",
			key      : "custom_times"
		},
		{
			title    : "创建时间",
			dataIndex: "add_time",
			key      : "add_time"
		},
		{
			title      : "状态",
			dataIndex  : "status",
			scopedSlots: {customRender: "status"},
			key        : "status"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		components: {team, Sensitive, groupChat, chooseDepartment},
		data () {
			return {
				tabKey              : '1',
				chatVisible         : false,
				settingVisible      : false,
				isAudit             : 0,
				userIds             : [],
				checkedList         : [],
				chooseNum           : 0,//部门成员总个数
				chooseUserNum       : 0,//成员个数
				chooseDepartmentNum : 0,//部门个数
				showModalDepartment1: false,
				chatArr             : [],
				chooseNum1          : 0,
				sendTime            : null,
				corpLen             : JSON.parse(localStorage.getItem('corpArr')).length,
				corpInfo            : [], //企业微信列表
				corpId              : localStorage.getItem('corpId'),        //企业微信选中的id
				wordIds             : [], // 选中的敏感词
				isSelected          : false,
				page1               : 1,  // 敏感词监控page
				pageSize1           : 15, // 敏感词监控pageSize
				sensitiveList       : [], // 敏感词监控列表数据
				total1              : 0,  // 敏感词监控总数
				/* 敏感词 */
				checkBoxValue       : [],        // 敏感词选择框
				batchType           : '0',       //0当前页 1所有
				batchTypeValue      : false,     //当前页/所有 是否选中
				title               : '',
				group_id            : '',        //选中的分组
				wordsList           : [],        //表格信息
				isLoading           : true,      //Loading 组件显示与隐藏
				//表格部分
				columns,
				visible             : false,     //新建敏感词
				inputValue          : "",        //新建敏感词输入框值
				newWordList         : [],        //新建敏感词数组
				inputValue2         : "",        //编辑敏感词的内容
				wordId              : "",        //敏感词id
				visible3            : false,     //删除按钮
				inputValue3         : "",        //删除敏感词的内容
				//分页
				total               : 0,         //总条数
				quickJumper         : false,     //是否显示快速跳转的控件
				page                : 1,         //页码
				pageSize            : 15,        //每页数据条数
				confirmLoading      : false,     //编辑弹框加载
				confirmLoading2     : false,     //删除弹框加载
				confirmLoading3     : false,     //新建敏感词弹框加载
				oldValue            : '',        //编辑之前的敏感词名
				selectedRowKeys     : [],        //选中的敏感词key
				isBatch             : true,
				ids                 : [],
				wordKeys            : [],       //所有敏感词key
				visibleGroup        : false,     //移动分组弹窗是否显示
				moveGroupId         : '',        //移动分组id
				editGroupId         : '',        //编辑分组id
				groupList           : [],        //分组列表
				groupDisabled       : false,     //编辑弹窗中选择分组的置灰
			};
		},

		methods: {
			changeTabs (key) {
				this.tabKey = key
				if (key == 1) {
					this.$nextTick(function () {
						this.$refs.sensitive.getSensitiveList()
					})
				} else {
					this.getSensitiveWords()
				}
			},
			handleWxId (value) {
				this.corpId = value
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.checkedList = []
				this.userIds = []
				this.chooseNum1 = 0
				this.chatArr = []
				this.$refs.sensitive.getSensitiveList()
			},
			modalVisibleChange3 (list, isSelected) {
				this.isSelected = isSelected
				this.wordIds = []
				for (let l of list) {
					this.wordIds.push(l.id)
				}
				if (this.corpInfo.length == 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.warning('请授权企业微信！')
					return false
				}
				this.getSensitiveList()
			},
			clearSensitive () {
				this.chooseNum1 = 0
				this.chatArr = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.checkedList = []
				this.userIds = []
				this.sendTime = null
				this.corpId = localStorage.getItem('corpId')
				this.getSensitiveList()
			},
			// 关闭开通会话存档引导弹窗
			cancleSetting () {
				this.settingVisible = false
			},
			showDepartmentList1 () {
				if (this.corpLen == 0) {
					this.$message.destroy()
					this.$message.warning('请授权企业微信')
					return false
				}
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.userIds))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
				this.showModalDepartment1 = true
			},
			modalVisibleChange5 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.checkedList = list
					this.userIds = arr
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
				}
				this.showModalDepartment1 = false
			},

			//选择群聊
			showChatVisible () {
				if (this.corpLen == 0) {
					this.$message.destroy()
					this.$message.warning('请授权企业微信')
					return false
				}
				this.chatVisible = true
			},
			groupChatCallBack (event, num, arr) {
				if (event == "ok") {
					this.chooseNum1 = num
					this.chatArr = arr
				}
				this.chatVisible = false
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			async getSensitiveList (page = 1, pageSize = this.pageSize1) {
				this.isLoading = true
				if (this.corpLen == 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.warning('请授权企业微信')
					return false
				}
				const {data: res} = await this.axios.post("limit-word/monitor", {
					limit_id   : this.wordIds,
					corp_id    : this.corpId,
					start_date : this.sendTime ? (this.sendTime.length > 1 ? moment(this.sendTime[0]).format('YYYY-MM-DD') : '') : '',
					end_date   : this.sendTime ? (this.sendTime.length > 1 ? moment(this.sendTime[1]).format('YYYY-MM-DD') : '') : '',
					chat_id    : this.chatArr,
					user_id    : this.userIds,
					is_selected: this.isSelected,
					page       : page,
					pageSize   : pageSize,
					uid        : localStorage.getItem('uid')
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.sensitiveList = []
					this.page1 = 1
					this.pageSize1 = pageSize
					this.total1 = 0
					this.isLoading = false
				} else {
					this.sensitiveList = res.data.infoList
					this.page1 = page
					this.pageSize1 = pageSize
					this.total1 = parseInt(res.data.count)
					this.isLoading = false
				}
			},
			unique (arr) {
				return Array.from(new Set(arr))
			},
			// 批量移动确认
			handleGroupOk () {
				this.moveGroupIds()
			},
			// 批量移动取消
			handleCancel () {
				this.visibleGroup = false
			},
			// 批量移动
			async moveGroupIds () {
				let id = []
				if (this.isBatch) {
					id = this.selectedRowKeys
				} else {
					id = this.ids
				}
				const {data: res} = await this.axios.post("limit-word/group-change", {
					group_id: this.moveGroupId,
					id      : id,
					uid     : localStorage.getItem('uid')
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.visibleGroup = false
					this.selectedRowKeys = []
					this.ids = []
					this.$message.success('移动成功')
					this.getSensitiveWords()
				}
			},
			// 切换分组
			changeGroup (id) {
				this.moveGroupId = id
			},
			// 移动标签
			showModalGroup (id) {
				if (id != 0) {
					this.isBatch = false
					this.ids = []
					this.ids.push(id)
				} else {
					this.isBatch = true
					this.ids = []
				}
				this.getTeamsList()
				this.visibleGroup = true
			},
			// 获取分组列表
			async getTeamsList () {
				const {data: res} = await this.axios.post("limit-word/group", {
					uid: localStorage.getItem('uid')
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					if (this.group_id == 0) {
						this.moveGroupId = this.groupList.length > 0 ? this.groupList.find(g => g.is_not_group == 1).id : []
						this.editGroupId = this.groupList.length > 0 ? this.groupList.find(g => g.is_not_group == 1).id : []
					} else {
						this.moveGroupId = this.group_id
						this.editGroupId = this.group_id
					}

				}
			},
			// 批量删除
			deleteCoustomTags () {
				let that = this
				that.$confirm({
					title     : "确定删除选中的敏感词?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.removeCoustomTags(0, that.selectedRowKeys)
					}
				});
			},
			// 批量开启
			releaseFollow () {
				let that = this;
				that.$confirm({
					title     : "确定开启选中的敏感词?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.removeCoustomTags(1, that.selectedRowKeys)
					}
				});
			},
			// 批量关闭
			failure () {
				let that = this;
				that.$confirm({
					title     : "确定关闭选中的敏感词?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.removeCoustomTags(2, that.selectedRowKeys)
					}
				});
			},
			// 改变敏感词状态
			async removeCoustomTags (status, selectedRowKeys) {
				const {data: res} = await this.axios.post("limit-word/change-status", {
					uid   : localStorage.getItem('uid'),
					ids   : selectedRowKeys,
					status: status
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.visibleGroup = false
					this.selectedRowKeys = []
					let message = ''
					if (status == 0) {
						message = '删除成功'
						this.getSensitiveWords()
					} else if (status == 1) {
						message = '开启成功'
						this.getSensitiveWords(this.page, this.pageSize)
					} else if (status == 2) {
						message = '关闭成功'
						this.getSensitiveWords(this.page, this.pageSize)
					}
					this.$message.success(message)
				}
			},
			rowClassName (record, index) {
				let className = 'dark-row'

				if (index % 2 === 0) {
					className = 'light-row'
				}

				return className
			},
			// 分组变化
			modalVisibleChange (suite_id, type, teamId) {
				this.selectedRowKeys = []
				this.suite_id = suite_id
				this.type = type
				this.group_id = teamId
				this.getSensitiveWords()
			}
			,
			// 新建敏感词
			showModal () {
				this.getTeamsList()
				this.visible = true
			},
			// 新建敏感词提交
			handleOk (val) {
				let that = this
				that.confirmLoading3 = true
				if (val == "") {
					that.$message.warning("不能为空")
					that.confirmLoading3 = false
					return false
				} else {
					for (var i = 0; i < val.split(" ").length; i++) {
						if (val.split(" ")[i].length > 6) {
							that.$message.error("每个敏感词最多6个字")
							that.confirmLoading3 = false
							that.inputValue = ""
							return false
						} else if (
							val.split(" ")[i].length > 0
						) {
							that.newWordList.push(val.split(" ")[i]);
							that.confirmLoading3 = false
						}
					}
					that.addTags();
					that.newWordList = []
					that.inputValue = ""
				}
			},
			// 添加标签
			async addTags () {
				const {data: res} = await this.axios.post("limit-word/set", {
					uid     : localStorage.getItem('uid'),
					group_id: this.editGroupId,
					title   : this.newWordList
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = true;
					this.getSensitiveWords()
					this.inputValue = ""
					this.newWordList = []
				}
			},
			cancel () {
				this.inputValue = ''
				this.visible = false
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
						this.addKey(this.wordsList)
						this.setCheckedBox(this.wordsList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = JSON.parse(JSON.stringify(this.wordKeys))
						this.setBox()
					}
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						// 当前
						this.removeKey(this.wordsList)
						this.setCheckedBox(this.wordsList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
						this.setBox()
					}
					this.batchTypeValue = false
				}
			},
			setBox () {
				this.setCheckedBox(this.wordsList)
			},
			// 设置列表卡片多选框选中状态
			setCheckedBox (wordsList) {
				this.checkBoxValue = new Array(wordsList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < wordsList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (wordsList[i].key == this.selectedRowKeys[j]) {
							this.checkBoxValue[i] = true
						}
					}
				}
				if (this.batchType == 0) {
					this.batchTypeValue = true
					for (let i = 0; i < this.checkBoxValue.length; i++) {
						if (!this.checkBoxValue[i] && this.wordsList[i].is_forbid != 1) {
							this.batchTypeValue = false
						}
					}
				} else {
					if (this.selectedRowKeys.length == this.wordKeys.length && this.wordKeys.length != 0) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}
				if (wordsList.length == 0) {
					this.batchTypeValue = false
				} else {
					for (let word of wordsList) {
						if (word.is_forbid != 1) {
							return false
						}
					}
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
			addKey (wordsList) {
				for (let i = 0; i < wordsList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === wordsList[i].key)
					if (index == -1 && wordsList[i].is_forbid != 1) {
						this.selectedRowKeys.push(wordsList[i].key)
					}
				}
			},
			// 删除当前页key
			removeKey (wordsList) {
				for (let i = 0; i < wordsList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === wordsList[i].key);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			// 开启敏感词
			openStatus (text, record) {
				let that = this;
				that.$confirm({
					title     : "确定开启选中的敏感词?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.removeCoustomTags(1, [record.key])
					}
				});
			},
			// 关闭敏感词
			closeStatus (text, record) {
				let that = this;
				that.$confirm({
					title     : "确定关闭选中的敏感词?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.removeCoustomTags(2, [record.key])
					}
				});
			},
			//删除按钮
			showModal3 (text, record) {
				// console.log(record)
				this.visible3 = true
				this.wordId = record.key
				this.inputValue3 = record.title
			},
			// 单个删除
			handleOk3 (e) {
				this.confirmLoading2 = true
				this.removeCoustomTags(0, [this.wordId])
			},
			// 重置
			clear () {
				this.title = ''
				this.getSensitiveWords()
			},
			//获取表格内容
			async getSensitiveWords (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("limit-word/list", {
					// corp_id : this.corpId,
					uid     : localStorage.getItem('uid'),
					title   : this.title,
					group_id: this.group_id,
					page    : page,
					pageSize: pageSize,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg)
					this.confirmLoading = false
				} else {
					this.wordsList = res.data.limitWord
					this.wordKeys = res.data.keys
					this.setCheckedBox(this.wordsList)
					this.total = parseInt(res.data.count)
					this.page = page
					this.pageSize = pageSize
					this.quickJumper = this.total > this.pageSize
					this.confirmLoading = false
					this.confirmLoading2 = false
					this.visible3 = false
					this.confirmLoading3 = false
					this.visible = false
					this.isLoading = false
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getSensitiveWords(page, pageSize)
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange (page, pageSize) {
				this.getSensitiveWords(1, pageSize)
			},
			// 分页
			changePage1 (page, pageSize) {
				this.getSensitiveList(page, pageSize)
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange1 (page, pageSize) {
				this.getSensitiveList(1, pageSize)
			},
			moment
		},

		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				if (this.corpInfo.length > 0) {
					this.isAudit = this.corpInfo.find(i => i.corpid == this.corpId).isAudit
				}
				let that = this
				if (localStorage.getItem('isMasterAccount') == 2) {
					let permissionButton = localStorage.getItem('permissionButton').split(',')
					if (permissionButton.indexOf('sensitive-control') != -1) {
						that.tabKey = '1'
					} else {
						that.tabKey = '2'
					}
					that.$forceUpdate()
				} else {
					that.tabKey = '1'
				}
			})
		}
	};
</script>

<style lang='less' scoped>
	.wx-info {
		width: 100%;
		position: absolute;
		left: 0;
		top: 100px;
		bottom: 0;
		overflow: hidden;
	}

	.wx-info::-webkit-scrollbar {
		width: 2px;
		height: 100%;
	}

	.wx-info::-webkit-scrollbar-track-piece {
		background-color: #FFFFFF;
	}

	.wx-info::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #FFFFFF;
	}

	/*.wx-info::-webkit-scrollbar-track*/
	/*{*/
	/*	border-radius: 10px;  !*滚动条的背景区域的圆角*!*/
	/*	background-color: white;!*滚动条的背景颜色*!*/
	/*}*/
	#components-layout-demo-basic {
		height: calc(100% - 80px);
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 835px;
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
		border: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		width: calc(100% - 20px);
		margin: 0 10px;
	}

	.content-hd {
		/*height: 50px;*/
		width: 100%;
		line-height: 50px;
	}

	.content-msg {
		width: calc(100% - 40px);
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 10px;
		margin: 10px 0 0 20px;
	}

	.msg-info {
		color: #FFDDA6;
		margin-right: 10px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		width: 100%;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	/deep/ .ant-tabs-tabpane {
		height: 100%;
		padding-bottom: 39px;
	}

	/deep/ .ant-tabs-bar {
		margin-bottom: 0px;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0px;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	/deep/ .ant-layout.ant-layout-has-sider {
		margin: 0px;
	}

	.content-hd-left {
		float: left;
	}

	.content-hd-right {
		float: right;
	}

	.btn-primary {
		margin-left: 20px;
	}

	.sider-one {
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.selectWx {
		width: 200px;
		margin-left: 20px;
		/*margin: auto;*/
		height: 50px;
		line-height: 50px;
		cursor: pointer;
		padding-left: 10px;
	}

	.active {
		background: #01b065;
		color: white;
	}

	.tag-name {
		padding: 6px 14px;
		height: 34px;
		font-size: 13px;
		border: 1px solid #D9D9D9;
		background-color: transparent !important;
		color: rgba(0, 0, 0, 0.65);
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 47px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .wxtpl .ant-radio-button-wrapper-checked {
		border: 2px solid #01b065 !important;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}

	.page-spinning /deep/ .ant-spin-spinning {
		margin-top: 150px;
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

	/deep/ .ant-layout {
		background: #FAFAFA;
	}

	.content /deep/ .ant-layout-header {
		height: auto !important;
	}
</style>
