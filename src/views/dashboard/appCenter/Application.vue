<template>
	<div class="app-center">
		<a-spin tip="Loading..." size="large" :spinning="isLoading">
			<div class="app-list">
				<div class="app" :style="{width : width}" v-for="item in ourAppList">
					<div class="app-cover" :style="{'height': height}">
						<img :src="item.backImg" style="position: absolute; z-index: 1; top: 0;" :style="{'width': width, 'heitht': height}"/>
						<div class="icon-title">
							<img :src="item.icon" class="icon"/>
							<span class="title">{{item.title}}</span>
						</div>
						<div class="divider"></div>
						<div class="desc">{{item.title1}}</div>
					</div>
					<div class="app-detail">
						<div class="detail-title">
							{{item.title2}}
						</div>
						<div class="detail-desc">{{item.title3}}</div>
						<div style="margin-top: 12px;text-align: right;">
							<a-button @click="goStore(item.type)" v-if="item.isHas == 1">
								店铺管理
							</a-button>
							<a-button style="margin-left: 5px;"
							          v-if="item.type == 1 && item.isHas == 1"
							          @click="goMembers(item.type)">
								查看会员
							</a-button>
							<a-button style="margin-left: 5px;"
							          type="primary"
							          @click="goOrder(item.type)" v-if="item.isHas == 1">
								订单管理
							</a-button>
							<a-button style="margin-left: 5px;" type="primary"
							          v-if="item.isHas == 0"
							          @click="addStore(item.type)">创建店铺
							</a-button>
						</div>

					</div>
				</div>
				<div class="app" :style="{width : width}" v-for="item in appList">
					<div class="app-cover" :style="{'height': height}">
						<img :src="commonUrl + item.img_square" style="position: absolute; z-index: 1; top: 0;" :style="{'width': width, 'heitht': height}"/>
						<div class="icon-title">
							<img :src="commonUrl + item.img_circle" class="icon"/>
							<span class="title">{{item.name}}</span>
						</div>
						<div class="divider"></div>
						<div class="desc">{{item.des1}}</div>
					</div>
					<div class="app-detail">
						<div class="detail-title">
							{{item.name}}
							<a-tag color="red" style="font-size: 12px;">付费功能</a-tag>
						</div>
						<div class="detail-desc">{{item.des2}}</div>
						<div style="margin-top: 12px;text-align: right;">
							<a-button type="primary"
							          @click="goUrl(url, item.type, item.name)">进入管理
							</a-button>
						</div>
					</div>
				</div>
			</div>
		</a-spin>
		<a-modal v-model="showStoreVisible" width="720px" :title="title" @cancel="cancelAddStore">
			<template slot="footer">
				<a-button key="back" @click="cancelAddStore">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading"
						@click="handleAddStore"
				>提交
				</a-button>
			</template>
			<a-form>
				<a-form-item label="店铺类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<a-select
							showSearch
							:allowClear="false"
							optionFilterProp="children"
							placeholder="请选择类型"
							:disabled="true"
							style="width: 300px;margin-bottom: 10px;"
							v-model="storeType"
					>
						<a-select-option :value="1">小猪智慧店铺</a-select-option>
						<a-select-option :value="2">有赞</a-select-option>
						<a-select-option :value="3">淘宝</a-select-option>
						<a-select-option :value="4">天猫</a-select-option>
					</a-select>
				</a-form-item>
				<div style="color: #FF562D;margin-bottom: 10px;margin-left: 16.66%;" v-if="storeType == 1">
					绑定后，可获取到该店铺的交易订单和会员信息。方便员工在与客户聊天时，可通过企业微信侧边栏中快速查看到该客户的历史订单记录与会员情况。
				</div>

				<a-form-item v-if="storeType == 1" label="店铺标识" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<a-input
							allowClear
							placeholder="请输入店铺标识"
							style="width: 300px;margin-right:15px;"
							v-model="token"
					/>
				</a-form-item>
				<div class="content-msg" v-if="storeType == 1">
					<p style="margin-bottom: 2px; line-height: 25px;">
						1，请登录<a :href="$store.state.cashierUrl + '/cashier/merchants.php?m=Index&c=login&a=index'"
						        target="_blank">智慧店铺系统</a>--商家配置--商家资料--复制标识
					</p>
					<p style="margin-bottom: 0px; line-height: 25px;">
						2，将已复制的标识粘贴在应用集成-智慧店铺卡券里，提交即可。（由于系统无法判断您填写的标识是否是正确，故一旦没有按照文档要求填写，则客户无法打开。）
					</p>
				</div>
				<a-form-item v-if="storeType == 1" label="开启行业集成" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<a-switch :checked="comeFrom == 1 ? true:false"
					          @click="changeStatus()"/>
					（一旦开启后，在“行业集成”菜单里获取到通用页面，并同步到【内容引擎】）
				</a-form-item>
				<div class="content-msg" v-if="storeType == 2">
					<p style="margin-bottom: 2px;line-height: 25px;">
						1、打通有赞，需先在有赞服务市场购买【云美来CRM】应用，<a href="https://yingyong.youzan.com/cloud-app-detail/51319"
						                               target="_blank">前往订购地址</a>
					</p>
					<p style="margin-bottom: 2px;line-height: 25px;">
						2、购买成功后，需要您登录有赞店铺后台--【应用--应用市场】--【我的应用】--【去使用】--跳转到云美来SCRM登陆页面--成功登陆后，即绑定成功--进入【第三方店铺--店铺订单】，即可开始拉取订单数据。
					</p>
					<p style="margin-bottom: 2px;line-height: 25px;">
						3、首次授权成功后将默认拉取仅90天的订单数据；另外每天产生的有赞订单实时推送到本系统。
					</p>
					<p style="color: #FF562D;margin-bottom: 0px;line-height: 25px;">
						目前接入有赞店铺，支持微商城和零售。
					</p>
				</div>
				<div v-if="storeType == 2">
					<img src="../../../assets/storeStep/1.png" style="width: 235px;"/>
					<img src="../../../assets/storeStep/2.png" style="width: 185px;margin: 0 20px;"/>
					<img src="../../../assets/storeStep/3.png" style="width: 200px;"/>
				</div>
				<a-form-item v-if="storeType == 3 || storeType == 4" label="店铺名称" :label-col="{ span: 4 }"
				             :wrapper-col="{ span: 20 }">
					<a-input
							allowClear
							placeholder="请输入店铺名称"
							style="width: 300px;margin-right:15px;"
							v-model="userName"
					/>
				</a-form-item>
				<div v-if="storeType == 3 || storeType == 4" style="margin-left: 16.7%;color: #FF562D;">
					创建好店铺后，进入【店铺订单】导入<span v-if="storeType == 3">淘宝</span><span v-if="storeType == 4">天猫</span>订单，仅支持csv格式，文件大小20M以内。
				</div>
				<!--				<a-form-item v-if="storeType == 2" label="应用ID" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
				<!--					<a-input-->
				<!--							allowClear-->
				<!--							placeholder="请输入应用ID"-->
				<!--							style="width: 300px;margin-right:15px;margin-bottom: 10px;"-->
				<!--							v-model="clientId"-->
				<!--					/>-->
				<!--				</a-form-item>-->
				<!--				<a-form-item v-if="storeType == 2" label="应用secret" :label-col="{ span: 4 }"-->
				<!--				             :wrapper-col="{ span: 20 }">-->
				<!--					<a-input-->
				<!--							allowClear-->
				<!--							placeholder="请输入应用secret"-->
				<!--							style="width: 300px;margin-right:15px;margin-bottom: 10px;"-->
				<!--							v-model="clientSecret"-->
				<!--					/>-->
				<!--				</a-form-item>-->
				<!--				<a-form-item v-if="storeType == 2" label="应用code" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
				<!--					<a-input-->
				<!--							allowClear-->
				<!--							placeholder="请输入应用code"-->
				<!--							style="width: 300px;margin-right:15px;margin-bottom: 10px;"-->
				<!--							v-model="code"-->
				<!--					/>-->
				<!--				</a-form-item>-->
			</a-form>
		</a-modal>
	</div>
