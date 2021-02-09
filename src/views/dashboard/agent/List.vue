<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">应用中心</label>
			</a-card>

			<a-row v-if="corpInfo.length > 1" style="margin-bottom:20px;padding:0 20px;">
				<a-col style="float:left;">
					<a-select
							showSearch
							optionFilterProp="children"
							style="width: 200px;"
							@change="handleChange"
							v-model="corpId"
					>
						<template v-for="item in corpInfo">
							<a-select-option :value="item.corpid">
								{{item.corp_full_name || item.corp_name}}
							</a-select-option>
						</template>
					</a-select>
				</a-col>
			</a-row>

			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-row style="margin-bottom:20px;padding:0 20px;">
							<a-col :span="24">
								<a-card title="系统应用">
									<div style="padding: 32px 32px 20px 32px;">
										<a-row :gutter="10">
											<a-col :span="6" v-for="authInfo in auth" v-has="'agent-list'">
												<div class="agent-box"
												     @click="addAccount(authInfo.id, authInfo.has_auth, authInfo.forbidden_auth)">
													<div class="agent-logo">
														<a-avatar
																slot="avatar"
																:src="authInfo.logo_url"
														/>
													</div>
													<div class="agent-info">
														<div class="agent-title">{{authInfo.name}}</div>
														<div class="agent-desc">{{authInfo.description}}</div>
													</div>
												</div>
											</a-col>
										</a-row>
									</div>
								</a-card>
							</a-col>
						</a-row>

						<a-row style="margin-bottom:20px;padding:0 20px;" v-if="corpInfo.length > 0">
							<a-col :span="24">
								<a-card>
									<div slot="title">基础应用
									</div>
									<div style="padding: 32px 32px 20px 32px;">
										<a-row :gutter="10">
											<a-col :span="6">
												<div v-if="!hasConfigure" class="prompt">未配置</div>
												<div class="agent-box"
												     @click="showPaymentVisible">
													<div class="agent-logo">
														<a-avatar shape="square"
														          slot="avatar"
														          :src="png"
														/>
													</div>
													<div class="agent-info">
														<div class="agent-title">企业支付</div>
													</div>
												</div>
											</a-col>
										</a-row>
									</div>
								</a-card>
							</a-col>
						</a-row>

						<template v-if="corpInfo.length > 0">
							<a-row style="margin-bottom:20px;padding:0 20px;">
								<a-col :span="24">
									<a-card>
										<span slot="title">
											<span style="line-height: 32px;">自建应用</span>
											<a-button style="float: right;" type="primary" icon="reload" @click="updateAgent" :loading="updateLoading">同步应用</a-button>
										</span>
										<a-row>
											<a-col style="padding: 0 32px; ">
												<div class="content-msg">
													<p style="margin-bottom: 0px; color:red;">
														配置的应用名称必须以【{{$store.state.shortName}}】开头。（例如：{{$store.state.siteName}}）
													</p>
												</div>
											</a-col>
										</a-row>

										<div style="padding: 32px 32px 20px 32px;">
											<a-row :gutter="16">
												<a-col :span="6" v-for="(custom, index) in normal.custom"
												       v-has="'agent-list'">

													<div class="agent-box" @click="getAgentInfo(custom.id, index)">
														<div class="agent-logo">
															<a-avatar
																	slot="avatar"
																	:src="custom.square_logo_url"
															/>
														</div>
														<div class="agent-info">
															<div class="agent-title">{{custom.name}}</div>
															<div class="agent-desc">{{custom.description}}</div>
														</div>
													</div>
												</a-col>

												<a-col :span="6" v-has="'agent-add'">
													<div class="agent-box agent-add" @click="showAddAgent()">
													<span class="add-btn">
														<a-icon type="plus"/>
													</span>
													</div>
												</a-col>
											</a-row>
										</div>
									</a-card>
								</a-col>
							</a-row>

							<!--							<a-row style="margin-bottom:20px;padding:0 20px;">-->
							<!--								<a-col :span="24">-->
							<!--									<a-card>-->
							<!--										<template slot="title">-->
							<!--											小程序应用<span style="margin-left: 10px;color: #999;font-size: 14px;">用于需要在{{$store.state.siteName}}系统里对企业内部成员发送小程序应用消息-->
							<!--										</span>-->
							<!--										</template>-->
							<!--										<div style="padding: 32px 32px 20px 32px;">-->
							<!--											<a-row :gutter="16">-->
							<!--												<a-col :span="6" v-for="(mini, index) in normal.mini"-->
							<!--												       v-has="'agent-list'">-->

							<!--													<div class="agent-box" @click="getAgentInfo(mini.id, index)">-->
							<!--														<div class="agent-logo">-->
							<!--															<a-avatar-->
							<!--																	slot="avatar"-->
							<!--																	:src="mini.square_logo_url"-->
							<!--															/>-->
							<!--														</div>-->
							<!--														<div class="agent-info">-->
							<!--															<div class="agent-title">{{mini.name}}</div>-->
							<!--															<div class="agent-desc">{{mini.description}}</div>-->
							<!--														</div>-->
							<!--													</div>-->
							<!--												</a-col>-->

							<!--												<a-col :span="6" v-has="'agent-add'">-->
							<!--													<div class="agent-box agent-add" @click="showAddAgent(4)">-->
							<!--													<span class="add-btn">-->
							<!--														<a-icon type="plus"/>-->
							<!--													</span>-->
							<!--													</div>-->
							<!--												</a-col>-->
							<!--											</a-row>-->
							<!--										</div>-->
							<!--									</a-card>-->
							<!--								</a-col>-->
							<!--							</a-row>-->
						</template>
					</div>
				</a-spin>
			</div>
		</div>

		<!-- 点击企业微信授权弹窗 -->
		<authorize-corp :show="showCorpModal" :cnfId="cnfId" @cancel="cancel"></authorize-corp>

		<!-- 添加自建应用 -->
		<a-modal :title="addAgentModalTitle" v-model="showAddAgentModal" @ok="addAgent" @cancel="addAgentCancel"
		         width="600px">
			<!--			<p>-->
			<!--				请登录<a href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome" target="_blank">企业微信官方后台</a>，在应用管理-小程序-自建应用，找到您已建好小程序应用的AgentId和Secret，并复制到下面的输入框，然后将该应用添加到本工具。<a href="https://support.qq.com/products/104790/faqs/61672" target="_blank">使用教程</a>-->
			<!--			</p>-->
			<div class="content-msg" style="margin-top: 0;margin-bottom: 15px;" v-if="addAgentModalTitle == '配置企业支付应用'">
				<p style="margin-bottom: 0px;">
					请前往企业微信管理后台— “应用管理"--"应用”—“企业支付”，申请开通企业支付。
					开通后，请将企业支付的Agentid和Secret复制填到此处。
				</p>
			</div>
			<div class="content-msg" style="margin-top: 0;margin-bottom: 15px;" v-if="addAgentModalTitle == '添加自建应用'">
				<p style="margin-bottom: 2px;" v-if="agentCount == 0">
					请先添加自建应用，系统才可使用。
				</p>
				<p style="margin-bottom: 0px;">
					请登录企业微信官方后台，在应用管理-应用-自建应用，找到您已建好应用的AgentId和Secret，并复制到下面的输入框。提交后将该应用添加到本系统里。
				</p>
			</div>
			<a-form-item
					:label-col="{ span: 4 }"
					:wrapper-col="{ span: 18 }">
				<template slot="label">
					<span style="color: red;"> * </span>应用Id
				</template>
				<a-input placeholder="请输入应用AgentId" v-model="addAgentId"/>
			</a-form-item>

			<a-form-item
					:label-col="{ span: 4 }"
					:wrapper-col="{ span: 18 }">
				<template slot="label">
					<span style="color: red;"> * </span>应用Secret
				</template>
				<a-input placeholder="请输入应用Secret" v-model="addAgentSecret"/>
			</a-form-item>
		</a-modal>

		<!-- 自建应用详情 -->
		<a-modal title="应用详情" v-model="showAgentInfoModal" @cancel="agentInfoCancel" width="600px">
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
							<template v-if="agentInfo.agentType == 2">
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
							</template>
							<template v-else>
								<span class="agent-name">{{agentInfo.name}}</span>
							</template>
						</div>

						<div class="agent-description-box">
							<template v-if="agentInfo.agentType == 2">
								<span class="agent-description"
								      v-show="!agentDescVisible">{{agentInfo.description}}</span>
								<span
										class="agent-info-edit agent-description-edit"
										@click="agentInfo.description != null ? modifyAgentDesc(agentInfo.description, agentInfo.description.length) : modifyAgentDesc(agentInfo.description, 0)"
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
							</template>
							<template v-else>
								<span class="agent-description">{{agentInfo.description}}</span>
							</template>
						</div>
					</a-col>
				</a-row>

				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">可信域名：</a-col>
					<a-col :span="16">{{agentInfo.redirect_domain}}</a-col>
					<a-col v-if="!agentInfo.redirect_domain" :span="16">
						<a
								href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_0010506211&ref_from=myhome_ref_sem_baidu_p"
								target="_blank"
								class="el-link el-link&#45;&#45;primary">
							<span class="el-link&#45;&#45;inner">去设置</span>
						</a>
						（
						<a
								:href="$store.state.commonUrl+'/upload/slider.png'"
								target="_blank"
								class="el-link el-link&#45;&#45;primary">
							<span class="el-link&#45;&#45;inner"> 查看图示</span>
						</a>
						）
						<a-tooltip placement="top">
							<template slot="title">
								<span>进入企业微信官方后台&#45;&#45;应用管理&#45;&#45;点击进入某个自用应用，将 {{$store.state.redirectDomain}} 复制填写到输入框内</span>
							</template>
							<a-icon type="question-circle" style="margin-left:5px;"/>
						</a-tooltip>
					</a-col>
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
				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">上传校验文件：</a-col>
					<a-upload
							name="file"
							accept=".txt"
							:multiple="true"
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							@change="handleSidebarCancel"
							:beforeUpload="beforeUpLoadInfo"
							:customRequest="selfUpLoadInfo"
					>
						<a-button>
							<a-icon type="upload"/>
							上传文件
						</a-button>
					</a-upload>
					<a :href="$store.state.commonUrl+'/upload/slider.png'" target="_blank"
					   class="el-link el-link--primary">
						<span class="el-link--inner"> 查看图示</span>
					</a>
				</a-row>
				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8"></a-col>
					<div style="color: rgb(153, 153, 153)">请上传txt格式的校验文件，用于完成域名归属验证。</div>
				</a-row>
				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">内容引擎页面地址：</a-col>
					<span class="agent-id">
						{{$store.state.h5Url}}/h5/pages/slider/index?agentId={{agentInfo.id}}&corpid={{corpId}}
					</span>
					<a style="margin-left: 10px;vertical-align: top;"
					   @click="copyText($store.state.h5Url + '/h5/pages/slider/index?agentId='+agentInfo.id+'&corpid='+corpId)">复制</a>
				</a-row>
				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">客户详情页地址：</a-col>
					<span class="agent-id">
						{{$store.state.h5Url}}/h5/pages/customDetail/index?agent_id={{agentInfo.id}}&corpid={{corpId}}
					</span>
					<a style="margin-left: 10px;vertical-align: top;"
					   @click="copyText($store.state.h5Url + '/h5/pages/customDetail/index?agent_id='+agentInfo.id+'&corpid='+corpId)">复制</a>
				</a-row>
				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">发红包地址：</a-col>
					<span class="agent-id">
						{{$store.state.h5Url}}/h5/pages/redPacket/records?agent_id={{agentInfo.id}}&corpid={{corpId}}
					</span>
					<a style="margin-left: 10px;vertical-align: top;"
					   @click="copyText($store.state.h5Url + '/h5/pages/redPacket/records?agent_id='+agentInfo.id+'&corpid='+corpId)">复制</a>
				</a-row>
				<a-form-item>
					<a-alert banner>
													<span slot="message">
														请务必保证该应用已开启 <b>接收消息</b> 并且已经将下边的信息配置到 <b>API接收消息</b>
													</span>
					</a-alert>
				</a-form-item>

				<a-row class="agent-info-item" style="margin-top: 15px;" :gutter="16">
					<a-col class="agent-info-label" :span="8">应用接收消息URL：</a-col>
					<span class="agent-id">
					{{$store.state.commonUrl + '/work/event/agent/' + agentInfo.id}}
					</span>
					<a style="margin-left: 10px;vertical-align: top;"
					   @click="copyText($store.state.commonUrl + '/work/event/agent/' + agentInfo.id)">复制</a>
				</a-row>

				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">Token：</a-col>
					<span class="agent-id">{{agentToken}}</span>
					<a style="margin-left: 10px;vertical-align: top;" @click="copyText(agentToken)">复制</a>
				</a-row>

				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">EncodingAESKey：</a-col>
					<span class="agent-id">{{agentEncodingAESKey}}</span>
					<a style="margin-left: 10px;vertical-align: top;" @click="copyText(agentEncodingAESKey)">复制</a>
				</a-row>
				<a-row class="agent-info-item" :gutter="16">
					<a-col class="agent-info-label" :span="8">工作台应用中心地址：</a-col>
					<span class="agent-id">
						{{$store.state.h5Url}}/h5/pages/scrm/staging?agent_id={{agentInfo.id}}&corpid={{corpId}}
					</span>
					<a style="margin-left: 10px;vertical-align: top;"
					   @click="copyText($store.state.h5Url + '/h5/pages/scrm/staging?agent_id='+agentInfo.id+'&corpid='+corpId)">复制</a>
					<a-tooltip placement="left">
						<template slot="title">
							<img src="../../../assets/staging.jpg" alt="" style="width: 100%;">
						</template>
						<a-icon type="question-circle"
						        style="cursor: pointer;vertical-align: text-top;margin-left: 10px;"/>
					</a-tooltip>
				</a-row>
				<a-row class="agent-info-item" :gutter="16" style="margin-top: -8px;">
					<a-col class="agent-info-label" :span="8" style="height: 36px;"></a-col>
					<div style="color: rgb(153, 153, 153);font-size: 12px;">
						可以在手机端查看客户、客户群、跟进统计、内容统计等信息，简单来说，将云美来SCRM后台搬到了手机上进行查看和管理。<a
							href="https://support.qq.com/products/104790/faqs/80903" target="_blank">如何设置</a></div>
				</a-row>
			</div>
		</a-modal>

		<!-- 企业支付弹窗 -->
		<a-modal title="企业支付" v-model="paymentVisible" @cancel="paymentVisibleCancel" @ok="paymentVisibleOk"
		         width="600px">
			<div class="agent-info-box">
				<div>
					<a-avatar shape="square"
					          slot="avatar"
					          :src="png" style="width: 68px;height: 68px;margin: 0 10px 0 86px;"
					/>
					<span style="font-size: 20px;">企业支付</span>
					<a-button style="float:right;" @click="editPayment(1)" v-if="!editPaymentVisible">修改</a-button>
					<a-button style="float:right;" @click="editPayment(2)" v-if="editPaymentVisible">取消</a-button>
				</div>

				<div class="content-msg" style="margin-bottom: 15px;">
					<p style="margin-bottom: 0px;">
						只需要绑定已有的微信支付商户号，即可在企业微信内使用支付能力，企业成员可以给客户发红包（直接付款到客户的微信零钱）。<a
							href="https://support.qq.com/products/104790/faqs/66058" target="_blank">如何配置企业支付？</a>
					</p>
				</div>
				<a-form-item
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 16 }">
					<template slot="label">IP地址
					</template>
					<div>
						<span style="color: #01b065;">{{$store.state.systemIp}}</span>
						<a style="margin-left: 10px;background: #01b065;color: #FFF;padding: 3px 5px;border-radius: 3px;font-size: 12px;"
						   @click="copyText($store.state.systemIp)">复制</a>
					</div>
					<div style="color: #00000073;line-height:16px;font-size: 13px;">
						请在商户平台，将该IP地址填入【企业付款API安全】中，以保证支付功能正常使用
					</div>
				</a-form-item>
				<a-form-item
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 16 }">
					<template slot="label">微信支付商户号
					</template>
					<a-input placeholder="请输入微信支付商户号" v-model="paymentMerchant" v-if="editPaymentVisible"/>
					<template v-if="!editPaymentVisible">
						<span v-if="paymentMerchant == ''">暂未配置</span>
						<span v-if="paymentMerchant != ''">{{paymentMerchant}}</span>
					</template>
				</a-form-item>
				<a-form-item
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 16 }">
					<template slot="label">微信支付商户密钥
					</template>
					<a-input placeholder="请输入微信支付商户秘钥" v-model="paymentMerchantSecretKey" v-if="editPaymentVisible"/>
					<template v-if="!editPaymentVisible">
						<span v-if="paymentMerchantSecretKey == ''">暂未配置</span>
						<span v-if="paymentMerchantSecretKey != ''">{{paymentMerchantSecretKey}}</span>
					</template>
				</a-form-item>
				<a-form-item
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 16 }">
					<template slot="label">apiclient_cert文件
					</template>
					<a-upload
							name="file"
							accept=".pem"
							:multiple="true"
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							@change="upLoadCertificate(1)"
							:customRequest="selfUpLoadInfo2"
					>
						<template v-if="!editPaymentVisible">
									<span v-if="certificateInfo != ''" style="margin-right: 5px;"><a-icon type="file"
									                                                                      style="margin-right: 5px;"/>apiclient_cert文件已传</span>
							<span v-if="certificateInfo == ''">暂未配置</span>
						</template>
						<template v-if="editPaymentVisible">
							<span v-if="certificateInfo != ''" style="margin-right: 5px;"><a-icon type="file"
							                                                                      style="margin-right: 5px;"/>apiclient_cert文件已传</span>
							<a-button>
								<a-icon type="upload"/>
								<span v-if="certificateInfo == ''">上传文件</span>
								<span v-if="certificateInfo != ''">重新上传</span>
							</a-button>
						</template>
					</a-upload>
				</a-form-item>
				<a-form-item
						:label-col="{ span: 7 }"
						:wrapper-col="{ span: 16 }">
					<template slot="label">apiclient_key文件
					</template>
					<a-upload
							name="file"
							accept=".pem"
							:multiple="true"
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							@change="upLoadCertificate(2)"
							:customRequest="selfUpLoadInfo2"
					>
						<template v-if="!editPaymentVisible">
									<span v-if="certificateInfo2 != ''" style="margin-right: 5px;"><a-icon type="file"
									                                                                       style="margin-right: 5px;"/>apiclient_key文件已传</span>
							<span v-if="certificateInfo2 == ''">暂未配置</span>
						</template>
						<template v-if="editPaymentVisible">
						<span v-if="certificateInfo2 != ''" style="margin-right: 5px;"><a-icon type="file"
						                                                                       style="margin-right: 5px;"/>apiclient_key文件已传</span>
							<a-button>
								<a-icon type="upload"/>
								<span v-if="certificateInfo2 == ''">上传文件</span>
								<span v-if="certificateInfo2 != ''">重新上传</span>
							</a-button>
						</template>
					</a-upload>
				</a-form-item>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import authorizeCorp from "@/components/AuthorizeCorp.vue"
	import axios from 'axios'
	import png from '../../../assets/wxPay.png'

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	export default {
		name      : "list",
		components: {
			authorizeCorp
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				png,//微信支付图标
				isLoading               : true, // Loading 组件显示与隐藏
				showCorpModal           : false,  // 是否显示授权modal
				showAddAgentModal       : false,  // 是否打开应用添加modal
				showAgentInfoModal      : false,  // 是否展示应用详情modal
				cnfId                   : this.$store.state.sid,  // 默认的授权应用
				corpId                  : corpId,// 企业微信选中的id
				updateLoading           : false,
				corpInfo                : [], // 企业微信列表
				agentCount              : '0',
				auth                    : [],    // 系统授权应用
				normal                  : {
					normal: [], // 基础应用
					custom: [], // 自建应用
					mini  : [], // 小程序应用
				}, // 自建应用
				addAgentType            : '', // 应用类型
				addAgentId              : '', // 应用Id（AgentId）
				addAgentSecret          : '', // 应用Secret（Secret）
				agentToken              : '',
				agentEncodingAESKey     : '',
				agentInfo               : {
					key                 : 0, // 应用KEY
					id                  : 0,    // 应用系统ID
					agentid             : 0,    // 应用ID
					agentType           : '2',    // 应用类型
					agentUseType        : 0,    // 应用使用场景
					name                : '',   // 应用名称
					description         : '',   // 应用描述
					square_logo_url     : '',   // 应用logo
					redirect_domain     : '',   // 应用可信域名
					home_url            : '',   // 应用主页地址
					report_location_flag: 0,    // 应用是否打开地理位置上报 0：不上报；1：进入会话上报；
					isreportenter       : 0,    // 是否上报用户进入应用事件。0：不接收；1：接收
				},  //  应用信息
				agentNameVisible        : false,  // 是否显示应用名称编辑框
				agentNameLength         : 0,  // 应用名称长度
				agentInfoName           : '',  // 编辑框中的应用名称
				agentDescVisible        : false,  // 是否显示应用详情编辑框
				agentDescLength         : 0,  // 应用详情长度
				agentInfoDesc           : '',  // 编辑框中的应用详情
				refreshLoading          : false,  // 同步更新状态
				paymentVisible          : false,//企业支付弹窗的显示与隐藏
				paymentAgentId          : '',//企业支付应用Id
				paymentAgentSecret      : '',//企业支付应用Secret
				paymentMerchant         : '',//企业支付商户号
				paymentMerchantSecretKey: '',//企业支付商户秘钥
				headers                 : {
					authorization: 'authorization-text',
				},
				certificateInfo         : '',//apiclient_cert私钥文件地址
				certificateInfo2        : '',//apiclient_key公钥文件地址
				hasConfigure            : false,//有无配置过企业支付
				addAgentModalTitle      : '',//添加应用弹窗标题
				editPaymentVisible      : false,//是否为修改状态
			}
		},
		methods   : {
			async updateAgent() {
				this.updateLoading = true
				const {data: res} = await this.axios.post('work-agent/sync-agent', {
					corp_id: this.corpId,
				})
				if (res.error != 0) {
					this.updateLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.updateLoading = false
					window.location.reload()
				}
			},
			//企业支付
			showPaymentVisible () {
				if (!this.hasConfigure) {
					this.showAddAgentModal = true
					this.addAgentModalTitle = '配置企业支付应用'
				} else {
					this.paymentVisible = true
					this.getPaymentDetail()
				}
			},
			async getPaymentDetail () {
				const {data: res} = await this.axios.post('send-money-manage/pay-config', {
					corp_id: this.corpId,
					uid    : localStorage.getItem('uid')
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (res.data.payConfig != null) {
						this.paymentAgentId = res.data.payConfig.id
						this.paymentMerchant = res.data.payConfig.mchid
						this.paymentMerchantSecretKey = res.data.payConfig.key
						this.certificateInfo = res.data.payConfig.apiclient_cert
						this.certificateInfo2 = res.data.payConfig.apiclient_key
					}
				}
			},
			editPayment (val) {
				if (val == 1) {
					this.editPaymentVisible = true
				} else if (val == 2) {
					this.editPaymentVisible = false
				}
				this.$forceUpdate()
			},
			paymentVisibleCancel () {
				this.paymentVisible = false
				this.paymentMerchant = ''
				this.paymentMerchantSecretKey = ''
				this.certificateInfo = ''
				this.certificateInfo2 = ''
				this.editPaymentVisible = false
			},
			async paymentVisibleOk () {
				if (this.paymentMerchant == '' && this.paymentMerchantSecretKey == '' && this.certificateInfo == '' && this.certificateInfo2 == '') {
					this.$message.warning('请填写企业微信配置信息！')
					return false
				}
				const {data: res} = await this.axios.post('send-money-manage/pay-config-set', {
					id            : this.paymentAgentId,
					corp_id       : this.corpId,
					uid           : localStorage.getItem('uid'),
					mchid         : this.paymentMerchant,
					key           : this.paymentMerchantSecretKey,
					apiclient_cert: this.certificateInfo,
					apiclient_key : this.certificateInfo2
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('企业支付配置成功')
					this.paymentVisible = false
					this.paymentMerchant = ''
					this.paymentMerchantSecretKey = ''
					this.certificateInfo = ''
					this.certificateInfo2 = ''
					this.editPaymentVisible = false
				}
			},
			//证书上传
			upLoadCertificate (value) {
				if (!this.fileInfo.uid) {
					this.$message.warning('请选择文件！')
					return false
				}
				this.upLoadCertificateInfo(this.fileInfo, value);
			},
			selfUpLoadInfo2 ({action, file, onSuccess, onError, onProgress}) {
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
			async upLoadCertificateInfo (fileInfo, value) {
				let params = {}
				params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("corp_id", this.corpId);
				params.append("fileInfo", fileInfo);
				const {data: res} = await this.axios.post("send-money-manage/upload-pem", params, {cancelToken: source.token});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.$message.success('上传文件成功')
					if (value == 1) {
						this.certificateInfo = res.data.local_path
					} else if (value == 2) {
						this.certificateInfo2 = res.data.local_path
					}
				}
			},
			//切换企业微信
			handleChange (value) {
				this.corpInfo.map((x) => {
					if (value == x.corpid) {
						this.$store.commit("changeCorpAuthType", x.auth_type)
						this.$store.commit("changeCorpName", x.corp_name)
					}
				})
				this.$store.commit("changeCorpId", value)
				this.isLoading = true

				this.getList()
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			addAccount (cnfId, hasAuth, forbiddenAuth) {
				if (forbiddenAuth) {
					this.$message.warning('已开启通讯录同步，不允许授权通讯录套件。')
				} else {
					if (hasAuth) {
						this.$message.info('已授权，无需重复授权。')
					} else {
						this.showCorpModal = true
						this.cnfId = cnfId
					}
				}
			},
			cancel () {
				this.showCorpModal = false
			},
			showAddAgent (agentType = '') {
				this.addAgentType = agentType
				this.addAgentId = ''
				this.addAgentSecret = ''
				this.showAddAgentModal = true
				this.addAgentModalTitle = '添加自建应用'
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
				let addAgentType = ''
				let basic_agent_type = ''
				if (this.addAgentModalTitle == '添加自建应用') {
					//自建应用
					addAgentType = this.addAgentType
					basic_agent_type = ''
				} else if (this.addAgentModalTitle == '配置企业支付应用') {
					//基础应用
					addAgentType = 1
					basic_agent_type = 'moneyPay'
				}

				const {data: res} = await this.axios.post('work-agent/add', {
					corp_id         : this.corpId,
					agent_id        : this.addAgentId,
					agent_secret    : this.addAgentSecret,
					agent_type      : addAgentType,
					basic_agent_type: basic_agent_type,
				})

				if (res.error != 0) {
					this.$message.error('添加失败，请检查是否正确！')
				} else {
					const {data: getRes} = await this.axios.post('work-agent/get', {
						corp_id : this.corpId,
						agent_id: res.data.agent_id,
						is_tip  : 1,
					})

					if (getRes.error != 0) {
						this.$message.error('添加失败，请检查是否正确！错误描述：' + getRes.error_msg)
					} else {
						// this.showAddAgentModal = false
						// this.addAgentId = ''
						// this.addAgentSecret = ''
						//
						// this.isLoading = true
						// this.getList()
						// if (this.addAgentModalTitle == '配置企业支付应用') {
						// 	this.paymentVisible = true
						// }
						window.location.reload()
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
					window.location.reload()
					// this.refreshLoading = false
					// this.showAgentInfoModal = false
					// this.isLoading = true
					// this.getList()
				}
			},
			addAgentCancel () {
				this.showAddAgentModal = false
				this.addAgentId = ''
				this.addAgentSecret = ''
			},
			// 重置应用详细信息
			resetAgentInfo () {
				this.agentInfo = {
					key                 : 0,
					id                  : 0,
					agentid             : 0,
					agentType           : '2',
					agentUseType        : 0,
					name                : '',
					description         : '',
					square_logo_url     : '',
					redirect_domain     : '',
					home_url            : '',
					report_location_flag: 0,
					isreportenter       : 0,
				}

				this.agentNameVisible = false
				this.agentNameLength = 0
				this.agentInfoName = ''

				this.agentDescVisible = false
				this.agentDescLength = 0
				this.agentInfoDesc = ''
			},
			// 关闭应用详情对话框
			agentInfoCancel () {
				this.showAgentInfoModal = false
				this.resetAgentInfo()
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

						switch (this.agentInfo.agentType) {
							case 2:
								this.normal.custom[this.agentInfo.key].name = agentName

								break
						}

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


						switch (this.agentInfo.agentType) {
							case 2:
								this.normal.custom[this.agentInfo.key].description = agentDesc

								break
						}

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
					this.agentInfo.agentType = res.data.agent_type
					this.agentInfo.agentUseType = res.data.agent_use_type
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
			async getList () {
				this.auth = []
				this.normal = {
					normal: [],
					custom: [],
					mini  : [],
				}

				const {data: res} = await this.axios.post('work-agent/list', {
					corp_id: this.corpId,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.agentToken = res.data.normal.token
					this.agentEncodingAESKey = res.data.normal.encoding_AES_key

					let authKeys = Object.keys(res.data.auth);
					if (authKeys.length > 0) {
						authKeys.map(key => {
							this.auth.push(res.data.auth[key])
						})
					}
					if (res.data.normal.normal.length > 0) {
						res.data.normal.normal.map(normal => {
							this.normal.normal.push(normal)
						})
					}
					if (res.data.normal.custom.length > 0) {
						res.data.normal.custom.map(custom => {
							this.normal.custom.push(custom)
						})
					}

					if (res.data.normal.mini.length > 0) {
						res.data.normal.mini.map(mini => {
							this.normal.mini.push(mini)
						})
					}

					if (res.data.normal.has_moneyPay == 0) {
						this.hasConfigure = false
					} else {
						this.hasConfigure = true
					}

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
				const isLt2M = file.size / 1024 / 1024 <= 1;
				if (!isLt2M) {
					this.$message.error("文件不超过1M！");
					return false;
				} else if (file.size <= 1) {
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
			copyText (value) {
				let that = this
				const input = document.createElement('input')
				document.body.appendChild(input)
				input.setAttribute('value', value)
				input.select()
				if (document.execCommand('copy')) {
					document.execCommand('copy')
					that.$message.success("复制成功！")
				}
				document.body.removeChild(input)
			},
		},
		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				if (this.corpInfo.length > 0) {
					this.agentCount = this.corpInfo.find((corp) => corp.corpid == localStorage.getItem('corpId')).agent_count
				} else {
					this.agentCount = '0'
				}
				if (this.agentCount == 0) {
					this.addAgentType = ''
					this.addAgentId = ''
					this.addAgentSecret = ''
					this.showAddAgentModal = true
					this.addAgentModalTitle = '添加自建应用'
				}
				this.$emit('changeCorpId', this.corpId)
				this.getList()
			});
		}
	}
</script>

<style lang="less" scoped>
	@import '../../../style/_style.less';

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
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

	.agent-id {
		display: inline-block;
		width: 276px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	/deep/ .ant-upload-list {
		display: none;
	}

	.prompt {
		position: absolute;
		right: 0;
		top: 0;
		background: #FF000099;
		color: #FFF;
		padding: 2px 5px;
		border-radius: 8px;
	}
</style>