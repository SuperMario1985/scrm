<template>
	<a-modal :visible="visible" title="修改图片" :maskClosable="false" :confirmLoading="confirmLoading" :width="888"
	         @cancel="cancelHandel">
		<div class="cropper-wrapper">
			<vue-cropper
					ref="cropper"
					:img="options.img"
					:info="true"
					:autoCrop='options.autoCrop'
					:autoCropWidth='270'
					:autoCropHeight='216'
					:size='options.size'
					:full='options.full'
					:outputType='options.outputType'
					:canMove='options.canMove'
					:fixedBox='options.fixedBox'
					:original='options.original'
					:canMoveBox='options.canMoveBox'
					:centerBox='options.centerBox'
					:high='options.high'
					:max='options.max'
					:enlarge="options.enlarge"
					:fixedNumber='options.fixedNumber'
					@realTime="realTime"
			>
			</vue-cropper>
		</div>
		<div class="result-wrapper">
			<div class="tar-img" :style="previews.div">
				<img :src="previews.url" :style="previews.img"/>
			</div>
		</div>
		<template slot="footer">
			<a-button key="back" @click="cancelHandel">取消</a-button>
			<a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">保存</a-button>
		</template>
	</a-modal>
</template>
<script>
	import {VueCropper} from 'vue-cropper'
	import axios from 'axios'

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	export default {
		name      : 'cropperModal',
		components: {
			VueCropper
		},
		data () {
			return {
				visible       : false,
				img           : null,
				confirmLoading: false,
				commonUrl     : this.$store.state.commonUrl,//公共的链接
				options       : {
					img           : '',//裁剪图片的地址
					autoCrop      : true, //是否默认生成截图框
					autoCropWidth : 270, //默认生成截图框宽度
					autoCropHeight: 216, //默认生成截图框高度
					enlarge       : 4,
					// size          : 1,
					full          : false,
					outputType    : 'png',
					canMove       : true,
					fixedBox      : true,
					original      : false,
					canMoveBox    : true,
					// 只有自动截图开启 宽度高度才生效
					centerBox     : false,
					high          : true,
					max           : 99999,
					fixedNumber   : [270, 216]
				},
				fileName      : '',
				previews      : {},
			};
		},
		methods   : {
			edit (record, fileName) {
				let _this = this
				this.visible = true;
				let name = fileName.split('.')
				name[name.length - 2] += "(1080*864)"
				let newFileName = ''
				for (let i = 0; i < name.length; i++) {
					newFileName += name[i] + '.'
				}
				newFileName = newFileName.substring(0, newFileName.length - 1)
				this.fileName = newFileName
				this.setAvatarBase64(this.commonUrl + record, (base64) => {
					_this.options.img = base64;
				});
			},
			setAvatarBase64 (src, callback) {
				let _this = this;
				let image = new Image();
				// 处理缓存
				image.src = src + '?v=' + Math.random();
				// 支持跨域图片
				image.crossOrigin = "*";
				image.onload = function () {
					let base64 = _this.transBase64FromImage(image);
					callback && callback(base64);
				}
			},
			transBase64FromImage (image) {
				let canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				let ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0, image.width, image.height);
				// 可选其他值 image/jpeg
				return canvas.toDataURL("image/png");
			},
			cancelHandel () {
				this.options = {
					img           : '',//裁剪图片的地址
					autoCrop      : true, //是否默认生成截图框
					autoCropWidth : 270, //默认生成截图框宽度
					autoCropHeight: 216, //默认生成截图框高度
					enlarge       : 4,
					// size          : 1,
					full          : false,
					outputType    : 'png',
					canMove       : true,
					fixedBox      : true,
					original      : false,
					canMoveBox    : true,
					// 只有自动截图开启 宽度高度才生效
					centerBox     : false,
					high          : true,
					max           : 99999,
					fixedNumber   : [270, 216]
				};
				this.confirmLoading = false
				this.$emit("cancel")
				this.visible = false;
			},
			// 压缩图片文件大小
			photoCompress (base64Url, callback) {
				let img = new Image();
				img.src = base64Url;
				img.onload = function () {
					let that = this;
					// 默认按比例压缩
					let w = 1080,
						h = 864
					// 默认图片质量为0.7
					let quality = 0.7;
					//生成canvas
					let canvas = document.createElement('canvas');
					let ctx = canvas.getContext('2d');
					// 创建属性节点
					let anw = document.createAttribute("width");
					anw.nodeValue = w;
					canvas.setAttributeNode(anw);
					let anh = document.createAttribute("height");
					anh.nodeValue = h;
					canvas.setAttributeNode(anh);
					ctx.drawImage(that, 0, 0, w, h);
					// 重绘后的图片类型
					let imgType = 'image/jpeg';
					// quality值越小，所绘制出的图像越模糊
					let base64 = canvas.toDataURL(imgType, quality);
					// 回调函数返回base64的值
					callback(base64)
				};
			},
			okHandel () {
				const that = this
				that.confirmLoading = true
				// 获取截图的base64 数据
				this.$refs.cropper.getCropData((data) => {
					that.setFile(data)
				})
			},
			setFile(data) {
				let arr = data.split(','), mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				let file = new File([u8arr], this.fileName, {type: mime});
				if(file.size / 1024 / 1024 > 1) {
					file = this.photoCompress(data, this.setFile)
				} else {
					// 转换为File对象
					// let file = getBase64(data,'测试哟');
					//将裁剪侯的图片对象返回给父组件
					this.uploadPic(file)
				}
			},
			async uploadPic (file) {
				this.$message.warning("图片正在上传...")
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("sub_id", localStorage.getItem('sub_id'));
				params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
				params.append("is_sync", 0);
				params.append("file_type", 1);
				params.append("fileInfo", file);
				const {data: res} = await this.axios.post("attachment/add", params, {cancelToken: source.token})
				if (res.error == 0) {
					this.$emit('ok', res.data.info.id, res.data.info.local_path);
					this.cancelHandel()
				} else {
					this.confirmLoading = false
					this.$message.error(res.error_msg)
				}

			},
			//移动框的事件
			realTime (data) {
				this.previews = data
			}
		}
	};
</script>

<style lang="less" scoped>
	.cropper-wrapper {
		display: inline-block;
		width: 50%;
		height: 216px;
	}

	.result-wrapper {
		display: inline-block;
		margin-top: 20px;
		width: 310px;
		height: 256px;
		padding: 20px;
		justify-content: center;

		.tar-img {
			background-color: rgba(0, 0, 0, 0.8);
			border: 1px solid #F5F5F5;
			width: 270px !important;
			height: 216px !important;
			overflow: hidden;
			object-fit: cover;
		}
	}

</style>
