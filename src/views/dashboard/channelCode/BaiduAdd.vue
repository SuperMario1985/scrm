<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="加载中..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="typeof urlId == 'undefined'">新建</template>
						<template v-if="typeof urlId != 'undefined'">修改</template>
						百度统计
						<a-button type="primary"  @click="goBack"
						          style="float: right;margin-top: 9px;">返回列表
						</a-button>
					</a-layout-header>

					<a-layout class="fans-content">
						<!-- 左侧 -->
						<a-layout-sider>
							<div class="wrap left-sider-content">
								<img src="../../../assets/wxHeader.png" alt
								     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
								<div class="msg_content_body">
									<!--文本-->
									<div v-if="textAreaValueHeader && pushValue" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<span v-html="textAreaValueHeader" class="item-info msg_content_txt"
										     style="display:block;white-space: pre-wrap;word-wrap: break-word;"></span>
									</div>
									<!--图片-->
									<div v-if="img && pushValue" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;object-fit: cover;"/>
										<img :src="commonUrl+img" alt
										     style="width: 150px;border-radius: 4px;"/>
									</div>
									<!--网址-->
									<div v-if="modalUrlOk && pushValue" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<div class="item-info msg_content_txt">
											<p class="url-title">{{inputTitle}}</p>
											<div style="overflow: hidden;">
												<div class="url-text">{{digest}}</div>
												<img :src="commonUrl+msgUrl" alt=""
												     style="float: right;width: 64px;height: 64px;object-fit: cover;">
											</div>
										</div>
									</div>
									<!--小程序-->
									<div v-if="modalAppletOk && pushValue" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<div class="item-info msg_content_txt">
											<p class="applet-title">{{appletInputTitle}}</p>
											<img :src="commonUrl+appletUrl" alt=""
											     style="width: 100%;object-fit: cover;">
										</div>
									</div>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- <a-spin tip="加载中..." size="large" :spinning="isLoading"></a-spin> -->
								<!-- 公众号选择 -->
								<div class="content-hd">
									<a-form>
										<a-form-item v-if="$store.state.corpArr.length > 1" label="选择企业微信" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template>
												<div style="display: inline-block;cursor: pointer;" @click="add">
													<img src="../../../assets/WeChatLogo.png" alt=""
													     style="width: 24px;border-radius: 4px;">
													<span style="margin-left: 5px;">{{$store.state.corpName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
													        v-if="typeof urlId=='undefined'"/>
												</div>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</template>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd">
									<a-form>
										<!-- 二维码名称 -->
										<a-form-item label="活码名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             style="padding-top: 15px;">
											<a-input v-model="info.title" placeholder="如：扫码送试用装01，限30字符" :maxLength="30"
											         style="width: 60%;"
											         :disabled="typeof urlId=='undefined'?false:true"/>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{info.title === null ? 0 : info.title.length}} / 30</span>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦创建，不可修改）</span>
										</a-form-item>
<!--										<a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"-->
<!--										             style="padding-top: 15px;">-->
<!--											<a-input v-model="info.remark" placeholder="如：扫码送试用装01，限15字符"-->
<!--											         :maxLength="15"-->
<!--											         style="width: 60%;"/>-->
<!--											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{info.remark === null ? 0 : info.remark.length}} / 15</span>-->
<!--										</a-form-item>-->
										<!-- 类型 -->
										<a-form-item label="类型" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<a-radio-group name="typeGroup" v-model="info.type"
											               @change="changeInfoType"
											               :disabled="typeof urlId=='undefined'?false:true">
												<a-radio :value="1">单人</a-radio>
												<a-radio :value="2">多人</a-radio>
											</a-radio-group>
											<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
										</a-form-item>
										<!-- 是否需要验证 -->
										<a-form-item label="添加验证" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-radio-group name="sceneGroup" v-model="info.skip_verify">
												<a-radio :value="1">需验证</a-radio>
												<a-radio :value="0">直接通过</a-radio>
											</a-radio-group>
											<span style="color: #F56C6C;">（客户添加时无需企业成员确认，自动成为好友）</span>
										</a-form-item>
										<!-- 排班 -->
										<a-form-item label="企业成员" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<div>
												<a-button
														v-show="info.specialWeekList[0].mon.length == 0 || info.specialWeekList[0].tues.length == 0 || info.specialWeekList[0].wednes.length == 0 || info.specialWeekList[0].thurs.length == 0 || info.specialWeekList[0].fri.length == 0 || info.specialWeekList[0].satur.length == 0 || info.specialWeekList[0].sun.length == 0 "
														@click="addSpecialTime" >
													添加
												</a-button>
												<!--												<a-icon @click="addSpecialTime" style="font-size: 20px;cursor: pointer;"-->
												<!--												        type="plus"/>-->
											</div>
										</a-form-item>
										<a-form-item>
											<a-table
													:columns="specialWeekColumns"
													:dataSource="info.specialWeekList"
													:pagination="false"
													:rowClassName="rowClassName"
													style="max-width: 92%;margin-left: 6%;"
											>
												<span slot="mon">
													周一<a-icon type="edit" @click='editSpecialTime("mon")'
													          v-if="info.specialWeekList[0].mon.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="tues">
													周二<a-icon type="edit" @click='editSpecialTime("tues")'
													          v-if="info.specialWeekList[0].tues.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="wednes">
													周三<a-icon type="edit" @click='editSpecialTime("wednes")'
													          v-if="info.specialWeekList[0].wednes.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="thurs">
													周四<a-icon type="edit" @click='editSpecialTime("thurs")'
													          v-if="info.specialWeekList[0].thurs.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="fri">
													周五<a-icon type="edit" @click='editSpecialTime("fri")'
													          v-if="info.specialWeekList[0].fri.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="satur">
													周六<a-icon type="edit" @click='editSpecialTime("satur")'
													          v-if="info.specialWeekList[0].satur.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="sun">
													周日<a-icon type="edit" @click='editSpecialTime("sun")'
													          v-if="info.specialWeekList[0].sun.length != 0"
													          style="cursor: pointer"/>
												</span>
												<span slot="mon" slot-scope="text, record, index">
													<div v-for="item in record.mon" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.mon" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div>
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user, userid) in user"
																	                 :key="user.id">
																		{{user.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.mon.length == 0">--</div>
												</span>
												<span slot="tues" slot-scope="text, record, index">
													<div v-for="item in record.tues" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.tues" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div>
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user, userid) in user"
																	                 :key="user.id">
																		{{user.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.tues.length == 0">--</div>
												</span>
												<span slot="wednes" slot-scope="text, record, index">
													<div v-for="item in record.wednes" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.wednes" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div>
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user, userid) in user"
																	                 :key="user.id">
																		{{user.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.wednes.length == 0">--</div>
												</span>
												<span slot="thurs" slot-scope="text, record, index">
													<div v-for="item in record.thurs" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.thurs" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div>
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user, userid) in user"
																	                 :key="user.id">
																		{{user.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.thurs.length == 0">--</div>
												</span>
												<span slot="fri" slot-scope="text, record, index">
													<div v-for="item in record.fri" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.fri" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div>
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user, userid) in user"
																	                 :key="user.id">
																		{{user.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.fri.length == 0">--</div>
												</span>
												<span slot="satur" slot-scope="text, record, index">
													<div v-for="item in record.satur" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.satur" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div>
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user, userid) in user"
																	                 :key="user.id">
																		{{user.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.satur.length == 0">--</div>
												</span>
												<span slot="sun" slot-scope="text, record, index">
													<div v-for="item in record.sun" v-if="info.type == 2">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in item.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</div>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<div>
																	<template v-for="(user, index) in item.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
																</div>
															</a-tooltip>
														</div>
													</div>
													<div v-for="item in record.sun" v-if="info.type == 1">
														<div>
															{{item.start_time}}~{{item.end_time}}
															<div>
																<a-select showSearch optionFilterProp="children"
																          :disabled="true"
																          :showArrow="false"
																          :mode="info.type == 1 ? 'default' : 'multiple'"
																          v-model="item.userList"
																          style="width: 100%"
																          placeholder="请选择企业成员"
																>
																	<a-select-option v-for="(user, userid) in user"
																	                 :key="user.id">
																		{{user.name}}
																	</a-select-option>
																</a-select>
															</div>
														</div>
													</div>
													<div v-if="record.sun.length == 0">--</div>
												</span>
											</a-table>
										</a-form-item>
										<a-form-item style="margin-left: 12.67%">
											<label style="margin-right: 20px;">特殊时期：</label>
											<a-switch :checked="info.specialTime == 1 ? true:false"
											          @click="changeSpecilTime()"/>
											<span style="color: #F56C6C;margin-left: 10px;">如遇到国家节假日或是企业自身重要日子，在特殊时期内，需要更换活码成员</span>
											<div style="background-color: white;padding: 10px 20px; width: 560px; border: 1px solid #D8D8D8;"
											     v-show="info.specialTime == 1">
												<div class="content-msg">
													<p style="margin-bottom: 2px;line-height: 20px;">
														1、系统默认生成一条每日24小时（00:00~00:00）数据，当时间点不在所新增的时段内，客户扫码后，添加的是“24小时”的企业成员。
													</p>
													<p style="margin-bottom: 0px;line-height: 20px;color: #FF562D" v-if="info.type == 2">
														2、渠道活码设置部门时，请确保设置的部门具有外部联系人权限，否则会导致该区间段的活码设置失效。
													</p>
												</div>
												<div v-for="(item, index) in info.specialDateList"
												     style="padding: 10px 10px 40px 10px;"
												     :class="index!=info.specialDateList.length - 1 ? 'border-dashed' : ''">
													<label>特殊时期{{index + 1}}：</label>
													<a-range-picker
															style="width: 200px;"
															:allowClear="false"
															:disabledDate="disabledDateDay"
															:value="item.specialDate"
															:defaultValue="[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]"
															format="YYYY-MM-DD"
															@change="e => changeSpecialDate(e,index)"
													/>
													<div v-for="(time, timeIndex) in item.time"
													     style="margin-left: 77px;">
														<a-time-picker :disabled='timeIndex == 0' :allowClear="false"
														               style="width: 100px;"
														               :minuteStep="60"
														               v-model="time.startTime"
														               @change="e => changeSpecialStartTime(e, index, timeIndex)"
														               :defaultOpenValue="moment('00:00', 'HH:mm')"
														               format="HH:mm">
														</a-time-picker>
														~
														<a-time-picker :disabled='timeIndex == 0' :allowClear="false"
														               style="width: 100px;"
														               v-model="time.endTime"
														               :minuteStep="60"
														               @change="e => changeSpecialEndTime(e, index, timeIndex)"
														               :defaultOpenValue="moment('00:00', 'HH:mm')"
														               format="HH:mm">
														</a-time-picker>
														<template v-if="info.type == 2">
															<a-button style="margin-left: 10px;"
															          @click="showDepartmentList(index, 0, timeIndex)">
																选择企业成员
															</a-button>
															<a-tooltip placement="top">
																<template slot="title">
																	<div>
																		<span v-for="user in time.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																	</div>
																</template>
																<span v-if="time.userList.length > 0" style="display: inline-block; width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																	<span v-for="user in time.userList"> <template v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
																</span>
															</a-tooltip>
															<a-tooltip placement="top">
																<template slot="title">
																	<template v-for="(user, index) in time.userList">
																		<a-tag color="orange" style="margin-bottom: 5px;" v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
																	</template>
																</template>
																<span v-if="time.userList.length > 0" style="display: inline-block; vertical-align: top;">
																	<template v-for="(user, index) in time.userList">
																		<a-tag color="orange" v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(time.userList) >= index">{{user.title}}</a-tag>
																	</template>
																	<template v-if="getPartyNum(time.userList) > 3">等{{getPartyNum(time.userList)}}个部门</template>
																</span>
															</a-tooltip>
														</template>
														<a-tooltip placement="top"
														           v-if="info.type == 2 && timeIndex == item.time.length - 1">
															<template slot="title">
																选择企业成员和选择部门必须选择一个。选择部门后，扫码后最多可添加当前部门的企业成员。如原来某部门是5人，后新增1人，则客户最多可添加该部门6位企业成员
															</template>
															<span style="margin-left: 10px;vertical-align: top;">
																<a-icon type="question-circle"></a-icon>
															</span>
														</a-tooltip>
														<chooseStaffSelect ref="staffSelect"
														                   style="width: 160px;margin-left: 10px;display: inline-block;"
														                   v-if="info.type == 1" :index="index"
														                   :index2="timeIndex"
														                   :callback="selectStaffCallback"></chooseStaffSelect>
														<div>
															<span style="margin-right: 10px; color:#01b065; cursor: pointer;"
															      v-show="timeIndex == item.time.length - 1"
															      @click="addSpecialDateTimeList(index,timeIndex)">
																添加
															</span>
															<span style="cursor: pointer;color:#F56C6C;"
															      v-show="timeIndex != 0"
															      @click="deleteSpecialDateTimeList(index, timeIndex)">删除
															</span>
														</div>
													</div>
													<div style="float: right;">
														<a-button type="primary"
														          style="height: 26px;width: 94px;padding: 0px 5px;margin-right: 10px; font-size: 12px;"
														          
														          v-show="index == info.specialDateList.length - 1"
														          @click="addSpecialDate(index)">
															添加时期
														</a-button>
														<!--														<a-icon style="color: #01b065;margin-right: 10px" type="plus" v-show="index == info.specialDateList.length - 1"-->
														<!--														        @click="addSpecialDate(index)"/>-->
														<a-icon v-show="index != 0 || info.specialDateList.length > 1"
														        style="color: #F56C6C;" type="delete"
														        @click="deleteSpecialDate(index)"/>
													</div>
												</div>
											</div>
										</a-form-item>
										<!--										<a-form-item v-show="info.type == 2 && info.specialTime == 1">-->

										<!--										</a-form-item>-->
										<!-- 客户标签 -->
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<span slot="label">
										        客户标签&nbsp;
										        <a-tooltip title="客户通过该百度活码扫码添加企业成员后，其将会被自动打上选中的客户标签">
										          <a-icon type="question-circle"/>
										        </a-tooltip>
											</span>
											<corpChooseTag :callback="modalVisibleChange4"
											               :hasChoose="tag_arr" v-if="isShowTag"></corpChooseTag>
										</a-form-item>
										<!-- 渠道欢迎语 -->
										<a-form-item label="扫码推送" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<a-switch :checked="pushValue" @click="changeStatus"/>
											（关闭后，客户扫该百度活码，依然可对该客户自动打标签，但仅收到系统的【欢迎语】消息）
										</a-form-item>
										<!-- 推送内容 -->
										<!-- 内容 -->
										<a-form-item v-if="pushValue" label="欢迎语内容" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<div class="pull-right fl">
												<editor v-if="editorFlag" :text="textContent"
												        :textValue="textAreaValueHeader"
												        :isEmoji="false"
												        @changeText="changeText">
												</editor>
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
												     @click="deleteWelcome">
													<a-icon type="close"/>
												</div>
											</div>
										</a-form-item>
										<a-form-item>
											<div style="height: 20px;border-bottom: 1px solid #E0E0E0;"></div>
											<div style="margin-top: 10px;margin-left: 12.5%;">
												<a-button type="primary" @click="saveWay"
												          :disabled="createDisabled">
													提交
												</a-button>
											</div>
										</a-form-item>
									</a-form>
								</div>
							</div>

						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>
		<!-- 选择成员 -->
		<chooseDepartment ref="user" :show="showModalDepartment" :is_from="7" :chooseNum="chooseDepartmentNum"
		                  :callback="modalVisibleChange3"></chooseDepartment>
		<!-- 企业微信选择弹窗 -->
		<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="channel-add"></wxModal>
		<!-- 选择素材弹窗 -->
		<chooseMsg :show="showModal3" :type="typeValue2" :news_type="news_type"
		           :callback="modalVisibleChange2" :sketchType="'1'" :comefrom='comefrom'
		           :chooseId="chooseId"></chooseMsg>
		<chooseMinipro :show="showModalMinipro" :type="typeValue2"
		               :callback="modalVisibleChange2" :chooseId="chooseId"></chooseMinipro>
		<!-- 图文 -->
		<a-modal :visible="showModalUrl" title="图文" @ok="handleUrl" @cancel="handleCancelUrl"
		         width="720px" :confirmLoading="confirmLoading">
			<!-- 图片封面 -->
			<!-- 选中前 -->
			<a-form-item label="添加方式" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<a-radio-group name="radioGroup" @change="changeSketchAddType()"
				               v-model="sketchAddType">
					<a-radio :value="1">新建</a-radio>
					<a-radio :value="0">导入</a-radio>
				</a-radio-group>
			</a-form-item>
			<template v-if="sketchAddType == 1">
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
				<a-form-item label="素材同步" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
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
										:treeData="groupList1"
										placeholder='Please select'
										treeDefaultExpandAll
										v-model="selectGroupId1"
								>
								</a-tree-select>
							</div>
						</a-radio>
					</a-radio-group>
				</a-form-item>
				<!-- 点击跳转 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<template slot="label"><span
							style="color: red">*</span>点击跳转
					</template>
					<a-input
							placeholder="请输入跳转链接，且必须以http://或https://开头"
							style="margin-bottom: 10px;"
							v-model="url1">
					</a-input>
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
					     @click="openShowModal()">
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
					     @click="openShowModal()">
						<img src="../../../assets/circle.png" alt/>
						已选择1条图文
						<p style="color: blue;margin: 14px;"
						   @click="openShowModal()">
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
						<!-- （
						<a target="_blank" href="https://support.qq.com/products/104790/faqs/61672">
							如何关联</a>
						） -->
						，再到本系统添加该小程序，否则发送失败，客户接收不到。
					</p>
					<p style="margin-bottom: 2px;line-height: 20px;">
						如果没有微信小程序，请前往微信小程序进行注册。
						<!-- <a target="_blank" href="https://support.qq.com/products/104790/faqs/61672">
							立即前往
						</a> -->
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
					         :maxLength="12" placeholder="请填写小程序标题（4-12个字符）" @blur="checkout(appletInputTitle1)">
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
				<a-form-item label="素材同步" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
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
										:treeData="groupList1"
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
					     @click="openShowModalMinipro()">
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
					     @click="openShowModalMinipro()">
						<img src="../../../assets/circle.png" alt/>
						已选择1条小程序
						<p style="color: blue;margin: 14px;"
						   @click="openShowModalMinipro()">
							[修改]</p>
					</div>
				</a-form-item>
			</template>
		</a-modal>
		<!-- 小程序封面图片裁剪 -->
		<cropperModal ref="cropper" @ok="uploadAppletPic" @cancel="cancleAppletPic"></cropperModal>
		<!-- 添加特殊时间 -->
		<a-modal :visible="specialTimeVisible" :title="specialTimeTitle" @ok="handleSpecialTime"
		         @cancel="handleCancelSpecialTime"
		         width="720px" :confirmLoading="addSpecialTimeLoading">
			<div class="content-msg">
				<p style="margin-bottom: 0px;line-height: 20px;">
					1、系统默认生成一条每日24小时（00:00~00:00）数据，当时间点不在所新增的时段内，客户扫码后，添加的是“24小时”的企业成员。
				</p>
				<p style="margin-bottom: 0px;line-height: 20px;color: #FF562D" v-if="info.type == 2">
					2、渠道活码设置部门时，请确保设置的部门具有外部联系人权限，否则会导致该区间段的活码设置失效。
				</p>
			</div>
			<a-form-item label="固定时段" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<div>
					<!--					<div>-->
					<!--						<a-icon type="plus" style="cursor: pointer;" @click="addTime"/>-->
					<!--						<span @click="addTime" style="cursor: pointer">添加时间段</span>-->
					<!--					</div>-->
					<div v-for="(item,index) in specialTimeList">
						<a-time-picker :disabled="index == 0" :allowClear="false" style="width: 100px;"
						               v-model="item.startTime"
						               :minuteStep="60"
						               @change="e => changeStartTime(e, index)"
						               :defaultOpenValue="moment('00:00', 'HH:mm')" format="HH:mm">
						</a-time-picker>
						~
						<a-time-picker :disabled="index == 0" :allowClear="false" style="width: 100px;"
						               v-model="item.endTime"
						               :minuteStep="60"
						               @change="e => changeEndTime(e, index)"
						               :defaultOpenValue="moment('00:00', 'HH:mm')" format="HH:mm">
						</a-time-picker>
						<chooseStaffSelect ref="staffSelect2"
						                   style="width: 160px;margin-left: 10px;display: inline-block;"
						                   v-if="info.type == 1 && specialTimeVisible" :index="index" :index2="0"
						                   :callback="selectStaffCallback2"></chooseStaffSelect>
						<a-tooltip placement="top" v-if="info.type == 2">
							<template slot="title">
								<span v-for="item1 in item.userList">{{item1.name}} </span>
							</template>
							<span style="display: inline-block; max-width: 190px;vertical-align: bottom; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left: 10px;">
								<span v-for="item1 in item.userList">{{item1.name}} </span>
							</span>
						</a-tooltip>
						<template v-if="info.type == 2">
							<a-button style="margin-left: 10px;" @click="showDepartmentList(index, 1)">
								选择
							</a-button>
							<span style="margin-left: 5px"
							      v-show="item.userList.length + item.party.length> 0">已选择{{getUserNum(item.userList)}}名成员，{{item.party.length}}个部门</span>
						</template>
						<a-tooltip placement="top" v-if="info.type == 2 && index == specialTimeList.length - 1">
							<template slot="title">
								选择企业成员和选择部门必须选择一个。选择部门后，扫码后最多可添加当前部门的企业成员。如原来某部门是5人，后新增1人，则客户最多可添加该部门6位企业成员
							</template>
							<span style="margin-left: 10px;">
						<a-icon type="question-circle"></a-icon>
					</span>
						</a-tooltip>
						<div>
							<span @click="addTime(index)" style="color:#01b065; cursor: pointer;margin-right: 10px;"
							      v-show="index == specialTimeList.length - 1">添加</span>
							<span style="cursor: pointer;color:#F56C6C;" v-show="index != 0"
							      @click="deleteTime(index)">删除
							</span>
						</div>
					</div>
				</div>
			</a-form-item>
			<a-form-item label="适用周期" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<template v-for="(item,index) in weekList">
					<a-checkable-tag v-model="weekChecked[index]" style="cursor: pointer;"
					                 @change="changeWeekDay(item.key)">
						{{item.name}}
					</a-checkable-tag>
				</template>
			</a-form-item>
		</a-modal>
	</div>
</template>

<script>
	import wxModal from "@/components/WeChatModal.vue"
	import vuedraggable from "vuedraggable"
	import "video.js/dist/video-js.css"
	import { VEmojiPicker } from "v-emoji-picker"
	import WEmoji from "@/common/js/wechatEmoji.js"
	import editor from '../../../components/editor/index'
	import {message} from "ant-design-vue";
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import chooseMsg from "@/components/ChooseMsg"
	import MyIcon from "@/components/MyIcon.vue"
	import chooseMinipro from '@/components/FilingCabinet/Miniprogram.vue'
	import cropperModal from '../../../components/picCropper/CropperModal'
	import moment from "moment"
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import chooseStaffSelect from "@/components/ChooseStaffSelect"

	export default {
		components: {
			wxModal, vuedraggable, VEmojiPicker,
			editor, chooseMsg, chooseDepartment, MyIcon, chooseMinipro, cropperModal, corpChooseTag,chooseStaffSelect
		},
		props     : {
			defaultTypeName: {
				type   : Object,
				default: () => {
					return {
						1: '文字',
						2: '图片',
						3: '音频',
						4: '视频',
						5: '图文',
					}
				}
			}
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				editorFlag : false,
				textAreaValueHeader: '',
				textContent     : '',
				wxInfo        : [], //微信公众号列表
				avatarImg     : "", //微信公众号头像
				showModal2    : false, //公众号组件弹窗显示与隐藏
				msg_title     : '',//二维码名称
				validity      : 1,//有效期
				tag_arr       : [], //标签值
				img           : false, // 图片url
				text          : "", // 文本内容
				// 标签
				group_id      : [],//选择标签的分组
				checked       : [],
				localChecked  : [],
				pushValue     : true,//新建扫码推送类型
				jumpVisible   : false,//添加图文气泡的显示与隐藏
				showModal3    : false, //选择消息对话框的显示与隐藏
				commonUrl     : this.$store.state.commonUrl, //公共的链接
				urlId         : "", //地址栏参数id值
				newTagList    : [], //新建标签数组
				createDisabled: false,//创建按钮的置灰
				isLoading     : false, //Loading 组件显示与隐藏

				formLayout           : 'horizontal',
				form                 : this.$form.createForm(this, {name: 'contactWay'}),
				info                 : {
					title          : '',
					type           : 1,
					scene          : 2,
					remark         : '',
					skip_verify    : 0,
					state          : '',
					style          : 1,
					user           : [],
					specialTime    : 0,
					specialWeekList: [
						{
							mon   : [],
							tues  : [],
							wednes: [],
							thurs : [],
							fri   : [],
							satur : [],
							sun   : [],
						},
					],
					specialDateList: [
						{
							specialDate: [moment(new Date()), moment(new Date())],
							date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
							time       : [
								{
									startTime : moment('00:00', 'HH:mm'),
									endTime   : moment('00:00', 'HH:mm'),
									start_time: '00:00',
									end_time  : '00:00',
									userList  : [],
									party     : []
								}
							],
						}
					],
					party          : [],
					tag_ids        : []
				},
				specialTimeVisible   : false, // 周排班弹窗显示隐藏
				addSpecialTimeLoading: false, // 添加周排班loading
				specialTimeTitle     : '添加企业成员', //
				weekList             : [
					{
						key : 'mon',
						name: '周一'
					},
					{
						key : 'tues',
						name: '周二'
					},
					{
						key : 'wednes',
						name: '周三'
					},
					{
						key : "thurs",
						name: '周四'
					},
					{
						key : 'fri',
						name: '周五'
					},
					{
						key : 'satur',
						name: '周六'
					},
					{
						key : 'sun',
						name: '周日'
					}
				],
				weekArr              : {
					mon   : 0,
					tues  : 1,
					wednes: 2,
					thurs : 3,
					fri   : 4,
					satur : 5,
					sun   : 6
				},
				weekDayKey           : [],
				weekChecked          : new Array(7).fill(false),
				specialWeekColumns   : [
					{
						slots      : {title: 'mon'},
						// title      : "周一",
						dataIndex  : "mon",
						width      : '14%',
						key        : "mon",
						scopedSlots: {customRender: "mon"}
					},
					{
						slots      : {title: 'tues'},
						// title      : "周二",
						dataIndex  : "tues",
						width      : '14%',
						key        : "tues",
						scopedSlots: {customRender: "tues"}
					},
					{
						slots      : {title: 'wednes'},
						// title      : "周三",
						dataIndex  : "wednes",
						width      : '14%',
						key        : "wednes",
						scopedSlots: {customRender: "wednes"}
					},
					{
						slots      : {title: 'thurs'},
						// title      : "周四",
						dataIndex  : "thurs",
						width      : '14%',
						key        : "thurs",
						scopedSlots: {customRender: "thurs"}
					},
					{
						slots      : {title: 'fri'},
						// title      : "周五",
						dataIndex  : "fri",
						width      : '14%',
						key        : "fri",
						scopedSlots: {customRender: "fri"}
					},
					{
						slots      : {title: 'satur'},
						// title      : "周六",
						dataIndex  : "satur",
						width      : '14%',
						key        : "satur",
						scopedSlots: {customRender: "satur"}
					},
					{
						slots      : {title: 'sun'},
						// title      : "周日",
						dataIndex  : "sun",
						width      : '14%',
						key        : "sun",
						scopedSlots: {customRender: "sun"}
					},
				],
				specialTimeUserList  : [],
				timeIndex            : "",
				currentIndex         : '',
				specialTimeList      : [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : []
					},
				],
				user                 : [],
				party                : [],
				corpId               : corpId,//企业微信选中的id
				groupList            : [], //标签分组列表
				groupList1           : [], // 内容引擎分组
				editGroupId          : '', // 标签分组
				selectedUser         : [],
				showModal3           : false,//选择图片弹窗的显示与隐藏
				typeValue2           : 2,  // 1.图文 2.图片
				material_id1         : '',
				news_type            : 1,
				chooseId             : 0,//选择的图片id
				showModalUrl         : false,//网址弹窗
				sketchAddType        : 1, // 新建或导入
				sketchAddType1       : 1,
				url                  : '',//网址弹窗输入的网址
				closeShowModal3      : false,//网址弹窗封面选没选好
				msgUrl               : '',//网址弹窗封面选好的url
				inputTitle           : '',//网址弹窗输入标题
				digest               : '',//网址弹窗输入描述
				confirmLoading       : false,//网址弹窗确认按钮的Loading
				popVisible           : false,//控制选择图片、网址、小程序的popover的显示与隐藏
				groupId              : [],//分组id
				index                : 0,//判断是图片打开素材弹窗还是链接打开，1是图片，2是链接，3是小程序
				modalUrlOk           : false,//判断网址弹窗关闭时是否成功选择
				showModalApplet      : false,//小程序弹窗的显示与隐藏
				miniproAddType       : 1, // 新建或导入
				miniproAddType1      : 1,
				material_id3         : '',
				showModalMinipro     : false, // 导入框
				appletUrl            : '',//小程序的封面链接
				appletInputTitle     : '',//小程序的标题
				appid                : '',//小程序的appid
				pageUrl              : '',//小程序page路径
				closeModalApplet     : false,//小程序弹窗封面选没选好
				modalAppletOk        : false,//判断小程序弹窗关闭时是否成功选择
				showModalDepartment  : false, //成员选择框显示与隐藏
				checkedList          : [],//选择的成员id数组
				welcomeDisabled      : false,//通用按钮的置灰
				corpArr              : [],//企业微信数组
				chooseNum            : 0,//已选择的成员数量
				chooseDepartmentNum  : 0,
				selectGroupId        : '',
				disabledSync         : 0,
				materialSync         : 0,

				materialSync1: 0,
				disabledSync1: 0,

				material_id0: '',

				msgUrl1       : '',
				inputTitle1   : '',
				digest1       : '',
				url1          : '',
				material_id11 : '',
				selectGroupId1: '',

				appletUrl1       : '',
				appletInputTitle1: '',
				appid1           : '',
				pageUrl1         : '',
				material_id31    : '',
				comefrom         : '',
				isShowTag        : true
			}
		},

		methods: {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push('/channelCode/baiduStatistics?isRefresh=1')
			},
			moment,
			//素材同步
			changeMaterialSync () {
				if (this.materialSync1 == 1) {
					this.getGroup()
				}
			},
			//选择图片、选择网址封面
			choosePic (index) {
				if (index == 3) {
					this.comefrom = '3'
				} else {
					this.comefrom = '1'
				}
				if(index == 1) {
					this.chooseId = Number(this.material_id || 0)
				} else {
					this.chooseId = Number(this.material_id0 || 0)
				}
				// this.chooseId = Number(this.material_id0 || 0)
				this.typeValue2 = 2
				this.showModal3 = true
				this.popVisible = false
				this.showModalUrl = false
				this.showModalApplet = false
				this.index = index
			},
			// 图文新建/导入
			changeSketchAddType () {
				if (this.sketchAddType == 0) {
					this.materialSync1 = 0
				}
				this.disabledSync1 = 0
				this.msgUrl1 = ''
				this.inputTitle1 = ''
				this.digest1 = ''
				this.url1 = ''
				this.closeShowModal3 = false
				// this.modalUrlOk = false
				this.material_id0 = ''
				this.material_id11 = ''
			},
			// 小程序新建/导入
			changeMiniproAddType () {
				if (this.sketchAddType == 0) {
					this.materialSync = 0
				}
				this.disabledSync1 = 0
				// this.modalAppletOk = false
				this.appletUrl1 = ''
				this.appletInputTitle1 = ''
				this.appid1 = ''
				this.pageUrl1 = ''
				this.closeShowModal3 = false
				this.closeModalApplet = false
				// this.modalUrlOk = false
				this.material_id0 = ''
				this.material_id31 = ''
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
				this.selectGroupId1 = this.selectGroupId
				this.materialSync1 = this.materialSync
				this.disabledSync1 = this.disabledSync
				this.index = index
			},
			// 素材弹窗
			openShowModal () {
				this.comefrom = '1'
				if (this.material_id11) {
					this.chooseId = Number(this.material_id11)
				} else {
					this.chooseId = 0
				}
				this.comefrom = '1'
				this.typeValue2 = 1
				this.showModal3 = true
				this.popVisible = false
				this.showModalUrl = false
			},
			// 打开小程序素材弹窗
			openShowModalMinipro () {
				if (this.material_id31) {
					this.chooseId = Number(this.material_id31)
				} else {
					this.chooseId = 0
				}
				this.typeValue2 = 7
				this.showModalMinipro = true
				this.popVisible = false
				this.showModalUrl = false
			},
			// 图文弹窗确认
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
			},
			// 图文弹窗取消啊
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
			},
			// 选择小程序回调
			modalVisibleChange2 (event, e, id, item) {
				if (event == "ok") {
					if (this.index == 3 && this.miniproAddType == 1) {
						this.$refs.cropper.edit(item.local_path, item.file_name)
					} else if (this.index == 3 && this.miniproAddType == 0) {
						this.appletInputTitle1 = item.file_name
						this.appletUrl1 = item.local_path
						this.material_id31 = id
						this.closeModalApplet = true
						this.showModalApplet = true
					} else {
						this.uploadMedia(id)
					}
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
				}
				this.showModalMinipro = false
				this.showModal3 = false
			},
			// 小程序封面裁剪取消
			cancleAppletPic () {
				this.showModalApplet = true
			},
			// 小程序封面裁剪上传
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
						if (this.index == 1) {
							//图片选择素材
							this.material_id = res.data.id
							this.img = res.data.local_path
							this.fileName = res.data.file_name
						} else if (this.index == 2) {
							if (this.sketchAddType == 0) {
								this.material_id11 = id
								this.msgUrl1 = res.data.artList[0].qy_local_path
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
					}
				}
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
				this.selectGroupId1 = this.selectGroupId
				this.miniproAddType = this.miniproAddType1
				this.materialSync1 = this.materialSync
				this.disabledSync1 = this.disabledSync
				this.index = index
			},
			// 小程序弹窗确认
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
			// 小程序弹窗取消
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
			// 校验小程序标题长度
			checkout (title) {
				if (title.length < 4) {
					this.$message.warning('小程序标题长度需在4-12个字符')
				}
			},
			//小叉号删除选中的图片、网址、小程序
			deleteWelcome () {
				this.disabledSync = 0
				this.img = ''
				this.msgUrl = ''
				this.inputTitle = ''
				this.digest = ''
				this.url = ''
				this.index = 0
				this.closeShowModal3 = false
				this.modalUrlOk = false
				this.appletUrl = ''
				this.appletInputTitle = ''
				this.appid = ''
				this.pageUrl = ''
				this.closeModalApplet = false
				this.modalAppletOk = false
				this.material_id = ''
				this.material_id1 = ''
				this.material_id3 = ''
			},
			getUserNum(userList) {
				let num = 0
				for(let i = 0; i < userList.length; i++) {
					if(userList[i].scopedSlots.title == "custom") {
						num++
					}
				}
				return num
			},
			getPartyNum(userList) {
				let num = 0
				for(let i = 0; i < userList.length; i++) {
					if(userList[i].scopedSlots.title != "custom") {
						num++
					}
				}
				return num
			},
			getThreePartyIndex(userList) {
				let num = 0
				let index = 0
				for(let i = 0; i < userList.length; i++) {
					index = i
					if(num < 2) {
						if(userList[i].scopedSlots.title != "custom") {
							num++
						}
					} else {
						return index
					}
				}
				return index
			},
			// 选择成员弹窗显示
			showDepartmentList (index, type, timeIndex) {
				if (type == 1) {
					this.currentIndex = index
					this.currentType = type
					let arr = []
					this.specialTimeList[index].userList.map(x=>{
						arr.push(x.id)
					})
					this.chooseDepartmentNum = this.specialTimeList[index].userList.length
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.specialTimeList[index].userList))
				} else {
					this.currentType = 0
					this.currentIndex = index
					this.timeIndex = timeIndex
					this.currentType = type
					let arr = []
					this.info.specialDateList[index].time[timeIndex].userList.map(x=>{
						arr.push(x.id)
					})
					this.chooseDepartmentNum = this.info.specialDateList[index].time[timeIndex].userList.length
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.info.specialDateList[index].time[timeIndex].userList))
				}
				this.specialTimeVisible = false
				this.showModalDepartment = true
			},
			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.currentType == 1) {
						this.specialTimeList[this.currentIndex].userList = []
						this.specialTimeList[this.currentIndex].party = []
						if (userNum + departmentNum > 0) {
							list.map(item => {
								this.specialTimeList[this.currentIndex].userList.push(JSON.parse(JSON.stringify(item)))
								if(item.scopedSlots.title != "custom") {
									this.specialTimeList[this.currentIndex].party.push(item.ids)
								}
							})
						}
						this.specialTimeVisible = true
					} else {
						this.info.specialDateList[this.currentIndex].time[this.timeIndex].userList = []
						this.info.specialDateList[this.currentIndex].time[this.timeIndex].party = []
						if (userNum + departmentNum > 0) {
							list.map(item => {
								this.info.specialDateList[this.currentIndex].time[this.timeIndex].userList.push(JSON.parse(JSON.stringify(item)))
								if(item.scopedSlots.title != "custom") {
									this.info.specialDateList[this.currentIndex].time[this.timeIndex].party.push(item.ids)
								}
							})
						}
					}
				} else {
					if (this.currentType == 1) {
						this.specialTimeVisible = true
					}
				}
				this.showModalDepartment = false
			},
			// 获取单人类型成员列表
			async getUserList () {
				const {data: res} = await this.axios.post('work-user/get-all-user', {
					suite_id: 1,
					corp_id : this.corpId,
					is_all  : 1,//不带分页
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.isLoading = false;
				} else {
					this.user = res.data.info
					this.isLoading = false;
				}
			},
			// 获取部门列表
			async getPartyList () {
				const {data: res} = await this.axios.post('work-contact-way/get-party-list', {
					suite_id: 1,
					corp_id : this.corpId,
				})

				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false;
					this.party = res.data.party_list
				}
			},
			//选择成员组件回调->按特殊时期编辑
			selectStaffCallback (event, id, index, index2) {
				if (event == "ok") {
					this.info.specialDateList[index].time[index2].userList = id
				}
			},
			//选择成员组件回调->按周期编辑
			selectStaffCallback2 (event, id, index) {
				if (event == "ok") {
					this.specialTimeList[index].userList = id
				}
			},
			//点击修改进入页面，获取详情
			async getDetail () {
				let that = this
				const {data: res} = await this.axios.post('work-contact-way-baidu/get', {
					suite_id : 1,
					corp_id  : this.corpId,
					config_id: this.urlId,
					id       : this.urlId
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					// 欢迎语赋值
					if (res.data.contact_way.welcome_content) {

						let welcome_content = res.data.contact_way.welcome_content
						this.pushValue = welcome_content.status == 1 ? true : false
						this.textContent = welcome_content.text_content
						this.textAreaValueHeader = welcome_content.text_content.replace(
							/{nickname}/g,
							'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>'
						).replace(/\n/g, '<br>')
						this.editorFlag = true
						this.index = welcome_content.add_type
						if (welcome_content.add_type == 1) {
							this.img = welcome_content.image_url
							this.fileName = welcome_content.file_name
							this.material_id = welcome_content.image_attachment_id
						} else if (welcome_content.add_type == 2) {
							if (welcome_content.attachment_id != 0) {
								this.material_id1 = welcome_content.attachment_id
								this.closeShowModal3 = true
								this.sketchAddType1 = 0
							} else {
								this.disabledSync = welcome_content.material_sync
								this.materialSync = welcome_content.material_sync
								this.closeShowModal3 = true
								this.getGroup(welcome_content.groupId.toString())
								this.selectGroupId = welcome_content.groupId.toString()
							}
							this.modalUrlOk = true
							this.msgUrl = welcome_content.link_pic_url
							this.inputTitle = welcome_content.link_title
							this.digest = welcome_content.link_desc
							this.material_id = welcome_content.link_attachment_id
							this.url = welcome_content.link_url
						} else if (welcome_content.add_type == 3) {
							if (welcome_content.attachment_id != 0) {
								this.material_id3 = welcome_content.attachment_id
								this.miniproAddType1 = 0
							} else {
								this.disabledSync = welcome_content.material_sync
								this.materialSync = welcome_content.material_sync
								this.getGroup(welcome_content.groupId.toString())
								this.selectGroupId = welcome_content.groupId.toString()
								this.closeModalApplet = true
							}
							this.disabledSync = welcome_content.material_sync
							this.modalAppletOk = true
							this.appletInputTitle = welcome_content.mini_title
							this.appletUrl = welcome_content.mini_pic_url
							this.material_id = welcome_content.mini_attachment_id
							this.appid = welcome_content.mini_appid
							this.pageUrl = welcome_content.mini_page
						}
					}

					let wayInfo = res.data.contact_way
					let wayUser = wayInfo.user
					let wayParty = wayInfo.department
					if (!wayInfo.remark) {
						wayInfo.remark = ''
					}
					delete wayInfo.id
					delete wayInfo.corp_id
					delete wayInfo.is_del
					delete wayInfo.qr_code
					delete wayInfo.add_num
					delete wayInfo.department
					delete wayInfo.update_time
					delete wayInfo.create_time
					this.info = wayInfo
					// 特殊时间--日期和时间赋值
					for (let i = 0; i < this.info.specialDateList.length; i++) {
						this.info.specialDateList[i]['specialDate'] = [moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]
						this.info.specialDateList[i]['specialDate'][0] = moment(this.info.specialDateList[i].date[0], "YYYY-MM-DD")
						this.info.specialDateList[i]['specialDate'][1] = moment(this.info.specialDateList[i].date[1], "YYYY-MM-DD")
						for (let j = 0; j < this.info.specialDateList[i].time.length; j++) {
							this.info.specialDateList[i].time[j]['startTime'] = moment(new Date(), 'HH:mm')
							this.info.specialDateList[i].time[j]['endTime'] = moment(new Date(), 'HH:mm')
							this.info.specialDateList[i].time[j]['startTime'] = moment(this.info.specialDateList[i].time[j]['start_time'], "HH:mm")
							this.info.specialDateList[i].time[j]['endTime'] = moment(this.info.specialDateList[i].time[j]['end_time'], "HH:mm")
						}
					}
					if (this.info.specialDateList.length == 0) {
						this.info.specialDateList = [
							{
								specialDate: [moment(new Date()), moment(new Date())],
								date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
								time       : [
									{
										startTime : moment('00:00', 'HH:mm'),
										endTime   : moment('00:00', 'HH:mm'),
										start_time: '00:00',
										end_time  : '00:00',
										userList  : [],
										party     : []
									}
								],
							}
						]
					}
					// 周排班时间赋值
					let weekDay = ['mon', 'tues', 'wednes', 'thurs', 'fri', 'satur', 'sun']
					for (let k = 0; k < 7; k++) {
						let times = this.info.specialWeekList[0][weekDay[k]]
						for (let l = 0; l < times.length; l++) {
							times[l]['startTime'] = moment(times[l]['start_time'], 'HH:mm')
							times[l]['endTime'] = moment(times[l]['end_time'], 'HH:mm')
						}
					}
					// this.getWorkContactWay(this.info.way_group_id)

					if (wayInfo.tag_ids.length > 0) {
						wayInfo.tag_ids.map((tagId) => {
							this.tag_arr.push(String(tagId));
						})
					}
					this.isShowTag = true

					if(this.info.type == 1){
						let that = this
						let arr = []
						that.info.specialDateList.map((item, index) => {
							item.time.map((item2, index2) => {
								arr.push(item2.userList)
							})
						})
						that.$nextTick(() => {
							arr.map((item, index) => {
								if(that.info.type == 1) {
									that.$refs.staffSelect[index].userId = item
								}
							})
						})
					}
				}
			},
			// 设置成员弹窗数据
			setUser (users) {
				let that = this
				let checkedKeys = []
				let user = []
				let selectUser = []
				let u = {
					avatar     : "",
					disabled   : false,
					id         : '',
					key        : '',
					scopedSlots: {
						title: "custom"
					},
					title      : ''
				}
				if (users.length > 0) {
					users.map(item => {
						u.avatar = item.avatar
						u.id = item.id
						u.title = item.name
						if (item.user_key.toString().indexOf(",") > 0) {
							let arr = item.user_key.split(',')
							checkedKeys = checkedKeys.concat(arr)
							u.key = arr[0]
							user.push(JSON.parse(JSON.stringify(u)))
							u.key = item.user_key
							selectUser.push(JSON.parse(JSON.stringify(u)))
						} else {
							checkedKeys.push(item.user_key)
							u.key = item.user_key
							user.push(JSON.parse(JSON.stringify(u)))
							selectUser.push(JSON.parse(JSON.stringify(u)))
						}
					})
				}
				that.$refs.user.checkedKeys = checkedKeys
				that.$refs.user.checkedKeysArr = checkedKeys
				that.$refs.user.checkedNodes = checkedKeys
				that.$refs.user.staffListArr = user
				that.chooseDepartmentNum = user.length
				that.$refs.user.keyList = selectUser
			},
			// 创建活码
			async saveWay () {
				this.createDisabled = true
				let sendData = JSON.parse(JSON.stringify(this.info))
				if (!sendData.title) {
					this.$message.warning("请填写名称!")
					this.createDisabled = false
					return false
				}
				if (this.pushValue && this.textAreaValueHeader == "" && this.img == "" && !this.modalUrlOk && !this.modalAppletOk) {
					this.$message.warning("内容不能为空")
					this.createDisabled = false
					return false
				}
				let weekList = this.info.specialWeekList[0]
				if (weekList.mon.length == 0 || weekList.tues.length == 0 || weekList.wednes.length == 0 || weekList.thurs.length == 0 || weekList.fri.length == 0 || weekList.satur.length == 0 || weekList.sun.length == 0) {
					this.$message.warning('周成员缺失')
					this.createDisabled = false
					return false
				}
				let weekArr1 = ['mon', 'tues', 'wednes', 'thurs', 'fri', 'satur', 'sun']
				for (let i = 0; i < 7; i++) {
					for (let item of this.info.specialWeekList[0][weekArr1[i]]) {
						if (this.info.type == 2 && (item.userList.length == 0 || (item.userList.length == 1 && item.userList[0].is_del == 1)) && item.party.length == 0) {
							this.$message.warning("请选择成员或企业微信部门")
							this.createDisabled = false
							return false
						}
						if (this.info.type == 1 && (item.userList.length == 0 || item.is_del == 1)) {
							this.$message.warning("请选择成员")
							this.createDisabled = false
							return false
						}
					}
				}
				let dateFlag = false
				for (let i = 0; i < this.info.specialDateList.length; i++) {
					for (let j = i + 1; j < this.info.specialDateList.length; j++) {
						let dateList = this.info.specialDateList
						if ((dateList[j].date[0] >= dateList[i].date[0] && dateList[j].date[0] <= dateList[i].date[1]) || (dateList[j].date[1] >= dateList[i].date[0] && dateList[j].date[1] <= dateList[i].date[1])) {
							this.$message.warning('特殊时期' + (i + 1) + '和特殊时期' + (j + 1) + '存在冲突，请修改')
							dateFlag = true
							this.createDisabled = false
							return false
						}
					}
					for (let k = 0; k < this.info.specialDateList[i].time.length; k++) {
						// 判断开始时间是否小于结束时间
						if (this.info.specialDateList[i].time[k].start_time >= this.info.specialDateList[i].time[k].end_time && this.info.specialDateList[i].time[k].end_time != '00:00') {
							this.$message.warning("特殊时期" + (i + 1) + "的第" + (k + 1) + "个时间段开始时间需早于结束时间，请修改")
							dateFlag = true
							this.createDisabled = false
							return false
						}
						if (this.info.type == 2 && this.info.specialTime == 1 && (this.info.specialDateList[i].time[k].userList.length == 0 || (this.info.specialDateList[i].time[k].userList.length == 1 && this.info.specialDateList[i].time[k].userList[0].is_del == 1)) && this.info.specialDateList[i].time[k].party.length == 0) {
							this.$message.warning('特殊时期' + (i + 1) + '的第' + (k + 1) + '个时间段请选择企业成员或企业部门')
							dateFlag = true
							this.createDisabled = false
							return false
						}
						if (this.info.type == 1 && this.info.specialTime == 1 && (this.info.specialDateList[i].time[k].userList.length == 0 || this.info.specialDateList[i].time[k].is_del == 1)) {
							this.$message.warning('特殊时期' + (i + 1) + '的第' + (k + 1) + '个时间段请选择企业成员')
							dateFlag = true
							this.createDisabled = false
							return false
						}
						for (let l = k + 1; l < this.info.specialDateList[i].time.length; l++) {
							if (this.info.specialDateList[i].time[l].start_time == '00:00' && this.info.specialDateList[i].time[l].end_time == '00:00') {
								this.$message.warning("第特殊时期" + (i + 1) + "的第" + (l + 1) + "个时间段不能与默认时间段相同，请修改")
								dateFlag = true
								this.createDisabled = false
								return false
							}
							if (k != 0) {
								let startTime = this.info.specialDateList[i].time[k].start_time
								let endTime = this.info.specialDateList[i].time[k].end_time
								let startTime1 = this.info.specialDateList[i].time[l].start_time
								let endTime1 = this.info.specialDateList[i].time[l].end_time
								// 判断时间是否存在重叠
								if ((startTime >= startTime1 && startTime < endTime1) || (endTime > startTime1 && endTime <= endTime1) || (startTime >= startTime1 && endTime1 == '00:00') || (endTime > startTime1 && endTime1 == '00:00') || (startTime1 >= startTime && startTime1 < endTime) || (endTime1 > startTime && endTime >= endTime1) || (startTime1 >= startTime && endTime == '00:00') || (endTime1 > startTime && endTime == '00:00')) {
									this.$message.warning("特殊时期" + (i + 1) + "的第" + (k + 1) + "个时间段与第" + (l + 1) + "个时间段存在冲突，请修改")
									dateFlag = true
									this.createDisabled = false
									return false
								}
							}
						}
						if (dateFlag) {
							this.createDisabled = false
							return false
						}
					}
					if (dateFlag) {
						this.createDisabled = false
						return false
					}
				}
				if (dateFlag) {
					this.createDisabled = false
					return false
				}
				let url = 'work-contact-way-baidu/add'
				sendData.suite_id = 1
				sendData.corp_id = this.corpId
				sendData.tag_ids = this.tag_arr.join()
				if (typeof this.urlId != 'undefined') {
					sendData.id = this.urlId
				}
				sendData.uid = localStorage.getItem('uid')
				sendData.status = this.pushValue ? 1 : 0
				sendData.add_type = this.index
				sendData.text_content = this.textContent
				sendData.media_id = this.material_id
				sendData.link_title = this.inputTitle
				sendData.link_attachment_id = this.material_id
				sendData.link_desc = this.digest
				sendData.link_url = this.url
				sendData.mini_title = this.appletInputTitle
				sendData.mini_pic_media_id = this.material_id
				sendData.mini_appid = this.appid
				sendData.mini_page = this.pageUrl
				sendData.attachment_id = this.material_id3 || this.material_id1
				sendData.materialSync = this.materialSync
				sendData.groupId = this.selectGroupId
				const {data: res} = await this.axios.post(url, sendData);

				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.createDisabled = false
				} else {
					this.$message.success("操作成功")
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					this.createDisabled = false
					if (typeof this.urlId != "undefined"){
						this.$router.push("/channelCode/baiduStatistics?isRefresh=1")
					}else {
						this.$router.push("/channelCode/baiduStatistics")
					}
				}
			},
			//更换公众号
			add () {
				if (this.$route.query.id) {
					return
				}
				this.showModal2 = true
				this.isLoading = true;
			}
			,
			// 公众号弹窗确认
			modalVisibleChange (event, corpId, corpName) {
				if (event == "ok" && this.corpId != corpId) {
					this.corpId = corpId
					this.isLoading = false;
					this.showModal2 = false
					this.info.user = []
					this.info.party = []
					this.info.tag_ids = []
					this.resetInfoSpecialWeekAndDate()
					// this.getWorkContactWay()
					this.getUserList()
					this.getPartyList()
					this.chooseNum = 0
					this.$refs.user.staffList = []
					this.$refs.user.keyList = []
				} else {
					this.isLoading = false;
					this.showModal2 = false
				}
			}
			,
			// 改变单、多人类型
			changeInfoType () {
				this.resetInfoSpecialWeekAndDate()
			},
			// 重置排班数据
			resetInfoSpecialWeekAndDate () {
				this.info.specialWeekList = [
					{
						mon   : [],
						tues  : [],
						wednes: [],
						thurs : [],
						fri   : [],
						satur : [],
						sun   : [],
					},
				]
				this.info.specialDateList = [
					{
						specialDate: [moment(new Date()), moment(new Date())],
						date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
						time       : [
							{
								startTime : moment('00:00', 'HH:mm'),
								endTime   : moment('00:00', 'HH:mm'),
								start_time: '00:00',
								end_time  : '00:00',
								userList  : [],
								party     : []
							}
						],
					}
				]
			},
			// 特殊时间切换
			changeSpecilTime () {
				this.info.specialTime = (this.info.specialTime + 1) % 2
			},
			// 特殊时间弹窗
			addSpecialTime () {
				this.specialTimeTitle = '添加企业成员'
				this.specialTimeVisible = true
				let that = this
				that.$nextTick(() => {
					if(that.info.type == 1) {
						that.$refs.staffSelect2.userId = []
					}
				})
			},
			// 编辑周几排班
			editSpecialTime (weekDay) {
				this.specialTimeTitle = '编辑企业成员'
				this.specialTimeList = JSON.parse(JSON.stringify(this.info.specialWeekList[0][weekDay]))
				this.specialTimeList.map((item) => {
					item.startTime = moment(item.start_time, 'HH:mm')
					item.endTime = moment(item.end_time, 'HH:mm')
				})
				this.weekChecked[this.weekArr[weekDay]] = true
				this.weekDayKey.push(weekDay)
				this.specialTimeVisible = true

				if(this.info.type == 1) {
					let that = this
					that.$nextTick(() => {
						that.specialTimeList.map((item, index) => {
							if(that.info.type == 1) {
								that.$refs.staffSelect2[index].userId = item.userList
							}
						})
					})
				}
			},
			// 周排班弹窗确认
			handleSpecialTime () {
				this.addSpecialTimeLoading = true
				if (this.weekDayKey.length == 0) {
					this.$message.warning("请选择适用周期")
					this.addSpecialTimeLoading = false
					return false
				}
				for (let item of this.specialTimeList) {
					console.log(JSON.stringify(item))
					if (this.info.type == 2 && (item.userList.length == 0 || (item.userList.length == 1 && item.userList[0].is_del == 1)) && item.party.length == 0) {
						this.$message.warning("请选择成员或企业微信部门")
						this.addSpecialTimeLoading = false
						return false
					}
					if (this.info.type == 1 && (item.userList.length == 0 || item.is_del == 1)) {
						this.$message.warning("请选择成员")
						this.addSpecialTimeLoading = false
						return false
					}
				}
				let flag = false
				// 判断周排班弹窗时间是否存在重叠且不能为00~00 默认第一个00~00不进入判断 故j从1开始
				for (let j = 1; j < this.specialTimeList.length; j++) {
					if (this.specialTimeList[j].start_time >= this.specialTimeList[j].end_time && this.specialTimeList[j].end_time != '00:00') {
						this.$message.warning("第" + (j + 1) + "个时间段开始时间需早于结束时间，请修改")
						flag = true
						this.addSpecialTimeLoading = false
						return false
					}
					if (this.specialTimeList[j].start_time == '00:00' && this.specialTimeList[j].end_time == '00:00') {
						this.$message.warning("第" + (j + 1) + "个时间段不能与默认时间段相同，请修改")
						flag = true
						this.addSpecialTimeLoading = false
						return false
					}
					// 冒泡判断当前数据是否存在重叠
					for (let k = j + 1; k < this.specialTimeList.length; k++) {
						let startTime = this.specialTimeList[j].start_time
						let endTime = this.specialTimeList[j].end_time
						let startTime1 = this.specialTimeList[k].start_time
						let endTime1 = this.specialTimeList[k].end_time
						// 判断时间是否重叠
						if ((startTime >= startTime1 && startTime < endTime1) || (endTime > startTime1 && endTime <= endTime1) || (startTime >= startTime1 && endTime1 == '00:00') || (endTime > startTime1 && endTime1 == '00:00') || (startTime1 >= startTime && startTime1 < endTime) || (endTime1 > startTime && endTime >= endTime1) || (startTime1 >= startTime && endTime == '00:00') || (endTime1 > startTime && endTime == '00:00')) {
							this.$message.warning("第" + (j + 1) + "个时间段与第" + (k + 1) + "个时间段存在冲突，请修改")
							flag = true
							this.addSpecialTimeLoading = false
							return false
						}
					}
				}
				if (flag) {
					return false
				}
				// 先将选中的周几替换默认00~00数据再添加弹窗数据
				for (let weekDay of this.weekDayKey) {
					this.info.specialWeekList[0][weekDay] = []
					this.info.specialWeekList[0][weekDay] = this.specialTimeList.concat(this.info.specialWeekList[0][weekDay])
				}
				this.$forceUpdate()
				this.specialTimeVisible = false
				this.addSpecialTimeLoading = false
				// 弹窗数据重置
				this.weekDayKey = []
				this.weekChecked = new Array(7).fill(false)
				this.specialTimeUserList = []
				this.specialTimeList = [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : [],
					}
				]

			},
			// 周排班弹窗取消
			handleCancelSpecialTime () {
				this.specialTimeVisible = false
				this.weekDayKey = []
				this.weekChecked = new Array(7).fill(false)
				this.specialTimeUserList = []
				this.specialTimeList = [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : []
					}
				]
			},
			// 周排班弹窗添加周排班时间
			addTime (index) {
				let special = {
					start_time: '00:00',
					end_time  : '00:00',
					startTime : moment("00:00", "HH:mm"),
					endTime   : moment("00:00", "HH:mm"),
					userList  : [],
					party     : []
				}
				this.specialTimeList.splice(index + 1, 0, special)
			},
			// 删除周排班弹窗时间
			deleteTime (index) {
				this.specialTimeList.splice(index, 1)
			},
			// 修改特殊开始时间
			changeStartTime (e, index) {
				this.specialTimeList[index].startTime = e
				this.specialTimeList[index].start_time = moment(this.specialTimeList[index].startTime).format("HH:mm")
				if (this.specialTimeList[index].start_time >= this.specialTimeList[index].end_time && this.specialTimeList[index].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
			},
			// 修改特殊结束时间
			changeEndTime (e, index) {
				this.specialTimeList[index].endTime = e
				this.specialTimeList[index].end_time = moment(this.specialTimeList[index].endTime).format("HH:mm")
				if (this.specialTimeList[index].start_time >= this.specialTimeList[index].end_time && this.specialTimeList[index].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
			},
			// 选择选择周期
			changeWeekDay (key) {
				Array.prototype.indexOf = function (val) {
					for (let i = 0; i < this.length; i++) {
						if (this[i] == val) return i
					}
					return -1
				}
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val)
					if (index > -1) {
						this.splice(index, 1)
					}
				}
				if (this.weekDayKey.indexOf(key) != -1) {
					this.weekDayKey.remove(key)
				} else {
					this.weekDayKey.push(key)
				}
			},
			// 特殊日期禁止当天之前的时间
			disabledDateDay (current) {
				return current.valueOf() < new Date().getTime() - 86400000;
			},
			// 添加特殊时间段
			addSpecialDate (index) {
				let specialDate = {
					specialDate: [moment(new Date()), moment(new Date())],
					date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
					time       : [
						{
							startTime : moment('00:00', 'HH:mm'),
							endTime   : moment('00:00', 'HH:mm'),
							start_time: '00:00',
							end_time  : '00:00',
							userList  : [],
							party     : []
						}
					],
				}
				this.info.specialDateList.splice(index + 1, 0, specialDate)
			},
			// 删除index特殊时间段
			deleteSpecialDate (index) {
				this.info.specialDateList.splice(index, 1)
			},
			// 修改特殊时间日期
			changeSpecialDate (e, index) {
				if (e && e.length > 1) {
					this.info.specialDateList[index].specialDate = e
					this.info.specialDateList[index].date = [moment(e[0]).format("YYYY-MM-DD"), moment(e[1]).format("YYYY-MM-DD")]
					this.$forceUpdate()
				}
			},
			// 修改特殊时间段 开始时间
			changeSpecialStartTime (e, index, timeIndex) {
				this.info.specialDateList[index].time[timeIndex].startTime = e
				this.info.specialDateList[index].time[timeIndex].start_time = e.format("HH:mm")
				if (this.info.specialDateList[index].time[timeIndex].start_time >= this.info.specialDateList[index].time[timeIndex].end_time && this.info.specialDateList[index].time[timeIndex].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
				this.$forceUpdate()
			},
			// 修改特殊时间段 结束时间
			changeSpecialEndTime (e, index, timeIndex) {
				this.info.specialDateList[index].time[timeIndex].endTime = moment(e._d, "HH:mm")
				this.info.specialDateList[index].time[timeIndex].end_time = e.format("HH:mm")
				if (this.info.specialDateList[index].time[timeIndex].start_time >= this.info.specialDateList[index].time[timeIndex].end_time && this.info.specialDateList[index].time[timeIndex].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
				this.$forceUpdate()
			},
			// 添加特殊时间某个日期下时间
			addSpecialDateTimeList (index, timeIndex) {
				let time = {
					startTime : moment('00:00', 'HH:mm'),
					endTime   : moment('00:00', 'HH:mm'),
					start_time: '00:00',
					end_time  : '00:00',
					userList  : [],
					party     : []
				}
				this.info.specialDateList[index].time.splice(timeIndex + 1, 0, time)
			},
			// 删除特殊时间某个日期下时间
			deleteSpecialDateTimeList (index, timeIndex) {
				this.info.specialDateList[index].time.splice(timeIndex, 1)
			},
			rowClassName () {
				let className = 'light-row';
				return className;
			},
			//客户标签
			modalVisibleChange4 (event, arr) {
				if (event == "ok") {
					this.tag_arr = arr.split(',')
				}
			},
			//获取内容殷勤分组列表
			async getGroup (key) {
				const {data: res} = await this.axios.post("attachment/group", {
					uid       : localStorage.getItem('uid'),
					is_channel: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList1 = res.data.group
					this.selectGroupId1 = key || this.groupList1[0].key
				}
			},
			//扫码推送
			changeStatus (value) {
				// console.log(value)
				this.pushValue = value
			}
			,
			changeText(text, textVale) {
				this.textContent = text
				this.textAreaValueHeader = textVale
			}
		},
		created () {
			if (typeof this.corpId != "undefined") {
				// 获取单人类型下成员列表
				this.getUserList()
				// 获取部门列表
				this.getPartyList()
			}
			this.urlId = this.$route.query.id
			if (this.$route.query.groupId == '') {
				this.info.way_group_id = ''
			} else {
				this.info.way_group_id = Number(this.$route.query.groupId)
			}
			if (typeof this.urlId != "undefined") {
				this.isLoading = true;
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/channelCode/list')
				this.getDetail()
			} else {
				this.editorFlag = true
			}
			const _this = this
			this.$store.dispatch("getWx", info => {
				_this.wxInfo = info

				if (!_this.avatarImg) {
					_this.avatarImg = _this.wxInfo[_this.$store.state.wxNumIndex].head_img
				}
			})
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
		margin: 0px 0px 5px 10px;
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
		padding: 10px 0;
		border-bottom: 1px solid #E2E2E2;
	}

	.content-bd {
		background: #F5F5F5;
		overflow: hidden;
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
		/*margin: 0 5px;*/
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
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

	.index {
		float: left;
		width: 30px;
		height: 38px;
		line-height: 38px;
		text-align: center;
		border-right: 1px solid #D8D8D8;
	}

	.type {
		display: inline-block;
		width: 57px;
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
		width: 560px;
		max-height: 630px;
		height: 360px;
		background: #FFF;
		border: 1px solid #D8D8D8;
		padding: 24px;
		overflow: hidden;
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

	.audio {
		width: 100%;
		height: 150px;
		padding: 50px 20px;
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

	.second1 {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
		animation: fadeInOut 1s infinite 0.2s;
	}

	.third1 {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
		animation: fadeInOut 1s infinite 0.4s;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
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

	/deep/ .ant-form-item {
		margin: 5px 0 5px 0;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
	}

	.changeType-text {
		background: @color-bgc;
		border: 1px solid @border-color;
		border-radius: 2px;
		padding: 7px 27px 6px 10px;
		font-size: 12px;
		width: 100%;
		margin-top: 12px;
		max-width: 673px;
		line-height: 20px;
		margin-bottom: 15px;
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

	/deep/ .ant-form-item-children {
		display: block;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	/deep/ .emoji {
		font-size: 20px;
		height: 40px !important;
		width: 40px !important;
	}

	.icon-btn {
		margin-right: 10px;
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

		p {
			display: inline-block;
		}
	}

	/deep/ .inputTitle2 {
		background: #FFF;
		height: 104px;
		padding: 20px;

		p {
			display: inline-block;
			word-break: break-word;
			width: calc(100% - 74px);
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			float: left;
		}
	}

	.hideMask {
		color: rgba(0, 0, 0, 0.25);
		background-color: #F5F5F5;
		cursor: not-allowed;
		opacity: 0.5;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/deep/ .ant-tag {
		margin-right: 5px;
		height: 26px;
		line-height: 25px;
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

	.upload-wrap-pic {
		max-width: 80px;
		max-height: 80px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
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

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
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

	/deep/ .light-row {
		background: #FFF;
	}

	.border-dashed {
		border-bottom: 1px dashed #E2E2E2;
	}
</style>