<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label style="font-size: 16px;">店铺管理</label>
				<a-button type="primary" style="font-size: 14px;float: right;" @click="goAppCenter" icon="rollback">返回</a-button>
			</a-card>
			<a-row style="padding:0 20px;">
<!--				<a-col style="float:left;">-->
<!--					<a-select-->
<!--							showSearch-->
<!--							allowClear-->
<!--							optionFilterProp="children"-->
<!--							placeholder="请选择店铺类型"-->
<!--							style="width: 200px;margin-bottom: 20px;"-->
<!--							v-model="type"-->
<!--					>-->
<!--						<a-select-option :value="'1'">智慧店铺</a-select-option>-->
<!--						<a-select-option :value="'2'">有赞</a-select-option>-->
<!--						<a-select-option :value="'3'">淘宝</a-select-option>-->
<!--						<a-select-option :value="'4'">天猫</a-select-option>-->
<!--					</a-select>-->
<!--				</a-col>-->
				<a-col style="float:left; margin-left: 10px;">
					<a-select
							allowClear
							showSearch
							optionFilterProp="children"
							placeholder="请选择绑定状态"
							style="width: 200px;margin-bottom: 20px;"
							v-model="status"
					>
						<a-select-option :value="'1'">已绑定</a-select-option>
						<a-select-option :value="'2'">未绑定</a-select-option>
					</a-select>
				</a-col>
				<a-col style="float:left; margin-left: 10px;">
					<a-input
							allowClear
							placeholder="请输入店铺名称"
							@keyup.enter="find"
							style="width: 200px;margin-right:15px;"
							v-model="storeName"
					/>
					<a-button type="primary" style="margin-right:15px;" @click="find">查找</a-button>
					<a-button @click="clear">清空</a-button>
				</a-col>
				<a-col style="float:right;">
					<a-button
							type="primary"
							icon="plus"
							style="width: 150px;font-size:14px;"
							@click="addStore"
					>创建店铺
					</a-button>
				</a-col>
			</a-row>

			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-table
								:columns="columns"
								:dataSource="storeList"
								:pagination="false"
								:rowClassName="rowClassName">
							<span slot="action" slot-scope="text, record">
								<a-popconfirm
										@confirm="cancelBind(2, record.key)"
										okText="确定"
										cancelText="取消"
								>
									<template slot="title">
                                        <div style="width: 200px;">一旦解绑，已绑定在本系统的存量数据将不再展示，同时，已绑定过的客户也将全部解绑，确定解绑吗？</div>
                                    </template>
									<a-button style="margin-left:5px;"
									          v-if="record.is_bind == 1">解绑
									</a-button>
								</a-popconfirm>
								<a-popconfirm
										@confirm="cancelBind(1, record.key)"
										okText="确定"
										cancelText="取消"
								>
									<template slot="title">
                                        <div style="width: 200px;">一旦重新绑定后，之前已绑定和断点的数据均会全部展现出来，同时，已绑定过的客户，需要重新手动绑定店铺，确定重新绑定吗？</div>
                                    </template>
									<a-button style="margin-left:5px;"
									          v-if="record.is_bind == 0">绑定
									</a-button>
								</a-popconfirm>
							</span>
						</a-table>
						<div style="width: 100%;" v-show="total > 0">
							<div style="height: 45px;display: inline-block;margin: 25px 0 0 7px;">
								共
								<span style="color: blue">{{total}}</span>
								条
							</div>
							<div class="pagination" style="margin-top: 20px;float: right;">
								<a-pagination :total="total" showSizeChanger
								              :showQuickJumper="quickJumper"
								              :current="page"
								              :pageSize="pageSize"
								              :pageSizeOptions="['15','30','50','100']"
								              @change="changePage"
								              @showSizeChange="showSizeChange"/>
							</div>
						</div>
					</div>
				</a-spin>
			</div>
		</div>
		<a-modal v-model="showStoreVisible" width="720px" :title="title" @cancel="cancelAddStore">
			<template slot="footer">
				<a-button key="back" @click="cancelAddStore">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading"
						@click="handleAddStore"
				>提交
				</a-button>
			</template>
			<a-form>
				<a-form-item label="店铺类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<a-select
							showSearch
							:allowClear="false"
							optionFilterProp="children"
							placeholder="请选择类型"
							:disabled="true"
							style="width: 300px;margin-bottom: 10px;"
							v-model="storeType"
					>
						<a-select-option :value="'1'">小猪智慧店铺</a-select-option>
						<a-select-option :value="'2'">有赞</a-select-option>
						<a-select-option :value="'3'">淘宝</a-select-option>
						<a-select-option :value="'4'">天猫</a-select-option>
					</a-select>
				</a-form-item>
				<div style="color: #FF562D;margin-bottom: 10px;margin-left: 16.66%;" v-if="storeType == 1">
					绑定后，可获取到该店铺的交易订单和会员信息。方便员工在与客户聊天时，可通过企业微信侧边栏中快速查看到该客户的历史订单记录与会员情况。
				</div>

				<a-form-item v-if="storeType == 1" label="店铺标识" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<a-input
							allowClear
							placeholder="请输入店铺标识"
							style="width: 300px;margin-right:15px;"
							v-model="token"
					/>
				</a-form-item>
				<div class="content-msg" v-if="storeType == 1">
					<p style="margin-bottom: 2px; line-height: 25px;">
						1，请登录<a :href="$store.state.cashierUrl + '/cashier/merchants.php?m=Index&c=login&a=index'"
						        target="_blank">智慧店铺系统</a>--商家配置--商家资料--复制标识
					</p>
					<p style="margin-bottom: 0px; line-height: 25px;">
						2，将已复制的标识粘贴在应用集成-智慧店铺卡券里，提交即可。（由于系统无法判断您填写的标识是否是正确，故一旦没有按照文档要求填写，则客户无法打开。）
					</p>
				</div>
				<a-form-item v-if="storeType == 1" label="开启行业集成" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<a-switch :checked="comeFrom == 1 ? true:false"
					          @click="changeStatus()"/>
					（一旦开启后，在“行业集成”菜单里获取到通用页面，并同步到【内容引擎】）
				</a-form-item>
				<div class="content-msg" v-if="storeType == 2">
					<p style="margin-bottom: 2px;line-height: 25px;">
						1、打通有赞，需先在有赞服务市场购买【云美来CRM】应用，<a href="https://yingyong.youzan.com/cloud-app-detail/51319"
					               target="_blank">前往订购地址</a>
					</p>
					<p style="margin-bottom: 2px;line-height: 25px;">
						2、购买成功后，需要您登录有赞店铺后台--【应用--应用市场】--【我的应用】--【去使用】--跳转到云美来SCRM登陆页面--成功登陆后，即绑定成功--进入【第三方店铺--店铺订单】，即可开始拉取订单数据。
					</p>
					<p style="margin-bottom: 2px;line-height: 25px;">
						3、首次授权成功后将默认拉取仅90天的订单数据；另外每天产生的有赞订单实时推送到本系统。
					</p>
					<p style="color: #FF562D;margin-bottom: 0px;line-height: 25px;">
						目前接入有赞店铺，支持微商城和零售。
					</p>
				</div>
				<div v-if="storeType == 2">
					<img src="../../../assets/storeStep/1.png" style="width: 235px;"/>
					<img src="../../../assets/storeStep/2.png" style="width: 185px;margin: 0 20px;"/>
					<img src="../../../assets/storeStep/3.png" style="width: 200px;"/>
				</div>
				<a-form-item v-if="storeType == 3 || storeType == 4" label="店铺名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<a-input
							allowClear
							placeholder="请输入店铺名称"
							style="width: 300px;margin-right:15px;"
							v-model="userName"
					/>
				</a-form-item>
				<div v-if="storeType == 3 || storeType == 4" style="margin-left: 16.7%;color: #FF562D;">
					创建好店铺后，进入【店铺订单】导入<span v-if="storeType == 3">淘宝</span><span v-if="storeType == 4">天猫</span>订单，仅支持csv格式，文件大小20M以内。
				</div>
				<!--				<a-form-item v-if="storeType == 2" label="应用ID" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
				<!--					<a-input-->
				<!--							allowClear-->
				<!--							placeholder="请输入应用ID"-->
				<!--							style="width: 300px;margin-right:15px;margin-bottom: 10px;"-->
				<!--							v-model="clientId"-->
				<!--					/>-->
				<!--				</a-form-item>-->
				<!--				<a-form-item v-if="storeType == 2" label="应用secret" :label-col="{ span: 4 }"-->
				<!--				             :wrapper-col="{ span: 20 }">-->
				<!--					<a-input-->
				<!--							allowClear-->
				<!--							placeholder="请输入应用secret"-->
				<!--							style="width: 300px;margin-right:15px;margin-bottom: 10px;"-->
				<!--							v-model="clientSecret"-->
				<!--					/>-->
				<!--				</a-form-item>-->
				<!--				<a-form-item v-if="storeType == 2" label="应用code" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
				<!--					<a-input-->
				<!--							allowClear-->
				<!--							placeholder="请输入应用code"-->
				<!--							style="width: 300px;margin-right:15px;margin-bottom: 10px;"-->
				<!--							v-model="code"-->
				<!--					/>-->
				<!--				</a-form-item>-->
			</a-form>
		</a-modal>
	</div>
