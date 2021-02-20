<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden;">
				<a-layout
						style="position: absolute;top:0;bottom:0;right:0;left: 0;overflow-x: hidden; overflow-y: auto;"
						class="fans-content scroll">
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">群发消息</div>
						<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
							<a-collapse expand-icon-position="right">
								<a-collapse-panel key="1">
									<template slot="header">
										<p style="margin-bottom: 7px;">
											每个客户每个月最多可接收来自同一企业管理员的4条群发消息，可在一天接收4条，达到接收上限后将无法再给该客户推送消息。<span
												style="color: #FF562D;">同一客户归属于多个员工时，群发时该客户收到某员工的推送内容，其他员工不再重复推送。</span>
										</p>
										<p style="margin-bottom: 2px;font-weight: 700; margin-top: 7px;">
											群发红包给客户
										</p>
										<p style="margin-bottom: 2px;">
											a、客户在对话框领取红包之后，下次再打开该红包，直接查看客户自己的红包领取记录。
										</p>
										<p style="margin-bottom: 2px;">
											b、由于官方接口受限，企业成员在对话框打开红包，只能查看所群发的全部客户的红包领取记录，无法查看某个客户的红包领取记录。
											<!-- <span style="color: #FF562D">（由于官方接口受限，无法与客户一样，查看的是该客户的领取记录）
											</span> -->
										</p>
										<p style="margin-bottom: 2px;font-weight: 700; margin-top: 7px;">
											群发红包给客户群：
										</p>
										<p style="margin-bottom: 2px;">
											a、客户在客户群的对话框领取红包之后，下次再打开该红包，直接查看该群的客户红包领取记录。
										</p>
										<p style="margin-bottom: 2px;">
											b、由于官方接口受限，企业成员在对话框打开红包，只能查看本次所群发的全部客户群的全部客户的红包领取记录，无法查看某个群的红包领取记录。
											<!-- <span style="color: #FF562D">（由于官方接口受限，无法查看的是该群的客户领取记录）
											</span> -->
										</p>
										<p style="margin-bottom: 2px;">
											c、当没有添加企业成员，只是个人微信客户，无法领取红包，且提示：您当前为个人微信客户，没有添加过企业成员，无法领取红包。
										</p>
										<p style="margin-bottom: 2px;font-weight: 700; margin-top: 7px; color: #FF562D;">
											若红包已发送到客户/客户群里，但客户尚未领取，此时微信支付商户平台出现账户余额不足时，客户打开红包页面无法领取，请务必保证账户余额充足，避免客户投诉。
										</p>
										<p style="margin: 10px 0 2px;color: #FF562D;">
											商户需完成以下配置，才能使用派发红包功能：
										</p>
									</template>
									<p style="margin-bottom: 2px;">
										1、前往<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
										       target="_blank">【微信支付商户平台】</a>注册微信支付商户号
									</p>
									<p style="margin-bottom: 2px;">
										2、登录<a
											href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu"
											target="_blank">【企业微信后台】</a>开通企业支付，绑定已有商户号
											（<a
											href="https://shimo.im/docs/VYxdrYqp9PjjWdHJ" target="_blank">查看教程</a>）
									</p>
									<p style="margin-bottom: 2px;">
										3、登录<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
										       target="_blank">【微信支付商户平台】</a>开通【企业付款到零钱】
													 （<a
											href="https://shimo.im/docs/8GyqJGXpGkWtGxXk/" target="_blank">查看教程</a>）
									</p>
									<p style="margin-bottom: 2px;">
										4、在本系统，进入【应用中心】--【企业支付】，点击，填入企业支付的应用ID和Secret
									</p>
									<p style="margin-bottom: 2px;">
										5、在本系统，进入【应用中心】--【企业支付】，点击，完成支付配置。
										（<a
											href="https://shimo.im/docs/rYGd6HJRrvxdTCRj/" target="_blank">查看教程</a>）
									</p>
								</a-collapse-panel>
							</a-collapse>
						</div>
						<div class="content-hd">
							<div style="background-color: #FFFFFF;padding: 20px 0 10px 0; margin: 12px 0;overflow: hidden;">
								<span class="select-option" v-if="corpLen > 1">
									<label style="margin-right: 5px;">企业微信：</label>
									<a-select
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
									<label style="margin-right: 5px;">发送类型：</label>
									<a-select v-model="sendType" showSearch optionFilterProp="children"
									          style="width: 210px">
										<a-select-option :value="0">全部</a-select-option>
										<a-select-option :value="1">客户</a-select-option>
										<a-select-option :value="4">客户群</a-select-option>
										<a-select-option :value="3">企业成员</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">发送状态：</label>
									<a-select v-model="sendStatus" showSearch optionFilterProp="children"
									          style="width: 210px">
										<a-select-option value="-1">全部</a-select-option>
										<a-select-option value="1">发送成功</a-select-option>
										<a-select-option value="3">发送中</a-select-option>
										<a-select-option value="0">未发送</a-select-option>
										<a-select-option value="2">发送失败</a-select-option>
									</a-select>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">群发消息：</label>
									<a-input placeholder="搜索群发消息" @keyup.enter="find" v-model="messageText"
									         style="width: 210px;"/>
								</span>
								<span class="select-option">
									<label style="margin-right: 5px;">发送时间：</label>
									<a-range-picker
											style="margin-bottom: 10px;margin-right: 10px;width: 330px;"
											:show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')] }"
											format="YYYY-MM-DD HH:mm"
											allowClear
											:disabled-date="disabledDate"
											v-model="sendDate"
									/>
								</span>
								<a-button type="primary" style="margin-right: 5px;" @click="find">查询</a-button>
								<a-button @click="clear">重置</a-button>
								<a-col style="float:right;margin-right: 20px;">
									<a-button class="btn-primary"@click="addMessageText()" type="primary"
									          v-has="'group-sending-add'">
										新建消息
									</a-button>
									<a-button  @click="refresh" style="margin-left: 10px;width: 110px;"
									          v-has="'group-sending-list'">
										更新数据
									</a-button>
								</a-col>
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="messageList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'group-sending-list'">
									<span slot="title2" slot-scope="text, record, index">
                                        <div style="width: 145px;min-width: 60px;">{{record.title}}</div>
                                    </span>
									<span slot="send_amount" slot-scope="text, record, index">
										<div v-if="record.is_redpacket == 1">
											￥{{record.send_amount}}
											<div>（{{record.send_num}}人）</div>
										</div>
										<div v-if="record.is_redpacket == 0">
											--
										</div>
                                    </span>
									<span slot="content" slot-scope="text, record, index">
                                        <a href="javascript:;" @click="handleShowDetail(record.id)">预览</a>
                                    </span>
									<span slot="send_people" slot-scope="text, record, index">
										<div style="max-width: 300px;">
											<span v-if="record.type == '企业成员'">--</span>
										<span v-if="record.type == '客户群'">
											<template v-if="record.others.user_ids.length == 0">--</template>
											<template v-else-if="record.others.user_ids.length>5">
											<a-popover trigger="hover">
												<span slot="content"
												      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;max-height: 300px;overflow-y: auto;">
													<a-tag v-for="(item,index) in record.others.user_ids"
													       color="orange" style="margin-bottom: 5px;">
														群主：{{item.title}}
													</a-tag>
												</span>
												<a-tag v-for="(item,index) in record.others.user_ids" color="orange"
												       v-if="index < 5" style="margin-bottom: 5px;">
													群主：{{item.title}}
												</a-tag>
												<span>等共计{{record.others.user_ids.length}}位群主</span>
											</a-popover>
										</template>
										<template v-else>
											<a-tag v-for="(item,index) in record.others.user_ids" color="orange"
											       v-if="index < 5" style="margin-bottom: 5px;">
												群主：{{item.title}}
											</a-tag>
										</template>
                                        </span>
											<span v-if="record.type == '客户'">
												<template v-if="record.others.user_ids.length == 0">--</template>
										<template v-else-if="record.others.user_ids.length>5">
											<a-popover trigger="hover">
												<span slot="content"
												      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;max-height: 300px;overflow-y: auto;">
													<template v-for="user in record.others.user_ids">
														<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'"
														       color="orange"
														       style="margin-top: 5px;">{{user.title}}</a-tag>
													</template>
													<template v-for="user in record.others.user_ids">
														<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'"
														       color="blue"
														       style="margin-top: 5px;">{{user.title}}</a-tag>
													</template>
													<!--													<a-tag v-for="(item,index) in record.others.user_ids"-->
													<!--													       color="orange" style="margin-bottom: 5px;">-->
													<!--														{{item.title}}-->
													<!--													</a-tag>-->
												</span>
												<template v-for="(user,index) in record.others.user_ids">
														<a-tag v-if="index < 5 && user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'"
														       color="orange"
														       style="margin-top: 5px;">{{user.title}}</a-tag>
													</template>
													<template v-for="(user,index) in record.others.user_ids">
														<a-tag v-if="index < 5 &&user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'"
														       color="blue"
														       style="margin-top: 5px;">{{user.title}}</a-tag>
													</template>
												<span>等共计{{getUserNum(record.others.user_ids)}}位成员、{{record.others.user_ids.length - getUserNum(record.others.user_ids)}}部门</span>
											</a-popover>
										</template>
										<template v-else>
											<template v-for="user in record.others.user_ids">
												<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title == 'custom'"
												       color="orange"
												       style="margin-top: 5px;">{{user.title}}</a-tag>
											</template>
											<template v-for="user in record.others.user_ids">
												<a-tag v-if="user.scopedSlots && user.scopedSlots.title && user.scopedSlots.title != 'custom'"
												       color="blue"
												       style="margin-top: 5px;">{{user.title}}</a-tag>
											</template>
										</template>
												</span>
											</div>
									</span>
									<span slot="redpacket_amount" slot-scope="text, record, index">
										<div v-if="record.is_redpacket == 1">
											<div>￥{{record.redpacket_amount}}</div>
											（
											<span v-if="record.rule_type == 1">
												定额￥{{record.rule_fixed_amount}}
											</span>
											<span v-if="record.rule_type == 2">
												拼手气￥{{record.rule_min_random_amount}}~￥{{record.rule_max_random_amount}}
											</span>
											）
										</div>
										<div v-if="record.is_redpacket == 0">--</div>
                                    </span>
									<span slot="will_num" slot-scope="text, record, index">
										<div style="min-width: 125px;">预计发送{{record.will_num}}个<span
												v-if="record.type == '客户'">客户</span><span
												v-if="record.type == '客户群'">群聊</span></div>
										<div v-if="record.isShowSuccess != 1">已成功发送{{record.real_num}}个<span
												v-if="record.type == '客户'">客户</span><span
												v-if="record.type == '客户群'">群聊</span></div>
                                    </span>
									<span slot="status" slot-scope="text, record, index">
										<div v-if="text==1">发送成功</div>
										<div v-if="text==3">发送中</div>
										<div v-if="text==0">未发送</div>
										<div v-if="text==0">（定时在{{record.push_time}}）</div>
										<div v-if="text==2">
											 <a-tooltip placement="top" v-if="record.error_msg">
								                    <template slot="title">
									                    <span>{{record.error_msg}}</span>
								                    </template>
								                    <span style="color: red">发送失败</span>
											 </a-tooltip>
											 <span v-if="!record.error_msg" style="color: red">发送失败</span>
										</div>
                                    </span>
									<span slot="status2">
						                  发送状态
						                  <a-tooltip placement="top">
						                    <template slot="title">
						                      <div>未发送：尚未到定点时发送</div>
						                      <div>发送中：尚有成员未确认</div>
						                      <div>已发送：成员全部确认后</div>
						                      <div>发送失败：因某种原因发送失败</div>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
									<span slot="push_time" slot-scope="text, record, index">
										<span v-if="record.status == 0">--</span>
										<span v-else>{{text}}</span>
                                    </span>
									<span slot="push_time2">
						                  发送时间
						                  <a-tooltip placement="top">
						                    <template slot="title">
						                      <span>以发送的时间为准，不以发送到达的时间。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
									<span slot="action" slot-scope="text, record">
										<a-button v-show="record.status == 0" @click="editList(record.id)"
										          style="margin: 0 5px 5px 0">编辑</a-button>
										<a-button @click="sendRecord(record.id,record.type)" style="margin: 0 5px 5px 0"
										          v-if="record.type != '企业成员' && record.status != 0 && record.is_show == 1"
										          v-has="'group-sending-record'">群发记录</a-button>
										<a-button @click="handleShowDetail(record.id)"
										          style="margin: 0 5px 5px 0">预览内容</a-button>
										<a-button v-show="record.status != 3 && record.is_del == 0"
										          @click="deleteList(record.id)"
										          v-has="'group-sending-delete'">删除</a-button>
									</span>
								</a-table>

								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'group-sending-list'">
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
								<!-- 详情页面 -->
								<a-drawer placement="right" :closable="false" @close="onClose" :visible="visible">
									<a-tabs defaultActiveKey="1">
										<a-tab-pane tab="消息内容" key="1">
											<div v-show="(validity == 1 || validity == 3) && isRedpacket == 0"
											     class="wrap">
												<img src="../../../assets/wxHeader.png" alt
												     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
												<div class="msg_content_body">
													<!--文本-->
													<div v-if="text" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<p class="item-info msg_content_txt"
														   v-html="text.replace(/{nickname}/g,'&nbsp;<span contenteditable=\'false\' class=\'ant-tag ant-tag-orange\'>客户名称</span>&nbsp;').replace(/\n/g, '<br>')"
														   style="word-break:break-all;word-wrapL:break-word;"></p>
													</div>
													<!--图片-->
													<div v-if="img" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<img :src="commonUrl+img" alt
														     style="width: 150px;border-radius: 4px;"/>
													</div>
													<!--网址-->
													<div v-if="modalUrlOk" class="mt">
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
													<div v-if="modalAppletOk" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<div class="item-info msg_content_txt">
															<!--											<p class="url-title" style="color: #A3A3A3;">{{appletInputTitle}}</p>-->
															<p class="applet-title">{{appletInputTitle}}</p>
															<img :src="commonUrl+appletUrl" alt="" style="width: 100%;">
														</div>
													</div>
												</div>
											</div>
											<div v-show="(validity == 1 || validity == 3) && isRedpacket == 1"
											     class="wrap">
												<img src="../../../assets/wxHeader.png" alt
												     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
												<div class="msg_content_body">
													<!--图文-->
													<div class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<div class="item-info msg_content_txt">
															<p class="url-title">{{rule.rule_title || '标题'}}</p>
															<div style="overflow: hidden;">
																<div class="url-text">{{rule.rule_des}}</div>
																<img :src="commonUrl+ rule.rule_pic_url" alt=""
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
														<p class="item-info msg_content_txt"
														   v-html="text.replace(/{nickname}/g,'&nbsp;<span contenteditable=\'false\' class=\'ant-tag ant-tag-orange\'>客户名称</span>&nbsp;').replace(/\n/g, '<br>')"
														   style="word-break:break-all;word-wrapL:break-word;"></p>
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
																<video-player class="video-player vjs-custom-skin"
																              ref="videoPlayer"
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
										</a-tab-pane>
									</a-tabs>
								</a-drawer>
								<!--群发记录抽屉-->
								<a-drawer
										placement="right"
										:closable="false"
										:visible="recordVisible"
										@close="recordDrawerClose"
										width="1000px!important"
								>
									<template slot="title">
										{{drawerTitle}}
									</template>
									<div style="padding: 20px;">
										<template v-if="recordType == 1">
											<p v-if="user_ids.length == 0">
												向<span style="color: red;">{{will_num}}</span>位客户，发送群发消息
											</p>
											<p v-else>
												向【{{user_ids[0].title}}】
												<template v-if="user_ids.length > 1">、【{{user_ids[1].title}}】</template>
												<template v-if="user_ids.length > 2">、【{{user_ids[2].title}}】</template>
												<template v-if="user_ids.length > 3">
													等{{getUserNum(user_ids)}}个成员、{{user_ids.length -
													getUserNum(user_ids)}}个部门
												</template>
												共计<span style="color: red;">{{will_num}}</span>位客户，发送群发消息
											</p>
										</template>
										<template v-if="recordType == 2">
											<p v-if="user_ids.length == 0">向<span
													style="color: red;">{{will_num}}</span>个群聊，发送群发消息
											</p>
											<p v-if="user_ids.length == 1">向【{{user_ids[0].title}}】群主共计<span
													style="color: red;">{{will_num}}</span>个群聊，发送群发消息
											</p>
											<p v-if="user_ids.length == 2">
												向【{{user_ids[0].title}}】、【{{user_ids[1].title}}】群主共计<span
													style="color: red;">{{will_num}}</span>个群聊，发送群发消息
											</p>
											<p v-if="user_ids.length == 3">
												向【{{user_ids[0].title}}】、【{{user_ids[1].title}}】、【{{user_ids[2].title}}】群主共计<span
													style="color: red;">{{will_num}}</span>个群聊，发送群发消息
											</p>
											<p v-if="user_ids.length > 3">
												向【{{user_ids[0].title}}】、【{{user_ids[1].title}}】及【{{user_ids[2].title}}】等共计{{user_ids.length}}个群主<span
													style="color: red;">{{will_num}}</span>个群聊，发送群发消息
											</p>
										</template>
										<p>
											<template v-if="others.sex != -1">
												<a-tag v-if="others.sex == 1" color="blue">男性</a-tag>
												<a-tag v-if="others.sex == 2" color="blue">女性</a-tag>
												<a-tag v-if="others.sex == 3" color="blue">未知性别</a-tag>
											</template>
											<template v-if="others.start_time != '' && others.end_time != ''">
												<a-tag color="blue">{{others.start_time}}至{{others.end_time}}加入</a-tag>
											</template>
											<template
													v-if="typeof others.update_time == 'object' && others.update_time.length != 0">
												<a-tag color="blue">
													{{others.update_time[0]}}至{{others.update_time[1]}}跟进
												</a-tag>
											</template>
											<template
													v-if="typeof others.chat_time == 'object' && others.chat_time.length != 0">
												<a-tag color="blue">
													上次{{others.chat_time[0]}}至{{others.chat_time[1]}}单聊
												</a-tag>
											</template>
											<a-tag v-if="others.follow_num1 != '' && others.follow_num2 != ''"
											       color="blue">
												跟进次数在{{others.follow_num1}}至{{others.follow_num2}}次之间
											</a-tag>
											<a-tag v-if="others.follow_num1 != '' && others.follow_num2 == ''"
											       color="blue">
												跟进次数高于{{others.follow_num1}}次
											</a-tag>
											<a-tag v-if="others.follow_num1 == '' && others.follow_num2 != ''"
											       color="blue">
												跟进次数不低于{{others.follow_num1}}次
											</a-tag>
											<a-tag v-if="others.store_name != ''" color="blue">{{others.store_name}}
											</a-tag>
											<a-tag v-if="others.province != '' && others.city == ''" color="blue">
												{{others.province}}
											</a-tag>
											<a-tag v-if="others.province != '' && others.city != ''" color="blue">
												{{others.province}}{{others.city}}
											</a-tag>
											<template
													v-if="typeof others.attribute_data == 'object' && others.attribute_data.length != 0">
												<a-tag v-for="item in others.attribute_data" color="blue">
													{{item.value}}
												</a-tag>
											</template>
											<a-tag v-if="others.follow_name != ''" color="blue">{{others.follow_name}}
											</a-tag>
											<template
													v-if="typeof others.tag_name == 'object' && others.tag_name.length != 0">
												<a-tag v-for="item in others.tag_name" color="blue">{{item}}</a-tag>
											</template>
										</p>
										<a-row class="single-accout-card" v-if="recordType == 1">
											<a-col :span="6" class="single-accout-cardItem">
												<p class="single-accout-cardItem-num">{{send_num}}</p>
												<p class="single-accout-cardItem-title">已送达
													<a-tooltip placement="right">
														<template slot="title">
															<span>在预计发送客户中，已收到成员推送的消息（同一客户添加多个员工，只计入1个成员推送）</span>
														</template>
														<a-icon type="question-circle" style="margin-left:5px;"/>
													</a-tooltip>
												</p>
											</a-col>
											<a-col :span="6" class="single-accout-cardItem">
												<p class="single-accout-cardItem-num">{{not_num}}</p>
												<p class="single-accout-cardItem-title">未送达客户
													<a-tooltip placement="right">
														<template slot="title">
															<span>在预计发送客户中，未收到成员推送的消息</span>
														</template>
														<a-icon type="question-circle" style="margin-left:5px;"/>
													</a-tooltip>
												</p>
											</a-col>
											<a-col :span="6" class="single-accout-cardItem">
												<p class="single-accout-cardItem-num">{{limit_num}}</p>
												<p class="single-accout-cardItem-title">未知原因导致失败
													<a-tooltip placement="right">
														<template slot="title">
															<span>客户已经收到其他群发消息导致发送失败等其他原因导致失败</span>
														</template>
														<a-icon type="question-circle" style="margin-left:5px;"/>
													</a-tooltip>
												</p>
											</a-col>
											<a-col :span="6" class="single-accout-cardItem">
												<p class="single-accout-cardItem-num">{{fail_num}}</p>
												<p class="single-accout-cardItem-title">因不是好友发送失败
													<a-tooltip placement="right">
														<template slot="title">
															<span>成员已被客户删除/拉黑</span>
														</template>
														<a-icon type="question-circle" style="margin-left:5px;"/>
													</a-tooltip>
												</p>
											</a-col>
										</a-row>
										<a-row class="single-accout-card" v-if="isRedpacket == 1">
											<a-col style="width: 20%;" :span="6" class="single-accout-cardItem">
												<p style="color:#FF562D;" class="single-accout-cardItem-num">
													￥{{all_money}}</p>
												<p class="single-accout-cardItem-title">投放红包总金额
													<!--													<a-tooltip placement="right">-->
													<!--														<template slot="title">-->
													<!--															<span>在预计发送客户中，已收到成员推送的消息（同一客户添加多个员工，只计入1个成员推送）</span>-->
													<!--														</template>-->
													<!--														<a-icon type="question-circle" style="margin-left:5px;"/>-->
													<!--													</a-tooltip>-->
												</p>
											</a-col>
											<a-col style="width: 20%;" :span="6" class="single-accout-cardItem">
												<p style="color:#FF562D;" class="single-accout-cardItem-num">
													￥{{all_get_money}}</p>
												<p class="single-accout-cardItem-title">已领取金额
													<!--													<a-tooltip placement="right">-->
													<!--														<template slot="title">-->
													<!--															<span>在预计发送客户中，未收到成员推送的消息</span>-->
													<!--														</template>-->
													<!--														<a-icon type="question-circle" style="margin-left:5px;"/>-->
													<!--													</a-tooltip>-->
												</p>
											</a-col>
											<a-col style="width: 20%;" :span="6" class="single-accout-cardItem">
												<p style="color:#3B74FF;" class="single-accout-cardItem-num">
													{{all_get_num}}人</p>
												<p class="single-accout-cardItem-title">已领取人数
													<!--													<a-tooltip placement="right">-->
													<!--														<template slot="title">-->
													<!--															<span>在预计发送客户中，未收到成员推送的消息</span>-->
													<!--														</template>-->
													<!--														<a-icon type="question-circle" style="margin-left:5px;"/>-->
													<!--													</a-tooltip>-->
												</p>
											</a-col>
											<a-col style="width: 20%;" :span="6" class="single-accout-cardItem">
												<p style="color:#FF562D;" class="single-accout-cardItem-num">
													￥{{all_not_get_money}}</p>
												<p class="single-accout-cardItem-title">未领取金额
													<!--													<a-tooltip placement="right">-->
													<!--														<template slot="title">-->
													<!--															<span>客户每月接收的企业管理员推送的消息已达上限</span>-->
													<!--														</template>-->
													<!--														<a-icon type="question-circle" style="margin-left:5px;"/>-->
													<!--													</a-tooltip>-->
												</p>
											</a-col>
											<a-col style="width: 20%;" :span="6" class="single-accout-cardItem">
												<p style="color:#3B74FF;" class="single-accout-cardItem-num">
													{{all_not_get_num}}人</p>
												<p class="single-accout-cardItem-title">未领取人数
													<!--													<a-tooltip placement="right">-->
													<!--														<template slot="title">-->
													<!--															<span>客户每月接收的企业管理员推送的消息已达上限</span>-->
													<!--														</template>-->
													<!--														<a-icon type="question-circle" style="margin-left:5px;"/>-->
													<!--													</a-tooltip>-->
												</p>
											</a-col>
										</a-row>
										<a-tabs v-model="tabKey" style="margin: 20px 0 ;" @change="changeTabKey"
										        type="card" v-if="recordType == 1">
											<a-tab-pane :key="1" tab="群发记录">
												<div style="margin: 0 0 20px 0;overflow: hidden;" class="record-draw">
													<div style="background-color: #FFFFFF;">
														<div style="height: 32px;line-height: 32px;margin-bottom: 10px;color: #000;">
															共
															<span style="color: blue">{{total2}}</span>个客户
														</div>
														<span class="select-option">
																		<label style="margin-right: 5px;">搜索客户：</label>
																		<a-input style="margin-right: 5px;width: 180px;"
																		         @keyup.enter="getMassMessageRecord(1, pageSize2)"
																		         placeholder="请输入要搜索的客户"
																		         v-model="customName"/>
																	</span>
														<span class="select-option">
																		<label style="margin-right: 5px;">所属成员：</label>
																		<a-button @click="showDepartmentList(1)"
																		          style="width: 180px;margin-right: 5px;">
																			<span v-if="chooseStaffNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
																			<span v-else>选择成员</span>
																		</a-button>
																	</span>
														<span class="select-option">
																		<label style="margin-right: 5px;">送达状态：</label>
																		<a-select
																				showSearch
																				optionFilterProp="children"
																				placeholder="请选择送达状态"
																				style="width: 180px;margin-right: 5px;"
																				v-model="deliveryStatus"
																		>
																			<a-select-option
																					:value="-1">全部</a-select-option>
																			<a-select-option
																					:value="0">未送达</a-select-option>
																			<a-select-option
																					:value="1">已送达</a-select-option>
																			<a-select-option
																					:value="2">客户已不是好友</a-select-option>
																			<a-select-option
																					:value="3">未知原因导致失败</a-select-option>
																		</a-select>
																	</span>
														<a-button type="primary"
														          style="margin-right: 5px;"
														          @click="searchRecord">查找
														</a-button>
														<a-button style="margin-right: 10px;" @click="resetRecord">清空
														</a-button>
													</div>
												</div>

												<a-spin tip="加载中..." size="large" :spinning="isLoading2">
													<a-table :columns="columns2" :dataSource="massMessageRecordList"
													         :pagination="false"
													         :rowClassName="rowClassName">
														<div slot="customer" slot-scope="text, record, index">
															<a-avatar v-if="record.avatar" shape="square" :size="42"
															          :src="record.avatar"
															          style="float: left;"/>
															<img style="width: 42px;height: 42px;float: left;"
															     v-if="!record.avatar"
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
														<span slot="send" slot-scope="text, record, index">
																	<span v-if="record.send == 0">未送达</span>
																	<span v-if="record.send == 1">已送达</span>
																	<span v-if="record.send == 2">客户已不是好友</span>
																	<span v-if="record.send == 3">未知原因导致失败</span>
																</span>
													</a-table>
													<!--分页-->
													<div class="pagination"
													     style="width: 100%;position: absolute;margin: 20px 0px;"
													     v-show="total2 > 0">
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
												</a-spin>
											</a-tab-pane>
											<a-tab-pane :key="2" tab="成员确认">
												<div style="margin: 0 0 20px 0;" class="record-draw">
													<div style="background-color: #FFFFFF;">
														<div style="height: 32px;line-height: 32px;margin-bottom: 10px;color: #000;">
															共
															<span style="color: blue">{{total3}}</span>个成员
														</div>
														<span class="select-option">
																														<label style="margin-right: 5px;">搜索成员：</label>
																														<a-input
																																style="margin-right: 5px;width: 210px;"
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
																																v-model="staffSendStatus"
																														>
																															<a-select-option
																																	:value="-1">全部</a-select-option>
																															<a-select-option
																																	:value="0">未发送</a-select-option>
																															<a-select-option
																																	:value="1">已发送</a-select-option>
																															<a-select-option
																																	:value="2">排队发送</a-select-option>
																														</a-select>
																													</span>
														<a-button type="primary" style="margin-right: 5px;"
														          @click="searchStaff">查找
														</a-button>
														<a-button style="margin-right: 10px;" @click="resetStaff">清空
														</a-button>
													</div>
												</div>
												<a-spin tip="加载中..." size="large" :spinning="isLoading3">
													<a-table :columns="columns3" :dataSource="staffList"
													         :pagination="false"
													         :rowClassName="rowClassName">
														<div slot="name" slot-scope="text, record, index">
															<a-avatar v-if="record.avatar" shape="square" :size="42"
															          :src="record.avatar"
															          style="float: left;"/>
															<img style="width: 42px;height: 42px;float: left;"
															     v-if="!record.avatar"
															     src="../../../assets/useradvart.png"/>
															<div style="float: left;margin-left:10px;line-height: 42px;">
																{{text}}
															</div>
														</div>
														<span slot="real_num">
																											                  实际发送客户
																											                  <a-tooltip
																													                  placement="top">
																											                    <template
																													                    slot="title">
																											                      <span>客户已不是好友关系、客户接收已达上限、客户收到其他群发消息等其他原因，导致与预计人数不符</span>
																											                    </template>
																											                    <a-icon type="question-circle"
																											                            style="margin-left:5px;"/>
																											                  </a-tooltip>
																											                </span>
														<div slot="push_time" slot-scope="text, record, index">
															<div v-for="item in record.push_time">{{item}}</div>
														</div>
														<span slot="status" slot-scope="text, record, index">
																													<span v-if="record.status == 0">未发送</span>
																													<span v-if="record.status == 1">已发送</span>
															<span v-if="record.status == 2">排队发送</span>
																												</span>
													</a-table>
													<!--分页-->
													<div class="pagination"
													     style="width: 100%;position: absolute;margin: 20px 0px;"
													     v-show="total3 > 0">
														<div class="pagination" style="height: 32px;float: right;">
															<a-pagination :total="total3" showSizeChanger
															              :showQuickJumper="quickJumper3"
															              :current="page3"
															              :pageSize="pageSize3"
															              :pageSizeOptions="['15','30','50','100']"
															              @change="changePage3"
															              @showSizeChange="showSizeChange3"/>
														</div>
													</div>
												</a-spin>
											</a-tab-pane>
										</a-tabs>
										<a-tabs v-model="tabKey2" style="margin: 20px 0 ;" @change="changeTabKey2"
										        type="card" v-if="recordType == 2">
											<a-tab-pane :key="1" tab="群聊群发">
												<div style="margin: 0 0 20px 0;overflow: hidden;" class="record-draw">
													<div style="background-color: #FFFFFF;">
														<div style="height: 32px;line-height: 32px;margin-bottom: 10px;color: #000;">
															共
															<span style="color: blue">{{total4}}</span>个群聊
														</div>
														<span class="select-option">
																		<label style="margin-right: 5px;">搜索群聊：</label>
																		<a-input style="margin-right: 5px;width: 180px;"
																		         @keyup.enter="getGroupChat(1, pageSize2)"
																		         placeholder="请输入要搜索的群聊"
																		         v-model="groupChatName"/>
																	</span>
														<span class="select-option">
																		<label style="margin-right: 5px;width: 43px;">群主：</label>
																		<a-button @click="showDepartmentList(2)"
																		          style="width: 180px;margin-right: 5px;">
																			<span v-if="chooseStaffNum4 > 0">已选择{{chooseUserNum4}}名群主，{{chooseDepartmentNum4}}个部门</span>
																			<span v-else>选择群主</span>
																		</a-button>
																	</span>
														<span class="select-option">
																		<label style="margin-right: 5px;width: 100px;">消息送达状态：</label>
																		<a-select
																				showSearch
																				optionFilterProp="children"
																				placeholder="请选择消息送达状态"
																				style="width: 180px;margin-right: 5px;"
																				v-model="messageDeliveryStatus"
																		>
																			<a-select-option
																					:value="-1">全部</a-select-option>
																			<a-select-option
																					:value="0">未送达</a-select-option>
																			<a-select-option
																					:value="1">已送达</a-select-option>
																																						<a-select-option
																																								:value="3">未知原因导致失败</a-select-option>
																			<!--																			<a-select-option-->
																			<!--																					:value="3">客户接受已达上限</a-select-option>-->
																		</a-select>
																	</span>
														<a-button type="primary"
														          style="margin-right: 5px;"
														          @click="searchGroupChat">查找
														</a-button>
														<a-button style="margin-right: 10px;" @click="resetGroupChat">清空
														</a-button>
													</div>
												</div>

												<a-spin tip="加载中..." size="large" :spinning="isLoading4">
													<a-table :columns="columns4" :dataSource="groupChatList"
													         :pagination="false"
													         :rowClassName="rowClassName">
														<span slot="chatName" slot-scope="text, record, index">
															<span style="background: #01b065;width: 36px;height:36px;margin-right: 5px;vertical-align: top;border-radius: 4px;float: left;"
															      v-if="record.avatarData.length == 0">
									<img :src="chatImg"
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
											<span style="display: inline-block; max-width: 120px; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height: 42px;">
												{{record.name}}
											</span>
															</a-popover>
															<span v-if="!record.name">--</span>
															<span style="line-height: 42px;vertical-align: top;">（{{record.count}}）</span>
														</span>
														<span slot="send" slot-scope="text, record, index">
																	<span v-if="record.send == 0">未送达</span>
																	<span v-if="record.send == 1">已送达</span>
															<!--																	<span v-if="record.send == 2">客户已不是好友</span>-->
																	<span v-if="record.send == 3">未知原因导致失败</span>
																</span>
														<span slot="action" slot-scope="text, record, index">
																	<a-button style="margin: 0 5px 5px 0"
																	          @click="groupDetail(record.id)">群详情</a-button>
																</span>
													</a-table>
													<!--分页-->
													<div class="pagination"
													     style="width: 100%;position: absolute;margin: 20px 0px;"
													     v-show="total4 > 0">
														<div class="pagination" style="height: 32px;float: right;">
															<a-pagination :total="total4" showSizeChanger
															              :showQuickJumper="quickJumper4"
															              :current="page4"
															              :pageSize="pageSize4"
															              :pageSizeOptions="['15','30','50','100']"
															              @change="changePage4"
															              @showSizeChange="showSizeChange4"/>
														</div>
													</div>
												</a-spin>
											</a-tab-pane>
											<a-tab-pane :key="2" tab="群主确认">
												<div style="margin: 0 0 20px 0;overflow: hidden;" class="record-draw">
													<div style="background-color: #FFFFFF;">
														<div style="height: 32px;line-height: 32px;margin-bottom: 10px;color: #000;">
															共
															<span style="color: blue">{{total5}}</span>个群主
														</div>
														<span class="select-option">
																		<label style="margin-right: 5px;">群主：</label>
																		<a-button @click="showDepartmentList(3)"
																		          style="width: 210px;margin-right: 5px;">
																			<span v-if="chooseStaffNum5 > 0">已选择{{chooseUserNum5}}名群主，{{chooseDepartmentNum5}}个部门</span>
																			<span v-else>选择群主</span>
																		</a-button>
																	</span>
														<span class="select-option">
															<label style="margin-right: 5px;width: 100px;">群发发送状态：</label>				<a-select
																showSearch optionFilterProp="children"
																placeholder="请选择群发发送状态"
																style="width: 210px;margin-right: 5px;"
																v-model="groupDeliveryStatus">							<a-select-option
																:value="-1">全部</a-select-option>					<a-select-option
																:value="0">未发送</a-select-option>						<a-select-option
																:value="1">已发送</a-select-option>						</a-select>
														</span>
														<a-button type="primary" style="margin-right: 5px;"
														          @click="searchGroupLeaderConfirm">查找
														</a-button>
														<a-button style="margin-right: 10px;"
														          @click="resetGroupLeaderConfirm">清空
														</a-button>
													</div>
												</div>
												<a-spin tip="加载中..." size="large" :spinning="isLoading5">
													<a-table :columns="columns5" :dataSource="groupLeaderConfirmList"
													         :pagination="false"
													         :rowClassName="rowClassName">
														<span slot="push_num">							                  本次推送的群聊数								                  <a-tooltip
																placement="top">						                    <template
																slot="title">					                      <span>群主创建的群聊数</span>						</template>							                    <a-icon
																type="question-circle" style="margin-left:5px;"/>		                  </a-tooltip>
														</span>
														<span slot="real_num">							                  已发送群聊数
															<a-tooltip placement="top">
																<template slot="title">
																	<span>群主确认时，群主选择某些群进行发送的群聊数</span>
																</template>
																<a-icon type="question-circle"
																        style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="status" slot-scope="text, record, index">
															<span v-if="record.status == 0">未发送</span>
															<span v-if="record.status == 1">已发送</span>
														</span>
														<span slot="action" slot-scope="text, record, index">
																	<a-button style="margin: 0 5px 5px 0"
																	          @click="groupDetail(record.id)">群详情</a-button>
																</span>
													</a-table>
													<!--分页-->
													<div class="pagination"
													     style="width: 100%;position: absolute;margin: 20px 0px;"
													     v-show="total5 > 0">
														<div class="pagination" style="height: 32px;float: right;">
															<a-pagination :total="total5" showSizeChanger
															              :showQuickJumper="quickJumper5"
															              :current="page5"
															              :pageSize="pageSize5"
															              :pageSizeOptions="['15','30','50','100']"
															              @change="changePage5"
															              @showSizeChange="showSizeChange5"/>
														</div>
													</div>
												</a-spin>
											</a-tab-pane>
										</a-tabs>
									</div>
								</a-drawer>
							</a-spin>
						</div>
					</a-layout-content>

				</a-layout>
			</a-layout>
		</div>
		<!--部门选择框-->
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum1" :noticeTitle="noticeTitle"
		                  :is_from='from_chat'
		                  :callback="modalVisibleChange"></chooseDepartment>
		<!--群发详情弹窗-->
		<a-modal v-model="chatVisible" title="群发详情" class="msg-modal" :zIndex="9999" @cancel="handleCancel">
			<template slot="footer">
				<a-button key="back" @click="handleCancel">
					取消
				</a-button>
			</template>
			<div>
				<a-input-search placeholder="输入群名称" @input="groupDetail2(1)" v-model="groupName" style="width: 200px;"/>
				<a-select
						optionFilterProp="children"
						placeholder="请选择送达状态"
						style="width: 200px;margin-left: 20px;"
						v-model="send_status" :dropdownStyle="{'z-index':999999999}" @change="changeSendStatus"
						allowClear>
					<a-select-option :value="0">群主未发送</a-select-option>
					<a-select-option :value="1">群主已发送</a-select-option>
					<a-select-option :value="3">未知原因导致失败</a-select-option>
				</a-select>
			</div>
			<p style="margin-top: 1rem;">
				全部群聊{{total6}}个<span v-if="typeof send_status == 'object'">，其中群主发送{{chat_send_num}}个，未发{{chat_not_num}}个，未知原因导致失败{{chat_limit_num}}个：</span>
			</p>
			<div style="height: 300px;" class="chat-checkbox">
				<div style="width: 100%;display: inline-block;">
					<a-row v-for="item in chatList">
						<span style="background: #01b065;width: 36px;height:36px;margin-right: 8px;vertical-align: top;border-radius: 4px;float: left;"
						      v-if="item.avatarData.length == 0">
									<img :src="chatImg"
									     style="width: 20px;margin: 8px;height: 20px;"/>
								</span>
						<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 8px;vertical-align: top;border-radius: 4px;float: left;"
						      v-else-if="item.avatarData.length == 1">
									<img :src="item.avatarData[0]"
									     style="width: 36px;height:36px;"
									     v-if="item.avatarData[0] != ''"/>
									<img :src="img2" style="width: 36px;height:36px;"
									     v-if="item.avatarData[0] == ''"/>
								</span>
						<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 8px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
						      v-else-if="item.avatarData.length > 1 && item.avatarData.length <= 4">
									<template v-for="imgItem in item.avatarData">
										<img :src="imgItem"
										     style="width: 17px;height: 17px;" v-if="imgItem != ''"/>
										<img :src="img2" style="width: 17px;height: 17px;"
										     v-if="imgItem == ''"/>
									</template>
								</span>
						<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 8px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
						      v-else-if="item.avatarData.length > 4">
									<template v-for="imgItem in item.avatarData">
										<img :src="imgItem"
										     style="width: 10px;height: 10px;" v-if="imgItem != ''"/>
										<img :src="img2" style="width: 10px;height: 10px;"
										     v-if="imgItem == ''"/>
									</template>
								</span>
						<div style="display: inline-block;vertical-align: top;width: calc(100% - 180px);">
							<a-popover placement="topLeft">
								<template slot="content">
									{{item.name}}
								</template>
								<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
									{{item.name}}
								</div>
							</a-popover>
							<div v-if="!item.name || item.name == ''">--</div>
							<div>{{item.count}}/200</div>
						</div>
						<span style="float: right;line-height: 42px;" v-if="item.send == 0">群主未发送</span>
						<span style="float: right;line-height: 42px;" v-if="item.send == 1">群主已发送</span>
						<span style="float: right;line-height: 42px;" v-if="item.send == 3">未知原因导致失败</span>
					</a-row>
				</div>
				<div class="noMore" v-if="chatList.length < total6">正在加载</div>
				<div class="noMore" v-if="chatList.length == total6">没有更多了</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import MyIcon from "@/components/MyIcon.vue"
	import moment from 'moment'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import chatImg from '../../../assets/chat.png'
	import img2 from '../../../assets/useradvart.png'
	import axios from "axios";
	import {message} from "ant-design-vue";

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	const columns = [
		{
			title      : "群发消息",
			dataIndex  : "title2",
			key        : "title2",
			scopedSlots: {customRender: "title2"}
		},
		{
			title    : "发送类型",
			dataIndex: "type",
			key      : "type",
			width    : 100,
		},
		// {
		// 	title      : "群发内容",
		// 	dataIndex  : "content",
		// 	key        : "content",
		// 	scopedSlots: {customRender: "content"}
		// },
		{
			title      : "成员确认",
			dataIndex  : "send_people",
			key        : "send_people",
			scopedSlots: {customRender: "send_people"}
		},
		{
			title      : "预计投放总金额",
			dataIndex  : "redpacket_amount",
			key        : "redpacket_amount",
			scopedSlots: {customRender: "redpacket_amount"}
		},
		{
			title      : "已领取金额/人数",
			dataIndex  : "send_amount",
			key        : "send_amount",
			scopedSlots: {customRender: "send_amount"}
		},
		{
			title    : "间隔发放",
			dataIndex: "inter_name",
			key      : "inter_name",
		},
		{
			title      : "发送情况",
			dataIndex  : "will_num",
			key        : "will_num",
			scopedSlots: {customRender: "will_num"}
		},
		// {
		// 	title    : "创建时间",
		// 	dataIndex: "create_time",
		// 	key      : "create_time",
		// },
		{
			// title      : "发送状态",
			dataIndex  : "status",
			key        : "status",
			width      : '120px',
			scopedSlots: {customRender: "status"},
			slots      : {title: "status2"},
		},
		{
			// title    : "发送时间",
			dataIndex  : "push_time",
			key        : "push_time",
			width      : 120,
			scopedSlots: {customRender: "push_time"},
			slots      : {title: "push_time2"},
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : "13%",
			scopedSlots: {customRender: "action"}
		}
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
			title    : '送达时间',
			dataIndex: "push_time",
			key      : "push_time"
		},
		{
			title      : '送达状态',
			dataIndex  : "send",
			key        : "send",
			scopedSlots: {customRender: 'send'}
		},
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
			title      : '排队发送时间',
			dataIndex  : "push_time",
			key        : "push_time",
			scopedSlots: {customRender: 'push_time'}
		},
		{
			title      : '发送状态',
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: 'status'}
		},
	];
	const columns4 = [
		{
			title      : '群聊名称（人数）',
			dataIndex  : "chatName",
			key        : "chatName",
			width      : 300,
			scopedSlots: {customRender: 'chatName'}
		},
		{
			title    : '群主',
			dataIndex: "user_name",
			key      : "user_name"
		},
		{
			title    : '送达时间',
			dataIndex: "push_time",
			key      : "push_time"
		},
		{
			title      : '消息送达状态',
			dataIndex  : "send",
			key        : "send",
			scopedSlots: {customRender: 'send'}
		},
		// {
		// 	title    : '群聊创建时间',
		// 	dataIndex: "create_time",
		// 	key      : "create_time"
		// },
		// {
		// 	title      : '操作',
		// 	dataIndex  : "action",
		// 	key        : "action",
		// 	scopedSlots: {customRender: 'action'}
		// },
	];
	const columns5 = [
		{
			title    : '群主',
			dataIndex: "user_name",
			key      : "user_name",
		},
		{
			// title    : '本次推送的群聊数',
			dataIndex: "push_num",
			key      : "push_num",
			slots    : {title: "push_num"},
		},
		{
			// title      : '已发送群聊数',
			dataIndex: "real_num",
			key      : "real_num",
			slots    : {title: "real_num"},
		},
		{
			title      : '群发发送状态',
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: 'status'}
		},
		{
			title      : '操作',
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: 'action'}
		},
	];

	export default {
		name      : "massMessageList",
		components: {MyIcon, chooseDepartment},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				chatImg,
				img2,
				corpLen              : JSON.parse(localStorage.getItem('corpArr')).length,
				corpInfo             : [], //企业微信列表
				suite_id             : 1,//应用ID
				corpId               : corpId,//企业微信选中的id
				sendStatus           : "-1",
				sendType             : 0,//发送类型
				messageText          : '',//搜索欢迎语输入框内容
				messageList          : [],//欢迎语表格数组
				sendDate             : null,//发送时间
				isLoading            : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				//分页
				total                : 0, //总条数
				quickJumper          : false, // 是否显示快速跳转的控件
				page                 : 1, //页码
				page_size            : 15, //每页数据量，默认15
				pageSize             : 15, //每页数据条数
				visible              : false,//详情页面的显示与隐藏
				add_type             : 0,//详情类型，1图片2网页3小程序0都没有
				validity             : 1,
				isRedpacket          : 0,
				rule                 : {
					rule_pic_url: '',
					rule_title  : '呼朋唤友，免费拿奖品',
					rule_des    : '好友，你可以帮我打个Call吗？'
				},
				index                : 0,
				typeValue            : 2,
				text                 : '',
				img                  : '',//选中的图片素材url
				modalUrlOk           : false,
				msgUrl               : '',//网址封面选好的url
				inputTitle           : '',//网址输入标题
				digest               : '',//网址输入描述
				url                  : '',//网址输入的网址
				modalAppletOk        : false,
				appletUrl            : '',//小程序的封面链接
				appletInputTitle     : '',//小程序的标题
				appid                : '',//小程序的appid
				pageUrl              : '',//小程序page路径
				commonUrl            : this.$store.state.commonUrl, //公共的链接
				fileName             : '',
				playerOptions        : {
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
				//群发记录抽屉
				recordVisible        : false,//群发记录抽屉的显示与隐藏
				recordType           : 1,//发送类型，1客户，2客户群
				tabKey               : 1,//客户tab切换
				tabKey2              : 1,//客户群tab切换
				drawerTitle          : '',//标题
				user_ids             : [],//成员群发人员
				will_num             : 0,//预计发送人数
				others               : {},//其他的筛选条件
				send_num             : 0,//已送达
				not_num              : 0,//未送达
				limit_num            : 0,//达到上限
				fail_num             : 0,//因不是好友失败人数
				all_get_money        : 0,// 已领取金额
				all_get_num          : 0,// 已领取人数
				all_money            : 0,// 总投放金额
				all_not_get_money    : 0,// 未领取金额
				all_not_get_num      : 0,// 未领取人数
				//群发记录
				massMessageRecordList: [],//群发记录表格数据
				columns2,
				customName           : '',//搜索的客户名称
				deliveryStatus       : -1,//送达状态
				//所属成员
				showModalDepartment  : false, //成员选择框显示与隐藏
				from_chat            : 0,//客户群传给组件的值8，其他都是0
				chooseNum1           : 0,//传给组件的值
				chooseType           : '',//选择成员组件的打开类型
				chooseStaffNum       : 0,//已选择的部门成员总个数
				chooseUserNum        : 0,//成员个数
				chooseDepartmentNum  : 0,//部门个数
				checkedList          : [],//选择的成员id数组
				//分页
				total2               : 0, //总条数
				quickJumper2         : false, // 是否显示快速跳转的控件
				page2                : 1, //页码
				pageSize2            : 15, //每页数据条数
				isLoading2           : false,//loading组件的显示与隐藏
				//成员确认
				columns3,
				isLoading3           : false,//加载的显示与隐藏
				staffName            : '',//搜索的成员名称
				staffSendStatus      : -1,//发送状态
				staffList            : [],//成员邀请表格数据
				//分页
				total3               : 0, //总条数
				quickJumper3         : false, // 是否显示快速跳转的控件
				page3                : 1, //页码
				pageSize3            : 15, //每页数据条数

				//群聊群发
				groupChatList         : [],//群聊群发表格数据
				columns4,
				groupChatName         : '',//搜索的群聊名称
				messageDeliveryStatus : -1,//消息送达状态
				//群主
				noticeTitle           : '',//选择部门成员弹窗的提示语
				chooseStaffNum4       : 0,//已选择的部门成员总个数
				chooseUserNum4        : 0,//成员个数
				chooseDepartmentNum4  : 0,//部门个数
				checkedList4          : [],//选择的成员id数组
				//分页
				total4                : 0, //总条数
				quickJumper4          : false, // 是否显示快速跳转的控件
				page4                 : 1, //页码
				pageSize4             : 15, //每页数据条数
				isLoading4            : false,//loading组件的显示与隐藏
				//群主确认
				groupLeaderConfirmList: [],//群聊群发表格数据
				columns5,
				chooseStaffNum5       : 0,//已选择的部门成员总个数
				chooseUserNum5        : 0,//成员个数
				chooseDepartmentNum5  : 0,//部门个数
				checkedList5          : [],//选择的成员id数组
				groupDeliveryStatus   : -1,//消息送达状态
				//分页
				total5                : 0, //总条数
				quickJumper5          : false, // 是否显示快速跳转的控件
				page5                 : 1, //页码
				pageSize5             : 15, //每页数据条数
				isLoading5            : false,//loading组件的显示与隐藏

				//群发详情弹窗
				chatVisible   : false,//弹窗的显示与隐藏
				chatList      : [],//群聊列表
				page6         : 1,//群聊的页码
				total6        : 0,//群聊总数
				cancelFlag    : false,
				groupName     : '',//群名称
				send_status   : [],//送达状态
				chatId        : '',//群发详情操作的id
				chat_send_num : 0,//已发送人数
				chat_not_num  : 0,//未发送人数
				chat_limit_num: 0,//上限人数
			};
		},

		methods: {
			moment,
			handleChange (value) {
				this.corpId = value
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 时间限制
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			//点击搜索
			find () {
				this.isLoading = true
				this.getMessageList()
			},
			//点击清空
			clear () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.isLoading = true
				this.sendStatus = '-1'
				this.sendType = 0
				this.sendDate = null
				this.messageText = ''
				this.getMessageList()
			},
			// 新建标签
			addMessageText () {
				this.$router.push('/massMessage/add')
			},
			//获取表格内容
			async getMessageList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-group-sending/list", {
					stime    : this.sendDate == null ? '' : (this.sendDate.length > 0 ? moment(this.sendDate[0]).format('YYYY-MM-DD HH:mm') : ''),
					etime    : this.sendDate == null ? '' : (this.sendDate.length > 1 ? moment(this.sendDate[1]).format('YYYY-MM-DD HH:mm') : ''),
					status   : this.sendStatus,
					title    : this.messageText,
					suite_id : this.suite_id,
					corp_id  : this.corpId,
					send_type: this.sendType,
					page     : page,
					pageSize : pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.messageList = res.data.info;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getMessageList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 140)
				})
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getMessageList(1, pageSize);
			},
			//详情
			handleShowDetail (id) {
				this.detail(id, 1)
			},
			async detail (id, type) {
				this.onClose()
				const {data: res} = await this.axios.post("work-group-sending/detail", {
					id: id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.fileName = res.data.file_name
					this.text = res.data.text_content
					this.drawerTitle = res.data.title
					this.user_ids = res.data.others.user_ids
					this.others = res.data.others
					this.will_num = res.data.will_num
					this.send_num = res.data.send_num
					this.not_num = res.data.not_num
					this.limit_num = res.data.limit_num
					this.fail_num = res.data.fail_num
					this.all_get_money = res.data.all_get_money
					this.all_get_num = res.data.all_get_num
					this.all_money = res.data.all_money
					this.all_not_get_money = res.data.all_not_get_money
					this.all_not_get_num = res.data.all_not_get_num

					this.isRedpacket = res.data.is_redpacket
					this.rule = {
						rule_pic_url: res.data.rule_pic_url,
						rule_title  : res.data.rule_title,
						rule_des    : res.data.rule_des
					}
					if (res.data.send_type == 3) {
						this.validity = 2
						this.typeValue = res.data.msg_type
					} else {
						this.validity = 1
						this.index = res.data.add_type
					}
					if (res.data.msg_type == 2 || res.data.add_type == 1) {
						this.img = res.data.image_url
						this.fileName = res.data.file_name
					} else if (res.data.msg_type == 5 || res.data.add_type == 2) {
						this.msgUrl = res.data.link_pic_url
						this.inputTitle = res.data.link_title
						this.digest = res.data.link_desc
						this.url = res.data.link_url
						this.modalUrlOk = true
					} else if (res.data.msg_type == 6 || res.data.add_type == 3) {
						this.modalAppletOk = true
						this.appletInputTitle = res.data.mini_title
						this.appletUrl = res.data.mini_pic_url
						this.appid = res.data.mini_appid
						this.pageUrl = res.data.mini_page
					}
					if (type && type == 1) {
						this.visible = true;
					}
				}
			},
			onClose () {
				this.visible = false;
				this.text = ''
				this.img = ''
				this.modalUrlOk = false
				this.msgUrl = ''
				this.inputTitle = ''
				this.digest = ''
				this.url = ''
				this.modalAppletOk = false
				this.appletUrl = ''
				this.appletInputTitle = ''
				this.appid = ''
				this.pageUrl = ''
			},
			getUserNum (userList) {
				let num = 0
				for (let i = 0; i < userList.length; i++) {
					if (userList[i].scopedSlots.title == "custom") {
						num++
					}
				}
				return num
			},
			//编辑
			editList (id) {
				this.$router.push({path: "/massMessage/add", query: {id: id}});
			},
			//删除
			deleteList (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该消息？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.delMessage(id);
					}
				});
			},
			async delMessage (id) {
				const {data: res} = await this.axios.post("work-group-sending/delete", {
					id: id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					if (this.page > 1 && this.messageList.length == 1) {
						this.getMessageList(this.page - 1, this.pageSize)
					} else {
						this.getMessageList(this.page, this.pageSize)
					}

				}
			},
			//刷新
			refresh () {
				this.isLoading = true
				message.info("已进入后台刷新中，请耐心等待...", 2, this.refresh2)
			},
			async refresh2 () {
				const {data: res} = await this.axios.post("work-group-sending/refresh-data", {
					corp_id: this.corpId
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg)
				} else {
					this.$message.destroy()
					this.getMessageList();
				}
			},
			//群发记录
			sendRecord (id, type) {
				this.detailId = id
				this.detail(id)
				if (type == '客户') {
					this.recordType = 1
					this.tabKey = 1
					this.customName = ''
					this.checkedList = []
					this.chooseStaffNum = 0
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					this.deliveryStatus = -1
					this.massMessageRecordList = []
					this.total2 = 0
					this.page2 = 1
					this.pageSize2 = 15
					this.staffName = ''
					this.staffSendStatus = -1
					this.staffList = []
					this.total3 = 0
					this.page3 = 1
					this.pageSize3 = 15
					this.getMassMessageRecord()
				} else if (type == '客户群') {
					this.recordType = 2
					this.tabKey2 = 1
					this.groupChatName = ''
					this.messageDeliveryStatus = -1
					this.checkedList4 = []
					this.chooseStaffNum4 = 0
					this.chooseUserNum4 = 0
					this.chooseDepartmentNum4 = 0
					this.groupChatList = []
					this.total4 = 0
					this.page4 = 1
					this.pageSize4 = 15
					this.checkedList5 = []
					this.chooseStaffNum5 = 0
					this.chooseUserNum5 = 0
					this.chooseDepartmentNum5 = 0
					this.groupLeaderConfirmList = []
					this.total5 = 0
					this.page5 = 1
					this.pageSize5 = 15
					this.getGroupChat()
				}
			},
			recordDrawerClose () {
				this.recordVisible = false
			},
			getUserNum (userList) {
				let num = 0
				for (let i = 0; i < userList.length; i++) {
					if (userList[i].scopedSlots.title == "custom") {
						num++
					}
				}
				return num
			},
			//改变客户tab
			changeTabKey (e) {
				if (e == 1) {
					this.getMassMessageRecord()
				} else if (e == 2) {
					this.getStaffList()
				}
			},
			//改变客户群tab
			changeTabKey2 (e) {
				if (e == 1) {
					this.getGroupChat()
				} else if (e == 2) {
					this.getGroupLeaderConfirm()
				}
			},
			//部门选择弹窗组件
			showDepartmentList (type) {
				this.chooseType = type
				if (type == 1) {
					//所属成员
					this.noticeTitle = ''
					this.chooseNum1 = this.chooseStaffNum
					this.from_chat = 0
					let arr = []
					this.checkedList.map(x => {
						arr.push(x.id)
					})
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
				} else if (type == 2) {
					//群主
					this.noticeTitle = ''
					this.chooseNum1 = this.chooseStaffNum4
					this.from_chat = 0
					let arr = []
					this.checkedList4.map(x => {
						arr.push(x.id)
					})
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList4))
				} else if (type == 3) {
					//群主
					this.noticeTitle = ''
					this.chooseNum1 = this.chooseStaffNum5
					this.from_chat = 0
					let arr = []
					this.checkedList5.map(x => {
						arr.push(x.id)
					})
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList5))
				}
				this.showModalDepartment = true
			},
			modalVisibleChange (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.chooseType == 1) {
						this.chooseStaffNum = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum = userNum
						this.chooseDepartmentNum = departmentNum
						if (this.chooseStaffNum > 0) {
							this.checkedList = list
						}else {
							this.checkedList = []
						}
					} else if (this.chooseType == 2) {
						this.chooseStaffNum4 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum4 = userNum
						this.chooseDepartmentNum4 = departmentNum
						if (this.chooseStaffNum4 > 0) {
							this.checkedList4 = list
						}else {
							this.checkedList4 = []
						}
					} else if (this.chooseType == 3) {
						this.chooseStaffNum5 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum5 = userNum
						this.chooseDepartmentNum5 = departmentNum
						if (this.chooseStaffNum5 > 0) {
							this.checkedList5 = list
						}else {
							this.checkedList5 = []
						}
					}
				}
				this.showModalDepartment = false
			},
			//群发记录表格
			async getMassMessageRecord (page = 1, pageSize = this.pageSize2) {
				this.isLoading2 = true
				let userIds = []
				for (let i = 0; i < this.checkedList.length; i++) {
					userIds.push(this.checkedList[i].id)
				}
				const {data: res} = await this.axios.post("work-group-sending/group-sending-customer-records", {
					id      : this.detailId,
					corp_id : this.corpId,
					name    : this.customName,
					user_ids: userIds,
					send    : this.deliveryStatus,
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
					this.recordVisible = true
					this.isLoading2 = false
				}
			},
			//查找群发记录
			searchRecord () {
				this.getMassMessageRecord()
			},
			resetRecord () {
				this.customName = ''
				this.checkedList = []
				this.chooseStaffNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.deliveryStatus = -1
				this.getMassMessageRecord()
			},
			// 群发记录分页
			changePage2 (page, pageSize) {
				this.getMassMessageRecord(page, pageSize);
			},
			showSizeChange2 (page, pageSize) {
				this.getMassMessageRecord(1, pageSize);
			},
			//成员确认表格
			async getStaffList (page = 1, pageSize = this.pageSize3) {
				this.isLoading3 = true
				const {data: res} = await this.axios.post("work-group-sending/customer-members", {
					id       : this.detailId,
					user_name: this.staffName,
					status   : this.staffSendStatus,
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
			//查找成员确认
			searchStaff () {
				this.getStaffList()
			},
			resetStaff () {
				this.staffName = ''
				this.staffSendStatus = -1
				this.getStaffList()
			},
			// 成员确认分页
			changePage3 (page, pageSize) {
				this.getStaffList(page, pageSize);
			},
			showSizeChange3 (page, pageSize) {
				this.getStaffList(1, pageSize);
			},

			//群聊群发
			async getGroupChat (page = 1, pageSize = this.pageSize2) {
				this.isLoading4 = true
				let userIds = []
				for (let i = 0; i < this.checkedList4.length; i++) {
					userIds.push(this.checkedList4[i].id)
				}
				const {data: res} = await this.axios.post("work-group-sending/group-sending-chat-records", {
					id      : this.detailId,
					corp_id : this.corpId,
					name    : this.groupChatName,
					user_ids: userIds,
					send    : this.messageDeliveryStatus,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupChatList = res.data.info
					this.total4 = parseInt(res.data.count);
					this.page4 = page;
					this.pageSize4 = pageSize;
					this.quickJumper4 = this.total4 > this.pageSize4;
					this.recordVisible = true
					this.isLoading4 = false
				}
			},
			//查找群聊群发
			searchGroupChat () {
				this.getGroupChat()
			},
			resetGroupChat () {
				this.groupChatName = ''
				this.checkedList4 = []
				this.chooseStaffNum4 = 0
				this.chooseUserNum4 = 0
				this.chooseDepartmentNum4 = 0
				this.messageDeliveryStatus = -1
				this.getGroupChat()
			},
			// 群聊群发分页
			changePage4 (page, pageSize) {
				this.getGroupChat(page, pageSize);
			},
			showSizeChange4 (page, pageSize) {
				this.getGroupChat(1, pageSize);
			},
			//群主确认表格
			async getGroupLeaderConfirm (page = 1, pageSize = this.pageSize2) {
				this.isLoading5 = true
				let userIds = []
				for (let i = 0; i < this.checkedList5.length; i++) {
					userIds.push(this.checkedList5[i].id)
				}
				const {data: res} = await this.axios.post("work-group-sending/chat-members", {
					id      : this.detailId,
					corp_id : this.corpId,
					user_ids: userIds,
					status  : this.groupDeliveryStatus,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupLeaderConfirmList = res.data.info
					this.total5 = parseInt(res.data.count);
					this.page5 = page;
					this.pageSize5 = pageSize;
					this.quickJumper5 = this.total5 > this.pageSize5;
					this.isLoading5 = false
				}
			},
			//查找群主确认
			searchGroupLeaderConfirm () {
				this.getGroupLeaderConfirm()
			},
			resetGroupLeaderConfirm () {
				this.checkedList5 = []
				this.chooseStaffNum5 = 0
				this.chooseUserNum5 = 0
				this.chooseDepartmentNum5 = 0
				this.groupDeliveryStatus = -1
				this.getGroupLeaderConfirm()
			},
			// 群主确认分页
			changePage5 (page, pageSize) {
				this.getGroupLeaderConfirm(page, pageSize);
			},
			showSizeChange5 (page, pageSize) {
				this.getGroupLeaderConfirm(1, pageSize);
			},
			//群详情
			groupDetail (id) {
				this.chatId = id
				this.groupDetail2()
			},
			//改变送达状态
			changeSendStatus (e) {
				if (typeof e == 'undefined') {
					this.send_status = []
				}
				this.groupDetail2()
			},
			async groupDetail2 (page = 1) {
				this.cancelFlag = true
				const {data: res} = await this.axios.post("work-group-sending/chat-info", {
					id       : this.detailId,
					user_id  : this.chatId,
					user_name: this.groupName,
					send     : this.send_status,
					page     : page,
					pageSize : 15
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.chatVisible = true
					this.cancelFlag = false
					this.chat_send_num = res.data.send_num
					this.chat_not_num = res.data.not_num
					this.chat_limit_num = res.data.limit_num
					this.total6 = parseInt(res.data.count);
					this.page6 = page;
					if (this.page6 == 1) {
						this.chatList = res.data.info
						this.$nextTick(() => {
							let that = this
							let msgModalBody = document.getElementsByClassName('msg-modal')[0].getElementsByClassName('ant-modal-body')[0]
							msgModalBody.onscroll = function () {
								//变量scrollTop是滚动条滚动时，距离顶部的距离
								let scrollTop = msgModalBody.scrollTop;
								//变量windowHeight是可视区的高度
								let windowHeight = msgModalBody.clientHeight || document.body.clientHeight;
								//变量scrollHeight是滚动条的总高度
								let scrollHeight = msgModalBody.scrollHeight || document.body.scrollHeight;
								//滚动条到底部的条件
								if (scrollTop + windowHeight == scrollHeight) {
									if (Math.ceil(that.total6 / 15.0) > that.page6) {
										that.groupDetail2(that.page6 + 1)
									}
								}
							}
						})
					} else {
						this.chatList = this.chatList.concat(res.data.info)
					}
				}
			},
			handleCancel () {
				if (this.cancelFlag) {
					source.cancel()
				}
				this.groupName = ''
				this.send_status = []
				this.chatList = []
				this.chatVisible = false
			},
		},

		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.getMessageList()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/massMessage/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					// 编辑回来
					vm.getMessageList(vm.page, vm.pageSize)
				});
			} else {
				next(vm => {
					// 因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
					vm.sendStatus = '-1'
					vm.messageText = ''
					vm.sendType = 0
					vm.sendDate = null
					vm.page = 1
					vm.pageSize = 15
					vm.getMessageList()
				});
			}
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
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.content-hd {
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

	.btn-primary {
		/*width: 145px;*/
		/*height: 30px;*/
		margin-left: 20px;
		/*text-align: left;*/
		/*padding: 0;*/

		/*span {*/
		/*	display: inline-block;*/
		/*	width: 90px;*/
		/*	height: 30px;*/
		/*	line-height: 30px;*/
		/*	text-align: center;*/
		/*}*/
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

	.msg_content {
		border: 1px solid #E2D6D6;
		height: 100%;
		width: 420px;
		margin: auto;
		overflow-y: auto;

		.msg_content_header {
			width: 100%;
		}
	}

	.msg_content_txt {
		/*float: right;*/
		display: inline-block;
		width: 340px;
		border: 1px solid #E9E9E9;
		line-height: 21px;
		padding: 15px;
		overflow-wrap: break-word;
		hyphens: auto;
		background: #FFF;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	.msg_content_txt2 {
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

	.wrap {
		border: 1px solid #E2D6D6;
		height: 100%;
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
		margin: 5px 0px 0px 10px;
		width: 440px;
	}

	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
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
		font-size: 22px;
		margin-bottom: 0;
		line-height: 60px;
	}

	.single-accout-cardItem-title {
		margin-bottom: 0;
		text-align: center;
	}

	.record-draw .select-option {
		display: inline-block;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.record-draw .select-option label {
		display: inline-block;
		text-align: left;
		width: 70px;
	}

	/deep/ .ant-tabs-bar {
		background: none;
		border-bottom: 2px solid #F5F5F5;
	}

	.noMore {
		text-align: center;
		padding: 10px 0;
		font-size: 12px;
		color: #999;
	}

	.chat-checkbox /deep/ .ant-row {
		width: 100%;
		border-bottom: 1px dashed #E9E9E9;
		padding: 10px 0;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 90px;
		margin: 0px;
		text-align: center;
	}

	/deep/ .ant-collapse-arrow svg {
		color: #01b065;
		width: 20px;
		height: 20px;
		/*display: none !important;*/
	}

	/deep/ .ant-collapse, /deep/ .ant-collapse-content, /deep/ .ant-collapse-item {
		background: @color-bgc;
		border: 0px;
	}

	/deep/ .ant-collapse-content {
		color: rgba(0, 0, 0, 0.85);
	}

	/deep/ .ant-collapse-content-box {
		padding: 4px 16px 0 16px;
	}

	/deep/ .ant-collapse-header {
		background: @color-bgc;
		border: 0px;
		padding: 0 16px !important;
	}
</style>
