<template>
	<div ref="fansMsgBox" :style="{height: '100% !important'}">
		<a-tabs
				:style="{height: '100%'}"
				:activeKey="activeKey"
				:tabBarStyle="{width: '180px'}"
				tabPosition="left"
				@prevClick="callback"
				@nextClick="callback"
				@tabClick="tabClick">

			<a-tab-pane :key="changeKey">
				<template slot="tab">
					<span style="height: 35px;" class="tabMenu tabMenuBorder" v-has="'fansMsg'">公众号</span>
					<span style="height: 35px;" class="tabMenu" @click="changeType('mini')" v-has="'miniMsg'">小程序</span>
				</template>
			</a-tab-pane>

			<a-tab-pane :key="searchKey">
				<a-select
						slot="tab"
						showSearch
						allowClear
						v-model="searchValue"
						placeholder="搜索公众号"
						:defaultActiveFirstOption="false"
						:showArrow="false"
						style="width: 100%"
						optionFilterProp="children"
						:filterOption="filterOption"
						@change="tabClick">
					<a-select-option v-for="(msgTab, wId) in msgTabList" :value="msgTab.id">{{msgTab.name}}
					</a-select-option>
				</a-select>
			</a-tab-pane>


			<a-tab-pane
					v-for="(msgTab, wId) in msgTabList"
					:key="msgTab.id"
					:style="activeKey == msgTab.id ? 'height: 100%' : ''">
				<span slot="tab">
					<a-avatar :src="msgTab.avatar" shape="square"/>
					{{msgTab.name}}
				</span>

				<div v-if="msgTab.fans_list.length == 0" style="height: 100%; position: relative; ">
					<div style="width: 180px; height: 100%; padding: 10px; border-right: 1px solid #E8E8E8">
						<template>
							<a-empty style="margin-top: 200px; ">
								<span slot="description"> 暂无活跃粉丝 </span>
							</a-empty>
						</template>
					</div>
					<div style="top: 0; right: 0; bottom: 0; left: 180px; position: absolute; ">
						<a-row class="chat-box" :gutter="16">
							<a-col :span="18" class="chat-info-box">
								<a-row class="chat-title">
									<a-col :span="22">
										<span class="fans-nick"></span>
									</a-col>
									<a-col :span="2" class="text-right">
										<a-icon type="user"/>
									</a-col>
								</a-row>

								<a-row class="chat-content">
									<a-col :span="24"></a-col>
								</a-row>

								<a-row class="chat-send-box">
									<a-col :span="24">
										<div class="icon-box">
											<a-icon type="smile" class="icon-btn"/>
											<a-icon type="picture" class="icon-btn"/>
											<a-icon type="paper-clip" class="icon-btn"/>
										</div>
										<div class="send-textarea"></div>

										<div class="send-btn-box float-right">
											<span class="send-notice">按Shift+Enter换行，Enter发送</span>
											<a-button type="primary" size="large" :loading="sending"
											          :disabled="true">
												发送
											</a-button>
										</div>
									</a-col>
								</a-row>
							</a-col>
							<content-msg class="quick-info-box ant-col-6" :sendDisplay="0"
							             @replyMsg="replyMsg"></content-msg>
						</a-row>
					</div>
				</div>

				<a-tabs
						v-if="msgTab.fans_list.length > 0"
						style="height: 100%;"
						:tabBarStyle="{width: '180px', textAlign:'left'}"
						:activeKey="subActiveKey"
						tabPosition="left"
						@prevClick="callback"
						@nextClick="callback"
						@tabClick="subTabClick">

					<a-tab-pane :key="msgTitleKey">
						<span slot="tab">粉丝消息</span>
					</a-tab-pane>

					<a-tab-pane
							v-for="(fans, fId) in msgTab.fans_list"
							:key="fans.openid"
							:style="subActiveKey == fans.openid ? 'height: 100%' : ''"
							:data-fans-id="fans.fans_id"
							:ref="fans.openid">
						<div slot="tab">
							<a-badge class="tab-box" :count="fansUnread[msgTab.id + '_' + fans.fans_id]">
								<a-avatar class="fans-avatar" :src="fans.headerimg" shape="square"/>
								<div class="tab-info">
									<span class="fans-nick">{{fans.remark.length > 0 ? fans.remark + "（" +fans.nickname + "）" : fans.nickname}}</span>
									<span class="tab-notice"
									      v-html="tabText(msgTab.id, fans.fans_id, fans.openid)"></span>
								</div>
							</a-badge>
						</div>

						<a-row v-if="subActiveKey == fans.openid" class="chat-box" :gutter="16">
							<a-col :span="18" class="chat-info-box">
								<a-row class="chat-title">
									<a-col :span="22">
									<span class="fans-nick">
										{{fans.remark.length > 0 ? fans.remark + "（" +fans.nickname + "）" : fans.nickname}}
										<a-icon v-if="fans.sex == 1" type="man"
										        style="font-size: 16px;color: #427EBA;"/>
										<a-icon v-if="fans.sex == 2" type="woman"
										        style="font-size: 16px;color: #ED4997;"/>
									</span>
									</a-col>
									<a-col :span="2" class="text-right">
										<a-icon type="user" @click="toggleProfile" style="cursor: pointer; "/>
									</a-col>
								</a-row>

								<a-card class="profile" v-show="profileShow">
									<template slot="cover">
										<a-row class="profile-cover-box">
											<a-icon class="profile-close-btn" @click="toggleProfile" type="close"/>
											<a-col :span="24">
												<a-avatar
														class="fans-avatar"
														:size="50"
														:src="fans.headerimg"
														shape="square"/>
												<div v-if="fans.sex != 0" class="sex-box"
												     :class="fans.sex==1 ? 'sex-man' : 'sex-woman'">
													<a-icon
															v-if="fans.sex == 1"
															type="man"
															style="font-size: 14px; color: white;"/>
													<a-icon
															v-if="fans.sex == 2"
															type="woman"
															style="font-size: 14px; color: white;"/>
												</div>
											</a-col>
											<a-col :span="24">
												<span class="fans-nickname">{{fans.nickname}}</span>
											</a-col>
										</a-row>
									</template>

									<a-card-meta>
										<template slot="description">
											<div class="profile-info-box">
												<a-row class="profile-row" :gutter="16">
													<a-col :span="7">关注时间：</a-col>
													<a-col :span="17">{{formatSubTime(fans.subscribe_time)}}</a-col>
												</a-row>
												<a-row class="profile-row" :gutter="16">
													<a-col :span="7">备注：</a-col>
													<a-col :span="17">
													<span class="fans-remark"
													      v-show="!remarkVisible && fans.remark.length > 0">{{fans.remark}}</span>
														<span
																class="fans-remark-edit"
																@click="modifyRemark(fans.remark.length)"
																v-show="!remarkVisible">
														<a-icon type="edit" alt=""/>
													</span>
														<a-input-search
																:defaultValue="fans.remark"
																placeholder="输入用户的备注"
																:data-wk="wId"
																:data-k="fId"
																:data-fid="fans.fans_id"
																@search="setRemark"
																@change="remarkChange"
																v-show="remarkVisible"
																:maxLength="10">
														<span slot="suffix">
															<span>{{remarkLength}}</span>/10
														</span>
															<a-button
																	slot="enterButton"
																	:data-wk="wId"
																	:data-k="fId"
																	:data-fid="fans.fans_id"
																	type="primary">
																<a-icon type="check"/>
															</a-button>
														</a-input-search>
													</a-col>
												</a-row>
												<a-row class="profile-row" :gutter="16">
													<a-col :span="7">标签：</a-col>
													<a-col :span="17">
													<span
															class="fans-remark-edit">
														<template v-for="item in hasTagsValue">
															<a-tag>{{item}}</a-tag>
														</template>
														<a-icon type="edit" alt=""
														        @click="showModal"/>
													</span>
													</a-col>
												</a-row>
											</div>
										</template>
									</a-card-meta>
								</a-card>
								<a-modal title="为粉丝增加标签" v-model="visible" @ok="handleOk"
								         :confirmLoading="confirmLoading2" @cancel="cancelVisible" width="800px">
									<p style="color: red;margin-bottom: 10px;">
										最多可再打{{20-tagCheckValue.length}}个标签。</p>
									<a-checkbox-group @change="onChange2" v-model="tagCheckValue">
										<a-row>
											<a-col
													:span="6"
													style="margin-bottom: 10px;"
													v-for="(item,index) in tagsList"
													:key="item.key"
											>
												<a-checkbox :value="item.key" :disabled="disabled[index]">
													{{item.name}}
												</a-checkbox>
											</a-col>
										</a-row>
									</a-checkbox-group>
									<a-input-search
											placeholder="请输入标签（不得超过6个字符）"
											@search="onSearch"
											enterButton="新建"
											v-model="inputValue"
									/>
									<p style="margin: 10px 0;">提示：输入一个标签后，空格后输入下一个标签，每个标签最多6个字</p>
								</a-modal>

								<a-row
										class="chat-content"
										ref="chat_content"
										v-perfect-scroll-bar="perfectScrollBarOptions"
										@ps-scroll-up="handlePullOnLoad"
										@ps-scroll-down="handleInfiniteOnLoad"
										@ps-scroll-y="changeScrollPosition">
									<a-col :span="24">
										<div class="loading-box" v-if="loading">
											<a-spin>
												<a-icon
														slot="indicator"
														type="loading"
														style="font-size: 12px; color: grey; margin-right: 5px; "
														spin/>
											</a-spin>
											<span>正在加载</span>
										</div>
										<div class="nomore-box" v-if="noMore[msgTab.id + '_' + fans.fans_id]">
											<span>无更多消息</span>
										</div>
										<template v-for="msg in msgContent[msgTab.id + '_' + fans.fans_id]">
											<div :id="'contentList' + msg.id" class="chat-content-list"
											     :ref="msg.id">
												<a-divider
														dashed
														class="time-divider"
														v-if="showTimeDivider(msgTab.id, fans.fans_id, msg.id, msg.create_time)">
													{{formatMsgTime(msg.create_time, true)}}
												</a-divider>
												<div class="content">
													<a-avatar
															shape="square"
															v-if="msg.from.type == 1"
															:src="msg.from.data.headerimg" class="float-left"/>
													<a-avatar
															shape="square"
															v-if="msg.from.type == 2"
															:src="msg.from.data.head_img" class="float-right"/>
													<a-avatar
															shape="square"
															v-if="msg.from.type == 3"
															:src="msg.from.data.avatar" class="float-right"/>

													<div
															v-if="msg.from.type == 1"
															:class="'msg-content msg-content-' + msg.type + ' float-left'"
															v-html="initMsgContent(msg.content, msg.type, msg.id)"
															@click="addComment">
													</div>
													<div
															v-if="msg.from.type != 1"
															:class="'msg-content msg-content-' + msg.type + ' float-right'"
															v-html="initMsgContent(msg.content, msg.type, msg.id)"
															@click="addComment">
													</div>
												</div>
											</div>
										</template>
									</a-col>
								</a-row>

								<a-tag
										:visible="newMsg[msgTab.id + '_' + fans.fans_id]"
										class="new-msg-tag"
										color="blue"
										@click="newMsgChange">
									新消息
								</a-tag>

								<a-row class="chat-send-box">
									<a-col :span="24">
										<div class="icon-box">
											<a-popover
													trigger="click"
													overlayClassName="emoji-popover"
													:destroyTooltipOnHide="true"
													v-model="emojiShow">
												<VEmojiPicker
														slot="content"
														:showSearch="false"
														@select="onSelectEmoji"/>
												<a-tooltip placement="top">
													<template slot="title">
														<span>表情</span>
													</template>
													<a-icon type="smile" class="icon-btn" style="cursor: pointer;"/>
												</a-tooltip>
											</a-popover>
											<a-tooltip placement="top">
												<template slot="title">
													<span>图片</span>
												</template>
												<a-icon type="picture" class="icon-btn" @click="selectMaterial(2)"/>
											</a-tooltip>
											<a-tooltip placement="top">
												<template slot="title">
													<span>图文</span>
												</template>
												<a-icon type="paper-clip" class="icon-btn"
												        @click="selectMaterial(1)"/>
											</a-tooltip>
										</div>
										<medium-editor
												ref="send_editor"
												class="send-textarea"
												:data-key="fans.fans_id"
												:data-active-key="msgTab.id"
												:text='valueInput[msgTab.id + "_" + fans.fans_id].input'
												:options="options"
												@editorCreated="editorCreated"
												@edit='changeContentInput'
												custom-tag="div"/>

										<div class="send-btn-box float-right">
											<span class="send-notice">按Shift+Enter换行，Enter发送</span>
											<a-button type="primary" size="large" :loading="sending" @click="reply"
											          :disabled="valueInput[msgTab.id + '_' + fans.fans_id].reply.length == 0 || valueInput[msgTab.id + '_' + fans.fans_id].reply == '\n'"
											          style="font-size: 14px;height: 34px;margin-right: 10px;">
												发送
											</a-button>
										</div>
									</a-col>
								</a-row>
							</a-col>
							<content-msg
									class="quick-info-box ant-col-6"
									:container="() => $refs.fansMsgBox"
									@replyMsg="replyMsg">

							</content-msg>
						</a-row>
					</a-tab-pane>
				</a-tabs>
			</a-tab-pane>
		</a-tabs>

		<a-modal
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

				<div v-for="(preview, key) in previewInfo[activeKey + '_' + fansId]">
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

		<a-modal title="创建快捷回复"
		         :visible="quickVisible"
		         @cancel="handleQuickCancel"
		         @ok="handleQuickOk">
			<div class="quick-body">
				<div class="quick-area">
					<medium-editor
							ref="quick_editor"
							class="quick-textarea"
							:text="quickText.html"
							:options="options"
							@editorCreated="quickEditorCreated"
							@edit='quickChangeContentInput'
							custom-tag="div"/>
					<div class="quick-btn-box">
						<a-popover
								trigger="click"
								overlayClassName="emoji-popover"
								:destroyTooltipOnHide="true"
								v-model="quickEmojiShow">
							<VEmojiPicker
									slot="content"
									:showSearch="false"
									@select="onQuickSelectEmoji"/>
							<a-icon type="smile" class="quick-emoji-btn" style="cursor: pointer;"/>
						</a-popover>
						<span class="quick-notice"><span>{{wordNum}}/500</span>（按Shift+Enter换行）</span>
					</div>
				</div>

				<div class="quick-style">
					<label>选择分类：</label>
					<a-radio-group
							name="radioGroup"
							v-model="quickCheck"
							@change="quickChange">
						<a-radio :value="activeKey">{{quickName}}</a-radio>
						<a-radio :value="0">通用</a-radio>
					</a-radio-group>
				</div>
			</div>
		</a-modal>

		<!-- 选择消息弹窗 -->
		<choose-msg
				:show="chooseMsg"
				:type="chooseMsgType"
				:news_type="1"
				:needConfirm="chooseNeedConfirm"
				:callback="modalVisibleChange" :clearGroup="clearGroup"></choose-msg>
	</div>
