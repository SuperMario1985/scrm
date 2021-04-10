<template>
	<div class="share-set">
		<a-layout style="position: relative; height: 100%; overflow: hidden">
			<a-layout class="scroll" style="position: absolute;left: 0;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;">
				<!-- 头部 -->
				<a-layout-header>分享明细</a-layout-header>
				<!-- 内容 -->
				<a-layout-content>
					<div style="margin-top:20px;">
						<span @click="changeTab(1)" class="tabBtn" :class="{activeBtn:tabKey == 1}">聊天栏分享</span>
						<span @click="changeTab(2)" class="tabBtn" :class="{activeBtn:tabKey == 2}">群发</span>
					</div>
					<div v-show="tabKey == 1" style="padding: 15px 20px;background: #FFF;">
						<div class="content-msg">
							<p style="margin-bottom: 0px;">
								1、可以将某等级的所有用户全部移动到其他等级或者无等级。
							</p>
							<p style="margin-bottom: 0px;">
								2、要删除等级必须该等级下顾客数为0
							</p>
						</div>
						<div class="content-hd">
							<div class="content-hd-box">
								<div class="card-caledar">
									<div style="margin-left: 5px;"
										class="day-picker-contain picker-contain">
										<a-button :class="timeType== '1'? 'caledar-btn-selected': '' "
											@click="changeTimeType(1)">
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
											@change="changeTime"
										/>
									</div>
									<div class="week-picker-contain picker-contain">
										<a-button :class="timeType== '2'? 'caledar-btn-selected': '' "
											@click="changeTimeType(2)">
											按周
										</a-button>
										<a-week-picker
											:allowClear='false'
											:value='weekStart'
											:disabledDate="disabledDateWeek"
											v-if="timeType=='2'"
											@change="changeWeek"
										/>
									</div>
									<div class="month-picker-contain picker-contain">
										<a-button :class="timeType== '3'? 'caledar-btn-selected': '' "
											@click="changeTimeType(3)">
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
								<span class="select-option">
									<label>选择导购：</label>
									<a-input placeholder="导购姓名/手机号" @keyup.enter="searchStaff" v-model="customName"></a-input>
								</span>
								<span class="select-option">
									<label>选择群：</label>
									<a-select
										showSearch
										optionFilterProp="children" 
										placeholder="选择群(支持模糊搜索)"
										v-model="groupVal"
									>
										<a-select-option :value="-1">选择群(支持模糊搜索)</a-select-option>
										<a-select-option v-for="(item,index) in groupArr" :key="index">{{item}}</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<label>选择内容：</label>
									<a-select
										showSearch
										optionFilterProp="children"
										v-model="contentVal"
									>
										<a-select-option :value="-1">选择内容类型</a-select-option>
										<a-select-option v-for="(item,index) in contentArr" :key="index">{{item}}</a-select-option>
									</a-select>
								</span>
							</div>
							<div class="content-hd-list">
								<a-tag color="cyan">
									<template v-if="timeType==1">
										<span>发送时间：{{fansAddTime.ds_date}}至{{fansAddTime.ds_date}}</span>
									</template>
									<template v-if="timeType==2">
										<span>发送时间：{{fansAddTime.ws_date}}至{{fansAddTime.we_date}}</span>
									</template>
									<template v-if="timeType==3">
										<span>发送时间：{{fansAddTime.ms_date}}至{{fansAddTime.me_date}}</span>
									</template>
									<!-- <a-icon type="close-circle" @click="deleteTag('joinTime')"/> -->
								</a-tag>
								<a-tag color="red" v-if="customName">
									<span>导购：{{customName}}</span>
									<a-icon type="close-circle" @click="deleteTag('customName')"/>
								</a-tag>
								<a-tag color="orange" v-if="groupVal>-1">
									<span>在【{{groupArr[groupVal]}}】中</span>
									<a-icon type="close-circle" @click="deleteTag('groupVal')"/>
								</a-tag>
								<a-tag color="blue" v-if="contentVal>-1">
									<span>选择内容：{{contentArr[contentVal]}}</span>
									<a-icon type="close-circle" @click="deleteTag('contentVal')"/>
								</a-tag>
							</div>
							<div class="table-num">共发送<span>100</span>次，转化订单数<span>123</span>次，转化率<span>56%</span>，转化人数<span>90</span>人，总销售额<span>¥12313.12</span></div>
						</div>
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table 
									:columns="columns"
									:dataSource="customList"
									:pagination="false">
									<div slot="content_img" slot-scope="text, record">
										<a-popover placement="top" trigger="click">
											<template slot="content">
												{{record.send_name}}
											</template>
											<a>查看</a>
										</a-popover>
									</div>
									<div slot="sale_num" slot-scope="text">￥{{text}}</div>
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
					<div v-show="tabKey == 2" style="padding: 15px 20px;background: #FFF;">
						<div class="content-msg">
							<p style="margin-bottom: 0px;">
								1、会话相关的参数设置必须要依赖【会话存档】功能，未开启的情况下不可配置会话相关的参数。
							</p>
							<p style="margin-bottom: 0px;">
								2、顾客需要有消费明细的记录，否则无法使用额度维度，只可使用近度和频率维度，也无法设置按照消费订单相关的参数。
							</p>
							<p style="margin-bottom: 0px;">
								3、当前如果开启消费价值维度，需要先填写一个平均客单价和消费周期作为基准数据。
							</p>
							<p style="margin-bottom: 0px;">
								4、根据三个维度分别设置考量方式和基准数据，低于基准的此条判别为低，三个维度叠加形成评级级别。
							</p>
							<p style="margin-bottom: 0px;">
								5、会话频率，考量顾客有会话的次数，可以排除掉企微员工主动发起会话若干时间段之内的回复内容。
							</p>
							<p style="margin-bottom: 0px;">
								6、近度，考量的是顾客最后一次主动会话或者是消费，距离当前的天数。
							</p>
							<p style="margin-bottom: 0px;">
								7、额度，考量的是顾客平均消费客单价，为总消费额除以消费次数。开启了消费数据之后，顾客若没有消费记录，统一以额度为低来进行处理。
							</p>
						</div>
						<div class="content-hd">
							
						</div>
						<div class="content-bd">
							<a-button type="primary">保存</a-button>
						</div>
					</div>
					
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
	import moment from 'moment'
	const columns = [
		{
			title      : "发送时间",
			dataIndex  : "send_time",
			key        : "send_time",
		},
		{
			title      : "发送人",
			dataIndex  : "send_name",
			key        : "send_name",
			ellipsis: true,
		},
		{
			title      : "渠道类型",
			dataIndex  : "channel_type",
			key        : "channel_type",
		},
		{
			title      : "发送渠道",
			dataIndex  : "send_channel",
			key        : "send_channel",
		},
		{
			title      : "素材类型",
			dataIndex  : "mate_type",
			key        : "mate_type",
		},
		{
			title      : "内容类型",
			dataIndex  : "content_type",
			key        : "content_type",
		},
		{
			title      : "内容快照",
			scopedSlots: {customRender: "content_img"},
		},
		{
			title      : "转化订单数",
			dataIndex  : "order_num",
			key        : "order_num",
			scopedSlots: {customRender: "order_num"},
		},
		{
			title      : "转化人",
			dataIndex  : "transform_people",
			key        : "transform_people",
		},
		{
			title      : "销售额",
			dataIndex  : "sale_num",
			key        : "sale_num",
			scopedSlots: {customRender: "sale_num"},
		}
	];
	export default{
		name: "shareDetail",
		data(){
			return {
				moment,
				now: new Date(),
				tabKey: 1,//Tab切换，1（聊天栏分享），2（群发）
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
				
				customName: '',//导购姓名
				groupVal: -1,//群
				groupArr:['群一','群二','群三','群四','群五'],//群数组
				contentVal: -1,//选择内容
				contentArr: ['商品','页面','券'],
				
				isLoading: false,//Loading 组件显示与隐藏
				columns,//表头
				customList:[{
					key: 1,
					send_time: '2021-3-3 09:12:52',
					send_name: '李云莉(员工ID)',
					channel_type: '好友',
					send_channel: '顾客的微信昵称',
					mate_type: 'H5',
					content_type: '商品',
					order_num: 5,
					transform_people: 6,
					sale_num: 45646.36
				},{
					key: 2,
					send_time: '2021-3-5 14:37:52',
					send_name: '企微用户(员工ID)',
					channel_type: '群',
					send_channel: '合肥nike总群1',
					mate_type: '小程序',
					content_type: '页面',
					order_num: 8,
					transform_people: 12,
					sale_num: 8657
				}],//表格信息
				page: 1, //页码
				pageSize: 15,//分页个数
				total: 1, //总条数
				quickJumper: false, // 是否显示快速跳转的控件
			}
		},
		methods:{
			changeTab(type){//Tab切换
				this.tabKey = type
			},
			disabledDate (current) {//日期禁止部分
				return current && current > moment().endOf('month');
			},
			disabledDateDay (current) {//月禁止部分
				return current.valueOf() > new Date().getTime() - 86400000 || current < moment().subtract(31, "days");
			},
			disabledDateWeek (current) {//周禁止部分
				let weekOfday = moment(new Date()).format('E')
				return current.valueOf() > moment(new Date()).subtract(weekOfday, 'days') || current < moment().subtract(365, "days");
			},
			changeTimeType (type) {//日期类型切换
				if (this.timeType != type) {
					this.isLoading = true
					this.timeType = type;
					this.getCustomList(this.page, this.pageSize);
				}
			},
			changeTime (date, dateString) {//时间切换
				this.isLoading = true
				this.fansAddTime.ds_date = dateString[0]
				this.fansAddTime.de_date = dateString[1]
				this.getCustomList(this.page, this.pageSize);
			},
			changeWeek (date, dateString) {// 改变起始周
				this.isLoading = true
				if (date > this.weekEnd) {
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
					this.fansAddTime.ws_week = weekDay
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
			
			searchStaff(){//搜索
				
			},
			deleteTag(type){//删除标签
				let that = this;
				if(type == 'customName'){
					that.customName = ''
				}else if(type == 'groupVal'){
					that.groupVal = -1
				}else if(type == 'contentVal'){
					that.contentVal = -1
				}
			},
			//获取表格内容
			async getCustomList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				let that = this
				let params={
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					page: page,
					page_size: pageSize,
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
				console.log(params)
				that.isLoading = false;
				return
				const {data: res} = await that.axios.post("shop-customer-guide/achievement", params);
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					
					this.customList = res.data.result;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
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
			
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	.share-set{
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
		margin: 0 20px 20px;
		min-width: 885px;
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
		&.activeBtn {
			color: #1890FF;
			background: #FFF;
		}
	}
	
	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}
	
	.content-hd{
		margin-top: 20px;
		width: 100%;
		min-width: 885px;
	}
	.card-caledar {
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		color: #686868;
		margin-bottom: 10px;
		.picker-contain {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-align: center;
			-ms-flex-align: center;
			align-items: center;
			button {
				margin-left: 5px;
			}
			.caledar-btn-selected {
				border: 1px solid #3B74FF;
				background: #3B74FF;
				border-radius: 0;
				color: #FFF;
			}
			/deep/ .ant-input {
				border-radius: 0px !important;
			}
		}
	}
	.content-hd-box{
		line-height: 40px;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		.select-option{
			display: inline-block;
			margin-bottom: 10px;
			label{
				margin-right: 5px;
				display: inline-block;
				text-align: right;
				width: 100px;
			}
			input,.ant-select{
				margin-right: 5px;
				width: 210px;
			}
		}
	}
	.content-hd-list{
		display: flex;
		flex-wrap: wrap;
		margin-top: 12px;
		.ant-tag{
			margin-bottom: 8px;
			.anticon{
				margin-left: 8px;
			}
		}
	}
	.table-num{
		height: 32px;
		line-height: 32rpx;
		margin-top: 6px;
		span{
			color: #1890FF;
			margin: 0 3px;
		}
	}
	
	.content-bd{
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}
</style>
