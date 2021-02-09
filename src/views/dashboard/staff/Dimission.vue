<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden;">
				<a-layout style="position: absolute;left:0;top:0;bottom:0;right:0;overflow-x: hidden; overflow-y: auto;"
				          class="fans-content scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>离职继承</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">离职继承</div>
						<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
							从通讯录将离职员工删除后，可以分配他的客户及客户群给其他员工继续跟进，<span style="color: #FF562D;">且客户及客户群信息也一并给接替的员工。</span>
						</div>
						<div class="content-hd">
							<a-col style="float: left;">
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 210px;margin-right: 5px;"
										v-model="corpId"
										@change="handleChangeCorp"
								>
									<template v-for="item in corpInfo">
										<a-select-option :value="item.corpid">{{item.corp_full_name ||
											item.corp_name}}
										</a-select-option>
									</template>
								</a-select>
								<a-button @click="showDepartmentList(1)" style="width: 210px;margin-right: 5px;">
									<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
									<span v-else>选择成员</span>
								</a-button>
								<a-range-picker
										:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
										format="YYYY-MM-DD HH:mm"
										allowClear
										style="width:320px;margin-right: 5px;"
										:disabled-date="disabledDate"
										v-model="leaveTime"
										@change="changeTime"
								/>
								<a-button style="margin-left: 10px;" @click="selectTitle" type="primary">查询</a-button>
								<a-button style="margin-left: 10px;" @click="clearTitle">重置</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="dimissionList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'staffDimission-list'">
									<span slot="name2" slot-scope="text, record,index">
										<a-avatar v-if="record.avatar" shape="square"
										          :src="record.avatar" style="float: left;width: 42px;height:42px;"/>
											<img style="width: 42px;height: 42px;float: left;"
											     v-if="!record.avatar" src="../../../assets/useradvart.png"/>
											<div style="float: left;max-width: 270px;word-wrap:break-word;height: 21px;">
												<a-popover placement="top">
													<span slot="content">
														{{record.name}}
													</span>
													<div style="display: inline-block; margin-left: 10px;max-width: 140px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;vertical-align: -webkit-baseline-middle;">
														{{record.name}}
													</div>
												</a-popover>
											</div>
											<span style="vertical-align: -webkit-baseline-middle;">
												<a-icon slot="prefix" type="man"
												        style="margin-left: 10px;color: #427EBA;"
												        v-if="record.gender==1"/>
												<a-icon
														slot="prefix"
														type="woman"
														style="margin-left: 10px;color: #ED4997;"
														v-if="record.gender==2"
												/>
											</span>
									</span>
									<span slot="action" slot-scope="text, record">
										<a-button @click="detailList(record.id,record.name, record.corp_id)"
										          v-has="'staffDimission-detail'">明细</a-button>
									</span>
								</a-table>

								<!--分页-->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'staffDimission-list'">
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
		<!--详情抽屉-->
		<a-drawer
				placement="right"
				:closable="false"
				:visible="detailVisible"
				@close="detailDrawerClose"
				width="1000px!important"
		>
			<template slot="title">
				{{drawerTitle}}
			</template>
			<div style="padding: 20px;">
				<a-tabs v-model="tabKey" style="margin: 0 0 20px;" @change="changeTabKey" type="card">
					<a-tab-pane :key="1" tab="分配客户">
						<div style="margin: 0 0 20px 0;">
							<div style="background-color: #FFFFFF;">
								<div style="height: 32px;line-height: 32px;margin-bottom: 10px;color: #000;">
									共
									<span style="color: blue">{{total2}}</span>个客户
								</div>
								<span class="select-option">
									<label style="margin-right: 5px;">搜索客户：</label>
									<a-input style="margin-right: 5px;width: 210px;"
									         @keyup.enter="getCustomerList(1, pageSize2)"
									         placeholder="请输入要搜索的客户"
									         v-model="customName"/>
								</span>
								<span class="select-option" style="margin-left: 15px;">
									<label style="margin-right: 5px;">分配成员：</label>
									<a-button @click="showDepartmentList(2)" style="width: 210px;margin-right: 5px;">
										<span v-if="chooseNum2 > 0">已选择{{chooseUserNum2}}名成员，{{chooseDepartmentNum2}}个部门</span>
										<span v-else>选择成员</span>
									</a-button>
								</span>
								<span class="select-option" style="margin-left: 15px;">
									<label style="margin-right: 5px;">客户状态：</label>
										<a-select showSearch optionFilterProp="children" placeholder="请选择分配状态"
										          style="width: 210px;margin-right: 5px;" v-model="customStatus">
												<a-select-option :value="-1">全部</a-select-option>
												<a-select-option :value="0">未分配</a-select-option>
												<a-select-option :value="1">已分配</a-select-option>
												<a-select-option :value="2">客户拒绝</a-select-option>
												<a-select-option :value="3">接替成员客户达到上限</a-select-option>
											<a-select-option :value="4">分配中</a-select-option>
											<a-select-option :value="5">未知</a-select-option>
										</a-select>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">分配时间：</label>
									<a-range-picker
											:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
											format="YYYY-MM-DD HH:mm"
											allowClear
											style="width:320px;margin-right: 5px;"
											:disabled-date="disabledDate"
											v-model="leaveTime2"
											@change="changeTime2"
									/>
								</span>
								<a-button type="primary" style="margin-right: 5px;margin-left: 15px;"
								          @click="searchRecord">查找
								</a-button>
								<a-button style="margin-right: 10px;" @click="resetRecord">重置</a-button>
							</div>
						</div>

						<a-spin tip="加载中..." size="large" :spinning="isLoading2">
							<a-table :columns="columns2" :dataSource="customerList" :pagination="false"
							         :rowClassName="rowClassName">
								<div slot="customerInfo" slot-scope="text, record, index">
									<div style="max-width: 400px;overflow: hidden;">
										<a-avatar v-if="record.avatar" shape="square" :size="42" :src="record.avatar"
										          style="float: left;"/>
										<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
										     src="../../../assets/useradvart.png"/>
										<div style="float: left;margin-left:10px;width: calc(100% - 52px);">
											<div>
												<a-popover placement="top">
													<template slot="content">
														{{record.name}}
														<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="record.corp_name != null">@{{record.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
													</template>
													<span>
														{{record.name}}
														<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="record.corp_name != null">@{{record.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
													</span>
												</a-popover>
												<a-icon type="man"
												        style="color: #427EBA;"
												        v-if="record.gender=='男性'"/>
												<a-icon
														type="woman"
														style="color: #ED4997;"
														v-if="record.gender=='女性'"
												/>
											</div>
											<div>
												<div v-if="record.chat_name.length == 0"
												     style="width: 80px;color: #999;font-size: 12px;">所在群：0个
												</div>
												<a-popover placement="left">
													<template slot="content">
														<div style="max-height: 500px; overflow-y: auto;">
															<div v-for="(item,index) in record.chat_name"
															     style="max-width: 500px;display: block;margin-bottom: 5px;">
																<span style="display: inline-block;font-weight: 700;width: 80px;text-align: right; vertical-align: top;">群{{index + 1}}：</span>
																<span style="width: calc(100% - 110px); display: inline-block; margin-bottom: 3px;word-break: break-all;">{{item.name}}（{{item.join_time}}）</span>
															</div>
														</div>
													</template>
													<span style="cursor: pointer;width: 80px;color: #999;font-size: 12px;"
													      v-if="record.chat_name.length > 0">所在群：{{record.chat_name.length}}个
														</span>
												</a-popover>
											</div>
											<div v-if="record.wx_name && record.wx_name != ''"
											     style="color: #999;font-size: 12px;">公众号：{{record.wx_name}}
											</div>
										</div>
									</div>
								</div>
								<div slot="user_name" slot-scope="text, record, index">
									<span v-if="record.user_name == ''">--</span>
									<a-tag color="orange" v-else>
										{{record.user_name}}
									</a-tag>
								</div>
							</a-table>
							<!--分页-->
							<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
							     v-show="total2 > 0">
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total2" showSizeChanger :showQuickJumper="quickJumper2"
									              :current="page2"
									              :pageSize="pageSize2" :pageSizeOptions="['15','30','50','100']"
									              @change="changePage2"
									              @showSizeChange="showSizeChange2"/>
								</div>
							</div>
						</a-spin>
					</a-tab-pane>
					<a-tab-pane :key="2" tab="分配客户群">
						<div style="margin: 0 0 20px 0;">
							<div style="background-color: #FFFFFF;">
								<div style="height: 32px;line-height: 32px;margin-bottom: 10px;color: #000;">
									共
									<span style="color: blue">{{total3}}</span>个客户群
								</div>
								<span class="select-option">
									<label style="margin-right: 5px;width: 85px;">搜索客户群：</label>
									<a-input style="margin-right: 5px;width: 210px;"
									         @keyup.enter="getCustomerChatList(1, pageSize3)"
									         placeholder="请输入要搜索的客户群"
									         v-model="customChatName"></a-input>
								</span>
								<span class="select-option" style="margin-left: 15px;">
									<label style="margin-right: 5px;">分配成员：</label>
									<a-button @click="showDepartmentList(3)" style="width: 210px;margin-right: 5px;">
										<span v-if="chooseNum3 > 0">已选择{{chooseUserNum3}}名成员，{{chooseDepartmentNum3}}个部门</span>
										<span v-else>选择成员</span>
									</a-button>
								</span>
								<span class="select-option" style="margin-left: 15px;">
									<label style="margin-right: 5px;">分配状态：</label>
										<a-select showSearch optionFilterProp="children" placeholder="请选择分配状态"
										          style="width: 210px;margin-right: 5px;" v-model="customChatStatus">
												<a-select-option :value="-1">全部</a-select-option>
												<a-select-option :value="0">未分配</a-select-option>
												<a-select-option :value="1">已分配</a-select-option>
										</a-select>
								</span>
								<span class="select-option" style="margin-left: 15px;">
									<label style="margin-right: 5px;">分配时间：</label>
									<a-range-picker
											:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
											format="YYYY-MM-DD HH:mm"
											allowClear
											style="width:320px;margin-right: 5px;"
											:disabled-date="disabledDate"
											v-model="leaveTime3"
											@change="changeTime3"
									/>
								</span>
								<a-button type="primary" style="margin-right: 5px;"
								          @click="searchStaff">查找
								</a-button>
								<a-button style="margin-right: 10px;" @click="resetStaff">重置</a-button>
							</div>
						</div>
						<a-spin tip="加载中..." size="large" :spinning="isLoading3">
							<a-table :columns="columns3" :dataSource="customChatList" :pagination="false"
							         :rowClassName="rowClassName">
								<div slot="chat_name" slot-scope="text, record, index">
									<div style="max-width: 400px;overflow: hidden;">
										<span style="background: #01b065;width: 36px;height:36px;margin-right: 5px;border-radius: 4px;float: left;"
										      v-if="record.avatarData.length == 0">
									<img :src="img"
									     style="width: 20px;margin: 8px;height: 20px;"/>
								</span>
										<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;border-radius: 4px;float: left;"
										      v-else-if="record.avatarData.length == 1">
									<img :src="record.avatarData[0]"
									     style="width: 36px;height:36px;"
									     v-if="record.avatarData[0] != ''"/>
									<img :src="img2" style="width: 36px;height:36px;"
									     v-if="record.avatarData[0] == ''"/>
								</span>
										<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
										      v-else-if="record.avatarData.length > 1 && record.avatarData.length <= 4">
									<template v-for="imgItem in record.avatarData">
										<img :src="imgItem"
										     style="width: 17px;height: 17px;" v-if="imgItem != ''"/>
										<img :src="img2" style="width: 17px;height: 17px;"
										     v-if="imgItem == ''"/>
									</template>
								</span>
										<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
										      v-else-if="record.avatarData.length > 4">
									<template v-for="imgItem in record.avatarData">
										<img :src="imgItem"
										     style="width: 10px;height: 10px;" v-if="imgItem != ''"/>
										<img :src="img2" style="width: 10px;height: 10px;"
										     v-if="imgItem == ''"/>
									</template>
								</span>
										<div style="display: inline-block;width: calc(100% - 41px);line-height: 36px;">
											<a-popover trigger="hover"
											           v-if="record.chat_name">
											<span slot="content"
											      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
												{{record.chat_name}}
											</span>
												<span style="display: inline-block; max-width: calc(100% - 36px); overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
												{{record.chat_name}}
											</span>
											</a-popover>
											<span v-if="!record.chat_name">--</span>
											<span style="vertical-align: top;">（{{record.count}}）</span>
										</div>
									</div>
								</div>
								<div slot="user_name" slot-scope="text, record, index">
									<span v-if="record.user_name == ''">--</span>
									<a-tag color="orange" v-else>
										{{record.user_name}}
									</a-tag>
								</div>
							</a-table>
							<!--分页-->
							<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
							     v-show="total3 > 0">
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total3" showSizeChanger :showQuickJumper="quickJumper3"
									              :current="page3"
									              :pageSize="pageSize3" :pageSizeOptions="['15','30','50','100']"
									              @change="changePage3"
									              @showSizeChange="showSizeChange3"/>
								</div>
							</div>
						</a-spin>
					</a-tab-pane>
				</a-tabs>
			</div>
		</a-drawer>
		<!--部门选择框-->
		<chooseDepartment ref="user" :id="id" :show="showModalDepartment" :chooseNum="chooseStaffNum"
		                  :callback="modalVisibleChange" :noticeTitle="noticeTitle" :is_del="is_del"></chooseDepartment>
	</div>
</template>

<script>
	import img from '../../../assets/chat.png'
	import img2 from '../../../assets/useradvart.png'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import moment from "moment";

	const columns = [
		{
			title      : '离职成员',
			dataIndex  : "name",
			key        : "name",
			scopedSlots: {customRender: 'name2'}
		},
		{
			title    : '持有客户数',
			dataIndex: "user_count",
			key      : "user_count"
		},
		{
			title    : '持有群聊数',
			dataIndex: "chat_count",
			key      : "chat_count"
		},
		{
			title    : '待分配客户数',
			dataIndex: "will_user_count",
			key      : "will_user_count"
		},
		{
			title    : '待分配群聊数',
			dataIndex: "will_chat_count",
			key      : "will_chat_count"
		},
		{
			title    : '离职时间',
			dataIndex: "time",
			key      : "time",
			width    : 150,
		},
		{
			title      : '操作',
			dataIndex  : "action",
			key        : 'action',
			width      : 180,
			scopedSlots: {customRender: 'action'},
		},
	];
	const columns2 = [
		{
			title      : '客户信息',
			dataIndex  : "customerInfo",
			key        : "customerInfo",
			scopedSlots: {customRender: 'customerInfo'}
		},
		{
			title    : '客户状态',
			dataIndex: "status",
			key      : "status"
		},
		{
			title      : '分配成员',
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {customRender: 'user_name'}
		},
		{
			title    : '分配时间',
			dataIndex: "time",
			key      : "time"
		},
	];
	const columns3 = [
		{
			title      : '客户群信息',
			dataIndex  : "chat_name",
			key        : "chat_name",
			scopedSlots: {customRender: 'chat_name'}
		},
		{
			title    : '分配状态',
			dataIndex: "status",
			key      : "status"
		},
		{
			title      : '分配成员',
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {customRender: 'user_name'}
		},
		{
			title    : '分配时间',
			dataIndex: "time",
			key      : "time"
		},
	];

	export default {
		name      : "staffDimission",
		components: {chooseDepartment},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				img,
				img2,
				moment,
				id                  : '', // 选择成员组件corpId
				commonUrl           : this.$store.state.commonUrl, //公共的链接
				corpId              : corpId,
				corpId1             : '', // 明细传参corp_id
				corpInfo            : [], //企业微信列表
				//表格部分
				columns,
				isLoading           : false,//加载的显示与隐藏
				dimissionList       : [],//离职列表
				leaveTime           : null, //离职时间
				//分页
				total               : 0, //总条数
				quickJumper         : false, // 是否显示快速跳转的控件
				page                : 1, //页码
				pageSize            : 15, //每页数据条数
				//成员组件
				showModalDepartment : false, //成员选择框显示与隐藏
				noticeTitle         : '',
				is_del              : 0,//选择成员组件是否调已删除的员工，1是，0不是
				chooseStaffNum      : 0,//已选择的成员数量，传给组件的总值
				chooseType          : 1,//哪块选择成员，1离职列表，2分配客户，3分配客户群
				chooseNum           : 0,//离职列表已选择的部门成员总个数
				chooseUserNum       : 0,//成员个数
				chooseDepartmentNum : 0,//部门个数
				chooseNum2          : 0,//分配客户列表已选择的部门成员总个数
				chooseUserNum2      : 0,//成员个数
				chooseDepartmentNum2: 0,//部门个数
				chooseNum3          : 0,//分配客户群列表已选择的部门成员总个数
				chooseUserNum3      : 0,//成员个数
				chooseDepartmentNum3: 0,//部门个数量
				checkedList         : [],//离职列表选择的成员id数组
				user                : [],//离职列表选择的成员数据
				checkedList2        : [],//分配客户列表选择的成员id数组
				user2               : [],//分配客户列表选择的成员数据
				checkedList3        : [],//分配客户群列表选择的成员id数组
				user3               : [],//分配客户群列表选择的成员数据
				//详情抽屉
				detailVisible       : false,//详情抽屉的显示与隐藏
				detailId            : '',//详情的离职成员id
				drawerTitle         : '',//标题
				tabKey              : 1,//tab切换
				//分配客户
				columns2,
				isLoading2          : false,//加载的显示与隐藏
				customName          : '',//搜索的客户姓名
				customStatus        : -1,//客户状态，-1全部，0待分配，1已分配，2客户拒绝，3接替成员客户达到上限
				customerList        : [],//分配客户表格数据
				leaveTime2          : null, //分配时间
				//分页
				total2              : 0, //总条数
				quickJumper2        : false, // 是否显示快速跳转的控件
				page2               : 1, //页码
				pageSize2           : 15, //每页数据条数
				//分配客户群
				columns3,
				isLoading3          : false,//加载的显示与隐藏
				customChatName      : '',//搜索的客户群名称
				customChatStatus    : -1,//分配状态
				customChatList      : [],//成员邀请表格数据
				leaveTime3          : null, //分配时间
				//分页
				total3              : 0, //总条数
				quickJumper3        : false, // 是否显示快速跳转的控件
				page3               : 1, //页码
				pageSize3           : 15, //每页数据条数
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
			//获取表格内容
			async getList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("work-user/work-dismiss-users", {
					corp_id   : this.corpId,
					user_id   : this.checkedList,
					page      : page,
					page_size : pageSize,
					start_time: this.leaveTime ? (this.leaveTime.length > 1 ? this.leaveTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					end_time  : this.leaveTime ? (this.leaveTime.length > 1 ? this.leaveTime[1].format("YYYY-MM-DD HH:mm") : '') : ''
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.dimissionList = res.data.info;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			// 修改离职时间
			changeTime (date, dateString) {
				this.leaveTime = date
			},
			// 筛选
			selectTitle () {
				this.getList(1, this.pageSize);
			},
			clearTitle () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.checkedList = []
				this.user = []
				this.leaveTime = null
				this.getList(this.page, this.pageSize);
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
			// 分配客户分页
			changePage2 (page, pageSize) {
				this.getCustomerList(page, pageSize);
				document.getElementsByClassName('ant-drawer-wrapper-body')[0].scrollTo(0, 0)
			},
			showSizeChange2 (page, pageSize) {
				this.getCustomerList(1, pageSize);
			},
			// 分配客户群分页
			changePage3 (page, pageSize) {
				this.getCustomerChatList(page, pageSize);
				document.getElementsByClassName('ant-drawer-wrapper-body')[0].scrollTo(0, 0)
			},
			showSizeChange3 (page, pageSize) {
				this.getCustomerChatList(1, pageSize);
			},
			//详情
			detailList (id, name, corpId) {
				this.detailId = id
				this.corpId1 = corpId
				this.drawerTitle = name
				this.tabKey = 1
				this.customName = ''
				this.checkedList = []
				this.chooseStaffNum = 0
				this.page2 = 1
				this.pageSize2 = 15
				this.getCustomerList()
			},
			//分配客户表格
			async getCustomerList (page = 1, pageSize = this.pageSize2) {
				this.isLoading2 = true
				const {data: res} = await this.axios.post("work-user/work-dismiss-user-detail", {
					corp_id   : this.corpId1,
					id        : this.detailId,
					name      : this.customName,
					user_id   : this.checkedList2,
					start_time: this.leaveTime2 ? (this.leaveTime2.length > 1 ? this.leaveTime2[0].format("YYYY-MM-DD HH:mm") : '') : '',
					end_time  : this.leaveTime2 ? (this.leaveTime2.length > 1 ? this.leaveTime2[1].format("YYYY-MM-DD HH:mm") : '') : '',
					status    : this.customStatus,
					page      : page,
					pageSize  : pageSize
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.customerList = res.data.info
					this.total2 = parseInt(res.data.count);
					this.page2 = page;
					this.pageSize2 = pageSize;
					this.quickJumper2 = this.total2 > this.pageSize2;
					this.detailVisible = true
					this.isLoading2 = false
				}
			},
			detailDrawerClose () {
				this.drawerTitle = ''
				this.customName = ''
				this.chooseNum2 = 0
				this.chooseUserNum2 = 0
				this.chooseDepartmentNum2 = 0
				this.checkedList2 = []
				this.user2 = []
				this.chooseType = 1
				this.customStatus = -1
				this.leaveTime2 = null
				this.customerList = []
				this.total2 = 0
				this.quickJumper2 = false
				this.page2 = 1
				this.pageSize2 = 15
				this.customChatName = ''
				this.chooseNum3 = 0
				this.chooseUserNum3 = 0
				this.chooseDepartmentNum3 = 0
				this.checkedList3 = []
				this.user3 = []
				this.customChatStatus = -1
				this.leaveTime3 = null
				this.customChatList = []
				this.total3 = 0
				this.quickJumper3 = false
				this.page3 = 1
				this.pageSize3 = 15
				this.detailVisible = false
			},
			handleChangeCorp() {
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
			},
			//部门选择弹窗组件
			showDepartmentList (type) {
				this.chooseType = type
				if (this.chooseType == 1) {
					this.id = this.corpId
					this.is_del = 1
					this.noticeTitle = '只展示已删除的成员'
					this.chooseStaffNum = this.chooseNum
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				} else if (this.chooseType == 2) {
					this.id = this.corpId1
					this.is_del = 0
					this.noticeTitle = ''
					this.chooseStaffNum = this.chooseNum2
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList2))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user2))
				} else if (this.chooseType == 3) {
					this.id = this.corpId1
					this.is_del = 0
					this.noticeTitle = ''
					this.chooseStaffNum = this.chooseNum3
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList3))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user3))
				}
				this.showModalDepartment = true
			},
			modalVisibleChange (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.chooseType == 1) {
						this.checkedList = arr
						this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum = userNum
						this.chooseDepartmentNum = departmentNum
						this.user = list
					} else if (this.chooseType == 2) {
						this.checkedList2 = arr
						this.chooseNum2 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum2 = userNum
						this.chooseDepartmentNum2 = departmentNum
						this.user2 = list
					} else if (this.chooseType == 3) {
						this.checkedList3 = arr
						this.chooseNum3 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum3 = userNum
						this.chooseDepartmentNum3 = departmentNum
						this.user3 = list
					}
				}
				this.showModalDepartment = false
			},
			// 修改分配时间
			changeTime2 (date, dateString) {
				this.leaveTime2 = date
			},
			//查找群发记录
			searchRecord () {
				this.getCustomerList()
			},
			resetRecord () {
				this.customName = ''
				this.chooseNum2 = 0
				this.chooseUserNum2 = 0
				this.chooseDepartmentNum2 = 0
				this.checkedList2 = []
				this.user2 = []
				this.leaveTime2 = null
				this.customStatus = -1
				this.getCustomerList()
			},
			//改变tab
			changeTabKey (e) {
				if (e == 1) {
					this.getCustomerList()
				} else if (e == 2) {
					this.getCustomerChatList()
				}
			},
			//分配客户群表格
			async getCustomerChatList (page = 1, pageSize = this.pageSize3) {
				this.isLoading3 = true
				const {data: res} = await this.axios.post("work-user/work-dismiss-chat-detail", {
					corp_id   : this.corpId1,
					id        : this.detailId,
					name      : this.customChatName,
					status    : this.customChatStatus,
					user_id   : this.checkedList3,
					start_time: this.leaveTime3 ? (this.leaveTime3.length > 1 ? this.leaveTime3[0].format("YYYY-MM-DD HH:mm") : '') : '',
					end_time  : this.leaveTime3 ? (this.leaveTime3.length > 1 ? this.leaveTime3[1].format("YYYY-MM-DD HH:mm") : '') : '',
					page      : page,
					pageSize  : pageSize
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.customChatList = res.data.info
					this.total3 = parseInt(res.data.count);
					this.page3 = page;
					this.pageSize3 = pageSize;
					this.quickJumper3 = this.total3 > this.pageSize3;
					this.isLoading3 = false
				}
			},
			// 修改分配时间
			changeTime3 (date, dateString) {
				this.leaveTime3 = date
			},
			//查找成员邀请
			searchStaff () {
				this.getCustomerChatList()
			},
			resetStaff () {
				this.customChatName = ''
				this.chooseNum3 = 0
				this.chooseUserNum3 = 0
				this.chooseDepartmentNum3 = 0
				this.checkedList3 = []
				this.user3 = []
				this.leaveTime3 = null
				this.customChatStatus = -1
				this.getCustomerChatList()
			},
		},
		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.getList()
			});
		},
	}
	;
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

	/deep/ .ant-tag {
		margin-bottom: 5px;
	}

	.actionBtn {
		margin-right: 5px;
		margin-bottom: 5px;
	}

	/deep/ .ant-tree-switcher-icon {
		vertical-align: initial;
	}

	/deep/ .ant-tree-node-content-wrapper.ant-tree-node-selected {
		background-color: #FFFFFF !important;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
		text-align: left;
	}

	.single-accout-card {
		width: 100%;
		background: #F9F9F9;
	}

	.single-accout-card .single-accout-cardItem {
		/*width: 25%;*/
		display: inline-block;
		height: 95px;
		/*padding: 20px 0px 20px 20px;*/
		background: #F9F9F9;
		border: 1px solid #E9E9E9;
		border-left: 0;
	}

	.single-accout-card .single-accout-cardItem:first-child {
		border: 1px solid #E9E9E9;
	}

	.single-accout-cardItem-num {
		text-align: center;
		color: #000;
		font-weight: 700;
		font-size: 34px;
		margin-bottom: 0;
		line-height: 60px;
	}

	.single-accout-cardItem-title {
		margin-bottom: 0;
		text-align: center;
	}

	.select-option {
		display: inline-block;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.select-option label {
		display: inline-block;
		text-align: left;
		width: 70px;
	}

	/deep/ .ant-tabs-bar {
		background: none;
		border-bottom: 2px solid #F5F5F5;
	}
</style>
