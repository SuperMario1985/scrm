<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<a-card style="padding:0 20px;line-height: 50px;border-bottom: 1px solid #E2E2E2;height: 50px;min-width: 760px;width: 100%;">
				<label class="tpl-title">短信群发</label>
			</a-card>
			<div class="content-msg">
				<p>1、短信提交成功后，即扣除短信数量</p>
				<p>2、若最终发送不成功，将在发送失败后1个小时内补回失败的短信数量</p>
			</div>
			<div style="margin:0 20px;margin-bottom:20px;">
				<div style="width:49%;float: left;background:#FFF;height:150px;">
					<div style="margin:0 auto;width:90%;text-align: center">
						<p style="padding-top:20px;">短信剩余数量</p>
						<p style="font-size: 18px;font-weight: 700;">{{restNum}}条</p>
						<a-button type="primary" @click="pushOrder" v-has="'sending-recharge'">去充值</a-button>
					</div>
				</div>
				<div style="width:49%;float: right;background:#FFF;height:150px;">
					<div style="margin:0 auto;width:90%;text-align: center">
						<p style="padding-top:20px;">累计短信数量</p>
						<p style="font-size: 18px;font-weight: 700;">{{consume}}条</p>
						<a-button @click="pushDetail()" v-has="'sending-all-look'">发送记录</a-button>
					</div>
				</div>
				<div style="clear:both;height:0;font-size:1px;line-height:0px;"></div>
			</div>
			<div style="margin:0 20px;background:#FFF;padding-bottom:20px;">
				<a-row style="padding:30px 20px;">
					<a-col style="float:left;">
						<a-select
								v-model="status"
								style="width: 150px;margin-right:15px;"
								@change="handleChangeStatus"
						>
							<a-select-option value="-1">全部状态</a-select-option>
							<a-select-option value="0">未发送</a-select-option>
							<a-select-option value="1">已发送</a-select-option>
							<a-select-option value="2">发送失败</a-select-option>
							<a-select-option value="3">发送中</a-select-option>
						</a-select>
						<a-button type="primary" style="margin-right:15px;" @click="find">查询</a-button>
						<a-button style="margin-right:15px;" @click="clear">重置</a-button>
					</a-col>
					<a-button type="primary" style="float:right;margin-right:15px;" @click="addPush"v-has="'sending-add'">
						新建短信发送
					</a-button>
				</a-row>

				<!-- 表格部分 -->
				<div class="content-bd">
					<a-spin tip="加载中..." size="large" :spinning="isLoading">
						<div class="spin-content">
							<a-table
									:columns="columns"
									:dataSource="accountList"
									:pagination="false"
									:rowClassName="rowClassName" v-has="'sending-list'"
							>
								<template slot="status_name" slot-scope="text, record, index">
									<span v-if="record.status_name !='发送失败'">{{record.status_name}}</span>
									<a-tooltip>
										<template slot="title">
											{{record.error_msg}}
										</template>
										<span style="color: red;" v-if="record.status_name=='发送失败'">发送失败</span>
									</a-tooltip>
								</template>
								<span slot="customerTitle">
									发送状态
									<a-tooltip placement="bottom">
							                    <template slot="title">
								                    <div style="width: 250px;">
									                    <p style="margin-bottom: 0;line-height: 25px;">未发送：未到指定的时间点，尚不发送</p>
								                        <p style="margin-bottom: 0;line-height: 25px;">发送中：在跑队列，还没全部发送完</p>
								                        <p style="margin-bottom: 0;line-height: 25px;">发送失败：所有人的短信发送都失败了</p>
								                        <p style="margin-bottom: 0;line-height: 25px;">已发送：全部人都发送过了，不论这些人的发送状态是成功还是失败</p>
								                    </div>
							                    </template>
							                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
								</span>
								<template slot="action" slot-scope="text, record, index">
									<a-button v-if="record.status==0 || record.status==2"
									          @click="deleteList(record.id)">删除
									</a-button>
									<a-button v-if="record.status==1 || record.status==3"
									          @click="pushDetail(record.id)" v-has="'sending-singe-look'">发送记录
									</a-button>
								</template>
							</a-table>

							<!-- 分页 -->
							<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0" v-has="'sending-list'">
								<span style="float:left;margin-left: 20px;">共{{total}}条</span>
								<a-pagination
										:total="total"
										showSizeChanger
										:showQuickJumper="quickJumper"
										:current="page"
										:pageSize="page_size"
										:pageSizeOptions="['15','30','50','100']"
										@change="changePage"
										@showSizeChange="showSizeChange"
										style="float: right;"
								/>
							</div>
						</div>
					</a-spin>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const columns = [
		// {
		// 	title    : "序号",
		// 	dataIndex: "id",
		// 	width    : "5%",
		// 	key      : "id"
		// },
		{
			title    : "消息名称",
			dataIndex: "title",
			width    : "8%",
			key      : "title"
		},
		{
			title    : "短信类型",
			dataIndex: "type_name",
			width    : "8%",
			key      : "type_name"
		},
		{
			title    : "发送内容",
			dataIndex: "content",
			width    : "15%",
			key      : "content"
		},
		{
			title    : "发送对象",
			dataIndex: "send_name",
			width    : "8%",
			key      : "send_name"
		},
		{
			title    : "预计发送人数",
			dataIndex: "target_num",
			width    : "5%",
			key      : "target_num"
		},
		{
			title    : "实际发送人数",
			dataIndex: "arrival_num",
			width    : "5%",
			key      : "arrival_num"
		},
		{
			title    : "发送时间",
			dataIndex: "push_time",
			width    : "10%",
			key      : "push_time"
		},
		{
			// title      : "发送状态",
			dataIndex  : "status_name",
			width      : "10%",
			key        : "status_name",
			scopedSlots: {customRender: "status_name", title: "customerTitle"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			width      : "10%",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "smsSendList",
		data () {
			return {
				showTransition: 1,
				accountList   : [], //表格信息
				flag          : false, //暂无数据 的显示与隐藏
				searchInput   : "", //输入框的值
				isLoading     : true, //Loading 组件显示与隐藏
				commonUrl     : this.$store.state.commonUrl,//公共的链接
				showWxModal   : false, //添加公众号对话框的显示与隐藏
				status        : "-1", //状态
				restNum       : "0", //剩余短信数
				consume       : "0", //消耗短信数
				//表格部分
				columns,
				page          : 1, //页码
				page_size     : 15, //每页数据量，默认15
				//分页
				total         : 0, //总条数
				quickJumper   : false, // 是否显示快速跳转的控件
			};
		},
		mounted () {
			this.initHelp()
		},
		methods: {
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 点我帮助动画
			initHelp () {
				let that = this
				setInterval(function () {
					that.showTransition = (that.showTransition + 1) % 5;
				}, 1000)
			},
			//搜索输入框
			handleChangeStatus (status) {
				this.status = status;
				// this.getAccount();
			},
			//获取表格内容
			async getAccount (page = 1, pageSize = this.page_size) {
				const {data: res} = await this.axios.post(
					"short-message/message",
					{
						uid     : localStorage.getItem("uid"),
						status  : this.status,
						page    : page,
						pageSize: pageSize
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
					this.accountList = res.data.message;
					this.total = parseInt(res.data.count);
					this.restNum = res.data.restNum;
					this.consume = res.data.consume;
					this.page = page;
					this.page_size = pageSize;
					this.quickJumper = this.total > this.page_size;
					this.isLoading = false;
				}
				//   console.log(this.accountList);
				if (this.accountList.length == 0) {
					this.flag = true;
				}
			},
			//申请
			find () {
				this.getAccount();
			},
			//清空搜索框
			clear () {
				this.isLoading = true;
				location.reload();
			},
			deleteList (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该记录?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.delSign(id);
					}
				});
			},
			async delSign (id) {
				const {data: res} = await this.axios.post("short-message/push-delete", {
					uid    : localStorage.getItem("uid"),
					push_id: id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if(this.page > 1 && this.accountList.length == 1) {
						this.getAccount(this.page - 1, this.page_size)
					} else {
						this.getAccount(this.page, this.page_size)
					}
				}
			},
			pushDetail (id = '') {
				if (id == '') {
					this.$router.push("/smsSend/detail");
				} else {
					this.$router.push({path: "/smsSend/detail", query: {id: id}})
				}
			},
			addPush () {
				this.$router.push("/smsSend/add");
			},
			pushOrder () {
				this.$router.push("/smsSend/order");
			},
			changePage (page, page_size) {
				this.getAccount(page, page_size);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,260)
				})
			},
			showSizeChange (page, page_size) {
				this.getAccount(1, page_size);
			}
		},

		created () {
			this.getAccount();
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/smsSend/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1' || from.path == '/smsSend/detail' || from.path == '/smsSend/order') {
				next(vm => {
					//编辑回来
					vm.getAccount(vm.page,vm.page_size)
				});
			}else {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.status = "-1"
					vm.page = 1
					vm.page_size = 15
					vm.getAccount()
				});
			}
			next()
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.content-msg {
		background: @color-bgc;
		padding: 10px;
		margin: 12px 20px;
		border: 1px solid @border-color;

		p {
			margin-bottom: 0;
		}
	}

	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.help {
		float: left;
		margin-left: 18px;
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

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		margin: 0 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}
</style>