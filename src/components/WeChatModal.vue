<template>
	<div>
		<a-modal title="选择企业微信" v-model="showModal" @ok="handleOk" @cancel="handleCancel" width="888">
			<div style="height: 270px;">
				<a-select
						showSearch
						optionFilterProp="children"
						style="width: 200px;margin-bottom: 20px;margin-left: 5px;"
						@change="changeWx"
						v-model="changeBackground"
						v-if="corpInfo[0]"
				>
					<template v-for="item in corpInfo">
						<a-select-option :value="item.corpid">
							{{item.corp_name}}
						</a-select-option>
					</template>
				</a-select>
				<div style="height: 230px;" class="wxtpl">
					<template v-for="(item,index) in corpInfo" style="display: inline-block;">
						<template v-if="routeName != 'scene' && routeName != 'template'">
							<a-radio-group @change="changeWx2(item.corpid,item.corp_name)" v-model="changeBackground"
							              >
								<a-radio-button :value="item.corpid">
									<div>
										<img src="../assets/WeChatLogo.png" alt="" style="border-radius: 4px;width: 32px;">
										<span class="text">{{item.corp_name}}</span>
									</div>
								</a-radio-button>
							</a-radio-group>
						</template>
						<!--						渠道二维码、模板消息仅支持服务号-->
						<template v-if="routeName == 'scene' || routeName == 'template'">
							<a-radio-group @change="changeWx2(item.corpid,item.corp_name)" v-model="changeBackground">
								<a-radio-button :value="item.corpid">
									<div>
										<a-avatar :src="item.head_img" shape="square"/>
										<span class="text">{{item.corp_name}}</span>
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
	import axios from "axios";
	import {message} from "ant-design-vue";

	export default {
		name : "wxModal",
		props: {
			show    : {
				type   : Boolean,
				default: false
			},
			callback: {
				type   : Function,
				default: null
			},
			hasName:{
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
				localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				showModal       : false, //新建选择公众号对话框的显示与隐藏
				corpInfo          : [], //企业微信列表
				changeBackground: changeBackground, //选中背景色
				corpId           : changeBackground, //修改后的企业微信id值
				corpName      : this.$store.state.corpName,//选中的企业微信名字
				routeName       : '',//地址栏名称
			};
		},

		methods: {
			handleOk () {
				if(localStorage.getItem('isMasterAccount') == 2){
					this.getPermissionButton()
				}else {
					this.showModal = false;
					let corp = this.corpInfo.find(corp => corp.corpid == this.corpId)
					this.$store.dispatch("changeCorp", corp);
					if (this.callback !== null && typeof this.callback === "function") {
						this.callback("ok", this.corpId, corp.corp_name);
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
				this.corpId = value;
			},
			changeWx2 (corpid, corp_name) {
				this.corpId = corpid;
				this.corpName = corp_name
			},
			async getPermissionButton(){
				const {data: res} = await axios.post(
					"sub-user/get-sub-user-authority",
					{
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem("sub_id"),
						account_id     : this.corpId,
						type           : this.type != '' ? this.type : localStorage.getItem("type"),//0公众号，1企业微信
						corp_id        : this.type == 2 ? this.corpId : '',
						wx_id          : this.type == 2 ? this.wxId : '',
					}
				);
				if (res.error == 0) {
					if(res.data.length > 0){
						if(this.hasName != ''){
							let names = this.hasName.split(',')
							if(names.length > 0) {
								let flag = true
								for(let i = 0; i < names.length; i++) {
									if(res.data.indexOf(names[i]) == -1) {
										message.error('该企业微信未配置相关功能权限，无法选择');
										flag = false
										return false
									}
								}
								if(flag) {
									this.showModal = false;
									let corp = this.corpInfo.find(corp => corp.corpid == this.corpId)
									this.$store.dispatch("changeCorp", corp);
									if (this.callback !== null && typeof this.callback === "function") {
										this.callback("ok", this.corpId, corp.corp_name);
									}
								}
							} else if(res.data.indexOf(this.hasName) == -1){
								//没找到
								message.error('该企业微信未配置相关功能权限，无法选择');
							}else {
								this.showModal = false;
								let corp = this.corpInfo.find(corp => corp.corpid == this.corpId)
								this.$store.dispatch("changeCorp", corp);
								if (this.callback !== null && typeof this.callback === "function") {
									this.callback("ok", this.corpId, corp.corp_name);
								}
							}
						}else {
							this.showModal = false;
							let corp = this.corpInfo.find(corp => corp.corpid == this.corpId)
							this.$store.dispatch("changeCorp", corp);
							if (this.callback !== null && typeof this.callback === "function") {
								this.callback("ok", this.corpId, corp.corp_name);
							}
						}
					}else {
						message.error('无权限');
					}
				} else {
					message.error('获取权限按钮列表失败！');
				}
			},
		},
		watch  : {
			show (newValue) {
				this.showModal = newValue;
				this.changeBackground = localStorage.getItem('corpId')
				this.$store.dispatch("getCorp", info => {
					this.corpInfo = info
					this.corpId = this.$store.state.corpId
					if (!this.changeBackground && this.corpInfo.length > 0) {
						this.changeBackground = this.$store.state.corpId;
						this.corpId = this.$store.state.corpId;
						this.corpName = this.$store.state.corpName;
					}
				});
				this.routeName = this.$route.name
			}
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
</style>
