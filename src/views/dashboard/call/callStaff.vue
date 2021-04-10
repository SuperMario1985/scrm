<template>
	<div class="list">
		<a-layout class="fans-content">
			<a-layout class="scroll">
				<!-- 头部 -->
				<a-layout-header>坐席员工</a-layout-header>
				<a-layout-content>
					<div class="content_table">
						<div class="search_card">
							<div class="search_content">
								<!--								<span>手机号：</span>-->
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

							<div class="search_content" style="width:auto;text-align: left">
								<a-button type="primary" @click="getList()">查找
								</a-button>
								<a-button style="margin:0 0.5rem" @click="clear()">清空</a-button>
							</div>
							<a-button style="position: absolute;right:14px" type="primary" @click="addStaff()">添加员工坐席
							</a-button>
						</div>

						<a-spin tip="Loading..." size="large" :spinning="isLoading">
							<a-table :data-source="recordList" :pagination="false" :rowClassName="rowClassName">
								<a-table-column key="task_type" title="成员/坐席号" data-index="tags">
									<template slot-scope="text,record">
										<div style="display: flex;justify-content: flex-start">
											<div>
												<a-avatar v-if="record.avatar" shape="square" :size="42"
												          :src="record.avatar"/>
												<img style="width: 42px;height: 42px;" v-if="!record.avatar"
												     src="../../../assets/useradvart.png"/>
											</div>
											<div style="margin-left:10px;">
												<span>{{record.user_name+'('+record.department+')'}}</span>
												<a-icon type="man"
												        style="color: #427EBA;margin-left: 0.2rem"
												        v-if="record.gender==1"
												/>
												<a-icon
														type="woman"
														style="color: #ED4997;margin-left: 0.2rem"
														v-if="record.gender==0"
												/>
												<div>
													<a-tag color="orange">
														{{record.exten}}
													</a-tag>
												</div>
											</div>
										</div>
									</template>
								</a-table-column>
								<a-table-column key="task_type2" title="外呼手机号" data-index="tags2">
									<template slot-scope="text,record">
										<span>{{record.small_phone?record.small_phone:'--'}}</span>
									</template>
								</a-table-column>

								<a-table-column key="task_type1" title="话费消耗" data-index="tags">
									<template slot-scope="text,record">
										<span>￥{{record.phone_money?record.phone_money:'--'}}</span>
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
								<a-table-column key="member2" title="状态" data-index="tags">
									<template slot-scope="text,record">
										{{record.status==1?'启用':'禁用'}}
									</template>
								</a-table-column>
								<a-table-column key="action" title="操作" data-index="action">
									<template slot-scope="text,record">
										<a-button style="margin-right: 5px" @click="seatOperation(record,1)"
										          v-if="record.status==1">
											禁用
										</a-button>
										<a-button style="margin-right: 5px" @click="seatOperation(record,2)"
										          v-if="record.status==2">
											启用
										</a-button>
										<a-button style="margin-right: 5px" @click="goDetail(3,record)">外呼明细</a-button>
										<!--										<a-button style="margin-right: 5px" @click="seatOperation(record,3)">坐席转移-->
										<!--										</a-button>-->
									</template>
								</a-table-column>
							</a-table>
						</a-spin>

						<div class="pagination" style="display: flex;justify-content: space-between;margin: 20px 0"
						     v-if="recordList.length>0">
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

		<a-modal
				:title="!isTransform?'添加员工坐席':'坐席转移'"
				:visible="showAddStaffSeat"
				@ok="confirmAddStaffSeat"
				@cancel="handleCancelModal">
			<a-form-model ref="ruleForm2" layout="horizontal" :model="addSeatForm">
				<div style="color:red;margin-left: 0.853rem">
					开通坐席号或需增加坐席号时，请联系渠道经理
				</div>

				<a-form-model-item style="margin: 1rem 0" label="选择坐席号" :label-col="{span: 5}"
				                   :wrapper-col="{span: 13} " prop="name" v-if="!isTransform">
					<a-select
							showSearch allowClear
							placeholder="请选择坐席号"
							optionFilterProp="children"
							@change="changeSeat"
							v-model="addSeatForm.exten">
						<template v-for="(item,index) in seatList">
							<a-select-option :value="item.exten" :key="index">
								{{ item.exten }}
							</a-select-option>
						</template>
					</a-select>
					<div v-if="phoneNum!=''">
						该坐席号对应外呼手机号：{{phoneNum}}
					</div>
				</a-form-model-item>
				<a-form-model-item label="当前成员" :label-col="{span: 5}"
				                   :wrapper-col="{span: 13} " v-if="isTransform">
					<span>{{this.selectedStaff.user_name}}</span>
				</a-form-model-item>
				<a-form-model-item label="坐席成员" :label-col="{span: 5}"
				                   :wrapper-col="{span: 13} ">
					<chooseStaffSelect ref="staffSelected" :callback="replyMsg" :isAll="1"
					                   :ignore_dialout="1"></chooseStaffSelect>
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
		status   : 1
	}
	export default {
		components: {chooseStaffSelect},
		data () {
			return {
				total           : 0,
				listQuery       : Object.assign({}, defaultQuery),
				statusList      : [
					{value: 0, title: '成员状态'}, {value: 1, title: '启用'},
					{value: 2, title: '禁用'},
				],
				isLoading       : false,
				recordList      : [],
				seatList        : [],// 坐席列表
				showAddStaffSeat: false,//添加员工坐席弹窗
				isTransform     : false,
				addSeatForm     : {},//添加员工坐席表单
				phoneNum        : '',
				currentStaff    : '',
				selectedStaff   : {},
			}
		},
		mounted () {
			this.getList()
		},
		methods   : {
			//获取表格内容
			async getList () {
				this.isLoading = true
				const {data: res} = await this.axios.post('dialout/exten-user-list', this.listQuery)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.total = parseInt(res.data.count)
					this.recordList = res.data.list
				}
				this.isLoading = false
			},
			//清空搜索条件
			clear () {
				this.listQuery = Object.assign({}, defaultQuery)
				this.getList()
			},

			//操作
			// 添加员工
			replyMsg (event, id, index, index2) {
				this.addSeatForm.user_id = id
			},
			async addStaff () {
				this.showAddStaffSeat = true
				this.isTransform = false
				const {data: res} = await this.axios.post('dialout/get-usable-exten', {
					corp_id: localStorage.getItem('corpId'),
				})
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.seatList = res.data.list
				}
			},

			//改变坐席号
			changeSeat () {
				let list = JSON.parse(JSON.stringify(this.seatList))
				let index = list.findIndex((item) => item.exten == this.addSeatForm.exten)
				if (index != -1) {
					this.phoneNum = list[index].small_phone
					this.$forceUpdate()
				}
			},
			async confirmAddStaffSeat () {
				if (this.isTransform) {
					this.confirmOperation(this.selectedStaff.id, 3)
					return
				}
				this.addSeatForm.corp_id = localStorage.getItem('corpId')
				const {data: res} = await this.axios.post('dialout/bind-exten', this.addSeatForm)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.getList()
					this.showAddStaffSeat = false
				}
			},
			//禁用
			async seatOperation (record, option_type) {
				let that = this
				this.selectedStaff = record

				const {data: res} = await this.axios.post('dialout/cheak-state', {
					corp_id    : localStorage.getItem('corpId'),
					id         : record.id,
					option_type: option_type
				})
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					if (res.data.state == 1 && option_type == 1) {
						res.data.msg = '禁用后，【' + this.selectedStaff.user_name + '】没有外呼客户的权限，且坐席管理中对应坐席将一同被禁用。确定禁用吗'
					} else if (res.data.state == 2 && option_type == 1) {
						res.data.msg = '【' + res.data.user_name + '】正在通话中，不可禁用'
					} else if (res.data.state == 2 && option_type == 2) {
						res.data.msg = '【' + res.data.user_name + '】正在通话中，不可启用'
					} else if (res.data.state == 2 && option_type == 3) {
						res.data.msg = '【' + res.data.user_name + '】正在通话中，不可转移给其他员工使用'
					}
					this.$confirm({
						title     : res.data.msg,
						okText    : "确定",
						okType    : "primary",
						cancelText: "取消",
						onOk () {
							if (option_type == 3) {
								that.isTransform = true
								that.showAddStaffSeat = true
								// that.$nextTick(() => {
								// 	that.$refs.staffSelected.userId = 3
								// })
								return
							}
							that.confirmOperation(record.id, option_type)
						}
					});

				}
			},
			async confirmOperation (id, option_type) {
				let url
				if (option_type == 1) {
					url = 'forbidden'
				} else if (option_type == 2) {
					url = 'open'
				} else {
					url = 'shift-exten'
				}
				const {data: res} = await this.axios.post('/dialout/' + url, {
					corp_id: localStorage.getItem('corpId'),
					id     : id,
					user_id: this.addSeatForm.user_id
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.showAddStaffSeat = false
					this.getList()
				}
			},

			handleCancelModal () {
				this.addSeatForm = {}
				this.showAddStaffSeat = false
			},

			goDetail (type, record) {
				this.$router.push({
					path : "/call/accountBalance",
					query: {type: type, from: 'callStaff', id: record.id}
				});
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
				this.getList()
			},
			showSizeChange (current, page_size) {
				this.listQuery.page_size = page_size
				this.getList()
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

	.search_card {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 16px;

		.search_content {
			width: 20%;

			.ant-input {
				width: 96%;

			}

			.ant-select {
				width: 90%;
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
		margin-top: 2rem;

		.static_content {
			background-color: #ECECEC;
			width: 12.213rem;
			height: 5.76rem;
			padding: 0.64rem 1.067rem;
			margin-right: 16px;
		}
	}

	.content_table {
		padding: 16px;
		margin: auto;
	}
</style>
