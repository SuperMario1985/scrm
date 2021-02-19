<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden; " >
				<a-layout style="position: absolute; top:0; bottom:0; right:0; overflow-x: hidden; overflow-y: auto;" class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>裂变引流</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">裂变引流</div>
						<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7">
							裂变助力引流，通过完成分享任务来领取奖励的任务机制，邀请多个好友可免费获得奖品，以此来吸引用户在自己的社交圈进行传播,一传二、二传四的模式，指数级增长。而使用企业微信去做裂变活动时，助力用户需要先加企业成员为好友，再通过欢迎语推送活动图文，助力用户打开即助力成功。在整个裂变的过程中，企业可以获得更多的用户。
							<div style="margin: 10px 0 2px;">自动发送欢迎语失败的原因可能有：
								<a-tooltip placement="bottom">
									<template slot="title">
										<p style="margin-bottom: 2px;font-size: 13px;">
											1、如果在企业微信后台为相关成员配置了可用的欢迎语，第三方系统配置欢迎语则不会推送，优先推送企业微信官方的。</p>
										<p style="margin-bottom: 10px;font-size: 13px;"></p>
										<p style="margin-bottom: 2px;font-size: 13px;">
											2、客户和企业成员已经开始聊天的场景下，不能发送欢迎语。</p>
										<p style="margin-bottom: 10px;font-size: 13px;"></p>
										<p style="margin-bottom: 2px;font-size: 13px;">3、客户之前添加过A企业成员，
											不论客户是否将该成员删除，但凡再通过裂变活动添加上该A企业成员，受限于企业微信官方规则，可能会造成推送其他渠道（包含正在进行中的裂变活动）的欢迎语，也有可能不再推送。</p>
										<p style="margin-bottom: 10px;font-size: 13px;"></p>
										<p style="margin-bottom: 0;font-size: 13px;">
											4、每次添加新的客户时，当存在多个企业自建应用或是第三方应用设置了欢迎语，那么企业微信官方采取优先权的推送，所以存在有的客户接收不到欢迎语。请商户根据实际使用需求，合理配置，避免冲突。</p>
									</template>
									<a-icon type="question-circle"/>
								</a-tooltip>
							</div>
							<p style="margin: 10px 0 2px;color: red;">
								商户需完成以下配置，才能使用派发红包功能：
							</p>
							<p style="margin-bottom: 2px;">
								1、前往<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
								       target="_blank">【微信支付商户平台】</a>注册微信支付商户号
							</p>
							<p style="margin-bottom: 2px;">
								2、登录<a href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu"
								       target="_blank">【企业微信后台】</a>开通企业支付，绑定已有商户号
											 <!-- （<a
									href="https://support.qq.com/products/104790/faqs/66072" target="_blank">查看教程</a>） -->
							</p>
							<p style="margin-bottom: 2px;">
								3、登录<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
								       target="_blank">【微信支付商户平台】</a>开通【企业付款到零钱】
											 <!-- （<a
									href="https://support.qq.com/products/104790/faqs/66076" target="_blank">查看教程</a>） -->
							</p>
							<p style="margin-bottom: 2px;">
								4、在本系统，进入【应用中心】--【企业支付】，点击，填入企业支付的应用ID和Secret
							</p>
							<p style="margin-bottom: 2px;">
								5、在本系统，进入【应用中心】--【企业支付】，点击，完成支付配置。
								<!-- （<a
									href="https://support.qq.com/products/104790/faqs/66058" target="_blank">查看教程</a>） -->
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
								<a-select v-model="status" style="width: 120px;" placeholder="活动状态" allowClear>
									<a-select-option value="1">未开始</a-select-option>
									<a-select-option value="2">进行中</a-select-option>
									<a-select-option value="3">已结束</a-select-option>
								</a-select>
								<a-input placeholder="搜索活动名称" @keyup.enter="find" v-model="title"
								         style="width: 150px;margin: 0px 10px;"/>
								<a-range-picker style="width: 300px" v-model="activityTime" @change="changeTime"/>
								<a-button type="primary" style="margin: 0px 10px;" @click="find">查询</a-button>
								<a-button @click="clear">重置</a-button>
							</a-col>
							<a-col style="float:right;">
								<a-button class="btn-primary"@click="addWelcomeText" type="primary"
								          v-has="'fission-add'">
									创建活动
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="activityList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'fission-list'">
									<span slot="qr_code" slot-scope="text, record, index">
										<div style="width: 100px;margin: 0 auto;"
										     :ref="'qrcode' + index" :id="'qrcode' + index">
										</div>
									</span>
									<span slot="title2" slot-scope="text, record">
										<div style="width: 140px;">{{record.title}}</div>
									</span>
									<span slot="time" slot-scope="text, record">
										<div style="width: 125px;">{{record.start_time}}至</div>
										<div>{{record.end_time}}</div>
									</span>
									<span slot="member_str" slot-scope="text, record">
										<template v-for="user in record.user">
											<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'" color="orange"
											       style="margin-top: 5px;">{{user.title}}</a-tag>
										</template>
										<template v-for="user in record.user">
											<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'" color="blue"
											       style="margin-top: 5px;">{{user.title}}</a-tag>
										</template>
										<span v-if="record.user.length == 0">--</span>
									</span>
									<span slot="status_str" slot-scope="text, record">
										<div>{{record.status_str}}</div>
										<div v-if="record.status_str == '已结束'" style="width: 128px;">（{{record.reason_str}}）</div>
									</span>
									<span slot="prize" slot-scope="text, record">
										{{record.prize_name}}（{{record.complete_num || 0}}/{{record.prize_num}}）
									</span>
									<span slot="action" slot-scope="text, record, index">
										<div style="width: 150px;">
										<a-button @click="failure(record.id)" v-if="record.status == 2"
										          style="margin: 0 5px 5px 0" v-has="'fission-invalid'">使失效</a-button>
										<a-button @click="releaseActivity(record.id)" v-if="record.status == 1"
										          style="margin: 0 5px 5px 0" v-has="'fission-release'">发布</a-button>
										<a-button @click="edit(record.id)"
										          v-if="record.status == 1 || record.status == 2"
										          style="margin: 0 5px 5px 0" v-has="'fission-edit'">编辑</a-button>
											<!--										<a-button @click="detailActivity(record.id)"-->
											<!--										          style="margin: 0 5px 5px 0">详情</a-button>-->
										<a-button @click="participants(record.id,record.title)"
										          style="margin: 0 5px 5px 0" v-has="'fission-part'">参与者</a-button>
											<!--										<a-button @click="statistical(record.id)"-->
											<!--										          style="margin: 0 5px 5px 0">统计</a-button>-->
										<a-button @click="deleteActivity(record.id)"
										          style="margin: 0 5px 5px 0" v-has="'fission-del'"
										          v-if="record.status_str != '进行中'">删除</a-button>
										<a-button :data-url="record.qr_code" :data-name="record.title"
										          :data-id='"qrcode" + index'
										          @click="downLoadWay" class="actionBtn" v-if="record.status == 2"
										          v-has="'fission-down'">下载</a-button>
										</div>
									</span>
								</a-table>

								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'fission-list'">
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
	import {message} from "ant-design-vue";
	import MyIcon from "@/components/MyIcon.vue"
	import moment from 'moment';
	import QRCode from 'qrcodejs2'

	// 活动列表
	const columns = [
		{
			title      : "二维码",
			dataIndex  : "qr_code",
			key        : "qr_code",
			width      : "9%",
			scopedSlots: {customRender: "qr_code"}
		},
		{
			title      : "活动名称",
			dataIndex  : "title",
			key        : "title",
			scopedSlots: {customRender: "title2"}
		},
		{
			title      : "活动时间",
			dataIndex  : "time",
			key        : "time",
			scopedSlots: {customRender: "time"}
		},
		{
			title      : "奖品（剩余/总库存）",
			dataIndex  : "prize",
			key        : "prize",
			width      : "12%",
			scopedSlots: {customRender: "prize"}
		},
		{
			title    : "活动限制",
			dataIndex: "limit_str",
			width    : "10%",
			key      : "limit_str",
		},
		{
			title      : "引流成员",
			dataIndex  : "member_str",
			key        : "member_str",
			scopedSlots: {customRender: "member_str"}
		},
		{
			title      : "状态",
			dataIndex  : "status_str",
			key        : "status_str",
			scopedSlots: {customRender: "status_str"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "fissionList",
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
				corpLen     : JSON.parse(localStorage.getItem('corpArr')).length,
				//表格部分
				columns,
				//分页
				total       : 0, //总条数
				quickJumper : false, // 是否显示快速跳转的控件
				page        : 1, //页码
				page_size   : 15, //每页数据量，默认15
				pageSize    : 15, //每页数据条数
			};
		},

		methods: {
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
				this.$router.push('/fission/add')
			},
			// 获取表格内容
			async getActivityList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("fission/list", {
					uid       : localStorage.getItem('uid'),
					corp_id   : this.corpId,
					status    : this.status,
					title     : this.title,
					start_date: this.activityTime.length > 0 ? moment(this.activityTime[0]).format("YYYY-MM-DD") : "",
					end_date  : this.activityTime.length > 0 ? moment(this.activityTime[1]).format("YYYY-MM-DD") : "",
					page      : page,
					pageSize  : pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.activityList = res.data.fission;
					this.isLoading = false;
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
							that.qrcode(this.activityList[i].h5Url, i)
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
			// 使失效
			failure (id) {
				let that = this;
				that.$confirm({
					title     : "确定结束该活动？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 5)
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
						that.changeStatus(id, 2)
					}
				});
			},
			//删除
			deleteActivity (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该活动？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 0)
					}
				});
			},
			async changeStatus (id, status) {
				const {data: res} = await this.axios.post("fission/change-status", {
					uid   : localStorage.getItem("uid"),
					id    : id,
					status: status
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
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
				this.$router.push("/fission/add?id=" + id)
			},
			participants (fid, title) {
				let fid2 = encodeURIComponent(fid)
				let title2 = encodeURIComponent(title.replace(/%/g, '%25'))
				this.$router.push("/fission/participants?fid=" + fid2 + "&title=" + title2)
			},
			// 统计
			async statistical (id) {

			},
			// 分页
			changePage (page, pageSize) {
				this.getActivityList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,270)
				})
			},
			showSizeChange (page, pageSize) {
				this.getActivityList(1, pageSize);
			}
		},

		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.getActivityList()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/fission/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getActivityList(vm.page, vm.pageSize)
				});
			} else if ((from.path == '/fission/add' && typeof to.query.isRefresh == 'undefined') || from.path != '/fission/participants') {
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

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
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
</style>
