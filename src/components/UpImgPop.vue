<template>
	<div>
		<a-modal v-model="visible" width="720px" title="新建图片素材" @cancel="cancelUploadPic">
			<template slot="footer">
				<a-button key="back" @click="cancelUploadPic">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading"
						@click="uploadPic"
				>提交
				</a-button>
			</template>
			<a-form-item
					:label-col="{ span: 4 }"
					:wrapper-col="{ span: 20 }">
				<template slot="label">
					上传图片
				</template>
				<p class="mt-10">
					<a-upload
							name="avatar"
							listType="picture-card"
							class="avatar-uploader"
							:showUploadList="false"
							:beforeUpload="beforeUpload"
							:customRequest="selfUpload"
					>
						<img v-if="imageUrl" :src="imageUrl" alt="avatar" style="max-width:100%;max-height:100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);" />
						<div v-else class="pt-25">
							<a-icon type="plus" />
							<div class="ant-upload-text">点击上传</div>
						</div>
					</a-upload>
					<span>（图片大小不超过2M，支持JPG、JPEG及PNG格式）</span>
				</p>
			</a-form-item>
		</a-modal>
	</div>
</template>

<script>
    import axios from "axios";

    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    export default {
        name: "UpImgPop", // 上传图片弹框
        props: {
            callback: {
                type: Function,
                default: null
            },
        },

        watch: {
            show(newValue){
                if (newValue) {
                    this.visible = true
                }
            }
        },

        data() {
            return {
                id: 0,
                visible: false, // 是否上传图片的弹框
                fileInfo: {}, //
                imageUrl: '', //
                loading: false,
                materialPicSync: 0, // 是否同步到素材库
            }
        },

        methods: {
            cancelUploadPic() { // 取消图片上传
                if (this.loading) {
                    source.cancel()
                }
                this.imageUrl = "";
                this.visible = false
            },

            uploadPic() { // 图片上传
                if (!this.fileInfo.uid) {
                    this.$message.warning('请选择图片！')
                    return false
                }
                this.uploadMaterial(this.fileInfo);
            },

            // 上传sop素材
            async uploadMaterial(materialData) {
                this.loading = true
                //图片
                var params = new FormData();
                params.append("uid", localStorage.getItem('uid'));
                params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
                params.append("sub_id", localStorage.getItem('sub_id'));
                params.append("file_type", 1);
                params.append("fileInfo", materialData);
                params.append("is_sync", this.materialPicSync);  // 是否同步到素材库
                const {data: res} = await this.axios.post("attachment/add", params, {cancelToken: source.token})
                this.loading = false
                if (res.error == 0) {
                    this.id = res.data.attachment_id
                    this.callback("ok", '', this.id, res.data.info);
                } else {
                    this.$message.error(res.error_msg)
                }

                this.visible = false
            },

            beforeUpload(file) {
                if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
                    this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
                    return false;
                }

                let isLt2M = file.size / 1024 / 1024 <= 2;
                if (this.comefrom == '3') {
                    isLt2M = file.size / 1024 / 1024 <= 1;
                }

                if (!isLt2M) {
                    if (this.comefrom == '3') {
                        this.$message.error("图片不超过1M！");
                    } else {
                        this.$message.error("图片不超过2M！");
                    }
                    return false;
                } else if (file.size <= 5) {
                    this.$message.error("上传的文件大小需大于5字节！");
                    return false;
                }
                return isLt2M;
            },

            selfUpload({action, file, onSuccess, onError, onProgress}) {
                const base64 = new Promise(resolve => {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = () => {
                        resolve(fileReader.result);
                        this.imageUrl = fileReader.result;
                    };
                });
                this.fileInfo = file;
            },
        }
    }
</script>

<style scoped>

</style>
