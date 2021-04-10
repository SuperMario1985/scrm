<template>
	<div class="custom-order">
		<a-layout style="position: relative; height: 100%; overflow: hidden">
			<a-layout class="scroll" style="position: absolute;left: 0;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;">
				<!-- 头部 -->
				<a-layout-header>顾客订单</a-layout-header>
				<!-- 内容 -->
				<a-layout-content>
					<div style="padding: 15px 20px;background: #FFF;">
						<div class="content-msg">
							<p style="margin-bottom: 0px;">
								1、订单是来源多渠道业务系统订单导入的数据（<span style="color: red;">当前支持指定电商系统</span>，具体使用请联系客服了解），订单需要有明确的下单手机号信息才会视为有效订单，出现在下面，并同时新增顾客。
							</p>
							<p style="margin-bottom: 0px;">
								2、当前显示的是系统已存在数据，如果是批量导入，如接口批量拉取或者excel文件形式导入的订单，可能会对历史数据造成变更，相关统计数据就会收到影响。
							</p>
							<p style="margin-bottom: 0px;">
								3、订单归属导购只代表本条订单的所属情况，不说明当前顾客与导购的关联关系。判断标准可能依据导入订单时候携带的参数，也可能是基于系统导购的相关配置。具体见<router-link to="/shopCustom/guideSet">【导购设置】</router-link>
							</p>
							<p style="margin-bottom: 0px;">
								4、门店指的是scrm系统的门店，若订单导入时可匹配门店即显示。
							</p>
							<p style="margin-bottom: 0px;">
								5、邀请渠道是指企微员工发送商城链接的渠道（比如某群或者单聊）从而最终形成的成交，此功能需要业务系统的支持。
							</p>
						</div>
						<div class="content-hd">
							<div class="content-hd-box">
								<span class="select-option">
									<a-input placeholder="请输入订单号" v-model="orderNo"></a-input>
								</span>
								<span class="select-option">
									<a-input placeholder="手机号/支付尾号查询" v-model="phoneNum"></a-input>
								</span>
								<span class="select-option">
									<!-- <a-button @click="showDepartmentList" style="width: 210px;margin-right: 5px;">
										<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名导购，{{chooseDepartmentNum}}个部门</span>
										<span v-else>选择导购</span>
									</a-button> -->
									<chooseStaffSelect 
									style="width: 210px;margin-right: 5px;" 
									:index="0" :index2="0" :type="2" 
									ref="staff" 
									:callback="selectStaffCallback"></chooseStaffSelect>
								</span>
								<span class="select-option">
									<a-input placeholder="昵称/姓名" v-model="customName"></a-input>
								</span>
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
									<a-select
										showSearch
										optionFilterProp="children" 
										v-model="sourceVal"
									>
										<a-select-option :value="-1">选择来源</a-select-option>
										<a-select-option :value="item.id" v-for="(item,index) in sourceArr" :key="index">{{item.name}}</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<a-select
										showSearch
										optionFilterProp="children"
										v-model="payType"
									>
										<a-select-option :value="-1">支付方式</a-select-option>
										<a-select-option :value="item.id" v-for="(item,index) in payTypeArr" :key="index">{{item.name}}</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<a-range-picker
										:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
										format="YYYY-MM-DD HH:mm"
										allowClear
										style="width:320px;margin-right: 5px;"
										:disabled-date="disabledDate"
										v-model="searchTime"
										@change="changeTime($event)"
									/>
								</span>
								<span class="select-option">
									<a-button type="primary" style="margin-right: 5px;" @click="searchOrder">查找</a-button>
									<a-button style="margin-right: 10px;" @click="reset">清空</a-button>
								</span>
							</div>
						</div>
						
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table 
									:columns="columns"
									:dataSource="customList"
									:pagination="false" 
									v-has="'customOrder-list'">
									<span slot="pay_time" slot-scope="text">{{ text }}</span>
									<!-- <a slot="handle" @click="lookDetail(text)" slot-scope="text">查看详情</a> -->
								</a-table>
								
								<div style="padding: 0 15px;">
									<!--分页 -->
									<div class="pagination" style="margin: 20px 0px;overflow:hidden;"
										v-show="total > 0" v-has="'customOrder-list'">
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
					
					<!--部门选择框-->
					<chooseDepartment 
						ref="user" 
						:id="corpId" 
						:show="showModalDepartment" 
						:chooseNum="chooseNum" 
						:callback="modalVisibleChange" 
						:is_special="1"></chooseDepartment>
					<!-- 查看详情 -->
					<a-drawer
						title="支付详情" 
						placement="right" 
						:destroyOnClose='true'
						:width="500"
						@close="orderDetailClose" 
						:visible="orderDetailVisible">
						<div class="order-mes">
							<div class="order-title">订单信息</div>
							<div class="order-list">
								<div class="order-item">
									<label>商品名称：</label>
									<span>小额储值买单</span>
								</div>
								<div class="order-item">
									<label>支付金额：</label>
									<span>￥0.10</span>
								</div>
								<div class="order-item">
									<label>订单编号：</label>
									<span>332020121011444699592607571886</span>
								</div>
								<div class="order-item">
									<label>付款方式：</label>
									<span>卡券平台 - 余额支付</span>
								</div>
								<div class="order-item">
									<label>支付者：</label>
									<span>线下录入5963</span>
								</div>
								<div class="order-item">
									<label>支付时间：</label>
									<span>2016-09-05 15:00</span>
								</div>
								<div class="order-item">
									<label>支付状态：</label>
									<span>已支付</span>
								</div>
								<div class="order-item">
									<label>门店：</label>
									<span>啦啦啦啦啦</span>
								</div>
								<div class="order-item">
									<label>收款人：</label>
									<span>商家自己</span>
								</div>
								<div class="order-item">
									<label>订单备注：</label>
									<span>小额储值买单</span>
								</div>
								<div class="order-item">
									<label>订单金额：</label>
									<span>￥0.10</span>
								</div>
								<div class="order-item">
									<label>实付金额：</label>
									<span>￥0.10</span>
								</div>
								
							</div>
						</div>
						<div style="height: 117px;">
							<div :style="{
								position: 'absolute',
								right: 0,
								bottom: '64px',
								width: '100%',
								borderTop: '1px solid #e9e9e9',
								padding: '10px 16px',
								background: '#fff',
								textAlign: 'right',
								zIndex: 1,}">
								<a-button type="primary" @click="orderDetailClose">关闭</a-button>
							</div>
						</div>
					</a-drawer>
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
	import moment from 'moment';
	import chooseDepartment from "@/components/ChooseDepartment.vue";//部门选择框
	import chooseStaffSelect from "@/components/ChooseStaffSelect.vue";
	import storeList from '@/components/storeGroup/CheckboxIndex';//选择门店或分组
	
	const columns = [
		{
			title      : "顾客信息",
			dataIndex  : "customer",
			key        : "customer",
		},
		{
			title      : "来源",
			dataIndex  : "source",
			key        : "source",
			ellipsis: true,
		},
		{
			title      : "状态",
			dataIndex  : "status",
			key        : "status",
			ellipsis: true,
		},
		{
			title      : "订单号",
			dataIndex  : "order_no",
			key        : "order_no",
		},
		{
			title      : "订单额",
			dataIndex  : "payment_amount",
			key        : "payment_amount",
		},
		{
			title      : "支付方式",
			dataIndex  : "payment_method",
			key        : "payment_method",
		},
		{
			title      : "关联员工",
			dataIndex  : "guide_name",
			key        : "guide_name",
		},
		{
			title      : "门店",
			dataIndex  : "store_name",
			key        : "store_name",
			ellipsis: true,
		},
		{
			title      : "邀请渠道",
			dataIndex  : "from",
			key        : "from",
			ellipsis: true,
		},
		{
			title      : "支付时间",
			dataIndex  : "pay_time",
			key        : "pay_time",
			scopedSlots: {customRender: "pay_time"},
			width: "160px"
		},
		// {
		// 	title      : "操作",
		// 	dataIndex  : "handle",
		// 	key        : "handle",
		// 	scopedSlots: {customRender: "handle"},
		// }
	];
	export default{
		name: "CustomOrder",
		components:{
			chooseDepartment,
			chooseStaffSelect,
			storeList,
		},
		data(){
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				moment,
				corpId,//企业微信选中的id
				orderNo: '',//订单号
				phoneNum: '',//手机号/尾号
				guideList: [],//选择的导购
				guideListId: [],//选择的导购id
				chooseNum: 0,//导购成员总个数
				chooseUserNum: 0,//导购个数
				chooseDepartmentNum: 0,//导购部门个数
				customName: '',//姓名/昵称
				store_id: '',//门店id
				sourceArr: ['选择来源','有赞','淘宝','电商系统','订单导入'],
				sourceVal: -1,//来源
				payTypeArr:['支付方式','支付宝','微信','银行卡'],
				payType: -1,//支付方式
				searchTime: null,//查找日期
				start_time: '',//开始时间
				end_time: '',//结束时间
				cus_id: '',//顾客id
				
				showModalDepartment: false, //成员选择框显示与隐藏
				isLoading: false,//Loading 组件显示与隐藏
				columns,//表头
				customList:[],//表格信息
				page: 1, //页码
				pageSize: 15,//分页个数
				total: 1, //总条数
				quickJumper: false, // 是否显示快速跳转的控件
				
				orderDetailVisible: false,//订单详情侧边栏
				
				storeVisible: false, // 选择门店或分组弹窗显示
				storeIds: [], // 选择的门店或分组列表
				storeDetail: [], // 选择门店或分组弹窗的数据
			}
		},
		methods: {
			disabledDate (current) {//日期禁止部分
				return current && current > moment().endOf('day');
			},
			changeTime (date) {// 修改时间
				let that = this;
				that.searchTime = date
				that.start_time = this.searchTime[0].format("YYYY-MM-DD HH:mm")
				that.end_time = this.searchTime[1].format("YYYY-MM-DD HH:mm")
			},
			searchOrder(){//查找
				this.getCustomList()
			},
			reset(){//清空（重置）
				let that = this
				that.orderNo = ''
				that.phoneNum = ''
				that.guideList = []
				that.guideListId = []
				that.chooseNum = 0
				that.chooseUserNum = 0
				that.chooseDepartmentNum = 0
				that.$refs.staff.userId = []
				that.customName = ''
				that.store_id = ''
				that.cus_id = ''
				that.sourceVal = -1
				that.payType = -1
				that.searchTime = null
				that.start_time = ''
				that.end_time = ''
				
				that.storeIds = []
				that.storeDetail = []
				
				this.getCustomList();
			},
			showDepartmentList(){//导购弹窗
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.guideListId))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.guideList))
				
				this.showModalDepartment = true
			},
			modalVisibleChange(event, arr, userNum, departmentNum, list){
				if(event == "ok"){
					this.guideList = list
					this.guideListId = arr
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
				}
				this.showModalDepartment = false
			},
			selectStaffCallback(event, id){//选择导购客户绑定选择框回调
				if (event == "ok") {
					this.guideListId = id
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
					order_no: that.orderNo,
					buy_phone: that.phoneNum,
					guide_id: that.guideListId.toString(),
					nickname: that.customName,
					store_id: that.storeIds.length>0?that.storeIds.toString():that.store_id,
					source: that.sourceVal==-1?'':that.sourceVal,
					payment_method: that.payType==-1?'':that.payType,
					add_time_start: that.start_time,
					add_time_end: that.end_time,
					cus_id: that.cus_id
				}
				const {data: res} = await this.axios.post("shop-customer-order/list", params);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					
					this.sourceArr = res.data.source
					this.payTypeArr = res.data.pay_type
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
			lookDetail(id){//查看详情
				this.orderDetailVisible = true
			},
			orderDetailClose(){//关闭详情
				this.orderDetailVisible = false
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
				if(this.$route.query.id){
					this.guideListId = this.$route.query.id
					this.store_id = this.$route.query.store_id
					this.start_time = this.$route.query.start_time + ' 00:00'
					this.end_time = this.$route.query.end_time + ' 23:59'
				}
				if(this.$route.query.cus_id){
					this.cus_id = this.$route.query.cus_id
				}
				this.getCustomList()
			});
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	.custom-order{
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
		margin-top: 12px;
	}
	.content-hd {
		margin-top: 20px;
		width: 100%;
		min-width: 885px;
	}
	.content-hd-box{
		line-height: 40px;
	}
	.select-option{
		display: inline-block;
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.select-option input,.select-option .ant-select{
		margin-right: 5px;
		width: 210px;
	}
	
	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}
	
	.order-mes{
		margin: 12px;
		padding: 10px;
		border: 1px solid #E2E2E2;
		.order-title{
			font-weight: 600;
			font-size: 16px;
		}
		.order-list{
			color: #888888;
			.order-item{
				&:last-child,&:nth-last-child(2){
					font-weight: 600;
					font-size: 15px;
				}
				margin-top: 20px;
				label{
					width: 100px;
					text-align: right;
					display: inline-block;
				}
			}
		}
	}
	
	
</style>
