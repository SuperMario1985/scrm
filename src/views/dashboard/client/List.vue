<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<!-- <a-card style="padding:0 20px;line-height: 50px;border-bottom: 1px solid #E2E2E2;height: 50px;min-width: 760px;width: 100%;margin-bottom: 12px;">
				<label class="tpl-title">客户管理</label>
			</a-card> -->
			<div style="margin:20px 20px 0;margin-bottom:12px;background:#FFF;position: relative;padding: 20px;"
			     v-has="'user-add'">
				<a-form>
					<a-form-item label="客户手机" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
						<a-radio-group @change="changeUseType" v-model="is_import">
							<a-radio :value="0">输入手机号</a-radio>
							<a-radio :value="1" style="margin-left: 15px;">从Excel表格导入
								<span style="padding-top: 15px;" v-show="is_import == 1">
									<a-upload
											name="avatar"
											:showUploadList="false"
											action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
											:beforeUpload="beforeUpload"
									>
										<a-button type="primary"
										          style="margin-left: 10px;height: 28px;font-size: 14px;">上传excel</a-button>
									</a-upload>
									<span><a :href="$store.state.commonUrl+'/upload/customer.xlsx'"
									         style="margin:10px;">示例数据</a>请按照模板中的要求整理用户信息</span>
									<span>{{file_name}}</span>
								</span></a-radio>
						</a-radio-group>
						<div v-show="is_import == 0">
							<!-- 添加描述 -->
							<a-textarea style="height: 110px;border: 1px solid #D9D9D9;resize: none;"
							            placeholder="手机号之间使用,分割" v-model="phoneTxt" :autosize="false"/>
						</div>
					</a-form-item>
					<div style="margin-top: 15px;text-align: center;">
						<a-button icon="plus" v-show="is_import == 0" type="primary" @click="postPhone()">新增客户资源
						</a-button>
						<a-button icon="plus" v-show="is_import == 1" type="primary" @click="postFile()">新增客户资源
						</a-button>
					</div>
				</a-form>
			</div>
			<div style="margin:0 20px;background:#FFF;padding-bottom:20px;">
				<a-row style="padding:30px 20px;">
					<a-col style="float:left;">
						<a-input
								placeholder="请输入手机号码"
								style="width: 350px;margin-right:15px;"
								@keyup.enter="find"
								@search="onSearch"
								v-model="searchInput"
						/>
						<a-button type="primary" style="margin-right:15px;" @click="find">查询</a-button>
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
									:rowClassName="rowClassName" v-has="'user-list'"
							>
								<template slot="name" slot-scope="text, record, index">
									<span v-if="record.name==''">--</span>
									<span v-if="record.name !=''">{{record.name}}</span>
								</template>
								<template slot="nickname" slot-scope="text, record, index">
									<span v-if="record.nickname==''">--</span>
									<span v-if="record.nickname !=''">{{record.nickname}}</span>
								</template>
								<template slot="sex" slot-scope="text, record, index">
									<span v-if="record.sex==0">--</span>
									<span v-if="record.sex==1">男</span>
									<span v-if="record.sex==2">女</span>
								</template>
								<template slot="remark" slot-scope="text, record, index">
									<span v-if="record.remark==''">--</span>
									<span v-if="record.remark !=''">{{record.remark}}</span>
								</template>
							</a-table>

							<!-- 分页 -->
							<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0"
							     v-has="'user-list'">
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
		{
			title    : "手机号",
			dataIndex: "phone",
			width    : "15%",
			key      : "phone"
		},
		{
			title      : "姓名",
			dataIndex  : "name",
			width      : "8%",
			key        : "name",
			scopedSlots: {customRender: "name"}
		},
		{
			title      : "微信昵称",
			dataIndex  : "nickname",
			width      : "10%",
			key        : "nickname",
			scopedSlots: {customRender: "nickname"}
		},
		{
			title      : "性别",
			dataIndex  : "sex",
			width      : "10%",
			key        : "sex",
			scopedSlots: {customRender: "sex"}
		},
		{
			title      : "备注",
			dataIndex  : "remark",
			width      : "10%",
			key        : "remark",
			scopedSlots: {customRender: "remark"}
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
				phone         : "", //搜索框
				is_import     : 0, //导入类型：0、文本导入，1、excel导入
				phoneTxt      : "", //文本内容
				fileInfo      : {}, //上传excel的文件信息
				file_name     : '', //上传excel的名称
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
			onSearch (value3) {
				this.phone = value3;
				this.getAccount();
			},
			//获取表格内容
			async getAccount (page = 1, pageSize = this.page_size) {
				const {data: res} = await this.axios.post(
					"short-message/customer",
					{
						uid     : localStorage.getItem("uid"),
						phone   : this.phone,
						page    : page,
						pageSize: pageSize
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
					this.accountList = res.data.customer;
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
				this.phone = this.searchInput;
				this.isLoading = true
				this.getAccount();
			},
			//清空
			clear () {
				this.searchInput = ''
				this.phone = this.searchInput;
				this.isLoading = true
				this.getAccount();
			},
			//选择图文类型
			changeUseType (e) {
				this.is_is_import = e.target.value;
			},
			beforeUpload (file) {
				const extension = file.name.substr(file.name.lastIndexOf(".")).toLowerCase() === '.xls'
				const extension2 = file.name.substr(file.name.lastIndexOf(".")).toLowerCase() === '.xlsx'
				const isLt5M = file.size / 1024 / 1024 < 5
				if (!extension && !extension2) {
					this.$message.warning('上传模板只能是 xls、xlsx格式!')
					return
				}
				if (!isLt5M) {
					this.$message.warning('上传模板大小不能超过 5MB!')
					return
				}
				this.fileInfo = file;
				this.file_name = file.name;
				return false; // 返回false不会自动上传
			},
			postPhone () {
				this.isLoading = true;
				this.addPhone();
			},
			async addPhone () {
				if (this.phoneTxt == '') {
					this.$message.error('请输入手机号');
					this.isLoading = false;
					return false;
				}
				const {data: res} = await this.axios.post("short-message/add-customer", {
					uid      : localStorage.getItem("uid"),
					is_import: 0,
					phoneTxt : this.phoneTxt
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.$message.success(res.data.textHtml);
					this.phoneTxt = '';
					this.phone = '';
					this.getAccount();
				}
			},
			postFile () {
				this.isLoading = true;
				this.uploadFile();
			},
			async uploadFile () {
				if (JSON.stringify(this.fileInfo) == '{}') {
					this.$message.error('请选择导入文件');
					this.isLoading = false;
					return false;
				}
				let param = new FormData();
				param.append("uid", localStorage.getItem("uid"));
				param.append("is_import", 1);
				param.append("importFile", this.fileInfo);
				const {data: res} = await this.axios.post("short-message/add-customer", param);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.$message.success(res.data.textHtml);
					this.file_name = '';
					this.fileInfo = {};
					this.getAccount();
				}
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

	/deep/ .ant-col-2 {
		text-align: center;
	}
</style>