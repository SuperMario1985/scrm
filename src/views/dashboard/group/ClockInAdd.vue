<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="typeof urlId == 'undefined'">新建</template>
						<template v-if="typeof urlId != 'undefined'">修改</template>
						打卡活动
						<a-button type="primary" icon="rollback"
						          style="float: right;margin-top: 9px;" @click="goBack">返回列表
						</a-button>
					</a-layout-header>

					<a-layout class="fans-content">
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- 公众号选择 -->
								<div class="content-hd">
									<a-form>
										<a-form-item v-if="$store.state.corpArr.length > 1" label="选择企业微信"
										             :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template>
												<div style="display: inline-block;cursor: pointer;" @click="add">
													<img src="../../../assets/WeChatLogo.png" alt=""
													     style="width: 24px;border-radius: 4px;">
													<span style="margin-left: 5px;">{{$store.state.corpName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
													        v-if="typeof urlId=='undefined'"/>
												</div>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</template>
										</a-form-item>
										<a-form-item class="current0" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template slot="label">
												<span style="color: red;">*</span>选择应用
											</template>
											<template>
												<a-select
														showSearch
														optionFilterProp="children"
														style="width: 200px;"
														v-model="agent_id" placeholder="请选择应用"
														:disabled="status != 0">
													<template v-for="item in agentList">
														<a-select-option :value="item.id">{{item.name}}
														</a-select-option>
													</template>
												</a-select>
												<span style="color: #F56C6C">（一旦发布，不可更改）</span>
												<div class="content-msg" style="font-size: 13px;">
													<p style="height: 20px; line-height: 20px; margin-bottom: 2px">
														1、前往<a target="_blank"
														       href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
														企业微信后台</a>创建自建应用。<a target="_blank"
														                    href="https://support.qq.com/products/104790/faqs/63937">
														教程</a></p>
													<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">
														2、选择此应用，请确认已设置过应用的可信域名。
														<a :href="commonUrl+'/upload/slider.png'" target="_blank"
														   class="el-link el-link--primary">
															<span class="el-link--inner">查看图示</span>
														</a>
													</p>
												</div>
											</template>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd">
									<a-form>
										<!-- 活动类型 -->
										<a-form-item :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template slot="label">
												<span style="color: red;">*</span>活动类型
											</template>
											<a-radio-group name="sceneGroup" v-model="activeType"
											               :disabled="status == 0 ?false:true">
												<a-radio :value="1">永久有效</a-radio>
												<a-radio :value="2">固定区间</a-radio>
											</a-radio-group>
											<span style="color: #F56C6C;">（一旦发布，不可修改）</span>
										</a-form-item>
										<!-- 活动时间 -->
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             style="margin-top:0;" v-if="activeType == 2">
											<template slot="label">
												<span style="color: red;">*</span>活动时间
											</template>
											<a-date-picker
													:disabled="status != 0"
													:disabledDate="disabledDate"
													v-model="startDate"
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
													:disabledDate="disabledDate2"
													v-model="endDate"
													@change="changeEndTime"
													:showTime="{
												        hideDisabledOptions: true,
												        defaultValue: moment('23:59', 'HH:mm'),
												        format:'HH:mm'
												   }"
													format="YYYY-MM-DD HH:mm"
											/>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦发布，只能延长）</span>
										</a-form-item>
										<!-- 活动名称 -->
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             style="margin-top:0;">
											<template slot="label">
												<span style="color: red;">*</span>活动名称
											</template>
											<a-input v-model="msg_title" placeholder="请输入活动名称" :maxLength="20"
											         style="width: 60%;"
											         :disabled="status == 0?false:true"/>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{msg_title === null ? 0 : msg_title.length}} / 20</span>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦发布，不可修改）</span>
										</a-form-item>
										<!-- 活动规则 -->
										<a-form-item :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template slot="label">
												<span style="color: red;">*</span>活动规则
											</template>
											<a-textarea
													v-model="rule"
													placeholder="请输入活动规则"
													:auto-size="{ minRows: 5, maxRows: 5 }"
													style="width: 60%;vertical-align: text-bottom;margin-bottom: 0;"
													:maxLength="200"
											/>
											<span style="margin-left: 10px;">{{rule.length}}/200</span>
										</a-form-item>
										<!-- 选择打卡类型 -->
										<a-form-item :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template slot="label">
												<span style="color: red;">*</span>选择打卡类型
											</template>
											<a-radio-group name="sceneGroup" v-model="clockInType"
											               :disabled="status != 0">
												<a-radio :value="1">连续打卡</a-radio>
												<a-radio :value="2">累计打卡</a-radio>
											</a-radio-group>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦发布，不可修改）</span>
										</a-form-item>
										<!-- 打卡任务设置 -->
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 16 }">
											<template slot="label">
												<span style="color: red;">*</span>打卡任务设置
											</template>
											<a-tabs hideAdd v-model="activeKey" type="editable-card" @edit="onEdit" style="background: #fff;">
												<template v-for="(item,index) in clockInList">
													<a-tab-pane :tab="'第'+(index+1)+'阶段任务'" :key="item.key"
													            :closable="!(status != 0 && item.id != null && item.id  != '')" style="padding: 0 10px;">
														<div style="color:#F56C6C;margin-bottom: 5px;">每个打卡阶段任务只可奖励1次。一旦关闭，该打卡任务不在手机端展示，但对已获得奖品的用户依然展示。</div>
														<div>
															<a-switch v-model="item.is_open"/>
														</div>
														<div>用户<span v-if="clockInType == 1">连续</span><span
																v-if="clockInType == 2">累计</span>打卡
															<a-input-number
																	class="brush-input"
																	:min="0" :max="99999999"
																	:formatter="limitDecimals"
																	:parse="limitDecimals"
																	v-model="item.days"></a-input-number>
															天
															<a-tooltip placement="top">
																<template slot="title">
																	<span>（修改时长后，不影响在修改前已获得奖品的用户。若设置连续3天打卡获得奖励，某用户已连续打卡2天，此时更改为“2天”，该用户依然无法获得奖励，但是若断掉后，再连续签到2天，即可获得。）</span>
																</template>
																<a-icon type="question-circle" style="margin-left:5px;"/>
															</a-tooltip>
														</div>
														<a-form-item :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }">
															<template slot="label">
																<span style="color: red;">*</span>奖品类型
															</template>
															<a-radio-group name="radioGroup" v-model="item.type"
															               :disabled="status != 0 && item.id != null && item.id  != ''">
																<a-radio :value="1">实物</a-radio>
																<a-radio :value="2">红包</a-radio>
															</a-radio-group>
															<span style="color: #F56C6C;">（一旦发布，不可修改。）</span>
														</a-form-item>
														<a-form-item :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }" v-if="item.type == 2">
															<template slot="label">
																<span style="color: red;">*</span>红包金额
															</template>
															<a-input-number :step="0" :precision="2"
															                style="width: 140px;margin-right: 5px;"
															                :min="0.30"
															                :max="5000.00"
															                v-model="item.money_amount"
															                :disabled="status != 0 && item.id != null && item.id  != ''"/>
															元
															<span style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入0.30~5000.00）</span>
														</a-form-item>
														<a-form-item :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }" v-if="item.type == 1">
															<template slot="label">
																<span style="color: red;">*</span>奖品名称
															</template>
															<a-input v-model="item.reward_name"
															         placeholder="请填写奖品名称，限10字符"
															         :maxLength="10"
															         style="width: 350px;"></a-input>
															<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{item.reward_name === null ? 0 : item.reward_name.length}} / 10</span>
														</a-form-item>
														<a-form-item :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }">
															<template slot="label">
																<span style="color: red;">*</span>领奖方式
															</template>
															<div style="line-height: 24px;" v-if=" item.type == 2">
																为了避免微信支付商户平台里的账户余额不足，无法发给参与者而导致的纠纷问题，故在任务完成后，加入客服二维码进行线下联系。若已到账，参与者至于是否加客服，其自定。
															</div>
															<a-radio-group name="radioGroup" v-model="item.reward_type"
															               style="margin-top: 9px;"
															               v-if="item.type == 1"
															               :disabled="status != 0 && item.id != null && item.id  != ''">
																<a-radio :value="2">
																	兑换链接
																	<a-tooltip placement="bottom">
																		<template slot="title">
																			<span>主要适用于需要快递物流的奖品</span>
																		</template>
																		<a-icon type="question-circle"
																		        style="margin-left:5px;"/>
																	</a-tooltip>
																	（用户完成任务后，让客户填写信息，发送快递）
																	<span style="color: #F56C6C;">（一旦发布，不可修改）</span>
																</a-radio>
																<a-radio :value="1" style="margin-top: 9px;">
																	联系客服
																	<a-tooltip placement="bottom">
																		<template slot="title">
																			<span>主要适用于需要到店自提的奖品、或是以线下发放为主的虚拟奖品。如“XXX运营干货PPT”</span>
																		</template>
																		<a-icon type="question-circle"
																		        style="margin-left:5px;"/>
																	</a-tooltip>
																	（用户完成任务后，联系客服领取奖励）
																</a-radio>
															</a-radio-group>
															<div v-if="item.type == 2 || (item.type == 1 && item.reward_type == 1)">
																<div>
																	<a-button style="margin-top: 10px;"
																	          @click="showDepartmentList(index)">
																		<span v-if="item.userKeyNum > 0">已选择{{item.chooseUserNum}}名成员，{{item.chooseDepartmentNum}}个部门</span>
																		<span v-else>选择员工</span>
																	</a-button>
																	<a-tooltip placement="top"
																	           v-if="item.user_keys.length > 0">
																		<template slot="title">
																			<template
																					v-for="user in item.user_keys">
																				<span>{{user.title}} </span>
																			</template>
																		</template>
																		<span style="display: inline-block; max-width: 300px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;vertical-align: middle;margin-left: 10px;color:rgba(0, 0, 0, 0.65);">
															<template v-for="user in item.user_keys">
																<span>{{user.title}} </span>
															</template>
														</span>
																	</a-tooltip>
																</div>
															</div>
														</a-form-item>
													</a-tab-pane>
												</template>
												<div style="line-height: 30px;text-align:center;border: 1px solid #1890ff;color: #1890ff;border-radius: 4px;cursor: pointer;padding: 0 10px;" slot="tabBarExtraContent" @click="addSetting">
													新增阶段
												</div>
											</a-tabs>
										</a-form-item>
										<a-form-item style="margin-bottom: 0;padding-bottom: 10px;">
											<div style="height: 20px;border-bottom: 1px solid #E0E0E0;"></div>
											<div style="margin: 10px 25% 0;">
												<a-button type="primary" @click="submit" :loading="createLoading">
													提交
												</a-button>
											</div>
										</a-form-item>
									</a-form>
								</div>
							</div>

						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>
		<!-- 企业微信选择弹窗 -->
		<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="group-add"></wxModal>
		<!-- 选择成员组件 -->
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum" :departmentDisabled="1" :is_from="5" :is_external="1" noticeTitle="只显示具有外部联系人权限的成员"
		                  :callback="modalVisibleChange3"></chooseDepartment>
	</div>
