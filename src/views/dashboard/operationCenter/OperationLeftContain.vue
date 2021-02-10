<template>
	<!--	首页（内容+滚动条）	-->
	<div>
		<div class="home-left-contain">
			<a-spin :spinning="spinning" tip="加载中..." size="large"
			        :class="spinning?'spinning-true':'spinning-false'">
				<div class="tabs-contain" style="margin-top: 20px">
					<div class="account-filter" v-if="wxList && wxList.length > 0">
						<a-tabs class="wx-list-tab" type="card" v-model="wxId" @change="changeStoreId"
						        style="width: 100%;">
							<a-tab-pane v-for="(item, index) in wxList" :key="item.corpid">
								<div slot="tab">
									<a-tooltip placement="top">
										<template slot="title">
											<span >{{item.corp_name}}</span>
										</template>
										<img style="width: 24px; height: 24px;" src="../../../assets/WeChatLogo.png"/>
										<span style="color:#222222">{{item.corp_name}}</span>
									</a-tooltip>
								</div>
							</a-tab-pane>
						</a-tabs>
					</div>
					<div style="background-color: #FFF;text-align: center;padding-top: 20px;" v-if="wxList.length == 0">
						<p style="font-weight: 700;font-size: 18px;margin-top: 10px;">尚未授权企业微信，该功能无法使用</p>
						<p style="font-size: 16px;color: #999999;">请点击下方按钮进行授权</p>
						<a-button type="primary" class="btn" @click="addAccount">立即授权</a-button>
						<corpAuthorize :show="showWxModal" @cancel="cancel"></corpAuthorize>
					</div>
					<div class="single-account-contain" v-has="'home'">
						<div class="spin-content">
							<div class="single-accout-card">
								<div class="single-accout-cardItem account-type">
									<span style="color:#333333;font-weight: 700;">昨日发起申请数
										<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>发起申请数，成员通过「搜索手机号」、「扫一扫」、「从微信好友中添加」、「从群聊中添加」、「添加共享、分配给我的客户」、「添加单向、双向删除好友关系的好友」、「从新的联系人推荐中添加」等渠道主动向客户发起的好友申请数量。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="margin:5px 0">{{storeIndicatorsData.one.count}}</p>
									<div style="display: flex;align-items: center;justify-content: space-between;">
										<span>比前日</span>
										<div>
											<img v-if="storeIndicatorsData.one.status==0"
												src="../../../assets/home/img/arrowdown.png"/>
											<img v-if='storeIndicatorsData.one.status==1'
													src="../../../assets/home/img/arrowup.png"/>
											<span v-if="storeIndicatorsData.one.status==0" style="color:#01b065">{{storeIndicatorsData.one.per}}</span>
											<span v-if='storeIndicatorsData.one.status==1' style="color:#FF2222">{{storeIndicatorsData.one.per}}</span>
										</div>
									</div>
								</div>
								<div style="margin: 0 12px" class="single-accout-cardItem account-type">
									<span style="color:#333333;font-weight: 700;">昨日新增客户数
									<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>新增客户数，成员新添加的客户数量。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="margin:5px 0">{{storeIndicatorsData.two.count}}</p>
									<div style="display: flex;align-items: center;justify-content: space-between;">
										<span>比前日</span>
										<div>
											<img v-if="storeIndicatorsData.two.status==0"
										     src="../../../assets/home/img/arrowdown.png"/>
											<img v-if='storeIndicatorsData.two.status==1'
													src="../../../assets/home/img/arrowup.png"/>
											<span v-if="storeIndicatorsData.two.status==0" style="color:#01b065">{{storeIndicatorsData.two.per}}</span>
											<span v-if='storeIndicatorsData.two.status==1' style="color:#FF2222">{{storeIndicatorsData.two.per}}</span>
										</div>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span style="color:#333333;font-weight: 700;">昨日被客户删除/拉黑人数
									<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>删除/拉黑成员的客户数，即将成员删除或加入黑名单的客户数。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="margin:5px 0">{{storeIndicatorsData.three.count}}</p>
									<div style="display: flex;align-items: center;justify-content: space-between;">
										<span>比前日</span>
										<div>
											<img v-if="storeIndicatorsData.three.status==0"
										     src="../../../assets/home/img/arrowdown.png"/>
											<img v-if='storeIndicatorsData.three.status==1'
													src="../../../assets/home/img/arrowup.png"/>
											<span v-if="storeIndicatorsData.three.status==0" style="color:#01b065">{{storeIndicatorsData.three.per}}</span>
											<span v-if='storeIndicatorsData.three.status==1' style="color:#FF2222">{{storeIndicatorsData.three.per}}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="card-filter-contain">
							<template>
								<a-tabs @change="changeTab" type="card"
								        style="background-color: #FFF;">
									<a-tab-pane tab="成员TOP10" key="1">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div class="day-picker-contain picker-contain">
														<a-button :class="timeType== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType1(2)">
															按日
														</a-button>
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType1(3)">
															按周
														</a-button>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType== '4'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType1(4)">
															按月
														</a-button>
													</div>
													<div class="month-picker-contain picker-contain" style="margin-left:5px">
														<a-range-picker
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType=='2'"
																v-model="dayDate"
																@change="changeFansTime1"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekStart'
																:disabledDate="disabledDateWeek"
																v-if="timeType=='3'"
																@change="changeFansStartWeek1"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd'
																:disabledDate="disabledDateWeek"
																v-if="timeType=='3'"
																@change="changeFansEndWeek1"
														/>
													</div>
												</div>
											</div>
											<div class="fans-data-trend">
												<div style="text-align: center;">
													<span style="cursor: pointer;" @click="changeBarType(1)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 1 ? '#3398DB' : '#F2F2F2' }"></span>
														发起申请数</span>
													<span style="cursor: pointer;" @click="changeBarType(2)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 2 ? '#AD85F4' : '#F2F2F2' }"></span>
														新增客户数</span>
													<span style="cursor: pointer;" @click="changeBarType(3)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 3 ? '#FFC71B' : '#F2F2F2' }"></span>
														被客户删除/拉黑人数</span>
												</div>
												<BarCharts v-if="tabKey == 1" style="width:100%;" :options="fansAdd"
												           v-show="fansAdd.seriesData.length != 0"
												>
												</BarCharts>
												<a-empty v-show="fansAdd.seriesData.length == 0"
												         style="margin-top: 30px;">
													<span slot="description" style="color: #999;">暂无排行榜</span>
												</a-empty>
											</div>
											<div class="fans-data-detail">
												<div class="title-contain">
													<p>详细数据</p>
													<a-button @click="exportFansIncrease1" type="primary"
													          >
														导出数据
													</a-button>
												</div>
												<div class="content-bd">
													<a-table :columns="fansTable.columns" :dataSource="fansTable.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<div style="width: 100%;" v-show="fansTable.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable.total" showSizeChanger
															              :showQuickJumper="fansTable.quickJumper"
															              :current="fansTable.page"
															              :pageSize="fansTable.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage1"
															              @showSizeChange="showFansSizeChange1"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="发起申请数" key="2">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div class="day-picker-contain picker-contain">
														<a-button :class="timeType2== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType2(2)">
															按日
														</a-button>
														
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType2== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType2(3)">
															按周
														</a-button>
														
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType2== '4'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType2(4)">
															按月
														</a-button>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button @click="showDepartmentList">
															<span v-if="chooseNum2 == 0">选择成员</span>
															<span v-if="chooseNum2 > 0">已选择{{chooseUserNum2}}名成员，{{chooseDepartmentNum2}}个部门</span>
														</a-button>
													</div>
													<div  class="month-picker-contain picker-contain" style="margin-left:5px">
														<a-range-picker
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType2=='2'"
																v-model="dayDate2"
																@change="changeFansTime2"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekStart2'
																:disabledDate="disabledDateWeek"
																v-if="timeType2=='3'"
																@change="changeFansStartWeek2"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd2'
																:disabledDate="disabledDateWeek"
																v-if="timeType2=='3'"
																@change="changeFansEndWeek2"
														/>
													</div>
												</div>
											</div>
											<div class="fans-data-trend">
												<LineCharts v-if="tabKey == 2"
												            :options="fansAdd2" style="width:100%;"
												>
												</LineCharts>
											</div>
											<div class="fans-data-detail">
												<div class="title-contain">
													<p>详细数据</p>
													<a-button @click="exportFansIncrease2" type="primary"
													          >
														导出数据
													</a-button>
												</div>
												<div class="content-bd">
													<a-table :columns="fansTable2.columns" :dataSource="fansTable2.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<div style="width: 100%;" v-show="fansTable2.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable2.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable2.total" showSizeChanger
															              :showQuickJumper="fansTable2.quickJumper"
															              :current="fansTable2.page"
															              :pageSize="fansTable2.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage2"
															              @showSizeChange="showFansSizeChange2"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="新增客户数" key="3">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div class="day-picker-contain picker-contain">
														<a-button :class="timeType3== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType3(2)">
															按日
														</a-button>
														
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType3== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType3(3)">
															按周
														</a-button>
														
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType3== '4'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType3(4)">
															按月
														</a-button>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button @click="showDepartmentList">
															<span v-if="chooseNum3 == 0">选择成员</span>
															<span v-if="chooseNum3 > 0">已选择{{chooseUserNum3}}名成员，{{chooseDepartmentNum3}}个部门</span>
														</a-button>
													</div>
													<div class="month-picker-contain picker-contain" style="margin-left:5px">
														<a-range-picker
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType3=='2'"
																v-model="dayDate3"
																@change="changeFansTime3"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekStart3'
																:disabledDate="disabledDateWeek"
																v-if="timeType3=='3'"
																@change="changeFansStartWeek3"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd3'
																:disabledDate="disabledDateWeek"
																v-if="timeType3=='3'"
																@change="changeFansEndWeek3"
														/>
													</div>
												</div>
											</div>
											<div class="fans-data-trend">
												<LineCharts v-if="tabKey == 3"
												            :options="fansAdd3" style="width:100%;"
												>
												</LineCharts>
											</div>
											<div class="fans-data-detail">
												<div class="title-contain">
													<p>详细数据</p>
													<a-button @click="exportFansIncrease3" type="primary"
													          >
														导出数据
													</a-button>
												</div>
												<div class="content-bd">
													<a-table :columns="fansTable3.columns" :dataSource="fansTable3.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<div style="width: 100%;" v-show="fansTable3.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable3.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable3.total" showSizeChanger
															              :showQuickJumper="fansTable3.quickJumper"
															              :current="fansTable3.page"
															              :pageSize="fansTable3.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage3"
															              @showSizeChange="showFansSizeChange3"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="被客户删除/拉黑人数" key="4">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div class="day-picker-contain picker-contain">
														<a-button :class="timeType4== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType4(2)">
															按日
														</a-button>
														
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType4== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType4(3)">
															按周
														</a-button>
														
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType4== '4'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType4(4)">
															按月
														</a-button>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button @click="showDepartmentList">
															<span v-if="chooseNum4 == 0">选择成员</span>
															<span v-if="chooseNum4 > 0">已选择{{chooseUserNum4}}名成员，{{chooseDepartmentNum4}}个部门</span>
														</a-button>
													</div>
													<div class="month-picker-contain picker-contain" style="margin-left:5px">
														<a-range-picker
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType4=='2'"
																v-model="dayDate4"
																@change="changeFansTime4"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekStart4'
																:disabledDate="disabledDateWeek"
																v-if="timeType4=='3'"
																@change="changeFansStartWeek4"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd4'
																:disabledDate="disabledDateWeek"
																v-if="timeType4=='3'"
																@change="changeFansEndWeek4"
														/>
													</div>
												</div>
											</div>
											<div class="fans-data-trend">
												<LineCharts v-if="tabKey == 4"
												            :options="fansAdd4" style="width:100%;"
												>
												</LineCharts>
											</div>
											<div class="fans-data-detail">
												<div class="title-contain">
													<p>详细数据</p>
													<a-button @click="exportFansIncrease4" type="primary"
													          >
														导出数据
													</a-button>
												</div>
												<div class="content-bd">
													<a-table :columns="fansTable4.columns" :dataSource="fansTable4.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<div style="width: 100%;" v-show="fansTable4.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable4.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable4.total" showSizeChanger
															              :showQuickJumper="fansTable4.quickJumper"
															              :current="fansTable4.page"
															              :pageSize="fansTable4.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage4"
															              @showSizeChange="showFansSizeChange4"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
								</a-tabs>
							</template>
						</div>
					</div>
				</div>
			</a-spin>
		</div>
		<!--	自定义滚动条		-->
		<!--部门选择框-->
		<chooseDepartment :show="showModalDepartment" :chooseNum="chooseNumber"
		                  :callback="modalVisibleChange3" :is_special="1"
		                  ref="user"></chooseDepartment>
	</div>
