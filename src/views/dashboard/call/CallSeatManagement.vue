<template>
	<div class="list">
		<a-layout class="fans-content">
			<a-layout class="scroll">
				<!-- 头部 -->
				<a-layout-header>坐席管理</a-layout-header>

				<a-layout-content>
					<div class="header">
						<div class="static">
							<div class="static_content">
								<div style="font-size:14px">账户余额</div>
								<div style="font-size:18px;font-weight: 700">￥{{staticData.balance}}</div>
								<div style="color:#3291F8;cursor: pointer;text-align: right" @click="goDetail(1)">账户明细
								</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">坐席总数</div>
								<div style="font-size:18px;font-weight: 700">{{staticData.exten_total}}</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">使用中的坐席</div>
								<div style="font-size:18px;font-weight: 700">{{staticData.exten_used}}</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">剩余坐席</div>
								<div style="font-size:18px;font-weight: 700">{{staticData.exten_usable}}</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">已过期的坐席</div>
								<div style="font-size:18px;font-weight: 700">{{staticData.exten_expired}}</div>
							</div>
						</div>

						<div class="search_card">
							<div class="search_content">
								<a-input @keyup.enter="getList" placeholder="请输入成员名称或手机号进行查找"
								         v-model.trim="listQuery.keyword"></a-input>
							</div>

							<div class="search_content" style="width: 10%">
								<!--								<span>状态：</span>-->
								<a-select
										showSearch allowClear
										placeholder="请选择状态"
										optionFilterProp="children"
										v-model="listQuery.status">
									<template v-for="item in statusList">
										<a-select-option :value="item.value">
											{{ item.title }}
										</a-select-option>
									</template>
								</a-select>
							</div>

							<div class="search_content">
								<!--								<span>时间筛选：</span>-->
								<a-range-picker v-model="time" style="width: 97%;padding: 0"
								                @change="handleTimeChange"/>
							</div>


							<div class="search_content" style="width:auto;text-align: left">
								<a-button type="primary" @click="getList()">查找
								</a-button>
								<a-button style="margin:0 0.5rem" @click="clear()">清空</a-button>
							</div>

						</div>
					</div>


					<div class="content_table">
						<a-spin tip="Loading..." size="large" :spinning="listLoading">
							<a-table :data-source="seatList" :pagination="false" :rowClassName="rowClassName">
								<a-table-column key="exten" title="工号" data-index="exten">
									<template slot-scope="text,record">
										<span>{{record.exten}}</span>
									</template>
								</a-table-column>
								<a-table-column key="small_phone" title="外呼手机号" data-index="small_phone">
									<template slot-scope="text,record">
										<span>{{record.small_phone}}</span>
									</template>
								</a-table-column>
								<a-table-column key="use_num" title="历史使用人数" data-index="use_num">
									<template slot-scope="text,record">
										<span>{{record.use_num}}</span>
									</template>
								</a-table-column>
								<a-table-column key="user_name" title="当前使用成员" data-index="user_name">
									<template slot-scope="text,record">
										<a-tag color="orange" v-if="record.user_name">
											{{record.user_name}}
										</a-tag>
										<span v-if="!record.user_name">--</span>
									</template>
								</a-table-column>
								<a-table-column key="exten_money" title="坐席费用" data-index="exten_money">
									<template slot-scope="text,record">
										<span>￥{{record.exten_money}}</span>
									</template>
								</a-table-column>
								<a-table-column key="phone_money" title="话费消耗" data-index="phone_money">
									<template slot-scope="text,record">
										<span>￥{{record.phone_money}}</span>
									</template>
								</a-table-column>
								<a-table-column key="duration_turth" title="实际通话时长" data-index="duration_turth">
									<template slot-scope="text,record">
										<span>{{record.duration_turth?record.duration_turth:'--'}}</span>
									</template>
								</a-table-column>
								<a-table-column key="duration" data-index="duration">
									<span slot="title">计费通话时长
											<a-tooltip placement="bottom">
						                    <template slot="title">
							                     <span>根据运营商要求，通话不满一分钟按一分钟计算。</span>
							                    </template>
							                    <a-icon type="question-circle" style="margin-left:5px;"/>
											</a-tooltip>
									</span>
									<template slot-scope="text,record">
										<span>{{record.duration?record.duration:'--'}}</span>
									</template>
								</a-table-column>
								<a-table-column key="status" data-index="status">
										<span slot="title">状态
											<a-tooltip placement="bottom">
						                    <template slot="title">
							                     <div>停用：当前坐席的使用成员被禁用。</div>
							                     <div>使用中：当前坐席正常使用。</div>
							                    <div>已过期：当前当前坐席已过期。</div>
							                    <div>未分配：当前坐席没有成员使用。</div>
						                    </template>
							                <a-icon type="question-circle" style="margin-left:5px;"/>
											</a-tooltip>
									</span>
									<template slot-scope="text,record">
										<span v-if="record.status==1">停用</span>
										<span v-if="record.status==2">使用中</span>
										<span v-if="record.status==3">已过期</span>
										<span v-if="record.status==4">未分配</span>
									</template>
								</a-table-column>
								<a-table-column key="expire" title="到期时间" data-index="expire">
									<template slot-scope="text,record">
										<span>{{record.start_time+' 至 '+record.expire}}</span>
									</template>
								</a-table-column>
								<a-table-column key="action" title="操作" data-index="action">
									<template slot-scope="text,record">
										<a-button @click="goDetail(2,record)">坐席明细</a-button>
										<a-button style="margin-left: 5px" @click="seatOperation(record)">更换坐席成员
										</a-button>
									</template>
								</a-table-column>
							</a-table>
						</a-spin>
						<div class="pagination" style="display: flex;justify-content: space-between;margin: 20px 0"
						     v-if="seatList.length>0">
							<div style="height: 32px;line-height: 32px;">
								共<span style="color: blue">{{ total }}</span>条
							</div>
							<div style="height: 32px;">
								<a-pagination :total="total" showSizeChanger :showQuickJumper="false"
								              v-model="listQuery.page"
								              :current="1"
								              :pageSize="listQuery.page_size"
								              :pageSizeOptions="['15','30','50','100']"
								              @change="changePage"
								              @showSizeChange="showSizeChange"/>
							</div>
						</div>
					</div>
				</a-layout-content>
			</a-layout>
		</a-layout>

		<a-modal title="坐席转移"
		         :visible="showAddStaffSeat"
		         @ok="confirmSeatOperation"
		         @cancel="handleCancelModal"
		>
			<a-form-model ref="ruleForm2" layout="horizontal" :model="addSeatForm">
				<a-form-model-item label="工号" :label-col="{span: 5}"
				                   :wrapper-col="{span: 13} ">
					<span>{{addSeatForm.exten}}</span>
				</a-form-model-item>
				<a-form-model-item label="当前成员" :label-col="{span: 5}"
				                   :wrapper-col="{span: 13} ">
					<span>{{addSeatForm.using_name?addSeatForm.using_name:'--'}}</span>
				</a-form-model-item>
				<a-form-model-item label="坐席成员" :label-col="{span: 5}"
				                   :wrapper-col="{span: 13} ">
					<chooseStaffSelect ref="staffSelected" :callback="replyMsg" :isAll="1"
					                   :ignore_dialout="1"></chooseStaffSelect>
				</a-form-model-item>
				<a-form-model-item label="" :label-col="{span: 6}"
				                   :wrapper-col="{span: 13} " v-if="addSeatForm.using_name">
					<span style="color: red;margin-left: 1.6rem;">转移后原使用成员将无法正常使用</span>
				</a-form-model-item>
			</a-form-model>
		</a-modal>


	</div>
