<template>
	<div class="template-list list">
		<div id="components-layout-demo-basic" v-if="this.$store.state.wxArr.length !=0">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<span v-show="typeof urlId == 'undefined'">新建</span>
						<span v-show="typeof urlId != 'undefined'">编辑</span>
						模板消息
						<a-button type="primary" icon="rollback" @click="goBack" style="float: right;margin-top: 9px;">
							返回列表
						</a-button>
					</a-layout-header>
					<a-layout class="fans-content">
						<!-- 左侧 -->
						<a-layout-sider>
							<div style="border:1px solid #E2D6D6;margin:auto;height:100%;width:100%;background:#FAFAFA;box-sizing: content-box;overflow-y: auto;">
								<img src="../../../assets/wxHeader.png" alt
								     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
								<div class="msg_content_body" v-show="templateVisible">
									<h3>{{templateData.title}}</h3>
									<div v-for="(item,index) in templateData.data" style="margin: 5px 0px;">
										<span>{{item.start.value}}{{item.title}}{{item.end.value}}</span>
										<span class="item-info" v-html="textAreaValue[index]"
										      :style="{color: fc(index)}"></span>
									</div>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- 公众号选择 -->
								<div class="content-hd" v-if="$store.state.wxArr.length > 1">
									<a-form>
										<a-form-item label="选择公众号" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
											<template>
												<div style="display: inline-block;cursor: pointer;" @click="add">
													<a-avatar shape="square" :size="40" :src="avatarImg"
													          style="margin: 0 15px;"/>
													<span>{{$store.state.wxNickName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
													        v-if="typeof urlId=='undefined'"/>
												</div>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</template>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd">
									<a-form>
										<!-- 消息名称 -->
										<a-form-item label="消息名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
										             style="padding-top: 15px;">
											<a-input style="width: calc(100% - 60px)" v-model="msg_title"
											         @blur="changeMsgTitle"
											         placeholder="请填写消息名称（仅供备注，不会发送给粉丝），限20字符"
											         :maxLength="20"/>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{msg_title.length}} / 20</span>
										</a-form-item>
										<!-- 选择模板 -->
										<a-form-item label="选择模板" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
											<a-select v-model="templateName" style="width: 200px"
											          @change="selectTemplate" placeholder="请选择模板">
												<a-select-option :value="item.id" v-for="item in templateList">
													{{item.title}}
												</a-select-option>
											</a-select>
											<a-tooltip placement="top" style="margin-left: 10px;">
												<template slot="title">
													<span>（当某模板ID的字段牵涉到第三方信息时，不建议使用该模板消息进行群发，如含有会员卡卡号、当前余额、当前积分等变量字段。 ）</span>
												</template>
												<a-icon type="question-circle"/>
											</a-tooltip>
											<div class="content-msg" style="margin-bottom: 15px;font-size: 12px;">
												<p style="margin-bottom: 2px;line-height: 20px;">
													1、在
													<a style="text-decoration: underline;"
													   href="https://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm2-login&lang=zh_CN"
													   target="_blank">微信公众平台</a>
													开通模板功能。
													<a style="text-decoration: underline;"
													   href="https://support.qq.com/products/104790/faqs/57453"
													   target="_blank">教程</a>
												</p>
												<p style="margin-bottom: 2px;line-height: 20px;">
													2、若这里尚未有你想要的模板，登录
													<a style="text-decoration: underline;"
													   href="https://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm2-login&lang=zh_CN"
													   target="_blank">微信公众平台</a>
													，根据行业添加模板消息即可。
												</p>
												<p style="margin-bottom: 2px;line-height: 20px;">3、模板内容可按“回车键”换行</p>
											</div>
											<div class="changeType" v-show="templateVisible">
												<a-row :gutter="[16,0]" v-for="(item,index) in templateData.data">
													<a-col :span="5" style="text-align: right;" v-if="item.show == 1">
														<a-popover trigger="click"
														           v-show="item.type == 1 || item.type == 3">
															<a-input slot="content"
															         v-model="item.start.value"></a-input>
															<a-icon type="edit"/>
															<span v-show="item.start.value != ''"
															      style="display: inline-block;width: calc(100% - 70px);overflow: hidden;vertical-align: bottom;white-space: nowrap;text-overflow: ellipsis;">{{item.start.value}}</span>
														</a-popover>
														{{item.title}}
														<a-popover trigger="click"
														           v-show="item.type == 2 || item.type == 3">
															<a-input slot="content"
															         v-model="item.end.value"></a-input>
															<a-icon type="edit"/>
															<span v-show="item.end.value != ''"
															      style="display: inline-block;width: calc(100% - 70px);overflow: hidden;vertical-align: bottom;white-space: nowrap;text-overflow: ellipsis;">{{item.end.value}}</span>
														</a-popover>
													</a-col>
													<a-col :span="5" style="text-align: right;" v-if="item.show == 0">
														<a-popover trigger="click"
														           v-show="item.type == 1 || item.type == 3">
															<a-input slot="content"
															         v-model="item.start.value"></a-input>
															<a-icon type="edit"/>
															<span v-show="item.start.value != ''"
															      style="display: inline-block;width: calc(100% - 70px);overflow: hidden;vertical-align: bottom;white-space: nowrap;text-overflow: ellipsis;">{{item.start.value}}</span>
														</a-popover>
														<a-popover trigger="click"
														           v-show="item.type == 2 || item.type == 3">
															<a-input slot="content"
															         v-model="item.end.value"></a-input>
															<a-icon type="edit"/>
															<span v-show="item.end.value != ''"
															      style="display: inline-block;width: calc(100% - 70px);overflow: hidden;vertical-align: bottom;white-space: nowrap;text-overflow: ellipsis;">{{item.end.value}}</span>
														</a-popover>
													</a-col>
													<a-col :span="19">
														<div class="item-list">
															<div style="float: left;width: 70%;">
																<div style="border: 1px solid #D9D9D9;margin: 10px 0;width: 100%;">
																	<medium-editor ref="medium_editor"
																	               class="content-editable"
																	               :text="textAreaValue[index]"
																	               :options="options"
																	               @edit="changeContentInput"
																	               :style="{color: fc(index)}"
																	               custom-tag="div"
																	               @editorCreated="editorCreated"
																	               :data-key="emojiShow[index].keyVal"/>
																</div>
																<div style="padding: 0 15px;">
																	<div style="margin-right: 15px;float: right;">
																		{{wordNum[index]}}/{{wordLimit[index]}}
																	</div>
																	点击插入：
																	<a-button class="ant-tag ant-tag-orange"
																	          size="small"
																	          @click="addTag(index)">粉丝昵称
																	</a-button>
																	<a-popover trigger="click"
																	           :destroyTooltipOnHide="true"
																	           v-model="emojiShow[index].show">
																		<VEmojiPicker slot="content"
																		              :showSearch="false"
																		              @select="onSelectEmoji"/>
																		<a-icon type="smile" class="icon-btn"
																		        style="cursor: pointer;"
																		        @click="clickEmoji(emojiShow[index].keyVal)"/>
																	</a-popover>
																</div>
															</div>
															<a-popover v-model="showSketch[index]" trigger="click"
															           placement="bottom"
															           :destroyTooltipOnHide="true"
															           :getPopupContainer="getPopupContainer2"
															           :autoAdjustOverflow="false"
															           :overlayStyle="{'backgroud-color': fc(index)}">
																<sketch-picker slot="content"
																               v-model="template_data[index].color"></sketch-picker>
																<div class="color-box">
															<span class="color-show"
															      :style="{'background-color': fc(index)}"></span>
																	<a-icon type="down"/>
																</div>
															</a-popover>
														</div>
													</a-col>
												</a-row>
											</div>
										</a-form-item>
										<!-- 点击跳转 -->
										<a-form-item label="点击跳转" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
											<a-radio-group name="radioGroup" v-model="jumpValue">
												<a-radio :value="1">链接</a-radio>
												<a-radio :value="2">小程序</a-radio>
											</a-radio-group>
											<a-input placeholder="输入跳转链接，且必须以http://或https://开头" v-if="jumpValue==1"
											         v-model="url"/>
											<a-input placeholder="填写小程序AppID，跳转小程序需与当前公众号绑定关联关系" v-model="appid"
											         v-if="jumpValue==2"/>
											<a-input placeholder="填写小程序路径，例如：pages/index/index" v-if="jumpValue==2"
											         v-model="pagepath"/>
										</a-form-item>
										<!-- 群发粉丝 -->
										<a-form-item label="群发粉丝" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
											<a-radio-group @change="changeFans" v-model="fansValue">
												<a-radio :value="2">全部粉丝</a-radio>
												<a-radio :value="1">按条件筛选粉丝</a-radio>
												<a-radio :value="3">指定粉丝</a-radio>
											</a-radio-group>
											<span style="float: right;" v-show="fansValue != 3">
                      符合条件约
                      <span style="color:blue;">{{peopleNum}}</span>人
                    </span>
											<div v-show="fansValue == 1" class="changeFans">
												<a-form>
													<a-form-item label="性别" :label-col="{ span: 3 }"
													             :wrapper-col="{ span: 20 }">
														<a-radio-group @change="changeSex" v-model="sexValue">
															<a-radio :value="0">全部性别</a-radio>
															<a-radio :value="1">仅男性粉丝</a-radio>
															<a-radio :value="2">仅女性粉丝</a-radio>
															<a-radio :value="3">未知性别</a-radio>
														</a-radio-group>
													</a-form-item>
													<a-form-item label="关注时间" :label-col="{ span: 3 }"
													             :wrapper-col="{ span: 20 }">
														<a-date-picker format="YYYY-MM-DD HH:mm:ss"
														               @change="startTime" v-model="startValue"
														               placeholder="开始日期"
														               @openChange="handleStartOpenChange"
														               :disabledDate="disabledStartDate2"
														               :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"/>
														~
														<a-date-picker format="YYYY-MM-DD HH:mm:ss"
														               placeholder="结束日期" @change="endTime"
														               v-model="endValue" :open="endOpen"
														               @openChange="handleEndOpenChange"
														               :disabledDate="disabledEndDate2"
														               :show-time="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"/>
													</a-form-item>
													<a-form-item label="地域" :label-col="{ span: 3 }"
													             :wrapper-col="{ span: 20 }">
														<a-cascader :options="cityData" @change="changeCity"
														            v-model="province1"
														            style="width: 195px;text-align: left;"/>
													</a-form-item>
													<a-form-item label="标签" :label-col="{ span: 3 }"
													             :wrapper-col="{ span: 20 }">
														<template v-for="(item,index) in tagsList">
															<a-checkable-tag v-model="checked[index]"
															                 @change="changeTags(item.key)">
																{{item.name}}
															</a-checkable-tag>
														</template>
													</a-form-item>
													<span style="color: #F56C6C;margin-left: 12.5%;padding-left: 5px;">当粉丝同属于多个标签时，发送后只会接收到一条推送</span>
												</a-form>
											</div>
											<div v-show="fansValue == 3" class="changeFans">
												<a-input placeholder="请输入粉丝openid"
												         v-model="openids"/>
												提示：输入多个粉丝openid，用“;”分开，最多单次一次性指定8个粉丝
											</div>
										</a-form-item>
										<!-- 群发时间 -->
										<a-form-item label="群发时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
										             style="padding-bottom: 15px;">
											<a-radio-group v-model="send_type" @change="changeSendTime">
												<a-radio :value="1">立即发送</a-radio>
												<a-radio :value="2">指定时间发送</a-radio>
											</a-radio-group>
											<div v-show="send_type == 2">
												<a-date-picker @change="selectDate"
												               :value="moment(getCurrentData(), 'YYYY-MM-DD')"
												               :disabledDate="disabledStartDate" :allowClear="false"/>
												<a-time-picker :value="moment(getCurrentTime(), 'HH:mm')"
												               format="HH:mm"
												               style="width: 174px;margin-left: 15px;"
												               :disabledHours="disabledHours"
												               :disabledMinutes="disabledMinutes" @change="selectTime"
												               :allowClear="false"/>
											</div>
											<div class="content-msg">
												<p style="margin-bottom: 0px;line-height: 25px;font-size: 12px;">
													请控制每日群发频次，勿发送广告营销类内容，以免造成对粉丝的打扰进而被投诉，影响公众号使用。</p>
												<p style="margin-bottom: 0px;line-height: 25px;font-size: 12px;"
												   v-show="send_type == 2">
													实际发送时间因系统排队等原因，可能会与设定的时间发送有误差</p>
											</div>
											<div style="height: 20px;border-bottom: 1px solid #E0E0E0;"></div>
											<div style="margin-top: 15px;">
												<a-button type="primary" @click="createdMsg" :loading="createdLoading">
													确定并
													<span v-show="typeof urlId == 'undefined'">新建</span>
													<span v-show="typeof urlId != 'undefined'">编辑</span>
													消息
												</a-button>
												<a-button style="margin-left: 15px;" @click="openPreview">手机预览
												</a-button>
											</div>
											<a-modal title="手机预览" v-model="previewVisible" :footer="null">
												<div class="img">
													<div id="qrcode" ref="a"></div>
												</div>
												<p class="img-txt">{{msg_title}}</p>
											</a-modal>
										</a-form-item>
									</a-form>
								</div>
							</div>
							<!-- 公众号选择弹窗 -->
							<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="template-add"></wxModal>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import cityData from "../../../common/js/citydata.js";
	import moment from "moment";
	import "moment/locale/zh-cn";

	moment.locale("zh-cn");
	import wxModal from "@/components/WxModal.vue";
	import editor from "vue2-medium-editor";
	import {Sketch} from "vue-color";
	import { VEmojiPicker } from "v-emoji-picker";
	import WEmoji from "@/common/js/wechatEmoji.js";
	import QRCode from 'qrcodejs2'

	export default {
		components: {
			wxModal,
			"medium-editor": editor,
			"sketch-picker": Sketch,
			VEmojiPicker
		},
		props     : {
			defaultColor : {
				type   : String,
				default: "#000"
			},
			defaultColor2: {
				type   : String,
				default: "#333"
			}
		},
		data () {
			let changeBackground =
				this.$store.state.wxNum.length > 0 ? this.$store.state.wxNum : "";
			return {
				wxInfo          : [], //微信公众号列表
				avatarImg       : "", //微信公众号头像
				showModal2      : false, //公众号组件弹窗显示与隐藏
				changeBackground: changeBackground, //选中背景色
				wxNum           : changeBackground, //修改后的微信id值
				msg_title       : "", //消息名称
				templateId      : "", //选中模板的值
				templateList    : [], //选择模板下拉框选项
				templateData    : [], //模板账户名等内容
				jumpValue       : 1, //点击跳转类型值,1链接，2小程序
				fansValue       : 2, //群发粉丝
				sexValue        : 0, //群发粉丝性别
				peopleNum       : "", //符合条件的人数
				//日期选择
				startValue      : null,
				endValue        : null,
				endOpen         : false,
				s_time          : "", //开始日期
				e_time          : "", //结束日期
				// 地域
				cityData,
				province        : "", //省份
				city            : "", //城市
				province1       : ["全部"],
				checked         : [],
				tagsList        : [], //标签列表
				tagCheckValue   : [], //选中的tag
				tag_arr         : [], //标签值数组
				tag_ids         : "", //标签值
				specialFansList : "", //指定粉丝框的输入值数组
				createdId       : 0, //群发id,添加为0，修改为1
				send_type       : 1, //群发时间，1立即发送，2指定时间
				send_time       : '',//创建发送时间
				date            : "00:00:00", //指定发送时间默认
				date2           : moment(), //指定发送日期默认
				moment, //时间选择器
				dateValue       : parseInt(new Date().getTime() / 1000), //群发时间的日期
				timeValue       : parseInt(new Date().getTime() / 1000 + 600), //群发时间的时间
				textAreaValue   : [], //模板展示的内容
				wordNum         : [],//编辑框的字数
				wordLimit       : [], //  编辑框文字限制
				options         : {
					placeholder: {
						text       : '',
						hideOnClick: false
					},
					toolbar    : false
				},
				activeContentKey: 0,
				isFocus         : [],
				url             : "", //跳转地址
				appid           : "", //跳转到的小程序appid
				pagepath        : "", //跳转到小程序的具体页面路径
				openids         : "", //指定粉丝多个;分割
				first           : "", //标头语
				remark          : "", //备注语
				showSketch      : [],
				showSketch1     : false,
				showSketch2     : false,
				bgc             : {
					background: "#000"
				},
				template_data   : [],
				emojiShow       : [], // emoji表情选择框是否显示
				emojiClickIndex : -10, //当前打开表情下拉框的index值
				emojiClickIndex1: -10, //当前打开表情下拉框的index值
				mediumEditor    : [], // 初始化的medium-editor
				keyRelation     : [],
				urlId           : "", //地址栏参数id值
				templateName    : [], //选中的模板名字
				templateVisible : true,//控制选择模板板块的显示与隐藏
				previewVisible  : false,//手机预览弹窗显示与隐藏
				isLoading       : false, //Loading 组件显示与隐藏
				keydownNode     : false,
				keydownNodeIndex: 0,
				createdLoading  : false,//确定按钮的loading展示
			};
		},
		methods   : {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/template/list?isRefresh=1")
			},
			clickEmoji (emojiClickIndex) {
				this.emojiClickIndex = emojiClickIndex;
				this.emojiClickIndex1 = emojiClickIndex;
			},
			// 初始化文本信息的格式
			initTextMsgContent (content) {
				const _this = this;
				if (content.search(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g) !== -1) {
					WEmoji.wechatEmojiKey.map(alt => {
						let preg = new RegExp(_this.utils.addslashes(alt), "g");
						let emojiUrl = WEmoji.getEmojiUrl(alt);
						content = content.replace(
							preg,
							'<img src="' +
							emojiUrl +
							'" alt="' +
							alt +
							'" height="21" width="21"/>'
						);
					});
				}

				return content.replace(/[\r\n|\n]/g, "<br/>");
			},
			// 修改emoji的显示与否的参数
			toggleDialogEmoji () {
				this.emojiShow[this.emojiClickIndex1].show = !this.emojiShow[
					this.emojiClickIndex1].show;
			},
			// 选择emoji表情的事件
			onSelectEmoji (dataEmoji) {
				const textIndex = this.emojiClickIndex;
				const dom = this.mediumEditor[textIndex].options.ownerDocument;
				if (this.wordLimit[textIndex] - this.wordNum[textIndex] >= 2) {
					this.insertHTMLEmoji(dom, dataEmoji.data);
				}
				this.toggleDialogEmoji();
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
					if (cls && cls.contains("content-editable")) {
						isIn = true;
						break;
					}
					node = node.parentNode;
				}
				if (!isIn) return;
				self.lastRange = sel.getRangeAt(0);
				self.lastNode = node;


			},
			// 插入自定义HTML
			insertHTMLEmoji (doc, html) {
				let range,
					toReplace,
					el,
					fragment,
					node,
					lastNode,
					ecArgs = ["insertHTML", false, html];

				range = self.lastRange;
				toReplace = range.commonAncestorContainer;

				if (
					editor.MediumEditor.util.isMediumEditorElement(toReplace) &&
					!toReplace.firstChild
				) {
					range.selectNode(toReplace.appendChild(doc.createTextNode("")));
				} else if (
					(toReplace.nodeType === 3 &&
						range.startOffset === 0 &&
						range.endOffset === toReplace.nodeValue.length) ||
					(toReplace.nodeType !== 3 && toReplace.innerHTML === range.toString())
				) {
					// Ensure range covers maximum amount of nodes as possible
					// By moving up the DOM and selecting ancestors whose only child is the range
					while (
						!editor.MediumEditor.util.isMediumEditorElement(toReplace) &&
						toReplace.parentNode &&
						toReplace.parentNode.childNodes.length === 1 &&
						!editor.MediumEditor.util.isMediumEditorElement(toReplace.parentNode)
						) {
						toReplace = toReplace.parentNode;
					}
					range.selectNode(toReplace);
				}
				range.deleteContents();

				el = doc.createElement("div");
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

				let textIndex = ''
				if (self.lastNode.dataset.key) {
					textIndex = parseInt(self.lastNode.dataset.key)
				} else {
					textIndex = this.emojiClickIndex;
				}
				let text = self.lastNode.textContent.replace(/\s粉丝昵称\s/g, '粉丝昵称')
				this.$set(this.wordNum, textIndex, text.length)
				this.$forceUpdate()
				if (this.wordNum[textIndex] <= this.wordLimit[textIndex]) {
					this.textAreaValue[textIndex] = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')

					if (typeof this.urlId == 'undefined') {
						this.template_data[textIndex].value = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.template_data[textIndex].value = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}
				}

				let event = {
					currentTarget: this.mediumEditor[textIndex].origElements
				}
				this.mediumEditor[textIndex].events.updateInput(event.currentTarget, event);
			},
			// 插件初始化成功的回调
			editorCreated (mediumEditor) {
				let key = parseInt(mediumEditor.origElements.dataset.key);
				this.mediumEditor.push(mediumEditor)
				this.mediumEditor[key].subscribe('focus', this.editableFocus);
				this.mediumEditor[key].subscribe('editableKeydown', this.editableKeydown);
				this.mediumEditor[key].subscribe('editablePaste', this.editablePaste);

				delete self.lastRange
				delete self.lastNode
			},
			// 文本域获取焦点
			editableFocus (e) {
				if (e.target.innerHTML === '' || e.target.innerHTML == '<p></p>' || e.target.innerHTML == '<br>') {
					e.target.innerHTML = '<p><br/></p>';
				}
			},
			//监听键盘事件，超过300字，不让输入
			editableKeydown (event) {
				let textIndex = ''
				if (self.lastNode.dataset.key) {
					textIndex = parseInt(self.lastNode.dataset.key)
				} else {
					textIndex = this.emojiClickIndex;
				}
				if (this.wordNum[textIndex] >= this.wordLimit[textIndex] && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && !(event.keyCode == 65 && (event.metaKey || event.ctrlKey))) {
					event.preventDefault();
				}

				if (event.keyCode == 86 && (event.metaKey || event.ctrlKey)) {
					console.log(123);
				}
				if (event.keyCode == 13) {
					this.keydownNodeIndex = 0
					this.getParentP4Label(self.lastRange.startContainer)
				}
				this.keydownNode = event.keyCode == 13
			},
			// 找到startContainer的p父元素
			getParentP4Label (node) {
				if (node.nodeName != 'P') {
					this.getParentP4Label(node.parentNode)
				} else {
					this.getPreviousSiblingIndex(node)
					return
				}
			},
			// node前面兄弟元素的个数
			getPreviousSiblingIndex (node) {
				if (node.previousSibling) {
					this.keydownNodeIndex++
					this.getPreviousSiblingIndex(node.previousSibling)
				} else {
					return
				}
			},
			//监听粘贴事件
			editablePaste (event, target) {
				this.invlideText()
			},
			invlideText () {
				let textIndex = ''
				if (self.lastNode.dataset.key) {
					textIndex = parseInt(self.lastNode.dataset.key)
				} else {
					textIndex = this.emojiClickIndex;
				}
				let startNode, startOffset, endNode, endOffset
				const customNode = this.mediumEditor[textIndex].origElements
				const data = this.global.getRangeInfo(customNode, this.wordLimit[textIndex]);
				startNode = data.startNode
				startOffset = data.startOffset
				endNode = data.endNode
				endOffset = data.endOffset


				if (typeof startNode.nodeValue !== 'undefined') {
					let newRange = document.createRange()
					newRange.setStart(startNode, startOffset);
					newRange.setEnd(endNode, endOffset);
					// let newSelection = window.getSelection();
					// newSelection.removeAllRanges();
					// newSelection.addRange(newRange)
					newRange.deleteContents()
					this.textAreaValue[textIndex] = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')

					if (typeof this.urlId == 'undefined') {
						this.template_data[textIndex].value = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.template_data[textIndex].value = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}

					// console.log(this.textAreaValue, 111)
					// console.log(self.lastNode.innerHTML, 'lastNode')
					// this.textAreaValue[textIndex] = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>')
					// this.template_data[textIndex].value = self.lastNode.innerText.replace(/\n{2}/g, '\n').replace(/粉丝昵称/g, '{nickname}')
					this.wordNum[textIndex] = this.wordLimit[textIndex]
					this.$forceUpdate()
					var divscll = document.getElementsByClassName('content-editable');
					divscll[divscll.length - 1].scrollTop = divscll[divscll.length - 1].clientHeight

				}
			},
			fc (key) {
				return typeof this.template_data[key].color.hex != "undefined"
					? this.template_data[key].color.hex
					: this.template_data[key].color;
			},
			changeContentInput (operation) {
				if (operation.api.origElements.innerHTML == '' || operation.api.origElements.innerHTML == '<br>') {
					operation.api.origElements.innerHTML = '<p><br/></p>'
				}

				const textIndex = parseInt(self.lastNode.dataset.key);
				let text = self.lastNode.textContent.replace(/\s粉丝昵称\s/g, '粉丝昵称')
				this.$set(this.wordNum, textIndex, text.length)
				// this.wordNum[textIndex] = self.lastNode.textContent.length
				if (this.wordNum[textIndex] <= this.wordLimit[textIndex]) {
					this.textAreaValue[textIndex] = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')

					if (typeof this.urlId == 'undefined') {
						this.template_data[textIndex].value = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.template_data[textIndex].value = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}

				} else {
					this.invlideText();
				}
				if (this.keydownNode) {
					let startNode = self.lastNode.childNodes[this.keydownNodeIndex + 1]
					let newRange = document.createRange()
					newRange.setStart(startNode, 0)
					let newSelection = window.getSelection()
					newSelection.removeAllRanges()
					newSelection.addRange(newRange)
					this.keydownNode = false
				}
			},
			//点击插入粉丝昵称标签
			addTag: function (key) {
				const dom = this.mediumEditor[key].options.ownerDocument
				const html =
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>';
				const textIndex = parseInt(self.lastNode.dataset.key);
				if (this.wordLimit[textIndex] - this.wordNum[textIndex] >= 6) {
					this.insertHTMLEmoji(dom, html);
				}
			},
			//更换公众号
			add () {
				if (this.$route.query.id) {
					return
				}
				this.showModal2 = true
				this.isLoading = true;
			},
			modalVisibleChange (event, wxNum, wxNickName) {
				// console.log(wxNickName);
				if (event == "ok") {
					this.isLoading = false;
					this.showModal2 = false
					this.$store.dispatch("changeWxNum", wxNum)
					this.$store.commit("changeWxNickName", wxNickName);
					this.avatarImg = this.wxInfo[this.$store.state.wxNumIndex].head_img
					this.msg_title = ''
					// this.templateName = this.templateList[0].title;
					this.textAreaValue = []
					this.wordNum = []
					this.wordLimit = []
					this.jumpValue = 1
					this.url = ''
					this.appid = ''
					this.pagepath = ''
					this.fansValue = 2
					this.sexValue = 0
					this.startValue = null
					this.endValue = null
					this.province1 = ['全部']
					this.checked = []
					this.send_type = 1
					this.tag_ids = "";
					this.tag_arr = []
					this.province = "";
					this.city = "";
					this.s_time = "";
					this.e_time = "";
					this.specialFansList = "";
					this.getFans();
					this.getAllTemplates(0)
				} else {
					this.getTags()
					this.showModal2 = false;
					this.isLoading = false;
				}
			},
			//消息名称
			changeMsgTitle (e) {
				// console.log(e.target.value)
				this.msg_title = e.target.value;
			},
			//选择模板
			selectTemplate (value) {
				if (typeof this.urlId != "undefined") {
					this.getTemplateContent2(value);
					this.templateId = value;
				} else {
					this.getTemplateContent(value);
					this.templateId = value;
				}
			},
			//获取选择模板下拉框选项
			async getAllTemplates (id) {
				if (typeof this.urlId == 'undefined') {
					id = 0
				} else {
					id = id
				}
				const {data: res} = await this.axios.post("template/get-all-template", {
					wx_id: localStorage.getItem('wxNum'),
					id   : id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.templateList = res.data.info;
					if (typeof this.urlId == "undefined") {
						if (this.templateList.length == 0) {
							this.templateVisible = false
						} else {
							this.templateVisible = true
							this.templateId = this.templateList[0].id;
							this.templateName = this.templateList[0].title;
							this.getTemplateContent(this.templateId);
						}
					} else {
						this.getTemplateContent(this.templateId);
					}
				}
				// console.log(this.templateVisible,'templateVisible')
			},
			//获取模板账户名等内容
			async getTemplateContent2 (id) {
				const {data: res} = await this.axios.post(
					"template/get-template-content",
					{
						id: id
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.templateData = res.data;
					// console.log(this.textAreaValue);
					this.template_data = res.data.data;
					this.textAreaValue = []; //模板展示的内容
					this.wordNum = []
					this.wordLimit = []
					this.emojiShow = [];
					let a = 0
					let b = 50
					for (var i = 0; i < res.data.data.length; i++) {
						this.showSketch.push(false);
						this.template_data[i].color = this.defaultColor
						this.template_data[i].start.color = this.defaultColor2
						this.template_data[i].end.color = this.defaultColor2
						this.textAreaValue.push("");
						this.wordNum.push(a)
						this.wordLimit.push(b)
						this.emojiShow.push({
							show  : false,
							keyVal: i
						});
					}
				}
			},
			async getTemplateContent (id) {
				const {data: res} = await this.axios.post(
					"template/get-template-content",
					{
						id: id
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.templateData = res.data;
					// console.log(this.textAreaValue);
					if (typeof this.urlId == "undefined") {
						this.template_data = res.data.data;
						this.textAreaValue = []; //模板展示的内容
						this.wordNum = []
						this.wordLimit = []
						this.emojiShow = [];
						let a = 0
						let b = 50
						for (var i = 0; i < res.data.data.length; i++) {
							this.showSketch.push(false);
							this.template_data[i].color = this.defaultColor
							this.template_data[i].start.color = this.defaultColor2
							this.template_data[i].end.color = this.defaultColor2
							this.textAreaValue.push("");
							this.wordNum.push(a)
							this.wordLimit.push(b)
							this.emojiShow.push({
								show  : false,
								keyVal: i
							});
						}
					} else {
						for (var i = 0; i < res.data.data.length; i++) {
							this.showSketch.push(false);
							this.emojiShow.push({
								show  : false,
								keyVal: i
							});
						}
						for (var i = 0; i < this.templateList.length; i++) {
							if (this.templateList[i].id == this.templateId) {
								this.templateName = this.templateList[i].title;
							}
						}
						this.wordNum = []
						// let list = JSON.parse(JSON.stringify(this.template_data))
						// for (var i = 0; i < list.length; i++) {
						// 	this.wordNum[i] = list[i].value.replace(/{nickname}/g, ' 粉丝昵称 ').replace(/<br\/>/g, '').length
						// }
						let b = 50
						this.wordLimit = []
						for (var i = 0; i < this.template_data.length; i++) {
							this.template_data[i].value = this.template_data[i].value.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')

							this.wordNum[i] = this.template_data[i].value.replace(/{nickname}/g, '粉丝昵称').replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '').length
							let textAreaValue = this.template_data[i].value
								.replace(
									/{nickname}/g,
									'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>'
								)
								.replace(/\n/g, "<br/>");
							textAreaValue = '<p>' + textAreaValue + '</p>'
							this.textAreaValue.push(textAreaValue);
							this.wordLimit.push(b)
						}
					}
				}
			},
			//群发粉丝
			changeFans (e) {
				// console.log(e.target.value)
				if (e.target.value == 1) {
					this.getTags();
				}
				this.tag_ids = "";
				this.sexValue = 0;
				this.province = "";
				this.city = "";
				this.s_time = "";
				this.e_time = "";
				this.specialFansList = "";
				this.startValue = null;
				this.endValue = null;
				this.province1 = ["全部"];
				this.checked = []
				this.tag_arr = []
				this.openids = ""
				this.getFans();
			},
			//修改性别
			changeSex (e) {
				// console.log(e.target.value)
				this.sexValue = e.target.value;
				this.getFans();
			},
			//关注时间
			handleStartOpenChange (open) {
				if (!open) {
					this.endOpen = true;
				}
			},
			handleEndOpenChange (open) {
				this.endOpen = open;
			},
			startTime (startValue) {
				if (startValue == null) {
					this.s_time = ''
				} else {
					this.s_time = startValue.format("X");
				}
				this.getFans();
			},
			endTime (endValue) {
				if (endValue == null) {
					this.s_time = ''
				} else {
					this.e_time = endValue.format("X");
				}
				this.getFans();
			},
			disabledStartDate2 (startValue) {
				const endValue = this.endValue;
				if (!startValue || !endValue) {
					return false;
				}
				return startValue.valueOf() > endValue.valueOf();
			},
			disabledEndDate2 (endValue) {
				const startValue = this.startValue;
				if (!endValue || !startValue) {
					return false;
				}
				return startValue.valueOf() >= endValue.valueOf();
			},
			// 地域
			changeCity (value) {
				// console.log(value)
				if (value[0] != "全部") {
					this.province = value[0];
				} else {
					this.province = "";
				}
				if (value[1] != "全部") {
					this.city = value[1];
				} else {
					this.city = "";
				}
				this.getFans();
			},
			//获取标签
			async getTags () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id: localStorage.getItem('wxNum'),
					type : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					// console.log(this.tag_arr,'this.tag_arr')
					this.checked = []
					for (var i = 0; i < this.tagsList.length; i++) {
						var checked = false;
						this.checked.push(checked);
					}
				}
			},
			async getTags2 () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id: localStorage.getItem('wxNum'),
					type : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					// console.log(this.tag_arr,'this.tag_arr')
					this.checked = []
					for (var i = 0; i < this.tagsList.length; i++) {
						var checked = false;
						this.checked.push(checked);
					}
					if (typeof this.urlId != "undefined") {
						if (this.tag_arr.length > 0) {
							for (var j = 0; j < this.tag_arr.length; j++) {
								for (var i = 0; i < this.tagsList.length; i++) {
									if (this.tag_arr[j] == this.tagsList[i].key) {
										this.checked[i] = true;
									}
								}
							}
						}
					}
					// console.log(this.tagsList,'this.tagsList')
					// console.log(this.checked,'this.checked')
				}
			},
			//标签
			changeTags (key) {
				Array.prototype.indexOf = function (val) {
					for (var i = 0; i < this.length; i++) {
						if (this[i] == val) return i;
					}
					return -1;
				};
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val);
					if (index > -1) {
						this.splice(index, 1);
					}
				};
				// console.log(this.tag_arr,'tag_arr')
				if (this.tag_arr.includes(key)) {
					this.tag_arr.remove(key);
				} else {
					this.tag_arr.push(key);
				}
				this.tag_ids = this.tag_arr.join();
				// console.log(this.tag_ids,'tag_ids')
				this.getFans();
			},
			//获取符合条件的粉丝人数
			async getFans () {
				var sexVal = "";
				if (this.sexValue == "0") {
					sexVal = "";
				} else {
					sexVal = this.sexValue;
				}
				const {data: res} = await this.axios.post("fans/get-user-list", {
					wx_id       : localStorage.getItem('wxNum'),
					tag_ids     : this.tag_ids,
					sex         : sexVal,
					province    : this.province,
					city        : this.city,
					s_time      : this.s_time,
					e_time      : this.e_time,
					keyword     : this.specialFansList,
					is_condition: 1
				});
				// console.log(res)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.peopleNum = res.data.count;
				}
			},
			//群发时间
			selectDate (value) {
				this.dateValue = new Date(value.format("YYYY-MM-DD")).getTime() / 1000;
			},
			disabledStartDate (date2) {
				//打开开始时间面板调用的函数
				return date2.valueOf() < new Date().getTime() - 86400000; //大于今天的日期一律返回true，禁止选择
			},
			getCurrentData () {
				if (typeof this.urlId == "undefined") {
					this.date2 = moment.unix(this.dateValue).format("YYYY-MM-DD");
					return this.date2;
				} else {
					let dateString = moment.unix(this.dateValue).format("YYYY-MM-DD");
					return dateString;
				}
			},
			selectTime (time, timeString) {
				this.timeValue = parseInt(new Date(time).getTime() / 1000);
			},
			disabledHours () {
				let year = new Date().getFullYear()
				let month = new Date().getMonth() + 1
				let day = new Date().getDate()
				let dateStr = moment.unix(this.dateValue).format("YYYY-MM-DD")
				// console.log(new Date(dateStr).getTime()/1000-28800,'选中日期')
				// console.log(new Date(year + '/' + month + '/' + day).getTime()/1000,'今天日期')
				if (new Date(dateStr).getTime() / 1000 - 28800 <= new Date(year + '/' + month + '/' + day).getTime() / 1000) {
					const dateString = new Date().getTime() + 600000;
					var a = moment(dateString).format("HH:mm");
					let hours = [];
					let timeArr = a.split(":");
					for (var i = 0; i < parseInt(timeArr[0]); i++) {
						hours.push(i);
					}
					return hours;
				} else {
					return false
				}
			},
			disabledMinutes (selectedHour) {
				let year = new Date().getFullYear()
				let month = new Date().getMonth() + 1
				let day = new Date().getDate()
				let dateStr = moment.unix(this.dateValue).format("YYYY-MM-DD")
				if (new Date(dateStr).getTime() / 1000 - 28800 <= new Date(year + '/' + month + '/' + day).getTime() / 1000) {
					const dateString = new Date().getTime() + 600000;
					var a = moment(dateString).format("HH:mm");
					let minutes = [];
					let timeArr = a.split(":");
					if (selectedHour == parseInt(timeArr[0])) {
						for (var i = 0; i < parseInt(timeArr[1]); i++) {
							minutes.push(i);
						}
					}
					return minutes;
				} else {
					return false
				}
			},
			getCurrentTime () {
				if (typeof this.urlId == "undefined") {
					this.date = moment.unix(this.timeValue).format("HH:mm");
					// console.log(this.date,'time1')
					return this.date;
				} else {
					let timeString = moment.unix(this.timeValue).format("HH:mm");
					// console.log(timeString,'time2')
					return timeString;
				}
			},
			//群发时间类型
			changeSendTime (e) {
				this.send_type = e.target.value;
			},
			//确定并创建消息
			async createdMsg () {
				let reg2 = /^\s+$/g
				for (var i = 0; i < this.template_data.length; i++) {
					if (typeof this.template_data[i].color == "object") {
						this.template_data[i].color = this.template_data[i].color.hex;
					}
					if (reg2.test(this.template_data[i].value)) {
						this.template_data[i].value = ''
					}
					if (!this.template_data[i].value) {
						this.template_data[i].value = ''
					}
					// if (this.template_data[i].value) {
					// 	if(typeof this.urlId == 'undefined'){
					// 		this.template_data[i].value = this.template_data[i].value.replace(/\n\n/g, '\n')
					// 	}else {
					// 		this.template_data[i].value = this.template_data[i].value.replace(/<br>/g, '').replace(/<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>/g, '{nickname}').replace(/<div>/g, '\n').replace(/<\/div>/g, '').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<br\/>/g, '').replace(/&nbsp;/g, ' ').replace(/<span>/g, '').replace(/<\/span>/g, '')
					// 	}
					// }
				}
				//发送时间
				if (typeof this.urlId == 'undefined') {
					let a = moment.unix(this.dateValue).format("YYYY-MM-DD") + 'T' + moment.unix(this.timeValue).format("HH:mm")
					this.send_time = new Date(a).getTime() / 1000
				} else {
					let a = moment.unix(this.dateValue).format("YYYY-MM-DD") + 'T' + moment.unix(this.timeValue).format("HH:mm")
					this.send_time = new Date(a).getTime() / 1000
				}
				if (this.jumpValue == 1) {
					var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
					if (reg.test(this.url)) {
						this.$message.error("跳转链接必须以http://或https://开头");
						return false
					}
				} else {
					if (this.appid == '') {
						this.$message.error("小程序AppID不能为空");
						return false
					} else if (this.pagepath == '') {
						this.$message.error("小程序路径不能为空");
						return false
					} else if (this.pagepath.substr(0, 6) != "pages/") {
						this.$message.error("小程序路径必须以pages/开头");
						return false
					}
				}
				if (this.fansValue == 3) {
					if (this.openids == '') {
						this.$message.error("粉丝openid不能为空");
						return false;
					} else if (this.openids.split(";").length > 8) {
						this.$message.warning("最多单次一次性指定8个粉丝");
						return false;
					}
				} else {
					if (this.peopleNum == 0) {
						this.$message.error("没有符合条件的粉丝");
						return false
					}
				}

				this.createdLoading = true
				const {data: res} = await this.axios.post(
					"template-push-msg/post-template-message",
					{
						wx_id        : localStorage.getItem('wxNum'),
						msg_title    : this.msg_title,
						template_id  : this.templateId,
						template_data: this.template_data,
						redirect_type: this.jumpValue,
						url          : this.url,
						appid        : this.appid,
						pagepath     : this.pagepath,
						push_type    : this.fansValue,
						sex          : this.sexValue,
						s_time       : this.s_time,
						e_time       : this.e_time,
						province     : this.province,
						city         : this.city,
						tag_ids      : this.tag_ids,
						send_type    : this.send_type,
						send_time    : this.send_time,
						openids      : this.openids,
						id           : this.urlId
					}
				);
				// console.log(res);
				if (res.error == 0) {
					this.createdLoading = false
					this.$message.success("操作成功");
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					if (typeof this.urlId == 'undefined') {
						this.$router.push("/template/list")
					} else {
						this.$router.push("/template/list?isRefresh=1")
					}
				} else {
					this.createdLoading = false
					this.$message.error(res.error_msg);
				}
			},
			//手机预览
			openPreview () {
				for (var i = 0; i < this.template_data.length; i++) {
					if (typeof this.template_data[i].color == "object") {
						this.template_data[i].color = this.template_data[i].color.hex;
					}
					if (typeof this.template_data[i].value != 'undefined') {
						if (this.template_data[i].value.match(/^\s+$/g)) {
							this.template_data[i].value = ''
						} else {
							this.template_data[i].value = this.template_data[i].value.replace(/<br\/>/g, '\n').replace(/<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;<\/span>/g, '{nickname}')
							// .replace(/<div>/g, '\n\n').replace(/<\/div>/g, '').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<br\/>/g, '').replace(/&nbsp;/g, ' ').replace(/<span>/g, '').replace(/<\/span>/g, '')
						}
					}
				}
				if (this.msg_title == '') {
					this.$message.error("请填写消息名称");
					return false
				}
				if (this.jumpValue == 1) {
					if (this.url == '') {
						this.$message.error("请填写跳转地址");
						return false
					} else if (this.url.substr(0, 7) != "http://" && this.url.substr(0, 8) != "https://") {
						this.$message.error("跳转链接必须以http://或https://开头");
						return false
					}
				} else {
					if (this.appid == '') {
						this.$message.error("小程序AppID不能为空");
						return false
					} else if (this.pagepath == '') {
						this.$message.error("小程序路径不能为空");
						return false
					} else if (this.pagepath.substr(0, 6) != "pages/") {
						this.$message.error("小程序路径必须以pages/开头");
						return false
					}
				}
				this.getQRcode()
			},
			async getQRcode () {
				const {data: res} = await this.axios.post(
					"template-push-msg/down",
					{
						wx_id        : localStorage.getItem('wxNum'),
						template_id  : this.templateId,
						template_data: this.template_data,
						redirect_type: this.jumpValue,
						url          : this.url,
						appid        : this.appid,
						pagepath     : this.pagepath,
					}
				);
				// console.log(res)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.previewVisible = true
					this.$nextTick(() => {
						this.$refs.a.innerHTML = ''
						this.qrcode(res.data.url);
					})
				}
			},
			qrcode (url) {
				let qrcode = new QRCode('qrcode', {
					width     : 200,
					height    : 200,
					text      : url, // 二维码地址
					colorDark : "#000",
					colorLight: "#FFF",
				})
			},
			//让颜色插件浮层渲染到父节点上
			getPopupContainer2 (trigger) {
				return trigger;
			},
			//点击修改进入页面，获取详情
			async getDetail () {
				const {data: res} = await this.axios.post(
					"template-push-msg/edit-template-message",
					{
						id: this.urlId
					}
				);
				// console.log(res.data.template_data)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading = false;
				} else {
					this.isLoading = false;
					this.msg_title = res.data.msg_title;
					this.templateId = String(res.data.template_id);
					this.template_data = res.data.template_content;
					this.jumpValue = res.data.redirect_type;
					this.url = res.data.url;
					this.appid = res.data.appid;
					this.pagepath = res.data.pagepath;
					this.fansValue = res.data.push_type;
					this.sexValue = res.data.sex;
					this.s_time = res.data.stime;
					this.e_time = res.data.etime;
					this.province = res.data.province;
					this.city = res.data.city;
					this.tag_arr = res.data.tag_ids;
					this.send_type = res.data.send_type;
					this.timeValue = res.data.push_time;
					this.dateValue = res.data.push_time;
					this.openids = res.data.openids;

					if (this.s_time == '') {
						this.startValue = null
					} else {
						this.startValue = moment.unix(this.s_time);
					}
					if (this.e_time == '') {
						this.endValue = null
					} else {
						this.endValue = moment.unix(this.e_time);
					}
					if (this.province == '' && this.city == '') {
						this.province1 = ['全部']
					} else {
						this.province1[0] = this.province;
						this.province1[1] = this.city;
					}
					this.tag_ids = this.tag_arr.join();
					this.getTags2();
					this.getAllTemplates(this.urlId);
					this.getFans();
				}
				// console.log(this.template_data)
			},
		}
		,

		beforeCreate () {
			if (!this.$store.state.wxNum) {
				this.$router.back();
			}
		}
		,
		created () {
			this.urlId = this.$route.query.id;
			if (typeof this.urlId != "undefined") {
				this.isLoading = true;
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/template/list')
				this.getDetail();
			} else {
				this.getAllTemplates(0);
				this.getFans();
			}
			const _this = this;
			this.$store.dispatch("getWx", info => {
				_this.wxInfo = info;

				if (!_this.avatarImg) {
					_this.avatarImg = _this.wxInfo[_this.$store.state.wxNumIndex].head_img;
				}
			});
			document.addEventListener("selectionchange", function () {
				_this.getCursor(self);
			});
		}
	}
	;
