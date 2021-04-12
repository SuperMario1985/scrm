<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden;">
				<!-- 左侧 -->
				<a-layout
						style="position: absolute;top: 0;bottom: 0;right:0;width: 100%; overflow-x: hidden; overflow-y: auto;"
						class="scroll"
				>
					<!-- 头部 -->
					<a-layout-header>
						<label class="fans-title">成员列表</label>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-hd">
							<!--							<div class="content-hd-left">-->
							<!--								共有-->
							<!--								<span style="color: blue">{{total}}</span>个粉丝-->
							<!--							</div>-->
							<div class="content-hd-left" style="padding: 20px 0;">
								<a-button type="primary" @click="seniorSelect">条件筛选</a-button>
								<span style="color: #ff562d;margin-left: 5px;">默认显示已激活且具有外部联系人权限的成员数据。</span>
							</div>
							<div class="content-hd-right">
								最后一次同步时间：{{top.last_syn_time}}
								<a-button class="btn-primary1"
								           @click="confirm" v-has="'sync-address'">
									同步企业微信通讯录
								</a-button>
								<!--								</a-popconfirm>-->
								<a-button class="btn-primary1" @click="showModal" type="primary"
								           v-has="'staff-add-tag'">
									打标签
								</a-button>
								<a-button class="btn-primary1" @click="showModal1" type="primary" 
								          v-has="'staff-remove-tag'">
									移除标签
								</a-button>
								<a-modal title="为筛选出的所有企业成员移除标签" v-model="visible1" @ok="handleOk1"
								         :confirmLoading="confirmLoading" width="800px">
									<label v-if="fansTag && fansTag.length>0"
									       style="display: block; margin-bottom: 10px; color: #F56C6C;">显示的标签，是当前勾选上的所有企业成员的全部标签。</label>
									<a-checkbox-group @change="onChange3" v-model="tagCheckValue1">
										<a-row>
											<a-col
													:span="8"
													style="margin-bottom: 10px;"
													v-for="item in fansTag"
													:key="item.tagname"
											>
												<a-checkbox :value="item.id">{{item.tagname}}</a-checkbox>
											</a-col>
										</a-row>
										<div v-show="fansTag.length == 0">
											<img src="../../../assets/null.png" alt=""
											     style="display: block;margin: auto;width: 150px;">
											<p style="text-align: center;margin-top: 20px;">没有可移除的标签</p>
										</div>
									</a-checkbox-group>
								</a-modal>
								<a-modal title="为筛选出的所有企业成员增加标签" v-model="visible" @ok="handleOk"
								         :confirmLoading="confirmLoading2" @cancel="cancelVisible" width="800px">
									<!--									<p style="color: red;margin-bottom: 10px;">-->
									<!--										已勾选{{selectedRowKeys.length}}位企业成员，当前最多每人可再打{{tag_num}}个标签（由于每个企业成员最多可打上-->
									<!--										20-->
									<!--										个标签。当批量操作时，取最接近上限的企业成员的剩余可打标签数）。</p>-->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }">
										<template slot="label">
											选择分组
										</template>
										<a-select showSearch optionFilterProp="children" style="width: 180px"
										          v-model="groupId" @change="changeGroup" placeholder="所有分组"
										          :dropdownStyle="{ overflow: 'hidden' }" allowClear>
											<a-select-option value="-1">所有分组</a-select-option>
											<a-select-option v-for="item in groupList" :value="item.id">
												{{item.group_name}}
											</a-select-option>
										</a-select>
									</a-form-item>
									<a-spin tip="加载中..." size="large" :spinning="tagLoading">
										<a-checkbox-group @change="onChange2" :defaultValue="tagCheckValue"
										                  :key="tagCheckIndex">
											<a-row>
												<a-col
														:span="8"
														style="margin-bottom: 10px;"
														v-for="(item,index) in tagsList"
												>
													<a-checkbox :value="item.id" :disabled="disabled[index]">
														{{item.tagname}}
													</a-checkbox>
												</a-col>
											</a-row>
										</a-checkbox-group>
									</a-spin>
									<a-empty v-show="tagsList.length == 0"/>
									<a-button @click="showAddTagModal()" type="primary"
									          v-has="'work-tag-add'">
										新建标签
									</a-button>
								</a-modal>
								<a-modal title="新建标签" v-model="addTagVisible" @ok="onSearch"
								         :confirmLoading="confirmLoading3" style="height: 500px" @cancel="addTagCancel">
									<a-form-item :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<template slot="label">
											选择分组
										</template>
										<a-select showSearch optionFilterProp="children" v-model="editGroupId"
										          style="width: 180px"
										          :dropdownStyle="{ overflow: 'hidden' }">
											<a-select-option v-for="item in groupList" :value="item.id">
												{{item.group_name}}
											</a-select-option>
										</a-select>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<template slot="label">
											标签名称
										</template>
										<p style="margin: 0px;font-size: 13px; color: #909399;">
											每个标签名称最多15个字。同时新建多个标签时，请用“空格”隔开
										</p>
										<a-input placeholder="请输入标签（不得超过15个字符）" v-model="inputValue"/>
									</a-form-item>
								</a-modal>
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<div class="spin-content">
									<a-table
											:rowSelection="rowSelection"
											:columns="columns"
											:dataSource="staffList"
											:pagination="false"
											:rowClassName="rowClassName" v-has="'staff-list'"
									>
										<span slot="apply_num">
						                  发起申请数
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>发起申请数，成员通过「搜索手机号」、「扫一扫」、「从微信好友中添加」、「从群聊中添加」、「添加共享、分配给我的客户」、「添加单向、双向删除好友关系的好友」、「从新的联系人推荐中添加」等渠道主动向客户发起的好友申请数量。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<span slot="new_customer">
						                  新增客户数
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>新增客户数，成员新添加的客户数量。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<span slot="chat_num">
						                  聊天数
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>聊天总数， 成员有主动发送过消息的聊天数，包括单聊和群聊。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<span slot="message_num">
						                  发送消息数
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>发送消息数，成员在单聊和群聊中发送的消息总数。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<span slot="replyed_per">
						                  已回复聊天占比
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>已回复聊天占比，客户主动发起聊天后，成员在一个自然日内有回复过消息的聊天数/客户主动发起的聊天数比例，不包括群聊，仅在确有回复时返回。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<span slot="first_reply_time">
						                  平均首次回复时长
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>平均首次回复时长，当客户主动发起聊天后，企业成员在一个自然日内首次回复的时长间隔为首次回复时长，平均首次回复时长=所有聊天的首次回复总时长/已回复的聊天总数，不包括群聊，单位为分钟</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<span slot="delete_customer_num">
						                  删除/拉黑客户数
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>删除/拉黑成员的客户数，将企业成员删除或者拉黑的客户数量</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<template slot="name" slot-scope="text, record, index">
											<a-avatar v-if="record.thumb_avatar" shape="square"
											          :src="record.thumb_avatar" style="float: left;"/>
											<img style="width: 32px;height: 32px;float: left;"
											     v-if="!record.thumb_avatar" src="../../../assets/useradvart.png"/>
											<div style="float: left;max-width: 270px;word-wrap:break-word;height: 21px;">
												<a-popover placement="top">
													<span slot="content">
														{{record.name}}<span v-if="record.department_name">-</span>{{record.department_name}}
													</span>
													<div style="display: inline-block; margin-left: 10px;max-width: 140px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
													     :style="record.assign_custom != 1 && record.assign_chat != 1 && record.position == '' ? 'vertical-align: -webkit-baseline-middle;' : ''">
														{{record.name}}<span v-if="record.department_name">-</span>{{record.department_name}}
													</div>
												</a-popover>

												<a-popover placement="top">
													<span slot="content">
														{{record.position}}
													</span>
													<div style="max-width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
													     v-if="record.position !== ''">
														（{{record.position}}）
													</div>
												</a-popover>
											</div>
											<span :style="record.assign_custom != 1 && record.assign_chat != 1 ? 'vertical-align: sub;' : ''">
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
											<div style="margin-left: 42px;">
												<a-tag v-if="record.assign_custom == 1" color="red"
												       style="margin-top: 5px;">离职尚未分配客户
												</a-tag>
												<a-tag v-if="record.assign_chat == 1" color="red"
												       style="margin-top: 5px;">离职尚未分配群
												</a-tag>
											</div>
										</template>
										<template slot="enable" slot-scope="text, record, index">
											<span v-if="text == 0">
												<span v-if="record.status == 1">已激活</span>
												<span v-if="record.status == 2">已禁用</span>
												<span v-if="record.status == 4">未激活</span>
												<span v-if="record.status == 5">退出企业</span>
											</span>
											<span v-if="text == 1">已删除</span>
										</template>
										<div slot="tag_name" slot-scope="text, record, index">
											<span v-if="text.length == 0">--</span>

                      <span  v-if="text.length>5">
                          <a-popover>
                              <span slot="content">
                                  <div class="over-width">
                                      <a-tag v-if="text.length > 0" color="blue" v-for="item in text"
                                             style="margin-top: 5px;">
												                {{item}}
										                	</a-tag>
                                  </div>
                              </span>
                              <span  v-for="(item1,index) in text">
                                    <a-tag v-if="index<5" color="blue"
                                           style="margin-top: 5px;">
												                {{item1}}
										                	</a-tag>
                              </span>
                            <span>等{{text.length}}个标签</span>
                          </a-popover>
                      </span>
                      <span v-if="text.length<=5">
                           <a-tag v-if="text.length > 0" color="blue" v-for="item in text"
                                  style="margin-top: 5px;">
												                {{item}}
										                	</a-tag>
                      </span>
										</div>
										<template slot="action" slot-scope="text, record, index">
											<a-button @click="edit" style="margin: 0 5px 5px 0">编辑</a-button>
											<a-button @click="forbidden" style="margin: 0 5px 5px 0">禁用</a-button>
											<a-button @click="detail">详情</a-button>
										</template>
										<template slot="tags_info" slot-scope="text, record, index">
											<div>自动通过：
												<div style="float: right;">
													<span class="start" @click="startStaff">开启</span>
													<span class="setting" @click="settingStaff">设置</span>
												</div>
											</div>
											<div>好友打招呼：
												<div style="float: right;">
													<span class="start" @click="startStaff">开启</span>
													<span class="setting" @click="settingStaff">设置</span>
												</div>
											</div>
											<div>新消息回复：
												<div style="float: right;">
													<span class="start" @click="startStaff">开启</span>
													<span class="setting" @click="settingStaff">设置</span>
												</div>
											</div>
										</template>
									</a-table>
									<!-- 分页 -->
									<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
									     v-show="total > 0" v-has="'staff-list'">
										<div style="height: 32px;float: left;line-height: 32px;">
											共
											<span style="color: blue">{{total}}</span>条
										</div>
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination
													:total="total"
													showSizeChanger
													:showQuickJumper="quickJumper"
													:current="page"
													:pageSize="page_size"
													:pageSizeOptions="['15','30','50','100']"
													@change="changePage"
													@showSizeChange="showSizeChange"
											/>
										</div>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>
				</a-layout>
				<a-drawer
						:destroyOnClose='true'
						title="条件筛选"
						placement="right"
						:closable="false"
						@close="onClose"
						width="365px!important"
						:visible="seniorVisible"
				>
					<!-- 公众号 -->
					<div class="sider-one">
						<div style="margin: 10px 0;">选择企业微信</div>
						<a-select
								showSearch
								optionFilterProp="children"
								style="width: 315px;"
								@change="handleChange"
								v-model="corpId"
						>
							<template v-for="item in corpInfo">
								<a-select-option :value="item.corpid">{{item.corp_full_name ||
									item.corp_name}}
								</a-select-option>
							</template>
						</a-select>
						<!--搜索成员-->
						<div style="margin: 10px 0;">选择成员</div>
						<a-button @click="showDepartmentList" style="width: 315px;">
							<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
							<span v-else>选择成员</span>
						</a-button>
						<div style="margin: 10px 0;">成员状态</div>
						<a-select style="width: 315px;" allowClear
						          optionFilterProp="children"
						          showSearch
						          placeholder="全部" v-model="status">
							<a-select-option :value="0">
								全部
							</a-select-option>
							<a-select-option :value="1">
								已激活
							</a-select-option>
							<a-select-option :value="2">
								已禁用
							</a-select-option>
							<a-select-option :value="3">
								已删除
							</a-select-option>
							<a-select-option :value="4">
								未激活
							</a-select-option>
							<a-select-option :value="5">
								退出企业
							</a-select-option>
						</a-select>
						<div style="margin: 10px 0;">外部联系人权限</div>
						<a-select style="width: 315px"
						          v-model="is_external" placeholder="全部">
							<a-select-option :value="-1">
								全部
							</a-select-option>
							<a-select-option :value="0">
								无
							</a-select-option>
							<a-select-option :value="1">
								有
							</a-select-option>
						</a-select>
					</div>
					<div class="sider-two">
