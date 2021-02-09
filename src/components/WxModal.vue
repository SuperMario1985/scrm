<template>
	<div>
		<a-modal title="选择公众号" v-model="showModal" @ok="handleOk" @cancel="handleCancel" width="888">
			<div style="height: 270px;">
				<a-select
						showSearch
						optionFilterProp="children"
						style="width: 200px;margin-bottom: 20px;margin-left: 5px;"
						@change="changeWx"
						v-model="changeBackground"
						v-if="wxInfo[0]"
				>
					<template v-for="item in wxInfo">
						<a-select-option :value="item.wx_id" v-if="item.authorizer_type != 'unauthorized' && item.verify_type == '已认证'">
							{{item.nick_name}}
						</a-select-option>
					</template>
				</a-select>
				<div style="height: 230px;" class="wxtpl">
					<template v-for="(item,index) in wxInfo" style="display: inline-block;">
						<template v-if="routeName != 'scene' && routeName != 'template'">
							<a-radio-group @change="changeWx2(item.wx_id,item.nick_name)" v-model="changeBackground"
							                               v-if="item.authorizer_type != 'unauthorized' && item.verify_type == '已认证'">
							<a-radio-button :value="item.wx_id">
								<div>
									<a-avatar :src="item.head_img" shape="square"/>
									<span class="text">{{item.nick_name}}</span>
								</div>
								<div style="font-size: 10px;line-height: 20px;margin-top: 5px;"
								     v-if="material_type">
									<span>最后时间：</span>{{item.pull_time || '暂无'}}
								</div>
							</a-radio-button>
						</a-radio-group>
						</template>
						<!--						渠道二维码、模板消息仅支持服务号-->
						<template v-if="routeName == 'scene' || routeName == 'template'">
							<a-radio-group @change="changeWx2(item.wx_id,item.nick_name)" v-model="changeBackground"
							               v-if="item.authorizer_type != 'unauthorized' && item.service_type == 2">
								<a-radio-button :value="item.wx_id">
									<div>
										<a-avatar :src="item.head_img" shape="square"/>
										<span class="text">{{item.nick_name}}</span>
									</div>
								</a-radio-button>
							</a-radio-group>
						</template>
					</template>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import axios from 'axios'
	import {message} from "ant-design-vue";

	export default {
		name : "wxModal",
		props: {
			material_type: {
				type   : String,
				default: ''
			},
			show         : {
				type   : Boolean,
				default: false
			},
			callback     : {
				type   : Function,
				default: null
			},
			hasName:{
				type   : String,
				default: ''
			},
			source:{
				type   : String,
				default: ''
			},
			type : {
				type : String,
				default : ''
			},
			corpId1 : {
				type : String,
				default : ''
			},
			wxId : {
				type : String,
				default : ''
			}
		},
		data () {
			let changeBackground =
				localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				showModal       : false, //新建选择公众号对话框的显示与隐藏
				wxInfo          : [], //微信公众号列表
				changeBackground: changeBackground, //选中背景色
				wxNum           : changeBackground, //修改后的微信id值
				authorizer_type : '',//选中的公众号授权状态,authorized：已授权、updateauthorized：更新授权、unauthorized：取消授权
				wxNickName      : this.$store.state.wxNickName,//选中的微信公众号名字
				routeName       : '',//地址栏名称
			};
		},

		methods: {
			handleOk (e, wxNum) {
				if(localStorage.getItem('isMasterAccount') == 2){
					this.getPermissionButton()
				}else {
					this.showModal = false;
					this.$store.dispatch("changeWxNum", this.wxNum);
					this.$store.commit("changeWxNickName", this.wxNickName);
					if (this.callback !== null && typeof this.callback === "function") {
						this.callback("ok", this.wxNum, this.wxNickName);
					}
				}
			},
			handleCancel (e) {
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("cancel");
				}
				this.showModal = false;
			},
			changeWx (value) {
				this.wxInfo.map((x) => {
					if (value == x.wx_id) {
						this.wxNickName = x.nick_name
					}
				})
				this.wxNum = value;
			},
			changeWx2 (wx_id, nick_name) {
				this.wxNum = wx_id;
				this.wxNickName = nick_name
			},
			async getPermissionButton(){
				const {data: res} = await axios.post(
					"sub-user/get-sub-user-authority",
					{
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem("sub_id"),
						account_id     : this.wxNum,
						type           : this.type != '' ? this.type : localStorage.getItem("type"),//0公众号，1企业微信
						source:this.source,//区分内容引擎和其他页面
						corp_id        : this.type == 2 ? this.corpId1 : '',
						wx_id          : this.type == 2 ? this.wxNum : '',
					}
				);
				if (res.error == 0) {
					if(res.data.length > 0){
						if(this.hasName != ''){
							let names = this.hasName.split(',')
							let flag = true
							if(names.length > 0) {
								for(let i = 0; i < names.length; i++) {
									if(res.data.indexOf(names[i]) == -1) {
										message.error('该公众号未配置相关功能权限，无法选择');
										flag = false
										return false
									}
								}
								if(flag) {
									this.showModal = false;
									this.$store.dispatch("changeWxNum", this.wxNum);
									this.$store.commit("changeWxNickName", this.wxNickName);
									if (this.callback !== null && typeof this.callback === "function") {
										this.callback("ok", this.wxNum, this.wxNickName);
									}
								}
							} else if(res.data.indexOf(this.hasName) == -1 ){
								//没找到
								message.error('该公众号未配置相关功能权限，无法选择');
							}else {
								this.showModal = false;
								this.$store.dispatch("changeWxNum", this.wxNum);
								this.$store.commit("changeWxNickName", this.wxNickName);
								if (this.callback !== null && typeof this.callback === "function") {
									this.callback("ok", this.wxNum, this.wxNickName);
								}
							}
						}else {
							this.showModal = false;
							this.$store.dispatch("changeWxNum", this.wxNum);
							if (this.callback !== null && typeof this.callback === "function") {
								this.callback("ok", this.wxNum, this.wxNickName);
							}
						}
					}else {
						message.error('无权限');
					}
				} else {
					message.error('获取权限按钮列表失败！');
				}
			},
			async getWx () {
				let is_from_content = 0
				if(this.$route.path == '/filingCabinet/list'){
					is_from_content = 1
				}
				const {data: res} = await axios.post(
					"wx-authorize-info/get-authrize-info",
					{
						uid          : localStorage.getItem("uid"),
						isMasterAccount:localStorage.getItem('isMasterAccount'),
						sub_id       : localStorage.getItem('sub_id'),
						material_type: this.material_type,
						is_from_content:is_from_content,//是否判断权限展示,0判断，1不判断
					}
				)
				this.wxInfo = res.data.info
				for(let wx of this.wxInfo) {
					if(wx.verify_type == '已认证') {
						this.wxNum = wx.wx_id
						this.changeBackground =wx.wx_id
						return false
					}
				}

			}
		},
		watch  : {
			show (newValue) {
				this.showModal = newValue;
				this.changeBackground = localStorage.getItem('wxNum')
				if (this.material_type) {
					this.getWx()
				} else {
					this.$store.dispatch("getWx", info => {
						this.wxInfo = info
						this.wxNum = this.$store.state.wxNum
						if (!this.changeBackground && this.wxInfo.length > 0) {
							this.changeBackground = this.$store.state.wxNum;
							this.wxNum = this.$store.state.wxNum;
							this.wxNickName = this.$store.state.wxNickName;
						}
					});
				}
				this.routeName = this.$route.name
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

	/deep/ .wxtpl .ant-radio-button-wrapper-checked {
		border: 2px solid #01b065 !important;
	}

	.text {
		margin-left: 5px;
		vertical-align: middle;
		display: inline-block;
		width: calc(100% - 37px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/deep/.ant-radio-group {
		vertical-align: top;
	}
</style>
