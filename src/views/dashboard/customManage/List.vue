<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden">
				<a-layout
						style="position: absolute;left: 0;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;"
						class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>客户管理</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="margin-top:20px;">
							<span @click="changeTab(1)" class="tabBtn" :class="{activeBtn:tabKey == 1}">企微客户</span>
							<span @click="changeTab(2)" class="tabBtn" :class="{activeBtn:tabKey == 2}">非企微客户</span>
						</div>
						<div v-show="tabKey == 1" style="padding: 15px 20px;background: #FFF;">
							<div style="font-size:16px;font-weight:700;color:#333333">客户管理</div>
							<div class="content-msg"  style="box-shadow: 0px 1px 4px 0px #D7D7D7">
								<p style="margin-bottom: 0px;">
									1、成员在外部会话中，可通过侧边栏打开【客户详情页】页面，也可以点击外部联系人（客户）头像进入到系统页面【客户信息】，再打开【客户详情页】页面。<a
										href="https://support.qq.com/products/104790/faqs/59786" target="_blank"
										class="el-link el-link--primary">
									<span class="el-link--inner">查看教程</span>
								</a>
								</p>
								<p style="margin-bottom: 0px;">
									2、在职员工/已离职员工所持有的客户数分配走后，在客户列表中不再显示原归属员工的客户。
								</p>
								<p style="margin-bottom: 0px;color: red;">
									3、如何判断粉丝是否为企业微信的外部联系人？<a
										href="https://support.qq.com/products/104790/faqs/78374" target="_blank"
										class="el-link el-link--primary">
									<span class="el-link--inner">点击查看</span>
								</a>
								</p>
								<p style="margin-bottom: 0px;color: red;">
									4、为了避免销售人员长时间沟通无果或是恶意保护占有客户资源，在达到客户回收条件时，需要将企微客户分配/共享给其他员工，进行跟踪，从而提高跟进效率，有效利用客户资源，则在【客户公海】--【企微客户】列表里生成一条该企微客户数据。
								</p>
							</div>
							<div class="content-hd">
								<div style="background-color: #FFFFFF;padding: 20px 0 10px 0;">
								<span class="select-option" v-if="corpLen > 1">
									<label style="margin-right: 5px;">企业微信：</label>
									<a-select
											v-if="corpLen > 1"
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 5px;"
											@change="handleChange"
											v-model="corpId"
									>
										<template v-for="item in corpInfo">
											<a-select-option :value="item.corpid">{{item.corp_full_name ||
												item.corp_name}}
											</a-select-option>
										</template>
									</a-select>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">关键词：</label>
									<a-input style="margin-right: 5px;width: 210px;" @keyup.enter="searchStaff"
									         placeholder="客户姓名/昵称/备注/公司名称"
									         v-model="customName"></a-input>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">手机号码：</label>
									<a-input @keyup.enter="searchStaff"
									         style="margin-right: 5px;width: 210px;"
									         :value="phoneNumber"
									         @change="phoneChange"
									         placeholder="请输入手机号码"
									/>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">城市区域：</label>
									<a-cascader
											:options="cityData"
											@change="onChange"
											v-model="province1"
											placeholder="请选择区域"
											style="width: 210px;margin-right: 5px;"
									/>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">客户性别：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 5px;"
											v-model="sexValue"
									>
										<a-select-option value="-1">全部</a-select-option>
										<a-select-option value="1">男</a-select-option>
										<a-select-option value="2">女</a-select-option>
										<a-select-option value="3">未知</a-select-option>
									</a-select>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">是否粉丝：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 5px;"
											v-model="is_fans"
									>
										<a-select-option :value="0">全部</a-select-option>
										<a-select-option :value="1">是</a-select-option>
										<a-select-option :value="2">否</a-select-option>
									</a-select>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">客户来源：</label>
									<a-tree-select
											:allowClear="true"
											:dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
											style="width: 210px; margin-right: 5px;"
											:treeData="wayList"
											placeholder='全部来源'
											treeDefaultExpandAll
											v-model="add_way"
											@change="handleChangeAddWay"
									>
									</a-tree-select>
									<span v-if="add_way == 'way' || add_way == 'redWay' || add_way == 'chatWay' || add_way == 'award' || add_way == 'fission' || this.add_way == 'redPack'"
									      style="margin: 0 10px 0 5px;">——</span>
									<a-select
											v-if="add_way == 'way' || add_way == 'redWay' || add_way == 'chatWay' || add_way == 'award' || add_way == 'fission' || this.add_way == 'redPack'"
											allowClear
											show-search
											v-model="way_id"
											placeholder="活码搜索"
											style="width: 283px; margin-right: 5px;"
											:show-arrow="true"
											optionFilterProp="children"
									>
										<a-select-option v-for="d in codeList" :value="d.value" :key="d.key">
											{{d.title}}
										</a-select-option>
									</a-select>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">公海池认领：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 5px;"
											v-model="other_way"
									>
										<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="1">是</a-select-option>
										<a-select-option :value="0">否</a-select-option>
									</a-select>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">跟进状态：</label>
									<a-select
											style="width: 210px;margin-right: 5px;"
											v-model="follow_status"
											:dropdownStyle="style"
											placeholder="全部状态"
									>
										<a-select-option :value="-1">全部状态</a-select-option>
										<a-select-option v-for="item in follows" :value="item.id">{{item.title}}<span
												v-if="item.status == 0">（已删除）</span></a-select-option>
									</a-select>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">选择群聊：</label>
									<a-button @click="showChatVisible" style="width: 210px;margin-right: 5px;">
										<span v-if="chooseNum1 > 0">已选择{{chooseNum1}}个群</span>
										<span v-else>选择群聊</span>
									</a-button>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">客户持群数：</label>
									<a-select
											style="width: 210px;margin-right: 5px;"
											v-model="chat_type"
											:dropdownStyle="style"
											placeholder="全部"
									>
										<a-select-option :value="0">全部</a-select-option>
										<a-select-option :value="1">无群</a-select-option>
										<a-select-option :value="2">一个</a-select-option>
										<a-select-option :value="3">多个</a-select-option>
									</a-select>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">是否保护：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 5px;"
											v-model="is_protect"
									>
										<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="1">已保护</a-select-option>
										<a-select-option :value="0">未保护</a-select-option>
									</a-select>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">部门成员：</label>
									<a-button @click="showDepartmentList" style="width: 210px;margin-right: 5px;">
										<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
										<span v-else>选择部门成员</span>
									</a-button>
								</span>
									<span class="select-option">
									<label style="margin-right: 5px;">添加时间：</label>
									<a-range-picker
											:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
											format="YYYY-MM-DD HH:mm"
											allowClear
											style="width:320px;margin-right: 5px;"
											:disabled-date="disabledDate"
											v-model="joinTime"
											@change="changeTime"
									/>
									<a-button type="primary" style="margin-right: 5px;"
									          @click="searchStaff">查询</a-button>
									<a-button style="margin-right: 10px;" @click="reset">重置</a-button>
									<span style="margin-right: 5px;color: #01b065; cursor: pointer;"
									      @click="seniorSelect">更多筛选</span>
								</span>
								</div>
								<div style="height: 40px;line-height: 40px;margin-top: 6px;">
								<span v-if="showCustomData">
									共
									<span style="color: #01b065">{{total}}</span>
									位客户，实际客户
									<span style="color: #01b065">{{uniqueCount}}</span>
									位。
									<!--									，重复客户-->
									<!--									<span style="color: #01b065">{{repeatCount}}</span>-->
									<!--									位。-->
								</span>
									<!--								<span @click="lookUniqueCustom(1)" v-if="showCustomData && fromUnique == 0" style="color: #01b065; cursor: pointer">查看重复客户</span>-->
									<!--								<span @click="lookUniqueCustom(0)" v-if="showCustomData && fromUnique == 1" style="color: #01b065; cursor: pointer">查看全部客户</span>-->
									<a-button style="width: 140px;" class="btn-primary1" @click="lookUniqueCustom"
									          icon="swap">
										查看重复客户
									</a-button>
									<!--								<a-button class="btn-primary1" @click="confirm" icon="reload" v-has="'sync-client'">-->
									<!--									同步客户-->
									<!--								</a-button>-->
									<a-button class="btn-primary1" @click="confirm" icon="reload" v-has="'sync-client'">
										同步客户
									</a-button>
									<a-button class="btn-primary1" @click="showModal1" type="primary" icon="tags"
									          v-has="'client-remove-tag'">
										移除标签
									</a-button>
									<a-button class="btn-primary1" @click="showModal" type="primary"
									          icon="tags" v-has="'client-add-tag'">
										打标签
									</a-button>
									<a-button class="btn-primary1" @click="leadOut" type="primary"
									          icon="download" v-has="'client-export'">
										导出客户
									</a-button>
									<a-button class="btn-primary1" @click="setOptions" type="primary"
									          icon="tool" v-has="'client-setOptions'">
										高级设置
									</a-button>

									<a-modal title="为筛选出的所有客户移除标签" v-model="visible1" @ok="handleOk1"
									         @cancel="cancelVisible2"
									         :confirmLoading="confirmLoading" width="800px">
										<label v-if="fansTag && fansTag.length>0"
										       style="display: block; margin-bottom: 10px; color: #F56C6C;">显示的标签，是当前勾选上的所有客户的全部标签。</label>
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
									<a-popconfirm
											placement="bottomRight"
											okText="确认"
											cancelText="取消"
											@confirm="confirm"
									>
									</a-popconfirm>


									<a-modal title="为筛选出的所有客户增加标签" v-model="visible" @ok="handleOk"
									         :confirmLoading="confirmLoading2" @cancel="cancelVisible" width="800px">
										<!--									<p style="color: red;margin-bottom: 10px;">-->
										<!--										已勾选{{selectedRowKeys.length}}位客户，当前最多每人可再打{{tag_num}}个标签（由于每个客户最多可打上-->
										<!--										20-->
										<!--										个标签。当批量操作时，取最接近上限的客户的剩余可打标签数）。</p>-->
										<a-form-item :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template slot="label">
												选择分组
											</template>
											<a-select showSearch optionFilterProp="children" style="width: 180px"
											          @change="changeGroup" placeholder="所有分组"
											          :dropdownStyle="{ overflow: 'hidden' }" allowClear
											          v-model="groupId">
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
										<a-button icon="plus" @click="showAddTagModal()" type="primary"
										          v-has="'client-tag-add'">
											新建标签
										</a-button>
									</a-modal>
									<a-modal title="新建标签" v-model="addTagVisible" @ok="onSearch"
									         :confirmLoading="confirmLoading3" style="height: 500px"
									         @cancel="addTagCancel">
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
									<a-table
											:rowSelection="rowSelection"
											:columns="columns"
											:dataSource="customList"
											:pagination="false"
											:rowClassName="rowClassName" v-has="'client-list'"
									>
										<div slot="customerInfo" slot-scope="text, record, index">
											<div style="width: 200px;overflow: hidden;">
												<a-avatar v-if="text.avatar" shape="square" :size="42"
												          :src="text.avatar"
												          style="float: left;"/>
												<img style="width: 42px;height: 42px;float: left;" v-if="!text.avatar"
												     src="../../../assets/useradvart.png"/>
												<div style="float: left;margin-left:10px;width: calc(100% - 52px);">
													<div>
														<a-popover placement="top">
															<template slot="content">
																{{text.name}}
																<span :class="text.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="text.corp_name != null">@{{text.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
															</template>
															<span>
														{{text.name}}
														<span :class="text.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="text.corp_name != null">@{{text.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
													</span>
														</a-popover>
														<a-icon type="man"
														        style="color: #427EBA;"
														        v-if="text.gender=='男性'"/>
														<a-icon
																type="woman"
																style="color: #ED4997;"
																v-if="text.gender=='女性'"
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
													<div v-if="record.customerInfo.nickname && record.customerInfo.nickname != ''"
													     style="color: #999;font-size: 12px;">
														姓名：{{record.customerInfo.nickname}}
													</div>
													<div v-if="record.customerInfo.area && record.customerInfo.area != ''"
													     style="color: #999;font-size: 12px;">
														地区：{{record.customerInfo.area}}
													</div>
													<div v-if="record.customerInfo.phone && record.customerInfo.phone != '' && is_hide_phone != 1"
													     style="color: #999;font-size: 12px;">
														手机：{{record.customerInfo.phone}}
													</div>
													<div v-if="record.is_protect == 1">
														<a-tag color="green">已保护</a-tag>
													</div>
												</div>
											</div>
										</div>
										<div slot="add_way_info" slot-scope="text, record, index">
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
											<div v-if="record.other_way == 1">
												<a-tag color="orange">公海池</a-tag>
											</div>
										</div>
										<div slot="tag_name" slot-scope="text, record, index">
											<div style="width: 180px;">
												<span v-if="record.tag_name.length == 0 && record.per_name.length == 0">--</span>
												<span v-if="record.per_name.length == 0 && record.tag_name.length > 0">
											<a-tag v-for="item in record.tag_name" style="margin-top: 5px;"
											       color="blue">
											{{item}}
										</a-tag>
										</span>
												<span v-if="record.tag_name.length == 0 && record.per_name.length > 0">
											私有标签：<a-tag v-for="item in record.per_name" style="margin-top: 5px;"
											            color="blue">
											{{item}}
										</a-tag>
										</span>
												<template
														v-if="record.tag_name.length > 0 && record.per_name.length > 0">
													<div>
														公有标签：
														<a-tag v-for="item in record.tag_name" style="margin-top: 5px;"
														       color="blue">
															{{item}}
														</a-tag>
													</div>
													<div>
														私有标签：
														<a-tag v-for="item in record.per_name" style="margin-top: 5px;"
														       color="blue">
															{{item}}
														</a-tag>
													</div>
												</template>
											</div>
										</div>
										<div slot="tag_name2">
											标签
											<a-tooltip placement="bottom">
												<template slot="title">
													<div>企业微信给客户打标签：分公有标签和私有标签</div>
													<div>1、公有标签：即企业标签。管理员创建，所有员工可见，在本系统定义为“公有标签”。</div>
													<div>2、私有标签：即个人标签。员工创建，仅自己可见。在本系统定义为“私有标签”）。</div>
												</template>
												<a-icon type="question-circle" style="margin-left:5px;"/>
											</a-tooltip>
										</div>
										<div slot="claimTip" slot-scope="text, record, index">
											<span v-if="text == ''">--</span>
											<span v-else>请尽快在<span style="color: red;">{{text}}</span>添加跟进记录，否则逾期后需要共享给同事</span>
										</div>
										<div slot="memberInfo" slot-scope="text, record, index">
											<div v-for="item in text">
												{{item.member}}
												<div>{{item.remark}}</div>
												<div>（{{item.create_time}}）<span
														v-if="item.del_type == 2">（已被客户删除）</span>
												</div>
											</div>
										</div>
										<div slot="followStatus" slot-scope="text, record, index">
											<a-popover placement="top">
												<template slot="content">
													<p style="margin-bottom: 0px;">
														最后跟进时间：{{record.customerInfo.update_time
														|| '--'}}</p>
												</template>
												<span style="cursor: pointer;"
												      v-if="record.customerInfo.update_time != ''">{{record.customerInfo.follow_status}}</span>
											</a-popover>
											<span style="cursor: pointer;" v-if="record.customerInfo.update_time == ''">{{record.customerInfo.follow_status}}</span>
											<div>（跟进<span style="color: #01b065;">{{record.follow_num}}</span>次）</div>
										</div>
										<div slot="phone" slot-scope="text, record, index">
											<span v-if="!record.customerInfo.phone || record.customerInfo.phone == ''">--</span>
											<span v-else>{{record.customerInfo.phone}}</span>
										</div>
										<span slot="chat_time">
						                  上次单聊时间
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>需开通消息存档功能， 且客户同意消息存档才可记录。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<span slot="action" slot-scope="text, record, index">
											<a-dropdown v-if="isShowMoreBtn">
                                            <a-menu slot="overlay" @click="e=>handleMenuClick(e,1,record,index)">
                                              <a-menu-item key="1" v-has="'client-assign'"
                                                           v-if="record.is_protect == 0 && record.is_reclaim == 1 && is_assign">
                                                转交给成员
                                              </a-menu-item>
                                              <a-menu-item key="2" v-has="'client-backHighSea'"
                                                           v-if="record.is_protect == 0 && record.is_reclaim == 1 && is_assign">
                                                退回公海
                                              </a-menu-item>
	                                            <a-menu-item key="3" v-has="'client-protect'"
	                                                         v-if="record.is_protect == 0 && record.is_show == 1 && record.is_reclaim == 1">
                                                <a-tooltip placement="top" v-if="record.is_rest != 1">
                                              <template slot="title">
                                                <span>永不进入公海池的客户数已达上限，无法再设置。</span>
                                              </template>
										<span :disabled="record.is_rest != 1"
										>设为保护对象</span>
                                            </a-tooltip>
	                                                <span :disabled="record.is_rest != 1" v-if="record.is_rest == 1">设为保护对象</span>
                                              </a-menu-item>
	                                            <a-menu-item key="4" v-has="'client-protect'"
	                                                         v-if="record.is_protect == 1">
                                                    <a-popover placement="top" v-if="record.protect_str != ''">
												<template slot="content">
													<p style="margin-bottom: 0px;">{{record.protect_str}}</p>
												</template>
												<span>取消保护</span>
											</a-popover>
		                                           <span v-if="record.protect_str == ''">取消保护</span>
                                              </a-menu-item>
	                                            <a-menu-item key="5"
	                                                         v-if='customList[index].customerInfo.merchant_type.length > 0'
	                                                         v-has="'client-bind'">
                                                客户绑定
                                              </a-menu-item>
	                                            <a-menu-item key="6" v-if="record.customerInfo.user_name.length > 0"
	                                                         v-has="'client-bind'">
                                                解绑绑定
                                              </a-menu-item>
	                                            <a-menu-item key="7" v-if="record.customerInfo.user_name.length > 0"
	                                                         v-has="'other-store'">
                                                第三方店铺
                                              </a-menu-item>
                                            </a-menu>
											<a-button style="margin-bottom: 5px;margin-right: 5px">更多操作</a-button>
										</a-dropdown>
										<a-button style="margin-bottom: 5px;margin-right: 5px"
										          @click="handleShowDetail(record.key)"
										          v-has="'client-info'">客户详情</a-button>
									</span>
									</a-table>
									<div style="padding: 0 15px;">
										<div style="margin: 20px 0px;line-height: 32px;" v-show="total > 0">
											<a-checkbox v-model="batchTypeValue"
											            @click="batchTypeChange"></a-checkbox>
											当前页
											<a-dropdown :disabled="this.selectedRowKeys.length > 0 ? false : true"
											            v-if="is_assign">
												<a-menu slot="overlay" @click="e=>handleMenuClick(e,1)">
													<a-menu-item key="1" v-has="'client-assign'">
														转交给成员
													</a-menu-item>
													<a-menu-item key="2" v-has="'client-backHighSea'">
														退回公海
													</a-menu-item>
												</a-menu>
												<a-button type="primary" style="margin-right: 5px" v-if="is_assign">客户转交
												</a-button>
											</a-dropdown>
											<a-button type="primary" style="margin-right: 5px"
											          :disabled="this.selectedRowKeys.length > 0 ? false : true"
											          @click="setProtect(1)" v-if="is_show == 1 && is_rest == 1"
											          v-has="'client-protect'">设为保护对象
											</a-button>
											<a-button type="primary" style="margin-right: 5px"
											          :disabled="this.selectedRowKeys.length > 0 && is_cancel == 1 ? false : true"
											          @click="cancelProtect(1)" v-has="'client-protect'">取消保护
											</a-button>
										</div>
										<!--分页 -->
										<div class="pagination" style="margin: 20px 0px;overflow:hidden;"
										     v-show="total > 0" v-has="'client-list'">
