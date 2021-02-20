<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 80px;" class="scroll">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">待办项目</label>

			</a-card>
			<a-card style="margin:0 20px 0px 20px;padding:10px 20px 0px 20px;height: 100%">
				<label class="right" v-if="init==1" v-has="'todoManagementSetting-all'">
					<a-button v-show="stateAll==false" type="primary" @click="editAll">批量编辑</a-button>
					<a-button v-show="stateAll==true" @click="notEditAll">取消</a-button>
				</label>
				<!--   步骤条 	-->
				<div>
					<a-steps :current="current" style="padding: 0 30px;cursor: pointer;">
						<a-step @click="changeCurrent(index)" v-for="(item, index) in steps"
						        :title="item.title"/>
					</a-steps>
					<div v-show="current==0" class="steps-content"
					     style="padding-top: 10px; padding-bottom: 30px;height: 100%">
						<a-form-item class="current0" style="margin-top: 20px"
						             v-if="$store.state.corpArr.length > 1 && stateAll"
						             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<template slot="label"><span
									style="color: red">*</span>选择企业微信
							</template>
							<template>
								<div style="display: inline-block;cursor: pointer;" @click="changeCorp">
									<img src="../../../assets/WeChatLogo.png"
									     style="width: 24px;margin: -3px 6px 0 0;"/>
									<span>{{corpName}}</span>
									<a-icon type="caret-down"
									        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"/>
								</div>
								<!--								<span style="color: #F56C6C;">（一旦创建，不可修改）</span>-->
							</template>
						</a-form-item>
						<a-form-item class="current0" style="margin-top: 20px"
						             v-if="$store.state.corpArr.length > 1 && !stateAll"
						             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
							<template slot="label"><span
									style="color: red">*</span>选择企业微信
							</template>
							<template>
								<div style="display: inline-block;cursor: pointer;">
									<img src="../../../assets/WeChatLogo.png"
									     style="width: 24px;margin: -3px 6px 0 0;"/>
									<span>{{corpName}}</span>
								</div>
							</template>
						</a-form-item>
						<a-form-item class="current0" v-if="appList.length>0 && stateAll" :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							<template slot="label"><span
									style="color: red">*</span>选择应用
							</template>
							<template>
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 180px;display: inline-block;"
										v-model="appId">
									<template v-for="item in appList">
										<a-select-option :value="item.id">{{item.name}}
										</a-select-option>
									</template>
								</a-select>
								<!--								<span style="color: #F56C6C">（一旦发布，不可更改）</span>-->
								<div>
									<div class="content-msg" style="font-size: 13px;">
										<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a
												target="_blank"
												href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
											企业微信后台</a>创建自建应用。
											<a target="_blank"
										                        href="https://shimo.im/docs/8Jwkjq9KDW6cgkkJ/">
											教程</a>
											</p>
										<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">
											2、选择此应用，请确认已设置过应用的可信域名。
											<a :href="$store.state.commonUrl+'/upload/slider.png'" target="_blank"
											   class="el-link el-link--primary">
												<span class="el-link--inner">查看图示</span>
											</a>
										</p>
									</div>
								</div>
							</template>
						</a-form-item>
						<a-form-item class="current0" v-if="appList.length>0 && !stateAll" :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							<template slot="label"><span
									style="color: red">*</span>选择应用
							</template>
							<template>
								<span>{{appList.find(x => x.id == appId).name}}</span>
							</template>
						</a-form-item>
						<!-- 企业微信选择弹窗 -->
						<WeChatModal :show="showModal2" :callback="modalVisibleChange"
						             hasName="fission-add"></WeChatModal>
					</div>
					<!--自定义待办项目表格-->
					<div v-show="current==1" class="steps-content">
						<div style="background: #FFF;padding: 20px 0;">
							<div style="height: 40px; line-height: 40px;margin: 20px 0 10px 0;"
							     v-has="'todoManagementSetting-all'">
								<!--								<span style="color: #FF562D;margin-left: 20px;">鼠标移动面板更改状态排序</span>-->
								<a-button v-show="stateAll==true" type="primary"@click="addProject"
								          style="margin-right: 20px;vertical-align: middle;float: right;">新增待办项目
								</a-button>
							</div>
							<!--							<a-spin tip="加载中..." size="large" :spinning="isLoading1">-->
							<a-table class="follow-table3" :columns="stateAll ? columns2 : columns1"
							         :dataSource="projectList"
							         :pagination="false"
							         :rowClassName="rowClassName"
							>
								<span v-if="record.title" slot="title3" slot-scope="text,record">
		                              {{ record.title }}
								</span>
								<span slot="desc" slot-scope="text,record">
									<a-popover placement="top">
										<span slot="content" style="display: inline-block; max-width: 500px;white-space: normal;word-break: break-all;">
											{{record.desc}}
										</span>
									<p class="desc">{{record.desc}}</p>
								</a-popover>
									<span v-if="record.desc == ''">--</span>
								</span>
								<span v-if="record.user" slot="user" slot-scope="text,record">
									<a-popover trigger="hover">
										<span slot="content"
										      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
											{{record.user}}-{{record.depart_name}}
										</span>
										<a-tag color="orange" style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											{{record.user}}-{{record.depart_name}}
										</a-tag>
									</a-popover>
				                </span>
								<span v-if="record.finish_time" slot="finish_time" slot-scope="text,record">
									需要在 {{record.finish_time}} 天内完成
				                </span>
								<span slot="level" slot-scope="text,record">
									<span v-for="(item,index) in record.remind">
										<span
												v-show="item.type==1 && item.days !=='' && item.days !==null">
											在预计截止结束时间前{{item.days}}天提醒
											<br/>
										</span>
										<span v-show="item.type==2 && item.days !=='' && item.days !==null">
											任务超时{{item.days}}天提醒
											<br/>
										</span>
									</span>
									<span v-if="record.remind.length == 0">--</span>
								</span>
								<span slot="action" v-show="stateAll==true"
								      slot-scope="text, record,index">
									<div style="display: inline-block;">
									<a-button style="margin-right: 5px;"
									          @click="editProject(record,index)" v-has="'todoManagementSetting-all'">
										编辑
									</a-button>
									</div>
									<div style="display: inline-block;">
									<a-button @click="delProject(record,index)" v-has="'todoManagementSetting-all'">
										删除
									</a-button>
									</div>
							    </span>
							</a-table>
							<!-- 分页 -->
							<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0">
								<div style="height: 32px;float: left;line-height: 32px;margin-left: 10px;">
									共有
									<span style="color: blue">{{total}}</span>个项目
								</div>
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
									              :current="page"
									              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
									              @change="changePage"
									              @showSizeChange="showSizeChange"/>
								</div>
							</div>
							<!--														</a-spin>-->
						</div>
						<!--自定义待办项目阶段增加/修改弹框-->
						<a-modal v-model="projectVisible" :title="projectAddOrEditTitle" width="720px!important"
						         @cancel="handleCancelProject">
							<template slot="footer">
								<a-button @click="handleCancelProject">取消</a-button>
								<a-button
										type="primary"
										:loading="isLoading3 "
										@click="handleProject"
								>提交
								</a-button>
							</template>
							<a-form-model>
								<a-form-model-item class="active" :label-col="{ span: 4 }"
								                   :wrapper-col="{ span: 20 }">
									<template slot="label"><span
											style="color: red">*</span>项目名称
									</template>
									<a-input :maxLength="20" v-model="projectTitle" placeholder="请输入项目名称，20个字以内">
						<span slot="suffix">
		                    <span>{{projectTitle.length}}</span>/20
						</span>
									</a-input>
								</a-form-model-item>
								<a-form-item class="active" :label-col="{ span: 4 }"
								             :wrapper-col="{ span: 20 }">
									<template slot="label"><span
											style="color: red">*</span>选择优先级
									</template>
									<span>

									 <a-select v-model="projectLevelTitle" style="width: 180px;display: inline-block;"
									           @change="projectChange">
									      <a-select-option v-for="item in priorityList" :value="item.title">
														{{ item.title }}
									      </a-select-option>
									    </a-select>
								</span>
								</a-form-item>
								<a-form-model-item class="active" :label-col="{ span: 4 }"
								                   :wrapper-col="{ span: 20 }">
									<template slot="label">项目描述
									</template>

									<a-textarea :maxLength="200" placeholder="请填写项目描述，200个字以内" v-model="projectDesc"
									            allow-clear
									            @change="projectDescChange"/>
								</a-form-model-item>
								<a-form-item class="active" :label-col="{ span: 4}"
								             :wrapper-col="{ span: 20}">
									<template slot="label"><span
											style="color: red">*</span>项目处理人
									</template>
									<!--									<chooseStaffSelect ref="staffSelect2"-->
									<!--									                   style=" width: 160px;display: inline-block;"-->
									<!--									                   :index="0" :index2="0"-->
									<!--									                   :callback="selectStaffCallback2"></chooseStaffSelect>-->
									<template v-if="projectVisible">
										<a-select showSearch
										          optionFilterProp="children"
										          style="width: 180px;display: inline-block;"
										          v-model="projectUserId" :filterOption="false"
										          placeholder="请选择企业成员" @focus="focusUser" @search="searchUser"
										          @select="changeSelect" @popupScroll="popScroll"
										>
											<div slot="dropdownRender" slot-scope="menu">
												<v-nodes :vnodes="menu"/>
												<a-spin tip="加载中..." size="large" :spinning="isLoading5"
												        style="position: absolute;bottom: 50%;left: 0;right: 0;">
												</a-spin>
											</div>
											<template v-for="user in userList">
												<a-select-option :value="user.id">
													{{user.name}}
												</a-select-option>
											</template>

										</a-select>
									</template>
								</a-form-item>
								<a-form-item class="active" :label-col="{ span: 4 }"
								             :wrapper-col="{ span: 20 }">
									<template slot="label">
										<span style="color: red">*</span>
										项目完成时间
									</template>
									<span>
										<span>需在 </span><a-input-number
											style=" width: 100px;display: inline-block;"
											placeholder="请输入天数"
											:min="1"
											:step="0"
											:max="366"
											v-model="projectDay"
											@input.native="inputNum"
											:formatter="limitDecimals"
											:parse="limitDecimals"
									></a-input-number><span> 天内完成</span>
										<br/>
										<span style="color: #ff562D;">（修改天数后，不论项目处理人是否已启动该项目，都将以最新预计的时间计算。）</span>
									</span>
								</a-form-item>

								<a-form-item class="active" :label-col="{ span: 4 }"
								             :wrapper-col="{ span: 20 }">
									<template slot="label">
										<span style="color: red">*</span>
										任务提醒
									</template>
									<span v-for="(item,index) in projectRemind">
										<a-select
												style="width: 180px;display: inline-block;"
												placeholder="请选择任务提醒"
												v-model="item.type"
												@change="handleChange">
											<a-select-option
													value="1">
												在预计截止结束时间前
											</a-select-option>
											<a-select-option
													value="2">
												项目超时
											</a-select-option>
										</a-select>
										<a-input-number
												:formatter="limitDecimals"
												:parse="limitDecimals"
												style="width: 100px;display: inline-block;margin-left: 5px"
												:step="0"
												:min="1"
												placeholder="请输入天数"
												v-model="item.days"></a-input-number>
										<span> 天自动提醒</span>
										<a-button
												v-show="index==projectRemind.length-1"
												@click="addProjectRemind(index)"
												style="margin-left:10px">添加</a-button>
										<a-button
												v-show="projectRemind.length != 1"
												@click="delProjectRemind(index)"
												style="margin: 0 10px">删除</a-button>
										<br/>
									</span>
								</a-form-item>
							</a-form-model>
						</a-modal>
					</div>

					<!--		客户阶段关联待办项目			-->
					<div v-show="current==2" class="steps-content">
						<div style="background: #FFF;padding: 20px 0;">
							<!--							<div style="height: 40px; line-height: 40px;margin: 20px 0 10px 0;">-->
							<!--								&lt;!&ndash;								<span style="color: #FF562D;margin-left: 20px;">鼠标移动面板更改状态排序</span>&ndash;&gt;-->
							<!--								<a-button v-show="stateAll==true" type="primary"@click="addCustom"-->
							<!--								          style="margin-right: 20px;vertical-align: middle;float: right;">-->
							<!--									添加任务-->
							<!--								</a-button>-->
							<!--							</div>-->
							<!--							<a-spin tip="加载中..." size="large" :spinning="isLoadingb">-->
							<a-table :columns="stateAll ? columns4 : columns3" :dataSource="customList" bordered
							         :pagination="false"
							>

								<span slot="priorityDesc" slot-scope="text,record">
