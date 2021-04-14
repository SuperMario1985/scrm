<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="typeof urlId == 'undefined'">新建</template>
						<template v-if="typeof urlId != 'undefined'">修改</template>
						推荐规则
						<a-button type="primary" icon="rollback" @click="goBack" style="float: right;margin-top: 9px;">
							返回列表
						</a-button>
					</a-layout-header>
					<a-layout class="fans-content">
						<!-- 左侧 -->
						<a-layout-sider>
							<div class="left-sider-content">
								<img src="../../../assets/wxHeader.png" alt
								     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
								<div class="msg_content_body">
									<template v-for="(element,index) in lists[listsIndex].list">
										<!-- 图文 -->
										<div v-if="element.typeValue == 5" class="mt">
											<template v-if="element.sketchList[0].closeShowModal3">
												<a-avatar
														src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
														:size="36" style="margin-right: 10px;"/>
												<div style="border: 1px solid #E8E8E8;width: calc(100% - 56px);display: inline-block;vertical-align: top;">
													<img :src="element.sketchList[0].local_path.img"
													     style="height: 145px;width: 100%;object-fit: cover;"/>
													<div class="inputTitle"
													     v-html="element.sketchList[0].inputTitle==''?'标题':element.sketchList[0].inputTitle"></div>
													<template
															v-for="(sketch,sketchIndex) in element.sketchList.slice(1)">
														<div class="inputTitle2">
															<p v-html="element.sketchList[sketchIndex+1].inputTitle==''?'标题':element.sketchList[sketchIndex+1].inputTitle"></p>
															<img :src="element.sketchList[sketchIndex+1].local_path.img"
															     alt=""
															     style="width: 64px;height: 64px;float: right;object-fit: cover;">
														</div>
													</template>
												</div>
											</template>
										</div>
										<!-- 图片 -->
										<div v-if="element.typeValue == 2" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;"/>
											<!-- 选中前 -->
											<template v-if="element.closeShowModal3 == false">
												<img src="../../../assets/img.png" alt
												     style="width: 150px;border-radius: 4px;"/>
											</template>
											<!-- 选中后 -->
											<template v-if="element.closeShowModal3">
												<img :src="element.local_path.img" alt
												     style="width: 150px;border-radius: 4px;object-fit: cover; vertical-align: top;"/>
											</template>
										</div>
										<!-- 文字 -->
										<div v-if="element.typeValue == 1 && element.closeShowModal3 == true"
										     class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;float: left;"/>
											<span v-html="element.textAreaValueHeader"
											      class="item-info msg_content_txt"></span>
										</div>
										<!-- 视频 -->
										<div v-if="element.typeValue == 4" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;"/>
											<!-- 选中前 -->
											<template v-if="element.closeShowModal3 == false">
												<a-card hoverable
												        style="width: calc(100% - 56px);display: inline-block;vertical-align: top;">
													<img alt="example"
													     src="http://s.weituibao.com/static/1545276720179/video.png"
													     slot="cover"/>
													<a-card-meta style="height: 50px;"></a-card-meta>
												</a-card>
											</template>
											<!-- 选中后 -->
											<template v-if="element.closeShowModal3">
												<a-card hoverable
												        style="width: calc(100% - 56px);display: inline-block;vertical-align: top;">
													<video-player class="video-player vjs-custom-skin" ref="videoPlayer"
													              :playsinline="true"
													              :options="playerOptions"></video-player>
													<a-card-meta :title="element.file_name"
													             style="height: 50px;line-height: 50px;text-align: center;">
													</a-card-meta>
												</a-card>
											</template>
										</div>
										<!--小程序-->
										<div v-if="element.typeValue == 6 && element.closeShowModal3"
										     class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36"
													style="object-fit: cover;margin-right: 10px;float: left;"/>
											<div class="item-info msg_content_txt">
												<!--											<p class="url-title" style="color: #A3A3A3;">{{appletInputTitle}}</p>-->
												<p class="applet-title">{{element.appletInputTitle}}</p>
												<img :src="element.appletUrl" alt="" style="width: 100%;">
											</div>
										</div>
										<!--文件-->
										<div v-if="element.typeValue == 7 && element.closeShowModal3"
										     class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36"
													style="object-fit: cover;margin-right: 10px;float: left;"/>
											<div class="item-info msg_content_txt">
												<div>
													<img
															alt="example" v-if="element.extension == 'doc'"
															class="file-icon"
															src="../../../assets/fileIcon/doc.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="element.extension == 'docx'"
															class="file-icon"
															src="../../../assets/fileIcon/docx.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="element.extension == 'xlsx'"
															class="file-icon"
															src="../../../assets/fileIcon/xlsx.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="element.extension == 'xls'"
															class="file-icon"
															src="../../../assets/fileIcon/xls.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="element.extension == 'csv'"
															class="file-icon"
															src="../../../assets/fileIcon/csv.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="element.extension == 'pptx'"
															class="file-icon"
															src="../../../assets/fileIcon/pptx.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="element.extension == 'ppt'"
															class="file-icon"
															src="../../../assets/fileIcon/ppt.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="element.extension == 'txt'"
															class="file-icon"
															src="../../../assets/fileIcon/txt.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="element.extension == 'pdf'"
															class="file-icon"
															src="../../../assets/fileIcon/pdf.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="element.extension == 'xmind'"
															class="file-icon"
															src="../../../assets/fileIcon/xmind.png"
															slot="cover"
													/>

													<div class="file-name">{{element.file_name}}</div>
												</div>
											</div>
										</div>
									</template>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<div class="content-bd">
									<a-form style="margin-left: 10px;">
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             style="padding-top: 20px;">
										<span slot="label">
												<span style="color: red;">*</span>
												<span>设置关键词</span>
											</span>
											<div style="display: inline-block;width: 60%;">
												<inputRecommended :msg="title" :placeholder="'请输入关键词名称'"
												                  @func="getMsgFormSon"></inputRecommended>
											</div>
										</a-form-item>
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
										<span slot="label">
												<span style="color: red;">*</span>
												<span>推送对象</span>
											</span>
											<a-radio-group name="radioGroup" v-model="objType" @change="changeObjType">
												<a-radio :value="1">不限制</a-radio>
												<a-radio :value="2">用户标签</a-radio>
											</a-radio-group>
										</a-form-item>
										<!-- 推送内容 -->
										<a-form-item label="推送内容" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-tabs
													size="large"
													tabPosition="top"
													style="width: 700px;margin-top: 5px;background-color: #FFF;padding-bottom: 20px;"
													:type="objType == 2 ? 'editable-card' : 'card'"
													@edit="addList"
													@change="changeListsKey"
													@prevClick="callback"
													@nextClick="callback">
												<a-tab-pane v-for="(item, idx) in lists" style="padding: 0 26px;"
												            :tab="'内容'+(idx+1)" :key="idx+1">
													<div style="margin: 20px 0;overflow: hidden;">
														<a-form style="width: calc(100% - 90px);float: left;"
														        v-if="objType == 2">
															<a-form-item :label-col="{ span: 3 }"
															             :wrapper-col="{ span: 21 }" label="用户标签">
																<a-button type="primary" @click="addTagRules"
																          icon="plus" style="margin-right: 10px;">选择标签
																</a-button>
																<div>
																	<a-tag color="orange" style="margin: 3px;"
																	       v-if="item.tag_name.length <= 5"
																	       v-for="(tag,tagIndex) in item.tag_name">
																		{{tag}}
																		<a-icon type="close" @click="delTag(tagIndex)"
																		        style="color: #FA8C16; cursor: pointer"/>
																	</a-tag>
																	<a-popover v-if="item.tag_name.length > 5"
																	           placement="left">
																	<span slot="content">
																		<div class="popover-content">
																			<a-tag color="orange" style="margin: 3px;"
																			       v-for="(tag,tagIndex) in item.tag_name">
																				{{tag}}<a-icon type="close"
																				               @click="delTag(tagIndex)"
																				               style="color: #FA8C16; cursor: pointer"/>
																			</a-tag>
																		</div>
																	</span>
																		<template
																				v-for="(tag,tagIndex) in item.tag_name">
																			<a-tag color="orange" v-if="tagIndex < 5"
																			       style="margin: 3px;">
																				{{tag}}
																				<a-icon type="close"
																				        @click="delTag(tagIndex)"
																				        style="color: #FA8C16; cursor: pointer"/>
																			</a-tag>
																		</template>
																		<span style="color: #01b065; cursor: pointer;">等{{item.tag_name.length}}个关键词</span>
																	</a-popover>
																</div>
															</a-form-item>
														</a-form>
														<a-button v-show="lists.length > 1" @click="removeList"
														          icon="minus"
														          style="width: 80px; float: right;">
															删除
														</a-button>
													</div>
													<div class="pull-left fl">
														<vuedraggable v-model="lists[idx].list" :move="checkMove">
															<transition-group>
																<div class="push-type-list"
																     :class="{active: index==current}"
																     @click="clickTab(index)"
																     v-for="(element,index) in item.list"
																     :key="index">
																	<div class="push-type-item">
																		<span class="index">{{index+1}}</span>
																		<span
																				class="type">{{element.typeName[element.typeValue]}}</span>
																	</div>
																</div>
															</transition-group>
														</vuedraggable>
														<div slot="footer" class="add-new" @click="createPullLeft"
														     v-show="lists[idx].list.length < 10">
			                                                <span class="add-icon">
			                                                    <a-icon type="plus"/>
			                                                </span>
															<span class="add-btn">新建</span>
														</div>
													</div>
													<div class="pull-right fl">
														<sendMsg
																@deleteMsg="deleteMsg"
																:msg="item.list[current]"></sendMsg>
													</div>
												</a-tab-pane>
											</a-tabs>
										</a-form-item>

										<a-form-item>
											<div style="margin-top: 2px;margin-left: 12.5%;">
												<a-button type="primary" style="width: 140px; height: 36px;"
												          @click="createReply" :disabled="createDisabled">
													提交
												</a-button>
											</div>
										</a-form-item>
									</a-form>
								</div>
							</div>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>
		<!--选择标签组件-->
		<a-modal width="888px!important" title="客户标签" v-model="chooseTagVisible" @ok="handleChoose"
		         @cancel="cancleChooseTag">
			<corpChooseTagModal v-if="chooseTagVisible" :callback="modalVisibleChange" :tagname="tagNames"
			                    :hasChoose="tagArr"></corpChooseTagModal>
		</a-modal>
	</div>
