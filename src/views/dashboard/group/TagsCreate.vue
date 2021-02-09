<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden; ">
				<a-layout
						style="position: absolute; left:0; top:0; bottom:0; right:0; overflow-x: hidden; overflow-y: auto;"
						class="scroll">
					<!-- 头部 -->
					<a-layout-header>标签拉群</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							<p>
								<span style="font-weight: 700;">标签拉群：</span>将同一标签层次的客户拉入同一个客户群内，比如将带有“吃货”标签的客户，拉入到“吃货群”，这样他们因具有相同的话题和兴趣爱好，企业就可以有针对性地对该特征的客户群制定社群运营方案，社群运营起来不仅高效，也方便管理，更利于群转化。
							</p>
							<p>
								<span style="font-weight: 700;">拉群流程：</span>选择需要群发的员工，针对该员工的客户，筛选具有同属性/标签的客户，同时选择多个群聊，并一一上传正确的群二维码，按照群聊顺序，客户群发给相应的员工确认，确认后，员工的客户即会收到该员工推送的入群欢迎语和入群二维码。
							</p>
							<p style="margin-bottom: 0px;font-weight: 700;">温馨提示：</p>
							<p style="margin-bottom: 0px;">
								1、客户每个月最多接收来自同一企业的管理员的4条群发消息，可在一天内发送4条，到达接收上限后，将无法给该客户推送消息，即无法收到入群邀请。
							</p>
							<p style="margin-bottom: 0px;">
								2、为了保证推送的客户均可以入群（群人数上限为200人），请添加多个群聊。系统会根据群成员当前人数推送入群二维码，当推送的客户数达到群上限人数时，系统会自动更换另外入群二维码群发给下一个客户。<span
									style="color: #F56C6C;">如当前群人数20人，那么当推送给第181位客户时，这个该客户会收到另外一个入群二维码，不论之前推送的180位客户是否已入群。</span>
							</p>
						</div>
						<div class="content-hd">
							<a-col style="float: left;">
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 210px;margin-right: 5px;"
										v-model="corpId"
								>
									<template v-for="item in corpInfo">
										<a-select-option :value="item.corpid">{{item.corp_full_name ||
											item.corp_name}}
										</a-select-option>
									</template>
								</a-select>
								<a-input style="width: 180px;" placeholder="搜索任务名称" allowClear v-model="title"
								         @keyup.enter="selectTitle"/>
								<a-button @click="showChatVisible" style="width: 180px;margin-left: 10px;">
									<span style="text-align: center;" v-if="chooseNum > 0">已选择{{chooseNum}}个群</span>
									<span style="text-align: center;" v-else>选择群聊</span>
								</a-button>
								<a-button style="margin-left: 10px;" @click="selectTitle" type="primary">查找</a-button>
								<a-button style="margin-left: 10px;" @click="clearTitle">清空</a-button>
							</a-col>
							<a-col style="float: right;">
								<a-button icon="plus" @click="create" type="primary" v-has="'groupTags-add'">
									新建拉群
								</a-button>
								<a-button icon="reload" @click="refresh" style="margin-left: 10px;width: 110px;"
								          v-has="'groupTags-list'">
									更新数据
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="groupList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'groupTags-list'">
									<span slot="title2" slot-scope="text, record,index">
										<div style="width: 145px;min-width: 60px;">{{record.title}}</div>
									</span>
									<span slot="chat_name" slot-scope="text, record,index">
											<div v-for="item in record.chat_name">
											<a-tag style="padding: 3px;">
												<span style="background: #01b065;width: 18px;height:18px;display: inline-block;margin-right: 5px;vertical-align: middle;">
													<img :src="img" style="width: 14px;margin: 2px;"/>
												</span>
												<span style="width: 110px;display:inline-block;vertical-align: middle;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
													<a-popover trigger="hover">
														<span slot="content"
														      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
															{{item}}
														</span>
														<span style="color:#01b065; cursor: pointer;">{{item}}</span>
													</a-popover>
												</span>
											</a-tag>
										</div>
									</span>
									<span slot="sender_name2">
										客户归属
						                  <a-tooltip placement="top">
						                    <template slot="title">
						                      <span>具有外部联系人权限的成员</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<span slot="sender_name" slot-scope="text, record,index">
										<div style="max-width: 300px;" v-if="record.others">
											<span v-if="record.others.user_ids.length == 0">--</span>
											<span v-else>
												<template v-if="record.others.user_ids.length>5">
													<a-popover trigger="hover">
														<span slot="content"
														      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;max-height: 300px;overflow-y: auto;">
															<template v-for="user in record.others.user_ids">
																<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'" color="orange"
																       style="margin-top: 5px;">{{user.title}}</a-tag>
															</template>
															<template v-for="user in record.others.user_ids">
																<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'" color="blue"
																       style="margin-top: 5px;">{{user.title}}</a-tag>
															</template>
															<span v-if="record.others.user_ids.length == 0">--</span>
														</span>
														<template v-for="(user,index) in record.others.user_ids">
															<a-tag v-if="index < 5 && user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'" color="orange"
															       style="margin-top: 5px;">{{user.title}}</a-tag>
														</template>
														<template v-for="(user,index) in record.others.user_ids">
															<a-tag v-if="index < 5 && user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'" color="blue"
															       style="margin-top: 5px;">{{user.title}}</a-tag>
														</template>
														<span style="cursor: pointer;">等共计{{getUserNum(record.others.user_ids)}}位成员、{{record.others.user_ids.length - getUserNum(record.others.user_ids)}}部门</span>
													</a-popover>
												</template>
												<template v-else>
													<template v-for="user in record.others.user_ids">
														<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'" color="orange"
														       style="margin-top: 5px;">{{user.title}}</a-tag>
													</template>
													<template v-for="user in record.others.user_ids">
														<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'" color="blue"
														       style="margin-top: 5px;">{{user.title}}</a-tag>
													</template>
												</template>
											</span>
										</div>
									</span>
									<span slot="will_num" slot-scope="text, record,index">
										<div style="min-width: 105px;">预计发送{{record.will_num}}人</div>
										<div>已成功发送{{record.real_num}}人</div>
									</span>
									<span slot="will_num2">
						                  发送客户情况
						                  <a-tooltip placement="top">
						                    <template slot="title">
						                      <span>客户已不是好友关系、客户接收已达上限及客户收到其他群发消息等其他原因，导致与预计人数不符</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
									<span slot="has_group" slot-scope="text, record,index">
										<div style="min-width: 105px;">已入群{{record.has_group}}人</div>
										<div>未入群{{record.no_group}}人</div>
									</span>
									<span slot="has_group2">
						                  客户入群情况
						                  <a-tooltip placement="top">
						                    <template slot="title">
						                      <span>不包括外部非联系人和已存在客户群中的客户</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
									<span slot="action" slot-scope="text, record">
										<a-button @click="detailList(record.id)"
										          style="margin: 0 5px 5px 0" v-has="'groupTags-info'">详情</a-button>
										<a-popconfirm
												title="确定删除吗?"
												@confirm="deleteList(record.id)"
												okText="确定"
												cancelText="取消"
										>
											<a-button v-has="'groupTags-delete'">删除</a-button>
										</a-popconfirm>
									</span>
								</a-table>

								<!--分页-->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0">
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
				<p v-if="user_ids.length == 0">向<span style="color: red;">{{will_num}}</span>位客户，发送入群邀请通知</p>
				<p v-else>
					向【{{user_ids[0].title}}】
					<template v-if="user_ids.length > 1">、【{{user_ids[1].title}}】</template>
					<template v-if="user_ids.length > 2">、【{{user_ids[2].title}}】</template>
					<template v-if="user_ids.length > 3">等{{getUserNum(user_ids)}}个成员、{{user_ids.length - getUserNum(user_ids)}}个部门</template>
					共计<span style="color: red;">{{will_num}}</span>位客户，发送入群邀请通知
				</p>
