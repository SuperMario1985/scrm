<template>
	<div style="position: absolute;left: 0;top: 0;right: 0;background: #FFF;">
		<a-spin tip="Loading..." size="large" :spinning="isLoading">
			<div class="view-title">{{title}}
				<a-button type="primary" style="float: right; margin: 9px 20px 0 0;" icon="rollback" @click="rollback">
					返回列表
				</a-button>
			</div>
			<div style="padding: 20px;">
				<ul class="statistics-ul">
					<li>
						<p>今日新增拉新人数</p>
						<p class="number" style="color: #3B74FF;">{{newMemberToday}}人</p>
						<p class="count">累计：{{newMemberAll}}人</p>
					</li>
					<li>
						<p>今日领取金额</p>
						<p class="number" style="color: #FF562D;">￥{{receiveTodaySum}}</p>
						<p class="count">累计：￥{{receiveAllSum}}</p>
					</li>
					<li>
						<p>今日领取人数</p>
						<p class="number" style="color: #3B74FF;">{{receiveTodayNum}}人</p>
						<p class="count">累计：{{receiveAllNum}}人</p>
					</li>
					<li>
						<p>今日未领取金额</p>
						<p class="number" style="color: #FF562D;">￥{{notReceiveTodaySum}}</p>
						<p class="count">累计：￥{{notReceiveAllSum}}</p>
					</li>
					<li>
						<p>今日未领取人数</p>
						<p class="number" style="color: #3B74FF;">{{notReceiveTodayNum}}人</p>
						<p class="count">累计：{{notReceiveAllNum}}人</p>
					</li>
					<li>
						<p>当前剩余可发放总金额
							<a-tooltip placement="right">
								<template slot="title">
									<span>当前剩余可发放总金额 = 投放总金额 - 已领取 - 未领取 - 已过期</span>
								</template>
								<a-icon type="question-circle" style="margin-left:5px;"/>
							</a-tooltip>
						</p>
						<p class="number" style="color: #FF562D;">￥{{leftAmount}}</p>
						<p class="count">投放总金额：￥{{redpacketAmount}}</p>
					</li>
				</ul>
				<!--折线图-->
				<div class="all-card-calendar">
					<div class="card-caledar">
						<div class="day-picker-contain picker-contain">
							<a-button :class="timeType== '1'? 'caledar-btn-selected': '' "
							          @click="changeFansTimeType1(1)">
								按日
							</a-button>
							<a-range-picker
									:allowClear='false'
									:disabledDate="disabledDateDay"
									:defaultValue="[moment(moment().subtract(30, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
									format="YYYY-MM-DD"
									v-if="timeType=='1'"
									@change="changeFansTime1"
							/>
						</div>
						<div class="week-picker-contain picker-contain">
							<a-button :class="timeType== '2'? 'caledar-btn-selected': '' "
							          @click="changeFansTimeType1(2)">
								按周
							</a-button>
							<a-week-picker
									:allowClear='false'
									:value='weekStart'
									:disabledDate="disabledDateWeek"
									v-if="timeType=='2'"
									@change="changeFansStartWeek1"
							/>
							<a-week-picker
									:allowClear='false'
									:value='weekEnd'
									:disabledDate="disabledDateWeek"
									v-if="timeType=='2'"
									@change="changeFansEndWeek1"
							/>
						</div>
						<div class="month-picker-contain picker-contain">
							<a-button :class="timeType== '3'? 'caledar-btn-selected': '' "
							          @click="changeFansTimeType1(3)">
								按月
							</a-button>
						</div>
					</div>
					<div class="sec-card-caledar down-text"
					     style="border-top: 0px;">
						<p style="margin-bottom: 0px;">
							这段时间里，共新增拉新人数
							<span>{{newMember}}</span>
							人、领取金额
							<span>{{receiveSum}}</span>
							元、领取人数
							<span>{{receiveNum}}</span>
							人、未领取金额
							<span>{{notReceiveSum}}</span>
							元、未领取人数
							<span>{{notReceiveNum}}</span>
							人
						</p>
					</div>
				</div>
				<LineCharts
						:options="fansInteractive" style="margin: 20px 0;"
				></LineCharts>
				<!--      表格-->
				<div style="overflow: hidden;margin-bottom: 20px;">
					<div style="float:left;">详细数据</div>
					<a-button type="primary" style="float:right;" @click="exportData" :loading=btnLoading>
						<icon-font type="icon-tuichu" v-show="!btnLoading"/>
						导出数据
					</a-button>
				</div>
				<a-table :columns="columns" :dataSource="timeData" :pagination="false" :rowClassName="rowClassName">
				    <span slot="new_member">
				        拉新人数
					    <!--					    <a-tooltip placement="right">-->
					    <!--							<template slot="title">-->
					    <!--								<span>新增的客户人数（同一个客户重复被添加会重复计算）</span>-->
					    <!--							</template>-->
					    <!--							<a-icon type="question-circle" style="margin-left:5px;"/>-->
					    <!--						</a-tooltip>-->
				    </span>
					<span slot="not_receive">
				        未领取金额/人数
						<!--						<a-tooltip placement="right">-->
						<!--							<template slot="title">-->
						<!--								<span>同一个员工重复被删除会重复计算</span>-->
						<!--							</template>-->
						<!--							<a-icon type="question-circle" style="margin-left:5px;"/>-->
						<!--						</a-tooltip>-->
				    </span>
					<span slot="receive">
				        已领取金额/人数
						<!--						<a-tooltip placement="right">-->
						<!--							<template slot="title">-->
						<!--								<span>员工删除的客户数（同一个客户重复被删除会重复计算）</span>-->
						<!--							</template>-->
						<!--							<a-icon type="question-circle" style="margin-left:5px;"/>-->
						<!--						</a-tooltip>-->
				    </span>
					<!--					<span slot="expired">-->
					<!--				        已过期金额/人数-->
					<!--												<a-tooltip placement="right">-->
					<!--													<template slot="title">-->
					<!--														<span>新增人数-被客户删除/拉黑人数</span>-->
					<!--													</template>-->
					<!--													<a-icon type="question-circle" style="margin-left:5px;"/>-->
					<!--												</a-tooltip>-->
					<!--				    </span>-->
					<span slot="newMember" slot-scope="text, record">
						{{record.new_member}}人
					</span>
					<span slot="notReceive" slot-scope="text, record">
						￥{{record.not_receive_sum}}（{{record.not_receive_num}}人）
					</span>
					<span slot="receiveInfo" slot-scope="text, record">
						￥{{record.receive_sum}}（{{record.receive_num}}人）
					</span>
					<!--					<span slot="expiredInfo" slot-scope="text, record">-->
					<!--						￥{{record.expired_sum}}（{{record.expired_num}}人）-->
					<!--					</span>-->
				</a-table>
				<div style="width: 100%;" v-show="total > 0">
					<div style="height: 32px;display: inline-block;margin-top: 25px;">
						共<span style="color: blue">{{total}}</span>条
					</div>
					<div class="pagination" style="margin-top: 20px;float: right;">
						<a-pagination :total="total" showSizeChanger
						              :showQuickJumper="quickJumper"
						              :current="page"
						              :pageSize="pageSize"
						              :pageSizeOptions="['10','20','30','60']"
						              @change="changeFansPage"
						              @showSizeChange="showFansSizeChange"/>
					</div>
				</div>
			</div>
		</a-spin>
	</div>
