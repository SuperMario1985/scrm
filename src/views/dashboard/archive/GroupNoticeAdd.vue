<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="urlId == ''">群聊违规提醒设置</template>
						<template v-if="urlId != ''">群聊违规提醒修改</template>
						<a-button type="primary" icon="rollback"
						          style="font-size: 14px;float: right;margin-right: 15px;margin-top: 7px;height: 32px;line-height: 16px;"
						          @click="goBack">
							返回列表
						</a-button>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content">
							<!-- 选择企业微信 -->
							<div class="content-hd" v-if="$store.state.corpArr.length > 1">
								<a-form>
									<a-form-item label="选择企业微信" :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<template>
											<div style="display: inline-block;cursor: pointer;" @click="changeCorp">
												<img src="../../../assets/WeChatLogo.png"
												     style="width: 24px;margin: -3px 6px 0 0;"/>
												<span>{{corpName}}</span>
												<a-icon type="caret-down"
												        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
												        v-if="urlId==''"/>
											</div>
											<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
										</template>
									</a-form-item>
								</a-form>
							</div>
							<div class="content-bd" style="padding-top: 20px;">
								<a-form>
									<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<template slot="label">
											<span style="color: red;">*</span>规则名称
										</template>
										<a-input v-model="title" placeholder="请填写规则名称，限20字符"
										         :maxLength="20"
										         style="width: 375px" :disabled="!!this.urlId"></a-input>
										<span style="display: inline-block; width: 200px; margin-left: 10px;color: #F56C6C">{{title.length}} / 20（一旦发布，不可修改）</span>
									</a-form-item>
									<a-form-item label="选择应用" :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<a-select
												showSearch
												optionFilterProp="children"
												placeholder="请选择应用"
												style="width: 170px;margin-bottom: 15px;margin-right: 5px;"
												@change="changeAgentId"
												v-model="agentId"
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
									<a-form-item label="选择适用客户群" :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<!--										<span style="border-left: 4px solid #01b065;padding-left: 10px;">选择适用客户群：</span>-->
										<!--										<a-divider/>-->
										<div style="margin-bottom: 15px;">
											<a-button @click="showChatVisible" style="width: 210px;margin-right: 5px;">
												<span v-if="chooseNum1 > 0">已选择{{chooseNum1}}个群</span>
												<span v-else>选择群聊</span>
											</a-button>
										</div>
									</a-form-item>
									<a-form-item label="设置提醒行为" :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<!--										<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-top: 15px;">设置提醒行为：</span>-->
										<!--										<a-divider/>-->
										<div>
											<a-checkbox v-model="isImage">发送带二维码的图片</a-checkbox>
											<a-checkbox v-model="isLink">发送链接分享</a-checkbox>
											<a-checkbox v-model="isWeapp">发送小程序</a-checkbox>
											<a-checkbox v-model="isCard">发送名片</a-checkbox>
											<a-checkbox v-model="isRedpacket">发送红包</a-checkbox>
											<a-checkbox v-model="isVoice">音频</a-checkbox>
											<a-checkbox v-model="isVideo">视频</a-checkbox>
										</div>
										<div>
											<a-checkbox v-model="isText">聊天消息中包含以下关键词</a-checkbox>
											<div v-if="isText">
												<a-button @click="showSensitiveWord"
												          style="width: 210px;margin-right: 5px;">
													<span v-if="keyword.length > 0">已选择{{keyword.length}}个敏感词</span>
													<span v-else>选择敏感词</span>
												</a-button>
											</div>
										</div>
									</a-form-item>
									<a-form-item label="通知人" :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<!--								<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-top: 15px;">通知人：</span>-->
										<!--								<a-divider/>-->
										<a-checkbox :checked="true" :disabled="true">
											群主
											<a-tooltip placement="top">
												<template slot="title">
													<p style="margin-bottom: 5px;">1、若群主不在可见应用成员范围内，会接收不到提醒通知。</p>
													<p style="margin-bottom: 0px;">
														2、若群成员为“外部非联系人”身份时，群主可以看到其违规行为，但不知是谁，用户昵称是“未知”。</p>
												</template>
												<a-icon type="question-circle" style="margin-left:5px;"/>
											</a-tooltip>
										</a-checkbox>
										<a-checkbox v-model="isUser">选择成员</a-checkbox>
										<a-button v-if="isUser" @click="showDepartmentList"
										          style="width: 210px;margin-right: 5px;">
											<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
											<span v-else>选择部门成员</span>
										</a-button>
									</a-form-item>
								</a-form>
							</div>
							<div class="content-bd">
								<a-form>
									<a-form-item>
										<div style="margin-top: 2px;margin-left: 17.25%;">
											<a-button type="primary" @click="createNotice"
											          :disabled="createDisabled">
												<template>提交</template>
											</a-button>
										</div>
									</a-form-item>
								</a-form>
							</div>
						</div>

						<a-modal v-model="settingVisible" title="开通会话存档流程图" @cancel="cancleSetting"
						         width="700px !important">
							<template slot="footer">
								<a-button key="back" @click="cancleSetting">关闭</a-button>
							</template>
							<img style="width: 600px;" src="../../../assets/baidu/token.png"/>
						</a-modal>
						<!-- 企业微信选择弹窗 -->
						<WeChatModal :show="showModal2" :callback="modalVisibleChange"></WeChatModal>
						<!--选择群聊弹窗-->
						<groupChat :chatIds="chatIds" :isDisable="1" ref="user" :show="chatVisible" :chatArr="chatArr"
						           :callback="groupChatCallBack"></groupChat>
						<!--部门选择框-->
						<chooseDepartment :agentid="agentId"
						                  noticeTitle="只展示在企业微信官方后台创建自建应用时，所设置的可见成员，只有他们才拥有接收违规提醒的权限。" ref="user"
						                  :show="showModalDepartment"
						                  :chooseNum="chooseNum" :departmentDisabled="1"
						                  :callback="modalVisibleChange3"></chooseDepartment>
						<a-modal v-model="sensitiveVisible" title="选择敏感词" @cancel="cancleSensitive"
						         width="888px!important">
							<template slot="footer">
								<a-button @click="cancleSensitive">关闭</a-button>
								<a-button type="primary" @click="handleSensitive">确定</a-button>
							</template>
							<corpSensitiveWord :callback="modalVisibleChange4"
							                   :hasChoose="wordArr"
							></corpSensitiveWord>
						</a-modal>
					</a-layout-content>
				</a-layout>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import WeChatModal from "@/components/WeChatModal.vue"
	import chooseMsg from "@/components/ChooseMsg"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import editor from '../../../components/editor/index'
	import groupChat from "@/components/GroupChat.vue"
	import corpSensitiveWord from '@/components/corpSensitiveWord/CorpSensitiveWord.vue'

	export default {
		components: {
			WeChatModal, chooseMsg, chooseDepartment,
			editor, groupChat, corpSensitiveWord
		},
		data () {
			return {
				settingVisible     : false, // 开通会话存档弹窗
				commonUrl          : this.$store.state.commonUrl, //公共的链接
				isLoading          : false, //Loading 组件显示与隐藏
				urlId              : '',//编辑时，地址栏的id
				isAudit            : '', // 是否开通会话存档
				suite_id           : 1,//应用ID
				corpId             : localStorage.getItem('corpId'),//企业微信选中的id
				corpName           : localStorage.getItem('corpName'),//企业微信选中的名字
				title              : '',
				agentList          : [],
				agentId            : '',
				showModal2         : false, //公众号组件弹窗显示与隐藏
				validity           : 1,//企业微信成员单选
				createDisabled     : false,//控制创建欢迎语按钮的禁用
				chatVisible        : false,
				chatArr            : [], // 群聊
				chatIds            : [], // 编辑时群聊，目的是不禁选
				chooseNum1         : 0,
				// 提醒行为
				isImage            : false,
				isLink             : false,
				isWeapp            : false,
				isCard             : false,
				isRedpacket        : false,
				isVoice            : false,
				isVideo            : false,
				isText             : false,
				keyword            : [],
				sensitiveVisible   : false,
				wordArr            : [],
				// 通知人
				isUser             : false,
				checkedList        : [],
				chooseNum          : 0,// 部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				showModalDepartment: false,
			}
		},
		methods   : {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/violations/notice?isRefresh=1" + "&agentId=" + this.agentId)
			},
			changeCorp () {
				if (this.$route.query.id) {
					return
				}
				this.showModal2 = true
			},
			changeAgentId () {
				this.checkedList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
			},
			// 获取自建应用
			async getAgentList (id) {
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
					if (id && this.$route.query.corpid == localStorage.getItem('corpId')) {
						this.agentId = id
					} else {
						if (this.agentList.length > 0) {
							this.agentId = this.agentList[0].id
						}
					}
				}
			},
			//选择群聊
			showChatVisible () {
				if (this.isAudit != 1) {
					this.$message.destroy()
					this.$message.warning('需要先开启【会话存档】功能，开启后才能正常设置群聊违规!', 2)
					return false
					// this.settingVisible = true
				} else {
					this.chatVisible = true
				}
			},
			// 关闭开通会话存档引导弹窗
			cancleSetting () {
				this.settingVisible = false
			},
			// 群聊
			groupChatCallBack (event, num, arr) {
				if (event == "ok") {
					this.chooseNum1 = num
					this.chatArr = arr
				}
				this.chatVisible = false
			},
			showSensitiveWord () {
				this.wordArr = JSON.parse(JSON.stringify(this.keyword))
				this.sensitiveVisible = true
			},
			handleSensitive () {
				this.keyword = JSON.parse(JSON.stringify(this.wordArr))
				this.sensitiveVisible = false
			},
			cancleSensitive () {
				this.wordArr = []
				this.sensitiveVisible = false
			},
			modalVisibleChange4 (event, ids) {
				if (event == 'ok') {
					this.wordArr = ids
				}
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
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
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
			//编辑时进入获取欢迎语内容
			async getDetail () {
				const {data: res} = await this.axios.post("work-chat-remind/chat-remind-detail", {
					corp_id  : this.$route.query.corpid,
					remind_id: this.urlId
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					// this.corpId = res.data.corp_id
					this.agentId = res.data.agentid
					this.getAgentList(this.agentId)
					this.title = res.data.title
					this.chatArr = res.data.chat_ids
					this.chatIds = JSON.parse(JSON.stringify(this.chatArr))
					this.chooseNum1 = this.chatArr.length
					this.isUser = res.data.remind_user.length > 0
					this.checkedList = res.data.remind_user
					this.chooseNum = this.checkedList.length
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					this.checkedList.map(x=>{
						if(x.scopedSlots.title == 'custom'){
							this.chooseUserNum++
						}else if(x.scopedSlots.title == 'title'){
							this.chooseDepartmentNum++
						}
					})
					this.isImage = res.data.is_image == 1
					this.isLink = res.data.is_link == 1
					this.isWeapp = res.data.is_weapp == 1
					this.isCard = res.data.is_card == 1
					this.isRedpacket = res.data.is_redpacket == 1
					this.isVoice = res.data.is_voice == 1
					this.isVideo = res.data.is_video == 1
					this.isText = res.data.is_text == 1
					this.keyword = res.data.keyword
					this.isLoading = false
				}
			},
			//创建、修改规则
			async createNotice () {
				this.createDisabled = true
				if (this.isAudit != 1) {
					this.createDisabled = false
					this.$message.destroy()
					this.$message.warning('需要先开启【会话存档】功能，开启后才能正常设置群聊违规!', 2)
					return false
					// this.settingVisible = true
				}
				if (this.title == '') {
					this.$message.destroy()
					this.$message.warning('请填写规则名称')
					this.createDisabled = false
					return false
				}
				if (typeof this.agentId == "object" || this.agentList == '') {
					this.$message.destroy()
					this.$message.warning('请选择应用')
					this.createDisabled = false
					return false
				}
				if (this.chatArr.length == 0) {
					this.$message.destroy()
					this.$message.warning('请选择群聊')
					this.createDisabled = false
					return false
				}
				if (!this.isImage && !this.isLink && !this.isWeapp && !this.isCard && !this.isRedpacket && !this.isVoice && !this.isVideo && !this.isText) {
					this.$message.destroy()
					this.$message.warning('请选择提醒行为')
					this.createDisabled = false
					return false
				}
				if (this.isText) {
					if (this.keyword.length == 0) {
						this.$message.destroy()
						this.$message.warning('请选择敏感词')
						this.createDisabled = false
						return false
					}

				}
				if (this.isUser) {
					if (this.checkedList.length == 0) {
						this.$message.destroy()
						this.$message.warning('请填写通知人员')
						this.createDisabled = false
						return false
					}
				} else {
					this.checkedList = []
				}
				const {data: res} = await this.axios.post("work-chat-remind/chat-remind-post", {
					uid         : localStorage.getItem('uid'),
					corp_id     : this.corpId,
					agentid     : this.agentId,
					remind_id   : this.urlId,
					title       : this.title,
					chat_ids    : this.chatArr,
					remind_user : this.checkedList,
					is_image    : this.isImage ? 1 : 0,
					is_link     : this.isLink ? 1 : 0,
					is_weapp    : this.isWeapp ? 1 : 0,
					is_card     : this.isCard ? 1 : 0,
					is_redpacket: this.isRedpacket ? 1 : 0,
					is_voice    : this.isVoice ? 1 : 0,
					is_video    : this.isVideo ? 1 : 0,
					is_text     : this.isText ? 1 : 0,
					keyword     : this.keyword
				});
				if (res.error != 0) {
					this.createDisabled = false
					this.$message.error(res.error_msg);
				} else {
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					if (this.urlId == '') {
						this.$router.push("/violations/notice?agentId=" + this.agentId)
					} else {
						this.$router.push("/violations/notice?isRefresh=1&agentId=" + this.agentId)
					}

				}
			},
			modalVisibleChange (type, corpId, corpName) {
				if (type == 'ok') {
					if (this.corpId != corpId) {
						this.corpId = corpId
						this.corpName = corpName
						this.chooseNum1 = 0
						this.chatArr = []
						this.$store.dispatch('changeCorp', this.$store.state.corpArr.find(i => i.corpid == this.corpId))
					}
				}
				this.showModal2 = false
			},
		},
		// created () {
		// 	if (this.$route.query.id) {
		// 		this.urlId = parseInt(this.$route.query.id)
		// 	}
		// 	if (this.urlId != '') {
		// 		this.isLoading = true;
		// 		localStorage.setItem('notAllow', 1)
		// 		localStorage.setItem('backUrl', '/archive/violationsNotice')
		// 		this.getDetail()
		// 	} else {
		// 		this.getAgentList(this.$route.query.agentid)
		// 	}
		// },
		mounted () {
			if (this.$route.query.id) {
				this.urlId = parseInt(this.$route.query.id)
			}
			this.corpId = localStorage.getItem('corpId')
			this.corpName = this.$store.state.corpArr.find(i => i.corpid == this.corpId).corp_name
			if (this.corpId == this.$route.query.corpid) {
				if (this.$route.query.agentid) {
					this.agentId = this.$route.query.agentid
				} else {
					this.agentId = ''
				}
			}

			this.isAudit = this.$store.state.corpArr.find(i => i.corpid == this.corpId).isAudit
			if (this.urlId != '') {
				this.isLoading = true;
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/archive/violationsNotice')
				this.getDetail()
			} else {
				this.getAgentList(this.$route.query.agentid)
			}
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";

	.changeType-text {
		background: @color-bgc;
		border: 1px solid @border-color;
		border-radius: 2px;
		padding: 7px 27px 6px 10px;
		font-size: 12px;
		width: 100%;
		margin-top: 12px;
		max-width: 673px;
		line-height: 20px;
		margin-bottom: 15px;
	}

	/deep/ .ant-divider-horizontal {
		margin: 5px 0 15px;
	}

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 0px 0px 15px 0px;
		text-align: left;
	}

	.content-msg a:link {
		color: #01b065;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.content-msg a:visited {
		color: #01b065;
		text-decoration: none;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		border: 1px solid #D9D9D9;
		height: 110px;
		overflow: auto;

		/deep/ p {
			margin: 0;
			/*display: inline-block;*/
			word-break: break-word;
		}
	}

	.hide {
		display: none !important;
	}

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 760px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 55px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .ant-col-15 {
		margin-left: 15px;
	}

	/deep/ .ant-card-meta-avatar {
		float: right;
		padding: 0;
	}

	#components-layout-demo-basic .ant-layout-content {
		min-width: 760px;
		width: 100%;
		position: relative;
	}

	.content {
		border: 1px solid #E2E2E2;
		min-width: 760px;
		position: absolute;
		top: 20px;
		left: 20px;
		right: 20px;
		background-color: #FAFAFA;
		margin-bottom: 20px;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
		height: 100%;
	}

	.list {
		height: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: absolute;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.content-hd {
		height: 80px;
		padding: 20px 0;
		max-width: 900px;
		border-bottom: 1px solid #E2E2E2;
	}

	.content-bd {
		background: #FAFAFA;
		max-width: 900px;
		/*background-color: #ffffff;*/
	}

	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 0 5px;
		cursor: pointer;
	}

	.pull-left {
		width: 88px;
	}

	.push-type-item {
		position: relative;
		margin-bottom: 8px;
		border: 1px solid #D8D8D8;
		border-right: 0;
		z-index: 1;
		cursor: pointer;
		line-height: 38px;
	}

	.active {
		background: #FFF;
		margin-right: -1px;
	}

	.type {
		display: inline-block;
		width: 65px;
		border-right: 1px solid transparent;
		text-align: center;
	}

	.add-new {
		background: #F9F9F9;
		cursor: pointer;
	}

	.add-icon {
		font-size: 12px;
		float: left;
		width: 30px;
		height: 38px;
		line-height: 38px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		border-right: 0;
	}

	.add-btn {
		float: left;
		width: 58px;
		text-align: center;
		height: 38px;
		line-height: 38px;
		border: 1px dashed #D8D8D8;
		border-right: 0;
	}

	.pull-right {
		width: 560px;
		max-height: 574px;
		height: 360px;
		background: #FFF;
		border: 1px solid #D8D8D8;
		padding: 24px;
		overflow: auto;
	}

	.fl {
		float: left;
	}

	.msg_content_txt {
		width: calc(100% - 46px);
		border: 1px solid #E9E9E9;
		padding: 10px 16px;
		border-radius: 4px;
		font-size: 14px;
		color: #1A1A1A;
		background: #FFF;
		float: left;
		word-break: break-word;
	}

	.box {
		float: right;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
		border: 2px solid #01b065;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	/deep/ #components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		-webkit-box-flex: 0 !important;
		-ms-flex: 0 0 24% !important;
		flex: 0 0 24% !important;
		max-width: 24% !important;
		min-width: 24% !important;
		width: 24% !important;
		border-right: 1px solid #E2E2E2;
		padding: 20px 20px;
	}

	.wrap {
		border: 1px solid #E2D6D6;
		margin: auto;
		height: 100%;
		width: 100%;
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}

	.popover-menu {
		cursor: pointer;
		text-align: center;
		display: inline-block;
		width: 80px;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	.popover-menu1, .popover-menu2 {
		margin-left: 10px;
	}

	.popover-menu p {
		margin-bottom: 5px;
	}

	.material {
		max-width: 80px;
		max-height: 80px;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.material-div {
		display: inline-block;
		position: relative;
		width: 100px;
		height: 100px;
		border: 1px dashed #D8D8D8;
	}

	.clear-current-list {
		display: inline-block;
		cursor: pointer;
		margin-left: 10px;
		color: #01b065;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
		margin-bottom: 10px;
	}

	.upload-wrap {
		width: 96px;
		height: 96px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		background: #FFF;
		cursor: pointer;
		margin-bottom: 10px;
		float: left;
	}

	.upload-plus {
		font-size: 32px;
		line-height: 96px;
		font-weight: 300;
		color: #686868;
	}

	.url-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 18px;
	}

	.url-text {
		float: left;
		max-width: calc(100% - 74px);
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		color: #A3A3A3;
	}

	.url-img {
		float: right;
		width: 64px;
		height: 64px;
	}

	.applet-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 52px;
	}

	.upload-border {
		background: #FFFFFF;
		border: 1px dotted #D8D8D8;
		height: 110px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		margin-bottom: 10px;
	}

	.changeType-text {
		background: @color-bgc;
		border: 1px solid @border-color;
		border-radius: 2px;
		padding: 7px 27px 6px 10px;
		font-size: 12px;
		width: 100%;
		margin-top: 12px;
		max-width: 673px;
		line-height: 20px;
		margin-bottom: 15px;
	}

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		border: 1px solid #D9D9D9;
		height: 110px;
		overflow: auto;

		/deep/ p {
			margin: 0;
			/*display: inline-block;*/
			word-break: break-word;
		}
	}
</style>