<!--						<a-tree-->
<!--								checkable-->
<!--								@expand="onExpand"-->
<!--								:expandedKeys="expandedKeys"-->
<!--								:autoExpandParent="autoExpandParent"-->
<!--								v-model="checkedKeys"-->
<!--								:treeData="departmentList"-->
<!--						/>-->

						<!-- 排序显示 -->
						<div class="sider-one-txt">排序显示</div>
						<a-radio-group v-model="type" @change="changeSort" style="margin-bottom: 130px;">
							<a-radio-button value="1"
							                style="width: 45%;text-align: left;padding: 0 6px;margin-right: 4%;"
							                @click="btnSort1">发起申请数
								<a-icon type="caret-up"
								        style="position: absolute;right: 3%;margin-top: 4px;font-size: 10px;"
								        :class="btnSortFlag1?'':'btnSortColor'"/>
								<a-icon type="caret-down"
								        style="position: absolute;top: 13px;right: 3%;font-size: 10px;"
								        :class="btnSortFlag1?'btnSortColor':''"/>
							</a-radio-button>
							<a-radio-button value="2" style="width: 45%;text-align: left;padding: 0 6px;"
							                @click="btnSort2">新增客户数
								<a-icon type="caret-up"
								        style="position: absolute;right: 3%;margin-top: 4px;font-size: 10px;"
								        :class="btnSortFlag2?'':'btnSortColor'"/>
								<a-icon type="caret-down"
								        style="position: absolute;top: 13px;right: 3%;font-size: 10px;"
								        :class="btnSortFlag2?'btnSortColor':''"/>
							</a-radio-button>
							<a-radio-button value="3"
							                style="width: 45%;text-align: left;padding: 0 6px;margin-right: 4%;margin-top: 15px;"
							                @click="btnSort3">聊天数
								<a-icon type="caret-up"
								        style="position: absolute;right: 3%;margin-top: 4px;font-size: 10px;"
								        :class="btnSortFlag3?'':'btnSortColor'"/>
								<a-icon type="caret-down"
								        style="position: absolute;top: 13px;right: 3%;font-size: 10px;"
								        :class="btnSortFlag3?'btnSortColor':''"/>
							</a-radio-button>
							<a-radio-button value="4" style="width: 45%;text-align: left;padding: 0 6px;"
							                @click="btnSort4">发送消息数
								<a-icon type="caret-up"
								        style="position: absolute;right: 3%;margin-top: 4px;font-size: 10px;"
								        :class="btnSortFlag4?'':'btnSortColor'"/>
								<a-icon type="caret-down"
								        style="position: absolute;top: 13px;right: 3%;font-size: 10px;"
								        :class="btnSortFlag4?'btnSortColor':''"/>
							</a-radio-button>
						</a-radio-group>
					</div>
					<!-- 确认搜索按钮 -->
					<div class="sider-footer">
						<a-button type="primary" style="margin: 0 25px;" @click="searchStaff">确定搜索</a-button>
						<a-button @click="reset">重置条件</a-button>
					</div>
					<!--部门选择框-->
					<chooseDepartment ref="user" :id="corpId" :show="showModalDepartment" :chooseNum="chooseNum"
					                  :callback="modalVisibleChange" :disabledVal="0"></chooseDepartment>
				</a-drawer>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import chooseDepartment from "@/components/ChooseDepartment.vue"

	const columns = [
		{
			title      : "企业成员",
			dataIndex  : "name",
			width      : 270,
			key        : "name",
			scopedSlots: {customRender: "name"}
		},
		// {
		// 	title    : "所属部门",
		// 	dataIndex: "department_name",
		// 	key      : "department_name",
		// },
		{
			title      : "状态",
			dataIndex  : "is_del",
			width      : 80,
			key        : "is_del",
			scopedSlots: {customRender: "enable"}
		},
		{
			title      : "所属标签",
			dataIndex  : "tag_name",
			key        : "tag_name",
			width      : 120,
			scopedSlots: {customRender: "tag_name"},
		},
		{
			title    : "外部联系人权限",
			dataIndex: "is_external",
			key      : "is_external",
		},
		// {
		// 	title      : "功能设置",
		// 	dataIndex  : "tags_info",
		// 	width      : 190,
		// 	key        : "tags_info",
		// 	scopedSlots: {customRender: "tags_info"}
		// },
		{
			dataIndex: "apply_num",
			// width    : "12%",
			key      : "apply_num",
			slots    : {title: "apply_num"},
		},
		{
			dataIndex: "new_customer",
			// width    : "15%",
			key      : "new_customer",
			slots    : {title: "new_customer"},
		},
		{
			dataIndex: "chat_num",
			// width    : "15%",
			key      : "chat_num",
			slots    : {title: "chat_num"},
		},
		{
			dataIndex: "message_num",
			// width    : "15%",
			key      : "message_num",
			slots    : {title: "message_num"},
		},
		{
			dataIndex: "replyed_per",
			// width    : "15%",
			key      : "replyed_per",
			slots    : {title: "replyed_per"},
		},
		{
			dataIndex: "first_reply_time",
			// width    : "15%",
			key      : "first_reply_time",
			slots    : {title: "first_reply_time"},
		},
		{
			dataIndex: "delete_customer_num",
			// width    : "15%",
			key      : "delete_customer_num",
			slots    : {title: "delete_customer_num"},
		},
		// {
		// 	title      : "操作",
		// 	dataIndex  : "action",
		// 	// width      : "8%",
		// 	key        : "action",
		// 	scopedSlots: {customRender: "action"}
		// }
	];
	export default {
		components: {chooseDepartment},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				tagValue           : [],
				chooseNum          : 0,//已选择的部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				showModalDepartment: false, //成员选择框显示与隐藏
				checkedList        : [],//选择的成员id数组
				user               : [],//选择的成员数据
				selectedRowKeys    : [], // 选择多少条
				disabled           : [],//禁选标签
				selectArr          : [],//选择的表格行的标签数
				selectValueArr     : [],//选择的表格行的标签数的值的集合
				selectValue        : [],//选择的表格行的标签数的值的集合，去重后
				commonTags         : [],//打标签时共有的标签id
				tag_count          : '',//全部客户的标签数
				tag_num            : '',//打标签还可选择的标签数
				fansTag            : [],//点击移除标签，所选中的客户的所有标签id数组
				confirmLoading     : false,//移除标签对话框的确认按钮加载
				confirmLoading2    : false,//打标签对话框的确认按钮加载
				// 标签
				checked            : [],
				//打标签
				visible            : false,
				//移除标签
				visible1           : false,
				tagCheckValue1     : [],//选中的tag
				tagsList           : [], //标签列表
				tagCheckValue      : [],//选中的tag
				addTagVisible      : false,//新建标签弹窗显示与隐藏
				confirmLoading3    : false, //新建标签弹框加载
				inputValue         : '',//新建标签输入框值
				editGroupId        : '',//新建标签弹窗里的选中的分组id
				keysArr            : [],//所有客户的键值
				groupList          : [], // 小组列表
				groupId            : '-1', // 选中的小组id
				tagLoading         : false,//增加标签弹窗加载的显示与隐藏

				corpInfo        : [], //企业微信列表
				corpId          : corpId,//企业微信选中的id
				type            : -1,
				suite_id        : 1,//应用ID
				party_id        : [],//部门id
				department_id   : [],//部门id
				departmentList  : [],//部门列表
				isLoading       : false, //Loading 组件显示与隐藏
				btnSortFlag1    : true,//选择排列顺序的按钮
				btnSortFlag2    : true,//选择排列顺序的按钮
				btnSortFlag3    : true,//选择排列顺序的按钮
				btnSortFlag4    : true,//选择排列顺序的按钮
				sort            : '',//排序
				staffList       : [],//成员列表
				staffList1      : [], // 成员筛选的列表
				is_external     : 1,
				status          : 1,
				//滚动条
				showTransition  : 1,
				mouseEnterFlag  : false,
				startY          : 0,
				scrollFlag      : false,
				scroRight       : true,
				scrollOutFlag   : false,
				//表格部分
				columns,
				//分页
				total           : 0, //总条数
				quickJumper     : false, // 是否显示快速跳转的控件
				page            : 1, //页码
				page_size       : 15, //每页数据量，默认15
				top             : '',//表格上半部的数据
				// 左侧部门树状图
				expandedKeys    : [],
				autoExpandParent: true,
				checkedKeys     : [],
				tagCheckIndex   : 0,
				initChecked     : [],
				newChecked      : [],
				diffChecked     : [],
				seniorVisible   : false,
			};
		},

		watch   : {
			checkedKeys (val) {
				this.department_id = val
			},
		},
		methods : {
			seniorSelect () {
				this.seniorVisible = true
			},
			onClose () {
				this.seniorVisible = false
				// this.searchStaff()
			},
			//获取标签
			async getTags () {
				this.tagLoading = true
				let id = this.groupId == -1 ? [] : this.groupId
				const {data: res} = await this.axios.post("work-tag/list", {
					corp_id : this.corpId,
					suite_id: 1,
					group_id: id,
					type    : 1,
					is_all  : 1,//0 不展示所有（带分页的）  1 展示所有（不带分页的
				});
				if (res.error != 0) {
					this.tagLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					this.tagLoading = false
					for (var i = 0; i < this.tagsList.length; i++) {
						var checked = false;
						this.checked.push(checked);
					}
					if (3000 - Math.max(...this.selectArr) <= 0) {
						this.disabled = []
						for (let i = 0; i < this.tagsList.length; i++) {
							let disabled = true;
							this.disabled.push(disabled);
						}
					}
				}
			},
			async getTags2 () {
				this.tagLoading = true
				let id = this.groupId == -1 ? [] : this.groupId
				const {data: res} = await this.axios.post("work-tag/list", {
					corp_id : this.corpId,
					suite_id: 1,
					group_id: id,
					type    : 1,
					is_all  : 1,//0 不展示所有（带分页的）  1 展示所有（不带分页的
				});
				if (res.error != 0) {
					this.tagLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					this.tagLoading = false
					if (3000 - Math.max(...this.selectArr) <= 0) {
						this.disabled = []
						for (let i = 0; i < this.tagsList.length; i++) {
							let disabled = true;
							this.disabled.push(disabled);
						}
					} else {
						// 当切换分组时，判断已选的新标签中有多少不在新的分组中，并记录未this.diffChecked
						let newTagIds = []
						this.tagsList.map((tag) => {
							newTagIds.push(tag.id)
						})
						this.diffChecked = this.newChecked.filter(item => newTagIds.indexOf(item) == -1)
						if (this.tagCheckValue.length != this.commonTags.length) {
							if (this.tag_num == 0) {
								if (this.tagValue.length > 0) {
									for (let i = 0; i < this.tagValue.length; i++) {
										let disabled = true;
										this.disabled.unshift(disabled);
									}
								}
							} else {
								// if(this.tagValue.length > 0) {
								// 	for (let i = 0; i < this.tagValue.length; i++) {
								// 		let disabled = false;
								// 		this.disabled.unshift(disabled);
								// 	}
								// }else {
								for (let i = 0; i < this.tagsList.length; i++) {
									this.disabled[i] = false
									for (let j = 0; j < this.commonTags.length; j++) {
										if (this.commonTags[j].id == this.tagsList[i].key) {
											this.disabled[i] = true
										}
									}
								}
								// }
							}
						} else {
							for (let i = 0; i < this.tagsList.length; i++) {
								this.disabled[i] = false
								for (let j = 0; j < this.tagCheckValue.length; j++) {
									if (this.tagCheckValue[j] == this.tagsList[i].key) {
										this.disabled[i] = true
									}
								}
							}
						}
					}
					this.inputValue = "";
					this.tagValue = [];
					this.tagCheckIndex++
				}
			},
			// 打标签
			showModal () {
				this.groupId = '-1'
				// console.log(this.selectedRowKeys,'this.selectedRowKeys')
				// console.log(this.selectArr,'this.selectArr')
				// console.log(Math.max(...this.selectArr))
				let keys = this.selectedRowKeys;
				if (keys.length == 0) {
					this.$message.warning("请先选择企业成员");
					return false;
				}
				if (3000 - Math.max(...this.selectArr) <= 0) {
					this.disabled = []
					for (let i = 0; i < this.tagsList.length; i++) {
						let disabled = true;
						this.disabled.push(disabled);
					}
				}

				// console.log(this.disabled,'disabled555')
				function unique (arr) {
					return Array.from(new Set(arr))
				}

				this.selectValue = unique(this.selectValueArr)
				// console.log(this.selectValue, 'this.selectValue')
				this.tagCheckValue = [];
				this.visible = true;
				this.getTags2()
				this.getGroupList()
				this.addCommonTags(0);
			},
			handleOk () {
				if (this.tagCheckValue.length == this.commonTags.length) {
					this.$message.warning("请选择要打的标签");
				} else {
					this.tagCheckValue.splice(0, this.commonTags.length)
					this.confirmLoading2 = true;
					this.addTagsMore(0);
				}
			},
			cancelVisible () {
				this.visible = false
				this.disabled = []
				this.tag_num = 3000 - Math.max(...this.selectArr)
				this.inputValue = ''
				this.tagValue = []
			},
			// 移除标签
			showModal1 () {
				let keys = this.selectedRowKeys;
				if (keys.length == 0) {
					this.$message.warning("请先选择企业成员");
					return false;
				}
				this.tagCheckValue1 = [];
				this.addCommonTags(1)
				this.visible1 = true;
			},
			handleOk1 () {
				if (this.tagCheckValue1.length == 0) {
					this.$message.warning("请选择要移除的标签");
				} else {
					this.addTagsMore(1);
					this.confirmLoading = true
				}
			},
			onChange2 (checkedValues) {
				// 将不再当前分组的已选标签和当前组针对初始已选的标签差集做合并处理，即为当前的已选新标签并记录到this.newChecked中
				this.newChecked = checkedValues.filter(item => this.initChecked.indexOf(item) == -1).concat(this.diffChecked)


				// 当前选择的标签即为，初始标签和已选新标签的并集
				let tagArr = this.initChecked.concat(this.newChecked)
				this.tagCheckValue = Array.from(new Set(tagArr))

				var a = this.tagCheckValue.length - this.commonTags.length
				this.tag_num = 3000 - Math.max(...this.selectArr) - a
				// console.log(this.tagCheckValue, 'this.tagCheckValue11')

				let arr2 = JSON.parse(JSON.stringify(this.tagCheckValue))
				for (let x = 0; x < this.commonTags.length; x++) {
					for (let k = 0; k < arr2.length; k++) {
						if (arr2[k] == this.commonTags[x].id) {
							arr2.splice(k, 1);
						}
					}
				}
				arr2 = Array.from(new Set(arr2))
				// console.log(arr2, 'arr2')
				if (this.tag_num <= 0) {
					for (let i = 0; i < this.disabled.length; i++) {
						this.disabled[i] = true
					}
					for (let j = 0; j < this.tagsList.length; j++) {
						for (let y = 0; y < arr2.length; y++) {
							if (this.tagsList[j].id == arr2[y]) {
								this.disabled[j] = false
							}
						}
					}
				} else {
					this.disabled = []
					for (let i = 0; i < this.tagsList.length; i++) {
						let disabled = false;
						this.disabled.push(disabled);
					}
					for (let j = 0; j < this.tagsList.length; j++) {
						for (let x = 0; x < this.commonTags.length; x++) {
							if (this.tagsList[j].id == this.commonTags[x].id) {
								this.disabled[j] = true
							}
						}
					}
				}
			},
			onChange3 (checkedValues) {
				this.tagCheckValue1 = checkedValues;
				// console.log(this.tagCheckValue);
			},
			//获取共同标签
			async addCommonTags (give) {
				const {data: res} = await this.axios.post("work-user/get-user-tags", {
					user_ids: this.selectedRowKeys,
					type    : 1,
					give    : give,//0打标签，1移除标签
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.initChecked = []
					res.data.map(x => {
						this.tagCheckValue.push(parseInt(x.id))
						this.initChecked.push(parseInt(x.id))
					})
					this.commonTags = res.data
					this.fansTag = res.data
					for (let i = 0; i < this.tagsList.length; i++) {
						for (let j = 0; j < this.tagCheckValue.length; j++) {
							if (this.tagCheckValue[j].id == this.tagsList[i].key) {
								this.disabled[i] = true
							}
						}
					}
				}
			},
			//批量添加/移除标签
			async addTagsMore (type) {
				let tag_ids = []
				if (type == 0) {
					tag_ids = this.tagCheckValue
				} else {
					tag_ids = this.tagCheckValue1
				}
				const {data: res} = await this.axios.post("work-user/give-user-tags", {
					tag_ids : tag_ids,
					user_ids: this.selectedRowKeys,
					type    : type,
					s_type  : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading2 = false;
					this.confirmLoading = false
				} else {
					this.$message.success(res.error_msg);
					this.selectedRowKeys = [];
					this.visible = false
					this.confirmLoading2 = false;
					this.disabled = []
					this.visible1 = false;
					this.confirmLoading = false
					this.selectValueArr = []
					this.selectArr = []
					this.commonTags = []
					this.selectValue = []
					this.getStaff(this.page, this.page_size);
				}
			},
			//新建标签
			showAddTagModal () {
				this.addTagVisible = true
				this.editGroupId = this.groupList[0].id
			},
			//获取分组
			async getGroupList () {
				const {data: res} = await this.axios.post("work-tag-group/list", {
					corp_id : this.corpId,
					type    : 1,
					suite_id: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.info
				}
			},
			//新建标签
			showAddTagModal () {
				this.addTagVisible = true
				this.editGroupId = this.groupList[0].id
			},
			onSearch () {
				if (this.editGroupId == '') {
					this.$message.warning("请先选择分组");
					return false;
				}
				if (this.inputValue == "") {
					this.$message.warning("不能为空");
					return false;
				} else {
					this.tagValue = []
					for (var i = 0; i < this.inputValue.split(" ").length; i++) {
						if (this.inputValue.split(" ")[i].length > 15) {
							this.$message.error("每个标签最多15个字");
							return false
						} else if (this.inputValue.split(" ")[i].length > 0) {
							this.tagValue.push(this.inputValue.split(" ")[i]);
						}
					}
					this.addTags();
				}
			},
			addTagCancel () {
				this.inputValue = ''
				this.editGroupId = ""
				this.addTagVisible = true
			},
			//创建标签
			async addTags () {
				const {data: res} = await this.axios.post("work-tag/add", {
					name    : this.tagValue,
					corp_id : this.corpId,
					suite_id: 1,
					type    : 1,
					group_id: this.editGroupId
				});
				if (res.error != 0) {
					if (res.error_msg == '标签名非法，请注意不能和其他标签重名') {
						this.$message.error('该标签名称与微信标签重复，请手动同步微信标签即可。');
					} else {
						this.$message.error(res.error_msg);
					}
				} else {
					this.$message.success('新建标签成功');
					this.inputValue = ''
					this.addTagVisible = false
					this.editGroupId = ""
					this.getTags2();
				}
			},
			//改变分组
			changeGroup (e) {
				this.groupId = '-1'
				if (typeof e != 'undefined') {
					this.groupId = e
				}
				this.getTags2()
			},
			onSelectChange (selectedRowKeys, value) {
				this.selectArr = []
				for (let i = 0; i < value.length; i++) {
					this.selectArr.push(value[i].tag_name.length)
				}
				this.tag_num = 3000 - Math.max(...this.selectArr)
				this.selectedRowKeys = selectedRowKeys;
			},
			onSelectRow (record, selected, selectedRows, nativeEvent) {
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val);
					if (index > -1) {
						this.splice(index, 1);
					}
				};
				if (selected) {
					this.selectArr.push(record.tag_name.length)
					for (let i = 0; i < record.tag_name.length; i++) {
						this.selectValueArr.push(record.tag_name[i].tag_id)
					}
					this.tag_num = 3000 - Math.max(...this.selectArr)
				} else {
					this.selectArr.remove(record.tag_name.length)
					for (let i = 0; i < record.tag_name.length; i++) {
						this.selectValueArr.remove(record.tag_name[i].tag_id)
					}
					this.tag_num = 3000 - Math.max(...this.selectArr)
				}

			},

			//左侧部门树状图
			onExpand (expandedKeys) {
				// if not set autoExpandParent to false, if children expanded, parent can not collapse.
				// or, you can remove all expanded children keys.
				this.expandedKeys = expandedKeys;
				this.autoExpandParent = false;
			},

			initHelp () {
				let that = this
				setInterval(function () {
					that.showTransition = (that.showTransition + 1) % 5;
				}, 1000)
			},
			//表格设置隔行换色
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 公众号
			handleChange (value) {
				this.corpId = value
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.checkedList = []
				this.user = []
			},
			//搜索成员
			//部门选择弹窗组件
			showDepartmentList () {
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
			},
			modalVisibleChange (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.checkedList = arr
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.user = JSON.parse(JSON.stringify(list))
					} else {
						this.user = []
					}
				}
				this.showModalDepartment = false
			},
			//选择排序显示的方法
			changeSort (e) {
				this.btnSortFlag1 = true
				this.btnSortFlag2 = true
				this.btnSortFlag3 = true
				this.btnSortFlag4 = true
			},
			//点击按钮排序
			btnSort1 () {
				this.btnSortFlag1 = !this.btnSortFlag1
			},
			btnSort2 () {
				this.btnSortFlag2 = !this.btnSortFlag2
			},
			btnSort3 () {
				this.btnSortFlag3 = !this.btnSortFlag3
			},
			btnSort4 () {
				this.btnSortFlag4 = !this.btnSortFlag4
			},
			//点击确定搜索
			searchStaff () {
				this.isLoading = true;
				this.getStaff();
				this.seniorVisible = false
			},
			//点击重置条件
			reset () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.isLoading = true
				this.status = 1
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.checkedList = []
				this.user = []
				this.department_id = []
				this.checkedKeys = []
				this.type = -1
				this.is_external = 1
				this.btnSortFlag1 = true
				this.btnSortFlag2 = true
				this.btnSortFlag3 = true
				this.btnSortFlag4 = true
				this.getStaff()
				this.seniorVisible = false
			},
			//同步企业微信通讯录气泡提示
			confirm () {
				this.$message.info("已进入后台刷新中，请耐心等待...", 2, this.refreshStaff)
			},
			async refreshStaff () {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-party/refresh-party-list", {
					suite_id: this.suite_id,
					corp_id : this.corpId,
					party_id: this.party_id
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg)
				} else {
					this.$message.destroy()
					this.getStaff();
				}
			},
			//功能设置开启
			startStaff () {
				console.log(1111)
			},
			//设置
			settingStaff () {
				console.log(2222)
			},
			//编辑
			edit () {
				console.log('edit')
			},
			//禁用
			forbidden () {
				console.log('forbidden')
			},
			//详情
			detail () {
				console.log('detail')
			},
			//获取部门列表
			async getDepartmentList () {
				this.departmentList = []
				this.expandedKeys = []
				this.isLoading = true
				const {data: res} = await this.axios.post("work-party/get-all-department", {
					suite_id: this.suite_id,
					corp_id : this.corpId
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.departmentList = res.data;
					if (this.departmentList.length > 0 && this.departmentList[0].children && this.departmentList[0].children[0] && this.departmentList[0].children[0].key) {
						this.expandedKeys.push(this.departmentList[0].children[0].key)
					}
					this.isLoading = false;
				}
			},
			//获取表格数据
			async getStaff (page = 1, page_size = this.page_size) {
				this.isLoading = true
				let sort = ""
				if (this.type == 1) {
					sort = !this.btnSortFlag1
				} else if (this.type == 2) {
					sort = !this.btnSortFlag2
				} else if (this.type == 3) {
					sort = !this.btnSortFlag3
				} else if (this.type == 4) {
					sort = !this.btnSortFlag4
				}
				const {data: res} = await this.axios.post("work-user/get-user-list", {
					page         : page,
					page_size    : page_size,
					suite_id     : this.suite_id,
					corp_id      : this.corpId,
					party_id     : this.party_id,
					is_all       : 1,
					sort         : sort,
					type         : this.type,
					id           : this.checkedList,
					status       : this.status,
					is_external  : this.is_external,
					// department_id: this.department_id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.staffList = res.data.users;
					this.staffList1 = res.data.user_name
					this.keysArr = res.data.keys
					this.tag_count = res.data.tag_count
					//确认到底选中多少粉丝，给selectedRowKeys赋值
					let arr = this.selectedRowKeys
					this.selectedRowKeys = []
					arr.map((x) => {
						res.data.keys.map((k) => {
							if (k == x) {
								return this.selectedRowKeys.push(x)
							}
						})
					})
					this.top = res.data.top
					this.total = parseInt(res.data.count);
					this.page = page;
					this.page_size = page_size;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 分页
			changePage (page, page_size) {
				this.getStaff(page, page_size);
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange (page, page_size) {
				this.getStaff(1, page_size);
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
			}
		},
		computed: {
			rowSelection () {
				let that = this
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
								that.selectedRowKeys = changableRowKeys;
								that.selectArr = []
								for (let i = 0; i < that.staffList.length; i++) {
									this.selectArr.push(that.staffList[i].tag_name.length)
								}
								that.tag_num = 3000 - Math.max(...that.selectArr)
							}
						},
						{
							key     : "all-data",
							text    : "选择所有项",
							onSelect: () => {
								that.selectedRowKeys = [...that.keysArr.valueOf()];
								that.selectArr = that.tag_count
								that.tag_num = 3000 - Math.max(...that.selectArr)
							}
						}
					],
					onSelection          : this.onSelection
				};
			}
		},
		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				// this.corpId = this.corpInfo[0].corpid
				//TODO 获取teams
				// this.$emit('changeTeamId', this.teamId)
				// this.$emit('changeCorpId', this.corpId)
				//滚动条
				// let observer = new MutationObserver(this.setScroLineHeight)
				// observer.observe(this.$refs.scroLine, {
				// 	attributes       : true,
				// 	attributeFilter  : ['style'],
				// 	attributeOldValue: true
				// })
				// this.setScroLineHeight()
				// this.initFirefoxScroll()
				this.getStaff()
				// this.getDepartmentList()
			});
		}
	}
	;
