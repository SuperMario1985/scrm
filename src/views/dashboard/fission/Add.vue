<template>
	<div class="fission-add">
		<a-card style="margin-bottom:20px;padding:10px 20px;">
			<label style="font-size: 16px;line-height: 32px;">
				<span v-if="activity.id == ''">新建</span>
				<span v-else>编辑</span>裂变引流</label>
			<a-button type="primary" icon="rollback" style="font-size: 14px;float: right;" @click="goBack">返回列表
			</a-button>
		</a-card>
		<div class="fission-content">
			<a-steps :current="current" style="padding: 0 30px;cursor: pointer;">
				<a-step @click="changeCurrent(index)" v-for="(item, index) in steps" :key="item.title"
				        :title="item.title"/>
			</a-steps>
			<div class="steps-content">
				<div v-show="current == 0" style="margin: 20px;">
					<a-form-item class="current0" v-if="$store.state.corpArr.length > 1"
					             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label"><span
								style="color: red">*</span>选择企业微信
						</template>
						<template>
							<div style="display: inline-block;cursor: pointer;" @click="changeCorp">
								<img src="../../../assets/WeChatLogo.png"
								     style="width: 24px;margin: -3px 6px 0 0;"/>
								<span>{{corpName}}</span>
								<a-icon type="caret-down"
								        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
								        v-if="!activity.id"/>
							</div>
							<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
						</template>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label"><span
								style="color: red">*</span>选择应用
						</template>
						<template>
							<!--												@change="changeApp"-->
							<a-select
									:disabled="!!activity.id && (status != 1 || status == '')"
									showSearch
									optionFilterProp="children"
									style="width: 200px;"
									v-model="activity.agent_id" placeholder="请选择应用">
								<template v-for="item in agentList">
									<a-select-option :value="item.id">{{item.name}}
									</a-select-option>
								</template>
							</a-select>
							<span style="color: #F56C6C">（一旦发布，不可更改）</span>
							<div class="content-msg" style="font-size: 13px;">
								<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a target="_blank"
								                                                                      href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
									企业微信后台</a>创建自建应用。<a target="_blank"
								                        href="https://support.qq.com/products/104790/faqs/63937">
									教程</a></p>
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
						<template slot="label"><span
								style="color: red">*</span>活动名称
						</template>
						<a-input :disabled="!!activity.id && (status != 1 || status == '')" v-model="activity.title"
						         placeholder="请填写活动名称，限20字符"
						         :maxLength="20"
						         style="width: 350px"></a-input>
						<span style="display: inline-block; width: 200px; margin-left: 10px;color: #F56C6C">{{activity.title === null ? 0 : activity.title.length}} / 20（一旦发布，不可修改）</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label"><span
								style="color: red">*</span>结束设置
						</template>
						<div>
							<a-date-picker
									:disabled="!!activity.id && (status != 1 || status == '')"
									:disabledDate="disabledDate"
									v-model='startDate'
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
									v-model='endDate'
									@change="changeEndTime"
									:showTime="{
											        hideDisabledOptions: true,
											        defaultValue: moment('23:59', 'HH:mm'),
											        format:'HH:mm'
											   }"
									format="YYYY-MM-DD HH:mm"
							/>
							<span style="margin-left: 5px;color: #F56C6C">（一旦发布，只可更改结束时间）</span>
						</div>
					</a-form-item>
					<!--					<a-form-item class="current0" label="裂变要求" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
					<!--						<div>-->
					<!--							<a-radio-group :disabled="!!activity.id && (status != 1 || status == '')" name="radioGroup"-->
					<!--							               v-model="activity.is_friend">-->
					<!--								<a-radio :value="0">-->
					<!--									新好友助力-->
					<!--									<a-tooltip>-->
					<!--										<template slot="title">-->
					<!--											未添加任何企业成员的用户，助力才会成功-->
					<!--										</template>-->
					<!--										<a-icon type="question-circle" style="vertical-align: initial;"/>-->
					<!--									</a-tooltip>-->
					<!--								</a-radio>-->
					<!--								<a-radio :value="1">-->
					<!--									全部好友-->
					<!--									<a-tooltip>-->
					<!--										<template slot="title">-->
					<!--											不限新旧好友，只要未在本次活动中有助力记录或参与记录，均可助力-->
					<!--										</template>-->
					<!--										<a-icon type="question-circle" style="vertical-align: initial;"/>-->
					<!--									</a-tooltip>-->
					<!--								</a-radio>-->
					<!--							</a-radio-group>-->
					<!--							<span style="color: #F56C6C">（一旦发布，不可更改）</span>-->
					<!--						</div>-->
					<!--					</a-form-item>-->
					<!--					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
					<!--						<template slot="label">-->
					<!--							助力失效-->
					<!--							<a-tooltip>-->
					<!--								<template slot="title">-->
					<!--									不论任务人数是否已达标完成，只要在活动进行中，已助力人员删除所添加的成员（从该推广码所添加的企业成员），会扣除邀请人的任务完成人数。-->
					<!--								</template>-->
					<!--								<a-icon type="question-circle" style="vertical-align: initial;"/>-->
					<!--							</a-tooltip>-->
					<!--						</template>-->
					<!--						<div>-->
					<!--							<a-checkbox :disabled="!!activity.id && (status != 1 || status == '')"-->
					<!--							            v-model="activity.is_invalid"></a-checkbox>-->
					<!--							<span>删企微好友助力失效<span style="color: #F56C6C">（一旦发布，不可更改）</span></span>-->
					<!--						</div>-->
					<!--					</a-form-item>-->
					<!--					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
					<!--						<template slot="label">-->
					<!--							防刷检测-->
					<!--							<a-tooltip placement="top">-->
					<!--								<template slot="title">-->
					<!--									开启后，在任务已完成且尚处于活动时间内，将参与人移至黑名单，奖品剩余库存不变，但不能对参与人进行发放。-->
					<!--								</template>-->
					<!--								<a-icon type="question-circle" style="vertical-align: initial;"/>-->
					<!--							</a-tooltip>-->
					<!--						</template>-->
					<!--						<div>-->
					<!--							<a-switch :checked="activity.is_brush" @click="changeStatus"></a-switch>-->
					<!--							<div style="display: inline-block; margin-left: 10px;" v-if="activity.is_brush">-->
					<!--								如果在-->
					<!--								<a-input-number-->
					<!--										class="brush-input"-->
					<!--										:min="0" :max="3600"-->
					<!--										:formatter="limitDecimals"-->
					<!--										:parse="limitDecimals"-->
					<!--										@input.native="inputSecond"-->
					<!--										v-model="activity.brush_time "></a-input-number>-->
					<!--								秒内，该参与人助力人数超过-->
					<!--								<a-input-number-->
					<!--										class="brush-input"-->
					<!--										:min="0" :max="99999999"-->
					<!--										:formatter="limitDecimals"-->
					<!--										:parse="limitDecimals"-->
					<!--										@input.native="inputNum"-->
					<!--										v-model="activity.brush_num"></a-input-number>-->
					<!--								人，则自动将该参与人加入黑名单-->
					<!--							</div>-->
					<!--						</div>-->
					<!--					</a-form-item>-->
				</div>
				<div v-show="current == 1" style="margin: 20px;">
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label"><span
								style="color: red">*</span>裂变人数
						</template>
						需要拉
						<a-input-number
								:disabled="!!activity.id && (status != 1 || status == '')"
								class="brush-input"
								:min="0" :max="99999999"
								:formatter="limitDecimals"
								:parse="limitDecimals"
								@input.native="inputFissionNum"
								v-model="activity.fission_num"></a-input-number>
						好友可领礼物
						<span style="color: #01b065;height: 24px;line-height: 24px;">
							<span style="color: #F56C6C">（一旦发布，不可更改）</span>
						</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<span slot="label">
							好友助力次数
							<a-tooltip title="在本场活动中，好友给某人助力后，再给其他人助力">
								<a-icon type="question-circle"/>
							</a-tooltip>
						</span>
						<a-input-number
								:disabled="!!activity.id && (status != 1 || status == '')"
								class="brush-input"
								v-model="activity.help_limit" placeholder="不填，默认为不限制"
								style="width: 150px;"></a-input-number>
						<span style="color: #01b065;height: 24px;line-height: 24px;">
							<span style="color: #F56C6C">（不填写，则默认为不限制。一旦发布，不可修改）</span>
						</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>奖品处理
						</template>
						<a-radio-group name="radioGroup" :value="prize_send_type" @change="changePrizeSendType"
						               :disabled="!!activity.id && (status != 1 || status == '')">
							<a-radio :value="1">活动期间</a-radio>
							<a-radio :value="2">活动结束</a-radio>
						</a-radio-group>
						<span style="color: #F56C6C;">（一旦发布，不可修改。）</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>奖品类型
						</template>
						<a-radio-group name="radioGroup" :value="prize_type" @change="changePrizeType"
						               :disabled="!!activity.id && (status != 1 || status == '')">
							<a-radio :value="0">实物</a-radio>
							<a-radio :value="1">红包</a-radio>
						</a-radio-group>
						<span style="color: #F56C6C;">（一旦发布，不可修改。）</span>
					</a-form-item>
					<template v-if="prize_type == 0">
						<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<template slot="label"><span
									style="color: red">*</span>奖品名称
							</template>
							<a-input v-model="activity.prize_name" placeholder="请填写奖品名称，限20字符" :maxLength="20"
							         style="width: 350px;"
							         :disabled="!!activity.id && (status != 1 || status == '')"></a-input>
							<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{activity.prize_name === null ? 0 : activity.prize_name.length}} / 20</span>
						</a-form-item>
						<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<template slot="label"><span
									style="color: red">*</span>奖品库存
							</template>
							<a-input-number
									class="brush-input"
									:min="0" :max="99999999"
									placeholder="不限"
									:formatter="limitDecimals"
									:parse="limitDecimals"
									@blur="blurPrizeNum"
									@input.native="inputPrizeNum"
									v-model="activity.prize_num"></a-input-number>
							件
							<span style="color: #01b065;height: 24px;line-height: 24px;">
							<span style="color: #F56C6C">（一旦发布后，只可增加不可减少。奖品已无库存情况下，活动自动结束）</span>
						</span>
						</a-form-item>
					</template>
					<template v-if="prize_type == 1">
						<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<template slot="label">
								<span style="color: red">*</span>红包金额
							</template>
							<a-input-number :step="0" :precision="2" style="width: 140px;margin-right: 5px;" :min="0.30"
							                :max="5000.00"
							                v-model="amount"
							                :disabled="!!activity.id && (status != 1 || status == '')"/>
							元
							<span style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入0.30~5000.00）</span>
						</a-form-item>
						<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<template slot="label">
								<span style="color: red">*</span>红包数量
							</template>
							<a-input-number
									class="brush-input"
									:min="0" :max="99999999"
									placeholder="不限"
									:formatter="limitDecimals"
									:parse="limitDecimals"
									@blur="blurPrizeNum"
									@input.native="inputPrizeNum"
									v-model="activity.prize_num"></a-input-number>
							个
							<span style="color: #01b065;height: 24px;line-height: 24px;">
							<span style="color: #F56C6C">（一旦发布后，只可增加不可减少。奖品已无库存情况下，活动自动结束）</span>
						</span>
						</a-form-item>
					</template>
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
						               :disabled="!!activity.id && (status != 1 || status == '')">
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
						               :disabled="!!activity.id && (status != 1 || status == '')">
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
						<corpChooseTag :callback="modalVisibleChange4" :hasChoose="tag_arr"
						               v-if="isShowTag"></corpChooseTag>
					</div>
				</div>
				<div v-show="current == 3" style="margin: 20px;">
					<div style="width: calc(100% - 300px); float: right;padding-left: 20px;">
						<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
							<template slot="label">
								海报图片
							</template>
							<a-upload
									action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
									:showUploadList="false"
									:beforeUpload="beforeUpload"
							>
								<!--									@change="uploadImage"-->
								<div v-if="!activity.back_pic_url">
									<a-button>
										<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
										上传海报
									</a-button>
								</div>
								<img v-if="activity.back_pic_url" style="max-width: 128px; max-height: 128px;"
								     :src="commonUrl + activity.back_pic_url"/>
								<div style="display: inline-block;vertical-align: bottom;margin-left: 5px;"
								     v-if="activity.back_pic_url">
									<a-button>
										<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
										重新上传
									</a-button>
								</div>
								<div style="margin-top: 10px;">
									图片像素建议为750*990像素，格式为jpg、bmp、png，大小不超过2M
								</div>
							</a-upload>
						</a-form-item>
						<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
							<template slot="label">
								头像
							</template>
							<a-switch :checked="activity.is_avatar" @click="changeAdatar"/>
							<div style="display: inline-block;" v-if="activity.is_avatar">
								<a-button @click="changeShape('circle')"
								          :class="activity.shape== 'circle' ? 'shape-active' : '' "
								          style="margin-left: 40px;display: inline-block;"
								>
									圆型
								</a-button>
								<a-button @click="changeShape('square')"
								          :class="activity.shape== 'square' ? 'shape-active' : '' "
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
								<a-switch :checked="activity.is_nickname" @click="changeNickName"/>
							</div>
							<div style="margin-top: 10px;">
								<div style="display: inline-block;" v-if="activity.is_nickname">
									<div>颜色
										<template>
											<a-popover
													trigger="click"
													placement="right"
											>
												<color-picker slot="content" v-model="activity.color"></color-picker>
												<div style="display: inline-block;" class="color-box">
															<span class="color-show"
															      :style="{'background-color': fcRemark()}"></span>
												</div>
											</a-popover>
										</template>
									</div>
								</div>
								<div style="display: inline-block;margin-left: 40px" v-if="activity.is_nickname">
									<div style="text-align: center">大小
										<a-select
												showSearch
												style="width: 70px;margin-bottom: 20px;"
												@change="changeNickNameFontSize"
												v-model="activity.font_size"
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
								     v-if="activity.is_nickname">
									<a-button @click="changeAlign('left')"
									          :class="activity.align== 'left' ? 'shape-active' : '' "
									          style="margin-left: 10px;display: inline-block;"
									>
										左对齐
									</a-button>
									<a-button @click="changeAlign('center')"
									          :class="activity.align== 'center' ? 'shape-active' : '' "
									          style="margin-left: 10px;display: inline-block;"
									>
										居中
									</a-button>
									<a-button @click="changeAlign('right')"
									          :class="activity.align== 'right' ? 'shape-active' : '' "
									          style="margin-left: 10px;display: inline-block;"
									>
										右对齐
									</a-button>
								</div>
							</div>
						</a-form-item>
					</div>
					<div style="width: 300px; padding: 0px 20px; float: left;">
						<!-- 更改海报时改变menuKey重新渲染 -->
						<div style="width: 266px;border: 8px solid rgb(241, 241, 241);" :key="menuKey"
						     :style="{height: (backHeight + 18) + 'px'}">
							<div class="page-content" :style="{ 'height': backHeight + 'px' }">
								<img v-show="activity.back_pic_url" style="width: 100%;position: absolute;"
								     draggable="false"
								     :src="commonUrl + activity.back_pic_url"/>
								<vue-draggable-resizable
										v-if="activity.is_avatar"
										style="cursor: move;"
										:class="activity.shape=='circle'? 'radus' : ''"
										:x="activity.avatar.x"
										:y="activity.avatar.y"
										:w="activity.avatar.w"
										:h="activity.avatar.w"
										:z="9999"
										:lock-aspect-ratio="true"
										@dragging="onDragAvatar"
										@resizing="onResizeAvatar"
										:parent="true">
									<span style="display:inline-block; position: absolute;left: 50%; top: 50%; transform: translate(-50%, -50%);font-size: 12px;">头像</span>
								</vue-draggable-resizable>
								<div style="border: 0px; position: absolute; left: 68px; top: 176px;"
								     v-if="!activity.back_pic_url">
									<a-upload v-if="!activity.back_pic_url"
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
										v-if="activity.is_nickname"
										:x="activity.nickName.x"
										:y="activity.nickName.y"
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
										:x="activity.qrCode.x"
										:y="activity.qrCode.y"
										:w="activity.qrCode.w"
										:h="activity.qrCode.w"
										:z="9999"
										:lock-aspect-ratio="true"
										@dragging="onDragQrcode"
										@resizing="onResizeQrcode"
										:parent="true">
									<img :style="{width: activity.qrCode.w + 'px', height: activity.qrCode.w + 'px'}"
									     src="../../../assets/fission/add/qrcode.png">
								</vue-draggable-resizable>
							</div>
						</div>
					</div>
				</div>
				<div v-show="current == 4" style="margin: 20px;">
					<div style="width: calc(100% - 350px);display: inline-block">
						<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
							<template slot="label">
								引流设置
							</template>
							海报将展示对应带参数的二维码， 扫码后将引流到对应的企业成员
						</a-form-item>
						<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
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
						<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
							<template slot="label">
								设置欢迎语
							</template>
							<div>客户通过海报添加对应微信后，可自动发送设置的内容<span style="color: #F56C6C"></span></div>
						</a-form-item>
						<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
							<template slot="label">
								文本
							</template>
							<editor v-if="editorFlag" :text="activity.text_content"
							        :textValue="activity.textAreaValueHeader"
							        :isEmoji="false"
							        @changeText="changeText">
							</editor>
						</a-form-item>
						<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
							<template slot="label"><span
									style="color: red">*</span>图文封面
							</template>
							<a-upload
									name="avatar"
									style="display: inline-block;max-width: 96px; max-height: 96px;"
									class="avatar-uploader"
									:showUploadList="false"
									action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
									:beforeUpload="beforeUpload1"
							>
								<img v-if="activity.link_pic_url" :src="commonUrl + activity.link_pic_url" alt="avatar"
								     style="max-width:96px;max-height:96px;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);"/>
								<div v-else style="    padding-top: 27px;margin-left: 18px;">
									<a-icon style="margin-left: 23px" :type="loading? 'loading' : 'plus'"/>
									<div class="ant-upload-text">点击上传</div>
								</div>
							</a-upload>
							<span style="display: inline-block;vertical-align: bottom;">（图片大小不超过2M，支持JPG、JPEG及PNG格式。建议尺寸200*200）</span>
						</a-form-item>
						<!-- 选中后 -->
						<!--						<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"-->
						<!--						             v-show="activity.link_pic_url">-->
						<!--							<template slot="label"><span-->
						<!--									style="color: red">*</span>图文封面-->
						<!--							</template>-->
						<!--							<div class="upload-wrap">-->
						<!--								<img :src="commonUrl+activity.link_pic_url" alt=""-->
						<!--								     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">-->
						<!--							</div>-->
						<!--							<span-->
						<!--									style="color: blue;cursor: pointer;margin: 67px 0 0px 10px;float: left;"-->
						<!--									@click="choosePic">重新上传</span>-->
						<!--						</a-form-item>-->
						<!-- 填写标题 -->
						<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
							<template slot="label"><span
									style="color: red">*</span>填写标题
							</template>
							<a-input v-model="activity.link_start_title" style="width: 500px;"
							         :maxLength="32">
								<span slot="suffix"><span>{{activity.link_start_title.length}}</span>/32</span>
							</a-input>
						</a-form-item>
						<!-- 添加描述 -->
						<a-form-item class="current0" style="margin-top: 10px;" label="添加描述" :label-col="{ span: 3 }"
						             :wrapper-col="{ span: 21 }">
							<div>
								<a-textarea style="width: 500px;" placeholder="填写图文描述" v-model="activity.link_desc"
								            :maxLength="128" :rows="4"/>
							</div>
							<div style="width: 500px; text-align: right">
								<span>{{activity.link_desc.length}}</span>/128
							</div>
							<!--							<a-textarea placeholder="填写图文描述" :rows="4"-->
							<!--							            style="resize: none;width: 100%;"-->
							<!--							            v-model="activity.link_desc"-->
							<!--							            :maxLength="128"/>-->
							<!--							<div style="float:right;">-->
							<!--								<span>{{activity.link_desc.length}}</span>/128-->
							<!--							</div>-->
						</a-form-item>
					</div>
					<div style="width: 300px;float: right;height: 370px;">
						<div class="wrap left-sider-content">
							<img src="../../../assets/wxHeader.png" alt
							     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
							<div class="msg_content_body">
								<!--文本-->
								<div v-if="activity.textAreaValueHeader" class="mt">
									<a-avatar
											src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
											:size="36" style="margin-right: 10px;float: left;"/>
									<span v-html="activity.textAreaValueHeader"
									      class="item-info msg_content_txt"></span>
								</div>
								<!--网址-->
								<div v-if="activity.link_start_title || activity.link_desc || activity.link_pic_url"
								     class="mt">
									<a-avatar
											src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
											:size="36" style="margin-right: 10px;float: left;"/>
									<div class="item-info msg_content_txt">
										<p class="url-title">{{activity.link_start_title}}</p>
										<div style="overflow: hidden;">
											<div class="url-text">{{activity.link_desc}}</div>
											<img :src="commonUrl+activity.link_pic_url" alt=""
											     style="float: right;width: 64px;height: 64px;object-fit: cover;">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="steps-action">
			<a-button v-if="current>0" @click="prev">
				上一步
			</a-button>
			<a-button v-if="current < steps.length - 1" style="margin-left: 8px" type="primary" @click="next">
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
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum" :is_from="7"
		                  :callback="modalVisibleChange3"></chooseDepartment>
		<!-- 选择素材弹窗 -->
		<chooseMsg :show="showModal3" :type="2" :news_type="1"
		           :callback="modalVisibleChange2" :sketchType="'1'" :comefrom="'1'" :chooseId="chooseId"></chooseMsg>
		<!-- 企业微信选择弹窗 -->
		<WeChatModal :show="showModal2" :callback="modalVisibleChange" hasName="fission-add"></WeChatModal>
	</div>
