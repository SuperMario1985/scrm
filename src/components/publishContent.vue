<template>
	<div class="content">
		<div class="title" v-if='title'>{{title}}</div>
		<a-divider v-if='title'></a-divider>
		<a-form-model>
			<a-form-model-item label="内容类型"
			                   :label-col="{ span: 3 }"
			                   align="left"
			                   :wrapper-col="{ span: 21 }"
			>
				<div class='clearfix'>
					<a-radio-group v-model="publishForm.file_type" @change="changeType">
						<a-radio :value="1">
							图片/文字
						</a-radio>
						<a-radio :value="3">
							视频
						</a-radio>
						<a-radio :value="4">
							图文链接
						</a-radio>
					</a-radio-group>
					<div class='float-right'>
						<slot></slot>
					</div>

				</div>
			</a-form-model-item>

			<div class='px-20 pt-20' style="background: #F1F3F5">
				<!-- 文本 -->
				<div>
					<a-textarea :maxLength="500"
					            @change="()=>{this.callback('ok',this.publishForm, this.index)}"
					            v-model="publishForm.context"
					            placeholder="请输入内容"
					            :autoSize="{ minRows: 9, maxRows: 9 }"
					/>
					<div style="float: right;line-height: 20px">
						{{publishForm.context&&publishForm.context.length || 0}}/500
					</div>
				</div>
			</div>
			<a-form-model-item label="添加方式" v-if="publishForm.file_type==3||publishForm.file_type==4"
			                   :label-col="{ span: 3 }"
			                   :wrapper-col="{ span: 18 }">
				<a-radio-group style="line-height: 40px"
				               @change="addTypeChange"
				               v-model="publishForm.add_type">
					<a-radio :value="0">
						自定义设定
					</a-radio>
					<a-radio :value="1">
						从素材库导入
					</a-radio>
				</a-radio-group>
			</a-form-model-item>
			<div class="content_container">
				<!--图片-->
				<div v-if='publishForm.file_type==1'>
					<a-spin tip="Loading..." size="large" :spinning="uploadLoading"></a-spin>
					<a-upload v-if="!uploadLoading"
					          class="pic"
					          style="width: 95%;"
					          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
					          :multiple="!isOneImg?true:false"
					          list-type="picture-card"
					          :file-list="publishForm.uploadImg"
					          @preview="handlePreview"
					          :beforeUpload="beforeUploadPic"
					          :disabled='uploadLoading'
					          @change="handleChange"
					>
						<div class="local" v-if="is_show_upimg_btn">
							<a-icon type="plus" />
							<div>本地上传</div>
						</div>

						<div class="material_image" v-if="is_show_upimg_btn" @click.stop.prevent="selectMaterial">
							<a-icon type="plus" style="font-size: 16px;position: absolute;transform: translate(-50%,-50%)" />
							<div style="margin-top: 1.3rem">素材库导入</div>
						</div>
					</a-upload>
				</div>

				<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
					<img alt="example" style="width: 100%" :src="previewImage" />
				</a-modal>

				<!--视频-->
				<div v-if="publishForm.file_type ==3">
					<a-spin tip="Loading..." size="large" :spinning="uploadLoading"></a-spin>
					<a-upload v-if="publishForm.add_type==0&&publicOptions.sources.length<=0&&!uploadLoading"
					          style="height: 100%"
					          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
					          :multiple="false"
					          :fileList="[]"
					          :beforeUpload="beforeUploadVideo"
					>
						<a-button style="width: 101.82px;height: 101.82px;background: #FAFAFA;
									position: relative;border: 1px dashed #D9D9D9">
							<a-icon type="plus" />
							<div class="selectPhoto">选择视频</div>
						</a-button>
					</a-upload>

					<div v-if="publishForm.add_type==1 && publicOptions.sources.length<=0"
					     class="material_video"
					     @click="selectMaterial">
						<a-icon type="plus"
						        style="font-size: 16px;position: absolute;transform: translate(-50%,-50%)" />
						<div style="margin-top: 0.75rem">素材库导入</div>
					</div>
				</div>


				<div class="video-show" style="position: relative"
				     v-if="publishForm.file_type==3&&publicOptions.sources.length>0">
					<video-player
							class="video-player vjs-custom-skin"
							ref="videoPlayer"
							style="width: 100%;"
							:playsinline="true"
							:options="publicOptions"
					></video-player>
					<img style="z-index: 9999;cursor: pointer;top: 0rem;right: 0;height: 1rem;width: 1rem;position: absolute"
					     src="../assets/deleteIcon.png" alt=""
					     @click="deleteVideo">
				</div>

				<!--			图文链接-->
				<div class="before_choose" @click="selectMaterial"
				     v-if="publishForm.file_type ==4&&publishForm.add_type==1&&!publishForm.materialText.link">
					<span><a-icon type="plus" style="margin-left: 6px" />素材库导入</span>
				</div>
				<div v-if="publishForm.file_type ==4&&publishForm.add_type==1&&publishForm.materialText.link"
				     class="before_choose"
				     @click="selectMaterial"
				>
					<img style="width: 1.5rem;margin-bottom: 0.2rem;"
					     src="../assets/circle.png" alt />
					已选择1条图文消息
					<p class="editMessage" style="margin-top: -5.993rem">[修改]</p>
				</div>
				<div class=""
				     v-if="publishForm.file_type ==4&&publishForm.add_type==0">
					<a-form-model-item label="图文链接" :label-col="{ span: 3 }"
					                   :wrapper-col="{ span: 18 }">
					<span slot="label"><span
							style="color: red">*</span>图文链接
					</span>
						<a-input v-model.trim="publishForm.uploadText.link"
						         placeholder="请输入图文链接,链接地址以http或https开头"
						         @blur="inputChange"
						         @keyup.enter="inputChange"
						         allow-clear />
						<div class="content_input" v-if="showTextContent && !$test.empty(publishForm.uploadText.link)">
							<div style="flex-grow: 1;height: 100px;">
								<div class="input_text1">{{publishForm.uploadText.title}}
								</div>
								<div class="input_text2">
									{{publishForm.uploadText.description}}
								</div>
							</div>
							<div style="width: 100px;height: 100px;padding: 10px">
								<img class="input_img" v-if="publishForm.uploadText.url"
								     :src="commonUrl+publishForm.uploadText.url"
								     alt="" />
								<img v-if="publishForm.uploadText.url==''"
								     class="input_img"
								     src="../assets/url.png" alt="" />
							</div>
						</div>
					</a-form-model-item>
					<a-form-model-item label="高级设置" v-if="publishForm.uploadText.link"
					                   :label-col="{ span:3 }"
					                   :wrapper-col="{ span: 18 }">
						<a-switch v-model="publishForm.isAdvance" />
					</a-form-model-item>


					<div v-if="publishForm.isAdvance&&publishForm.uploadText.link">
						<a-form-model-item label="链接标题"
						                   :label-col="{ span:3 }"
						                   :wrapper-col="{ span: 18 }">
							<a-input placeholder="链接标题"
							         v-model="publishForm.uploadText.title"
							         :maxLength='40'
							         @blur="inputCallback"
							         allow-clear />
						</a-form-model-item>
						<a-form-model-item label="链接摘要" maxLength="255"
						                   :label-col="{ span:3 }"
						                   :wrapper-col="{ span: 18 }">
							<a-input placeholder="链接摘要"
							         v-model="publishForm.uploadText.description"
							         @blur="inputCallback"
							         allow-clear />
						</a-form-model-item>
						<a-form-model-item label="链接封面"
						                   :label-col="{ span:3 }"
						                   :wrapper-col="{ span: 18 }">
							<div style="position: relative">
								<img v-if="!$test.empty(publishForm.uploadText.url)"
								     style="width: 100px;height: 100px;border: 1px solid #F1F3F5;vertical-align: bottom"
								     :src="commonUrl+publishForm.uploadText.url"
								/>
								<img v-else
								     style="width: 100px;height: 100px;border: 1px solid #F1F3F5;vertical-align: bottom"
								     src="../assets/url.png"
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
			<a-form-model-item label="素材同步" v-if="publishForm.add_type == 0 && isSop == 0"
			                   :label-col="{ span: 3 }"
			                   :wrapper-col="{ span: 20 }">
				<a-radio-group style="line-height: 40px"
				               v-model="publishForm.material_sync">
					<a-radio :value="0">
						不同步
					</a-radio>
					<a-radio :value="1">
						同步至【内容引擎】
					</a-radio>
					<span v-show="publishForm.material_sync==1">
                                选择分组：
                                <a-tree-select
                                        style="width: 225px"
                                        :dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
                                        :treeData="groupList"
                                        placeholder='请选择分组'
                                        treeDefaultExpandAll
                                        v-model="publishForm.group_id"
                                >
                                </a-tree-select>
                        </span>
				</a-radio-group>
			</a-form-model-item>

		</a-form-model>

		<chooseMsg :show="showMaterialModel" :type="materialType"
		           :callback="materialReply" :news_type="1"
		           :chooseId="publishForm.chooseId"></chooseMsg>


	</div>