</template>

<script>
	import LineCharts from '../../../components/echarts/LineCharts'
	import moment from 'moment'
	import {Icon} from 'ant-design-vue';

	const IconFont = Icon.createFromIconfontCN({
		scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
	});

	const columns = [
		{
			title    : "时间",
			dataIndex: "time",
			key      : "time"
		},
		{
			dataIndex  : "new_member",
			key        : 'new_member',
			slots      : {title: "new_member"},
			scopedSlots: {customRender: "newMember"}
		},
		{
			dataIndex  : "receive_num",
			key        : "receive_num",
			slots      : {title: "receive"},
			scopedSlots: {customRender: "receiveInfo"}
		},
		{
			dataIndex  : "not_receive_num",
			key        : "not_receive_num",
			slots      : {title: "not_receive"},
			scopedSlots: {customRender: "notReceive"}
		},
		// {
		// 	dataIndex: "expired_num",
		// 	key      : "expired_num",
		// 	slots    : {title: "expired"},
		// 	scopedSlots: {customRender: "expiredInfo"}
		// },
	];

	export default {

		components: {
			LineCharts, IconFont
		},

		data () {
			return {
				urlId             : '',//地址栏的id
				corpId            : '',
				newMember         : 0, // 拉新人数
				receiveSum        : 0,  //领取金额
				receiveNum        : 0, // 领取人数
				notReceiveSum     : 0, //  未领取金额
				notReceiveNum     : 0, //  未领取人数
				newMemberToday    : '0', //今日新增拉新
				newMemberAll      : '0', //全部拉新
				receiveTodaySum   : '0', //今日领取金额
				receiveTodayNum   : '0', //今日领取人数
				receiveAllSum     : '0', //全部领取人数
				receiveAllNum     : '0', //全部领取人数
				notReceiveTodaySum: '0', //今日未领取金额
				notReceiveTodayNum: '0', //今日未领取人数
				notReceiveAllSum  : '0', //全部未领取人数
				notReceiveAllNum  : '0', //全部未领取人数
				expiredTodaySum   : '0', //今日过期金额
				expiredTodayNum   : '0', //今日过期人数
				expiredAllSum     : '0', //全部过期人数
				expiredAllNum     : '0', //全部过期人数
				redpacketAmount   : '0', //总投放金额
				leftAmount        : '0', //剩余金额
				statisticsList    : [],//统计列表
				timeType          : '1', //时间类型：1、天，2、周，3、月
				ds_date           : '',
				de_date           : '',
				weekStart         : moment().subtract(7, 'days'),
				weekEnd           : moment().subtract(7, 'days'),
				ws_date           : moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
				we_date           : moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
				ws_week           : moment(new Date()).week() - 1 || 52,
				is_export         : 0, //是否导出：0、否，1、是
				fansInteractive   : {
					legendData: [],
					xAxisData : [],
					seriesData: [],
				},
				title             : '',//页面标题
				columns,//表格
				timeDataList      : [],
				timeData          : [],//表格数据
				total             : 0,
				quickJumper       : false,
				page              : 1,
				pageSize          : 10,
				btnLoading        : false,//导出数据按钮的加载
				dateFormat        : 'YYYY-MM-DD',
				isLoading         : true, //Loading 组件显示与隐藏
			}
		},

		methods: {
			moment,
			rollback () {
				this.$router.push('/redForNew/list?isRefresh=1')
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 内容TOP10页码改变
			changeFansPage (val) {
				let that = this
				that.page = val
				let table = that.getPageData(that.timeDataList, that.page, that.pageSize)
				that.timeData = table.list
				that.page = table.page
				this.$nextTick(() => {
					if (document.getElementsByClassName('ant-layout').length > 1) {
						document.getElementsByClassName('ant-layout')[2].scrollTo(0, 700)
					}
				})
			},
			// 内容TOP10表格分页pageSize改变
			showFansSizeChange (page, pageSize) {
				let that = this
				that.pageSize = pageSize
				let table = that.getPageData(that.timeDataList, that.page, that.pageSize)
				that.timeData = table.list
				that.page = table.page
			},
			getPageData (list, page, pageSize) {
				let maxNum = page * pageSize;
				let minNum = (page - 1) * pageSize
				let pageData = {
					page: page,
					list: []
				}
				if (list.length == 0) {
					pageData.list = []
				} else {
					if (list.length < maxNum) {
						maxNum = list.length
					}
					if (minNum > list.length - 1) {
						if (list.length % pageSize != 0) {
							minNum = (parseInt(list.length / pageSize)) * pageSize
							pageData.page = parseInt(list.length / pageSize) + 1
						} else {
							minNum = (parseInt(list.length / pageSize) - 1) * pageSize
							pageData.page = parseInt(list.length / pageSize)
						}
					}
					for (let i = minNum; i < maxNum; i++) {
						pageData.list.push(list[i])
					}
				}
				return pageData
			},
			async getStatisticsSum () {
				const {data: res} = await this.axios.post(
					"work-contact-way-redpacket/redpacket-send-today",
					{
						id     : this.urlId,
						corp_id: this.corpId
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.isLoading = false
				} else {
					this.newMemberToday = res.data.newMemberToday
					this.newMemberAll = res.data.newMemberAll
					this.receiveTodaySum = res.data.receiveTodaySum
					this.receiveTodayNum = res.data.receiveTodayNum
					this.receiveAllSum = res.data.receiveAllSum
					this.receiveAllNum = res.data.receiveAllNum
					this.notReceiveTodaySum = res.data.notReceiveTodaySum
					this.notReceiveTodayNum = res.data.notReceiveTodayNum
					this.notReceiveAllSum = res.data.notReceiveAllSum
					this.notReceiveAllNum = res.data.notReceiveAllNum
					this.expiredTodaySum = res.data.expiredTodaySum
					this.expiredTodayNum = res.data.expiredTodayNum
					this.expiredAllSum = res.data.expiredAllSum
					this.expiredAllNum = res.data.expiredAllNum
					this.redpacketAmount = res.data.redpacketAmount
					this.leftAmount = res.data.leftAmount
					this.isLoading = false
				}
			},
			async getStatisticsList () {
				let s_date = ''
				let e_date = ''
				if (this.timeType == 1) {
					s_date = this.ds_date || moment(new Date(new Date() - 1000 * 60 * 60 * 24 * 30)).format('YYYY-MM-DD')
					e_date = this.de_date || moment(new Date() - 1000 * 60 * 60 * 24).format('YYYY-MM-DD')
				} else if (this.timeType == 2) {
					if (moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
						this.we_date = moment().format("YYYY-MM-DD")
					}
					s_date = this.ws_date
					e_date = this.we_date
				} else if (this.timeType == 3) {
					s_date = moment().startOf('month').format("YYYY-MM-DD")
					e_date = moment(new Date()).format('YYYY-MM-DD')
				}
				const {data: res} = await this.axios.post(
					"work-contact-way-redpacket/redpacket-send-statistic",
					{
						corp_id  : this.corpId,
						id       : this.urlId,
						type     : this.timeType,
						s_date   : s_date,
						e_date   : e_date,
						s_week   : this.ws_week,
						is_export: this.is_export,
						// data_type: 1,
					}
				);
				if (res.error != 0) {
					this.is_export = 0
					this.$message.error(res.error_msg);
				} else {
					if (this.is_export == 0) {
						this.isLoading = false
						this.newMember = res.data.newMember
						this.receiveSum = res.data.receiveSum
						this.receiveNum = res.data.receiveNum
						this.notReceiveSum = res.data.notReceiveSum
						this.notReceiveNum = res.data.notReceiveNum
						this.fansInteractive.xAxisData = res.data.xData
						for (let i = 0; i < res.data.seriesData.length; i++) {
							this.fansInteractive.seriesData.push(
								{
									name  : '',
									type  : 'line',
									smooth: true,
									data  : []
								})
							this.fansInteractive.seriesData[i].name = res.data.seriesData[i].name
							this.fansInteractive.seriesData[i].data = res.data.seriesData[i].data
							this.fansInteractive.legendData.push(res.data.seriesData[i].name)
						}
						this.timeDataList = res.data.chatData.reverse()
						this.total = res.data.chatData.length
						let table = this.getPageData(this.timeDataList, this.page, this.pageSize)
						this.timeData = table.list
						this.page = table.page
					} else {
						setTimeout(() => {
							window.open(res.data.url)
							this.is_export = 0
							this.btnLoading = false
							this.isLoading = false
						}, 2000)
					}
				}
			},
			changeFansTimeType1 (type) {
				if (this.timeType != type) {
					if (type == 1) {
						this.ds_date = moment(new Date(new Date() - 1000 * 60 * 60 * 24 * 30)).format('YYYY-MM-DD')
						this.de_date = moment(new Date() - 1000 * 60 * 60 * 24).format('YYYY-MM-DD')
					}
					this.page = 1
					this.isLoading = true
					this.timeType = type;
					this.getStatisticsList()
				}

			},
			// 成员TOP10时间值
			changeFansTime1 (date, dateString) {
				this.isLoading = true
				if (this.timeType == 1) {
					this.ds_date = dateString[0]
					this.de_date = dateString[1]
				}
				this.getStatisticsList()
			},
			// 成员TOP10改变起始周
			changeFansStartWeek1 (date, dateString) {
				this.isLoading = true
				if (date > this.weekEnd) {
					this.weekStart = moment(JSON.parse(JSON.stringify(this.weekEnd)))
					this.weekEnd = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart).format('E')
					this.fansAddTime.ws_date = moment(this.weekStart).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd).format('E')
					this.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime.we_date = moment().format("YYYY-MM-DD")
					}
					this.ws_week = moment(this.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekStart = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekStart).format('E')
					this.ws_date = moment(this.weekStart).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					this.ws_week = weekDay
				}
				this.getStatisticsList()
			},
			// 成员TOP10改变结束周
			changeFansEndWeek1 (date, dateString) {
				this.isLoading = true
				if (date < this.weekStart) {
					this.weekEnd = moment(JSON.parse(JSON.stringify(this.weekStart)))
					this.weekStart = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart).format('E')
					this.ws_date = moment(this.weekStart).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd).format('E')
					this.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.we_date > moment().format("YYYY-MM-DD")) {
						this.we_date = moment().format("YYYY-MM-DD")
					}
					this.ws_week = moment(this.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekEnd = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekEnd).format('E')
					this.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					this.we_week = weekDay
				}
				this.getStatisticsList()
			},
			disabledDateDay (current) {
				return current.valueOf() > new Date().getTime() - 86400000 || current < moment().subtract(31, "days");
			},
			disabledDateWeek (current) {
				let weekOfday = moment(new Date()).format('E')
				return current.valueOf() > moment(new Date()).subtract(weekOfday, 'days') || current < moment().subtract(365, "days");
			},
			//导出数据
			exportData () {
				this.is_export = 1
				this.btnLoading = true
				this.getStatisticsList()
			},
		},

		created () {
			this.urlId = this.$route.query.id
			this.title = decodeURIComponent(this.$route.query.title)
			this.corpId = decodeURIComponent(this.$route.query.id1)
			if (typeof this.urlId != "undefined") {
				this.getStatisticsSum()
				this.getStatisticsList()
			}
		}
	}
