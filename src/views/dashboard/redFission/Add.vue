<template>
	<div class="fission-add">
		<a-card style="margin-bottom:20px;padding:10px 20px;">
			<label style="font-size: 16px;line-height: 32px;">
				<span v-if="id == ''">新建</span>
				<span v-else>编辑</span>红包裂变</label>
			<a-button type="primary"  style="font-size: 14px;float: right;" @click="goBack">返回列表
			</a-button>
		</a-card>
		<div class="content-msg" style="margin: 0 20px;" v-if="redFissionNum > 0">
			当前套餐版本仅支持<span style="color: red;">单场活动</span>用户参与人数上限<span style="color: red;">{{redFissionNum}}</span>人，达到上限后活动将自动结束。更多套餐信息可联系平台了解哦！
		</div>
		<div class="fission-content">
			<div class="img-left">
				<img :src="mobileImg" alt="" style="width: 100%;" v-if="current != 3 && current != 4">
				<div v-if="current == 4"
				     style="height: 100%;border: 1px solid #E2D6D6;background: #F5F5F5;overflow-y: auto;">
					<img src="../../../assets/wxHeader.png" alt
					     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
					<div class="msg_content_body">
						<!--文本-->
						<div class="mt" v-if="textAreaValueHeader">
							<a-avatar
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									:size="36" style="margin-right: 10px;float: left;"/>
							<span class="item-info msg_content_txt" v-html="textAreaValueHeader"></span>
						</div>
						<!--网址-->
						<div class="mt" v-if="link_pic_url || link_start_title || link_desc">
							<a-avatar
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									:size="36" style="margin-right: 10px;float: left;"/>
							<div class="item-info msg_content_txt">
								<p class="url-title">{{link_start_title}}</p>
								<div style="overflow: hidden;">
									<div class="url-text">{{link_desc}}</div>
									<img :src="commonUrl + link_pic_url" alt=""
									     style="float: right;width: 64px;height: 64px;object-fit: cover;">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="current == 3">
					<!-- 更改海报时改变menuKey重新渲染 -->
					<div style="width: 266px;border: 8px solid rgb(241, 241, 241);" :key="menuKey"
					     :style="{height: (backHeight + 18) + 'px'}">
						<div class="page-content" :style="{ 'height': backHeight + 'px' }">
							<img v-show="back_pic_url" style="max-width: 100%;position: absolute;" draggable="false"
							     :src="commonUrl + back_pic_url"/>
							<vue-draggable-resizable
									v-if="is_avatar"
									style="cursor: move;"
									:class="shape=='circle'? 'radus' : ''"
									:x="avatar.x"
									:y="avatar.y"
									:w="avatar.w"
									:h="avatar.w"
									:z="9999"
									:lock-aspect-ratio="true"
									@dragging="onDragAvatar"
									@resizing="onResizeAvatar"
									:parent="true">
								<span style="display:inline-block; position: absolute;left: 50%; top: 50%; transform: translate(-50%, -50%);font-size: 12px;">头像</span>
							</vue-draggable-resizable>
							<div style="border: 0px; position: absolute; left: 68px; top: 176px;"
							     v-if="!back_pic_url">
								<a-upload v-if="!back_pic_url"
								          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								          :showUploadList="false"
								          :beforeUpload="beforeUpload"
								>
									<!--									@change="uploadImage"-->
									<div>
										<a-button>
											<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
											上传海报
										</a-button>
									</div>
								</a-upload>
							</div>
							<vue-draggable-resizable
									style="cursor: move;"
									v-if="is_nickname"
									:x="nickName.x"
									:y="nickName.y"
									:w="nickNameWidth()"
									:h="nickNameHeight()"
									:z="9999"
									:resizable="false"
									:style="nickNameStyle()"
									@dragging="onDragNickName"
									:parent="true">
								昵称
							</vue-draggable-resizable>
							<vue-draggable-resizable
									style="cursor: move;"
									:x="qrCode.x"
									:y="qrCode.y"
									:w="qrCode.w"
									:h="qrCode.w"
									:z="9999"
									:lock-aspect-ratio="true"
									@dragging="onDragQrcode"
									@resizing="onResizeQrcode"
									:parent="true">
								<img :style="{width: qrCode.w + 'px', height: qrCode.w + 'px'}"
								     src="../../../assets/fission/add/qrcode.png">
							</vue-draggable-resizable>
						</div>
					</div>
				</div>
			</div>
			<div class="steps-content">
				<a-steps :current="current" style="padding: 0 30px;cursor: pointer;">
					<a-step @click="changeCurrent(index)" v-for="(item, index) in steps" :key="item.title"
					        :title="item.title"/>
				</a-steps>
				<div v-show="current == 0" style="margin: 20px;">
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">活动信息</span>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
					             v-if="$store.state.corpArr.length > 1">
						<template slot="label">
							<span style="color: red;">*</span>选择企业微信
						</template>
						<template>
							<div style="display: inline-block;cursor: pointer;" @click="changeCorp">
								<img src="../../../assets/WeChatLogo.png"
								     style="width: 24px;margin: -3px 6px 0 0;"/>
								<span>{{corpName}}</span>
								<a-icon type="caret-down"
								        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
								        v-if="currentStatus != 2"/>
							</div>
							<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
						</template>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>选择应用
						</template>
						<template>
							<a-select
									:disabled="currentStatus == 2"
									showSearch
									optionFilterProp="children"
									style="width: 200px;"
									v-model="agent_id" placeholder="请选择应用">
								<template v-for="item in agentList">
									<a-select-option :value="item.id">{{item.name}}
									</a-select-option>
								</template>
							</a-select>
							<span style="color: #F56C6C">（一旦发布，不可更改）</span>
							<div class="content-msg" style="width: 372px;">
								<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a target="_blank"
								                                                                      href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
									企业微信后台</a>创建自建应用。
									<a target="_blank"
								                        href="https://shimo.im/docs/8Jwkjq9KDW6cgkkJ/">
									教程</a>
									</p>
								<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">
									2、选择此应用，请确认已设置过应用的可信域名。
									<a :href="$store.state.commonUrl+'/upload/slider.png'" target="_blank"
									   class="el-link el-link--primary">
										<span class="el-link--inner">查看图示</span>
									</a>
								</p>
							</div>
						</template>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>活动名称
						</template>
						<a-input v-model="title" placeholder="请填写活动名称，限20字符"
						         :maxLength="20"
						         style="width: 375px" :disabled="currentStatus == 2"></a-input>
						<span style="display: inline-block; width: 200px; margin-left: 10px;color: #F56C6C">{{title.length}} / 20（一旦发布，不可修改）</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>活动时间
						</template>
						<a-date-picker
								:disabled="currentStatus == 2"
								:disabledDate="disabledDate"
								v-model='startValue'
								@change="changeStartTime"
								:showTime="{
											        hideDisabledOptions: true,
											        defaultValue: moment('00:00', 'HH:mm'),
											        format:'HH:mm'
											   }"
								format="YYYY-MM-DD HH:mm"
						/>
						~
						<a-date-picker
								:disabledDate="disabledDate"
								v-model='endValue'
								@change="changeEndTime"
								:showTime="{
											        hideDisabledOptions: true,
											        defaultValue: moment('23:59', 'HH:mm'),
											        format:'HH:mm'
											   }"
								format="YYYY-MM-DD HH:mm"
						/>
						<span style="display: inline-block; width: 210px; margin-left: 10px;color: #F56C6C">（一旦发布，只可更改结束时间）</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>活动规则
						</template>
						<a-textarea placeholder="请填写活动规则" auto-size :maxLength="500" v-model="activityRules"
						            style="width: 375px"/>
						<span style="display: inline-block; width: 200px; margin-left: 10px;color: #F56C6C">{{activityRules.length}} / 500</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>联系电话
						</template>
						<a-input style="width: 375px;"
						         v-model="activityPhone" onkeyup="this.value=this.value.replace(/[^0-9-]/g,'')"/>
						<div style="color: #F56C6C;line-height: 20px;">
							（当红包不能准时发放时，客户致电联系商户，可以填写手机号码或是固定电话，如13612345678、0551-6468523格式填入）
						</div>
					</a-form-item>
				</div>
				<div v-show="current == 1" style="margin: 20px;">
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">红包设置</span>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
						<span slot="label">
							<span style="color: red;">*</span>裂变红包金额
						</span>
						<a-input-number :step="0" :precision="2" style="width: 140px;margin-right: 5px;" :min="1"
						                :max="5000.00"
						                v-model="redPacketAmount" :disabled="currentStatus == 2"/>
						元
						<div style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入1.00~5000.00）</div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
						<span slot="label">
							<span style="color: red;">*</span>裂变红包个数
							<a-tooltip
									title="即发起的裂变红包个数，如填写99个，即代表至少有99人发起，同一用户只可发起1场红包裂变。谁先裂变成功，谁先获得裂变红包，若未到活动时间，裂变红包个数已用完，活动将自动结束。">
								<a-icon type="question-circle"/>
							</a-tooltip>
						</span>
						<a-input-number :step="0" :precision="0" style="width: 140px;margin-right: 5px;"
						                v-model="redPacketSum"/>
						个
						<div style="color: #F56C6C;">（一旦发布，只可增加裂变红包个数；红包个数已用完，活动自动结束）</div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
						<span slot="label">
							<span style="color: red;">*</span>用户首次拆领
							<a-tooltip
									title="比如：在活动时间内，设置裂变红包10元，用户首次拆领1元，剩余9元，需要邀请10个好友拆领，即拆即领数额不等的红包。达到裂变人数后，即裂变成功，剩余9元发至用户的微信零钱里。">
								<a-icon type="question-circle"/>
							</a-tooltip>
						</span>
						<a-radio-group name="radioGroup" :value="firstCollarType" @change="changeFirstCollarType"
						               :disabled="currentStatus == 2">
							<a-radio :value="1" style="display: block;height: 35px;line-height: 35px;">按随机金额
								<span v-if="firstCollarType == 1">
									<a-input-number :step="0" :precision="2" style="width: 140px;margin: 0 5px;"
									                :min="0.30" :max="5000.00"
									                v-model="minRandomAmount" :disabled="currentStatus == 2"/>元 ——
									<a-input-number :step="0" :precision="2" style="width: 140px;margin-right: 5px;"
									                :min="0.30" :max="5000.00"
									                v-model="maxRandomAmount" :disabled="currentStatus == 2"/>元
								</span>
							</a-radio>
							<a-radio :value="2" style="display: block;height: 35px;line-height: 35px;">按固定金额
								<span v-if="firstCollarType == 2">
									<a-input-number :step="0" :precision="2" style="width: 140px;margin: 0 5px;"
									                :min="0.30" :max="5000.00"
									                v-model="fixedAmount" :disabled="currentStatus == 2"/>元
								</span>
							</a-radio>
							<a-radio :value="3" style="display: block;height: 35px;line-height: 35px;">按随机金额百分比
								<span v-if="firstCollarType == 3">
									<a-input-number :step="0" :precision="0" style="width: 140px;margin: 0 5px;"
									                :min="1" :max="100"
									                v-model="minRandomAmountPercentage" :disabled="currentStatus == 2"/>% ——
									<a-input-number :step="0" :precision="0" style="width: 140px;margin-right: 5px;"
									                :min="1" :max="100"
									                v-model="maxRandomAmountPercentage" :disabled="currentStatus == 2"/>%
								</span>
							</a-radio>
						</a-radio-group>
						<div style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入0.30~5000.00）</div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
						<template slot="label">
							<span style="color: red;">*</span>裂变人数
						</template>
						邀请
						<a-input-number :step="0" :precision="0" style="width: 140px;margin: 0 5px;"
						                v-model="invitationAmount" :disabled="currentStatus == 2"/>
						位好友拆领红包
						<span style="color: #F56C6C;">（一旦发布，不可修改）</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
						<span slot="label">
							好友助力次数
							<a-tooltip title="在本场活动中，好友给某人助力后，再给其他人助力">
								<a-icon type="question-circle"/>
							</a-tooltip>
						</span>
						<a-input-number
								:disabled="currentStatus == 2"
								style="width: 150px;margin: 0 5px;"
								v-model="help_limit" placeholder="不填，默认为不限制"></a-input-number>
						<span style="color: #01b065;height: 24px;line-height: 24px;">
							<span style="color: #F56C6C">（不填写，则默认为不限制。一旦发布，不可修改）</span>
						</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
						<template slot="label">
							<span style="color: red;">*</span>好友拆领
						</template>
						<a-radio-group name="radioGroup" :value="firendDetachingType"
						               @change="changeFirendDetachingType" :disabled="currentStatus == 2">
							<a-radio :value="1" style="display: block;height: 35px;line-height: 35px;">获得随机金额
								<span v-if="firendDetachingType == 1">
									<a-input-number :step="0" :precision="2" style="width: 140px;margin: 0 5px;"
									                :min="0.30" :max="5000.00"
									                v-model="minFirendRandomAmount" :disabled="currentStatus == 2"/>元 ——
									<a-input-number :step="0" :precision="2" style="width: 140px;margin-right: 5px;"
									                :min="0.30" :max="5000.00"
									                v-model="maxFirendRandomAmount" :disabled="currentStatus == 2"/>元
								</span>
							</a-radio>
							<a-radio :value="2" style="display: block;height: 35px;line-height: 35px;">获得固定金额
								<span v-if="firendDetachingType == 2">
									<a-input-number :step="0" :precision="2" style="width: 140px;margin: 0 5px;"
									                :min="0.30" :max="5000.00"
									                v-model="firendFixedAmount" :disabled="currentStatus == 2"/>元
								</span>
							</a-radio>
						</a-radio-group>
						<div style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入0.30~5000.00）</div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
						<span slot="label">
							<span style="color: red;">*</span>活动总金额
							<a-tooltip title="活动总金额=裂变红包金额X * 个数Y+  裂变红包个数Y* 邀请a个好友 * 随机金额的最大值b（或是固定金额b）">
								<a-icon type="question-circle"/>
							</a-tooltip>
						</span>
						<template v-if="firendDetachingType == 1">
							<span v-if="redPacketAmount == '' || redPacketSum == '' || invitationAmount == '' || maxFirendRandomAmount == ''">计算中...</span>
							<span v-else>{{Math.formatFloat(redPacketAmount * redPacketSum + redPacketSum * invitationAmount * maxFirendRandomAmount, 2)}}</span>
						</template>
						<template v-if="firendDetachingType == 2">
							<span v-if="redPacketAmount == '' || redPacketSum == '' || invitationAmount == '' || firendFixedAmount == ''">计算中...</span>
							<span v-else>{{Math.formatFloat(redPacketAmount * redPacketSum + redPacketSum * invitationAmount * firendFixedAmount, 2)}}</span>
						</template>
						<div style="line-height: 24px;">请保证微信支付商户平台账户余额充足，以免影响活动效果，后果自行承担。<a
								href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
								target="_blank">我要充值</a></div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
						<template slot="label">
							<span style="color: red;">*</span>余下红包发放规则
						</template>
						<div>裂变不成功，余下红包金额数将不再发放。</div>
						<a-radio-group name="radioGroup" :value="sendType"
						               @change="changeSendType" :disabled="currentStatus == 2">
							<a-radio :value="1" style="display: block;height: 35px;line-height: 35px;">活动期间内自动发放
							</a-radio>
							<a-radio :value="2" style="display: block;height: 35px;line-height: 35px;">
								活动结束或裂变红包个数已用完后自动发放
							</a-radio>
						</a-radio-group>
					</a-form-item>
				</div>
				<div v-show="current == 2" style="margin: 20px;">
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">参与限制<span
							style="color: #F56C6C;">（不论是个人拆领红包，还是其好友拆领，无法满足下列要求，均拆领失败）</span></span>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>性别参与
						</template>
						<a-radio-group name="radioGroup" :value="sexType" @change="changeSexType"
						               :disabled="currentStatus == 2">
							<a-radio :value="1">不限制</a-radio>
							<a-radio :value="2">仅男性参与</a-radio>
							<a-radio :value="3">仅女性参与</a-radio>
							<a-radio :value="4">未知</a-radio>
						</a-radio-group>
						<div style="color: #F56C6C;">（一旦发布，不可修改。以在本系统的性别数据为准）</div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<span slot="label">
							<span style="color: red;">*</span>地区参与
							<a-tooltip title="根据用户基本信息接口判断客户所在地区。由于客户可手动修改地理位置，因此不能完全保证客户位置的准确性">
								<a-icon type="question-circle"/>
							</a-tooltip>
						</span>
						<a-radio-group name="radioGroup" :value="areaType" @change="changeAreaType"
						               :disabled="currentStatus == 2">
							<a-radio :value="1">不限制</a-radio>
							<a-radio :value="2">部分地区参与
							</a-radio>
						</a-radio-group>
						<span style="color: #F56C6C;">（一旦发布，可参与的地区只可增加）</span>
						<template v-if="areaType == 2">
							<div v-for="(item,index) in province" :key="index">
								<a-cascader change-on-select
								            :options="cityData"
								            @change="e => changeArea(e,index)"
								            placeholder="请选择地区"
								            style="width: 374px;text-align: left;"
								            :value="item"
								            :disabled="item.disabled"
								/>
								<span v-if="index == province.length - 1"
								      style="color: #01b065;margin-left: 10px;cursor: pointer;"
								      @click="addArea">添加</span>
								<span v-if="!item.disabled && province.length > 1"
								      style="color: #01b065;margin-left: 10px;cursor: pointer;"
								      @click="delArea(index)">删除</span>
							</div>
						</template>
					</a-form-item>
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">客户标签<span
							style="color: #F56C6C;">（不论邀请人，还是助力者，只要参与该场活动，则自动打上选中的客户标签）</span></span>
					<a-divider/>
					<div class="current0 ant-col-20">
						<corpChooseTag :callback="modalVisibleChange2" :hasChoose="tag_arr"
						               v-if="isShowTag"></corpChooseTag>
					</div>
				</div>
				<div v-show="current == 3" style="margin: 20px;">
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">海报设置</span>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label">
							海报图片
						</template>
						<a-upload
								action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								:showUploadList="false"
								:beforeUpload="beforeUpload"
						>
							<div v-if="!back_pic_url">
								<a-button>
									<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
									上传海报
								</a-button>
							</div>
							<img v-if="back_pic_url" style="max-width: 128px; max-height: 128px;"
							     :src="commonUrl + back_pic_url"/>
							<div style="display: inline-block;vertical-align: bottom;margin-left: 5px;"
							     v-if="back_pic_url">
								<a-button>
									<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
									重新上传
								</a-button>
							</div>
							<div style="margin-top: 10px;">
								图片像素建议为1080px*1920px，格式为jpg、bmp、png，大小不超过2M
							</div>
						</a-upload>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label">
							头像
						</template>
						<a-switch :checked="is_avatar" @click="changeAdatar"/>
						<div style="display: inline-block;" v-if="is_avatar">
							<a-button @click="changeShape('circle')"
							          :class="shape== 'circle' ? 'shape-active' : '' "
							          style="margin-left: 40px;display: inline-block;"
							>
								圆型
							</a-button>
							<a-button @click="changeShape('square')"
							          :class="shape== 'square' ? 'shape-active' : '' "
							          style="margin-left: 10px;display: inline-block;"
							>
								方形
							</a-button>
						</div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label">
							昵称
						</template>
						<div style="display: inline-block; vertical-align: top;">
							<a-switch :checked="is_nickname" @click="changeNickName"/>
						</div>
						<div style="display: inline-block;margin-left: 40px" v-if="is_nickname">
							<div>颜色
								<template>
									<a-popover
											trigger="click"
											placement="right"
									>
										<color-picker slot="content" v-model="color"></color-picker>
										<div style="display: inline-block;" class="color-box">
												<span class="color-show"
												      :style="{'background-color': fcRemark()}"></span>
										</div>
									</a-popover>
								</template>
							</div>
						</div>
						<div style="display: inline-block;margin-left: 40px" v-if="is_nickname">
							<div style="text-align: center">大小
								<a-select
										showSearch
										style="width: 70px;margin-bottom: 20px;"
										@change="changeNickNameFontSize"
										v-model="font_size"
								>
									<a-select-option value="12">12</a-select-option>
									<a-select-option value="14">14</a-select-option>
									<a-select-option value="16">16</a-select-option>
									<a-select-option value="18">18</a-select-option>
									<a-select-option value="20">20</a-select-option>
									<a-select-option value="22">22</a-select-option>
									<a-select-option value="24">24</a-select-option>
								</a-select>
							</div>
						</div>
						<div style="display: inline-block;vertical-align: top; margin-left: 40px"
						     v-if="is_nickname">
							<a-button @click="changeAlign('left')"
							          :class="align== 'left' ? 'shape-active' : '' "
							          style="margin-left: 10px;display: inline-block;"
							>
								左对齐
							</a-button>
							<a-button @click="changeAlign('center')"
							          :class="align== 'center' ? 'shape-active' : '' "
							          style="margin-left: 10px;display: inline-block;"
							>
								居中
							</a-button>
							<a-button @click="changeAlign('right')"
							          :class="align== 'right' ? 'shape-active' : '' "
							          style="margin-left: 10px;display: inline-block;"
							>
								右对齐
							</a-button>
						</div>
					</a-form-item>
				</div>
				<div v-show="current == 4" style="margin: 20px;">
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">引流设置<span
							style="color: #F56C6C;">（海报二维码自带对应参数，扫码后会将客户引流至对应的企业成员）</span></span>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label"><span
								style="color: red">*</span>引流成员
						</template>
						<a-button style="margin-left: 10px;" @click="showDepartmentList">
							选择
						</a-button>
						<span style="margin-left: 5px"
						      v-show="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
						<a style="margin-left: 10px;" v-show="chooseNum > 0"
						   @click="clearDepartmentList">
							重置
						</a>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							设置欢迎语
						</template>
						<div>客户通过海报添加对应微信后，可自动发送设置的内容<span style="color: #F56C6C"></span></div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							文本
						</template>
						<editor v-if="editorFlag" :text="textContent"
						        :textValue="textAreaValueHeader"
						        :isEmoji="false"
						        @changeText="changeText">
						</editor>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							图文
						</template>
						<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<template slot="label">
								<span style="color: red;">*</span>图片封面
							</template>
							<a-upload
									name="avatar"
									listType="picture-card"
									class="avatar-uploader link_pic_url_style"
									:showUploadList="false"
									action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
									:beforeUpload="beforeUpload"
							>
								<img v-if="link_pic_url != ''" :src="commonUrl + link_pic_url" alt="avatar"
								     style="max-width: 78px;height: 78px;"/>
								<div v-else>
									<a-icon :type="loading ? 'loading' : 'plus'" style="font-size:32px;"/>
								</div>
							</a-upload>
							<div style="color: #999;font-size: 13px;line-height: 13px;">
								（图片大小不超过2M，支持JPG、JPEG及PNG格式）
							</div>
						</a-form-item>
						<!-- 填写标题 -->
						<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<template slot="label"><span
									style="color: red">*</span>填写标题
							</template>
							<a-input v-model="link_start_title" style="max-width: 500px;"
							         :maxLength="32">
								<span slot="suffix"><span>{{link_start_title.length}}</span>/32</span>
							</a-input>
						</a-form-item>
						<!-- 添加描述 -->
						<a-form-item class="current0" style="margin-top: 10px;" :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							<span slot="label">
							添加描述
						</span>
							<div>
								<a-textarea style="max-width: 500px;" placeholder="填写图文描述" v-model="link_desc"
								            :maxLength="128" :rows="4"/>
							</div>
							<div style="max-width: 500px; text-align: right">
								<span>{{link_desc.length}}</span>/128
							</div>
						</a-form-item>
					</a-form-item>
				</div>
			</div>
			<div class="steps-action">
				<a-button v-if="current>0" @click="prev">
					上一步
				</a-button>
				<a-button v-if="current < steps.length - 1" style="margin-left: 8px;" type="primary" @click="next">
					下一步
				</a-button>
				<a-button style="margin-left: 8px"
				          :loading="createLoading"
				          v-if="current == steps.length - 1"
				          type="primary"
				          @click="createActivity"
				>
					提交
				</a-button>
			</div>
		</div>
		<!-- 企业微信选择弹窗 -->
		<WeChatModal :show="showModal2" :callback="modalVisibleChange" hasName="raffle-add"></WeChatModal>
		<!-- 选择部门成员弹窗 -->
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum" :is_from="7"
		                  :callback="modalVisibleChange3"></chooseDepartment>
	</div>
