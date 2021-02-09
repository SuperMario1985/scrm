<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden">
				<a-layout style="position: absolute;top:0;bottom:0;left:0;right:0;overflow-x: hidden; overflow-y: auto;"
				          class="scroll">
					<!-- 头部 -->
					<a-layout-header>群打卡
						<div class="help"
						     :class="showTransition == 0 ?'help-transition': (showTransition== 1 ? 'help-transition1' : '')">
							<a href="https://support.qq.com/products/104790/faqs/85022"
							   target="_blank">
								<a-icon type="question-circle" class="help-icon"/>
								<span style="float:right;">点我帮助</span>
							</a>
						</div>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							群打卡，作为运营社群的常规方式之一，其不仅可以提升老客户的积极性，而且在一定程度上还可以增加用户粘性，提升群聊活跃度及转化率，尤其对于教育、电商非常适用。
							<p style="margin: 10px 0 2px;">
								流程如下：
							</p>
							<p style="margin-bottom: 2px;">
								1、登录企业微信管理后台，在【客户联系】-【聊天工具】-【自动回复】中，将二维码或者链接设置为打卡自动回复语。群成员可以每天在群聊中@小助理，发送指定的关键词，如“签到”，在群内收到打卡入口，进行打卡。
							</p>
							<p style="margin-bottom: 2px;">
								2、群主可将自动回复内容添加到群公告中，方便群内的企业成员使用，以免社群太活跃，导致刚发出去没多久的打卡链接、二维码被刷上去了，而导致客户找不到活动入口。
							</p>
							<p style="margin-bottom: 2px;">
								3、同时，使用客户群 群发工具，由企业管理员或是员工群发，将打卡活动群发到客户群中，邀请客户参与。
							</p>
							<p style="margin-bottom: 2px;color: red;">
								目前仅限个人微信用户才可以参与打卡活动，企业微信员工不可参与。
							</p>
						</div>
						<div class="content-hd">
							<a-col style="float:left;">
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 210px;margin-right: 10px;"
										@change="handleChange"
										v-model="corpId"
										v-if="corpLen > 1"
								>
									<template v-for="item in corpInfo">
										<a-select-option :value="item.corpid">{{item.corp_full_name ||
											item.corp_name}}
										</a-select-option>
									</template>
								</a-select>
								<a-input placeholder="搜索活动名称" @keyup.enter="find" v-model="title"
								         style="width: 150px;margin-right: 10px;"/>
								<a-select v-model="status" style="width: 120px;margin-right: 10px;" placeholder="活动状态">
									<a-select-option value="0">未开始</a-select-option>
									<a-select-option value="1">进行中</a-select-option>
									<a-select-option value="2">已结束</a-select-option>
								</a-select>
								<a-range-picker style="width: 300px" v-model="activityTime" @change="changeTime"/>
								<a-button type="primary" style="margin: 0px 10px;" @click="find">查询</a-button>
								<a-button @click="clear">重置</a-button>
							</a-col>
							<a-col style="float:right;">
								<a-button v-has="'groupClockIn-add'" class="btn-primary" icon="plus"
								          @click="addWelcomeText" type="primary">
									新建活动
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="activityList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'groupClockIn-list'">
									<span slot="url" slot-scope="text, record, index">
										<div style="width: 100px;margin: 0 auto 6px;float: left;"
										     :ref="'qrcode' + index" :id="'qrcode' + index">
										</div>
										<!--										<a style="margin-left: 6px;" v-has="'groupClockIn-load'"-->
										<!--										   @click="copyText(text)">复制活动链接</a>-->
									</span>
									<span slot="title2" slot-scope="text, record">
										<div style="width: 140px;margin-right:15px;">{{record.title}}</div>
									</span>
									<span slot="date_str" slot-scope="text, record">
										<div v-if="record.type == 1" style="width: 150px;">永久有效</div>
										<div v-if="record.type == 2" style="width: 150px;">
											{{record.start_time}}至{{record.end_time}}
										</div>
									</span>
									<span slot="choose_type" slot-scope="text, record">
										<div v-if="text == 1">连续打卡</div>
										<div v-if="text == 2">累计打卡</div>
									</span>
									<span slot="taskRule" slot-scope="text, record">
										<div v-for="item in record.task">
											<span v-if="record.choose_type == 1">连续打卡</span>
											<span v-if="record.choose_type == 2">累计打卡</span><span style="color: red;">{{item.days}}</span>天，赠送<span
												v-if="item.type == 1">{{item.reward_name}}</span><span
												v-if="item.type == 2">红包{{item.money_amount}}元</span>
										</div>
									</span>
									<span slot="num" slot-scope="text, record">
										{{text}}人
									</span>
									<span slot="status" slot-scope="text, record">
										<div v-if="text == 0">未开始</div>
										<div v-if="text == 1">进行中</div>
										<div v-if="text == 2">已结束</div>
									</span>
									<div slot="action" slot-scope="text, record, index" style="width: 180px;">
										<a-button style="margin: 0 5px 5px 0" v-has="'groupClockIn-release'"
										          @click="releaseActivity(record.id)"
										          v-if="record.status == 0">发布
										</a-button>
										<a-button style="margin: 0 5px 5px 0" v-has="'groupClockIn-failure'"
										          @click="failure(record.id,record.title)"
										          v-if="record.status == 1">使失效
										</a-button>
										<a-button style="margin: 0 5px 5px 0" v-has="'groupClockIn-edit'"
										          @click="edit(record.id)"
										          v-if="record.status != 2">编辑
										</a-button>
										<a-button style="margin: 0 5px 5px 0" v-has="'groupClockIn-detail'"
										          @click="openDetail(record.id,record.title)"
										          v-if="record.status != 0">参与明细
										</a-button>
										<a-button :data-url="record.qr_code" v-has="'groupClockIn-load'"
										          :data-name="record.title"
										          :data-id='"qrcode" + index'
										          @click="downLoadWay" class="actionBtn" style="margin: 0 5px 5px 0"
										          v-if="record.status == 1"
										>下载
										</a-button>
										<a-button v-has="'groupClockIn-load'"
										          @click="copyText(record.url)" class="actionBtn"
										          style="margin: 0 5px 5px 0"
										          v-if="record.status == 1"
										>活动链接
										</a-button>
										<a-button @click="deleteActivity(record.id,record.title)"
										          v-has="'groupClockIn-delete'"
										          v-if="record.status != 1">删除
										</a-button>
									</div>
								</a-table>

								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
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
					</a-layout-content>

				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import MyIcon from "@/components/MyIcon.vue"
	import moment from 'moment';
	import QRCode from 'qrcodejs2'

	// 活动列表
	const columns = [
		{
			title      : "打卡二维码",
			dataIndex  : "url",
			key        : "url",
			width      : "120px",
			scopedSlots: {customRender: "url"}
		},
		{
			title      : "打卡活动名称",
			dataIndex  : "title",
			key        : "title",
			width      : "120px",
			scopedSlots: {customRender: "title2"}
		},
		{
			title      : "活动时间",
			dataIndex  : "date_str",
			key        : "date_str",
			scopedSlots: {customRender: "date_str"}
		},
		{
			title      : "打卡类型",
			dataIndex  : "choose_type",
			key        : "choose_type",
			scopedSlots: {customRender: "choose_type"}
		},
		{
			title      : "规则",
			dataIndex  : "taskRule",
			key        : "taskRule",
			scopedSlots: {customRender: "taskRule"}
		},
		{
			title      : "参与打卡人数",
			dataIndex  : "num",
			key        : "num",
			scopedSlots: {customRender: "num"}
		},
		{
			title      : "状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "groupClockIn",
		components: {MyIcon},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				suite_id    : 1,//应用ID
				corpId      : corpId,//企业微信选中的id
				corpInfo    : [], //企业微信列表
				status      : [], // 0全部 1未开始 2进行中 3已结束
				title       : '',// 输入框内容
				activityTime: [], // 时间
				activityList: [],// 表格数组
				isLoading   : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				//分页
				total       : 0, //总条数
				quickJumper : false, // 是否显示快速跳转的控件
				page        : 1, //页码
				pageSize    : 15, //每页数据条数
				corpLen     : JSON.parse(localStorage.getItem('corpArr')).length,
				showTransition    : 1,
			};
		},

		methods: {
			initHelp () {
				let that = this
				setInterval(function () {
					that.showTransition = (that.showTransition + 1) % 5;
				}, 1000)
			},
			//左侧企业微信
			handleChange (value) {
				this.corpId = value
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			changeTime (data, dataString) {
				this.activityTime = data
			},
			// 点击搜索
			find () {
				this.getActivityList()
			},
			// 点击清空
			clear () {
				this.status = []
				this.title = ''
				this.activityTime = []
				this.page = 1
				this.pageSize = 15
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
				this.getActivityList()
			},
			// 新建标签
			addWelcomeText () {
				this.$router.push('/group/clockInAdd')
			},
			// 获取表格内容
			async getActivityList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("work-group-clock-activity/list", {
					corp_id   : this.corpId,
					status    : this.status,
					title     : this.title,
					start_time: this.activityTime.length > 0 ? moment(this.activityTime[0]).format("YYYY-MM-DD") : "",
					end_time  : this.activityTime.length > 0 ? moment(this.activityTime[1]).format("YYYY-MM-DD") : "",
					page      : page,
					page_size : pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.activityList = res.data.info;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					let that = this
					this.$nextTick(() => {
						for (let i = 0; i < this.activityList.length; i++) {
							document.getElementById('qrcode' + i).innerHTML = ""
						}
						for (let i = 0; i < this.activityList.length; i++) {
							that.qrcode(this.activityList[i].url, i)
						}
					})
				}
			},
			// 二维码
			qrcode (url, i) {
				let qrcode = new QRCode('qrcode' + i, {
					width     : 100,
					height    : 100,
					text      : url, // 二维码地址
					colorDark : "#000",
					colorLight: "#FFF",
				})
			},
			copyText (value) {
				let that = this
				const input = document.createElement('input')
				document.body.appendChild(input)
				input.setAttribute('value', value)
				input.select()
				if (document.execCommand('copy')) {
					document.execCommand('copy')
					that.$message.success("复制成功！")
				}
				document.body.removeChild(input)
			},
			// 使失效
			failure (id, name) {
				let that = this;
				that.$confirm({
					title     : "确定结束【" + name + "】活动？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 0)
					}
				});
			},
			// 发布
			releaseActivity (id) {
				let that = this;
				that.$confirm({
					title     : "确定发布该活动？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 1)
					}
				});
			},
			//删除
			deleteActivity (id, name) {
				let that = this;
				that.$confirm({
					title     : "确定删除【" + name + "】活动？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 2)
					}
				});
			},
			async changeStatus (id, status) {
				const {data: res} = await this.axios.post("work-group-clock-activity/invalid", {
					id  : id,
					type: status
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if (status == 0) {
						//删除判断最后一页是否只有一条
						if (this.activityList.length == 1 && this.page > 1) {
							this.getActivityList(this.page - 1, this.pageSize)
						} else {
							this.getActivityList(this.page, this.pageSize)
						}
					} else {
						this.getActivityList(this.page, this.pageSize)
					}
				}
			},
			downLoadWay (e) {
				let that = this
				let image = new Image()
				image.setAttribute('crossOrigin', 'anonymous')
				let j = document.getElementById(e.target.dataset.id)
				image.src = document.getElementById(e.target.dataset.id).getElementsByTagName('img')[0].getAttribute("src")
				image.onload = () => {
					let canvas = document.createElement('canvas')
					canvas.width = 200
					canvas.height = 200
					let ctx = canvas.getContext('2d')
					ctx.drawImage(image, 0, 0, 200, 200)
					canvas.toBlob((blob) => {
						let url = URL.createObjectURL(blob)
						that.download(url, e.target.dataset.name)
						// 用完释放URL对象
						URL.revokeObjectURL(url)
					})
				}
			},
			download (href, name) {
				let eleLink = document.createElement('a')
				eleLink.download = name
				eleLink.href = href
				eleLink.click()
				eleLink.remove()
			},
			// 编辑
			edit (id) {
				this.$router.push("/group/clockInAdd?id=" + id)
			},
			// 分页
			changePage (page, pageSize) {
				this.getActivityList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 280)
				})
			},
			showSizeChange (page, pageSize) {
				this.getActivityList(1, pageSize);
			},
			// 参与人打卡
			openDetail (id, title) {
				this.$router.push('/group/joinList?joinId=' + id + '&joinTitle=' + title)
			},
		},

		mounted () {
			this.initHelp()
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.getActivityList()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/group/clockIn' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getActivityList(vm.page, vm.pageSize)
				});
			} else if (from.path == '/group/joinList' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getActivityList(vm.page, vm.pageSize)
				});
			} else {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.status = []
					vm.title = ''
					vm.activityTime = []
					vm.page = 1
					vm.pageSize = 15
					vm.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
					vm.getActivityList()
				});
			}

			next()
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}


	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
		border-right: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.btn-primary {
		margin-left: 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 90px;
		margin: 0px;
		text-align: center;
	}

	.help {
		/*float: left;*/
		display: inline-block;
		margin-left: 10px;
		/*margin-top: 3px;*/
	}

	.help-icon {
		margin-right: 5px;
		font-size: 14px;
		margin-top: 4px;
	}

	.help-transition {
		animation: help 1s infinite;
	}

	.help a {
		font-size: 14px;
	}

	.help a:link {
		color: #01b065;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.help a:visited {
		color: #01b065;
		text-decoration: none;
	}

	//已访问：紫色、无下划线
	.help-transition1 {
		animation: help1 1s infinite;
	}

	@keyframes help {
		0% {
			transform: translate(0px, 0px);
		}
		50% {
			transform: translate(0px, -8px);
		}
		100% {
			transform: translate(0px, 3px);
		}
	}

	@keyframes help1 {
		0% {
			transform: translate(0px, 3px);
		}
		50% {
			transform: translate(0px, -4px);
		}
		100% {
			transform: translate(0px, 0px);
		}
	}
</style>
