<template>
	<div>
		<!--选择群聊弹窗-->
		<a-modal v-model="chatVisible" title="选择群聊" @ok="handleOk" @cancel="handleCancle" class="msg-modal"
		         :zIndex="9999">
			<a-input-search placeholder="输入群名称" @input="getChatList(1)" v-model="searchValue"/>
			<div v-if="noticeTitle" style="color: #FF562D;margin-top: 10px;">{{noticeTitle}}</div>
			<p style="margin: 10px 0;">全部群聊（{{count}}）：</p>
			<div style="height: 300px;" class="chat-checkbox">
				<a-checkbox-group :value="chatData" :key="checkedKey">
					<a-row v-for="item in chatList">
						<a-checkbox :value="item.chat_id"
						            :disabled="item.isRemind == 1 && isDisable == 1 && content(chatIds, item.chat_id)"
						            @click="chooseChat(item.chat_id)">
								<span style="background: #1890FF;width: 36px;height:36px;margin-right: 5px;vertical-align: top;border-radius: 4px;float: left;"
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
								<a-popover placement="topLeft" :overlayStyle="{'z-index':999999999}">
									<template slot="content">
										{{item.name}}
									</template>
									<div style="width: calc(100% - 100px);overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
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
	import axios from "axios";
	import img from '../assets/chat.png'
	import img2 from '../assets/useradvart.png'

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	export default {
		name : "wxModal",
		props: {
			show       : {
				type   : Boolean,
				default: false
			},
			chatIds    : { // 客户提醒编辑时群聊不禁选
				type   : Array,
				default: () => {
				}
			},
			chatArr    : {
				type   : Array,
				default: () => {
				}
			},
			callback   : {
				type   : Function,
				default: null
			},
			isDisable  : { // 1 根据isRemind禁选
				type   : Number,
				default: 0
			},
			corpId     : {
				type   : String,
				default: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
			},
			noticeTitle: {
				type   : String,
				default: ''
			},
			isRemindAll: {
				type   : Number,
				default: 0
			},
			is_list    : { // 判断是否限制权限可见范围，1限制
				type   : Number,
				default: 0
			},
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				img,
				img2,
				chatVisible: false,//群聊弹窗的显示与隐藏
				// corpId     : corpId,//企业微信选中的id
				chatList   : [],//群聊列表
				cancelFlag : false,
				checkedKey : 0,
				searchValue: '',//群聊搜索输入内容
				page2      : 1,//群聊的页码
				count      : 0,//群聊总数
				chatData   : [],//确定选择的群聊数据
				chooseNum  : 0,//确定选择的群聊数量
			};
		},

		methods: {
			content (ids, id) {
				for (let i of ids) {
					if (i == id) {
						return false
					}
				}
				return true
			},
			//获取群聊列表
			async getChatList (page = 1) {
				this.cancelFlag = true
				const {data: res} = await this.axios.post('work-chat/chat-list', {
					corp_id      : this.corpId,
					name         : this.searchValue,
					is_remind_all: this.isRemindAll,
					page         : page,
					is_list      : this.is_list
				}, {cancelToken: source.token})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.count = res.data.count
					this.cancelFlag = false
					this.page2 = page
					if (this.page2 == 1) {
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
									if (Math.ceil(that.count / 15.0) > that.page2) {
										that.getChatList(that.page2 + 1)
									}
								}
							}
						})
					} else {
						this.chatList = this.chatList.concat(res.data.list)
					}
				}
			},
			chooseChat (e) {
				let flag = true
				for (let i = 0; i < this.chatData.length; i++) {
					if (this.chatData[i] == e) {
						this.chatData.splice(i, 1)
						flag = false
					}
				}
				if (flag) {
					this.chatData.push(e)
				}
			},
			handleOk () {
				this.searchValue = ''
				this.chooseNum = this.chatData.length
				this.chatVisible = false

				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("ok", this.chooseNum, this.chatData);
				}
			},
			handleCancle () {
				this.checkedKey++
				if (this.cancelFlag) {
					source.cancel()
				}
				this.searchValue = ''
				this.chatVisible = false
				this.chatData = []
				this.chatList = []

				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("cancel");
				}
			},
		},
		watch  : {
			show (newValue) {
				this.chatVisible = newValue;
				if (this.chatVisible) {
					this.searchValue = ''
					this.chatData = JSON.parse(JSON.stringify(this.chatArr))
					this.getChatList()
				}
			},
		},

		created () {
		}
	};
</script>

<style lang='less' scoped>
	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 47px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .ant-radio-group {
		vertical-align: top;
	}

	.chat-checkbox /deep/ .ant-checkbox-wrapper {
		width: 100%;
		border-bottom: 1px dashed #E9E9E9;
		padding: 10px 0;
	}

	.chat-checkbox /deep/ .ant-checkbox {
		float: right;
		margin-top: 12px;
	}

	.noMore {
		text-align: center;
		padding: 10px 0;
		font-size: 12px;
		color: #999;
	}
</style>
