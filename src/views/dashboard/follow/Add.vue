<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="加载中..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="!this.follow_id">新建</template>
						<template v-if="this.follow_id">修改</template>
						提醒
						<a-button type="primary" 
						          style="font-size: 14px;float: right;margin-right: 15px;margin-top: 7px;height: 32px;line-height: 16px;"
						          @click="goBack">
							返回列表
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
									<div class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<p v-for="(item,index) in templateList" class="msg_content_txt">
											<span v-html="replaceInit(item.textAreaValueHeader, index)"
											      v-if="item.textContent"
											      class="item-info"
											      style="display:block;white-space: pre-wrap;word-wrap: break-word; line-height: 20px;"></span>
										</p>
									</div>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- <a-spin tip="加载中..." size="large" :spinning="isLoading"></a-spin> -->
								<!-- 选择企业微信 -->
								<div class="content-bd">
									<a-form>

										<a-form-item label="推送成员" :label-col="{ span: 3 }" style="padding-top: 20px;"
										             :wrapper-col="{ span: 21 }">
											<p style="margin-bottom: 5px;color: #FF562D;">发送应用消息通知给企业成员，查看成员的客户跟进情况</p>
											<a-button v-if="urlId.length == 0" @click="showDepartmentList1">
												<span v-if="chooseNum1 == 0">选择企业成员</span>
												<span v-if="chooseNum1 != 0">已选择{{chooseUserNum1}}名成员，{{chooseDepartmentNum1}}个部门</span>
											</a-button>
											<div v-if="urlId.length != 0"
											     style="font-weight: 700;line-height: 20px;display: inline-block;width: 672px;">
												<h3 style="margin-bottom: 5px;font-weight: 700;">已选择 <span
														style="color: #FF562D;">{{urlId.length}}</span> 位企业成员</h3>
											</div>
										</a-form-item>
										<a-form-item label="跟进数据" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<p style="margin-bottom: 5px;color: #FF562D;">设置查看跟进数据可见范围</p>
											<div>
												<a-checkbox-group :value="typeArr">
													<a-checkbox :value="0"
													            style="display: block;margin: 5px 0px;height: 33px; line-height: 33px;"
													            @click="chooseType(0)">
														全员
													</a-checkbox>
<!--													<div>-->
<!--														<a-checkbox :value="1"-->
<!--														            style="margin: 5px 0px;height: 33px; line-height: 33px;"-->
<!--														            :disabled="typeArr.length == 1 && typeArr[0] == 0"-->
<!--														            @click="chooseType(1)">-->
<!--															部门-->
<!--														</a-checkbox>-->
<!--														<a-select-->
<!--																v-if="typeArr.indexOf(1) > -1"-->
<!--																showSearch optionFilterProp="children"-->
<!--																mode="multiple"-->
<!--																v-model="party"-->
<!--																style="width: 400px;margin-left: 10px;"-->
<!--																placeholder="选择部门"-->
<!--														>-->
<!--															<a-select-option v-for="(name, departmentId) in partyList"-->
<!--															                :value="name.id" :key="departmentId">-->
<!--																{{name.name}}-->
<!--															</a-select-option>-->
<!--														</a-select>-->
<!--														<a-tooltip placement="right">-->
<!--															<template slot="title">-->
<!--																<span>选择部门后，原来某部门成员是5位，后新增1位，则该员工查看的跟进数据是6位企业成员。（动态数据）</span>-->
<!--															</template>-->
<!--															<a-icon type="question-circle" v-if="typeArr.indexOf(1) > -1" style="margin-left:5px;"/>-->
<!--														</a-tooltip>-->
<!--													</div>-->
													<div>
														<a-checkbox :value="2"
														            style="margin: 5px 0px;height: 33px; line-height: 33px;"
														            :disabled="typeArr.length == 1 && typeArr[0] == 0"
														            @click="chooseType(2)">
															部分成员
															<a-button style="margin-left: 10px;"
															          v-if="typeArr.indexOf(2) > -1"
															          @click="showDepartmentList">
																选择
															</a-button>
															<span style="margin-left: 5px"
															      v-show="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
															<a style="margin-left: 10px;" v-show="chooseNum > 0"
															   @click="clearDepartmentList">
																重置
															</a>
														</a-checkbox>
													</div>
												</a-checkbox-group>
												<a-checkbox :checked="true" :disabled="true"
												            style="display: block;margin: 5px 0px;height: 33px; line-height: 33px;"
												>
													自己
												</a-checkbox>
											</div>
										</a-form-item>
										<a-form-item label="当天推送时间" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<span style="color: #FF562D;">推送从00：00截止到当前所设置时间点的跟进数据</span>
											<div style="width: 672px;">
												<div v-for="(item, index) in times"
												     style="margin-right: 10px; display: inline-block;">
													<label>时间段{{index + 1}}：</label>
													<a-time-picker :value="item" format="HH:mm" :allowClear="false"
													               @change="e => changeTime(e, index)"/>
													<a-icon v-if="times.length > 1"
													        style="color: #F56C6C;margin-left: 5px;" type="delete"
													        @click="deleteTime(index)"></a-icon>
												</div>
											</div>
											<a-button @click="addTime">添加时间</a-button>
										</a-form-item>
										<a-form-item label="推送内容" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<!--											<span style="color: #FF562D;">推送从00：00截止到当前所设置时间点的跟进数据</span>-->
											<div class="changeType-text">
												提示：火狐浏览器可能出现无法正确插入变量，请使用谷歌、360浏览器
											</div>
											<div>
												{{wordNum}} / {{wordLimit}}
											</div>
											<div class="pull-right fl">
												<a-form-item v-for="(item, index) in templateList"
												             :label-col="{ span: 2 }">
													<label style="vertical-align: top;">
														<a-popover trigger="hover">
															<span slot="content"
															      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
																{{item.title}}
															</span>
															<span style="text-align: right; cursor: pointer; width: 82px;display:inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.title}}</span><span
																style="display: inline-block;vertical-align: top;">：</span>
														</a-popover>
													</label>
													<medium-editor ref="medium_editor"
													               class="content-editable"
													               :text="item.textAreaValueHeader"
													               :options="options"
													               @editorCreated="editorCreated"
													               @edit="changeContentInput"
													               custom-tag="div"
													               :data-key="index"/>
													<div style="padding: 0 15px;margin-left: 80px;line-height: 30px;">
														点击插入：
														<a-button class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('员工姓名')">员工姓名
														</a-button>
														<a-button v-if="item.id == 0" class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('新增客户数')">新增客户数
														</a-button>
														<a-button class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('已跟进人数')">已跟进人数
														</a-button>
														<a-button class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('已跟进条数')">已跟进条数
														</a-button>
														<a-button v-if="item.id != 0" class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('当前状态变化人数')">当前状态变化人数
														</a-button>
														<a-button v-if="item.id != 0" class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('当前阶段状态未改人数')">当前阶段状态未改人数
														</a-button>
														<a-button class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('超过1天数未跟进人数')">超过1天数未跟进人数
														</a-button>
														<a-button class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('超过3天数未跟进人数')">超过3天数未跟进人数
														</a-button>
														<a-button v-for="item in settingList"
														          class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('超过'+ item.day +'天数未跟进人数')">
															超过{{item.day}}天数未跟进人数
														</a-button>
														<a-button class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('发送时间点')">发送时间点
														</a-button>
														<a-button class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('可见员工')">可见员工
														</a-button>
														<a-button v-if="item.id != 0" class="ant-tag ant-tag-orange"
														          size="small"
														          @click="addTag('当前状态')">当前状态
														</a-button>
