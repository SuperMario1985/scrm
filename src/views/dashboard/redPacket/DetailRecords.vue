<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden;">
				<a-layout style="position: absolute;left:0px;top:0;bottom:0;right:0;overflow-x: hidden; overflow-y: auto;"
				          class="scroll">
					<!-- 头部 -->
					<a-layout-header>{{perdate}}红包记录
						<a-button type="primary" style="float: right; margin: 9px 20px 0 0;" icon="rollback"
						          @click="rollback">
							返回列表
						</a-button>
					</a-layout-header>


					<!-- 内容 -->
					<a-layout-content>
						<!--						<div class="content-msg">-->
						<!--							<p style="margin-bottom: 0px;">-->
						<!--								成员在外部会话中，可通过侧边栏打开【客户详情页】页面，也可以点击外部联系人（客户）头像进入到系统页面【客户信息】，再打开【客户详情页】页面。<a-->
						<!--									href="https://support.qq.com/products/104790/faqs/59786" target="_blank"-->
						<!--									class="el-link el-link&#45;&#45;primary">-->
						<!--								<span class="el-link&#45;&#45;inner">查看教程</span>-->
						<!--							</a>-->
						<!--							</p>-->
						<!--						</div>-->
						<div class="content-hd">
							<div style="background-color: #FFFFFF;padding: 20px 0 10px 0; margin-top: 12px;">
								<span class="select-option">
									<label style="margin-right: 5px;">企业微信：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 5px;"
											@change="handleChange"
											v-model="corpId"
											disabled
									>
										<template v-for="item in corpInfo">
											<a-select-option :value="item.corpid">{{item.corp_full_name ||
												item.corp_name}}
											</a-select-option>
										</template>
									</a-select>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">关键词：</label>
									<a-input style="margin-right: 5px;width: 210px;" placeholder="请输入客户昵称/姓名"
									         v-model="name"></a-input>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">手机号码：</label>
									<a-input
											style="margin-right: 5px;width: 210px;"
											v-model="phone"
											placeholder="支持手机号后四位查找"
											:maxLength="11"
									/>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">订单号：</label>
									<a-input
											style="margin-right: 5px;width: 210px;"
											v-model="orderNumber"
											placeholder="请输入订单号/微信付款单号"
									/>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">备注/留言：</label>
									<a-input
											style="margin-right: 5px;width: 210px;"
											placeholder="请输入备注/留言"
											v-model="remark"></a-input>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">部门成员：</label>
									<a-button @click="showDepartmentList" style="width: 210px;margin-right: 5px;">
										<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
										<span v-else>选择部门成员</span>
									</a-button>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">发送对象：</label>
									<a-select @change="changeSendType" v-model="sendType" showSearch optionFilterProp="children"
									          style="width: 210px; margin-right: 5px;">
										<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="1">客户群</a-select-option>
										<a-select-option :value="2">客户</a-select-option>
									</a-select>
									<span v-if="sendType == 1" style="width: 30px; height: 1px;background-color: rgba(0, 0, 0, 0.65); display: inline-block;vertical-align: middle; margin: 0 8px;"></span>
									<chooseChat
											style="width: 280px;display: inline-block;"
											v-if="sendType == 1"
											:corp_id="corpId"
											:chat_id="chatId"
											@changeSelect="selectStaffCallback"></chooseChat>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">发送时间：</label>
									<a-range-picker
											:show-time="{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }"
											format="YYYY-MM-DD HH:mm:ss"
											allowClear
											style="width:320px;margin-right: 5px;"
											v-model="sendTime"
											disabled
									/>
									<a-button type="primary" style="margin-right: 5px;"
									          @click="searchStaff">查询</a-button>
									<a-button style="margin-right: 10px;" @click="reset">重置</a-button>
								</span>
							</div>
							<div style="text-align: right;">
								<a-dropdown v-has="'records-export'">
									<a-menu slot="overlay" @click="chooseDownType">
										<a-menu-item key="0">当前页导出</a-menu-item>
										<a-menu-item key="1">全部导出</a-menu-item>
									</a-menu>

										<a-button icon="download" style="margin: 14px 0px;">导出
											<a-icon type="down"/>
										</a-button>
								</a-dropdown>
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table
										:columns="columns"
										:dataSource="recordsList"
										:pagination="false"
										:rowClassName="rowClassName"
								>
									<template slot="money" slot-scope="text, record, index">
										{{record.money}}元
									</template>
									<template slot="transaction_id" slot-scope="text, record, index">
										<div>商户订单号：{{record.order_id || '--'}}</div>
										<div>微信付款单号：{{record.transaction_id || '--'}}</div>
									</template>
									<div slot="info2" v-if="is_hide_phone != 1">客户昵称/姓名/手机号码</div>
									<div slot="info2" v-if="is_hide_phone == 1">客户昵称/姓名</div>
									<template slot="info" slot-scope="text, record, index">
										<span v-if="record.nickname == null || record.nickname == ''">未知客户</span>
										<span v-if="record.nickname != ''">{{record.nickname}}</span>
										<span v-if="record.name == null || record.name == ''">/--</span>
										<span v-if="record.name != ''">/{{record.name}}</span>
										<span v-if="is_hide_phone != 1">
											<span v-if="record.phone == null || record.phone == ''">/--</span>
											<span v-if="record.phone != ''">/{{record.phone}}</span>
										</span>
									</template>
									<template slot="shop" slot-scope="text, record, index">
										<span v-if="record.shop == null || record.shop == ''">--</span>
										<span v-if="record.shop != ''">{{record.shop}}</span>
										<span v-if="record.account == null || record.account == ''">（--）</span>
										<span v-if="record.account != ''">（{{record.account}}）</span>
									</template>
									<template slot="remark" slot-scope="text, record, index">
										<div v-if="text == null || text == ''" style="text-align: center;">--</div>
										<a-popover>
											<template slot="content">
												<p style="max-width: 200px;word-break:break-all;word-wrapL:break-word;">
													{{text}}</p>
											</template>
											<div v-if="text && text != ''" style="text-align: center;cursor: pointer;color: #01b065;">预览</div>
										</a-popover>
									</template>
									<template slot="message" slot-scope="text, record, index">
										<div v-if="text == null || text == ''" style="text-align: center;">--</div>
										<a-popover>
											<template slot="content">
												<p style="max-width: 200px;word-break:break-all;word-wrapL:break-word;">
													{{text}}</p>
											</template>
											<div v-if="text && text != ''" style="text-align: center;cursor: pointer;color: #01b065;">查看</div>
										</a-popover>
									</template>
								</a-table>
								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total}}</span>条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
										              :current="page"
										              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
										              @change="changePage"
										              @showSizeChange="showSizeChange"/>
									</div>
								</div>
							</a-spin>
						</div>
						<!--部门选择框-->
						<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum"
						                  :callback="modalVisibleChange3" :is_special="1"></chooseDepartment>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import chooseChat from '@/components/groupChat/ChooseStaffChat.vue'
	import moment from 'moment';

	const columns = [
		{
			title    : "员工操作",
			dataIndex: "user_name",
			key      : "user_name",
			width    : '10%',
		},
		{
			title    : "类型",
			dataIndex: "typeName",
			key      : "typeName",
			width    : '20%'
		},
		{
			title    : "发送时间",
			dataIndex: "send_time",
			key      : "send_time"
		},
		{
			// title      : "客户昵称/姓名/手机号码",
			dataIndex  : "info",
			key        : "info",
			width      : '15%',
			slots      : {title: "info2"},
			scopedSlots: {customRender: "info"},
		},
		{
			title    : "零钱金额",
			dataIndex: "money",
			key      : "money",
			scopedSlots: {customRender: "money"},
		},
		{
			title    : "商户订单号/微信付款单号",
			dataIndex: "transaction_id",
			key      : "transaction_id",
			width    : '20%',
			scopedSlots: {customRender: "transaction_id"},
		},
		// {
		// 	title      : "店铺（购物账号）",
		// 	dataIndex  : "shop",
		// 	key        : "shop",
		// 	scopedSlots: {customRender: "shop"}
		// },
		{
			title      : "员工备注",
			dataIndex  : "remark",
			key        : "remark",
			scopedSlots: {customRender: "remark"}
		},
		{
			title      : "给客户留言",
			dataIndex  : "message",
			key        : "message",
			scopedSlots: {customRender: "message"}
		}
	];

	export default {
		components: {chooseDepartment, chooseChat},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				moment,
				corpInfo           : [], //企业微信列表
				corpId             : corpId,//企业微信选中的id
				is_hide_phone      : 0,
				recordsList        : [], //表格信息
				isLoading          : false, //Loading 组件显示与隐藏
				//表格部分
				columns,
				//分页
				total              : 1, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				page               : 1, //页码
				pageSize           : 15, //每页数据条数
				checkedList        : [],//选择的成员id数组
				user               : [],//选择的成员的数据
				showModalDepartment: false, //成员选择框显示与隐藏
				chooseNum          : 0, // 已选择的部门成员总个数
				chooseUserNum      : 0,//已选择的成员个数
				chooseDepartmentNum: 0,//已选择的部门个数
				sendType         : -1,
				chatId           : '',
				//左侧筛选
				startValue     : null,
				endValue       : null,
				sendTime       : null,
				endOpen        : false,
				name           : '',//客户昵称、姓名
				phone          : '',//手机号
				s_time         : '',
				e_time         : '',
				orderNumber    : '',//订单号
				shop           : [],//店铺
				shoppingAccount: '',//员工备注
				remark         : '',//购物账户
				//下拉菜单样式
				style          : {width: "200px"},
				perdate        : '',//标题显示时间段
				//导出操作的数据
				is_export      : 0,//导出传1，否则传0
				is_all         : 0,//0当前页导出，1全部导出
				phone2          : '',
				name2           : '',
				checkedList2    : [],
				startValue2     : '',
				endValue2       : '',
				orderNumber2    : '',
				shop2           : '',
				shoppingAccount2: '',
				remark2         : '',
			};
		},

		methods: {
			//左侧企业微信
			handleChange (value) {
				this.corpId = value
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			rollback () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.go(-1)
			},
			// 关注时间
			disabledStartDate (startValue) {
				const endValue = this.endValue;
				if (!startValue || !endValue) {
					return false;
				}
				return startValue.valueOf() > endValue.valueOf();
			},
			disabledEndDate (endValue) {
				const startValue = this.startValue;
				if (!endValue || !startValue) {
					return false;
				}
				return startValue.valueOf() >= endValue.valueOf();
			},
			handleStartOpenChange (open) {
				if (!open) {
					this.endOpen = true;
				}
			},
			handleEndOpenChange (open) {
				this.endOpen = open;
			},
			startTime (startValue) {
				if (startValue == null) {
					this.s_time = ''
				} else {
					this.s_time = startValue.format("X");
				}
			},
			endTime (endValue) {
				if (endValue == null) {
					this.e_time = ''
				} else {
					this.e_time = endValue.format("X");
				}
			},
			//点击确定搜索
			searchStaff () {
				this.getRecordsList();
			},
			//点击重置条件
			reset () {
				let endTime = this.$route.query.etime + ' ' + '23:59:59'
				this.startValue = moment(this.$route.query.stime)
				this.endValue = moment(endTime)
				this.sendTime = [this.startValue, this.endValue]
				this.sendType = -1
				this.chatId = ''
				this.name = ''
				this.phone = ''
				this.orderNumber = ''
				this.shop = []
				this.shoppingAccount = ''
				this.remark = ''
				this.is_export = 0
				this.is_all = 0
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.getRecordsList();
			},
			changeSendType() {
				this.chatId = ''
			},
			selectStaffCallback(chatId) {
				this.chatId = chatId
			},
			//部门选择弹窗组件
			showDepartmentList () {
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
			},
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.checkedList = JSON.parse(JSON.stringify(arr))
						this.user = JSON.parse(JSON.stringify(list))
					} else {
						this.checkedList = []
						this.user = []
					}
				}
				this.showModalDepartment = false
			},
			//重置
			clearDepartmentList () {
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.getRecordsList()
			},
			//选择下载方式
			chooseDownType (e) {
				this.is_all = e.key
				this.is_export = 1
				this.getRecordsList()
			},
			//获取表格内容
			async getRecordsList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				let phone = ''
				let name = ''
				let checkedList = []
				let startValue = ''
				let endValue = ''
				let orderNumber = ''
				let shop = ''
				let shoppingAccount = ''
				let remark = ''

				if (this.is_export == 0) {
					//不导出
					phone = this.phone
					name = this.name
					checkedList = this.checkedList
					startValue = this.startValue ? this.startValue.format("YYYY-MM-DD HH:mm:ss") : ''
					endValue = this.endValue ? this.endValue.format("YYYY-MM-DD HH:mm:ss") : ''
					orderNumber = this.orderNumber
					shop = this.shop
					shoppingAccount = this.shoppingAccount
					remark = this.remark
				} else if (this.is_export == 1) {
					//导出
					phone = this.phone2
					name = this.name2
					checkedList = this.checkedList2
					startValue = this.startValue2
					endValue = this.endValue2
					orderNumber = this.orderNumber2
					shop = this.shop2
					shoppingAccount = this.shoppingAccount2
					remark = this.remark2
				}

				const {data: res} = await this.axios.post("send-money-manage/send-money-list", {
					uid       : localStorage.getItem('uid'),
					corp_id   : this.corpId,
					phone     : phone,
					name      : name,
					user_id   : checkedList,
					send_stime: startValue,
					send_etime: endValue,
					order_id  : orderNumber,
					shop      : shop,
					status    : 1,
					send_type : this.sendType,
					chat_id   : this.chatId,
					account   : shoppingAccount,
					remark    : remark,
					page      : page,
					page_size : pageSize,
					is_export : this.is_export,
					is_all    : this.is_all,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					if (this.is_export == 0) {
						this.recordsList = res.data.money;
						this.is_hide_phone = res.data.is_hide_phone;
						this.total = parseInt(res.data.count);
						this.page = page;
						this.pageSize = pageSize;
						this.quickJumper = this.total > this.pageSize;
					} else {
						window.open(res.data.url);
					}
					this.is_export = 0
					this.is_all = 0

					this.phone2 = phone
					this.name2 = name
					this.checkedList2 = checkedList
					this.startValue2 = startValue
					this.endValue2 = endValue
					this.orderNumber2 = orderNumber
					this.shop2 = shop
					this.shoppingAccount2 = shoppingAccount
					this.remark2 = remark
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.is_export = 0
				this.is_all = 0
				this.getRecordsList(page, pageSize);
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange (page, pageSize) {
				this.is_export = 0
				this.is_all = 0
				this.getRecordsList(1, pageSize);
			},
		},
		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				let endTime = this.$route.query.etime + ' ' + '23:59:59'
				this.startValue = moment(this.$route.query.stime)
				this.endValue = moment(endTime)
				this.sendTime = [this.startValue, this.endValue]
				this.perdate = this.$route.query.perdate
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/redPacket/reconciliation')
				this.getRecordsList()
			})
		}
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
		margin: 0 20px;
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
		line-height: 40px;
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
		/*border: 1px solid #E2E2E2;*/
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

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.content-hd-right {
		float: right;
	}

	.btn-primary {
		width: 108px;
		height: 30px;
		margin-left: 20px;
		text-align: left;
		padding: 0;

		span {
			display: inline-block;
			width: 90px;
			height: 30px;
			line-height: 30px;
			text-align: center;
		}
	}

	.btn-primary1 {
		width: 108px;
		height: 30px;
		margin-left: 20px;
		padding: 0px 15px;
	}

	.btn-primary1[disabled] {
		background-color: #F5F5F5;
		border-color: #D9D9D9;
	}

	/deep/ .ant-form-item-label {
		text-align: left;
		margin-bottom: 10px;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.sider-footer {
		position: fixed;
		height: 50px;
		width: 250px;
		bottom: 0;
		background-color: #FFF;
		border-top: 1px solid #E2E2E2;
		padding-top: 10px;
		z-index: 999;
		text-align: center;
	}

	/*滚动条背景*/
	.scro-right {
		position: relative;
		float: right;
		/*height: 100%;*/
		height: 100%;
		height: calc(100% - 50px) !important;
		/*height: -moz-calc(100% - 50px);*/
		/*height: -webkit-calc(100% - 50px);*/
		width: 3px;
		background-color: #FFF;
		overflow: hidden;
	}

	/*滚动条*/
	.scro-line {
		position: absolute;
		z-index: 1;
		top: 0px;
		right: 0px;
		width: 3px;
		border-radius: 3px;
		/*height: 100px;*/
		overflow: hidden;
		background-color: #D3D3D3;
	}

	.sider-content {
		float: left;
		width: 100%;
		width: calc(100% - 3px);
		width: -moz-calc(100% - 3px);
		width: -webkit-calc(100% - 3px);
		max-height: 100%;
		overflow: hidden;
	}

	.sider-two {
		padding: 0 20px;
	}

	.sider-title {
		height: 50px;
		width: 250px;
		border-bottom: 1px solid #E2E2E2;
		line-height: 50px;
		text-align: center;
	}

	.sider-tags {
		text-align: left;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 5px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	.sider-one {
		border-bottom: 1px solid #E2E2E2;
		padding: 0 20px 20px;
	}
	.select-option {
		display: inline-block;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.select-option label {
		display: inline-block;
		text-align: right;
		width: 100px;
	}
</style>
