<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider>
					<div class="sider-title">第三方店铺筛选</div>
					<!-- 企业微信 -->
					<div ref="scroll" @mousewheel="scrollWheel" class="sider-content"
					     style="width: 100%; height: 100%;overflow: hidden; position: absolute;"
					     @mouseover="scroll" @mouseout="scrollOut" @mousemove="scroLineMove" @mouseup="scroLineUp">
						<div ref="scroLeft"
						     class="sider-content"
						     style="position: fixed;top: 114px;bottom: 0px;width: 250px;"
						>
							<div class="sider-one">
								<div class="sider-one-txt">选择店铺</div>
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 200px;"
										@change="handleChange"
										v-model="bindId"
								>
									<template v-for="item in storeList">
										<a-select-option :value="item.key">{{item.username}}
										</a-select-option>
									</template>
								</a-select>
							</div>
							<div v-if="userInfo.length > 0 && type == 1"
							     style="display: inline-block;width: 100%;padding: 0 20px;">
								<div v-for="(item, index) in userInfo" style="padding: 10px 10px;"
								     :class="index == userInfo.length - 1 ? '': 'bottom-dashed'">
									<div class="col">
										<label style="width: 100px;">
											卡号：
											<a-tooltip placement="top">
												<template slot="title">
													<span v-if="item.cardNo && item.cardNo != ''">{{item.cardNo}}</span>
												</template>
												<span style="display: inline-block; width: 130px;overflow: hidden;text-overflow: ellipsis;vertical-align: top;"
												      v-if="item.cardNo && item.cardNo != ''"
												>
															{{item.cardNo}}
														</span>
											</a-tooltip>
											<span v-if="!item.cardNo">暂无</span>
										</label>
									</div>
									<div class="col">
										<label style="width: 100px;">
											等级：
											<span v-if="item.gradeName && item.gradeName != ''">
														{{item.gradeName}}
													</span>
											<span v-else>暂无</span>
										</label>
									</div>
									<div class="col">
										<label style="width: 100px;">
											积分：
											<span v-if="item.points && item.points != ''">{{item.points}}</span>
											<span v-else>暂无</span>
										</label>
									</div>
									<div class="col">
										<label style="width: 100px;">
											余额：
											<span v-if="item.money && item.money != ''">{{item.money}}</span>
											<span v-else>暂无</span>
										</label>
									</div>
									<div class="col">
										<label style="width: 100px;">
											激活状态：
											<span v-if="item.status && item.status != ''">{{item.status}}</span>
											<span v-else>暂无</span>
										</label>
									</div>
								</div>
							</div>
						</div>
						<div ref="scroRight" class="scro-right" @mouseup="jumpScroll">
							<div v-show="scrollFlag && scroRight" ref="scroLine" class="scro-line"
							     @mousedown="scroLineDown">
							</div>
						</div>
					</div>
				</a-layout-sider>
				<a-layout style="position: absolute;left:250px;top:0;bottom:0;right:0;" class="fans-content">
					<!-- 头部 -->
					<a-layout-header>
						客户【{{name}}】
						<router-link to="/customManage/list" style="font-size: 16px;float: right;">
							<a-button type="primary" icon="rollback">返回列表</a-button>
						</router-link>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-hd">
							<a-select v-if="type == 1"
							          showSearch
							          :allowClear=true
							          optionFilterProp="children"
							          style="width: 180px;margin-bottom: 10px;margin-right: 10px;"
							          placeholder="选择会员卡号"
							          v-model="cardNo"
							>
								<template v-for="item in userInfo">
									<a-select-option :value="item.cardNo">{{item.cardNo}}</a-select-option>
								</template>
							</a-select>
							<a-input :allowClear=true style="width: 180px;margin-bottom: 10px;margin-right: 10px;" @keyup.enter="getOrderList(1, pageSize)"
							         v-model="orderCode" placeholder="请输入订单号"></a-input>
							<a-select
									v-if="type == 1"
									showSearch
									:allowClear=true
									optionFilterProp="children"
									style="width: 160px;margin-bottom: 10px;margin-right: 10px;"
									placeholder="选择订单状态"
									v-model="orderStatus"
							>
								<a-select-option value="1">未退款</a-select-option>
								<a-select-option value="2">已退款</a-select-option>
							</a-select>
							<a-input
									@keyup.enter="getOrderList(1, pageSize)"
									v-if="type == 3 || type == 4"
									allowClear
									placeholder="支付宝帐号/会员名称查询"
									style="width: 180px;margin-bottom: 10px;margin-right: 10px;"
									v-model="phone"
							/>
							<a-select
									v-if="type == 1"
									showSearch
									:allowClear=true
									optionFilterProp="children"
									style="width: 180px;margin-bottom: 10px;margin-right: 10px;"
									placeholder="选择门店"
									v-model="storeId"
							>
								<template v-for="item in storesList">
									<a-select-option :value="item.id">{{item.shop_name}} {{item.branch_name}}
									</a-select-option>
								</template>
							</a-select>
							<a-input
									@keyup.enter="getOrderList(1, pageSize)"
									v-if="type == 2"
									allowClear
									placeholder="手机号，支持尾号查询"
									style="width: 180px;margin-bottom: 10px;margin-right: 10px;"
									v-model="phone"
							/>
							<a-input
									@keyup.enter="getOrderList(1, pageSize)"
									v-if="type == 2"
									allowClear
									placeholder="昵称/姓名"
									style="width: 180px;margin-bottom: 10px;margin-right: 10px;"
									v-model="nickName"
							/>
							<a-select
									v-if="type == 2"
									allowClear
									showSearch
									optionFilterProp="children"
									placeholder="请选择订单类型"
									style="width: 180px;margin-bottom: 10px;margin-right: 10px;"
									v-model="orderType"
							>
								<a-select-option v-for="item in orderTypeList" :value="item.key">
									{{item.name}}
								</a-select-option>
							</a-select>
							<a-select
									v-if="type == 2"
									allowClear
									showSearch
									optionFilterProp="children"
									placeholder="请选择订单状态"
									style="width: 180px;margin-bottom: 10px;margin-right: 10px;"
									v-model="refundStatus"
							>
								<a-select-option v-for="item in refundStatusList" :value="item.key">
									{{item.name}}
								</a-select-option>
							</a-select>
							<a-select
									v-if='type == 3 || type == 4'
									allowClear
									showSearch
									optionFilterProp="children"
									placeholder="请选择订单状态"
									style="width: 160px;margin-bottom: 10px;margin-right: 10px;"
									v-model="orderStatus"
							>
								<a-select-option v-for="item in statusList" :value="item.id">
									{{item.title}}
								</a-select-option>
							</a-select>
							<a-select
									v-if="type == 2"
									allowClear
									showSearch
									optionFilterProp="children"
									placeholder="是否是会员订单"
									style="width: 180px;margin-bottom: 10px;margin-right: 10px;"
									v-model="isMember"
							>
								<a-select-option :value="'1'">会员订单</a-select-option>
								<a-select-option :value="'0'">非会员订单</a-select-option>
							</a-select>
							<a-range-picker
									style="margin-bottom: 10px;margin-right: 10px;width: 330px;"
									:show-time="{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }"
									format="YYYY-MM-DD HH:mm:ss"
									allowClear
									:disabled-date="disabledDate"
									v-model="payTime"
									@change="changeTime"
							/>
							<a-button type="primary" style="margin: 0 10px 0 0;" @click="getOrderList(1, pageSize)">搜索
							</a-button>
							<a-button @click="clear">清空</a-button>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table
										:columns="type == 1 ? columns : (type == 2 ? columnsYZ : columnsTB)"
										:dataSource="orderList"
										:pagination="false"
										:rowClassName="rowClassName"
								>
										<span slot="payPeople" slot-scope="text, record">
											<p>{{record.name}}</p>
											<p>{{record.nickname}}</p>
											<p>{{record.phone}}</p>
											<p>{{record.card_no}}</p>
										</span>
									<span slot="receiverName" slot-scope="text, record">
											<p>{{record.receiverName}}</p>
											<p>{{record.receiverPhone}}</p>
										</span>
									<span slot="goodName" slot-scope="text, record">
											<p>{{record.goodName}} （x{{record.babyNum}}）</p>
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
										              :pageSizeOptions="['15','20','30','60']"
										              @change="changePage"
										              @showSizeChange="showSizeChange"/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>
				</a-layout>
			</a-layout>
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
					<a-form-item v-if="type == 1" label="商品名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
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
					<a-form-item v-if="orderDetail.refund == 2 && type == 1" label="退款时间" :label-col="{ span: 4 }"
					             :wrapper-col="{ span: 20 }">
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
					<a-form-item v-if="orderDetail.goods_describe" :label="orderDetail.refund == 0 ? '订单备注' : '退款备注'"
					             :label-col="{ span: 4 }"
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
						<img :src="goods.pic_path" style="width: 100px;height: 100px;vertical-align: bottom;">
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
	</div>