</script>

<style lang='less' scoped>
	#components-layout-demo-basic {
		text-align: center;
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
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
		margin-left: 20px;
		padding-right: 20px;
	}

	.content-hd {
		width: 100%;
		min-width: 885px;
	}

	.content-hd-card {
		border: 1px solid #D9D9D9;
		height: 125px;
		background: #FFF;
		flex: 1;
		margin-right: 15px;
		padding: 15px;
	}

	.content-hd-card:last-child {
		margin-right: 0;
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

	.list {
		overflow-y: hidden;
	}

	.sider-title {
		height: 50px;
		width: 250px;
		border-bottom: 1px solid #E2E2E2;
		line-height: 50px;
	}

	.fans-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.content-msg {
		width: 100%;
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 10px;
		margin-top: 12px;
		text-align: left;
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


	.sider-one {
		height: 300px;
		border-bottom: 1px solid #E2E2E2;
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.sider-two {
		padding: 0 20px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}

	.header-txt {
		color: red;
		font-size: 14px;
		margin-left: 10px;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 5px;
	}

	.sider-footer {
		position: fixed;
		height: 50px;
		width: 360px;
		bottom: 0;
		background-color: #FFF;
		border-top: 1px solid #E2E2E2;
		padding-top: 10px;
		z-index: 999;
	}

	/deep/ .ant-radio-button-wrapper {
		margin: 0 4px;
		width: 29%;
	}

	.content-hd-left {
		float: left;
	}

	.content-hd-right {
		text-align: right;
		padding: 20px 0;
	}

	.btn-primary {
		width: 108px;
		height: 30px;
		margin-left: 20px;
		text-align: left;
		padding: 0;

		span {
			display: inline-block;
			width: 90px;
			height: 30px;
			line-height: 30px;
			text-align: center;
		}
	}

	.btn-primary1 {
		height: 30px;
		margin-left: 20px;
		padding: 0px 15px;
	}

	.btn-primary1[disabled] {
		background-color: #F5F5F5;
		border-color: #D9D9D9;
	}

	p {
		margin: 0;
	}

	/deep/ .ant-table-thead > tr > th .ant-table-column-sorter {
		left: 110px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}

	.btnSortColor {
		color: #000000A6;
	}

	.start {
		color: red;
		margin-right: 5px;
		cursor: pointer;
	}

	.setting {
		color: blue;
		cursor: pointer;
	}

	/deep/ .ant-tree {
		text-align: left;
	}
</style>