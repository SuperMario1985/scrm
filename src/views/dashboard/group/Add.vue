<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="加载中..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="typeof urlId == 'undefined'">新建</template>
						<template v-if="typeof urlId != 'undefined'">修改</template>
						拉群
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
										<span v-html="textAreaValueHeader" class="item-info msg_content_txt"
										      style="display:block;white-space: pre-wrap;word-wrap: break-word;"></span>
									</div>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- 公众号选择 -->
								<div class="content-hd">
									<a-form>
										<a-form-item v-if="$store.state.corpArr.length > 1" label="选择企业微信"
										             :label-col="{ span: 3 }"
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
										<a-form-item label="选择群分组" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-tree-select
													style="width: 225px"
													:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
													:treeData="groupList"
													placeholder='Please select'
													treeDefaultExpandAll
													v-model="groupId"
											>
											</a-tree-select>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd">
									<a-form>
										<!-- 二维码名称 -->
										<a-form-item label="群码名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             style="padding-top: 15px;margin-top:0;">
											<a-input v-model="msg_title" placeholder="如：扫码送试用装01，限30字符" :maxLength="30"
											         style="width: 60%;"
											         :disabled="typeof urlId=='undefined'?false:true"/>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{msg_title === null ? 0 : msg_title.length}} / 30</span>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦创建，不可修改）</span>
										</a-form-item>
										<!-- 是否需要验证 -->
										<a-form-item label="添加验证" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-radio-group name="sceneGroup" v-model="verify">
												<a-radio :value="1">需验证</a-radio>
												<a-radio :value="0">直接通过</a-radio>
											</a-radio-group>
											<span style="color: #F56C6C;">（客户添加时无需企业成员确认，自动成为好友）</span>
										</a-form-item>
										<!-- 使用成员 -->
										<a-form-item label="使用成员" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<a-button @click="showDepartmentList" icon="plus">
												选择成员
											</a-button>
											<template v-if="chooseNum > 0">
												已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门
												<a-button @click="clearDepartmentList">
													重置
												</a-button>
											</template>
										</a-form-item>
										<!-- 入群打标签 -->
										<a-form-item label="入群打标签" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<corpChooseTag :callback="modalVisibleChange3" :hasChoose="tag_arr"
											               v-if="isShowTag"></corpChooseTag>
										</a-form-item>
										<!-- 入群引导语 -->
										<a-form-item label="入群引导语" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<div class="pull-right">
												<editor v-if="editorFlag" :text="textContent"
												        :textValue="textAreaValueHeader"
												        :isEmoji="false"
												        @changeText="changeText">
												</editor>
											</div>
										</a-form-item>
										<!-- 添加群聊 -->
										<a-form-item label="添加群聊" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<div style="line-height: 20px;margin: 10px 15px 15px 0;">
												可添加多个群聊，当前面的群人数达到上限后，自动发送后面的群二维码。即当第一个群达到人数上限（最多200人）后，客户扫码添加使用成员后，推送第二群的入群二维码，客户扫码进入第二个群聊，依次往后进行。<span
													style="color: #F56C6C;">因系统无法判断群二维码是否真实有效，请您准确上传群对应的群二维码，否则会影响拉群效果。</span>
											</div>

											<table class="dataTabble" v-if="chatData.length > 0">
												<thead>
												<tr>
													<th style="width:20%;">群名称</th>
													<th>群人数上限</th>
													<th style="width: 5%;">群二维码</th>
													<th style="width: 5%;">操作</th>
												</tr>
												</thead>
												<vuedraggable v-model="chatData" element="tbody">
													<tr v-for="(record,index) in chatData" :key="index"
													    :class="index%2 == 0 ? 'light-row' : 'dark-row'">
														<td style="width:20%;">
															<div style="max-width:180px;word-break: break-all;">
																<a-popover trigger="hover"
																           v-if="record.name && record.name != ''">
																	<span slot="content"
																	      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
																		{{record.name}}
																	</span>
																	<span v-if="record.name && record.name != ''"
																	      style="color:#01b065; cursor: pointer;display: inline-block;max-width: 100px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
																		{{record.name}}
																	</span>
																</a-popover>
																<span style="display: inline-block;vertical-align: top;">（{{record.member_num}}/200）</span>
															</div>
														</td>
														<td>
															群人数达到
															<a-input-number :min="1" :max="200" v-model="record.limit"
															                @change="e=>inputLimit(e,record.chat_id)"/>
															人，换群加入
														</td>
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
																<img v-if="record.url != '' && record.status == 1"
																     :src="commonUrl + record.url" alt="avatar"
																     style="max-width: 48px;height: 48px;"
																     @click="chooseQrcode(record.chat_id)"/>
																<div v-if="record.url == '' && record.status == 1"
																     @click="chooseQrcode(record.chat_id)"
																     style="line-height: 62px;">
																	<a-icon :type="record.loading ? 'loading' : 'plus'"/>
																</div>
															</a-upload>
															<div v-if="record.url != '' && record.status == 0"
															     style="width: 64px;height: 64px;background-color: #FAFAFA;border: 1px dashed #D9D9D9;display: inline-block;text-align: center;padding-top: 7px;">
																<img :src="commonUrl + record.url" alt="avatar"
																     style="max-width: 48px;height: 48px;"/>
															</div>
															<a-button
																	style="vertical-align: bottom;" type="link"
																	@click="stopUse(record.chat_id)"
																	v-if="record.url != '' && record.status == 1 && typeof urlId != 'undefined'">
																停用
															</a-button>
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
										</a-form-item>
										<a-form-item style="margin-bottom: 0;padding-bottom: 10px;">
											<div style="height: 20px;border-bottom: 1px solid #E0E0E0;"></div>
											<div style="margin: 10px 12.5% 0;">
												<a-button type="primary" @click="submit" :loading="createLoading">
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
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum"
		                  :callback="modalVisibleChange2" :is_from="7"></chooseDepartment>
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
								<span style="background: #01b065;width: 36px;height:36px;margin-right: 8px;vertical-align: top;border-radius: 4px;float: left;"
								      v-if="item.avatarData.length == 0">
									<img :src="img"
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
	</div>