</template>

<script>
	import chooseStaffSelect from "@/components/ChooseStaffSelect"

	const defaultQuery = {
		page     : 1,
		page_size: 15,
		corp_id  : localStorage.getItem('corpId'),
		status   : 0
	}
	export default {
		components: {chooseStaffSelect},
		data () {
			return {
				total           : 0,
				listQuery       : Object.assign({}, defaultQuery),
				statusList      : [
					{value: 0, title: '坐席状态'}, {value: 1, title: '停用'},
					{value: 2, title: '使用中'}, {value: 3, title: '已过期'},
					{value: 4, title: '未分配'},
				],
				listLoading     : false,
				recordList      : [1],
				staticData      : {},
				seatList        : [],
				time            : [],
				showAddStaffSeat: false,
				selectedStaff   : {},
				addSeatForm     : {},
				message         : ''
			}
		},
		mounted () {
			this.getList()
			this.getStatic()
		},
		methods   : {
			async getList () {
				this.listLoading = true
				const {data: res} = await this.axios.post('/dialout/exten-list', this.listQuery)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.total = parseInt(res.data.count)
					this.seatList = res.data.list
				}
				this.listLoading = false
			},
			async getStatic () {
				const {data: res} = await this.axios.post('/dialout/exten-summary', {
					corp_id: localStorage.getItem('corpId'),
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.staticData = res.data
				}
			},
			handleTimeChange (date, dateString) {
				this.listQuery.stime = dateString[0]
				this.listQuery.etime = dateString[1]
			},
			clear () {
				this.listQuery = Object.assign({}, defaultQuery)
				this.getList()
			},
			async seatOperation (record) {
				this.selectedStaff = record
				const {data: res} = await this.axios.post('dialout/cheak-state', {
					corp_id    : localStorage.getItem('corpId'),
					id         : record.id,
					option_type: 3
				})
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.addSeatForm = res.data
					this.showAddStaffSeat = true
				}
			},
			handleCancelModal () {
				this.showAddStaffSeat = false
				this.$refs.staffSelected.userId = []
			},
			async confirmSeatOperation () {
				const {data: res} = await this.axios.post('dialout/shift-exten', {
					corp_id: localStorage.getItem('corpId'),
					id     : this.selectedStaff.id,
					user_id: this.addSeatForm.user_id
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.showAddStaffSeat = false
					this.$refs.staffSelected.userId = []
					this.getList()

				}
			},

			goDetail (type, record) {
				let query = {}
				if (type == 2) {
					query = {
						type: type,
						id  : record.id, from: 'callSeatManagement'
					}
				} else {
					query = {
						type: type, from: 'callSeatManagement'
					}
				}
				this.$router.push({
					path: "/call/accountBalance", query: query
				});
			},
			replyMsg (event, id, index, index2) {
				console.log(id)
				this.addSeatForm.user_id = id
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 分页
			changePage () {
			},
			showSizeChange (current, page_size) {
				this.listQuery.page_size = page_size
			},

		},

	}
</script>

<style scoped lang="less">
	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.list {
		overflow-y: hidden;
	}

	.fans-content {
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}

	.ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
		font-size: 16px;
		padding: 0 20px;
	}

	.header {
		width: 98%;
		background-color: #FFF;
		padding: 24px;
		margin: 1rem auto;

	}

	.search_card {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 1rem;

		.search_content {
			width: 20%;

			.ant-input {
				width: 97%;

			}

			.ant-select {
				width: 94%;
			}

			.ant-radio-button-wrapper {
				width: 4rem;
				text-align: center;
			}
		}
	}

	.static {
		display: flex;
		justify-content: flex-start;
		align-items: center;

		.static_content {
			background-color: #F8F8F8;
			width: 24%;
			height: 6.76rem;
			padding: 0.64rem 1.067rem;
			margin-right: 16px;
			line-height: 31px;
		}
	}

	.content_table {
		padding: 16px;
		margin: 1rem auto;
	}
</style>