</template>

<script>
	import moment from 'moment';
	import {Sketch} from "vue-color";
	import editor from '../../../components/editor/index'
	import VueDraggableResizable from 'vue-draggable-resizable'
	import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import chooseMsg from "@/components/ChooseMsg"
	import WeChatModal from "@/components/WeChatModal.vue"
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import cityData from "../../../common/js/TencentAddress.js";

	function getBase64 (img, callback) {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	export default {
		name      : "add",
		components: {
			WeChatModal,
			chooseMsg,
			chooseDepartment,
			"color-picker"           : Sketch,
			"vue-draggable-resizable": VueDraggableResizable,
			editor, corpChooseTag
		},
		data () {
			return {
				status             : '',
				current            : 0, // 步骤index
				commonUrl          : this.$store.state.commonUrl,
				showModal2         : false,// 企业微信弹窗
				corpName           : localStorage.getItem("corpName"),
				steps              : [  // 步骤名
					{
						title: '活动信息',
					},
					{
						title: '活动奖品',
					},
					{
						title: '高级设置',
					},
					{
						title: '活动海报',
					},
					{
						title: '活动欢迎语'
					}
				],
				suite_id           : 1,//应用ID
				startDate          : null,
				endDate            : null,
				date               : [], // 活动时间
				agentList          : [], // 应用
				backHeight         : 330, // 海报图片区域高度
				menuKey            : 1, // 改变海报图片时强制渲染页面
				editorFlag         : false,
				activity           : {
					id                 : '',
					uid                : localStorage.getItem("uid"),
					corp_id            : localStorage.getItem("corpId"),
					agent_id           : [], // 应用id
					title              : '', // 活动标题
					start_time         : '', // 开始时间
					end_time           : '', // 结束时间
					is_end             : false, // 库存为零结束
					is_friend          : 0, // 0新好友 1全部好友
					is_invalid         : false, // 是否失效
					is_brush           : false, //是否防刷
					brush_time         : 10, // 秒数
					brush_num          : 100, //人数
					fission_num        : 10,// 裂变人数
					help_limit         : '',// 好友助力次数
					prize_name         : '', // 奖品名称
					prize_num          : 99999999, // 奖品库存
					back_pic_url       : '/upload/fission/fission.png', // 海报图片
					is_avatar          : true, // 头像选择按钮
					avatar             : {
						w: 39,
						x: 19,
						y: 251
					}, // 头像大小位置
					nickName           : {
						w: 84,
						h: 28,
						x: 20,
						y: 285
					}, // 昵称大小位置
					qrCode             : {
						w: 60,
						x: 170,
						y: 250
					}, // 二维码大小位置
					shape              : "circle", // circle圆形 square方形
					is_nickname        : true, // 昵称选择按钮
					color              : '#FFFFFF', // 颜色
					font_size          : 12, // 大小
					align              : 'left', // 对齐方式
					user               : [], // 成员
					text_content       : '', // 文本
					textAreaValueHeader: '',
					link_attach_id     : '',
					link_pic_url       : '/upload/fission/share.png', // 图文封面
					link_start_title   : '呼朋唤友，免费拿奖品', // 图文标题
					link_desc          : '好友，你可以给我打个Call吗？', // 描述
				},
				flag               : false,
				prize_num          : 0, // 编辑时原库存，库存只能增加
				chooseNum          : 0, // 部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				showModalDepartment: false, // 选择成员弹窗
				// pageHeight : '450',
				loading            : false, // 上传loading
				showModal3         : false, // 图文封面弹窗
				chooseId           : 0, // 图文封面id
				createLoading      : false, // 活动创建按钮loading
				//奖品类型
				prize_type         : 0,//0实物，1红包
				amount             : '',//红包金额
				//奖品处理
				prize_send_type    : 1,//1活动期间，2活动结束
				//高级设置
				sexType            : 1,//性别参与
				areaType           : 1,//地区参与
				// 地域
				cityData,
				province           : [
					[]
				],
				tag_arr            : [], //标签值
				isShowTag          : false,
			}
		},
		methods   : {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/fission/list?isRefresh=1")
			},
			changeCurrent (index) {
				this.current = index
			},
			// 改变企业微信
			changeCorp () {
				if (this.activity.id) {
					return false
				}
				this.showModal2 = true
			},
			modalVisibleChange (type, corpId, corpName) {
				if (type == 'ok') {
					if (this.activity.corp_id != corpId) {
						this.activity.corp_id = corpId
						this.getAgentList()
						this.corpName = corpName
						this.chooseNum = 0
						this.activity.user = []
						this.$refs.user.staffList = []
						this.$refs.user.keyList = []
					}
				}
				this.showModal2 = false
			},
			async getAgentList (id) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.activity.corp_id,
					suite_id  : this.suite_id,
					agent_type: 2
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.agentList = res.data
					if (id) {
						this.activity.agent_id = id
					} else if (this.agentList.length != 0 && !id) {
						this.activity.agent_id = this.agentList[0].id
					}
					this.isShowTag = true
				}
			},
			moment,
			// 防刷检测改变
			changeStatus (value) {
				this.activity.is_brush = value
				if (value) {
					this.activity.brush_time = this.activity.brush_time || 10
					this.activity.brush_num = this.activity.brush_num || 100
				}
			},
			// 数字输入框限制
			limitDecimals (value) {
				const reg = /[^\d]/g
				if (typeof value == 'string') {
					return !isNaN(Number(value)) ? value.replace(reg, '') : ''
				} else if (typeof value == 'number') {
					return !isNaN(value) ? String(value).replace(reg, '') : ''
				} else {
					return ''
				}
			},
			// 秒数限制
			inputSecond (e) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data) || this.activity.brush_time > 3600) {
						this.activity.brush_time = parseInt(this.activity.brush_time.toString().substring(0, this.activity.brush_time.toString().length - 1)) || ''
					}
				}

			},
			// 人数限制
			inputNum (e) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data) || this.activity.brush_num > 99999999) {
						this.activity.brush_num = parseInt(this.activity.brush_num.toString().substring(0, this.activity.brush_num.toString().length - 1)) || ''
					}
				}
			},
			// 裂变人数限制
			inputFissionNum (e) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data) || this.activity.fission_num > 99999999) {
						this.activity.fission_num = parseInt(this.activity.fission_num.toString().substring(0, this.activity.fission_num.toString().length - 1)) || ''
					}
				}
			},
			// 库存限制
			inputPrizeNum (e) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data) || this.activity.prize_num > 99999999) {
						this.activity.prize_num = parseInt(this.activity.prize_num.toString().substring(0, this.activity.prize_num.toString().length - 1)) || ''
					}
				}
			},
			blurPrizeNum () {
				let that = this
				if (this.activity.id && (this.status != 1 && this.status != "")) {
					if (this.activity.prize_num < this.prize_num) {
						this.activity.prize_num = this.prize_num
						this.$message.warning("库存修改只能大于原数据！")
						this.flag = true
						setTimeout(function () {
							that.flag = false
						}, 500)
						return false
					}
				}
			},
			// 活动时间
			disabledDate (current) {
				// Can not select days before today and today
				return current && current < moment().startOf('day');
			},
			changeStartTime (date, dateString) {
				if (dateString && this.startDate && dateString > moment(this.endDate).format("YYYY-MM-DD HH:mm:ss")) {
					this.$message.warning('开始时间不能晚于结束时间')
				}
				if (dateString) {
					this.startDate = date
				} else {
					this.startDate = null
				}
				this.activity.start_time = dateString
			},
			changeEndTime (date, dateString) {
				if (dateString && this.startDate && dateString < moment(this.startDate).format("YYYY-MM-DD HH:mm:ss")) {
					this.$message.warning('结束时间不能早于开始时间')
				}
				if (dateString) {
					this.endDate = date
				} else {
					this.endDate = null
				}
				this.activity.end_time = dateString
			},
			// 改变时间
			changeTime (date, dateString) {
				this.date = date
				if (dateString.length > 1) {
					this.activity.start_time = dateString[0]
					this.activity.end_time = dateString[1]
				} else {
					this.activity.start_time = ''
					this.activity.end_time = ''
				}
			},
			// 上传前
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
				this.uploadImage(file)
			},
			beforeUpload1 (file) {
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
				this.uploadImage(file, 1)
			},
			// 上传
			async uploadImage (file, type) {
				this.loading = true
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				// param.append("sub_id", localStorage.getItem('sub_id'));
				// param.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
				// param.append("is_sync", 0);
				// param.append("file_type", 1);
				param.append("fileInfo", file);
				const {data: res} = await this.axios.post("sub-user/upload-image", param);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.loading = false
				} else {
					if (type) {
						this.activity.link_pic_url = res.data.local_path
						this.loading = false;
					} else {
						this.activity.back_pic_url = res.data.local_path
						this.posterBackHeight()
						this.loading = false;
					}
				}
			},
			posterBackHeight () {
				let that = this
				let img = new Image()
				img.src = this.commonUrl + this.activity.back_pic_url
				img.onload = function () {
					that.backHeight = img.height / (img.width / 250) < 330 ? 330 : img.height / (img.width / 250)
					if (that.activity.avatar.y > that.backHeight) {
						that.activity.avatar.y = that.backHeight - that.activity.avatar.w
					}
					if (that.activity.nickName.y > that.backHeight) {
						that.activity.nickName.y = that.backHeight - that.activity.nickName.h
					}
					if (that.activity.qrCode.y > that.backHeight) {
						that.activity.qrCode.y = that.backHeight - that.activity.qrCode.w
					}
					++that.menuKey
				}
			},
			// 头像是否显示
			changeAdatar (value) {
				this.activity.is_avatar = value
			},
			// 头像形状
			changeShape (type) {
				this.activity.shape = type
			},
			// 昵称是否显示
			changeNickName (value) {
				this.activity.is_nickname = value
			},
			// 样式
			fcRemark () {
				if (typeof this.activity.color.hex != "undefined") {
					this.activity.color = this.activity.color.hex
				}
				return this.activity.color;
			},
			// 昵称文字大小
			changeNickNameFontSize (font_size) {
				this.activity.font_size = font_size
			},
			// 昵称文字格式
			changeAlign (align) {
				this.activity.align = align
			},
			// 头像大小
			onResizeAvatar: function (x, y, w, h) {
				this.activity.avatar.x = x
				this.activity.avatar.y = y
				if (w > h) {
					h = w
				} else {
					w = h
				}
				this.activity.avatar.w = parseInt(w)
				console.log(w)
			},
			// 移动头像
			onDragAvatar  : function (x, y) {
				this.activity.avatar.x = x
				this.activity.avatar.y = y
			},
			// 移动昵称
			onDragNickName (x, y) {
				this.activity.nickName.x = x
				this.activity.nickName.y = y
			},
			// 昵称宽度
			nickNameWidth () {
				return parseInt(this.activity.font_size) * 6
			},
			// 昵称高度
			nickNameHeight () {
				return parseInt(this.activity.font_size) * 2
			},
			// 昵称样式
			nickNameStyle () {
				let style = {
					fontSize  : this.activity.font_size + 'px',
					color     : this.activity.color,
					lineHeight: (parseInt(this.activity.font_size) * 2 - 4) + 'px'
				}
				if (this.activity.align) {
					style['textAlign'] = this.activity.align
				}
				return style
			},
			// 移动二维码
			onDragQrcode (x, y) {
				this.activity.qrCode.x = x
				this.activity.qrCode.y = y
			},
			// 二维码大小
			onResizeQrcode (x, y, w, h) {
				this.activity.qrCode.x = x
				this.activity.qrCode.y = y
				if (w > h) {
					h = w
				} else {
					w = h
				}
				this.activity.qrCode.w = parseInt(w)
			},
			// 重置
			clearDepartmentList () {
				this.activity.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.$refs.user.rightIdList = []
				this.$refs.user.rightList = []
			},
			// 选择成员
			showDepartmentList () {
				let arr = []
				this.activity.user.map(x=>{
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.activity.user))
				this.showModalDepartment = true
			},

			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.activity.user = JSON.parse(JSON.stringify(list))
					} else {
						this.activity.user = []
					}
				}
				this.showModalDepartment = false
			},
			// 图文封面图片
			choosePic () {
				this.chooseId = Number(this.activity.link_attach_id || 0)
				this.showModal3 = true
			},
			// 封面图片回调
			modalVisibleChange2 (event, e, id, item) {
				if (event == "ok") {
					this.activity.link_attach_id = id
					this.activity.link_pic_url = item.local_path
				}
				this.showModal3 = false
			},
			//修改奖品发放类型
			changePrizeSendType (e) {
				this.prize_send_type = e.target.value
			},
			//修改奖品类型
			changePrizeType (e) {
				this.prize_type = e.target.value
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
			modalVisibleChange4 (event, str) {
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
					if (this.activity.title == '') {
						this.$message.warning("请检查标题")
						return false
					}
					if (typeof this.activity.agent_id == 'object' && this.activity.agent_id.length == 0) {
						this.$message.warning("请选择应用")
						return false
					}
					if (this.activity.start_time == '' || this.activity.end_time == '') {
						this.$message.warning("请检查活动时间")
						return false
					}
					if (this.activity.start_time > this.activity.end_time) {
						this.$message.warning("开始时间不能大于结束时间")
						return false
					}
					if (this.activity.end_time < moment(new Date()).format("YYYY-MM-DD HH:mm:ss")) {
						this.$message.warning("结束时间不能早于当前时间")
						return false
					}
					if (this.activity.is_brush) {
						if (!this.activity.brush_time || this.activity.brush_time == 0) {
							this.$message.warning("请检查防刷检测时间")
							return false
						}
						if (!this.activity.brush_num || this.activity.brush_num == 0) {
							this.$message.warning("请检查防刷检测人数")
							return false
						}
					}
				}
				if (current == 1) {
					if (!this.activity.fission_num || this.activity.fission_num == 0) {
						this.$message.warning("请检查裂变人数")
						return false
					}
					if (this.prize_type == 0) {
						if (!this.activity.prize_name) {
							this.$message.warning("请填写奖品名称")
							return false
						}
						if (this.activity.prize_num == 0) {
							this.$message.warning("奖品库存不能为0")
							return false
						}
					} else if (this.prize_type == 1) {
						if (this.amount == '' || this.amount == null) {
							this.$message.warning("请填写红包金额")
							return false
						} else {
							if (Number(this.amount) < 0.3 || Number(this.amount) > 5000) {
								this.$message.warning("红包金额必须在0.30~5000.00之间")
								return false
							}
						}
						if (this.activity.prize_num == '' || this.activity.prize_num == null) {
							this.$message.warning("请填写红包数量")
							return false
						} else {
							if (this.activity.prize_num == 0) {
								this.$message.warning("红包数量不能为0")
								return false
							}
						}
					}
					if (this.flag) {
						return false
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
				if (current == 3) {
					if (this.activity.back_pic_url == '') {
						this.$message.warning("请上传海报")
						return false
					}
				}
				return true
			},
			// 上一步
			prev () {
				this.current--;
			},
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
				if (!this.checkout(3)) {
					this.createLoading = false
					this.current = 3
					return false
				}
				if (this.flag) {
					this.createLoading = false
					return false
				}

				if (this.activity.back_pic_url == '') {
					this.$message.warning("请上传海报")
					this.createLoading = false
					this.current == 3
					return false
				}

				if (this.activity.user.length == 0) {
					this.$message.warning("请选择成员")
					this.createLoading = false
					return false
				}
				if (this.activity.link_pic_url == 0) {
					this.$message.warning("请上传图文封面")
					this.createLoading = false
					return false
				}
				if (this.activity.link_start_title == 0) {
					this.$message.warning("请填写图文标题")
					this.createLoading = false
					return false
				}
				this.activity.prize_send_type = this.prize_send_type
				this.activity.prize_type = this.prize_type
				this.activity.amount = this.amount
				this.activity.sex_type = this.sexType
				this.activity.area_type = this.areaType
				this.activity.area_data = this.province
				this.activity.tag_ids = this.tag_arr.join()
				const {data: res} = await this.axios.post("fission/add", this.activity);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.createLoading = false
				} else {
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					if (this.activity.id == '') {
						this.$router.push("/fission/list")
					} else {
						this.$router.push("/fission/list?isRefresh=1")
					}
				}

			},
			// 编辑获取详情
			async getDetail () {
				let that = this
				const {data: res} = await this.axios.post("fission/edit-info", {
					id : this.activity.id,
					uid: localStorage.getItem('uid')
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.activity = res.data
					this.activity.textAreaValueHeader = this.activity.text_content.replace(
						/{nickname}/g,
						'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>'
					).replace(/\n/g, '<br>')
					this.editorFlag = true
					if (this.activity.link_desc == '') {
						this.activity.link_desc = '好友，你可以给我打个Call吗？'
					}
					this.posterBackHeight()
					this.getAgentList(this.activity.agent_id.toString())
					this.status = res.data.status
					this.corpName = res.data.corp_name
					delete this.activity.corp_name
					// this.date = []
					// this.date.push(moment(this.activity.start_time))
					// this.date.push(moment(this.activity.end_time))
					this.startDate = moment(this.activity.start_time)
					this.endDate = moment(this.activity.end_time)
					this.chooseNum = this.activity.user.length
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					this.activity.user.map(x=>{
						if(x.scopedSlots.title == 'custom'){
							this.chooseUserNum++
						}else if(x.scopedSlots.title == 'title'){
							this.chooseDepartmentNum++
						}
					})

					this.prize_send_type = res.data.prize_send_type
					this.prize_type = res.data.prize_type
					this.amount = res.data.amount
					this.sexType = res.data.sex_type
					this.areaType = res.data.area_type
					this.province = res.data.area_data
					this.province.map(x => {
						if (!!this.activity.id && (this.status != 1 || this.status == '')) {
							x.disabled = true
						}
					})

					if (res.data.tag_ids.length > 0) {
						res.data.tag_ids.map((tagId) => {
							this.tag_arr.push(String(tagId));
						})
					}
					this.isShowTag = true

					this.prize_num = this.activity.prize_num
				}
			},
			changeText (text, textVale) {
				this.activity.text_content = text
				this.activity.textAreaValueHeader = textVale
			}
		},
		mounted () {
			let that = this
			if (typeof this.$route.query.id != 'undefined') {
				this.activity.id = this.$route.query.id
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/fission/list')
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

	.avatar-uploader {
		width: 96px;
		height: 96px;
		border: 1px dashed #E2E2E2;
	}

	.current0 {
		margin-bottom: 1.5%;
	}

	.fission-add {
		position: absolute;
		width: 100%;
		height: calc(100% - 60px);
		/*overflow-y: auto;*/
	}

	.fission-content {
		width: calc(100% - 80px);
		height: calc(100% - 80px);
		background-color: #FAFAFA;
		margin: 0 auto;
		margin-top: 20px;
		padding: 30px 0px 0px 0px;
		overflow-y: hidden;
	}

	.steps-content {
		margin-top: 20px;
		border-radius: 6px;
		height: calc(100% - 52px);
		padding: 0 30px;
		overflow-y: auto;
	}

	.steps-action {
		position: fixed;
		bottom: 0px;
		left: 50%;
		transform: translate(-50%, 0%);
		height: 60px;
		line-height: 60px;
	}

	.desc {
		line-height: 30px;
		margin: 0 0 5px 0;
	}

	.brush-input {
		width: 100px;
	}

	.prize-item {
		margin-top: 20px;
	}

	.shape-active {
		background-color: #01b065;
		color: #FFFFFF;
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

	.radus {
		border-radius: 50%;
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

	.wrap {
		padding: 20px;
		border: 1px solid #E2D6D6;
		margin: auto;
		height: 100%;
		/*width: 100%;*/
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
	}

	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
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

	.el-link--inner a {
		font-size: 14px;
	}

	.el-link--inner a:link {
		color: #01b065;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.el-link--inner a:visited {
		color: #01b065;
		text-decoration: none;
	}

	.el-link--inner a:visited {
		color: #01b065;
		text-decoration: none;
	}

	.content-msg {
		width: 372px;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
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
</style>