</template>

<script>
	import img1 from '../../../assets/redFissionPreview.png'
	import WeChatModal from "@/components/WeChatModal.vue"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import moment from 'moment';
	import VueDraggableResizable from 'vue-draggable-resizable'
	import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
	import {Sketch} from "vue-color";
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import cityData from "../../../common/js/TencentAddress.js";
	import TemplateList from "../template/List";
	import editor from '../../../components/editor/index'

	Math.formatFloat = function (f, digit) {
		var m = Math.pow(10, digit);
		return parseInt(f * m, 10) / m;
	}

	export default {
		name      : "add",
		components: {
			TemplateList,
			WeChatModal, chooseDepartment,
			"vue-draggable-resizable": VueDraggableResizable,
			"color-picker"           : Sketch, corpChooseTag, editor
		},
		data () {
			return {
				current                  : 0, // 步骤index
				commonUrl                : this.$store.state.commonUrl,
				steps                    : [  // 步骤名
					{
						title: '活动设置',
					},
					{
						title: '规则设置',
					},
					{
						title: '高级设置',
					},
					{
						title: '海报设置',
					},
					{
						title: '欢迎语设置',
					}
				],
				mobileImg                : img1,//左侧可视化图片
				showModal2               : false,// 企业微信弹窗
				corpName                 : localStorage.getItem("corpName"),
				corpId                   : localStorage.getItem("corpId"),
				// 应用id
				agent_id                 : [],
				agentList                : [], // 应用列表
				//活动名称
				title                    : '',
				//活动时间
				startValue               : null,
				endValue                 : null,
				start_time               : '',
				end_time                 : '',
				endOpen                  : false,
				//活动规则
				activityRules            : '',
				//联系电话
				activityPhone            : '',
				//规则设置
				redPacketAmount          : 10,//裂变红包金额
				redPacketSum             : 10,//裂变红包个数
				//用户首次拆领
				firstCollarType          : 2,//用户首次拆领类型
				minRandomAmount          : '',//最小随机金额
				maxRandomAmount          : '',//最大随机金额
				fixedAmount              : 1,//固定金额
				minRandomAmountPercentage: '',//最小随机金额百分比
				maxRandomAmountPercentage: '',//最大随机金额百分比
				invitationAmount         : 3,//裂变人数数量
				help_limit               : '',// 好友助力次数
				//好友拆领
				firendDetachingType      : 2,//好友拆领类型
				minFirendRandomAmount    : '',//最小随机金额
				maxFirendRandomAmount    : '',//最大随机金额
				firendFixedAmount        : 1,//固定金额
				sendType                 : 1,//发送红包类型
				//高级设置
				sexType                  : 1,//性别参与
				areaType                 : 1,//地区参与
				// 地域
				cityData,
				province                 : [
					[]
				],
				tag_arr                  : [], //标签值
				isShowTag                : false,


				//海报设置
				loading     : false, // 上传图片的loading
				back_pic_url: '/static/image/raffle/redFissionPoster.png',//海报背景图
				is_avatar   : true, // 头像选择按钮
				avatar      : {
					w: 39,
					x: 18,
					y: 270
				}, // 头像大小位置
				nickName    : {
					w: 84,
					h: 28,
					x: 65,
					y: 267
				}, // 昵称大小位置
				qrCode      : {
					w: 60,
					x: 183,
					y: 265
				}, // 二维码大小位置
				shape       : "circle", // circle圆形 square方形
				is_nickname : true, // 昵称选择按钮
				color       : '#FFFFFF', // 颜色
				font_size   : 12, // 大小
				align       : 'left', // 对齐方式
				backHeight  : 330, // 海报图片区域高度
				menuKey     : 1, // 改变海报图片时强制渲染页面


				//欢迎语设置
				chooseNum          : 0, // 部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				showModalDepartment: false, // 选择成员弹窗
				user               : [],//选择成员数组
				link_pic_url       : '/static/image/raffle/redFissionShare.png',//图片封面
				link_start_title   : '独乐乐不如众乐乐，一起快来拆红包，领钱吧！',//标题
				link_desc          : '好友，快来拆红包，领钱啦~~',//描述
				createLoading      : false, // 活动创建按钮loading
				id                 : '',//修改时的id
				currentStatus      : '',//修改时发布状态，1发布中
				//文本
				editorFlag         : false,
				textAreaValueHeader: '您已参与【活动名称】，打开下方活动链接，赶紧召唤好友拆红包，一起来领红包哦~',
				textContent        : '您已参与【活动名称】，打开下方活动链接，赶紧召唤好友拆红包，一起来领红包哦~',
				mediumEditor       : '',
				options            : {
					toolbar      : false,
					placeholder  : {
						text: ""
					},
					anchorPreview: false,
					paste        : {
						forcePlainText : true,
						cleanPastedHTML: true,
						cleanAttrs     : ['class', 'style', 'dir', 'align', 'width', 'height', 'face', 'title', 'code', 'name', 'id', 'type', 'span', 'border', 'open', 'action', 'method', 'cols', 'for', 'rel', 'label', 'icon', 'value', 'max', 'min', 'classid']
					}
				},
				redFissionNum: Number(this.$store.state.packageDetail.redFissionNum),//红包裂变人数上限数
			}
		},
		methods   : {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/redFission/list?isRefresh=1")
			},
			onChange () {
			},
			//欢迎语设置
			// 重置
			clearDepartmentList () {
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.$refs.user.rightIdList = []
				this.$refs.user.rightList = []
			},
			// 选择成员
			showDepartmentList () {
				let arr = []
				this.user.map(x=>{
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
			},

			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.user = JSON.parse(JSON.stringify(list))
					} else {
						this.user = []
					}
				}
				this.showModalDepartment = false
			},

			changeCurrent (index) {
				this.current = index
			},
			// 改变企业微信
			changeCorp () {
				if (this.id) {
					return
				}
				this.showModal2 = true
			},
			modalVisibleChange (type, corpId, corpName) {
				if (type == 'ok') {
					this.corpName = corpName
					this.corpId = corpId
					this.$refs.user.staffList = []
					this.$refs.user.keyList = []
				}
				this.showModal2 = false
			},
			//获取应用列表
			async getAgentList (id) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.corpId,
					suite_id  : 1,
					agent_type: 2
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.agentList = res.data
					if (id) {
						this.agent_id = id
					} else {
						if (this.agentList.length > 0) {
							this.agent_id = this.agentList[0].id
						}
					}
					this.isShowTag = true
				}
			},
			//活动时间
			moment,
			disabledDate (current) {
				// Can not select days before today and today
				return current && current < moment().startOf('day');
			},
			changeStartTime (date, dateString) {
				if (dateString && this.startDate && dateString > moment(this.endDate).format("YYYY-MM-DD HH:mm:ss")) {
					this.$message.warning('开始时间不能晚于结束时间')
				}
				if (dateString) {
					this.startValue = date
				} else {
					this.startValue = null
				}
				this.start_time = dateString
			},
			changeEndTime (date, dateString) {
				if (dateString && this.startDate && dateString < moment(this.startDate).format("YYYY-MM-DD HH:mm:ss")) {
					this.$message.warning('结束时间不能早于开始时间')
				}
				if (dateString) {
					this.endValue = date
				} else {
					this.endValue = null
				}
				this.end_time = dateString
			},
			//活动海报
			beforeUpload (file) {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					this.$message.error('海报仅支持jpg、jpeg、png格式！');
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('图片大小不超过2M');
					return false
				}
				if (this.current == 3) {
					this.uploadImage(file, 3)
				} else if (this.current == 4) {
					this.uploadImage(file, 4)
				}
			},
			// 上传
			async uploadImage (file, type) {
				this.loading = true
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				param.append("fileInfo", file);
				const {data: res} = await this.axios.post("sub-user/upload-image", param);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.loading = false
				} else {
					if (type == 3) {
						this.back_pic_url = res.data.local_path
						this.posterBackHeight()
					} else if (type == 4) {
						this.link_pic_url = res.data.local_path
					}
					this.loading = false
				}
			},
			posterBackHeight () {
				let that = this
				let img = new Image()
				img.src = this.commonUrl + this.back_pic_url
				img.onload = function () {
					that.backHeight = img.height / (img.width / 250) < 330 ? 330 : img.height / (img.width / 250)
					if (that.avatar.y > that.backHeight) {
						that.avatar.y = that.backHeight - that.avatar.w
					}
					if (that.nickName.y > that.backHeight) {
						that.nickName.y = that.backHeight - that.nickName.h
					}
					if (that.qrCode.y > that.backHeight) {
						that.qrCode.y = that.backHeight - that.qrCode.w
					}
					++that.menuKey
				}
			},
			//海报设置
			// 头像是否显示
			changeAdatar (value) {
				this.is_avatar = value
			},
			// 头像形状
			changeShape (type) {
				this.shape = type
			},
			// 昵称是否显示
			changeNickName (value) {
				this.is_nickname = value
			},
			// 样式
			fcRemark () {
				if (typeof this.color.hex != "undefined") {
					this.color = this.color.hex
				}
				return this.color;
			},
			// 昵称文字大小
			changeNickNameFontSize (font_size) {
				this.font_size = font_size
			},
			// 昵称文字格式
			changeAlign (align) {
				this.align = align
			},
			// 头像大小
			onResizeAvatar: function (x, y, w, h) {
				this.avatar.x = x
				this.avatar.y = y
				if (w > h) {
					h = w
				} else {
					w = h
				}
				this.avatar.w = parseInt(w)
			},
			// 移动头像
			onDragAvatar  : function (x, y) {
				this.avatar.x = x
				this.avatar.y = y
			},
			// 移动昵称
			onDragNickName (x, y) {
				this.nickName.x = x
				this.nickName.y = y
			},
			// 昵称宽度
			nickNameWidth () {
				this.nickName.w = parseInt(this.font_size) * 6
				return parseInt(this.font_size) * 6
			},
			// 昵称高度
			nickNameHeight () {
				return parseInt(this.font_size) * 2
			},
			// 昵称样式
			nickNameStyle () {
				let style = {
					fontSize  : this.font_size + 'px',
					color     : this.color,
					lineHeight: (parseInt(this.font_size) * 2 - 4) + 'px'
				}
				if (this.align) {
					style['textAlign'] = this.align
				}
				return style
			},
			// 移动二维码
			onDragQrcode (x, y) {
				this.qrCode.x = x
				this.qrCode.y = y
			},
			// 二维码大小
			onResizeQrcode (x, y, w, h) {
				this.qrCode.x = x
				this.qrCode.y = y
				if (w > h) {
					h = w
				} else {
					w = h
				}
				this.qrCode.w = parseInt(w)
			},

			//修改用户首次拆领类型
			changeFirstCollarType (e) {
				this.firstCollarType = e.target.value
			},
			//修改好友拆领类型
			changeFirendDetachingType (e) {
				this.firendDetachingType = e.target.value
			},
			//修改性别参与类型
			changeSexType (e) {
				this.sexType = e.target.value
			},
			//修改地区参与类型
			changeAreaType (e) {
				this.areaType = e.target.value
				this.province = [
					[]
				]
			},
			//修改发送红包类型
			changeSendType (e) {
				this.sendType = e.target.value
			},
			// 地域
			changeArea (value, index) {
				this.$set(this.province, index, value)
				this.$forceUpdate()
				// this.province[index] = value
			},
			addArea () {
				let arr = []
				this.province.push(arr)
			},
			delArea (index) {
				this.province.splice(index, 1)
			},
			//客户标签
			modalVisibleChange2 (event, str) {
				if (event == "ok") {
					this.tag_arr = str.split(',')
				}
			},
			// 下一步
			next () {
				if (this.checkout(this.current)) {
					this.current++;
				}
			},
			checkout (current) {
				if (current == 0) {
					if (typeof this.agent_id == 'object' && this.agent_id.length == 0) {
						this.$message.warning("请选择应用")
						return false
					}
					if (this.title == '') {
						this.$message.warning("请填写活动名称")
						return false
					}
					if (this.startValue == null || this.endValue == null) {
						this.$message.warning("请检查活动时间")
						return false
					}
					if (this.start_time > this.end_time) {
						this.$message.warning("开始时间不能大于结束时间")
						return false
					}
					if (this.end_time < moment(new Date()).format("YYYY-MM-DD HH:mm:ss")) {
						this.$message.warning("结束时间不能早于当前时间")
						return false
					}
					if (this.activityRules == '') {
						this.$message.warning("请填写活动规则")
						return false
					}
					let reg = /^1\d{10}$/
					let reg2 = /^0\d{2,3}-?\d{7,8}$/
					if (this.activityPhone == '') {
						this.$message.warning("请填写联系电话")
						return false
					} else {
						if (!reg.test(this.activityPhone) && !reg2.test(this.activityPhone)) {
							this.$message.warning("请填写正确的联系电话")
							return false
						}
					}
				}
				if (current == 1) {
					if (this.redPacketAmount == '' || this.redPacketAmount == null) {
						this.$message.warning("请填写红包金额")
						return false
					} else {
						if (Number(this.redPacketAmount) < 1 || Number(this.redPacketAmount) > 5000) {
							this.$message.warning("红包金额必须在1.00~5000.00之间")
							return false
						}
					}
					if (this.redPacketSum == '' || this.redPacketSum == null) {
						this.$message.warning("请填写红包个数")
						return false
					} else {
						if (Number(this.redPacketSum <= 0) || Number(this.redPacketSum > 999999999)) {
							this.$message.warning("红包个数必须在1~999999999之间")
							return false
						}
					}
					if (this.firstCollarType == 1) {
						if (this.minRandomAmount == '' || this.minRandomAmount == null) {
							this.$message.warning("请填写随机金额最小值")
							return false
						} else {
							if (Number(this.minRandomAmount) < 0.30 || Number(this.minRandomAmount) > 5000) {
								this.$message.warning("用户首次拆领红包金额必须在0.30~5000.00之间且必须小于裂变红包金额")
								return false
							}
							if (Number(this.minRandomAmount) >= Number(this.redPacketAmount)) {
								this.$message.warning("用户首次拆领红包金额必须在0.30~5000.00之间且必须小于裂变红包金额")
								return false
							}
						}
						if (this.maxRandomAmount == '' || this.maxRandomAmount == null) {
							this.$message.warning("请填写随机金额最大值")
							return false
						} else {
							if (Number(this.maxRandomAmount) < 0.30 || Number(this.maxRandomAmount) > 5000) {
								this.$message.warning("用户首次拆领红包金额必须在0.30~5000.00之间且必须小于裂变红包金额")
								return false
							}
							if (Number(this.maxRandomAmount) >= Number(this.redPacketAmount)) {
								this.$message.warning("用户首次拆领红包金额必须在0.30~5000.00之间且必须小于裂变红包金额")
								return false
							}
						}
						if (Number(this.maxRandomAmount) <= Number(this.minRandomAmount)) {
							this.$message.warning("用户首次拆领随机金额最大值必须大于最小值")
							return false
						}
						if (Number(this.redPacketAmount) - Number(this.maxRandomAmount) < 0.3) {
							this.$message.warning("用户首次拆后剩余金额不能小于0.30")
							return false
						}
					} else if (this.firstCollarType == 2) {
						if (this.fixedAmount == '' || this.fixedAmount == null) {
							this.$message.warning("请填写固定金额")
							return false
						} else {
							if (Number(this.fixedAmount) < 0.30 || Number(this.fixedAmount) > 5000) {
								this.$message.warning("用户首次拆领红包金额必须在0.30~5000.00之间且必须小于裂变红包金额")
								return false
							}
							if (Number(this.fixedAmount) >= Number(this.redPacketAmount)) {
								this.$message.warning("用户首次拆领红包金额必须在0.30~5000.00之间且必须小于裂变红包金额")
								return false
							}
						}
						if (Number(this.redPacketAmount) - Number(this.fixedAmount) < 0.3) {
							this.$message.warning("用户首次拆后剩余金额不能小于0.30")
							return false
						}
					} else if (this.firstCollarType == 3) {
						if (this.minRandomAmountPercentage == '' || this.minRandomAmountPercentage == null) {
							this.$message.warning("请填写随机金额百分比最小值")
							return false
						} else {
							if (Number(this.minRandomAmountPercentage) * Number(this.redPacketAmount) < 30) {
								this.$message.warning("用户首次拆领红包金额必须在0.30~5000.00之间")
								return false
							}
						}
						if (this.maxRandomAmountPercentage == '' || this.maxRandomAmountPercentage == null) {
							this.$message.warning("请填写随机金额百分比最大值")
							return false
						} else {
							if (Number(this.maxRandomAmountPercentage) < 1 || Number(this.maxRandomAmountPercentage) >= 100) {
								this.$message.warning("用户首次拆领红包金额百分比最大值必须小于100")
								return false
							}
						}
						if (Number(this.maxRandomAmountPercentage) <= Number(this.minRandomAmountPercentage)) {
							this.$message.warning("用户首次拆领红包金额百分比最大值必须大于最小值")
							return false
						}
						if (Number(this.minRandomAmountPercentage) * Number(this.redPacketAmount) < 30) {
							this.$message.warning("用户首次拆领红包金额必须在0.30~5000.00之间")
							return false
						}
						if (Number(this.redPacketAmount) * 100 - Number(this.redPacketAmount) * Number(this.maxRandomAmountPercentage) < 30) {
							this.$message.warning("用户首次拆后剩余金额不能小于0.30")
							return false
						}
					}
					if (this.invitationAmount == '' || this.invitationAmount == null) {
						this.$message.warning("请填写裂变人数")
						return false
					}
					if (this.firendDetachingType == 1) {
						if (this.minFirendRandomAmount == '' || this.minFirendRandomAmount == null) {
							this.$message.warning("请填写好友拆领随机金额最小值")
							return false
						} else {
							if (Number(this.minFirendRandomAmount) < 0.3 || Number(this.minFirendRandomAmount) > 5000) {
								this.$message.warning("好友拆领随机红包金额必须在0.30~5000.00之间")
								return false
							}
						}
						if (this.maxFirendRandomAmount == '' || this.maxFirendRandomAmount == null) {
							this.$message.warning("请填写好友拆领随机金额最大值")
							return false
						} else {
							if (Number(this.maxFirendRandomAmount) < 0.3 || Number(this.maxFirendRandomAmount) > 5000) {
								this.$message.warning("好友拆领随机红包金额必须在0.30~5000.00之间")
								return false
							}
						}
						if (Number(this.maxFirendRandomAmount) <= Number(this.minFirendRandomAmount)) {
							this.$message.warning("好友拆领随机红包金额最大值必须大于最小值")
							return false
						}
					} else if (this.firendDetachingType == 2) {
						if (this.firendFixedAmount == '' || this.firendFixedAmount == null) {
							this.$message.warning("请填写好友拆领固定金额")
							return false
						} else {
							if (Number(this.firendFixedAmount) < 0.3 || Number(this.firendFixedAmount) > 5000) {
								this.$message.warning("好友拆领固定红包金额必须在0.30~5000.00之间")
								return false
							}
						}
					}
				}
				if (current == 2) {
					if (this.areaType == 2) {
						let isEmpty = true
						for (let i = 0; i < this.province.length; i++) {
							if (this.province[i].length > 0) {
								isEmpty = false
							}
						}
						if (isEmpty) {
							this.$message.warning("请选择地区")
							return false
						}
					}
				}
				if (current == 4) {
					if (this.user.length == 0) {
						this.$message.warning("请选择引流成员")
						return false
					}
					if (this.link_pic_url == '') {
						this.$message.warning("请选择欢迎语图片封面")
						return false
					}
					if (this.link_start_title == '') {
						this.$message.warning("请填写欢迎语标题")
						return false
					}
				}
				return true
			},
			// 上一步
			prev () {
				this.current--;
			},
			//欢迎语文本
			changeText (text, textVale) {
				this.textContent = text
				this.textAreaValueHeader = textVale
			},
			//提交
			async createActivity () {
				this.createLoading = true
				if (!this.checkout(0)) {
					this.createLoading = false
					this.current = 0
					return false
				}
				if (!this.checkout(1)) {
					this.createLoading = false
					this.current = 1
					return false
				}
				if (!this.checkout(2)) {
					this.createLoading = false
					this.current = 2
					return false
				}
				if (!this.checkout(4)) {
					this.createLoading = false
					this.current = 4
					return false
				}

				for (let i = this.province.length - 1; i >= 0; i--) {
					if (this.province[i].length === 0) {
						this.province.splice(i, 1)
					}
				}

				let total_amount = 0
				if (this.firendDetachingType == 1) {
					total_amount = Math.formatFloat(this.redPacketAmount * this.redPacketSum + this.redPacketSum * this.invitationAmount * this.maxFirendRandomAmount, 2)
				} else if (this.firendDetachingType == 2) {
					total_amount = Math.formatFloat(this.redPacketAmount * this.redPacketSum + this.redPacketSum * this.invitationAmount * this.firendFixedAmount, 2)
				}

				const {data: res} = await this.axios.post("red-pack/add", {
					corp_id                 : this.corpId,
					agent_id                : this.agent_id,
					uid                     : localStorage.getItem('uid'),
					id                      : this.id,
					title                   : this.title,
					start_time              : this.start_time,
					end_time                : this.end_time,
					activity_rule           : this.activityRules,
					contact_phone           : this.activityPhone,
					redpack_price           : this.redPacketAmount,
					redpack_num             : this.redPacketSum,
					first_detach_type       : this.firstCollarType,
					min_random_amount       : this.minRandomAmount,
					max_random_amount       : this.maxRandomAmount,
					fixed_amount            : this.fixedAmount,
					min_random_amount_per   : this.minRandomAmountPercentage,
					max_random_amount_per   : this.maxRandomAmountPercentage,
					invite_amount           : this.invitationAmount,
					friend_detach_type      : this.firendDetachingType,
					min_friend_random_amount: this.minFirendRandomAmount,
					max_friend_random_amount: this.maxFirendRandomAmount,
					fixed_friend_amount     : this.firendFixedAmount,
					total_amount            : total_amount,
					send_type               : this.sendType,
					sex_type                : this.sexType,
					area_type               : this.areaType,
					area_data               : this.province,
					tag_ids                 : this.tag_arr.join(),
					back_pic_url            : this.back_pic_url,
					is_avatar               : this.is_avatar,
					avatar                  : this.avatar,
					nickName                : this.nickName,
					qrCode                  : this.qrCode,
					shape                   : this.shape,
					is_nickname             : this.is_nickname,
					color                   : this.color,
					font_size               : this.font_size,
					align                   : this.align,
					user                    : this.user,
					text_content            : this.textContent,
					link_title              : this.link_start_title,
					link_desc               : this.link_desc,
					link_pic_url            : this.link_pic_url,
					help_limit              : this.help_limit
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.createLoading = false
				} else {
					this.createLoading = false
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					if (this.id == '') {
						this.$router.push("/redFission/list")
					} else {
						this.$router.push("/redFission/list?isRefresh=1")
					}
				}
			},
			// 编辑获取详情
			async getDetail () {
				const {data: res} = await this.axios.post("red-pack/edit-info", {
					id : this.id,
					uid: localStorage.getItem('uid'),
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.currentStatus = res.data.status
					this.corpId = res.data.corp_id
					this.corpName = res.data.corp_name
					this.agent_id = String(res.data.agent_id)
					this.getAgentList(this.agent_id)
					this.title = res.data.title
					this.start_time = res.data.start_time
					this.end_time = res.data.end_time
					this.startValue = moment(this.start_time)
					this.endValue = moment(this.end_time)
					this.activityRules = res.data.activity_rule
					this.activityPhone = res.data.contact_phone
					this.redPacketAmount = res.data.redpack_price
					this.redPacketSum = res.data.redpack_num
					this.firstCollarType = res.data.first_detach_type
					this.minRandomAmount = res.data.min_random_amount
					this.maxRandomAmount = res.data.max_random_amount
					this.fixedAmount = res.data.fixed_amount
					this.minRandomAmountPercentage = res.data.min_random_amount_per
					this.maxRandomAmountPercentage = res.data.max_random_amount_per
					this.invitationAmount = res.data.invite_amount
					this.help_limit = res.data.help_limit
					this.firendDetachingType = res.data.friend_detach_type
					this.minFirendRandomAmount = res.data.min_friend_random_amount
					this.maxFirendRandomAmount = res.data.max_friend_random_amount
					this.firendFixedAmount = res.data.fixed_friend_amount
					this.sendType = res.data.send_type
					this.sexType = res.data.sex_type
					this.areaType = res.data.area_type
					this.province = res.data.area_data
					this.province.map(x => {
						if (this.currentStatus != 1) {
							x.disabled = true
						}
					})

					if (res.data.tag_ids.length > 0) {
						res.data.tag_ids.map((tagId) => {
							this.tag_arr.push(String(tagId));
						})
					}
					this.isShowTag = true

					this.back_pic_url = res.data.back_pic_url
					this.is_avatar = res.data.is_avatar
					this.avatar = res.data.avatar
					this.nickName = res.data.nickName
					this.qrCode = res.data.qrCode
					this.shape = res.data.shape
					this.is_nickname = res.data.is_nickname
					this.color = res.data.color
					this.font_size = res.data.font_size
					this.align = res.data.align

					this.posterBackHeight()

					this.user = res.data.user
					this.chooseNum = res.data.user.length
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					this.user.map(x=>{
						if(x.scopedSlots.title == 'custom'){
							this.chooseUserNum++
						}else if(x.scopedSlots.title == 'title'){
							this.chooseDepartmentNum++
						}
					})

					this.textContent = res.data.text_content
					this.textAreaValueHeader = res.data.text_content.replace(/{nickname}/g,
						'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>'
					).replace(/\n/g, '<br>')
					this.editorFlag = true
					this.link_start_title = res.data.link_title
					this.link_desc = res.data.link_desc
					this.link_pic_url = res.data.link_pic_url
				}
			},
		},
		mounted () {
			if (typeof this.$route.query.id != 'undefined') {
				this.id = this.$route.query.id
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/redFission/list')
				this.getDetail()
			} else {
				this.editorFlag = true
				this.getAgentList()
			}
		}

	}
