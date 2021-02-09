<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="加载中..." size="large" :spinning="isLoading">
			<a-layout>
				<!-- 头部 -->
				<a-layout-header>
						新建短信群发
						<router-link to="/smsSend/list?isRefresh=1" style="font-size: 16px;float: right;margin-right: 15px;">
							<a-button type="primary" icon="rollback">返回列表</a-button>
						</router-link>
				</a-layout-header>
				<a-layout style class="fans-content">
					<!-- 左侧 -->
					<a-layout-sider>
						<div style="border:1px solid #E2D6D6;margin:auto;height:100%;width:100%;background:#FAFAFA;box-sizing: content-box;overflow-y: auto;" >
							<img src="../../../assets/wxHeader.png" alt style="width:100%;border-bottom:1px solid #E2D6D6;"/>
							<div style="padding-top: 20px;padding-left: 20px;" v-show="template_content.length > 0">
								<span>字数：<span style="padding:0px;color:#40a9ff;">{{template_content.length + sign_title.length + 6}}</span></span>
							</div>
							<div style="padding: 20px;overflow: hidden;" v-show="template_content.length > 0">
								<div style="padding: 10px;background-color: #E6E6FA;border-radius: 5px;">
									<span class="item-info msg_content_txt">【{{sign_title}}】{{template_content}} 回T退订</span>
								</div>
							</div>
						</div>
					</a-layout-sider>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content">
								<a-form>
									<!-- 消息名称 -->
									<a-form-item
											label="消息名称"
											:label-col="{ span: 3 }"
											:wrapper-col="{ span: 15 }"
											style="padding-top: 15px;"
									>
										<a-input
												v-model="title"
												@blur="changeMsgTitle"
												style="width: calc(100% - 60px)"
												placeholder="请填写消息名称，限20字符"
												:maxLength="20"
										/>
										<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{title.length}} / 20</span>
									</a-form-item>
									<!-- 短信签名 -->
									<a-form-item label="短信签名" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" style="padding-top: 15px;" >
										<a-select v-model="sign_id" style="width: 150px;margin-right:15px;" @change="changeSignId" >
											<template v-for="(item,index) in signArr" style="display: inline-block;">
												<a-select-option :value="item.id" @click="changeSign(item.title)">{{item.title}}</a-select-option>
											</template>
										</a-select>
									</a-form-item>
									<!-- 发送场景 -->
									<a-form-item label="发送场景" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" style="padding-top: 15px;" >
										<template v-for="(item,index) in typeArr" style="display: inline-block;">
											<a-radio-group @change="changeType(item.id)" v-model="type_id" >
												<a-radio-button :value="item.id">
													<div style="text-align: center;">{{item.title}}</div>
												</a-radio-button>
											</a-radio-group>
										</template>
									</a-form-item>
									<!-- 短信模版内容 -->
									<a-form-item label="短信内容" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" style="padding-top: 15px;" >
										<a-select v-model="template_id" style="width: 550px;margin-right:15px;" >
											<template v-for="(item,index) in templateArr" style="display: inline-block;">
												<a-select-option :value="item.id" @click="changeContent(item.content)" >{{item.content}}</a-select-option>
											</template>
										</a-select>
										<br>
										<span style="color:red;" v-has="'sms-template-add'">
											如果这里，没有您想要的模板，请
											<router-link to="/smsTemplate/add" style="color:green;">
												添加短信模板
											</router-link>
											，审核通过后，即可使用
										</span>
									</a-form-item>
									<!-- 群发粉丝 -->
									<a-form-item label="群发粉丝" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" style="padding-top: 15px;">
										<a-radio-group @change="changeSendType" v-model="send_type">
											<a-radio :value="1">选择已有客户<a-button style="margin-left: 10px;" type="primary" @click="selectPhone" v-show="send_type == 1">选择客户<span>{{selectTxt}}</span></a-button></a-radio>
											<a-radio :value="2" v-has="'user-add'">从Excel导入
												<span v-show="send_type == 2">
													<a-upload
															name="avatar"
															:showUploadList="false"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															:beforeUpload="beforeUpload"
													>
														<a-button type="primary" style="margin-left: 10px">上传excel</a-button>
													</a-upload>
													<span>{{file_name}}</span>
												</span></a-radio>
											<a-radio :value="3">输入手机号</a-radio>
										</a-radio-group>
										<div class="changeType">
											<div v-show="send_type == 3">
												<a-form-item label="" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" style="padding-top: 15px;">
													<a-textarea style="height: 110px;border: 1px solid #d9d9d9;resize: none;" placeholder="手机号之间使用,分割" v-model="phoneTxt"  :autosize="false"/>
												</a-form-item>
											</div>
										</div>
										<div v-if="send_type == 2"><a :href="$store.state.commonUrl+'/upload/customer.xlsx'"
										         style="margin:10px;">示例数据</a>请按照模板中的要求上传客户</div>
									</a-form-item>
									<!-- 群发时间 -->
									<a-form-item
											label="群发时间"
											:label-col="{ span: 3 }"
											:wrapper-col="{ span: 15 }"
											style="padding-bottom: 15px;"
									>
										<a-radio-group v-model="sendTime" @change="changeSendTime">
											<a-radio :value="1">立即发送</a-radio>
											<a-radio :value="2">指定时间发送</a-radio>
										</a-radio-group>
										<div v-show="sendTime == 2">
											<a-date-picker
													@change="selectDate"
													:defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')"
													:disabledDate="disabledStartDate"
													:allowClear="false"
											/>
											<a-time-picker
													:defaultValue="moment(getCurrentTime(), 'HH:mm')"
													format="HH:mm"
													style="width: 174px;margin-left: 15px;"
													:disabledHours="disabledHours"
													:disabledMinutes="disabledMinutes"
													@change="selectTime"
													:allowClear="false"
											/>
										</div>
										<div class="content-msg">
											<p style="margin-bottom: 0px;line-height: 25px;">1、 需要约1个小时的时间进行发送准备，请提前提交；
												<a-tooltip placement="bottom">
													<template slot="title">
														<span>营销短信发送需要经过短信运营商审核，如果需要及时发送，请在9:00-20:00点击发送申请。如果是20:00后申请，则次日9:00后发送成功</span>
													</template>
													<a-icon type="question-circle"/>
												</a-tooltip>
											</p>
											<p style="margin-bottom: 0px;line-height: 25px;">2、为保障您的营销短信发送成功率，建议发送100条以上的短信；
												<a-tooltip placement="bottom">
													<template slot="title">
														<span>短信运营商规定，当营销短信单次发送量较少时，有可能视为钓鱼短信进行拦截。因此当一次性发送短信数量低于100条时，短信的发送成功率，相对有可能会比较低</span>
													</template>
													<a-icon type="question-circle"/>
												</a-tooltip>
											</p>
											<p style="margin-bottom: 0px;line-height: 25px;">3、 逢双十一、电商活动和节假日期间，发送量大，部分短信可能会出现短时间发送延迟，尽请谅解！</p>
										</div>
										<div style="height: 20px;border-bottom: 1px solid #E0E0E0;"></div>
										<div style="margin-top: 15px;">
											<a-button type="primary" @click="createdMsg">确定并创建消息</a-button>
										</div>
									</a-form-item>
								</a-form>
						</div>
					</a-layout-content>
					<a-modal title="选择客户" v-model="visible" @cancel="handleCancel" @ok="handleOk" width="800px" >
						<div style="padding: 30px 20px;height: 450px;overflow: auto;">
							<a-table :rowSelection="rowSelection"
							         :columns="columns"
							         :dataSource="customerArr"
							         :pagination="false"
							         :rowClassName="rowClassName">
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
							<div style="width: 100%;margin-top: 20px;overflow: hidden;" v-show="total > 0">
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
									              :current="page"
									              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
									              @change="changePage"
									              @showSizeChange="showSizeChange"/>
								</div>
							</div>
						</div>
					</a-modal>
				</a-layout>
			</a-layout>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import moment from "moment";
	import "moment/locale/zh-cn";
	moment.locale("zh-cn");
	const columns = [
		{
			title      : '手机号',
			dataIndex  : 'phone',
			key        : 'phone'
		},
		{
			title    : '姓名',
			dataIndex: 'name',
			key      : 'name',
			scopedSlots: {customRender: "name"}
		},
		{
			title    : '微信昵称',
			dataIndex: 'nickname',
			key      : 'nickname',
			scopedSlots: {customRender: "nickname"}
		},
		{
			title      : '性别',
			dataIndex  : 'sex',
			key        : 'sex',
			scopedSlots: {customRender: "sex"}
		},
		{
			title    : '备注',
			dataIndex: 'remark',
			key      : 'remark',
			scopedSlots: {customRender: "remark"}
		},
	];
	export default {
		data () {
			return {
				isLoading       : true, //Loading 组件显示与隐藏
				title       : "", //消息名称
				signArr         : [], //短信签名
				typeArr         : [], //发送场景
				templateArr     : [], //短信内容数据
				customerArr     : [], //客户数据
				sign_id         : "", //短信签名id
				sign_title      : "", //短信签名名称
				type_id         : "", //发送场景id
				template_id     : "", //短信内容id
				template_content: "", //短信内容
				send_type       : 1, //发送对象类型
				fileInfo        : {}, //上传excel的文件信息
				file_name       : '', //上传excel的名称
				visible         : false, // 选择客户显示
				exportPhone     : "",//导入手机号
				phoneTxt        : "",//输入手机号
				//表格部分
				columns,
				selectedMax: 1000, // 最多选择多少条
				selectedRowKeys: [], // 选择多少条
				selectCustomerIds:[],//最终选择数据
				selectTxt:"",//最终选择显示文字
				keysArr        : [],//所有粉丝的键值
				//分页
				page        : 1, //页数
				pageSize    : 15, //每页个数
				total       : 0, //总条数
				quickJumper : false, // 是否显示快速跳转的控件
				push_type : "1", // 群发时间设置：1立即发送、2指定时间
				push_time       : '',//创建发送时间

				//日期选择
				startValue      : null,
				endValue        : null,
				endOpen         : false,
				s_time          : "", //开始日期
				e_time          : "", //结束日期

				moment, //时间选择器
				dateValue       : parseInt(new Date().getTime() / 1000), //群发时间的日期
				timeValue       : parseInt(new Date().getTime() / 1000 + 600), //群发时间的时间
				peopleNum       : "", //符合条件的人数
				typeValue2      : 1, //传给子组件的type值，获取素材接口1为图文，所以要将传给子组件的type值改成1
				sendTime        : 1, //发送时间
				createdId       : 0, //群发id,添加为0，修改为1
				continue        : 1, //默认被转载

				loading3        : false, //手机预览确定按钮加载显示与隐藏
				date            : "00:00:00", //指定发送时间默认
				date2           : moment(), //指定发送日期默认
				commonUrl       : this.$store.state.commonUrl, //公共的链接
				mediumEditor    : [],   // 初始化的medium-editor
				wordNum         : 0,//编辑框的字数
				wordLimit       : 300, //  编辑框文字限制
				textContent:'',//编辑框传给后台的内容
			};
		},
		computed: {
			rowSelection() {
				const {selectedRowKeys} = this;
				return {
					selectedRowKeys,
					onChange             : this.onSelectChange,
					hideDefaultSelections: true,
					onSelect             : this.onSelectRow,
					selections           : [
						{
							key     : "current-data",
							text    : "当前页",
							onSelect: changableRowKeys => {
								if(changableRowKeys.length > this.selectedMax){
									this.$message.error('最多只能选择'+this.selectedMax+'个')
									changableRowKeys.splice(this.selectedMax,changableRowKeys.length-this.selectedMax)
								}
								this.selectedRowKeys = changableRowKeys;
								console.log(this.selectedRowKeys,'changableRowKeys')
							}
						},
						{
							key     : "all-data",
							text    : "选择所有项",
							onSelect: () => {
								console.log(this.keysArr.valueOf(),22222);
								//this.selectedRowKeys = [...this.keysArr.valueOf()];
								if(this.keysArr.length > this.selectedMax){
									this.$message.error('最多只能选择'+this.selectedMax+'个');
									this.selectedRowKeys = [];
								}else{
									this.selectedRowKeys = this.keysArr;
								}
							}
						}
					],
					onSelection          : this.onSelection
				};
			},
		},
		methods: {
			onSelectChange (selectedRowKeys, value) {
				if(selectedRowKeys.length > this.selectedMax){
					this.$message.error('最多只能选择'+this.selectedMax+'个')
					selectedRowKeys.splice(this.selectedMax,selectedRowKeys.length-this.selectedMax)
				}
				this.selectedRowKeys = selectedRowKeys;
			},
			onSelectRow (record, selected, selectedRows, nativeEvent){
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val);
					if (index > -1) {
						this.splice(index, 1);
					}
				};
				if (selected) {

				} else {

				}

			},
			handleCancel(){
				this.selectedRowKeys = this.selectCustomerIds;
			},
			handleOk () {
				if (this.selectedRowKeys.length == 0) {
					this.$message.warning("请选择客户");
				} else {
					this.visible = false;
					console.log(this.selectedRowKeys,369);
					this.selectCustomerIds = this.selectedRowKeys;
					if(this.selectedRowKeys.length == this.keysArr.length){
						this.selectTxt = '（已选择全部）';
					}else{
						this.selectTxt = '（已选择'+this.selectedRowKeys.length+'个）';
					}
				}
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//消息名称
			changeMsgTitle (e) {
				this.msg_title = e.target.value;
			},
			//选择签名
			changeSignId (id) {
				this.sign_id = id;
				this.changeTemplate(this.sign_id,this.type_id);
			},
			//选择签名
			changeSign (title) {
				this.sign_title = title;
			},
			//选择签名
			changeType (id) {
				this.type_id = id;
				this.changeTemplate(this.sign_id,id);
			},
			//修改发送场景获取模版内容
			async changeTemplate (sign_id,type_id) {
				const {data: res} = await this.axios.post("short-message/get-template", {
					uid : localStorage.getItem("uid"),
					sign_id : sign_id,
					type_id : type_id,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.templateArr = res.data.templateArr;
					if(this.templateArr.length > 0){
						this.template_id = this.templateArr[0].id;
						this.template_content = this.templateArr[0].content;
					}else{
						this.template_id = '';
						this.template_content = '';
					}
				}
			},
			changeContent(content){
				this.template_content = content;
			},
			//发送对象类型
			changeSendType (e) {
				this.send_type = e.target.value;
				if(this.send_type == 1){
					this.file_name = '';
					this.fileInfo = {};
					this.phoneTxt = '';
				}else if(this.send_type == 2){
					this.phoneTxt = '';
					this.exportPhone = [];
					this.selectedRowKeys = []
					this.selectCustomerIds = []
					this.selectTxt = ''
				}else if(this.send_type == 3){
					this.file_name = '';
					this.fileInfo = {};
					this.exportPhone = [];
					this.selectedRowKeys = []
					this.selectCustomerIds = []
					this.selectTxt = ''
				}
			},
			beforeUpload(file){
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
				this.isLoading = true;
				this.uploadFile();
				return false; // 返回false不会自动上传
			},
			async uploadFile(){
				let param = new FormData();
				param.append("uid", localStorage.getItem("uid"));
				param.append("is_import", 1);
				param.append("comefrom", 1);
				param.append("importFile", this.fileInfo);
				const {data: res} = await this.axios.post("short-message/add-customer", param);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
					this.exportPhone = [];
					this.file_name = '';
					this.fileInfo = {};
				} else {
					this.isLoading = false;
					this.exportPhone = res.data;
				}
			},
			selectPhone(){
				this.visible = true;
				this.getPhone();
			},
			async getPhone(page = 1, pageSize = this.pageSize){
				const {data: res} = await this.axios.post("short-message/get-phone", {
					uid     : localStorage.getItem("uid"),
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.customerArr = res.data.customerArr;
					this.keysArr = res.data.keysArr;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getPhone(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getPhone(1, pageSize);
			},

			startTime (startValue) {
				this.s_time = startValue.format("X");
				this.getFans();
			},
			endTime (endValue) {
				this.e_time = endValue.format("X");
				// console.log(this.e_time)
				this.getFans();
			},
			//群发时间
			selectDate (value) {
				// console.log(value.format("X"))
				this.dateValue = new Date(value.format("YYYY-MM-DD")).getTime() / 1000;
			},
			disabledStartDate (date2) {
				//打开开始时间面板调用的函数
				return date2.valueOf() < new Date().getTime() - 86400000; //大于今天的日期一律返回true，禁止选择
			},
			getCurrentData () {
				this.date2 = moment.unix(this.dateValue).format("YYYY-MM-DD");
				return this.date2;
			},
			selectTime (time, timeString) {
				this.timeValue = parseInt(new Date(time).getTime() / 1000);
			},
			getCurrentTime () {
				this.date = moment.unix(this.timeValue).format("HH:mm");
				return this.date;
			},
			disabledHours () {
				let year = new Date().getFullYear()
				let month = new Date().getMonth() + 1
				let day = new Date().getDate()
				let dateStr = moment.unix(this.dateValue).format("YYYY-MM-DD")
				if (new Date(dateStr).getTime() / 1000 - 28800 <= new Date(year + '/' + month + '/' + day).getTime() / 1000) {
					const dateString = new Date().getTime() + 600000;
					var a = moment(dateString).format("HH:mm");
					let hours = [];
					let timeArr = a.split(":");
					for (var i = 0; i < parseInt(timeArr[0]); i++) {
						hours.push(i);
					}
					return hours;
				} else {
					return false
				}
			},
			disabledMinutes (selectedHour) {
				let year = new Date().getFullYear()
				let month = new Date().getMonth() + 1
				let day = new Date().getDate()
				let dateStr = moment.unix(this.dateValue).format("YYYY-MM-DD")
				if (new Date(dateStr).getTime() / 1000 - 28800 <= new Date(year + '/' + month + '/' + day).getTime() / 1000) {
					const dateString = new Date().getTime() + 600000;
					var a = moment(dateString).format("HH:mm");
					let minutes = [];
					let timeArr = a.split(":");
					if (selectedHour == parseInt(timeArr[0])) {
						for (var i = 0; i < parseInt(timeArr[1]); i++) {
							minutes.push(i);
						}
					}
					return minutes;
				} else {
					return false
				}
			},
			//群发时间类型
			changeSendTime (e) {
				this.push_type = e.target.value;
			},

			//检查数据
			checkData () {
				if (this.title == '') {
					this.$message.error('请填写消息名称！');
					return false;
				}
				if (this.template_content == '') {
					this.$message.error('请选择短信内容！');
					return false;
				}
				return true;
			},
			//确定并创建消息
			async createdMsg () {
				//发送时间
				let a = moment.unix(this.dateValue).format("YYYY-MM-DD") + 'T' + moment.unix(this.timeValue).format("HH:mm")
				this.push_time = new Date(a).getTime() / 1000
				if (!this.checkData()) {
					return false;
				}
				const {data: res} = await this.axios.post("short-message/add-push", {
					uid        : localStorage.getItem("uid"),
					title      : this.title,
					sign_id    : this.sign_id,
					type_id    : this.type_id,
					template_id: this.template_id,
					content    : this.template_content,
					send_type  : this.send_type,
					phoneTxt   : this.phoneTxt,
					exportPhone: this.exportPhone,
					customerIds: this.selectCustomerIds,
					push_type  : this.push_type,
					push_time  : this.push_time
				});
				if (res.error == 0) {
					this.$message.success("创建成功");
					this.$router.push("/smsSend/list")
				} else {
					this.$message.error(res.error_msg);
				}
			},
			//获取短信群发所需数据
			async getAccount () {
				const {data: res} = await this.axios.post("short-message/push-data", {
					uid : localStorage.getItem("uid"),
				});
				// console.log(res)
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false
					this.signArr = res.data.signArr;
					if(this.signArr.length > 0){
						this.sign_id = this.signArr[0].id;
						this.sign_title = this.signArr[0].title;
					}
					this.typeArr = res.data.typeArr;
					if(this.typeArr.length > 0){
						this.type_id = this.typeArr[0].id;
					}
					this.templateArr = res.data.templateArr;
					if(this.templateArr.length > 0){
						this.template_id = this.templateArr[0].id;
						this.template_content = this.templateArr[0].content;
					}else{
						this.template_id = '';
						this.template_content = '';
					}
				}
			},

		},
		created () {
			this.getAccount();
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

	/deep/ .ant-radio-button-wrapper {
		width: 100px;
		height: 25px;
		line-height: 23px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .ant-col-15 {
		margin-left: 15px;
	}

	/deep/ .ant-col-20 {
		margin-left: 15px;
	}

	#components-layout-demo-basic {
		.ant-layout-sider {
			background: #FFF;
			flex: 0 0 380px !important;
			max-width: 380px !important;
			min-width: 380px !important;
			width: 380px !important;
			border-right: 1px solid #E2E2E2;
			padding: 20px 0;
		}
	}

	#components-layout-demo-basic .ant-layout-content {
		min-width: 885px;
		width: 100%;
		position: relative;
	}

	.content {
		border: 1px solid #E2E2E2;
		min-width: 885px;
		position: absolute;
		top: 20px;
		left: 20px;
		right: 20px;
		background-color: #fafafa;
		margin-bottom: 20px;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
		height: 100%;
	}

	.list {
		height: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: absolute;
		overflow-x: hidden;
		overflow-y: auto;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 5px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	i {
		font-style: normal;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			display: inline-block;
			word-break: break-word;
		}
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 5px 10px;
		margin-top: 12px;
		text-align: left;
	}
	/deep/ #components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		-webkit-box-flex: 0 !important;
		-ms-flex: 0 0 24% !important;
		flex: 0 0 24% !important;
		max-width: 24% !important;
		min-width: 24% !important;
		width: 24% !important;
		border-right: 1px solid #E2E2E2;
		padding: 20px 20px;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}
</style>