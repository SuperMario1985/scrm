<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<a-card style="padding:0 20px;line-height: 50px;border-bottom: 1px solid #E2E2E2;height: 50px;min-width: 760px;width: 100%;margin-bottom: 12px;">
				<label class="tpl-title">模版管理</label>
			</a-card>
			<div style="margin:0 20px;background:#FFF;padding-bottom:20px;">
				<a-row style="padding:30px 20px;">
					<a-col style="float:left;">
						<template>
							<span style="margin-right: 15px;">申请时间 </span>
							<a-range-picker
									:disabledDate="disabledDate"
									format="YYYY-MM-DD"
									@change="changeSelectTime"
									v-model="dateValue"
							/>
						</template>

						<a-select
								v-model="status"
								style="width: 150px;margin-right:15px;margin-left:15px;"
								@change="handleChangeStatus"
						>
							<a-select-option value="-1">全部状态</a-select-option>
							<a-select-option value="0">未审核</a-select-option>
							<a-select-option value="1">已通过</a-select-option>
							<a-select-option value="2">未通过</a-select-option>
						</a-select>
						<a-button type="primary" style="margin-right:15px;" @click="find">查询</a-button>
						<a-button style="margin-right:15px;" @click="clear">重置</a-button>
					</a-col>
					<a-button type="primary" style="float:right;margin-right:15px;" @click="addPush"
					          v-has="'sms-template-add'">新建模版申请
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
									:rowClassName="rowClassName" v-has="'sms-template-list'"
							>
								<template slot="status_name" slot-scope="text, record, index">
									<span v-if="record.status_name !='未通过'">{{record.status_name}}</span>
									<a-tooltip>
										<template slot="title">
											{{record.error_msg}}
										</template>
										<span style="color: red;" v-if="record.status_name == '未通过'">未通过</span>
									</a-tooltip>
								</template>
								<template slot="action" slot-scope="text, record, index">
									<a-button v-if="record.status==0 || record.status==2" @click="deleteList(record.id)"
									          v-has="'sms-template-delete'">删除
									</a-button>
									<a-button v-if="record.status==0 || record.status==2"
									          @click="editDetail(record.id,record.content)" style="margin-left: 10px;"
									          v-has="'sms-template-edit'">修改
									</a-button>
									<span v-if="record.status != 0 && record.status != 2">--</span>
								</template>
							</a-table>

							<!-- 分页 -->
							<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0"
							     v-has="'sms-template-list'">
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
				<a-modal title="修改内容" v-model="visible" @cancel="handleCancel" @ok="handleOk" width="650px">
					<div style="height: 200px;overflow: auto;">
						<a-form-item label="" :label-col="{ span: 8 }" :wrapper-col="{ span: 25 }" style="">
							<a-textarea style="height: 160px;border: 1px solid #D9D9D9;resize: none;padding: 15px;"
							            placeholder="请填写短信内容" :maxLength="250" v-model="editContent" :autosize="false"/>
							<span style="float: right;">{{editContent.length}}/250</span>
						</a-form-item>
					</div>
				</a-modal>
			</div>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'

	const columns = [
		{
			title    : "申请时间",
			dataIndex: "apply_time",
			width    : "10%",
			key      : "apply_time"
		},
		{
			title    : "短信签名",
			dataIndex: "sign_name",
			width    : "10%",
			key      : "sign_name"
		},
		{
			title    : "短信类型",
			dataIndex: "type_name",
			width    : "8%",
			key      : "type_name"
		},
		{
			title    : "短信内容",
			dataIndex: "content",
			width    : "15%",
			key      : "content"
		},
		{
			title      : "审核状态",
			dataIndex  : "status_name",
			width      : "10%",
			key        : "status_name",
			scopedSlots: {customRender: "status_name"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			width      : "12%",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name   : "smsTemplateList",
		data () {
			return {
				showTransition: 1,
				accountList   : [], //表格信息
				flag          : false, //暂无数据 的显示与隐藏
				isLoading     : true, //Loading 组件显示与隐藏
				visible       : false,
				status        : "-1", //状态
				edit_id       : "", //修改的模版id
				editContent   : "", //修改的短信内容
				dateValue     : [],
				start_date    : '',//开始日期
				end_date      : '', //结束日期
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
			moment,
			disabledDate (current) {
				return new Date().getTime() < current.valueOf();
			},
			changeSelectTime (date, dateString) {
				this.start_date = dateString[0];
				this.end_date = dateString[1];
			},
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
			},
			//获取表格内容
			async getAccount (page = 1, pageSize = this.page_size) {
				const {data: res} = await this.axios.post(
					"short-message/user-template",
					{
						uid       : localStorage.getItem("uid"),
						status    : this.status,
						start_date: this.start_date,
						end_date  : this.end_date,
						page      : page,
						pageSize  : pageSize
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
					this.accountList = res.data.templateArr;
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
			find () {
				this.isLoading = true
				this.getAccount();
			},
			//清空
			clear () {
				this.isLoading = true
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
				const {data: res} = await this.axios.post("short-message/template-delete", {
					uid        : localStorage.getItem("uid"),
					template_id: id
				});
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
			editDetail (id, content) {
				this.edit_id = id;
				this.editContent = content;
				this.visible = true;
			},
			handleCancel () {

			},
			handleOk () {
				if (this.editContent == '') {
					this.$message.warning("请填写短信内容");
				} else {
					this.isLoading = false;
					this.editTemplate();
				}
			},
			async editTemplate () {
				const {data: res} = await this.axios.post("short-message/edit-template", {
					uid        : localStorage.getItem("uid"),
					template_id: this.edit_id,
					content    : this.editContent
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.visible = false;
					this.getAccount(this.page, this.page_size);
				}
			},
			addPush () {
				this.$router.push("/smsTemplate/add");
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
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path != '/smsTemplate/add' || typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.start_date = ""
					vm.end_date = ''
					vm.status = '-1'
					vm.dateValue = []
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