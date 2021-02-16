<template>
	<div class="list" ref="fansList">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider>
					<div class="sider-title">粉丝筛选</div>

					<div ref="scroll" @mousewheel="scrollWheel" class="sider-content"
					     style="width: 100%; height: 100%;overflow: hidden; position: absolute;"
					     @mouseover="scroll" @mouseout="scrollOut" @mousemove="scroLineMove" @mouseup="scroLineUp">
						<div ref="scroLeft"
						     class="sider-content"
						     style="position: fixed;top: 114px;bottom: 50px;width: 250px;"
						>
							<!-- 公众号 -->
							<div class="sider-one">
								<div class="sider-one-txt">选择公众号</div>
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 200px;"
										@change="handleChange"
										blur="onBlur"
										:defaultValue="this.$store.state.wxNum"
										v-if="wxInfo[0]"
								>
									<template v-for="item in wxInfo">
										<a-select-option :value="item.wx_id">{{item.nick_name}}</a-select-option>
									</template>
								</a-select>
							</div>
							<div class="sider-two">
								<!-- 昵称 -->
								<a-input
										placeholder="请输入粉丝昵称或是openid"
										class="sider-two-nickname"
										@keyup.enter='searchFans'
										v-model="inputNickName"
								/>
								<!-- 性别 -->
								<div class="sider-one-txt">性别</div>
								<a-form-item required>
									<a-radio-group @change="sexClick" v-model="sexValue">
										<a-radio-button style="border-radius: 4px;" value="3">全部</a-radio-button>
										<a-radio-button style="border-radius: 4px;" value="1">男</a-radio-button>
										<a-radio-button style="border-radius: 4px;" value="2">女</a-radio-button>
										<a-radio-button style="border-radius: 4px;" value="0">未知</a-radio-button>
									</a-radio-group>
								</a-form-item>
								<!-- 是否客户 -->
								<div class="sider-one-txt">是否客户</div>
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 195px;"
										v-model="is_custom"
								>
									<a-select-option :value="0">全部</a-select-option>
									<a-select-option :value="1">是</a-select-option>
									<a-select-option :value="2">否</a-select-option>
								</a-select>
								<!-- 时间 -->
								<div class="sider-one-txt">最新关注时间</div>
								<a-date-picker
										:disabledDate="disabledStartDate"
										format="YYYY-MM-DD HH:mm:ss"
										v-model="startValue"
										placeholder="开始时间"
										@openChange="handleStartOpenChange"
										@change="startTime"
										:show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
								/>
								<div>至</div>
								<a-date-picker
										:disabledDate="disabledEndDate"
										format="YYYY-MM-DD HH:mm:ss"
										placeholder="结束时间"
										@change="endTime"
										v-model="endValue"
										:open="endOpen"
										@openChange="handleEndOpenChange"
										:show-time="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
								/>
								<!-- 最后活跃时间 -->
								<div class="sider-one-txt">最后互动时间</div>
								<a-date-picker
										:disabledDate="disabledStartDate2"
										format="YYYY-MM-DD HH:mm:ss"
										@change="startTime2"
										v-model="startValue2"
										placeholder="开始时间"
										@openChange="handleStartOpenChange2"
										:show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
								/>
								<div>至</div>
								<a-date-picker
										:disabledDate="disabledEndDate2"
										format="YYYY-MM-DD HH:mm:ss"
										placeholder="结束时间"
										@change="endTime2"
										v-model="endValue2"
										:open="endOpen2"
										@openChange="handleEndOpenChange2"
										:show-time="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
								/>
								<!-- 粉丝来源 -->
								<div class="sider-one-txt">粉丝来源</div>
								<a-select
										style="width: 195px"
										@change="handleChange2"
										v-model="scene"
										:dropdownStyle="style"
								>
									<a-select-option value="全部来源">全部来源</a-select-option>
									<template v-for="(item,index) in sceneList">
										<a-select-option :value="index">{{item}}</a-select-option>
									</template>
								</a-select>
								<!-- 地域 -->
								<div class="sider-one-txt">地域</div>
								<a-cascader
										:options="cityData"
										@change="onChange"
										v-model="province1"
										style="width: 195px;text-align: left;"
								/>
								<!-- 标签 -->
								<div class="sider-one-txt">标签</div>
								<div class="sider-tags">
									<template v-for="(item,index) in tagsList">
										<a-checkable-tag style="margin: 0px 5px 5px 5px;"
										                 v-model="checked[index]"
										                 @change="handleChange3(item.key)"
										>{{item.name}}
										</a-checkable-tag>
									</template>
								</div>
							</div>
						</div>
						<div ref="scroRight" class="scro-right" @mouseup="jumpScroll">
							<div v-show="scrollFlag && scroRight" ref="scroLine" class="scro-line"
							     @mousedown="scroLineDown">

							</div>
						</div>
					</div>
					<!-- 确认搜索按钮 -->
					<div class="sider-footer">
						<a-button type="primary" style="margin-right: 25px;" @click="searchFans">确定搜索</a-button>
						<a-button @click="reset">重置条件</a-button>
					</div>
				</a-layout-sider>
				<a-layout
						style="position: absolute;left: 250px;top: 0;bottom: 0;right:0;"
						class="scroll"
				>
					<!-- 头部 -->
					<a-layout-header>
						<label class="fans-title">粉丝管理</label>
						<div class="help"
						     :class="showTransition == 0 ?'help-transition': (showTransition== 1 ? 'help-transition1' : '')">
							<a href="https://support.qq.com/products/104790/faqs/57076"
							   target="_blank">
								<a-icon type="question-circle" class="help-icon"/>
								<span style="float:right;">点我帮助</span>
							</a>
						</div>
						<!--						<a-tooltip placement="bottom">-->
						<!--							<template slot="title">-->
						<!--								<span>粉丝数量可能与微信后台不符，如需同步请手动点击【同步粉丝】。同步粉丝和打标签等任务完成后，可能需要10分钟左右才能刷新到页面上，请耐心等待。</span>-->
						<!--							</template>-->
						<!--							<a-icon type="question-circle" style="margin-left:5px;"/>-->
						<!--						</a-tooltip>-->
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								1、新用户接入本系统后可能需要一定时间同步粉丝信息，如公众号粉丝较多，则需要一定时间等待。</p>
							<p style="margin-bottom: 2px;">
								2、当出现个别粉丝的关注状态与微信公众后台的不同，总粉丝数与微信后台不同等情况，此时只需手动同步数据即可。</p>
							<p style="margin-bottom: 2px;">
								3、在本系统内给某粉丝打/移除标签会自动同步到微信公众平台。同步后，在微信后台查看可能存在延迟，请等待一定时间。</p>
							<p style="margin-bottom: 2px;">
								4、当在微信公众后台删除某标签，但尚未手动同步标签，此时在本系统依然可再给某粉丝打/移除该标签，且操作结果同步至微信公众后台。</p>
							<p style="margin-bottom: 0px;">
								5、当给大量粉丝执行打标签/移除标签操作中途卡住，任务停止时，可结束任务重新筛选粉丝，筛选并排除已经打上标签/移除的粉丝，减少批量操作任务量。</p>
						</div>
						<div class="content-hd">
							<div class="content-hd-left">
								共有
								<span style="color: blue">{{total}}</span>个粉丝
							</div>
							<div class="content-hd-right">
								<a-button class="btn-primary1" @click="showModal" type="primary"
								          v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
								           v-has="'fans-add-tag'">
									打标签
								</a-button>
								<a-button class="btn-primary1" @click="showConfirmWx" type="primary"
								          v-if="$store.state.authorizer_type == 'unauthorized' || !verify_service"
								           v-has="'fans-add-tag'">
									打标签
								</a-button>
								<a-button class="btn-primary1" @click="showModal1" type="primary"
								          v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
								           v-has="'fans-remove-tag'">
									移除标签
								</a-button>
								<a-button class="btn-primary1" @click="showConfirmWx" type="primary"
								          v-if="$store.state.authorizer_type == 'unauthorized' || !verify_service"
								           v-has="'fans-remove-tag'">
									移除标签
								</a-button>
								<a-button
										class="btn-primary1"
										style="text-align: center;"
										type="primary"
										@click="start"
										
										:disabled="hasSelect"
										:loading="loading1"
										v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
										v-has="'fans-export'"
								>
									<span>粉丝导出</span>
								</a-button>
								<a-button
										class="btn-primary1"
										style="text-align: center;"
										type="primary"
										@click="showConfirmWx"
										
										:disabled="hasSelect"
										:loading="loading1"
										v-if="$store.state.authorizer_type == 'unauthorized' || !verify_service"
										v-has="'fans-export'"
								>
									<span>粉丝导出</span>
								</a-button>
								<a-modal title="为筛选出的所有粉丝移除标签" v-model="visible1" @ok="handleOk1"
								         :confirmLoading="confirmLoading" width="800px">
									<label v-if="fansTag && fansTag.length>0"
									       style="display: block; margin-bottom: 10px; color: #F56C6C;">显示的标签，是当前勾选上的所有粉丝的全部标签。</label>
									<a-checkbox-group @change="onChange3" v-model="tagCheckValue1">
										<a-row>
											<a-col
													:span="6"
													style="margin-bottom: 10px;"
													v-for="item in fansTag"
													:key="item.tags_id"
											>
												<a-checkbox :value="item.tags_id">{{item.tag_name}}</a-checkbox>
											</a-col>
										</a-row>
										<div v-show="fansTag.length == 0">
											<img src="../../../assets/null.png" alt=""
											     style="display: block;margin: auto;width: 150px;">
											<p style="text-align: center;margin-top: 20px;">没有可移除的标签</p>
										</div>
									</a-checkbox-group>
								</a-modal>
								<a-popconfirm
										placement="bottomRight"
										okText="确认"
										cancelText="取消"
										@confirm="confirm"
								>
								</a-popconfirm>


								<a-modal title="为筛选出的所有粉丝增加标签" v-model="visible" @ok="handleOk"
								         :confirmLoading="confirmLoading2" @cancel="cancelVisible" width="800px">
									<p style="color: red;margin-bottom: 10px;">
										已勾选{{selectedRowKeys.length}}位粉丝，当前最多每人可再打{{tag_num}}个标签（由于每个粉丝最多可打上
										20
										个标签。当批量操作时，取最接近上限的粉丝的剩余可打标签数）。</p>
									<a-checkbox-group @change="onChange2" v-model="tagCheckValue">
										<a-row>
											<a-col
													:span="6"
													style="margin-bottom: 10px;"
													v-for="(item,index) in tagsList"
													:key="item.key"
											>
												<a-checkbox :value="item.key" :disabled="disabled[index]">
													{{item.name}}
												</a-checkbox>
											</a-col>
										</a-row>
									</a-checkbox-group>
									<a-input-search
											placeholder="请输入标签（不得超过6个字符）"
											@search="onSearch"
											enterButton="新建"
											v-model="inputValue" v-has="'tag-add'"
									/>
									<p style="margin: 10px 0;" v-has="'tag-add'">提示：输入一个标签后，空格后输入下一个标签，每个标签最多6个字</p>
								</a-modal>
								<a-popconfirm
										placement="bottomRight"
										okText="确认"
										cancelText="取消"
										@confirm="confirm"
								>
									<template slot="title">
										<p>每日最多3次同步粉丝；</p>
										<p>每次同步粉丝间隔2小时</p>
									</template>
									<a-button class="btn-primary1"
									          v-if="$store.state.authorizer_type != 'unauthorized' && verify_service "
									           v-has="'fans-sync'">
										同步粉丝
									</a-button>
								</a-popconfirm>
								<a-button class="btn-primary1"
								          v-if="$store.state.authorizer_type == 'unauthorized' || !verify_service"
								          
								          @click="showConfirmWx" v-has="'fans-sync'">
									同步粉丝
								</a-button>
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<div class="spin-content">
									<a-table
											:rowSelection="rowSelection"
											:columns="columns"
											:dataSource="fansList"
											:pagination="false"
											@change="handleTableChange"
											:rowClassName="rowClassName"
											v-has="'fans-look'"
									>
										<template slot="nickname" slot-scope="text, record, index">
											<a-avatar v-if="record.headerimg" shape="square" :src="record.headerimg"
											          style="width: 42px;height: 42px;float: left;"/>
											<img style="width: 42px;height: 42px;float: left;" v-if="!record.headerimg"
											     src="../../../assets/useradvart.png"/>
											<div style="width: calc(100% - 47px);margin-left: 5px;float: left;">
												<div>
													<span>{{text}}</span>
													<a-icon slot="prefix" type="man"
													        style="margin-left: 5px;color: #427EBA;"
													        v-if="record.sex==1"/>
													<a-icon
															slot="prefix"
															type="woman"
															style="margin-left: 5px;color: #ED4997;"
															v-if="record.sex==2"
													/>
												</div>
												<div v-if="record.corp_name && record.corp_name != ''"
												     style="color: #999;font-size: 12px;">企业微信：{{record.corp_name}}
												</div>
											</div>
										</template>
										<span slot="subscribe_time_title">
						                  关注时长/互动次数
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>以最后一次关注的时间开始记录。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<span slot="last_time_str">
						                  最后互动时间
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>48小时内互动（包括粉丝发送消息给公众号、点击自定义菜单、关注公众号、扫描二维码、支付成功、用户维权等，阅读公众号文章不算互动）的粉丝数。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
										<span slot="tags" slot-scope="tags_info">
											<span v-if="tags_info.length == 0">--</span>
                  <a-tag v-for="tag in tags_info" color="blue" style="margin-bottom: 5px;"
                         :key="tag.id">{{tag.name}}</a-tag>
                </span>
										<span slot="action" slot-scope="text, record, index">
                  <a href="javascript:;" @click="handleShowDetail(index)" v-has="'fans-info'">详情</a>
                </span>
									</a-table>
									<!-- 分页 -->
									<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0"
									     v-has="'fans-look'">
										<a-pagination
												:total="total"
												showSizeChanger
												:showQuickJumper="quickJumper"
												:current="page"
												:pageSize="page_size"
												:pageSizeOptions="['15','30','50','100']"
												@change="changePage"
												@showSizeChange="showSizeChange"
										/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import cityData from "../../../common/js/citydata.js";
	import {message} from "ant-design-vue";
	import moment from "moment";

	const columns = [
		{
			title      : "粉丝",
			dataIndex  : "nickname",
			width      : "22%",
			key        : "nickname",
			scopedSlots: {customRender: "nickname"}
		},
		{
			// title    : "关注时长/互动次数",
			dataIndex: "subscribe_day",
			width    : "14%",
			key      : "subscribe_day",
			slots    : {title: "subscribe_time_title"},
			customRender (text, row, index) {
				return row.subscribe_day + "天/" + row.interact_nums + "次";
			}
		},
		{
			title      : "最新关注时间",
			dataIndex  : "subscribe_time_str",
			// sorter   : (a, b) => a.subscribe_time - b.subscribe_time,
			sorter     : true,
			align      : "left",
			width      : "15%",
			key        : "subscribe_time_str",
			scopedSlots: {customRender: "subscribe_time_str"}
		},
		{
			title      : "标签",
			dataIndex  : "tags_info",
			width      : "14%",
			scopedSlots: {customRender: "tags"},
			key        : "tags"
		},
		{
			title    : "来源渠道",
			dataIndex: "subscribe_scene_str",
			width    : "12%",
			key      : "subscribe_scene_str"
		},
		{
			// title    : "最后互动时间",
			dataIndex: "last_time_str",
			width    : "15%",
			key      : "last_time_str",
			slots    : {title: "last_time_str"},
		},
		{
			title      : "操作",
			dataIndex  : "action",
			width      : "8%",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];
	export default {
		name: "fansList",
		data () {
			return {
				moment,
				showTransition : 1,
				mouseEnterFlag : false,
				startY         : 0,
				scrollFlag     : false,
				scroRight      : true,
				scrollOutFlag  : false,
				//关注时间
				startValue     : null,
				endValue       : null,
				endOpen        : false,
				//最后活跃时间
				startValue2    : null,
				endValue2      : null,
				endOpen2       : false,
				// 地域
				cityData,
				// 标签
				checked        : [],
				//共同标签
				commonChecked  : [],
				//打标签
				visible        : false,
				//移除标签
				visible1       : false,
				//标签值
				tagValue       : [],
				//表格部分
				columns,
				selectedRowKeys: [], // 选择多少条
				pageSize       : 15, //每页数据条数
				loading1       : false, //粉丝导出按钮加载图标
				wxInfo         : [], //微信公众号列表
				verify_service : false,
				fansList       : [], //粉丝列表
				sceneList      : [], //关注渠道列表
				scene          : "全部来源", //关注渠道
				tagsList       : [], //标签列表
				tagCheckValue  : [],//选中的tag
				tagCheckValue1 : [],//选中的tag
				inputNickName  : "", //输入的昵称
				sexValue       : "3", //性别,0未知，1男，2女
				is_custom      : 0,//是否客户，0全部，1是，2否
				wxScene        : "", //公众号来源
				page           : 1, //页码
				page_size      : 15, //每页数据量，默认15
				tag_arr        : [], //标签值数组
				tag_ids        : "", //标签值
				//common_tags    : ['1'], //共同标签
				province       : "", //省份
				city           : "", //城市
				province1      : ["全部"],
				s_time         : "", //关注开始时间
				e_time         : "", //关注结束时间
				last_s_time    : "", //最后活跃开始时间
				last_e_time    : "", //最后活跃结束时间
				//分页
				total          : 0, //总条数
				quickJumper    : false, // 是否显示快速跳转的控件
				isLoading      : true, //Loading 组件显示与隐藏
				//下拉菜单样式
				style          : {width: "200px"},
				keysArr        : [],//所有粉丝的键值
				fansTag        : [],//点击移除标签，所选中的粉丝的所有标签id数组
				confirmLoading : false,//移除标签对话框的确认按钮加载
				confirmLoading2: false,//打标签对话框的确认按钮加载
				inputValue     : '',//新建标签输入框值
				disabled       : [],//禁选标签
				selectArr      : [],//选择的表格行的标签数
				selectValueArr : [],//选择的表格行的标签数的值的集合
				selectValue    : [],//选择的表格行的标签数的值的集合，去重后
				commonTags     : [],//打标签时共有的标签id
				tag_count      : '',//全部粉丝的标签数
				tag_num        : '',//打标签还可选择的标签数
				sortNum        : 2,//关注时间排序，1正序、2倒序
				hasSelect      : true,//是否有粉丝被选中,导出按钮是否置灰
				sub_id         : localStorage.getItem("sub_id"),//选择的子账户id，空为主账户
			};
		},

		methods : {
			initHelp () {
				let that = this
				setInterval(function () {
					that.showTransition = (that.showTransition + 1) % 5;
				}, 1000)
			},
			//表格设置隔行换色
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			handleTableChange (pagination, filters, sorter) {
				//ascend升序，descend倒序
				if (sorter.order == "ascend") {
					this.isLoading = true
					this.sortNum = '1'
					this.getFans()
				} else if (sorter.order == "descend") {
					this.isLoading = true
					this.sortNum = '2'
					this.getFans()
				} else {
					this.isLoading = true
					this.sortNum = ''
					this.getFans()
				}
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
				this.getFans();
				this.getTags();
				this.isLoading = true;
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			onBlur (value) {
				this.$store.dispatch("changeWxNum", value);
				this.getTags();
				this.getFans();
				this.isLoading = true;
			},
			showConfirmWx () {
				if (this.$store.state.authorizer_type == 'unauthorized') {
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
			//选择性别
			sexClick (e) {
				this.sexValue = e.target.value;
			},
			// 关注时间
			disabledStartDate (startValue) {
				const endValue = this.endValue;
				if (!startValue || !endValue) {
					return false;
				}
				return startValue.valueOf() > endValue.valueOf();
			},
			disabledEndDate (endValue) {
				const startValue = this.startValue;
				if (!endValue || !startValue) {
					return false;
				}
				return startValue.valueOf() >= endValue.valueOf();
			},
			handleStartOpenChange (open) {
				if (!open) {
					this.endOpen = true;
				}
			},
			handleEndOpenChange (open) {
				this.endOpen = open;
			},
			startTime (startValue) {
				if (startValue == null) {
					this.s_time = ''
				} else {
					this.s_time = startValue.format("X");
				}
			},
			endTime (endValue) {
				if (endValue == null) {
					this.e_time = ''
				} else {
					this.e_time = endValue.format("X");
				}
			},
			//最后活跃时间
			disabledStartDate2 (startValue2) {
				const endValue2 = this.endValue2;
				if (!startValue2 || !endValue2) {
					return false;
				}
				return startValue2.valueOf() > endValue2.valueOf();
			},
			disabledEndDate2 (endValue2) {
				const startValue2 = this.startValue2;
				if (!endValue2 || !startValue2) {
					return false;
				}
				return startValue2.valueOf() >= endValue2.valueOf();
			},
			handleStartOpenChange2 (open2) {
				if (!open2) {
					this.endOpen2 = true;
				}
			},
			handleEndOpenChange2 (open2) {
				this.endOpen2 = open2;
			},
			startTime2 (startValue2) {
				if (startValue2 == null) {
					this.last_s_time = ''
				} else {
					this.last_s_time = startValue2.format("X");
				}
			},
			endTime2 (endValue2) {
				if (endValue2 == null) {
					this.last_e_time = ''
				} else {
					this.last_e_time = endValue2.format("X");
				}
			},
			// 粉丝来源
			handleChange2 (value) {
				if (value != "全部来源") {
					this.wxScene = value;
				} else {
					this.wxScene = "";
				}
			},
			// 地域
			onChange (value) {
				// console.log(value)
				if (value[0] != "全部") {
					this.province = value[0];
				} else {
					this.province = "";
				}
				if (value[1] != "全部") {
					this.city = value[1];
				} else {
					this.city = "";
				}
			},
			//标签
			handleChange3 (key) {
				Array.prototype.indexOf = function (val) {
					for (var i = 0; i < this.length; i++) {
						if (this[i] == val) return i;
					}
					return -1;
				};
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val);
					if (index > -1) {
						this.splice(index, 1);
					}
				};
				if (this.tag_arr.includes(key)) {
					this.tag_arr.remove(key);
				} else {
					this.tag_arr.push(key);
				}
			},
			//点击确定搜索
			searchFans () {
				this.tag_ids = this.tag_arr.join();
				this.getFans();
				this.isLoading = true;
			},
			//点击重置条件
			reset () {
				this.isLoading = true
				this.inputNickName = "";
				this.sexValue = "3";
				this.is_custom = 0;
				this.startValue = null;
				this.endValue = null;
				this.startValue2 = null;
				this.endValue2 = null;
				this.scene = "全部来源";
				this.wxScene = "";
				this.province1 = ["全部"];
				this.province = "";
				this.city = "";
				this.checked = [];
				this.tag_arr = [];
				this.tag_ids = "";
				this.s_time = '';
				this.e_time = '';
				this.last_s_time = '';
				this.last_e_time = '';
				this.selectedRowKeys = []
				this.getFans()
			},
			//同步粉丝气泡提示
			confirm () {
				message.info("已进入后台刷新中，请耐心等待...", 2, this.refreshFans)
			},
			async refreshFans () {
				this.isLoading = true
				const {data: res} = await this.axios.post("fans/refresh-user-list", {
					wx_id: localStorage.getItem('wxNum')
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg)
				} else {
					this.$message.destroy()
					this.getFans();
				}
			},
			// 打标签
			showModal () {
				// console.log(this.selectedRowKeys,'this.selectedRowKeys')
				// console.log(this.selectArr,'this.selectArr')
				// console.log(Math.max(...this.selectArr))
				let keys = this.selectedRowKeys;
				if (keys.length == 0) {
					this.$message.warning("请先选择粉丝");
					return false;
				}
				if (20 - Math.max(...this.selectArr) <= 0) {
					this.disabled = []
					for (let i = 0; i < this.tagsList.length; i++) {
						let disabled = true;
						this.disabled.push(disabled);
					}
				}

				function unique (arr) {
					return Array.from(new Set(arr))
				}

				this.selectValue = unique(this.selectValueArr)
				// console.log(this.selectValue, 'this.selectValue')
				this.tagCheckValue = [];
				this.visible = true;
				this.addCommonTags();
			},
			handleOk () {
				if (this.tagCheckValue.length == this.commonTags.length) {
					this.$message.warning("请选择要打的标签");
				} else {
					this.confirmLoading2 = true;
					this.addTagsMore();
				}
			},
			cancelVisible () {
				this.visible = false
				this.disabled = []
				this.tag_num = 20 - Math.max(...this.selectArr)
				this.inputValue = ''
				this.tagValue = []
			},
			// 移除标签
			showModal1 () {
				let keys = this.selectedRowKeys;
				if (keys.length == 0) {
					this.$message.warning("请先选择粉丝");
					return false;
				}
				this.tagCheckValue1 = [];
				this.getFansTag()

			},
			//获取批量移除的粉丝标签
			async getFansTag () {
				const {data: res} = await this.axios.post("fans/fans-tags", {
					fans_ids: this.selectedRowKeys
				});
				// console.log(res)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.fansTag = res.data
				}
				this.visible1 = true;
			},
			handleOk1 () {
				if (this.tagCheckValue1.length == 0) {
					this.$message.warning("请选择要移除的标签");
				} else {
					this.removeTagsMore();
					this.confirmLoading = true
				}
			},
			onChange2 (checkedValues) {
				var a = checkedValues.length - this.commonTags.length
				this.tag_num = 20 - Math.max(...this.selectArr) - a
				// console.log(checkedValues, 'checkedValues')
				// console.log(checkedValues[checkedValues.length - 1], '新选中的标签')
				// console.log(this.commonTags,'this.commonTags');
				// console.log(this.tagCheckValue,'this.tagCheckValue');

				//选中的标签不在已有的标签中为-1
				// if (this.selectValue.indexOf(checkedValues[checkedValues.length - 1]) == -1) {
				// 	console.log('存在')
				// }
				// console.log(this.disabled, '7')
				if (this.tagCheckValue.length - this.commonTags.length == 20 - Math.max(...this.selectArr)) {
					this.disabled = []
					for (let i = 0; i < this.tagsList.length; i++) {
						let disabled = true;
						this.disabled.push(disabled);
					}
					for (let j = 0; j < this.tagsList.length; j++) {
						for (let n = 0; n < checkedValues.length; n++) {
							if (this.tagsList[j].key == checkedValues[n]) {
								this.disabled[j] = false
							}
						}
						for (let x = 0; x < this.commonTags.length; x++) {
							if (this.tagsList[j].key == this.commonTags[x]) {
								this.disabled[j] = true
							}
						}
					}
					// console.log(this.disabled, '8')
					// console.log(this.tagCheckValue,'this.tagCheckValue')
				} else if (this.tagCheckValue.length - this.commonTags.length < 20 - Math.max(...this.selectArr)) {
					this.disabled = []
					for (let i = 0; i < this.tagsList.length; i++) {
						let disabled = false;
						this.disabled.push(disabled);
					}
					for (let j = 0; j < this.tagsList.length; j++) {
						for (let x = 0; x < this.commonTags.length; x++) {
							if (this.tagsList[j].key == this.commonTags[x]) {
								this.disabled[j] = true
							}
						}
					}
					// console.log(this.disabled, '9')
					// console.log(this.tagCheckValue,'222')
				}
			},
			onChange3 (checkedValues) {
				this.tagCheckValue1 = checkedValues;
				// console.log(this.tagCheckValue);
			},
			//新建标签
			onSearch (value) {
				if (this.tagsList.length >= 100) {
					this.$message.warning("标签数量已超过上限100个，无法创建");
					return false;
				}
				if (value == "") {
					this.$message.warning("不能为空");
					return false;
				} else {
					this.tagValue = []
					for (var i = 0; i < value.split(" ").length; i++) {
						if (value.split(" ")[i].length > 6) {
							this.$message.error("每个标签最多6个字");
							this.inputValue = "";
							return false
						} else if (value.split(" ")[i].length > 0) {
							this.tagValue.push(value.split(" ")[i]);
						}
					}
					if (this.tagsList.length + this.tagValue.length > 100) {
						let a = 100 - this.tagsList.length
						this.$message.error("抱歉，您当前最多只能新建" + a + "个标签，请重新提交");
						this.inputValue = "";
						this.tagValue = []
						return false
					}
					this.addTags();
				}
			},
			//表格部分
			//粉丝导出
			start () {
				this.fansExport();
			},
			onSelectChange (selectedRowKeys, value) {
				this.selectArr = []
				for (let i = 0; i < value.length; i++) {
					this.selectArr.push(value[i].tags_info.length)
				}
				this.tag_num = 20 - Math.max(...this.selectArr)
				this.selectedRowKeys = selectedRowKeys;

				if (this.selectedRowKeys.length > 0) {
					this.hasSelect = false
				} else {
					this.hasSelect = true
				}
			},
			onSelectRow (record, selected, selectedRows, nativeEvent) {
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val);
					if (index > -1) {
						this.splice(index, 1);
					}
				};
				if (selected) {
					this.selectArr.push(record.tags_info.length)
					for (let i = 0; i < record.tags_info.length; i++) {
						this.selectValueArr.push(record.tags_info[i].tag_id)
					}
					this.tag_num = 20 - Math.max(...this.selectArr)
				} else {
					this.selectArr.remove(record.tags_info.length)
					for (let i = 0; i < record.tags_info.length; i++) {
						this.selectValueArr.remove(record.tags_info[i].tag_id)
					}
					this.tag_num = 20 - Math.max(...this.selectArr)
				}

			},
			//粉丝导出
			async fansExport () {
				// console.log(this.selectedRowKeys, 'this.selectedRowKeys')
				this.loading1 = true;
				const {data: res} = await this.axios.post(
					"fans/fans-export",
					{
						fans_id: this.selectedRowKeys,
						sort   : this.sortNum
					}
				);
				if (res.error == 0) {
					setTimeout(() => {
						this.loading1 = false;
						window.open(res.data.url);
						this.selectedRowKeys = [];
						this.hasSelect = true
					}, 2000);
				} else {
					this.$message.error(res.error_msg);
					this.loading1 = false;
				}
			},
			//获取共同标签
			async addCommonTags () {
				const {data: res} = await this.axios.post("fans/fans-common-tags", {
					fans_ids: this.selectedRowKeys
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagCheckValue = res.data;
					this.commonTags = res.data
					// console.log(this.disabled, '3')
					for (let i = 0; i < this.tagsList.length; i++) {
						for (let j = 0; j < this.tagCheckValue.length; j++) {
							if (this.tagCheckValue[j] == this.tagsList[i].key) {
								this.disabled[i] = true
							}
						}
					}
					// console.log(this.tagCheckValue, '4')
				}
			},
			//批量添加标签
			async addTagsMore () {
				const {data: res} = await this.axios.post("fans/give-user-tags", {
					wx_id   : localStorage.getItem('wxNum'),
					tag_ids : this.tagCheckValue,
					fans_ids: this.selectedRowKeys,
					type    : 0
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading2 = false;
				} else {
					this.$message.success(res.error_msg);
					this.selectedRowKeys = [];
					this.visible = false
					this.confirmLoading2 = false;
					this.disabled = []
					this.getFans();
				}
			},
			//批量移除标签
			async removeTagsMore () {
				const {data: res} = await this.axios.post("fans/give-user-tags", {
					wx_id   : localStorage.getItem('wxNum'),
					tag_ids : this.tagCheckValue1,
					fans_ids: this.selectedRowKeys,
					type    : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.$message.success(res.error_msg);
					this.selectedRowKeys = [];
					this.visible1 = false;
					this.confirmLoading = false
					this.selectValueArr = []
					this.selectArr = []
					this.commonTags = []
					this.selectValue = []
					this.getFans();
				}
			},
			//创建标签
			async addTags () {
				const {data: res} = await this.axios.post("tags/tags-create", {
					wx_id   : localStorage.getItem('wxNum'),
					tag_name: this.tagValue
				});
				if (res.error != 0) {
					if (res.error_msg == '标签名非法，请注意不能和其他标签重名') {
						this.$message.error('该标签名称与微信标签重复，请手动同步微信标签即可。');
					} else {
						this.$message.error(res.error_msg);
					}
				} else {
					this.$message.success('新建标签成功');
					this.getTags2();
				}
			},
			//获取关注渠道
			async getScene () {
				const {data: res} = await this.axios.post("fans/get-scene", {
					wx_id: localStorage.getItem('wxNum')
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				}
				{
					this.sceneList = res.data;
				}
			},
			//获取标签
			async getTags () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id: localStorage.getItem('wxNum'),
					type : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					for (var i = 0; i < this.tagsList.length; i++) {
						var checked = false;
						this.checked.push(checked);
					}
					// console.log(this.tagCheckValue, 'this.tagCheckValue')
					// console.log(this.tagsList, 'this.tagsList')
					if (20 - Math.max(...this.selectArr) <= 0) {
						this.disabled = []
						for (let i = 0; i < this.tagsList.length; i++) {
							let disabled = true;
							this.disabled.push(disabled);
						}
					}
				}
			},
			async getTags2 () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id: localStorage.getItem('wxNum'),
					type : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					// console.log(this.tagCheckValue, 'this.tagCheckValue')
					// console.log(this.tagsList, 'this.tagsList')
					// console.log(this.tagValue, 'tagValue')
					// console.log(this.commonTags, 'this.commonTags');
					// console.log(this.tagCheckValue, 'this.tagCheckValue');
					if (20 - Math.max(...this.selectArr) <= 0) {
						this.disabled = []
						for (let i = 0; i < this.tagsList.length; i++) {
							let disabled = true;
							this.disabled.push(disabled);
						}
					} else {
						if (this.tagCheckValue.length != this.commonTags.length) {
							if (this.tag_num == 0) {
								for (let i = 0; i < this.tagValue.length; i++) {
									let disabled = true;
									this.disabled.unshift(disabled);
								}
							} else {
								for (let i = 0; i < this.tagValue.length; i++) {
									let disabled = false;
									this.disabled.unshift(disabled);
								}
							}
						} else {
							for (let i = 0; i < this.tagsList.length; i++) {
								this.disabled[i] = false
								for (let j = 0; j < this.tagCheckValue.length; j++) {
									if (this.tagCheckValue[j] == this.tagsList[i].key) {
										this.disabled[i] = true
									}
								}
							}
						}
					}
					this.inputValue = "";
					this.tagValue = []
					// console.log(this.disabled, '10')
				}
			},
			//获取表格数据
			async getFans (page = 1, page_size = this.page_size) {
				var sexVal = "";
				if (this.sexValue == "3") {
					sexVal = "";
				} else {
					sexVal = this.sexValue;
				}
				const {data: res} = await this.axios.post("fans/get-user-list", {
					wx_id      : this.$store.state.wxNum,
					page       : page,
					page_size  : page_size,
					tag_ids    : this.tag_ids,
					sex        : sexVal,
					is_custom  : this.is_custom,
					source     : this.wxScene,
					province   : this.province,
					city       : this.city,
					s_time     : this.s_time,
					e_time     : this.e_time,
					keyword    : this.inputNickName,
					last_s_time: this.last_s_time,
					last_e_time: this.last_e_time,
					sort       : this.sortNum
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.fansList = res.data.fans;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.page_size = page_size;
					this.quickJumper = this.total > this.pageSize;
					this.isLoading = false;
					this.keysArr = res.data.keys
					this.tag_count = res.data.tag_count
					//确认到底选中多少粉丝，给selectedRowKeys赋值
					let arr = this.selectedRowKeys
					this.selectedRowKeys = []
					arr.map((x) => {
						res.data.keys.map((k) => {
							if (k == x) {
								return this.selectedRowKeys.push(x)
							}
						})
					})
					// console.log(this.selectedRowKeys, '筛选后')
					if (this.selectedRowKeys.length > 0) {
						this.hasSelect = false
					} else {
						this.hasSelect = true
					}
				}
			},
			// 分页
			changePage (page, page_size) {
				this.getFans(page, page_size);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 150)
				})
			},
			showSizeChange (page, page_size) {
				this.getFans(1, page_size);
			},
			handleShowDetail (index) {
				let query = {
					id: this.fansList[index].fans_id
				}
				this.$router.push({path: '/fans/detail', query: query})
			},
			// 滚动条高度
			setScroLineHeight () {
				let that = this
				let winHeight = 0;
				winHeight = that.$refs.scroLeft.clientHeight;
				if (winHeight >= that.$refs.scroLeft.scrollHeight) {
					that.scroRight = false
				} else {
					// that.$refs.scroLine.style.height = "200px"
					that.$refs.scroLine.style.height = (winHeight - 50) / that.$refs.scroLeft.scrollHeight * (that.$refs.scroRight.scrollHeight - 50) + "px";
					that.scroRight = true
				}
			},
			// 滑轮滚动（火狐）
			initFirefoxScroll () {
				let that = this
				if (document.addEventListener) {
					document.addEventListener('DOMMouseScroll', function (e) {
						let event1 = window.event || e;
						let Y = that.$refs.scroLeft.scrollTop;
						let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
						if (event1.detail >= 0) {
							Y = Y + 80
						} else {
							Y = Y - 80
						}
						if (Y < 0) Y = 0;
						if (Y > H - 50) Y = H;
						that.$refs.scroLeft.scrollTop = Y;
						let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
						if (Y > 0 && Y < H - 50) {
							SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
						}
						if (SH > this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight) {
							SH = this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight
						}
						if (SH < 0) SH = 0;
						that.$refs.scroLine.style.top = SH + "px";
					}, false)
				}
			},
			// 滑轮滚动
			scrollWheel () {
				var event = event ? event : (window.event ? window.event : null);
				let Y = this.$refs.scroLeft.scrollTop;
				let H = this.$refs.scroLeft.scrollHeight - this.$refs.scroLeft.clientHeight;
				if (event.wheelDelta >= 120) {
					Y = Y - event.wheelDelta * 0.5
				} else {
					Y = Y - event.wheelDelta * 0.5
				}
				if (Y < 0) Y = 0;
				if (Y > H) Y = H;
				this.$refs.scroLeft.scrollTop = Y;
				let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
				if (Y > 0 && Y < H) {
					SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
				}
				if (SH < 0) SH = 0;
				this.$refs.scroLine.style.top = SH + "px";
			},
			// 滚动栏点击跳转
			jumpScroll () {
				let that = this
				if (!that.mouseEnterFlag) {
					var event = event ? event : (window.event ? window.event : null);
					let Y = that.$refs.scroLeft.scrollTop;
					let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
					if (event.y - that.startY >= 0) {
						Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
					} else {
						Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
					}
					that.$refs.scroLeft.scrollTop = Y;
					if (Y < 0) {
						Y = 0;
					}
					if (Y > H) {
						Y = H;
					}
					let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
					if (Y > 0 && Y < H) {
						SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
					}
					if (SH < 0) SH = 0;
					that.$refs.scroLine.style.top = SH + "px";
					that.startY = event.y
				}
			},
			// 滚动条点击
			scroLineDown () {
				this.mouseEnterFlag = true
				this.startY = event.y;  // 按下鼠标指针的y轴坐标
				if (window.addEventListener) {
					window.addEventListener('mouseup', this.scroLineUp, false)
					window.addEventListener('mousemove', this.scroLineMove, false)
				}
				this.banUserSelect();
			},
			// 滚动条长按移动
			scroLineMove () {
				let that = this
				if (that.mouseEnterFlag) {
					var event = event ? event : (window.event ? window.event : null);
					let Y = that.$refs.scroLeft.scrollTop;
					let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
					let CH = (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight;
					Y = Y + CH;
					that.$refs.scroLeft.scrollTop = Y;
					if (Y < 0) {
						Y = 0;
					}
					if (Y > H) {
						Y = H;
					}
					let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
					if (Y > 0 && Y < H) {
						SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
					}
					if (SH < 0) SH = 0;
					that.$refs.scroLine.style.top = SH + "px";

					that.startY = event.y;
				}
			},
			// 鼠标左击抬起
			scroLineUp () {
				if (this.mouseEnterFlag == true) {
					var event = event ? event : (window.event ? window.event : null);
					this.mouseEnterFlag = false
					if (this.changeWidthSmallFlag) {
						this.changeWidthSmall()
						this.changeWidthSmallFlag = false
					}
					if (this.scrollOutFlag) {
						this.scrollOut()
						this.scrollOutFlag = false
					}
					if (window.removeEventListener) {
						window.removeEventListener('mouseup', this.scroLineUp, false)
						window.removeEventListener('mousemove', this.scroLineMove, false)
					}
					this.userSelect()
				}
			},
			// 鼠标进入左边页面
			scroll () {
				this.scrollFlag = true
			},
			// 鼠标移出左边页面
			scrollOut () {
				if (!this.mouseEnterFlag) {
					this.scrollFlag = false
				}
				this.scrollOutFlag = true
			},
			banUserSelect () {
				this.$refs.fansList.style.MozUserSelect = 'none'
				this.$refs.fansList.style.UserSelect = 'none'
				this.$refs.fansList.style.webkitUserSelect = 'none'
				this.$refs.fansList.style.MsUserSelect = 'none'
			},
			userSelect () {
				this.$refs.fansList.style.MozUserSelect = 'text'
				this.$refs.fansList.style.UserSelect = 'text'
				this.$refs.fansList.style.webkitUserSelect = 'text'
				this.$refs.fansList.style.MsUserSelect = 'text'
			}
		},
		computed: {
			rowSelection () {
				const {selectedRowKeys} = this;
				return {
					selectedRowKeys,
					onChange             : this.onSelectChange,
					hideDefaultSelections: true,
					onSelect             : this.onSelectRow,
					selections           : [
						{
							key     : "current-data",
							text    : "当前页",
							onSelect: changableRowKeys => {
								this.selectedRowKeys = changableRowKeys;
								this.selectArr = []
								for (let i = 0; i < this.fansList.length; i++) {
									this.selectArr.push(this.fansList[i].tags_info.length)
								}
								this.tag_num = 20 - Math.max(...this.selectArr)
								if (this.selectedRowKeys.length > 0) {
									this.hasSelect = false
								} else {
									this.hasSelect = true
								}
							}
						},
						{
							key     : "all-data",
							text    : "选择所有项",
							onSelect: () => {
								this.selectedRowKeys = [...this.keysArr.valueOf()];
								this.selectArr = this.tag_count
								this.tag_num = 20 - Math.max(...this.selectArr)
								if (this.selectedRowKeys.length > 0) {
									this.hasSelect = false
								} else {
									this.hasSelect = true
								}
							}
						}
					],
					onSelection          : this.onSelection
				};
			}
		},
		mounted () {
			let that = this
			this.$store.dispatch('getWx', (info) => {
				that.wxInfo = info;
				if (that.wxInfo.length > 0) {
					that.verify_service = this.wxInfo[this.$store.state.wxNumIndex].verify_type === '已认证';
				}
				let observer = new MutationObserver(this.setScroLineHeight)
				observer.observe(that.$refs.scroLine, {
					attributes       : true,
					attributeFilter  : ['style'],
					attributeOldValue: true
				})
				that.setScroLineHeight()
				that.initFirefoxScroll()
			});
			this.initHelp()
			this.getFans();
			this.getScene();
			this.getTags();
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path != '/fans/detail') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.isLoading = true
					vm.inputNickName = "";
					vm.sexValue = "3";
					vm.is_custom = 0;
					vm.startValue = null;
					vm.endValue = null;
					vm.startValue2 = null;
					vm.endValue2 = null;
					vm.scene = "全部来源";
					vm.wxScene = "";
					vm.province1 = ["全部"];
					vm.province = "";
					vm.city = "";
					vm.checked = [];
					vm.tag_arr = [];
					vm.tag_ids = "";
					vm.s_time = '';
					vm.e_time = '';
					vm.last_s_time = '';
					vm.last_e_time = '';
					vm.selectedRowKeys = []
					vm.page = 1
					vm.page_size = 15
					vm.getFans()
				});
			}

			next()
		},
	}
	;
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	#components-layout-demo-basic {
		text-align: center;
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
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
		margin-left: 20px;
		padding-right: 20px;
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

	.list {
		overflow-y: hidden;
	}

	.sider-title {
		height: 50px;
		width: 250px;
		border-bottom: 1px solid #E2E2E2;
		line-height: 50px;
	}

	.fans-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.help {
		float: left;
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

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
		text-align: left;
	}

	/*滚动条背景*/
	.scro-right {
		position: relative;
		float: right;
		/*height: 100%;*/
		height: 100%;
		height: calc(100% - 50px) !important;
		/*height: -moz-calc(100% - 50px);*/
		/*height: -webkit-calc(100% - 50px);*/
		width: 3px;
		background-color: #FFF;
		overflow: hidden;
	}

	/*滚动条*/
	.scro-line {
		position: absolute;
		z-index: 1;
		top: 0px;
		right: 0px;
		width: 3px;
		border-radius: 3px;
		/*height: 100px;*/
		overflow: hidden;
		background-color: #D3D3D3;
	}

	.sider-content {
		float: left;
		width: 100%;
		width: calc(100% - 3px);
		width: -moz-calc(100% - 3px);
		width: -webkit-calc(100% - 3px);
		max-height: 100%;
		overflow: hidden;
	}


	.sider-one {
		height: 120px;
		border-bottom: 1px solid #E2E2E2;
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.sider-two {
		padding: 0 20px;
	}

	.sider-two-nickname {
		margin: 20px 0 0;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}

	.header-txt {
		color: red;
		font-size: 14px;
		margin-left: 10px;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 5px;
	}

	.sider-tags {
		text-align: left;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	.sider-footer {
		position: fixed;
		height: 50px;
		width: 250px;
		bottom: 0;
		background-color: #FFF;
		border-top: 1px solid #E2E2E2;
		padding-top: 10px;
		z-index: 999;
	}

	/deep/ .ant-radio-button-wrapper {
		margin: 0 4px;
	}

	.content-hd-left {
		float: left;
	}

	.content-hd-right {
		float: right;
	}

	.btn-primary {
		width: 108px;
		height: 30px;
		margin-left: 20px;
		text-align: left;
		padding: 0;

		span {
			display: inline-block;
			width: 90px;
			height: 30px;
			line-height: 30px;
			text-align: center;
		}
	}

	.btn-primary1 {
		width: 108px;
		height: 30px;
		margin-left: 20px;
		padding: 0px 15px;
	}

	.btn-primary1[disabled] {
		background-color: #F5F5F5;
		border-color: #D9D9D9;
	}

	.remove-tag {
		background-color: #F56C6C;
		border-color: #F56C6C;
		color: white;
	}

	p {
		margin: 0;
	}

	/deep/ .ant-table-thead > tr > th .ant-table-column-sorter {
		left: 110px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}
</style>