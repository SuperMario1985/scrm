<template>
	<a-layout-header class="header">
		<img alt="Vue logo" src="../assets/logo.png" height="32" style="margin-bottom: 10px;padding-left: 30px;">
		<span @click="activeMenu(1)" :class="isActive === 1 ? 'active-home' : ''" style="margin-left:70px;padding: 3px;font-size: 14px;color: #333333;font-weight:700;cursor: pointer;">首页</span>
		<span v-if="showWorkLabel" @click="activeMenu(2)" :class="isActive === 2 ? 'active-home' : ''" style="margin-left:15px;padding: 3px;font-size: 14px;color: #333333;font-weight:700;cursor: pointer;">企业微信</span>
		<span v-if="showWxLabel" @click="activeMenu(3)" :class="isActive === 3 ? 'active-home' : ''" style="margin-left:15px;padding: 3px;font-size: 14px;color: #333333;font-weight:700;cursor: pointer;">公众号</span>
		<a-menu
				theme="light"
				mode="horizontal"
				:style="{ lineHeight: '64px', float: 'right' }"
		>
			<a-sub-menu v-show="wxType == 0 && $store.state.wxArr.length > 1" key="wx">
				<span slot="title" class="submenu-title-wrapper" style="min-width: 128px;padding: 5px;border-radius: 2px;border: 1px solid #EEEEEE;">
					{{$store.state.wxNickName}}
					<a-icon type="down" style="margin-left: 6px"/>
				</span>

				<template v-for="(wxInfo, index) in $store.state.wxArr">
					<a-menu-item
							v-show="index != $store.state.wxNumIndex"
							:key="'wx:' + index"
							@click="changeWx(wxInfo)">
						{{wxInfo.nick_name}}
					</a-menu-item>
				</template>
			</a-sub-menu>

			<a-sub-menu v-show="wxType == 1 && $store.state.corpArr.length > 1" key="corp">
				<span slot="title" class="submenu-title-wrapper" style="min-width: 128px;padding: 5px;border-radius: 2px;border: 1px solid #EEEEEE;">
					{{$store.state.corpName}}
					<a-icon type="down" style="margin-left: 6px"/>
				</span>

				<template v-for="(corpInfo, index) in $store.state.corpArr">
					<a-menu-item
							v-show="index != $store.state.corpIndex"
							:key="'corp:' + index"
							@click="changeCorp(corpInfo)">
						{{corpInfo.corp_name}}
					</a-menu-item>
				</template>
			</a-sub-menu>

			<a-sub-menu key="setting">
					<span slot="title" class="submenu-title-wrapper" style="min-width: 128px;padding: 5px;border-radius: 2px;border: 1px solid #EEEEEE;">
						<a-icon type="user"/>ID：{{showUid(uid)}}
						<a-icon type="down" style="margin-left: 6px"/>
					</span>
				<a-menu-item key="setting:1" @click="userUpdate">账号设置</a-menu-item>
				<a-menu-item key="setting:2" @click="changeAccount" v-show="accountNum > 1">切换账户</a-menu-item>
				<a-menu-divider/>
				<a-menu-item key="setting:5" @click="loginOut">退出</a-menu-item>
			</a-sub-menu>
		</a-menu>
		<div v-if="$store.state.packageDetail.name"
		     style="margin-left:15px;background: #F8F8F8;border-radius: 2px;padding: 5px 12px;height: 28px;line-height: 18px;display: inline-block;float: right;margin-top: 18px;">
			<img style="width: 12px;margin-right: 5px;margin-top: -3px;" src="../assets/base/vipLogo.png" alt="">
			<span style="font-size: 12px;">{{$store.state.packageDetail.name}}</span>
			<span style="font-size: 12px;">
				<span style="margin:0px 8px 0 9px;border-left: 1px solid;height: 10px;display: inline-block;"></span>
				 有效期：{{$store.state.packageDetail.time}}</span>
		</div>
		<a-modal
				title="切换账户"
				:visible="visible"
				@ok="handleOk"
				:confirmLoading="confirmLoading"
				@cancel="handleCancel"
				width="888"
		>
			<div style="height: 230px;" class="wxtpl">
				<template v-for="(item,index) in accountList" style="display: inline-block;">
					<a-radio-group @change="changeIt(item)" v-model="changeBackground">
						<a-radio-button :value="item.key">
							<div>
								<template v-if="item.company_logo == '' || item.company_logo== null">
									<a-avatar
											:src="img"
											shape="square"/>
								</template>
								<template v-if="item.company_logo != '' && item.company_logo != null">
									<a-avatar :src="commonUrl + item.company_logo" shape="square"/>
								</template>

								<template v-if="item.company_name == '' || item.company_name == null">
									<span class="text">{{item.account}}</span>
								</template>
								<template v-if="item.company_name != '' && item.company_name != null">
									<span class="text">{{item.company_name}}</span>
								</template>
								<div class="tab" v-if="item.type == 1">主账户</div>
								<div class="tab" v-if="item.type == 2">子账户</div>
							</div>
						</a-radio-button>
					</a-radio-group>
				</template>
			</div>
		</a-modal>
	</a-layout-header>
</template>

