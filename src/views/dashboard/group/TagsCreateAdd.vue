<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						新建拉群
						<a-button type="primary" icon="rollback"
						          style="float: right;margin-top: 9px;" @click="goBack">返回列表
						</a-button>
					</a-layout-header>

					<a-layout class="fans-content">
						<!-- 左侧 -->
						<a-layout-sider>
							<div class="wrap">
								<img src="../../../assets/wxHeader.png" alt
								     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
								<div class="msg_content_body">
									<!--文本-->
									<div class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<!--										<span v-html="textAreaValueHeader" class="item-info msg_content_txt"-->
										<!--										      style="display:block;white-space: pre-wrap;word-wrap: break-word;"></span>-->
										<span v-html="textContent" class="item-info msg_content_txt"
										      style="display:block;white-space: pre-wrap;word-wrap: break-word;"></span>
									</div>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- 企业微信选择 -->
								<div class="content-hd" v-if="$store.state.corpArr.length > 1">
									<a-form>
										<a-form-item label="选择企业微信"
										             :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template>
												<div style="display: inline-block;cursor: pointer;" @click="add">
													<img src="../../../assets/WeChatLogo.png" alt=""
													     style="width: 24px;border-radius: 4px;">
													<span style="margin-left: 5px;">{{$store.state.corpName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"/>
												</div>
											</template>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd">
									<a-form>
										<!-- 任务名称 -->
										<a-form-item label="任务名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             style="padding-top: 15px;margin-top:0;">
											<a-input v-model="msg_title" placeholder="仅内部可见，限30字符" :maxLength="30"
											         style="width: 60%;"/>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{msg_title === null ? 0 : msg_title.length}} / 30</span>
										</a-form-item>
										<a-form-item :label-col="{ span: 3 }" label="客户归属"
										             :wrapper-col="{ span: 21 }">
											<a-radio-group name="radioGroup" v-model="fromCustom"
											               @change="changeFromCustom">
												<a-radio :value="1">全部成员</a-radio>
												<a-radio :value="2">
													<a-button
															:disabled="fromCustom!=2 ? true:false"
															@click="showDepartmentList">
														选择成员
													</a-button>
													<span style="margin-left: 5px"
													      v-show="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
													<a style="margin-left: 10px;"
													   v-show="chooseNum > 0"
													   @click="clearDepartmentList">
														重置
													</a>
												</a-radio>
											</a-radio-group>
											<a-tooltip title="具有外部联系人权限的成员">
												<a-icon type="question-circle"
												        style="vertical-align: initial;margin-left: 5px;"/>
											</a-tooltip>
										</a-form-item>
										<a-form-item label="成员客户筛选" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-spin tip="Loading..." size="large" :spinning="selectLoading">
												<div>
													<a-radio-group name="radioGroup" v-model="correctness"
													               @change="changeCorrectness">
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
																	style="width:320px;margin-right: 5px;"
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
																<a-input style=" width: 145px; text-align: center"
																         placeholder="最小值" @change="followMinNumChange"
																         :value="followNum1" @blur="followNumBlur"/>
																<a-input
																		style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #FFF"
																		placeholder="~"
																		disabled
																/>
																<a-input
																		style="width: 145px; text-align: center; border-left: 0"
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
																	style="width: 320px;"
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
																	style="width: 320px;text-align: left;"
															/>
														</a-form-item>
														<a-form-item v-for="(item, index) in defineField"
														             :label="item.title" :label-col="{ span: 4 }"
														             v-if="item.type == 2 || item.type == 3"
														             :wrapper-col="{ span: 20 }">
															<a-select
																	@change="getPersonsNum"
																	style="width: 320px"
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
																	style="width: 320px"
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
																	@change="getPersonsNum()"
																	style="width: 320px"
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
															<corpChooseTag :callback="modalVisibleChange3"
															               :hasChoose="tag_arr"
															               v-if="isShowTag"></corpChooseTag>
														</a-form-item>
													</a-form>
												</div>
											</a-spin>
										</a-form-item>

										<!-- 入群引导语 -->
										<a-form-item label="入群引导语" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<div class="pull-right">
												<!--												<editor v-if="editorFlag" :text="textContent"-->
												<!--												        :textValue="textAreaValueHeader"-->
												<!--												        :isEmoji="false"-->
												<!--												        @changeText="changeText">-->
												<!--												</editor>-->
												<a-textarea
														v-model="textContent" :maxLength="1000"
														:auto-size="{ minRows: 5, maxRows: 5 }"
												/>
												<div style="text-align: right;">{{textContent.length}}/1000</div>
											</div>
										</a-form-item>
										<!-- 添加群聊 -->
										<a-form-item label="添加群聊" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">

											<table class="dataTabble" v-if="chatData.length > 0">
												<thead>
												<tr>
													<th style="width:20%;">群名称</th>
													<!--													<th>群人数上限</th>-->
													<th style="width: 5%;">群二维码</th>
													<th style="width: 5%;">操作</th>
												</tr>
												</thead>
												<vuedraggable v-model="chatData" element="tbody">
													<tr v-for="(record,index) in chatData" :key="index"
													    :class="index%2 == 0 ? 'light-row' : 'dark-row'">
														<td style="width:20%;">
															<div style="max-width:100%;word-break: break-all;">
																<a-popover trigger="hover"
																           v-if="record.name && record.name != ''">
																	<span slot="content"
																	      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
																		{{record.name}}
																	</span>
																	<span v-if="record.name && record.name != ''"
																	      style="color:#01b065; cursor: pointer;display: inline-block;max-width: calc(100% - 70px);white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
																		{{record.name}}
																	</span>
																</a-popover>
																<span style="display: inline-block;vertical-align: top;">（{{record.member_num}}/200）</span>
															</div>
														</td>
														<!--														<td>-->
														<!--															群人数达到-->
														<!--															<a-input-number :min="1" :max="200" v-model="record.limit"-->
														<!--															                @change="e=>inputLimit(e,record.chat_id)"/>-->
														<!--															人，换群加入-->
														<!--														</td>-->
														<td style="width: 5%;line-height: normal;">
															<a-upload
																	name="avatar"
																	listType="picture-card"
																	class="avatar-uploader logo-style"
																	style="width: auto;"
																	:showUploadList="false"
																	action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
																	:beforeUpload="beforeUpload"
															>
																<img v-if="record.url != ''"
																     :src="commonUrl + record.url" alt="avatar"
																     style="max-width: 48px;height: 48px;"
																     @click="chooseQrcode(record.chat_id)"/>
																<div v-if="record.url == ''"
																     @click="chooseQrcode(record.chat_id)"
																     style="line-height: 62px;">
																	<a-icon :type="record.loading ? 'loading' : 'plus'"/>
																</div>
															</a-upload>
															<!--															<div v-if="record.url != '' && record.status == 0"-->
															<!--															     style="width: 64px;height: 64px;background-color: #FAFAFA;border: 1px dashed #D9D9D9;display: inline-block;text-align: center;padding-top: 7px;">-->
															<!--																<img :src="commonUrl + record.url" alt="avatar"-->
															<!--																     style="max-width: 48px;height: 48px;"/>-->
															<!--															</div>-->
														</td>
														<td style="width: 5%;">
															<a-button
																	style="margin: 0px 5px 5px 0px;" type="link"
																	@click="delData(record.chat_id)">
																删除
															</a-button>
														</td>
													</tr>
												</vuedraggable>
											</table>

											<div>
												<a-button @click="showChatVisible" icon="plus">
													选择群聊
												</a-button>
											</div>
											<div class="content-msg">
												<p style="margin-bottom: 0px;">
													1、为了保证推送的客户均可以入群（群人数上限为200人），请添加多个群聊。系统会根据群成员当前人数推送入群二维码，当推送的客户数达到群上限人数时，系统会自动更换另外入群二维码群发给下一个客户。<span
														style="color: #F56C6C;">如当前群人数20人，那么当推送给第181位客户时，这个该客户会收到另外一个入群二维码，不论之前推送的180位客户是否已入群。</span>
												</p>
												<p style="margin-bottom: 0px;">
													2、因系统无法判断群二维码是否真实有效，请您准确上传群对应的群二维码，否则会影响入群效果。</p>
												<p style="margin-bottom: 0px;">3、若同一客户添加多个企业成员，只会收到一条入群邀请。</p>
											</div>
										</a-form-item>
										<!-- 过滤客户 -->
										<a-form-item label="过滤客户" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<a-switch v-model="switchChecked" style="margin-right: 10px;"/>
											开启后已在群聊中的客户将不会收到邀请<span @click="getPersonsNum(1)"
											                        style="cursor: pointer;color: #01b065;"
											                        v-if="switchChecked">（点击查看预计送达人数<span
												v-if="sendPersonNum != -1">：<span style="color: #F56C6C;">{{sendPersonNum}}</span></span>）</span>
										</a-form-item>
										<a-form-item style="margin-bottom: 0;padding-bottom: 10px;">
											<div style="height: 20px;border-bottom: 1px solid #E0E0E0;"></div>
											<div style="margin: 10px 12.5% 0;">
												<a-button type="primary" @click="submit" :loading="createLoading">
													通知成员发送邀请
												</a-button>
												需要员工确认发送后，才会将群二维码发送给对应的客户
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
		<!-- 企业微信选择弹窗 -->
		<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="group-add"></wxModal>
		<!--选择群聊弹窗-->
		<a-modal v-model="chatVisible" title="选择群聊" @ok="handleOk" @cancel="handleCancle" class="msg-modal">
			<a-input-search placeholder="输入群名称" @input="getChatList(1)" v-model="searchValue"/>
			<p style="margin-top: 1rem;">全部群聊（{{count}}）：</p>
			<div style="height: 300px;">
				<a-checkbox-group :value="chatIdArr">
					<a-row v-for="item in chatList">
						<a-checkbox :value="item.chat_id" :disabled="item.disabled"
						            @click="chooseChat(item,item.chat_id)">
							<span style="background: #01b065;width: 36px;height:36px;margin-right: 5px;vertical-align: top;border-radius: 4px;float: left;"
							      v-if="item.avatarData.length == 0">
									<img :src="img"
									     style="width: 20px;margin: 8px;height: 20px;"/>
								</span>
							<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;border-radius: 4px;float: left;"
							      v-else-if="item.avatarData.length == 1">
									<img :src="item.avatarData[0]"
									     style="width: 36px;height:36px;"
									     v-if="item.avatarData[0] != ''"/>
									<img :src="img2" style="width: 36px;height:36px;"
									     v-if="item.avatarData[0] == ''"/>
								</span>
							<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
							      v-else-if="item.avatarData.length > 1 && item.avatarData.length <= 4">
									<template v-for="imgItem in item.avatarData">
										<img :src="imgItem"
										     style="width: 17px;height: 17px;" v-if="imgItem != ''"/>
										<img :src="img2" style="width: 17px;height: 17px;"
										     v-if="imgItem == ''"/>
									</template>
								</span>
							<span style="background: #DFDFDF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 4px;float: left;align-items: center;"
							      v-else-if="item.avatarData.length > 4">
									<template v-for="imgItem in item.avatarData">
										<img :src="imgItem"
										     style="width: 10px;height: 10px;" v-if="imgItem != ''"/>
										<img :src="img2" style="width: 10px;height: 10px;"
										     v-if="imgItem == ''"/>
									</template>
								</span>
							<div style="display: inline-block;vertical-align: top;width: calc(100% - 80px);">
								<a-popover placement="topLeft">
									<template slot="content">
										{{item.name}}
									</template>
									<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
										{{item.name}}
									</div>
								</a-popover>
								<div v-if="!item.name || item.name == ''">--</div>
								<div>{{item.member_num}}/200</div>
							</div>
						</a-checkbox>
					</a-row>
				</a-checkbox-group>
				<div class="noMore" v-if="chatList.length < count">正在加载</div>
				<div class="noMore" v-if="chatList.length == count">没有更多了</div>
			</div>
		</a-modal>
		<!--部门选择框-->
		<chooseDepartment ref="user" :is_from="7" :is_external="1" noticeTitle="只显示具有外部联系人权限的成员"
		                  :show="showModalDepartment"
		                  :chooseNum="chooseNum"
		                  :callback="modalVisibleChange2"></chooseDepartment>
	</div>
</template>

<script>
	import wxModal from "@/components/WeChatModal.vue"
	import img from '../../../assets/chat.png'
	import img2 from '../../../assets/useradvart.png'
	import vuedraggable from "vuedraggable"
	import editor from '../../../components/editor/index'
	import axios from "axios";
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import cityData from "../../../common/js/citydata";
	import moment from "moment";
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	const columns = [
		{
			title      : '群名称',
			dataIndex  : "name",
			key        : "name",
			width      : '180px',
			scopedSlots: {customRender: 'name'},
		},
		// {
		// 	title      : '群人数上限',
		// 	dataIndex  : "member_num",
		// 	key        : "member_num",
		// 	scopedSlots: {customRender: 'member_num'},
		// },
		{
			title      : '群二维码',
			dataIndex  : "qrcode",
			key        : "qrcode",
			width      : '25%',
			scopedSlots: {customRender: 'qrcode'},
		},
		{
			title      : '操作',
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: 'action'},
		}
	];


	export default {
		components: {
			wxModal, vuedraggable, editor, chooseDepartment, corpChooseTag
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				editorFlag         : false,
				textAreaValueHeader: '',
				textContent        : '',
				img,
				img2,
				moment,
				commonUrl          : this.$store.state.commonUrl,
				wxInfo             : [], //微信公众号列表
				corpId             : corpId,
				suite_id           : 1,//应用ID
				avatarImg          : "", //微信公众号头像
				showModal2         : false, //公众号组件弹窗显示与隐藏
				isLoading          : false, //Loading 组件显示与隐藏
				msg_title          : '',//任务名称

				selectLoading       : false,//客户筛选条件的Loading的显示与隐藏
				correctness         : 2, // 2筛选客户 1全部客户
				personsNum          : 0,//符合条件人数
				//选择成员弹窗
				showModalDepartment : false,//弹窗显示与隐藏
				chooseNum           : 0,//已选择的部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				checkedList         : [],//成员客户的成员数组
				checkedListIds      : [],//成员客户的成员id数组
				sex                 : -1, // -1全部性别 1男 2女 3未知
				is_fans             : 0,
				joinTime            : null, //添加时间
				followTime          : null, // 最后跟进时间
				chatTime            : null,//上次单聊时间
				followNum1          : '',//跟进次数最小值
				followNum2          : '',//跟进次数最大值
				signId              : [],//选择的店铺id
				bindStoreList       : [],//绑定的店铺列表
				province1           : ["全部"],
				follows             : [],
				province            : '',
				city                : '',
				cityData,
				defineField         : [],//属性选项信息
				fieldData           : [],//选择的属性选项
				//下拉菜单样式
				style               : {width: "195px"},
				follow_status       : -1,//跟进状态
				tag_arr             : [], // 选中标签数组
				tag_ids             : '', // 选中标签
				isShowTag           : true,//是否展示选择标签组件
				switchChecked       : true,//过滤客户的开启与关闭
				sendPersonNum       : -1,//过滤后预计送达人数


				text         : '',//欢迎语内容
				chatList     : [],//群聊列表
				columns,
				chatVisible  : false,//群聊弹窗的显示与隐藏
				searchValue  : '',//群聊搜索输入内容
				page         : 1,//群聊的页码
				count        : 0,//群聊总数
				chatArr      : [],//选择的群聊数据
				chatData     : [],//确定选择的群聊数据
				activeKey    : '',//上传二维码选中的行的id
				createLoading: false, // 提交按钮loading
				chatIdArr    : [],//选中的群聊ID的数组
				fromCustom   : 1,//客户归属类型，1全部成员，2选择成员
			}
		},

		methods: {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push('/group/tagsCreate?isRefresh=1')
			},
			//更换企业微信
			add () {
				if (this.$route.query.id) {
					return
				}
				this.showModal2 = true
				this.isLoading = true;
			}
			,
			// 企业微信弹窗确认
			modalVisibleChange (event, corpId, corpName) {
				if (event == "ok" && this.corpId != corpId) {
					this.corpId = corpId
					this.isLoading = false;
					this.showModal2 = false
					this.msg_title = ''
					this.text = ''
					this.chatArr = []
					this.chatIdArr = []
				} else {
					this.isLoading = false;
					this.showModal2 = false
				}
			},
			//切换全部成员与选择成员
			changeFromCustom () {
				this.checkedList = []
				this.checkedListIds = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.selectLoading = true
				this.getPersonsNum()
			},
			//选择群聊
			showChatVisible () {
				this.chatVisible = true
				this.getChatList()
			},
			//获取群聊列表
			async getChatList (page = 1) {
				const {data: res} = await this.axios.post('work-chat/chat-list', {
					corp_id: this.corpId,
					name   : this.searchValue,
					page   : page,
				}, {cancelToken: source.token})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.count = res.data.count
					this.page = page
					if (this.page == 1) {
						this.chatList = res.data.list
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
									if (Math.ceil(that.count / 15.0) > that.page) {
										that.getChatList(that.page + 1)
									}
								}
							}
						})
					} else {
						this.chatList = this.chatList.concat(res.data.list)
					}
					let that = this
					that.chatData.map(x => {
						that.chatList.map(y => {
							if (x.chat_id == y.chat_id) {
								y.disabled = true
							}
						})
					})
					that.chatList.map(x => {
						if (x.disabled) {
							that.chatIdArr.push(x.chat_id)
						}
					})
					// function unique (arr) {
					// 	return Array.from(new Set(arr))
					// }
					// that.chatIdArr = unique(that.chatIdArr)
					that.$forceUpdate()
				}
			},
			chooseChat (e, id) {
				let that = this
				if (that.chatArr.length > 0) {
					if (that.chatIdArr.indexOf(id) == -1) {
						that.chatArr.push(e)
						that.chatIdArr.push(id)
					} else {
						that.chatArr.splice(that.chatIdArr.indexOf(id), 1)
						that.chatIdArr.splice(that.chatIdArr.indexOf(id), 1)
					}
				} else {
					that.chatArr.push(e)
					that.chatIdArr.push(id)
				}
				this.$forceUpdate()
			},
			handleOk () {
				for (let i = 0; i < this.chatArr.length; i++) {
					for (let j = 0; j < this.chatData.length; j++) {
						if (this.chatData[j].chat_id == this.chatArr[i].chat_id) {
							this.chatArr.splice(i, 1)
						}
					}
				}
				this.chatData = this.chatData.concat(this.chatArr)

				function unique (arr) {
					for (var i = 0; i < arr.length; i++) {
						for (var j = i + 1; j < arr.length; j++) {
							if (arr[i].chat_id == arr[j].chat_id) {         //第一个等同于第二个，splice方法删除第二个
								arr.splice(j, 1);
								j--;
							}
						}
					}
					return arr;
				}

				this.chatData = unique(this.chatData)
				this.chatData.map(x => {
					// if (!x.limit) {
					// 	x.limit = 200
					// }
					if (!x.url) {
						x.url = ''
					}
					if (!x.loading) {
						x.loading = false
					}
					if (!x.media_id) {
						x.media_id = ''
					}
				})
				this.searchValue = ''
				this.chatArr = []
				this.chatIdArr = []
				this.chatVisible = false
			},
			handleCancle () {
				this.searchValue = ''
				this.chatVisible = false
				this.chatArr = []
				this.chatList = []
				this.chatIdArr = []
				this.page = 1
			},
			//上传二维码
			chooseQrcode (id) {
				this.activeKey = id
			},
			beforeUpload (file) {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					this.$message.error('二维码仅支持jpg、jpeg、png格式！');
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('图片大小不超过2M');
					return false
				}
				this.uploadImage(file, this.activeKey)
			},
			// 上传
			async uploadImage (file, activeKey) {
				this.chatData.map(x => {
					if (activeKey == x.chat_id) {
						x.loading = true
					}
				})
				this.chatData = JSON.parse(JSON.stringify(this.chatData))
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				param.append("corp_id", this.corpId);
				param.append("suite_id", 1);
				param.append("from_tag", 1);
				param.append("fileInfo", file);
				const {data: res} = await this.axios.post("work-material/upload-img", param);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.chatData.map(x => {
						if (activeKey == x.chat_id) {
							x.loading = false
						}
					})
				} else {
					this.chatData.map(x => {
						if (activeKey == x.chat_id) {
							x.url = res.data.local_path
							x.media_id = res.data.media_id
							x.loading = false
						}
					})
					this.chatData = JSON.parse(JSON.stringify(this.chatData))
				}
			},
			//删除
			delData (id) {
				this.chatData.map((x, index) => {
					if (id == x.chat_id) {
						this.chatData.splice(index, 1)
					}
				})
			},

			// 条件筛选或全部
			changeCorrectness () {
				this.selectLoading = true
				this.getPersonsNum()
			},
			//部门选择弹窗组件
			showDepartmentList () {
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedListIds))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
				this.showModalDepartment = true
			},
			// 员工选择成员回调
			modalVisibleChange2 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					//选择成员客户
					this.selectLoading = true
					this.checkedListIds = arr
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.checkedList = JSON.parse(JSON.stringify(list))
					} else {
						this.checkedList = []
					}
					this.getPersonsNum()
				}
				this.showModalDepartment = false
			},
			// 员工重置
			clearDepartmentList () {
				this.checkedList = []
				this.checkedListIds = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.selectLoading = true
				this.getPersonsNum()
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
			//获取属性选项信息
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
			modalVisibleChange3 (event, arr) {
				if (event == "ok") {
					this.tag_arr = arr.split(',')
					this.tag_ids = arr
					this.getPersonsNum()
				}
			},
			//修改跟进状态
			handleChangeFollowStatus () {
				this.selectLoading = true
				this.getPersonsNum()
			},

			// 获取符合条件人数
			async getPersonsNum (val) {
				this.selectLoading = true
				let fieldData = JSON.parse(JSON.stringify(this.fieldData))
				for (let i = 0; i < fieldData.length; i++) {
					if (fieldData[i].match.length == 0) {
						fieldData.splice(i, 1)
						i--
					}
				}
				//过滤后预计发放人数参数
				let chat_id = []
				if (val && val == 1) {
					this.chatData.map(x => {
						chat_id.push(x.chat_id)
					})
				}
				const {data: res} = await this.axios.post("work-external-contact-follow-user/group-custom-list", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem("sub_id"),
					uid            : localStorage.getItem('uid'),
					corp_id        : this.corpId,
					suite_id       : this.suite_id,
					sex            : this.sex,
					is_fans        : this.is_fans,
					tag_ids        : this.tag_ids,
					tag_type       : '1',
					is_all         : 1,
					correctness    : this.correctness,
					group_id       : [],
					user_ids       : this.checkedListIds,
					province       : this.province,
					city           : this.city,
					follow_id      : this.follow_status,
					fieldData      : fieldData,
					name           : '',
					phone          : '',
					start_time     : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					end_time       : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
					update_time    : this.followTime ? (this.followTime.length > 1 ? [this.followTime[0].format("YYYY-MM-DD HH:mm"), this.followTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					chat_time      : this.chatTime ? (this.chatTime.length > 1 ? [this.chatTime[0].format("YYYY-MM-DD HH:mm"), this.chatTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					follow_num1    : this.followNum1,
					follow_num2    : this.followNum2,
					sign_id        : this.signId,
					chat_id        : chat_id,
					belong_id      : this.fromCustom
				});
				if (res.error != 0) {
					this.selectLoading = false
					this.$message.error(res.error_msg);
				} else {
					if (val && val == 1) {
						this.sendPersonNum = res.data.real_num
					} else {
						this.personsNum = res.data.count
					}
					this.selectLoading = false
				}
			},

			//提交
			async submit () {
				this.createLoading = true
				if (this.msg_title == '') {
					this.createLoading = false
					this.$message.warning("请填写群码名称")
					return false
				}
				if (this.fromCustom == 2) {
					if (this.checkedList.length == 0 || this.chooseNum == 0) {
						this.createLoading = false
						this.$message.warning("请选择成员")
						return false
					}
				}
				if (this.chatData.length == 0) {
					this.createLoading = false
					this.$message.warning("请选择群聊")
					return false
				}
				let chatData = []
				this.chatData.map(x => {
					let arr = {
						chat_id   : x.chat_id,
						// limit     : x.limit,
						local_path: x.url,
						media_id  : x.media_id,
					}
					chatData.push(arr)
				})
				for (let i = 0; i < chatData.length; i++) {
					if (chatData[i].url == '' || chatData[i].media_id == '') {
						this.createLoading = false
						this.$message.warning("请完善群二维码")
						return false
					}
				}
				let users = this.checkedListIds
				if (this.correctness == 1) {
					//全部客户
					users = []
				}
				let fieldData = JSON.parse(JSON.stringify(this.fieldData))
				for (let i = 0; i < fieldData.length; i++) {
					if (fieldData[i].match.length == 0) {
						fieldData.splice(i, 1)
						i--
					}
				}

				const {data: res} = await this.axios.post('work-tag-pull-group/add', {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem("sub_id"),
					corp_id        : this.corpId,
					title          : this.msg_title,
					send_type      : this.correctness,
					sex            : this.sex,
					is_fans        : this.is_fans,
					tag_ids        : this.tag_ids,
					users          : users,
					content        : this.textContent,
					user_ids       : this.checkedList,
					start_time     : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[0].format("YYYY-MM-DD HH:mm") : '') : '',
					end_time       : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[1].format("YYYY-MM-DD HH:mm") : '') : '',
					update_time    : this.followTime ? (this.followTime.length > 1 ? [this.followTime[0].format("YYYY-MM-DD HH:mm"), this.followTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					chat_time      : this.chatTime ? (this.chatTime.length > 1 ? [this.chatTime[0].format("YYYY-MM-DD HH:mm"), this.chatTime[1].format("YYYY-MM-DD HH:mm")] : null) : null,
					follow_num1    : this.followNum1,
					follow_num2    : this.followNum2,
					sign_id        : this.signId,
					province       : this.province,
					city           : this.city,
					attribute      : fieldData,
					follow_id      : this.follow_status,
					chat_list      : chatData,
					is_filter      : this.switchChecked ? 1 : 0,
					belong_id      : this.fromCustom
				})
				if (res.error != 0) {
					this.createLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.createLoading = false
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					this.$router.push("/group/tagsCreate")
				}
			},
			changeText (text, textVale) {
				this.textContent = text
				this.textAreaValueHeader = textVale
			}
		},
		created () {
			const _this = this
			this.$store.dispatch("getWx", info => {
				_this.wxInfo = info

				// if (!_this.avatarImg) {
				// 	_this.avatarImg = _this.wxInfo[_this.$store.state.wxNumIndex].head_img
				// }
			})
			this.editorFlag = true
			this.handleChangeSign()
			this.getFollowStatus()
			this.getFieldInfo()
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
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
		/*margin: 0 5px;*/
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
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

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
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

	/deep/ .ant-form-item-control {
		margin-left: 15px;
	}

	/deep/ .ant-form-item {
		margin: 5px 0px;
	}

	.pull-right {
		margin-right: 20px;
		background: #FFF;
		border: 1px solid #D8D8D8;
		padding: 24px;
		overflow: hidden;
	}

	/deep/ .ant-checkbox-wrapper {
		width: 100%;
		border-bottom: 1px dashed #E9E9E9;
		padding: 10px 0;
	}

	/deep/ .ant-checkbox {
		float: right;
		margin-top: 12px;
	}

	.noMore {
		text-align: center;
		padding: 10px 0;
		font-size: 12px;
		color: #999;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card {
		width: 64px;
		height: 64px;
		margin: 0;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0;
	}

	.dataTabble {
		margin-right: 15px;
		border: 1px solid #E8E8E8;
		width: calc(100% - 15px);

		thead {
			background: #FAFAFA;

			tr:hover {
				background: none;
			}
		}

		thead, tr {
			border-bottom: 1px solid #E8E8E8;
		}

		tr:last-child {
			border: 0;
		}

		tr:hover {
			background: #E6F7FF;
		}

		tr {
			th, td {
				width: 25%;
				padding: 5px 10px;
			}

			th:first-child, td:first-child {
				width: 40%;
				padding: 5px 10px;
			}

			th:last-child, td:last-child {
				width: 10%;
				padding: 5px 10px;
			}
		}
	}

	/deep/ .ant-tag {
		margin-right: 5px;
		height: 26px;
		line-height: 25px;
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

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 10px 20px 10px 0;
		text-align: left;
		line-height: 21px;
	}
</style>