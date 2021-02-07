<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y: auto;">
		<a-card style="padding:10px 20px;">
			<label class="tpl-title">会话内容
				<a-tooltip placement="rightTop">
					<template slot="title">
						<p style="margin-bottom: 6px;">
							1、企业可设置合规存档的员工范围</p>
						<p style="margin-bottom: 6px;">
							2、经告知员工后，企业可获取开启范围内员工的工作沟通内容</p>
						<p style="margin-bottom: 6px;">
							3、经外部联系人同意后，企业可获取外部联系人与开启范围内员工的会话内容</p>
						<p style="margin-bottom: 0px;">
							4、准实时获取，员工与内外部单聊、群聊的聊天内容合规存档，包括文本、图片、文件（包括视频文件等）、语音条及撤回消息等消息类型</p>
					</template>
					<a-icon type="question-circle" style="margin-left:5px;"/>
				</a-tooltip>
			</label>
		</a-card>
		<!-- 正文内容 -->
		<div class="content-bd">
			<a-spin tip="Loading..." size="large" :spinning="isLoading" wrapperClassName="msg-box">
				<a-row style="height: 100%; background-color: white">
					<a-col
							:xs="5" :sm="5" :md="5" :lg="5" :xl="5" :xxl="4"
							:style="{height: '100%', borderRight: '1px solid #ececec'}">
						<!-- 开启会话存档功能的成员 -->
						<div class="user-box">
							<a-dropdown :visible="userVisible"
							            :overlayStyle="{boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0px 0px 2px'}">
								<a class="ant-dropdown-link" style="font-weight: 700;" @click="changeUserVisible"
								   @mouseout="setUserVisible" @mouseover="clearInter">
									<a-avatar
											shape="square"
											style="margin-right: 4px;"
											:src="activeUser.avatar"/>
									{{activeUser.name}}
									<a-icon type="down"/>
								</a>
								<div slot="overlay" style="width: 160px;background-color: #FFFFFF;"
								     @mouseleave="setUserVisible" @mouseover="clearInter">
									<a-input :allowClear="true" @change="selectUser" placeholder="搜索成员"
									         style="width: 94%; margin: 5px 3%;" v-model="userName"></a-input>
									<a-menu style="max-height: 270px; overflow-y: auto;">
										<a-menu-item

												v-for="(user, key) in selectUserList"
												:key="user.id"
												:disabled="user.id == activeUser.id"
												@click="changeUser(key)">
											<a-avatar
													shape="square"
													:data-id="user.id"
													:src="user.avatar" style="margin-right: 4px;"/>
											{{user.name}}
										</a-menu-item>
										<a-menu-item v-if="selectUserList.length == 0">
											暂无成员
										</a-menu-item>
									</a-menu>
								</div>
							</a-dropdown>
							<a-tooltip placement="top" style="float: right;margin-top: 5px;">
								<template slot="title">
									<span>已开通会话存档功能的企业成员。</span>
								</template>
								<a-icon type="question-circle" style="margin-left:5px;"/>
							</a-tooltip>
						</div>

						<!-- 消息类型 -->
						<div class="msg-type-box">
							<a-row>
								<a-col
										:span="8"
										class="msg-type"
										:class="type == 0 ? 'msg-type-active' : ''"
										@click="changeMsgType(0)">内部
								</a-col>
								<a-col
										:span="8"
										class="msg-type"
										:class="type == 1 ? 'msg-type-active' : ''"
										@click="changeMsgType(1)">外部
								</a-col>
								<a-col
										:span="8"
										class="msg-type"
										:class="type == 2 ? 'msg-type-active' : ''"
										@click="changeMsgType(2)">群聊
								</a-col>
							</a-row>
							<div>
								<a-input
										:allowClear='true'
										@change="changeName"
										style="margin: 10px;height: 32px; width: calc(100% - 20px);"
										placeholder="按名称搜索"
										v-model="userOrChatName">
								</a-input>
							</div>
						</div>

						<!-- 与成员对应的会话成员 -->
						<div class="chat-list-box">
							<a-spin tip="Loading..." size="large" :spinning="isChatUserLoading" style="height: 100%">
								<a-empty
										style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);"
										v-show="chatList.length == 0 && !isChatUserLoading"/>
								<div
										v-if="(type == 0 || type == 1) && chatList.length > 0"
										v-for="(chatUser, key) in chatList"
										:key="key"
										:data-chat-id="chatUser.chatUserId"
										:data-chat-name="chatUser.user.name"
										class="chat-list"
										:class="activeChat == chatUser.chatUserId ? 'chat-list-active' : ''"
										@click="changeChat(chatUser.chatUserId, chatUser.user.name)">
									<div class="chat-left">
										<a-avatar
												shape="square"
												class="chat-img"
												v-if="(type == 0 && chatUser.user.thumb_avatar) || type == 1 && chatUser.user.avatar"
												:data-id="chatUser.chatUserId"
												:src="type == 0 ? chatUser.user.thumb_avatar : chatUser.user.avatar"/>
										<img style="width: 40px;height: 40px;float: left;"
										     v-if="(type == 0 && !chatUser.user.thumb_avatar) || (type == 1 && !chatUser.user.avatar)"
										     src="../../../assets/useradvart.png"/>
									</div>

									<div class="chat-right">
										<div class="chat-right-title">
											<span
													class="chat-name"
													style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
												<strong>{{chatUser.user.name}}</strong>
											</span>
											<span class="chat-time">{{formatMsgTime(chatUser.msgtime, true, 'MM-DD')}}</span>
										</div>

										<div class="chat-right-content">
											<span>{{chatUser.content}}</span>
										</div>
									</div>
								</div>

								<div
										v-if="type == 2 && chatList.length > 0"
										v-for="(chatRoom, key) in chatList"
										:key="key"
										:data-chat-id="chatRoom.chat_id"
										:data-chat-name="chatRoom.chat"
										class="chat-list"
										style="height: 55px;"
										:class="activeChat == chatRoom.chat_id ? 'chat-list-active' : ''"
										@click="changeChat(chatRoom.chat_id, (chatRoom.chat && chatRoom.chat.length > 0) ? chatRoom.chat : '群聊')">
									<div class="chat-left" style="height: 35px;width: 35px;">
										<div style="background: #1890FF;width: 36px;height:36px;border-radius: 4px;"
										      v-if="chatRoom.avatarData && chatRoom.avatarData.length == 0">
											<img :src="groupAvatar"
									     style="width: 20px;margin: 8px;height: 20px;" :data-id="chatRoom.chat_id"/>
										</div>
										<div style="background: #DFDFDF;width: 36px;height:36px;border-radius: 4px;"
										      v-else-if="chatRoom.avatarData && chatRoom.avatarData.length == 1">
											<img :src="chatRoom.avatarData[0]"
									     style="width: 36px;height:36px;"
									     v-if="chatRoom.avatarData && chatRoom.avatarData[0] != ''" :data-id="chatRoom.chat_id"/>
											<img :src="img2" style="width: 36px;height:36px;"
									     v-if="chatRoom.avatarData && chatRoom.avatarData[0] == ''" :data-id="chatRoom.chat_id"/>
										</div>
										<div style="background: #DFDFDF;width: 36px;height:36px;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;align-items: center;"
										      v-else-if="chatRoom.avatarData && chatRoom.avatarData.length > 1 && chatRoom.avatarData.length <= 4">
											<template v-for="imgItem in chatRoom.avatarData">
												<img :src="imgItem"
												     style="width: 17px;height: 17px;" v-if="imgItem != ''" :data-id="chatRoom.chat_id" />
												<img :src="img2" style="width: 17px;height: 17px;"
												     v-if="imgItem == ''" :data-id="chatRoom.chat_id" />
											</template>
										</div>
										<div style="background: #DFDFDF;width: 36px;height:36px;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;align-items: center;"
										      v-else-if="chatRoom.avatarData && chatRoom.avatarData.length > 4">
											<template v-for="imgItem in chatRoom.avatarData">
												<img :src="imgItem"
												     style="width: 10px;height: 10px;" v-if="imgItem != ''" :data-id="chatRoom.chat_id" />
												<img :src="img2" style="width: 10px;height: 10px;"
												     v-if="imgItem == ''" :data-id="chatRoom.chat_id" />
											</template>
										</div>
									</div>

									<div class="chat-right" style="height: 35px;">
										<div class="chat-right-title" style="height: 20px;padding-bottom: 2px;">
											<span
													class="chat-name"
													style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
												<strong>{{chatRoom.chat && chatRoom.chat.length > 0 ? chatRoom.chat : '群聊'}}</strong>
											</span>
											<span class="chat-time">{{formatMsgTime(chatRoom.msgtime, true, 'MM-DD')}}</span>
										</div>

										<div class="chat-right-content" style="padding-top: 0px;">
											<span>{{chatRoom.content}}</span>
										</div>
									</div>
								</div>
							</a-spin>
						</div>
					</a-col>

					<a-col :xs="19" :sm="19" :md="19" :lg="19" :xl="19" :xxl="20" style="height: 100%">
						<a-spin tip="Loading..." size="large" :spinning="isChatListLoading" style="height: 100%">
							<div class="chat-info-box">
								<div
										class="chat-info-title"
										style="background-color: #FAFAFA;">
									<a-col
											:span="2"
											class="msg-type"
											:class="msgType == '' ? 'msg-type-active' : ''"
											@click="changeFileType('')">全部
									</a-col>
									<a-col
											:span="2"
											class="msg-type"
											:class="msgType == 'text' ? 'msg-type-active' : ''"
											@click="changeFileType('text')">文本
									</a-col>
									<a-col
											:span="2"
											class="msg-type"
											:class="msgType == 'image' ? 'msg-type-active' : ''"
											@click="changeFileType('image')">图片
									</a-col>
									<a-col
											:span="2"
											class="msg-type"
											:class="msgType == 'voice' ? 'msg-type-active' : ''"
											@click="changeFileType('voice')">语音
									</a-col>
									<a-col
											:span="2"
											class="msg-type"
											:class="msgType == 'video' ? 'msg-type-active' : ''"
											@click="changeFileType('video')">视频
									</a-col>
									<a-col
											:span="2"
											class="msg-type"
											:class="msgType == 'file' ? 'msg-type-active' : ''"
											@click="changeFileType('file')">文件
									</a-col>
									<a-col
											:span="2"
											class="msg-type"
											:class="msgType == 'weapp' ? 'msg-type-active' : ''"
											@click="changeFileType('weapp')">小程序
									</a-col>
									<a-col
											:span="2"
											class="msg-type"
											:class="msgType == 'news' ? 'msg-type-active' : ''"
											@click="changeFileType('news')">图文
									</a-col>
									<a-col
											:span="2"
											class="msg-type"
											:class="msgType == 'other' ? 'msg-type-active' : ''"
											@click="changeFileType('other')">其他
									</a-col>
								</div>
								<div
										class="chat-info-title"
										style="background-color: #FAFAFA;"
										v-if="activeChatName != ''">
									<a-tooltip placement="bottom">
										<span slot="title">
											<span>{{activeChatName}}</span>
										</span>
										<span class="chat-info-name" style="font-weight: 700;">{{activeChatName}}</span>
									</a-tooltip>

									<div style="float: right;">
										<a-input v-if="msgType == '' || msgType == 'text'"
										         :allowClear='true'
										         style="width: 210px;margin-right: 10px;"
										         @keyup.enter="findContent"
										         placeholder="请输入搜索内容"
										         v-model="msgName">
										</a-input>
										<a-range-picker style="width: 210px; margin-right: 10px;"
										                :allowClear='true'
										                :disabledDate="disabledDateDay"
										                format="YYYY-MM-DD"
										                v-model="sendDate"
										/>
										<a-button @click="findContent" type="primary" style="margin-right: 10px;">搜索
										</a-button>
										<a-button @click="clearContent" style="margin-right: 10px;">清空</a-button>
									</div>
								</div>
								<a-empty
										style="position: absolute;left: 50%; top: 50%;transform: translate(-50%, -50%);"
										v-if="chatInfoList.length == 0 && !chatItemLoading"/>
								<a-row
										class="chat-info-list"
										ref="chat_info_list"
										v-perfect-scroll-bar="perfectScrollBarOptions"
										@ps-scroll-up="handlePullOnLoad"
										@ps-scroll-down="handleInfiniteOnLoad"
										@ps-scroll-y="changeScrollPosition">
									<a-col :span="24">
										<div class="loading-box" v-if="chatItemLoading">
											<a-spin>
												<a-icon
														slot="indicator"
														type="loading"
														style="font-size: 12px; color: grey; margin-right: 5px; "
														spin/>
											</a-spin>
											<span>正在加载</span>
										</div>
										<!--										<div class="nomore-box" v-if="noMore[activeUser.id + '_' + activeChat]">-->
										<!--											<span>无更多消息</span>-->
										<!--										</div>-->
										<template v-if="chatInfoList.length > 0"
										          v-for="(chatItem, key) in chatInfoList">
											<!--											<a-divider-->
											<!--													dashed-->
											<!--													class="time-divider"-->
											<!--													v-if="showTimeDivider(chatItem.msgid, chatItem.msgtime)">-->
											<div v-if="showTimeDivider(chatItem.msgid, chatItem.msgtime)"
											     style="text-align: center; width: 100%; float: left;margin: 8px 0px;">
												{{formatMsgTime(chatItem.msgtime, true)}}
											</div>
											<!--											</a-divider>-->

											<div
													class="chat-item"
													:class="isFromUser(chatItem) ? 'self' : ''">
												<a-avatar
														shape="square"
														class="chat-item-img"
														v-if="(chatItem.from_type == 1 && chatItem.from_info.thumb_avatar) || (chatItem.from_type != 1 && chatItem.from_info.avatar)"
														:src="chatItem.from_type == 1 ? chatItem.from_info.thumb_avatar : chatItem.from_info.avatar"/>
												<img
														class="chat-item-img"
														v-if="(chatItem.from_type == 1 && !chatItem.from_info.thumb_avatar) || (chatItem.from_type != 1 && !chatItem.from_info.avatar)"
														src="../../../assets/useradvart.png"/>
												<div class="chat-item-name" v-if="type == 2 && !isFromUser(chatItem)"
												     style="margin-bottom: 6px;">
													<span style="margin: 0 8px 0 10px;">{{chatItem.from_info.name}}</span>
													<!--													<span :style="{color:chatItem.from_type == 1? '#1890FF' : 'orange'}">{{chatItem.from_type == 1 ? '@内部' : '@外部'}}</span>-->
													<a-tag v-if="chatItem.from_type == 1" color="blue">内部</a-tag>
													<a-tag v-else color="orange">外部</a-tag>
												</div>

												<div
														class="content"
														:class="'content-' + getMsgType(chatItem)"
														:ref="chatItem.msgid"
														v-html="initMsgContent(chatItem)"
														@click="addComment"></div>
											</div>
										</template>
									</a-col>
								</a-row>
							</div>
						</a-spin>
					</a-col>
				</a-row>
			</a-spin>
		</div>

		<a-modal
				v-if="typeof previewInfo[activeUser.id + '_' + activeChat] != 'undefined'"
				:visible="previewVisible"
				:footer="null"
				width="100%"
				centered
				class="preview-modal"
				@cancel="handleCancel">
			<a-carousel
					ref="previewCarousel"
					arrows
					:dots="false"
					effect="fade"
					:adaptiveHeight="true">
				<div
						slot="prevArrow"
						slot-scope="props"
						class="custom-slick-arrow"
						style="left: 10px;zIndex: 1">
					<a-icon type="left-circle" @click="videoStop"/>
				</div>

				<div
						slot="nextArrow"
						slot-scope="props"
						class="custom-slick-arrow"
						style="right: 10px">
					<a-icon type="right-circle" @click="videoStop"/>
				</div>

				<div v-for="(preview, key) in previewInfo[activeUser.id + '_' + activeChat]">
					<img
							v-if="typeof preview.previewType != 'undefined' && preview.previewType == 'IMG'"
							:alt="preview.previewAlt"
							:src="preview.previewUrl"
							:width="preview.previewWidth"
							:height="preview.previewHeight"
							style="margin: 0 auto; display: block; "/>
					<video
							v-if="typeof preview.previewType != 'undefined' && preview.previewType == 'VIDEO'"
							:src="preview.previewUrl"
							:width="preview.previewWidth"
							:height="preview.previewHeight"
							preload
							controls
							style="margin: 0 auto; display: block; "
							:data-key="key"
							@play="videoPlay"
							@pause="videoPause"/>
				</div>
			</a-carousel>
		</a-modal>
	</div>
