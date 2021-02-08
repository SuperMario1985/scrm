<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider v-if="isEWechat">
					<!-- 企业微信 -->
					<eWechat @changeWxId="handleWxId"></eWechat>
				</a-layout-sider>
				<a-layout style="position: absolute;top:0;bottom:0;right:0;" class="scroll"
				          :style="{left:isEWechat?'250px':'0px'}">
					<!-- 头部 -->
					<a-layout-header>红包管理</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								向客户/客户群派发红包，是维护客情关系的利器之一。其不仅能够刺激消费 , 拉近客户感情 , 还能增强互动
								,维护品牌的忠诚度。鉴于此，我们基于企业微信，通过企业微信聊天侧边栏，快速向客户/客户群派发红包，客户领取后，钱直接进入到客户的微信零钱里。
							</p>
							<p style="margin-bottom: 2px;color: #FF562D;">
								若红包已发送到客户/客户群里，但客户尚未领取，此时微信支付商户平台出现账户余额不足时，客户打开红包页面无法领取，请务必保证账户余额充足，避免客户投诉。
							</p>
							<p style="margin-bottom: 2px;color: #FF562D;">
								在使用派发红包功能前，需要商户完成以下配置：
							</p>
							<p style="margin-bottom: 2px;">
								1、前往<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
								       target="_blank">【微信支付商户平台】</a>注册微信支付商户号
							</p>
							<p style="margin-bottom: 2px;">
								2、登录<a href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu"
								       target="_blank">【企业微信后台】</a>开通企业支付，绑定已有商户号（<a
									href="https://support.qq.com/products/104790/faqs/66072" target="_blank">查看教程</a>）
							</p>
							<p style="margin-bottom: 2px;">
								3、登录<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
								       target="_blank">【微信支付商户平台】</a>开通【企业付款到零钱】（<a
									href="https://support.qq.com/products/104790/faqs/66076" target="_blank">查看教程</a>）
							</p>
							<p style="margin-bottom: 2px;">
								4、在本系统，进入【应用中心】--【企业支付】，点击，填入企业支付的应用ID和Secret
							</p>
							<p style="margin-bottom: 2px;">
								5、在本系统，进入【应用中心】--【企业支付】，点击，完成支付配置。（<a
									href="https://support.qq.com/products/104790/faqs/66058" target="_blank">查看教程</a>）
							</p>
						</div>
						<div class="content-hd">
							<a-select v-model="status" style="width: 120px" @change="selectStatus" placeholder="使用状态">
								<a-select-option value="0">全部状态</a-select-option>
								<a-select-option value="1">启用</a-select-option>
								<a-select-option value="2">禁用</a-select-option>
							</a-select>
							<a-col style="float:right;">
								<a-button style="margin: 0 10px;" icon="plus" @click="addFixedAmount(1)" type="primary"
								          v-has="'redPack-add-money'">
									添加固定金额
								</a-button>
								<a-button @click="openSetFixedAmount(2)"
								          v-has="'redPacket-limit'">
									客户限额
								</a-button>
								<a-modal title="更换自建应用" v-model="changeAppVisible" @ok="changeAppOk"
								         :confirmLoading="confirmLoading" style="height: 500px"
								         @cancel="changeAppCancel">
									<a-form-model
											ref="ruleForm"
											:model="changeAppForm"
											:rules="rules"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 18 }"
									>
										<a-form-model-item label="选择企业微信" prop="corpId">
											<div style="display: inline-block;cursor: pointer;" @click="changeCorp">
												<img src="../../../assets/WeChatLogo.jpg"
												     style="width: 24px;margin: -3px 6px 0 0;"/>
												<span>{{changeAppForm.corpName}}</span>
												<a-icon type="caret-down"
												        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
												/>
											</div>
										</a-form-model-item>
										<a-form-model-item label="选择应用" prop="app">
											<a-select
													showSearch
													optionFilterProp="children"
													v-model="changeAppForm.agent_id"
											>
												<template v-for="(item,index) in agentList">
													<a-select-option :value="item.id">
														{{item.name}}
													</a-select-option>
												</template>
											</a-select>
										</a-form-model-item>
									</a-form-model>
									<linkAgent :corpId="corpId" :showAddAgent="showAddAgentModal" :agent_is_money='1'
									           @addOk="addOk" @linkOk="linkOk" @addCancel="addCancel"></linkAgent>
								</a-modal>
								<a-modal title="添加固定金额" v-model="addFixedAmountVisible" @ok="handleOk"
								         :confirmLoading="confirmLoading" style="height: 500px" @cancel="cancel">
									<a-form-item :label-col="{ span: 6 }"
									             :wrapper-col="{ span: 18 }">
										<template slot="label">
											<span style="color: red;">*</span>红包金额
										</template>
										<a-input-number :step="0" :precision="2"
										                v-model="money" placeholder="请输入金额" style="width: 250px"/>
										<p style="font-size: 13px;color: #909399;margin-bottom: 0;">
											精确到小数点后两位，可输入0.30~5000.00</p>
									</a-form-item>
									<a-form-item :label-col="{ span: 6 }"
									             :wrapper-col="{ span: 18 }">
										<template slot="label">
											红包状态
										</template>
										<a-select v-model="addStatus" style="width: 160px" placeholder="使用状态">
											<a-select-option value="1">启用</a-select-option>
											<a-select-option value="2">禁用</a-select-option>
										</a-select>
									</a-form-item>
								</a-modal>
								<a-modal title="客户限额设置" v-model="setVisible" @ok="setHandleOk"
								         :confirmLoading="setConfirmLoading" style="height: 500px" @cancel="setCancel"
								         width="675px">
									<div class="content-msg" style="margin:0 0 12px;">
										温馨提示：若在本系统所填写的数值超过在【微信支付商户平台】配置的数值，执行规则依然以官方配置为准，请合理填写。建议您先在【微信支付商户平台】---【产品中心】-【企业付款到零钱】--【产品设置】，将所有数值设置到官方最大值（如下），再到本系统里进行配置。
										<p style="margin-bottom: 2px;">a、商户号单日出款额度：10万</p>
										<p style="margin-bottom: 2px;">b、单人单日付款额度：5000元</p>
										<p style="margin-bottom: 2px;">c、单笔付款最低额度：0.30元， 默认每天最多可向同一个用户付款10次</p>
									</div>
									<div class="model-label">
										<div class="model-label-left">
											<span style="color: red;">*</span>商户号单日付款总额度：
										</div>
										<div class="model-label-right">
											<a-input-number :step="0" :precision="2"
											                v-model="singleDayTotalAmount" placeholder="请输入商户号单日付款总额度"
											                style="width: 300px;margin-right: 5px;"/>
											元
											<p class="model-label-right-p">
												精确到小数点后两位，可输入0.30~100000.00</p>
										</div>
									</div>
									<div class="model-label">
										<div class="model-label-left">
											<span style="color: red;">*</span>单日客户收到红包次数：
										</div>
										<div class="model-label-right">
											<a-input-number :step="0" :precision="0"
											                v-model="changeTimes" placeholder="请输入单日客户收到红包次数"
											                style="width: 300px;margin-right: 5px;"/>
											次
											<p class="model-label-right-p">
												可输入1~10正整数</p>
										</div>
									</div>
									<div class="model-label">
										<div class="model-label-left">
											<span style="color: red;">*</span>单日客户收到红包金额：
										</div>
										<div class="model-label-right">
											<a-input-number :step="0" :precision="2"
											                v-model="changeQuota" placeholder="请输入单日客户收到红包金额"
											                style="width: 300px;margin-right: 5px;"/>
											元
											<p class="model-label-right-p">
												精确到小数点后两位，可输入0.30~5000.00</p>
										</div>
									</div>
								</a-modal>
								<linkAgent :corpId="corpId" :showAddAgent="showAddAgentModal" :agent_is_money='1'
								           @addOk="addOk" @linkOk="linkOk" @addCancel="addCancel"></linkAgent>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="redManageList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'redPacket-list'">
									<div slot="money" slot-scope="text, record, index">
										{{record.money}}元
									</div>
									<div slot="send_num" slot-scope="text, record, index">
										{{record.send_num}}次
									</div>
									<div slot="send_money" slot-scope="text, record, index">
										{{(record.money * record.send_num).toFixed(2)}}元
									</div>
									<div slot="status" slot-scope="text, record, index">
										<span v-if="record.status == 1">启用</span>
										<span v-if="record.status == 2">禁用</span>
									</div>
									<div slot="action" slot-scope="text, record, index">
										<a-button
												v-if="record.status == 1"
												style="margin: 0px 5px 5px 0px;"
												@click="changeStatus(record.money_id, 2)" v-has="'redPack-active'">
											禁用
										</a-button>
										<a-button
												v-if="record.status == 2"
												style="margin: 0px 5px 5px 0px;"
												@click="changeStatus(record.money_id, 1)" v-has="'redPack-active'">
											启用
										</a-button>
										<a-button
												style="margin: 0px 5px 5px 0px;"
												@click="changeStatus(record.money_id, 3)" v-has="'redPack-del'">
											删除
										</a-button>
									</div>
								</a-table>
								<!--分页-->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'redPacket-list'">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total}}</span>条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
										              :current="page"
										              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
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
		<!-- 企业微信选择弹窗 -->
		<WeChatModal :show="showCoropation" :callback="coropationChange"
		             hasName="group-sending-add"></WeChatModal>

	</div>
