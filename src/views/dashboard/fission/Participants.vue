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
			<!--			<a-tabs style="margin-top: 20px;" @change="changeParticipantsType" type="card">-->
			<!--				<a-tab-pane tab="参与者" key="0"></a-tab-pane>-->
			<!--				<a-tab-pane tab="黑名单" key="1"></a-tab-pane>-->
			<!--			</a-tabs>-->
			<div style="margin: 10px 0px;padding: 10px 20px 0 20px;">
				<a-input-search placeholder="搜索参与者名称" v-model="name" style="width: 170px;" @search="searchFans"
				                enterButton/>
				<div style="float: right;">
					<!--					<a-button style="margin-right: 5px" :disabled="selectedRowKeys.length == 0" @click="blackMore">-->
					<!--						<span v-if="participantsType == 0">移入黑名单</span>-->
					<!--						<span v-if="participantsType == 1">移出黑名单</span>-->
					<!--					</a-button>-->
					<!--					<a-button style="margin-right: 5px" v-if="participantsType==0">导出</a-button>-->
					<a-button @click="reloadParticipants">刷新</a-button>
				</div>
			</div>
			<div style="padding: 0 20px 20px;">
				<a-spin tip="加载中..." size="large" :spinning="isLoading1">
					<a-table v-if="participantsType == 0" :columns="columns1" :dataSource="participantsList"
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
						<span slot="status" slot-scope="text, record">
								<span v-if="record.status == 0">未完成</span>
								<span v-if="record.status == 1">进行中</span>
								<span v-if="record.status == 2">已完成</span>
							</span>
						<span slot="complete_time" slot-scope="text, record">
								<span v-if="record.status == 2">{{record.complete_time}}</span>
								<span v-if="record.status != 2">--</span>
							</span>
						<span slot="help" slot-scope="text, record">
								{{record.help_num}}/{{record.fission_num}}
							</span>
						<span slot="prize_status" slot-scope="text, record">
								<span v-if="record.status == 2 && record.prize_status == 0">未处理</span>
								<span v-if="record.status == 2 &&record.prize_status == 1">已处理</span>
								<span v-if="record.status != 2 ">--</span>
							</span>
						<span slot="action" slot-scope="text, record">
											<a-button
													v-if="(!(prize_send_type == 2 && is_end == 0)) && record.status == 2 && record.prize_status==0"
													@click="prizeStatus(record.id)"
													style="margin: 0 5px 5px 0" v-has="'fission-reward'">奖品处理</a-button>
							<!--											<a-button @click="blackOne(record.id)" v-if="record.prize_status != 1"-->
							<!--											          style="margin: 0 5px 5px 0">移入黑名单</a-button>-->
											<a-button @click="helpRecord(record.id, record.name)"
											          style="margin: 0 5px 5px 0">助力记录</a-button>
										</span>
					</a-table>
					<a-table v-if="participantsType == 1" :columns="columns2" :dataSource="participantsList"
					         :pagination="false"
					         :rowClassName="rowClassName" :rowSelection="rowSelection">
							<span slot="user" slot-scope="text, record">
								<a-avatar v-if="record.avatar" shape="square" :size="42" :src="record.avatar"
								          style="float: left;"/>
										<img style="width: 30px;height: 30px;float: left;" v-if="!record.avatar"
										     src="../../../assets/useradvart.png"/>
										<div class="participant-name">
												{{record.name}}
										</div>
							</span>
						<span slot="action" slot-scope="text, record">
											<a-button @click="blackOne(record.id)"
											          style="margin: 0 5px 5px 0">移出黑名单</a-button>
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
	</div>
</template>

