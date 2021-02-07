<template>
	<div style="width: 100%; height: 100%; overflow-y: scroll;position: absolute;" class="scroll">
		<div class="page-title">
			会员管理
			<a-button type="primary" style="font-size: 14px;float: right;margin-top: 9px;margin-right: 20px;" @click="goAppCenter" icon="rollback">返回</a-button>
		</div>
		<div v-if="storeList.length == 0 && isShow" class="empty-img">
			<img src="../../../assets/thirdPartyStore/empty.png" alt="">
			<p class="empty-txt">目前只针对小猪智慧店铺平台开放会员管理。</p>
			<a-button type="primary" class="empty-btn" @click="goStore">去绑定</a-button>
		</div>
		<div class="home-left-contain" v-if="storeList.length != 0">
			<a-spin :spinning="spinning" tip="Loading..." size="large"
			        :class="spinning?'spinning-true':'spinning-false'">
				<div class="tabs-contain" style="margin-top: 20px">
					<div class="account-filter" v-if="storeList && storeList.length > 0">
						<a-tabs class="store-list-tab" type="card" v-model="bindId" @change="changeStoreId"
						        style="width: 100%;">
							<a-tab-pane v-for="(item, index) in storeList" :key="item.key">
								<div slot="tab">
									<a-tooltip placement="top">
										<template slot="title">
											<span>{{item.username}}</span>
										</template>
										<img style="width: 24px; height: 24px;" src="../../../assets/WeChatLogo.png"/>
										{{item.username}}
									</a-tooltip>
								</div>
							</a-tab-pane>
						</a-tabs>
						<div style="padding: 0 20px;">
							<div style="padding: 10px 0;">
								<a-row>
									<a-col class="select-col">
										<a-input
												@keyup.enter="find"
												allowClear
												placeholder="手机号，支持尾号查询"
												style="width: 200px;margin-right:15px;"
												v-model="phone"
										/>
									</a-col>
									<a-col class="select-col">
										<a-input
												@keyup.enter="find"
												allowClear
												placeholder="卡号"
												style="width: 200px;margin-right:15px;"
												v-model="cardNo"
										/>
									</a-col>
									<a-col class="select-col">
										<a-input
												@keyup.enter="find"
												allowClear
												placeholder="昵称/姓名"
												style="width: 200px;margin-right:15px;"
												v-model="nickName"
										/>
									</a-col>
									<a-col class="select-col">
										<a-select
												allowClear
												showSearch
												optionFilterProp="children"
												placeholder="所有等级"
												style="width: 200px;"
												v-model="gradeId"
										>
											<a-select-option :value="''">所有等级</a-select-option>
											<a-select-option v-for="item in gradeList" :value="item.id">
												<span>{{item.title}}</span>
											</a-select-option>
										</a-select>
									</a-col>
									<a-col class="select-col">
										<a-select
												allowClear
												showSearch
												optionFilterProp="children"
												placeholder="激活状态"
												style="width: 200px;"
												v-model="activeStatus"
										>
											<a-select-option :value="'1'">已激活已消费</a-select-option>
											<a-select-option :value="'2'">已激活未消费</a-select-option>
										</a-select>
									</a-col>
									<a-col class="select-col">
										<a-range-picker
												:show-time="{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }"
												format="YYYY-MM-DD HH:mm:ss"
												allowClear
												:disabled-date="disabledDate"
												v-model="activeTime"
												@change="changeTime"
										/>
										<a-button type="primary" style="margin: 0 15px;" @click="find">搜索</a-button>
										<a-button @click="clear">清空</a-button>
									</a-col>
								</a-row>
							</div>
							<div class="content-bd">
								<div class="spin-content">
									<a-table
											:columns="columns"
											:dataSource="membersList"
											:pagination="false"
											:rowClassName="rowClassName"
									>
										<span slot="nickName" slot-scope="text, record">
											<span style="float: left">
												<img style="width: 42px; height: 42px;" :src="record.headimgurl">
											</span>
											<span style="float: left">
												<p class="nickname-cardno">{{record.nickName}}</p>
												<p class="nickname-cardno">{{record.cardNo}}</p>
											</span>
										</span>
										<span slot="name" slot-scope="text, record">
											<p>{{record.name}}</p>
											<p>{{record.phone}}</p>
										</span>
									</a-table>
									<div style="width: 100%;" v-show="total > 0">
										<div style="height: 45px;display: inline-block;margin: 25px 0 0 7px;">
											共
											<span style="color: blue">{{total}}</span>
											条
										</div>
										<div class="pagination" style="margin-top: 20px;float: right;">
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
							</div>
						</div>
					</div>
				</div>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'

	const columns = [
		{
			title    : "序号",
			dataIndex: "key",
			key      : "key",
		},
		{
			title      : "昵称/卡号",
			dataIndex  : "nickName",
			key        : "nickName",
			scopedSlots: {customRender: "nickName"}
		},
		{
			title      : "姓名/电话",
			dataIndex  : "name",
			key        : "name",
			scopedSlots: {customRender: "name"}
		},
		{
			title    : "等级",
			dataIndex: "grade",
			key      : "grade"
		},
		{
			title    : "积分",
			dataIndex: "point",
			key      : "point"
		},
		{
			title    : "余额",
			dataIndex: "money",
			key      : "money"
		},
		{
			title    : "经验值",
			dataIndex: "experience",
			key      : "experience"
		},
		{
			title    : "状态",
			dataIndex: "status",
			key      : "status"
		},
		{
			title    : "激活时间",
			dataIndex: "activeTime",
			key      : "activeTime"
		},
	];
	export default {
		name      : 'HomeLeftContain',
		components: {},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				isShow       : false,
				spinning     : false,
				// 展示公众号id
				bindId   : "",
				storeList    : [],
				// 企业微信列表
				phone        : '', // 手机号
				cardNo       : '', // 卡号
				nickName     : '', // 昵称/姓名
				gradeId      : [], // 等级
				gradeList    : [],
				activeStatus : [], // 激活状态
				activeTime   : null,
				columns,
				membersList  : [], // 订单列表
				page         : 1,
				pageSize     : 15,
				total        : 0,
				quickJumper  : false,
				loading      : false,
				detailVisible: false, // 详情弹窗
				//
				orderDetail  : {}
			}
		},
		created () {

		},
		mounted () {
			this.getStore()
		},
		methods   : {
			goAppCenter() {
				this.$router.push('/appCenter/list')
			},
			goStore(){
				this.$router.push('/thirdPartyStore/store')
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 店铺列表
			async getStore () {
				this.isLoading = true
				const {data: res} = await this.axios.post(
					"third-store/get-merchants",
					{
						isAll: 1,
						type : 1,
						uid : localStorage.getItem('uid')
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.storeList = res.data.info
					if (this.storeList.length > 0) {
						this.bindId = this.storeList[0].key
						this.getGradeList()
						this.getMembers()
					} else {
						this.isShow = true
					}
				}
			},
			// 获取等级
			async getGradeList () {
				const {data: res} = await this.axios.post(
					"third-store/grade-list",
					{
						bindId: this.bindId,
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.gradeList = res.data
				}
			},
			// 获取会员列表
			async getMembers (page = 1, pageSize = this.pageSize) {
				this.spinning = true
				const {data: res} = await this.axios.post(
					"third-store/get-members",
					{
						bindId       : this.bindId,
						activeTime  : this.activeTime && this.activeTime.length > 1 ? [moment(this.activeTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(this.activeTime[1]).format('YYYY-MM-DD HH:mm:ss')] : null,
						gradeId     : this.gradeId,
						activeStatus: this.activeStatus,
						phone       : this.phone,
						cardNo      : this.cardNo,
						nickName    : this.nickName,
						page        : page,
						pageSize    : pageSize
					}
				);
				if (res.error != 0) {
					this.spinning = false
					this.$message.error(res.error_msg)
				} else {
					this.spinning = false
					this.membersList = res.data.info
					this.total = parseInt(res.data.count)
					this.page = page
					this.pageSize = pageSize
				}
			},
			// 切换企业微信
			changeStoreId (id) {
				this.spinning = true
				this.bindId = id;
				this.getGradeList()
				this.clear()
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			// 激活时间
			changeTime (date, dateString) {
				this.activeTime = date
			},
			// 搜索
			find () {
				if (!this.activeTime || this.activeTime.length == 0) {
					this.activeTime = null
				}
				this.getMembers()
			},
			// 清除
			clear () {
				this.gradeId = []
				this.activeStatus = []
				this.activeTime = null
				this.phone = ''
				this.cardNo = ''
				this.nickName = ''
				this.getMembers()
			},
			changePage (page, pageSize) {
				this.getMembers(page, this.pageSize)
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange (page, pageSize) {
				this.getMembers(this.page, pageSize)
			},
			moment,
		}
	}
</script>

<style scoped>
	.page-title {
		font-size: 16px;
		height: 50px;
		line-height: 50px;
		padding-left: 20px;
		margin-bottom: 15px;
		background-color: #FFFFFF;
	}

	.home-left-contain {
		width: 100%;
		height: calc(100% - 20px);
		padding: 0 20px;
	}

	.store-list-tab >>> .ant-tabs-nav-container {
		height: 50px !important;
	}

	.store-list-tab >>> .ant-tabs-tab {
		height: 50px !important;
		line-height: 50px !important;
		margin-right: 0px !important;
		/*margin-top: -1px !important;*/
		/*border-bottom: 1px solid #E9E9E9 !important;*/
		border: 0px !important;
		background-color: #F5F5F5 !important;
	}

	.store-list-tab >>> .ant-tabs-tab div {
		max-width: 190px;
		min-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.store-list-tab >>> .ant-tabs-tab-active {
		background-color: #FFFFFF !important;
		border-bottom: 0px !important;
	}

	/deep/ .ant-tabs-content {
		padding-bottom: 0px !important;
	}

	.spinning-true {
		width: 100%;
	}

	.account-filter {
		background-color: #FFF;
		min-height: 100%;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}
	.nickname-cardno {
		margin-left: 5px;
		margin-bottom: 2px;
	}
	.select-col {
		margin-bottom: 15px;
		display: inline-block;
		margin-right: 10px;
	}

	.empty-img {
		position: absolute;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
		text-align: center;
	}

	.empty-txt {
		width: 665px;
		margin-top: 20px;
		font-size: 16px;
	}

	.empty-btn {
		width: 110px;
		height: 40px;
		font-size: 16px;
		line-height: 40px;
	}
</style>
