<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll" id="components-layout-demo-basic">
		<a-layout-content class="kehuconent">
			<div style="font-size:16px;font-weight:700;color:#333333;margin-left:16px">客户导入分配</div>
			<div>
				<!-- <a-card style="margin-bottom:20px;padding:10px 20px;">
					<label class="tpl-title">客户导入分配</label>
				</a-card> -->
				<div class="content-msg" style="margin: 0 20px 20px;">
					在合规的情况下，以手机号作为客户的线索，下载Ecxel模板表格后输入手机号上传。上传后，表格内手机号将平均分配给选择的员工，分配完成后员工会在企业微信收到添加好友的任务，需要员工手动添加客户。
				</div>

				<div style="padding: 0 20px;">
				<span @click="changeTab(1)" class="tabBtn" :class="{activeBtn:tabKey == 1}"
							v-has="'customImportList-all-list'">批量列表</span>
					<span @click="changeTab(2)" class="tabBtn" :class="{activeBtn:tabKey == 2}"
								v-has="'customImportList-people'">客户列表</span>
				</div>
				<div v-show="tabKey == 1" style="padding: 15px 0;margin: 0px 20px;background: #FFF;">
					<a-col style="background: #FFF;padding: 10px;margin: 0 20px;margin-top: 1px;overflow:hidden;">
						<a-button type="primary" @click="importExcel" style="float: right;"
											v-has="'customImportList-all-export'">导入Excel
						</a-button>
						<div style="float: left;">
							<a-input placeholder="请输入Excel名称" @keyup.enter="find" style="width: 170px;"
											v-model="ExcelName"
											autoComplete="off"/>
							<a-button type="primary" style="margin-left: 10px;" @click="find">查询</a-button>
							<a-button style="margin-left: 10px;" @click="clear">重置</a-button>
						</div>
					</a-col>
					<!-- 表格部分 -->
					<div class="content-bd">
						<a-spin tip="加载中..." size="large" :spinning="isLoading">
							<div class="spin-content">
								<a-table
										:columns="columns"
										:dataSource="batchList"
										:pagination="false"
										:rowClassName="rowClassName"
								>
									<template slot="userName" slot-scope="text, record, index">
										<div style="max-width: 300px;">
											<template v-if="record.userName.length>5">
												<a-popover trigger="hover">
													<span slot="content"
																style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
														<template v-for="user in record.userName">
															<a-tag v-if="user.title == 'name'" color="orange"
																		style="margin-top: 5px;">{{user.name}}</a-tag>
														</template>
														<template v-for="user in record.userName">
															<a-tag v-if="user.title != 'name'" color="blue"
																		style="margin-top: 5px;">{{user.name}}</a-tag>
														</template>
													</span>
													<template v-for="(user,index) in record.userName">
														<a-tag v-if="index < 5 && user.title == 'name'" color="orange"
																	style="margin-top: 5px;">{{user.name}}</a-tag>
													</template>
													<template v-for="user in record.userName">
														<a-tag v-if="index < 5 && user.title != 'name'" color="blue"
																	style="margin-top: 5px;">{{user.name}}</a-tag>
													</template>
													<span style="cursor: pointer;">等共计{{getUserNum(record.userName)}}位成员、{{record.userName.length - getUserNum(record.userName)}}个部门</span>
												</a-popover>
											</template>
											<template v-else>
												<template v-for="user in record.userName">
													<a-tag v-if="user.title == 'name'" color="orange"
																style="margin-top: 5px;">{{user.name}}</a-tag>
												</template>
												<template v-for="user in record.userName">
													<a-tag v-if="user.title != 'name'" color="blue"
																style="margin-top: 5px;">{{user.name}}</a-tag>
												</template>
											</template>
										</div>
									</template>
									<template slot="addNum">
										添加客户数
										<a-tooltip placement="bottom">
											<template slot="title">
												<div>成功将手机号客户添加到企业微信里</div>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</template>
									<template slot="action" slot-scope="text, record, index">
										<a-button style="margin: 10px 5px 0 0;" @click="detailList(record.import_id)"
															v-has="'customImportList-all-info'">
											详情
										</a-button>
										<a-popconfirm
												title="确定删除吗?"
												@confirm="deleteList(record.import_id)"
												okText="确定"
												cancelText="取消"
										>
											<a-button v-has="'customImportList-all-delete'">删除</a-button>
										</a-popconfirm>
									</template>
								</a-table>
								<!--分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
										v-show="total > 0">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total}}</span>
										条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
																	:current="page"
																	:pageSize="pageSize"
																	:pageSizeOptions="['2','3','15','30','50','100']"
																	@change="changePage"
																	@showSizeChange="showSizeChange"/>
									</div>
								</div>
							</div>
						</a-spin>
					</div>
				</div>
				<div v-show="tabKey == 2" style="padding: 15px 0;margin: 0px 20px;background: #FFF;">
					<a-col style="background: #FFF;padding: 10px;margin: 0 20px;margin-top: 1px;">
						<a-input
								style="width: 170px;margin-right: 10px;"
								@keyup.enter="find2"
								:value="phone"
								@change="phoneChange"
								placeholder="请输入客户电话"
						/>
						<a-select
								showSearch
								optionFilterProp="children"
								style="width: 170px;"
								v-model="addStatus"
								placeholder="请选择添加状态"
						>
							<a-select-option :value="-1">全部状态</a-select-option>
							<a-select-option :value="1">未添加</a-select-option>
							<a-select-option :value="2">已添加</a-select-option>
						</a-select>
						<a-button type="primary" style="margin-left: 10px;" @click="find2">查询</a-button>
						<a-button style="margin-left: 10px;" @click="clear2">重置</a-button>
					</a-col>
					<!-- 表格部分 -->
					<div class="content-bd">
						<a-spin tip="加载中..." size="large" :spinning="isLoading2">
							<div class="spin-content">
								<a-table
										:columns="columns2"
										:dataSource="customList"
										:pagination="false"
										:rowClassName="rowClassName"
								>
									<template slot="name" slot-scope="text, record, index">
										<span v-if="record.name == ''">--/</span>
										<span v-if="record.name != ''">{{record.name}}/</span>
										<span v-if="record.sex == ''">--/</span>
										<span v-if="record.sex != ''">{{record.sex}}/</span>
										<span v-if="record.area == ''">--</span>
										<span v-if="record.area != ''">{{record.area}}</span>
									</template>
									<template slot="des" slot-scope="text, record, index">
										<span v-if="record.des == ''">--</span>
										<span v-if="record.des != ''">{{record.des}}</span>
									</template>
									<template slot="userName" slot-scope="text, record, index">
										<a-tag color="orange">
											{{text}}
										</a-tag>
									</template>
									<template slot="is_add" slot-scope="text, record, index">
										<span v-if="record.is_add == 0">未添加</span>
										<span v-if="record.is_add == 1">已添加</span>
									</template>
								</a-table>
								<!--分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
										v-show="total2 > 0">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total2}}</span>
										条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total2" showSizeChanger :showQuickJumper="quickJumper2"
																	:current="page2"
																	:pageSize="pageSize2"
																	:pageSizeOptions="['15','30','50','100']"
																	@change="changePage2"
																	@showSizeChange="showSizeChange2"/>
									</div>
								</div>
							</div>
						</a-spin>
					</div>
				</div>
			</div>
		</a-layout-content>
		<!-- 上传表格弹窗 -->
		<a-modal
				title="上传表格"
				v-model="showModal"
				@cancel="handleCancel"
				@ok="handleOk"
				width="750px"
				:confirmLoading="modalLoading">
			<div style="padding: 10px 0px;min-height: 300px;overflow: auto;">
				<div style="color:red;">为了避免导入时出现等待时间过长，建议单次上传不超过5000条，最多可支持3万条。</div>
				<!-- 选择表格 -->
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">
	                    <span style="color: red;"> * </span>选择表格
	                </span>
					<a-upload
							name="avatar"
							:showUploadList="false"
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							:beforeUpload="beforeUpload"
					>
						<a-button type="primary"
						          style="height: 28px;font-size: 14px;">上传Excel
						</a-button>
					</a-upload>
					<template v-if="file_name != ''">
						<span style="margin-left: 5px;">{{file_name}}</span>
						<a-icon type="close-circle" style="vertical-align: text-top;margin-left: 3px;"
						        @click="closeExcel"/>
					</template>
					<div style="line-height: normal;margin-bottom: 20px;color: #999;">下载<a
							:href="$store.state.commonUrl + '/upload/import_customer.xlsx'">Excel模板</a>。<span>请按照模板的要求上传客户资料，若有重复手机号或空行将会自动过滤，以及不符合规范的填写格式，上传后直接显示”--“</span>
					</div>
				</a-form-item>
				<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">
	                    <span style="color: red;"> * </span>选择应用
	                </span>
					<template>
						<a-select
								showSearch
								optionFilterProp="children"
								style="width: 200px;"
								v-model="agent_id" placeholder="请选择应用" @change="chooseAgent">
							<template v-for="item in agentList">
								<a-select-option :value="item.id">{{item.name}}
								</a-select-option>
							</template>
						</a-select>
						<div style="color: #999;line-height: normal;margin-bottom: 5px;">
							关联应用后，员工在企业微信会收到添加好友（分配的客户）的任务通知。
						</div>
						<div class="content-msg" style="font-size: 13px;">
							<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a target="_blank"
							                                                                      href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
								企业微信后台</a>创建自建应用。<a target="_blank"
							                        href="https://support.qq.com/products/104790/faqs/63937">
								教程</a></p>
							<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">
								2、选择此应用，请确认已设置过应用的可信域名。
								<a :href="$store.state.commonUrl+'/upload/slider.png'" target="_blank"
								   class="el-link el-link--primary">
									<span class="el-link--inner">查看图示</span>
								</a>
							</p>
						</div>
					</template>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">
	                    <span style="color: red;"> * </span>选择企业成员
	                </span>
					<a-button @click="showDepartmentList">
						选择
					</a-button>
					<span style="margin-left: 5px"
					      v-show="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
					<a style="margin-left: 10px;" v-show="chooseNum > 0"
					   @click="clearDepartmentList">
						重置
					</a>
					<div style="line-height: normal;color: #999;">表格内手机号将平均分配给选择的员工。</div>
				</a-form-item>
			</div>
		</a-modal>
		<!--详情抽屉-->
		<a-drawer
				placement="right"
				:closable="false"
				:visible="detailVisible"
				@close="detailDrawerClose"
				width="1000px!important"
		>
			<template slot="title">
				{{detailTitle}}
			</template>
			<div>
				<a-col style="background: #FFF;padding: 10px 0;margin: 1px 20px 0;">
					<a-input
							style="width: 170px;margin-right: 10px;"
							@keyup.enter="find2"
							:value="phone"
							@change="phoneChange"
							placeholder="请输入客户电话"
					/>
					<a-select
							showSearch
							optionFilterProp="children"
							style="width: 170px;"
							v-model="addStatus"
							placeholder="请选择添加状态"
					>
						<a-select-option :value="-1">全部状态</a-select-option>
						<a-select-option :value="1">未添加</a-select-option>
						<a-select-option :value="2">已添加</a-select-option>
					</a-select>
					<a-button type="primary" style="margin-left: 10px;" @click="find2">查询</a-button>
					<a-button style="margin-left: 10px;" @click="clear2">重置</a-button>
				</a-col>
				<!-- 表格部分 -->
				<div class="content-bd">
					<!--					<a-spin tip="加载中..." size="large" :spinning="isLoading2">-->
					<a-table
							:columns="columns2"
							:dataSource="customList"
							:pagination="false"
							:rowClassName="rowClassName"
					>
						<template slot="name" slot-scope="text, record, index">
							<span v-if="record.name == ''">--/</span>
							<span v-if="record.name != ''">{{record.name}}/</span>
							<span v-if="record.sex == ''">--/</span>
							<span v-if="record.sex != ''">{{record.sex}}/</span>
							<span v-if="record.area == ''">--</span>
							<span v-if="record.area != ''">{{record.area}}</span>
						</template>
						<template slot="des" slot-scope="text, record, index">
							<span v-if="record.des == ''">--</span>
							<span v-if="record.des != ''">{{record.des}}</span>
						</template>
						<template slot="userName" slot-scope="text, record, index">
							<a-tag color="orange">
								{{text}}
							</a-tag>
						</template>
						<template slot="is_add" slot-scope="text, record, index">
							<span v-if="record.is_add == 0">未添加</span>
							<span v-if="record.is_add == 1">已添加</span>
						</template>
					</a-table>
					<!--分页 -->
					<div class="pagination" style="overflow: hidden;margin: 20px;"
					     v-show="total2 > 0">
						<div style="height: 32px;float: left;line-height: 32px;">
							共
							<span style="color: blue">{{total2}}</span>
							条
						</div>
						<div class="pagination" style="height: 32px;float: right;">
							<a-pagination :total="total2" showSizeChanger :showQuickJumper="quickJumper2"
							              :current="page2"
							              :pageSize="pageSize2"
							              :pageSizeOptions="['15','30','50','100']"
							              @change="changePage2"
							              @showSizeChange="showSizeChange2"/>
						</div>
					</div>
					<!--					</a-spin>-->
				</div>
			</div>
		</a-drawer>
		<!-- 选择成员组件 -->
		<chooseDepartment
				ref="user"
				:id="corpId"
				:agentid="agent_id"
				:show="showModalDepartment"
				:is_special="1"
				:chooseNum="chooseNum"
				noticeTitle="当前只显示自建应用下可见范围内的成员，即可在企业微信收到添加好友的任务。"
				:callback="modalVisibleChange3">
		</chooseDepartment>
		<!-- 进度条弹窗 -->
		<a-modal v-model="progressVisible" title="上传进度" :footer="false" :closable="false" :maskClosable="false"
		         :maskStyle="{'left':leftSiderWidth}" :wrapClassName="'mask-dialog'">
			<div style="text-align: center;">
				<a-progress stroke-linecap="square" :percent="progressNum" type="circle"/>
				<div>
					<img src="../../../assets/loadingGif.gif" alt="">
				</div>
				<p style="margin: 0 auto 20px;">已成功上传{{successNum}}个客户，失败{{failNum}}个客户，还有{{notImportNum}}个客户待上传</p>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import chooseDepartment from "@/components/ChooseDepartment.vue"

	const columns = [
		{
			title    : "Excel名称",
			dataIndex: "title",
			key      : "title"
		},
		{
			title    : "上传时间",
			dataIndex: "add_time",
			key      : "add_time"
		},
		{
			title      : "分配员工",
			dataIndex  : "userName",
			key        : "userName",
			scopedSlots: {customRender: "userName"}
		},
		{
			title    : "总人数",
			dataIndex: "all_num",
			key      : "all_num"
		},
		{
			// title    : "添加客户数",
			dataIndex: "addNum",
			key      : "addNum",
			slots    : {title: "addNum"},
		},
		{
			title    : "导入成功的人数",
			dataIndex: "snum",
			key      : "snum"
		},
		{
			title    : "导入失败的人数",
			dataIndex: "fail_num",
			key      : "fail_num"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];
	const columns2 = [
		{
			title    : "客户电话",
			dataIndex: "phone",
			key      : "phone"
		},
		{
			title      : "姓名/性别/地区",
			dataIndex  : "name",
			key        : "name",
			scopedSlots: {customRender: "name"}
		},
		{
			title      : "备注",
			dataIndex  : "des",
			key        : "des",
			scopedSlots: {customRender: "des"}
		},
		{
			title      : "分配员工",
			dataIndex  : "userName",
			key        : "userName",
			scopedSlots: {customRender: "userName"}
		},
		{
			title      : "添加状态",
			dataIndex  : "is_add",
			key        : "is_add",
			scopedSlots: {customRender: "is_add"}
		}
	];

	export default {
		components: {
			chooseDepartment
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId             : corpId,//企业ID
				tabKey             : 1,//tab的值，1批量列表，2客户列表
				//批量列表
				isLoading          : false,//Loading组件的显示与隐藏
				ExcelName          : '',//Excel名称
				batchList          : [],//表格数据
				id                 : '',//详情的id
				//分页
				total              : 0, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				page               : 1, //页码
				pageSize           : 15, //每页数据条数
				showModal          : false,//弹窗的显示与隐藏
				modalLoading       : false,//弹窗确认键的加载
				fileInfo           : {}, //上传excel的文件信息
				file_name          : '', //上传excel的名称
				agentList          : [], // 应用列表
				agent_id           : '',//应用ID
				chooseNum          : 0, // 部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				staffList          : [],//选择的成员表格
				showModalDepartment: false, // 选择成员弹窗
				//表格部分
				columns,
				//客户列表
				isLoading2         : false,//Loading组件的显示与隐藏
				customList         : [],//表格数据
				phone              : '',//搜索输入的客户电话
				addStatus          : -1,//添加状态
				//表格部分
				columns2,
				//分页
				total2             : 0, //总条数
				quickJumper2       : false, // 是否显示快速跳转的控件
				page2              : 1, //页码
				pageSize2          : 15, //每页数据条数
				//详情抽屉
				detailVisible      : false,//详情抽屉的显示与隐藏
				detailTitle        : '',//抽屉标题
				//进度条弹窗
				progressVisible    : false,//进度条弹窗显示与隐藏
				progressNum        : 0,//进度条进度
				leftSiderWidth     : document.getElementsByClassName('menu-sider')[0].style.width,
				successNum         : 0,//成功上传人数
				failNum            : 0,//失败上传人数
				notImportNum       : 0,//待上传人数
			};
		},
		methods   : {
			getUserNum(userList) {
				let num = 0
				for(let i = 0; i < userList.length; i++) {
					if(userList[i].title == "name") {
						num++
					}
				}
				return num
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//切换tab
			changeTab (e) {
				this.tabKey = e
				if (this.tabKey == 1) {
					this.ExcelName = ''
					this.pageSize = 15
					this.getList()
				} else if (this.tabKey == 2) {
					this.phone = ''
					this.addStatus = -1
					this.pageSize2 = 15
					this.id = ''
					this.getCustomList()
				}
			},
			//导入Excel
			importExcel () {
				this.getAgentList()
				this.file_name = ''
				this.fileInfo = {}
				this.staffList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.showModal = true
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
			//删除Excel
			closeExcel () {
				this.fileInfo = {}
				this.file_name = ''
			},
			//选择应用
			chooseAgent (e) {
				this.staffList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
			},
			// 选择成员
			showDepartmentList () {
				let arr = []
				this.staffList.map(x => {
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.staffList))
				this.showModalDepartment = true
			},

			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.staffList = JSON.parse(JSON.stringify(list))
					} else {
						this.staffList = []
					}
				}
				this.showModalDepartment = false
			},
			// 重置
			clearDepartmentList () {
				this.staffList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
			},
			async handleOk () {
				this.modalLoading = true
				if (JSON.stringify(this.fileInfo) == '{}') {
					this.$message.error('请选择上传Excel');
					this.modalLoading = false
					return false;
				}
				if (typeof this.agent_id == 'object' && this.agent_id.length == 0) {
					this.$message.error('请选择应用');
					this.modalLoading = false
					return false;
				}
				if (typeof this.staffList == 'object' && this.staffList.length == 0) {
					this.$message.error('请选择员工');
					this.modalLoading = false
					return false;
				}
				this.showModal = false
				this.$message.info("已进入后台导入中，请耐心等待...");
				let user_ids = []
				this.staffList.map(x => {
					user_ids.push(x.id)
				})
				this.progressNum = 0
				this.successNum = 0
				this.failNum = 0
				this.notImportNum = 0
				this.progressVisible = true
				this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
				this.$nextTick(() => {
					document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
				})
				let param = new FormData();
				param.append("corp_id", this.corpId);
				param.append("agentid", this.agent_id);
				param.append("user_ids", user_ids);
				param.append("importFile", this.fileInfo);
				if (localStorage.getItem('isMasterAccount') == 2) {
					param.append("sub_id", localStorage.getItem('sub_id'));
				}
				const {data: res} = await this.axios.post(
					"work-import-customer/import-customer", param
				);
				if (res.error != 0) {
					this.modalLoading = false;
					this.progressVisible = false
					this.$message.error(res.error_msg);
				} else {
					// this.$message.info("已进入后台导入中，请耐心等待...");
				}
			},
			handleCancel () {
				this.agent_id = ''
				this.fileInfo = {}
				this.file_name = ''
				this.staffList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.modalLoading = false;
				this.showModal = false
			},
			//获取批量列表表格内容
			async getList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post(
					"work-import-customer/import-customer-list",
					{
						corp_id  : this.corpId,
						title    : this.ExcelName,
						page     : page,
						page_size: pageSize
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.batchList = res.data.list;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 90)
				})
			},
			showSizeChange (page, pageSize) {
				this.getList(1, pageSize);
			},
			//点击搜索
			find () {
				this.getList();
			},
			//点击清空
			clear () {
				this.ExcelName = ''
				this.getList();
			},
			//删除
			async deleteList (id) {
				const {data: res} = await this.axios.post(
					"work-import-customer/import-customer-delete",
					{
						import_id: id
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.getList(this.page, this.pageSize)
				}
			},
			//获取应用列表
			async getAgentList (id) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.corpId,
					suite_id  : 1,
					agent_type: 2
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.agentList = res.data
					if (id) {
						this.agent_id = id
					} else if (this.agentList.length != 0 && !id) {
						this.agent_id = this.agentList[0].id
					}
				}
			},
			//获取批量列表表格内容
			async getCustomList (page = 1, pageSize = this.pageSize2) {
				this.isLoading2 = true
				const {data: res} = await this.axios.post(
					"work-import-customer/import-customer-detail-list",
					{
						corp_id  : this.corpId,
						import_id: this.id,
						status   : this.addStatus,
						phone    : this.phone,
						page     : page,
						page_size: pageSize
					}
				);
				if (res.error != 0) {
					this.isLoading2 = false;
					this.$message.error(res.error_msg);
				} else {
					this.customList = res.data.list;
					this.isLoading2 = false;
					this.total2 = parseInt(res.data.count);
					this.page2 = page;
					this.pageSize2 = pageSize;
					this.quickJumper2 = this.total2 > this.pageSize2;
					if (this.id != '') {
						this.detailVisible = true
						this.detailTitle = res.data.importTitle
					}
				}
			},
			//手机号格式更换
			phoneChange (e) {
				const {value} = e.target;
				const reg = /^-?(0|[0-9][0-9]*)(\.[0-9]*)?$/;
				if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
					this.phone = value;
				}
			},
			//点击搜索
			find2 () {
				this.getCustomList();
			},
			//点击清空
			clear2 () {
				this.phone = ''
				this.addStatus = -1
				this.getCustomList();
			},
			// 分页
			changePage2 (page, pageSize) {
				this.getCustomList(page, pageSize);
				if (this.tabKey == 1) {
					document.getElementsByClassName('ant-drawer-wrapper-body')[0].scrollTo(0, 0)
				} else {
					this.$nextTick(() => {
						document.getElementsByClassName('scroll')[0].scrollTo(0, 90)
					})
				}
			},
			showSizeChange2 (page, pageSize) {
				this.getCustomList(1, pageSize);
			},
			//详情
			detailList (id) {
				this.id = id
				this.phone = ''
				this.addStatus = -1
				this.pageSize2 = 15
				this.getCustomList()
			},
			//关闭详情抽屉
			detailDrawerClose () {
				this.detailVisible = false
			},
			//后台返回导入进度数据处理
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'import_customer') {
					if (localStorage.getItem('isMasterAccount') == 1 && data.sub_id == '' || localStorage.getItem('isMasterAccount') == 2 && data.sub_id == localStorage.getItem('sub_id')) {
						this.progressVisible = true
						this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
						this.$nextTick(() => {
							document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
						})
						this.showModal = false
						this.progressNum = parseInt(data.import_num / data.snum * 100)
						this.successNum = data.successNum
						this.failNum = data.failNum
						this.notImportNum = data.notImportNum

						if (data.textHtml != '') {
							if (data.error == 0) {
								this.modalLoading = false;
								this.showModal = false
								this.$message.success(data.textHtml);
								this.getList()
							} else {
								this.$message.error(data.textHtml);
							}
						}

						if (this.progressNum == 100) {
							this.progressVisible = false
						}
					}
				}
			},
		},

		created () {
			// this.progressVisible = true
			// this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
			// this.$nextTick(()=>{
			// 	document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
			// })
			if (localStorage.getItem('isMasterAccount') == 2) {
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				let that = this
				if (permissionButton.indexOf('customImportList-all-list') != -1) {
					that.tabKey = 1
					//接收后台实时返回的导入进度结果
					that.ws.setCallback(this.websocketOnMessage)
					that.getList();
				} else {
					that.tabKey = 2
					that.getCustomList()
				}
				that.$forceUpdate()
			} else {
				this.tabKey = 1
				//接收后台实时返回的导入进度结果
				this.ws.setCallback(this.websocketOnMessage)
				this.getList();
			}

		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		margin: 0 20px 60px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-tabs-bar {
		padding: 0 20px !important;
		background: none !important;
		margin: 0 !important;
	}

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		text-align: left;
		margin: 0 0 20px;
	}

	/deep/ .ant-table-placeholder {
		border-bottom: 0;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0;
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
	#components-layout-demo-basic .kehuconent {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		line-height: 50px;
		height: 100%;
		margin: 20px 20px;
	}
</style>