<!--											<div style="display: inline-block;margin-right: 10px;line-height: 32px;vertical-align: top;float: left;">-->
<!--												共-->
<!--												<span style="color: blue">{{total}}</span>-->
<!--												条-->
<!--											</div>-->
											<div class="pagination"
											     style="display: inline-block;height: 32px;float: right;">
												<a-pagination :total="total" showSizeChanger
												              :showQuickJumper="quickJumper"
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
						</div>
						<div v-show="tabKey == 2" style="padding: 15px 20px;background: #FFF;">
							<div class="content-msg">
								<p style="margin-bottom: 0px;">
									1、为了避免销售人员长时间沟通无果或是恶意保护占有客户资源，在其私有池里，当客户达到回收条件后，自动将该客户放回至【客户公海】--【非企微客户】列表。
								</p>
								<p style="margin-bottom: 0px;">
									2、当被其他员工认领后，再进入到该认领员工的私有池里，即【客户管理】--【非企微客户】列表。
								</p>
							</div>
							<div class="content-hd">
								<div style="background-color: #FFFFFF;padding: 20px 0 10px 0;">
									<span class="select-option">
										<label style="margin-right: 5px;width: 105px;">关键词：</label>
										<a-input style="width: 260px;" @keyup.enter="searchStaff2"
										         placeholder="客户姓名/手机号/微信号/QQ号/邮箱"
										         v-model="number"></a-input>
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
										<label style="margin-right: 5px;">是否保护：</label>
										<a-select
												showSearch
												optionFilterProp="children"
												style="width: 210px;"
												v-model="is_protect2"
										>
									<a-select-option :value="-1">全部</a-select-option>
									<a-select-option :value="1">已保护</a-select-option>
									<a-select-option :value="0">未保护</a-select-option>
								</a-select>
									</span>
									<span class="select-option">
										<label style="margin-right: 5px;">认领成员：</label>
										<a-button @click="showDepartmentList" style="width: 210px;margin-right: 5px;">
											<span v-if="chooseNum4 > 0">已选择{{chooseUserNum4}}名成员，{{chooseDepartmentNum4}}个部门</span>
											<span v-else>选择部门成员</span>
										</a-button>
									</span>
									<!--									<span class="select-option">-->
									<!--										<label style="margin-right: 5px;width: 105px;">绑定状态：</label>-->
									<!--										<a-select-->
									<!--												showSearch-->
									<!--												optionFilterProp="children"-->
									<!--												style="width: 210px;"-->
									<!--												v-model="bindStatus"-->
									<!--												placeholder="请选择绑定状态"-->
									<!--										>-->
									<!--											<a-select-option :value="-1">全部</a-select-option>-->
									<!--											<a-select-option :value="0">未绑定</a-select-option>-->
									<!--											<a-select-option :value="1">已绑定</a-select-option>-->
									<!--										</a-select>-->
									<!--									</span>-->
									<span class="select-option">
										<label style="margin-right: 5px;">选择标签：</label>
									<a-button @click="showChooseTag"
									          style="width: 210px;margin-right: 5px;">
										<span v-if="tags.length > 0">已选择{{tags.length}}个标签</span>
										<span v-else>选择标签</span>
									</a-button>
									</span>
									<span class="select-option">
										<label style="margin-right: 5px;">认领时间：</label>
										<a-range-picker
												:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
												format="YYYY-MM-DD HH:mm"
												allowClear
												style="width:320px;margin-right: 5px;"
												:disabled-date="disabledDate"
												v-model="claimTime"
												@change="changeTime2"
										/>
									</span>
									<a-button type="primary" style="margin-right: 5px;"
									          @click="searchStaff2">查找
									</a-button>
									<a-button style="margin-right: 10px;" @click="reset2">重置</a-button>
								</div>
								<div style="height: 40px;line-height: 40px;margin-top: 6px;">
								<span v-if="showCustomData">
									共
									<span style="color: #01b065">{{total4}}</span>
									位客户
								</span>
									<span style="float:right;">
									<a-button class="btn-primary2" @click="showModal1" type="primary" icon="tags"
									          v-has="'client-remove-tag'">
										移除标签
									</a-button>
									<a-button class="btn-primary2" @click="showModal" type="primary"
									          icon="tags" v-has="'client-add-tag'">
										打标签
									</a-button>
									<a-button type="primary" @click="recordCustomer"
									          class="btn-primary2" v-has="'client-import'">录入客户</a-button>
									<a-button type="primary" @click="importExcel" class="btn-primary2"
									          v-has="'client-import'">批量导入客户</a-button>
										</span>
								</div>
							</div>
							<!-- 表格部分 -->
							<div class="content-bd">
								<a-spin tip="加载中..." size="large" :spinning="isLoading4">
									<a-table
											:rowSelection="rowSelection"
											:columns="noCustomerColumns"
											:dataSource="noCustomerList"
											:pagination="false"
											:rowClassName="rowClassName" v-has="'client-list'"
									>
										<div slot="name" slot-scope="text, record, index">
											<div>姓名：{{record.name}}
												<a-icon type="man"
												        style="color: #427EBA;"
												        v-if="record.gender=='男'"/>
												<a-icon
														type="woman"
														style="color: #ED4997;"
														v-if="record.gender=='女'"
												/>
											</div>
											<div v-if="record.phone != ''">手机号：{{record.phone}}</div>
											<div v-if="record.wx_num != ''">微信号：{{record.wx_num}}</div>
											<div v-if="record.qq != ''">QQ号：{{record.qq}}</div>
											<div v-if="record.email != ''">邮箱：{{record.email}}</div>
											<div v-if="record.is_protect == 1">
												<a-tag color="green">已保护</a-tag>
											</div>
										</div>
										<div slot="user_name" slot-scope="text, record, index">
											{{record.user_name}}
											<!--											【-->
											<!--											<span v-if="record.is_bind == 1">已绑定企微客户</span>-->
											<!--											<span v-if="record.is_bind == 0">尚未绑定</span>-->
											<!--											】-->
										</div>
										<div slot="claimTip" slot-scope="text, record, index">
											<div v-if="record.claimTip == ''">--</div>
											<div v-else style="max-width: 150px;">请尽快在<span style="color: red;">{{record.claimTip}}</span>添加跟进记录
												，逾期后将自动变更为公海客户
											</div>
										</div>
										<div slot="tag_name" slot-scope="text, record, index">
											<div v-if="record.tag_name.length == 0">--</div>
											<div v-else style="max-width: 150px;">
												<a-tag v-for="item in record.tag_name" style="margin-top: 5px;"
												       color="blue">
													{{item}}
												</a-tag>
											</div>
										</div>
										<div slot="follow_status" slot-scope="text, record, index">
											<div>{{record.follow_status}}</div>
											<div>（跟进{{record.follow_num}}次）</div>
										</div>
										<span slot="action" slot-scope="text, record, index">
											<a-dropdown v-if="isShowMoreBtn">
                                            <a-menu slot="overlay" @click="e=>handleMenuClick(e,0,record,index)">
                                              <a-menu-item key="1" v-has="'client-assign'"
                                                           v-if="record.is_protect == 0 && is_assign">
                                                转交给成员
                                              </a-menu-item>
                                              <a-menu-item key="2" v-has="'client-backHighSea'"
                                                           v-if="record.is_protect == 0 && is_assign">
                                                退回公海
                                              </a-menu-item>
	                                            <a-menu-item key="3" v-has="'client-protect'"
	                                                         v-if="record.is_protect == 0 && record.is_show == 1">
                                                <a-tooltip placement="top" v-if="record.is_rest != 1">
                                              <template slot="title">
                                                <span>永不进入公海池的客户数已达上限，无法再设置。</span>
                                              </template>
										<span :disabled="record.is_rest != 1"
										>设为保护对象</span>
                                            </a-tooltip>
	                                                <span :disabled="record.is_rest != 1" v-if="record.is_rest == 1">设为保护对象</span>
                                              </a-menu-item>
	                                            <a-menu-item key="4" v-has="'client-protect'"
	                                                         v-if="record.is_protect == 1">
                                                    <a-popover placement="top" v-if="record.protect_str != ''">
												<template slot="content">
													<p style="margin-bottom: 0px;">{{record.protect_str}}</p>
												</template>
												<span>取消保护</span>
											</a-popover>
		                                           <span v-if="record.protect_str == ''">取消保护</span>
                                              </a-menu-item>
                                            </a-menu>
											<a-button style="margin-bottom: 5px;margin-right: 5px">更多操作</a-button>
										</a-dropdown>

										<a-button style="margin-bottom: 5px;margin-right: 5px"
										          @click="handleShowDetail2(record.key)"
										          v-has="'client-info'">客户详情</a-button>
									</span>
									</a-table>
									<div style="padding: 0 15px;">
										<div style="margin: 20px 0px;line-height: 32px;" v-show="total4 > 0">
											<a-checkbox v-model="batchTypeValue"
											            @click="batchTypeChange"></a-checkbox>
											当前页
											<a-dropdown :disabled="this.selectedRowKeys.length > 0 ? false : true"
											            v-if="is_assign">
												<a-menu slot="overlay" @click="e=>handleMenuClick(e,0)"
												        v-if="is_assign">
													<a-menu-item key="1" v-has="'client-assign'">
														转交给成员
													</a-menu-item>
													<a-menu-item key="2" v-has="'client-backHighSea'">
														退回公海
													</a-menu-item>
												</a-menu>
												<a-button type="primary" style="margin-right: 5px"
												          v-if="is_assign">客户转交
												</a-button>
											</a-dropdown>
											<a-button type="primary" style="margin-right: 5px"
											          :disabled="this.selectedRowKeys.length > 0 ? false : true"
											          @click="setProtect(0)" v-if="is_show == 1 && is_rest == 1"
											          v-has="'client-protect'">设为保护对象
											</a-button>
											<a-button type="primary" style="margin-right: 5px"
											          :disabled="this.selectedRowKeys.length > 0 && is_cancel == 1 ? false : true"
											          @click="cancelProtect(0)" v-has="'client-protect'">取消保护
											</a-button>
										</div>
										<!--分页 -->
										<div class="pagination" style="margin: 20px 0px;overflow:hidden;"
										     v-show="total4 > 0" v-has="'client-list'">
											<div style="display: inline-block;margin-right: 10px;line-height: 32px;vertical-align: top;float: left;">
												共
												<span style="color: blue">{{total4}}</span>
												条
											</div>
											<div class="pagination"
											     style="display: inline-block;height: 32px;float: right;">
												<a-pagination :total="total4" showSizeChanger
												              :showQuickJumper="quickJumper4"
												              :current="page4"
												              :pageSize="pageSize4"
												              :pageSizeOptions="['15','30','50','100']"
												              @change="changePage4"
												              @showSizeChange="showSizeChange4"/>
											</div>
										</div>
									</div>
								</a-spin>
							</div>
						</div>

						<!--部门选择框-->
						<chooseDepartment :id="corpId" ref="user" :show="showModalDepartment"
						                  :chooseNum="tabKey == 1 ? (customVisible ? chooseNum2 : chooseNum) : chooseNum4"
						                  :callback="modalVisibleChange3" :is_special="1"></chooseDepartment>
						<!--    选择标签弹窗  -->
						<a-modal v-model="chooseTagVisible" title="选择标签" @cancel="cancleChooseTag"
						         width="700px !important">
							<template slot="footer">
								<a-button @click="cancleChooseTag">关闭</a-button>
								<a-button @click="handleChoose">确定</a-button>
							</template>
							<a-select
									style="width: 270px;margin-bottom: 20px;"
									v-model="tagStyle2"
									:dropdownStyle="style" :allowClear="false"
									placeholder="请选择标签"
							>
								<a-select-option value="1">多标签或关系</a-select-option>
								<a-select-option value="2">多标签且关系</a-select-option>
							</a-select>
							<corpChooseTag :id="corpId" ref="chooseTag" :isNotAdd="1" v-if="chooseTagVisible"
							               :callback="modalVisibleChange"
							               :hasChoose="wordIds">
							</corpChooseTag>
						</a-modal>
						<a-drawer
								:destroyOnClose='true'
								title="更多筛选"
								placement="right"
								:closable="false"
								@close="onClose"
								class="scroll1"
								width="900px!important"
								:visible="seniorVisible"
						>
							<div class="sider-one">
								<span class="sider-one-txt">企业微信</span>
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 270px;"
										@change="handleChange"
										v-model="corpId"
								>
									<template v-for="item in corpInfo">
										<a-select-option :value="item.corpid">{{item.corp_full_name ||
											item.corp_name}}
										</a-select-option>
									</template>
								</a-select>
								<span class="sider-one-txt">部门成员</span>
								<a-button @click="showDepartmentList" style="width: 270px;">
									<span style="text-align: center;" v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
									<span style="text-align: center;width: 100px;" v-else>选择部门成员</span>
								</a-button>
							</div>
							<div class="sider-two">
								<span class="sider-one-txt">添加时间</span>
								<a-range-picker
										:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
										format="YYYY-MM-DD HH:mm"
										allowClear
										style="width:270px;text-align: center;"
										:disabled-date="disabledDate"
										v-model="joinTime"
										@change="changeTime"
								></a-range-picker>
								<span class="sider-one-txt">最后跟进时间</span>
								<a-range-picker
										:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59:59', 'HH:mm')], format:'HH:mm'  }"
										format="YYYY-MM-DD HH:mm"
										allowClear
										style="width:270px;margin-right: 5px;text-align: center;"
										:disabled-date="disabledDate"
										v-model="followTime"
										@change="changeFollowTime"
								></a-range-picker>
							</div>
							<div class="sider-two">
								<span class="sider-one-txt">上次单聊时间</span>
								<a-range-picker
										:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
										format="YYYY-MM-DD HH:mm"
										allowClear
										style="width:270px;margin-right: 5px;text-align: center;"
										:disabled-date="disabledDate"
										v-model="chatTime"
										@change="changeChatTime"
								></a-range-picker>
								<a-tooltip placement="bottom">
									<template slot="title">
										<span>需开通消息存档功能， 且客户同意消息存档才可记录。</span>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-tooltip>
							</div>
							<div class="sider-two">
								<span class="sider-one-txt">关键词</span>
								<a-input style="width: 270px;" @keyup.enter="searchStaff"
								         placeholder="客户姓名/昵称/备注/公司名称"
								         v-model="customName"></a-input>
								<span class="sider-one-txt">手机号码</span>
								<a-input
										style="width: 270px;"
										@keyup.enter="searchStaff"
										:value="phoneNumber"
										@change="phoneChange"
										placeholder="请输入手机号码"
								/>
							</div>
							<div class="sider-two">
								<span class="sider-one-txt">跟进次数</span>
								<a-input-group compact style="width: 270px; line-height: 32px;">
									<a-input style=" width: 120px; text-align: center"
									         placeholder="最小值" @change="followMinNumChange"
									         :value="followNum1" @blur="followNumBlur"/>
									<a-input
											style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #FFF"
											placeholder="~"
											disabled
									/>
									<a-input
											style="width: 120px; text-align: center; border-left: 0"
											placeholder="最大值" @change="followMaxNumChange"
											:value="followNum2" @blur="followNumBlur"/>
								</a-input-group>
								<!--								<a-input style="width: 210px;" @keyup.enter="searchStaff"-->
								<!--								         placeholder="请输入跟进次数"-->
								<!--								         @change="followNumChange"-->
								<!--								         :value="followNum"></a-input>-->
								<span class="sider-one-txt">绑定店铺</span>
								<a-select
										allowClear
										show-search
										optionFilterProp="children"
										v-model="signId"
										placeholder="请选择店铺"
										style="width: 270px;"
								>
									<a-select-option v-for="d in bindStoreList" :value="d.key">
										{{d.username}}
									</a-select-option>
								</a-select>
							</div>
							<div class="sider-two">
								<span class="sider-one-txt">性别</span>
								<a-form-item required
								             style="width: 270px;display: inline-block;vertical-align: middle;">
									<a-radio-group @change="sexClick" v-model="sexValue">
										<a-radio-button style="border-radius: 4px;text-align: center;" value="-1">全部
										</a-radio-button>
										<a-radio-button style="border-radius: 4px;text-align: center;" value="1">男
										</a-radio-button>
										<a-radio-button style="border-radius: 4px;text-align: center;" value="2">女
										</a-radio-button>
										<a-radio-button style="border-radius: 4px;text-align: center;" value="3">未知
										</a-radio-button>
									</a-radio-group>
								</a-form-item>
								<span class="sider-one-txt">是否粉丝</span>
								<a-select
										style="width: 270px"
										v-model="is_fans"
										:dropdownStyle="style"
										placeholder="全部"
								>
									<a-select-option :value="0">全部</a-select-option>
									<a-select-option :value="1">是</a-select-option>
									<a-select-option :value="2">否</a-select-option>
								</a-select>
							</div>
							<div class="sider-two">
								<span class="sider-one-txt">区域</span>
								<a-cascader
										:options="cityData"
										@change="onChange"
										v-model="province1"
										placeholder="请选择区域"
										style="width: 270px;text-align: left;"
								/>
								<span class="sider-one-txt">跟进状态</span>
								<a-select
										style="width: 270px"
										v-model="follow_status"
										:dropdownStyle="style"
										placeholder="全部"
								>
									<a-select-option :value="-1">全部</a-select-option>
									<a-select-option v-for="item in follows" :value="item.id">{{item.title}}<span
											v-if="item.status == 0">（已删除）</span></a-select-option>
								</a-select>
							</div>
							<div class="sider-two">
								<span class="sider-one-txt">行业</span>
								<a-select
										style="width: 270px"
										@change="changeTrade"
										v-model="trade"
										:dropdownStyle="style" allowClear
										placeholder="请选择行业"
								>
									<template v-for="(item,index) in tradeList">
										<a-select-option :value="item">{{item}}</a-select-option>
									</template>
								</a-select>
								<span class="sider-one-txt">客户持群数</span>
								<a-select
										style="width: 270px;"
										v-model="chat_type"
										:dropdownStyle="style"
										placeholder="全部"
								>
									<a-select-option :value="0">全部</a-select-option>
									<a-select-option :value="1">无群</a-select-option>
									<a-select-option :value="2">一个</a-select-option>
									<a-select-option :value="3">多个</a-select-option>
								</a-select>
							</div>
							<div class="sider-two">
								<span class="sider-one-txt">选择群聊</span>
								<a-button @click="showChatVisible" style="width: 270px;">
									<span style="text-align: center;" v-if="chooseNum1 > 0">已选择{{chooseNum1}}个群</span>
									<span style="text-align: center;" v-else>选择群聊</span>
								</a-button>
								<span class="sider-one-txt">离职分配</span>
								<a-select
										style="width: 270px"
										v-model="leave"
										:dropdownStyle="style"
										placeholder="全部"
								>
									<a-select-option :value="0">全部</a-select-option>
									<a-select-option :value="1">离职未分配</a-select-option>
									<a-select-option :value="2">离职已分配</a-select-option>
								</a-select>
							</div>

							<div class="sider-two">
								<span class="sider-one-txt">公海池认领</span>
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 270px"
										v-model="other_way"
								>
									<a-select-option :value="-1">全部</a-select-option>
									<a-select-option :value="1">是</a-select-option>
									<a-select-option :value="0">否</a-select-option>
								</a-select>
								<span class="sider-one-txt">是否保护</span>
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 270px;"
										v-model="is_protect"
								>
									<a-select-option :value="-1">全部</a-select-option>
									<a-select-option :value="1">已保护</a-select-option>
									<a-select-option :value="0">未保护</a-select-option>
								</a-select>
							</div>

							<div class="sider-two">
								<span class="sider-one-txt">客户来源</span>
								<a-tree-select
										:allowClear="true"
										:dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
										style="width: 270px; margin-right: 5px;"
										:treeData="wayList"
										placeholder='全部来源'
										treeDefaultExpandAll
										v-model="add_way"
										@change="handleChangeAddWay"
								>
								</a-tree-select>
								<label v-if="add_way == 'way' || add_way == 'redWay' || add_way == 'chatWay' || add_way == 'award' || add_way == 'fission' || this.add_way == 'redPack'"
								       style="margin: 0 10px 0 5px;color: rgba(0,0,0,0.35);">——</label>
								<a-select
										v-if="add_way == 'way'|| add_way == 'redWay' || add_way == 'chatWay' || add_way == 'award' || add_way == 'fission' || this.add_way == 'redPack'"
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
							</div>

							<div class="sider-three">
								<div v-for="(item, index) in defineField"
								     v-if="item.type == 2 || item.type == 3" style="display: inline-block;">
									<span class="sider-one-txt">{{item.title}}</span>
									<a-select
											style="width: 270px"
											v-model="fieldData[index].match"
											:dropdownStyle="style"
											placeholder="全部"
									>
										<a-select-option :value="''">全部</a-select-option>
										<a-select-option v-for="item1 in item.optionVal"
										                 :value="item1">{{item1}}
										</a-select-option>
									</a-select>
								</div>
							</div>
							<div class="sider-two">
								<span class="sider-one-txt">客户标签</span>
								<a-select
										mode="tags"
										size="default"
										:allowCear="false"
										placeholder="全部分组"
										v-model="group_id"
										style="width: 270px;margin-right: 5px;"
										@change="blurChange" showArrow
								>
									<a-select-option v-for="item in groupList" :key="String(item.id)">
										{{item.group_name}}
									</a-select-option>
								</a-select>
								<label style="color: rgba(0, 0, 0, 0.35);margin: 0px 10px 0px 5px;">——</label>
								<a-select
										style="width: 270px;margin-bottom: 20px;"
										v-model="tagStyle"
										:dropdownStyle="style" :allowClear="false"
										placeholder="请选择标签"
								>
									<a-select-option value="1">多标签或关系</a-select-option>
									<a-select-option value="2">多标签且关系</a-select-option>
								</a-select>
								<div class="sider-tags" style="margin-bottom: 50px;margin-left: 105px;">
									<a-checkable-tag
											style="margin: 0px 5px 11px;height: 30px; line-height: 28px;padding: 0 10px;"
											v-model="checked3"
											@change="changeNoTag"
									>无标签
									</a-checkable-tag>
									<template v-for="(item,index) in tagsList2">
										<a-checkable-tag
												style="margin: 0px 5px 11px;height: 30px; line-height: 28px;padding: 0 10px;"
												v-model="checked2[index]"
												@change="changeTag(item.key)"
										>{{item.tagname}}
										</a-checkable-tag>
									</template>
								</div>
							</div>
							<div class="sider-footer">
								<a-button type="primary" style="margin-right: 25px;" @click="searchStaff">确定查找
								</a-button>
								<a-button @click="reset">清空条件</a-button>
							</div>
						</a-drawer>
						<a-drawer
								:destroyOnClose='true'
								title="重复客户"
								placement="right"
								:closable="false"
								@close="onClose1"
								width="1100px!important"
								:visible="customVisible"
						>
							<div style="background-color: #FFFFFF;padding: 20px 10px 10px 10px;">
								<span class="select-option" v-if="corpLen > 1">
									<label style="margin-right: 5px;">企业微信：</label>
									<a-select
											v-if="corpLen > 1"
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 5px;"
											@change="handleChange"
											v-model="corpId"
									>
										<template v-for="item in corpInfo">
											<a-select-option :value="item.corpid">{{item.corp_full_name ||
												item.corp_name}}
											</a-select-option>
										</template>
									</a-select>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">关键词：</label>
									<a-input style="margin-right: 5px;width: 210px;" @keyup.enter="searchStaff1"
									         placeholder="客户姓名/昵称/备注/公司名称"
									         v-model="customName1"></a-input>
								</span>
								<!--								<span class="select-option">-->
								<!--									<label style="margin-right: 5px;">手机号码：</label>-->
								<!--									<a-input @keyup.enter="searchStaff1"-->
								<!--									         style="margin-right: 5px;width: 210px;"-->
								<!--									         :value="phoneNumber1"-->
								<!--									         @change="phoneChange1"-->
								<!--									         placeholder="请输入手机号码"-->
								<!--									/>-->
								<!--								</span>-->
								<span class="select-option">
									<label style="margin-right: 5px;">城市区域：</label>
									<a-cascader
											:options="cityData"
											@change="onChange1"
											v-model="province3"
											style="width: 210px;margin-right: 5px;"
									/>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">客户性别：</label>
									<a-select
											showSearch
											optionFilterProp="children"
											style="width: 210px;margin-right: 5px;"
											v-model="sexValue1"
									>
										<a-select-option value="-1">全部</a-select-option>
										<a-select-option value="1">男</a-select-option>
										<a-select-option value="2">女</a-select-option>
										<a-select-option value="3">未知</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">选择群聊：</label>
									<a-button @click="showChatVisible1" style="width: 210px;margin-right: 5px;">
										<span v-if="chooseNum3 > 0">已选择{{chooseNum3}}个群</span>
										<span v-else><a-icon type="plus"/> 选择群聊</span>
									</a-button>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">客户持群数：</label>
									<a-select
											style="width: 210px;margin-right: 5px;"
											v-model="chat_type1"
											:dropdownStyle="style"
											placeholder="全部"
									>
										<a-select-option :value="0">全部</a-select-option>
										<a-select-option :value="1">无群</a-select-option>
										<a-select-option :value="2">一个</a-select-option>
										<a-select-option :value="3">多个</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">部门成员：</label>
									<a-button @click="showDepartmentList()" style="width: 210px;margin-right: 5px;">
										<span v-if="chooseNum2 > 0">已选择{{chooseUserNum2}}名成员，{{chooseDepartmentNum2}}个部门</span>
										<span v-else>选择部门成员</span>
									</a-button>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">添加时间：</label>
									<a-range-picker
											:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
											format="YYYY-MM-DD HH:mm"
											allowClear
											style="width:320px;margin-right: 5px;"
											:disabled-date="disabledDate"
											v-model="joinTime1"
											@change="changeTime1"
									/>
									<a-button type="primary" style="margin-right: 5px;"
									          @click="searchStaff1">查询</a-button>
									<a-button style="margin-right: 10px;" @click="reset1">重置</a-button>
								</span>
							</div>
							<div class="content-bd" style="padding: 10px;">
								<a-spin tip="加载中..." size="large" :spinning="isLoading1">
									<a-table
											:columns="columns1"
											:dataSource="customList1"
											:pagination="false" class="repeat-table"
											:rowClassName="rowClassName" v-has="'client-list'"
									>
										<div slot="customerInfo" slot-scope="text, record, index">
											<div style="width: 200px;overflow: hidden;">
												<a-avatar v-if="text.avatar" shape="square" :size="42"
												          :src="text.avatar"
												          style="float: left;"/>
												<img style="width: 42px;height: 42px;float: left;" v-if="!text.avatar"
												     src="../../../assets/useradvart.png"/>
												<div style="float: left;margin-left:10px;width: calc(100% - 52px);">
													<div>
														<a-popover placement="top">
															<template slot="content">
																{{text.name}}
																<span :class="text.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="text.corp_name != null">@{{text.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
															</template>
															<span>
														{{text.name}}
														<span :class="text.corp_name != null ? 'corp-name' : 'wx-name'">
															<template
																	v-if="text.corp_name != null">@{{text.corp_name}}</template>
															<template v-else>@微信</template>
														</span>
													</span>
														</a-popover>
														<a-icon type="man"
														        style="color: #427EBA;"
														        v-if="text.gender=='男性'"/>
														<a-icon
																type="woman"
																style="color: #ED4997;"
																v-if="text.gender=='女性'"
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
													<div v-if="record.customerInfo.nickname && record.customerInfo.nickname != ''"
													     style="color: #999;font-size: 12px;">
														姓名：{{record.customerInfo.nickname}}
													</div>
													<div v-if="record.customerInfo.area && record.customerInfo.area != ''"
													     style="color: #999;font-size: 12px;">
														地区：{{record.customerInfo.area}}
													</div>
													<div v-if="record.customerInfo.phone && record.customerInfo.phone != ''"
													     style="color: #999;font-size: 12px;">
														手机：{{record.customerInfo.phone}}
													</div>
												</div>
											</div>
										</div>
										<div slot="chat_name" slot-scope="text, record, index">
											<span v-if="text.length == 0">--</span>
											<a-popover placement="left">
												<template slot="content">
													<div style="max-height: 500px; overflow-y: auto;">
														<div v-for="(item,index) in text"
														     style="max-width: 500px;display: block;margin-bottom: 5px;">
															<span style="display: inline-block;font-weight: 700;width: 80px;text-align: right; vertical-align: top;">群{{index + 1}}：</span>
															<span style="width: calc(100% - 110px); display: inline-block; margin-bottom: 3px;word-break: break-all;">{{item.name}}（{{item.join_time}}）</span>
														</div>
													</div>
												</template>
												<span style="cursor: pointer;"
												      v-if="text.length > 0">{{text.length}}个</span>
											</a-popover>
										</div>
										<div slot="tag_name" slot-scope="text, record, index">
											<div style="width: 250px;">
												<span v-if="record.tag_name.length == 0 && record.per_name.length == 0">--</span>
												<span v-if="record.per_name.length == 0 && record.tag_name.length > 0">
													<a-tag v-for="item in record.tag_name" style="margin-top: 5px;"
													       color="blue">
														{{item}}
													</a-tag>
												</span>
												<span v-if="record.tag_name.length == 0 && record.per_name.length > 0">
													私有标签：<a-tag v-for="item in record.per_name" style="margin-top: 5px;"
													            color="blue">
													{{item}}
													</a-tag>
												</span>
												<template
														v-if="record.tag_name.length > 0 && record.per_name.length > 0">
													<div>
														公有标签：
														<a-tag v-for="item in record.tag_name" style="margin-top: 5px;"
														       color="blue">
															{{item}}
														</a-tag>
													</div>
													<div>
														私有标签：
														<a-tag v-for="item in record.per_name" style="margin-top: 5px;"
														       color="blue">
															{{item}}
														</a-tag>
													</div>
												</template>
											</div>
										</div>
										<div slot="tag_name2">
											标签
											<a-tooltip placement="bottom">
												<template slot="title">
													<div>企业微信给客户打标签：分公有标签和私有标签</div>
													<div>1、公有标签：即企业标签。管理员创建，所有员工可见，在本系统定义为“公有标签”。</div>
													<div>2、私有标签：即个人标签。员工创建，仅自己可见。在本系统定义为“私有标签”）。</div>
												</template>
												<a-icon type="question-circle" style="margin-left:5px;"/>
											</a-tooltip>
										</div>
										<div slot="memberInfo" slot-scope="text, record, index">
											<div v-for="item in text">
												{{item.member}}
												<div>{{item.remark}}</div>
												（{{item.create_time}}）<span
													v-if="item.del_type == 2">（已被客户删除）</span><span
													v-if="item.del_type == 1">（员工删除客户）</span>
											</div>
										</div>
									</a-table>
									<!--								 分页 -->
									<div class="pagination"
									     style="width: 100%;position: absolute;margin: 20px 0px 80px;"
									     v-show="total1 > 0" v-has="'client-list'">
										<div style="height: 32px;float: left;line-height: 32px;">
											共
											<span style="color: blue">{{total1}}</span>
											条
										</div>
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination :total="total1" showSizeChanger :showQuickJumper="quickJumper"
											              :current="page1"
											              :pageSize="pageSize1"
											              :pageSizeOptions="['15','30','50','100']"
											              @change="changePage1"
											              @showSizeChange="showSizeChange1"/>
										</div>
									</div>
								</a-spin>
							</div>
						</a-drawer>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
		<!--  客户绑定  -->
		<a-modal width="888px" title="客户绑定" v-model="bindStoreVisible">
			<template slot="footer">
				<a-button key="back" @click="handleCancelBind">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:disabled="selectedRowKeys1.length == 0"
						:loading="loading"
						@click="handleBind"
				>确定绑定
				</a-button>
			</template>
			<div>目前您已绑定<span v-for="item in storeTypeList">【{{item}}】</span>第三方店铺。<span style="color: #FF562D;">对客户绑定后，可获取到该客户在已绑定的店铺里产生的所有订单和会员情况。</span>
			</div>
			<div style="margin-top: 10px;">
				<label>绑定客户：</label>
				<a-input style="width: 695px;" @keyup.enter="selectStore" allowClear v-model="cardNo"
				         placeholder="凭手机号、会员卡号、任意订单号绑定客户"></a-input>
				<a-button style="margin-left: 10px;" @click="selectStore">搜索</a-button>
			</div>
			<div v-if="noData"
			     style="margin-top: 10px;text-align: center;color: #FF562D">暂无数据
			</div>
			<div v-if="memberList.length != 0" style="margin-top: 10px;">搜索结果</div>
			<div style="width: 100%;">
				<a-spin tip="加载中..." size="large" v-if="memberList.length != 0" :spinning="memberLoading">
					<a-table
							class="bind-table"
							style="margin-top: 10px;"
							:rowSelection="rowSelection1"
							:rowKey="record => record.key"
							:columns="memberColumns"
							:dataSource="memberList"
							:pagination="false"
							:rowClassName="rowClassName"
					>
						<span slot="isBind" slot-scope="text, record, index">
							<span v-if="text==0">未绑定</span>
							<span v-if="text==1">已绑定</span>
		                </span>
					</a-table>
				</a-spin>
			</div>
		</a-modal>
		<!--  客户解绑  -->
		<a-modal width="888px" title="客户解绑" v-model="unbindStoreVisible">
			<template slot="footer">
				<a-button key="back" @click="handleCancelUnbind">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading"
						:disabled="selectKeys.length == 0"
						@click="handleUnbind"
				>提交
				</a-button>
			</template>
			<div class="content-msg" style="margin: 0 0 12px;">
				<p style="margin-bottom: 0px;">
					一旦解绑，已绑定在本系统的存量数据将不再展示，同时，已绑定过的客户也将全部解绑，确定解绑吗？
				</p>
			</div>
			<div>
				解绑店铺
			</div>
			<div v-for="item in storeList" style="margin: 10px 0 0 10px;">
				<a-checkbox :checked="checkedStroe(item.key)" @change="changeCheckedBox(item.key)"></a-checkbox>
				<label style="margin-left: 5px;">{{item.username}}</label>
			</div>
		</a-modal>

		<!--选择群聊弹窗-->
		<groupChat :corpId="corpId" :show="chatVisible" :chatArr="uniqueType == 0 ? chatArr : chatArr1"
		           :callback="groupChatCallBack" :is_list="is_list"></groupChat>

		<!-- 导出进度条弹窗 -->
		<a-modal v-model="progressVisible" title="导出进度" :footer="false" :closable="progressCloseable"
		         :maskClosable="false"
		         :maskStyle="{'left':leftSiderWidth}" :wrapClassName="'mask-dialog'" @cancel="progressCancel">
			<div style="text-align: center;">
				<a-progress class="download-progress" stroke-linecap="square" :percent="progressNum" type="circle"
				            :width="progressWidth"/>
				<p style="margin: 20px auto;" v-if="progressNum == 100">已导出成功，请点击<span
						style="color: #01b065;cursor: pointer;" @click="progressDownload">下载</span></p>
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
							:options="cityData2"
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
					<corpChooseTag :callback="modalVisibleChange4"
					               :hasChoose="tag_arr" v-if="isShowTag"></corpChooseTag>
					<template v-if="!isShowTag">
						<a-tag color="#01b065" v-for="item in tagData">
							{{item.tname}}
						</a-tag>
						<span v-if="tagData.length == 0">暂无</span>
					</template>
				</a-form-item>
			</div>
		</a-modal>

		<!-- 上传表格弹窗 -->
		<a-modal
				title="上传表格"
				v-model="upLoadShowModal"
				@cancel="upLoadHandleCancel"
				@ok="upLoadHandleOk"
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
					               :hasChoose="tag_arr3" v-if="isShowTag"></corpChooseTag>
				</a-form-item>
			</div>
		</a-modal>

		<!-- 上传进度条弹窗 -->
		<a-modal v-model="progressVisible2" title="上传进度" :footer="false" :closable="false" :maskClosable="false"
		         :maskStyle="{'left':leftSiderWidth2}" :wrapClassName="'mask-dialog'">
			<div style="text-align: center;">
				<a-progress stroke-linecap="square" :percent="progressNum2" type="circle"/>
				<div>
					<img src="../../../assets/loadingGif.gif" alt="">
				</div>
				<p style="margin: 0 auto 20px;">已成功上传{{successNum2}}个客户，失败{{failNum2}}个客户，还有{{notImportNum2}}个客户待上传</p>
			</div>
		</a-modal>

		<!-- 选择成员组件-单选 -->
		<a-modal
				title="选择成员"
				v-model="showModalStaff" @cancel="chooseStaffCancel" @ok="chooseStaffHandel">
			<div style="color: red;margin-bottom: 10px;">指定分配给具有外部联系人权限的成员</div>
			<chooseStaffSelect style="" :index="0" :index2="0" ref="staff"
			                   :callback="selectStaffCallback"></chooseStaffSelect>
		</a-modal>

		<!--  设置配置项  -->
		<a-modal title="设置配置项" v-model="setOptionsVisible" width="888px!important">
			<template slot="footer">
				<a-button key="back" @click="handleCancelSetOptions">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading"
						@click="handleSetOptions"
				>提交
				</a-button>
			</template>
