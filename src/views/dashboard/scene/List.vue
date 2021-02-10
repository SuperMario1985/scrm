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
				          :style="wxLen > 1 ? {left: '250px'} : {left: '0px'}" class="scroll">
					<!-- 头部 -->
					<a-layout-header>
						<label class="scene-title">渠道二维码</label>
						<span style="margin-left: 10px;font-size:14px;color:#686868;">仅认证服务号可用</span>
						<div class="help"
						     :class="showTransition == 0 ?'help-transition': (showTransition== 1 ? 'help-transition1' : '')">
							<a href="https://support.qq.com/products/104790/faqs/57054"
							   target="_blank">
								<a-icon type="question-circle" class="help-icon"/>
								<span style="float:right;">点我帮助</span>
							</a>
						</div>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							渠道二维码主要应用于海报、图文、网页、传单、实体包装等渠道中，粉丝通过扫码关注后，收到相应渠道的专属回复内容，并自动为粉丝贴上标签。同时，可统计出不同渠道的扫码次数、新关注人数、取关数等数据，帮助企业分析渠道质量，查看推广效果，优化推广方案，节约推广成本。
							<div>
								<div>1、永久二维码最多创建 10万个，永不过期。若不够用，可以修改之前的二维码；</div>
								<div>2、 临时二维码没有创建数量的限制；最短和最长的有效期是1分钟和30天（本系统暂只支持30天）；</div>
								<div>3、建议长期的推广渠道使用永久二维码，活动型的需求使用临时二维码。</div>
								<div style="color: #F56C6C;">
									4、每创建一个渠道二维码，该码则自动进入【内容引擎】--【图片类型】--分组【渠道码-公众号】，以素材的方式通过聊天侧边栏快速发送给客户。
								</div>
							</div>
						</div>
						<div class="content-hd">
							<a-col style="float:left;">
								<a-input-search placeholder="搜索二维码名称" style="width: 180px;margin-right:15px;"
								                @search="onSearch"
								                v-model="title"/>
								<a-select v-model="erweimaTimeValue" style="width: 174px;margin-right:15px;"
								          @change="changeErweima">
									<a-select-option value="0">全部二维码</a-select-option>
									<a-select-option value="1">永久二维码</a-select-option>
									<a-select-option value="2">临时二维码</a-select-option>
								</a-select>
								<a-select v-model="erweimaValue" style="width: 174px;margin-right:15px;"
								          @change="changeErweimaState">
									<a-select-option value="1">已过期</a-select-option>
									<a-select-option value="2">可用</a-select-option>
								</a-select>
								<a-button type="primary" style="margin-right:15px;" @click="find">查询</a-button>
								<a-button @click="clear">重置</a-button>
							</a-col>
							<a-col style="float:right;">
								<a-button type="primary"style="width: 150px;font-size:14px;" @click="add"
								          v-if="$store.state.authorizer_type != 'unauthorized'&&verify_service"
								          v-has="'code-add'">
									新建二维码
								</a-button>
								<a-button type="primary"style="width: 150px;font-size:14px;"
								          @click="showConfirmWx" v-if="$store.state.authorizer_type == 'unauthorized'"
								          v-has="'code-add'">
									新建二维码
								</a-button>
								<a-button type="primary"style="width: 150px;font-size:14px;"
								          @click="showVerify"
								          v-if="$store.state.authorizer_type != 'unauthorized' && !verify_service"
								          v-has="'code-add'">
									新建二维码
								</a-button>
							</a-col>
						</div>
						<!--选择公众号弹窗-->
						<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="code-add"></wxModal>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="sceneList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'code-list'">
									<span slot="customerTitle">
						                  累计扫描次数
						                  <a-tooltip placement="bottom">
							                    <template slot="title">
								                    扫过此渠道码的次数（可能同一人扫多次，每扫一次，扫码总次数+1）
							                    </template>
							                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
					                </span>
									<span slot="customerTitle2">
						                  累计关注人数
						                  <a-tooltip placement="bottom">
							                    <template slot="title">
								                    通过扫该渠道码后关注的人数。（可能同一人扫该码，再取关，再扫该码，累计值只计入1人）
							                    </template>
							                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
					                </span>
									<span slot="customerTitle3">
						                  累计取关人数
						                  <a-tooltip placement="bottom">
							                    <template slot="title">
								                    通过扫渠道码关注后又取关的人数。（可能同一人扫该码关注，再取关，再扫该码，累计值只计入1人）
							                    </template>
							                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
					                </span>
									<span slot="status" slot-scope="text, record,index">
                    <a-switch :checked="text == 1 ? true:false" @click="changeStatus(record.id,text)"/>
                  </span>
									<span slot="tag_name" slot-scope="tag_name">
										<span v-show="tag_name.length == 0">--</span>
                    <a-tag v-for="tag in tag_name" color="blue" :key="tag.id"
                           v-show="tag_name.length != 0">{{tag.name}}</a-tag>
                  </span>
									<span slot="action" slot-scope="text, record,index">
                    <a-button style="margin-right: 5px; margin-bottom: 5px;" @click="detail(record.id)"
                              v-has="'code-info'">详情</a-button>
										<!-- <a-button style="margin-right: 10px;" v-show="record.is_overdue==0"><a
											@click="downLoad2(commonUrl + record.local_path)">下载二维码</a>
										</a-button> -->
                    <a-button style="margin-right: 5px; margin-bottom: 5px;" @click="edit(record.id)"
                              v-show="record.is_overdue==0" v-if="$store.state.authorizer_type != 'unauthorized'"
                              v-has="'code-edit'">编辑
                    </a-button>
										<a-button style="margin-right: 5px; margin-bottom: 5px;" @click="showConfirmWx"
										          v-show="record.is_overdue==0"
										          v-if="$store.state.authorizer_type == 'unauthorized'"
										          v-has="'code-edit'">编辑
                    </a-button>
                    <a-button style="margin-right: 5px; margin-bottom: 5px;"
                              @click="statistics(record.id)" v-has="'code-statistic'">统计</a-button>
                    <a-button style="margin-right: 5px; margin-bottom: 5px;" @click="users(record.id)"
                              v-has="'code-user'">用户</a-button>
                  </span>
								</a-table>
								<!-- 分页 -->
								<div style="width: 100%;position: absolute;margin: 20px 0px;" v-show="total > 0"
								     v-has="'code-list'">
									<div style="height: 32px;float: left;line-height: 32px;">
										共有
										<span style="color: blue">{{total}}</span>条消息
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
						<!-- 详情页面弹窗 -->
						<a-modal title="渠道二维码详情" v-model="detailVisible" width="888">
							<template slot="footer">
								<a-button key="back" @click="handleCancel">关闭</a-button>
							</template>
							<div class="detailBox">
								<a-spin tip="加载中..." size="large" :spinning="isLoading2">
									<div class="detailBox-left">
										<div class="left-one">
											<div class="one-img">
												<div id="qrcode" ref="a"></div>
											</div>
											<div v-show="expire_time == '已到期'" class="detailMask">
												<div style="width:30px;height: 30px;border-radius: 15px;margin: 50px auto 10px;background: #FFF;">
													<img src="../../../assets/warning.png" alt="" style="width: 30px;">
												</div>
												<div style="text-align:center;color: #000;">二维码已过期</div>
											</div>
											<p class="one-name">{{erweimaTitle}}</p>
											<p class="one-date" v-if="expire_time=='永久有效'&&expire_time != '已到期'">
												{{expire_time}}</p>
											<p class="one-date" v-if="expire_time!='永久有效'&&expire_time != '已到期'">该二维码将于
												{{expire_time}} 过期</p>
											<p v-show="expire_time == '已到期'" class="one-date">该二维码已过期</p>
											<a-button type="primary" class="one-btn" @click="downLoad"
											          v-show="expire_time != '已到期'">下载渠道二维码
											</a-button>
											<a-button type="primary" class="one-btn" disabled
											          v-show="expire_time == '已到期'">下载渠道二维码
											</a-button>
										</div>
										<div class="left-two">
											<p class="two-title">粉丝标签：</p>
											<div class="tags-list">
												<a-tag color="blue" v-for="item in tagName">{{item}}</a-tag>
											</div>
										</div>
										<div class="left-three">
											<p style="float: left;">
												美化二维码
												<a-tooltip placement="top">
													<template slot="title">
														<span>可将链接复制到二维码美化工具（如https://mh.cli.im/），生成您喜欢的二维码样式</span>
													</template>
													<a-icon type="question-circle" style="margin-left:5px;"/>
												</a-tooltip>
												：
											</p>
											<div style="color: #FF6600;float: left;">不可单独复制此链接在微信或浏览器中打开</div>
											<div class="three-input">
												<a-input style="width: 377px;border-radius: 0;" v-model="inputUrl"
												         disabled/>
												<a-button type="primary" style="margin-top: 1px;border-radius: 0;"
												          @click="copyUrl" v-show="expire_time != '已到期'">复制
												</a-button>
												<a-button type="primary" style="margin-top: 1px;border-radius: 0;"
												          v-show="expire_time == '已到期'" disabled>复制
												</a-button>
											</div>
										</div>
									</div>
									<div class="detailBox-right">
										<p style="color: #FF6600;">推送方式：{{pushType==1?'随机推送一条':'全部推送'}}</p>
										<img src="http://s.weituibao.com/static/1558341456351/qrcodedeyulan.png" alt=""
										     class="preview-img">
										<p class="gzh-name">{{wxName}}</p>
										<div class="right-content">
											<div v-for="(obj,objIndex) in replyList"
											     style="margin-bottom: 15px;overflow: hidden;">
												<a-avatar
														src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
														:size="36"
														style="margin-right: 10px;float: left;"/>
												<template v-if="obj.type==1">
													<span v-html="obj.content" class="item-info msg_content_txt"></span>
												</template>
												<template v-if="obj.type==2">
													<img :src="commonUrl+obj.cover_url" alt
													     style="width: 150px;border-radius: 4px;object-fit: cover;"/>
												</template>
												<template v-if="obj.type==3">
													<div class="audio">
														<div style="float: left;font-size: 16px;">{{obj.file_name}}
														</div>
														<div class="box">
															<div class="wifi-symbol">
																<div class="wifi-circle first"></div>
																<div class="wifi-circle second"></div>
																<div class="wifi-circle third"></div>
															</div>
														</div>
													</div>
												</template>
												<template v-if="obj.type==4">
													<a-card hoverable style="width: 83%;float: left;">
														<video-player class="video-player vjs-custom-skin"
														              ref="videoPlayer"
														              :playsinline="true"
														              :options="playerOptions"></video-player>
														<a-card-meta :title="obj.file_name"
														             style="height: 50px;line-height: 50px;text-align: center;">
														</a-card-meta>
													</a-card>
												</template>
												<template v-if="obj.type==5">
													<a-card hoverable style="float: left;width: calc(100% - 46px);">
														<div style="border: 1px solid #E8E8E8;">
															<img :src="obj.content[0].cover_url"
															     style="height: 145px;width: 100%;object-fit: cover;"/>
															<div class="inputTitle"
															     v-html="obj.content[0].title"></div>
															<template v-for="(item,index) in obj.content.slice(1)">
																<div class="inputTitle2">
																	<p v-html="obj.content[index+1].title"></p>
																	<img :src="obj.content[index+1].cover_url"
																	     alt=""
																	     style="width: 64px;height: 64px;float: right;object-fit: cover;">
																</div>
															</template>
														</div>
													</a-card>
												</template>
											</div>
										</div>
									</div>
								</a-spin>
							</div>
						</a-modal>
						<!-- 用户列表弹窗 -->
						<a-modal title="扫码用户" v-model="usersVisible" :footer="null">
							<p style="color: red;">显示当前通过该渠道二维码关注的新粉丝 和 扫该渠道二维码前，通过其他渠道已关注的老粉丝</p>
							<a-spin tip="加载中..." size="large" :spinning="isLoading3">
								<a-table :columns="columns2" :dataSource="usersList" :pagination="false"
								         :rowClassName="rowClassName">
                  <span slot="is_new" slot-scope="text, record,index">
                    <template v-if="record.is_new == 0">老粉丝</template>
                    <template v-if="record.is_new == 1">新粉丝</template>
                  </span>
								</a-table>
								<!-- 分页 -->
								<div style="width: 100%;height: 32px;margin-top: 20px;" v-show="total2 > 0">
									<div style="height: 32px;float: left;line-height: 32px;">
										共有
										<span style="color: blue">{{total2}}</span>个用户
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total2" showSizeChanger :showQuickJumper="quickJumper2"
										              :current="page2"
										              :pageSize="pageSize2" :pageSizeOptions="['15','30','50','100']"
										              @change="changePage2"
										              @showSizeChange="showSizeChange2"/>
									</div>
								</div>
							</a-spin>
						</a-modal>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import wxModal from "@/components/WxModal.vue";
	import QRCode from 'qrcodejs2'
	import {videoPlayer} from "vue-video-player";
	import "video.js/dist/video-js.css";

	const columns = [
		{
			title    : "二维码名称",
			dataIndex: "title",
			width    : "180px",
			key      : "title"
		},
		{
			// title    : "累计扫描次数",
			dataIndex: "scan_times",
			key      : "scan_times",
			slots    : {title: "customerTitle"}
		},
		{
			// title    : "累计关注人数",
			dataIndex: "subscribe",
			key      : "subscribe",
			slots    : {title: "customerTitle2"}
		},
		{
			// title    : "累计取关人数",
			dataIndex: "unsubscribe",
			key      : "unsubscribe",
			slots    : {title: "customerTitle3"}
		},
		{
			title    : "创建时间",
			dataIndex: "create_time",
			key      : "create_time",
		},
		{
			title    : "到期时间",
			dataIndex: "expire_time",
			key      : "expire_time",
		},
		{
			title      : "粉丝标签",
			dataIndex  : "tag_name",
			key        : "tag_name",
			scopedSlots: {customRender: "tag_name"}
		},
		// {
		// 	title      : "推送开关",
		// 	dataIndex  : "status",
		// 	key        : "status",
		// 	scopedSlots: {customRender: "status"}
		// },
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];
	const columns2 = [
		{
			title    : "粉丝",
			dataIndex: "nickname",
			key      : "nickname"
		},
		{
			title      : "类型",
			dataIndex  : "is_new",
			key        : "is_new",
			scopedSlots: {customRender: "is_new"}
		},
		{
			title    : "扫码时间",
			dataIndex: "scan_time",
			key      : "scan_time"
		}
	]

	export default {
		name      : "sceneList",
		components: {
			wxModal, videoPlayer
		},
		data () {
			let changeBackground =
				localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				showTransition  : 1,
				isLoading       : false, //Loading 组件显示与隐藏
				wxLen           : JSON.parse(localStorage.getItem('wxArr')).length,
				wxInfo          : [], //微信公众号列表
				changeBackground: changeBackground, //选中背景色
				//表格部分
				columns,
				showModal2      : false, //公众号组件弹窗显示与隐藏
				wxNum           : changeBackground, //传递给新建高级群发页面的微信id值
				//分页
				page            : 1, //页数
				pageSize        : 15, //每页个数
				total           : 0, //总条数
				quickJumper     : false, // 是否显示快速跳转的控件
				sceneList       : [],//渠道二维码列表
				author_id       : '',//公众号Id
				title           : '',//二维码名称
				type            : 0,//二维码类型：0、全部，1、永久，2、临时
				status          : 0,//二维码状态：1、过期，2、可用
				detailVisible   : false,//详情页面弹窗的显示与隐藏
				erweimaTitle    : '',//详情页二维码标题
				expire_time     : '',//详情页过期时间
				tagName         : [],//详情页标签数组
				inputUrl        : '',//详情页二维码链接
				pushType        : '',//详情页推送方式
				wxName          : '',//详情页微信名
				replyList       : [],//详情页内容数组
				commonUrl       : this.$store.state.commonUrl, //公共的链接
				isLoading2      : false,//详情页Loading的显示与隐藏
				show            : 1,//1查看，0下载二维码
				usersVisible    : false,//用户列表弹窗的显示与隐藏
				usersList       : [],//用户列表
				//用户列表分页
				page2           : 1, //页数
				pageSize2       : 15, //每页个数
				total2          : 0, //总条数
				quickJumper2    : false, // 是否显示快速跳转的控件
				//用户列表表格部分
				columns2,
				isLoading3      : false,//用户列表页的加载
				usersId         : '',//选中的用户列表的用户Id
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
				verify_service  : false,//判断选中的公众号是否是已认证服务号
				erweimaTimeValue: '全部二维码',//全部二维码分类下拉框默认值
				erweimaValue    : '二维码状态',//二维码状态下拉框默认值
			};
		},
		mounted () {
			this.initHelp()
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
						if (x.verify_type == '已认证' && x.service_type == 2) {
							this.verify_service = true
						}
					}
				})
				this.$store.dispatch("changeWxNum", value);
				this.isLoading = true;
				this.changeBackground = value;
				this.wxNum = value;
				this.getScene();
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			selectWx (id, authorizer_type, nick_name, verify_type, service_type) {
				this.verify_service = false
				this.$store.dispatch("changeWxNum", id);
				this.isLoading = true;
				this.changeBackground = id;
				this.wxNum = id;
				if (verify_type == '已认证' && service_type == 2) {
					this.verify_service = true
				}
				this.$store.commit("changeAuthorizerType", authorizer_type);
				this.$store.commit("changeWxNickName", nick_name);
				this.getScene();
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			showConfirmWx () {
				this.$success({
					title: this.$store.state.wxNickName + '已取消授权，无法操作',
				});
			},
			showVerify () {
				this.$success({
					title: '仅针对认证的服务号开放使用',
				});
			},
			//搜索二维码
			onSearch (value) {
				this.title = value
				this.getScene();
			},
			//选择二维码分类
			changeErweima (value) {
				this.type = value
			},
			//选择二维码状态
			changeErweimaState (value) {
				this.status = value
			},
			//点击搜索
			find () {
				this.isLoading = true;
				this.getScene();
			},
			//点击清空
			clear () {
				this.isLoading = true;
				this.title = ''
				this.type = 0
				this.status = 0
				this.erweimaValue = '二维码状态'
				this.erweimaTimeValue = '全部二维码'
				this.getScene()
			},
			//获取渠道二维码列表
			async getScene (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				this.wxInfo = this.$store.state.wxArr;
				const {data: res} = await this.axios.post(
					"scene/list",
					{
						wx_id:localStorage.getItem('wxNum'),
						page     : page,
						author_id: this.author_id,
						pageSize : pageSize,
						title    : this.title,
						type     : this.type,
						status   : this.status
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.sceneList = res.data.scene;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
				// console.log(this.sceneList)
			},
			//推送开关
			changeStatus (scene_id, value) {
				let that = this;
				if (value == 1) {
					that.$confirm({
						title     : "一旦关闭后，渠道二维码扫码依然可以关注公众号号，且可继续根据用户设置打标签（分组），但仅收到【被关注回复】消息），确定关闭吗？",
						okText    : "确定",
						okType    : "danger",
						cancelText: "取消",
						onOk () {
							that.isLoading = true;
							that.updateStatus(scene_id, value)
						}
					})
				} else {
					that.$confirm({
						title     : "一旦开启后，渠道二维码扫码关注，可根据用户设置打标签（分组），且接收新建的推送内容），确定开启吗？",
						okText    : "确定",
						okType    : "danger",
						cancelText: "取消",
						onOk () {
							that.isLoading = true;
							that.updateStatus(scene_id, value)
						}
					})
				}
			},
			async updateStatus (scene_id, value) {
				var status = 0
				if (value == 0) {
					status = 1
				}
				const {data: res} = await this.axios.post(
					"scene/update-status",
					{
						scene_id: scene_id,
						status  : status
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.getScene()
				}
			},
			//详情
			detail (scene_id) {
				this.detailVisible = true;
				this.isLoading2 = true
				this.getDetail(scene_id)
				this.getQRcode(scene_id, this.show = 1)
			},
			async getDetail (scene_id) {
				const {data: res} = await this.axios.post(
					"scene/detail",
					{
						scene_id: scene_id,
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.isLoading2 = false
					this.erweimaTitle = res.data.title
					this.expire_time = res.data.expire_time
					this.tagName = res.data.tagName
					this.inputUrl = res.data.url
					this.replyList = res.data.replyList
					this.pushType = res.data.push_type
					this.wxName = res.data.nick_name
					for (let i = 0; i < this.replyList.length; i++) {
						if (this.replyList[i].type == 1) {
							this.replyList[i].content = this.replyList[i].content.replace(
								/{nickname}/g,
								'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>'
							).replace(/\n/g, "<br/>")
						} else if (this.replyList[i].type == 5) {
							for (let j = 0; j < this.replyList[i].content.length; j++) {
								this.replyList[i].content[j].title = this.replyList[i].content[j].title.replace(
									/{nickname}/g,
									'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>'
								).replace(/\n/g, "<br/>")
							}
						}
					}
				}
			},
			async getQRcode (scene_id) {
				const {data: res} = await this.axios.post(
					"scene/down",
					{
						scene_id: scene_id,
						show    : this.show
					}
				);
				// console.log(res)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$refs.a.innerHTML = ''
					this.qrcode(res.data.url);
				}
			},
			qrcode (url) {
				let qrcode = new QRCode('qrcode', {
					width     : 140,
					height    : 140,
					text      : url, // 二维码地址
					colorDark : "#000",
					colorLight: "#FFF",
				})
			},
			handleCancel () {
				this.detailVisible = false;
			},
			//播放音频
			playMusic () {
				this.isPlayMusic = false;
				this.isPlayMusic2 = true;
				this.$nextTick(() => {
					// console.log(this.$refs.audio);
					this.$refs.audio[0].play();
					var t1 = setInterval(() => {
						// console.log(this.$refs.audio[index].paused);
						if (this.$refs.audio[0].paused) {
							clearInterval(t1);
							this.isPlayMusic = true;
							this.isPlayMusic2 = false;
						}
					}, 1000);
				});
			},
			//下载二维码
			downLoad (e) {
				let url = e.target.parentNode.firstChild.getElementsByTagName('img')[0].src;
				let a = document.createElement('a')
				let event = new MouseEvent('click')
				// 下载图名字
				a.download = '渠道二维码'
				//url
				a.href = url
				//合成函数，执行下载
				a.dispatchEvent(event)
			},
			//编辑
			edit (id) {
				// console.log('编辑', id)
				this.$router.push({path: "/scene/add", query: {id: id}});
			},
			//统计
			statistics (id) {
				this.$router.push({path: "/scene/statistics", query: {id: id}})
			},
			//用户
			users (id) {
				this.usersVisible = true
				this.isLoading3 = true
				this.usersId = id
				this.getUsersInfo()
			},
			//获取用户列表信息
			async getUsersInfo (page = 1, pageSize = this.pageSize2) {
				const {data: res} = await this.axios.post(
					"scene/user-detail",
					{
						scene_id: this.usersId,
						page    : page,
						pageSize: pageSize,
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading3 = false
				} else {
					this.usersList = res.data.data
					this.total2 = parseInt(res.data.count)
					this.isLoading3 = false
					this.page2 = page;
					this.pageSize2 = pageSize;
					this.quickJumper2 = this.total2 > this.pageSize2;
				}
				// console.log(this.usersList)
			},
			//新建模板消息
			add () {
				if (this.wxInfo.length > 1) {
					this.showModal2 = true;
				} else {
					this.$router.push("/scene/add");
				}
			},
			modalVisibleChange (event, wxNum) {
				// console.log('event', event);
				if (event == "ok") {
					this.showModal2 = false;
					this.$store.dispatch("changeWxNum", wxNum);
					this.$router.push("/scene/add");
				} else {
					this.showModal2 = false;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getScene(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,170)
				})
			},
			showSizeChange (page, pageSize) {
				this.getScene(1, pageSize);
			},
			// 用户列表分页
			changePage2 (page, pageSize) {
				this.getUsersInfo(page, pageSize);
			},
			showSizeChange2 (page, pageSize) {
				this.getUsersInfo(1, pageSize);
			},
			//复制链接
			copyUrl () {
				var Url2 = this.inputUrl;
				var oInput = document.createElement("input");
				oInput.value = Url2;
				document.body.appendChild(oInput);
				oInput.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				oInput.className = "oInput";
				oInput.style.display = "none";
				this.$message.success('复制成功')
			},
		},

		created () {
			// console.log(moment(new Date(new Date() - 1000 * 60 * 60 * 24 * 30)).format('YYYY-MM-DD'))
			this.$store.dispatch("getWx", info => {
				this.wxInfo = info;
				if (!this.changeBackground && this.wxInfo.length > 0) {
					this.changeBackground = this.$store.state.wxNum;
					this.wxNum = this.$store.state.wxNum;
				}
				this.wxInfo.map((x) => {
					if (x.wx_id == this.changeBackground) {
						if (x.verify_type == '已认证' && x.service_type == 2) {
							this.verify_service = true
						}
					}
				})
			});
			this.getScene();
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if(from.path == '/scene/add' && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getScene(vm.page,vm.pageSize)
				});
			}else if ((from.path == '/scene/add' && typeof to.query.isRefresh == 'undefined') || (from.path != '/scene/add' && from.path != '/scene/statistics')) {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true;
					vm.title = ''
					vm.type = 0
					vm.status = 0
					vm.erweimaValue = '二维码状态'
					vm.erweimaTimeValue = '全部二维码'
					vm.page = 1
					vm.pageSize = 15
					vm.page2 = 1
					vm.pageSize2 = 15
					vm.getScene()
				});
			}

			next()
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

	.msg-info {
		color: @border-color;
		margin-right: 10px;
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
		background: #01b065;
		color: white;
	}

	/deep/ .ant-tabs-bar {
		padding: 0 20px !important;
	}

	.msg_content {
		border: 1px solid #E2D6D6;
		height: 100%;
		width: 420px;
		margin: auto;

		.msg_content_header {
			width: 100%;
		}

		.msg_content_body {
			background: #FFFFFF;
			border: 1px solid #E9E9E9;
			border-radius: 4px;
			margin: auto;
			padding: 16px 13px;
			font-size: 14px;
			color: #333333;
			line-height: 24px;
			margin: 20px;
		}
	}

	.detailBox {
		display: flex;
		border: 1px solid #E9E9E9;
		height: 552px;
	}

	.detailBox-left {
		width: 478px;
		border-right: 1px solid #E9E9E9;
		float: left;
	}

	.detailBox-right {
		padding: 16px;
		position: relative;
		float: left;
	}

	.preview-img {
		width: 328px;
		height: 55px;
	}

	.gzh-name {
		position: absolute;
		z-index: 2;
		left: 0;
		margin: 0 auto;
		right: 0;
		text-align: center;
		top: 77px;
		color: #1A1A1A;
	}

	.right-content {
		height: 426px;
		width: 328px;
		background: #F9F9F9;
		border: 1px solid #E9E9E9;
		padding: 20px;
		overflow: auto;
	}

	.left-one {
		height: 326px;
		display: flex;
		justify-content: center;
		border-bottom: 1px solid #E9E9E9;
		flex-direction: column;
		align-items: center;

		.one-img {
			height: 160px;
			width: 160px;
			padding: 10px;
			border: 1px solid #E9E9E9;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;

			img {
				width: 150px;
				height: 150px;
			}
		}

		.one-name {
			font-size: 16px;
			margin-top: 16px;
			color: #1A1A1A;
			margin-bottom: 0;
		}

		.one-date {
			display: flex;
			align-items: center;
			margin-top: 12px;
			font-size: 14px;
			color: #FF6600;
			margin-bottom: 0;
		}

		.one-btn {
			margin-top: 16px;
			width: 160px;
			height: 32px;
		}
	}

	.left-two {
		height: 126px;
		padding: 24px 16px;
		border-bottom: 1px solid #E9E9E9;

		.two-title {
			color: #1A1A1A;
			font-size: 14px;
		}

		.tags-list {
			margin-top: 16px;
		}
	}

	.left-three {
		height: 98px;
		padding: 16px;
	}

	.msg_content_txt {
		width: calc(100% - 46px);
		border: 1px solid #E9E9E9;
		padding: 0 16px;
		border-radius: 4px;
		font-size: 14px;
		line-height: 21px;
		color: #1A1A1A;
		background: #FFF;
		resize: none;
		float: left;
		word-break: break-all
	}

	/deep/ .ant-card-meta-avatar {
		float: right;
		padding-right: 0;
	}

	.audio {
		width: 83%;
		height: 150px;
		padding: 50px 20px;
		background: #FFF;
		float: left;
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


	/deep/ .inputTitle {
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

		p {
			display: inline-block;
		}
	}

	/deep/ .inputTitle2 {
		background: #FFF;
		height: 104px;
		padding: 20px;

		p {
			display: inline-block;
			word-break: break-word;
			width: calc(100% - 74px);
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			float: left;
		}
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
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

	/deep/ .ant-tag {
		margin: 4px;
		height: 24px;
		line-height: 23px;
	}

	.detailMask {
		position: absolute;
		width: 160px;
		height: 160px;
		background: rgba(250, 250, 250, 0.85);
		top: 22px;
	}
</style>