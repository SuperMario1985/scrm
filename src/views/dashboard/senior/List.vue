<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden">
				<!-- 左侧 -->
				<a-layout-sider v-if="wxLen > 1">
					<!-- 公众号 -->
					<div class="sider-one">
						<div class="sider-one-txt">选择公众号</div>
						<a-select
								showSearch
								optionFilterProp="children"
								style="width: 200px;margin-bottom: 20px;"
								@change="handleChange"
								v-model="changeBackground"
								v-if="wxInfo[0]"
						>
							<template v-for="item in wxInfo">
								<a-select-option :value="item.wx_id">{{item.nick_name}}</a-select-option>
							</template>
						</a-select>
						<div class="wx-info" ref="wxInfo" style="" @mousemove="wxInfoMouseOver"
						     @mouseout="wxInfoMouseOut">
							<template v-for="(item,index) in wxInfo">
								<div
										@click="selectWx(item.wx_id,item.authorizer_type,item.nick_name,item.verify_type)"
										class="selectWx"
										:class="{ active:changeBackground == item.wx_id}"
								>
									<a-avatar :src="item.head_img" shape="square"/>
									<span style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;float: right;width: calc(100% - 35px);">{{item.nick_name}}</span>
								</div>
							</template>
						</div>
					</div>
				</a-layout-sider>
				<a-layout
						style="position: absolute;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;"
						:style="wxLen > 1 ? {left: '250px'} : {left: '0px'}"
						class="scroll"
				>
					<!-- 头部 -->
					<a-layout-header>
						<label class="senior-title">高级群发</label>
						<div class="help"
						     :class="showTransition == 0 ?'help-transition': (showTransition== 1 ? 'help-transition1' : '')">
							<a href="https://support.qq.com/products/104790/faqs/57055"
							   target="_blank">
								<a-icon type="question-circle" class="help-icon"/>
								<span style="float:right;">点我帮助</span>
							</a>
						</div>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								1、对于认证服务号，每日可高级群发的次数最多100次，可针对所有粉丝、某单/多标签粉丝以及指定粉丝（需至少2个粉丝）进行群发，群发限制为每个粉丝一个月内最多收到 4
								条群发消息（且与公众平台同步）。</p>
							<p style="margin-bottom: 0;">2、对于认证订阅号，每日可群发一次，可选择发送全部粉丝或某个标签，但不支持对指定粉丝发送群发消息。</p>
						</div>
						<div class="content-hd">
							<a-col style="float:left;">
								<a-select
										style="width: 174px;margin-right:15px;"
										@change="changeStatus"
										v-model="status"
								>
									<a-select-option value="-1">全部状态</a-select-option>
									<a-select-option value="0">未发送</a-select-option>
									<a-select-option value="1">已发送</a-select-option>
									<a-select-option value="2">发送失败</a-select-option>
								</a-select>
								<a-date-picker @change="changeDate" style="margin-right: 15px;" v-model="date"/>
								<a-select
										showSearch
										optionFilterProp="children"
										allowClear
										style="width: 174px;margin-right: 15px;"
										@change="changeMsgTitle"
										placeholder="请选择消息名称"
										:filterOption="filterOption"
										v-model="title"
								>
									<template v-for="item in dataSource">
										<a-select-option :value="item">{{item}}</a-select-option>
									</template>
								</a-select>
								<a-button type="primary" style="margin-right:15px;" @click="find">查找</a-button>
								<a-button @click="clear">清空</a-button>
							</a-col>
							<a-col style="float:right;">
								<a-button
										type="primary"
										icon="plus"
										style="width: 150px;font-size:14px;"
										@click="add" v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
										v-has="'senior-send-add'"
								>新建高级群发
								</a-button>
								<a-button
										type="primary"
										icon="plus"
										style="width: 150px;font-size:14px;"
										@click="showConfirmWx" v-if="$store.state.authorizer_type == 'unauthorized' || !verify_service"
										v-has="'senior-send-add'"
								>新建高级群发
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="seniorList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'senior-send-list'">
                  <span slot="status" slot-scope="text, record">
                    <a-tooltip>
                      <template slot="title">{{record.error_msg}}</template>
                      <span style="color: red;" v-if="record.status=='发送失败'">{{record.status}}</span>
                    </a-tooltip>
                    <span v-if="record.status!='发送失败'">{{record.status}}</span>
                  </span>
									<span slot="action" slot-scope="text, record,index">
                    <template v-if="record.status=='未发送'">
                      <!-- <a-button style="margin-right: 10px;" @click="edit(record.id)">修改</a-button> -->
                      <a-button style="margin: 0px 5px 5px 0px;" @click="detail(index)"
                                v-has="'senior-send-info'">详情</a-button>
                      <a-button @click="deleteList(record.id)" style="margin: 0px 5px 5px 0px;"
                                v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
                                v-has="'senior-send-delete'">删除</a-button>
                      <a-button @click="showConfirmWx" style="margin: 0px 5px 5px 0px;"
                                v-if="$store.state.authorizer_type == 'unauthorized' || !verify_service"
                                v-has="'senior-send-delete'">删除</a-button>
                    </template>
                    <template v-if="record.status=='已发送'">
                      <a-button style="margin: 0px 5px 5px 0px;" @click="detail(index)"
                                v-has="'senior-send-info'">详情</a-button>
                    </template>
                    <template v-if="record.status=='发送失败'">
                      <a-button style="margin: 0px 5px 5px 0px;" @click="detail(index)"
                                v-has="'senior-send-info'">详情</a-button>
                      <a-button @click="deleteList(record.id)" style="margin: 0px 5px 5px 0px;"
                                v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
                                v-has="'senior-send-delete'">删除</a-button>
                      <a-button @click="showConfirmWx" style="margin: 0px 5px 5px 0px;"
                                v-if="$store.state.authorizer_type == 'unauthorized' || !verify_service"
                                v-has="'senior-send-delete'">删除</a-button>
                    </template>
                  </span>
								</a-table>
								<!-- 分页 -->
								<div style="width: 100%;position: absolute;margin-top: 20px;margin-bottom: 20px;"
								     v-if="total > 0" v-has="'senior-send-list'">
									<div style="height: 32px;float: left;line-height: 32px;">
										共有
										<span style="color: blue">{{total}}</span>条消息
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination
												:total="total"
												showSizeChanger
												:showQuickJumper="quickJumper"
												:current="page"
												:pageSize="pageSize"
												:pageSizeOptions="['15','30','50','100']"
												@change="changePage"
												@showSizeChange="showSizeChange"
										/>
									</div>
								</div>
								<!-- 详情页面 -->
								<a-drawer placement="right" :closable="false" @close="onClose" :visible="visible">
									<a-tabs defaultActiveKey="1">
										<a-tab-pane tab="消息内容" key="1">
											<div class="msg_content">
												<img src="../../../assets/wxHeader.png" alt class="msg_content_header"/>
												<div style="padding: 20px 15px;">
													<!-- 文本 -->
													<div v-if="msg_type == 1">
														<a-avatar
																src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
																:size="36"
														/>
														<span class="msg_content_txt" v-html="content"></span>
													</div>
													<!-- 图片 -->
													<div v-else-if="msg_type == 2">
														<img :src="commonUrl+local_path" alt
														     style="width: 100%;object-fit: cover;"/>
													</div>
													<!-- 音频 -->
													<div v-else-if="msg_type == 3">
														<a-card hoverable style="height: 150px;">
															<div class="audio">
																<div style="float: left;">{{materialTitle}}</div>
																<div class="box" v-show="isPlayMusic"
																     @click="playMusic">
																	<div class="wifi-symbol">
																		<div class="wifi-circle first"></div>
																		<div class="wifi-circle second"></div>
																		<div class="wifi-circle third"></div>
																	</div>
																	<audio ref="audio">
																		<source :src="commonUrl+local_path"
																		        type="audio/mpeg"/>
																	</audio>
																</div>
																<div class="box" v-show="isPlayMusic2">
																	<div class="wifi-symbol">
																		<div class="wifi-circle first"></div>
																		<div class="wifi-circle second1"></div>
																		<div class="wifi-circle third1"></div>
																	</div>
																</div>
															</div>
														</a-card>
													</div>
													<!-- 视频 -->
													<div v-else-if="msg_type == 4">
														<video-player
																class="video-player vjs-custom-skin"
																ref="videoPlayer"
																:playsinline="true"
																:options="playerOptions"
														></video-player>
													</div>
													<!-- 图文 -->
													<div v-else>
														<!-- 多图文 -->
														<div v-if="artList.length > 1?true:false">
															<a-card hoverable>
																<template v-for="(art, artIndex) in artList">
																	<template v-if="artIndex == 0">
																		<div
																				style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -30px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
																		>{{art.title}}
																		</div>
																		<img alt="example" style="object-fit: cover;"
																		     :src="commonUrl+art.local_path"
																		     slot="cover"/>
																	</template>
																	<template v-if="artIndex != 0">
																		<a-card-meta
																				:title="art.title"
																				style="margin: 0;padding: 20px;"
																		>
																			<a-avatar
																					style="object-fit: cover;"
																					slot="avatar"
																					shape="square"
																					:size="64"
																					:src="commonUrl+art.local_path"
																			/>
																		</a-card-meta>
																	</template>
																</template>
															</a-card>
														</div>
														<!-- 单图文 -->
														<div v-else>
															<a-card hoverable>
																<img
																		alt="example"
																		:src="commonUrl+artList[0].local_path"
																		slot="cover"
																		style="object-fit: cover;"
																/>
																<div
																		style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -30px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
																>{{artList[0].title}}
																</div>
															</a-card>
														</div>
													</div>
												</div>
											</div>
										</a-tab-pane>
									</a-tabs>
								</a-drawer>
							</a-spin>
						</div>
					</a-layout-content>
					<!-- 选择公众号弹窗 -->
					<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="senior-send-add"></wxModal>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import {videoPlayer} from "vue-video-player";
	import "video.js/dist/video-js.css";
	import wxModal from "@/components/WxModal.vue";

	const columns = [
		{
			title    : "消息名称",
			dataIndex: "msg_title",
			key      : "msg_title",
			width    : "180px"
		},
		{
			title    : "消息类型",
			dataIndex: "type_name",
			key      : "type_name"
		},
		{
			title    : "发送对象",
			dataIndex: "send_people",
			key      : "send_people"
		},
		{
			title    : "发送时间",
			dataIndex: "push_time",
			key      : "push_time"
		},
		{
			title    : "预估人数",
			dataIndex: "target_num",
			key      : "target_num"
		},
		{
			title    : "送达人数",
			dataIndex: "fans_num",
			key      : "fans_num"
		},
		{
			title      : "发送状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			width      : "18%",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "seniorList",
		components: {
			videoPlayer,
			wxModal
		},
		data () {
			let changeBackground =
				localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				showTransition  : 1,
				isLoading       : false, //Loading 组件显示与隐藏
				wxLen           : JSON.parse(localStorage.getItem('wxArr')).length,
				wxInfo          : [], //微信公众号列表
				verify_service  : false,
				changeBackground: changeBackground, //选中背景色
				status          : '-1', //状态,-1全部 0未发送 1已发送 2发送失败
				date            : null,
				push_time       : "", //发送日期
				//表格部分
				columns,
				seniorList      : [], //表格信息
				dataSource      : [], //消息名称数组
				title           : [], //消息名称
				visible         : false, //详情抽屉的显示与隐藏
				content         : "", //文本详情
				local_path      : "", //图片，语音，视频详情
				artList         : [], //图文
				msg_type        : 1, //类型，1：文本、2：图片、3：语音、4：视频、5：图文
				isPlayMusic     : true, //音频小喇叭的显示与隐藏
				isPlayMusic2    : false, //动态音频小喇叭的显示与隐藏
				playerOptions   : {
					playbackRates      : [0.7, 1.0, 1.5, 2.0], //播放速度
					autoplay           : false, //如果true,浏览器准备好时开始回放。
					muted              : false, // 默认情况下将会消除任何音频。
					loop               : false, // 导致视频一结束就重新开始。
					preload            : "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language           : "zh-CN",
					aspectRatio        : "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid              : true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
					controlBar         : {
						timeDivider         : true,
						durationDisplay     : true,
						remainingTimeDisplay: false,
						fullscreenToggle    : true //全屏按钮
					}
				},
				seniorId        : "", //素材的id
				wxNum           : changeBackground, //传递给新建高级群发页面的微信id值
				//分页
				page            : 1, //页数
				pageSize        : 15, //每页个数
				total           : 0, //总条数
				quickJumper     : false, // 是否显示快速跳转的控件
				commonUrl       : this.$store.state.commonUrl, //公共的链接
				showModal2      : false, //公众号组件弹窗显示与隐藏
				materialTitle   : '',//素材名称
			};
		},

		methods: {
			initHelp () {
				let that = this
				setInterval(function () {
					that.showTransition = (that.showTransition + 1) % 5;
				}, 1000)
			},
			wxInfoMouseOver () {
				this.$refs.wxInfo.style.overflowY = "auto";
			},
			wxInfoMouseOut () {
				this.$refs.wxInfo.style.overflowY = "hidden";
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 公众号
			handleChange (value) {
				this.wxInfo.map((x) => {
					if (value == x.wx_id) {
						this.$store.commit("changeAuthorizerType", x.authorizer_type)
						this.$store.commit("changeWxNickName", x.nick_name)
						if (x.verify_type == '已认证') {
							this.verify_service = true
						}
					}
				})
				this.$store.dispatch("changeWxNum", value);
				this.isLoading = true;
				this.changeBackground = value;
				this.wxNum = value;
				this.getSeniorList();
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			selectWx (id, authorizer_type, nick_name, verify_type) {
				this.verify_service = false
				if (verify_type == '已认证') {
					this.verify_service = true
				}
				this.$store.dispatch("changeWxNum", id);
				this.isLoading = true;
				this.changeBackground = id;
				this.wxNum = id;
				this.$store.commit("changeAuthorizerType", authorizer_type);
				this.$store.commit("changeWxNickName", nick_name);
				this.getSeniorList();
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			showConfirmWx () {
				if(this.$store.state.authorizer_type == 'unauthorized') {
					this.$success({
						title: this.$store.state.wxNickName + '已取消授权，无法操作',
					});
				} else {
					this.$success({
						title: '仅针对认证的订阅号或服务号开放使用',
					});
					return false
				}
			},
			//选择状态
			changeStatus (value) {
				this.status = value;
			},
			//选择日期
			changeDate (date, dateString) {
				this.push_time = dateString;
			},
			//选择消息名称
			changeMsgTitle (value) {
				this.title = value;
			},
			filterOption (input, option) {
				return (
					option.componentOptions.children[0].text
						.toLowerCase()
						.indexOf(input.toLowerCase()) >= 0
				);
			},
			//点击搜索
			find () {
				this.isLoading = true;
				this.getSeniorList();
			},
			//点击清空
			clear () {
				this.isLoading = true;
				location.reload();
			},
			//获取高级群发列表
			async getSeniorList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				this.wxInfo = this.$store.state.wxArr;
				const {data: res} = await this.axios.post("high-level-push-msg/list", {
					wx_id:localStorage.getItem('wxNum'),
					status   : this.status,
					push_time: this.push_time,
					title    : this.title,
					page     : page,
					pageSize : pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.seniorList = res.data.highLevel;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
				// console.log(this.seniorList)
			},
			//详情预览
			async previewMsg (index) {
				const {data: res} = await this.axios.post("high-level-push-msg/info", {
					id: this.seniorList[index].id
				});
				// console.log(res)
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.msg_type = res.data.msg_type;
					this.isLoading = false;
					if (res.data.msg_type == 1) {
						this.content = res.data.content.replace(/\n/g, '<br>');
					} else if (res.data.msg_type == 5) {
						this.artList = res.data.artList;
					} else if (res.data.msg_type == 4) {
						this.playerOptions["sources"] = [
							{
								src : this.commonUrl + res.data.local_path, // 路径
								type: "video/mp4" // 类型
							}
						];
						this.materialTitle = res.data.title
					} else {
						this.local_path = res.data.local_path;
						this.materialTitle = res.data.title
					}
				}
			},
			//修改
			edit (id) {
				// console.log('修改',id)
				this.$router.push({path: "/senior/add", query: {id: id}});
			},
			//详情
			detail (index) {
				this.previewMsg(index);
				this.visible = true;
			},
			onClose () {
				this.visible = false;
			},
			//删除
			deleteList (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该消息?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.delSenior(id);
					}
				});
			},
			async delSenior (id) {
				const {data: res} = await this.axios.post(
					"high-level-push-msg/delete",
					{
						id: id
					}
				);
				// console.log(res);
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg)
				} else {
					if(this.seniorList.length == 1 && this.page > 1) {
						this.getSeniorList(this.page - 1, this.pageSize)
					} else {
						this.getSeniorList(this.page, this.pageSize)
					}
				}
			},
			//播放音频
			playMusic () {
				this.isPlayMusic = false;
				this.isPlayMusic2 = true;
				this.$refs.audio.play();
				var t1 = setInterval(() => {
					// console.log(this.$refs.audio[index].paused);
					if (this.$refs.audio.paused) {
						clearInterval(t1);
						this.isPlayMusic = true;
						this.isPlayMusic2 = false;
					}
				}, 1000);
			},
			//新建群发
			add () {
				if (this.wxInfo.length > 1) {
					this.showModal2 = true;
				} else {
					this.$router.push("/senior/add");
				}
			},
			modalVisibleChange (event) {
				// console.log('event', event);
				if (event == "ok") {
					this.showModal2 = false;
					this.$router.push("/senior/add");
				} else {
					this.showModal2 = false;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getSeniorList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,90)
				})
			},
			showSizeChange (page, pageSize) {
				this.getSeniorList(1, pageSize);
			},
			async getTitles () {
				const {data: res} = await this.axios.post(
					"high-level-push-msg/get-title",
					{
						wx_id:localStorage.getItem('wxNum')
					}
				);
				// console.log(res)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.dataSource = res.data
				}
			}
		},

		created () {
			// console.log(this.$store.state.wxArr,222)
			this.$store.dispatch("getWx", info => {
				this.wxInfo = info;
				if (!this.changeBackground && this.wxInfo.length > 0) {
					this.changeBackground = this.$store.state.wxNum;
					this.wxNum = this.$store.state.wxNum;
				}
				this.verify_service = this.wxInfo[this.$store.state.wxNumIndex].verify_type === '已认证';
			});
			this.initHelp()
			this.getSeniorList();
			this.getTitles()
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path != '/senior/add' || typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.status = "-1"
					vm.push_time = ''
					vm.title = []
					vm.date = null
					vm.page = 1
					vm.pageSize = 15
					vm.getSeniorList()
				});
			}

			next()
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.senior-title {
		/*float: left;*/
		font-size: 16px;
		vertical-align: top;
	}

	.wx-info {
		width: 100%;
		position: absolute;
		left: 0;
		top: 100px;
		bottom: 0;
		overflow: hidden;
	}

	.wx-info::-webkit-scrollbar {
		width: 2px;
		height: 100%;
	}

	.wx-info::-webkit-scrollbar-track-piece {
		background-color: #FFFFFF;
	}

	.wx-info::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #FFFFFF;
	}

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
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

	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
		border-right: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.sider-one {
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.selectWx {
		width: 200px;
		margin-left: 20px;
		/*margin: auto;*/
		height: 50px;
		line-height: 50px;
		cursor: pointer;
		padding-left: 10px;
	}

	.active {
		background: #1E90FF;
		color: white;
	}

	.msg_content {
		border: 1px solid #E2D6D6;
		height: 100%;
		width: 420px;
		margin: auto;
		overflow-y: auto;

		.msg_content_header {
			width: 100%;
		}
	}

	.msg_content_txt {
		float: right;
		width: 340px;
		border: 1px solid #E2D6D6;
		line-height: 21px;
		padding: 15px;
		overflow-wrap: break-word;
		hyphens: auto;
	}

	.audio {
		width: 100%;
		height: 50px;
		padding: 50px 20px;
	}

	.box {
		float: right;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
		border: 2px solid #1890FF;
	}

	.wifi-symbol {
		width: 30px;
		height: 30px;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(135deg);
		position: absolute;
		left: 13px;
		top: 6px;
	}

	.wifi-circle {
		border: 2px solid #1890FF;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 5px;
		height: 5px;
		background: #1890FF;
		top: 25px;
		left: 25px;
	}

	.second {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
	}

	.third {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
	}

	.second1 {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
		animation: fadeInOut 1s infinite 0.2s;
	}

	.third1 {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
		animation: fadeInOut 1s infinite 0.4s;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	/deep/ .ant-card-meta-detail {
		line-height: 64px;
	}

	/deep/ .ant-card-meta-avatar {
		float: right;
		padding-right: 0;
	}

	/deep/ .ant-card-meta-title {
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.help {
		/*float: left;*/
		display: inline-block;
		margin-left: 18px;
		margin-top: 3px;
	}

	.help-icon {
		margin-right: 5px;
		font-size: 14px;
		margin-top: 4px;
	}

	.help-transition {
		animation: help 1s infinite;
	}

	.help a {
		font-size: 14px;
	}

	.help a:link {
		color: #1890FF;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.help a:visited {
		color: #1890FF;
		text-decoration: none;
	}

	//已访问：紫色、无下划线
	.help-transition1 {
		animation: help1 1s infinite;
	}

	@keyframes help {
		0% {
			transform: translate(0px, 0px);
		}
		50% {
			transform: translate(0px, -8px);
		}
		100% {
			transform: translate(0px, 3px);
		}
	}

	@keyframes help1 {
		0% {
			transform: translate(0px, 3px);
		}
		50% {
			transform: translate(0px, -4px);
		}
		100% {
			transform: translate(0px, 0px);
		}
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

</style>
<!-- <style lang='less'>
    /deep/.ant-modal {
        width: 880px !important;
    }
</style> -->