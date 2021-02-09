<template>
	<div style="height: 100%; overflow-y: auto;position: absolute; width: 100%;">
		<a-spin tip="加载中..." size="large" :spinning="isLoading">
			<div style="height: 50px; line-height: 50px;background-color: #FFFFFF; padding: 0 20px;font-size: 16px">
				<span v-if="!editId">新建</span><span v-if="editId">编辑</span>红包规则
				<a-button type="primary" icon="rollback" style="font-size: 14px;float: right;margin-top: 9px;"
				          @click="goBack">返回列表
				</a-button>
			</div>
			<div style="background-color: #FFFFFF;margin: 10px 20px 80px 20px;">
				<a-form style="padding: 20px;">
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
					<span slot="label">
						<span style="color: #FF562D;">*</span>规则名称
					</span>
						<a-input style="width: 340px;" placeholder="请输入红包规则" :maxLength="30" v-model="name">
							<span slot="suffix">
		                        <span>{{name.length}}</span>/30
	                        </span>
						</a-input>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
					<span slot="label">
						<span style="color: #FF562D;">*</span>单个红包金额
					</span>
						<a-radio-group name="radioGroup" :value="type" @change="changeType">
							<a-radio :value="1" style="display: inline-block;height: 35px;line-height: 35px;">定额
								<span v-if="type == 1">
									<a-input-number :step="0" :precision="2" style="width: 140px;margin: 0 5px;"
									                :min="0.30" :max="200.00"
									                v-model="fixed_amount"/>元
								</span>
							</a-radio>
							<a-radio :value="2"
							         style="display: inline-block;height: 35px;line-height: 35px;margin-left: 25px;">
								按随机金额
								<span v-if="type == 2">
								<a-input-number :step="0" :precision="2" style="width: 100px;margin: 0 5px;"
								                :min="0.30" :max="200.00"
								                v-model="min_random_amount"/>元 ——
								<a-input-number :step="0" :precision="2" style="width: 100px;margin-right: 5px;"
								                :min="0.30" :max="200.00"
								                v-model="max_random_amount"/>元
							</span>
							</a-radio>
						</a-radio-group>
						<div style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入0.30~200.00）</div>
					</a-form-item>
					<a-form-item class="current0" label="红包封面" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
						<a-upload
								action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								:showUploadList="false"
								:beforeUpload="beforeUpload"
						>
							<div v-show="!pic_url">
								<a-button>
									<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
									上传封面
								</a-button>
							</div>
							<img v-show="pic_url" style="max-width: 128px; max-height: 128px;"
							     :src="commonUrl + pic_url"/>
							<div style="display: inline-block;vertical-align: bottom;margin-left: 5px;"
							     v-show="pic_url">
								<a-button>
									<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
									替换
								</a-button>
							</div>
							<div style="margin-top: 10px;">
								图片像素建议为200px*200px，格式为jpg、jpeg、png，大小不超过2M
							</div>
						</a-upload>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
					<span slot="label">
						<span style="color: #FF562D;">*</span>标题
					</span>
						<a-input style="width: 340px;" placeholder="请填写标题" :maxLength="32" v-model="title">
						<span slot="suffix">
	                        <span>{{title.length}}</span>/32
						</span>
						</a-input>
					</a-form-item>
					<a-form-item label="添加描述" class="current0" :label-col="{ span: 3 }"
					             :wrapper-col="{ span: 19 }">
						<div>
							<a-textarea style="max-width: 500px;" placeholder="请填写描述" v-model="des"
							            :maxLength="128" :rows="4"/>
						</div>
						<div style="max-width: 500px; text-align: right">
							<span>{{des.length}}</span>/128
						</div>
					</a-form-item>
					<a-form-item class="current0" label="感谢语" :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }">
						<a-input style="width: 340px;" placeholder="恭喜发财，大吉大利" :maxLength="32" v-model="thanking">
						<span slot="suffix">
	                        <span>{{thanking.length}}</span>/32
						</span>
						</a-input>
					</a-form-item>
				</a-form>
				<a-button style="margin-left: 50%;transform: translate(-50%, 0%);margin-bottom: 10px;" type="primary" @click="createRule"
				          :loading="loading1">
					提交
				</a-button>
			</div>
		</a-spin>
	</div>