<!--									<span v-for="x in record.content">-->
									<span v-if="record.content.title == ''">--</span>
									<span v-if="record.content.title != ''">
									    <span v-show="record.content.type==1">
										    <span>进入到该状态手动开启</span><span>需在{{record.content.date}}天内完成<br/></span>
										    <span v-for="c in record.content.descTitle">
											    <span v-show="c.type==1">在预计截止结束时间前{{c.days}}天提醒<br/></span>
											    <span v-show="c.type==2">任务超时{{c.days}}天提醒<br/></span>
										    </span>
									    </span>
										<span v-show=" record.content.type==2">
											<span>进入到该状态立即开始</span><span>需在{{record.content.date}}天内完成<br/></span>
											<span v-for="c in record.content.descTitle">
												<span v-show="c.type==1">在预计截止结束时间前{{c.days}}天提醒<br/></span>
												<span v-show="c.type==2">任务超时{{c.days}}天提醒<br/></span>
											</span>
										    </span>
										<span v-show="record.content.type==3">
											<span>进入到该状态{{record.content.days}}天后开始</span><span>需在{{record.content.date}}天内完成<br/></span>
											<span v-for="c in record.content.descTitle">
											    <span v-show="c.type==1">在预计截止结束时间前{{c.days}}天提醒<br/></span>
											    <span v-show="c.type==2">任务超时{{c.days}}天提醒<br/></span>
										    </span>
										</span>
									</span>
								</span>
								<span slot="priorityName" slot-scope="text,record,index">
									<span v-if="!record.content.title && record.content != 0">--</span>
									<span v-if="record.content.title || record.content == 0">
										<span>{{record.content.title}}</span>
									</span>
									<br/>
									<span v-if="(record.content.title || record.content == 0) && record.content.userInfo"><a-tag color="orange">{{record.content.userInfo}}</a-tag>完成</span>
									<!--									<span v-if="record.content" v-show="record.content.length>1">-->
									<!--										<span v-for="i in record.content">-->
									<!--											<span>{{i.title}}</span><br/>-->
									<!--										</span>-->
									<!--									</span>-->
								</span>
								<!--								<span slot="priorityTitle" slot-scope="text,record">-->
								<!--										{{record.projectName}}-->
								<!--				                </span>-->
							</a-table>
							<!--														</a-spin>-->
						</div>
						<!--客户关联待办项目阶段增加/修改弹框-->
						<a-modal v-model="customVisible" :title="customAddOrEditTitle" width="720px"
						         @cancel="handleCancelCustom">
							<template slot="footer">
								<a-button @click="handleCancelCustom">取消</a-button>
								<a-button
										type="primary"
										:loading="isLoading3 "
										@click="handleCustom"
								>提交
								</a-button>
							</template>
							<a-form-item v-show="isAddOrEdit==1" class="active"
							             :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								<template slot="label"><span
										style="color: red">*</span>选择跟进状态
								</template>
								<a-select style="width: 220px" placeholder="请选择跟进状态"
								          v-model="follow_id" @change="getContent">
									<a-select-option v-for="item in follows" :value="item.id">
										{{item.title}}
									</a-select-option>
								</a-select>
							</a-form-item>
							<a-form-item v-show="isAddOrEdit==2 ||isAddOrEdit==3" class="active"
							             :wrapper-col="{ span: 24}">
								<template><span
										style="font-size: 20px; color:red;                                                            ">【{{showName}}】 阶段</span>
								</template>
							</a-form-item>
							<template v-for="(item,index) in content">
								<a-form-item class="active"
								             :wrapper-col="{ span: 24}">
									<template>
										<span
												style="padding-left: 5px; border-left: 5px solid #01b065;font-weight: 700;">待办项目{{index + 1}}</span>
									</template>
									<a-icon v-if="!((content.length == 1 && content[0].title == '请选择项目名称') && index == 0)"
									        @click="delProjectIndex(index)"
									        style="float: right;font-size: 20px;margin-top: 10px;color: red"
									        type="minus-square"/>
								</a-form-item>
								<a-form>
									<a-form-item class="active" :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<template slot="label"><span
												style="color: red">*</span>选择待办项目
										</template>
										<a-select style="width: 180px;display: inline-block;"
										          v-model="item.title"
										          @change="peojectSelect(item.title,index)">
											<template v-for="item2 in tableList">
												<a-select-option :disabled="isDisabled(item2.title, item.title)"
												                 :value="item2.title">
													{{item2.title}}
												</a-select-option>
											</template>
										</a-select>
									</a-form-item>
									<a-form-item v-if="item.title != '' && item.title != '请选择项目名称'" class="active"
									             :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<template slot="label">
											项目完成人
										</template>
										<span>{{item.userInfo}}</span>
									</a-form-item>
									<a-form-item v-if="item.title != '' && item.title != '请选择项目名称'" class="active"
									             :label-col="{ span: 4}"
									             :wrapper-col="{ span: 20}">
										<template slot="label">
											任务规则
										</template>
										<a-radio-group v-model="item.type" @change="selectOpenDate">
											<a-radio @click="changeOpenDate1(item)" :style="radioStyle1"
											         :value="1">
												<span>手动开启</span>
											</a-radio>
											<a-radio @click="changeOpenDate1(item)" :style="radioStyle1"
											         :value="2">
												<span>自动开启</span>
											</a-radio>
											<a-radio :style="radioStyle1" :value="3">
												<span>N天后开启</span>
											</a-radio>
											<div style="display: inline-block;"
											      v-show="item.type==3">请输入<a-input-number
													:formatter="limitDecimals"
													:parse="limitDecimals"
													:step="0"
													:min="1"
													style="width: 100px;display: inline-block;margin: 0 5px;"
													v-model="item.days"></a-input-number> 天后开启（输入天数须大于0）</div>
										</a-radio-group>
									</a-form-item>
									<a-form-item v-if="item.title != '' && item.title != '请选择项目名称'" class="active"
									             :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 8 }">
										<template slot="label">
											任务提醒
										</template>
										<div style="margin-top: 7px;line-height: 26px;">
											<span v-for="i in item.descTitle" style="margin: 3px 0;">
												<span v-show="i.type==1">在预计截止结束时间前{{i.days}}天提醒<br/></span>
												<span v-show="i.type==2">任务超时{{i.days}}天提醒<br/></span>
											</span>
										</div>
									</a-form-item>
									<div v-if="index != content.length - 1"
									     style="width: 100%; height: 1px; border-top: 1px dashed #C3C3C3;margin: 15px 0;"></div>
								</a-form>
							</template>
							<a-form-item class="active" label="" style="text-align: center"
							             :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								<a-button type="primary" @click="addProjectIndex"
								          style="margin: 0 10px">添加
								</a-button>
							</a-form-item>
							<a-form-item class="active" :label-col="{ span: 4 }"
							             :wrapper-col="{ span: 20 }">
								<template slot="label">改变跟进状态
								</template>
