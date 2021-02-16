<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden;">
				<a-layout
						style="position: absolute; top:0; bottom:0; right:0;left: 0; overflow-x: hidden; overflow-y: auto;"
						class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>欢迎语</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">欢迎语</div>
						<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
							<p style="margin-bottom: 2px;">1、欢迎语又称新好友自动回复，此处可添加文字、图片、图文链接及小程序，客户来了不用担心冷场！</p>
							<p style="margin-bottom: 2px;">
								2、每个企业成员均可以拥有不同的欢迎语。当通用的欢迎语和个人专属的欢迎语并存的情况下，优先自动回复个人专属的欢迎语。</p>
							<p style="margin-bottom: 0px;">
								3、<span style="color: #F56C6C">如果在企业微信后台为相关成员配置了可用的欢迎语，第三方系统配置欢迎语则不会推送，优先推送企业微信官方的。</span>
							</p>
						</div>
						<div class="content-hd">
							<!--							<a-col style="float:left;">-->
							<!--								<a-input placeholder="搜索欢迎语" v-model="welcomeText"-->
							<!--								         style="width: 174px;margin-right:15px;"/>-->
							<!--								<a-button type="primary" style="margin-right:15px;" @click="find">查询</a-button>-->
							<!--								<a-button @click="clear">重置</a-button>-->
							<!--							</a-col>-->
							<a-col v-if="corpInfo.length > 1" style="float:left;">
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 200px;"
										@change="handleChange"
										v-model="corpId"
								>
									<template v-for="item in corpInfo">
										<a-select-option :value="item.corpid">
											{{item.corp_full_name || item.corp_name}}
										</a-select-option>
									</template>
								</a-select>
							</a-col>
							<a-col style="float:right;">
								<a-button class="btn-primary"@click="addWelcomeText()" type="primary"
								          v-has="'welcome-add'">
									新建欢迎语
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="welcomeList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'welcome-list'">
									<span slot="content" slot-scope="text, record, index">
