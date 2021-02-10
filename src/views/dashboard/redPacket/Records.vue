<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden;">
				<a-layout style="position: absolute;left:0;top:0;bottom:0;right:0;overflow-x: hidden; overflow-y: auto;"
				          class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>红包记录</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">红包记录</div>
						<div class="content-hd">
							<div style="background-color: #FFFFFF;padding: 20px 0 10px 0; margin-top: 12px;">
								<span class="select-option" v-if="corpLen > 1">
									<label style="margin-right: 5px;">企业微信：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 5px;"
											@change="handleChange"
											v-model="corpId"
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
									<a-input @keyup.enter="searchStaff" style="margin-right: 5px;width: 210px;"
									         placeholder="请输入客户姓名/客户昵称/公司名称"
									         v-model="name"></a-input>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">手机号码：</label>
									<a-input
											style="margin-right: 5px;width: 210px;"
											:value="phone"
											@keyup.enter="searchStaff"
											@change="phoneChange"
											placeholder="支持手机号后四位查找"
											:maxLength="11"
									/>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">订单号：</label>
									<a-input
											style="margin-right: 5px;width: 210px;"
											@keyup.enter="searchStaff"
											v-model="orderNumber"
											placeholder="请输入订单号/微信付款单号"
									/>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">备注/留言：</label>
									<a-input
											style="margin-right: 5px;width: 210px;"
											@keyup.enter="searchStaff"
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
									<label style="margin-right: 5px;">领取状态：</label>
									<a-select v-model="status" showSearch optionFilterProp="children"
									          style="width: 210px; margin-right: 5px;">
										<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="0">待领取</a-select-option>
										<a-select-option :value="1">已领取</a-select-option>
										<a-select-option :value="2">已过期</a-select-option>
										<a-select-option :value="4">领取失败</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">发送对象：</label>
									<a-select @change="changeSendType" v-model="sendType" showSearch
									          optionFilterProp="children"
									          style="width: 210px; margin-right: 5px;">
										<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="1">客户群</a-select-option>
										<a-select-option :value="2">客户</a-select-option>
									</a-select>
									<span v-if="sendType == 1"
									      style="width: 30px; height: 1px;background-color: rgba(0, 0, 0, 0.65); display: inline-block;vertical-align: middle; margin: 0 8px;"></span>
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
											:disabled-date="disabledDate"
											v-model="sendTime"
											@change="changeTime"
									/>
									<a-button type="primary" style="margin-right: 5px;"
									          @click="searchStaff">查询</a-button>
									<a-button style="margin-right: 10px;" @click="reset">重置</a-button>
								</span>
							</div>
							<div style="height: 60px;">
								<a-dropdown v-has="'records-export'">
									<a-menu slot="overlay" @click="chooseDownType">
										<a-menu-item key="0">当前页导出</a-menu-item>
										<a-menu-item key="1">全部导出</a-menu-item>
									</a-menu>
									<a-button type="primary" style="float: right;margin-top: 14px;">导出
										<a-icon style="color: #FFFFFF;" type="down"/>
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
										:rowClassName="rowClassName" v-has="'records-list'"
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
											<div v-if="text && text != ''"
											     style="text-align: center;cursor: pointer;color: #01b065">
												预览
											</div>
										</a-popover>
									</template>
									<template slot="message" slot-scope="text, record, index">
										<div v-if="text == null || text == ''" style="text-align: center;">--</div>
										<a-popover>
											<template slot="content">
												<p style="max-width: 200px;word-break:break-all;word-wrapL:break-word;">
													{{text}}</p>
											</template>
											<div v-if="text && text != ''"
											     style="text-align: center;cursor: pointer;color: #01b065;">
												查看
											</div>
										</a-popover>
									</template>
								</a-table>
								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'records-list'">
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
						<chooseDepartment ref="user" :id="corpId" :show="showModalDepartment" :chooseNum="chooseNum"
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
			title      : "领取状态",
			dataIndex  : "statusName",
			key        : "statusName",
			scopedSlots: {customRender: "statusName"},
		},
		{
			title      : "零钱金额",
			dataIndex  : "money",
			key        : "money",
			scopedSlots: {customRender: "money"},
		},
		{
			title      : "商户订单号/微信付款单号",
			dataIndex  : "transaction_id",
			key        : "transaction_id",
			width      : '20%',
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
				corpLen            : JSON.parse(localStorage.getItem('corpArr')).length,
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
				status             : -1,
				sendType           : -1,
				chatId             : '',
				//滚动条
				showTransition     : 1,
				mouseEnterFlag     : false,
				startY             : 0,
				scrollFlag         : false,
				scroRight          : true,
				scrollOutFlag      : false,
				//左侧筛选
				startValue         : null,
				endValue           : null,
				endOpen            : false,
				name               : '',//客户昵称、姓名
				phone              : '',//手机号
				s_time             : '',
				e_time             : '',
				sendTime           : null,
				orderNumber        : '',//订单号
				shop               : [],//店铺
				shoppingAccount    : '',//员工备注
				remark             : '',//购物账户
				//下拉菜单样式
				style              : {width: "200px"},
				moment,
				//导出操作的数据
				is_export          : 0,//导出传1，否则传0
				is_all             : 0,//0当前页导出，1全部导出
				phone2             : '',
				name2              : '',
				checkedList2       : [],
				startValue2        : '',
				endValue2          : '',
				orderNumber2       : '',
				shop2              : '',
				shoppingAccount2   : '',
				remark2            : '',
			};
		},

		methods: {
			//左侧企业微信
			handleChange (value) {
				this.corpId = value
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.getRecordsList()
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
			//手机号格式更换
			phoneChange (e) {
				const {value} = e.target;
				const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
				if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
					this.phone = value;
				}
			},
			//点击确定搜索
			searchStaff () {
				this.getRecordsList();
			},
			//点击重置条件
			reset () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.is_export = 0
				this.is_all = 0
				this.startValue = null
				this.endValue = null
				this.name = ''
				this.phone = ''
				this.orderNumber = ''
				this.shop = []
				this.shoppingAccount = ''
				this.remark = ''
				this.status = -1
				this.sendTime = null
				this.sendType = -1
				this.chatId = ''
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.getRecordsList();
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//部门选择弹窗组件
			showDepartmentList () {
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
			},
			changeSendType () {
				this.chatId = ''
			},
			selectStaffCallback (chatId) {
				this.chatId = chatId
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			changeTime (date, dateString) {
				if (date.length > 1) {
					this.startValue = date[0]
					this.endValue = date[1]
				} else {
					this.startValue = null
					this.endValue = null
				}
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
					status    : this.status,
					send_type : this.sendType,
					chat_id   : this.chatId,
					order_id  : orderNumber,
					shop      : shop,
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
						this.is_hide_phone = res.data.is_hide_phone
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
			// 滚动条高度
			setScroLineHeight () {
				let that = this
				let winHeight = 0;
				winHeight = that.$refs.scroLeft.clientHeight;
				if (winHeight >= that.$refs.scroLeft.scrollHeight) {
					that.scroRight = false
				} else {
					// that.$refs.scroLine.style.height = "200px"
					that.$refs.scroLine.style.height = (winHeight - 50) / that.$refs.scroLeft.scrollHeight * (that.$refs.scroRight.scrollHeight - 50) + "px";
					that.scroRight = true
				}
			},
			// 滑轮滚动（火狐）
			initFirefoxScroll () {
				let that = this
				if (document.addEventListener) {
					document.addEventListener('DOMMouseScroll', function (e) {
						let event1 = window.event || e;
						let Y = that.$refs.scroLeft.scrollTop;
						let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
						if (event1.detail >= 0) {
							Y = Y + 80
						} else {
							Y = Y - 80
						}
						if (Y < 0) Y = 0;
						if (Y > H - 50) Y = H;
						that.$refs.scroLeft.scrollTop = Y;
						let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
						if (Y > 0 && Y < H - 50) {
							SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
						}
						if (SH > this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight) {
							SH = this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight
						}
						if (SH < 0) SH = 0;
						that.$refs.scroLine.style.top = SH + "px";
					}, false)
				}
			},
			// 滑轮滚动
			scrollWheel () {
				var event = event ? event : (window.event ? window.event : null);
				let Y = this.$refs.scroLeft.scrollTop;
				let H = this.$refs.scroLeft.scrollHeight - this.$refs.scroLeft.clientHeight;
				if (event.wheelDelta >= 120) {
					Y = Y - event.wheelDelta * 0.5
				} else {
					Y = Y - event.wheelDelta * 0.5
				}
				if (Y < 0) Y = 0;
				if (Y > H) Y = H;
				this.$refs.scroLeft.scrollTop = Y;
				let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
				if (Y > 0 && Y < H) {
					SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
				}
				if (SH < 0) SH = 0;
				this.$refs.scroLine.style.top = SH + "px";
			},
			// 滚动栏点击跳转
			jumpScroll () {
				let that = this
				if (!that.mouseEnterFlag) {
					var event = event ? event : (window.event ? window.event : null);
					let Y = that.$refs.scroLeft.scrollTop;
					let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
					if (event.y - that.startY >= 0) {
						Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
					} else {
						Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
					}
					that.$refs.scroLeft.scrollTop = Y;
					if (Y < 0) {
						Y = 0;
					}
					if (Y > H) {
						Y = H;
					}
					let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
					if (Y > 0 && Y < H) {
						SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
					}
					if (SH < 0) SH = 0;
					that.$refs.scroLine.style.top = SH + "px";
					that.startY = event.y
				}
			},
			// 滚动条点击
			scroLineDown () {
				this.mouseEnterFlag = true
				this.startY = event.y;  // 按下鼠标指针的y轴坐标
				if (window.addEventListener) {
					window.addEventListener('mouseup', this.scroLineUp, false)
					window.addEventListener('mousemove', this.scroLineMove, false)
				}
				this.banUserSelect();
			},
			// 滚动条长按移动
			scroLineMove () {
				let that = this
				if (that.mouseEnterFlag) {
					var event = event ? event : (window.event ? window.event : null);
					let Y = that.$refs.scroLeft.scrollTop;
					let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
					let CH = (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight;
					Y = Y + CH;
					that.$refs.scroLeft.scrollTop = Y;
					if (Y < 0) {
						Y = 0;
					}
					if (Y > H) {
						Y = H;
					}
					let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
					if (Y > 0 && Y < H) {
						SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
					}
					if (SH < 0) SH = 0;
					that.$refs.scroLine.style.top = SH + "px";

					that.startY = event.y;
				}
			},
			// 鼠标左击抬起
			scroLineUp () {
				if (this.mouseEnterFlag == true) {
					var event = event ? event : (window.event ? window.event : null);
					this.mouseEnterFlag = false
					if (this.changeWidthSmallFlag) {
						this.changeWidthSmall()
						this.changeWidthSmallFlag = false
					}
					if (this.scrollOutFlag) {
						this.scrollOut()
						this.scrollOutFlag = false
					}
					if (window.removeEventListener) {
						window.removeEventListener('mouseup', this.scroLineUp, false)
						window.removeEventListener('mousemove', this.scroLineMove, false)
					}
					this.userSelect()
				}
			},
			// 鼠标进入左边页面
			scroll () {
				this.scrollFlag = true
			},
			// 鼠标移出左边页面
			scrollOut () {
				if (!this.mouseEnterFlag) {
					this.scrollFlag = false
				}
				this.scrollOutFlag = true
			},
			banUserSelect () {
				this.$refs.fansList.style.MozUserSelect = 'none'
				this.$refs.fansList.style.UserSelect = 'none'
				this.$refs.fansList.style.webkitUserSelect = 'none'
				this.$refs.fansList.style.MsUserSelect = 'none'
			},
			userSelect () {
				this.$refs.fansList.style.MozUserSelect = 'text'
				this.$refs.fansList.style.UserSelect = 'text'
				this.$refs.fansList.style.webkitUserSelect = 'text'
				this.$refs.fansList.style.MsUserSelect = 'text'
			},
		},
		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				// this.corpId = this.corpInfo[0].corpid
				//TODO 获取teams
				// this.$emit('changeTeamId', this.teamId)
				// this.$emit('changeCorpId', this.corpId)
				// //滚动条
				// let observer = new MutationObserver(this.setScroLineHeight)
				// observer.observe(this.$refs.scroLine, {
				// 	attributes       : true,
				// 	attributeFilter  : ['style'],
				// 	attributeOldValue: true
				// })
				// this.setScroLineHeight()
				// this.initFirefoxScroll()
				this.getRecordsList()
			});
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

	.list {
		overflow-y: hidden;
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
