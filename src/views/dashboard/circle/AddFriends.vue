<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template>{{isEdit == 0 ? '新建消息' : '修改消息'}}</template>
						<a-button type="primary" icon="rollback" @click="goBack" style="float: right;margin-top: 9px;">
							返回列表
						</a-button>
					</a-layout-header>
					<a-layout class="fans-content">
						<!-- 左侧 -->
						<a-layout-sider>
							<div style="height: 100%; overflow-y: auto;padding-bottom: 10px;border: 1px solid #F1F3F5;">
								<img src="../../../assets/wxHeader.png"
								     style="width:100%;border-bottom:1px solid #F1F3F5;margin-bottom: 10px"/>

								<div style="width: 100%;display: flex">
									<div class="showTime">
										<span style="font-size: 24px;font-weight: bold">今天</span>
									</div>
									<!--                    图片-->
									<div style="width: 75%;">
										<pre style="max-height: 13rem;overflow-y: scroll;width: 95%;display:block;white-space: pre-wrap;word-wrap: break-word;color: #000">{{publishForm.context}}</pre>
										<div class="covers" v-if="fileList.length>0&&publishType==1">
											<div class="cover" v-for="(item,index) in fileList" :key='index'
											     v-if="item.url">
												<img :src="item.url.substr(0, 7) =='/upload'?commonUrl+item.url:item.url"
												     width="75%" class="min" alt="">
											</div>
										</div>
										<!--                      视频-->
										<div v-if="publishType==2&&publicOptions.sources.length>0"
										     style="max-width: 95%;padding:10px 6px 0px 5px ">
											<video-player
													class="video-player vjs-custom-skin"
													ref="videoPlayer"
													style="width: 100%;"
													:playsinline="true"
													:options="publicOptions"
											></video-player>
										</div>
										<!--                    文本-->
										<div v-if="publishForm.info[0]&&publishForm.info[0].pic_url&&publishType==3"
										     style="margin:1rem 1rem 0 0;display: flex;height: 70px;background: #F1F3F5;">
											<div style="width:70px;height: 70px;padding: 10px">
												<img class="input_img2"
												     :src="publishForm.info[0].pic_url.substr(0, 7) =='/upload'?commonUrl+publishForm.info[0].pic_url:publishForm.info[0].pic_url"
												     alt=""/>
												<img v-if="publishForm.pic_url==''" class="input_img2"
												     src="../../../assets/url.png" alt=""/>

											</div>
											<div style="flex-grow: 1;height: 70px;">
												<div class="inp_title">
													{{publishForm.info[0].title}}
												</div>
												<div class="input_text3">
													{{publishForm.info[0].description}}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- <a-spin tip="Loading..." size="large" :spinning="isLoading"></a-spin> -->
								<!-- 选择企业微信 -->
								<a-form-model>
									<div class="content-hd" v-if="audit==0">
										<a-form-model-item label="选择企业微信" :label-col="{ span: 3 }"
										                   :wrapper-col="{ span: 21 }">
											<template>
												<div style="display: inline-block;cursor: pointer;"
												     @click="changeAgent">
													<img src="../../../assets/WeChatLogo.jpg"
													     style="width: 24px;margin: -3px 6px 0 0;"/>
													<span>{{publishForm.corpName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
													/>
												</div>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</template>
										</a-form-model-item>
									</div>
									<div class="content-bd">
										<a-form-model-item label="内容标题" :label-col="{ span: 3 }"
										                   v-if="audit==0"
										                   :wrapper-col="{ span: 21 }"
										                   style="padding-top: 0px;">
											<a-input :disabled="isEdit==1" v-model="publishForm.title"
											         placeholder="请填写内容标题，限20字符"
											         :maxLength="20" style="width: 60%;"
											/>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">
												{{publishForm.title === null ? 0 : publishForm.title.length}} / 20
											</span>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦创建，不可修改）</span>
										</a-form-model-item>
										<a-form-model-item label="客户归属" :label-col="{ span: 3 }"
										                   :wrapper-col="{ span: 21 }"
										                   v-if="audit!=1"
										>
											<a-radio-group name="radioGroup" v-model="memberType"
											               @change="handleMemberChange">
												<a-radio :value="1">全部成员</a-radio>
												<a-radio :value="2">
													<a-button :disabled="memberType==1" @click="chooseMember(0)">
														选择成员
													</a-button>
													<span style="margin-left: 5px" v-if="selectedMemberNum>0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
													<a style="margin-left: 10px;" v-if="selectedMemberNum>0"
													   @click="resetMember">
														重置
													</a>
												</a-radio>
											</a-radio-group>
										</a-form-model-item>
										<a-form-model-item label="朋友圈内容" :label-col="{ span: 3 }"
										                   :wrapper-col="{ span: 21 }">
											<div>
												<div style="height: 10px;background: #F5F5F5;width: 100%;clear: both"></div>
												<div class="pull-right fl ">
													<a-form-model-item label="朋友圈类型" :label-col="{ span: 3 }"
													                   align="left"
													                   :wrapper-col="{ span: 20 }">
														<a-radio-group v-model="publishType"
														               @change="changePublishType">
															<a-radio :value="1">
																图片/文字
															</a-radio>
															<a-radio :value="2">
																视频
															</a-radio>
															<a-radio :value="3">
																图文链接
															</a-radio>
														</a-radio-group>
													</a-form-model-item>
													<div style=" padding: 27px 20px;background: #F1F3F5">
														<!-- 文本 -->
														<div>
															<a-textarea :maxLength="500"
															            v-model="publishForm.context"
															            placeholder="请输入想发表的内容"
															            :autoSize="{ minRows: 9, maxRows: 9 }"
															/>
															<div style="float: right;line-height: 20px">
																500
															</div>
														</div>
													</div>
													<a-form-model-item v-if="publishType!==1" label="图文添加方式"
													                   align="left"
													                   :label-col="{ span: 4 }"
													                   :wrapper-col="{ span: 20 }">
														<a-radio-group style="line-height: 40px" @change="addTypeChange"
														               v-model="addType">
															<a-radio :value="1">
																自定义设定
															</a-radio>
															<a-radio :value="2">
																从素材库导入
															</a-radio>
														</a-radio-group>
													</a-form-model-item>
													<!--图片-->
													<a-upload v-if="publishType ==1"
													          class="pic"
													          style="width: 90%;margin: 1rem 0 0 0px"
													          :multiple="true"
													          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
													          list-type="picture-card"
													          :file-list="fileList"
													          @preview="handlePreview"
													          :beforeUpload="beforeUploadPic"
													          @change="handleChange"
													>
														<div class="local" v-if="this.fileList.length<9">
															<a-icon type="plus"
															        style="font-size: 16px;position: absolute;top: 35%;left: 50%;transform: translate(-50%,-50%)"/>
															<div class="selectPhoto">本地上传</div>
														</div>

														<div class="material_image "
														     v-if="this.fileList.length<9"
														     @click.stop.prevent="selectMaterial">
															<a-icon type="plus"
															        style="font-size: 16px;position: absolute;transform: translate(-50%,-50%)"/>
															<div style="margin-top: 1.3rem">素材库导入</div>
														</div>
													</a-upload>
													<!--视频-->
													<div class="video_upload"
													     v-if="publishType ==2">
														<a-spin tip="Loading..." size="large"
														        :spinning="uploadLoading"></a-spin>
														<a-upload v-if="addType==1&&!uploadVideo.local_path"
														          style="height: 100%"
														          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
														          :multiple="false"
														          :fileList="[]"
														          :beforeUpload="beforeUploadVideo"
														>
															<a-button style="width: 101.82px;height: 101.82px;
																				background: #FAFAFA;
																				position: relative;border: 1px dashed #D9D9D9"
															>
																<a-icon type="plus"
																        style="font-size: 16px;position: absolute;top: 35%;left: 50%;transform: translate(-50%,-50%)"/>
																<div class="selectPhoto">选择视频</div>
															</a-button>
														</a-upload>
														<div v-if="addType==2&&!materialVideo.local_path"
														     class="material_video"
														     @click="selectMaterial">
															<a-icon type="plus"
															        style="font-size: 16px;position: absolute;transform: translate(-50%,-50%)"/>
															<div style="margin-top: 0.75rem">素材库导入</div>
														</div>
													</div>
													<div class="video-show" style="position: relative"
													     v-if="publishType==2&&publicOptions.sources.length>0">
														<video-player
																class="video-player vjs-custom-skin"
																ref="videoPlayer"
																style="width: 100%;"
																:playsinline="true"
																:options="publicOptions"
														></video-player>
														<img style="cursor: pointer;top: 0rem;right: 0;height: 1rem;width: 1rem;position: absolute"
														     src="../../../assets/deleteIcon.png" alt=""
														     @click="deleteVideo">
													</div>
													<!-- 图文-->
													<div class="before_choose" @click="selectMaterial"
													     v-if="publishType ==3&&materialText.length<=0&&addType==2">
														<span><a-icon type="plus" style="margin-left: 6px"/>素材库导入</span>
													</div>
													<div v-if="materialText.length>0&&publishType==3&&addType==2"
													     class="before_choose"
													     @click="selectMaterial"
													>
														<img style="width: 1.5rem;margin-bottom: 0.2rem;"
														     src="../../../assets/circle.png" alt/>
														已选择1条图文消息
														<p class="editMessage">[修改]</p>
													</div>
													<div class="text_upload_container"
													     v-if="publishType ==3&&addType==1">
														<a-form-model-item label="图文链接" :label-col="{ span: 3 }"
														                   :wrapper-col="{ span: 18 }">
																<span slot="label"><span
																		style="color: red">*</span>图文链接
																</span>
															<a-input v-model.trim="uploadText.url"
															         @blur="inputChange"
															         @keyup.enter="inputChange"
															         placeholder="请输入图文链接,链接地址以http或https开头"
															         allow-clear/>
															<div class="content_input" v-if="showTextContent">
																<div style="flex-grow: 1;height: 100px;">
																	<div class="input_text1">{{uploadText.title}}
																	</div>
																	<div class="input_text2">
																		{{uploadText.description}}
																	</div>
																</div>
																<div style="width: 100px;height: 100px;padding: 10px">
																	<img class="input_img" v-if="uploadText.pic_url"
																	     :src="commonUrl+uploadText.pic_url"
																	     alt=""/>
																	<img v-if="uploadText.pic_url==''"
																	     class="input_img"
																	     src="../../../assets/url.png" alt=""/>
																</div>
															</div>
														</a-form-model-item>
														<a-form-model-item v-if="showTextContent" label="高级设置"
														                   :label-col="{ span:3 }"
														                   :wrapper-col="{ span: 18 }">
															<a-switch v-model="isAdvance"/>
														</a-form-model-item>
														<div v-if="isAdvance">
															<a-form-model-item label="链接标题"
															                   :label-col="{ span:3 }"
															                   :wrapper-col="{ span: 18 }">
																<a-input placeholder="链接标题"
																         v-model="uploadText.title"
																         allow-clear/>
															</a-form-model-item>
															<a-form-model-item label="链接摘要" maxLength="255"
															                   :label-col="{ span:3 }"
															                   :wrapper-col="{ span: 18 }">
																<a-input placeholder="链接摘要"
																         v-model="uploadText.description"
																         allow-clear/>
															</a-form-model-item>
															<a-form-model-item label="链接封面"
															                   :label-col="{ span:3 }"
															                   :wrapper-col="{ span: 18 }">
																<div style="position: relative">
																	<img v-if="uploadText.pic_url!=''"
																	     style="width: 100px;height: 100px;border: 1px solid #F1F3F5;vertical-align: bottom"
																	     :src="commonUrl+uploadText.pic_url"
																	/>
																	<img v-if="uploadText.pic_url==''"
																	     style="width: 100px;height: 100px;border: 1px solid #F1F3F5;vertical-align: bottom"
																	     src="../../../assets/url.png"
																	/>
																	<a-upload class="link_cover"
																	          style="border:none;background-color: #F1F3F5"
																	          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
																	          :multiple="false"
																	          :showUploadList="false"
																	          list-type="picture-card"
																	          :before-upload="beforeUpload"
																	>
																		<span style="font-size: 12px; color: rgb(37, 150, 255); margin-left: 10px; cursor: pointer; position: absolute; width: 50px;">重新选择</span>
																	</a-upload>
																</div>
															</a-form-model-item>
														</div>
													</div>
												</div>
											</div>
										</a-form-model-item>
										<!--高级设置-->
										<div v-if="audit!=1" style="margin-top: 0.5rem">
											<a-form-model-item label="提醒同步" :label-col="{ span: 3 }"
											                   :wrapper-col="{ span: 21 }">
												<a-switch
														@change="onSwitchChange"
														:checked="publishForm.advanced_setting==1"/>
												<span style="color: rgba(1, 1, 1, 0.65);"> 开启后发表朋友圈时会提醒员工将此朋友圈同步至企业微信客户朋友圈</span>
												<!--<a-alert message="因企业微信限制，视频类朋友圈暂不支持提醒同步" banner/>-->
											</a-form-model-item>
											<a-form-model-item label="群发时间" :label-col="{ span: 3 }"
											                   :wrapper-col="{ span: 21 }">
												<a-radio-group name="radioGroup" v-model="sendType"
												>
													<a-radio :value="0">立即发送</a-radio>
													<a-radio :value="1">指定时间</a-radio>
													<a-date-picker v-model="sendDate" @change="changeDate"
													               v-if="sendType==1"
													               :allowClear="false"
													               format="YYYY-MM-DD"/>
													<a-time-picker style="margin-left: 10px;"
													               v-if="sendType==1" v-model="sendTime"
													               :allowClear="false" format="HH:mm"/>
												</a-radio-group>
												<div style="margin:0.5rem 0 1rem 22.5%">
													<a-button :loading="sendLoading" @click="handlePublish"
													          type="primary">发表朋友圈
													</a-button>
													<span style="margin-left:0.5rem;color: rgba(1, 1, 1, 0.65);"> 发布后本条内容将会显示在成员的历史朋友圈里</span>

												</div>
											</a-form-model-item>
										</div>

										<!-- 审核设置-->
										<div class="" v-if="audit==1">
											<a-form-model-item :label-col="{ span: 3}"
											                   :wrapper-col="{ span: 21 }">
												<span slot="label">审核状态</span>
												<template>
													<a-radio-group style="line-height: 40px;margin-bottom: 10px"
													               v-model="publishForm.status">
														<a-radio :value="1">
															审核通过（审核通过后，该条朋友圈进入到“已发布”列表里）
														</a-radio>
														<br/>
														<a-radio :value="3">
															审核不通过
														</a-radio>
													</a-radio-group>
												</template>
											</a-form-model-item>
											<a-form-model-item :label-col="{ span: 3}" v-if="publishForm.status==3"
											                   :wrapper-col="{ span: 21 }"
											                   label="原因" prop="reply">
												<span slot="label">不通过原因</span>
												<a-textarea
														v-model="publishForm.reply"
														placeholder="写下不通过的原因" :rows="4"/>
											</a-form-model-item>
											<a-row>
												<a-col :span="2" :offset="11">
													<a-button style="margin:1rem" type="primary"
													          @click="handleAuditFormSubmit">提交审核
													</a-button>
												</a-col>
											</a-row>
										</div>
									</div>
								</a-form-model>
							</div>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>

		<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
			<img alt="example" style="width: 100%" :src="previewImage"/>
		</a-modal>
		<!-- 企业微信选择弹窗 -->
		<WeChatModal :show="showAgent" :callback="agentReply"
		             hasName="group-sending-add"></WeChatModal>
		<!--部门选择框-->
		<chooseDepartment ref="user" :show="showModalDepartment" :is_external="1" noticeTitle="只显示具有外部联系人权限的成员"
		                  :chooseNum="selectedMemberNum"
		                  :callback="departmentReply"></chooseDepartment>
		<!--素材库-->
		<chooseMsg :show="showMaterialModel" :type="materialType"
		           :callback="materialReply"
		           :chooseId="publishForm.chooseId"></chooseMsg>
	</div>
</template>

<script>
	import WeChatModal from "@/components/WeChatModal.vue"
	import chooseMsg from "@/components/ChooseMsg"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import MyIcon from "@/components/MyIcon.vue"
	import chooseMinipro from '@/components/FilingCabinet/Miniprogram.vue'
	import {videoPlayer} from "vue-video-player"
	import moment from 'moment'
	import cropperModal from '../../../components/picCropper/CropperModal'
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import MD5 from "js-md5";
	import editor from "vue2-medium-editor";
	import { VEmojiPicker } from "v-emoji-picker";

	function getBase64 (file) {
		// eslint-disable-next-line no-unused-vars
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			// reader.onerror = error => reject(error);
		});
	}

	export default {
		components: {
			// eslint-disable-next-line vue/no-unused-components
			'medium-editor': editor, VEmojiPicker,
			WeChatModal, chooseMsg, chooseDepartment, MyIcon, chooseMinipro, videoPlayer, cropperModal, corpChooseTag
		},

		data () {
			return {
				uploadLoading      : false,
				isLoading          : false,
				sendLoading        : false,
				requestForm        : {},
				isEdit             : 0,
				publishForm        : {
					type            : 2,
					info            : [],
					title           : '',
					advanced_setting: 0,
					ownership       : [],
					status          : 1
				},
				publishType        : 1, // 发布方式 1-图文 2-视频 3-连接
				addType            : 1,  // 添加方式 2-素材 1-自定义
				selectedMemberNum  : 0,//部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				departmentForm     : {},
				showModalDepartment: false,
				showAgent          : false,
				showMaterialModel  : false,
				previewVisible     : false,
				previewImage       : '',
				imageList          : [],
				videoList          : [],
				fileList           : [],
				uploadVideo        : {},
				materialVideo      : {},
				showUploadvideo    : false,
				showMaterialvideo  : false,
				uploadText         : {},
				materialText       : [],
				memberType         : 1,
				sendType           : 0,
				materialType       : 2,
				sendTime           : moment(new Date()),
				sendDate           : moment(new Date()).format("YYYY-MM-DD"),
				advanced_setting   : false,
				showTextContent    : false,
				isAdvance          : false,
				commonUrl          : this.$store.state.commonUrl, //公共的链接
				audit              : 0,
				video              : '',
				playerOptions      : {},
				publicOptions      : {
					sources            : [],
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
			}
		},
		created () {
			// 审核
			if (this.$route.query.isAudit) {
				this.audit = 1
				this.isEdit = 1
				this.requestForm.momentId = this.$route.query.id
				this.requestForm.is_edit = 0
				this.requestForm.corp_id = localStorage.getItem('corpId')
				this.getMomentDetail()
			} else if (!this.$route.query.isAudit && this.$route.query.id) {
				// 编辑
				this.isEdit = 1
				this.audit = 0
				this.requestForm.momentId = this.$route.query.id
				this.requestForm.is_edit = 0
				this.requestForm.corp_id = localStorage.getItem('corpId')
				this.getMomentDetail()
			} else {
				this.publishForm.corp_id = localStorage.getItem('corpId')
				this.publishForm.corpName = localStorage.getItem('corpName')
			}
		},
		methods: {
			async getMomentDetail () {
				this.isLoading = true
				const {data: res} = await this.axios.post('moment/moments-context-add', this.requestForm)
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false
					this.publishForm = res.data
					if (this.publishForm.status != 3) this.publishForm.status = 1
					this.publishForm.corp_id = localStorage.getItem('corpId')
					this.publishForm.corpName = localStorage.getItem('corpName')
					// 选择成员
					this.memberType = res.data.ownership.length > 0 ? 2 : 1
					this.selectedMemberNum = res.data.ownership.length
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					if(this.publishForm.ownership.length > 0){
						this.publishForm.ownership.map(x=>{
							if(x.scopedSlots.title == 'custom'){
								this.chooseUserNum++
							}else if(x.scopedSlots.title == 'title'){
								this.chooseDepartmentNum++
							}
						})
					}

					// 群发时间
					if (res.data.send_time) {
						this.sendType = 1
						let arr = res.data.send_time.split(' ')
						this.sendDate = arr[0]
						this.sendTime = moment(arr[1], "HH:mm")
					} else {
						this.sendType = 0
					}
					// 内容
					if (res.data.type == 2) {
						this.materialType = 2
						for (let index in res.data.info) {
							res.data.info[index].name = 'image'
							res.data.info[index].uid = index
							res.data.info[index].url = res.data.info[index].local_path.substr(0, 1) == '/' ? this.commonUrl + res.data.info[index].local_path : res.data.info[index].local_path
							let {url, md5, s_local_path, local_path, uid, name, sort, attachment} = res.data.info[index]
							this.fileList.push({url, s_local_path, local_path, md5, uid, name, sort, attachment})
						}
					} else if (res.data.type == 3) {
						this.materialType = 4
						this.publishType = 2
						this.publicOptions.sources = [
							{src: this.commonUrl + res.data.info[0].local_path, type: "video/mp4"}
						]
						if (res.data.info[0].attachment && res.data.info[0].attachment !== '') {
							this.addType = 2
							this.materialVideo = res.data.info[0]
						} else {
							this.addType = 1
							this.uploadVideo = res.data.info[0]
						}
					} else if (res.data.type == 4) {
						this.materialType = 1
						this.publishType = 3
						if (res.data.info[0].attachment && res.data.info[0].attachment !== '') {
							this.addType = 2
							this.materialText = res.data.info[0]
						} else {
							this.addType = 1
							this.uploadText = res.data.info[0]
						}
					}
				}
			},
			changePublishType () {
				this.publishForm.type = this.publishType + 1
				switch (this.publishType) {
					case 1:
						this.materialType = 2
						break
					case 2:
						this.materialType = 4
						break
					case 3:
						this.materialType = 1
						break
				}
			},
			changeAgent () {
				if (this.isEdit == 1) return
				this.showAgent = true
			},
			agentReply (type, corpId, corpName) {
				if (type == 'ok') {
					if (this.publishForm.corp_id != corpId) {
						this.publishForm.corp_id = corpId
						this.publishForm.corpName = corpName
					}
				}
				this.showModal2 = false
			},
			resetMember () {
				this.publishForm.ownership = []
				this.selectedMemberNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
			},
			handleMemberChange () {
				if (this.selectedMemberNum == 1) {
					this.selectedMemberNum = 0
					this.publishForm.ownership = []
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
				}
			},
			chooseMember () {
				let arr = []
				this.publishForm.ownership.map(x=>{
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.publishForm.ownership))
				this.showModalDepartment = true
			},
			departmentReply (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.selectedMemberNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.selectedMemberNum > 0) {
						this.publishForm.ownership = list
					}else {
						this.publishForm.ownership = []
					}
				}
				this.showModalDepartment = false
			},

			selfUploadText () {
				this.addType = 1
			},
			//素材库
			selectMaterial () {
				this.addType = 2
				this.showMaterialModel = true
				if (this.publishType == 2) {
					this.showUploadvideo = false
					this.showMaterialvideo = true
				}
				this.uploadLoading = true

			},
			async materialReply (event, e, id) {
				let that = this
				let attachment = id
				if (event == "ok") {
					if (isNaN(id) || id == '') {
						this.$message.error('请选择素材')
					} else if (id) {
						id = parseInt(id)
						const {data: res} = await this.axios.post("material/upload-media", {
							wx_id        : localStorage.getItem('wxNum'),
							attachment_id: id
						});
						this.uploadLoading = false
						if (res.error != 0) {
							this.$message.error(res.error_msg);
						} else {
							res.data[attachment].sort = this.fileList.length + 1
							res.data[attachment].attachment = attachment
							if (this.publishForm.type == 2||this.publishForm.type == 1) {
								if (this.fileList.length > 8) return this.$message.warning('少于9张')
								let obj = res.data[id]
								obj.url = obj.s_local_path ? this.commonUrl + obj.s_local_path : this.commonUrl + obj.local_path
								this.publishForm.info.push(obj)
								let {attachment, sort, sort: uid, file_name: name, s_local_path, local_path, url} = obj
								this.fileList.push({attachment, sort, uid, name, s_local_path, local_path, url})
							} else if (this.publishForm.type == 4||this.publishForm.type == 1) {
								let obj = res.data[id]
								let {content_source_url: url, local_path: pic_url, title, digest: description} = obj.artList[0]
								let temp = {url, pic_url, title, description}
								temp.attachment = obj.attachment
								temp.sort = 1
								this.materialText = [temp]
								this.publishForm.info = this.materialText
							} else if (this.publishForm.type == 3||this.publishForm.type == 1) {
								let obj = res.data[id]
								this.publicOptions.sources = [
									{src: this.commonUrl + obj.local_path, type: "video/mp4"}
								]
								this.materialVideo = obj
							}
						}
					}
				} else if (event == 'cancel') {
					this.uploadLoading = false
				}
				this.showMaterialModel = false;
			},


			handlePublish () {
				if (this.memberType == 2 && this.publishForm.ownership.length <= 0) {
					this.$message.info('请选择成员');
					return;
				}
				if (this.publishType == 1) {
					this.publishForm.info = this.fileList
					if (this.publishForm.info.length <= 0 && !this.publishForm.context) {
						this.$message.info('请输入内容');
						return
					}
				} else if (this.publishType == 2) {
					if (this.addType == 1) {
						this.publishForm.info = [this.uploadVideo]
					} else {
						this.publishForm.info = [this.materialVideo]
					}
					if (!this.publishForm.info[0].local_path) {
						this.$message.info('请选择视频');
						return
					}
				} else if (this.publishType == 3) {
					if (this.addType == 1) {
						this.publishForm.info = [this.uploadText]
					} else {
						this.publishForm.info = this.materialText
					}
					if (!this.publishForm.info[0].pic_url) {
						this.$message.info('请选择图文');
						return
					}
				}
				if (this.publishForm.info.length <= 0) this.publishForm.type = 1
				if (this.sendType == 1) this.publishForm.send_time = this.sendDate + ' ' + this.sendTime.format("HH:mm")//发送时间
				this.publishForm.audit = this.audit
				this.publishForm.is_edit = this.isEdit
				if (this.isEdit == 1) this.publishForm.momentId = this.$route.query.id
				this.sendLoading = true
				this.publishMoment()
			},
			handleAuditFormSubmit () {
				this.publishForm.is_edit = 1
				this.publishForm.momentId = this.$route.query.id
				this.publishForm.audit = 1
				if (this.publishType == 1 && this.publishForm.info.length > 0) {
					this.publishForm.type = 2
				} else if (this.publishType == 1 && this.publishForm.info.length <= 0) {
					this.publishForm.type = 1
				}
				this.handlePublish()
			},
			async publishMoment () {
				const {data: res} = await this.axios.post('moment/moments-context-add', this.publishForm)
				if (res.error != 0) {
					this.sendLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.sendLoading = false
					this.goBack()
				}
			},
			addTypeChange () {
				if (this.publishType == 2) {
					this.publicOptions.sources = []
					if (this.addType == 1 && this.uploadVideo.local_path) {
						this.publicOptions.sources = [
							{src: this.commonUrl + this.uploadVideo.local_path, type: "video/mp4"}
						]
					} else if (this.addType == 2 && this.materialVideo.local_path) {
						this.publicOptions.sources = [
							{src: this.commonUrl + this.materialVideo.local_path, type: "video/mp4"}
						]
					}
				} else if (this.publishType == 3) {
					if (this.addType == 1) {
						this.publishForm.info = [this.uploadText]
					} else {
						this.publishForm.info = this.materialText
					}
				}
			},
			deleteVideo () {
				this.publicOptions.sources = []
				if (this.addType == 1) {
					this.uploadVideo = {}
				} else if (this.addType == 2) {
					this.materialVideo = {}
				}
			},
			// 上传视频
			beforeUploadVideo (file) {
				this.uploadLoading = true
				this.showUploadvideo = true
				this.showMaterialvideo = false
				this.addtype = 1
				let that = this
				if (file.type != 'video/mp4') {
					this.uploadLoading = false
					that.$message.error("视频类型仅支持mp4类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 <= 50;
				if (!isLt2M) {
					this.uploadLoading = false
					that.$message.error("视频不超过50M！");
					return false;
				} else if (file.size <= 5) {
					this.uploadLoading = false
					that.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				that.getFileContent(file, function (str) {
					that.selfUploadVideo(file, MD5(str))
				})
			},
			async selfUploadVideo (file, md5) {
				let params = new FormData();
				params.append("type", file.type);
				params.append("corp_id", this.publishForm.corp_id);
				params.append("md5", md5);
				let params2 = new FormData();
				params2 = params
				const {data: res} = await this.axios.post("moment/moments-upload", params);
				if (res.data.local_path != '') {
					this.uploadLoading = false
					this.publicOptions.sources = [
						{src: this.commonUrl + res.data.local_path, type: "video/mp4"}
					]
					// this.video = res.data.local_path
					res.data.sort = 1
					res.data.attachment = ''
					this.uploadVideo = res.data
					let {local_path: url, md5: name, sort: uid} = res.data
				} else if (res.data.local_path == '') {
					params2.append("fileInfo", file);
					const {data: res2} = await this.axios.post("moment/moments-upload", params2);
					if (res2.data.local_path != '') {
						this.uploadLoading = false
						this.publicOptions.sources = [
							{src: this.commonUrl + res2.data.local_path, type: "video/mp4"}
						]
						res2.data.sort = 1
						res2.data.attachment = ''
						this.uploadVideo = res2.data
						let {local_path: url, md5: name, sort: uid} = res2.data
					}
				}
			},
			// 上传图片
			handleCancel () {
				this.previewVisible = false;
			},
			getFileContent (file, callback) {
				if (file && file.size > 0) {
					//下面这一句相当于JQuery的：var file =$("#upload").prop('files')[0];
					if (window.FileReader) {
						var reader = new FileReader();
						reader.onloadend = function (evt) {
							if (evt.target.readyState == FileReader.DONE) {
								callback(evt.target.result);
							}
						};
						// 包含中文内容用gbk编码
						reader.readAsText(file, 'utf-8');
					}
				}
			},
			beforeUploadPic (file, list) {
				this.addType = 1
				if (file.type != 'image/jpg' && file.type != 'image/jpeg' && file.type != 'image/png') {
					this.$message.error("图片类型仅支持jpg、jpeg和png类型！");
					return false;
				}
				if (list.length + this.fileList.length > 9) {
					if (file.uid == list[0].uid) {
						this.$message.destroy()
						this.$message.error("上传图片超过九张！");
					}
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.desImgLoading = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.desImgLoading = false
					return false;
				}
				let that = this
				this.getFileContent(file, function (str) {
					that.upLoadPhoto(file, MD5(str))
				})
			},
			async upLoadPhoto (file, md5) {
				let params = new FormData();
				let params2 = new FormData();
				params.append("type", file.type);
				params.append("corp_id", this.publishForm.corp_id);
				params.append("md5", md5);
				params2 = params
				const {data: res} = await this.axios.post("moment/moments-upload", params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (res.data.local_path != '') {
						res.data.sort = this.fileList.length + 1
						res.data.attachment = ''
						this.publishForm.info.push(res.data)
						res.data.url = this.commonUrl + res.data.local_path
						res.data.name = res.data.md5
						let {url, md5, sort: uid, s_local_path, local_path, name, sort, attachment} = res.data
						this.fileList.push({url, s_local_path, md5, uid, name, local_path, sort, attachment})
					} else {
						params2.append("fileInfo", file);
						const {data: res} = await this.axios.post("moment/moments-upload", params2);
						if (res.data.local_path != '') {
							res.data.sort = this.fileList.length + 1
							res.data.attachment = ''
							this.publishForm.info.push(res.data)
							res.data.url = this.commonUrl + res.data.local_path
							res.data.name = res.data.md5
							let {url, md5, sort: uid, s_local_path, local_path, name, sort, attachment} = res.data
							this.fileList.push({url, md5, uid, s_local_path, local_path, name, sort, attachment})
						}
					}
				}
			},
			async handlePreview (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage = file.url || file.preview;
				this.previewVisible = true;
			},
			handleChange (e) {
				const isLt2M = e.file.size / 1024 / 1024 < 2;
				// if (e.file.type == 'image/jpg' || e.file.type == 'image/jpeg' || e.file.type == 'image/png') {
				// 	if (isLt2M == true && e.file.size > 5) {
				// 		this.fileList = e.fileList;
				// 	}
				// }
				for (let f of e.fileList) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
				if (e.file.status == 'removed') {
					this.fileList.splice(this.fileList.findIndex(x => x.uid == e.file.uid), 1)
				}
				return isLt2M;
			},
			onSwitchChange (checked) {
				if (checked) {
					this.publishForm.advanced_setting = 1
				} else {
					this.publishForm.advanced_setting = 0
				}
			},
			inputChange () {
				if (this.uploadText.url && this.uploadText.url != '') {
					this.getTextInfo()
				}
			},
			async getTextInfo () {
				const {data: res} = await this.axios.post('moment/moments-images-text', {
					corp_id: this.publishForm.corp_id,
					url    : this.uploadText.url
				})
				if (res.error != 0) {
					this.isSend = false
					this.uploadText = {}
					this.publishForm.info[0] = this.uploadText
					this.$message.error(res.error_msg);
				} else {
					this.showTextContent = true
					res.data.pic_url = res.data.url
					let url = this.uploadText.url
					this.uploadText = res.data
					this.uploadText.url = url
					this.publishForm.info[0] = this.uploadText
				}
			},
			changeDate (date, dateString) {
				this.sendDate = dateString
			},
			beforeUpload (file) {
				let that = this
				if (file.type != 'image/jpg' && file.type != 'image/jpeg' && file.type != 'image/png') {
					this.$message.error("图片类型仅支持jpg、jpeg和png类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.desImgLoading = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.desImgLoading = false
					return false;
				}
				this.getFileContent(file, function (str) {
					that.uploadCover(file, MD5(str))
				})
			},
			async uploadCover (file, md5) {
				let params = new FormData();
				let params2 = new FormData();
				params.append("type", file.type);
				params.append("corp_id", this.publishForm.corp_id);
				params.append("md5", md5);
				params2 = params
				const {data: res} = await this.axios.post("moment/moments-upload", params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (res.data.local_path != '') {
						this.uploadText.pic_url = res.data.s_local_path ? res.data.s_local_path : res.data.local_path
					} else {
						params2.append("fileInfo", file);
						const {data: res} = await this.axios.post("moment/moments-upload", params2);
						if (res.data.local_path != '') {
							this.uploadText.pic_url = res.data.s_local_path ? res.data.s_local_path : res.data.local_path
						}
					}
				}
			},
      goBack () {
        localStorage.removeItem('notAllow')
        localStorage.removeItem('backUrl')
        this.$router.push("/circle/circleOfFriends")
      },
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";

	/deep/ .ant-form-item-control {
		margin-bottom: 0 !important;
	}

	.pic /deep/ .ant-upload.ant-upload-select-picture-card:hover {
		border-color: #FFF;
		border: 1px dashed #D9D9D9;
	}

	.local:hover {
		color: #0A98D5;
	}

	.material_image:hover {
		color: #0A98D5;
	}

	.link_cover /deep/ .ant-upload.ant-upload-select-picture-card {
		width: 0;
		height: 0;
		background-color: #F1F3F5;
		border: none;
	}

	.before_choose {
		height: 136px;
		font-size: 17px;
		line-height: 9rem;
		text-align: center;
		cursor: pointer;
		border: 1px dashed #CCC;
		width: 95%;
		margin: 0 2.5%;
	}

	.ant-upload-picture-card-wrapper {
		width: auto;
	}

	.text_upload_container {
		background-color: rgb(241, 243, 245);
		padding: 1rem;
	}

	.material_image {
		width: 101.8px;
		height: 101.8px;
		background-color: #FAFAFA;
		border: 1px dashed #D9D9D9;
		margin: 2px 0 1rem 0;
		text-align: center;
		padding: 2.08rem 0 0 0;
		color: rgba(0, 0, 0, 0.65);
		position: absolute;
		left: 7rem;
		top: -0.14rem;
	}

	.video_upload {
		display: flex;
		justify-content: flex-start;
	}

	.video-show {
		width: 14rem;
		height: 8rem;
		text-align: center;
		background-color: black;
	}

	.material_video {
		width: 101.8px;
		height: 101.8px;
		background-color: #FAFAFA;
		border: 1px dashed #D9D9D9;
		/*margin-left: 6rem;*/
		text-align: center;
		padding: 2.08rem 0 0 0;
		color: rgba(0, 0, 0, 0.65);
	}

	.uploadImage_container {
		display: flex;
		justify-content: flex-start;
	}

	.moment_container {
		width: 100%;
		height: 100%;
		background-color: #FFF;

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

	.showImg {
		max-width: calc(33.33% - 5px);
		margin: 5px 5px 0 0px;
	}

	.showTime {
		flex-grow: 1;
		padding: 0px 5px 0 10px
	}

	pre {
		margin-top: 5px !important;
		margin-bottom: 0 !important;
	}

	.content_input {
		background: #FFF;
		min-width: 378px;
		height: 100px;
		margin-top: 5px;
		display: flex;
	}

	.input_text1 {
		width: 200px;
		line-height: 30px;
		margin: 15px 0 5px 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
		font-size: 18px;
		color: #000
	}

	.input_text4 {
		width: 150px;
		line-height: 30px;
		margin: 15px 0 5px 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
		font-size: 16px;
		color: #000
	}

	.input_text2 {
		width: 250px;
		line-height: 20px;
		margin: 0 0 0 15px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		word-break: break-all;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.input_text3 {
		max-width: 90%;
		line-height: 16px;
		font-size: 12px;
		display: -webkit-box;
		/*margin-top: 15px;*/
		-webkit-box-orient: vertical;
		word-break: break-all;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.inp_title {
		max-width: 110px;
		padding-right: 5px;
		line-height: 25px;
		margin-top: 3px;
		font-weight: bold;
		color: #000;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		white-space: nowrap;
	}

	.input_img2 {
		width: 50px;
		height: 50px;
	}

	.input_img {
		width: 80px;
		height: 80px;
	}

	.selectPhoto {
		width: 100%;
		position: absolute;
		top: 65%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center
	}

	.selectFile:hover {
		border-color: #2596FF;
		cursor: pointer;
	}

	/deep/ .ant-upload {
		position: relative;
	}

	.upload {
		position: relative;
	}

	.selectFile {
		padding-top: 15px;
		position: relative;
	}

	.editFriends {
		border-bottom: 1px solid #F1F3F5;
		margin-bottom: 15px;
		font-size: 20px;
		font-weight: bold;
		color: #000
	}

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 0px 0px 15px 0px;
		text-align: left;
	}

	.content-msg a:link {
		color: #1890FF;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.content-msg a:visited {
		color: #1890FF;
		text-decoration: none;
	}

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
			/*display: inline-block;*/
			word-break: break-word;
		}
	}

	.hide {
		display: none !important;
	}

	.img_list {
		display: flex;
		justify-content: flex-start;
		width: 30px;
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
		padding-top: 13px;
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
		margin-right: -1px;
	}

	.type {
		display: inline-block;
		width: 65px;
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
		width: 95%;
		background-color: #FFF;
		padding: 0 24px 24px 24px;
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

	.covers {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.cover {
		display: flex;
		justify-content: center;
		width: 33%;
		margin: 10px 0;
	}

	.min {
		height: 60px;
		width: 60px;
		object-fit: cover;
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

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
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

	.wrap {
		border: 1px solid #E2D6D6;
		margin: auto;
		height: 100%;
		width: 100%;
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}

	.popover-menu {
		cursor: pointer;
		text-align: center;
		display: inline-block;
		width: 80px;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	.popover-menu1, .popover-menu2 {
		margin-left: 10px;
	}

	.popover-menu p {
		margin-bottom: 5px;
	}

	.material {
		max-width: 80px;
		max-height: 80px;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.material-div {
		display: inline-block;
		position: relative;
		width: 100px;
		height: 100px;
		border: 1px dashed #D8D8D8;
	}

	.clear-current-list {
		display: inline-block;
		cursor: pointer;
		margin-left: 10px;
		color: #1890FF;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
		margin-bottom: 10px;
	}

	.upload-wrap {
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

	.url-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 18px;
	}

	.url-text {
		float: left;
		max-width: calc(100% - 74px);
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		color: #A3A3A3;
	}

	.url-img {
		float: right;
		width: 64px;
		height: 64px;
	}

	.applet-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 52px;
	}

	.upload-border {
		background: #FFFFFF;
		border: 1px dotted #D8D8D8;
		height: 110px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		margin-bottom: 10px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #1890FF;
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

	.editMessage {
		display: inline-block;
		margin-left: 10px;
		color: blue;
	}

	.changeType {
		border: 1px dashed #E2E2E2;
		background: #FFF;
		margin: 15px 0;
		line-height: 110px;

		span {
			vertical-align: super;
		}
	}

	.file-name {
		float: right;
		margin-right: 10px;
		max-width: calc(100% - 70px);
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.hideMask {
		color: rgba(0, 0, 0, 0.25);
		background-color: #F5F5F5;
		cursor: not-allowed;
		opacity: 0.5;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100% !important;
		z-index: 9999;
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
	}

	/deep/ .ant-tag {
		margin-right: 5px;
		height: 26px;
		line-height: 25px;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-form-item-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>