<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">公众号管理</label>
				<div class="help"
				     :class="showTransition == 0 ?'help-transition': (showTransition== 1 ? 'help-transition1' : '')">
					<a href="https://support.qq.com/products/104790/faqs/57072"
					   target="_blank">
						<a-icon type="question-circle" class="help-icon"/>
						<span style="float:right;">点我帮助</span>
					</a>
				</div>
			</a-card>
			<a-row style="margin-bottom:20px;padding:0 20px;">
				<a-col style="float:left;">
					<a-select
							defaultValue="全部认证状态"
							style="width: 150px;margin-right:15px;"
							@change="handleChange"
					>
						<a-select-option value="all">全部认证状态</a-select-option>
						<a-select-option value="1">已认证</a-select-option>
						<a-select-option value="2">未认证</a-select-option>
					</a-select>

					<a-select
							defaultValue="全部账号类型"
							style="width: 150px;margin-right:15px;"
							@change="handleChange2"
					>
						<a-select-option value="all">全部账号类型</a-select-option>
						<a-select-option value="1">订阅号</a-select-option>
						<a-select-option value="2">服务号</a-select-option>
					</a-select>

					<a-input-search
							placeholder="搜索公众号"
							style="width: 200px;margin-right:15px;"
							@search="onSearch"
							v-model="searchInput"
					/>
					<a-button type="primary" style="margin-right:15px;" @click="find">查询</a-button>
					<a-button @click="clear">重置</a-button>
				</a-col>
				<a-col style="float:right;">
					<a-button
							type="primary"
							icon="plus"
							style="width: 150px;font-size:14px;"
							@click="addAccount(false)" v-has="'account-add'"
					>添加公众号
					</a-button>
				</a-col>
			</a-row>

			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-table
								:columns="columns"
								:dataSource="accountList"
								:pagination="false"
								:rowClassName="rowClassName" v-has="'account-list'"
						>
							<template slot="nick_name" slot-scope="text, record, index">
								<a-avatar shape="square" :src="record.head_img"/>
								<span style="margin-left: 10px;">{{record.nick_name}}</span>
							</template>
							<template slot="service_type" slot-scope="text, record, index">
								<span v-if="record.service_type==2">服务号</span>
								<span v-if="record.service_type!=2">订阅号</span>
							</template>
							<template slot="action" slot-scope="text, record, index">
								<a-button
										@click="addAccount(true)"
										style="margin-right: 5px; margin-bottom: 5px;">
									{{['authorized', 'updateauthorized'].includes(record.authorizer_type) ? '更新' :
									'重新'}}授权
								</a-button>
								<a-button
										v-if="record.authorizer_type != 'unauthorized'"
										@click="refreshAuthor(record.wx_id)">
									刷新
								</a-button>
							</template>
							<span slot="customTitle">
                  互动粉丝数
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      <span>48小时内互动（包括粉丝发送消息给公众号、点击自定义菜单、关注公众号、扫描二维码、支付成功、用户维权等，阅读公众号文章不算互动）的粉丝数。</span>
                    </template>
                    <a-icon type="question-circle" style="margin-left:5px;"/>
                  </a-tooltip>
                </span>
						</a-table>

						<!-- 分页 -->
						<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0"
						     v-has="'account-list'">
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
		<!-- 点击添加公众号弹窗 -->
		<authorize :show="showWxModal" @cancel="cancel"></authorize>
	</div>
</template>

<script>
	import authorize from "@/components/Authorize.vue"

	const columns = [
		{
			title      : "公众号",
			dataIndex  : "nick_name",
			width      : "15%",
			key        : "nick_name",
			scopedSlots: {customRender: "nick_name"}
		},
		{
			title      : "账号类型",
			dataIndex  : "service_type",
			width      : "7%",
			key        : "service_type",
			scopedSlots: {customRender: "service_type"}
		},
		{
			title    : "认证状态",
			dataIndex: "verify_type",
			width    : "8%",
			key      : "verify_type"
		},
		{
			title    : "粉丝数",
			dataIndex: "fans_num",
			width    : "8%",
			key      : "fans_num"
		},
		{
			dataIndex  : "active_fans",
			width      : "12%",
			key        : "active_fans",
			slots      : {title: "customTitle"},
			scopedSlots: {customRender: "active_fans"}
		},
		{
			title    : "所属行业",
			dataIndex: "industry",
			width    : "10%",
			key      : "industry"
		},
		{
			title    : "授权时间",
			dataIndex: "create_time",
			width    : "15%",
			key      : "create_time"
		},
		{
			title    : "授权状态",
			dataIndex: "authorizer_type_name",
			width    : "10%",
			key      : "authorizer_type_name"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			width      : "15%",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		components: {
			authorize
		},
		data () {
			return {
				showTransition: 1,
				auth_status   : "", //1 已认证 2 未认证
				account_type  : "", //1 订阅号 2 服务号
				nick_name     : "", //公众号名称
				canAdd        : 1,  // 添加是否达到上线
				accountList   : [], //表格信息
				flag          : false, //暂无数据 的显示与隐藏
				searchInput   : "", //输入框的值
				isLoading     : true, //Loading 组件显示与隐藏
				commonUrl     : this.$store.state.commonUrl,//公共的链接
				showWxModal   : false, //添加公众号对话框的显示与隐藏
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
		methods   : {
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
			//下拉框选中状态
			handleChange (value) {
				this.auth_status = value;
			},
			handleChange2 (value2) {
				this.account_type = value2;
			},
			//搜索输入框
			onSearch (value3) {
				this.nick_name = value3;
				this.getAccount();
			},
			//获取表格内容
			async getAccount (page = 1, pageSize = this.page_size) {
				const {data: res} = await this.axios.post(
					"wx-authorize-info/get-authrize-info",
					{
						uid            : localStorage.getItem("uid"),
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem('sub_id'),
						auth_status    : this.auth_status,
						account_type   : this.account_type,
						nick_name      : this.nick_name,
						is_page        : 1,
						page           : page,
						pageSize       : pageSize
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
					this.canAdd = res.data.canAdd
					this.accountList = res.data.info;
					this.total = parseInt(res.data.count);
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
			// 刷新公众号信息
			async refreshAuthor (refreshId) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("wx-authorize-info/refresh-authorize", {
					refresh_id: refreshId,
					wx_id:localStorage.getItem('wxNum')
				})

				if (res.error != 0) {
					this.isLoading = false
					if (typeof res.message === 'undefined') {
						this.$message.error('刷新失败')
					} else {
						this.$message.error(res.message)
					}
				} else {
					this.getAccount()
				}
			},
			//点击搜索
			find () {
				this.nick_name = this.searchInput;
				// console.log(this.auth_status,this.account_type,this.nick_name,this.page)
				this.getAccount();
			},
			//点击清空
			clear () {
				location.reload();
				this.getAccount();
				this.flag = false;
			},
			changePage (page, page_size) {
				this.getAccount(page, page_size);
			},
			showSizeChange (page, page_size) {
				this.getAccount(1, page_size);
			},
			//点击添加公众号
			addAccount (reAuth) {
				if (!reAuth && this.canAdd == 0) {
					this.$message.warning("添加数量已达上限，请联系渠道经理。")
					return false
				}
				this.showWxModal = true;
			},
			cancel () {
				this.showWxModal = false
			}
		},

		created () {
			this.getAccount();
		}
	};
</script>

<style lang='less' scoped>
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