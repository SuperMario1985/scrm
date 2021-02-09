<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y:auto;padding-bottom: 30px;">
		<div style="height: 100%;">
			<!-- <a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">红包统计</label>
			</a-card> -->
			<div style="margin: 20px 20px 0;background: #FFF;padding-bottom: 20px;">
				<div class="account-filter" v-if="corpInfo && corpInfo.length > 0">
					<a-tabs class="wx-list-tab" type="card" v-model="corpId" @change="changeCorpId"
					        style="width: 100%;">
						<a-tab-pane v-for="(item, index) in corpInfo" :key="item.corpid">
							<div slot="tab">
								<a-tooltip placement="top">
									<template slot="title">
										<span>{{item.corp_name}}</span>
									</template>
									<img style="width: 24px; height: 24px;" src="../../../assets/WeChatLogo.png"/>
									{{item.corp_name}}
								</a-tooltip>
							</div>
						</a-tab-pane>
					</a-tabs>
				</div>
				<div class="single-accout-card">
					<div class="single-accout-cardItem account-type">
						<div>支出金额/笔数（{{cardData.search_time}}）</div>
						<div style="color: rgb(255, 86, 45);font-size: 20px;line-height:36px;">
							￥{{cardData.search_money}}
						</div>
						<div style="text-align: right;color: rgb(59, 116, 255);font-size: 18px;">
							{{cardData.search_num}}笔
						</div>
					</div>
					<div class="single-accout-cardItem account-type">
						<div>累计支出金额/笔数</div>
						<div style="color: rgb(255, 86, 45);font-size: 20px;line-height:36px;">￥{{cardData.all_money}}
						</div>
						<div style="text-align: right;color: rgb(59, 116, 255);font-size: 18px;">{{cardData.all_num}}笔
						</div>
					</div>
				</div>
				<!--			<div class="content-msg">-->
				<!--				<p style="margin-bottom: 0;">-->
				<!--					{{$store.state.siteName}}系统提供手机号、姓名、公司、年龄、性别、行业、爱好、生日及所在区域等15个通用属性字段，属性类型包括文本、单选、多选、日期等。系统通用字段只可修改使用状态和排序顺序（数值越大，在手机端展示越靠前）。</p>-->
				<!--			</div>-->
				<a-tabs type="card" style="margin: 0 20px;" v-model="type" @change="changeType">
					<a-tab-pane key="1" tab="日统计报表"></a-tab-pane>
					<a-tab-pane key="2" tab="月统计报表"></a-tab-pane>
				</a-tabs>
				<a-row style="margin-bottom:10px;padding:20px;background: #F7F7F7;border: 1px solid #E9E9E9;"
				       v-if="type == 1">
					<a-col style="float: left;">
						<a-range-picker @change="changeTime"
						                style="width: 215px;"
						                :value="dateValue"
						                :disabled-date="disabledDate"
						                format="YYYY-MM-DD"/>
						<a-radio-group v-model="cycleType" button-style="solid" @change="changeCycleType">
							<a-radio-button value="1">
								上一周
							</a-radio-button>
							<a-radio-button value="2" style="margin-left: 5px;">
								上一月
							</a-radio-button>
							<a-radio-button value="3" style="margin-left: 5px;">
								本周
							</a-radio-button>
							<a-radio-button value="4" style="margin-left: 5px;">
								本月
							</a-radio-button>
							<a-radio-button value="5" style="margin-left: 5px;">
								自定义
							</a-radio-button>
						</a-radio-group>
					</a-col>
					<a-col style="float: left;margin-left: 15px;">
						<a-select @change="changeSendType1" v-model="sendType1" showSearch optionFilterProp="children"
						          style="width: 160px;">
							<a-select-option :value="-1">全部</a-select-option>
							<a-select-option :value="1">客户群</a-select-option>
							<a-select-option :value="2">客户</a-select-option>
						</a-select>
						<span v-if="sendType1 == 1" style="width: 30px; height: 1px;background-color: #C3C3C3; display: inline-block;vertical-align: middle; margin: 0 2px;"></span>
						<chooseChat
								key="chat1"
								style="width: 160px;display: inline-block;"
								v-if="sendType1 == 1"
								:corp_id="corpId"
								:chat_id="chatId1"
								@changeSelect="selectStaffCallback1"></chooseChat>
					</a-col>
					<a-col style="float: left;margin-left: 15px;">
						<a-button type="primary" style="margin-right:15px;" @click="find">查找</a-button>
						<a-button @click="clear">清空</a-button>
					</a-col>
				</a-row>
				<a-row style="margin-bottom:10px;padding:20px;background: #F7F7F7;border: 1px solid #E9E9E9;"
				       v-if="type == 2">
					<a-col style="float: left;">
						<a-range-picker
								format="YYYY-MM"
								:value="value"
								:mode="mode"
								style="width: 215px;"
								@panelChange="handlePanelChange"
								@change="handleChange"
						/>
						<a-radio-group v-model="cycleType2" button-style="solid" @change="changeCycleType2">
							<a-radio-button value="1">
								去年
							</a-radio-button>
							<a-radio-button value="2" style="margin-left: 5px;">
								今年
							</a-radio-button>
							<a-radio-button value="3" style="margin-left: 5px;">
								自定义
							</a-radio-button>
						</a-radio-group>
					</a-col>
					<a-col style="float: left;margin-left: 15px;">
						<a-select @change="changeSendType2" v-model="sendType2" showSearch optionFilterProp="children"
						          style="width: 160px;">
							<a-select-option :value="-1">全部</a-select-option>
							<a-select-option :value="1">客户群</a-select-option>
							<a-select-option :value="2">客户</a-select-option>
						</a-select>
						<span v-if="sendType2 == 1" style="width: 30px; height: 1px;background-color: #C3C3C3; display: inline-block;vertical-align: middle; margin: 0 2px;"></span>
						<chooseChat
								key="chat2"
								style="width: 160px;display: inline-block;"
								v-if="sendType2 == 1"
								:corp_id="corpId"
								:chat_id="chatId2"
								@changeSelect="selectStaffCallback2"></chooseChat>
					</a-col>
					<a-col style="float: left;margin-left: 15px;">
						<a-button type="primary" style="margin-right:15px;" @click="find">查找</a-button>
						<a-button @click="clear">清空</a-button>
					</a-col>
				</a-row>
				<div class="content-bd-head">
					<a-dropdown>
						<a-menu slot="overlay" @click="chooseDownType">
							<a-menu-item key="0">当前页导出</a-menu-item>
							<a-menu-item key="1">全部导出</a-menu-item>
						</a-menu>
						<a-button icon="download" style="float: right;margin-top: 9px;" v-has="'redReconciliation-export'">导出
							<a-icon type="down"/>
						</a-button>
					</a-dropdown>
				</div>
				<!-- 表格部分 -->
				<div class="content-bd">
					<a-spin tip="Loading..." size="large" :spinning="isLoading">
						<div class="spin-content">
							<a-table
									:columns="columns"
									:dataSource="list"
									:pagination="false"
									:rowClassName="rowClassName"
							>
								<template slot="action" slot-scope="text, record, index">
									<a-button @click="detail(record.stime,record.etime,record.perdate)" v-has="'redReconciliation-info'">发放明细</a-button>
								</template>
							</a-table>
						</div>
						<!-- 分页 -->
						<div class="pagination" style="width: 100%;position: absolute;margin: 40px 0px;"
						     v-show="total > 0">
							<div style="height: 32px;float: left;line-height: 32px;">
								共
								<span style="color: blue">{{total}}</span>条
							</div>
							<div class="pagination" style="height: 32px;float: right;">
								<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
								              :current="page"
								              :pageSize="pageSize"
								              :pageSizeOptions="['15','30','50','100']"
								              @change="changePage"
								              @showSizeChange="showSizeChange"/>
							</div>
						</div>
					</a-spin>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';
	import chooseChat from '@/components/groupChat/ChooseStaffChat.vue'

	const columns = [
		{
			title    : "日期",
			dataIndex: "perdate",
			key      : "perdate"
		},
		{
			title    : "支出金额（元）",
			dataIndex: "smoney",
			key      : "smoney"
		},
		{
			title    : "支付笔数",
			dataIndex: "snum",
			key      : "snum"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];


	var now = new Date(); //当前日期
	var nowDayOfWeek = now.getDay(); //今天本周的第几天
	var nowDay = now.getDate(); //当前日
	var nowMonth = now.getMonth(); //当前月
	var nowYear = now.getYear(); //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //

	var lastMonthDate = new Date(); //上月日期
	lastMonthDate.setDate(1);
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
	var lastYear = lastMonthDate.getYear();
	var lastMonth = lastMonthDate.getMonth();

	// console.log(now, '当前日期')
	// console.log(nowDayOfWeek, '今天本周的第几天')
	// console.log(nowDay, '当前日')
	// console.log(nowMonth, '当前月')
	// console.log(nowYear, '当前年')
	// console.log(lastMonthDate, '上月日期')

	/*时间戳改日期--不传第二个参数返回年月日,传第二个参数返回年月日时分秒*/
	function formatDateTime (inputTime, type) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		if (type) {
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//2017-12-12 12:23:34
		} else {
			return y + '-' + m + '-' + d; //2017-12-12
		}
	}


	//获得某月的天数
	function getMonthDays (myMonth) {
		var monthStartDate = new Date(nowYear, myMonth, 1);
		var monthEndDate = new Date(nowYear, myMonth + 1, 1);
		var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
		return days;
	}

	//获得本周的开端日期
	function getWeekStartDate () {
		if (nowDayOfWeek == 0) {
			nowDayOfWeek = 7
		}
		var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
		return formatDateTime(weekStartDate);
	}

	//获得本周的停止日期
	function getWeekEndDate () {
		var weekEndDate = new Date(nowYear, nowMonth, nowDay);
		return formatDateTime(weekEndDate);
	}

	//获得本月的开端日期
	function getMonthStartDate () {
		var monthStartDate = new Date(nowYear, nowMonth, 1);
		return formatDateTime(monthStartDate);
	}

	//获得本月的停止日期
	function getMonthEndDate () {
		var monthEndDate = new Date(nowYear, nowMonth, nowDay);
		return formatDateTime(monthEndDate);
	}

	//获得上周开端时候
	function getLastWeekStartDate () {
		var lastWeekStartDate = moment().day(-6).format('YYYY-MM-DD')
		return lastWeekStartDate;
	}

	//获得上周停止时候
	function getLastWeekEndDate () {
		var lastWeekEndDate = moment().day(0).format('YYYY-MM-DD')
		return lastWeekEndDate;
	}

	//获得上月开端时候
	function getLastMonthStartDate () {
		let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
		if(lastMonth == 11) {
			lastMonthStartDate = new Date(nowYear - 1, lastMonth, 1);
		}
		return formatDateTime(lastMonthStartDate);
	}

	//获得上月停止时候
	function getLastMonthEndDate () {
		let lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
		if(lastMonth == 11) {
			lastMonthEndDate = new Date(nowYear - 1, lastMonth, getMonthDays(lastMonth));
		}
		return formatDateTime(lastMonthEndDate);
	}

	//获得本年开端时候
	function getYearStartDate () {
		var lastMonthStartDate = moment(new Date(now.getFullYear(), 0, 1)).format('YYYY-MM');
		return lastMonthStartDate;
	}

	//获得本年停止时候
	function getYearEndDate () {
		var lastMonthEndDate = moment(new Date(now.getFullYear(), nowMonth, nowDay)).format('YYYY-MM');
		return lastMonthEndDate;
	}

	//获得去年开端时候
	function getLastYearStartDate () {
		// var lastMonthStartDate = new Date(now.getFullYear() - 1, 0, 1);
		// return formatDateTime(lastMonthStartDate);
		var lastMonthEndDate = moment(new Date(now.getFullYear() - 1, 0, 1)).format('YYYY-MM');
		return lastMonthEndDate;
	}

	//获得去年停止时候
	function getLastYearEndDate () {
		// var lastMonthEndDate = new Date(now.getFullYear() - 1, 11, 31);
		// return formatDateTime(lastMonthEndDate);
		var lastMonthEndDate = moment(new Date(now.getFullYear() - 1, 11, 31)).format('YYYY-MM');
		return lastMonthEndDate;
	}

	export default {
		name      : "redPacketReconciliation",
		components: {chooseChat},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpInfo   : [],//企业微信列表
				corpId     : corpId,//企业微信选中的id
				isLoading  : false, //Loading 组件显示与隐藏
				commonUrl  : this.$store.state.commonUrl,//公共的链接
				chatId1    : '',
				chatId2    : '',
				sendType1  : -1,
				sendType2  : -1,
				//表格部分
				columns,
				page       : 1, //页码
				pageSize   : 15, //每页数据量，默认15
				//分页
				total      : 0, //总条数
				quickJumper: false, // 是否显示快速跳转的控件
				list       : [],//表格数据
				type       : '1',//1日统计，2月统计
				//起止时间
				dateValue  : [],
				startValue : null,
				endValue   : null,
				mode       : ['month', 'month'],
				value      : [],
				value2     : [],//月报表暂存修改的时间
				value3     : [],//日报表暂存修改的时间
				cycleType  : '3',//周期类型
				cycleType2 : '2',//月报表周期类型
				cardData   : '',//展示数据
				is_export  : 0,//导出传1，否则传0
				is_all     : 0,//0当前页导出，1全部导出
			};
		},
		methods   : {
			moment,
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//切换企业微信
			changeCorpId (value) {
				this.corpInfo.map((x) => {
					if (value == x.corpid) {
						this.$store.dispatch("changeCorp", x);
					}
				})
				this.isLoading = true;
				this.getList();
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			// 起止时间
			changeTime (date, dateString) {
				this.dateValue = date
				this.cycleType = '5'
				this.value3[0] = dateString[0]
				this.value3[1] = dateString[1]
			},
			getData () {
				let data = []
				if (this.cycleType == 1) {
					data[0] = moment(getLastWeekStartDate());
					data[1] = moment(getLastWeekEndDate());
				} else if (this.cycleType == 2) {
					data[0] = moment(getLastMonthStartDate());
					data[1] = moment(getLastMonthEndDate());
				} else if (this.cycleType == 3) {
					data[0] = moment(getWeekStartDate());
					data[1] = moment(getWeekEndDate());
				} else if (this.cycleType == 4) {
					data[0] = moment(getMonthStartDate());
					data[1] = moment(getMonthEndDate());
				} else if (this.cycleType == 5) {
					data = null;
				}
				this.dateValue = data;
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			//切换日、月报表
			changeType () {
				if (this.type == 1) {
					this.startValue = this.value3.length > 1 ? this.value3[0] : ''
					this.endValue = this.value3.length > 1 ? this.value3[1] : ''
					this.getData()
				} else if (this.type == 2) {
					this.startValue = this.value2.length > 1 ? this.value2[0] : ''
					this.endValue = this.value2.length > 1 ? this.value2[1] : ''
					this.getData2()
				}
				this.getList(1, 15)
			},
			//月报表
			getData2 () {
				let data = []
				if (this.cycleType2 == 1) {
					data[0] = moment(getLastYearStartDate());
					data[1] = moment(getLastYearEndDate());
				} else if (this.cycleType2 == 2) {
					data[0] = moment(getYearStartDate());
					data[1] = moment(getYearEndDate());
				} else if (this.cycleType2 == 3) {
					data = null;
				}
				this.value = data;
			},
			//切换周期
			changeCycleType () {
				if (this.cycleType == 1) {
					this.value3[0] = getLastWeekStartDate()
					this.value3[1] = getLastWeekEndDate()
				} else if (this.cycleType == 2) {
					this.value3[0] = getLastMonthStartDate()
					this.value3[1] = getLastMonthEndDate()
				} else if (this.cycleType == 3) {
					this.value3[0] = getWeekStartDate()
					this.value3[1] = getWeekEndDate()
				} else if (this.cycleType == 4) {
					this.value3[0] = getMonthStartDate()
					this.value3[1] = getMonthEndDate()
				} else if (this.cycleType == 5) {
					this.value3[0] = ''
					this.value3[1] = ''
				}
				this.getData()
			},
			//切换月报表周期
			changeCycleType2 () {
				if (this.cycleType2 == 1) {
					this.value2[0] = getLastYearStartDate()
					this.value2[1] = getLastYearEndDate()
				} else if (this.cycleType2 == 2) {
					this.value2[0] = getYearStartDate()
					this.value2[1] = getYearEndDate()
				} else if (this.cycleType2 == 3) {
					this.value2[0] = ''
					this.value2[1] = ''
				}
				this.getData2()
			},
			changeSendType1() {
				this.chatId1 = ''
			},
			changeSendType2() {
				this.chatId2 = ''
			},
			selectStaffCallback1(chatId1) {
				this.chatId1 = chatId1
			},
			selectStaffCallback2(chatId2) {
				this.chatId2 = chatId2
			},
			//点击搜索
			find () {
				if (this.type == 1) {
					if (this.value3.length > 0) {
						this.startValue = this.value3[0]
						this.endValue = this.value3[1]
					} else {
						this.startValue = ''
						this.endValue = ''
					}
				} else if (this.type == 2) {
					if (this.value2.length > 0) {
						this.startValue = this.value2[0]
						this.endValue = this.value2[1]
					} else {
						this.startValue = ''
						this.endValue = ''
					}
				}
				this.getList();
			},
			//点击清空
			clear () {
				if (this.type == 1) {
					this.sendType1 = -1
					this.chatId1 = ''
					this.startValue = getWeekStartDate()
					this.value3[0] = getWeekStartDate()
					this.endValue = getWeekEndDate()
					this.value3[1] = getWeekEndDate()
					this.cycleType = '3'
				} else if (this.type == 2) {
					this.sendType2 = -1
					this.chatId2 = ''
					this.startValue = getYearStartDate()
					this.value2[0] = getYearStartDate()
					this.endValue = getYearEndDate()
					this.value3[2] = getYearEndDate()
					this.cycleType2 = '2'
				}
				this.getData()
				this.getData2()
				this.getList();
			},
			//获取表格内容
			async getList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post(
					"send-money-manage/send-money-statistics",
					{
						uid       : localStorage.getItem("uid"),
						corp_id   : this.corpId,
						type      : this.type,
						send_stime: this.startValue,
						send_etime: this.endValue,
						page      : page,
						page_size : pageSize,
						is_export : this.is_export,
						is_all    : this.is_all,
						send_type  : this.type == 1 ? this.sendType1 : this.sendType2,
						chat_id    : this.type == 1 ? this.chatId1 : this.chatId2
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (this.is_export == 0) {
						this.list = res.data.money
						if (page == 1) {
							this.cardData = res.data
						}
						this.total = parseInt(res.data.count);
						this.page = page;
						this.pageSize = pageSize;
						this.quickJumper = this.total > this.pageSize;
					} else {
						window.open(res.data.url);
					}
				}
				this.isLoading = false;
				this.is_export = 0
				this.is_all = 0
			},
			// 分页
			changePage (page, pageSize) {
				this.is_export = 0
				this.is_all = 0
				this.getList(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.is_export = 0
				this.is_all = 0
				this.getList(1, pageSize);
			},
			//选择下载方式
			chooseDownType (e) {
				this.is_all = e.key
				this.is_export = 1
				this.getList()
			},
			//月报表日期选择
			handlePanelChange (value, mode) {
				this.value = value
				if (value[0].format('YYYY-MM') != this.startValue || value[1].format('YYYY-MM') != this.endValue) {
					this.cycleType2 = '3'
				}
				this.value2[0] = value[0].format('YYYY-MM')
				this.value2[1] = value[1].format('YYYY-MM')
				this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
			},
			handleChange (value) {
				this.value = value;
				if (value.length == 0) {
					this.cycleType2 = '3'
					this.value2 = []
				}
			},
			//查看明细
			detail (stime, etime, perdate) {
				this.$router.push("/redPacket/detailRecords?stime=" + stime + "&etime=" + etime + "&perdate=" + perdate)
			},
		},

		created () {
			let that = this
			this.$store.dispatch('getCorp', (info) => {
				that.corpInfo = info
				that.startValue = getWeekStartDate()
				this.value3[0] = getWeekStartDate()
				that.endValue = getWeekEndDate()
				this.value3[1] = getWeekEndDate()
				this.startValue = getYearStartDate()
				this.value2[0] = getYearStartDate()
				this.endValue = getYearEndDate()
				this.value2[1] = getYearEndDate()
				this.getList()
				this.getData()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path != '/redPacket/detailRecords') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					if (vm.type == 1) {
						vm.startValue = getWeekStartDate()
						vm.endValue = getWeekEndDate()
						vm.cycleType = '3'
					} else if (vm.type == 2) {
						vm.startValue = getYearStartDate()
						vm.endValue = getYearEndDate()
						vm.cycleType2 = '2'
					}
					vm.getData()
					vm.getData2()
					vm.getList();
				});
			}

			next()
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		border-bottom: 0;
		margin: 0 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		text-align: left;
		margin: 0 20px 20px;
	}

	.content-bd-head {
		margin: 0 20px 15px;
		background: #FFF;
		line-height: 50px;
		overflow: hidden;
	}

	.account-filter {
		height: 50px;
		background: #F7F7F7;
		border-top: 1px solid #E9E9E9;
		border-right: 1px solid #E9E9E9;
	}

	/deep/ .wx-list-tab .ant-tabs-nav-container {
		height: 50px !important;
	}

	/deep/ .wx-list-tab .ant-tabs-tab {
		height: 50px !important;
		line-height: 50px !important;
		margin-right: 0px !important;
		border: 0px !important;
		background-color: #F5F5F5 !important;
	}

	/deep/ .wx-list-tab .ant-tabs-tab div {
		max-width: 190px;
		min-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/deep/ .wx-list-tab .ant-tabs-tab-active {
		background-color: #FFFFFF !important;
		border-bottom: 0px !important;
	}

	.single-accout-card {
		margin: 20px;
		box-sizing: border-box;
		background: #F9F9F9;
		overflow: hidden;
	}

	.single-accout-card .single-accout-cardItem {
		width: 50%;
		float: left;
		height: 111px;
		padding: 20px;
		background: #F9F9F9;
		border: 1px solid #E9E9E9;
		border-left: 0;
	}

	.single-accout-card .single-accout-cardItem:first-child {
		border: 1px solid #E9E9E9;
	}

	/deep/ .ant-radio-button-wrapper {
		padding: 0 10px;
		width: auto;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0;
	}
</style>