<script>
	import img from "../assets/default.png"

	export default {
		name   : "TopNavbar",
		inject : ['reload', 'wxType'],
		data () {
			let changeBackground =
				localStorage.getItem('phoneNumber') ? localStorage.getItem('phoneNumber') : "";
			return {
				img,
				uid             : localStorage.getItem("uid"),
				accountNum      : localStorage.getItem("accountNum"),//账户数量
				confirmLoading  : false,//切换账户弹窗的Loading
				visible         : false,//切换账户弹窗的显示与隐藏
				accountList     : [],//子账户列表
				id              : '',//选择的账户id
				type            : localStorage.getItem('isMasterAccount'),//选择的账户类型，1主账户，2子账户
				changeBackground: '',//被选中的账户的key
				phone           : changeBackground,//手机号
				password        : localStorage.getItem('password'),//密码
				commonUrl       : this.$store.state.commonUrl,//公共的链接
				isActive        :0,//1 首页 2，企业微信 3.公众号
				showWxLabel     : false, //是否显示公众号菜单
				showWorkLabel   : false, //是否显示企业微信菜单
			}
		},
		methods: {
			showUid (uid) {
				return 16800000 + parseInt(uid)
			},
			userUpdate () {
				this.$router.push('/user/userUpdate')
			},
			//切换账户
			changeAccount () {
				this.getList()
				this.visible = true
				this.id = localStorage.getItem('sub_id')
				this.type = localStorage.getItem('isMasterAccount')
			},
			handleCancel () {
				this.visible = false
			},
			handleOk () {
				this.confirmLoading = true
				this.enter()
			},
			changeWx (wx) {
				if (localStorage.getItem('notAllow') && localStorage.getItem('notAllow') == 1) {
					if (localStorage.getItem('backUrl') && localStorage.getItem('backUrl') != '') {
						this.$router.push(localStorage.getItem('backUrl'))
					}
				}
				this.$store.dispatch("changeWxNum", wx.wx_id);
				this.$store.commit("changeAuthorizerType", wx.authorizer_type);
				this.$store.commit("changeWxNickName", wx.nick_name);
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
				this.reload()
			},
			changeCorp (corp) {
				if (localStorage.getItem('notAllow') && localStorage.getItem('notAllow') == 1) {
					if (localStorage.getItem('backUrl') && localStorage.getItem('backUrl') != '') {
						this.$router.push(localStorage.getItem('backUrl'))
					}
				}
				this.$store.dispatch("changeCorp", corp);
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
				this.reload()
			},
			async enter () {
				const {data: res} = await this.axios.post(
					"login/get-last-user",
					{
						id       : this.id,
						type     : this.type,
						autoLogin: localStorage.getItem('autoLogin') == "true"
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.confirmLoading = false
					this.$message.error(res.error_msg);
				} else {
					// 更新websocket中的登录信息
					this.ws.websocketSend(JSON.stringify({
						'channel': 'bind',
						'info'   : {
							'uid'  : res.data.uid,
							'subId': this.type == 2 ? this.id : ''
						}
					}))

					this.$message.success('切换账户成功')
					localStorage.setItem('uid', res.data.uid)
					localStorage.setItem('token', res.data.access_token)
					localStorage.setItem('accountKey', this.changeBackground)
					localStorage.setItem('masterAccountPhone', res.data.masterAccount)
					localStorage.setItem('isMasterAccount', this.type)
					localStorage.setItem('twoHourCode', false)

					//登录成功给官网localstorage发送phoneNumber
					this.global.sendPhoneNumber()

					this.confirmLoading = false
					this.visible = false
					this.$store.commit('changeProd', res.data.prod);

					localStorage.removeItem('wxNum')
					localStorage.removeItem('authorizer_type')
					localStorage.removeItem('wxNickName')
					localStorage.removeItem('corpId')
					localStorage.removeItem('corpAuthType')
					localStorage.removeItem('corpName')
					localStorage.removeItem('wxArr')
					localStorage.removeItem('corpArr')

					if (this.type == 1) {
						this.$store.commit("changePermissionButton", "all");
					}

					localStorage.setItem('sub_id', this.id)
					localStorage.setItem('isMasterAccount', this.type)

					this.reload(true)
				}
			},
			//获取子账户
			async getList () {
				const {data: res} = await this.axios.post(
					"login/get-account",
					{
						phone   : this.phone,
						password: this.password,
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.accountList = res.data.user_info
					this.changeBackground = Number(localStorage.getItem('accountKey'))
					this.id = localStorage.getItem('sub_id')
				}
			},
			changeIt (item) {
				this.id = item.id
				this.type = item.type
			},
			//退出
			loginOut () {
				//登录成功给官网localstorage发送登录状态false
				this.global.sendPhoneNumber(false)

				this.global.clearLocalStorage()
				this.$store.commit('clear');
				this.$router.push("/login");
			},
			// 点击菜单切换
			activeMenu (type) {
				this.isActive = type
				this.$store.dispatch('changeMenu',type)
				if (type === 1) {
					// 跳转到首页
				}
			}
		},
		watch  : {
			uid: {
				handler (newVal) {
					console.log(newVal, 555)
				},
				deep: true
			},
			'$store.state.isShowWX' (newValue, oldValue) {
				this.showWorkLabel = newValue
				console.log('wx',newValue);
			},
			'$store.state.isShowCgh' (newValue, oldValue) {
				this.showWxLabel = newValue
				console.log('cro',newValue);
			},
		},
		mounted () {
			let that = this
			document.addEventListener('visibilitychange', function () {
				if (!document.hidden) {
					if (that.uid != localStorage.getItem("uid")) {
						// that.uid = localStorage.getItem("uid")
						window.location.reload()
					}
				}
			})
			this.isActive = this.$store.state.activeMenu;
			this.showWxLabel  = this.$store.state.isShowCgh;
			this.showWorkLabel  = this.$store.state.isShowWX; 
				 
		},
	}

</script>

<style scoped>
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
	.header {
		background: #fff !important;
		padding: 0 30px 0 0 ;
	}
	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 47px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	.tab {
		position: absolute;
		background: #E9E9E9;
		width: 60px;
		text-align: center;
		border-radius: 4px;
		line-height: 30px;
		right: 0;
		top: -15px;
	}
	.active-home {
		border-bottom: 2px solid;
    color: #01B065 !important;
	}
</style>