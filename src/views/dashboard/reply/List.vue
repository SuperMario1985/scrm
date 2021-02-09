<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;height: 100%; overflow: hidden">
				<!-- 左侧 -->
				<a-layout-sider v-if="wxLen > 1">
					<!-- 公众号 -->
					<div class="sider-one">
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
				          :style="wxLen > 1 ? {left: '250px'} : {left: '0px'}"
				          class="scroll">
					<!-- 头部 -->
					<a-layout-header>
						<label class="scene-title">关注回复</label>
						<div class="help"
						     :class="showTransition == 0 ?'help-transition': (showTransition== 1 ? 'help-transition1' : '')">
							<a href="https://support.qq.com/products/104790/faqs/58001"
							   target="_blank">
								<a-icon type="question-circle" class="help-icon"/>
								<span style="float:right;">点我帮助</span>
							</a>
						</div>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							<p style="margin-bottom: 2px;">每新关注一个粉丝，就会按照提前设定好的计划，定时推送给该粉丝。</p>
							<p style="margin-bottom: 2px;">1）向关注公众号的新粉丝立即自动推送消息，含图文、图片、文字（可添加超链接）、音频、视频等。</p>
							<p style="margin-bottom: 2px;">2）在关注48小时内，根据关注时长，可向粉丝自动推送消息。</p>
							<p style="margin-bottom: 2px;">3）将通过渠道码扫码推送的内容关闭后，新的粉丝关注后推送的内容即是“关注回复”内容。</p>
							<p style="margin-bottom: 0px;">4）<span style="color: #F56C6C;">推送优先级：如果当前时间点，有多条推送任务，那么针对粉丝而言，仅执行一个任务进行推送，以最后一个创建的任务时间推送。</span></p>
						</div>
						<div class="content-hd">
							<a-col style="float: right;">
								<a-button type="primary" icon="plus" style="width: 150px;font-size:14px;"
								          @click="replyAdd" v-has="'reply-add'">
									创建推送计划
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table :columns="reply.columns" :dataSource="reply.list" :pagination="false"
								         :rowClassName="rowClassName" v-has="'reply-list'">
									<span slot="status" slot-scope="text, record,index">
										<a-switch :checked="text == 1 ? true:false"
										          @click="changeStatus(record.id,text)"/>
									</span>
									<span slot="preview" slot-scope="text, record,index">
										<span style="color: #01b065; cursor: pointer;"
										      @click="preview(record.id, record.title)">预览</span>
									</span>
									<span slot="push_time" slot-scope="text, record,index">
										<p style="margin-bottom: 3px;">{{record.push_time}}</p>
										<p style="margin-bottom: 0px;color: #F56C6C;">{{record.time}}</p>
									</span>
									<span slot="action" slot-scope="text, record,index">
					                    <a-button style="margin-right: 5px; margin-bottom: 5px;"
					                              @click="statistical(record.id)" v-has="'reply-statistic'">统计</a-button>
					                    <a-button style="margin-right: 5px; margin-bottom: 5px;"
					                              @click="pushLog(record.id)" v-has="'reply-push'">推送日志
					                    </a-button>
										<a-button style="margin-right: 5px; margin-bottom: 5px;"
										          v-if="record.is_show==1" @click="edit(record.id)" v-has="'reply-delete'">编辑
					                    </a-button>
										<!--					                    <a-button style="margin-right: 5px; margin-bottom: 5px;"-->
										<!--					                              @click="copy(record.id)">复制</a-button>-->
					                    <a-button style="margin-right: 5px; margin-bottom: 5px;"
					                              @click="deleteData(record.id)" v-has="'reply-delete'">删除</a-button>
									</span>
								</a-table>
								<!-- 分页 -->
								<div style="width: 100%;position: absolute;margin: 20px 0px;" v-show="reply.total > 0" v-has="'reply-list'">
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
		<!--	统计  -->
		<a-modal title="统计" v-model="statisticalVisible" :footer="false" width="80%">
			<div style="text-align: right;">
				<a-button type="primary" v-show="statisticalData.total > 0"
				          @click="exportStatistical">导出数据
				</a-button>
			</div>
			<a-table :columns="statisticalData.columns" :dataSource="statisticalData.list" :pagination="false"
			         style="margin: 20px 0px;max-height: 400px; overflow-y: auto;" :rowClassName="rowClassName">
				<span slot="sendNum">
                  发送次数
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      <span>按照任务规则，不论任务包含多少条内容，只计入一次。</span>
                    </template>
                    <a-icon type="question-circle" style="margin-left:5px;"/>
                  </a-tooltip>
                </span>
				<span slot="receive_num">
                  接收人数
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      <span>同一人在同一时间点接收信息，人数去重。</span>
                    </template>
                    <a-icon type="question-circle" style="margin-left:5px;"/>
                  </a-tooltip>
                </span>
			</a-table>
			<div style="width: 100%;margin: 20px 0px;" v-show="statisticalData.total > 0">
				<div style="height: 32px;display: inline-block;line-height: 32px;">
					共
					<span style="color: blue">{{statisticalData.total}}</span>条
				</div>
				<div class="pagination" style="height: 32px;display: inline-block;float: right;">
					<a-pagination :total="statisticalData.total" showSizeChanger
					              :showQuickJumper="statisticalData.quickJumper"
					              :current="statisticalData.page"
					              :pageSize="statisticalData.pageSize"
					              :pageSizeOptions="['15','30','50','100']"
					              @change="changeStatisticalPage"
					              @showSizeChange="showStatisticalSizeChange"/>
				</div>
			</div>
		</a-modal>
		<!--	推送日志	-->
		<a-modal title="推送日志" v-model="pushLogVisible" :footer="false" width="80%">
			<a-table :columns="pushLogData.columns" :dataSource="pushLogData.list" :pagination="false"
			         style="margin: 30px 0px; max-height: 400px; overflow-y: auto;" :rowClassName="rowClassName">
				<span slot="send_user" slot-scope="text, record,index">
						<img :src="record.headerimg" style="width: 20px;"/>
						<span style="margin-left: 10px;">{{record.nickname}}</span>
				</span>
			</a-table>
			<div style="width: 100%;margin: 20px 0px;" v-show="pushLogData.total > 0">
				<div style="height: 32px;display: inline-block;line-height: 32px;">
					共
					<span style="color: blue">{{pushLogData.total}}</span>条消息
				</div>
				<div class="pagination" style="height: 32px;display: inline-block;float: right;">
					<a-pagination :total="pushLogData.total" showSizeChanger
					              :showQuickJumper="pushLogData.quickJumper"
					              :current="pushLogData.page"
					              :pageSize="pushLogData.pageSize"
					              :pageSizeOptions="['15','30','50','100']"
					              @change="changePushLogPage"
					              @showSizeChange="showPushLogSizeChange"/>
				</div>
			</div>
		</a-modal>

		<wxModal :show="showModal" :callback="modalVisibleChange" hasName="reply-add"></wxModal>

		<a-drawer
				:destroyOnClose='true'
				:title="title"
				placement="right"
				:closable="false"
				@close="onClose"
				width="490px"
				:visible="visible"
		>

			<a-tabs
					size="large"
					tabPosition="top"
					style="width: 440px;margin: 5px 0px 0px 10px;"
					@change="changeListsKey"
					@prevClick="callback"
					@nextClick="callback">
				<a-tab-pane v-for="(item, idx) in lists" :tab="idx+1" :key="idx+1">
					<div
							style="border:1px solid #E2D6D6;margin:auto;height:100%;width:100%;background:#F5F5F5;overflow: auto;">
						<img src="../../../assets/wxHeader.png" alt
						     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
						<div class="msg_content_body">
							<template v-for="(element,index) in lists[listsIndex]">
								<!-- 图文 -->
								<div v-if="element.typeValue == 5" class="mt">
									<template v-if="element.closeShowModal3">
										<div style="border: 1px solid #E8E8E8;">
											<img :src="element.sketchList[0].local_path.img"
											     style="height: 145px;width: 100%;object-fit: cover;"/>
											<div class="inputTitle"
											     v-html="element.sketchList[0].inputTitle==''?'标题':element.sketchList[0].inputTitle"></div>
											<template v-for="(sketch,sketchIndex) in element.sketchList.slice(1)">
												<div class="inputTitle2">
													<p v-html="element.sketchList[sketchIndex+1].inputTitle==''?'标题':element.sketchList[sketchIndex+1].inputTitle"></p>
													<img :src="element.sketchList[sketchIndex+1].local_path.img"
													     alt="" style="width: 64px;height: 64px;float: right;object-fit: cover;">
												</div>
											</template>
										</div>
									</template>
								</div>
								<!-- 图片 -->
								<div v-if="element.typeValue == 2" class="mt">
									<a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									          :size="36" style="margin-right: 10px;"/>
									<!-- 选中前 -->
									<template v-if="element.closeShowModal3 == false">
										<img src="../../../assets/img.png" alt
										     style="width: 150px;border-radius: 4px;"/>
									</template>
									<!-- 选中后 -->
									<template v-if="element.closeShowModal3">
										<img :src="element.local_path.img" alt
										     style="width: 150px;border-radius: 4px;object-fit: cover;"/>
									</template>
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
									<!-- 选中前 -->
									<template v-if="element.closeShowModal3 == false">
										<div class="audio">
											<div class="box">
												<div class="wifi-symbol">
													<div class="wifi-circle first"></div>
													<div class="wifi-circle second"></div>
													<div class="wifi-circle third"></div>
												</div>
											</div>
										</div>
									</template>
									<!-- 选中后 -->
									<template v-if="element.closeShowModal3">
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
									</template>
								</div>
								<!-- 视频 -->
								<div v-if="element.typeValue == 4" class="mt">
									<!-- 选中前 -->
									<template v-if="element.closeShowModal3 == false">
										<a-card hoverable style="width: 100%">
											<img alt="example"
											     src="http://s.weituibao.com/static/1545276720179/video.png"
											     slot="cover"/>
											<a-card-meta style="height: 50px;"></a-card-meta>
										</a-card>
									</template>
									<!-- 选中后 -->
									<template v-if="element.closeShowModal3">
										<a-card hoverable style="width: 100%">
											<video-player class="video-player vjs-custom-skin" ref="videoPlayer"
											              :playsinline="true"
											              :options="playerOptions"></video-player>
											<a-card-meta :title="element.file_name"
											             style="height: 50px;line-height: 50px;text-align: center;">
											</a-card-meta>
										</a-card>
									</template>
								</div>
							</template>
						</div>
					</div>
				</a-tab-pane>
			</a-tabs>
		</a-drawer>
	</div>
