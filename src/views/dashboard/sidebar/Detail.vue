<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">聊天侧边栏</label>
				<help-icon help-url="https://support.qq.com/products/104790/faqs/63937"></help-icon>
			</a-card>

			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-row>
							<div class="content-msg">
								<p style="margin-bottom: 2px;">
									1、可配置【内容引擎】应用页面到聊天侧边栏，方便成员在外部会话中查看相关的内容（支持多种消息格式，包括文本，图片，视频，文件以及H5）并使用，提高客户服务效率。
								</p>
								<p style="margin-bottom: 2px;">
									2、可配置【客户CRM/群CRM】应用页面到聊天侧边栏，方便成员在外部会话中，不仅可以追踪客户/群行为轨迹，洞察客户需求，还可以快速完善客户/群资料和记录客户/群跟进联系情况，继而提供员工工作效率。
								</p>
								<p style="margin-bottom: 0px; color:red;">
									3、配置的应用名称必须以【{{$store.state.shortName}}】开头。（例如：{{$store.state.siteName}}）
								</p>
							</div>
						</a-row>
						<a-row style="margin-bottom:20px;padding:0 20px;">
							<a-col :span="24">
								<a-card title="第一步：设置企业微信侧边栏应用">
									<div style="padding: 32px 32px 20px 32px;">
										<a-row :gutter="16">
											<a-col :span="6" v-if="agentInfo.id > 0" v-has="'agent-list'">

												<div class="agent-box" @click="getAgentInfo(agentInfo.id, 0)">
													<div class="agent-logo">
														<a-avatar
																slot="avatar"
																:src="agentInfo.square_logo_url"
														/>
													</div>
													<div class="agent-info">
														<div class="agent-title">{{agentInfo.name}}</div>
														<div class="agent-desc">{{agentInfo.description}}</div>
													</div>
												</div>
											</a-col>

											<a-col :span="6" v-if="!agentInfo.id" v-has="'agent-add'">
												<div class="agent-box agent-add" @click="showAddAgent">
													<span class="add-btn">
														<a-icon type="plus"/>
													</span>
												</div>
											</a-col>
											<a-col :span="6"
											       v-if="agentInfo.id && agentInfo.custom && agentInfo.custom.length > 1"
											       v-has="'agent-add'">
												<div class="agent-box agent-add" @click="replaceApplication">
													<span style="font-size: 16px; height: 47px; line-height: 47px;">
														替 换
													</span>
												</div>
											</a-col>
											<a-col :span="6"
											       v-if="!agentInfo.id && agentInfo.custom && agentInfo.custom.length != 0"
											       v-has="'agent-add'">
												<div class="agent-box agent-add" @click="exportApplication">
													<span style="font-size: 16px; height: 47px; line-height: 47px;">
														导 入
													</span>
												</div>
											</a-col>
											<!--	-->

										</a-row>
									</div>
								</a-card>
							</a-col>
						</a-row>
						<a-row style="margin-bottom:20px;padding:0 20px;">
							<a-col :span="24">
								<a-card title="第二步：设置聊天侧边栏应用页面">
									<div style="padding: 32px 32px 20px 32px;">
										<a-row :gutter="16">
											<a-col v-if="agentInfo.id > 0">
												<p style="margin-bottom: 2px;">
													1、请至企业微信官方后台”客户联系-聊天工具-聊天侧边栏管理”选择对应的自建应用后，添加【内容引擎】应用页面，并将地址<b>{{this.$store.state.h5Url
													+
													'/h5/pages/slider/index?agentId=' + agentInfo.id + '&corpid=' + corpId}}</b>设置为该应用主页。</p>
												<p style="margin-bottom: 2px;">
													2、请至企业微信官方后台”客户联系-聊天工具-聊天侧边栏管理”选择对应的自建应用后，添加【客户CRM/群CRM页面】应用页面，并将地址<b>{{this.$store.state.h5Url
													+
													'/h5/pages/customDetail/index?agent_id=' + agentInfo.id + '&corpid=' + corpId}}</b>
													设置为该应用主页。</p>
												<p style="margin-bottom: 2px;">
													3、请至企业微信官方后台”客户联系-聊天工具-聊天侧边栏管理”选择对应的自建应用后，添加【发红包】应用页面，并将地址<b>{{this.$store.state.h5Url
													+
													'/h5/pages/redPacket/records?agent_id=' + agentInfo.id + '&corpid=' + corpId}}</b>
													设置为该应用主页。</p>
											</a-col>
											<a-col v-if="!agentInfo.id">
												<span style="color:red;">请先在第一步设置企业微信侧边栏应用</span>
											</a-col>
											<a-col>
												<a-button type="primary" style="margin-top: 10px;" @click="jumpQy">
													前往企微后台
												</a-button>
											</a-col>
										</a-row>
									</div>
								</a-card>
							</a-col>
						</a-row>
						<a-row style="margin-bottom:20px;padding:0 20px;">
							<a-col :span="24">
								<a-card title="第三步：设置应用可信域名">
									<div style="padding: 32px 32px 20px 32px;">
										<a-row :gutter="16">
											<a-col>
												在应用设置页，将 <b>{{$store.state.redirectDomain}}</b> 设置为可信域名，并下载校验文件保存到电脑本地后，在此处上传。
												<a :href="$store.state.commonUrl+'/upload/slider.png'" target="_blank"
												   class="el-link el-link--primary">
													<span class="el-link--inner">查看图示</span>
												</a>
											</a-col>
										</a-row>
										<a-row style="margin-top: 10px;">
											<a-col>
												<a-upload
														name="file"
														accept=".txt"
														:multiple="true"
														action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
														@change="handleSidebarCancel"
														:beforeUpload="beforeUpLoadInfo"
														:customRequest="selfUpLoadInfo"
												>
													<a-button type="primary">
														<a-icon type="upload"/>
														上传文件
													</a-button>
												</a-upload>
											</a-col>
										</a-row>
										<a-row>
											<a-col style="font-size: 12px;color: #999;">
												请上传txt格式的校验文件，用于完成域名归属验证。否则无法正常使用聊天侧边栏。
											</a-col>
										</a-row>
									</div>
								</a-card>
							</a-col>
						</a-row>
					</div>
				</a-spin>
			</div>
		</div>
		<a-modal :title="agentTitle" v-model="appVisibvle" width="888px" @ok="exportAgent" @cancel="exportAgentCancel">
			<a-row :gutter="24">
				<div v-if="agentTitle == '替换应用'" style="color: #FF562D;margin: 10px 0 20px 8px;">更换自建应用后，之前所配置的自建应用页面需要前往【<a target="_blank"
				                                                         href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
					企业微信后台</a>】重新配置。</div>
				<template v-for="item in agentInfo.custom">
					<a-col :span="8">
						<div class="agent-box1" :class="chooseId == item.id ? 'active':''"
						     @click="chooseAgent(item.id)">
							<div class="agent-logo">
								<a-avatar
										slot="avatar"
										:src="item.square_logo_url"
								/>
							</div>
							<div class="agent-info">
								<div class="agent-title">{{item.name}}</div>
								<div class="agent-desc">{{item.description}}</div>
							</div>
						</div>
					</a-col>
				</template>
			</a-row>
		</a-modal>
		<!-- 添加自建应用 -->
		<a-modal title="添加自建应用" v-model="showAddAgentModal" @ok="addAgent" @cancel="addAgentCancel">
			<a-form-item
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 18 }">
				<template slot="label">
					<span style="color: red;"> * </span>应用Id
				</template>
				<a-input placeholder="请输入自建应用的AgentId" v-model="addAgentId"/>
			</a-form-item>

			<a-form-item
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 18 }">
				<template slot="label">
					<span style="color: red;"> * </span>应用Secret
				</template>
				<a-input placeholder="请输入自建应用的Secret" v-model="addAgentSecret"/>
			</a-form-item>
		</a-modal>

		<!-- 自建应用详情 -->
		<a-modal title="应用详情" v-model="showAgentInfoModal" @cancel="agentInfoCancel">
			<template slot="footer">
				<a-button type="primary" :loading="refreshLoading" @click="refreshAgent(agentInfo.id)">同步</a-button>
			</template>
			<div class="agent-info-box">
				<a-row class="agent-info-item" :gutter="16">
					<a-col :span="8">
						<a-avatar class="agent-info-logo" shape="square" size="large"
						          :src="agentInfo.square_logo_url"></a-avatar>
					</a-col>
					<a-col :span="16">
						<div class="agent-name-box">
							<span class="agent-name" v-show="!agentNameVisible">{{agentInfo.name}}</span>
							<span
									class="agent-info-edit"
									@click="modifyAgentName(agentInfo.name, agentInfo.name.length)"
									v-show="!agentNameVisible">
								<a-icon type="edit" alt=""/>
							</span>
							<a-input-search
									ref="agent_name_input"
									class="agent-name-input"
									v-model="agentInfoName"
									placeholder="输入应用名称"
									:data-aid="agentInfo.id"
									@search="setAgentName"
									@change="agentNameChange"
									v-show="agentNameVisible" :maxLength="32">
								<span slot="suffix">
									<span>{{agentNameLength}}</span>/32
								</span>
								<a-button
										slot="enterButton"
										:data-wk="corpId"
										:data-aid="agentInfo.id"
										type="primary">
									<a-icon type="check"/>
								</a-button>
							</a-input-search>
						</div>

						<div class="agent-description-box">
							<span class="agent-description" v-show="!agentDescVisible">{{agentInfo.description}}</span>
							<span
									class="agent-info-edit agent-description-edit"
									@click="modifyAgentDesc(agentInfo.description, agentInfo.description.length)"
									v-show="!agentDescVisible">
								<a-icon type="edit" alt=""/>
							</span>
							<a-input-search
									ref="agent_description_input"
									class="agent-description-input"
									v-model="agentInfoDesc"
									placeholder="输入应用详情"
									:data-aid="agentInfo.id"
									@search="setAgentDesc"
									@change="agentDescChange"
									v-show="agentDescVisible" minlength="4" :maxLength="120">
								<span slot="suffix">
									<span>{{agentDescLength}}</span>/120
								</span>
								<a-button
										slot="enterButton"
										:data-wk="corpId"
										:data-aid="agentInfo.id"
										type="primary">
									<a-icon type="check"/>
								</a-button>
							</a-input-search>
						</div>
					</a-col>
				</a-row>

				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">可信域名：</a-col>
					<a-col :span="16">{{agentInfo.redirect_domain}}</a-col>
				</a-row>

				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">主页地址：</a-col>
					<a-col :span="16">{{agentInfo.home_url}}</a-col>
				</a-row>

				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">地理位置：</a-col>
					<a-col :span="16" v-if="agentInfo.report_location_flag == 0">不上报</a-col>
					<a-col :span="16" v-else>上报</a-col>
				</a-row>

				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">用户进入应用事件：</a-col>
					<a-col :span="16" v-if="agentInfo.isreportenter == 0">不接收</a-col>
					<a-col :span="16" v-else>接收</a-col>
				</a-row>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import axios from 'axios'
	import helpIcon from "@/components/helpIcon";

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	export default {
		name      : "list",
		components: {
			helpIcon
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				isLoading         : true, // Loading 组件显示与隐藏
				showCorpModal     : false,  // 是否显示授权modal
				showAddAgentModal : false,  // 是否打开应用添加modal
				showAgentInfoModal: false,  // 是否展示应用详情modal
				chooseId          : '',
				appVisibvle       : false,
				agentTitle        : '导入应用',
				corpId            : corpId,// 企业微信选中的id
				corpInfo          : [], // 企业微信列表
				auth              : [],    // 系统授权应用
				normal            : {
					normal: [], // 基础应用
					custom: [], // 自建应用
				}, // 自建应用
				addAgentId        : '', // 应用Id（AgentId）
				addAgentSecret    : '', // 应用Secret（Secret）
				agentInfo         : {
					key                 : 0, // 应用KEY
					id                  : 0,    // 应用系统ID
					agentid             : 0,    // 应用ID
					name                : '',   // 应用名称
					description         : '',   // 应用描述
					square_logo_url     : '',   // 应用logo
					redirect_domain     : '',   // 应用可信域名
					home_url            : '',   // 应用主页地址
					report_location_flag: 0,    // 应用是否打开地理位置上报 0：不上报；1：进入会话上报；
					isreportenter       : 0,    // 是否上报用户进入应用事件。0：不接收；1：接收
					custom              : []
				},  //  应用信息
				agentNameVisible  : false,  // 是否显示应用名称编辑框
				agentNameLength   : 0,  // 应用名称长度
				agentInfoName     : '',  // 编辑框中的应用名称
				agentDescVisible  : false,  // 是否显示应用详情编辑框
				agentDescLength   : 0,  // 应用详情长度
				agentInfoDesc     : '',  // 编辑框中的应用详情
				refreshLoading    : false,  // 同步更新状态
			}
		},
		methods   : {
			showAddAgent () {
				this.addAgentId = ''
				this.addAgentSecret = ''
				this.showAddAgentModal = true
			},
			replaceApplication() {
				this.chooseId = this.agentInfo.id
				this.agentTitle = '替换应用'
				this.appVisibvle = true
			},
			exportApplication () {
				this.chooseId = ''
				this.agentTitle = '导入应用'
				this.appVisibvle = true
			},
			chooseAgent (id) {
				this.chooseId = id
			},
			async exportAgent () {
				if (this.chooseId == '') {
					this.$message.warning('请选择应用！')
					return false
				}
				const {data: res} = await this.axios.post('work-agent/update-agent-use-type', {
					corp_id : this.corpId,
					agent_id: this.chooseId,
					use_type: 1
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.getSlider()
					this.chooseId = ""
					this.appVisibvle = false
				}
			},
			exportAgentCancel () {
				this.chooseId = ''
				this.appVisibvle = false
			},
			async addAgent () {
				if (this.addAgentId == '') {
					this.$message.error('请输入应用Id！');
					return false;
				}
				if (this.addAgentSecret == '') {
					this.$message.error('请输入应用Secret！');
					return false;
				}

				const {data: res} = await this.axios.post('work-agent/add', {
					corp_id       : this.corpId,
					agent_id      : this.addAgentId,
					agent_secret  : this.addAgentSecret,
					agent_use_type: 1,
				})

				if (res.error != 0) {
					this.$message.error('添加失败，请检查是否正确！')
				} else {
					const {data: getRes} = await this.axios.post('work-agent/get', {
						corp_id : this.corpId,
						agent_id: res.data.agent_id,
					})

					if (getRes.error != 0) {
						this.$message.error('添加失败，请检查是否正确！错误描述：' + getRes.error_msg)
					} else {
						this.showAddAgentModal = false
						this.addAgentId = ''
						this.addAgentSecret = ''

						this.isLoading = true
						this.getSlider()
					}
				}
			},
			async refreshAgent (agentId) {
				this.refreshLoading = true

				const {data: res} = await this.axios.post('work-agent/get', {
					corp_id : this.corpId,
					agent_id: agentId,
					ignore  : true,
				})

				if (res.error != 0) {
					this.refreshLoading = false
					this.$message.error('同步失败！错误描述：' + res.error_msg)
				} else {
					this.refreshLoading = false
					this.showAgentInfoModal = false
					this.isLoading = true
					this.getSlider()
				}
			},
			addAgentCancel () {
				this.showAddAgentModal = false
				this.addAgentId = ''
				this.addAgentSecret = ''
			},

			// 关闭应用详情对话框
			agentInfoCancel () {
				this.showAgentInfoModal = false
			},
			// 修改应用名称
			modifyAgentName (agentName, length) {
				this.agentInfoName = agentName
				this.agentNameLength = length
				this.agentNameVisible = !this.agentNameVisible;
			},
			// 备注的输入框变化
			agentNameChange (e) {
				this.agentNameLength = e.target.value.length;
			},
			// 设置应用名称
			async setAgentName (agentName, e) {
				if (this.agentInfo.name != agentName) {
					let postData = {
						corp_id : this.corpId,
						agent_id: e.target.dataset.aid,
						name    : agentName
					};
					const {data: res} = await this.axios.post('work-agent/set', postData);

					if (res.error != 0) {
						this.$message.error(res.error_msg);
					} else {
						this.agentInfo.name = agentName

						this.normal.custom[this.agentInfo.key].name = agentName

						this.agentNameVisible = !this.agentNameVisible;
					}
				} else {
					this.agentNameVisible = !this.agentNameVisible;
					return false;
				}
			},
			// 修改应用名称
			modifyAgentDesc (agentDesc, length) {
				this.agentInfoDesc = agentDesc
				this.agentDescLength = length
				this.agentDescVisible = !this.agentDescVisible;
			},
			// 备注的输入框变化
			agentDescChange (e) {
				this.agentDescLength = e.target.value.length;
			},
			// 设置应用名称
			async setAgentDesc (agentDesc, e) {
				if (this.agentInfo.description != agentDesc) {
					let postData = {
						corp_id    : this.corpId,
						agent_id   : e.target.dataset.aid,
						description: agentDesc
					};
					const {data: res} = await this.axios.post('work-agent/set', postData);

					if (res.error != 0) {
						this.$message.error(res.error_msg);
					} else {
						this.agentInfo.description = agentDesc

						this.normal.custom[this.agentInfo.key].description = agentDesc

						this.agentDescVisible = !this.agentDescVisible;
					}
				} else {
					this.agentDescVisible = !this.agentDescVisible;
					return false;
				}
			},
			// 获取应用详情
			async getAgentInfo (agentId, index) {
				const {data: res} = await this.axios.post('work-agent/info', {
					corp_id : this.corpId,
					agent_id: agentId,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.agentInfo.key = index
					this.agentInfo.id = res.data.id
					this.agentInfo.agentid = res.data.agentid
					this.agentInfo.name = res.data.name
					this.agentInfo.description = res.data.description
					this.agentInfo.square_logo_url = res.data.square_logo_url
					this.agentInfo.redirect_domain = res.data.redirect_domain
					this.agentInfo.home_url = res.data.home_url
					this.agentInfo.report_location_flag = res.data.report_location_flag
					this.agentInfo.isreportenter = res.data.isreportenter
					this.showAgentInfoModal = true
				}
			},

			jumpQy () {
				window.open(
					`https://work.weixin.qq.com/wework_admin/loginpage_wx`,
					"_blank"
				);
			},
			//侧边栏应用
			async getSlider () {
				const {data: res} = await this.axios.post('work-agent/slider', {
					corp_id: this.corpId,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					if (res.data.is_have == 1) {
						this.agentInfo.key = 0
						this.agentInfo.id = res.data.id
						this.agentInfo.agentid = res.data.agentid
						this.agentInfo.name = res.data.name
						this.agentInfo.description = res.data.description
						this.agentInfo.square_logo_url = res.data.square_logo_url
						this.agentInfo.redirect_domain = res.data.redirect_domain
						this.agentInfo.home_url = res.data.home_url
						this.agentInfo.report_location_flag = res.data.report_location_flag
						this.agentInfo.isreportenter = res.data.isreportenter
					} else {
						this.normal.custom = res.data.custom
					}
					this.agentInfo.custom = res.data.custom
					this.isLoading = false
				}
			},

			//添加到企微侧边栏——上传文件
			handleSidebarCancel () {
				if (!this.fileInfo.uid) {
					this.$message.warning('请选择文件！')
					return false
				}
				this.upLoadInfo(this.fileInfo);
			},
			selfUpLoadInfo ({action, file, onSuccess, onError, onProgress}) {
				const base64 = new Promise(resolve => {
					const fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					this.fileName = file.name;
					fileReader.onload = () => {
						resolve(fileReader.result);

					};
				});
				this.fileInfo = file;
			},
			beforeUpLoadInfo (file) {
				const isTxt = file.type === 'text/plain';
				if (!isTxt) {
					this.$message.error('只能上传txt文件');
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 1;
				if (!isLt2M) {
					this.$message.error("文件不超过1M！");
					return false;
				} else if (file.size < 1) {
					this.$message.error("上传的文件大小需大于1字节！");
					return false;
				}
				return isLt2M;
			},
			async upLoadInfo () {
				let params = {}
				params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", this.fileInfo);
				const {data: res} = await this.axios.post("attachment/upload-txt", params, {cancelToken: source.token});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.$message.success('上传文件成功')
				}
			},
			//添加到企微侧边栏——查看使用教程
			handleSidebarOk () {
				window.open(
					'https://support.qq.com/products/104790/faqs/59786',
					"_blank"
				);
			},
		},
		created () {
			this.getSlider()
		}
	}
</script>

<style lang="less" scoped>
	.agent-box1 {
		border: 1px solid #E8E8E8;
		height: 95px;
		padding: 24px;
		cursor: pointer;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
		margin-bottom: 12px;

		&.agent-add {
			text-align: center;
		}

		.agent-logo {
			float: left;
			padding-right: 16px;
		}

		.agent-info {
			overflow: hidden;

			> div:not(:last-child) {
				margin-bottom: 8px;
			}

			.agent-title {
				color: rgba(0, 0, 0, 0.85);
				font-weight: 500;
				font-size: 16px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.agent-desc {
				color: rgba(0, 0, 0, 0.45);
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}

		.add-btn {
			height: 47px;
			font-size: 25px;
			line-height: 47px;
		}
	}

	.agent-box {
		border: 1px solid #E8E8E8;
		height: 95px;
		padding: 24px;
		cursor: pointer;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
		margin-bottom: 12px;

		&:hover {
			border-color: rgba(0, 0, 0, 0.09);
			-webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
		}

		&.agent-add {
			text-align: center;
		}

		.agent-logo {
			float: left;
			padding-right: 16px;
		}

		.agent-info {
			overflow: hidden;

			> div:not(:last-child) {
				margin-bottom: 8px;
			}

			.agent-title {
				color: rgba(0, 0, 0, 0.85);
				font-weight: 500;
				font-size: 16px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.agent-desc {
				color: rgba(0, 0, 0, 0.45);
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}

		.add-btn {
			height: 47px;
			font-size: 25px;
			line-height: 47px;
		}
	}

	.agent-info-box {
		.agent-info-item {
			margin-bottom: 15px;

			.agent-info-logo {
				float: right;
				width: 60px;
				height: 60px;
				margin-top: 5px;
				margin-right: 5px;
			}

			.agent-info-label {
				text-align: right;
			}

			.agent-name-box {
				height: 40px;
				padding: 5px 0;

				.agent-name {
					font-size: 20px;
					line-height: 30px;
					display: inline-block;
					vertical-align: middle;
				}
			}

			.agent-description-box {
				height: 32px;

				.agent-description {
					font-size: 14px;
					line-height: 21px;
					display: inline-block;
					vertical-align: middle;
					margin-top: 5px;
				}

				.agent-description-edit {
					display: inline-block;
					margin-top: 5px;
				}
			}

			.agent-info-edit {
				margin-left: 10px;
				cursor: pointer;
				vertical-align: middle;
			}
		}
	}

	/deep/ .ant-upload-list {
		display: none;
	}

	.content-msg {
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 10px;
		margin: 0px 20px 20px 20px;
	}

	.active {
		border: 2px solid #1989FA;
	}
</style>