</template>

<script>
	import wxModal from "@/components/WeChatModal.vue"
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import img from '../../../assets/chat.png'
	import vuedraggable from "vuedraggable"
	import editor from '../../../components/editor/index'
	import axios from "axios";
	import moment from "moment";

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()


	export default {
		components: {
			wxModal, corpChooseTag, vuedraggable, editor, chooseDepartment
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				img,
				commonUrl          : this.$store.state.commonUrl,
				wxInfo             : [], //微信公众号列表
				corpId             : corpId,
				avatarImg          : "", //微信公众号头像
				// 应用id
				agent_id           : [],
				agentList          : [], // 应用列表
				showModal2         : false, //公众号组件弹窗显示与隐藏
				isLoading          : false, //Loading 组件显示与隐藏
				activeType         : 2,//1永久有效，2固定区间
				startDate          : null,  // 活动开始时间
				endDate            : null,  // 活动结束时间
				endDate2           : null,  // 活动结束时间
				msg_title          : '',//二维码名称
				rule               : '',//活动规则
				clockInType        : 1,//打卡类型
				status             : 0,//活动状态，0未开始1进行中2已结束
				activeKey          : 1,//第几阶段，从1开始
				clockInList        : [
					{
						id                 : 0,
						key                : 1,
						days               : '',//打卡天数
						type               : 1,//奖品类型
						reward_name        : '',//奖品名称
						reward_type        : 1,//领奖方式
						money_amount       : 0.3,//红包金额
						user_keys          : [],    // 客服id
						userKeyNum         : 0,     // 客服总人数
						chooseUserNum      : 0,//成员个数
						chooseDepartmentNum: 0,//部门个数
						is_open            : true,//true开，false关
					}
				],
				createLoading      : false,//提交按钮的loading
				urlId              : '',//编辑对象id
				moment,
				showModalDepartment: false,//选择成员弹窗的显示与隐藏
				chooseNum          : 0,     // 成员插件成员个数
				chooseIndex        : 0,//正在操作的阶段的index
			}
		},

		methods: {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push('/group/clockIn')
			},
			disabledDate (current) {
				return current && current < moment().startOf('day');
			},
			disabledDate2 (current) {
				if (this.endDate2 != null) {
					let time = null
					if (this.status != 0) {
						//发布后
						time = this.endDate2
					} else {
						time = this.startDate
					}
					return current && current.valueOf() < time.valueOf();
				} else {
					return current && current < moment().startOf('day');
				}
			},
			// 活动添加开始时间改变
			changeStartTime (date, dateString) {
				if (dateString && this.startDate && dateString > moment(this.endDate).format("YYYY-MM-DD HH:mm")) {
					this.$message.destroy()
					this.$message.warning('开始时间不能晚于结束时间')
				}
				if (dateString) {
					this.startDate = date
				} else {
					this.startDate = null
				}
			},
			// 活动添加结束时间改变
			changeEndTime (date, dateString) {
				if (dateString && this.startDate && dateString < moment(this.startDate).format("YYYY-MM-DD HH:mm")) {
					this.$message.destroy()
					this.$message.warning('结束时间不能早于开始时间')
				}
				if (dateString) {
					this.endDate = date
				} else {
					this.endDate = null
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
			//打卡任务设置
			onEdit (targetKey, action) {
				this[action](targetKey);
			},
			addSetting () {
				const panes = this.clockInList;
				let newTabIndex = Number(this.clockInList[this.clockInList.length - 1].key)
				const activeKey = ++newTabIndex;
				panes.push({
					id                 : 0,
					key                : activeKey,
					days               : '',//打卡天数
					type               : 1,//奖品类型
					reward_name        : '',//奖品名称
					reward_type        : 1,//领奖方式
					money_amount       : 0.3,//红包金额
					user_keys          : [],    // 客服id
					userKeyNum         : 0,     // 客服总人数
					chooseUserNum      : 0,//成员个数
					chooseDepartmentNum: 0,//部门个数
					is_open            : true,//true开，false关
				});
				this.clockInList = panes;
				this.activeKey = activeKey;
			},
			remove (targetKey) {
				if (this.clockInList.length > 1) {
					let activeKey = this.activeKey;
					let lastIndex;
					this.clockInList.forEach((pane, i) => {
						if (pane.key === targetKey) {
							lastIndex = i - 1;
						}
					});
					const panes = this.clockInList.filter(pane => pane.key !== targetKey);
					if (panes.length && activeKey === targetKey) {
						if (lastIndex >= 0) {
							activeKey = panes[lastIndex].key;
						} else {
							activeKey = panes[0].key;
						}
					}
					this.clockInList = panes;
					this.activeKey = activeKey;
				} else {
					this.$message.warning("必须存在一个打卡任务")
					return false
				}
			},
			// 选择成员
			showDepartmentList (index) {
				this.chooseNum = this.clockInList[index].userKeyNum
				this.chooseIndex = index
				let arr = []
				this.clockInList[index].user_keys.map(x => {
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.clockInList[index].user_keys))
				this.showModalDepartment = true
			},
			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.clockInList[this.chooseIndex].userKeyNum = parseInt(userNum) + parseInt(departmentNum)
					this.clockInList[this.chooseIndex].chooseUserNum = userNum
					this.clockInList[this.chooseIndex].chooseDepartmentNum = departmentNum
					this.clockInList[this.chooseIndex].user_keys = list
				}
				this.showModalDepartment = false
			},
			//更换企业微信
			add () {
				if (this.$route.query.id) {
					return
				}
				this.showModal2 = true
				this.isLoading = true;
			}
			,
			// 企业微信弹窗确认
			modalVisibleChange (event, corpId, corpName) {
				if (event == "ok" && this.corpId != corpId) {
					this.corpId = corpId
					this.isLoading = false;
					this.showModal2 = false
					this.msg_title = ''
				} else {
					this.isLoading = false;
					this.showModal2 = false
				}
			}
			,
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
				}
			},
			//提交
			async submit () {
				if (typeof this.agent_id == 'object' && this.agent_id.length == 0) {
					this.$message.warning("请选择应用")
					return false
				}
				if (this.activeType == 2) {
					if (this.startDate == null || this.endDate == null) {
						this.$message.warning("请选择活动时间")
						return false
					} else {
						if (this.status != 0) {
							if (this.endDate.valueOf() < this.endDate2.valueOf()) {
								this.$message.warning("发布后活动时间只能延长")
								return false
							}
						}
					}
				}
				if (this.msg_title == '') {
					this.$message.warning("请填写活动名称")
					return false
				}
				if (this.rule == '') {
					this.$message.warning("请填写活动规则")
					return false
				}
				let hasOneOpen = false
				for (let i = 0; i < this.clockInList.length; i++) {
					if (this.clockInList[i].is_open) {
						hasOneOpen = true
					}
				}
				if (!hasOneOpen) {
					this.$message.warning("请开启第一阶段打卡任务")
					return false
				}

				for (let i = 0; i < this.clockInList.length; i++) {
					if (this.clockInList[i].days == '' || this.clockInList[i].days == null) {
						if (this.clockInType == 1) {
							this.$message.warning("请填写第" + (i + 1) + "阶段连续打卡天数")
							return false
						} else if (this.clockInType == 2) {
							this.$message.warning("请填写第" + (i + 1) + "阶段累计打卡天数")
							return false
						}
					} else {
						if (typeof this.clockInList[i] != 'undefined' && typeof this.clockInList[i].days != 'undefined' && typeof this.clockInList[i - 1] != 'undefined' && typeof this.clockInList[i - 1].days != 'undefined') {
							if (this.clockInList[i].days <= this.clockInList[i - 1].days) {
								this.$message.warning("第" + (i + 1) + "阶段打卡天数必须大于前一阶段")
								return false
							}
						}
					}
					if (this.clockInList[i].type == 1) {
						//实物
						if (this.clockInList[i].reward_name == '' || this.clockInList[i].reward_name == null) {
							this.$message.warning("请填写第" + (i + 1) + "阶段奖品名称")
							return false
						}
						if (this.clockInList[i].reward_type == 1) {
							//联系客服
							if (this.clockInList[i].userKeyNum == 0 || this.clockInList[i].user_keys.length == 0) {
								this.$message.warning("请选择第" + (i + 1) + "阶段员工")
								return false
							}
						}
					} else if (this.clockInList[i].type == 2) {
						//红包
						if (this.clockInList[i].money_amount == '' || this.clockInList[i].money_amount == null) {
							this.$message.warning("请填写第" + (i + 1) + "阶段红包金额")
							return false
						}
						if (this.clockInList[i].userKeyNum == 0 || this.clockInList[i].user_keys.length == 0) {
							this.$message.warning("请选择第" + (i + 1) + "阶段员工")
							return false
						}
					}
				}

				// this.createLoading = true
				const {data: res} = await this.axios.post('work-group-clock-activity/add', {
					id         : this.urlId,
					corp_id    : this.corpId,
					agent_id   : this.agent_id,
					title      : this.msg_title,
					type       : this.activeType,
					start_time : this.startDate != null ? this.startDate.format("YYYY-MM-DD HH:mm") : '',
					end_time   : this.endDate != null ? this.endDate.format("YYYY-MM-DD HH:mm") : '',
					rule       : this.rule,
					choose_type: this.clockInType,
					task       : this.clockInList,
				})
				if (res.error != 0) {
					this.createLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.createLoading = false
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					if (typeof this.urlId != "undefined") {
						//编辑
						this.$router.push("/group/clockIn?isRefresh=1")
					} else {
						//新建
						this.$router.push("/group/clockIn")
					}
				}
			},
			//点击修改进入页面，获取详情
			async getDetail () {
				this.isLoading = true;
				const {data: res} = await this.axios.post('work-group-clock-activity/detail', {
					id: this.urlId
				})
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg)
				} else {
					this.corpId = res.data.corp_id
					this.agent_id = String(res.data.agent_id)
					this.activeType = res.data.type
					this.startDate = null
					this.endDate = null
					this.endDate2 = null
					if (this.activeType == 2) {
						this.startDate = res.data.start_time != null && res.data.start_time != '' ? moment(res.data.start_time) : null
						this.endDate = res.data.end_time != null && res.data.end_time != '' ? moment(res.data.end_time) : null
						this.endDate2 = res.data.end_time != null && res.data.end_time != '' ? moment(res.data.end_time) : null
					}
					this.msg_title = res.data.title
					this.rule = res.data.rule
					this.clockInType = res.data.choose_type
					this.status = res.data.status
					this.clockInList = res.data.task
					this.clockInList.map((x, index) => {
						x.reward_type = Number(x.reward_type)
						x.type = Number(x.type)
						x.userKeyNum = x.user_keys.length
						x.key = index
						x.chooseUserNum = 0
						x.chooseDepartmentNum = 0
						if(x.user_keys.length > 0){
							x.user_keys.map(y=>{
								if(y.scopedSlots.title == 'custom'){
									x.chooseUserNum++
								}else if(y.scopedSlots.title == 'title'){
									x.chooseDepartmentNum++
								}
							})
						}
					})
					this.activeKey = 0
					this.isLoading = false;
				}
			},
		},
		created () {
			this.urlId = this.$route.query.id
			const _this = this
			this.$store.dispatch("getWx", info => {
				_this.wxInfo = info
				this.getAgentList()
			})
			if (typeof this.urlId != "undefined") {
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/group/autoCreate')
				this.getDetail()
			}
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.content-msg {
		width: 372px;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
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
		min-width: 760px;
		position: absolute;
		top: 20px;
		left: 20px;
		right: 20px;
		background-color: #FAFAFA;
		margin-bottom: 20px;
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
		background: #F5F5F5;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		/*margin: 0 5px;*/
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #1890FF;
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

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
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

	.wrap {
		border: 1px solid #E2D6D6;
		margin: auto;
		height: 100%;
		width: 100%;
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
	}

	/deep/ .ant-form-item {
		padding: 5px 0px;
	}

	.pull-right {
		width: 560px;
		max-height: 630px;
		height: 290px;
		background: #FFF;
		border: 1px solid #D8D8D8;
		padding: 24px;
		overflow: hidden;
	}

	/deep/ .ant-checkbox-wrapper {
		width: 100%;
		border-bottom: 1px dashed #E9E9E9;
		padding: 10px 0;
	}

	/deep/ .ant-checkbox {
		float: right;
		margin-top: 12px;
	}

	.noMore {
		text-align: center;
		padding: 10px 0;
		font-size: 12px;
		color: #999;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card {
		width: 64px;
		height: 64px;
		margin: 0;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0;
	}

	.dataTabble {
		margin-right: 15px;
		border: 1px solid #E8E8E8;
		width: calc(100% - 15px);

		thead {
			background: #FAFAFA;

			tr:hover {
				background: none;
			}
		}

		thead, tr {
			border-bottom: 1px solid #E8E8E8;
		}

		tr:last-child {
			border: 0;
		}

		tr:hover {
			background: #E6F7FF;
		}

		tr {
			th, td {
				width: 25%;
				padding: 5px 10px;
			}

			th:first-child, td:first-child {
				width: 40%;
				padding: 5px 10px;
			}

			th:last-child, td:last-child {
				width: 10%;
				padding: 5px 10px;
			}
		}
	}

	/deep/ .ant-tag {
		margin-right: 5px;
		height: 26px;
		line-height: 25px;
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

	/deep/ .ant-upload-picture-card-wrapper {
		width: auto;
		float: left;
	}

	.link_pic_url_style /deep/ .ant-upload.ant-upload-select-picture-card {
		width: 96px;
		height: 96px;
		overflow: hidden;
		float: left;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0;
	}

</style>