</template>

<script>
	const columns = [
		{
			title    : "店铺ID",
			dataIndex: "id",
			key      : "id",
		},
		{
			title    : "店铺名称",
			dataIndex: "storeName",
			key      : "storeName"
		},
		{
			title    : "类型",
			dataIndex: "type",
			key      : "type"
		},
		{
			title    : "绑定状态",
			dataIndex: "status",
			key      : "status"
		},
		{
			title    : "绑定时间",
			dataIndex: "bindTime",
			key      : "bindTime"
		},
		{
			title    : "到期时间",
			dataIndex: "expireTime",
			key      : "expireTime"
		},
		{
			title    : "启用门店/闭店",
			dataIndex: "storeNum",
			key      : "storeNum"
		},
		// {
		// 	title    : "实收订单数/订单金额",
		// 	dataIndex: "orderNum",
		// 	key      : "orderNum"
		// },
		// {
		// 	title    : "退款订单数/订单金额",
		// 	dataIndex: "refundNum",
		// 	key      : "refundNum"
		// },
		// {
		// 	title    : "实时会员数（已激活会员卡）",
		// 	dataIndex: "members",
		// 	key      : "members"
		// },
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		data () {
			return {
				storeList       : [], //表格信息
				storeName       : "", //输入框的值
				type            : [], // 类型
				status          : [], // 状态
				isLoading       : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				page            : 1, //页码
				pageSize        : 15, //每页数据量，默认15
				//分页
				total           : 0, //总条数
				quickJumper     : false, // 是否显示快速跳转的控件
				showStoreVisible: false, // 添加店铺弹窗
				title           : '创建店铺',
				loading         : false,
				storeType       : '1', // 店铺类型
				token           : '', // 店铺标识
				comeFrom        : 1, // 行业集成是否开启
				clientId        : '', // 有赞id
				clientSecret    : '', // 有赞secret
				code            : '', // 有赞code
				userName        : ''
			};
		},
		methods: {
			goAppCenter() {
				this.$router.push('/appCenter/list')
			},
			//获取表格内容
			async getStore (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post(
					"third-store/get-merchants",
					{
						storeType: this.type,
						status   : this.status,
						storeName: this.storeName,
						page     : page,
						pageSize : pageSize,
						uid      : localStorage.getItem('uid')
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.storeList = res.data.info;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					this.isLoading = false;
				}
			},
			//点击搜索
			find () {
				this.getStore()
			},
			// 清除
			clear () {
				// this.type = []
				this.status = []
				this.storeName = ''
				this.getStore()
			},
			// 添加弹窗按钮
			addStore () {
				this.title = '创建店铺'
				this.token = ""
				this.storeType = this.type
				this.comeFrom = 1
				this.userName = ''
				this.showStoreVisible = true
			},
			// type 1绑定/2解绑
			async cancelBind (type, key) {
				const {data: res} = await this.axios.post(
					"third-store/cancel-merchants",
					{
						id  : key,
						type: type
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (type == 1) {
						this.$message.success('绑定成功')
					} else {
						this.$message.success('解绑成功')
					}
					this.getStore(this.page, this.pageSize)
				}
			},
			changePage (page, pageSize) {
				this.getStore(page, this.pageSize)
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange (page, pageSize) {
				this.getStore(this.page, pageSize)
			},
			// 确认添加店铺
			async handleAddStore () {
				this.loading = true
				if (this.storeType == 1) {
					if (this.token == "") {
						this.$message.warning('请填写店铺标识！')
						this.loading = false
						return false
					}
				} else if (this.storeType == 2) {
					this.loading = false
					this.showStoreVisible = false
					return false
				} else if (this.storeType == 3 || this.storeType == 4) {
					if (this.userName == "") {
						this.$message.warning('请填写店铺名称！')
						this.loading = false
						return false
					}
				}
				const {data: res} = await this.axios.post(
					"attachment/application-sign-add",
					{
						uid          : localStorage.getItem("uid"),
						sign         : this.token,
						site_type    : 1,
						comeFrom     : this.comeFrom,
						source       : this.storeType,
						client_id    : this.clientId,
						client_secret: this.clientSecret,
						code         : this.code,
						user_name    : this.userName
					}
				);
				if (res.error != 0) {
					this.loading = false;
					this.$message.error(res.error_msg);
				} else {
					this.$message.success("添加成功！")
					this.loading = false
					this.showStoreVisible = false
					this.getStore()
				}
			},
			// 取消添加店铺
			cancelAddStore () {
				this.showStoreVisible = false
			},
			rowClassName (record, index) {
				let className = 'dark-row'
				if (index % 2 === 0) {
					className = 'light-row'
				}
				return className
			},
			// 行业集成打开或关闭
			changeStatus () {
				this.comeFrom = (this.comeFrom + 1) % 2
			}
		},

		created () {
			this.type = this.$route.query.type
			this.getStore()
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
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
		margin-left: 16.6%;
		width: 83%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
		text-align: left;
		margin-bottom: 20px;
	}
</style>