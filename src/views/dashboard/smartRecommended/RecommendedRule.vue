<template>
	<div>
		<div>
			<!--			<div class="content-msg">-->
			<!--				<p style="margin-bottom: 2px;">-->
			<!--					在企业微信体系里，虽然我们无法防止员工删除客户，但我们可以使用员工删人提醒功能，来监督员工删除客户的行为，一旦发现，可以根据其行为的影响程度给予相应的处罚。-->
			<!--				</p>-->
			<!--				<p style="margin-bottom: 0px; color: #FF562D;">-->
			<!--					根据当前子账号所设置的员工可见范围，查看员工删除客户的数据记录。如部门负责人，只看到该部门成员删除客户的数据。-->
			<!--				</p>-->
			<!--			</div>-->
			<div class="content-hd">
				<a-select
						v-if="corpLen > 1"
						showSearch
						optionFilterProp="children"
						style="width: 170px;margin-right: 5px;"
						@change="handleWxId"
						v-model="corpId"
				>
					<template v-for="item in corpInfo">
						<a-select-option :value="item.corpid">{{item.corp_full_name ||
							item.corp_name}}
						</a-select-option>
					</template>
				</a-select>
				<a-input v-model="keyword" style="width: 170px;" @keydown.enter="getRuleList(1,pageSize)"
				         placeholder="关键词搜索"></a-input>
				<a-button type="primary" style="margin: 0px 5px;" @click="getRuleList(1,pageSize)">查找</a-button>
				<a-button @click="clear">清空</a-button>
				<a-button v-has="'smartRecommended-rule-add'" type="primary" icon="plus" style="float: right;margin-top: 14px;" @click="addRules">添加推荐规则
				</a-button>
			</div>
			<div style="margin-bottom: 15px;">
				共
				<span style="color: blue">{{total}}</span>
				条
			</div>
			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
					<a-table :columns="columns" :dataSource="ruleList" :pagination="false"
					         :rowClassName="rowClassName" v-has="'smartRecommended-rule-list'">
						<span slot="keywords" slot-scope="text, record, index">
							聊天中提到含
							<a-tag color="pink" style="margin: 3px;" v-if="record.keywords.length <= 5"
							       v-for="tag in record.keywords">
								{{tag}}
							</a-tag>
							<a-popover v-if="record.keywords.length > 5" placement="left">
							<span slot="content">
								<div class="popover-content">
									<a-tag color="pink" style="margin: 3px;"
									       v-for="item in record.keywords">
										{{item}}
									</a-tag>
								</div>
							</span>
								<template v-for="(item, index) in record.keywords">
									<a-tag color="pink" v-if="index < 5" style="margin: 3px;">
										{{item}}
									</a-tag>
								</template>
								<span style="color: #01b065; cursor: pointer;">等{{record.keywords.length}}个</span>
							</a-popover>
							关键词推荐相关内容
						</span>
						<span slot="type" slot-scope="text, record, index">
							<span v-if="record.type == 1">
								不限制
							</span>
							<span v-if="record.type == 2">
								用户标签
							</span>
						</span>
						<span slot="attachment_num" slot-scope="text, record, index">
							<div v-for="item in record.attachment_num">
								<a-popover placement="left" v-if="record.type == 2">
									<div slot="content" class="popover-content">
										<a-tag v-for="tag in item.tag_name" color="orange" style="margin: 3px">
											{{tag}}
										</a-tag>
									</div>
									<span style="color: #01b065; cursor: pointer;">{{item.tag_num}}个标签：</span>
								</a-popover>
								<span style="margin-right: 4px;" v-if="item['1']">{{item['1']}}文本</span>
								<span style="margin-right: 4px;" v-if="item['5']">{{item['5']}}图文</span>
								<span style="margin-right: 4px;" v-if="item['7']">{{item['7']}}文件</span>
								<span style="margin-right: 4px;" v-if="item['2']">{{item['2']}}图片</span>
								<span style="margin-right: 4px;" v-if="item['4']">{{item['4']}}视频</span>
								<span style="margin-right: 4px;" v-if="item['6']">{{item['6']}}小程序</span>
							</div>
						</span>
						<span slot="action" slot-scope="text, record, index">
							<div style="display: inline-block;" v-has="'smartRecommended-rule-edit'">
								<a-button @click="lookRule(record.id)" type="link">查看</a-button>
							</div>
							<div style="display: inline-block;" v-has="'smartRecommended-rule-edit'">
								<a-button @click="editRule(record.id)" type="link">编辑</a-button>
							</div>
							<div style="display: inline-block;" v-has="'smartRecommended-rule-del'">
								<a-button @click="deleteRule(record.id, 1)" type="link">删除</a-button>
							</div>
						</span>
					</a-table>
					<!--分页-->
					<div class="pagination" style="width: 100%;padding: 20px 15px;overflow: hidden;"
					     v-show="total > 0" v-has="'smartRecommended-rule-list'">
						<div style="height: 32px;float: left;line-height: 32px;">
							共
							<span style="color: blue">{{total}}</span>
							条
						</div>
						<div class="pagination" style="height: 32px;float: right;">
							<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
							              :current="page"
							              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
							              @change="changePage"
							              @showSizeChange="showSizeChange"/>
						</div>
					</div>
				</a-spin>
			</div>
			<a-drawer
					:destroyOnClose='true'
					title="预览"
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
						<div v-if="objType == 2" style="height: 60px;">
							用户标签：
							<template v-if="item.tag_name.length <= 3">
								<a-tag color="orange" v-for="tag in item.tag_name">
									{{tag}}
								</a-tag>
							</template>
							<a-popover placement="left">
								<div slot="content" style="max-width: 400px;">
									<a-tag color="orange" v-for="(tag, index) in item.tag_name" style="margin: 5px;">
										{{tag}}
									</a-tag>
								</div>

								<span v-if="item.tag_name.length > 3" style="cursor: pointer;">
									<div style="display:inline-block;" v-for="(tag, index) in item.tag_name">
										<a-tag color="orange" v-if="index < 3" style="margin: 5px;">
											{{tag}}
										</a-tag>
									</div>
									等{{item.tag_name.length}}个标签
								</span>
							</a-popover>
						</div>
						<div
								style="border:1px solid #E2D6D6;margin:auto;height: calc(100% - 120px);width:100%;background:#F5F5F5;overflow: auto;">
							<img src="../../../assets/wxHeader.png" alt
							     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
							<div class="msg_content_body">
								<template v-for="(element,index) in lists[listsIndex].list">
									<!-- 图文 -->
									<div v-if="element.typeValue == 5" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;"/>
										<div style="border: 1px solid #E8E8E8;width: calc(100% - 56px);display: inline-block;vertical-align: top;">
											<img :src="element.sketchList[0].local_path.img"
											     style="height: 145px;width: 100%;object-fit: cover;"/>
											<div class="inputTitle"
											     v-html="element.sketchList[0].inputTitle==''?'标题':element.sketchList[0].inputTitle"></div>
											<template
													v-for="(sketch,sketchIndex) in element.sketchList.slice(1)">
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
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;"/>
										<img :src="element.local_path.img" alt
										     style="width: 150px;border-radius: 4px;object-fit: cover; vertical-align: top;"/>
									</div>
									<!-- 文字 -->
									<div v-if="element.typeValue == 1" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<span v-html="element.textAreaValueHeader"
										      class="item-info msg_content_txt"></span>
									</div>
									<!-- 视频 -->
									<div v-if="element.typeValue == 4" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;"/>

										<a-card hoverable
										        style="width: calc(100% - 56px);display: inline-block;vertical-align: top;">
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
											<p class="applet-title">{{element.appletInputTitle}}</p>
											<img :src="element.appletUrl" alt="" style="width: 100%;">
										</div>
									</div>
									<!--文件-->
									<div v-if="element.typeValue == 7"
									     class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36"
												style="object-fit: cover;margin-right: 10px;float: left;"/>
										<div class="item-info msg_content_txt">
											<div>
												<img
														alt="example" v-if="element.extension == 'doc'"
														class="file-icon"
														src="../../../assets/fileIcon/doc.png"
														slot="cover"
												/>
												<img
														alt="example" v-if="element.extension == 'docx'"
														class="file-icon"
														src="../../../assets/fileIcon/docx.png"
														slot="cover"
												/>
												<img
														alt="example" v-if="element.extension == 'xlsx'"
														class="file-icon"
														src="../../../assets/fileIcon/xlsx.png"
														slot="cover"
												/>
												<img
														alt="example" v-if="element.extension == 'xls'"
														class="file-icon"
														src="../../../assets/fileIcon/xls.png"
														slot="cover"
												/>
												<img
														alt="example" v-if="element.extension == 'csv'"
														class="file-icon"
														src="../../../assets/fileIcon/csv.png"
														slot="cover"
												/>
												<img
														alt="example" v-if="element.extension == 'pptx'"
														class="file-icon"
														src="../../../assets/fileIcon/pptx.png"
														slot="cover"
												/>
												<img
														alt="example" v-if="element.extension == 'ppt'"
														class="file-icon"
														src="../../../assets/fileIcon/ppt.png"
														slot="cover"
												/>
												<img
														alt="example" v-if="element.extension == 'txt'"
														class="file-icon"
														src="../../../assets/fileIcon/txt.png"
														slot="cover"
												/>
												<img
														alt="example" v-if="element.extension == 'pdf'"
														class="file-icon"
														src="../../../assets/fileIcon/pdf.png"
														slot="cover"
												/>
												<img
														alt="example" v-if="element.extension == 'xmind'"
														class="file-icon"
														src="../../../assets/fileIcon/xmind.png"
														slot="cover"
												/>
												<div class="file-name">{{element.file_name}}</div>
											</div>
										</div>
									</div>
								</template>
							</div>
						</div>
					</a-tab-pane>
				</a-tabs>
			</a-drawer>
		</div>
	</div>
