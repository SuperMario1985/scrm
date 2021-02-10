<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden;">
				<a-layout
						style="position: absolute; top:0; bottom:0; right:0;left: 0; overflow-x: hidden; overflow-y: auto;"
						class="scroll">
					<!-- 头部 -->
					<a-layout-header style="margin-bottom:20px;">
						<label class="tpl-title">历史朋友圈列表</label>
						<help-icon help-url="https://support.qq.com/products/104790/faqs/82247"></help-icon>
					</a-layout-header>
					<div style="padding: 0 1.24rem;" v-if="isTabShow">
						<span @click="changeTab(1)" style="border:none" class="tabBtn"
						      :class="{activeBtn:momentStatus == 1}">待审核</span>
						<span @click="changeTab(2)" style="border:none" class="tabBtn"
						      :class="{activeBtn:momentStatus == 2}">已发布</span>
					</div>
					<!-- 内容 -->
					<div style="padding: 15px;margin: 0px 20px;background: #FFF;">
						<div class="content-msg" v-if="momentStatus==2">
							<p style="margin-bottom: 2px;">
								使用场景：由于受到企业微信限制，通过企业微信【客户朋友圈】功能发布的朋友圈内容，可以发送到客户个人微信的朋友圈里，但是无法通过企业微信员工名片信息页查看历史朋友圈信息的入口。现在，企业可通过云美来SCRM系统【历史朋友圈】的功能，将朋友圈页面配置到企业微信员工对外信息展示中，方便客户查看历史的朋友圈内容。
							</p>
							<p style="margin-bottom: 2px;">
								1、需要企业微信管理员在企业微信后台设置成员对外展示信息；
							</p>
							<p style="margin-bottom: 2px;">
								2、企业成员在个人信息页添加自己的朋友圈页面链接；
							</p>
							<p style="margin-bottom: 0px;">
								3、设置完成后客户即可在企业成员的个人信息页面查看朋友圈。
							</p>
						</div>
						<div class="content-hd">
							<a-col style="float: left;display: flex;align-items: center;height: 100%">
								<a-select
										v-if="corpLen > 1"
										showSearch
										optionFilterProp="children"
										style="width: 170px;margin-right: 5px;"
										@change="handleWxId"
										v-model="corpId"
								>
									<template v-for="item in corpInfo">
										<a-select-option :value="item.corpid">{{
											item.corp_full_name ||
											item.corp_name
											}}
										</a-select-option>
									</template>
								</a-select>
								<a-input v-if="momentStatus==2" @keyup.enter="searchContent" style="width: 280px"
								         v-model="searchInput"
								         placeholder="请输入内容标题"/>
								<a-select
										v-if="momentStatus==1"
										showSearch
										optionFilterProp="children"
										style="width: 170px;margin-right: 5px;"
										@change="searchContent"
										v-model="auditStatus"
								>
									<template
											v-for="(item,index) in [{value:0,title:'全部'},{value:2,title:'待审核'},{value:3,title:'审核失败'}]">
										<a-select-option :value="item.value">{{item.title}}</a-select-option>
									</template>
								</a-select>
								<a-button @click="searchContent" class="btn-primary" type="primary">
									查找
								</a-button>
								<a-button class="btn-primary" @click="clearText">
									清空
								</a-button>
							</a-col>
							<a-col style="float:right;" v-if="momentStatus==2">
								<a-button class="btn-primary" @click="openDrawer()" v-has="'circleOfFriends-address'">
									获取员工朋友圈地址
								</a-button>
								<a-button :loading="settingLoading" class="btn-primary" @click="setting()"
								          type="primary"
								          v-has="'circleOfFriends-set'">
									通用设置
								</a-button>
								<a-button class="btn-primary" @click="addWelcomeText()" type="primary"
								          v-has="'circleOfFriends-add'">
									发表
								</a-button>
							</a-col>
							<!--			通用设置弹框				-->
							<a-modal v-model="settingVisible" title="通用设置" width="1000px"
							         @cancel="cancelChangeSetting">
								<template slot="footer">
									<a-button key="back" @click="cancelChangeSetting">取消</a-button>
									<a-button
											:loading="sendLoading"
											key="submit"
											type="primary"
											@click="handleChangeSetting"
									>提交
									</a-button>
								</template>
								<template>
									<div class="left">
										<a-form style="padding-right: 10px">
											<a-form-item
													style="padding-bottom:5px;margin-bottom:15px;"
													:label-col="{ span: 5}"
													:wrapper-col="{ span: 16 }">
											<span slot="label"><span
													style="color: red">*</span>选择应用
											</span>
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
													<div class="content-msg2" style="font-size: 13px;">
														<p style="height: 20px; line-height: 20px; margin-bottom: 2px">
															1、前往<a
																target="_blank"
																href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
															企业微信后台</a>创建自建应用。<a target="_blank"
															                    href="https://support.qq.com/products/104790/faqs/63937">
															教程</a></p>
														<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">
															2、选择此应用，请确认已设置过应用的可信域名。
															<a :href="$store.state.commonUrl+'/upload/slider.png'"
															   target="_blank"
															   class="el-link el-link--primary">
																<span class="el-link--inner">查看图示</span>
															</a>
														</p>
													</div>
												</template>
											</a-form-item>

											<a-form-item :label-col="{ span: 5}"
											             :wrapper-col="{ span: 16 }">
											<span slot="label">背景图
											</span>
												<div style="line-height: 16px">
													<a-upload
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															list-type="picture-card"
															:fileList="fileList"
															@preview="handlePreview"
															:beforeUpload="beforeUploadPic"
															@change="e => handleChangePic(e)"
													>
														<div v-if="fileList.length<1">
															<a-icon type="plus"
															        style="font-size: 16px;position: absolute;top: 35%;left: 50%;transform: translate(-50%,-50%)"/>
															<div class="selectPhoto">选择图片</div>
														</div>
													</a-upload>
													<span style="font-size: 12px;color: #2596FF;">尺寸建议：740 * 420</span>
													<div style="margin: 10px 0  13px">
														<a-checkbox v-model="show1" @change="checkboxChange">
															勾选上后，允许成员在手机端修改
														</a-checkbox>
													</div>
												</div>
												<a-modal :visible="previewVisible" :footer="null"
												         @cancel="handleCancel">
													<img alt="example" style="width: 100%" :src="previewImage"/>
												</a-modal>
											</a-form-item>
											<a-form-item :label-col="{ span: 5}"
											             :wrapper-col="{ span: 19 }">
												<span slot="label">员工手机端发表</span>
												<template>
													<a-switch @change="switch1Change"
													          :checked="isContext==1"/>
													<span style="margin-left: 1rem">（开启后，员工可以在手机端发表内容。）</span>
												</template>
											</a-form-item>
											<a-form-item :label-col="{ span: 5}" v-if="isContext==1"
											             :wrapper-col="{ span: 19 }">
												<span slot="label">员工发表内容审核</span>
												<template>
													<a-switch @change="switch2Change"
													          :checked="isAudit==0"/>
													<span style="margin-left: 1rem">（开启后，员工在手机端发表内容，通过审核后，自动发布。）</span>
												</template>
											</a-form-item>
											<a-form-item :label-col="{ span: 5}"
											             :wrapper-col="{ span: 19 }">
												<span slot="label">头像</span>
												<template>
													<a-radio-group
															style="width:100%;line-height: 40px;margin-bottom: 10px"
															v-model="photoValue" @change="photoChange">
														<a-radio :value="1">
															以成员的头像为准
														</a-radio>
														<br/>
														<a-radio :value="0">
															系统自定义，成员不可更改
														</a-radio>
													</a-radio-group>
													<a-upload
															v-if="photoValue==0"
															class="upload-pic"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															list-type="picture-card"
															:fileList="fileList2"
															@preview="handlePreview2"
															:beforeUpload="beforeUploadPic2"
															@change="e => handleChangePic2(e)"
													>
														<div v-if="fileList2.length<1">
															<a-icon type="plus"
															        style="font-size: 16px;position: absolute;top: 35%;left: 50%;transform: translate(-50%,-50%)"/>
															<div class="selectPhoto">选择图片</div>
														</div>
													</a-upload>
												</template>
												<a-modal :visible="previewVisible2" :footer="null"
												         @cancel="handleCancel2">
													<img alt="example" style="width: 100%" :src="previewImage2"/>
												</a-modal>
											</a-form-item>
											<a-form-item :label-col="{ span: 5}"
											             :wrapper-col="{ span: 16 }">
									<span slot="label">个性签名
											</span>
												<div style="line-height: 20px;margin-top: 5px;margin-bottom: 10px">
													<div>
														<a-textarea
																:maxLength="25"
																v-model="selfText" placeholder="请输入个性签名"
																:autoSize="{ minRows: 5, maxRows: 9 }"
														/>
														<span style="float: right;">
													{{selfText.length}}/25
												</span>
													</div>
													<div style="clear: both"></div>
													<a-checkbox v-model="show2" @change="checkboxChange2">
														勾选上后，允许成员在手机端修改
													</a-checkbox>
												</div>
											</a-form-item>
										</a-form>
									</div>
									<div class="right">
										<img src="../../../assets/wxHeader.png" alt
										     style="width:100%;border-bottom:1px solid #F1F3F5;"/>
										<div class="photo">
											<img v-if="img1 !=null&&this.fileList" :src="img1" alt=""
											     class="right_photo1">
											<div class="headPhoto">
												<img v-if="img2 !=null &&img2 !=''&& photoValue==0"
												     :src="commonUrl+img2" alt=""
												     class="right_photo2">
												<img v-if="(img2 ==null||img2 =='') && photoValue==0"
												     src="../../../assets/userHeader.png" alt=""
												     class="right_photo2">
												<img v-if="photoValue==1" src="../../../assets/userHeader.png" alt=""
												     class="right_photo2">
											</div>
										</div>
										<div style="margin-top: 25px">
											<span class="self_text">{{selfText}}</span>
										</div>
									</div>
								</template>
							</a-modal>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<div class="spin-content">
									<a-table :columns="momentStatus===1?columns:columns3"
									         style="border: 1px solid #E2E2E2;"
									         :data-source="welcomeList"
									         :pagination="false"
									         :rowClassName="rowClassName" v-has="'circleOfFriends-list'">
										<span slot="content" slot-scope="text, record, index">
											<a-form>
												<a-form-item v-if="record.context!=''" label="文本"
												             :label-col="{ span:3 }"
												             :wrapper-col="{ span: 20 }">
														<a-popover placement="top">
													<div class="title_lh" style="overflow : hidden;
																				text-overflow: ellipsis;
																				display: -webkit-box;
																				-webkit-line-clamp: 3;
																				-webkit-box-orient: vertical;">{{record.context}}</div>
													<pre slot="content"
													     style="display:block;white-space: pre-wrap;word-wrap: break-word;line-height: 20px;color: #000;max-width: 600px;margin-bottom: -3px">{{record.context}}</pre>
													</a-popover>
												</a-form-item>
											</a-form>
											<div v-if="(record.info && record.info!=[] && record.info.length>0)||typeof record.info=='object'">
												<div v-if="record.type==2 || record.type==1">
													<a-form v-if="record.info&&record.info.length>0">
														<a-form-item label="图片" :label-col="{ span:3 }"
														             :wrapper-col="{ span: 20 }">
																<div v-for="(item,index) in record.info"
																     style="display: inline-block">
													<img
															style="width: 60px;height: 50px;margin-right: 5px;margin-bottom:2px;object-fit: contain;"
															:src="item.s_local_path?commonUrl+item.s_local_path:commonUrl+item.local_path"
															:id="item.id"
															alt="example"
															slot="cover"
															@click="previewPic(record.info,index)"/>
												    </div>
														</a-form-item>
													</a-form>
												</div>
												<div v-if="record.type==3">
													<a-form>
														<a-form-item label="视频" :label-col="{ span:3 }"
														             :wrapper-col="{ span: 21 }">
															<video-player
																	class="video-player vjs-custom-skin"
																	ref="videoPlayer"
																	style="width: 200px;"
																	:playsinline="true"
																	:options="playerOptions[index]"
															></video-player>
														</a-form-item>
													</a-form>
												</div>
												<div v-if="record.type==4">
													<a-form>
														<a-form-item label="链接" :label-col="{ span:3 }"
														             :wrapper-col="{ span: 20 }">
																	<div v-if="record.info.length>0"
																	     style="width: 100%;">
																		<div style="width: 90%; display: flex;height: 70px;background: #F1F3F5;">
																			<div style="width:70px;height: 70px;padding: 10px">
																				<img v-if="record.info[0].pic_url!=''"
																				     class="input_img2"
																				     :src="record.info[0].pic_url.substr(0, 1) =='/'?commonUrl+record.info[0].pic_url:record.info[0].pic_url"
																				     alt=""/>
																				<img v-if="record.info[0].pic_url==''"
																				     class="input_img2"
																				     src="../../../assets/url.png"
																				     alt=""/>

																			</div>
																			<div style="flex-grow: 1;height: 70px;">
																				<div class="inp_title">
																					{{record.info[0].title}}
																				</div>
																				<div class="input_text3">
																					{{record.info[0].description}}
																				</div>
																			</div>
																		</div>
																	</div>
														</a-form-item>
													</a-form>
												</div>

											</div>
										</span>
										<span slot="ownership1" slot-scope="text, record, index">
											<template v-for="item in record.ownership">
												 <a-tag style="margin-bottom: 3px" color="orange">
												       {{item.name||item.title}}
												 </a-tag>
											</template>
										</span>
										<span slot="ownership" slot-scope="text, record, index">
											<span v-if="!record.ownership">
												 <a-tag color="green">
												  --
												 </a-tag>
											</span>
											<span v-if="record.ownership && record.is_mobile==1 && record.ownership.length<1">
												 <a-tag color="green">
												  全部成员
												 </a-tag>
											</span>
											<template v-if="record.ownership.length>0 && record.ownership.length<6 ">
												<template v-for="item in record.ownership">
													<a-tag style="margin-bottom: 3px" color="blue"
													       v-if="item.scopedSlots && item.scopedSlots.title && item.scopedSlots.title == 'title'">
													       {{item.name||item.title}}
													 </a-tag>
													 <a-tag style="margin-bottom: 3px" color="orange"
													        v-if="item.scopedSlots && item.scopedSlots.title && item.scopedSlots.title != 'title'">
													       {{item.name||item.title}}
													 </a-tag>
												</template>
											</template>
											<template v-if="record.ownership.length>5">
												<a-popover placement="top">
													 <div style="width: 400px" slot="content">
														 <template v-for="item in record.ownership">
															<a-tag style="margin-bottom: 3px" color="blue"
															       v-if="item.scopedSlots && item.scopedSlots.title && item.scopedSlots.title == 'title'">
															       {{item.name||item.title}}
															 </a-tag>
															 <a-tag style="margin-bottom: 3px" color="orange"
															        v-if="item.scopedSlots && item.scopedSlots.title && item.scopedSlots.title != 'title'">
															       {{item.name||item.title}}
															 </a-tag>
														</template>
													 </div>
													 <template v-for="item in record.ownership.slice(0,5)">
														 <a-tag style="margin-bottom: 3px" color="blue"
														        v-if="item.scopedSlots && item.scopedSlots.title && item.scopedSlots.title == 'title'">
														       {{item.name||item.title}}
														 </a-tag>
														 <a-tag style="margin-bottom: 3px" color="orange"
														        v-if="item.scopedSlots && item.scopedSlots.title && item.scopedSlots.title != 'title'">
														       {{item.name||item.title}}
														 </a-tag>
													 </template>
													 <span>等共计{{getUserNum(record.ownership)}}位成员、{{record.ownership.length - getUserNum(record.ownership)}}个部门</span>
												</a-popover>
											</template>
	                                    </span>
										<span slot="action" slot-scope="text, record, index">
												<a-button v-if="record.send_success==2" @click="editList(record)"
												          style="margin: 0 5px 5px 0"
												          v-has="'circleOfFriends-edit'">编辑</a-button>
												<a-button v-if="record.status==2||record.status==3"
												          @click="auditList(record)" v-has="'circleOfFriends-examine'"
												          style="margin: 0 5px 5px 0">{{record.status == 2 ? '审核' : '继续审核'}}</a-button>
												<a-button v-if="record.status==1&&record.send_success!=2"
												          @click="checkDetail(record,index)"
												          style="margin: 0 5px 5px 0"
												          :loading="detailLoading"
												          v-has="'circleOfFriends-detail'">浏览详情</a-button>
												<a-button @click="deleteList(record.title,record.id)"
												          v-has="'circleOfFriends-delete'">删除</a-button>
											</span>
										<span slot="sort" slot-scope="text, record,index">
											{{index + 1}}
										</span>
										<span slot="userName" slot-scope="text, record,index">
											<span v-if="record.user_name"> {{record.user_name}}</span>
										<span v-if="!record.user_name"> -- </span>
										</span>
										<span slot="time" slot-scope="text, record">
											<span v-if="record.send_success==0 || record.send_success==1&&record.send_time"> {{record.send_time}}</span>
											<span v-if="record.send_success==2"> -- </span>
											<span v-if="record.send_success==0 || record.send_success==1&&!record.send_time"> {{record.create_time}} </span>

										</span>
										<span slot="status" slot-scope="text, record">
												<span v-if="record.status==='1'">已审核</span>
												<span v-if="record.status==='2'">未审核</span>
												<span v-if="record.status==='3'" style="color: red">审核失败</span>
										</span>
										<span slot="state" slot-scope="text, record">
											<span v-if="record.send_success==0">失败</span>
											<span v-if="record.send_success==1">发送成功</span>
											<span v-if="record.send_success==2">待发送</span>
											<span v-if="record.send_success==2">(定时在 {{record.send_time}} 发送)</span>
										</span>
										<span slot="reply" slot-scope="text, record">
													<a-popover v-if="record.reply!=''" placement="top"
													           style="overflow: hidden">
													<div style="overflow : hidden;
																width: 100%;
																text-overflow: ellipsis;
																-webkit-line-clamp: 3;
																-webkit-box-orient: vertical;">{{record.reply}}</div>
													<pre slot="content"
													     style="display:block;white-space: pre-wrap;word-wrap: break-word;line-height: 20px;color: #000;max-width: 600px;margin-bottom: -3px">{{record.reply}}</pre>
													</a-popover>
												<span v-if="!record.reply"> -- </span>
										</span>
										<span slot="audit_time" slot-scope="text, record">
											<span v-if="record.audit_time"> {{record.audit_time}}</span>
											<span v-if="!record.audit_time"> -- </span>
										</span>
									</a-table>
								</div>
								<!-- 分页 -->
								<div class="pagination"
								     style="width: 100%;margin: 20px 0px;"
								     v-show="total > 0" v-has="'circleOfFriends-list'">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total}}</span>条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
										              :current="this.page"
										              :pageSize="this.pageSize"
										              :pageSizeOptions="['15','30','50','100']"
										              @change="changePage"
										              @showSizeChange="showSizeChange"/>
									</div>
								</div>
								<!-- 详情页面 -->
								<a-drawer placement="right" :closable="false" @close="onClose" :visible="visible">
									<a-tabs defaultActiveKey="1">
										<a-tab-pane tab="消息内容" key="1">
											<div class="msg_content">
												<img src="../../../assets/wxHeader.png" alt=""
												     class="msg_content_header">
												<div style="padding: 20px 15px;">
													<!--文本-->
													<div v-if="text" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<span class="item-info msg_content_txt">{{text}}</span>
													</div>
													<!--图片-->
													<div v-if="add_type == 1" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<img
																:src="commonUrl+img" alt
																style="width: 150px;border-radius: 4px;"/>
													</div>
													<!--网址-->
													<div v-if="add_type == 2" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<div class="item-info msg_content_txt2">
															<p class="url-title">{{inputTitle}}</p>
															<div style="overflow: hidden;">
																<div class="url-text">{{digest}}</div>
																<img :src="commonUrl+msgUrl" alt="" class="url-img">
															</div>
														</div>
													</div>
													<!--小程序-->
													<div v-if="add_type == 3" class="mt">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36" style="margin-right: 10px;float: left;"/>
														<div class="item-info msg_content_txt2">
															<p class="url-title" style="color: #A3A3A3;">
																{{appletInputTitle}}</p>
															<p class="applet-title">{{appletInputTitle}}</p>
															<img :src="commonUrl+appletUrl" alt="" style="width: 100%;">
														</div>
													</div>
												</div>
											</div>
										</a-tab-pane>
									</a-tabs>
								</a-drawer>
							</a-spin>
							<a-drawer
									class="scroll2"
									placement="right"
									:closable="false"
									:visible="recordVisible"
									@close="recordDrawerClose"
									width="900px!important"
							>
								<div slot="title">
									企业成员
								</div>
								<div style="background:#F0F2F5">
									<div style="padding: 10px 20px 20px;">
										<div class="content-msg">
											<!--												<p style="margin-bottom: 2px;">1、欢迎语又称新好友自动回复，此处可添加文字、图片、图文链接及小程序，客户来了不用担心冷场！</p>-->
											<!--												<p style="margin-bottom: 2px;">-->
											<!--													2、每个企业成员均可以拥有不同的欢迎语。当通用的欢迎语和个人专属的欢迎语并存的情况下，优先自动回复个人专属的欢迎语。</p>-->
											<p style="margin-bottom: 0px;">
												<span style="color: #F56C6C">给具有外部联系人权限的成员发送链接：可以复制下面的链接发送给对应的员工，由员工自行填写至企业微信对外展示信息中</span>
											</p>
										</div>
										<div style="float: right;margin:10px 0;">
											<a-input-search allow-clear placeholder="请输入员工姓名" v-model="userName"
											                style="width: 200px;margin-right: 15px;display: inline-block"
											                @search="onSearch"/>
											<a-dropdown>
												<a-menu slot="overlay" @click="exportData">
													<a-menu-item key="0">当前页导出</a-menu-item>
													<a-menu-item key="1">全部导出</a-menu-item>
												</a-menu>
												<a-button type="primary"  style="margin: 0 0 10px 0;">导出
													<a-icon style="color: #FFFFFF;" type="down"/>
												</a-button>
											</a-dropdown>
											<a-button style="margin-left: 15px" class="btn-primary1"
											          icon="reload" @click="syncFollowUser">
												同步配置了外部联系权限的联系人
											</a-button>
										</div>

									</div>
									<div style="margin-top:1rem;background: #F0F2F5;padding: 0px 20px 135px 20px">
										<a-spin tip="加载中..." size="large" :spinning="isLoading2">
											<a-table :columns="columns2" :data-source="userList" :pagination="false"
											         :rowClassName="rowClassName">
											<span slot="sort" slot-scope="text, record,index">
												{{index + 1}}
											</span>
												<span slot="users" slot-scope="text, record,index">
											<a-avatar v-if="record.avatar" shape="square"
											          :src="record.avatar" style="float: left;"/>
											<img style="    width: 32px;height: 32px;float: left;"
											     v-if="!record.avatar" src="../../../assets/useradvart.png"/>
											<div style="float: left;max-width: 270px;word-wrap:break-word;height: 21px;">
												<a-popover placement="top">
													<span slot="content">
														{{record.name}}
													</span>
													<div
															style="vertical-align: middle;display: inline-block; margin-left: 10px;max-width: 140px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
														{{record.name}}
													</div>
												</a-popover>

											</div>
											<span style="vertical-align: sub;">
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
											</span>
												<div slot="url" slot-scope="text, record">
													<div style="max-width: 270px;word-wrap:break-word;height: 21px;">
														<a-popover placement="top">
													<span slot="content">
														{{record.moments_url}}
													</span>
															<div
																	style="vertical-align: middle;display: inline-block;max-width: 270px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
																{{record.moments_url}}
															</div>
														</a-popover>
													</div>
												</div>
												<span slot="action" slot-scope="text, record">
												<a-button @click="copyText(record.moments_url)">复制</a-button>
											</span>
											</a-table>

											<!-- 分页 -->
											<div class="pagination"
											     style="width: 100%;position: absolute;margin: 20px 0px;"
											     v-show="total2 > 0">
												<div style="height: 32px;float: left;line-height: 32px;">
													共
													<span style="color: blue">{{total2}}</span>条
												</div>
												<div class="pagination" style="height: 32px;float: right;">
													<a-pagination :total="total2" showSizeChanger
													              :showQuickJumper="quickJumper2"
													              :current="page2"
													              :pageSize="page_size"
													              :pageSizeOptions="['15','30','50','100']"
													              @change="changePage2"
													              @showSizeChange="showSizeChange2"/>
												</div>
											</div>
											<!-- 详情页面 -->
											<a-drawer placement="right" :closable="false" @close="onClose"
											          :visible="visible">
												<a-tabs defaultActiveKey="1">
													<a-tab-pane tab="消息内容" key="1">
														<div class="msg_content">
															<img src="../../../assets/wxHeader.png" alt=""
															     class="msg_content_header">
															<div style="padding: 20px 15px;">
																<!--文本-->
																<div v-if="text" class="mt">
																	<a-avatar
																			src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																			:size="36"
																			style="margin-right: 10px;float: left;"/>
																	<span class="item-info msg_content_txt">{{text}}</span>
																</div>
																<!--图片-->
																<div v-if="add_type == 1" class="mt">
																	<a-avatar
																			src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																			:size="36"
																			style="margin-right: 10px;float: left;"/>
																	<img
																			:src="commonUrl+img" alt
																			style="width: 150px;border-radius: 4px;"/>
																</div>
																<!--网址-->
																<div v-if="add_type == 2" class="mt">
																	<a-avatar
																			src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																			:size="36"
																			style="margin-right: 10px;float: left;"/>
																	<div class="item-info msg_content_txt2">
																		<p class="url-title">{{inputTitle}}</p>
																		<div style="overflow: hidden;">
																			<div class="url-text">{{digest}}</div>
																			<img :src="commonUrl+msgUrl" alt=""
																			     class="url-img">
																		</div>
																	</div>
																</div>
																<!--小程序-->
																<div v-if="add_type == 3" class="mt">
																	<a-avatar
																			src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																			:size="36"
																			style="margin-right: 10px;float: left;"/>
																	<div class="item-info msg_content_txt2">
																		<p class="url-title" style="color: #A3A3A3;">
																			{{appletInputTitle}}</p>
																		<p class="applet-title">{{appletInputTitle}}</p>
																		<img :src="commonUrl+appletUrl" alt=""
																		     style="width: 100%;">
																	</div>
																</div>
															</div>
														</div>
													</a-tab-pane>
												</a-tabs>
											</a-drawer>
										</a-spin>
									</div>
								</div>
								<!--								</template>-->
							</a-drawer>
							<!-- 图片预览 -->
							<a-modal :visible="previewVisible3" :footer="null" @cancel="handleCancel3"
							         class="preview-modal" width="100%"
							         centered>
								<a-carousel
										ref="previewCarousel2"
										arrows
										:dots="false"
										effect="fade"
										:adaptiveHeight="true">
									<div
											slot="prevArrow"
											slot-scope="props"
											class="custom-slick-arrow"
											style="left: 10px;zIndex: 1">
										<a-icon type="left-circle"/>
									</div>

									<div
											slot="nextArrow"
											slot-scope="props"
											class="custom-slick-arrow"
											style="right: 10px">
										<a-icon type="right-circle"/>
									</div>

									<div v-for="(preview, key) in photoArr"
									     style="width: 840px!important;height: 600px;position: relative;">
										<img
												alt=""
												v-lazy="commonUrl+preview.local_path"
												style="max-width:100%;max-height:100%;transform: translate(-50%, -50%);position:absolute;top: 50%;left: 50%;"
										/>
									</div>
								</a-carousel>
							</a-modal>
						</div>
					</div>
				</a-layout>
			</a-layout>
		</div>
		<!--  查看浏览详情	-->
		<div class="moment_detail">
			<a-modal style="height:20rem;overflow:hidden!important;" :visible="momentDetailDialog" width="20%"
			         title="查看浏览详情" @cancel="handleCancel4">
				<template slot="footer">
					<a-button key="back" @click="handleCancel4">取消
					</a-button>
				</template>
				<a-row style="margin-bottom: 10px" v-if="(is_mobile==1&&ownershipList.length>1)||isName==1">
					<a-col :span="16" :offset="4">
						<a-select
								showSearch
								:filterOption="false"
								optionFilterProp="children"
								style="width: 100%;display: inline-block;"
								@change="handleStaffChange"
								@search="searchName"
								@popupScroll="popScroll"
								v-model="selectedStaff"
						>
							<template v-for="item in ownershipList">
								<a-select-option :value="item.id">
									{{item.name}}
								</a-select-option>
							</template>
						</a-select>
					</a-col>
				</a-row>
				<div v-if="momentDetail">
					<a-row>
						<a-col :span="3">
							<a-avatar style="width: 50px;height: 50px" size="large" shape="square"
							          :src="momentDetail.heard_img.substr(0,1)=='/'?commonUrl+momentDetail.heard_img:momentDetail.heard_img"/>
						</a-col>
						<a-col :span="19" :offset="1">
							<div>
								<a-row>
									<span style=" font-size: 18px; color: #5077B7;font-weight: 900;">{{momentDetail.name}}
									</span>
								</a-row>
								<a-row v-if="momentDetail.context"
								       style="align-items:center;margin: 0 0 3px 0;white-space:pre-line">
									<a-popover placement="top" style="margin-bottom: 6px;max-height: 10rem;">
										<div style="overflow : hidden;text-overflow: ellipsis;
													display: -webkit-box;-webkit-line-clamp: 6;
													-webkit-box-orient: vertical;">{{momentDetail.context}}
										</div>
										<pre slot="content"
										     style="white-space: pre-wrap;word-wrap: break-word;line-height: 20px;color: #000;max-width: 600px;margin-bottom: -3px">{{momentDetail.context}}</pre>
									</a-popover>
								</a-row>
								<div class="covers" v-if="momentDetail.type==2">
									<div class="cover" v-for="(item,index) in momentDetail.info" :key='index'
									     v-if="item.local_path">
										<img :src="item.s_local_path?commonUrl+item.s_local_path:commonUrl+item.local_path"
										     @click="previewPic(momentDetail.info,index)"
										     width="95%" class="min" alt="">
									</div>
								</div>
							</div>
							<div v-if="momentDetail.type==3" style="margin: 0 0 10px 0">
								<a-form>
									<a-form-item :label-col="{ span:3 }"
									             :wrapper-col="{ span: 21 }">
										<video-player
												class="video-player vjs-custom-skin"
												ref="videoPlayer"
												style="width: 200px;"
												:playsinline="true"
												:options="playerOptions[videoIndex]"
										></video-player>
									</a-form-item>
								</a-form>
							</div>
							<div v-if="momentDetail.type==4" style="margin: 10px 0 10px 0">
								<a-form>
									<a-form-item :label-col="{ span:3 }"
									             :wrapper-col="{ span: 20 }">
										<div v-if="momentDetail.info!={} && momentDetail.info!=null"
										     style="width: 100%;">
											<div style="width: 90%; display: flex;height: 70px;background: #F1F3F5;">
												<div style="width:70px;height: 70px;padding: 10px">
													<img v-if="momentDetail.info[0].pic_url!=''"
													     class="input_img2"
													     :src="momentDetail.info[0].pic_url.substr(0,1)=='/'?commonUrl+momentDetail.info[0].pic_url:momentDetail.info[0].pic_url"
													     alt=""/>
													<img v-if="momentDetail.info[0].pic_url==''"
													     class="input_img2"
													     src="../../../assets/url.png" alt=""/>

												</div>
												<div style="flex-grow: 1;height: 70px;">
													<div class="inp_title">
														{{momentDetail.info[0].title}}
													</div>
													<div class="input_text3">
														{{momentDetail.info[0].description}}
													</div>
												</div>
											</div>
										</div>
									</a-form-item>
								</a-form>
							</div>
							<a-row>
								<a-col :span="16">{{momentDetail.create_time}}</a-col>
								<a-col :span="4" :offset="2"><a v-has="'circleOfFriends-delete'"
								                                @click="confirmDeleteMoment">刪除</a></a-col>
							</a-row>
						</a-col>

					</a-row>

					<div class="reply" v-if="momentDetail.line.length>0">
						<a-row class="reply-content" v-for="(item,index) in momentDetail.line" :key="index"
						>
							<a-col :span="3">
								<a-avatar size="large" shape="square"
								          :src="item.heard_img.substr(0,1)=='/'?commonUrl+item.heard_img:item.heard_img"/>
							</a-col>
							<a-col :span="20" :offset="1">
								<a-row>
									<a-col :span="20">
										{{item.name}}
									</a-col>
								</a-row>
								<a-row>
									<a-col :span="24">{{item.context}}</a-col>
								</a-row>
							</a-col>
						</a-row>
					</div>
				</div>
			</a-modal>
		</div>
	</div>
