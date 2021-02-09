<template>
	<div>
		<div>
			<div class="content-msg">
				<p style="margin-bottom: 5px;">
					客户在客户群的违规提醒。当客户群中，客户触发所设置的违规行为时，群主或是指定成员会立即收到提醒，有效帮助员工管理客户群。
				</p>
				<p style="margin-bottom: 5px; color: #FF562D;">
					1、若群主不在可见应用成员范围内，会接收不到提醒通知。
				</p>
				<p style="margin-bottom: 0px; color: #FF562D;">
					2、若群成员为“外部非联系人”身份时，群主可以看到其违规行为，但不知是谁，用户昵称是“未知”。
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
					<a-button @click="showChatVisible" style="width: 210px;margin-right: 5px;">
						<span v-if="chooseNum1 > 0">已选择{{chooseNum1}}个群</span>
						<span v-else>选择群聊</span>
					</a-button>
					<a-input style="width: 165px;margin: 0 5px;" v-model="name"
					         placeholder="规则名称搜索" @keyup.enter="find"></a-input>
					<a-button type="primary" style="margin: 0px 5px;" @click="find">查询</a-button>
					<a-button @click="clear">重置</a-button>
				</a-col>
				<a-col style="float:right;">
					<a-button class="btn-primary" icon="plus"
					          @click="addNotice" type="primary" v-has="'violations-chat-set'">
						设置违规群聊
					</a-button>
				</a-col>
			</div>
			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<a-table :columns="columns" :dataSource="userList" :pagination="false"
					         :rowClassName="rowClassName" v-has="'violations-chat-list'">
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

						<span slot="chatName" slot-scope="text, record, index">
							<span v-for="item in record.chatName">
								<a-popover placement="right">
									<div slot="content"
									     style="max-height: 500px; overflow-y: auto;max-width: 500px;word-wrap: break-word;word-break: break-all;">
										{{item}}
									</div>
									<a-tag color="blue"
									       style="cursor: pointer;margin-bottom: 5px;max-width: 145px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
										{{item}}
									</a-tag>
								</a-popover>
							</span>

						</span>
						<span slot="remindName" slot-scope="text, record, index">
							<a-tag v-for="item in record.remindName" color="orange"
							       style="margin-bottom: 5px;cursor: pointer;">{{item}}</a-tag>
							<a-popover placement="top">
								<span slot="content">
									<p style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;margin-bottom: 0px;">
									<span v-for="(item,index) in record.keyword">{{item}}<span
											v-if="index != record.keyword.length - 1">，</span></span>
									</p>
								</span>
								<a-tag color="orange" v-if="record.keyword.length > 0"
								       style="margin-bottom: 5px;cursor: pointer;">
									<span>关键词：</span>
									<span v-for="(item,index) in record.keyword">
										<span v-if="index < 3">{{item}}</span>
										<span v-if="(index < 2 && index != record.keyword.length - 1 && record.keyword.length != 1)">，</span>
									</span>
									<span v-if="record.keyword.length > 3">...等{{record.keyword.length}}个</span>
								</a-tag>
							</a-popover>
							<span v-if="record.remindName.length == 0 && record.keyword.length == 0">--</span>
						</span>
						<span slot="sendUser" slot-scope="text, record, index">
							<p style="margin-bottom: 2px;">群主：<span v-for="item in record.master">{{item.name}} </span></p>
							<p style="margin-bottom: 0px;" v-if="record.send_user && record.send_user.length != 0">其他：<span v-for="item in record.send_user">{{item.title}} </span></p>
						</span>
						<span slot="action" slot-scope="text, record, index">
							<a-button @click="edit(record.remind_id)"
							          style="margin: 0 5px 5px 0"
							          v-has="'violations-chat-edit'">编辑</a-button>
							<a-button @click="deleteNotice(record.remind_id)"
							          style="margin: 0 5px 5px 0"
							          v-has="'violations-chat-delete'">删除</a-button>
						</span>
					</a-table>

					<!-- 分页 -->
					<div class="pagination" style="margin: 20px 15px;overflow: hidden;"
					     v-show="total > 0" v-has="'violations-chat-list'">
						<div style="height: 32px;float: left;line-height: 32px;">
							共
							<span style="color: blue">{{total}}</span>条
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
			<linkAgent :showAddAgent="showAddAgentModal" :agent_is_money='0' @addOk="addOk" @linkOk="linkOk"
			           @addCancel="addCancel"></linkAgent>
			<!--选择群聊弹窗-->
			<groupChat ref="user" :show="chatVisible" :chatArr="chatArr"
			           :callback="groupChatCallBack" :corpId="corpId"></groupChat>
			<a-modal v-model="settingVisible" title="开通会话存档流程图" @cancel="cancleSetting"
			         width="700px !important">
				<template slot="footer">
					<a-button key="back" @click="cancleSetting">关闭</a-button>
				</template>
				<img style="width: 600px;" src="../../../assets/baidu/token.png"/>
			</a-modal>
		</div>
	</div>
