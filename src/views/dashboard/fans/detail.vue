<template>
	<div class="fans-detail">
		<div style="height: 60px; line-height: 60px;background-color: #FFFFFF;border-bottom: 1px solid #E2E2E2;font-size: 16px;padding: 0px 20px;">
			粉丝详情
			<router-link to="/fans/list" style="font-size: 16px;float: right;">
				<a-button type="primary" icon="rollback">返回列表</a-button>
			</router-link>
		</div>
		<div class="layout-left">
			<div class="user-info">
				<div class="title">
					<label>基础信息</label>
				</div>
				<div class="center-align">
					<img style="width: 132px;height: 132px;" v-if="userInfo.headerimg == '' || userInfo.headerimg == null"
					     src="../../../assets/userface.png"/>
					<img :src="userInfo.headerimg" v-else>
				</div>
				<div class="center-align">
					<label>{{userInfo.nickname}}</label>
				</div>
				<div class="center-align" v-if="userInfo.follow_title">
					<a-tag color="#67c23a" style="margin-right: 0;height: 25px;line-height: 25px;">
					       {{userInfo.follow_title}}
					</a-tag>
				</div>
				<div class="center-align">
					<label>{{userInfo.interact_time}}</label>
				</div>
				<div>
					<span style="vertical-align: middle;">openId：</span>
					<span class="userinfo-openid">
						{{userInfo.openid}}
					</span>
					<a style="margin-left: 10px;vertical-align: middle;" v-if="userInfo.openid"
					   @click="copyText(userInfo.openid)">复制</a>
				</div>
				<div>
					<span style="vertical-align: middle;">unionid：</span>
					<span class="userinfo-openid">
						{{userInfo.unionid}}
					</span>
					<a style="margin-left: 10px;vertical-align: middle;" v-if="userInfo.unionid"
					   @click="copyText(userInfo.unionid)">复制</a>
				</div>
				<div>
					<label>备注：</label>
					<label v-show="!remarkVisible">{{userInfo.remark}}</label>
					<label v-show="remarkVisible">最多10个汉字</label>
					<span
							class="fans-remark-edit"
							@click="modifyRemark"
							v-show="!remarkVisible">
						<a-icon type="edit" alt="" style="margin-left: 5px;"/>
					</span>
					<a-input-search
							style="'width: 100px;"
							:defaultValue="userInfo.remark"
							placeholder="输入用户的备注"
							@search="setRemark"
							:maxLength="10"
							v-if="remarkVisible">
						<a-button
								slot="enterButton"
								type="primary">
							<a-icon type="check"/>
						</a-button>
					</a-input-search>
				</div>
				<div>
					<label>
						性别：<span v-if="userInfo.sex == 1">男</span><span v-if="userInfo.sex == 2">女</span>
					</label>
				</div>
				<div>
					<label>地域：{{userInfo.province}}-{{userInfo.city}}</label>
				</div>
				<div>
					<label>渠道来源：{{userInfo.subscribe_scene_str}}</label>
				</div>
				<div>
					<label>关注时间：{{userInfo.subscribe_time}}</label>
					<a-tooltip placement="top" :destroyTooltipOnHide="true"
					           v-if="userInfo.subscribe_time != '--' && subTimeList.length > 0">
						<template slot="title">
							<div style="width: 160px;max-height: 195px;text-align: center;overflow-y: auto;">
								<p style="margin-bottom: 2px; text-align: left;">历史关注：</p>
								<p style="margin-bottom: 2px;" v-for="item in subTimeList"> {{item}}</p>
							</div>
						</template>
						<a-icon type="question-circle" style="margin-left:5px;"/>
					</a-tooltip>
				</div>
				<div>
					<label>上次互动时间：{{userInfo.last_time}}</label>
				</div>
				<div>
					<label>取关时间：{{userInfo.unsubscribe_time}}</label>
					<a-tooltip placement="top" :destroyTooltipOnHide="true"
					           v-if="userInfo.unsubscribe_time != '--' && unsubTimeList.length > 0">
						<template slot="title">
							<div style="width: 160px;max-height: 195px;text-align: center;overflow-y: auto;">
								<p style="margin-bottom: 2px; text-align: left;">历史取关：</p>
								<p style="margin-bottom: 2px;" v-for="item in unsubTimeList"> {{item}}</p>
							</div>
						</template>
						<a-icon type="question-circle" style="margin-left:5px;"/>
					</a-tooltip>
				</div>
				<div>
					<span>
						<label>标签：</label>
						<span v-for="item in hasTagsValue">
							<a-tag color="blue" style="margin-top: 0;">{{item}}</a-tag>
						</span>
					</span>
					<span v-has="'fans-add-tag'">
						<a-icon @click="showModal" type="edit" style="margin-left: 5px;"/>
					</span>
				</div>
			</div>
		</div>
		<div class="layout-contain">
			<div style="height:100%; background-color: #FFFFFF">
				<div class="account-filter-contain">
					<div class="account-filter-item" @click="changeTab(0)"
					     :class="selectedTab == 0?'active':''"
					     style="border-left: 0px;min-width: 20px;">
						<label>用户画像</label>
					</div>
					<div class="account-filter-item" @click="changeTab(1)"
					     :class="selectedTab == 1?'active':''"
					     style="border-left: 0px;min-width: 20px;">
						<label>指标分析</label>
					</div>
					<div class="account-filter-item" @click="changeTab(2)"
					     :class="selectedTab == 2?'active':''"
					     style="min-width: 20px;">
						<label>互动轨迹</label>
					</div>
					<div class="account-filter-item" @click="changeTab(3)"
					     :class="selectedTab == 3?'active':''"
					     style="min-width: 20px;">
						<label>跟进记录</label>
					</div>
					<!--					<div class="account-filter-item" @click='changeTab(3)'-->
					<!--					     :class="selectedTab == 3?'active':''"-->
					<!--					     style="min-width: 20px;">-->
					<!--						<label>消息管理</label>-->
					<!--					</div>-->
				</div>
				<div v-show="selectedTab==0" class="content">
					<a-spin tip="Loading..." size="large" :spinning="isLoading">
						<div style="overflow:hidden;margin-bottom: 10px;">
							<div style="float:right;">
								<a-button type="primary" @click="editBadicInfo" v-if="!badicInfoVisible">编辑
								</a-button>
								<a-button @click="cancleBadicInfo" v-if="badicInfoVisible"
								          style="margin-right: 15px;">取消
								</a-button>
								<a-button type="primary" @click="submitBadicInfo" v-if="badicInfoVisible">提交
								</a-button>
							</div>
						</div>
						<div class="col2">
							<div class="half" v-for="(item, index) in field_list">
								<a-tag color="#1890ff">{{item.title}}</a-tag>
								<span class="half-text"
								      v-if="!badicInfoVisible && item.value != '' && item.type != 8 ">{{item.value}}</span>
								<span class="half-text"
								      v-if="!badicInfoVisible && item.value.length != 0 && item.type == 8">
												<img v-for="item1 in item.value" @click="preview(commonUrl + item1.url)"
												     :src="commonUrl + item1.url"
												     style="max-width: 70px; max-height: 70px;margin: 2px;line-height: 0px;cursor: pointer;">
											</span>
								<span class="half-text" v-if="!badicInfoVisible && item.value == ''">暂无</span>
								<template v-if="badicInfoVisible">
									<!--图片-->
									<span v-if="item.type == 8" class="clearfix"
									      style="width: 45%;float: right;margin-top:4px;line-height: 0px;">
													<a-upload
															class="upload-pic"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															list-type="picture-card"
															:fileList="item.picUrl || []"
															@preview="handlePreview"
															:beforeUpload="beforeUploadPic"
															@change="e => handleChangePic(e, index)"
													>
														<div>
															<a-icon type="plus"/>
															<div class="ant-upload-text" style="font-size: 12px;">
																上传图片
															</div>
														</div>
													</a-upload>
												</span>
									<!--单选-->
									<a-select :defaultValue="item.hasOption"
									          style="width: 45%;float: right;margin-top:4px;"
									          @change="e => handleChange(e,item.fieldid)" v-if="item.type == 2"
									          :placeholder="'请选择'+item.title" allowClear>
										<a-select-option :value="option" v-for="option in item.optionVal2">{{option}}
										</a-select-option>
									</a-select>
									<!--多选-->
									<a-select
											mode="multiple"
											:defaultValue="item.hasOption"
											style="width: 45%;float: right;margin-top:4px;"
											@change="e => handleChange2(e,item.fieldid)"
											v-if="item.type == 3" :placeholder="'请选择'+item.title"
									>
										<a-select-option :value="option" v-for="option in item.optionVal2">{{option}}
										</a-select-option>
									</a-select>
									<!--输入框-->
									<a-input v-if="item.type != 2 && item.type != 3 && item.type != 7 && item.type != 4 && item.type != 8"
									         style="width: 45%;float: right;margin-top: 4px;"
									         :defaultValue="item.value"
									         @change="e => changeInput(e.target.value,item.fieldid)"
									         :placeholder="'请输入'+item.title"/>
									<!--地区-->
									<a-cascader v-if="item.type == 7"
									            :options="cityData"
									            :defaultValue="item.provice"
									            @change="e => changeArea(e,item.fieldid)"
									            :placeholder="'请选择'+item.title"
									            style="width: 45%;float: right;margin-top: 4px;"
									/>
									<!--日期-->
									<template v-if="item.type == 4">
										<a-date-picker v-if="item.data == ''"
										               style="width: 45%;float: right;margin-top: 4px;"
										               :placeholder="'请选择'+item.title"
										               :disabledDate="disabledStartDate"
										               @change="e => selectDate(e,item.fieldid)"
										               :allowClear="false"/>
										<a-date-picker v-if="item.data != ''"
										               style="width: 45%;float: right;margin-top: 4px;"
										               :placeholder="'请选择'+item.title"
										               :disabledDate="disabledStartDate"
										               @change="e => selectDate(e,item.fieldid)"
										               :defaultValue="moment(item.data)"
										               :allowClear="false"/>
									</template>
								</template>
							</div>
						</div>
					</a-spin>
				</div>
				<div v-show="selectedTab==1" class="content">
					<div class="analysis-data">
						<div class="analysis-data-module">
							<div class="title">
								总互动次数
								<a-tooltip placement="top">
									<template slot="title">
										<span>以最新关注开始计入总互动次数，为总发送消息次数+总菜单点击次数+总扫码次数之和。</span>
									</template>
									<a-icon type="question-circle"/>
								</a-tooltip>
							</div>
							<div class="number">
								{{total_interact}}
							</div>
						</div>
						<div class="analysis-data-module">
							<div class="title">
								总发送消息次数
								<a-tooltip placement="top">
									<template slot="title">
										<span>以最新关注开始计入总发送消息次数，为粉丝向公众号发送消息的次数。</span>
									</template>
									<a-icon type="question-circle"/>
								</a-tooltip>
							</div>
							<div class="number">
								{{total_message}}
							</div>
						</div>
						<div class="analysis-data-module">
							<div class="title">
								总菜单点击次数
								<a-tooltip placement="top">
									<template slot="title">
										<span>以最新关注开始计入，粉丝点击公众号自定义菜单的总次数。</span>
									</template>
									<a-icon type="question-circle"/>
								</a-tooltip>
							</div>
							<div class="number">
								{{total_menu}}
							</div>
						</div>
						<div class="analysis-data-module">
							<div class="title">
								总扫码次数
								<a-tooltip placement="top">
									<template slot="title">
										<span>统计带参数的渠道二维码被扫的总次数。</span>
									</template>
									<a-icon type="question-circle"/>
								</a-tooltip>
							</div>
							<div class="number">
								{{total_scan}}
							</div>
						</div>
					</div>
					<div class="analysis-echarts">
						<div style="height: 60px;">
							<a-select defaultValue="近7天" style="width: 120px;float: right;" @change="handleChangeType">
								<a-select-option value="1">近7天</a-select-option>
								<a-select-option value="2">近15天</a-select-option>
								<a-select-option value="3">近30天</a-select-option>
							</a-select>
						</div>
						<LineCharts v-if="selectedTab==1" :options="analysisData"></LineCharts>
					</div>
					<div class="analysis-table">
						<a-spin tip="Loading..." size="large"
						        :spinning="analysisTable.tableLoading">
							<a-table :columns="analysisTable.columns"
							         :dataSource="analysisTable.list"
							         :rowKey="record => record.id"
							         :rowClassName="rowClassName"
							         :pagination="false">
							</a-table>
							<div style="width: 100%;" v-show="analysisTable.total > 0">
								<div style="height: 32px;display: inline-block;margin-top: 25px;">
									共
									<span style="color: blue">{{analysisTable.total}}</span>条
								</div>
								<div class="pagination" style="margin-top: 20px;float: right;">
									<a-pagination :total="analysisTable.total" showSizeChanger
									              :showQuickJumper="analysisTable.quickJumper"
									              :current="analysisTable.page"
									              :pageSize="analysisTable.pageSize"
									              :pageSizeOptions="['10','20','30']"
									              @change="changeAnalysisPage"
									              @showSizeChange="showAnalysisSizeChange"/>
								</div>
							</div>
						</a-spin>
					</div>
				</div>
				<div v-show="selectedTab==2" class="content">
					<a-spin tip="Loading..." :spinning="loading">
						<div class="fans-inter-active">
							<a-timeline class="time-line">
								<a-timeline-item v-for="item in timeLines">
									<!--									<img src="../../../assets/home/img/arrowdown.png" slot="dot" style="font-size: 20px;">-->
									<img v-if="item.icon==1" slot="dot" src="../../../assets/icon/1.png"
									     style="width: 22px;"/>
									<img v-if="item.icon==2" slot="dot" src="../../../assets/icon/2.png"
									     style="width: 22px;"/>
									<img v-if="item.icon==3" slot="dot" src="../../../assets/icon/3.png"
									     style="width: 22px;"/>
									<img v-if="item.icon==4" slot="dot" src="../../../assets/icon/4.png"
									     style="width: 26px;"/>
									<img v-if="item.icon==5" slot="dot" src="../../../assets/icon/5.png"
									     style="width: 26px;"/>
									<img v-if="item.icon==6" slot="dot" src="../../../assets/icon/6.png"
									     style="width: 18px;"/>
									<img v-if="item.icon==8" slot="dot" src="../../../assets/icon/8.png"
									     style="width: 18px;"/>
									<img v-if="item.icon==10" slot="dot" src="../../../assets/icon/10.png"
									     style="width: 18px;"/>
									<img v-if="item.icon==11" slot="dot" src="../../../assets/icon/11.png"
									     style="width: 18px;"/>
									<img v-if="item.icon==12" slot="dot" src="../../../assets/icon/12.png"
									     style="width: 16px;"/>
									<div style="min-height: 40px;">
										<div class="time-line-time">{{item.event_time}}</div>
										<div class="time-line-title">{{item.content}}</div>
									</div>

								</a-timeline-item>
							</a-timeline>
							<a-button type="primary" v-if="btnFlag==1" @click="loadMore">加载更多</a-button>
							<span type="primary" v-if="btnFlag==0">暂无数据</span>
							<span type="primary" v-if="btnFlag==2">没有更多数据了</span>
						</div>
					</a-spin>
				</div>
				<div v-show="selectedTab==3" class="content">
					<a-spin tip="Loading..." size="large" :spinning="followRecordLoading">
						<div class="time">
							<div style="margin: 20px 0;">
								跟进状态：
								<a-select style="width: 120px"
								          v-model="userInfo.follow_id">
									<a-select-option v-for="item in follows" :value="item.id">{{item.title}}
									</a-select-option>
								</a-select>
							</div>
							<div class="textArea">
								<a-textarea
										v-model="msg"
										@change="changeTextarea"
										placeholder="添加跟进记录，1000字以内"
										:autoSize="{ minRows: 5, maxRows: 5 }"
										:maxLength="1000"
								/>
								<div style="text-align: right;margin-top: 10px;">{{msg.length}}/1000</div>
							</div>
							<div class="textArea-btn">
								<a-upload
										action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
										listType="picture-card"
										@preview="handlePreview"
										:beforeUpload="beforeUpload"
										@change="e => changeMsg(e)"
										:fileList="imageUrl"
								>
									<div v-if="imageUrl.length < 9">
										<a-button>
											<a-icon type="link"/>
											附件 {{imgNum}}/9
										</a-button>
									</div>
								</a-upload>
								<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
									<img alt="example" style="width: 100%" :src="previewImage"/>
								</a-modal>

								<a-button type="primary" style="left: 50%;" :disabled="submitDisabled"
								          @click="submitFollowRecord">
									提交
								</a-button>
							</div>
							<a-timeline class="time-line">
								<a-timeline-item v-for="item in followRecord">
									<div class="time-line-time2">{{item.time}}</div>
									<img slot="dot" src="../../../assets/icon/8.png"
									     style="width: 18px;"/>
									<div style="margin: 10px 0;"><span style="color: #1989FA;">{{item.name}}</span>
										发表：<span style="float:right;"><a-icon type="edit"
										                                      @click="editFollowRecord(item)"/></span>
									</div>
									<div class="time-line-title2">
										{{item.record}}
										<!--										<div v-if="item.file.length > 0" style="margin-top: 5px;">-->
										<!--											<img :src="commonUrl + url" alt="" v-for="url in item.file"-->
										<!--											     style="max-width: 86px;max-height: 86px;">-->
										<!--										</div>-->
										<div v-if="item.file.length > 0" style="margin-top: 5px;overflow: hidden;">
											<div v-for="url in item.file" class="preview-box">
												<div class="preview-cover">
													<img :src="commonUrl + url" alt="">
												</div>
												<span class="preview-cover-icon"
												      @click="previewHasImg(commonUrl + url)"><a-icon
														type="eye"/></span>
											</div>
										</div>
									</div>
								</a-timeline-item>
							</a-timeline>
							<!--分页 -->
							<div class="pagination" style="margin: 20px;box-sizing: border-box;overflow: hidden;"
							     v-show="total > 0" v-has="'client-list'">
								<div style="height: 32px;float: left;line-height: 32px;">
									共
									<span style="color: blue">{{total}}</span>条
								</div>
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
									              :current="page"
									              :pageSize="pageSize"
									              :pageSizeOptions="['15','30','50','100']"
									              @change="changePage"
									              @showSizeChange="showSizeChange"/>
								</div>
							</div>
							<!--修改弹窗-->
							<a-modal title="修改跟进记录" v-model="editVisible" @ok="submitFollowRecord"
							         @cancel="cancelFollowRecord" width="800px">
								<div style="margin: 20px 0;">
									跟进状态：
									<a-select style="width: 120px"
									          v-model="status">
										<a-select-option v-for="item in follows" :value="item.id">{{item.title}}
										</a-select-option>
									</a-select>
								</div>
								<div class="textArea">
									<a-textarea
											v-model="msg2"
											placeholder="添加跟进记录，1000字以内"
											:autoSize="{ minRows: 5, maxRows: 5 }"
											:maxLength="1000"
									/>
									<div style="text-align: right;margin-top: 10px;">{{msg2.length}}/1000</div>
								</div>
								<div class="textArea-btn">
									<a-upload
											action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
											listType="picture-card"
											@preview="handlePreview2"
											:beforeUpload="beforeUpload2"
											@change="e => changeMsg2(e)"
											:fileList="imageUrl2"
									>
										<div v-if="imageUrl2.length < 9">
											<a-button>
												<a-icon type="link"/>
												附件 {{imgNum2}}/9
											</a-button>
										</div>
									</a-upload>
									<a-modal :visible="previewVisible2" :footer="null"
									         @cancel="handleCancel2">
										<img alt="example" style="width: 100%" :src="previewImage2"/>
									</a-modal>
								</div>
							</a-modal>
						</div>
					</a-spin>
				</div>
			</div>
		</div>
		<!--	打标签   -->
		<a-modal title="为粉丝增加标签" v-model="visible" @ok="handleOk"
		         :confirmLoading="confirmLoading2" @cancel="cancelVisible" width="800px">
			<p style="color: red;margin-bottom: 10px;">
				最多可再打{{20-tagCheckValue.length}}个标签。</p>
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
	</div>