<!--				<p v-if="user_ids.length == 1">向【{{user_ids[0].name}}】成员共计<span style="color: red;">{{will_num}}</span>位客户，发送入群邀请通知-->
<!--				</p>-->
<!--				<p v-if="user_ids.length == 2">-->
<!--					向【{{user_ids[0].name}}】、【{{user_ids[1].name}}】成员共计<span style="color: red;">{{will_num}}</span>位客户，发送入群邀请通知-->
<!--				</p>-->
<!--				<p v-if="user_ids.length == 3">-->
<!--					向【{{user_ids[0].name}}】、【{{user_ids[1].name}}】、【{{user_ids[2].name}}】成员共计<span style="color: red;">{{will_num}}</span>位客户，发送入群邀请通知-->
<!--				</p>-->
<!--				<p v-if="user_ids.length > 3">-->
<!--					向【{{user_ids[0].name}}】、【{{user_ids[1].name}}】及【{{user_ids[2].name}}】等共计{{user_ids.length}}个成员<span-->
<!--						style="color: red;">{{will_num}}</span>位客户，发送入群邀请通知</p>-->
<!--				<p>-->
					<template v-if="others.sex != -1">
						<a-tag v-if="others.sex == 1" color="blue">男性</a-tag>
						<a-tag v-if="others.sex == 2" color="blue">女性</a-tag>
						<a-tag v-if="others.sex == 3" color="blue">未知性别</a-tag>
					</template>
					<template v-if="others.start_time != '' && others.end_time != ''">
						<a-tag color="blue">{{others.start_time}}至{{others.end_time}}加入</a-tag>
					</template>
					<template v-if="typeof others.update_time == 'object' && others.update_time.length != 0">
						<a-tag color="blue">{{others.update_time[0]}}至{{others.update_time[1]}}跟进</a-tag>
					</template>
					<template v-if="typeof others.chat_time == 'object' && others.chat_time.length != 0">
						<a-tag color="blue">上次{{others.chat_time[0]}}至{{others.chat_time[1]}}单聊</a-tag>
					</template>
					<a-tag v-if="others.follow_num1 != '' && others.follow_num2 != ''" color="blue">
						跟进次数在{{others.follow_num1}}至{{others.follow_num2}}次之间
					</a-tag>
					<a-tag v-if="others.follow_num1 != '' && others.follow_num2 == ''" color="blue">
						跟进次数高于{{others.follow_num1}}次
					</a-tag>
					<a-tag v-if="others.follow_num1 == '' && others.follow_num2 != ''" color="blue">
						跟进次数不低于{{others.follow_num1}}次
					</a-tag>
					<a-tag v-if="others.store_name != ''" color="blue">{{others.store_name}}</a-tag>
					<a-tag v-if="others.province != '' && others.city == ''" color="blue">
						{{others.province}}
					</a-tag>
					<a-tag v-if="others.province != '' && others.city != ''" color="blue">
						{{others.province}}{{others.city}}
					</a-tag>
					<template v-if="typeof others.attribute_data == 'object' && others.attribute_data.length != 0">
						<a-tag v-for="item in others.attribute_data" color="blue">{{item.value}}</a-tag>
					</template>
					<a-tag v-if="others.follow_num1 != '' && others.follow_num2 == ''" color="blue">跟进状态</a-tag>
					<template v-if="typeof others.tag_name == 'object' && others.tag_name.length != 0">
						<a-tag v-for="item in others.tag_name" color="blue">{{item}}</a-tag>
					</template>
				</p>
				<a-row class="single-accout-card">
					<a-col :span="6" class="single-accout-cardItem">
						<p class="single-accout-cardItem-num">{{invite_num}}</p>
						<p class="single-accout-cardItem-title">已邀请客户
							<a-tooltip placement="right">
								<template slot="title">
									<span>在预计发送客户中，已收到成员推送的入群二维码的客户数（同一客户添加多个员工，只计入1个成员推送）</span>
								</template>
								<a-icon type="question-circle" style="margin-left:5px;"/>
							</a-tooltip>
						</p>
					</a-col>
					<a-col :span="6" class="single-accout-cardItem">
						<p class="single-accout-cardItem-num">{{invite_not_num}}</p>
						<p class="single-accout-cardItem-title">未邀请客户
							<a-tooltip placement="right">
								<template slot="title">
									<span>在预计发送客户中，未收到成员推送的入群二维码的客户数</span>
								</template>
								<a-icon type="question-circle" style="margin-left:5px;"/>
							</a-tooltip>
						</p>
					</a-col>
					<a-col :span="6" class="single-accout-cardItem">
						<p class="single-accout-cardItem-num">{{has_num}}</p>
						<p class="single-accout-cardItem-title">已入群客户
							<a-tooltip placement="right">
								<template slot="title">
									<span>不包括外部非联系人和已存在客户群中的客户</span>
								</template>
								<a-icon type="question-circle" style="margin-left:5px;"/>
							</a-tooltip>
						</p>
					</a-col>
					<a-col :span="6" class="single-accout-cardItem">
						<p class="single-accout-cardItem-num">{{has_not_num}}</p>
						<p class="single-accout-cardItem-title">未入群客户</p>
					</a-col>
				</a-row>
				<a-tabs v-model="tabKey" style="margin: 20px 0 ;" @change="changeTabKey" type="card">
					<a-tab-pane :key="1" tab="群发记录">
						<div style="margin: 0 0 20px 0;">
							<div style="background-color: #FFFFFF;">
								<div style="height: 32px;line-height: 32px;margin-bottom: 10px;color: #000;">
									共
									<span style="color: blue">{{total2}}</span>个客户
								</div>
								<span class="select-option">
									<label style="margin-right: 5px;">搜索客户：</label>
									<a-input style="margin-right: 5px;width: 210px;"
									         @keyup.enter="getMassMessageRecord(1, pageSize2)"
									         placeholder="请输入要搜索的客户"
									         v-model="customName"/>
								</span>
								<span class="select-option" style="margin-left: 15px;">
									<label style="margin-right: 5px;">所属成员：</label>
									<a-button @click="showDepartmentList" style="width: 210px;margin-right: 5px;">
										<span v-if="chooseStaffNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
										<span v-else>选择成员</span>
									</a-button>
								</span>
								<span class="select-option" style="margin-left: 15px;">
									<label style="margin-right: 5px;">送达状态：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											placeholder="请选择送达状态"
											style="width: 210px;margin-right: 5px;"
											v-model="deliveryStatus"
									>
										<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="0">未收到邀请</a-select-option>
										<a-select-option :value="1">已收到邀请</a-select-option>
										<a-select-option :value="2">客户已不是好友</a-select-option>
										<a-select-option :value="3">未知原因导致失败</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">是否入群：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											placeholder="请选择"
											style="width: 210px;margin-right: 5px;"
											v-model="isJoin"
									>
										<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="0">未入群</a-select-option>
										<a-select-option :value="1">已入群</a-select-option>
									</a-select>
								</span>
								<a-button type="primary" style="margin-right: 5px;margin-left: 15px;"
								          @click="searchRecord">查找
								</a-button>
								<a-button style="margin-right: 10px;" @click="resetRecord">清空</a-button>
							</div>
						</div>

						<a-spin tip="Loading..." size="large" :spinning="isLoading2">
							<a-table :columns="columns2" :dataSource="massMessageRecordList" :pagination="false"
							         :rowClassName="rowClassName">
								<div slot="customer" slot-scope="text, record, index">
									<a-avatar v-if="record.avatar" shape="square" :size="42" :src="record.avatar"
									          style="float: left;"/>
									<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
									     src="../../../assets/useradvart.png"/>
									<div style="float: left;margin-left:10px;line-height: 42px;">
										<div style="height:42px;">
											<a-popover placement="top">
												<template slot="content">
													{{record.customer_name}}
													<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="record.corp_name != null">@{{record.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
												</template>
												<span style="display: inline-block; max-width: 180px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
														{{record.customer_name}}
														<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="record.corp_name != null">@{{record.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
													</span>
											</a-popover>
											<a-icon type="man"
											        style="color: #427EBA;vertical-align: top;margin-top: 14px;"
											        v-if="record.gender=='男性'"/>
											<a-icon
													type="woman"
													style="color: #ED4997;vertical-align: top;margin-top: 14px;"
													v-if="record.gender=='女性'"
											/>
										</div>
									</div>
								</div>
								<span slot="send" slot-scope="text, record, index">
								<span v-if="record.send == 0">未收到邀请</span>
								<span v-if="record.send == 1">已收到邀请</span>
								<span v-if="record.send == 2">客户已不是好友</span>
								<span v-if="record.send == 3">未知原因导致失败</span>
							</span>
								<span slot="title2" slot-scope="text, record,index">
											<a-tag style="padding: 3px;">
												<span style="background: #01b065;width: 18px;height:18px;display: inline-block;margin-right: 5px;vertical-align: middle;">
													<img :src="img" style="width: 14px;margin: 2px;"/>
												</span>
												<span style="width: 110px;display:inline-block;vertical-align: middle;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
													<a-popover trigger="hover">
														<span slot="content"
														      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
															{{record.title}}
														</span>
														<span style="color:#01b065; cursor: pointer;">{{record.title}}</span>
													</a-popover>
												</span>
											</a-tag>
									</span>
								<span slot="status" slot-scope="text, record,index">
											<span v-if="record.status == 0">未入群</span>
											<span v-if="record.status == 1">已入群</span>
									</span>
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
					<a-tab-pane :key="2" tab="成员邀请">
						<div style="margin: 0 0 20px 0;">
							<div style="background-color: #FFFFFF;">
								<div style="height: 32px;line-height: 32px;margin-bottom: 10px;color: #000;">
									共
									<span style="color: blue">{{total3}}</span>个成员
								</div>
								<span class="select-option">
									<label style="margin-right: 5px;">搜索成员：</label>
									<a-input style="margin-right: 5px;width: 210px;"
									         @keyup.enter="getStaffList(1, pageSize3)"
									         placeholder="请输入要搜索的成员"
									         v-model="staffName"></a-input>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">发送状态：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											placeholder="请选择发送状态"
											style="width: 210px;margin-right: 5px;"
											v-model="sendStatus"
									>
										<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="0">未发送</a-select-option>
										<a-select-option :value="1">已发送</a-select-option>
									</a-select>
								</span>
								<a-button type="primary" style="margin-right: 5px;"
								          @click="searchStaff">查找
								</a-button>
								<a-button style="margin-right: 10px;" @click="resetStaff">清空</a-button>
							</div>
						</div>
						<a-spin tip="Loading..." size="large" :spinning="isLoading3">
							<a-table :columns="columns3" :dataSource="staffList" :pagination="false"
							         :rowClassName="rowClassName">
								<div slot="name" slot-scope="text, record, index">
									<a-avatar v-if="record.avatar" shape="square" :size="42" :src="record.avatar"
									          style="float: left;"/>
									<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
									     src="../../../assets/useradvart.png"/>
									<div style="float: left;margin-left:10px;line-height: 42px;">
										{{text}}
									</div>
								</div>
								<span slot="real_num">
						                  实际发送客户
						                  <a-tooltip placement="top">
						                    <template slot="title">
						                      <span>客户已不是好友关系、客户接收已达上限及客户收到其他群发消息等其他原因，导致与预计人数不符</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
								<span slot="has_num">
						                  已入群客户
						                  <a-tooltip placement="top">
						                    <template slot="title">
						                      <span>不包括外部非联系人和已存在客户群中的客户</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
								<span slot="status" slot-scope="text, record, index">
								<span v-if="record.status == 0">未发送</span>
								<span v-if="record.status == 1">已发送</span>
							</span>
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
		<!--选择群聊弹窗-->
		<groupChat :show="chatVisible" :chatArr="chatArr" :callback="groupChatCallBack" :corpId="corpId"></groupChat>
		<!--部门选择框-->
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseStaffNum"
		                  :callback="modalVisibleChange"></chooseDepartment>
	</div>
</template>

<script>
	import img from '../../../assets/chat.png'
	import groupChat from "@/components/GroupChat.vue"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import {message} from "ant-design-vue";

	const columns = [
		{
			title      : '任务名称',
			dataIndex  : "title",
			key        : "title",
			scopedSlots: {customRender: 'title2'}
		},
		{
			// title      : '邀请成员客户',
			dataIndex  : "sender_name",
			key        : "sender_name",
			// width      : 300,
			scopedSlots: {customRender: 'sender_name'},
			slots      : {title: "sender_name2"},
		},
		{
			title      : '邀请入群',
			dataIndex  : "chat_name",
			key        : "chat_name",
			scopedSlots: {customRender: 'chat_name'}
		},
		{
			// title    : '发送客户情况',
			dataIndex  : "will_num",
			key        : "will_num",
			slots      : {title: "will_num2"},
			scopedSlots: {customRender: 'will_num'}
		},
		{
			// title    : '客户入群情况',
			dataIndex  : "has_group",
			key        : "has_group",
			slots      : {title: "has_group2"},
			scopedSlots: {customRender: 'has_group'}
		},
		{
			title    : '创建时间',
			dataIndex: "create_time",
			key      : "create_time",
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
			title      : '客户',
			dataIndex  : "customer",
			key        : "customer",
			width      : 300,
			scopedSlots: {customRender: 'customer'}
		},
		{
			title    : '所属成员',
			dataIndex: "name",
			key      : "name"
		},
		{
			title      : '送达状态',
			dataIndex  : "send",
			key        : "send",
			scopedSlots: {customRender: 'send'}
		},
		{
			title      : '邀请群聊',
			dataIndex  : "title",
			key        : "title",
			scopedSlots: {customRender: 'title2'}
		},
		{
			title      : '是否入群',
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: 'status'}
		},
		// {
		// 	title      : '操作',
		// 	dataIndex  : "action",
		// 	key        : 'action',
		// 	width      : 180,
		// 	scopedSlots: {customRender: 'action'},
		// },
	];
	const columns3 = [
		{
			title      : '成员',
			dataIndex  : "name",
			key        : "name",
			scopedSlots: {customRender: 'name'}
		},
		{
			title    : '预计发送客户',
			dataIndex: "will_num",
			key      : "will_num"
		},
		{
			// title    : '实际发送客户',
			dataIndex: "real_num",
			key      : "real_num",
			slots    : {title: "real_num"},
		},
		{
			// title    : '已入群客户',
			dataIndex: "has_num",
			key      : "has_num",
			slots    : {title: "has_num"},
		},
		{
			title      : '发送状态',
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: 'status'}
		},
	];

	export default {
		name      : "tagsCreateList",
		components: {groupChat, chooseDepartment},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				img,
				commonUrl            : this.$store.state.commonUrl, //公共的链接
				corpId               : corpId,
				corpInfo             : [], //企业微信列表
				title                : '',
				chooseNum            : 0,//已选择群聊数量
				chatArr              : [],//选择的群聊id数组
				chatVisible          : false,//群聊弹窗的显示与隐藏
				//表格部分
				columns,
				isLoading            : false,//加载的显示与隐藏
				groupList            : [],//群组列表
				//分页
				total                : 0, //总条数
				quickJumper          : false, // 是否显示快速跳转的控件
				page                 : 1, //页码
				pageSize             : 15, //每页数据条数
				//详情抽屉
				detailVisible        : false,//详情抽屉的显示与隐藏
				detailId             : '',//详情的任务id
				drawerTitle          : '',//标题
				user_ids             : [],//成员群发人员
				others               : {},//其他的筛选条件
				has_num              : 0,//已入群客户
				has_not_num          : 0,//未入群客户
				invite_num           : 0,//已邀请客户
				invite_not_num       : 0,//未邀请客户
				will_num             : 0,//预计发送人数
				tabKey               : 1,//tab切换
				//群发记录
				columns2,
				isLoading2           : false,//加载的显示与隐藏
				customName           : '',//搜索的客户姓名
				//所属客服
				showModalDepartment  : false, //成员选择框显示与隐藏
				chooseStaffNum       : 0,//已选择的部门成员总个数
				chooseUserNum        : 0,//成员个数
				chooseDepartmentNum  : 0,//部门个数
				checkedList          : [],//选择的成员id数组
				user                 : [],//选择的成员数据
				deliveryStatus       : -1,//送达状态
				isJoin               : -1,//是否入群
				massMessageRecordList: [],//群发记录表格数据
				//分页
				total2               : 0, //总条数
				quickJumper2         : false, // 是否显示快速跳转的控件
				page2                : 1, //页码
				pageSize2            : 15, //每页数据条数
				//成员邀请
				columns3,
				isLoading3           : false,//加载的显示与隐藏
				staffName            : '',//搜索的成员名称
				sendStatus           : -1,//发送状态
				staffList            : [],//成员邀请表格数据
				//分页
				total3               : 0, //总条数
				quickJumper3         : false, // 是否显示快速跳转的控件
				page3                : 1, //页码
				pageSize3            : 15, //每页数据条数
			};
		},

		methods: {
			getUserNum(userList) {
				let num = 0
				for(let i = 0; i < userList.length; i++) {
					if(userList[i].scopedSlots.title == "custom") {
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
			//选择群聊
			showChatVisible () {
				this.chatVisible = true
			},
			groupChatCallBack (event, num, arr) {
				if (event == "ok") {
					this.chooseNum = num
					this.chatArr = arr
				}
				this.chatVisible = false
			},
			//获取表格内容
			async getGroupList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("work-tag-pull-group/list", {
					corp_id : this.corpId,
					chat_id : this.chatArr,
					page    : page,
					pageSize: pageSize,
					title   : this.title
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.info;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			//删除
			async deleteList (id) {
				const {data: res} = await this.axios.post("work-tag-pull-group/delete", {
					id: id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.getGroupList(this.page, this.pageSize);
				}
			},
			// 筛选
			selectTitle () {
				this.getGroupList(1, this.pageSize);
			},
			clearTitle () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.title = ''
				this.chooseNum = 0
				this.chatArr = []
				this.getGroupList(this.page, this.pageSize);
			},
			//新建拉群
			create () {
				this.$router.push("/group/tagsCreateAdd")
			},
			//刷新
			refresh () {
				this.isLoading = true
				message.info("已进入后台刷新中，请耐心等待...", 2, this.refresh2)
			},
			async refresh2 () {
				const {data: res} = await this.axios.post("work-tag-pull-group/refresh-data", {
					corp_id: this.corpId
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg)
				} else {
					this.$message.destroy()
					this.getGroupList();
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getGroupList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 200)
				})
			},
			showSizeChange (page, pageSize) {
				this.getGroupList(1, pageSize);
			},
			// 群发记录分页
			changePage2 (page, pageSize) {
				this.getMassMessageRecord(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 200)
				})
			},
			showSizeChange2 (page, pageSize) {
				this.getMassMessageRecord(1, pageSize);
			},
			// 成员邀请分页
			changePage3 (page, pageSize) {
				this.getStaffList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 200)
				})
			},
			showSizeChange3 (page, pageSize) {
				this.getStaffList(1, pageSize);
			},
			//详情
			detailList (id) {
				this.detailId = id
				this.tabKey = 1
				this.customName = ''
				this.checkedList = []
				this.user = []
				this.chooseStaffNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.deliveryStatus = -1
				this.isJoin = -1
				this.page = 1
				this.pageSize2 = 15
				this.getDetailList()
				this.getMassMessageRecord()
			},
			async getDetailList () {
				const {data: res} = await this.axios.post("work-tag-pull-group/detail", {
					id: this.detailId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.drawerTitle = res.data.title
					this.user_ids = res.data.others.user_ids
					this.others = res.data.others
					this.will_num = res.data.will_num
					this.has_num = res.data.has_num
					this.has_not_num = res.data.has_not_num
					this.invite_num = res.data.invite_num
					this.invite_not_num = res.data.invite_not_num
				}
			},
			//群发记录表格
			async getMassMessageRecord (page = 1, pageSize = this.pageSize2) {
				this.isLoading2 = true
				const {data: res} = await this.axios.post("work-tag-pull-group/group-sending-records", {
					id      : this.detailId,
					corp_id : this.corpId,
					name    : this.customName,
					user_ids: this.checkedList,
					send    : this.deliveryStatus,
					status  : this.isJoin,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.massMessageRecordList = res.data.info
					this.total2 = parseInt(res.data.count);
					this.page2 = page;
					this.pageSize2 = pageSize;
					this.quickJumper2 = this.total2 > this.pageSize2;
					this.detailVisible = true
					this.isLoading2 = false
				}
			},
			detailDrawerClose () {
				this.detailVisible = false
			},
			//部门选择弹窗组件
			showDepartmentList () {
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
			},
			modalVisibleChange (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.checkedList = arr
					this.chooseStaffNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseStaffNum > 0) {
						this.user = list
					} else {
						this.user = []
					}
				}
				this.showModalDepartment = false
			},
			//查找群发记录
			searchRecord () {
				this.getMassMessageRecord()
			},
			resetRecord () {
				this.customName = ''
				this.checkedList = []
				this.user = []
				this.chooseStaffNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.deliveryStatus = -1
				this.isJoin = -1
				this.getMassMessageRecord()
			},
			//改变tab
			changeTabKey (e) {
				if (e == 1) {
					this.getMassMessageRecord()
				} else if (e == 2) {
					this.getStaffList()
				}
			},
			//成员邀请表格
			async getStaffList (page = 1, pageSize = this.pageSize3) {
				this.isLoading3 = true
				const {data: res} = await this.axios.post("work-tag-pull-group/members", {
					id       : this.detailId,
					user_name: this.staffName,
					status   : this.sendStatus,
					page     : page,
					pageSize : pageSize
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.staffList = res.data.info
					this.total3 = parseInt(res.data.count);
					this.page3 = page;
					this.pageSize3 = pageSize;
					this.quickJumper3 = this.total3 > this.pageSize3;
					this.isLoading3 = false
				}
			},
			//查找成员邀请
			searchStaff () {
				this.getStaffList()
			},
			resetStaff () {
				this.staffName = ''
				this.sendStatus = -1
				this.getStaffList()
			},
		},
		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.getGroupList()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/group/tagsCreateAdd' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来、返回回来
					vm.getGroupList(vm.page, vm.pageSize)
				});
			}
			if ((from.path == '/group/tagsCreateAdd' && typeof to.query.isRefresh == "undefined") || from.path != '/group/tagsCreateAdd') {
				next(vm => {
					vm.title = ''
					vm.chooseNum = 0
					vm.chatArr = []
					vm.page = 1
					vm.pageSize = 15
					vm.getGroupList();
				})
			}
			next()
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
