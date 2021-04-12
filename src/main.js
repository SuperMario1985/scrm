import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { message} from 'ant-design-vue'
import './plugins/ant-design-vue.js'
//引入图片懒加载
import VueLazyLoad from 'vue-lazyload'
import png from './assets/fish.gif'
import png2 from './assets/img.png'
import './common/css/tailwind.css'

Vue.use(VueLazyLoad, {
	error  : png2,
	loading: png
})
Vue.prototype.$message = message;

message.config({
	duration: 2,// 持续时间

	maxCount: 1 // 最大显示数, 超过限制时，最早的消息会被自动关闭
});
// 引入perfect-scroller
import PerfectScrollbar from "perfect-scrollbar"
// 引入perfect-scroller的css文件
import "perfect-scrollbar/css/perfect-scrollbar.css"

//引入全局变量 js
import Global from './common/js/global.js'
// 引入websocket js
import websocket from './common/js/websocket.js';
//引入公共css
import './common/css/main.css'
//引入公共js
import Utils from './common/js/utils.js'
//js 库
import Test from './common/js/test.js'
//引入瀑布流插件
import waterfall from 'vue-waterfall2'

Vue.use(waterfall)
//引入复制内容到剪贴板
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
// 全局参数配置
Vue.prototype.global = Global
// 全局参数配置
Vue.prototype.ws = websocket

//注册公共js
Vue.prototype.utils = Utils;
Vue.prototype.$test = Test;

Vue.prototype.axios = axios


axios.defaults.baseURL = store.state.commonUrl + '/api/'
//需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
axios.interceptors.request.use(config => {
	// console.log(config)
	if (localStorage.getItem('token')) {
		config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
	}


	if (store.state.ignorePath.includes(router.currentRoute.path) && (config.url == store.state.getAuthorizeInfoUrl)) {
		return Promise.reject('请求被拒绝！');
	}

	if (typeof (config.data) == 'undefined') {
		config.data = {};
	}
	return config
})

axios.interceptors.response.use(function (response) {
	if (response.data.error == 401) {
		if (localStorage.length > 0) {
			let keyIndex = 0
			const localLength = localStorage.length
			for (let i = 0; i < localLength; i++) {
				let localKey = localStorage.key(keyIndex);

				// console.log(localKey, 'localKey');
				if (localKey !== 'session_id') {
					localStorage.removeItem(localKey);
				} else {
					keyIndex++
				}
			}
		}

		response.data.error_msg = '登录超时！';

		router.push('/login');

		return Promise.reject(response.data.error_msg);
	}

	return response;
}, function (error) {
	if (typeof (error.retry_config) == 'undefined') {
		return Promise.reject(error);
	} else {
		let config = error.retry_config;
		var backoff = new Promise(function (resolve) {
			setTimeout(function () {
				resolve();
			}, 100);
		});

		return backoff.then(function () {
			return axios(config)
		});
	}
});

Vue.config.productionTip = false

//过滤器，让时间转换为正确格式
Vue.filter('dateFormat', function (time) {
	var minutes = parseInt(time / 60);
	var second = parseInt(time % 60);
	let m = (minutes < 10 ? '0' + minutes : minutes);
	let s = (second < 10 ? '0' + second : second);
	if (isNaN(m) || isNaN(s)) {
		m = '--'
		s = '--'
	}
	return `${m}:${s}`
})

/**
 * @description 自动判断是应该更新PerfectScrollbar还是创建它
 * @param {HTMLElement} el - 必填。dom元素
 * @param options
 * @param events
 */
const el_scrollBar = (el, options, events) => {
	//在元素上加上私有属性，但要确保不会和已有属性重复
	if (el._ps_ instanceof PerfectScrollbar) {
		for (let option in options) {
			el._ps_.settings[option] = options[option]
		}

		el._ps_.update();
	} else {
		//el上挂一份属性
		el._ps_ = new PerfectScrollbar(el, {...options});

		for (let event in events) {
			if (event.indexOf('ps-') === 0) {
				el.addEventListener(event, events[event]);
			}
		}
	}
};

// import {Spin} from "ant-design-vue";
//
// Spin.setDefaultIndicator({
// 	indicator: h => h('img', {
// 		attrs: {
// 			src: png
// 		},
// 		style: {
// 			width : '80px',
// 			height: '80px',
// 			marginTop: '-50px',
// 			marginLeft: '-40px',
// 		}
// 	}),
// });