</template>

<script>
	import TemplateList from "../template/List";

	export default {
		name      : "RuleAdd",
		components: {TemplateList},
		data () {
			return {
				isLoading        : false,   // 页面加载
				loading1         : false,   // 提交按钮加载
				editId           : '',
				commonUrl        : this.$store.state.commonUrl,
				loading          : false,   // 上传图片加载
				name             : '',
				type             : 1,
				fixed_amount     : 0.3,
				min_random_amount: '',
				max_random_amount: '',
				pic_url          : '/static/image/default-redpacket.png',
				title            : '恭喜发财，大吉大利',
				des              : '戳我领取红包~',
				thanking         : '恭喜发财，大吉大利'
			}
		},
		mounted () {
			this.editId = this.$route.query.id ? this.$route.query.id : ''
			if (this.editId) {
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/redForNew/rule')
				this.getDetail()
			}
		},
		methods   : {
			async getDetail () {
				this.isLoading = true
				const {data: res} = await this.axios.post("red-pack-rule/rule-info", {
					uid: localStorage.getItem('uid'),
					id : this.editId
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.name = res.data.name
					this.type = res.data.type
					this.fixed_amount = res.data.fixed_amount
					this.min_random_amount = res.data.min_random_amount
					this.max_random_amount = res.data.max_random_amount
					this.pic_url = res.data.pic_url
					this.title = res.data.title
					this.des = res.data.des
					this.thanking = res.data.thanking
					this.isLoading = false
				}
			},
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/redForNew/rule?isRefresh=1")
			},
			changeType (e) {
				this.type = e.target.value
			},
			//活动海报
			beforeUpload (file) {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					this.$message.error('封面仅支持jpg、jpeg、png格式！');
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('图片大小不超过2M');
					return false
				}
				this.uploadImage(file)
			},
			// 上传
			async uploadImage (file) {
				this.loading = true
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				param.append("fileInfo", file);
				const {data: res} = await this.axios.post("sub-user/upload-image", param);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.loading = false
				} else {
					this.pic_url = res.data.local_path
					this.loading = false
				}
			},
			async createRule () {
				this.loading1 = true
				if (this.name == '') {
					this.$message.destroy()
					this.$message.warning('请输入规则名称')
					this.loading1 = false
					return false
				}
				if (this.type == 1) {
					if (this.fixed_amount == "") {
						this.$message.destroy()
						this.$message.warning('请输入红包金额')
						this.loading1 = false
						return false
					}
				}
				if (this.type == 2) {
					if (this.min_random_amount == "" || this.max_random_amount == '') {
						this.$message.destroy()
						this.$message.warning('请输入红包金额')
						this.loading1 = false
						return false
					} else if (this.min_random_amount >= this.max_random_amount) {
						this.$message.destroy()
						this.$message.warning('随机金额最大值必须大于最小值')
						this.loading1 = false
						return false
					}
				}
				if (this.title.trim() == '') {
					this.$message.destroy()
					this.$message.warning('请填写标题')
					this.loading1 = false
					return false
				}
				const {data: res} = await this.axios.post("red-pack-rule/rule-add", {
					uid              : localStorage.getItem('uid'),
					id               : this.editId,
					name             : this.name,
					type             : this.type,
					fixed_amount     : this.fixed_amount,
					min_random_amount: this.min_random_amount,
					max_random_amount: this.max_random_amount,
					pic_url          : this.pic_url,
					title            : this.title,
					des              : this.des,
					thanking         : this.thanking || '恭喜发财，大吉大利'
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.loading1 = false
				} else {
					this.loading1 = false
					if (!this.editId) {
						this.$router.push("/redForNew/rule")
					} else {
						this.$router.push("/redForNew/rule?isRefresh=1")
					}
				}
			}
		}
	}
</script>

<style scoped>
	.current0 {
		margin-bottom: 1.5%;
	}

	/deep/ .ant-spin-container {
		height: 100%;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}
</style>