</template>

<script>
	import LineCharts from "../../../components/echarts/LineCharts";
	import cityData from "../../../common/js/citydata";
	import moment from "moment";

	function getBase64 (file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			// reader.onerror = error => reject(error);
		});
	}

	export default {
		name      : "detail",
		components: {
			LineCharts
		},
		data () {
			return {
				id                 : '',
				userInfo           : {},
				remarkVisible      : false,   // 备注
				subTimeList        : [],
				unsubTimeList      : [],
				confirmLoading2    : false,//打标签对话框的确认按钮加载
				inputValue         : '',//新建标签输入框值
				tagsList           : [], //标签列表
				tagCheckValue      : [],//该粉丝已有标签
				visible            : false,//打标签对话框的显示与隐藏
				disabled           : [],//禁选标签
				tagsNum            : 0,//该粉丝已有的标签总数量
				tagValue           : [],//标签值
				hasTags            : [],//在别的地方打的已有的标签id
				hasTagsValue       : [],//在别的地方打的已有的标签名称
				selectedTab        : 0,
				type               : 1,
				total_interact     : "--",
				total_message      : "--",
				total_menu         : "--",
				total_scan         : "--",
				analysisData       : {
					title     : '趋势图',
					legendData: [],
					xAxisData : [],
					seriesData: [],
				},
				analysisTableList  : [],
				analysisTable      : {
					tableLoading: false,
					columns     : [
						{
							title    : "时间",
							dataIndex: "date",
							key      : "date"
						},
						{
							title    : "总互动次数",
							dataIndex: "interact",
							key      : "interact"
						},
						{
							title    : "总发送消息次数",
							dataIndex: "message",
							key      : "message"
						},
						{
							title    : "总菜单点击次数",
							dataIndex: "menu",
							key      : "menu"
						},
						{
							title    : "总扫码次数",
							dataIndex: "scan",
							key      : "scan",
						}
					],
					list        : [],
					total       : 0,
					page        : 1,
					pageSize    : 10,
					quickJumper : false
				},
				loading            : false,
				timeLines          : [],
				fans_trail_page    : 1,
				fans_trail_pageSize: 10,
				btnFlag            : 1,
				//用户画像
				isLoading          : false,//用户画像loading显示与隐藏
				field_list         : [],//基础信息
				fieldData          : [],//编辑基础信息参数
				badicInfoVisible   : false,//基础信息是否编辑状态
				picUrl: '',
				// 地域
				cityData,
				moment, //时间选择器
				//跟进记录
				followRecordLoading: false,//跟进记录loading显示与隐藏
				followRecord       : [],//跟进记录数据
				imageUrl           : [],//上传的图片文件类型
				file               : [],//上传的图片链接地址
				imgNum             : 0,//上传的图片的数量
				msg                : '',//跟进记录输入框内容
				previewVisible     : false,//预览图片弹窗显示与隐藏
				previewImage       : '',//预览的图片链接
				isImg              : true,//上传图片符不符合规则
				submitDisabled     : true,//提交按钮的置灰
				record_id          : '',//选择编辑的记录id
				//修改跟进记录弹窗
				editVisible        : false,//修改跟进记录弹窗的显示与隐藏
				imageUrl2          : [],//上传的图片文件类型
				file2              : [],//上传的图片链接地址
				imgNum2            : 0,//上传的图片的数量
				msg2               : '',//跟进记录输入框内容
				previewVisible2    : false,//预览图片弹窗显示与隐藏
				previewImage2      : '',//预览的图片链接
				isImg2             : true,//上传图片符不符合规则
				submitDisabled2    : true,//提交按钮的置灰
				//分页
				total              : 1, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				page               : 1, //页码
				pageSize           : 15, //每页数据条数
				commonUrl          : this.$store.state.commonUrl,//公共的链接
				status             : [],//跟进状态
				followStatus       : '',
				follows            : []
			}
		},
		mounted () {
			this.id = this.$route.query.id
			this.getFollowStatus()
			this.getPersonas()
		},
		methods   : {
			getUserInfo () {
				this.getHasTags();
				this.getFansInfo()
				this.getFansAnalysis()
			},
			async getFansInfo () {
				let that = this
				const {data: res} = await this.axios.post("fans-behaviour/fans-info", {id: this.id});
				if (res.error != 0) {
					that.$message.error(res.error_msg)
				} else {
					that.userInfo = res.data
					that.status = that.userInfo.follow_id
					if(this.status == '') {
						this.status = this.follows[0] ? (this.follows[0].id ? this.follows[0].id : '') : ''
					}
					that.followStatus = that.status
					if (that.userInfo.subscribe_time) {
						that.getTimeList(1)
					}
					if (that.userInfo.unsubscribe_time) {
						that.getTimeList(2)
					}

				}
			},
			async getTimeList (type) {
				let that = this
				const {data: res} = await this.axios.post("fans-behaviour/fans-sub-info", {
					id  : this.id,
					type: type
				});
				if (res.error != 0) {
					that.$message.error(res.error_msg)
				} else {
					if (type == 1) {
						that.subTimeList = res.data
					} else if (type == 2) {
						that.unsubTimeList = res.data
					}
				}
			},
			async getFansAnalysis () {
				let that = this
				const {data: res} = await this.axios.post("fans-behaviour/fans-analysis", {
					id  : this.id,
					type: this.type
				});
				if (res.error != 0) {
					that.$message.error(res.error_msg)
				} else {
					that.total_interact = res.data.total_interact
					that.total_message = res.data.total_message
					that.total_menu = res.data.total_menu
					that.total_scan = res.data.total_scan
					that.analysisData.legendData = res.data.legData
					that.analysisData.xAxisData = res.data.xData
					that.analysisData.seriesData = res.data.seriesData
					this.analysisTableList = res.data.list
					this.analysisTable.total = res.data.list.length
					let table = this.getPageData(this.analysisTableList, this.analysisTable.page, this.analysisTable.pageSize)
					that.analysisTable.list = table.list
					this.analysisTable.page = table.page
				}
			},
			getPageData (list, page, pageSize) {
				let maxNum = page * pageSize;
				let minNum = (page - 1) * pageSize
				let pageData = {
					page: page,
					list: []
				}
				if (list.length < maxNum) {
					maxNum = list.length
				}
				if (minNum > list.length - 1) {
					if (list.length % pageSize != 0) {
						minNum = (parseInt(list.length / pageSize)) * pageSize
						pageData.page = parseInt(list.length / pageSize) + 1
					} else {
						minNum = (parseInt(list.length / pageSize) - 1) * pageSize
						pageData.page = parseInt(list.length / pageSize)
					}
				}
				for (let i = minNum; i < maxNum; i++) {
					pageData.list.push(list[i])
				}
				return pageData
			},
			// 修改粉丝备注
			modifyRemark () {
				this.remarkVisible = !this.remarkVisible;
			},
			// 设置用户昵称
			async setRemark (remark, e) {
				let that = this
				if (remark.length > 10) {
					that.$message.warning("备注不可超过10个字")
					return false;
				}
				if (that.userInfo.remark != remark) {
					let postData = {
						fans_id: this.id,
						remark : remark,
						wx_id:localStorage.getItem('wxNum')
					};
					const {data: res} = await this.axios.post('fans/set-remark', postData);
					if (res.error == 0) {
						that.userInfo.remark = remark
						that.remarkVisible = !this.remarkVisible;
						if (this.selectedTab == 2) {
							this.btnFlag = 1
							this.loading = true
							this.fans_trail_page = 1
							this.timeLines = []
							this.fansTrail()
						}
					} else {
						that.$message.error(res.error_msg);
					}
				} else {
					this.remarkVisible = !this.remarkVisible;
					return false;
				}
			},
			// 复制
			copyText (value) {
				let that = this
				const input = document.createElement('input')
				document.body.appendChild(input)
				input.setAttribute('value', value)
				input.select()
				if (document.execCommand('copy')) {
					document.execCommand('copy')
					that.$message.success("复制成功！")
				}
				document.body.removeChild(input)
			},
			// 打标签
			showModal () {
				this.getTags();
				this.visible = true;
			},
			//获取标签
			async getTags () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id:localStorage.getItem('wxNum'),
					type: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					this.disabled = []
					if (20 - this.tagCheckValue.length <= 0) {
						for (let i = 0; i < this.tagsList.length; i++) {
							let disabled = true;
							this.disabled.push(disabled);
						}
					} else {
						for (let i = 0; i < this.tagsList.length; i++) {
							let disabled = false;
							this.disabled.push(disabled);
							for (let j = 0; j < this.tagCheckValue.length; j++) {
								if (this.tagCheckValue[j] == this.tagsList[i].key) {
									this.disabled[i] = true
								}
							}
						}
					}
				}
			},
			//获取该粉丝已有标签
			async getHasTags () {
				let fans_ids = []
				fans_ids.push(this.id)
				this.tagCheckValue = []
				const {data: res} = await this.axios.post("fans/fans-tags", {
					fans_ids: fans_ids
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					res.data.map((x) => {
						this.tagCheckValue.push(x.tags_id)
						this.hasTags.push(x.tags_id)
						this.hasTagsValue.push(x.tag_name)
					})
					this.tagsNum = this.tagCheckValue.length
				}
			},
			handleOk () {
				if (this.tagCheckValue.length == this.tagsNum) {
					this.$message.warning("请选择要打的标签");
				} else {
					this.confirmLoading2 = true;
					this.addTagsMore();
				}
			},
			//批量添加标签
			async addTagsMore () {
				let fans_ids = []
				fans_ids.push(this.id)
				const {data: res} = await this.axios.post("fans/give-user-tags", {
					wx_id:localStorage.getItem('wxNum'),
					tag_ids : this.tagCheckValue,
					fans_ids: fans_ids,
					type    : 0
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading2 = false;
				} else {
					this.$message.success(res.error_msg);
					this.visible = false
					this.confirmLoading2 = false;
					this.hasTagsValue = []
					this.getHasTags();
				}
			},
			cancelVisible () {
				this.visible = false
				this.inputValue = ''
				this.tagValue = []
				this.tagCheckValue = []
				this.hasTagsValue = []
				this.getHasTags();
			},
			onChange2 (checkedValues) {
				var temp = [];
				var temparray = [];
				for (var i = 0; i < this.hasTags.length; i++) {
					temp[this.hasTags[i]] = typeof this.hasTags[i];

				}
				for (var i = 0; i < checkedValues.length; i++) {
					var type = typeof checkedValues[i];
					if (!temp[checkedValues[i]]) {
						temparray.push(checkedValues[i]);
					} else if (temp[checkedValues[i]].indexOf(type) < 0) {
						temparray.push(checkedValues[i]);
					}
				}
				// console.log(temparray,'temparray')
				if (20 - checkedValues.length <= 0) {
					this.disabled = []
					for (let i = 0; i < this.tagsList.length; i++) {
						let disabled = true
						this.disabled.push(disabled)
						for (let j = 0; j < temparray.length; j++) {
							if (this.tagsList[i].key == temparray[j]) {
								this.disabled[i] = false
							}
						}
					}
				} else {
					this.disabled = []
					for (let i = 0; i < this.tagsList.length; i++) {
						let disabled = false
						this.disabled.push(disabled)
						for (let k = 0; k < this.hasTags.length; k++) {
							if (this.tagsList[i].key == this.hasTags[k]) {
								this.disabled[i] = true
							}
						}
					}
				}
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
			//创建标签
			async addTags () {
				const {data: res} = await this.axios.post("tags/tags-create", {
					wx_id:localStorage.getItem('wxNum'),
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
			async getTags2 () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id:localStorage.getItem('wxNum'),
					type: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					if (20 - this.tagCheckValue.length <= 0) {
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
					this.inputValue = "";
					this.tagValue = []
				}
			},
			handleChangeType (type) {
				this.type = type
				this.getFansAnalysis()
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			changeTab (key) {
				if (this.selectedTab != key) {
					this.selectedTab = key
					if (key == 0) {
						this.getPersonas()
					}
					if (key == 2) {
						this.btnFlag = 1
						this.loading = true
						this.fans_trail_page = 1
						this.timeLines = []
						this.fansTrail()
					}
					if (key == 3) {
						this.getFollowRecord()
					}
				}
			},
			async fansTrail () {
				const {data: res} = await this.axios.post("fans-behaviour/fans-trail", {
					fans_id : this.id,
					page    : this.fans_trail_page,
					pageSize: this.fans_trail_pageSize
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					if (res.data.length == 0) {
						if (this.fans_trail_page == 1) {
							this.btnFlag = 0         // 没有数据
						} else {
							this.btnFlag = 2        // 没有更多数据
						}
					} else {
						if (res.data.length < this.fans_trail_pageSize) {
							this.btnFlag = 2        // 没有更多数据
						} else {
							this.btnFlag = 1
						}
					}
					this.timeLines = this.timeLines.concat(res.data)
					this.loading = false
				}
			},
			loadMore () {
				this.loading = true
				this.fans_trail_page = this.fans_trail_page + 1
				this.fansTrail()
			},
			changeAnalysisPage (page, pageSize) {
				let table = this.getPageData(this.analysisTableList, page, this.analysisTable.pageSize)
				this.analysisTable.list = table.list
				this.analysisTable.page = table.page
			},
			showAnalysisSizeChange (page, pageSize) {
				this.analysisTable.pageSize = pageSize
				let table = this.getPageData(this.analysisTableList, this.analysisTable.page, pageSize)
				this.analysisTable.list = table.list
				this.analysisTable.page = table.page
			},
			//获取用户画像数据
			async getPersonas () {
				this.isLoading = true
				const {data: res} = await this.axios.post("fans/fans-field", {
					uid    : localStorage.getItem('uid'),
					fans_id: this.id,
				})

				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false
					this.field_list = res.data.field_list
					this.field_list.map(x => {
						if (x.type == 2 || x.type == 3) {
							x.optionVal2 = x.optionVal.split(',')
							if (x.type == 2) {
								if (x.value == '') {
									x.hasOption = x.value.split('')
								} else {
									x.hasOption = x.value
								}
							} else if (x.type == 3 && x.value != '') {
								x.hasOption = x.value.split(',')
							}
						} else if (x.type == 7) {
							if (x.value == '') {
								x.provice = []
							} else {
								x.provice = x.value.split('-')
							}
						} else if (x.type == 4) {
							x.data = x.value
						}
					})
					this.fieldData = res.data.field_list
				}
			},
			//编辑基础信息
			editBadicInfo () {
				this.badicInfoVisible = true
				for (let i = 0; i < this.field_list.length; i++) {
					this.field_list[i]['picUrl'] = []
					if (this.field_list[i].type == 8) {
						if (this.field_list[i].value) {
							for (let v of this.field_list[i].value) {
								this.field_list[i]['picUrl'].push({
									uid   : v.uid,
									url   : this.commonUrl + v.url,
									status: v.status,
									name  : 'image.png'
								})
							}
						}
					}
				}
				this.fieldData = JSON.parse(JSON.stringify(this.field_list))
			},
			//单选
			handleChange (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value;
					this.field_list = newData;
				}
			},
			//多选
			handleChange2 (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value.join(',');
					this.field_list = newData;
				}
			},
			//输入框
			changeInput (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value;
					this.field_list = newData;
				}
			},
			// 地区
			changeArea (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value.join('-');
					this.field_list = newData;
				}
			},
			//日期
			selectDate (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value.format("YYYY-MM-DD");
					this.field_list = newData;
				}
			},
			disabledStartDate (date2) {
				//打开开始时间面板调用的函数
				return date2.valueOf() > new Date().getTime(); //大于今天的日期一律返回true，禁止选择
			},
			//提交基础信息修改
			async submitBadicInfo () {
				let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
				let postBoxReg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
				let field_list = JSON.parse(JSON.stringify(this.field_list))
				for (let i = 0; i < field_list.length; i++) {
					if (field_list[i].type == 5 && field_list[i].value != '') {
						if (!phoneReg.test(field_list[i].value)) {
							this.$message.error('手机号格式不正确！')
							return false
						}
					}
					if (field_list[i].type == 6 && field_list[i].value != '') {
						if (!postBoxReg.test(this.field_list[i].value)) {
							this.$message.error('邮箱格式不正确！')
							return false
						}
					}
					if (field_list[i].type == 8) {
						for (let picUrl of field_list[i].picUrl) {
							picUrl.url = picUrl.url.replace(this.commonUrl, "")
							delete picUrl.response
							delete picUrl.xhr
							delete picUrl.percent
						}
						field_list[i].value = JSON.parse(JSON.stringify(field_list[i].picUrl))
						delete field_list[i].picUrl
					}
					if(typeof field_list[i].value == 'undefined'){
						field_list[i].value = ''
					}
				}
				this.isLoading = true
				const {data: res} = await this.axios.post("fans/fans-field-update", {
					uid      : localStorage.getItem('uid'),
					fans_id  : this.id,
					fieldData: field_list
				})

				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.badicInfoVisible = false
					this.getPersonas()
				}
			},
			cancleBadicInfo () {
				this.badicInfoVisible = false
				this.field_list = JSON.parse(JSON.stringify(this.fieldData))
			},
			//获取跟进记录
			async getFollowRecord (page = 1, pageSize = this.pageSize) {
				this.followRecordLoading = true
				const {data: res} = await this.axios.post("fans/fans-follow-record", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					uid            : localStorage.getItem('uid'),
					fans_id        : this.id,
					sub_id         : localStorage.getItem("sub_id"),
					page           : page,
					page_size      : pageSize,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.followRecordLoading = false
				} else {
					this.followRecordLoading = false
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					this.followRecord = res.data.followRecord
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getFollowRecord(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getFollowRecord(1, pageSize);
			},
			//输入框
			changeTextarea () {
				if (this.msg == '' && this.file.length == 0) {
					this.submitDisabled = true
				} else {
					this.submitDisabled = false
				}
			},
			//上传图片
			handleCancel () {
				this.previewVisible = false;
			},
			async handlePreview (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage = file.url || file.preview;
				this.previewVisible = true;
			},
			preview (url) {
				this.previewImage = url
				this.previewVisible = true;
			},
			async beforeUploadPic (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.isImg3 = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.isImg3 = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.isImg3 = false
					return false;
				}
				this.isImg3 = true
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", file);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.picFile = {
							uid   : file.uid,
							url   : this.commonUrl + res.data.local_path,
							status: 'done'
						}
						return isLt2M;
					}
				} else {
					this.$message.error(res.error_msg)
				}
			},
			handleChangePic (e, index) {
				if (e.file.status == 'removed') {
					this.field_list[index]['picUrl'].splice(this.field_list[index]['picUrl'].findIndex(x => x.url == e.file.url), 1)
				}
				if (this.picFile.status == 'done') {
					let i = this.field_list[index]['picUrl'].findIndex(x => e.file == x)
					if (i != -1) {
						this.field_list[index]['picUrl'].splice(i, 1)
					} else {
						this.field_list[index]['picUrl'].push(this.picFile)
					}
				}
				for (let f of this.field_list[index]['picUrl']) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
				this.picFile = {}
			}
			,
			changeMsg (value) {
				if (this.imageUrl.indexOf(value.file) != -1) {
					this.file.splice(this.imageUrl.indexOf(value.file), 1)
				}
				if (this.isImg) {
					this.imageUrl = value.fileList;
					this.imgNum = value.fileList.length
				}
				if (this.file.length == 0 && this.msg == '') {
					this.submitDisabled = true
				}
			},
			async uploadMaterial (materialData) {
				this.submitDisabled = true
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", materialData);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.file.push(res.data.local_path)
						this.submitDisabled = false
					}
				} else {
					this.$message.error(res.error_msg)
					this.submitDisabled = false
				}
				// console.log(this.file,'this.file')
			},
			beforeUpload (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.isImg = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.isImg = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.isImg = false
					return false;
				}
				this.isImg = true
				this.uploadMaterial(file);
				return isLt2M;
			},
			//提交跟进记录
			async submitFollowRecord () {
				this.followRecordLoading = true
				let record = ''
				let file = []
				if (this.record_id == '') {
					//新建
					record = this.msg
					file = this.file
				} else {
					//修改
					record = this.msg2
					file = this.file2
					if (record == '' && file.length == 0) {
						this.$message.error('跟进内容不能为空！')
						this.followRecordLoading = false
						return false
					}
				}
				let followStatus = 0
				if (!this.editVisible) {
					followStatus = this.userInfo.follow_id
				} else {
					followStatus = this.status
				}
				if(!followStatus) {
					this.$message.warning('请选择跟进状态！')
					this.followRecordLoading = false
					return false
				}
				const {data: res} = await this.axios.post("fans/fans-follow-record-set", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					uid            : localStorage.getItem('uid'),
					fans_id        : this.id,
					sub_id         : localStorage.getItem("sub_id"),
					record_id      : this.record_id,
					record         : record,
					file           : file,
					follow_id      : followStatus
				})

				if (res.error != 0) {
					this.followRecordLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.submitDisabled = true
					this.msg = ''
					this.file = []
					this.record_id = ''
					this.imageUrl = []
					this.imgNum = 0
					this.msg2 = ''
					this.file2 = []
					this.imageUrl2 = []
					this.imgNum2 = 0
					this.editVisible = false
					this.getFollowRecord()
					this.getFansInfo()
				}
			},
			//修改跟进记录
			editFollowRecord (item) {
				this.editVisible = true
				this.record_id = item.id
				this.msg2 = item.record
				this.file2 = JSON.parse(JSON.stringify(item.file))
				item.file.map((x, index) => {
					let url = {
						uid   : index,
						name  : 'image.png',
						status: 'done',
						url   : this.commonUrl + x
					}
					this.imageUrl2.push(url)
				})
				this.imgNum2 = item.file.length
			},
			cancelFollowRecord () {
				this.editVisible = false
				this.record_id = ''
				this.msg2 = ''
				this.file2 = []
				this.imageUrl2 = []
				this.imgNum2 = 0
				this.status = this.followStatus
			},
			//上传图片
			handleCancel2 () {
				this.previewVisible2 = false;
			},
			async handlePreview2 (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage2 = file.url || file.preview;
				this.previewVisible2 = true;
			},
			changeMsg2 (value) {
				if (this.imageUrl2.indexOf(value.file) != -1) {
					this.file2.splice(this.imageUrl2.indexOf(value.file), 1)
				}
				if (this.isImg2) {
					this.imageUrl2 = value.fileList;
					this.imgNum2 = value.fileList.length
				}
			},
			async uploadMaterial2 (materialData) {
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", materialData);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.file2.push(res.data.local_path)
					}
				} else {
					this.$message.error(res.error_msg)
				}
				// console.log(this.file,'this.file')
			},
			beforeUpload2 (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.isImg2 = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.isImg2 = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.isImg2 = false
					return false;
				}
				this.isImg2 = true
				this.uploadMaterial2(file);
				return isLt2M;
			},
			//预览图片
			previewHasImg (url) {
				this.previewImage = url;
				this.previewVisible = true;
			},
			async getFollowStatus () {
				const {data: res} = await this.axios.post(
					"custom-field/follow",
					{
						uid   : localStorage.getItem("uid"),
						status: 1
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.follows = res.data.follow
					this.getUserInfo()
				}
			}
		}
	}