<!--								<a-switch v-model="showState" @change="switchChange"/>-->
<!--								<span>（是否在完成任务后改变跟进状态）</span>-->
								<div v-show="showState==true" class="active">
									<a-radio-group v-model="need" @change="customChange">
										<a-radio :style="radioStyle" :value="1">
											<span>所有项目全部完成，才能更改客户状态</span>
										</a-radio>
										<a-radio :style="radioStyle" :value="2">
											<span>无需所有项目全部完成，即能更改客户状态</span><span style="color: #A9BFF4"
											                                      v-show="need==2">（请选择更改客户状态条件）</span>
										</a-radio>
									</a-radio-group>
									<div v-show="need==2">
										<a-checkbox-group v-model="way" @change="onChange">
											<a-checkbox :value=1>
											</a-checkbox>
											<span style="margin-left: 8px;">
												<a-select
														v-model="value2"
														mode="multiple"
														style="width: 180px;display: inline-block;"
														placeholder="选择项目(多选)"
														option-label-prop="label"
												>
													 <template v-for="item3 in content">
														  <a-select-option :label="item3.title" :value="item3.title">
															  {{ item3.title }}
														  </a-select-option>
													 </template>

												</a-select>
										<span> 至少完成其中</span>
									<a-input-number style="width: 100px;display: inline-block;margin-left: 5px"
									                :min="1"
									                :step="0"
									                :formatter="limitDecimals"
									                :parse="limitDecimals"
									                v-model="nums"
									></a-input-number>
									<span> 项，才能更改客户状态</span>
									</span>
											<br/>
											<a-checkbox :value=2>
											</a-checkbox>
											<span style="margin-left: 8px;">
									<span>所有任务需完成 </span>
										 <a-select
												 v-model="value3"
												 mode="multiple"
												 style="width: 180px;display: inline-block;"
												 placeholder="选择项目(多选)"
												 option-label-prop="label"
										 >
<!--									 <a-select default-value="选择服务(多选)" style="width: 180px;display: inline-block;"-->
											 <!--									           @change="handleCustomSelect">-->
										 <template v-for="item4 in content">
												  <a-select-option :label="item4.title" :value="item4.title">
									        {{ item4.title }}
									      </a-select-option>
											 </template>
									    </a-select>
									<span>，才能更改客户状态</span>
									</span>
										</a-checkbox-group>
									</div>

								</div>
							</a-form-item>

						</a-modal>
					</div>


					<div class="steps-action" v-show="stateAll==true">
						<div style="display: inline-block; margin-left: -200px;">
							<a-button v-if="current>0" @click="prev">
								上一步
							</a-button>
							<a-button v-if="current < steps.length - 1" style="margin-left: 8px"
							          type="primary"
							          @click="next">
								下一步
							</a-button>
							<a-button style="margin-left: 8px"
							          :loading="isLoadingb"
							          v-if="current == steps.length - 1"
							          type="primary"
							          @click="createActivity"
							>
								提交
							</a-button>
						</div>
					</div>
				</div>
			</a-card>

		</div>
	</div>
</template>