<!--                  <a href="javascript:;" @click="handleShowDetail(record.id)">详情</a>-->
										<div v-if="record.text_content">
											<span style="display: inline-block;vertical-align: top;">文本：</span>
											<a-popover>
											    <template slot="content">
											      <p v-html="record.text_content.replace(/{nickname}/g,'&nbsp;<span contenteditable=\'false\' class=\'ant-tag ant-tag-orange\'>客户名称</span>&nbsp;').replace(/\n/g, '<br>')"
											         style="max-width: 500px;word-break:break-all;word-wrapL:break-word;"></p>
											    </template>
											    <span v-html="record.text_content.replace(/{nickname}/g,'&nbsp;<span contenteditable=\'false\' class=\'ant-tag ant-tag-orange\'>客户名称</span>&nbsp;').replace(/\n/g, '<br>')"
											          style="text-overflow: -o-ellipsis-lastline;overflow: hidden;text-overflow: ellipsis;display: inline-block; -webkit-line-clamp: 2;line-clamp: 2;-webkit-box-orient: vertical;width: 235px;">
												</span>
											</a-popover>
										</div>
										<template v-if="record.add_type == 1">
											<div style="margin-top: 10px;">图片：
											<img :src="commonUrl+record.image_url" alt=""
											     style="width: 105px;object-fit: cover;"></div>
										</template>
										<template v-if="record.add_type == 2">
											<div style="margin-top: 10px;">
												<span style="vertical-align: top;line-height: 121px;">链接：</span>
												<div style="width: 235px;border: 1px solid #E5E5E5;padding: 10px;display: inline-block;">
												<p class="url-title" style="font-size: 14px;">{{record.link_title}}</p>
												<div style="overflow: hidden;">
													<div class="url-text"
													     style="font-size: 12px;">{{record.link_desc}}</div>
													<img :src="commonUrl+record.link_pic_url" style="object-fit: cover;"
													     alt="" class="url-img">
												</div>
											</div>
											</div>
										</template>
										<template v-if="record.add_type == 3">
											<div style="margin-top: 10px;">
												<span style="vertical-align: top;">小程序：</span>
												<div style="width: calc(100% - 60px);display: inline-block;">
													<MyIcon type="icon-miniapp"></MyIcon>
													<span>{{record.mini_title}}</span>
												</div>
											</div>
										</template>
                </span>
									<span slot="users" slot-scope="text, record, index">
										<a-tag v-if="record.type == 1">{{record.users}}</a-tag>
										<template v-if="record.type == 2">
											<a-tag v-for="item in record.users" color="orange"
											       style="margin-bottom: 5px;">{{item}}</a-tag>
										</template>
                </span>
									<span slot="action" slot-scope="text, record">
				<a-button @click="editList(record.id)" style="margin: 0 5px 5px 0" v-has="'welcome-edit'">编辑</a-button>
				<a-button @click="deleteList(record.id)" v-has="'welcome-delete'">删除</a-button>
			</span>
								</a-table>

								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'welcome-list'">
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
								<!-- 详情页面 -->
								<a-drawer placement="right" :closable="false" @close="onClose" :visible="visible">
									<a-tabs defaultActiveKey="1">
										<a-tab-pane tab="消息内容" key="1">
											<div class="msg_content">
												<img src="../../../assets/wxHeader.png" alt=""
												     class="msg_content_header">
												<div style="padding: 20px 15px;">
													<!--文本-->
													<div v-if="text" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<span class="item-info msg_content_txt">{{text}}</span>
													</div>
													<!--图片-->
													<div v-if="add_type == 1" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<img :src="commonUrl+img" alt
														     style="width: 150px;border-radius: 4px;"/>
													</div>
													<!--网址-->
													<div v-if="add_type == 2" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<div class="item-info msg_content_txt2">
															<p class="url-title">{{inputTitle}}</p>
															<div style="overflow: hidden;">
																<div class="url-text">{{digest}}</div>
																<img :src="commonUrl+msgUrl" alt="" class="url-img">
															</div>
														</div>
													</div>
													<!--小程序-->
													<div v-if="add_type == 3" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<div class="item-info msg_content_txt2">
															<p class="url-title" style="color: #A3A3A3;">
																{{appletInputTitle}}</p>
															<p class="applet-title">{{appletInputTitle}}</p>
															<img :src="commonUrl+appletUrl" alt="" style="width: 100%;">
														</div>
													</div>
												</div>
											</div>
										</a-tab-pane>
									</a-tabs>
								</a-drawer>
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

	const columns = [
		{
			title    : "欢迎语类型",
			dataIndex: "wel_type",
			key      : "wel_type"
		},
		{
			title      : "欢迎语内容",
			dataIndex  : "content",
			key        : "content",
			width      : '350px',
			scopedSlots: {customRender: "content"}
		},
		{
			title      : "适用成员",
			dataIndex  : "users",
			key        : "users",
			width      : "20%",
			scopedSlots: {customRender: "users"}
		},
		{
			title    : "创建时间",
			dataIndex: "time",
			key      : "time",
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : "20%",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "welcomeList",
		components: {MyIcon},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpInfo        : [], // 企业微信列表
				suite_id        : 1,//应用ID
				corpId          : corpId,//企业微信选中的id
				welcomeText     : '',//搜索欢迎语输入框内容
				welcomeList     : [],//欢迎语表格数组
				isLoading       : true, //Loading 组件显示与隐藏
				hasAll          : 0,//有没有设置过全体成员的，0没有，1有
				//表格部分
				columns,
				//分页
				total           : 0, //总条数
				quickJumper     : false, // 是否显示快速跳转的控件
				page            : 1, //页码
				page_size       : 15, //每页数据量，默认15
				pageSize        : 15, //每页数据条数
				visible         : false,//详情页面的显示与隐藏
				add_type        : 0,//详情类型，1图片2网页3小程序0都没有
				text            : '',//详情抽屉，文本内容
				img             : '',//详情抽屉，图片类型，图片链接
				inputTitle      : '',//详情抽屉，网址类型，标题
				digest          : '',//详情抽屉，网址类型，描述
				msgUrl          : '',//详情抽屉，网址类型，图片链接
				appletInputTitle: '',//详情抽屉，小程序类型，标题
				appletUrl       : '',//详情抽屉，小程序类型，图片链接
				commonUrl       : this.$store.state.commonUrl, //公共的链接
			};
		},

		methods: {
			handleChange (value) {
				this.corpInfo.map((x) => {
					if (value == x.corpid) {
						this.$store.commit("changeCorpAuthType", x.auth_type)
						this.$store.commit("changeCorpName", x.corp_name)
					}
				})
				this.$store.commit("changeCorpId", value)
				this.isTabLoading = true

				this.getWelcomeList()
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			handleWxId (value) {
				this.isLoading = true
				this.corpId = value
				this.getWelcomeList()
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//点击搜索
			find () {
				this.isLoading = true
				this.getWelcomeList()
			},
			//点击清空
			clear () {
				this.isLoading = true
				location.reload();
			},
			// 新建标签
			addWelcomeText () {
				this.$router.push('/welcome/add?hasAll='+this.hasAll)
			},
			//获取表格内容
			async getWelcomeList (page = 1, pageSize = this.pageSize) {
				const {data: res} = await this.axios.post("work-welcome/list", {
					suite_id: this.suite_id,
					corp_id : this.corpId,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.welcomeList = res.data.info;
					this.hasAll = res.data.hasAll
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			//详情
			handleShowDetail (id) {
				this.visible = true;
				this.detail(id)
			},
			async detail (id) {
				const {data: res} = await this.axios.post("work-welcome/detail", {
					id: id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.add_type = res.data.add_type
					this.text = res.data.text_content
					if (this.add_type == 1) {
						this.img = res.data.image_url
					} else if (this.add_type == 2) {
						this.msgUrl = res.data.link_pic_url
						this.inputTitle = res.data.link_title
						this.digest = res.data.link_desc
					} else if (this.add_type == 3) {
						this.appletInputTitle = res.data.mini_title
						this.appletUrl = res.data.mini_pic_url
					}
				}
			},
			onClose () {
				this.visible = false;
			},
			//编辑
			editList (id) {
				this.$router.push({path: "/welcome/add", query: {id: id}});
			},
			//删除
			deleteList (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该欢迎语?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.delWelcome(id);
					}
				});
			},
			async delWelcome (id) {
				const {data: res} = await this.axios.post("work-welcome/delete", {
					id: id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					if (this.page > 1 && this.welcomeList.length == 1) {
						this.getWelcomeList(this.page - 1, this.pageSize)
					} else {
						this.getWelcomeList(this.page, this.pageSize)
					}

				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getWelcomeList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 110)
				})
			},
			showSizeChange (page, pageSize) {
				this.getWelcomeList(1, pageSize);
			}
		},

		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.$emit('changeCorpId', this.corpId)

				this.getWelcomeList()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/welcome/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getWelcomeList(vm.page, vm.pageSize)
				});
			} else {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.page = 1
					vm.page_size = 15
					vm.pageSize = 15
					vm.getWelcomeList()
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
		/*width: 145px;*/
		/*height: 30px;*/
		margin-left: 20px;
		/*text-align: left;*/
		/*padding: 0;*/

		/*span {*/
		/*	display: inline-block;*/
		/*	width: 90px;*/
		/*	height: 30px;*/
		/*	line-height: 30px;*/
		/*	text-align: center;*/
		/*}*/
	}

	.tag-name {
		padding: 6px 14px;
		height: 34px;
		font-size: 13px;
		border: 1px solid #D9D9D9;
		background-color: transparent !important;
		color: rgba(0, 0, 0, 0.65);
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.msg_content {
		border: 1px solid #E2D6D6;
		height: 100%;
		width: 420px;
		margin: auto;
		overflow-y: auto;

		.msg_content_header {
			width: 100%;
		}
	}

	.msg_content_txt {
		float: right;
		width: 340px;
		border: 1px solid #E9E9E9;
		line-height: 21px;
		padding: 15px;
		overflow-wrap: break-word;
		hyphens: auto;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	.msg_content_txt2 {
		width: calc(100% - 46px);
		border: 1px solid #E9E9E9;
		padding: 10px 16px;
		border-radius: 4px;
		font-size: 14px;
		color: #1A1A1A;
		background: #FFF;
		float: left;
		word-break: break-word;
	}

	.url-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 18px;
	}

	.url-text {
		float: left;
		max-width: calc(100% - 74px);
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		color: #A3A3A3;
	}

	.url-img {
		float: right;
		width: 64px;
		height: 64px;
	}

	.applet-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}

</style>
