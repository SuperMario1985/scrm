<template>
	<div class="list">
		<a-layout class="fans-content">
			<a-layout class="scroll">
				<!-- 头部 -->
				<a-layout-header>
					<span v-if="type==1">账户明细</span>
					<span v-if="type==2">{{'【'+staticList.exten+'】'}}坐席明细</span>
					<span v-if="type==3">{{'【'+staticList.user_name+'】'}}外呼明细</span>
					<a-button type="primary" icon="rollback" style="margin:9px 0;font-size: 14px;float: right;"
					          @click="goBack">返回列表
					</a-button>
				</a-layout-header>

				<a-layout-content>
					<!--					账户余额-->
					<div class="header" v-if="type==1">
						<div class="static">
							<div class="static_content">
								<div style="font-size:14px">账户余额</div>
								<div style="font-size:18px;font-weight: 700">
									<span v-if="staticList.balance>0">￥{{staticList.balance}}</span>
									<span v-if="staticList.balance<=0">--</span>
								</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">累计充值金额</div>
								<div style="font-size:18px;font-weight: 700">
									<span v-if="staticList.recharge>0">￥{{staticList.recharge}}</span>
									<span v-if="staticList.recharge<=0">--</span>
								</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">累计消耗金额</div>
								<div style="font-size:18px;font-weight: 700">
									<span v-if="staticList.consume>0">￥{{staticList.consume}}</span>
									<span v-if="staticList.consume<=0">--</span>
								</div>
							</div>
						</div>

						<div class="search_card">
							<div class="search_content" style="width: 10%">
								<a-select
										showSearch allowClear
										placeholder="请选择状态"
										optionFilterProp="children"
										v-model="listQuery.type">
									<template v-for="item in consumeType">
										<a-select-option :value="item.value">
											{{ item.title }}
										</a-select-option>
									</template>
								</a-select>
							</div>

							<div class="search_content">
								<a-range-picker v-model="time" style="width: 96%;padding: 0"
								                @change="handleTimeChange"/>
							</div>

							<div class="search_content" style="width:auto;text-align: left">
								<a-button type="primary" @click="searchDetail">查找
								</a-button>
								<a-button style="margin:0 0.5rem" @click="clear">清空</a-button>
							</div>
						</div>

					</div>
					<!--					坐席明细-->
					<div class="header" v-if="type==2">

						<div class="static">
							<div class="static_content">
								<div style="font-size:14px">累计消耗话费</div>
								<div style="font-size:18px;font-weight: 700">
									￥{{staticList.money>0?staticList.money:'--'}}
								</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">实际总通话时长</div>
								<div style="font-size:18px;font-weight: 700">
									{{staticList.duration_turth?staticList.duration_turth:'--'}}
								</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">计费总通话时长
									<a-tooltip placement="right">
										<template slot="title">
											<div>根据运营商要求，通话不满一分钟按一分钟计算。</div>
										</template>
										<a-icon type="question-circle" style="margin-left:5px;"/>
									</a-tooltip>
								</div>
								<div style="font-size:18px;font-weight: 700">
									{{staticList.duration?staticList.duration:'--'}}
								</div>
							</div>

						</div>
						<div class="search_card">
							<div class="search_content">
								<a-input placeholder="请输入成员名称进行查找" @keyup.enter="getDetail"
								         v-model="listQuery.keyword"></a-input>
							</div>

							<div class="search_content">
								<a-range-picker v-model="time" style="width: 96%;padding: 0"
								                @change="handleTimeChange"/>
							</div>
							<div class="search_content" style="width:auto;text-align: left">
								<a-button type="primary" @click="searchDetail">查找
								</a-button>
								<a-button style="margin:0 0.5rem" @click="clear">清空</a-button>
							</div>

						</div>

					</div>
					<!--					成员明细-->
					<div class="header" v-if="type==3">
						<div class="static">
							<div class="static_content">
								<div style="font-size:14px">累计消耗话费</div>
								<div style="font-size:18px;font-weight: 700">
									￥{{staticList.money>0?staticList.money:'--'}}
								</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">实际总通话时长</div>
								<div style="font-size:18px;font-weight: 700">
									{{staticList.duration_turth?staticList.duration_turth:'--'}}
								</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">计费总通话时长
									<a-tooltip placement="right">
										<template slot="title">
											<div>根据运营商要求，通话不满一分钟按一分钟计算。</div>
										</template>
										<a-icon type="question-circle" style="margin-left:5px;"/>
									</a-tooltip>
								</div>
								<div style="font-size:18px;font-weight: 700">
									{{staticList.duration?staticList.duration:'--'}}
								</div>
							</div>
						</div>

						<div class="search_card">
							<div class="search_content">
								<a-range-picker v-model="time" style="width: 96%;padding: 0"
								                @change="handleTimeChange"/>
							</div>

							<div class="search_content" style="width:auto;text-align: left">
								<a-button type="primary" @click="searchDetail">查找
								</a-button>
								<a-button style="margin:0 0.5rem" @click="clear">清空</a-button>
							</div>
						</div>
					</div>

					<div class="content_table">
						<a-spin tip="Loading..." size="large" :spinning="listLoading">
							<a-table :data-source="recordList" :pagination="false" :rowClassName="rowClassName">

								<a-table-column key="create_time" title="操作时间" align='center' data-index="create_time"
								                v-if="type==1">
									<template slot-scope="text,record">
										<div style="text-align: center">
											{{record.create_time}}
										</div>
									</template>
								</a-table-column>
								<a-table-column key="type_text" title="消耗类型" align='center' data-index="type_text"
								                v-if="type==1">
									<template slot-scope="text,record">
										<span>{{record.type_text}}</span>
									</template>
								</a-table-column>
								<a-table-column key="money" title="余额变动" align='center' data-index="money"
								                v-if="type==1">
									<template slot-scope="text,record">
										<span v-if="record.type==2||record.type==4||record.type==5">-￥{{record.money.substr(1)}}</span>
										<span v-else>￥{{record.money}}</span>
									</template>
								</a-table-column>
								<a-table-column key="user_name" title="使用成员" data-index="user_name" v-if="type==2">
									<template slot-scope="text,record">
										<a-tag color="orange">
											{{record.user_name+'('+record.department+')'}}
										</a-tag>
										<view>{{record.small_phone}}</view>
									</template>
								</a-table-column>

								<a-table-column key="custom_name" title="客户接听" data-index="custom_name">
									<template slot-scope="text,record" v-if="type!=1">
										<span>{{record.custom_name}}</span>
									</template>
								</a-table-column>

								<a-table-column key="money" title="话费消耗" data-index="money" v-if="type!=1">
									<template slot-scope="text,record">
										<span>￥{{record.money}}</span>
									</template>
								</a-table-column>

								<a-table-column key="duration_turth" title="实际通话时长" data-index="duration_turth"
								                v-if="type!=1">

									<template slot-scope="text,record">
										<span>{{record.duration_turth}}</span>
									</template>
								</a-table-column>
								<a-table-column key="duration" data-index="duration" v-if="type!=1">
									<span slot="title">计费通话时长
										<a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>根据运营商要求，通话不满一分钟按一分钟计算。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<template slot-scope="text,record">
										<span>{{record.duration}}</span>
									</template>
								</a-table-column>
								<a-table-column key="ring" title="使用时间（开始拨打至挂机时间）" data-index="ring" v-if="type==3">
									<template slot-scope="text,record">
										<div style="display: flex;justify-content: flex-start">
											<div>
												<div>
													{{record.ring.split(' ')[0]}}
												</div>
												<div> {{record.ring.split(' ')[1]}}
												</div>
											</div>
											<div style="margin: 0 5px">至</div>
											<div>
												<div>
													{{record.end.split(' ')[0]}}
												</div>
												<div> {{record.end.split(' ')[1]}}
												</div>
											</div>
										</div>
									</template>
								</a-table-column>
								<a-table-column key="create_time" title="操作时间" data-index="create_time" v-if="type==2">
									<template slot-scope="text,record">
										<div>
											{{record.create_time.split(' ')[0]}}
										</div>
										<div> {{record.create_time.split(' ')[1]}}
										</div>
									</template>
								</a-table-column>

								<a-table-column key="action" data-index="tags" v-if="type==3">
									<span slot="title">操作
										<a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>因运营商关系，播放时长与下载时长，可能会与实际通话时长略有差异。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<template slot-scope="text,record,index">
										<a-button style="margin-right: 5px"
										          @click="playAudio(record)">播放
										</a-button>

										<a-button style="margin-right: 5px" @click="downloadFile($event,record)">下载
										</a-button>
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
		<a-modal :visible="showPlay"
		         title="通话录音"
		         cancelText="关闭"
		         @cancel="handleCancel"
		>
			<template slot="footer">
				<a-button @click="handleCancel">关闭</a-button>
			</template>
			<div style="font-size: 15px;font-weight: 700;line-height: 30px">
				<div>
					<img style="width: 20px;height: 20px;vertical-align: text-bottom;"
					     src="../../../assets/call.png"/>
					{{selectedRecord.real_called}}
				</div>
				<div>
					<span>开始时间：</span>
					{{selectedRecord.begin}}
				</div>
				<div>
					<span>结束时间：</span>
					{{selectedRecord.end}}
				</div>
				<div>
					<span>通话时长：</span>
					{{selectedRecord.duration_turth}}
				</div>
			</div>

			<audio-player
					ref="audioPlayer"
					:show-prev-button="false"
					:show-next-button="false"
					:isLoop="false"
					:audio-list="[selectedRecord.file]"
					@loadedmetadata="loadedmetadata"
					theme-color="#1890ff"
			/>
		</a-modal>

	</div>
