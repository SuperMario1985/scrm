import Vue from 'vue'
import Router from 'vue-router'
import store from "./store";
import { message } from "ant-design-vue"

import DashboardLayout from "./layouts/DashboardLayout";

import Home from './views/dashboard/Home.vue'
import Login from './views/dashboard/login/Login.vue'
import Forget from './views/dashboard/login/Forget.vue'
import PassLogin from './views/dashboard/login/PassLogin.vue'
import ScanCode from './views/dashboard/login/Scancode.vue'
import Binding from './views/dashboard/login/Binding.vue'
import ForgetPass from './views/dashboard/login/ForgetPass.vue'
import VerifyPassword from './views/dashboard/login/VerifyPassword.vue'
import WorkBinding from './views/dashboard/login/WorkBinding.vue'
import Register from './views/dashboard/login/Register.vue'
import FreeRegister from './views/dashboard/login/FreeRegister.vue'
import Regist from './views/dashboard/login/Regist.vue'
import Account from './views/dashboard/Account.vue'
import Material from './views/dashboard/Material.vue'
import OperationCenter from './views/dashboard/OperationCenter.vue'
import WechatManagement from './views/dashboard/WechatManagement.vue'
import SubAccount from './views/dashboard/SubAccount.vue'
import HomePage from './views/dashboard/homePage/homePage.vue'
// import Integration from './views/dashboard/Integration.vue'
import ChooseAccount from './views/dashboard/ChooseAccount.vue'
import IndexLayout from './layouts/IndexLayout.vue'

Vue.use(Router)

const routerMothods = ['push', 'replace']
routerMothods.map((method) => {
	const VueRouterCall = Router.prototype[method]

	Router.prototype[method] = function (location, onComplete, onAbort) {
		if (onComplete || onAbort) {
			return VueRouterCall.call(this, location, onComplete, onAbort)
		}
		return VueRouterCall.call(this, location).catch(err => {
			console.log({ path: location, msg: err, })
		})
	}
})

