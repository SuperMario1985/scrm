<template>
	<div class="fission-add" :key="pageKey">
		<a-spin tip="加载中..." size="large" :spinning="isLoading">
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label style="font-size: 16px;line-height: 32px;">
					<span v-if="id == ''">新建裂变引流</span>
					<span v-else>【{{title}}】编辑</span></label>
				<a-button type="primary"  style="font-size: 14px;float: right;" @click="goBack">返回列表
				</a-button>
			</a-card>
			<div class="content-msg" style="margin: 0 20px;width: auto;margin-bottom: 20px;"
			     v-if="wholeMarketFissionNum > 0">
				当前套餐版本仅支持<span style="color: red;">单场活动</span>用户参与人数上限<span
					style="color: red;">{{wholeMarketFissionNum}}</span>人，达到上限后活动将自动结束。更多套餐信息可联系平台了解哦！
			</div>
			<div style="padding: 0 20px;" v-if="id==''">
				<span v-if="type == 0" @click="changeTabs('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}">
					仅公众号
				</span>
				<span v-if="type == 1" @click="changeTabs('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}">
					仅企业微信
				</span>
				<span v-if="wxList.length > 0 && corpList.length > 0" @click="changeTabs('3')" class="tabBtn"
				      :class="{activeBtn:tabKey == 3}">
					企业微信 + 公众号
				</span>
			</div>

			<!--    仅公众号、企业微信 + 公众号   -->
			<div v-if="tabKey == 1 || tabKey == 3">
				<div class="fission-content">
					<a-steps :current="current" style="padding: 0 30px;cursor: pointer;">
						<a-step @click="changeCurrent(index)" v-for="(item, index) in steps" :key="item.title"
						        :title="item.title"/>
					</a-steps>
					<div class="steps-content">
						<div v-show="current == 0" style="margin: 20px;">
							<div class="content-msg" style="width: 100%;margin-bottom: 20px;" v-if="tabKey == 3">
								<p style="margin-bottom: 2px;">
									企业微信+公众号模式，需客户关注公众号且添加员工企业微信为好友才算助力成功，所以需提前将公众号与企业微信进行授权绑定，便于确认客户身份
								</p>
								<p style="margin-bottom: 0px;">
									<span style="color: #FF562D;">由于官方接口限制，当系统存在多个公众号和企业微信，在创建活动时，只能人工仔细选择对应的已绑定上的企业微信和公众号，否则所有参与人无法完成活动，造成活动无效。</span><a
										target="_blank"
										href="https://support.qq.com/products/104790/faqs/78374">如何配置</a>
								</p>
							</div>
							<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								<template slot="label"><span
										style="color: red">*</span>选择公众号
								</template>
								<template>
									<div style="display: inline-block;cursor: pointer;" @click="changeWx">
										<a-avatar shape="square" :size="40" :src="avatarImg"
										          style="margin: 0 15px;"/>
										<span>{{wxNickName}}</span>
										<a-icon type="caret-down"
										        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
										        v-if="!id"/>
									</div>
									<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
								</template>
								<div v-if="wxMsgFlag" style="color: #FF562D">该公众号未配置相关功能权限，请重新选择</div>
							</a-form-item>
							<a-form-item class="current0" v-if="$store.state.corpArr.length > 1 && tabKey == 3"
							             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								<template slot="label"><span
										style="color: red">*</span>选择企业微信
								</template>
								<template>
									<div style="display: inline-block;cursor: pointer;" @click="changeCorp">
										<img src="../../../../assets/WeChatLogo.png"
										     style="width: 24px;margin: -3px 6px 0 0;"/>
										<span>{{corpName}}</span>
										<a-icon type="caret-down"
										        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
										        v-if="!id"/>
									</div>
									<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
								</template>
								<div v-if="msgFlag" style="color: #FF562D">该企业微信未配置相关功能权限，请重新选择</div>
							</a-form-item>
							<a-form-item v-if="tabKey == 3" class="current0" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								<template slot="label"><span
										style="color: red">*</span>选择应用
								</template>
								<template>
									<!--												@change="changeApp"-->
									<a-select
											:disabled="!!id && (status != 1 || status == '')"
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
									<div class="content-msg" style="font-size: 13px;">
										<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a
												target="_blank"
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
								<a-input :disabled="!!id && (status != 1 || status == '')" v-model="title"
								         placeholder="请填写活动名称，限20字符"
								         :maxLength="20"
								         style="width: 350px"></a-input>
								<span style="display: inline-block; width: 200px; margin-left: 10px;color: #F56C6C">{{title === null ? 0 : title.length}} / 20（一旦发布，不可修改）</span>
							</a-form-item>
							<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								<template slot="label"><span
										style="color: red">*</span>活动时间
								</template>
								<div>
									<a-date-picker
											:disabled="!!id && (status != 1 || status == '')"
											:disabledDate="disabledStartDate"
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
											:disabledDate="disabledEndDate"
											v-model='endDate'
											@change="changeEndTime"
											:showTime="{
												        hideDisabledOptions: true,
												        defaultValue: moment('23:59', 'HH:mm'),
												        format:'HH:mm'
												   }"
											format="YYYY-MM-DD HH:mm"
									/>
									<span style="margin-left: 5px;color: #F56C6C">
										（
										<template v-if="tabKey == 2">
											一旦发布，只可更改结束时间
										</template>
										<template v-if="tabKey != 2">
											目前活动有效期最长30天，一旦发布，只可延长结束时间
										</template>
										）
									</span>
								</div>
							</a-form-item>
							<!--							<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
							<!--								<template slot="label">-->
							<!--									<span style="color: red">*</span>兑奖时间-->
							<!--								</template>-->
							<!--								<div>-->
							<!--									<a-date-picker-->
							<!--											:disabled="!!id && (status != 1 || status == '')"-->
							<!--											:disabledDate="disabledDate"-->
							<!--											v-model='ticketStartDate'-->
							<!--											@change="changeTicketStartTime"-->
							<!--											:showTime="{-->
							<!--												        hideDisabledOptions: true,-->
							<!--												        defaultValue: moment('00:00', 'HH:mm'),-->
							<!--												        format:'HH:mm'-->
							<!--												   }"-->
							<!--											format="YYYY-MM-DD HH:mm"-->
							<!--									/>-->
							<!--									~-->
							<!--									<a-date-picker-->
							<!--											:disabledDate="disabledDate"-->
							<!--											v-model='ticketEndDate'-->
							<!--											@change="changeTicketEndTime"-->
							<!--											:showTime="{-->
							<!--												        hideDisabledOptions: true,-->
							<!--												        defaultValue: moment('23:59', 'HH:mm'),-->
							<!--												        format:'HH:mm'-->
							<!--												   }"-->
							<!--											format="YYYY-MM-DD HH:mm"-->
							<!--									/>-->
							<!--									<span style="margin-left: 5px;color: #F56C6C">（一旦发布，只可更改截止时间。获得奖品，请在兑奖时间内领取，数量有限，逾期视为自动放弃。）</span>-->
							<!--								</div>-->
							<!--							</a-form-item>-->
							<!--							<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
							<!--								<template slot="label">-->
							<!--									<span style="color: red">*</span>活动规则-->
							<!--								</template>-->
							<!--								<UEditor v-if="editorFlag" class="ruleUeditor" style="height: 100%; width: 100%;"-->
							<!--								         :isTitle='false'-->
							<!--								         :imageText="rule"-->
							<!--								         @changeImageText="changeImageText"-->
							<!--								>-->
							<!--								</UEditor>-->
							<!--							</a-form-item>-->
						</div>
						<div v-show="current == 1" style="margin: 20px;">
							<div v-for="(item, index) in prizes"
							     style="margin: 10px 0;border-color: #F0F0F0;">
								<!--								<div style="background-color: #F5F7FA;height: 40px;line-height: 40px;padding: 0 10px;color: #333333">-->
								<!--									<label v-if="index == 0">一阶任务设置</label>-->
								<!--									<label v-if="index == 1">二阶任务设置</label>-->
								<!--									<label v-if="index == 2">三阶任务设置</label>-->
								<!--									<a-switch v-if="index != 0" style="float: right; margin-top: 9px;"-->
								<!--									          :disabled="index == 0 || (index == 1 && prizes[2].is_open == 1) || (index == 2 && prizes[1].is_open == 0)"-->
								<!--									          v-model="item.is_open == 1" default-checked-->
								<!--									          @change="onChangeOpen(index)"/>-->
								<!--								</div>-->
								<div v-if="item.is_open == 1" style="background-color: #FFFFFF;padding: 10px 0;">
									<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
									             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
										<template slot="label"><span
												style="color: red">*</span>裂变人数
										</template>
										需要拉
										<a-input-number
												:disabled="!!id && (status != 1 || status == '')"
												class="brush-input"
												:min="0" :max="99999999"
												:formatter="limitDecimals"
												:parse="limitDecimals"
												@input.native="inputFissionNum"
												v-model="item.number"></a-input-number>
										好友可领礼物
										<span style="color: #01b065;height: 24px;line-height: 24px;">
								<span style="color: #F56C6C">（一旦发布，不可更改）</span>
							</span>
									</a-form-item>
									<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
									             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
										<template slot="label">
											<span style="color: red;">*</span>奖品类型
										</template>
										<a-radio-group name="radioGroup" v-model="item.type"
										               :disabled="!!id && (status != 1 || status == '')">
											<a-radio value="1">实物</a-radio>
											<a-radio value="2">红包
												<span v-if="item.type == 2" style="color: #F56C6C;">（一旦发布，不可修改。发红包，用户立即到账到个人零钱，请商户务必保障微信支付商户平台账户余额充足）</span>
											</a-radio>
										</a-radio-group>
										<span v-if="item.type == 1" style="color: #F56C6C;">（一旦发布，不可修改。）</span>
									</a-form-item>
									<template v-if="item.type == 1">
										<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
										             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
											<template slot="label"><span
													style="color: red">*</span>奖品名称
											</template>
											<a-input v-model="item.prize_name" placeholder="请填写奖品名称，限20字符"
											         :maxLength="20"
											         style="width: 350px;"
											         :disabled="!!id && (status != 1 || status == '')"></a-input>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{item.prize_name === null ? 0 : item.prize_name.length}} / 20</span>
										</a-form-item>
										<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
										             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
											<template slot="label"><span
													style="color: red">*</span>奖品库存
											</template>
											<a-input-number
													class="brush-input"
													:min="0" :max="99999999"
													placeholder="不限"
													:formatter="limitDecimals"
													:parse="limitDecimals"
													:disabled="!!id && (status != 1 || status == '') && !prizes1[index].num"
													@blur="blurNum(index)"
													@input.native="e => inputNum(e, index)"
													v-model="item.num"></a-input-number>
											件
											<span style="color: #F56C6C;">（一旦发布后，只可增加不可减少。）</span>
										</a-form-item>
									</template>
									<template v-if="item.type == 2">
										<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
										             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
											<template slot="label">
												<span style="color: red">*</span>红包金额
											</template>
											<a-input-number :step="0" :precision="2"
											                style="width: 140px;margin-right: 5px;"
											                :min="0.30"
											                :max="5000.00"
											                v-model="item.money_amount"
											                :disabled="!!id && (status != 1 || status == '')"/>
											元
											<span style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入0.30~5000.00）</span>
										</a-form-item>
										<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
										             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
											<template slot="label">
												<span style="color: red">*</span>红包数量
											</template>
											<a-input-number
													class="brush-input"
													:min="0" :max="99999999"
													placeholder="红包数量"
													:formatter="limitDecimals"
													:parse="limitDecimals"
													@blur="blurPrizeNum(index)"
													@input.native="e => inputPrizeNum(e, index)"
													v-model="item.money_count"></a-input-number>
											个
											<span style="color: #F56C6C;height: 24px;line-height: 24px;">
												（一旦发布后，只可增加不可减少。）
							</span>
										</a-form-item>
									</template>
									<a-form-item class="current0" v-if="prizes[0].type == 1"
									             :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
									             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
										<template slot="label">
											<span style="color: red">*</span>领奖方式
										</template>
										<a-radio-group style="margin-top: 9px;" name="actionType"
										               :value="actionType"
										               @change="changeActionType"
										               :disabled="!!id && (status != 1 || status == '')">
											<a-radio value="2">
												联系客服
												<a-tooltip placement="bottom">
													<template slot="title">
														<span>主要适用于需要到店自提的奖品、或是以线下发放为主的虚拟奖品。如“XXX运营干货PPT”</span>
													</template>
													<a-icon type="question-circle" style="margin-left:5px;"/>
												</a-tooltip>
												（请在【提醒设置】--【任务完成推送图片】，上传图片，一般是放客服微信二维码或者群二维码。）
											</a-radio>
											<a-radio value="1" style="margin-top: 9px;">
												兑换链接
												<a-tooltip placement="bottom">
													<template slot="title">
														<span>主要适用于需要快递物流的奖品</span>
													</template>
													<a-icon type="question-circle" style="margin-left:5px;"/>
												</a-tooltip>
												（当任务完成时，推送【任务完成提醒】通知，默认文案里含有填写收货的链接地址。）
											</a-radio>
										</a-radio-group>
										<!--								<div v-if='actionType == 2'>-->
										<!--									<a-button style="margin-left: 10px;" @click="showDepartmentList(1)">-->
										<!--										<span v-if="userKeyNum > 0">已选择{{userKeyNum}}名员工</span>-->
										<!--										<span v-else>选择员工</span>-->
										<!--									</a-button>-->
										<!--								</div>-->
										<!--								<div v-if="actionType == 1">-->
										<!--									<a-checkbox-group :disabled="true" v-model="info">-->
										<!--										<a-checkbox :value="1">-->
										<!--											姓名-->
										<!--										</a-checkbox>-->
										<!--										<a-checkbox :value="2">-->
										<!--											手机号-->
										<!--										</a-checkbox>-->
										<!--										<a-checkbox :value="3">-->
										<!--											地址（输入框）-->
										<!--										</a-checkbox>-->
										<!--										<a-checkbox :value="4">-->
										<!--											备注-->
										<!--										</a-checkbox>-->
										<!--									</a-checkbox-group>-->
										<!--								</div>-->
									</a-form-item>
								</div>
							</div>
							<!--							<a-form-item class="current0" :label-col="{xl:{ span: 3 }, xxl:{span: 2}}"-->
							<!--							             :wrapper-col="{xl:{ span: 21 }, xxl:{span: 22}}">-->
							<!--								<template slot="label">-->
							<!--									自动结束任务-->
							<!--								</template>-->
							<!--								&lt;!&ndash;								300&ndash;&gt;-->
							<!--								<a-checkbox-group v-model="level" style="display: inline-block;width: 80px;">-->
							<!--									<a-checkbox :value="1">-->
							<!--										库存-->
							<!--									</a-checkbox>-->
							<!--									&lt;!&ndash;									<a-checkbox :value="2">&ndash;&gt;-->
							<!--									&lt;!&ndash;										二阶库存&ndash;&gt;-->
							<!--									&lt;!&ndash;									</a-checkbox>&ndash;&gt;-->
							<!--									&lt;!&ndash;									<a-checkbox :value="3">&ndash;&gt;-->
							<!--									&lt;!&ndash;										三阶库存&ndash;&gt;-->
							<!--									&lt;!&ndash;									</a-checkbox>&ndash;&gt;-->
							<!--								</a-checkbox-group>-->
							<!--								<span style="color: #F56C6C;" v-if="level.length == 1">当-->
							<!--								<span v-if="level[0] == 1">库存</span>-->
							<!--									&lt;!&ndash;								<span v-if="level[0] == 2">二阶库存</span>&ndash;&gt;-->
							<!--									&lt;!&ndash;								<span v-if="level[0] == 3">三阶库存</span>&ndash;&gt;-->
							<!--								为0时自动结束-->
							<!--							</span>-->
							<!--								&lt;!&ndash;								<span style="color: #F56C6C;" v-if="level.length > 1">当&ndash;&gt;-->
							<!--								&lt;!&ndash;									<span v-if="level.indexOf(1) > -1">一阶库存</span>&ndash;&gt;-->
							<!--								&lt;!&ndash;									<span v-if="level.indexOf(2) > -1"> 二阶库存</span>&ndash;&gt;-->
							<!--								&lt;!&ndash;									<span v-if="level.indexOf(3) > -1"> 三阶库存</span>&ndash;&gt;-->
							<!--								&lt;!&ndash;							同时为0时自动结束</span>&ndash;&gt;-->
							<!--							</a-form-item>-->
						</div>
						<div v-show="current == 2" style="margin: 20px;">
							<!--						<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">参与限制<span-->
							<!--								style="color: #F56C6C;">（不论是个人拆领红包，还是其好友拆领，无法满足下列要求，均拆领失败）</span></span>-->
							<!--							<a-divider/>-->
							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
								<template slot="label">
									<span style="color: red;">*</span>性别参与
								</template>
								<a-radio-group name="radioGroup" :value="sexType" @change="changeSexType"
								               :disabled="!!id && (status != 1 || status == '')">
									<a-radio value="4">不限制</a-radio>
									<a-radio value="1">仅男性参与</a-radio>
									<a-radio value="2">仅女性参与</a-radio>
									<a-radio value="3">未知</a-radio>
								</a-radio-group>
								<div style="color: #F56C6C;">（一旦发布，不可修改。以在本系统的性别数据为准）</div>
							</a-form-item>
							<!--														<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">客户标签<span-->
							<!--																style="color: #F56C6C;">（不论邀请人，还是助力者，只要参与该场活动，则自动打上选中的客户标签）</span></span>-->
							<!--														<a-divider/>-->
							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
								<template slot="label">
									客户标签
									<a-tooltip placement="right" style="vertical-align: inherit;">
										<template slot="title">
											<span>不论邀请人，还是助力者，只要参与该场活动，则自动打上选中的客户标签</span>
										</template>
										<a-icon type="question-circle" style="margin-left:5px;"/>
									</a-tooltip>
								</template>
								<div v-if="tabKey == 1" style="background-color: #FFFFFF;padding: 10px;"
								     class="current0 ant-col-20">

									<a-checkable-tag v-model="tagChecked[index]" @change="changeTags(index)"
									                 style="margin: 5px; border: 1px solid #C3C3C3;"
									                 v-for="(item, index) in tagList">
										{{item.name}}
									</a-checkable-tag>
									<div style="display: inline-block;">
										<a-tag @click="addFansTag" v-has="'tag-add'">
											<a-icon type="plus" :size="14"></a-icon>
											新建标签
										</a-tag>
									</div>
								</div>

								<div v-if="tabKey == 3" class="current0 ant-col-20">
									<corpChooseTag :callback="modalVisibleChange4" :hasChoose="tag_arr"
									               v-if="isShowTag"></corpChooseTag>
								</div>
							</a-form-item>
							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
								<template slot="label">
									<label style="width: 130px; text-align: right; display: inline-block;">
										好友助力次数
										<a-tooltip placement="right" style="vertical-align: inherit;">
											<template slot="title">
												<span>在本场活动中，好友给某人助力后，再给其他人助力。如设置2次，本人给用户A助力后，又可以给用户B再助力。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</label>
								</template>
								<a-input-number
										:disabled="!!id && (status != 1 || status == '')"
										class="brush-input"
										:min="1"
										:formatter="limitDecimals"
										:parse="limitDecimals"
										@input.native="helpNum"
										v-model="help_num"></a-input-number>
								次
								<span style="color: #F56C6C;">（不填写，则默认为不限制。一旦发布，不可修改。）</span>
							</a-form-item>
							<!--							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">-->
							<!--								<template slot="label">-->
							<!--									<label style="width: 130px; text-align: right; display: inline-block;">-->
							<!--										互助-->
							<!--									</label>-->
							<!--								</template>-->
							<!--								<a-switch :disabled="!!id && (status != 1 || status == '')" :checked="mutual == 1"-->
							<!--								          @click="changeMutual"/>-->
							<!--								<span style="color: #F56C6C;">（不填写，则默认为不限制。一旦发布，不可修改。）</span>-->
							<!--							</a-form-item>-->
							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
								<template slot="label">
									<label style="width: 130px; text-align: right; display: inline-block;">
										有效助力人数
									</label>
								</template>
								<a-radio-group name="radioGroup" @change="changeEffective" v-model="effectiveHelp"
								               :disabled="!!id && (status != 1 || status == '')">
									<a-radio value="2">
										取关扣除助力人数
										<a-tooltip placement="right" style="vertical-align: inherit;">
											<template slot="title">
												<span>如果好友取消关注公众号，会扣除粉丝的有效助力人数，但不影响已获得的奖品，同时邀请人会收到“取关扣除助力人数提醒”。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</a-radio>
									<a-radio v-if="tabKey == 3" value="4">
										仅被客户删除/拉黑扣除助力人数
										<a-tooltip placement="right" style="vertical-align: inherit;">
											<template slot="title">
												<span>即如果被好友删除/拉黑，会扣除粉丝的有效助力人数，但不影响已获得的奖品，同时邀请人会收到“取关扣除助力人数提醒”。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</a-radio>
									<a-radio v-if="tabKey == 3" value="3">
										取关+被客户删除/拉黑扣除助力人数
										<a-tooltip placement="right" style="vertical-align: inherit;">
											<template slot="title">
												<span>如果好友取关且将企业成员删除/拉黑，会扣除粉丝的有效助力人数，但不影响已获得的奖品，同时邀请人会收到“取关扣除助力人数提醒”。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</a-radio>
									<a-radio value="1">
										不处理
										<a-tooltip placement="right" style="vertical-align: inherit;">
											<template slot="title">
												<span v-if="tabKey == 1">无论任务尚无完成，好友取关了，均不扣除助力人数，邀请人也不会收到“取关扣除助力人数提醒”。</span>
												<span v-if="tabKey == 3">无论任务尚无完成，当好友取关或被好友删除/拉黑，均没有任何提示，助力人数不变。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</a-radio>
								</a-radio-group>
							</a-form-item>
						</div>
						<div v-show="current == 3" style="margin: 20px;">
							<div style="width: calc(100% - 415px); float: right;padding-left: 20px;">
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
											图片像素建议为750*1334像素，格式为jpg、bmp、png，大小不超过2M
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
									<div style="margin-top: 10px;">
										<div style="display: inline-block;" v-if="is_nickname">
											<div>颜色
												<template>
													<a-popover
															trigger="click"
															placement="right"
													>
														<color-picker slot="content"
														              v-model="color"></color-picker>
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
										<!--									<div style="display: inline-block;vertical-align: top; margin-left: 40px"-->
										<!--									     v-if="is_nickname">-->
										<!--										<a-button @click="changeAlign('left')"-->
										<!--										          :class="align== 'left' ? 'shape-active' : '' "-->
										<!--										          style="margin-left: 10px;display: inline-block;"-->
										<!--										>-->
										<!--											左对齐-->
										<!--										</a-button>-->
										<!--										<a-button @click="changeAlign('center')"-->
										<!--										          :class="align== 'center' ? 'shape-active' : '' "-->
										<!--										          style="margin-left: 10px;display: inline-block;"-->
										<!--										>-->
										<!--											居中-->
										<!--										</a-button>-->
										<!--										<a-button @click="changeAlign('right')"-->
										<!--										          :class="align== 'right' ? 'shape-active' : '' "-->
										<!--										          style="margin-left: 10px;display: inline-block;"-->
										<!--										>-->
										<!--											右对齐-->
										<!--										</a-button>-->
										<!--									</div>-->
									</div>
								</a-form-item>
								<a-divider/>
								<div>
									海报生成
								</div>
								<a-divider/>
								<a-form-item class="current0" :label-col="{xl: { span: 6 }, xxl : {span : 4}}"
								             :wrapper-col="{ xl: { span: 18 }, xxl : {span : 20} }">
									<template slot="label">
										<span style="color: red">*</span>活动触发关键词
									</template>
									<a-input v-model="keyword" placeholder="关键词" :maxLength="10"
									         style="width: 200px;"
									         :disabled="!!id && (status != 1 || status == '')">
										<span slot="suffix"><span>{{keyword.length}}</span>/10</span>
									</a-input>
									公众号回复关键词可参与活动
								</a-form-item>
								<a-form-item class="current0" :label-col="{xl: { span: 6 }, xxl : {span : 4}}"
								             :wrapper-col="{ xl: { span: 18 }, xxl : {span : 20} }">
									<template slot="label">
										<span style="color: red">*</span>活动规则描述
									</template>
									关注回复后推送带个人参数二维码海报+对活动的整体描述
									<div class="changeType-text">
										如何设置链接：输入文案后，
										鼠标选中想要插入链接的关键词，点击出现的“设置链接”，即可填入链接。
										提示：火狐浏览器可能出现无法正确插入粉丝昵称，请使用谷歌、360浏览器
									</div>
									<editor1 v-if="editorFlag" :text="ruleTextContent"
									         :textValue="ruleTextValue"
									         :isFissionTag="false"
									         :index=1
									         :isRanking="true"
									         :isList="false"
									         @changeText="changeRuleText">
									</editor1>
								</a-form-item>
								<a-form-item class="current0" :label-col="{xl: { span: 6 }, xxl : {span : 4}}"
								             :wrapper-col="{ xl: { span: 18 }, xxl : {span : 20} }">
									<template slot="label">
										海报分享话术
									</template>
									<a-switch :checked="isOpenPosters == 1" @click="changeOpenPosters"/>
									开启后和海报一起弹出，为粉丝分享海报提供的文案
									<editor1 v-if="editorFlag && isOpenPosters == 1" :text="postersTextContent"
									         :isFissionTag="false"
									         :isRanking='true'
									         :isList="false"
									         :textValue="postersTextValue"
									         :index=2
									         @changeText="changePostersText">
									</editor1>
								</a-form-item>
							</div>
							<div style="width: 415px; padding: 0px 20px; float: left;margin-bottom: 20px;">
								<!-- 更改海报时改变menuKey重新渲染 -->
								<div style="width: 391px;border: 8px solid rgb(241, 241, 241);" :key="menuKey"
								     :style="{height: (backHeight + 18) + 'px'}">
									<div class="page-content" :style="{ 'height': backHeight + 'px' }">
										<img v-show="back_pic_url" style="width: 100%;position: absolute;"
										     draggable="false"
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
											     src="../../../../assets/fission/add/qrcode.png">
										</vue-draggable-resizable>
									</div>
								</div>
							</div>
						</div>
						<div v-show="tabKey == 3 && current == 4" style="margin: 20px;">
							<div style="width: calc(100% - 350px);display: inline-block">
								<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
									<template slot="label">
										引流设置
									</template>
									海报二维码自带对应参数，扫码后会将客户引流至对应的企业成员
								</a-form-item>
								<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
									<template slot="label"><span
											style="color: red">*</span>引流成员
									</template>
									<a-button style="margin-left: 10px;" @click="showDepartmentList">
										选择
									</a-button>
									<span style="margin-left: 5px"
									      v-show="chooseNum1 > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
									<a style="margin-left: 10px;" v-show="chooseNum1 > 0"
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
										新用户参与
									</template>
									<editor v-if="editorFlag" :text="text_content"
									        :textValue="textAreaValueHeader"
									        :isEmoji="false"
									        :isRanking="true"
									        @changeText="changeText">
									</editor>
								</a-form-item>
								<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
									<template slot="label">
										助力成功
									</template>
									<editor v-if="editorFlag" :text="text_content1"
									        :textValue="textAreaValueHeader1"
									        :isEmoji="false"
									        :isRanking="true"
									        @changeText="changeText1">
									</editor>
								</a-form-item>
								<a-form-item v-if="tabKey == 2" class="current0" :label-col="{ span: 3 }"
								             :wrapper-col="{ span: 21 }">
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
										<img v-if="link_pic_url" :src="commonUrl + link_pic_url"
										     alt="avatar"
										     style="max-width:96px;max-height:96px;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);"/>
										<div v-else style="    padding-top: 27px;margin-left: 18px;">
											<a-icon style="margin-left: 23px" :type="loading? 'loading' : 'plus'"/>
											<div class="ant-upload-text">点击上传</div>
										</div>
									</a-upload>
									<span style="display: inline-block;vertical-align: bottom;">（图片大小不超过2M，支持JPG、JPEG及PNG格式。建议尺寸200*200）</span>
								</a-form-item>
								<!-- 填写标题 -->
								<a-form-item v-if="tabKey == 2" class="current0" :label-col="{ span: 3 }"
								             :wrapper-col="{ span: 21 }">
									<template slot="label"><span
											style="color: red">*</span>填写标题
									</template>
									<a-input v-model="link_start_title" style="width: 500px;"
									         :maxLength="32">
										<span slot="suffix"><span>{{link_start_title.length}}</span>/32</span>
									</a-input>
								</a-form-item>
								<!-- 添加描述 -->
								<a-form-item v-if="tabKey == 2" class="current0" style="margin-top: 10px;"
								             label="添加描述"
								             :label-col="{ span: 3 }"
								             :wrapper-col="{ span: 21 }">
									<div>
										<a-textarea style="width: 500px;" placeholder="填写图文描述" v-model="link_desc"
										            :maxLength="128" :rows="4"/>
									</div>
									<div style="width: 500px; text-align: right">
										<span>{{link_desc.length}}</span>/128
									</div>
								</a-form-item>
							</div>
							<div style="width: 300px;float: right;height: 600px;">
								<div class="wrap left-sider-content">
									<img src="../../../../assets/wxHeader.png" alt
									     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
									<div class="msg_content_body">
										<!--文本-->
										<div v-if="textAreaValueHeader" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;float: left;"/>
											<span v-html="textAreaValueHeader"
											      class="item-info msg_content_txt"></span>
										</div>
										<!--网址-->
										<div v-if="(link_start_title || link_desc || link_pic_url) && tabKey == 2 "
										     class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;float: left;"/>
											<div class="item-info msg_content_txt">
												<p class="url-title">{{link_start_title}}</p>
												<div style="overflow: hidden;">
													<div class="url-text">{{link_desc}}</div>
													<img :src="commonUrl+link_pic_url" alt=""
													     style="float: right;width: 64px;height: 64px;object-fit: cover;">
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-show="(tabKey == 1 && current == 4) || (tabKey == 3 && current == 5)"
						     style="margin: 20px;">
							<div style="margin: 5px 0px; color: #F56C6C;">
								服务号支持文本或模板消息通知助力情况，其中模板消息支持【IT科技/互联网/电子商务】和【教育培训】两大行业，其他行业暂不支持模板消息，可用文本类型通知代替。不过由于微信限制，文本过多可能会被腾讯拦截，存在粉丝收不到的情况。
							</div>
							<a-row v-if="wxInfo.wx_id" style="margin: 30px 0;">
								<a-col :span="6">
									{{wxInfo.nick_name}}
								</a-col>
								<a-col :span="6">
									<span v-if="wxInfo.service_type == 1">订阅号</span>
									<span v-if="wxInfo.service_type == 2">服务号</span>
								</a-col>
								<a-col :span="6">
									{{wxInfo.industry}}
								</a-col>
								<a-col :span="6">
									<a-radio-group name="radioGroup" v-model="isTemplate" @change="changeIsTemplate"
									               :disabled="!!id && (status != 1 || status == '')">
										<a-radio value="0">文本消息</a-radio>
										<a-radio value="1" v-if="wxInfo.service_type == 2">模板消息</a-radio>
									</a-radio-group>
								</a-col>
							</a-row>
							<div class="changeType-text">
								如何设置链接：输入文案后，
								鼠标选中想要插入链接的关键词，点击出现的“设置链接”，即可填入链接。
								提示：火狐浏览器可能出现无法正确插入粉丝昵称，请使用谷歌、360浏览器
							</div>
							<template v-for="(item,index) in reply">
								<div v-show="index == 0" style="margin: 20px 20px 20px 0; width: 100%;">
									<span style="display: inline-block;padding-left: 10px;border-left: 4px solid #01b065;font-weight: 700;">参与者提醒</span>
									<a-divider/>
								</div>
								<!--								<div v-show="index == 6" style="margin: 20px 20px 20px 0;width: 100%;">-->
								<!--									<span style="display: inline-block;padding-left: 10px;border-left: 4px solid #01b065;font-weight: 700;">重复参加提醒</span>-->
								<!--									<a-divider/>-->
								<!--								</div>-->
								<div v-show="index == 7" style="margin: 20px 20px 20px 0;width: 100%;">
									<span style="display: inline-block;padding-left: 10px;border-left: 4px solid #01b065;font-weight: 700;">好友提醒</span>
									<a-divider/>
								</div>
								<div v-show="index == 10" style="margin: 20px 20px 20px 0;width: 100%;">
									<span style="display: inline-block;padding-left: 10px;border-left: 4px solid #01b065;font-weight: 700;">其他提醒</span>
									<a-divider/>
								</div>
								<div style="margin-right: 2%; width: 48%; display: inline-block; vertical-align: top;">
									<div v-if="item.type == 1" style="margin-bottom: 5px;font-weight: 600;">
										<span style="color: #F56C6C;">*</span>
										新成员加入提醒
									</div>
									<div v-if="item.type == 2" style="margin-bottom: 5px;font-weight: 600;">
										<span style="color: #F56C6C;">*</span>
										好友取关扣除人气提醒
									</div>
									<div v-if="item.type == 6" style="margin-bottom: 5px;font-weight: 600;">
										重复参加提醒
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<div v-if="item.type == 3" style="margin-bottom: 5px;font-weight: 600;">
										<span style="color: #F56C6C;">*</span>
										任务完成提醒
										<a-tooltip placement="bottom">
											<template slot="title">
												<span>任务完成后会发送此提醒，建议加上领取奖品的步骤。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</div>
									<div v-if="item.type == 4" style="margin-bottom: 5px;font-weight: 600;">
										任务完成推送图片
										<a-tooltip placement="bottom">
											<template slot="title">
												<span>只有任务完成提醒可推送图片，一般是放客服微信二维码或者群二维码。推送一次即可。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          :disabled="actionType == 2"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<!--									<div v-if="item.type == 5 && prizes[1].is_open == 1"-->
									<!--									     style="margin-bottom: 5px;font-weight: 600;">-->
									<!--										二阶任务完成提醒-->
									<!--									</div>-->
									<!--									<div v-if="item.type == 6 && prizes[2].is_open == 1"-->
									<!--									     style="margin-bottom: 5px;font-weight: 600;">-->
									<!--										三阶任务完成提醒-->
									<!--									</div>-->
									<div v-if="item.type == 8" style="margin-bottom: 5px;font-weight: 600;">
										好友助力成功提醒
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<div v-if="item.type == 9" style="margin-bottom: 5px;font-weight: 600;">
										互助无效提醒
										<a-tooltip placement="bottom">
											<template slot="title">
												<span>若好友不符合助力要求，则会向好友发此通知。已参加过本活动的粉丝会收到此通知。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<div v-if="item.type == 15" style="margin-bottom: 5px;font-weight: 600;">
										助力次数达到上限提醒
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<div v-if="item.type == 10" style="margin-bottom: 5px;font-weight: 600;">
										奖品不足提醒
										<a-tooltip placement="bottom">
											<template slot="title">
												<span>奖品库存为0时，如果粉丝继续邀请粉丝，则会发送此提醒。粉丝主动获取进度时，如果奖品库存为0，也会推送此提醒.</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<div v-if="item.type ==11" style="margin-bottom: 5px;font-weight: 600;">
										免打扰任务提醒
										<a-tooltip placement="bottom">
											<template slot="title">
												<span>为了不打扰用户，造成用户取关或举报，在第三人助力后，会自动拦截不是很重要的助力成功提醒。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<div v-if="item.type == 12" style="margin-bottom: 5px;font-weight: 600;">
										活动下线提醒
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<div v-if="item.type == 13" style="margin-bottom: 5px;font-weight: 600;">
										活动完成后继续有新成员加入提醒
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<div v-if="item.type == 14 && tabKey == 3"
									     style="margin-bottom: 5px;font-weight: 600;">
										提示邀请者让好友添加企业微信好友提醒
										<a-switch style="float: right;" :checked="item.is_open == 1"
										          @change="changeNotice(index)"></a-switch>
									</div>
									<!--									&& ( index != 4-->
									<!--									|| (index == 4 && prizes[1].is_open == 1)-->
									<!--									) && (index != 5-->
									<!--									|| (index == 5 && prizes[2].is_open == 1)-->
									<!--									)-->
									<editor1
											v-if="item.is_open == 1 && editorFlag && item.type != 5 && item.type != 7
										&& item.type != 4
										&& (
											(item.type != 14)
											|| (item.type == 14 && tabKey == 3)
										)
										&& item.is_template == 0"
											:isList="!(item.type == 1 || item.type == 2 || item.type == 8 || item.type == 9)"
											:isRanking="item.type == 1 || item.type == 2 ||  item.type == 3 || item.type == 5 || item.type == 7 || item.type == 6 || item.type == 10 || item.type == 11"
											:text="item.context"
											:isFriend="(item.type == 1 || item.type == 2 || item.type == 3 || item.type == 9)"
											:isFissionTag="!(item.type == 8 || item.type == 9)"
											:textValue="item.textValue"
											:index=index
											style="margin-bottom: 15px; background-color: #FFFFFF;padding: 15px;"
											@changeText="changeNoticeText">
									</editor1>
									<TemplateMsgModel :index="index" :key="index" @changeUrl="changeUrl"
									                  @changeText="changeTemplate"
									                  :templates="item"
									                  v-if="item.type < 4 && item.is_template == 1 && editorFlag && !item.msg">
									</TemplateMsgModel>
									<div v-if="item.type < 4 && item.is_template == 1 && editorFlag && item.msg"
									     style="margin-top: 20px;">
										<a-empty>
											<div slot="description" style="color: #999;">
												<div v-if="item.msg == 1">
													<p style="margin-bottom: 0px;">您的公众号模板库已达上限25个，无法再为您自动创建该模板</p>
													<p style="margin-bottom: 0px;">请先登录您的<a
															style="text-decoration: underline;"
															href="https://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm2-login&lang=zh_CN"
															target="_blank">微信公众平台</a>进行删除现有模板。</p>
												</div>
												<div v-if="item.msg == 2">
													<p style="margin-bottom: 0px;">您的公众号模板库已达上限25个，无法再为您自动创建该模板</p>
													<p style="margin-bottom: 0px;">请先登录您的<a
															style="text-decoration: underline;"
															href="https://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm2-login&lang=zh_CN"
															target="_blank">微信公众平台</a>进行删除现有模板。</p>
												</div>
											</div>
										</a-empty>
									</div>
									<a-upload
											class="one-level-pig"
											style="margin-bottom: 15px;width: 100%;cursor: pointer;"
											v-if="item.type == 4 && item.is_open == 1"
											action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
											:showUploadList="false"
											:beforeUpload="beforeUpload2"
									>
										<!--									@change="uploadImage"-->
										<div style="width: 100%;">
											<div v-if="!item.img_url"
											     style="background-color: #FFFFFF;height: 210px;line-height: 210px; width: 100%;">
												<span style="display: block; text-align: center;">
													<a-icon style="font-size: 30px;" type="plus"></a-icon>
													<span style="display: inline-block;font-size: 16px;vertical-align: super;">
														上传图片
													</span>
												</span>
											</div>
											<img v-if="item.img_url" style="max-width: 210px; max-height: 210px;"
											     :src="commonUrl + item.img_url"/>
										</div>
										<!--									<div style="margin-top: 10px;">-->
										<!--										图片像素建议为750*1334像素，格式为jpg、bmp、png，大小不超过2M-->
										<!--									</div>-->
									</a-upload>
								</div>
							</template>
						</div>
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
						          :loading="createLoading"
						          v-if="current == steps.length - 1"
						          type="primary"
						          @click="createActivity"
						>
							提交
						</a-button>
					</div>
				</div>
			</div>
			<!--    仅企业微信   -->
			<div v-if="tabKey == 2">
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
										<img src="../../../../assets/WeChatLogo.png"
										     style="width: 24px;margin: -3px 6px 0 0;"/>
										<span>{{corpName}}</span>
										<a-icon type="caret-down"
										        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
										        v-if="!id"/>
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
											:disabled="!!id && (status != 1 || status == '')"
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
									<div class="content-msg" style="font-size: 13px;">
										<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a
												target="_blank"
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
								<a-input :disabled="!!id && (status != 1 || status == '')" v-model="title"
								         placeholder="请填写活动名称，限20字符"
								         :maxLength="20"
								         style="width: 350px"></a-input>
								<span style="display: inline-block; width: 200px; margin-left: 10px;color: #F56C6C">{{title === null ? 0 : title.length}} / 20（一旦发布，不可修改）</span>
							</a-form-item>
							<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								<template slot="label"><span
										style="color: red">*</span>活动时间
								</template>
								<div>
									<a-date-picker
											:disabled="!!id && (status != 1 || status == '')"
											:disabledDate="disabledStartDate"
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
											:disabledDate="disabledEndDate"
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
							<!--							<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
							<!--								<template slot="label">-->
							<!--									<span style="color: red">*</span>兑奖时间-->
							<!--								</template>-->
							<!--								<div>-->
							<!--									<a-date-picker-->
							<!--											:disabled="!!id && (status != 1 || status == '')"-->
							<!--											:disabledDate="disabledDate"-->
							<!--											v-model='ticketStartDate'-->
							<!--											@change="changeTicketStartTime"-->
							<!--											:showTime="{-->
							<!--												        hideDisabledOptions: true,-->
							<!--												        defaultValue: moment('00:00', 'HH:mm'),-->
							<!--												        format:'HH:mm'-->
							<!--												   }"-->
							<!--											format="YYYY-MM-DD HH:mm"-->
							<!--									/>-->
							<!--									~-->
							<!--									<a-date-picker-->
							<!--											:disabledDate="disabledDate"-->
							<!--											v-model='ticketEndDate'-->
							<!--											@change="changeTicketEndTime"-->
							<!--											:showTime="{-->
							<!--												        hideDisabledOptions: true,-->
							<!--												        defaultValue: moment('23:59', 'HH:mm'),-->
							<!--												        format:'HH:mm'-->
							<!--												   }"-->
							<!--											format="YYYY-MM-DD HH:mm"-->
							<!--									/>-->
							<!--									<span style="margin-left: 5px;color: #F56C6C">（一旦发布，只可更改截止时间。获得奖品，请在兑奖时间内领取，数量有限，逾期视为自动放弃。）</span>-->
							<!--								</div>-->
							<!--							</a-form-item>-->
						</div>
						<div v-show="current == 1" style="margin: 20px;">
							<div v-for="(item, index) in prizes"
							     style="margin: 10px 0;border-color: #F0F0F0;">
								<!--								<div style="background-color: #F5F7FA;height: 40px;line-height: 40px;padding: 0 10px;color: #333333">-->
								<!--									<label v-if="index == 0">一阶任务设置</label>-->
								<!--									<label v-if="index == 1">二阶任务设置</label>-->
								<!--									<label v-if="index == 2">三阶任务设置</label>-->
								<!--									<a-switch style="float: right; margin-top: 9px;"-->
								<!--									          v-if="index != 0"-->
								<!--									          :disabled="index == 0 || (index == 1 && prizes[2].is_open == 1) || (index == 2 && prizes[1].is_open == 0)"-->
								<!--									          v-model="item.is_open == 1" default-checked-->
								<!--									          @change="onChangeOpen(index)"/>-->
								<!--								</div>-->
								<div v-if="item.is_open == 1" style="background-color: #FFFFFF;padding: 10px 0;">
									<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
									             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
										<template slot="label"><span
												style="color: red">*</span>裂变人数
										</template>
										需要拉
										<a-input-number
												:disabled="!!id && (status != 1 || status == '')"
												class="brush-input"
												:min="0" :max="99999999"
												:formatter="limitDecimals"
												:parse="limitDecimals"
												@input.native="inputFissionNum"
												v-model="item.number"></a-input-number>
										好友可领礼物
										<span style="color: #01b065;height: 24px;line-height: 24px;">
										<span style="color: #F56C6C">（一旦发布，不可更改）</span>
									</span>
									</a-form-item>
									<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
									             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
										<template slot="label">
											<span style="color: red;">*</span>奖品类型
										</template>
										<a-radio-group name="radioGroup" v-model="item.type"
										               :disabled="!!id && (status != 1 || status == '')">
											<a-radio value="1">实物</a-radio>
											<a-radio value="2">红包
												<span v-if="item.type == 2" style="color: #F56C6C;">（（一旦发布，不可修改。发红包，用户立即到账到个人零钱，请商户务必保障微信支付商户平台账户余额充足））</span>
											</a-radio>
										</a-radio-group>
										<span v-if="item.type == 1" style="color: #F56C6C;">（一旦发布，不可修改。）</span>
									</a-form-item>
									<template v-if="item.type == 1">
										<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
										             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
											<template slot="label"><span
													style="color: red">*</span>奖品名称
											</template>
											<a-input v-model="item.prize_name" placeholder="请填写奖品名称，限20字符"
											         :maxLength="20"
											         style="width: 350px;"
											         :disabled="!!id && (status != 1 || status == '')"></a-input>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{item.prize_name === null ? 0 : item.prize_name.length}} / 20</span>
										</a-form-item>
										<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
										             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
											<template slot="label"><span
													style="color: red">*</span>奖品库存
											</template>
											<a-input-number
													class="brush-input"
													:min="0" :max="99999999"
													placeholder="不限"
													:formatter="limitDecimals"
													:parse="limitDecimals"
													@blur="blurNum(index)"
													:disabled="!!id && (status != 1 || status == '') && !prizes1[index].num"
													@input.native="e => inputNum(e, index)"
													v-model="item.num"></a-input-number>
											件
											<span style="color: #F56C6C;">（一旦发布后，只可增加不可减少。）</span>
										</a-form-item>

									</template>
									<template v-if="item.type == 2">
										<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
										             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
											<template slot="label">
												<span style="color: red">*</span>红包金额
											</template>
											<a-input-number :step="0" :precision="2"
											                style="width: 140px;margin-right: 5px;"
											                :min="0.30"
											                :max="5000.00"
											                v-model="item.money_amount"
											                :disabled="!!id && (status != 1 || status == '')"/>
											元
											<span style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入0.30~5000.00）</span>
										</a-form-item>
										<a-form-item class="current0" :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
										             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
											<template slot="label">
												<span style="color: red">*</span>红包数量
											</template>
											<a-input-number
													class="brush-input"
													:min="0" :max="99999999"
													placeholder="红包数量"
													:formatter="limitDecimals"
													:parse="limitDecimals"
													@blur="blurPrizeNum(index)"
													@input.native="e => inputPrizeNum(e, index)"
													v-model="item.money_count"></a-input-number>
											个
											<span style="color: #01b065;height: 24px;line-height: 24px;">
							</span>
										</a-form-item>
									</template>
									<a-form-item class="current0"
									             :label-col="{xl:{ span: 6 }, xxl:{span: 4}}"
									             :wrapper-col="{xl:{ span: 18 }, xxl:{span: 20}}">
										<template slot="label">
											<span style="color: red">*</span>领奖方式
										</template>
										<a-radio-group v-if="prizes[0].type == 1" style="margin-top: 4px;"
										               name="actionType" :value="actionType"
										               @change="changeActionType"
										               :disabled="!!id && (status != 1 || status == '')">
											<a-radio value="2">
												<span style="height: 28px; margin-top: 5px; display: inline-block;">联系客服</span>
												<a-tooltip placement="bottom">
													<template slot="title">
														<span>主要适用于需要到店自提的奖品、或是以线下发放为主的虚拟奖品。如“XXX运营干货PPT”</span>
													</template>
													<a-icon type="question-circle" style="margin-left:5px;"/>
												</a-tooltip>
												<template v-if='actionType == 2'>
													<a-button style="margin-left: 10px;"
													          @click="showDepartmentList(1)">
														<span v-if="userKeyNum > 0">已选择{{userKeyUserNum}}名成员，{{userKeyDepartmentNum}}个部门</span>
														<span v-else>选择员工</span>
													</a-button>
													<a-tooltip placement="top" v-if="user_keys.length > 0">
														<template slot="title">
															<template v-for="(user,index) in user_keys">
																<span>{{user.title}} </span>
															</template>
														</template>
														<span style="display: inline-block; max-width: 300px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;vertical-align: middle;margin-left: 10px;color:rgba(0, 0, 0, 0.65);">
															<template v-for="(user,index) in user_keys">
																<span>{{user.title}} </span>
															</template>
														</span>
													</a-tooltip>
												</template>
											</a-radio>
											<br/>
											<a-radio value="1" style="margin-top: 8px;">
												<span>兑换链接</span>
												<a-tooltip placement="bottom">
													<template slot="title">
														<span>主要适用于需要快递物流的奖品</span>
													</template>
													<a-icon type="question-circle" style="margin-left:5px;"/>
												</a-tooltip>
											</a-radio>
										</a-radio-group>
										<template v-if="prizes[0].type == 2">
											<div>
												为了避免微信支付商户平台里的账户余额不足，无法发给参与者而导致的纠纷问题，故在任务完成后，加入客服二维码进行线下联系。若已到账，参与者至于是否加客服，其自定。
											</div>
											<div>
												<a-button @click="showDepartmentList(1)">
													<span v-if="userKeyNum > 0">已选择{{userKeyUserNum}}名成员，{{userKeyDepartmentNum}}个部门</span>
													<span v-else>选择员工</span>
												</a-button>
												<a-tooltip placement="top" v-if="user_keys.length > 0">
													<template slot="title">
														<template v-for="(user,index) in user_keys">
															<span>{{user.title}} </span>
														</template>
													</template>
													<span style="display: inline-block; max-width: 300px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;vertical-align: middle;margin-left: 10px;color:rgba(0, 0, 0, 0.65)">
															<template v-for="(user,index) in user_keys">
																<span>{{user.title}} </span>
															</template>
														</span>
												</a-tooltip>
											</div>
										</template>
										<!--								<div v-if='actionType == 2'>-->
										<!--									<a-button style="margin-left: 10px;" @click="showDepartmentList(1)">-->
										<!--										<span v-if="userKeyNum > 0">已选择{{userKeyNum}}名员工</span>-->
										<!--										<span v-else>选择员工</span>-->
										<!--									</a-button>-->
										<!--								</div>-->
										<!--								<div v-if="actionType == 1">-->
										<!--									<a-checkbox-group :disabled="true" v-model="info">-->
										<!--										<a-checkbox :value="1">-->
										<!--											姓名-->
										<!--										</a-checkbox>-->
										<!--										<a-checkbox :value="2">-->
										<!--											手机号-->
										<!--										</a-checkbox>-->
										<!--										<a-checkbox :value="3">-->
										<!--											地址（输入框）-->
										<!--										</a-checkbox>-->
										<!--										<a-checkbox :value="4">-->
										<!--											备注-->
										<!--										</a-checkbox>-->
										<!--									</a-checkbox-group>-->
										<!--								</div>-->
									</a-form-item>
								</div>
							</div>
							<!--							<a-form-item class="current0" :label-col="{xl:{ span: 4 }, xxl:{span: 2}}"-->
							<!--							             :wrapper-col="{xl:{ span: 20 }, xxl:{span: 22}}">-->
							<!--								<template slot="label">-->
							<!--									自动结束任务-->
							<!--								</template>-->
							<!--								&lt;!&ndash;								300&ndash;&gt;-->
							<!--								<a-checkbox-group v-model="level" style="display: inline-block;width: 80px;">-->
							<!--									<a-checkbox :value="1">-->
							<!--										库存-->
							<!--									</a-checkbox>-->
							<!--									&lt;!&ndash;									<a-checkbox :value="2">&ndash;&gt;-->
							<!--									&lt;!&ndash;										二阶库存&ndash;&gt;-->
							<!--									&lt;!&ndash;									</a-checkbox>&ndash;&gt;-->
							<!--									&lt;!&ndash;									<a-checkbox :value="3">&ndash;&gt;-->
							<!--									&lt;!&ndash;										三阶库存&ndash;&gt;-->
							<!--									&lt;!&ndash;									</a-checkbox>&ndash;&gt;-->
							<!--								</a-checkbox-group>-->
							<!--								<span style="color: #F56C6C;" v-if="level.length == 1">当-->
							<!--									<span v-if="level[0] == 1">库存</span>-->
							<!--									&lt;!&ndash;								<span v-if="level[0] == 2">二阶库存</span>&ndash;&gt;-->
							<!--									&lt;!&ndash;								<span v-if="level[0] == 3">三阶库存</span>&ndash;&gt;-->
							<!--									为0时自动结束-->
							<!--								</span>-->
							<!--								&lt;!&ndash;								<span style="color: #F56C6C;" v-if="level.length > 1">当&ndash;&gt;-->
							<!--								&lt;!&ndash;									<span v-if="level.indexOf(1) > -1">一阶库存</span>&ndash;&gt;-->
							<!--								&lt;!&ndash;									<span v-if="level.indexOf(2) > -1"> 二阶库存</span>&ndash;&gt;-->
							<!--								&lt;!&ndash;									<span v-if="level.indexOf(3) > -1"> 三阶库存</span>&ndash;&gt;-->
							<!--								&lt;!&ndash;							同时为0时自动结束</span>&ndash;&gt;-->
							<!--							</a-form-item>-->
						</div>
						<div v-show="current == 2" style="margin: 20px;">
							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
								<template slot="label">
									<span style="color: red;">*</span>性别参与
								</template>
								<a-radio-group name="radioGroup" :value="sexType" @change="changeSexType"
								               :disabled="!!id && (status != 1 || status == '')">
									<a-radio value="4">不限制</a-radio>
									<a-radio value="1">仅男性参与</a-radio>
									<a-radio value="2">仅女性参与</a-radio>
									<a-radio value="3">未知</a-radio>
								</a-radio-group>
								<div style="color: #F56C6C;">（一旦发布，不可修改。以在本系统的性别数据为准）</div>
							</a-form-item>
							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
								<span slot="label">
									<span style="color: red;">*</span>地区参与
									<a-tooltip title="根据用户基本信息接口判断客户所在地区。由于客户可手动修改地理位置，因此不能完全保证客户位置的准确性">
										<a-icon type="question-circle"/>
									</a-tooltip>
								</span>
								<a-radio-group name="radioGroup" :value="areaType" @change="changeAreaType"
								               :disabled="!!id && (status != 1 || status == '')">
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
							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
								<template slot="label">
									客户标签
									<a-tooltip placement="right" style="vertical-align: inherit;">
										<template slot="title">
											<span>不论邀请人，还是助力者，只要参与该场活动，则自动打上选中的客户标签</span>
										</template>
										<a-icon type="question-circle" style="margin-left:5px;"/>
									</a-tooltip>
								</template>
								<div class="current0 ant-col-20">
									<corpChooseTag :callback="modalVisibleChange4" :hasChoose="tag_arr"
									               v-if="isShowTag"></corpChooseTag>
								</div>
							</a-form-item>
							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
								<template slot="label">
									<label style="width: 130px; text-align: right; display: inline-block;">
										好友助力次数
										<a-tooltip placement="right" style="vertical-align: inherit;">
											<template slot="title">
												<span>在本场活动中，好友给某人助力后，再给其他人助力。如设置2次，本人给用户A助力后，又可以给用户B再助力。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</label>
								</template>
								<a-input-number
										:disabled="!!id && (status != 1 || status == '')"
										class="brush-input"
										:min="1"
										:formatter="limitDecimals"
										:parse="limitDecimals"
										@input.native="helpNum"
										v-model="help_num"></a-input-number>
								次
								<span style="color: #F56C6C;">（不填写，则默认为不限制。一旦发布，不可修改。）</span>
							</a-form-item>
							<!--							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">-->
							<!--								<template slot="label">-->
							<!--									<label style="width: 130px; text-align: right; display: inline-block;">-->
							<!--										互助-->
							<!--									</label>-->
							<!--								</template>-->
							<!--								<a-switch :checked="mutual == 1" @click="changeMutual"/>-->
							<!--								<span style="color: #F56C6C;">（不填写，则默认为不限制。一旦发布，不可修改。）</span>-->
							<!--							</a-form-item>-->
							<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
								<template slot="label">
									<label style="width: 130px; text-align: right; display: inline-block;">
										有效助力人数
									</label>
								</template>
								<a-radio-group name="radioGroup" @change="changeEffective" v-model="effectiveHelp"
								               :disabled="!!id && (status != 1 || status == '')">
									<a-radio value="4">
										被客户删除/拉黑扣除助力人数
									</a-radio>
									<a-radio value="1">
										不处理
									</a-radio>
								</a-radio-group>
							</a-form-item>
						</div>
						<div v-show="current == 3" style="margin: 20px;">
							<div style="width: calc(100% - 400px); float: right;padding-left: 20px;">
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
											图片像素建议为750*1334像素，格式为jpg、bmp、png，大小不超过2M
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
									<div style="margin-top: 10px;">
										<div style="display: inline-block;" v-if="is_nickname">
											<div>颜色
												<template>
													<a-popover
															trigger="click"
															placement="right"
													>
														<color-picker slot="content"
														              v-model="color"></color-picker>
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
										<!--									<div style="display: inline-block;vertical-align: top; margin-left: 40px"-->
										<!--									     v-if="is_nickname">-->
										<!--										<a-button @click="changeAlign('left')"-->
										<!--										          :class="align== 'left' ? 'shape-active' : '' "-->
										<!--										          style="margin-left: 10px;display: inline-block;"-->
										<!--										>-->
										<!--											左对齐-->
										<!--										</a-button>-->
										<!--										<a-button @click="changeAlign('center')"-->
										<!--										          :class="align== 'center' ? 'shape-active' : '' "-->
										<!--										          style="margin-left: 10px;display: inline-block;"-->
										<!--										>-->
										<!--											居中-->
										<!--										</a-button>-->
										<!--										<a-button @click="changeAlign('right')"-->
										<!--										          :class="align== 'right' ? 'shape-active' : '' "-->
										<!--										          style="margin-left: 10px;display: inline-block;"-->
										<!--										>-->
										<!--											右对齐-->
										<!--										</a-button>-->
										<!--									</div>-->
									</div>
								</a-form-item>
							</div>
							<div style="width: 400px; padding: 0px 20px; float: left;margin-bottom: 20px;">
								<!-- 更改海报时改变menuKey重新渲染 -->
								<div style="width: 391px;border: 8px solid rgb(241, 241, 241);" :key="menuKey"
								     :style="{height: (backHeight + 18) + 'px'}">
									<div class="page-content" :style="{ 'height': backHeight + 'px' }">
										<img v-show="back_pic_url" style="width: 100%;position: absolute;"
										     draggable="false"
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
											     src="../../../../assets/fission/add/qrcode.png">
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
									海报二维码自带对应参数，扫码后会将客户引流至对应的企业成员
								</a-form-item>
								<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
									<template slot="label"><span
											style="color: red">*</span>引流成员
									</template>
									<a-button style="margin-left: 10px;" @click="showDepartmentList">
										选择
									</a-button>
									<span style="margin-left: 5px"
									      v-show="chooseNum1 > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
									<a style="margin-left: 10px;" v-show="chooseNum1 > 0"
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
										新用户参与
									</template>
									<editor v-if="editorFlag" :text="text_content"
									        :textValue="textAreaValueHeader"
									        :isEmoji="false"
									        :isRanking="true"
									        @changeText="changeText">
									</editor>
								</a-form-item>
								<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
									<template slot="label">
										助力成功
									</template>
									<editor v-if="editorFlag" :text="text_content1"
									        :textValue="textAreaValueHeader1"
									        :isEmoji="false"
									        :isRanking="true"
									        @changeText="changeText1">
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
										<img v-if="link_pic_url" :src="commonUrl + link_pic_url"
										     alt="avatar"
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
								<!--						             v-show="link_pic_url">-->
								<!--							<template slot="label"><span-->
								<!--									style="color: red">*</span>图文封面-->
								<!--							</template>-->
								<!--							<div class="upload-wrap">-->
								<!--								<img :src="commonUrl+link_pic_url" alt=""-->
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
									<a-input v-model="link_start_title" style="width: 500px;"
									         :maxLength="32">
										<span slot="suffix"><span>{{link_start_title.length}}</span>/32</span>
									</a-input>
								</a-form-item>
								<!-- 添加描述 -->
								<a-form-item class="current0" style="margin-top: 10px;" label="添加描述"
								             :label-col="{ span: 3 }"
								             :wrapper-col="{ span: 21 }">
									<div>
										<a-textarea style="width: 500px;" placeholder="填写图文描述" v-model="link_desc"
										            :maxLength="128" :rows="4"/>
									</div>
									<div style="width: 500px; text-align: right">
										<span>{{link_desc.length}}</span>/128
									</div>
									<!--							<a-textarea placeholder="填写图文描述" :rows="4"-->
									<!--							            style="resize: none;width: 100%;"-->
									<!--							            v-model="link_desc"-->
									<!--							            :maxLength="128"/>-->
									<!--							<div style="float:right;">-->
									<!--								<span>{{link_desc.length}}</span>/128-->
									<!--							</div>-->
								</a-form-item>
							</div>
							<div style="width: 300px;float: right;height: 600px;">
								<div class="wrap left-sider-content">
									<img src="../../../../assets/wxHeader.png" alt
									     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
									<div class="msg_content_body">
										<!--文本-->
										<div v-if="textAreaValueHeader" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;float: left;"/>
											<span v-html="textAreaValueHeader"
											      class="item-info msg_content_txt"></span>
										</div>
										<!--网址-->
										<div v-if="link_start_title || link_desc || link_pic_url"
										     class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;float: left;"/>
											<div class="item-info msg_content_txt">
												<p class="url-title">{{link_start_title}}</p>
												<div style="overflow: hidden;">
													<div class="url-text">{{link_desc}}</div>
													<img :src="commonUrl+link_pic_url" alt=""
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
					<div style="position: fixed; left: 50%; transform: translate(-50%, 0);">
						<a-button v-if="current>0" @click="prev">
							上一步
						</a-button>
						<a-button v-if="current < steps.length - 1" style="margin-left: 8px" type="primary"
						          @click="next">
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
			</div>

			<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum"
			                  :callback="modalVisibleChange3" :is_from="7"></chooseDepartment>
			<!-- 选择素材弹窗 -->
			<chooseMsg :show="showModal3" :type="2" :news_type="1"
			           :callback="modalVisibleChange2" :sketchType="'1'" :comefrom="'1'"
			           :chooseId="chooseId"></chooseMsg>
			<!-- 企业微信选择弹窗 -->
			<WeChatModal :show="showModal2" :wxId="wx_id" :corpId1="corp_id" :type="tabKey == 3 ? '2' : '1'"
			             :callback="modalVisibleChange"
			             :hasName="tabKey == 1 ? 'wxWholeMarketFission-add' : (tabKey == 2 ? 'wholeMarketFission-add': 'wholeMarketFission-add,wxWholeMarketFission-add')"></WeChatModal>

			<wxModal :show="showModal4" :corpId1="corp_id" :wxId="wx_id" :type="tabKey== 3 ? '2' : '0'"
			         :callback="modalVisibleChange5"
			         :hasName="tabKey == 1 ? 'wxWholeMarketFission-add' : (tabKey == 2 ? 'wholeMarketFission-add': 'wholeMarketFission-add,wxWholeMarketFission-add')"></wxModal>
			<a-modal title="新建标签" v-model="visible" @ok="handleOk(inputValue)"
			         :confirmLoading="confirmLoading3" @cancel="cancel">
				<p style="margin: 0px 0px 10px 0;font-size: 13px; color: #909399;">
					每个标签名称最多6个字。同时新建多个标签时，请用“空格”隔开</p>
				<a-input placeholder="请输入标签（不得超过6个字符）" v-model="inputValue"/>

			</a-modal>
		</a-spin>
	</div>
