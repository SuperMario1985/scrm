<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden">
				<a-layout style="position: absolute;top:0;bottom:0;left:0;right:0;overflow-x: hidden; overflow-y: auto;"
				          class="scroll">
					<!-- 头部 -->
					<a-layout-header>{{joinTitle}}
						<a-button type="primary" 
						          style="float: right;margin-top: 9px;" @click="goBack">返回列表
						</a-button>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<!--						<div class="content-msg">-->
						<!--							玩法：用户拆裂变红包时，会获得首拆红包金额，并立刻入账至用户的微信零钱里，此时在规定时间内，若分享给好友帮拆，好友可获得金额不等的红包作为奖励，即刻到账。当凑齐了相应的好友人数，用户可以获得剩下的红包。反之，如果用户没有分享领取完的话，裂变的红包剩余金额在超过规定时间后则会失效。-->
						<!--							<p style="margin: 10px 0 2px;color: red;">-->
						<!--								商户需完成以下配置，才能使用派发红包功能：：-->
						<!--							</p>-->
						<!--							<p style="margin-bottom: 2px;">-->
						<!--								1、前往<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"-->
						<!--								       target="_blank">【微信支付商户平台】</a>注册微信支付商户号-->
						<!--							</p>-->
						<!--						</div>-->
						<div class="content-hd">
							<a-col style="float:left;">
								<a-input @keyup.enter="getJoinList(1, pageSize)"
								         style="width: 180px;margin-right: 5px;" placeholder="查找打卡人"
								         v-model="joinName"/>
								<a-select v-model="writeStatus" style="width: 120px;margin-right: 10px;"
								          placeholder="填写状态">
									<a-select-option :value="0">全部</a-select-option>
									<a-select-option :value="1">未填写</a-select-option>
									<a-select-option :value="2">已填写</a-select-option>
								</a-select>
								<a-select v-model="sendStatus" style="width: 120px;margin-right: 10px;"
								          placeholder="发放状态">
									<a-select-option :value="0">全部</a-select-option>
									<a-select-option :value="1">未发放</a-select-option>
									<a-select-option :value="2">已发放</a-select-option>
								</a-select>
								<a-button type="primary" style="margin: 0px 10px;" @click="find">查询</a-button>
								<a-button @click="clear">重置</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="joinList" :pagination="false"
								         :rowClassName="rowClassName">
									<template slot="checkedBox" slot-scope="text, record, index">
										<a-checkbox style="float: right"
										            v-model="checkBoxValue[index]"
										            @click="changeSelectKey(record.key)"></a-checkbox>
									</template>
									<template slot="info" slot-scope="text, record">
										<div style="overflow: hidden;">
											<a-avatar v-if="record.avatar" shape="square" :size="42"
											          :src="record.avatar"
											          style="float: left;"/>
											<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
											     src="../../../assets/useradvart.png"/>
											<div style="float: left;margin-left:10px;line-height: 42px;max-width: calc(100% - 52px);width: 194px;">
												<div style="height:42px;white-space: nowrap;text-overflow: ellipsis; overflow: hidden;">
													<a-popover placement="top">
														<template slot="content">
															{{record.name}}
															<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="record.corp_name != null">@{{record.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
														</template>
														<span style="">
														{{record.name}}
														<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="record.corp_name != null">@{{record.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
													</span>
													</a-popover>
													<a-icon type="man"
													        style="color: #427EBA;vertical-align: top;margin-top: 14px;"
													        v-if="record.gender==1"/>
													<a-icon
															type="woman"
															style="color: #ED4997;vertical-align: top;margin-top: 14px;"
															v-if="record.gender==2"
													/>
												</div>
											</div>
										</div>
									</template>
									<template slot="task" slot-scope="text, record">
										<p v-for="item in text" v-if="text.length > 0" style="margin-bottom: 0;">
											<template v-if="item.status == 0">
												距离
												<span v-if="item.choose_type == 1">连续</span>
												<span v-if="item.choose_type == 2">累计</span>签到
												<span style="color: red;">{{item.days}}</span>天，还需{{item.last_days}}天，即可获得
												<span v-if="item.type == 1">【{{item.reward_name}}】</span>
												<span v-if="item.type == 2">【{{item.money_amount}}】元红包</span>
											</template>
											<template v-if="item.status != 0">
												<span v-if="item.choose_type == 1">连续</span>
												<span v-if="item.choose_type == 2">累计</span>签到<span style="color: red;">{{item.days}}</span>天任务完成
												<span v-if="item.is_del == 1">【已删除】</span>，获得
												<span v-if="item.type == 1">【{{item.reward_name}}】</span>
												<span v-if="item.type == 2">【{{item.money_amount}}】元红包</span>--
												<template v-if="item.is_show == 1">
													<span v-if="item.is_add == 0">未填写</span>
													<span v-if="item.is_add == 1">已填写【<span
															@click="e=>lookAddress(e,record.key)"
															style="color: #01b065;cursor: pointer;">查看</span>】</span>--
												</template>
												<span v-if="item.status == 1">未发放</span>
												<span v-if="item.status == 2">已发放</span>
											</template>
										</p>
										<div v-if="text.length == 0">--</div>
									</template>
									<template slot="action" slot-scope="text, record, index" style="width: 150px;">
										<a-button style="margin: 0 5px 5px 0"
										          @click="lookDetail(record.key,record.name)" v-has="'groupClockIn-detail-list'">打卡明细
										</a-button>
										<a-dropdown v-if="record.task.length > 0" v-has="'groupClockIn-detail-send'">
											<a-menu slot="overlay" @click="e=>handleSendType(e,record)">
												<a-menu-item :key="item.task_id" v-for="(item,index) in record.task"
												             :disabled="item.status != 1">
													<template v-if="item.status == 2">已发{{index+1}}阶奖品</template>
													<template v-else>{{index+1}}阶奖品</template>
												</a-menu-item>
											</a-menu>
											<a-button v-if="record.task.length > 0" v-has="'groupClockIn-detail-send'">发放
												<a-icon type="down"/>
											</a-button>
										</a-dropdown>
									</template>
								</a-table>

								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0">
									<div style="height: 32px;line-height: 32px;margin-bottom: 10px;padding-left: 10px;">
										<a-checkbox v-model="batchTypeValue"
										            @click="batchTypeChange"></a-checkbox>
										<a-select optionFilterProp="children"
										          v-model="batchType"
										          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
											<a-select-option value="0">选择当前页</a-select-option>
											<a-select-option value="1">选择所有</a-select-option>
										</a-select>
										<a-dropdown :disabled="selectedRowKeys.length == 0" v-has="'groupClockIn-detail-send'">
											<a-menu slot="overlay" @click="e=>handleManySendType(e)">
												<a-menu-item :key="item.task_id" v-for="(item,index) in taskData">
													{{item.name}}
												</a-menu-item>
											</a-menu>
											<a-button v-has="'groupClockIn-detail-send'">批量发放
												<a-icon type="down"/>
											</a-button>
										</a-dropdown>
									</div>
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total}}</span>条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
										              :current="page"
										              :pageSize="pageSize" :pageSizeOptions="['2','15','30','50','100']"
										              @change="changePage"
										              @showSizeChange="showSizeChange"/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>

					<!--打卡明细抽屉-->
					<a-drawer
							placement="right"
							:closable="false"
							@close="detailClose"
							:visible="detailVisible"
					>
						<template slot="title">
							{{detailName}}
						</template>
						<div style="padding: 10px;">
							<div class="detail-one">
								<div class="detail-one-left">
									<div>总打卡天数：</div>
									<div><span>{{detailDays}}</span>天</div>
								</div>
								<div class="detail-one-right">
									<div>最近打卡时间：{{detailNowTime}}</div>
									<div>首次打卡时间：{{detailJoinTime}}</div>
								</div>
							</div>
							<div class="detail-one" style="margin-top: 20px;">
								<div>连续打卡任务：</div>
								<span class="detail-box" v-for="item in detailTask">
									<template v-if="item.status == 0">
										距离<template v-if="item.choose_type == 1">连续</template>
									<template v-if="item.choose_type == 2">累计</template>签到<span style="color: red;">{{item.days}}</span>天还需{{item.last_days}}天
									</template>
									<template v-if="item.status != 0">
									<template v-if="item.choose_type == 1">连续</template>
										<template v-if="item.choose_type == 2">累计</template>签到<span style="color: red;">{{item.days}}</span>天任务完成
									</template>
								</span>
							</div>
							<div style="margin-top: 20px;color: red;">
								<p style="margin-bottom: 0;">数值显示黑色，代表打卡活动可参与的时间范围</p>
								<p style="margin-bottom: 0;">若打卡成功，在当日标记显示“已打卡”</p>
							</div>
							<div :style="{ marginTop: '20px', border: '1px solid #d9d9d9', borderRadius: '4px', marginBottom: '120px' }">
								<a-calendar :fullscreen="false" :disabled-date="disabledDate"
								            :validRange="[moment(detailStartTime),moment(detailEndTime)]">
									<div slot="dateCellRender" slot-scope="value" style="margin-top: 5px;"
									     v-if="detailDate.indexOf(value.format('YYYY-MM-DD')) > -1">
										<a-badge :dot="detailDate.indexOf(value.format('YYYY-MM-DD')) > -1">
											<a-tag color="green" style="margin:0;">已打卡</a-tag>
										</a-badge>
									</div>
								</a-calendar>
							</div>
						</div>
						<div
								:style="{
          position: 'absolute',
          right: 0,
          bottom: '63px',
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#FFF',
          textAlign: 'right',
          zIndex: 1,
        }"
						>
							<a-button :style="{ marginRight: '8px' }" @click="detailClose">
								关闭
							</a-button>
						</div>
					</a-drawer>

					<!--地址弹窗-->
					<a-modal :title="'【'+ addressTitle +'】地址'" v-model="addressVisible" class="address-model">
						<template slot="footer">
							<a-button key="back" @click="addressCancel">关闭</a-button>
						</template>
						<a-col class="address-col">
							<label style="margin-right: 5px;">姓名：</label>
							<span v-if="addressData.name != ''">{{addressData.name}}</span>
							<span v-else>暂无</span>
						</a-col>
						<a-col class="address-col">
							<label style="margin-right: 5px;">手机号：</label>
							<span v-if="addressData.mobile != ''">{{addressData.mobile}}</span>
							<span v-else>暂无</span>
						</a-col>
						<a-col class="address-col">
							<label style="margin-right: 5px;">所在区域：</label>
							<span v-if="addressData.region != '' && addressData.city != '' && addressData.county != ''">{{addressData.region}}-{{addressData.city}}-{{addressData.county}}</span>
							<span v-else>暂无</span>
						</a-col>
						<a-col class="address-col">
							<label style="margin-right: 5px;">详细地址：</label>
							<span v-if="addressData.detail != ''">{{addressData.detail}}</span>
							<span v-else>暂无</span>
						</a-col>
						<a-col class="address-col">
							<label style="margin-right: 5px;">备注：</label>
							<span v-if="addressData.remark != ''">{{addressData.remark}}</span>
							<span v-else>暂无</span>
						</a-col>
					</a-modal>

				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import MyIcon from "@/components/MyIcon.vue"
	import moment from "moment";

	// 活动列表
	// 参与人打卡列表
	const columns = [
		{
			title      : "",
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			scopedSlots: {customRender: "checkedBox"}
		},
		{
			title      : "打卡人",
			dataIndex  : "info",
			key        : "info",
			scopedSlots: {customRender: "info"}
		},
		{
			title    : "最近打卡时间",
			dataIndex: "e_time",
			key      : "e_time",
		},
		{
			title    : "首次打卡时间",
			dataIndex: "s_time",
			key      : "s_time",
		},
		{
			title    : "总打卡天数",
			dataIndex: "total_days",
			key      : "total_days"
		},
		{
			title    : "历史最高连续打卡天数",
			dataIndex: "continue_days",
			key      : "continue_days",
		},
		{
			title      : "获得奖励",
			dataIndex  : "task",
			key        : "task",
			scopedSlots: {customRender: "task"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "groupJoinList",
		components: {MyIcon},
		data () {
			return {
				//打卡人列表
				joinId         : '',//正在打开的参与人列表的活动id
				joinTitle      : '',//正在打开的参与人列表的活动标题
				columns,
				moment,
				joinName       : '',//搜索值
				writeStatus    : 0,//填写状态
				sendStatus     : 0,//发放状态
				isLoading      : false,//打卡人列表弹窗的加载
				joinList       : [],
				total          : 0, //总条数
				quickJumper    : false, // 是否显示快速跳转的控件
				page           : 1, //页码
				pageSize       : 15, //每页数据条数
				selectedRowKeys: [], // 选择多少条
				batchType      : '1',     // 0当前页 1所有
				batchTypeValue : false, // 当前页/所有 是否选中
				checkBoxValue  : [], // 多选框状态
				joinKeys       : [], // 所有的参与人id
				taskData       : [],//批量发放的阶段信息
				//打卡明细抽屉
				detailVisible  : false,//抽屉的显示与隐藏
				detailName     : '',//打卡人名称
				detailDays     : 0,//打卡天数
				detailJoinTime : '',//参与打卡时间
				detailNowTime  : '',//最近打卡时间
				detailTask     : [],//打卡任务
				detailDate     : [],//已打卡时间
				detailStartTime: '',//活动开始时间
				detailEndTime  : '',//活动结束时间
				//地址弹窗
				addressVisible : false,//地址弹窗的显示与隐藏
				addressData    : [],//地址信息
				addressTitle   : '',//谁的地址
			};
		},

		methods: {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push('/group/clockIn?isRefresh=1')
			},
			// 卡片选择
			changeSelectKey (chatId) {
				for (let i = 0; i < this.selectedRowKeys.length; i++) {
					if (chatId == this.selectedRowKeys[i]) {
						this.selectedRowKeys.splice(i, 1)
						this.setCheckedBox(this.joinList)
						return false
					}
				}
				this.selectedRowKeys.push(chatId)
				this.setCheckedBox(this.joinList)
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					// 添加
					if (this.batchType == 0) {
						this.addKey(this.joinList)
						this.setCheckedBox(this.joinList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = [...this.joinKeys.valueOf()]
						this.setCheckedBox(this.joinList)
					}
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						this.removeKey(this.joinList)
						this.setCheckedBox(this.joinList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
						this.setCheckedBox(this.joinList)
					}
					this.batchTypeValue = false
				}
			},
			// 设置列表卡片多选框选中状态
			setCheckedBox (joinList) {
				this.checkBoxValue = new Array(joinList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < joinList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (joinList[i].key == this.selectedRowKeys[j]) {
							this.checkBoxValue[i] = true
						}
					}
				}
				if (this.batchType == 0) {
					this.batchTypeValue = true
					this.checkBoxValue.map(item => {
						if (!item) {
							this.batchTypeValue = false
						}
					})
				} else {
					if (this.selectedRowKeys.length == this.joinKeys.length) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}
			},
			// 当前/所有 类型选择框变化
			changeBatchType () {
				if (this.batchTypeValue) {
					if (this.batchType == 0) {
						this.selectedRowKeys = []
					}
					this.batchTypeValue = false
					this.batchTypeChange()
				} else {
					this.setCheckedBox(this.joinList)
				}
			},
			// 增加当前页key
			addKey (joinList) {
				for (let i = 0; i < joinList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === joinList[i].key);
					if (index == -1) {
						this.selectedRowKeys.push(joinList[i].key)
					}
				}
			},
			// 删除当前页key
			removeKey (joinList) {
				for (let i = 0; i < joinList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === joinList[i].key);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			async getJoinList (page = 1, pageSize = this.pageSize) {
				const {data: res} = await this.axios.post("work-group-clock-activity/join-list", {
					id          : this.joinId,
					name        : this.joinName,
					write_status: this.writeStatus,
					send_status : this.sendStatus,
					page        : page,
					page_size   : pageSize,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.joinList = res.data.info
					this.joinKeys = res.data.all_ids
					this.taskData = res.data.taskData
					this.total = parseInt(res.data.count);
					this.setCheckedBox(this.joinList)
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getJoinList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 280)
				})
			},
			showSizeChange (page, pageSize) {
				this.getJoinList(1, pageSize);
			},
			// 点击搜索
			find () {
				this.getJoinList()
			},
			// 点击清空
			clear () {
				this.joinName = ''
				this.writeStatus = 0
				this.sendStatus = 0
				this.getJoinList()
			},
			//查看打卡明细
			async lookDetail (id, name) {
				this.detailName = name
				const {data: res} = await this.axios.post("work-group-clock-activity/card-detail", {
					join_id: id,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.detailDays = res.data.total_days
					this.detailJoinTime = res.data.first_time
					this.detailNowTime = res.data.new_time
					this.detailStartTime = res.data.start_time
					this.detailEndTime = res.data.end_time
					this.detailTask = res.data.task
					this.detailDate = []
					res.data.data.map(x => {
						this.detailDate.push(x.date)
					})
					this.detailVisible = true
				}
			},
			detailClose () {
				this.detailVisible = false
			},
			//选择发放阶段
			handleSendType (e, record) {
				let that = this
				that.$confirm({
					title: '确定发放奖品?',
					onOk () {
						that.send(e.key, record.key)
					},
					onCancel () {
					},
				});
			},
			async send (id, key) {
				const {data: res} = await this.axios.post("work-group-clock-activity/give-product", {
					join_id: key,
					task_id: id,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('奖品发放成功')
					setTimeout(() => {
						this.getJoinList()
					}, 2000);
				}
			},
			disabledDate (current) {
				return null;
			},
			//批量发放
			handleManySendType (e) {
				let that = this
				that.$confirm({
					title: '确定批量发放奖品?',
					onOk () {
						that.manySend(e.key)
					},
					onCancel () {
					},
				});
			},
			async manySend (id) {
				const {data: res} = await this.axios.post("work-group-clock-activity/give-more", {
					join_ids   : this.selectedRowKeys,
					task_id    : id,
					activity_id: this.joinId,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.selectedRowKeys = [];
					this.checkBoxValue = [];
					this.batchTypeValue = false
					this.batchType = '1'
				} else {
					this.$message.success(res.data.textHtml)
					this.selectedRowKeys = [];
					this.checkBoxValue = [];
					this.batchTypeValue = false
					this.batchType = '1'
					setTimeout(() => {
						this.getJoinList()
					}, 2000);
				}
			},
			//查看地址
			async lookAddress (e, key) {
				const {data: res} = await this.axios.post("work-group-clock-activity/get-address", {
					join_id: key,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.addressData = res.data
					this.addressTitle = res.data.title
					this.addressVisible = true
				}
			},
			addressCancel () {
				this.addressVisible = false
			}
		},

		mounted () {
			this.joinId = this.$route.query.joinId
			this.joinTitle = this.$route.query.joinTitle
			//不允许修改企业微信或公众号
			localStorage.setItem('notAllow', 1)
			localStorage.setItem('backUrl', '/group/clockIn')
			this.getJoinList()
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}


	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
		border-right: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.btn-primary {
		margin-left: 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 90px;
		margin: 0px;
		text-align: center;
	}

	/deep/ .ant-modal-body {
		height: 500px;
	}

	.detail-one {
		border: 1px solid #91D5FF;
		color: #01b065;
		background: #E6F7FF;
		overflow: hidden;
		padding: 20px;
	}

	.detail-one-left {
		float: left;
		text-align: center;
		border-right: 1px solid #91D5FF;
		padding-right: 20px;
	}

	.detail-one-right {
		float: left;
		padding-left: 20px;
	}

	.detail-box {
		display: inline-block;
		width: 49%;
		margin-top: 8px;
		padding: 3px 8px;
		border: 1px solid #D2D2D2;
		border-radius: 5px;
		background: #FFF;
		color: #666;
	}

	.detail-box:nth-child(2n) {
		margin-right: 2%;
	}

	/deep/ .ant-fullcalendar-header .ant-radio-group {
		display: none;
	}

	.address-col {
		margin-bottom: 10px;
	}

	.address-model /deep/ .ant-modal-body {
		height: 200px;
	}

	/deep/ .ant-fullcalendar-selected-day .ant-fullcalendar-value, .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value {
		color: #01b065;
		background: transparent;
	}
</style>