</template>

<script>
	import moment from 'moment';
	import WEmoji from "@/common/js/wechatEmoji.js"
	import groupAvatar from "@/assets/chat.png"
	import img2 from '../../../assets/useradvart.png'
	import miniApp from "@/assets/icon/mini-app.png"
	import fileIcon from "@/assets/fileIcon/fileicon.png"

	export default {
		name   : "Msg",
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId                 : corpId,
				isLoading              : false,
				isChatUserLoading      : true,
				isChatListLoading      : true,
				chatItemLoading        : true,
				activeUser             : {},
				userVisible            : false,
				userName               : '',
				userList               : [],
				selectUserList         : [],
				type                   : 0,
				userOrChatName         : '',
				allChatList            : [],
				chatList               : [],
				activeChat             : 0,
				msgType                : '',
				msgName                : '',
				sendDate               : null,
				activeChatName         : '',
				lastTime               : 0,
				perfectScrollBarOptions: {
					suppressScrollX   : true,  // 禁用 X 轴的滚动条
					minScrollbarLength: 15  // 最小的滚动条大小
				},   // 滚动条的配置
				scrollData             : [],    // 滚动条位置
				noMore                 : [],    // 消息是否已经全部加载
				newMsg                 : [],    // 是否有新的消息
				chatInfoList           : [],
				timeDivider            : [],
				previewVisible         : false, // 预览是否开启
				previewInfo            : [],    // 预览信息
				previewRelation        : [],    // 预览的消息和 Key 的对应关系
				playAudio              : {
					isPlay  : false,  //  是否在播放
					key     : 0,  // 播放key
					dom     : '', // 播放的dom
					interval: '',
				}, // 播放的音频信息
				playVideo              : {
					isPlay: false,  //  是否在播放
					key   : -1,  // 播放key
					dom   : '', // 播放的dom
				}, // 播放的音频信息
				groupAvatar,
				img2,
				miniApp,
				fileIcon,
				inter                  : 0,
			}
		},
		methods: {
			setUserVisible () {
				let that = this
				clearInterval(this.inter)
				this.inter = setTimeout(function () {
					that.userVisible = false
				}, 500)
			},
			clearInter () {
				clearInterval(this.inter)
			},
			changeUserVisible () {
				this.userName = ''
				this.selectUserList = JSON.parse(JSON.stringify(this.userList))
				this.userVisible = !this.userVisible
			},
			selectUser () {
				if (this.userName == '') {
					this.selectUserList = JSON.parse(JSON.stringify(this.userList))
				} else {
					this.selectUserList = []
					for (let user of this.userList) {
						if (user.name.indexOf(this.userName) > -1) {
							this.selectUserList.push(user)
						}

					}
				}
			},
			changeUser (index) {
				this.activeUser = this.selectUserList[index]
				this.type = 0
				this.lastTime = 0
				this.allChatList = []
				this.userOrChatName = ''
				this.msgType = ''
				this.msgName = ''
				this.sendDate = null
				this.chatList = []
				this.isChatUserLoading = true
				this.isChatListLoading = true
				this.userVisible = false
				this.selectUserList = JSON.parse(JSON.stringify(this.userList))
				let _this = this
				Promise.all([_this.getChatList()]).then(res => {
					_this.$nextTick(() => {
						if (typeof _this.scrollData[_this.activeUser.id + '_' + _this.activeChat] == "undefined") {
							const scrollInfo = {
								first_id    : 0,
								old_first_id: 0,
								last_id     : 0,
								position    : null,
							};

							_this.$set(_this.scrollData, _this.activeUser.id + '_' + _this.activeChat, scrollInfo)
						}
						_this.chatItemLoading = true
						_this.chatInfoList = []
						_this.getChatInfoList()
					})
				}).catch(e => {
				})
			},
			changeMsgType (msgType) {
				if (msgType != this.type) {
					this.type = msgType
					this.lastTime = 0
					this.userOrChatName = ''
					this.msgType = ''
					this.msgName = ''
					this.sendDate = null
					this.chatList = []
					this.allChatList = []
					this.activeChat = 0
					this.isChatUserLoading = true
					this.isChatListLoading = true

					let _this = this
					Promise.all([_this.getChatList()]).then(res => {
						_this.$nextTick(() => {
							if (this.activeChat != 0) {
								if (typeof _this.scrollData[_this.activeUser.id + '_' + _this.activeChat] == "undefined") {
									const scrollInfo = {
										first_id    : 0,
										old_first_id: 0,
										last_id     : 0,
										position    : null,
									};

									_this.$set(_this.scrollData, _this.activeUser.id + '_' + _this.activeChat, scrollInfo)
								}
								_this.chatItemLoading = true
								_this.chatInfoList = []
								_this.getChatInfoList()
							} else {
								this.isChatListLoading = false
								this.chatItemLoading = false
								this.chatInfoList = []
							}
						})
					}).catch(e => {
					})
				}
			},
			changeFileType (type) {
				if (this.msgType != type) {
					this.msgType = type
					this.msgName = ''
					this.lastTime = 0
					this.sendDate = null
					const scrollInfo = {
						first_id    : 0,
						old_first_id: 0,
						last_id     : 0,
						position    : null,
					};
					this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
					this.chatItemLoading = true
					this.chatInfoList = []
					this.getChatInfoList()
				}
			},
			disabledDateDay (current) {
				return current.valueOf() > new Date().getTime()
			},
			findContent () {
				const scrollInfo = {
					first_id    : 0,
					old_first_id: 0,
					last_id     : 0,
					position    : null,
				};
				this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
				this.lastTime = 0
				this.chatItemLoading = true
				this.chatInfoList = []
				this.getChatInfoList()
			},
			clearContent () {
				this.msgName = ''
				this.sendDate = null
				this.lastTime = 0
				const scrollInfo = {
					first_id    : 0,
					old_first_id: 0,
					last_id     : 0,
					position    : null,
				};
				this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
				this.chatItemLoading = true
				this.chatInfoList = []
				this.getChatInfoList()
			},
			changeChat (chatId, chatName) {
				if (this.activeChat != chatId) {
					this.activeChat = chatId
					this.activeChatName = chatName
					this.lastTime = 0
					this.isChatListLoading = true
					this.msgType = ''
					this.msgName = ''
					this.sendDate = null

					if (typeof this.scrollData[this.activeUser.id + '_' + this.activeChat] == "undefined") {
						const scrollInfo = {
							first_id    : 0,
							old_first_id: 0,
							last_id     : 0,
							position    : null,
						};
						this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
					}
					this.chatItemLoading = true
					this.chatInfoList = []
					this.getChatInfoList()
				}
			},
			changeName () {
				let chatList = []
				if (this.type == 0 || this.type == 1) {
					for (let chat of this.allChatList) {
						if (chat.user.name != null && chat.user.name.indexOf(this.userOrChatName) > -1) {
							chatList.push(chat)
						}
					}
				} else if (this.type == 2) {
					for (let chat of this.allChatList) {
						if (chat.chat.indexOf(this.userOrChatName) > -1) {
							chatList.push(chat)
						}
					}
				}

				this.chatList = JSON.parse(JSON.stringify(chatList))
			},
			// 滚动条向上滚动事件
			handlePullOnLoad () {
				const scrollYReach = this.$refs.chat_info_list.$el._ps_.reach.y;
				if (scrollYReach === 'start' && !this.chatItemLoading && !this.noMore[this.activeUser.id + '_' + this.activeChat]) {
					this.chatItemLoading = true;
					this.getChatInfoList();
				}
			},
			// 滚动条滚动到底部事件
			handleInfiniteOnLoad () {
				const scrollYReach = this.$refs.chat_info_list.$el._ps_.reach.y;
				if (scrollYReach === 'end') {
					this.$set(this.newMsg, this.activeUser.id + '_' + this.activeChat, false);
				}
			},
			// 记录最后一次滚动条的位置
			changeScrollPosition (e) {
				if (this.activeChat != 0) {
					this.scrollData[this.activeUser.id + '_' + this.activeChat].position = e.srcElement.scrollTop;
				}

			},
			// 格式化消息时间
			formatMsgTime (time, checkToday = false, format = 'YYYY-MM-DD HH:mm') {
				time = parseInt(time)
				if (checkToday && this.utils.isToday(time)) {
					return moment(time).format('HH:mm');
				}

				return moment(time).format(format);
			},
			// 判断时间线是否显示
			showTimeDivider (msgId, time) {
				time = this.formatMsgTime(time);
				if (this.timeDivider[this.activeUser.id + '_' + this.activeChat]) {
					if (this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.indexOf(time) > -1 && this.timeDivider[this.activeUser.id + '_' + this.activeChat].show[time] !== msgId) {
						return false;
					} else {
						if (this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.indexOf(time) === -1) {
							this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.push(time);
							this.timeDivider[this.activeUser.id + '_' + this.activeChat].show[time] = msgId;
						}

						return true;
					}
				}
			},
			isFromUser (chatItem) {
				return chatItem.from_type == 1 && chatItem.user_id == this.activeUser.id
			},
			getMsgType (chatItem) {
				let contentType = 1
				switch (chatItem.msgtype) {
					case "text":
						contentType = 1

						break
					case "image":
						contentType = 2

						break
					case "video":
						contentType = 3

						break
					case "mixed":
						contentType = 4

						break
					case "weapp":
						contentType = 5

						break
					case "file":
						contentType = 6

						break
					case "revoke":
						contentType = 7

						break
					case "emotion":
						contentType = 8

						break
					case "voice":
						contentType = 9

						break
				}

				return contentType
			},
			initTimeDivider () {
				this.timeDivider[this.activeUser.id + '_' + this.activeChat] = {
					time: [],
					show: []
				}
			},
			initMsgContent (chatItem) {
				let msgContent = '暂不支持的信息'
				switch (chatItem.msgtype) {
					case "text":
						msgContent = this.initTextMsgContent(chatItem.info)

						break
					case "image":
						msgContent = this.initImgMsgContent(chatItem.info)

						break
					case "video":
						msgContent = this.initVideoMsgContent(chatItem.info)

						break
					case "voice":
						msgContent = this.initVoiceMsgContent(chatItem.info)

						break
					case "emotion":
						msgContent = this.initEmotionMsgContent(chatItem.info)

						break
					case "weapp":
						msgContent = this.initWeappMsgContent(chatItem.info)

						break
					case "file":
						msgContent = this.initFileMsgContent(chatItem.info)

						break
					case "revoke":
						msgContent = this.initRevokeMsgContent(chatItem.info)

						break
					case "mixed":
						msgContent = this.initMixedMsgContent(chatItem.info)

						break
					default:
						console.log('暂不支持的【' + chatItem.content + '】信息')

						break
				}

				return msgContent
			},
			initTextMsgContent (content) {
				const _this = this
				content = content.content
				if (content.search(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g) !== -1) {
					WEmoji.wechatEmojiKey.map((alt) => {
						let preg = new RegExp(_this.utils.addslashes(alt), 'g');
						let emojiUrl = WEmoji.getEmojiUrl(alt);
						content = content.replace(preg, "<img src=\"" + emojiUrl + "\" alt=\"" + alt + "\" height=\"21\" width=\"21\"/>")
					});
				}

				return content.replace(/[\r\n|\n]/g, "<br/>");
			},
			// 获取新的大小
			getNewSize (localWidth, localHeight) {
				const maxWidth = 160;
				const maxHeight = 160;
				const maxPreviewWidth = 840;
				const maxPreviewHeight = 600;

				let newWidth = maxWidth;
				let newHeight = maxHeight;
				let newPreviewWidth = maxPreviewWidth;
				let newPreviewHeight = maxPreviewHeight;

				if (parseInt(localHeight) > parseInt(localWidth)) {
					if (parseInt(localHeight) > maxHeight) {
						newWidth = maxHeight * localWidth / localHeight;
					} else {
						newWidth = localWidth;
						newHeight = localHeight;
					}


					if (parseInt(localHeight) > maxPreviewHeight) {
						newPreviewWidth = maxPreviewHeight * localWidth / localHeight;
					} else {
						newPreviewWidth = localWidth;
						newPreviewHeight = localHeight;
					}

					if (newPreviewWidth > maxPreviewWidth) {
						newPreviewWidth = maxPreviewWidth;
						newPreviewHeight = maxPreviewWidth * localHeight / localWidth;
					}
				} else {
					if (parseInt(localWidth) > maxWidth) {
						newHeight = maxWidth * localHeight / localWidth;
					} else {
						newWidth = localWidth;
						newHeight = localHeight;
					}

					if (parseInt(localWidth) > newPreviewWidth) {
						newPreviewHeight = maxPreviewWidth * localHeight / localWidth;
					} else {
						newPreviewWidth = localWidth;
						newPreviewHeight = localHeight;
					}

					if (newPreviewHeight > maxPreviewHeight) {
						newPreviewWidth = maxPreviewHeight * localWidth / localHeight;
						newPreviewHeight = maxPreviewHeight;
					}
				}

				return {
					newWidth        : newWidth,
					newHeight       : newHeight,
					newPreviewWidth : newPreviewWidth,
					newPreviewHeight: newPreviewHeight,
				};
			},
			initImgMsgContent (content) {
				let msgId = 'img-' + content.id
				const {newWidth, newHeight, newPreviewWidth, newPreviewHeight} = this.getNewSize(content.width, content.height)

				content.preview_width = newPreviewWidth
				content.preview_height = newPreviewHeight

				this.initPreviewInfo(msgId, content, 'IMG')

				return '<img class="media-content" src="' + this.$store.state.commonUrl + content.file_path + '" alt="图片" height="' + newHeight + '" width="' + newWidth + '" data-key="' + msgId + '" />'
			},
			getMediaDuration (duration, type = 'video') {
				let minute = Math.floor(duration / 60)
				if (minute < 1) {
					if (type == 'voice') {
						return duration
					} else {
						if (duration < 10) {
							return '00:0' + duration
						} else {
							return '00:' + duration
						}
					}
				}

				let hour = Math.floor(minute / 60)
				if (hour < 1) {
					let second = duration - minute * 60

					if (minute < 10) {
						if (second < 10) {
							if (type == 'voice') {
								return minute + ':0' + second
							} else {
								return '0' + minute + ':0' + second
							}
						} else {
							if (type == 'voice') {
								return minute + ':' + second
							} else {
								return '0' + minute + ':' + second
							}
						}
					} else {
						if (second < 10) {
							return minute + ':0' + second
						} else {
							return minute + ':' + second
						}
					}
				}
			},
			initVideoMsgContent (content) {
				let videoDom = '<div class="wrong-notice">【视频无法加载】</div>'
				if (content.local_path !== '') {
					let msgId = 'video-' + content.id
					// return '<video class="media-content" src="' + this.$store.state.commonUrl + content.local_path + '" height="' + newHeight + '" width="' + newWidth + '" controls />'
					const {newWidth, newHeight, newPreviewWidth, newPreviewHeight} = this.getNewSize(content.width, content.height)

					content.preview_width = newPreviewWidth
					content.preview_height = newPreviewHeight

					this.initPreviewInfo(msgId, content, 'VIDEO');

					videoDom = '<video class="media-content" src="' + this.$store.state.commonUrl + content.local_path + '" preload width="' + newWidth + '" height="' + newHeight + '" data-key="' + msgId + '"></video>' +
						'<div class="media-play-btn">' +
						'<span class="play-btn" data-key="' + msgId + '"></span>' +
						'</div>' +
						'<span class="video-duration" data-key="' + msgId + '">' + this.getMediaDuration(content.play_length) + '</span>'
				}

				return videoDom
			},
			initVoiceMsgContent (content) {
				let voiceDom = '<div class="wrong-notice">【音频无法加载】</div>';
				if (content.local_path !== '') {
					let msgId = 'voice-' + content.id

					const maxWidth = 240
					const minWidth = 75
					let newWidth = content.play_length * maxWidth / 60
					newWidth = newWidth < minWidth ? minWidth : newWidth

					voiceDom = '<div class="voice-box voice-btn" style="width: ' + newWidth + 'px;" data-key="' + msgId + '">' +
						'<div class="voice-symbol voice-btn" data-key="' + msgId + '">' +
						'<span id="voiceCircleFirst' + msgId + '" class="voice-circle first voice-btn" data-key="' + msgId + '"></span>' +
						'<span id="voiceCircleSecond' + msgId + '"  class="voice-circle second voice-btn" data-key="' + msgId + '"></span>' +
						'<span id="voiceCircleThird' + msgId + '"  class="voice-circle third voice-btn" data-key="' + msgId + '"></span>' +
						'</div>'

					voiceDom += '<span class="voice-time voice-btn" data-key="' + msgId + '">' + this.getMediaDuration(content.play_length, 'voice') + '″</span>' +
						'</div>'

					voiceDom += '<audio id="voiceAudio' + msgId + '" preload src="' + this.$store.state.commonUrl + content.local_path + '" style="display: none; "/>'
				}
				return voiceDom
			},
			initEmotionMsgContent (content) {
				return '<img class="emotion-content" src="' + this.$store.state.commonUrl + content.local_path + '" height="' + content.height + '" width="' + content.width + '" />'
			},
			initWeappMsgContent (content) {
				return '<div class="weapp-content">' +
					'<div class="weapp-display-name">' + content.displayname + '</div>' +
					'<div class="weapp-title">' + content.title + '</div>' +
					'<div class="weapp-description">' + content.description + '</div>' +
					'<div class="weapp-footer">' +
					'<img src="' + this.miniApp + '" width="12" height="12" style="margin-right: 5px; vertical-align: middle;"/>' +
					'<span style="vertical-align: middle;">小程序</span>' +
					'</div>' +
					'</div>'
			},
			getDisplayFileSize (fileSize) {
				let kSize = fileSize / 1024
				if (parseInt(kSize) < 1024) {
					return parseInt(kSize) + 'K'
				}

				let mSize = kSize / 1024
				if (parseInt(mSize) < 1024) {
					return mSize.toFixed(2) + 'M'
				}

				let gSize = mSize / 1024
				if (parseInt(gSize) < 1024) {
					return gSize.toFixed(2) + 'G'
				}

				let tSize = gSize / 1024
				return tSize.toFixed(2) + 'T'
			},
			initFileMsgContent (content) {
				return '<div class="file-content">' +
					'<div class="file-info">' +
					'<span style="width: 220px; display: inline-block; height: 40px;">' + content.filename + '</span>' +
					'<span style="font-size: 12px; height: 20px; line-height: 20px; color: #999999; ">' + this.getDisplayFileSize(content.filesize) + '</span>' +
					'</div>' +
					'<img class="file-icon" src="' + fileIcon + '" height="60"/>' +
					'</div>'
			},
			initRevokeMsgContent (content) {
				let dom = '<div class="revoke-box">' +
					'<span style="display: block;">这是一条【撤回】消息，内容如下：</span> ' +
					'<div class="revoke-content">';
				if (typeof content.content !== "undefined" && typeof content.content.msgtype !== "undefined") {
					switch (content.content.msgtype) {
						case "text":
							dom += this.initTextMsgContent(content.content.info)

							break
						case "image":
							dom += this.initImgMsgContent(content.content.info)

							break
						case "video":
							dom += this.initVideoMsgContent(content.content.info)

							break
						case "voice":
							dom += this.initVoiceMsgContent(content.content.info)

							break
						case "weapp":
							dom += this.initWeappMsgContent(content.content.info)

							break
						case "file":
							dom += this.initFileMsgContent(content.content.info)

							break
						case "mixed":
							dom += this.initMixedMsgContent(content.content.info)

							break
					}
				}
				dom += '</div>' +
					'</div>'

				return dom
			},
			initMixedMsgContent (content) {
				let dom = '';
				content.map((item) => {
					switch (item.type) {
						case "text":
							dom += this.initTextMsgContent(item.content)

							break
						case "image":
							dom += this.initImgMsgContent(item.content)

							break
						case "video":
							dom += this.initVideoMsgContent(item.content)

							break
						case "weapp":
							dom += this.initWeappMsgContent(item.content)

							break
						case "file":
							dom += this.initFileMsgContent(item.content)

							break
					}
				})

				return dom
			},
			// 修改滚动条位置
			changeScrollTop (change = false, scrollPosition = null) {
				this.$nextTick(() => {
					if (scrollPosition === null) {
						let msgId = this.scrollData[this.activeUser.id + '_' + this.activeChat].old_first_id != 0 ? this.scrollData[this.activeUser.id + '_' + this.activeChat].old_first_id : this.scrollData[this.activeUser.id + '_' + this.activeChat].last_id;
						if (change) {
							msgId = this.scrollData[this.activeUser.id + '_' + this.activeChat].last_id;
						}

						if (typeof this.$refs[msgId] !== 'undefined') {
							scrollPosition = this.$refs[msgId][0].offsetTop;

							if (msgId !== this.scrollData[this.activeUser.id + '_' + this.activeChat].last_id) {
								scrollPosition -= 24;   // 去除加载动画的高度

								// 当消息被合并的时候，去除时间分割线的高度
								if (this.$refs[msgId][0].childElementCount === 1) {
									scrollPosition -= 56;
								}
							}
						}
					}

					if (typeof this.$refs.chat_info_list !== 'undefined') {
						this.$refs.chat_info_list.$el.scrollTop = scrollPosition;
						this.scrollData[this.activeUser.id + '_' + this.activeChat].position = scrollPosition;
					}
				});
			},
			initPreviewInfo (msgId, content, type) {
				let previewInfo = {};

				switch (type) {
					case 'IMG':
						previewInfo = {
							previewType  : 'IMG',
							previewUrl   : this.$store.state.commonUrl + content.file_path,
							previewAlt   : '图片',
							previewWidth : content.preview_width,
							previewHeight: content.preview_height,
						};

						break;
					case 'VIDEO':
						previewInfo = {
							previewType  : 'VIDEO',
							previewUrl   : this.$store.state.commonUrl + content.local_path,
							previewAlt   : '视频',
							previewWidth : content.preview_width,
							previewHeight: content.preview_height,
						};

						break;
					default:
						break;
				}

				if (typeof this.previewInfo[this.activeUser.id + '_' + this.activeChat] === 'undefined') {
					this.previewInfo[this.activeUser.id + '_' + this.activeChat] = [];
				}

				if (typeof this.previewRelation[this.activeUser.id + '_' + this.activeChat] === 'undefined') {
					this.previewRelation[this.activeUser.id + '_' + this.activeChat] = [];
				}

				if (typeof this.previewRelation[this.activeUser.id + '_' + this.activeChat][msgId] === 'undefined') {
					this.previewInfo[this.activeUser.id + '_' + this.activeChat].push(previewInfo);
					this.previewRelation[this.activeUser.id + '_' + this.activeChat][msgId] = this.previewInfo[this.activeUser.id + '_' + this.activeChat].length - 1;
				} else {
					this.previewInfo[this.activeUser.id + '_' + this.activeChat][this.previewRelation[this.activeUser.id + '_' + this.activeChat][msgId]] = previewInfo;
				}
			},
			// 绑定预览和音频播放暂停事件
			addComment (e) {
				if (e.target.classList.contains('media-content') || e.target.classList.contains('play-btn') || e.target.classList.contains('voice-duration')) {
					this.preview(e);
				}

				if (e.target.classList.contains('voice-btn')) {
					this.voicePlayOrStop(e);
				}
			},
			// 预览方法
			preview (e) {
				this.previewVisible = true;

				this.$nextTick(() => {
					// 默认显示当前选中的资源
					this.$refs.previewCarousel.goTo(this.previewRelation[this.activeUser.id + '_' + this.activeChat][e.target.dataset.key], false);
				});
			},
			// 音频播放和暂停方法
			voicePlayOrStop (e) {
				// 取消语音结束监听
				clearInterval(this.playAudio.interval);

				// 初始化当前的语音信息
				const audioKey = e.target.dataset.key;
				const audioDom = document.getElementById('voiceAudio' + audioKey);
				const cricleFirst = document.getElementById('voiceCircleFirst' + audioKey);
				const cricleSecond = document.getElementById('voiceCircleSecond' + audioKey);
				const cricleThird = document.getElementById('voiceCircleThird' + audioKey);

				// 判断当前是否有语音在播放中
				if (this.playAudio.isPlay) {
					this.playAudio.dom.pause();

					// 判断播放中的语音是否为当前的语音
					if (this.playAudio.key == audioKey) {
						this.playAudio.isPlay = false;
						this.playAudio.key = 0;
						this.playAudio.dom = '';

						cricleFirst.setAttribute("style", "");
						cricleSecond.setAttribute("style", "");
						cricleThird.setAttribute("style", "");
					} else {
						let playCircleFirst = document.getElementById('voiceCircleFirst' + this.playAudio.key)
						if (playCircleFirst != null) {
							playCircleFirst.setAttribute("style", "")
						}

						let playCircleSecond = document.getElementById('voiceCircleSecond' + this.playAudio.key)
						if (playCircleSecond != null) {
							playCircleSecond.setAttribute("style", "")
						}

						let playCircleThird = document.getElementById('voiceCircleThird' + this.playAudio.key)
						if (playCircleThird != null) {
							playCircleThird.setAttribute("style", "")
						}

						this.playAudio.key = audioKey;
						this.playAudio.dom = audioDom;

						cricleFirst.setAttribute("style", "animation: voiceRun1 3s linear infinite;");
						cricleSecond.setAttribute("style", "animation: voiceRun2 3s linear infinite;");
						cricleThird.setAttribute("style", "animation: voiceRun3 3s linear infinite;");

						audioDom.currentTime = 0;
						audioDom.play();
					}
				} else {
					this.playAudio.isPlay = true;
					this.playAudio.key = audioKey;
					this.playAudio.dom = audioDom;

					cricleFirst.setAttribute("style", "animation: voiceRun1 3s linear infinite;");
					cricleSecond.setAttribute("style", "animation: voiceRun2 3s linear infinite;");
					cricleThird.setAttribute("style", "animation: voiceRun3 3s linear infinite;");

					audioDom.currentTime = 0;
					audioDom.play();
				}

				// 监听语音何时播放结束
				if (this.playAudio.isPlay) {
					this.playAudio.interval = setInterval(() => {
						if (this.playAudio.dom.ended) {
							document.getElementById('voiceCircleFirst' + this.playAudio.key).setAttribute("style", "");
							document.getElementById('voiceCircleSecond' + this.playAudio.key).setAttribute("style", "");
							document.getElementById('voiceCircleThird' + this.playAudio.key).setAttribute("style", "");

							this.playAudio.isPlay = false;
							this.playAudio.key = 0;
							this.playAudio.dom = '';

							clearInterval(this.playAudio.interval);
						}
					}, 10);
				}

			},
			// 视频开始播放
			videoPlay (e) {
				const videoDom = e.target;
				const videoKey = videoDom.dataset.key;

				this.playVideo.isPlay = true;
				this.playVideo.key = videoKey;
				this.playVideo.dom = videoDom;
			},
			// 视频暂停播放
			videoPause (e) {
				this.playVideo.isPlay = false;
				this.playVideo.key = -1;
				this.playVideo.dom = '';
			},
			// 视频停止播放
			videoStop () {
				if (this.playVideo.isPlay) {
					this.playVideo.dom.currentTime = 0;
					this.playVideo.dom.pause();
				}
			},
			// 关闭预览窗口
			handleCancel () {
				this.previewVisible = false;
				this.videoStop();
			},
			async getUserList () {
				const {data: res} = await this.axios.post('work-msg-audit/get-permit-user-list', {
					corp_id: this.corpId
				})

				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.activeUser = []
					this.userList = []
					if (res.data.length > 0) {
						res.data.map((user) => {
							this.userList.push({
								avatar: user.avatar,
								name  : user.name,
								id    : user.id,
							})
						})
					}
					this.selectUserList = JSON.parse(JSON.stringify(this.userList))
					if (this.selectUserList.length > 0) {
						this.activeUser = this.selectUserList[0]
					}
				}
			},
			async getChatList () {
				if (this.activeUser.length == 0) {
					this.isChatUserLoading = false
					return false
				}
				const {data: res} = await this.axios.post('work-msg-audit/get-msg-list', {
					corp_id: this.corpId,
					user_id: this.activeUser.id,
					type   : this.type
				})

				if (res.error != 0) {
					this.isChatUserLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.allChatList = res.data
					this.chatList = JSON.parse(JSON.stringify(this.allChatList))
					this.activeChatName = ''
					if (this.chatList.length > 0) {
						this.activeChat = this.type != 2 ? this.chatList[0].chatUserId : this.chatList[0].chat_id
						switch (this.type) {
							case 0:
							case 1:
								this.activeChatName = res.data[0].user.name
								break
							case 2:
								this.activeChatName = res.data[0].chat.length > 0 ? res.data[0].chat : "群聊"
								break
						}
					}
					this.initTimeDivider()
					this.isChatUserLoading = false
				}
			},
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'audit' && data.corp_id) {
					if (data.corp_id == localStorage.getItem('corpId')) {
						let info = data.msg_list
						// 判断 内外部、群聊是否是当前类型
						if (data.msg_type == this.type) {
							// 2 群聊
							if (this.type == 2) {
								// 判断是否是当前会话成员聊天信息
								if (this.content(data.chat_user_id.split(','), this.activeUser.id)) {
									// 判断是否是当前群
									if (info.chat_id == this.activeChat) {
										if (this.msgType == '' || info.msgtype == this.msgType) {
											if (
												!this.sendDate
												||
												this.sendDate.length == 0
												||
												(
													this.formatMsgTime(info.msgtime, false, 'YYYY-MM-DD') > moment(this.sendDate[0]).format('YYYY-MM-DD')
													&&
													this.formatMsgTime(info.msgtime, false, 'YYYY-MM-DD') < moment(this.sendDate[1]).format('YYYY-MM-DD')
												)
											) {
												if (info.msgtype == 'text') {
													if (this.msgName == '' || info.content.indexOf(this.msgName) > -1) {
														this.chatInfoList.push(info)
													}
												} else {
													this.chatInfoList.push(info)
												}
												const scrollInfo = {
													first_id    : this.chatInfoList[this.chatInfoList.length - 1].msgid,
													old_first_id: this.chatInfoList.length > 0 ? this.chatInfoList[this.chatInfoList.length - 1].msgid : 0,
													last_id     : this.chatInfoList[this.chatInfoList.length - 1].msgid,
													position    : null,
												};
												this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
												this.changeScrollTop()
											}
										}
									}
									let index = this.allChatList.findIndex(x => x.chat_id == info.chat_id)
									if (index > -1) {
										this.allChatList[index].msgtime = info.msgtime
										this.allChatList[index].content = decodeURIComponent(info.content)
										let c1 = JSON.parse(JSON.stringify(this.allChatList[index]))
										this.allChatList.splice(index, 1)
										this.allChatList.unshift(c1)
										index = this.chatList.findIndex(x => x.chat_id == info.chat_id)
										if (index > -1) {
											if (this.chatList.findIndex(x => x.chat_id == this.activeChat) < index) {
												let chatListDom = document.getElementsByClassName('chat-list-box')[0]
												if (chatListDom) {
													chatListDom.scrollTop = chatListDom.scrollTop + 55
												}
											}
											this.chatList[index].msgtime = info.msgtime
											this.chatList[index].content = decodeURIComponent(info.content)
											c1 = JSON.parse(JSON.stringify(this.chatList[index]))
											this.chatList.splice(index, 1)
											this.chatList.unshift(c1)
										}
										let time = this.formatMsgTime(info.msgtime);
										if (this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.indexOf(time) === -1) {
											this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.push(time);
											this.timeDivider[this.activeUser.id + '_' + this.activeChat].show[time] = '1';
										}
									} else {
										let chat = {
											chat   : data.chat_name,
											chat_id: info.chat_id,
											content: decodeURIComponent(info.content),
											id     : "",
											msgtime: info.msgtime,
											roomid : info.roomid,
										}
										this.allChatList.unshift(chat)
										if (this.userOrChatName == '' || userInfo.name.indexOf(this.userOrChatName) > -1) {
											this.chatList.unshift(chat)
										}
									}
								}
							} else {
								// 判断是否是当前会话成员聊天信息
								if (info.user_id == this.activeUser.id || info.to_user_id == this.activeUser.id) {
									let id = ''
									if (data.msg_type == 0) {
										id = info.user_id == this.activeUser.id ? info.to_user_id : info.user_id
									} else {
										id = !info.user_id ? info.external_id : info.to_external_id
									}
									let userInfo = info.user_id == this.activeUser.id ? info.to_info : info.from_info
									// 判断是当前的聊天对象信息
									if (this.activeChat == id) {
										if (this.msgType == '' || info.msgtype == this.msgType) {
											if (
												!this.sendDate
												||
												this.sendDate.length == 0
												||
												(
													this.formatMsgTime(info.msgtime, false, 'YYYY-MM-DD') > moment(this.sendDate[0]).format('YYYY-MM-DD')
													&&
													this.formatMsgTime(info.msgtime, false, 'YYYY-MM-DD') < moment(this.sendDate[1]).format('YYYY-MM-DD')
												)
											) {
												if (info.msgtype == 'text') {
													if (this.msgName == '' || info.content.indexOf(this.msgName) > -1) {
														this.chatInfoList.push(info)
													}
												} else {
													this.chatInfoList.push(info)
												}
												let time1 = this.formatMsgTime(info.msgtime);
												if (this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.indexOf(time1) === -1) {
													this.timeDivider[this.activeUser.id + '_' + this.activeChat].time.push(time1);
													this.timeDivider[this.activeUser.id + '_' + this.activeChat].show[time1] = '1';
												}
												const scrollInfo1 = {
													first_id    : this.chatInfoList[this.chatInfoList.length - 1].msgid,
													old_first_id: this.chatInfoList.length > 0 ? this.chatInfoList[this.chatInfoList.length - 1].msgid : 0,
													last_id     : this.chatInfoList[this.chatInfoList.length - 1].msgid,
													position    : null,
												};
												this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo1)
												this.changeScrollTop()
											}
										}
									}
									let index = this.allChatList.findIndex(x => x.chatUserId == id)
									if (index > -1) {
										this.allChatList[index].content = decodeURIComponent(info.content)
										this.allChatList[index].msgtime = info.msgtime
										let c = JSON.parse(JSON.stringify(this.allChatList[index]))
										this.allChatList.splice(index, 1)
										this.allChatList.unshift(c)
										index = this.chatList.findIndex(x => x.chatUserId == id)
										if (index > -1) {
											let chatListDom = document.getElementsByClassName('chat-list-box')[0]
											let obj = document.getElementsByClassName('chat-list-active')[0]
											let currentIndex = this.chatList.findIndex(x => x.chatUserId == this.activeChat)
											if (currentIndex < index) {
												if (chatListDom) {
													if ((currentIndex + 1) * 60 >= chatListDom.clientHeight && currentIndex * 60 <= chatListDom.clientHeight) {

													}
													chatListDom.scrollTop = chatListDom.scrollTop + 60
												}
											} else if (this.chatList.findIndex(x => x.chatUserId == this.activeChat) == index) {
												let clientHeight = window.innerHeight;
												let scrollTop = chatListDom.scrollTop
												let offsetTop = obj.offsetTop;
												let objHeight = obj.offsetHeight;
												if (offsetTop < scrollTop + clientHeight && offsetTop + objHeight > scrollTop) {
													if (chatListDom) {
														chatListDom.scrollTop = 0
													}
												}
											}
											this.chatList[index].msgtime = info.msgtime
											this.chatList[index].content = decodeURIComponent(info.content)
											c = JSON.parse(JSON.stringify(this.chatList[index]))
											this.chatList.splice(index, 1)
											this.chatList.unshift(c)
										}
									} else {
										let chat = {
											chatUserId: id,
											content   : decodeURIComponent(info.content),
											msgtime   : info.msgtime,
											user      : {
												avatar      : userInfo.avatar,
												id          : id,
												name        : userInfo.name,
												thumb_avatar: userInfo.thumb_avatar,
											}
										}
										this.allChatList.unshift(chat)
										if (this.userOrChatName == '' || userInfo.name.indexOf(this.userOrChatName) > -1) {
											this.chatList.unshift(chat)
										}
									}
								}
							}
						}
					}
				}
			},
			content (list, id) {
				for (let i of list) {
					if (i == id) {
						return true
					}
				}
				return false
			},
			async getChatInfoList (needChangeScroller = true) {
				this.chatItemLoading = true
				if (this.activeChat == 0) {
					this.isChatListLoading = false
					this.chatItemLoading = false
					return false
				}
				const {data: res} = await this.axios.post('work-msg-audit/get-msg-content', {
					corp_id    : this.corpId,
					from_id    : this.type == 2 ? this.activeChat : this.activeUser.id,
					to_id      : this.activeChat,
					last_time  : this.lastTime,
					msg_type   : this.msgType,
					search_name: this.msgName,
					start_date : this.sendDate ? (this.sendDate.length > 1 ? moment(this.sendDate[0]).format('YYYY-MM-DD') : '') : '',
					end_date   : this.sendDate ? (this.sendDate.length > 1 ? moment(this.sendDate[1]).format('YYYY-MM-DD') : '') : '',
					type       : this.type
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (res.data.length > 0) {
						const oldFirstId = this.chatInfoList.length > 0 ? this.chatInfoList[0].msgid : 0

						this.initTimeDivider()
						res.data.map((msg) => {
							this.chatInfoList.unshift(msg);
							this.lastTime = msg.msgtime
						})

						const firstId = this.chatInfoList[0].msgid
						const lastIndex = this.chatInfoList.length - 1
						const lastId = this.chatInfoList[lastIndex].msgid

						const scrollInfo = {
							first_id    : firstId,
							old_first_id: oldFirstId,
							last_id     : lastId,
							position    : null,
						};

						this.$set(this.scrollData, this.activeUser.id + '_' + this.activeChat, scrollInfo)
					} else {
						needChangeScroller = false
					}

					this.previewInfo = []
					this.previewRelation = []

					this.$set(this.noMore, this.activeUser.id + '_' + this.activeChat, res.data.length < 15)

					if (needChangeScroller) {
						this.changeScrollTop();
					}
				}

				this.chatItemLoading = false
				this.isChatListLoading = false
			}
			,
		},
		created () {
			// 追加页面的获取消息后的回调
			this.ws.setCallback(this.websocketOnMessage)
			let _this = this
			Promise.all([_this.getUserList()]).then(res => {
				_this.$nextTick(() => {
					Promise.all([_this.getChatList()]).then(res => {
						_this.$nextTick(() => {
							if (typeof _this.scrollData[_this.activeUser.id + '_' + _this.activeChat] == "undefined") {
								const scrollInfo = {
									first_id    : 0,
									old_first_id: 0,
									last_id     : 0,
									position    : null,
								};

								_this.$set(_this.scrollData, _this.activeUser.id + '_' + _this.activeChat, scrollInfo)
							}
							_this.chatItemLoading = true
							_this.getChatInfoList()
						})
					}).catch(e => {
					})
				})
			}).catch(e => {
			})
		}
	}
