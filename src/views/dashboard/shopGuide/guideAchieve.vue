<template>
	<div class="achieve">
		<a-layout style="position: relative; height: 100%; overflow: hidden">
			<a-layout class="scroll" style="position: absolute;left: 0;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;">
				<!-- 头部 -->
				<a-layout-header>导购业绩</a-layout-header>
				<!-- 内容 -->
				<a-layout-content>
					<div style="padding: 15px 20px;background: #FFF;">
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								1、首先需要有第三方应用中配置相关应用，导入商城订单。
							</p>
							<p style="margin-bottom: 2px;">
								2、根据导购设置的设置以及订单中的参数，会自动计入导购的业绩，具体明细以<router-link to="/shopCustom/CustomOrder">【顾客订单】</router-link>中为准。
							</p>
							<p style="margin-bottom: 2px;">
								3、退款相关数据是可能随时变化的。
							</p>
							<p style="margin-bottom: 2px;">
								4、查询日期只可以查询截止昨天的数据，也可以按照自然周和自然月进行查询。
							</p>
						</div>
						<div class="content-hd">
							<span class="select-option">
								<a-button style="width: 210px;margin-right: 5px;" @click="showStoreModal" v-if="storeIds.length == 0">
									<span>选择门店</span>
								</a-button>
								<template v-if="storeIds.length > 0">
									<a-popover placement="right">
										<span slot="content">
											<div style="max-width: 375px;">
												<a-tag color="orange" 
													v-for="(item,index) in storeDetail"
													style="display: inline-block; margin: 0 10px 5px 0;" :key="index">
													{{item.title}}
												</a-tag>
											</div>
										</span>
										<a-button @click="showStoreModal" style="width: 210px;margin-right: 5px;">
											已选择{{storeIds.length}}个门店
										</a-button>
									</a-popover>
								</template>
							</span>
							<span class="select-option">
								<label>快速搜索：</label>
								<a-input placeholder="员工姓名/昵称/手机号" @keyup.enter="searchStaff" v-model="keyWord"></a-input>
							</span>
							<span class="select-option">
								<a-button type="primary" style="margin-right: 5px;" @click="searchStaff">查找</a-button>
								<a-button style="margin-right: 10px;" @click="reset">清空</a-button>
							</span>
							<span class="select-option" style="float: right;">
								<a-button type="primary" @click="exportSearch">搜索结果导出</a-button>
							</span>
						</div>
						<div class="card-caledar">
							<div style="margin-left: 5px;"
								class="day-picker-contain picker-contain">
								<a-button :class="timeType== '1'? 'caledar-btn-selected': '' "
									@click="changeFansTimeType1(1)">
									按日
								</a-button>
								<a-range-picker
										style="width: 270px;"
										:allowClear='false'
										:disabledDate="disabledDateDay"
										:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
										format="YYYY-MM-DD"
										v-if="timeType=='1'"
										v-model="dayDate"
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
								<!-- <a-week-picker
										:allowClear='false'
										:value='weekEnd'
										:disabledDate="disabledDateWeek"
										v-if="timeType=='2'"
										@change="changeFansEndWeek1"
								/> -->
							</div>
							<div class="month-picker-contain picker-contain">
								<a-button :class="timeType== '3'? 'caledar-btn-selected': '' "
									@click="changeFansTimeType1(3)">
									按月
								</a-button>
								<a-month-picker
									format="YYYY/MM"
									:default-value="moment(now, 'YYYY/MM')"
									:disabled-date="disabledDate"
									v-if="timeType=='3'"
									@change="changeMonth($event)" 
								/>
							</div>
						</div>
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table 
									:columns="columns"
									:dataSource="customList"
									:pagination="false">
									<template slot="about_money" slot-scope="text">￥{{text}}</template>
									<template slot="back_money" slot-scope="text">￥{{text}}</template>
									<a slot="custom_amount" slot-scope="text">{{text}}</a>
									<template slot="handle" slot-scope="text, record">
										<a @click="lookDetail(record.id,record.store_id)">查看订单详情</a>
									</template>
								</a-table>
								
								<div style="padding: 0 15px;">
									<!--分页 -->
									<div class="pagination" style="margin: 20px 0px;overflow:hidden;"
										v-show="total > 0">
										<div class="pagination" style="display: inline-block;height: 32px;float: right;">
											<a-pagination :total="total" showSizeChanger
												:showQuickJumper="quickJumper"
												:current="page"
												:pageSize="pageSize"
												:pageSizeOptions="['15','30','50','100']"
												@change="changePage"
												@showSizeChange="showSizeChange"/>
										</div>
									</div>
								</div>
							</a-spin>
						</div>
					</div>
					<!-- 门店或分组 -->
					<store-list 
						:groupVisible="storeVisible" 
						:storeIds="JSON.parse(JSON.stringify(storeIds))"
						:storeDetail="JSON.parse(JSON.stringify(storeDetail))"
						@setGroupId="setGroupId"></store-list>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
	import moment from 'moment'
	import storeList from '@/components/storeGroup/CheckboxIndex';//选择门店或分组
	
	const columns = [
		{
			title      : "姓名",
			dataIndex  : "name",
			key        : "name",
		},
		{
			title      : "所属门店",
			dataIndex  : "group_name",
			key        : "group_name",
			ellipsis: true,
		},
		{
			title      : "关联订单数",
			dataIndex  : "num",
			key        : "num",
		},
		{
			title      : "关联销售额",
			dataIndex  : "amount",
			key        : "amount",
			scopedSlots: {customRender: "about_money"},
		},
		{
			title      : "退款数",
			dataIndex  : "refund_num",
			key        : "refund_num",
		},
		{
			title      : "退款金额",
			dataIndex  : "refund",
			key        : "refund",
			scopedSlots: {customRender: "back_money"},
		},
		{
			title      : "操作",
			scopedSlots: {customRender: "handle"},
		}
	];
	export default{
		name: "guideAchieve",
		components:{
			storeList,
		},
		data(){
			return {
				moment,
				now: new Date(),
				keyWord: '',
				
				timeType: 1,//时间类型
				fansAddTime        : {
					ds_date: moment().subtract(8, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52,
					ms_date: moment().startOf('month').format("YYYY-MM-DD"),
					me_date: moment(new Date()).format('YYYY-MM-DD')
				},
				dayDate: [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
				weekStart: moment().subtract(7, 'days'),
				weekEnd: moment().subtract(7, 'days'),
				
				isLoading: false,//Loading 组件显示与隐藏
				columns,//表头
				customList:[],//表格信息
				page: 1, //页码
				pageSize: 15,//分页个数
				total: 1, //总条数
				quickJumper: false, // 是否显示快速跳转的控件
				
				storeVisible: false, // 选择门店或分组弹窗显示
				storeIds: [], // 选择的门店或分组列表
				storeDetail: [], // 选择门店或分组弹窗的数据
			}
		},
		methods: {
			lookDetail(id,store_id){
				let that = this
				let start_time = that.fansAddTime.ds_date,
					end_time = that.fansAddTime.de_date;
				if (that.timeType == 1) {
					start_time = that.fansAddTime.ds_date
					end_time = that.fansAddTime.de_date
				} else if (that.timeType == 2) {
					start_time = that.fansAddTime.ws_date
					end_time = that.fansAddTime.we_date
				} else if (that.timeType == 3) {
					start_time = that.fansAddTime.ms_date
					end_time = that.fansAddTime.me_date
				}
				this.$router.push("/shopCustom/CustomOrder?id=" + id + "&store_id=" + store_id + "&start_time=" + start_time + "&end_time=" + end_time)
			},
			disabledDate (current) {//日期禁止部分
				return current && current > moment().endOf('month');
			},
			disabledDateDay (current) {
				// return current.valueOf() > new Date().getTime() - 86400000 || current < moment().subtract(31, "days");
				return current.valueOf() > new Date().getTime() - 86400000;
			},
			disabledDateWeek (current) {
				let weekOfday = moment(new Date()).format('E')
				// return current.valueOf() > moment(new Date()).subtract(weekOfday, 'days') || current < moment().subtract(365, "days");
				return current.valueOf() > moment(new Date()).subtract(weekOfday, 'days');
			},
			changeFansTimeType1 (type) {//时间类型切换
				if (this.timeType != type) {
					this.spinning = true
					this.timeType = type;
					this.getCustomList(this.page, this.pageSize);
				}
			},
			changeFansTime1 (date, dateString) {
				this.spinning = true
				if (this.timeType == 1) {
					this.fansAddTime.ds_date = dateString[0]
					this.fansAddTime.de_date = dateString[1]
				}
				this.getCustomList(this.page, this.pageSize);
			},
			changeFansStartWeek1 (date, dateString) {// 改变起始周
				this.spinning = true
				if (date > this.weekEnd) {
					// this.weekStart = moment(JSON.parse(JSON.stringify(this.weekEnd)))
					this.weekStart = date
					this.weekEnd = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart).format('E')
					this.fansAddTime.ws_date = moment(this.weekStart).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd).format('E')
					this.fansAddTime.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime.ws_week = moment(this.fansAddTime.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekStart = date
					this.weekEnd = moment(JSON.parse(JSON.stringify(date)))
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekStart).format('E')
					this.fansAddTime.ws_date = moment(this.weekStart).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					this.fansAddTime.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					// if (this.fansAddTime.we_date > moment().format("YYYY-MM-DD")) {
					// 	this.fansAddTime.we_date = moment().format("YYYY-MM-DD")
					// }
					this.fansAddTime.ws_week = weekDay
				}
				this.getCustomList(this.page, this.pageSize);
			},
			
			changeFansEndWeek1 (date, dateString) {// 改变结束周
				this.spinning = true
				if (date < this.weekStart) {
					this.weekEnd = moment(JSON.parse(JSON.stringify(this.weekStart)))
					this.weekStart = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart).format('E')
					this.fansAddTime.ws_date = moment(this.weekStart).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd).format('E')
					this.fansAddTime.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime.ws_week = moment(this.fansAddTime.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekEnd = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekEnd).format('E')
					this.fansAddTime.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					this.fansAddTime.we_week = weekDay
				}
				this.getCustomList(this.page, this.pageSize);
			},
			changeMonth(date, dateString){//月份选择
				let that = this;
				if(moment(new Date()).format('MM') == date.format("MM")){
					that.fansAddTime.me_date = moment(new Date()).format('YYYY-MM-DD')
				}else {
					that.fansAddTime.me_date = moment([date.format("YYYY"), 0, 31]).month(date.format("MM")-1).format("YYYY-MM-DD")
				}
				that.fansAddTime.ms_date = moment(date.format("YYYY-MM")).format('YYYY-MM-DD')
				that.getCustomList(that.page, that.pageSize);
			},
			searchStaff(){//查找
				this.getCustomList();
			},
			reset(){//清空
				let that = this
				that.keyWord = ""
				
				that.storeIds = []
				that.storeDetail = []
				
				that.getCustomList();
			},
			exportSearch(){//导出搜索结果
				this.getCustomList(this.page, this.pageSize,1);
			},
			//获取表格内容
			async getCustomList (page = 1, pageSize = this.pageSize,is_export) {
				this.isLoading = true;
				let that = this
				let params={
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					page: page,
					page_size: pageSize,
					store_id: that.storeIds.toString(),
					guide_keyword: that.keyWord,
					is_export: is_export?is_export:0
				}
				if (that.timeType == 1) {
					params.start_time = that.fansAddTime.ds_date
					params.end_time = that.fansAddTime.de_date
					that.dayDate = [moment(that.fansAddTime.ds_date), moment(this.fansAddTime.de_date)]
				} else if (that.timeType == 2) {
					params.start_time = that.fansAddTime.ws_date
					params.end_time = that.fansAddTime.we_date
				} else if (that.timeType == 3) {
					params.start_time = that.fansAddTime.ms_date
					params.end_time = that.fansAddTime.me_date
				}
				const {data: res} = await that.axios.post("shop-customer-guide/achievement", params);
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					
					if(is_export==1){
						window.open(res.data.url);
					}else{
						this.customList = res.data.result;
						this.total = parseInt(res.data.count);
						this.page = page;
						this.pageSize = pageSize;
						this.quickJumper = this.total > this.pageSize;
					}
				}
			},
			changePage (page, pageSize) {// 分页
				this.getCustomList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 40)
				})
			},
			showSizeChange (page, pageSize) {//改变每页条数
				this.getCustomList(1, pageSize);
			},
			
			showStoreModal() {// 展示门店列表弹窗
				this.storeVisible = true
			},
			setGroupId (evt, ids, stores) {// 确认门店回调
				if (evt == 'ok') {
					this.storeIds = JSON.parse(JSON.stringify(ids))
					this.storeDetail = JSON.parse(JSON.stringify(stores))
				}
				this.storeVisible = false
			},
			
		},
		mounted() {
			this.$store.dispatch('getCorp', (info) => {
			
				this.getCustomList()
			});
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	.achieve{
		width: 100%;
		height: 100%;
	}
	.ant-layout-header{
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}
	
	.ant-layout-content{
		margin: 20px;
		min-width: 885px;
		background-color: #FFFFFF;
	}
	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		text-align: left;
		margin-bottom: 20px;
	}
	.content-hd {
		margin-top: 20px;
		width: 100%;
		min-width: 885px;
		.select-option{
			display: inline-block;
			margin-right: 10px;
			margin-bottom: 10px;
			label{
				margin-right: 5px;
				display: inline-block;
				text-align: right;
				width: 100px;
			}
			.ant-input,.ant-select{
				margin-right: 5px;
				width: 210px;
			}
		}
	}
	.card-caledar {
		line-height: 50px;
		padding: 12px 16px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		background: #F7F7F7;
		border: 1px solid #E9E9E9;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		color: #686868;
	}
	
	.card-caledar .picker-contain {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}
	.card-caledar .picker-contain button {
		margin: 0px 0px 0px 5px;
	}
	.picker-contain .caledar-btn-selected {
		boder: 0;
		border-right: 1px solid #3B74FF;
		background: #3B74FF;
		border-radius: 0;
		color: #FFF;
	}
	/deep/ .ant-input {
		border-radius: 0px !important;
	}
	
	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}
</style>