</template>

<script>
	import moment from 'moment';
	import {Sketch} from "vue-color";
	import editor from '../../../../components/editor/index'
	import VueDraggableResizable from 'vue-draggable-resizable'
	import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import chooseMsg from "@/components/ChooseMsg"
	import WeChatModal from "@/components/WeChatModal.vue"
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import cityData from "../../../../common/js/TencentAddress.js"
	import UEditor from '@/components/uEditor/Index'
	import wxModal from "@/components/WxModal.vue"
	import editor1 from '../../../../components/fissionNotice/Editor'
	import TemplateMsgModel from '../../../../components/fissionNotice/TemplateMsgModel'

	function getBase64 (img, callback) {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	export default {
		name      : "add",
		components: {
			wxModal,
			WeChatModal,
			chooseMsg,
			chooseDepartment,
			"color-picker"           : Sketch,
			"vue-draggable-resizable": VueDraggableResizable,
			editor, corpChooseTag,
			UEditor,
			editor1,
			TemplateMsgModel
		},
		data () {
			return {
				wxMsgFlag            : false,
				msgFlag              : false,
				isLoading            : true,
				pageKey              : 0,     // 为切换tab强制刷新页面用
				avatarImg            : '',    // 公众号icon
				wxId                 : '',    // 公众号id
				wxNickName           : '',
				type                 : localStorage.getItem('type'), // 菜单类型 0 公众号 1 企业微信
				wxInfo               : {},    // 公众号数据
				wxList               : JSON.parse(localStorage.getItem('wxArr')),
				corpList             : JSON.parse(localStorage.getItem('corpArr')),
				tabKey               : localStorage.getItem('type'), // 页签
				status               : '',    // 活动状态
				current              : 0,     // 步骤index
				commonUrl            : '',    // 公共链接前缀
				showModal2           : false, // 企业微信弹窗
				showModal4           : false, // 公众号弹窗
				corpName             : localStorage.getItem("corpName"),
				steps                : [  // 步骤名
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
				suite_id             : 1,     //应用ID
				startDate            : null,  // 活动开始时间
				endDate              : null,  // 活动结束时间
				ticketStartDate      : null,  // 兑奖开始时间
				ticketEndDate        : null,  // 兑奖结束时间
				agentList            : [],    // 应用
				backHeight           : 667,   // 海报图片区域高度
				menuKey              : 1,     // 改变海报图片时强制渲染页面
				editorFlag           : false, // 编辑器是否展示
				tagList              : [],    // 公众号标签
				visible              : false, // 新建粉丝标签弹窗是否显示
				confirmLoading3      : false, // 新建粉丝标签弹窗确认按钮动画
				inputValue           : '',    // 标签名称
				tagChecked           : [],    // 粉丝标签选中标记
				id                   : '',    // 活动id
				uid                  : localStorage.getItem("uid"),
				corp_id              : localStorage.getItem("corpId"),
				wx_id                : localStorage.getItem('wxNum'),
				agent_id             : [],    // 应用id
				title                : '',    // 活动标题
				start_time           : '',    // 活动开始时间
				end_time             : '',    // 活动结束时间
				ticket_start_time    : '',    // 活动兑奖开始时间
				ticket_end_time      : '',    // 活动兑奖结束时间
				// rule               : '',
				is_end               : false, // 库存为零结束
				is_friend            : 0,     // 0新好友 1全部好友
				is_invalid           : false, // 是否失效
				is_brush             : false, //是否防刷
				brush_time           : 10,    // 秒数
				level                : [1],    // 库存等级
				prizes               : [
					{
						level       : 1,        // 阶段任务等级
						is_open     : 1,        // 阶段是否打开
						number      : 10,       // 裂变人数
						prize_name  : '',       // 奖品名称
						num         : 99999999, // 奖品库存
						type        : '1',        //1实物，2红包
						money_amount: 0.3,       // 红包金额
						money_count : 10         // 红包个数
					},
					// {
					// 	level       : 2,        // 阶段任务等级
					// 	is_open     : 1,        // 阶段是否打开
					// 	number      : 10,       // 裂变人数
					// 	prize_name  : '',       // 奖品名称
					// 	num         : 99999999, // 奖品库存
					// 	type        : '1',        //1实物，2红包
					// 	money_amount: 0.3,       // 红包金额
					// 	money_count : 10         // 红包个数
					// },
					// {
					// 	level       : 3,        // 阶段任务等级
					// 	is_open     : 1,        // 阶段是否打开
					// 	number      : 10,       // 裂变人数
					// 	prize_name  : '',       // 奖品名称
					// 	num         : 99999999, // 奖品库存
					// 	type        : '1',        //1实物，2红包
					// 	money_amount: 0.3,       // 红包金额
					// 	money_count : 10         // 红包个数
					// }
				], // 奖品数据
				prizes1              : [
					{
						level       : 1,        // 阶段任务等级
						is_open     : 1,        // 阶段是否打开
						number      : 10,       // 裂变人数
						prize_name  : '',       // 奖品名称
						num         : '', // 奖品库存
						type        : '1',        //1实物，2红包
						money_amount: 0.3,       // 红包金额
						money_count : 10         // 红包个数
					}
				],
				actionType           : 1,     // 联系方式 1、兑奖链接 2、联系客服
				channelType          : 0,     // 选择成员标记 1、客服 非1、引流成员
				user_keys            : [],    // 客服id
				user_keys_id         : [],
				userKeyNum           : 0,     // 客服总人数
				userKeyUserNum       : 0,//客服成员人数
				userKeyDepartmentNum : 0,//客服部门数
				info                 : [1, 2, 3, 4],    // 填写资料
				help_num             : '',    // 好友助力次数
				mutual               : 0,     // 是否允许互帮
				effectiveHelp        : '1',     // 有效助力人数
				back_pic_url         : '/static/image/default_activity.png', // 海报图片
				is_avatar            : true,  // 头像选择按钮
				avatar               : {
					w: 52,
					x: 30,
					y: 545
				}, // 头像大小位置
				nickName             : {
					w: 84,
					h: 28,
					x: 36,
					y: 602
				}, // 昵称大小位置
				qrCode               : {
					w: 101,
					x: 251,
					y: 534
				}, // 二维码大小位置
				shape                : "circle", // circle圆形 square方形
				is_nickname          : true,  // 昵称选择按钮
				color                : '#FFFFFF', // 颜色
				font_size            : 14,    // 大小
				align                : 'left',// 对齐方式
				keyword              : '',    // 关键词
				ruleTextContent      : '{nickname}您好！欢迎关注xxx！\n本次活动是xxx。\n如何免费领取奖品？\n将下方个人专属海报分享至朋友圈或微信好友，\n成功邀请3名好友扫码助力，\n即可完成任务获得xxx奖品。',    // 规则话术 纯文本
				ruleTextValue        : '<p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>您好！欢迎关注xxx！</p><p>本次活动是xxx。</p><p>如何免费领取奖品？</p><p>将下方个人专属海报分享至朋友圈或微信好友，</p><p>成功邀请3名好友扫码助力，</p><p>即可完成任务获得xxx奖品。</p>',    // 规则话术 带标签
				isOpenPosters        : 2,     // 是否开启海报话术
				postersTextContent   : '我参加了一个超棒的活动\n求扫码支持，谢谢大家了!',    // 海报话术 纯文本
				postersTextValue     : '<p>我参加了一个超棒的活动</p><p>求扫码支持，谢谢大家了!</p>',    // 海报话术 带标签
				user                 : [],    // 引流成员
				user_idArr           : [],
				text_content         : '{nickname}您好！欢迎关注xxx！\n本次活动是xxx。\n如何免费领取奖品？\n将下方个人专属海报分享至朋友圈或微信好友，\n成功邀请3名好友扫码助力，\n即可完成任务获得xxx奖品。',    // 文本 纯文本
				textAreaValueHeader  : '<p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>您好！欢迎关注xxx！</p><p>本次活动是xxx。</p><p>如何免费领取奖品？</p><p>将下方个人专属海报分享至朋友圈或微信好友，</p><p>成功邀请3名好友扫码助力，</p><p>即可完成任务获得xxx奖品。</p>',    // 文本 带标签
				text_content1        : '恭喜您，帮好友助力成功。\n {nickname} 您也可以将下方个人专属海报分享至朋友圈或微信好友，\n成功邀请3名好友扫码助力，\n即可完成任务获得xxx奖品。',    // 文本 纯文本
				textAreaValueHeader1 : '<p>恭喜您，帮好友助力成功。</p><p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>您也可以将下方个人专属海报分享至朋友圈或微信好友，</p><p>成功邀请3名好友扫码助力，</p><p>即可完成任务获得xxx奖品。</p>',    // 文本 带标签
				link_attach_id       : '',    // 图文封面metarial_id
				link_pic_url         : '/upload/fission/share.png', // 图文封面
				link_start_title     : '呼朋唤友，免费拿奖品', // 图文标题
				link_desc            : '好友，你可以给我打个Call吗？', // 描述
				flag                 : false, // 库存修改标志
				prize_num            : 0,     // 编辑时原库存，库存只能增加
				chooseNum            : 0,     // 成员插件成员个数
				chooseNum1           : 0,     // 引流成员总个数
				chooseUserNum        : 0,//引流成员个数
				chooseDepartmentNum  : 0,//引流成员部门个数
				showModalDepartment  : false, // 选择成员弹窗
				is_external          : 0,//1具有外部联系人权限，0默认
				noticeTitle          : '',//选择成员组件的提示语
				agentid              : '',//根据自建应用范围选择员工
				// pageHeight : '450',
				loading              : false, // 上传loading
				showModal3           : false, // 图文封面弹窗
				chooseId             : 0,     // 图文封面id
				createLoading        : false, // 活动创建按钮loading
				//高级设置
				sexType              : '4',     //性别参与
				areaType             : 1,//地区参与
				// 地域
				cityData,
				province             : [
					[]
				],
				tag_arr              : [],    // 企业微信客户标签值
				isShowTag            : false, // 是否展示标签
				isTemplate           : '0',     // 提醒公众号是否使用模板消息
				reply                : [],     // 提醒消息内容
				wholeMarketFissionNum: 0,//裂变引流人数上限数
			}
		},
		methods   : {
			// 切换tab
			changeTabs (key) {
				if (this.id != '' || this.tabKey == key) {
					return false
				}
				Object.assign(this.$data, this.$options.data())
				this.wxInfo = JSON.parse(localStorage.getItem('wxArr')).find(x => x.wx_id == localStorage.getItem("wxNum"))
				this.wx_id = this.wxInfo.wx_id
				this.wxNickName = localStorage.getItem("wxNickName")
				if (!this.avatarImg) {
					this.commonUrl = this.$store.state.commonUrl
					this.avatarImg = this.wxList[this.$store.state.wxNumIndex].head_img;
				}
				if (key == 3) {
					if (this.type == 0 && this.corpList.length == 0) {
						this.$message.destroy()
						this.$message.warning('您暂未绑定企业微信')
						return false
					}
					if (this.type == 1 && this.wxList.length == 0) {
						this.$message.destroy()
						this.$message.warning('您暂未绑定公众号')
						return false
					}
					this.getPermissionButton()
				}
				this.tabKey = key
				if (this.tabKey == 1) {
					this.actionType = '1'
					this.getTags()
				} else if (this.tabKey == 2) {
					this.actionType = '2'
					this.getAgentList()
				} else if (this.tabKey == 3) {
					this.actionType = '1'
					this.getTags()
					this.getAgentList()
				}
				this.setTextContent()
				this.setSteps()
				this.current = 0
				this.editorFlag = true
				this.initReply()
				let pageKey = Math.ceil(Math.random() * 1000)
				if (pageKey == this.pageKey) {
					this.pageKey = pageKey + 1
				} else {
					this.pageKey = pageKey
				}
				this.wholeMarketFissionNum = Number(this.$store.state.packageDetail.wholeMarketFissionNum)
			},
			async getPermissionButton () {
				const {data: res} = await this.axios.post(
					"sub-user/get-sub-user-authority",
					{
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem("sub_id"),
						account_id     : this.wx_id,
						type           : 2,
						source         : '',//区分内容引擎和其他页面
						corp_id        : this.corp_id,
						wx_id          : this.wx_id,
					}
				);
				if (res.error == 0) {
					if (res.data.length > 0) {
						if (res.data.indexOf('wxWholeMarketFission-add') == -1) {
							this.wxMsgFlag = true
						}
						if (res.data.indexOf('wholeMarketFission-add') == -1) {
							this.msgFlag = true
						}

					}
				}
			},
			setTextContent () {
				if (this.tabKey == 2) {
					this.text_content = '{nickname}您好！本次活动是xxx。\n如何免费领取奖品？\n将下方个人专属海报分享至朋友圈或微信好友，\n成功邀请3名好友添加员工企业微信，\n即可完成任务获得xxx奖品。'
					this.textAreaValueHeader = '<p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>您好！本次活动是xxx。</p><p>如何免费领取奖品？</p><p>将下方个人专属海报分享至朋友圈或微信好友，</p><p>成功邀请3名好友添加员工企业微信，</p><p>即可完成任务获得xxx奖品。</p>'
					this.text_content1 = '恭喜您，帮好友助力成功。\n {nickname} 您也可以将下方个人专属海报分享至朋友圈或微信好友，\n成功邀请3名好友添加员工企业微信，\n即可完成任务获得xxx奖品。'
					this.textAreaValueHeader1 = '<p>恭喜您，帮好友助力成功。</p><p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>您也可以将下方个人专属海报分享至朋友圈或微信好友，</p><p>成功邀请3名好友添加员工企业微信，</p><p>即可完成任务获得xxx奖品。</p>'
				} else if (this.tabKey == 3) {
					this.text_content = '{nickname}您好！欢迎关注xxx！\n本次活动是xxx。\n如何免费领取奖品？\n将下方个人专属海报分享至朋友圈或微信好友，\n成功邀请3名好友扫码关注，且成功添加员工企业微信，\n即可完成任务获得xxx奖品。'
					this.textAreaValueHeader = '<p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>您好！欢迎关注xxx！</p><p>本次活动是xxx。</p><p>如何免费领取奖品？</p><p>将下方个人专属海报分享至朋友圈或微信好友，</p><p>成功邀请3名好友扫码关注，且成功添加员工企业微信，</p><p>即可完成任务获得xxx奖品。</p>'
					this.text_content1 = '恭喜您，帮好友助力成功。\n {nickname} 您也可以将下方个人专属海报分享至朋友圈或微信好友，\n成功邀请3名好友扫码关注，且成功添加员工企业微信，\n即可完成任务获得xxx奖品。'
					this.textAreaValueHeader1 = '<p>恭喜您，帮好友助力成功。</p><p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>您也可以将下方个人专属海报分享至朋友圈或微信好友，</p><p>成功邀请3名好友扫码关注，且成功添加员工企业微信，</p><p>即可完成任务获得xxx奖品。</p>'
				}
			},
			// 返回列表
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				if (localStorage.getItem('type') == 1) {
					this.$router.push("/wholeMarket/fissionList?isRefresh=1")
				} else {
					this.$router.push("/wholeMarket/fissionList1?isRefresh=1")
				}
			},
			// 切换步骤
			changeCurrent (index) {
				this.current = index
			},
			// 改变企业微信
			changeCorp () {
				if (this.id) {
					return false
				}
				this.showModal2 = true
			},
			// 改变公众号
			changeWx () {
				if (this.id) {
					return false
				}
				this.showModal4 = true
			},
			// 切换公众号回调
			modalVisibleChange5 (event, wxNum, wxNickName) {
				if (event == "ok") {
					this.$store.dispatch("changeWxNum", wxNum)
					this.$store.commit("changeWxNickName", wxNickName);
					this.avatarImg = this.wxList[this.$store.state.wxNumIndex].head_img
					this.getTags()
					this.showModal4 = false
				} else {
					this.showModal4 = false
				}
			},
			// 改变企业微信回调
			modalVisibleChange (type, corpId, corpName) {
				if (type == 'ok') {
					if (this.corp_id != corpId) {
						this.corp_id = corpId
						this.getAgentList()
						this.corpName = corpName
						this.chooseNum1 = 0
						this.chooseUserNum = 0
						this.chooseDepartmentNum = 0
						this.user = []
						this.user_idArr = []
						this.userKeyNum = 0
						this.userKeyUserNum = 0
						this.userKeyDepartmentNum = 0
						this.user_keys = []
						this.user_keys_id = []
					}
				}
				this.showModal2 = false
			},
			// 获取公众号粉丝标签
			async getTags (tags) {
				const {data: res} = await this.axios.post("work-activity-public/tag-list", {
					public_id: this.wx_id,
					type     : 1
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.tagList = res.data
					this.tagChecked = new Array(this.tagList.length).fill(false)
					if (tags) {
						for (let tag of tags) {
							for (let i = 0; i < this.tagList.length; i++) {
								if (tag == this.tagList[i].id) {
									this.tagChecked[i] = true
								}
							}
						}
					}
					this.isLoading = false
				}
			},
			// 公众号标签点击
			changeTags (index) {
				if (this.tagChecked[index]) {
					let i = 0
					for (let t of this.tagChecked) {
						if (t) {
							i++
						}
					}
					if (i > 20) {
						this.tagChecked[index] = !this.tagChecked[index]
						this.$message.destroy()
						this.$message.warning('粉丝标签最多选择20个')
					}
				}
			},
			// 添加粉丝标签
			addFansTag () {
				this.visible = true;
			},
			// 添加粉丝标签弹窗提交
			handleOk (val) {
				let that = this
				that.confirmLoading3 = true
				if (that.tagList.length >= 100) {
					this.$message.destroy()
					that.$message.warning("每个公众号最多添加100个标签！");
					that.confirmLoading3 = false;
					return false;
				}
				if (val == "") {
					this.$message.destroy()
					that.$message.warning("不能为空");
					that.confirmLoading3 = false;
					return false;
				} else {
					let newTagList = []
					for (var i = 0; i < val.split(" ").length; i++) {
						if (val.split(" ")[i].length > 6) {
							this.$message.destroy()
							that.$message.error("每个标签最多6个字");
							that.confirmLoading3 = false
							that.inputValue = "";
							return false;
						} else if (
							val.split(" ")[i].length > 0
						) {
							newTagList.push(val.split(" ")[i]);
							that.confirmLoading3 = false;
						}
					}
					that.addTags(newTagList);
					that.inputValue = ""
				}
			},
			// 添加粉丝标签弹窗接口提交
			async addTags (newTagList) {
				const {data: res} = await this.axios.post("tags/tags-create", {
					wx_id   : this.wx_id,
					tag_name: newTagList
				});
				if (res.error != 0) {
					if (res.error_msg == '标签名非法，请注意不能和其他标签重名') {
						this.confirmLoading3 = false;
						this.$message.destroy()
						this.$message.error('该标签名称与微信标签重复，请手动同步微信标签即可。');
					} else {
						this.confirmLoading3 = false;
						this.$message.destroy()
						this.$message.error(res.error_msg);
					}
				} else {
					this.visible = false
					this.confirmLoading3 = false;
					this.getTags();
					this.inputValue = ""
				}
			},
			// 添加粉丝标签弹窗取消
			cancel () {
				this.inputValue = ''
				this.visible = false
			},
			// 获取企业微信应用
			async getAgentList (id) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.corp_id,
					suite_id  : this.suite_id,
					agent_type: 2
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.agentList = res.data
					if (id) {
						this.agent_id = id
					} else if (this.agentList.length != 0 && !id) {
						this.agent_id = this.agentList[0].id
					}
					this.isShowTag = true
					this.isLoading = false
				}
			},
			// 切换领取方式
			changeActionType () {
				this.actionType = this.actionType == 1 ? '2' : '1'
				if (this.actionType == '2') {
					this.reply[3].is_open = 1
				}
			},
			moment,
			// 是否互助切换
			changeMutual () {
				this.mutual = this.mutual == 1 ? 2 : 1
			},
			// 防刷检测改变
			changeStatus (value) {
				this.is_brush = value
				if (value) {
					this.brush_time = this.brush_time || 10
					this.brush_num = this.brush_num || 100
				}
			},
			// 奖励打开关闭切换
			onChangeOpen (index) {
				this.prizes[index].is_open = (this.prizes[index].is_open + 1) % 2
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
					if (!re.test(e.data) || this.brush_time > 3600) {
						this.brush_time = parseInt(this.brush_time.toString().substring(0, this.brush_time.toString().length - 1)) || ''
					}
				}

			},
			// 裂变人数限制
			inputFissionNum (e) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data) || this.fission_num > 99999999) {
						this.fission_num = parseInt(this.fission_num.toString().substring(0, this.fission_num.toString().length - 1)) || ''
					}
				}
			},
			// 助力次数限制
			helpNum (e) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data)) {
						this.help_num = parseInt(this.help_num.toString().substring(0, this.help_num.toString().length - 1)) || ''
					}
				}
			},
			// 红包库存限制
			inputPrizeNum (e, index) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data) || this.prizes[index].money_count > 99999999) {
						this.prizes[index].money_count = parseInt(this.prizes[index].money_count.toString().substring(0, this.prizes[index].money_count.toString().length - 1)) || ''
						this.prizes = JSON.parse(JSON.stringify(this.prizes))
					}
				}
			},
			// 奖品库存限制
			inputNum (e, index) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data) || this.prizes[index].num > 99999999) {
						this.prizes[index].num = parseInt(this.prizes[index].num.toString().substring(0, this.prizes[index].num.toString().length - 1)) || ''
						this.prizes.splice(index, 1, this.prizes[index])
					}
				}
			},
			// 红包库存修改限制
			blurPrizeNum (index) {
				let that = this
				if (this.id && (this.status != 1 && this.status != "")) {
					if (parseInt(this.prizes1[index].money_count) > this.prizes[index].money_count) {
						this.prizes[index].money_count = this.prizes1[index].money_count
						this.$message.destroy()
						this.$message.warning("红包库存修改只能大于原数据！")
						this.flag = true
						setTimeout(function () {
							that.flag = false
						}, 500)
						return false
					}
				}
			},
			// 红包库存修改限制
			blurNum (index) {
				let that = this
				if (this.id && (this.status != 1 && this.status != "")) {
					if (parseInt(this.prizes1[index].num) > this.prizes[index].num && this.prizes[index].num) {
						this.prizes[index].num = this.prizes1[index].num
						this.$message.destroy()
						this.$message.warning("奖品库存修改只能大于原数据！")
						this.flag = true
						setTimeout(function () {
							that.flag = false
						}, 500)
						return false
					}
				}
			},
			disabledStartDate (current) {
				if (this.endDate != null && (this.tabKey == 1 || this.tabKey == 3)) {
					return current && current < moment().startOf('day') || current < moment(this.endDate) - 30 * 24 * 60 * 60 * 1000 || current > moment(this.endDate);
				}
				return current && current < moment().startOf('day');
			},
			disabledEndDate (current) {
				if (this.startDate != null && (this.tabKey == 1 || this.tabKey == 3)) {
					return current && current < moment().startOf('day') || current > moment(this.startDate) + 30 * 24 * 60 * 60 * 1000;
				}
				return current && current < moment().startOf('day');
			},
			// 活动时间
			disabledDate (current) {
				// Can not select days before today and today
				return current && current < moment().startOf('day');
			},
			// 活动开始时间改变
			changeStartTime (date, dateString) {
				if (dateString && this.startDate && dateString > moment(this.endDate).format("YYYY-MM-DD HH:mm")) {
					this.$message.destroy()
					this.$message.warning('开始时间不能晚于结束时间')
				}
				if (dateString) {
					this.ticketStartDate = date
					this.startDate = date
				} else {
					this.ticketStartDate = null
					this.startDate = null
				}
				this.ticket_start_time = dateString
				this.start_time = dateString
			},
			// 活动结束时间改变
			changeEndTime (date, dateString) {
				if (dateString && this.startDate && dateString < moment(this.startDate).format("YYYY-MM-DD HH:mm")) {
					this.$message.destroy()
					this.$message.warning('结束时间不能早于开始时间')
					// } else if (this.ticketEndDate && dateString && dateString > moment(this.ticketEndDate).format("YYYY-MM-DD HH:mm")) {
					// 	this.$message.destroy()
					// 	this.$message.warning('活动结束时间不能晚于兑奖结束时间')
				}
				if (dateString) {
					this.endDate = date
				} else {
					this.endDate = null
				}
				this.end_time = dateString
			},
			// // 兑奖开始时间改变
			// changeTicketStartTime (date, dateString) {
			// 	if (dateString && this.ticketStartDate && dateString > moment(this.ticketEndDate).format("YYYY-MM-DD HH:mm")) {
			// 		this.$message.destroy()
			// 		this.$message.warning('开始时间不能晚于结束时间')
			// 	}
			// 	if (dateString) {
			// 		this.ticketStartDate = date
			// 		this.startDate = date
			// 	} else {
			// 		this.ticketStartDate = null
			// 		this.startDate = null
			// 	}
			// 	this.ticket_start_time = dateString
			// 	this.start_time = dateString
			// },
			// // 兑奖结束时间限制
			// changeTicketEndTime (date, dateString) {
			// 	if (dateString && this.ticketStartDate && dateString < moment(this.ticketStartDate).format("YYYY-MM-DD HH:mm")) {
			// 		this.$message.destroy()
			// 		this.$message.warning('结束时间不能早于开始时间')
			// 	} else if (this.endDate && dateString && dateString < moment(this.endDate).format("YYYY-MM-DD HH:mm")) {
			// 		this.$message.destroy()
			// 		this.$message.warning('兑奖结束时间不能早于活动结束时间')
			// 	}
			// 	if (dateString) {
			// 		this.ticketEndDate = date
			// 	} else {
			// 		this.ticketEndDate = null
			// 	}
			// 	this.ticket_end_time = dateString
			// },
			// 活动规则描述回调
			// changeImageText (text) {
			// 	this.rule = text
			// },
			// 海报上传前
			beforeUpload (file) {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					this.$message.destroy()
					this.$message.error('海报仅支持jpg、jpeg、png格式！');
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.destroy()
					this.$message.error('图片大小不超过2M');
					return false
				}
				this.uploadImage(file, 0, 'activity')
			},
			// 任务完成推送图片上传前
			beforeUpload2 (file) {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					this.$message.destroy()
					this.$message.error('图片仅支持jpg、jpeg、png格式！');
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.destroy()
					this.$message.error('图片大小不超过2M');
					return false
				}
				this.uploadImage(file, 2)
			},
			// 图文封面上传前
			beforeUpload1 (file) {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					this.$message.destroy()
					this.$message.error('封面仅支持jpg、jpeg、png格式！');
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.destroy()
					this.$message.error('图片大小不超过2M');
					return false
				}
				this.uploadImage(file, 1)
			},
			// 上传
			async uploadImage (file, type, from) {
				this.loading = true
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				// param.append("sub_id", localStorage.getItem('sub_id'));
				// param.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
				// param.append("is_sync", 0);
				// param.append("file_type", 1);
				param.append("fileInfo", file);
				param.append('from', from);
				const {data: res} = await this.axios.post("sub-user/upload-image", param);
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
					this.loading = false
				} else {
					if (type == 0) {
						this.back_pic_url = res.data.local_path
						this.posterBackHeight()
						this.loading = false;
					} else if (type == 2) {
						this.reply[this.reply.findIndex(r => r.type == 4)].img_url = res.data.local_path
						this.loading = false;
					} else {
						this.link_pic_url = res.data.local_path
						this.loading = false;
					}
				}
			},
			// 海报高度
			posterBackHeight () {
				let that = this
				let img = new Image()
				img.src = this.commonUrl + this.back_pic_url
				img.onload = function () {
					that.backHeight = img.height / (img.width / 375)
					if (that.avatar.y > that.backHeight - that.avatar.w) {
						that.avatar.y = that.backHeight - that.avatar.w > 0 ? that.backHeight - that.avatar.w : 0
					}
					if (that.nickName.y > that.backHeight - that.nickName.h) {
						that.nickName.y = that.backHeight - that.nickName.h > 0 ? that.backHeight - that.nickName.h : 0
					}
					if (that.qrCode.y > that.backHeight - that.qrCode.w) {
						that.qrCode.y = that.backHeight - that.qrCode.w > 0 ? that.backHeight - that.qrCode.w : 0
					}
					++that.menuKey
				}
			},
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
				if (this.nickName.x + parseInt(this.font_size) * 6 > 375) {
					this.nickName.x = 375 - parseInt(this.font_size) * 6
				}
				return parseInt(this.font_size) * 6
			},
			// 昵称高度
			nickNameHeight () {
				if (this.nickName.y + parseInt(this.font_size) * 2 > 667) {
					this.nickName.y = 667 - parseInt(this.font_size) * 2
				}
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
			changeOpenPosters () {
				this.isOpenPosters = this.isOpenPosters == 1 ? 2 : 1
			},
			// 重置
			clearDepartmentList () {
				this.user = []
				this.user_idArr = []
				this.chooseNum1 = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.$refs.user.rightIdList = this.user_keys_id
				this.$refs.user.rightList = this.user_keys
			},
			// 选择成员
			showDepartmentList (index) {
				if (index == 1) {
					this.channelType = 1
					this.is_external = 1
					this.agentid = ''
					this.noticeTitle = "只显示具有外部联系人权限的成员"
					this.chooseNum = this.userKeyNum
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.user_keys_id))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user_keys))
				} else {
					this.channelType = 0
					this.is_external = 0
					this.agentid = this.agent_id
					this.noticeTitle = ""
					this.chooseNum = this.chooseNum1
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.user_idArr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				}
				this.showModalDepartment = true
			},
			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.channelType == 0) {
						this.chooseNum1 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum = userNum
						this.chooseDepartmentNum = departmentNum
						if (this.chooseNum1 > 0) {
							this.user_idArr = JSON.parse(JSON.stringify(arr))
							this.user = JSON.parse(JSON.stringify(list))
						} else {
							this.user_idArr = []
							this.user = []
						}
					} else {
						this.userKeyNum = parseInt(userNum) + parseInt(departmentNum)
						this.userKeyUserNum = userNum
						this.userKeyDepartmentNum = departmentNum
						if (this.userKeyNum > 0) {
							this.user_keys_id = arr
							this.user_keys = list
						} else {
							this.user_keys_id = []
							this.user_keys = []
						}
					}
				}
				this.showModalDepartment = false
			},
			// 图文封面图片
			choosePic () {
				this.chooseId = Number(this.link_attach_id || 0)
				this.showModal3 = true
			},
			// 封面图片回调
			modalVisibleChange2 (event, e, id, item) {
				if (event == "ok") {
					this.link_attach_id = id
					this.link_pic_url = item.local_path
				}
				this.showModal3 = false
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
					if (str) {
						this.tag_arr = str.split(',')
					} else {
						this.tag_arr = []
					}

				}
			},
			// 提醒内容
			changeNoticeText (text, textValue, index) {
				this.reply[index].context = text
				this.reply[index].textValue = textValue
			},
			changeTemplate (templateId, templateData, index) {
				this.reply[index].template_id = templateId
				this.reply[index].template_context = templateData
				this.reply = JSON.parse(JSON.stringify(this.reply))
			},
			changeUrl (is_url, index) {
				this.reply[index].is_url = is_url
				this.reply = JSON.parse(JSON.stringify(this.reply))
			},
			changeEffective () {
				let index = 1
				for (let i = 0; i < this.reply.length; i++) {
					if (this.reply[i].type == 2) {
						index = i
					}
				}
				if (this.reply.length > index && this.reply[index].template_context.length > 2 && typeof this.reply[index].template_context[2].value != "undefined") {
					if (this.effectiveHelp == 1) {
						this.reply[index].template_context[2].value = ''
					} else if (this.effectiveHelp == 2) {
						//取消关注，放弃为你助力
						this.reply[index].template_context[2].value = '取消关注，放弃为你助力'
					} else if (this.effectiveHelp == 4) {
						// 客户删除，放弃为你助力
						this.reply[index].template_context[2].value = '客户删除，放弃为你助力'
					} else if (this.effectiveHelp == 3) {
						//取关+客户删除，放弃为你助力
						this.reply[index].template_context[2].value = '取关+客户删除，放弃为你助力'
					}
					console.log(this.reply[index].template_context[2].value)
					this.reply = JSON.parse(JSON.stringify(this.reply))
				}
			},
			// 提醒内容 文本和模板的切换
			async changeIsTemplate () {
				this.isLoading = true
				if (this.isTemplate == 1) {
					const {data: res} = await this.axios.post("work-activity-public/activity-add-template", {
						wxNum: this.wx_id,
						type : this.effectiveHelp
					});
					if (res.error != 0) {
						this.isLoading = false
						this.$message.destroy()
						this.$message.error(res.error_msg);
						this.isTemplate = '0'
						this.createLoading = false
					} else {
						for (let i = 0; i < 3; i++) {
							for (let j = 0; j < this.reply.length; j++) {
								if (this.reply[j].type == i + 1) {
									if (!res.data[i].msg) {
										this.reply[j].template_context = res.data[i].data
										this.reply[j].title = res.data[i].title
										this.reply[j].template_id = res.data[i].template_id
										this.reply[j].is_url = res.data[i].is_url
									} else {
										this.reply[j].msg = res.data[i].msg
									}
								}
							}
						}
						for (let i = 0; i < this.reply.length; i++) {
							if (this.reply[i].type < 4) {
								this.reply[i].is_template = this.isTemplate
							}
						}
						this.isLoading = false
					}
				} else {
					for (let i = 0; i < this.reply.length; i++) {
						if (this.reply[i].type < 4) {
							this.reply[i].is_template = this.isTemplate
						}
					}
					this.isLoading = false
				}
			},
			// 提醒是否打开
			changeNotice (index) {
				this.reply[index].is_open = (parseInt(this.reply[index].is_open) + 1) % 2
			},
			// 下一步
			next () {
				if (this.checkout(this.current)) {
					this.current++;
				}
			},
			// 下一步及提交参数的检查
			checkout (current) {
				if (current == 0) {
					if (this.wxMsgFlag && this.tabKey == 3) {
						this.$message.destroy()
						this.$message.warning("该公众号未配置相关功能权限，请重新选择")
						return false
					}
					if (this.msgFlag && this.tabKey == 3) {
						this.$message.destroy()
						this.$message.warning("该企业微信未配置相关功能权限，请重新选择")
						return false
					}
					if (this.title == '') {
						this.$message.destroy()
						this.$message.warning("请检查标题")
						return false
					}
					if (this.tabKey != 1 && typeof this.agent_id == 'object' && this.agent_id.length == 0) {
						this.$message.destroy()
						this.$message.warning("请选择应用")
						return false
					}
					if (this.start_time == '' || this.end_time == '') {
						this.$message.destroy()
						this.$message.warning("请检查活动时间")
						return false
					}
					if (this.start_time > this.end_time) {
						this.$message.destroy()
						this.$message.warning("活动开始时间不能大于结束时间")
						return false
					}
					if (this.end_time < moment(new Date()).format("YYYY-MM-DD HH:mm")) {
						this.$message.destroy()
						this.$message.warning("活动结束时间不能早于当前时间")
						return false
					}
					// if (this.ticket_start_time == '' || this.ticket_end_time == '') {
					// 	this.$message.destroy()
					// 	this.$message.warning("请检查兑奖时间")
					// 	return false
					// }
					// if (this.ticket_start_time > this.ticket_end_time) {
					// 	this.$message.destroy()
					// 	this.$message.warning("兑奖开始时间不能大于结束时间")
					// 	return false
					// }
					// if (this.ticket_end_time < moment(new Date()).format("YYYY-MM-DD HH:mm")) {
					// 	this.$message.destroy()
					// 	this.$message.warning("兑奖结束时间不能早于当前时间")
					// 	return false
					// }
					// if (this.ticket_end_time < this.end_time) {
					// 	this.$message.destroy()
					// 	this.$message.warning("兑奖结束时间不能早于活动结束时间")
					// 	return false
					// }
					// if (this.tabKey != 2) {
					// 	if (this.rule == '') {
					// 		this.$message.destroy()
					// 		this.$message.warning("请检查活动规则")
					// 		return false
					// 	}
					// }
				}
				if (current == 1) {
					for (let l of this.prizes) {
						if (l.is_open == 1) {
							if (!l.number || l.number == 0) {
								this.$message.destroy()
								this.$message.warning("请检查裂变人数")
								return false
							}
							if (l.type == 1) {
								if (!l.prize_name) {
									this.$message.destroy()
									this.$message.warning("请填写奖品名称")
									return false
								}
								if (l.num == 0) {
									this.$message.destroy()
									this.$message.warning("奖品库存不能为0")
									return false
								}
							} else if (l.type == 2) {
								if (l.money_amount == '' || l.money_amount == null) {
									this.$message.destroy()
									this.$message.warning("请填写红包金额")
									return false
								} else {
									if (Number(l.money_amount) < 0.3 || Number(l.money_amount) > 5000) {
										this.$message.destroy()
										this.$message.warning("红包金额必须在0.30~5000.00之间")
										return false
									}
								}
								if (l.money_count == '' || l.money_count == null) {
									this.$message.destroy()
									this.$message.warning("请填写红包数量")
									return false
								} else {
									if (l.money_count == 0) {
										this.$message.destroy()
										this.$message.warning("红包数量不能为0")
										return false
									}
								}
							}
						}
					}
					if (this.tabKey == 2 && this.actionType == 2 && this.userKeyNum == 0) {
						this.$message.destroy()
						this.$message.warning("请检查领取方式客服员工")
						return false
					}
					if (this.tabKey == 2 && this.actionType == 1 && this.prizes[0].type == 2 && this.userKeyNum == 0) {
						this.$message.destroy()
						this.$message.warning("请检查领取方式客服员工")
						return false
					}
					// if (this.actionType == 1 && this.info.length == 0) {
					// 	this.$message.destroy()
					// 	this.$message.warning("请检查领取方式")
					// 	return false
					// }
					if (this.flag) {
						return false
					}
				}
				if (current == 2 && this.tabKey == 2) {
					if (this.areaType == 2) {
						for (let i = 0; i < this.province.length; i++) {
							if (this.province[i].length == 0) {
								this.$message.destroy()
								this.$message.warning("请选择地区")
								return false
							}
						}
					}
				}
				if (current == 3) {
					if (this.back_pic_url == '') {
						this.$message.destroy()
						this.$message.warning("请上传海报")
						return false
					}
					if (this.tabKey != 2) {
						if (this.keyword == '') {
							this.$message.destroy()
							this.$message.warning("请检查关键词")
							return false
						}
						if (this.ruleTextContent.replace(/\n/g, '').trim() == '') {
							this.$message.destroy()
							this.$message.warning("请检查活动规则描述")
							return false
						}
						if (this.isOpenPosters == 1 && this.postersTextContent.replace(/\n/g, '').trim() == '') {
							this.$message.destroy()
							this.$message.warning("请检查海报分享话术")
							return false
						}
					}
				}
				if ((this.tabKey == 2 && current == 4) || this.tabKey == 3 && current == 4) {
					if (this.chooseNum1 == 0) {
						this.$message.destroy()
						this.$message.warning("请检查引流成员")
						return false
					}
					if (this.link_pic_url == '') {
						this.$message.destroy()
						this.$message.warning("请检查图文封面")
						return false
					}
					if (this.link_pic_url == '') {
						this.$message.destroy()
						this.$message.warning("请检查图文封面")
						return false
					}
					if (this.link_start_title == '') {
						this.$message.destroy()
						this.$message.warning("请检查图文标题")
						return false
					}
				}
				if ((this.tabKey == 1 && current == 4) || (this.tabKey == 3 && current == 5)) {
					for (let i = 0; i < this.reply.length; i++) {
						if (this.reply[i].is_open == 1) {
							if (this.reply[i].type == 4) {
								if (this.reply[i].img_url == '') {
									this.$message.destroy()
									this.$message.warning("请检查任务完成推送图片")
									return false
								}
							} else {
								if (this.reply[i].is_template == 0 && this.reply[i].context.replace(/\n/g, '').trim() == '') {
									this.$message.destroy()
									this.$message.warning("提醒内容不能为空")
									return false
								}
							}

						}
						// if (this.reply[i].is_template == 1) {
						// 	if (this.reply[i].template_id == '') {
						// 		this.$message.destroy()
						// 		this.$message.warning("请检查模板消息内容")
						// 		return false
						// 	}
						// }
					}
				}
				return true
			},
			// 上一步
			prev () {
				this.current--;
			},
			// 16进制颜色转化成rgb
			transform16ToRgb (sColor) {
				let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				// 如果是16进制颜色
				if (sColor && reg.test(sColor)) {
					if (sColor.length === 4) {
						let sColorNew = "#";
						for (let i = 1; i < 4; i += 1) {
							sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
						}
						sColor = sColorNew;
					}
					//处理六位的颜色值
					let sColorChange = [];
					for (let i = 1; i < 7; i += 2) {
						sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
					}
					return sColorChange.join(",");
				}
				return sColor;
			},
			transformRgbTo16 (color) {
				let rgb = color.split(',');
				let r = parseInt(rgb[0]);
				let g = parseInt(rgb[1]);
				let b = parseInt(rgb[2]);
				let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
				return hex;
			},
			// 创建活动
			async createActivity () {
				this.createLoading = true
				if (!this.checkout(0)) {
					this.current = 0
					this.createLoading = false
					return false
				}
				if (!this.checkout(1)) {
					this.current = 1
					this.createLoading = false
					return false
				}
				if (!this.checkout(2)) {
					this.current = 2
					this.createLoading = false
					return false
				}
				if (!this.checkout(3)) {
					this.current = 3
					this.createLoading = false
					return false
				}
				if (!this.checkout(4)) {
					this.current = 4
					this.createLoading = false
					return false
				}
				if (!this.checkout(5)) {
					this.current = 5
					this.createLoading = false
					return false
				}
				let tagIds = []
				if (this.tabKey == 1) {
					for (let i = 0; i < this.tagChecked.length; i++) {
						if (this.tagChecked[i]) {
							tagIds.push(this.tagList[i].id)
						}
					}
				} else {
					this.tag_ids = this.tag_arr.join()
				}
				let params = {
					activity_id     : this.id,
					corp_id         : this.corp_id,
					corp_agent      : this.agent_id,
					uid             : localStorage.getItem('uid'),
					type            : this.tabKey,
					public_id       : this.wx_id,
					activity_name   : this.title,
					start_time      : this.start_time,
					end_time        : this.end_time,
					tickets_start   : this.ticket_start_time,
					tickets_end     : this.ticket_end_time,
					// 兑奖时间
					// activity_rule   : this.rule,
					level_end       : this.level,
					level           : this.prizes,
					action_type     : this.actionType,
					user_key        : this.user_keys,
					hfive_config    : this.info,
					sex_type        : this.sexType,
					region_type     : this.areaType,
					region          : this.province,
					label_id        : this.tabKey != 1 ? this.tag_arr : tagIds,
					number          : this.help_num,
					mutual          : this.mutual,
					not_attention   : this.effectiveHelp,
					is_heard        : this.is_avatar,
					heard_width     : this.avatar.w,
					heard_type      : this.shape == 'square' ? 1 : 2,
					heard_top       : this.avatar.y,
					heard_left      : this.avatar.x,
					heard_ratio     : 1,
					code_width      : this.qrCode.w,
					code_top        : this.qrCode.y,
					code_left       : this.qrCode.x,
					code_ratio      : 1,
					is_font         : this.is_nickname,
					font_top        : this.nickName.y,
					font_left       : this.nickName.x,
					font_size       : this.font_size,
					font_color      : this.transform16ToRgb(this.color),
					background_url  : this.back_pic_url,
					keyword         : this.keyword,
					describe        : this.ruleTextContent,
					poster_open     : this.isOpenPosters,
					poster_describe : this.postersTextContent,
					channel_user    : this.user,
					welcome         : this.text_content,
					welcome_help    : this.text_content1,
					welcome_url     : this.link_pic_url,
					welcome_title   : this.link_start_title,
					welcome_describe: this.link_desc,
					reply           : this.reply
				}
				const {data: res} = await this.axios.post("work-activity-public/activity-add", params);
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
					this.createLoading = false
				} else {
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					if (this.id == '') {
						if (localStorage.getItem('type') == 1) {
							this.$router.push("/wholeMarket/fissionList")
						} else {
							this.$router.push("/wholeMarket/fissionList1")
						}
					} else {
						if (localStorage.getItem('type') == 1) {
							this.$router.push("/wholeMarket/fissionList?isRefresh=1")
						} else {
							this.$router.push("/wholeMarket/fissionList1?isRefresh=1")
						}
					}
					this.createLoading = false
				}
			},
			// 编辑获取详情
			async getDetail () {
				const {data: res} = await this.axios.post("work-activity-public/activity-add", {
					activity_id: this.id,
					is_detail  : 1,
				});
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false
					this.status = res.data.is_over
					this.corp_id = res.data.corp_id
					if(JSON.parse(localStorage.getItem('corpArr')).find(x => x.corpid == this.corp_id)) {
						this.corpName = JSON.parse(localStorage.getItem('corpArr')).find(x => x.corpid == this.corp_id).corp_name
					}
					this.agent_id = res.data.corp_agent
					this.tabKey = res.data.type
					this.$nextTick(() => {
						this.setSteps()
						this.wx_id = String(res.data.public_id)
						this.wxInfo = JSON.parse(localStorage.getItem('wxArr')).find(x => x.wx_id == this.wx_id)
						if (this.tabKey != 2) {
							this.avatarImg = JSON.parse(localStorage.getItem('wxArr')).find(x => x.wx_id == this.wx_id).head_img
							this.wxNickName = JSON.parse(localStorage.getItem('wxArr')).find(x => x.wx_id == this.wx_id).nick_name
						}
						this.title = res.data.activity_name
						this.start_time = res.data.start_time
						this.areaType = res.data.region_type
						this.province = res.data.region
						this.province.map(x => {
							if (!!this.id && (this.status == 5)) {
								x.disabled = true
							}
						})
						this.startDate = moment(this.start_time).format('YYYY-MM-DD HH:mm')
						this.end_time = res.data.end_time
						this.endDate = moment(this.end_time).format('YYYY-MM-DD HH:mm')
						this.ticket_start_time = res.data.tickets_start
						this.ticketStartDate = moment(this.ticket_start_time).format('YYYY-MM-DD HH:mm')
						this.ticket_end_time = res.data.tickets_end
						this.ticketEndDate = moment(this.ticket_end_time).format('YYYY-MM-DD HH:mm')
						// this.rule = res.data.activity_rule
						this.level = res.data.level_end || []
						this.prizes = res.data.level
						this.prizes1 = JSON.parse(JSON.stringify(this.prizes))
						this.actionType = res.data.action_type
						this.user_keys = res.data.user_key || []
						this.userKeyNum = this.user_keys.length
						if (this.user_keys.length > 0) {
							this.userKeyUserNum = 0
							this.userKeyDepartmentNum = 0
							this.user_keys_id = []
							this.user_keys.map(x => {
								this.user_keys_id.push(x.id)
								if (x.scopedSlots.title == 'custom') {
									this.userKeyUserNum++
								} else if (x.scopedSlots.title == 'title') {
									this.userKeyDepartmentNum++
								}
							})
						}
						this.info = res.data.hfive_config || []
						this.sexType = res.data.sex_type
						if (this.tabKey != 1) {
							this.tag_arr = res.data.label_id || []
						} else {
							this.getTags(res.data.label_id || [])
						}
						this.help_num = res.data.number
						this.mutual = res.data.mutual
						this.effectiveHelp = res.data.not_attention
						this.is_avatar = res.data.is_heard == 1 ? true : false
						this.avatar.w = parseInt(res.data.heard_width)
						this.shape = res.data.heard_type == 1 ? 'square' : "circle"
						this.avatar.y = parseInt(res.data.heard_top)
						this.avatar.x = parseInt(res.data.heard_left)
						this.qrCode.w = parseInt(res.data.code_width)
						this.qrCode.y = parseInt(res.data.code_top)
						this.qrCode.x = parseInt(res.data.code_left)
						this.is_nickname = res.data.is_font == 1 ? true : false
						this.nickName.y = parseInt(res.data.font_top)
						this.nickName.x = parseInt(res.data.font_left)
						this.font_size = parseInt(res.data.font_size)
						this.color = this.transformRgbTo16(res.data.font_color)
						this.back_pic_url = res.data.background_url
						this.keyword = res.data.keyword
						this.ruleTextContent = res.data.describe
						this.ruleTextValue = "<p>" + this.ruleTextContent.replace(/{nickname}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>').replace(/\n/g, '<br>') + "</p>"
						this.isOpenPosters = res.data.poster_open
						this.postersTextContent = res.data.poster_describe
						this.postersTextValue = "<p>" + this.postersTextContent.replace(/{nickname}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>').replace(/\n/g, '<br>') + '</p>'
						this.user = res.data.channel_user || []
						this.chooseNum1 = this.user.length
						if (this.user.length > 0) {
							this.chooseUserNum = 0
							this.chooseDepartmentNum = 0
							this.user_idArr = []
							this.user.map(x => {
								this.user_idArr.push(x.id)
								if (x.scopedSlots.title == 'custom') {
									this.chooseUserNum++
								} else if (x.scopedSlots.title == 'title') {
									this.chooseDepartmentNum++
								}
							})
						}
						this.text_content = res.data.welcome
						this.textAreaValueHeader = this.text_content.replace(/{nickname}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>').replace(/{ranking}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">排行榜</span>&nbsp;</span>').replace(/\n/g, '<br>')
						this.text_content1 = res.data.welcome_help
						this.textAreaValueHeader1 = this.text_content1.replace(/{nickname}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>').replace(/{ranking}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">排行榜</span>&nbsp;</span>').replace(/\n/g, '<br>')
						this.link_pic_url = res.data.welcome_url
						this.link_start_title = res.data.welcome_title
						this.link_desc = res.data.welcome_describe
						this.reply = res.data.reply
						if (this.reply && this.reply.length != 0) {
							this.isTemplate = res.data.reply[0].is_template ? res.data.reply[0].is_template : '0'
							this.setReplyTextVal()
						}
						this.posterBackHeight()
					})
				}
			},
			// 欢迎语文本改变
			changeText (text, textVale) {
				this.text_content = text
				this.textAreaValueHeader = textVale
			},
			changeText1 (text, textVale) {
				this.text_content1 = text
				this.textAreaValueHeader1 = textVale
			},
			// 活动规则回调
			changeRuleText (text, textValue) {
				this.ruleTextContent = text
				this.ruleTextValue = textValue
			},
			// 海报话术回调
			changePostersText (text, textValue) {
				this.postersTextContent = text
				this.postersTextValue = textValue
			},
			// 设置步骤条
			setSteps () {
				if (this.tabKey == 2) {
					this.steps = [  // 步骤名
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
					]
				} else if (this.tabKey == 1) {
					this.steps = [  // 步骤名
						{
							title: '基础设置',
						},
						{
							title: '奖品设置',
						},
						{
							title: '高级设置',
						},
						{
							title: '海报设置',
						},
						{
							title: '提醒设置'
						}
					]
				} else if (this.tabKey == 3) {
					this.steps = [  // 步骤名
						{
							title: '基础设置',
						},
						{
							title: '奖品设置',
						},
						{
							title: '高级设置',
						},
						{
							title: '海报设置',
						},
						{
							title: '欢迎语设置'
						},
						{
							title: '提醒设置'
						}
					]
				}
			},
			initReply () {
				this.reply = []
				let context = ''
				let textValue = ''
				let type = ''
				for (let i = 0; i < 15; i++) {
					type = 4
					if (i == 0) {
						context = "您好！您的好友 {nickname} 支持你了！\n你已获得 {success} 个好友的支持，\n还差 {error} 个好友支持，即可获得奖励。\n继续努力邀请吧~"
						textValue = '<p>您好！您的好友<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>支持你了！</p><p>你已获得<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量</span>&nbsp;</span>个好友的支持，还差<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量</span>&nbsp;</span>个好友支持，即可获得奖励。</p><p>继续努力邀请吧~</p>'
						type = 1
					} else if (i == 1) {
						context = '您的好友 {nickname} 放弃为你助力！\n人气值 -1 ，还差 {error} 个好友的支持。\n继续努力邀请吧~'
						textValue = '<p>您的好友<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>放弃为你助力！</p><p>人气值 -1 ，还差<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量</span>&nbsp;</span>个好友的支持。</p><p>继续努力邀请吧~</p>'
						type = 2
					} else if (i == 2) {
						context = "您好！您的好友 {nickname} 支持你了！\n您已获得 {success} 个好友的支持\n恭喜您完成任务！\n<a href='{url}'>点此领取奖品吧~</a>"
						textValue = '<p>您好！您的好友<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>支持你了！</p><p>您已获得<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量</span>&nbsp;</span>个好友的支持</p><p>恭喜您完成任务！</p><p><a href="{url}">点此领取奖品吧~</a></p>'
						type = 3
					} else if (i == 4) {
						context = "您好！您的好友 {nickname} 支持你了！\n您已获得 {success} 个好友的支持\n恭喜您完成二阶任务！"
						textValue = '<p>您好！您的好友<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>支持你了！</p><p>您已获得<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量</span>&nbsp;</span>个好友的支持</p><p>恭喜您完成二阶任务！</p>'
						type = 5
					} else if (i == 5) {
						context = "您好！您的好友 {nickname} 支持你了！\n您已获得 {success} 个好友的支持\n恭喜您完成三阶任务！"
						textValue = '<p>您好！您的好友<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>支持你了！</p><p>您已获得<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量</span>&nbsp;</span>个好友的支持</p><p>恭喜您完成三阶任务！</p>'
						type = 7
					} else if (i == 6) {
						context = '您已经参加了本次活动，快去把海报分享给好友吧。'
						textValue = '<p>您已经参加了本次活动，快去把海报分享给好友吧。</p>'
						type = 6
					} else if (i == 7) {
						context = '恭喜您，帮好友助力成功。'
						textValue = '<p>恭喜您，帮好友助力成功。</p>'
						type = 8
					} else if (i == 8) {
						context = '抱歉，你与 {nickname} 不能互助，不符合助力要求，助力无效。'
						textValue = '<p>抱歉，您与<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>不能互助，不符合助力要求，助力无效。</p>'
						type = 9
					} else if (i == 9) {
						context = '抱歉，您助力次数已达上限，不能为 {nickname} 助力了。'
						textValue = '<p>抱歉，您助力次数已达上限，不能为<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;</span>助力了。</p>'
						type = 15
					} else if (i == 10) {
						context = '来晚了，奖品已经被拿光了，更多精彩活动敬请期待。'
						textValue = '<p>来晚了，奖品已经被拿光了，更多精彩活动敬请期待。</p>'
						type = 10
					} else if (i == 11) {
						context = '为了不频繁的打扰您，今天的活动进度就暂时为您汇报到这里了。\n任务完成时，你会收到任务完成通知\n<a href="\{ranking\}">戳此查看最新任务进度</a>'
						textValue = '<p>为了不频繁的打扰您，今天的活动进度就暂时为您汇报到这里了。</p><p>任务完成时，你会收到任务完成通知</p><p><a href="\{ranking\}">戳此查看最新任务进度</a></p>'
						type = 11
					} else if (i == 12) {
						context = '本次活动已下线，更多精彩活动敬请期待。'
						textValue = '<p>本次活动已下线，更多精彩活动敬请期待。</p>'
						type = 12
					} else if (i == 13) {
						context = '任务已完成！您的好友 {nickname} 又支持您了\n人气值 +1 \n目前已有 {success} 人支持您！\n'
						textValue = '<p>任务已完成！您的好友<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;又支持您了</span></p><p>人气值 +1 </p><p>目前已有<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量</span>&nbsp;人支持您！</span></p>'
						type = 13
					} else if (i == 14) {
						context = '您的好友 {nickname} 还未为您助力，只有加老师的企业微信后才算助力成功哦~\n快提醒他吧~'
						textValue = '<p>您的好友<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">昵称</span>&nbsp;还未为您助力，只有加老师的企业微信后才算助力成功哦~</span></p><p>快提醒他吧~</p>'
						type = 14
					}
					let is_open = 1
					if (i == 4 || i == 5) {
						is_open = 0
					}
					this.reply.push({
						type            : type,
						is_template     : 0,
						template_id     : '',
						context         : context,
						textValue       : textValue,
						img_url         : '',
						is_open         : is_open,
						template_context: [],
						is_url          : 0,
					})
				}
			},
			setReplyTextVal () {
				for (let i = 0; i < this.reply.length; i++) {
					if (this.reply.type != 4) {
						if (this.reply[i].is_template == 0) {
							this.reply[i]['textValue'] = '<p>' + this.reply[i].context.replace(/{nickname}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户昵称</span>&nbsp;</span>').replace(/{success}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已完成任务量</span>&nbsp;</span>').replace(/{error}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">未完成任务量</span>&nbsp;</span>').replace(/{oneLevel}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">任务剩余库存</span>&nbsp;</span>').replace(/{twoLevel}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">二阶任务剩余库存</span>&nbsp;</span>').replace(/{threeLevel}/g, '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">三阶任务剩余库存</span>&nbsp;</span>').replace(/\n/g, '<br>') + '</p>'
						}
					}
				}
			},
		},
		mounted () {
			this.initReply()
			this.commonUrl = this.$store.state.commonUrl
			this.wxNickName = this.$store.state.wxNickName
			this.wholeMarketFissionNum = Number(this.$store.state.packageDetail.wholeMarketFissionNum)
			if (typeof this.$route.query.id != 'undefined') {
				this.id = this.$route.query.id
				this.editorFlag = true
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				if (localStorage.getItem('type') == 1) {
					localStorage.setItem('backUrl', '/wholeMarket/fissionList')
				} else {
					localStorage.setItem('backUrl', '/wholeMarket/fissionList1')
				}
				if (this.corp_id) {
					this.getAgentList()
				}
				this.getDetail()
			} else {
				let _this = this
				if (this.type == 0) {
					this.tabKey = 1
					this.actionType = '1'
					if (!_this.avatarImg) {
						_this.avatarImg = _this.wxList[_this.$store.state.wxNumIndex].head_img;
					}
					this.editorFlag = true
					this.getTags()
				}
				if (this.type == 1) {
					this.tabKey = 2
					this.actionType = '2'
					this.editorFlag = true
					this.getAgentList()
				}
				this.$nextTick(() => {
					this.setTextContent()
				})
				this.setSteps()
				this.wxInfo = JSON.parse(localStorage.getItem('wxArr')).find(x => x.wx_id == localStorage.getItem("wxNum"))
			}
		}

	}
