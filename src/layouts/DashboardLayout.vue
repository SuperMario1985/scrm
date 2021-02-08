<template>
	<a-layout id="dashboard" style="min-height: 100vh;position:fixed;width:100%;min-width:1360px;">
		<top-navbar></top-navbar>

		<a-layout>
			<a-layout-sider
					width="200"
					style="background: #FFF"
					collapsible
					v-model="collapsed"
					@collapse="onLayoutCollapse"
					class="menu-sider"
			>
				<a-menu
						theme="light"
						mode="vertical"
						:subMenuOpenDelay="0"
						:selectedKeys="[$route.name]"
						:style="{borderRight: 0,top:0,bottom:'48px',left:0,right:0,position:'absolute',overflowY:'auto' }"
						@openChange="onOpenChange"
						@click="onItemClick"
				>
				<!-- :openKeys="openKeys" -->
					<template v-if="!collapsed && showMenuLabel">
						<a-menu-item class="tabMenu" @click="enterEnterpriseWechat" :class="type==1?'tabMenuBorder':''"
						             key="1" v-if="showWorkLabel">
							<span>企业微信</span>
						</a-menu-item>
						<a-menu-item class="tabMenu" @click="enterAccountMarketing" :class="type==0?'tabMenuBorder':''"
						             key="0" v-if="showWxLabel">
							<span>公众号</span>
						</a-menu-item>
					</template>

					<template v-for="menuInfo in menuData">
						<a-menu-item v-if="menuInfo.children.length == 0" :key="menuInfo.key">
							<router-link v-if="menuInfo.link.indexOf('http') == -1" :to="'/' + menuInfo.link">
								<a-icon :type="menuInfo.icon"></a-icon>
								<span>{{menuInfo.title}}</span>
							</router-link>

							<a v-else :href="menuInfo.link">
								<a-icon :type="menuInfo.icon"></a-icon>
								<span>{{menuInfo.title}}</span>
							</a>
						</a-menu-item>

						<a-sub-menu v-if="menuInfo.children.length > 0" :key="menuInfo.key">
                          <span slot="title">
                            <a-icon :type="menuInfo.icon"></a-icon>
                            <span>{{menuInfo.title}}</span>
                          </span>

							<a-menu-item v-for="child in menuInfo.children" :key="child.key">
								<router-link v-if="child.link.indexOf('http') == -1" :to="'/' + child.link">
									{{child.title}}
								</router-link>

								<a v-else :href="child.link">{{child.title}}</a>
							</a-menu-item>
						</a-sub-menu>
					</template>

					<!--					<template v-show="!prod">-->
					<!--						<a-menu-item @click="enterEnterpriseWechat" v-if="type == 0">-->
					<!--						<a-icon type="forward"/>-->
					<!--						<span>进入企业微信</span>-->
					<!--						</a-menu-item>-->
					<!--						<a-menu-item @click="enterAccountMarketing" v-if="type == 1">-->
					<!--							<a-icon type="forward"/>-->
					<!--							<span>进入公众号营销</span>-->
					<!--						</a-menu-item>-->
					<!--					</template>-->
				</a-menu>
			</a-layout-sider>
			<template v-if="hasPermission">
				<template v-if="type == 0">
					<authorizeBtn
							v-if="wxInfo.length == 0 && !$route.meta.keepAlive && showAccount == 0"></authorizeBtn>
					<dashboard-content
							v-if="wxInfo.length != 0 || $route.meta.keepAlive || showAccount == 1"></dashboard-content>
				</template>
				<template v-if="type == 1">
					<corpAuthorizeBtn v-if="corpArr.length == 0 && !$route.meta.corpAlive"></corpAuthorizeBtn>
					<agentAuthorizeBtn
							v-if="(corpArr.length != 0 && agentCount == 0 && !$route.meta.agentAlive)"></agentAuthorizeBtn>
					<dashboard-content
							v-if="(corpArr.length != 0 || $route.meta.corpAlive) && ((corpArr.length != 0 && agentCount != 0) || $route.meta.agentAlive)"></dashboard-content>
				</template>
			</template>
		</a-layout>
	</a-layout>
</template>