<!--			<div class="content-msg" style="margin: 0 0 12px;">-->
<!--				<p style="margin-bottom: 0px;">-->
<!--					默认配置项可展示在其他员工端即内容可共享，若勾选则勾选内容不展示，仅自己可见-->
<!--				</p>-->
<!--			</div>-->
			<a-row class="checkbox-row">
				<span style="font-weight: 700;">隐藏手机号：</span>
				<a-switch v-model="isHidePhone" style="margin-right: 10px;vertical-align: top;"/>
				<a-popover placement="top">
					<template slot="content">
						<span style="display: inline-block;width: 370px;font-size: 13px;">一旦开启后，将在PC端后台和手机端页面，原本展示客户的手机号将全部隐藏，如客户详情页，但不影响数据导出。</span>
					</template>
					<a-icon type="question-circle" style="margin-left:5px; cursor: pointer;"/>
				</a-popover>
			</a-row>
			<a-row class="checkbox-row">
				<span style="font-weight: 700">信息共享：</span><span style="color: #ff562D;">当同一个客户存在被多个员工归属时，当前默认不勾选，客户信息为共享可见或是编辑后共享。反之，客户信息独立。</span>
				<a-popover placement="right">
					<template slot="content">
						<div style="width: 220px;word-break: break-all;">
							<span style="font-size: 13px;">考虑到官方填写的客户信息页面，为员工与客户一一对应，非共享可见，故将客户同步至本系统里，此类信息不作配置项。</span>
							<img style="width: 200px;margin-top: 5px" src="../../../assets/customManage/guide.png"/>
						</div>
					</template>
					<a-icon type="question-circle" style="margin-left:5px; cursor: pointer;"/>
				</a-popover>
			</a-row>
			<a-row class="checkbox-row">
				<a-checkbox v-model="unshare_chat">
					所在群
				</a-checkbox>
			</a-row>
			<a-row class="checkbox-row">
				<a-checkbox v-model="unshare_follow">
					跟进记录
				</a-checkbox>
			</a-row>
			<a-row class="checkbox-row">
				<a-checkbox v-model="unshare_line">
					互动轨迹
				</a-checkbox>
			</a-row>
			<a-row class="checkbox-row" style="border-top: 1px solid #F2F2F2;padding-top: 10px;">
				<a-checkbox v-model="unshare_field" :disabled="unshare_field2 == 1">
					客户画像
				</a-checkbox>
				<div style="color: #999;margin-top: 10px;">注意：为了避免来回勾选导致客户画像信息错乱，故勾选提交后，则不能再次操作。</div>
			</a-row>
		</a-modal>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import groupChat from "@/components/GroupChat.vue"
	import cityData from "../../../common/js/citydata.js";
	import cityData2 from "../../../common/js/citydata2.js";
	import moment from 'moment';
	import img from '../../../assets/chat.png'
	import chooseStaffSelect from "@/components/ChooseStaffSelect.vue"
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"

	const columns = [
		{
			title      : "客户信息",
			dataIndex  : "customerInfo",
			scopedSlots: {customRender: "customerInfo"},
			key        : "customerInfo"
		},
		{
			title      : "来源",
			dataIndex  : "add_way_info",
			key        : "add_way_info",
			// width    : '180px',
			scopedSlots: {customRender: "add_way_info"},
		},
		{
			// title      : "标签",
			dataIndex  : "tag_name",
			key        : "tag_name",
			slots      : {title: "tag_name2"},
			scopedSlots: {customRender: "tag_name"},
		},
		{
			title      : "共享提醒",
			dataIndex  : "claimTip",
			key        : "claimTip",
			scopedSlots: {customRender: "claimTip"}
		},
		{
			title      : "归属成员",
			dataIndex  : "memberInfo",
			key        : "memberInfo",
			scopedSlots: {customRender: "memberInfo"},
		},
		{
			title      : "跟进状态",
			dataIndex  : "followStatus",
			key        : "followStatus",
			width      : 120,
			scopedSlots: {customRender: "followStatus"},
		},
		// {
		// 	// title    : "上次单聊时间",
		// 	dataIndex: "chat_time",
		// 	key      : "chat_time",
		// 	width      : 150,
		// 	slots    : {title: "chat_time"},
		// },
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '240px',
			scopedSlots: {customRender: "action"}
		}
	];
	const columns1 = [
		{
			title      : "客户信息",
			dataIndex  : "customerInfo",
			scopedSlots: {customRender: "customerInfo"},
			key        : "customerInfo"
		},
		{
			// title      : "所属标签",
			dataIndex  : "tag_name",
			key        : "tag_name",
			slots      : {title: "tag_name2"},
			scopedSlots: {customRender: "tag_name"},
		},
		{
			title      : "归属成员（添加时间）",
			dataIndex  : "memberInfo",
			key        : "memberInfo",
			scopedSlots: {customRender: "memberInfo"},
		}
	];
	const memberColumns = [
		{
			title    : "店铺名称",
			dataIndex: "name",
			key      : "name"
		},
		{
			title    : "会员昵称",
			dataIndex: "nickName",
			key      : "nickName"
		},
		{
			title    : "等级",
			dataIndex: "gradeName",
			key      : "gradeName"
		},
		{
			title    : "积分",
			dataIndex: "points",
			key      : "points"
		},
		{
			title    : "经验值",
			dataIndex: "exp",
			key      : "exp"
		},
		{
			title    : "余额",
			dataIndex: "money",
			key      : "money"
		},
		{
			title    : "订单数",
			dataIndex: "orderCount",
			key      : "orderCount"
		},
		{
			title      : "状态",
			dataIndex  : "isBind",
			scopedSlots: {customRender: "isBind"},
			key        : "isBind"
		},
	];
	const noCustomerColumns = [
		{
			title      : "客户信息",
			dataIndex  : "name",
			key        : "name",
			scopedSlots: {customRender: "name"}
		},
		{
			title    : "来源",
			dataIndex: "source",
			key      : "source"
		},
		{
			title      : "认领成员",
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {customRender: "user_name"}
		},
		{
			title      : "回收提醒",
			dataIndex  : "claimTip",
			key        : "claimTip",
			scopedSlots: {customRender: "claimTip"}
		},
		{
			title      : "标签",
			dataIndex  : "tag_name",
			key        : "tag_name",
			scopedSlots: {customRender: "tag_name"}
		},
		{
			title      : "跟进状态",
			dataIndex  : "follow_status",
			key        : "follow_status",
			scopedSlots: {customRender: "follow_status"}
		},
		{
			title    : "认领时间",
			dataIndex: "add_time",
			key      : "add_time"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '100px',
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "customManageList",
		components: {chooseDepartment, groupChat, chooseStaffSelect, corpChooseTag},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				img,
				moment,
				corpLen      : JSON.parse(localStorage.getItem('corpArr')).length,
				corpInfo     : [], //企业微信列表
				corpId       : corpId,//企业微信选中的id
				is_hide_phone: 0,
				customList   : [], //表格信息
				isLoading    : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				columns1,
				showCustomData: false,
				uniqueCount   : 0,
				// repeatCount        : 0,
				fromUnique: 0,
				//分页
				total              : 1, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				page               : 1, //页码
				pageSize           : 15, //每页数据条数
				checkedList        : [],//选择的成员id数组
				showModalDepartment: false, //成员选择框显示与隐藏
				chooseNum          : 0,//部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				userList           : [],
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
				checked: [],
				//打标签
				visible: false,
				//移除标签
				visible1       : false,
				tagCheckValue1 : [],//选中的tag
				tagsList       : [], //标签列表
				tagCheckValue  : [],//选中的tag
				addTagVisible  : false,//新建标签弹窗显示与隐藏
				confirmLoading3: false, //新建标签弹框加载
				inputValue     : '',//新建标签输入框值
				editGroupId    : '',//新建标签弹窗里的选中的分组id
				keysArr        : [],//所有客户的键值
				groupList      : [], // 小组列表
				groupId        : '-1', // 选中的小组id
				tagLoading     : false,//增加标签弹窗加载的显示与隐藏
				//客户跟进
				followRecord: [],//跟进记录数据
				//滚动条
				showTransition: 1,
				mouseEnterFlag: false,
				startY        : 0,
				scrollFlag    : false,
				scroRight     : true,
				scrollOutFlag : false,
				endOpen       : false,
				group_id      : [],
				follows       : [], // 跟进状态列表
				follow_status : -1, // 跟进状态
				chat_type     : 0,  // 持群数类型
				leave         : 0,//1离职未分配 2离职已分配 0全部
				add_way       : [], // 客户来源
				wayList       : [], // 客户来源列表
				way_id        : [], // 二维码id
				codeList      : [], // 二维码列表
				sexValue      : "-1", //性别,0未知，1男，2女
				is_fans       : 0,//是否粉丝，0全部，1是，2否
				other_way     : -1,//公海池认领，全部-1 是1 否0
				is_protect    : -1, //是否保护，-1全部，1已保护，0未保护
				joinTime      : null, //添加时间
				followTime    : null, // 最后跟进时间
				chatTime      : null,
				s_time        : '',
				e_time        : '',
				customName    : '',//客户姓名/公司名称
				phoneNumber   : '',//手机号
				// followNum          : '',
				followNum1   : '',
				followNum2   : '',
				signId       : [],
				bindStoreList: [],
				// 地域
				cityData,
				province1  : ["全部"],
				province   : '',
				city       : '',
				tradeList  : [],//行业列表
				defineField: [], // 客户筛选属性
				fieldData  : [], // 客户选中筛选的属性
				trade      : [],//选择的行业
				work       : '',//选择的行业
				//下拉菜单样式
				style: {width: "200px"},
				// 左侧标签
				tagStyle          : '1',//标签或1，并集且2
				tagsList2         : [], //标签列表
				checked2          : [],
				checked3          : false,
				noTag             : 0,
				tag_arr           : [], //标签值数组
				tag_ids           : "", //标签值
				tagCheckIndex     : 0,
				initChecked       : [],
				newChecked        : [],
				diffChecked       : [],
				userKey           : '', // 客户key
				bindStoreVisible  : false, // 绑定店铺弹窗
				loading           : false, // 确认绑定按钮加载
				noData            : false, // 客户绑定搜索暂无数据
				storeTypeList     : ['智慧店铺', '有赞', '淘宝/天猫'], // 店铺类型
				memberColumns,
				memberLoading     : false, // 搜索弹窗加载
				memberList        : [], // 绑定搜索表格信息
				cardNo            : '', // 绑定搜索的手机号卡号订单号
				selectedRowKeys1  : [], // 选中的店铺
				unbindStoreVisible: false, // 解绑弹窗
				storeList         : [],
				selectKeys        : [],
				seniorVisible     : false, // 高级筛选弹窗
				customVisible     : false,
				chooseNum1        : 0,

				chatVisible         : false,//群聊弹窗的显示与隐藏
				is_list             : 0,//选择群聊弹窗是否做权限可见范围限制，1限制
				checkedKey          : 0,
				chatArr             : [],//选择的群聊数据
				uniqueType          : 0,
				customName1         : '',
				phoneNumber1        : '',
				province3           : ['全部'],
				province2           : '',
				city1               : '',
				sexValue1           : '-1',
				chooseNum3          : 0,
				chat_type1          : 0,
				chooseNum2          : 0, // 部门成员总个数
				chooseUserNum2      : 0,//成员个数
				chooseDepartmentNum2: 0,//部门个数
				checkedList1        : [],
				userList1           : [],
				joinTime1           : null,
				customList1         : [], //表格信息
				total1              : 0,
				page1               : 0,
				pageSize1           : 15,
				isLoading1          : true, //Loading 组件显示与隐藏
				chatArr1            : [],//选择的群聊数据
				is_export           : 0,//是否导出客户，1导出，0不导
				//导出进度条弹窗
				progressVisible  : false,//进度条弹窗显示与隐藏
				progressNum      : 0,//进度条进度
				leftSiderWidth   : document.getElementsByClassName('menu-sider')[0].style.width,
				downLoadUrl      : '',//下载链接
				progressWidth    : 120,//进度条的宽度
				progressCloseable: false,
				//切换tab
				tabKey: 1,//1企微客户，2非企微客户
				//非企微客户
				number              : '',//搜索的微信号
				selectList          : [],//客户来源列表
				addStatus           : 0,//客户来源
				is_protect2         : -1, //是否保护，-1全部，1已保护，0未保护
				bindStatus          : -1,//绑定状态
				chooseNum4          : 0, // 部门成员总个数
				chooseUserNum4      : 0,//成员个数
				chooseDepartmentNum4: 0,//部门个数
				checkedList4        : [],//选择的成员
				userList4           : [],
				claimTime           : null,//认领时间
				isLoading4          : true, //Loading 组件显示与隐藏
				noCustomerList      : [],//列表数据
				noCustomerColumns,
				chooseTagVisible    : false,     // 选择标签弹窗显示隐藏
				tags                : [],        // 筛选选择的标签
				wordIds             : [],        // 选择标签弹窗的标签
				tagStyle2           : '1',//标签或1，并集且2
				tagType2            : '1',//做缓存，传给接口，标签或1，并集且2
				//分页
				total4      : 0, //总条数
				quickJumper4: false, // 是否显示快速跳转的控件
				page4       : 1, //页码
				pageSize4   : 15, //每页数据条数
				//详情
				detailVisible: false,//详情显示与隐藏
				detailTitle  : '',//详情标题
				user_id      : 0,//当前账号对应的成员id
				//录入客户
				recordVisible: false,//录入客户弹窗的显示与隐藏
				recordLoading: false,//确认按钮加载
				recordName   : '',//姓名
				recordWx     : '',//微信号
				recordQQ     : '',//QQ号
				recordPhone  : '',//手机号
				recordCompany: '',//公司名称
				recordEmail  : '',//Email
				recordSex    : 1,//性别
				recordRemark : '',//备注
				recordStatus : [],//客户来源id
				recordStatus2: '',//客户来源名称
				isShowTag    : false,
				tag_arr2     : [], //标签值
				tagData      : [],//标签数据
				// 地域
				cityData2,
				recordArea : [],
				recordArea2: '',
				id         : '',//编辑的id
				//上传表格
				upLoadShowModal: false,//弹窗的显示与隐藏
				modalLoading   : false,//弹窗确认键的加载
				fileInfo       : {}, //上传excel的文件信息
				file_name      : '', //上传excel的名称
				tag_arr3       : [], //标签值
				//上传进度条弹窗
				progressVisible2: false,//进度条弹窗显示与隐藏
				progressNum2    : 0,//进度条进度
				leftSiderWidth2 : document.getElementsByClassName('menu-sider')[0].style.width,
				successNum2     : 0,//成功上传人数
				failNum2        : 0,//失败上传人数
				notImportNum2   : 0,//待上传人数
				//成员转交
				is_assign     : true,//客户转交按钮的显示与隐藏，针对权限
				assignType    : 1,//0非企微客户、1企微客户
				assignRecord  : '',//成员转交的该行信息
				showModalStaff: false,//选择成员弹窗的显示与隐藏
				userId        : [],//选择的成员id
				userName      : [],//选择的成员name
				//批量操作
				batchTypeValue: false,//选择当前页，是否选中
				checkArr      : [],//选择当前页，保存的key
				is_rest       : 1,
				is_show       : 1,
				is_cancel     : 1,//批量取消保护，1显示，0不显示
				isShowMoreBtn : true,//是否展示更多操作按钮
				//设置配置项弹窗
				setOptionsVisible: false,//设置配置项弹窗的显示与隐藏
				unshare_chat     : false,//不共享所在群1是0否
				unshare_follow   : false,//不共享跟进记录1是0否
				unshare_line     : false,//不共享互动轨迹1是0否
				unshare_field    : false,//不共享客户画像1是0否
				isHidePhone      : false,//是否隐藏手机号
				unshare_chat2    : false,//缓存不共享所在群1是0否
				unshare_follow2  : false,//缓存不共享跟进记录1是0否
				unshare_line2    : false,//缓存不共享互动轨迹1是0否
				unshare_field2   : false,//缓存不共享客户画像1是0否
				isHidePhone2     : false,//缓存是否隐藏手机号
			};
		},

		methods : {
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
				this.isShowTag = false
				this.tag_arr2 = []
				this.tagData = []
			},
			modalVisibleChange4 (event, arr) {
				if (event == "ok") {
					this.tag_arr2 = arr.split(',')
				}
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
				if (this.recordArea.length > 0) {
					area = this.recordArea[0] + '-' + this.recordArea[1]
				}
				const {data: res} = await this.axios.post(
					"public-sea-customer/set-follow-user",
					{
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem('sub_id'),
						uid            : localStorage.getItem("uid"),
						corp_id        : this.corpId,
						user_id        : this.user_id,
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
						tag_ids        : this.tag_arr2
					}
				);
				if (res.error != 0) {
					this.recordLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.recordLoading = false
					this.recordCancel()
					this.getNoCustomer()
				}
			},
			//导入Excel
			importExcel () {
				this.file_name = ''
				this.fileInfo = {}
				this.tag_arr3 = []
				this.isShowTag = true
				this.upLoadShowModal = true
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
			async upLoadHandleOk () {
				this.modalLoading = true
				if (JSON.stringify(this.fileInfo) == '{}') {
					this.$message.error('请选择上传Excel');
					this.modalLoading = false
					return false;
				}
				this.$message.info("已进入后台导入中，请耐心等待...");
				this.progressNum2 = 0
				this.successNum2 = 0
				this.failNum2 = 0
				this.notImportNum2 = 0
				this.upLoadShowModal = false
				this.progressVisible2 = true
				this.leftSiderWidth2 = document.getElementsByClassName('menu-sider')[0].style.width
				this.$nextTick(() => {
					document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
				})
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				param.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
				param.append("sub_id", localStorage.getItem('sub_id'));
				param.append("corp_id", this.corpId);
				param.append("user_id", this.user_id);
				param.append("importFile", this.fileInfo);
				param.append('tag_ids', this.tag_arr3);
				if (localStorage.getItem('isMasterAccount') == 2) {
					param.append("sub_id", localStorage.getItem('sub_id'));
				}
				const {data: res} = await this.axios.post(
					"public-sea-customer/import-follow-user", param
				);
				if (res.error != 0) {
					this.modalLoading = false;
					this.progressVisible2 = false
					this.$message.error(res.error_msg);
				} else {
				}
			},
			upLoadHandleCancel () {
				this.fileInfo = {}
				this.file_name = ''
				this.tag_arr3 = []
				this.isShowTag = false
				this.modalLoading = false;
				this.upLoadShowModal = false
			},
			modalVisibleChange5 (event, arr) {
				if (event == "ok") {
					this.tag_arr3 = arr.split(',')
				}
			},
			//左侧企业微信
			handleChange (value) {
				this.corpId = value;
				this.follow_status = -1
				this.getFollowStatus()
				this.chooseNum = 0
				this.checkedList = []
				this.add_way = []
				this.way_id = []
				this.chooseNum1 = 0
				this.chatArr = []
				this.chooseNum2 = 0
				this.checkedList1 = []
				this.chooseNum3 = 0
				this.chatArr1 = []
				this.noTag = 0
				this.checked2 = []
				this.checked3 = false
				this.tag_ids = []
				this.tag_arr = []
				this.getGroupList()
				this.getTags([], 2)
				this.searchStaff()
				this.searchStaff1()
			},
			//手机号格式更换
			phoneChange (e) {
				const {value} = e.target;
				const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
				if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
					this.phoneNumber = value;
				}
			},
			//手机号格式更换
			phoneChange1 (e) {
				const {value} = e.target;
				const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
				if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
					this.phoneNumber1 = value;
				}
			},
			// 修改跟进次数
			followMinNumChange (e) {
				const {value} = e.target;
				const reg = /[^\d]/;
				if (!isNaN(value) && !reg.test(value)) {
					this.followNum1 = value;
				}
			},
			followMaxNumChange (e) {
				const {value} = e.target;
				const reg = /[^\d]/;
				if (!isNaN(value) && !reg.test(value)) {
					this.followNum2 = value;
				}
			},
			followNumBlur () {
				if (this.followNum1 != '' && this.followNum2 != '') {
					if (Number(this.followNum1) > Number(this.followNum2)) {
						let f = this.followNum1
						this.followNum1 = this.followNum2
						this.followNum2 = f
						// this.$message.destroy()
						// this.$message.warning('跟进最小次数不能大于最大次数');
						// return false
					}
				}
			},
			async handleChangeSign (value) {
				const {data: res} = await this.axios.post("third-store/get-merchants", {
					storeType: [],
					status   : '1',
					storeName: value,
					uid      : localStorage.getItem('uid'),
					isAll    : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.bindStoreList = res.data.info;
				}
			},
			//选择性别
			sexClick (e) {
				this.sexValue = e.target.value;
			},
			// 地域
			onChange (value) {
				if (value[0] != "全部") {
					this.province = value[0];
				} else {
					this.province = "";
				}
				if (value[1] != "全部") {
					this.city = value[1];
				} else {
					this.city = "";
				}
			},
			// 地域
			onChange1 (value) {
				if (value[0] != "全部") {
					this.province2 = value[0];
				} else {
					this.province2 = "";
				}
				if (value[1] != "全部") {
					this.city1 = value[1];
				} else {
					this.city1 = "";
				}
			},
			// 获取跟进状态
			async getFollowStatus () {
				const {data: res} = await this.axios.post(
					"custom-field/follow",
					{
						uid: localStorage.getItem("uid")
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.follows = res.data.follow
				}
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
				if (this.add_way == 'way' || this.add_way == 'redWay' || this.add_way == 'chatWay' || this.add_way == 'award' || this.add_way == 'fission' || this.add_way == 'redPack') {
					this.handleChangeCode()
				}
			},
			//
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
			//获取行业列表
			async getTradeList () {
				const {data: res} = await this.axios.post("custom-field/field-info", {
					uid: localStorage.getItem('uid')
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tradeList = res.data.work
					this.defineField = res.data.defineField
					for (let define of this.defineField) {
						let field = {
							field: define.fieldid,
							type : define.type,
							match: []
						}
						this.fieldData.push(JSON.parse(JSON.stringify(field)))
					}
				}
			},
			// 行业
			changeTrade (value) {
				if (value != "全部行业") {
					this.trade = value;
				} else {
					this.trade = "";
				}
			},
			blurChange (value) {
				this.group_id = value
				this.getTags(this.group_id, 2)
			},
			changeNoTag () {
				this.noTag = this.checked3 ? 1 : 0
			},
			//标签
			changeTag (key) {
				Array.prototype.indexOf = function (val) {
					for (var i = 0; i < this.length; i++) {
						if (this[i] == val) return i;
					}
					return -1;
				};
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val);
					if (index > -1) {
						this.splice(index, 1);
					}
				};
				if (this.tag_arr.includes(key)) {
					this.tag_arr.remove(key);
				} else {
					this.tag_arr.push(key);
				}
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			// 修改支付时间
			changeTime (date, dateString) {
				this.joinTime = date
			},
			// 修改支付时间
			changeTime1 (date, dateString) {
				this.joinTime1 = date
			},
			changeFollowTime (date, dateString) {
				this.followTime = date
			},
			changeChatTime (date, dateString) {
				this.chatTime = date
			},
			seniorSelect () {
				this.seniorVisible = true
			},
			onClose () {
				this.seniorVisible = false
				// this.searchStaff()
			},
			onClose1 () {
				this.customVisible = false
				// this.searchStaff()
			},
			//点击确定搜索
			searchStaff () {
				// if(this.followNum1 != '' && this.followNum2 != ''){
				// 	if(Number(this.followNum1) > Number(this.followNum2)){
				// 		this.$message.destroy()
				// 		this.$message.warning('跟进最小次数不能大于最大次数');
				// 		return false
				// 	}
				// }
				if (JSON.stringify(this.trade) === '[]') {
					this.work = ''
				} else {
					this.work = this.trade
				}
				this.tag_ids = this.tag_arr.join();
				this.seniorVisible = false
				this.getCustomList();
			},
			//点击确定搜索
			searchStaff1 () {
				this.getCustomList1();
			},
			//点击重置条件
			reset () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.add_way = '-1'
				this.way_id = []
				this.chatArr = []
				this.chooseNum1 = 0
				this.chat_type = 0
				this.leave = 0
				this.checked3 = false
				this.noTag = 0
				this.joinTime = null
				this.followTime = null
				this.chatTime = null
				this.follow_status = -1
				this.group_id = []
				this.getTags([], 2)
				this.customName = ''
				this.phoneNumber = ''
				this.followNum1 = ''
				this.followNum2 = ''
				this.signId = []
				this.sexValue = '-1'
				this.is_fans = 0
				this.other_way = -1
				this.is_protect = -1
				this.trade = []
				this.work = ''
				this.province1 = ["全部"]
				this.province = ''
				this.city = ''
				this.checked2 = []
				this.tag_arr = []
				this.tag_ids = ""
				for (let i = 0; i < this.fieldData.length; i++) {
					this.fieldData[i].match = []
				}
				this.checkedList = []
				this.userList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.seniorVisible = false
				this.getCustomList()
			},
			//点击重置条件
			reset1 () {
				this.chatArr1 = []
				this.chooseNum3 = 0
				this.chat_type1 = 0
				this.joinTime1 = null
				this.customName1 = ''
				this.phoneNumber1 = ''
				this.sexValue1 = '-1'
				this.province3 = ["全部"]
				this.province2 = ''
				this.city1 = ''
				this.checkedList1 = []
				this.userList1 = []
				this.chooseNum2 = 0
				this.chooseUserNum2 = 0
				this.chooseDepartmentNum2 = 0
				this.getCustomList1()
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
				this.is_list = 1
				this.uniqueType = 0
			},
			//选择群聊
			showChatVisible1 () {
				this.chatVisible = true
				this.is_list = 1
				this.uniqueType = 1
			},
			groupChatCallBack (event, num, arr) {
				if (event == "ok") {
					if (this.uniqueType == 0) {
						this.chooseNum1 = num
						this.chatArr = arr
					} else {
						this.chooseNum3 = num
						this.chatArr1 = arr
					}
				}
				this.chatVisible = false
			},
			//部门选择弹窗组件
			showDepartmentList () {
				if (this.tabKey == 1) {
					if (!this.customVisible) {
						this.uniqueType = 0
						this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
						this.$refs.user.rightList = JSON.parse(JSON.stringify(this.userList))
					} else {
						this.uniqueType = 1
						this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList1))
						this.$refs.user.rightList = JSON.parse(JSON.stringify(this.userList1))
					}
				} else {
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList4))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.userList4))
				}
				this.showModalDepartment = true
			},
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.tabKey == 1) {
						if (this.uniqueType == 0) {
							this.checkedList = arr
							this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
							this.chooseUserNum = userNum
							this.chooseDepartmentNum = departmentNum
							this.userList = list
						} else {
							this.checkedList1 = arr
							this.chooseNum2 = parseInt(userNum) + parseInt(departmentNum)
							this.chooseUserNum2 = userNum
							this.chooseDepartmentNum2 = departmentNum
							this.userList1 = list
						}
					} else if (this.tabKey == 2) {
						this.checkedList4 = arr
						this.chooseNum4 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum4 = userNum
						this.chooseDepartmentNum4 = departmentNum
						this.userList4 = list
					}
				}
				this.showModalDepartment = false
			},
			//重置
			clearDepartmentList () {
				this.checkedList = []
				this.userList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.getCustomList()
			},
			//获取表格内容
			async getCustomList (page = 1, pageSize = this.pageSize1) {
				let fieldData = JSON.parse(JSON.stringify(this.fieldData))
				for (let i = 0; i < fieldData.length; i++) {
					if (fieldData[i].match.length == 0) {
						fieldData.splice(i, 1)
						i--
					}
				}
				let add_way = typeof this.add_way == "number" || typeof this.add_way == "string" ? this.add_way : '-1'
				this.isLoading = true;
				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-list", {
					isMasterAccount  : localStorage.getItem('isMasterAccount'),
					sub_id           : localStorage.getItem('sub_id'),
					suite_id         : 1,
					corp_id          : this.corpId,
					user_ids         : this.checkedList,
					name             : this.customName,
					group_id         : this.group_id,
					page             : page,
					page_size        : pageSize,
					sex              : this.sexValue,
					is_fans          : this.is_fans,
					other_way        : this.other_way,
					is_protect       : this.is_protect,
					phone            : this.phoneNumber,
					work             : this.work,
					province         : this.province,
					city             : this.city,
					tag_type         : this.tagStyle,
					tag_ids          : this.tag_ids,
					follow_id        : this.follow_status,
					correctness      : 2,
					from_unique      : 0,
					follow_num1      : this.followNum1,
					follow_num2      : this.followNum2,
					sign_id          : this.signId,
					fieldData        : fieldData,
					no_tag           : this.noTag,
					chat_type        : this.chat_type,
					leave            : this.leave,
					add_way          : add_way,
					way_id           : this.way_id,
					chat_id          : this.chatArr ? this.chatArr : [],
					start_time       : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					end_time         : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
					update_time      : this.followTime ? (this.followTime.length > 1 ? [this.followTime[0].format("YYYY-MM-DD HH:mm"), this.followTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					chat_time        : this.chatTime ? (this.chatTime.length > 1 ? [this.chatTime[0].format("YYYY-MM-DD HH:mm"), this.chatTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					is_export        : this.is_export,
					selected_row_keys: this.selectedRowKeys,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.progressVisible = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					if (this.is_export == 0) {
						this.customList = res.data.info;
						this.total = parseInt(res.data.count);
						this.uniqueCount = res.data.uniqueCount
						// this.repeatCount = res.data.repeatCount
						this.showCustomData = true
						this.page = page;
						this.pageSize = pageSize;
						this.quickJumper = this.total > this.pageSize;
						this.keysArr = res.data.keys
						this.tag_count = res.data.tag_count
						//确认到底选中多少粉丝，给selectedRowKeys赋值
						// let arr = this.selectedRowKeys
						// this.selectedRowKeys = []
						// arr.map((x) => {
						// 	res.data.keys.map((k) => {
						// 		if (k == x) {
						// 			return this.selectedRowKeys.push(x)
						// 		}
						// 	})
						// })
						// this.selectedRowKeys = []
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

						this.is_rest = res.data.is_rest
						this.is_show = res.data.is_show
						this.is_cancel = res.data.is_cancel
						this.unshare_chat2 = res.data.unshare_chat
						this.unshare_follow2 = res.data.unshare_follow
						this.unshare_line2 = res.data.unshare_line
						this.unshare_field2 = res.data.unshare_field
						this.isHidePhone2 = res.data.is_hide_phone
						this.is_hide_phone = res.data.is_hide_phone
					}
					this.is_export = 0
				}
			},
			//获取表格内容
			async getCustomList1 (page = 1, pageSize = this.pageSize) {
				this.isLoading1 = true;
				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-list", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
					suite_id       : 1,
					corp_id        : this.corpId,
					user_ids       : this.checkedList1,
					name           : this.customName1,
					page           : page,
					page_size      : pageSize,
					sex            : this.sexValue1,
					phone          : this.phoneNumber1,
					province       : this.province2,
					city           : this.city1,
					correctness    : 2,
					from_unique    : 1,
					chat_type      : this.chat_type1,
					chat_id        : this.chatArr1 ? this.chatArr1 : [],
					start_time     : this.joinTime1 ? (this.joinTime1.length > 1 ? this.joinTime1[0].format("YYYY-MM-DD HH:mm") : '') : '',
					end_time       : this.joinTime1 ? (this.joinTime1.length > 1 ? this.joinTime1[1].format("YYYY-MM-DD HH:mm") : '') : '',
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.customList1 = res.data.info;
					this.isLoading1 = false;
					this.total1 = parseInt(res.data.count);
					this.page1 = page;
					this.pageSize1 = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getCustomList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 40)
				})
			},
			showSizeChange (page, pageSize) {
				this.getCustomList(1, pageSize);
			},
			// 分页
			changePage1 (page, pageSize) {
				this.getCustomList1(page, pageSize);
				document.getElementsByClassName('ant-drawer-wrapper-body')[0].scrollTo(0, 0)
			},
			showSizeChange1 (page, pageSize) {
				this.getCustomList1(1, pageSize);
			},
			// 客户绑定
			bindStore (index) {
				if (this.customList[index].customerInfo.merchant_type.length == 0) {
					this.$message.destroy()
					this.$message.warning("请前往【第三方店铺】-【店铺管理】，对第三方店铺绑定后，才能进行客户绑定")
					return false
				}
				this.noData = false
				this.userKey = this.customList[index].key
				this.storeTypeList = this.customList[index].customerInfo.merchant_type
				this.memberList = []
				this.cardNo = ""
				this.selectedRowKeys1 = []
				this.bindStoreVisible = true
			},
			// 搜索绑定信息
			async selectStore () {
				this.memberLoading = true
				if (this.cardNo == "") {
					this.memberLoading = false
					this.$message.destroy()
					this.$message.warning('请输入手机号、卡号或订单号！')
					return false
				}
				const {data: res} = await this.axios.post("third-store/search-member", {
					uid     : localStorage.getItem('uid'),
					cardNo  : this.cardNo,
					customId: this.userKey
				});
				if (res.error != 0) {
					this.memberLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.memberList = res.data
					if (this.memberList.length == 0) {
						this.noData = true
					} else {
						this.noData = false
					}
					this.memberLoading = false
				}
			},
			// 取消绑定
			handleCancelBind () {
				this.userKey = ''
				this.memberList = []
				this.cardNo = ""
				this.selectedRowKeys1 = []
				this.bindStoreVisible = false
			},
			// 确定绑定
			async handleBind (type) {
				let id = {}
				let ids = []
				for (let key of this.selectedRowKeys1) {
					let index = this.memberList.findIndex(x => x.key == key)
					id = {
						member_id: this.memberList[index].member_id,
						uc_id    : this.memberList[index].uc_id,
						key      : this.memberList[index].key
					}
					ids.push(JSON.parse(JSON.stringify(id)))
				}
				let that = this
				this.loading = true
				const {data: res} = await this.axios.post("third-store/is-bind-more", {
					ids     : ids,
					verify  : type == 1 ? 1 : 0,
					customId: this.userKey
				});
				if (res.error != 0) {
					this.loading = false
					this.$message.error(res.error_msg);
				} else {
					this.loading = false
					this.handleCancelBind()
					this.getCustomList(this.page, this.pageSize)
				}
			},
			//详情
			handleShowDetail (id) {
				let query = {
					id: id
				}
				this.$router.push({path: '/customManage/detail', query: query})
			},
			lookOrderList (id, name) {
				let query = {
					id  : id,
					name: encodeURIComponent(name)
				}
				this.$router.push({path: '/customManage/thirdStore', query: query})
			},
			// 客户解绑
			async unbindStore (key) {
				this.storeList = []
				this.selectKeys = []
				this.userKey = key
				const {data: res} = await this.axios.post("third-store/bind-merchants", {
					uid     : localStorage.getItem('uid'),
					customId: this.userKey
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.storeList = res.data
					if (this.storeList.length == 0) {
						this.$message.warning("暂无绑定的店铺")
					} else {
						this.unbindStoreVisible = true
					}
				}
			},
			checkedStroe (key) {
				for (let k of this.selectKeys) {
					if (k == key) {
						return true
					}
				}
				return false
			},
			changeCheckedBox (key) {
				if (this.selectKeys.length == 0) {
					this.selectKeys.push(key)
				} else {
					for (let i = 0; i < this.selectKeys.length; i++) {
						if (this.selectKeys[i] == key) {
							this.selectKeys.splice(i, 1)
							return false
						}
					}
					this.selectKeys.push(key)
				}
			},
			handleCancelUnbind () {
				this.storeList = []
				this.selectKeys = []
				this.unbindStoreVisible = false
			},
			async handleUnbind () {
				this.loading = true
				const {data: res} = await this.axios.post("third-store/bind-cancel", {
					ids: this.selectKeys,
				});
				if (res.error != 0) {
					this.loading = false
					this.$message.error(res.error_msg);
				} else {
					this.loading = false
					this.handleCancelUnbind()
					this.getCustomList(this.page, this.pageSize)
				}
			},
			//客户跟进
			handleShowFollow (id) {
				console.log(id, '客户跟进')
			},
			lookUniqueCustom () {
				this.reset1()
				this.customVisible = true
			},
			//同步客户气泡提示
			confirm () {
				message.info("已进入后台刷新中，请耐心等待...", 2, this.refreshFans)
			},
			async refreshFans () {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-external-contact/refresh-work-external-contact-list", {
					corp_id : this.corpId,
					suite_id: 1,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg)
				} else {
					this.$message.destroy()
					this.getCustomList();
				}
			},
			//导出客户
			leadOut () {
				this.is_export = 1
				this.progressVisible = true
				this.progressCloseable = false
				this.progressNum = 0
				this.progressWidth = 120
				this.moveMask()
				this.getCustomList()
			},
			moveMask () {
				this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
				this.$nextTick(() => {
					document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
				})
			},
			//获取标签
			async getTags (groupId, type) {
				this.tagLoading = true
				let id = groupId ? (groupId[0] ? groupId : this.groupId) : this.groupId
				id = id == -1 ? [] : id
				const {data: res} = await this.axios.post("work-tag/list", {
					corp_id : this.corpId,
					suite_id: 1,
					group_id: id,
					type    : 0,
					is_all  : 1,//0 不展示所有（带分页的）  1 展示所有（不带分页的
				});
				if (res.error != 0) {
					this.tagLoading = false
					this.$message.error(res.error_msg);
				} else {
					if (type == 2) {
						this.checked2 = []
						for (let i = 0; i < res.data.info.length; i++) {
							this.checked2.push(false)
						}
						this.tagsList2 = res.data.info
						if (groupId && groupId.length > 0) {
							for (let i = 0; i < this.tag_arr.length; i++) {
								let flag = true
								for (let j = 0; j < this.tagsList2.length; j++) {
									if (this.tagsList2[j].id == this.tag_arr[i]) {
										flag = false
									}
								}
								if (flag) {
									this.tag_arr.splice(i, 1)
									i--
								}
							}
						}
						for (let i = 0; i < this.tag_arr.length; i++) {
							for (let j = 0; j < this.tagsList2.length; j++) {
								if (this.tagsList2[j].id == this.tag_arr[i]) {
									this.checked2[j] = true
								}
							}
						}
					} else {
						this.tagsList = res.data.info;
						this.tagLoading = false
						for (var i = 0; i < this.tagsList.length; i++) {
							var checked = false;
							this.checked.push(checked);
						}
						if (9999 - Math.max(...this.selectArr) <= 0) {
							this.disabled = []
							for (let i = 0; i < this.tagsList.length; i++) {
								let disabled = true;
								this.disabled.push(disabled);
							}
						} else {
							this.disabled = []
							let disabled = false
							for (let i = 0; i < this.tagsList.length; i++) {
								this.disabled.push(disabled)
							}
							for (let i = 0; i < this.tagsList.length; i++) {
								for (let j = 0; j < this.commonTags.length; j++) {
									if (this.commonTags[j].id == this.tagsList[i].key) {
										this.disabled[i] = true
									}
								}
							}
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
					type    : 0,
					is_all  : 1,//0 不展示所有（带分页的）  1 展示所有（不带分页的
				});
				if (res.error != 0) {
					this.tagLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					this.tagLoading = false
					if (9999 - Math.max(...this.selectArr) <= 0) {
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
					this.tagValue = []
					this.tagCheckIndex++
				}
			},
			// 打标签
			showModal () {
				this.groupId = '-1'
				this.getTags2()
				// console.log(this.selectedRowKeys,'this.selectedRowKeys')
				// console.log(this.selectArr,'this.selectArr')
				// console.log(Math.max(...this.selectArr))
				let keys = this.selectedRowKeys;
				if (keys.length == 0) {
					this.$message.destroy()
					this.$message.warning("请先选择客户");
					return false;
				}
				if (9999 - Math.max(...this.selectArr) <= 0) {
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
				this.tagCheckValue = [];
				this.visible = true;
				this.getGroupList()
				this.addCommonTags(0);
			},
			handleOk () {
				if (this.tagCheckValue.length == this.commonTags.length) {
					this.$message.destroy()
					this.$message.warning("请选择要打的标签");
				} else {
					this.confirmLoading2 = true;
					this.addTagsMore(0);
				}
			},
			cancelVisible () {
				this.visible = false
				this.disabled = []
				this.tag_num = 9999 - Math.max(...this.selectArr)
				this.inputValue = ''
				this.tagValue = []
				this.tagCheckValue = []
			},
			// 移除标签
			showModal1 () {
				let keys = this.selectedRowKeys;
				if (keys.length == 0) {
					this.$message.destroy()
					this.$message.warning("请先选择客户");
					return false;
				}
				this.tagCheckValue1 = [];
				this.addCommonTags(1)
				this.visible1 = true;
			},
			handleOk1 () {
				if (this.tagCheckValue1.length == 0) {
					this.$message.destroy()
					this.$message.warning("请选择要移除的标签");
				} else {
					this.addTagsMore(1);
					this.confirmLoading = true
				}
			},
			cancelVisible2 () {
				this.visible1 = false
				this.tagCheckValue = []
				this.tagCheckValue1 = []
				this.commonTags = []
				this.fansTag = []
				this.initChecked = []
			},
			onChange2 (checkedValues) {
				// 将不再当前分组的已选标签和当前组针对初始已选的标签差集做合并处理，即为当前的已选新标签并记录到this.newChecked中
				this.newChecked = checkedValues.filter(item => this.initChecked.indexOf(item) == -1).concat(this.diffChecked)


				// 当前选择的标签即为，初始标签和已选新标签的并集
				let tagArr = this.initChecked.concat(this.newChecked)
				this.tagCheckValue = Array.from(new Set(tagArr))

				let a = this.tagCheckValue.length - this.commonTags.length
				this.tag_num = 9999 - Math.max(...this.selectArr) - a

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
				let url = ''
				let params = {
					user_ids: this.selectedRowKeys,
					give    : give//0打标签，1移除标签
				}
				if (this.tabKey == 1) {
					url = "work-user/get-user-tags"
					params.type = 2
				} else if (this.tabKey == 2) {
					url = "public-sea-customer/get-user-tags"
				}
				const {data: res} = await this.axios.post(url, params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					res.data.map(x => {
						this.tagCheckValue.push(parseInt(x.id))
						this.initChecked.push(parseInt(x.id))
					})
					this.commonTags = res.data
					this.fansTag = res.data
					for (let i = 0; i < this.tagsList.length; i++) {
						for (let j = 0; j < this.commonTags.length; j++) {
							if (this.commonTags[j].id == this.tagsList[i].key) {
								this.disabled[i] = true
							}
						}
					}
					// console.log(this.tagCheckValue, '获取共同标签')
				}
			},
			//批量添加/移除标签
			async addTagsMore (type) {
				let tag_ids = []
				this.tagCheckValue = this.tagCheckValue.filter(item => !this.commonTags.some(ele => ele.id === item.id))
				if (type == 0) {
					tag_ids = this.tagCheckValue
				} else {
					tag_ids = this.tagCheckValue1
				}
				let url = ''
				let params = {
					tag_ids : tag_ids,
					user_ids: this.selectedRowKeys,
					type    : type//0打标签，1移除标签
				}
				if (this.tabKey == 1) {
					url = "work-user/give-user-tags"
					params.s_type = 2
				} else if (this.tabKey == 2) {
					url = "public-sea-customer/give-user-tags"
				}
				const {data: res} = await this.axios.post(url, params);
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
					this.tagCheckValue = []
					this.diffChecked = []
					this.newChecked = []
					this.initChecked = []
					if (this.tabKey == 1) {
						this.getCustomList();
					} else if (this.tabKey == 2) {
						this.getNoCustomer()
					}
				}
			},
			//新建标签
			showAddTagModal () {
				this.addTagVisible = true
				this.editGroupId = this.groupList[0].id
			},
			onSearch () {
				if (this.editGroupId == '') {
					this.$message.destroy()
					this.$message.warning("请先选择分组");
					return false;
				}
				if (this.inputValue == "") {
					this.$message.destroy()
					this.$message.warning("不能为空");
					return false;
				} else {
					this.tagValue = []
					for (var i = 0; i < this.inputValue.split(" ").length; i++) {
						if (this.inputValue.split(" ")[i].length > 15) {
							this.$message.destroy()
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
					type    : 0,
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
			//获取分组
			async getGroupList () {
				const {data: res} = await this.axios.post("work-tag-group/list", {
					corp_id : this.corpId,
					type    : 0,
					suite_id: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.info
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
				this.tag_num = 9999 - Math.max(...this.selectArr)
				this.selectedRowKeys = selectedRowKeys;
				this.batchTypeValue = this.checkArr.every(val => selectedRowKeys.includes(val))
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
					this.selectValueArr = this.selectValueArr.concat(record.tag_name)
					this.tag_num = 9999 - Math.max(...this.selectArr)
				} else {
					this.selectArr.remove(record.tag_name.length)
					for (let i = 0; i < record.tag_name.length; i++) {
						this.selectValueArr.remove(record.tag_name[i])
					}
					this.tag_num = 9999 - Math.max(...this.selectArr)
				}
			},
			onSelectChange1 (selectedRowKeys1, value) {
				this.selectedRowKeys1 = selectedRowKeys1;
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
			},
			//后台返回导入进度数据处理
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'export_customer') {
					this.progressVisible = true
					this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
					this.$nextTick(() => {
						document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
					})
					this.progressNum = parseInt(data.export_num / data.snum * 100)
					if (this.progressNum == 100) {
						this.progressWidth = 100
						this.downLoadUrl = data.url
						this.progressCloseable = true
					}
					if (data.url != '') {
						sessionStorage.setItem('externalDownLoadUrl', this.downLoadUrl)
					}
				}
				if (typeof data.type != 'undefined' && data.type == 'import-follow-user') {
					if (localStorage.getItem('isMasterAccount') == 1 && data.sub_id == '' || localStorage.getItem('isMasterAccount') == 2 && data.sub_id == localStorage.getItem('sub_id')) {
						this.progressVisible2 = true
						this.leftSiderWidth2 = document.getElementsByClassName('menu-sider')[0].style.width
						this.$nextTick(() => {
							document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
						})
						this.upLoadShowModal = false
						this.progressNum2 = parseInt(data.import_num / data.snum * 100)
						this.successNum2 = data.successNum
						this.failNum2 = data.failNum
						this.notImportNum2 = data.notImportNum

						if (data.textHtml != '') {
							if (data.error == 0) {
								this.modalLoading = false;
								this.upLoadShowModal = false
								this.progressVisible2 = false
								this.tag_arr3 = []
								this.isShowTag = false
								this.getNoCustomer()
							} else {
								this.$message.error(data.textHtml);
							}
						}

						if (this.progressNum2 == 100) {
							this.progressVisible2 = false
						}
					}
				}
			},
			//下载
			progressDownload () {
				window.open(this.downLoadUrl)
				this.progressCancel()
			},
			progressCancel () {
				sessionStorage.removeItem('externalDownLoadUrl')
				this.progressVisible = false
			},
			//切换tab
			changeTab (type) {
				this.tabKey = type
				this.selectedRowKeys = []
				this.selectArr = []
				this.tag_count = []
				this.keysArr = []
				this.tag_num = ''
				this.batchTypeValue = false
				this.checkArr = []
				this.assignType = 1
				this.assignRecord = ''
				this.userId = []
				this.userName = []
				if (type == 1) {
					this.reset()
				} else if (type == 2) {
					this.reset2()
				}
			},
			//非企微客户列表数据
			async getNoCustomer (page = 1, pageSize = this.pageSize4) {
				this.isLoading4 = true;
				const {data: res} = await this.axios.post("public-sea-customer/custom-list", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
					uid            : localStorage.getItem('uid'),
					corp_id        : this.corpId,
					name           : this.number,
					user_ids       : this.checkedList4,
					field_option_id: this.addStatus,
					is_protect     : this.is_protect2,
					is_bind        : this.bindStatus,
					tag_type       : this.tagType2,
					page           : page,
					page_size      : pageSize,
					s_date         : this.claimTime ? (this.claimTime.length > 1 ? this.claimTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					e_date         : this.claimTime ? (this.claimTime.length > 1 ? this.claimTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
					tag_ids        : this.tags
				});
				if (res.error != 0) {
					this.isLoading4 = false;
					this.progressVisible = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading4 = false;
					this.noCustomerList = res.data.followData
					this.selectList = res.data.optionList
					this.user_id = res.data.user_id
					this.total4 = parseInt(res.data.count);
					this.page4 = page;
					this.pageSize4 = pageSize;
					this.quickJumper4 = this.total4 > this.pageSize4;
					this.keysArr = res.data.keys
					this.tag_count = res.data.tag_count
					//确认到底选中多少粉丝，给selectedRowKeys赋值
					// let arr = this.selectedRowKeys
					// this.selectedRowKeys = []
					// arr.map((x) => {
					// 	res.data.keys.map((k) => {
					// 		if (k == x) {
					// 			return this.selectedRowKeys.push(x)
					// 		}
					// 	})
					// })
					// this.selectedRowKeys = []
					this.batchTypeValue = false
					this.checkArr = []
					this.noCustomerList.map(x => {
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
					this.is_rest = res.data.is_rest
					this.is_show = res.data.is_show
					this.is_cancel = res.data.is_cancel
				}
			},
			// 分页
			changePage4 (page, pageSize) {
				this.getNoCustomer(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 40)
				})
			},
			showSizeChange4 (page, pageSize) {
				this.getNoCustomer(1, pageSize);
			},
			//查找
			searchStaff2 () {
				this.getNoCustomer()
			},
			//清空
			reset2 () {
				this.checkedList4 = []
				this.chooseNum4 = 0
				this.chooseUserNum4 = 0
				this.chooseDepartmentNum4 = 0
				this.userList4 = []
				this.claimTime = null
				this.tagType2 = '1'
				this.bindStatus = -1
				this.addStatus = 0
				this.is_protect2 = -1
				this.number = ''
				this.tags = []
				this.getNoCustomer()
			},
			// 标签选择弹窗取消
			cancleChooseTag () {
				this.chooseTagVisible = false
			},
			// 标签选择弹窗打开
			showChooseTag () {
				this.wordIds = JSON.parse(JSON.stringify(this.tags))
				this.tagStyle2 = JSON.parse(JSON.stringify(this.tagType2))
				this.chooseTagVisible = true
			},
			// 标签选择确认
			handleChoose () {
				this.tags = JSON.parse(JSON.stringify(this.wordIds))
				this.tagType2 = JSON.parse(JSON.stringify(this.tagStyle2))
				this.chooseTagVisible = false
			},
			// 选择标签回调
			modalVisibleChange (event, ids) {
				if (event == 'ok') {
					if (ids == '') {
						this.wordIds = []
					} else {
						this.wordIds = ids.split(',')
					}
				}
			},
			// 修改认领时间
			changeTime2 (date, dateString) {
				this.claimTime = date
			},
			//非企微客户详情
			handleShowDetail2 (id) {
				let query = {
					id: id
				}
				this.$router.push({path: '/customManage/noCustomDetail', query: query})
			},
			//客户转交
			handleMenuClick (e, type, record, index) {
				this.assignType = type
				this.assignRecord = record
				if (e.key == 1) {
					//转交给成员
					this.showModalStaff = true
				} else if (e.key == 2) {
					//进入公海池
					this.assignHighSea()
				} else if (e.key == 3) {
					//设为保护对象
					this.setProtect(type, record)
				} else if (e.key == 4) {
					//取消保护
					this.cancelProtect(type, record)
				} else if (e.key == 5) {
					//客户绑定
					this.bindStore(index)
				} else if (e.key == 6) {
					//解绑绑定
					this.unbindStore(record.key)
				} else if (e.key == 7) {
					//第三方店铺
					this.lookOrderList(record.key, record.customerInfo.name)
				}
			},
			// 选择成员回调
			selectStaffCallback (event, id) {
				if (event == "ok") {
					this.userId = id
					this.$nextTick(() => {
						this.userName = this.$refs.staff.$el.innerText
					})
				}
			},
			chooseStaffCancel () {
				this.userId = ''
				this.userName = ''
				this.assignRecord = ''
				// this.selectedRowKeys = []
				// this.batchTypeValue = false
				this.$refs.staff.userId = []
				this.showModalStaff = false
			},
			chooseStaffHandel () {
				if (this.userId.length == 0) {
					this.$message.error('请先选择成员');
					return false
				}
				let that = this;
				let title = ""
				if (typeof that.assignRecord != 'undefined') {
					//单个分配
					if (this.assignType == 0) {
						//非企微客户
						title = "一旦确定将【" + that.assignRecord.name + "】转交给【" + this.userName + "】，则进入该成员的客户列表。确定转交吗？"
					} else if (this.assignType == 1) {
						//企微客户
						title = "一旦确定将【" + that.assignRecord.customerInfo.name + "】转交给【" + this.userName + "】，则进入该成员的客户列表。确定转交吗？"
					}
				} else {
					//批量分配
					title = "确定将" + this.selectedRowKeys.length + "位客户转交给【" + this.userName + "】吗？"
				}
				that.showModalStaff = false
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.assignStaff()
					},
					onCancel () {
						that.showModalStaff = true
					},
				});
			},
			//成员转交给成员
			async assignStaff () {
				let sea_id = ''
				if (typeof this.assignRecord != 'undefined') {
					//单个转交
					sea_id = this.assignRecord.key
				} else {
					//批量转交
					sea_id = this.selectedRowKeys
				}
				const {data: res} = await this.axios.post("public-sea-customer/transfer", {
					uid      : localStorage.getItem("uid"),
					corp_id  : this.corpId,
					user_id  : this.userId,
					type     : this.assignType,//0非企微客户、1企微客户
					follow_id: sea_id
				});
				if (res.error != 0) {
					let that = this
					that.$error({
						title: res.error_msg,
						onOk() {
							that.userId = ''
							that.userName = ''
							that.assignRecord = ''
							that.$refs.staff.userId = []
						},
					});
				} else {
					this.$success({
						title: res.data.textHtml,
					});
					this.chooseStaffCancel()
					if (this.assignType == 0) {
						//非企微客户
						this.getNoCustomer()
					} else if (this.assignType == 1) {
						//企微客户
						this.getCustomList()
					}
				}
			},
			//成员转交给公海池
			async assignHighSea () {
				let sea_id = ''
				if (typeof this.assignRecord != 'undefined') {
					//单个转交
					sea_id = this.assignRecord.key
				} else {
					//批量转交
					sea_id = this.selectedRowKeys
				}
				const {data: res} = await this.axios.post("public-sea-customer/give-up", {
					uid      : localStorage.getItem("uid"),
					corp_id  : this.corpId,
					type     : this.assignType,//0非企微客户、1企微客户
					follow_id: sea_id
				});
				if (res.error != 0) {
					this.$error({
						title: res.error_msg,
					});
				} else {
					this.$success({
						title: res.data.textHtml,
					});
					this.assignRecord = ''
					this.selectedRowKeys = []
					this.batchTypeValue = false
					if (this.assignType == 0) {
						//非企微客户
						this.getNoCustomer()
					} else if (this.assignType == 1) {
						//企微客户
						this.getCustomList()
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
			//设为保护对象
			setProtect (type, record) {
				this.assignType = type
				this.assignRecord = record
				let that = this;
				let title = ""
				if (typeof record != 'undefined') {
					//单个分配
					if (record.is_rest == 1) {
						if (this.assignType == 1) {
							//企微
							title = "确定保护【" + record.customerInfo.name + "】永不进入公海池吗？"
						} else {
							//非企微
							title = "确定保护【" + record.name + "】永不进入公海池吗？"
						}
					} else {
						title = "永不进入公海池的客户数已达上限，无法再设置。"
					}
				} else {
					//批量分配
					title = "一旦将" + this.selectedRowKeys.length + "位客户设为保护对象，则不会自动进入公海池，确定保护吗？"
				}
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.protectStaff()
					}
				});
			},
			//成员保护
			async protectStaff () {
				let sea_id = ''
				if (typeof this.assignRecord != 'undefined') {
					//单个转交
					sea_id = this.assignRecord.key
				} else {
					//批量转交
					sea_id = this.selectedRowKeys
				}
				const {data: res} = await this.axios.post("public-sea-customer/protect", {
					uid            : localStorage.getItem("uid"),
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
					corp_id        : this.corpId,
					type           : this.assignType,//0非企微客户、1企微客户
					follow_id      : sea_id
				});
				if (res.error != 0) {
					this.$error({
						title: res.error_msg,
					});
				} else {
					this.$success({
						title: res.data.textHtml,
					});
					this.assignRecord = ''
					this.selectedRowKeys = []
					this.batchTypeValue = false
					if (this.assignType == 0) {
						//非企微客户
						this.getNoCustomer()
					} else if (this.assignType == 1) {
						//企微客户
						this.getCustomList()
					}
				}
			},
			//取消保护
			cancelProtect (type, record) {
				this.assignType = type
				this.assignRecord = record
				let that = this;
				let title = "一旦取消保护，当符合客户回收规则后，客户将自动进入公海池，被其他同事认领，确定取消保护吗？"
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.cancelProtectStaff()
					}
				});
			},
			async cancelProtectStaff () {
				let sea_id = ''
				if (typeof this.assignRecord != 'undefined') {
					//单个转交
					sea_id = this.assignRecord.key
				} else {
					//批量转交
					sea_id = this.selectedRowKeys
				}
				const {data: res} = await this.axios.post("public-sea-customer/no-protect", {
					uid            : localStorage.getItem("uid"),
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
					corp_id        : this.corpId,
					type           : this.assignType,//0非企微客户、1企微客户
					follow_id      : sea_id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success(res.data.textHtml);
					this.assignRecord = ''
					this.selectedRowKeys = []
					this.batchTypeValue = false
					if (this.assignType == 0) {
						//非企微客户
						this.getNoCustomer()
					} else if (this.assignType == 1) {
						//企微客户
						this.getCustomList()
					}
				}
			},
			//设置配置项
			setOptions () {
				this.unshare_chat = this.unshare_chat2 == 1 ? true : false
				this.unshare_follow = this.unshare_follow2 == 1 ? true : false
				this.unshare_line = this.unshare_line2 == 1 ? true : false
				this.unshare_field = this.unshare_field2 == 1 ? true : false
				this.isHidePhone = this.isHidePhone2 == 1 ? true : false
				this.setOptionsVisible = true
			},
			handleCancelSetOptions () {
				this.setOptionsVisible = false
			},
			async handleSetOptions () {
				const {data: res} = await this.axios.post("work-external-contact-follow-user/set-share-data", {
					corp_id       : this.corpId,
					unshare_chat  : this.unshare_chat ? 1 : 0,
					unshare_follow: this.unshare_follow ? 1 : 0,
					unshare_line  : this.unshare_line ? 1 : 0,
					unshare_field : this.unshare_field ? 1 : 0,
					is_hide_phone : this.isHidePhone ? 1 : 0,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.setOptionsVisible = false
					this.getCustomList()
				}
			},
		},
		computed: {
			rowSelection () {
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
								this.selectedRowKeys = changableRowKeys;
								this.selectArr = []
								if (this.tabKey == 1) {
									for (let i = 0; i < this.customList.length; i++) {
										this.selectArr.push(this.customList[i].tag_name.length)
									}
								} else if (this.tabKey == 2) {
									for (let i = 0; i < this.noCustomerList.length; i++) {
										this.selectArr.push(this.noCustomerList[i].tag_name.length)
									}
								}
								this.tag_num = 9999 - Math.max(...this.selectArr)
							}
						},
						{
							key     : "all-data",
							text    : "选择所有项",
							onSelect: () => {
								this.selectedRowKeys = [...this.keysArr.valueOf()];
								this.selectArr = this.tag_count
								this.tag_num = 9999 - Math.max(...this.selectArr)
							}
						}
					],
					onSelection          : this.onSelection
				};
			},
			rowSelection1 () {
				const {selectedRowKeys1} = this;
				return {
					selectedRowKeys      : selectedRowKeys1,
					onChange             : this.onSelectChange1,
					hideDefaultSelections: true,
					selections           : [],
					getCheckboxProps     : (record) => {
						return {
							props: {
								disabled: record.isBind == 1
							}
						}
					}
				};
			},
		},
		mounted () {
			if (localStorage.getItem('permissionButton') == 'all') {
				this.is_assign = true
			} else {
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				if (permissionButton.indexOf('client-assign') == -1 && permissionButton.indexOf('client-backHighSea') == -1) {
					this.is_assign = false
				} else {
					this.is_assign = true
				}
				if(permissionButton.indexOf('other-store') == -1 && permissionButton.indexOf('client-bind') == -1 && permissionButton.indexOf('client-assign') == -1 && permissionButton.indexOf('client-backHighSea') == -1 && permissionButton.indexOf('client-protect') == -1){
					this.isShowMoreBtn = false
				} else {
					this.isShowMoreBtn = true
				}
			}

			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				//TODO 获取teams
				this.$emit('changeCorpId', this.corpId)

				//接收后台实时返回的导入进度结果
				this.ws.setCallback(this.websocketOnMessage)
				this.getGroupList()
				this.handleChangeSign("")
				// this.setScroLineHeight()
				// this.initFirefoxScroll()
				this.getCustomList()
				this.getTags([], 2)
				this.getTradeList()
				this.getFollowStatus()
				this.getAddWay()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建

			if (from.path == '/customManage/detail') {
				next(vm => {
					vm.tabKey = 1
					vm.getCustomList(vm.page)
					vm.ws.setCallback(vm.websocketOnMessage)

					if (sessionStorage.getItem('externalDownLoadUrl')) {
						vm.progressCloseable = true
						vm.progressNum = 100
						vm.progressWidth = 100
						vm.downLoadUrl = sessionStorage.getItem('externalDownLoadUrl')
						vm.progressVisible = true
						vm.moveMask()
					}
				})
			} else if (from.path == '/customManage/thirdStore') {
				next(vm => {
					vm.tabKey = 1
					vm.getCustomList(vm.page)
				})
			} else if (from.path == '/customManage/noCustomDetail') {
				next(vm => {
					vm.tabKey = 2
					vm.getNoCustomer(vm.page4)
				})
			} else {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					// vm.startValue = null
					vm.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
					vm.tabKey = 1
					vm.joinTime = null
					vm.followTime = null
					vm.chatTime = null
					vm.endValue = null
					vm.follow_status = -1
					vm.group_id = []
					vm.getTags([], 2)
					vm.customName = ''
					vm.phoneNumber = ''
					vm.sexValue = '-1'
					vm.is_fans = 0
					vm.other_way = -1
					vm.is_protect = -1
					vm.trade = []
					vm.work = ''
					vm.province1 = ["全部"]
					vm.province = ''
					vm.city = ''
					vm.checked2 = [];
					vm.tag_arr = [];
					vm.tag_ids = "";
					for (let i = 0; i < vm.fieldData.length; i++) {
						vm.fieldData[i].match = []
					}
					vm.checkedList = []
					vm.userList = []
					vm.chooseNum = 0
					vm.chooseUserNum = 0
					vm.chooseDepartmentNum = 0
					vm.checkedList1 = []
					vm.userList1 = []
					vm.chooseNum2 = 0
					vm.chooseUserNum2 = 0
					vm.chooseDepartmentNum2 = 0
					vm.checkedList4 = []
					vm.userList4 = []
					vm.chooseNum4 = 0
					vm.chooseUserNum4 = 0
					vm.chooseDepartmentNum4 = 0
					vm.chooseNum1 = 0
					vm.chooseNum3 = 0
					vm.chatArr = []
					vm.chatArr1 = []
					vm.getCustomList();
					vm.ws.setCallback(vm.websocketOnMessage)

					if (sessionStorage.getItem('externalDownLoadUrl')) {
						vm.progressCloseable = true
						vm.progressNum = 100
						vm.progressWidth = 100
						vm.downLoadUrl = sessionStorage.getItem('externalDownLoadUrl')
						vm.progressVisible = true
						vm.moveMask()
					}
				});
			}

			next()
		},
		beforeRouteLeave (to, form, next) {
			this.ws.setCallback()
			this.progressVisible = false
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
	}

	.content-hd {
		padding: 10px 0;
		width: 100%;
		min-width: 885px;
		line-height: 40px;
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

	.content-hd-right {
		float: right;
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
		/*width: 108px;*/
		height: 30px;
		margin: 7px 0 0 20px;
		padding: 0px 15px;
		float: right;
	}

	.btn-primary2 {
		/*width: 108px;*/
		height: 30px;
		margin: 7px 0 0 20px;
		padding: 0px 15px;
	}

	.btn-primary1[disabled] {
		background-color: #F5F5F5;
		border-color: #D9D9D9;
	}

	/deep/ .ant-form-item-label {
		/*text-align: left;*/
		margin-bottom: 10px;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}

	.sider-one {
		height: 60px;
		border-bottom: 1px solid #E2E2E2;
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
		margin: 0 10px;
	}

	.sider-footer {
		position: fixed;
		height: 50px;
		width: 900px;
		bottom: 0;
		background-color: #FFF;
		border-top: 1px solid #E2E2E2;
		padding-top: 10px;
		z-index: 999;
		text-align: center;
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

	.sider-two {
		padding: 0 20px 10px;
	}

	.sider-three {
		padding: 0 20px;
	}

	.sider-three div span {
		text-align: right;
		display: inline-block;
		width: 120px;
	}

	.sider-one span {
		text-align: right;
		display: inline-block;
		width: 120px;
	}

	.sider-two span {
		text-align: right;
		display: inline-block;
		width: 120px;
	}

	.sider-title {
		height: 50px;
		width: 250px;
		border-bottom: 1px solid #E2E2E2;
		line-height: 50px;
		text-align: center;
	}

	.list {
		overflow-y: hidden;
	}

	.sider-tags {
		text-align: left;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 5px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	/deep/ .bind-table thead .ant-checkbox-wrapper {
		display: none;
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

	.download-progress /deep/ .ant-progress-inner {
		transition: 0.5s;
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

	/deep/ .ant-table-thead > tr > th:first-child .ant-table-header-column {
		display: none;
	}

	.repeat-table /deep/ .ant-table-thead > tr > th:first-child .ant-table-header-column {
		display: block;
	}

	.checkbox-row {
		margin-top: 10px;
	}

	/deep/ .ant-drawer-content {
		height: calc(100% - 64px);
	}
</style>
