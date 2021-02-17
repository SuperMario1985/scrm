<template>
	<div style="position: absolute;left: 0;top: 0;right: 0;background: #fff;">
		<a-spin tip="加载中..." size="large" :spinning="isLoading">
		<div class="view-title">{{title}}
			<router-link to="/scene/list" style="font-size: 16px;float: right;margin-right: 15px;">
				<a-button type="primary" >返回列表</a-button>
			</router-link>
		</div>
		<div style="padding: 20px;">
			<ul class="statistics-ul">
				<li style="background: #40A9FF;">
					<p>今日扫码总次数
						<a-tooltip placement="right">
							<template slot="title">
								<span>扫过此渠道码的次数（可能同一人扫多次，每扫一次，扫码总次数+1）</span>
							</template>
							<a-icon type="question-circle" style="margin-left:5px;"/>
						</a-tooltip>
					</p>
					<p class="number">{{scan_times.day}}</p>
					<p class="count">累计：{{scan_times.sum}}</p>
				</li>
				<li style="background: #FFC71B;">
					<p>今日扫码人数
						<a-tooltip placement="right">
							<template slot="title">
								<span>扫过此渠道码的人数（可能同一人扫多次，累计值只计入1人）</span>
							</template>
							<a-icon type="question-circle" style="margin-left:5px;"/>
						</a-tooltip>
					</p>
					<p class="number">{{scan_num.day}}</p>
					<p class="count">累计：{{scan_num.sum}}</p>
				</li>
				<li style="background: #8E8AFF;">
					<p>今日关注人数
						<a-tooltip placement="right">
							<template slot="title">
								<span>通过扫该渠道码后关注的人数。（可能同一人扫该码，再取关，再扫该码，累计值只计入1人）</span>
							</template>
							<a-icon type="question-circle" style="margin-left:5px;"/>
						</a-tooltip>
					</p>
					<p class="number">{{subscribe.day}}</p>
					<p class="count">累计：{{subscribe.sum}}</p>
				</li>
				<li style="background: #FF688E;">
					<p>今日取关人数
						<a-tooltip placement="right">
							<template slot="title">
								<span>通过扫渠道码关注后又取关的人数。（可能同一人扫该码关注，再取关，再扫该码，累计值只计入1人）</span>
							</template>
							<a-icon type="question-circle" style="margin-left:5px;"/>
						</a-tooltip>
					</p>
					<p class="number">{{unsubscribe.day}}</p>
					<p class="count">累计：{{unsubscribe.sum}}</p>
				</li>
				<li style="background: #5DDCB2;">
					<p>今日净增粉丝人数
						<a-tooltip placement="right">
							<template slot="title">
								<span>扫该渠道码的新粉丝人数-取关粉丝人数。（数据可能存在一定的误差，因存在某粉丝在同一天内既存在多次关注也存在多次取消的特殊情况）</span>
							</template>
							<a-icon type="question-circle" style="margin-left:5px;"/>
						</a-tooltip>
					</p>
					<p class="number">{{net_increase.day}}</p>
					<p class="count">累计：{{net_increase.sum}}</p>
				</li>
			</ul>
			<!--折线图-->
			<div class="all-card-calendar">
				<div class="card-caledar">
					<div class="hour-picker-contain picker-contain">
						<a-button :class="time_type== 1? 'caledar-btn-selected': '' "
						          @click="changeFansTimeType(1)">
							今日按时
						</a-button>
					</div>
					<div class="day-picker-contain picker-contain">
						<a-button :class="time_type== 2? 'caledar-btn-selected': '' "
						          @click="changeFansTimeType(2)">
							按指定日
						</a-button>
						<a-range-picker
								:disabledDate="disabledDate"
								:defaultValue="[moment(moment().subtract(30, 'days').calendar(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]"
								format="YYYY-MM-DD"
								v-if="time_type == 2 && is_long == 1"
								@change="changeFansTime"
						/>
						<a-range-picker
								:disabledDate="disabledDate2"
								:defaultValue="[moment(startDate, dateFormat), moment(endDate, dateFormat)]"
								format="YYYY-MM-DD"
								v-if="time_type == 2 && is_long == 0"
								@change="changeFansTime"
						/>
					</div>
					<div class="month-picker-contain picker-contain" v-show="is_long == 1">
						<a-button :class="time_type== 3? 'caledar-btn-selected': '' "
						          @click="changeFansTimeType(3)">
							近12个月
						</a-button>
					</div>
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
			   <span slot="scan_times" slot-scope="text, record,index">
			     {{record.scan_times}}次
			   </span>
				<span slot="scan_num" slot-scope="text, record,index">
			     {{record.scan_num}}人
			   </span>
				<span slot="net_increase" slot-scope="text, record,index">
			     {{record.net_increase}}人
			   </span>
				<span slot="unsubscribe" slot-scope="text, record,index">
			     {{record.unsubscribe}}人
			   </span>
				<span slot="subscribe" slot-scope="text, record,index">
			     {{record.subscribe}}人
			   </span>
			</a-table>
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
			dataIndex: "perdate",
			key      : "perdate"
		},
		{
			title      : "扫码次数",
			dataIndex  : "scan_times",
			scopedSlots: {customRender: "scan_times"},
			key        : "scan_times"
		},
		{
			title      : "扫码人数",
			dataIndex  : "scan_num",
			scopedSlots: {customRender: "scan_num"},
			key        : "scan_num"
		},
		{
			title      : "关注人数",
			dataIndex  : "subscribe",
			scopedSlots: {customRender: "subscribe"},
			key        : "subscribe"
		},
		{
			title      : "取关人数",
			dataIndex  : "unsubscribe",
			scopedSlots: {customRender: "unsubscribe"},
			key        : "unsubscribe"
		},
		{
			title      : "净增粉丝人数",
			dataIndex  : "net_increase",
			key        : "net_increase",
			scopedSlots: {customRender: "net_increase"}
		},
	];

	export default {

		components: {
			LineCharts, IconFont
		},

		data () {
			return {
				urlId          : '',//地址栏的id
				scan_times     : '',//统计扫码次数
				unsubscribe    : '',//流失粉丝人数
				net_increase   : '',//净增粉丝人数
				scan_num       : '',//扫码人数
				subscribe      : '',//新粉丝人数
				statisticsList : [],//统计列表
				time_type      : 1,//时间类型：1、小时，2、天，3、月
				start_date     : '',//开始日期
				end_date       : '', //结束日期
				is_export      : 0, //是否导出：0、否，1、是
				fansInteractive: {
					legendData: [],
					xAxisData : [],
					seriesData: [],
				},
				title          : '',//页面标题
				columns,//表格
				timeData       : [],//表格数据
				btnLoading     : false,//导出数据按钮的加载
				is_long        : 0,//1是永久有效期，0不是
				startDate:'',//不是永久的开始日期
				endDate:'',//不是永久的结束日期
				dateFormat: 'YYYY-MM-DD',
				isLoading       : true, //Loading 组件显示与隐藏
			}
		},

		methods: {
			moment,
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			async getStatisticsSum () {
				const {data: res} = await this.axios.post(
					"scene/sum",
					{
						scene_id: this.urlId
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading = false
				} else {
					this.scan_times = res.data.scan_times
					this.unsubscribe = res.data.unsubscribe
					this.net_increase = res.data.net_increase
					this.scan_num = res.data.scan_num
					this.subscribe = res.data.subscribe
					this.isLoading = false
				}
			},
			async getStatisticsList () {
				if (this.time_type == 2 && this.start_date == '') {
					this.start_date = moment(new Date(new Date() - 1000 * 60 * 60 * 24 * 30)).format('YYYY-MM-DD')
				}
				if (this.time_type == 2 && this.end_date == '') {
					this.end_date = moment(new Date()).format('YYYY-MM-DD')
				}
				const {data: res} = await this.axios.post(
					"scene/sum-list",
					{
						scene_id  : this.urlId,
						time_type : this.time_type,
						start_date: this.start_date,
						end_date  : this.end_date,
						is_export : this.is_export
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (this.is_export == 0) {
						this.isLoading = false
						this.title = res.data.title
						this.fansInteractive.xAxisData = res.data.perDate
						for (let i = 0; i < res.data.seriesData.length; i++) {
							this.fansInteractive.seriesData.push(
								{
									name  : '',
									type  : 'line',
									smooth: true,
									data  : []
								},)
							this.fansInteractive.seriesData[i].name = res.data.seriesData[i].name
							this.fansInteractive.seriesData[i].data = res.data.seriesData[i].data
							this.fansInteractive.legendData.push(res.data.seriesData[i].name)
						}
						this.timeData = res.data.timeData
						this.is_long = res.data.is_long
						this.startDate = res.data.startDate
						this.endDate = res.data.endDate
						this.start_date = this.startDate
						this.end_date = this.endDate
					} else {
						// console.log(res)
						setTimeout(() => {
							window.open(res.data.url);
							this.is_export = 0
							this.btnLoading = false
							this.isLoading = false
						}, 2000);
					}
				}
			},
			disabledDate (current) {
				return new Date().getTime() < current.valueOf() || current.valueOf() < new Date(new Date() - 1000 * 60 * 60 * 24 * 30).getTime() - 86400000;
			},
			disabledDate2 (current) {
				return new moment(this.endDate).valueOf() < current.valueOf() || current.valueOf() < moment(this.startDate).valueOf();
			},
			//更换时间选择
			changeFansTimeType (type) {
				this.time_type = type;
				this.isLoading = true
				this.getStatisticsList()
			},
			changeFansTime (date, dateString) {
				this.start_date = dateString[0]
				this.end_date = dateString[1]
				this.isLoading = true
				this.getStatisticsList()
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
			width: 19%;
			height: 100px;
			color: #FFF;
			padding: 10px;

			p {
				margin-bottom: 0;
			}

			.number {
				font-size: 30px;
			}

			.count {
				float: right;
			}
		}
	}

	.card-caledar {
		margin: 12px 0;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		color: #686868;
	}

	.caledar-btn-selected {
		border: 0;
		border: 1px solid #01b065;
		background: #01b065;
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
</style>