</template>

<script>
	import linkAgent from '@/components/addAgent/index.vue'
	import groupChat from "@/components/GroupChat.vue"
	// 活动列表
	const columns = [
		{
			title    : "规则名称",
			dataIndex: "title",
			key      : "title",
			width    : 180,
		},
		{
			title      : "适用群聊",
			dataIndex  : "chatName",
			key        : "chatName",
			scopedSlots: {customRender: "chatName"}
		},
		{
			title      : "提醒行为",
			dataIndex  : "remindName",
			key        : "remindName",
			width      : "19%",
			scopedSlots: {customRender: "remindName"}
		},
		{
			dataIndex  : "sendUser",
			key        : "sendUser",
			scopedSlots: {customRender: "sendUser", title: "send_user"}
		},
		{
			title    : "创建时间",
			dataIndex: "add_time",
			width    : "12.8%",
			key      : "add_time",
		},
		{
			title    : "最后一次更改时间",
			dataIndex: "upt_time",
			width    : "14%",
			key      : "upt_time",
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
		name      : "groupNotice",
		components: {linkAgent, groupChat},
		props: {
			id: {
				type: String,
				default: ''
			}
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				suite_id         : 1,         //应用ID
				corpId           : corpId,    //企业微信选中的id
				corpInfo         : [],        // 企业微信列表
				isAudit          : 0,
				settingVisible   : false,
				agentId          : '',        // 自建应用ID
				status           : -1,
				name             : '',        // 规则名称
				chatVisible      : false,
				chooseNum1       : 0,
				chatArr          : [],
				agentList        : [],        // 自建应用列表
				showAddAgentModal: false,   // 添加应用弹窗
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
				if(this.corpInfo.length > 0) {
					this.isAudit = this.corpInfo.find(i => i.corpid == this.corpId).isAudit
				}
				this.getAgentList()
				this.chatArr = []
				this.chooseNum1 = 0
				this.$emit('changeCorpId', this.corpId)
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			//选择群聊
			showChatVisible () {
				this.chatVisible = true
			},
			groupChatCallBack (event, num, arr) {
				if (event == "ok") {
					this.chooseNum1 = num
					this.chatArr = arr
				}
				this.chatVisible = false
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
				this.name = ''
				this.chatArr = []
				this.chooseNum1 = 0
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
					this.$message.warning('需要先开启【会话存档】功能，开启后才能正常设置群聊违规', 2)
					return false
					// this.settingVisible = true
				} else if (this.agentList.length == 0) {
					this.showAddAgentModal = true
				} else {
					this.$router.push('/archive/groupNoticeAdd?agentid=' + this.agentId + '&corpid=' + this.corpId)
				}
			},
			// 关闭开通会话存档引导弹窗
			cancleSetting () {
				this.settingVisible = false
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
				this.getNoticeList()
			},
			// 获取表格内容
			async getNoticeList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-chat-remind/chat-remind-list", {
					corp_id  : this.corpId,
					agentid  : this.agentId,
					title    : this.name,
					chat_ids : this.chatArr,
					page     : page,
					page_size: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.userList = res.data.list;
					this.userKeys = res.data.keys
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 编辑
			edit (id) {
				this.$router.push("/archive/groupNoticeAdd?id=" + id + '&agentid=' + this.agentId + '&corpid=' + this.corpId)
			},
			// 关闭
			deleteNotice (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该提醒？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 0)
					}
				});
			},
			async changeStatus (id) {
				const {data: res} = await this.axios.post("work-chat-remind/chat-remind-delete", {
					remind_id: id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if (this.userList.length == 1 && this.page > 1) {
						this.getNoticeList(this.page - 1, this.pageSize)
					} else {
						this.getNoticeList(this.page, this.pageSize)
					}
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
				if(this.corpInfo.length > 0) {
					this.isAudit = this.corpInfo.find(i => i.corpid == this.corpId).isAudit
				}
				this.isLoading = true
				if (this.corpInfo.length > 0) {
					this.getAgentList()
				}
			});

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
		/*margin-top: 12px;*/
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
