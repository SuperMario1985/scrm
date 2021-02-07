<!--渠道活码周期及时期欢迎语文本专属 -->
<template>
	<div>
		<medium-editor ref="medium_editor"
		               class="content-editable"
		               :text="textAreaValueHeader"
		               :options="options"
		               @editorCreated="editorCreated"
		               @edit="changeContentInput"
		               custom-tag="div"/>
		<div style="margin-right: 15px;margin-top: 10px; float: right;">
			{{wordNum}}/{{wordLimit}}
		</div>
		<div v-if="isNickName || isEmoji" style="padding: 0 15px;margin-top: 10px;">
			点击插入：
			<a-button v-if="isNickName" class="ant-tag ant-tag-orange"
			          size="small"
			          @click="addTag">客户名称
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
		<div class="changeType-text">
			提示：火狐浏览器可能出现无法正确插入客户名称，请使用谷歌、360浏览器
		</div>
	</div>
</template>

<script>
	import editor from 'vue2-medium-editor'
	import WEmoji from "@/common/js/wechatEmoji.js"
	import { VEmojiPicker } from "v-emoji-picker"

	export default {
		name      : "channelCodeEditor",
		components: {
			VEmojiPicker, 'medium-editor': editor
		},
		props     : {
			text     : {          // 纯文本数据
				type   : String,
				default: ''
			},
			textValue: {          // 带标签数据
				type   : String,
				default: ''
			},
			isNickName: {         // 是否展示添加昵称 默认展示
				type   : Boolean,
				default: true,
			},
			isEmoji: {            // 是否显示表情 默认展示
				type  : Boolean,
				default: true,
			},
			type : {
				type  : Number,
				default: 1,       // 1周期 2时期
			},
			index : {
				type  : Number,
				default: 0,       // 周或时期下标
			},
			idx : {
				type  : Number,
				default: 0,       // 周或时期内时间下标
			}
		},
		data () {
			return {
				textContent        : '', // 文本
				textAreaValueHeader: '', // 带标签文本
				emojiShow          : false, // 展示
				wordNum            : 0, // 当前字数
				wordLimit          : 1000, // 限制1000
				mediumEditor       : '', // editor对象
				options            : {  // 配置
					toolbar      : false,
					placeholder  : {
						text: ""
					},
					anchorPreview: false,
					paste        : {
						forcePlainText : true,
						cleanPastedHTML: true,
						cleanAttrs     : ['class', 'style', 'dir', 'align', 'width', 'height', 'face', 'title', 'code', 'name', 'id', 'type', 'span', 'border', 'open', 'action', 'method', 'cols', 'for', 'rel', 'label', 'icon', 'value', 'max', 'min', 'classid']
					}
				},
				keydownNode     : false,
				keydownNodeIndex: 0,
			}
		},
		mounted () {
			let _this = this
			this.textContent = this.text
			let a =this.textContent.replace(/{nickname}/g, ' 客户名称 ').replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '')
			this.wordNum = a.length
			this.textAreaValueHeader = "<p>" + this.textValue + '</p>'
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
				var dom = this.mediumEditor.options.ownerDocument
				if (this.wordLimit - this.wordNum >= 2) {
					this.insertHTMLCommand(dom, dataEmoji.data)
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
					if (typeof this.urlId == 'undefined') {
						this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称<\/span>(&nbsp;)?/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}
				}

				this.mediumEditor.origElements.scrollTop = this.mediumEditor.origElements.scrollHeight

				let event = {
					currentTarget: this.mediumEditor.origElements
				}
				this.mediumEditor.events.updateInput(event.currentTarget, event);
				this.$emit('changeText', this.textContent, this.textAreaValueHeader, this.type, this.index, this.idx)
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
					// console.log(123);
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

					if (typeof this.urlId == 'undefined') {
						this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称<\/span>(&nbsp;)?/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}

					this.wordNum = this.wordLimit
				}
				this.$emit('changeText', this.textContent, this.textAreaValueHeader, this.type, this.index, this.idx)
			}
			,
			changeContentInput (operation) {
				if (operation.api.origElements.innerHTML == '' || operation.api.origElements.innerHTML == '<br>') {
					operation.api.origElements.innerHTML = '<p><br/></p>'
				}

				//判断链接格式
				var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
				if (reg.test(operation.api.origElements.innerHTML)) {
					this.$message.error('请填写正确的链接')
					this.mediumEditor.execAction('unlink')
				}

				// var dom = this.mediumEditor.options.ownerDocument
				// this.insertHTMLCommand(dom, '')
				if (self.lastNode) {
					// console.log(333, self.lastNode)
					this.wordNum = self.lastNode.textContent.length
					if (this.wordNum <= this.wordLimit) {
						this.textAreaValueHeader = operation.api.origElements.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
						if (typeof this.urlId == 'undefined') {
							this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称<\/span>(&nbsp;)?/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
						} else {
							this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
						}

					    // console.log(111, this.textAreaValueHeader)
						this.$emit('changeText', this.textContent, this.textAreaValueHeader, this.type, this.index, this.idx)
					} else {
						// console.log(222, this.textAreaValueHeader)
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
			//点击插入客户名称标签
			addTag: function () {
				if (typeof this.mediumEditor.options.ownerDocument == 'undefined') {
					var dom = this.mediumEditor.options.ownerDocument
				} else {
					var dom = this.mediumEditor.options.ownerDocument
				}
				let html =
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>'
				// if(this.textContent == '') {
				// 	html =
				// 		'<p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span></p>'
				// }

				if (this.wordLimit - this.wordNum >= 6) {
					this.insertHTMLCommand(dom, html)
				}
			}
			,
		}
	}
</script>

<style lang="less" scoped>
	@import '../../style/_style.less';
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