<!--														<a-button class="ant-tag ant-tag-orange"-->
<!--														          size="small"-->
<!--														          @click="addTag('客户未跟进列表')">客户未跟进列表-->
<!--														</a-button>-->
													</div>
												</a-form-item>
											</div>
										</a-form-item>
										<a-form-item label="开启" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }" v-has="'follow-open'">
											<a-switch :checked="status == 1" @click="changeStatus"/>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd">
									<a-form>
										<a-form-item>
											<div style="margin-top: 2px;margin-left: 12.5%;">
												<a-button type="primary" @click="createFollow"
												          :disabled="createDisabled">
													<template v-if="!this.follow_id">创建</template>
													<template v-if="this.follow_id">修改</template>
													提醒
												</a-button>
											</div>
										</a-form-item>
									</a-form>
								</div>
							</div>

							<a-modal
									title="插入客户未跟进列表"
									:visible="visible"
									:confirm-loading="false"
									@ok="handleOk"
									@cancel="handleCancel"
							>
								<a-input v-model="link" placeholder="请输入客户未跟进列表链接文本"/>
								<p>这里只需要输入客户未跟进列表链接文本即可。不填写，则默认为【查看详情】</p>
							</a-modal>
							<!--部门选择框-->
							<chooseDepartment :id="corpId" ref="user" :show="showModalDepartment"
							                  :chooseNum="chooseNum" :is_from="9"
							                  :callback="modalVisibleChange3"></chooseDepartment>

							<chooseDepartment ref="user1" :id="corpId" :agentid="agentid" noticeTitle="只展示在企业微信官方后台创建自建应用时，所设置的可见成员，只有他们才拥有接收跟进提醒的权限。" :show="showModalDepartment1" :chooseNum="chooseNum1" :departmentDisabled="1" :is_from="4"
							                  :callback="modalVisibleChange4"></chooseDepartment>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import WeChatModal from "@/components/WeChatModal.vue"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import editor from 'vue2-medium-editor'
	// import {message} from "ant-design-vue";
	// import { VEmojiPicker } from "v-emoji-picker"
	// import WEmoji from "@/common/js/wechatEmoji.js"
	import moment from 'moment'
	import {Sketch} from "vue-color";

	export default {
		components: {
			WeChatModal, chooseDepartment,
			'medium-editor': editor,
			"sketch-picker": Sketch,
		},
		data () {
			// let thisGlobal = this.global
			// let that = this
			// let MiniProgramButton = editor.MediumEditor.Extension.extend({
			// 	name: "miniProgram",
			//
			// 	init: function (options) {
			// 		this.button = this.document.createElement("button");
			// 		this.button.classList.add(
			// 			"medium-editor-action",
			// 			"medium-editor-miniprogram-action"
			// 		);
			// 		this.button.innerHTML = "设置小程序";
			//
			// 		this.on(this.button, "click", this.handleClick.bind(this));
			// 	},
			//
			// 	getButton: function () {
			// 		return this.button;
			// 	},
			//
			// 	getInstance: function () {
			// 		return this;
			// 	},
			//
			// 	handleClick: function (event) {
			// 		let index = parseInt(self.lastNode.dataset.key);
			// 		// console.log(that,'mediumEditor')
			//
			// 		let currentMediumEditor = that.mediumEditor[index]
			//
			// 		currentMediumEditor.saveSelection();
			//
			// 		// console.log(currentMediumEditor)
			// 		let liElement = event.path[1]
			// 		const toolbarWidth = liElement.parentElement.clientWidth;
			// 		const toolbarHeight = liElement.parentElement.clientHeight;
			//
			// 		this.addMiniProgramForm(event);
			//
			// 		let domMiniProgram = liElement.parentElement.nextSibling.nextSibling
			// 		const miniProgramWidth = 336;
			// 		const miniProgramHeight = domMiniProgram.clientHeight;
			// 		const domLeft = (toolbarWidth - miniProgramWidth) / 2;
			// 		const domTop = toolbarHeight - miniProgramHeight + 2; // 加 2 是为了消除底部的重叠区域
			//
			// 		domMiniProgram.style.cssText =
			// 			"display: block; visibility: visible; left: " + domLeft + "px; top: " + domTop + "px; width: " + miniProgramWidth + "px; position:absolute;";
			//
			// 		this.on(
			// 			document.getElementById("miniSave"),
			// 			"click",
			// 			function () {
			// 				let inpValue1 = liElement.parentElement.nextSibling.nextSibling.firstChild.children[0].value
			// 				let inpValue2 = liElement.parentElement.nextSibling.nextSibling.firstChild.children[1].value
			// 				let inpValue3 = liElement.parentElement.nextSibling.nextSibling.firstChild.children[2].value
			//
			// 				var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
			// 				if (inpValue1 == '' || inpValue2 == '' || inpValue3 == '') {
			// 					message.error("请填写小程序相关信息");
			// 					return false
			// 				} else if (reg.test(inpValue3)) {
			// 					message.error("备用网页错误或不存在");
			// 					return false
			// 				} else {
			// 					currentMediumEditor.restoreSelection()
			// 					currentMediumEditor.execAction("unlink")
			//
			// 					thisGlobal.createMiniPLink({
			// 						url : inpValue3,
			// 						data: {
			// 							miniprogramappid: inpValue1,
			// 							miniprogrampath : inpValue2
			// 						}
			// 					}, currentMediumEditor)
			// 					currentMediumEditor.trigger("editableInput", {}, currentMediumEditor.origElements);
			//
			//
			// 					domMiniProgram.parentElement.removeChild(
			// 						this.document.getElementById(
			// 							"medium-editor-toolbar-form-miniProgram"
			// 						)
			// 					)
			// 				}
			// 			}.bind(this)
			// 		);
			// 		this.on(
			// 			this.document.getElementById("miniClose"),
			// 			"click",
			// 			function (e) {
			// 				domMiniProgram.parentElement.removeChild(
			// 					this.document.getElementById(
			// 						"medium-editor-toolbar-form-miniProgram"
			// 					)
			// 				);
			// 			}.bind(this)
			// 		);
			// 	},
			//
			// 	addMiniProgramForm: function (event) {
			// 		let miniProgramForm = this.document.createElement("div");
			// 		miniProgramForm.classList.add("medium-editor-toolbar-miniProgram", "medium-editor-toolbar-form", "medium-editor-toolbar-form-active");
			// 		miniProgramForm.style.padding = "10px";
			// 		miniProgramForm.style.width = "410px";
			// 		miniProgramForm.id = "medium-editor-toolbar-form-anchor-miniProgram";
			// 		miniProgramForm.innerHTML = [
			// 			'<input type="text" class="medium-editor-toolbar-input miniProgram-appid-input miniProgram-inp1" ' +
			// 			'placeholder="填写小程序AppID，跳转小程序需与当前公众号绑定关联关系" style="display: block;width: 400px;">',
			// 			'<input type="text" class="medium-editor-toolbar-input miniProgram-path-input miniProgram-inp2" placeholder="填写小程序路径，例如：pages/index" style="display: block;width: 400px;">',
			// 			'<input type="text" class="medium-editor-toolbar-input miniProgram-url-input miniProgram-inp3" placeholder="备用网页，以http://或https://开头" style="display: block;width: 400px;">',
			// 			'<div class="btn-wrap" style="overflow: hidden;"><div style="float: right;"><a href="#" id="miniSave" class="medium-editor-toolbar-save">✓</a><a href="#" id="miniClose" class="medium-editor-toolbar-close">×</a></div></div>'
			// 		].join("");
			//
			// 		let miniProgramWrap = this.document.createElement("div");
			// 		miniProgramWrap.classList.add("medium-editor-toolbar-miniProgram-wrap");
			// 		miniProgramWrap.id = "medium-editor-toolbar-form-miniProgram";
			// 		miniProgramWrap.appendChild(miniProgramForm);
			//
			// 		let liElement = event.path[1]
			// 		liElement.parentElement.parentElement.appendChild(miniProgramWrap);
			// 	}
			// })
			return {
				link                : "",
				visible             : false,
				corpId              : "",
				textAreaValueHeader : '',
				textContent         : '',
				templateList        : [],
				wordNum             : 0,
				wordLimit           : 500,
				status              : 1,
				settingList         : [],
				// emojiShow          : false,
				options             : {
					toolbar      : false,
					placeholder  : {
						text: ""
					},
					anchorPreview: false,
					// paste        : {
					// 	forcePlainText : true,
					// 	cleanPastedHTML: true,
					// 	cleanAttrs     : ['class', 'style', 'dir', 'align', 'width', 'height', 'face', 'title', 'code', 'name', 'id', 'type', 'span', 'border', 'open', 'action', 'method', 'cols', 'for', 'rel', 'label', 'icon', 'value', 'max', 'min', 'classid']
					// }
				},
				mediumEditor        : [], // editor对象
				colorVisible        : false,
				//左侧
				isLoading          : false, //Loading 组件显示与隐藏
				urlId              : '',//编辑时，地址栏的id
				follow_id          : '', // 规则id
				agentid            : '', // 自建应用ID
				corpInfo           : [], //企业列表
				suite_id           : 1,//应用ID
				createDisabled     : false,//控制创建提醒按钮的禁用
				showModalDepartment: false, //成员选择框显示与隐藏
				showModalDepartment1 : false,
				corpArr            : [],//企业微信数组
				chooseNum          : 0,//已选择的部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				checkedList        : [], // 选中的成员
				checkedList1       : [],
				chooseNum1          : 0,//已选择的部门成员总个数
				chooseUserNum1      : 0,//成员个数
				departmentNum1      : 0,
				chooseDepartmentNum1: 0,//部门个数
				selectedUser       : [], // 成员
				typeArr            : [], // 接收数据类型
				party              : [], // 部门
				partyList          : [], // 部门列表
				times              : [ // 推送时间
					moment('09:00', "HH:mm"),
					moment('14:00', "HH:mm"),
					moment('18:00', "HH:mm")
				],
				keydownNode         : false,
				keydownNodeIndex    : 0,
			}
		},
		methods   : {
			getWordNum () {
				this.wordNum = 0
				for (let temp of this.templateList) {
					this.wordNum += temp.wordNum
				}
			},
			goBack () {
				localStorage.removeItem('backUrl')
				this.$router.push("/follow/list?isRefresh=1")
			},
			// 接收人员类型选择
			chooseType (type) {
				if (type == 0) {
					if (this.typeArr.length > 0 && this.typeArr[0] == 0) {
						this.typeArr = []
					} else {
						this.typeArr = [0]
						this.checkedList = []
						this.chooseNum = 0
						this.chooseUserNum = 0
						this.chooseDepartmentNum = 0
						this.party = []
					}
				} else {
					Array.prototype.indexOf = function (val) {
						for (let i = 0; i < this.length; i++) {
							if (this[i] == val) return i;
						}
						return -1;
					};
					let i = this.typeArr.indexOf(type)
					if (i > -1) {
						this.typeArr.splice(i, 1)
						if (type == 1) {
							this.party = []
						} else {
							this.checkedList = []
							this.chooseNum = 0
							this.chooseUserNum = 0
							this.chooseDepartmentNum = 0
						}
					} else {
						this.typeArr.push(type)
					}
				}
			},
			//部门选择弹窗组件
			showDepartmentList1 () {
				let arr = []
				this.checkedList1.map(x=>{
					arr.push(x.id)
				})
				this.$refs.user1.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user1.rightList = JSON.parse(JSON.stringify(this.checkedList1))
				this.showModalDepartment1 = true
			},
			modalVisibleChange4 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum1 = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum1 = userNum
					this.departmentNum1 = departmentNum
					this.chooseDepartmentNum1 = departmentNum
					if (this.chooseNum1 > 0) {
						this.checkedList1 = JSON.parse(JSON.stringify(list))
					}else {
						this.checkedList1 = []
					}
				}
				this.showModalDepartment1 = false
			},
			//部门成员选择弹窗组件
			showDepartmentList () {
				let arr = []
				this.checkedList.map(x=>{
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
				this.showModalDepartment = true
			},
			// 成员确认
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.checkedList = JSON.parse(JSON.stringify(list))
						this.selectedUser = JSON.parse(JSON.stringify(list))
					} else {
						this.checkedList = []
						this.selectedUser = []
					}
				}
				this.showModalDepartment = false
			},
			//重置
			clearDepartmentList () {
				this.checkedList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
			},
			// 获取部门列表
			async getPartyList () {
				const {data: res} = await this.axios.post('work-follow-msg/get-party-list', {
					suite_id: 1,
					corp_id : this.corpId
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.partyList = res.data.party_list
				}
			},
			// 改变时间
			changeTime (e, index) {
				this.$set(this.times, index, e)
			},
			// 删除推送时间
			deleteTime (index) {
				this.times.splice(index, 1)
			},
			// 添加推送时间
			addTime () {
				this.times.push(moment('00:00', "HH:mm"))
			},
			// 获取跟进状态
			async getFollowStatus (list) {
				let that = this
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
					that.follows = res.data.follow
					if (!list) {
						for (let follow of that.follows) {
							let temp = {
								id                 : follow.id,
								title              : follow.title,
								textAreaValueHeader: that.follows.length > 9 ? "" : '<p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前状态</span>&nbsp;</span>阶段，有<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前状态变化人数</span>&nbsp;</span>人已进入到下一阶段，尚有<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前阶段状态未改人数</span>&nbsp;</span>人继续停留在该阶段，其中超过1天未跟进有<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">超过1天数未跟进人数</span>&nbsp;</span>人、超过3天未跟进有<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">超过3天数未跟进人数</span>&nbsp;</span>人;<br></p>',
								textContent        : '',
								wordNum            : that.follows.length > 9 ? 0 : 48
							}
							temp.textContent = this.replaceEdit(temp.textAreaValueHeader)
							this.templateList.push(temp)
						}
						if (this.follows.length > 0) {
							this.templateList[this.templateList.length - 1].textAreaValueHeader = that.follows.length > 9 ? "" : '<p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前状态</span>&nbsp;</span>阶段，有<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前阶段状态未改人数</span>&nbsp;</span>人停留，请尽快沟通落实。</p>'
							this.templateList[this.templateList.length - 1].textContent = this.replaceEdit(this.templateList[this.templateList.length - 1].textAreaValueHeader)
							this.templateList[this.templateList.length - 1].wordNum = that.follows.length > 9 ? 0 : 16
						}
						let temp1 = {
							id                 : 0,
							title              : '标头语',
							textAreaValueHeader: that.follows.length > 9 ? "" : '<p><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">员工姓名</span>&nbsp;</span>，从00：00截止今日<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">发送时间点</span>&nbsp;</span><span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">可见员工</span>&nbsp;</span>数据汇总：</p><p>新增<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">新增客户数</span>&nbsp;</span>位客户，已对<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已跟进人数</span>&nbsp;</span>人跟进，留下<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已跟进条数</span>&nbsp;</span>条跟进记录。超过1天未跟进有<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">超过1天数未跟进人数</span>&nbsp;</span>人、超过3天未跟进有<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">超过3天数未跟进人数</span>&nbsp;</span>人；</p>',
							textContent        : '',
							wordNum            : that.follows.length > 9 ? 0 : 56
						}
						temp1.textContent = this.replaceEdit(temp1.textAreaValueHeader)
						this.templateList.unshift(temp1)
					} else {

						for (let l of list) {
							if (l.id == 0) {
								l['title'] = '标头语'
								l['textAreaValueHeader'] = this.setTemplate(l)
								l['wordNum'] = this.replaceBtn1(l['textAreaValueHeader']).length
							}
							let index = that.follows.findIndex(x => x.id == l.id)
							if (index > -1) {
								l['title'] = that.follows[index].title
								l['textAreaValueHeader'] = this.setTemplate(l)
								l['wordNum'] = this.replaceBtn1(l['textAreaValueHeader']).length
							}
						}
						this.templateList = JSON.parse(JSON.stringify(list))
					}
					this.getWordNum()
					this.isLoading = false
				}
			}
			,
			setTemplate (l) {
				let content = "<p>" + l.textContent.replace(/{username}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">员工姓名</span>&nbsp;</span>'
				).replace(/{newMemberNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">新增客户数</span>&nbsp;</span>'
				).replace(/{followMemberNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已跟进人数</span>&nbsp;</span>'
				).replace(/{followNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">已跟进条数</span>&nbsp;</span>'
				).replace(/{notChangeNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前阶段状态未改人数</span>&nbsp;</span>'
				).replace(/{sendTime}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">发送时间点</span>&nbsp;</span>'
				).replace(/{followUser}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">可见员工</span>&nbsp;</span>'
				).replace(/{notFollowDay_([\d]*)}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">超过$1天数未跟进人数</span>&nbsp;</span>'
				).replace(/{follow_id}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前状态</span>&nbsp;</span>'
				).replace(/{changeFollowNum}/g,
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">当前状态变化人数</span>&nbsp;</span>'
				).replace(/\n/g, '<br>') + "</p>"
				if (content == "<p></p>") {
					content = "<p><br></p>"
				}

				return content
			},
			// 获取高级设置
			async getSettingList () {
				const {data: res} = await this.axios.post("work-follow-msg/not-follow-day-list", {
					uid: localStorage.getItem('uid'),
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.settingList = []
					for (let day of res.data) {
						this.settingList.push({
							day: day
						})
					}
				}
			},
			changeStatus () {
				this.status = (this.status + 1) % 2
			},
			// 获取员工提醒规则
			async getDetail () {
				const {data: res} = await this.axios.post(
					"work-follow-msg/follow-user-detail",
					{
						uid    : localStorage.getItem('uid'),
						corp_id: this.corpId,
						agentid: this.agentid,
						user_id: this.urlId[0]
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (res.data.length == 0) {
						this.getFollowStatus()
					} else {
						this.typeArr = []
						this.party = res.data.follow_party
						this.checkedList = res.data.follow_user
						this.chooseNum = this.checkedList.length
						this.chooseUserNum = 0
						this.chooseDepartmentNum = 0
						this.checkedList.map(x=>{
							if(x.scopedSlots.title == 'custom'){
								this.chooseUserNum++
							}else if(x.scopedSlots.title == 'title'){
								this.chooseDepartmentNum++
							}
						})

						if (res.data.is_all == 1) {
							this.typeArr = [0]
						} else {
							if (this.party.length > 0) {
								this.typeArr.push(1)
							}
							if (this.checkedList.length > 0) {
								this.typeArr.push(2)
							}
						}
						this.status = res.data.status
						this.follow_id = res.data.follow_id
						this.times = []
						for (let st of res.data.send_time) {
							this.times.push(moment(st, 'HH:mm'))
						}
						this.templateList = res.data.send_content
						this.getFollowStatus(this.templateList)
					}
				}
			},
			// 创建提醒
			async createFollow () {
				this.createDisabled = true
				if (this.wordNum > 500) {
					this.$message.warning('发送内容超过500字')
					this.createDisabled = false
					return false
				}
				if (this.urlId.length == 0) {
					if (this.chooseNum1 == 0) {
						this.$message.warning('请选择推送成员')
						this.createDisabled = false
						return false
					}
				}
				if (this.typeArr.indexOf(2) > -1 && this.checkedList.length == 0) {
					this.$message.warning('请选择接收数据员工')
					this.createDisabled = false
					return false
				}else {
					this.party = []
					this.checkedList.map(x=>{
						if(x.scopedSlots.title == 'title'){
							this.party.push(x.id.replace('d-', ''))
						}
					})
				}

				let flag = true
				for (let temp of this.templateList) {
					if (temp.textContent != "" && temp.textContent.replace(/\n/g, '') != '') {
						flag = false
					}
				}
				if (flag) {
					this.$message.warning('请填写推送内容')
					this.createDisabled = false
					return false
				}
				let is_all = this.typeArr[0] == 0 ? 1 : 0
				let sendTime = []
				for (let t of this.times) {
					sendTime.push(moment(t).format("HH:mm"))
				}
				for (let i = 0; i < sendTime.length - 1; i++) {
					for (let j = i + 1; j < sendTime.length; j++) {
						if (sendTime[i] == sendTime[j]) {
							this.$message.warning('推送时间不能重复')
							this.createDisabled = false
							return false
						}
					}
				}
				let templateList = JSON.parse(JSON.stringify(this.templateList))
				for (let temp of templateList) {
					delete temp.title
					delete temp.textAreaValueHeader
					delete temp.wordNum
				}
				const {data: res} = await this.axios.post(
					"work-follow-msg/follow-user-post",
					{
						corp_id     : this.corpId,
						agentid     : this.agentid,
						follow_id   : this.follow_id,
						user_ids    : this.urlId.length == 0 ? this.checkedList1 : this.urlId,
						is_all      : is_all,
						follow_party: this.party,
						follow_user : this.checkedList,
						status      : this.status,
						send_time   : sendTime,
						send_content: templateList
					}
				)
				if (res.error != 0) {
					this.createDisabled = false
					this.$message.error(res.error_msg);
				} else {
					this.createDisabled = false
					localStorage.removeItem('backUrl')
					if (this.urlId > 0) {
						this.$router.push("/follow/list?isRefresh=1")
					} else {
						this.$router.push("/follow/list")
					}
				}
			},
			// 初始化文本信息的格式
			initTextMsgContent (content) {
				const _this = this
				// if (content.search(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g) !== -1) {
				// 	WEmoji.wechatEmojiKey.map(alt => {
				// 		let preg = new RegExp(_this.utils.addslashes(alt), "g")
				// 		let emojiUrl = WEmoji.getEmojiUrl(alt)
				// 		content = content.replace(
				// 			preg,
				// 			'<img src="' +
				// 			emojiUrl +
				// 			'" alt="' +
				// 			alt +
				// 			'" height="21" width="21"/>'
				// 		)
				// 	})
				// }
				return content.replace(/[\r\n|\n]/g, "<br/>")
			},
			// 获取最后的文本选择框焦点
			getCursor (self) {
				let sel = getSelection()
				if (!sel) {
					return
				}
				let node = sel.anchorNode
				let isIn = false
				while (node && node.nodeType != node.DOCUMENT_NODE) {
					var cls = node.classList
					if (cls && cls.contains("content-editable")) {
						isIn = true
						break
					}
					node = node.parentNode
				}
				if (!isIn) return
				self.lastRange = sel.getRangeAt(0)
				self.lastNode = node
			}
			,
			// 插入自定义HTML
			insertHTMLCommand (doc, html) {
				if (typeof self.lastNode === 'undefined' || !self.lastNode.classList.contains("content-editable")) {
					return false
				}

				let range, toReplace, el, fragment, node, lastNode, ecArgs = ['insertHTML', false, html]

				range = self.lastRange
				toReplace = range.commonAncestorContainer

				if (editor.MediumEditor.util.isMediumEditorElement(toReplace) && !toReplace.firstChild) {
					range.selectNode(toReplace.appendChild(doc.createTextNode('')))
				} else if ((toReplace.nodeType === 3 && range.startOffset === 0 && range.endOffset === toReplace.nodeValue.length) ||
					(toReplace.nodeType !== 3 && toReplace.innerHTML === range.toString())) {
					// Ensure range covers maximum amount of nodes as possible
					// By moving up the DOM and selecting ancestors whose only child is the range
					while (!editor.MediumEditor.util.isMediumEditorElement(toReplace) &&
					toReplace.parentNode &&
					toReplace.parentNode.childNodes.length === 1 &&
					!editor.MediumEditor.util.isMediumEditorElement(toReplace.parentNode)) {
						toReplace = toReplace.parentNode
					}
					range.selectNode(toReplace)
				}
				range.deleteContents()

				el = doc.createElement('div')
				el.innerHTML = html
				fragment = doc.createDocumentFragment()
				while (el.firstChild) {
					node = el.firstChild
					lastNode = fragment.appendChild(node)
				}
				range.insertNode(fragment)

				// Preserve the selection:
				if (lastNode) {
					range = range.cloneRange()
					range.setStartAfter(lastNode)
					range.collapse(true)
					editor.MediumEditor.selection.selectRange(doc, range)
				}

				if (doc.execCommand.callListeners) {
					doc.execCommand.callListeners(ecArgs, true)
				}
				const index = parseInt(self.lastNode.dataset.key);
				let textContent = ''
				if (!this.follow_id) {
					textContent = this.replaceBtn1(self.lastNode.innerHTML)
				} else {
					textContent = this.replaceBtn2(self.lastNode.innerHTML)
				}
				this.templateList[index].wordNum = textContent.length
				this.getWordNum()
				if (this.wordNum <= this.wordLimit) {
					this.templateList[index].textAreaValueHeader = this.replace2(self.lastNode.innerHTML)
					if (!this.follow_id) {
						this.templateList[index].textContent = this.replace1(self.lastNode.innerHTML)
					} else {
						this.templateList[index].textContent = this.replaceEdit(self.lastNode.innerHTML)
					}
				}
				let key = parseInt(self.lastNode.dataset.key);
				this.mediumEditor[key].origElements.scrollTop = this.mediumEditor[key].origElements.scrollHeight

				let event = {
					currentTarget: this.mediumEditor[key].origElements
				}
				this.mediumEditor[key].events.updateInput(event.currentTarget, event);
			}
			,
			// 插件初始化成功的回调
			editorCreated (mediumEditor) {
				let key = parseInt(mediumEditor.origElements.dataset.key);
				this.mediumEditor.push(mediumEditor)
				this.mediumEditor[key].subscribe('focus', this.editableFocus);
				this.mediumEditor[key].subscribe('editableKeydown', this.editableKeydown);
				this.mediumEditor[key].subscribe('editablePaste', this.editablePaste);
				delete self.lastRange
				delete self.lastNode
			}
			,
			// 文本域获取焦点
			editableFocus (e) {
				if (e.target.innerHTML === '' || e.target.innerHTML == '<p></p>' || e.target.innerHTML == '<br>') {
					e.target.innerHTML = '<p><br/></p>';
				}
			},
			//监听键盘事件，超过300字，不让输入
			editableKeydown (event) {
				if (this.wordNum >= this.wordLimit && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && !(event.keyCode == 65 && (event.metaKey || event.ctrlKey))) {
					event.preventDefault();
				}

				if (event.keyCode == 86 && (event.metaKey || event.ctrlKey)) {

				}
				if (event.keyCode == 13) {
					this.keydownNodeIndex = 0
					this.getParentP4Label(self.lastRange.startContainer)
				}
				this.keydownNode = event.keyCode == 13
			},
			// 找到startContainer的p父元素
			getParentP4Label (node) {
				if (node.nodeName != 'P') {
					this.getParentP4Label(node.parentNode)
				} else {
					this.getPreviousSiblingIndex(node)
					return
				}
			},
			// node前面兄弟元素的个数
			getPreviousSiblingIndex (node) {
				if (node.previousSibling) {
					this.keydownNodeIndex++
					this.getPreviousSiblingIndex(node.previousSibling)
				} else {
					return
				}
			},
			//监听粘贴事件
			editablePaste (event, target) {
				this.invlideText()
			},
			invlideText () {
				let key = parseInt(self.lastNode.dataset.key)
				const customNode = this.mediumEditor[key].origElements
				let wordNum = 0
				for (let i = 0; i < this.templateList.length; i++) {
					if (i != key) {
						wordNum += this.templateList[i].wordNum
					}
				}
				const {startNode, startOffset, endNode, endOffset} = this.global.getRangeInfo(customNode, this.wordLimit - wordNum);

				if (typeof startNode.nodeValue !== 'undefined') {

					let newRange = document.createRange()
					newRange.setStart(startNode, startOffset);
					newRange.setEnd(endNode, endOffset);
					newRange.deleteContents()

					this.templateList[key].textAreaValueHeader = this.replace2(self.lastNode.innerHTML)
					if (!this.follow_id) {
						this.templateList[key].textContent = this.replace1(self.lastNode.innerHTML)
					} else {
						this.templateList[key].textContent = this.replaceEdit(self.lastNode.innerHTML)
					}

					this.wordNum = this.wordLimit
				}
			}
			,
			changeContentInput (operation) {
				if (operation.api.origElements.innerHTML == '' || operation.api.origElements.innerHTML == '<br>') {
					operation.api.origElements.innerHTML = '<p><br/></p>'
				}
				if (self.lastNode && self.lastNode.dataset && (self.lastNode.dataset.key || self.lastNode.dataset.key == 0)) {
					let index = parseInt(self.lastNode.dataset.key);
					//判断链接格式
					var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
					var reg2 = /href="\{neverFollowUser\}"/g
					if (reg.test(operation.api.origElements.innerHTML) && !reg2.test(operation.api.origElements.innerHTML)) {
						this.$message.error('请填写正确的链接')
						this.mediumEditor[index].execAction('unlink')
					}

					if (self.lastNode) {
						let textContent = ''
						if (!this.follow_id) {
							textContent = this.replaceBtn1(self.lastNode.innerHTML)
						} else {
							textContent = this.replaceBtn2(self.lastNode.innerHTML)
						}
						this.templateList[index].wordNum = textContent.length
						this.getWordNum()
						if (this.wordNum <= this.wordLimit) {
							this.templateList[index].textAreaValueHeader = this.replace2(operation.api.origElements.innerHTML)
							if (!this.follow_id) {
								this.templateList[index].textContent = this.replace1(self.lastNode.innerHTML)
							} else {
								this.templateList[index].textContent = this.replaceEdit(self.lastNode.innerHTML)
							}
						} else {
							this.invlideText();
						}
						if (this.keydownNode) {
							let startNode = self.lastNode.childNodes[this.keydownNodeIndex + 1]
							let newRange = document.createRange()
							newRange.setStart(startNode, 0)
							let newSelection = window.getSelection()
							newSelection.removeAllRanges()
							newSelection.addRange(newRange)
							this.keydownNode = false
						}
					}
				}
			}
			,
			// 转化textAreaValueHeader
			replace2 (text) {
				return text.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
			},
			// 可视化区域变量按钮展示常量
			replaceInit (text, index) {
				if (!text) {
					return ''
				}
				return text.replace(/(&nbsp;)?;<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>员工姓名<\/span>(&nbsp;)?/g, '<span style="color: #01b065">张三</span>').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>发送时间点<\/span>(&nbsp;)?/g, '<span style="color: #01b065">' + moment(this.times[0]).format('HH：mm') + '</span>').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>可见员工<\/span>(&nbsp;)?/g, '<span style="color: #01b065">李四</span>').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>新增客户数<\/span>(&nbsp;)?/g, '<span style="color: #01b065">1</span>').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进人数<\/span>(&nbsp;)?/g, '<span style="color: #01b065">1</span>').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进条数<\/span>(&nbsp;)?/g, '<span style="color: #01b065">1</span>').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态变化人数<\/span>(&nbsp;)?/g, '<span style="color: #01b065">1</span>').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前阶段状态未改人数<\/span>(&nbsp;)?/g, '<span style="color: #01b065">1</span>').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>超过([\d]*)天数未跟进人数<\/span>(&nbsp;)?/g, '<span style="color: #01b065">1</span>').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态<\/span>(&nbsp;)?/g, '<span style="color: #01b065">' + this.follows[index == 0 ? 0 : index - 1].title + '</span>')
			},
			// 新建按钮插入不算字数
			replaceBtn1 (text) {
				return text.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>员工姓名<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>发送时间点<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>可见员工<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>新增客户数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进人数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进条数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态变化人数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前阶段状态未改人数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>超过([\d]*)天数未跟进人数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态<\/span>(&nbsp;)?/g, '').replace(/<br([^>]*)>/g, '').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
			},
			// 编辑按钮插入不算字数
			replaceBtn2 (text) {
				return text.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '').replace(/<\/p>/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>员工姓名<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>发送时间点<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>可见员工<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>新增客户数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进人数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进条数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态变化人数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前阶段状态未改人数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>超过([\d]*)天数未跟进人数<\/span>(&nbsp;)?/g, '').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态<\/span>(&nbsp;)?/g, '').replace(/([^<p>]+)<p([^>]*)>/g, "$1").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
			},
			// 新建时转化textContent
			replace1 (text) {
				return text.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>员工姓名<\/span>(&nbsp;)?/g, '{username}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>发送时间点<\/span>(&nbsp;)?/g, '{sendTime}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>可见员工<\/span>(&nbsp;)?/g, '{followUser}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>新增客户数<\/span>(&nbsp;)?/g, '{newMemberNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进人数<\/span>(&nbsp;)?/g, '{followMemberNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进条数<\/span>(&nbsp;)?/g, '{followNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态变化人数<\/span>(&nbsp;)?/g, '{changeFollowNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前阶段状态未改人数<\/span>(&nbsp;)?/g, '{notChangeNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>超过([\d]*)天数未跟进人数<\/span>(&nbsp;)?/g, '{notFollowDay_$3}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态<\/span>(&nbsp;)?/g, '{follow_id}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
			},
			// 编辑时转化textContent
			replaceEdit (text) {
				return text.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>员工姓名<\/span>(&nbsp;)?/g, '{username}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>发送时间点<\/span>(&nbsp;)?/g, '{sendTime}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>可见员工<\/span>(&nbsp;)?/g, '{followUser}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>新增客户数<\/span>(&nbsp;)?/g, '{newMemberNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进人数<\/span>(&nbsp;)?/g, '{followMemberNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>已跟进条数<\/span>(&nbsp;)?/g, '{followNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态变化人数<\/span>(&nbsp;)?/g, '{changeFollowNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前阶段状态未改人数<\/span>(&nbsp;)?/g, '{notChangeNum}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>超过([\d]*)天数未跟进人数<\/span>(&nbsp;)?/g, '{notFollowDay_$3}').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange"([^>]*)>当前状态<\/span>(&nbsp;)?/g, '{follow_id}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
			},
			handleOk (e) {
				this.visible = false;
				let key = parseInt(self.lastNode.dataset.key);
				let dom = {}
				if (typeof this.mediumEditor[key].options.ownerDocument == 'undefined') {
					dom = this.mediumEditor[key].options.ownerDocument
				} else {
					dom = this.mediumEditor[key].options.ownerDocument
				}
				let html = this.getLink(this.link)
				this.insertHTMLCommand(dom, html)
			},
			handleCancel (e) {
				this.visible = false;
			},
			//点击插入客户名称标签
			addTag: function (title) {
				if (title == '客户未跟进列表') {
					this.visible = true
					return
				}
				let key = parseInt(self.lastNode.dataset.key);
				let dom = {}
				if (typeof this.mediumEditor[key].options.ownerDocument == 'undefined') {
					dom = this.mediumEditor[key].options.ownerDocument
				} else {
					dom = this.mediumEditor[key].options.ownerDocument
				}
				let html = this.getHtml(title)
				this.insertHTMLCommand(dom, html)

			},
			getHtml (title) {
				return '<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange" >' + title + '</span>&nbsp;</span>'
			},
			getLink (title) {
				return '<a href="{neverFollowUser}">' + title + '</a>'
			},
			moment,
		},
		// beforeCreate () {
		// 	if (!this.$store.state.corpId) {
		// 		this.$router.back()
		// 	}
		// },
		created () {
			let _this = this
			document.addEventListener("selectionchange", function () {
				_this.getCursor(self)
			})
			this.urlId = this.$route.query.id ? this.$route.query.id.split(',') : []
			this.agentid = this.$route.query.agentid
			this.corpId = this.$route.query.corpid
			if (!this.corpId) {
				this.$router.back()
				return
			}
			this.getPartyList()
			localStorage.setItem('backUrl', '/follow/list')
			this.getSettingList()
			if (this.urlId.length == 0) {
				this.isLoading = true
				this.getFollowStatus()
			} else if (this.urlId.length > 1) {
				this.isLoading = true
				this.getFollowStatus()
			} else if (this.urlId.length == 1) {
				this.isLoading = true
				this.getDetail()
			}
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";

	.pull-right {
		width: 672px;
		/*max-height: 574px;*/
		/*height: 530px;*/
		background: #FFF;
		border: 1px solid #D8D8D8;
		padding: 24px;
		/*overflow: auto;*/
	}

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	.msg_content_txt {
		width: calc(100% - 46px);
		border: 0;
		padding: 10px 16px;
		border-radius: 4px;
		font-size: 14px;
		color: #1A1A1A;
		background: #FFF;
		float: right;
		word-break: break-word;

		/deep/ .tag-btn {
			margin: 2px 0;
			display: inline-block;
			padding: 0 5px;
			font-size: 12px;
			border-radius: 4px;
			height: 20px;
			line-height: 19px;
		}
	}

	.changeType-text {
		background: @color-bgc;
		border: 1px solid @border-color;
		border-radius: 2px;
		padding: 7px 27px 6px 10px;
		font-size: 12px;
		width: 100%;
		/*margin-top: 12px;*/
		max-width: 673px;
		line-height: 20px;
		margin-bottom: 10px;
	}

	.content-editable {
		display: inline-block;
		width: calc(100% - 100px);
		font-size: 14px;
		line-height: 25px;
		padding: 15px;
		border: 1px solid #D9D9D9;
		height: 160px;
		overflow: auto;

		/deep/ p {
			margin: 0;
			word-break: break-word;
		}

		/deep/ .tag-btn {
			margin: 2px 0;
			display: inline-block;
			padding: 0 5px;
			font-size: 12px;
			border-radius: 4px;
			height: 20px;
			line-height: 19px;
		}
	}

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

	.type {
		display: inline-block;
		width: 65px;
		border-right: 1px solid transparent;
		text-align: center;
	}

	/*.fl {*/
	/*	float: left;*/
	/*}*/


	.mt {
		margin-bottom: 15px;
		overflow: hidden;
		background-color: #FFFFFF;
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

	/deep/ .ant-form-item-control {
		margin-left: 15px;
		margin-bottom: 10px;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 52px;
	}

	.color-box {
		display: inline-block;
		width: 62px;
		height: 30px;
		line-height: 30px;
		margin: 0px;
		border: 1px solid #CCC;
		cursor: pointer;
	}

	.color-show {
		width: 16px;
		height: 16px;
		display: inline-block;
		margin: 0 10px;
	}
</style>