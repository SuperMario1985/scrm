<template>
	<div class="custom">
		<a-layout style="position: relative; height: 100%; overflow: hidden; ">
			<a-layout class="scroll" style="position: absolute; top:0; bottom:0;left: 0; right:0; overflow-x: hidden; overflow-y: auto;">
				<!-- 头部 -->
				<a-layout-header>顾客管理</a-layout-header>
				<!-- 内容 -->
				<a-layout-content>
					<div style="padding: 15px 20px;background: #FFF;">
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								1、顾客包括企微用户和非企微用户，多个企微好友关系只会算为一个顾客，非企微用户必须有手机号，与企微用户如果手机号相同会合并。
							</p>
							<p style="margin-bottom: 2px;">
								2、为便于顾客管理，建议先设置客户等级和RFM评级的<router-link to="/shopCustom/CustomSet">相关设置。</router-link>
							</p>
							<p style="margin-bottom: 2px;">
								3、入库时间是指用户首次进入系统的时间，可能有两种情况，一是添加了企微好友，一是手机号作为非企微用户生成顾客。
							</p>
						</div>
						<div class="content-hd">
							<div class="content-hd-box">
								<span class="select-option">
									<label>快速搜索：</label>
									<a-input placeholder="顾客姓名/昵称/手机号" @keyup.enter="searchStaff" v-model="keyWord"></a-input>
								</span>
								<span class="select-option">
									<label>导购姓名：</label>
									<a-input placeholder="导购姓名/手机号" @keyup.enter="searchStaff" v-model="customName"></a-input>
								</span>
								<span class="select-option">
									<label>等级：</label>
									<a-select
										showSearch
										optionFilterProp="children" 
										placeholder="等级筛选"
										v-model="gradeVal"
									>
										<a-select-option :value="-1">等级筛选</a-select-option>
										<a-select-option v-for="(item,index) in gradeArr" :key="index">{{item.title}}</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<label>RFM评级：</label>
									<a-select
										showSearch
										optionFilterProp="children"
										v-model="rfmVal"
									>
										<a-select-option :value="-1">等级筛选</a-select-option>
										<a-select-option v-for="(item,index) in rfmArr" :key="index">{{item.default_name}}</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<label>添加时间：</label>
									<a-range-picker
										:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
										format="YYYY-MM-DD HH:mm"
										allowClear
										style="width:320px;margin-right: 5px;"
										:disabled-date="disabledDate"
										v-model="joinTime"
										@change="changeTime($event,'joinTime')"
									/>
								</span>
								<span class="select-option">
									<label>最后消费：</label>
									<a-range-picker
										:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
										format="YYYY-MM-DD HH:mm"
										allowClear
										style="width:320px;margin-right: 5px;"
										:disabled-date="disabledDate"
										v-model="moneyTime"
										@change="changeTime($event,'moneyTime')"
									/>
								</span>
								<span class="select-option">
									<label>最后互动：</label>
									<a-range-picker
										:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
										format="YYYY-MM-DD HH:mm"
										allowClear
										style="width:320px;margin-right: 5px;"
										:disabled-date="disabledDate"
										v-model="interaTime"
										@change="changeTime($event,'interaTime')"
									/>
								</span>
								<span class="select-option">
									<label>消费区间：</label>
									<a-input placeholder="金额下限" v-model="moneyDownLimit"></a-input>
									<a-input placeholder="金额上限" v-model="moneyUpLimit"></a-input>
								</span>
								<span class="select-option">
									<label>互动区间：</label>
									<a-input placeholder="次数下限" v-model="rateDownLimit"></a-input>
									<a-input placeholder="次数上限" v-model="rateUpLimit"></a-input>
								</span>
								<span class="select-option">
									<a-button type="primary" style="margin-right: 5px;" @click="searchStaff">查找</a-button>
									<a-button style="margin-right: 10px;" @click="reset">清空</a-button>
								</span>
							</div>
							<div class="content-hd-list">
								<a-tag color="pink" v-if="keyWord">
									<span>顾客：{{keyWord}}</span>
									<a-icon type="close-circle" @click="deleteTag('keyWord')"/>
								</a-tag>
								<a-tag color="red" v-if="customName">
									<span>导购：{{customName}}</span>
									<a-icon type="close-circle" @click="deleteTag('customName')"/>
								</a-tag>
								<a-tag color="orange" v-if="gradeVal>-1">
									<span>等级：{{gradeArr[gradeVal].title}}</span>
									<a-icon type="close-circle" @click="deleteTag('gradeVal')"/>
								</a-tag>
								<a-tag color="green" v-if="rfmVal>-1">
									<span>RFM评级：{{rfmArr[rfmVal].default_name}}</span>
									<a-icon type="close-circle" @click="deleteTag('rfmVal')"/>
								</a-tag>
								<a-tag color="cyan" v-if="joinTime">
									<span>添加时间：{{moment(this.joinTime[0]).format("YYYY-MM-DD")}}至{{moment(this.joinTime[1]).format("YYYY-MM-DD")}}</span>
									<a-icon type="close-circle" @click="deleteTag('joinTime')"/>
								</a-tag>
								<a-tag color="blue" v-if="moneyTime">
									<span>最后消费：{{moment(this.moneyTime[0]).format("YYYY-MM-DD")}}至{{moment(this.moneyTime[1]).format("YYYY-MM-DD")}}</span>
									<a-icon type="close-circle" @click="deleteTag('moneyTime')"/>
								</a-tag>
								<a-tag color="purple" v-if="interaTime">
									<span>最后互动：{{moment(this.interaTime[0]).format("YYYY-MM-DD")}}至{{moment(this.interaTime[1]).format("YYYY-MM-DD")}}</span>
									<a-icon type="close-circle" @click="deleteTag('interaTime')"/>
								</a-tag>
								<a-tag color="red" v-if="moneyDownLimit || moneyUpLimit">
									<span>消费区间：{{moneyDownLimit}}<span v-if="moneyDownLimit&&moneyUpLimit">至</span>{{moneyUpLimit}}</span>
									<a-icon type="close-circle" @click="deleteTag('moneyLimit')"/>
								</a-tag>
								<a-tag color="green" v-if="rateDownLimit || rateUpLimit">
									<span>互动区间：{{rateDownLimit}}<span v-if="rateDownLimit&&rateUpLimit">至</span>{{rateUpLimit}}</span>
									<a-icon type="close-circle" @click="deleteTag('rateLimit')"/>
								</a-tag>
							</div>
							<div class="table-num">共<span>{{total}}</span>位顾客</div>
						</div>
						
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table 
									:rowSelection="rowSelection"
									:columns="columns"
									:dataSource="customList"
									:pagination="false"
									v-has="'shopCustomManage-list'">
									<div slot="name" slot-scope="text">{{text}}</div>
									<div slot="type" slot-scope="text">{{text}}</div>
									<div slot="add_time" slot-scope="text">{{text}}</div>
									<div slot="guide" slot-scope="text, record">
										<span>
											<span v-if="text.length==0">--</span>
											<span v-else-if="text.length==1">{{text[0].guide_name}}</span>
											<span v-else>更多导购</span>
											
											<a-icon type="form" style="margin-left:5px;cursor: pointer;" @click="setGuide('list',record)" v-has="'shopCustomManage-set'" />
										</span>
										<!-- <a-popover title="查看导购" trigger="hover" v-if="text.length>1">
											<template slot="content">
												<p @click="setGuide('list',record)" style="cursor: pointer;" 
												v-for="(item,index) in text" 
												:key="index">{{item.guide_name}}</p>
											</template>
											<a style="margin-left: 10px;">更多</a>
										</a-popover> -->
									</div>
									<div slot="amount" slot-scope="text, record">
										<router-link :to="'/shopCustom/CustomOrder?cus_id='+record.id">{{text}}</router-link>
									</div>
									<div slot="amount2">
										消费额
										<a-tooltip placement="bottom">
											<template slot="title">
												<div>指的是这个顾客全渠道的订单合计金额，无需有关联导购</div>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</div>
									<div slot="level_name" slot-scope="text, record" :style="{color: record.level_color}">{{text}}</div>
									<div slot="rfm_name" slot-scope="text, record">
										<a-button @click="text=='暂无'?'':lookRfm(record.id,text)">{{text}}</a-button>
									</div>
								</a-table>
								
								<div style="padding: 0 15px;">
									<div style="margin: 20px 0px;line-height: 32px;" v-show="total > 0">
										<a-checkbox v-model="batchTypeValue" @click="batchTypeChange"></a-checkbox>
										当前页
										<a-button type="primary" 
											style="margin-right: 5px"
											:disabled="this.selectedRowKeys.length > 0 ? false : true"
											@click="setGuide('setGarde')" 
											v-has="'shopCustomManage-grade'">等级修改</a-button>
										<a-button type="primary" 
											style="margin-right: 5px"
											:disabled="this.selectedRowKeys.length > 0 ? false : true"
											@click="setGuide('all')" 
											v-has="'shopCustomManage-set'">设置导购
										</a-button>
									</div>
									<!--分页 -->
									<div class="pagination" style="margin: 20px 0px;overflow:hidden;"
										v-show="total > 0" v-has="'shopCustomManage-list'">
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
					
					
					<!-- RFM雷达图 -->
					<a-drawer 
						title="RFM评级" 
						placement="right" 
						:destroyOnClose='true' 
						:closable="true" 
						@close="rfmClose" 
						:visible="rfmVisible">
						<div>
							<div class="frm-item">
								<span>当前评级</span>
								<span class="frm-title">
									{{rfmName}}
									<a-tooltip placement="right">
										<template slot="title">
											<span>是截止昨天的数据最新的评级，下面是三个维度的是最新指数</span>
										</template>
										<a-icon type="question-circle" style="margin-left:5px;"/>
									</a-tooltip>
								</span>
							</div>
							<div>
								<RadarCharts :options="rfmRadar" v-if="hasCorp"></RadarCharts>
								<a-empty v-show="!hasCorp" style="margin-top: 50px;">
									<span slot="description" style="color: #999;">暂无数据</span>
								</a-empty>
							</div>
							<div class="frm-item" v-if="rfmLog.length>0">
								<div class="frm-title2">变化情况</div>
								<a-timeline style="margin-top: 30px;">
									<a-timeline-item v-for="(item,index) in rfmLog" :key="index">{{item.rfm_name}} {{item.add_time}}</a-timeline-item>
								</a-timeline>
								<a-button @click="lookRfmLog" v-if="rfmTotal>rfmPage" style="margin-bottom: 20px;">点击加载更多</a-button>
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
								<a-button type="primary" @click="rfmClose">关闭</a-button>
							</div>
						</div>
					</a-drawer>
					<!-- 设置导购 -->
					<a-modal width="600px" :title="guideTitle" v-model="bindGuideVisible" class="guide-modal">
						<template slot="footer">
							<a-button key="back" @click="handleCancelBind">取消</a-button>
							<a-button key="submit" type="primary" :disabled="false" :loading="loading" @click="handleBind(guideType)">确定绑定</a-button>
						</template>
						<div class="content-msg" v-if="guideType=='all'">当前是批量设置导购，请谨慎选择</div>
						<div class="content-msg" v-if="guideType=='setGarde'">当前是批量修改等级，请谨慎选择</div>
						<div class="guide-user">
							<label>顾客：</label>
							<span v-if="(guideType=='all'||guideType=='setGarde') && guideMes1.length>0">{{guideMes1[0].name}}<span v-if="guideMes1.length>1">等{{guideMes1.length}}人</span></span>
							<span v-if="guideType=='list'">{{guideMes.name}}</span>
						</div>
						<div class="guide-list" v-if="guideType=='list'&&guideMes.guide&&guideMes.guide.length>0">
							<label>现有导购：</label>
							<div class="guide-item">
								<a-tag color="blue" v-for="(item,index) in guideMes.guide" :key="index">
									<span>{{item.guide_name}}</span>
									<a-icon type="close-circle" style="margin-left: 5px;" @click="deleteGuide(index)"/>
								</a-tag>
							</div>
						</div>
						<div class="guide-select" v-if="guideType!='setGarde'">
							<label><span style="color: red;">*</span>选择导购：</label>
							<chooseStaffSelect style="flex: 1;" :index="0" :index2="0" :type="2" ref="staff" :callback="selectStaffCallback"></chooseStaffSelect>
						</div>
						<div class="guide-select" v-if="guideType=='setGarde'">
							<label><span style="color: red;">*</span>选择等级：</label>
							<template v-if="gradeArr.length>0">
								<a-radio-group name="radioGroup" :default-value="gradeArr[0].id" v-model="levelId">
									<a-radio :value="item.id" v-for="(item,index) in gradeArr" :key="index">{{item.title}}</a-radio>
								</a-radio-group>
							</template>
							<template v-else>暂无等级可选</template>
						</div>
					</a-modal>
					
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
	import moment from 'moment';
	import RadarCharts from '../../../components/echarts/RadarCharts';
	import chooseStaffSelect from "@/components/ChooseStaffSelect.vue"
	
	const columns = [
		{
			title      : "客户信息",
			dataIndex  : "name",
			scopedSlots: {customRender: "name"},
			key        : "name",
			ellipsis: true,
		},
		{
			title      : "类型",
			dataIndex  : "type",
			key        : "type",
			scopedSlots: {customRender: "type"},
		},
		{
			title      : "入库时间",
			dataIndex  : "add_time",
			key        : "add_time",
			scopedSlots: {customRender: "add_time"},
		},
		{
			title      : "导购",
			dataIndex  : "guide",
			key        : "guide",
			scopedSlots: {customRender: "guide"},
		},
		{
			// title      : "消费额",
			dataIndex  : "amount",
			key        : "amount",
			slots      : {title: "amount2"},
			scopedSlots: {customRender: "amount"},
		},
		{
			title      : "客户等级",
			dataIndex  : "level_name",
			key        : "level_name",
			width      : 90,
			scopedSlots: {customRender: "level_name"},
		},
		{
			title      : "RFM评级",
			dataIndex  : "rfm_name",
			key        : "rfm_name",
			width      : 140,
			scopedSlots: {customRender: "rfm_name"}
		}
	];
	export default {
		name: "shopCustomManage",
		components:{
			RadarCharts,
			chooseStaffSelect,
		},
		data () {
			return {
				moment,
				keyWord: '',//顾客姓名/昵称/手机号
				customName: '',//导购姓名/手机号
				gradeArr: [],//等级数组
				gradeVal: -1,//等级
				rfmArr: ['等级筛选','重要价值','重要发展','重要保持','已经流失'],
				rfmVal: -1,//RFM评级
				joinTime: null,//添加时间
				moneyTime: null,//最后消费
				interaTime: null,//最后互动
				moneyUpLimit: '',//金额上限
				moneyDownLimit: '',//金额下限
				rateUpLimit: '',//次数上限
				rateDownLimit: '',//次数下限
				
				isLoading: true,//Loading 组件显示与隐藏
				columns,//表头
				customList:[],//表格信息
				page: 1, //页码
				pageSize: 15,//分页个数
				total: 1, //总条数
				batchTypeValue: false,//选择当前页，是否选中
				selectedRowKeys: [], // 选择多少条
				quickJumper: false, // 是否显示快速跳转的控件
				checkArr: [],//选择当前页，保存的key
				
				rfmVisible: false,//RFM评级侧边栏
				rfmName: '',//RFM等级名称
				hasCorp: false,//雷达图是否有数据
				rfmRadar: {
					indicator: [],
					seriesData: [],
					name: 'RFM评级'
				},//RFM侧边栏Radar数据
				rfmLog: [],//RFM侧边栏日志数据
				rfmPage: 1, //rfm页码
				rfmTotal: 0,//rfm总页数
				customerId: '',//顾客id
				guide_id: '',//导购id
				store_id: '',//店铺id
				
				guideArr: ['导购一','导购二','导购三','导购四','导购五'],//导购列表
				bindGuideVisible: false,//导购设置窗口
				loading: false, // 确认绑定按钮加载
				userName: '',//选择的导购
				guideName: [],//现有的导购
				guideType: 'list',//设置导购类型，list：列表设置，all：全部
				guideTitle: '',//导购等级设置标题
				guideMes: {},//当前选择的导购信息
				guideId: [],//导购id
				guideId2: [],////现有导购id
				storeId: [],//导购门店id
				storeId2: [],//现有导购门店id
				customerId2: [],//用户/顾客id
				levelId: '',//等级Id
				guideMes1: {},//全选时数据
			}
		},
		methods: {
			
			disabledDate (current) {//日期禁止部分
				return current && current > moment().endOf('day');
			},
			changeTime (date,type) {// 修改时间
				let that = this;
				if(type == 'joinTime'){
					that.joinTime = date
				}else if(type == 'moneyTime'){
					that.moneyTime = date
				}else if(type == 'interaTime'){
					that.interaTime = date
				}
			},
			searchStaff(){//查找
				this.getCustomList();
			},
			reset(){//清空（重置）
				let that = this;
				that.keyWord = '';
				that.customName = '';
				that.gradeVal = -1;
				that.rfmVal = -1;
				that.joinTime = null;
				that.moneyTime = null;
				that.interaTime = null;
				that.moneyUpLimit = '';
				that.moneyDownLimit = '';
				that.rateUpLimit = '';
				that.rateDownLimit = '';
				that.guide_id = '';
				that.store_id = '';
				
				this.getCustomList();
			},
			deleteTag(type){//删除标签
				let that = this;
				if(type == 'keyWord'){
					that.keyWord = ''
				}else if(type == 'customName'){
					that.customName = ''
				}else if(type == 'gradeVal'){
					that.gradeVal = -1
				}else if(type == 'rfmVal'){
					that.rfmVal = -1
				}else if(type == 'joinTime'){
					that.joinTime = null
				}else if(type == 'moneyTime'){
					that.moneyTime = null
				}else if(type == 'interaTime'){
					that.interaTime = null
				}else if(type == 'moneyLimit'){
					that.moneyUpLimit = ''
					that.moneyDownLimit = ''
				}else if(type == 'rateLimit'){
					that.rateUpLimit = ''
					that.rateDownLimit = ''
				}
			},
			async rfmLevel () {//索区域-等级和rfm
				this.isLoading = true;
				const {data: res} = await this.axios.post("shop-customer/level-rfm", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.gradeArr = res.data.level
					this.rfmArr = res.data.rfm
				}
			},
			
			//获取表格内容
			async getCustomList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("shop-customer/customer-list", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					page: page,
					page_size: pageSize,
					cus_keyword: this.keyWord,
					guide_keyword: this.customName,
					level_id: this.gradeVal>-1?this.gradeArr[this.gradeVal].id:'',
					rfm_id: this.rfmVal>-1?this.rfmArr[this.rfmVal].id:'',
					add_time_start: this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					add_time_end: this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
					last_consumption_time_start: this.moneyTime ? (this.moneyTime.length > 1 ? this.moneyTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					last_consumption_time_end: this.moneyTime ? (this.moneyTime.length > 1 ? this.moneyTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
					last_interactive_time_start: this.interaTime ? (this.interaTime.length > 1 ? this.interaTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					last_interactive_time_end: this.interaTime ? (this.interaTime.length > 1 ? this.interaTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
					amount_min: this.moneyDownLimit,
					amount_max: this.moneyUpLimit,
					interactive_count_min: this.rateDownLimit,
					interactive_count_max: this.rateUpLimit,
					guide_id: this.guide_id,
					store_id: this.store_id,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					
					this.customList = res.data.customer;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					
					this.checkArr = []
					this.customList.map(x => {
						this.checkArr.push(x.key)
					})
					this.batchTypeValue = false
					this.selectedRowKeys = []
					// if (this.selectedRowKeys.length > 0) {
					// 	this.batchTypeValue = true
					// 	this.checkArr.map(y => {
					// 		if (this.selectedRowKeys.indexOf(y) == -1) {
					// 			this.batchTypeValue = false
					// 		}
					// 	})
					// }
		
				}
			},
			
			onSelectChange (selectedRowKeys, value) {//表格复选框事件
				this.selectedRowKeys = selectedRowKeys;
				this.batchTypeValue = this.checkArr.every(val => selectedRowKeys.includes(val))
				this.guideMes1=value
			},
			batchTypeChange () {// 当前页多选框变化
				if (!this.batchTypeValue) {
					// 添加
					this.selectedRowKeys = this.checkArr
					this.guideMes1 = this.customList
				} else {
					// 移除
					this.selectedRowKeys = []
					this.guideMes1 = []
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
			
			lookRfm(id,text){//查看RFM侧边栏
				this.customerId = id
				this.rfmPage = 1
				this.rfmName = text
				this.rfmRadarFun(id)
			},
			rfmClose() {//关闭RFM侧边栏
				this.rfmName = ''
				this.rfmVisible = false
			},
			
			async rfmRadarFun (customer_id, rfmPage = 1, pageSize = this.pageSize) {//获取RFM侧边栏数据
				this.isLoading = true;
				const {data: res} = await this.axios.post("shop-customer/sidebar-msg", {
					page: rfmPage,
					page_size: pageSize,
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					customer_id: customer_id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					if(rfmPage == 1){
						this.rfmVisible = true;
						this.hasCorp = true;
						this.rfmRadar.indicator[0] = {text: '额度', max: res.data.rfm.monetary_value}
						this.rfmRadar.indicator[1] = {text: '近度', max: res.data.rfm.recency_value}
						this.rfmRadar.indicator[2] = {text: '频率', max: res.data.rfm.frequency_value}
						this.rfmRadar.seriesData[0] = res.data.rfm.monetary;
						this.rfmRadar.seriesData[1] = res.data.rfm.recency;
						this.rfmRadar.seriesData[2] = res.data.rfm.frequency;
						this.rfmLog = res.data.rfm_log;
						this.rfmTotal = Math.ceil(res.data.count/pageSize)
					}else{
						this.rfmLog = [...this.rfmLog, ...res.data.rfm_log];
					}
				}
			},
			lookRfmLog(){//RFM侧边栏分页
				this.rfmRadarFun(this.customerId,++this.rfmPage,this.pageSize)
			},
			
			setGuide(type,guideMes){//显示设置导购
				let that = this;
				that.guideType = type
				that.bindGuideVisible = true
				that.guideName = []
				that.guideId = []
				that.guideId2 = []
				that.storeId = []
				that.storeId2 = []
				that.customerId2 = []
				if(type == 'setGarde'){//修改等级
					that.guideTitle = '修改等级'
					that.customerId2 = that.selectedRowKeys
				}else{
					that.guideTitle = '设置导购'
					that.guideMes = guideMes
					if(type == 'list'){
						that.customerId2 = [guideMes.id]
						if(that.guideMes.guide.length>0){
							that.guideMes.guide.map(x => {
								that.guideId2.push(x.guide_id*1)
								that.guideName.push(x.guide_name)
								that.storeId2.push(x.store_id*1)
							})
						}
					}else if (type == 'all') {
						that.customerId2 = that.selectedRowKeys
					}
				}
			},
			handleCancelBind(){//取消/关闭导购
				let that = this;
				that.bindGuideVisible = false
				that.loading = false
				if(that.$refs.staff){
					that.$refs.staff.userId = []
				}
			},
			// 确定绑定
			async handleBind(type) {
				let that = this
				if(type == 'setGarde'){
					console.log('设置等级')
				}else{
					if (that.guideId.length == 0 && type == 'all') {
						that.$message.error('请先选择导购');
						return false
					}
					that.guideId = [...that.guideId2,...that.guideId]
					that.guideName = that.guideName.concat(that.userName)
					that.storeId = that.storeId2.concat(that.storeId)
				}
				
				that.loading = true
				let params={
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
				}
				let url;
				if(type == 'setGarde'){
					params.level_id = that.levelId
					params.customer_ids = that.customerId2.toString()
					url = 'shop-customer/change-level'
				}else{
					params.guide_id = that.guideId.toString()
					params.customer_id = that.customerId2.toString()
					params.store_guide_name = that.guideName.toString()
					params.store_id = that.storeId.toString()
					url = 'shop-customer/save-guide-msg'
				}
				const {data: res} = await that.axios.post(url, params);
				if (res.error != 0) {
					that.loading = false
					that.$message.error(res.error_msg);
				} else {
					that.loading = false
					
					if(that.$refs.staff){
						that.$refs.staff.userId = []
					}
					that.handleCancelBind()
					that.getCustomList()
				}
			},
			selectStaffCallback(event, id, index, index2, val){//客户绑定选择框回调
				if (event == "ok") {
					this.guideId = [id]
					this.storeId = val.store_id
					this.$nextTick(() => {
						this.userName = this.$refs.staff.$el.innerText
					})
				}
			},
			deleteGuide(index){//删除导购列表
				let that = this;
				that.guideMes.guide.splice(index,1);
				that.guideId2.splice(index,1)
				that.guideName.splice(index,1)
				that.storeId2.splice(index,1)
			},
		},
		computed: {
			rowSelection () {//表格选择框
				const {selectedRowKeys} = this;
				let that = this
				return {
					selectedRowKeys,
					onChange: this.onSelectChange,
					hideDefaultSelections: true,
					// selections: [{
					// 		key: "current-data",
					// 		text: "当前页",
					// 		onSelect: changableRowKeys => {
					// 			that.selectedRowKeys = changableRowKeys;
					// 			that.batchTypeValue = true
					// 		}
					// 	},
					// 	{
					// 		key: "all-data",
					// 		text: "选择所有项",
					// 		onSelect: () => {
					// 			that.selectedRowKeys = [...this.checkArr.valueOf()];
					// 			that.batchTypeValue = true
					// 		}
					// 	}
					// ],
					onSelection: that.onSelection
				};
			},
		},
		created() {
			
		},
		mounted() {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				//TODO 获取teams
				// this.$emit('changeCorpId', this.corpId)
				
				if(this.$route.query.guide_id){
					this.guide_id = this.$route.query.guide_id
					this.store_id = this.$route.query.store_id
				}
				
				this.rfmLevel()
				this.getCustomList()
			});
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	.custom{
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
	}
	.content-hd-box{
		line-height: 40px;
	}
	.select-option{
		display: inline-block;
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.select-option label{
		margin-right: 5px;
		display: inline-block;
		text-align: right;
		width: 100px;
	}
	.select-option input,.select-option .ant-select{
		margin-right: 5px;
		width: 210px;
	}
	.content-hd-list{
		display: flex;
		flex-wrap: wrap;
		margin-top: 12px;
	}
	.content-hd-list .ant-tag{
		margin-bottom: 8px;
	}
	.content-hd-list .ant-tag .anticon{
		/* color: #999; */
		margin-left: 8px;
	}
	
	.table-num{
		height: 32px;
		line-height: 32rpx;
		margin-top: 6px;
	}
	.table-num span{
		color: #1890FF;
		margin: 0 3px;
	}
	
	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}
	/deep/ .light-row {
		background: #FFF;
	}
	
	
	/deep/.ant-drawer-content-wrapper{
		width:470px!important;
	}
	.frm-item{
		margin-top: 24px;
		padding-left: 24px;
		font-size: 18px;
	}
	.frm-title{
		font-weight: 600;
		margin-left: 10px;
	}
	.frm-title2{
		margin-bottom: 12px;
		font-weight: 600;
	}
	
	.guide-modal label{
		width: 80px;
		text-align: right;
		display: block;
	}
	.guide-list{
		display: flex;
		align-items: flex-start;
		margin-top: 20px;
	}
	.guide-item{
		border: 1px solid rgb(217, 217, 217);
		border-radius: 5px;
		padding: 10px;
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		min-height: 80px;
		.ant-tag{
			margin-bottom: 5px;
		}
	}
	.guide-user{
		display: flex;
	}
	.guide-select{
		display: flex;
		align-items: center;
		margin-top: 20px;
		.ant-radio-group{
			flex: 1;
			display: flex;
			flex-wrap: wrap;
			.ant-radio-wrapper{
				margin-bottom: 5px;
			}
		}
	}
	.guide-des{
		margin-top: 5px;
		margin-left: 80px;
	}
	
</style>
