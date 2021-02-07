<template>
	<div>
		<div style="line-height: 32px;">
			是否加入链接：
			<a-switch :checked="templateData.is_url != 0 ? true : false" @click="changeIsUrl"></a-switch>
			<a-radio-group v-show="templateData.is_url != 0" @change="changeLink" style="margin-left: 5px" name="radioGroup" v-model="templateData.is_url">
				<a-radio :value="2">兑奖链接</a-radio>
				<a-radio :value="1">排行榜链接</a-radio>
			</a-radio-group>
			<a-button @click="editTemlate" style="float: right;margin-right: 23px;" type="primary">编辑模板内容</a-button>
		</div>
		<div v-show="templateVisible"
		     style="margin:auto;height:100%;width:100%;background:#FAFAFA;box-sizing: content-box;overflow-y: auto;">
			<div class="msg_content_body">
				<h3>{{templateData.title}}</h3>
				<div v-for="(item,index) in templateData.data" style="margin: 5px 0px;">
					<span>{{item.title}}</span>
					<span class="item-info" v-html="replaceValue(item.value || '')"
					      :style="{color: fc(index)}"></span>
				</div>
			</div>
		</div>
		<a-modal title="编辑模板" v-model="msgVisible" width="660px !important" style="width: 888px !important;">
			<template slot="footer">
				<a-button key="back" @click="handleCancelEdit">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						@click="handleEditOk"
				>确定
				</a-button>
			</template>
			<div style="margin-top: 10px;" class="item-list" v-for="(item,index) in template_data1">
				<div style="display: inline-block;width: 21%;min-height: 30px;vertical-align: top;margin-top: 14px;">
					{{item.title}}
				</div>
				<div style="display: inline-block;width: calc(70% - 85px); vertical-align: top;">
					<div style="border: 1px solid #D9D9D9;margin: 10px 0;width: 100%;">
						<medium-editor ref="medium_editor"
						               style="padding: 5px;"
						               class="content-editable"
						               :text="textAreaValue[index]"
						               :options="options"
						               @edit="changeContentInput"
						               :style="{color: fc1(index)}"
						               custom-tag="div"
						               @editorCreated="editorCreated"
						               :data-key="emojiShow[index].keyVal"/>
					</div>
					<div style="padding: 0px;">
						<div style="margin-right: 15px;float: right;">
							{{wordNum[index]}}/{{wordLimit[index]}}
						</div>
						<div v-if="isNickName || isEmoji || isList || isFissionTag" style="padding: 0 10px;">
							点击插入：
							<a-button style="margin-bottom: 5px;" v-if="isNickName" class="ant-tag ant-tag-orange"
							          size="small"
							          @click="addTag(index, '粉丝昵称')">粉丝昵称
							</a-button>
							<a-button style="margin-bottom: 5px;" v-if="isNickName" class="ant-tag ant-tag-orange"
							          size="small"
							          @click="addTag(index, '活动名称')">活动名称
							</a-button>
							<a-button style="margin-bottom: 5px;" v-if="isFissionTag" class="ant-tag ant-tag-orange"
							          size="small"
							          @click="addTag(index,'已完成任务量')">已完成任务量
							</a-button>
							<a-button style="margin-bottom: 5px;" v-if="isFissionTag" class="ant-tag ant-tag-orange"
							          size="small"
							          @click="addTag(index,'未完成任务量')">未完成任务量
							</a-button>
							<a-button style="margin-bottom: 5px;" v-if="isFissionTag" class="ant-tag ant-tag-orange"
							          size="small"
							          @click="addTag(index,'任务剩余库存')">任务剩余库存
							</a-button>