<script>

	import {Sketch} from "vue-color";
	import chooseStaffSelect from "@/components/ChooseStaffSelect";
	import WeChatModal from "@/components/WeChatModal.vue"
	import TodoAction from '@/components/TodoAction.vue'
	import TodoPriority from '@/components/TodoPriority.vue'

	const columns1 = [
		{
			title      : '待办项目',
			dataIndex  : 'title3',
			width      : '180px',
			key        : 'title3',
			scopedSlots: {customRender: 'title3'},
		},
		{
			title      : '项目描述',
			dataIndex  : "desc",
			width      : "23%",
			key        : "desc",
			scopedSlots: {customRender: 'desc'},
		},
		{
			title      : '项目处理人',
			dataIndex  : "user",
			width      : "18%",
			key        : "sort",
			scopedSlots: {customRender: 'user'},
		},

		{
			title      : '所需完成时间',
			dataIndex  : "finish_time",
			width      : "18%",
			key        : "finish_time",
			scopedSlots: {customRender: 'finish_time'},
		},
		{
			title      : '项目提醒',
			dataIndex  : "level",
			width      : "23%",
			key        : "level",
			scopedSlots: {customRender: 'level'},
		}
	];
	const columns2 = [

		{
			title      : '待办项目',
			dataIndex  : 'title3',
			width      : '180px',
			key        : 'title3',
			scopedSlots: {customRender: 'title3'},
		},
		{
			title      : '项目描述',
			dataIndex  : "desc",
			width      : "20%",
			key        : "desc",
			scopedSlots: {customRender: 'desc'},
		},
		{
			title      : '项目处理人',
			dataIndex  : "user",
			width      : "15%",
			key        : "sort",
			scopedSlots: {customRender: 'user'},
		},

		{
			title      : '所需完成时间',
			dataIndex  : "finish_time",
			width      : "15%",
			key        : "finish_time",
			scopedSlots: {customRender: 'finish_time'},
		},
		{
			title      : '项目提醒',
			dataIndex  : "level",
			width      : "20%",
			key        : "level",
			scopedSlots: {customRender: 'level'},
		},
		{
			dataIndex  : "action",
			title      : '操作',
			key        : 'action',
			width      : "15%",
			scopedSlots: {customRender: 'action'},
		},
	];
	const columns3 = [
		{
			title       : '客户跟进阶段',
			dataIndex   : "projectName",
			width       : "180px",
			key         : "projectName",
			customRender: (value, row, index) => {
				return {
					children: value,
					attrs   : {
						rowSpan: row.rowSpan
					},
				};
			},
		},
		{
			title      : '完成服务待办',
			dataIndex  : 'priorityName',
			width      : '20%',
			key        : 'priorityName',
			scopedSlots: {customRender: 'priorityName'},
		},
		{
			title      : '项目规则',
			dataIndex  : "priorityDesc",
			width      : "35%",
			key        : "priorityDesc",
			scopedSlots: {customRender: 'priorityDesc'},
		},

		{
			title       : '达到更改客户状态条件',
			dataIndex   : "priorityDate",
			width       : "25%",
			key         : "priorityDate",
			customRender: (value, record, index) => {
				let children = <todo-priority record={record}/>
				return {
					children: children,
					attrs   : {
						rowSpan: record.rowSpan
					},
				};
			},
		},
	];


	export default {
		name      : 'todoManagementSetting',
		components: {
			"color-picker": Sketch,
			chooseStaffSelect,
			WeChatModal,
			VNodes        : {
				functional: true,
				render    : (h, ctx) => ctx.props.vnodes,
			},
			TodoAction,
			TodoPriority
		},
		data () {
			let that = this
			const columns3 = [
				{
					title       : '客户跟进阶段',
					dataIndex   : "projectName",
					width       : "180px",
					key         : "projectName",
					customRender: (value, row, index) => {
						return {
							children: value,
							attrs   : {
								rowSpan: row.rowSpan
							},
						};
					},
				},
				{
					title      : '完成服务待办',
					dataIndex  : 'priorityName',
					width      : '20%',
					key        : 'priorityName',
					scopedSlots: {customRender: 'priorityName'},
				},
				{
					title      : '项目规则',
					dataIndex  : "priorityDesc",
					width      : "35%",
					key        : "priorityDesc",
					scopedSlots: {customRender: 'priorityDesc'},
				},

				{
					title       : '达到更改客户状态条件',
					dataIndex   : "priorityDate",
					width       : "25%",
					key         : "priorityDate",
					customRender: (value, record, index) => {
						let children = <todo-priority record={record}/>
						return {
							children: children,
							attrs   : {
								rowSpan: record.rowSpan
							},
						};
					},
				},
			];
			const columns4 = [
				{
					title       : '项目阶段',
					dataIndex   : "projectName",
					width       : "180px",
					key         : "projectName",
					customRender: (value, row, index) => {
						return {
							children: value,
							attrs   : {
								rowSpan: row.rowSpan
							},
						};
					},
				},
				{
					title      : '待办项目',
					dataIndex  : 'priorityName',
					width      : '15%',
					key        : 'priorityName',
					scopedSlots: {customRender: 'priorityName'},
				},
				{
					title      : '项目规则',
					dataIndex  : "priorityDesc",
					width      : "30%",
					key        : "priorityDesc",
					scopedSlots: {customRender: 'priorityDesc'},
				},

				{
					title       : '进入到下一阶段条件',
					dataIndex   : "priorityDate",
					width       : "20%",
					key         : "priorityDate",
					customRender: (value, record, index) => {
						let children = <todo-priority record={record}/>
						return {
							children: children,
							attrs   : {
								rowSpan: record.rowSpan
							},
						};
					},
				},

				{
					dataIndex   : "rowSpan",
					title       : '操作',
					key         : 'rowSpan',
					width       : "20%",
					customRender: (value, record, index) => {
						let childrenDom;
						if (record.content.title === '') {
							childrenDom = <todo-action has="'todoManagementSetting-all'" buttonText = "添加任务" callback={that.addCustom2} record={record} index={index}/>
						} else {
							childrenDom = <todo-action type={['','danger']} has={["'todoManagementSetting-all'","'todoManagementSetting-all'"]} buttonText={["编辑","清空任务"]} callback={[that.editCustom,that.delCustom]} record={record} index={index}/>
						}
						return {
							children: childrenDom,
							attrs   : {
								rowSpan: record.rowSpan
							},
						};
					},
				},
			];
			// let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId               : localStorage.getItem("corpId"),   //企业微信选中的id
				// isShow:0,
				stateAll             : false,
				// openValue:1, // 选择开启时间
				// 选择企业微信
				openIndex2           : null,
				showState            : true,
				showModal2           : false,// 企业微信选择弹窗
				corpName             : localStorage.getItem("corpName"),
				init                 : null,
				// 客户阶段关联待办项目
				obj4                 : [],
				isLoadingb           : false,
				editIndex            : null, // 编辑时获得当前行的下标
				showName             : null, // 表格内添加或编辑的时候显示的阶段名称
				isAddOrEdit          : null, // 判断是添加还是编辑
				isIndex              : null,
				projectName          : '',// 阶段名称
				nums                 : null,// 完成多少项
				way                  : [],// 进入下阶段条件选二时选中的选项数组
				follow_id            : '请选择跟进状态',//展示的跟进状态
				follows              : [],
				followTitle          : '',
				switchState          : 0, // 是否改变跟进状态
				value2               : [],
				value3               : [],
				// userInfo:[],
				userIndex            : null,
				sortSum              : 1,
				// openDay             : null, // 输入的开启时间
				openDate             : 1, // 自定义开启时间选项值
				need                 : 1,
				value                : 1,
				radioStyle1          : {
					display     : 'inline-block',
					height      : '30px',
					lineHeight  : '40px',
					marginBottom: '10px'
				},
				radioStyle           : {
					display     : 'block',
					height      : '30px',
					lineHeight  : '40px',
					marginBottom: '10px'
				},
				customVisible        : false, // 控制添加项目弹框的显示隐藏
				customAddOrEditTitle : '', // 添加or修改弹窗文字提示
				content              : [
					{
						task_id   : 0,
						title     : '请选择项目名称', //项目不能重复
						project_id: 0,  //初始化传0 后面传对应的
						userInfo  : '', // 项目处理人
						descTitle : [],// 项目提醒
						type      : 1, //1手动开启 2 自动开启 3 N天后开启
						days      : '', //选N天填写 必须大于0
						date      : null,
					}
				], // 选择的待办项目对象
				customList           : [],
				arr                  : [],
				// 自定义待办项目
				// 自定义项目提醒
				tableList            : [],
				page1                : 1,// 成员列表页码
				count1               : 0,
				isLoading5           : false,
				openIndex            : null,
				openStyle            : null,
				obj3                 : [],
				suite_id             : 1,//应用ID
				appList              : [], // 应用列表
				appId                : '',   // 企业微信应用id
				projectRemind        : [
					{
						type: '1',
						days: 1
					}
				],
				userList             : [], // 所有成员列表
				startId3             : null,
				endId3               : null,
				departmentName       : '',
				projectUserId        : '请选择企业成员', // 项目处理人id
				intNum               : 0,
				name                 : '',
				selectUserId         : '',
				projectUserName      : null, // 项目处理人name
				// projectDay2          : 0, // 截止之前提醒
				// projectDay1          : 0,// 完成前几天提醒
				projectDay           : 3, // 项目完成时间
				projectLevelTitle    : '选择优先级', // 项目优先级
				index                : 0,
				isLoading3           : false,
				projectColor         : '#FFF',
				projectTitle         : '', // 添加项目名称
				projectDesc          : '', // 添加项目描述
				projectVisible       : false, // 控制自定义项目执行阶段弹框的显示隐藏
				projectAddOrEditTitle: '', // 添加or修改弹窗文字提示
				// projectSelectedRowKeys: ['1'], // 单选框选中数据
				projectList          : [],

				// 自定义项目优先级数据
				obj2                  : [],
				user                  : '', // 项目完成人
				remind                : '', // 项目提醒
				startId2              : null,
				endId2                : null,
				priorityColor         : '#FFF',
				isLoading             : false,
				priorityTitle         : '', // 添加阶段名称
				priorityDesc          : '', // 添加阶段描述
				priorityVisible       : false, // 控制自定义项目执行阶段弹框的显示隐藏
				priorityAddOrEditTitle: '', // 添加or修改弹窗文字提示
				// prioritySelectedRowKeys: [0], // 单选框选中数据
				priorityList          : [],

				// 自定义项目执行阶段数据
				obj1               : [],
				startId            : null,
				endId              : null,
				color              : '#FFF',
				isLoading1         : false,
				followVisible      : false, // 控制自定义项目执行阶段弹框的显示隐藏
				addOrEditTitle     : '', // 添加or修改弹窗文字提示
				title              : '', // 添加阶段名称
				desc               : '', // 添加阶段描述
				// selectedRowKeys    : [0], // 单选框选中数据
				// 列表数据
				executionStatusList: [],
				// 步骤条设置
				current            : 0, // 步骤index
				steps              : [  // 步骤名
					{
						title: '选择企业微信',
					},
					{
						title: '自定义待办项目',
					},
					{
						title: '客户阶段关联待办项目',
					}
				],
				createLoading      : false, // 活动创建按钮loading
				// 表格部分
				columns1,
				columns2,
				columns3,
				columns4,
				page               : 1, // 页码
				// pages:1,
				pageSize           : 15, // 每页数据量，默认15
				// 分页
				total              : 0, // 总条数
				quickJumper        : false, // 是否显示快速跳转的控件
			};
		},
		mounted () {
			this.getDefaultData()
			this.getAppList()
			this.getAllStaffList()
			// this.getSetData()
		},
		watch     : {
			value2 (val) {
				console.log(`selected:`, val);
			},
			value3 (val) {
				console.log(`selected:`, val);
			},
			// content(val){
			// 	console.log(val)
			// }
			follow_id (val) {
				console.log(val)
			},
			current: function () {
				if (this.current == 0) {
					// this.getAppList()
				} else if (this.current == 1) {
					// this.getAllStaffList()
					// this.setDragTable3()
				} else if (this.current == 2) {
					this.getFollowStatus()
				}
			},
			init   : function () {
				if (this.init == 0) {
					this.stateAll = true
				}
			},
			// showState:function () {
			//  if(this.switchState == 0){
			//  	this.showState=false
			//  }else if(this.switchState == 1){
			//      this.showState=true
			//  }
			// }

		},
		methods   : {
			// 数字输入框限制
			limitDecimals (value) {
				const reg = /[^\d]/g
				if (typeof value == 'string') {
					return !isNaN(Number(value)) ? value.replace(reg, '') : ''
				} else if (typeof value == 'number') {
					return !isNaN(value) ? String(value).replace(reg, '') : ''
				} else {
					return ''
				}
			},

			inputNum (e) {
				if (e.data) {
					let re = /^[0-9]+$/
					if (!re.test(e.data)) {
						this.projectDay = parseInt(this.projectDay.toString().substring(0, this.projectDay.toString().length - 1)) || ''
					}
				}
				console.log(e)
			},
			// 改变页
			changePage (page, pageSize) {
				this.page = page
				let table = this.getPageData(this.tableList, this.page, this.pageSize);
				this.page = table.page
				this.projectList = table.list
				// this.setDragTable3()
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
				})
			},
			showSizeChange (page, pageSize) {
				this.pageSize = pageSize
				let table = this.getPageData(this.tableList, this.page, this.pageSize);
				this.page = table.page
				this.projectList = table.list
				// this.setDragTable3()
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
				})
			},
			// 选择企业微信
			// 改变企业微信
			changeCorp () {
				this.showModal2 = true
			},
			modalVisibleChange (type, corpId, corpName) {
				if (type == 'ok') {
					if (this.corpId != corpId) {
						this.corpId = corpId
						this.corpName = corpName
					}
					// if (this.activity.corp_id != corpId) {
					// 	this.activity.corp_id = corpId
					// 	this.getAgentList()
					// 	this.corpName = corpName
					// 	this.chooseNum = 0
					// 	this.activity.user = []
					// 	this.$refs.user.staffList = []
					// 	this.$refs.user.keyList = []
					// }
				}
				this.showModal2 = false
			},
			// 批量编辑优先级
			editChange3 (index, text) {
				this.priorityList[index].title = text
			},
			editChange4 (index, text) {
				this.priorityList[index].desc = text
			},
			// 批量编辑自定义状态
			editChange2 (index, text) {
				this.executionStatusList[index].title = text
			},
			editChange1 (index, text) {

				this.executionStatusList[index].desc = text
			},
			// 批量编辑
			editAll () {
				this.obj1 = JSON.parse(JSON.stringify(this.executionStatusList))
				this.obj2 = JSON.parse(JSON.stringify(this.priorityList))
				this.obj3 = JSON.parse(JSON.stringify(this.projectList))
				this.obj4 = JSON.parse(JSON.stringify(this.customList))

				this.stateAll = true
			},
			// 确认批量编辑
			// showEditAll () {
			// 	// this.priorityList=this.obj2
			// 	this.stateAll = false
			// },
			// 取消批量编辑
			notEditAll () {
				this.executionStatusList = JSON.parse(JSON.stringify(this.obj1))
				this.priorityList = JSON.parse(JSON.stringify(this.obj2))
				this.projectList = JSON.parse(JSON.stringify(this.obj3))
				this.customList = JSON.parse(JSON.stringify(this.obj4))
				this.$message.warning("已取消编辑")
				this.stateAll = false
			},

			// 获取默认数据
			async getDefaultData (page = 1, pageSize = this.pageSize) {
				this.isLoading1 = true
				const {data: res} = await this.axios.post('wait-project/detail', {
					uid     : localStorage.getItem('uid'),
					corp_id : this.corpId,
					page    : page,
					pageSize: pageSize
				})
				if (res.error != 0) {
					this.isLoading1 = false
					this.$message.error(res.error_msg);
				} else {
					this.init = res.data.init
					if (this.init == 0) {
						this.stateAll = true
					}
					this.appId = res.data.agent_id + ''
					this.executionStatusList = res.data.project_status
					// this.setDragTable3()
					this.total = res.data.count
					this.priorityList = res.data.project_level
					this.customList = res.data.task
					this.tableList = res.data.project
					let table = this.getPageData(this.tableList, this.page, this.pageSize)
					this.page = table.page
					this.projectList = table.list
					console.log(res.data)
					this.isLoading1 = false
				}
			},

			// async getSetData () {
			// 	this.isLoading1 = true
			// 	const {data: res} = await this.axios.post('wait-project/common-detail', {
			// 		uid: localStorage.getItem('uid')
			// 	})
			// 	if (res.error != 0) {
			// 		this.isLoading1 = false
			// 		this.$message.error(res.error_msg);
			// 	} else {
			// 		this.init = res.data.init
			// 		if (this.init == 0) {
			// 			this.stateAll = true
			// 		}
			// 		this.executionStatusList = res.data.project_status
			// 		this.priorityList = res.data.project_level
			// 		this.isLoading1 = false
			// 	}
			// },
			// 表格分页
			getPageData (list, page, pageSize) {
				if (list.length == 0) {
					return {
						page: page,
						list: []
					}
				}
				let maxNum = page * pageSize;
				let minNum = (page - 1) * pageSize
				let pageData = {
					page: page,
					list: []
				}
				if (list.length < maxNum) {
					maxNum = list.length
				}
				if (minNum > list.length - 1) {
					if (list.length % pageSize != 0) {
						minNum = (parseInt(list.length / pageSize)) * pageSize
						pageData.page = parseInt(list.length / pageSize) + 1
					} else {
						minNum = (parseInt(list.length / pageSize) - 1) * pageSize
						pageData.page = parseInt(list.length / pageSize)
					}
				}
				for (let i = minNum; i < maxNum; i++) {
					pageData.list.push(list[i])
				}
				return pageData
			},
			// setDragTable () {
			// 	let that = this
			// 	this.$nextTick(function () {
			// 		if (this.current == 0) {
			// 			let trs = document.getElementsByClassName('follow-table')[0].getElementsByTagName('tr')
			// 			for (let i = 1; i < trs.length; i++) {
			// 				trs[i].setAttribute('draggable', true)
			// 				trs[i].setAttribute('data-id', i - 1)
			// 				trs[i].addEventListener('dragstart', that.dragStart)
			// 				trs[i].addEventListener('drop', that.drop)
			// 				trs[i].addEventListener('dragover', that.dragOver)
			// 			}
			// 		}
			// 	})
			// },
			// setDragTable2 () {
			// 	let that = this
			// 	this.$nextTick(function () {
			// 		let trs2 = document.getElementsByClassName('follow-table2')[0].getElementsByTagName('tr')
			// 		for (let i = 1; i < trs2.length; i++) {
			// 			trs2[i].setAttribute('draggable', true)
			// 			trs2[i].setAttribute('data-id2', i - 1)
			// 			trs2[i].addEventListener('dragstart', that.dragStart)
			// 			trs2[i].addEventListener('drop', that.drop)
			// 			trs2[i].addEventListener('dragover', that.dragOver)
			// 		}
			// 	})
			// },
			setDragTable3 () {
				let that = this
				this.$nextTick(function () {
					if (this.projectList != []) {
						let trs2 = document.getElementsByClassName('follow-table3')[0].getElementsByTagName('tr')
						for (let i = 1; i < trs2.length; i++) {
							trs2[i].setAttribute('draggable', true)
							trs2[i].setAttribute('data-id3', i - 1)
							trs2[i].addEventListener('dragstart', that.dragStart)
							trs2[i].addEventListener('drop', that.drop)
							trs2[i].addEventListener('dragover', that.dragOver)
						}
					}
				})
			},
			// 选择项目开启时间
			selectOpenDate (e) {
				this.openDate = e.target.value
				console.log(this.openDate)
			},

			changeOpenDate1 (item) {
				item.days = null
			},

			// 拖动改变表格排序
			dragOver (ev) {
				ev.preventDefault();
			},
			dragStart (e) {
				if (this.current == 1) {
					this.startId3 = parseInt(e.currentTarget.attributes['data-id3'].value)
				}

			},
			drop (e) {
				let startIndex
				let endIndex
				if (this.current == 1) {
					this.endId3 = parseInt(e.currentTarget.attributes['data-id3'].value)
					startIndex = this.startId3 + (this.page - 1) * this.pageSize
					endIndex = this.endId3 + (this.page - 1) * this.pageSize
					if (endIndex < startIndex) {
						let startFollow = JSON.parse(JSON.stringify(this.projectList[this.startId3]))
						for (let i = this.startId3; i > this.endId3; i--) {
							this.projectList[i] = JSON.parse(JSON.stringify(this.projectList[i - 1]))
						}
						for (let i = startIndex; i > endIndex; i--) {
							this.tableList[i] = JSON.parse(JSON.stringify(this.tableList[i - 1]))
						}
						this.projectList[this.endId3] = JSON.parse(JSON.stringify(startFollow))
						this.tableList[endIndex] = JSON.parse(JSON.stringify(startFollow))
					} else {
						let startFollow = JSON.parse(JSON.stringify(this.projectList[this.startId3]))
						for (let i = this.startId3; i < this.endId3; i++) {
							this.projectList[i] = JSON.parse(JSON.stringify(this.projectList[i + 1]))
						}
						for (let i = startIndex; i < endIndex; i++) {
							this.tableList[i] = JSON.parse(JSON.stringify(this.tableList[i + 1]))
						}
						this.projectList[this.endId3] = JSON.parse(JSON.stringify(startFollow))
						this.tableList[endIndex] = JSON.parse(JSON.stringify(startFollow))
					}
					this.projectList = JSON.parse(JSON.stringify(this.projectList))
					this.tableList = JSON.parse(JSON.stringify(this.tableList))
				}
			},

			// 客户阶段关联待办项目
			customChange (e) {
				this.need = e.target.value
				console.log('radio checked', e.target.value);
				if (this.need == 1) {
					this.way = []
					this.value2 = []
					this.value3 = []
					this.nums = 1
				}
			},

			// 清空任务
			async delCustom (record, index) {
				let that = this
				let title = '是否确认清空任务？'
				if(record.content.project_id === 0) {
					this.deleteCustom(title, record, index)
				} else {
					const {data: res} = await this.axios.post('wait-project/del-project-task', {
						id  : record.follow_id,
						type: 1
					})
					if (res.error != 0) {
						this.$message.error(res.error_msg)
					} else {
						if (res.data.is_del == 1) {
							title = '当前客户正在服务中，一旦清空后，无法再对该客户进行待办服务。确定要清空服务待办吗？'
						}
						this.deleteCustom(title, record, index)
					}
				}
			},
			deleteCustom (title, record, index) {
				let that = this
				let d = {
					content    : {
						task_id   : 0,
						title     : '', //项目不能重复
						project_id: 0,  //初始化传0 后面传对应的
						userInfo  : '', // 项目处理人
						descTitle : [],// 项目提醒
						type      : 1, //1手动开启 2 自动开启 3 N天后开启
						days      : '', //选N天填写 必须大于0
						date      : null,
					},
					follow_id  : record.follow_id,
					is_change  : 1,
					num        : null,
					projectName: record.projectName,
					project_one: [],
					project_two: [],
					type       : 0,
					way        : [],
					rowSpan    : 1,
				}
				this.$confirm({
					title     : title,
					// content: '确认后所有任务将被清空',
					okText    : '是',
					okType    : 'danger',
					cancelText: '否',
					onOk () {
						let rowSpan = that.customList[index].rowSpan
						that.customList.splice(index, 1, d)
						for (let i = 1; i < rowSpan; i++) {
							that.customList.splice(index + 1, 1)
						}
					},
					onCancel () {
					},
				});
			},
			// 是否完成任务改变跟进状态
			switchChange (checked) {
				if (checked == false) {
					this.switchState = 0
				} else {
					this.switchState = 1
				}
				console.log(this.switchState)
			},
			// 打开弹窗
			addCustom () {
				this.showState = true
				this.isAddOrEdit = 1
				this.customAddOrEditTitle = '添加任务'
				this.follow_id = '请选择跟进状态'
				this.need = 1
				this.switchState = 1
				this.way = []
				this.nums = 1
				this.value2 = []
				this.value3 = []
				this.content = [
					{
						task_id   : 0,
						title     : '请选择项目名称', //项目不能重复
						project_id: 0,  //初始化传0 后面传对应的
						userInfo  : '', // 项目处理人
						descTitle : [],// 项目提醒
						type      : 1, //1手动开启 2 自动开启 3 N天后开启
						days      : '', //选N天填写 必须大于0
						date      : null,// 用于接收projectList数组中的完成时间
					}
				]
				this.projectName = ''
				this.getFollowStatus()
				this.customVisible = true
			},
			// 添加任务
			addCustom2 (record, index) {
				if (record.is_change == 0) {
					this.showState = true
					this.switchState = 0
				} else {
					this.showState = true
					this.switchState = 1
				}
				this.follow_id = record.follow_id
				this.need = 1
				this.way = []
				this.nums = 1
				this.value2 = []
				this.value3 = []
				this.content = [
					{
						task_id   : 0,
						title     : '请选择项目名称', //项目不能重复
						project_id: 0,  //初始化传0 后面传对应的
						userInfo  : '', // 项目处理人
						descTitle : [],// 项目提醒
						type      : 1, //1手动开启 2 自动开启 3 N天后开启
						days      : '', //选N天填写 必须大于0
						date      : null,// 用于接收projectList数组中的完成时间
					}
				]
				this.projectName = ''
				this.editIndex = index
				this.showName = record.projectName
				this.customAddOrEditTitle = '添加任务'
				this.getFollowStatus()
				this.getContent()
				this.isAddOrEdit = 3
				this.customVisible = true
			},
			// 编辑关联项目
			editCustom (record, index) {
				if (record.is_change == 0) {
					this.showState = true
				} else {
					this.showState = true
				}
				this.editIndex = index
				this.showName = record.projectName
				this.customAddOrEditTitle = '编辑任务'
				this.isAddOrEdit = 2
				this.follow_id = record.follow_id
				this.need = record.type != 0 ? record.type : 1
				this.switchState = record.is_change
				this.way = JSON.parse(JSON.stringify(record.way))
				this.nums = record.num ? record.num : 1
				this.value2 = JSON.parse(JSON.stringify(record.project_one))
				this.value3 = JSON.parse(JSON.stringify(record.project_two))
				this.content = []
				for (let i = 0; i < record.rowSpan; i++) {
					this.content.push(JSON.parse(JSON.stringify(this.customList[index + i].content)))
				}
				// this.content = JSON.parse(JSON.stringify(record.content))
				this.projectName = record.projectName
				this.customVisible = true
				this.getContent()

			},
			// 更改客户状态条件选择框
			handleCustomSelect () {

			},
			// 取消弹框
			handleCancelCustom () {
				this.arr = []
				this.customVisible = false
				// this.showState = false
				this.follow_id = '请选择跟进状态'
				this.need = 1
				this.switchState = 1
				this.way = []
				this.nums = 1
				this.value2 = []
				this.value3 = []
				this.content = [
					{
						task_id   : 0,
						title     : '请选择项目名称', //项目不能重复
						project_id: 0,  //初始化传0 后面传对应的
						userInfo  : '', // 项目处理人
						descTitle : [],// 项目提醒
						type      : 1, //1手动开启 2 自动开启 3 N天后开启
						days      : '', //选N天填写 必须大于0
						date      : null,// 用于接收projectList数组中的完成时间
					}
				]
				this.projectName = ''
			},
			isDisabled (title, title1) {
				for (let i = 0; i < this.arr.length; i++) {
					if (this.arr[i].title == title && title != title1) {
						return true
					}
				}
				return false
			},
			getContent () {
				// 清空数组
				this.arr = []
				for (let item = 0; item < this.customList.length; item++) {
					if(item < this.editIndex || this.editIndex + this.customList[this.editIndex].rowSpan - 1 < item) {
						if(this.customList[item].content.title != '') {
							this.arr.push(this.customList[item].content)
						}
					}
				}
				this.arr = this.arr.concat(this.content)
				function unique (arr) {
					return Array.from(new Set(arr))
				}
				this.arr = unique(this.arr)
			},
			// 确认弹框
			handleCustom () {
				if (this.follow_id == '请选择跟进状态') {
					this.$message.destroy()
					this.$message.warning("请选择跟进状态")
					return false
				}
				let h = false
				for (let i = 0; i < this.content.length; i++) {
					// this.content.forEach(item => {
					if (this.content[i].title == '请选择项目名称') {
						h = true
						this.$message.destroy()
						this.$message.warning("请选择项目名称")
						return false
					} else if (this.content[i].days < 0) {
						h = true
						this.$message.destroy()
						this.$message.warning("项目开启时间不能小于0天")
						return false
					}
					if (this.content[i].type == 3) {
						if (this.content[i].days == '' || this.content[i].days == null) {
							h = true
							this.$message.destroy()
							this.$message.warning("请输入开启时间")
							return false
						}
					}
					// let reg = /^[0-9]+.?[0-9]*$/;
					// if (this.content[i].type == 3) {
					// 	if (!reg.test(this.content[i].days)) {
					// 		h = true
					// 		this.$message.destroy()
					// 		this.$message.warning("项目开启天数请输入具体数字")
					// 		return false
					// 	}
					// }
					// })
				}
				// let reg2 = /^[0-9]+.?[0-9]*$/;
				if (this.need == 2) {
					let that = this
					this.way.filter(item => {
						if (item == 1) {
							if (that.value2.length == 0) {
								h = true
								that.$message.destroy()
								that.$message.warning("请选择至少完成的项目")
								return false
							} else if (!that.nums) {
								h = true
								that.$message.destroy()
								that.$message.warning("请选择进入下阶段至少完成的项目数量")
								return false
							}
						} else if (item == 2) {
							if (that.value3.length == 0) {
								h = true
								that.$message.destroy()
								that.$message.warning("请选择需完成项目")
								return false
							}
						}
					})
				}

				if (this.value2.length > 0) {
					if (this.nums > this.value2.length) {
						h = true
						this.$message.destroy()
						this.$message.warning("所选项目数不能大于项目总数")
						return false
					}
				}


				if (this.need == 2) {
					if (this.way.length == 0) {
						h = true
						this.$message.destroy()
						this.$message.warning("请选择更改客户状态条件")
						return false
					}
				}

				if (h == true) {
					return false
				}

				this.projectName = this.follows.find(p => p.id == this.follow_id).title
				let d = {
					follow_id  : this.follow_id,
					type       : this.need,
					is_change  : this.switchState,
					way        : this.way,
					num        : Number(this.nums),
					project_one: this.value2,
					project_two: this.value3,
					content    : this.content,
					projectName: this.projectName,
					rowSpan    : 1
				}
				let a = false
				if (a == true) {
					return false
				}
				// if (this.isAddOrEdit == 1) {
				// 	let index = this.customList.findIndex((item) => item.follow_id == d.follow_id)
				// 	if (this.customList[index].content.length == 0) {
				// 		this.customList.splice(index, 1, d)
				// 	} else {
				// 		this.customList[index].content = (this.customList[index].content).concat(d.content)
				// 	}
				// } else if (this.isAddOrEdit == 2) {
				// 	// TODO
				// 	// if满足了，length == 0，里面的for不会执行，没看懂为什么这么写 --wangbowen
				// 	if (d.content.length < 1) {
				// 		for (let a = 0; a < d.content.length; a++) {
				// 			if (d.content[a].title == "请选择项目名称") {
				// 				this.$message.destroy()
				// 				this.$message.warning("请选择项目，如无需选择，请取消操作")
				// 				return false
				// 			}
				// 		}
				// 	} else {
				// 		this.customList.splice(this.editIndex, 1, d)
				// 	}
				// } else if (this.isAddOrEdit == 3) {
				if (d.content.length < 1) {
					this.$message.destroy()
					this.$message.warning("请选择项目，如无需选择，请取消操作")
					return false
				} else {
					if (this.customList[this.editIndex].content.title == '') {
						for (let i = 0; i < d.content.length; i++) {
							let index = this.editIndex + i
							if (i == 0) {
								this.customList[this.editIndex].follow_id = d.follow_id
								this.customList[this.editIndex].type = d.type
								this.customList[this.editIndex].is_change = d.is_change
								this.customList[this.editIndex].way = d.way
								this.customList[this.editIndex].num = d.num
								this.customList[this.editIndex].project_one = d.project_one
								this.customList[this.editIndex].project_two = d.project_two
								this.customList[this.editIndex].content = d.content[i]
								this.customList[this.editIndex].rowSpan = d.content.length
							} else {
								let c = JSON.parse(JSON.stringify(d))
								c.content = c.content[i]
								c.rowSpan = 0
								this.customList.splice(this.editIndex + i, 0, c)
							}
						}
					} else {
						for (let j = this.customList[this.editIndex].rowSpan - 1; j > 0; j--) {
							this.customList.splice(this.editIndex + j, 1)
						}
						for (let len = 0; len < d.content.length; len++) {
							let index = this.editIndex + len
							if (len == 0) {
								this.customList[this.editIndex].follow_id = d.follow_id
								this.customList[this.editIndex].type = d.type
								this.customList[this.editIndex].is_change = d.is_change
								this.customList[this.editIndex].way = d.way
								this.customList[this.editIndex].num = d.num
								this.customList[this.editIndex].project_one = d.project_one
								this.customList[this.editIndex].project_two = d.project_two
								this.customList[this.editIndex].content = d.content[len]
								this.customList[this.editIndex].rowSpan = d.content.length
							} else {
								let c = JSON.parse(JSON.stringify(d))
								c.content = c.content[len]
								c.rowSpan = 0
								if (this.customList.length <= this.editIndex + 1) {
									this.customList.splice(this.editIndex + len, 0, c)
								} else {
									if (this.customList.length > this.editIndex + len && this.customList[this.editIndex + len]['follow_id'] != d.follow_id) {
										this.customList.splice(this.editIndex + len, 0, c)
									} else {
										this.customList.splice(this.editIndex + len, 1, c)
									}
								}

							}
						}

					}

				}

				// }
				this.customVisible = false
				this.arr = []
			},

			// 添加客户关联项目
			addProjectIndex () {
				let p = {
					title     : '请选择项目名称', //项目不能重复
					userInfo  : '',
					descTitle : [],
					project_id: 0,  //初始化传0 后面传对应的
					type      : 1, //1手动开启 2 自动开启 3 N天后开启
					days      : '', //选N天填写 必须大于0
					date      : null,
				}
				this.content.push(p)
				this.getContent()
			},
			deleteProjectIndex(index) {
				let idx = this.value2.findIndex(v => v == this.content[index].title)
				if (idx > -1) {
					this.value2.splice(idx, 1)
				}
				let idx1 = this.value3.findIndex(v => v == this.content[index].title)
				if (idx1 > -1) {
					this.value3.splice(idx1, 1)
				}
				if (this.nums > this.value2.length) {
					this.nums = this.nums - 1 == 0 ? 1 : this.nums - 1
				}
				if (index == 0 && this.content.length == 1) {
					let p = {
						title     : '请选择项目名称', //项目不能重复
						userInfo  : '',
						descTitle : [],
						project_id: 0,  //初始化传0 后面传对应的
						type      : 1, //1手动开启 2 自动开启 3 N天后开启
						days      : '', //选N天填写 必须大于0
						date      : null,
					}
					this.content.splice(index, 1, p)
				} else {
					this.content.splice(index, 1)
				}
				this.getContent()
			},

			// 删除项目
			async delProjectIndex (index) {
				let that = this
				if(this.content[index].project_id === 0) {
					this.deleteProjectIndex(index)
				} else {
					const {data: res} = await this.axios.post('wait-project/del-project-task', {
						id        : this.follow_id,
						project_id: this.content[index].project_id,
						type      : 1
					})
					if (res.error != 0) {
						this.$message.error(res.error_msg)
					} else {
						if (res.data.is_del == 1) {
							this.$confirm({
								title     : '当前客户正在服务中，一旦删除后，无法再对该客户进行待办服务。确定要删除服务待办吗？',
								okText    : '是',
								okType    : 'danger',
								cancelText: '否',
								onOk () {
									that.deleteProjectIndex(index)
								},
								onCancel () {
								},
							});
						} else {
							this.deleteProjectIndex(index)
						}

					}
				}
			},

			// 项目选择
			peojectSelect (value, index) {
				this.content[index].userInfo = this.tableList.find(p => p.title == value).user
				this.content[index].descTitle = this.tableList.find(p => p.title == value).remind
				this.content[index].date = this.tableList.find(p => p.title == value).finish_time
				this.getContent()
			},
			// 项目超时提醒
			handleChange1 (value) {
				this.projectType = value
				// console.log(`selected ${value}`);
			},
			// 截止之前提醒
			handleChange (value) {
				console.log(`selected ${value}`);
			},
			// 项目描述赋值
			projectDescChange (e) {
				this.projectDesc = e.target.value
			},

			// 获取所有成员
			async getAllStaffList (page = 1, user_id) {
				this.isLoading = true
				const {data: userRes} = await this.axios.post('work-user/get-all-user', {
					user_id: user_id,
					corp_id: this.corpId,
					is_all : 0,//带分页
					name   : this.name,
					page   : page
				})

				if (userRes.error != 0) {
					this.isLoading5 = false
					this.$message.error(userRes.error_msg)
				} else {
					this.isLoading5 = false
					this.count1 = userRes.data.count
					if (page == 1) {
						this.userList = userRes.data.info
					} else {
						this.userList = this.userList.concat(userRes.data.info)
					}
					if(user_id) {
						this.projectUserId = user_id
					}
					this.page1 = page;
				}
			},

			// 获取企业应用
			async getAppList (id) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id : this.corpId,
					suite_id: this.suite_id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.appList = res.data
					// console.log(res.data)
					// let e = {
					// 	target: {
					// 		value: this.typeValue
					// 	}
					// }
					// this.changeType(e)

					if (id) {
						this.appId = id
					} else if (this.appList.length != 0 && !id) {
						this.appId = this.appList[0].id
					}
				}
			},

			// 添加项目提醒
			addProjectRemind (index) {
				let a = {
					type: '1',
					days: 1
				}
				// this.projectRemind.unshift(a)
				this.projectRemind.splice(index + 1, 0, a)
			},

			// 删除项目提醒
			delProjectRemind (index) {
				this.projectRemind.splice(index, 1)
				// console.log(this.projectRemind[index])
			},

			onChange (e) {
				this.way = JSON.parse(JSON.stringify(e))
			},
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
					this.follows = res.data.follow
					if (this.is_follow_del == 1) {
						let obj = {
							id    : this.follow_id,
							title : this.followTitle,
							status: 0
						}
						this.follows.unshift(obj)
					}
				}
			},
			// 选择的项目优先级
			projectChange (value) {
				// this.projectLevelTitle=value
			},
			//选择成员组件回调->按周期编辑
			selectStaffCallback2 (event, id, index) {
				if (event == "ok") {
					this.projectUserId = id
					console.log(event)
				}
			},
			// 新增
			addProject () {
				this.openStyle = true
				this.getAllStaffList()
				this.projectTitle = ''
				this.projectDesc = ''
				this.projectRemind = [
					{
						type: '1',
						days: 1
					}
				]
				this.projectDay = 3
				this.projectLevelTitle = '选择优先级'
				this.projectUserId = '请选择企业成员'
				this.projectUserName = null
				// this.appId = ''
				this.projectAddOrEditTitle = '添加待办项目'
				this.projectVisible = true
			},
			// 编辑
			editProject (item, index) {
				this.editProjectName = item.title
				this.getAllStaffList(1, item.user_id)
				this.openStyle = false
				this.openIndex = index
				this.projectAddOrEditTitle = '编辑待办项目'
				this.projectTitle = item.title
				this.projectDesc = item.desc
				this.projectRemind = JSON.parse(JSON.stringify(item.remind))
				this.projectRemind.filter(item => {
					if (item.type == 1) {
						item.type = '1'
					} else if (item.type == 2) {
						item.type = '2'
					}
				})
				this.userList
				this.projectDay = item.finish_time
				this.projectLevelTitle = item.level
				this.projectUserName = item.user
				// this.appId = item.agent_id
				this.projectVisible = true
			},
			//删除
			async delProject (obj, index) {
				let flag = false
				for(let i = 0; i < this.customList.length; i++) {
					if(obj.title == this.customList[i].content.title) {
						this.$message.warning('当前待办项目【' + obj.title + '】已关联在客户阶段【'+ this.customList[i].projectName +'】中，暂不可删除。')
						flag = true
						return false
					}
				}
				if(flag) {
					return false
				}
				let title = '是否确认删除项目?'
				if (obj.id == 0) {
					this.deleteProject(obj, title, index)
				} else {
					const {data: res} = await this.axios.post('wait-project/del-project-task', {
						id  : obj.id,
						type: 0
					})
					if (res.error != 0) {
						this.$message.error(res.error_msg)
					} else {

						if (res.data.is_del == 1) {
							title = '当前客户正在服务中，一旦删除后，无法再对该客户进行待办服务。确定要删除【' + obj.title + '】吗？'
						}
						this.deleteProject(obj, title, index)
					}
				}
			},
			deleteProject (obj, title, index) {
				let that = this
				this.$confirm({
					title     : title,
					okText    : '确定',
					okType    : 'danger',
					cancelText: '取消',
					onOk () {
						index = (that.page - 1) * 15 + index
						if (index == that.tableList.length - 1 && (index + 1) % 15 == 1) {
							that.page = that.page - 1 == 0 ? 1 : that.page - 1
						}
						that.tableList.splice(index, 1)
						that.total = that.tableList.length
						that.getPageData(that.tableList, that.page, that.pageSize)
						let table = that.getPageData(that.tableList, that.page, that.pageSize);
						that.page = table.page
						that.projectList = table.list
						for (let c = 0; c < that.customList.length; c++) {
							if (that.customList[c].content.length > 0 && that.customList[c].content.length == 1) {
								that.customList[c].content.filter(f => {
									if (f.project_id == obj.id) {
										that.customList[c].content = []
										that.customList[c].is_change = 1
										that.customList[c].way = []
										that.customList[c].num = null
										that.customList[c].project_one = []
										that.customList[c].project_two = []
										that.customList[c].type = 0
									}
								})
							} else if (that.customList[c].content.length > 1) {
								that.customList[c].content.filter(f => {
									if (f.project_id == obj.id) {
										let index = that.customList[c].content.findIndex(item => item.project_id == obj.id)
										that.customList[c].content.splice(index, 1)
									}
								})
							}
						}

					},
					onCancel () {
					},
				});
			},
			//单选框选中数据
			onSelectChange3 (val) {
				console.log(val)
			},
			// 关闭 取消弹框
			handleCancelProject () {
				this.selectUserId = ''
				this.name = ''
				this.projectVisible = false
			},
			// 确认弹框
			handleProject () {
				if (this.projectTitle.trim() == '') {
					this.$message.destroy()
					this.$message.warning("项目名称不能为空")
					return false
				} else if (this.projectUserId == '请选择企业成员') {
					this.$message.destroy()
					this.$message.warning("请选择项目处理人")
					return false
				} else if (this.projectDay == '' || this.projectDay == null) {
					this.$message.destroy()
					this.$message.warning("请选择项目完成时间")
					return false
				} else if (this.projectDay < 1) {
					this.$message.destroy()
					this.$message.warning("项目完成时间需大于0天")
					return false
				} else if (this.projectLevelTitle == '选择优先级') {
					this.$message.destroy()
					this.$message.warning("请选择优先级")
					return false
				}

				let a = false
				switch (this.openStyle) {
					case true:
						this.projectList.filter(item => {
							if (this.projectTitle == item.title) {
								a = true
								this.$message.destroy()
								this.$message.warning("项目名称已存在")
								return false
							}

						})
						break;
					case false:
						let arr = []
						for (let i = 0; i < this.projectList.length; i++) {
							if (i != this.openIndex) {
								arr.push(this.projectList[i])
							}
						}
						arr.filter(item => {
							if (this.projectTitle == item.title) {
								a = true
								this.$message.destroy()
								this.$message.warning("项目名称已存在")
								return false
							}
						})
						break;
				}
				this.projectUserName = this.userList.find(f => f.id == this.projectUserId).name
				for (let indx = 0; indx < this.projectRemind.length; indx++) {
					this.projectRemind[indx].days = this.projectRemind[indx].days ? this.projectRemind[indx].days : 0
					if (this.projectRemind[indx].type == 1) {
						if (this.projectRemind[indx].days > this.projectDay) {
							a = true
							this.$message.destroy()
							this.$message.warning("项目提醒预计截止时间前的天数不能大于项目完成时间")
							return false
						} else if (this.projectRemind[indx].days < 1) {
							a = true
							this.$message.destroy()
							this.$message.warning("项目提醒预计截止时间前的天数应大于0天")
							return false
						}
						// else if (item.days =='') {
						// 	a = true
						// 	this.$message.warning("请填写项目提醒预计截止时间前的天数")
						// 	return false
						// }
					} else if (this.projectRemind[indx].type == 2) {
						if (this.projectRemind[indx].days < 1) {
							a = true
							this.$message.destroy()
							this.$message.warning("项目超时提醒天数应大于0天")
							return false
						}
						// else if (item.days =='') {
						// 	a = true
						// 	this.$message.warning("请填写项目超时提醒天数")
						// 	return false
						// }
					}
				}
				for (let i = 0; i < this.projectRemind.length - 1; i++) {
					for (let j = i + 1; j < this.projectRemind.length; j++) {
						if (this.projectRemind[i].type == this.projectRemind[j].type) {
							// if (this.projectRemind[i].days !== '') {
							if (this.projectRemind[i].days == this.projectRemind[j].days) {
								a = true
								this.$message.destroy()
								this.$message.warning("同一条件下所设置的任务提醒天数不能重复")
								return false
							}
							// }
						}
					}
				}
				if (a == true) {
					return false
				}
				let c = {
					title      : this.projectTitle,//
					remind     : this.projectRemind,//
					desc       : this.projectDesc,//
					sort       : this.sortSum++,//
					user       : this.projectUserName,
					finish_time: this.projectDay,//
					user_id    : this.projectUserId,//
					id         : 0, //
					level      : this.projectLevelTitle,//
					depart_name: this.departmentName
				}
				if (this.openStyle == true) {
					this.tableList.unshift(c)
					this.projectList.unshift(c)
					this.total = this.tableList.length
					this.getPageData(this.tableList, this.page, this.pageSize)
					// this.setDragTable3()
				} else if (this.openStyle == false) {

					if (this.tableList.length > 15) {
						this.openIndex = (this.page - 1) * 15 + this.openIndex
					}
					c.id = this.tableList[this.openIndex].id
					c.depart_name = this.departmentName || this.tableList[this.openIndex].depart_name
					// this.projectList.splice(this.openIndex, 1, c)
					for (let i = 0; i < this.customList.length; i++) {
						if (this.tableList[this.openIndex].title == this.customList[i].content.title) {
							this.customList[i].content.title = c.title
							this.customList[i].content.descTitle = c.remind
							this.customList[i].content.project_id = c.id
							this.customList[i].content.userInfo = c.user
							this.customList[i].content.date = this.projectDay
						}
					}
					this.tableList.splice(this.openIndex, 1, c)
					this.total = this.tableList.length
					this.getPageData(this.tableList, this.page, this.pageSize)
					let table = this.getPageData(this.tableList, this.page, this.pageSize);
					this.page = table.page
					this.projectList = table.list
				}

				this.projectVisible = false
				this.name = ''
			},
			focusUser () {
				if (this.name != '') {
					this.name = ''
					this.getAllStaffList()
				}
			},
			searchUser (e) {
				this.name = e
				clearTimeout(this.intNum)
				let that = this
				this.intNum = setTimeout(() => {
					that.getAllStaffList(1, that.projectUserId)
				}, 500)
			},
			//选择成员
			changeSelect (value) {
				this.departmentName = this.userList.find(f => f.id == value).department_name
			},
			//下拉框滚动事件
			popScroll (e) {
				let target = e.target
				if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
					//到底了，加载下一页
					if (this.userList.length < this.count1) {
						this.page1++
						this.getAllStaffList(this.page1, this.projectUserId)
					}
				}

			},


			// 确认项目提交方法
			async createActivity () {
				this.isLoadingb = true
				let customList = JSON.parse(JSON.stringify(this.customList))
				for (let i = 0; i < customList.length; i++) {
					if (customList[i].content.title == '') {
						customList[i].content = []
					}
				}
				const {data: res} = await this.axios.post('wait-project/add', {
					uid     : localStorage.getItem("uid"),
					agent_id: this.appId,
					corp_id : this.corpId,
					// project_status: this.executionStatusList,
					// project_level : this.priorityList,
					project : this.tableList,
					task    : customList
				})
				if (res.error != 0) {
					this.isLoadingb = false
					this.$message.error(res.error_msg)
				} else {
					this.isLoadingb = false
					this.current = 0
					this.stateAll = false
					this.getDefaultData()
				}
			},

			// 步骤条上下步方法
			changeCurrent (index) {
				this.current = index
			},

			next () {
				this.current++;
			},

			prev () {
				this.current--;
			},

			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
		},

		created () {
			// this.getAccount();
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.content-msg {
		/*width: 500px;*/
		display: inline-block;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 15px;
	}

	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.right {
		float: right;
		font-size: 16px;
		vertical-align: top;
		margin: 10px 0;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		margin: 20px 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.steps-content {
		/*margin-top: 20px;*/
		border-radius: 6px;
		height: calc(100% - 52px);
		padding: 0 30px;
		overflow-y: auto;
	}

	.steps-action {
		position: fixed;
		bottom: 0px;
		height: 60px;
		line-height: 60px;
		width: 100%;
		transform: translateX(-40px);
		text-align: center;
		border-top: 1px solid #F1F1F1;
		background-color: #F0F2F5;
	}


	.arrow-left {
		vertical-align: middle;
		display: inline-block;
		width: 0;
		height: 0;
		border: 5px solid;
		border-color: transparent #01b065 transparent transparent;
	}

	.arrow-right {
		vertical-align: middle;
		display: inline-block;
		width: 0;
		height: 0;
		border: 5px solid;
		border-color: transparent transparent transparent #01b065;
	}

	.line {
		display: inline-block;
		height: 0;
		width: calc(100% - 10px);
		border-top: 2px solid #01b065;
		vertical-align: middle;
	}

	.line-right {
		height: 20px;
		width: 0;
		border-right: 2px solid #01b065;
		margin-right: 4.17%;
		float: right;
	}

	.line-left {
		height: 20px;
		width: 0;
		border-right: 2px solid #01b065;
		margin-left: 4.17%;
		float: left;
	}

	.arrow-bottom {
		display: inline-block;
		color: #C3C3C3;
		-moz-transform: rotate(90deg);
		-webkit-transform: rotate(90deg);
		-o-transform: rotate(90deg);
		transform: rotate(90deg);
		width: 0;
		height: 0;
		border: 5px solid;
		border-color: transparent transparent transparent #01b065;
	}

	.arrow-bottom-right {
		line-height: 10px;
		float: right;
		margin-right: calc(4.17% - 4px);
	}

	.arrow-bottom-left {
		line-height: 9px;
		float: left;
		margin-left: calc(4.17% - 4px);
	}

	.color-show {
		width: 20px;
		height: 20px;
		display: inline-block;
		margin: 0 10px;
		vertical-align: sub;
		border: 1px solid #BFBFBF;
	}

	.btn-tag {
		border: 1px solid #01b065;
		color: #01b065;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.active {
		margin-bottom: 5px;
	}

	.ant-checkbox-wrapper + .ant-checkbox-wrapper {
		margin-left: 0;
	}

	/deep/ .ant-select-selection--multiple {
		margin-bottom: 10px;
	}

	/deep/ .ant-input-number-handler-down, /deep/ .ant-input-number-handler-wrap, /deep/ .ant-input-number-handler-up {
		display: none;
	}
	.desc{
		word-break: break-word;
		width: 180px;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 5;
		line-clamp: 5;
		-webkit-box-orient: vertical;
	} 
</style>