<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider>
					<div style="width: 240px;margin: 0 auto;margin-top: 30px;">
						<div @click="changeCurrentIndex(index)" v-for="(item,index) in sketchList"
						     :class="index==currentIndex? 'choose-sketch': 'no-choose-sketch'"
						     style="width: 100%;">
							<div v-if="single">
								<img v-show="item.pic_url != ''"
								     alt="example"
								     draggable="false"
								     :src="commonUrl+item.pic_url"
								     slot="cover"
								     style="width: 236px;height: 131px;"
								/>
								<img v-show="item.pic_url == ''"
								     alt="example"
								     draggable="false"
								     src="../../../assets/img.png"
								     style="width: 236px; height: 131px;"
								     slot="cover"
								/>
								<div
										style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -30px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
									{{item.title || '标题'}}
								</div>
							</div>
							<div v-if="!single">
								<a-popover placement="right" v-if='sketchList.length > 1'>
									<template slot="content">
										<p v-show="index != 0">
											<a-icon type="arrow-up" @click="changeSketch(index, 0)"/>
										</p>
										<p v-show="index != sketchList.length - 1">
											<a-icon type="arrow-down" @click="changeSketch(index, 1)"/>
										</p>
										<!--										<p>-->
										<!--											<a-icon type="plus" @click="addSketch(index)"/>-->
										<!--										</p>-->
										<!--										<p v-show="sketchList.length > 1">-->
										<!--											<a-icon type="minus" @click="deleteSketch(index)"/>-->
										<!--										</p>-->
									</template>
									<div>
										<div v-if="index == 0">
											<img v-show="item.pic_url != ''"
											     alt="example"
											     draggable="false"
											     :src="commonUrl+item.pic_url"
											     slot="cover"
											     style="width: 236px;height: 131px;"
											/>
											<img v-show="item.pic_url == ''"
											     alt="example"
											     draggable="false"
											     src="../../../assets/img.png"
											     style="width: 236px;height: 131px;"
											     slot="cover"
											/>
											<div
													style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -30px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
												{{item.title || '标题'}}
											</div>
										</div>
										<div v-if="index !==0" style="padding: 5px 0;height: 74px;">
											<span class="sketch-title">{{item.title || '标题'}}</span>
											<a-avatar
													style="float: right;margin-right: 2px;"
													slot="avatar"
													shape="square"
													:size="64"
													:src="commonUrl+item.pic_url"
											/>
										</div>
									</div>
								</a-popover>
								<div v-if="sketchList.length == 1">
									<img v-show="item.pic_url != ''"
									     alt="example"
									     draggable="false"
									     :src="commonUrl+item.pic_url"
									     slot="cover"
									     style="width: 236px;height: 131px;"
									/>
									<img v-show="item.pic_url == ''"
									     alt="example"
									     draggable="false"
									     src="../../../assets/img.png"
									     style="width: 236px;height: 131px;"
									     slot="cover"
									/>
									<div
											style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -30px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
										{{item.title || '标题'}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</a-layout-sider>
				<a-layout style="position: absolute;left:250px;top:0;bottom:0;right:0;" class="fans-content">
					<!-- 头部 -->
					<a-layout-header>
						<label v-if="!this.urlId" class="template-title">添加素材</label>
						<label v-if="this.urlId" class="template-title">编辑素材</label>
						<router-link to="/filingCabinet/list" style="font-size: 16px;float: right;margin-right: 15px;">
							<a-button type="primary" icon="rollback">返回列表</a-button>
						</router-link>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content style="height: calc(100% - 100px);">
						<a-layout style="margin-top: 10px;height: 100%;">
							<a-layout class="content">
								<div style="margin: 100px 0px 10px 0px; padding: 0 10px;">
									<a-input style="height: 50px;" v-model="sketchList[currentIndex].title"
									         placeholder="输入文章标题（请勿输入特殊字符）"
									         size="large"
									         :maxLength="32">
										<span slot="suffix">
						                    <span>{{sketchList[currentIndex].title.length}}</span>/32
					                    </span>
									</a-input>
								</div>
								<div class="ueditor"
								     style="padding: 0px 10px;margin-top: 10px;height: calc(100% - 215px);overflow-y: auto; border-bottom: 1px solid #E2E2E2;">
<!--									@paste.native="changeImageText"
-->
									<VueUeditorWrap class="filingCabinetUeditor" :config="myConfig"
									                @beforeInit="addCustomButtom" @input="changeImageText"
									                v-model="sketchList[currentIndex].image_text">
									</VueUeditorWrap>
								</div>
								<div style="height: 50px;line-height: 54px;margin-left: 10px;position: absolute;bottom: 10px;z-index: 9999;">
									<a-button style="margin-right: 10px;" :disable="createSketchDisable"
									          @click="createSketch" type="primary">提交
									</a-button>
									<a-button style="margin-right: 10px;" @click="preview" type="primary">预览
									</a-button>
								</div>
							</a-layout>
							<a-layout-sider
									style="width: 300px !important;background-color: #FAFAFA;height: 100%; overflow-y: auto;">
								<div style="padding: 10px;">
									发布
								</div>
								<div style="padding: 10px;background-color: #FFFFFF;">
									<div>
										<label style="display: block">选择分组</label>
										<a-tree-select
												style="width: 230px;margin-top: 10px;"
												:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
												:treeData="groupList"
												placeholder='Please select'
												treeDefaultExpandAll
												v-model="selectGroupId"
										>
										</a-tree-select>
									</div>
									<div style="margin-top: 10px;">
										封面<span>（建议尺寸900*500）</span>
									</div>
									<div style="margin-top: 5px;">
										<div :class="currentIndex == 0 ? 'upload-wrap0' : 'upload-wrap'"
										     v-show="!sketchList[currentIndex].pic_url"
										     @click="openShowModal(0)">
											<a-icon type="plus" class="upload-plus"/>
										</div>
										<div :class="currentIndex == 0 ? 'upload-wrap0' : 'upload-wrap'"
										     v-show="!!sketchList[currentIndex].pic_url"
										     @click="openShowModal(0)">
											<img :src="commonUrl + sketchList[currentIndex].pic_url" alt=""
											     :class="currentIndex == 0? 'upload-wrap-pic0' : 'upload-wrap-pic'">
										</div>
									</div>
									<a-checkbox style="margin-top: 110px;"
									            v-model="sketchList[currentIndex].show_cover_pic">封面显示在正文
									</a-checkbox>
									<div style="margin-top: 10px;" v-if="single">
										企业微信封面<span>（建议尺寸200*200）</span>
									</div>
									<div style="margin-top: 5px;margin-bottom: 110px;" v-if="single">
										<div class="upload-wrap" v-show="!sketchList[currentIndex].qy_local_path"
										     @click="openShowModal(1)">
											<a-icon type="plus" class="upload-plus"/>
										</div>
										<div class="upload-wrap"
										     v-show="!!sketchList[currentIndex].qy_local_path"
										     @click="openShowModal(1)">
											<img :src="commonUrl + sketchList[currentIndex].qy_local_path" alt=""
											     class="upload-wrap-pic">
										</div>
									</div>
								</div>
								<div style=" padding: 10px;">
									<div style="">
										摘要（选填）
									</div>
									<div style="margin-top: 5px;">
										<a-textarea style="height: 110px;border: 1px solid #D9D9D9;resize: none;"
										            v-model="sketchList[currentIndex].content" :maxLength="128"
										            :autosize="false"/>
										<div style="width: 100%;margin-bottom: 15px;">
											<span style="float: right;">{{sketchList[currentIndex].content.length}}/128</span>
										</div>
									</div>
									<div>
										作者（选填）
									</div>
									<div style="margin-top: 5px;">
										<a-input v-model="sketchList[currentIndex].author" :maxLength="16">
											<span slot="suffix">
						                    <span>{{sketchList[currentIndex].author.length}}</span>/16
					                    </span>
										</a-input>
									</div>
									<div style="margin-top: 5px;">
										原文链接（选填）
									</div>
									<div style="margin-top: 5px;">
										<a-input v-model="sketchList[currentIndex].jump_url"
										         placeholder="请勿添加其他公众号的文章链接"></a-input>
									</div>
								</div>
							</a-layout-sider>
						</a-layout>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
		<!-- 选择素材弹窗 -->
		<chooseMsg :show="showModal3" :type="typeValue2" :news_type="news_type"
		           :callback="modalVisibleChange2" :chooseId="chooseId" :comefrom="comefrom"></chooseMsg>
		<!--图文封面-->
		<chooseMsg1 :show="showModal4" :type="typeValue2" :news_type="news_type"
		            :callback="modalVisibleChange3" :chooseId="chooseId" comefrom="0"></chooseMsg1>
		<!-- 引用文本 -->
		<a-modal :visible="textVisible" title="引用文本" @ok="handleText" @cancel="handleCancelText"
		         width="720px" :confirmLoading="confirmLoading">
			<a-form>
				<a-form-item label="引用文本" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-textarea style="height: 110px;border: 1px solid #D9D9D9;resize: none;"
					            v-model="text" :maxLength="120"
					            :autosize="false"/>
					<div style="width: 100%;margin-bottom: 15px;">
						<span style="float: right;">{{text.length}}/300</span>
					</div>
				</a-form-item>
				<a-form-item label="文章链接" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-input v-model="articleLink" placeholder="请输入以 https://mp.weixin.qq.com 开头的正确的公众号文章链接"></a-input>
				</a-form-item>
			</a-form>
		</a-modal>
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
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
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
		<a-modal v-model="qrcodeVisible" @ok="handleQrCode" @cancel="handleCancelQrCode">
			<div style="padding: 20px 0; width: 140px;margin: 0 auto;" ref="qrcode" id="qrcode">

			</div>
		</a-modal>
	</div>
</template>

<script>
	import chooseMsg from "@/components/FilingCabinet/ChooseMsg"
	import chooseMsg1 from "@/components/ChooseMsg"
	import editor from 'vue2-medium-editor'
	import {message} from "ant-design-vue";
	import MyIcon from "../../../components/MyIcon";
	// import { VEmojiPicker } from "v-emoji-picker"
	// import WEmoji from "@/common/js/wechatEmoji.js"
	import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
	import QRCode from 'qrcodejs2'
	// import qqmusic from '../../../components/qqmusic/qqmusic'

	export default {
		components: {
			MyIcon,
			chooseMsg, chooseMsg1,
			// 'medium-editor': editor,
			// VEmojiPicker,
			VueUeditorWrap,
			// qqmusic
		},
		data () {
			return {
				urlId              : '',  // id
				groupList          : [],
				selectGroupId      : '',
				sketchList         : [
					{
						pic_url       : '',
						title         : '',
						attach_id     : 0,
						qy_attach_id  : 0,
						qy_local_path : '',
						content       : '',
						author        : '',
						jump_url      : '',
						image_text    : '',
						show_cover_pic: false
					}
				], // 图文信息
				picType            : 0, // 封面类型 0.封面(900*500) 1.企业微信封面(200*200)
				currentIndex       : 0, // 当前图文下标
				suite_id           : 1, // 应用id
				single             : true, // true单图文 false多图文
				// title         : '',
				// localPath: '',
				commonUrl          : this.$store.state.commonUrl, // 通用资源链接前缀
				showModal3         : false, // 选择素材弹窗
				typeValue2         : 0, // 素材类型
				news_type          : 1, // 图文类型 单、多
				chooseId           : 0, // 素材id
				mediumEditor       : [],   // 初始化的medium-editor
				createSketchDisable: false,
				myConfig           : {
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
					UEDITOR_HOME_URL  : this.$store.state.siteUrl + '/UEditor/',
				},
				wordNum            : 0,//编辑框的字数
				wordLimit          : 1000, //  编辑框文字限制
				// textContent   : '',//编辑框传给后台的内容
				// textValue     : '', //文本内容
				linkVisible        : false, // 超链接弹窗显示或隐藏
				linkTitle          : '', // 超链接标题
				linkUrl            : '', // 超链接地址
				href               : '',
				title              : '',
				confirmLoading     : false, // 超链接提交loading
				showModal4         : false, // 图文封面选择素材弹窗
				// checked       : false, // 封面是否显示在正文
				textVisible        : false,
				text               : '',
				articleLink        : '',
				imgEditor          : null,
				imgUiName          : '',
				appletEditor       : null,
				appletUiName       : '',
				qrcodeVisible      : false,
				comefrom           : "0", // 0 文件柜 3 图文编辑选择素材
				musicEditor        : '',
				musicName          : '',
				musicVisible       : false, // 音频弹窗
				musicTitle         : '', // 音频搜索名
				musicList          : [], // 音频列表
				columns            : [
					{
						title    : "歌名",
						dataIndex: "song_title",
						// width      : "15%",
						key      : "song_title",
					},
					{
						title    : "歌手",
						dataIndex: "author",
						// width      : "8%",
						key      : "author",
					},
					{
						title    : "专辑",
						dataIndex: "album_title",
						// width    : "8%",
						key      : "album_title"
					},
					// {
					// 	title      : "操作",
					// 	dataIndex  : "action",
					// 	width      : "10%",
					// 	key        : "action",
					// 	scopedSlots: {customRender: "action"}
					// }
				],
				musicItem          : '', // 选择的音频数据
				isLoading          : false, // 音频表格加载动画
				pageSize           : 10, // 音频每页数量
				page               : 1, // 音频页码
				total              : 0, // 音频总数
				quickJumper        : false,
				selectedRowKeys    : [], // 音频列表单选
			};
		},
		methods   : {
			changeImageText () {
				let that = this
				this.sketchList[this.currentIndex].image_text.replace(/<img [^>]*src=['"][data:image]([^'"]+)[^>]*>/gi, function (match, src) {
					that.uploadImgByBase64('d'+src)
				})
			},
			async uploadImgByBase64(src) {
				this.isLoading = true
				const {data: res} = await this.axios.post("attachment/base64-pic", {
					uid: localStorage.getItem('uid'),
					base64Data: src
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.sketchList[this.currentIndex].image_text = this.sketchList[this.currentIndex].image_text.replace(/<img [^>]*src=['"][data:image]([^'"]+)[^>]*>/gi, function (match, url, word_img, other) {
						if(src == 'd' + url) {
							return '<img style="max-width: 100%;" src="'+ res.data.local_path +'"/>'
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
						cssRules: "background-image: url(" + require('../../../assets/img1.png') + ") !important;background-size: cover;",
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
				// 小程序
				// window.UE.registerUI('applet', function (editor, uiName) {
				// 	// 创建一个 button
				// 	let btn = new window.UE.ui.Button({
				// 		// 按钮的名字
				// 		name    : 'applet',
				// 		// 提示
				// 		title   : '小程序',
				// 		// 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
				// 		cssRules: "background-image: url(" + require('../../../assets/applet.png') + ") !important;background-size: cover;",
				// 		// 点击时执行的命令
				// 		onclick : function () {
				// 			that.appletEditor = editor
				// 			that.appletUiName = uiName
				// 			// 这里可以不用执行命令，做你自己的操作也可
				// 			// editor.execCommand(uiName)
				// 			that.showMsg(7)
				// 		}
				// 	})
				// 	// 当点到编辑内容上时，按钮要做的状态反射
				// 	editor.addListener('selectionchange', function () {
				// 		var state = editor.queryCommandState(uiName)
				// 		if (state === -1) {
				// 			btn.setDisabled(true)
				// 			btn.setChecked(false)
				// 		} else {
				// 			btn.setDisabled(false)
				// 			btn.setChecked(state)
				// 		}
				// 	})
				// 	return btn
				// }, 49)
				window.UE.registerUI('music', function (editor, uiName) {
					// 创建一个 button
					let btn = new window.UE.ui.Button({
						// 按钮的名字
						name    : 'music',
						// 提示
						title   : '音频',
						// 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
						cssRules: "background-image: url(" + require('../../../assets/music.png') + ") !important;background-size: cover;",
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
			// 音频表格列表
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
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
			// 选择音频
			onSelectChange (id, selectedRows) {
				this.selectedRowKeys = []
				this.musicItem = selectedRows[0]
				this.selectedRowKeys.push(id[0])
				console.log(this.musicItem)
			},

			// 切换图文
			changeSketch (index, type) {
				// type 0上移 1下移
				if (type == 0) {
					let sketch = JSON.parse(JSON.stringify(this.sketchList[index]))
					this.sketchList.splice(index, 1, JSON.parse(JSON.stringify(this.sketchList[index - 1])))
					this.sketchList.splice(index - 1, 1, sketch)
				} else if (type == 1) {
					let sketch = JSON.parse(JSON.stringify(this.sketchList[index + 1]))
					this.sketchList.splice(index + 1, 1, JSON.parse(JSON.stringify(this.sketchList[index])))
					this.sketchList.splice(index, 1, sketch)
				}
			},
			// 添加图文
			addSketch (index) {
				let sketch = {
					pic_url       : '',
					title         : '',
					attach_id     : 0,
					content       : '',
					author        : '',
					jump_url      : '',
					image_text    : '',
					show_cover_pic: false
				}
				this.sketchList.splice(index + 1, 0, sketch)
			},
			// 删除图文
			deleteSketch (index) {
				if (this.currentIndex == this.sketchList.length) {
					this.currentIndex = 0
				}
				this.sketchList.splice(index, 1)
			},
			// 获取详情
			async getDetail () {
				const {data: res} = await this.axios.post("attachment/image-text-detail", {
					attachment_id: this.urlId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.selectGroupId = res.data.group_id.toString()
					this.getGroupList(this.selectGroupId)
					this.sketchList = res.data.data
					if (this.sketchList.length == 1) {
						this.single = true
					} else {
						this.single = false
					}
				}
			},
			// 创建图文
			async createSketch () {
				this.createSketchDisable = true
				for (let i = 0; i < this.sketchList.length; i++) {
					if (this.sketchList[i].title == '') {
						this.$message.warning("请检查图文标题")
						this.createSketchDisable = false
						return false
					}
					if (this.sketchList[i].pic_url == '') {
						this.$message.warning("请检查图文封面")
						this.createSketchDisable = false
						return false
					}
					if (this.sketchList[i].image_text == '') {
						this.$message.warning("请检查图文正文")
						this.createSketchDisable = false
						return false
					}
				}
				if (this.single) {
					if (this.sketchList[0].qy_local_path == '') {
						this.$message.warning("请检查企业微信封面")
						this.createSketchDisable = false
						return false
					}
				}

				const {data: res} = await this.axios.post("attachment/image-text-add", {
					corp_id        : localStorage.getItem('corpId'),
					suite_id       : this.suite_id,
					uid            : localStorage.getItem('uid'),
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
					file_type      : 4,
					group_id       : this.selectGroupId,
					attachment_id  : this.urlId || '',
					msgData        : this.sketchList
				});
				if (res.error != 0) {
					this.createSketchDisable = false
					this.$message.error(res.error_msg);
				} else {
					this.$router.push('/filingCabinet/list?t=' + this.$route.query.t + '&g=' + this.$route.query.g + '&isRefresh=1' + '&groupId=' + this.selectGroupId)
				}
			},
			// 预览
			async preview () {
				let sketch = this.sketchList[this.currentIndex]
				if (sketch.title == "") {
					this.$message.warning("请输入标题")
					return false
				}
				if (sketch.image_text == "") {
					this.$message.warning("请输入正文")
					return false
				}
				if (this.sketchList[this.currentIndex].show_cover_pic && !this.sketchList[this.currentIndex].pic_url) {
					this.$message.warning("请选择图文封面")
					return false
				}
				const {data: res} = await this.axios.post("attachment/image-text-preview", {
					uid           : localStorage.getItem('uid'),
					title         : this.sketchList[this.currentIndex].title,
					author        : this.sketchList[this.currentIndex].author,
					pic_url       : this.sketchList[this.currentIndex].pic_url,
					show_cover_pic: this.sketchList[this.currentIndex].show_cover_pic,
					image_text    : this.sketchList[this.currentIndex].image_text,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.sketchList[this.currentIndex].image_text = res.data.image_text
					this.qrcodeVisible = true
					this.$nextTick(() => {
						this.qrcode(this.$store.state.h5Url + '/preview?num=' + res.data.num)
					})
				}
			},
			// 二维码
			qrcode (url) {
				let qrcode = new QRCode('qrcode', {
					width     : 140,
					height    : 140,
					text      : url, // 二维码地址
					colorDark : "#000",
					colorLight: "#FFF",
				})
			},
			// 预览取消
			handleQrCode () {
				this.$refs.qrcode.innerHTML = ''
				this.qrcodeVisible = false
			},
			handleCancelQrCode () {
				this.$refs.qrcode.innerHTML = ''
				this.qrcodeVisible = false
			},
			// showText () {
			// 	let html = '<blockquote>' +
			// 		'<p style="color: #E2E2E2;">123<br></p>' +
			// 		'<p style="color: #E2E2E2;">456<br></p>' +
			// 		'<p><a href="https://www.baidu.com">789</a></p>' +
			// 		'</blockquote>'
			// 	let dom = this.mediumEditor.options.ownerDocument
			// 	this.insertHTMLCommand(dom, html)
			// 	// this.textVisible = true
			// },

			handleText () {

			},
			handleCancelText () {
				this.textVisible = false
			},
			// 切换图文
			changeCurrentIndex (index) {
				if (this.currentIndex != index) {
					this.currentIndex = index
				}
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
			// 选择封面
			openShowModal (type) {
				this.picType = type
				if (type == 0) {
					if (this.sketchList[this.currentIndex].attach_id) {
						this.chooseId = Number(this.sketchList[this.currentIndex].attach_id)
					} else {
						this.chooseId = 0
					}
				} else if (type == 1) {
					if (this.sketchList[this.currentIndex].qy_attach_id) {
						this.chooseId = Number(this.sketchList[this.currentIndex].qy_attach_id)
					} else {
						this.chooseId = 0
					}
				}

				this.typeValue2 = 2
				this.showModal4 = true
			},
			// 选择素材回调
			modalVisibleChange3 (event, e, id, item) {
				if (event == "ok") {
					if (this.typeValue2 == 2) {
						if (this.picType == 0) {
							this.sketchList[this.currentIndex].attach_id = item.id
							this.sketchList[this.currentIndex].pic_url = item.local_path
						} else {
							this.sketchList[this.currentIndex].qy_attach_id = item.id
							this.sketchList[this.currentIndex].qy_local_path = item.local_path
						}
					}
				}
				this.showModal4 = false
			},
			async getGroupList (id) {
				let that = this
				const {data: res} = await this.axios.post("attachment/group", {
					uid: localStorage.getItem('uid'),
					is_channel : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					if (id) {
						this.selectGroupId = id
					} else {
						this.selectGroupId = this.groupList[0].key
					}

				}
			},
			// 浏览器返回
			popState () {
				let t = this.$route.query.t || ''
				let g = this.$route.query.g || ''
				window.removeEventListener('popstate', this.popState)
				this.$router.push('/filingCabinet/list?t=' + t + '&g=' + g)
			},
		},
		created () {
			// document
			this.urlId = this.$route.query.id
			if (typeof this.urlId != 'undefined') {
				this.getDetail()
			} else {
				this.selectGroupId = this.$route.query.g
				this.getGroupList(this.selectGroupId)
			}
		},
		mounted () {
			let that = this
			let t = that.$route.query.t || ''
			let g = that.$route.query.g || ''
			let id = that.$route.query.id
			let url = ''
			// 设置浏览器返回
			if (typeof this.urlId != 'undefined') {
				url = '/filingCabinet/add?t=' + t + '&g=' + g + "&id=" + id
			} else {
				this.selectGroupId = parseInt(this.$route.query.g)
				url = '/filingCabinet/add?t=' + t + '&g=' + g
			}
			let state = {
				title: document.title,
				url  : url
			};
			window.history.pushState(state, "title", url);
			window.addEventListener("popstate", that.popState, false);
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/fontawesome/css/font-awesome.css";

	.list {
		height: 100%;
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

	#components-layout-demo-basic > .ant-layout {
		/*margin-bottom: 48px;*/
		background-color: #FFFFFF;
	}

	.content {
		/*margin-bottom: 48px;*/
		height: 100%;
		border-right: 1px solid #E2E2E2;
		background-color: #FFFFFF;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.template-title {
		font-size: 16px;
		vertical-align: top;
	}

	.choose-sketch {
		border: 2px solid #1890FF;
	}

	.no-choose-sketch {
		border: 2px solid #FFFFFF;
	}

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		border: 1px solid #D9D9D9 !important;
		height: 100%;
		overflow: auto;

		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	.upload-wrap0 {
		position: absolute;
		width: 182px;
		height: 102px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		background: #FFF;
		cursor: pointer;
		margin-bottom: 10px;
		float: left;
	}

	.upload-wrap {
		position: absolute;
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

	.upload-wrap-pic0 {
		width: 180px;
		height: 100px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.upload-wrap-pic {
		width: 96px;
		height: 96px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.sketch-title {
		padding: 0 7px;
		word-break: break-word;
		width: calc(100% - 70px);
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		float: left;
	}

	.my-icon {
		cursor: pointer;
		padding: 15px 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 54px;
	}

</style>

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
