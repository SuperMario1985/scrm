<template>
	<div>
		<medium-editor ref="medium_editor"
		               class="content-editable"
		               :text="textAreaValueHeader"
		               :options="options"
		               @editorCreated="editorCreated"
		               @edit="changeContentInput"
		               custom-tag="div"/>
		<div style="padding-right: 15px;text-align: right;">
			{{wordNum}}/{{wordLimit}}
		</div>
		<div v-if="isNickName || isEmoji || isList || isFissionTag" style="padding: 0 10px;">
			点击插入：
			<a-button v-if="isNickName" class="ant-tag ant-tag-orange"
			          size="small"
			          @click="addTag('昵称')">
				<template v-if="isFriend">好友昵称</template>
				<template v-if="isPart">参与者昵称</template>
				<template v-if="!isFriend && !isPart">昵称</template>
			</a-button>
			<a-button v-if="isFissionTag" class="ant-tag ant-tag-orange"
			          size="small"
			          @click="addTag('已完成任务量')">已完成任务量
			</a-button>
			<a-button v-if="isFissionTag" class="ant-tag ant-tag-orange"
			          size="small"
			          @click="addTag('未完成任务量')">未完成任务量
			</a-button>
			<!--			<a-popover>-->
			<!--				<span slot="content">-->
			<!--					<p style="margin: 5px 0;">-->
			<a-button v-if="isFissionTag" class="ant-tag ant-tag-orange"
			          size="small"
			          @click="addTag('任务剩余库存')">任务剩余库存
			</a-button>
			<!--					</p>-->
			<!--					<p style="margin: 5px 0;">-->
			<!--						<a-button class="ant-tag ant-tag-orange"-->
			<!--						          size="small"-->
			<!--						          @click="addTag('二阶任务剩余库存')">二阶任务剩余库存-->
			<!--						</a-button>-->
			<!--					</p>-->
			<!--					<p style="margin: 5px 0;">-->
			<!--						<a-button class="ant-tag ant-tag-orange"-->
			<!--						          size="small"-->
			<!--						          @click="addTag('三阶任务剩余库存')">三阶任务剩余库存-->
			<!--						</a-button>-->
			<!--					</p>-->
			<!--				</span>-->
			<!--				<a-button v-if="isFissionTag" class="ant-tag ant-tag-orange" size="small">库存剩余</a-button>-->
			<!--			</a-popover>-->
			<a-button v-if="isList" class="ant-tag ant-tag-orange"
			          size="small"
			          @click="addTaskSchedule(1)">兑奖链接
			</a-button>
			<a-button v-if="isRanking" class="ant-tag ant-tag-orange"
			          size="small"
			          @click="addTaskSchedule(2)">排行榜链接
			</a-button>
			<a-popover trigger="click" v-if="isEmoji"
			           :destroyTooltipOnHide="true"
			           v-model="emojiShow">
				<VEmojiPicker slot="content"
				              :showSearch="false"
				              @select="onSelectEmoji"/>
				<a-icon type="smile" class="icon-btn"
				        style="cursor: pointer;"/>
			</a-popover>
		</div>
		<!--		<div class="changeType-text">-->
		<!--			提示：火狐浏览器可能出现无法正确插入昵称，请使用谷歌、360浏览器-->
		<!--		</div>-->
		<a-modal :title="modalTitle" v-model="listVisible">
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
			<div class="phoneView-txt" v-if="type==1">
				这里只需要输入兑奖链接文本即可。不填写，则默认为【点此领取奖品吧~】
			</div>
			<div class="phoneView-txt" v-if="type==2">
				这里只需要输入排行榜链接文本即可。不填写，则默认为【查看排行榜】。
			</div>
		</a-modal>
	</div>
</template>

