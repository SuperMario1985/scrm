<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider>
					<!-- 企业微信 -->
					<team ref="tagTeam" :callback="changeGroupId"></team>
				</a-layout-sider>
				<a-layout style="position: absolute;left:250px;top:0;bottom:0;right:0;" class="scroll">
					<!-- 头部 -->
					<a-layout-header>客户群管理</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							客户群，是由具有<span style="color: #FF562D;">客户群使用权限</span>的<span style="color: #FF562D;">成员</span>创建的外部群。成员在手机端创建群后，自动显示在后台列表中，群聊上限人数<span
								style="color: #FF562D;">200人</span>，包含成员+外部联系人。
						</div>
						<div style="margin: 10px 0;padding: 20px 0px 10px 0;background-color: #FFFFFF;">
							<span class="select-option">
								<label style="margin-right: 5px;">群名称：</label>
								<a-input @keyup.enter="getGroupChat(1, pageSize)"
								         style="width: 180px;margin-right: 5px;" placeholder="搜索群名称"
								         v-model="name"/>
							</span>
							<span class="select-option">
								<label style="margin-right: 5px;">选择群主：</label>
								<a-button @click="showDepartmentList" style="min-width: 170px;margin-right: 5px;">
									<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
									<span v-else>选择群主</span>
								</a-button>
							</span>
							<span class="select-option">
								<label style="margin-right: 5px;">群状态：</label>
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 160px;margin-right: 5px;"
										placeholder="全部"
										v-model="status"
								>
									<a-select-option :value="-1">全部
									</a-select-option>
									<a-select-option :value="0">正常
									</a-select-option>
									<a-select-option :value="1">跟进人离职
									</a-select-option>
									<a-select-option :value="2">离职继承中
									</a-select-option>
									<a-select-option :value="3">离职继承完成
									</a-select-option>
									<a-select-option :value="4">群已解散
									</a-select-option>
								</a-select>
							</span>
							<span class="select-option" style="display: block;">
								<label style="margin-right: 5px;">群创建时间：</label>
								<a-range-picker
										style="margin-right: 5px;width: 300px;"
										:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
										format="YYYY-MM-DD HH:mm"
										allowClear
										:disabled-date="disabledDate"
										v-model="joinTime"
								/>
								<a-button type="primary" style="margin: 0 10px 0 0;" @click="getGroupChat(1, pageSize)">
									查找
								</a-button>
								<a-button @click="clear">清空</a-button>
								<a-popconfirm
										placement="bottomRight"
										okText="确认"
										cancelText="取消"
										@confirm="syncConfirm"
								>
									<template slot="title">
										<p>确定同步吗？</p>
									</template>
								<a-button icon="reload" style="float: right;">
										同步群
									</a-button>
								</a-popconfirm>
							</span>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd" style="border: 1px solid #E2E2E2;">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="groupChatList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'groupList-list'">
									<span slot="noticeTitle">
										群公告
										<a-popover trigger="hover"
										           v-if="!spinning">
											<span slot="content"
											      style="display: inline-block;word-wrap: break-word;word-break: break-all;">
												手动更新公告
											</span>
											<a-icon style="color: #01b065;" type="redo" @click="updateNotice"/>
										</a-popover>
										<a-icon v-if="spinning" type="sync" style="color: #01b065;" spin/>
									</span>
									<span slot="checkedBox" slot-scope="text, record, index">
										<a-checkbox style="float: right"
										            v-model="checkBoxValue[index]"
										            @click="changeSelectKey(record.chat_id)"></a-checkbox>
					                </span>
									<span slot="name" slot-scope="text, record, index">
										<span style="background: #01b065;width: 36px;height:36px;margin-right: 5px;vertical-align: top;border-radius: 4px;float: left;"
										      v-if="record.avatarData.length == 0">
											<img :src="img"
											     style="width: 20px;margin: 8px;height: 20px;"/>
										</span>
										<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;border-radius: 4px;float: left;"
										      v-else-if="record.avatarData.length == 1">
											<img :src="record.avatarData[0]"
											     style="width: 36px;height:36px;"
											     v-if="record.avatarData[0] != ''"/>
											<img :src="img2" style="width: 36px;height:36px;"
											     v-if="record.avatarData[0] == ''"/>
										</span>
										<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
										      v-else-if="record.avatarData.length > 1 && record.avatarData.length <= 4">
											<template v-for="imgItem in record.avatarData">
												<img :src="imgItem"
												     style="width: 17px;height: 17px;" v-if="imgItem != ''"/>
												<img :src="img2" style="width: 17px;height: 17px;"
												     v-if="imgItem == ''"/>
											</template>
										</span>
										<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
										      v-else-if="record.avatarData.length > 4">
											<template v-for="imgItem in record.avatarData">
												<img :src="imgItem"
												     style="width: 10px;height: 10px;" v-if="imgItem != ''"/>
												<img :src="img2" style="width: 10px;height: 10px;"
												     v-if="imgItem == ''"/>
											</template>
										</span>
										<a-popover trigger="hover"
										           v-if="record.name">
											<span slot="content"
											      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
												{{record.name}}
											</span>
											<span style="display: inline-block; max-width: 120px; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
												{{record.name}}
											</span>
										</a-popover>
										<span v-if="!record.name">--</span>
										<span style="vertical-align: top;">（{{record.member_num}}）</span>
					                </span>
									<span slot="owner_name" slot-scope="text, record">
										<a-popover trigger="hover">
											<span slot="content"
											      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
												{{record.owner_name}}
											</span>
											<a-tag color="orange"
											       style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
												{{record.owner_name}}
											</a-tag>
										</a-popover>
					                </span>
									<span slot="new_member_num" slot-scope="text, record">
										{{record.new_member_num}}/{{record.leave_member_num}}
					                </span>
									<!--									<span slot="member_num" slot-scope="text, record">-->
									<!--										{{record.member_num}}/{{record.external_num}}-->
									<!--					                </span>-->
									<span slot="notice" slot-scope="text, record">
										<a-popover trigger="hover"
										           v-if="record.notice && record.notice != ''">
											<span slot="content"
											      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
												{{record.notice}}
											</span>
											<span v-if="record.notice && record.notice != ''"
											      style="color:#01b065; cursor: pointer;">预览</span>
										</a-popover>
										<span v-if="!record.notice || record.notice == ''">--</span>
					                </span>
									<span slot="action" slot-scope="text, record">
										<div style="display: inline-block">
											<a-button style="margin: 0 10px 10px 0;"
											          @click="groupDepartment(record.chat_id, record.name, record.owner_name)"
											          v-has="'groupList-look'">
												群成员
											</a-button>
										</div>
										<div style="display: inline-block">
											<a-button style="margin: 0 10px 10px 0;"
											          v-if="record.isAudit == 1"
											          @click="groupActiveDepartment(record.chatid, record.name, record.owner_name, record.chat_id)"
											          v-has="'groupList-look'">
												群活跃
											</a-button>
										</div>
										<div style="display: inline-block">
											<a-button style="margin: 0 10px 10px 0;"
											          @click="statistics(record.chat_id, record.name, record.owner_name)"
											          v-has="'groupList-single'">
												群统计
											</a-button>
										</div>
										<div style="display: inline-block">
											<a-button style="margin: 0 10px 10px 0;"
											          @click="groupDetail(record.chat_id)"
											          v-has="'groupList-info'">
												群详情
											</a-button>
										</div>
										<div style="display: inline-block">
											<a-button style="margin: 0 10px 10px 0;"
											          @click="moveGroupChat(record.chat_id, record.group_id)"
											          v-has="'groupList-remove'">
												移动分组
											</a-button>
										</div>
					                </span>
								</a-table>
								<!-- 分页 -->
								<div class="pagination" style="margin: 20px auto; height: 70px;" v-show="total > 0"
								     v-has="'groupList-list'">
									<div style="height: 32px;line-height: 32px;margin-bottom: 10px;padding-left: 10px;"
									     v-has="'groupList-list'">
										<a-checkbox v-model="batchTypeValue"
										            @click="batchTypeChange"></a-checkbox>
										<a-select optionFilterProp="children"
										          v-model="batchType"
										          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
											<a-select-option value="0">选择当前页</a-select-option>
											<a-select-option value="1">选择所有</a-select-option>
										</a-select>
										<a-button @click="batchMove" style="margin-right: 5px"
										          :disabled="selectedRowKeys.length == 0">
											<a-icon type="retweet"/>
											批量移动
										</a-button>
									</div>
									<div class="content-hd-left"
									     style="margin-left: 10px;float: left;line-height: 32px;">
										共有
										<span style="color: blue">{{total}}</span>个
									</div>
									<div style="float: right;">
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
		<a-modal title="选择分组" v-model="visibleGroup" @ok="handleGroupOk" @cancel="handleCancelTeam" width="888">
			<a-spin tip="Loading..." size="large" :spinning="handleLoading">
				<div style="height: 340px;">
					<a-select
							showSearch
							optionFilterProp="children"
							style="width: 200px;margin-bottom: 20px;margin-left: 5px;"
							@change="changeGroup"
							v-model="moveGroupId"
					>
						<template v-for="item in groupList">
							<a-select-option :value="item.id">
								{{item.group_name}}
							</a-select-option>
						</template>
					</a-select>
					<div style="height: 300px;" class="wxtpl">
						<template v-for="(item,index) in groupList" style="display: inline-block;">
							<template>
								<a-radio-group @change="changeGroup(item.id)" v-model="moveGroupId">
									<a-radio-button :value="item.id">
										<div>
											<span style="display: inline-block; width: 100%;margin-left: 5px; white-space:nowrap;text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow: hidden;vertical-align: middle;">{{item.group_name}}</span>
										</div>
									</a-radio-button>
								</a-radio-group>
							</template>
						</template>
					</div>
				</div>
			</a-spin>
		</a-modal>
		<a-drawer
				placement="right"
				:closable="false"
				@close="detailClose"
				:visible="groupMemberVisible"
				width="1000px!important"
		>
			<template slot="title">
				<a-popover placement="bottom">
					<template slot="content">
						<p style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
							{{chatName}}</p>
					</template>
					<span class="drawer-title">【{{chatName}}】</span>
					<template v-if="btnType == 1">群成员</template>
					<template v-if="btnType == 2">群活跃成员</template>
				</a-popover>

			</template>
			<div class="content-hd" style="padding: 0 10px;">
				<div class="content-hd-left">
					<a-select
							showSearch
							optionFilterProp="children"
							style="width: 200px;margin-right: 10px;"
							placeholder="成员状态"
							v-model="memberStatus"
					>
						<a-select-option :value="-1">成员状态
						</a-select-option>
						<a-select-option :value="1">正常
						</a-select-option>
						<a-select-option :value="0">退群
						</a-select-option>
					</a-select>
					<a-select
							allowClear
							show-search
							v-model="nickName"
							placeholder="搜索群成员"
							style="width: 223px; margin-right: 10px; margin-top: 8px;"
							:default-active-first-option="false"
							:show-arrow="true"
							:filter-option="false"
							:not-found-content="null"
							@search="handleChange1"
					>
						<a-select-option v-for="d in memberList" :key="d.nickname">
							{{d.nickname}}<span v-if="d.name">（{{d.name}}）</span>
						</a-select-option>
					</a-select>
					<!--					<a-select-->
					<!--							showSearch-->
					<!--							placeholder="搜索群成员"-->
					<!--							optionFilterProp="children"-->
					<!--							style="width: 223px; margin-right: 10px; margin-top: 8px;"-->
					<!--							@input="handleChange"-->
					<!--							:filterOption="filterOption" allowClear-->
					<!--					>-->
					<!--						<a-select-option v-for="d in memberList" :value="d.nick_name">{{d.nick_name}}（{{d.name}}）-->
					<!--						</a-select-option>-->
					<!--					</a-select>-->
					<a-range-picker
							style="margin-bottom: 10px;margin-right: 10px;width: 330px;"
							:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm' }"
							format="YYYY-MM-DD HH:mm"
							:allowClear="btnType == 1"
							:disabled-date="disabledDate"
							v-model="joinTime1"
					/>
					<a-button type="primary" style="margin: 0 10px 0 0;" @click="getMemberList(1, pageSize1)">
						查找
					</a-button>
					<a-button @click="clearSelect">清空</a-button>
				</div>
				<div v-if="btnType == 1" style="color: #F56C6C;line-height: 30px;">
					当前群成员：{{joinNum}}人；累计退群成员：{{leaveNum}}人
				</div>
			</div>

			<!-- 表格部分 -->
			<div class="content-bd" style="padding: 1px 10px;">
				<a-spin tip="Loading..." size="large" :spinning="isLoading1">
					<a-table :columns="isAudit == 1 ? memberColumns : memberColumns1" :dataSource="groupMemberList"
					         :pagination="false"
					         :rowClassName="rowClassName">
						<span slot="name" slot-scope="text, record">
							<div style="display: inline-block;vertical-align: top;">
								<img v-if="record.avatar" style="width: 42px; height: 42px;" :src="record.avatar">
								<img v-if="!record.avatar" style="width: 42px; height: 42px;"
								     src="../../../assets/useradvart.png">
							</div>
							<div style="display: inline-block; vertical-align: top;margin-left: 5px;">
								<a-popover placement="top">
									<span slot="content"
									      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
										{{record.name}}
										<span v-if="record.corp_name != '' && record.corp_name != '未知'"
										      :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
											<template v-if="record.corp_name != null">@{{record.corp_name}}</template>
											<template v-else>@微信</template>
										</span>
									</span>
									<p style="margin-bottom: 2px;display: inline-block;max-width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
										{{record.name}}
										<span v-if="record.corp_name != '' && record.corp_name != '未知'"
										      :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
											<template v-if="record.corp_name != null">@{{record.corp_name}}</template>
											<template v-else>@微信</template>
										</span></p>
									<a-icon type="man"
									        style="color: #427EBA;vertical-align: super;margin-left:3px;"
									        v-if="record.gender=='1'"/>
									<a-icon
											type="woman"
											style="color: #ED4997;vertical-align: super;margin-left: 3px;"
											v-if="record.gender=='2'"
									/>
								</a-popover>

								<p style="margin-bottom: 2px;">
									<a-tag :color="record.user_type == 0 ? 'blue' : (record.user_type == 1 ? 'orange' : (record.user_type == 2 ? 'pink' : 'green'))">{{record.type_name}}</a-tag>
								</p>
							</div>
						</span>
						<div slot="chat_name" slot-scope="text, record, index">
							<span v-if="text.length == 0">--</span>
							<a-popover
									placement="left"
									overlayClassName="other-chat">
								<template slot="content">
									<div style="max-height: 500px; overflow-y: auto;">
										<div v-for="(item,index) in text"
										     style="max-width: 500px;display: block;margin-bottom: 5px;">
											<span style="display: inline-block;font-weight: 700;width: 80px;text-align: right; vertical-align: top;">群{{index + 1}}：</span>
											<span style="width: calc(100% - 110px); display: inline-block; margin-bottom: 3px;word-break: break-all;">{{item.name}}（{{item.join_time}}）</span>
										</div>
									</div>
								</template>
								<span style="cursor: pointer;" v-if="text.length > 0">{{text.length}}个</span>
							</a-popover>
						</div>
					</a-table>
					<!-- 分页 -->
					<div class="pagination" style="margin: 0 auto; margin: 20px 0px 75px 00px; height: 32px;"
					     v-show="total1 > 0">
						<div class="content-hd-left" style="margin-left: 10px;float: left;">
							共有
							<span style="color: blue">{{total1}}</span>个
						</div>
						<div style="float: right;">
							<a-pagination :total="total1" showSizeChanger :showQuickJumper="quickJumper"
							              :current="page1"
							              :pageSize="pageSize1" :pageSizeOptions="['15','30','50','100']"
							              @change="changePage1"
							              @showSizeChange="showSizeChange1"/>
						</div>
					</div>
				</a-spin>
			</div>
		</a-drawer>
		<!--群详情抽屉-->
		<a-drawer
				placement="right"
				:closable="false"
				@close="groupDetailClose"
				:visible="detailVisible"
				width="1000px!important"
		>
			<template slot="title">
				群详情
			</template>
			<a-spin tip="Loading..." size="large" :spinning="isLoading2">
				<div class="content-hd"
				     style="margin: 10px;border: 1px solid #E2E2E2;width: auto;padding: 10px;line-height: inherit;">
					<span style="background: #01b065;width: 60px;height:60px;margin-right: 10px;vertical-align: top;border-radius: 4px;float: left;"
					      v-if="avatarData.length == 0">
						<img :src="img" style="width: 40px;margin: 10px;height: 40px;"/>
					</span>
					<span style="background: #DFDFDF;width: 60px;height:60px;margin-right: 10px;vertical-align: top;border-radius: 4px;float: left;"
					      v-else-if="avatarData.length == 1">
						<img :src="avatarData[0]" style="width: 60px;height:60px;"
						     v-if="avatarData[0] != ''"/>
						<img :src="img2" style="width: 60px;height:60px;"
						     v-if="avatarData[0] == ''"/>
					</span>
					<span style="background: #DFDFDF;width: 60px;height:60px;margin-right: 10px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
					      v-else-if="avatarData.length > 1 && avatarData.length <= 4">
						<template v-for="imgItem in avatarData">
							<img :src="imgItem" style="width: 29px;height: 29px;"
							     v-if="imgItem != ''"/>
							<img :src="img2" style="width: 29px;height: 29px;"
							     v-if="imgItem == ''"/>
						</template>
					</span>
					<span style="background: #DFDFDF;width: 60px;height:60px;margin-right: 10px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
					      v-else-if="avatarData.length > 4">
						<template v-for="imgItem in avatarData">
							<img :src="imgItem" style="width: 20px;height: 20px;"
							     v-if="imgItem != ''"/>
							<img :src="img2" style="width: 20px;height: 20px;"
							     v-if="imgItem == ''"/>
						</template>
					</span>
					<div style="display: inline-block;width: calc(100% - 70px);">
						<a-popover placement="bottom" v-if="detailChatName != ''">
							<template slot="content">
								<p style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
									{{detailChatName}}</p>
							</template>
							<div class="drawer-title" style="font-weight: 700;" v-if="detailChatName != ''">
								{{detailChatName}}
							</div>
							<a-tag color="#67c23a"
							       style="float: right;margin-right: 0;height: 25px;line-height: 25px;"
							       v-if="followTitle && detailChatName != ''">{{followTitle}}<span
									v-if="is_follow_del == 1">（已删除）</span>
							</a-tag>
						</a-popover>
						<div class="drawer-title" style="font-weight: 700;" v-if="detailChatName == ''">群已解散</div>
						<a-tag color="#67c23a"
						       style="float: right;margin-right: 0;height: 25px;line-height: 25px;"
						       v-if="followTitle && detailChatName == ''">{{followTitle}}<span
								v-if="is_follow_del == 1">（已删除）</span>
						</a-tag>
						<div class="col">
								<span>
									<label>标签：</label>
									<span style="display: inline-block;width: calc(100% - 110px);vertical-align: text-top;">
										<a-tag v-for="item in hasTagsValue" color="blue" style="margin-bottom: 5px;"
										       v-if="hasTagsValue && hasTagsValue.length > 0">{{item}}</a-tag>
										<span v-if="hasTagsValue.length == 0">暂无</span>
										<a-icon @click="showModal" type="edit" style="margin-left: 5px;"
										        v-if="chatStatus != 4 && isShowTag"/>
									</span>
								</span>
						</div>
						<a-popover placement="bottom">
							<template slot="content">
								<p style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
									{{groupNotice}}</p>
							</template>
							<div v-if="groupNotice && groupNotice != ''"
							     style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;cursor: pointer;">
								群公告：{{groupNotice}}
							</div>
						</a-popover>
						<div v-if="!groupNotice || groupNotice == ''">群公告：暂无</div>
					</div>
				</div>
				<div class="custom-info-box">
					<div class="box">
						<p class="box-first">群成员总数</p>
						<p class="box-second">{{all_sum}}</p>
					</div>
					<div class="box">
						<p class="box-first">企业成员总数</p>
						<p class="box-second">{{user_sum}}</p>
					</div>
					<div class="box">
						<p class="box-first">外部联系人总数</p>
						<p class="box-second">{{external_sum}}</p>
					</div>
					<div class="box">
						<p class="box-first">外部非联系人总数</p>
						<p class="box-second">{{no_external_sum}}</p>
					</div>
				</div>
				<!-- 表格部分 -->
				<div class="content-bd" style="padding: 1px 10px;">
					<a-tabs v-model="tabKey" type="card" @change="changeTab">
						<a-tab-pane tab="跟进记录" key="1">
							<div class="time">
								<div v-if="chatStatus != 4" v-has="'groupList-addFollow'">
									<div style="margin: 20px 0;">
										跟进状态：
										<a-select style="width: 220px" v-model="follow_id">
											<a-select-option v-for="item in follows" :value="item.id">
												{{item.title}}
											</a-select-option>
										</a-select>
									</div>
									<div class="textArea">
										<a-textarea
												v-model="msg"
												@change="changeTextarea"
												placeholder="添加跟进记录，1000字以内"
												:autoSize="{ minRows: 5, maxRows: 5 }"
												:maxLength="1000"
										/>
										<div style="text-align: right;margin-top: 10px;">{{msg.length}}/1000
										</div>
									</div>
									<div class="textArea-btn">
										<a-upload
												class="upload-file"
												action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
												listType="picture-card"
												@preview="handlePreview"
												:beforeUpload="beforeUpload"
												@change="e => changeMsg(e)"
												:fileList="imageUrl"
										>
											<div v-if="imageUrl.length < 9">
												<a-button>
													<a-icon type="link"/>
													附件 {{imgNum}}/9
												</a-button>
											</div>
										</a-upload>
										<a-modal :visible="previewVisible" :footer="null"
										         @cancel="closePreview">
											<img alt="example" style="width: 100%" :src="previewImage"/>
										</a-modal>

										<a-button type="primary" style="left: 50%;width: 110px;"
										          :disabled="submitDisabled"
										          @click="submitFollowRecord">
											提交
										</a-button>
									</div>
								</div>

								<a-timeline class="time-line">
									<a-timeline-item v-for="item in followRecord">
										<div class="time-line-time">{{item.time}}</div>
										<img slot="dot" src="../../../assets/icon/8.png"
										     style="width: 18px;"/>
										<div style="margin: 10px 0;"><span
												style="color: #1989FA;">{{item.name}}</span> 发表：
											<span style="color: red;" v-if="item.follow_status != ''">【{{item.follow_status}}】</span>
											<span style="float:right;"><a-icon type="edit"
											                                   v-if="item.can_edit == 1"
											                                   @click="editFollowRecord(item)"/></span>
										</div>
										<div class="time-line-title">
											{{item.record}}
											<div v-if="item.file.length > 0"
											     style="margin-top: 5px;overflow: hidden;">
												<div v-for="url in item.file" class="preview-box">
													<div class="preview-cover">
														<img :src="commonUrl + url" alt="">
													</div>
													<span class="preview-cover-icon"
													      @click="previewHasImg(commonUrl + url)"><a-icon
															type="eye"/></span>
												</div>
											</div>
										</div>
									</a-timeline-item>
								</a-timeline>
								<!--分页 -->
								<div class="pagination"
								     style="margin: 20px 0;box-sizing: border-box;overflow: hidden;"
								     v-show="total2 > 0">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total2}}</span>条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total2" showSizeChanger
										              :showQuickJumper="quickJumper2"
										              :current="page2"
										              :pageSize="pageSize2"
										              :pageSizeOptions="['15','30','50','100']"
										              @change="changePage2"
										              @showSizeChange="showSizeChange2"/>
									</div>
								</div>

								<a-empty v-if="chatStatus == 4 && total2 == 0"/>

								<!--修改弹窗-->
								<a-modal title="修改跟进记录" v-model="editVisible" @ok="submitFollowRecord"
								         @cancel="cancelFollowRecord" width="800px">
									<div style="margin: 20px 0;">
										跟进状态：
										<a-select style="width: 220px"
										          v-model="followStatus">
											<a-select-option v-for="item in follows" :value="item.id">
												{{item.title}}
											</a-select-option>
										</a-select>
									</div>
									<div class="textArea">
										<a-textarea
												v-model="msg2"
												placeholder="添加跟进记录，1000字以内"
												:autoSize="{ minRows: 5, maxRows: 5 }"
												:maxLength="1000"
										/>
										<div style="text-align: right;margin-top: 10px;">{{msg2.length}}/1000
										</div>
									</div>
									<div class="textArea-btn">
										<a-upload
												class="upload-file"
												action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
												listType="picture-card"
												@preview="handlePreview2"
												:beforeUpload="beforeUpload2"
												@change="e => changeMsg2(e)"
												:fileList="imageUrl2"
										>
											<div v-if="imageUrl2.length < 9">
												<a-button>
													<a-icon type="link"/>
													附件 {{imgNum2}}/9
												</a-button>
											</div>
										</a-upload>
										<a-modal :visible="previewVisible2" :footer="null"
										         @cancel="handleCancel2">
											<img alt="example" style="width: 100%" :src="previewImage2"/>
										</a-modal>
									</div>
								</a-modal>
							</div>
						</a-tab-pane>
						<a-tab-pane tab="互动轨迹" key="2">
							<a-timeline class="time-line" style="margin: 20px;">
								<a-timeline-item v-for="item in interactList">
									<img v-if="item.icon==1" slot="dot" src="../../../assets/icon/1.png"
									     style="width: 22px;"/>
									<img v-if="item.icon==2" slot="dot" src="../../../assets/icon/2.png"
									     style="width: 22px;"/>
									<img v-if="item.icon==10" slot="dot" src="../../../assets/icon/10.png"
									     style="width: 18px;"/>
									<img v-if="item.icon==11" slot="dot" src="../../../assets/icon/11.png"
									     style="width: 18px;"/>
									<img v-if="item.icon==13" slot="dot" src="../../../assets/icon/13.png"
									     style="width: 24px;"/>
									<img v-if="item.icon==14" slot="dot" src="../../../assets/icon/14.png"
									     style="width: 18px;"/>
									<img v-if="item.icon==15" slot="dot" src="../../../assets/icon/15.png"
									     style="width: 20px;"/>
									<img v-if="item.icon==16" slot="dot" src="../../../assets/icon/16.png"
									     style="width: 22px;"/>
									<img v-if="item.icon==17" slot="dot" src="../../../assets/icon/17.png"
									     style="width: 22px;"/>
									<img v-if="item.icon==18" slot="dot" src="../../../assets/icon/18.png"
									     style="width: 18px;"/>
									<a-icon type="pay-circle" slot="dot" v-if="item.icon==19"/>
									<div style="min-height: 40px;">
										<div class="time-line-time">{{item.event_time}}</div>
										<!--										<div class="time-line-title" v-html="item.content"></div>-->
										<pre class="time-line-title follow-content">{{item.content}}</pre>
										<!--{{item.content}}-->
									</div>
								</a-timeline-item>
							</a-timeline>
							<div style="text-align: center;">
								<a-button type="primary" v-if="btnFlag==1" @click="loadMore">加载更多</a-button>
								<span type="primary" v-if="btnFlag==2">没有更多数据了</span>
							</div>
						</a-tab-pane>
						<a-tab-pane tab="群画像" key="3">
							<div style="overflow:hidden;margin-bottom: 10px;" v-has="'groupList-editInfo'">
								<div style="float:right;">
									<a-button type="primary" @click="editBadicInfo" v-if="!badicInfoVisible">编辑
									</a-button>
									<a-button @click="cancleBadicInfo" v-if="badicInfoVisible"
									          style="margin-right: 15px;">取消
									</a-button>
									<a-button type="primary" @click="submitBadicInfo" v-if="badicInfoVisible">提交
									</a-button>
								</div>
							</div>
							<div>
								<div class="half" v-for="(item, index) in field_list"
								     v-if="item.key == 'phone' && is_hide_phone != 1 || item.key != 'phone'">
									<a-tag color="#01b065">{{item.title}}</a-tag>
									<span class="half-text"
									      v-if="!badicInfoVisible && item.value != '' && item.type != 8 && item.key != 'phone' && item.key != 'company'">{{item.value}}</span>
									<span class="half-text"
									      v-if="!badicInfoVisible && item.key == 'phone'">
												<span v-if="phone != ''">{{phone}}</span>
												<span v-if="phone == ''">暂无</span>
											</span>
									<span class="half-text"
									      v-if="!badicInfoVisible && item.key == 'company'">
												<span v-if="company != ''">{{company}}</span>
												<span v-if="company == ''">暂无</span>
											</span>
									<span class="half-text"
									      v-if="!badicInfoVisible && item.value.length != 0 && item.type == 8">
												<img v-for="item1 in item.value" @click="preview(commonUrl + item1.url)"
												     :src="commonUrl + item1.url"
												     style="max-width: 70px; max-height: 70px;margin: 2px;line-height: 0px;cursor: pointer;">
											</span>
									<span class="half-text"
									      v-if="!badicInfoVisible && (item.value == '' || item.value.length == 0) && item.key != 'phone' && item.key != 'company'">暂无</span>
									<template v-if="badicInfoVisible">
										<!--单选-->
										<a-select :defaultValue="item.hasOption"
										          style="width: 35%;float: right;margin-top:4px;"
										          @change="e => handleChange(e,item.fieldid)"
										          v-if="item.type == 2" :placeholder="'请选择'+item.title"
										          allowClear>
											<a-select-option :value="option" v-for="option in item.optionVal2">
												{{option}}
											</a-select-option>
										</a-select>
										<!--多选-->
										<a-select
												mode="multiple"
												:defaultValue="item.hasOption"
												style="width: 35%;float: right;margin-top:4px;"
												@change="e => handleChange2(e,item.fieldid)"
												v-if="item.type == 3" :placeholder="'请选择'+item.title"
										>
											<a-select-option :value="option" v-for="option in item.optionVal2">
												{{option}}
											</a-select-option>
										</a-select>
										<!--图片-->
										<span v-if="item.type == 8" class="clearfix"
										      style="width: 40%;float: right;margin-top:4px;line-height: 0px;">
													<a-upload
															class="upload-pic"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															list-type="picture-card"
															:fileList="item.picUrl || []"
															@preview="handlePreview"
															:beforeUpload="beforeUploadPic"
															@change="e => handleChangePic(e, index)"
													>
														<div>
															<a-icon type="plus"/>
															<div class="ant-upload-text" style="font-size: 12px;">
																上传图片
															</div>
														</div>
													</a-upload>
												</span>
										<!--输入框-->
										<a-input
												v-if="item.type != 2 && item.type != 3 && item.type != 7 && item.type != 4 && item.type != 8 && item.key != 'phone' && item.key != 'company'"
												style="width: 35%;float: right;margin-top: 4px;"
												:defaultValue="item.value"
												@change="e => changeInput(e.target.value,item.fieldid)"
												:placeholder="'请输入'+item.title"/>
										<!--手机号-->
										<a-input
												v-if="item.type != 2 && item.type != 3 && item.type != 7 && item.type != 4 && item.type != 8 && item.key == 'phone'"
												style="width: 35%;float: right;margin-top: 4px;"
												:defaultValue="phone2"
												@change="e => changeSpecialInput(e.target.value,item.key)"
												placeholder="请输入手机号"/>
										<!--公司-->
										<a-input
												v-if="item.type != 2 && item.type != 3 && item.type != 7 && item.type != 4 && item.type != 8 && item.key == 'company'"
												style="width: 35%;float: right;margin-top: 4px;"
												:defaultValue="company2"
												@change="e => changeSpecialInput(e.target.value,item.key)"
												placeholder="请输入公司"/>
										<!--地区-->
										<a-cascader v-if="item.type == 7"
										            :options="cityData"
										            :defaultValue="item.provice"
										            @change="e => changeArea(e,item.fieldid)"
										            :placeholder="'请选择'+item.title"
										            style="width: 35%;float: right;margin-top: 4px;"
										/>
										<!--日期-->
										<template v-if="item.type == 4">
											<a-date-picker v-if="item.data == ''"
											               style="width: 35%;float: right;margin-top: 4px;"
											               :placeholder="'请选择'+item.title"
											               @change="e => selectDate(e,item.fieldid)"
											               :allowClear="false"/>
											<a-date-picker v-if="item.data != ''"
											               style="width: 35%;float: right;margin-top: 4px;"
											               :placeholder="'请选择'+item.title"
											               @change="e => selectDate(e,item.fieldid)"
											               :defaultValue="moment(item.data)"
											               :allowClear="false"/>
										</template>
									</template>
								</div>
							</div>
						</a-tab-pane>
					</a-tabs>
				</div>
			</a-spin>
		</a-drawer>
		<!--部门选择框-->
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum"
		                  :callback="modalVisibleChange3" :is_special="1"></chooseDepartment>
		<!--	打标签   -->
		<a-modal title="打标签" v-model="visible" @ok="handleOk"
		         :confirmLoading="confirmLoading2" @cancel="cancelVisible" width="800px">
			<corpChooseTag :callback="modalVisibleChange4" :hasChoose="tagCheckValue"></corpChooseTag>
		</a-modal>

		<!--图片预览-->
		<a-modal :visible="previewVisible" :footer="null"
		         @cancel="handleCancel">
			<img alt="example" style="width: 100%" :src="previewImage"/>
		</a-modal>
	</div>