<script>
	// 参与者列表
	const columns1 = [
		{
			title      : "参与人",
			dataIndex  : "user",
			key        : "user",
			width      : "200px",
			scopedSlots: {customRender: "user"}
		},
		{
			title      : "任务状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "有效助力人数",
			dataIndex  : "help",
			key        : "help",
			scopedSlots: {customRender: "help"}
		},
		{
			title    : "参与时间",
			dataIndex: "join_time",
			key      : "join_time",
		},
		{
			title      : "任务完成时间",
			dataIndex  : "complete_time",
			key        : "complete_time",
			scopedSlots: {customRender: "complete_time"}
		},
		{
			title      : "奖品处理状态",
			dataIndex  : "prize_status",
			key        : "prize_status",
			scopedSlots: {customRender: "prize_status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '15%',
			scopedSlots: {customRender: "action"}
		}
	];
	// 黑名单列表
	const columns2 = [
		{
			title      : "参与人",
			dataIndex  : "user",
			key        : "user",
			width      : "200px",
			scopedSlots: {customRender: "user"}
		},
		{
			title    : "参与时间",
			dataIndex: "join_time",
			key      : "join_time",
		},
		{
			title    : "拉入黑名单时间",
			dataIndex: "black_time",
			key      : "black_time",
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '15%',
			scopedSlots: {customRender: "action"}
		}
	];
	export default {
		name    : "fissionParticipants",
		data () {
			return {
				title              : '',
				columns1,
				columns2,
				participantsVisible: false, // 参与者弹窗是否显示
				participantsType   : '0', // 0 参与者 1黑名单
				name               : '', // 名称
				isLoading1         : false,
				is_end             : 0,
				prize_send_type    : 1,
				participantsList   : [], // 参与者列表
				fid                : '', // 活动id
				total2             : 0,
				page2              : 1,
				pageSize2          : 15,
				quickJumper2       : false,
				selectedRowKeys    : [], // 多选id
				userKeys           : [], // 所有id
			}
		},
		methods : {
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 参与者和黑名单切换
			changeParticipantsType (key) {
				this.participantsType = key
				this.selectedRowKeys = []
				this.name = ''
				this.participants(1, 15)
			},
			rollback () {
				this.$router.go(-1)
			},
			// 查找粉丝
			searchFans () {
				this.participants(1, 15)
			},
			// 奖品处理
			prizeStatus (jid) {
				let that = this
				that.$confirm({
					title     : "确定奖品发放吗？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.prizeStatusDeal(jid)
					}
				});
			},
			async prizeStatusDeal (jid) {
				const {data: res} = await this.axios.post("fission/prize-status", {
					uid: localStorage.getItem("uid"),
					jid: jid,
				});
				if (res.error != 0) {
					this.isLoading1 = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.participants(this.page2, this.pageSize2)
				}
			},
			// 加入黑名单
			blackOne (id) {
				let that = this;
				let title = "确定移出黑名单吗？"
				if (this.participantsType == 0) {
					title = "确定移入黑名单吗？"
				}
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						let ids = []
						ids.push(id)
						that.black(ids)
					}
				});

			},
			// 批量加入黑名单
			blackMore () {
				let that = this;
				let title = "确定移出黑名单吗？"
				if (this.participantsType == 0) {
					title = "确定移入黑名单吗？"
				}
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.black(that.selectedRowKeys)
					}
				});

			},
			// 加入黑名单
			async black (jid) {
				this.isLoading1 = true
				const {data: res} = await this.axios.post("fission/change-black", {
					uid     : localStorage.getItem("uid"),
					jid     : jid,
					is_black: this.participantsType
				});
				if (res.error != 0) {
					this.isLoading1 = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.participants(1, 15)
				}
			},
			// 刷新
			reloadParticipants () {
				this.name = ''
				this.participants(1, 15)
			},
			// 参与者
			async participants (page = 1, pageSize = this.pageSize2) {
				this.isLoading1 = true
				const {data: res} = await this.axios.post("fission/join-list", {
					uid     : localStorage.getItem("uid"),
					fid     : this.fid,
					is_black: this.participantsType,
					name    : this.name,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading1 = false;
					this.$message.error(res.error_msg);
				} else {
					this.page2 = page
					this.pageSize2 = pageSize
					this.participantsList = res.data.fission
					this.is_end = res.data.is_end
					this.prize_send_type = res.data.prize_send_type
					this.userKeys = res.data.keys
					this.total2 = parseInt(res.data.count)
					this.isLoading1 = false
					this.participantsVisible = true
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
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
			},
			helpRecord (jid, name) {
				this.$router.push('/fission/helpRecord?jid=' + jid + '&name=' + name)
			}
		},
		mounted () {
			this.title = decodeURIComponent(this.$route.query.title)
			this.fid = decodeURIComponent(this.$route.query.fid)
			this.participants()
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建

			if (from.path != '/fission/helpRecord') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.title = decodeURIComponent(vm.$route.query.title)
					vm.fid = decodeURIComponent(vm.$route.query.fid)
					vm.page2 = 1
					vm.pageSize2 = 15
					vm.name = ''
					vm.participantsType = '0'
					vm.selectedRowKeys = []
					vm.userKeys = []
					vm.participants()
				});
			}

			next()
		},
		computed: {
			rowSelection () {
				let that = this
				const {selectedRowKeys} = this;
				return {
					selectedRowKeys,
					onChange             : this.onSelectChange,
					hideDefaultSelections: true,
					selections           : [
						{
							key     : "current-data",
							text    : "当前页",
							onSelect: changableRowKeys => {
								let that = this
								this.participantsList.map(item => {
									let index = that.selectedRowKeys.findIndex((id) => id === item.id);
									if (index >= 0) {
										that.selectedRowKeys.splice(index, 1)
									}
								})
								for (let i = 0; i < changableRowKeys.length; i++) {
									that.selectedRowKeys.push(changableRowKeys[i])
								}
							}
						},
						{
							key     : "all-data",
							text    : "选择所有项",
							onSelect: () => {
								that.selectedRowKeys = [...that.userKeys.valueOf()]
							}
						}
					],
				};
			}
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