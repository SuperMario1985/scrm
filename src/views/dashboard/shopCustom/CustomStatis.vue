<template>
	<div class="custom-statis">
		<a-layout style="position: relative; height: 100%; overflow: hidden">
			<a-layout class="scroll" style="position: absolute;left: 0;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;">
				<!-- 内容 -->
				<a-layout-content>
					<div style="padding: 15px 20px;background: #FFF;">
						<template v-if="isPreview">
							<a-alert type="error" closable @close="onCloseAlert">
								<p slot="message" style="margin-bottom: 0;">
									当前消费数据未开启，点击<router-link to="/shopCustom/CustomSet">【顾客设置】</router-link>将前往开启，无数据情况下将展示演示数据。
								</p>
							</a-alert>
						</template>
						<div class="content content-hd">
							<a-row>
								<a-col :span="6">
									<div class="panel-item">
										<div class="panel-t">
											<span class="panel-name">总销售额</span>
											<a-tooltip placement="top">
												<template slot="title">
													<div>企业累计总销售额（只包含导入的多渠道订单）</div>
												</template>
												<a-icon type="info-circle" />
											</a-tooltip>
										</div>
										<div class="panel-m">
											<div class="panel-num">{{baseData.monetary}}</div>
											<div class="panel-echart">
												<LineCharts :options="fansAdd0" style="width:100%;"></LineCharts>
											</div>
										</div>
										<a-divider />
										<div class="panel-b">
											<div><span>昨日销售额</span>¥{{baseData.yesterday_monetary}}</div>
											<div>
												<img v-if="baseData.monetary_rate_type==0"
													src="../../../assets/home/img/arrowdown.png"/>
												<img v-if="baseData.monetary_rate_type==1"
													src="../../../assets/home/img/arrowup.png"/>
												<span>{{baseData.day_monetary_rate}}%</span>	 
											</div>
										</div>
									</div>
								</a-col>
								<a-col :span="6">
									<div class="panel-item">
										<div class="panel-t">
											<span class="panel-name">顾客总量</span>
											<a-tooltip placement="top">
												<template slot="title">
													<div>当前的顾客总量（企微加多个好友视为一个，非企微用户需要有手机号）</div>
												</template>
												<a-icon type="info-circle" />
											</a-tooltip>
										</div>
										<div class="panel-m">
											<div class="panel-num">{{baseData.all_customer_number}}</div>
											<div class="panel-echart">
												<LineCharts :options="fansAdd" style="width:100%;"></LineCharts>
											</div>
										</div>
										<a-divider />
										<div class="panel-b">
											<div><span>昨日增量</span>{{baseData.yesterday_add_user_number}}</div>
										</div>
									</div>
								</a-col>
								<a-col :span="6">
									<div class="panel-item">
										<div class="panel-t">
											<span class="panel-name">消费顾客数</span>
											<a-tooltip placement="top">
												<template slot="title">
													<div>有下单的顾客数</div>
												</template>
												<a-icon type="info-circle" />
											</a-tooltip>
										</div>
										<div class="panel-m">
											<div class="panel-num">{{baseData.buy_customer_number}}</div>
											<div class="panel-echart">
												<BarCharts style="width:100%;" :options="fansAdd1"></BarCharts>
											</div>
										</div>
										<a-divider />
										<div class="panel-b">
											<div><span>比例</span>{{baseData.monetary_rate}}%</div>
										</div>
									</div>
								</a-col>
								<a-col :span="6">
									<div class="panel-item">
										<div class="panel-t">
											<span class="panel-name">互动顾客数</span>
											<a-tooltip placement="top">
												<template slot="title">
													<div>有互动的顾客数</div>
												</template>
												<a-icon type="info-circle" />
											</a-tooltip>
										</div>
										<div class="panel-m">
											<div class="panel-num">{{baseData.interaction_number}}</div>
											<div class="panel-echart">
												<BarCharts style="width:100%;" :options="fansAdd2"></BarCharts>
											</div>
										</div>
										<a-divider />
										<div class="panel-b">
											<div><span>比例</span>{{baseData.interaction_rate}}%</div>
										</div>
									</div>
								</a-col>
							</a-row>
						</div>
						<div class="content content-td">
							<template>
								<a-tabs @change="saleBarType">
									<div slot="tabBarExtraContent">
										<a-radio-group v-model="cycleType" button-style="solid" @change="changeCycleType">
											<a-space :size="0">
												<a-radio-button value="1">本周</a-radio-button>
												<a-radio-button value="2">本月</a-radio-button>
												<a-radio-button value="3">全年</a-radio-button>
											</a-space>
										</a-radio-group>
										<a-range-picker
											format="YYYY-MM-DD"
											allowClear
											style="width:320px;margin-left: 50px;"
											:disabled-date="disabledDateDay"
											v-model="searchTime"
											@change="changeTime($event)"
										>
											<a-icon slot="suffixIcon" type="calendar" />
										</a-range-picker>	
									</div>
									<a-tab-pane key="1" tab="销售额">
										<BarCharts style="width:100%;" :options="saleBar"></BarCharts>
									</a-tab-pane>
									<a-tab-pane key="2" tab="拉新量">
										<BarCharts style="width:100%;" :options="saleBar"></BarCharts>
									</a-tab-pane>
								</a-tabs>
							</template>
						</div>
						<div class="content content-md">
							<a-row>
								<a-col :span="12">
									<template>
										<a-tabs type="card" @change="guideShopping">
											<div slot="tabBarExtraContent">导购拉新排行榜</div>
											<a-tab-pane key="1" tab="城市" v-if="0">
												<a-table
													:columns="columns"
													:dataSource="customList"
												>
													<template slot="rank" slot-scope="text,record,index">
														<span>{{index+1}}</span>
													</template>
													<template slot="name" slot-scope="text">
														<a>{{text}}</a>
													</template>
													<template slot="shop" slot-scope="text">
														<a>{{text}}</a>
													</template>
												</a-table>
											</a-tab-pane>
											<a-tab-pane key="2" tab="门店" v-if="0">
												<a-table
													:columns="columns"
													:dataSource="customList"
												>
													<template slot="rank" slot-scope="text,record,index">
														<span>{{index+1}}</span>
													</template>
													<template slot="name" slot-scope="text">
														<a>{{text}}</a>
													</template>
													<template slot="shop" slot-scope="text">
														<a>{{text}}</a>
													</template>
												</a-table>
											</a-tab-pane>
											<a-tab-pane key="3" tab="导购">
												<a-table
													:columns="columns"
													:dataSource="customList"
													:pagination="false"
												>
													<template slot="rank" slot-scope="text,record,index">
														<span>{{index+1}}</span>
													</template>
													<template slot="name" slot-scope="text">
														<a>{{text}}</a>
													</template>
													<template slot="shop" slot-scope="text">
														<a>{{text}}</a>
													</template>
												</a-table>
											</a-tab-pane>
										</a-tabs>
									</template>
								</a-col>
								<a-col :span="8" style="float: right;">
									<template>
										<a-tabs type="card" @change="guideSale">
											<div slot="tabBarExtraContent">导购销售额排名</div>
											<a-tab-pane key="1" tab="城市" v-if="0">城市</a-tab-pane>
											<a-tab-pane key="2" tab="门店" v-if="0">门店</a-tab-pane>
											<a-tab-pane key="3" tab="导购">
												<ul style="padding-left: 0;" v-if="saleList.length>0">
													<li class="sale-list" v-for="(item,index) in saleList" :key="index">
														<a-row>
															<a-col :span="3">
																<span class="sort" :class="{active:index<3}">{{index+1}}</span>
															</a-col>
															<a-col :span="12"><span>{{item.guide_name}}</span></a-col>
															<a-col :span="9"><span>{{item.monetary}}</span></a-col>
														</a-row>
													</li>
												</ul>
												<ul v-else>
													<li style="text-align: center;margin-top: 30%;">暂无数据</li>
												</ul>
											</a-tab-pane>
										</a-tabs>
									</template>
								</a-col>
							</a-row>
						</div>
						<div class="content content-bd">
							<a-tabs @change="guideProgress" v-if="tabData.length>0">
								<div slot="tabBarExtraContent">
									<a-month-picker 
										format="YYYY/MM"
										:default-value="moment(now, 'YYYY/MM')"
										:disabled-date="disabledDate"
										@change="changeMonth($event)" 
									/>
								</div>
								<a-tab-pane key="0" tab="一级分组"></a-tab-pane>
								<a-tab-pane 
								:key="item.group_id" 
								:tab="item.grade_name"
								v-for="item in tabData"></a-tab-pane>
							</a-tabs>
							<a-tabs @change="guideProgress" v-else>
								<div slot="tabBarExtraContent">
									<a-month-picker 
										format="YYYY/MM"
										:default-value="moment(now, 'YYYY/MM')"
										:disabled-date="disabledDate"
										@change="changeMonth($event)" 
									/>
								</div>
								<a-tab-pane key="0" tab="所有分组"></a-tab-pane>
							</a-tabs>
							<div class="progress-area">
								<div class="go-left" @click="goScroll('left')"><a-icon type="left" /></div>
								<div class="progress-content" ref="progressW">
									<div class="progress-warper" :style="{'left': progressLeft+'px'}">
										<div 
										class="progress-item" 
										:class="{active:ereaIndex==index}" 
										@click="areaTab(index,item)"
										v-for="(item,index) in ereaList" 
										:key="index">
											<div class="progress-chiled">
												<div class="progress-l">
													<div class="progress-name">{{item.group_name}}</div>
													<span>拉新完成度</span>
													<div class="progress-num">{{item.customer_rate}}%</div>
												</div>
												<div class="progress-r">
													<svg width="80" height="80" viewBox="0 0 80 80">
														<circle class="circle-grey" cx="40" cy="40" r="30"></circle>
														<circle class="circle-color" cx="40" cy="40" r="30" stroke-dasharray="190" :stroke-dashoffset="(100-item.customer_rate)*190/100"></circle>
													</svg>
												</div>
											</div>
											<div class="progress-chiled progress-chiled-sale">
												<div class="progress-l">
													<span>销售完成度</span>
													<div class="progress-num">{{item.monetary_rate}}%</div>
												</div>
												<div class="progress-r">
													<svg width="80" height="80" viewBox="0 0 80 80">
														<circle class="circle-grey" cx="40" cy="40" r="30"></circle>
														<circle class="circle-color" cx="40" cy="40" r="30" stroke-dasharray="190" :stroke-dashoffset="(100-item.monetary_rate)*190/100"></circle>
													</svg>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="go-right" @click="goScroll('right')"><a-icon type="right" /></div>
							</div>
							<div class="echarts-area">
								<div class="echarts-area">
									<LineCharts :options="fansAdd3" style="width:100%;"></LineCharts>
								</div>
							</div>
						</div>
						<div class="page-tip" @click="tipOpen">
							<a-icon type="question-circle" />
						</div>
					</div>
					
					<!-- 页面提醒 -->
					<a-drawer
						title="使用帮助" 
						placement="right" 
						:destroyOnClose='true' 
						:closable="true" 
						@close="tipClose" 
						:visible="tipVisible">
						<div class="content-msg">
							<p style="margin-bottom: 8px;">
								1、当前页面是统计企业和门店的拉新和销售情况，若未开始消费数据功能，将没有销售业绩统计，前往开启<router-link to="/shopCustom/CustomSet">【顾客设置】</router-link>
							</p>
							<p style="margin-bottom: 8px;">
								2、 所有数据是截止到昨天的数据，用户删除、订单退款等不会影响历史数据
							</p>
							<p style="margin-bottom: 2px;">
								3、数据定义：销售额指的订单在时间范围内，企业的多渠道订单总的消费额。拉新指的是在时间范围内，首次消费的顾客。导购关联的销售额需要订单关联本人，门店关联的销售额需要订单能归属此门店，拉新的归属同样。
							</p>
							<p style="margin-bottom: 8px;">
								数据来源：前往<router-link to="/appCenter/list">【应用中心】</router-link>开启电商系统的订单导入功能，具体可以联系客服了解。
							</p>
							<p style="margin-bottom: 2px;">
								4、顶部迷你卡片区域：
							</p>
							<p style="margin-bottom: 2px;">
								销售额是企业累计总销售额（只包含导入的多渠道订单），今天看到的是昨天日销售额环比前天的，小图表显示前15天的日销售额。
							</p>
							<p style="margin-bottom: 2px;">
								顾客总量当前的顾客总量（企微加多个好友视为一个，非企微用户需要有手机号），单独显示昨天增加了多少个，小图表显示前15天的天顾客增量。
							</p>
							<p style="margin-bottom: 8px;">
								消费顾客数指的有下单的顾客数，比例为占比总顾客比例，小图表显示前15天的天消费顾客增量。会话顾客数是有互动的顾客数，占比总顾客比例，小图表显示前15天的天会话顾客增量。需要开启<router-link to="/archive/message">【会话存档】</router-link>功能，为保证数据齐全，需要开通所有对外沟通人的权限。
							</p>
							<p style="margin-bottom: 8px;">
								5、销售额拉新量柱状图、导购拉新销售排行榜，可以进行时间筛选，只能选择有数据起始的那天到昨天。跨度大于31天柱状图按照月显示。
							</p>
							<p style="margin-bottom: 8px;">
								6、门店及分组数据统计区域，固定按照自然月展示数据。可以按照分组从高到低逐级查看拉新和销售数据，完成度比例是环比上月数据。无分组建议前往<router-link to="/store/list">【门店管理】</router-link>设置。
							</p>
						</div>
					</a-drawer>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
	import moment from 'moment';
	import BarCharts from '../../../components/echarts/BarCharts'
	import LineCharts from '../../../components/echarts/LineCharts'
	
	const columns = [
		{
			title    : "排名",
			width    : '60px',
			scopedSlots: {customRender: "rank"}
		},
		{
			title    : "员工姓名",
			dataIndex: "guide_name",
			key      : "guide_name",
			scopedSlots: {customRender: "name"},
			ellipsis: true,
		},
		// {
		// 	title    : "所属门店",
		// 	dataIndex: "store_name",
		// 	key      : "store_name",
		// 	ellipsis: true,
		// 	width: '30%',
		// 	scopedSlots: {customRender: "shop"}
		// },
		{
			title    : "总顾客数",
			dataIndex: "all_customer_number",
			key      : "all_customer_number",
		},
		{
			title    : "拉新数",
			dataIndex: "add_user_number",
			key      : "add_user_number",
		},
	]
	let now = new Date(); //当前日期
	let nowDayOfWeek = now.getDay(); //今天本周的第几天
	let nowDay = now.getDate(); //当前日
	let nowMonth = now.getMonth(); //当前月
	let nowYear = now.getYear(); //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //
	
	function formatDateTime (inputTime, type) {
		let date = new Date(inputTime);
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		let minute = date.getMinutes();
		let second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		if (type) {
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//2017-12-12 12:23:34
		} else {
			return y + '-' + m + '-' + d; //2017-12-12
		}
	}
	//获得本周的开端日期
	function getWeekStartDate () {
		if (nowDayOfWeek == 0) {
			nowDayOfWeek = 7
		}
		let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
		return formatDateTime(weekStartDate);
	}
	//获得本周的停止日期
	function getWeekEndDate () {
		let weekEndDate = new Date(nowYear, nowMonth, nowDay) - 86400000;
		return formatDateTime(weekEndDate);
	}
	//获得本月的开端日期
	function getMonthStartDate () {
		let monthStartDate = new Date(nowYear, nowMonth, 1);
		return formatDateTime(monthStartDate);
	}
	
	//获得本月的停止日期
	function getMonthEndDate () {
		let monthEndDate = new Date(nowYear, nowMonth, nowDay) - 86400000;
		return formatDateTime(monthEndDate);
	}
	//获得本年的开始日期
	function getYearStarDate () {
		let yearStarDate = new Date(nowYear, 0, 1);
		return formatDateTime(yearStarDate);
	}
	
	export default {
		name: "CustomStatis",
		components: {
			BarCharts,
			LineCharts,
		},
		data(){
			return {
				moment,
				now,
				isPreview: 0,//0:真数据，1：假数据
				baseData: {},//卡片数据
				fansAdd0      : {
					title     : '总销售额',
					data_Type : 1,
					legendData: [{
						show: false
					}],
					xAxisData : [],
					seriesData: [
						{
							name: "总销售额", 
							type: "line", 
							smooth: true,
							showSymbol: false,
							areaStyle: {
								opacity: .3,
								color: "#3398DB",
								shadowColor: "#3398DB",
								shadowOffsetY: 1
							},
							emphasis: {
								focus: 'series'
							},
							data: [],
						},
					]
				},
				fansAdd       : {
					title     : '客户总量',
					data_Type : 1,
					legendData: [{
						show: false
					}],
					xAxisData : [],
					seriesData: [
						{
							name: "客户总量", 
							type: "line", 
							smooth: true,
							showSymbol: false,
							areaStyle: {
								opacity: .3,
								color: "#3398DB",
								shadowColor: "#3398DB",
								shadowOffsetY: 1
							},
							emphasis: {
								focus: 'series'
							},
							data: [],
						},
					]
				},
				fansAdd1: {
					title     : '顾客数',
					xAxisData : [],
					name      : '顾客数',
					data_Type : 5,
					seriesData: []
				},
				fansAdd2: {
					title     : '顾客数',
					xAxisData : [],
					name      : '顾客数',
					data_Type : 5,
					seriesData: []
				},
				
				saleBarTab: 1,//1:销售额，2拉新量
				cycleType: "1",//日期类型
				startValue: '',   // 开始时间
				endValue: '',   // 结束时间
				searchTime: null,//搜索时间
				minDay: '',//可选的最小日期
				saleBar: {
					title     : '销售额趋势',
					xAxisData : [],
					name      : '销售额',
					seriesData: []
				},
				saleBarData: {},
				
				columns,
				customList: [],//导购拉新排行榜
				saleList:[],//导购销售额排名
				ereaList:[],
				ereaIndex: 0,//大区Tab对应的index
				progressLeft: 0,//滚动条距离左边的距离
				fansAdd3      : {
					title     : '客户增长',
					legendData: ["拉新量", "销售额"],
					xAxisData : [],
					yAxisData : [
						{
							type: 'value',
							name: '拉新量',
							splitLine: {
								show: true
							},
							axisLine: {
								show: true
							},
							axisLabel: {
								formatter: '{value}'
							}
						},
						{
							type: 'value',
							name: '销售额',
							splitLine: {
								show: true,
								lineStyle: {
									type: 'dashed'
								}
							},
							axisLabel: {
								formatter: '{value}'
							}
						}
					],
					seriesData: [
						{
							name: "拉新量", 
							type: "line", 
							smooth: false, 
							data: [],
						},
						{
							name: "销售额", 
							type: "line", 
							yAxisIndex: 1,
							smooth: false, 
							data: [],
						},
					]
				},
				searchMonth: moment(now, 'YYYY/MM').format("YYYY-MM"),//搜索月份
				pid: 0,//分组id
				tabData: [],//无限分组Tab
				isChild: false,//分组是否有下级
				store_str: '',//客户增长参数
				
				tipVisible: false,//页面提醒
			}
		},
		methods: {
			onCloseAlert(){
				this.isPreview = 0
			},
			disabledDateDay (current) {
				// return current.valueOf() > new Date().getTime() - 86400000 || current < moment().subtract(31, "days");
				return current.valueOf() > new Date().getTime() - 86400000 || current < moment(this.minDay);
			},
			disabledDate (current) {//日期禁止部分
				return current && current > moment().endOf('day');
			},
			changeCycleType(){//周、年、月切换
				if (this.cycleType == 1) {
					this.startValue = getWeekStartDate()
					this.endValue = getWeekEndDate()
				} else if (this.cycleType == 2) {
					this.startValue = getMonthStartDate()
					this.endValue = getMonthEndDate()
				} else if (this.cycleType == 3) {
					this.startValue = getYearStarDate()
					this.endValue = getWeekEndDate()
				}
				this.searchTime = null
				this.barFun()
				this.shopSale()
			},
			changeTime (date) {// 修改时间
				let that = this;
				that.cycleType = 0
				that.searchTime = date
				that.startValue = date[0].format("YYYY-MM-DD")
				that.endValue = date[1].format("YYYY-MM-DD")
				that.barFun()
				that.shopSale()
			},
			saleBarType(key){//销售额与拉新量统计
				this.saleBarTab = key
				if(key == 1){
					this.saleBar.title = "销售额趋势"
					this.saleBar.name = "销售额"
					this.saleBar.seriesData = this.saleBarData.monetary
				}else if(key == 2){
					this.saleBar.title = "拉新量趋势"
					this.saleBar.name = "拉新量"
					this.saleBar.seriesData = this.saleBarData.add_user_number
				}
			},
			guideShopping(key){//导购拉新Tab切换
				if(key == 1){
					console.log('城市')
				}else if(key == 2){
					console.log('门店')
				}else if(key == 3){
					console.log('导购')
				}
			},
			guideSale(key){//导购销售额Tab切换
				if(key == 1){
					console.log('城市')
				}else if(key == 2){
					console.log('门店')
				}else if(key == 3){
					console.log('导购')
				}
			},
			guideProgress(key){//进度Tab切换
				this.progressLeft = 0
				this.ereaIndex = 0
				this.gardeFun(key)
			},
			areaTab(index,item){//大区Tab切换
				let that = this;
				if(that.ereaIndex != index){
					that.ereaIndex = index
					if(item.have_child == 1){
						that.tabData = that.tabData.concat(item)
						for(let i=0;i<that.tabData.length;i++){
							if (that.tabData[i].group_id == item.group_id && i>0) {
								if(that.isChild){
									that.tabData.splice(i-1,1)
								}else{
									that.tabData.splice(i,1)
								}
							}
						}
					}else{
						that.tabData = that.tabData.concat(item)
						for(let i=0;i<that.tabData.length;i++){
							if (that.tabData[i].group_id == item.group_id && i>0) {
								that.tabData.splice(i,1)
							}
						}
					}
					this.store_str = item.store_str
					this.lineFun(item.store_str)
				}
			},
			goScroll(type){//左右切换
				let that = this
				if(type == 'left'){//点击左边的按钮
					if(that.progressLeft<0){
						that.progressLeft = that.progressLeft + 220
					}
				}else if(type == 'right'){//点击右边的按钮
					if(that.$refs.progressW.clientWidth - that.ereaList.length*220<that.progressLeft){
						that.progressLeft = that.progressLeft - 220
					}
				}
			},
			changeMonth(date){//月份选择
				let that = this;
				that.searchMonth = date.format("YYYY-MM")
				that.lineFun(that.store_str)
				that.gardeFun1(that.pid)
			},
			
			async baseFun (){//小卡片总数据
				let that = this;
				that.isLoading = true;
				const {data: res} = await that.axios.post("shop-customer/all-data", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					
					that.isPreview = res.data.is_preview
					setTimeout(function(){
						that.isPreview = 0
					},10000)
					that.baseData = res.data.result
					that.minDay = res.data.result.min_day
					if(Object.keys(res.data.result.old_data_list).length>0){
						that.fansAdd0.xAxisData = res.data.result.old_data_list.add_day
						that.fansAdd.xAxisData = res.data.result.old_data_list.add_day
						that.fansAdd1.xAxisData = res.data.result.old_data_list.add_day
						that.fansAdd2.xAxisData = res.data.result.old_data_list.add_day
						that.fansAdd0.seriesData[0].data = res.data.result.old_data_list.day_monetary
						that.fansAdd.seriesData[0].data = res.data.result.old_data_list.day_add_user_number
						that.fansAdd1.seriesData = res.data.result.old_data_list.day_consumption_number
						that.fansAdd2.seriesData = res.data.result.old_data_list.day_interaction_number
					}
				}
			},
			async barFun (){//销售额、拉新量柱状图数据
				let that = this;
				that.isLoading = true;
				const {data: res} = await that.axios.post("shop-customer/all-columnar", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					start_date: that.startValue,
					end_date: that.endValue
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					
					that.saleBarData = res.data.result
					that.saleBar.xAxisData = res.data.result.day
					if(that.saleBarTab==1){
						that.saleBar.seriesData = res.data.result.monetary
					}else if(that.saleBarTab==2){
						that.saleBar.seriesData = res.data.result.add_user_number
					}
					
				}
			},
			async shopSale (){//拉新销售排行榜
				let that = this;
				that.isLoading = true;
				const {data: res} = await that.axios.post("shop-customer/guide-rank", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					start_date: that.startValue,
					end_date: that.endValue
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					
					that.customList = res.data.add_user_list
					that.saleList = res.data.monetary_list
				}
			},
			async gardeFun (pid){//无限分组数据数据
				let that = this;
				that.isLoading = true;
				const {data: res} = await that.axios.post("shop-customer/group-line", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					pid: pid?pid:that.pid,
					month: that.searchMonth
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					
					that.ereaList = res.data
					that.pid = pid?pid:that.pid
					let nowPid = pid?pid:that.pid
					if(res.data[0].have_child == 1){//有子分组
						if(nowPid == 0){
							that.tabData = [res.data[0]]
							that.isChild = true
						}else{
							that.tabData = that.tabData.concat(res.data[0])
							for(let i=0;i<that.tabData.length;i++){
								if (that.tabData[i].group_id == nowPid) {
									that.tabData.splice(i+1,that.tabData.length,res.data[0])
									that.isChild = true
								}
							}
						}
					}else{
						if(nowPid == 0){
							that.tabData = []
						}
						that.isChild = false
					}
					that.store_str = res.data[0].store_str
					this.lineFun(res.data[0].store_str)
				}
			},
			async gardeFun1 (pid){//无限分组数据数据
				let that = this;
				that.isLoading = true;
				const {data: res} = await that.axios.post("shop-customer/group-line", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					pid: pid?pid:that.pid,
					month: that.searchMonth
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					
					that.ereaList = res.data
				}
			},
			async lineFun (store_str){//客户增长折线图数据
				let that = this;
				that.isLoading = true;
				const {data: res} = await that.axios.post("shop-customer/group-month-data", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					store_str: store_str,
					month: that.searchMonth
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					
					that.fansAdd3.xAxisData = res.data.add_day
					that.fansAdd3.seriesData[0].data = res.data.add_user_number
					that.fansAdd3.seriesData[1].data = res.data.monetary
				}
			},
			
			tipOpen(){//打开页面提醒
				this.tipVisible = true
			},
			tipClose(){//关闭页面提醒
				this.tipVisible = false
			},
		},
		mounted() {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				// 初始化时间
				this.startValue = getWeekStartDate()
				this.endValue = getWeekEndDate()
				this.dateValue = [moment(this.startValue, 'YYYY-MM-DD'), moment(this.endValue, 'YYYY-MM-DD')]
			
				this.baseFun()
				this.barFun()
				this.shopSale()
				this.gardeFun()
			});
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	.custom-statis{
		width: 100%;
		height: 100%;
	}
	.ant-layout-content{
		margin: 20px;
		min-width: 885px;
	}
	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		text-align: left;
		margin-bottom: 20px;
	}
	.content {
		margin-top: 20px;
		width: 100%;
		min-width: 885px;
		background: #FFF;
	}
	.content-hd{
		.ant-col:first-child{
			.panel-item{
				margin-left: 0;
			}
		}
		.ant-col:last-child{
			.panel-item{
				margin-right: 0;
			}
		}
		.panel-item{
			border: 1px solid #E2E2E2;
			padding: 20px;
			margin: 0 10px;
			.panel-t{
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.panel-m{
				.panel-num{
					font-size: 25px;
					font-weight: 600;
				}
				.panel-echart{
					width: 100%;
					height: 50px;
					.echarts{
						min-height: 130px;
						height: 130px;
						/deep/canvas{
							margin-top: -45px!important;
							margin-left: -20px!important;
						}
					}
				}
			}
			.panel-b{
				display: flex;
				justify-content: space-between;
				align-items: center;
				span{
					margin-right: 10px;
				}
				img{
					margin: 0px 5px 3px;
					width: 9px;
				}
			}
		}
	}
	.content-td{
		/deep/.ant-tabs-bar{
			background-color: #FFFFFF;
			border-bottom: 1px solid #e8e8e8;
		}
		.ant-radio-button-wrapper{
			text-align: center;
			width: 60px;
		}
	}
	.content-md{
		/deep/.ant-tabs-bar{
			background-color: #FFFFFF;
			border-bottom: 1px solid #e8e8e8;
			display: flex;
			justify-content: space-between;
			height: 40px;
		}
		/deep/.ant-tabs-extra-content{
			font-size: 15px;
			font-weight: 600;
		}
		/deep/.ant-table-thead > tr > th, /deep/.ant-table-tbody > tr > td{
			padding: 8px 16px;
		}
		.sale-list{
			margin-bottom: 22px;
			&:last-child{
				margin-bottom: 0;
			}
			.sort{
				width: 20px;
				height: 20px;
				text-align: center;
				line-height: 20px;
				display: block;
				background-color: rgba(0,0,0,.1);
				border-radius: 50%;
				&.active{
					background-color: rgba(0,0,0,1);
					color: #FFFFFF;
				}
			}
		}
	}
	.content-bd{
		/deep/.ant-tabs-bar{
			background-color: #FFFFFF;
			border-bottom: 1px solid #e8e8e8;
		}
		/deep/.ant-tabs-content{
			display: none;
		}
		.progress-area{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: auto;
			.go-left,.go-right{
				flex-shrink: 0;
				width: 30px;
				height: 100px;
				text-align: center;
				line-height: 100px;
				border-right: 1px solid #eaeaea;
				color: #999999;
				background-color: #FFFFFF;
			}
			.go-right{
				border-left: 1px solid #eaeaea;
				border-right: none;
			}
			.progress-content{
				width: calc(100% - 60px);
				min-height: 220px;
				overflow: hidden;
				position: relative;
				.progress-warper{
					position: absolute;
					left: 0;
					top: 0;
					z-index: 0;
					width: 100%;
					height: 100%;
					display: flex;
				}
				.progress-item{
					width: 200px;
					flex-shrink: 0;
					box-sizing: border-box;
					padding: 20px 10px 20px 20px;
					border-top: 2px solid #FFFFFF;
					margin-right: 20px;
					.progress-chiled{
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						.progress-name{
							max-width: 90px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
					.progress-chiled-sale{
						margin-top: 12px;
					}
					&.active{
						border-top: 2px solid #01b065;
						.progress-r{
							.circle-color{
								stroke: #01b065;
							}
						}
					}
					&:last-child{
						margin-right: 0;
					}
					.progress-l{
						font-size: 12px;
						color: #AAAAAA;
						.progress-name{
							font-size: 16px;
							color: #666666;
							margin-bottom: 10px;
						}
						.progress-num{
							font-size: 22px;
							color: #333333;
						}
					}
					.progress-r{
						svg{
							-webkit-transform: rotate(-90deg);
							-moz-transform: rotate(-90deg);
							-ms-transform: rotate(-90deg);
							-o-transform: rotate(-90deg);
							transform: rotate(-90deg);
							-webkit-transform-origin: 50% 50%;
							-moz-transform-origin: 50% 50%;
							-ms-transform-origin: 50% 50%;
							-o-transform-origin: 50% 50%;
							transform-origin: 50% 50%;
						}
						.circle-grey {
							stroke: #DFDFDF;
							stroke-width: 12px;
							fill: none;
						}
						.circle-color {
							stroke: #99d5fd;
							stroke-width: 12px;
							fill: none;
							-webkit-transition: stroke-dashoffset 1s linear;
							-moz-transition: stroke-dashoffset 1s linear;
							-o-transition: stroke-dashoffset 1s linear;
							transition: stroke-dashoffset 1s linear;
						}
					}
				}
			}
		}
		.echarts-area{
			margin-top: 12px;
		}
	}
	.page-tip{
		position: fixed;
		right: 10px;
		bottom: 18%;
		z-index: 10000;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		box-shadow: 2px 2px 5px #d3d6da;;
		.anticon{
			font-size: 30px;
		}
	}
	
</style>