</template>

<script>
	import LineCharts from '../../../components/echarts/LineCharts'
	import BarCharts from '../../../components/echarts/BarCharts'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	// import corpAuthorize from "@/components/CorpAuthorize.vue"
	import corpAuthorize from "@/components/AuthorizeCorp.vue"
	import moment from 'moment'


	export default {
		name      : 'HomeLeftContain',
		components: {
			LineCharts,
			BarCharts,
			chooseDepartment,
			corpAuthorize
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				chooseNumber       : 0,//整合后传给组件的成员值
				corpId             : corpId,//企业微信选中的id
				showWxModal        : false,
				spinning           : true,
				// 总指标总览
				totalIndicatorsData: {},
				// 店铺指标总览数据
				storeIndicatorsData: {
					one  : {
						count : "--",
						status: "1",
						per   : "--"
					},
					two  : {
						count : "--",
						status: "1",
						per   : "--"
					},
					three: {
						count : "--",
						status: "1",
						per   : "--"
					},
					four : {
						count : "--",
						status: "1",
						per   : "--"
					},
					five : {
						count : "--",
						status: "1",
						per   : "--"
					}
				},
				// 展示公众号id
				wxId               : "",
				tabKey             : 1,
				// 微信号左右换页
				wxPage             : 1,
				wxPageSize         : 5,
				wxMaxPage          : 0,
				wxList             : [], // 微信列表
				// 企业微信列表
				storeList          : [],

				/* 成员TOP10 */
				wheelFlag    : true,
				fansAddTime  : {
					ds_date: moment().subtract(8, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate      : [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
				weekStart    : moment().subtract(7, 'days'),
				weekEnd      : moment().subtract(7, 'days'),
				s_week       : '',
				timeType     : 2,  //成员TOP10tab时间类型选择
				// 成员TOP10折线图
				fansAdd      : {
					title     : '成员TOP10',
					xAxisData : [],
					data_Type : 1,
					name      : '发起申请数',
					seriesData: [
						{
							data  : [],
							name  : "净增长",
							smooth: true,
							type  : "line"
						},
						{
							data  : [],
							name  : "取消关注",
							smooth: true,
							type  : "line"
						},
						{
							data  : [],
							name  : "新增关注",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue   : [],//成员TOP10-选择的成员id数组
				chooseNum    : 0,//成员TOP10-已选择的成员数量
				// 成员TOP10表格
				fansTableList: [],
				fansTable    : {
					columns    : [
						{
							title    : "排行",
							dataIndex: "sort",
							key      : "sort",
						},
						{
							title    : "员工姓名",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "发起申请数",
							dataIndex: "cnt_num",
							key      : "cnt_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 发起申请数 */
				wheelFlag2          : true,
				fansAddTime2        : {
					ds_date: moment().subtract(8, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate2            : [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
				weekStart2          : moment().subtract(7, 'days'),
				weekEnd2            : moment().subtract(7, 'days'),
				s_week2             : '',
				timeType2           : 2,  //发起申请数tab时间类型选择
				// 发起申请数折线图
				fansAdd2            : {
					title     : '发起申请数趋势',
					legendData: ["发起申请数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "净增长",
							smooth: true,
							type  : "line"
						},
						{
							data  : [],
							name  : "取消关注",
							smooth: true,
							type  : "line"
						},
						{
							data  : [],
							name  : "新增关注",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue2         : [],//发起申请数-选择的成员id数组
				chooseNum2          : 0,//发起申请数-已选择的总数量
				chooseUserNum2      : 0,//发起申请数-已选择的成员数量
				chooseDepartmentNum2: 0,//发起申请数-已选择的部门数量
				// 发起申请数表格
				fansTableList2      : [],
				fansTable2          : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "发起申请数",
							dataIndex: "cnt_num",
							key      : "cnt_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 新增客户数 */
				wheelFlag3          : true,
				fansAddTime3        : {
					ds_date: moment().subtract(8, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate3            : [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
				weekStart3          : moment().subtract(7, 'days'),
				weekEnd3            : moment().subtract(7, 'days'),
				s_week3             : '',
				timeType3           : 2,  //新增客户数tab时间类型选择
				// 新增客户数折线图
				fansAdd3            : {
					title     : '新增客户数趋势',
					legendData: ["新增客户数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "净增长",
							smooth: true,
							type  : "line"
						},
						{
							data  : [],
							name  : "取消关注",
							smooth: true,
							type  : "line"
						},
						{
							data  : [],
							name  : "新增关注",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue3         : [],//新增客户数-选择的成员id数组
				chooseNum3          : 0,//新增客户数-已选择的总数量
				chooseUserNum3      : 0,//新增客户数-已选择的成员数量
				chooseDepartmentNum3: 0,//新增客户数-已选择的部门数量
				// 新增客户数表格
				fansTableList3      : [],
				fansTable3          : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "新增客户数",
							dataIndex: "cnt_num",
							key      : "cnt_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 被客户删除/拉黑人数 */
				wheelFlag4          : true,
				fansAddTime4        : {
					ds_date: moment().subtract(8, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate4            : [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
				weekStart4          : moment().subtract(7, 'days'),
				weekEnd4            : moment().subtract(7, 'days'),
				s_week4             : '',
				timeType4           : 2,  //被客户删除/拉黑人数tab时间类型选择
				// 被客户删除/拉黑人数折线图
				fansAdd4            : {
					title     : '被客户删除/拉黑人数趋势',
					legendData: ["删除或拉黑成员的客户数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "净增长",
							smooth: true,
							type  : "line"
						},
						{
							data  : [],
							name  : "取消关注",
							smooth: true,
							type  : "line"
						},
						{
							data  : [],
							name  : "新增关注",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue4         : [],//被客户删除/拉黑人数-选择的成员id数组
				chooseNum4          : 0,//被客户删除/拉黑人数-已选择的总数量
				chooseUserNum4      : 0,//被客户删除/拉黑人数-已选择的成员数量
				chooseDepartmentNum4: 0,//被客户删除/拉黑人数-已选择的部门数量
				// 被客户删除/拉黑人数表格
				fansTableList4      : [],
				fansTable4          : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "被客户删除/拉黑人数",
							dataIndex: "cnt_num",
							key      : "cnt_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				changeWidthSmallFlag: false,
				scrollOutFlag       : false,
				showModalDepartment : false, //成员选择框显示与隐藏
				checkedList2        : [],
				checkedList3        : [],
				checkedList4        : [],
			}
		},
		created () {

		},
		mounted () {
			this.initPage()
		},
		methods   : {
			// 授权弹窗显示
			addAccount () {
				this.showWxModal = true;
			},
			// 授权弹窗隐藏
			cancel () {
				this.showWxModal = false
			},
			// 公众号切换轮播向前箭头
			prevWxTpl () {
				if (this.wxPage > 1) {
					this.wxPage = this.wxPage - 1
					this.storeList = this.getWxList(this.wxList, this.wxPage, this.wxPageSize)
				}
			},
			// 公众号切换轮播向后箭头
			nextWxTpl () {
				if (this.wxPage < this.wxMaxPage) {
					this.wxPage = this.wxPage + 1
					this.storeList = this.getWxList(this.wxList, this.wxPage, this.wxPageSize)
				}
			},

			initPage () {
				let that = this
				this.$store.dispatch('getCorp', (info) => {
					that.wxList = info
					if (info.length == 0) {
						that.spinning = false
					} else {
						that.wxMaxPage = Math.ceil(info.length / that.wxPageSize)
						that.storeList = this.getWxList(that.wxList, that.wxPage, that.wxPageSize)
						if (that.$store.state.corpId) {
							that.wxId = that.$store.state.corpId
						} else {
							if (that.storeList && that.storeList.length > 0) {
								that.wxId = that.storeList[0].corpid
								that.storeList.map((x) => {
									if (that.wxId == x.corpid) {
										this.$store.dispatch("changeCorp", x);
									}
								})
								that.$emit('changeWxId', that.wxId)
							}
						}
						that.getFansTop()
						let s_date = this.fansAddTime.ds_date
						let e_date = this.fansAddTime.de_date
						this.getFansIncrease(this.timeType, s_date, e_date, this.fansAddTime.ws_week, 0)
					}
				});
			},
			// 获取微信列表
			getWxList (list, page, pageSize) {
				let maxNum = page * pageSize;
				let minNum = (page - 1) * pageSize
				let pageData = []
				if (list.length < maxNum) {
					maxNum = list.length
				}
				for (let i = minNum; i < maxNum; i++) {
					pageData.push(list[i])
				}
				return pageData
			},
			// 总览
			async getFansTop () {
				let that = this
				const {data: res} = await this.axios.post("work-user-statistic/work-user-data", {
					corp_id: this.wxId
				});
				if (res.error == 0) {
					that.storeIndicatorsData = res.data
				}
			},
			// 表格颜色
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//部门选择弹窗组件
			showDepartmentList () {
				if (this.wxList.length == 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.warning('请授权企业微信')
					return false
				}
				if (this.tabKey == 2) {
					this.chooseNumber = this.chooseNum2
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.staffValue2))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList2))
				} else if (this.tabKey == 3) {
					this.chooseNumber = this.chooseNum3
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.staffValue3))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList3))
				} else if (this.tabKey == 4) {
					this.chooseNumber = this.chooseNum4
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.staffValue4))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList4))
				}
				this.showModalDepartment = true
			},
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.tabKey == 2) {
						this.staffValue2 = arr
						this.chooseNum2 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum2 = userNum
						this.chooseDepartmentNum2 = departmentNum
						this.checkedList2 = list
						if (this.timeType2 == 2) {
							this.get2(this.timeType2, this.fansAddTime2.ds_date, this.fansAddTime2.de_date, this.fansAddTime2.ws_week, 0)
						} else if (this.timeType2 == 3) {
							this.get2(this.timeType2, this.fansAddTime2.ws_date, this.fansAddTime2.we_date, this.fansAddTime2.ws_week, 0)
						} else if (this.timeType2 == 4) {
							let s_date = moment().startOf('month').format("YYYY-MM-DD")
							let e_date = moment(new Date()).format('YYYY-MM-DD')
							this.get2(this.timeType2, s_date, e_date, this.fansAddTime2.ws_week, 0)
						}

					} else if (this.tabKey == 3) {
						this.staffValue3 = arr
						this.chooseNum3 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum3 = userNum
						this.chooseDepartmentNum3 = departmentNum
						this.checkedList3 = list
						if (this.timeType3 == 2) {
							this.get2(this.timeType3, this.fansAddTime3.ds_date, this.fansAddTime3.de_date, this.fansAddTime3.ws_week, 0)
						} else if (this.timeType3 == 3) {
							this.get2(this.timeType3, this.fansAddTime3.ws_date, this.fansAddTime3.we_date, this.fansAddTime3.ws_week, 0)
						} else if (this.timeType3 == 4) {
							let s_date = moment().startOf('month').format("YYYY-MM-DD")
							let e_date = moment(new Date()).format('YYYY-MM-DD')
							this.get2(this.timeType3, s_date, e_date, this.fansAddTime3.ws_week, 0)
						}
					} else if (this.tabKey == 4) {
						this.staffValue4 = arr
						this.chooseNum4 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum4 = userNum
						this.chooseDepartmentNum4 = departmentNum
						this.checkedList4 = list
						if (this.timeType4 == 2) {
							this.get2(this.timeType4, this.fansAddTime4.ds_date, this.fansAddTime4.de_date, this.fansAddTime4.ws_week, 0)
						} else if (this.timeType4 == 3) {
							this.get2(this.timeType4, this.fansAddTime4.ws_date, this.fansAddTime4.we_date, this.fansAddTime4.ws_week, 0)
						} else if (this.timeType4 == 4) {
							let s_date = moment().startOf('month').format("YYYY-MM-DD")
							let e_date = moment(new Date()).format('YYYY-MM-DD')
							this.get2(this.timeType4, s_date, e_date, this.fansAddTime4.ws_week, 0)
						}
					}
				}
				this.showModalDepartment = false
			},
			//重置
			clearDepartmentList () {
				if (this.tabKey == 2) {
					this.staffValue2 = []
					this.chooseNum2 = 0
					let s_date = this.fansAddTime2.ds_date
					let e_date = this.fansAddTime2.de_date
					if (this.timeType2 == 3) {
						s_date = this.fansAddTime2.ws_date
						e_date = this.fansAddTime2.we_date
					}
					this.get2(this.timeType2, s_date, e_date, this.fansAddTime2.ws_week, 0)
				} else if (this.tabKey == 3) {
					this.staffValue3 = []
					this.chooseNum3 = 0
					let s_date = this.fansAddTime3.ds_date
					let e_date = this.fansAddTime3.de_date
					if (this.timeType3 == 3) {
						s_date = this.fansAddTime3.ws_date
						e_date = this.fansAddTime3.we_date
					}
					this.get2(this.timeType3, s_date, e_date, this.fansAddTime3.ws_week, 0)
				} else if (this.tabKey == 4) {
					this.staffValue4 = []
					this.chooseNum4 = 0
					let s_date = this.fansAddTime4.ds_date
					let e_date = this.fansAddTime4.de_date
					if (this.timeType4 == 3) {
						s_date = this.fansAddTime4.ws_date
						e_date = this.fansAddTime4.we_date
					}
					this.get2(this.timeType4, s_date, e_date, this.fansAddTime4.ws_week, 0)
				}
			},

			//切换柱状图显示数据
			changeBarType (val) {
				this.fansAdd.data_Type = val
				if (val == 1) {
					this.fansAdd.name = '发起申请数'
				} else if (val == 2) {
					this.fansAdd.name = '新增客户数'
				} else if (val == 3) {
					this.fansAdd.name = '被客户删除/拉黑人数'
				}
				let s_date = this.fansAddTime.ds_date
				let e_date = this.fansAddTime.de_date
				if (this.timeType == 3) {
					s_date = this.fansAddTime.ws_date
					e_date = this.fansAddTime.we_date
				}
				if (val == 1) {
					this.fansTable.columns[2].title = '发起申请数'
				} else if (val == 2) {
					this.fansTable.columns[2].title = '新增客户数'
				} else if (val == 3) {
					this.fansTable.columns[2].title = '被客户删除/拉黑人数'
				}
				this.getFansIncrease(this.timeType, s_date, e_date, this.fansAddTime.ws_week, 0)
			},

			// 成员TOP10
			async getFansIncrease (type, s_date, e_date, s_week, is_export) {
				let that = this
				let params = {
					s_date   : s_date,
					e_date   : e_date,
					s_week   : s_week,
					type     : type,
					is_export: is_export,
					corp_id  : this.wxId,
					data_Type: this.fansAdd.data_Type
				}
				const {data: res} = await this.axios.post("work-user-statistic/work-user-top", params);
				if (res.error == 0) {
					if (is_export != 1) {
						that.fansAdd.seriesData = res.data.seriesData
						that.fansAdd.xAxisData = res.data.xData
						that.fansTableList = res.data.user_data
						let table = that.getPageData(that.fansTableList, that.fansTable.page, that.fansTable.pageSize)
						that.fansTable.total = that.fansTableList.length
						that.fansTable.list = table.list
						that.fansTable.page = table.page
					} else {
						window.open(res.data.url);
					}
				} else {
					this.$message.error(res.error_msg);
				}
				this.spinning = false
			},
			// 成员TOP10页码改变
			changeFansPage1 (val) {
				let that = this
				that.fansTable.page = val
				let table = that.getPageData(that.fansTableList, that.fansTable.page, that.fansTable.pageSize)
				that.fansTable.list = table.list
				that.fansTable.page = table.page
				if (this.fansTable.list.length > 10) {
					this.wheelFlag = false
				}
				this.$nextTick(() => {
					if (document.getElementsByClassName('ant-layout').length > 1) {
						document.getElementsByClassName('ant-layout')[2].scrollTo(0, 800)
					}
				})
			},
			// 成员TOP10表格分页pageSize改变
			showFansSizeChange1 (page, pageSize) {
				let that = this
				that.fansTable.pageSize = pageSize
				let table = that.getPageData(that.fansTableList, that.fansTable.page, that.fansTable.pageSize)
				that.fansTable.list = table.list
				that.fansTable.page = table.page
				if (this.fansTable.list.length > 10) {
					this.wheelFlag = false
				}
			},

			// 发起申请数、新增客户数、被客户删除/拉黑人数
			async get2 (type, s_date, e_date, s_week, is_export) {
				let that = this
				let data_Type = 0
				var user_ids = []
				if (this.tabKey == 2) {
					data_Type = 1
					user_ids = this.staffValue2
				} else if (this.tabKey == 3) {
					data_Type = 2
					user_ids = this.staffValue3
				} else if (this.tabKey == 4) {
					data_Type = 3
					user_ids = this.staffValue4
				}
				let params = {
					s_date   : s_date,
					e_date   : e_date,
					s_week   : s_week,
					type     : type,
					is_export: is_export,
					corp_id  : this.wxId,
					data_Type: data_Type,
					user_ids : user_ids
				}
				const {data: res} = await this.axios.post("work-user-statistic/work-user-increase", params);
				if (res.error == 0) {
					if (is_export != 1) {
						if (this.tabKey == 2) {
							// that.fansAdd2.legendData = res.data.legData
							that.fansAdd2.seriesData = res.data.seriesData
							that.fansAdd2.xAxisData = res.data.xData
							that.fansTableList2 = res.data.user_data
							let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
							that.fansTable2.total = that.fansTableList2.length
							that.fansTable2.list = table.list
							that.fansTable2.page = table.page
						} else if (this.tabKey == 3) {
							// that.fansAdd3.legendData = res.data.legData
							that.fansAdd3.seriesData = res.data.seriesData
							that.fansAdd3.xAxisData = res.data.xData
							that.fansTableList3 = res.data.user_data
							let table = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
							that.fansTable3.total = that.fansTableList3.length
							that.fansTable3.list = table.list
							that.fansTable3.page = table.page
						} else if (this.tabKey == 4) {
							// that.fansAdd4.legendData = res.data.legData
							that.fansAdd4.seriesData = res.data.seriesData
							that.fansAdd4.xAxisData = res.data.xData
							that.fansTableList4 = res.data.user_data
							let table = that.getPageData(that.fansTableList4, that.fansTable4.page, that.fansTable4.pageSize)
							that.fansTable4.total = that.fansTableList4.length
							that.fansTable4.list = table.list
							that.fansTable4.page = table.page
						}

					} else {
						window.open(res.data.url);
					}
				} else {
					this.$message.error(res.error_msg);
				}
				this.spinning = false
			},
			// 发起申请数页码改变
			changeFansPage2 (val) {
				let that = this
				that.fansTable2.page = val
				let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
				that.fansTable2.list = table.list
				that.fansTable2.page = table.page
				if (this.fansTable2.list.length > 10) {
					this.wheelFlag2 = false
				}
				this.$nextTick(() => {
					if (document.getElementsByClassName('ant-layout').length > 1) {
						document.getElementsByClassName('ant-layout')[2].scrollTo(0, 800)
					}
				})
			},
			// 发起申请数表格分页pageSize改变
			showFansSizeChange2 (page, pageSize) {
				let that = this
				that.fansTable2.pageSize = pageSize
				let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
				that.fansTable2.list = table.list
				that.fansTable2.page = table.page
				if (this.fansTable2.list.length > 10) {
					this.wheelFlag2 = false
				}
			},// 发起申请数

			// 新增客户数页码改变
			changeFansPage3 (val) {
				let that = this
				that.fansTable3.page = val
				let table = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
				that.fansTable3.list = table.list
				that.fansTable3.page = table.page
				if (this.fansTable3.list.length > 10) {
					this.wheelFlag3 = false
				}
				this.$nextTick(() => {
					if (document.getElementsByClassName('ant-layout').length > 1) {
						document.getElementsByClassName('ant-layout')[2].scrollTo(0, 800)
					}
				})
			},
			// 新增客户数表格分页pageSize改变
			showFansSizeChange3 (page, pageSize) {
				let that = this
				that.fansTable3.pageSize = pageSize
				let table = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
				that.fansTable3.list = table.list
				that.fansTable3.page = table.page
				if (this.fansTable3.list.length > 10) {
					this.wheelFlag3 = false
				}
			},

			// 被客户删除/拉黑人数页码改变
			changeFansPage4 (val) {
				let that = this
				that.fansTable4.page = val
				let table = that.getPageData(that.fansTableList4, that.fansTable4.page, that.fansTable4.pageSize)
				that.fansTable4.list = table.list
				that.fansTable4.page = table.page
				if (this.fansTable4.list.length > 10) {
					this.wheelFlag4 = false
				}
				this.$nextTick(() => {
					if (document.getElementsByClassName('ant-layout').length > 1) {
						document.getElementsByClassName('ant-layout')[2].scrollTo(0, 800)
					}
				})
			},
			// 被客户删除/拉黑人数表格分页pageSize改变
			showFansSizeChange4 (page, pageSize) {
				let that = this
				that.fansTable4.pageSize = pageSize
				let table = that.getPageData(that.fansTableList4, that.fansTable4.page, that.fansTable4.pageSize)
				that.fansTable4.list = table.list
				that.fansTable4.page = table.page
				if (this.fansTable4.list.length > 10) {
					this.wheelFlag4 = false
				}
			},

			disabledDateHours (current) {
				return current > moment().endOf('day') || current < moment().subtract(3, "days");
			},
			disabledDateDay (current) {
				return current.valueOf() > new Date().getTime() - 86400000 || current < moment().subtract(31, "days");
			},
			disabledDateWeek (current) {
				let weekOfday = moment(new Date()).format('E')
				return current.valueOf() > moment(new Date()).subtract(weekOfday, 'days') || current < moment().subtract(365, "days");
			},

			// 成员TOP10时间类型切换
			changeFansTimeType1 (type) {
				if (this.timeType != type) {
					this.spinning = true
					this.timeType = type;
					let s_date = ''
					let e_date = ''
					if (type == 2) {
						s_date = this.fansAddTime.ds_date
						e_date = this.fansAddTime.de_date
						this.dayDate = [moment(this.fansAddTime.ds_date), moment(this.fansAddTime.de_date)]
					} else if (type == 3) {
						if (moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
							this.fansAddTime.we_date = moment().format("YYYY-MM-DD")
						}
						s_date = this.fansAddTime.ws_date
						e_date = this.fansAddTime.we_date
					} else if (type == 4) {
						s_date = moment().startOf('month').format("YYYY-MM-DD")
						e_date = moment(new Date()).format('YYYY-MM-DD')
					}
					if (this.wxList.length == 0) {
						this.spinning = false
						return
					}
					this.getFansIncrease(this.timeType, s_date, e_date, this.fansAddTime.ws_week, 0)
				}

			},
			// 成员TOP10时间值
			changeFansTime1 (date, dateString) {
				this.spinning = true
				if (this.timeType == 2) {
					this.fansAddTime.ds_date = dateString[0]
					this.fansAddTime.de_date = dateString[1]
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.getFansIncrease(this.timeType, dateString[0], dateString[1], this.fansAddTime.ws_week, 0)
			},
			// 成员TOP10改变起始周
			changeFansStartWeek1 (date, dateString) {
				this.spinning = true
				if (date > this.weekEnd) {
					this.weekStart = moment(JSON.parse(JSON.stringify(this.weekEnd)))
					this.weekEnd = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart).format('E')
					this.fansAddTime.ws_date = moment(this.weekStart).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd).format('E')
					this.fansAddTime.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime.ws_week = moment(this.fansAddTime.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekStart = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekStart).format('E')
					this.fansAddTime.ws_date = moment(this.weekStart).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					this.fansAddTime.ws_week = weekDay
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.getFansIncrease(this.timeType, this.fansAddTime.ws_date, this.fansAddTime.we_date, this.fansAddTime.ws_week, 0)
			},
			// 成员TOP10改变结束周
			changeFansEndWeek1 (date, dateString) {
				this.spinning = true
				if (date < this.weekStart) {
					this.weekEnd = moment(JSON.parse(JSON.stringify(this.weekStart)))
					this.weekStart = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart).format('E')
					this.fansAddTime.ws_date = moment(this.weekStart).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd).format('E')
					this.fansAddTime.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime.ws_week = moment(this.fansAddTime.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekEnd = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekEnd).format('E')
					this.fansAddTime.we_date = moment(this.weekEnd).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					this.fansAddTime.we_week = weekDay
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.getFansIncrease(this.timeType, this.fansAddTime.ws_date, this.fansAddTime.we_date, this.fansAddTime.ws_week, 0)
			},
			// 成员TOP10表格导出
			exportFansIncrease1 () {
				let s_date = ''
				let e_date = ''
				if (this.timeType == 2) {
					s_date = this.fansAddTime.ds_date
					e_date = this.fansAddTime.de_date
				} else if (this.timeType == 3) {
					if (moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
						this.fansAddTime.we_date = moment().format("YYYY-MM-DD")
					}
					s_date = this.fansAddTime.ws_date
					e_date = this.fansAddTime.we_date
				} else if (this.timeType == 4) {
					s_date = moment().startOf('month').format("YYYY-MM-DD")
					e_date = moment(new Date()).format('YYYY-MM-DD')
				}
				this.getFansIncrease(this.timeType, s_date, e_date, this.fansAddTime.ws_week, 1)

			},

			// 发起申请数时间类型切换
			changeFansTimeType2 (type) {
				if (this.timeType2 != type) {
					this.spinning = true
					this.timeType2 = type;
					let s_date = ''
					let e_date = ''
					if (type == 2) {
						s_date = this.fansAddTime2.ds_date
						e_date = this.fansAddTime2.de_date
						this.dayDate2 = [moment(this.fansAddTime2.ds_date), moment(this.fansAddTime2.de_date)]
					} else if (type == 3) {
						if (moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
							this.fansAddTime2.we_date = moment().format("YYYY-MM-DD")
						}
						s_date = this.fansAddTime2.ws_date
						e_date = this.fansAddTime2.we_date
					} else if (type == 4) {
						s_date = moment().startOf('month').format("YYYY-MM-DD")
						e_date = moment(new Date()).format('YYYY-MM-DD')
					}
					if (this.wxList.length == 0) {
						this.spinning = false
						return
					}
					this.get2(this.timeType2, s_date, e_date, this.fansAddTime2.ws_week, 0)
				}

			},
			// 发起申请数时间值
			changeFansTime2 (date, dateString) {
				this.spinning = true
				if (this.timeType2 == 2) {
					this.fansAddTime2.ds_date = dateString[0]
					this.fansAddTime2.de_date = dateString[1]
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.get2(this.timeType2, dateString[0], dateString[1], this.fansAddTime2.ws_week, 0)
			},
			// 发起申请数改变起始周
			changeFansStartWeek2 (date, dateString) {
				this.spinning = true
				if (date > this.weekEnd2) {
					this.weekStart2 = moment(JSON.parse(JSON.stringify(this.weekEnd2)))
					this.weekEnd2 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart2).format('E')
					this.fansAddTime2.ws_date = moment(this.weekStart2).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd2).format('E')
					this.fansAddTime2.we_date = moment(this.weekEnd2).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime2.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime2.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime2.ws_week = moment(this.fansAddTime2.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekStart2 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekStart2).format('E')
					this.fansAddTime2.ws_date = moment(this.weekStart2).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					this.fansAddTime2.ws_week = weekDay
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.get2(this.timeType2, this.fansAddTime2.ws_date, this.fansAddTime2.we_date, this.fansAddTime2.ws_week, 0)
			},
			// 发起申请数改变结束周
			changeFansEndWeek2 (date, dateString) {
				this.spinning = true
				if (date < this.weekStart2) {
					this.weekEnd2 = moment(JSON.parse(JSON.stringify(this.weekStart2)))
					this.weekStart2 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart2).format('E')
					this.fansAddTime2.ws_date = moment(this.weekStart2).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd2).format('E')
					this.fansAddTime2.we_date = moment(this.weekEnd2).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime2.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime2.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime2.ws_week = moment(this.fansAddTime2.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekEnd2 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekEnd2).format('E')
					this.fansAddTime2.we_date = moment(this.weekEnd2).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					this.fansAddTime2.we_week = weekDay
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.get2(this.timeType2, this.fansAddTime2.ws_date, this.fansAddTime2.we_date, this.fansAddTime2.ws_week, 0)
			},
			// 发起申请数表格导出
			exportFansIncrease2 () {
				let s_date = ''
				let e_date = ''
				if (this.timeType2 == 2) {
					s_date = this.fansAddTime2.ds_date
					e_date = this.fansAddTime2.de_date
				} else if (this.timeType2 == 3) {
					if (moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
						this.fansAddTime2.we_date = moment().format("YYYY-MM-DD")
					}
					s_date = this.fansAddTime2.ws_date
					e_date = this.fansAddTime2.we_date
				} else if (this.timeType2 == 4) {
					s_date = moment().startOf('month').format("YYYY-MM-DD")
					e_date = moment(new Date()).format('YYYY-MM-DD')
				}
				this.get2(this.timeType2, s_date, e_date, this.fansAddTime2.ws_week, 1)

			},

			// 新增客户数时间类型切换
			changeFansTimeType3 (type) {
				if (this.timeType3 != type) {
					this.spinning = true
					this.timeType3 = type;
					let s_date = ''
					let e_date = ''
					if (type == 2) {
						s_date = this.fansAddTime3.ds_date
						e_date = this.fansAddTime3.de_date
						this.dayDate3 = [moment(this.fansAddTime3.ds_date), moment(this.fansAddTime3.de_date)]
					} else if (type == 3) {
						if (moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
							this.fansAddTime3.we_date = moment().format("YYYY-MM-DD")
						}
						s_date = this.fansAddTime3.ws_date
						e_date = this.fansAddTime3.we_date
					} else if (type == 4) {
						s_date = moment().startOf('month').format("YYYY-MM-DD")
						e_date = moment(new Date()).format('YYYY-MM-DD')
					}
					if (this.wxList.length == 0) {
						this.spinning = false
						return
					}
					this.get2(this.timeType3, s_date, e_date, this.fansAddTime3.ws_week, 0)
				}

			},
			// 新增客户数时间值
			changeFansTime3 (date, dateString) {
				this.spinning = true
				if (this.timeType3 == 2) {
					this.fansAddTime3.ds_date = dateString[0]
					this.fansAddTime3.de_date = dateString[1]
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.get2(this.timeType3, dateString[0], dateString[1], this.fansAddTime3.ws_week, 0)
			},
			// 新增客户数改变起始周
			changeFansStartWeek3 (date, dateString) {
				this.spinning = true
				if (date > this.weekEnd3) {
					this.weekStart3 = moment(JSON.parse(JSON.stringify(this.weekEnd3)))
					this.weekEnd3 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart3).format('E')
					this.fansAddTime3.ws_date = moment(this.weekStart3).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd3).format('E')
					this.fansAddTime3.we_date = moment(this.weekEnd3).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime3.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime3.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime3.ws_week = moment(this.fansAddTime3.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekStart3 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekStart3).format('E')
					this.fansAddTime3.ws_date = moment(this.weekStart3).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					this.fansAddTime3.ws_week = weekDay
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.get2(this.timeType3, this.fansAddTime3.ws_date, this.fansAddTime3.we_date, this.fansAddTime3.ws_week, 0)
			},
			// 新增客户数改变结束周
			changeFansEndWeek3 (date, dateString) {
				this.spinning = true
				if (date < this.weekStart3) {
					this.weekEnd3 = moment(JSON.parse(JSON.stringify(this.weekStart3)))
					this.weekStart3 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart3).format('E')
					this.fansAddTime3.ws_date = moment(this.weekStart3).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd3).format('E')
					this.fansAddTime3.we_date = moment(this.weekEnd3).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime3.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime3.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime3.ws_week = moment(this.fansAddTime3.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekEnd3 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekEnd3).format('E')
					this.fansAddTime3.we_date = moment(this.weekEnd3).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					this.fansAddTime3.we_week = weekDay
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.get2(this.timeType3, this.fansAddTime3.ws_date, this.fansAddTime3.we_date, this.fansAddTime3.ws_week, 0)
			},
			// 新增客户数表格导出
			exportFansIncrease3 () {
				let s_date = ''
				let e_date = ''
				if (this.timeType3 == 2) {
					s_date = this.fansAddTime3.ds_date
					e_date = this.fansAddTime3.de_date
				} else if (this.timeType3 == 3) {
					if (moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
						this.fansAddTime3.we_date = moment().format("YYYY-MM-DD")
					}
					s_date = this.fansAddTime3.ws_date
					e_date = this.fansAddTime3.we_date
				} else if (this.timeType3 == 4) {
					s_date = moment().startOf('month').format("YYYY-MM-DD")
					e_date = moment(new Date()).format('YYYY-MM-DD')
				}
				this.get2(this.timeType3, s_date, e_date, this.fansAddTime3.ws_week, 1)

			},

			// 被客户删除/拉黑人数时间类型切换
			changeFansTimeType4 (type) {
				if (this.timeType4 != type) {
					this.spinning = true
					this.timeType4 = type;
					let s_date = ''
					let e_date = ''
					if (type == 2) {
						s_date = this.fansAddTime4.ds_date
						e_date = this.fansAddTime4.de_date
						this.dayDate4 = [moment(this.fansAddTime4.ds_date), moment(this.fansAddTime4.de_date)]
					} else if (type == 3) {
						if (moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
							this.fansAddTime4.we_date = moment().format("YYYY-MM-DD")
						}
						s_date = this.fansAddTime4.ws_date
						e_date = this.fansAddTime4.we_date
					} else if (type == 4) {
						s_date = moment().startOf('month').format("YYYY-MM-DD")
						e_date = moment(new Date()).format('YYYY-MM-DD')
					}
					if (this.wxList.length == 0) {
						this.spinning = false
						return
					}
					this.get2(this.timeType4, s_date, e_date, this.fansAddTime4.ws_week, 0)
				}

			},
			// 被客户删除/拉黑人数时间值
			changeFansTime4 (date, dateString) {
				this.spinning = true
				if (this.timeType4 == 2) {
					this.fansAddTime4.ds_date = dateString[0]
					this.fansAddTime4.de_date = dateString[1]
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.get2(this.timeType4, dateString[0], dateString[1], this.fansAddTime4.ws_week, 0)
			},
			// 被客户删除/拉黑人数改变起始周
			changeFansStartWeek4 (date, dateString) {
				this.spinning = true
				if (date > this.weekEnd4) {
					this.weekStart4 = moment(JSON.parse(JSON.stringify(this.weekEnd4)))
					this.weekEnd4 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart4).format('E')
					this.fansAddTime4.ws_date = moment(this.weekStart4).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd4).format('E')
					this.fansAddTime4.we_date = moment(this.weekEnd4).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime4.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime4.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime4.ws_week = moment(this.fansAddTime4.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekStart4 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekStart4).format('E')
					this.fansAddTime4.ws_date = moment(this.weekStart4).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					this.fansAddTime4.ws_week = weekDay
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.get2(this.timeType4, this.fansAddTime4.ws_date, this.fansAddTime4.we_date, this.fansAddTime4.ws_week, 0)
			},
			// 被客户删除/拉黑人数改变结束周
			changeFansEndWeek4 (date, dateString) {
				this.spinning = true
				if (date < this.weekStart4) {
					this.weekEnd4 = moment(JSON.parse(JSON.stringify(this.weekStart4)))
					this.weekStart4 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart4).format('E')
					this.fansAddTime4.ws_date = moment(this.weekStart4).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd4).format('E')
					this.fansAddTime4.we_date = moment(this.weekEnd4).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime4.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime4.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime4.ws_week = moment(this.fansAddTime4.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekEnd4 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekEnd4).format('E')
					this.fansAddTime4.we_date = moment(this.weekEnd4).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					this.fansAddTime4.we_week = weekDay
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.get2(this.timeType4, this.fansAddTime4.ws_date, this.fansAddTime4.we_date, this.fansAddTime4.ws_week, 0)
			},
			// 被客户删除/拉黑人数表格导出
			exportFansIncrease4 () {
				let s_date = ''
				let e_date = ''
				if (this.timeType4 == 2) {
					s_date = this.fansAddTime4.ds_date
					e_date = this.fansAddTime4.de_date
				} else if (this.timeType4 == 3) {
					if (moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
						this.fansAddTime4.we_date = moment().format("YYYY-MM-DD")
					}
					s_date = this.fansAddTime4.ws_date
					e_date = this.fansAddTime4.we_date
				} else if (this.timeType4 == 4) {
					s_date = moment().startOf('month').format("YYYY-MM-DD")
					e_date = moment(new Date()).format('YYYY-MM-DD')
				}
				this.get2(this.timeType4, s_date, e_date, this.fansAddTime4.ws_week, 1)

			},

			// 切换店铺
			changeStoreId (id) {
				this.spinning = true
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.wxId = id;
				this.storeList.map((x) => {
					if (id == x.corpid) {
						this.$store.dispatch("changeCorp", x);
					}
				})
				this.$emit('changeWxId', id)
				this.getFansTop()
				if (this.tabKey == 1) {
					let s_date = this.fansAddTime.ds_date
					let e_date = this.fansAddTime.de_date
					if (this.timeType == 3) {
						s_date = this.fansAddTime.ws_date
						e_date = this.fansAddTime.we_date
					}
					this.getFansIncrease(this.timeType, s_date, e_date, this.fansAddTime.ws_week, 0)
				} else if (this.tabKey == 2) {
					let s_date = this.fansAddTime2.ds_date
					let e_date = this.fansAddTime2.de_date
					if (this.timeType2 == 3) {
						s_date = this.fansAddTime2.ws_date
						e_date = this.fansAddTime2.we_date
					}
					this.get2(this.timeType2, s_date, e_date, this.fansAddTime2.ws_week, 0)
				} else if (this.tabKey == 3) {
					let s_date = this.fansAddTime3.ds_date
					let e_date = this.fansAddTime3.de_date
					if (this.timeType3 == 3) {
						s_date = this.fansAddTime3.ws_date
						e_date = this.fansAddTime3.we_date
					}
					this.get2(this.timeType3, s_date, e_date, this.fansAddTime3.ws_week, 0)
				} else if (this.tabKey == 4) {
					let s_date = this.fansAddTime4.ds_date
					let e_date = this.fansAddTime4.de_date
					if (this.timeType4 == 3) {
						s_date = this.fansAddTime4.ws_date
						e_date = this.fansAddTime4.we_date
					}
					this.get2(this.timeType4, s_date, e_date, this.fansAddTime4.ws_week, 0)
				}
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			handleChange (value) {
				if (typeof value != 'undefined') {
					this.wxId = value
					this.changeStoreId(this.wxId)
				}
			},
			filterOption (input, option) {
				return (
					option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
				);
			},
			// 切换tabs
			changeTab (key) {
				this.spinning = true
				this.tabKey = key
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				if (key == 1) {
					let s_date = this.fansAddTime.ds_date
					let e_date = this.fansAddTime.de_date
					if (this.timeType == 3) {
						s_date = this.fansAddTime.ws_date
						e_date = this.fansAddTime.we_date
					}
					this.getFansIncrease(this.timeType, s_date, e_date, this.fansAddTime.ws_week, 0)
				} else if (key == 2) {
					let s_date = this.fansAddTime2.ds_date
					let e_date = this.fansAddTime2.de_date
					if (this.timeType2 == 3) {
						s_date = this.fansAddTime2.ws_date
						e_date = this.fansAddTime2.we_date
					}
					this.get2(this.timeType2, s_date, e_date, this.fansAddTime2.ws_week, 0)
				} else if (key == 3) {
					let s_date = this.fansAddTime3.ds_date
					let e_date = this.fansAddTime3.de_date
					if (this.timeType3 == 3) {
						s_date = this.fansAddTime3.ws_date
						e_date = this.fansAddTime3.we_date
					}
					this.get2(this.timeType3, s_date, e_date, this.fansAddTime3.ws_week, 0)
				} else if (key == 4) {
					let s_date = this.fansAddTime4.ds_date
					let e_date = this.fansAddTime4.de_date
					if (this.timeType4 == 3) {
						s_date = this.fansAddTime4.ws_date
						e_date = this.fansAddTime4.we_date
					}
					this.get2(this.timeType4, s_date, e_date, this.fansAddTime4.ws_week, 0)
				}
				this.spinning = false
			},
			// 表格分页
			getPageData (list, page, pageSize) {
				let maxNum = page * pageSize;
				let minNum = (page - 1) * pageSize
				let pageData = {
					page: page,
					list: []
				}
				if (list.length == 0) {
					pageData.list = []
				} else {
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
				}
				return pageData
			},
			moment,
		}
	}
</script>

<style scoped>
	.wx-list-tab >>> .ant-tabs-nav-container {
		height: 50px !important;
	}

	.wx-list-tab >>> .ant-tabs-tab {
		height: 50px !important;
		line-height: 50px !important;
		margin-right: 0px !important;
		/*margin-top: -1px !important;*/
		/*border-bottom: 1px solid #E9E9E9 !important;*/
		border: 0px !important;
		background-color: #F5F5F5 !important;
	}

	.wx-list-tab >>> .ant-tabs-tab div {
		max-width: 190px;
		min-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.wx-list-tab >>> .ant-tabs-tab-active {
		background-color: #FFFFFF !important;
		border-bottom: 0px !important;
	}

	/*滚动条背景*/
	.scro-right {
		position: relative;
		float: right;
		height: 100%;
		width: 12px;
		background-color: #E9E9E9;
		overflow: hidden;
	}

	/*滚动条*/
	.scro-line {
		position: absolute;
		z-index: 1;
		top: 0px;
		right: 2px;
		width: 5px;
		border-radius: 3px;
		height: 400px;
		overflow: hidden;
		background-color: #D3D3D3;
	}

	.home-left-contain {
		float: left;
		width: 100%;
		height: 100%;
		background-color: #F8F8F8;
		max-height: 100%;
	}

	.spinning-true {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.spinning-false {
		width: 100%;
		height: auto;
	}

	.home-spin {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}

	.measure-overview {
		width: 100%;
		background: #FFF;
		color: #686868;
		padding: 24px 20px 32px 20px;
		border: 1px solid #E0E0E0;
	}

	.measure-overview .card-title {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		color: #1A1A1A;
	}

	.measure-overview .card-title p {
		margin: 0;
	}

	.measure-overview .card-title span {
		font-size: 12px;
		opacity: .65;
		color: #686868;
	}

	.card-title .card-title-right {
		margin-left: auto;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.card-title .card-title-right .export-data-operate {
		height: 32px;
		width: 109px;
		border: 1px solid #D8D8D8;
		color: #686868;
		padding: 9px 15px;
		font-size: 14px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		cursor: pointer;
		margin-right: 12px;
	}

	.card-items-contain {
		margin-top: 27px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		-ms-flex-pack: center;
		justify-content: space-around;
	}

	.card-items-contain .card-item {
		max-width: 264px;
		min-width: 150px;
	}

	.card-items-contain .card-item .card-item-name {
		color: #1A1A1A;
		font-size: 14px;
		margin-bottom: 0px;
	}

	.card-items-contain .card-item .card-item-Numerical {
		font-family: DINAlternate-Bold;
		font-size: 24px;
		margin-bottom: 10px;
		margin-top: 8px;
	}

	.card-items-contain .card-item .card-item-rate {
		border: 1px solid #E9E9E9;
		border-radius: 2px;
		padding: 4px 4px 4px 8px;
		background: rgba(255, 255, 255, 0.1);
		display: inline;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		justify-content: space-between;
	}

	.card-items-contain .card-item .card-item-rate span {
		font-size: 12px;
		color: #1A1A1A;
	}

	.card-item-rate img {
		margin: 0px 5px 3px;
		width: 9px;
	}

	.tabs-contain {
		padding: 0px 8px 0px 20px;
	}

	.account-filter {
		height: 50px;
		background: #F7F7F7;

		/*display: -webkit-box;*/
		/*display: -ms-flexbox;*/
		/*display: flex;*/
		border-top: 1px solid #E9E9E9;
		border-right: 1px solid #E9E9E9;
		/*border-bottom: 1px solid #E9E9E9;*/
	}

	.account-filter-contain {
		width: 80%;
		width: calc(100% - 224px);
		width: -moz-calc(100% - 224px);
		width: -webkit-calc(100% - 224px);
		min-width: 350px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.account-filter-item, .account-filter-item1 {
		color: #1A1A1A;
		width: 190px;
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
	}

	.prev-ban {
		color: #E9E9E9;
	}

	.prev-light {
		color: #3B74FF;
	}

	.account-filter .account-filter-item.have-leftborder {
		border-left: 1px solid #E0E0E0;
	}

	.account-filter-item img {
		width: 24px;
		height: 24px;
		margin: 0px 10px;
	}

	.account-filter-item p {
		margin-bottom: 0px;
	}

	.account-filter .wxb-search-input-result-wrap.rightme {
		margin-left: auto;
	}

	.account-filter .wxb-search-input-result-wrap {
		margin-bottom: 0;
		margin-left: initial;
		margin-right: 20px;
		width: 224px;
		min-width: 100px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.wxb-search-input-result-wrap {
		width: 180px;
		position: relative;
		margin: 0 auto;
		margin-bottom: 20px;
	}

	.tabs-contain .single-account-contain {
		padding: 24px 20px 20px 20px;
		border: 1px #E9E9E9 solid;
		border-top: 0;
		background: #FFF;
	}

	.single-account-contain .single-accout-card {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-pack: center;
		justify-content: space-around;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		width: 100%;
	}

	.single-accout-card .single-accout-cardItem {
		width: 100%;
		height: 116px;
		padding: 12px;
		background: #F9F9F9;
		/* border: 1px solid #E9E9E9; */
		border-left: 0;
		border-radius: 4px
	}

	.single-accout-card .single-accout-cardItem p {
		font-family: DINAlternate-Bold;
		font-size: 28px;
		margin-bottom: 0px;
	}

	.single-accout-card .single-accout-cardItem span {
		font-size: 12px;
		color: #666666;
	}

	.single-accout-cardItem img {
		margin: 0px 5px 3px;
		width: 9px;
	}

	.single-account-contain .card-filter-contain {
		margin-top: 24px;
	}

	.fansgrow-contain .card-caledar {
		padding: 12px 16px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		background: #F7F7F7;
		border: 1px solid #E9E9E9;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		color: #686868;
	}

	.fansgrow-contain .card-caledar .picker-contain {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.fansgrow-contain .card-caledar .picker-contain .caledar-btn-selected {
		border: 0;
		border-right: 1px solid #01B065;
		background: rgba(1, 176, 101, 0.1);;
		border-radius: 4px;
		color: #01B065;
	}

	.fansgrow-contain .card-caledar .picker-contain button {
		margin: 0px 0px 0px 5px;
	}

	.fansgrow-contain .card-caledar.down-text {
		background: #FFFFFF;
		border: 1px solid #E9E9E9;
		border-bottom: 0;
	}

	.fansgrow-contain .card-caledar.down-text p {
		color: #1A1A1A !important;
		font-size: 14px;
		margin: 0px 8px 0px 0px;
	}

	.fansgrow-contain .card-caledar .color-red {
		color: #FF562D;
	}

	.card-filter-contain .fans-data-trend {
		padding: 24px;
		padding-bottom: 40px;
		border: 1px solid #E9E9E9;
	}

	.card-filter-contain .fans-data-detail {
		padding: 24px 24px 20px 24px;
		border: 1px solid #E9E9E9;
		border-top: 0;
	}

	.card-filter-contain .fans-data-detail .title-contain {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.card-filter-contain .fans-data-detail .title-contain p {
		font-family: PingFangSC-Medium;
		color: #1A1A1A;
		font-size: 14px;
		margin-bottom: 0px;
		vertical-align: center;
	}

	.card-filter-contain .fans-data-detail .title-contain button {
		margin-left: auto;
	}

	.card-filter-contain .fans-data-detail .content-bd {
		margin-top: 20px;
	}

	.fans-active-avg {
		font-weight: 700;
		background-color: #FFF;
		color: #01b065;
		border-bottom: 1px solid #E9E9E9;
	}

	.fans-active-avg span {
		display: inline-block;
		width: 14.28%;
		padding: 16px;
	}

	.loyalty-btn {
		padding: 3px 6px;
		background-color: #FFF;
		border: 1px solid #D8D8D8;
		cursor: pointer;
		outline: none;
	}

	.card-filter-contain p span {
		color: #FF562D;
	}

	.fans-stash {
		padding: 24px;
		border: 1px solid #E9E9E9;
	}

	.fans-stash .title {
		font-family: PingFangSC-Medium;
		color: #1A1A1A;
		font-size: 14px;
	}

	/deep/ .ant-input {
		border-radius: 0px !important;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.btn {
		width: 160px;
		height: 35px;
		font-size: 14px;
	}
</style>