</template>

<script>
	import wxModal from "@/components/WxModal.vue";
	import "video.js/dist/video-js.css";
	import {videoPlayer} from "vue-video-player"


	export default {
		name      : "replyList",
		components: {
			wxModal, videoPlayer
		},
		data () {
			let changeBackground =
				localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				verify_service    : false,
				showTransition    : 1,
				isLoading         : true, //Loading 组件显示与隐藏
				wxLen             : JSON.parse(localStorage.getItem('wxArr')).length,
				wxInfo            : [], //微信公众号列表
				changeBackground  : changeBackground, //选中背景色
				wxNum             : changeBackground, //传递给新建高级群发页面的微信id值
				reply             : {
					columns    : [
						{
							title      : "状态",
							dataIndex  : "status",
							key        : "status",
							scopedSlots: {customRender: "status"}
						},
						{
							title    : "任务名称",
							dataIndex: "title",
							width    : "180px",
							key      : "title"
						},
						{
							title      : "消息内容",
							dataIndex  : "preview",
							key        : "preview",
							scopedSlots: {customRender: "preview"}
						},
						{
							title      : "执行日期",
							dataIndex  : "push_time",
							key        : "push_time",
							scopedSlots: {customRender: "push_time"}
						},
						{
							title    : "今日实际发送人数",
							dataIndex: "push_num",
							key      : "push_num"
						},
						{
							title    : "累计发送人数",
							dataIndex: "total_num",
							key      : "total_num"
						},
						{
							title      : "操作",
							dataIndex  : "action",
							// width      : "27%",
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
				statisticalVisible: false,
				statisticalData   : {
					columns : [
						{
							title    : '日期',
							dataIndex: "date_time",
							key      : "date_time",

						},
						{
							title    : '公众号',
							dataIndex: "name",
							key      : "name",
						},
						{
							// title    : '发送次数',
							dataIndex: "send_num",
							key      : "send_num",
							slots    : {title: "sendNum"},
						},
						{
							// title    : '接收人数',
							dataIndex: "receive_num",
							key      : "receive_num",
							slots    : {title: "receive_num"},
						},
					],
					list    : [],
					total   : 0,
					page    : 1,
					pageSize: 15
				},
				pushLogData       : {
					columns : [
						{
							title      : '推送对象',
							dataIndex  : "send_user",
							key        : "send_user",
							scopedSlots: {customRender: "send_user"}
						},
						{
							title    : '推送时间',
							dataIndex: "create_time",
							key      : "create_time",
						},
						{
							title      : '发送状态',
							dataIndex  : "status",
							key        : "status",
							scopedSlots: {customRender: "status"}
						},
						{
							title    : '失败原因',
							dataIndex: "error_msg",
							key      : "error_msg",
							width    : '30%'
						},
					],
					list    : [],
					total   : 0,
					page    : 1,
					pageSize: 15
				},
				pushLogVisible    : false,
				showModal         : false,
				id                : '',
				visible           : false,
				list              : [
					{
						pushHour           : 0,
						pushMinutes        : 0,
						typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
						typeName           : this.defaultTypeName,
						id                 : 0,
						closeShowModal3    : false,//是否选好素材
						disabled           : false,//消息类型图文能否被选
						file_name          : "", //手机上展示的素材标题
						material_id        : "", //选中的素材id
						local_path         : {
							img  : "",
							audio: ""
						}, //手机上展示的图片、音频、视频链接
						sketchList         : [
							{
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
								closeShowModal3   : false,//每个图文消息是否选好素材
							}
						],//图文消息添加的数组
						textAreaValueHeader: "", //模板展示的内容
						emojiShow          : false, // emoji表情选择框是否显示
					},
				],
				listsIndex        : 0,
				lists             : [],
				title             : "",
				playerOptions     : {
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
				if(localStorage.getItem('isMasterAccount') == 2){
					this.$store.dispatch('getPermissionButton')
				}
				this.getReply()
			},
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
				if(localStorage.getItem('isMasterAccount') == 2){
					this.$store.dispatch('getPermissionButton')
				}
				this.getReply()
			},
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
					if(this.wxInfo.length > 1) {
						this.showModal = true;
					} else {
						this.$router.push("/reply/add");
					}

				}
			},
			modalVisibleChange (event, wxNum) {
				if (event == "ok") {
					this.showModal = false;
					this.$store.dispatch("changeWxNum", wxNum);
					this.$router.push("/reply/add");
				} else {
					this.showModal = false;
				}
			},
			changeStatus (id, status) {
				status = (status + 1) % 2
				this.changeReplyStatus(id, status)
			},
			preview (id, title) {
				this.title = title
				this.listsIndex = 0
				this.getDetail(id)
			},
			onClose () {
				this.visible = false;
			},
			changeListsKey (key) {
				this.listsIndex = key - 1
			},
			callback () {

			},
			async getDetail (id) {
				const {data: res} = await this.axios.post(
					"interact-reply/detail",
					{
						id: id
					}
				)
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					let content = res.data.content
					// console.log(this.replyList)
					if (content.length > 0) {
						this.lists = []
						for (let len = 0; len < content.length; len++) {
							let replyList = content[len].replyList
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
									sketchList         : [],//图文消息添加的数组
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
									// for (let t = 0; t < this.list.length; t++) {
									// 	if (list[t].typeValue == 5) {
									// 		list[t].sketchList.splice(list[t].sketchList.length - 1, 1)
									// 	}
									// }
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
							}
							this.lists.push(JSON.parse(JSON.stringify(list)))
						}

					}
					this.visible = true
				}
			}
			,
			// 统计
			statistical (id) {
				this.getStatistical(id)
				this.id = id
			},
			// 推送日志
			pushLog (id) {
				this.getPushLog(id)
				this.id = id
			},
			// 编辑
			edit (id) {
				this.$router.push({path: "/reply/add", query: {id: id}});
			},
			// 复制
			// copy (id) {
			// },
			// 删除
			deleteData (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该推送计划?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.deleteReply(id)
					}
				});

			},
			changeReplyPage (page, pageSize) {
				this.isLoading = true
				this.reply.page = page
				this.getReply()
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,160)
				})
			},
			showReplySizeChange (page, pageSize) {
				this.isLoading = true
				this.reply.pageSize = pageSize
				let maxPage = Math.ceil(this.reply.total / pageSize)
				if (this.reply.page > maxPage) {
					this.reply.page = maxPage
				}
				this.getReply()
			},
			exportStatistical () {
				this.exportStatis(this.id)
			},
			changeStatisticalPage (page, pageSize) {
				this.statisticalData.page = page
				this.getStatistical(this.id)
			},
			showStatisticalSizeChange (page, pageSize) {
				this.statisticalData.pageSize = pageSize
				let maxPage = Math.ceil(this.statisticalData.total / pageSize)
				if (this.statisticalData.page > maxPage) {
					this.statisticalData.page = maxPage
				}
				this.getStatistical(this.id)
			},
			changePushLogPage (page, pageSize) {
				this.pushLogData.page = page
				this.getPushLog(this.id)
			},
			showPushLogSizeChange (page, pageSize) {
				this.pushLogData.pageSize = pageSize
				let maxPage = Math.ceil(this.pushLogData.total / pageSize)
				if (this.pushLogData.page > maxPage) {
					this.pushLogData.page = maxPage
				}
				this.getPushLog(this.id)
			},

			async getReply () {
				let that = this
				let params = {
					wx_id:localStorage.getItem('wxNum'),
					type    : 1,
					status  : 1,
					page    : that.reply.page,
					pageSize: that.reply.pageSize
				}
				const {data: res} = await this.axios.post("interact-reply/list", params);
				if (res.error != 0) {
					that.$message.error(res.error_msg);
				} else {
					this.reply.list = res.data.info
					this.reply.total = parseInt(res.data.count) || 0
					this.isLoading = false
				}

			},
			async getStatistical (id) {
				let that = this
				let params = {
					id      : id,
					page    : that.statisticalData.page,
					pageSize: that.statisticalData.pageSize
				}
				const {data: res} = await this.axios.post("interact-reply/statistics", params);
				if (res.error != 0) {
					that.$message.error(res.error_msg);
				} else {
					this.statisticalData.list = res.data.info
					this.statisticalData.total = parseInt(res.data.count) || 0
					this.statisticalVisible = true
				}

			},
			async getPushLog (id) {
				let that = this
				let params = {
					id      : id,
					page    : that.pushLogData.page,
					pageSize: that.pushLogData.pageSize
				}
				const {data: res} = await this.axios.post("interact-reply/push-detail", params);
				if (res.error != 0) {
					that.$message.error(res.error_msg);
				} else {
					this.pushLogData.list = res.data.info
					this.pushLogData.total = parseInt(res.data.count) || 0
					this.pushLogVisible = true
				}
			},
			async exportStatis (id) {
				let that = this
				let params = {
					id: id,
				}
				const {data: res} = await this.axios.post("interact-reply/statistics-export", params);
				if (res.error != 0) {
					that.$message.error(res.error_msg);
				} else {
					window.open(res.data.url)
				}
			},
			async deleteReply (id) {
				let that = this
				let params = {
					id: id
				}
				const {data: res} = await this.axios.post("interact-reply/delete", params);
				if (res.error != 0) {
					that.$message.error(res.error_msg);
				} else {
					that.$message.success("删除成功！");
					this.isLoading = false
					if(this.reply.list.length == 1 && this.reply.page > 1) {
						this.reply.page = this.reply.page - 1
					}
					this.getReply(this.reply.page, this.reply.pageSize)
				}

			},
			async changeReplyStatus (id, status) {
				let that = this
				let params = {
					id    : id,
					status: status
				}
				const {data: res} = await this.axios.post("interact-reply/set-on-off", params);
				if (res.error != 0) {
					that.$message.error(res.error_msg);
				} else {
					that.$message.success("操作成功！");
					this.getReply()
				}

			}
		},
		mounted () {
			this.initHelp()
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
				this.getReply()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/reply/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getReply(vm.page,vm.pageSize)
				});
			}else if (from.path == '/reply/add' && ( typeof to.query.isRefresh == "undefined" || '1' != to.query.isRefresh) || from.path != '/reply/add') {
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
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
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
		border-right: 1px solid #E2E2E2;
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

	.help {
		/*float: left;*/
		display: inline-block;
		margin-left: 18px;
		/*margin-top: 3px;*/
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
		color: #01b065;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.help a:visited {
		color: #01b065;
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
		width: 100%;
		height: 150px;
		padding: 50px 20px;
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
</style>