<!--							<a-popover>-->
<!--								<span slot="content">-->
<!--									<p style="margin: 5px 0;">-->
<!--										<a-button class="ant-tag ant-tag-orange"-->
<!--										          size="small"-->
<!--										          @click="addTag(index, '一阶任务剩余库存')">一阶任务剩余库存-->
<!--										</a-button>-->
<!--									</p>-->
<!--									<p style="margin: 5px 0;">-->
<!--										<a-button class="ant-tag ant-tag-orange"-->
<!--										          size="small"-->
<!--										          @click="addTag(index, '二阶任务剩余库存')">二阶任务剩余库存-->
<!--										</a-button>-->
<!--									</p>-->
<!--									<p style="margin: 5px 0;">-->
<!--										<a-button class="ant-tag ant-tag-orange"-->
<!--										          size="small"-->
<!--										          @click="addTag(index, '三阶任务剩余库存')">三阶任务剩余库存-->
<!--										</a-button>-->
<!--									</p>-->
<!--								</span>-->
<!--								<a-button v-if="isFissionTag" class="ant-tag ant-tag-orange" size="small">库存剩余-->
<!--								</a-button>-->
<!--							</a-popover>-->
							<a-popover style="margin-bottom: 5px;" trigger="click"
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
				</div>
				<a-popover v-model="showSketch[index]" trigger="click"
				           placement="bottom"
				           :destroyTooltipOnHide="true"
				           :getPopupContainer="getPopupContainer2"
				           :autoAdjustOverflow="false"
				           :overlayStyle="{'backgroud-color': fc1(index)}">
					<sketch-picker slot="content"
					               v-model="item.color"></sketch-picker>
					<div class="color-box">
															<span class="color-show"
															      :style="{'background-color': fc1(index)}"></span>
						<a-icon type="down"/>
					</div>
				</a-popover>
			</div>
		</a-modal>
		<a-modal title="插入排行榜" v-model="listVisible">
			<template slot="footer">
				<a-button key="back" @click="handleCancel">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						@click="handleOk"
				>确定
				</a-button>
			</template>
			<a-input placeholder=""
			         v-model="linkTitle"/>
			<div class="phoneView-txt">
				亲，这里只需要输入排行榜链接文本即可，排行榜链接在发送消息时系统会自动为你添加上，请您放心。
			</div>
		</a-modal>
	</div>
</template>

