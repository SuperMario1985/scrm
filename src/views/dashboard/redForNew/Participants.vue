<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<div style="height: 50px;line-height: 50px;background-color: #FFFFFF;">
				<label style="margin-left: 20px;">
					{{title}}：
				</label>
				<a-button type="primary" style="float: right; margin: 9px 20px 0 0;" icon="rollback" @click="rollback">
					返回列表
				</a-button>
			</div>
		</div>
		<div class="participants">
			<div style="margin: 10px 0px;padding: 10px 20px 0 20px;">
				<a-input placeholder="搜索客户名称" v-model="name" style="width: 170px; margin-right: 5px;" @keydown.enter="searchFans"/>
				<a-select v-model="status" style="width: 170px; margin-right: 5px;" placeholder="全部领取状态" allowClear>
					<a-select-option :value="-1">全部领取状态</a-select-option>
					<a-select-option :value="0">未领取</a-select-option>
					<a-select-option :value="1">已领取</a-select-option>
				</a-select>
				<a-button @click="showDepartmentList" style="width: 210px;margin-right: 5px;">
					<span v-if="chooseNum > 0">已选择{{chooseNum}}名成员</span>
					<span v-else>选择成员</span>
				</a-button>
				<a-range-picker
						:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
						format="YYYY-MM-DD HH:mm"
						allowClear
						style="width:320px;margin-right: 5px;"
						:disabled-date="disabledDate"
						v-model="joinTime"
						@change="changeTime"
				/>
				<a-button style="margin-right: 5px;" type="primary" @click="searchFans">查找</a-button>
				<a-button @click="reloadParticipants">清除</a-button>
			</div>
			<div style="padding: 0 20px 20px;">
				<a-spin tip="Loading..." size="large" :spinning="isLoading1">
					<a-table :columns="columns1" :dataSource="participantsList"
					         :pagination="false"
					         :rowClassName="rowClassName">
							<span slot="user" slot-scope="text, record">
								<a-avatar v-if="record.avatar" shape="square" :size="42" :src="record.avatar"
								          style="float: left;"/>
										<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
										     src="../../../assets/useradvart.png"/>
										<div class="participant-name">
												{{record.name}}
										</div>
							</span>
						<span slot="userInfo" slot-scope="text, record">
							<a-avatar v-if="record.avatar" shape="square" :src="record.avatar"
							          style="float: left;height: 42px; width: 42px;"/>
							<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
							     src="../../../assets/useradvart.png"/>
							<div style="float: left;max-width: 270px;word-wrap:break-word;line-height: 32px;">
								<a-popover placement="top">
										<span slot="content">
											{{record.name_convert}}
										</span>
									<p style="display: inline-block;margin-bottom: 0px; margin-left: 10px;max-width: 140px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{record.name_convert}}</p>
								</a-popover>
							</div>
							<span style="line-height: 32px;">
									<a-icon slot="prefix" type="man"
									        style="margin-left: 10px;color: #427EBA;"
									        v-if="record.gender==1"/>
									<a-icon
											slot="prefix"
											type="woman"
											style="margin-left: 10px;color: #ED4997;"
											v-if="record.gender==2"
									/>
							</span>
						</span>
						<span slot="employee" slot-scope="text, record">
							{{record.userName}}-{{record.departName}}
						</span>
						<span slot="status" slot-scope="text, record">
							<span v-if="record.status == 0">未领取</span>
							<span v-if="record.status == 1">已领取</span>
							<span v-if="record.status == null">--</span>
						</span>
						<span slot="send_money" slot-scope="text, record">
							<span v-if="record.status == null">--</span>
							<span v-else>{{record.send_money}}元</span>
						</span>
					</a-table>
					<!-- 分页 -->
					<div class="pagination" style="width: 100%;position: absolute;margin: 40px 0px 20px;"
					     v-show="total2 > 0">
						<div style="height: 32px;float: left;line-height: 32px;">
							共
							<span style="color: blue">{{total2}}</span>条
						</div>
						<div class="pagination" style="height: 32px;float: right;">
							<a-pagination :total="total2" showSizeChanger :showQuickJumper="quickJumper2"
							              :current="page2"
							              :pageSize="pageSize2" :pageSizeOptions="['15','30','50','100']"
							              @change="changePage2"
							              @showSizeChange="showSizeChange2"/>
						</div>
					</div>
				</a-spin>
			</div>
		</div>
		<chooseDepartment :show="showModalDepartment" :chooseNum="chooseNum"
		                  :callback="modalVisibleChange3" noticeTitle="只显示具有外部联系人权限的成员" :is_external="1"></chooseDepartment>
	</div>
