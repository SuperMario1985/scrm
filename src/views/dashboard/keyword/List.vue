<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden">
				<!-- 左侧 -->
				<a-layout-sider>
					<!-- 公众号 -->
					<div class="sider-one" v-if="wxLen > 1">
						<div class="sider-one-txt">选择公众号</div>
						<a-select showSearch optionFilterProp="children" style="width: 200px;margin-bottom: 20px;"
						          @change="handleChange" v-model="changeBackground" v-if="wxInfo[0]">
							<template v-for="item in wxInfo">
								<a-select-option :value="item.wx_id">{{item.nick_name}}</a-select-option>
							</template>
						</a-select>
						<div class="wx-info" ref="wxInfo" style="" @mousemove="wxInfoMouseOver"
						     @mouseout="wxInfoMouseOut">
							<template v-for="(item,index) in wxInfo">
								<div @click="selectWx(item.wx_id,item.authorizer_type,item.nick_name,item.verify_type,item.service_type)"
								     class="selectWx"
								     :class="{ active:changeBackground == item.wx_id}">
									<a-avatar :src="item.head_img" shape="square"/>
									<span style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;float: right;width: calc(100% - 35px);">{{item.nick_name}}</span>
								</div>
							</template>
						</div>
					</div>
				</a-layout-sider>
				<a-layout style="position: absolute;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;"
				          :style="wxLen > 1 ? {left: '250px'} : {left: '0px'}" class="scroll">
					<!-- 头部 -->
					<a-layout-header>
						<label class="scene-title">关键词回复</label>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								当用户在公众号内发送任意文字时，如触发系统设置的关键词回复，及时推送对应设置内容，通过公众号展示给对应客户。
							</p>
							<p style="margin-bottom: 2px;">
								1）粉丝向公众号发送消息后，立即收到消息回复，含图文、图片、文字（可添加超链接）、音频、视频、小程序。</p>
							<p style="margin-bottom: 2px;">
								2）如存在两条关键词相同的回复内容，将优先推送后创建的。</p>
							<p style="margin-bottom: 0px;">
								3）<span style="color: #F56C6C;">优先级推送：关键词回复优先于收到消息回复功能，如匹配到关键词并且设置了收到消息回复，先推送关键词回复内容，再推送收到消息回复功能设置内容。</span>
							</p>
						</div>
						<div class="content-hd">
							<a-col style="float: right;">
								<a-button type="primary" icon="plus" style="width: 150px;font-size:14px;"
								          @click="replyAdd" v-has="'keyword-add'">
									创建规则
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd" v-has="'keyword-list'">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table :columns="reply.columns" :dataSource="reply.list" :pagination="false"
								         :rowClassName="rowClassName">
									<span slot="status" slot-scope="text, record,index">
										<a-switch :checked="text == 1 ? true:false"
										          :disabled="checkedFlag"
										          @click="changeStatus(record.id,text)"/>
									</span>
									<span slot="preview" slot-scope="text, record,index">
										<span style="color: #01b065; cursor: pointer;"
										      @click="preview(record.id, record.title, record.contain_keyword, record.equal_keyword)">预览</span>
									</span>
									<span slot="contain_keyword" slot-scope="text, record,index">
										<p v-if="record.contain_keyword && record.contain_keyword.length > 0"
										   style="margin-bottom: 3px;">
											<a-popover placement="left">
												<span slot="content">
													<div class="popover-content">
														<a-tag color="orange" style="margin: 3px;"
														       v-for="item in record.contain_keyword">
															{{item}}
														</a-tag>
													</div>
												</span>
												<span style="color: #01b065; cursor: pointer;">模糊匹配：{{record.contain_keyword.length}}个</span>
											</a-popover>
										</p>

										<p v-if="record.equal_keyword && record.equal_keyword.length > 0"
										   style="margin-bottom: 0px;">
											<a-popover placement="left">
												<span slot="content">
													<div class="popover-content">
														<a-tag color="pink" style="margin: 3px;"
														       v-for="item in record.equal_keyword">
															{{item}}
														</a-tag>
													</div>
												</span>
												<span style="color: #01b065; cursor: pointer;">精准匹配：{{record.equal_keyword.length}}个</span>
											</a-popover>

										</p>
									</span>
									<span slot="action" slot-scope="text, record,index">
										<a-button style="margin-right: 5px; margin-bottom: 5px;" v-has="'keyword-edit'"
										          @click="edit(record.id)">编辑</a-button>
					                    <a-button style="margin-right: 5px; margin-bottom: 5px;"
					                              v-has="'keyword-delete'"
					                              @click="deleteData(record.id)">删除</a-button>
									</span>
								</a-table>
								<!-- 分页 -->
								<div style="width: 100%;position: absolute;margin: 20px 0px; padding-bottom: 20px;"
								     v-show="reply.total > 0">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{reply.total}}</span>条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="reply.total" showSizeChanger
										              :showQuickJumper="reply.quickJumper"
										              :current="reply.page"
										              :pageSize="reply.pageSize"
										              :pageSizeOptions="['15','30','50','100']"
										              @change="changeReplyPage"
										              @showSizeChange="showReplySizeChange"/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>

		<wxModal :show="showModal" :callback="modalVisibleChange" hasName="message-add"></wxModal>

		<a-drawer
				v-if="visible"
				:destroyOnClose='true'
				:title="title"
				placement="right"
				:closable="false"
				@close="onClose"
				width="360px!important"
				:visible="visible"
		>
			<div
					style="border:1px solid #E2D6D6;margin:auto;height:100%;width:100%;background:#F5F5F5;overflow: auto;">
				<img src="../../../assets/wxHeader.png" alt
				     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
				<div class="msg_content_body">
					<div v-if="containKeyword.length > 0" style="margin-bottom: 5px;">
						模糊匹配：
						<div style="width: calc(100% - 65px);display: inline-block;vertical-align: top;">
							<a-tag color="orange" style="margin: 3px;" v-if="containKeyword.length <= 5"
							       v-for="tag in containKeyword">
								{{tag}}
							</a-tag>
							<a-popover v-if="containKeyword.length > 5" placement="left">
								<span slot="content">
									<div class="popover-content">
										<a-tag color="orange" style="margin: 3px;"
										       v-for="item in containKeyword">
											{{item}}
										</a-tag>
									</div>
								</span>
								<template v-for="(item, index) in containKeyword">
									<a-tag color="orange" v-if="index < 5" style="margin: 3px;">
										{{item}}
									</a-tag>
								</template>
								<span style="color: #01b065; cursor: pointer;">等{{containKeyword.length}}个关键词</span>
							</a-popover>
						</div>
					</div>
					<div v-if="equalKeyword.length > 0" style="margin-bottom: 5px;">
						精准匹配：
						<div style="width: calc(100% - 65px);display: inline-block;vertical-align: top;">
							<a-tag color="pink" style="margin: 3px;" v-if="equalKeyword.length <= 5"
							       v-for="tag in equalKeyword">
								{{tag}}
							</a-tag>
							<a-popover v-if="equalKeyword.length > 5" placement="left">
								<span slot="content">
									<div class="popover-content">
										<a-tag color="pink" style="margin: 3px;"
										       v-for="item in equalKeyword">
											{{item}}
										</a-tag>
									</div>
								</span>
									<template v-for="(item, index) in equalKeyword">
										<a-tag color="pink" v-if="index < 5" style="margin: 3px;">
											{{item}}
										</a-tag>
									</template>
								<span style="color: #01b065; cursor: pointer;">等{{equalKeyword.length}}个关键词</span>
							</a-popover>
						</div>
					</div>
					<template v-for="(element,index) in list">
						<!-- 图文 -->
						<div v-if="element.typeValue == 5" class="mt">
							<a-avatar
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									:size="36"
									style="object-fit: cover;margin-right: 10px;float: left;"/>
							<div style="border: 1px solid #E8E8E8;width: calc(100% - 47px);float: right;">
								<img :src="element.sketchList[0].local_path.img"
								     style="height: 145px;width: 100%;object-fit: cover;"/>
								<div class="inputTitle"
								     v-html="element.sketchList[0].inputTitle==''?'标题':element.sketchList[0].inputTitle"></div>
								<template v-for="(sketch,sketchIndex) in element.sketchList.slice(1)">
									<div class="inputTitle2">
										<p v-html="element.sketchList[sketchIndex+1].inputTitle==''?'标题':element.sketchList[sketchIndex+1].inputTitle"></p>
										<img :src="element.sketchList[sketchIndex+1].local_path.img"
										     alt=""
										     style="width: 64px;height: 64px;float: right;object-fit: cover;">
									</div>
								</template>
							</div>
						</div>
						<!-- 图片 -->
						<div v-if="element.typeValue == 2" class="mt">
							<a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
							          :size="36" style="margin-right: 10px;"/>
							<img :src="element.local_path.img" alt
							     style="width: 150px;border-radius: 4px;object-fit: cover; vertical-align: top;"/>
						</div>
						<!-- 文字 -->
						<div v-if="element.typeValue == 1" class="mt">
							<a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
							          :size="36" style="margin-right: 10px;float: left;"/>
							<span v-html="element.textAreaValueHeader"
							      class="item-info msg_content_txt"></span>
						</div>
						<!-- 音频 -->
						<div v-if="element.typeValue == 3" class="mt">
							<a-avatar
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									:size="36"
									style="object-fit: cover;margin-right: 10px;float: left;"/>
							<div class="audio">
								<div style="float: left;font-size: 16px;">{{element.file_name}}</div>
								<div class="box">
									<div class="wifi-symbol">
										<div class="wifi-circle first"></div>
										<div class="wifi-circle second"></div>
										<div class="wifi-circle third"></div>
									</div>
								</div>
							</div>
						</div>
						<!-- 视频 -->
						<div v-if="element.typeValue == 4" class="mt">
							<a-avatar
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									:size="36"
									style="object-fit: cover;margin-right: 10px;float: left;"/>
							<!-- 选中前 -->
							<a-card hoverable style="width: calc(100% - 47px);float: right;">
								<video-player class="video-player vjs-custom-skin" ref="videoPlayer"
								              :playsinline="true"
								              :options="playerOptions"></video-player>
								<a-card-meta :title="element.file_name"
								             style="height: 50px;line-height: 50px;text-align: center;">
								</a-card-meta>
							</a-card>
						</div>
						<!--小程序-->
						<div v-if="element.typeValue == 6"
						     class="mt">
							<a-avatar
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									:size="36"
									style="object-fit: cover;margin-right: 10px;float: left;"/>
							<div class="item-info msg_content_txt">
								<!--											<p class="url-title" style="color: #A3A3A3;">{{appletInputTitle}}</p>-->
								<p class="applet-title">{{element.file_name}}</p>
								<img :src="element.local_path.img" alt="" style="width: 100%;">
							</div>
						</div>
					</template>
				</div>
			</div>
		</a-drawer>
	</div>