</script>

<style lang="less" scoped>
	@import '../../../../style/_style.less';

	/deep/ .ant-tag {
		margin: 2px 5px;
	}

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
		height: 100%;
		/*overflow-y: auto;*/
	}

	.fission-content {
		width: calc(100% - 40px);
		background-color: #FAFAFA;
		margin: 0 auto;
		margin-bottom: 60px;
		padding: 30px 0px 0px 0px;
		overflow-y: hidden;
	}

	.steps-content {
		margin-top: 20px;
		border-radius: 6px;
		height: calc(100% - 52px);
		padding: 0 15px 40px 0;
	}

	.steps-action {
		width: 100%;
		/*text-align: center;*/
		position: fixed;
		bottom: 0px;
		background-color: #F0F2F5;
		/*left: 50%;*/
		/*transform: translate(-50%, 0%);*/
		height: 60px;
		line-height: 60px;
		z-index: 99999;
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
		width: 375px;
		height: 667px;
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

	.tabBtn {
		margin: 0;
		margin-right: 2px;
		padding: 10px 16px;
		line-height: 38px;
		background: #FAFAFA;
		border: 1px solid #E8E8E8;
		border-bottom: 0;
		border-radius: 4px 4px 0 0;
		cursor: pointer;
	}

	.activeBtn {
		color: #01b065;
		background: #FFF;
	}

	/deep/ .ant-divider-horizontal {
		margin: 20px 0;
	}

	.one-level-pig /deep/ .ant-upload {
		width: 100%;
	}
</style>
<style>
	.ruleUeditor .ueditor .filingCabinetUeditor .edui-editor-toolbarbox {
		position: relative;
		top: 0px;
		width: 100%;
		line-height: normal;
	}
</style>
