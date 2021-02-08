<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider>
					<Menu ref="menu" @changeGroupId='changeGroupId'></Menu>
					<!--					&lt;!&ndash; 企业微信 &ndash;&gt;-->
					<!--					<eWechat @changeWxId="handleWxId"></eWechat>-->
				</a-layout-sider>
				<a-layout style="position: absolute;left:250px;top:0;bottom:0;right:0;" class="scroll">
					<!-- 头部 -->
					<a-layout-header>自动拉群</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								<span style="color: #FF562D;">自动拉群，不仅可以完全实现不需要员工手工拉客户进群，而且完全打破企业微信官方只能选择5个群聊的局限，流程如下：</span>
								<a-popover placement="bottom">
									<template slot="content">
										<img style="width: 1122px; height: 444px;" src="../../../assets/group/step.png">
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-popover>
							</p>
							<p style="margin-bottom: 2px;">
								1、在本系统添加多个群聊的二维码（群聊数量足够），添加完成后会生成一个渠道活码，一个渠道活码对应一个或多个使用成员（相当于客服）。</p>
							<p style="margin-bottom: 2px;">
								2、当客户扫该渠道活码之后就会先添加使用成员，同时客户会收到管理员提前设置的入群引导语，引导语中包括入群二维码，然后扫码进群。</p>
							<p style="margin-bottom: 2px;">
								3、当第一个群达到人数上限（最多200人）后，客户扫码添加使用成员后，推送第二群的入群二维码，客户扫码进入第二个群聊，依次往后进行。</p>
							<p style="margin-bottom: 0px;color: #FF562D;">
								在整个流程中，即使在客户不入群或当客户退群时，该客户其实就已添加过客服，可以保持单独联系，完善客户画像，提供一对一的精准服务。</p>
						</div>
						<div class="content-hd">
							<a-col style="float: left;">
								<a-input style="width: 180px;" @keyup.enter="selectTitle" placeholder="搜索群活码名称"
								         allowClear v-model="title"/>
								<a-button style="margin-left: 10px;" @click="selectTitle" type="primary">查找</a-button>
								<a-button style="margin-left: 10px;" @click="clearTitle">清空</a-button>
							</a-col>
							<a-col style="float: right;">
								<a-button icon="plus" @click="create" type="primary" v-has="'groupAutoCreate-add'">
									新建拉群
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="groupList" :pagination="false"
								         :rowClassName="rowClassName" :rowSelection="rowSelection"
								         v-has="'groupAutoCreate-list'">
									<img width="100" height="100" slot="local_path" slot-scope="text"
									     :src="commonUrl+text">
									<span slot="user" slot-scope="text, record,index">
										<template v-for="user in record.user_key">
											<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'"
											       color="orange"
											       style="margin-top: 5px;">{{user.title}}</a-tag>
										</template>
										<template v-for="user in record.user_key">
											<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'"
											       color="blue"
											       style="margin-top: 5px;">{{user.title}}</a-tag>
										</template>
										<span v-if="record.user_key.length == 0">--</span>
									</span>
									<span slot="tag_name" slot-scope="text, record,index">
										<span v-if="text.length == 0">--</span>
										<a-tag v-for="item in text" color="blue">{{item}}</a-tag>
									</span>
									<span slot="add_num" slot-scope="text, record,index">
										<div style="width: 110px;">添加客户{{record.add_num}}人</div>
										<div>已入群客户{{record.success_num}}人</div>
									</span>
									<span slot="chat_list" slot-scope="text, record,index">
										<div v-for="item in text">
											<a-tag style="padding: 3px;">
												<span style="background: #1890FF;width: 18px;height:18px;display: inline-block;margin-right: 5px;vertical-align: middle;">
													<img :src="img" style="width: 14px;margin: 2px;"/>
												</span>
												<span style="width: 60px;display:inline-block;vertical-align: middle;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
													<template
															v-if="!item.name || item.name == ''">--</template>
													<a-popover trigger="hover"
													           v-if="item.name && item.name != ''">
														<span slot="content"
														      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
															{{item.name}}
														</span>
														<span v-if="item.name && item.name != ''"
														      style="color:#1890FF; cursor: pointer;">{{item.name}}</span>
													</a-popover>
												</span>
												<span>（{{item.member_num}}）</span>
											</a-tag>
											<a-tag v-if="item.chat_status == 0">未开始</a-tag>
											<a-tag v-if="item.chat_status == 1" color="green">拉人中</a-tag>
											<a-tag v-if="item.chat_status == 2" color="red">已满群</a-tag>
											<a-tag v-if="item.chat_status == 3" color="orange">已停用</a-tag>
										</div>
									</span>
									<span slot="action" slot-scope="text, record,index">
										<div style="max-width: 140px;">
											<a-button @click="detail(record.id,record.title)"
											          class="actionBtn" v-has="'groupAutoCreate-info'">详情</a-button>
											<a-button @click="edit(record.id)" class="actionBtn"
											          v-has="'groupAutoCreate-edit'">编辑</a-button>
											<a-button :data-url="commonUrl+record.local_path" :data-name="record.title"
											          @click="downLoadWay" class="actionBtn"
											          v-has="'groupAutoCreate-down'">下载</a-button>
											<a-button @click="move(record.id,record.way_group_id, 0)"
											          class="actionBtn" v-has="'groupAutoCreate-remove'">移动</a-button>
											<a-button @click="definite(record.id,record.title,record.chat_list)"
											          class="actionBtn"
											          v-has="'groupAutoCreate-detail'">明细</a-button>
										</div>
									</span>
								</a-table>
								<div style="margin: 20px;" v-show="total > 0">
									<a-checkbox v-model="batchTypeValue" :disabled="batchTypeDisabled"
									            @click="batchTypeChange"></a-checkbox>
									<a-select optionFilterProp="children" v-model="batchType"
									          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
										<a-select-option value="0">选择当前页</a-select-option>
										<a-select-option value="1">选择所有</a-select-option>
									</a-select>
									<a-button @click="move(selectedRowKeys,groupId.length > 0 ? groupId[0] : '',1)"
									          :disabled="selectedRowKeys.length == 0" style="margin-right: 5px;"
									          v-has="'groupAutoCreate-remove'">
										<a-icon type="retweet"/>
										批量移动
									</a-button>
									<a-button @click="downLoad" style="margin-right: 5px"
									          :disabled="selectedRowKeys.length == 0" v-has="'groupAutoCreate-down'">
										<a-icon type="download"/>
										批量下载
									</a-button>
								</div>
								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'groupAutoCreate-list'">
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
					<!-- 详情页面弹窗 -->
					<a-modal :title="'【'+ detailTitle +'】详情'" v-model="detailVisible" width="888">
						<template slot="footer">
							<a-button key="back" @click="handleCancel">关闭</a-button>
						</template>
						<div class="detailBox">
							<a-spin tip="Loading..." size="large" :spinning="isLoading2">
								<div class="detailBox-left">
									<div class="left-one">
										<div class="one-img">
											<img :src="commonUrl+detailData.local_path" alt="">
										</div>
										<div class="one-date">创建时间：{{detailData.create_time}}</div>
										<div class="one-name">{{detailData.title}}</div>
										<a-button :data-url="commonUrl+detailData.local_path"
										          :data-name="detailData.title"
										          @click="downLoadWay" class="one-btn" type="primary"
										          v-has="'groupAutoCreate-down'">下载活码
										</a-button>
										<a-button class="one-btn" @click="edit(detailData.id)"
										          v-has="'groupAutoCreate-edit'">修改
										</a-button>
									</div>
									<div class="left-two">
										<p class="two-title">入群标签：</p>
										<div class="tags-list">
											<p style="text-align: center;"
											   v-if="detailData.tag_name && detailData.tag_name.length == 0">暂无标签</p>
											<a-tag color="blue" v-for="item in detailData.tag_name">{{item}}</a-tag>
										</div>
									</div>
									<div class="left-three">
										<div style="float: left;height: 100%;color: #1A1A1A;"
										     v-if="detailData.chat_list">
											共{{detailData.chat_list.length}}个群聊：
										</div>
										<div class="three-input">
											<template v-for="item in detailData.chat_list">
												<a-tag style="padding: 8px;">
													<span style="background: #1890FF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;border-radius: 4px;float: left;"
													      v-if="item.avatarData && item.avatarData.length == 0">
											<img :src="img"
											     style="width: 20px;margin: 8px;height: 20px;"/>
										</span>
													<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;border-radius: 4px;float: left;"
													      v-else-if="item.avatarData && item.avatarData.length == 1">
											<img :src="item.avatarData && item.avatarData[0]"
											     style="width: 36px;height:36px;"
											     v-if="item.avatarData && item.avatarData[0] != ''"/>
											<img :src="img2" style="width: 36px;height:36px;"
											     v-if="item.avatarData && item.avatarData[0] == ''"/>
										</span>
													<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
													      v-else-if="item.avatarData && item.avatarData.length > 1 && item.avatarData.length <= 4">
											<template v-for="imgItem in item.avatarData">
												<img :src="imgItem"
												     style="width: 17px;height: 17px;" v-if="imgItem != ''"/>
												<img :src="img2" style="width: 17px;height: 17px;"
												     v-if="imgItem == ''"/>
											</template>
										</span>
													<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
													      v-else-if="item.avatarData && item.avatarData.length > 4">
											<template v-for="imgItem in item.avatarData">
												<img :src="imgItem"
												     style="width: 10px;height: 10px;" v-if="imgItem != ''"/>
												<img :src="img2" style="width: 10px;height: 10px;"
												     v-if="imgItem == ''"/>
											</template>
										</span>
													<a-popover placement="top">
														<template slot="content">
															<span style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
																{{item.name}}
															</span>
														</template>
														<span style="cursor: pointer; width: 120px;display:inline-block;vertical-align: middle;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"><template
																v-if="!item.name || item.name == ''">--</template>{{item.name}}</span>
														<span>（{{item.member_num}}）</span>
													</a-popover>
												</a-tag>
												<a-tag v-if="item.chat_status == 0">未开始</a-tag>
												<a-tag v-if="item.chat_status == 1" color="green">拉人中</a-tag>
												<a-tag v-if="item.chat_status == 2" color="red">已满群</a-tag>
												<a-tag v-if="item.chat_status == 3" color="orange">已停用</a-tag>
											</template>
										</div>
									</div>
								</div>
								<div class="detailBox-right">
									<div class="detailBox-user">
										<a-form-item label="使用成员" :label-col="{ span: 5 }"
										             :wrapper-col="{ span: 19 }">
											<template v-for="item in detailData.user_key">
												<a-tag v-if="item.scopedSlots && item.scopedSlots.title == 'custom'">
													<a-icon type="user"/>
													{{item.title}}
												</a-tag>
											</template>
											<template v-for="item in detailData.user_key">
												<a-tag v-if="item.scopedSlots && item.scopedSlots.title != 'custom'">
													<a-icon type="team"/>
													{{item.title}}
												</a-tag>
											</template>
										</a-form-item>
									</div>
									<img src="http://s.weituibao.com/static/1558341456351/qrcodedeyulan.png" alt=""
									     class="preview-img">
									<div class="right-content">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36"
												style="margin-right: 10px;float: left;"/>
										<span v-html="detailData.text_content ? detailData.text_content.replace(/{nickname}/g,'&nbsp;<span contenteditable=\'false\' class=\'ant-tag ant-tag-orange\'>客户名称</span>&nbsp;') : ''"
										      class="msg_content_txt"></span>
									</div>
								</div>
							</a-spin>
						</div>
					</a-modal>

					<!-- 移动分组选择弹窗 -->
					<a-modal v-model="groupVisible" title="分组移动" width="720px" @cancel="cancelChangeGroup">
						<template slot="footer">
							<a-button key="back" @click="cancelChangeGroup">取消</a-button>
							<a-button
									key="submit"
									type="primary"
									:loading="groupLoading"
									@click="handleChangeGroup"
							>提交
							</a-button>
						</template>
						<div class="group-tree" style="height: 270px;width: 100%; overflow-x: auto;">
							<a-tree
									class="draggable-tree"
									@select="onselectGroup"
									:treeData="gData"
							>
								<template slot="custom" slot-scope="{title,key}">
									<div style="width: 100%;" :dataKey="key">
										<span :class="key== group ? 'active1': ''">{{title}}</span>
									</div>
								</template>
							</a-tree>
						</div>
					</a-modal>

					<!--明细抽屉-->
					<a-drawer
							placement="right"
							:closable="false"
							:visible="definiteVisible"
							@close="definiteDrawerClose"
							width="1000px!important"
					>
						<template slot="title">
							{{definiteTitle}}
						</template>
						<div style="padding: 20px;">
							<a-row class="single-accout-card">
								<a-col :span="6" class="single-accout-cardItem">
									<p class="single-accout-cardItem-num">{{totalAddNum}}</p>
									<p class="single-accout-cardItem-title">累计添加客户数
										<a-tooltip placement="right">
											<template slot="title">
												<span>通过该活码，添加的成员客户数，包含删除员工，算累计值</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</p>
								</a-col>
								<a-col :span="6" class="single-accout-cardItem">
									<p class="single-accout-cardItem-num">{{successAddNum}}</p>
									<p class="single-accout-cardItem-title">已入群客户数
										<a-tooltip placement="right">
											<template slot="title">
												<span>通过该活码，添加成员后进入该群的客户数，去掉其中入群再退群的人数</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</p>
								</a-col>
								<a-col :span="6" class="single-accout-cardItem">
									<p class="single-accout-cardItem-num">{{outAddNum}}</p>
									<p class="single-accout-cardItem-title">退群客户数
										<a-tooltip placement="right">
											<template slot="title">
												<span>通过该活码，添加成员后进入该群的客户数，其中入群再退群的人数</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</p>
								</a-col>
								<a-col :span="6" class="single-accout-cardItem">
									<p class="single-accout-cardItem-num">{{delAddNum}}</p>
									<p class="single-accout-cardItem-title">删除客服人数</p>
								</a-col>
							</a-row>
							<div style="margin: 0 0 20px 0;">
								<div style="background-color: #FFFFFF;">
									<div style="height: 32px;line-height: 32px;margin-top: 10px;color: #000;">
										共
										<span style="color: blue">{{total2}}</span>个客户
									</div>
									<span class="select-option">
											<label style="margin-right: 5px;">搜索客户：</label>
											<a-input style="margin-right: 5px;width: 180px;"
											         @keyup.enter="getDefiniteList(1, pageSize2)"
											         placeholder="请输入要搜索的客户" v-model="customName"/>
									</span>
									<span class="select-option" style="margin-left: 15px;">
										<label style="margin-right: 5px;">是否入群：</label>
										<a-select showSearch optionFilterProp="children" placeholder="全部"
										          style="width: 180px;margin-right: 5px;" v-model="isJoin">
												<a-select-option :value="0">全部</a-select-option>
												<a-select-option :value="1">未入群</a-select-option>
												<a-select-option :value="2">已入群</a-select-option>
												<a-select-option :value="3">已离群</a-select-option>
										</a-select>
									</span>
									<span class="select-option" style="margin-left: 15px;">
										<label style="margin-right: 5px;">选择群聊：</label>
										<a-button @click="showChatVisible" style="width: 180px;">
											<span style="text-align: center;"
											      v-if="chooseNum > 0">已选择{{chooseNum}}个群</span>
											<span style="text-align: center;" v-else>选择群聊</span>
										</a-button>
									</span>
									<div style="margin-top: 10px;">
									<span class="select-option" style="margin-right: 15px;">
										<label style="margin-right: 5px;">选择成员：</label>
										<a-button @click="showDepartmentList" style="width: 180px;">
											<span v-if="chooseNum2 > 0">已选择{{chooseUserNum2}}名成员，{{chooseDepartmentNum2}}个部门</span>
											<span v-else>选择成员</span>
										</a-button>
									</span>
										<span class="select-option">
										<a-select optionFilterProp="children"
										          style="width: 135px;" v-model="timeType" class="time-type">
												<a-select-option :value="1">添加客服时间</a-select-option>
												<a-select-option :value="2">删除客服时间</a-select-option>
												<a-select-option :value="3">入群时间</a-select-option>
												<a-select-option :value="4">退群时间</a-select-option>
										</a-select>
										<a-range-picker
												style="margin-right: 5px;width: 300px;border-radius: 0;"
												:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],format:'HH:mm' }"
												format="YYYY-MM-DD HH:mm"
												allowClear
												:disabled-date="disabledDate"
												v-model="joinTime" class="date-picker"
										/>
									</span>
										<a-button type="primary" style="margin-right: 5px;margin-left: 15px;"
										          @click="searchRecord">查找
										</a-button>
										<a-button style="margin-right: 10px;" @click="resetRecord">清空</a-button>
									</div>
								</div>
							</div>

							<a-spin tip="Loading..." size="large" :spinning="isLoading3" style="margin-bottom: 110px;">
								<a-table :columns="columns2" :dataSource="definiteList"
								         :pagination="false"
								         :rowClassName="rowClassName">
									<div slot="customer_name" slot-scope="text, record, index">
										<a-avatar v-if="record.avatar" shape="square" :size="42"
										          :src="record.avatar"
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
																													<template
																															v-else>@微信</template>
																												</span>
													</template>
													<span style="display: inline-block; max-width: 180px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
																												{{record.customer_name}}
																												<span :class="record.corp_name != null ? 'corp-name' : 'wx-name'">
																													<template
																															v-if="record.corp_name != null">@{{record.corp_name}}</template>
																													<template
																															v-else>@微信</template>
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
									<span slot="group_status" slot-scope="text, record, index">
										<span v-if="record.group_status == 1">未入群</span>
										<span v-if="record.group_status == 2">已入群</span>
										<span v-if="record.group_status == 3">已离群</span>
									</span>
									<span slot="chat_name" slot-scope="text, record,index">
									<a-tag style="padding: 3px;">
												<span style="background: #1890FF;width: 18px;height:18px;display: inline-block;margin-right: 5px;vertical-align: middle;">
													<img :src="img" style="width: 14px;margin: 2px;"/>
												</span>
												<span style="width: 110px;display:inline-block;vertical-align: middle;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
													<a-popover trigger="hover">
														<span slot="content"
														      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
															{{record.chat_name}}
														</span>
														<span style="color:#1890FF; cursor: pointer;">{{record.chat_name}}</span>
													</a-popover>
												</span>
											</a-tag>
									</span>
								</a-table>
								<!--分页-->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total2 > 0">
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total2" showSizeChanger
										              :showQuickJumper="quickJumper2"
										              :current="page2"
										              :pageSize="pageSize2"
										              :pageSizeOptions="['1','3','15','30','50','100']"
										              @change="changePage2"
										              @showSizeChange="showSizeChange2"/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-drawer>

				</a-layout>
			</a-layout>
		</div>

		<!--选择群聊弹窗-->
		<groupChat :show="chatVisible" :chatArr="chatArr" :callback="groupChatCallBack" :corpId="corpId"></groupChat>
		<!--部门选择框-->
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum2" :departmentDisabled="1"
		                  :callback="modalVisibleChange" :is_from="7"></chooseDepartment>
	</div>
