<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div id="components-layout-demo-basic">
			<!-- <a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">小程序管理</label>
			</a-card> -->
			<a-layout-content>
				<div style="font-size:16px;font-weight:700;color:#333333;text-align:left">小程序管理</div>
			<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
				<p style="margin-bottom: 2px;">
					1、小程序授权之后，可在【企业微信】模块下，进入【消息互通】，将授权的小程序与企业成员通过自建应用进行关联。关联后，用户通过小程序发送的所有消息，都会及时通过企业微信推送消息通知触达到指定的企业成员，点击消息通知，跳转到H5实时对话页，即可与小程序用户实时会话。
				</p>
				<p style="margin-bottom: 0px;">
					2、关联后，也可以在{{$store.state.siteName}}后台【公众号】模块，进入【客服中心】对小程序用户实时会话。
				</p>
			</div>
			<a-row style="margin:20px 0px;padding:0 20px;">
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

					<a-input-search
							placeholder="搜索小程序"
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
							
							style="width: 150px;font-size:14px;"
							@click="addAccount" v-has="'mini-add'"
					>添加小程序
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
								:rowClassName="rowClassName" v-has="'mini-list'"
						>
							<template slot="nick_name" slot-scope="text, record, index">
								<a-avatar shape="square" :src="record.head_img"/>
								<span style="margin-left: 10px;">{{record.nick_name}}</span>
							</template>
							<template slot="action" slot-scope="text, record, index">
								<a-button
										@click="addAccount"
										style="margin-right: 5px; ">
									{{['authorized', 'updateauthorized'].includes(record.authorizer_type) ? '更新' :
									'重新'}}授权
								</a-button>
								<a-button
										v-if="record.authorizer_type != 'unauthorized'"
										@click="refreshAuthor(record.wx_id)">
									刷新
								</a-button>
							</template>
						</a-table>

						<!-- 分页 -->
						<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0"
						     v-has="'mini-list'">
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
			</a-layout-content>
		</div>
		<!-- 点击添加小程序弹窗 -->
		<authorize :show="showWxModal" @cancel="cancel"></authorize>
	</div>
</template>

<script>
	import authorize from "@/components/AuthorizeMini.vue"
	import helpIcon from "@/components/helpIcon";

	const columns = [
		{
			title      : "小程序",
			dataIndex  : "nick_name",
			width      : "40%",
			key        : "nick_name",
			scopedSlots: {customRender: "nick_name"}
		},
		{
			title    : "认证状态",
			dataIndex: "verify_type",
			width    : "15%",
			key      : "verify_type"
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
			width    : "15%",
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
			authorize,
			helpIcon
		},
		data () {
			return {
				auth_status: "", //1 已认证 2 未认证
				nick_name  : "", //小程序名称
				accountList: [], //表格信息
				flag       : false, //暂无数据 的显示与隐藏
				searchInput: "", //输入框的值
				isLoading  : true, //Loading 组件显示与隐藏
				commonUrl  : this.$store.state.commonUrl,//公共的链接
				showWxModal: false, //添加公众号对话框的显示与隐藏
				//表格部分
				columns,
				page       : 1, //页码
				page_size  : 15, //每页数据量，默认15
				//分页
				total      : 0, //总条数
				quickJumper: false, // 是否显示快速跳转的控件
			};
		},
		methods   : {
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//下拉框选中状态
			handleChange (value) {
				this.auth_status = value;
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
						nick_name      : this.nick_name,
						is_page        : 1,
						page           : page,
						pageSize       : pageSize,
						type           : 1
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
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
			addAccount () {
				let uid = localStorage.getItem("uid");
				let redirctUri = this.$store.state.siteUrl + '/mini'
				window.open(
					`${this.commonUrl}/bind/index?uid=${uid}&cnf_id=1&auth_type=2&redirect_uri=${redirctUri}`,
					"_blank"
				);
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
	@import '../../style/_style.less';

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

	.content-msg {
		min-width: 845px;
		width: calc(100% - 40px);
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 20px 0px 0px 20px;
		text-align: left;

	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}
</style>