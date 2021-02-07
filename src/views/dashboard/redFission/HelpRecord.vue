<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y: auto;" class="scroll">
		<div style="height: 50px; line-height: 50px;background-color: #FFFFFF;">
			<label style="margin-left: 20px">{{name}}</label>
			<a-button style="float: right;margin: 9px 20px 0;" type="primary" icon="rollback" @click="rollback">返回列表
			</a-button>
		</div>
		<div style="margin: 10px 20px; background-color: #FFFFFF">
			<a-spin tip="Loading..." size="large" :spinning="isLoading2">
				<a-table :columns="columns3" :dataSource="hlepRecordList" :pagination="false"
				         :rowClassName="rowClassName" :rowSelection="rowSelection">
				<span slot="user" slot-scope="text, record">
					<a-avatar v-if="record.avatar" shape="square" :size="42" :src="record.avatar"
					          style="float: left;"/>
							<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
							     src="../../../assets/useradvart.png"/>
							<div class="participant-name">
									{{record.name}}
							</div>
								<a-tag color="orange" v-if="record.status == 0" style="margin: 10px 0 10px 5px;">
        无效
      </a-tag>
								<a-tag color="blue" v-if="record.status == 1" style="margin: 10px 0 10px 5px;">
        有效
      </a-tag>
				</span>
					<span slot="send_status" slot-scope="text, record">
						<a-tooltip>
									<template slot="title">
                                        余额不足，无法发放
                                    </template>
									<span v-if="record.send_status == 0">未发放</span>
								</a-tooltip>
						<span v-if="record.send_status == 1">已发放</span>
					</span>
					<span slot="action" slot-scope="text, record">
						<a-popconfirm
								@confirm="manualRelease(record.id)"
								okText="确定"
								cancelText="取消"
						>
									<template slot="title">
                                        <div>确定发放给该客户吗？</div>
                                    </template>
							<a-button
									style="margin: 0 5px 5px 0" v-if="record.status == 1 && record.send_status == 0">手动发放</a-button>
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
									style="margin: 0 5px 5px 0" v-if="record.status == 1 && record.send_status == 0">标记发放</a-button>
								</a-popconfirm>
						<template v-if="record.status != 1 || record.send_status != 0">--</template>
										</span>
				</a-table>
				<div style="margin: 20px 20px 0;padding-bottom: 20px;" v-show="total3 > 0 && userKeys.length > 0">
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
				<!-- 分页 -->
				<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
				     v-show="total3 > 0">
					<div style="height: 32px;float: left;line-height: 32px;">
						共
						<span style="color: blue">{{total3}}</span>条
					</div>
					<div class="pagination" style="height: 32px;float: right;">
						<a-pagination :total="total3" showSizeChanger :showQuickJumper="quickJumper3"
						              :current="page3"
						              :pageSize="pageSize3" :pageSizeOptions="['15','30','50','100']"
						              @change="changePage3"
						              @showSizeChange="showSizeChange3"/>
					</div>
				</div>
			</a-spin>
		</div>
	</div>
</template>

<script>
	const columns3 = [
		{
			title      : "好友拆领",
			dataIndex  : "user",
			key        : "user",
			scopedSlots: {customRender: "user"}
		},
		{
			title    : "获得红包（元）",
			dataIndex: "amount",
			key      : "amount",
		},
		{
			title    : "拆领时间",
			dataIndex: "help_time",
			key      : "help_time",
		},
		{
			title      : "好友发放状态",
			dataIndex  : "send_status",
			key        : "send_status",
			scopedSlots: {customRender: "send_status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		},
	]
	export default {
		name    : "HelpRecord",
		data () {
			return {
				columns3,
				name             : '',
				jid              : 0, // 参与者id
				isLoading2       : false,  // 助力记录列表加载
				hlepRecordVisible: false, // 助力记录弹窗是否显示
				hlepRecordList   : [],  // 助力记录列表
				total3           : 0,
				page3            : 1,
				pageSize3        : 15,
				quickJumper3     : false,
				is_end           : 0,//活动是否结束，0未结束，1已结束
				selectedRowKeys  : [], // 多选id
				userKeys         : [], // 所有id
				batchType        : '1',     // 0当前页 1所有
				batchTypeValue   : false, // 当前页/所有 是否选中
				checkArr         : [],//选择当前页/所有，保存的key
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
			// 助力记录
			async helpRecord (page = 1, pageSize = this.pageSize3) {
				this.isLoading2 = true
				const {data: res} = await this.axios.post("red-pack/help-list", {
					uid     : localStorage.getItem("uid"),
					jid     : this.jid,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading2 = false;
					this.$message.error(res.error_msg);
				} else {
					this.hlepRecordList = res.data.helpList
					this.page3 = page
					this.pageSize3 = pageSize
					this.total3 = parseInt(res.data.count)
					this.isLoading2 = false

					this.is_end = res.data.is_end
					this.userKeys = res.data.keys

					let arr = this.selectedRowKeys
					this.checkArr = []
					this.hlepRecordList.map(x => {
						if (x.send_status == 0) {
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
			changePage3 (page, pageSize) {
				this.helpRecord(page, this.pageSize3)
				document.getElementsByClassName('scroll')[0].scrollTo(0,0)
			},
			showSizeChange3 (page, pageSize) {
				this.helpRecord(1, pageSize)
			},
			//手动发放
			async manualRelease (hid) {
				const {data: res} = await this.axios.post("red-pack/help-hand-send", {
					uid: localStorage.getItem("uid"),
					jid: this.jid,
					hid: hid
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success(res.data.textHtml);
					this.helpRecord()
				}
			},
			//标记发放
			async signRelease (hid) {
				const {data: res} = await this.axios.post("red-pack/help-status", {
					uid: localStorage.getItem("uid"),
					hid: hid
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('已成功标记发放');
					this.helpRecord()
				}
			},
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
				if (this.batchType == '0') {
					this.batchTypeValue = this.checkArr.every(val => selectedRowKeys.includes(val))
				} else if (this.batchType == '1') {
					this.batchTypeValue = selectedRowKeys.sort().toString() == this.userKeys.sort().toString()
				}
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					if (this.batchType == '0') {
						this.hlepRecordList.map(x => {
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
							this.hlepRecordList.map(x => {
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
			//批量零钱限额
			bulkChangeLimit (user_ids) {
				this.manualRelease(user_ids)
			},
		},
		created () {
			this.name = this.$route.query.name
			this.jid = this.$route.query.jid
			this.helpRecord()
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
							disabled: record.send_status != 0 || record.status != 1,
						},
					}),
				};
			}
		},
	}
</script>

<style scoped>
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