</script>

<style lang="less" scoped>
	.content-bd {
		top: 43px;
		left: 0;
		right: 0;
		bottom: 0;
		position: absolute;

		.msg-box {
			height: 100%;

			/deep/ .ant-spin-container {
				height: 100%;
			}

			.user-box {
				height: 60px;
				padding: 10px;
			}

			.msg-type-box {
				height: 40px;
				text-align: center;

				.msg-type {
					height: 40px;
					padding: 5px 0;
					line-height: 29px;
					cursor: pointer;
					border-bottom: 1px solid #ECECEC;

					&.msg-type-active {
						cursor: default;
						color: #1890FF;
						font-weight: 700;
						/*border-color: #1890FF;*/
					}
				}
			}

			.chat-list-box {
				top: 150px;
				left: 0;
				right: 0;
				bottom: 0;
				position: absolute;
				overflow-x: hidden;
				overflow-y: auto;

				.chat-list {
					padding: 10px;
					height: 60px;
					border-bottom: 1px solid #ECECEC;
					cursor: pointer;

					&:hover {
						background-color: #FAFAFA;
						border-color: #F5F5F5;
						cursor: default;
					}

					&.chat-list-active {
						color: white;
						background-color: #1890FF;
						border-color: #1890FF;
						cursor: default;

						.chat-right-content {
							color: white !important;
						}
					}

					.chat-left {
						float: left;
						width: 40px;
						height: 40px;

						.chat-img {
							width: 40px;
							height: 40px;
							/*background: #1890FF;*/
						}
					}

					.chat-right {
						float: right;
						width: calc(100% - 50px);
						height: 40px;

						.chat-right-title {
							height: 20px;
							padding-bottom: 5px;

							.chat-name {
								float: left;
								height: 20px;
								font-size: 14px;
								line-height: 20px;
								width: calc(100% - 40px);
								overflow: hidden;
							}

							.chat-time {
								float: right;
								font-size: 12px;
								line-height: 20px;
								width: 40px;
								height: 20px;
								overflow: hidden;
							}
						}

						.chat-right-content {
							color: #999999;
							width: 100%;
							height: 20px;
							padding-top: 5px;

							span {
								font-size: 12px;
								height: 15px;
								line-height: 15px;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								display: block;
							}
						}
					}
				}
			}

			.chat-info-box {
				height: 100%;

				.chat-info-title {
					padding: 10px 10px;
					line-height: 33px;
					height: 53px;
					border-bottom: 1px solid #ECECEC;

					.chat-info-name {
						display: inline-block;
						width: 260px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.msg-type {
						cursor: pointer;
						text-align: center;
					}

					.msg-type-active {
						color: #1890FF;
						font-weight: 700;
					}
				}

				.chat-info-list {
					top: 106px;
					right: 0;
					bottom: 0;
					left: 0;
					position: absolute;
					padding: 10px;
					overflow-x: hidden;
					overflow-y: auto;

					.loading-box,
					.nomore-box {
						text-align: center;
						font-size: 12px;
						color: grey;
						height: 24px;
						display: block;
					}

					.time-divider {
						font-size: 12px;
						color: grey;

						/deep/ .ant-divider-inner-text {
							line-height: 24px;
						}
					}

					.chat-item {
						width: 100%;
						display: inline-block;
						margin: 10px 0;
						float: left;

						.chat-item-img {
							width: 40px;
							height: 40px;
							float: left;
						}

						.content {
							color: black;
							float: left;
							width: auto;
							max-width: 70%;
							margin-left: 10px;
							background-color: #E4E7EB;
							border: 1px solid #E4E7EB;
							border-radius: 5px;

							/deep/ .wrong-notice {
								padding: 10px;
							}

							&.content-1 {
								padding: 10px;
								word-break: normal;
								word-wrap: break-word;
								overflow-wrap: break-word;
							}

							&.content-2 {
								border-color: transparent;
								overflow: hidden;
							}

							&.content-3 {
								padding: 0;
								overflow: hidden;
								position: relative;

								/deep/ .media-content {
									border-radius: 5px;
									display: block;
								}

								/deep/ .media-play-btn {
									width: 40px;
									height: 40px;
									top: 50%;
									left: 50%;
									background: rgba(128, 128, 128, 0.5);
									border: 2px solid white;
									border-radius: 20px;
									margin-top: -20px;
									margin-left: -20px;
									display: block;
									position: absolute;
									cursor: pointer;

									.play-btn {
										width: 0;
										height: 0;
										margin-top: 8px;
										margin-left: 12.34px;
										border-top: 10px solid transparent;
										border-right: 17.32px solid transparent;
										border-bottom: 10px solid transparent;
										border-left: 17.32px solid white;
										display: block;
									}
								}

								/deep/ .video-duration {
									right: 5px;
									bottom: 5px;
									color: white;
									font-size: 12px;
									line-height: 12px;
									display: inline-block;
									position: absolute;
									cursor: pointer;
								}
							}

							&.content-4 {
								max-width: 170px;
								overflow: hidden;
								padding: 5px;

								/deep/ img {
									margin-bottom: 5px;

									&:last-child {
										margin-bottom: 0;
									}
								}

								/deep/ video {
									margin-bottom: 5px;

									&:last-child {
										margin-bottom: 0;
									}
								}

								/deep/ .media-play-btn {
									width: 40px;
									height: 40px;
									top: 50%;
									left: 50%;
									background: rgba(128, 128, 128, 0.5);
									border: 2px solid white;
									border-radius: 20px;
									margin-top: -20px;
									margin-left: -20px;
									display: block;
									position: absolute;
									cursor: pointer;

									.play-btn {
										width: 0;
										height: 0;
										margin-top: 8px;
										margin-left: 12.34px;
										border-top: 10px solid transparent;
										border-right: 17.32px solid transparent;
										border-bottom: 10px solid transparent;
										border-left: 17.32px solid white;
										display: block;
									}
								}
							}

							&.content-5 {
								overflow: hidden;

								/deep/ .weapp-content {
									background-color: white;
									width: 300px;

									.weapp-display-name {
										padding: 10px 10px 5px 10px;
										font-size: 12px;
										line-height: 18px;
										height: 33px;
									}

									.weapp-title {
										padding: 5px 10px 5px 10px;
										word-break: normal;
										word-wrap: break-word;
										overflow-wrap: break-word;
									}

									.weapp-description {
										padding: 5px 10px 10px 10px;
										color: #999999;
										font-size: 12px;
										line-height: 18px;
										word-break: normal;
										word-wrap: break-word;
										overflow-wrap: break-word;
									}

									.weapp-footer {
										padding: 5px 10px;
										border-top: 1px solid #E4E7EB;
										color: #999999;
										font-size: 12px;
										line-height: 18px;
										height: 28px;
									}
								}
							}

							&.content-6 {
								width: 300px;
								padding: 10px;

								/deep/ .file-content {
									.file-info {
										width: 220px;
										height: 60px;
										float: left;
									}

									.file-icon {
										float: right;
									}
								}
							}

							&.content-7 {
								padding: 10px;

								/deep/ .revoke-content {
									background-color: rgba(15, 15, 15, 0.2);
									color: white;
									padding: 5px;

									/deep/ .file-content {
										.file-info {
											width: 200px;
											display: inline-block;

											span {
												color: #FFFFFF !important;
											}
										}

										.file-icon {
											float: right;
										}
									}
								}
							}

							&.content-9 {
								/deep/ .voice-box {
									padding: 6px 11px;
									height: 32px;
									cursor: pointer;
									position: relative;

									.voice-symbol {
										width: 10px;
										height: 10px;
										box-sizing: border-box;
										transform: rotate(135deg);
										overflow: hidden;
										position: relative;
										margin-top: 5px;
										margin-left: 5px;

										.voice-circle {
											border: 2px solid #2390FF;
											border-radius: 50%;
											position: absolute;

											&.first {
												width: 20px;
												height: 20px;
												top: 0;
												left: 0;
											}

											&.second {
												width: 12px;
												height: 12px;
												top: 4px;
												left: 4px;
											}

											&.third {
												border: none;
												width: 4px;
												height: 4px;
												background: #2390FF;
												top: 8px;
												left: 8px;

											}
										}
									}

									.voice-time {
										top: 6px;
										right: 15px;
										bottom: 6px;
										position: absolute;
										display: inline-block;
									}
								}
							}
						}

						&.self {
							float: right;

							.chat-item-img {
								float: right;
							}

							.content {
								float: right;
								margin-left: 0;
								margin-right: 15px;
								background-color: #C6E5FF;
								border-color: #C6E5FF;

								&.content-6 {
									/deep/ .file-content {
										.file-info {
											float: right;
										}

										.file-icon {
											float: left;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
<style lang="less">
	.preview-modal {
		.ant-carousel {
			.slick-slide {
				text-align: center;
				height: auto;
				overflow: hidden;
			}

			.custom-slick-arrow {
				width: 50px;
				height: 50px;
				font-size: 50px;
				color: #545454 !important;
				opacity: 0.3;

				&:before {
					display: none;
				}

				&:hover {
					opacity: 0.5;
				}
			}
		}
	}

	@keyframes voiceRun1 {
		0% {
			border-color: transparent;
		}
		25% {
			border-color: transparent;
		}
		50% {
			border-color: transparent;
		}
		75% {
			border-color: #2390FF;
		}
		100% {
			border-color: transparent;
		}
	}

	@keyframes voiceRun2 {
		0% {
			border-color: transparent;
		}
		25% {
			border-color: transparent;
		}
		50% {
			border-color: #2390FF;
		}
		75% {
			border-color: #2390FF;
		}
		100% {
			border-color: transparent;
		}
	}

	@keyframes voiceRun3 {
		0% {
			background: #2390FF;
			border-color: #2390FF;
		}
		25% {
			background: #2390FF;
			border-color: #2390FF;
		}
		50% {
			background: #2390FF;
			border-color: #2390FF;
		}
		75% {
			background: #2390FF;
			border-color: #2390FF;
		}
		100% {
			background: #2390FF;
			border-color: #2390FF;
		}
	}
</style>