</template>

<script>
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import moment from 'moment'

	const columns1 = [
		{
			title      : "拉新时间（添加时间）",
			dataIndex  : "create_time",
			key        : "create_time"
		},
		{
			title      : "新客信息",
			dataIndex  : "userInfo",
			key        : "userInfo",
			scopedSlots: {customRender: "userInfo"}
		},
		{
			title      : "归属成员",
			dataIndex  : "employee",
			key        : "employee",
			scopedSlots: {customRender: "employee"}
		},
		{
			title      : "领取状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "领取金额",
			dataIndex  : "send_money",
			key        : "send_money",
			scopedSlots: {customRender: "send_money"}
		}
	];
	export default {
		name    : "redForNewParticipants",
		components: {chooseDepartment},
		data () {
			return {
				id                 : '',// 活动id
				title              : '', // 活动名称
				corpId             : '',
				showModalDepartment: false, // 选择成员弹窗
				checkedList        : [], // 选择的成员
				chooseNum          : 0, // 选择成员数量
				status             : -1, // 领取状态
				joinTime           : null, // 添加时间
				columns1,
				name               : '', // 名称
				isLoading1         : false,
				participantsList   : [], // 参与者列表
				total2             : 0,
				page2              : 1,
				pageSize2          : 15,
				quickJumper2       : false,
				selectedRowKeys    : [], // 多选id
				userKeys           : [], // 所有id
			}
		},
		methods : {
			moment,
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 返回列表
			rollback () {
				this.$router.push('/redForNew/list?isRefresh=1')
			},
			// 选择成员
			showDepartmentList () {
				this.showModalDepartment = true
			},
			// 选择成员回调
			modalVisibleChange3 (event, arr, num) {
				if (event == "ok") {
					this.checkedList = arr
					this.chooseNum = num
				}
				this.showModalDepartment = false
			},
			// 时间限制
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			// 修改支付时间
			changeTime (date, dateString) {
				this.joinTime = date
			},
			// 查找粉丝
			searchFans () {
				this.participants(1, 15)
			},
			// 刷新
			reloadParticipants () {
				this.name = ''
				this.status = -1
				this.joinTime = null
				this.checkedList = []
				this.chooseNum = 0
				this.participants(1, 15)
			},
			// 参与者
			async participants (page = 1, pageSize = this.pageSize2) {
				this.isLoading1 = true
				const {data: res} = await this.axios.post("work-contact-way-redpacket/redpacket-send-list", {
					corp_id : this.corpId,
					id : this.id,
					name : this.name,
					status : this.status,
					user_ids: this.checkedList,
					s_date : this.joinTime ? moment(this.joinTime[0]).format("YYYY-MM-DD HH:mm") : '',
					e_date : this.joinTime ? moment(this.joinTime[1]).format("YYYY-MM-DD HH:mm") : '',
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading1 = false;
					this.$message.error(res.error_msg);
				} else {
					this.page2 = page
					this.pageSize2 = pageSize
					this.participantsList = res.data.list
					this.total2 = parseInt(res.data.count)
					this.isLoading1 = false
				}

			},
			// 参与者切换分页
			changePage2 (page, pageSize) {
				this.participants(page, this.pageSize2)
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange2 (page, pageSize) {
				this.participants(1, pageSize)
			},
		},
		mounted () {
			this.title = decodeURIComponent(this.$route.query.title)
			this.id = decodeURIComponent(this.$route.query.id)
			this.corpId = decodeURIComponent(this.$route.query.corp_id)
			this.participants()
		},
	}
</script>

<style lang="less" scoped>
	.participants {
		margin: 10px 20px;
		background-color: #FFFFFF;
	}

	/deep/ .ant-tabs-card-content {
		padding-bottom: 0px !important;
	}

	.participant-name {
		float: left;
		margin-left: 10px;
		line-height: 42px;
		max-width: 100px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>