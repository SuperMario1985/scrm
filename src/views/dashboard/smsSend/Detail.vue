<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<a-card style="padding:0 20px;line-height: 50px;border-bottom: 1px solid #E2E2E2;height: 50px;min-width: 760px;width: 100%;margin-bottom: 12px;">
				<div class="tpl-title">发送记录
					<router-link to="/smsSend/list" style="font-size: 16px;float: right;margin-right: 15px;">
						<a-button type="primary" icon="rollback">返回列表</a-button>
					</router-link></div>
			</a-card>
			<a-row style="margin-bottom:20px;padding:0 20px;">
				<a-col style="float:left;">
					<a-date-picker @change="changeDate" style="margin-right: 15px;" v-show="urlId==''"/>
					<a-input
							placeholder="请填写手机号"
							style="width: 250px;margin-right:15px;"
							v-model="phone"
					/>
					<a-input
							placeholder="请填写消息名称"
							style="width: 250px;margin-right:15px;"
							v-model="title"
							v-show="urlId==''"
					/>
					<a-select
							defaultValue="全部状态"
							style="width: 150px;margin-right:15px;"
							@change="handleChangeStatus"
					>
						<a-select-option value="-1">全部状态</a-select-option>
						<a-select-option value="0">未发送</a-select-option>
						<a-select-option value="1">已发送</a-select-option>
						<a-select-option value="2">发送失败</a-select-option>
						<a-select-option value="3">发送中</a-select-option>
						<a-select-option value="4">未知</a-select-option>
					</a-select>
					<a-button type="primary" style="margin-right:15px;" @click="find">筛选</a-button>
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
								:rowClassName="rowClassName"
						>
							<template slot="status" slot-scope="text, record, index">
								<span v-if="record.status==0">未发送</span>
								<span v-if="record.status==1">已发送</span>
								<span v-if="record.status==2">发送失败</span>
								<span v-if="record.status==3">发送中</span>
								<span v-if="record.status==4">未知</span>
							</template>
							<span slot="customerTitle">
									发送状态
									<a-tooltip placement="bottom">
							                    <template slot="title">
								                    <p style="margin-bottom: 0;line-height: 20px;">1、正在发送：短信已提交成功，正在发送中，等待到达客户手机。</p>
								                    <p style="margin-bottom: 0;line-height: 20px;">2、发送成功：短信已成功到达客户手机。</p>
								                    <p style="margin-bottom: 0;line-height: 20px;">3、发送失败：短信未成功到达客户手机，已扣除的短信量将在发送失败后1小时内补回。</p>
								                    <p style="margin-bottom: 0;line-height: 20px;">4、未知：提交发送72小时后，短信运营商未返回成功/失败状态，即未知，短信运营商规定，此类短信仍然会进行扣费。（未知状态跟客户手机相关，停机，关机或者没有信息，都会导致未知情况，建议客户检查下手机。）</p>
							                    </template>
							                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
								</span>
						</a-table>

						<!-- 分页 -->
						<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0">
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
	const columns = [];

	export default {
		data () {
			return {
				urlId         : "",
				showTransition: 1,
				accountList   : [], //表格信息
				flag          : false, //暂无数据 的显示与隐藏
				phone         : "", //手机号
				title         : "", //消息名称
				status        : "-1", //状态-1全部、0未发送、1已发送、2发送失败、3发送中',
				push_time     : "", //发送时间
				isLoading     : true, //Loading 组件显示与隐藏
				commonUrl     : this.$store.state.commonUrl,//公共的链接
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
			//获取表格内容
			async getAccount (page = 1, pageSize = this.page_size) {
				const {data: res} = await this.axios.post(
					"short-message/push-detail",
					{
						uid      : localStorage.getItem("uid"),
						push_id  : this.urlId,
						status   : this.status,
						push_time: this.push_time,
						phone    : this.phone,
						title    : this.title,
						page     : page,
						pageSize : pageSize
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
					this.accountList = res.data.detail;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.page_size = pageSize;
					this.quickJumper = this.total > this.page_size;
					this.isLoading = false;
					if(typeof this.urlId == 'undefined'){
						this.columns = [{
							title    : "发送时间",
							dataIndex: "push_time",
							width    : "10%",
							key      : "push_time"
						},
							{
								title    : "手机号",
								dataIndex: "phone",
								width    : "8%",
								key      : "phone"
							},
							{
								title      : "消息名称",
								dataIndex  : "title",
								width      : "10%",
								key        : "title"
							},
							{
								title      : "短信类型",
								dataIndex  : "type_name",
								width      : "10%",
								key        : "type_name"
							},
							{
								title      : "短信内容",
								dataIndex  : "content",
								width      : "15%",
								key        : "content"
							},
							{
								// title      : "发送状态",
								dataIndex  : "status",
								width      : "10%",
								key        : "status",
								scopedSlots: {customRender: "status", title: "customerTitle"}
							}]
					}else {
						this.columns = [{
							title    : "发送时间",
							dataIndex: "push_time",
							width    : "10%",
							key      : "push_time"
						},
							{
								title    : "手机号",
								dataIndex: "phone",
								width    : "8%",
								key      : "phone"
							},
							{
								// title      : "发送状态",
								dataIndex  : "status",
								width      : "10%",
								key        : "status",
								scopedSlots: {customRender: "status", title: "customerTitle"}
							}]
					}
				}
				//   console.log(this.accountList);
				if (this.accountList.length == 0) {
					this.flag = true;
				}
			},
			handleChangeStatus (status) {
				this.status = status;
			},
			//选择日期
			changeDate (date, dateString) {
				this.push_time = dateString;
			},
			//点击搜索
			find () {
				this.isLoading = true;
				this.getAccount();
			},
			//清空
			clear(){
				this.isLoading = true;
				location.reload();
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
			this.urlId = this.$route.query.id;
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
		width: 100%;
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