</script>

<style lang='less' scoped>
	.statistics-ul {
		overflow: hidden;
		padding: 0;
		margin-bottom: 0;
		display: flex;
		justify-content: space-between;

		li {
			width: 16.67%;
			height: 105px;
			color: #1A1A1A;
			padding: 10px;
			background: #F9F9F9;
			border-right: 1px solid #E9E9E9;
			border-top: 1px solid #E9E9E9;
			border-bottom: 1px solid #E9E9E9;
			p {
				margin-bottom: 0;
			}

			.number {
				font-size: 18px;
				height: 45px;
				line-height: 45px;
			}

			.count {
				float: right;
			}
		}
	}
	.statistics-ul li:first-child {
		border-left: 1px solid #E9E9E9;
	}
	.card-caledar {
		margin: 12px 0;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		color: #686868;
	}

	.caledar-btn-selected {
		boder: 0;
		border-right: 1px solid #3B74FF;
		background: #3B74FF;
		color: #FFF;
	}

	/deep/ .ant-input {
		border-radius: 0;
	}

	.ant-btn {
		border-radius: 0;
	}

	.picker-contain {
		margin-right: 10px;
	}

	/deep/ .ant-table-wrapper {
		background: #FFF;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.view-title {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
		font-size: 16px;
		padding: 0 20px;
		text-align: left;
	}

	.picker-contain {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.picker-contain .caledar-btn-selected {
		boder: 0;
		border-right: 1px solid #3B74FF;
		background: #3B74FF;
		border-radius: 0;
		color: #FFF;
	}

	.picker-contain button {
		margin: 0px 0px 0px 5px;
	}

	.sec-card-caledar {
		height: auto;
		padding: 5px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		background: #F7F7F7;
		/*border: 1px solid #E9E9E9;*/
	}

	.sec-card-caledar.down-text {
		background: #FFFFFF;
		/*border: 1px solid #E9E9E9;*/
		/*border-bottom: 0;*/
	}

	.sec-card-caledar.down-text p {
		color: #1A1A1A !important;
	}

	.sec-card-caledar.down-text span {
		color: #FF562D !important;
	}
</style>