</template>

<script>
	import wxModal from "@/components/WxModal.vue";
	import "video.js/dist/video-js.css";
	import {videoPlayer} from "vue-video-player"
	import TemplateList from "../template/List";


	export default {
		name      : "pushList",
		components: {
			TemplateList,
			wxModal, videoPlayer
		},
		data () {
			let changeBackground =
				localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				verify_service  : false,
				showTransition  : 1,
				checkedFlag     : false,
				commonUrl       : this.$store.state.commonUrl,
				isLoading       : true, //Loading 组件显示与隐藏
				wxLen           : JSON.parse(localStorage.getItem('wxArr')).length,
				wxInfo          : [], //微信公众号列表
				changeBackground: changeBackground, //选中背景色
				wxNum           : changeBackground, //传递给新建高级群发页面的微信id值
				reply           : {
					columns    : [
						{
							title    : "规则名称",
							dataIndex: "rule_name",
							width    : "180px",
							key      : "rule_name"
						},
						{
							title      : "消息内容",
							dataIndex  : "preview",
							key        : "preview",
							scopedSlots: {customRender: "preview"}
						},
						{
							title      : "关键词",
							dataIndex  : "contain_keyword",
							key        : "contain_keyword",
							scopedSlots: {customRender: "contain_keyword"}
						},
						// {
						// 	title    : "今日实际发送人数",
						// 	dataIndex: "push_num",
						// 	key      : "push_num"
						// },
						// {
						// 	title    : "累计发送人数",
						// 	dataIndex: "total_num",
						// 	key      : "total_num"
						// },
						{
							title      : "状态",
							dataIndex  : "status",
							key        : "status",
							scopedSlots: {customRender: "status"}
						},
						{
							title      : "操作",
							dataIndex  : "action",
							width      : "300px",
							key        : "action",
							scopedSlots: {customRender: "action"}
						}
					],
					list       : [
						{
							status    : 1,
							task      : 'wbw',
							message   : '汪博文',
							date      : '2019-12-09',
							perform   : '200',
							is_overdue: 0,
						}
					],
					total      : 1,
					page       : 1,
					pageSize   : 15,
					quickJumper: false,
				},
				showModal       : false,
				id              : '',
				visible         : false,
				list            : [],
				title           : "",
				containKeyword  : [],
				equalKeyword    : [],
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
			};
		},
		methods   : {
			// 公众号鼠标移入
			wxInfoMouseOver () {
				this.$refs.wxInfo.style.overflowY = "auto";
			},
			// 公众号鼠标移除
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
			// 公众号切换
			handleChange (value) {
				this.verify_service = false
				this.wxInfo.map((x) => {
					if (value == x.wx_id) {
						this.$store.commit("changeAuthorizerType", x.authorizer_type);
						this.$store.commit("changeWxNickName", x.nick_name);
						if (x.verify_type == '已认证') {
							this.verify_service = true
						}
					}
				})
				this.$store.dispatch("changeWxNum", value);
				this.isLoading = true;
				this.changeBackground = value;
				this.wxNum = value;
				this.getReply()
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			// 选择公众号
			selectWx (id, authorizer_type, nick_name, verify_type, service_type) {
				this.verify_service = false
				this.$store.dispatch("changeWxNum", id);
				this.isLoading = true;
				this.changeBackground = id;
				this.wxNum = id;
				if (verify_type == '已认证') {
					this.verify_service = true
				}
				this.$store.commit("changeAuthorizerType", authorizer_type);
				this.$store.commit("changeWxNickName", nick_name);
				this.getReply()
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			// 创建规则
			replyAdd () {
				if (this.$store.state.authorizer_type == 'unauthorized') {
					this.$success({
						title: this.$store.state.wxNickName + '已取消授权，无法操作',
					});
				} else if (this.$store.state.authorizer_type != 'unauthorized' && !this.verify_service) {
					this.$success({
						title: '仅针对认证的订阅号或服务号开放使用',
					});
				} else {
					if (this.wxInfo.length > 1) {
						this.showModal = true;
					} else {
						this.$router.push("/keyword/add");
					}
				}
			},
			// 选择公众号回调
			modalVisibleChange (event, wxNum) {
				if (event == "ok") {
					this.showModal = false;
					this.$store.dispatch("changeWxNum", wxNum);
					this.$router.push("/keyword/add");
				} else {
					this.showModal = false;
				}
			},
			// 预览
			preview (id, title, containKeyword, equalKeyword) {
				this.title = title
				this.containKeyword = JSON.parse(JSON.stringify(containKeyword))
				this.equalKeyword = JSON.parse(JSON.stringify(equalKeyword))
				this.getDetail(id)
			},
			// 预览关闭
			onClose () {
				this.containKeyword = []
				this.equalKeyword = []
				this.visible = false;
			},
			async getDetail (id) {
				const {data: res} = await this.axios.post(
					"keyword/reply-info",
					{
						id: id
					}
				)
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.lists = []
					let replyList = res.data.content.replyList
					let list = []
					for (let i = 0; i < replyList.length; i++) {
						list.push({
							typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
							typeName           : this.defaultTypeName,
							id                 : 0,
							closeShowModal3    : true,//是否选好素材
							disabled           : false,//消息类型图文能否被选
							file_name          : "", //手机上展示的素材标题
							material_id        : "", //选中的素材id
							local_path         : {
								img  : "",
								audio: ""
							}, //手机上展示的图片、音频、视频链接
							sketchList         : [{
								id                : 0,
								addSketchVisible  : true,//控制添加图文按钮显示与隐藏
								addType           : 1,//添加方式
								inputTitle        : '',//标题
								digest            : '',//图文描述
								content_source_url: '',//跳转链接
								material_id       : '',//图文消息导入的素材id
								local_path        : {
									img  : require('../../../assets/img.png'),
									audio: ""
								},
								closeShowModal3   : true,//每个图文消息是否选好素材
							}],//图文消息添加的数组
							textAreaValueHeader: "", //模板展示的内容
							emojiShow          : false, // emoji表情选择框是否显示
						})
						list[i].typeValue = replyList[i].typeValue
						if (list[i].typeValue == 5 && replyList[i].sketchList.length > 0) {
							for (let j = 0; j < replyList[i].sketchList.length; j++) {
								list[i].sketchList.push({
									id                : 0,
									addSketchVisible  : true,//控制添加图文按钮显示与隐藏
									addType           : 1,//添加方式
									inputTitle        : '',//标题
									digest            : '',//图文描述
									content_source_url: '',//跳转链接
									material_id       : '',//图文消息导入的素材id
									local_path        : {
										img  : require('../../../assets/img.png'),
										audio: ""
									},
									closeShowModal3   : true,//每个图文消息是否选好素材
								})
								list[i].sketchList[j].id = replyList[i].sketchList[j].id
								list[i].sketchList[j].addType = replyList[i].sketchList[j].addType
								list[i].sketchList[j].inputTitle = replyList[i].sketchList[j].inputTitle.replace(
									/{nickname}/g,
									'&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;')
								list[i].sketchList[j].digest = replyList[i].sketchList[j].digest
								list[i].sketchList[j].content_source_url = replyList[i].sketchList[j].content_source_url
								list[i].sketchList[j].material_id = replyList[i].sketchList[j].material_id
								list[i].sketchList[j].local_path.img = replyList[i].sketchList[j].local_path.img
								list[i].sketchList[j].local_path.audio = replyList[i].sketchList[j].local_path.audio
							}
							// console.log(this.list, '555')
							if (list[i].typeValue == 5) {
								list[i].sketchList.splice(list[i].sketchList.length - 1, 1)
							}
						} else {
							list[i].id = replyList[i].id
							list[i].file_name = replyList[i].file_name
							list[i].material_id = replyList[i].material_id
							list[i].local_path.img = replyList[i].local_path.img
							list[i].local_path.audio = replyList[i].local_path.audio
							list[i].textAreaValueHeader = replyList[i].textAreaValueHeader.replace(
								/{nickname}/g,
								'&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;'
							).replace(/\n/g, "<br/>")
						}
						if (list[i].typeValue == 6) {
							list[i].local_path.img = replyList[i].local_path
						}
					}
					this.list = list
					this.visible = true
				}
			}
			,

			// 推送日志
			pushLog (id) {
				this.getPushLog(id)
				this.id = id
			},
			// 编辑
			edit (id) {
				this.$router.push({path: "/keyword/add", query: {id: id}});
			},
			// 复制
			// copy (id) {
			// },
			changeReplyPage (page, pageSize) {
				this.isLoading = true
				this.reply.page = page
				this.getReply()
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 160)
				})
			},
			showReplySizeChange (page, pageSize) {
				this.isLoading = true
				this.reply.pageSize = pageSize
				let maxPage = Math.ceil(this.reply.total / pageSize)
				if (this.reply.page > maxPage) {
					this.reply.page = maxPage
				}
				if (this.reply.page > maxPage) {
					this.reply.page = maxPage
				}
				this.getReply()
			},

			// 获取规则列表
			async getReply () {
				let that = this
				let params = {
					wx_id   : localStorage.getItem('wxNum'),
					page    : that.reply.page,
					pageSize: that.reply.pageSize
				}
				const {data: res} = await this.axios.post("keyword/list", params);
				if (res.error != 0) {
					that.$message.destroy()
					that.$message.error(res.error_msg);
				} else {
					this.reply.list = res.data.data
					this.reply.total = parseInt(res.data.count) || 0
					this.isLoading = false
				}
			},
			// 删除规则
			deleteData (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该规则?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.deleteReply(id)
						// that.isLoading = true
						// that.getReply()
					}
				});

			},
			async deleteReply (id) {
				let that = this
				let params = {
					id: id
				}
				const {data: res} = await this.axios.post("keyword/delete", params);
				if (res.error != 0) {
					that.$message.destroy()
					that.$message.error(res.error_msg);
				} else {
					that.$message.destroy()
					that.$message.success("删除成功！");
					if (that.reply.list.length == 1 && that.reply.page > 1) {
						that.reply.page = that.reply.page - 1
					}
					that.getReply(that.reply.page, that.reply.pageSize)
				}

			},
			// 改变规则状态
			changeStatus (id, status) {
				status = (parseInt(status) + 1) % 2
				this.changeReplyStatus(id, status)
			},
			// 开启/关闭规则
			async changeReplyStatus (id, status) {
				let that = this
				let params = {
					id    : id,
					status: status
				}
				const {data: res} = await this.axios.post("keyword/keyword-status", params);
				if (res.error != 0) {
					that.$message.destroy()
					that.$message.error(res.error_msg);
				} else {
					that.$message.destroy()
					that.$message.success("操作成功！");
					that.getReply(this.reply.page, this.reply.pageSize)
				}
			}
		},
		mounted () {
			this.$store.dispatch("getWx", info => {
				this.wxInfo = info;
				if (!this.changeBackground && this.wxInfo.length > 0) {
					this.changeBackground = this.$store.state.wxNum;
					this.wxNum = this.$store.state.wxNum;
				}
				this.wxInfo.map((x) => {
					if (x.wx_id == this.changeBackground) {
						if (x.verify_type == '已认证') {
							this.verify_service = true
						}
					}
				})
				if (localStorage.getItem('isMasterAccount') == 2) {
					//子账户
					if (localStorage.getItem('permissionButton') != null) {
						if (localStorage.getItem('permissionButton').split(',').indexOf('keyword-status') > -1) {
							this.checkedFlag = false
						} else {
							this.checkedFlag = true
						}
					}
				}
				this.getReply()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/keyword/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getReply(vm.page, vm.pageSize)
				});
			} else if (from.path == '/keyword/add' && (typeof to.query.isRefresh == 'undefined' || '1' != to.query.isRefresh) || from.path != '/keyword/add') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.reply.page = 1
					vm.reply.pageSize = 15
					vm.getReply()
				});
			}
			next(vm => {
				vm.isLoading = true
				vm.getReply()
			})
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		width: 100%;
		padding-right: 40px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}

	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
	}

	.list {
		margin-left: 16px;
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

	.scene-title {
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

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		min-width: 885px;
		width: 100%;
		border: 1px solid rgba(0, 0, 0, 0.05);
	}

	/deep/ .ant-table-thead > tr > th, /deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid rgba(0, 0, 0, 0.02) !important;
	}

	/deep/ .ant-table table {
		box-shadow: none !important;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 15px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}
</style>

<style>
	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
	}

	.msg_content_txt {
		width: calc(100% - 46px);
		border: 1px solid #E9E9E9;
		padding: 10px 16px;
		border-radius: 4px;
		font-size: 14px;
		color: #1A1A1A;
		background: #FFF;
		float: left;
	}

	.audio {
		float: right;
		width: calc(100% - 47px);
		height: 65px;
		padding: 10px 20px;
		background: #FFF;
	}

	.box {
		float: right;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
		border: 2px solid #01b065;
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
		border: 2px solid #01b065;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 5px;
		height: 5px;
		background: #01b065;
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

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	.inputTitle {
		height: 30px;
		line-height: 30px;
		background: #0F0F0F;
		opacity: 0.3;
		color: #FFF;
		padding: 0 10px;
		margin-top: -30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.inputTitle p {
		display: inline-block;
	}

	.inputTitle2 {
		background: #FFF;
		height: 104px;
		padding: 20px;
	}

	.inputTitle2 p {
		word-break: break-word;
		width: calc(100% - 74px);
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		float: left;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	.popover-content {
		max-width: 500px;
		max-height: 200px;
		overflow-y: auto;
	}
</style>