var router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', redirect: '/home' },
		{ path: '/login', component: Login },
		{ path: '/passLogin', component: PassLogin },
		{ path: '/scancode', component: ScanCode },
		{ path: '/binding', component: Binding },
		{ path: '/forgetPass', component: Forget },
		{ path: '/verifyPassword', component: VerifyPassword },
		{ path: '/workBinding', component: WorkBinding },
		{ path: '/freeRegister', component: FreeRegister },
		{ path: '/register', component: Register },
		{ path: '/regist', component: Regist },
		{ path: '/chooseAccount', component: ChooseAccount },
		{ path: '/index', component: IndexLayout ,
		meta: {
			isMenuIndex:1,
		}
	},
		{
			path: '/',
			component: DashboardLayout,
			redirect: '/home',
			children: [
				{
					path: '/home',
					name: 'home',
					component: OperationCenter,
					// 授权页面显示与隐藏,false要展示，true不展示
					meta: {
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/about',
					name: 'about',
					component: () => import('./views/dashboard/About.vue'),
					meta: {
						keepAlive: false
					}
				},
				{
					path: '/push/list',
					name: 'push',
					component: () => import('./views/dashboard/push/List.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path     : 'message/publicAccoutMenu',
					name     : 'publicAccoutMenu',
					component: () => import('./views/dashboard/publicAccoutMenu/home.vue'),
					meta     : {
						keepAlive: false
					}
				},
				{
					path: '/push/add',
					name: 'push',
					component: () => import('./views/dashboard/push/Add.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path     : 'keyword/list',
					name     : 'keyword',
					component: () => import('./views/dashboard/keyword/List.vue'),
					meta     : {
						keepAlive: false
					}
				},
				{
					path     : 'keyword/add',
					name     : 'keyword',
					component: () => import('./views/dashboard/keyword/Add.vue'),
					meta     : {
						keepAlive: false
					}
				},
				{
					path: '/fans/list',
					name: 'fans',
					component: () => import('./views/dashboard/fans/List.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/account',
					name: 'account',
					component: Account,
					meta: {
						keepAlive: true,
						isMenuIndex:3,
					}
				},
				{
					path: '/mini',
					name: 'mini',
					component: () => import('./views/dashboard/AccountMini.vue'),
					meta: {
						keepAlive: true,
						isMenuIndex:3,
					}
				},
				{
					path: '/subAccount',
					name: 'subAccountDad',
					component: SubAccount,
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				// {
				// 	path     : 'integration',
				// 	name     : 'integration',
				// 	component: Integration,
				// 	meta     : {
				// 		keepAlive : true,
				// 		corpAlive : true,
				// 		agentAlive: true
				// 	}
				// },
				{
					path: '/tags/list',
					name: 'tags',
					component: () => import('./views/dashboard/tags/List.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/template/list',
					name: 'template',
					component: () => import('./views/dashboard/template/List.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/template/add',
					name: 'template',
					component: () => import('./views/dashboard/template/Add.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/fans/msg',
					name: 'fansMsgDad',
					component: () => import('./views/dashboard/fans/msg.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/fans/detail',
					name: 'fans',
					component: () => import('./views/dashboard/fans/detail.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/fansCustomerAttribute/management',
					name: 'fansCustomerAttribute',
					component: () => import('./views/dashboard/customerAttribute/Management.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/corpCustomerAttribute/management',
					name: 'corpCustomerAttribute',
					component: () => import('./views/dashboard/customerAttribute/Management.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/user/userUpdate',
					name: 'user',
					component: () => import('./views/dashboard/user/UserUpdate.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
					}
				},
				{
					path: '/scene/list',
					name: 'scene',
					component: () => import('./views/dashboard/scene/List.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/scene/add',
					name: 'scene',
					component: () => import('./views/dashboard/scene/Add.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/scene/statistics',
					name: 'scene',
					component: () => import('./views/dashboard/scene/Statistics.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/material',
					name: 'material',
					component: Material,
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/senior/list',
					name: 'senior',
					component: () => import('./views/dashboard/senior/List.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/senior/add',
					name: 'senior',
					component: () => import('./views/dashboard/senior/Add.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/customer/list',
					name: 'customer',
					component: () => import('./views/dashboard/customer/List.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/customer/add',
					name: 'customer',
					component: () => import('./views/dashboard/customer/Add.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/reply/list',
					name: 'reply',
					component: () => import('./views/dashboard/reply/List.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/reply/add',
					name: 'reply',
					component: () => import('./views/dashboard/reply/Add.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:3,
					}
				},
				{

					path: '/sign/list',
					name: 'sign',
					component: () => import('./views/dashboard/sign/List.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/client/list',
					name: 'client',
					component: () => import('./views/dashboard/client/List.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/smsSend/list',
					name: 'smsSend2',
					component: () => import('./views/dashboard/smsSend/List.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/smsSend/detail',
					name: 'smsSend2',
					component: () => import('./views/dashboard/smsSend/Detail.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/smsSend/add',
					name: 'smsSend2',
					component: () => import('./views/dashboard/smsSend/Add.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/smsSend/order',
					name: 'smsSend2',
					component: () => import('./views/dashboard/smsSend/Order.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/smsTemplate/list',
					name: 'smsTemplate',
					component: () => import('./views/dashboard/smsTemplate/List.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/smsTemplate/add',
					name: 'smsTemplate',
					component: () => import('./views/dashboard/smsTemplate/Add.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/operationCenter',
					name: 'operationCenter',
					component: Home,
					meta: {
						keepAlive: true,
						isMenuIndex:3,
					}
				},
				{
					path: '/staff/list',
					name: 'staff',
					component: () => import('./views/dashboard/staff/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/staff/dimission',
					name: 'staffDimission',
					component: () => import('./views/dashboard/staff/Dimission.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/label/list',
					name: 'label',
					component: () => import('./views/dashboard/label/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/delCustomer/list',
					name: 'deleteCustomer',
					component: () => import('./views/dashboard/delCustomer/List.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/customManage/list',
					name: 'customManage',
					component: () => import('./views/dashboard/customManage/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/customManage/detail',
					name: 'customManage',
					component: () => import('./views/dashboard/customManage/Detail.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/customManage/thirdStore',
					name: 'customManage',
					component: () => import('./views/dashboard/customManage/ThirdStore.vue'),
					meta: {
						keepAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path     : 'sop/list',
					name     : 'customSopList',
					component: () => import('./views/dashboard/sop/sopCustomIndex.vue'),
					meta     : {
						keepAlive: true
					}
				},
				{
					path     : 'sop/addRules',
					name     : 'customSopList',
					component: () => import('./views/dashboard/sop/sopAddRules.vue'),
					meta     : {
						keepAlive: false
					}
				},
				{
					path     : 'chatSop/list',
					name     : 'chatSopList',
					component: () => import('./views/dashboard/sop/sopChatindex.vue'),
					meta     : {
						keepAlive: true
					}
				},
				{
					path     : 'chatSop/addRules',
					name     : 'chatSopList',
					component: () => import('./views/dashboard/sop/sopAddRules.vue'),
					meta     : {
						keepAlive: false
					}
				},
				{
					path     : 'chatSop/addRules',
					name     : 'chatSopList',
					component: () => import('./views/dashboard/sop/sopAddRules.vue'),
					meta     : {
						keepAlive: false
					}
				},
				{
					path: '/customTags/list',
					name: 'customTags',
					component: () => import('./views/dashboard/customTags/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/customRecord/list',
					name: 'customRecord',
					component: () => import('./views/dashboard/customRecord/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/customRecord/detail',
					name: 'customRecord',
					component: () => import('./views/dashboard/customRecord/Detail.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/channelCode/list',
					name: 'channelCode',
					component: () => import('./views/dashboard/channelCode/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/channelCode/add',
					name: 'channelCode',
					component: () => import('./views/dashboard/channelCode/Add.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/channelCode/statistics',
					name: 'channelCode',
					component: () => import('./views/dashboard/channelCode/Statistics.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/channelCode/statisticsAll',
					name: 'channelCodeStatistics',
					component: () => import('./views/dashboard/channelCode/StatisticsAll.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2, 
					}
				},
				{
					path: '/channelCode/baiduStatistics',
					name: 'channelCodeBaidu',
					component: () => import('./views/dashboard/channelCode/Baidu.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/channelCode/baiduAdd',
					name: 'channelCodeBaidu',
					component: () => import('./views/dashboard/channelCode/BaiduAdd.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/wholeMarket/fissionList',
					name: 'wholeMarketFission',
					component: () => import('./views/dashboard/wholeMarket/fission/List.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/wholeMarket/fissionList1',
					name: 'wxWholeMarketFission',
					component: () => import('./views/dashboard/wholeMarket/fission/List.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/wholeMarket/fissionAdd',
					name: 'wholeMarketFission',
					component: () => import('./views/dashboard/wholeMarket/fission/Add.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/wholeMarket/fissionAdd1',
					name: 'wxWholeMarketFission',
					component: () => import('./views/dashboard/wholeMarket/fission/Add.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/wholeMarket/fissionParticipants',
					name: 'wholeMarketFission',
					component: () => import('./views/dashboard/wholeMarket/fission/Participants.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/wholeMarket/fissionParticipants1',
					name: 'wxWholeMarketFission',
					component: () => import('./views/dashboard/wholeMarket/fission/Participants.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/wholeMarket/statistic',
					name: 'wholeMarketFission',
					component: () => import('./views/dashboard/wholeMarket/fission/Statistic.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/wholeMarket/statistic1',
					name: 'wxWholeMarketFission',
					component: () => import('./views/dashboard/wholeMarket/fission/Statistic.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:3,
					}
				},
				{
					path: '/fission/list',
					name: 'fission',
					component: () => import('./views/dashboard/fission/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: '/fission/add',
					name: 'fission',
					component: () => import('./views/dashboard/fission/Add.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: '/fission/participants',
					name: 'fission',
					component: () => import('./views/dashboard/fission/Participants.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: '/fission/helpRecord',
					name: 'fission',
					component: () => import('./views/dashboard/fission/HelpRecord.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: 'redForNew/list',
					name: 'redForNewList',
					component: () => import('./views/dashboard/redForNew/List.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: 'redForNew/add',
					name: 'redForNewList',
					component: () => import('./views/dashboard/redForNew/Add.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: 'redForNew/participants',
					name: 'redForNewList',
					component: () => import('./views/dashboard/redForNew/Participants.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: 'redForNew/statistics',
					name: 'redForNewList',
					component: () => import('./views/dashboard/redForNew/Statistics.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: 'redForNew/rule',
					name: 'redForNewRule',
					component: () => import('./views/dashboard/redForNew/Rule.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: 'redForNew/ruleAdd',
					name: 'redForNewRule',
					component: () => import('./views/dashboard/redForNew/RuleAdd.vue'),
					meta: {
						corpAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: 'redFission/list',
					name: 'redFission',
					component: () => import('./views/dashboard/redFission/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: 'redFission/add',
					name: 'redFission',
					component: () => import('./views/dashboard/redFission/Add.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: 'redFission/participants',
					name: 'redFission',
					component: () => import('./views/dashboard/redFission/Participants.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: 'redFission/helpRecord',
					name: 'redFission',
					component: () => import('./views/dashboard/redFission/HelpRecord.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: 'raffle/list',
					name: 'raffle',
					component: () => import('./views/dashboard/raffle/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: 'raffle/add',
					name: 'raffle',
					component: () => import('./views/dashboard/raffle/Add.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/raffle/participants',
					name: 'raffle',
					component: () => import('./views/dashboard/raffle/Participants.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/raffle/drawDetail',
					name: 'raffle',
					component: () => import('./views/dashboard/raffle/DrawDetail.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/raffle/helpDetail',
					name: 'raffle',
					component: () => import('./views/dashboard/raffle/HelpDetail.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: '/welcome/list',
					name: 'welcomeDad',
					component: () => import('./views/dashboard/welcome/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/welcome/add',
					name: 'welcomeDad',
					component: () => import('./views/dashboard/welcome/Add.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/massMessage/list',
					name: 'massMessageDad',
					component: () => import('./views/dashboard/massMessage/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/massMessage/add',
					name: 'massMessageDad',
					component: () => import('./views/dashboard/massMessage/Add.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/filingCabinet/list',
					name: 'filingCabinetList',
					component: () => import('./views/dashboard/filingCabinet/List.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:3,
					}
				},
				{
					path     : 'filingCabinet/tag',
					name     : 'filingCabinetTag',
					component: () => import('./views/dashboard/filingCabinet/Tag.vue'),
					meta     : {
						keepAlive : true,
						corpAlive : true,
						agentAlive: true
					}
				},
				{
					path: '/filingCabinet/add',
					name: 'filingCabinetList',
					component: () => import('./views/dashboard/filingCabinet/Add.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/filingCabinet/info',
					name: 'filingCabinetList',
					component: () => import('./views/dashboard/filingCabinet/Info.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/filingCabinet/statistics',
					name: 'filingCabinetStatisticsNew',
					component: () => import('./views/dashboard/filingCabinet/Statistics.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/wechatManagement',
					name: 'wechatManagementDad',
					component: WechatManagement,
					meta: {
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/agent/list',
					name: 'agentDad',
					component: () => import('./views/dashboard/agent/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path: '/sidebar/detail',
					name: 'sidebarDad',
					component: () => import('./views/dashboard/sidebar/Detail.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/archive/message',
					name: 'archiveMessage',
					component: () => import('./views/dashboard/archive/Message.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/appCenter/list',
					name: 'appCenterListDad',
					component: () => import('./views/dashboard/appCenter/List.vue'),
					meta: {
						keepAlive: true,
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},
				{
					path     : 'shopAppCenter/list',
					name     : 'shopAppCenterList',
					component: () => import('./views/dashboard/appCenter/List.vue'),
					meta     : {
						keepAlive : true,
						corpAlive : true,
						agentAlive: true
					}
				},
				// 多余的路由
				{
					path: '/archive/rule',
					name: 'archiveRule',
					component: () => import('./views/dashboard/archive/Rule.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				// 多余的路由
				{
					path: '/archive/list',
					name: 'archive',
					component: () => import('./views/dashboard/archive/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: '/archive/msg',
					name: 'archiveMsg',
					component: () => import('./views/dashboard/archive/Msg.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/archive/sensitive',
					name: 'sensitive',
					component: () => import('./views/dashboard/archive/Sensitive'),
					meta: {
						corpAlive: true,
						agentAlive: true,
						isMenuIndex:2,
					}
				},

				{
					path: '/archive/violationsNotice',
					name: 'violationsNotice',
					component: () => import('./views/dashboard/archive/ViolationsNotice'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/archive/userNoticeAdd',
					name: 'violationsNotice',
					component: () => import('./views/dashboard/archive/UserNoticeAdd.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/archive/groupNoticeAdd',
					name: 'violationsNotice',
					component: () => import('./views/dashboard/archive/GroupNoticeAdd.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/archive/chatTag',
					name: 'chatTag',
					component: () => import('./views/dashboard/archive/ChatTag.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/staff/redirect',
					name: 'redirectDad',
					component: () => import('./views/dashboard/staff/Redirect.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/customImport/list',
					name: 'customImportList',
					component: () => import('./views/dashboard/customImport/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/redPacket/records',
					name: 'redRecords',
					component: () => import('./views/dashboard/redPacket/Records.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/redPacket/setting',
					name: 'redSetting',
					component: () => import('./views/dashboard/redPacket/Setting.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/redPacket/reconciliation',
					name: 'redReconciliation',
					component: () => import('./views/dashboard/redPacket/Reconciliation.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/redPacket/detailRecords',
					name: 'redReconciliation',
					component: () => import('./views/dashboard/redPacket/DetailRecords.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/redPacket/employeeManagement',
					name: 'redEmployeeManagement',
					component: () => import('./views/dashboard/redPacket/EmployeeManagement.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/redPacket/userDetailRecords',
					name: 'redEmployeeManagement',
					component: () => import('./views/dashboard/redPacket/UserDetailRecords.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/thirdPartyStore/store',
					name: 'appCenterList',
					component: () => import('./views/dashboard/thirdPartyStore/Store.vue'),
					meta: {
						corpAlive: true,
						agentAlive: true,
					}
				},
				{
					path: '/thirdPartyStore/order',
					name: 'appCenterList',
					component: () => import('./views/dashboard/thirdPartyStore/Order.vue'),
					meta: {
						corpAlive: true,
						agentAlive: true
					}
				},
				{
					path: '/thirdPartyStore/members',
					name: 'appCenterList',
					component: () => import('./views/dashboard/thirdPartyStore/Members.vue'),
					meta: {
						corpAlive: true,
						agentAlive: true
					}
				},
				{
					path: '/follow/list',
					name: 'follow',
					component: () => import('./views/dashboard/follow/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/follow/statistics',
					name: 'followStatistics',
					component: () => import('./views/dashboard/follow/Statistic.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/follow/add',
					name: 'follow',
					component: () => import('./views/dashboard/follow/Add.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/list',
					name: 'groupList',
					component: () => import('./views/dashboard/group/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/statistics',
					name: 'groupList',
					component: () => import('./views/dashboard/group/Statistics.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				// {
				// 	path     : 'group/notice',
				// 	name     : 'groupNotice',
				// 	component: () => import('./views/dashboard/group/Notice.vue'),
				// 	meta     : {
				// 		corpAlive: false,
				// 	}
				// },
				{
					path: '/group/statisticsAll',
					name: 'groupStatistics',
					component: () => import('./views/dashboard/group/StatisticsAll.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/autoCreate',
					name: 'groupAutoCreate',
					component: () => import('./views/dashboard/group/AutoCreate.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/tagsCreate',
					name: 'groupTagsCreate',
					component: () => import('./views/dashboard/group/TagsCreate.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/welcome',
					name: 'groupWelcome',
					component: () => import('./views/dashboard/group/Welcome.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/welcomeAdd',
					name: 'groupWelcome',
					component: () => import('./views/dashboard/group/WelcomeAdd.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/add',
					name: 'groupAutoCreate',
					component: () => import('./views/dashboard/group/Add.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/tagsCreateAdd',
					name: 'groupTagsCreate',
					component: () => import('./views/dashboard/group/TagsCreateAdd.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/clockIn',
					name: 'groupClockIn',
					component: () => import('./views/dashboard/group/ClockIn.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/clockInAdd',
					name: 'groupClockIn',
					component: () => import('./views/dashboard/group/ClockInAdd.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/group/joinList',
					name: 'groupClockIn',
					component: () => import('./views/dashboard/group/JoinList.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path: '/customCrm/kanban',
					name: 'customCrmKanban',
					component: () => import('./views/dashboard/customCrm/Kanban.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/highSeasCustomer/list',
					name: 'highSeasCustomerList',
					component: () => import('./views/dashboard/highSeasCustomer/List.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/highSeasCustomer/detail',
					name: 'highSeasCustomerList',
					component: () => import('./views/dashboard/highSeasCustomer/Detail.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/highSeasCustomer/recyclingRules',
					name: 'highSeasCustomerRecyclingRules',
					component: () => import('./views/dashboard/highSeasCustomer/RecyclingRules.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/customManage/noCustomDetail',
					name: 'customManage',
					component: () => import('./views/dashboard/customManage/NoCustomDetail.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				}, {
					path: '/todoManagement/setting',
					name: 'todoManagementSetting',
					component: () => import('./views/dashboard/todoManagement/Setting.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				}, {
					path: '/todoManagement/customize',
					name: 'todoManagementCustomize',
					component: () => import('./views/dashboard/todoManagement/Customize.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				}, {
					path: '/todoManagement/remind',
					name: 'todoManagementRemind',
					component: () => import('./views/dashboard/todoManagement/Remind.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				}, {
					path: '/todoManagement/kanban',
					name: 'todoManagementKanban',
					component: () => import('./views/dashboard/todoManagement/Kanban.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path: '/circle/circleOfFriends',
					name: 'circleOfFriendsDad',
					component: () => import('./views/dashboard/circle/CircleOfFriends.vue'),
					meta: {
						corpAlive: false,
						agentAlive: false,
						isMenuIndex:2,
					}
				},
				{
					path     : 'circle/addFriends',
					name     : 'circleOfFriendsDad',
					component: () => import('./views/dashboard/circle/AddFriends.vue'),
					meta     : {
						corpAlive : false,
						agentAlive: false
					}
				},
				{
					path     : 'store/list',
					name     : 'storeList',
					component: () => import('./views/dashboard/store/List.vue'),
					meta     : {
						corpAlive : false,
						agentAlive: false
					}
				},
				{
					path     : 'smartRecommended/list',
					name     : 'smartRecommended',
					component: () => import('./views/dashboard/smartRecommended/List.vue'),
					meta     : {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path     : 'smartRecommended/ruleAdd',
					name     : 'smartRecommendedRuleAdd',
					component: () => import('./views/dashboard/smartRecommended/RuleAdd.vue'),
					meta     : {
						corpAlive: false,
						agentAlive: false
					}
				},
				{
					path     : 'shopCustom/CustomManage',
					name     : 'shopCustomManage',
					component: () => import('./views/dashboard/shopCustom/CustomManage.vue'),
					meta     : {
						corpAlive: false
					}
				},
				{
					path     : 'shopCustom/CustomSet',
					name     : 'customSet',
					component: () => import('./views/dashboard/shopCustom/CustomSet.vue'),
					meta     : {
						corpAlive: false
					}
				},
				{
					path     : 'shopCustom/CustomOrder',
					name     : 'customOrder',
					component: () => import('./views/dashboard/shopCustom/CustomOrder.vue'),
					meta     : {
						corpAlive: false
					}
				},
				{
					path     : 'shopCustom/CustomStatis',
					name     : 'customStatis',
					component: () => import('./views/dashboard/shopCustom/CustomStatis.vue'),
					meta     : {
						corpAlive: false
					}
				},
				{
					path     : 'shopCustom/guideManage',
					name     : 'guideManage',
					component: () => import('./views/dashboard/shopGuide/guideManage.vue'),
					meta     : {
						corpAlive: false
					}
				},
				{
					path     : 'shopCustom/guideSet',
					name     : 'guideSet',
					component: () => import('./views/dashboard/shopGuide/guideSet.vue'),
					meta     : {
						corpAlive: false
					}
				},
				{
					path     : 'shopCustom/guideAchieve',
					name     : 'guideAchieve',
					component: () => import('./views/dashboard/shopGuide/guideAchieve.vue'),
					meta     : {
						corpAlive: false
					}
				},
				{
					path     : 'shopCustom/shopMaterial',
					name     : 'shopMaterial',
					component: () => import('./views/dashboard/shopCustom/shopMaterial.vue'),
					meta     : {
						corpAlive: false
					}
				},
				{
					path     : 'shopCustom/shareDetail',
					name     : 'shareDetail',
					component: () => import('./views/dashboard/shopCustom/shareDetail.vue'),
					meta     : {
						corpAlive: false
					}
				},
				{
					path     : 'call/callSeatManagement',
					name     : 'callSeatManagement',
					component: () => import('./views/dashboard/call/CallSeatManagement.vue'),
				},
				{
					path     : 'call/callStatic',
					name     : 'callStatic',
					component: () => import('./views/dashboard/call/CallStatic.vue'),
				},
				{
					path     : 'call/callRecord',
					name     : 'callRecord',
					component: () => import('./views/dashboard/call/CallRecord.vue'),
				},
				{
					path     : 'call/callStaff',
					name     : 'callStaff',
					component: () => import('./views/dashboard/call/callStaff.vue'),
				},
				{
					path     : 'call/accountBalance',
					name     : 'callRecord',
					component: () => import('./views/dashboard/call/accountBalance.vue'),
				},		
			]
		}
	]
})

//登录状态下判断当前账号有赞店铺绑定状态
var judgeBindingState = async function (userToken) {
	const { data: res } = await Vue.prototype.axios.post('third-store/youzan-shop-bind', {
		uid: localStorage.getItem('uid'),
		userToken: userToken
	})
	console.log(res.data.type, '登录状态下')
	if (res.error != 0) {
		message.warning(res.error_msg);
	} else {
		return res.data.type
	}
}

//未登录状态下判断当前账号有赞店铺绑定状态
var judgeBindingState2 = async function (userToken) {
	const { data: res } = await Vue.prototype.axios.post('login/youzan-shop-bind', {
		userToken: userToken
	})
	console.log(res.data.type, '未登录状态')
	if (res.error != 0) {
		message.warning(res.error_msg);
	} else {
		return res.data
	}
}

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
	//to 将要访问的路径  from 代表从那个路径跳转而来
	//next() 放行   next('./login') 强制跳转
	let userToken = to.query.userToken
	localStorage.removeItem('notAllow')
	localStorage.removeItem('backUrl')
	//判断是手机登录还是电脑登录
	var ua = navigator.userAgent;
	var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
		isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
		isAndroid = ua.match(/(Android)\s+([\d.]+)/),
		isMobile = isIphone || isAndroid;
	if (isMobile) {
		location.href = store.state.h5Url;
	} else {
		if (typeof userToken != 'undefined' && userToken != '') {
			store.commit('changeUserToken', userToken)
		}

		if (localStorage.getItem('token') && typeof userToken != 'undefined' && userToken != '') {
			if (localStorage.getItem('isMasterAccount') == 1) {
				//主账户
				judgeBindingState(userToken)
			} else {
				//子账户
				if (localStorage.getItem('permissionButton') != null) {
					if (localStorage.getItem('permissionButton').split(',').indexOf('store-create') > -1) {
						judgeBindingState(userToken)
					}
				}
			}
		}
		if (!localStorage.getItem('token') && typeof userToken != 'undefined' && userToken != '' && !store.state.ignorePath.includes(to.path)) {
			judgeBindingState2(userToken).then(function (e) {
				if (e.type == 2) {
					//未绑定
					return next({
						path: '/login',
						query: {
							redirect: to.path,
							userToken: encodeURIComponent(userToken)
						} // 将跳转的路由path作为参数，登录成功后跳转到该路由
					})
				} else if (e.type == 1) {
					//已绑定
					return next({
						path: '/verifyPassword',
						query: {
							ava: window.btoa(e.account),//对手机号进行加密
							redirect: to.path
						} // 将跳转的路由path作为参数，登录成功后跳转到该路由
					})
				}
			})
		}
		if (!localStorage.getItem('token') && typeof userToken == 'undefined' && !store.state.ignorePath.includes(to.path)) {
			return next({
				path: '/login',
				query: { redirect: to.path } // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}

		if (to.path === '/login') {
			if (localStorage.getItem('accountNum') > 1 && !localStorage.getItem('uid')) {
				return next('/chooseAccount')
			}

			if (localStorage.getItem('token')) {
				return next('/home')
			}
			return next()
		}
		if (to.path === '/index') return next()
		if (to.path === '/passLogin') return next()
		if (to.path === '/scancode') return next()
		if (to.path === '/binding') return next()
		if (to.path === '/forgetPass') {
			if (localStorage.getItem('token')) {
				return next('/home')
			}
			return next()
		}
		if (to.path === '/verifyPassword') return next()
		if (to.path === '/workBinding') return next()
		if (to.path === '/register' || to.path === '/freeRegister' || to.path === '/regist') {
			if (localStorage.getItem('token')) {
				return next('/home')
			}
			return next()
		}
		if (to.path === '/setPass') return next()

		if (to.path === '/chooseAccount') {
			if (localStorage.getItem('accountNum')) {
				if (localStorage.getItem('uid')) {
					return next('/home')
				}

				return next()
			}

			return next('/login')
		} else {
			if (localStorage.getItem('uid')) {
				if (store.state.menuData.length > 0) {
					let link = to.path.substr(1)
					let hasPermission = false
					if (typeof store != 'undefined') {
						store.state.menuData.map((menuData) => {
							menuData.map((menuInfo) => {
								if (!hasPermission && menuInfo.link == link) {
									hasPermission = true
								}

								if (!hasPermission && menuInfo.children.length > 0) {
									menuInfo.children.map((childrenInfo) => {
										if (!hasPermission && childrenInfo.link == link) {
											hasPermission = true
										}
									})
								}
							})
						})
						if (store.state.ignorePermission.includes('/' + link)) {
							hasPermission = true
							return next()
						}

						if (!hasPermission) {
							let ignoreRDPath = ['/chooseAccount', '/login']
							if (ignoreRDPath.includes(from.path)) {
								let rLink = store.state.menuData[store.state.type][0].link.length > 0 ? store.state.menuData[store.state.type][0].link : store.state.menuData[store.state.type][0].children[0].link

								// console.log('router的rLink', rLink)
								return next('/' + rLink)
							} else {
								// message.error('无权限');
								return next(from)
							}
						}
					}
				}

				return next()
			}

			return next('/chooseAccount')
		}

		next()
	}
})

export default router
