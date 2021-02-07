<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y: auto;">
		<a-card style="margin-bottom:20px;padding:10px 20px;">
			<label class="tpl-title">消息存档</label>
		</a-card>
		<div class="content-msg">
			<p style="margin-bottom: 0px;">
				企业微信会话存档，可以完整的保存员工和客户之间所有的对话，包括撤回/删除的信息，并提供自定义设置敏感词，一旦发生敏感操作，系统自动及时触发预警， 帮助商家做好企业风控。
			</p>
		</div>

		<!-- 表格部分 -->
		<div class="content-bd">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<div style="text-align: center;font-size: 18px;margin: 40px 0;color: #000;">完成以下步骤就可以成功开通啦！</div>
				<a-steps :current="currentStep" style="padding: 0 150px 40px;cursor: pointer;">
					<!--					@click="changeCurrentStep(index)"-->
					<a-step v-for="(item, index) in steps"
					        :key="item.title"
					        :title="item.title"/>
				</a-steps>
				<div v-show="currentStep == 0" class="enterprise-info">
					<div class="enterprise-info-part" style="padding: 10px;">
						<a-form-item label="企业名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<a-input style="width: 350px;" placeholder="输入企业名称"
							         v-model="corpName" disabled></a-input>
						</a-form-item>
						<a-form-item label="企业ID" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<a-input style="width: 350px;" placeholder="输入企业ID"
							         v-model="corpId" disabled></a-input>
						</a-form-item>
						<a-form-item label="企业代码" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<a-input style="width: 350px;" placeholder="输入企业统一社会信用代码"
							         v-model="corpCode"></a-input>
						</a-form-item>
						<a-form-item label="企业负责人" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<a-input style="width: 350px;" placeholder="输入企业负责人"
							         v-model="corpContactPerson"></a-input>
						</a-form-item>
						<a-form-item label="企业负责人电话" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<a-input style="width: 350px;" placeholder="输入企业负责人电话"
							         v-model="phone"></a-input>
						</a-form-item>
					</div>
					<div style="text-align: center;margin-bottom: 20px;">
						<a-button type="primary" style="width: 100px;" @click="saveCorpInfo">保存</a-button>
					</div>
				</div>
				<div v-show="currentStep == 1" class="qr-box">
					<div>
						<a-icon type="clock-circle" style="color: #52C41A;" theme="filled"/>
						已提交申请，请添加客服提交审核资料
					</div>
					<img src="../../../assets/archive/qrcode.png"
					     alt="" class="qr-box-img">
					<div class="qr-box-title">扫码添加专属客服</div>
				</div>
				<div v-show="currentStep == 2" class="enterprise-info">
					<div class="enterprise-info-part">
						<div class="enterprise-info-part-title">
							复制以下信息并填入到<span style="color: #1890FF;">企业微信后台</span>
							<a-popover placement="right">
								<template slot="content">
									<img src="../../../assets/archive/2.png" alt="" style="width: 500px;">
								</template>
								<a-icon type="question-circle" style="margin-left: 5px;"/>
							</a-popover>
						</div>
						<div class="enterprise-info-part-content">
							<a-form-item label="可信IP地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{$store.state.systemIp}}
								<a style="margin-left: 8px;background: #1890FF;color: #FFF;padding: 3px 5px;border-radius: 3px;font-size: 12px;"
								   @click="copyText($store.state.systemIp)">复制</a>
							</a-form-item>
							<a-form-item label="信息加密公钥" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								<a-button @click="getCertificateFile" v-if="key_list.length == 0">生成公钥</a-button>
								<template v-if="key_list.length > 0">
									<div>
										<span class="list-content">私钥内容</span>
										<a style="margin-left: 8px;background: #1890FF;color: #FFF;padding: 3px 5px;border-radius: 3px;font-size: 12px;"
										   @click="copyText(key_list[0].private_key)">复制</a>
									</div>
									<div>
										<span class="list-content">私钥文件</span>
										<a-popover placement="top">
											<template slot="content">下载</template>
											<a-icon type="download"
											        style="margin-left: 8px;cursor: pointer;color: #1890FF;"
											        @click="upLoadFile(commonUrl+key_list[0].private_key_path)"/>
										</a-popover>
									</div>
									<div>
										<span class="list-content">公钥内容</span>
										<a style="margin-left: 8px;background: #1890FF;color: #FFF;padding: 3px 5px;border-radius: 3px;font-size: 12px;"
										   @click="copyText(key_list[0].public_key)">复制</a>
									</div>
									<div>
										<span class="list-content">公钥文件</span>
										<a-popover placement="top">
											<template slot="content">下载</template>
											<a-icon type="download"
											        style="margin-left: 8px;cursor: pointer;color: #1890FF;"
											        @click="upLoadFile(commonUrl+key_list[0].public_key_path)"/>
										</a-popover>
									</div>
								</template>
							</a-form-item>
						</div>
					</div>
					<div class="enterprise-info-part">
						<div class="enterprise-info-part-title">
							将<span style="color: #1890FF;">企业微信后台会话存档</span>配置页面的Secret复制粘贴到下框中
							<a-popover placement="right">
								<template slot="content">
									<img src="../../../assets/archive/1.png" alt="" style="width: 500px;">
								</template>
								<a-icon type="question-circle" style="margin-left: 5px;"/>
							</a-popover>
						</div>
						<div class="enterprise-info-part-content">
							<a-form-item label="会话存档Secret" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								<a-input style="width: 350px;" placeholder="输入会话存档Secret"
								         v-model="sessionArchiveSecret"></a-input>
							</a-form-item>
							<a-form-item label="公钥版本号" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								<a-input style="width: 350px;" placeholder="输入公钥版本号"
								         v-model="publicKeyVersionNumber"></a-input>
							</a-form-item>
						</div>
					</div>
					<div class="enterprise-info-part">
						<div class="enterprise-info-part-content">
							<a-form-item label="会话存档状态" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								<a-switch v-model="status"/>
							</a-form-item>
						</div>
					</div>
					<div style="text-align: center;margin-bottom: 20px;">
						<a-button type="primary" style="width: 100px;" @click="saveCorpInfo"
						          :disabled="key_list.length > 0 && publicKeyVersionNumber != '' && sessionArchiveSecret != '' ? false : true">保存
						</a-button>
					</div>
				</div>
			</a-spin>
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			let corpName = localStorage.getItem('corpName') ? localStorage.getItem('corpName') : "";
			return {
				isLoading             : false, //Loading 组件显示与隐藏
				commonUrl             : this.$store.state.commonUrl,//公共的链接
				corpId                : corpId,
				steps                 : [  // 步骤名
					{
						title: '填写企业信息',
					},
					{
						title: '添加客服提交资料',
					},
					{
						title: '配置后台',
					}
				],
				currentStep           : 2,//当前步骤
				sessionArchiveSecret  : '',//会话存档Secret
				publicKeyVersionNumber: '',//公钥版本号
				status                : true,//会话存档状态
				key_list              : [],
				corpName              : corpName,//企业名称
				corpCode              : '',//企业代码
				corpContactPerson     : '',//企业接口人
				phone                 : '',//接口人电话
			};
		},
		methods: {
			changeCurrentStep (index) {
				this.currentStep = index
			},
			//保存企业信息
			async saveCorpInfo () {
				if (this.currentStep == 0) {
					if (this.corpCode == '') {
						this.$message.warning("请填写企业代码")
						return false
					}
					if (this.corpContactPerson == '') {
						this.$message.warning("请填写企业接口人")
						return false
					}
					let reg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/
					if (this.phone == '') {
						this.$message.warning("请填写接口人电话")
						return false
					} else {
						if (!reg.test(this.phone)) {
							this.$message.warning("请填写正确的接口人电话")
							return false
						}
					}
				} else if (this.currentStep == 2) {
					if (this.sessionArchiveSecret == '' || this.sessionArchiveSecret == null) {
						this.$message.warning("请填写会话存档Secret")
						return false
					}
				}
				this.isLoading = true
				const {data: res} = await this.axios.post('work-msg-audit/set', {
					corp_id      : this.corpId,
					credit_code  : this.corpCode,
					contact_user : this.corpContactPerson,
					contact_phone: this.phone,
					secret       : this.sessionArchiveSecret,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading = false
				} else {
					if (this.currentStep == 0) {
						this.currentStep = 1
						this.$message.success("保存成功")
						this.isLoading = false
					} else if (this.currentStep == 2) {
						this.setPublicKeyVersionNumber()
					}
				}
			},
			//设置密钥对的版本号
			async setPublicKeyVersionNumber () {
				if (this.key_list.length > 0) {
					if (this.publicKeyVersionNumber == '' || this.publicKeyVersionNumber == null) {
						this.$message.warning("请填写公钥版本号")
						this.isLoading = false
						return false
					}
					const {data: res} = await this.axios.post('work-msg-audit/set-key-version', {
						corp_id    : this.corpId,
						key_id     : this.key_list[0].key_id,
						key_version: this.publicKeyVersionNumber,
					})

					if (res.error != 0) {
						this.$message.error(res.error_msg);
						this.isLoading = false
					} else {
						this.setStatus()
					}
				}
			},
			//设置状态
			async setStatus () {
				let status = -1
				if (this.status) {
					status = 1
				} else {
					status = 0
				}
				const {data: res} = await this.axios.post('work-msg-audit/change-status', {
					corp_id: this.corpId,
					status : status
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading = false
				} else {
					this.$message.success("保存成功")
					this.isLoading = false
				}
			},
			//复制
			copyText (value) {
				let that = this
				const htmlTextAreaElement = document.createElement('textarea')
				document.body.appendChild(htmlTextAreaElement)
				htmlTextAreaElement.value = value
				htmlTextAreaElement.select()
				if (document.execCommand('copy')) {
					document.execCommand('copy')
					that.$message.success("复制成功！")
				}
				document.body.removeChild(htmlTextAreaElement)
			},
			//下载文件
			upLoadFile (file) {
				window.open(file)
			},
			//获取会话存档配置
			async generatePublicKey () {
				this.isLoading = true
				const {data: res} = await this.axios.post('work-msg-audit/get', {
					corp_id: this.corpId
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading = false
				} else {
					if (!Array.isArray(res.data)) {
						this.key_list = res.data.key_list
						if (this.key_list.length > 0) {
							this.publicKeyVersionNumber = this.key_list[0].key_version
						}
						if (res.data.secret !== null) {
							this.sessionArchiveSecret = res.data.secret
						}
						this.corpCode = res.data.credit_code
						this.corpContactPerson = res.data.contact_user
						this.phone = res.data.contact_phone
						if (this.corpCode == '' || this.corpCode == null || this.corpContactPerson == '' || this.corpContactPerson == null || this.phone == '' || this.phone == null) {
							this.currentStep = 0
						} else {
							if (res.data.status == -1) {
								this.currentStep = 1
							} else {
								this.currentStep = 2
								if (res.data.status == 1) {
									this.status = true
								} else {
									this.status = false
								}
							}
						}
					} else {
						this.currentStep = 0
					}
					this.isLoading = false
				}
			},
			//获取证书文件,生成公钥
			async getCertificateFile () {
				const {data: res} = await this.axios.post('work-msg-audit/get-key', {
					corp_id: this.corpId
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.generatePublicKey()
				}
			}
		},

		created () {
			if (this.currentStep == 0) {

			} else if (this.currentStep == 2) {
				this.generatePublicKey()
			}
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 0 20px 20px;
	}

	.content-bd {
		background: #FFF;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		margin: 0 20px;
		height: calc(100% - 168px);
		overflow-y: auto;
	}

	a:link {
		text-decoration: none;
	}

	a:visited {
		text-decoration: none;
	}

	a:hover {
		text-decoration: none;
	}

	a:active {
		text-decoration: none;
	}

	.qr-box {
		width: 378px;
		height: 380px;
		padding-top: 30px;
		background: #FFF;
		box-shadow: 0 2px 10px rgba(0, 0, 0, .16);
		border-radius: 4px;
		margin: 0 auto 20px;
		font-size: 16px;
		color: #000;
		text-align: center;

		.qr-box-img {
			width: 224px;
			margin: 24px 0 14px;
			box-shadow: 0 0 12px rgba(0, 0, 0, .3);
		}

		.qr-box-title {
			margin-top: 2px;
			font-size: 14px;
			line-height: 17px;
			color: #00000073;
		}
	}

	.enterprise-info {

		.enterprise-info-part {
			background: #F5F5F5;
			border: 1px solid #E2E2E2;
			margin: 0 150px 20px;

			.enterprise-info-part-title {
				border-bottom: 1px solid #E2E2E2;
				padding: 10px;
				color: #000;
				letter-spacing: 1px;
			}

			.enterprise-info-part-content {
				padding: 10px;
			}
		}
	}

	.list-content {
		width: 60px;
		display: inline-block;
		text-align: right;
	}
</style>