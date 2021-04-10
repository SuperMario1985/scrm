import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {message} from "ant-design-vue"
import {defaulImg} from "@/assets/img.png";

Vue.use(Vuex)
const news = {
	id                : 0,
	addSketchVisible  : true,//控制添加图文按钮显示与隐藏
	addType           : 1,//添加方式
	inputTitle        : '',//标题
	digest            : '',//图文描述
	content_source_url: '',//跳转链接
	material_id       : '',//图文消息导入的素材id
	local_path        : {
		img  : defaulImg,
		audio: ""
	},
	showTextContent   : false,
	isAdvance         : false,
	closeShowModal3   : false,//每个图文消息是否选好素材
	materialSync      : 0,//素材是否同步，0不同步，1同步
	selectGroupId     : '',// 上传选择的分组id
}
const templateObj = {
	typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
	typeName           : {
		1: '文字',
		2: '图片',
		3: '音频',
		4: '视频',
		5: '图文',
		6: '小程序'
	},
	id                 : 0,
	closeShowModal3    : false,//是否选好素材
	disabled           : false,//消息类型图文能否被选
	file_name          : "", //手机上展示的素材标题
	material_id        : "", //选中的素材id
	local_path         : {
		img  : "",
		audio: ""
	}, //手机上展示的图片、音频、视频链接
	addType            : 1,
	sketchList         : [JSON.parse(JSON.stringify(news))],//图文消息添加的数组
	appletUrl          : '',// 小程序的封面链接
	appletInputTitle   : '',// 小程序的标题
	appid              : '',// 小程序的appid
	pageUrl            : '',// 小程序page路径
	materialSync       : 0, // 小程序是否同步，0不同步，1同步
	selectGroupId      : '',// 上传选择的分组id
	textAreaValueHeader: "", //模板展示的内容
	textContent        : '',//编辑框传给后台的内容
}

