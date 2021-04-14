<template>
	<div class="list">
		<a-layout class="fans-content">
			<a-layout class="scroll">
				<!-- 头部 -->
				<a-layout-header>通话记录</a-layout-header>
				<a-layout-content>
					<div class="header">
						<div class="static" v-if="recordList.statis">
							<div class="static_content">
								<div style="font-size:14px">实际总通话时长</div>
								<div style="font-size:18px;font-weight: 700">{{recordList.statis.duration_turth}}</div>
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
								<div style="font-size:18px;font-weight: 700">{{recordList.statis.duration}}</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">总拨打次数</div>
								<div style="font-size:18px;font-weight: 700">{{recordList.statis.total_num}}</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">接通总次数</div>
								<div style="font-size:18px;font-weight: 700">{{recordList.statis.connect_num}}</div>
							</div>
							<div class="static_content">
								<div style="font-size:14px">未接通总次数</div>

								<div style="font-size:18px;font-weight: 700">{{recordList.statis.unconnect_num}}</div>
							</div>
						</div>

						<div class="search_card">
							<div class="search_content">
								<span>关键字：</span>
								<a-input @keyup.enter="getList" placeholder="请输入客户名/成员名进行搜索"
								         v-model.trim="listQuery.keyword"></a-input>
							</div>
							<div class="search_content">
								<span>时间段：</span>
								<a-select
										showSearch allowClear
										placeholder="请选择时间段"
										optionFilterProp="children"
										v-model="listQuery.timeRange">
									<template v-for="item in timeList">
										<a-select-option :value="item.value">
											{{ item.title }}
										</a-select-option>
									</template>
								</a-select>
							</div>

							<div class="search_content">
								<span>时 长：</span>
								<a-select style="width: 78%"
								          showSearch allowClear
								          placeholder="请选择时长"
								          optionFilterProp="children"
								          v-model="listQuery.timeScope"
								>
									<template v-for="item in timeRangeList">
										<a-select-option :value="item.value">
											{{ item.title }}
										</a-select-option>
									</template>
								</a-select>
							</div>

							<div class="search_content" style="width: 19%">
								<span>状 态：</span>
								<a-select style="width: 78%"
								          showSearch allowClear
								          placeholder="请选择状态"
								          optionFilterProp="children"
								          v-model="listQuery.state">
									<template v-for="item in statusList">
										<a-select-option :value="item.value">
											{{ item.title }}
										</a-select-option>
									</template>
								</a-select>
							</div>

							<div class="search_content" @click="showDepartmentModel()">
								<span>选择成员：</span>
								<a-button style="width: 60%;overflow: hidden;text-overflow: ellipsis">
									<span v-if="listQuery.staffList&&listQuery.staffList.length > 0">
										已选择{{listQuery.staff_userNum}}名成员，{{listQuery.staff_departmentNum}}个部门
									</span>
									<span v-else>选择成员</span>
								</a-button>
							</div>

							<div class="search_content">
								<span>时间筛选：</span>
								<a-range-picker v-model="time" @change="handleTimeChange"
								                style="width: 74%;padding: 0"/>
							</div>

							<div class="search_content" style="width: 30%">
								<span>
									<a-radio-group v-model="last_time" @change="handleTimeRange">
										<a-radio-button :value="0">昨日</a-radio-button>
										<a-radio-button :value="1">今日</a-radio-button>
										<a-radio-button :value="2">本周</a-radio-button>
										<a-radio-button :value="3">本月</a-radio-button>
										<a-radio-button :value="4">自定义</a-radio-button>
									</a-radio-group>
	                            </span>
							</div>

							<div class="search_content" style="width:auto;text-align: left">
								<a-button type="primary" @click="getList">查找
								</a-button>
								<a-button style="margin:0 0.7rem" @click="clear">清空</a-button>
							</div>

						</div>

					</div>
					<div style="float: right;margin:0 1rem;position: relative">
						<a-dropdown>
							<a-menu slot="overlay" @click="exportData">
								<a-menu-item :key="0">当前页导出</a-menu-item>
								<a-menu-item :key="1">全部导出</a-menu-item>
							</a-menu>
							<a-button type="primary" icon="download" style="margin: 0 0 10px 0;">导出
								<a-icon style="color: #FFFFFF;" type="down"/>
							</a-button>
						</a-dropdown>
					</div>
					<div class="content_table">
						<a-spin tip="Loading..." size="large" :spinning="listLoading">
							<a-table :data-source="recordList.list" :pagination="false" :rowClassName="rowClassName">

								<a-table-column key="ring" title="拨打时间" data-index="ring">
									<template slot-scope="text,record">
										<div>
											{{record.ring.split(' ')[0]}}
										</div>
										<div> {{record.ring.split(' ')[1]}}
										</div>
									</template>
								</a-table-column>
								<a-table-column key="user_name" title="成员拨打" data-index="user_name">
									<template slot-scope="text,record">
										<span>{{record.user_name+' ('+record.department+')'}}</span>
									</template>
								</a-table-column>
								<a-table-column key="custom_name" title="客户接听" data-index="custom_name">
									<template slot-scope="text,record">
										<span>{{record.custom_name}}</span>
									</template>
								</a-table-column>
								<a-table-column key="province" title="手机号归属地" data-index="province">
									<template slot-scope="text,record">
										<span>{{record.province+'-'+record.district}}</span>
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
								<a-table-column key="state_text" data-index="state_text">
									<span slot="title">状态
										<a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>未接通不计费</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<template slot-scope="text,record">
										<span :style="{'color': record.state!=1?'red' : ''}">{{record.state_text}}</span>
									</template>
								</a-table-column>

								<a-table-column key="action" data-index="tags">
									<span slot="title">操作
										<a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>因运营商关系，播放时长与下载时长，可能会与实际通话时长略有差异。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<template slot-scope="text,record,index">
										<a-button v-if="record.state==1" style="margin-right: 5px"
										          @click="playAudio(record)">播放
										</a-button>
										<a-button v-if="record.state==1" style="margin-right: 5px"
										          @click="downloadFile(record)">下载
										</a-button>
										<span v-else>--</span>
									</template>
								</a-table-column>
							</a-table>
						</a-spin>
						<div class="pagination" style="display: flex;justify-content: space-between;margin: 20px 0"
						     v-if="recordList.list&&recordList.list.length>0">
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

		<chooseDepartment :show="showDepartment" :chooseNum="chooseNum" ref="user"
		                  :callback="departmentChange" :isDialout="1" :is_from="11"></chooseDepartment>
		<!--		播放弹窗-->

		<a-modal :visible="showPlay"
		         title="通话录音"
		         cancelText="关闭"
		         @cancel="handleCancel"
		         class="record"
		>
			<template slot="footer">
				<a-button @click="handleCancel">关闭</a-button>
			</template>
			<div style="font-size: 15px;font-weight: 700;line-height: 30px;overflow-y: hidden">
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
			<div>
				<audio-player ref="audioPlayer"
				              @loadedmetadata="loadedmetadata"
				              :show-prev-button="false"
				              :show-next-button="false"
				              :isLoop="false"
				              :audio-list="[selectedRecord.file_name]"
				              theme-color="#01b065"/>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import moment from 'moment';
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import AudioPlayer from '@liripeng/vue-audio-player'
	import '@liripeng/vue-audio-player/lib/vue-audio-player.css'

	const defaultQuery = {
		page      : 1,
		page_size : 15,
		corp_id   : localStorage.getItem('corpId'),
		state     : 0,
		staffList : [],
		staffArr  : [],
		timeRange : 0, // 时间段
		timeScope : 0, //时长
		export_all: 0,
		is_export : 0,
		sdate     : moment().startOf('week').format('YYYY-MM-DD'),
		edate     : moment().endOf('week').format('YYYY-MM-DD')
	}

	export default {
		name      : "callRecord",
		components: {chooseDepartment, AudioPlayer},
		data () {
			return {
				commonUrl    : this.$store.state.commonUrl,//公共的链接
				total        : 0,
				listQuery    : Object.assign({}, defaultQuery),
				timeList     : [
					{value: 0, title: '全部时间段'}, {value: 1, title: '00:00-05:59'},
					{value: 2, title: '06:00-11:59'}, {value: 3, title: '12:00-17:59'},
					{value: 4, title: '18:00-11:59'},
				], //时间段列表
				timeRangeList: [
					{value: 0, title: '全部时长'}, {value: 1, title: '0分钟至5分钟'},
					{value: 2, title: '6分钟至10分钟'}, {value: 3, title: '11分钟至30分钟'},
					{value: 4, title: '31分钟至1小时'}, {value: 5, title: '1小时以上'},
				],

				statusList     : [
					{value: 0, title: '全部状态'}, {value: 1, title: '接通'},
					{value: 2, title: '未接通'},
				],
				listLoading    : false,
				recordList     : [],
				time           : [moment().startOf('week'), moment().endOf('week')],
				last_time      : 2,
				showDepartment : false,
				chooseNum      : 0,
				clickIndex     : -1,
				flag           : false,
				playTime       : [],
				t1             : [],
				showPlay       : false,
				selectedRecord : {},
				batchTypeValue : false,
				batchType      : 0,
				selectedRowKeys: []
			}
		},

		mounted () {
			this.getList()
		},
		methods: {
			loadedmetadata (e) {
				this.$refs.audioPlayer.duration = Math.floor(this.$refs.audioPlayer.duration)
			},
			async getList () {
				this.listLoading = true
				const {data: res} = await this.axios.post("dialout/dialout-record", this.listQuery);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					if (this.listQuery.is_export == 0) {
						this.total = parseInt(res.data.count)
						this.recordList = res.data
					}
				}
				if (this.listQuery.is_export == 1) {
					this.listQuery.is_export = 0
					// this.listQuery = Object.assign({}, defaultQuery)
					// this.time = [moment().startOf('week'), moment().endOf('week')]
					// this.last_time = 2
					this.ws.setCallback(this.websocketOnMessage)// 监听socket
				}
				this.listLoading = false
			},
			handleTimeChange (date, dateString) {
				this.listQuery.sdate = dateString[0]
				this.listQuery.edate = dateString[1]
				this.last_time = 4
			},
			handleTimeRange () {
				this.listQuery.sdate = moment()
				switch (this.last_time) {
					case 0:
						let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
						this.time = [yesterday, yesterday]
						this.listQuery.sdate = yesterday
						this.listQuery.edate = yesterday
						break
					case 1:
						this.time = [moment().startOf('day'), moment().endOf('day')]
						this.listQuery.sdate = moment().startOf('day').format('YYYY-MM-DD')
						this.listQuery.edate = moment().endOf('day').format('YYYY-MM-DD')
						break
					case 2:
						this.time = [moment().startOf('week'), moment().endOf('week')]
						this.listQuery.sdate = moment().startOf('week').format('YYYY-MM-DD')
						this.listQuery.edate = moment().endOf('week').format('YYYY-MM-DD')
						break
					case 3:
						this.time = [moment().startOf('month'), moment().endOf('month')]
						this.listQuery.sdate = moment().startOf('month').format('YYYY-MM-DD')
						this.listQuery.edate = moment().endOf('month').format('YYYY-MM-DD')
						break
					case 4:
						this.time = []
						this.listQuery.sdate = ''
						this.listQuery.edate = ''
						break
				}
			},

			// 部门弹框
			showDepartmentModel () {
				if (this.listQuery.staffList) {
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.listQuery.staffList))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.listQuery.staffArr))
				}

				this.showDepartment = true
			},
			departmentChange (event, arr, userNum, departmentNum, list) {
				this.listQuery.staffList = arr
				this.listQuery.staff_userNum = userNum
				this.listQuery.staff_departmentNum = departmentNum
				this.listQuery.staffArr = list
				this.showDepartment = false
			},

			downloadFile (record) {
				let name = record.ring + '.mp3'
				event.preventDefault(); // 去掉默认事件
				let a = document.createElement('a'); // 创建a标签
				let e = document.createEvent('MouseEvents'); // 创建鼠标事件对象
				e.initEvent('click', false, false); // 初始化事件对象
				a.setAttribute("target", '_blank')
				a.rel = 'noopener noreferrer'
				a.download = name; // 设置下载文件名
				a.href = record.file_name // 设置下载地址
				a.dispatchEvent(e); //执行下载
				a.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}))
			},
			playAudio (record) {
				this.showPlay = true;
				this.selectedRecord = record
			},

			handleCancel (e) {
				this.showPlay = false;
			},
			exportData (e) {
				this.listQuery.is_export = 1
				this.listQuery.export_all = e.key
				this.getList()
			},
			websocketOnMessage (data) { // 监听socket
				console.log(11111111111, data)
				if (data.url) {
					window.open(data.url);
					this.ws.setCallback()
				}
			},
			clear () {
				this.listQuery = Object.assign({}, defaultQuery)
				this.time = [moment().startOf('week'), moment().endOf('week')]
				this.last_time = 2
				this.getList()
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
		height: 7rem;
		align-items: center;
		margin-top: 0.5rem;

		.search_content {
			width: 20%;

			.ant-input {
				width: 75%;
			}

			.ant-select {
				width: 75%;
			}

			.ant-radio-group {
				width: 100%;
			}

			.ant-radio-button-wrapper {
				width: 17.5%;
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
			height: 5.76rem;
			padding: 0.64rem 1.067rem;
			margin-right: 16px;
			line-height: 30px;
		}
	}

	.content_table {
		padding: 15px;
		margin: 1rem auto;
	}

	.record > .ant-modal-body {
		overflow: hidden;
	}

</style>