</template>

<script>
	import vuedraggable from "vuedraggable"
	import chooseMsg from "@/components/ChooseMsg.vue"
	import {videoPlayer} from "vue-video-player"
	import "video.js/dist/video-js.css"
	import moment from 'moment'
	import {defaulImg} from '../../../assets/img.png'
	import sendMsg from '../../../components/sendMsg/Index'
	import inputRecommended from '../../../components/InputRecommended'
	import corpChooseTagModal from '@/components/corpChooseTag/CorpChooseTagModal.vue'

	const news = {
		id                : 0,
		addSketchVisible  : true,//控制添加图文按钮显示与隐藏
		addType           : 0,//添加方式
		inputTitle        : '',//标题
		digest            : '',//图文描述
		content_source_url: '',//跳转链接
		material_id       : '',//图文消息导入的素材id
		local_path        : {
			img  : defaulImg,
			audio: ""
		},
		showTextContent   : false,
		isAdvance         : false,
		closeShowModal3   : false,//每个图文消息是否选好素材
		materialSync      : 0,//素材是否同步，0不同步，1同步
		selectGroupId     : '',// 上传选择的分组id
	}
	const templateObj = {
		showRadar          : false, // 雷达
		isTextAdd          : true, // 是否显示文本添加方式
		isSketchAdd        : false, // 是否显示图文添加方式
		isAppletAdd        : false, // 是否显示小程序添加方式
		isNickName         : false,
		typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
		typeName           : {
			1: '文本',
			2: '图片',
			// 3: '音频',
			4: '视频',
			5: '图文',
			6: '小程序',
			7: '文件'
		},
		id                 : 0,
		addType            : 0,
		closeShowModal3    : false,//是否选好素材
		disabled           : false,//消息类型图文能否被选
		file_name          : "", //手机上展示的素材标题
		material_id        : "", //选中的素材id
		local_path         : {
			img  : "",
			audio: ""
		}, //手机上展示的图片、音频、视频链接
		sketchList         : [JSON.parse(JSON.stringify(news))],//图文消息添加的数组
		appletUrl          : '',// 小程序的封面链接
		appletInputTitle   : '',// 小程序的标题
		appid              : '',// 小程序的appid
		pageUrl            : '',// 小程序page路径
		materialSync       : 0, // 小程序是否同步，0不同步，1同步
		selectGroupId      : '',// 上传选择的分组id
		textAreaValueHeader: "", //模板展示的内容
		textContent        : '',//编辑框传给后台的内容
		extension          : '', // 文件图标类型
	}
	export default {
		components: {
			vuedraggable, chooseMsg, videoPlayer, defaulImg, sendMsg, inputRecommended, corpChooseTagModal
		},
		data () {
			return {
				commonUrl       : this.$store.state.commonUrl, //公共的链接
				playerOptions   : {
					playbackRates      : [0.7, 1.0, 1.5, 2.0], //播放速度
					autoplay           : false, //如果true,浏览器准备好时开始回放。
					muted              : false, // 默认情况下将会消除任何音频。
					loop               : false, // 导致视频一结束就重新开始。
					preload            : "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language           : "zh-CN",
					aspectRatio        : "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid              : true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
					controlBar         : {
						timeDivider         : true,
						durationDisplay     : true,
						remainingTimeDisplay: false,
						fullscreenToggle    : true //全屏按钮
					}
				},
				title           : [],//关键词数组
				titleMsg        : '',//关键词正在输入的值
				objType         : 1,//推送对象
				lists           : [],//内容数组
				listsIndex      : 0,//内容选中的index值
				list            : [JSON.parse(JSON.stringify(templateObj))],
				current         : 0,//左侧当前选中的tab值的index值
				urlId           : '', //地址栏参数id值
				replyList       : [],//存详情的数组
				chooseId        : 0,//跳入组件时，选择好的id
				createDisabled  : false,//创建按钮的置灰
				isLoading       : false, //Loading 组件显示与隐藏
				//选择标签弹窗
				chooseTagVisible: false,//弹窗的显示与隐藏
				tagArr          : [],//已选择的标签id，传给组件
				tagNames        : [],//已选择的标签名称，传给组件
			}
		},

		methods: {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/smartRecommended/list?isRefresh=1")
			},
			changeObjType () {
				this.listsIndex = 0
				this.current = 0
				let obj = {
					list        : JSON.parse(JSON.stringify(this.list)),
					tag_ids     : [],
					tag_name    : [],
					mediumEditor: [],   // 初始化的medium-editor
				}
				this.lists = [JSON.parse(JSON.stringify(obj))]
			},
			//输入框的子组件返回值
			getMsgFormSon (data, msg) {
				this.title = []
				for (let i = 0; i < data.length; i++) {
					this.title.push(data[i].replace(/\s+/g, ''))
				}
				// this.title = data
				if (typeof msg != "undefined" && msg.trim() !== '') {
					this.titleMsg = msg.replace(/\s+/g, '')
				} else {
					this.titleMsg = ''
				}

			},
			addList () {
				var obj = {
					list        : JSON.parse(JSON.stringify(this.list)),
					tag_ids     : [],
					tag_name    : [],
					mediumEditor: [],   // 初始化的medium-editor
				}
				this.lists.push(JSON.parse(JSON.stringify(obj)))
			},
			removeList () {
				if (this.lists.length > 1) {
					this.current = 0
					let listsIndex = this.listsIndex
					if (this.listsIndex == this.lists.length - 1) {
						this.listsIndex = 0

					}
					this.lists.splice(listsIndex, 1)
				}

			},
			callback (val) {

			},
			changeListsKey (idx) {
				this.listsIndex = idx - 1
				this.current = 0
			},
			//推送内容  新建左边
			createPullLeft () {
				this.current = this.lists[this.listsIndex].list.length
				this.lists[this.listsIndex].list.push(JSON.parse(JSON.stringify(templateObj)))
				var hasTypeValue = false
				for (let i = 0; i < this.lists[this.listsIndex].list.length; i++) {
					if (this.lists[this.listsIndex].list[i].typeValue == 5) {
						hasTypeValue = true
					}
				}
				for (let i = 0; i < this.lists[this.listsIndex].list.length; i++) {
					if (hasTypeValue) {
						if (this.lists[this.listsIndex].list[i].typeValue == 5) {
							this.lists[this.listsIndex].list[i].disabled = false
						} else {
							this.lists[this.listsIndex].list[i].disabled = true
						}
					} else {
						this.lists[this.listsIndex].list[i].disabled = false
					}
				}
				var divscroll = document.getElementsByClassName('left-sider-content')[0]
				divscroll.scrollTop = divscroll.clientHeight
			},
			clickTab (index) {
				this.current = index
				let hasTypeValue = false
				for (let i = 0; i < this.lists[this.listsIndex].list.length; i++) {
					if (this.lists[this.listsIndex].list[i].typeValue == 5) {
						hasTypeValue = true
					}
				}
				for (let i = 0; i < this.lists[this.listsIndex].list.length; i++) {
					if (hasTypeValue) {
						if (this.lists[this.listsIndex].list[i].typeValue == 5) {
							this.lists[this.listsIndex].list[i].disabled = false
						} else {
							this.lists[this.listsIndex].list[i].disabled = true
						}
					} else {
						this.lists[this.listsIndex].list[i].disabled = false
					}
				}
			},
			// changeMsg (obj) {
			// 	this.lists[this.listsIndex].list[this.current] = obj
			// },
			deleteMsg () {
				let index = this.current
				this.current = this.current == 0 ? 0 : this.current - 1
				if (this.lists[this.listsIndex].list.length > 1) {
					this.lists[this.listsIndex].list.splice(index, 1)
				} else {
					this.lists[this.listsIndex].list = [JSON.parse(JSON.stringify(templateObj))]
				}
			},
			checkMove: function (e) {
				// console.log(e.draggedContext.futureIndex)
			},
			//添加标签
			addTagRules () {
				this.tagArr = JSON.parse(JSON.stringify(this.lists[this.listsIndex].tag_ids))
				this.tagNames = JSON.parse(JSON.stringify(this.lists[this.listsIndex].tag_name))
				this.chooseTagVisible = true
			},
			// 选择标签回滚
			modalVisibleChange (event, arr, tagName) {
				if (event == 'ok') {
					if (arr == '') {
						this.tagArr = []
						this.tagNames = []
					} else {
						this.tagArr = arr.split(',')
						this.tagNames = tagName
					}
				}
			},
			handleChoose () {
				this.lists[this.listsIndex].tag_ids = JSON.parse(JSON.stringify(this.tagArr))
				this.lists[this.listsIndex].tag_name = JSON.parse(JSON.stringify(this.tagNames))
				this.chooseTagVisible = false
			},
			// 关闭选择标签弹窗
			cancleChooseTag () {
				this.chooseTagVisible = false
			},
			//删除已选择的标签
			delTag (index) {
				this.lists[this.listsIndex].tag_ids.splice(index, 1)
				this.lists[this.listsIndex].tag_name.splice(index, 1)
			},
			//创建推送消息
			async createReply () {
				if (typeof this.title == 'object' && this.title.length == 0 && (typeof this.titleMsg == "undefined" || this.titleMsg.trim() == '')) {
					this.$message.error('请输入关键词名称')
					return false
				}
				console.log(JSON.stringify(this.lists))
				this.createDisabled = true
				const defaultMsgData = {
					is_user    : '',
					is_sync    : 0,
					group_id   : '',
					type       : '',
					content    : '',
					material_id: '',
					title      : '',
					appid      : '',
					pagepath   : '',
					newsList   : []
				}
				const defaultNewsList = {
					is_use     : '',
					material_id: '',
					title      : '',
					digest     : '',
					cover_url  : '',
					content_url: '',
					is_sync    : 0,
					group_id   : '',
					attach_id  : ''
				}
				let lists = JSON.parse(JSON.stringify(this.lists))
				let list = []
				let flag = false
				for (let a = 0; a < lists.length; a++) {
					if (lists[a].tag_ids.length == 0 && this.objType == 2) {
						this.$message.destroy()
						this.$message.warning('请检查内容' + (a + 1) + '的客户标签！')
						this.createDisabled = false
						flag = true
						break
					}
					list.push({
						keyword_tag_id: 0,
						tag_ids       : [],
						msgData       : []
					})
					list[a]['keyword_tag_id'] = lists[a].keyword_tag_id || 0
					list[a]['tag_ids'] = lists[a].tag_ids
					list[a]['msgData'] = []
					for (let i = 0; i < lists[a].list.length; i++) {
						let listData = JSON.parse(JSON.stringify(defaultMsgData))
						listData.type = lists[a].list[i].typeValue
						if (lists[a].list[i].typeValue == 1) {
							if (lists[a].list[i].textContent == '\n') {
								lists[a].list[i].textContent = ''
							} else {
								listData.content = lists[a].list[i].textContent
							}
							if (lists[a].list[i].textContent === '') {
								this.$message.destroy()
								this.$message.warning('请检查内容' + (a + 1) + '的文字信息！')
								this.createDisabled = false
								flag = true
								break
							}
							listData.is_user = lists[a].list[i].addType
							listData.material_id = lists[a].list[i].material_id
						} else if (lists[a].list[i].typeValue == 5) {
							// if (lists[a].list[i].sketchList.length > 1 && i != 0) {
							// 	this.$message.error('因接口限制，仅支持首条回复多图文')
							// 	this.createDisabled = false
							// 	flag = true
							// 	break
							// }
							let sFlag = false
							for (let j = 0; j < lists[a].list[i].sketchList.length; j++) {
								let pushData = JSON.parse(JSON.stringify(defaultNewsList))
								pushData.is_use = lists[a].list[i].sketchList[j].addType
								if (pushData.is_use == 0) {
									pushData.material_id = lists[a].list[i].sketchList[j].material_id
									listData.newsList.push(pushData)
									if (!pushData.material_id) {
										this.$message.destroy()
										this.$message.warning('请选择内容' + (a + 1) + '的图文！')
										this.createDisabled = false
										sFlag = true
										break
									}
								} else {
									pushData.title = lists[a].list[i].sketchList[j].inputTitle
									if (!pushData.title) {
										this.$message.destroy()
										this.$message.warning('请检查内容' + (a + 1) + '的图文信息！')
										sFlag = true
										this.createDisabled = false
										break
									}
									if (typeof lists[a].list[i].sketchList[j].digest == 'undefined') {
										pushData.digest = ''
									} else {
										pushData.digest = lists[a].list[i].sketchList[j].digest
									}
									pushData.cover_url = lists[a].list[i].sketchList[j].local_path.img
									if (!pushData.cover_url) {
										this.$message.destroy()
										this.$message.warning('请检查内容' + (a + 1) + '的图文信息！')
										sFlag = true
										this.createDisabled = false
										break
									}
									pushData.content_url = lists[a].list[i].sketchList[j].content_source_url
									if (!pushData.content_url) {
										this.$message.destroy()
										this.$message.warning('请检查内容' + (a + 1) + '的图文信息！')
										sFlag = true
										this.createDisabled = false
										break
									}
									pushData.content_url = lists[a].list[i].sketchList[j].content_source_url
									pushData.material_id = lists[a].list[i].sketchList[j].material_id
									pushData.is_sync = lists[a].list[i].sketchList[j].materialSync
									pushData.group_id = lists[a].list[i].sketchList[j].selectGroupId
									pushData.attach_id = lists[a].list[i].sketchList[j].attach_id
									listData.newsList.push(pushData)
								}
							}
							if (sFlag) {
								flag = true
								break
							}
						} else if (lists[a].list[i].typeValue == 2) {
							listData.material_id = lists[a].list[i].material_id
							if (!listData.material_id) {
								this.$message.destroy()
								this.$message.warning('请检查内容' + (a + 1) + '的图片！')
								this.createDisabled = false
								flag = true
								break
							}
						} else if (lists[a].list[i].typeValue == 6) {
							listData.is_user = lists[a].list[i].addType
							listData.is_sync = lists[a].list[i].materialSync
							listData.group_id = lists[a].list[i].selectGroupId
							listData.material_id = lists[a].list[i].material_id
							listData.title = lists[a].list[i].appletInputTitle
							listData.appid = lists[a].list[i].appid
							listData.pagepath = lists[a].list[i].pageUrl
							if (listData.is_user == 0) {
								if (!listData.material_id) {
									this.$message.destroy()
									this.$message.warning('请选择内容' + (a + 1) + '的小程序！')
									this.createDisabled = false
									flag = true
									break
								}
							} else {
								if (!listData.title) {
									this.$message.destroy()
									this.$message.warning('请检查内容' + (a + 1) + '的小程序信息！')
									this.createDisabled = false
									flag = true
									break
								}
								if (!listData.appid) {
									this.$message.destroy()
									this.$message.warning('请检查内容' + (a + 1) + '的小程序信息！')
									this.createDisabled = false
									flag = true
									break
								}
								if (!listData.pagepath) {
									this.$message.destroy()
									this.$message.warning('请检查内容' + (a + 1) + '的小程序信息！')
									this.createDisabled = false
									flag = true
									break
								}
							}
						} else {
							listData.material_id = lists[a].list[i].material_id
							if (!listData.material_id) {
								this.$message.destroy()
								this.$message.warning('请选择内容' + (a + 1) + '的' + templateObj.typeName[listData.type] + '！')
								this.createDisabled = false
								flag = true
								break
							}
						}
						list[a].msgData.push(listData)
					}
					if (flag) {
						break
					}
				}
				if (flag) {
					return false
				}
				let word = []
				if (this.titleMsg == '' || typeof this.titleMsg == 'undefined') {
					word = this.title
				} else {
					word = JSON.parse(JSON.stringify(this.title))
					word.push(this.titleMsg)
				}
				let params = {
					corp_id: localStorage.getItem('corpId'),
					id     : this.urlId,
					list   : list,
					keyword: word,
					type   : this.objType
				}
				console.log(JSON.stringify(params))
				const {data: res} = await this.axios.post("work-msg-keyword-attachment/keyword-set", params)
				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.createDisabled = false
				} else {
					this.$message.success("操作成功")
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					this.createDisabled = false
					if (typeof this.urlId == 'undefined') {
						this.$router.push("/smartRecommended/list")
					} else {
						this.$router.push("/smartRecommended/list?isRefresh=1")
					}
				}
			},
			//点击修改进入页面，获取详情
			async getDetail () {
				const {data: res} = await this.axios.post(
					"work-msg-keyword-attachment/keyword-detail",
					{
						corp_id: localStorage.getItem('corpId'),
						id     : this.urlId
					}
				)
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg)
					this.isLoading = false;
				} else {
					this.isLoading = false;
					this.objType = res.data.type
					this.title = res.data.keyword
					let content = res.data.attachmentData
					// console.log(this.replyList)
					if (content.length > 0) {
						this.lists = []
						for (let len = 0; len < content.length; len++) {
							let obj = {
								list          : [],
								tag_ids       : content[len].tag_ids,
								keyword_tag_id: content[len].keyword_tag_id,
								tag_name      : content[len].tag_name,   // 初始化的medium-editor
							}
							let replyList = content[len].attach_list
							let list = []
							for (let i = 0; i < replyList.length; i++) {
								list.push(JSON.parse(JSON.stringify(templateObj)))
								list[i].typeValue = replyList[i].typeValue
								if (list[i].typeValue == 5) {
									list[i].sketchList[0].id = replyList[i].id
									list[i].sketchList[0].addType = replyList[i].addType
									list[i].sketchList[0].inputTitle = replyList[i].inputTitle
									list[i].sketchList[0].digest = replyList[i].digest
									list[i].sketchList[0].content_source_url = replyList[i].content_source_url
									list[i].sketchList[0].material_id = replyList[i].material_id
									list[i].sketchList[0].local_path.img = replyList[i].local_path.img
									list[i].sketchList[0].local_path.audio = replyList[i].local_path.audio
									list[i].sketchList[0].materialSync = replyList[i].is_sync
									list[i].sketchList[0].disabledSync = replyList[i].is_sync
									list[i].sketchList[0].selectGroupId = replyList[i].group_id
									list[i].sketchList[0].attach_id = replyList[i].attach_id
									list[i].sketchList[0].closeShowModal3 = true
								} else if (list[i].typeValue == 6) {
									list[i].attach_id = replyList[i].attach_id
									list[i].addType = parseInt(replyList[i].is_user)
									list[i].appletUrl = replyList[i].local_path
									list[i].appletInputTitle = replyList[i].file_name
									list[i].appid = replyList[i].appid || ''
									list[i].pageUrl = replyList[i].pagepath || ''
									list[i].materialSync = replyList[i].is_sync || 0
									list[i].disabledSync = replyList[i].is_sync || 0
									list[i].selectGroupId = replyList[i].group_id || ''
									list[i].material_id = replyList[i].material_id
									list[i].closeShowModal3 = true
								} else {
									list[i].addType = parseInt(replyList[i].is_user)
									list[i].extension = replyList[i].extension
									list[i].id = replyList[i].id
									list[i].file_name = replyList[i].file_name
									list[i].material_id = replyList[i].material_id
									list[i].local_path.img = replyList[i].local_path.img
									list[i].local_path.audio = replyList[i].local_path.audio
									list[i].textContent = replyList[i].textAreaValueHeader
									list[i].textAreaValueHeader = replyList[i].textAreaValueHeader.replace(
										/{nickname}/g,
										'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>'
									).replace(/\n/g, '<br>')
									list[i].textAreaValueHeader = '<p>' + list[i].textAreaValueHeader + '</p>'
									let a = list[i].textContent.replace(/{nickname}/g, ' 客户名称 ').replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '')
									list[i].wordNum = a.length
									list[i].closeShowModal3 = true
								}
								// console.log(list[i].textContent)
							}
							list.map((x) => {
								if (x.typeValue == 5) {
									x.sketchList.map((y) => {
										if (y.cover_url == '') {
											y.closeShowModal3 = false
										}
									})
								} else {
									if (x.material_id === null) {
										x.closeShowModal3 = false
									}
								}
							})
							obj.list = JSON.parse(JSON.stringify(list))
							this.lists.push(JSON.parse(JSON.stringify(obj)))
						}
					}
					console.log(JSON.stringify(this.lists))
				}
			},
			moment,
		},
		beforeCreate () {
			if (!this.$store.state.corpId) {
				this.$router.back()
			}
		},
		created () {
			this.urlId = this.$route.query.id
			var obj = {
				list        : JSON.parse(JSON.stringify(this.list)),
				tag_ids     : [],
				tag_name    : [],
				mediumEditor: [],   // 初始化的medium-editor
			}
			this.lists.push(JSON.parse(JSON.stringify(obj)))
			if (typeof this.urlId != "undefined") {
				this.isLoading = true;
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/smartRecommended/list')
				this.getDetail()
			}
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";

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
			word-break: break-word;
		}
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
		border-bottom: 1px solid #E2E2E2;
	}

	.content-bd {
		background: #F5F5F5;
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
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
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
		color: #01b065;
		margin-right: -1px;
	}

	.index {
		float: left;
		width: 30px;
		height: 38px;
		line-height: 38px;
		text-align: center;
		border-right: 1px solid #D8D8D8;
	}

	.type {
		display: inline-block;
		width: 57px;
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
		max-height: 860px;
		min-height: 480px;
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

	.audio {
		width: 100%;
		height: 150px;
		padding: 50px 20px;
		background: #FFF;
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

	.wifi-symbol {
		width: 30px;
		height: 30px;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(135deg);
		position: absolute;
		left: 13px;
		top: 6px;
	}

	.wifi-circle {
		border: 2px solid #01b065;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 5px;
		height: 5px;
		background: #01b065;
		top: 25px;
		left: 25px;
	}

	.second {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
	}

	.third {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
	}

	.second1 {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
		animation: fadeInOut 1s infinite 0.2s;
	}

	.third1 {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
		animation: fadeInOut 1s infinite 0.4s;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
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

	/deep/ .ant-form-item-children {
		display: block;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	/deep/ .emoji {
		font-size: 20px;
		height: 40px !important;
		width: 40px !important;
	}

	.icon-btn {
		margin-right: 10px;
	}

	/deep/ .inputTitle {
		height: 30px;
		line-height: 30px;
		background: #0F0F0F;
		opacity: 0.3;
		color: #FFF;
		padding: 0 10px;
		margin-top: -30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		p {
			display: inline-block;
		}
	}

	/deep/ .inputTitle2 {
		background: #FFF;
		height: 104px;
		padding: 20px;

		p {
			word-break: break-word;
			width: calc(100% - 74px);
			overflow: hidden;
			text-overflow: -o-ellipsis-lastline;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			float: left;
		}
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

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/*/deep/ .ant-tabs-nav, /deep/ .ant-tabs-tab-prev, /deep/ .ant-tabs-tab-next{*/
	/*	background-color: #fff;*/
	/*}*/
	/deep/ .ant-tabs-bar {
		margin-bottom: 8px;
	}

	/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab .ant-tabs-close-x {
		display: none;
	}

	/deep/ .ant-tabs-tab {
		font-size: 14px;
	}

	/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab:first-child {
		border-left: 0px;
	}

	/deep/ .ant-tabs-extra-content .ant-tabs-new-tab {
		color: #01b065 !important;
		border: 1px solid #01b065 !important;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	.left-sider-content {
		border: 1px solid #E2D6D6;
		margin: auto;
		overflow-y: auto;
		box-sizing: content-box;
		height: 100%;
		width: 100%;
		background: #F5F5F5;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
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

	.applet-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0;
	}

	.file-name {
		float: right;
		width: calc(100% - 90px);
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.file-icon {
		width: 70px;
		height: 70px;
		margin: 0 !important;
		float: left;
	}

	.popover-content {
		max-width: 500px;
		max-height: 200px;
		overflow-y: auto;
	}
</style>