</template>

<script>
	import eWechat from "@/components/eWeChat/eWechat.vue";
	import linkAgent from '@/components/addAgent/index.vue'
	import WeChatModal from "@/components/WeChatModal.vue"

	const columns = [
		{
			title      : "零钱金额",
			dataIndex  : "money",
			key        : "money",
			scopedSlots: {customRender: "money"},
		},
		{
			title      : "发送次数",
			dataIndex  : "send_num",
			key        : "send_num",
			scopedSlots: {customRender: "send_num"},
		},
		{
			title      : "发送金额",
			dataIndex  : "send_money",
			key        : "send_money",
			scopedSlots: {customRender: "send_money"},
		},
		{
			title    : "创建人",
			dataIndex: "user_name",
			key      : "user_name",
			width    : '15%',
		},

		{
			title      : "使用状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"},
		},

		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"},
		}
	];

	export default {
		components: {eWechat, linkAgent, WeChatModal},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				agent_id             : '',
				agentList            : [], // 公司应用列表
				isEWechat            : true,//左侧选择企业微信组件的显示与隐藏
				corpId               : corpId,//企业微信选中的id
				isLoading            : true, //Loading 组件显示与隐藏
				status               : '0',//使用状态
				redManageList        : [],//红包管理列表
				haveAgent            : 0,//0没有红包，1有
				//表格部分
				columns,
				//分页
				total                : 1, //总条数
				quickJumper          : false, // 是否显示快速跳转的控件
				page                 : 1, //页码
				pageSize             : 15, //每页数据条数，默认15
				deleteList           : [],//表格中删除列表
				addFixedAmountVisible: false,//添加固定金额弹窗显示与隐藏
				confirmLoading       : false, //添加固定金额弹框加载
				changeAppVisible     : false,//更换自建应用额弹窗显示与隐藏
				changeAppForm        : {agent_id: ''},  //更换自建应用
				money                : '', //添加固定金额弹框金额
				addStatus            : '1',//添加固定金额弹窗状态
				setVisible           : false,//添加固定金额弹窗显示与隐藏
				setConfirmLoading    : false, //添加固定金额弹框加载
				singleDayTotalAmount : '',//商户号单日付款总额度
				changeTimes          : '',//单日向每个客户付款到零钱次数上限
				changeQuota          : '',//单日每个客户收到零钱额度上限
				showAddAgentModal    : false,  // 是否打开应用添加modal
				addType              : '',//打开关联弹窗的方式，1添加固定金额，2设置
				suite_id             : 1,//应用ID
				showCoropation       : false,//选择企业弹框
				rules                : {
					corpId  : [{required: true, message: '请选择企业', trigger: 'blur'},],
					agent_id: [{required: true, message: '请选择应用', trigger: 'blur'},],
				},  //更换自建应用表单验证
			};
		},

		methods: {

			// 获取应用列表
			async getAgentList () {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id: localStorage.getItem('corpId'),
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.agentList = res.data
				}
			},
			addOk () {
				this.showAddAgentModal = false
				this.getRedManageList()
				if (this.addType == 1) {
					this.addFixedAmountVisible = true
				} else if (this.addType == 2) {
					this.setVisible = true
				}
			},
			linkOk () {
				this.showAddAgentModal = false
				this.getRedManageList()
				if (this.addType == 1) {
					this.addFixedAmountVisible = true
				} else if (this.addType == 2) {
					this.setFixedAmount()
				}
			},
			addCancel () {
				this.showAddAgentModal = false
			},
			//左侧企业微信
			handleWxId (value) {
				this.isLoading = true
				this.corpId = value
				this.getRedManageList()
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//改变使用状态
			selectStatus () {
				this.getRedManageList()
			},
			//添加固定金额
			addFixedAmount (val) {
				this.addType = val
				if (this.haveAgent == 0) {
					this.showAddAgentModal = true
				} else {
					this.addFixedAmountVisible = true
				}
			},
			async changeAppOk () {
				this.changeAppForm.agent_is_money = 1
				const {data: res} = await this.axios.post("work-agent/update-agent-use", this.changeAppForm);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.changeAppVisible = false
					this.$message.success('提交成功')
					this.getRedManageList()
				}
			},
			changeAppCancel () {
				this.changeAppForm.agent_id = this.agent_id
			},

			changeCorp () {
				this.showCoropation = true
			},
			handleOk () {
				if (this.money == '' || this.money == null) {
					this.$message.error('请填写金额');
					return false
				} else {
					if (this.money < 0.30 || this.money > 5000.00) {
						this.$message.error('红包金额必须在0.30~5000.00之间');
						return false
					}
				}
				this.add()
			},
			async add () {
				this.confirmLoading = true
				const {data: res} = await this.axios.post("send-money-manage/money-set-post", {
					uid            : localStorage.getItem('uid'),
					corp_id        : this.corpId,
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
					money          : this.money,
					status         : this.addStatus
				});
				if (res.error != 0) {
					this.confirmLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.confirmLoading = false
					this.addFixedAmountVisible = false
					this.money = ''
					this.addStatus = '1'
					this.getRedManageList()
				}
			},
			cancel () {
				this.money = ''
				this.addStatus = '1'
				this.addFixedAmountVisible = false
			},
			openChangeApp () {
				if (this.haveAgent == 0) {
					this.showAddAgentModal = true
				} else {
					this.changeAppForm.agent_id = this.agent_id
					this.changeAppVisible = true
					this.changeAppForm.corp_id = localStorage.getItem('corpId')
					this.changeAppForm.corpName = localStorage.getItem('corpName')
					this.getAgentList()
				}
			},
			coropationChange (type, corpId, corpName) {
				if (type == 'ok') {
					this.changeAppForm.corp_id = corpId
					this.changeAppForm.corpName = corpName
					this.rules.corpId = []
					this.getAgentList()
				} else {
					this.rules.corpId = [{required: true, message: '请选择企业', trigger: 'blur'},]
				}
				this.showCoropation = false
			},
			openSetFixedAmount () {
				if (this.haveAgent == 0) {
					this.showAddAgentModal = true
				} else {
					this.setFixedAmount()
				}
			},
			//设置
			async setFixedAmount () {
				const {data: res} = await this.axios.post("send-money-manage/money-send-limit", {
					uid    : localStorage.getItem('uid'),
					corp_id: this.corpId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.singleDayTotalAmount = res.data.money.day_sum_money
					this.changeTimes = res.data.money.day_external_num
					this.changeQuota = res.data.money.day_external_money
					this.setVisible = true
				}
			},
			setHandleOk () {
				if (this.singleDayTotalAmount === '' || this.singleDayTotalAmount == null) {
					this.$message.error('请输入商户号单日付款总额度');
					return false
				} else {
					if (this.singleDayTotalAmount < 0.30 || this.singleDayTotalAmount > 100000.00) {
						this.$message.error('商户号单日付款总额度必须在0.30~100000.00之间');
						return false
					}
				}
				if (this.changeTimes === '' || this.changeTimes == null) {
					this.$message.error('请输入单日向每个客户付款到零钱次数上限');
					return false
				} else {
					if (this.changeTimes < 1 || this.changeTimes > 10) {
						this.$message.error('单日向每个客户付款到零钱次数上限必须为1~10正整数');
						return false
					}
				}
				if (this.changeQuota === '' || this.changeQuota == null) {
					this.$message.error('请输入单日每个客户收到零钱额度上限');
					return false
				} else {
					if (this.changeQuota < 0.30 || this.changeQuota > 5000.00) {
						this.$message.error('单日每个客户收到零钱额度上限必须在0.30~5000.00之间');
						return false
					}
				}
				this.set()
			},
			async set () {
				this.setConfirmLoading = true
				const {data: res} = await this.axios.post("send-money-manage/money-send-limit-set", {
					uid               : localStorage.getItem('uid'),
					corp_id           : this.corpId,
					day_sum_money     : this.singleDayTotalAmount,
					day_external_num  : this.changeTimes,
					day_external_money: this.changeQuota
				});
				if (res.error != 0) {
					this.setConfirmLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.setConfirmLoading = false
					this.setVisible = false
					this.getRedManageList()
				}
			},
			setCancel () {
				this.setVisible = false
			},
			//获取表格内容
			async getRedManageList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("send-money-manage/money-set-list", {
					uid      : localStorage.getItem('uid'),
					corp_id  : this.corpId,
					status   : this.status,
					page     : page,
					page_size: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.agent_id = res.data.agentId.toString()
					this.redManageList = res.data.money;
					this.haveAgent = res.data.have_agent
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getRedManageList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 200)
				})
			},
			showSizeChange (page, pageSize) {
				this.getRedManageList(1, pageSize);
			},
			//改变状态
			changeStatus (money_id, value) {
				let that = this;
				let title = '确定删除选中的标签？'
				if (value == 1) {
					title = '一旦启用后，可以选择该零钱金额发送给客户，确定启用吗？'
				} else if (value == 2) {
					title = '一旦禁用后，该零钱金额无法发送给客户，确定禁用吗？'
				} else if (value == 3) {
					title = '一旦删除后，该零钱金额不存在，确定删除吗？'
				}
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.changeStatusOk(money_id, value);
					}
				});
			},
			async changeStatusOk (money_id, value) {
				const {data: res} = await this.axios.post("send-money-manage/money-set-status", {
					money_id: money_id,
					status  : value
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (this.redManageList.length == 1 && this.page > 1) {
						this.getRedManageList(this.page - 1, this.pageSize)
					} else {
						this.getRedManageList(this.page, this.pageSize)
					}
				}
			},
		},

		created () {
			if (JSON.parse(localStorage.getItem('corpArr')).length == 1) {
				this.isEWechat = false
			} else if (JSON.parse(localStorage.getItem('corpArr')).length > 1) {
				this.isEWechat = true
			}
			this.getRedManageList()
			this.getAgentList()

		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

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
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
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

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.model-label {
		color: #000000D9;
		overflow: hidden;
	}

	.model-label-left {
		float: left;
		width: 160px;
		text-align: center;
		line-height: 32px;
	}

	.model-label-right {
		float: left;
		margin-left: 10px;
	}

	.model-label-right-p {
		font-size: 13px;
		color: #909399;
		margin-bottom: 0;
		line-height: 30px;
	}

	/deep/ .ant-input-number:hover .ant-input-number-handler-wrap {
		opacity: 0;
	}
</style>