</script>

<style lang='less' scoped>
	@import "../../../style/_style.less";

	.item-info {
		word-wrap: break-word;
	}

	.item-info /deep/ p {
		margin: 0;
		word-wrap: break-word;
		max-height: 72px;
		overflow: hidden auto;
		display: inline;
	}

	.content-editable {
		/deep/ p {
			margin: 0;
			min-height: 21px;
		}
	}

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		max-height: 72px;
		overflow: hidden auto;
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

	/deep/ .ant-popover-inner-content {
		padding: 0;
	}

	#components-layout-demo-basic {
		.ant-layout-sider {
			background: #FFF;
			flex: 0 0 380px !important;
			max-width: 380px !important;
			min-width: 380px !important;
			width: 380px !important;
			border-right: 1px solid #E2E2E2;
			padding: 20px 0;
		}
	}

	#components-layout-demo-basic .ant-layout-content {
		min-width: 885px;
		width: 100%;
		position: relative;
	}

	.content {
		border: 1px solid #E2E2E2;
		min-width: 885px;
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
	}

	.content-hd {
		height: 80px;
		padding: 20px 0;
		border-bottom: 1px solid #E2E2E2;
	}

	.changeType {
		border: 1px solid #E2E2E2;
		background: #FFF;
		margin: 5px 0;
	}

	.content-bd {
		background: #FAFAFA;
	}

	.changeFans {
		background: #FFFFFF;
		border: 1px solid #D8D8D8;
		padding: 12px 16px;
	}

	.template-list /deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 5px;
	}

	.template-list /deep/ .ant-tag-checkable-checked {
		background-color: #1890FF;
	}

	i {
		font-style: normal;
	}

	.phoneView-txt {
		width: 100%;
		background: #FFF2DB;
		border: 1px solid #FFDDA6;
		margin-top: 20px;
	}

	.msg_content_body {
		background: #FFFFFF;
		border: 1px solid #E9E9E9;
		border-radius: 4px;
		margin: auto;
		padding: 16px 13px;
		font-size: 14px;
		color: #333333;
		line-height: 24px;
		margin: 20px;
	}

	.template-list /deep/ .m-colorPicker .box.open {
		width: 220px;
		z-index: 999;
	}

	.color-box {
		display: inline-block;
		width: 62px;
		height: 30px;
		line-height: 30px;
		margin: 31px;
		border: 1px solid #CCC;
		cursor: pointer;
	}

	/deep/ .ant-row {
		margin: 0 !important;
	}

	.color-show {
		width: 16px;
		height: 16px;
		display: inline-block;
		margin: 0 10px;
	}

	/deep/ .emoji {
		font-size: 20px;
		height: 40px !important;
		width: 40px !important;
	}

	.icon-btn {
		margin-right: 10px;
	}

	.img {
		width: 220px;
		height: 220px;
		padding: 10px;
		border: 1px solid #E9E9E9;
		margin: auto;
		margin-top: 20px;
	}

	.img-txt {
		font-size: 18px;
		margin-top: 20px;
		color: #1A1A1A;
		text-align: center;
	}

	/deep/ .ant-tag {
		height: 26px;
		line-height: 25px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 5px 10px;
		margin-top: 12px;
		text-align: left;
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

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}
</style>