// 自定义Vue指令
Vue.directive("perfectScrollBar", {
	//使用inserted钩子函数（初次创建DOM）获取使用自定义指令处的dom
	inserted (el, binding, vnode) {
		//判断其样式是否存在position 并且position为"fixed", "absolute"或"relative"
		//如果不符合条件，抛个警告然顺便给其position自动加上"relative"，因为PerfectScrollbar实现原理就是对dom注入两个div，一个是x轴一个是y轴，他们两的position都是absolute。
		const rules = ["fixed", "absolute", "relative"];
		if (!rules.includes(window.getComputedStyle(el, null).position)) {
			console.warn(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}`);
			el.style.position = 'relative';
		}
		//el上挂上私有属性
		el_scrollBar(el, binding.value, vnode.componentOptions.listeners);
	},
	//更新DOM的时候
	componentUpdated (el, binding, vnode, oldVnode) {
		try {
			//vnode.context其实就是vue实例，这里其实无需实例也可直接用Vue的静态方法，故而也可以写成Vue.nextTick
			vnode.context.$nextTick(
				() => {
					el_scrollBar(el, binding.value, vnode.componentOptions.listeners);
				}
			)
		} catch (error) {
			console.error(error);
			el_scrollBar(el, binding.value, vnode.componentOptions.listeners);
		}
	}
})
/**
 * 判断是否具有权限，当没有权限时，自动清除DOM元素
 * @param {HTMLElement} el
 * @param {DirectiveBinding} binding
 * @param {VNode} vnode
 */
const hasFunction = (el, binding, vnode) => {
	let hasPermission = false;

	Promise.all([permissionJudge(binding.value)]).then(res => {
		if (!hasPermission) {
			vnode.context.$nextTick(() => {
				if (el.parentNode != null && el.parentNode.removeChild != null && typeof el.parentNode.removeChild == 'function') {
					el.parentNode.removeChild(el)
				}
			})
		}
	}).catch(e => {
	})

	function permissionJudge (value) {
		vnode.context.$nextTick(() => {
			// 此处store.state.permissionButton代表vuex中储存的权限按钮数据
			if (localStorage.getItem('permissionButton') != null && localStorage.getItem('permissionButton') != '') {
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.length == 1 && list[0] === "all") {
					hasPermission = true
					return
				}

				for (let item of list) {
					if (item === value) {
						hasPermission = true
						return
					}
				}

				hasPermission = false
				return
			}
		})
	}
}
Vue.directive('has', {
	inserted (el, binding, vnode) {
		hasFunction(el, binding, vnode)
	},
	//更新DOM的时候
	componentUpdated (el, binding, vnode, oldVnode) {
		hasFunction(el, binding, vnode)
	}
});
const hasMore2oneFunction = (el, binding, vnode) => {
	let hasPermission = false

	Promise.all([permissionJudge(binding.value)]).then(res => {
		if (!hasPermission) {
			vnode.context.$nextTick(() => {
				if (el.parentNode != null && el.parentNode.removeChild != null && typeof el.parentNode.removeChild == 'function') {
					el.parentNode.removeChild(el)
				}
			})
		}
	}).catch(e => {
	})

	function permissionJudge (value) {
		vnode.context.$nextTick(() => {
			// 此处store.state.permissionButton代表vuex中储存的权限按钮数据
			if (localStorage.getItem('permissionButton') != null && localStorage.getItem('permissionButton') != '') {
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.length == 1 && list[0] === "all") {
					hasPermission = true
					return
				}
				//多个权限有一个就返回true
				let val = []
				if (value.indexOf(',') != -1) {
					val = value.split(",")
				}
				for (let item of list) {
					if (val.length > 1) {
						for (let v of val) {
							if (item === v) {
								hasPermission = true
								return
							}
						}
					} else {
						if (item === value) {
							hasPermission = true
							return
						}
					}
				}

				hasPermission = false
				return
			}
		})
	}
}
Vue.directive('hasMore2one', {
	inserted (el, binding, vnode) {
		hasMore2oneFunction(el, binding, vnode)
	},
	//更新DOM的时候
	componentUpdated (el, binding, vnode, oldVnode) {
		hasMore2oneFunction(el, binding, vnode)
	}
});

new Vue({
	router,
	store,
	VueAxios,
	axios,
	render: h => h(App)
}).$mount('#app')