export default new Vuex.Store({
	state    : {
		isSpecialMenuSet:3,//是否在个性化菜单设置界面 1在第一步 2在第二步，其余数字表示不在个性设置界面
		specialTotalMenuList:[],//公众号下的个性化菜单
		specialTotalMenuActive:0,//当前个性化菜单index
		specialmenulist: [],//当前个性化菜单下的菜单列表
		specialcurrentMenu: null,//性化菜单下的菜单列表下的当前选中的单个菜单
		specialactiveMenu: 0,//性化菜单下的菜单列表下的当前选中的单个菜单的index

		menulist: [],//公众号菜单
		currentMenu: null,//当前被选中的公众号菜单
		activeMenu: 0,//当前选中的菜单index
		packageDetail           : {
			name                 : '',
			time                 : '',
			wholeMarketFissionNum: 0,
			raffleNum            : 0,
			redFissionNum        : 0
		},
		pid                     : 1, // 服务商ID
		tid                     : 1, // 推广包ID
		sid                     : 1, // 应用ID
		prod                    : true, // 是否为正式环境
		account                 : '', //已注册手机号
		password                : '',//登录密码
		wxArr                   : [],//公众号列表
		wxNum                   : '',//默认选中的公众号
		wxNumIndex              : 0,  //选中公众号在wxArr中的key
		corpArr                 : [],//企业微信列表
		noBindCorpArr           : [], // 未绑定企业微信列表
		corpId                  : '', //选中的企业微信号
		corpIndex               : 0, //选中企业微信号下标
		corpAuthType            : '',//选中企业微信号授权状态 cancel_auth：取消授权、change_auth：更新授权、create_auth：授权成功通知
		corpName                : '',//选中企业微信号名称
		getAuthorizeInfoUrl     : 'wx-authorize-info/get-authrize-info',
		ignorePath              : [
			'/login',
			'/passLogin',
			'/scancode',
			'/binding',
			'/forgetPass',
			'/freeRegister',
			'/register',
			'/regist',
			'/preview',
			'/chooseAccount',
			'/verifyPassword',
			'/workBinding'
		],
		commonUrl               : 'https://hd-scrm.wemero.cn',//公共的链接
		siteUrl                 : 'https://scrm.wemero.cn',//站点Web地址
		h5Url                   : 'http://m-scrm.wemero.cn',//站点H5地址
		cashierUrl              : 'http://k.pigcms.com.cn',//智慧店铺地址
		qxyUrl                  : 'https://www.qingxiaoyun.com',//轻小云地址
		redirectDomain          : 'm-scrm.wemero.cn',// 可信域名
		systemIp                : '8.140.108.50,8.140.103.205,8.140.110.193',// 系统ip
		proCorpId               : 'wwef54c3b926fdf123', // 企业微信服务商ID
		authorizer_type         : '',//选中的公众号授权状态,authorized：已授权、updateauthorized：更新授权、unauthorized：取消授权
		wxNickName              : '',//选中的微信公众号名字
		type                    : 0, // 选中的是公众号还是企业微信0：公众号；1：企业微信
		permissionButton        : [],//子账户显示的权限按钮
		txMapKey                : 'S6PBZ-D7BRQ-BNB5S-G2LBZ-PYAIO-DJF4K',
		ignorePermission        : [
			"/user/userUpdate",
			"/scene/statistics",
			"/reply/add",
			"/keyword/add",
			"/push/add",
			"/scene/add",
			"/customer/add",
			"/template/add",
			"/senior/add",
			"/smsSend/order",
			"/smsSend/detail",
			"/smsSend/add",
			"/smsTemplate/add",
			"/channelCode/add",
			"/channelCode/statistics",
			"/welcome/add",
			"/massMessage/add",
			"/filingCabinet/add",
			"/filingCabinet/info",
			"/filingCabinet/statistics",
			"/fans/detail",
			"/fission/add",
			"/fission/participants",
			"/fission/helpRecord",
			"/raffle/add",
			"/raffle/participants",
			"/raffle/drawDetail",
			"/raffle/helpDetail",
			"/customManage/detail",
			'/customRecord/detail',
			'/customManage/thirdStore',
			"/redPacket/detailRecords",
			'/redPacket/userDetailRecords',
			"/redFission/add",
			"/redFission/participants",
			"/redFission/helpRecord",
			'/group/statistics',
			'/group/welcomeAdd',
			'/group/add',
			'/group/tagsCreateAdd',
			'/group/clockInAdd',
			'/group/joinList',
			'/follow/add',
			'/channelCode/baiduAdd',
			'/archive/userNoticeAdd',
			'/archive/groupNoticeAdd',
			"/customManage/noCustomDetail",
			'/redForNew/ruleAdd',
			'/redForNew/add',
			'/redForNew/statistics',
			'/redForNew/participants',
			'/wholeMarket/fissionAdd',
			'/wholeMarket/fissionParticipants',
			'/wholeMarket/statistic',
			"/customManage/noCustomDetail",
			"/customManage/noCustomDetail",
			"/circle/addFriends",
			'/wholeMarket/fissionAdd1',
			'/wholeMarket/fissionParticipants1',
			'/wholeMarket/statistic1',
			"/customManage/noCustomDetail",
			"/highSeasCustomer/detail",
			"/thirdPartyStore/store",
			"/thirdPartyStore/order",
			"/thirdPartyStore/members",
			"/sop/addRules",
			"/chatSop/addRules",
			"/shopCustom/CustomManage",
			"/shopCustom/CustomSet",
			"/shopCustom/CustomOrder",
			"/shopCustom/CustomStatis",
			"/shopCustom/guideManage",
			"/shopCustom/guideSet",
			"/shopCustom/guideAchieve",
			"/shopCustom/shopMaterial",
			"/shopCustom/shareDetail",
			"/call/callSeatManagement",
			"/call/callStatic",
			"/call/callRecord",
			"/call/callStaff",
			"/call/accountBalance",
			"/smartRecommended/ruleAdd",
		],
		menuData                : [],// 菜单数据
		raffleParticipantsTabKey: '1',//抽奖引流参与者页面的tabKey
		miniArr                 : [],//小程序列表
		showAccount             : 1,//是否显示左侧公众号菜单，0不显示，1显示
		userToken               : '',//有赞云跳转携带参数
		siteName                : '云美来SCRM',//有赞云跳转携带参数
		shortName               : '云美来',//有赞云跳转携带参数
		subPagePermission       : [
			{
				pageUrl        : 'fans/detail',
				permission     : 'fans-info',
				faterUrl       : 'fans/list',
				faterPermission: 'fans-look'
			},
			{
				pageUrl        : 'reply/add',
				permission     : 'reply-add',
				faterUrl       : 'reply/list',
				faterPermission: 'reply-list'
			},
			{
				pageUrl        : 'push/add',
				permission     : 'message-add',
				faterUrl       : 'push/list',
				faterPermission: 'message-list'
			},
			{
				pageUrl        : 'scene/statistics',
				permission     : 'code-statistic',
				faterUrl       : 'scene/list',
				faterPermission: 'code-list'
			},
			{
				pageUrl        : 'scene/add',
				permission     : 'code-add',
				faterUrl       : 'scene/list',
				faterPermission: 'code-list'
			},
			{
				pageUrl        : 'customer/add',
				permission     : 'customer-add',
				faterUrl       : 'customer/list',
				faterPermission: 'customer-list'
			},
			{
				pageUrl        : 'template/add',
				permission     : 'template-add',
				faterUrl       : 'template/list',
				faterPermission: 'template-list'
			},
			{
				pageUrl        : 'senior/add',
				permission     : 'senior-send-add',
				faterUrl       : 'senior/list',
				faterPermission: 'senior-send-list'
			},
			{
				pageUrl        : 'filingCabinet/info',
				permission     : 'content-statistic',
				faterUrl       : 'filingCabinet/list',
				faterPermission: 'material-list'
			},
			{
				pageUrl        : 'filingCabinet/add',
				permission     : 'material-add',
				faterUrl       : 'filingCabinet/list',
				faterPermission: 'material-list'
			},
			{
				pageUrl        : 'smsSend/order',
				permission     : 'sending-recharge',
				faterUrl       : 'smsSend/list',
				faterPermission: 'sending-list'
			},
			{
				pageUrl        : 'smsSend/detail',
				permission     : 'sending-all-look',
				faterUrl       : 'smsSend/list',
				faterPermission: 'sending-list'
			},
			{
				pageUrl        : 'smsSend/add',
				permission     : 'sending-add',
				faterUrl       : 'smsSend/list',
				faterPermission: 'sending-list'
			},
			{
				pageUrl        : 'smsTemplate/add',
				permission     : 'sms-template-add',
				faterUrl       : 'smsTemplate/list',
				faterPermission: 'sms-template-list'
			},
			{
				pageUrl        : 'fission/add',
				permission     : 'fission-add',
				faterUrl       : 'fission/list',
				faterPermission: 'fission-list'
			},
			{
				pageUrl        : 'fission/participants',
				permission     : 'fission-part',
				faterUrl       : 'fission/list',
				faterPermission: 'fission-list'
			},
			{
				pageUrl        : 'raffle/add',
				permission     : 'raffle-add',
				faterUrl       : 'raffle/list',
				faterPermission: 'raffle-list'
			},
			{
				pageUrl        : 'raffle/participants',
				permission     : 'raffle-part',
				faterUrl       : 'raffle/list',
				faterPermission: 'raffle-list'
			},
			{
				pageUrl        : 'channelCode/add',
				permission     : 'channel-add',
				faterUrl       : 'channelCode/list',
				faterPermission: 'channel-list'
			},
			{
				pageUrl        : 'channelCode/statistics',
				permission     : 'channel-statistic',
				faterUrl       : 'channelCode/list',
				faterPermission: 'channel-list'
			},
			{
				pageUrl        : 'channelCode/baiduAdd',
				permission     : 'channelCodeBaidu-add',
				faterUrl       : 'channelCode/baiduStatistics',
				faterPermission: 'channelCodeBaidu-list'
			},
			{
				pageUrl        : 'redPacket/userDetailRecords',
				permission     : 'employee-detail',
				faterUrl       : 'redPacket/employeeManagement',
				faterPermission: 'employee-list'
			},
			{
				pageUrl        : 'redPacket/detailRecords',
				permission     : 'redReconciliation-info',
				faterUrl       : 'redPacket/reconciliation',
				faterPermission: 'redReconciliation'
			},
			{
				pageUrl        : 'customManage/detail',
				permission     : 'client-info',
				faterUrl       : 'customManage/list',
				faterPermission: 'client-list'
			},
			{
				pageUrl        : 'customManage/noCustomDetail',
				permission     : 'client-info',
				faterUrl       : 'customManage/list',
				faterPermission: 'client-list'
			},
			{
				pageUrl        : 'customManage/thirdStore',
				permission     : 'other-store',
				faterUrl       : 'customManage/list',
				faterPermission: 'client-list'
			},
			{
				pageUrl        : 'follow/add',
				permission     : 'follow-rule',
				faterUrl       : 'follow/list',
				faterPermission: 'follow-list'
			},
			{
				pageUrl        : 'group/statistics',
				permission     : 'groupList-single',
				faterUrl       : 'group/list',
				faterPermission: 'groupList-list'
			},
			{
				pageUrl        : 'group/add',
				permission     : 'groupAutoCreate-add',
				faterUrl       : 'group/autoCreate',
				faterPermission: 'groupAutoCreate-list'
			},
			{
				pageUrl        : 'group/tagsCreateAdd',
				permission     : 'groupTags-add',
				faterUrl       : 'group/tagsCreate',
				faterPermission: 'groupTags-list'
			},
			{
				pageUrl        : 'group/welcomeAdd',
				permission     : 'groupWelcome-add',
				faterUrl       : 'group/welcome',
				faterPermission: 'groupWelcome-list'
			},
			{
				pageUrl        : 'group/clockInAdd',
				permission     : 'groupClockIn-add',
				faterUrl       : 'group/clockIn',
				faterPermission: 'groupClockIn-list',
			},
			{
				pageUrl        : 'welcome/add',
				permission     : 'welcome-add',
				faterUrl       : 'welcome/list',
				faterPermission: 'welcome-list'
			},
			{
				pageUrl        : 'massMessage/add',
				permission     : 'group-sending-add',
				faterUrl       : 'massMessage/list',
				faterPermission: 'group-sending-list'
			},
			{
				pageUrl        : 'redFission/participants',
				permission     : 'redFission-applyer',
				faterUrl       : 'redFission/list',
				faterPermission: 'redFission-list'
			},
			{
				pageUrl        : 'redFission/add',
				permission     : 'redFission-add',
				faterUrl       : 'redFission/list',
				faterPermission: 'redFission-list'
			},
			{
				pageUrl        : 'archive/userNoticeAdd',
				permission     : 'violations-employee-set',
				faterUrl       : 'archive/violationsNotice',
				faterPermission: 'violationsNotice'
			},
			{
				pageUrl        : 'archive/groupNoticeAdd',
				permission     : 'violations-chat-set',
				faterUrl       : 'archive/violationsNotice',
				faterPermission: 'violationsNotice'
			},
			{
				pageUrl        : 'wholeMarket/fissionAdd',
				permission     : 'wholeMarketFission-add',
				faterUrl       : 'wholeMarket/fissionList',
				faterPermission: 'wholeMarketFission-list',
				menuType       : 1,
			},
			{
				pageUrl        : 'wholeMarket/fissionAdd1',
				permission     : 'wxWholeMarketFission-add',
				faterUrl       : 'wholeMarket/fissionList1',
				faterPermission: 'wxWholeMarketFission-list',
				menuType       : 0,
			},
		],//子页面对应权限，为了子账户在地址栏输入地址时，跳转对应有权限页面
		activeMenu              :1, //1 首页 2，企业微信 3.公众号
		isShowWX                :false, //是否显示微信
		isShowCgh               :false, //是否显示公众号
	},
	getters: {
		getMenuList: state => state.menulist,
		getCurrentMenu: state => state.currentMenu,
		getActiveMenu: state => state.activeMenu,

		getSpecialMenuList: state => state.specialmenulist,
		getSpecialCurrentMenu: state => state.specialcurrentMenu,
		getSpecialActiveMenu: state => state.specialactiveMenu,
		getSpecialTotalMenuList : state => state.specialTotalMenuList,
		getIsSpecialMenuSet:state => state.isSpecialMenuSet,
		getSpecialTotalMenuActive:state => state.specialTotalMenuActive,
	},
	mutations: {
		updateSpecialTotalMenuActive(state, data){
			state.specialTotalMenuActive = data
		},
		updateIsSpecialMenuSet(state, data){
			state.isSpecialMenuSet = data
		},
		//更新总的个性化菜单数组数量
		updateSpecialTotalMenuList(state, data){

			if(Array.isArray(data)){
				state.specialTotalMenuList=data
			}else{ //如果是单个对象

				let k =  state.specialTotalMenuList.findIndex(item=>{

					return  item.special_menu_id == data.special_menu_id
				})
				if(k==-1){
					state.specialTotalMenuList.push(data)
				}else{
					state.specialTotalMenuList[k]=data
				}

			}

		},
		updateSpecialMenuList(state, data){
			state.specialmenulist = data
		},
		updateSpecialCurrentMenu(state,data){

			//判断是否空对象
			if(Object.keys(data).length==0){
				state.specialcurrentMenu = data
				return
			}
			if (!data.type) data.type = 'click'
			if (data.leveltype == 'first') {
				let check = state.specialmenulist.findIndex(item => {
					return item.timeid == data.timeid
				})

				check != -1 ? state.specialmenulist[check] = data : state.specialmenulist.push(data)
			} else {
				let idx = state.specialactiveMenu;
				state.specialmenulist[idx].sub_button ? '' : state.specialmenulist[idx].sub_button = []
				let p = state.specialmenulist[idx].sub_button

				let check = p.findIndex(item => {
					return item.timeid == data.timeid
				})

				check == -1 ? p.push(data) : p[check] = data

			}

			state.specialcurrentMenu = data
			this.commit('changeSpecialtype')
		},
		changeSpecialtype(state){
			let c = state.specialcurrentMenu
			switch (c.radiotype) {
				case 'click':
					c.message ? c.type = 'click' : ''
					break;
				case 'view':
					c.link ? c.type = 'view' : ''
					break;
				case 'miniprogram':
					c.events ? c.type = 'miniprogram' : ''
					break;
				default:
			}
		},
		updateMenuList(state, data) {
			state.menulist = data
		},
		clearSpecialMenuList(state){
			state.specialmenulist=[]
		},
		clearMenuList(state){
			state.menulist=[]
		},
		updateCurrentMenu(state, data) {

			if (!data.type) data.type = 'click'
			if (data.leveltype == 'first') {
				let check = state.menulist.findIndex(item => {
					return item.timeid == data.timeid
				})

				check != -1 ? state.menulist[check] = data : state.menulist.push(data)
			} else {

				let idx = state.activeMenu;
				state.menulist[idx].sub_button ? '' : state.menulist[idx].sub_button = []
				let p = state.menulist[idx].sub_button

				let check = p.findIndex(item => {
					return item.timeid == data.timeid
				})

				check == -1 ? p.push(data) : p[check] = data

			}
			state.currentMenu = data
			this.commit('changetype')
		},
		clearCurrentMenu(state) {
			state.currentMenu = null
		},
		clearSpecialCurrentMenu(state){
			state.specialcurrentMenu = null
		},
		updateActiveMenu(state, data) {

			state.activeMenu = data
		},
		updateSpecialactiveMenu(state, data){
			state.specialactiveMenu = data
		},
		changetype(state) {
			let c = state.currentMenu
			switch (c.radiotype) {
				case 'click':
					c.message ? c.type = 'click' : ''
					break;
				case 'view':
					c.link ? c.type = 'view' : ''
					break;
				case 'miniprogram':
					c.events ? c.type = 'miniprogram' : ''
					break;
				default:
			}
		},
		changeSpecialCom(state) {

			if (state.specialcurrentMenu) {
				this.commit('changeSpecialtype')
				let c = _.cloneDeep(state.specialcurrentMenu)
				switch (c.type) {
					case 'click':
						delete (c['events'])
						delete (c['link'])
						delete (c['url'])
						delete (c['appid'])
						delete (c['pagepath'])
						break;
					case 'view':
						delete (c['events'])
						delete (c['message'])
						delete (c['key'])
						delete (c['appid'])
						delete (c['pagepath'])
						break;
					case 'miniprogram':
						delete (c['message'])
						delete (c['link'])
						delete (c['key'])
						break;
					default:
				}
				this.commit('updateSpecialCurrentMenu', c)
			}

		},
		changeCom(state) {
			if (state.currentMenu) {
				this.commit('changetype')
				let c = _.cloneDeep(state.currentMenu)
				switch (c.type) {
					case 'click':
						delete (c['events'])
						delete (c['link'])
						delete (c['url'])
						delete (c['appid'])
						delete (c['pagepath'])
						break;
					case 'view':
						delete (c['events'])
						delete (c['message'])
						delete (c['key'])
						delete (c['appid'])
						delete (c['pagepath'])
						break;
					case 'miniprogram':
						delete (c['message'])
						delete (c['link'])
						delete (c['key'])
						break;
					default:
				}
				this.commit('updateCurrentMenu', c)
			}

		},
		//修改环境
		changeProd (state, prod) {
			state.prod = prod;
		},
		//修改手机号
		changeAccount (state, phone) {
			state.account = phone;
		},
		//修改登录密码
		changePassword (state, password) {
			state.password = password;
		},
		//修改默认选中的wx_id
		changeWxNum (state, str) {
			state.wxNum = str;
			localStorage.setItem('wxNum', state.wxNum)
		},
		//修改公众号列表
		changeWxArr (state, arr) {
			state.wxArr = arr;
			localStorage.setItem('wxArr', JSON.stringify(state.wxArr))
		},
		//存储是否显示公众号菜单
		changeShowAccount (state, str) {
			state.showAccount = str;
			localStorage.setItem('showAccount', state.showAccount)
		},
		//修改修改小程序列表
		changeMiniArr (state, arr) {
			state.miniArr = arr;
			localStorage.setItem('miniArr', JSON.stringify(state.miniArr))
		},
		//修改选中公众号的index
		changeWxNumIndex (state) {
			state.wxArr.map((item, key) => {
				if (item.wx_id === state.wxNum) {
					state.wxNumIndex = key;
					localStorage.setItem('wxNumIndex', state.wxNumIndex)
				}
			});
		},
		clear (state) {
			state.account = ''
			state.password = ''
			state.wxArr = []
			state.wxNum = ''
			state.wxNumIndex = 0
			state.corpArr = []
			state.noBindCorpArr = []
			state.corpId = ''
			state.corpIndex = 0
			state.corpAuthType = ''
			state.corpName = ''
			state.authorizer_type = ''
			state.wxNickName = ''
			state.type = 0
			state.permissionButton = []
			state.menuData = []
			state.miniArr = []
		},
		//修改选中的公众号授权状态
		changeAuthorizerType (state, str) {
			state.authorizer_type = str
			localStorage.setItem('authorizer_type', state.authorizer_type)
		},
		//修改选中的微信公众号名字
		changeWxNickName (state, str) {
			state.wxNickName = str
			localStorage.setItem('wxNickName', state.wxNickName)
		},

		//修改默认选中的corpId
		changeCorpId (state, str) {
			state.corpId = str;
			localStorage.setItem('corpId', state.corpId)
		},
		//修改企业微信列表
		changeCorpArr (state, arr) {
			state.corpArr = arr;
			localStorage.setItem('corpArr', JSON.stringify(state.corpArr))
		},
		changeNoBindCorpArr (state, arr) {
			state.noBindCorpArr = arr;
		},
		//修改选中企业微信key
		changeCorpIndex (state) {
			state.corpArr.map((item, key) => {
				if (item.corpid === state.corpId) {
					state.corpIndex = key;
					localStorage.setItem('corpIndex', state.corpIndex)
				}
			});
		},
		//修改选中的企业微信授权状态
		changeCorpAuthType (state, str) {
			state.corpAuthType = str
			localStorage.setItem('corpAuthType', state.corpAuthType)
		},
		//修改选中的企业微信名字
		changeCorpName (state, str) {
			state.corpName = str
			localStorage.setItem('corpName', state.corpName)
		},
		//修改选中的是公众号还是企业微信
		changeType (state, str) {
			state.type = str;
			localStorage.setItem('type', str)
		},
		//修改子账户显示的权限按钮
		changePermissionButton (state, str) {
			state.permissionButton = str;
			localStorage.setItem('permissionButton', str)
		},
		// 设置菜单数据
		setMenuData (state, menuData) {
			state.menuData = menuData
		},
		//修改子账户显示的权限按钮
		changeRaffleParticipantsTabKey (state, str) {
			state.raffleParticipantsTabKey = str;
		},
		//修改有赞云跳转携带参数
		changeUserToken (state, str) {
			state.userToken = str;
		},
		//修改套餐信息
		changePackageDetail (state, pd) {
			state.packageDetail = pd;
		},
		// 调用方法
		changeActiveMenu (state, type) {
			state.activeMenu = type
		},
		// 修改是否显示微信
		changeActiveWX (state, type) {
			state.isShowWX = type
		},
		// 修改是否显示公众号
		changeActiveCro (state, type) {
			state.isShowCgh = type
		},
	},
	actions  : {
		//获取权限按钮列表
		async getPermissionButton (context) {
			let account_id = ''

			let wxArr = JSON.parse(localStorage.getItem('wxArr'))
			let corpArr = JSON.parse(localStorage.getItem('corpArr'))
			let type = localStorage.getItem("type")

			if (type == 0) {
				if (localStorage.getItem('showAccount') == 1) {
					type = 0
					if (wxArr !== null && wxArr.length > 0) {
						account_id = localStorage.getItem('wxNum')
					} else {
						account_id = ''
					}
				} else {
					type = 1
					if (corpArr !== null && corpArr.length > 0) {
						account_id = localStorage.getItem('corpId')
					}
				}
			} else if (type == 1) {
				if (corpArr !== null && corpArr.length > 0) {
					account_id = localStorage.getItem('corpId')
				} else {
					type = 0
					if (wxArr !== null && wxArr.length > 0) {
						account_id = localStorage.getItem('wxNum')
					}
				}
			}

			const {data: res} = await axios.post(
				"sub-user/get-sub-user-authority",
				{
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem("sub_id"),
					account_id     : account_id,
					type           : type,//0公众号，1企业微信
				}
			);
			if (res.error == 0) {
				context.commit("changePermissionButton", res.data);
				if (localStorage.getItem('token') && localStorage.getItem('permissionButton').split(',').indexOf('store-create') > -1 && typeof context.state.userToken != 'undefined' && context.state.userToken != '') {
					context.dispatch('judgeBindingState')
				}
			} else {
				message.error('获取权限按钮列表失败！');
			}
		},
		//登录状态下判断当前账号有赞店铺绑定状态
		async judgeBindingState (context) {
			const {data: res} = await Vue.prototype.axios.post('third-store/youzan-shop-bind', {
				uid      : localStorage.getItem('uid'),
				userToken: context.state.userToken
			})
			console.log(res.data, '登录状态下')
			if (res.error != 0) {
				message.warning(res.error_msg);
			} else {
				return res.data.type
			}
		},
		//获取企业微信列表
		async getCorp (context, callback) {
			if (context.state.corpArr.length == 0 || !localStorage.getItem("corpArr") || context.state.corpArr[0].corpid !== JSON.parse(localStorage.getItem("corpArr"))[0].corpid) {
				const {data: res} = await axios.post(
					"work-corp/list",
					{
						uid            : localStorage.getItem("uid"),
						sub_id         : localStorage.getItem('sub_id'),
						isMasterAccount: localStorage.getItem('isMasterAccount'),
					}
				);
				if (res.error == 0) {
					if (localStorage.getItem('corpId')) {
						let isSameAccount = false
						res.data.info.map(x => {
							if (x.corpid == localStorage.getItem('corpId')) {
								isSameAccount = true
							}
						})
						if (isSameAccount) {
							context.commit("changeCorpId", localStorage.getItem('corpId'));
						} else {
							if (res.data.info.length > 0) {
								context.commit("changeCorpId", res.data.info[0].corpid);
							} else {
								context.commit("changeCorpId", '');
							}
						}
					} else {
						if (res.data.info.length > 0) {
							context.commit("changeCorpId", res.data.info[0].corpid);
						} else {
							context.commit("changeCorpId", '');
						}
					}
					if (localStorage.getItem('corpAuthType')) {
						let isSameAccount = false
						res.data.info.map(x => {
							if (x.auth_type == localStorage.getItem('corpAuthType')) {
								isSameAccount = true
							}
						})
						if (isSameAccount) {
							context.commit("changeCorpAuthType", localStorage.getItem('corpAuthType'));
						} else {
							if (res.data.info.length > 0) {
								context.commit("changeCorpAuthType", res.data.info[0].auth_type);
							} else {
								context.commit("changeCorpAuthType", '');
							}
						}
					} else {
						if (res.data.info.length > 0) {
							context.commit("changeCorpAuthType", res.data.info[0].auth_type);
						} else {
							context.commit("changeCorpAuthType", '');
						}
					}
					if (localStorage.getItem('corpName')) {
						let isSameAccount = false
						res.data.info.map(x => {
							if (x.corp_full_name || x.corp_name == localStorage.getItem('corpName')) {
								isSameAccount = true
							}
						})
						if (isSameAccount) {
							context.commit("changeCorpName", localStorage.getItem('corpName'));
						} else {
							if (res.data.info.length > 0) {
								context.commit("changeCorpName", res.data.info[0].corp_full_name || res.data.info[0].corp_name);
							} else {
								context.commit("changeCorpName", '');
							}
						}
					} else {
						if (res.data.info.length > 0) {
							context.commit("changeCorpName", res.data.info[0].corp_full_name || res.data.info[0].corp_name);
						} else {
							context.commit("changeCorpName", '');
						}
					}
					context.commit("changeCorpArr", res.data.info);
					context.commit("changeNoBindCorpArr", res.data.notBindList);
					context.commit("changeCorpIndex");

					if (typeof callback === 'function') {
						callback(res.data.info);
					}
				} else {
					if (typeof callback === 'function') {
						callback([])
					}

					message.error('获取企业微信列表失败！');
				}
			} else {
				if (typeof callback === 'function') {
					callback(context.state.corpArr);
				}
			}
		},
		//获取微信公众号列表
		async getWx (context, callback) {
			if (context.state.wxArr.length == 0 || !localStorage.getItem("wxArr") || context.state.wxArr[0].id !== JSON.parse(localStorage.getItem("wxArr"))[0].id) {
				const {data: res} = await axios.post(
					"wx-authorize-info/get-authrize-info",
					{
						uid            : localStorage.getItem("uid"),
						sub_id         : localStorage.getItem('sub_id'),
						isMasterAccount: localStorage.getItem('isMasterAccount'),
					}
				);
				if (res.error == 0) {
					if (localStorage.getItem('wxNum')) {
						let isSameAccount = false
						res.data.info.map(x => {
							if (x.wx_id == localStorage.getItem('wxNum')) {
								isSameAccount = true
							}
						})
						if (isSameAccount) {
							context.commit("changeWxNum", localStorage.getItem('wxNum'));
						} else {
							if (res.data.info.length > 0) {
								context.commit("changeWxNum", res.data.info[0].wx_id);
							} else {
								context.commit("changeWxNum", '');
							}
						}
					} else {
						if (res.data.info.length > 0) {
							context.commit("changeWxNum", res.data.info[0].wx_id);
						} else {
							context.commit("changeWxNum", '');
						}
					}
					if (localStorage.getItem('authorizer_type')) {
						let isSameAccount = false
						res.data.info.map(x => {
							if (x.authorizer_type == localStorage.getItem('authorizer_type')) {
								isSameAccount = true
							}
						})
						if (isSameAccount) {
							context.commit("changeAuthorizerType", localStorage.getItem('authorizer_type'));
						} else {
							if (res.data.info.length > 0) {
								context.commit("changeAuthorizerType", res.data.info[0].authorizer_type);
							} else {
								context.commit("changeAuthorizerType", '');
							}
						}
					} else {
						if (res.data.info.length > 0) {
							context.commit("changeAuthorizerType", res.data.info[0].authorizer_type);
						} else {
							context.commit("changeAuthorizerType", '');
						}
					}
					if (localStorage.getItem('wxNickName')) {
						let isSameAccount = false
						res.data.info.map(x => {
							if (x.nick_name == localStorage.getItem('wxNickName')) {
								isSameAccount = true
							}
						})
						if (isSameAccount) {
							context.commit("changeWxNickName", localStorage.getItem('wxNickName'));
						} else {
							if (res.data.info.length > 0) {
								context.commit("changeWxNickName", res.data.info[0].nick_name);
							} else {
								context.commit("changeWxNickName", '');
							}
						}
					} else {
						if (res.data.info.length > 0) {
							context.commit("changeWxNickName", res.data.info[0].nick_name);
						} else {
							context.commit("changeWxNickName", '');
						}
					}
					context.commit("changeWxArr", res.data.info);
					context.commit("changeWxNumIndex");
					context.commit("changeShowAccount", res.data.showAccount);

					if (typeof callback === 'function') {
						callback(res.data.info);
					}
				} else {
					if (typeof callback === 'function') {
						callback([])
					}

					$message.error('获取公众号列表失败！');
				}
			} else {
				if (typeof callback === 'function') {
					callback(context.state.wxArr);
				}
			}

		},
		//获取小程序列表
		async getMini (context, callback) {
			if (context.state.miniArr.length == 0 || !localStorage.getItem("miniArr") || context.state.miniArr[0].id !== JSON.parse(localStorage.getItem("miniArr"))[0].id) {
				const {data: res} = await axios.post(
					"wx-authorize-info/get-authrize-info",
					{
						uid            : localStorage.getItem("uid"),
						sub_id         : localStorage.getItem('sub_id'),
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						type           : 1
					}
				);
				if (res.error == 0) {
					context.commit("changeMiniArr", res.data.info);

					if (typeof callback === 'function') {
						callback(res.data.info);
					}
				} else {
					if (typeof callback === 'function') {
						callback([])
					}

					$message.error('获取小程序列表失败！');
				}
			} else {
				if (typeof callback === 'function') {
					callback(context.state.miniArr);
				}
			}
		},
		changeWxNum (context, wxNum) {
			context.commit('changeWxNum', wxNum);
			context.commit('changeWxNumIndex');
		},
		changeCorp (context, corp) {
			context.commit("changeCorpId", corp.corpid);
			context.commit("changeCorpAuthType", corp.auth_type);
			context.commit("changeCorpName", corp.corp_full_name || corp.corp_name);
			context.commit("changeCorpIndex");
		},
		changePackageDetail (context, pd) {
			context.commit("changePackageDetail", pd);
		},
		changeMenu(context, type) {
			context.commit("changeActiveMenu", type);
		},
		chanegWx (context, type) {
			context.commit("changeActiveWX", type);
		},
		chanegCro (context, type) {
			context.commit("changeActiveCro", type);
		},
	}
})