</template>

<script>
	import { VEmojiPicker } from "v-emoji-picker";
	import WEmoji from "@/common/js/wechatEmoji.js";
	import moment from 'moment';
	import editor from 'vue2-medium-editor'
	import contentMsg from "@/components/ContentMsg.vue";
	import chooseMsg from "@/components/ChooseMsg.vue";
	import {Icon} from 'ant-design-vue';

	const IconFont = Icon.createFromIconfontCN({
		scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
	});

	export default {
		name      : "fansMsg",
		components: {
			VEmojiPicker,
			'content-msg'  : contentMsg,
			'medium-editor': editor,
			'choose-msg'   : chooseMsg, IconFont
		},
		inject    : ['changeLoading', 'changeType'],
		data () {
			let activeKey = localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				wxId                   : '',    // 公众号唯一 ID
				fansId                 : 0, // 粉丝 ID
				msgFrom                : 2, // 消息发送方 2：公众号、3：客服 默认2
				msgType                : 1, // 消息类型 1：文本、2：图片、3：音频、4：视频、5、图文、6：音乐
				chooseMsgType          : 2, // 消息类型 1：图文、2：图片
				searchKey              : 'search',  // 搜索区域的key
				changeKey              : 'change',  // 切换区域的key
				msgTitleKey            : 'msgTitle',    // 消息标题key
				activeKey              : activeKey,   // 主 tab 的 active key
				subActiveKey           : '1-1', // 副 tab 的 active key
				searchValue            : [],
				msgTabList             : {},    // 消息 tab 的主体数据
				wxLocation             : [],    // 公众号的位置信息
				fansLocation           : [],    // 粉丝的位置信息
				msgContent             : [],    // 消息内容列表
				timeDivider            : [],    // 消息的时间展示项
				fansUnread             : [],    // 粉丝的未读消息数
				chooseMsg              : false, // 附件选择
				chooseNeedConfirm      : false, // 附件选择
				profileShow            : false, // 资料是否显示
				remarkVisible          : false, // 是否限制备注的编辑框
				valueInput             : [],    // 输入框的草稿
				mediumEditor           : {},   // 初始化的 medium-editor
				quickMediumEditor      : {},   // 初始化的快捷回复 medium-editor
				quickModifyMediumEditor: [],   // 初始化的快捷回复编辑框 medium-editor
				quickText              : {
					html: '',
					text: '',
				},   // 初始化的快捷回复的内容
				quickModifyText        : [],   // 初始化的编辑快捷回复的内容
				options                : {
					toolbar    : false,
					placeholder: {
						text       : '请输入……',
						hideOnClick: true
					}
				},  // 输入框的 options
				scrollData             : [],    // 滚动条位置
				emojiShow              : false, // emoji 表情选择框是否显示
				quickEmojiShow         : false, // 快捷回复 emoji 表情选择框是否显示
				quickModifyEmojiShow   : [], // 编辑快捷回复 emoji 表情选择框是否显示
				modifyEmojiIndex       : 0, // 编辑快捷回复 emoji 的编号
				loading                : false, // 消息加载状态
				noMore                 : [],    // 粉丝消息是否已经全部加载
				newMsg                 : [],    // 是否有新的粉丝消息
				perfectScrollBarOptions: {
					suppressScrollX   : true,  // 禁用 X 轴的滚动条
					minScrollbarLength: 15  // 最小的滚动条大小
				},   // 滚动条的配置
				sending                : false, // 发送状态
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
				quickList              : {},    // 快捷回复列表
				quickModify            : [],    // 快捷回复编辑框是否展示
				quickVisible           : false,    // 快捷回复是否开启
				quickCheck             : 0,   // 快速回复的默认选择
				quickName              : '',   // 快速回复的选择名称
				confirmLoading2        : false,//打标签对话框的确认按钮加载
				inputValue             : '',//新建标签输入框值
				tagsList               : [], //标签列表
				tagCheckValue          : [],//该粉丝已有标签
				visible                : false,//打标签对话框的显示与隐藏
				disabled               : [],//禁选标签
				tagsNum                : 0,//该粉丝已有的标签总数量
				tagValue               : [],//标签值
				hasTags                : [],//在别的地方打的已有的标签id
				hasTagsValue           : [],//在别的地方打的已有的标签名称
				remarkLength           : 0,    // 备注长度
				quickModifyWordNum     : [],//修改快捷回复的字数
				wordNum                : 0,//创建快捷回复的字数
				emptyVisible           : false,//暂无快捷回复的显示与隐藏
				emptyVisible2          : false,//通用暂无快捷回复的显示与隐藏
				clearGroup             : true,//是否每次打开都清空分组，恢复默认
			}
		},
		methods   : {
			// 打标签
			showModal () {
				this.getTags();
				this.visible = true;
			},
			//获取标签
			async getTags () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id:localStorage.getItem('wxNum'),
					type: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					this.disabled = []
					if (20 - this.tagCheckValue.length <= 0) {
						for (let i = 0; i < this.tagsList.length; i++) {
							let disabled = true;
							this.disabled.push(disabled);
						}
					} else {
						for (let i = 0; i < this.tagsList.length; i++) {
							let disabled = false;
							this.disabled.push(disabled);
							for (let j = 0; j < this.tagCheckValue.length; j++) {
								if (this.tagCheckValue[j] == this.tagsList[i].key) {
									this.disabled[i] = true
								}
							}
						}
					}
					// console.log(this.disabled, 'disabled11')
				}
			},
			//获取该粉丝已有标签
			async getHasTags () {
				let fans_ids = []
				fans_ids.push(this.fansId)
				this.tagCheckValue = []
				const {data: res} = await this.axios.post("fans/fans-tags", {
					fans_ids: fans_ids
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					res.data.map((x) => {
						this.tagCheckValue.push(x.tags_id)
						this.hasTags.push(x.tags_id)
						this.hasTagsValue.push(x.tag_name)
					})
					this.tagsNum = this.tagCheckValue.length
				}
			},
			handleOk () {
				if (this.tagCheckValue.length == this.tagsNum) {
					this.$message.warning("请选择要打的标签");
				} else {
					this.confirmLoading2 = true;
					this.addTagsMore();
				}
			},
			//批量添加标签
			async addTagsMore () {
				let fans_ids = []
				fans_ids.push(this.fansId)
				const {data: res} = await this.axios.post("fans/give-user-tags", {
					wx_id:localStorage.getItem('wxNum'),
					tag_ids : this.tagCheckValue,
					fans_ids: fans_ids,
					type    : 0
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading2 = false;
				} else {
					this.$message.success(res.error_msg);
					this.visible = false
					this.confirmLoading2 = false;
					this.hasTagsValue = []
					this.getHasTags();
				}
			},
			cancelVisible () {
				this.visible = false
				this.inputValue = ''
				this.tagValue = []
				this.tagCheckValue = []
				this.hasTagsValue = []
				this.getHasTags();
			},
			onChange2 (checkedValues) {
				var temp = [];
				var temparray = [];
				for (var i = 0; i < this.hasTags.length; i++) {
					temp[this.hasTags[i]] = typeof this.hasTags[i];

				}
				for (var i = 0; i < checkedValues.length; i++) {
					var type = typeof checkedValues[i];
					if (!temp[checkedValues[i]]) {
						temparray.push(checkedValues[i]);
					} else if (temp[checkedValues[i]].indexOf(type) < 0) {
						temparray.push(checkedValues[i]);
					}
				}
				// console.log(temparray,'temparray')
				if (20 - checkedValues.length <= 0) {
					this.disabled = []
					for (let i = 0; i < this.tagsList.length; i++) {
						let disabled = true
						this.disabled.push(disabled)
						for (let j = 0; j < temparray.length; j++) {
							if (this.tagsList[i].key == temparray[j]) {
								this.disabled[i] = false
							}
						}
					}
				} else {
					this.disabled = []
					for (let i = 0; i < this.tagsList.length; i++) {
						let disabled = false
						this.disabled.push(disabled)
						for (let k = 0; k < this.hasTags.length; k++) {
							if (this.tagsList[i].key == this.hasTags[k]) {
								this.disabled[i] = true
							}
						}
					}
				}
			},
			//新建标签
			onSearch (value) {
				if (this.tagsList.length >= 100) {
					this.$message.warning("标签数量已超过上限100个，无法创建");
					return false;
				}
				if (value == "") {
					this.$message.warning("不能为空");
					return false;
				} else {
					this.tagValue = []
					for (var i = 0; i < value.split(" ").length; i++) {
						if (value.split(" ")[i].length > 6) {
							this.$message.error("每个标签最多6个字");
							this.inputValue = "";
							return false
						} else if (value.split(" ")[i].length > 0) {
							this.tagValue.push(value.split(" ")[i]);
						}
					}
					if (this.tagsList.length + this.tagValue.length > 100) {
						let a = 100 - this.tagsList.length
						this.$message.error("抱歉，您当前最多只能新建" + a + "个标签，请重新提交");
						this.inputValue = "";
						this.tagValue = []
						return false
					}
					this.addTags();
				}
			},
			//创建标签
			async addTags () {
				const {data: res} = await this.axios.post("tags/tags-create", {
					wx_id:localStorage.getItem('wxNum'),
					tag_name: this.tagValue
				});
				if (res.error != 0) {
					if (res.error_msg == '标签名非法，请注意不能和其他标签重名') {
						this.$message.error('该标签名称与微信标签重复，请手动同步微信标签即可。');
					} else {
						this.$message.error(res.error_msg);
					}
				} else {
					this.$message.success('新建标签成功');
					this.getTags2();
				}
			},
			async getTags2 () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id:localStorage.getItem('wxNum'),
					type: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					if (20 - this.tagCheckValue.length <= 0) {
						for (let i = 0; i < this.tagValue.length; i++) {
							let disabled = true;
							this.disabled.unshift(disabled);
						}
					} else {
						for (let i = 0; i < this.tagValue.length; i++) {
							let disabled = false;
							this.disabled.unshift(disabled);
						}
					}
					this.inputValue = "";
					this.tagValue = []
				}
			},
			changeStore () {
				this.$store.state.wxArr.map((x) => {
					if (this.activeKey == x.wx_id) {
						this.$store.dispatch("changeWxNum", x.wx_id)
						this.$store.commit("changeAuthorizerType", x.authorizer_type)
						this.$store.commit("changeWxNickName", x.nick_name)
					}
				})
			},
			setKeyGetContent (msgTab) {
				let change = false
				if (this.activeKey != msgTab.id) {
					this.activeKey = msgTab.id
					change = true
				}
				this.wxId = msgTab.id
				if (msgTab.fans_list.length > 0) {
					this.subActiveKey = msgTab.fans_list[0].openid
					this.fansId = msgTab.fans_list[0].fans_id

					this.getMsgContent(this.subActiveKey)
				} else {
					this.subActiveKey = 'empty'
				}

				if (change) {
					this.changeStore()
				}
			},
			// 初始化数据
			initData (msgTabList) {
				if (msgTabList.length > 0) {
					this.msgTabList = msgTabList;

					let msgTab = msgTabList[0]

					this.msgTabList.map((msgInfo, key) => {
						this.wxLocation[msgInfo.id] = key;

						if (msgInfo.id == this.activeKey) {
							msgTab = msgInfo
						}

					});

					this.setKeyGetContent(msgTab)
					this.bindFansRelation();

					this.quickCheck = msgTabList[0].id;
					this.quickName = msgTabList[0].name;
				}
			},
			// 初始化消息格式
			initMsgContent (content, type = 1, msgId = null) {
				let msgContent = '';
				switch (type) {
					case 1:
						msgContent = this.initTextMsgContent(content);

						break;
					case 2:
						msgContent = this.initImgMsgContent(content, msgId);

						break;
					case 3:
						msgContent = this.initVoiceMsgContent(content, msgId);

						break;
					case 5:
						msgContent = this.initNewsMsgContent(content);

						break;
					case 4:
					case 7:
						msgContent = this.initVideoMsgContent(content, msgId);

						break;
					case 8:
						msgContent = this.initLocationMsgContent(content);

						break;
					case 9:
						msgContent = this.initLinkMsgContent(content);

						break;
					case 10:
						msgContent = this.initMiniMsgContent(content);

						break;
					default:

						break;
				}

				return msgContent;
			},
			// 初始化文本信息的格式
			initTextMsgContent (content) {
				const _this = this;
				if (content.search(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g) !== -1) {
					WEmoji.wechatEmojiKey.map((alt) => {
						let preg = new RegExp(_this.utils.addslashes(alt), 'g');
						let emojiUrl = WEmoji.getEmojiUrl(alt);
						content = content.replace(preg, "<img src=\"" + emojiUrl + "\" alt=\"" + alt + "\" height=\"21\" width=\"21\"/>")
					});
				}

				return content.replace(/[\r\n|\n]/g, "<br/>");
			},
			initMiniMsgContent (content) {
				return "<span class=\"wrong-notice\">【" + content + "】小程序已发送</span>";
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
			// 初始化图片信息的格式
			initImgMsgContent (content, msgId) {
				let imgDom = '<span class="wrong-notice">【图片无法显示】</span>';
				if (typeof content.local_url !== 'undefined' || typeof content.local_path !== 'undefined') {
					const imgUrl = typeof content.local_url !== 'undefined' ? content.local_url : this.$store.state.commonUrl + content.local_path;
					const {newWidth, newHeight, newPreviewWidth, newPreviewHeight} = this.getNewSize(content.media_width, content.media_height);

					// 图片的展示 DOM
					imgDom = '<img class="media-content" src="' + imgUrl + '" alt="' + content.file_name + '" height="' + newHeight + '" width="' + newWidth + '" data-key="' + msgId + '" />';

					content.preview_width = newPreviewWidth;
					content.preview_height = newPreviewHeight;

					this.initPreviewInfo(msgId, content, 'IMG');
				}

				return imgDom;
			},
			// 初始化语音消息的格式
			initVoiceMsgContent (content, msgId) {
				let voiceDom = '<span class="wrong-notice">【音频无法加载】</span>';
				if (typeof content.local_url !== 'undefined') {
					let voiceTime = 1;
					let durationCount = 0;

					if (typeof content.media_duration.length === 'undefined') {
						durationCount = Object.keys(content.media_duration).length;
					} else {
						durationCount = content.media_duration.length;
					}

					if (durationCount > 0) {
						voiceTime = content.media_duration[2];
						if (parseInt(content.media_duration[1]) !== 0) {
							voiceTime = parseInt(content.media_duration[1]) * 60 + parseInt(content.media_duration[2])
						}
					}

					const maxWidth = 240;
					const mixWidth = 75;
					let newWidth = voiceTime * maxWidth / 60;
					newWidth = newWidth < mixWidth ? mixWidth : newWidth;

					voiceDom = '<div class="voice-box voice-btn" style="width: ' + newWidth + 'px;" data-key="' + msgId + '">' +
						'<div class="voice-symbol voice-btn" data-key="' + msgId + '">' +
						'<span id="voiceCircleFirst' + msgId + '" class="voice-circle first voice-btn" data-key="' + msgId + '"></span>' +
						'<span id="voiceCircleSecond' + msgId + '"  class="voice-circle second voice-btn" data-key="' + msgId + '"></span>' +
						'<span id="voiceCircleThird' + msgId + '"  class="voice-circle third voice-btn" data-key="' + msgId + '"></span>' +
						'</div>';

					voiceDom += '<span class="voice-time voice-btn" data-key="' + msgId + '">' + voiceTime + '″</span>' +
						'</div>';

					voiceDom += '<audio id="voiceAudio' + msgId + '" preload src="' + content.local_url + '" style="display: none; "/>'
				}

				return voiceDom;
			},
			// 初始化视频消息的格式
			initVideoMsgContent (content, msgId) {
				let videoDom = '<span class="wrong-notice">【视频无法加载】</span>';
				if (typeof content.local_url !== 'undefined') {
					const {newWidth, newHeight, newPreviewWidth, newPreviewHeight} = this.getNewSize(content.media_width, content.media_height);

					videoDom = '<video class="media-content" src="' + content.local_url + '" preload width="' + newWidth + '" height="' + newHeight + '" data-key="' + msgId + '"></video>' +
						'<div class="media-play-btn"><span class="play-btn" data-key="' + msgId + '"></span></div>';

					let durationCount = 0;

					if (typeof content.media_duration.length === 'undefined') {
						durationCount = Object.keys(content.media_duration).length
					} else {
						durationCount = content.media_duration.length;
					}

					if (durationCount === 4) {
						videoDom += '<span class="voice-duration" data-key="' + msgId + '">' + content.media_duration[1] + ':' + content.media_duration[2] + '</span>';
					}

					content.preview_width = newPreviewWidth;
					content.preview_height = newPreviewHeight;

					this.initPreviewInfo(msgId, content, 'VIDEO');
				}

				return videoDom;
			},
			// 初始化地理位置消息的格式
			initLocationMsgContent (content) {
				let locationDom = '<span class="wrong-notice">' +
					'<i aria-label="图标: environment" class="anticon anticon-environment" style="color: green; vertical-align: middle; ">' +
					'<svg viewBox="64 64 896 896" data-icon="environment" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">' +
					'<path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>' +
					'</svg>' +
					'</i> ' +
					'<strong style="vertical-align: middle; ">位置信息：</strong>' +
					'<i style="vertical-align: middle; ">' + content.label + '</i>' +
					'</span>';

				return locationDom;
			},
			// 初始化链接消息的格式
			initLinkMsgContent (content) {
				let linkDom = '<a class="link-box" href="' + content.url + '" target="_blank">' +
					'<p class="link-title">' +
					'<i aria-label="图标: link" class="anticon anticon-link" style="color: #1890FF; vertical-align: middle;">' +
					'<svg viewBox="64 64 896 896" data-icon="link" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">' +
					'<path d="M574 665.4a8.03 8.03 0 0 0-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 0 0-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 0 0 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 0 0 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 0 0-11.3 0L372.3 598.7a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z"></path>' +
					'</svg>' +
					'</i> ' +
					'<span style="vertical-align: middle; ">' + content.title + '</span>' +
					'</p>' +
					'<p class="link-description">' + content.description + '</p>' +
					'</a>';

				return linkDom;
			},
			// 初始化预览的数据
			initPreviewInfo (msgId, content, type) {
				let previewInfo = {};

				switch (type) {
					case 'IMG':
						previewInfo = {
							previewType  : 'IMG',
							previewUrl   : typeof content.local_url !== 'undefined' ? content.local_url : this.$store.state.commonUrl + content.local_path,
							previewAlt   : content.file_name,
							previewWidth : content.preview_width,
							previewHeight: content.preview_height,
						};

						break;
					case 'VIDEO':
						previewInfo = {
							previewType  : 'VIDEO',
							previewUrl   : content.local_url,
							previewAlt   : content.file_name,
							previewWidth : content.preview_width,
							previewHeight: content.preview_height,
						};

						break;
					default:
						break;
				}

				if (typeof this.previewInfo[this.activeKey + '_' + this.fansId] === 'undefined') {
					this.previewInfo[this.activeKey + '_' + this.fansId] = [];
				}

				if (typeof this.previewRelation[this.activeKey + '_' + this.fansId] === 'undefined') {
					this.previewRelation[this.activeKey + '_' + this.fansId] = [];
				}

				if (typeof this.previewRelation[this.activeKey + '_' + this.fansId][msgId] === 'undefined') {
					this.previewInfo[this.activeKey + '_' + this.fansId].push(previewInfo);
					this.previewRelation[this.activeKey + '_' + this.fansId][msgId] = this.previewInfo[this.activeKey + '_' + this.fansId].length - 1;
				} else {
					this.previewInfo[this.activeKey + '_' + this.fansId][this.previewRelation[this.activeKey + '_' + this.fansId][msgId]] = previewInfo;
				}
			},
			initNewsMsgContent (content) {
				if (typeof content.article === 'undefined') {
					return '<span class="wrong-notice">【图文无法显示】</span>'
				} else {
					const article = content.article[0]
					const dom = '<a class="new-box" href="' + article.content_source_url + '" target="_blank">' +
						'<img class="new-cover" src="' + this.$store.state.commonUrl + article.thumb_info.local_path + '">' +
						'<div class="new-info-box">' +
						'<p class="new-title">' + article.title + '</p>' +
						'<p class="new-digest">' + article.digest + '</p>' +
						'</div>' +
						'</a>'

					return dom
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
					this.$refs.previewCarousel.goTo(this.previewRelation[this.activeKey + '_' + this.fansId][e.target.dataset.key], false);
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
						document.getElementById('voiceCircleFirst' + this.playAudio.key).setAttribute("style", "");
						document.getElementById('voiceCircleSecond' + this.playAudio.key).setAttribute("style", "");
						document.getElementById('voiceCircleThird' + this.playAudio.key).setAttribute("style", "");

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
			// 选择器第二标签展示
			tabText (activeKey, fansId, tabKey) {
				if (this.subActiveKey != tabKey && typeof this.valueInput[activeKey + '_' + fansId] !== 'undefined' && this.valueInput[activeKey + '_' + fansId].reply.length != 0 && this.valueInput[activeKey + '_' + fansId].reply != '\n') {
					return '<span style="color: red">[草稿]</span>' + this.valueInput[activeKey + '_' + fansId].reply;
				}

				let fansMsgContent = '';
				let lastMsgIndex = -1;
				if (typeof this.msgContent[activeKey + '_' + fansId] === 'undefined' || this.msgContent[activeKey + '_' + fansId].length === 0) {
					fansMsgContent = this.msgTabList[this.fansLocation[activeKey + '_' + fansId].wx_index].fans_list[this.fansLocation[activeKey + '_' + fansId].fans_index].last_content;
					lastMsgIndex = fansMsgContent.length - 1;
				} else {
					fansMsgContent = this.msgContent[activeKey + '_' + fansId];
					lastMsgIndex = fansMsgContent.length - 1;
				}

				if (lastMsgIndex < 0) {
					return ''
				}

				let msgContent = '';

				switch (fansMsgContent[lastMsgIndex].type) {
					case 1:
						msgContent = this.initMsgContent(fansMsgContent[lastMsgIndex].content, fansMsgContent[lastMsgIndex].type);

						break;
					case 2:
						msgContent = '【图片】';

						break;
					case 3:
						msgContent = '【音频】';

						break;
					case 4:
						msgContent = '【视频】';

						break;
					case 5:
						msgContent = '【图文】';

						break;
					case 6:
						msgContent = '【音乐】';

						break;
					case 7:
						msgContent = '【视频】';

						break;
					case 8:
						msgContent = '【位置】';

						break;
					case 9:
						msgContent = '【链接】';

						break;
					default:

						break;
				}
				return msgContent;
			},
			// 获取粉丝消息
			getMsgContent () {
				if (typeof (this.valueInput[this.activeKey + '_' + this.fansId]) == 'undefined') {
					this.$set(this.valueInput, this.activeKey + '_' + this.fansId, {input: '', reply: '', item: ''});
				}
				if (typeof (this.noMore[this.activeKey + '_' + this.fansId]) == 'undefined') {
					this.$set(this.noMore, this.activeKey + '_' + this.fansId, false);
				}
				if (typeof (this.newMsg[this.activeKey + '_' + this.fansId]) == 'undefined') {
					this.$set(this.newMsg, this.activeKey + '_' + this.fansId, false);
				}

				if (typeof (this.msgContent[this.activeKey + '_' + this.fansId]) == 'undefined') {
					this.$set(this.msgContent, this.activeKey + '_' + this.fansId, []);

					this.getMsgContentList();
				} else {
					this.changeScrollTop(false, this.scrollData[this.activeKey + '_' + this.fansId].position);
					this.setNewMsg();
				}
			},
			// 获取最后的文本选择框焦点
			getCursor (self) {
				let sel = getSelection();
				if (!sel) {
					return;
				}
				let node = sel.anchorNode;
				let isIn = false;
				while (node && node.nodeType != node.DOCUMENT_NODE) {
					var cls = node.classList;
					if (cls && (cls.contains("send-textarea") || cls.contains("quick-textarea") || cls.contains("quick-modify-textarea"))) {
						isIn = true;
						break;
					}
					node = node.parentNode
				}
				if (!isIn) return;
				self.lastRange = sel.getRangeAt(0);
				self.lastNode = node;
			},
			// 插入自定义HTML
			insertHTMLCommand (doc, html, domType = 0) {
				if (domType == 0) {
					if (typeof self.lastNode === 'undefined' || !self.lastNode.classList.contains("send-textarea") || self.lastNode.dataset.key != this.fansId) {
						return false;
					}
				} else if (domType == 1) {
					if (typeof self.lastNode === 'undefined' || !self.lastNode.classList.contains("quick-textarea")) {
						return false;
					}
				} else if (domType == 2) {
					if (typeof self.lastNode === 'undefined' || !self.lastNode.classList.contains("quick-modify-textarea")) {
						return false;
					}
				} else {
					return false;
				}

				let range, toReplace, el, fragment, node, lastNode, ecArgs = ['insertHTML', false, html];

				range = self.lastRange;
				toReplace = range.commonAncestorContainer;

				if (editor.MediumEditor.util.isMediumEditorElement(toReplace) && !toReplace.firstChild) {
					range.selectNode(toReplace.appendChild(doc.createTextNode('')));
				} else if ((toReplace.nodeType === 3 && range.startOffset === 0 && range.endOffset === toReplace.nodeValue.length) ||
					(toReplace.nodeType !== 3 && toReplace.innerHTML === range.toString())) {
					// Ensure range covers maximum amount of nodes as possible
					// By moving up the DOM and selecting ancestors whose only child is the range
					while (!editor.MediumEditor.util.isMediumEditorElement(toReplace) &&
					toReplace.parentNode &&
					toReplace.parentNode.childNodes.length === 1 &&
					!editor.MediumEditor.util.isMediumEditorElement(toReplace.parentNode)) {
						toReplace = toReplace.parentNode;
					}
					range.selectNode(toReplace);
				}
				range.deleteContents();

				el = doc.createElement('div');
				el.innerHTML = html;
				fragment = doc.createDocumentFragment();
				while (el.firstChild) {
					node = el.firstChild;
					lastNode = fragment.appendChild(node);
				}
				range.insertNode(fragment);

				// Preserve the selection:
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					range.collapse(true);
					editor.MediumEditor.selection.selectRange(doc, range);
				}

				if (doc.execCommand.callListeners) {
					doc.execCommand.callListeners(ecArgs, true);
				}

				switch (domType) {
					case 0:
						let event = {
							currentTarget: this.mediumEditor.origElements
						}
						this.mediumEditor.events.updateInput(event.currentTarget, event);

						break;
					case 1:
						let quickEvent = {
							currentTarget: this.quickMediumEditor.origElements
						}
						this.quickMediumEditor.events.updateInput(quickEvent.currentTarget, quickEvent);
						this.wordNum = self.lastNode.textContent.length

						break;
					case 2:
						let quickModifyEvent = {
							currentTarget: this.quickModifyMediumEditor[self.lastNode.dataset.key].origElements
						}
						this.quickModifyMediumEditor[self.lastNode.dataset.key].events.updateInput(quickModifyEvent.currentTarget, quickModifyEvent);

						break;
					default:
						break;
				}
			},
			// 插件初始化成功的回调
			editorCreated (mediumEditor) {
				this.mediumEditor = mediumEditor;
				this.mediumEditor.subscribe('editableKeydownEnter', this.editableKeydownEnter);
				this.mediumEditor.subscribe('focus', this.editableFocus);

				delete self.lastRange
				delete self.lastNode
			},
			// 文本域获取焦点
			editableFocus (e) {
				if (e.target.innerHTML === '') {
					e.target.innerHTML = '<p><br/></p>';
				}
			},
			// shift + enter 换行  enter发送
			editableKeydownEnter (event) {
				if (event.shiftKey && event.keyCode === 13) {
					// 换行处理
				} else if (event.keyCode === 13) {
					// 阻断原处理流程
					event.preventDefault();

					// 发送处理
					if (!this.sending && this.valueInput[this.activeKey + '_' + this.fansId].reply.length != 0 && this.valueInput[this.activeKey + '_' + this.fansId].reply != '\n') {
						this.msgType = 1
						this.reply();
					}
				}
			},
			// 编辑框的内容变更事件
			changeContentInput (operation) {
				this.valueInput[operation.api.origElements.dataset.activeKey + '_' + operation.api.origElements.dataset.key].input = operation.api.origElements.innerHTML;
				this.valueInput[operation.api.origElements.dataset.activeKey + '_' + operation.api.origElements.dataset.key].reply = operation.api.origElements.innerText;
			},
			// 初始化时间线
			initTimeDivider (activeKey, fansId) {
				this.timeDivider[activeKey + '_' + fansId] = {
					time: [],
					show: []
				};
			},
			// 格式化消息时间
			formatSubTime (time, format = 'YYYY-MM-DD HH:mm:ss') {
				return moment.unix(time).format(format);
			},
			// 格式化消息时间
			formatMsgTime (time, checkToday = false, format = 'YYYY-MM-DD HH:mm') {
				if (checkToday && this.utils.isToday(time)) {
					return moment(time).format('HH:mm');
				}

				return moment(time).format(format);
			},
			// 判断时间线是否显示
			showTimeDivider (activeKey, fansId, msgId, time) {
				time = this.formatMsgTime(time);
				if (this.timeDivider[activeKey + '_' + fansId].time.indexOf(time) > -1 && this.timeDivider[activeKey + '_' + fansId].show[time] !== msgId) {
					return false;
				} else {
					if (this.timeDivider[activeKey + '_' + fansId].time.indexOf(time) === -1) {
						this.timeDivider[activeKey + '_' + fansId].time.push(time);
						this.timeDivider[activeKey + '_' + fansId].show[time] = msgId;
					}

					return true;
				}
			},
			// 滚动条滚动到底部事件
			handleInfiniteOnLoad () {
				const scrollYReach = this.$refs.chat_content[0].$el._ps_.reach.y;
				if (scrollYReach === 'end') {
					this.$set(this.newMsg, this.activeKey + '_' + this.fansId, false);
				}
			},
			// 滚动条向上滚动事件
			handlePullOnLoad () {
				const scrollYReach = this.$refs.chat_content[0].$el._ps_.reach.y;
				if (scrollYReach === 'start' && !this.loading && !this.noMore[this.activeKey + '_' + this.fansId]) {
					this.loading = true;
					this.getMsgContentList(this.scrollData[this.activeKey + '_' + this.fansId].first_id);
				}
			},
			// 记录最后一次滚动条的位置
			changeScrollPosition (e) {
				this.scrollData[this.activeKey + '_' + this.fansId].position = e.srcElement.scrollTop;
			},
			// 点击新消息
			newMsgChange () {
				this.changeScrollTop(true);
				this.msgRead();
			},
			// 修改滚动条位置
			changeScrollTop (change = false, scrollPosition = null) {
				this.$nextTick(() => {
					if (scrollPosition === null) {
						let msgId = this.scrollData[this.activeKey + '_' + this.fansId].old_first_id != 0 ? this.scrollData[this.activeKey + '_' + this.fansId].old_first_id : this.scrollData[this.activeKey + '_' + this.fansId].last_id;
						if (change) {
							msgId = this.scrollData[this.activeKey + '_' + this.fansId].last_id;
						}

						if (typeof this.$refs[msgId] !== 'undefined') {
							scrollPosition = this.$refs[msgId][0].offsetTop;

							if (msgId !== this.scrollData[this.activeKey + '_' + this.fansId].last_id) {
								scrollPosition -= 24;   // 去除加载动画的高度

								// 当消息被合并的时候，去除时间分割线的高度
								if (this.$refs[msgId][0].childElementCount === 1) {
									scrollPosition -= 56;
								}
							}
						}
					}

					if (typeof this.$refs.chat_content !== 'undefined' && typeof this.$refs.chat_content[0] !== 'undefined') {
						this.$refs.chat_content[0].$el.scrollTop = scrollPosition;
						this.scrollData[this.activeKey + '_' + this.fansId].position = scrollPosition;
					}
				});
			},
			// 是否显示新消息tag
			setNewMsg () {
				this.$nextTick(() => {
					const msgId = this.scrollData[this.activeKey + '_' + this.fansId].last_id;
					const scrollPosition = this.$refs[msgId][0].offsetTop;
					const msgBoxHeight = this.$refs[msgId][0].offsetHeight;
					const contentBoxHeight = this.$refs.chat_content[0].$el.clientHeight;
					if (scrollPosition + msgBoxHeight > contentBoxHeight && this.scrollData[this.activeKey + '_' + this.fansId].position != scrollPosition) {
						let newBoxHeight = 0;
						let hasUnRead = false;
						if (typeof this.fansUnread[this.activeKey + '_' + this.fansId] != 'undefined' && this.fansUnread[this.activeKey + '_' + this.fansId] != 0) {
							hasUnRead = true;
							for (let i = 1; i <= this.fansUnread[this.activeKey + '_' + this.fansId]; i++) {
								let msgCount = this.msgContent[this.activeKey + '_' + this.fansId].length;
								let unReadMsgId = this.msgContent[this.activeKey + '_' + this.fansId][msgCount - i].id;
								newBoxHeight += this.$refs[unReadMsgId][0].offsetHeight;
							}
						} else {
							newBoxHeight = msgBoxHeight
						}

						if (this.$refs.chat_content[0].$el.scrollTop + contentBoxHeight == this.$refs.chat_content[0].$el.scrollHeight || this.$refs.chat_content[0].$el.scrollTop + contentBoxHeight + newBoxHeight == this.$refs.chat_content[0].$el.scrollHeight) {
							this.changeScrollTop(true);
							if (hasUnRead) {
								this.msgRead();
							}
						} else {
							if (hasUnRead) {
								this.$set(this.newMsg, this.activeKey + '_' + this.fansId, true);
							}
						}
					} else {
						this.$set(this.newMsg, this.activeKey + '_' + this.fansId, false);
						this.msgRead();
					}
				});
			},
			// 绑定粉丝的位置关系
			bindFansRelation () {
				let _this = this;
				_this.msgTabList.map((item, wxIndex) => {
					_this.wxLocation[item.id] = wxIndex;

					item.fans_list.map((fans, fansIndex) => {
						_this.fansLocation[item.id + '_' + fans.fans_id] = {
							wx_index  : wxIndex,
							fans_index: fansIndex,
						};
					});
				});
			},
			// 搜索公众号的过滤条件
			filterOption (input, option) {
				return (
					option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
				);
			},
			// 修改粉丝备注
			modifyRemark (length) {
				this.remarkVisible = !this.remarkVisible;
				this.remarkLength = length;
			},
			// 显示隐藏用户资料
			toggleProfile () {
				this.profileShow = !this.profileShow;
				this.hasTagsValue = []
				if (this.profileShow) {
					this.getHasTags();
				}
			},
			// tab的上下单击事件
			callback (val) {
				console.log(val)
			},
			// tab 点击
			tabClick (key) {
				let ignoreKey = [this.searchKey, this.changeKey]

				if (typeof key !== 'undefined' && ignoreKey.indexOf(key) == -1 && key != this.activeKey) {
					this.activeKey = key;
					this.wxId = key;
					this.quickCheck = key;
					this.quickName = this.msgTabList[this.wxLocation[key]].name;
					this.profileShow = false;
					if (this.searchValue != this.quickCheck) {
						this.searchValue = []
					}

					if (this.msgTabList[this.wxLocation[key]].fans_list.length > 0) {
						const subKey = this.msgTabList[this.wxLocation[key]].fans_list[0].openid;
						const subFansId = this.msgTabList[this.wxLocation[key]].fans_list[0].fans_id;
						this.subTabClick(subKey, subFansId)

						if (typeof this.scrollData[subFansId] !== 'undefined') {
							this.changeScrollTop(false, this.scrollData[subFansId].position);
						}
					} else {
						this.subActiveKey = 'empty';
					}

					this.changeStore()
				}
			},
			// subtab的点击
			subTabClick (key, fansId = null) {
				if (key != this.msgTitleKey && key != 'empty' && key != this.subActiveKey) {
					this.subActiveKey = key;
					this.fansId = fansId === null ? this.$refs[key][0].$attrs['data-fans-id'] : fansId;
					this.profileShow = false;
					this.getMsgContent();
				}
			},

			// 打开快捷回复的添加modal
			openQuick () {
				this.quickVisible = true;

				this.$nextTick(() => {
					this.$refs.quick_editor.$el.focus()
				});
			},
			// 新建快捷回复的插件初始化成功的回调
			quickEditorCreated (mediumEditor) {
				this.quickMediumEditor = mediumEditor;
				this.quickMediumEditor.subscribe('editableKeydownEnter', this.quickEditableKeydownEnter);
				this.quickMediumEditor.subscribe('focus', this.editableFocus);
				this.quickMediumEditor.subscribe('editablePaste', this.quickEditablePaste);

				delete self.lastRange
				delete self.lastNode
			},
			// 新建快捷回复 shift + enter 换行
			quickEditableKeydownEnter (event) {
				if (event.shiftKey && event.keyCode === 13) {
					// 换行处理
				} else if (event.keyCode === 13) {
					// 阻断原处理流程
					event.preventDefault();
				}
			},
			//监听粘贴事件
			quickEditablePaste () {
				this.quickInvlideText()
			},
			quickInvlideText () {
				const customNode = this.$refs.quick_editor.$el
				const {startNode, startOffset, endNode, endOffset} = this.global.getRangeInfo(customNode, 500);

				if (typeof startNode.nodeValue !== 'undefined') {
					let newRange = document.createRange()
					newRange.setStart(startNode, startOffset);
					newRange.setEnd(endNode, endOffset);
					// let newSelection = window.getSelection();
					// newSelection.removeAllRanges();
					// newSelection.addRange(newRange)
					newRange.deleteContents()

					this.quickText.html = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.quickText.text = self.lastNode.innerText

					this.wordNum = 500
				}
			},
			// 新建快捷回复的编辑框的内容变更事件
			quickChangeContentInput (operation) {
				this.wordNum = self.lastNode.textContent.length
				if (this.wordNum <= 500) {
					this.quickText.html = operation.api.origElements.innerHTML;
					this.quickText.text = operation.api.origElements.innerText;
				} else {
					this.quickInvlideText();
				}
			},
			// 取消快捷回复
			handleQuickCancel () {
				this.quickVisible = false;
				this.quickText = {html: '', text: ''};
			},
			// 保存快捷回复
			handleQuickOk () {
				this.quickSave();
				this.handleQuickCancel();
			},
			// 修改快捷回复emoji的显示与否的参数
			toggleQuickDialogEmoji () {
				this.quickEmojiShow = !this.quickEmojiShow;
			},
			// 选择快捷回复emoji表情的事件
			onQuickSelectEmoji (dataEmoji) {
				const dom = this.quickMediumEditor.options.ownerDocument;
				if (this.wordNum <= 498) {
					this.insertHTMLCommand(dom, dataEmoji.data, 1);
				}
				// Optional
				this.toggleQuickDialogEmoji();
			},
			// 快捷回复的选项修改
			quickChange (e) {
				this.quickCheck = e.target.value;
			},

			// 选中快捷回复
			quickInput (qid) {
				const quickRefKey = 'quickContent' + qid;
				this.valueInput[this.activeKey + '_' + this.fansId].input = this.$refs[quickRefKey][0].innerHTML;
				this.valueInput[this.activeKey + '_' + this.fansId].reply = this.$refs[quickRefKey][0].innerText;
			},
			// 通过快捷回复发送消息
			quickSend (qid) {
				this.quickInput(qid)
				if (!this.sending) {
					this.msgType = 1
					this.reply();
				}
			},
			// 编辑快捷回复
			openQuickModify (qid, lindex, qindex) {
				const quickModifyInfo = {
					html: "<p>" + this.quickList[lindex][qindex].content.replace(/[\r|\n]/g, "<br/>") + "</p>",
					text: this.quickList[lindex][qindex].content
				}
				this.$set(this.quickModifyText, qid, quickModifyInfo);
				this.$set(this.quickModify, qid, true);
			},
			// 快捷回复的插件初始化成功的回调
			quickModifyEditorCreated (mediumEditor) {
				this.quickModifyMediumEditor[mediumEditor.origElements.dataset.key] = mediumEditor;
				this.quickModifyMediumEditor[mediumEditor.origElements.dataset.key].subscribe('editableKeydownEnter', this.quickEditableKeydownEnter);
				this.quickModifyMediumEditor[mediumEditor.origElements.dataset.key].subscribe('focus', this.editableFocus);
				this.quickModifyMediumEditor[mediumEditor.origElements.dataset.key].subscribe('editablePaste', this.quickModifyEditablePaste(mediumEditor.origElements.dataset.key));

				delete self.lastRange
				delete self.lastNode
			},
			//监听粘贴事件
			quickModifyEditablePaste (key) {
				this.quickModifyInvlideText(key)
			},
			quickModifyInvlideText (key) {
				const customNode = this.quickModifyMediumEditor[key].origElements
				const {startNode, startOffset, endNode, endOffset} = this.global.getRangeInfo(customNode, 500);

				if (typeof startNode.nodeValue !== 'undefined') {
					let newRange = document.createRange()
					newRange.setStart(startNode, startOffset);
					newRange.setEnd(endNode, endOffset);
					// let newSelection = window.getSelection();
					// newSelection.removeAllRanges();
					// newSelection.addRange(newRange)
					newRange.deleteContents()
					this.quickModifyText[key].html = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.quickModifyText[key].text = self.lastNode.innerText

					this.quickModifyWordNum[key] = 500
				}
			},
			// 快捷回复的编辑框的内容变更事件
			quickModifyChangeContentInput (operation) {
				let key = operation.api.origElements.dataset.key
				if (operation.api.origElements.innerText == '\n') {
					operation.api.origElements.innerText = ''
				}
				this.$set(this.quickModifyWordNum, key, operation.api.origElements.innerText.length)
				if (this.quickModifyWordNum[key] <= 500) {
					this.quickModifyText[key].html = operation.api.origElements.innerHTML;
					this.quickModifyText[key].text = operation.api.origElements.innerText;
				} else {
					this.quickModifyInvlideText(key)
				}
			},
			// 修改快捷回复编辑的emoji选中index
			modifyEmojiClick (index) {
				this.modifyEmojiIndex = index;
			},
			// 修改快捷回复emoji的显示与否的参数
			toggleQuickModifyDialogEmoji () {
				this.$set(this.quickModifyEmojiShow, this.modifyEmojiIndex, !this.quickModifyEmojiShow[this.modifyEmojiIndex])
			},
			// 选择快捷回复emoji表情的事件
			onQuickModifySelectEmoji (dataEmoji) {
				const dom = this.quickModifyMediumEditor[this.modifyEmojiIndex].options.ownerDocument;
				if (this.quickModifyWordNum[self.lastNode.dataset.key] <= 498) {
					this.insertHTMLCommand(dom, dataEmoji.data, 2);
				}
				// Optional
				this.toggleQuickModifyDialogEmoji();
			},
			// 快捷回复的编辑取消
			cancelQuickModify (qid) {
				this.$set(this.quickModify, qid, false);
				this.quickText = {html: '', text: ''};
			},
			// 快捷回复编辑回复
			quickModifySave (qid, lindex, qindex) {
				this.quickText = {
					html: this.quickModifyText[qid].html,
					text: this.quickModifyText[qid].text,
				}

				if (lindex == 'public') {
					lindex = 0
				}
				this.quickSave(qid, lindex, qindex);
				this.cancelQuickModify(qid);
			},

			// 修改emoji的显示与否的参数
			toggleDialogEmoji () {
				this.emojiShow = !this.emojiShow;
			},
			// 选择emoji表情的事件
			onSelectEmoji (dataEmoji) {
				const dom = this.mediumEditor.options.ownerDocument;
				this.insertHTMLCommand(dom, dataEmoji.data);
				// Optional
				this.toggleDialogEmoji();
			},
			// 打开选择素材的对话框
			selectMaterial (type) {
				this.chooseMsgType = type;

				if (this.chooseMsgType == 2) {
					this.chooseNeedConfirm = true
				} else {
					this.chooseNeedConfirm = false
				}

				this.chooseMsg = true;
			},
			// 素材选择后的回调
			modalVisibleChange (event, e, id, item) {
				if (event == "ok") {
					if (typeof item.artList !== 'undefined' && item.artList.length > 0) {
						this.msgType = 5
					} else {
						this.msgType = 2
					}

					this.valueInput[this.activeKey + '_' + this.fansId].reply = id
					this.valueInput[this.activeKey + '_' + this.fansId].item = item

					this.getOneMaterial(id)
				}

				this.chooseMsg = false;
			},
			//根据组件返回的id获取单个素材信息
			async getOneMaterial (id) {
				const {data: res} = await this.axios.post("material/upload-media", {
					wx_id        : localStorage.getItem('wxNum'),
					attachment_id: id
				});
				if (res.error == 0) {
					this.reply();
				} else {
					this.$message.error(res.error_msg);
				}
			}
			,
			// 消息回复成功回调
			replySuccess (msgId, replyData) {
				let content;
				switch (replyData.msg_type) {
					case 1:
						content = replyData.msg_content.text

						break;
					case 2:
						const imgList = this.valueInput[this.activeKey + '_' + this.fansId].item
						content = {
							local_path  : imgList.local_path,
							media_width : imgList.file_width,
							media_height: imgList.file_height,
						}

						break;
					case 3:
						const local_url = this.valueInput[this.activeKey + '_' + this.fansId].local_url;
						const media_duration = this.valueInput[this.activeKey + '_' + this.fansId].media_duration;
						content = {
							local_url     : local_url,
							media_duration: media_duration,
						}

						break;
					case 4:
						const video_local_url = this.valueInput[this.activeKey + '_' + this.fansId].local_url;
						const video_media_duration = this.valueInput[this.activeKey + '_' + this.fansId].media_duration;
						content = {
							local_url     : video_local_url,
							media_duration: video_media_duration,
						}

						break;
					case 5:
						const artList = this.valueInput[this.activeKey + '_' + this.fansId].item.artList[0]
						content = {
							article: [
								{
									thumb_info        : {
										local_path: artList.local_path
									},
									title             : artList.title,
									digest            : artList.digest,
									content_source_url: artList.content_source_url,
								}
							]
						}
						break;
					case 10:
						content = this.valueInput[this.activeKey + '_' + this.fansId].item.file_name;

						break;
					default:
						break;
				}

				this.msgType = 1
				this.$set(this.valueInput, this.activeKey + '_' + this.fansId, {input: '', reply: '', item: ''});

				let msgData = {
					id         : msgId,
					from       : {
						type: 2,
						data: {
							alias    : '',
							user_name: this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].id,
							nick_name: this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].name,
							head_img : this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].avatar,
						}
					},
					to         : {
						type: 1,
						data: {
							fans_id  : this.fansId,
							openid   : this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].fans_list[this.fansLocation[this.activeKey + '_' + this.fansId].fans_index].openid,
							nickname : this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].fans_list[this.fansLocation[this.activeKey + '_' + this.fansId].fans_index].nickname,
							remark   : this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].fans_list[this.fansLocation[this.activeKey + '_' + this.fansId].fans_index].remark,
							headerimg: this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].fans_list[this.fansLocation[this.activeKey + '_' + this.fansId].fans_index].headerimg,
						}
					},
					content    : content,
					type       : replyData.msg_type,
					create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
				};

				this.scrollData[this.activeKey + '_' + this.fansId].last_id = msgId;
				this.msgContent[this.activeKey + '_' + this.fansId].push(msgData);

				if (this.fansLocation[this.activeKey + '_' + this.fansId].fans_index != 0) {
					let fansInfo = this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].fans_list[this.fansLocation[this.activeKey + '_' + this.fansId].fans_index];
					this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].fans_list.splice(this.fansLocation[this.activeKey + '_' + this.fansId].fans_index, 1);
					this.msgTabList[this.fansLocation[this.activeKey + '_' + this.fansId].wx_index].fans_list.unshift(fansInfo);

					this.bindFansRelation();
				}

				this.initTimeDivider(this.activeKey, this.fansId);

				this.changeScrollTop(true);
			},
			// websocket获取到新消息的处理
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'chat' && (!data.hasOwnProperty('msg_type') || data.msg_type == 'wx')) {
					let initContent = false;
					// 将新获取的消息插入到消息数据中
					if (typeof this.msgContent[data.wx_id + '_' + data.from] == 'undefined') {
						this.msgContent[data.wx_id + '_' + data.from] = [];
						initContent = true;
					}

					if (typeof this.scrollData[data.wx_id + '_' + data.from] == 'undefined') {
						this.scrollData[data.wx_id + '_' + data.from] = {
							first_id    : 0,
							old_first_id: 0,
							last_id     : 0,
							position    : null,
						};
					}

					let currentContent = this.msgContent[data.wx_id + '_' + data.from];
					let content = currentContent.concat(data.msg_list);
					this.$set(this.msgContent, data.wx_id + '_' + data.from, content);

					this.initTimeDivider(data.wx_id, data.from);

					this.scrollData[data.wx_id + '_' + data.from].last_id = data.msg_list.id;
					if (this.scrollData[data.wx_id + '_' + data.from].first_id == 0) {
						this.scrollData[data.wx_id + '_' + data.from].first_id = this.scrollData[data.wx_id + '_' + data.from].last_id;
					}

					if (initContent) {
						this.getMsgContentList(data.msg_list.id, 14, false, data.wx_id, data.from);
					}

					// 将不再会话的粉丝插入回话
					if (typeof this.fansLocation[data.wx_id + '_' + data.from] == 'undefined') {
						this.msgTabList[this.wxLocation[data.wx_id]].fans_list.unshift(data.fans_info);

						this.bindFansRelation();
					} else if (this.fansLocation[data.wx_id + '_' + data.from].fans_index != 0) {
						let fansInfo = this.msgTabList[this.fansLocation[data.wx_id + '_' + data.from].wx_index].fans_list[this.fansLocation[data.wx_id + '_' + data.from].fans_index];
						this.msgTabList[this.fansLocation[data.wx_id + '_' + data.from].wx_index].fans_list.splice(this.fansLocation[data.wx_id + '_' + data.from].fans_index, 1);
						this.msgTabList[this.fansLocation[data.wx_id + '_' + data.from].wx_index].fans_list.unshift(fansInfo);

						this.bindFansRelation();
						// 不改变active会话的scrollTop
						this.changeScrollTop(false, this.scrollData[this.activeKey + '_' + this.fansId].position);
					}

					// 非active的对话，添加未读数的徽标
					if (this.subActiveKey != data.fans_info.openid) {
						let unreadNum = 0;
						if (typeof this.fansUnread[data.wx_id + '_' + data.from] != 'undefined') {
							unreadNum = ++this.fansUnread[data.wx_id + '_' + data.from];
						} else {
							unreadNum = 1;
						}

						this.$set(this.fansUnread, data.wx_id + '_' + data.from, unreadNum);
					} else {
						this.setNewMsg();
					}
				}
			},
			// 备注的输入框变化
			remarkChange (e) {
				this.remarkLength = e.target.value.length;
			},
			// 获取粉丝消息初始数据
			async getMsgList () {
				let params = localStorage.getItem('isMasterAccount') == 1 ? {} : {sub_id: localStorage.getItem('sub_id')}
				const {data: res} = await this.axios.post("fans/msg-list", params);
				if (res.error == 0) {
					this.changeLoading();
					this.initData(res.data);
				} else {
					this.changeLoading();
					this.$message.error(res.error_msg);
				}
			},
			// 获取商家的快捷回复
			async getQuickList () {
				let that = this
				that.emptyVisible = false
				that.emptyVisible2 = false
				const {data: res} = await this.axios.post("quick-msg/get");

				if (res.error == 0) {
					res.data.map((info) => {
						let quickKey = info.wx_id.length > 0 ? info.wx_id : 'public';

						if (typeof that.quickList[quickKey] === 'undefined') {
							that.quickList[quickKey] = [];
						}

						that.quickList[quickKey].push(info);
						that.$set(that.quickModify, info.id, false);

						const quickModifyInfo = {
							html: info.content.replace(/[\r|\n]/g, "<br/>"),
							text: info.content
						}
						that.$set(that.quickModifyText, info.id, quickModifyInfo);
						that.$set(that.quickModifyEmojiShow, info.id, false);
					});
					if (typeof that.quickList[that.activeKey] == 'undefined' || that.quickList[that.activeKey].length == 0) {
						that.emptyVisible = true
					}
					if (typeof that.quickList.public == 'undefined' || that.quickList.public.length == 0) {
						that.emptyVisible2 = true
					}
					that.$forceUpdate()
				} else {
					that.$message.error(res.error_msg);
				}
			},
			// 获取粉丝消息列表
			async getMsgContentList (lastId = 0, msgSize = 15, needChangeScroller = true, wxId = null, fansId = null) {
				if (wxId === null) {
					wxId = this.wxId;
				}

				if (fansId === null) {
					fansId = this.fansId;
				}

				let getData = {
					wx_id   : wxId,
					fans_id : fansId,
					last_id : lastId,
					msg_size: msgSize
				};

				const {data: res} = await this.axios.post('fans-msg/get-msg-list', getData);
				if (res.error == 0) {
					if (res.data.msg_list.length > 0) {
						const msgFansId = res.data.fans_id;
						const activeKey = res.data.wx_id
						const currentContent = this.msgContent[activeKey + '_' + msgFansId];
						const oldFirstId = currentContent.length > 0 ? currentContent[0].id : 0;

						const _this = this;
						res.data.msg_list.map((msg) => {
							_this.msgContent[activeKey + '_' + msgFansId].unshift(msg);
						});

						this.initTimeDivider(activeKey, msgFansId);

						const firstId = this.msgContent[activeKey + '_' + msgFansId][0].id;
						const lastIndex = this.msgContent[activeKey + '_' + msgFansId].length - 1;
						const lastId = this.msgContent[activeKey + '_' + msgFansId][lastIndex].id;

						if (res.data.unread != 0) {
							if (this.subActiveKey != this.msgTabList[this.fansLocation[activeKey + '_' + msgFansId].wx_index].fans_list[this.fansLocation[activeKey + '_' + msgFansId].fans_index].openid) {
								this.$set(this.fansUnread, activeKey + '_' + msgFansId, res.data.unread);
							} else {
								this.msgRead(msgFansId);
							}
						}

						const scrollInfo = {
							first_id    : firstId,
							old_first_id: oldFirstId,
							last_id     : lastId,
							position    : null,
						};

						this.$set(this.scrollData, activeKey + '_' + msgFansId, scrollInfo);
					} else {
						needChangeScroller = false
					}

					if (res.data.msg_list.length < msgSize) {
						this.$set(this.noMore, res.data.wx_id + '_' + res.data.fans_id, true);
					}

					if (needChangeScroller) {
						this.changeScrollTop();
					}
				} else {
					this.$message.error("获取失败");
				}

				this.loading = false;
				this.changeLoading();
			},
			//消息回复之内容引擎
			async replyMsg (type, content, item) {
				if (content == '') {
					this.$message.error("回复内容不可为空！");
				}
				let replyData = {
					wx_id      : this.wxId,
					fans_id    : this.fansId,
					from       : this.msgFrom,
					msg_content: {},
					msg_type   : this.msgType,
				};
				switch (type) {
					case 1:
						replyData.msg_content = {
							text: content
						};
						break;
					case 2:
						let _this = this
						this.$confirm({
							title  : '确定选择这个吗？',
							content: h => h('div',
								[
									h('img', {
										attrs: {
											src: this.$store.state.commonUrl + content
										},
										style: {
											maxWidth : '100%',
											maxHeight: '300px',
											marginTop: '10px'
										}
									})
								]),
							onOk () {
								_this.msgType = 2;
								_this.valueInput[_this.activeKey + '_' + _this.fansId].reply = item.id
								_this.valueInput[_this.activeKey + '_' + _this.fansId].item = item
								_this.uploadMedia({
									wx_id        : localStorage.getItem('wxNum'),
									attachment_id: item.id
								}, item.id)
							},
							onCancel () {
								_this.showVisible = true;
							},
							class  : 'choose-confirm-modal',
						});
						break;
					case 3:
						let that = this
						this.$confirm({
							title  : '确定选择这个吗？',
							content: h => h('div',
								[
									h('img', {
										attrs: {
											src: this.$store.state.commonUrl + content
										},
										style: {
											maxWidth : '100%',
											maxHeight: '300px',
											marginTop: '10px'
										}
									})
								]),
							onOk () {
								that.msgType = 5;
								that.valueInput[that.activeKey + '_' + that.fansId].item = item
								that.uploadMedia({
									wx_id        : localStorage.getItem('wxNum'),
									attachment_id: item.id
								}, item.id)
							},
							onCancel () {
								that.showVisible = true;
							},
							class  : 'choose-confirm-modal',
						});
						break;
				}
				if (type == 1) {
					this.sendMsg(replyData);
				}

				if (type == 4) {
					//音频
					this.msgType = 3;
					this.valueInput[this.activeKey + '_' + this.fansId].item = item
					this.uploadMedia({
						wx_id        : localStorage.getItem('wxNum'),
						attachment_id: item.id
					}, item.id)
				}
				if (type == 5) {
					//视频
					this.msgType = 4;
					this.uploadMedia({
						wx_id        : localStorage.getItem('wxNum'),
						attachment_id: item.id
					}, item.id)
				}
				if (type == 6) {
					//小程序
					this.msgType = 10;
					if (item.attach_id == null) {
						this.$message.error("当前小程序不合法，请重新选择");
						return false;
					}
					this.valueInput[this.activeKey + '_' + this.fansId].item = item
					this.uploadMedia({
						wx_id        : localStorage.getItem('wxNum'),
						attachment_id: item.attach_id
					}, item.attach_id, item.appId, item.appPath, item.file_name)
				}

			},
			async sendMsg (replyData) {
				const {data: res} = await this.axios.post('fans-msg/send', replyData);
				if (res.error == 0 && res.data.status) {
					this.replySuccess(res.data.status, replyData);
				} else {
					this.msgType = 1
					this.$message.error(res.data.error_info.errmsg);
				}
			},
			async uploadMedia (uploadData, id, appid = 0, pagepath = '', title = '') {
				const {data: result} = await this.axios.post('material/upload-media', uploadData);
				if (result.error == 0) {
					let replyData = {
						wx_id      : this.wxId,
						fans_id    : this.fansId,
						from       : this.msgFrom,
						msg_content: {},
						msg_type   : this.msgType,
					};
					if (this.msgType == 3 || this.msgType == 4) {
						this.valueInput[this.activeKey + '_' + this.fansId].local_url = result.data[id].local_url;
						this.valueInput[this.activeKey + '_' + this.fansId].media_duration = result.data[id].media_duration;
					}
					if (this.msgType == 10) {
						replyData.msg_content = {
							media_id: result.data[id].id,
							appid   : appid,
							pagepath: pagepath,
							title   : title
						};
					} else {
						replyData.msg_content = {media_id: result.data[id].id};
					}
					this.sendMsg(replyData);
				} else {
					this.$message.error(result.error_msg)
				}
			},
			// 消息回复
			async reply () {
				this.sending = true;
				let textValue = ''

				if (typeof this.valueInput[this.activeKey + '_' + this.fansId].reply === 'number') {
					textValue = this.valueInput[this.activeKey + '_' + this.fansId].reply
				} else {
					textValue = this.valueInput[this.activeKey + '_' + this.fansId].reply.replace(/(^\s*)|(\s*$)/g, "")
				}
				if (textValue.length == 0 || !/[^\n]/g.test(textValue)) {
					this.$message.error("回复内容不可为空！");
				} else {
					let replyData = {
						wx_id      : this.wxId,
						fans_id    : this.fansId,
						from       : this.msgFrom,
						msg_content: {},
						msg_type   : this.msgType
					};
					switch (this.msgType) {
						case 1:
							replyData.msg_content = {
								text: this.valueInput[this.activeKey + '_' + this.fansId].reply
							};
							break;
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
							replyData.msg_content = {
								media_id: this.valueInput[this.activeKey + '_' + this.fansId].reply
							};
							break;
					}
					const {data: res} = await this.axios.post('fans-msg/send', replyData);
					if (res.error == 0 && res.data.status) {
						this.replySuccess(res.data.status, replyData);
					} else {
						this.msgType = 1
						this.$message.error(res.data.error_info.errmsg);
					}
				}

				this.sending = false;
			},
			// 点开对话框，阅读粉丝信息，修改粉丝的未读数。
			async msgRead (fansId = null) {
				if (fansId === null) {
					fansId = this.fansId;
				}
				const {data: res} = await this.axios.post('fans-msg/msg-read', {
					fans_id: fansId,
					wx_id:localStorage.getItem('wxNum')
				});
				if (res.error == 0 && res.data.status) {
					this.$set(this.fansUnread, this.activeKey + '_' + this.fansId, 0);
				}
			},
			// 创建或者修改快捷回复
			async quickSave (qId = null, qWxId = null, qindex = null) {
				let textValue = this.quickText.text.replace(/(^\s*)|(\s*$)/g, "")
				if (textValue.length == 0 || !/[^\n]/g.test(textValue)) {
					this.$message.error("快捷回复内容不可为空！");
				} else {
					let saveData = {
						q_id   : qId,
						content: this.quickText.text,
						q_wx_id: typeof qWxId === 'object' ? this.quickCheck : qWxId,
						wx_id:localStorage.getItem('wxNum')
					};

					const {data: res} = await this.axios.post('quick-msg/save', saveData);

					if (res.error == 0) {
						let quickKey = res.data.wx_id.length > 0 ? res.data.wx_id : 'public';

						let customQuick = [res.data];
						if (typeof this.quickList[quickKey] !== 'undefined') {
							customQuick = this.quickList[quickKey];

							if (typeof qindex === 'object') {
								customQuick.unshift(res.data);
							} else {
								customQuick[qindex] = res.data;
							}

							delete this.quickList[quickKey];
						}

						this.$set(this.quickList, quickKey, customQuick);
						this.$set(this.quickModify, res.data.id, false);

						const quickModifyInfo = {
							html: res.data.content.replace(/[\r|\n]/g, "<br/>"),
							text: res.data.content
						};
						this.$set(this.quickModifyText, res.data.id, quickModifyInfo);
						this.$set(this.quickModifyEmojiShow, res.data.id, false);
					} else {
						this.$message.error(res.error_msg);
					}
				}
			},
			// 删除快捷回复
			async quickDel (qid, qIndex, index) {
				let that = this
				const {data: res} = await this.axios.post('quick-msg/delete', {q_id: qid});

				if (res.error == 0) {
					// let customQuick = this.quickList[qIndex];
					// customQuick.splice(index, 1);
					//
					// delete this.quickList[qIndex];
					//
					// this.$set(this.quickList, qIndex, customQuick);
					// this.quickModify.splice(qid, 1);
					// this.quickModifyText.splice(qid, 1);
					// this.quickModifyEmojiShow.splice(qid, 1);
					that.quickList = []
					that.getQuickList()

					that.$message.success('删除成功！');
				} else {
					that.$message.error(res.error_msg);
				}
			},
			// 设置用户昵称
			async setRemark (remark, e) {
				if (this.msgTabList[e.target.dataset.wk].fans_list[e.target.dataset.k].remark != remark) {
					let postData = {
						fans_id: e.target.dataset.fid,
						remark : remark,
						wx_id:localStorage.getItem('wxNum')
					};
					const {data: res} = await this.axios.post('fans/set-remark', postData);

					if (res.error == 0) {
						this.msgTabList[e.target.dataset.wk].fans_list[e.target.dataset.k].remark = remark
						this.remarkVisible = !this.remarkVisible;
					} else {
						this.$message.error(res.error_msg);
					}
				} else {
					this.remarkVisible = !this.remarkVisible;
					return false;
				}
			},
		},
		created () {
			this.getMsgList();
			this.getQuickList();

			// 追加粉丝消息页面的获取消息后的回调
			this.ws.setCallback(this.websocketOnMessage)

			const _this = this
			document.addEventListener('selectionchange', function () {
				_this.getCursor(self);
			});
			var dom = document.getElementsByClassName('quick-info-box')
		}
	}
