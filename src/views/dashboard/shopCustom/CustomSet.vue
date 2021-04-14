<template>
	<div class="custom-set">
		<a-layout style="position: relative; height: 100%; overflow: hidden">
			<a-layout class="scroll" style="position: absolute;left: 0;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;">
				<!-- 头部 -->
				<a-layout-header>顾客设置</a-layout-header>
				<!-- 内容 -->
				<a-layout-content>
					<div style="margin-top:20px;" ref="tabParent">
						<span @click="changeTab(1)" class="tabBtn" :class="{activeBtn:tabKey == 1}" v-has="'customSet-grade'">等级设置</span>
						<span @click="changeTab(2)" class="tabBtn" :class="{activeBtn:tabKey == 2}" v-has="'customSet-rfm'">RFM设置</span>
					</div>
					<div v-show="tabKey == 1" style="padding: 15px 20px;background: #FFF;" v-has="'customSet-grade'">
						<div class="content-msg">
							<p style="margin-bottom: 0px;">
								1、等级为自定义创建，不跟其他业务有直接联系，一个用户只能存在一个等级，可以手工更改。
							</p>
							<p style="margin-bottom: 0px;">
								2、可以将某等级的所有用户全部移动到其他等级或者无等级，要删除等级也需要先把下面用户先挪走。
							</p>
						</div>
						<div class="content-hd">
							<a-button type="primary" @click="addLevel('add')">添加等级</a-button>
							<div class="level-list">
								<div class="level-item" v-for="(item,index) in listData.result" :key="index">
									<a-row>
										<a-col :span="12">
											<div class="level-l">
												<div class="level-color" :style="{'background-color': item.color}"></div>
												<div class="level-mes">
													<div class="level-name">{{item.title}}</div>
													<div class="level-des">{{item.desc}}</div>
												</div>
											</div>
										</a-col>
										<a-col :span="8">
											<div class="level-m">
												<div class="level-customer_num">现有顾客：{{item.customer_num}}</div>
												<div class="circle-box">
													<svg width="50" height="50" viewBox="0 0 50 50">
														<circle class="circle-grey" cx="25" cy="25" r="20"></circle>
														<circle class="circle-color" cx="25" cy="25" r="20" stroke-dasharray="125" :stroke-dashoffset="(100-item.customer_rate)*125/100"></circle>
													</svg>
													<span>{{item.customer_rate}}%</span>
												</div>
											</div>
										</a-col>
										<a-col :span="4">
											<div class="level-r">
												<a class="level-edit" @click="addLevel('edit',item)">编辑</a>
												<a-dropdown :trigger="['click']">
													<a class="ant-dropdown-link" @click="e => e.preventDefault()">
														更多<a-icon type="down" />
													</a>
													<a-menu slot="overlay" @click="e=>handleMenuClick(e,item)">
														<a-menu-item key="0">删除</a-menu-item>
														<a-menu-item key="1">全部变更</a-menu-item>
													</a-menu>
												</a-dropdown>	
											</div>
										</a-col>
									</a-row>
								</div>
								<div class="level-item">
									<a-row>
										<a-col :span="12">
											<div class="level-l">
												<div class="level-color" style="background-color: #FFFFFF"></div>
												<div class="level-mes">
													<div class="level-name">{{listData.no_level.title}}</div>
													<div class="level-des">{{listData.no_level.desc}}</div>
												</div>
											</div>
										</a-col>
										<a-col :span="8">
											<div class="level-m">
												<div>现有顾客：{{listData.no_level.customer_num}}</div>
											</div>
										</a-col>
									</a-row>
								</div>
							</div>
						</div>
					</div>
					<div v-show="tabKey == 2" style="padding: 15px 20px;background: #FFF;" v-has="'customSet-rfm'">
						<div class="content-msg">
							<p style="margin-bottom: 0px;">
								1、会话相关的参数设置必须要依赖<router-link to="/archive/message">【会话存档】</router-link>功能，未开启的情况下不可配置会话相关的参数。
							</p>
							<p style="margin-bottom: 0px;">
								2、顾客需要有消费明细的记录，否则无法使用额度维度，只可使用近度和频率维度，也无法设置按照消费订单相关的参数。
							</p>
							<p style="margin-bottom: 0px;">
								3、建议先开启会话存档功能和消费数据，系统会自动计算所有顾客的数据，得出一个中位数参考值，可作为参考再设置RFM的基准值。
							</p>
							<p style="margin-bottom: 0px;">
								4、根据三个维度分别设置的考量方式和基准数据，低于基准的此条判别为低，三个维度叠加形成评级级别。
							</p>
							<p style="margin-bottom: 0px;">
								5、会话频率，考量顾客有会话的次数，可以排除掉系统或企微员工主动发起会话若干时间段之内的回复内容。
							</p>
							<p style="margin-bottom: 0px;">
								6、近度，考量的是顾客最后一次主动会话或者是消费，距离当前的天数。
							</p>
							<p style="margin-bottom: 0px;">
								7、额度，考量的是顾客平均消费客单价，为总消费额除以消费次数。开启了消费数据之后，顾客若没有消费记录，统一以额度为低来进行处理。详细的概念和使用说明可以点击 
								<!-- <a href="https://support.qq.com/products/104790/faqs/90393" target="_blank">说明文档</a> -->
							</p>
						</div>
						<div class="content-hd">
							<div class="content-box">
								<div class="rfm-set">
									<div class="rfm-set-item">当前【会话存档】功能{{openTopic?'已':'未'}}开启<router-link to="/archive/message" v-if="!openTopic">，点击前往</router-link>。</div>
									<div class="rfm-set-item">
										<label>会话排除回复内容</label>
										<a-input v-model="timeTopic" />
										<span>分钟内的顾客回复内容不纳入顾客RFM会话数据。</span>
										<a-tooltip placement="top">
											<template slot="title">
												<div>默认为0，则所有的会话都计算在内。若想排除回复内容，可设置比如30分钟内，员工给顾客发的消息，顾客的回复不作为主动会话。</div>
											</template>
											<a-icon type="question-circle" theme="filled" style="margin-left:5px;color: #000000;"/>
										</a-tooltip>
									</div>
									<div class="rfm-set-item">
										<label>会话记录开启</label>
										<a-switch default-checked :disabled="!openTopic" @change="onSession($event,'session')" v-model="openSession" />
										<a-tooltip placement="top">
											<template slot="title">
												<div>开启后，每个顾客的会话情况会自动计算，前期可以先开启，积累一部分数据再设置基准值。</div>
											</template>
											<a-icon type="question-circle" theme="filled" style="color: #000000;fontSize: 14px;"/>
										</a-tooltip>
									</div>
									<div class="rfm-set-item">
										<label>消费数据开启</label>
										<a-switch default-checked :disabled="opendis" @change="onSession($event,'buy')" v-model="openBuy" />
										<a-tooltip placement="bottom">
											<template slot="title">
												<div>当前店铺可以通过订单导入、订单录入来补全顾客的消费记录，就可以开启这个功能，系统将自动计算每个顾客的消费RFM数据。若没有任何消费数据的导入，请不要开启。</div>
											</template>
											<a-icon type="question-circle"/>
										</a-tooltip>
									</div>
								</div>
							</div>
							<div class="content-box">
								<div class="rfm-statis">
									<div class="rfm-title">
										<span>当前顾客RFM中位数参考值（截止{{rfmStatisTime}}的数据）</span>
										<a-tooltip placement="top">
											<template slot="title">
												<div>以下数据是取现有顾客的中位数数据。以消费额度为例，总共101个顾客，按照额度排序，第51个顾客的消费额度即为消费额度中位数。</div>
											</template>
											<a-icon type="question-circle" theme="filled" style="margin-left:5px;color: #000000;"/>
										</a-tooltip>
									</div>
									<div class="rfm-statis-list">
										<div class="rfm-statis-item">
											<span>顾客总数</span>
											<div>{{rfmStatis.customer_num}}</div>
										</div>
										<div class="rfm-statis-item" v-if="1">
											<span>会话频率</span>
											<div>{{openSession?rfmStatis.frequency_msg+'次':'--'}}</div>
										</div>
										<div class="rfm-statis-item" v-if="1">
											<span>会话近度</span>
											<div>{{openSession?rfmStatis.recency_msg+'天':'--'}}</div>
										</div>
										<div class="rfm-statis-item" v-if="1">
											<span>消费频率</span>
											<div>{{openBuy?rfmStatis.frequency_shopping+'次':'--'}}</div>
										</div>
										<div class="rfm-statis-item" v-if="1">
											<span>消费近度</span>
											<div>{{openBuy?rfmStatis.recency_shopping+'天':'--'}}</div>
										</div>
										<div class="rfm-statis-item" v-if="1">
											<span>消费额度</span>
											<div>{{openBuy?rfmStatis.amount+'元':'--'}}</div>
										</div>
									</div>
								</div>
							</div>
							<div class="content-box">
								<div class="rfm-config">
									<div class="rfm-title">
										<span>设置RFM基准值配置</span>
										<a-tooltip placement="top">
											<template slot="title">
												<div>设置了基准，所有顾客自己的数值会与基准值比对，来判别高低关系，从而进行评级。基准值可以参考上面的中位数值进行设置。选择方式和数值可以随时调整，但对顾客的评级变化需要第二天生效</div>
											</template>
											<a-icon type="question-circle" theme="filled" style="margin-left:5px;color: #000000;"/>
										</a-tooltip>
									</div>
									<div class="rfm-config-list">
										<div class="rfm-config-item">
											<label>频率基准</label>
											<a-radio-group name="radioGroup" :default-value="rateType" v-model="rateType">
												<a-radio :value="1" :disabled="!openSession">会话频率</a-radio>
												<a-radio :value="2" :disabled="!openBuy">消费频率</a-radio>
											</a-radio-group>
											<a-input v-model="rateStandard" allow-clear :disabled="!openSession&&!openBuy" />
										</div>
										<div class="rfm-config-item">
											<label>近度基准</label>
											<a-radio-group name="radioGroup" :default-value="progressType" v-model="progressType">
												<a-radio :value="1" :disabled="!openSession">会话近度</a-radio>
												<a-radio :value="2" :disabled="!openBuy">消费近度</a-radio>
											</a-radio-group>
											<a-input v-model="progressStandard" allow-clear :disabled="!openSession&&!openBuy" />
										</div>
										<div class="rfm-config-item">
											<label>额度基准</label>
											<a-radio-group name="radioGroup" :default-value="1">
												<a-radio :value="1" :disabled="!openBuy">消费额度</a-radio>
											</a-radio-group>
											<a-input v-model="quotaStandard" allow-clear :disabled="!openBuy" />
										</div>
									</div>
								</div>
							</div>
							<div class="content-box">
								<div class="rfm-grade">
									<div class="rfm-title">RFM评级对应关系</div>
								</div>
								<div class="rfm-grade-table">
									<a-table :columns="columns" :data-source="rfmData" :pagination="false" rowKey="id">
										<template slot="grade" slot-scope="text,record,index">
											<span>{{index+1}}</span>
										</template>
										<template slot="alis_name" slot-scope="text,record">
											<a-input placeholder="自定义名称"
											:value="text" 
											@blur="checkEnter(record.id,'alis_name','blur')"
											@focus="checkFocus(record.id,text)"
											@change="onCellChange($event)" 
											@pressEnter="checkEnter(record.id,'alis_name','enter')" />
											<a @click="checkEnter(record.id,'alis_name','save')" v-if="record.id == customId">保存</a>
										</template>
									</a-table>
								</div>
							</div>
						</div>
						<div class="content-bd">
							<a-button type="primary" @click="saveRfm">保存</a-button>
						</div>
					</div>
					
					<!-- 添加/编辑等级 -->
					<a-modal width="600px" :title="levelType==1?'编辑等级':'添加等级'" v-model="bindLevelVisible" class="level-modal" @ok="submitLevel(levelType)" @cancel="cancelLevel">
						<div class="level-set-list">
							<div class="set-item">
								<label>等级名称：</label>
								<a-input placeholder="等级名称" allow-clear v-model="levelName" />
								<span>等级名称不可重复</span>
							</div>
							<div class="set-item">
								<label>等级描述：</label>
								<a-input placeholder="等级描述" allow-clear v-model="levelDes" />
								<span>对等级进行描述</span>
							</div>
							<div class="set-item">
								<label>权重值：</label>
								<a-input placeholder="权重值" allow-clear v-model="levelHeavy" />
								<span>权重值越高，表明等级越高</span>
							</div>
							<div class="set-item">
								<label>选择颜色：</label>
								<a-input type="color" class="ipt-color" v-model="levelColor" />
								<span>{{levelColor}}</span>
							</div>
						</div>
					</a-modal>
					<!-- 删除/变更等级 -->
					<a-modal width="600px" :title="levelType==2?'删除等级':'全部变更等级'" v-model="changeLevelVisible" class="level-modal change-level-modal">
						<template slot="footer">
							<div>
								<a-checkbox @change="onCheckbox" v-model="isCheckbox">勾选，代表确定知晓操作带来的影响。</a-checkbox>
							</div>
							<div>
								<a-button key="back" @click="cancelLevel">取消</a-button>
								<a-button key="submit" type="primary" :disabled="!isCheckbox" :loading="loading" @click="submitLevel(levelType)">确定</a-button>
							</div>
						</template>
						<div class="level-set-list">
							<div class="set-item">
								<label>原等级：</label>
								<a-input disabled v-model="levelName" />
							</div>
							<div class="set-item">
								<label>变更等级：</label>
								<a-select
									showSearch
									optionFilterProp="children" 
									v-model="gradeVal"
								>	
									<a-select-option :value="-1">选择变更的等级</a-select-option>
									<template v-for="item in gradeArr">
										<a-select-option :key="item.id" v-if="item.title != levelName">{{item.title}}</a-select-option>
									</template>
								</a-select>
							</div>
						</div>
						<div class="level-tip-box">
							<div class="level-tip">{{levelType==2?'该等级将被删除，所有该等级顾客都将变更为其他等级。':'所有该等级顾客都将变更为其他等级。'}}</div>
						</div>
					</a-modal>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
	const columns = [
		{
			title      : "评级",
			scopedSlots: {customRender: "grade"},
		},
		{
			title      : "近度",
			dataIndex  : "recency",
			key        : "recency",
		},
		{
			title      : "频率",
			dataIndex  : "frequency",
			key        : "frequency",
		},
		{
			title      : "额度",
			dataIndex  : "monetary",
			key        : "monetary",
		},
		{
			title      : "默认名称",
			dataIndex  : "default_name",
			key        : "default_name",
		},
		{
			title      : "自定义名称",
			dataIndex  : "alis_name",
			key        : "alis_name",
			width      : '30%',
			scopedSlots: {customRender: "alis_name"},
		}
	];
	export default{
		name: "CustomSet",
		components:{},
		data(){
			return {
				tabKey: 1,//Tab切换，1（等级设置），2（RFM设置）
				listData: {
					no_level: {},
					result: []
				},//等级设置列表数据
				
				levelType: 0,//0:添加，1：编辑，2：删除，3：变更等级
				bindLevelVisible: false,//添加、编辑等级窗口
				levelName: '',//等级名称
				levelDes: '',//等级描述
				levelHeavy: '',//等级权重
				levelColor: '#000000',//等级颜色
				levelId: 0,//等级id
				
				changeLevelVisible: false,//删除、变更等级窗口
				loading: false, // 确认绑定按钮加载
				isCheckbox: false,//复选框是否勾选
				gradeArr: [],
				gradeVal: -1,//等级
				
				openTopic: false,//是否开启会话功能
				timeTopic: '',//会话时间限制
				openSession: false,//会话记录是否开启
				opendis: true,//消费切换是否禁止切换
				openBuy: false,//消费数据是否开启
				rfmStatis: {},//RFM中位数参考值
				rfmStatisTime: '',//RFM中位数参考值截止时间
				rateType: 1,//频率基准默认选项1：会话频率，2：消费频率
				rateStandard: '',//频率基准
				progressType: 1,//进度基准默认选项1：会话进度，2：消费进度
				progressStandard: '',//进度基准
				quotaStandard: '',//额度基准
				columns,//表格头
				rfmData:[],//消费数据表格数据
				rfmData1:[],//消费数据开启表格数据
				rfmData2:[],//消费数据关闭表格数据
				customVal: '',//自定义名称输入框
				customId: '',//自定义名称id
			}
		},
		methods: {
			changeTab(type){//Tab切换
				this.tabKey = type
			},
			async levelList(){//等级设置列表
				let that = this
				that.loading = true
				const {data: res} = await that.axios.post("shop-customer-level/list", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
				});
				if (res.error != 0) {
					that.loading = false
					that.$message.error(res.error_msg);
				} else {
					that.loading = false
					that.listData = res.data
				}
			},
			
			addLevel(type,item){//添加、编辑等级
				let that = this
				that.bindLevelVisible = true
				if(type=="add"){//添加
					that.levelType = 0
					that.levelName = ''
					that.levelDes = ''
					that.levelHeavy = ''
					that.levelColor = '#ff0000'
				}else if(type=="edit"){//编辑
					that.levelType = 1
					that.levelName = item.title
					that.levelDes = item.desc
					that.levelHeavy = item.weight
					that.levelColor = item.color
					that.levelId = item.id
				}
			},
			handleMenuClick(e,item){//删除、变更等级
				let that = this
				that.changeLevelVisible = true
				this.isCheckbox = false
				that.loading = false
				if(e.key==0){//删除
					that.levelType = 2
				}else if(e.key==1){//全部变更
					that.levelType = 3
				}
				that.gradeVal = -1
				that.levelName = item.title
				that.levelId = item.id
				
				that.rfmLevel()
			},
			async rfmLevel () {//等级和rfm
				this.isLoading = true;
				const {data: res} = await this.axios.post("shop-customer/level-rfm", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.gradeArr = res.data.level
				}
			},
			onCheckbox(e){//复选框监听
				this.isCheckbox = e.target.checked
			},
			async submitLevel(levelType){//提交添加、编辑、删除、变更等级
				let that = this
				that.loading = true
				let url,params;
				if(levelType==0){//添加
					params={
						corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
						title: that.levelName,
						desc: that.levelDes,
						weight: that.levelHeavy,
						color: that.levelColor
					}
					url="shop-customer-level/add-level"
				}else if(levelType==1){//编辑
					params={
						corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
						title: that.levelName,
						desc: that.levelDes,
						weight: that.levelHeavy,
						color: that.levelColor,
						id: that.levelId
					}
					url="shop-customer-level/update-level"
				}else if(levelType==2 || levelType==3){//删除、变更type:0(变更),1(删除)
					params={
						corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
						id: that.levelId,
						level_id: that.gradeVal==-1?'':that.gradeVal,
						type: levelType==2?1:0,
						check: 1
					}
					url="shop-customer-level/delete-level"
				}
				const {data: res} = await that.axios.post(url, params);
				if (res.error != 0) {
					that.loading = false
					that.$message.error(res.error_msg);
				} else {
					that.loading = false
					that.cancelLevel()
					that.levelList()
				}
			},
			cancelLevel(){//关闭添加、编辑、删除、变更等级
				this.bindLevelVisible = false
				this.changeLevelVisible = false
			},
			
			async frmSet (){//RFM设置基础配置接口
				let that = this;
				that.isLoading = true;
				const {data: res} = await that.axios.post("shop-customer-rfm/list", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					that.openTopic = res.data.work_audit?true:false;//会话存档是否开启
					if(res.data.rfm_setting != null){
						that.rfmData = res.data.rfm_setting.consumption_data_open?res.data.open_rfm_list:res.data.close_rfm_list;//RFM评级等级关系表格数据
						that.timeTopic = res.data.rfm_setting.msg_allow_time;//会话时间限制
						that.openSession = res.data.rfm_setting.msg_audit_open?true:false;//会话记录是否开启
						that.openBuy = res.data.rfm_setting.consumption_data_open?true:false;//消费数据是否开启
						that.rfmStatisTime = res.data.rfm_setting.update_time;//RFM中位数参考值截止时间
						that.rateType = res.data.rfm_setting.frequency_type*1;//频率基准类型
						that.rateStandard = res.data.rfm_setting.frequency_value;//频率基准
						that.progressType = res.data.rfm_setting.recency_type*1;//进度基准类型
						that.progressStandard = res.data.rfm_setting.recency_value;//进度基准
						that.quotaStandard = res.data.rfm_setting.monetary_value;//额度基准
					}
					
					that.rfmData1 = res.data.open_rfm_list;//RFM评级等级关系表格数据
					that.rfmData2 = res.data.close_rfm_list;//RFM评级等级关系表格数据
					
					that.opendis = false
					that.rfmStatis = res.data.rfm_data;//RFM中位数参考值
					
					if(that.$refs.tabParent.childNodes.length==1&&that.$refs.tabParent.childNodes[0].innerText=='RFM设置'){
						that.tabKey = 2
					}
				}
			},
			onSession(checked,type){//switch监听
				if(type == "session"){
					this.openSession = checked
				}else if(type == "buy"){
					this.openBuy = checked
					this.rfmData = checked?this.rfmData1:this.rfmData2
				} 
			},
			checkFocus(id,text){//自定义输入框聚焦
				this.customId = id
				this.customVal = text
			},
			onCellChange(e){//监听自定义输入框
				this.customVal = e.target.value;
			},
			checkEnter(id, dataIndex, type){//自定义输入框enter与blur监听
				let that = this;
				let dataSource = that.rfmData
				const target = dataSource.find(item => item.id === id);
				if (target) {
					target[dataIndex] = that.customVal;
					that.rfmData = dataSource;
					if(type != 'blur'){
						that.addAlias()
					}
				}
			},
			async addAlias (){//RFM设置自定义名称接口
				let that = this;
				that.isLoading = true;
				const {data: res} = await that.axios.post("shop-customer-rfm/add-alias", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					rfm_id: that.customId,
					rfm_name: that.customVal
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					that.$message.success('保存成功')
					that.customId = ''
				}
			},
			
			async saveRfm(){//rfm设置保存
				let that = this
				that.loading = true
				let params = {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					consumption_data_open: that.openBuy?1:0,
					msg_audit_open: that.openSession?1:0,
					msg_allow_time: that.timeTopic,
					frequency_type: that.rateType,
					frequency_value: that.rateStandard,
					recency_type: that.progressType,
					recency_value: that.progressStandard,
					monetary_value: that.quotaStandard
				}
				const {data: res} = await that.axios.post("shop-customer-rfm/change-setting", params);
				if (res.error != 0) {
					that.loading = false
					that.$message.error(res.error_msg);
				} else {
					that.loading = false
					that.$message.success('保存成功')
				}
			},
		},
		mounted() {
			this.$store.dispatch('getCorp', (info) => {
				
				this.levelList()
				this.frmSet()
			});
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	.custom-set{
		width: 100%;
		height: 100%;
	}
	.ant-layout-header{
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}
	
	.ant-layout-content{
		margin: 0 20px 20px;
		min-width: 885px;
	}
	.tabBtn {
		margin: 0;
		margin-right: 2px;
		padding: 10px 16px;
		line-height: 38px;
		background: #FAFAFA;
		border: 1px solid #E8E8E8;
		border-bottom: 0;
		border-radius: 4px 4px 0 0;
		cursor: pointer;
	}
	.activeBtn {
		color: #01b065;
		background: #FFF;
	}
	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}
	
	.content-hd{
		margin-top: 20px;
		width: 100%;
		min-width: 885px;
	}
	.level-list{
		margin-top: 20px;
		padding: 0 24px;
	}
	.level-item{
		width: 100%;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #eaeaea;
		padding: 20px 0;
		.ant-row{
			width: 100%;
			display: flex;
			align-items: center;
		}
	}
	.level-item:last-child{
		border-bottom: none;
	}
	.level-l{
		display: flex;
		align-items: center;
	}
	.level-color{
		width: 25px;
		height: 25px;
		margin-right: 15px;
	}
	.level-mes{
		color: #333;
		font-weight: 650;
	}
	.level-des{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #999;
		font-weight: 400;
	}
	.level-m{
		color: #999999;
		display: flex;
		align-items: center;
		.level-customer_num{
			min-width: 120px;
		}
	}
	.circle-box{
		display: flex;
		align-items: center;
		margin-left: 5px;
	}
	.circle-box svg{
		-webkit-transform: rotate(-90deg);
		-moz-transform: rotate(-90deg);
		-ms-transform: rotate(-90deg);
		-o-transform: rotate(-90deg);
		transform: rotate(-90deg);
		-webkit-transform-origin: 50% 50%;
		-moz-transform-origin: 50% 50%;
		-ms-transform-origin: 50% 50%;
		-o-transform-origin: 50% 50%;
		transform-origin: 50% 50%;
		margin-right: 10px;
	}
	.circle-grey {
		stroke: #DFDFDF;
		stroke-width: 8px;
		fill: none;
	}
	.circle-color {
		stroke: #01b065;
		stroke-width: 8px;
		fill: none;
		-webkit-transition: stroke-dashoffset 1s linear;
		-moz-transition: stroke-dashoffset 1s linear;
		-o-transition: stroke-dashoffset 1s linear;
		transition: stroke-dashoffset 1s linear;
	}
	.level-edit{
		border-right: 2px solid #999;
		display: inline-block;
		height: 12px;
		line-height: 12px;
		padding-right: 5px;
		margin-right: 1px;
	}
	.ant-dropdown-menu-item{
		color: #01b065;
	}
	
	.set-item{
		display: flex;
		align-items: center;
		margin-bottom: 15px;
	}
	.set-item label{
		width: 80px;
		text-align: right;
		flex-shrink: 0;
	}
	.ant-input-affix-wrapper,.ant-input,.ant-select{
		width: 220px;
		margin-right: 10px;
	}
	.ipt-color{
		width: 32px;
		padding: 0 2px;
		margin-right: 10px;
	}
	.change-level-modal /deep/.ant-modal-footer{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.level-tip-box{
		width: 100%;
		height: 30px;
	}
	.level-tip{
		position: absolute;
		left: 0;
		bottom: 53px;
		width: 100%;
		padding: 5px 0;
		text-align: center;
		background-color: @color-bgc;
	}
	
	.content-box{
		background: #F5F5F5;
		border: 1px solid #E2E2E2;
		margin-bottom: 20px;
		padding: 10px;
		&:last-child{
			margin-bottom: 0;
		}
		.rfm-title{
			font-size: 16px;
			font-weight: 600;
			margin: 10px;
		}
		.rfm-set{
			margin-left: 50px;
			.rfm-set-item{
				margin-bottom: 15px;
				display: flex;
				align-items: center;
				&:last-child{
					margin-bottom: 0;
				}
				.ant-input{
					margin-left: 10px;
					width: 80px;
				}
				.ant-switch{
					margin: 0 10px;
				}
			}
		}
		.rfm-statis{
			.rfm-statis-list{
				padding: 30px 0;
				display: flex;
				justify-content: space-around;
				.rfm-statis-item{
					text-align: center;
					div{
						color: #000000;
						font-size: 30px;
						font-weight: 600;
					}
				}
			}
		}
		.rfm-config{
			.rfm-config-list{
				margin-left: 50px;
				.rfm-config-item{
					margin-bottom: 15px;
					display: flex;
					align-items: center;
					&:last-child{
						margin-bottom: 0;
					}
					.ant-radio-group{
						margin-left: 20px;
					}
				}
			}
		}
		.rfm-grade{
			.rfm-grade-table{
				
			}
		}
	}
	.content-bd{
		background: #FFF;
		min-height: 120px;
		min-width: 885px;
		width: 100%;
		text-align: center;
		.ant-btn{
			margin-top: 50px;
		}
	}
</style>
