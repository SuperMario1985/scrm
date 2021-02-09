<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden">
				<a-layout
						style="position: absolute;top:0;bottom:0;right:0;left: 0;overflow-x: hidden; overflow-y: auto;"
						class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>抽奖引流</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">抽奖引流</div>
						<div class="content-msg"  style="box-shadow: 0px 1px 4px 0px #D7D7D7">
							<div style="margin: 10px 0 2px;">自动发送欢迎语，可能失败的原因
								<a-tooltip placement="bottom">
									<template slot="title">
										<p style="margin-bottom: 2px;font-size: 13px;">
											1、如果企业在企业微信后台为相关成员配置了可用的欢迎语，使用第三方系统配置欢迎语，均不起效，推送的还是企业微信官方的。</p>
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
								在使用派发红包功能前，需要商户完成以下配置：
							</p>
							<p style="margin-bottom: 2px;">
								1、前往<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
								       target="_blank">【微信支付商户平台】</a>注册微信支付商户号
							</p>
							<p style="margin-bottom: 2px;">
								2、登录<a href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu"
								       target="_blank">【企业微信后台】</a>开通企业支付，绑定已有商户号（<a
									href="https://support.qq.com/products/104790/faqs/66072" target="_blank">查看教程</a>）
							</p>
							<p style="margin-bottom: 2px;">
								3、登录<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
								       target="_blank">【微信支付商户平台】</a>开通【企业付款到零钱】（<a
									href="https://support.qq.com/products/104790/faqs/66076" target="_blank">查看教程</a>）
							</p>
							<p style="margin-bottom: 2px;">
								4、在本系统，进入【应用中心】--【企业支付】，点击，填入企业支付的应用ID和Secret
							</p>
							<p style="margin-bottom: 2px;">
								5、在本系统，进入【应用中心】--【企业支付】，点击，完成支付配置。（<a
									href="https://support.qq.com/products/104790/faqs/66058" target="_blank">查看教程</a>）
							</p>
						</div>
						<div class="content-hd">
							<div style="overflow: hidden;margin: 20px 0;">
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
									<a-select v-model="status" style="width: 120px" placeholder="活动状态" allowClear>
										<a-select-option value="1">未开始</a-select-option>
										<a-select-option value="2">进行中</a-select-option>
										<a-select-option value="3">已结束</a-select-option>
									</a-select>
									<a-input placeholder="搜索活动名称" @keyup.enter="find" v-model="title"
									         style="width: 174px;margin: 0px 10px;"/>
									<a-range-picker @change="changeTime" style="width:250px;" v-model="activityTime"/>
									<a-button type="primary" style="margin: 0px 10px;" @click="find">查找</a-button>
									<a-button @click="clear">清空</a-button>
								</a-col>
								<a-col style="float:right;" v-has="'raffle-add'">
									<a-button class="btn-primary" icon="plus" @click="addWelcomeText" type="primary">
										新建活动
									</a-button>
								</a-col>
							</div>
							<div style="margin-bottom: 20px;" v-if="raffleNum > 0" class="content-msg">当前套餐版本仅支持<span
									style="color: red;">单场活动</span>用户参与人数上限<span
									style="color: red;">{{raffleNum}}</span>人，达到上限后活动将自动结束。更多套餐信息可联系平台了解哦！
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="activityList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'raffle-list'">
									<span slot="qr_code" slot-scope="text, record,index">
										<div :id="'qrcode'+index" :ref="'qrcode' + index"></div>
									</span>
									<span slot="title2" slot-scope="text, record">
										<div style="width: 140px;">{{record.title}}</div>
									</span>
									<span slot="time" slot-scope="text, record">
										<div style="width: 125px;">{{record.start_time}}至</div>
										<div>{{record.end_time}}</div>
									</span>
									<span slot="user" slot-scope="text, record">
										<template v-for="user in record.user_key">
											<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'"
											       color="orange"
											       style="margin-top: 5px;">{{user.title}}</a-tag>
										</template>
										<template v-for="user in record.user_key">
											<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'"
											       color="blue"
											       style="margin-top: 5px;">{{user.title}}</a-tag>
										</template>
										<span v-if="record.user_key.length == 0">--</span>
									</span>
									<span slot="status_str" slot-scope="text, record">
										<div>{{record.status_str}}</div>
										<div v-if="record.status_str == '已结束'" style="width: 128px;">（{{record.reason_str}}）</div>
									</span>
									<span slot="content" slot-scope="text, record">
										<a-popover placement="left">
											<template slot="content">
												<div style="max-height: 500px; overflow-y: auto;">
										<div v-for="(item,index) in record.content">
											奖项{{index+1}}：{{item.name}}（{{item.last_num || 0}}/{{item.num}}）
										</div>
												</div>
											</template>
										<span style="color: #01b065;cursor: pointer;">预览</span>
										</a-popover>
									</span>
									<span slot="share_setting" slot-scope="text, record">
										<template v-if="record.is_share_open">
										分享成功后
										<div style="width: 90px;">增加{{text[0].total_num}}次机会</div>
										</template>
										<template v-if="!record.is_share_open">--</template>
									</span>
									<span slot="action" slot-scope="text, record,index">
										<div style="width: 150px;">
										<!-- 0 未开启 1 进行中 2 已结束-->
										<a-button @click="failure(record.id)" v-if="record.status == 1"
										          style="margin: 0 5px 5px 0" v-has="'raffle-invalid'">使失效</a-button>
										<a-button @click="releaseActivity(record.id)" v-if="record.status == 0"
										          style="margin: 0 5px 5px 0" v-has="'raffle-release'">发布</a-button>
										<a-button @click="edit(record.id)"
										          v-if="record.status == 0 || record.status == 1"
										          style="margin: 0 5px 5px 0" v-has="'raffle-edit'">编辑</a-button>
										<a-button @click="participants(record.id,record.title)"
										          style="margin: 0 5px 5px 0"
										          v-if="record.status == 0 || record.status == 1 || record.status == 2"
										          v-has="'raffle-part'">参与者</a-button>
										<a-button @click="deleteActivity(record.id)"
										          style="margin: 0 5px 5px 0"
										          v-if="record.status == 0 || record.status == 2" v-has="'raffle-del'">删除</a-button>
										<a-button :data-url="record.qr_code" :data-name="record.title"
										          @click="downLoadWay" class="actionBtn" v-if="record.status == 1"
										          :data-id='"qrcode" + index' v-has="'raffle-down'">下载</a-button>
											</div>
									</span>
								</a-table>

								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'raffle-list'">
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
			dataIndex  : "content",
			key        : "content",
			scopedSlots: {customRender: "content"}
		},
		{
			title      : "活动限制",
			dataIndex  : "share_setting",
			key        : "share_setting",
			width      : "10%",
			scopedSlots: {customRender: "share_setting"}
		},
		{
			title    : "参与人数",
			dataIndex: "part_num",
			key      : "part_num",
			width    : "8%",
		},
		{
			title      : "引流成员",
			dataIndex  : "user",
			key        : "user",
			width      : "10%",
			scopedSlots: {customRender: "user"}
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
			width      : '18%',
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "raffleList",
		components: {},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpLen     : JSON.parse(localStorage.getItem('corpArr')).length,
				corpInfo    : [], //企业微信列表
				suite_id    : 1,//应用ID
				corpId      : corpId,//企业微信选中的id
				status      : [], // 0全部 1未开始 2进行中 3已结束
				title       : '',// 输入框内容
				activityTime: null, // 时间
				date        : null,//传给后台的时间数组
				activityList: [],// 表格数组
				isLoading   : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				//分页
				total       : 0, //总条数
				quickJumper : false, // 是否显示快速跳转的控件
				page        : 1, //页码
				page_size   : 15, //每页数据量，默认15
				pageSize    : 15, //每页数据条数
				raffleNum   : Number(this.$store.state.packageDetail.raffleNum),//抽奖引流人数上限数
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
			changeTime (date, dateString) {
				if (date.length == 0) {
					this.date = null
				} else {
					this.date = dateString
				}
			},
			// 点击搜索
			find () {
				this.getActivityList()
			},
			// 点击清空
			clear () {
				this.status = []
				this.title = ''
				this.activityTime = null
				this.date = null
				this.page = 1
				this.pageSize = 15
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
				this.getActivityList()
			},
			// 新建标签
			addWelcomeText () {
				this.$router.push('/raffle/add')
			},
			// 获取表格内容
			async getActivityList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("awards-activity/list", {
					uid     : localStorage.getItem('uid'),
					corp_id : this.corpId,
					status  : this.status,
					title   : this.title,
					date    : this.date,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.activityList = res.data.info;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					let that = this
					that.$nextTick(x => {
						that.activityList.map((x, index) => {
							document.getElementById('qrcode' + index).innerHTML = ""
						})
						that.activityList.map((x, index) => {
							that.qrcode(x.qr_code, index);
						})
					})
				}
			},
			qrcode (url, index) {
				let qrcode = new QRCode('qrcode' + index, {
					width     : 100,
					height    : 100,
					text      : url, // 二维码地址
					colorDark : "#000",
					colorLight: "#FFF",
				})
			},

			// 使失效
			failure (id, status) {
				let that = this;
				that.$confirm({
					title     : "确定结束该活动？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.changeStatus(id, 2)
					}
				});
			},
			async changeStatus (id, status) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("awards-activity/update-award-status", {
					id    : id,
					status: status
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.getActivityList(this.page, this.pageSize)
				}
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
						that.changeStatus(id, 1)
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
						that.delete(id, 0)
					}
				});
			},
			async delete (id) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("awards-activity/delete", {
					id: id,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					//删除判断最后一页是否只有一条
					if (this.activityList.length == 1 && this.page > 1) {
						this.getActivityList(this.page - 1, this.pageSize)
					} else {
						this.getActivityList(this.page, this.pageSize)
					}
				}
			},
			// 编辑
			edit (id) {
				this.$router.push("/raffle/add?id=" + id)
			},
			//参与者
			participants (fid, title) {
				let fid2 = encodeURIComponent(fid)
				let title2 = encodeURIComponent(title.replace(/%/g, '%25'))
				this.$store.commit('changeRaffleParticipantsTabKey', '1');
				this.$router.push("/raffle/participants?fid=" + fid2 + "&title=" + title2)
			},
			//下载
			downLoadWay (e) {
				let that = this
				let image = new Image()
				image.setAttribute('crossOrigin', 'anonymous')
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
			// 分页
			changePage (page, pageSize) {
				this.getActivityList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 230)
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
			if (from.path == '/raffle/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getActivityList(vm.page, vm.pageSize)
				});
			} else if ((from.path == '/raffle/add' && typeof to.query.isRefresh == 'undefined') || from.path != '/raffle/participants') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.status = []
					vm.title = ''
					vm.activityTime = null
					vm.date = null
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
		/*height: 60px;*/
		width: 100%;
		min-width: 885px;
		/*line-height: 60px;*/
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
