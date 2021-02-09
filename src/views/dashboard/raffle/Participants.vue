<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
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
			<div style="margin-bottom: 10px;">
				<span @click="changeTab('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}"
				      v-has="'record-list'">获奖名单</span>
				<span @click="changeTab('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}"
				      v-has="'player-list'">玩家列表</span>
			</div>
			<div v-show="tabKey == 1" v-has="'record-list'">
				<a-input-search placeholder="请输入关键字" @search="onSearch" v-model="nick_name" enterButton="搜索"
				                style="width: 270px;"/>
				<div style="margin-bottom: 16px;float: right;">
					<a-popconfirm
							@confirm="start('')"
							okText="确定"
							cancelText="取消"
					>
						<template slot="title">
							<div>确定核销吗？</div>
						</template>
						<a-button type="primary" :disabled="!hasSelected" :loading="loading"
						          v-has="'record-destroy'">
							核销/领取
						</a-button>
					</a-popconfirm>
				</div>
				<div class="content-bd">
					<a-spin tip="加载中..." size="large" :spinning="isLoading">
						<a-table
								:rowSelection="rowSelection"
								:columns="columns1"
								:dataSource="participantsList" :rowClassName="rowClassName" :pagination="false"
						>
						<span slot="avatar" slot-scope="text, record">
							<a-avatar shape="square" :size="42" :src="text"/>
						</span>
							<span slot="status" slot-scope="text, record">
							<span v-if="text == 0">
								<span v-if="record.prize_type == 0">未核销</span>
								<span v-if="record.prize_type == 1">未领取</span>
							</span>
							<span v-if="text == 1">
								<span v-if="record.prize_type == 0">已核销</span>
								<span v-if="record.prize_type == 1">已领取</span>
							</span>
						</span>
							<span slot="action" slot-scope="text, record">
								<a-popconfirm
										@confirm="start(record.id)"
										okText="确定"
										cancelText="取消"
								>
									<template slot="title">
                                        <div v-if="record.prize_type == 0">确定核销吗？</div>
                                        <div v-if="record.prize_type == 1">确定发放吗？</div>
                                    </template>
							<a-button
									style="margin: 0 5px 5px 0" v-if="record.status == 0"
									v-has="'record-destroy'">
								<span v-if="record.prize_type == 0">核销</span>
								<span v-if="record.prize_type == 1">发放</span>
							</a-button>
								</a-popconfirm>
								<span v-if="record.status != 0">--</span>
						</span>
						</a-table>
						<!-- 分页 -->
						<div class="pagination" style="width: 100%;position: absolute;margin: 40px 0px 20px;"
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
			</div>
			<div v-show="tabKey == 2" v-has="'player-list'">
				<a-input-search placeholder="请输入关键字" @search="onSearch" v-model="nick_name2" enterButton="搜索"
				                style="width: 270px;margin-bottom: 16px;"/>
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<a-table :columns="columns2" :dataSource="participantsList2" :pagination="false"
					         :rowClassName="rowClassName">
							<span slot="nick_name" slot-scope="text, record">
								<a-avatar shape="square" :size="42" :src="record.avatar" style="margin-right: 5px;"/>
								{{record.nick_name}}
							</span>
						<span slot="has_num" slot-scope="text, record">
								{{record.has_num}}次 / {{record.total_num}}次
							</span>
						<span slot="action" slot-scope="text, record">
								<a-button @click="lookDraw(record.award_id,record.key,record.nick_name)"
								          style="margin: 0 5px 5px 0">查看抽奖</a-button>
								<a-button @click="lookHelp(record.key,record.nick_name)" style="margin: 0 5px 5px 0">查看助力</a-button>
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
	// 获奖名单列表
	const columns1 = [
		{
			title    : "昵称",
			dataIndex: "nick_name",
			key      : "nick_name",
			width    : "200px",
		},
		{
			title      : "头像",
			dataIndex  : "avatar",
			key        : "avatar",
			scopedSlots: {customRender: "avatar"}
		},
		{
			title    : "奖品",
			dataIndex: "award_name",
			key      : "award_name"
		},
		{
			title    : "参与时间",
			dataIndex: "create_time",
			key      : "create_time",
		},
		{
			title      : "领取状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}//0、未核销1、已核销
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '15%',
			scopedSlots: {customRender: "action"}
		}
	];
	// 玩家列表
	const columns2 = [
		{
			title      : "参与人信息（头像+昵称）",
			dataIndex  : "nick_name",
			key        : "nick_name",
			scopedSlots: {customRender: "nick_name"}
		},
		{
			title      : "已中奖/当前总抽奖次数",
			dataIndex  : "has_num",
			key        : "has_num",
			scopedSlots: {customRender: "has_num"}
		},
		{
			title    : "最后一次抽奖时间",
			dataIndex: "last_time",
			key      : "last_time"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		},
	];
	export default {
		name    : "raffleParticipants",
		data () {
			let tabKey = localStorage.getItem('permissionButton') && localStorage.getItem('permissionButton').indexOf('record-list') > 0 ? this.$store.state.raffleParticipantsTabKey : '2'
			return {
				isLoading        : false,//loading组件的显示与隐藏
				fid              : '',//活动id
				title            : '',//进入的抽奖名称
				tabKey           : tabKey,//tab栏，1获奖名单，2玩家列表
				//表格
				columns1,
				columns2,
				//获奖名单
				participantsList : [],//获奖名单列表
				nick_name        : '',//搜索框输入的关键字
				selectedRowKeys  : [], // 多选id
				userKeys         : [], // 所有id
				loading          : false,
				//分页
				total            : 0, //总条数
				quickJumper      : false, // 是否显示快速跳转的控件
				page             : 1, //页码
				pageSize         : 15, //每页数据条数
				//玩家列表
				participantsList2: [],//玩家列表
				nick_name2       : '',//搜索框输入的关键字
				//分页
				total2           : 0, //总条数
				quickJumper2     : false, // 是否显示快速跳转的控件
				page2            : 1, //页码
				pageSize2        : 15, //每页数据条数

				is_record: 1,//1获奖列表，0玩家列表
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
			rollback () {
				this.$router.go(-1)
			},
			//获取获奖名单列表
			async participants (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("awards-activity/records", {
					uid      : localStorage.getItem('uid'),
					award_id : this.fid,
					page     : page,
					pageSize : pageSize,
					is_record: this.is_record,
					nick_name: this.nick_name
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.participantsList = res.data.info
					this.userKeys = res.data.keys
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			//获取玩家列表
			async participants2 (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("awards-activity/awards-join", {
					id       : this.fid,
					page     : page,
					pageSize : pageSize,
					nick_name: this.nick_name2
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.participantsList2 = res.data.info
					this.isLoading = false;
					this.total2 = parseInt(res.data.count);
					this.page2 = page;
					this.pageSize2 = pageSize;
					this.quickJumper2 = this.total2 > this.pageSize2;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.participants(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.participants(1, pageSize);
			},
			// 分页
			changePage2 (page, pageSize) {
				this.participants2(page, pageSize);
			},
			showSizeChange2 (page, pageSize) {
				this.participants2(1, pageSize);
			},
			//切换tab
			changeTab (key) {
				this.tabKey = key
				if (key == 1) {
					this.is_record = 1
					this.nick_name = ''
					this.participants()
				} else if (key == 2) {
					this.is_record = 0
					this.nick_name2 = ''
					this.participants2()
				}
				this.$store.commit('changeRaffleParticipantsTabKey', key);
			},
			//搜索
			onSearch (val) {
				if (this.tabKey == 1) {
					this.participants()
				} else if (this.tabKey == 2) {
					this.participants2()
				}
			},
			async start (id) {
				let participantsId = []
				if (id == '' || id == null) {
					participantsId = this.selectedRowKeys
				} else {
					participantsId = id
				}
				const {data: res} = await this.axios.post("awards-activity/update-status", {
					id      : participantsId,
					award_id: this.fid,
				});
				if (res.error != 0) {
					this.loading = false;
					this.$message.error(res.error_msg);
				} else {
					this.$message.success(res.data.textHtml)
					this.loading = false;
					this.selectedRowKeys = [];
					this.participants()
				}
			},
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys;
			},
			//查看抽奖
			lookDraw (award_id, join_id, title) {
				this.$router.push("/raffle/drawDetail?award_id=" + award_id + "&join_id=" + join_id + "&title=" + title)
			},
			//查看助力
			lookHelp (join_id, title) {
				this.$router.push("/raffle/helpDetail?join_id=" + join_id + "&title=" + title)
			},
		},
		mounted () {
			this.title = decodeURIComponent(this.$route.query.title)
			this.fid = decodeURIComponent(this.$route.query.fid)
			if (this.tabKey == 1) {
				this.participants()
			} else if (this.tabKey == 2) {
				this.participants2()
			}
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path != '/raffle/drawDetail' && from.path != '/raffle/helpDetail') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.title = decodeURIComponent(vm.$route.query.title)
					vm.fid = decodeURIComponent(vm.$route.query.fid)
					vm.nick_name = ''
					vm.nick_name2 = ''
					vm.page = 1;
					vm.pageSize = 15;
					vm.tabKey = localStorage.getItem('permissionButton') && localStorage.getItem('permissionButton').indexOf('record-list') > 0 ? vm.$store.state.raffleParticipantsTabKey : '2'
					if (vm.tabKey == 1) {
						vm.participants()
					} else if (vm.tabKey == 2) {
						vm.participants2()
					}
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
					getCheckboxProps     : record => ({
						props: {
							disabled: record.status == 1,
						},
					}),
				};
			},

			hasSelected () {
				return this.selectedRowKeys.length > 0;
			},
		},
	}
</script>

<style lang="less" scoped>
	.participants {
		margin: 10px 20px;
		background-color: #FFFFFF;
		padding: 20px;
	}

	/deep/ .ant-tabs-bar {
		background: #FFF;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		min-width: 885px;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 60px;
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
	}

	.activeBtn {
		color: #01b065;
		background: #FFF;
	}
</style>