</script>

<style lang="less" scoped>
	@import '../../../style/_style.less';

	.current0 {
		margin-bottom: 1.5%;
	}

	.fission-add {
		position: absolute;
		width: 100%;
		height: calc(100% - 20px);
		/*overflow-y: auto;*/
	}

	.fission-content {
		width: calc(100% - 40px);
		height: calc(100% - 180px);
		background-color: #FAFAFA;
		margin: 0 auto;
		margin-top: 20px;
		overflow-y: hidden;
	}

	.steps-content {
		border-radius: 6px;
		height: 100%;
		padding: 20px;
		overflow-y: auto;
		position: relative;
	}

	.steps-action {
		position: fixed;
		bottom: 0px;
		left: 50%;
		transform: translate(-50%, 0%);
		height: 60px;
		line-height: 60px;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-steps-item-icon {
		width: 28px !important;
		height: 28px !important;
	}

	/deep/ .ant-steps-item-icon > .ant-steps-icon {
		top: -3px !important;
	}

	/deep/ .ant-steps-item-title {
		font-size: 14px !important;
	}

	.img-left {
		float: left;
		width: 379px;
		height: calc(100% - 40px);
		margin: 20px;
		overflow: auto;
	}

	.logo-style /deep/ .ant-upload.ant-upload-select-picture-card {
		width: 64px;
		height: 64px;
		overflow: hidden;
		float: left;
	}

	.link_pic_url_style /deep/ .ant-upload.ant-upload-select-picture-card {
		width: 96px;
		height: 96px;
		overflow: hidden;
		float: left;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card {
		width: 375px;
		height: 216px;
		overflow: hidden;
	}

	/deep/ .ant-divider-horizontal {
		margin: 12px 0 24px 0;
	}

	/deep/ .ant-col-20 {
		margin-left: 20px;
		width: calc(83.33333333% - 20px);
	}

	/deep/ .ant-col-19 {
		margin-left: 20px;
		width: calc(78.33333333% - 20px);
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
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

	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
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

	.shape-active {
		background-color: #01b065;
		color: #FFFFFF;
	}

	.radus {
		border-radius: 50%;
	}

	/deep/ .ant-popover .ant-popover-message > .anticon {
		display: none !important;
	}

	.color-show {
		width: 20px;
		height: 20px;
		display: inline-block;
		margin: 0 10px;
		vertical-align: sub;
		border: 1px solid #BFBFBF;
	}

	/deep/ .ant-popover-inner-content {
		padding: 0 !important;
	}

	.page-content {
		width: 250px;
		height: 330px;
		position: absolute;
		/*background-color: #F5F5F5;*/
	}

	.content-msg {
		font-size: 13px;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

	/deep/ .ant-upload-picture-card-wrapper {
		width: auto;
	}

	/deep/ .ant-tag {
		margin-right: 5px;
		height: 26px;
		line-height: 25px;
	}

</style>
