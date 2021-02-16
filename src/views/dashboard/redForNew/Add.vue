<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="加载中..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="typeof urlId == 'undefined'">新建</template>
						<template v-if="typeof urlId != 'undefined'">修改</template>
						红包渠道活码
						<a-button type="primary"  @click="goBack"
						          style="float: right;margin-top: 9px;">返回列表
						</a-button>
					</a-layout-header>

					<a-layout class="fans-content">
						<!-- 内容 -->
						<a-layout-content>
							<a-steps :current="current"
							         style="padding: 20px 30px;cursor: pointer;background-color: #FFFFFF;">
								<a-step @click="changeCurrent(index)" v-for="(item, index) in steps" :key="item.title"
								        :title="item.title"/>
							</a-steps>
							<div class="content steps-content">
								<!-- <a-spin tip="加载中..." size="large" :spinning="isLoading"></a-spin> -->
								<!-- 公众号选择 -->
								<!--								<div class="content-hd" v-if="current == 0">-->
								<!--									<a-form>-->
								<!--										-->
								<!--									</a-form>-->
								<!--								</div>-->
								<div class="content-bd">
									<a-form v-if="current == 0">

										<a-form-item v-if="$store.state.corpArr.length > 1"
										             label="选择企业微信"
										             :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template>
												<div style="display: inline-block;cursor: pointer;" @click="add">
													<img src="../../../assets/WeChatLogo.png" alt=""
													     style="width: 24px;border-radius: 4px;">
													<span style="margin-left: 5px;">{{corpName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
													        v-if="typeof urlId=='undefined'"/>
												</div>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</template>
										</a-form-item>
										<!-- 二维码名称 -->
										<a-form-item label="活码名称" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }"
										             style="padding-top: 15px;">
											<a-input v-model="rule.name" placeholder="如：扫码送试用装01，限30字符" :maxLength="30"
											         style="width: 60%;"
											         :disabled="typeof urlId=='undefined'?false:true"/>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{rule.name === null ? 0 : rule.name.length}} / 30</span>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦创建，不可修改）</span>
										</a-form-item>
										<a-form-item label="活动时间" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }"
										             style="padding-top: 15px;">
											<a-radio-group v-model="rule.time_type"
											               :disabled="typeof urlId != 'undefined' && redpacket_status != 1">
												<a-radio :value="1">永久有效</a-radio>
												<a-radio style="margin-left: 25px;" :value="2">
													固定时间区间
													<div v-if="rule.time_type == 2"
													     style="display: inline-block;margin-left: 10px;">
														<a-date-picker
																:disabled="typeof this.urlId != 'undefined' && redpacket_status != 1"
																:disabledDate="disabledDate"
																v-model='startDate'
																@change="changeRedStartTime"
																:showTime="{hideDisabledOptions: true,defaultValue: moment('00:00:00', 'HH:mm:ss'),format:'HH:mm:ss'}"
																format="YYYY-MM-DD HH:mm:ss"
														/>
														~
														<a-date-picker
																:disabledDate="disabledDate"
																v-model='endDate'
																@change="changeRedEndTime"
																:showTime="{hideDisabledOptions: true,defaultValue: moment('23:59:59', 'HH:mm:ss'),format:'HH:mm:ss'}"
																format="YYYY-MM-DD HH:mm:ss"
														/>
														<a-tooltip placement="top">
															<template slot="title">
																<span>在活动时间内，微信支付商户平台账户余额充足情况下，扫码添加企业成员发红包。</span>
															</template>
															<a-icon type="question-circle" style="margin-left:15px;"/>
														</a-tooltip>
														<span style="margin-left: 5px;color: #F56C6C">（一旦发布，只可更改结束时间）</span>
													</div>
												</a-radio>
												<span v-if="rule.time_type == 1"
												      style="margin-left: 5px;color: #F56C6C">（一旦发布，不可更改）</span>
											</a-radio-group>

										</a-form-item>
										<a-form-item v-if="rule.time_type == 2" label="活码有效期" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }"
										             style="padding-top: 15px;">
											自活动结束后
											<a-input-number v-model="rule.reserve_day"
											                :min="1" :max="999999"
											                style="width: 120px;margin: 0 5px;"
											                :disabled="typeof urlId=='undefined'?false:true && redpacket_status != 1"></a-input-number>
											天内，客户扫码不影响加员工，但红包不再发放。
											<a-tooltip placement="top">
												<template slot="title">
													<span>如设置3天，那么，当活动在1号结束，2号、3号及4号依然可以扫码加人，但不发红包，5号凌晨则扫码失效，即提示“扫码不存在”。若手动提前结束活动，则以结束当日后往后延3天，如原本是在5号结束，但3号时提前结束，那么，在7号凌晨扫码失效。</span>
												</template>
												<a-icon type="question-circle" style="margin-left:15px;"/>
											</a-tooltip>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦发布，不可修改）</span>
										</a-form-item>
										<a-form-item label="红包规则" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }"
										             style="padding-top: 15px;">
											<a-radio-group
													:disabled="typeof urlId!='undefined' && redpacket_status != 1"
													v-model="rule.redrule_type">
												<a-radio :value="1">选择已有规则
													<chooseRule
															:disabled="typeof urlId !='undefined' && redpacket_status != 1"
															style="display:inline-block; width: 200px;"
															:rule_id="rule.rule_id" @changeSelect="changeSelect"
															v-if="rule.redrule_type == 1"></chooseRule>
												</a-radio>
												<a-radio style="margin-left: 25px;" :value="2">新建红包规则</a-radio>
											</a-radio-group>
											<a-form style="padding: 20px; background-color: #FFFFFF;"
											        v-if="(rule.redrule_type == 1 && rule.rule_id) || rule.redrule_type == 2">
												<a-form-item class="current0" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 19 }">
													<span slot="label">
														<span style="color: #FF562D;">*</span>规则名称
													</span>
													<a-input style="width: 340px;"
													         v-if="rule.redrule_type == 2"
													         placeholder="请输入红包规则" :maxLength="30"
													         v-model="rule2.rule_name">
														<span v-if="rule.redrule_type == 2" slot="suffix">
									                        <span>{{rule2.rule_name.length}}</span>/30
								                        </span>
													</a-input>
													<span v-if="rule.redrule_type == 1">{{rule1.rule_name}}</span>
												</a-form-item>
												<a-form-item class="current0" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 19 }">
													<span slot="label">
														<span style="color: #FF562D;">*</span>单个红包金额
													</span>
													<a-radio-group name="radioGroup"
													               v-if="rule.redrule_type == 2"
													               :value="rule2.rule_type"
													               @change="changeType2">
														<a-radio :value="1"
														         style="display: inline-block;height: 35px;line-height: 35px;">
															定额
															<span v-if="rule2.rule_type == 1">
																<a-input-number :step="0" :precision="2"
																                style="width: 140px;margin: 0 5px;"
																                :min="0.30" :max="200.00"
																                v-model="rule2.rule_fixed_amount"/>元
															</span>
														</a-radio>
														<a-radio :value="2"
														         style="display: inline-block;height: 35px;line-height: 35px;margin-left: 25px;">
															按随机金额
															<span v-if="rule2.rule_type == 2">
																<a-input-number :step="0" :precision="2"
																                style="width: 100px;margin: 0 5px;"
																                :min="0.30" :max="200.00"
																                v-model="rule2.rule_min_random_amount"/>元 ——
																<a-input-number :step="0" :precision="2"
																                style="width: 100px;margin-right: 5px;"
																                :min="0.30" :max="200.00"
																                v-model="rule2.rule_max_random_amount"/>元
															</span>
														</a-radio>
													</a-radio-group>
													<a-radio-group name="radioGroup"
													               v-if="rule.redrule_type == 1"
													               :disabled="rule.redrule_type == 1 || redpacket_status != 1"
													               :value="rule1.rule_type"
													               @change="changeType1">
														<a-radio :value="1"
														         style="display: inline-block;height: 35px;line-height: 35px;">
															定额
															<span v-if="rule1.rule_type == 1">{{rule1.rule_fixed_amount}}元</span>
														</a-radio>
														<a-radio :value="2"
														         style="display: inline-block;height: 35px;line-height: 35px;margin-left: 25px;">
															按随机金额
															<span v-if="rule1.rule_type == 2">{{rule1.rule_min_random_amount}}-{{rule1.rule_max_random_amount}}元</span>
														</a-radio>
													</a-radio-group>
													<div style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入0.30~200.00）
													</div>
												</a-form-item>
												<a-form-item class="current0" label="红包封面" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 19 }">
													<a-upload
															v-if="rule.redrule_type == 2"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															:showUploadList="false"
															:beforeUpload="beforeUpload"
													>
														<div v-show="!rule2.rule_pic_url">
															<a-button>
																<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
																上传封面
															</a-button>
														</div>
														<img v-show="rule2.rule_pic_url"
														     style="max-width: 128px; max-height: 128px;"
														     :src="commonUrl + rule2.rule_pic_url"/>
														<div style="display: inline-block;vertical-align: bottom;margin-left: 5px;"
														     v-show="rule2.rule_pic_url">
															<a-button>
																<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
																替换
															</a-button>
														</div>
														<div style="margin-top: 10px;">
															图片像素建议为200px*200px，格式为jpg、jpeg、png，大小不超过2M
														</div>
													</a-upload>
													<img v-if="rule1.rule_pic_url && rule.redrule_type == 1"
													     style="max-width: 128px; max-height: 128px;"
													     :src="commonUrl + rule1.rule_pic_url"/>
												</a-form-item>
												<a-form-item class="current0" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 19 }">
													<span slot="label">
														<span style="color: #FF562D;">*</span>标题
													</span>
													<a-input v-if="rule.redrule_type == 2"
													         style="width: 340px;"
													         placeholder="请填写标题" :maxLength="32"
													         v-model="rule2.rule_title">
														<span slot="suffix">
									                        <span>{{rule2.rule_title.length}}</span>/32
														</span>
													</a-input>
													<span v-if="rule.redrule_type == 1">{{rule1.rule_title}}</span>
												</a-form-item>
												<a-form-item label="添加描述" class="current0" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 19 }">
													<div>
														<a-textarea v-if="rule.redrule_type == 2"
														            style="max-width: 500px;" placeholder="请填写描述"
														            v-model="rule2.rule_des"
														            :maxLength="128" :rows="4"/>
													</div>
													<div style="max-width: 500px; text-align: right"
													     v-if="rule.redrule_type == 2 && redpacket_status == 1">
														<span>{{rule2.rule_des.length}}</span>/128
													</div>
													<span v-if="rule.redrule_type == 1 || redpacket_status != 1">{{rule1.rule_des}}</span>
												</a-form-item>
												<a-form-item class="current0" label="感谢语" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 19 }">
													<a-input v-if="rule.redrule_type == 2"
													         style="width: 340px;"
													         placeholder="恭喜发财，大吉大利" :maxLength="32"
													         v-model="rule2.rule_thanking">
														<span slot="suffix">
									                        <span>{{rule2.rule_thanking.length}}</span>/32
														</span>
													</a-input>
													<span v-if="rule.redrule_type == 1">{{rule1.rule_thanking || '恭喜发财，大吉大利'}}</span>
												</a-form-item>
											</a-form>
										</a-form-item>
										<a-form-item v-if="rule.redrule_type == 2"
										             label="是否存入红包规则"
										             :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-switch :disabled="redpacket_status != 1" :checked="rule.rule_save == 1"
											          @click="changeRuleSave"></a-switch>
										</a-form-item>
										<a-form-item label="投放金额" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-input-number :step="0" :precision="2"
											                style="width: 140px;margin: 0 5px;"
											                :min="0.30" :max="100000.00"
											                v-model="rule.redpacket_amount"/>
											元（精确到小数点后两位，可输入0.30~100000.00。发送红包达到这个数额之后，对下一个新客户不再推送。<span style="color: #FF562D">只可增加不可减少</span>）
											<p>最多领取人数可达<span style="color: #FF562D;">
												<!--redrule_type 1 导入 2 新建      rule_type 1 定额 2 随机-->
												{{rule.redrule_type == 1 ?
												(
												rule1.rule_type == 1 ?
												(
												!rule1.rule_fixed_amount ?
												'--' : Math.floor(rule.redpacket_amount / rule1.rule_fixed_amount)
												)
												:
												(
												!rule1.rule_min_random_amount ?
												'--' : Math.floor(rule.redpacket_amount / rule1.rule_min_random_amount)
												)
												)
												:
												(
												rule2.rule_type == 1 ?
												(
												!rule2.rule_fixed_amount ?
												'--' : Math.floor(rule.redpacket_amount / rule2.rule_fixed_amount)
												)
												:
												(
												!rule2.rule_min_random_amount ?
												'--' : Math.floor(rule.redpacket_amount / rule2.rule_min_random_amount)
												)
												)}}</span>人</p>
										</a-form-item>
									</a-form>
									<a-form v-if="current == 1">
										<!-- 类型 -->
										<div class="content-msg">
											<p style="margin-bottom: 0px;line-height: 20px;color: #F56C6C;">
												扫码添加成员规则：在周期和特殊时期共存情况下，扫码优先添加特殊时期的成员
											</p>
										</div>
										<div style="height: 50px; margin-top: 10px;">
											<a-button style="float: right;margin-right: 20px;" @click="showChannelCode" type="primary">导入已有渠道活码</a-button>
										</div>
										<a-form-item label="类型" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-radio-group name="typeGroup" v-model="info.type"
											               @change="changeInfoType"
											               :disabled="typeof urlId !='undefined'">
												<a-radio :value="1">单人</a-radio>
												<a-radio :value="2">多人</a-radio>
											</a-radio-group>
											<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
										</a-form-item>
										<!-- 排班 -->
										<a-form-item label="企业成员" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<div>
												<a-button
														v-show="info.specialWeekList[0].mon.length == 0 || info.specialWeekList[0].tues.length == 0 || info.specialWeekList[0].wednes.length == 0 || info.specialWeekList[0].thurs.length == 0 || info.specialWeekList[0].fri.length == 0 || info.specialWeekList[0].satur.length == 0 || info.specialWeekList[0].sun.length == 0 "
														@click="addSpecialTime" >
													添加
												</a-button>
												<!--												<a-icon @click="addSpecialTime" style="font-size: 20px;cursor: pointer;"-->
												<!--												        type="plus"/>-->
											</div>
										</a-form-item>
										<a-form-item>
											<a-table
													:columns="specialWeekColumns"
													:dataSource="info.specialWeekList"
													:pagination="false"
													:rowClassName="rowClassName"
													style="max-width: 92%;margin-left: 6%;"
											>
												<span slot="mon">
													周一<a-icon type="edit" @click='editSpecialTime("mon")'
													          v-if="info.specialWeekList[0].mon.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="tues">
													周二<a-icon type="edit" @click='editSpecialTime("tues")'
													          v-if="info.specialWeekList[0].tues.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="wednes">
													周三<a-icon type="edit" @click='editSpecialTime("wednes")'
													          v-if="info.specialWeekList[0].wednes.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="thurs">
													周四<a-icon type="edit" @click='editSpecialTime("thurs")'
													          v-if="info.specialWeekList[0].thurs.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="fri">
													周五<a-icon type="edit" @click='editSpecialTime("fri")'
													          v-if="info.specialWeekList[0].fri.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="satur">
													周六<a-icon type="edit" @click='editSpecialTime("satur")'
													          v-if="info.specialWeekList[0].satur.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="sun">
													周日<a-icon type="edit" @click='editSpecialTime("sun")'
													          v-if="info.specialWeekList[0].sun.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="mon" slot-scope="text, record, index">
													<div v-for="item in record.mon" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.mon" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user2, userid) in user"
																	                 :key="user2.id">
																		{{user2.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.mon.length == 0">--</div>
												</span>
												<span slot="tues" slot-scope="text, record, index">
													<div v-for="item in record.tues" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.tues" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user2, userid) in user"
																	                 :key="user2.id">
																		{{user2.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.tues.length == 0">--</div>
												</span>
												<span slot="wednes" slot-scope="text, record, index">
													<div v-for="item in record.wednes" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.wednes" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user2, userid) in user"
																	                 :key="user2.id">
																		{{user2.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.wednes.length == 0">--</div>
												</span>
												<span slot="thurs" slot-scope="text, record, index">
													<div v-for="item in record.thurs" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.thurs" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user2, userid) in user"
																	                 :key="user2.id">
																		{{user2.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.thurs.length == 0">--</div>
												</span>
												<span slot="fri" slot-scope="text, record, index">
													<div v-for="item in record.fri" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.fri" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user2, userid) in user"
																	                 :key="user2.id">
																		{{user2.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.fri.length == 0">--</div>
												</span>
												<span slot="satur" slot-scope="text, record, index">
													<div v-for="item in record.satur" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.satur" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user2, userid) in user"
																	                 :key="user2.id">
																		{{user2.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.satur.length == 0">--</div>
												</span>
												<span slot="sun" slot-scope="text, record, index">
													<div v-for="item in record.sun" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template> </span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.sun" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user2, userid) in user"
																	                 :key="user2.id">
																		{{user2.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.sun.length == 0">--</div>
												</span>
											</a-table>
										</a-form-item>
										<a-form-item style="margin-left: 12.5%; padding-bottom: 20px;">
											<label style="margin-right: 20px;">特殊时期：</label>
											<a-switch :checked="info.specialTime == 1 ? true:false"
											          @change="changeSpecilTime()"/>
											<span style="color: #F56C6C;margin-left: 10px;">如遇到国家节假日或是企业自身重要日子，在特殊时期内，需要更换活码成员</span>
											<div style="background-color: white;padding: 10px 20px; width: 560px; border: 1px solid #D8D8D8;"
											     v-show="info.specialTime == 1">
												<div class="content-msg">
													<p style="margin-bottom: 2px;line-height: 20px;">
														1、系统默认生成一条每日24小时（00:00~00:00）数据，当时间点不在所新增的时段内，客户扫码后，添加的是“24小时”的企业成员。
													</p>
													<p style="margin-bottom: 2px;line-height: 20px;color: #FF562D" v-if="info.type == 2">
														2、因受官方限制，无法对动态部门的员工设置添加好友上限，只可针对指定活码成员进行设置。
													</p>
													<p style="margin-bottom: 0px;line-height: 20px;color: #FF562D" v-if="info.type == 2">
														3、渠道活码设置部门时，请确保设置的部门具有外部联系人权限，否则会导致该区间段的活码设置失效。
													</p>
												</div>
												<div v-for="(item, index) in info.specialDateList"
												     style="padding: 10px 10px 40px 10px;"
												     :class="index!=info.specialDateList.length - 1 ? 'border-dashed' : ''">
													<label>特殊时期{{index + 1}}：</label>
													<a-range-picker
															style="width: 200px;"
															:allowClear="false"
															:disabledDate="disabledDateDay"
															:value="item.specialDate"
															:defaultValue="[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]"
															format="YYYY-MM-DD"
															@change="e => changeSpecialDate(e,index)"
													/>
													<div v-for="(time, timeIndex) in item.time"
													     style="margin-left: 77px;">
														<a-time-picker :disabled='timeIndex == 0' :allowClear="false"
														               style="width: 100px;"
														               :minuteStep="60"
														               v-model="time.startTime"
														               @change="e => changeSpecialStartTime(e, index, timeIndex)"
														               :defaultOpenValue="moment('00:00', 'HH:mm')"
														               format="HH:mm">
														</a-time-picker>
														~
														<a-time-picker :disabled='timeIndex == 0' :allowClear="false"
														               style="width: 100px;"
														               v-model="time.endTime"
														               :minuteStep="60"
														               @change="e => changeSpecialEndTime(e, index, timeIndex)"
														               :defaultOpenValue="moment('00:00', 'HH:mm')"
														               format="HH:mm">
														</a-time-picker>
														<template v-if="info.type == 2">
															<a-button style="margin-left: 10px;"
															          @click="showDepartmentList(index, 0, timeIndex)">
																选择企业成员
															</a-button>
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in time.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<span v-if="time.userList.length > 0" style="display: inline-block; width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in time.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</span>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in time.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<span v-if="time.userList.length > 0" style="display: inline-block; vertical-align: top;">
																	<template v-for="(user, index) in time.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(time.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(time.userList) > 3">等{{getPartyNum(time.userList)}}个部门</template>
																</span>
															</a-tooltip>
														</template>
														<!--														<span style="margin-left: 10px;" v-if="info.type == 2 && (time.userList.length + time.party.length > 0)">-->
														<!--															已选择{{time.userList.length}}名成员，{{time.party.length}}个部门-->
														<!--														</span>-->
														<a-tooltip placement="top"
														           v-if="info.type == 2 && timeIndex == item.time.length - 1">
															<template slot="title">
																选择企业成员和选择部门必须选择一个。选择部门后，扫码后最多可添加当前部门的企业成员。如原来某部门是5人，后新增1人，则客户最多可添加该部门6位企业成员
															</template>
															<span style="margin-left: 10px;vertical-align: top">
																<a-icon type="question-circle"></a-icon>
															</span>
														</a-tooltip>
														<chooseStaffSelect ref="staffSelect"
														                   style="width: 160px;margin-left: 10px;display: inline-block;"
														                   v-if="info.type == 1" :index="index"
														                   :index2="timeIndex"
														                   :callback="selectStaffCallback"></chooseStaffSelect>
														<div>
															<span style="margin-right: 10px; color:#01b065; cursor: pointer;"
															      v-show="timeIndex == item.time.length - 1"
															      @click="addSpecialDateTimeList(index,timeIndex)">
																添加
															</span>
															<span style="cursor: pointer;color:#F56C6C;"
															      v-show="timeIndex != 0"
															      @click="deleteSpecialDateTimeList(index, timeIndex)">删除
															</span>
														</div>
													</div>
													<div style="float: right;">
														<a-button type="primary"
														          style="height: 26px;width: 94px;padding: 0px 5px;margin-right: 10px; font-size: 12px;"
														          
														          v-show="index == info.specialDateList.length - 1"
														          @click="addSpecialDate(index)">
															添加时期
														</a-button>
														<!--														<a-icon style="color: #01b065;margin-right: 10px" type="plus" v-show="index == info.specialDateList.length - 1"-->
														<!--														        @click="addSpecialDate(index)"/>-->
														<a-icon v-show="index != 0 || info.specialDateList.length > 1"
														        style="color: #F56C6C;" type="delete"
														        @click="deleteSpecialDate(index)"/>
													</div>
												</div>
											</div>
										</a-form-item>
										<a-form-item label="员工添加上限" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-switch :checked="info.is_limit == 2 ? true : false"
											          @change="changeIsCeiling"></a-switch>
											<span style="color: #F56C6C;">（因受官方限制，无法对动态部门的员工设置添加好友上限，只可针对指定活码成员进行设置）</span>
											<a-table
													v-if="info.is_limit == 2"
													:scroll="{ y: 450 }"
													:columns="limitUserColumns"
													:dataSource="info.user_limit"
													:pagination="false"
													:rowClassName="rowClassName"
													style="max-width: 60%;"
											>
												<span slot="limit" slot-scope="text, record, index">
													<a-input-number
															class="brush-input"
															:min="1"
															:max="99999999"
															placeholder="请填写上限人数"
															:formatter="limitDecimals"
															:parse="limitDecimals"
															@input.native="e => inputLimitNum(e, index)"
															v-model="record.limit"></a-input-number>
												</span>
											</a-table>
										</a-form-item>
										<a-form-item style="padding-bottom: 20px;"
										             v-if="current == 1 && info.is_limit == 2" label="备用员工"
										             :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">

											<template v-if="info.type == 2">
												<a-button style="margin-left: 10px;" @click="showDepartmentList('', 2)">
													选择企业成员
												</a-button>
												<a-tooltip placement="top">
													<template slot="title">
														<div>
															<span v-for="user in info.spare_employee"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
														</div>
													</template>
													<span v-if="info.spare_employee.length > 0" style="display: inline-block; max-width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;vertical-align: middle;margin: 0 10px;">
																<span v-for="user in info.spare_employee"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
															</span>
												</a-tooltip>
												<a-tooltip placement="top">
													<template slot="title">
														<template v-for="(user, index) in info.spare_employee">
															<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
														</template>
													</template>
													<span v-if="info.spare_employee.length > 0" style="display: inline-block; vertical-align: middle;">
																<template v-for="(user, index) in info.spare_employee">
																	<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(info.spare_employee) >= index">{{user.title}}</a-tag>
																</template>
																<template v-if="getPartyNum(info.spare_employee) > 3">等{{getPartyNum(info.spare_employee)}}个部门</template>
															</span>
												</a-tooltip>
											</template>

											<chooseStaffSelect ref="staffSelect3"
											                   style="width: 160px;margin-left: 10px;display: inline-block;"
											                   v-if="info.type == 1" :index="-1"
											                   :index2="-1"
											                   :callback="selectStaffCallback"></chooseStaffSelect>

										</a-form-item>
									</a-form>
									<a-form v-if="current == 2">
										<!-- 是否需要验证 -->
										<a-form-item label="自动添加好友" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-switch :checked="info.skip_verify == 0"
											          @change="changeSkipVerify"></a-switch>
											<span style="color: #F56C6C;">（开启时，客户添加时无需企业成员确认，自动成为好友）</span>
											<div v-if="info.skip_verify == 0">
												<a-radio-group name="radioGroup" v-model="info.verify_all_day">
													<a-radio :value="1">
														全天开启
													</a-radio>
													<a-radio :value="2">
														选择时间段
													</a-radio>
												</a-radio-group>
												<div v-if="info.verify_all_day == 2">
													<div v-for="(item, index) in timeList">
														<a-time-picker :allowClear="false" :minuteStep="60"
														               @change="changeSkipStartTime(index)"
														               v-model="item.startTime" format="HH:mm"/>
														~
														<a-time-picker :allowClear="false" :minuteStep="60"
														               @change="changeSkipEndTime(index)"
														               v-model="item.endTime" format="HH:mm"/>
														<a-icon @click="deleteSkipTime(index)"
														        v-if="timeList.length != 1"
														        :minuteStep="60"
														        style="color: #FF562D; margin-left: 10px;"
														        type="delete"></a-icon>
													</div>
													<a-button @click="addSkipTime">添加</a-button>
												</div>
											</div>
										</a-form-item>
										<!-- 客户标签 -->
										<a-form-item style="padding-bottom: 20px;"
										             :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<span slot="label">
										        客户标签&nbsp;
										        <a-tooltip title="客户通过扫描该渠道活码添加企业成员后，会被自动打上设置的客户标签">
										          <a-icon type="question-circle"/>
										        </a-tooltip>
											</span>
											<corpChooseTag :callback="modalVisibleChange4"
											               :hasChoose="tag_arr" v-if="isShowTag"></corpChooseTag>
										</a-form-item>
									</a-form>
									<a-form v-if="current == 3">
										<div class="content-msg">
											<p style="margin-bottom: 0px;line-height: 20px;color: #F56C6C;">
												欢迎语推送规则：在通用、周期及特殊时期欢迎语共存情况下，推送优先顺序为特殊时期的欢迎语 > 按周期的欢迎语 >
												通用欢迎语。如果企业微信后台已配置了可用的欢迎语，第三方系统配置欢迎语则不会推送，优先推送企业微信官方的。。
											</p>
										</div>
										<!-- 渠道欢迎语 -->
										<a-form-item label="扫码推送" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-switch :checked="pushValue" @click="changeStatus"/>
											（关闭后，客户扫该渠道活码，依然可对该客户自动打标签）
										</a-form-item>
										<!-- 推送内容 -->
										<!-- 内容 -->
										<a-tabs tabPosition="left" style="margin-top: 20px;" default-active-key="1"
										        v-if="pushValue">
											<a-tab-pane key="1" tab="通用欢迎语">
												<a-form-item v-if="pushValue"
												             style="padding-bottom: 20px;"
												             label="" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 21 }">
													<div style="width: 900px; background-color: #FFFFFF;padding: 10px 0;margin-top: 10px">
														<div class="wrap left-sider-content" style="margin-left: 68px;">
															<img src="../../../assets/wxHeader.png" alt
															     style="width:350px;border-bottom:1px solid #E2D6D6;"/>
															<div class="msg_content_body">
																<!--文本-->
																<div v-if="textAreaValueHeader && pushValue" class="mt">
																	<a-avatar
																			src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																			:size="36"
																			style="margin-right: 10px;float: left;"/>
																	<span v-html="textAreaValueHeader"
																	      class="item-info msg_content_txt"
																	      style="display:block;white-space: pre-wrap;word-wrap: break-word;"></span>
																</div>
															</div>
														</div>
														<div class="pull-right fl">
															<editor v-if="editorFlag" :text="textContent"
															        :textValue="textAreaValueHeader"
															        :isEmoji="false"
															        @changeText="changeText">
															</editor>
														</div>
													</div>
												</a-form-item>
											</a-tab-pane>
											<a-tab-pane key="2" tab="周期欢迎语" force-render>
												<a-form-item v-if="pushValue"
												             style="padding-bottom: 20px;"
												             label="" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 21 }">
													<a-switch :checked="info.is_welcome_week == 2"
													          @change="changeIsWelcomeWeek"></a-switch>
													<a-tabs v-if="info.is_welcome_week == 2"
													        v-model="weekTabKey"
													        size="large"
													        tabPosition="top"
													        style="width: 900px; margin-top: 5px;background-color: #FFF;padding-bottom: 20px;"
													        type="editable-card"
													        @edit="addWelcomeWeek">
														<a-tab-pane v-for="(week, index) in welcome_week_list"
														            :key="index"
														            style="margin-left: 26px;height: 550px; overflow-y: auto;width: calc(100% - 26px);"
														            :tab="'欢迎语'+(index+1)">
															<div :key="weekKey">
																<div style="margin: 10px 0;">
																	<label>选择周期：</label>
																	<template v-for="w in weekList">
																		<a-checkable-tag
																				:checked="week.date.indexOf(w.key) > -1"
																				style="cursor: pointer;"
																				v-if="!isDisabled(index, w.key)"
																				@change="selctedWeekDay(index, w.key)">
																			{{w.name}}
																		</a-checkable-tag>
																		<a-button
																				style="padding: 0 7px; margin-right: 5px;height: 26px;line-height: 25px;font-size: 12px;"
																				v-if="isDisabled(index, w.key)"
																				:disabled="true">
																			{{w.name}}
																		</a-button>
																	</template>
																	<!--															<a-select optionFilterProp="children"-->
																	<!--															          :showArrow="false"-->
																	<!--															          mode="multiple"-->
																	<!--															          v-model="week.date"-->
																	<!--															          style="width: 300px;margin-left: 10px;"-->
																	<!--															          placeholder="请选择周期"-->
																	<!--															>-->
																	<!--																<a-select-option v-for="w in weekList"-->
																	<!--																                 :key="w.key"-->
																	<!--																                 v-if="!isDisabled(index, w.key)">-->
																	<!--																	{{w.name}}-->
																	<!--																</a-select-option>-->
																	<!--															</a-select>-->
																</div>
																<div style="margin-left: 40px;"
																     v-for="(item, idx) in week.time">
																	<div style="margin-bottom: 10px;">
																		<label style="margin-right: 10px;">时间段{{idx +
																			1}}：</label>
																		<a-time-picker :allowClear="false"
																		               :minuteStep="60"
																		               v-model="item.startTime"
																		               format="HH:mm"/>
																		~
																		<a-time-picker :allowClear="false"
																		               :minuteStep="60"
																		               v-model="item.endTime"
																		               format="HH:mm"/>
																		<a-icon @click="deleteWelcomeWeekTime(index, idx)"
																		        v-if="week.time.length > 1"
																		        style="color: #FF562D; margin-left: 10px;"
																		        type="delete"></a-icon>
																	</div>
																	<div class="wrap left-sider-content">
																		<img src="../../../assets/wxHeader.png" alt
																		     style="width:350px;border-bottom:1px solid #E2D6D6;"/>
																		<div class="msg_content_body">
																			<!--文本-->
																			<div v-if="item.content.textAreaValueHeader && pushValue"
																			     class="mt">
																				<a-avatar
																						src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																						:size="36"
																						style="margin-right: 10px;float: left;"/>
																				<span v-html="item.content.textAreaValueHeader"
																				      class="item-info msg_content_txt"
																				      style="display:block;white-space: pre-wrap;word-wrap: break-word;"></span>
																			</div>
																		</div>
																	</div>
																	<div class="pull-right fl">
																		<cEditor :text="item.content.textContent"
																		         :type="1"
																		         :index="index"
																		         :idx="idx"
																		         :textValue="item.content.textAreaValueHeader"
																		         :isEmoji="false"
																		         @changeText="changeText1">
																		</cEditor>
																	</div>
																	<a-divider></a-divider>
																</div>
																<div style="margin-left: 40px;">
																	<a-button @click="addWelcomeWeekTime(index)">添加时间段
																	</a-button>
																</div>
															</div>
														</a-tab-pane>
													</a-tabs>
												</a-form-item>
											</a-tab-pane>
											<a-tab-pane key="3" tab="特殊时期欢迎语">
												<a-form-item v-if="pushValue"
												             style="padding-bottom: 20px;"
												             label="" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 21 }">
													<a-switch :checked="info.is_welcome_date == 2"
													          @change="changeIsWelcomeDate"></a-switch>
													<a-tabs
															v-model="dateTabKey"
															v-if="info.is_welcome_date == 2"
															size="large"
															tabPosition="top"
															style="width: 900px; margin-top: 5px;background-color: #FFF;padding-bottom: 20px;"
															type="editable-card"
															@edit="addWelcomeDate">
														<a-tab-pane v-for="(week, index) in welcome_date_list"
														            :key="index"
														            style="margin-left: 26px;height: 550px; overflow-y: auto;width: calc(100% - 26px);"
														            :tab="'欢迎语' + (index + 1)">
															<div :key="dateKey">
																<div style="margin: 10px 0;">
																	<label>时期{{index + 1}}：</label>
																	<a-range-picker
																			style="width: 270px;"
																			:allowClear='false'
																			:disabledDate="disabledDateDay"
																			format="YYYY-MM-DD"
																			v-model='week.date'
																	/>
																</div>
																<div style="margin-left: 40px;"
																     v-for="(item, idx) in week.time">
																	<div style="margin-bottom: 10px;">
																		<label style="margin-right: 10px;">时间段{{idx +
																			1}}：</label>
																		<a-time-picker :allowClear="false"
																		               :minuteStep="60"
																		               v-model="item.startTime"
																		               format="HH:mm"/>
																		~
																		<a-time-picker :allowClear="false"
																		               :minuteStep="60"
																		               v-model="item.endTime"
																		               format="HH:mm"/>
																		<a-icon @click="deleteWelcomeDateTime(index, idx)"
																		        v-if="week.time.length > 1"
																		        style="color: #FF562D; margin-left: 10px;"
																		        type="delete"></a-icon>
																	</div>
																	<div class="wrap left-sider-content">
																		<img src="../../../assets/wxHeader.png" alt
																		     style="width:350px;border-bottom:1px solid #E2D6D6;"/>
																		<div class="msg_content_body">
																			<!--文本-->
																			<div v-if="item.content.textAreaValueHeader && pushValue"
																			     class="mt">
																				<a-avatar
																						src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																						:size="36"
																						style="margin-right: 10px;float: left;"/>
																				<span v-html="item.content.textAreaValueHeader"
																				      class="item-info msg_content_txt"
																				      style="display:block;white-space: pre-wrap;word-wrap: break-word;"></span>
																			</div>
																		</div>
																	</div>
																	<div class="pull-right fl"
																	     style="margin-left: 40px;">
																		<cEditor :text="item.content.textContent"
																		         :type="2"
																		         :index="index"
																		         :idx="idx"
																		         :textValue="item.content.textAreaValueHeader"
																		         :isEmoji="false"
																		         @changeText="changeText1">
																		</cEditor>
																	</div>
																	<a-divider></a-divider>
																</div>
																<div style="margin-left: 40px;">
																	<a-button @click="addWelcomeDateTime(index)">添加时间段
																	</a-button>
																</div>
															</div>
														</a-tab-pane>
													</a-tabs>
												</a-form-item>
											</a-tab-pane>
										</a-tabs>
									</a-form>
								</div>
							</div>
							<div class="steps-action">
								<div style="position: fixed; left: 50%; transform: translate(-50%, 0);">
									<a-button v-if="current>0" @click="prev">
										上一步
									</a-button>
									<a-button v-if="current < steps.length - 1" style="margin-left: 8px" type="primary"
									          @click="next">
										下一步
									</a-button>
									<a-button style="margin-left: 8px"
									          :disabled="createDisabled"
									          v-if="current == steps.length - 1"
									          type="primary"
									          @click="saveWay"
									>
										<template v-if="typeof urlId == 'undefined'">创建</template>
										<template v-else>提交</template>
									</a-button>
								</div>
							</div>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>
		<!-- 选择成员 -->
		<chooseDepartment ref="user" :show="showModalDepartment" :is_from="7" :departmentDisabled="departmentDisabled" :chooseNum="chooseDepartmentNum"
		                  :callback="modalVisibleChange3" ></chooseDepartment>
		<!-- 企业微信选择弹窗 -->
		<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="channel-add"></wxModal>
		<!-- 添加周期成员 -->
		<a-modal :visible="specialTimeVisible" :title="specialTimeTitle" @ok="handleSpecialTime"
		         @cancel="handleCancelSpecialTime"
		         width="720px" :confirmLoading="addSpecialTimeLoading">
			<div class="content-msg">
				<p style="margin-bottom: 2px;line-height: 20px;">
					1、系统默认生成一条每日24小时（00:00~00:00）数据，当时间点不在所新增的时段内，客户扫码后，添加的是“24小时”的企业成员。
				</p>
				<p style="margin-bottom: 2px;line-height: 20px;color: #FF562D" v-if="info.type == 2">
					2、因受官方限制，无法对动态部门的员工设置添加好友上限，只可针对指定活码成员进行设置。
				</p>
				<p style="margin-bottom: 0px;line-height: 20px;color: #FF562D" v-if="info.type == 2">
					3、渠道活码设置部门时，请确保设置的部门具有外部联系人权限，否则会导致该区间段的活码设置失效。
				</p>
			</div>
			<a-form-item label="固定时段" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<div>
					<!--					<div>-->
					<!--						<a-icon type="plus" style="cursor: pointer;" @click="addTime"/>-->
					<!--						<span @click="addTime" style="cursor: pointer">添加时间段</span>-->
					<!--					</div>-->
					<div v-for="(item,index) in specialTimeList">
						<a-time-picker :disabled="index == 0" :allowClear="false" style="width: 100px;"
						               v-model="item.startTime"
						               :minuteStep="60"
						               @change="e => changeStartTime(e, index)"
						               :defaultOpenValue="moment('00:00', 'HH:mm')" format="HH:mm">
						</a-time-picker>
						~
						<a-time-picker :disabled="index == 0" :allowClear="false" style="width: 100px;"
						               v-model="item.endTime"
						               :minuteStep="60"
						               @change="e => changeEndTime(e, index)"
						               :defaultOpenValue="moment('00:00', 'HH:mm')" format="HH:mm">
						</a-time-picker>
						<chooseStaffSelect ref="staffSelect2"
						                   style="width: 160px;margin-left: 10px;display: inline-block;"
						                   v-if="info.type == 1 && specialTimeVisible" :index="index" :index2="0"
						                   :callback="selectStaffCallback2"></chooseStaffSelect>
						<template v-if="info.type == 2">
							<a-button style="margin-left: 10px;" @click="showDepartmentList(index, 1)">
								选择
							</a-button>
							<span style="margin-left: 5px"
							      v-show="item.userList.length + item.party.length> 0">已选择{{getUserNum(item.userList)}}名成员，{{item.party.length}}个部门</span>
						</template>
						<a-tooltip placement="top" v-if="info.type == 2 && index == specialTimeList.length - 1">
							<template slot="title">
								选择企业成员和选择部门必须选择一个。选择部门后，扫码后最多可添加当前部门的企业成员。如原来某部门是5人，后新增1人，则客户最多可添加该部门6位企业成员
							</template>
							<span style="margin-left: 10px;">
						<a-icon type="question-circle"></a-icon>
					</span>
						</a-tooltip>
						<div>
							<span @click="addTime(index)" style="color:#01b065; cursor: pointer;margin-right: 10px;"
							      v-show="index == specialTimeList.length - 1">添加</span>
							<span style="cursor: pointer;color:#F56C6C;" v-show="index != 0"
							      @click="deleteTime(index)">删除
							</span>
						</div>
					</div>
				</div>
			</a-form-item>
			<a-form-item label="适用周期" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<template v-for="(item,index) in weekList">
					<a-checkable-tag v-model="weekChecked[index]" style="cursor: pointer;"
					                 @change="changeWeekDay(item.key)">
						{{item.name}}
					</a-checkable-tag>
				</template>
			</a-form-item>
		</a-modal>
		<!-- 选择渠道活码 -->
		<a-modal :visible="codeVisible" title="选择渠道活码" @ok="handleCode"
		         @cancel="handleCancelCode"
		         :confirmLoading="codeLoading" width="888">
			<div>
				<div style="margin-bottom: 10px;">
					<a-input
							v-model="name" style="width:200px;"
							placeholder="请输入活码名称" @keydown.enter="searchName">
					</a-input>
					<a-button style="margin-left: 10px;" type="primary" @click="searchName">搜索</a-button>
					<a-button style="margin-left: 10px;" @click="clear">清除</a-button>
				</div>
				<a-spin tip="加载中..." size="large" :spinning="isTableLoading">
					<a-table :columns="columns" :dataSource="codeList" :pagination="false"
					         :rowClassName="rowClassName"
					         :rowSelection="{selectedRowKeys: codeId,onChange: onSelectChange,type:'radio'}">
					<span slot="type" slot-scope="text">
						<template v-if="text == 1">单人</template>
						<template v-else>多人</template>
					</span>
					</a-table>
					<div style="width: 100%;height: 32px;margin-top: 20px;" v-show="count > 0">
						<div style="height: 32px;float: left;line-height: 32px;">
							共有
							<span style="color: blue">{{count}}</span>个活码
						</div>
						<div class="pagination" style="height: 32px;float: right;">
							<a-pagination :total="count" showSizeChanger :showQuickJumper="false"
							              :current="page"
							              :pageSize="pageSize" :pageSizeOptions="['15','30']"
							              @change="changePage"
							              @showSizeChange="showSizeChange"/>
						</div>
					</div>
				</a-spin>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import wxModal from "@/components/WeChatModal.vue"
	import vuedraggable from "vuedraggable"
	import { VEmojiPicker } from "v-emoji-picker"
	import WEmoji from "@/common/js/wechatEmoji.js"
	import editor from '../../../components/editor/index'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import moment from "moment"
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import chooseStaffSelect from "@/components/ChooseStaffSelect"
	import cEditor from '../../../components/editor/channelCodeEditor'
	import chooseRule from "../../../components/redRule/chooseRule";
	import monent from 'moment'

	const welcomeContent = {
		text               : "", // 文本内容
		textAreaValueHeader: '',
		textContent        : '',
	};
	const columns = [
		{
			title    : '活码名称',
			dataIndex: "title",
			key      : "title"
		},
		{
			title      : '类型',
			dataIndex  : "type",
			key        : "type",
			scopedSlots: {customRender: "type"}
		},
		{
			title    : '分组',
			dataIndex: "way_group_name",
			key      : "way_group_name"
		}
	];
	export default {
		components: {
			cEditor,
			wxModal, chooseRule, vuedraggable, VEmojiPicker,
			editor, chooseDepartment, corpChooseTag, chooseStaffSelect,
			VNodes: {
				functional: true,
				render    : (h, ctx) => ctx.props.vnodes,
			},
		},
		props     : {
			defaultTypeName: {
				type   : Object,
				default: () => {
					return {
						1: '文字',
						2: '图片',
						3: '音频',
						4: '视频',
						5: '图文',
					}
				}
			}
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpName             : '',
				showModalDepartment  : false,
				departmentDisabled   : 0,
				isShowTag            : true,
				chooseDepartmentNum  : 0,
				current              : 0,
				steps                : [  // 步骤名
					{
						title: '活动信息'
					},
					{
						title: '引流成员设置',
					},
					{
						title: '高级设置',
					},
					{
						title: '欢迎语设置',
					}
				],
				editorFlag           : false,
				textAreaValueHeader  : '',
				textContent          : '',
				wxInfo               : [], //微信公众号列表
				avatarImg            : "", //微信公众号头像
				showModal2           : false, //公众号组件弹窗显示与隐藏
				groupList2           : [],
				msg_title            : '',//二维码名称
				validity             : 1,//有效期
				tag_arr              : [], //标签值
				img                  : false, // 图片url
				text                 : "", // 文本内容
				// 标签
				group_id             : [],//选择标签的分组
				checked              : [],
				localChecked         : [],
				pushValue            : true,//新建扫码推送类型
				jumpVisible          : false,//添加图文气泡的显示与隐藏
				commonUrl            : this.$store.state.commonUrl, //公共的链接
				urlId                : "", //地址栏参数id值
				agentId              : '',
				newTagList           : [], //新建标签数组
				createDisabled       : false,//创建按钮的置灰
				isLoading            : false, //Loading 组件显示与隐藏
				formLayout           : 'horizontal',
				form                 : this.$form.createForm(this, {name: 'contactWay'}),
				startDate            : null,
				endDate              : null,
				loading              : false,
				name                 : '',
				page                 : 1,
				pageSize             : 15,
				isTableLoading       : false,
				columns,
				count                : 0,
				codeId               : [],
				codeList             : [],
				codeVisible          : false,
				codeLoading          : false,
				redpacket_status     : 1,
				redpacket_amount     : 0, // 投放金额，编辑只可增大不可减小
				rule1                : {     // 导入红包规则信息
					rule_type             : 1,
					rule_name             : '',
					rule_fixed_amount     : '0.3',
					rule_min_random_amount: '0.3',
					rule_max_random_amount: '200',
					rule_pic_url          : '/static/image/default-redpacket.png',
					rule_title            : '',
					rule_des              : '',
					rule_thanking         : '',
				},
				rule2                : {      // 新建红包规则信息
					rule_name             : '',
					rule_type             : 1,
					rule_fixed_amount     : 0.3,
					rule_min_random_amount: '',
					rule_max_random_amount: '',
					rule_pic_url          : '/static/image/default-redpacket.png',
					rule_title            : '恭喜发财，大吉大利',
					rule_des              : '戳我领取红包',
					rule_thanking         : '恭喜发财，大吉大利',
				},
				rule                 : {
					name                  : '',
					time_type             : 1,
					start_time            : '', // 开始时间
					end_time              : '', // 结束时间
					reserve_day           : 30,
					redrule_type          : 2,
					rule_id               : 0,
					rule_name             : '',
					rule_type             : 1,
					rule_fixed_amount     : 0.3,
					rule_min_random_amount: '',
					rule_max_random_amount: '',
					rule_pic_url          : '/static/image/default-redpacket.png',
					rule_title            : '恭喜发财，大吉大利',
					rule_des              : '戳我领取红包~',
					rule_thanking         : '恭喜发财，大吉大利',
					rule_save             : 1,
					redpacket_amount      : 6000,
				},
				info                 : {
					type           : 1,
					scene          : 2,
					remark         : '',
					skip_verify    : 0,
					verify_all_day : 1,
					state          : '',
					style          : 1,
					user           : [],
					specialTime    : 0,
					specialWeekList: [
						{
							mon   : [],
							tues  : [],
							wednes: [],
							thurs : [],
							fri   : [],
							satur : [],
							sun   : [],
						},
					],
					specialDateList: [
						{
							specialDate: [moment(new Date()), moment(new Date())],
							date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
							time       : [
								{
									startTime : moment('00:00', 'HH:mm'),
									endTime   : moment('00:00', 'HH:mm'),
									start_time: '00:00',
									end_time  : '00:00',
									userList  : [],
									party     : []
								}
							],
						}
					],
					is_limit       : 1,
					spare_employee : [],
					user_limit     : [],
					party          : [],
					tag_ids        : [],
					is_welcome_week: 1,
					is_welcome_date: 1,
				},
				timeList             : [{
					startTime: monent('09:00', 'HH-mm'),
					endTime  : monent('17:00', 'HH-mm'),
				}],
				welcomeTabKey        : 1,
				weekTabKey           : 0,
				weekKey              : 0,
				welcome_week_list    : [
					{
						date: [],
						time: [
							{
								startTime: null,
								endTime  : null,
								content  : JSON.parse(JSON.stringify(welcomeContent))
							}
						]
					}
				],
				dateTabKey           : 0,
				dateKey              : 0,
				welcome_date_list    : [
					{
						date: [],
						time: [
							{
								startTime: null,
								endTime  : null,
								content  : JSON.parse(JSON.stringify(welcomeContent))
							}
						]
					}
				],
				specialTimeVisible   : false, // 周排班弹窗显示隐藏
				addSpecialTimeLoading: false, // 添加周排班loading
				specialTimeTitle     : '添加企业成员', //
				weekList             : [
					{
						key : 'mon',
						name: '周一'
					},
					{
						key : 'tues',
						name: '周二'
					},
					{
						key : 'wednes',
						name: '周三'
					},
					{
						key : "thurs",
						name: '周四'
					},
					{
						key : 'fri',
						name: '周五'
					},
					{
						key : 'satur',
						name: '周六'
					},
					{
						key : 'sun',
						name: '周日'
					}
				],
				weekArr              : {
					mon   : 0,
					tues  : 1,
					wednes: 2,
					thurs : 3,
					fri   : 4,
					satur : 5,
					sun   : 6
				},
				weekDayKey           : [],
				weekChecked          : new Array(7).fill(false),
				limitUserColumns     : [
					{
						title    : "名称",
						dataIndex: "name",
						key      : "name",
					},
					{
						title      : "上限",
						dataIndex  : "limit",
						key        : "limit",
						scopedSlots: {customRender: "limit"}
					}
				],
				specialWeekColumns   : [
					{
						slots      : {title: 'mon'},
						// title      : "周一",
						dataIndex  : "mon",
						width      : '14%',
						key        : "mon",
						scopedSlots: {customRender: "mon"}
					},
					{
						slots      : {title: 'tues'},
						// title      : "周二",
						dataIndex  : "tues",
						width      : '14%',
						key        : "tues",
						scopedSlots: {customRender: "tues"}
					},
					{
						slots      : {title: 'wednes'},
						// title      : "周三",
						dataIndex  : "wednes",
						width      : '14%',
						key        : "wednes",
						scopedSlots: {customRender: "wednes"}
					},
					{
						slots      : {title: 'thurs'},
						// title      : "周四",
						dataIndex  : "thurs",
						width      : '14%',
						key        : "thurs",
						scopedSlots: {customRender: "thurs"}
					},
					{
						slots      : {title: 'fri'},
						// title      : "周五",
						dataIndex  : "fri",
						width      : '14%',
						key        : "fri",
						scopedSlots: {customRender: "fri"}
					},
					{
						slots      : {title: 'satur'},
						// title      : "周六",
						dataIndex  : "satur",
						width      : '14%',
						key        : "satur",
						scopedSlots: {customRender: "satur"}
					},
					{
						slots      : {title: 'sun'},
						// title      : "周日",
						dataIndex  : "sun",
						width      : '14%',
						key        : "sun",
						scopedSlots: {customRender: "sun"}
					},
				],
				specialTimeUserList  : [],
				timeIndex            : "",
				currentType          : '',
				currentIndex         : '',
				specialTimeList      : [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : []
					},
				],
				user                 : [],
				party                : [],
				corpId               : corpId,//企业微信选中的id
				groupList            : [], //标签分组列表
				editGroupId          : '', // 标签分组
				selectedUser         : [],
			}
		},

		methods: {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push('/redForNew/list?isRefresh=1')
			},
			changeCurrent (index) {
				this.current = index
				if (this.current == 1) {
					let that = this
					this.$nextTick(() => {
						if (that.info.is_limit == 2) {
							that.$refs.staffSelect3.userId = that.info.spare_employee ? that.info.spare_employee : []
						}
					})
					this.changeUser()
				}
			},
			changeUser () {
				let that = this
				let arr = []
				that.info.specialDateList.map((item, index) => {
					item.time.map((item2, index2) => {
						arr.push(item2.userList)
					})
				})
				that.$nextTick(() => {
					arr.map((item, index) => {
						if (that.$refs.staffSelect) {
							that.$refs.staffSelect[index].userId = item
						}
					})
				})
			},
			// 活动时间
			disabledDate (current) {
				// Can not select days before today and today
				return current && current < moment().startOf('day');
			},
			changeRedStartTime (date, dateString) {
				if (dateString && this.startDate && dateString > moment(this.endDate).format("YYYY-MM-DD HH:mm:ss")) {
					this.$message.warning('开始时间不能晚于结束时间')
				}
				if (dateString) {
					this.startDate = date
				} else {
					this.startDate = null
				}
				this.rule.start_time = dateString
			},
			changeRedEndTime (date, dateString) {
				if (dateString && this.startDate && dateString < moment(this.startDate).format("YYYY-MM-DD HH:mm:ss")) {
					this.$message.warning('结束时间不能早于开始时间')
				}
				if (dateString) {
					this.endDate = date
				} else {
					this.endDate = null
				}
				this.rule.end_time = dateString
			},
			changeSelect (ruleId) {
				this.rule.rule_id = ruleId
				if (this.rule.rule_id) {
					this.getRuleDetail()
				}
			},
			changeRuleSave () {
				this.rule.rule_save = (this.rule.rule_save + 1) % 2
			},
			async getRuleDetail () {
				const {data: res} = await this.axios.post("red-pack-rule/rule-info", {
					uid: localStorage.getItem('uid'),
					id : this.rule.rule_id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.rule1.rule_name = res.data.name
					this.rule1.rule_type = res.data.type
					this.rule1.rule_fixed_amount = res.data.fixed_amount
					this.rule1.rule_min_random_amount = res.data.min_random_amount
					this.rule1.rule_max_random_amount = res.data.max_random_amount
					this.rule1.rule_pic_url = res.data.pic_url
					this.rule1.rule_title = res.data.title
					this.rule1.rule_des = res.data.des
					this.rule1.rule_thanking = res.data.thanking
				}
			},
			changeType2 (e) {
				this.rule2.rule_type = e.target.value
			},
			// 新建定额红包类型切换
			changeType1 (e) {
				this.rule1.rule_type = e.target.value
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
					this.rule2.rule_pic_url = res.data.local_path
					this.loading = false
				}
			},
			moment,
			getUserNum(userList) {
				let num = 0
				for(let i = 0; i < userList.length; i++) {
					if(userList[i].scopedSlots.title == "custom") {
						num++
					}
				}
				return num
			},
			getPartyNum(userList) {
				let num = 0
				for(let i = 0; i < userList.length; i++) {
					if(userList[i].scopedSlots.title != "custom") {
						num++
					}
				}
				return num
			},
			getThreePartyIndex(userList) {
				let num = 0
				let index = 0
				for(let i = 0; i < userList.length; i++) {
					index = i
					if(num < 2) {
						if(userList[i].scopedSlots.title != "custom") {
							num++
						}
					} else {
						return index
					}
				}
				return index
			},
			// 选择成员弹窗显示
			showDepartmentList (index, type, timeIndex) {
				if (type == 1) {
					this.currentIndex = index
					this.currentType = type
					let arr = []
					this.specialTimeList[index].userList.map(x=>{
						arr.push(x.id)
					})
					this.chooseDepartmentNum = this.specialTimeList[index].userList.length
					this.departmentDisabled = 0
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.specialTimeList[index].userList))
				} else if (type == 2) {
					this.currentIndex = index
					this.currentType = type
					let arr = []
					this.info.spare_employee.map(x=>{
						arr.push(x.id)
					})
					this.chooseDepartmentNum = this.info.spare_employee.length
					this.departmentDisabled = 1
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.info.spare_employee))
				} else {
					this.currentType = 0
					this.currentIndex = index
					this.timeIndex = timeIndex
					this.currentType = type
					let arr = []
					this.info.specialDateList[index].time[timeIndex].userList.map(x=>{
						arr.push(x.id)
					})
					this.chooseDepartmentNum = this.info.specialDateList[index].time[timeIndex].userList.length
					this.departmentDisabled = 0
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.info.specialDateList[index].time[timeIndex].userList))
				}
				this.specialTimeVisible = false
				this.showModalDepartment = true
			},
			// 重置成员
			clearDepartmentList (index, type) {
				if (type == 1) {
					this.specialTimeList[index].userList = []
				} else if (type == 0) {
					this.specialTimeUserList = []
				} else if (type == 2) {
					this.info.spare_employee = []
				} else {
					this.checkedList = []
					this.chooseNum = 0
				}
				this.$refs.user.rightIdList = []
				this.$refs.user.rightList = []
				// this.getCustomList()
			},
			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.currentType == 1) {
						this.specialTimeList[this.currentIndex].userList = []
						this.specialTimeList[this.currentIndex].party = []
						if (userNum + departmentNum > 0) {
							list.map(item => {
								this.specialTimeList[this.currentIndex].userList.push(JSON.parse(JSON.stringify(item)))
								if(item.scopedSlots.title != "custom") {
									this.specialTimeList[this.currentIndex].party.push(item.ids)
								}
							})
						}
						this.getUniqueUserList()
						this.specialTimeVisible = true
					} else if (this.currentType == 2) {
						this.info.spare_employee = []
						let flag = false
						for(let i = 0; i < list.length; i++) {
							if(list[i].isLeaf !== true || list[i].scopedSlots.title == 'custom') {
								flag = true
							}
						}
						if(!flag) {
							this.$message.destroy()
							this.$message.warning('备用员工不能为空部门')
							this.showModalDepartment = false
							return false
						}
						if (userNum + departmentNum > 0) {
							list.map(item => {
								this.info.spare_employee.push(JSON.parse(JSON.stringify(item)))
							})
						}
					} else {
						this.info.specialDateList[this.currentIndex].time[this.timeIndex].userList = []
						this.info.specialDateList[this.currentIndex].time[this.timeIndex].party = []
						if (userNum + departmentNum > 0) {
							list.map(item => {
								this.info.specialDateList[this.currentIndex].time[this.timeIndex].userList.push(JSON.parse(JSON.stringify(item)))
								if(item.scopedSlots.title != "custom") {
									this.info.specialDateList[this.currentIndex].time[this.timeIndex].party.push(item.ids)
								}
							})
						}
						this.getUniqueUserList()
					}
				} else {
					if (this.currentType == 1) {
						this.specialTimeVisible = true
					}
				}
				this.showModalDepartment = false
			},
			// 获取单人类型成员列表
			async getUserList () {
				const {data: res} = await this.axios.post('work-user/get-all-user', {
					suite_id: 1,
					corp_id : this.corpId,
					is_all  : 1,//不带分页
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.isLoading = false;
				} else {
					this.user = res.data.info
					this.isLoading = false;
				}
			},
			// 获取部门列表
			async getPartyList () {
				const {data: res} = await this.axios.post('work-contact-way/get-party-list', {
					suite_id: 1,
					corp_id : this.corpId,
				})

				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false;
					this.party = res.data.party_list
				}
			},
			//选择成员组件回调->按特殊时期编辑
			selectStaffCallback (event, id, index, index2) {
				if (event == "ok") {
					if (index == -1) {
						this.info.spare_employee = id
					} else {
						this.info.specialDateList[index].time[index2].userList = id
						this.getUniqueUserList()
					}

				}
			},
			//选择成员组件回调->按周期编辑
			selectStaffCallback2 (event, id, index) {
				if (event == "ok") {
					this.specialTimeList[index].userList = id
				}
			},
			// 编辑框内容转化
			changeWelcome (content, welcome_content) {
				content.textContent = welcome_content.text_content
				content.textAreaValueHeader = welcome_content.text_content.replace(
					/{nickname}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>'
				).replace(/\n/g, '<br>')
				content.editorFlag = true
			},
			//点击修改进入页面，获取详情
			async getCodeDetail () {
				let that = this
				const {data: res} = await this.axios.post('work-contact-way/get', {
					suite_id : 1,
					corp_id  : this.corpId,
					config_id: this.codeId[0],
					id       : this.codeId[0]
				})
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg)
					this.codeVisible = false
					this.codeLoading = false
				} else {
					// 欢迎语赋值
					this.changeContent(res)
					this.codeVisible = false
					this.codeLoading = false
					this.codeId = []
					this.name = ''
				}
			},
			// 欢迎语内容转化
			changeContent (res) {
				if (res.data.contact_way.welcome_content) {
					let welcome_content = res.data.contact_way.welcome_content
					this.pushValue = welcome_content.status == 1 ? true : false
					this.changeWelcome(this, welcome_content)
				}

				let wayInfo = res.data.contact_way
				let wayUser = wayInfo.user
				let wayParty = wayInfo.department
				if (!wayInfo.remark) {
					wayInfo.remark = ''
				}
				if (wayInfo.skip_verify == 0 && wayInfo.verify_all_day == 2) {
					this.timeList = []
					for (let vd of wayInfo.verify_date) {
						let st = {
							startTime: null,
							endTime  : null
						}
						st.startTime = moment(vd.start_time, 'HH:mm')
						st.endTime = moment(vd.end_time, 'HH:mm')
						this.timeList.push(JSON.parse(JSON.stringify(st)))
					}
				}
				delete wayInfo.welcome_content
				delete wayInfo.id
				delete wayInfo.corp_id
				delete wayInfo.is_del
				delete wayInfo.qr_code
				delete wayInfo.add_num
				delete wayInfo.department
				delete wayInfo.update_time
				delete wayInfo.create_time
				this.info = wayInfo
				// 特殊时间--日期和时间赋值
				for (let i = 0; i < this.info.specialDateList.length; i++) {
					this.info.specialDateList[i]['specialDate'] = [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]
					this.info.specialDateList[i]['specialDate'][0] = moment(this.info.specialDateList[i].date[0], "YYYY-MM-DD")
					this.info.specialDateList[i]['specialDate'][1] = moment(this.info.specialDateList[i].date[1], "YYYY-MM-DD")
					for (let j = 0; j < this.info.specialDateList[i].time.length; j++) {
						this.info.specialDateList[i].time[j]['startTime'] = moment(new Date(), 'HH:mm')
						this.info.specialDateList[i].time[j]['endTime'] = moment(new Date(), 'HH:mm')
						this.info.specialDateList[i].time[j]['startTime'] = moment(this.info.specialDateList[i].time[j]['start_time'], "HH:mm")
						this.info.specialDateList[i].time[j]['endTime'] = moment(this.info.specialDateList[i].time[j]['end_time'], "HH:mm")
					}
				}
				if (this.info.specialDateList.length == 0) {
					this.info.specialDateList = [
						{
							specialDate: [moment(new Date()), moment(new Date())],
							date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
							time       : [
								{
									startTime : moment('00:00', 'HH:mm'),
									endTime   : moment('00:00', 'HH:mm'),
									start_time: '00:00',
									end_time  : '00:00',
									userList  : [],
									party     : []
								}
							],
						}
					]
				}
				// 周排班时间赋值
				let weekDay = ['mon', 'tues', 'wednes', 'thurs', 'fri', 'satur', 'sun']
				for (let k = 0; k < 7; k++) {
					let times = this.info.specialWeekList[0][weekDay[k]]
					for (let l = 0; l < times.length; l++) {
						times[l]['startTime'] = moment(times[l]['start_time'], 'HH:mm')
						times[l]['endTime'] = moment(times[l]['end_time'], 'HH:mm')
					}
				}
				this.tag_arr = []
				if (wayInfo.tag_ids.length > 0) {
					wayInfo.tag_ids.map((tagId) => {
						this.tag_arr.push(String(tagId));
					})
				}
				this.isShowTag = true
				this.is_welcome_week = wayInfo.is_welcome_week
				if (wayInfo.is_welcome_week == 2) {
					this.welcome_week_list = []
					for (let week of wayInfo.welcome_week_list) {
						let welcome_week_list = {}
						welcome_week_list.date = JSON.parse(JSON.stringify(week.date))
						let time1 = []
						for (let time of week.time) {
							let t = {
								startTime: null,
								endTime  : null,
								content  : {}
							}
							t.startTime = moment(time.start_time, 'HH:mm')
							t.endTime = moment(time.end_time, 'HH:mm')
							this.changeWelcome(t.content, time.content)
							time1.push(JSON.parse(JSON.stringify(t)))
						}
						welcome_week_list.time = JSON.parse(JSON.stringify(time1))
						this.welcome_week_list.push(JSON.parse(JSON.stringify(welcome_week_list)))
					}
				}
				this.weekKey++
				this.is_welcome_date = wayInfo.is_welcome_date
				if (wayInfo.is_welcome_date == 2) {
					this.welcome_date_list = []
					for (let date of wayInfo.welcome_date_list) {
						let welcome_date_list = {}
						welcome_date_list.date = JSON.parse(JSON.stringify([moment(date.date[0], "YYYY-MM-DD"), moment(date.date[1], "YYYY-MM-DD")]))
						let time1 = []
						for (let time of date.time) {
							let t = {
								startTime: null,
								endTime  : null,
								content  : {}
							}
							t.startTime = moment(time.start_time, 'HH:mm')
							t.endTime = moment(time.end_time, 'HH:mm')
							this.changeWelcome(t.content, time.content)
							time1.push(JSON.parse(JSON.stringify(t)))
						}
						welcome_date_list.time = JSON.parse(JSON.stringify(time1))
						this.welcome_date_list.push(JSON.parse(JSON.stringify(welcome_date_list)))
					}
				}
				this.dateKey++
				this.getUniqueUserList()
			},
			// 设置成员弹窗数据
			setUser (users) {
				let that = this
				let checkedKeys = []
				let user = []
				let selectUser = []
				let u = {
					avatar     : "",
					disabled   : false,
					id         : '',
					key        : '',
					scopedSlots: {
						title: "custom"
					},
					title      : ''
				}
				if (users.length > 0) {
					users.map(item => {
						u.avatar = item.avatar
						u.id = item.id
						u.title = item.name
						if (item.user_key.toString().indexOf(",") > 0) {
							let arr = item.user_key.split(',')
							checkedKeys = checkedKeys.concat(arr)
							u.key = arr[0]
							user.push(JSON.parse(JSON.stringify(u)))
							u.key = item.user_key
							selectUser.push(JSON.parse(JSON.stringify(u)))
						} else {
							checkedKeys.push(item.user_key)
							u.key = item.user_key
							user.push(JSON.parse(JSON.stringify(u)))
							selectUser.push(JSON.parse(JSON.stringify(u)))
						}
					})
				}
				that.$refs.user.checkedKeys = checkedKeys
				that.$refs.user.checkedKeysArr = checkedKeys
				that.$refs.user.checkedNodes = checkedKeys
				that.$refs.user.staffListArr = user
				that.chooseDepartmentNum = user.length
				that.$refs.user.keyList = selectUser
			},
			next () {
				if (this.checkedOut(this.current)) {
					this.current++
					if (this.current == 1) {
						let that = this
						let arr = []
						this.$nextTick(() => {
							if (that.info.is_limit == 2) {
								that.$refs.staffSelect3.userId = that.info.spare_employee ? that.info.spare_employee : []
							}
							that.info.specialDateList.map((item, index) => {
								item.time.map((item2, index2) => {
									arr.push(item2.userList)
								})
							})
							that.$nextTick(() => {
								arr.map((item, index) => {
									if (that.$refs.staffSelect) {
										that.$refs.staffSelect[index].userId = item
									}
								})
							})
						})
					}
				}
			},
			prev () {
				this.current--
				if (this.current == 1) {
					let that = this
					let arr = []
					this.$nextTick(() => {
						if (that.info.is_limit == 2) {
							that.$refs.staffSelect3.userId = that.info.spare_employee ? that.info.spare_employee : []
						}
						that.info.specialDateList.map((item, index) => {
							item.time.map((item2, index2) => {
								arr.push(item2.userList)
							})
						})
						that.$nextTick(() => {
							arr.map((item, index) => {
								if (that.$refs.staffSelect) {
									that.$refs.staffSelect[index].userId = item
								}
							})
						})
					})
				}
			},
			checkedOut (index) {
				let _this = this
				let dataFlag = false
				let sendData = JSON.parse(JSON.stringify(this.info))
				if (index == 0) {
					if (!this.rule.name) {
						this.$message.destroy()
						this.$message.warning("请填写红包渠道活码名称！")
						this.current = 0
						return false
					}
					if (this.rule.time_type == 2 && (this.rule.end_time == '' || this.rule.start_time == '')) {
						this.$message.destroy()
						this.$message.warning("请检查活动时间！")
						this.current = 0
						return false
					}
					if (this.rule.time_type == 2 && this.rule.end_time <= this.rule.start_time) {
						this.$message.destroy()
						this.$message.warning("开始时间需早于结束时间！")
						this.current = 0
						return false
					}
					if (this.rule.time_type == 2 && !this.rule.reserve_day) {
						this.$message.destroy()
						this.$message.warning("请填写活码有效期！")
						this.current = 0
						return false
					}
					if (this.rule.redrule_type == 1) {
						if (!this.rule.rule_id) {
							this.$message.destroy()
							this.$message.warning("请选择红包规则！")
							this.current = 0
							return false
						}
						if (this.rule1.rule_type == 1) {
							if(this.rule.redpacket_amount < this.rule1.rule_fixed_amount) {
								this.$message.destroy()
								this.$message.warning('投放金额不能小于单个红包金额')
								return false
							}
						}
						if (this.rule1.rule_type == 2) {
							if(this.rule.redpacket_amount <= this.rule1.rule_min_random_amount) {
								this.$message.destroy()
								this.$message.warning('投放金额不能小于单个红包金额')
								return false
							}
						}
					} else if (this.rule.redrule_type == 2) {
						if (this.rule2.rule_name == '') {
							this.$message.destroy()
							this.$message.warning('请输入红包规则名称')
							return false
						}
						if (this.rule2.rule_type == 1) {
							if (!this.rule2.rule_fixed_amount) {
								this.$message.destroy()
								this.$message.warning('请输入红包金额')
								return false
							}
							if(this.rule.redpacket_amount < this.rule2.rule_fixed_amount) {
								this.$message.destroy()
								this.$message.warning('投放金额不能小于单个红包金额')
								return false
							}
						}
						if (this.rule2.rule_type == 2) {
							if (!this.rule2.rule_min_random_amount || !this.rule2.rule_max_random_amount) {
								this.$message.destroy()
								this.$message.warning('请输入红包金额')
								return false
							} else if (this.rule2.rule_min_random_amount >= this.rule2.rule_max_random_amount) {
								this.$message.destroy()
								this.$message.warning('随机金额最大值必须大于最小值')
								return false
							} else if(this.rule.redpacket_amount < this.rule2.rule_min_random_amount) {
								this.$message.destroy()
								this.$message.warning('投放金额不能小于单个红包金额')
								return false
							}

						}
						if (this.rule2.rule_title.trim() == '') {
							this.$message.destroy()
							this.$message.warning('请填写标题')
							return false
						}
					}
					if (!this.rule.redpacket_amount) {
						this.$message.destroy()
						this.$message.warning('请输入投放金额')
						return false
					}
					if (this.redpacket_status != 1) {
						if(this.redpacket_amount > this.rule.redpacket_amount) {
							this.$message.destroy()
							this.$message.warning('投放金额只可增加，不可减少！')
							return false
						}
					}
				} else if (index == 2) {
					if (this.info.skip_verify == 0) {
						if (this.info.verify_all_day == 2) {
							for (let index = 0; index < this.timeList.length; index++) {
								let item = this.timeList[index]
								if (item.startTime == null || item.endTime == null) {
									_this.$message.destroy()
									_this.$message.warning("请补全自动添加好友第" + (index + 1) + "个时间段！")
									_this.current = 1
									dataFlag = true
									return false
								}
								let startTime = moment(item.startTime).format('HH:mm')
								let endTime = moment(item.endTime).format('HH:mm')
								if (startTime >= endTime && endTime != '00:00') {
									_this.$message.destroy()
									_this.$message.warning("自动添加好友第" + (index + 1) + "个时间段开始时间需早于结束时间！")
									_this.current = 1
									dataFlag = true
									return false
								}
								if (dataFlag) {
									return false
								}
								for (let idx = index + 1; idx < _this.timeList.length; idx++) {
									if (idx > index) {

										let startTime1 = moment(_this.timeList[idx].startTime).format('HH:mm')
										let endTime1 = moment(_this.timeList[idx].endTime).format('HH:mm')
										// 判断时间是否存在重叠
										if ((startTime >= startTime1 && startTime < endTime1) || (endTime > startTime1 && endTime <= endTime1) || (startTime >= startTime1 && endTime1 == '00:00') || (endTime > startTime1 && endTime1 == '00:00') || (startTime1 >= startTime && startTime1 < endTime) || (endTime1 > startTime && endTime >= endTime1) || (startTime1 >= startTime && endTime == '00:00') || (endTime1 > startTime && endTime == '00:00')) {
											_this.$message.destroy()
											_this.$message.warning("自动加好友的第" + (index + 1) + "个时间段与第" + (idx + 1) + "个时间段存在冲突，请修改！")
											dataFlag = true
											_this.current = 1
											return false
										}
									}
								}
								if (dataFlag) {
									return false
								}
							}
							if (dataFlag) {
								return false
							}
						}
					}
				} else if (index == 1) {
					let weekList = this.info.specialWeekList[0]
					if (weekList.mon.length == 0 || weekList.tues.length == 0 || weekList.wednes.length == 0 || weekList.thurs.length == 0 || weekList.fri.length == 0 || weekList.satur.length == 0 || weekList.sun.length == 0) {
						_this.$message.destroy()
						_this.$message.warning('周成员缺失！')
						_this.current = 2
						return false
					}
					let weekArr1 = ['mon', 'tues', 'wednes', 'thurs', 'fri', 'satur', 'sun']
					for (let i = 0; i < 7; i++) {
						for (let k = 0; k < this.info.specialWeekList[0][weekArr1[i]].length; k++) {
							let temp = this.info.specialWeekList[0][weekArr1[i]][k]
							if (this.info.type == 2 && temp.userList.length == 0 && temp.party.length == 0) {
								_this.$message.destroy()
								this.$message.warning("请选择成员或企业微信部门")
								this.addSpecialTimeLoading = false
								_this.current = 2
								return false
							} else if (this.info.type == 2 && temp.userList.length == 1 && temp.userList[0].is_del == 1) {
								_this.$message.destroy()
								this.$message.warning("当前成员不可用，请修改")
								this.addSpecialTimeLoading = false
								_this.current = 2
								return false
							} else if (this.info.type == 2 && temp.userList.length > 0) {
								let flag = false
								temp.userList.map(user => {
									if (user.is_del != 1) {
										flag = true
										return false
									}
								})
								if (!flag) {
									_this.$message.destroy()
									this.$message.warning("当前成员不可用，请修改")
									this.addSpecialTimeLoading = false
									_this.current = 2
									return false
								}
							}
							if (this.info.type == 1 && temp.userList.length == 0) {
								_this.$message.destroy()
								this.$message.warning("请选择成员")
								this.addSpecialTimeLoading = false
								_this.current = 2
								return false
							} else if (this.info.type == 1 && typeof temp.userList != 'number') {
								_this.$message.destroy()
								this.$message.warning("当前成员不可用，请修改")
								this.addSpecialTimeLoading = false
								_this.current = 2
								return false
							}
						}
					}
					for (let i = 0; i < this.info.specialDateList.length; i++) {
						for (let j = i + 1; j < this.info.specialDateList.length; j++) {
							let dateList = this.info.specialDateList
							if ((dateList[j].date[0] >= dateList[i].date[0] && dateList[j].date[0] <= dateList[i].date[1]) || (dateList[j].date[1] >= dateList[i].date[0] && dateList[j].date[1] <= dateList[i].date[1])) {
								_this.$message.destroy()
								this.$message.warning('特殊时期' + (i + 1) + '和特殊时期' + (j + 1) + '存在冲突，请修改！')
								dataFlag = true
								this.current = 2
								return false
							}
						}
						for (let k = 0; k < this.info.specialDateList[i].time.length; k++) {
							// 判断开始时间是否小于结束时间
							if (this.info.specialDateList[i].time[k].start_time >= this.info.specialDateList[i].time[k].end_time && this.info.specialDateList[i].time[k].end_time != '00:00') {
								_this.$message.destroy()
								this.$message.warning("特殊时期" + (i + 1) + "的第" + (k + 1) + "个时间段开始时间需早于结束时间，请修改！")
								dataFlag = true
								this.current = 2
								return false
							}
							if (this.info.type == 2 && this.info.specialTime == 1 && (this.info.specialDateList[i].time[k].userList.length == 0 || (this.info.specialDateList[i].time[k].userList.length == 1 && this.info.specialDateList[i].time[k].userList[0].is_del == 1)) && this.info.specialDateList[i].time[k].party.length == 0) {
								_this.$message.destroy()
								this.$message.warning('特殊时期' + (i + 1) + '的第' + (k + 1) + '个时间段请选择企业成员或企业部门！')
								dataFlag = true
								this.current = 2
								return false
							}
							if (this.info.type == 1 && this.info.specialTime == 1 && (this.info.specialDateList[i].time[k].userList.length == 0 || this.info.specialDateList[i].time[k].is_del == 1)) {
								_this.$message.destroy()
								this.$message.warning('特殊时期' + (i + 1) + '的第' + (k + 1) + '个时间段请选择企业成员！')
								dataFlag = true
								this.current = 2
								return false
							}
							for (let l = k + 1; l < this.info.specialDateList[i].time.length; l++) {
								if (this.info.specialDateList[i].time[l].start_time == '00:00' && this.info.specialDateList[i].time[l].end_time == '00:00') {
									_this.$message.destroy()
									this.$message.warning("第" + (i + 1) + "个的特殊时期第" + (l + 1) + "个时间段不能与默认时间段相同，请修改！")
									dataFlag = true
									this.current = 2
									return false
								}
								if (k != 0) {
									let startTime = this.info.specialDateList[i].time[k].start_time
									let endTime = this.info.specialDateList[i].time[k].end_time
									let startTime1 = this.info.specialDateList[i].time[l].start_time
									let endTime1 = this.info.specialDateList[i].time[l].end_time
									// 判断时间是否存在重叠
									if ((startTime >= startTime1 && startTime < endTime1) || (endTime > startTime1 && endTime <= endTime1) || (startTime >= startTime1 && endTime1 == '00:00') || (endTime > startTime1 && endTime1 == '00:00') || (startTime1 >= startTime && startTime1 < endTime) || (endTime1 > startTime && endTime >= endTime1) || (startTime1 >= startTime && endTime == '00:00') || (endTime1 > startTime && endTime == '00:00')) {
										_this.$message.destroy()
										this.$message.warning("特殊时期" + (i + 1) + "的第" + (k + 1) + "个时间段与第" + (l + 1) + "个时间段存在冲突，请修改！")
										dataFlag = true
										this.current = 2
										return false
									}
								}
							}
							if (dataFlag) {
								return false
							}
						}
						if (dataFlag) {
							return false
						}
					}
					if (dataFlag) {
						return false
					}
					if (this.info.is_limit == 2) {
						for (let leng = 0; leng < this.info.user_limit.length; leng++) {
							if (!this.info.user_limit[leng].limit) {
								_this.$message.destroy()
								this.$message.warning("员工上限不可为空！")
								this.current = 2
								dataFlag = true
								return false
							}
						}
						if (this.info.type == 2 && this.info.spare_employee.length == 0) {
							_this.$message.destroy()
							this.$message.warning("请选择备用员工！")
							this.current = 2
							dataFlag = true
							return false
						} else if (this.info.type == 1 && typeof this.info.spare_employee != 'number') {
							_this.$message.destroy()
							this.$message.warning("请选择备用员工！")
							this.current = 2
							dataFlag = true
							return false
						}
						if (dataFlag) {
							return false
						}
					}

				} else if (index == 3) {
					if (this.pushValue) {
						if (this.textContent.trim().replace(/\n/g, '') == "") {
							_this.$message.destroy()
							this.$message.warning("默认欢迎语内容不能为空！")
							this.current = 3
							return false
						}
						// 周期欢迎语验证
						if (this.info.is_welcome_week == 2) {
							for (let index = 0; index < this.welcome_week_list.length; index++) {
								let week = this.welcome_week_list[index]
								// 周期判断
								if (week.date.length == 0) {
									_this.$message.destroy()
									_this.$message.warning("请填写周期欢迎语" + (index + 1) + "的周期！")
									dataFlag = true
									_this.current = 3
									return false
								}
								for (let idx = 0; idx < week.time.length; idx++) {
									let time = week.time[idx]
									// 周期的时间段为空判断
									if (time.startTime == null || time.endTime == null) {
										_this.$message.destroy()
										_this.$message.warning("请填写周期欢迎语" + (index + 1) + "时间段" + (idx + 1) + "！")
										dataFlag = true
										_this.current = 3
									}
									if (dataFlag) {
										return false
									}
									// 周期的时间段开始时间和结束时间值判断
									if (moment(time.startTime).format("HH:mm") >= moment(time.endTime).format("HH:mm") && moment(time.endTime).format("HH:mm") != '00:00') {
										_this.$message.destroy()
										_this.$message.warning("周期欢迎语" + (index + 1) + "的时间段" + (idx + 1) + "的开始时间需早于结束时间，请修改！")
										dataFlag = true
										_this.current = 3
										return false
									}
									// 周期多个时间段的时间是否存在冲突判断
									for (let i = idx + 1; i < week.time.length; i++) {
										let startTime = moment(week.time[i].startTime).format("HH:mm")
										let startTime1 = moment(time.startTime).format("HH:mm")
										let endTime = moment(week.time[i].endTime).format("HH:mm")
										let endTime1 = moment(time.endTime).format("HH:mm")
										if ((startTime >= startTime1 && startTime < endTime1) || (endTime > startTime1 && endTime <= endTime1) || (startTime >= startTime1 && endTime1 == '00:00') || (endTime > startTime1 && endTime1 == '00:00') || (startTime1 >= startTime && startTime1 < endTime) || (endTime1 > startTime && endTime >= endTime1) || (endTime == endTime1 && startTime == startTime1)) {
											_this.$message.destroy()
											_this.$message.warning("周期欢迎语" + (index + 1) + "的时间段" + (idx + 1) + "个和时间段" + (i + 1) + "存在冲突！")
											dataFlag = true
											_this.current = 3
											return false
										}
									}
									if (dataFlag) {
										return false
									}
									// 周期欢迎语为空判断
									let sadsd = time.content.textContent.trim().replace(/\n/g, '')
									if (time.content.textContent.trim().replace(/\n/g, '') == "") {
										_this.$message.destroy()
										_this.$message.warning("周期欢迎语" + (index + 1) + "的时间段" + (idx + 1) + "欢迎语内容不能为空！")
										dataFlag = true
										_this.current = 3
									}
									if (dataFlag) {
										return false
									}
								}
								if (dataFlag) {
									return false
								}
							}
							if (dataFlag) {
								return false
							}
						}
						// 时期欢迎语验证
						if (this.info.is_welcome_date == 2) {
							for (let index = 0; index < this.welcome_date_list.length; index++) {
								let date = this.welcome_date_list[index]
								// 时期判断
								if (date.date.length == 0) {
									_this.$message.destroy()
									_this.$message.warning("请填写特殊时期欢迎语" + (index + 1) + "的时期！")
									dataFlag = true
									_this.current = 3
									return false
								}
							}
							if (dataFlag) {
								return false
							}
							for (let index = 0; index < this.welcome_date_list.length; index++) {
								// 时期的多个日期时间段是否冲突
								for (let idx = index + 1; idx < _this.welcome_date_list.length; idx++) {
									let startDate = moment(_this.welcome_date_list[idx].date[0]).format("YYYY-MM-DD")
									let startDate1 = moment(_this.welcome_date_list[index].date[0]).format("YYYY-MM-DD")
									let endDate = moment(_this.welcome_date_list[idx].date[1]).format("YYYY-MM-DD")
									let endDate1 = moment(_this.welcome_date_list[index].date[1]).format("YYYY-MM-DD")
									if ((startDate >= startDate1 && startDate < endDate1) || (endDate > startDate1 && endDate <= endDate1) || (startDate >= startDate1 && endDate1 == '00:00') || (endDate > startDate1 && endDate1 == '00:00') || (startDate1 >= startDate && startDate1 < endDate) || (endDate1 > startDate && endTime >= endDate1) || (endDate == endDate1 && startDate == startDate1)) {
										_this.$message.destroy()
										_this.$message.warning("特殊时期欢迎语" + (index + 1) + "和特殊时期欢迎语" + (idx + 1) + "日期存在冲突！")
										dataFlag = true
										_this.current = 3
										return false
									}
								}
								if (dataFlag) {
									return false
								}
								let date = this.welcome_date_list[index]
								for (let idx = 0; idx < date.time.length; idx++) {
									let time = date.time[idx]
									// 时期的时间段为空判断
									if (time.startTime == null || time.endTime == null) {
										_this.$message.destroy()
										_this.$message.warning("请填写特殊时期欢迎语" + (index + 1) + "时间段" + (idx + 1) + "！")
										dataFlag = true
										_this.current = 3
										return false
									}
									// 时期的时间段开始时间和结束时间值判断
									if (moment(time.startTime).format("HH:mm") >= moment(time.endTime).format("HH:mm") && moment(time.endTime).format("HH:mm") != '00:00') {
										_this.$message.destroy()
										_this.$message.warning("特殊时期欢迎语" + (index + 1) + "的时间段" + (idx + 1) + "的开始时间需早于结束时间，请修改！")
										dataFlag = true
										_this.current = 3
										return false
									}
									// 时期欢迎语为空判断
									if (time.content.textContent.trim().replace(/\n/g, '') == "") {
										_this.$message.destroy()
										_this.$message.warning("特殊时期欢迎语" + (index + 1) + "的时间段" + (idx + 1) + "欢迎语内容不能为空！")
										dataFlag = true
										_this.current = 3
										return false
									}
									// 时期多个时间段的时间是否存在冲突判断
									for (let i = idx + 1; i < date.time.length; i++) {
										let startTime = moment(date.time[i].startTime).format("HH:mm")
										let startTime1 = moment(time.startTime).format("HH:mm")
										let endTime = moment(date.time[i].endTime).format("HH:mm")
										let endTime1 = moment(time.endTime).format("HH:mm")
										if ((startTime >= startTime1 && startTime < endTime1) || (endTime > startTime1 && endTime <= endTime1) || (startTime >= startTime1 && endTime1 == '00:00') || (endTime > startTime1 && endTime1 == '00:00') || (startTime1 >= startTime && startTime1 < endTime) || (endTime1 > startTime && endTime >= endTime1) || (endTime == endTime1 && startTime == startTime1)) {
											_this.$message.destroy()
											_this.$message.warning("特殊时期欢迎语" + (index + 1) + "的时间段" + (idx + 1) + "个和时间段" + (i + 1) + "存在冲突！")
											dataFlag = true
											_this.current = 3
											return false
										}
									}
									if (dataFlag) {
										return false
									}
								}
								if (dataFlag) {
									return false
								}
							}
							if (dataFlag) {
								return false
							}
						}
					}
				}
				return true
			},
			// 创建活码
			async saveWay () {
				this.isLoading = true
				this.createDisabled = true
				if (!this.checkedOut(0) || !this.checkedOut(1) || !this.checkedOut(2) || !this.checkedOut(3)) {
					this.isLoading = false
					this.createDisabled = false
					return false
				}
				let sendData = JSON.parse(JSON.stringify(this.info))
				let url = 'work-contact-way-redpacket/add-redpacket'
				sendData.suite_id = 1
				sendData.corp_id = this.corpId
				sendData.tag_ids = this.tag_arr.join()
				if (typeof this.urlId != 'undefined') {
					url = 'work-contact-way-redpacket/update-redpacket'
					sendData.id = this.urlId
				}
				sendData.uid = localStorage.getItem('uid')
				sendData.status = this.pushValue ? 1 : 0
				sendData.text_content = this.textContent
				let verify_date = []
				this.timeList.forEach(function (item) {
					verify_date.push(
						{
							start_time: moment(item.startTime).format('HH:mm'),
							end_time  : moment(item.endTime).format('HH:mm')
						}
					)
				})
				sendData.verify_date = verify_date
				let welcome_week_list = []
				if (sendData.is_welcome_week == 2) {
					this.welcome_week_list.forEach(function (item) {
						let time = []
						item.time.forEach(function (t) {
							time.push(
								{
									start_time: moment(t.startTime).format('HH:mm'),
									end_time  : moment(t.endTime).format('HH:mm'),
									content   : {
										add_type          : 0,
										attachment_id     : "",
										groupId           : "",
										link_attachment_id: "",
										link_desc         : "",
										link_title        : "",
										link_url          : "",
										materialSync      : 0,
										media_id          : "",
										mini_appid        : "",
										mini_page         : "",
										mini_pic_media_id : "",
										mini_title        : "",
										text_content      : t.content.textContent,
									}
								}
							)
						})
						welcome_week_list.push(
							{
								date: JSON.parse(JSON.stringify(item.date)),
								time: JSON.parse(JSON.stringify(time))
							}
						)
					})
				}
				sendData.welcome_week_list = welcome_week_list
				let welcome_date_list = []
				if (sendData.is_welcome_date == 2) {
					this.welcome_date_list.forEach(function (item) {
						let date = [moment(item.date[0]).format('YYYY-MM-DD'), moment(item.date[1]).format('YYYY-MM-DD')]
						let time = []
						item.time.forEach(function (t) {
							time.push(
								{
									start_time: moment(t.startTime).format('HH:mm'),
									end_time  : moment(t.endTime).format('HH:mm'),
									content   : {
										add_type          : 0,
										attachment_id     : "",
										groupId           : "",
										link_attachment_id: "",
										link_desc         : "",
										link_title        : "",
										link_url          : "",
										materialSync      : 0,
										media_id          : "",
										mini_appid        : "",
										mini_page         : "",
										mini_pic_media_id : "",
										mini_title        : "",
										text_content      : t.content.textContent || '',
									}
								}
							)
						})
						welcome_date_list.push(
							{
								date: JSON.parse(JSON.stringify(date)),
								time: JSON.parse(JSON.stringify(time))
							}
						)
					})
				}
				let ruleContent = {
					name            : this.rule.name,
					time_type       : this.rule.time_type,
					start_time      : this.rule.start_time,
					end_time        : this.rule.end_time,
					reserve_day     : this.rule.reserve_day,
					redrule_type    : this.rule.redrule_type,
					rule_id         : this.rule.rule_id,
					rule_save       : this.rule.rule_save,
					redpacket_amount: this.rule.redpacket_amount,
				}
				if (this.rule.redrule_type == 1) {
					ruleContent = Object.assign(ruleContent, this.rule1)
				} else {
					ruleContent = Object.assign(ruleContent, this.rule2)
					ruleContent.rule_id = 0
				}
				ruleContent.rule_thanking = ruleContent.rule_thanking || '恭喜发财，大吉大利'
				sendData.welcome_date_list = welcome_date_list
				sendData = Object.assign(sendData, ruleContent)
				sendData.agent_id = this.agentId
				const {data: res} = await this.axios.post(url, sendData);

				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.createDisabled = false
					this.isLoading = false
				} else {
					this.$message.success("操作成功")
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					this.createDisabled = false
					if (typeof this.urlId != "undefined") {
						this.isLoading = false
						this.$router.push("/redForNew/list?isRefresh=1")
					} else {
						this.isLoading = false
						this.$router.push("/redForNew/list?")
					}
				}
			},
			//更换公众号
			add () {
				if (this.$route.query.id) {
					return
				}
				this.showModal2 = true
				this.isLoading = true;
			}
			,
			// 公众号弹窗确认
			modalVisibleChange (event, corpId, corpName) {
				if (event == "ok" && this.corpId != corpId) {
					this.corpId = corpId
					this.isLoading = false;
					this.showModal2 = false
					this.info.user = []
					this.info.party = []
					this.info.tag_ids = []
					this.resetInfoSpecialWeekAndDate()
					this.getUserList()
					this.getPartyList()
					this.chooseNum = 0
					this.$refs.user.staffList = []
					this.$refs.user.keyList = []
				} else {
					this.isLoading = false;
					this.showModal2 = false
				}
			}
			,
			showChannelCode () {
				this.codeId = []
				this.name = ''
				this.codeList = []
				this.getCodeList()
				this.codeVisible = true
			},
			onSelectChange (id, selectedRows) {
				this.codeId = []
				this.codeId.push(id[0])
			},
			handleCode () {
				this.codeLoading = true
				if (this.codeId.length == 0) {
					this.$message.destroy()
					this.$message.warning('请选择活码')
					this.codeLoading = false
					return false
				} else {
					this.getCodeDetail(this.codeList[0])
				}
			},
			changePage (page, pageSize) {
				this.getCodeList(page)
			},
			showSizeChange (page, pageSize) {
				this.getCodeList(1, pageSize)
			},
			handleCancelCode () {
				this.codeVisible = false
				this.codeId = []
				this.name = ''
			},
			// 获取所有成员
			async getCodeList (page = 1, pageSize = this.pageSize) {
				this.isTableLoading = true
				const {data: res} = await this.axios.post('work-contact-way/get-list', {
					corp_id     : this.corpId,
					page        : page,
					pageSize    : pageSize,
					suite_id    : 1,
					title       : this.name,
					type        : 0,
					way_group_id: [],
				})

				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.isTableLoading = false
					this.count = parseInt(res.data.count)
					this.codeList = res.data.contact_way_list
					this.page = page;
					this.pageSize = pageSize
				}
			},
			clear () {
				this.name = ''
				this.getCodeList(1, 15)
			},
			//搜索成员
			searchName () {
				this.getCodeList()
			},
			// 改变单、多人类型
			changeInfoType () {
				this.info.is_limit = 1
				this.info.user_limit = []
				this.info.spare_employee = []
				this.resetInfoSpecialWeekAndDate()
			},
			//自动加好友
			changeSkipVerify () {
				this.info.skip_verify = this.info.skip_verify == 0 ? 1 : 0
			},
			changeTimeFormat (time) {
				return moment(time).format('HH:mm')
			},
			// 自动加好友改变开始时间
			changeSkipStartTime (index) {
				let flag = false
				for (let i = 0; i < index; i++) {
					if (index > i && (this.timeList[i].startTime == null || this.timeList[i].endTime == null)) {
						this.$message.destroy()
						this.$message.warning('请填写上面的时间')
						this.$nextTick(() => {
							this.timeList[index].startTime = null
						})
						flag = true
						return false
					}
				}
				if (flag) {
					return false
				}
				for (let i = 0; i < this.timeList.length; i++) {
					let start = this.changeTimeFormat(this.timeList[index].startTime)
					let end = this.timeList[index].endTime ? this.changeTimeFormat(this.timeList[index].endTime) : ''
					if (index != i) {
						let start1 = this.changeTimeFormat(this.timeList[i].startTime)
						let end1 = this.changeTimeFormat(this.timeList[i].endTime)
						if (end != '') {
							if ((start >= start1 && start < end1) || (end > start1 && end <= end1) || (start >= start1 && end1 == '00:00') || (end > start1 && end1 == '00:00') || (start1 >= start && start1 < end) || (end1 > start && end >= end1) || (start1 >= start && end == '00:00') || (end1 > start && end == '00:00')) {
								this.$message.destroy()
								this.$message.warning('当前开始时间在第' + (i + 1) + '个时间段内，会造成冲突，请修改')
								return false
							}
						} else {
							if ((start > start1 && start < end1) || (start > start1 && end1 == '00:00')) {
								this.$message.destroy()
								this.$message.warning('当前结束时间在第' + (i + 1) + '个时间段内，会造成冲突，请修改')
								return false
							}
						}
					}
					if (start >= end && this.timeList[index].endTime != null && moment(this.timeList[index].endTime).format("HH:mm") != '00:00') {
						this.$message.destroy()
						this.$message.warning('开始时间需早于结束时间')
						return false
					}
				}
			},
			// 自动加好友改变结束时间
			changeSkipEndTime (index) {
				let flag = false
				for (let i = 0; i < index; i++) {
					if (index > i && (this.timeList[i].startTime == null || this.timeList[i].endTime == null)) {
						this.$message.destroy()
						this.$message.warning('请填写上面的时间')
						this.$nextTick(() => {
							this.timeList[index].startTime = null
						})
						flag = true
						return false
					}
				}
				if (flag) {
					return false
				}
				for (let i = 0; i < this.timeList.length; i++) {
					let start = this.timeList[index].startTime ? this.changeTimeFormat(this.timeList[index].startTime) : ''
					let end = this.changeTimeFormat(this.timeList[index].endTime)
					if (index != i) {
						let start1 = this.changeTimeFormat(this.timeList[i].startTime)
						let end1 = this.changeTimeFormat(this.timeList[i].endTime)
						if (start != '') {
							if ((start >= start1 && start < end1) || (end > start1 && end <= end1) || (start >= start1 && end1 == '00:00') || (end > start1 && end1 == '00:00') || (start1 >= start && start1 < end) || (end1 > start && end >= end1) || (start1 >= start && end == '00:00') || (end1 > start && end == '00:00')) {
								this.$message.destroy()
								this.$message.warning('当前结束时间在第' + (i + 1) + '个时间段内，会造成冲突，请修改')
								return false
							}
						} else {
							if ((end > start1 && end < end1) || (end > start1 && end1 == '00:00')) {
								this.$message.destroy()
								this.$message.warning('当前结束时间在第' + (i + 1) + '个时间段内，会造成冲突，请修改')
								return false
							}
						}
					}
					if (start >= end && this.timeList[index].startTime != null && moment(this.timeList[index].endTime).format("HH:mm") != '00:00') {
						this.$message.destroy()
						this.$message.warning('开始时间需早于结束时间')
						return false
					}
				}
			},
			// 添加自动加好友时间
			addSkipTime () {
				this.timeList.push({
					startTime: null,
					endTime  : null
				})
			},
			// 删除自动加好友时间
			deleteSkipTime (index) {
				this.timeList.splice(index, 1)
			},
			// 重置排班数据
			resetInfoSpecialWeekAndDate () {
				this.info.specialWeekList = [
					{
						mon   : [],
						tues  : [],
						wednes: [],
						thurs : [],
						fri   : [],
						satur : [],
						sun   : [],
					},
				]
				this.info.specialDateList = [
					{
						specialDate: [moment(new Date()), moment(new Date())],
						date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
						time       : [
							{
								startTime : moment('00:00', 'HH:mm'),
								endTime   : moment('00:00', 'HH:mm'),
								start_time: '00:00',
								end_time  : '00:00',
								userList  : [],
								party     : []
							}
						],
					}
				]
			},
			// 特殊时间切换
			changeSpecilTime () {
				this.info.specialTime = (this.info.specialTime + 1) % 2
				this.getUniqueUserList()
			},
			// 特殊时间弹窗
			addSpecialTime () {
				this.specialTimeTitle = '添加企业成员'
				this.specialTimeVisible = true
				let that = this
				that.$nextTick(() => {
					that.$refs.staffSelect2.userId = []
				})
			},
			// 编辑周几排班
			editSpecialTime (weekDay) {
				this.specialTimeTitle = '编辑企业成员'
				this.specialTimeList = JSON.parse(JSON.stringify(this.info.specialWeekList[0][weekDay]))
				this.specialTimeList.map((item) => {
					item.startTime = moment(item.start_time, 'HH:mm')
					item.endTime = moment(item.end_time, 'HH:mm')
				})
				this.weekChecked[this.weekArr[weekDay]] = true
				this.weekDayKey.push(weekDay)
				this.specialTimeVisible = true

				if (this.info.type == 1) {
					let that = this
					that.$nextTick(() => {
						that.specialTimeList.map((item, index) => {
							that.$refs.staffSelect2[index].userId = item.userList
						})
					})
				}
			},
			// 周排班弹窗确认
			handleSpecialTime () {
				this.addSpecialTimeLoading = true
				if (this.weekDayKey.length == 0) {
					this.$message.warning("请选择适用周期")
					this.addSpecialTimeLoading = false
					return false
				}
				let flag = false
				for (let item of this.specialTimeList) {
					console.log(JSON.stringify(item))
					if (this.info.type == 2 && item.userList.length == 0 && item.party.length == 0) {
						this.$message.warning("请选择成员或企业微信部门")
						this.addSpecialTimeLoading = false
						flag = true
						return false
					} else if (this.info.type == 2 && item.userList.length == 1 && item.userList[0].is_del == 1) {
						this.$message.warning("当前成员不可用，请修改")
						this.addSpecialTimeLoading = false
						flag = true
						return false
					} else if (this.info.type == 2 && item.userList.length > 0) {
						let f = false
						item.userList.map(user => {
							if (user.is_del != 1) {
								f = true
								return false
							}
						})
						if (!f) {
							this.$message.warning("当前成员不可用，请修改")
							this.addSpecialTimeLoading = false
							flag = true
							return false
						}
					}
					if (this.info.type == 1 && item.userList.length == 0) {
						this.$message.warning("请选择成员")
						this.addSpecialTimeLoading = false
						flag = true
						return false
					} else if (this.info.type == 1 && typeof item.userList != 'number') {
						this.$message.warning("当前成员不可用，请修改")
						this.addSpecialTimeLoading = false
						flag = true
						return false
					}
				}
				if (flag) {
					return false
				}
				// 判断周排班弹窗时间是否存在重叠且不能为00~00 默认第一个00~00不进入判断 故j从1开始
				for (let j = 1; j < this.specialTimeList.length; j++) {
					if (this.specialTimeList[j].start_time >= this.specialTimeList[j].end_time && this.specialTimeList[j].end_time != '00:00') {
						this.$message.warning("第" + (j + 1) + "个时间段开始时间需早于结束时间，请修改")
						flag = true
						this.addSpecialTimeLoading = false
						return false
					}
					if (this.specialTimeList[j].start_time == '00:00' && this.specialTimeList[j].end_time == '00:00') {
						this.$message.warning("第" + (j + 1) + "个时间段不能与默认时间段相同，请修改")
						flag = true
						this.addSpecialTimeLoading = false
						return false
					}
					// 冒泡判断当前数据是否存在重叠
					for (let k = j + 1; k < this.specialTimeList.length; k++) {
						let startTime = this.specialTimeList[j].start_time
						let endTime = this.specialTimeList[j].end_time
						let startTime1 = this.specialTimeList[k].start_time
						let endTime1 = this.specialTimeList[k].end_time
						// 判断时间是否重叠
						if ((startTime >= startTime1 && startTime < endTime1) || (endTime > startTime1 && endTime <= endTime1) || (startTime >= startTime1 && endTime1 == '00:00') || (endTime > startTime1 && endTime1 == '00:00') || (startTime1 >= startTime && startTime1 < endTime) || (endTime1 > startTime && endTime >= endTime1) || (startTime1 >= startTime && endTime == '00:00') || (endTime1 > startTime && endTime == '00:00')) {
							this.$message.warning("第" + (j + 1) + "个时间段与第" + (k + 1) + "个时间段存在冲突，请修改")
							flag = true
							this.addSpecialTimeLoading = false
							return false
						}
					}
				}
				if (flag) {
					return false
				}
				// 先将选中的周几替换默认00~00数据再添加弹窗数据
				for (let weekDay of this.weekDayKey) {
					this.info.specialWeekList[0][weekDay] = []
					this.info.specialWeekList[0][weekDay] = this.specialTimeList.concat(this.info.specialWeekList[0][weekDay])
				}
				this.getUniqueUserList()
				this.$forceUpdate()
				this.specialTimeVisible = false
				this.addSpecialTimeLoading = false
				// 弹窗数据重置
				this.weekDayKey = []
				this.weekChecked = new Array(7).fill(false)
				this.specialTimeUserList = []
				this.specialTimeList = [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : [],
					}
				]

			},
			// 周排班弹窗取消
			handleCancelSpecialTime () {
				this.specialTimeVisible = false
				this.weekDayKey = []
				this.weekChecked = new Array(7).fill(false)
				this.specialTimeUserList = []
				this.specialTimeList = [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : []
					}
				]
			},
			// 周排班弹窗添加周排班时间
			addTime (index) {
				let special = {
					start_time: '00:00',
					end_time  : '00:00',
					startTime : moment("00:00", "HH:mm"),
					endTime   : moment("00:00", "HH:mm"),
					userList  : [],
					party     : []
				}
				this.specialTimeList.splice(index + 1, 0, special)
			},
			// 删除周排班弹窗时间
			deleteTime (index) {
				this.specialTimeList.splice(index, 1)
			},
			// 修改特殊开始时间
			changeStartTime (e, index) {
				this.specialTimeList[index].startTime = e
				this.specialTimeList[index].start_time = moment(this.specialTimeList[index].startTime).format("HH:mm")
				if (this.specialTimeList[index].start_time >= this.specialTimeList[index].end_time && this.specialTimeList[index].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
			},
			// 修改特殊结束时间
			changeEndTime (e, index) {
				this.specialTimeList[index].endTime = e
				this.specialTimeList[index].end_time = moment(this.specialTimeList[index].endTime).format("HH:mm")
				if (this.specialTimeList[index].start_time >= this.specialTimeList[index].end_time && this.specialTimeList[index].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
			},
			// 选择选择周期
			changeWeekDay (key) {
				Array.prototype.indexOf = function (val) {
					for (let i = 0; i < this.length; i++) {
						if (this[i] == val) return i
					}
					return -1
				}
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val)
					if (index > -1) {
						this.splice(index, 1)
					}
				}
				if (this.weekDayKey.indexOf(key) != -1) {
					this.weekDayKey.remove(key)
				} else {
					this.weekDayKey.push(key)
				}
			},
			// 特殊日期禁止当天之前的时间
			disabledDateDay (current) {
				return current.valueOf() < new Date().getTime() - 86400000;
			},
			// 添加特殊时间段
			addSpecialDate (index) {
				let specialDate = {
					specialDate: [moment(new Date()), moment(new Date())],
					date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
					time       : [
						{
							startTime : moment('00:00', 'HH:mm'),
							endTime   : moment('00:00', 'HH:mm'),
							start_time: '00:00',
							end_time  : '00:00',
							userList  : [],
							party     : []
						}
					],
				}
				this.info.specialDateList.splice(index + 1, 0, specialDate)
			},
			// 删除index特殊时间段
			deleteSpecialDate (index) {
				this.info.specialDateList.splice(index, 1)
				this.changeUser()
			},
			// 修改特殊时间日期
			changeSpecialDate (e, index) {
				if (e && e.length > 1) {
					this.info.specialDateList[index].specialDate = e
					this.info.specialDateList[index].date = [moment(e[0]).format("YYYY-MM-DD"), moment(e[1]).format("YYYY-MM-DD")]
					this.$forceUpdate()
				}
			},
			// 修改特殊时间段 开始时间
			changeSpecialStartTime (e, index, timeIndex) {
				this.info.specialDateList[index].time[timeIndex].startTime = e
				this.info.specialDateList[index].time[timeIndex].start_time = e.format("HH:mm")
				if (this.info.specialDateList[index].time[timeIndex].start_time >= this.info.specialDateList[index].time[timeIndex].end_time && this.info.specialDateList[index].time[timeIndex].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
				this.$forceUpdate()
			},
			// 修改特殊时间段 结束时间
			changeSpecialEndTime (e, index, timeIndex) {
				this.info.specialDateList[index].time[timeIndex].endTime = moment(e._d, "HH:mm")
				this.info.specialDateList[index].time[timeIndex].end_time = e.format("HH:mm")
				if (this.info.specialDateList[index].time[timeIndex].start_time >= this.info.specialDateList[index].time[timeIndex].end_time && this.info.specialDateList[index].time[timeIndex].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
				this.$forceUpdate()
			},
			// 添加特殊时间某个日期下时间
			addSpecialDateTimeList (index, timeIndex) {
				let time = {
					startTime : moment('00:00', 'HH:mm'),
					endTime   : moment('00:00', 'HH:mm'),
					start_time: '00:00',
					end_time  : '00:00',
					userList  : [],
					party     : []
				}
				this.info.specialDateList[index].time.splice(timeIndex + 1, 0, time)
			},
			// 删除特殊时间某个日期下时间
			deleteSpecialDateTimeList (index, timeIndex) {
				this.info.specialDateList[index].time.splice(timeIndex, 1)
				this.changeUser()
				this.getUniqueUserList()
			},
			// 获取周期和时期的人
			getUniqueUserList () {
				let userList = []
				let weekDay = ['mon', 'tues', 'wednes', 'thurs', 'fri', 'satur', 'sun']
				for (let d of weekDay) {
					for (let week of this.info.specialWeekList[0][d]) {
						if (this.info.type == 1) {
							if (week.userList) {
								userList.push(week.userList)
							}
						} else {
							if (week.userList && week.userList.length != 0) {
								userList = userList.concat(week.userList)
							}
						}
					}
				}
				if (this.info.specialTime == 1) {
					for (let date of this.info.specialDateList) {
						for (let t of date.time) {
							if (this.info.type == 1) {
								userList.push(t.userList)
							} else {
								userList = userList.concat(t.userList)
							}
						}
					}
				}
				if (userList.length == 0) {
					this.info.user_limit = []
					this.info.is_limit = 1
				} else {
					if (this.info.type == 2) {
						let users = []
						for (let i = 0; i < userList.length; i++) {
							if(userList[i].scopedSlots.title == 'custom') {
								users.push({
									user_id: userList[i].id,
									name   : userList[i].title,
									limit  : 100
								})
							}
						}
						this.getLimitUser(users)
					} else {
						this.getUserList1(userList)
					}
				}
			},
			// 上限员工
			getLimitUser (userList) {
				let obj = {}
				userList = userList.reduce((cur, next) => {
					obj[next.user_id] ? "" : obj[next.user_id] = true && cur.push(next);
					return cur;
				}, [])
				for (let i = 0; i < this.info.user_limit.length; i++) {
					if (userList.findIndex(u => u.user_id == this.info.user_limit[i].user_id) == -1) {
						this.info.user_limit.splice(i, 1)
						i--
					}
				}
				for (let j = 0; j < userList.length; j++) {
					if (this.info.user_limit.findIndex(u => u.user_id == userList[j].user_id) == -1) {
						this.info.user_limit.push(userList[j])
					}
				}
				if (this.info.user_limit.length == 0) {
					this.info.is_limit = 1
				}
			},
			// 单人获取周期、时期选择的人的详细信息
			async getUserList1 (userList) {
				const {data: res} = await this.axios.post("work-contact-way/get-users", {
					id     : userList,
					corp_id: this.corpId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					userList = res.data
					this.getLimitUser(userList)
				}
			},
			// 是否开启员工上限
			changeIsCeiling () {
				if (this.info.user_limit.length == 0) {
					let party = []
					let weekDay = ['mon', 'tues', 'wednes', 'thurs', 'fri', 'satur', 'sun']
					for (let d of weekDay) {
						for (let week of this.info.specialWeekList[0][d]) {
							if (this.info.type == 2) {
								if (week.party && week.party.length != 0) {
									party = party.concat(week.party)
								}
							}
						}
					}
					if (this.info.specialTime == 1) {
						for (let date of this.info.specialDateList) {
							for (let t of date.time) {
								if (this.info.type == 2) {
									if (t.party && t.party.length != 0) {
										party = party.concat(t.party)
									}
								}
							}
						}
					}
					if (party.length > 0) {
						this.$message.destroy()
						this.$message.warning('因受官方限制，无法对动态部门的员工设置添加好友上限')
						return false
					} else {
						this.$message.destroy()
						this.$message.warning('请先选择成员')
						return false
					}

				}
				this.info.is_limit = this.info.is_limit == 1 ? 2 : 1
				this.$forceUpdate()
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
			inputLimitNum (e, index) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data)) {
						this.info.user_limit[index].limit = parseInt(this.info.user_limit[index].limit.toString().substring(0, this.info.user_limit[index].limit.toString().length - 1)) || ''
						this.$forceUpdate()
					} else if (this.info.user_limit[index].limit > 99999999) {
						this.info.user_limit[index].limit = 99999999
						this.$forceUpdate()
					}
				}
			},
			rowClassName () {
				let className = 'light-row';
				return className;
			},
			//客户标签
			modalVisibleChange4 (event, arr) {
				if (event == "ok") {
					this.tag_arr = arr.split(',')
				}
			},
			//扫码推送
			changeStatus (value) {
				// console.log(value)
				this.pushValue = value
			}
			,
			changeWelcomeTabKey (key) {
				this.welcomeTabKey = key
			},
			// 通用欢迎语文本回调
			changeText (text, textVale) {
				this.textContent = text
				this.textAreaValueHeader = textVale
			},
			// 周期、时期欢迎语文本回调
			changeText1 (text, textVale, type, index, idx) {
				if (type == 1) {
					this.welcome_week_list[index].time[idx].content.textContent = text
					this.welcome_week_list[index].time[idx].content.textAreaValueHeader = textVale
				} else if (type == 2) {
					this.welcome_date_list[index].time[idx].content.textContent = text
					this.welcome_date_list[index].time[idx].content.textAreaValueHeader = textVale
				}
			},
			// 特殊时期开关
			changeIsWelcomeWeek () {
				this.info.is_welcome_week = this.info.is_welcome_week == 1 ? 2 : 1
			},
			// 欢迎语周期不能重复，判断是否禁选
			isDisabled (index, key) {
				let week = []
				this.welcome_week_list.forEach(function (item, idx) {
					if (index != idx) {
						week = week.concat(item.date)
					}
				})
				if (week.indexOf(key) > -1) {
					return true
				}
				return false
			},
			// 欢迎语周期选择
			selctedWeekDay (index, key) {
				let i = this.welcome_week_list[index].date.indexOf(key)
				if (i > -1) {
					this.welcome_week_list[index].date.splice(i, 1)
				} else {
					this.welcome_week_list[index].date.push(key)
				}
				this.weekKey++
			},
			// 添加周期欢迎语周期
			addWelcomeWeek (targetKey, action) {
				if (action == 'add') {
					this.welcome_week_list.push({
						date: [],
						time: [
							{
								startTime: null,
								endTime  : null,
								content  : JSON.parse(JSON.stringify(welcomeContent))
							}
						]
					})
					this.weekKey++
					this.$nextTick(() => {
						this.weekTabKey = this.welcome_week_list.length - 1
					})
				} else if (action == 'remove') {
					if (this.welcome_week_list.length < 2) {
						return false
					}
					this.welcome_week_list.splice(targetKey, 1)
					if (targetKey <= this.weekTabKey && this.weekTabKey != 0) {
						this.weekTabKey--
					}
					this.weekKey++
				}
			},
			// 添加周期欢迎语时间段
			addWelcomeWeekTime (index) {
				this.welcome_week_list[index].time.push(
					{
						startTime: null,
						endTime  : null,
						content  : JSON.parse(JSON.stringify(welcomeContent))
					}
				)
				this.weekKey++
			},
			// 删除周期欢迎语时间段
			deleteWelcomeWeekTime (index, idx) {
				this.welcome_week_list[index].time.splice(idx, 1)
				this.weekKey++
			},
			changeIsWelcomeDate () {
				this.info.is_welcome_date = this.info.is_welcome_date == 1 ? 2 : 1
			},
			// 添加时期欢迎语周期
			addWelcomeDate (targetKey, action) {
				if (action == 'add') {
					this.welcome_date_list.push({
						date: [],
						time: [
							{
								startTime: null,
								endTime  : null,
								content  : JSON.parse(JSON.stringify(welcomeContent))
							}
						]
					})
					this.dateKey++
					this.$nextTick(() => {
						this.dateTabKey = this.welcome_date_list.length - 1
					})
				} else if (action == 'remove') {
					if (this.welcome_date_list.length < 2) {
						return false
					}
					this.welcome_date_list.splice(targetKey, 1)
					if (targetKey <= this.dateTabKey && this.dateTabKey != 0) {
						this.dateTabKey--
					}
					this.dateKey++
				}
			},
			// 添加周期欢迎语时间段
			addWelcomeDateTime (index) {
				this.welcome_date_list[index].time.push(
					{
						startTime: null,
						endTime  : null,
						content  : JSON.parse(JSON.stringify(welcomeContent))
					}
				)
				this.dateKey++
			},
			// 删除周期欢迎语时间段
			deleteWelcomeDateTime (index, idx) {
				this.welcome_date_list[index].time.splice(idx, 1)
				this.dateKey++
			},
			// 获取企业应用
			async getAgentList (id) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id : this.corpId,
					suite_id: this.suite_id,
					agent_type: 2
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if (id) {
						this.agentId = id
					} else if (res.data.length != 0 && !id) {
						this.agentId = res.data[0].id
					}
				}
			},
			async getDetail () {
				const {data: res} = await this.axios.post("work-contact-way-redpacket/get-redpacket-info", {
					corp_id: this.corpId,
					uid    : localStorage.getItem('uid'),
					id     : this.urlId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.changeContent(res)
					this.agentId = res.data.agent_id || ''
					this.getAgentList(this.agentId)
					let contact_way = res.data.contact_way
					this.redpacket_status = contact_way.redpacket_status
					this.redpacket_amount = contact_way.redpacket_amount
					if (contact_way.rule_id) {
						this.rule.rule_id = contact_way.rule_id
						this.rule.redrule_type = 1
						this.rule1 = {
							rule_type             : contact_way.rule_type,
							rule_name             : contact_way.rule_name,
							rule_fixed_amount     : contact_way.rule_fixed_amount,
							rule_min_random_amount: contact_way.rule_min_random_amount,
							rule_max_random_amount: contact_way.rule_max_random_amount,
							rule_pic_url          : contact_way.rule_pic_url,
							rule_title            : contact_way.rule_title,
							rule_des              : contact_way.rule_des,
							rule_thanking         : contact_way.rule_thanking
						}
						this.rule = Object.assign(this.rule, this.rule1)
					} else {
						this.rule.redrule_type = 2
						this.rule2 = {
							rule_type             : contact_way.rule_type,
							rule_name             : contact_way.rule_name,
							rule_fixed_amount     : contact_way.rule_fixed_amount,
							rule_min_random_amount: contact_way.rule_min_random_amount,
							rule_max_random_amount: contact_way.rule_max_random_amount,
							rule_pic_url          : contact_way.rule_pic_url,
							rule_title            : contact_way.rule_title,
							rule_des              : contact_way.rule_des,
							rule_thanking         : contact_way.rule_thanking
						}
						this.rule = Object.assign(this.rule, this.rule2)
					}
					this.rule = Object.assign(this.rule, {
						name            : contact_way.name,
						time_type       : contact_way.time_type,
						start_time      : contact_way.start_time,
						end_time        : contact_way.end_time,
						reserve_day     : contact_way.reserve_day,
						rule_save       : 0,
						redpacket_amount: contact_way.redpacket_amount,
					})
					if (this.rule.start_time != '') {
						this.startDate = moment(this.rule.start_time, 'YYYY-MM-DD HH-mm:ss')
						this.endDate = moment(this.rule.end_time, 'YYYY-MM-DD HH-mm:ss')
					}
				}
			}
		},
		created () {
			this.urlId = this.$route.query.id
			this.corpName = localStorage.getItem('corpName')
			if (typeof this.urlId != "undefined") {
				this.corpId = this.$route.query.id1
				this.corpName = this.$store.state.corpArr.find(corp => corp.corpid == this.corpId).corp_name
				this.isLoading = true;
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/channelCode/list')
				this.getDetail()
			} else {
				this.getAgentList()
				this.editorFlag = true
			}
			const _this = this
			if (typeof this.corpId != "undefined") {
				// 获取单人类型下成员列表
				this.getUserList()
				// 获取部门列表
				this.getPartyList()
			}
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";

	.steps-action {
		width: calc(100% - 205px);
		position: fixed;
		bottom: 0px;
		background-color: #F0F2F5;
		height: 60px;
		line-height: 60px;
		z-index: 99999;
	}

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 0px 0px 5px 10px;
		text-align: left;
	}

	.content-msg a:link {
		color: #01b065;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.content-msg a:visited {
		color: #01b065;
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
		/*min-width: 760px;*/
		/*position: absolute;*/
		/*top: 200px;*/
		/*left: 20px;*/
		/*right: 20px;*/
		background-color: #FAFAFA;
		/*margin-bottom: 20px;*/
	}

	.steps-content {
		border-radius: 6px;
		height: calc(100% - 130px);
		padding: 0 30px;
		overflow-y: auto;
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
		padding: 20px 0;
		border-bottom: 1px solid #E2E2E2;
	}

	.content-bd {
		padding: 15px 0;
		background: #F5F5F5;
	}

	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
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

	.index {
		float: left;
		width: 30px;
		height: 38px;
		line-height: 38px;
		text-align: center;
		border-right: 1px solid #D8D8D8;
	}

	.type {
		display: inline-block;
		width: 57px;
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
		margin-left: 40px;
		width: 430px;
		max-height: 630px;
		height: 360px;
		background: #FFF;
		border: 1px solid #D8D8D8;
		padding: 24px;
		overflow: hidden;
	}

	.fl {
		/*float: left;*/
		display: inline-block;
	}

	.msg_content_txt {
		line-height: 21px;
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
		border: 2px solid #01b065;
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
		border: 2px solid #01b065;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 5px;
		height: 5px;
		background: #01b065;
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

	.second1 {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
		animation: fadeInOut 1s infinite 0.2s;
	}

	.third1 {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
		animation: fadeInOut 1s infinite 0.4s;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
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

	/deep/ .ant-form-item {
		margin: 5px 0 5px 0;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
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

	/deep/ .ant-form-item-children {
		display: block;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	/deep/ .emoji {
		font-size: 20px;
		height: 40px !important;
		width: 40px !important;
	}

	.icon-btn {
		margin-right: 10px;
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

		p {
			display: inline-block;
		}
	}

	/deep/ .inputTitle2 {
		background: #FFF;
		height: 104px;
		padding: 20px;

		p {
			display: inline-block;
			word-break: break-word;
			width: calc(100% - 74px);
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			float: left;
		}
	}

	.hideMask {
		color: rgba(0, 0, 0, 0.25);
		background-color: #F5F5F5;
		cursor: not-allowed;
		opacity: 0.5;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/deep/ .ant-tag {
		margin-right: 5px;
		height: 26px;
		line-height: 25px;
		border: 1px solid #D9D9D9;
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

	.upload-wrap-pic {
		max-width: 80px;
		max-height: 80px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.wrap {
		border: 1px solid #E2D6D6;
		display: inline-block;
		height: 360px;
		width: 352px;
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
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

	/deep/ .light-row {
		background: #FFF;
	}

	.border-dashed {
		border-bottom: 1px dashed #E2E2E2;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 10px !important;
	}

	/deep/ .ant-tabs-tabpane-inactive {
		display: none;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-tabs-extra-content {
		width: 25px;
		height: 25px;

		span i {
			width: 25px;
			height: 25px;
			color: #01b065;
			border-color: #01b065;
		}
	}

	/deep/ .ant-tabs-tab {
		font-size: 15px;
	}

	/deep/ .ant-tabs-top-content {
		margin-left: 0 !important;
	}

	/deep/ .ant-tabs-tab {
		border: 1px solid #E2E2E2;
	}

	/deep/ .ant-tabs-tab-active {

		background-color: #FFFFFF;
	}

	.code-list {
		display: inline-block;
		width: 180px;
		margin: 10px;
		text-align: center;
	}

	.code {
		display: inline-block;
		width: 170px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border: 1px solid #C3C3C3;
		padding: 5px;
	}

	.code:hover {
		color: #01b065;
		border-color: #01b065;
	}

	.active-code {
		color: #01b065;
		border-color: #01b065;
	}
</style>