</template>

<script>
	export default {
		components: {},
		data () {
			return {
				isLoading       : false,
				commonUrl       : this.$store.state.commonUrl,
				appList         : [],
				url             : '',
				tokenUrl        : '',
				phone           : '',
				logo            : '',
				width           : '354px',
				height          : '188px',
				ourAppList      : [
					{
						backImg: require('../../../assets/appCenter/yzBack.png'),
						icon   : require('../../../assets/appCenter/yz.png'),
						title  : '有赞订单',
						title1 : '管理有赞订单',
						title2 : '有赞订单',
						title3 : '自动同步客户购买过的有赞订单至本系统',
						type   : 2,
						isHas  : 0
					},
					{
						backImg: require('../../../assets/appCenter/tbBack.png'),
						icon   : require('../../../assets/appCenter/tb.png'),
						title  : '淘宝订单',
						title1 : '管理淘宝订单',
						title2 : '淘宝订单',
						title3 : '一键导入淘宝订单，便捷了解客户订单信息',
						type   : 3,
						isHas  : 0
					},
					{
						backImg: require('../../../assets/appCenter/tcatBack.png'),
						icon   : require('../../../assets/appCenter/tcat.png'),
						title  : '天猫',
						title1 : '管理天猫订单',
						title2 : '天猫',
						title3 : '一键导入天猫订单，便捷了解客户订单信息',
						type   : 4,
						isHas  : 0
					},
					{
						backImg: require('../../../assets/appCenter/pigBack.png'),
						icon   : require('../../../assets/appCenter/pigIcon.png'),
						title  : '小猪智慧店铺',
						title1 : '管理智慧店铺订单',
						title2 : '小猪智慧店铺',
						title3 : '自动同步客户购买过的智慧店铺订单至本系统',
						type   : 1,
						isHas  : 0
					}
				],
				title           : '创建店铺',
				showStoreVisible: false,
				loading         : false,
				storeType       : '1', // 店铺类型
				token           : '', // 店铺标识
				comeFrom        : 1, // 行业集成是否开启
				clientId        : '', // 有赞id
				clientSecret    : '', // 有赞secret
				code            : '', // 有赞code
				userName        : '',
			};
		},
		methods   : {
			async getAppList () {
				this.isLoading = true
				const {data: res} = await this.axios.post(
					"attachment/qingxiaoyun-list",
					{
						corp_id: localStorage.getItem('corpId'),
						uid    : localStorage.getItem('uid')
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.appList = res.data.qingxiaoyun
					this.url = res.data.url
					this.tokenUrl = res.data.tokenUrl
					this.phone = res.data.phone
					this.logo = res.data.logo
					let that = this
					this.ourAppList[0].isHas = res.data.hasYouzan
					this.ourAppList[1].isHas = res.data.hasTb
					this.ourAppList[2].isHas = res.data.hasTm
					this.ourAppList[3].isHas = res.data.hasPig
					that.isLoading = false;
					this.$nextTick(() => {
						that.setWidth()
					})
				}
			},
			// 设置卡片尺寸 最小宽 315 图片尺寸354*188
			setWidth() {
				let screenWidth = document.getElementsByClassName('app-list')[0].clientWidth;
				let intw = parseInt(screenWidth / 330)
				if((intw * 330 + 11 * intw * 2) > screenWidth) {
					intw = intw - 1
				}
				let w = (screenWidth - intw * 2 * 11) / intw
				this.width = w + 'px'
				this.height = w / 354 * 188 + 'px'
			},
			goUrl (url, type, name) {
				let that = this
				this.isLoading = true
				this.logo = encodeURIComponent(require('../../../assets/logo.png'))
				let httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
				httpRequest.open('POST', this.tokenUrl, true);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
				httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
				httpRequest.send("phone=" + this.phone + '&type=' + type + '&name=' + name + '&logo=' + this.logo);//第三步：发送请求  将请求参数写在URL中
				/**
				 * 获取数据后的处理程序
				 */
				httpRequest.onreadystatechange = function () {
					if (httpRequest.readyState == 4 && httpRequest.status == 200) {
						let res = JSON.parse(httpRequest.responseText);// 获取到json字符串，还需解析
						if (res.code == 200) {
							window.open(url + '?token=' + res.message)
						} else {
							that.$message.destroy()
							that.$message.error(res.error || '请求错误')
						}
						httpRequest = null
						that.isLoading = false
					}
				};
				httpRequest.onerror = e => {
					that.$message.destroy()
					that.$message.error('请求错误')
					httpRequest = null
					that.isLoading = false
				}
			},
			goStore (type) {
				this.$router.push('/thirdPartyStore/store?type=' + type)
			},
			goOrder (type) {
				this.$router.push('/thirdPartyStore/order?type=' + type)
			},
			goMembers () {
				this.$router.push('/thirdPartyStore/members')
			},
			// 添加弹窗按钮
			addStore (type) {
				this.title = '创建店铺'
				this.token = ""
				this.storeType = type
				this.comeFrom = 1
				this.userName = ''
				this.showStoreVisible = true
			},
			// 确认添加店铺
			async handleAddStore () {
				this.loading = true
				if (this.storeType == 1) {
					if (this.token == "") {
						this.$message.warning('请填写店铺标识！')
						this.loading = false
						return false
					}
				} else if (this.storeType == 2) {
					this.loading = false
					this.showStoreVisible = false
					return false
				} else if (this.storeType == 3 || this.storeType == 4) {
					if (this.userName == "") {
						this.$message.warning('请填写店铺名称！')
						this.loading = false
						return false
					}
				}
				const {data: res} = await this.axios.post(
					"attachment/application-sign-add",
					{
						uid          : localStorage.getItem("uid"),
						sign         : this.token,
						site_type    : 1,
						comeFrom     : this.comeFrom,
						source       : this.storeType,
						client_id    : this.clientId,
						client_secret: this.clientSecret,
						code         : this.code,
						user_name    : this.userName
					}
				);
				if (res.error != 0) {
					this.loading = false;
					this.$message.error(res.error_msg);
				} else {
					this.$message.success("添加成功！")
					this.loading = false
					this.showStoreVisible = false
				}
			},
			// 取消添加店铺
			cancelAddStore () {
				this.showStoreVisible = false
			},
		},
		// computed: {
		// 	getMargin() {
		// 		return '17px;'
		// 	}
		// },
		mounted () {
			let that = this
			this.getAppList()
			window.addEventListener(
				"resize",that.setWidth,false
			);
			// window.onresize = that.setWidth()
		},
		beforeDestroy () {
			let that = this
			window.removeEventListener("resize",that.setWidth);
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.app-list {
		display: inline-block;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		margin: 0 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-upload.ant-upload-select {
		margin-right: 10px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card {
		width: 60px;
		height: 60px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0;
	}

	/deep/ .ant-form {
		padding: 0 20px;
	}

	/deep/ .ant-tabs-bar {
		padding: 0 20px !important;
		background: none !important;
		margin: 0 !important;
	}

	/deep/ .ant-form-item {
		padding: 0px 20px;
	}

	/deep/ .ant-form-item:first-child {
		padding-top: 10px;
	}

	/deep/ .ant-form-item:last-child {
		padding-top: 10px;
	}

	/deep/ .ant-tabs-nav .ant-tabs-tab {
		margin: 0 !important;
	}

	.img-box {
		width: 60px;
		height: 60px;
		cursor: pointer;
	}

	.img-size {
		width: 100%;
		height: 100%;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
		text-align: left;
		margin-bottom: 20px;
	}

	/deep/ .ant-table-fixed-header .ant-table-scroll .ant-table-header {
		margin-right: -5px;
	}

	/deep/ .ant-tooltip-content {
		width: 350px;
	}
</style>

<style lang="less" scoped>
	.app-center {
		margin-top: 10px;
	}

	.app {
		float: left;
		width: 354px;
		display: inline-block;
		margin: 17px 11px 10px 11px;
		position: relative;
		box-shadow: 0px 0px 22px 0px rgba(216, 216, 216, 1);
		border-radius: 4px;
	}

	.app-cover {
		width: 100%;
	}

	.app-cover .back-img {
		width: 100%;
	}

	.app-cover .icon-title {
		top: 38px;
		position: relative;
		z-index: 2;
		margin-left: 34px;
		height: 44px;
		line-height: 44px;
	}

	.app-cover .icon {
		width: 44px;
		height: 44px;
	}

	.app-cover .title {
		color: #FFFFFF;
		margin-left: 10px;
		font-size: 16px;
	}

	.app-cover .divider {
		position: relative;
		z-index: 2;
		top: 56px;
		margin-left: 34px;
		color: #FFFFFF;
		width: 31px;
		height: 4px;
		background: #FFFFFF;
		opacity: 0.4;
	}

	.app-cover .desc {
		position: relative;
		z-index: 2;
		top: 75px;
		margin-left: 34px;
		font-size: 14px;
		color: #FFFFFF;
	}

	.app-detail {
		width: 100%;
		padding: 15px 25px 15px 25px;
	}

	.app-detail .detail-title {
		font-size: 15px;
		font-weight: 400;
		color: #000000;
	}

	.app-detail .detail-desc {
		font-size: 14px;
		font-weight: 400;
		color: #8D8D8D;
		margin-top: 10px;
	}
</style>