</template>

<script>
	import moment from "moment";
	import team from '../../../components/eWeChat/team'
	import img from '../../../assets/chat.png'
	import img2 from '../../../assets/useradvart.png'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import TemplateList from "../template/List";
	import {message} from "ant-design-vue";
	import cityData from "../../../common/js/citydata2.js";
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"

	const columns = [
		{
			title      : "",
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			scopedSlots: {customRender: "checkedBox"}
		},
		{
			title      : "群名称（人数）",
			dataIndex  : "name",
			key        : "name",
			width      : '240px',
			scopedSlots: {customRender: "name"}
		},
		{
			title      : "群主",
			dataIndex  : "owner_name",
			key        : "owner_name",
			scopedSlots: {customRender: "owner_name"}
		},
		{
			title    : "所属分组",
			dataIndex: "group_name",
			key      : "group_name",
			width    : '180px'
		},
		{
			title    : "状态",
			dataIndex: "status",
			key      : "status",
		},
		// {
		// 	title      : "群人数/外部联系人",
		// 	dataIndex  : "member_num",
		// 	key        : "member_num",
		// 	scopedSlots: {customRender: "member_num"}
		// },
		{
			title      : "今日入群/退群",
			dataIndex  : "new_member_num",
			key        : "new_member_num",
			scopedSlots: {customRender: "new_member_num"}
		},
		{
			dataIndex  : "notice",
			key        : "notice",
			scopedSlots: {customRender: "notice", title: "noticeTitle"}
		},
		{
			title    : "创群时间",
			dataIndex: "create_time",
			key      : "create_time",
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '220px',
			scopedSlots: {customRender: "action"}
		}
	];
	const memberColumns = [
		{
			title      : "群成员",
			dataIndex  : "name",
			key        : "name",
			width      : '300px',
			scopedSlots: {customRender: "name"}
		},
		{
			title    : "入群时间",
			dataIndex: "join_time",
			key      : "join_time"
		},
		{
			title    : "发言条数",
			dataIndex: "audit_num",
			key      : "audit_num"
		},
		{
			title      : "所在其他群数",
			dataIndex  : "chat_name",
			key        : "chat_name",
			scopedSlots: {customRender: "chat_name"}
		},
		{
			title    : "退群时间",
			dataIndex: "leave_time",
			key      : "leave_time"
		},
		{
			title    : "入群方式",
			dataIndex: "join_scene",
			key      : "join_scene"
		},
	];
	const memberColumns1 = [
		{
			title      : "群成员",
			dataIndex  : "name",
			key        : "name",
			width      : '300px',
			scopedSlots: {customRender: "name"}
		},
		{
			title    : "入群时间",
			dataIndex: "join_time",
			key      : "join_time"
		},
		{
			title      : "所在其他群数",
			dataIndex  : "chat_name",
			key        : "chat_name",
			scopedSlots: {customRender: "chat_name"}
		},
		{
			title    : "退群时间",
			dataIndex: "leave_time",
			key      : "leave_time"
		},
		{
			title    : "入群方式",
			dataIndex: "join_scene",
			key      : "join_scene"
		},
	]

	function getBase64 (file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			// reader.onerror = error => reject(error);
		});
	}

	export default {
		name      : 'groupList',
		components: {
			TemplateList,
			team,
			chooseDepartment,
			corpChooseTag
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				img,
				img2,
				commonUrl          : this.$store.state.commonUrl,//公共的链接
				is_hide_phone      : 0,
				isLoading          : false,  // 页面加载
				isLoading1         : false,  // 群成员表格加载
				batchType          : '1',     // 0当前页 1所有
				batchTypeValue     : false, // 当前页/所有 是否选中
				checkBoxValue      : [], // 多选框状态
				groupKeys          : [], // 所有的群id
				selectedRowKeys    : [], // 选择多少条
				suite_id           : '',
				corpId             : corpId,
				groupId            : [], // 分组id
				status             : -1, // 群状态
				name               : '', // 群名称
				chooseNum          : 0, // 部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				showModalDepartment: false, // 选择群主弹窗显示/隐藏
				userId             : [], //  群主id
				user               : [],//群主数据
				joinTime           : null, // 加入时间
				total              : 0,
				page               : 1,
				pageSize           : 15,
				quickJumper        : false,
				columns,
				groupChatList      : [],    // 群聊列表
				spinning           : false, // 更新加载动画
				handleLoading      : false, // 移动分组加载
				visibleGroup       : false, // 分组弹窗显示/隐藏
				groupChatId        : '',    // 移动分组选中的群id
				groupList          : [],    // 分组列表
				moveGroupId        : [],    // 移动的分组
				btnType            : 1,     // 1群成员 2群活跃 抽屉式弹窗
				chatId             : '',    // 群成员群id
				chatid             : 0,
				chatName           : '',    // 群成员群名称
				ownerName          : '',    // 群成员群主名称
				groupMemberVisible : false, // 群成员弹窗显示/隐藏
				joinTime1          : null,  // 群成员加入时间
				memberStatus       : [],    // 群成员状态
				nickName           : [],    // 群成员昵称
				memberList         : [],    // 搜索群成员下拉框搜索结果
				groupMemberList    : [],   // 群成员列表
				isAudit            : 0,    // 是否开通会话存档
				memberColumns,
				memberColumns1,
				joinNum            : 0, // 当前群成员数量
				leaveNum           : 0, // 累计退群数量
				total1             : 0,
				page1              : 1,
				pageSize1          : 15,
				//群详情抽屉
				detailVisible      : false,//群详情抽屉的显示与隐藏
				isLoading2         : false,
				detailChatName     : '',//群名称
				avatarData         : [],//群头像
				detailChatId       : '',//群id
				followTitle        : '',//跟进状态
				groupNotice        : '',//群公告
				all_sum            : '',//群成员总数
				user_sum           : '',//企业成员总数
				external_sum       : '',//外部联系人总数
				no_external_sum    : '',//外部非联系人总数
				is_follow_del      : '',//当前跟进状态是否为已删除，1是
				btnFlag            : 1,//1加载更多，2没有更多数据
				follow_id          : '',//展示的跟进状态
				follows            : [],
				tabKey             : '1',
				chatStatus         : 0,//群状态，4是已解散
				submitDisabled     : true,//提交按钮的置灰
				record_id          : '',//选择编辑的记录id
				//分页
				total2             : 0,
				page2              : 1,
				pageSize2          : 15,
				quickJumper2       : false,
				//修改跟进记录弹窗
				editVisible        : false,//修改跟进记录弹窗的显示与隐藏
				imageUrl2          : [],//上传的图片文件类型
				file2              : [],//上传的图片链接地址
				imgNum2            : 0,//上传的图片的数量
				msg2               : '',//跟进记录输入框内容
				previewVisible2    : false,//预览图片弹窗显示与隐藏
				previewImage2      : '',//预览的图片链接
				isImg2             : true,//上传图片符不符合规则
				submitDisabled2    : true,//提交按钮的置灰
				followStatus       : [],//跟进状态
				followStatus2      : [],//跟进状态
				//打标签
				visible            : false,
				confirmLoading2    : false,//打标签对话框的确认按钮加载
				hasTags            : [],//在别的地方打的已有的标签id
				hasTagsValue       : [],//在别的地方打的已有的标签名称
				tagCheckValue      : [],//该客户已有标签
				//互动轨迹
				interactList       : [],//互动轨迹数据列表
				field_list         : [],
				fieldData          : [],//编辑基础信息参数
				badicInfoVisible   : false,//基础信息是否编辑状态
				projectList        : [],//项目列表
				// 地域
				cityData,
				//跟进记录
				followRecord       : [],//跟进记录数据
				imageUrl           : [],//上传的图片文件类型
				file               : [],//上传的图片链接地址
				imgNum             : 0,//上传的图片的数量
				msg                : '',//跟进记录输入框内容
				previewVisible     : false,//预览图片弹窗显示与隐藏
				previewImage       : '',//预览的图片链接
				isImg              : true,//上传图片符不符合规则
				phone              : '',//手机号
				phone2             : '',//暂存的手机号，方便取消时赋值
				company            : '',//公司
				company2           : '',//暂存的公司，方便取消时赋值
				area               : '',//地区
				isShowTag          : true,//根据权限判断是否展示打标签或移除标签
			};
		},

		methods: {
			// 卡片选择
			changeSelectKey (chatId) {
				for (let i = 0; i < this.selectedRowKeys.length; i++) {
					if (chatId == this.selectedRowKeys[i]) {
						this.selectedRowKeys.splice(i, 1)
						this.setCheckedBox(this.groupChatList)
						return false
					}
				}
				this.selectedRowKeys.push(chatId)
				this.setCheckedBox(this.groupChatList)
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					// 添加
					if (this.batchType == 0) {
						this.addKey(this.groupChatList)
						this.setCheckedBox(this.groupChatList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = [...this.groupKeys.valueOf()]
						this.setCheckedBox(this.groupChatList)
					}
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						this.removeKey(this.groupChatList)
						this.setCheckedBox(this.groupChatList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
						this.setCheckedBox(this.groupChatList)
					}
					this.batchTypeValue = false
				}
			},
			// 设置列表卡片多选框选中状态
			setCheckedBox (groupChatList) {
				this.checkBoxValue = new Array(groupChatList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < groupChatList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (groupChatList[i].chat_id == this.selectedRowKeys[j]) {
							this.checkBoxValue[i] = true
						}
					}
				}
				if (this.batchType == 0) {
					this.batchTypeValue = true
					this.checkBoxValue.map(item => {
						if (!item) {
							this.batchTypeValue = false
						}
					})
				} else {
					if (this.selectedRowKeys.length == this.groupKeys.length) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}


			},
			// 当前/所有 类型选择框变化
			changeBatchType () {
				if (this.batchTypeValue) {
					if (this.batchType == 0) {
						this.selectedRowKeys = []
					}
					this.batchTypeValue = false
					this.batchTypeChange()
				} else {
					this.setCheckedBox(this.groupChatList)
				}
			},
			// 增加当前页key
			addKey (groupChatList) {
				for (let i = 0; i < groupChatList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === groupChatList[i].chat_id);
					if (index == -1) {
						this.selectedRowKeys.push(groupChatList[i].chat_id)
					}
				}
			},
			// 删除当前页key
			removeKey (groupChatList) {
				for (let i = 0; i < groupChatList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === groupChatList[i].chat_id);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			// 移动分组确认
			handleGroupOk () {
				this.handleLoading = true
				this.moveGroupIds()
			},
			// 取消移动分组
			handleCancelTeam () {
				this.handleLoading = false
				this.visibleGroup = false
			},
			// 群成员弹窗
			groupDepartment (id, name, ownerName) {
				this.btnType = 1
				this.chatId = id
				this.chatName = name
				this.ownerName = ownerName
				this.clearSelect()
				this.groupMemberVisible = true
			},
			groupActiveDepartment (id, name, ownerName, chatid) {
				this.btnType = 2
				this.chatId = id
				this.chatid = chatid
				this.chatName = name
				this.ownerName = ownerName
				this.clearSelect()
				this.groupMemberVisible = true
			},
			// 群统计
			statistics (id, name, ownerName) {
				let query = {
					id   : id,
					title: encodeURIComponent(name + '：' + ownerName),
				}
				this.$router.push({path: '/group/statistics', query: query})
			},
			// 获取群成员列表
			async getMemberList (page = 1, pageSize = this.pageSize1) {
				this.isLoading1 = true
				let url = "work-chat/chat-info-list"
				let params = {
					corp_id  : this.corpId,
					chat_id  : this.chatId,
					status   : this.memberStatus.length == 0 ? '-1' : this.memberStatus,
					name     : this.nickName || this.nickName == 0 ? (this.nickName.length == 0 ? '' : this.nickName) : '',
					stime    : this.joinTime1 == null ? '' : (this.joinTime1.length > 0 ? moment(this.joinTime1[0]).format('YYYY-MM-DD HH:mm') : ''),
					etime    : this.joinTime1 == null ? '' : (this.joinTime1.length > 1 ? moment(this.joinTime1[1]).format('YYYY-MM-DD HH:mm') : ''),
					page     : page,
					page_size: pageSize
				}
				if (this.btnType == 2) {
					url = 'wap-user-desktop/chat-info-audit'
					params = {
						chat_id  : this.chatId,
						corp_id  : this.corpId,
						stime    : this.joinTime1 == null ? '' : (this.joinTime1.length > 0 ? moment(this.joinTime1[0]).format('YYYY-MM-DD HH:mm') : ''),
						etime    : this.joinTime1 == null ? '' : (this.joinTime1.length > 1 ? moment(this.joinTime1[1]).format('YYYY-MM-DD HH:mm') : ''),
						sort     : this.sort,
						name     : this.name,
						page     : page,
						page_size: 15,
					}
				}
				const {data: res} = await this.axios.post(url, params);
				if (res.error != 0) {
					this.handleLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading1 = false
					this.groupMemberList = res.data.list
					this.isAudit = res.data.isAudit
					this.total1 = parseInt(res.data.count)
					this.page1 = page
					this.pageSize1 = pageSize
					if (this.page1 == 1) {
						this.joinNum = res.data.join_num
						this.leaveNum = res.data.leave_num
					}
				}
			},
			// 群成员清除筛选条件
			clearSelect () {
				let year = new Date().getFullYear();
				let month =
					new Date().getMonth() + 1 < 10
						? "0" + (new Date().getMonth() + 1)
						: new Date().getMonth() + 1;
				let date =
					new Date().getDate() < 10
						? "0" + new Date().getDate()
						: new Date().getDate();
				this.joinTime1 = null
				if (this.btnType == 2) {
					let year = new Date().getFullYear();
					let month = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
					let day = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
					let date = year + '-' + month + '-' + day
					this.joinTime1 = [moment(date + ' 00:00', 'YYYY-MM-DD HH:mm'), moment(date + ' 23:59', 'YYYY-MM-DD HH:mm')]
				}
				this.memberStatus = []
				this.nickName = []
				this.getMemberList()
			},
			// 群成员弹窗关闭
			detailClose () {
				this.memberList = []
				this.groupMemberList = []
				this.joinTime1 = null
				this.memberStatus = []
				this.nickName = []
				this.total1 = 0
				this.page1 = 1
				this.pageSize1 = 15
				this.joinNum = ''
				this.leaveNum = ''
				this.groupMemberVisible = false
			},
			// 更新群数据
			async updateNotice () {
				this.spinning = true
				this.$message.destroy()
				this.$message.success('正在更新中...')
				const {data: res} = await this.axios.post("work-chat/chat-update-notice", {
					corp_id: this.corpId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.destroy()
					this.$message.success('更新成功')
					this.isLoading = true
					this.spinning = false
					this.getGroupChat(this.page, this.pageSize)
				}
			},
			// 移动群分组
			moveGroupChat (id, groupId) {
				this.groupChatId = []
				this.groupChatId.push(id)
				this.getTeamsList(groupId)
			},
			// 批量移动按钮
			batchMove () {
				this.groupChatId = this.selectedRowKeys
				this.getTeamsList(this.groupId)
			},
			// 移动分组
			async moveGroupIds () {
				const {data: res} = await this.axios.post("work-chat/chat-change-group", {
					group_id: this.moveGroupId,
					chat_id : this.groupChatId,

				});
				if (res.error != 0) {
					this.handleLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.visibleGroup = false
					this.$message.success('移动成功')
					this.selectedRowKeys = []
					this.isLoading = true
					this.handleLoading = false
					this.getGroupChat()
				}
			},
			// 移动分组切换分组
			changeGroup (id) {
				this.moveGroupId = id
			},
			// 多选
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
			},
			//获取分组列表
			async getTeamsList (groupId) {
				const {data: res} = await this.axios.post("work-chat/chat-group-list", {
					corp_id: this.corpId,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.info;
					this.moveGroupId = parseInt(groupId)
					if (groupId == 0) {
						this.moveGroupId = this.groupList[0].key
					}
					this.visibleGroup = true
				}
			},
			// 清除搜索列表条件
			clear () {
				this.status = []
				this.name = ''
				this.userId = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.joinTime = null
				this.getGroupChat()
			},
			//同步粉丝气泡提示
			syncConfirm () {
				message.info("已进入后台刷新中，请耐心等待...", 2, this.refreshFans)
			},
			async refreshFans () {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-chat/refresh-work-chat", {
					corp_id: this.corpId,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg)
				} else {
					this.$message.destroy()
					this.getGroupChat();
				}
			},
			// 获取群列表
			async getGroupChat (page = 1, pageSize = this.pageSize) {
				const {data: res} = await this.axios.post("work-chat/chat-list", {
					corp_id  : this.corpId,
					group_id : typeof this.groupId == 'object' ? 0 : this.groupId,
					status   : this.status.length == 0 ? '-1' : this.status,
					name     : this.name,
					user_id  : this.userId.length == 0 ? '' : this.userId,
					stime    : this.joinTime == null ? '' : (this.joinTime.length > 0 ? moment(this.joinTime[0]).format('YYYY-MM-DD HH:mm') : ''),
					etime    : this.joinTime == null ? '' : (this.joinTime.length > 1 ? moment(this.joinTime[1]).format('YYYY-MM-DD HH:mm') : ''),
					page     : page,
					page_size: pageSize,
					is_list  : 1,//区分页面，用于判断权限可见范围
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.groupChatList = res.data.list
					this.groupKeys = res.data.all_chat
					this.isLoading = false;
					this.total = parseInt(res.data.count)
					this.setCheckedBox(this.groupChatList)
					this.page = page
					this.pageSize = pageSize
				}
			},
			// 切换页面分组
			changeGroupId (corpId, suite_id, type, groupId, groupName) {
				this.selectedRowKeys = []
				this.corpId = corpId
				this.groupId = groupId
				this.suite_id = suite_id
				this.type = type
				this.groupName = groupName
				this.noBindFlag = false
				for (let i = 0; i < this.$store.state.noBindCorpArr.length; i++) {
					if (this.corpId == this.$store.state.noBindCorpArr[i].corpid) {
						this.noBindFlag = true
					}
				}
				this.isLoading = true
				this.clear()
			},
			// 表格行颜色
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			async handleChange1 (value) {
				const {data: res} = await this.axios.post("work-chat/chat-member-name", {
					corp_id: this.corpId,
					chat_id: this.btnType == 1 ? this.chatId : this.chatid,
					name   : value,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.memberList = res.data.list;
				}
			},
			filterOption (input, option) {
				return (
					option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
				);
			},
			// 选择群主弹窗
			showDepartmentList () {
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.userId))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
			},
			// 选择成员确认
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.userId = arr
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
			// 时间限制
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			moment,
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getGroupChat(page, this.pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 90)
				})
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getGroupChat(1, pageSize);
			},
			changePage1 (page, pageSize) {
				this.isLoading1 = true
				this.getMemberList(page, this.pageSize1);
				document.getElementsByClassName('ant-drawer-wrapper-body')[0].scrollTo(0, 0)
			},
			showSizeChange1 (page, pageSize) {
				this.isLoading1 = true
				this.getMemberList(1, pageSize);
			},
			//群详情
			groupDetail (chatId) {
				this.detailChatId = chatId
				this.getDetail();
				this.getFollowRecord()
				this.detailVisible = true
			},
			//获取详情
			async getDetail () {
				this.isLoading2 = true;
				const {data: res} = await this.axios.post("work-chat/chat-detail", {
					uid    : localStorage.getItem('uid'),
					chat_id: this.detailChatId,
				})

				if (res.error != 0) {
					this.isLoading2 = false
					this.$message.error(res.message)
				} else {
					this.isLoading2 = false
					this.followTitle = res.data.follow_title
					this.groupNotice = res.data.notice
					this.all_sum = res.data.all_sum
					this.user_sum = res.data.user_sum
					this.external_sum = res.data.external_sum
					this.no_external_sum = res.data.no_external_sum
					this.is_follow_del = res.data.is_follow_del
					this.chatStatus = res.data.status
					this.detailChatName = res.data.name
					this.avatarData = res.data.avatarData
					this.is_hide_phone = res.data.is_hide_phone

					this.hasTags = []
					this.tagCheckValue = []
					this.hasTagsValue = []
					res.data.tag_name.map(x => {
						this.hasTags.push(x.id)
						this.tagCheckValue.push(x.id)
						this.hasTagsValue.push(x.tagname)
					})
					this.follow_id = JSON.parse(JSON.stringify(res.data.follow_id))
					if (this.follow_id == '') {
						this.follow_id = this.follows[0] ? (this.follows[0].id ? this.follows[0].id : '') : ''
					}
					this.field_list = res.data.fieldList
					this.field_list.map(x => {
						if (x.type == 2 || x.type == 3) {
							x.optionVal2 = x.optionVal.split(',')
							if (x.type == 2) {
								if (x.value == '') {
									x.hasOption = x.value.split('')
								} else {
									x.hasOption = x.value
								}
							} else if (x.type == 3 && x.value != '') {
								x.hasOption = x.value.split(',')
							}
						} else if (x.type == 7) {
							if (x.value == '') {
								x.provice = []
							} else {
								x.provice = x.value.split('-')
							}
						} else if (x.type == 4) {
							x.data = x.value
						}
						if (x.key == 'phone') {
							this.phone = x.value
						}
					})
					this.fieldData = res.data.field_list
					this.followStatus = this.follow_id
					this.followStatus2 = this.follow_id
					this.getFollowStatus()
				}
			},
			//获取跟进状态
			async getFollowStatus () {
				const {data: res} = await this.axios.post(
					"custom-field/follow",
					{
						uid   : localStorage.getItem("uid"),
						status: 1
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.follows = res.data.follow;
					if (this.is_follow_del == 1) {
						let obj = {
							id    : this.follow_id,
							title : this.followTitle + '（已删除）',
							status: 0
						}
						this.follows.unshift(obj)
					}
				}
			},
			//群详情抽屉关闭
			groupDetailClose () {
				this.detailVisible = false
				this.tabKey = '1'
			},
			//切换tab
			changeTab (e) {
				if (e == 2) {
					this.btnFlag = 1
					this.getInteract(1)
				} else if (e == 1) {
					this.getFollowRecord()
				}
			},
			//获取跟进记录
			async getFollowRecord (page = 1, pageSize = this.pageSize2) {
				this.isLoading2 = true
				const {data: res} = await this.axios.post("work-chat/follow-record", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					uid            : localStorage.getItem('uid'),
					sub_id         : localStorage.getItem("sub_id"),
					chat_id        : this.detailChatId,
					page           : page,
					page_size      : pageSize,
				});
				if (res.error != 0) {
					this.isLoading2 = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading2 = false
					this.total2 = parseInt(res.data.count);
					this.page2 = page;
					this.pageSize2 = pageSize;
					this.quickJumper2 = this.total2 > this.pageSize2;
					this.followRecord = res.data.followRecord
				}
			},
			// 分页
			changePage2 (page, pageSize) {
				this.getFollowRecord(page, pageSize);
				document.getElementsByClassName('ant-drawer-wrapper-body')[0].scrollTo(0, 500)
			},
			showSizeChange2 (page, pageSize) {
				this.getFollowRecord(1, pageSize);
			},
			//输入框
			changeTextarea () {
				if (this.msg == '' && this.file.length == 0) {
					this.submitDisabled = true
				} else {
					this.submitDisabled = false
				}
			},
			// 打标签
			showModal () {
				this.visible = true;
				this.tagCheckValue = JSON.parse(JSON.stringify(this.hasTags))
			},
			//客户标签
			modalVisibleChange4 (event, str) {
				if (event == "ok") {
					if(str == ''){
						this.tagCheckValue = []
					}else {
						this.tagCheckValue = str.split(',')
					}
				}
			},
			async handleOk () {
				this.confirmLoading2 = true;
				const {data: res} = await this.axios.post("work-chat/tags-set", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					uid            : localStorage.getItem('uid'),
					sub_id         : localStorage.getItem("sub_id"),
					tag_ids        : this.tagCheckValue,
					chat_id        : this.detailChatId,
					type           : 0,
					s_type         : 2
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading2 = false;
				} else {
					this.$message.success(res.error_msg);
					this.visible = false
					this.confirmLoading2 = false;
					this.getDetail();
				}
			},
			cancelVisible () {
				this.visible = false
				this.tagCheckValue = []
			},
			//预览图片
			async handlePreview (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage = file.url || file.preview;
				this.previewVisible = true;
			},
			//关闭图片预览
			closePreview () {
				this.previewVisible = false;
			},
			changeMsg (value) {
				if (this.imageUrl.indexOf(value.file) != -1) {
					this.file.splice(this.imageUrl.indexOf(value.file), 1)
				}
				if (this.isImg) {
					this.imageUrl = value.fileList;
					this.imgNum = value.fileList.length
				}
				for (let f of this.imageUrl) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
				if (this.file.length == 0 && this.msg == '') {
					this.submitDisabled = true
				}
			},
			async uploadMaterial (materialData) {
				this.submitDisabled = true
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", materialData);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.file.push(res.data.local_path)
						this.submitDisabled = false
					}
				} else {
					this.$message.error(res.error_msg)
					this.submitDisabled = false
				}
				// console.log(this.file,'this.file')
			},
			beforeUpload (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.isImg = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.isImg = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.isImg = false
					return false;
				}
				this.isImg = true
				this.uploadMaterial(file);
				return isLt2M;
			},
			//预览图片
			previewHasImg (url) {
				this.previewImage = url;
				this.previewVisible = true;
			},
			//提交跟进记录
			async submitFollowRecord () {
				let record = ''
				let file = []
				if (this.record_id == '') {
					//新建
					record = this.msg
					file = this.file
					if (record.trim() == '' && file.length == 0) {
						this.$message.error('跟进内容和附件至少要填写一个！')
						return false
					}
				} else {
					//修改
					record = this.msg2
					file = this.file2
					if (record.trim() == '' && file.length == 0) {
						this.$message.error('跟进内容和附件至少要填写一个！')
						return false
					}
				}
				let followStatus = 0
				if (!this.editVisible) {
					followStatus = this.follow_id
				} else {
					followStatus = this.followStatus
				}
				if (followStatus == '') {
					this.$message.warning('请选择跟进状态！')
					return false
				}

				for (let i = 0; i < this.follows.length; i++) {
					if (this.follows[i].id == followStatus) {
						if (this.follows[i].status == 0) {
							this.$message.warning('跟进状态已被删除，请更换！')
							return false
						} else {
							break;
						}
					}
				}

				const {data: res} = await this.axios.post("work-chat/follow-record-set", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					corp_id        : this.corpId,
					uid            : localStorage.getItem('uid'),
					chat_id        : this.detailChatId,
					sub_id         : localStorage.getItem("sub_id"),
					record_id      : this.record_id,
					record         : record,
					file           : file,
					follow_id      : followStatus
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.submitDisabled = true
					this.msg = ''
					this.file = []
					this.record_id = ''
					this.imageUrl = []
					this.imgNum = 0
					this.msg2 = ''
					this.file2 = []
					this.imageUrl2 = []
					this.imgNum2 = 0
					this.editVisible = false
					this.getFollowRecord()
					this.getDetail()
				}
			},
			//修改跟进记录
			editFollowRecord (item) {
				this.editVisible = true
				this.record_id = item.id
				this.msg2 = item.record
				this.file2 = JSON.parse(JSON.stringify(item.file))
				item.file.map((x, index) => {
					let url = {
						uid   : index,
						name  : 'image.png',
						status: 'done',
						url   : this.commonUrl + x
					}
					this.imageUrl2.push(url)
				})
				this.imgNum2 = item.file.length
			}
			,
			cancelFollowRecord () {
				this.editVisible = false
				this.record_id = ''
				this.followStatus = this.followStatus2
				this.msg2 = ''
				this.file2 = []
				this.imageUrl2 = []
				this.imgNum2 = 0
			}
			,
			//上传图片
			handleCancel2 () {
				this.previewVisible2 = false;
			}
			,
			async handlePreview2 (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage2 = file.url || file.preview;
				this.previewVisible2 = true;
			}
			,
			changeMsg2 (value) {
				if (this.imageUrl2.indexOf(value.file) != -1) {
					this.file2.splice(this.imageUrl2.indexOf(value.file), 1)
				}
				if (this.isImg2) {
					this.imageUrl2 = value.fileList;
					this.imgNum2 = value.fileList.length
				}
				for (let f of this.imageUrl2) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
			}
			,
			async uploadMaterial2 (materialData) {
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", materialData);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.file2.push(res.data.local_path)
					}
				} else {
					this.$message.error(res.error_msg)
				}
				// console.log(this.file,'this.file')
			}
			,
			beforeUpload2 (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.isImg2 = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.isImg2 = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.isImg2 = false
					return false;
				}
				this.isImg2 = true
				this.uploadMaterial2(file);
				return isLt2M;
			}
			,
			//获取互动轨迹
			async getInteract (page = 1) {
				this.isLoading2 = true
				const {data: res} = await this.axios.post("work-chat/chat-track", {
					uid      : localStorage.getItem('uid'),
					chat_id  : this.detailChatId,
					page     : page,
					page_size: 15,
				});
				if (res.error != 0) {
					this.isLoading2 = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading2 = false
					this.page3 = page;
					if (res.data.list.length < 15) {
						this.btnFlag = 2
					} else {
						this.btnFlag = 1
					}
					if (page == 1) {
						this.interactList = res.data.list
					} else {
						this.interactList = this.interactList.concat(res.data.list)
					}
				}
			},
			//加载更多
			loadMore () {
				this.page3++
				this.getInteract(this.page3)
			},
			cancleBadicInfo () {
				this.badicInfoVisible = false
				this.field_list = JSON.parse(JSON.stringify(this.fieldData))
			},
			//编辑基础信息
			editBadicInfo () {
				this.fieldData = JSON.parse(JSON.stringify(this.field_list))
				for (let i = 0; i < this.field_list.length; i++) {
					this.field_list[i]['picUrl'] = []
					if (this.field_list[i].type == 8) {
						if (this.field_list[i].value) {
							for (let v of this.field_list[i].value) {
								this.field_list[i]['picUrl'].push({
									uid   : v.uid,
									url   : this.commonUrl + v.url,
									status: v.status,
									name  : 'image.png'
								})
							}
						}
					}
					if (this.field_list[i].key == 'phone') {
						//手机号
						if (this.phone) {
							let val = JSON.parse(JSON.stringify(this.phone))
							this.phone2 = val.replace(/,/g, " ")
						}
					}
					if (this.field_list[i].key == 'company') {
						//公司
						if (this.company) {
							this.company2 = JSON.parse(JSON.stringify(this.company))
						}
					}
				}
				this.badicInfoVisible = true
			},
			//单选
			handleChange (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value;
					this.field_list = newData;
				}
			},
			//多选
			handleChange2 (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value.join(',');
					this.field_list = newData;
				}
			},
			//输入框
			changeInput (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value;
					this.field_list = newData;
				}
			},
			//特殊输入框（手机号、公司）
			changeSpecialInput (value, key) {
				if (key == 'phone') {
					this.phone2 = value
				} else if (key == 'company') {
					this.company2 = value
				}
			},
			// 地区
			changeArea (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value.join('-');
					this.field_list = newData;
				}
			},
			//日期
			selectDate (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value.format("YYYY-MM-DD");
					this.field_list = newData;
				}
			},
			async beforeUploadPic (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.isImg3 = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.isImg3 = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.isImg3 = false
					return false;
				}
				this.isImg3 = true
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", file);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.picFile = {
							uid   : file.uid,
							url   : this.commonUrl + res.data.local_path,
							status: 'done'
						}
						return isLt2M;
					}
				} else {
					this.$message.error(res.error_msg)
				}

			},
			handleChangePic (e, index) {
				if (e.file.status == 'removed') {
					this.field_list[index]['picUrl'].splice(this.field_list[index]['picUrl'].findIndex(x => x.url == e.file.url), 1)
				}
				if (this.picFile.status == 'done') {
					let i = this.field_list[index]['picUrl'].findIndex(x => e.file == x)
					if (i != -1) {
						this.field_list[index]['picUrl'].splice(i, 1)
					} else {
						this.field_list[index]['picUrl'].push(this.picFile)
					}
				}
				for (let f of this.field_list[index]['picUrl']) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
				this.picFile = {}
			}
			,
			preview (url) {
				this.previewImage = url
				this.previewVisible = true;
			},
			handleCancel () {
				this.previewVisible = false;
			},
			//提交基础信息修改
			async submitBadicInfo () {
				let phoneReg = /^1[345678]{1}\d{9}$/
				let phoneReg2 = /^0\d{2,3}-?\d{7,8}$/
				//只能输入数字与+-
				let phoneReg3 = /[^+|-|\d]/
				let postBoxReg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
				let field_list = JSON.parse(JSON.stringify(this.field_list))
				let flag = true
				for (let i = 0; i < this.field_list.length; i++) {
					if (this.field_list[i].key == 'phone') {
						let PhoneArr = this.phone2.split(' ')
						for (let i = PhoneArr.length - 1; i >= 0; i--) {
							if (PhoneArr[i] == '') {
								PhoneArr.splice(i, 1);
							}
						}
						if (PhoneArr.length > 5) {
							this.$message.error('手机号不能多于5个！')
							flag = false
							return false
						}
						for (let j = 0; j < PhoneArr.length; j++) {
							if (phoneReg3.test(PhoneArr[j])) {
								this.$message.error('手机号格式不正确！')
								flag = false
								return false
							}
						}
						if (!flag) {
							return false
						}
						field_list[i].value = PhoneArr.join()
					}
					if (this.field_list[i].key == 'company') {
						field_list[i].value = this.company2
					}
					if (field_list[i].type == 6 && field_list[i].value != '') {
						if (!postBoxReg.test(field_list[i].value)) {
							this.$message.error('邮箱格式不正确！')
							flag = false
							return false
						}
					}
					if (field_list[i].type == 8) {
						for (let picUrl of field_list[i].picUrl) {
							picUrl.url = picUrl.url.replace(this.commonUrl, "")
							delete picUrl.response
							delete picUrl.xhr
							delete picUrl.percent
						}
						field_list[i].value = JSON.parse(JSON.stringify(field_list[i].picUrl))
						delete field_list[i].picUrl
					}
					if (typeof field_list[i].value == 'undefined') {
						field_list[i].value = ''
					}
				}
				if (!flag) {
					return false
				}
				const {data: res} = await this.axios.post("work-chat/chat-field-update", {
					user_id  : localStorage.getItem('uid'),
					chat_id  : this.detailChatId,
					corp_id  : this.corpId,
					fieldData: field_list
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.badicInfoVisible = false
					this.getDetail()
				}
			},
		},

		created () {
			if (localStorage.getItem('permissionButton') == 'all') {
				this.isShowTag = true
			} else {
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.indexOf('groupList-add-tag') > -1 && list.indexOf('groupList-remove-tag') > -1) {
					this.isShowTag = true
				} else {
					this.isShowTag = false
				}
			}
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path != '/group/statistics') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.clear()
				});
			}
			next()
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.half {
		width: 50%;
		display: inline-block;
		line-height: 40px;
		padding: 0 20px;
		border-top: 1px solid #E9E9E9;
	}

	.half-text {
		float: right;
		word-break: break-all;
		max-width: calc(100% - 120px);
	}

	.wx-info {
		width: 100%;
		position: absolute;
		left: 0;
		top: 100px;
		bottom: 0;
		overflow: hidden;
	}

	.wx-info::-webkit-scrollbar {
		width: 2px;
		height: 100%;
	}

	.wx-info::-webkit-scrollbar-track-piece {
		background-color: #FFFFFF;
	}

	.wx-info::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #FFFFFF;
	}

	/*.wx-info::-webkit-scrollbar-track*/
	/*{*/
	/*	border-radius: 10px;  !*滚动条的背景区域的圆角*!*/
	/*	background-color: white;!*滚动条的背景颜色*!*/
	/*}*/
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
		min-height: 60px;
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

	.msg-info {
		color: #FFDDA6;
		margin-right: 10px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		/*border: 1px solid #E2E2E2;*/
		min-width: 875px;
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

	.content-hd-left {
		/*float: left;*/
	}

	.content-hd-right {
		float: right;
	}

	.btn-primary {
		margin-left: 20px;
	}

	.sider-one {
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.selectWx {
		width: 200px;
		margin-left: 20px;
		/*margin: auto;*/
		height: 50px;
		line-height: 50px;
		cursor: pointer;
		padding-left: 10px;
	}

	.active {
		background: #01b065;
		color: white;
	}

	.tag-name {
		padding: 6px 14px;
		height: 34px;
		font-size: 13px;
		border: 1px solid #D9D9D9;
		background-color: transparent !important;
		color: rgba(0, 0, 0, 0.65);
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 47px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .wxtpl .ant-radio-button-wrapper-checked {
		border: 2px solid #01b065 !important;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}

	.select-option {
		display: inline-block;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.select-option label {
		display: inline-block;
		text-align: right;
		width: 100px;
	}

	.drawer-title {
		display: inline-block;
		vertical-align: bottom;
		max-width: 360px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.custom-info-box {
		margin: 10px;
		overflow: hidden;
		text-align: center;
	}

	.box {
		padding: 20px 20px 0;
		height: 115px;
		width: 25%;
		border: 1px solid #E9E9E9;
		background-color: #F9F9F9;
		float: left;
		overflow: auto;
	}

	.box:nth-child(1), .box:nth-child(2), .box:nth-child(3) {
		border-right: 0;
	}

	.box-first {
		font-size: 16px;
	}

	.box-second {
		padding: 0;
		margin: 0;
		overflow: hidden;
	}

	.textArea-btn {
		padding: 20px 0 10px;
		overflow: hidden;
	}

	.upload-file /deep/ .ant-upload-picture-card-wrapper {
		display: inline;
	}

	.upload-file /deep/ .ant-upload.ant-upload-select-picture-card {
		background-color: #FFF;
		border: 0;
		height: 32px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0;
	}

	.time-line-title {
		background: #F9F9F9;
		padding: 10px;
		margin-top: 5px;
	}

	.follow-content {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
		display: block;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.time {
		border: 1px solid #E9E9E9;
		padding: 20px 20px 0;
	}

	.preview-box {
		width: 75px;
		height: 75px;
		margin: 0 8px 8px 0;
		padding: 8px;
		border: 1px solid #D9D9D9;
		border-radius: 4px;
		position: relative;
		float: left;
	}

	.preview-cover, .preview-cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: relative;
	}

	.preview-cover::before {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: all 0.3s;
		content: ' ';
	}

	.preview-cover-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 10;
		white-space: nowrap;
		transform: translate(-50%, -50%);
		opacity: 0;
		transition: all 0.3s;
		cursor: pointer;
		color: #FFF;
		font-size: 18px;
	}

	.preview-box:hover .preview-cover::before, .preview-box:hover .preview-cover-icon {
		opacity: 1;
	}

	/*.upload-pic /deep/ .ant-upload-list-picture-card-container, .upload-pic /deep/.ant-upload.ant-upload-select-picture-card {*/
	/*	width: 75px;*/
	/*	height: 75px;*/
	/*}*/
	/*.upload-pic /deep/ .ant-upload-list-item {*/
	/*	width: 75px;*/
	/*	height: 75px;*/
	/*	margin-top: 0;*/
	/*}*/
	.upload-pic /deep/ .ant-upload.ant-upload-select-picture-card, .upload-pic /deep/ .ant-upload-list-picture-card .ant-upload-list-item, .upload-pic /deep/ .ant-upload-list-picture-card-container {
		width: 70px;
		height: 70px;
	}

	.upload-pic /deep/ .ant-upload-select-picture-card i {
		font-size: 32px;
		color: #999;
	}

	.upload-pic /deep/ .ant-upload-select-picture-card .ant-upload-text {
		margin-top: 8px;
		color: #666;
	}
</style>

<style lang="less">
	.other-chat {
		&.ant-popover-placement-left {
			> .ant-popover-content {
				> .ant-popover-arrow {
					display: none;
				}
			}
		}
	}
</style>
