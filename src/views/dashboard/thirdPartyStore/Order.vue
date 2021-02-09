<template>
	<div style="width: 100%; height: 100%; overflow-y: scroll;position: absolute" class="scroll">
		<div class="page-title">
			店铺订单
			<a-button type="primary" style="font-size: 14px;float: right;margin-top: 9px;margin-right: 20px;" @click="goAppCenter" icon="rollback">返回</a-button>
		</div>
		<div v-if="storeList.length == 0 && isShow" class="empty-img">
			<img src="../../../assets/thirdPartyStore/empty.png" alt="">
			<p class="empty-txt">绑定第三方店铺，目前支持淘宝、有赞和小猪智慧店铺。绑定后，可获取到该店铺的交易订单信息，在与客户对话中，可快速查看到该客户的历史订单记录。</p>
			<a-button type="primary" class="empty-btn" @click="goStore">去绑定</a-button>
		</div>
		<div class="home-left-contain" v-if="storeList.length != 0">
			<a-spin :spinning="spinning" tip="加载中..." size="large"
			        :class="spinning?'spinning-true':'spinning-false'">
				<div class="tabs-contain" style="margin-top: 20px">
					<div class="account-filter" v-if="storeList && storeList.length > 0">
						<a-tabs class="store-list-tab" type="card" v-model="bindId" @change="changeStoreId"
						        style="width: 100%;">
							<a-tab-pane v-for="(item, index) in storeList" :key="item.key">
								<div slot="tab">
									<a-tooltip placement="top">
										<template slot="title">
											<span>{{item.storeName}}</span>
										</template>
										{{item.storeName}}
									</a-tooltip>
								</div>
							</a-tab-pane>
						</a-tabs>
						<div style="padding: 0 20px;">
							<div style="display: inline-block;">
								<a-row>
									<a-col class="select-col">
										<a-input
												@keyup.enter="find"
												allowClear
												placeholder="请输入订单号"
												v-model="orderCode"
												:style="type == 1 || type ==2 ? {width: '230px'} : {width: '180px'}"
										/>
									</a-col>
									<a-col class="select-col">
										<a-input
												@keyup.enter="find"
												v-if="type == 1 || type == 2"
												allowClear
												placeholder="手机号，支持尾号查询"
												style="width: 200px;"
												v-model="phone"
										/>
									</a-col>
									<a-col class="select-col">
										<a-input
												@keyup.enter="find"
												v-if="type == 3 || type == 4"
												allowClear
												placeholder="支付宝帐号/会员名称查询"
												style="width: 175px;"
												v-model="phone"
										/>
									</a-col>
									<a-col class="select-col" v-if="type == 1">
										<a-input
												@keyup.enter="find"
												allowClear
												placeholder="卡号"
												style="width: 200px;"
												v-model="cardNo"
										/>
									</a-col>
									<a-col class="select-col">
										<a-input
												@keyup.enter="find"
												v-if="type == 1 || type == 2"
												allowClear
												placeholder="昵称/姓名"
												style="width: 200px;"
												v-model="nickName"
										/>
									</a-col>
									<a-col class="select-col" v-if="type == 3 || this.type == 4">
										<a-select
												allowClear
												showSearch
												optionFilterProp="children"
												placeholder="请选择订单状态"
												style="width: 200px;"
												v-model="orderStatus"
										>
											<a-select-option v-for="item in statusList" :value="item.id">
												{{item.title}}
											</a-select-option>
										</a-select>
									</a-col>
									<a-col class="select-col" v-if="type == 2">
										<a-select
												allowClear
												showSearch
												optionFilterProp="children"
												placeholder="请选择订单类型"
												style="width: 200px;"
												v-model="orderType"
										>
											<a-select-option v-for="item in orderTypeList" :value="item.key">
												{{item.name}}
											</a-select-option>
										</a-select>
									</a-col>
									<a-col class="select-col" v-if="type == 1">
										<a-select
												allowClear
												showSearch
												optionFilterProp="children"
												placeholder="请选择订单状态"
												style="width: 200px;"
												v-model="orderStatus"
										>
											<a-select-option :value="'1'">未退款</a-select-option>
											<a-select-option :value="'2'">已退款</a-select-option>
										</a-select>
									</a-col>
									<a-col class="select-col" v-if="type == 2">
										<a-select
												allowClear
												showSearch
												optionFilterProp="children"
												placeholder="请选择订单状态"
												style="width: 200px;"
												v-model="refundStatus"
										>
											<a-select-option v-for="item in refundStatusList" :value="item.key">
												{{item.name}}
											</a-select-option>
										</a-select>
									</a-col>
									<a-col class="select-col">
										<a-select
												v-if="type == 1 "
												allowClear
												showSearch
												optionFilterProp="children"
												placeholder="支付方式"
												style="width: 200px;"
												v-model="payWay"
										>
											<a-select-option v-for="item in payWays" :value="item.key">
												<span :class="item.is_black== 1 ? (item.is_space == 1 ? 'name-weight-space': 'name-weight') : (item.is_space == 1 ? 'name-space': '')">{{item.name}}</span>
											</a-select-option>
										</a-select>
									</a-col>
									<a-col class="select-col">
										<a-select
												v-if="type == 2"
												allowClear
												showSearch
												optionFilterProp="children"
												placeholder="支付方式"
												style="width: 200px;"
												v-model="payWay"
										>
											<a-select-option v-for="item in refundStatusList" :value="item.key">
												<span>{{item.name}}</span>
											</a-select-option>
										</a-select>
									</a-col>
									<a-col class="select-col" v-if="type == 2">
										<a-select
												allowClear
												showSearch
												optionFilterProp="children"
												placeholder="是否是会员订单"
												style="width: 200px;"
												v-model="isMember"
										>
											<a-select-option :value="'1'">会员订单</a-select-option>
											<a-select-option :value="'0'">非会员订单</a-select-option>
										</a-select>
									</a-col>
									<a-col class="select-col">
										<a-range-picker
												:show-time="{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }"
												format="YYYY-MM-DD HH:mm:ss"
												allowClear
												:style=" type == 1 || type == 2 ? {width: '350px'} : {width: '320px'}"
												:disabled-date="disabledDate"
												v-model="payTime"
												@change="changeTime"
										/>
										<a-button type="primary" style="margin: 0 15px;" @click="find">查询</a-button>
										<a-button @click="clear">重置</a-button>
									</a-col>
								</a-row>
							</div>
							<a-col style="float: right;margin-bottom: 10px;" v-if="type == 3 || this.type == 4">
								<a-upload
										name="avatar"
										:showUploadList="false"
										action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
										:beforeUpload="beforeUpload"
								>
									<a-button type="primary"
									          style="margin-left: 10px;font-size: 14px;">导入订单
									</a-button>
								</a-upload>
							</a-col>
							<div v-if="type == 3 || this.type == 4" style="margin-bottom: 10px; color: #FF562D;">
								<span style="line-height: 32px;">导入的订单仅支持csv格式，文件大小20M以内。</span>
							</div>
							<div class="content-bd">
								<div class="spin-content">
									<a-table
											:columns="type == 1 ? columns : (type == 2 ? columnsYZ : columnsTB)"
											:dataSource="orderList"
											:pagination="false"
											:rowClassName="rowClassName">
										<span slot="payPeople" slot-scope="text, record">
											<p>{{record.name}}</p>
											<p v-if="type == 1">{{record.nickname}}</p>
											<p>{{record.phone}}</p>
											<p v-if="type == 1">{{record.card_no}}</p>
										</span>
										<span slot="receiverName" slot-scope="text, record">
											<p>{{record.receiverName}}</p>
											<p>{{record.receiverPhone}}</p>
										</span>

										<span slot="goodName" slot-scope="text, record">
											{{record.goodName}}
											(x{{record.babyNum}})
										</span>
										<span slot="action" slot-scope="text, record">
											<a-button @click="detial(record.id)">查看详情</a-button>
										</span>
									</a-table>
									<div style="width: 100%;margin-bottom: 10px;" v-show="total > 0">
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
							</div>
						</div>
					</div>
				</div>
				<a-modal v-model="detailVisible" width="720px" title="支付详情" @cancel="cancelDetail">
					<template slot="footer" style="text-align: center;">
						<a-button
								style="margin: 0 auto;"
								key="submit"
								type="primary"
								@click="cancelDetail"
						>关闭
						</a-button>
					</template>
					<div class="form-border" style="padding: 5px;">
						<label style="font-size: 15px; font-weight: 700;">订单信息</label>
						<a-form>
							<a-form-item v-if="type == 1" label="商品名称" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								{{orderDetail.goods_name}}
							</a-form-item>
							<a-form-item v-if="type == 1" :label="orderDetail.refund == 0 ? '支付金额' : '退款金额'"
							             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								￥{{orderDetail.goods_price}}
							</a-form-item>
							<a-form-item label="订单编号" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.order_id}}
							</a-form-item>
							<a-form-item :label="orderDetail.refund == 0 ? '付款方式' : '退款方式'" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								{{orderDetail.pay_mode}}
							</a-form-item>
							<a-form-item v-if="type == 1" :label="orderDetail.refund == 0 ? '支付者' : '退款用户'"
							             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.name}}
							</a-form-item>
							<a-form-item label="支付时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.pay_time}}
							</a-form-item>
							<a-form-item v-if="orderDetail.refund == 2 && type == 1" label="退款时间"
							             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.refund_time}}
							</a-form-item>
							<a-form-item :label="orderDetail.refund == 0 ? '支付状态' : '退款状态'" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								{{orderDetail.pay_name}}
							</a-form-item>
							<a-form-item label="门店" v-if="type == 1" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								{{orderDetail.store_name}}
							</a-form-item>
							<a-form-item label="收货人" v-if="type == 2" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								{{orderDetail.receiver_name}}
							</a-form-item>
							<a-form-item label="收货地址" v-if="type == 2" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								{{orderDetail.address}}
							</a-form-item>
							<a-form-item label="配送方式" v-if="type == 2" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								{{orderDetail.express_type}}
							</a-form-item>
							<a-form-item v-if="type == 1" :label="orderDetail.refund == 0 ? '收款人' : '操作人'"
							             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.payee}}
							</a-form-item>
							<a-form-item v-if="orderDetail.goods_describe"
							             :label="orderDetail.refund == 0 ? '订单备注' : '退款备注'" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								{{orderDetail.goods_describe}}
							</a-form-item>
						</a-form>
					</div>
					<div style="margin-top: 10px;" v-if="orderDetail.infoList && orderDetail.infoList.length > 0">
						<label style="font-size: 15px; font-weight: 700;">订单明细详情</label>
						<a-table
								:columns="detailColumns"
								:dataSource="orderDetail.infoList"
								:pagination="false"
								:rowClassName="rowClassName"
						>
						</a-table>
					</div>
					<a-form style="margin-top: 10px;" class="form-border" v-if="type == 2">
						<div v-for="goods in orderDetail.goodsInfo" style="margin: 10px 0; padding: 0 10px;">
							<div style="width: 100px; display: inline-block;">
								<img :src="goods.pic_path"
								     style="width: 100px;height: 100px;vertical-align: text-bottom;">
							</div>
							<div style="width: 350px; margin: 0 10px;display: inline-block;vertical-align: top;">
								<span style="display: block;width: 350px;text-align: left;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
									{{goods.title}}
								</span>
								<span style="display: block;color: #999999;margin-top: 5px;width: 100%;text-align: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: 2;line-clamp: 2;">
									<span v-for="sn in goods.sku_name"
									      style="margin-right: 5px;">{{sn.k}}：{{sn.v}}
									</span>
								</span>
							</div>
							<div style="width: 150px; display: inline-block;text-align: right;vertical-align: top;">
								<div>￥ {{goods.price}}</div>
								<div style="color: #999999;margin-top: 5px;">x
									{{goods.num}}
								</div>
								<div style="color: #999999;margin-top: 5px;">
									{{goods.refund_state}}
								</div>
							</div>
						</div>
					</a-form>
					<a-form style="margin-top: 10px;" class="form-border">
						<a-form-item label="订单金额" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							￥{{orderDetail.order_price}}
						</a-form-item>
						<a-form-item v-if="type == 2" label="运费" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							￥{{orderDetail.post_fee}}
						</a-form-item>
						<a-form-item v-if="type == 2" label="优惠" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							￥{{orderDetail.discount}}
						</a-form-item>
						<a-form-item v-for="item in orderDetail.statisticData" :label="item.discount_name"
						             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							￥{{item.discount_money}}
						</a-form-item>
					</a-form>
					<a-form style="margin-top: 10px;" class="form-border">
						<a-form-item v-if="orderDetail.refund == 0" label="实付金额" :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							￥{{orderDetail.goods_price}}
						</a-form-item>
						<a-form-item v-if="orderDetail.refund == 2" label="退款金额" :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							￥{{orderDetail.goods_price}}
						</a-form-item>
					</a-form>
					<a-form style="margin-top: 10px;" class="form-border"
					        v-if="orderDetail.marketingStr || orderDetail.giveStr || orderDetail.refundStr">
						<a-form-item v-if="orderDetail.marketingStr" label="消费后赠送" :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							{{orderDetail.marketingStr}}
						</a-form-item>
						<a-form-item v-if="orderDetail.giveStr" label="赠送金额" :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							{{orderDetail.giveStr}}
						</a-form-item>
						<a-form-item v-if="orderDetail.refundStr" label="退款金额" :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							{{orderDetail.refundStr}}
						</a-form-item>
					</a-form>
				</a-modal>
				<a-modal v-model="tbDetailVisible" width="720px" title="支付详情" @cancel="cancelDetail">
					<template slot="footer" style="text-align: center;">
						<a-button
								style="margin: 0 auto;"
								key="submit"
								type="primary"
								@click="cancelDetail"
						>关闭
						</a-button>
					</template>
					<div class="form-border" style="padding: 5px;">
						<label style="font-size: 15px; font-weight: 700;">订单信息</label>
						<a-form>
							<a-form-item label="订单编号" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.orderNo}}
							</a-form-item>
							<a-form-item label="支付宝账号" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.phone}}
							</a-form-item>
							<a-form-item label="订单状态" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.status}}
							</a-form-item>
							<a-form-item label="收货人姓名" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.receiverName}}
							</a-form-item>
							<a-form-item label="收货地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.receiverAddress}}
							</a-form-item>
							<a-form-item label="运送方式" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.express}}
							</a-form-item>
							<a-form-item label="联系手机" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.receiverPhone}}
							</a-form-item>
							<a-form-item label="支付时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.payTime}}
							</a-form-item>
							<a-form-item label="订单备注" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
								{{orderDetail.remark}}
							</a-form-item>
						</a-form>
					</div>
					<div style="margin-top: 10px;" v-if="orderDetail.infoList && orderDetail.infoList.length > 0">
						<label style="font-size: 15px; font-weight: 700;">订单明细详情</label>
						<a-table
								:columns="detailColumns"
								:dataSource="orderDetail.infoList"
								:pagination="false"
								:rowClassName="rowClassName"
						>
						</a-table>
					</div>
					<a-form style="margin-top: 10px;" class="form-border">
						<a-form-item label="应付货款" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							￥{{orderDetail.price}}
						</a-form-item>
						<a-form-item v-if="orderDetail.postFee || orderDetail.postFee == 0" label="应付邮费"
						             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							{{orderDetail.postFee}}
						</a-form-item>
						<a-form-item v-if="orderDetail.costPoint || orderDetail.costPoint == 0" label="支付积分"
						             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							{{orderDetail.costPoint}}
						</a-form-item>
						<a-form-item v-if="orderDetail.backPoint || orderDetail.backPoint == 0" label="返点积分"
						             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							{{orderDetail.backPoint}}
						</a-form-item>
					</a-form>
					<a-form style="margin-top: 10px;" class="form-border">
						<a-form-item label="支付金额" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							￥{{orderDetail.payment}}
						</a-form-item>
					</a-form>
				</a-modal>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'

	const columns = [
		{
			title    : "类型",
			dataIndex: "type",
			key      : "type",
		},
		{
			title    : "店铺名称-门店名称",
			dataIndex: "storeName",
			key      : "storeName"
		},
		{
			title    : "订单号",
			dataIndex: "orderNo",
			key      : "orderNo"
		},
		{
			title    : "支付方式",
			dataIndex: "payWay",
			key      : "payWay"
		},
		{
			title      : "支付人（昵称/姓名/手机号/卡号）",
			dataIndex  : "payPeople",
			key        : "payPeople",
			scopedSlots: {customRender: "payPeople"}
		},
		{
			title    : "实收款（元）",
			dataIndex: "money",
			key      : "money"
		},
		{
			title    : "支付时间",
			dataIndex: "payTime",
			key      : "payTime"
		},
		{
			title    : "状态",
			dataIndex: "status",
			key      : "status"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : "140px",
			scopedSlots: {customRender: "action"}
		}
	];
	const columnsYZ = [
		{
			title    : "类型",
			dataIndex: "type",
			key      : "type",
		},
		{
			title    : "店铺名称",
			dataIndex: "storeName",
			key      : "storeName"
		},
		{
			title    : "订单号",
			dataIndex: "orderNo",
			key      : "orderNo"
		},
		{
			title    : "支付方式",
			dataIndex: "payWay",
			key      : "payWay"
		},
		{
			title      : "支付人（昵称/手机号）",
			dataIndex  : "payPeople",
			key        : "payPeople",
			scopedSlots: {customRender: "payPeople"}
		},
		{
			title    : "实收款（元）",
			dataIndex: "money",
			key      : "money"
		},
		{
			title    : "支付时间",
			dataIndex: "payTime",
			key      : "payTime"
		},
		{
			title    : "状态",
			dataIndex: "orderStatus",
			key      : "orderStatus"
		},
		{
			title    : "收货人",
			dataIndex: "receiverName",
			key      : "receiverName"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : "140px",
			scopedSlots: {customRender: "action"}
		}
	];
	const columnsTB = [
		{
			title    : "类型",
			dataIndex: "type",
			key      : "type",
		},
		{
			title    : "店铺名称",
			dataIndex: "storeName",
			key      : "storeName"
		},
		{
			title    : "订单编号",
			dataIndex: "orderNo",
			key      : "orderNo"
		},
		{
			title      : "支付宝账号",
			dataIndex  : "name",
			key        : "name",
			scopedSlots: {customRender: "payPeople"}
		},
		{
			title    : "订单状态",
			dataIndex: "status",
			key      : "status"
		},
		{
			title      : "收货人姓名/手机号",
			dataIndex  : "receiverName",
			key        : "receiverName",
			scopedSlots: {customRender: "receiverName"}
		},
		{
			title      : "商品标题/购买数量",
			dataIndex  : "goodName",
			key        : "goodName",
			width      : '180px',
			scopedSlots: {customRender: "goodName"}
		},
		{
			title    : "实际支付金额（元）",
			dataIndex: "money",
			key      : "money"
		},
		{
			title    : "支付时间",
			dataIndex: "payTime",
			key      : "payTime"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : "140px",
			scopedSlots: {customRender: "action"}
		}
	];
	const detailColumns = [
		{
			title    : "名称",
			dataIndex: "title",
			key      : "title",
		},
		{
			title    : "数量",
			dataIndex: "num",
			key      : "num"
		},
		{
			title    : "单价",
			dataIndex: "price",
			key      : "price"
		},
	]
	export default {
		name      : 'HomeLeftContain',
		components: {},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				isShow          : false,
				spinning        : false,
				// 展示公众号id
				bindId          : "",
				type            : 1,  // 1智慧店铺 2有赞 3淘宝
				// 企业微信列表
				storeList       : [], // 店铺列表
				orderStatus     : [], // 订单状态
				statusList      : [], // 支付宝订单状态列表
				orderCode       : '', // 订单号
				payWays         : [], // 支付方式列表
				payWay          : [], // 支付方式
				payTime         : null, // 支付时间
				phone           : '', // 手机号
				cardNo          : '', // 卡号
				nickName        : '', // 昵称/姓名
				// 订单类型列表   有赞
				orderTypeList   : [
					{
						key : '0',
						name: '普通订单'
					}, {
						key : '1',
						name: '送礼订单'
					}, {
						key : '2',
						name: '代付'
					}, {
						key : '3',
						name: '分销采购单'
					}, {
						key : '4',
						name: '赠品'
					}, {
						key : '5',
						name: '心愿单'
					}, {
						key : '6',
						name: '二维码订单'
					}, {
						key : '7',
						name: '合并付货款'
					}, {
						key : '8',
						name: '1分钱实名认证'
					}, {
						key : '9',
						name: '品鉴'
					}, {
						key : '10',
						name: '拼团'
					}, {
						key : '15',
						name: '返利'
					}, {
						key : '35',
						name: '酒店'
					}, {
						key : '40',
						name: '外卖'
					}, {
						key : '41',
						name: '堂食点餐'
					}, {
						key : '46',
						name: '外卖买单'
					}, {
						key : '51',
						name: '全员开店'
					}, {
						key : '61',
						name: '线下收银台订单'
					}, {
						key : '71',
						name: '美业预约单'
					}, {
						key : '72',
						name: '美业服务单'
					}, {
						key : '75',
						name: '知识付费'
					}, {
						key : '81',
						name: '礼品卡'
					}, {
						key : '100',
						name: '批发'
					}
				],
				// 订单类型 有赞
				orderType       : [],
				// 订单状态 有赞
				refundStatus    : [],
				refundStatusList: [],
				// 是否是会员 有赞
				isMember        : [],
				columns,
				columnsYZ,
				columnsTB,
				orderList       : [], // 订单列表
				page            : 1,
				pageSize        : 15,
				total           : 0,
				quickJumper     : false,
				detailVisible   : false, // 详情弹窗
				tbDetailVisible : false, // 淘宝详情弹窗
				orderDetail     : {}, // 订单详情
				detailColumns,
			}
		},
		created () {

		},
		mounted () {

			this.getStore()
			this.getOrderType()
		},
		methods   : {
			goAppCenter() {
				this.$router.push('/appCenter/list')
			},
			goStore () {
				this.$router.push('/thirdPartyStore/store')
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 有赞订单状态
			async getOrderType () {
				const {data: res} = await this.axios.post("third-store/youzan-order-status");
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.refundStatusList = res.data
				}
			},
			// 获取店铺
			async getStore () {
				this.isLoading = true
				const {data: res} = await this.axios.post(
					"third-store/get-merchants",
					{
						isAll: 1,
						uid  : localStorage.getItem('uid'),
						storeType : this.$route.query.type
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.storeList = res.data.info
					if (this.storeList.length > 0) {
						this.bindId = this.storeList[0].key
						this.type = this.$route.query.type
						if (this.type == 1) {
							this.getPayWay()
							this.getOrder()
						} else if (this.type == 2) {
							this.getOrder()
						} else if (this.type == 3 || this.type == 4) {
							this.getTaoBaoOrderStatus()
							this.getOrder()
						}
					} else {
						this.isShow = true
					}
				}
			},
			// 获取支付方式
			async getPayWay () {
				const {data: res} = await this.axios.post(
					"third-store/pay-type-list",
					{
						bindId: this.bindId
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.payWays = res.data
				}
			},
			// 切换企业微信
			changeStoreId (id) {
				this.type = this.$route.query.type
				this.bindId = id
				this.clear()
				if (this.type == 3 || this.type == 4) {
					this.getTaoBaoOrderStatus()
				} else {
					this.getPayWay()
				}
			},
			async getTaoBaoOrderStatus () {
				const {data: res} = await this.axios.post(
					"third-store/taobao-status",
					{
						uid: localStorage.getItem('uid')
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.statusList = res.data
				}
			},
			// 获取订单
			async getOrder (page = 1, pageSize = this.pageSize) {
				this.spinning = true
				let params = {
					bindId   : this.bindId,
					page     : page,
					pageSize : pageSize,
					orderCode: this.orderCode,
					payTime  : this.payTime && this.payTime.length > 1 ? [moment(this.payTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(this.payTime[1]).format('YYYY-MM-DD HH:mm:ss')] : null,
					phone    : this.phone,
					nickName : this.nickName,
					type     : 2,
				}
				if (this.type == 1) {
					params['payWay'] = typeof this.payWay == "undefined" ? '-1' : (this.payWay.length == 0 ? '-1' : this.payWay)
					params['cardNo'] = this.cardNo
					params['orderStatus'] = this.orderStatus
				} else if (this.type == 2) {
					params['payWay'] = typeof this.payWay == "undefined" ? '-1' : (this.payWay.length == 0 ? '-1' : this.payWay)
					params['isMember'] = typeof this.isMember == "undefined" ? '-1' : (this.isMember.length == 0 ? '-1' : this.isMember)
					params['orderStatus'] = typeof this.refundStatus == "undefined" ? '0' : (this.refundStatus.length == 0 ? '0' : this.refundStatus)
					params['orderType'] = typeof this.orderType == "undefined" ? '-1' : (this.orderType == 0 ? '-1' : this.orderType)
				} else if (this.type == 3 || this.type == 4) {
					params['orderStatus'] = this.orderStatus
				}
				const {data: res} = await this.axios.post(
					"third-store/get-orders", params);
				if (res.error != 0) {
					this.spinning = false
					this.$message.error(res.error_msg);
				} else {
					this.orderList = res.data.info
					this.total = parseInt(res.data.count)
					this.page = page
					this.pageSize = pageSize
					this.spinning = false
				}
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			// 修改支付时间
			changeTime (date, dateString) {
				this.payTime = date
			},
			// 搜索
			find () {
				if (!this.payTime || this.payTime.length == 0) {
					this.payTime = null
				}
				this.getOrder()
			},
			// 清除
			clear () {
				this.orderStatus = []
				this.orderCode = ''
				this.payWay = []
				this.refundStatus = []
				this.payTime = null
				this.isMember = []
				this.orderType = []
				this.cardNo = ''
				this.phone = ''
				this.nickName = ''
				this.getOrder()
			},
			downloadTemplate () {
				let eleLink = document.createElement('a')
				eleLink.download = "订单模板"
				eleLink.href = this.$store.state.commonUrl + '/upload/taobaoOrder.xlsx'
				eleLink.click()
				eleLink.remove()
			},
			async beforeUpload (file) {
				const extension = file.name.split('.')
				if (extension[extension.length - 1] !== 'csv') {
					this.$message.warning('上传模板只能是csv格式!')
					return
				}
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'))
				params.append("sign_id", this.bindId)
				params.append("importFile", file)
				const {data: res} = await this.axios.post(
					"third-store/taobao-export-csv", params
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.$message.success(res.data.textHtml)
					this.getTaoBaoOrderStatus()
					this.getOrder()
				}
			},
			// 订单详情
			async detial (id) {
				const {data: res} = await this.axios.post(
					"third-store/order-info",
					{
						bindId : this.bindId,
						orderId: id,
						type   : 2
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.orderDetail = res.data
					if (this.type == 3 || this.type == 4) {
						this.tbDetailVisible = true
					} else {
						this.detailVisible = true
					}

				}
			},
			// 取消详情
			cancelDetail () {
				this.detailVisible = false
				this.tbDetailVisible = false
			},
			// 改变页数
			changePage (page, pageSize) {
				this.getOrder(page, this.pageSize)
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			// 改变页码
			showSizeChange (page, pageSize) {
				this.getOrder(this.page, pageSize)
			},
			moment,
		}
	}
</script>

<style scoped>
	.page-title {
		font-size: 16px;
		height: 50px;
		line-height: 50px;
		padding-left: 20px;
		margin-bottom: 15px;
		background-color: #FFFFFF;
	}

	.home-left-contain {
		width: 100%;
		height: calc(100% - 20px);
		padding: 0 20px;
	}

	.tabs-contain {
		background-color: #FFFFFF;
	}

	.store-list-tab >>> .ant-tabs-nav-container {
		height: 50px !important;
	}

	.store-list-tab >>> .ant-tabs-tab {
		height: 50px !important;
		line-height: 50px !important;
		margin-right: 0px !important;
		/*margin-top: -1px !important;*/
		/*border-bottom: 1px solid #E9E9E9 !important;*/
		border: 0px !important;
		background-color: #F5F5F5 !important;
	}

	.store-list-tab >>> .ant-tabs-tab div {
		max-width: 190px;
		min-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.store-list-tab >>> .ant-tabs-tab-active {
		background-color: #FFFFFF !important;
		border-bottom: 0px !important;
	}

	/deep/ .ant-tabs-content {
		padding-bottom: 0px !important;
	}

	.spinning-true {
		width: 100%;
	}

	.account-filter {
		background-color: #FFF;
		min-height: 100%;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.select-col {
		display: inline-block;
		margin-right: 5px;
		margin-bottom: 15px;
	}

	.name-weight-space {
		display: inline-block;
		/*font-weight: 700;*/
		margin-left: 10px;
	}

	.name-weight {
		display: inline-block;
		/*font-weight: 700;*/
	}

	.name-space {
		display: inline-block;
		margin-left: 10px;
	}

	.form-border {
		border: 1px solid #C3C3C3;
	}

	.empty-img {
		position: absolute;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
		text-align: center;
	}

	.empty-txt {
		width: 665px;
		margin-top: 20px;
		font-size: 16px;
	}

	.empty-btn {
		width: 110px;
		height: 40px;
		font-size: 16px;
		line-height: 40px;
	}
</style>