<script>
	import TopNavbar from "./TopNavbar";
	import DashboardContent from "./Content";
	import authorizeBtn from "@/components/AuthorizeBtn.vue"
	import corpAuthorizeBtn from "../components/CorpAuthorizeBtn";
	import agentAuthorizeBtn from "../components/AgenAuthoeizeBtn"

	export default {
		name      : "DashboardLayout",
		inject    : ['reload'],
		provide () {
			return {
				wxType: this.type
			}
		},
		data () {
			let type = localStorage.getItem('type') ? localStorage.getItem('type') : 1;
			return {
				prod               : this.$store.state.prod,
				collapsed          : false,
				menuCollapsed      : false,
				menuData           : [],
				menuList           : {},
				rootSubmenuKeys    : [],
				openKeys           : [""],
				wxInfo             : [],
				getWxInfoFinish    : false,
				corpArr            : [],
				agentCount         : '0', // 当前企业微信下的自建应用数量
				getCorpArrFinish   : false,
				type               : type,//获取菜单栏的类型，0 公众号  1 企业微信
				hasPermission      : false, //是否有权限
				showMenuLabel      : true, //是否显示菜单切换按钮
				showWxLabel        : false, //是否显示公众号菜单
				showWorkLabel      : false, //是否显示企业微信菜单
				wxFirstLink        : '',    // 微信首菜单
				workFirstLink      : '',    // 企业微信首菜单
				menus              : [], // 总菜单
				oldWx              : '',
				oldCorp            : '',
				showAccount        : localStorage.getItem('showAccount'),
				subPagePermission  : '',//子页面权限名
				faterPagePermission: '',//父页面权限名
				faterPageUrl       : '',//父页面链接地址
			};
		},
		components: {
			TopNavbar,
			DashboardContent,
			authorizeBtn,
			corpAuthorizeBtn,
			agentAuthorizeBtn
		},
		methods   : {
			initData (menuData) {
				let that = this
				let menuList = {};
				let subMenuList = [];
				menuData.map(function (menuInfo) {
					if (menuInfo.children.length > 0) {
						subMenuList.push(menuInfo.key);

						menuInfo.children.map(function (child) {
							let key = child.key;
							menuList[key] = menuInfo.key;
						});
					}
				});
				this.menuData = menuData;
				this.menuList = menuList;
				this.rootSubmenuKeys = subMenuList;
				this.openKeys = [menuList[this.$route.name] ? menuList[this.$route.name] : ""];
			},
			onLayoutCollapse (collapsed, type) {
				this.menuCollapsed = collapsed
				this.openKeys = collapsed
					? [""]
					: [
						this.menuList[this.$route.name]
							? this.menuList[this.$route.name]
							: ""
					];
			},
			onItemClick (e) {
				if (e.keyPath.length == 1) {
					this.openKeys = [e.key];
				} else {
					if (this.collapsed) {
						this.openKeys = [e.keyPath[1]]
					}
				}
				if (!this.menuCollapsed) {
					if (e.key == 'fansMsg') {
						this.collapsed = true
					} else {
						this.collapsed = false
					}
				}
			},
			onOpenChange (openKeys) {
				const latestOpenKey = openKeys.find(
					key => this.openKeys.indexOf(key) === -1
				);
				if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
					this.openKeys = openKeys;
				} else {
					this.openKeys = latestOpenKey ? [latestOpenKey] : [];
				}
			},
			routerRD (res) {
				let needRepush = true
				switch (this.type) {
					case "0":
						if (this.oldWx.length > 0) {
							let _this = this
							_this.wxInfo.map((wx, wIndex) => {
								if (wx.wx_id == _this.oldWx) {
									_this.oldWx = ''

									_this.$store.dispatch("changeWxNum", wx.wx_id);
									_this.$store.commit("changeAuthorizerType", wx.authorizer_type);
									_this.$store.commit("changeWxNickName", wx.nick_name);
									if (localStorage.getItem('isMasterAccount') == 2) {
										_this.$store.dispatch('getPermissionButton')
									}

									needRepush = false

									_this.$message.destroy()
									_this.$message.error('无权限')

								}
							})
						}

						break
					case "1":
						if (this.oldCorp.length > 0) {
							let _this = this
							_this.corpArr.map((corp, wIndex) => {
								if (corp.corpid == _this.oldCorp) {
									_this.oldCorp = ''

									_this.$store.dispatch("changeCorp", corp);
									if (localStorage.getItem('isMasterAccount') == 2) {
										_this.$store.dispatch('getPermissionButton')
									}

									needRepush = false

									_this.$message.destroy()
									_this.$message.error('无权限')
								}
							})
						}

						break;
				}

				if (needRepush) {
					let rLink = ''
					let that = this
					if (that.subPagePermission == '') {
						rLink = res.data.menuList[this.type][0].link.length > 0 ? res.data.menuList[this.type][0].link : res.data.menuList[this.type][0].children[0].link
					} else {
						if (that.$store.state.permissionButton.includes(that.subPagePermission)) {
							that.$store.state.subPagePermission.map(x => {
								if (!hasPermission && x.permission == that.subPagePermission) {
									rLink = x.pageUrl
								}
							})
						} else {
							if (that.faterPagePermission != '' && that.$store.state.permissionButton.includes(that.faterPagePermission)) {
								if (that.faterPageUrl != '') {
									rLink = that.faterPageUrl
								}
							} else {
								rLink = res.data.menuList[this.type][0].link.length > 0 ? res.data.menuList[this.type][0].link : res.data.menuList[this.type][0].children[0].link
							}
						}
					}

					that.$message.destroy()
					if (that.$route.path == '/home') {
						that.$router.push('/' + rLink)

						that.$nextTick(() => {
							that.reload()
						})
					} else {
						// that.$message.error('无权限', 1, () => {
						that.$router.push('/' + rLink)

						that.$nextTick(() => {
							that.reload()
						})
						// })
					}
				}
			},
			//获取所有菜单
			async getMenuList () {
				let wx_account_id = '', work_account_id = ''

				let wxArr = JSON.parse(localStorage.getItem("wxArr"))
				let corpArr = JSON.parse(localStorage.getItem("corpArr"))
				if (JSON.parse(localStorage.getItem("corpArr")).length > 0) {
					this.agentCount = JSON.parse(localStorage.getItem("corpArr")).find((corp) => corp.corpid == localStorage.getItem('corpId')).agent_count
				} else {
					this.agentCount = '0'
				}
				if (wxArr !== null && wxArr.length > 0) {
					wx_account_id = localStorage.getItem("wxNum")
				}

				if (corpArr !== null && corpArr.length > 0) {
					work_account_id = localStorage.getItem("corpId")
				}

				const {data: res} = await this.axios.post("menu/get-menu-list", {
					type           : this.type,
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem("sub_id"),
					wx_account_id  : wx_account_id,
					work_account_id: work_account_id
				});

				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$store.dispatch('changePackageDetail', {
						name                 : res.data.package_name,
						time                 : res.data.package_endtime,
						wholeMarketFissionNum: res.data.package.fission_num,
						raffleNum            : res.data.package.lottery_draw_num,
						redFissionNum        : res.data.package.red_envelopes_num
					})
					if (res.data.menuList[0].length == 0 && res.data.menuList[1].length == 0) {
						if (localStorage.getItem('accountNum') > 1) {
							this.$message.destroy()

							this.$message.error('无权限', 1, () => {
								localStorage.removeItem('uid')
								localStorage.removeItem('accountKey')
								localStorage.removeItem('corpArr')
								localStorage.removeItem('wxArr')
								localStorage.removeItem('authorizer_type')
								localStorage.removeItem('corpName')
								localStorage.removeItem('wxNumIndex')
								localStorage.removeItem('wxNickName')
								localStorage.removeItem('corpAuthType')
								localStorage.removeItem('corpIndex')
								localStorage.removeItem('wxNum')
								localStorage.removeItem('corpId')

								this.$router.push('/chooseAccount')
							})
						} else {
							this.$message.destroy()

							this.$message.error('无权限', 1, () => {
								this.global.sendPhoneNumber(false)

								this.global.clearLocalStorage()
								this.$store.commit('clear');
								this.$router.push("/login");
							})
						}
					} else {
						this.menus = res.data.menuList

						if (res.data.menuList[0].length == 0) {
							this.type = 1
							this.wxFirstLink = ''
						} else {
							if (res.data.menuList[0][0].link.length > 0) {
								this.wxFirstLink = res.data.menuList[0][0].link
							} else {
								for (let i = 0; i < res.data.menuList[0].length; i++) {
									if (res.data.menuList[0][i].children.length > 0) {
										this.wxFirstLink = res.data.menuList[0][i].children[0].link
										break
									}
								}
							}
						}

						if (res.data.menuList[1].length == 0) {
							this.type = 0
							this.workFirstLink = ''
						} else {
							if (res.data.menuList[1][0].link.length > 0) {
								this.workFirstLink = res.data.menuList[1][0].link
							} else {
								for (let i = 0; i < res.data.menuList[1].length; i++) {
									if (res.data.menuList[1][i].children.length > 0) {
										this.workFirstLink = res.data.menuList[1][i].children[0].link
										break
									}
								}
							}
						}

						let link = this.$route.path.substr(1)
						let wxAllPub = true
						let workAllPub = true

						if (wxArr.length > 1 || localStorage.getItem('showAccount') == 1) {
							wxAllPub = false
							this.showWxLabel = true
						}

						if (corpArr.length > 1) {
							workAllPub = false
							this.showWorkLabel = true
						}

						let hasPermission = false
						res.data.menuList.map((menuData, menuKey) => {
							menuData.map((menuInfo) => {
								if (menuInfo.comefrom != 2) {
									if (menuKey == 0) {
										wxAllPub = false
										this.showWxLabel = true
									} else if (menuKey == 1) {
										workAllPub = false
										this.showWorkLabel = true
									}
								}

								if (!hasPermission && menuInfo.link == link) {
									hasPermission = true
									if (menuInfo.comefrom != 2) {
										this.type = String(menuKey)
									}
								}

								if (!hasPermission && menuInfo.children.length > 0) {
									menuInfo.children.map((childrenInfo) => {
										if (!hasPermission && childrenInfo.link == link) {
											hasPermission = true
											if (menuInfo.comefrom != 2) {
												this.type = String(menuKey)
											}
										}
									})
								}
							})
						})

						this.showMenuLabel = !(wxAllPub && workAllPub)

						if (wxAllPub && this.type == '0') {
							this.type = '1'
						}

						if (workAllPub && this.type == '1') {
							this.type = '0'
						}

						let that = this
						if (that.$store.state.ignorePermission.includes(that.$route.path)) {
							if (localStorage.getItem('isMasterAccount') == 2) {
								that.$store.state.subPagePermission.map(x => {
									if (!hasPermission && x.pageUrl == link) {
										that.subPagePermission = x.permission
										that.faterPagePermission = x.faterPermission
										that.faterPageUrl = x.faterUrl
									}
								})
							} else {
								hasPermission = true
							}
						}

						that.$store.commit('setMenuData', res.data.menuList);
						that.$store.commit('changeType', that.type);

						if (localStorage.getItem('isMasterAccount') == 2) {
							Promise.all([that.$store.dispatch('getPermissionButton')]).then(resGetPBtn => {
								if (that.subPagePermission != '' && that.$store.state.permissionButton.includes(that.subPagePermission)) {
									hasPermission = true
								}
								if (!hasPermission) {
									that.routerRD(res);
								} else {
									that.hasPermission = true
								}
								if (hasPermission) {
									this.initData(res.data.menuList[this.type])
								}
							}).catch(e => {
							})
						} else {
							if (!hasPermission) {
								that.routerRD(res);
							} else {
								that.hasPermission = true
							}
							if (hasPermission) {
								that.initData(res.data.menuList[that.type])
							}
						}
					}
				}
			},
			//点击跳转企业微信
			enterEnterpriseWechat () {
				this.type = 1
				localStorage.setItem('type', this.type)
				this.initData(this.menus[this.type])

				if (this.$route.path.substr(1) != this.workFirstLink) {
					this.$router.push('/' + this.workFirstLink)
				}

				this.$nextTick(() => {
					this.reload()
				})
			},
			//点击跳转公众号营销
			enterAccountMarketing () {
				this.type = 0
				localStorage.setItem('type', this.type)
				this.initData(this.menus[this.type])

				if (this.$route.path.substr(1) != this.wxFirstLink) {
					this.$router.push('/' + this.wxFirstLink)
				}

				this.$nextTick(() => {
					this.reload()
				})
			},
			init () {
				if (!this.getWxInfoFinish && !this.getCorpArrFinish) {
					Promise.all([
						this.$store.dispatch('getWx', info => {
							this.wxInfo = info
							this.getWxInfoFinish = true
						}),
						this.$store.dispatch('getCorp', info => {
							this.corpArr = info
							this.getCorpArrFinish = true
						}),
					]).then(res => {
						this.$nextTick(() => {
							if (this.getWxInfoFinish && this.getCorpArrFinish) {
								this.getWxInfoFinish = false
								this.getCorpArrFinish = false
								this.getMenuList()
							}
						})
					}).catch(e => {
					})
				}
			}
		},
		watch     : {
			'$store.state.wxNum' (newValue, oldValue) {
				if (newValue != oldValue) {
					this.hasPermission = false
					this.oldWx = oldValue
					this.init()
				}
			},
			'$store.state.corpId' (newValue, oldValue) {
				if (newValue != oldValue) {
					this.oldCorp = oldValue
					this.hasPermission = false
					this.init()
				}
			},
		},
		mounted () {
			if (this.$route.name == 'fansMsg') {
				this.collapsed = true
			}
			this.init()
		},
	};
</script>

<style lang="less">
	@import "../common/css/dashboard.less";
</style>