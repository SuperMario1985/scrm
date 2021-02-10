<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height:100%">
				<!-- 左侧 -->
				<a-layout-sider v-if="isEWechat">
					<!-- 企业微信 -->
					<eWechat @changeWxId="handleWxId"></eWechat>
				</a-layout-sider>
				<a-layout style="position: absolute;top:0;bottom:0;right:0;" class="scroll"
				          :style="{left:isEWechat?'250px':'0px'}">
					<!-- 头部 -->
					<!-- <a-layout-header>员工管理</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">员工管理</div>
						<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7">
							<p style="margin-bottom: 2px;color: #FF562D;">
								1、只展示在企业微信官方后台创建自建应用时，所设置的可见成员，只有他们才拥有发放零钱的权限。
							</p>
							<p style="margin-bottom: 2px;">
								<span style="color: #FF562D;">2、若在本系统所填写的数值超过在【微信支付商户平台】配置的数值，执行规则依然以官方配置为准，请合理填写。</span>建议您先在【微信支付商户平台】---【产品中心】-【企业付款到零钱】--【产品设置】，将所有数值设置到官方最大值（如下），再到本系统里进行配置。
							</p>
							<p style="margin-bottom: 2px;">a、商户号单日出款额度：10万</p>
							<p style="margin-bottom: 2px;">b、单人单日付款额度：5000元</p>
							<p style="margin-bottom: 2px;">c、单笔付款最低额度：0.30元， 默认每天最多可向同一个用户付款10次</p>
							<p style="margin-bottom: 2px;">
								3、员工发送的限额和限次，及客户领取的额度和次数，均为客户+客户群的之和。
							</p>
							<p style="margin-bottom: 0px; color: #FF562D;">
								若红包已发送到客户/客户群里，但客户尚未领取，此时微信支付商户平台出现账户余额不足时，客户打开红包页面无法领取，请务必保证账户余额充足，避免客户投诉。
							</p>
						</div>
						<div class="content-hd">
							<a-button @click="showDepartmentList(true,0)">
								选择部门成员
							</a-button>
							<span v-if="chooseNum > 0" style="margin-left: 10px;">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
							<a-range-picker @change="changeTime"
							                :value="dateValue"
							                :disabled-date="disabledDate"
							                format="YYYY-MM-DD" style="margin-left: 15px;"/>
							<a-button type="primary" style="margin-left:15px;" @click="find">查找
							</a-button>
							<a-button @click="clear" style="margin-left:15px;">重置</a-button>
							<a-button style="margin-top: 14px;float:right;margin-left:15px;padding:0 1rem;"
							          @click="openChangeApp()" type="primary" v-if="canChangeAgent==1||have_agent==0"
							>
								{{have_agent==0?'设置自建应用':'更换自建应用'}}
							</a-button>
							<a-button @click="changeStaffLimit"
							          style="margin-top: 14px;float:right;margin-left:15px;padding:0 1rem;">发放员工
							</a-button>
							<a-dropdown v-has="'employee-export'">
								<a-menu slot="overlay" @click="chooseDownType">
									<a-menu-item key="0">当前页导出</a-menu-item>
									<a-menu-item key="1">全部导出</a-menu-item>
								</a-menu>
								<a-button  style="float:right;margin-top: 14px">导出
									<a-icon type="down"/>
								</a-button>
							</a-dropdown>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table
										:rowSelection="rowSelection"
										:columns="columns"
										:dataSource="manageList"
										:pagination="false"
										:rowClassName="rowClassName" v-has="'employee-list'"
								>
									<div slot="user_name" slot-scope="text, record, index">
										{{record.user_name}}
										<a-icon slot="prefix" type="man" style="color: #427EBA;"
										        v-if="record.sex == 1"/>
										<a-icon
												slot="prefix"
												type="woman"
												style="color: #ED4997;"
												v-if="record.sex == 2"
										/>
										<div v-if="record.user_status == 2">（已取消可见权限）</div>
									</div>
									<div slot="day_smoney" slot-scope="text, record, index">
										<span v-if="record.day_snum && record.day_snum != ''">{{record.day_snum}}次/{{record.day_smoney}}元</span>
										<span v-else>--/{{record.day_smoney}}元</span>
									</div>
									<div slot="day_money" slot-scope="text, record, index">
										{{record.day_money}}元/{{record.day_hmoney}}元
									</div>
									<div slot="day_num" slot-scope="text, record, index">
										{{record.day_num}}次/{{record.day_hnum}}次
									</div>
									<div slot="smoney" slot-scope="text, record, index">
										{{record.snum}}次/{{record.smoney}}元
									</div>
									<div slot="user_status" slot-scope="text, record, index">
										<span v-if="record.user_status==1">开启</span>
										<span v-if="record.user_status==2||record.user_status==3">关闭</span>
									</div>
									<div slot="action" slot-scope="text, record, index">
										<a-button
												style="margin: 0px 5px 5px 0px;"
												@click="lookDetail(record.user_name,record.user_id)"
												v-has="'employee-detail'">
											发放明细
										</a-button>
										<a-button
												v-if="record.user_status == 1"
												style="margin: 0px 5px 5px 0px;"
												@click="bulkChangeLimit(1,record.user_id,record)"
												v-has="'employee-limit'">
											员工限额
										</a-button>
										<a-button v-if="record.user_status!=1"
										          style="margin: 0px 5px 5px 0px;"
										          @click="changeStatus([record.user_id],1)"
										          v-has="'employee-detail'">
											开启
										</a-button>
										<a-button v-if="record.user_status==1"
										          style="margin: 0px 5px 5px 0px;"
										          @click="changeStatus([record.user_id],0)"
										          v-has="'employee-detail'">
											关闭
										</a-button>
									</div>
								</a-table>
								<div style="margin: 20px;" v-show="total > 0" v-has="'employee-limit'">
									<a-checkbox v-model="batchTypeValue" :disabled="batchTypeDisabled"
									            @click="batchTypeChange"></a-checkbox>
									<a-select optionFilterProp="children" v-model="batchType"
									          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
										<a-select-option value="0">选择当前页</a-select-option>
										<a-select-option value="1">选择所有</a-select-option>
									</a-select>
									<a-button type="primary"
									          @click="bulkChangeLimit(selectedRowKeys.length,selectedRowKeys)"
									          :disabled="this.selectedRowKeys.length > 0 ? false : true">批量零钱限额
									</a-button>
									<a-button type="primary" style="margin: 0 1rem"
									          @click="changeStatus(selectedRowKeys,1)"
									          :disabled="this.selectedRowKeys.length > 0 ? false : true">批量开启
									</a-button>
									<a-button type="primary"
									          @click="changeStatus(selectedRowKeys,0)"
									          :disabled="this.selectedRowKeys.length > 0 ? false : true">批量关闭
									</a-button>
								</div>
								<!--分页-->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'employee-list'">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total}}</span>条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
										              :current="page"
										              :pageSize="pageSize"
										              :pageSizeOptions="['15','30','50','100']"
										              @change="changePage"
										              @showSizeChange="showSizeChange"/>
									</div>
								</div>
							</a-spin>
						</div>
						<!--部门选择框-->
						<chooseDepartment :agentid="agent_id" ref="user" :show="showModalDepartment"
						                  :chooseNum="chooseNum" :id="corpId"
						                  :callback="modalVisibleChange3" :is_special="1"></chooseDepartment>
						<!--限额发放弹窗-->
						<a-modal title="限额发放" v-model="setVisible" @ok="setHandleOk"
						         :confirmLoading="setConfirmLoading" style="height: 500px" @cancel="setCancel"
						         width="675px">
							<a-row style="margin-bottom: 12px" v-if="!isSingle">
								<a-button @click="showDepartmentList(false,1)">
									选择部门成员
								</a-button>
								<span v-if="people > 0" style="margin-left: 10px;">已选择{{chooseUserNum1}}名成员，{{chooseDepartmentNum1}}个部门</span>
							</a-row>
							<p style="color: #000000D9;" v-if="!isSingle">共给<span style="color: red;">{{parseInt(chooseUserNum1)+parseInt(chooseDepartmentNum1)}}</span>位员工设置
							</p>
							<div class="content-msg" style="margin:0 0 12px;">
								温馨提示：若在本系统所填写的数值超过在【微信支付商户平台】配置的数值，执行规则依然以官方配置为准，请合理填写。建议您先在【微信支付商户平台】---【产品中心】-【企业付款到零钱】--【产品设置】，将所有数值设置到官方最大值（如下），再到本系统里进行配置。
								<p style="margin-bottom: 2px;">a、商户号单日出款额度：10万</p>
								<p style="margin-bottom: 2px;">b、单人单日付款额度：5000元</p>
								<p style="margin-bottom: 2px;">c、单笔付款最低额度：0.30元， 默认每天最多可向同一个用户付款10次</p>
							</div>
							<div class="model-label">
								<div class="model-label-left">
									<span style="color: red;">*</span>单日员工发放红包次数：
								</div>
								<div class="model-label-right">
									<a-input-number :step="0" :precision="0"
									                v-model="changeTimes" placeholder="请输入单日员工发放红包次数"
									                style="width: 320px;margin-right: 5px;"/>
									次
									<p class="model-label-right-p">
										可输入1~999999正整数</p>
								</div>
							</div>
							<div class="model-label">
								<div class="model-label-left">
									<span style="color: red;">*</span>单日员工发放红包金额：
								</div>
								<div class="model-label-right">
									<a-input-number :step="0" :precision="2"
									                v-model="changeQuota" placeholder="请输入单日员工发放红包金额"
									                style="width: 320px;margin-right: 5px;"/>
									元
									<p class="model-label-right-p">
										精确到小数点后两位，可输入0.30~5000.00</p>
								</div>
							</div>
						</a-modal>

						<!--						更换自建应用-->
						<a-modal title="更换自建应用" v-model="changeAppVisible" @ok="changeAppOk"
						         :confirmLoading="confirmLoading" style="height: 500px"
						         @cancel="changeAppCancel">
							<a-form-model
									v-if="!showAddAgentModal"
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
											@change="handleChange"
									>
										<template v-for="(item,index) in agentList">
											<a-select-option :value="parseInt(item.id)">
												{{item.name}}
											</a-select-option>
										</template>
									</a-select>
								</a-form-model-item>
							</a-form-model>
						</a-modal>
						<linkAgent :corpId="corpId" :showAddAgent="showAddAgentModal" :agent_is_money='1'
						           @addOk="addOk" @linkOk="linkOk" @addCancel="addCancel"></linkAgent>
						<!-- 企业微信选择弹窗 -->
						<WeChatModal :show="showCoropation" :callback="coropationChange"
						             hasName="group-sending-add"></WeChatModal>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import eWechat from "@/components/eWeChat/eWechat.vue";
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import moment from 'moment';
	import linkAgent from '@/components/addAgent/index.vue'
	import WeChatModal from "@/components/WeChatModal.vue"

	const columns = [
		{
			title      : "员工姓名",
			dataIndex  : "user_name",
			key        : "user_name",
			width      : '150px',
			scopedSlots: {customRender: "user_name"}
		},
		{
			title      : "单日付款总笔数/总金额",
			dataIndex  : "day_smoney",
			key        : "day_smoney",
			scopedSlots: {customRender: "day_smoney"}
		},
		{
			title      : "今日已发放金额/剩余金额",
			dataIndex  : "day_money",
			key        : "day_money",
			scopedSlots: {customRender: "day_money"}
		},

		{
			title      : "今日已发放次数/剩余次数",
			dataIndex  : "day_num",
			key        : "day_num",
			scopedSlots: {customRender: "day_num"}
		},

		{
			title      : "累计已发放笔数/金额",
			dataIndex  : "smoney",
			key        : "smoney",
			scopedSlots: {customRender: "smoney"}
		},
		{
			title      : "状态",
			dataIndex  : "user_status",
			key        : "user_status",
			scopedSlots: {customRender: "user_status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '10%',
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "redPacketEmployeeManagement",
		components: {WeChatModal, linkAgent, eWechat, chooseDepartment},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				userSendMoney       : 1,
				isAuthClose         : false,
				isSingle            : false,
				isSearch            : false,
				isEWechat           : true,//左侧选择企业微信组件的显示与隐藏
				corpId              : corpId,//企业微信选中的id
				isLoading           : true, //Loading 组件显示与隐藏
				manageList          : [],//员工管理列表
				checkedList         : [],//选择的成员id数组
				user                : [],//选择的成员数据
				user1               : [],//选择的成员数据
				showModalDepartment : false, //成员选择框显示与隐藏
				chooseNum           : 0,//已选择的部门成员总个数
				chooseUserNum       : 0,//成员个数
				chooseDepartmentNum : 0,//部门个数
				chooseUserNum1      : 0,//成员个数
				chooseDepartmentNum1: 0,//部门个数
				//表格部分
				columns,
				//分页
				total               : 1, //总条数
				quickJumper         : false, // 是否显示快速跳转的控件
				page                : 1, //页码
				pageSize            : 15, //每页数据条数，默认15
				//起止时间
				dateValue           : [],
				startValue          : '',
				endValue            : '',
				moment,
				selectedRowKeys     : [],
				keysArr             : [],//所有客户的键值
				checkArr            : [],//选择当前页/所有，保存的key
				batchType           : '1',     // 0当前页 1所有
				batchTypeValue      : false, // 当前页/所有 是否选中
				batchTypeDisabled   : false,//当前页/所有 是否置灰
				setVisible          : false,//限额发放弹窗显示与隐藏
				setConfirmLoading   : false, //限额发放弹窗加载
				changeTimes         : '',//单日向每个客户付款到零钱次数上限
				changeQuota         : '',//单日每个客户收到零钱额度上限
				//导出数据
				is_export           : 0,//导出传1，否则传0
				is_all              : 0,//0当前页导出，1全部导出
				checkedList2        : [],
				startValue2         : '',
				endValue2           : '',
				people              : 0,//限额设置人数
				user_ids            : [],//限额设置的成员id
				user_ids1           : [],//限额设置的成员id
				agent_id            : '',
				showAddAgentModal   : false,  // 是否打开应用添加modal
				changeAppVisible    : false,//更换自建应用额弹窗显示与隐藏
				confirmLoading      : false, //添加固定金额弹框加载
				showCoropation      : false,//选择企业弹框
				haveAgent           : 0,//0没有红包，1有
				canChangeAgent      : 1,
				have_agent          : 1,
				agentList           : [],
				changeAppForm       : {agent_id: ''},  //更换自建应用
				rules               : {
					corpId  : [{required: true, message: '请选择企业', trigger: 'blur'},],
					agent_id: [{required: true, message: '请选择应用', trigger: 'blur'},],
				},  //更换自建应用表单验证
			};
		},

		methods : {
			// 更换自建应用
			openChangeApp () {
				this.changeAppForm = {}
				if (this.have_agent == 0) {
					this.showAddAgentModal = true
				} else {
					this.changeAppForm.agent_id = this.agent_id
					this.changeAppVisible = true
					this.changeAppForm.corp_id = localStorage.getItem('corpId')
					this.changeAppForm.corpName = localStorage.getItem('corpName')
				}
			},
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
			async changeAppOk () {
				this.changeAppForm.agent_is_money = 1
				const {data: res} = await this.axios.post("work-agent/update-agent-use", this.changeAppForm);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.changeAppVisible = false
					this.$message.success('提交成功')
					this.getManageList()
				}
			},
			changeAppCancel () {
				this.changeAppForm.agent_id = this.agent_id
			},
			changeCorp () {
				this.showCoropation = true
			},
			handleChange () {
				this.$forceUpdate()
			},
			addOk () {
				this.showAddAgentModal = false
				this.getManageList()
				if (this.addType == 1) {
					this.addFixedAmountVisible = true
				} else if (this.addType == 2) {
					this.setVisible = true
				}
			},
			linkOk () {
				this.showAddAgentModal = false
				this.getManageList()
				if (this.addType == 1) {
					this.addFixedAmountVisible = true
				} else if (this.addType == 2) {
					this.setFixedAmount()
				}
			},
			addCancel () {
				this.showAddAgentModal = false
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
			//左侧企业微信
			handleWxId (value) {
				this.isLoading = true
				this.corpId = value
				this.getManageList()
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//部门选择弹窗组件
      showDepartmentList (isSearch, userSendMoney) {
        this.userSendMoney = userSendMoney
        this.isSearch = isSearch

        let CheckList = this.checkedList
        let CheckUser = this.user
        if (isSearch) {
          CheckList = this.user_ids1
          CheckUser = this.user1
        }

        this.$refs.user.rightIdList = JSON.parse(JSON.stringify(CheckList))
        this.$refs.user.rightList = JSON.parse(JSON.stringify(CheckUser))

        this.showModalDepartment = true
      },
      modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
        if (event == "ok") {
          if (this.isSearch) {
            this.checkedList = arr
            this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
            this.user = list
          } else {
            this.user_ids1 = arr
            this.user1 = list
          }

          this.chooseUserNum = userNum
          this.chooseDepartmentNum = departmentNum
        }
        this.showModalDepartment = false
      },
			// 起止时间
			changeTime (date, dateString) {
				this.dateValue = date
				this.startValue = dateString[0]
				this.endValue = dateString[1]
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			//点击搜索
			find () {
				this.getManageList();
			},
			//点击清空
			clear () {
				this.is_export = 0
				this.is_all = 0
				this.dateValue = []
				this.startValue = ''
				this.endValue = ''
				this.batchTypeDisabled = false
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.getManageList();
			},
			//选择下载方式
			chooseDownType (e) {
				this.is_all = e.key
				this.is_export = 1
				this.getManageList()
			},
			//获取表格内容
			async getManageList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				let checkedList = []
				let startValue = ''
				let endValue = ''
				if (this.is_export == 0) {
					//不导出
					checkedList = this.checkedList
					startValue = this.startValue
					endValue = this.endValue
				} else if (this.is_export == 1) {
					//导出
					checkedList = this.checkedList2
					startValue = this.startValue2
					endValue = this.endValue2
				}
				const {data: res} = await this.axios.post("send-money-manage/user-send-money", {
					uid       : localStorage.getItem('uid'),
					corp_id   : this.corpId,
					user_ids  : checkedList,
					send_stime: startValue,
					send_etime: endValue,
					page      : page,
					page_size : pageSize,
					is_export : this.is_export,
					is_all    : this.is_all,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.agent_id = res.data.agentId
					this.have_agent = res.data.have_agent
					this.canChangeAgent = res.data.canChangeAgent
					if (this.is_export == 0) {
						this.manageList = res.data.money
						this.keysArr = res.data.all_user
						this.total = parseInt(res.data.count);
						this.page = page;
						this.pageSize = pageSize;
						this.quickJumper = this.total > this.pageSize;
					} else {
						window.open(res.data.url);
					}
					this.is_export = 0
					this.is_all = 0
					this.checkedList2 = checkedList
					this.startValue2 = startValue
					this.endValue2 = endValue

					let arr = this.selectedRowKeys
					this.checkArr = []
					this.manageList.map(x => {
						if (x.user_status == 1) {
							this.checkArr.push(x.key)
						}
					})
					//判断换页的时候，是否处于全选状态，底部的全选是否勾选上
					if (this.batchType == '0') {
						if (this.checkArr.length > 0) {
							this.batchTypeValue = this.checkArr.every(val => arr.includes(val))
						} else {
							this.batchTypeDisabled = true
						}
					} else if (this.batchType == '1') {
						if (this.keysArr.length > 0) {
							this.batchTypeValue = arr.sort().toString() == this.keysArr.sort().toString()
						} else {
							this.batchTypeDisabled = true
						}
					}
					//确认到底选中多少粉丝，给selectedRowKeys赋值
					// this.selectedRowKeys = []
					// arr.map((x) => {
					// 	res.data.all_user.map((k) => {
					// 		if (k == x) {
					// 			this.selectedRowKeys.push(x)
					// 		}
					// 	})
					// })

				}
			},
			changeStaffLimit () {
				this.selectedRowKeys = []
				this.user_ids1 = []
				this.user1 = []
				this.chooseUserNum1 = 0
				this.chooseDepartmentNum1 = 0
				this.isSingle = false
				this.setVisible = true
			},
			// 分页
			changePage (page, pageSize) {
				this.is_export = 0
				this.is_all = 0
				this.getManageList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 180)
				})
			},
			showSizeChange (page, pageSize) {
				this.is_export = 0
				this.is_all = 0
				this.getManageList(1, pageSize);
			},
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
				if (this.batchType == '0') {
					this.batchTypeValue = this.checkArr.every(val => selectedRowKeys.includes(val))
				} else if (this.batchType == '1') {
					this.batchTypeValue = selectedRowKeys.sort().toString() == this.keysArr.sort().toString()
				}
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					if (this.batchType == '0') {
						this.manageList.map(x => {
							if (x.user_status == 1) {
								this.selectedRowKeys.push(x.key)
							}
						})
						this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
					} else if (this.batchType == '1') {
						this.selectedRowKeys = this.keysArr
					}
				} else {
					this.selectedRowKeys = []
				}
			},
			// 当前/所有 类型选择框变化
			changeBatchType () {
				// this.batchTypeValue = false
				if (!this.batchTypeDisabled) {
					if (this.batchTypeValue) {
						if (this.batchType == '0') {
							this.selectedRowKeys = []
							this.manageList.map(x => {
								if (x.user_status == 1) {
									this.selectedRowKeys.push(x.key)
								}
							})
							this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
						} else if (this.batchType == '1') {
							this.selectedRowKeys = [...this.keysArr.valueOf()]
						}
					} else {
						if (this.batchType == '0') {
							this.batchTypeValue = this.checkArr.every(val => this.selectedRowKeys.includes(val))
						} else if (this.batchType == '1') {
							this.batchTypeValue = this.selectedRowKeys.sort().toString() == this.keysArr.sort().toString()
						}
					}
				}
			},

			changeStatus (user_ids, status) {
				let that = this
				let title = status == 1 ? '开启' : '关闭'
				this.$confirm({
					title     : "确定" + title + "？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					async onOk () {
						const {data: res} = await that.axios.post("send-money-manage/user-send-money-status", {
							corp_id : that.corpId,
							user_ids: user_ids,
							uid     : localStorage.getItem('uid'),
							status  : status
						});
						if (res.error != 0) {
							that.$message.error(res.error_msg);
						} else {
							that.getManageList()
						}
					}
				});
			},
			//批量零钱限额
			bulkChangeLimit (people, user_ids, record) {

				this.isSingle = true
				this.user_ids = [user_ids]
				if (record) {
					this.changeTimes = record.day_snum
					this.changeQuota = record.day_smoney
				}
				this.setVisible = true
				this.people = people
			},
			setHandleOk () {
				if (this.changeTimes === '' || this.changeTimes == null) {
					this.$message.error('请输入单日每个员工付款给客户的总次数上限');
					return false
				} else {
					if (this.changeTimes < 1 || this.changeTimes > 999999) {
						this.$message.error('单日每个员工付款给客户的总次数上限必须为1~999999正整数');
						return false
					}
				}
				if (this.changeQuota === '' || this.changeTimes == null) {
					this.$message.error('请输入单日每个员工付款给客户的总金额上限');
					return false
				} else {
					if (this.changeQuota < 0.30 || this.changeQuota > 5000.00) {
						this.$message.error('单日每个员工付款给客户的总金额上限必须在0.30~5000.00之间');
						return false
					}
				}
				this.set()
			},
			async set () {
				this.setConfirmLoading = true
				const {data: res} = await this.axios.post("send-money-manage/user-send-money-limit", {
					uid           : localStorage.getItem('uid'),
					corp_id       : this.corpId,
					user_ids      : this.isSingle ? this.user_ids : this.user_ids1,
					day_user_num  : this.changeTimes,
					day_user_money: this.changeQuota
				});
				if (res.error != 0) {
					this.setConfirmLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.setConfirmLoading = false
					this.setVisible = false
					this.user_ids = []
					this.changeTimes = ''
					this.changeQuota = ''
					this.people = 0
					this.getManageList()
				}
			},
			setCancel () {
				this.setVisible = false
				this.changeTimes = ''
				this.changeQuota = ''
				this.people = 0
			},
			//查看明细
			lookDetail (user_name, user_id) {
				this.$router.push("/redPacket/userDetailRecords?user_name=" + user_name + "&user_id=" + user_id)
			},
		},
		computed: {
			rowSelection () {
				const {selectedRowKeys} = this;
				return {
					selectedRowKeys,
					onChange             : this.onSelectChange,
					hideDefaultSelections: true,
					getCheckboxProps     : record => ({
						props: {
							disabled: record.user_status != 1,
							name    : record.user_status,
						},
					}),
				};
			}
		},

		created () {
			if (JSON.parse(localStorage.getItem('corpArr')).length == 1) {
				this.isEWechat = false
			} else if (JSON.parse(localStorage.getItem('corpArr')).length > 1) {
				this.isEWechat = true
			}
			this.getManageList()
			this.getAgentList()

		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path != '/redPacket/userDetailRecords') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.checkedList = []
					vm.user = []
					vm.chooseNum = 0
					vm.chooseUserNum = 0
					vm.chooseDepartmentNum = 0
					vm.is_export = 0
					vm.is_all = 0
					vm.dateValue = []
					vm.startValue = ''
					vm.endValue = ''
					vm.batchTypeDisabled = false
					vm.getManageList();
				});
			}

			next()
		},
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

	/deep/ .ant-table-thead > tr > th:first-child .ant-table-header-column {
		display: none;
	}
</style>
