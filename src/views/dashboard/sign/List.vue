<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<a-card style="padding:0 20px;line-height: 50px;border-bottom: 1px solid #E2E2E2;height: 50px;min-width: 760px;width: 100%;margin-bottom: 12px;">
				<label class="tpl-title">签名管理</label>
			</a-card>
			<a-row style="margin-bottom:20px;padding:0 20px;">
				<a-col style="float:left;">
					<a-input
							placeholder="请填写公司名称/产品名/品牌名/网站名，2-8个字符"
							style="width: 350px;margin-right:15px;"
							v-model="searchInput"
							:maxLength="8"
					/>
					<a-button type="primary" style="margin-right:15px;" @click="addSign" v-has="'sign-add'">申请</a-button>
					<a-button style="margin-right:15px;" @click="clear">重置</a-button>
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
								:rowClassName="rowClassName" v-has="'sign-list'"
						>
							<template slot="status" slot-scope="text, record, index">
								<span v-if="record.status==0">待审核</span>
								<span v-if="record.status==1">已通过</span>
								<a-tooltip>
									<template slot="title">
										{{record.error_msg}}
									</template>
									<span style="color: red;" v-if="record.status==2">未通过</span>
								</a-tooltip>
							</template>
							<template slot="action" slot-scope="text, record, index">
								<a-button v-if="record.status != 1" @click="deleteList(record.id)" v-has="'sign-delete'">删除</a-button>
								<span v-if="record.status == 1">--</span>
							</template>
						</a-table>

						<!-- 分页 -->
						<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0" v-has="'sign-list'">
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
</template>

<script>
	const columns = [
		{
			title      : "申请时间",
			dataIndex  : "apply_time",
			width      : "15%",
			key        : "apply_time"
		},
		{
			title      : "签名",
			dataIndex  : "title",
			width      : "8%",
			key        : "title"
		},
		{
			title      : "审核状态",
			dataIndex  : "status",
			width      : "10%",
			key        : "status",
			scopedSlots: {customRender: "status"}
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
		data () {
			return {
				showTransition: 1,
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
			//获取表格内容
			async getAccount (page = 1, pageSize = this.page_size) {
				const {data: res} = await this.axios.post(
					"short-message/sign",
					{
						uid         : localStorage.getItem("uid"),
						page        : page,
						pageSize    : pageSize
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
					this.accountList = res.data.sign;
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
			//申请
			addSign () {
				this.isLoading = true
				this.addSignPost();
			},
			//清空
			clear(){
				this.searchInput = ''
			},
			//申请添加
			async addSignPost(){
				if(this.searchInput == ''){
					this.$message.error('请填写要申请的签名');
					this.isLoading = false;
					return false;
				}
				const {data: res} = await this.axios.post(
					"short-message/sign-add",
					{
						uid : localStorage.getItem("uid"),
						title   : this.searchInput
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('添加成功');
					this.searchInput = ''
					this.getAccount();
				}
			},
			deleteList(id){
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
				const {data: res} = await this.axios.post("short-message/sign-delete", {
					sign_id: id
				});
				console.log(res)
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if(this.accountList.length == 1 && this.page > 1) {
						this.getAccount(this.page - 1, this.page_size)
					} else {
						this.getAccount(this.page, this.page_size)
					}
				}
			},
			changePage (page, page_size) {
				this.getAccount(page, page_size);
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange (page, page_size) {
				this.getAccount(1, page_size);
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
		background: #fafafa;
	}

	/deep/ .light-row {
		background: #FFF;
	}
</style>