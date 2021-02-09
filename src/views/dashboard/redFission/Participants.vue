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
		<div style="margin: 10px 0px;padding: 10px 20px 0 20px;">
			<a-input placeholder="搜索参与者名称" @keyup.enter="searchFans" v-model="name" style="width: 180px;" allowClear/>
			<a-select v-model="sendStatus" style="width: 120px;margin-left: 10px;" placeholder="发送状态">
				<a-select-option value="0">未发放</a-select-option>
				<a-select-option value="1">已发放</a-select-option>
			</a-select>
			<a-button style="margin-left: 10px;" @click="searchFans" type="primary">搜索</a-button>
			<a-button style="margin-left: 10px;" @click="reloadParticipants">重置</a-button>
		</div>
		<div class="participants">
			<div style="padding: 0 20px 20px;">
				<a-spin tip="加载中..." size="large" :spinning="isLoading1">
					<a-table :columns="columns1" :dataSource="participantsList"
					         :pagination="false"
					         :rowClassName="rowClassName"
					         :rowSelection="rowSelection">
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
							{{record.help_num}}/{{record.friend_amount}}<span v-if="record.status != 2">（还差{{record.invite_amount-record.help_num}}人成功）</span>
							</span>
						<span slot="first_amount" slot-scope="text, record">
								{{record.first_amount}}元（
							<a-tooltip>
                                <template slot="title">
                                    余额不足，无法发放
                                </template>
								<span v-if="record.first_send_status == 0">未发放</span>
							</a-tooltip>
								<span v-if="record.first_send_status == 1">已发放</span>
							）
							</span>
						<span slot="send_status" slot-scope="text, record">
								<a-tooltip>
									<template slot="title">
									<template v-if="is_end == 0 && record.status == 2 && send_type == 1">
                                        余额不足，无法发放
                                    </template>
									<template v-if="is_end == 0 && record.status == 2 && send_type == 2">
                                        等活动结束后，再发放
                                    </template>
									<template v-if="is_end == 0 && record.status == 0">
                                        尚在裂变中
                                    </template>
									<template v-if="is_end == 1 && record.status == 2">
                                        余额不足，无法发放
                                    </template>
									<template v-if="is_end == 1 && record.status == 0">
                                        --
                                    </template>
										</template>
									<span v-if="record.send_status == 0">未发放</span>
								</a-tooltip>
								<span v-if="record.send_status == 1">已发放</span>
							</span>
						<span slot="action" slot-scope="text, record">
											<a-button @click="helpRecord(record.id, record.name)"
											          style="margin: 0 5px 5px 0">助力记录</a-button>
							<a-popconfirm
									@confirm="manualRelease(record.id)"
									okText="确定"
									cancelText="取消"
							>
									<template slot="title">
                                        <div>确定发放给该客户吗？</div>
                                    </template>
							<a-button
									style="margin: 0 5px 5px 0"
									v-if="record.first_send_status == 0 || (record.send_status == 0 && record.status == 2 && !(send_type == 2 && is_end == 0))">手动发放</a-button>
								</a-popconfirm>
							<a-popconfirm
									@confirm="signRelease(record.id)"
									okText="确定"
									cancelText="取消"
							>
									<template slot="title">
                                        <div>确定发放给该客户吗？</div>
                                    </template>
							<a-button
									style="margin: 0 5px 5px 0"
									v-if="record.first_send_status == 0 || (record.send_status == 0 && record.status == 2 && !(send_type == 2 && is_end == 0))">标记发放</a-button>
								</a-popconfirm>
										</span>
					</a-table>
					<div style="margin: 20px;" v-show="total2 > 0 && userKeys.length > 0">
						<a-checkbox v-model="batchTypeValue"
						            @click="batchTypeChange"></a-checkbox>
						<a-select optionFilterProp="children" v-model="batchType"
						          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
							<a-select-option value="0">选择当前页</a-select-option>
							<a-select-option value="1">选择所有</a-select-option>
						</a-select>
						<a-popconfirm
								@confirm="bulkChangeLimit(selectedRowKeys)"
								okText="确定"
								cancelText="取消"
								:disabled="this.selectedRowKeys.length > 0 ? false : true"
						>
							<template slot="title">
								<div>确定批量手动发放吗？</div>
							</template>
							<a-button type="primary"
							          :disabled="this.selectedRowKeys.length > 0 ? false : true">批量手动发放
							</a-button>
						</a-popconfirm>
					</div>
					<!--分页-->
					<div class="pagination" style="width: 100%;position: absolute;margin: 40px 0px 20px;"
					     v-show="total2 > 0" v-has="'employee-list'">
						<div style="height: 32px;float: left;line-height: 32px;">
							共
							<span style="color: blue">{{total2}}</span>条
						</div>
						<div class="pagination" style="height: 32px;float: right;">
							<a-pagination :total="total2" showSizeChanger :showQuickJumper="quickJumper2"
							              :current="page2"
							              :pageSize="pageSize2"
							              :pageSizeOptions="['15','30','50','100']"
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
			title      : "已拆红包人数/金额（元）",
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
			title      : "首拆",
			dataIndex  : "first_amount",
			key        : "first_amount",
			scopedSlots: {customRender: "first_amount"}
		},
		{
			title      : "完成时间",
			dataIndex  : "complete_time",
			key        : "complete_time",
			scopedSlots: {customRender: "complete_time"}
		},
		{
			title      : "剩余发放状态",
			dataIndex  : "send_status",
			key        : "send_status",
			scopedSlots: {customRender: "send_status"}
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
		name    : "redFissionParticipants",
		data () {
			return {
				title           : '',
				columns1,
				name            : '', // 名称
				isLoading1      : false,
				participantsList: [], // 参与者列表
				fid             : '', // 活动id
				total2          : 0,
				page2           : 1,
				pageSize2       : 15,
				quickJumper2    : false,
				selectedRowKeys : [], // 多选id
				userKeys        : [], // 所有id
				batchType       : '1',     // 0当前页 1所有
				batchTypeValue  : false, // 当前页/所有 是否选中
				checkArr        : [],//选择当前页/所有，保存的key
				sendStatus      : [],//发送状态
				is_end          : 0,//活动是否结束，0未结束，1已结束
				send_type       : 1,//发放红包类型：1、活动时间内自动发送，2、活动结束后自动发放
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
			// 刷新
			reloadParticipants () {
				this.name = ''
				this.sendStatus = []
				this.participants(1, 15)
			},
			// 参与者
			async participants (page = 1, pageSize = this.pageSize2) {
				this.isLoading1 = true
				let sendStatus = -1
				if (typeof this.sendStatus == 'object' && this.sendStatus.length == 0) {
					sendStatus = -1
				} else {
					sendStatus = this.sendStatus
				}
				const {data: res} = await this.axios.post("red-pack/join-list", {
					uid        : localStorage.getItem("uid"),
					rid        : this.fid,
					name       : this.name,
					send_status: sendStatus,
					page       : page,
					pageSize   : pageSize
				});
				if (res.error != 0) {
					this.isLoading1 = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading1 = false
					this.page2 = page
					this.pageSize2 = pageSize
					this.total2 = parseInt(res.data.count)
					this.participantsList = res.data.join
					this.is_end = res.data.is_end
					this.userKeys = res.data.keys
					this.send_type = res.data.send_type

					let arr = this.selectedRowKeys
					this.checkArr = []
					this.participantsList.map(x => {
						if (x.send_status == 0 && x.status == 2) {
							this.checkArr.push(x.key)
						}
					})
					//判断换页的时候，是否处于全选状态，底部的全选是否勾选上
					if (this.batchType == '0') {
						if (this.checkArr.length > 0) {
							this.batchTypeValue = this.checkArr.every(val => arr.includes(val))
						} else {
							this.batchTypeDisabled = true
						}
					} else if (this.batchType == '1') {
						if (this.userKeys.length > 0) {
							this.batchTypeValue = arr.sort().toString() == this.userKeys.sort().toString()
						} else {
							this.batchTypeDisabled = true
						}
					}
				}

			},
			// 参与者切换分页
			changePage2 (page, pageSize) {
				this.participants(page, this.pageSize2)
				document.getElementsByClassName('scroll')[0].scrollTo(0,0)
			},
			showSizeChange2 (page, pageSize) {
				this.participants(this.page2, pageSize)
			},
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
				if (this.batchType == '0') {
					this.batchTypeValue = this.checkArr.every(val => selectedRowKeys.includes(val))
				} else if (this.batchType == '1') {
					this.batchTypeValue = selectedRowKeys.sort().toString() == this.userKeys.sort().toString()
				}
			},
			helpRecord (jid, name) {
				this.$router.push('/redFission/helpRecord?jid=' + jid + '&name=' + name)
			},
			//手动发放
			async manualRelease (jid) {
				const {data: res} = await this.axios.post("red-pack/join-hand-send", {
					uid: localStorage.getItem("uid"),
					rid: this.fid,
					jid: jid
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (res.data.success == 0) {
						this.$message.error(res.data.textHtml);
					} else {
						this.$message.success(res.data.textHtml);
					}
					this.selectedRowKeys = []
					this.participants()
				}
			},
			//标记发放
			async signRelease (jid) {
				const {data: res} = await this.axios.post("red-pack/join-status", {
					uid: localStorage.getItem("uid"),
					jid: jid
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('已成功标记发放');
					this.selectedRowKeys = []
					this.participants()
				}
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					if (this.batchType == '0') {
						this.participantsList.map(x => {
							if (x.send_status == 0 && x.status == 2) {
								this.selectedRowKeys.push(x.key)
							}
						})
						this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
					} else if (this.batchType == '1') {
						this.selectedRowKeys = this.userKeys
					}
				} else {
					this.selectedRowKeys = []
				}
			},
			// 当前/所有 类型选择框变化
			changeBatchType () {
				// this.batchTypeValue = false
				if (!this.batchTypeDisabled) {
					if (this.batchTypeValue) {
						if (this.batchType == '0') {
							this.selectedRowKeys = []
							this.participantsList.map(x => {
								if (x.send_status == 0 && x.status == 2) {
									this.selectedRowKeys.push(x.key)
								}
							})
							this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
						} else if (this.batchType == '1') {
							this.selectedRowKeys = [...this.userKeys.valueOf()]
						}
					} else {
						if (this.batchType == '0') {
							this.batchTypeValue = this.checkArr.every(val => this.selectedRowKeys.includes(val))
						} else if (this.batchType == '1') {
							this.batchTypeValue = this.selectedRowKeys.sort().toString() == this.userKeys.sort().toString()
						}
					}
				}
			},
			//批量手动发放
			bulkChangeLimit (user_ids) {
				this.manualRelease(user_ids)
			},
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

			if (from.path != '/redFission/helpRecord') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.title = decodeURIComponent(vm.$route.query.title)
					vm.fid = decodeURIComponent(vm.$route.query.fid)
					vm.page2 = 1
					vm.pageSize2 = 15
					vm.name = ''
					vm.selectedRowKeys = []
					vm.userKeys = []
					vm.batchType = '1'
					vm.batchTypeValue = false
					vm.participants()
				});
			}

			next()
		},
		computed: {
			rowSelection () {
				const {selectedRowKeys} = this;
				return {
					selectedRowKeys,
					onChange             : this.onSelectChange,
					hideDefaultSelections: true,
					getCheckboxProps     : record => ({
						props: {
							disabled: record.first_send_status == 0 || (record.send_status == 0 && record.status == 2 && !(this.send_type == 2 && this.is_end == 0)) ? false : true
						},
					}),
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

	/deep/ .ant-table-thead > tr > th:first-child .ant-table-header-column {
		display: none;
	}
</style>