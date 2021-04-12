<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="加载中..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="typeof urlId == 'undefined'">新建消息</template>
						<template v-if="typeof urlId != 'undefined'">修改消息</template>
						<a-button type="primary" @click="goBack" style="float: right;margin-top: 9px;">
							返回列表
						</a-button>
					</a-layout-header>
					<a-layout class="fans-content">
						<!-- 左侧 -->
						<a-layout-sider>
							<div v-show="(validity == 1 || validity == 3) && isRedpacket == 0" class="wrap">
								<img src="../../../assets/wxHeader.png" alt
								     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
								<div class="msg_content_body">
									<!--文本-->
									<div v-if="text" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<pre class="item-info msg_content_txt"
										     style="display:block;white-space: pre-wrap;word-wrap: break-word;">{{text}}</pre>
									</div>
									<!--图片-->
									<div v-if="img" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;object-fit: cover;"/>
										<img :src="commonUrl+img" alt
										     style="width: 100px;border-radius: 4px;"/>
									</div>
									<!--网址-->
									<div v-if="modalUrlOk" class="mt">
										<template>
											<div style="border: 1px solid #E8E8E8;">
												<img :src="commonUrl+msgUrl"
												     style="height: 145px;width: 100%; object-fit: cover;"/>
												<div class="inputTitle"
												     v-html="inputTitle==''?'标题':inputTitle"></div>
											</div>
										</template>
									</div>
									<!--小程序-->
									<div v-if="modalAppletOk" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<div class="item-info msg_content_txt">
											<!--											<p class="url-title" style="color: #A3A3A3;">{{appletInputTitle}}</p>-->
											<p class="applet-title">{{appletInputTitle}}</p>
											<img :src="commonUrl+appletUrl" alt=""
											     style="width: 100%;object-fit: cover;">
										</div>
									</div>
								</div>
							</div>
							<div v-show="(validity == 1 || validity == 3) && isRedpacket == 1" class="wrap">
								<img src="../../../assets/wxHeader.png" alt
								     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
								<div class="msg_content_body">
									<!--图文-->
									<div class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<div v-if="rule.redrule_type == 1" class="item-info msg_content_txt">
											<p class="url-title">{{rule1.rule_title || '标题'}}</p>
											<div style="overflow: hidden;">
												<div class="url-text">{{rule1.rule_des}}</div>
												<img :src="commonUrl+rule1.rule_pic_url" alt=""
												     style="object-fit: cover;"
												     class="url-img">
											</div>
										</div>
										<div v-if="rule.redrule_type == 2" class="item-info msg_content_txt">
											<p class="url-title">{{rule2.rule_title || '标题'}}</p>
											<div style="overflow: hidden;">
												<div class="url-text">{{rule2.rule_des}}</div>
												<img :src="commonUrl+rule2.rule_pic_url" alt=""
												     style="object-fit: cover;"
												     class="url-img">
											</div>
										</div>
									</div>
								</div>
							</div>
							<div v-show="validity == 2" class="wrap">
								<img src="../../../assets/wxHeader.png" alt
								     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
								<div class="msg_content_body">
									<!--文本-->
									<div v-if="typeValue == 1 && text" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<span class="item-info msg_content_txt">{{text}}</span>
									</div>
									<!--图片-->
									<div v-if="typeValue ==2 && img" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<img :src="commonUrl+img" alt
										     style="width: 150px;border-radius: 4px;"/>
									</div>
									<!--语音-->
									<div v-if="typeValue ==3 && fileName" class="mt">
										<div class="audio">
											<div style="float: left;font-size: 16px;">{{fileName}}
											</div>
											<div class="box">
												<div class="wifi-symbol">
													<div class="wifi-circle first"></div>
													<div class="wifi-circle second"></div>
													<div class="wifi-circle third"></div>
												</div>
											</div>
										</div>
									</div>
									<!--视频-->
									<div v-if="typeValue ==4" class="mt">
										<!-- 选中前 -->
										<template v-if="fileName == ''">
											<a-card hoverable style="width: 100%">
												<img alt="example"
												     src="http://s.weituibao.com/static/1545276720179/video.png"
												     slot="cover"/>
												<a-card-meta style="height: 50px;"></a-card-meta>
											</a-card>
										</template>
										<!-- 选中后 -->
										<template v-if="fileName">
											<a-card hoverable style="width: 100%">
												<video-player class="video-player vjs-custom-skin" ref="videoPlayer"
												              :playsinline="true"
												              :options="playerOptions"></video-player>
												<a-card-meta :title="fileName"
												             style="height: 50px;line-height: 50px;text-align: center;">
												</a-card-meta>
											</a-card>
										</template>
									</div>
									<!--图文-->
									<div v-if="typeValue == 5" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<div class="item-info msg_content_txt">
											<p class="url-title">{{inputTitle}}</p>
											<div style="overflow: hidden;">
												<div class="url-text">{{digest}}</div>
												<img :src="commonUrl+msgUrl" alt="" class="url-img">
											</div>
										</div>
									</div>
									<!--小程序-->
									<div v-if="typeValue == 6" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<div class="item-info msg_content_txt">
											<!--											<p class="url-title" style="color: #A3A3A3;">{{appletInputTitle}}</p>-->
											<p class="applet-title">{{appletInputTitle}}</p>
											<img :src="commonUrl+appletUrl" alt="" style="width: 100%;">
										</div>
									</div>
									<!--文件-->
									<div v-if="typeValue == 7 && fileName" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<div class="item-info msg_content_txt">
											<a-card
													hoverable
													style="width: 90%;margin:auto;"
											>
												<div>
													<img
															alt="example"
															style="width: 60px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileicon.png"
															slot="cover"
													/>
													<div class="file-name">{{fileName}}</div>
												</div>
											</a-card>
										</div>
									</div>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- <a-spin tip="加载中..." size="large" :spinning="isLoading"></a-spin> -->
								<!-- 选择企业微信 -->
								<div class="content-hd" v-if="$store.state.corpArr.length > 1">
									<a-form>
										<a-form-item label="选择企业微信" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template>
												<div style="display: inline-block;cursor: pointer;" @click="changeCorp">
													<img src="../../../assets/WeChatLogo.jpg"
													     style="width: 24px;margin: -3px 6px 0 0;"/>
													<span>{{corpName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
													        v-if="typeof urlId=='undefined' && customItem == ''"/>
												</div>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</template>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd">
									<a-form>
										<!-- 消息名称 -->
										<a-form-item label="消息名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             style="padding-top: 15px;">
											<a-input v-model="title" placeholder="请填写消息名称，限20字符" :maxLength="20"
											         style="width: 60%;"
											         :disabled="typeof urlId=='undefined'?false:true"/>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{title === null ? 0 : title.length}} / 20</span>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦创建，不可修改）</span>
										</a-form-item>
										<!-- 群发类型 -->
										<a-form-item label="群发类型" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }" style="padding-top: 15px;">
											<a-radio-group name="radioGroup" v-model="validity" @change="changeValidity"
											               :disabled="typeof urlId=='undefined' && customItem == '' ?false:true">
												<a-radio v-show="!noBindFlag" :value="1">客户</a-radio>
												<a-radio :value="3">客户群</a-radio>
												<a-radio :value="2">企业成员
													<a-button :disabled="validity != 2" style="margin-left: 10px;"
													          @click="showDepartmentList(1)">
														选择
													</a-button>
													<span style="margin-left: 5px"
													      v-show="chooseNum3 > 0">已选择{{chooseUserNum3}}名成员，{{chooseDepartmentNum3}}个部门</span>
													<a style="margin-left: 10px;" v-show="chooseNum3 > 0"
													   @click="clearDepartmentList(1)">
														重置
													</a>
												</a-radio>
											</a-radio-group>
											<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
										</a-form-item>
										<a-form-item label="客户归属" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }" v-show="validity == 1">
											<a-radio-group name="radioGroup" v-model="fromCustom"
											               @change="changeFromCustom">
												<a-radio :value="1">全部成员</a-radio>
												<a-radio :value="2">
													<a-button
															@click="showDepartmentList(0)"
															:disabled="this.customItem.chooseNum > 0 || fromCustom!=2 ? true:false">
														选择成员
													</a-button>
													<span style="margin-left: 5px"
													      v-show="checkedList1.length > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
													<a style="margin-left: 10px;"
													   v-show="checkedList1.length> 0 && this.customItem == ''"
													   @click="clearDepartmentList(0)">
														重置
													</a>
												</a-radio>
											</a-radio-group>
										</a-form-item>
										<a-form-item label="群归属" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }" v-show="validity == 3">
											<a-radio-group name="radioGroup" v-model="fromCustom"
											               @change="changeFromCustom">
												<a-radio :value="1">全部成员</a-radio>
												<a-radio :value="2">
													<a-button
															:disabled="this.customItem.chooseNum2 > 0 || fromCustom!=2 ? true:false"
															@click="showDepartmentList(2)">
														选择成员
													</a-button>
													<span style="margin-left: 5px"
													      v-show="chooseNum2 > 0">已选择{{chooseUserNum2}}名成员，{{chooseDepartmentNum2}}个部门</span>
													<a style="margin-left: 10px;" v-show="chooseNum2 > 0"
													   @click="clearDepartmentList(2)">
														重置
													</a>
												</a-radio>
											</a-radio-group>
										</a-form-item>
										<a-form-item label="选择应用" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }" v-show="validity == 2">
											<template>
												<a-select
														showSearch
														optionFilterProp="children"
														style="width: 200px;"
														v-model="appId">
													<template v-for="item in appList">
														<a-select-option :value="item.id">{{item.name}}
														</a-select-option>
													</template>
												</a-select>
											</template>
										</a-form-item>
										<a-form-item label="群发客户" v-show="validity == 1" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-spin tip="加载中..." size="large" :spinning="selectLoading">
												<div>
													<a-radio-group name="radioGroup" v-model="correctness"
													               @change="changeCorrectness"
													               :disabled="customItem == '' ?false:true">
														<a-radio :value="2">按条件筛选客户</a-radio>
														<a-radio :value="1">全部客户</a-radio>
													</a-radio-group>
													<span>符合条件约<span
															style="color: #F56C6C">{{personsNum}}</span>人
														<a-tooltip title="预计人数：去除员工删除客户、客户删除员工及本月达到群发上限的客户数">
												<a-icon type="question-circle"
												        style="vertical-align: initial;margin-left: 5px;"/>
											</a-tooltip>
													</span>
												</div>
												<div class="pull-right fl" v-show="correctness==2">
													<a-form>
														<!--														<a-form-item label="成员客户" :label-col="{ span: 4 }"-->
														<!--														             :wrapper-col="{ span: 20 }">-->
														<!--															<a-button-->
														<!--																	@click="showDepartmentList(0)"-->
														<!--																	:disabled="this.customItem.chooseNum > 0 ? true:false">-->
														<!--																选择成员-->
														<!--															</a-button>-->
														<!--															<span style="margin-left: 5px"-->
														<!--															      v-show="checkedList1.length > 0">已选择{{checkedList1.length}}名成员</span>-->
														<!--															<a style="margin-left: 10px;"-->
														<!--															   v-show="checkedList1.length> 0 && this.customItem == ''"-->
														<!--															   @click="clearDepartmentList(1)">-->
														<!--																重置-->
														<!--															</a>-->
														<!--														</a-form-item>-->
														<a-form-item label="性别" :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<a-radio-group v-model="sex" @change="getPersonsNum">
																<a-radio :value="-1">全部
																</a-radio>
																<a-radio :value="1">男
																</a-radio>
																<a-radio :value="2">女
																</a-radio>
																<a-radio :value="3">未知
																</a-radio>
															</a-radio-group>
														</a-form-item>

														<a-form-item label="添加时间" :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<a-range-picker
																	:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
																	format="YYYY-MM-DD HH:mm"
																	allowClear
																	style="width:320px;margin-right: 5px;text-align: center;"
																	:disabled-date="disabledDate"
																	v-model="joinTime"
																	@change="changeJoinTime"
															/>
														</a-form-item>
														<a-form-item label="最后跟进时间" :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<a-range-picker
																	:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59:59', 'HH:mm')], format:'HH:mm'  }"
																	format="YYYY-MM-DD HH:mm"
																	allowClear
																	style="width:320px;margin-right: 5px;text-align: center;"
																	:disabled-date="disabledDate"
																	v-model="followTime"
																	@change="changeFollowTime"
															></a-range-picker>
														</a-form-item>
														<a-form-item label="上次单聊时间" :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<a-range-picker
																	:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"
																	format="YYYY-MM-DD HH:mm"
																	allowClear
																	style="width:320px;margin-right: 5px;text-align: center;"
																	:disabled-date="disabledDate"
																	v-model="chatTime"
																	@change="changeChatTime"
															></a-range-picker>
														</a-form-item>
														<a-form-item label="跟进次数" :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<a-input-group compact>
																<a-input style=" width: 100px; text-align: center"
																         placeholder="最小值" @change="followMinNumChange"
																         :value="followNum1" @blur="followNumBlur"/>
																<a-input
																		style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #FFF"
																		placeholder="~"
																		disabled
																/>
																<a-input
																		style="width: 100px; text-align: center; border-left: 0"
																		placeholder="最大值" @change="followMaxNumChange"
																		:value="followNum2" @blur="followNumBlur"/>
															</a-input-group>
														</a-form-item>
														<a-form-item label="绑定店铺" :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<a-select
																	allowClear
																	show-search
																	optionFilterProp="children"
																	v-model="signId"
																	placeholder="请选择店铺"
																	style="width: 195px;"
																	@change="getPersonsNum"
															>
																<a-select-option v-for="d in bindStoreList"
																                 :value="d.key">
																	{{d.username}}
																</a-select-option>
															</a-select>
														</a-form-item>
														<a-form-item label="区域" :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<a-cascader
																	:allowClear="false"
																	:options="cityData"
																	@change="changeCity"
																	v-model="province1"
																	style="width: 195px;text-align: left;"
															/>
														</a-form-item>
														<a-form-item v-for="(item, index) in defineField"
														             :label="item.title" :label-col="{ span: 4 }"
														             v-if="item.type == 2 || item.type == 3"
														             :wrapper-col="{ span: 20 }">
															<a-select
																	@change="getPersonsNum"
																	style="width: 195px"
																	v-model="fieldData[index].match"
																	:dropdownStyle="style"
																	placeholder="全部"
															>
																<a-select-option :value="''">全部</a-select-option>
																<a-select-option v-for="item1 in item.optionVal"
																                 :value="item1">{{item1}}
																</a-select-option>
															</a-select>
														</a-form-item>
														<a-form-item label="跟进状态" :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<a-select
																	@change="handleChangeFollowStatus"
																	style="width: 195px"
																	v-model="follow_status"
																	:dropdownStyle="style"
																	placeholder="全部"
															>
																<a-select-option :value="-1">全部</a-select-option>
																<a-select-option v-for="item in follows"
																                 :value="item.id">{{item.title}}<span
																		v-if="item.status == 0">（已删除）</span>
																</a-select-option>

															</a-select>
														</a-form-item>
														<a-form-item label="是否粉丝" :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<a-select
																	@change="getPersonsNum"
																	style="width: 195px"
																	v-model="is_fans"
																	:dropdownStyle="style"
																	placeholder="全部"
															>
																<a-select-option :value="0">全部</a-select-option>
																<a-select-option :value="1">是</a-select-option>
																<a-select-option :value="2">否</a-select-option>
															</a-select>
														</a-form-item>
														<a-form-item label="标签"
														             :label-col="{ span: 4 }"
														             :wrapper-col="{ span: 20 }">
															<corpChooseTag :callback="modalVisibleChange4"
															               :hasChoose="tag_arr"
															               v-if="isShowTag"></corpChooseTag>
														</a-form-item>
													</a-form>
												</div>
											</a-spin>
											<!--											<span style="color: #F56C6C;">（一旦创建，不可修改）</span>-->
										</a-form-item>
										<a-form-item v-show="validity == 1 || validity == 3" label="群发内容"
										             :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-radio-group name="isRedpacket" v-model="isRedpacket"
											               @change="changeIsRedpacket"
											               :disabled="typeof urlId !='undefined'">
												<a-radio :value="0">群发消息</a-radio>
												<a-radio :value="1">群发红包</a-radio>
												<span v-if="validity == 1">符合条件约<span
														style="color: #F56C6C">{{personsNum}}</span>人</span>
											</a-radio-group>
											<div class="pull-right fl" v-if="isRedpacket == 0">
												<a-textarea
														v-model="text" placeholder="最多1000个字" :maxLength="1000"
														:autoSize="{ minRows: 9, maxRows: 9 }"
												/>
												<div style="float: right;margin-top: 10px;">
													{{text.length}}/1000
												</div>
												<div v-if="!img && !modalUrlOk && !modalAppletOk"
												     style="margin: 10px 0;cursor: pointer;">
													<a-popover trigger="click" v-model="popVisible">
														<template slot="content">
															<div class="popover-menu" @click="choosePic(1)">
																<a-icon type="picture"/>
																<p>图片</p>
															</div>
															<div class="popover-menu  popover-menu1"
															     @click="chooseUrl(2)">
																<a-icon type="link"/>
																<p>图文</p>
															</div>
															<div class="popover-menu popover-menu2"
															     @click="chooseApplet(3)">
																<MyIcon type="icon-miniapp"></MyIcon>
																<p>小程序</p>
															</div>
														</template>
														<a-icon type="plus"></a-icon>
														添加图片/图文/小程序消息
													</a-popover>
												</div>
												<!-- 图片 -->
												<div v-if="img"
												     style="margin: 10px 0;cursor: pointer;float:left;"
												     @click="choosePic(1)">
													<a-icon type="picture" style="margin-right: 7px;"/>
													{{fileName}}
												</div>
												<!-- 网址 -->
												<div v-if="modalUrlOk"
												     style="margin: 10px 0;cursor: pointer;float:left;max-width: 200px;overflow: hidden;height: 40px;text-overflow: ellipsis;white-space: nowrap;"
												     @click="chooseUrl(2)">
													<a-icon type="link" style="margin-right: 7px;"/>
													{{inputTitle}}
												</div>
												<!-- 小程序 -->
												<div v-if="modalAppletOk"
												     style="margin: 10px 0;cursor: pointer;float:left;max-width: 200px;overflow: hidden;height: 40px;text-overflow: ellipsis;white-space: nowrap;"
												     @click="chooseApplet(3)">
													<MyIcon type="icon-miniapp"></MyIcon>
													{{appletInputTitle}}
												</div>

												<div v-if="img || modalUrlOk || modalAppletOk"
												     style="float:left;margin: 10px 0 0 10px;cursor: pointer;"
												     @click="deleteMessage">
													<a-icon type="close"/>
												</div>
											</div>
											<template v-if="isRedpacket == 1">
												<div class="pull-right">
													<a-radio-group
															:disabled="typeof urlId!='undefined' && redpacket_status != 1"
															v-model="rule.redrule_type">
														<a-radio :value="1">选择已有
															<chooseRule
																	:disabled="typeof urlId !='undefined' && redpacket_status != 1"
																	style="display:inline-block; width: 200px;"
																	:rule_id="rule.rule_id" @changeSelect="changeSelect"
																	v-if="rule.redrule_type == 1"></chooseRule>
														</a-radio>
														<a-radio :value="2">新建</a-radio>
													</a-radio-group>
													<a-form style="padding: 20px; background-color: #FFFFFF;"
													        v-if="rule.redrule_type == 2 || (rule.redrule_type == 1 && rule.rule_id)">
														<a-form-item class="current0" label="规则名称"
														             :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 19 }">
															<a-input style="width: 340px;"
															         v-if="rule.redrule_type == 2 && redpacket_status == 1"
															         placeholder="请输入红包规则" :maxLength="30"
															         v-model="rule2.rule_name">
														<span v-if="rule.redrule_type == 2" slot="suffix">
									                        <span>{{rule2.rule_name.length}}</span>/30
								                        </span>
															</a-input>
															<span v-if="rule.redrule_type == 1 || redpacket_status != 1">{{rule1.rule_name}}</span>
														</a-form-item>
														<a-form-item class="current0" label="单个红包金额"
														             :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 19 }">
															<a-radio-group name="radioGroup"
															               v-if="rule.redrule_type == 2 && redpacket_status == 1"
															               :value="rule2.rule_type"
															               @change="changeType2">
																<a-radio :value="1"
																         style="display: inline-block;height: 35px;line-height: 35px;">
																	定额
																	<span v-if="rule2.rule_type == 1">
																<a-input-number :step="0" :precision="2"
																                style="width: 140px;margin: 0 5px;"
																                :min="0.30" :max="200.00"
																                v-model="rule2.rule_fixed_amount"/>元
															</span>
																</a-radio>
																<a-radio :value="2"
																         style="display: inline-block;height: 35px;line-height: 35px;margin-left: 10px;">
																	按随机金额
																	<span v-if="rule2.rule_type == 2">
																<a-input-number :step="0" :precision="2"
																                style="width: 100px;margin: 0 5px;"
																                :min="0.30" :max="200.00"
																                v-model="rule2.rule_min_random_amount"/>元 ——
																<a-input-number :step="0" :precision="2"
																                style="width: 100px;margin-right: 5px;"
																                :min="0.30" :max="200.00"
																                v-model="rule2.rule_max_random_amount"/>元
															</span>
																</a-radio>
															</a-radio-group>
															<a-radio-group name="radioGroup"
															               v-if="rule.redrule_type == 1 || redpacket_status != 1"
															               :disabled="rule.redrule_type == 1"
															               :value="rule1.rule_type"
															               @change="changeType1">
																<a-radio :value="1"
																         style="display: inline-block;height: 35px;line-height: 35px;">
																	定额
																	<span v-if="rule1.rule_type == 1">{{rule1.rule_fixed_amount}}元</span>
																</a-radio>
																<a-radio :value="2"
																         style="display: inline-block;height: 35px;line-height: 35px;margin-left: 10px;">
																	按随机金额
																	<span v-if="rule1.rule_type == 2">{{rule1.rule_min_random_amount}}-{{rule1.rule_max_random_amount}}元</span>
																</a-radio>
															</a-radio-group>
															<div style="color: #F56C6C;">
																（一旦发布，不可修改。精确到小数点后两位，可输入0.30~200.00）
															</div>
														</a-form-item>
														<a-form-item class="current0" label="红包封面"
														             :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 19 }">
															<a-upload
																	v-if="rule.redrule_type == 2 && redpacket_status == 1"
																	action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
																	:showUploadList="false"
																	:beforeUpload="beforeUpload"
															>
																<div v-show="!rule2.rule_pic_url">
																	<a-button>
																		<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
																		上传封面
																	</a-button>
																</div>
																<img v-show="rule2.rule_pic_url"
																     style="max-width: 128px; max-height: 128px;"
																     :src="commonUrl + rule2.rule_pic_url"/>
																<div style="display: inline-block;vertical-align: bottom;margin-left: 5px;"
																     v-show="rule2.rule_pic_url">
																	<a-button>
																		<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
																		替换
																	</a-button>
																</div>
															</a-upload>
															<div style="margin-top: 10px;">
																图片像素建议为200px*200px，格式为jpg、bmp、png，大小不超过2M
															</div>
															<img v-if="rule1.rule_pic_url && (rule.redrule_type == 1 || redpacket_status != 1)"
															     style="max-width: 128px; max-height: 128px;"
															     :src="commonUrl + rule1.rule_pic_url"/>
														</a-form-item>
														<a-form-item class="current0" :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 19 }">
													<span slot="label">
														<span style="color: #FF562D;">*</span>标题
													</span>
															<a-input
																	v-if="rule.redrule_type == 2 && redpacket_status == 1"
																	style="width: 340px;"
																	placeholder="请填写标题" :maxLength="32"
																	v-model="rule2.rule_title">
														<span slot="suffix">
									                        <span>{{rule2.rule_title.length}}</span>/32
														</span>
															</a-input>
															<span v-if="rule.redrule_type == 1 || redpacket_status != 1">{{rule1.rule_title}}</span>
														</a-form-item>
														<a-form-item label="添加描述" class="current0"
														             :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 19 }">
															<div>
																<a-textarea v-if="rule.redrule_type == 2"
																            style="max-width: 500px;"
																            placeholder="请填写描述"
																            v-model="rule2.rule_des"
																            :maxLength="128" :rows="4"/>
															</div>
															<div style="max-width: 500px; text-align: right"
															     v-if="rule.redrule_type == 2 && redpacket_status == 1">
																<span>{{rule2.rule_des.length}}</span>/128
															</div>
															<span v-if="rule.redrule_type == 1 || redpacket_status != 1">{{rule1.rule_des}}</span>
														</a-form-item>
														<a-form-item class="current0" label="感谢语"
														             :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 19 }">
															<a-input
																	v-if="rule.redrule_type == 2 && redpacket_status == 1"
																	style="width: 340px;"
																	placeholder="恭喜发财，大吉大利" :maxLength="32"
																	v-model="rule2.rule_thanking">
														<span slot="suffix">
									                        <span>{{rule2.rule_thanking.length}}</span>/32
														</span>
															</a-input>
															<span v-if="rule.redrule_type == 1 || redpacket_status != 1">{{rule1.rule_thanking || '恭喜发财，大吉大利'}}</span>
														</a-form-item>
													</a-form>
												</div>
												<a-form-item v-if="rule.redrule_type == 2 && redpacket_status == 1"
												             label="是否存入红包规则"
												             style="margin-top: 10px;"
												             :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 21 }">
													<a-switch :disabled="redpacket_status != 1"
													          :checked="rule.rule_save == 1"
													          @click="changeRuleSave"></a-switch>
												</a-form-item>
												<a-form-item v-if="validity == 1" label="预计投放金额"
												             :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 21 }">
													<span style="color: #FF562D" v-if="typeof urlId != 'undefined'">
														{{rule.redpacket_amount}}
													</span>
													<span style="color: #FF562D" v-if="typeof urlId == 'undefined'">
														{{
														rule.redrule_type == 1 ?
															(rule1.rule_type == 1 ?
																(rule1.rule_fixed_amount != '' ? (rule1.rule_fixed_amount * 100 * personsNum / 100.00) : '--')
															:
																(rule1.rule_max_random_amount != '' ? (rule1.rule_max_random_amount * 100 * personsNum / 100.00) : '--')
															)
														:
															(rule2.rule_type == 1 ?
																(rule2.rule_fixed_amount != '' ? rule2.rule_fixed_amount* 100 * personsNum / 100.00 : '--')
															:
																(rule2.rule_max_random_amount != '' ? rule2.rule_max_random_amount* 100 * personsNum / 100.00 : '--')
															)
														}}
													</span>
													<!--													<a-input-number :step="0" :precision="2"-->
													<!--													                style="width: 140px;margin: 0 5px;"-->
													<!--													                :min="0.30" :max="100000.00"-->
													<!--													                v-model="rule.redpacket_amount"/>-->
													元
													<!--													<p>最多领取人数可达{{rule.redrule_type == 1 ? (rule1.rule_type == 1 ?-->
													<!--														Math.floor(rule.redpacket_amount / rule1.rule_fixed_amount) :-->
													<!--														Math.floor(rule.redpacket_amount /-->
													<!--														rule1.rule_min_random_amount)) :-->
													<!--														(rule2.rule_type == 1 ? Math.floor(rule.redpacket_amount /-->
													<!--														rule2.rule_fixed_amount) : Math.floor(rule.redpacket_amount /-->
													<!--														rule2.rule_fixed_amount))}}人</p>-->
												</a-form-item>
												<a-form-item v-if="validity == 3" label="每个群投放额度"
												             :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 21 }">
													<a-input-number :step="0" :precision="2"
													                style="width: 140px;margin: 0 5px;"
													                :min="0.30" :max="100000.00"
													                v-model="rule.redpacket_amount"/>
													元（精确到小数点后两位，可输入0.30~100000.00。）
													<p>
														本次群发预计总投放额度{{!rule.redpacket_amount?'--':rule.redpacket_amount*100*chatNum/100.00}}元</p>
												</a-form-item>
											</template>
										</a-form-item>
										<!-- 内容 -->
										<a-form-item v-show="validity == 2" label="群发内容" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<div>
												<a-radio-group @change="changeType" v-model="typeValue">
													<a-radio :value="5">图文</a-radio>
													<a-radio :value="2">图片</a-radio>
													<a-radio :value="1">文字</a-radio>
													<a-radio :value="3">语音</a-radio>
													<a-radio :value="4">视频</a-radio>
													<!--													<a-radio :value="6">小程序</a-radio>-->
													<a-radio :value="7">文件</a-radio>
												</a-radio-group>
											</div>
											<!--											<div v-show="typeValue != 6" style="margin-left: -84px;">-->
											<!--												<label style="color: rgba(0, 0, 0, 0.85);">选择应用：</label>-->
											<!--												<a-select-->
											<!--														v-if="typeValue"-->
											<!--														showSearch-->
											<!--														optionFilterProp="children"-->
											<!--														style="width: 200px;margin: 0 0 15px 14px;"-->
											<!--														v-model="appId">-->
											<!--													<template v-for="item in otherAppList">-->
											<!--														<a-select-option :value="item.id">{{item.name}}-->
											<!--														</a-select-option>-->
											<!--													</template>-->
											<!--												</a-select>-->
											<!--											</div>-->
											<!--											<div v-show="typeValue == 6" style="margin-left: -84px;">-->
											<!--												<label style="color: rgba(0, 0, 0, 0.85);">选择应用：</label>-->
											<!--												<a-select-->
											<!--														v-if="typeValue"-->
											<!--														showSearch-->
											<!--														optionFilterProp="children"-->
											<!--														style="width: 200px;margin: 0 0 0 14px;"-->
											<!--														v-model="appId">-->
											<!--													<template v-for="item in appletAppList">-->
											<!--														<a-select-option :value="item.id">{{item.name}}-->
											<!--														</a-select-option>-->
											<!--													</template>-->
											<!--												</a-select>-->
											<!--												<div style="margin: 0 0 10px 84px;color: #f56c6c;">对企业内部成员发送应用消息，请先将小程序关联到企业微信-创建小程序应用-选择应用-发送企业成员。<a-->
											<!--														href="https://support.qq.com/products/104790/faqs/61672" target="_blank">使用教程</a></div>-->
											<!--											</div>-->
											<div class="pull-right fl">
												<div class="changeType"
												     v-show="typeValue == 2 || typeValue == 3 || typeValue == 4 || typeValue == 7">
													<div
															style="width: 125px;height: 110px;margin: auto;cursor: pointer;"
															@click="openShowModal3(0,material_id)"
													>
														<!-- 选择前显示的 -->
														<div v-show="closeShowModal2==false"
														     style="line-height: 120px;">
															<a-icon type="plus" style="font-size: 26px;"/>
															<span v-if="typeValue == 2">选择图片消息</span>
															<span v-if="typeValue == 3">选择语音消息</span>
															<span v-if="typeValue == 4">选择视频消息</span>
															<span v-if="typeValue == 7">选择文件消息</span>
														</div>
														<!-- 选择后显示的 -->
														<div v-show="closeShowModal2" style="width: 220px;">
															<img src="../../../assets/circle.png" alt/>
															<i v-if="typeValue == 2"
															   style="font-style:normal !important;">
																已选择1条图片消息
																<p class="editMessage">[修改]</p>
															</i>
															<i v-if="typeValue == 3"
															   style="font-style:normal !important;">
																已选择1条语音消息
																<p class="editMessage">[修改]</p>
															</i>
															<i v-if="typeValue == 4"
															   style="font-style:normal !important;">
																已选择1条视频消息
																<p class="editMessage">[修改]</p>
															</i>
															<i v-if="typeValue == 7"
															   style="font-style:normal !important;">
																已选择1条文件消息
																<p class="editMessage">[修改]</p>
															</i>
														</div>
													</div>
												</div>
												<div v-show="typeValue == 5">
													<!-- 图片封面 -->
													<!-- 选中前 -->
													<a-form-item label="添加方式" :label-col="{ span: 5 }"
													             :wrapper-col="{ span: 19 }">
														<a-radio-group name="radioGroup" @change="changeSketchAddType()"
														               v-model="sketchAddType">
															<a-radio :value="1">新建</a-radio>
															<a-radio :value="0">导入</a-radio>
														</a-radio-group>
													</a-form-item>
													<template v-if="sketchAddType == 1">
														<!-- 点击跳转 -->
														<a-form-item :label-col="{ span: 5 }"
														             :wrapper-col="{ span: 19 }">
															<template slot="label"><span
																	style="color: red">*</span>图文链接
															</template>
															<a-input
																	placeholder="请输入图文链接，且必须以http://或https://开头"
																	style="margin-bottom: 10px;"
																	v-model="url" allow-clear @change="inputChange1()">
															</a-input>
															<div v-if="msgUrl != ''"
															     class="content_input">
																<div style="flex-grow: 1;height: 100px;">
																	<div class="input_text1">{{inputTitle}}</div>
																	<div class="input_text2">
																		{{digest}}
																	</div>
																</div>
																<div style="width: 100px;height: 100px;padding: 10px">
																	<img v-if="msgUrl != ''" class="input_img"
																	     :src="commonUrl + msgUrl" alt=""/>
																	<img v-if="msgUrl == ''" class="input_img"
																	     src="../../../assets/url.png" alt=""/>
																</div>
															</div>
														</a-form-item>
														<a-form-item v-if="url !=''" label="高级设置"
														             :label-col="{ span:5 }"
														             :wrapper-col="{ span: 19 }">
															<a-switch
																	v-model="setIsShow"/>
														</a-form-item>
														<template v-if="setIsShow">
															<!-- 填写标题 -->
															<a-form-item :label-col="{ span: 5 }"
															             :wrapper-col="{ span: 19 }">
																<template slot="label"><span
																		style="color: red">*</span>填写标题
																</template>
																<a-input v-model="inputTitle"
																         :maxLength="32">
																		<span slot="suffix">
		                    <span>{{inputTitle.length}}</span>/32
		                  </span>
																</a-input>
															</a-form-item>
															<!-- 添加描述 -->
															<a-form-item label="添加描述" :label-col="{ span: 5 }"
															             :wrapper-col="{ span: 19 }">
																<a-textarea placeholder="填写图文描述" :rows="4"
																            style="resize: none;"
																            v-model="digest"
																            :maxLength="128"/>
																<div style="float:right;">
																	<span>{{digest.length}}</span>/128
																</div>
															</a-form-item>
															<a-form-item :label-col="{ span: 5 }"
															             :wrapper-col="{ span: 19 }"
															             v-show="closeShowModal3==false">
																<template slot="label"><span
																		style="color: red">*</span>图片封面
																</template>
																<div class="upload-wrap"
																     @click="choosePic(2)">
																	<a-icon type="plus" class="upload-plus"/>
																</div>
															</a-form-item>
															<!-- 选中后 -->
															<a-form-item :label-col="{ span: 5 }"
															             :wrapper-col="{ span: 19 }"
															             v-show="closeShowModal3">
																<template slot="label"><span
																		style="color: red">*</span>图片封面
																</template>
																<div class="upload-wrap">
																	<img :src="commonUrl+msgUrl" alt=""
																	     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
																</div>
																<span
																		style="color: blue;cursor: pointer;margin: 67px 0 0px 10px;float: left;"
																		@click="choosePic(2)">重新上传</span>
															</a-form-item>
														</template>
														<a-form-item label="素材同步" :label-col="{ span: 5 }"
														             :wrapper-col="{ span: 19 }">
															<a-radio-group
																	v-model="materialSync"
																	@change="changeMaterialSync()"
																	:disabled="disabledSync == 1 ? true : false">
																<a-radio :value="0">不同步</a-radio>
																<a-radio :value="1"
																         :style="{ 'display': materialSync == 1 ? 'block' : '' }">
																	同步至【内容引擎】
																	<div v-show="materialSync == 1"
																	     style="margin-top: 10px;">
																		选择分组：
																		<a-tree-select
																				style="width: 225px"
																				:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
																				:treeData="groupList"
																				placeholder='Please select'
																				treeDefaultExpandAll
																				v-model="selectGroupId"
																		>
																		</a-tree-select>
																	</div>
																</a-radio>
															</a-radio-group>
														</a-form-item>
													</template>
													<template v-if="sketchAddType == 0">
														<!-- 选中前 -->
														<a-form-item :label-col="{ span: 5 }"
														             :wrapper-col="{ span: 19 }"
														             v-show="material_id1 == ''">
															<template slot="label"><span
																	style="color: red">*</span>图文
															</template>
															<div class="upload-border" style="line-height: 120px"
															     @click="openShowModal()">
																<a-icon type="plus" class="upload-plus"
																        style="font-size: 26px;"/>
																<span style="margin-top: -5px;">选择图文</span>
															</div>
														</a-form-item>
														<!-- 选中后 -->
														<a-form-item :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }"
														             v-show="material_id1">
															<template slot="label"><span
																	style="color: red">*</span>图文
															</template>
															<div class="upload-border"
															     @click="openShowModal()">
																<img src="../../../assets/circle.png" alt/>
																已选择1条图文
																<p style="color: blue;margin: 14px;"
																   @click="openShowModal()">
																	[修改]</p>
															</div>
														</a-form-item>
													</template>
												</div>
												<div v-show="typeValue == 1">
													<a-textarea
															v-model="text" placeholder="最多1000个字" :maxLength="1000"
															:autoSize="{ minRows: 9, maxRows: 9 }"
													/>
													<div style="float: right;margin-top: 10px;">
														{{text.length}}/1000
													</div>
												</div>
												<div v-show="typeValue == 6">
													<a-form-item label="添加方式" :label-col="{ span: 5 }"
													             :wrapper-col="{ span: 19 }">
														<a-radio-group name="radioGroup"
														               @change="changeMiniproAddType()"
														               v-model="miniproAddType">
															<a-radio :value="1">新建</a-radio>
															<a-radio :value="0">导入</a-radio>
														</a-radio-group>
													</a-form-item>
													<template v-if="miniproAddType == 1">
														<!-- 图片封面 -->
														<!-- 选中前 -->
														<a-form-item :label-col="{ span: 5 }"
														             :wrapper-col="{ span: 19 }"
														             v-show="closeModalApplet==false">
															<template slot="label"><span
																	style="color: red">*</span>图片封面
															</template>
															<div class="upload-wrap"
															     @click="choosePic(0)">
																<a-icon type="plus" class="upload-plus"/>
															</div>
															<span style="line-height: 19px;display: inline-block;width: 280px;margin-left: 10px;margin-top: 59px;">
																（上传图片不超过1M，尺寸必须为1080*864像素，支持jpg/jpeg/png格式）
															</span>
														</a-form-item>
														<!-- 选中后 -->
														<a-form-item :label-col="{ span: 5 }"
														             :wrapper-col="{ span: 19 }"
														             v-show="closeModalApplet">
															<template slot="label"><span
																	style="color: red">*</span>图片封面
															</template>
															<div class="upload-wrap">
																<img :src="commonUrl+appletUrl" alt=""
																     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
															</div>
															<span
																	style="color: blue;cursor: pointer;margin: 67px 0 0px 10px;float: left;"
																	@click="choosePic(0)">重新上传</span>
														</a-form-item>
														<!-- 填写标题 -->
														<a-form-item :label-col="{ span: 5 }"
														             :wrapper-col="{ span: 19 }">
															<template slot="label"><span
																	style="color: red">*</span>填写标题
															</template>
															<a-input v-model="appletInputTitle"
															         :maxLength="16">
																	<span slot="suffix">
	                    <span>{{appletInputTitle.length}}</span>/16
	                  </span>
															</a-input>
														</a-form-item>
														<!-- appid -->
														<a-form-item :label-col="{ span: 5 }"
														             :wrapper-col="{ span: 19 }">
															<template slot="label"><span
																	style="color: red">*</span>AppID
															</template>
															<a-input v-model="appid"
															         placeholder="请填写小程序AppID，必须是关联到企业的小程序应用"/>
														</a-form-item>
														<!-- page路径 -->
														<a-form-item :label-col="{ span: 5 }"
														             :wrapper-col="{ span: 19 }">
															<template slot="label"><span
																	style="color: red">*</span>page路径
															</template>
															<a-input style="margin-bottom: 10px;"
															         v-model="pageUrl"
															         placeholder="请填写小程序路径，例如：pages/index">
															</a-input>
														</a-form-item>
														<a-form-item label="素材同步" :label-col="{ span: 5 }"
														             :wrapper-col="{ span: 19 }">
															<a-radio-group
																	v-model="materialSync" @change="changeMaterialSync"
																	:disabled="disabledSync == 1 ? true : false">
																<a-radio :value="0">不同步</a-radio>
																<a-radio :value="1"
																         :style="{ 'display': materialSync == 1 ? 'block' : '' }">
																	同步至【内容引擎】
																	<div v-show="materialSync == 1"
																	     style="margin-top: 10px;">
																		选择分组：
																		<a-tree-select
																				style="width: 225px"
																				:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
																				:treeData="groupList"
																				placeholder='Please select'
																				treeDefaultExpandAll
																				v-model="selectGroupId"
																		>
																		</a-tree-select>
																	</div>
																</a-radio>
															</a-radio-group>
														</a-form-item>
													</template>
													<template v-if="miniproAddType == 0">
														<!-- 选中前 -->
														<a-form-item :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }"
														             v-show="material_id3 == ''">
															<template slot="label"><span
																	style="color: red">*</span>小程序
															</template>
															<div class="upload-border"
															     @click="openShowModalMinipro()">
																<a-icon type="plus" class="upload-plus"
																        style="font-size: 26px;"/>
																<span style="margin-top: -5px;">选择小程序</span>
															</div>
														</a-form-item>
														<!-- 选中后 -->
														<a-form-item :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }"
														             v-show="material_id3">
															<template slot="label"><span
																	style="color: red">*</span>小程序
															</template>
															<div class="upload-border"
															     @click="openShowModalMinipro()">
																<img src="../../../assets/circle.png" alt/>
																已选择1条小程序
																<p style="color: blue;margin: 14px;"
																   @click="openShowModalMinipro()">
																	[修改]</p>
															</div>
														</a-form-item>
													</template>
												</div>
											</div>
										</a-form-item>
										<a-form-item label="是否间隔发放" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }" v-if="validity == 1">
											<a-radio-group name="radioGroup" v-model="interval"
											               @change="changeInterval">
												<a-radio :value="1">否</a-radio>
												<a-radio :value="2">是</a-radio>
											</a-radio-group>
											<div style="background: #FFF;border: 1px solid #D8D8D8;padding: 24px;margin-right: 20px;"
											     v-if="interval == 2">
												<div>
													<span style="width: 155px;color: rgba(0, 0, 0, 0.85);text-align: right;display: inline-block;">时长间隔：</span>
													<a-select v-model="interval_time" showSearch
													          optionFilterProp="children"
													          style="width: 150px">
														<a-select-option :value="1">30分钟</a-select-option>
														<a-select-option :value="2">1小时</a-select-option>
														<a-select-option :value="3">2小时</a-select-option>
														<a-select-option :value="4">3小时</a-select-option>
														<a-select-option :value="5">4小时</a-select-option>
													</a-select>
												</div>
												<div>
													<span style="width: 155px;color: rgba(0, 0, 0, 0.85);text-align: right;display: inline-block;">每位成员客户分批推送：</span>
													<a-input-number :min="1" :max="99999999" v-model="interval_num"
													                style="width: 150px;"/>
													人
												</div>
											</div>
										</a-form-item>
										<a-form-item label="群发时间" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-radio-group name="radioGroup" v-model="sendType"
											               :disabled="typeof urlId=='undefined'?false:true">
												<a-radio :value="0">立即发送</a-radio>
												<a-radio :value="1">指定时间</a-radio>
												<a-date-picker v-show="sendType == 1" @change="changeDate"
												               v-model="sendDate"
												               :allowClear="false" format="YYYY-MM-DD"/>
												<a-time-picker v-show="sendType == 1" style="margin-left: 10px;"
												               v-model="sendTime" @change="changeTime"
												               :allowClear="false" format="HH:mm"/>
											</a-radio-group>
										</a-form-item>
										<a-form-item>
											<div style="margin-top: 2px;margin-left: 12.5%;">
												<a-button type="primary" @click="createMessage"
												          :disabled="createDisabled">通知员工发送
												</a-button>
												需要员工确认发送，确认后，才会将群发内容推送给员工对应的客户
											</div>
										</a-form-item>
									</a-form>
								</div>
							</div>
							<!-- 企业微信选择弹窗 -->
							<WeChatModal :show="showModal2" :callback="modalVisibleChange"
							             hasName="group-sending-add"></WeChatModal>
							<!-- 选择素材弹窗 -->
							<chooseMsg :show="showModal3" :showRadar="false" :type="typeValue2" :news_type="news_type"
							           :callback="modalVisibleChange2" :chooseId="chooseId"
							           :comefrom="comefrom"></chooseMsg>
							<!-- 网址 -->
							<a-modal :visible="showModalUrl" title="图文" @ok="handleUrl" @cancel="handleCancelUrl"
							         width="720px" :confirmLoading="confirmLoading">
								<!-- 图片封面 -->
								<!-- 选中前 -->
								<a-form-item :label-col="{ span: 3 }"
								             :wrapper-col="{ span: 21 }">
									<template slot="label">
										添加方式
									</template>
									<a-radio-group name="radioGroup" @change="changeSketchAddType()"
									               v-model="sketchAddType">
										<a-radio :value="1">新建</a-radio>
										<a-radio :value="0">导入</a-radio>
									</a-radio-group>
								</a-form-item>
								<template v-if="sketchAddType == 1">
									<!-- 点击跳转 -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }">
										<template slot="label"><span
												style="color: red">*</span>图文链接
										</template>
										<a-input
												placeholder="请输入图文链接，且必须以http://或https://开头"
												style="margin-bottom: 10px;"
												v-model="url1" allow-clear @change="inputChange()">
										</a-input>
										<div v-if="msgUrl1 != ''"
										     class="content_input">
											<div style="flex-grow: 1;height: 100px;">
												<div class="input_text1">{{inputTitle1}}</div>
												<div class="input_text2">
													{{digest1}}
												</div>
											</div>
											<div style="width: 100px;height: 100px;padding: 10px">
												<img v-if="msgUrl1 != ''" class="input_img"
												     :src="commonUrl + msgUrl1" alt=""/>
												<img v-if="msgUrl1 == ''" class="input_img"
												     src="../../../assets/url.png" alt=""/>
											</div>
										</div>
									</a-form-item>
									<a-form-item v-if="url1 !=''" label="高级设置"
									             :label-col="{ span:3 }"
									             :wrapper-col="{ span: 21 }">
										<a-switch
												v-model="setIsShow"/>
									</a-form-item>
									<template v-if="setIsShow">
										<!-- 填写标题 -->
										<a-form-item :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template slot="label"><span
													style="color: red">*</span>填写标题
											</template>
											<a-input v-model="inputTitle1"
											         :maxLength="32">
																		<span slot="suffix">
		                    <span>{{inputTitle1.length}}</span>/32
		                  </span>
											</a-input>
										</a-form-item>
										<!-- 添加描述 -->
										<a-form-item label="添加描述" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-textarea placeholder="填写图文描述" :rows="4"
											            style="resize: none;"
											            v-model="digest1"
											            :maxLength="128"/>
											<div style="float:right;">
												<span>{{digest1.length}}</span>/128
											</div>
										</a-form-item>
										<a-form-item :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }"
										             v-show="closeShowModal3==false">
											<template slot="label"><span
													style="color: red">*</span>图片封面
											</template>
											<div class="upload-wrap"
											     @click="choosePic(2)">
												<a-icon type="plus" class="upload-plus"/>
											</div>
										</a-form-item>
										<!-- 选中后 -->
										<a-form-item :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }"
										             v-show="closeShowModal3">
											<template slot="label"><span
													style="color: red">*</span>图片封面
											</template>
											<div class="upload-wrap">
												<img :src="commonUrl+msgUrl1" alt=""
												     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
											</div>
											<span
													style="color: blue;cursor: pointer;margin: 67px 0 0px 10px;float: left;"
													@click="choosePic(2)">重新上传</span>
										</a-form-item>
									</template>
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }">
										<template slot="label">
											素材同步
										</template>
										<a-radio-group
												v-model="materialSync1" @change="changeMaterialSync()"
												:disabled="disabledSync1 == 1 ? true : false">
											<a-radio :value="0">不同步</a-radio>
											<a-radio :value="1"
											         :style="{ 'display': materialSync1 == 1 ? 'block' : '' }">
												同步至【内容引擎】
												<div v-show="materialSync1 == 1"
												     style="margin-top: 10px;">
													选择分组：
													<a-tree-select
															style="width: 225px"
															:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='Please select'
															treeDefaultExpandAll
															v-model="selectGroupId1"
													>
													</a-tree-select>
												</div>
											</a-radio>
										</a-radio-group>
									</a-form-item>
								</template>
								<template v-if="sketchAddType == 0">
									<!-- 选中前 -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }"
									             v-show="material_id11 == ''">
										<template slot="label"><span
												style="color: red">*</span>图文
										</template>
										<div class="upload-border"
										     @click="openShowModal1()">
											<a-icon type="plus" class="upload-plus"/>
											<span>选择图文</span>
										</div>
									</a-form-item>
									<!-- 选中后 -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }"
									             v-show="material_id11">
										<template slot="label"><span
												style="color: red">*</span>图文
										</template>
										<div class="upload-border"
										     @click="openShowModal1()">
											<img src="../../../assets/circle.png" alt/>
											已选择1条图文
											<p style="color: blue;margin: 14px;"
											   @click="openShowModal1()">
												[修改]</p>
										</div>
									</a-form-item>
								</template>
							</a-modal>
							<!-- 小程序 -->
							<a-modal :visible="showModalApplet" title="小程序" @ok="handleApplet"
							         @cancel="handleCancelApplet"
							         width="720px" :confirmLoading="confirmLoading">
								<a-form-item label="添加方式" :label-col="{ span: 3 }"
								             :wrapper-col="{ span: 21 }">
									<template slot="label">
										添加方式
									</template>
									<a-radio-group name="radioGroup" @change="changeMiniproAddType()"
									               v-model="miniproAddType">
										<a-radio :value="1">新建</a-radio>
										<a-radio :value="0">导入</a-radio>
									</a-radio-group>
								</a-form-item>
								<template v-if="miniproAddType == 1">
									<div class="content-msg">
										<p style="margin-bottom: 2px;line-height: 20px;">
											在企业微信里发送小程序（必须在微信公众平台通过审核和发布的），请先将其关联到企业微信
											（
											<a target="_blank" href="https://shimo.im/docs/p8TjkTVgkvJH9r3c/">
												如何关联</a>
											）
											，再到本系统添加该小程序，否则发送失败，客户接收不到。
										</p>
										<p style="margin-bottom: 2px;line-height: 20px;">
											如果没有微信小程序，请前往微信小程序进行注册。
											<a target="_blank" href="https://mp.weixin.qq.com/cgi-bin/wx">
												立即前往
											</a>
										</p>
										<p style="margin-bottom: 0px;color: #FF562D;">
											小程序路径必须以“.html”结尾。
										</p>
									</div>
									<!-- 图片封面 -->
									<!-- 选中前 -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }"
									             v-show="closeModalApplet==false">
										<template slot="label"><span
												style="color: red">*</span>图片封面
										</template>
										<div class="upload-wrap" style="display: inline-block"
										     @click="choosePic(3)">
											<a-icon type="plus" class="upload-plus"/>
										</div>
										<span style="display: inline-block;margin-top: 64px;">（上传图片不超过1M，尺寸必须为1080*864像素，支持jpg/jpeg/png格式）</span>
									</a-form-item>
									<!-- 选中后 -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }"
									             v-show="closeModalApplet">
										<template slot="label"><span
												style="color: red">*</span>图片封面
										</template>
										<div class="upload-wrap">
											<img :src="commonUrl+appletUrl1" alt=""
											     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
										</div>
										<span
												style="color: blue;cursor: pointer;margin: 67px 0 0px 10px;float: left;"
												@click="choosePic(3)">重新上传</span>
									</a-form-item>
									<!-- 填写标题 -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }">
										<template slot="label"><span
												style="color: red">*</span>填写标题
										</template>
										<a-input v-model="appletInputTitle1"
										         :maxLength="12" placeholder="请填写小程序标题（4-12个字符）"
										         @blur="checkout(appletInputTitle1)">
																	<span slot="suffix">
	                    <span>{{appletInputTitle1.length}}</span>/12
	                  </span>
										</a-input>
									</a-form-item>
									<!-- appid -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }">
										<template slot="label"><span
												style="color: red">*</span>AppID
										</template>
										<a-input v-model="appid1" placeholder="请填写小程序AppID，必须是关联到企业的小程序应用"/>
									</a-form-item>
									<!-- page路径 -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }">
										<template slot="label"><span
												style="color: red">*</span>page路径
										</template>
										<a-input style="margin-bottom: 10px;"
										         v-model="pageUrl1" placeholder="必须以“.html”结尾，例如：pages/index.html">
										</a-input>
									</a-form-item>
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }">
										<template slot="label">
											素材同步
										</template>
										<a-radio-group
												v-model="materialSync1" @change="changeMaterialSync"
												:disabled="disabledSync1 == 1 ? true : false">
											<a-radio :value="0">不同步</a-radio>
											<a-radio :value="1"
											         :style="{ 'display': materialSync1 == 1 ? 'block' : '' }">
												同步至【内容引擎】
												<div v-show="materialSync1 == 1"
												     style="margin-top: 10px;">
													选择分组：
													<a-tree-select
															style="width: 225px"
															:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='Please select'
															treeDefaultExpandAll
															v-model="selectGroupId1"
													>
													</a-tree-select>
												</div>
											</a-radio>
										</a-radio-group>
									</a-form-item>
								</template>
								<template v-if="miniproAddType == 0">
									<!-- 选中前 -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }"
									             v-show="material_id31 == ''">
										<template slot="label"><span
												style="color: red">*</span>小程序
										</template>
										<div class="upload-border"
										     @click="openShowModalMinipro1()">
											<a-icon type="plus" class="upload-plus"/>
											<span>选择小程序</span>
										</div>
									</a-form-item>
									<!-- 选中后 -->
									<a-form-item :label-col="{ span: 3 }"
									             :wrapper-col="{ span: 21 }"
									             v-show="material_id31">
										<template slot="label"><span
												style="color: red">*</span>小程序
										</template>
										<div class="upload-border"
										     @click="openShowModalMinipro1()">
											<img src="../../../assets/circle.png" alt/>
											已选择1条小程序
											<p style="color: blue;margin: 14px;"
											   @click="openShowModalMinipro1()">
												[修改]</p>
										</div>
									</a-form-item>
								</template>
							</a-modal>
							<chooseMinipro :show="showModalMinipro" :type="typeValue2"
							               :callback="modalVisibleChange2" :chooseId="chooseId"></chooseMinipro>
							<!--部门选择框-->
							<chooseDepartment ref="user" :noticeTitle="noticeTitle"
							                  :is_from='from_chat' :is_special="1"
							                  :is_external="is_external"
							                  :show="showModalDepartment"
							                  :chooseNum="chooseNum1" :departmentDisabled="1"
							                  :callback="modalVisibleChange3"></chooseDepartment>

							<!-- 小程序封面图片裁剪 -->
							<cropperModal ref="cropper" @ok="uploadAppletPic" @cancel="cancleAppletPic"></cropperModal>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import WeChatModal from "@/components/WeChatModal.vue"
	import chooseMsg from "../../../components/ChooseMsg"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import MyIcon from "@/components/MyIcon.vue"
	import chooseMinipro from '@/components/FilingCabinet/Miniprogram.vue'
	import {videoPlayer} from "vue-video-player"
	import moment from 'moment'
	import cropperModal from '../../../components/picCropper/CropperModal'
	import cityData from "../../../common/js/citydata.js";
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import chooseRule from "../../../components/redRule/chooseRule";

	export default {
		components: {
			WeChatModal,
			chooseMsg,
			chooseDepartment,
			MyIcon,
			chooseMinipro,
			videoPlayer,
			cropperModal,
			corpChooseTag,
			chooseRule
		},
		data () {
      return {
        customItem          : '',//客户看板过来的信息
        //左侧
        text                : '',//文本
        material_id         : '',//选中的图片素材id
        img                 : '',//选中的图片素材url
        fileName            : '',//选中的图片素材的名字
        commonUrl           : this.$store.state.commonUrl, //公共的链接
        isLoading           : false, //Loading 组件显示与隐藏
        urlId               : '',//编辑时，地址栏的id
        corpInfo            : [], //企业列表
        suite_id            : 1,//应用ID
        corpId              : '',//企业微信选中的id
        corpName            : '',//企业微信选中的名字
        title               : '', // 消息名称
        appList             : [], // 应用列表
        appletAppList       : [], // 小程序应用列表
        otherAppList        : [], // 其他类型应用列表
        appId               : '',   // 企业微信应用id
        showModal2          : false, //公众号组件弹窗显示与隐藏
        validity            : 1,//企业微信成员单选
        isRedpacket         : 0, // 0、群发消息 1、群发红包
        loading             : false,
        redpacket_status    : 1, //
        rule1               : {     // 导入红包规则信息
          rule_type             : 1,
          rule_name             : '',
          rule_fixed_amount     : '0.3',
          rule_min_random_amount: '0.3',
          rule_max_random_amount: '200',
          rule_pic_url          : '/static/image/default-redpacket.png',
          rule_title            : '',
          rule_des              : '',
          rule_thanking         : '',
        },
        rule2               : {      // 新建红包规则信息
          rule_name             : '',
          rule_type             : 1,
          rule_fixed_amount     : 0.3,
          rule_min_random_amount: '',
          rule_max_random_amount: '',
          rule_pic_url          : '/static/image/default-redpacket.png',
          rule_title            : '恭喜发财，大吉大利',
          rule_des              : '戳我领取红包~',
          rule_thanking         : '恭喜发财，大吉大利',
        },
        rule                : {
          redrule_type          : 2,
          rule_id               : 0,
          rule_name             : '',
          rule_type             : 1,
          rule_fixed_amount     : 0.3,
          rule_min_random_amount: '',
          rule_max_random_amount: '',
          rule_pic_url          : '/static/image/default-redpacket.png',
          rule_title            : '恭喜发财，大吉大利',
          rule_des              : '戳我领取红包~',
          rule_thanking         : '恭喜发财，大吉大利',
          rule_save             : 1,
          redpacket_amount      : 6000,
        },
        users               : [],//筛选客户时传的客户的key值
        noBindFlag          : false, // 企业微信是否绑定
        correctness         : 2, // 2筛选客户 1全部客户
        defineField         : [],
        fieldData           : [],
        selectLoading       : false,
        chatNum             : 0, // 符合条件的群数
        personsNum          : 0, // 符合条件人数
        sex                 : -1, // -1全部性别 1男 2女 3未知
        province1           : ["全部"],
        follows             : [],
        province            : '',
        city                : '',
        cityData,
        joinTime            : null, //添加时间
        followTime          : null, // 最后跟进时间
        chatTime            : null,//上次单聊时间
        followNum1          : '',//跟进次数最小值
        followNum2          : '',//跟进次数最大值
        signId              : [],//选择的店铺id
        bindStoreList       : [],//绑定的店铺列表
        //下拉菜单样式
        style               : {width: "195px"},
        is_fans             : 0,
        follow_status       : -1,
        chooseType          : '',
        fromCustom          : 1,//客户归属类型，1全部成员，2选择成员
        checkedList1        : [],
        checkedList3        : [],//确认成员的成员id数组
        // dataRange          : null, // 添加时间
        tag_arr             : [], // 选中标签数组
        isShowTag           : true,
        typeValue           : 2, // 消息类型
        closeShowModal2     : false, // 是否选好素材
        createDisabled      : false,//控制创建欢迎语按钮的禁用
        showModal3          : false,//选择图片弹窗的显示与隐藏
        comefrom            : '',
        typeValue2          : 2,  // 1.图文 2.图片
        material_id1        : '', // 图文附件id
        news_type           : 1,
        chooseId            : 0,//选择的图片id
        showModalUrl        : false,
        sketchAddType       : 1, // 新建或导入
        sketchAddType1      : 1,
        url                 : '',//网址弹窗输入的网址
        closeShowModal3     : false,//网址弹窗封面选没选好
        msgUrl              : '',//网址弹窗封面选好的url
        inputTitle          : '',//网址弹窗输入标题
        digest              : '',//网址弹窗输入描述
        confirmLoading      : false,//网址弹窗确认按钮的Loading
        popVisible          : false,//控制选择图片、网址、小程序的popover的显示与隐藏
        groupId             : [],//分组id
        index               : 0,//判断是图片打开素材弹窗还是链接打开，1是图片，2是链接，3是小程序
        modalUrlOk          : false,//判断网址弹窗关闭时是否成功选择
        showModalApplet     : false,//小程序弹窗的显示与隐藏
        miniproAddType      : 1, // 新建或导入
        miniproAddType1     : 1,
        material_id3        : '', // 小程序附件id
        showModalMinipro    : false, // 导入框
        appletUrl           : '',//小程序的封面链接
        appletInputTitle    : '',//小程序的标题
        appid               : '',//小程序的appid
        pageUrl             : '',//小程序page路径
        closeModalApplet    : false,//小程序弹窗封面选没选好
        modalAppletOk       : false,//判断小程序弹窗关闭时是否成功选择
        showModalDepartment : false, //成员选择框显示与隐藏
        checkedList         : [],//选择的成员id数组
        corpArr             : [],//企业微信数组
        chooseNum           : 0,//已选择的成员数量
        chooseNum1          : 0,
        chooseNum2          : 0,//已选择的客户群数量部门成员总个数
        chooseUserNum2      : 0,//成员个数
        chooseDepartmentNum2: 0,//部门个数
        chooseNum3          : 0,//已选择的确认部门成员总个数
        chooseUserNum3      : 0,//成员个数
        chooseDepartmentNum3: 0,//部门个数
        noticeTitle         : '',//选择部门成员弹窗的提示语
        selectChooseNum     : 0,// 部门成员总个数
        chooseUserNum       : 0,//成员个数
        chooseDepartmentNum : 0,//部门个数
        selectedUser        : [], // 成员弹窗处理需要
        from_chat           : 0,//客户群传给组件的值8，其他都是0
        is_external         : 0,//客户传给组件的值1，其他都是0
        groupList           : [], // 内容引擎分组列表
        selectGroupId       : '', // 同步分组id
        disabledSync        : 0, // 同步按钮点击是否允许
        materialSync        : 0, // 0不同步 1同步
        playerOptions       : {
          playbackRates      : [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay           : false, //如果true,浏览器准备好时开始回放。
          muted              : false, // 默认情况下将会消除任何音频。
          loop               : false, // 导致视频一结束就重新开始。
          preload            : "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language           : "zh-CN",
          aspectRatio        : "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid              : true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar         : {
            timeDivider         : true,
            durationDisplay     : true,
            remainingTimeDisplay: false,
            fullscreenToggle    : true //全屏按钮
          }
        },
        interval            : 1,//是否需要间隔发放，1不需要，2需要
        interval_time       : 1,//时长间隔
        interval_num        : 50,//分批推送人数
        sendType            : 0,
        sendDate            : moment(new Date()),
        sendTime            : moment(new Date()),
        // 客户图文小程序弹窗内容变量
        materialSync1       : 0,
        disabledSync1       : 0,
        material_id0        : '',
        msgUrl1             : '',
        inputTitle1         : '',
        digest1             : '',
        setIsShow           : false,
        timeOut             : 0,
        url1                : '',
        material_id11       : '',
        selectGroupId1      : '',
        appletUrl1          : '',
        appletInputTitle1   : '',
        appid1              : '',
        pageUrl1            : '',
        material_id31       : '',
      }
		},
		methods   : {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/massMessage/list?isRefresh=1")
			},
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			// 修改添加时间
			changeJoinTime (date, dateString) {
				this.joinTime = date
				this.getPersonsNum()
			},
			// 修改最后跟进时间
			changeFollowTime (date, dateString) {
				this.followTime = date
				this.getPersonsNum()
			},
			// 修改上次单聊时间
			changeChatTime (date, dateString) {
				this.chatTime = date
				this.getPersonsNum()
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
					}
				}
				this.getPersonsNum()
			},
			//获取绑定店铺列表
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
			//打开网址弹窗
			chooseUrl (index) {
				this.showModalUrl = true
				this.popVisible = false
				if (this.index !== index) {
					this.msgUrl = ''
					this.inputTitle = ''
					this.digest = ''
					this.url = ''
					this.closeShowModal3 = false
					this.modalUrlOk = false
					this.material_id = ''
					this.material_id1 = ''
					this.selectGroupId = ""
					this.materialSync = 0
					this.disabledSync = 0
				}
				if (this.sketchAddType1 == 1 && this.msgUrl) {
					this.closeShowModal3 = true
				}
				this.msgUrl1 = this.msgUrl
				this.inputTitle1 = this.inputTitle
				this.digest1 = this.digest
				this.url1 = this.url
				this.material_id0 = this.material_id
				this.material_id11 = this.material_id1
				this.sketchAddType = this.sketchAddType1
				this.materialSync1 = this.materialSync
				this.disabledSync1 = this.disabledSync
				this.getGroupList1(this.selectGroupId)
				this.index = index
			},
			// 员工图文选择封面
			openShowModal () {
				if (this.material_id1) {
					this.material_id1 = this.material_id1
					this.chooseId = Number(this.material_id1)
				} else {
					this.chooseId = 0
				}
				this.comefrom = '1'
				this.typeValue2 = 1
				this.showModal3 = true
				this.popVisible = false
				this.showModalUrl = false
			},
			// 员工小程序选择封面
			openShowModalMinipro1 () {
				if (this.material_id31) {
					this.chooseId = Number(this.material_id31)
				} else {
					this.chooseId = 0
				}
				this.typeValue2 = 7
				this.showModalMinipro = true
				this.popVisible = false
				this.showModalApplet = false
			},
			handleUrl () {
				let reg = /^([hH][tT]{2}[pP]:|[hH][tT]{2}[pP][sS]:)((\\|\/)+)/;
				if (this.sketchAddType == 1) {
					if (this.msgUrl1 == '') {
						this.$message.error('请选择图片封面')
						return false;
					} else if (this.inputTitle1 == '') {
						this.$message.error('请填写标题')
						return false;
					} else if (!reg.test(this.url1)) {
						this.$message.error('请检查跳转链接格式是否正确(https://或http://开头)')
						return false;
					}
				} else {
					if (this.material_id11 == '') {
						this.$message.error('请选择图文')
						return false;
					}
				}
				this.sketchAddType1 = this.sketchAddType
				this.msgUrl = this.msgUrl1
				this.inputTitle = this.inputTitle1
				this.digest = this.digest1
				this.url = this.url1
				this.materialSync = this.materialSync1
				this.selectGroupId = this.selectGroupId1
				this.material_id1 = this.material_id11
				this.material_id = this.material_id0
				this.selectGroupId1 = this.selectGroupId
				this.showModalUrl = false
				this.modalUrlOk = true
				this.setIsShow = false
			},
			handleCancelUrl () {
				if (!this.modalUrlOk) {
					this.material_id1 = ''
					this.msgUrl = ''
					this.inputTitle = ''
					this.digest = ''
					this.url = ''
					this.closeShowModal3 = false
					this.index = 0
				}
				this.showModalUrl = false
				this.setIsShow = false
			},
			//打开小程序弹窗
			chooseApplet (index) {
				this.showModalApplet = true
				this.popVisible = false
				if (this.index !== index) {
					this.appletUrl = ''
					this.appletInputTitle = ''
					this.appid = ''
					this.pageUrl = ''
					this.closeModalApplet = false
					this.materialSync = 0
					this.disabledSync = 0
				}
				if (this.miniproAddType1 == 1 && this.appletUrl) {
					this.closeModalApplet = true
				}
				this.appletUrl1 = this.appletUrl
				this.appletInputTitle1 = this.appletInputTitle
				this.appid1 = this.appid
				this.pageUrl1 = this.pageUrl
				this.material_id0 = this.material_id
				this.material_id31 = this.material_id3
				this.miniproAddType = this.miniproAddType1
				this.materialSync1 = this.materialSync
				this.disabledSync1 = this.disabledSync
				this.getGroupList1(this.selectGroupId)
				this.index = index
			},
			checkout (title) {
				if (title.length < 4) {
					this.$message.warning('小程序标题长度需在4-12个字符')
				}
			},
			// 客户小程序弹窗确定
			handleApplet () {
				if (this.miniproAddType == 1) {
					if (this.appletUrl1 == '') {
						this.$message.error('请选择图片封面')
						return false;
					} else if (this.appletInputTitle1 == '') {
						this.$message.error('请填写标题')
						return false;
					} else if (this.appletInputTitle1.length < 4) {
						this.$message.error('小程序标题长度需在4-12个字符')
						return false;
					} else if (this.appid1 == '') {
						this.$message.error('请填写小程序AppID')
						return false;
					} else if (this.pageUrl1 == '') {
						this.$message.error('请填写小程序路径')
						return false;
					}
				} else {
					if (this.material_id31 == '') {
						this.$message.error('请选择小程序')
						return false;
					}
				}
				this.miniproAddType1 = this.miniproAddType
				this.appletUrl = this.appletUrl1
				this.appletInputTitle = this.appletInputTitle1
				this.appid = this.appid1
				this.pageUrl = this.pageUrl1
				this.material_id3 = this.material_id31
				this.material_id = this.material_id0
				this.selectGroupId = this.selectGroupId1
				this.materialSync = this.materialSync1

				this.showModalApplet = false
				this.modalAppletOk = true
			},
			// 客户小程序弹窗取消
			handleCancelApplet () {
				this.showModalApplet = false
				if (!this.modalAppletOk) {
					this.material_id3 = ''
					this.appletUrl = ''
					this.appletInputTitle = ''
					this.appid = ''
					this.pageUrl = ''
					this.closeModalApplet = false
					this.index = 0
				}
			},
			// 员工、客户、客户群切换
			changeValidity () {
				this.users = []
				this.chooseNum = 0
				this.chooseNum2 = 0
				this.chooseNum3 = 0
				this.selectChooseNum = 0
				this.checkedList1 = []
				this.checkedList3 = []
				this.city = ''
				this.province1 = ["全部"]
				this.follow_status = -1
				this.province = ''
				this.typeValue = 2
				this.fromCustom = 1
				let e = {
					target: {
						value: this.typeValue
					}
				}
				if (this.validity == 1) {
					this.sex = -1
					this.tag_ids = ''
					this.tag_arr = []
					this.index = 0
					this.selectLoading = true
					this.from_chat = 0
					this.chooseType = 0
					this.$nextTick(() => {
						this.$refs.user.getDepartmentList()
					})
					this.getPersonsNum()
				}
				this.changeType(e)
				this.checkedList = []
				this.text = ''
				this.deleteMessage()
				this.isRedpacket = 0
				this.resetRedRule()
			},
			resetRedRule () {
				this.rule1 = {
					rule_type             : 1,
					rule_name             : '',
					rule_fixed_amount     : '0.3',
					rule_min_random_amount: '0.3',
					rule_max_random_amount: '200',
					rule_pic_url          : '/static/image/default-redpacket.png',
					rule_title            : '',
					rule_des              : '',
					rule_thanking         : '',
				}
				this.rule2 = {
					rule_name             : '',
					rule_type             : 1,
					rule_fixed_amount     : 0.3,
					rule_min_random_amount: '',
					rule_max_random_amount: '',
					rule_pic_url          : '/static/image/default-redpacket.png',
					rule_title            : '恭喜发财，大吉大利',
					rule_des              : '戳我领取红包~',
					rule_thanking         : '恭喜发财，大吉大利',
				}
				this.rule = {
					redrule_type          : 2,
					rule_id               : 0,
					rule_name             : '',
					rule_type             : 1,
					rule_fixed_amount     : 0.3,
					rule_min_random_amount: '',
					rule_max_random_amount: '',
					rule_pic_url          : '/static/image/default-redpacket.png',
					rule_title            : '恭喜发财，大吉大利',
					rule_des              : '戳我领取红包~',
					rule_thanking         : '恭喜发财，大吉大利',
					rule_save             : 1,
					redpacket_amount      : 6000,
				}
			},
			changeIsRedpacket () {
				this.text = ''
				this.deleteMessage()
				this.resetRedRule()
				if (this.validity == 3) {
					this.getChatNum()
				}
			},
			changeSelect (ruleId) {
				this.rule.rule_id = ruleId
				if (this.rule.rule_id) {
					this.getRuleDetail()
				}
			},
			changeRuleSave () {
				this.rule.rule_save = (this.rule.rule_save + 1) % 2
			},
			async getRuleDetail () {
				const {data: res} = await this.axios.post("red-pack-rule/rule-info", {
					uid: localStorage.getItem('uid'),
					id : this.rule.rule_id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.rule1.rule_name = res.data.name
					this.rule1.rule_type = res.data.type
					this.rule1.rule_fixed_amount = res.data.fixed_amount
					this.rule1.rule_min_random_amount = res.data.min_random_amount
					this.rule1.rule_max_random_amount = res.data.max_random_amount
					this.rule1.rule_pic_url = res.data.pic_url
					this.rule1.rule_title = res.data.title
					this.rule1.rule_des = res.data.des
					this.rule1.rule_thanking = res.data.thanking
				}
			},
			changeType2 (e) {
				this.rule2.rule_type = e.target.value
			},
			// 新建定额红包类型切换
			changeType1 (e) {
				this.rule1.rule_type = e.target.value
			},
			//活动海报
			beforeUpload (file) {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					this.$message.error('海报仅支持jpg、jpeg、png格式！');
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('图片大小不超过2M');
					return false
				}
				this.uploadImage(file)
			},
			// 上传
			async uploadImage (file) {
				this.loading = true
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				param.append("fileInfo", file);
				const {data: res} = await this.axios.post("sub-user/upload-image", param);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.loading = false
				} else {
					this.rule2.rule_pic_url = res.data.local_path
					this.loading = false
				}
			},
			//切换全部成员与选择成员
			changeFromCustom () {
				this.checkedList1 = []
				this.selectChooseNum = 0
				this.checkedList = []
				this.chooseNum2 = 0
				if (this.validity == 3 && this.isRedpacket == 1) {
					this.getChatNum()
				}
				this.getPersonsNum()
			},
			// 条件筛选或全部
			changeCorrectness (value) {
				if (value == 1) {
					this.correctness = 1
				} else if (value == 2) {
					this.correctness = 2
				}
				this.selectLoading = true
				this.getPersonsNum()
			},
			moment,
			//打开上传页面
			openShowModal3 (index, id) {

				if (typeof id == 'undefined') {
					this.chooseId = 0
				} else {
					this.chooseId = Number(id)
				}
				this.comefrom = '1'
				this.showModal3 = true;
				//获取素材接口1为图文，所以要将传给子组件的type值改成1
				if (this.typeValue == 5) {
					this.typeValue2 = 1;
				} else if (this.typeValue == 7) {
					this.typeValue2 = 5;
				} else {
					this.typeValue2 = this.typeValue;
				}
			},
			// 员工选择消息类型
			changeType (e) {
				this.typeValue = e.target.value;
				this.closeShowModal2 = false
				this.text = ''
				this.deleteMessage()
			},
			//素材同步
			changeMaterialSync () {
				if (this.materialSync == 1) {
					this.getGroupList()
				}
			},
			// 客户同步分组列表并分组赋值
			async getGroupList1 (key) {
				const {data: res} = await this.axios.post("attachment/group", {
					uid       : localStorage.getItem('uid'),
					is_channel: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					this.selectGroupId1 = key || this.groupList[0].key
				}
			},
			// 员工获取分组列表并赋值
			async getGroupList (key) {
				const {data: res} = await this.axios.post("attachment/group", {
					uid: localStorage.getItem('uid'),
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					this.selectGroupId = key || this.groupList[0].key
				}
			},
			// 点击企业微信
			changeCorp () {
				if (this.$route.query.id || this.customItem != '') {
					return
				}
				this.showModal2 = true
			},
			//选择图片、选择网址封面
			choosePic (index) {
				if (index == 3 || this.typeValue == 6) {
					this.comefrom = '3'
				} else {
					this.comefrom = '1'
				}
				if (index != 2 && index != 3) {
					this.chooseId = Number(this.material_id || 0)
				} else {
					this.chooseId = Number(this.material_id0)
				}
				this.typeValue2 = 2
				this.showModal3 = true
				this.popVisible = false
				this.showModalApplet = false
				this.index = index
				this.showModalUrl = false
			},
			// 图文新建或导入
			changeSketchAddType () {
				if (this.sketchAddType == 0) {
					this.materialSync = 0
				}
				if (this.validity == 1) {
					this.disabledSync1 = 0
					this.msgUrl1 = ''
					this.inputTitle1 = ''
					this.digest1 = ''
					this.url1 = ''
					this.material_id0 = ''
					this.material_id11 = ''
				} else {
					this.disabledSync = 0
					this.msgUrl = ''
					this.inputTitle = ''
					this.digest = ''
					this.url = ''
					this.material_id = ''
					this.material_id1 = ''
				}

				this.closeShowModal3 = false
				// this.modalUrlOk = false

			},
			inputChange () {
				this.url1 = this.url1.trim()
				this.setIsShow = false
				if (this.url1 == '') {
					this.inputTitle1 = ''
					this.digest1 = ''
					this.msgUrl1 = ''
					this.closeShowModal3 = false
				} else if (this.url1 != '') {
					let that = this
					clearTimeout(that.timeOut)
					that.timeOut = setTimeout(function () {
						that.getUrlInfo()
					}, 1000)
				}
			},
			async getUrlInfo () {
				const {data: res} = await this.axios.post('moment/moments-images-text', {
					corp_id: this.corpId,
					url    : this.url1
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.inputTitle1 = res.data.title
					this.digest1 = res.data.description
					if (res.data.url != '') {
						this.msgUrl1 = res.data.url.replace(this.commonUrl, '')
						this.closeShowModal3 = true
					} else {
						this.closeShowModal3 = false
						this.msgUrl1 = ''
					}
				}
			},
			inputChange1 () {
				this.url = this.url.trim()
				this.setIsShow = false
				if (this.url == '') {
					this.inputTitle = ''
					this.digest = ''
					this.msgUrl = ''
					this.closeShowModal3 = false
				} else if (this.url != '') {
					let that = this
					clearTimeout(that.timeOut)
					that.timeOut = setTimeout(function () {
						that.getUrlInfo1()
					}, 1000)
				}
			},
			async getUrlInfo1 () {
				const {data: res} = await this.axios.post('moment/moments-images-text', {
					corp_id: this.corpId,
					url    : this.url
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.inputTitle = res.data.title
					this.digest = res.data.description
					if (res.data.url != '') {
						this.msgUrl = res.data.url.replace(this.commonUrl, '')
						this.closeShowModal3 = true
					} else {
						this.closeShowModal3 = false
						this.msgUrl = ''
					}
				}
			},
			// 小程序新建或导入
			changeMiniproAddType () {
				if (this.sketchAddType == 0) {
					this.materialSync = 0
				}
				if (this.validity == 1) {
					this.disabledSync1 = 0
					this.appletUrl1 = ''
					this.appletInputTitle1 = ''
					this.appid1 = ''
					this.pageUrl1 = ''
					this.material_id0 = ''
					this.material_id31 = ''
				} else {
					this.disabledSync = 0
					this.appletUrl = ''
					this.appletInputTitle = ''
					this.appid = ''
					this.pageUrl = ''
					this.material_id = ''
					this.material_id3 = ''
				}
				this.closeShowModal3 = false
				this.closeModalApplet = false

			},
			// 客户打开图片封面
			openShowModal1 () {
				if (this.material_id11) {
					this.chooseId = Number(this.material_id11)
				} else {
					this.chooseId = 0
				}
				this.comefrom = '1'
				this.typeValue2 = 1
				this.showModalUrl = false
				this.showModal3 = true
				this.popVisible = false
			},
			// 小程序
			openShowModalMinipro () {
				if (this.material_id3) {
					this.chooseId = Number(this.material_id3)
				} else {
					this.chooseId = 0
				}
				this.typeValue2 = 7
				this.showModalMinipro = true
				this.popVisible = false
			},

			// 选择素材回调
			modalVisibleChange2 (event, e, id, item) {
				if (event == "ok") {
					if (this.index == 3 && this.miniproAddType == 1) {
						this.$refs.cropper.edit(item.local_path, item.file_name)
					} else if (this.typeValue == 6 && this.miniproAddType == 1) {
						this.$refs.cropper.edit(item.local_path, item.file_name)
					} else if (this.index == 3 && this.miniproAddType == 0) {
						this.appletInputTitle1 = item.file_name
						this.appletUrl1 = item.local_path
						this.material_id31 = id
						this.closeModalApplet = true
						this.showModalApplet = true
						this.showModalMinipro = false
					} else if (this.index == 0 && this.typeValue == 6 && this.miniproAddType == 0) {
						this.appletInputTitle = item.file_name
						this.appletUrl = item.local_path
						this.material_id3 = id
						this.closeModalApplet = true
						this.showModalMinipro = false
					} else {
						this.uploadMedia(id)
					}
					this.closeShowModal2 = true
				} else {
					if (this.index == 1) {
						if (!this.img) {
							this.index = 0
						}
					} else if (this.index == 2) {
						this.showModalUrl = true
						// this.closeShowModal3 = false
					} else if (this.index == 3) {
						// this.closeModalApplet = false
						this.showModalApplet = true
					}
					this.showModalMinipro = false
					this.showModal3 = false
				}
			},
			cancleAppletPic () {
				if (this.index == 3 && this.miniproAddType == 1) {
					this.showModalApplet = true
				}
			},
			uploadAppletPic (id, url) {
				this.uploadMedia(id)
			},
			//上传素材，将素材传给企业微信
			async uploadMedia (id) {
				const {data: res} = await this.axios.post("work-material/upload-media", {
					corp_id      : this.corpId,
					suite_id     : this.suite_id,
					attachment_id: id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (isNaN(id) || id == '') {
						this.$message.error('请选择素材')
					} else {
						if (this.index != 0) {
							if (this.index == 1) {
								//图片选择素材
								this.material_id = res.data.id
								this.img = res.data.local_path
								this.fileName = res.data.file_name
							} else if (this.index == 2) {
								if (this.sketchAddType == 0) {
									this.material_id11 = id
									this.msgUrl1 = res.data.artList[0].local_path
									this.url1 = res.data.artList[0].content_source_url
									this.inputTitle1 = res.data.artList[0].title
									this.digest1 = res.data.artList[0].digest
									// this.url = res.data.artList[0].local_path
								} else {
									this.material_id0 = id
									this.msgUrl1 = res.data.local_path
								}
								this.showModalUrl = true
								this.closeShowModal3 = true
							} else if (this.index == 3) {
								this.material_id0 = id
								this.appletUrl1 = res.data.local_path
								this.closeModalApplet = true
								this.showModalApplet = true
							}
						} else {
							if (this.typeValue == 2) {
								//图片选择素材
								this.material_id = res.data.id
								this.img = res.data.local_path
								this.fileName = res.data.file_name
							} else if (this.typeValue == 5) {
								if (this.sketchAddType == 0) {
									this.material_id1 = id
									this.msgUrl = res.data.artList[0].local_path
									this.url = res.data.artList[0].content_source_url
									this.inputTitle = res.data.artList[0].title
									this.digest = res.data.artList[0].digest
									// this.url = res.data.artList[0].local_path
								} else {
									this.material_id = id
									this.msgUrl = res.data.local_path
								}
								this.closeShowModal3 = true
							} else if (this.typeValue == 6) {
								this.material_id = id
								this.appletUrl = res.data.local_path
								this.closeModalApplet = true
								// this.showModalApplet = true
							} else if (this.typeValue == 3 || this.typeValue == 4 || this.typeValue == 7) {
								this.fileName = res.data.file_name
								this.material_id = id
							}
						}
						this.showModalMinipro = false
						this.showModal3 = false
					}
				}
			},
			// 指定日期
			changeDate (date, dateString) {
				this.sendDate = moment(dateString, "YYYY-MM-DD")
			},
			// 指定时间
			changeTime (time, timeString) {
				this.sendTime = moment(timeString, "HH:mm")
			},
			//创建、修改消息
			async createMessage () {
				let user_ids = []
				if (this.title == "") {
					this.$message.warning("请填写名称")
					return false
				}
				if (this.validity == 1 || this.validity == 3) {
					if (this.isRedpacket == 0 && !this.text && !this.img && !this.modalUrlOk && !this.modalAppletOk) {
						this.$message.warning("请填写群发内容")
						return false
					}
					if (this.isRedpacket == 1) {
						if (this.rule.redrule_type == 1) {
							if (!this.rule.rule_id) {
								this.$message.destroy()
								this.$message.warning("请选择红包规则！")
								this.current = 0
								return false
							}
						} else if (this.rule.redrule_type == 2) {
							if (this.rule2.rule_name == '') {
								this.$message.destroy()
								this.$message.warning('请输入红包规则名称')
								return false
							}
							if (this.rule2.rule_type == 1) {
								if (this.fixed_amount == "") {
									this.$message.destroy()
									this.$message.warning('请输入红包金额')
									return false
								}
							}
							if (this.rule2.rule_type == 2) {
								if (this.rule2.rule_min_random_amount == "" || this.rule2.rule_max_random_amount == '') {
									this.$message.destroy()
									this.$message.warning('请输入红包金额')
									return false
								} else if (this.rule2.rule_min_random_amount >= this.rule2.rule_max_random_amount) {
									this.$message.destroy()
									this.$message.warning('随机金额最大值必须大于最小值')
									return false
								}
							}
							if (this.rule2.rule_title.trim() == '') {
								this.$message.destroy()
								this.$message.warning('请填写红包标题')
								return false
							}
						}
					}
				}
				if (this.validity == 1) {
					if (this.isRedpacket == 1 && typeof this.urlId == 'undefined') {
						this.rule.redpacket_amount = this.rule.redrule_type == 1 ?
							(this.rule1.rule_type == 1 ?
									(this.rule1.rule_fixed_amount != '' ? (this.rule1.rule_fixed_amount * 100 * this.personsNum / 100.00) : '--')
									:
									(this.rule1.rule_max_random_amount != '' ? (this.rule1.rule_max_random_amount * 100 * this.personsNum / 100.00) : '--')
							)
							:
							(this.rule2.rule_type == 1 ?
									(this.rule2.rule_fixed_amount != '' ? this.rule2.rule_fixed_amount * 100 * this.personsNum / 100.00 : '--')
									:
									(this.rule2.rule_max_random_amount != '' ? this.rule2.rule_max_random_amount * 100 * this.personsNum / 100.00 : '--')
							)
					}
					//客户
					if (this.fromCustom == 2) {
						if (this.checkedList1.length == 0 || this.selectChooseNum == 0) {
							this.$message.warning("请选择客户归属成员")
							return false
						}
					}
					user_ids = this.checkedList1
				} else if (this.validity == 2) {
					//企业成员
					if (this.chooseNum3 == 0) {
						this.$message.warning("请选择企业成员")
						return false
					}
					if (this.typeValue == 1) {
						if (!this.text) {
							this.$message.warning("请填写群发内容")
							return false
						}
					} else if (this.typeValue == 2 || this.typeValue == 3 || this.typeValue == 4 || this.typeValue == 7) {
						if (!this.closeShowModal2) {
							this.$message.warning("请填写群发内容")
							return false
						}
					} else if (this.typeValue == 5) {
						let reg = /^([hH][tT]{2}[pP]:|[hH][tT]{2}[pP][sS]:)((\\|\/)+)/;
						if (this.sketchAddType == 1) {
							if (this.msgUrl == '') {
								this.$message.error('请选择图片封面')
								return false;
							} else if (this.inputTitle == '') {
								this.$message.error('请填写图文标题')
								return false;
							} else if (!reg.test(this.url)) {
								this.$message.error('请检查跳转链接格式是否正确(https://或http://开头)')
								return false;
							}
						} else {
							if (this.material_id1 == '') {
								this.$message.error('请选择图文')
								return false;
							}
						}
					} else if (this.typeValue == 6) {
						if (this.miniproAddType == 1) {
							if (this.appletUrl == '') {
								this.$message.error('请选择图片封面')
								return false;
							} else if (this.appletInputTitle == '') {
								this.$message.error('请填写小程序标题')
								return false;
							} else if (this.appid == '') {
								this.$message.error('请填写小程序AppID')
								return false;
							} else if (this.pageUrl == '') {
								this.$message.error('请填写小程序路径')
								return false;
							}
						} else {
							if (this.material_id3 == '') {
								this.$message.error('请选择小程序')
								return false;
							}
						}
					}
					user_ids = this.checkedList3
				} else if (this.validity == 3) {
					//客户群
					if (this.fromCustom == 2) {
						if (this.chooseNum2 == 0) {
							this.$message.warning("请选择群归属成员")
							return false
						}
					}
					user_ids = this.checkedList
				}
				if (this.interval == 2 && this.interval_num == null) {
					this.$message.error('请填写每位成员客户分批推送人数')
					return false;
				}
				let correctness = 1
				if (this.validity == 1) {
					correctness = this.correctness
				} else if (this.validity == 2) {
					correctness = 3
				} else if (this.validity == 3) {
					correctness = 4
				}
				let fieldData = JSON.parse(JSON.stringify(this.fieldData))
				for (let i = 0; i < fieldData.length; i++) {
					if (fieldData[i].match.length == 0) {
						fieldData.splice(i, 1)
						i--
					}
				}
				let ruleContent = {
					redrule_type    : this.rule.redrule_type,
					rule_id         : this.rule.rule_id,
					rule_save       : this.rule.rule_save,
					redpacket_amount: this.rule.redpacket_amount,
				}
				if (this.rule.redrule_type == 1) {
					ruleContent = Object.assign(ruleContent, this.rule1)
				} else {
					ruleContent = Object.assign(ruleContent, this.rule2)
					ruleContent.rule_id = 0
				}
				ruleContent.rule_thanking = ruleContent.rule_thanking || '恭喜发财，大吉大利'
				let param = {
					is_redpacket      : this.isRedpacket,
					isMasterAccount   : localStorage.getItem('isMasterAccount'),
					sub_id            : localStorage.getItem("sub_id"),
					uid               : localStorage.getItem('uid'),
					corp_id           : this.corpId,
					suite_id          : this.suite_id,
					id                : this.urlId,
					title             : this.title,
					agent_id          : this.appId,
					send_type         : correctness,
					sex               : this.sex,
					is_fans           : this.is_fans,
					tag_ids           : this.tag_ids,
					msg_type          : this.typeValue,
					type              : this.validity,
					users             : this.users,
					add_type          : this.index,
					text_content      : this.text,
					media_id          : this.material_id,
					link_title        : this.inputTitle,
					link_image        : this.msgUrl,
					link_attachment_id: this.material_id,
					link_desc         : this.digest,
					link_url          : this.url,
					mini_title        : this.appletInputTitle,
					mini_pic_media_id : this.material_id,
					mini_appid        : this.appid,
					mini_page         : this.pageUrl,
					voice_media_id    : this.material_id,
					video_media_id    : this.material_id,
					file_media_id     : this.material_id,
					attribute         : fieldData,
					attachment_id     : this.material_id3 || this.material_id1,
					materialSync      : this.materialSync,
					groupId           : this.selectGroupId,
					province          : this.province,
					city              : this.city,
					user_ids          : user_ids,
					follow_id         : this.follow_status,
					start_time        : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					end_time          : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
					update_time       : this.followTime ? (this.followTime.length > 1 ? [this.followTime[0].format("YYYY-MM-DD HH:mm"), this.followTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					chat_time         : this.chatTime ? (this.chatTime.length > 1 ? [this.chatTime[0].format("YYYY-MM-DD HH:mm"), this.chatTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					follow_num1       : this.followNum1,
					follow_num2       : this.followNum2,
					sign_id           : this.signId,
					push_type         : this.sendType,
					push_time         : moment(this.sendDate).format("YYYY-MM-DD") + " " + moment(this.sendTime).format("HH:mm"),
					sender            : this.checkedList3,
					interval          : this.interval,
					interval_time     : this.interval_time,
					interval_num      : this.interval_num,
					belong_id         : this.fromCustom
				}
				param = Object.assign(param, ruleContent)
				const {data: res} = await this.axios.post("work-group-sending/add", param);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					if (typeof this.urlId == "undefined") {
						this.$router.push("/massMessage/list")
					} else {
						this.$router.push("/massMessage/list?isRefresh=1")
					}
				}
			},
			//编辑时进入获取消息内容
			async getDetail () {
				const {data: res} = await this.axios.post("work-group-sending/detail", {
					uid: localStorage.getItem("uid"),
					id : this.urlId
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.appId = res.data.agent_id || ''
					this.getAppList(this.appId)
					this.fileName = res.data.file_name
					this.sendType = res.data.push_type
					if (res.data.push_time) {
						this.sendDate = moment(res.data.push_time)
						this.sendTime = moment(res.data.push_time)
					}
					this.isRedpacket = res.data.is_redpacket
					this.redpacket_status = res.data.redpacket_status
					if (res.data.rule_id) {
						this.rule.rule_id = res.data.rule_id
						this.rule.redrule_type = 1
						this.rule1 = {
							rule_type             : res.data.rule_type,
							rule_name             : res.data.rule_name,
							rule_fixed_amount     : res.data.rule_fixed_amount,
							rule_min_random_amount: res.data.rule_min_random_amount,
							rule_max_random_amount: res.data.rule_max_random_amount,
							rule_pic_url          : res.data.rule_pic_url,
							rule_title            : res.data.rule_title,
							rule_des              : res.data.rule_des,
							rule_thanking         : res.data.rule_thanking
						}
						this.rule = Object.assign(this.rule, this.rule1)
					} else {
						this.rule.redrule_type = 2
						this.rule2 = {
							rule_type             : res.data.rule_type,
							rule_name             : res.data.rule_name,
							rule_fixed_amount     : res.data.rule_fixed_amount,
							rule_min_random_amount: res.data.rule_min_random_amount,
							rule_max_random_amount: res.data.rule_max_random_amount,
							rule_pic_url          : res.data.rule_pic_url,
							rule_title            : res.data.rule_title,
							rule_des              : res.data.rule_des,
							rule_thanking         : res.data.rule_thanking
						}
						this.rule = Object.assign(this.rule, this.rule2)
					}
					this.rule = Object.assign(this.rule, {
						rule_save       : 0,
						redpacket_amount: res.data.redpacket_amount,
					})
					this.text = res.data.text_content
					this.selectGroupId = res.data.groupId
					this.interval = res.data.interval
					this.interval_time = res.data.interval_time
					this.interval_num = res.data.interval_num

					if (res.data.send_type == 3) {
						//企业成员
						this.validity = 2
						this.selectedUser = res.data.others.user_ids
						this.chooseNum3 = res.data.others.user_ids.length
						this.checkedList3 = res.data.others.user_ids
						this.chooseUserNum3 = 0
						this.chooseDepartmentNum3 = 0
						this.checkedList3.map(x => {
							if (x.scopedSlots.title == 'custom') {
								this.chooseUserNum3++
							} else if (x.scopedSlots.title == 'title') {
								this.chooseDepartmentNum3++
							}
						})

						this.typeValue = res.data.msg_type
						if (this.typeValue == 3 || this.typeValue == 4 || this.typeValue == 7) {
							this.material_id = res.data.attachment_id
						}
						this.closeShowModal2 = true
					} else if (res.data.send_type == 2) {
						//客户-》筛选客户
						this.validity = 1
						this.index = res.data.add_type
						this.correctness = res.data.send_type
						// this.personsNum = res.data.custom_count
						this.province = res.data.others.province
						this.city = res.data.others.city
						if (!this.province && !this.city) {
							this.province1 = ['全部']
						} else {
							this.province1 = [this.province, this.city]
						}
						this.follow_status = res.data.others.follow_id

						if (res.data.others.start_time == '' && res.data.others.end_time == '') {
							this.joinTime = null
						} else {
							this.joinTime = []
							this.joinTime[0] = moment(res.data.others.start_time, "YYYY-MM-DD HH:mm")
							this.joinTime[1] = moment(res.data.others.end_time, "YYYY-MM-DD HH:mm")
						}
						this.is_fans = res.data.others.is_fans
						this.followTime = res.data.others.update_time.length > 1 ? [moment(res.data.others.update_time[0], "YYYY-MM-DD HH:mm"), moment(res.data.others.update_time[1], "YYYY-MM-DD HH:mm")] : null
						this.chatTime = res.data.others.chat_time.length > 1 ? [moment(res.data.others.chat_time[0], "YYYY-MM-DD HH:mm"), moment(res.data.others.chat_time[1], "YYYY-MM-DD HH:mm")] : null
						this.followNum1 = res.data.others.follow_num1
						this.followNum2 = res.data.others.follow_num2
						this.signId = res.data.others.sign_id
						this.selectChooseNum = res.data.others.user_ids.length
						this.checkedList1 = res.data.others.user_ids
						this.chooseUserNum = 0
						this.chooseDepartmentNum = 0
						this.checkedList1.map(x => {
							if (x.scopedSlots.title == 'custom') {
								this.chooseUserNum++
							} else if (x.scopedSlots.title == 'title') {
								this.chooseDepartmentNum++
							}
						})
					} else if (res.data.send_type == 1) {
						//客户-》全部客户
						this.validity = 1
						this.index = res.data.add_type
						this.correctness = res.data.send_type
						// this.personsNum = res.data.custom_count

						this.selectChooseNum = res.data.others.user_ids.length
						this.checkedList1 = res.data.others.user_ids
						this.chooseUserNum = 0
						this.chooseDepartmentNum = 0
						this.checkedList1.map(x => {
							if (x.scopedSlots.title == 'custom') {
								this.chooseUserNum++
							} else if (x.scopedSlots.title == 'title') {
								this.chooseDepartmentNum++
							}
						})
					} else if (res.data.send_type == 4) {
						//客户群
						this.validity = 3
						this.selectedUser = res.data.others.user_ids
						this.chooseNum2 = res.data.others.user_ids.length
						this.checkedList = res.data.others.user_ids
						this.chooseUserNum2 = 0
						this.chooseDepartmentNum2 = 0
						this.checkedList.map(x => {
							if (x.scopedSlots.title == 'custom') {
								this.chooseUserNum2++
							} else if (x.scopedSlots.title == 'title') {
								this.chooseDepartmentNum2++
							}
						})
						this.index = res.data.add_type
					}
					this.fromCustom = res.data.belong_id
					if (this.fromCustom == 1) {
						this.checkedList1 = []
						this.selectChooseNum = 0
						this.chooseUserNum = 0
						this.chooseDepartmentNum = 0
						this.checkedList = []
						this.chooseNum2 = 0
						this.chooseUserNum2 = 0
						this.chooseDepartmentNum2 = 0
					}
					if (res.data.msg_type == 2 || res.data.add_type == 1) {
						this.img = res.data.image_url
						this.fileName = res.data.file_name
						this.material_id = res.data.image_attachment_id
					} else if (res.data.msg_type == 5 || res.data.add_type == 2) {
						if (res.data.attachment_id != 0) {
							this.material_id1 = res.data.attachment_id
							this.closeShowModal3 = true
							this.sketchAddType1 = 0
							this.sketchAddType = 0
						} else {
							this.disabledSync = res.data.material_sync
							this.materialSync = res.data.material_sync
							this.closeShowModal3 = true
							this.getGroupList(res.data.groupId.toString())
							this.selectGroupId = res.data.groupId.toString()
						}
						this.modalUrlOk = true
						this.msgUrl = res.data.link_pic_url
						this.inputTitle = res.data.link_title
						this.digest = res.data.link_desc
						this.material_id = res.data.link_attachment_id
						this.url = res.data.link_url
					} else if (res.data.msg_type == 6 || res.data.add_type == 3) {
						if (res.data.attachment_id != 0) {
							this.material_id3 = res.data.attachment_id
							this.miniproAddType1 = 0
							this.miniproAddType = 0
						} else {
							this.disabledSync = res.data.material_sync
							this.materialSync = res.data.material_sync
							this.getGroupList(res.data.groupId.toString())
							this.selectGroupId = res.data.groupId.toString()
							this.closeModalApplet = true
						}
						this.disabledSync = res.data.material_sync
						this.modalAppletOk = true
						this.appletInputTitle = res.data.mini_title
						this.appletUrl = res.data.mini_pic_url
						this.material_id = res.data.mini_attachment_id
						this.appid = res.data.mini_appid
						this.pageUrl = res.data.mini_page
					}
					this.closeShowModal2 = true
					this.sex = res.data.sex
					this.tag_ids = res.data.tag_ids
					if (res.data.tag_ids.length > 0) {
						this.tag_arr = res.data.tag_ids.split(',')
					} else {
						this.tag_arr = []
					}
					this.getFieldInfo(res.data.attribute)
					this.text = res.data.text_content
					this.title = res.data.title
					if (this.validity == 3) {
						this.getChatNum()
					}
					// this.validity = res.data.type
					this.isLoading = false;
					this.isShowTag = true
					// this.text = res.data.text_content
					// this.chooseNum = res.data.users.length
					// this.selectedUser = res.data.users
					// this.index = res.data.add_type
				}
			},
			// 更换企业微信
			modalVisibleChange (type, corpId, corpName) {
				if (type == 'ok') {
					if (this.corpId != corpId) {
						this.selectLoading = true
						this.corpId = corpId
						this.corpName = corpName
						this.chooseNum = 0
						this.chooseUserNum = 0
						this.chooseDepartmentNum = 0
						this.chooseNum2 = 0
						this.chooseUserNum2 = 0
						this.chooseDepartmentNum2 = 0
						this.noBindFlag = false
						for (let i = 0; i < this.$store.state.noBindCorpArr.length; i++) {
							if (this.corpId == this.$store.state.noBindCorpArr[i].corpid) {
								this.noBindFlag = true
								this.validity = 2
							}
						}
						this.checkedList1 = []
						this.selectChooseNum = 0
						this.chooseUserNum = 0
						this.chooseDepartmentNum = 0
						this.appId = ''
						this.getAppList()
						this.deleteMessage()
						this.getPersonsNum()
					}
				}
				this.showModal2 = false
			},
			//小叉号删除选中的图片、网址、小程序
			deleteMessage () {
				this.disabledSync = 0
				this.img = ''
				this.msgUrl = ''
				this.inputTitle = ''
				this.digest = ''
				this.url = ''
				this.closeShowModal3 = false
				this.modalUrlOk = false
				this.appletUrl = ''
				this.appletInputTitle = ''
				this.appid = ''
				this.pageUrl = ''
				this.index = 0
				this.closeModalApplet = false
				this.closeShowModal2 = false
				this.modalAppletOk = false
				this.material_id = ''
				this.material_id1 = ''
				this.material_id3 = ''
				this.fileName = ''
			},
			//部门选择弹窗组件
			showDepartmentList (type) {
				this.chooseType = type
				if (type == 0) {
					//客户
					this.noticeTitle = '只显示具有外部联系人权限的成员'
					this.chooseNum1 = this.selectChooseNum
					this.from_chat = 7
					this.is_external = 1
					let arr = []
					if(this.checkedList1.length > 0){
						this.checkedList1.map(x => {
							arr.push(x.id)
						})
					}
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList1))
				} else if (type == 1) {
					//企业成员
					this.noticeTitle = ''
					this.chooseNum1 = this.chooseNum3
					this.from_chat = 0
					this.is_external = 0
					if (this.urlId) {
						let arr = []
						if(this.selectedUser.length > 0) {
							this.selectedUser.map(x => {
								arr.push(x.id)
							})
						}
						this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
						this.$refs.user.rightList = JSON.parse(JSON.stringify(this.selectedUser))
					} else {
						let arr = []
						if(this.checkedList3.length > 0) {
							this.checkedList3.map(x => {
								arr.push(x.id)
							})
						}
						this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
						this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList3))
					}
				} else if (type == 2) {
					//客户群
					this.noticeTitle = '只显示具有客户群使用权限的成员，且是群主身份'
					this.chooseNum1 = this.chooseNum2
					this.from_chat = 8
					this.is_external = 1
					if (this.urlId) {
						let arr = []
						if(this.selectedUser.length > 0) {
							this.selectedUser.map(x => {
								arr.push(x.id)
							})
						}
						this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
						this.$refs.user.rightList = JSON.parse(JSON.stringify(this.selectedUser))
					} else {
						let arr = []
						if(this.checkedList.length > 0) {
							this.checkedList.map(x => {
								arr.push(x.id)
							})
						}
						this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
						this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
					}
				}
				this.showModalDepartment = true
			},
			// 员工选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.chooseType == 0) {
						//客户
						this.selectLoading = true
						this.checkedList1 = list
						this.selectChooseNum = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum = userNum
						this.chooseDepartmentNum = departmentNum
						this.getPersonsNum()
					} else if (this.chooseType == 1) {
						//企业成员
						this.checkedList3 = list
						this.chooseNum3 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum3 = userNum
						this.chooseDepartmentNum3 = departmentNum
						if (this.urlId) {
							this.selectedUser = JSON.parse(JSON.stringify(this.checkedList3))
						}
					} else {
						//客户群
						this.checkedList = list
						this.chooseNum2 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum2 = userNum
						this.chooseDepartmentNum2 = departmentNum
						if (this.urlId) {
							this.selectedUser = JSON.parse(JSON.stringify(this.checkedList))
						}
						this.getChatNum()
					}
				}
				this.showModalDepartment = false
			},
			// 员工重置
			clearDepartmentList (type) {
				if (type == 0) {
					//客户
					this.checkedList1 = []
					this.selectChooseNum = 0
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					this.selectLoading = true
					this.getPersonsNum()
				} else if (type == 1) {
					//企业成员
					this.checkedList3 = []
					this.chooseNum3 = 0
					this.chooseUserNum3 = 0
					this.chooseDepartmentNum3 = 0
					if (this.urlId) {
						this.selectedUser = []
					}
				} else if (type == 2) {
					//客户群
					this.checkedList = []
					this.chooseNum2 = 0
					this.chooseUserNum2 = 0
					this.chooseDepartmentNum2 = 0
					if (this.urlId) {
						this.selectedUser = []
					}
					this.getChatNum()
				}
			},
			// 获取企业应用
			async getAppList (id) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.corpId,
					suite_id  : this.suite_id,
					agent_type: 2
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.appList = res.data
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
			// 地域
			changeCity (value) {
				this.selectLoading = true
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
				this.getPersonsNum()
			},

			handleChangeFollowStatus () {
				this.selectLoading = true
				this.getPersonsNum()
			},
			modalVisibleChange4 (event, arr) {
				if (event == "ok") {
					this.tag_arr = arr.split(',')
					this.tag_ids = arr
					this.getPersonsNum()
				}
			},
			async getFieldInfo (attribute) {
				const {data: res} = await this.axios.post("custom-field/field-info", {
					uid: localStorage.getItem("uid")
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.defineField = res.data.defineField
					for (let define of this.defineField) {
						let field = {
							field: define.fieldid,
							match: ''
						}
						this.fieldData.push(JSON.parse(JSON.stringify(field)))
					}
					if (attribute) {
						for (let attr of attribute) {
							for (let f of this.fieldData) {
								if (attr.field == f.field) {
									f.match = attr.match
								}
							}
						}
					}
					this.selectLoading = true
					this.getPersonsNum()
				}
			},
			//是否间隔发放
			changeInterval () {
				if (this.interval == 2) {
					this.interval_time = 1
					this.interval_num = 50
				}
			},
			// 符合条件的群数
			async getChatNum () {
				let user_ids = []
				for (let i = 0; i < this.checkedList.length; i++) {
					user_ids.push(this.checkedList[i].id)
				}
				const {data: res} = await this.axios.post("work-group-sending/get-chat-num", {
					corp_id : this.corpId,
					user_ids: user_ids
				})
				if (res.error != 0) {
					this.selectLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.chatNum = res.data.chatNum
				}
			},
			// 获取符合条件人
			async getPersonsNum () {
				this.selectLoading = true
				let userIds = []
				for (let i = 0; i < this.checkedList1.length; i++) {
					userIds.push(this.checkedList1[i].id)
				}
				let fieldData = JSON.parse(JSON.stringify(this.fieldData))
				for (let i = 0; i < fieldData.length; i++) {
					if (fieldData[i].match.length == 0) {
						fieldData.splice(i, 1)
						i--
					}
				}
				const {data: res} = await this.axios.post("work-external-contact-follow-user/group-custom-list", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem("sub_id"),
					uid            : localStorage.getItem('uid'),
					corp_id        : this.corpId,
					suite_id       : this.suite_id,
					sex            : this.sex,
					tag_ids        : this.tag_ids,
					is_fans        : this.is_fans,
					is_all         : 1,
					correctness    : this.correctness,
					user_ids       : userIds,
					province       : this.province,
					city           : this.city,
					follow_id      : this.follow_status,
					fieldData      : fieldData,
					name           : this.customItem.name,
					phone          : this.customItem.phone,
					start_time     : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					end_time       : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
					update_time    : this.followTime ? (this.followTime.length > 1 ? [this.followTime[0].format("YYYY-MM-DD HH:mm"), this.followTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					chat_time      : this.chatTime ? (this.chatTime.length > 1 ? [this.chatTime[0].format("YYYY-MM-DD HH:mm"), this.chatTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					follow_num1    : this.followNum1,
					follow_num2    : this.followNum2,
					sign_id        : this.signId,
					belong_id      : this.fromCustom
				});
				if (res.error != 0) {
					this.selectLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.personsNum = res.data.info.length
					this.users = []
					if (this.validity == 1 && this.correctness == 2) {
						for (let i = 0; i < res.data.info.length; i++) {
							this.users.push(res.data.info[i].key)
						}
					}

					this.selectLoading = false
				}
			},
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
			}
		},
		created () {
			this.urlId = this.$route.query.id
			this.corpArr = this.$store.state.corpArr
			if (this.$route.query.item) {
				this.customItem = this.$route.query.item
				this.corpId = this.customItem.corpId
				this.corpArr.map(x => {
					if (x.corpid == this.corpId) {
						this.corpName = x.corp_name
					}
				})
				this.checkedList1 = this.customItem.checkedList
				this.follow_status = Number(this.customItem.id)
			} else {
				this.corpId = localStorage.getItem('corpId')
				this.corpName = localStorage.getItem('corpName')
			}

			if (typeof this.urlId != "undefined") {
				this.isLoading = true;
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/massMessage/list')
				this.getDetail()
			} else {
				this.getAppList()
				this.getFieldInfo()
			}
			this.getFollowStatus()
			this.handleChangeSign()
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 0px 0px 15px 10px;
		text-align: left;
	}

	.content-msg a:link {
		color: #01b065;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.content-msg a:visited {
		color: #01b065;
		text-decoration: none;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		border: 1px solid #D9D9D9;
		height: 110px;
		overflow: auto;

		/deep/ p {
			margin: 0;
			/*display: inline-block;*/
			word-break: break-word;
		}
	}

	.hide {
		display: none !important;
	}

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 760px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 55px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .ant-col-15 {
		margin-left: 15px;
	}

	/deep/ .ant-card-meta-avatar {
		float: right;
		padding: 0;
	}

	#components-layout-demo-basic .ant-layout-content {
		min-width: 760px;
		width: 100%;
		position: relative;
	}

	.content {
		border: 1px solid #E2E2E2;
		min-width: 760px;
		position: absolute;
		top: 20px;
		left: 20px;
		right: 20px;
		background-color: #FAFAFA;
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

	.content-hd {
		height: 80px;
		padding: 20px 0;
		border-bottom: 1px solid #E2E2E2;
	}

	.content-bd {
		background: #F5F5F5;
	}

	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 0 5px;
	}

	.pull-left {
		width: 88px;
	}

	.push-type-item {
		position: relative;
		margin-bottom: 8px;
		border: 1px solid #D8D8D8;
		border-right: 0;
		z-index: 1;
		cursor: pointer;
		line-height: 38px;
	}

	.active {
		background: #FFF;
		margin-right: -1px;
	}

	.type {
		display: inline-block;
		width: 65px;
		border-right: 1px solid transparent;
		text-align: center;
	}

	.add-new {
		background: #F9F9F9;
		cursor: pointer;
	}

	.add-icon {
		font-size: 12px;
		float: left;
		width: 30px;
		height: 38px;
		line-height: 38px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		border-right: 0;
	}

	.add-btn {
		float: left;
		width: 58px;
		text-align: center;
		height: 38px;
		line-height: 38px;
		border: 1px dashed #D8D8D8;
		border-right: 0;
	}

	.pull-right {
		width: calc(100% - 20px);
		/*max-height: 574px;*/
		/*height: 574px;*/
		background: #FFF;
		border: 1px solid #D8D8D8;
		padding: 24px;
		margin-right: 20px;
		/*overflow: auto;*/
	}

	.fl {
		float: left;
	}

	.msg_content_txt {
		width: calc(100% - 46px);
		border: 1px solid #E9E9E9;
		padding: 10px 16px;
		border-radius: 4px;
		font-size: 14px;
		color: #1A1A1A;
		background: #FFF;
		float: left;
		word-break: break-word;
	}

	.box {
		float: right;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
		border: 2px solid #01b065;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
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

	.wrap {
		border: 1px solid #E2D6D6;
		margin: auto;
		height: 100%;
		width: 100%;
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}

	.popover-menu {
		cursor: pointer;
		text-align: center;
		display: inline-block;
		width: 80px;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	.popover-menu1, .popover-menu2 {
		margin-left: 10px;
	}

	.popover-menu p {
		margin-bottom: 5px;
	}

	.material {
		max-width: 80px;
		max-height: 80px;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.material-div {
		display: inline-block;
		position: relative;
		width: 100px;
		height: 100px;
		border: 1px dashed #D8D8D8;
	}

	.clear-current-list {
		display: inline-block;
		cursor: pointer;
		margin-left: 10px;
		color: #01b065;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
		margin-bottom: 10px;
	}

	.upload-wrap {
		width: 96px;
		height: 96px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		background: #FFF;
		cursor: pointer;
		margin-bottom: 10px;
		float: left;
	}

	.upload-plus {
		font-size: 32px;
		line-height: 96px;
		font-weight: 300;
		color: #686868;
	}

	.url-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 18px;
	}

	.url-text {
		float: left;
		max-width: calc(100% - 74px);
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		color: #A3A3A3;
	}

	.url-img {
		float: right;
		width: 64px;
		height: 64px;
	}

	.applet-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 52px;
	}

	.upload-border {
		background: #FFFFFF;
		border: 1px dotted #D8D8D8;
		height: 110px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		margin-bottom: 10px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	.audio {
		width: 100%;
		height: 65px;
		padding: 10px 20px;
		background: #FFF;
	}

	.box {
		float: right;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
		border: 2px solid #01b065;
	}

	.wifi-symbol {
		width: 30px;
		height: 30px;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(135deg);
		position: absolute;
		left: 13px;
		top: 6px;
	}

	.wifi-circle {
		border: 2px solid #01b065;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 5px;
		height: 5px;
		background: #01b065;
		top: 25px;
		left: 25px;
	}

	.second {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
	}

	.third {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
	}

	.editMessage {
		display: inline-block;
		margin-left: 10px;
		color: blue;
	}

	.changeType {
		border: 1px dashed #E2E2E2;
		background: #FFF;
		margin: 15px 0;
		line-height: 110px;

		span {
			vertical-align: super;
		}
	}

	.file-name {
		float: right;
		margin-right: 10px;
		max-width: calc(100% - 70px);
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.hideMask {
		color: rgba(0, 0, 0, 0.25);
		background-color: #F5F5F5;
		cursor: not-allowed;
		opacity: 0.5;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100% !important;
		z-index: 9999;
	}

	/deep/ .inputTitle {
		height: 30px;
		line-height: 30px;
		background: #0F0F0F;
		opacity: 0.3;
		color: #FFF;
		padding: 0 10px;
		margin-top: -30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/deep/ .ant-tag {
		margin-right: 5px;
		height: 26px;
		line-height: 25px;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-form-item-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

</style>