</script>

<style lang='less' scoped>
	/deep/ .ant-badge-count {
		top: 3px !important;
	}

	.tab-box {
		height: 34px;
		display: block;

		.fans-avatar {
			width: 32px;
			height: 32px;
		}

		.tab-info {
			top: 0;
			right: 0;
			bottom: 0;
			left: 40px;
			position: absolute;

			span {
				padding: 5px 0 0 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: block;

				&.fans-nick {
					font-size: 14px;
					line-height: 14px;
				}

				&.tab-notice {
					font-size: 12px;
					line-height: 20px;
					height: 25px;
					color: grey;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				&:first-child {
					padding-top: 0.5px;
				}
			}
		}
	}

	.chat-box {
		margin: 0 !important;
		height: 100%;

		.chat-info-box {
			top: 0;
			left: 0;
			bottom: 0;
			border-right: 1px solid rgb(232, 232, 232);
			position: absolute;

			.chat-title {
				background: #EAEAEA;
				font-size: 20px;
				height: 50px;
				padding: 10px;
				margin: 0 -8px;

				.fans-nick {
					line-height: 30px;
				}
			}

			.profile {
				width: 350px;
				height: 350px;
				top: 60px;
				right: 10px;
				position: absolute;
				background: white;
				z-index: 99999;
				box-shadow: 0.3px 0.3px 1px #CCC;
				overflow-y: auto;

				/deep/ .ant-card-body {
					padding: 24px !important;
				}

				.profile-cover-box {
					background: #FAFAFA;
					text-align: center;
					position: relative;

					.profile-close-btn {
						top: 10px;
						right: 10px;
						position: absolute;
						cursor: pointer;
						z-index: 999;
					}

					.fans-avatar {
						margin-top: 30px;
					}

					.sex-box {
						width: 20px;
						height: 20px;
						border-radius: 50%;
						top: 62px;
						left: 182px;
						position: absolute;

						&.sex-man {
							background: blue;
						}

						&.sex-woman {
							background: pink;
						}
					}

					.fans-nickname {
						margin: 15px auto;
						display: inline-block;
					}
				}

				.profile-info-box {
					width: 100%;

					.profile-row {
						margin-bottom: 10px;

						.fans-remark {
							padding-right: 5px;
						}

						.fans-remark-edit {
							cursor: pointer;
						}

						&:last-child {
							margin-bottom: 0;
						}
					}
				}
			}

			.chat-content {
				top: 50px;
				right: 0;
				bottom: 208px;
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

				.chat-content-list {
					width: 100%;
					padding: 10px 0;
					display: block;

					.time-divider {
						font-size: 12px;
						color: grey;

						/deep/ .ant-divider-inner-text {
							line-height: 24px;
						}
					}

					.content {
						width: 100%;
						display: inline-block;

						.msg-content {
							max-width: 70%;
							min-height: 32px;
							margin: 0 10px;
							color: #000000;
							background-color: white;
							border: 1px solid #E5E5E5;
							border-radius: 5px;
							vertical-align: top;
							position: relative;

							&-1 {
								padding: 8px 11px;
								word-break: normal;
								word-wrap: break-word;
								overflow-wrap: break-word;

								/deep/ img {
									vertical-align: middle;
								}

								&:before {
									position: absolute;
									left: -12px;
									top: 9px;
									width: 0;
									height: 0;
									content: '';
									border-color: transparent #E9E9E9 transparent transparent;
									border-style: solid;
									border-width: 6px;
								}

								&:after {
									position: absolute;
									left: -9px;
									top: 10px;
									width: 0;
									height: 0;
									content: '';
									border-color: transparent #FFF transparent transparent;
									border-style: solid;
									border-width: 5px;
								}
							}

							/deep/ .wrong-notice {
								padding: 8px 11px;
								word-break: normal;
								word-wrap: break-word;
								overflow-wrap: break-word;
								display: inline-block;
							}

							/deep/ .voice-box {
								padding: 6px 11px;
								height: 32px;
								cursor: pointer;

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

							/deep/ .media-content {
								border-radius: 5px;
								display: block;
							}

							/deep/ img,
							/deep/ video {
								&.media-content {
									cursor: pointer;
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

							/deep/ .voice-duration {
								right: 5px;
								bottom: 5px;
								color: white;
								font-size: 12px;
								line-height: 12px;
								display: inline-block;
								position: absolute;
								cursor: pointer;
							}

							/deep/ .link-box {
								text-decoration: none;

								.link-title {
									font-size: 18px;
									line-height: 27px;
									padding: 15px 15px 0 15px;
									color: black;
									margin: 0;
								}

								.link-description {
									font-size: 14px;
									line-height: 21px;
									padding: 15px;
									color: #BFBFBF;
									margin: 0;
								}
							}

							/deep/ .new-box {
								width: 300px;
								border-radius: 5px;
								overflow: hidden;
								display: block;
								background: white;

								.new-cover {
									width: 300px;
									height: 150px;
								}

								.new-info-box {
									.new-title {
										font-size: 18px;
										line-height: 27px;
										padding: 0;
										color: black;
										margin: 10px 15px;
										word-break: break-all;
										white-space: normal;
										letter-spacing: 2px;
										text-overflow: -o-ellipsis-lastline;
										overflow: hidden;
										text-overflow: ellipsis;
										-webkit-line-clamp: 2;
										-webkit-box-orient: vertical;
										display: -webkit-box;
									}

									.new-digest {
										font-size: 14px;
										line-height: 21px;
										padding: 0;
										color: #BFBFBF;
										margin: 0 15px 10px;
										word-break: break-all;
										white-space: normal;
										letter-spacing: 2px;
										text-overflow: -o-ellipsis-lastline;
										overflow: hidden;
										text-overflow: ellipsis;
										-webkit-line-clamp: 3;
										-webkit-box-orient: vertical;
										display: -webkit-box;
									}
								}
							}
						}

						.float-right {
							&.msg-content {
								background-color: #A9EA67;
								border-color: #7ED321;

								&.msg-content-1 {
									&:before {
										left: initial;
										right: -12px;
										border-color: transparent transparent transparent #7ED322;
									}

									&:after {
										right: -9px;
										left: initial;
										border-color: transparent transparent transparent #B8E986;
									}
								}

							}
						}
					}
				}
			}

			.new-msg-tag {
				right: 15px;
				bottom: 215px;
				position: absolute;
			}

			.chat-send-box {
				right: 0;
				bottom: 0;
				left: 0;
				height: 208px;
				position: absolute;

				.icon-box {
					background: white;
					font-size: 18px;
					padding: 10px;
					height: 44px;

					.icon-btn {
						margin-right: 10px;
						width: 18px;
						height: 18px;
					}
				}

				.send-textarea {
					border: none;
					height: 110px;
					resize: none;
					background-color: #FFFFFF;
					overflow: hidden auto;
					padding: 0 10px 10px 10px;

					&:focus {
						outline: none;
					}

					/deep/ p {
						margin: 0;
					}
				}

				.send-btn-box {
					padding: 10px 0;

					.send-notice {
						color: grey;
						margin-right: 15px;
					}

					&.float-right {
						float: right;
					}
				}
			}
		}

		.quick-info-box {
			top: 0;
			right: 0;
			bottom: 0;
			position: absolute;

			.quick-title-box {
				height: 42px;
				padding: 10px;

				.quick-title {
					display: inline-block;
					float: left;
				}

				.quick-btn {
					display: inline-block;
					float: right;
					cursor: pointer;
					margin-top: 3.5px;
				}
			}

			.quick-text-box {
				background: white;
				margin: 0 -10px 20px -10px;
				position: relative;
				cursor: pointer;

				p {
					margin: 0;
					padding: 10px;
					white-space: normal;
					word-break: normal;
					word-wrap: break-word;
				}

				.quick-btn {
					position: absolute;
					top: 0;
					right: 0;
					display: none;

					.quick-btn-item {
						background-color: rgba(0, 0, 0, 0.8);
						color: white;
						padding: 5px;
						display: inline-block;
						margin-left: 5px;
						font-size: 14px;
						line-height: 14px;
						width: 24px;
						height: 24px;
						cursor: pointer;
					}
				}

				&:hover {
					.quick-btn {
						display: block;
					}
				}

				.quick-modify-area {
					.quick-modify-textarea {
						height: 100px;
						overflow: hidden auto;
						padding: 10px;

						&:focus {
							outline: none;
						}

						/deep/ p {
							margin-bottom: 0;
						}
					}

					.quick-modify-btn-box {
						height: 30px;
						display: block;
						margin: 10px;

						.quick-modify-emoji-btn {
							font-size: 16px;
							margin-top: 4px;
						}

						.quick-modify-btn {
							display: inline-block;
							float: right;

							button {
								margin-left: 5px;

								&:first-child {
									margin: 0;
								}
							}
						}
					}
				}
			}

			.quick-tabs {
				left: 8px;
				right: 8px;
				top: 42px;
				bottom: 0;
				position: absolute;

				/deep/ .ant-tabs-card {
					.ant-tabs-content {
						top: 56px;
						bottom: 0;
						height: auto;
						padding-bottom: 0;
						overflow-y: auto;
						position: absolute;

						.ant-tabs-tabpane {
							padding: 16px;
						}
					}

					.ant-tabs-bar {
						border-bottom: 1px solid #E0E0E0;

						.ant-tabs-tab {
							border-color: transparent;
							background: transparent;
							max-width: 60%;
						}

						.ant-tabs-tab-active {
							border-color: #E0E0E0;
							background: #F1F1F1;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
		}
	}

	/deep/ .ant-tabs-nav {
		width: 100%;
	}

	.quick-body {
		.quick-area {
			border: 1px solid #E2E2E2;

			.quick-textarea {
				height: 200px;
				overflow-y: auto;
				overflow-x: hidden;
				padding: 5px;

				&:focus {
					outline: none;
				}
			}

			.quick-btn-box {
				height: 30px;
				display: block;

				.quick-emoji-btn {
					font-size: 20px;
					margin-top: 5px;
					margin-left: 10px;
				}

				.quick-notice {
					color: grey;
					height: 30px;
					font-size: 15px;
					line-height: 30px;
					float: right;
					display: inline-block;
					margin-right: 10px;
				}
			}
		}

		.quick-style {
			height: 30px;
			font-size: 14px;
			line-height: 30px;
			margin-top: 15px;
		}
	}

	.little-notice {
		font-size: 12px;
		color: grey;
	}

	/deep/ .ant-tabs-tab {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/deep/ .ant-input-affix-wrapper .ant-input-suffix {
		right: 5px;
	}

	/deep/ .ant-input:not(:last-child) {
		padding-right: 50px;
	}
</style>
<style lang="less">
	.emoji-popover {
		.ant-popover-inner-content {
			padding: 0;

			.emoji {
				height: 40px !important;
				width: 40px !important;
				font-size: 20px;
			}
		}
	}

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