</template>

<script>
	import MyIcon from "@/components/MyIcon.vue"
	import {videoPlayer} from "vue-video-player"
	import "video.js/dist/video-js.css"
	import MD5 from "js-md5";
	import helpIcon from "@/components/helpIcon";
	import chooseStaffSelect from "@/components/ChooseStaffSelect"

	const columns = [
		{
			title      : "序号",
			dataIndex  : "sort",
			key        : "sort",
			width      : "5%",
			scopedSlots: {customRender: "sort"}
		},
		{
			title      : "发布来源",
			dataIndex  : "title",
			key        : "title",
			width      : "180px",
			scopedSlots: {customRender: "title"}
		},

		{
			title      : "创建成员",
			dataIndex  : "ownership1",
			key        : "ownership1",
			width      : "10%",
			scopedSlots: {customRender: "ownership1"}
		},
		{
			title      : "审核状态",
			dataIndex  : "status",
			key        : "status",
			width      : "180px",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "审核人",
			dataIndex  : "userName",
			key        : "userName",
			width      : "120px",
			scopedSlots: {customRender: "userName"}
		},
		{
			title      : "原因",
			dataIndex  : "reply",
			key        : "reply",
			width      : '200px',
			ellipsis   : true,
			scopedSlots: {customRender: "reply"}
		},
		{
			title      : "最后一次审核时间",
			dataIndex  : "audit_time",
			key        : "audit_time",
			width      : "11%",
			scopedSlots: {customRender: "audit_time"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : "12%",
			scopedSlots: {customRender: "action"}
		}
	];
	const columns3 = [
		{
			title      : "序号",
			dataIndex  : "sort",
			key        : "sort",
			width      : "5%",
			scopedSlots: {customRender: "sort"}
		},
		{
			title      : "内容标题",
			dataIndex  : "title",
			key        : "title",
			width      : "180px",
			scopedSlots: {customRender: "title"}
		},
		{
			title      : "发布内容",
			dataIndex  : "content",
			key        : "content",
			width      : '180px',
			scopedSlots: {customRender: "content"}
		},
		{
			title      : "发送成员",
			dataIndex  : "ownership",
			key        : "ownership",
			width      : "15%",
			scopedSlots: {customRender: "ownership"}
		},
		{
			title      : "发送状态",
			dataIndex  : "state",
			key        : "state",
			width      : "120px",
			scopedSlots: {customRender: "state"}
		},
		{
			title      : "发布时间",
			dataIndex  : "time",
			key        : "time",
			width      : "11%",
			scopedSlots: {customRender: "time"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : "12%",
			scopedSlots: {customRender: "action"}
		}]
	const columns2 = [
		{
			title      : "序号",
			dataIndex  : "sort",
			key        : "sort",
			width      : "10%",
			scopedSlots: {customRender: "sort"}
		},

		{
			title      : "企业成员",
			dataIndex  : "users",
			key        : "users",
			width      : "30%",
			scopedSlots: {customRender: "users"}
		},

		{
			title      : "链接",
			dataIndex  : "url",
			key        : "url",
			width      : "50%",
			scopedSlots: {customRender: "url"}
		},

		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : "10%",
			scopedSlots: {customRender: "action"}
		}
	];

	function getBase64 (file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	export default {
		name      : "circleOfFriends",
		components: {MyIcon, videoPlayer, helpIcon, chooseStaffSelect},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				settingLoading    : false,
				detailLoading     : false,
				detailPage        : 1,
				index             : 0,
				recordId          : null,
				momentDetailDialog: false,
				momentDetail      : null,
				is_mobile         : null,
				baseId            : null,
				ownership         : [],
				reFresh           : false,
				momentStatus      : 2,
				videoIndex        : null,
				checkReply        : false,
				selectedStaff     : '',
				isName            : '',// 判断是不是名字搜索
				count             : null,
				ownershipList     : [],
				isTabShow         : true,
				form              : this.$form.createForm(this, {name: 'dynamic_rule'}),
				isSetting         : 0, // 是否设置了通用设置，决定能否点击获取员工朋友圈及发表
				searchInput       : '',  // 内容标题
				auditStatus       : 0,//审核状态
				sendLoading       : false, // 通用设置弹窗提交loading
				isOpen            : 0, //
				is_all            : '',
				isExport          : '',
				userName          : '',
				isLoading2        : true,
				total2            : 0,
				userList          : [],
				show1             : true,
				show2             : true,
				id                : 0,
				playerOptions     : [],
				photoArr          : [],
				previewVisible3   : false, //预览图片的弹窗显示与隐藏
				inputTitle        : '企业动态',
				webTitle          : '',
				isChangePhoto     : 0,
				recordVisible     : false,
				isCheck           : '', // 编辑传1获取设置
				title             : '',// 内容标题
				isTrue            : '',
				isTrue2           : '',
				upPhoto1          : '',
				upPhoto2          : '',
				sUpPhoto1         : '',
				selfText          : '',
				isHeader          : '',
				isContext         : 1,
				isAudit           : 0,
				img1              : '',
				img2              : '',
				previewImage      : '',
				previewVisible    : false,
				fileList          : [],
				previewImage2     : '',
				previewVisible2   : false,
				fileList2         : [],
				photoValue        : 0,
				appId             : '', // 选择的应用id
				appList           : [],// 应用列表
				settingVisible    : false,// 通用设置弹框
				corpInfo          : [], // 企业微信列表
				corpLen           : JSON.parse(localStorage.getItem('corpArr')).length,
				suite_id          : 1,//应用ID
				corpId            : corpId,//企业微信选中的id
				welcomeText       : '',//搜索欢迎语输入框内容
				welcomeList       : [],//欢迎语表格数组
				isLoading         : true, //Loading 组件显示与隐藏
				isLoading3        : true,
				publicOptions     : {
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
				//表格部分
				columns,
				columns2,
				columns3,
				//分页
				total             : 0, //总条数
				quickJumper       : false, // 是否显示快速跳转的控件
				quickJumper2      : false, // 是否显示快速跳转的控件
				page              : 1, //页码
				page2             : 1, //页码
				page_size         : 15, //每页数据量，默认15
				pageSize          : 15, //每页数据条数
				visible           : false,//详情页面的显示与隐藏
				add_type          : 0,//详情类型，1图片2网页3小程序0都没有
				text              : '',//详情抽屉，文本内容
				img               : '',//详情抽屉，图片类型，图片链接
				// inputTitle      : '',//详情抽屉，网址类型，标题
				digest            : '',//详情抽屉，网址类型，描述
				msgUrl            : '',//详情抽屉，网址类型，图片链接
				appletInputTitle  : '',//详情抽屉，小程序类型，标题
				appletUrl         : '',//详情抽屉，小程序类型，图片链接
				commonUrl         : this.$store.state.commonUrl, //公共的链接
			};
		},
		mounted () {
			this.getMomentList(this.momentStatus)
		},

		methods: {
			changeTab (type) {
				this.momentStatus = type
				this.page = 1
				this.getMomentList()
			},
			async getMomentList (type) {
				let that = this
				this.Loading = true
				let url = ''
				let data = {}
				if (this.momentStatus === 1) {
					url = 'moment/moment-audit-lists'
					data = {
						corpid   : this.corpId,
						page_size: this.pageSize,
						page     : this.page,
						status   : this.auditStatus
					}
				} else if (this.momentStatus === 2) {
					url = 'moment/moments-lists'
					data = {
						corp_id  : this.corpId,
						page_size: this.pageSize,
						page     : this.page,
						title    : this.searchInput, // 标题，用于搜索
						user_ids : '', // 成员id，用于搜索
						status   : '', // 状态，0全部，1已发送，2未发送
					}
				}
				const {data: res} = await this.axios.post(url, data)
				this.Loading = false
				if (res.data.lists) this.welcomeList = res.data.lists
				else this.welcomeList = res.data.data
				this.isSetting = res.data.is_setting
				this.total = parseInt(res.data.count);
				that.welcomeList.map((data, index) => {

					let obj = data.info
					if (data.type == 3 && obj != null && obj != '' && obj != []) {
						that.playerOptions[index] = {
							...that.publicOptions,
							sources: [
								{
									src : obj[0].local_path.substr(0, 1) == '/' ? that.commonUrl + obj[0].local_path : obj[0].local_path, // 路径
									type: "video/mp4" // 类型
								}
							]
						};
					}
				});
				this.isLoading = false;
			},
			// 获取员工朋友圈地址弹窗同步联系人
			async syncFollowUser () {
				this.isExport = ''
				this.is_all = ''
				this.selectedRowKeys = []
				this.isLoading2 = true
				this.$message.info("已进入后台刷新中，请耐心等待...");
				const {data: res} = await this.axios.post('work-follow-user/refresh-follow-user', {
					suite_id: 1,
					corp_id : this.corpId,
				})

				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg)
					this.isLoading2 = false
				} else {
					this.$message.destroy()
					this.$message.success("同步完成！");
					this.isLoading2 = false
					this.getUserList()
				}
			},
			// 复制员工朋友圈链接
			copyText (value) {
				let that = this
				const input = document.createElement('input')
				document.body.appendChild(input)
				input.setAttribute('value', value)
				input.select()
				if (document.execCommand('copy')) {
					document.execCommand('copy')
					that.$message.success("复制成功！")
				}
				document.body.removeChild(input)
			},
			// 查找企业员工
			onSearch () {
				// this.userName=''
				this.isExport = ''
				this.is_all = ''
				this.isLoading2 = true;
				this.getUserList()
			},
			// 导出企业员工列表
			exportData (e) {
				this.isOpen = 1
				// this.userName = ''
				this.isExport = 1
				this.is_all = e.key
				this.isLoading2 = true;
				this.getUserList()
			},
			// 列表内容预览图片
			previewPic (arr, index) {
				this.photoArr = arr
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.length == 1 && list[0] === "all") {
					this.previewVisible3 = true;
					this.$nextTick(() => {
						// 默认显示当前选中的资源
						this.$refs.previewCarousel2.goTo(index, false);
					});
				} else {
					if (list.indexOf('material-preview') != -1) {
						//存在
						this.previewVisible3 = true;
						this.$nextTick(() => {
							// 默认显示当前选中的资源
							this.$refs.previewCarousel2.goTo(index, false);
						});
					} else {
						return false
					}
				}
			},
			// 获取成员数量
			getUserNum (userList) {
				let num = 0
				for (let i = 0; i < userList.length; i++) {
					if (userList[i].scopedSlots.title == "custom") {
						num++
					}
				}
				return num
			},
			// 打开员工朋友圈链接弹窗
			openDrawer () {
				if (this.isSetting == 1) {
					this.isOpen = 0
					this.recordVisible = true
					this.isLoading2 = true;
					this.getUserList()
				} else {
					this.$message.destroy()
					this.$message.warning('请先完善通用设置');
				}
			},
			// 获取员工列表数据
			async getUserList (page = 1, page_size = this.page_size) {
				const {data: res} = await this.axios.post('moment/get-work-user', {
					corp_id  : this.corpId,
					name     : this.userName,
					page     : page,
					page_size: page_size,
					is_export: this.isExport,
					is_all   : this.is_all
				})
				if (res.error != 0) {
					this.isLoading2 = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading2 = false;
					if (this.isExport != 1) {
						this.total2 = parseInt(res.data.count)
						this.page2 = page;
						this.page_size = page_size;
						this.quickJumper2 = this.total2 > this.page_size;
						this.userList = res.data.data
					} else {
						if (this.isOpen == 1) {
							window.open(res.data.url);
						}
					}

				}
			},
			// 员工弹窗关闭
			recordDrawerClose () {
				this.userName = ''
				this.isOpen = 0
				this.recordVisible = false
			},
			// 朋友圈通用设置
			async setCircle () {
				if (typeof this.appId == 'object') {
					this.$message.destroy()
					this.$message.warning('请选择应用')
					return false
				}
				if (this.show1 == true) {
					this.isTrue = '1'
				} else {
					this.isTrue = '0'
				}

				if (this.show2 == true) {
					this.isTrue2 = '1'
				} else {
					this.isTrue2 = '0'
				}
				this.sendLoading = true
				const {data: res} = await this.axios.post('moment/moments-setting', {
					agent_id      : typeof this.appId == 'object' ? '' : this.appId,
					corp_id       : this.corpId,
					description   : this.selfText,
					banner_info   : this.upPhoto1,
					s_banner_info : this.sUpPhoto1,
					banner_type   : this.isTrue,
					heard_img     : this.upPhoto2,
					is_heard      : this.isChangePhoto,
					is_description: this.isTrue2,
					is_check      : '', // 编辑传1获取设置
					setting_id    : this.id, // 编辑传id
					is_context    : this.isContext,
					is_audit      : this.isAudit,
				})
				if (res.error != 0) {
					this.sendLoading = false
					this.$message.error(res.error_msg);
				} else {

					this.settingVisible = false
					this.sendLoading = false
					this.isSetting = res.success
					this.$message.success('配置成功');
				}
			},
			// 通用设置头像类型
			photoChange (e) {
				this.isChangePhoto = e.target.value
			},
			// 手机端成员是否允许修改背景图
			checkboxChange (e) {
				if (e.target.checked == true) {
					this.isTrue = 1
				} else {
					this.isTrue = 0
				}
			},
			// 手机端成员是否允许修改个性签名
			checkboxChange2 (e) {
				if (e.target.checked == true) {
					this.isTrue2 = 1
				} else {
					this.isTrue2 = 0
				}
			},
			// 通用设置背景图预览
			async handlePreview (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage = file.url || file.preview;
				this.previewVisible = true;
			},
			// 通用设置头像预览
			async handlePreview2 (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage2 = file.url || file.preview;
				this.previewVisible2 = true;
			},
			switch1Change (checked) {
				this.isContext = checked ? 1 : 0
			},
			switch2Change (checked) {
				this.isAudit = checked ? 0 : 1
			},
			// 背景图预览取消
			handleCancel () {
				this.previewVisible = false;
			},
			// 头像预览取消
			handleCancel2 () {

				this.previewVisible2 = false;
			},
			// 页面列表图片预览取消
			handleCancel3 () {
				this.previewVisible3 = false;
				this.$nextTick(() => {
					this.photoArr = []
				})
			},
			// 查看详情取消
			handleCancel4 () {
				this.momentDetailDialog = false;
				this.reFresh = false
				this.selectedStaff = null
			},
			// 读取数据流
			getFileContent (file, callback) {
				if (file && file.size > 0) {
					//下面这一句相当于JQuery的：var file =$("#upload").prop('files')[0];
					if (window.FileReader) {
						var reader = new FileReader();
						reader.onloadend = function (evt) {
							if (evt.target.readyState == FileReader.DONE) {
								callback(evt.target.result);
							}
						};
						// 包含中文内容用gbk编码
						reader.readAsText(file, 'utf-8');
					}
				}
			},
			// 头像选择
			beforeUploadPic (file) {
				if (file.type != 'image/jpg' && file.type != 'image/jpeg' && file.type != 'image/png') {
					this.$message.error("图片类型仅支持jpg、jpeg和png类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 <= 2;
				if (!isLt2M) {
					this.$message.error("图片大小不超过2M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				this.isHeader = 1
				let that = this
				that.getFileContent(file, function (str) {
					that.upLoadPhoto(file, MD5(MD5(str)))
				})
				// this.upLoadPhoto(file)
			},
			// 背景图选择
			beforeUploadPic2 (file) {
				if (file.type != 'image/jpg' && file.type != 'image/jpeg' && file.type != 'image/png') {
					this.$message.error("图片类型仅支持jpg、jpeg和png类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 <= 2;
				if (!isLt2M) {
					this.$message.error("图片大小不超过2M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				this.isHeader = 2
				let that = this
				that.getFileContent(file, function (str) {
					that.upLoadPhoto(file, MD5(str))
				})
			},
			// 头像/背景图上传
			async upLoadPhoto (file, md5) {
				let params = new FormData();
				params.append("type", file.type);
				params.append("corp_id", this.corpId);
				params.append("md5", md5);
				let params2 = new FormData();
				params2.append("fileInfo", file);
				params2.append("type", file.type);
				params2.append("corp_id", this.corpId);
				params2.append("md5", md5);
				const {data: res} = await this.axios.post("moment/moments-upload", params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (res.data.local_path != '') {
						if (this.isHeader == 1) {
							if (res.data.s_local_path) {
								this.img1 = this.commonUrl + res.data.s_local_path
							} else {
								this.img1 = this.commonUrl + res.data.local_path
							}
							this.upPhoto1 = res.data.local_path
							this.sUpPhoto1 = res.data.s_local_path
							let pic = {
								uid   : file.uid,
								url   : this.commonUrl + res.data.local_path,
								status: 'done',
								name  : 'image.jpg'
							}
							// this.fileList.push(pic)
						} else if (this.isHeader == 2) {
							let pic = {
								uid   : file.uid,
								url   : this.commonUrl + (res.data.s_local_path ? res.data.s_local_path : res.data.local_path),
								status: 'done',
								name  : 'image.jpg'
							}
							// this.fileList2.push(pic)
							this.img2 = (res.data.s_local_path ? res.data.s_local_path : res.data.local_path)
							this.upPhoto2 = (res.data.s_local_path ? res.data.s_local_path : res.data.local_path)
						}
					} else if (res.data.local_path == '') {
						if (this.isHeader == 2) {
							params2.append('is_heard', true)
						}
						const {data: res2} = await this.axios.post("moment/moments-upload", params2);
						if (this.isHeader == 1) {
							if (res2.data.s_local_path) {
								this.img1 = this.commonUrl + res2.data.s_local_path
							} else {
								this.img1 = this.commonUrl + res2.data.local_path
							}
							this.upPhoto1 = res2.data.local_path
							this.sUpPhoto1 = res2.data.s_local_path
							let pic = {
								uid   : file.uid,
								url   : this.commonUrl + (res2.data.s_local_path ? res2.data.s_local_path : res2.data.local_path),
								status: 'done',
								name  : 'image.jpg'
							}
							// this.fileList.push(pic)
						} else if (this.isHeader == 2) {
							let pic = {
								uid   : file.uid,
								url   : this.commonUrl + (res2.data.s_local_path ? res2.data.s_local_path : res2.data.local_path),
								status: 'done',
								name  : 'image.jpg'
							}
							// this.fileList2.push(pic)
							this.img2 = (res2.data.s_local_path ? res2.data.s_local_path : res2.data.local_path)
							this.upPhoto2 = (res2.data.s_local_path ? res2.data.s_local_path : res2.data.local_path)
						}
					}
				}


			},
			// 背景图上传图片change改变状态
			handleChangePic (e) {
				const isLt2M = e.file.size / 1024 / 1024 < 2;
				if (e.file.type == 'image/jpg' || e.file.type == 'image/jpeg') {
					if (isLt2M == true && e.file.size > 5) {
						this.fileList = e.fileList;
					}
				}
				for (let f of e.fileList) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
				if (e.file.status == 'removed') {
					this.img1 = null
					this.upPhoto1 = null
					this.sUpPhoto1 = null
					this.fileList.splice(this.fileList.findIndex(x => x.uid == e.file.uid), 1)
				}
				return isLt2M;
			},
			// 头像图片change改变状态
			handleChangePic2 (e) {
				const isLt2M = e.file.size / 1024 / 1024 < 2;
				if (e.file.type == 'image/jpg' || e.file.type == 'image/jpeg' || e.file.type == 'image/png') {
					if (isLt2M == true && e.file.size > 5) {
						this.fileList2 = e.fileList;
					}
				}
				for (let f of e.fileList) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
				if (e.file.status == 'removed') {
					this.img2 = null
					this.upPhoto2 = null
					this.fileList2.splice(this.fileList2.findIndex(x => x.uid == e.file.uid), 1)
				}
				return isLt2M;
			},
			// 获取应用
			async getAppList (id) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.corpId,
					suite_id  : this.suite_id,
					agent_type: 2
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.appList = res.data
					if (id) {
						this.appId = id
					} else if (this.appList.length != 0 && !id) {
						this.appId = this.appList[0].id
					} else {
						this.appId = []
					}
				}
			},
			// 通用设置
			async setting () {
				this.isLoading = true
				this.getAppList()
				this.isCheck = 1
				const {data: res} = await this.axios.post('moment/moments-setting', {
					corp_id   : this.corpId,
					is_check  : this.isCheck, // 编辑传1获取设置
					setting_id: this.id, // 编辑传id
				})
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.msg);
				} else {
					if (res.data) {
						this.id = res.data.id
						this.appId = res.data.agent_id
						this.isTrue2 = res.data.is_description
						this.isContext = res.data.is_context
						this.isAudit = res.data.is_audit
						if (this.isTrue2 == 0) {
							this.show2 = false
						} else {
							this.show2 = true
						}
						this.isChangePhoto = res.data.is_heard
						this.photoValue = parseInt(res.data.is_heard)

						if (res.data.heard_img != "") {
							let pic2 = {
								uid   : '1',
								url   : this.commonUrl + res.data.heard_img,
								status: 'done',
								name  : 'image.jpg'
							}
							this.fileList2.splice(0, 1, pic2)
							if (this.fileList2.length > 1) {
								this.fileList2.splice(1, this.fileList2.length - 1)
							}
							this.img2 = res.data.heard_img
						} else {
							this.img2 = null
							this.fileList2 = []
						}

						this.upPhoto2 = res.data.heard_img
						this.isTrue = res.data.banner_type
						if (this.isTrue == 0) {
							this.show1 = false
						} else {
							this.show1 = true
						}
						if (res.data.banner_info != '') {
							let pic = {
								uid   : '2',
								url   : this.commonUrl + res.data.banner_info,
								status: 'done',
								name  : 'image.jpg'
							}
							if (res.data.s_banner_info) {
								this.img1 = this.commonUrl + res.data.s_banner_info
							} else {
								this.img1 = this.commonUrl + res.data.banner_info
							}
							this.fileList.splice(0, 1, pic)
						} else {
							this.img1 = null
							this.fileList = []
						}
						if (this.fileList.length > 1) {
							this.fileList.splice(1, this.fileList.length - 1)
						}
						this.upPhoto1 = res.data.banner_info
						this.sUpPhoto1 = res.data.s_banner_info
						this.selfText = res.data.description
						this.inputTitle = res.data.corp_title
						this.webTitle = res.data.external_title
						this.isLoading = false
						this.settingVisible = true
					} else {
						this.isLoading = false
						this.settingVisible = true
						this.id = 0
						this.img2 = null
						this.fileList2 = []
						this.photoValue = 0
						this.img1 = null
						this.fileList = []
					}
				}
			},
			// 取消通用设置
			cancelChangeSetting () {
				this.settingVisible = false
			},
			// 通用设置提交
			handleChangeSetting () {
				if (!this.fileList2 && this.photoValue == 0) {
					this.$message.warning('请上传头像')
					return
				}
				this.setCircle()
			},

			handleChange (value) {
				this.corpId = value
			},
			handleWxId (value) {
				this.corpId = value
				// let corp = this.corpInfo.find(corp => corp.corpid == this.corpId)
				// this.$store.dispatch("changeCorp", corp);
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			//点击搜索
			find () {
				this.isLoading = true
				this.getMomentList(this.momentStatus)
				// this.getWelcomeList()
			},
			//点击清空
			clear () {
				this.isLoading = true
				location.reload();
			},
			// 新建标签
			addWelcomeText () {
				if (this.isSetting == 1) {
					this.$router.push('/circle/addFriends')
				} else {
					this.$message.destroy()
					this.$message.warning('请先完善通用设置');
				}
			},
			//获取表格内容
			async getWelcomeList (page = 1, pageSize = this.pageSize) {
				let that = this
				const {data: res} = await that.axios.post("moment/moments-lists", {
					title    : this.searchInput, // 标题，用于搜索
					user_ids : '', // 成员id，用于搜索
					status   : '', // 状态，0全部，1已发送，2未发送
					corp_id  : that.corpId,
					page     : page,
					page_size: pageSize
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isSetting = res.data.is_setting
					that.welcomeList = res.data.data
					that.total = parseInt(res.data.count);
					// that.total = parseInt(res.data.length)
					that.page = page;
					that.pageSize = pageSize;
					that.quickJumper = that.total > that.pageSize;
					that.welcomeList.map((data, index) => {
						let obj = data.info
						if (data.type == 3 && obj != null && obj != '' && obj != []) {
							that.playerOptions[index] = {
								...that.publicOptions,
								sources: [
									{
										src : that.commonUrl + obj[0].local_path, // 路径
										type: "video/mp4" // 类型
									}
								]
							};
						}
					});
					that.isLoading = false;
				}
			},

			//根据内容标题搜索内容
			searchContent () {
				this.isLoading = true;
				this.getMomentList(this.momentStatus)
				// this.getWelcomeList()
			},
			clearText () {
				this.searchInput = ''
				this.isLoading = true
				this.auditStatus = null
				this.getMomentList(this.momentStatus)
				// this.getWelcomeList()
			},

			//详情
			handleShowDetail (id) {
				this.visible = true;
				this.detail(id)
			},
			async detail (id) {

			},
			onClose () {
				this.visible = false;
			},
			// 删除动态
			confirmDeleteMoment () {
				let that = this;
				that.$confirm({
					title     : "确定删除?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						if (that.momentDetail.count == 1) {
							that.delWelcome(that.momentDetail.id)
							return
						}
						that.delWelcome(that.momentDetail.ids, 1);
					}
				});
			},
			// 查看详情
			async getMomentDetail () {
				const {data: res} = await this.axios.post("moment/moment-detail", {
					corpid : this.corpId,
					base_id: this.baseId,
					user_id: this.selectedStaff,
					check  : 2
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading = false
				} else {
					if (res.data.default_heard == 1) {
						res.data.heard_img = this.commonUrl + res.data.heard_img
					}
					this.momentDetail = res.data
					this.isLoading = false
					this.momentDetailDialog = true
				}
			},
			async checkDetail (record, index) {
				if (this.isSetting == 0) {
					this.$message.error('请先设置通用设置');
				} else {
					let obj = JSON.parse(JSON.stringify(record))
					this.videoIndex = index
					this.detailPage = 1
					this.is_mobile = obj.is_mobile
					this.ownership = obj.ownership
					this.baseId = obj.id
					this.momentDetail = null
					this.reFresh = true
					this.isLoading = true
					this.recordId = record.id
					this.getUser()
					// if (this.ownership.length == 1) {
					// 	this.selectedStaff = this.ownership[0].id
					// 	this.getMomentDetail()
					// }
				}
			},
			popScroll (e) {
				let target = e.target
				if (parseInt(target.scrollTop) + target.offsetHeight == target.scrollHeight) {
					if (this.ownershipList.length < this.count) {
						this.detailPage += 1
						this.getUser()
					}
				}
			},
			async getUser (name) {
				const {data: res} = await this.axios.post('moment/get-moment-user', {
					corp_id : this.corpId,
					base_id : this.recordId,
					page    : this.detailPage,
					name    : name,
					pageSize: 15,
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					if (res.data.length > 0) {
						if (this.detailPage == 1) {
							this.ownershipList = res.data
							this.selectedStaff = res.data[0].id
							this.isName = res.is_name
							this.getMomentDetail()
						} else {
							this.ownershipList = this.ownershipList.concat(res.data)
						}
						this.count = parseInt(res.count)
					}
				}
			},
			searchName (name) {
				this.getUser(name)
			},
			handleStaffChange () {
				this.getMomentDetail()
			},

			// 审核
			auditList (record) {
				if (this.isSetting == 0) {
					this.$message.error('请先设置通用设置');
				} else {
					this.$router.push({path: "/circle/addFriends", query: {id: record.id, isAudit: true}});
				}
			},
			//编辑
			editList (obj) {
				if (this.isSetting == 0) {
					this.$message.error('请先设置通用设置');
				} else {
					this.$router.push({path: "/circle/addFriends", query: {id: obj.id}});
				}
			},
			//删除
			deleteList (title, id) {
				if (this.isSetting == 0) {
					this.$message.error('请先设置通用设置');
				} else {
					let that = this;
					that.$confirm({
						title     : "确定删除？",
						okText    : "确定",
						okType    : "primary",
						cancelText: "取消",
						onOk () {
							that.isLoading = true;
							that.delWelcome(id);
						}
					});
				}
			},
			async delWelcome (id, is_detail) {
				const {data: res} = await this.axios.post("moment/moment-del", {
					momentId : id,
					is_detail: is_detail
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					if (this.ownershipList.length > 1) {
						this.getUser()
					} else {
						this.momentDetailDialog = false
						if (this.page > 1 && this.welcomeList.length == 1) {
							this.isLoading = true
							this.getMomentList(this.momentStatus)
							// this.getWelcomeList(this.page - 1, this.pageSize)
						} else {
							this.isLoading = true
							this.getMomentList(this.momentStatus)
							// this.getWelcomeList(this.page, this.pageSize)
						}
					}
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.page = page
				this.pageSize = pageSize
				// this.getWelcomeList(page, pageSize);
				this.getMomentList(this.momentStatus)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 110)
				})
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.page = page
				this.pageSize = pageSize
				this.getMomentList(this.momentStatus, page, pageSize)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 110)
				})
			},

			changePage2 (page, page_size) {
				this.isExport = ''
				this.is_all = ''
				this.isLoading2 = true;
				this.getUserList(page, page_size);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll2')[0].scrollTo(0, 110)
				})
			},
			showSizeChange2 (page, page_size) {
				this.isLoading2 = true;
				this.isExport = ''
				this.is_all = ''
				this.getUserList(1, page_size);
			}
		},
		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.getMomentList(this.momentStatus)
			});
		}
		,
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/circle/addFriends' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					this.page = vm.page
					this.pageSize = vm.pageSize
					this.getMomentList(this.momentStatus)
					// vm.getWelcomeList(vm.page, vm.pageSize)
				});
			} else {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.page = 1
					vm.page_size = 15
					vm.pageSize = 15
					// vm.getWelcomeList()
				});
			}
			next()
		}
		,
	}
	;
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	/deep/ .ant-drawer-body {
		background: #F0F2F5;
	}

	.active {
		width: 100%;
		background: #2596FF;
		color: #FFF;
	}

	.moment_detail {

	}

	/deep/ .ant-modal-body {
		min-height: 15rem !important;
		max-height: 40rem;
		padding: 15px 10px !important;
		overflow: auto;
	}

	.reply {
		max-height: 30rem;
		margin: 5px 0;
		overflow: auto;

		.reply-content {
			max-height: 30rem;
			overflow-y: auto;
			padding: 15px 10px;
			background-color: #FAFAFA;
		}

	}

	.covers {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.cover {
		display: flex;
		justify-content: center;
		width: 33%;
		margin: 10px 0;
	}

	.min {
		cursor: zoom-in;
		height: 90px;
		object-fit: fill;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 20px 0 0 0;
	}

	.title_lh {
		line-height: 20px !important;
		margin-top: 10px;
		color: #000;
	}

	.input_img2 {
		width: 50px;
		height: 50px;
	}

	.input_text3 {
		max-width: 200px;
		line-height: 16px;
		font-size: 12px;
		display: -webkit-box;
		/*margin-top: 15px;*/
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		word-break: break-all;
	}

	.inp_title {
		max-width: 138px;
		line-height: 25px;
		margin-top: 3px;
		font-weight: bold;
		color: #000;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
	}

	.preview-modal {
		.ant-carousel {
			.slick-slide {
				text-align: center;
				height: auto;
				overflow: hidden;
			}

			.custom-slick-arrow {
				width: 50px;
				height: 50px;
				font-size: 50px;
				color: #545454 !important;
				opacity: 0.3;

				&:before {
					display: none;
				}

				&:hover {
					opacity: 0.5;
				}
			}
		}
	}

	.right_photo1 {
		width: 100%;
		height: 100%
	}

	.right_photo2 {
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}

	.self_text {
		float: right;
		margin-right: 10px;
		max-width: 150px;
		font-size: 12px;
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		word-break: break-all;
	}

	.photo {
		width: 100%;
		height: 150px;
		background: #A9BFF4;
		position: relative
	}

	.headPhoto {
		width: 70px;
		height: 70px;
		border-radius: 5px;
		background: #C8C9CC;
		position: absolute;
		bottom: 0;
		right: 0;
		transform: translate(-15%, 30%)
	}

	.left {
		float: left;
		width: 70%;
		height: 100%;
	}

	.right {
		float: right;
		width: 30%;
		height: 600px;
		border: 1px solid #F1F3F5;
	}

	/deep/ .ant-col-21 {
		width: 0;
	}

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
		min-width: 98%;
		min-height: auto;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		line-height: 60px;
	}

	.spin-content {
		height: 100%;
	}

	.content-msg2 {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		min-width: 885px;
		width: 100%;
		margin-top: 2px;
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
		float: right;
		width: 340px;
		border: 1px solid #E9E9E9;
		line-height: 21px;
		padding: 15px;
		overflow-wrap: break-word;
		hyphens: auto;
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

	.selectPhoto {
		width: 100%;
		position: absolute;
		top: 65%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center
	}

	.ant-table-wrapper {
		width: 100%;
	}

	.selectFile:hover {
		border-color: #2596FF;
		cursor: pointer;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		position: relative;
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
</style>