<script>
	import editor from 'vue2-medium-editor'
	import WEmoji from "@/common/js/wechatEmoji.js"
	import { VEmojiPicker } from "v-emoji-picker"

	export default {
		name      : "editor",
		components: {
			VEmojiPicker, 'medium-editor': editor
		},
		props     : {
			text        : {          // 纯文本数据
				type   : String,
				default: ''
			},
			textValue   : {          // 带标签数据
				type   : String,
				default: ''
			},
			isNickName  : {         // 是否展示添加昵称 默认展示
				type   : Boolean,
				default: true,
			},
			isFriend    : {         // 好友昵称
				type   : Boolean,
				default: false,
			},
			isPart      : {         // 参与者昵称
				type   : Boolean,
				default: false,
			},
			isFissionTag: {        // 裂变引流添加的一些按钮是否显示
				type   : Boolean,
				default: true,
			},
			isEmoji     : {            // 是否显示表情 默认展示
				type   : Boolean,
				default: true,
			},
			isList      : {     // 是否任务进度 默认展示
				type   : Boolean,
				default: true,
			},
			index       : {
				type   : Number,
				default: 0
			},
			isRanking   : {     // 排行榜链接 默认不展示
				type   : Boolean,
				default: false,
			},
		},
		watch     : {
			text     : {
				handler (newVal) {
					this.textContent = newVal
					let a = this.textContent.replace(/{nickname}/g, ' 昵称 ').replace(/{success}/g, ' 已完成任务量 ').replace(/{error}/g, ' 未完成任务量 ').replace(/{oneLevel}/g, ' 任务剩余库存 ').replace(/{twoLevel}/g, ' 二阶任务剩余库存 ').replace(/{threeLevel}/g, ' 三阶任务剩余库存 ').replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '')
					this.wordNum = a.length
				},
				deep: true
			},
			textValue: {
				handler (newVal) {
					this.textAreaValueHeader = newVal
				},
				deep: true
			}
		},
		data () {
			let thisGlobal = this.global
			let that = this
			let MiniProgramButton = editor.MediumEditor.Extension.extend({
				name: "miniProgram",

				init: function (options) {
					this.button = this.document.createElement("button");
					this.button.classList.add(
						"medium-editor-action",
						"medium-editor-miniprogram-action"
					);
					this.button.innerHTML = "设置小程序";

					this.on(this.button, "click", this.handleClick.bind(this));
				},

				getButton: function () {
					return this.button;
				},

				getInstance: function () {
					return this;
				},

				handleClick: function (event) {
					let currentMediumEditor = that.mediumEditor
					currentMediumEditor.saveSelection();

					let liElement = event.path[1]
					const toolbarWidth = liElement.parentElement.clientWidth;
					const toolbarHeight = liElement.parentElement.clientHeight;

					this.addMiniProgramForm(event);

					let domMiniProgram = liElement.parentElement.nextSibling.nextSibling
					const miniProgramWidth = 336;
					const miniProgramHeight = domMiniProgram.clientHeight;
					const domLeft = (toolbarWidth - miniProgramWidth) / 2;
					const domTop = toolbarHeight - miniProgramHeight + 2; // 加 2 是为了消除底部的重叠区域

					domMiniProgram.style.cssText =
						"display: block; visibility: visible; left: " + domLeft + "px; top: " + domTop + "px; width: " + miniProgramWidth + "px; position:absolute;";

					this.on(
						document.getElementById("miniSave"),
						"click",
						function () {
							let inpValue1 = liElement.parentElement.nextSibling.nextSibling.firstChild.children[0].value
							let inpValue2 = liElement.parentElement.nextSibling.nextSibling.firstChild.children[1].value
							let inpValue3 = liElement.parentElement.nextSibling.nextSibling.firstChild.children[2].value

							var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
							if (inpValue1 == '' || inpValue2 == '' || inpValue3 == '') {
								message.error("请填写小程序相关信息");
								return false
							} else if (reg.test(inpValue3)) {
								message.error("备用网页错误或不存在");
								return false
							} else {
								currentMediumEditor.restoreSelection()
								currentMediumEditor.execAction("unlink")

								thisGlobal.createMiniPLink({
									url : inpValue3,
									data: {
										miniprogramappid: inpValue1,
										miniprogrampath : inpValue2
									}
								}, currentMediumEditor)
								currentMediumEditor.trigger("editableInput", {}, currentMediumEditor.origElements);


								domMiniProgram.parentElement.removeChild(
									this.document.getElementById(
										"medium-editor-toolbar-form-miniProgram"
									)
								)
							}
						}.bind(this)
					);
					this.on(
						this.document.getElementById("miniClose"),
						"click",
						function (e) {
							domMiniProgram.parentElement.removeChild(
								this.document.getElementById(
									"medium-editor-toolbar-form-miniProgram"
								)
							);
						}.bind(this)
					);
				},

				addMiniProgramForm: function (event) {
					let miniProgramForm = this.document.createElement("div");
					miniProgramForm.classList.add("medium-editor-toolbar-miniProgram", "medium-editor-toolbar-form", "medium-editor-toolbar-form-active");
					miniProgramForm.style.padding = "10px";
					miniProgramForm.style.width = "410px";
					miniProgramForm.id = "medium-editor-toolbar-form-anchor-miniProgram";
					miniProgramForm.innerHTML = [
						'<input type="text" class="medium-editor-toolbar-input miniProgram-appid-input miniProgram-inp1" ' +
						'placeholder="填写小程序AppID，跳转小程序需与当前公众号绑定关联关系" style="display: block;width: 400px;">',
						'<input type="text" class="medium-editor-toolbar-input miniProgram-path-input miniProgram-inp2" placeholder="填写小程序路径，例如：pages/index" style="display: block;width: 400px;">',
						'<input type="text" class="medium-editor-toolbar-input miniProgram-url-input miniProgram-inp3" placeholder="备用网页，以http://或https://开头" style="display: block;width: 400px;">',
						'<div class="btn-wrap" style="overflow: hidden;"><div style="float: right;"><a href="#" id="miniSave" class="medium-editor-toolbar-save">✓</a><a href="#" id="miniClose" class="medium-editor-toolbar-close">×</a></div></div>'
					].join("");

					let miniProgramWrap = this.document.createElement("div");
					miniProgramWrap.classList.add("medium-editor-toolbar-miniProgram-wrap");
					miniProgramWrap.id = "medium-editor-toolbar-form-miniProgram";
					miniProgramWrap.appendChild(miniProgramForm);

					let liElement = event.path[1]
					liElement.parentElement.parentElement.appendChild(miniProgramWrap);
				}
			})
			return {
				textContent        : '', // 文本
				textAreaValueHeader: '', // 带标签文本
				emojiShow          : false, // 展示
				wordNum            : 0, // 当前字数
				wordLimit          : 500, // 限制500
				mediumEditor       : '', // editor对象
				options            : {  // 配置
					toolbar      : {
						buttons: [
							{
								name          : "anchor",
								contentDefault: "设置链接"
							},
							{
								name: "miniProgram"
							},
							{
								name          : "removeFormat",
								action        : "unlink",
								contentDefault: "移除链接"
							}
						]
					},
					anchor       : {
						linkValidation : true,
						placeholderText: "输入链接，以http://或https://开头"
					},
					placeholder  : {
						text: ""
					},
					anchorPreview: false,
					extensions   : {
						miniProgram: new MiniProgramButton({})
					},
					paste        : {
						forcePlainText : true,
						cleanPastedHTML: true,
						cleanAttrs     : ['class', 'style', 'dir', 'align', 'width', 'height', 'face', 'title', 'code', 'name', 'id', 'type', 'span', 'border', 'open', 'action', 'method', 'cols', 'for', 'rel', 'label', 'icon', 'value', 'max', 'min', 'classid']
					}
				},
				keydownNode        : false,
				keydownNodeIndex   : 0,
				listVisible        : false,
				linkTitle          : '',
				modalTitle         : '',
				type               : '',
			}
		},
		mounted () {
			localStorage.removeItem('editorIndex')
			let _this = this
			this.textContent = this.text
			let a = this.textContent.replace(/{nickname}/g, ' 昵称 ').replace(/{success}/g, ' 已完成任务量 ').replace(/{error}/g, ' 未完成任务量 ').replace(/{oneLevel}/g, ' 任务剩余库存 ').replace(/{twoLevel}/g, ' 二阶任务剩余库存 ').replace(/{threeLevel}/g, ' 三阶任务剩余库存 ').replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '')
			this.wordNum = a.length
			this.textAreaValueHeader = this.textValue
			document.addEventListener("selectionchange", function () {
				_this.getCursor(self)
			})
		},
		methods   : {
			// 初始化文本信息的格式
			initTextMsgContent (content) {
				const _this = this
				if (content.search(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g) !== -1) {
					WEmoji.wechatEmojiKey.map(alt => {
						let preg = new RegExp(_this.utils.addslashes(alt), "g")
						let emojiUrl = WEmoji.getEmojiUrl(alt)
						content = content.replace(
							preg,
							'<img src="' +
							emojiUrl +
							'" alt="' +
							alt +
							'" height="21" width="21"/>'
						)
					})
				}
				return content.replace(/[\r\n|\n]/g, "<br/>")
			}
			,
			// 修改emoji的显示与否的参数
			toggleDialogEmoji () {
				this.emojiShow = !this.emojiShow
			}
			,
			// 选择emoji表情的事件
			onSelectEmoji (dataEmoji) {
				let flag = false
				if (localStorage.getItem('editorIndex') != this.index) {
					if (this.mediumEditor.origElements.innerText.trim().length == 0) {
						flag = true
						this.mediumEditor.origElements.innerHTML = '<p>' + dataEmoji.data + '</p>'
						this.mediumEditor.origElements.innerText = dataEmoji.data + '\n'
						this.textAreaValueHeader = '<p>' + dataEmoji.data + '</p>'
					}
					this.$nextTick(() => {
						let nodes = this.$refs.medium_editor.$el.childNodes
						let node = nodes[nodes.length - 1]
						let c = node
						while (c.lastChild) {
							c = c.lastChild
						}
						if (!c) {
							c = node
						}
						let newRange = document.createRange()
						newRange.setStart(c, c.textContent.length)
						let newSelection = window.getSelection()
						newSelection.removeAllRanges()
						newSelection.addRange(newRange)
						this.getCursor(self)

					})
					this.$forceUpdate()
					if (flag) {
						this.toggleDialogEmoji()
						return false
					}
					this.$nextTick(() => {
						let dom = this.mediumEditor.options.ownerDocument
						if (this.wordLimit - this.wordNum >= 2) {
							this.insertHTMLCommand(dom, dataEmoji.data)
						}
					})
				} else {
					this.$nextTick(() => {
						let dom = this.mediumEditor.options.ownerDocument
						if (this.wordLimit - this.wordNum >= 2) {
							this.insertHTMLCommand(dom, dataEmoji.data)
						}
					})
				}
				this.toggleDialogEmoji()
			}
			,
			// 获取最后的文本选择框焦点
			getCursor (self) {
				let sel = getSelection()
				if (!sel) {
					return
				}
				let node = sel.anchorNode
				let isIn = false
				while (node && node.nodeType != node.DOCUMENT_NODE) {
					var cls = node.classList
					if (cls && cls.contains("content-editable")) {
						isIn = true
						break
					}
					node = node.parentNode
				}
				if (!isIn) return
				self.lastRange = sel.getRangeAt(0)
				self.lastNode = node
			}
			,
			// 插入自定义HTML
			insertHTMLCommand (doc, html) {
				if (typeof self.lastNode === 'undefined' || !self.lastNode.classList.contains("content-editable")) {
					return false
				}

				let range, toReplace, el, fragment, node, lastNode, ecArgs = ['insertHTML', false, html]

				range = self.lastRange
				toReplace = range.commonAncestorContainer

				if (editor.MediumEditor.util.isMediumEditorElement(toReplace) && !toReplace.firstChild) {
					range.selectNode(toReplace.appendChild(doc.createTextNode('')))
				} else if ((toReplace.nodeType === 3 && range.startOffset === 0 && range.endOffset === toReplace.nodeValue.length) ||
					(toReplace.nodeType !== 3 && toReplace.innerHTML === range.toString())) {
					// Ensure range covers maximum amount of nodes as possible
					// By moving up the DOM and selecting ancestors whose only child is the range
					while (!editor.MediumEditor.util.isMediumEditorElement(toReplace) &&
					toReplace.parentNode &&
					toReplace.parentNode.childNodes.length === 1 &&
					!editor.MediumEditor.util.isMediumEditorElement(toReplace.parentNode)) {
						toReplace = toReplace.parentNode
					}
					range.selectNode(toReplace)
				}
				range.deleteContents()

				el = doc.createElement('div')
				el.innerHTML = html
				fragment = doc.createDocumentFragment()
				while (el.firstChild) {
					node = el.firstChild
					lastNode = fragment.appendChild(node)
				}
				range.insertNode(fragment)

				// Preserve the selection:
				if (lastNode) {
					range = range.cloneRange()
					range.setStartAfter(lastNode)
					range.collapse(true)
					editor.MediumEditor.selection.selectRange(doc, range)
				}

				if (doc.execCommand.callListeners) {
					doc.execCommand.callListeners(ecArgs, true)
				}
				this.wordNum = self.lastNode.textContent.length
				if (this.wordNum <= this.wordLimit) {
					this.textAreaValueHeader = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量<\/span>(&nbsp;)?/g, '{success}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量<\/span>(&nbsp;)?/g, '{error}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">任务剩余库存<\/span>(&nbsp;)?/g, '{oneLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">二阶任务剩余库存<\/span>(&nbsp;)?/g, '{twoLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">三阶任务剩余库存<\/span>(&nbsp;)?/g, '{threeLevel}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
				}

				this.mediumEditor.origElements.scrollTop = this.mediumEditor.origElements.scrollHeight

				let event = {
					currentTarget: this.mediumEditor.origElements
				}
				this.mediumEditor.events.updateInput(event.currentTarget, event);
				this.$emit('changeText', this.textContent, this.textAreaValueHeader, this.index)
			}
			,
			// 插件初始化成功的回调
			editorCreated (mediumEditor) {
				this.mediumEditor = mediumEditor
				this.mediumEditor.subscribe('focus', this.editableFocus);
				this.mediumEditor.subscribe('editableKeydown', this.editableKeydown);
				this.mediumEditor.subscribe('editablePaste', this.editablePaste);
				delete self.lastRange
				delete self.lastNode
			}
			,
			// 文本域获取焦点
			editableFocus (e) {
				localStorage.setItem('editorIndex', this.index)
				if (e.target.innerHTML === '' || e.target.innerHTML == '<br>' || e.target.innerHTML == '<p></p>') {
					e.target.innerHTML = '<p><br/></p>';
				}
			},
			//监听键盘事件，超过300字，不让输入
			editableKeydown (event) {
				if (this.wordNum >= this.wordLimit && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && !(event.keyCode == 65 && (event.metaKey || event.ctrlKey))) {
					event.preventDefault();
				}

				if (event.keyCode == 86 && (event.metaKey || event.ctrlKey)) {
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
				const customNode = this.mediumEditor.origElements
				const {startNode, startOffset, endNode, endOffset} = this.global.getRangeInfo(customNode, this.wordLimit);

				if (typeof startNode.nodeValue !== 'undefined') {
					let newRange = document.createRange()
					newRange.setStart(startNode, startOffset);
					newRange.setEnd(endNode, endOffset);
					newRange.deleteContents()

					this.textAreaValueHeader = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量<\/span>(&nbsp;)?/g, '{success}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量<\/span>(&nbsp;)?/g, '{error}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">任务剩余库存<\/span>(&nbsp;)?/g, '{oneLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">二阶任务剩余库存<\/span>(&nbsp;)?/g, '{twoLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">三阶任务剩余库存<\/span>(&nbsp;)?/g, '{threeLevel}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					this.wordNum = this.wordLimit
				}
				this.$emit('changeText', this.textContent, this.textAreaValueHeader, this.index)
			}
			,
			changeContentInput (operation) {
				if (operation.api.origElements.innerHTML == '' || operation.api.origElements.innerHTML == '<br>') {
					operation.api.origElements.innerHTML = '<p><br/></p>'
				}

				//判断链接格式
				var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
				var reg1 = /href="\{url\}"/g
				var reg2 = /href="\{ranking\}"/g
				var innerHtml = operation.api.origElements.innerHTML
				if (reg.test(innerHtml) && !reg1.test(innerHtml) && !reg2.test(innerHtml)) {
					this.$message.error('请填写正确的链接')
					this.mediumEditor.execAction('unlink')
				}

				// var dom = this.mediumEditor.options.ownerDocument
				// this.insertHTMLCommand(dom, '')
				if (self.lastNode) {
					this.wordNum = self.lastNode.textContent.length
					if (this.wordNum <= this.wordLimit) {
						this.textAreaValueHeader = operation.api.origElements.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
						this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量<\/span>(&nbsp;)?/g, '{success}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量<\/span>(&nbsp;)?/g, '{error}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">任务剩余库存<\/span>(&nbsp;)?/g, '{oneLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">二阶任务剩余库存<\/span>(&nbsp;)?/g, '{twoLevel}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">三阶任务剩余库存<\/span>(&nbsp;)?/g, '{threeLevel}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
						this.$emit('changeText', this.textContent, this.textAreaValueHeader, this.index)
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
				}
			}
			,
			//点击插入昵称标签
			addTag: function (text) {
				let flag = false
				let html = '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">' + text + '</span>&nbsp;</span>'
				if (localStorage.getItem('editorIndex') != this.index) {
					if (this.mediumEditor.origElements.innerText.trim().length == 0) {
						html = '<p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">' + text + '</span>&nbsp;</span></p>'
						flag = true
						this.mediumEditor.origElements.innerHTML = html
						this.mediumEditor.origElements.innerText = ' ' + text + ' '
						this.textAreaValueHeader = html
					}
					this.$nextTick(() => {
						let nodes = this.$refs.medium_editor.$el.childNodes
						let node = nodes[nodes.length - 1]
						let c = node
						while (c.lastChild) {
							c = c.lastChild
						}
						if (!c) {
							c = node
						}
						let newRange = document.createRange()
						newRange.setStart(c, c.textContent.length)
						let newSelection = window.getSelection()
						newSelection.removeAllRanges()
						newSelection.addRange(newRange)
						this.getCursor(self)
					})
					this.$forceUpdate()
					if (flag) {
						return false
					}
					this.$nextTick(() => {
						let dom = this.mediumEditor.options.ownerDocument
						if (this.wordLimit - this.wordNum >= text.length + 2) {
							this.insertHTMLCommand(dom, html)
						}
					})
				} else {
					this.$nextTick(() => {
						let dom = this.mediumEditor.options.ownerDocument
						if (this.wordLimit - this.wordNum >= text.length + 2) {
							this.insertHTMLCommand(dom, html)
						}
					})
				}
			}
			,
			addTaskSchedule (type) {
				this.type = type
				if (type == 1) {
					this.modalTitle = '插入兑奖'
				} else if (type == 2) {
					this.modalTitle = '插入排行榜'
				}
				this.linkTitle = ''
				this.listVisible = true
			},
			handleOk () {
				let flag = false
				let html = ''
				if (this.type == 1) {
					if (this.linkTitle.trim() == '') {
						this.linkTitle = '点此领取奖品吧~'
					}
					html = '<a href="\{url\}">' + this.linkTitle + '</a>'
				} else if (this.type == 2) {
					if (this.linkTitle.trim() == '') {
						this.linkTitle = '查看排行榜'
					}
					html = '<a href="\{ranking\}">' + this.linkTitle + '</a>'
				}
				if (this.mediumEditor.origElements.innerText.trim().length == 0) {
					html = "<p>" + html + '</p>'
				}

				if (localStorage.getItem('editorIndex') != this.index) {
					if (this.mediumEditor.origElements.innerText.trim().length == 0) {
						flag = true
						this.mediumEditor.origElements.innerHTML = html
						this.mediumEditor.origElements.innerText = ' ' + this.linkTitle + ' '
						this.textAreaValueHeader = html
					}
					this.$nextTick(() => {
						let nodes = this.$refs.medium_editor.$el.childNodes
						let node = nodes[nodes.length - 1]
						let c = node
						while (c.lastChild) {
							c = c.lastChild
						}
						if (!c) {
							c = node
						}
						let newRange = document.createRange()
						newRange.setStart(c, c.textContent.length)
						let newSelection = window.getSelection()
						newSelection.removeAllRanges()
						newSelection.addRange(newRange)
						this.getCursor(self)
					})
					this.$forceUpdate()
					if (flag) {
						this.listVisible = false
						this.linkTitle = ''
						return false
					}
					this.$nextTick(() => {
						let dom = this.mediumEditor.options.ownerDocument
						if (this.wordLimit - this.wordNum >= this.linkTitle.length) {
							this.insertHTMLCommand(dom, html)
						}
					})
				} else {
					let dom = this.mediumEditor.options.ownerDocument
					if (this.wordLimit - this.wordNum >= this.linkTitle.length) {
						this.insertHTMLCommand(dom, html)
					}
				}
				this.listVisible = false
				this.linkTitle = ''
			},
			handleCancel () {
				this.listVisible = false
				this.linkTitle = ''
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../style/_style.less';
	@import "../../style/default.css";
	@import "../../style/medium-editor-toolbar.css";

	.changeType-text {
		background: @color-bgc;
		border: 1px solid @border-color;
		border-radius: 2px;
		padding: 7px 27px 6px 10px;
		font-size: 12px;
		width: 100%;
		margin-top: 12px;
		/*max-width: 673px;*/
		line-height: 20px;
		margin-bottom: 15px;
	}

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		border: 1px solid #D9D9D9;
		height: 148px;
		overflow: auto;

		/deep/ p {
			margin: 2px;
			/*display: inline-block;*/
			word-break: break-word;
		}
	}

	.ant-tag {
		height: 24px;
	}
</style>