<script>
	import editor from "vue2-medium-editor";
	import {Sketch} from "vue-color";
	import { VEmojiPicker } from "v-emoji-picker";
	import WEmoji from "@/common/js/wechatEmoji.js";

	export default {
		name      : "TemplateMsgModel",
		components: {
			"medium-editor": editor,
			"sketch-picker": Sketch,
			VEmojiPicker
		},
		props     : {
			templates   : {
				type   : Object,
				default: {}
			},
			index       : {
				type   : Number,
				default: 0
			},
			isNickName  : {     // 是否展示添加昵称 默认展示
				type   : Boolean,
				default: true,
			},
			isFissionTag: {     // 裂变引流添加的一些按钮是否显示
				type   : Boolean,
				default: true,
			},
			isEmoji     : {     // 是否显示表情 默认展示
				type   : Boolean,
				default: true,
			},
			isList      : {     // 是否任务进度 默认展示
				type   : Boolean,
				default: true,
			}
		},
		watch     : {
			templates: {
				handler (newVal) {
					if (newVal.template_id) {
						this.templateId = newVal.template_id
						this.template_data = newVal.template_context
						this.templateData.data = this.template_data
					}
				}
			}
		},
		data () {
			return {
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
				mediumEditor    : [],
				emojiShow       : [], // emoji表情选择框是否显示
				showSketch      : [],
				template_data   : [],
				template_data1  : [],
				msgVisible      : false,
				templateData1   : [],
				templateId      : [],
				templateName    : [], //选中的模板名字
				templateList    : [], //选择模板下拉框选项
				templateVisible : false,
				templateData    : [],
				defaultColor    : '#000',
				emojiClickIndex : 0,
				emojiClickIndex1: 0,
				listVisible     : false,
				linkTitle       : '',
				temIndex        : ''
			}
		},
		methods   : {
			changeLink (e) {
				this.templateData.is_url = e.target.value;
				this.$emit('changeUrl', this.templateData.is_url, this.index)
				this.$forceUpdate()
			},
			changeIsUrl() {
				if(this.templateData.is_url) {
					this.templateData.is_url = 0
				} else {
					this.templateData.is_url = 1
				}
				this.$emit('changeUrl', this.templateData.is_url, this.index)
				this.$forceUpdate()
			},
			editTemlate () {
				this.template_data1 = JSON.parse(JSON.stringify(this.template_data))
				this.textAreaValue = new Array(this.template_data1.length).fill('')
				for(let i = 0; i < this.template_data1.length; i++) {
					this.textAreaValue[i] = this.template_data1[i].value.replace(/{nickname}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户昵称</span>&nbsp;</span>').replace(/{success}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量</span>&nbsp;</span>').replace(/{activityName}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">活动名称</span>&nbsp;</span>').replace(/{error}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量</span>&nbsp;</span>').replace(/{oneLevel}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">任务剩余库存</span>&nbsp;</span>').replace(/{twoLevel}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">二阶任务剩余库存</span>&nbsp;</span>').replace(/{threeLevel}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">三阶任务剩余库存</span>&nbsp;</span>').replace(/\n/g, '<br>')
				}
				this.msgVisible = true
			},
			replaceValue (value) {
				return value.replace(
					/{nickname}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>'
				).replace(
					/{success}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量</span>&nbsp;</span>'
				).replace(
					/{error}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量</span>&nbsp;</span>'
				).replace(
					/{activityName}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">活动名称</span>&nbsp;</span>'
				).replace(
					/{oneLevel}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">任务剩余库存</span>&nbsp;</span>'
				).replace(
					/{twoLevel}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">二阶任务剩余库存</span>&nbsp;</span>'
				).replace(
					/{threeLevel}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">三阶任务剩余库存</span>&nbsp;</span>'
				)
					.replace(/\n/g, "<br/>")
			},
			handleCancelEdit () {
				this.template_data1 = []
				this.msgVisible = false
			},
			handleEditOk () {
				this.template_data = JSON.parse(JSON.stringify(this.template_data1))
				this.templateData.data = this.template_data
				this.template_data1 = []
				this.$emit('changeText', this.templateId, this.template_data, this.index)
				this.msgVisible = false
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
				let text = self.lastNode.textContent.replace(/\s粉丝昵称\s/g, '粉丝昵称').replace(/\s活动名称\s/g, '活动名称').replace(/\s已完成任务量\s/g, '已完成任务量').replace(/\s未完成任务量\s/g, '未完成任务量').replace(/\s任务剩余库存\s/g, '任务剩余库存').replace(/\s二阶任务剩余库存\s/g, '二阶任务剩余库存').replace(/\s三阶任务剩余库存\s/g, '三阶任务剩余库存')
				this.$set(this.wordNum, textIndex, text.length)
				this.$forceUpdate()
				if (this.wordNum[textIndex] <= this.wordLimit[textIndex]) {
					this.textAreaValue[textIndex] = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.template_data1[textIndex].value = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">活动名称<\/span>(&nbsp;)?/g, '{activityName}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量<\/span>(&nbsp;)?/g, '{success}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量<\/span>(&nbsp;)?/g, '{error}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">任务剩余库存<\/span>(&nbsp;)?/g, '{oneLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">二阶任务剩余库存<\/span>(&nbsp;)?/g, '{twoLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">三阶任务剩余库存<\/span>(&nbsp;)?/g, '{threeLevel}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
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
					this.template_data1[textIndex].value = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">活动名称<\/span>(&nbsp;)?/g, '{activityName}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量<\/span>(&nbsp;)?/g, '{success}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量<\/span>(&nbsp;)?/g, '{error}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">任务剩余库存<\/span>(&nbsp;)?/g, '{oneLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">二阶任务剩余库存<\/span>(&nbsp;)?/g, '{twoLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">三阶任务剩余库存<\/span>(&nbsp;)?/g, '{threeLevel}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')

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
				console.log(this.template_data[key].color)
				this.template_data[key].color = this.template_data[key].color
					? this.template_data[key].color.hex
						? this.template_data[key].color.hex
						: this.template_data[key].color
					: "#000000";
				return this.template_data[key].color
			},
			fc1 (key) {
				this.template_data1[key].color = this.template_data1[key].color
					? this.template_data1[key].color.hex
						? this.template_data1[key].color.hex
						: this.template_data1[key].color
					: "#000000";
				return this.template_data1[key].color
			},
			changeContentInput (operation) {
				if (operation.api.origElements.innerHTML == '' || operation.api.origElements.innerHTML == '<br>') {
					operation.api.origElements.innerHTML = '<p><br/></p>'
				}

				const textIndex = parseInt(self.lastNode.dataset.key);
				let text = self.lastNode.textContent.replace(/\s粉丝昵称\s/g, '粉丝昵称').replace(/\s活动名称\s/g, '活动名称').replace(/\s已完成任务量\s/g, '已完成任务量').replace(/\s未完成任务量\s/g, '未完成任务量').replace(/\s任务剩余库存\s/g, '任务剩余库存').replace(/\s二阶任务剩余库存\s/g, '二阶任务剩余库存').replace(/\s三阶任务剩余库存\s/g, '三阶任务剩余库存')
				this.$set(this.wordNum, textIndex, text.length)
				// this.wordNum[textIndex] = self.lastNode.textContent.length
				if (this.wordNum[textIndex] <= this.wordLimit[textIndex]) {
					this.textAreaValue[textIndex] = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.template_data1[textIndex].value = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">活动名称<\/span>(&nbsp;)?/g, '{activityName}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量<\/span>(&nbsp;)?/g, '{success}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量<\/span>(&nbsp;)?/g, '{error}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">任务剩余库存<\/span>(&nbsp;)?/g, '{oneLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">二阶任务剩余库存<\/span>(&nbsp;)?/g, '{twoLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">三阶任务剩余库存<\/span>(&nbsp;)?/g, '{threeLevel}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
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
			addTag: function (key, text) {
				const dom = this.mediumEditor[key].options.ownerDocument
				const html =
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">' + text + '</span>&nbsp;</span>';
				const textIndex = parseInt(self.lastNode.dataset.key);
				if (this.wordLimit[textIndex] - this.wordNum[textIndex] >= text.length) {
					this.insertHTMLEmoji(dom, html);
				}
			},
			addTaskSchedule (index) {
				this.temIndex = index
				this.linkTitle = ''
				this.listVisible = true
			},
			handleOk () {
				if (this.linkTitle.trim() == '') {
					this.$message.destroy()
					this.$message.warning('链接文本不能为空')
					return false
				}
				let dom = this.mediumEditor[this.temIndex].options.ownerDocument
				let html =
					'<a href="\{url\}">' + this.linkTitle + '</a>'
				if (this.wordLimit[this.temIndex] - this.wordNum[this.temIndex] >= this.linkTitle.length) {
					this.insertHTMLEmoji(dom, html)
				}
				this.listVisible = false
				this.linkTitle = ''
			},
			handleCancel () {
				this.listVisible = false
				this.linkTitle = ''
			},
			//让颜色插件浮层渲染到父节点上
			getPopupContainer2 (trigger) {
				return trigger;
			}
		},
		mounted () {
			this.template_data = this.templates.template_context
			for (var i = 0; i < this.template_data.length; i++) {
				this.showSketch.push(false);
				this.template_data[i].color = this.defaultColor
				this.template_data[i].start.color = this.defaultColor2
				this.template_data[i].end.color = this.defaultColor2
				this.textAreaValue.push("");
				let a = 0
				let b = 20
				this.wordNum.push(a)
				this.wordLimit.push(b)
				this.emojiShow.push({
					show  : false,
					keyVal: i
				});
			}
			this.templateData.data = this.template_data
			this.templateData.title = this.templates.title
			this.templateData.is_url = this.templates.is_url
			this.templateVisible = true
		}
	}
</script>

<style lang="less" scoped>
	.content-editable {
		/deep/ p {
			margin: 0;
			min-height: 21px;
		}
	}

	.icon-btn {
		margin-right: 10px;
	}

	.color-box {
		display: inline-block;
		width: 62px;
		height: 30px;
		line-height: 30px;
		margin: 10px 31px;
		border: 1px solid #CCC;
		cursor: pointer;
		vertical-align: top;
	}

	.color-show {
		width: 16px;
		height: 16px;
		display: inline-block;
		margin: 0 10px;
	}

	.msg_content_body {
		background: #FFFFFF;
		border: 1px solid #E9E9E9;
		border-radius: 4px;
		margin: auto;
		padding: 10px 13px;
		font-size: 14px;
		color: #333333;
		line-height: 24px;
		margin: 20px 0;
	}
</style>