</template>

<script>
    import axios from "axios";
    import {videoPlayer} from "vue-video-player"
    import chooseMsg from "../components/ChooseMsg"
    import MD5 from "js-md5";
    const CancelToken = axios.CancelToken
    import _ from 'lodash'
    const source = CancelToken.source()
    export default {
        name: "publishContent",
        components: {videoPlayer, chooseMsg},
        props: {
            title: {
                type: String, // 标题
                default: '编辑内容',
            },
            callback: {
                type: Function,
                default: null
            },
            detailData: { // 详情内容
                type: Object,
                default: () => {
                },
            },
            index: {
                type: Number,
                default: 0
            },
            isOneImg: { // 是否只有一个图片
                type: Number,
                default: () => {
                    return 0
                },
            },
	        isSop: { // 是否是sop
                type: Number,
                default: () => {
                    return 0
                },
	        }
        },
	    watch:{
            'publishForm.isAdvance' (v) {
                if (!v && this.uploadTextSync) {
                    this.publishForm.uploadText = _.cloneDeep(this.uploadTextSync)
                    this.callback('ok', this.publishForm, this.index)
                }
            },
		    'publishForm.uploadText.link' (v) {
                if (!v) {
                    this.$nextTick(()=>{
                        this.showTextContent = false
                        this.publishForm.uploadText = {}
                        this.uploadTextSync = {}
                        this.callback('ok', this.publishForm, this.index)
                    })
                }
		    }
	    },
        computed: {
            is_show_upimg_btn() {
				if (this.isOneImg == 1) {
				    return this.publishForm.uploadImg.length < 1 ? true : false
				} else {
                    return this.publishForm.uploadImg.length < 9 ? true : false
				}
            }
        },
        data() {
            return {
                is_exchage: false, // 是否交换素材 （解决狂点的bug）
                uploadLoading: false,
                publishForm: {
                    isAdvance: false,
                    file_type: 1,
                    material_sync: 0,
                    add_type: 0,
                    uploadImg: [],
                    uploadText: {},
                    materialText: {},
                    corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
                },
                commonUrl: this.$store.state.commonUrl, //公共的链接
                showTextContent: false,
                groupList: [], //分组下拉框
                previewVisible: false,
                previewImage: '',
                publicOptions: {
                    sources: [],
                    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: "zh-CN",
                    aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true //全屏按钮
                    }
                },
                showMaterialModel: false,
                materialType: 2,// 素材库 2 4 1
                showImgModel: false, // 是否显示选择图片弹框
                uploadTextSync: '', // 后台接口获取的
            }
        },

        mounted() {
            this.getGroupList()
            if (this.detailData && this.detailData.file_type) {
                this.publishForm = this.detailData

                // 处理视频
                if (this.publishForm.file_type == 3) {
                    this.publicOptions.sources = []
                    if (this.publishForm.add_type == 0 && this.publishForm.uploadVideo && this.publishForm.uploadVideo.local_path) {
                        this.publicOptions.sources = [
                            {src: this.commonUrl + this.publishForm.uploadVideo.local_path, type: "video/mp4"}
                        ]
                        this.publishForm.materialVideo = {}
                    } else if (this.publishForm.add_type == 1 && this.publishForm.materialVideo && this.publishForm.materialVideo.local_path) {
                        this.publicOptions.sources = [
                            {src: this.commonUrl + this.publishForm.materialVideo.local_path, type: "video/mp4"}
                        ]
                        this.publishForm.uploadVideo = {}
                    }
                }

                // 处理图文
                if (this.publishForm.file_type == 4) {
                    if (this.publishForm.add_type == 0) {
                        this.publishForm.materialText = {}
                        this.showTextContent = true
                    } else if (this.publishForm.add_type == 1) {
                        this.publishForm.uploadText = {}
                    }

                    this.uploadTextSync = _.cloneDeep(this.publishForm.uploadText)
                }
                switch (this.publishForm.file_type) {
                    case 1:
                        this.materialType = 2
                        this.publishForm.add_type = 0  // 图片 默认添加方式为自定义
                        break
                    case 3:
                        this.materialType = 4
                        break
                    case 4:
                        this.materialType = 1
                        break
                }
            }
        },
        methods: {
            //切换视频 新增方式
            addTypeChange() {
                if (this.publishForm.file_type == 3) {
                    this.publicOptions.sources = []
                    if (this.publishForm.add_type == 0 && this.publishForm.uploadVideo && this.publishForm.uploadVideo.local_path) {
                        this.publicOptions.sources = [
                            {src: this.commonUrl + this.publishForm.uploadVideo.local_path, type: "video/mp4"}
                        ]
                    } else if (this.publishForm.add_type == 1 && this.publishForm.materialVideo && this.publishForm.materialVideo.local_path) {
                        this.publicOptions.sources = [
                            {src: this.commonUrl + this.publishForm.materialVideo.local_path, type: "video/mp4"}
                        ]
                    }
                }
                this.callback('ok', this.publishForm, this.index)
            },

            // 重新定义素材库类型
            changeType() {
                switch (this.publishForm.file_type) {
                    case 1:
                        this.materialType = 2
                        this.publishForm.add_type = 0  // 图片 默认添加方式为自定义
                        break
                    case 3:
                        this.materialType = 4
                        break
                    case 4:
                        this.materialType = 1
                        break
                }
                this.callback('ok', this.publishForm, this.index)
            },
            // 从素材库选择
            selectMaterial() {
                this.showMaterialModel = true
            },


            async upSopImgReply(attachment_id) { // sop 的参数转换
                this.uploadLoading = true
	            const {data: res} = await this.axios.post("work-material/upload-media", {
		            corp_id      : localStorage.getItem('corpId'),
		            attachment_id: attachment_id,
		            type: this.publishForm.file_type == 4 ? 4 : ''
	            });
                this.uploadLoading = false
                if (res.error != 0) {
                    this.$message.error(res.error_msg);
                } else {
                    if (res.data) {
                        let obj = res.data
                        if (this.publishForm.file_type == 1) { // 图片
                            obj.url = obj.s_local_path ? this.commonUrl + obj.s_local_path : this.commonUrl + obj.local_path
                            obj.uid = this.publishForm.uploadImg.length + 1
                            const {id, uid, file_name: name, local_path, url} = obj
                            this.publishForm.uploadImg.push({id, uid, name, local_path, url})
                        } else if (this.publishForm.file_type == 3) { // 视频
                            this.publicOptions.sources = [{src: this.commonUrl + obj.local_path, type: "video/mp4"}]
                            this.publishForm.uploadVideo = obj
                        }
                    }
                    this.callback("ok", this.publishForm, this.index);
                }
            },

            inputCallback(){
                if (this.isSop) {
                    this.callback("ok", this.publishForm, this.index);
                }
            },

            async materialReply (event, e, attachment_id) {
                if (event == "ok") {
                    this.uploadLoading = true
                    if (isNaN(attachment_id) || attachment_id == '') {
                        this.$message.error('请选择素材')
                    } else if (attachment_id) {
                        attachment_id = parseInt(attachment_id)
                        const {data: res} = await this.axios.post("work-material/upload-media", {
	                        corp_id      : localStorage.getItem('corpId'),
                            attachment_id: attachment_id,
	                        type: this.publishForm.file_type == 4 ? 4 : ''
                        });
                        this.uploadLoading = false
                        if (res.error != 0) {
                            this.$message.error(res.error_msg);
                        } else {
                            if (res.data) {
                                let obj = res.data
                                if (this.publishForm.file_type == 1) {
                                    if (this.publishForm.uploadImg.length > 8) return this.$message.warning('少于9张')
                                    obj.url = obj.s_local_path ? this.commonUrl + obj.s_local_path : this.commonUrl + obj.local_path
                                    obj.uid = this.publishForm.uploadImg.length + 1
                                    const {id, uid, file_name: name, local_path, url} = obj
                                    this.publishForm.uploadImg.push({id, uid, name, local_path, url})
                                } else if (this.publishForm.file_type == 3) {
                                    this.publicOptions.sources = [
                                        {src: this.commonUrl + obj.local_path, type: "video/mp4"}
                                    ]
                                    this.publishForm.materialVideo = obj
                                } else if (this.publishForm.file_type == 4) {
                                    let {content_source_url: link, qy_local_path: url, title, digest: description} = obj.artList[0]
                                    this.publishForm.materialText = {link, url, title, description}
                                    this.publishForm.materialText.id = obj.id
                                }
                            }
                        }
                    }
                } else {

                }
                this.showMaterialModel = false;
                this.callback("ok", this.publishForm, this.index);
            },
            // 上传图片
            beforeUploadPic(file, list) {
                if (file.type != 'image/jpg' && file.type != 'image/jpeg' && file.type != 'image/png') {
                    this.$message.error("图片类型仅支持jpg、jpeg和png类型！");
                    return false;
                }
                if (list.length + this.publishForm.uploadImg.length > 9) {
                    if (file.uid == list[0].uid) {
                        this.$message.destroy()
                        this.$message.error("上传图片超过九张！");
                    }
                    return false;
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error("图片不超过2M！");
                    return false;
                } else if (file.size < 5) {
                    this.$message.error("上传文件大小不符！");
                    return false;
                }
                let that = this
                this.getFileContent(file, function (str) {
                    if (!that.isSop) {
                        that.upLoadPhoto(file, MD5(str))
                    } else {
                        that.uploadSop(file)
                    }
                })
            },


            // 上传sop素材
            async uploadSop(file) {
                var params = new FormData();
                params.append("uid", localStorage.getItem('uid'));
                params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
                params.append("sub_id", localStorage.getItem('sub_id'));
                params.append("file_type", this.publishForm.file_type); // 上传的文件类型 1: 图片 3：视频
                params.append("fileInfo", file);
                // params.append("is_sync", this.publishForm.material_sync); // 是否同步到临时素材库
                params.append("is_sync", 0); // 是否同步
                params.append("group_id", this.publishForm.group_id || ''); // 同步的組id
                this.uploadLoading = true
                const {data: res} = await this.axios.post("attachment/add", params, {cancelToken: source.token})
                this.uploadLoading = false
                if (res.error == 0) {
                    this.upSopImgReply(res.data.attachment_id)
                } else {
                    this.$message.error(res.error_msg)
                }
            },


            async upLoadPhoto(file, md5) {
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
                        res.data.uid = this.publishForm.uploadImg.length + 1
                        res.data.url = this.commonUrl + res.data.local_path
                        res.data.name = res.data.md5
                        let {url, md5, uid, s_local_path, local_path, name} = res.data
                        this.publishForm.uploadImg.push({url, s_local_path, md5, uid, name, local_path})
                    } else {
                        params2.append("fileInfo", file);
                        const {data: res} = await this.axios.post("moment/moments-upload", params2);
                        res.data.uid = this.publishForm.uploadImg.length + 1
                        res.data.url = this.commonUrl + res.data.local_path
                        res.data.name = res.data.md5
                        let {url, md5, uid, s_local_path, local_path, name} = res.data
                        this.publishForm.uploadImg.push({url, s_local_path, md5, uid, name, local_path})
                    }

                }
                this.callback('ok', this.publishForm, this.index)
            },
            getFileContent(file, callback) {
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
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            handleCancel() {
                this.previewVisible = false;
            },
            handleChange(e) {
                const isLt2M = e.file.size / 1024 / 1024 < 2;
                for (let f of e.fileList) {
                    if (f.status == 'error') {
                        f.status = 'done'
                    }
                }
                if (e.file.status == 'removed') {
                    this.publishForm.uploadImg.splice(this.publishForm.uploadImg.findIndex(x => x.uid == e.file.uid), 1)
                    if (this.isOneImg == 1) {
                        this.callback('ok', this.publishForm, this.index)
                    }
                }
                return isLt2M;
            },

            // 上传视频
            beforeUploadVideo(file) {
                this.uploadLoading = true
                this.showUploadvideo = true
                this.showMaterialvideo = false
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
                    if (!that.isSop) {
                        that.selfUploadVideo(file, MD5(str))
                    } else {
                        that.uploadSop(file)
                    }

                })
            },
            async selfUploadVideo(file, md5) {
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
                    this.publishForm.uploadVideo = res.data
                } else if (res.data.local_path == '') {
                    params2.append("fileInfo", file);
                    const {data: res2} = await this.axios.post("moment/moments-upload", params2);
                    if (res2.data.local_path != '') {
                        this.uploadLoading = false
                        this.publicOptions.sources = [
                            {src: this.commonUrl + res2.data.local_path, type: "video/mp4"}
                        ]
                        this.publishForm.uploadVideo = res2.data
                    }
                }
                this.callback('ok', this.publishForm, this.index)
            },
            //删除视频
            deleteVideo() {
                this.publicOptions.sources = []
                if (this.publishForm.add_type == 0) {
                    this.publishForm.uploadVideo = null
                } else if (this.publishForm.add_type == 1) {
                    this.publishForm.materialVideo = null
                }
                this.callback('ok', this.publishForm, this.index)
            },


            //图文
            inputChange() {
                if (!this.$test.empty(this.publishForm.uploadText.link)) {
                    this.getTextInfo()
	            }
            },
            async getTextInfo() {
                console.log(this.publishForm.uploadText.link, 444)
                const {data: res} = await this.axios.post('moment/moments-images-text', {
                    corp_id: this.publishForm.corp_id,
                    url: this.publishForm.uploadText.link,
                    /*is_import: this.isSop * 1, // 是否导入到素材库 1：是 2：否*/
                })

                if (this.$test.empty(this.publishForm.uploadText.link)) {
                    return
                }

                if (res.error != 0) {
                    this.showTextContent = false
                    this.publishForm.uploadText = {}
                    this.uploadTextSync = {}
                    this.$message.error(res.error_msg);
                } else {
                    this.showTextContent = true
                    let link = this.publishForm.uploadText.link
                    this.publishForm.uploadText = {...res.data, link}
	                this.uploadTextSync = {
                        link,
                        ...res.data
	                }
                }
                this.callback('ok', this.publishForm, this.index)
            },
            // 上传图文封面
            beforeUpload(file) {
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

            async uploadCover(file, md5) {
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
                        this.publishForm.uploadText.url = res.data.s_local_path ? res.data.s_local_path : res.data.local_path
                    } else {
                        params2.append("fileInfo", file);
                        const {data: res} = await this.axios.post("moment/moments-upload", params2);
                        if (res.data.local_path != '') {
                            this.publishForm.uploadText.url = res.data.s_local_path ? res.data.s_local_path : res.data.local_path
                        }
                    }
                }
                this.callback('ok', this.publishForm, this.index)
            },
            // 获取上传分组列表
            async getGroupList() {
                let params = {
                    uid: localStorage.getItem('uid'),
                    is_channel: 1
                }
                const {data: res} = await this.axios.post("attachment/group", params);
                if (res.error != 0) {
                    this.$message.error(res.error_msg);
                } else {
                    this.groupList = JSON.parse(JSON.stringify(res.data.group))
                }
            },
        }
    }