</template>

<script>
	import wxModal from "@/components/WeChatModal.vue"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import img from '../../../assets/chat.png'
	import img2 from '../../../assets/useradvart.png'
	import vuedraggable from "vuedraggable"
	import editor from '../../../components/editor/index'
	import axios from "axios";

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
		{
			title      : '群人数上限',
			dataIndex  : "member_num",
			key        : "member_num",
			scopedSlots: {customRender: 'member_num'},
		},
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
			wxModal, chooseDepartment, corpChooseTag, vuedraggable, editor
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				editorFlag         : false,
				textAreaValueHeader: '',
				textContent        : '',
				img,
				img2,
				commonUrl          : this.$store.state.commonUrl,
				wxInfo             : [], //微信公众号列表
				corpId             : corpId,
				avatarImg          : "", //微信公众号头像
				showModal2         : false, //公众号组件弹窗显示与隐藏
				isLoading          : false, //Loading 组件显示与隐藏
				groupList          : [],
				msg_title          : '',//二维码名称
				groupId            : [],//分组id
				verify             : 0,//验证方式
				showModalDepartment: false,//选择成员弹窗的显示与隐藏
				userId             : [],//选择成员id
				chooseNum          : 0,//部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				tag_arr            : [],//标签id数组
				text               : '',//欢迎语内容
				chatList           : [],//群聊列表
				columns,
				chatVisible        : false,//群聊弹窗的显示与隐藏
				searchValue        : '',//群聊搜索输入内容
				page               : 1,//群聊的页码
				count              : 0,//群聊总数
				chatArr            : [],//选择的群聊数据
				chatData           : [],//确定选择的群聊数据
				activeKey          : '',//上传二维码选中的行的id
				createLoading      : false, // 提交按钮loading
				isShowTag          : false,
				urlId              : '',//编辑对象id
				chatIdArr          : [],//选中的群聊ID的数组
			}
		},

		methods: {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push('/group/autoCreate?isRefresh=1')
			},
			//获取群分组
			async getGroupList () {
				this.isLoading = true;
				const {data: res} = await this.axios.post('work-chat-way/group', {
					corp_id: this.corpId,
					uid    : localStorage.getItem('uid')
				})
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false;
					this.groupList = res.data.group
					if (this.groupList.length > 0) {
						this.groupId = this.groupList[0].id
					} else {
						this.groupId = []
					}
				}
			},
			//选择成员
			showDepartmentList () {
				let arr = []
				this.userId.map(x => {
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.userId))
				this.showModalDepartment = true
			},
			clearDepartmentList () {
				this.userId = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
			},
			// 选择成员回调
			modalVisibleChange2 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.userId = JSON.parse(JSON.stringify(list))
					} else {
						this.userId = []
					}
				}
				this.showModalDepartment = false
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
					this.groupId = []
					this.verify = 0
					this.userId = []
					this.chooseNum = 0
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					this.tag_arr = []
					this.text = ''
					this.chatArr = []
					this.chatIdArr = []
					this.getGroupList()
				} else {
					this.isLoading = false;
					this.showModal2 = false
				}
			}
			,
			//入群打标签
			modalVisibleChange3 (event, arr) {
				if (event == "ok") {
					this.tag_arr = arr.split(',')
				}
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
							that.chatArr.push(x)
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
					if (!x.limit) {
						x.limit = 200
					}
					if (!x.url) {
						x.url = ''
					}
					if (!x.loading) {
						x.loading = false
					}
					if (x.status != 0 && x.status != 1) {
						x.status = 1
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
			//输入人数限制
			inputLimit (e, id) {
				this.chatData.map(x => {
					if (id == x.chat_id) {
						x.limit = e
					}
				})
				this.chatData = JSON.parse(JSON.stringify(this.chatData))
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
			//停用
			stopUse (id) {
				let that = this
				that.$confirm({
					title: '是否停止该群聊拉人，停用后不能重新启用？',
					onOk () {
						that.chatData.map(x => {
							if (id == x.chat_id) {
								x.status = 0
							}
						})
					},
					onCancel () {
						console.log('Cancel');
					},
				})
			},
			//删除
			delData (id) {
				this.chatData.map((x, index) => {
					if (id == x.chat_id) {
						this.chatData.splice(index, 1)
					}
				})
			},
			//提交
			async submit () {
				this.createLoading = true
				if (this.msg_title == '') {
					this.createLoading = false
					this.$message.warning("请填写群码名称")
					return false
				}
				if (this.userId.length == 0) {
					this.createLoading = false
					this.$message.warning("请选择使用成员")
					return false
				}
				// if (this.textAreaValueHeader == '') {
				// 	this.createLoading = false
				// 	this.$message.warning("请填写入群欢迎语")
				// 	return false
				// }
				if (this.chatData.length == 0) {
					this.createLoading = false
					this.$message.warning("请选择群聊")
					return false
				}
				let chatData = []
				this.chatData.map(x => {
					let arr = {
						chat_id   : x.chat_id,
						limit     : x.limit,
						local_path: x.url,
						media_id  : x.media_id,
						status    : x.status
					}
					chatData.push(arr)
				})
				for (let i = 0; i < chatData.length; i++) {
					if (chatData[i].limit == '') {
						this.createLoading = false
						this.$message.warning("请完善群聊人数限制")
						return false
					}
					if (chatData[i].url == '' || chatData[i].media_id == '') {
						this.createLoading = false
						this.$message.warning("请完善群二维码")
						return false
					}
				}
				const {data: res} = await this.axios.post('work-chat-way/add', {
					uid         : localStorage.getItem('uid'),
					corp_id     : this.corpId,
					suite_id    : 1,
					id          : this.urlId,
					way_group_id: this.groupId,
					title       : this.msg_title,
					text_content: this.textContent,
					tag_ids     : this.tag_arr,
					skip_verify : this.verify,
					user        : this.userId,
					chat_list   : chatData
				})
				if (res.error != 0) {
					this.createLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.createLoading = false
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					if (typeof this.urlId != "undefined") {
						//编辑
						this.$router.push("/group/autoCreate?isRefresh=1")
					} else {
						//新建
						this.$router.push("/group/autoCreate?groupId=" + this.groupId)
					}
				}
			},
			//点击修改进入页面，获取详情
			async getDetail () {
				this.isLoading = true;
				const {data: res} = await this.axios.post('work-chat-way/detail', {
					id: this.urlId
				})
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg)
				} else {
					this.msg_title = res.data.title
					this.verify = res.data.skip_verify
					this.groupId = res.data.way_group_id

					this.chooseNum = res.data.user_key.length
					this.userId = res.data.user_key
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					this.userId.map(x=>{
						if(x.scopedSlots.title == 'custom'){
							this.chooseUserNum++
						}else if(x.scopedSlots.title == 'title'){
							this.chooseDepartmentNum++
						}
					})

					this.tag_arr = res.data.tag_ids
					this.isShowTag = true
					this.textContent = res.data.text_content
					this.textAreaValueHeader = res.data.text_content.replace(/{nickname}/g,
						'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>'
					).replace(/\n/g, '<br>')
					this.editorFlag = true

					this.chatData = res.data.chat_list
					this.chatData.map(x => {
						x.url = x.local_path
					})
					this.isLoading = false;
				}
			},
			changeText (text, textVale) {
				this.textContent = text
				this.textAreaValueHeader = textVale
			}
		},
		created () {
			this.urlId = this.$route.query.id
			if (this.$route.query.groupId == '') {
				this.groupId = ''
			} else {
				this.groupId = Number(this.$route.query.groupId)
			}
			const _this = this
			this.$store.dispatch("getWx", info => {
				_this.wxInfo = info

				// if (!_this.avatarImg) {
				// 	_this.avatarImg = _this.wxInfo[_this.$store.state.wxNumIndex].head_img
				// }
			})
			this.getGroupList()
			if (typeof this.urlId != "undefined") {
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/group/autoCreate')
				this.getDetail()
			} else {
				this.editorFlag = true
				this.isShowTag = true
			}
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
		width: 560px;
		max-height: 630px;
		height: 290px;
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
</style>