<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden;">
				<!-- 左侧 -->
				<a-layout-sider v-if="wxLen > 1">
					<!-- 公众号 -->
					<div class="sider-one">
						<div class="sider-one-txt">选择公众号</div>
						<a-select showSearch optionFilterProp="children" style="width: 200px;margin-bottom: 20px;"
						          @change="handleChange" v-model="changeBackground" v-if="wxInfo[0]">
							<template v-for="item in wxInfo">
								<a-select-option :value="item.wx_id">{{item.nick_name}}</a-select-option>
							</template>
						</a-select>
						<div class="wx-info" ref="wxInfo" style="" @mousemove="wxInfoMouseOver"
						     @mouseout="wxInfoMouseOut">
							<template v-for="(item,index) in wxInfo">
								<div @click="selectWx(item.wx_id,item.authorizer_type,item.nick_name,item.verify_type,item.service_type)"
								     class="selectWx"
								     :class="{ active:changeBackground == item.wx_id}">
									<a-avatar :src="item.head_img" shape="square"/>
									<span style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;float: right;width: calc(100% - 35px);">{{item.nick_name}}</span>
								</div>
							</template>
						</div>
					</div>
				</a-layout-sider>
				<a-layout style="position: absolute; top:0; bottom:0; right:0; overflow-x: hidden; overflow-y: auto;"
				          :style="wxLen > 1 ? {left: '250px'} : {left: '0px'}"
				          class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>
						<label class="template-title">模板消息</label>
						<span style="vertical-align: top;font-size: 14px;margin: 0 10px;">仅认证服务号可用</span> -->
						<!-- <div class="help"
						     :class="showTransition == 0 ?'help-transition': (showTransition== 1 ? 'help-transition1' : '')">
							<a href="https://support.qq.com/products/104790/faqs/57477"
							   target="_blank">
								<a-icon type="question-circle" class="help-icon"/>
								<span style="float:right;">点我帮助</span>
							</a>
						</div> -->

					<!-- </a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333;text-align:left">
							模板消息
							<span style="margin-left: 10px;font-size:14px;color:#686868;">仅认证服务号可用</span>
						</div>
						<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
							<p style="margin-bottom: 2px;">
								1、不同行业可以使用的模板不一样，根据在微信公众号后台设置的行业，会默认对应可用的模板消息，也可以在公众平台后台提交新的模板，通过审核之后即可使用。</p>
							<p style="margin-bottom: 2px;">
								2、模板消息可以随时对粉丝推送消息，可跳转链接，但请控制群发频次，≤3次即可。也请勿发送广告等营销类消息以及其它所有可能对用户造成骚扰的消息，避免影响公众号使用（
								<a href="https://support.qq.com/products/104790/faqs/57057"
								   target="_blank">查看模版消息注意事项</a>）。
							</p>
							<p style="margin-bottom: 0px;">
								3、在微信公众平台将模板ID删除后，在新建模板消息时，会重新请求微信最新模板ID数据。若模板消息已处于发送中时将模板ID删除，则尚未发送完的粉丝就接收不到了。</p>
						</div>

						<div class="content-hd">
							<a-col style="float:left;">
								<a-select showSearch optionFilterProp="children" allowClear
								          style="width: 174px;margin-right: 15px;" :value="titleIndex"
								          @change="changeMsgTitle" placeholder="请选择消息名称" :filterOption="filterOption">
									<template v-for="(item,index) in dataSource">
										<a-select-option :value="index">{{item}}</a-select-option>
									</template>
								</a-select>
								<a-select style="width: 174px;margin-right:15px;"
								          @change="changeStatus" v-model="status">
									<a-select-option value="0">全部状态</a-select-option>
									<a-select-option value="1">未发送</a-select-option>
									<a-select-option value="4">发送中</a-select-option>
									<a-select-option value="2">已发送</a-select-option>
									<a-select-option value="3">发送失败</a-select-option>
								</a-select>
								<a-date-picker @change="changeDate" style="margin-right: 15px;" v-model="date"/>
								<a-button type="primary" style="margin-right:15px;" @click="find">查询</a-button>
								<a-button @click="clear">重置</a-button>
							</a-col>
							<a-col style="float:right;">
								<a-button type="primary"style="width: 150px;font-size:14px;" @click="add"
								          v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
								          v-has="'template-add'">新建模板消息
								</a-button>
								<a-button type="primary"style="width: 150px;font-size:14px;"
								          @click="showConfirmWx" v-if="$store.state.authorizer_type == 'unauthorized'"
								          v-has="'template-add'">
									新建模板消息
								</a-button>
								<a-button type="primary"style="width: 150px;font-size:14px;"
								          @click="showVerify"
								          v-if="$store.state.authorizer_type != 'unauthorized' && !verify_service"
								          v-has="'template-add'">
									新建模板消息
								</a-button>
							</a-col>
						</div>
						<!--选择公众号弹窗-->
						<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="template-add"></wxModal>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="templateList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'template-list'">
                  <span slot="status" slot-scope="text, record">
                    <a-tooltip>
                      <template slot="title">{{record.error_msg}}</template>
                      <span style="color: red;" v-if="record.status=='发送失败'">{{record.status}}</span>
                    </a-tooltip>
                    <span v-if="record.status!='发送失败'">{{record.status}}</span>
                  </span>
									<span slot="action" slot-scope="text, record,index">
                    <template v-if="record.status=='未发送'">
                      <a-button style="margin-right: 5px;margin-bottom: 5px;" @click="edit(record.id)"
                                v-if="$store.state.authorizer_type != 'unauthorized'"
                                v-has="'template-edit'">修改</a-button>
                      <a-button style="margin-right: 5px;margin-bottom: 5px;" @click="showConfirmWx"
                                v-if="$store.state.authorizer_type == 'unauthorized'"
                                v-has="'template-edit'">修改</a-button>
                      <a-button style="margin-right: 5px;margin-bottom: 5px;" @click="detail(record.id,record.tpl_id)"
                                v-has="'template-info'">详情</a-button>
                      <a-button @click="deleteList(record.id)"
                                v-if="$store.state.authorizer_type != 'unauthorized'"
                                v-has="'template-delete'">删除</a-button>
                      <a-button @click="showConfirmWx"
                                v-if="$store.state.authorizer_type == 'unauthorized'"
                                v-has="'template-delete'">删除</a-button>
                    </template>
                    <template v-if="record.status=='已发送'">
                      <a-button style="margin-right: 5px;margin-bottom: 5px;" @click="detail(record.id,record.tpl_id)"
                                v-has="'template-info'">详情</a-button>
                    </template>
                    <template v-if="record.status=='发送中'">
                      <a-button style="margin-right: 5px;margin-bottom: 5px;" @click="detail(record.id,record.tpl_id)"
                                v-has="'template-info'">详情</a-button>
                    </template>
                    <template v-if="record.status=='发送失败'">
                      <a-button style="margin-right: 5px;margin-bottom: 5px;" @click="detail(record.id,record.tpl_id)"
                                v-has="'template-info'">详情</a-button>
                      <a-button @click="deleteList(record.id)"
                                v-if="$store.state.authorizer_type != 'unauthorized'"
                                v-has="'template-delete'">删除</a-button>
                      <a-button @click="showConfirmWx"
                                v-if="$store.state.authorizer_type == 'unauthorized'"
                                v-has="'template-delete'">删除</a-button>
                    </template>
                  </span>
								</a-table>
								<!-- 分页 -->
								<div style="width: 100%;position: absolute;margin-top: 20px;margin-bottom: 20px"
								     v-show="total > 0" v-has="'template-list'">
									<div style="height: 32px;float: left;line-height: 32px;">
										共有
										<span style="color: blue">{{total}}</span>条消息
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
								<template>
									<a-drawer class="detail-drawer" placement="right" :mask="true" :closable="false"
									          @close="onClose" :visible="visible">
										<a-tabs defaultActiveKey="1">
											<a-tab-pane tab="消息内容" key="1">
												<div class="msg_content">
													<img src="../../../assets/wxHeader.png" alt
													     class="msg_content_header"/>
													<div class="msg_content_body">
														<h3>{{templateData.title}}</h3>
														<div v-for="(item,index) in templateData.data"
														     style="margin: 5px 0;">
														<span v-show="item.type == 1 || item.type == 3"
														      :style="{color: item.start.color}">{{item.start.value}}</span>
															<span v-show="item.type == 2 || item.type == 3"
															      :style="{color: item.end.color}">{{item.end.value}}</span>
															<span>{{item.title}}</span>
															<span class="item-info" v-html="textAreaValue[index]"
															      :style="{color: fc(index)}"></span>
														</div>
													</div>
												</div>
											</a-tab-pane>
										</a-tabs>
									</a-drawer>
								</template>
							</a-spin>
						</div>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import wxModal from "@/components/WxModal.vue";

	const columns = [
		{
			title    : "消息名称",
			dataIndex: "msg_title",
			key      : "msg_title",
			width    : "180px"
		},
		{
			title    : "发送对象",
			dataIndex: "send_people",
			key      : "send_people"
		},
		{
			title    : "模板",
			dataIndex: "tpl_name",
			key      : "tpl_name"
		},
		{
			title    : "发送时间",
			dataIndex: "push_time",
			key      : "push_time"
		},
		{
			title    : "预计发送人数",
			dataIndex: "will_fans_num",
			key      : "will_fans_num"
		},
		{
			title    : "实际发送人数",
			dataIndex: "fans_num",
			key      : "fans_num"
		},
		{
			title      : "发送状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			width      : "18%",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "templateList",
		components: {
			wxModal
		},
		data () {
			let changeBackground =
				localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				showTransition  : 1,
				isLoading       : false, //Loading 组件显示与隐藏
				wxLen           : JSON.parse(localStorage.getItem('wxArr')).length,
				wxInfo          : [], //微信公众号列表
				changeBackground: changeBackground, //选中背景色
				status          : '0', //状态,0全部 1未发送 2已发送 3发送失败
				push_time       : "", //发送日期
				//表格部分
				columns,
				templateList    : [], //模板消息列表
				visible         : false, //详情抽屉的显示与隐藏
				dataSource      : [], //消息名称数组
				showModal2      : false, //公众号组件弹窗显示与隐藏
				wxNum           : changeBackground, //传递给新建高级群发页面的微信id值
				//分页
				page            : 1, //页数
				pageSize        : 15, //每页个数
				total           : 0, //总条数
				quickJumper     : false, // 是否显示快速跳转的控件
				templateData    : [], //模板账户名等内容
				detailList      : [{color: '#FF0000', value: ''}, {color: '#FF0000', value: ''}],//详情内容
				color1          : '#333',//模板为积分提醒时积分前的字段颜色
				color2          : '#333',//模板为积分提醒时余额前的字段颜色
				textAreaValue   : [], //模板展示的内容
				verify_service  : false,//判断选中的公众号是否是已认证服务号
				title           : '',
				titleIndex      : [],
				date            : null,
			};
		},

		methods: {
			initHelp () {
				let that = this
				setInterval(function () {
					that.showTransition = (that.showTransition + 1) % 5;
				}, 1000)
			},
			wxInfoMouseOver () {
				this.$refs.wxInfo.style.overflowY = "auto";
			},
			wxInfoMouseOut () {
				this.$refs.wxInfo.style.overflowY = "hidden";
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 公众号
			handleChange (value) {
				this.verify_service = false
				this.wxInfo.map((x) => {
					if (value == x.wx_id) {
						this.$store.commit("changeAuthorizerType", x.authorizer_type);
						this.$store.commit("changeWxNickName", x.nick_name);
						if (x.verify_type == '已认证' && x.service_type == 2) {
							this.verify_service = true
						}
					}
				})
				this.$store.dispatch("changeWxNum", value);
				this.isLoading = true;
				this.changeBackground = value;
				this.wxNum = value;
				this.getTemplates();
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			selectWx (id, authorizer_type, nick_name, verify_type, service_type) {
				this.verify_service = false
				this.$store.dispatch("changeWxNum", id);
				this.isLoading = true;
				this.changeBackground = id;
				this.wxNum = id;
				if (verify_type == '已认证' && service_type == 2) {
					this.verify_service = true
				}
				this.$store.commit("changeAuthorizerType", authorizer_type);
				this.$store.commit("changeWxNickName", nick_name);
				this.getTemplates();
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			showConfirmWx () {
				this.$success({
					title: this.$store.state.wxNickName + '已取消授权，无法操作',
				});
			},
			showVerify () {
				this.$success({
					title: '仅针对认证的服务号开放使用',
				});
			},
			//选择状态
			changeStatus (value) {
				this.status = value;
			},
			//选择日期
			changeDate (date, dateString) {
				this.push_time = dateString;
			},
			//选择消息名称
			changeMsgTitle (value) {
				this.title = this.dataSource[value];
				this.titleIndex = value
			},
			filterOption (input, option) {
				return (
					option.componentOptions.children[0].text
						.toLowerCase()
						.indexOf(input.toLowerCase()) >= 0
				);
			},
			//点击搜索
			find () {
				this.isLoading = true;
				this.getTemplates();
			},
			//点击清空
			clear () {
				this.isLoading = true;
				location.reload();
			},
			//获取模板消息列表
			async getTemplates (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				this.wxInfo = this.$store.state.wxArr;
				const {data: res} = await this.axios.post(
					"template-push-msg/get-all-template-msg",
					{
						wx_id:localStorage.getItem('wxNum'),
						page    : page,
						status  : this.status,
						pageSize: pageSize,
						date    : this.push_time,
						title   : this.title
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.templateList = res.data.info;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
				// console.log(this.templateList)
			},
			//修改
			edit (id) {
				// console.log("修改", id);
				this.$router.push({path: "/template/add", query: {id: id}});
			},
			//详情
			detail (id, tpl_id) {
				this.visible = true;
				this.textAreaValue = []
				this.getDetailContent(id, tpl_id)
			},
			onClose () {
				this.visible = false;
			},
			fc (index) {
				if (this.detailList[index]) {
					return this.detailList[index].color
				} else {
					return '#FF0000'
				}
				// return this.detailList[index] == 'undefined' ? '#FF0000' : this.detailList[index].color
			},
			//获取模板账户名等内容
			async getTemplateContent (tpl_id) {
				const {data: res} = await this.axios.post(
					"template/get-template-content",
					{
						id: tpl_id,
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.templateData = res.data;
					// console.log(this.template_data);
					// console.log(this.textAreaValue);
				}
			},
			//获取详情内容
			async getDetailContent (id, tpl_id) {
				const {data: res} = await this.axios.post(
					"template-push-msg/preview",
					{
						id: id,
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.detailList = res.data.info;

					for (var i = 0; i < this.detailList.length; i++) {
						if (this.detailList[i].value) {
							this.detailList[i].value = this.detailList[i].value.replace(/{nickname}/g, '&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;').replace(/\n/g, "<br/>")
						}
						this.textAreaValue.push(this.detailList[i].value)
					}
					this.getTemplateContent(tpl_id)
					// console.log(this.textAreaValue)
				}
			},
			//删除
			deleteList (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除模板消息?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.deleteTemplate(id);
					}
				});
			},
			async deleteTemplate (id) {
				const {data: res} = await this.axios.post(
					"template-push-msg/delete-template-message",
					{
						id: id
					}
				);
				// console.log(res)
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false
					if(this.templateList.length == 1) {
						this.getTemplates(this.page - 1, this.pageSize)
					} else {
						this.getTemplates(this.page, this.pageSize)
					}
				}
			},
			//新建模板消息
			add () {
				if (this.wxInfo.length > 1) {
					this.showModal2 = true;
				} else {
					this.$router.push("/template/add");
				}
			},
			modalVisibleChange (event, wxNum) {
				// console.log('event', event);
				if (event == "ok") {
					this.showModal2 = false;
					this.$store.dispatch("changeWxNum", wxNum);
					this.$router.push("/template/add");
				} else {
					this.showModal2 = false;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getTemplates(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,110)
				})
			},
			showSizeChange (page, pageSize) {
				this.getTemplates(1, pageSize);
			},
			async getTitles () {
				const {data: res} = await this.axios.post(
					"template-push-msg/get-title",
					{
						wx_id:localStorage.getItem('wxNum'),
					}
				);
				// console.log(res)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.dataSource = res.data
				}
			}
		},

		created () {
			this.$store.dispatch("getWx", info => {
				this.wxInfo = info;
				if (!this.changeBackground && this.wxInfo.length > 0) {
					this.changeBackground = this.$store.state.wxNum;
					this.wxNum = this.$store.state.wxNum;
				}
				this.wxInfo.map((x) => {
					if (x.wx_id == this.changeBackground) {
						if (x.verify_type == '已认证' && x.service_type == 2) {
							this.verify_service = true
						}
					}
				})
			});
			this.getTemplates();
			this.getTitles()
		},
		mounted () {
			this.initHelp()
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/template/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getTemplates(vm.page,vm.pageSize)
				});
			} else if (from.path == '/template/add' && typeof to.query.isRefresh == 'undefined') {
				next(vm => {
					// 因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.status = "0"
					vm.title = ''
					vm.titleIndex = []
					vm.date = null
					vm.page = 1
					vm.pageSize = 15
					vm.push_time = ''
					vm.getTemplates()
				});
			}

			next()
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.item-info,
	.content-editable {
		/deep/ p {
			margin: 0;
			display: inline-block;
		}
	}

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

	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 55px;
		padding: 0 10px;
		margin: 10px 5px;
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

	/deep/ .detail-drawer .ant-drawer-mask {
		background-color: rgba(0, 0, 0, 0.65) !important;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.sider-one {
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.selectWx {
		width: 200px;
		margin-left: 20px;
		/*margin: auto;*/
		height: 50px;
		line-height: 50px;
		cursor: pointer;
		padding-left: 10px;
	}

	.active {
		background: #01b065;
		color: white;
	}

	/deep/ .ant-tabs-bar {
		padding: 0 20px !important;
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

		.msg_content_body {
			background: #FFFFFF;
			border: 1px solid #E9E9E9;
			border-radius: 4px;
			margin: auto;
			padding: 16px 13px;
			font-size: 14px;
			color: #333333;
			line-height: 24px;
			margin: 20px;
		}
	}

	.msg_content_txt {
		float: right;
		width: 340px;
		border: 1px solid #E2D6D6;
		line-height: 50px;
		padding: 0 15px;
		overflow-wrap: break-word;
		hyphens: auto;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.wx-info {
		width: 100%;
		position: absolute;
		left: 0;
		top: 100px;
		bottom: 0;
		overflow: hidden;
	}

	.wx-info::-webkit-scrollbar {
		width: 2px;
		height: 100%;
	}

	.wx-info::-webkit-scrollbar-track-piece {
		background-color: #FFFFFF;
	}

	.wx-info::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #FFFFFF;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
		text-align: left;
	}

	.content-msg a:link {
		/*color: #01b065;*/
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.content-msg a:visited {
		/*color: #01b065;*/
		text-decoration: none;
	}

	.template-title {
		/*float: left;*/
		font-size: 16px;
		vertical-align: top;
	}

	.help {
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