</script>

<style scoped lang="less">
	.content {
		width: 100%;
	}

	.pic /deep/ .ant-upload.ant-upload-select-picture-card:hover {
		border-color: #FFF;
		border: 1px dashed #D9D9D9;
	}

	/deep/ .ant-upload {
		position: relative;
	}

	.material_image:hover {
		color: #0A98D5;
	}

	.local:hover {
		color: #0A98D5;
	}

	.video-show {
		width: 14rem;
		height: 8rem;
		text-align: center;
		background-color: black;
	}

	.material_video:hover {
		color: #0A98D5;
	}

	.material_video {
		cursor: pointer;
		position: relative;
		width: 101.8px;
		height: 101.8px;
		background-color: #FAFAFA;
		border: 1px dashed #D9D9D9;
		text-align: center;
		padding: 2.08rem 0 0 0;
		color: rgba(0, 0, 0, 0.65);
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

	.title {
		font-size: 16px;
		font-weight: 600;
	}


	.content_container {
		padding: 2% 5%;
		width: 100%;
		background-color: #F1F3F5;

	}

	.ant-divider-horizontal {
		margin: 0.64rem 0;
	}

	.before_choose {
		height: 7.253rem;
		font-size: 0.907rem;
		line-height: 7.253rem;
		text-align: center;
		cursor: pointer;
		border: 1px dashed #CCC;
		width: 95%;
		margin: 0 2.5%;
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

	.input_img {
		width: 80px;
		height: 80px;
		object-fit: contain;
	}

	.link_cover /deep/ .ant-upload.ant-upload-select-picture-card {
		width: 0;
		height: 0;
		background-color: #F1F3F5;
		border: none;
	}


</style>