</template>

<script>
	import moment from "moment";

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
	];
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
			width      : "15%",
			key        : "action",
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
			width      : "15%",
			key        : "action",
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
			title      : "买家支付宝账号（购物账号）",
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
			title    : "买家实际支付金额（元）",
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
	export default {
		data () {
			return {
				//滚动条
				mouseEnterFlag  : false,
				startY          : 0,
				scrollFlag      : false,
				scroRight       : true,
				scrollOutFlag   : false,
				// 店铺ID
				isLoading       : false,
				id              : '', // 客户id
				name            : '', // 客户名称
				storeList       : [], // 店铺列表
				type            : 1,
				userInfo        : [], // 课户信息
				orderList       : [], // 订单列表
				storesList      : [], // 门店列表
				bindId          : '', // 选中的店铺id
				cardNo          : [], // 卡号
				orderCode       : '', // 订单号
				phone           : '',
				orderStatus     : [], // 订单状态
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
				refundStatus    : [],
				refundStatusList: [],
				nickName        : '',
				orderType       : [],
				isMember        : [],
				payTime         : null, // 支付时间
				storeId         : [], // 门店id
				columns,
				columnsYZ,
				columnsTB,
				total           : 0,
				page            : 1,
				pageSize        : 15,
				quickJumper     : false,
				detailVisible   : false, // 详情弹窗
				orderDetail     : {}, // 详情数据
				statusList      : [], // 淘宝订单状态
				tbDetailVisible : false,
				detailColumns,
			};
		},

		methods: {
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 改变店铺
			handleChange () {
				this.type = this.storeList[this.storeList.findIndex(x => this.bindId == x.key)].type
				if (this.type == 1) {
					this.getStoresList()
				}
				this.clear()
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
			// 获取店铺列表
			async getStoreList () {
				const {data: res} = await this.axios.post("third-store/bind-merchants", {
					uid     : localStorage.getItem('uid'),
					customId: this.id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.storeList = res.data
					if (this.storeList.length != 0) {
						this.bindId = this.storeList[0].key
						this.type = this.storeList[0].type
						if (this.type == 1) {
							this.getMembers()
							this.getStoresList()
						} else {
							this.getOrderList()
							if (this.type == 3 || this.type == 4) {
								this.getTaoBaoOrderStatus()
							}
						}
					}
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
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			// 改变页数
			changePage (page, pageSize) {
				this.getOrderList(page, this.pageSize)
			},
			// 改变页码
			showSizeChange (page, pageSize) {
				this.getOrderList(this.page, pageSize)
			},
			// 支付时间
			changeTime (date, dateString) {
				this.payTime = date
			},
			// 获取门店列表
			async getStoresList () {
				const {data: res} = await this.axios.post("third-store/get-stores", {
					bindId: this.bindId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.storesList = res.data
				}
			},
			// 获取客户信息
			async getMembers () {
				const {data: res} = await this.axios.post("third-store/get-bind-members", {
					id: this.bindId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.userInfo = res.data
					this.getOrderList()
				}
			},
			// 获取订单列表
			async getOrderList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				let memberId = []
				for (let user of this.userInfo) {
					memberId.push(user.memberId)
				}
				let params = {
					bindId   : this.bindId,
					page     : page,
					pageSize : pageSize,
					orderCode: this.orderCode,
					payTime  : this.payTime && this.payTime.length > 1 ? [moment(this.payTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(this.payTime[1]).format('YYYY-MM-DD HH:mm:ss')] : null,
					phone    : this.phone,
					type     : 1,
					customId : this.id
				}
				if (this.type == 1) {
					params['memberId'] = memberId
					params['nickName'] = this.nickName
					params['payWay'] = typeof this.payWay == "undefined" ? '-1' : (this.payWay.length == 0 ? '-1' : this.payWay)
					params['cardNo'] = this.cardNo
					params['orderStatus'] = this.orderStatus.length == 0 ? '0' : this.orderStatus
					params['storeId'] = typeof this.storeId == "undefined" ? '' : (this.storeId.length == 0 ? '' : this.storeId)
				} else if (this.type == 2) {
					params['nickName'] = this.nickName
					params['payWay'] = typeof this.payWay == "undefined" ? '-1' : (this.payWay.length == 0 ? '-1' : this.payWay)
					params['isMember'] = typeof this.isMember == "undefined" ? '-1' : (this.isMember.length == 0 ? '-1' : this.isMember)
					params['orderStatus'] = typeof this.refundStatus == "undefined" ? '0' : (this.refundStatus.length == 0 ? '0' : this.refundStatus)
					params['orderType'] = typeof this.orderType == "undefined" ? '-1' : (this.orderType == 0 ? '-1' : this.orderType)
				} else if (this.type == 3 || this.type == 4) {
					params['orderStatus'] = this.orderStatus
				}
				const {data: res} = await this.axios.post("third-store/get-orders", params);
				if (res.error != 0) {
					this.spinning = false
					this.$message.error(res.error_msg);
				} else {
					this.orderList = res.data.info
					this.total = parseInt(res.data.count)
					this.page = page
					this.pageSize = pageSize
					this.isLoading = false
				}
			},
			// 清除筛选
			clear () {
				if (this.type == 1) {
					this.cardNo = []
					this.orderCode = ''
					this.orderStatus = []
					this.payTime = null
					this.storeId = []
					this.getMembers()
				} else if (this.type == 2) {
					this.orderCode = ''
					this.phone = ''
					this.nickName = ''
					this.orderType = []
					this.isMember = []
					this.refundStatus = []
					this.payTime = null
					this.getOrderList()
				} else if (this.type == 3 || this.type == 4) {
					this.orderCode = ''
					this.phone = ''
					this.orderStatus = []
					this.payTime = null
					this.getOrderList()
					this.getTaoBaoOrderStatus()
				}

			},
			// 获取详情
			async detial (id) {
				const {data: res} = await this.axios.post(
					"third-store/order-info",
					{
						bindId : this.bindId,
						orderId: id,
						type   : 1
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
				this.tbDetailVisible = false
				this.detailVisible = false
			},
			// 滚动条高度
			setScroLineHeight () {
				let that = this
				let winHeight = 0;
				winHeight = that.$refs.scroLeft.clientHeight;
				if (winHeight >= that.$refs.scroLeft.scrollHeight) {
					that.scroRight = false
				} else {
					// that.$refs.scroLine.style.height = "200px"
					that.$refs.scroLine.style.height = (winHeight - 50) / that.$refs.scroLeft.scrollHeight * (that.$refs.scroRight.scrollHeight - 50) + "px";
					that.scroRight = true
				}
			},
			// 滑轮滚动（火狐）
			initFirefoxScroll () {
				let that = this
				if (document.addEventListener) {
					document.addEventListener('DOMMouseScroll', function (e) {
						let event1 = window.event || e;
						let Y = that.$refs.scroLeft.scrollTop;
						let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
						if (event1.detail >= 0) {
							Y = Y + 80
						} else {
							Y = Y - 80
						}
						if (Y < 0) Y = 0;
						if (Y > H - 50) Y = H;
						that.$refs.scroLeft.scrollTop = Y;
						let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
						if (Y > 0 && Y < H - 50) {
							SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
						}
						if (SH > this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight) {
							SH = this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight
						}
						if (SH < 0) SH = 0;
						that.$refs.scroLine.style.top = SH + "px";
					}, false)
				}
			},
			// 滑轮滚动
			scrollWheel () {
				var event = event ? event : (window.event ? window.event : null);
				let Y = this.$refs.scroLeft.scrollTop;
				let H = this.$refs.scroLeft.scrollHeight - this.$refs.scroLeft.clientHeight;
				if (event.wheelDelta >= 120) {
					Y = Y - event.wheelDelta * 0.5
				} else {
					Y = Y - event.wheelDelta * 0.5
				}
				if (Y < 0) Y = 0;
				if (Y > H) Y = H;
				this.$refs.scroLeft.scrollTop = Y;
				let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
				if (Y > 0 && Y < H) {
					SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
				}
				if (SH < 0) SH = 0;
				this.$refs.scroLine.style.top = SH + "px";
			},
			// 滚动栏点击跳转
			jumpScroll () {
				let that = this
				if (!that.mouseEnterFlag) {
					var event = event ? event : (window.event ? window.event : null);
					let Y = that.$refs.scroLeft.scrollTop;
					let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
					if (event.y - that.startY >= 0) {
						Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
					} else {
						Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
					}
					that.$refs.scroLeft.scrollTop = Y;
					if (Y < 0) {
						Y = 0;
					}
					if (Y > H) {
						Y = H;
					}
					let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
					if (Y > 0 && Y < H) {
						SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
					}
					if (SH < 0) SH = 0;
					that.$refs.scroLine.style.top = SH + "px";
					that.startY = event.y
				}
			},
			// 滚动条点击
			scroLineDown () {
				this.mouseEnterFlag = true
				this.startY = event.y;  // 按下鼠标指针的y轴坐标
				if (window.addEventListener) {
					window.addEventListener('mouseup', this.scroLineUp, false)
					window.addEventListener('mousemove', this.scroLineMove, false)
				}
				this.banUserSelect();
			},
			// 滚动条长按移动
			scroLineMove () {
				let that = this
				if (that.mouseEnterFlag) {
					var event = event ? event : (window.event ? window.event : null);
					let Y = that.$refs.scroLeft.scrollTop;
					let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
					let CH = (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight;
					Y = Y + CH;
					that.$refs.scroLeft.scrollTop = Y;
					if (Y < 0) {
						Y = 0;
					}
					if (Y > H) {
						Y = H;
					}
					let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
					if (Y > 0 && Y < H) {
						SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
					}
					if (SH < 0) SH = 0;
					that.$refs.scroLine.style.top = SH + "px";

					that.startY = event.y;
				}
			},
			// 鼠标左击抬起
			scroLineUp () {
				if (this.mouseEnterFlag == true) {
					var event = event ? event : (window.event ? window.event : null);
					this.mouseEnterFlag = false
					if (this.changeWidthSmallFlag) {
						this.changeWidthSmall()
						this.changeWidthSmallFlag = false
					}
					if (this.scrollOutFlag) {
						this.scrollOut()
						this.scrollOutFlag = false
					}
					if (window.removeEventListener) {
						window.removeEventListener('mouseup', this.scroLineUp, false)
						window.removeEventListener('mousemove', this.scroLineMove, false)
					}
					this.userSelect()
				}
			},
			// 鼠标进入左边页面
			scroll () {
				this.scrollFlag = true
			},
			// 鼠标移出左边页面
			scrollOut () {
				if (!this.mouseEnterFlag) {
					this.scrollFlag = false
				}
				this.scrollOutFlag = true
			},
			banUserSelect () {
				this.$refs.fansList.style.MozUserSelect = 'none'
				this.$refs.fansList.style.UserSelect = 'none'
				this.$refs.fansList.style.webkitUserSelect = 'none'
				this.$refs.fansList.style.MsUserSelect = 'none'
			},
			userSelect () {
				this.$refs.fansList.style.MozUserSelect = 'text'
				this.$refs.fansList.style.UserSelect = 'text'
				this.$refs.fansList.style.webkitUserSelect = 'text'
				this.$refs.fansList.style.MsUserSelect = 'text'
			},
			moment,
		},
		mounted () {
			this.id = this.$route.query.id
			this.name = decodeURIComponent(this.$route.query.name)
			//滚动条
			let observer = new MutationObserver(this.setScroLineHeight)
			observer.observe(this.$refs.scroLine, {
				attributes       : true,
				attributeFilter  : ['style'],
				attributeOldValue: true
			})
			this.setScroLineHeight()
			this.initFirefoxScroll()
			this.getStoreList()
			this.getOrderType()
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.form-border {
		border: 1px solid #C3C3C3;
	}

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}


	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
		border-right: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		width: 100%;
		padding-right: 40px;
	}

	.content-hd {
		margin-top: 10px;
		/*height: 60px;*/
		width: 100%;
		min-width: 885px;
		/*line-height: 60px;*/
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.sider-one {
		height: 113px;
		border-bottom: 1px solid #E2E2E2;
		padding: 0 20px;
		margin-bottom: 10px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.sider-footer {
		position: fixed;
		height: 50px;
		width: 250px;
		bottom: 0;
		background-color: #FFF;
		border-top: 1px solid #E2E2E2;
		padding-top: 10px;
		z-index: 999;
		text-align: center;
	}

	/*滚动条背景*/
	.scro-right {
		position: relative;
		float: right;
		/*height: 100%;*/
		height: 100%;
		height: calc(100% - 50px) !important;
		/*height: -moz-calc(100% - 50px);*/
		/*height: -webkit-calc(100% - 50px);*/
		width: 3px;
		background-color: #FFF;
		overflow: hidden;
	}

	/*滚动条*/
	.scro-line {
		position: absolute;
		z-index: 1;
		top: 0px;
		right: 0px;
		width: 3px;
		border-radius: 3px;
		/*height: 100px;*/
		overflow: hidden;
		background-color: #D3D3D3;
	}

	.sider-content {
		float: left;
		width: 100%;
		width: calc(100% - 3px);
		width: -moz-calc(100% - 3px);
		width: -webkit-calc(100% - 3px);
		max-height: 100%;
		overflow: hidden;
	}

	.sider-title {
		height: 50px;
		width: 250px;
		border-bottom: 1px solid #E2E2E2;
		line-height: 50px;
		text-align: center;
	}

	.list {
		overflow-y: hidden;
	}

	.bottom-dashed {
		border-bottom: 1px dashed #C3C3C3;
		margin-bottom: 5px;
	}

	.have-user-info {
		width: calc(100% - 200px);
	}

	.no-have-info {
		width: 100%;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.col {
		margin-bottom: 5px;
	}
</style>