</script>

<style scoped>
	.fans-detail {
		width: 100%;
		height: 100%;
		/*overflow-y: auto;*/
	}

	.layout-left {
		position: absolute;
		left: 0;
		top: 60px;
		width: 270px;
		height: calc(100% - 61px);
		padding: 20px 10px 40px 10px;
		background-color: #FFF;
		overflow-y: scroll;
	}

	.layout-left::-webkit-scrollbar {
		width: 2px;
		height: 2px;
	}

	.layout-left::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #E9E9E9;
	}

	.layout-left::-webkit-scrollbar-track { /*滚动条里面轨道*/
		background: #FFF;
	}

	.user-info {
		margin-left: 10px;
		text-align: left;
		color: #333333;
	}

	.user-info div {
		margin-top: 20px;
	}

	.center-align {
		text-align: center;
	}

	.userinfo-openid {
		vertical-align: middle;
		display: inline-block;
		width: 130px;
		white-space: nowrap;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		overflow: hidden;
	}

	.layout-contain {
		position: absolute;
		left: 270px;
		top: 60px;
		width: 80%;
		width: calc(100% - 267px);
		width: -moz-calc(100% - 267px);
		width: -webkit-calc(100% - 267px);
		background-color: #E9E9E9;
		height: calc(100% - 61px);
		max-height: 100%;
		padding: 20px 20px 0px 20px;
		overflow-y: scroll;
	}

	.layout-left::-webkit-scrollbar {
		width: 2px;
		height: 2px;
	}

	.layout-left::-webkit-scrollbar-thumb {
		background: #E9E9E9;
	}

	.layout-left::-webkit-scrollbar-track {
		background: #FFF;
	}

	.account-filter-contain {
		width: 100%;
		min-width: 350px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		background-color: #F7F7F7;
	}

	.account-filter-item {
		color: #1A1A1A;
		width: 174px;
		cursor: pointer;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		padding: 12px 0 12px 2px;
		font-size: 14px;
	}

	.account-filter-item.active {
		background: #FFF;
		border: 1px solid #E9E9E9;
		height: 56px;
		margin-top: -8px;
		border: 1px solid #E0E0E0;
		border-bottom: 0;
		padding-top: 19px;
		color: #3B74FF;
	}

	.account-filter-item label {
		margin: 0 auto;
		font-size: 16px;
	}

	.content {
		background-color: white;
		padding: 20px;
	}

	.analysis-data {
		height: 130px;
	}

	.analysis-data-module {
		padding: 20px 0px 20px 20px;
		height: 111px;
		width: 25%;
		border: 1px solid #E9E9E9;
		background-color: #F9F9F9;
		float: left;
	}

	.analysis-data-module .title {
		margin-bottom: 5%;
	}

	.analysis-data-module .number {
		font-size: 24px;
		float: right;
		margin-right: 25px;
	}

	.analysis-echarts {
		padding: 20px 20px 20px 20px;
		border: 1px solid #E9E9E9;
	}

	.analysis-table {
		padding: 20px 20px 20px 20px;
		border: 1px solid #E9E9E9;
	}

	.fans-title {
		padding: 12px 16px;
		font-size: 18px;
		color: #1A1A1A;
		/*background: #E6F7FF;*/
		border: 1px solid #E9E9E9;
		/*color: rgba(0, 0, 0, 0.65);*/
	}

	.time-line {
		text-align: left;
		width: 100%;
	}

	.time-line-time {
		display: inline-block;
		vertical-align: top;
		margin-left: 10px;
		color: rgba(0, 0, 0, 0.5);
	}

	.time-line-title {
		display: inline-block;
		max-width: 80%;
		text-align: left;
		white-space: pre-line;
		word-break: break-all;
		word-wrap: break-word;
		margin-left: 30px;
		color: rgba(0, 0, 0, 0.8);
	}

	.fans-inter-active {
		margin-top: 20px;
		padding: 20px 20px 20px 20px;
		border: 1px solid #E9E9E9;
		/*border-top: 0px;*/
		text-align: center;
	}

	/deep/ .ant-spin-nested-loading > div > .ant-spin {
		position: fixed !important;
		width: calc(100% - 550px);
		width: -webkit-calc(100% - 550px);
		top: 30%;
		left: 440px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.col2 {
		overflow: hidden;
	}

	.half {
		width: 50%;
		float: left;
		line-height: 40px;
		padding: 0 20px;
		border-top: 1px solid #E9E9E9;
	}

	.half-text {
		float: right;
		word-break: break-all;
		max-width: calc(100% - 60px);
	}

	.time {
		border: 1px solid #E9E9E9;
		padding: 0 20px;
	}

	.textArea-btn {
		padding: 20px 0;
		overflow: hidden;
	}

	/deep/ .ant-upload-picture-card-wrapper {
		display: inline;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card {
		background-color: #FFF;
		border: 0;
		height: 32px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0;
	}

	.time-line {
		padding: 0 20px;
	}

	.time-line-title2 {
		background: #F9F9F9;
		padding: 10px;
		margin-top: 5px;
	}

	.preview-box {
		width: 104px;
		height: 104px;
		margin: 0 8px 8px 0;
		padding: 8px;
		border: 1px solid #D9D9D9;
		border-radius: 4px;
		position: relative;
		float: left;
	}

	.preview-cover, .preview-cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: relative;
	}

	.preview-cover::before {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: all 0.3s;
		content: ' ';
	}

	.preview-cover-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 10;
		white-space: nowrap;
		transform: translate(-50%, -50%);
		opacity: 0;
		transition: all 0.3s;
		cursor: pointer;
		color: #FFF;
		font-size: 18px;
	}

	.preview-box:hover .preview-cover::before, .preview-box:hover .preview-cover-icon {
		opacity: 1;
	}
	.upload-pic /deep/ .ant-upload.ant-upload-select-picture-card, .upload-pic /deep/ .ant-upload-list-picture-card .ant-upload-list-item, .upload-pic /deep/ .ant-upload-list-picture-card-container {
		width: 70px;
		height: 70px;
	}
	.upload-pic /deep/ .ant-upload.ant-upload-select-picture-card {
		border: 1px dashed #d9d9d9;
		border-radius: 4px;
	}
	.upload-pic /deep/ .ant-upload-select-picture-card i {
		font-size: 32px;
		color: #999;
	}

	.upload-pic /deep/ .ant-upload-select-picture-card .ant-upload-text {
		margin-top: 8px;
		color: #666;
	}
</style>
