<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden;">
				<a-layout
						style="position: absolute;top:0;bottom:0;right:0;left: 0;overflow-x: hidden; overflow-y: auto;"
						class="fans-content scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>裂变引流</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">裂变引流</div>
						<div class="content-msg">
							<a-collapse expand-icon-position="right" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
								<a-collapse-panel key="1">
									<template slot="header">
										<p style="margin-bottom: 10px; font-weight: 700">
											任务裂变，为奖励式分享任务机制，通过有吸引力的奖品，邀请多个好友助力，可免费获得，以此诱导用户在自己的社交圈进行传播，一传二、二传四的模式，指数级增长。
										</p>
										<p style="margin-bottom: 2px;">
											<span style="color: #FF562D;">目前我们云美来SCRM系统存在三种裂变模式：至于使用哪种裂变模式，商家可根据自身情况而定。任务裂变目前公众号仅支持认证服务号。</span>

										</p>
										<p style="margin-bottom: 2px;">
											1、仅公众号裂变涨粉模式，即关注公众号即算助力成功；<a target="_blank"
											                             href="https://support.qq.com/products/104790/faqs/81376">操作文档</a>
										</p>
										<p style="margin-bottom: 2px;">
											2、基于公众号+企业微信的裂变模式，即关注公众号并且加员工企业微信为好友才算助力成功，一箭双雕，不仅给公众号涨粉，还能给员工的企业微信号带来大量的客户，是一把引流的利器。<a
												target="_blank"
												href="https://support.qq.com/products/104790/faqs/81440">操作文档</a>
										</p>
										<p style="margin-bottom: 2px;">
											3、仅企业微信的裂变模式，即加员工企业微信为好友助力成功。<a target="_blank"
											                                href="https://support.qq.com/products/104790/faqs/81441">操作文档</a>
										</p>
										<div style="margin: 10px 0 2px;">自动发送欢迎语，可能失败的原因
											<a-tooltip placement="bottom">
												<template slot="title">
													<p style="margin-bottom: 2px;font-size: 13px;">
														1、如果企业在企业微信后台为相关成员配置了可用的欢迎语，使用第三方系统配置欢迎语，均不起效，推送的还是企业微信官方的。</p>
													<p style="margin-bottom: 10px;font-size: 13px;"></p>
													<p style="margin-bottom: 2px;font-size: 13px;">
														2、客户和企业成员已经开始聊天的场景下，不能发送欢迎语。</p>
													<p style="margin-bottom: 10px;font-size: 13px;"></p>
													<p style="margin-bottom: 2px;font-size: 13px;">3、客户之前添加过A企业成员，
														不论客户是否将该成员删除，但凡再通过裂变活动添加上该A企业成员，受限于企业微信官方规则，可能会造成推送其他渠道（包含正在进行中的裂变活动）的欢迎语，也有可能不再推送。</p>
													<p style="margin-bottom: 10px;font-size: 13px;"></p>
													<p style="margin-bottom: 0;font-size: 13px;">
														4、每次添加新的客户时，当存在多个企业自建应用或是第三方应用设置了欢迎语，那么企业微信官方采取优先权的推送，所以存在有的客户接收不到欢迎语。请商户根据实际使用需求，合理配置，避免冲突。</p>
												</template>
												<a-icon type="question-circle"/>
											</a-tooltip>
										</div>
										<p style="margin: 10px 0 2px;color: #FF562D;">
											商户需完成以下配置，才能使用派发红包功能：
										</p>
									</template>
									<p style="margin-bottom: 2px;">
										1、前往<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
										       target="_blank">【微信支付商户平台】</a>注册微信支付商户号
									</p>
									<p style="margin-bottom: 2px;">
										2、登录<a
											href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu"
											target="_blank">【企业微信后台】</a>开通企业支付，绑定已有商户号（<a
											href="https://support.qq.com/products/104790/faqs/66072" target="_blank">查看教程</a>）
									</p>
									<p style="margin-bottom: 2px;">
										3、登录<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
										       target="_blank">【微信支付商户平台】</a>开通【企业付款到零钱】（<a
											href="https://support.qq.com/products/104790/faqs/66076" target="_blank">查看教程</a>）
									</p>
									<p style="margin-bottom: 2px;">
										4、在本系统，进入【应用中心】--【企业支付】，点击，填入企业支付的应用ID和Secret
									</p>
									<p style="margin-bottom: 2px;">
										5、在本系统，进入【应用中心】--【企业支付】，点击，完成支付配置。（<a
											href="https://support.qq.com/products/104790/faqs/66058" target="_blank">查看教程</a>）
									</p>
								</a-collapse-panel>
							</a-collapse>
						</div>
						<div class="content-hd">
							<div style="overflow: hidden;margin: 20px 0;">
								<a-col style="float:left;">
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 10px;"
											@change="handleChange"
											v-model="corpId"
											v-if="corpLen > 1 && type == 1"
									>
										<template v-for="item in corpInfo">
											<a-select-option :value="item.corpid">{{item.corp_full_name ||
												item.corp_name}}
											</a-select-option>
										</template>
									</a-select>
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 10px;"
											@change="handleChangeWx"
											v-model="wxId"
											v-if="wxLen > 1 && type == 0"
									>
										<template v-for="item in wxList">
											<a-select-option :value="item.wx_id">
												{{item.nick_name}}
											</a-select-option>
										</template>
									</a-select>
									<a-select v-model="status" style="width: 120px;" placeholder="活动状态" allowClear>
										<a-select-option :value="''">全部状态</a-select-option>
										<a-select-option :value="1">未开始</a-select-option>
										<a-select-option :value="2">进行中</a-select-option>
										<a-select-option :value="3">已结束</a-select-option>
									</a-select>
									<a-input placeholder="搜索活动名称" @keyup.enter="find" v-model="title"
									         style="width: 150px;margin: 0px 10px;"/>
									<a-range-picker style="width: 300px" v-model="activityTime" @change="changeTime"/>
									<a-button type="primary" style="margin: 0px 10px;" @click="find">查询</a-button>
									<a-button @click="clear">重置</a-button>
								</a-col>
								<a-col style="float:right;">
									<a-button class="btn-primary"@click="addWelcomeText" type="primary"
									          v-has="type == 1 ? 'wholeMarketFission-add' : 'wxWholeMarketFission-add'">
										创建活动
									</a-button>
								</a-col>
							</div>
							<div style="margin-bottom: 20px;" v-if="wholeMarketFissionNum > 0" class="content-msg">当前套餐版本仅支持<span
									style="color: red;">单场活动</span>用户参与人数上限<span
									style="color: red;">{{wholeMarketFissionNum}}</span>人，达到上限后活动将自动结束。更多套餐信息可联系平台了解哦！
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="activityList" :pagination="false"
								         :rowClassName="rowClassName"
								         v-has="type == 1 ? 'wholeMarketFission-list' : 'wxWholeMarketFission-list'">
									<span slot="countFans">
										总参与人
										<a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>生成自己的专属海报则参与人数+1</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<span slot="newtFans">
										新增粉丝
										<a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>参加活动且首次关注公众号的粉丝（在参与活动之前关注了公众号再取消关注，然后在活动期间再次关注的不计入人数）</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<span slot="newUser">
										新增好友数
										<a-tooltip placement="bottom">
						                    <template slot="title">
							                     <p style="margin-bottom: 2px">企业微信：添加员工企业微信的客户数量</p>
						                      <p style="margin-bottom: 0px">企业微信+公众号：过公众号添加企业微信的客户数量</p>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
					                    </a-tooltip>
									</span>
									<span slot="overUser">
										流失好友数
										<a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>通过该场活动，新客户添加企业引流成员后，客户又将企业引流成员删除/拉黑的人数，即为流失人数。（不包含老客户，即之前通过别的活动或方式添加引流成员的客户）</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
					                    </a-tooltip>
									</span>
									<!--									<span slot="count_fans" slot-scope="text, record, index">-->
									<!--										<span v-if="record.type != '公众号'">{{text}}</span>-->
									<!--										<span v-else>&#45;&#45;</span>-->
									<!--									</span>-->
									<!--									<span slot="newt_fans" slot-scope="text, record, index">-->
									<!--										<span v-if="record.type != '公众号'">{{text}}</span>-->
									<!--										<span v-else>&#45;&#45;</span>-->
									<!--									</span>-->
									<span slot="new_user" slot-scope="text, record, index">
										<span v-if="record.type != '公众号'">{{text}}</span>
										<span v-else>--</span>
									</span>
									<span slot="over_user" slot-scope="text, record, index">
										<span v-if="record.type != '公众号'">{{text}}</span>
										<span v-else>--</span>
									</span>

									<span slot="qr_code" slot-scope="text, record, index">
										<div style="width: 100px;margin: 0 auto;"
										     :ref="'qrcode' + index" :id="'qrcode' + index">
										</div>
										<img style="width: 100px;margin: 0 auto;" v-if="record.type != '企业微信'"
										     :src="commonUrl + record.code_url"/>
										<div style="text-align: center;">{{record.type}}</div>
									</span>
									<span slot="level" slot-scope="text, record">
										<p v-for="(item, index) in record.level">
											<span v-if="item.is_open == 1">
												奖品{{index+1}}：
												<span v-if="item.type == 1">{{item.prize_name}}</span>
												<span v-if="item.type == 2">{{item.money_amount}}元</span>
												<div>
													（<span v-if="item.type == 1 && item.num_old">{{item.num}} / {{item.num_old}}</span>
													<span v-if="item.type == 1 && !item.num_old">不限</span>
													<span v-if="item.type == 2">{{item.money_count}} / {{item.money_count_old}}</span>）
												</div>
												<a-tag color="blue">需邀请{{item.number}}位好友</a-tag>
											</span>
										</p>
									</span>
									<span slot="word" slot-scope="text, record">
										<span v-if="record.keyword != ''">{{record.keyword}}</span>
										<span v-else>--</span>
									</span>
									<!--									<span slot="levelNum" slot-scope="text, record">-->
									<!--										<p v-for="(item, index) in record.level">-->
									<!--											<span v-if="item.type == 1 && item.num_old">{{item.num}} / {{item.num_old}}</span>-->
									<!--											<span v-if="item.type == 1 && !item.num_old">不限</span>-->
									<!--											<span v-if="item.type == 2">{{item.money_count}} / {{item.money_count_old}}</span>-->
									<!--										</p>-->
									<!--									</span>-->
									<span slot="time" slot-scope="text, record">
										<div style="width: 125px;">{{record.start_time}}至</div>
										<div>{{record.end_time}}</div>
									</span>
									<span slot="channel_user" slot-scope="text, record">
										<template v-for="user in record.channel_user">
											<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'"
											       color="orange"
											       style="margin-top: 5px;">{{user.title}}</a-tag>
										</template>
										<template v-for="user in record.channel_user">
											<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'"
											       color="blue"
											       style="margin-top: 5px;">{{user.title}}</a-tag>
										</template>
										<span v-if="record.channel_user.length == 0">--</span>
									</span>
									<span slot="is_over" slot-scope="text, record">
										<div v-if="record.is_over == 1" style="width: 128px;">未开始</div>
										<div v-if="record.is_over == 2" style="width: 128px;">时间结束</div>
										<div v-if="record.is_over == 3" style="width: 128px;">阶段结束</div>
										<div v-if="record.is_over == 4" style="width: 128px;">手动结束</div>
										<div v-if="record.is_over == 5" style="width: 128px;">进行中</div>
									</span>
									<span slot="action" slot-scope="text, record, index">
										<div style="width: 150px;">
											<div style="display: inline-block;">
											<a-button @click="failure(record.id, record.activity_name)"
											          v-if="record.is_over == 5"
											          v-has="type == 1 ? 'wholeMarketFission-invalid' : 'wxWholeMarketFission-invalid'"
											          style="margin: 0 5px 5px 0">使失效</a-button>
											</div>
												<div style="display: inline-block;">
											<a-button @click="edit(record.id, record.activity_name)"
											          v-if="record.is_over == 1 || record.is_over == 5"
											          v-has="type == 1 ? 'wholeMarketFission-edit' : 'wxWholeMarketFission-edit'"
											          style="margin: 0 5px 5px 0">编辑</a-button>
												</div>
											<div style="display: inline-block;">
											<a-button @click="participants(record.id,record.activity_name, record.type)"
											          style="margin: 0 5px 5px 0"
											          v-has="type == 1 ? 'wholeMarketFission-info' : 'wxWholeMarketFission-info'">参与者</a-button>
											</div>
											<div style="display: inline-block;">
											<a-button v-if="record.status != 1"
											          @click="statistical(record.id, record.activity_name, record.type)"
											          style="margin: 0 5px 5px 0"
											          v-has="type == 1 ? 'wholeMarketFission-statistic' : 'wxWholeMarketFission-statistic'">统计</a-button>
											</div>
											<div style="display: inline-block;">
												<a-button @click="deleteActivity(record.id)"
												          style="margin: 0 5px 5px 0"
												          v-has="type == 1 ? 'wholeMarketFission-delete' : 'wxWholeMarketFission-delete'"
												          v-if="record.is_over != 5">删除</a-button>
											</div>
											<div style="display: inline-block;">
												<a-button v-if="record.is_over == 5"
												          v-has="type == 1 ? 'wholeMarketFission-down' : 'wxWholeMarketFission-down'"
												          @click="downLoadWay(record.qr_code, record.activity_name, 'qrcode'+index, record.code_url, record.type)"
												          class="actionBtn"
												>下载</a-button>
											</div>
										</div>
									</span>
								</a-table>

								<!-- 分页 -->
								<div class="pagination"
								     v-has="type == 1 ? 'wholeMarketFission-list' : 'wxWholeMarketFission-list'"
								     style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-if="total > 0">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total}}</span>条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="false"
										              :current="page"
										              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
										              @change="changePage"
										              @showSizeChange="showSizeChange"/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>

				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import MyIcon from "@/components/MyIcon.vue"
	import moment from 'moment';
	import QRCode from 'qrcodejs2'

	// 活动列表
	const columns = [
		{
			title      : "二维码",
			dataIndex  : "qr_code",
			key        : "qr_code",
			width      : '140px',
			scopedSlots: {customRender: "qr_code"}
		},
		{
			title    : "活动名称",
			dataIndex: "activity_name",
			key      : "activity_name",
			width    : '180px'
		},
		{
			title      : "活动规则",
			dataIndex  : "level",
			key        : "level",
			scopedSlots: {customRender: "level"}
		},
		{
			title      : "关键词",
			dataIndex  : "word",
			key        : "word",
			scopedSlots: {customRender: "word"}
		},
		// {
		// 	title    : "奖品库存",
		// 	dataIndex: "levelNum",
		// 	key      : "levelNum",
		// 	scopedSlots: {customRender: "levelNum"}
		// },
		{
			title      : "活动时间",
			dataIndex  : "time",
			key        : "time",
			scopedSlots: {customRender: "time"}
		},
		{
			// title    : "总参与粉丝",
			dataIndex  : "countFans",
			key        : "countFans",
			scopedSlots: {title: "countFans"}
		},
		{
			// title    : "新增粉丝",
			dataIndex  : "newtFans",
			key        : "newtFans",
			scopedSlots: {title: "newtFans"}
		},
		{
			// title    : "总好友数",
			dataIndex  : "newUser",
			key        : "newUser",
			scopedSlots: {title: "newUser", customRender: "new_user"}
		},
		{
			// title    : "流失好友数",
			dataIndex  : "overUser",
			key        : "overUser",
			scopedSlots: {title: "overUser", customRender: "over_user"}
		},
		{
			title      : "引流成员",
			dataIndex  : "channel_user",
			width      : "12.8%",
			key        : "channel_user",
			scopedSlots: {customRender: "channel_user"}
		},
		{
			title      : "状态",
			dataIndex  : "is_over",
			key        : "is_over",
			scopedSlots: {customRender: "is_over"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : localStorage.getItem('type') == 1 ? "wholeMarketFissionList" : 'wxWholeMarketFission',
		components: {MyIcon},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			let wxId = localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				suite_id             : 1,//应用ID
				wxId                 : wxId,
				wxList               : [],
				commonUrl            : this.$store.state.commonUrl,
				wxLen                : JSON.parse(localStorage.getItem('wxArr')).length,
				corpId               : corpId,//企业微信选中的id
				corpInfo             : [], //企业微信列表
				status               : '', // 0全部 1未开始 2进行中 3已结束
				title                : '',// 输入框内容
				activityTime         : [], // 时间
				activityList         : [],// 表格数组
				isLoading            : true, //Loading 组件显示与隐藏
				type                 : localStorage.getItem('type'),
				corpLen              : JSON.parse(localStorage.getItem('corpArr')).length,
				//表格部分
				columns,
				//分页
				total                : 0, //总条数
				quickJumper          : false, // 是否显示快速跳转的控件
				page                 : 1, //页码
				page_size            : 15, //每页数据量，默认15
				pageSize             : 15, //每页数据条数
				wholeMarketFissionNum: Number(this.$store.state.packageDetail.wholeMarketFissionNum),//裂变引流人数上限数
			};
		},

		methods: {
			//左侧企业微信
			handleChange (value) {
				this.corpId = value
			},
			handleChangeWx (value) {
				this.wxId = value
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			changeTime (data, dataString) {
				this.activityTime = data
			},
			// 点击搜索
			find () {
				this.getActivityList()
			},
			// 点击清空
			clear () {
				this.status = []
				this.title = ''
				this.activityTime = []
				this.page = 1
				this.pageSize = 15
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
				this.getActivityList()
			},
			// 创建活动
			addWelcomeText () {
				if (localStorage.getItem('type') == 1) {
					this.$router.push('/wholeMarket/fissionAdd')
				} else {
					this.$router.push('/wholeMarket/fissionAdd1')
				}

			},
			// 获取表格内容
			async getActivityList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-activity-public/list", {
					corp_id      : this.type == 1 ? this.corpId : '',
					public_id    : this.type == 0 ? this.wxId : '',
					status       : this.status,
					activity_name: this.title,
					start_time   : this.activityTime.length > 0 ? moment(this.activityTime[0]).format("YYYY-MM-DD") : "",
					end_time     : this.activityTime.length > 0 ? moment(this.activityTime[1]).format("YYYY-MM-DD") : "",
					page         : page,
					pageSize     : pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.activityList = res.data.data;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					let that = this
					for (let i = 0; i < this.activityList.length; i++) {
						if (document.getElementById('qrcode' + i)) {
							document.getElementById('qrcode' + i).innerHTML = ""
						}
					}
					this.$nextTick(() => {
						for (let i = 0; i < this.activityList.length; i++) {
							if (this.activityList[i].type == '企业微信') {
								that.qrcode(this.activityList[i].code_url, i)
							}
						}
					})
				}
			},
			// 二维码
			qrcode (url, i) {
				let qrcode = new QRCode('qrcode' + i, {
					width     : 100,
					height    : 100,
					text      : url, // 二维码地址
					colorDark : "#000",
					colorLight: "#FFF",
				})
			},
			// 使失效
			failure (id, activityName) {
				let that = this;
				that.$confirm({
					title     : "确定结束活动【" + activityName + "】吗？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 4)
					}
				});
			},
			//删除
			deleteActivity (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该活动？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 0)
					}
				});
			},
			async changeStatus (id, status) {
				const {data: res} = await this.axios.post("work-activity-public/activity-stop", {
					activity_id: id,
					status     : status
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					if (status == 0) {
						//删除判断最后一页是否只有一条
						if (this.activityList.length == 1 && this.page > 1) {
							this.getActivityList(this.page - 1, this.pageSize)
						} else {
							this.getActivityList(this.page, this.pageSize)
						}
					} else {
						this.getActivityList(this.page, this.pageSize)
					}
				}
			},
			downLoadWay (url, name, id, src, type) {
				let that = this
				let image = new Image()
				image.setAttribute('crossOrigin', 'anonymous')
				let j = document.getElementById(id)
				if (type != '企业微信') {
					image.src = this.commonUrl + src
				} else {
					image.src = document.getElementById(id).getElementsByTagName('img')[0].getAttribute("src")
				}

				image.onload = () => {
					let canvas = document.createElement('canvas')
					canvas.width = 200
					canvas.height = 200
					let ctx = canvas.getContext('2d')
					ctx.drawImage(image, 0, 0, 200, 200)
					canvas.toBlob((blob) => {
						let url = URL.createObjectURL(blob)
						that.download(url, name)
						// 用完释放URL对象
						URL.revokeObjectURL(url)
					})
				}
			},
			download (href, name) {
				let eleLink = document.createElement('a')
				eleLink.download = name
				eleLink.href = href
				eleLink.click()
				eleLink.remove()
			},
			// 编辑
			edit (id, title) {
				if (localStorage.getItem('type') == 1) {
					this.$router.push("/wholeMarket/fissionAdd?id=" + id + '&title=' + encodeURIComponent(title))
				} else {
					this.$router.push("/wholeMarket/fissionAdd1?id=" + id + '&title=' + encodeURIComponent(title))
				}
			},
			participants (id, title, type) {
				let id2 = encodeURIComponent(id)
				let title2 = encodeURIComponent(title.replace(/%/g, '%25'))
				if (localStorage.getItem('type') == 1) {
					this.$router.push("/wholeMarket/fissionParticipants?id=" + id2 + "&title=" + title2)
				} else {
					this.$router.push("/wholeMarket/fissionParticipants1?id=" + id2 + "&title=" + title2)
				}

			},
			// 统计
			async statistical (id, title, type) {
				let t = 0
				if (type == '公众号') {
					t = 0
				} else if (type == '企业微信') {
					t = 1
				} else {
					t = 2
				}
				let id2 = encodeURIComponent(id)
				let title2 = encodeURIComponent(title.replace(/%/g, '%25'))
				if (localStorage.getItem('type') == 1) {
					this.$router.push("/wholeMarket/statistic?id=" + id2 + "&title=" + title2 + "&type=" + t)
				} else {
					this.$router.push("/wholeMarket/statistic1?id=" + id2 + "&title=" + title2 + "&type=" + t)
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getActivityList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 220)
				})
			},
			showSizeChange (page, pageSize) {
				this.getActivityList(1, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 220)
				})
			}
		},

		mounted () {
			if (this.type == 1) {
				this.$store.dispatch('getCorp', (info) => {
					this.corpInfo = info;
					this.getActivityList()
				});
			} else {
				this.$store.dispatch('getWx', (info) => {
					this.wxList = info;
					this.getActivityList()
				});
			}

		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if ((from.path == '/wholeMarket/fissionAdd' || from.path == '/wholeMarket/fissionParticipants' || from.path == '/wholeMarket/statistic') && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getActivityList(vm.page, vm.pageSize)
				});
			} else if ((from.path == '/wholeMarket/fissionAdd1' || from.path == '/wholeMarket/fissionParticipants1' || from.path == '/wholeMarket/statistic1') && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getActivityList(vm.page, vm.pageSize)
				});
			} else {
				next(vm => {
					// 因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.status = []
					vm.title = ''
					vm.activityTime = []
					vm.page = 1
					vm.pageSize = 15
					vm.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
					vm.getActivityList()
				});
			}
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../../style/_style.less';

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

	.content-hd {
		/*height: 60px;*/
		width: 100%;
		min-width: 885px;
		/*line-height: 60px;*/
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
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


	/deep/ .ant-collapse-arrow svg {
		color: #01b065;
		width: 20px;
		height: 20px;
		/*display: none !important;*/
	}

	/deep/ .ant-collapse, /deep/ .ant-collapse-content, /deep/ .ant-collapse-item {
		background: @color-bgc;
		border: 0px;
	}

	/deep/ .ant-collapse-content {
		color: rgba(0, 0, 0, 0.85);
	}

	/deep/ .ant-collapse-content-box {
		padding: 4px 16px 0 16px;
	}

	/deep/ .ant-collapse-header {
		background: @color-bgc;
		border: 0px;
		padding: 0 16px !important;
	}
</style>
