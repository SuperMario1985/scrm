<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<!-- <a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">客户公海</label>
			</a-card> -->
			<div style="padding: 20px 20px 0;">
				<span @click="changeTab(1)" class="tabBtn" :class="{activeBtn:tabKey == 1}">企微客户</span>
				<span @click="changeTab(2)" class="tabBtn" :class="{activeBtn:tabKey == 2}">非企微客户</span>
			</div>
			<div style="background-color: #FFF;margin: 0 20px;padding-top: 10px;" v-if="tabKey == 1">
				<div style="font-size:16px;font-weight:700;color:#333333;margin:16px">客户公海</div>
				<div class="content-msg" style="margin: 0 20px; box-shadow: 0px 1px 4px 0px #D7D7D7">
					<!-- <p style="margin-bottom: 2px;">
						为了避免销售人员长时间沟通无果或是恶意保护占有客户资源，在达到客户回收条件后，则在【客户公海】--【企微客户】--【可认领】列表里生成一条该企微客户数据。
					</p> -->
					<p style="margin-bottom: 2px;">
						当被其他员工认领时，该企微客户进入到【已认领】列表。
					</p>
					<p style="margin-bottom: 2px;">
						1、员工在职期间，如果该企微客户只分配员工1次且归属关系超过90个自然日，<span style="color: red;">认领后，客户和接替的员工将在24小时后自动成为联系人；如果客户主动拒绝，接替员工还可选择主动添加。</span>
						<a-tooltip placement="right">
							<template slot="title">
								<img src="../../../assets/highSeasCustomer/1.png" alt="" style="width: 100%;">
								<img src="../../../assets/highSeasCustomer/2.png" alt="" style="width: 100%;">
							</template>
							<a-icon type="question-circle" style="cursor: pointer;"/>
						</a-tooltip>
					</p>
					<p style="margin-bottom: 2px;">
						2、员工在职期间，如果该企微客户已被员工分配过2次或2次以上或是在90个自然日的服务关系保护期内，认领即向该客户的原归属员工，发送“共享通知”。
						<a-tooltip placement="right">
							<template slot="title">
								<img src="../../../assets/highSeasCustomer/3.png" alt="" style="width: 100%;">
							</template>
							<a-icon type="question-circle" style="cursor: pointer;"/>
						</a-tooltip>
						。
					</p>
					<div style="margin-left: 22px;">在期间会存在以下可能：
					</div>
					<p style="margin-bottom: 2px;margin-left: 22px;">
						a、当同一客户，被不同员工归属时，若均符合共享条件时，会在【客户公海】--【企微客户】列表生成多条企微客户数据，但针对同一客户同一员工，永远只会显示一条数据。
					</p>
					<p style="margin-bottom: 2px;margin-left: 22px;">
						b、当原归属员工离职时，官方提供离职继承功能，客户关系由新员工接替，视为认领无效。
					</p>
					<p style="margin-bottom: 2px;margin-left: 22px;">
						c、您已认领过且已加上某企微客户，无需再次认领。
					</p>
				</div>
			</div>
			<div v-show="tabKey == 1" style="padding: 15px 0;margin: 0px 20px;background: #FFF;">
				<div style="padding: 0 20px;">
					<span @click="changeTab2(1)" class="tabBtn" :class="{activeBtn:tabKey2 == 1}">可认领</span>
					<span @click="changeTab2(2)" class="tabBtn" :class="{activeBtn:tabKey2 == 2}">已认领</span>
				</div>
				<template v-if="tabKey2 == 1">
					<a-col style="background: #FFF;padding: 10px 0;margin: 0 20px;margin-top: 1px;overflow:hidden;">
						<span class="select-option">
									<label style="margin-right: 5px;">客户昵称：</label>
						<a-input placeholder="请输入客户昵称" @keyup.enter="find" style="width: 170px;"
						         v-model="customName"
						         autoComplete="off"/>
						</span>
						<span class="select-option">
						<label style="margin-right: 5px;">客户来源：</label>
						<a-tree-select
								:allowClear="true"
								:dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
								style="width: 170px; margin-right: 5px;"
								:treeData="wayList"
								placeholder='全部来源'
								treeDefaultExpandAll
								v-model="add_way"
								@change="handleChangeAddWay"
						>
								</a-tree-select>
								<label v-if="add_way == 'way' || add_way == 'chatWay' || add_way == 'award' || add_way == 'fission' || add_way == 'redPack'"
								       style="margin: 0 10px 0 5px;color: rgba(0,0,0,0.35);">——</label>
								<a-select
										v-if="add_way == 'way' || add_way == 'chatWay' || add_way == 'award' || add_way == 'fission' || add_way == 'redPack'"
										allowClear
										show-search
										v-model="way_id"
										placeholder="活码搜索"
										style="width: 262px; margin-right: 5px;"
										:show-arrow="true"
										optionFilterProp="children"
								>
									<a-select-option v-for="d in codeList" :value="d.value" :key="d.key">
										{{d.title}}
									</a-select-option>
								</a-select>
						</span>
						<span class="select-option">
									<label style="margin-right: 5px;">进入回收时间：</label>
						<a-range-picker
								:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
								format="YYYY-MM-DD HH:mm"
								allowClear
								style="width:288px;"
								:disabled-date="disabledDate"
								v-model="claimTime"
								@change="changeTime"
						/>
						</span>
						<a-button type="primary" @click="find">查询</a-button>
						<a-button style="margin-left: 10px;" @click="clear">重置</a-button>
					</a-col>
					<!-- 表格部分 -->
					<div class="content-bd">
						<a-spin tip="加载中..." size="large" :spinning="isLoading">
							<div class="spin-content">
								<a-table
										:rowSelection="rowSelection"
										:columns="columns"
										:dataSource="batchList"
										:pagination="false"
										:rowClassName="rowClassName" v-has="'highSeasCustomerList-list'"
								>
									<template slot="customerInfo" slot-scope="text, record, index">
										<div style="overflow: hidden;">
											<a-avatar v-if="text.avatar" shape="square" :size="42" :src="text.avatar"
											          style="float: left;"/>
											<img style="width: 42px;height: 42px;float: left;" v-if="!text.avatar"
											     src="../../../assets/useradvart.png"/>
											<div style="float: left;margin-left:10px;line-height: 42px;">
												<div style="height:42px;">
													<a-popover placement="top">
														<template slot="content">
															{{text.name}}
															<span :class="text.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="text.corp_name != null">@{{text.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
														</template>
														<span style="display: inline-block; max-width: 180px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
														{{text.name}}
														<span :class="text.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="text.corp_name != null">@{{text.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
													</span>
													</a-popover>
													<a-icon type="man"
													        style="color: #427EBA;vertical-align: top;margin-top: 14px;"
													        v-if="text.gender=='男'"/>
													<a-icon
															type="woman"
															style="color: #ED4997;vertical-align: top;margin-top: 14px;"
															v-if="text.gender=='女'"
													/>
												</div>
											</div>
										</div>
									</template>
									<template slot="add_other_info" slot-scope="text, record, index">
										<div style="margin-bottom: 5px;" v-if="record.add_other_info != ''">
											{{record.add_other_info}}
										</div>
										<div style="margin-bottom: 5px;" v-if="record.add_way_info != ''">-
											{{record.add_way_info}}
										</div>
										<a-popover placement="top">
											<template slot="content">
												<p style="margin-bottom: 0px;">{{record.add_way_title}}</p>
											</template>
											<div style="cursor: pointer;max-width:100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
											     v-if="record.add_way_title != ''">
												- {{record.add_way_title}}
											</div>
										</a-popover>
									</template>
									<template slot="claimTip" slot-scope="text, record, index">
										<div v-if="record.claimTip != ''" style="color: red;">
											{{record.claimTip}}
										</div>
										<div v-if="record.claimTip == ''">
											--
										</div>
									</template>
									<template slot="reclaim_rule" slot-scope="text, record, index">
										<div v-if="record.reclaim_rule != ''">
											{{record.reclaim_rule}}
										</div>
										<div v-if="record.reclaim_rule == ''">
											--
										</div>
									</template>
									<template slot="action" slot-scope="text, record, index">
										<a-button @click="claim(1,1,record)"
										          style="margin: 0 5px 5px 0"
										          :disabled="user_id == 0 || record.claimTip != ''"
										          v-has="'highSeasCustomerList-claim'">
											认领
										</a-button>
										<a-button @click="showDepartmentList(record,1)" style="margin: 0 5px 5px 0"
										          v-has="'highSeasCustomerList-assign'">
											指定分配
										</a-button>
										<a-button @click="handleShowDetail(record.follow_user_id)"
										          style="margin: 0 5px 5px 0"
										          v-if="isMasterAccount == 1">详情
										</a-button>
									</template>
								</a-table>
								<div style="margin: 20px 0px;line-height: 32px;float: left;" v-show="total > 0">
									<a-checkbox v-model="batchTypeValue"
									            @click="batchTypeChange"></a-checkbox>
									当前页
									<a-button @click="showDepartmentList2(1)" type="primary"
									          :disabled="this.selectedRowKeys.length > 0 ? false : true"
									          style="margin-left: 10px;" v-has="'highSeasCustomerList-assign'">批量指定分配
									</a-button>
									<a-button @click="claim(1,1)" type="primary"
									          :disabled="this.selectedRowKeys.length > 0 ? false : true"
									          style="margin-left: 10px;" v-has="'highSeasCustomerList-claim'">批量认领
									</a-button>
								</div>
								<!--分页-->
								<div class="pagination" style="margin: 20px 0px;float: right;"
								     v-show="total > 0" v-has="'highSeasCustomerList-list'">
									<div style="height: 32px;line-height: 32px;display: inline-block;vertical-align: top;margin-right: 10px;">
										共
										<span style="color: blue">{{total}}</span>
										条
									</div>
									<div class="pagination" style="height: 32px;display: inline-block;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
										              :current="page"
										              :pageSize="pageSize"
										              :pageSizeOptions="['15','30','50','100']"
										              @change="changePage"
										              @showSizeChange="showSizeChange"/>
									</div>
								</div>
							</div>
						</a-spin>
					</div>
				</template>
				<template v-if="tabKey2 == 2">
					<a-col style="background: #FFF;padding: 10px 0;margin: 0 20px;margin-top: 1px;overflow:hidden;">
						<span class="select-option">
									<label style="margin-right: 5px;">客户昵称：</label>
						<a-input placeholder="请输入客户昵称" @keyup.enter="find3" style="width: 170px;"
						         v-model="customName3"
						         autoComplete="off"/>
						</span>
						<span class="select-option">
									<label style="margin-right: 5px;">认领时间：</label>
						<a-range-picker
								:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
								format="YYYY-MM-DD HH:mm"
								allowClear
								style="width:288px;"
								:disabled-date="disabledDate"
								v-model="claimTime3"
								@change="changeTime3"
						/>
						</span>
						<a-button type="primary" @click="find3">查询</a-button>
						<a-button style="margin-left: 10px;" @click="clear3">重置</a-button>
					</a-col>
					<!-- 表格部分 -->
					<div class="content-bd">
						<a-spin tip="加载中..." size="large" :spinning="isLoading3">
							<div class="spin-content">
								<a-table
										:columns="columns3"
										:dataSource="claimUserList"
										:pagination="false"
										:rowClassName="rowClassName" v-has="'highSeasCustomerList-list'"
								>
									<template slot="customerInfo" slot-scope="text, record, index">
										<div style="overflow: hidden;">
											<a-avatar v-if="record.avatar" shape="square" :size="42"
											          :src="record.avatar"
											          style="float: left;"/>
											<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
											     src="../../../assets/useradvart.png"/>
											<div style="float: left;margin-left:10px;line-height: 42px;">
												<div style="height:42px;">
													<a-popover placement="top">
														<template slot="content">
															{{record.name}}
															<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="record.corp_name != null">@{{record.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
														</template>
														<span style="display: inline-block; max-width: 180px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
														{{record.name}}
														<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="record.corp_name != null">@{{record.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
													</span>
													</a-popover>
													<a-icon type="man"
													        style="color: #427EBA;vertical-align: top;margin-top: 14px;"
													        v-if="record.gender=='男'"/>
													<a-icon
															type="woman"
															style="color: #ED4997;vertical-align: top;margin-top: 14px;"
															v-if="record.gender=='女'"
													/>
												</div>
											</div>
										</div>
									</template>
									<template slot="reclaim_rule" slot-scope="text, record, index">
										<div style="margin-bottom: 5px;" v-if="record.reclaim_rule != ''">
											{{record.reclaim_rule}}
										</div>
										<div style="margin-bottom: 5px;" v-if="record.reclaim_rule == ''">
											--
										</div>
									</template>
									<template slot="old_user_name" slot-scope="text, record, index">
										<a-tag color="orange">
											{{text}}
										</a-tag>
									</template>
									<template slot="user_name" slot-scope="text, record, index">
										<a-tag color="orange">
											{{text}}
										</a-tag>
									</template>
									<template slot="status" slot-scope="text, record, index">
										{{text}}
										<template v-if="text == '已添加'">
											<div style="margin-bottom: 5px;" v-if="record.add_other_info != ''">
												{{record.add_other_info}}
											</div>
											<div style="margin-bottom: 5px;" v-if="record.add_way_info != ''">-
												{{record.add_way_info}}
											</div>
											<a-popover placement="top">
												<template slot="content">
													<p style="margin-bottom: 0px;">{{record.add_way_title}}</p>
												</template>
												<div style="cursor: pointer;max-width:100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
												     v-if="record.add_way_title != ''">
													- {{record.add_way_title}}
												</div>
											</a-popover>
										</template>
									</template>
									<template slot="action" slot-scope="text, record, index">
										<a-button @click="notice(record)"
										          style="margin: 0 5px 5px 0"
										          :disabled="record.status == '已添加'" v-if="record.claimTip == ''" v-has="'highSeasCustomerList-notice'">
											提醒原成员共享
										</a-button>
										<a-popover placement="top">
											<template slot="content">
												<p style="margin-bottom: 0px;">{{record.claimTip}}</p>
											</template>
											<a-button @click="notice(record)"
											          style="margin: 0 5px 5px 0"
											          :disabled="(record.status == '未添加' || record.status == '已拒绝') && record.claimTip != ''"
											          v-if="record.claimTip != ''" v-has="'highSeasCustomerList-notice'">
												提醒原成员共享
											</a-button>
										</a-popover>
										<a-button @click="handleShowDetail(record.follow_user_id)"
										          v-if="isMasterAccount == 1 && record.claimTip == ''">详情
										</a-button>
									</template>
								</a-table>
								<!--分页-->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total3 > 0" v-has="'highSeasCustomerList-list'">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total3}}</span>
										条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total3" showSizeChanger :showQuickJumper="quickJumper3"
										              :current="page3"
										              :pageSize="pageSize3"
										              :pageSizeOptions="['15','30','50','100']"
										              @change="changePage3"
										              @showSizeChange="showSizeChange3"/>
									</div>
								</div>
							</div>
						</a-spin>
					</div>
				</template>
			</div>
			<div v-show="tabKey == 2" style="padding: 15px 0;margin: 0px 20px;background: #FFF;">
				<a-col style="background: #FFF;padding: 10px 0;margin: 0 20px;margin-top: 1px;overflow:hidden;">
					<div style="overflow:hidden;">
						<div style="float: left;">
						<span class="select-option">
									<label style="margin-right: 5px;">客户姓名：</label>
						<a-input placeholder="客户姓名" @keyup.enter="find2" style="width: 170px;"
						         v-model="phone"
						         autoComplete="off"/>
						</span>
							<span class="select-option">
									<label style="margin-right: 5px;">客户来源：</label>
						<a-select
								showSearch
								optionFilterProp="children"
								style="width: 210px;"
								v-model="addStatus"
								placeholder="请选择客户来源"
						>
							<a-select-option :value="0">全部</a-select-option>
							<a-select-option :value="item.id" v-for="item in selectList">{{item.match}}
							</a-select-option>
						</a-select>
						</span>
							<span class="select-option">
									<label style="margin-right: 5px;">录入时间：</label>
						<a-range-picker
								:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
								format="YYYY-MM-DD HH:mm"
								allowClear
								style="width:296px;margin-right: 5px;"
								:disabled-date="disabledDate"
								v-model="joinTime"
								@change="changeTime"
						/>
						</span>
							<a-button type="primary" @click="find2">查询</a-button>
							<a-button style="margin-left: 10px;" @click="clear2">重置</a-button>
						</div>
					</div>
					<div style="overflow:hidden;">
						<div style="float: right;">
							<a-button type="primary" @click="customerRechecking" style="margin-right: 10px;">客户查重
							</a-button>
							<a-button type="primary" @click="recordCustomer" style="margin-right: 10px;"
							          v-has="'highSeasCustomerList-import'">录入客户
							</a-button>
							<a-button type="primary" @click="importExcel" v-has="'highSeasCustomerList-import'">批量导入客户
							</a-button>
						</div>
					</div>
				</a-col>
				<!-- 表格部分 -->
				<div class="content-bd">
					<a-spin tip="加载中..." size="large" :spinning="isLoading2">
						<div class="spin-content">
							<a-table
									:rowSelection="rowSelection"
									:columns="columns2"
									:dataSource="customList"
									:pagination="false"
									:rowClassName="rowClassName" v-has="'highSeasCustomerList-list'"
							>
								<template slot="info" slot-scope="text, record, index">
									<div style="width: 180px;">
										姓名：{{record.name}}
										<a-icon type="man"
										        style="color: #427EBA;"
										        v-if="record.gender=='男'"/>
										<a-icon
												type="woman"
												style="color: #ED4997;"
												v-if="record.gender=='女'"
										/>
										<div style="color: red;">{{record.claimTip}}</div>
									</div>
								</template>
								<template slot="linkType" slot-scope="text, record, index">
									<div v-if="record.phone != ''">手机号：{{record.phone}}</div>
									<div v-if="record.wx_num != ''">微信号：{{record.wx_num}}</div>
									<div v-if="record.qq != ''">QQ：{{record.qq}}</div>
									<div v-if="record.email != ''">邮箱：{{record.email}}</div>
								</template>
								<template slot="tagData" slot-scope="text, record, index">
									<a-tag v-for="item in record.tagData" style="margin-bottom: 5px;"
									       color="blue">
										{{item.tname}}
									</a-tag>
									<span v-if="record.tagData.length == 0">--</span>
								</template>
								<template slot="claimName" slot-scope="text, record, index">
									<span v-if="record.claimName == ''">--</span>
									<span v-if="record.claimName != ''">
										<a-tag color="orange">
											{{record.claimName}}
										</a-tag>
									</span>
									<a-popover placement="left">
										<template slot="content">
											<div style="max-height: 500px; overflow-y: auto;">
												<div v-for="(item,index) in record.claimData"
												     style="max-width: 500px;display: block;margin-bottom: 5px;">
													认领第{{item.num}}次：{{item.name}}
													{{item.claim_time}}，在{{item.reclaim_time}}回收
												</div>
											</div>
										</template>
										<div v-if="record.claimCount > 0" style="color: red;cursor: pointer;">
											【历史认领{{record.claimCount}}次】
										</div>
									</a-popover>
								</template>
								<template slot="action" slot-scope="text, record, index">
									<a-button @click="claim(0,1,record)"
									          style="margin: 0 5px 5px 0"
									          :disabled="user_id == 0 || record.claimTip != ''"
									          v-if="record.again_claim == 0" v-has="'highSeasCustomerList-claim'">
										我要认领
									</a-button>
									<a-button @click="claim(0,1,record)"
									          style="margin: 0 5px 5px 0"
									          :disabled="user_id == 0 || record.claimTip != ''"
									          v-if="record.again_claim == 1" v-has="'highSeasCustomerList-claim'">
										重新认领
									</a-button>
									<a-button @click="showDepartmentList(record,0)" style="margin: 0 5px 5px 0"
									          v-has="'highSeasCustomerList-assign'">指定分配
									</a-button>
									<a-button @click="edit(record.id)"
									          v-if="record.can_edit == 1" style="margin: 0 5px 5px 0">编辑
									</a-button>
									<a-button @click="detailList(record.id)"
									          v-if="record.can_edit == 1" style="margin: 0 5px 5px 0">详情
									</a-button>
								</template>
							</a-table>
							<div style="margin: 20px 0px;line-height: 32px;float: left;" v-show="total2 > 0">
								<a-checkbox v-model="batchTypeValue"
								            @click="batchTypeChange"></a-checkbox>
								当前页
								<a-button @click="showDepartmentList2(0)" type="primary"
								          :disabled="this.selectedRowKeys.length > 0 ? false : true"
								          style="margin-left: 10px;" v-has="'highSeasCustomerList-assign'">批量指定分配
								</a-button>
								<a-button @click="claim(0,1)" type="primary"
								          :disabled="this.selectedRowKeys.length > 0 ? false : true"
								          style="margin-left: 10px;" v-has="'highSeasCustomerList-claim'">批量认领
								</a-button>
							</div>
							<!--分页 -->
							<div class="pagination" style="margin: 20px 0px;float: right;"
							     v-show="total2 > 0" v-has="'highSeasCustomerList-list'">
								<span style="height: 32px;line-height: 32px;display: inline-block;vertical-align: top;margin-right: 10px;">
									共
									<span style="color: blue">{{total2}}</span>
									条
								</span>
								<span class="pagination" style="height: 32px;display: inline-block;">
									<a-pagination :total="total2" showSizeChanger :showQuickJumper="quickJumper2"
									              :current="page2"
									              :pageSize="pageSize2"
									              :pageSizeOptions="['15','30','50','100']"
									              @change="changePage2"
									              @showSizeChange="showSizeChange2"/>
								</span>
							</div>
						</div>
					</a-spin>
				</div>
			</div>
		</div>
		<!-- 上传表格弹窗 -->
		<a-modal
				title="上传表格"
				v-model="showModal"
				@cancel="handleCancel"
				@ok="handleOk"
				width="750px"
				:confirmLoading="modalLoading">
			<div style="padding: 10px 0px;overflow: auto;">
				<div style="color:red;">为了避免导入时出现等待时间过长，建议单次上传不超过3000条，最多可支持5000条。</div>
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
							:href="$store.state.commonUrl+'/upload/import_nocustomer.xlsx'">Excel模板</a>。<span>请按照模板的要求上传客户资料，若有重复手机号或空行将会自动过滤，以及不符合规范的填写格式，上传后直接显示”--“</span>
					</div>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" style="margin-top: 4px;">
					<span slot="label">
										        客户标签&nbsp;
										        <a-tooltip title="针对导入的客户，自动打上选中的客户标签">
										          <a-icon type="question-circle"/>
										        </a-tooltip>
											</span>
					<corpChooseTag :callback="modalVisibleChange5"
					               :hasChoose="tag_arr2" v-if="isShowTag"></corpChooseTag>
				</a-form-item>
			</div>
		</a-modal>
		<!-- 选择成员组件 -->
		<a-modal
				title="选择成员"
				v-model="showModalDepartment" @cancel="chooseStaffCancel" @ok="chooseStaffHandel(0)">
			<div style="color: red;margin-bottom: 10px;">指定分配给具有外部联系人权限的成员</div>
			<chooseStaffSelect v-if="showModalDepartment" style="" :index="0" :index2="0" ref="user" :type="1"
			                   :callback="selectStaffCallback"></chooseStaffSelect>
		</a-modal>
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
		<!-- 录入客户弹窗 -->
		<a-modal
				:title="detailTitle"
				v-model="recordVisible"
				width="750px">
			<template slot="footer">
				<a-button key="back" @click="recordCancel">
					<span v-if="!detailVisible">取消</span>
					<span v-if="detailVisible">关闭</span>
				</a-button>
				<a-button key="submit" type="primary" :loading="recordLoading" @click="recordOk" v-if="!detailVisible">
					确定
				</a-button>
			</template>
			<div style="padding: 10px 0px;min-height: 300px;overflow: auto;">
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">
	                    <span style="color: red;"> * </span>姓名
	                </span>
					<a-input placeholder="请输入姓名" style="width: 222px;" v-model="recordName" autoComplete="off"
					         v-if="!detailVisible"/>
					<span v-if="detailVisible">{{recordName}}</span>
				</a-form-item>
				<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">微信号</span>
					<a-input placeholder="请输入微信号" style="width: 222px;" v-model="recordWx" autoComplete="off"
					         v-if="!detailVisible"/>
					<span v-if="detailVisible">
						<span v-if="recordWx == ''">暂无</span>
						<span v-else>{{recordWx}}</span>
					</span>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">QQ号</span>
					<a-input placeholder="请输入QQ号" style="width: 222px;" v-model="recordQQ" autoComplete="off"
					         v-if="!detailVisible"/>
					<span v-if="detailVisible">
						<span v-if="recordQQ == ''">暂无</span>
						<span v-else>{{recordQQ}}</span>
					</span>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">手机号</span>
					<a-input placeholder="请输入手机号" style="width: 222px;" v-model="recordPhone" autoComplete="off"
					         v-if="!detailVisible"/>
					<span v-if="detailVisible">
						<span v-if="recordPhone == ''">暂无</span>
						<span v-else>{{recordPhone}}</span>
					</span>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">公司名称</span>
					<a-input placeholder="请输入公司名称" style="width: 222px;" v-model="recordCompany" autoComplete="off"
					         v-if="!detailVisible"/>
					<span v-if="detailVisible">
						<span v-if="recordCompany == ''">暂无</span>
						<span v-else>{{recordCompany}}</span>
					</span>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">Email</span>
					<a-input placeholder="请输入Email" style="width: 222px;" v-model="recordEmail" autoComplete="off"
					         v-if="!detailVisible"/>
					<span v-if="detailVisible">
						<span v-if="recordEmail == ''">暂无</span>
						<span v-else>{{recordEmail}}</span>
					</span>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">性别</span>
					<a-radio-group v-model="recordSex" v-if="!detailVisible">
						<a-radio :value="1">
							男
						</a-radio>
						<a-radio :value="2">
							女
						</a-radio>
						<a-radio :value="3">
							未知
						</a-radio>
					</a-radio-group>
					<span v-if="detailVisible">
						<span v-if="recordSex == 1">男</span>
						<span v-if="recordSex == 2">女</span>
						<span v-if="recordSex == 3">未知</span>
					</span>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">地区</span>
					<a-cascader
							:options="cityData"
							v-model="recordArea"
							style="width: 222px;margin-right: 5px;"
							placeholder="请选择地区" v-if="!detailVisible"
					/>
					<span v-if="detailVisible">
						<span v-if="recordArea2 == ''">暂无</span>
						<span v-else>{{recordArea2}}</span>
					</span>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">备注</span>
					<a-input placeholder="请输入备注" style="width: 222px;" v-model="recordRemark" autoComplete="off"
					         v-if="!detailVisible" :maxLength="10">
						<template slot="suffix">{{recordRemark.length}}/10</template>
					</a-input>
					<span v-if="detailVisible">
						<span v-if="recordRemark == ''">暂无</span>
						<span v-else>{{recordRemark}}</span>
					</span>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label"><span style="color: red;"> * </span>客户来源</span>
					<a-select
							showSearch
							optionFilterProp="children"
							style="width: 222px;"
							v-model="recordStatus"
							placeholder="请选择客户来源" v-if="!detailVisible"
					>
						<a-select-option :value="item.id" v-for="item in selectList">{{item.match}}
						</a-select-option>
					</a-select>
					<span v-if="detailVisible">
						<span v-if="recordStatus2 == ''">暂无</span>
						<span v-else>{{recordStatus2}}</span>
					</span>
				</a-form-item>
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" style="margin-top: 4px;">
					<span slot="label">
										        客户标签&nbsp;
										        <a-tooltip title="针对录入的客户，自动打上选中的客户标签">
										          <a-icon type="question-circle"/>
										        </a-tooltip>
											</span>
					<template v-if="!detailVisible">
						<corpChooseTag :callback="modalVisibleChange4"
						               :hasChoose="tag_arr" v-if="isShowTag"></corpChooseTag>
						<template v-if="!isShowTag">
							<a-tag color="#01b065" v-for="item in tagData">
								{{item.tname}}
							</a-tag>
							<span v-if="tagData.length == 0">暂无</span>
						</template>
					</template>
					<template v-if="detailVisible">
						<a-tag color="#01b065" v-for="item in tagData">
							{{item.tname}}
						</a-tag>
						<span v-if="tagData.length == 0">暂无</span>
					</template>
				</a-form-item>
			</div>
		</a-modal>
		<!-- 客户查重弹窗 -->
		<a-modal
				title="客户查重"
				v-model="recheckingVisible" :footer="false" width="700px" @cancel="recheckingCancel">
			<a-input-search
					placeholder="请输入客户姓名、手机号、公司名称"
					enter-button="搜索" v-model="recheckingName" allowClear
					@search="changeRecheckingSearch"
			/>
			<div style="height: 300px;margin: 15px 0;">
				<a-spin tip="加载中..." size="large" :spinning="recheckingLoading">
					<div class="spin-content">
						<a-table
								:columns="columns4"
								:dataSource="recheckingList"
								:pagination="false"
								:rowClassName="rowClassName" class="repeat-table"
						>
							<template slot="user_name" slot-scope="text, record, index">
								当前被{{record.user_name}}认领
							</template>
						</a-table>
					</div>
				</a-spin>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import chooseStaffSelect from "@/components/ChooseStaffSelect.vue"
	import cityData from "../../../common/js/citydata2.js";
	import moment from "moment";
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"

	const columns = [
		{
			title      : "客户信息",
			dataIndex  : "customerInfo",
			key        : "customerInfo",
			scopedSlots: {customRender: "customerInfo"}
		},
		{
			title    : "原归属成员",
			dataIndex: "member",
			key      : "member"
		},
		{
			title      : "来源",
			dataIndex  : "add_other_info",
			key        : "add_other_info",
			scopedSlots: {customRender: "add_other_info"}
		},
		{
			title    : "进入回收时间",
			dataIndex: "reclaim_time",
			key      : "reclaim_time"
		},
		{
			title      : "回收条件",
			dataIndex  : "reclaim_rule",
			key        : "reclaim_rule",
			scopedSlots: {customRender: "reclaim_rule"}
		},
		{
			title      : "备注",
			dataIndex  : "claimTip",
			key        : "claimTip",
			scopedSlots: {customRender: "claimTip"}
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
			title      : "客户信息",
			dataIndex  : "info",
			key        : "info",
			scopedSlots: {customRender: "info"}
		},
		// {
		// 	title      : "联系方式",
		// 	dataIndex  : "linkType",
		// 	key        : "linkType",
		// 	scopedSlots: {customRender: "linkType"}
		// },
		{
			title    : "来源",
			dataIndex: "field_option_name",
			key      : "field_option_name"
		},
		{
			title    : "录入时间",
			dataIndex: "add_time",
			key      : "add_time"
		},
		{
			title      : "标签",
			dataIndex  : "tagData",
			key        : "tagData",
			scopedSlots: {customRender: "tagData"}
		},
		{
			title      : "上次认领成员",
			dataIndex  : "claimName",
			key        : "claimName",
			scopedSlots: {customRender: "claimName"}
		},
		{
			title    : "最后一次回收时间",
			dataIndex: "reclaim_time",
			key      : "reclaim_time"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];
	const columns3 = [
		{
			title      : "客户信息",
			dataIndex  : "customerInfo",
			key        : "customerInfo",
			scopedSlots: {customRender: "customerInfo"}
		},
		{
			title      : "原归属成员",
			dataIndex  : "old_user_name",
			key        : "old_user_name",
			scopedSlots: {customRender: "old_user_name"}
		},
		{
			title    : "认领时间",
			dataIndex: "add_time",
			key      : "add_time"
		},
		// {
		// 	title    : "进入回收时间",
		// 	dataIndex: "reclaim_time",
		// 	key      : "reclaim_time"
		// },
		{
			title    : "回收条件",
			dataIndex: "reclaim_rule",
			key      : "reclaim_rule"
		},
		{
			title      : "共享员工",
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {customRender: "user_name"}
		},
		{
			title      : "添加状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];
	const columns4 = [
		{
			title    : "客户姓名",
			dataIndex: "name",
			key      : "name",
			width    : '200px',
		},
		{
			title    : "手机号",
			dataIndex: "phone",
			key      : "phone"
		},
		{
			title    : "公司名称",
			dataIndex: "company_name",
			key      : "company_name"
		},
		{
			title      : "当前认领人",
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {customRender: "user_name"}
		},
	];

	export default {
		name      : 'highSeasCustomerList',
		components: {
			chooseStaffSelect, corpChooseTag
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				moment,
				corpId             : corpId,//企业ID
				tabKey             : 1,//tab的值，1企微客户公海池，2非企微客户公海池
				tabKey2            : 1,//tab的值，1待共享，2已认领
				isMasterAccount    : localStorage.getItem('isMasterAccount'),
				//企微客户公海池->待共享
				isLoading          : false,//Loading组件的显示与隐藏
				ExcelName          : '',//Excel名称
				batchList          : [],//表格数据
				id                 : '',//编辑的id
				customName         : '',//搜索的客户姓名
				wayList            : [], // 客户来源列表
				add_way            : [],//客户来源
				way_id             : [], // 二维码id
				codeList           : [], // 二维码列表
				claimTime          : null,//录入时间
				//分页
				total              : 0, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				page               : 1, //页码
				pageSize           : 15, //每页数据条数
				showModal          : false,//弹窗的显示与隐藏
				modalLoading       : false,//弹窗确认键的加载
				fileInfo           : {}, //上传excel的文件信息
				file_name          : '', //上传excel的名称
				showModalDepartment: false, // 选择成员弹窗
				//表格部分
				columns,
				//企微客户公海池->已认领
				isLoading3         : false,//Loading组件的显示与隐藏
				claimUserList      : [],//表格数据
				customName3        : '',//搜索的客户姓名
				claimTime3         : null,//录入时间
				//表格部分
				columns3,
				//分页
				total3             : 0, //总条数
				quickJumper3       : false, // 是否显示快速跳转的控件
				page3              : 1, //页码
				pageSize3          : 15, //每页数据条数
				//非企微客户公海池
				isLoading2         : false,//Loading组件的显示与隐藏
				customList         : [],//表格数据
				user_id            : 0,//当前账号对应的成员id
				selectList         : [],//下拉选项
				phone              : '',//搜索输入的客户电话
				addStatus          : 0,//客户来源
				joinTime           : null,//录入时间
				//表格部分
				columns2,
				//分页
				total2             : 0, //总条数
				quickJumper2       : false, // 是否显示快速跳转的控件
				page2              : 1, //页码
				pageSize2          : 15, //每页数据条数
				//详情
				detailVisible      : false,//详情显示与隐藏
				detailTitle        : '',//详情标题
				//进度条弹窗
				progressVisible    : false,//进度条弹窗显示与隐藏
				progressNum        : 0,//进度条进度
				leftSiderWidth     : document.getElementsByClassName('menu-sider')[0].style.width,
				successNum         : 0,//成功上传人数
				failNum            : 0,//失败上传人数
				notImportNum       : 0,//待上传人数
				//录入客户
				recordVisible      : false,//录入客户弹窗的显示与隐藏
				recordLoading      : false,//确认按钮加载
				recordName         : '',//姓名
				recordWx           : '',//微信号
				recordQQ           : '',//QQ号
				recordPhone        : '',//手机号
				recordCompany      : '',//公司名称
				recordEmail        : '',//Email
				recordSex          : 1,//性别
				recordRemark       : '',//备注
				recordStatus       : [],//客户来源id
				recordStatus2      : '',//客户来源名称
				// 地域
				cityData,
				recordArea         : [],
				recordArea2        : '',
				//客户查重
				recheckingVisible  : false,//弹窗的显示与隐藏
				recheckingLoading  : false,//loading的显示与隐藏
				recheckingList     : [],//查重结果列表
				recheckingName     : '',//搜索内容
				columns4,
				isShowTag          : false,
				tag_arr            : [], //标签值
				tag_arr2           : [], //标签值
				tagData            : [],//标签数据
				assignRecord       : '',//指定分配的该行信息
				assignType         : 1,//0非企微客户、1企微客户
				userId             : [],//选择的成员id
				userName           : [],//选择的成员name
				batchTypeValue     : false,//选择当前页，是否选中
				checkArr           : [],//选择当前页/所有，保存的key
				selectedRowKeys    : [],
			};
		},
		methods   : {
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
				this.checkArr = []
				this.selectedRowKeys = []
				this.batchTypeValue = false
				this.assignRecord = ''
				this.assignType = 1
				this.userId = []
				this.userName = []
				if (this.tabKey == 1) {
					this.tabKey2 = 1
					this.ExcelName = ''
					this.pageSize = 15
					this.clear()
					this.getAddWay()
				} else if (this.tabKey == 2) {
					this.phone = ''
					this.addStatus = 0
					this.joinTime = null
					this.pageSize2 = 15
					this.getCustomList()
				}
			},
			changeTab2 (e) {
				this.tabKey2 = e
				if (this.tabKey2 == 1) {
					this.ExcelName = ''
					this.pageSize = 15
					this.clear()
					this.getAddWay()
				} else if (this.tabKey2 == 2) {
					this.checkArr = []
					this.selectedRowKeys = []
					this.batchTypeValue = false
					this.assignRecord = ''
					this.assignType = 1
					this.userId = []
					this.userName = []
					this.pageSize3 = 15
					this.clear3()
				}
			},
			//客户查重
			customerRechecking () {
				this.recheckingVisible = true
			},
			async changeRecheckingSearch () {
				this.recheckingLoading = true
				const {data: res} = await this.axios.post(
					"public-sea-customer/check-repeat",
					{
						uid    : localStorage.getItem("uid"),
						name   : this.recheckingName,
						corp_id: this.corpId,
					}
				);
				if (res.error != 0) {
					this.recheckingLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.recheckingLoading = false
					this.recheckingList = res.data
				}
			},
			recheckingCancel () {
				this.recheckingLoading = false
				this.recheckingList = []
				this.recheckingVisible = false
				this.recheckingName = ''
			},
			modalVisibleChange4 (event, arr) {
				if (event == "ok") {
					this.tag_arr = arr.split(',')
				}
			},
			modalVisibleChange5 (event, arr) {
				if (event == "ok") {
					this.tag_arr2 = arr.split(',')
				}
			},
			//录入客户
			recordCustomer () {
				this.detailTitle = '录入客户'
				this.recordCancel()
				this.detailVisible = false
				this.recordVisible = true
				this.isShowTag = true
			},
			recordCancel () {
				this.recordVisible = false
				this.recordName = ''
				this.recordWx = ''
				this.recordQQ = ''
				this.recordPhone = ''
				this.recordCompany = ''
				this.recordEmail = ''
				this.recordSex = 1
				this.recordRemark = ''
				this.recordStatus = []
				this.recordStatus2 = ''
				this.recordArea = []
				this.id = ''
				this.tag_arr = []
				this.tagData = []
				this.isShowTag = false
			},
			async recordOk () {
				var wxReg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/
				var qqReg = /^[1-9][0-9]{4,9}$/
				var phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
				var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
				if (this.recordName == '') {
					this.$message.error('请填写姓名');
					return false;
				}
				if (this.recordWx == '' && this.recordQQ == '' && this.recordPhone == '') {
					this.$message.error('微信号/QQ号/手机号至少填写一个');
					return false;
				}
				if (this.recordWx != '') {
					if (!wxReg.test(this.recordWx)) {
						this.$message.error('请输入正确的微信号');
						return false;
					}
				}
				if (this.recordQQ != '') {
					if (!qqReg.test(this.recordQQ)) {
						this.$message.error('请输入正确的QQ号');
						return false;
					}
				}
				if (this.recordPhone != '') {
					if (!phoneReg.test(this.recordPhone)) {
						this.$message.error('请输入正确的手机号');
						return false;
					}
				}
				if (this.recordEmail != '') {
					if (!emailReg.test(this.recordEmail)) {
						this.$message.error('请输入正确的Email');
						return false;
					}
				}
				if (typeof this.recordStatus == 'object' && this.recordStatus.length == 0) {
					this.$message.error('请选择客户来源');
					return false;
				}
				this.recordLoading = true
				let sexValue = ''
				if (this.recordSex == 1) {
					sexValue = '男'
				} else if (this.recordSex == 2) {
					sexValue = '女'
				} else if (this.recordSex == 3) {
					sexValue = '未知'
				}
				let area = ''
				if (this.recordArea[0]) {
					area = this.recordArea[0]
					if (this.recordArea[1]) {
						area = area + '-' + this.recordArea[1]
					}
				}
				const {data: res} = await this.axios.post(
					"public-sea-customer/set-no-customer",
					{
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem('sub_id'),
						uid            : localStorage.getItem("uid"),
						corp_id        : this.corpId,
						name           : this.recordName,
						wx_num         : this.recordWx,
						phone          : this.recordPhone,
						company        : this.recordCompany,
						qq             : this.recordQQ,
						email          : this.recordEmail,
						sex            : sexValue,
						area           : area,
						remark         : this.recordRemark,
						field_option_id: this.recordStatus,
						id             : this.id,
						tag_ids        : this.tag_arr
					}
				);
				if (res.error != 0) {
					this.recordLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.recordLoading = false
					this.recordCancel()
					this.getCustomList()
				}
			},
			//认领
			claim (isCustomer, type, record) {
				let that = this;
				let title = ''
				this.assignType = isCustomer
				if (typeof record == 'object') {
					that.assignRecord = record
					if (that.tabKey == 1) {
						title = "你确定要认领【" + record.customerInfo.name + "】吗？"
					} else if (that.tabKey == 2) {
						title = "你确定要认领【" + record.name + "】吗？"
						if (record.again_claim == 1) {
							title = "你确定要重新认领【" + record.name + "】吗？"
						}
					}
				} else if (typeof record == 'undefined') {
					title = '你确定要认领' + this.selectedRowKeys.length + '位客户吗？'
				}

				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.assign(type)
					}
				});
			},
			async claim2 (id) {
				let type = 1
				if (this.tabKey == 1) {
					type = 1
				} else if (this.tabKey == 2) {
					type = 0
				}
				const {data: res} = await this.axios.post(
					"public-sea-customer/claim",
					{
						uid    : localStorage.getItem("uid"),
						corp_id: this.corpId,
						type   : type,//0非企微，1企微
						user_id: this.user_id,
						sea_id : id
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('认领成功');
					if (this.tabKey == 1) {
						this.getList()
					} else if (this.tabKey == 2) {
						this.getCustomList()
					}
				}
			},
			//详情
			handleShowDetail (id) {
				let query = {
					id: id
				}
				this.$router.push({path: '/highSeasCustomer/detail', query: query})
			},
			//详情
			detailList (id) {
				this.detailVisible = true
				this.detail(id)
			},
			async detail (id) {
				const {data: res} = await this.axios.post(
					"public-sea-customer/no-customer-detail",
					{
						sea_id : id,
						corp_id: this.corpId,
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (this.detailVisible) {
						//详情
						this.recordStatus2 = res.data.field_option_name
						this.detailTitle = '客户详情'
					} else {
						//编辑
						this.recordStatus = res.data.field_option_id
						this.detailTitle = '客户编辑'
					}
					this.recordName = res.data.name
					this.recordWx = res.data.wx_num
					this.recordQQ = res.data.qq
					this.recordPhone = res.data.phone
					this.recordCompany = res.data.company
					this.recordEmail = res.data.email
					if (res.data.gender == '男') {
						this.recordSex = 1
					} else if (res.data.gender == '女') {
						this.recordSex = 2
					} else if (res.data.gender == '未知') {
						this.recordSex = 3
					}
					if (res.data.area != '') {
						this.recordArea = res.data.area.split('-')
						this.recordArea2 = res.data.area
					} else {
						this.recordArea = []
						this.recordArea2 = ''
					}
					this.recordRemark = res.data.remark
					this.tagData = res.data.tagData
					this.recordVisible = true
				}
			},
			//编辑
			edit (id) {
				this.detailVisible = false
				this.isShowTag = false
				this.id = id
				this.detail(id)
			},
			//导入Excel
			importExcel () {
				this.file_name = ''
				this.fileInfo = {}
				this.tag_arr2 = []
				this.isShowTag = true
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
			// 指定分配-选择成员
			showDepartmentList (record, type) {
				this.showModalDepartment = true
				this.assignRecord = record
				this.assignType = type//0非企微客户、1企微客户
			},
			// 批量指定分配-选择成员
			showDepartmentList2 (type) {
				this.showModalDepartment = true
				this.assignType = type
			},

			// 选择成员回调
			selectStaffCallback (event, id) {
				if (event == "ok") {
					this.userId = id
					this.$nextTick(() => {
						this.userName = this.$refs.user.$el.innerText
					})
				}
			},
			chooseStaffCancel () {
				this.userId = ''
				this.userName = ''
				this.assignRecord = ''
				// this.selectedRowKeys = []
				// this.batchTypeValue = false
				if (this.showModalDepartment) {
					this.$refs.user.userId = []
					this.showModalDepartment = false
				}
			},
			chooseStaffHandel (type) {
				if (type == 0) {
					//0分配
					if (this.userId.length == 0) {
						this.$message.error('请先选择成员');
						return false
					}
				}
				let that = this;
				let title = ""
				if (that.assignRecord != '') {
					//单个分配
					if (this.assignType == 0) {
						//非企微客户
						title = "一旦确定将【" + that.assignRecord.name + "】转交给【" + this.userName + "】，则进入该成员的客户列表。确定分配吗？"
					} else if (this.assignType == 1) {
						//企微客户
						title = "一旦确定将【" + that.assignRecord.customerInfo.name + "】转交给【" + this.userName + "】，则进入该成员的客户列表。确定分配吗？"
					}
				} else {
					//批量分配
					title = "一旦将" + this.selectedRowKeys.length + "位客户转交给【" + this.userName + "】，则进入该成员的客户列表。确定分配吗？"
				}
				that.showModalDepartment = false
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.assign(type)
					},
					onCancel () {
						that.showModalDepartment = true
					},
				});
			},
			//分配
			async assign (type) {
				let sea_id = ''
				if (this.assignRecord != '') {
					//单个分配
					sea_id = this.assignRecord.id
				} else {
					//批量分配
					sea_id = this.selectedRowKeys
				}
				let user_id = []
				if (type == 0) {
					//0分配
					user_id = this.userId
				} else if (type == 1) {
					//1认领
					user_id = this.user_id
				}
				const {data: res} = await this.axios.post("public-sea-customer/customer-assign", {
					uid     : localStorage.getItem("uid"),
					corp_id : this.corpId,
					user_id : user_id,
					type    : this.assignType,//0非企微客户、1企微客户
					sea_id  : sea_id,
					is_claim: type,//0分配，1认领
				});
				if (res.error != 0) {
					let that = this
					that.$error({
						title: res.error_msg,
						onOk () {
							that.userId = ''
							that.userName = ''
							that.assignRecord = ''
						},
					});
				} else {
					this.$success({
						title: res.data.textHtml,
					});
					this.selectedRowKeys = []
					this.chooseStaffCancel()
					if (this.assignType == 0) {
						//非企微客户
						if (type == 0) {
							this.clear2()
						} else if (type == 1) {
							this.batchTypeValue = false
							this.selectedRowKeys = []
							this.getCustomList()
						}
					} else if (this.assignType == 1) {
						//企微客户
						if (this.tabKey2 == 1) {
							//可认领
							if (type == 0) {
								this.clear()
							} else if (type == 1) {
								this.batchTypeValue = false
								this.selectedRowKeys = []
								this.getList()
							}
						}
					}
				}
			},
			async handleOk () {
				this.modalLoading = true
				if (JSON.stringify(this.fileInfo) == '{}') {
					this.$message.error('请选择上传Excel');
					this.modalLoading = false
					return false;
				}
				this.$message.info("已进入后台导入中，请耐心等待...");
				this.progressNum = 0
				this.successNum = 0
				this.failNum = 0
				this.notImportNum = 0
				this.showModal = false
				this.progressVisible = true
				this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
				this.$nextTick(() => {
					document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
				})
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				param.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
				param.append("sub_id", localStorage.getItem('sub_id'));
				param.append("corp_id", this.corpId);
				param.append("importFile", this.fileInfo);
				param.append('tag_ids', this.tag_arr2);
				if (localStorage.getItem('isMasterAccount') == 2) {
					param.append("sub_id", localStorage.getItem('sub_id'));
				}
				const {data: res} = await this.axios.post(
					"public-sea-customer/import-no-customer", param
				);
				if (res.error != 0) {
					this.modalLoading = false;
					this.progressVisible = false
					this.$message.error(res.error_msg);
				} else {
				}
			},
			handleCancel () {
				this.fileInfo = {}
				this.file_name = ''
				this.tag_arr2 = []
				this.isShowTag = false
				this.modalLoading = false;
				this.showModal = false
			},
			// 获取客户来源
			async getAddWay () {
				const {data: res} = await this.axios.post("work-external-contact-follow-user/add-way-list");
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.wayList = res.data
					this.add_way = -1
				}
			},
			handleChangeAddWay () {
				this.way_id = []
				if (this.add_way == 'way' || this.add_way == 'chatWay' || this.add_way == 'award' || this.add_way == 'fission' || this.add_way == 'redPack') {
					this.handleChangeCode()
				}
			},
			async handleChangeCode (value) {
				if (!value && value != 0) {
					value = ''
				}
				const {data: res} = await this.axios.post("work-external-contact-follow-user/get-way-by-name", {
					type   : this.add_way,
					corp_id: this.corpId,
					title  : value,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.codeList = res.data
				}
			},
			//获取企微客户列表表格内容->待共享
			async getList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				let add_way = typeof this.add_way == "number" || typeof this.add_way == "string" ? this.add_way : -1
				const {data: res} = await this.axios.post(
					"public-sea-customer/customer",
					{
						uid            : localStorage.getItem("uid"),
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem('sub_id'),
						corp_id        : this.corpId,
						name           : this.customName,
						add_way        : add_way,
						way_id         : this.way_id,
						s_date         : this.claimTime ? (this.claimTime.length > 1 ? this.claimTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
						e_date         : this.claimTime ? (this.claimTime.length > 1 ? this.claimTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
						page           : page,
						pageSize       : pageSize
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.batchList = res.data.customerData;
					this.user_id = res.data.userId
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					this.checkArr = []
					this.batchList.map(x => {
						this.checkArr.push(x.key)
					})
					this.batchTypeValue = false
					if (this.selectedRowKeys.length > 0) {
						this.batchTypeValue = true
						this.checkArr.map(y => {
							if (this.selectedRowKeys.indexOf(y) == -1) {
								this.batchTypeValue = false
							}
						})
					}
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
				this.customName = ''
				this.add_way = -1
				this.way_id = []
				this.claimTime = null
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
			//获取企微客户列表表格内容->待共享
			async getClaimUserList (page = 1, pageSize = this.pageSize3) {
				this.isLoading3 = true
				const {data: res} = await this.axios.post(
					"public-sea-customer/claim-user",
					{
						uid            : localStorage.getItem("uid"),
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem('sub_id'),
						corp_id        : this.corpId,
						name           : this.customName3,
						s_date         : this.claimTime3 ? (this.claimTime3.length > 1 ? this.claimTime3[0].format("YYYY-MM-DD HH:mm") : '') : '',
						e_date         : this.claimTime3 ? (this.claimTime3.length > 1 ? this.claimTime3[1].format("YYYY-MM-DD HH:mm") : '') : '',
						page           : page,
						pageSize       : pageSize
					}
				);
				if (res.error != 0) {
					this.isLoading3 = false;
					this.$message.error(res.error_msg);
				} else {
					this.claimUserList = res.data.customerData;
					this.isLoading3 = false;
					this.total3 = parseInt(res.data.count);
					this.page3 = page;
					this.pageSize3 = pageSize;
					this.quickJumper3 = this.total3 > this.pageSize3;
				}
			},
			// 分页
			changePage3 (page, pageSize) {
				this.getClaimUserList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 90)
				})
			},
			showSizeChange3 (page, pageSize) {
				this.getClaimUserList(1, pageSize);
			},
			changeTime3 (date, dateString) {
				this.claimTime3 = date
			},
			//点击搜索
			find3 () {
				this.getClaimUserList();
			},
			//点击清空
			clear3 () {
				this.customName3 = ''
				this.claimTime3 = null
				this.getClaimUserList();
			},
			//提醒
			notice (record) {
				let that = this
				that.$confirm({
					title     : "确定提醒【" + record.old_user_name + "】共享【" + record.name + "】？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.notice2(record.id)
					}
				});
			},
			async notice2 (id) {
				const {data: res} = await this.axios.post(
					"public-sea-customer/claim-remind",
					{
						uid          : localStorage.getItem("uid"),
						corp_id      : this.corpId,
						claim_user_id: id
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('提醒成功');
				}
			},
			//获取非企微客户公海池表格内容
			async getCustomList (page = 1, pageSize = this.pageSize2) {
				this.isLoading2 = true
				const {data: res} = await this.axios.post(
					"public-sea-customer/no-customer",
					{
						uid            : localStorage.getItem("uid"),
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem('sub_id'),
						corp_id        : this.corpId,
						name           : this.phone,
						option_id      : this.addStatus,
						s_date         : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
						e_date         : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
						page           : page,
						pageSize       : pageSize
					}
				);
				if (res.error != 0) {
					this.isLoading2 = false;
					this.$message.error(res.error_msg);
				} else {
					this.customList = res.data.customerData;
					this.user_id = res.data.userId
					this.selectList = res.data.optionList;
					this.isLoading2 = false;
					this.total2 = parseInt(res.data.count);
					this.page2 = page;
					this.pageSize2 = pageSize;
					this.quickJumper2 = this.total2 > this.pageSize2;
					this.checkArr = []
					this.customList.map(x => {
						this.checkArr.push(x.key)
					})
					this.batchTypeValue = false
					if (this.selectedRowKeys.length > 0) {
						this.batchTypeValue = true
						this.checkArr.map(y => {
							if (this.selectedRowKeys.indexOf(y) == -1) {
								this.batchTypeValue = false
							}
						})
					}
				}
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			changeTime (date, dateString) {
				this.joinTime = date
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
				this.addStatus = 0
				this.joinTime = null
				this.getCustomList();
			},
			// 分页
			changePage2 (page, pageSize) {
				this.selectedRowKeys = []
				this.batchTypeValue = false
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
				this.selectedRowKeys = []
				this.batchTypeValue = false
				this.getCustomList(1, pageSize);
			},
			//后台返回导入进度数据处理
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'import_nocustomer') {
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
								this.progressVisible = false
								this.tag_arr2 = []
								this.isShowTag = false
								this.getCustomList()
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
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					// 添加
					this.selectedRowKeys = this.checkArr
				} else {
					// 移除
					this.selectedRowKeys = []
				}
			},
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
				this.batchTypeValue = this.checkArr.every(val => selectedRowKeys.includes(val))
			},
		},
		computed  : {
			rowSelection () {
				const {selectedRowKeys} = this;
				return {
					selectedRowKeys,
					onChange             : this.onSelectChange,
					hideDefaultSelections: true,
				};
			}
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
					// that.tabKey = 1
					//接收后台实时返回的导入进度结果
					that.ws.setCallback(this.websocketOnMessage)
					// that.getList();
					// that.getAddWay();
				}
				// else {
				// 	that.tabKey = 2
				// 	that.getCustomList()
				// }
				that.$forceUpdate()
			} else {
				// this.tabKey = 1
				//接收后台实时返回的导入进度结果
				this.ws.setCallback(this.websocketOnMessage)
				// this.getList();
				// this.getAddWay();
			}

		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建

			if (from.path != '/highSeasCustomer/detail') {
				next(vm => {
					if (localStorage.getItem('isMasterAccount') == 2) {
						let permissionButton = localStorage.getItem('permissionButton').split(',')
						if (permissionButton.indexOf('customImportList-all-list') != -1) {
							vm.tabKey = 1
							vm.tabKey2 = 1
							vm.ExcelName = ''
							vm.pageSize = 15
							vm.clear();
							vm.getAddWay();
						} else {
							vm.tabKey = 2
							vm.phone = ''
							vm.addStatus = 0
							vm.joinTime = null
							vm.pageSize2 = 15
							vm.id = ''
							vm.getCustomList()
						}
						vm.$forceUpdate()
					} else {
						vm.tabKey = 1
						vm.tabKey2 = 1
						vm.ExcelName = ''
						vm.pageSize = 15
						vm.clear()
						vm.getAddWay();
					}
				})
			}

			next()
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

	.select-option {
		display: inline-block;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	/deep/ .ant-table-thead > tr > th:first-child .ant-table-header-column {
		display: none;
	}

	.repeat-table /deep/ .ant-table-thead > tr > th:first-child .ant-table-header-column {
		display: block;
	}

</style>