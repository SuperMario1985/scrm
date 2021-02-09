<template>
	<div class="">
		<div style="margin: 100px 0px 10px 0px; padding: 0 10px;" v-if="isTitle">
			<a-input style="height: 50px;" v-model="sketchTitle1"
			         placeholder="输入文章标题（请勿输入特殊字符）"
			         size="large"
			         @input.native="changeTitle"
			         :maxLength="32">
										<span slot="suffix">
						                    <span>{{sketchTitle1.length}}</span>/32
					                    </span>
			</a-input>
		</div>
		<div class="ueditor"
		     style="padding: 0px 10px;margin-top: 10px;height: calc(100% - 215px);overflow-y: auto; border-bottom: 1px solid #E2E2E2;">
			<VueUeditorWrap class="filingCabinetUeditor" :config="myConfig"
			                @beforeInit="addCustomButtom" @input="changeImageText"
			                v-model="imageText1">
			</VueUeditorWrap>
		</div>
		<!-- 选择素材弹窗 -->
		<chooseMsg :show="showModal3" :type="typeValue2" :news_type="news_type"
		           :callback="modalVisibleChange2" :chooseId="chooseId" :comefrom="comefrom"></chooseMsg>
		<!-- 网址 -->
		<a-modal :visible="linkVisible" title="超链接" @ok="handleUrl" @cancel="handleCancelUrl"
		         width="720px" :confirmLoading="confirmLoading">
			<a-form>
				<a-form-item label="链接标题" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-input v-model="linkTitle" placeholder="输入链接标题"></a-input>
				</a-form-item>
				<a-form-item label="链接地址" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-input v-model="linkUrl" placeholder="请输入跳转链接，且必须以http://或https://开头"></a-input>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal title="选择音频" v-model="musicVisible" width="888" @ok="handleMusic" @cancel="handleCancelMusic">
			<div>
				<a-input v-model="musicTitle" style="width: 600px" @keydown.enter="selectMusic(1, pageSize)"
				         placeholder="请输入歌曲名称"></a-input>
				<a-button style="margin-left: 10px;" @click="selectMusic(1, pageSize)" type="primary">搜索歌曲</a-button>
			</div>
			<div style="margin-top: 20px;">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-table
								:columns="columns"
								:dataSource="musicList"
								:pagination="false"
								:rowSelection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange,type:'radio'}"
								:rowClassName="rowClassName" v-has="'account-list'"
						>
						</a-table>

						<!-- 分页 -->
						<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0"
						     v-has="'account-list'">
							<span style="float:left;margin-left: 20px;">共{{total}}条</span>
							<a-pagination
									:total="total"
									showSizeChanger
									:showQuickJumper="quickJumper"
									:current="page"
									:pageSize="pageSize"
									:pageSizeOptions="['10','20','30']"
									@change="changePage"
									@showSizeChange="showSizeChange"
									style="float: right;"
							/>
						</div>
					</div>
				</a-spin>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import chooseMsg from "@/components/FilingCabinet/ChooseMsg"
	import chooseMsg1 from "@/components/ChooseMsg"
	import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

	export default {
		name      : "UEditor",
		components: {
			chooseMsg, chooseMsg1,
			VueUeditorWrap,
		},
		watch     : {
			'sketchTitle' (newValue, oldValue) {
				if (newValue != oldValue) {
					this.sketchTitle1 = newValue
				}
			},
			'imageText' (newValue, oldValue) {
				if (newValue != oldValue) {
					this.imageText1 = newValue
				}
			},
		},
		props     : {
			isTitle : {
				type : Boolean,
				default: true,
			},
			sketchTitle: {
				type   : String,
				default: ''
			},
			imageText  : {
				type   : String,
				default: ''
			}
		},
		data () {
			return {
				sketchTitle1   : '',
				imageText1       : '',
				myConfig       : {
					/* 工具栏按钮配置，这里采用crm\public\UEditor\ueditor.config.js的配置 */
					// toolbars: [
					// 	['fullscreen', 'source', 'undo', 'redo', 'bold']
					// ],
					// 编辑器不自动被内容撑高
					autoHeightEnabled : true,
					autoFloatEnabled  : false,
					// 初始容器高度
					initialFrameHeight: '600',
					// 初始容器宽度
					initialFrameWidth : '100%',
					// topOffset         : 190,
					// 上传文件接口
					serverUrl         : this.$store.state.siteUrl + '/UEditor/php/controller.php',
					// UEdotor文件路径
					UEDITOR_HOME_URL  : this.$store.state.siteUrl + '/UEditor/',
				},
				commonUrl      : this.$store.state.commonUrl, // 通用资源链接前缀
				showModal3     : false, // 选择素材弹窗
				typeValue2     : 0, // 素材类型
				news_type      : 1, // 图文类型 单、多
				chooseId       : 0, // 素材id
				mediumEditor   : [],   // 初始化的medium-editor
				linkVisible    : false, // 超链接弹窗显示或隐藏
				linkTitle      : '', // 超链接标题
				linkUrl        : '', // 超链接地址
				href           : '',
				title          : '',
				confirmLoading : false, // 超链接提交loading
				// 图片、小程序、音乐按钮
				imgEditor      : null,
				imgUiName      : '',
				appletEditor   : null,
				appletUiName   : '',
				comefrom       : "0", // 0 文件柜 3 图文编辑选择素材
				musicEditor    : '',
				musicName      : '',
				musicVisible   : false, // 音频弹窗
				musicTitle     : '', // 音频搜索名
				musicList      : [], // 音频列表
				columns        : [
					{
						title    : "歌名",
						dataIndex: "song_title",
						key      : "song_title",
					},
					{
						title    : "歌手",
						dataIndex: "author",
						key      : "author",
					},
					{
						title    : "专辑",
						dataIndex: "album_title",
						key      : "album_title"
					},
				],
				musicItem      : '', // 选择的音频数据
				isLoading      : false, // 音频表格加载动画
				pageSize       : 10, // 音频每页数量
				page           : 1, // 音频页码
				total          : 0, // 音频总数
				quickJumper    : false,
				selectedRowKeys: [], // 音频列表单选
			}
		},
		methods   : {
			changeTitle() {
				this.$emit('changeTitle', this.sketchTitle1)
			},
			changeImageText () {
				let that = this
				this.imageText1.replace(/<img [^>]*src=['"][data:image]([^'"]+)[^>]*>/gi, function (match, src) {
					that.uploadImgByBase64('d' + src)
				})
				this.$emit('changeImageText', this.imageText1)
			},
			async uploadImgByBase64 (src) {
				this.isLoading = true
				const {data: res} = await this.axios.post("attachment/base64-pic", {
					uid       : localStorage.getItem('uid'),
					base64Data: src
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.imageText1 = this.imageText1.replace(/<img [^>]*src=['"][data:image]([^'"]+)[^>]*>/gi, function (match, url, word_img, other) {
						if (src == 'd' + url) {
							return '<img src="' + res.data.local_path + '"/>'
						}
					})
				}
			},
			// 编辑器自定义按钮
			addCustomButtom () {
				let that = this
				// 图片
				window.UE.registerUI('image', function (editor, uiName) {
					// 创建一个 button
					let btn = new window.UE.ui.Button({
						// 按钮的名字
						name    : 'img',
						// 提示
						title   : '图片',
						// 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
						cssRules: "background-image: url(" + require('../../assets/img1.png') + ") !important;background-size: cover;",
						// 点击时执行的命令
						onclick : function () {
							that.imgEditor = editor
							that.imgUiName = uiName
							// 这里可以不用执行命令，做你自己的操作也可
							// editor.execCommand(uiName)
							that.showMsg(1)
						}
					})

					// 当点到编辑内容上时，按钮要做的状态反射
					editor.addListener('selectionchange', function () {
						var state = editor.queryCommandState(uiName)
						if (state === -1) {
							btn.setDisabled(true)
							btn.setChecked(false)
						} else {
							btn.setDisabled(false)
							btn.setChecked(state)
						}
					})
					// 因为你是添加 button，所以需要返回这个 button
					return btn
				}, 48)
				window.UE.registerUI('music', function (editor, uiName) {
					// 创建一个 button
					let btn = new window.UE.ui.Button({
						// 按钮的名字
						name    : 'music',
						// 提示
						title   : '音频',
						// 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
						cssRules: "background-image: url(" + require('../../assets/music.png') + ") !important;background-size: cover;",
						// 点击时执行的命令
						onclick : function () {
							that.musicEditor = editor
							that.musicUiName = uiName
							// 这里可以不用执行命令，做你自己的操作也可
							// editor.execCommand(uiName)
							that.showMusic()
						}
					})
					// 当点到编辑内容上时，按钮要做的状态反射
					editor.addListener('selectionchange', function () {
						var state = editor.queryCommandState(uiName)
						if (state === -1) {
							btn.setDisabled(true)
							btn.setChecked(false)
						} else {
							btn.setDisabled(false)
							btn.setChecked(state)
						}
					})
					return btn
				}, 50)
			},
			// 音频弹窗展示
			showMusic () {
				this.musicVisible = true
			},
			// 搜索歌曲
			async selectMusic (page, pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("attachment/music-list", {
					name    : this.musicTitle,
					pageSize: pageSize,
					page    : page,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.page = page
					this.pageSize = pageSize
					this.musicList = res.data.list
					this.total = res.data.total_num
				}
				this.isLoading = false
			},
			// 音频确认
			handleMusic () {
				if (this.musicItem == {}) {
					this.$message.warning("请选中歌曲")
					return false
				}
				// src="/cgi-bin/readtemplate?t=tmpl/qqmusic_tmpl" +
				// 	"&singer=%E5%BC%A0%E5%AD%A6%E5%8F%8B%20-%20%E5%8F%AA%E6%84%BF%E4%B8%80%E7%94%9F%E7%88%B1%E4%B8%80%E4%BA%BA" +
				// 	"&music_name=%E5%BF%98%E6%83%85%E5%86%B7%E9%9B%A8%E5%A4%9C" +
				// 	"&albumurl=https%3A%2F%2Fy.gtimg.cn%2Fmusic%2Fphoto_new%2FT002R68x68M000001H25AR1n6MNl.jpg" +
				// 	"&musictype=1"

				let src = "/cgi-bin/readtemplate?t=tmpl/qqmusic_tmpl&singer=" + (this.musicItem.author + '&nbsp;-&nbsp;' + this.musicItem.song_title) +
					"&music_name=" + this.musicItem.song_title +
					"&albumurl=" + this.musicItem.album_pic +
					"&musictype=1"
				let otherid = ''
				if (this.musicItem.other_singer_list.length > 0) {
					otherid = this.musicItem.other_singer_list[0].singer_id
				}
				let html = '<section class="custom_select_card_wrp wx-edui-media-wrp">' +
					'<qqmusic ' +
					'class="js_editor_qqmusic js_uneditable" ' +
					'musicid="' + this.musicItem.song_id + '"' +
					'mid="' + this.musicItem.song_mid + '"' +
					'albumurl="' + (this.musicItem.album_pic || this.musicItem.singer_pic) + '"' +
					'audiourl="' + this.musicItem.song_play_url + '"' +
					'music_name="' + this.musicItem.song_title + '"' +
					'singer="' + (this.musicItem.author + '&nbsp;-&nbsp;' + this.musicItem.song_title) + '"' +
					'play_length="' + this.musicItem.song_play_time + '"' +
					'src= "' + src + '" ' +
					'musictype="1" ' +
					'otherid="' + otherid + '" ' +
					'albumid="' + this.musicItem.album_id + '"' +
					'jumpurlkey="" ' +
					'data-pluginname="insertaudio">' +
					'</qqmusic>' +
					'</section>'
				this.musicEditor.execCommand('inserthtml', html)
				this.selectedRowKeys = []
				this.musicItem = {}
				this.musicTitle = ''
				this.musicList = []
				this.total = 0
				this.musicVisible = false
			},
			// 音频取消
			handleCancelMusic () {
				this.selectedRowKeys = []
				this.musicItem = {}
				this.musicTitle = ''
				this.musicList = []
				this.total = 0
				this.musicVisible = false
			},
			// 音频分页
			changePage (page, pageSize) {
				this.selectMusic(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.selectMusic(1, pageSize);
			},
			// 音频表格列表
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 选择音频
			onSelectChange (id, selectedRows) {
				this.selectedRowKeys = []
				this.musicItem = selectedRows[0]
				this.selectedRowKeys.push(id[0])
				console.log(this.musicItem)
			},
			// 素材弹窗
			showMsg (type) {
				this.typeValue2 = Number(type)
				if (type == 1) {
					this.comefrom = "3"
				} else {
					this.comefrom = "0"
				}
				this.showModal3 = true
			},

			// 超链接弹窗
			showLink () {
				if (this.href || this.title) {
					this.linkTitle = this.title
					this.linkUrl = this.href
				} else {
					this.linkTitle = ''
					this.linkUrl = ''
				}
				this.linkVisible = true
			},

			// 超链接弹窗确定
			handleUrl () {
				let reg = /^([hH][tT]{2}[pP]:|[hH][tT]{2}[pP][sS]:)((\\|\/)+)/;
				this.confirmLoading = true
				if (this.linkTitle == '') {
					this.$message.warning("请填写超链接标题")
					this.confirmLoading = false
					return false
				}
				if (!reg.test(this.linkUrl)) {
					this.$message.error('请检查跳转链接格式是否正确(https://或http://开头)')
					this.confirmLoading = false
					return false;
				}
				let html = '<p><a href="' + this.linkUrl + '">' + this.linkTitle + '</a></p>'
				let dom = this.mediumEditor.options.ownerDocument
				this.insertHTMLCommand(dom, html)
				this.linkVisible = false
				this.confirmLoading = false
			},
			// 超链接弹窗取消
			handleCancelUrl () {
				this.linkVisible = false
			},
			// 选择素材回调
			modalVisibleChange2 (event, e, id, data, appletType) {
				if (event == 'ok') {
					if (this.typeValue2 == 7) {
						let html = ''
						if (appletType == 1) {
							for (let i = 0; i < data.length; i++) {
								html += '<p><a href class="weapp_text_link" data-miniprogram-appid="' + data[i].appId + '" data-miniprogram-path="' + data[i].appPath + '">' + (data[i].file_name || data[i].title) + '</a></p> '
							}
						} else if (appletType == 2) {
							for (let i = 0; i < data.length; i++) {
								html += '<p><a data-miniprogram-type="image" data-miniprogram-servicetype="" data-miniprogram-appid="' + data[i].appId + '" data-miniprogram-path="' + data[i].appPath + '" href><img class="rich_pages"  src="' + (this.commonUrl + data[i].local_path) + '" alt="" data-width="null" data-ratio="0.620"/></a></p>'
							}
						} else if (appletType == 3) {
							for (let i = 0; i < data.length; i++) {
								html += '<p><mp-miniprogram ' +
									'data-miniprogram-appid="' + data[i].appId + '" ' +
									'data-miniprogram-path="' + data[i].appPath + '" ' +
									'data-miniprogram-nickname="" ' +
									'data-miniprogram-title="' + (data[i].file_name || data[i].title) + '" ' +
									'data-miniprogram-imageurl="' + (this.commonUrl + data[i].local_path) + '">' +
									'</mp-miniprogram></p>'
							}
						}
						this.appletEditor.execCommand('inserthtml', html)
					} else {
						let html = ''
						for (let i = 0; i < id.length; i++) {
							html +=
								'<p><img style="max-width: 100%;" class="rich_pages js_insertlocalimg" src="' + (this.commonUrl + data[i].local_path) + '" /></p>'
						}
						this.imgEditor.execCommand('inserthtml', html)
					}
				}
				this.showModal3 = false
			},
		}
	}
</script>

<style scoped>
	.filingCabinetUeditor >>> .edui-editor-bottomContainer {
		display: none !important;
	}

	.filingCabinetUeditor >>> #edui-for-insertimage {
		display: none !important;
	}

	.filingCabinetUeditor >>> .edui-default .edui-editor {
		border: 0px !important;
	}

	.filingCabinetUeditor >>> .edui-editor-toolbarbox {
		position: fixed;
		top: 134px;
		width: calc(100% - 762px);
		z-index: 99999;
		min-width: 600px;
	}
</style>
<style>
	#edui_fixedlayer #edui80,
	#edui_fixedlayer #edui81,
	#edui_fixedlayer #edui82,
	#edui_fixedlayer #edui83,
	#edui_fixedlayer #edui84,
	#edui_fixedlayer #edui85,
	#edui_fixedlayer #edui81,
	#edui_fixedlayer #edui96,
	#edui_fixedlayer #edui97 {
		display: none !important;
	}
</style>