</template>

<script>
	import Menu from '@/components/AutoCreateGroupMenu/Menu.vue'
	import img from '../../../assets/chat.png'
	import img2 from '../../../assets/useradvart.png'
	import QRCode from "qrcodejs2";
	import moment from "moment";
	import groupChat from "@/components/GroupChat.vue"
	import chooseDepartment from "@/components/ChooseDepartment.vue"

	const columns = [
		{
			title      : '二维码',
			dataIndex  : "local_path",
			key        : "local_path",
			scopedSlots: {customRender: 'local_path'},
		},
		{
			title    : '名称',
			dataIndex: "title",
			key      : "title",
		},
		{
			title      : '使用成员',
			dataIndex  : "user",
			key        : "user",
			scopedSlots: {customRender: 'user'},
		},
		{
			title      : '标签',
			dataIndex  : "tag_name",
			key        : "tag_name",
			scopedSlots: {customRender: 'tag_name'},
		},
		{
			title      : '客户情况',
			dataIndex  : "add_num",
			key        : "add_num",
			scopedSlots: {customRender: 'add_num'},
		},
		{
			title      : '群聊',
			dataIndex  : "chat_list",
			key        : "chat_list",
			scopedSlots: {customRender: 'chat_list'},
		},
		{
			title    : '创建时间',
			dataIndex: "create_time",
			key      : "create_time"
		},
		{
			title      : '操作',
			key        : 'action',
			scopedSlots: {customRender: 'action'},
		},
	];
	const columns2 = [
		{
			title      : '客户',
			dataIndex  : "customer_name",
			key        : "customer_name",
			scopedSlots: {customRender: 'customer_name'},
		},
		{
			title      : '状态',
			dataIndex  : "group_status",
			key        : "group_status",
			scopedSlots: {customRender: 'group_status'},
		},
		{
			title    : '所属成员',
			dataIndex: "name",
			key      : "name"
		},
		{
			title      : '加入群聊',
			dataIndex  : "chat_name",
			key        : "chat_name",
			scopedSlots: {customRender: 'chat_name'},
		},
		{
			title    : '添加客服时间',
			dataIndex: "createtime",
			key      : "createtime"
		},
		{
			title    : '删除客服时间',
			dataIndex: "del_time",
			key      : "del_time"
		},
		{
			title    : '入群时间',
			dataIndex: "join_time",
			key      : "join_time"
		},
		{
			title    : '退群时间',
			dataIndex: "leave_time",
			key      : 'leave_time'
		},
	];

	export default {
		name      : "autoCreateList",
		components: {
			Menu, groupChat, chooseDepartment
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				img,
				img2,
				commonUrl           : this.$store.state.commonUrl, //公共的链接
				corpId              : corpId,
				groupId             : '',//分组id
				title               : '',
				//表格部分
				columns,
				isLoading           : false,//加载的显示与隐藏
				groupList           : [],//群组列表
				//分页
				total               : 1, //总条数
				quickJumper         : false, // 是否显示快速跳转的控件
				page                : 1, //页码
				pageSize            : 15, //每页数据条数
				//详情页面弹窗
				detailVisible       : false,//详情页面弹窗的显示与隐藏
				isLoading2          : false,//详情页Loading的显示与隐藏
				detailTitle         : '',//标题
				detailData          : {},//数据
				//移动分组选择弹窗
				groupVisible        : false,//弹窗显示与隐藏
				groupLoading        : false,//Loading的显示与隐藏
				gData               : [],//分组列表
				group               : '',
				qrCodeId            : '',
				batchMoveType       : '',//0单个移动，1批量移动
				selectedRowKeys     : [],
				keysArr             : [],//所有客户的键值
				checkArr            : [],//选择当前页/所有，保存的key
				batchType           : '1',     // 0当前页 1所有
				batchTypeValue      : false, // 当前页/所有 是否选中
				batchTypeDisabled   : false,//当前页/所有 是否置灰
				//明细抽屉
				definiteTitle       : '',//标题
				definiteVisible     : false,//抽屉的显示与隐藏
				isLoading3          : false,//加载的显示与隐藏
				totalAddNum         : 0,//累计添加客户数
				successAddNum       : 0,//已入群客户数
				outAddNum           : 0,//退群客户数
				delAddNum           : 0,//删除客服人数
				definiteId          : '',//明细的群码id
				contact_way_id      : [],//明细的群聊id
				customName          : '',//搜索客户
				isJoin              : 0,//是否入群
				timeType            : 1,//搜索时间的类型
				joinTime            : null, // 搜索的时间
				definiteList        : [],//明细表格数据
				chooseNum           : 0,//已选择群聊数量
				chatArr             : [],//选择的群聊id数组
				chatVisible         : false,//群聊弹窗的显示与隐藏
				chooseNum2          : 0,//已选择的部门成员总个数
				chooseUserNum2      : 0,//成员个数
				chooseDepartmentNum2: 0,//部门个数
				showModalDepartment : false, //成员选择框显示与隐藏
				checkedList         : [],//选择的成员id数组
				user                : [],//选择的成员数据
				columns2,
				//分页
				total2              : 1, //总条数
				quickJumper2        : false, // 是否显示快速跳转的控件
				page2               : 1, //页码
				pageSize2           : 15, //每页数据条数
			};
		},

		methods: {
			changeGroupId (gData, groupId) {
				this.isLoading = true
				this.groupId = groupId
				this.gData = gData
				this.batchTypeDisabled = false
				this.getGroupList()
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
			//部门选择弹窗组件
			showDepartmentList () {
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
			},
			modalVisibleChange (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.checkedList = arr
					this.chooseNum2 = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum2 = userNum
					this.chooseDepartmentNum2 = departmentNum
					if (this.chooseNum2 > 0) {
						this.user = list
					} else {
						this.user = []
					}
				}
				this.showModalDepartment = false
			},
			//获取表格内容
			async getGroupList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("work-chat-way/list", {
					corp_id     : this.corpId,
					way_group_id: this.groupId,
					page        : page,
					page_size   : pageSize,
					title       : this.title
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
					this.keysArr = res.data.keys

					let arr = this.selectedRowKeys
					this.checkArr = []
					this.groupList.map(x => {
						this.checkArr.push(x.key)
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
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getGroupList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 180)
				})
			},
			showSizeChange (page, pageSize) {
				this.getGroupList(1, pageSize);
			},
			// 筛选
			selectTitle () {
				this.isLoading = true
				this.getGroupList(1, this.pageSize);
			},
			clearTitle () {
				this.type = '0'
				this.title = ''
				this.isLoading = true
				this.getGroupList(this.page, this.pageSize);
			},
			//新建拉群
			create () {
				let groupId = ''
				if (this.groupId.length == 0) {
					groupId = ''
				} else {
					groupId = this.groupId[0]
				}
				this.$router.push("/group/add?groupId=" + groupId)
			},
			//下载
			download (href, name) {
				let eleLink = document.createElement('a')
				eleLink.download = name
				eleLink.href = href
				eleLink.click()
				eleLink.remove()
			},
			downLoadWay (e) {
				let that = this
				let image = new Image()
				image.setAttribute('crossOrigin', 'anonymous')
				image.src = e.target.dataset.url
				image.onload = () => {
					let canvas = document.createElement('canvas')
					canvas.width = image.width
					canvas.height = image.height
					let ctx = canvas.getContext('2d')
					ctx.drawImage(image, 0, 0, image.width, image.height)
					canvas.toBlob((blob) => {
						let url = URL.createObjectURL(blob)
						that.download(url, e.target.dataset.name)
						// 用完释放URL对象
						URL.revokeObjectURL(url)
					})
				}
				// let url = e.target.dataset.url;
				//
				// let a = document.createElement('a')
				// let event = new MouseEvent('click')
				// // 下载图名字
				// a.download = e.target.dataset.name
				// //url
				// a.href = url
				// //合成函数，执行下载
				// a.dispatchEvent(event)

				// this.getBase64(url)
			},
			getBase64 (img) {
				var image = new Image();
				image.crossOrigin = 'anonymous';
				image.src = img;
				this.getBase64Image(image)
			},
			getBase64Image (img, width, height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
				var canvas = document.createElement("canvas");
				canvas.width = width ? width : img.width;
				canvas.height = height ? height : img.height;
				console.log(img, 'img')
				console.log(canvas, 'canvas')
				var ctx = canvas.getContext("2d");
				console.log(ctx, 'ctx')
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				var dataURL = canvas.toDataURL();
				console.log(dataURL, 'dataURL')
				return dataURL;
			},
			//移动
			move (id, group, type) {
				this.batchMoveType = type
				this.qrCodeId = id
				this.group = group
				this.groupVisible = true
			},
			cancelChangeGroup () {
				this.qrCodeId = ''
				this.group = ''
				this.groupVisible = false
			},
			onselectGroup (e) {
				if (e.length > 0) {
					this.group = e[0]
				}
			},
			handleChangeGroup () {
				if (this.batchMoveType == 0) {
					this.moveQrcode(this.qrCodeId)
				} else {
					this.moveQrcode(this.selectedRowKeys)
				}
			},
			async moveQrcode (id) {
				const {data: res} = await this.axios.post("work-chat-way/group-change", {
					uid     : localStorage.getItem('uid'),
					corp_id : this.corpId,
					group_id: this.group,
					way_id  : id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.batchTypeValue = false
					this.batchType = '1'
					this.qrCodeId = ''
					this.selectedRowKeys = []
					this.group = ''
					this.groupVisible = false
					this.$refs.menu.getGroupList()
				}
			},
			//批量下载
			downLoad () {
				if (this.selectedRowKeys.length == 0) {
					return false
				}
				let that = this;
				that.$confirm({
					title     : "确定下载选中的二维码吗？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.uploadQrcode();
					}
				});
			},
			async uploadQrcode () {
				const {data: res} = await this.axios.post("attachment/batch-down", {
					uid    : localStorage.getItem("uid"),
					corp_id: this.corpId,
					ids    : this.selectedRowKeys,
					type   : 2
				}, {
					responseType: 'blob'
				});
				if (res.size == 0) {
					this.$message.error("下载失败！")
				} else {
					const blob = res
					const reader = new FileReader()
					reader.readAsDataURL(blob);
					reader.onload = (e) => {
						const a = document.createElement('a')
						let name = moment(new Date()).format("YYYYMMDDHHmmss")
						a.download = name + '.zip'
						a.href = e.target.result
						document.body.appendChild(a)
						a.click()
						document.body.removeChild(a)
					};
					this.selectedRowKeys = []
					this.batchTypeValue = false
					this.batchType = '1'
				}
			},
			//详情
			detail (id, title) {
				this.detailVisible = true;
				this.isLoading2 = true
				this.detailTitle = title
				this.getDetail(id)
				// this.getQRcode(id, this.show = 1)
			},
			async getDetail (id) {
				const {data: res} = await this.axios.post(
					"work-chat-way/detail",
					{
						id: id,
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.detailData = res.data
				}
				this.isLoading2 = false
			},
			async getQRcode (scene_id) {
				const {data: res} = await this.axios.post(
					"scene/down",
					{
						scene_id: scene_id,
						show    : this.show
					}
				);
				// console.log(res)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$refs.a.innerHTML = ''
					this.qrcode(res.data.url);
				}
			},
			qrcode (url) {
				let qrcode = new QRCode('qrcode', {
					width     : 140,
					height    : 140,
					text      : url, // 二维码地址
					colorDark : "#000",
					colorLight: "#FFF",
				})
			},
			handleCancel () {
				this.detailVisible = false;
			},
			//编辑
			edit (id) {
				this.detailVisible = false
				this.$router.push({path: "/group/add", query: {id: id}});
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
						this.groupList.map(x => {
							this.selectedRowKeys.push(x.key)
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
			//明细
			definite (id, title, chat_list) {
				this.definiteTitle = title
				this.definiteId = id
				this.contact_way_id = []
				chat_list.map(x => {
					this.contact_way_id.push(x.chat_id)
				})
				this.customName = ''
				this.isJoin = 0
				this.timeType = 1
				this.joinTime = null
				this.chooseNum = 0
				this.chatArr = []
				this.chooseNum2 = 0
				this.chooseUserNum2 = 0
				this.chooseDepartmentNum2 = 0
				this.checkedList = []
				this.user = []
				this.total2 = 0
				this.page2 = 1
				this.pageSize2 = 15
				this.quickJumper2 = false
				this.isLoading3 = true
				this.getDefiniteList()
			},
			async getDefiniteList (page = 1, pageSize = this.pageSize2) {
				// let chat_ids = []
				// if(this.chatArr.length == 0){
				// 	chat_ids = this.contact_way_id
				// }else {
				// 	chat_ids = this.chatArr
				// }
				const {data: res} = await this.axios.post("work-chat-way/detail-group-num", {
					corp_id       : this.corpId,
					chat_ids      : this.chatArr,
					user_ids      : this.checkedList,
					contact_way_id: this.definiteId,
					user_name     : this.customName,
					start_time    : this.joinTime == null ? '' : (this.joinTime.length > 0 ? moment(this.joinTime[0]).format('YYYY-MM-DD HH:mm') : ''),
					end_time      : this.joinTime == null ? '' : (this.joinTime.length > 1 ? moment(this.joinTime[1]).format('YYYY-MM-DD HH:mm') : ''),
					type          : this.isJoin,
					time_type     : this.timeType,
					page          : page,
					page_size     : pageSize,
				});
				if (res.error != 0) {
					this.isLoading3 = false
					this.$message.error(res.error_msg);
				} else {
					this.definiteList = res.data.lists
					this.totalAddNum = Number(res.data.total)
					this.successAddNum = Number(res.data.success_total)
					this.outAddNum = Number(res.data.out_total)
					this.delAddNum = Number(res.data.del_total)
					this.isLoading3 = false
					this.total2 = parseInt(res.data.count);
					this.page2 = page;
					this.pageSize2 = pageSize;
					this.quickJumper2 = this.total2 > this.pageSize2;
					this.definiteVisible = true
				}
			},
			definiteDrawerClose () {
				this.definiteVisible = false
			},
			// 分页
			changePage2 (page, pageSize) {
				this.getDefiniteList(page, pageSize);
			},
			showSizeChange2 (page, pageSize) {
				this.getDefiniteList(1, pageSize);
			},
			// 时间限制
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			moment,
			//查找
			searchRecord () {
				this.isLoading3 = true
				this.getDefiniteList()
			},
			//清空
			resetRecord () {
				this.customName = ''
				this.isJoin = 0
				this.timeType = 1
				this.joinTime = null
				this.chooseNum = 0
				this.chatArr = []
				this.chooseNum2 = 0
				this.chooseUserNum2 = 0
				this.chooseDepartmentNum2 = 0
				this.checkedList = []
				this.user = []
				this.total2 = 0
				this.page2 = 1
				this.pageSize2 = 15
				this.quickJumper2 = false
				this.isLoading3 = true
				this.getDefiniteList()
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
							// disabled: record.user_status != 1,
							// name    : record.user_status,
						},
					}),
				};
			}
		},

		created () {
			this.getGroupList()
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/group/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来、返回回来
					vm.getGroupList(vm.page, vm.pageSize)
				});
			}
			if (from.path == '/group/add' && typeof to.query.isRefresh == "undefined") {
				next(vm => {
					vm.title = ''
					vm.isLoading = true
					vm.page = 1
					vm.pageSize = 15
					vm.detailVisible = false
					vm.groupId = to.query.groupId
					vm.$refs.menu.id = to.query.groupId
					vm.$refs.menu.getGroupList()
				})
			}
			if (from.path != '/group/add') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.title = ''
					vm.isLoading = true
					vm.page = 1
					vm.pageSize = 15
					vm.detailVisible = false
					vm.groupId = to.query.groupId
					vm.$refs.menu.id = ''
					vm.$refs.menu.getGroupList()
					// vm.getGroupList()
				});
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

	.detailBox {
		display: flex;
		border: 1px solid #E9E9E9;
		height: 552px;
	}

	.detailBox-left {
		width: 478px;
		border-right: 1px solid #E9E9E9;
		float: left;
	}

	.detailBox-right {
		padding: 16px;
		position: relative;
		float: left;
		height: 550px;
	}

	.left-one {
		height: 326px;
		padding: 20px;
		border-bottom: 1px solid #E9E9E9;

		.one-img {
			height: 140px;
			width: 140px;
			padding: 10px;
			border: 1px solid #E9E9E9;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			margin: auto;

			img {
				width: 130px;
				height: 130px;
			}
		}

		.one-date {
			margin-top: 10px;
			margin-bottom: 0;
			text-align: center;
		}

		.one-name {
			margin-top: 10px;
			margin-bottom: 0;
			text-align: center;
			font-size: 16px;
			color: #1A1A1A;
		}

		.one-btn {
			margin: 10px auto 0;
			width: 160px;
			height: 32px;
			display: block;
		}
	}

	.left-two {
		height: 126px;
		padding: 15px;
		border-bottom: 1px solid #E9E9E9;

		.two-title {
			color: #1A1A1A;
			font-size: 14px;
		}

		.tags-list {
			margin-top: 10px;
			height: 65px;
			overflow: auto;
		}
	}

	.left-three {
		height: 98px;
		padding: 15px;
	}

	.three-input {
		height: 100%;
		overflow: auto;
	}

	.preview-img {
		width: 328px;
		height: 55px;
	}

	.detailBox-user {
		max-height: 100px;
		margin-bottom: 16px;
		overflow: auto;
		width: 328px;
	}

	.right-content {
		height: calc(100% - 171px);
		width: 328px;
		background: #F9F9F9;
		border: 1px solid #E9E9E9;
		padding: 20px;
		overflow: auto;
	}

	.msg_content_txt {
		width: calc(100% - 46px);
		border: 1px solid #E9E9E9;
		padding: 10px 16px;
		border-radius: 4px;
		font-size: 14px;
		line-height: 21px;
		color: #1A1A1A;
		background: #FFF;
		resize: none;
		float: left;
		word-break: break-all
	}

	.active1 {
		color: #1890FF;
	}

	/deep/ .ant-tree-switcher-icon {
		vertical-align: initial;
	}

	/deep/ .ant-tree-node-content-wrapper.ant-tree-node-selected {
		background-color: #FFFFFF !important;
	}

	/deep/ .content-bd .ant-table-thead > tr > th:first-child .ant-table-header-column {
		display: none;
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

	.single-accout-cardItem {
		display: inline-block;
		height: 95px;
		background: #F9F9F9;
		border: 1px solid #E9E9E9;
		border-left: 0;
	}

	.single-accout-card .single-accout-cardItem:first-child {
		border: 1px solid #E9E9E9;
	}

	.single-accout-cardItem-num, .single-accout-cardItem-title {
		text-align: center;
		margin-bottom: 0;
	}

	.single-accout-cardItem-num {
		color: #000;
		font-weight: 700;
		font-size: 34px;
		line-height: 60px;
	}

	.time-type /deep/ .ant-select-selection--single {
		border-radius: 0;
		border-right: 0;
	}

	.date-picker /deep/ .ant-calendar-picker-input.ant-input {
		border-radius: 0;
	}

	/deep/ .ant-table-thead > tr > th, /deep/ .ant-table-tbody > tr > td {
		padding: 16px 0 16px 10px;
	}
</style>