</template>

<script>
	import AudioPlayer from '@liripeng/vue-audio-player'
	import '@liripeng/vue-audio-player/lib/vue-audio-player.css'

	const defaultQuery = {
		page     : 1,
		page_size: 15,
		corp_id  : localStorage.getItem('corpId'),
		type     : 0
	}
	export default {
		components: {AudioPlayer},
		data () {
			return {
				total         : 0,
				listQuery     : Object.assign({}, defaultQuery),
				type          : this.$route.query.type, // 明细类型 1-账户余额 2-坐席明细
				consumeType   : [
					{value: 0, title: '消耗类型'}, {value: 1, title: '话费充值'},
					{value: 2, title: '话费消耗'}, {value: 3, title: '坐席充值'},
					{value: 4, title: '开通坐席'}, {value: 5, title: '续费坐席'},
				],
				listLoading   : false,
				time          : [],
				recordList    : [],
				staticList    : [],
				clickIndex    : -1,
				flag          : false,
				playTime      : [],
				t1            : [],
				showPlay      : false,
				selectedRecord: {}
			}
		},
		mounted () {
			if (this.$route.query.type == 2) {
				this.listQuery.id = this.$route.query.id
				this.getDetail()
			} else if (this.$route.query.type == 1) {
				this.getAccountDetail()
			} else if (this.$route.query.type == 3) {
				this.listQuery.id = this.$route.query.id
				this.getStaffDetail()
			}
		},
		methods   : {
			loadedmetadata (e) {
				console.log(111111111111,this.$refs.audioPlayer.duration)
				this.$refs.audioPlayer.duration = Math.floor(this.$refs.audioPlayer.duration)
			},
			// 坐席明细
			async getDetail () {
				this.listLoading = true
				const {data: res} = await this.axios.post('/dialout/exten-detail', this.listQuery)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.total = parseInt(res.data.count)
					this.recordList = res.data.list
					this.staticList = res.data.statis
				}
				this.listLoading = false
			},
			// 账户明细
			async getAccountDetail () {
				this.listLoading = true
				const {data: res} = await this.axios.post('dialout/account-detail', this.listQuery)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.total = parseInt(res.data.count)
					this.recordList = res.data.list
					this.staticList = res.data.statis
				}
				this.listLoading = false
			},

			//成员明细
			async getStaffDetail () {
				this.listLoading = true
				const {data: res} = await this.axios.post('dialout/dialout-detail', this.listQuery)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.total = parseInt(res.data.count)
					this.recordList = res.data.list
					this.staticList = res.data.statis
				}
				this.listLoading = false
			},
			handleTimeChange (date, dateString) {
				this.listQuery.sdate = dateString[0]
				this.listQuery.edate = dateString[1]
			},
			searchDetail () {
				if (this.$route.query.type == 2) {
					this.listQuery.id = this.$route.query.id
					this.getDetail()
				} else if (this.$route.query.type == 1) {
					this.getAccountDetail()
				} else if (this.$route.query.type == 3) {
					this.listQuery.id = this.$route.query.id
					this.getStaffDetail()
				}
			},

			downloadFile (event, record) {
				let name = record.ring + '.mp3'
				event.preventDefault(); // 去掉默认事件
				let a = document.createElement('a'); // 创建a标签
				let e = document.createEvent('MouseEvents'); // 创建鼠标事件对象
				e.initEvent('click', false, false); // 初始化事件对象
				a.setAttribute("target", '_blank')
				a.rel = 'noopener noreferrer'
				a.href = record.file // 设置下载地址
				a.download = name; // 设置下载文件名
				a.dispatchEvent(e); //执行下载
			},

			playAudio (record) {
				this.showPlay = true;
				this.selectedRecord = record
			},

			handleCancel (e) {
				this.showPlay = false;
			},

			clear () {
				this.listQuery = Object.assign({}, defaultQuery)
				this.time = []
				if (this.$route.query.type == 2) {
					this.listQuery.id = this.$route.query.id
					this.getDetail()
				} else if (this.$route.query.type == 1) {
					this.getAccountDetail()
				} else if (this.$route.query.type == 3) {
					this.listQuery.id = this.$route.query.id
					this.getStaffDetail()
				}
			},
			goBack () {
				let url = '/call/' + this.$route.query.from
				this.$router.push(url)
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
				if (this.$route.query.type == 2) {
					this.listQuery.id = this.$route.query.id
					this.getDetail()
				} else if (this.$route.query.type == 1) {
					this.getAccountDetail()
				} else if (this.$route.query.type == 3) {
					this.listQuery.id = this.$route.query.id
					this.getStaffDetail()
				}
			},
			showSizeChange (current, page_size) {
				this.listQuery.page_size = page_size
				if (this.$route.query.type == 2) {
					this.listQuery.id = this.$route.query.id
					this.getDetail()
				} else if (this.$route.query.type == 1) {
					this.getAccountDetail()
				} else if (this.$route.query.type == 3) {
					this.listQuery.id = this.$route.query.id
					this.getStaffDetail()
				}
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

		.search_content {
			width: 17%;

			.ant-input {
				width: 96%;

			}

			.ant-select {
				width: 96%;
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
		margin-bottom: 1rem;

		.static_content {
			background-color: #F8F8F8;
			width: 12.213rem;
			height: 5.76rem;
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
