<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="typeof urlId == 'undefined'">新建</template>
						<template v-if="typeof urlId != 'undefined'">修改</template>
						规则
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
									<template>
										<!-- 图文 -->
										<div v-show="list[current].typeValue == 5 && list[current].sketchList[0].closeShowModal3" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;"/>
											<template>
												<div style="border: 1px solid #E8E8E8;width: calc(100% - 47px);float: right;">
													<img :src="list[current].sketchList[0].local_path.img"
													     style="height: 145px;width: 100%;object-fit: cover;"/>
													<div class="inputTitle"
													     v-html="list[current].sketchList[0].inputTitle==''?'标题':list[current].sketchList[0].inputTitle"></div>
													<template
															v-for="(sketch,sketchIndex) in list[current].sketchList.slice(1)">
														<div class="inputTitle2">
															<p v-html="list[current].sketchList[sketchIndex+1].inputTitle==''?'标题':list[current].sketchList[sketchIndex+1].inputTitle"></p>
															<img :src="list[current].sketchList[sketchIndex+1].local_path.img"
															     alt=""
															     style="width: 64px;height: 64px;float: right;object-fit: cover;">
														</div>
													</template>
												</div>
											</template>
										</div>
										<!-- 图片 -->
										<div v-show="list[current].typeValue == 2 && list[current].closeShowModal3" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;"/>
											<!-- 选中后 -->
											<img :src="list[current].local_path.img" alt
											     style="width: 150px;border-radius: 4px;object-fit: cover; vertical-align: top;"/>
										</div>
										<!-- 文本 -->
										<div v-show="list[current].typeValue == 1" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;float: left;"/>
											<span v-html="list[current].textAreaValueHeader"
											      class="item-info msg_content_txt"></span>
										</div>
										<!-- 音频 -->
										<div v-show="list[current].typeValue == 3 && list[current].closeShowModal3" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;"/>
											<!-- 选中后 -->
											<template>
												<div class="audio">
													<div style="float: left;font-size: 16px;">
														{{list[current].file_name}}
													</div>
													<div class="box">
														<div class="wifi-symbol">
															<div class="wifi-circle first"></div>
															<div class="wifi-circle second"></div>
															<div class="wifi-circle third"></div>
														</div>
													</div>
												</div>
											</template>
										</div>
										<!-- 视频 -->
										<div v-show="list[current].typeValue == 4 && list[current].closeShowModal3" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;"/>
											<!-- 选中后 -->
											<template v-if="list[current].closeShowModal3">
												<a-card hoverable style="width: calc(100% - 47px);float: right;">
													<video-player class="video-player vjs-custom-skin" ref="videoPlayer"
													              :playsinline="true"
													              :options="playerOptions"></video-player>
													<a-card-meta :title="list[current].file_name"
													             style="height: 50px;line-height: 50px;text-align: center;">
													</a-card-meta>
												</a-card>
											</template>
										</div>
										<!--小程序-->
										<div v-if="list[current].typeValue == 6 && list[current].closeShowModal3"
										     class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36"
													style="object-fit: cover;margin-right: 10px;float: left;"/>
											<div class="item-info msg_content_txt">
												<!--											<p class="url-title" style="color: #A3A3A3;">{{appletInputTitle}}</p>-->
												<p class="applet-title">{{list[current].appletInputTitle}}</p>
												<img :src="list[current].appletUrl" alt="" style="width: 100%;">
											</div>
										</div>
									</template>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- <a-spin tip="Loading..." size="large" :spinning="isLoading"></a-spin> -->
								<!-- 公众号选择 -->
								<div class="content-hd" v-if="$store.state.wxArr.length > 1">
									<a-form>
										<a-form-item label="选择公众号" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<template>
												<div style="display: inline-block;cursor: pointer;" @click="add">
													<a-avatar shape="square" :size="40" :src="avatarImg"
													          style="margin: 0 15px;"/>
													<span>{{$store.state.wxNickName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
													        v-if="typeof urlId == 'undefined'"/>
												</div>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</template>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd">
									<a-form style="margin-left: 10px;">
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             style="padding-top: 20px;">
										<span slot="label">
												<span style="color: red;">*</span>
												<span>规则名称</span>
											</span>
											<div style="display: inline-block;width: 545px;">
												<a-input style="width: calc(100% - 160px)" v-model="title"
												         :disabled="typeof urlId != 'undefined'"
												         :maxLength="20"
												         placeholder="规则名称">
													<span slot="suffix">
                                                        {{title.length}} / 20
													</span>
												</a-input>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</div>
										</a-form-item>
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
										<span slot="label">
												<span style="color: red;">*</span>
												<span>关键词</span>
											</span>
											<div style="display: inline-block;width: 60%;">
												<label>精准匹配：<span style="color: #ff562D;">规则：客户输入的关键词与设置的内容完全匹配才能触发回复内容</span></label>
												<diyInput :keyLength="15" :maxLength="15" style="border: 1px solid #E2E2E2;" key="equalKeyword" @func="getEqualKeyword" :msg="equalKeyword"
												          placeholder="输入关键词，按回车键可输入多个关键词，最多添加15个"></diyInput>
											</div>
											<div style="display: inline-block;width: 60%;">
												<label>模糊匹配：<span style="color: #ff562D;">规则：客户输入的关键词与设置的内容包含匹配即可触发回复内容</span></label>
												<diyInput :keyLength="15" :maxLength="15" style="border: 1px solid #E2E2E2;" key="containKeyword" @func="getContainKeyword"
												          :msg="containKeyword" placeholder="输入关键词，按回车键可输入多个关键词，最多添加15个"></diyInput>
											</div>
										</a-form-item>
										<!-- 推送内容 -->
										<a-form-item label="推送内容" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<div style="margin-top: 15px;">
												<div class="pull-left fl">
													<vuedraggable v-model="list" :move="checkMove">
														<transition-group>
															<div class="push-type-list"
															     :class="{active: index==current}"
															     @click="clickTab(index)"
															     v-for="(element,index) in list"
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
													     v-show="list.length < 6">
		                                                <span class="add-icon">
		                                                    <a-icon type="plus"/>
		                                                </span>
														<span class="add-btn">新建</span>
													</div>
												</div>
												<div class="pull-right fl" >
													<sendMsg @deleteMsg="deleteMsg" :wordLimit="650"
													         :msg="list[current]"></sendMsg>
												</div>
											</div>
										</a-form-item>
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
										<span slot="label">
												<span>回复模式</span>
											</span>
											<a-radio-group name="radioGroup"
											               v-model="replyMode">
												<a-radio :value="1">全部回复</a-radio>
												<a-radio :value="0">随机回复一条</a-radio>
											</a-radio-group>
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
							<!-- 公众号选择弹窗 -->
							<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="message-add"></wxModal>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import wxModal from "@/components/WxModal.vue"
	import vuedraggable from "vuedraggable"
	import chooseMsg from "@/components/ChooseMsg.vue"
	import {videoPlayer} from "vue-video-player"
	import "video.js/dist/video-js.css"
	import moment from 'moment'
	import {defaulImg} from '../../../assets/img.png'
	import sendMsg from '../../../components/sendMsg/Index'
	import diyInput from '../../../components/InputRecommended'

	const news = {
		id                : 0,
		addSketchVisible  : true,//控制添加图文按钮显示与隐藏
		addType           : 1,//添加方式
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
		typeValue          : 2,//消息类型，5图文，2图片，1文本，3音频，4视频
		typeName           : {
			1: '文本',
			2: '图片',
			3: '音频',
			4: '视频',
			5: '图文',
			6: '小程序'
		},
		id                 : 0,
		closeShowModal3    : false,//是否选好素材
		disabled           : false,//消息类型图文能否被选
		file_name          : "", //手机上展示的素材标题
		material_id        : "", //选中的素材id
		local_path         : {
			img  : "",
			audio: ""
		}, //手机上展示的图片、音频、视频链接
		addType            : 1,
		sketchList         : [JSON.parse(JSON.stringify(news))],//图文消息添加的数组
		appletUrl          : '',// 小程序的封面链接
		appletInputTitle   : '',// 小程序的标题
		appid              : '',// 小程序的appid
		pageUrl            : '',// 小程序page路径
		materialSync       : 0, // 小程序是否同步，0不同步，1同步
		selectGroupId      : '',// 上传选择的分组id
		textAreaValueHeader: "", //模板展示的内容
		textContent        : '',//编辑框传给后台的内容
	}
	export default {
		components: {
			wxModal, vuedraggable, chooseMsg, videoPlayer, defaulImg, sendMsg, diyInput
		},
		data () {
			let wxNum =
				this.$store.state.wxNum.length > 0 ? this.$store.state.wxNum : ""
			return {
				groupList          : [], // 小组列表
				wxInfo             : [], //微信公众号列表
				avatarImg          : "", //微信公众号头像
				showModal2         : false, //公众号组件弹窗显示与隐藏
				wxNum              : wxNum, //修改后的微信id值
				commonUrl          : this.$store.state.commonUrl, //公共的链接
				playerOptions      : {
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
				title              : '',
				equalKeyword       : [], // 精准匹配关键词
				equalKeywordTitle  : '', // 精准匹配关键词输入框内容
				containKeyword     : [], //模糊匹配关键词
				containKeywordTitle: '', // 模糊匹配关键词输入框内容
				list               : [JSON.parse(JSON.stringify(templateObj))],
				current            : 0,//当前选中的tab值的index值
				replyMode          : 1, // 1、全部回复 0、随机一条
				urlId              : '', //地址栏参数id值
				replyList          : [],//存详情的数组
				chooseId           : 0,//跳入组件时，选择好的id
				createDisabled     : false,//创建按钮的置灰
				isLoading          : false, //Loading 组件显示与隐藏
			}
		},

		methods: {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/keyword/list?isRefresh=1")
			},
			//更换公众号
			add () {
				if (typeof this.urlId != 'undefined') {
					return false
				}
				if (this.$route.query.id) {
					return
				}
				this.showModal2 = true
				this.isLoading = true;
			},
			modalVisibleChange (event, wxNum, wxNickName) {
				if (event == "ok") {
					this.isLoading = false;
					this.showModal2 = false
					this.$store.dispatch("changeWxNum", wxNum)
					this.$store.commit("changeWxNickName", wxNickName);
					this.avatarImg = this.wxInfo[this.$store.state.wxNumIndex].head_img
					this.containKeyword = ''
					this.equalKeyword = ''
					this.list = [JSON.parse(JSON.stringify(templateObj))]
				} else {
					this.isLoading = false;
					this.showModal2 = false
				}
			},
			//推送内容  新建左边
			createPullLeft () {
				this.current = this.list.length
				this.list.push(JSON.parse(JSON.stringify(templateObj)))
				var hasTypeValue = false
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i].typeValue == 5) {
						hasTypeValue = true
					}
				}
				for (let i = 0; i < this.list.length; i++) {
					if (hasTypeValue) {
						if (this.list[i].typeValue == 5) {
							this.list[i].disabled = false
						} else {
							this.list[i].disabled = true
						}
					} else {
						this.list[i].disabled = false
					}
				}
				var divscroll = document.getElementsByClassName('left-sider-content')[0]
				divscroll.scrollTop = divscroll.clientHeight
			},
			clickTab (index) {
				this.current = index
				let hasTypeValue = false
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i].typeValue == 5) {
						hasTypeValue = true
					}
				}
				for (let i = 0; i < this.list.length; i++) {
					if (hasTypeValue) {
						if (this.list[i].typeValue == 5) {
							this.list[i].disabled = false
						} else {
							this.list[i].disabled = true
						}
					} else {
						this.list[i].disabled = false
					}
				}
			},
			deleteMsg () {
				let index = this.current
				this.current = this.current == 0 ? 0 : this.current - 1
				if (this.list.length > 1) {
					this.list.splice(index, 1)
				} else {
					this.list = [JSON.parse(JSON.stringify(templateObj))]
				}
			},
			getEqualKeyword (list, title) {
				this.equalKeywordTitle = title.replace(/\s+/g, '')
				this.equalKeyword = []
				for(let i = 0; i < list.length; i++) {
					this.equalKeyword.push(list[i].replace(/\s+/g, ''))
				}
			},
			getContainKeyword (list, title) {
				this.containKeywordTitle = title.replace(/\s+/g, '')
				this.containKeyword = []
				for(let i = 0; i < list.length; i++) {
					this.containKeyword.push(list[i].replace(/\s+/g, ''))
				}
			},
			checkMove: function (e) {
			},
			//创建推送消息
			async createReply () {
				this.createDisabled = true
				if (this.title === '') {
					this.$message.destroy()
					this.$message.warning('请检查规则名称！')
					this.createDisabled = false
					return false
				}
				let containKeyword = JSON.parse(JSON.stringify(this.containKeyword))
				if(typeof this.containKeywordTitle != 'undefined' && this.containKeywordTitle.trim() != '') {
					containKeyword.push(this.containKeywordTitle.trim())
				}
				let equalKeyword = JSON.parse(JSON.stringify(this.equalKeyword))
				if(typeof this.equalKeywordTitle != 'undefined'  && this.equalKeywordTitle.trim() != '') {
					equalKeyword.push(this.equalKeywordTitle.trim())
				}
				if (containKeyword.length == 0 && equalKeyword.length == 0) {
					this.$message.destroy()
					this.$message.warning('关键词不能为空！')
					this.createDisabled = false
					return false
				}
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
				let list = JSON.parse(JSON.stringify(this.list))
				let msg = []
				let flag = false
				for (let i = 0; i < list.length; i++) {
					let listData = JSON.parse(JSON.stringify(defaultMsgData))
					listData.type = list[i].typeValue
					if (list[i].typeValue == 1) {
						if (list[i].textContent == '\n') {
							list[i].textContent = ''
						} else {
							listData.content = list[i].textContent
						}
						if (list[i].textContent === '') {
							this.$message.destroy()
							this.$message.warning('请检查内容' + (i + 1) + '的文本信息！')
							this.createDisabled = false
							flag = true
							break
						}
					} else if (list[i].typeValue == 5) {
						// if (list[i].sketchList.length > 1 && i != 0) {
						// 	this.$message.error('因接口限制，仅支持首条回复多图文')
						// 	this.createDisabled = false
						// 	return false
						// }
						let sFlag = false
						for (let j = 0; j < list[i].sketchList.length; j++) {
							let pushData = JSON.parse(JSON.stringify(defaultNewsList))
							pushData.is_use = list[i].sketchList[j].addType
							if (pushData.is_use == 0) {
								pushData.material_id = list[i].sketchList[j].material_id
								listData.newsList.push(pushData)
								if (!pushData.material_id) {
									this.$message.destroy()
									this.$message.warning('请选择内容' + (i + 1) + '的图文！')
									sFlag = true
									this.createDisabled = false
									break
								}
							} else {
								pushData.title = list[i].sketchList[j].inputTitle
								if (!pushData.title) {
									this.$message.destroy()
									this.$message.warning('请检查内容' + (i + 1) + '的图文信息！')
									sFlag = true
									this.createDisabled = false
									break
								}
								if (typeof list[i].sketchList[j].digest == 'undefined') {
									pushData.digest = ''
								} else {
									pushData.digest = list[i].sketchList[j].digest
								}
								pushData.cover_url = list[i].sketchList[j].local_path.img
								if (!pushData.cover_url) {
									this.$message.destroy()
									this.$message.warning('请检查内容' + (i + 1) + '的图文信息！')
									sFlag = true
									this.createDisabled = false
									break
								}
								pushData.content_url = list[i].sketchList[j].content_source_url
								if (!pushData.content_url) {
									this.$message.destroy()
									this.$message.warning('请检查内容' + (i + 1) + '的图文信息！')
									sFlag = true
									this.createDisabled = false
									break
								}
								pushData.material_id = list[i].sketchList[j].material_id
								pushData.is_sync = list[i].sketchList[j].materialSync
								pushData.group_id = list[i].sketchList[j].selectGroupId
								pushData.attach_id = list[i].sketchList[j].attach_id
								listData.newsList.push(pushData)
							}
						}
						if (sFlag) {
							flag = true
							break
						}
					} else if (list[i].typeValue == 2) {
						listData.material_id = list[i].material_id
						if (!listData.material_id) {
							this.$message.destroy()
							this.$message.warning('请检查内容' + (i + 1) + '的图片！')
							this.createDisabled = false
							flag = true
							break
						}
					} else if (list[i].typeValue == 6) {
						listData.attach_id = list[i].attach_id
						listData.is_user = list[i].addType
						listData.is_sync = list[i].materialSync
						listData.group_id = list[i].selectGroupId
						listData.material_id = list[i].material_id
						listData.title = list[i].appletInputTitle
						listData.appid = list[i].appid
						listData.pagepath = list[i].pageUrl
						if (listData.is_user == 0) {
							if (!listData.material_id) {
								this.$message.destroy()
								this.$message.warning('请选择内容' + (i + 1) + '的小程序！')
								this.createDisabled = false
								flag = true
								break
							}
						} else {
							if (!listData.title) {
								this.$message.destroy()
								this.$message.warning('请检查内容' + (i + 1) + '的小程序信息！')
								this.createDisabled = false
								flag = true
								break
							}
							if (!listData.appid) {
								this.$message.destroy()
								this.$message.warning('请检查内容' + (i + 1) + '的小程序信息！')
								this.createDisabled = false
								flag = true
								break
							}
							if (!listData.pagepath) {
								this.$message.destroy()
								this.$message.warning('请检查内容' + (i + 1) + '的小程序信息！')
								this.createDisabled = false
								flag = true
								break
							}
						}
					} else {
						listData.material_id = list[i].material_id
						if (!listData.material_id) {
							this.$message.destroy()
							this.$message.warning('请选择内容' + (i + 1) + '的' + templateObj.typeName[listData.type] + '！')
							this.createDisabled = false
							flag = true
							break
						}
					}
					msg.push(listData)
				}
				if (flag) {
					return false
				}
				let params = {
					id             : this.urlId,
					uid : localStorage.getItem('uid'),
					equal_keyword  : equalKeyword,
					contain_keyword: containKeyword,
					wx_id          : this.wxNum,
					list           : msg,
					title          : this.title,
					reply_mode     : this.replyMode
				}
				const {data: res} = await this.axios.post("keyword/add", params)
				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.createDisabled = false
				} else {
					this.$message.success("操作成功")
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					this.createDisabled = false
					if (typeof this.urlId == 'undefined') {
						this.$router.push("/keyword/list")
					} else {
						this.$router.push("/keyword/list?isRefresh=1")
					}
				}
			},
			//点击修改进入页面，获取详情
			async getDetail () {
				const {data: res} = await this.axios.post(
					"keyword/reply-info",
					{
						id: this.urlId
					}
				)
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg)
					this.isLoading = false
				} else {
					this.isLoading = false
					this.title = res.data.title
					this.replyMode = parseInt(res.data.reply_mode)
					this.containKeyword = res.data.contain_keyword
					this.equalKeyword = res.data.equal_keyword
					let list = []
					let replyList = res.data.content.replyList
					for (let i = 0; i < replyList.length; i++) {
						list.push(JSON.parse(JSON.stringify(templateObj)))
						list[i].typeValue = replyList[i].typeValue
						if (list[i].typeValue == 5 && replyList[i].sketchList.length > 0) {
							for (let j = 0; j < replyList[i].sketchList.length; j++) {
								list[i].sketchList.push([JSON.parse(JSON.stringify(news))])
								list[i].sketchList[j].id = replyList[i].sketchList[j].id
								list[i].sketchList[j].addType = replyList[i].sketchList[j].addType
								list[i].sketchList[j].inputTitle = replyList[i].sketchList[j].inputTitle
								list[i].sketchList[j].digest = replyList[i].sketchList[j].digest
								list[i].sketchList[j].content_source_url = replyList[i].sketchList[j].content_source_url
								list[i].sketchList[j].material_id = replyList[i].sketchList[j].material_id
								list[i].sketchList[j].local_path.img = replyList[i].sketchList[j].local_path.img
								list[i].sketchList[j].local_path.audio = replyList[i].sketchList[j].local_path.audio
								list[i].sketchList[j].materialSync = replyList[i].sketchList[j].is_sync
								list[i].sketchList[j].disabledSync = replyList[i].sketchList[j].is_sync
								list[i].sketchList[j].selectGroupId = replyList[i].sketchList[j].group_id
								list[i].sketchList[j].isAdvance = false
								list[i].sketchList[j].showTextContent = true
								list[i].sketchList[j].attach_id = replyList[i].sketchList[j].attach_id
							}
							if (list[i].typeValue == 5) {
								list[i].sketchList.splice(list[i].sketchList.length - 1, 1)
							}
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
							list[i].id = replyList[i].attach_id
							list[i].file_name = replyList[i].file_name
							list[i].material_id = replyList[i].material_id
							list[i].local_path.img = replyList[i].local_path.img
							list[i].local_path.audio = replyList[i].local_path.audio
							list[i].textContent = replyList[i].textAreaValueHeader
							list[i].textAreaValueHeader = replyList[i].textAreaValueHeader.replace(
								/{nickname}/g,
								'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>'
							).replace(/\n/g, '<br>')
							// list[i].textAreaValueHeader = '<p>' + list[i].textAreaValueHeader + '</p>'
						}
					}
					list.map((x) => {
						if (x.typeValue == 5) {
							x.sketchList.map((y) => {
								if (y.cover_url == '') {
									y.closeShowModal3 = false
								} else {
									y.closeShowModal3 = true
								}
							})
						} else {
							if (x.material_id === null) {
								x.closeShowModal3 = false
							} else {
								x.closeShowModal3 = true
							}
						}
					})
					this.list = list
				}
			},
			moment,
		},
		beforeCreate () {
			if (!this.$store.state.wxNum) {
				this.$router.back()
			}
		},
		created () {
			this.urlId = this.$route.query.id
			if (typeof this.urlId != "undefined") {
				this.isLoading = true;
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/keyword/list')
				this.getDetail()
			}
			const _this = this
			this.$store.dispatch("getWx", info => {
				_this.wxInfo = info

				if (!_this.avatarImg) {
					_this.avatarImg = _this.wxInfo[_this.$store.state.wxNumIndex].head_img
				}
			})
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
		background-color: #1890FF;
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
		color: #1890FF;
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
		min-height: 300px;
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
		float: right;
		width: calc(100% - 47px);
		height: 65px;
		padding: 10px 20px;
		background: #FFF;
	}

	.box {
		float: right;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
		border: 2px solid #1890FF;
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
		border: 2px solid #1890FF;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 5px;
		height: 5px;
		background: #1890FF;
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
		color: #1890FF !important;
		border: 1px solid #1890FF !important;
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
</style>