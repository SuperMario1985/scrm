<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<a-card style="padding:0 20px;line-height: 50px;border-bottom: 1px solid #E2E2E2;height: 50px;min-width: 760px;width: 100%;margin-bottom: 12px;">
				<div class="tpl-title">短信充值
					<router-link to="/smsSend/list" style="font-size: 16px;float: right;margin-right: 15px;">
						<a-button type="primary" icon="rollback">返回列表</a-button>
					</router-link></div>
			</a-card>
			<div style="margin:0 20px;background:#fff;padding: 20px;">
				<a-form>
					<a-form-item label="支付方式" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
						<img src="../../../assets/wechatPay.png" alt="" style="width: 28px;">
						<span style="font-size: 16px;line-height: 32px;margin-left: 6px;">微信支付</span>
					</a-form-item>
					<a-form-item label="充值条数" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
							<a-radio-group @change="changePack" v-model="pack_id" style="margin-top: 13px;">
								<template v-for="(item,index) in packArr" style="display: inline-block;">
									<a-radio-button :value="item.key">
										<div style="border-bottom: 1px dashed #ccc;text-align: center;font-weight: 700;">{{item.num}}条</div>
										<div style="text-align: center;">{{item.txt}}</div>
									</a-radio-button>
								</template>
							</a-radio-group>
					</a-form-item>
					<a-form-item label="充值金额" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
							{{nowPrice}}
					</a-form-item>
					<a-button style="margin-left: 200px;" class="phoneSub" type="primary" @click="recharge">立即充值</a-button>
				</a-form>
			</div>
			<a-row style="margin:20px;">
				<a-col style="float:left;">
					<a-input
							placeholder="请输入订单号或产品名"
							style="width: 350px;margin-right:15px;"
							v-model="searchInput"
					/>
					<a-button type="primary" style="margin-right:15px;" @click="find">查询</a-button>
					<a-button style="margin-right:15px;" @click="clear">重置</a-button>
				</a-col>
			</a-row>
			<a-modal title="微信支付" v-model="visible1" width="600px" @cancel="cancelOrder" :footer="null">
				<div style="overflow: hidden;padding: 30px 20px;">
					<div style="float: left;">
						<p>当前购买：短信充值</p>
						<p>收款方：{{payee}}</p>
						<p>待支付：<span style="color: red;font-size: 32px;">{{nowPrice}}元</span></p>
					</div>
					<div style="float:right;width: 160px;height: 160px;border: 1px solid #ccc;margin-right: 50px;position: relative;">
						<p style="position: absolute;left: 0;top: 0;border-left: 1px solid #000;border-top: 1px solid #000;width: 20px;height: 20px;"></p>
						<p style="position: absolute;right: 0;top: 0;border-right: 1px solid #000;border-top: 1px solid #000;width: 20px;height: 20px;"></p>
						<p style="position: absolute;left: 0;bottom: 0;border-left: 1px solid #000;border-bottom: 1px solid #000;width: 20px;height: 20px;margin: 0;"></p>
						<p style="position: absolute;right: 0;bottom: 0;border-right: 1px solid #000;border-bottom: 1px solid #000;width: 20px;height: 20px;margin: 0;"></p>
						<div style="width: 140px;height: 140px;margin:10px auto 0;">
							<div id="qrcode" ref="a"></div>
						</div>
						<div style="margin-top:10px;text-align: center;">使用微信扫一扫付款</div>
					</div>
				</div>
			</a-modal>
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
	import QRCode from 'qrcodejs2'


	const columns = [
		{
			title      : "订单号",
			dataIndex  : "order_id",
			width      : "15%",
			key        : "order_id"
		},
		{
			title      : "产品",
			dataIndex  : "goods_name",
			width      : "8%",
			key        : "goods_name"
		},
		{
			title      : "订单时间",
			dataIndex  : "paytime",
			width      : "10%",
			key        : "paytime"
		},
		{
			title      : "金额",
			dataIndex  : "goods_price",
			width      : "10%",
			key        : "goods_price"
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
				packArr       : [], // 短信包数据
				pack_id       : 0, // 短信包id
				nowPrice      : "", // 短信价格
				visible1      : false, // 支付框显示
				show          : 1,//1查看，0下载二维码
				payee         : "",//收款方
				order_status  : false,//订单状态
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
					"short-message/push-order",
					{
						uid     : localStorage.getItem("uid"),
						search  : this.searchInput,
						page    : page,
						pageSize: pageSize
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
					this.accountList = res.data.detail;
					this.packArr = res.data.packArr;
					this.pack_id = res.data.pack_id;
					this.nowPrice = res.data.nowPrice;
					this.payee = res.data.payee;
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
			//查询
			find () {
				this.isLoading = true
				this.getAccount();
			},
			//清空
			clear(){
				this.searchInput = ''
				this.isLoading = true
				this.getAccount();
			},
			recharge(){
				this.rechargePost();
			},
			async rechargePost(){
				this.visible1 = true;
				const {data: res} = await this.axios.post(
					"short-message/post-order",
					{
						uid     : localStorage.getItem("uid"),
						pack_id  : this.pack_id
					}
				);
				if (res.error != 0) {
					this.$message.error(res.message);
				} else {
					this.$refs.a.innerHTML = '';
					this.qrcode(res.data.ewmUrl);
					var t1 = setInterval(() => {
						this.getOrderStatus(res.data.order_id);
						if(this.order_status){
							clearInterval(t1);
						}
					}, 2000);

				}
			},
			async getOrderStatus(order_id){
				const {data: res} = await this.axios.post(
					"short-message/get-order-status",
					{
						uid     : localStorage.getItem("uid"),
						order_id  : order_id
					}
				);
				//   console.log(res);
				if (res.error == 0) {
					this.order_status = true;
					this.$message.success("支付成功");
					location.reload();
				}
			},
			cancelOrder(){
				this.visible1 = false;
				this.order_status = true;
			},
			qrcode (url) {
				let qrcode = new QRCode('qrcode', {
					width     : 140,
					height    : 140,
					text      : url, // 二维码地址
					colorDark : "#000",
					colorLight: "#FFF",
				})
			},
			changePack(e){
				this.pack_id = e.target.value;
				this.packArr.map((x)=>{
					if(this.pack_id == x.key){
						this.nowPrice = x.price;
					}
				})
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
		background: #fafafa;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 120px;
		height: 64px;
		padding: 0;
		border-radius:4px;
	}

	/deep/.ant-col-2 {
		text-align: center;
	}
</style>