</template>

<script>
	import fileList from '../../../components/FilingCabinet/List'
	import TemplateMsg from "../../../components/fissionNotice/TemplateMsg";
	import {defaulImg} from '../../../assets/img.png'
	import {videoPlayer} from "vue-video-player"
	import "video.js/dist/video-js.css"

	const columns = [
		{
			title      : "内容推荐规则",
			dataIndex  : "keywords",
			key        : "keywords",
			scopedSlots: {customRender: "keywords"},
		},
		{
			title      : "推送对象",
			dataIndex  : "type",
			scopedSlots: {customRender: "type"},
			key        : "type"
		},
		{
			title      : "内容推荐",
			dataIndex  : "attachment_num",
			scopedSlots: {customRender: "attachment_num"},
			key        : "attachment_num"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '250px',
			scopedSlots: {customRender: "action"},
		}
	];
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
			1: '文本',
			5: '图文',
			7: '文件',
			2: '图片',
			// 3: '音频',
			4: '视频',
			6: '小程序',
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
		sketchList         : [JSON.parse(JSON.stringify(news))],//图文消息添加的数组
		appletUrl          : '',// 小程序的封面链接
		appletInputTitle   : '',// 小程序的标题
		appid              : '',// 小程序的appid
		pageUrl            : '',// 小程序page路径
		materialSync       : 0, // 小程序是否同步，0不同步，1同步
		selectGroupId      : '',// 上传选择的分组id
		textAreaValueHeader: "", //模板展示的内容
		textContent        : '',//编辑框传给后台的内容
		extension          : '', // 文件图标类型
	}
	export default {
		name      : "userNotice",
		components: {TemplateMsg, fileList, videoPlayer},
		props     : {
			id: {
				type   : String,
				default: ''
			}
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				settingVisible: false,
				isAudit       : 0,
				/* 敏感词 */
				suite_id      : 1, //应用ID
				corpId        : corpId, //企业微信选中的id
				corpInfo      : [], // 企业微信列表
				keyword       : '', // 筛选关键词
				ruleList      : [], // 列表
				isLoading     : true, //Loading 组件显示与隐藏
				corpLen       : JSON.parse(localStorage.getItem('corpArr')).length,
				//表格部分
				columns,
				//分页
				total         : 0, //总条数
				quickJumper   : false, // 是否显示快速跳转的控件
				page          : 1, //页码
				pageSize      : 15, //每页数据条数
				visible       : false, // 查看
				objType       : 1, // 1.预览不显示客户标签 2.预览显示客户标签
				listsIndex    : 0, // 预览tabKey
				lists         : [], // 预览数据
				playerOptions : {
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

		methods: {
			async lookRule (id) {
				const {data: res} = await this.axios.post(
					"work-msg-keyword-attachment/keyword-detail",
					{
						corp_id: localStorage.getItem('corpId'),
						id     : id
					}
				)
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.objType = res.data.type
					this.title = res.data.keyword
					let content = res.data.attachmentData
					// console.log(this.replyList)
					if (content.length > 0) {
						this.lists = []
						for (let len = 0; len < content.length; len++) {
							let obj = {
								list          : [],
								tag_ids       : content[len].tag_ids,
								keyword_tag_id: content[len].keyword_tag_id,
								tag_name      : content[len].tag_name,   // 初始化的medium-editor
							}
							let replyList = content[len].attach_list
							let list = []
							for (let i = 0; i < replyList.length; i++) {
								list.push(JSON.parse(JSON.stringify(templateObj)))
								list[i].typeValue = replyList[i].typeValue
								if (list[i].typeValue == 5) {
									list[i].sketchList[0].id = replyList[i].id
									list[i].sketchList[0].addType = replyList[i].addType
									list[i].sketchList[0].inputTitle = replyList[i].inputTitle.replace(/{nickname}/g, '&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;')
									list[i].sketchList[0].digest = replyList[i].digest
									list[i].sketchList[0].content_source_url = replyList[i].content_source_url
									list[i].sketchList[0].material_id = replyList[i].material_id
									list[i].sketchList[0].local_path.img = replyList[i].local_path.img
									list[i].sketchList[0].local_path.audio = replyList[i].local_path.audio
								} else if (list[i].typeValue == 6) {
									list[i].attach_id = replyList[i].attach_id
									list[i].addType = parseInt(replyList[i].is_user)
									list[i].appletUrl = replyList[i].local_path
									list[i].appletInputTitle = replyList[i].file_name
									list[i].appid = replyList[i].appid || ''
									list[i].pageUrl = replyList[i].pagepath || ''
									list[i].materialSync = replyList[i].is_sync || 0
									list[i].selectGroupId = replyList[i].group_id || ''
									list[i].material_id = replyList[i].material_id
									list[i].closeShowModal3 = true
								} else {
									list[i].extension = replyList[i].extension
									list[i].id = replyList[i].id
									list[i].file_name = replyList[i].file_name
									list[i].material_id = replyList[i].material_id
									list[i].local_path.img = replyList[i].local_path.img
									list[i].local_path.audio = replyList[i].local_path.audio
									list[i].textAreaValueHeader = replyList[i].textAreaValueHeader.replace(
										/{nickname}/g,
										'&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;'
									).replace(/\n/g, "<br/>")
								}
							}
							obj.list = JSON.parse(JSON.stringify(list))
							this.lists.push(JSON.parse(JSON.stringify(obj)))
						}

					}
					this.visible = true
				}
			},
			// 关闭查看弹窗
			onClose () {
				this.visible = false;
				this.listsIndex = 0
			},
			// 改变预览tabKey
			changeListsKey (key) {
				this.listsIndex = key - 1
			},
			callback (val) {

			},
			// 编辑规则
			async editRule (id) {
				this.$router.push("/smartRecommended/ruleAdd?id=" + id);
			},
			// 删除规则
			deleteRule (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该规则?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.deleteRuleSure(id);
					}
				});
			},
			async deleteRuleSure (id) {
				const {data: res} = await this.axios.post("work-msg-keyword-attachment/keyword-del", {
					corp_id: this.corpId,
					id     : id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					if (this.ruleList.length == 1) {
						if (this.page == 1) {
							this.getRuleList()
						} else {
							this.getRuleList(this.page - 1, this.pageSize)
						}
					} else {
						this.getRuleList(this.page, this.pageSize)
					}
				}
			},

			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getRuleList(page, pageSize);
				this.$emit('changeScroll')
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getRuleList(1, pageSize);
			},
			handleWxId (value) {
				this.corpId = value
				// 改变整个系统corpId
				let corp = this.corpInfo.find(corp => corp.corpid == this.corpId)
				this.$store.dispatch("changeCorp", corp);
			},
			// 清除
			clear () {
				this.corpId = localStorage.getItem('corpId')
				this.$emit('changeCorpId', this.corpId)
				this.keyword = ''
				this.getRuleList()
			},
			//获取表格内容
			async getRuleList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-msg-keyword-attachment/keyword-list", {
					corp_id : this.corpId,
					keyword : this.keyword,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.ruleList = res.data.list;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			//添加推荐规则
			addRules () {
				this.$router.push("/smartRecommended/ruleAdd");
			},
		},

		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.corpId = this.id
				this.isAudit = this.corpInfo.find(i => i.corpid == this.corpId).isAudit
				this.isLoading = true
				this.selectedRowKeys = []
				if (this.corpInfo.length > 0) {
					this.getRuleList()
				}
			});
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 0 5px;
		padding: 3px 15px;
		cursor: pointer;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
		margin-bottom: 10px;
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
		width: 100%;
		padding-right: 40px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
		overflow: hidden;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
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

	.btn-primary {
		margin-left: 20px;
	}

	.setting-day {
		margin: 10px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 90px;
		margin: 0px;
		text-align: center;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-modal-body {
		padding: 0 0 0 8px;
	}

	.material-icon {
		width: 80px;
		height: 80px;
		margin: 5px 16px !important;
	}


	.mt {
		margin: 20px 15px 20px 10px;
		overflow: hidden;
	}

	.left-sider-content {
		border: 1px solid #E2D6D6;
		margin: auto;
		overflow-y: auto;
		box-sizing: content-box;
		height: 100%;
		width: 100%;
		background: #F5F5F5;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
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
		word-break: break-word;
	}

	.applet-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0;
	}

	.file-name {
		float: right;
		width: calc(100% - 90px);
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.file-icon {
		width: 70px;
		height: 70px;
		margin: 0 !important;
		float: left;
	}
	.popover-content {
		max-width: 500px;
		max-height: 200px;
		overflow-y: auto;
	}
</style>
