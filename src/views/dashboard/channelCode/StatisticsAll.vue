<template>
	<div style="width: 100%; height: 100%; overflow-y: scroll;position: absolute;" class="scroll">
		<div class="home-left-contain">
			<a-spin :spinning="spinning" tip="Loading..." size="large"
			        :class="spinning?'spinning-true':'spinning-false'">
				<div class="tabs-contain" style="margin-top: 20px">
					<div class="account-filter" v-if="wxList && wxList.length > 0">
						<a-tabs class="wx-list-tab" type="card" v-model="wxId" @change="changeStoreId"
						        style="width: 100%;">
							<a-tab-pane v-for="(item, index) in wxList" :key="item.corpid">
								<div slot="tab">
									<a-tooltip placement="top">
										<template slot="title">
											<span>{{item.corp_name}}</span>
										</template>
										<img style="width: 24px; height: 24px;" src="../../../assets/WeChatLogo.png"/>
										{{item.corp_name}}
									</a-tooltip>
								</div>
							</a-tab-pane>
						</a-tabs>
					</div>
					<div style="background-color: #FFF;text-align: center;padding-top: 20px;" v-if="wxList.length == 0">
						<p style="font-weight: 700;font-size: 18px;margin-top: 10px;">尚未绑定企业微信，该功能无法使用</p>
						<p style="font-size: 16px;color: #999999;">请点击下方按钮进行绑定</p>
						<a-button type="primary" class="btn" @click="addAccount">立即绑定</a-button>
						<corpAuthorize :show="showWxModal" @cancel="cancel"></corpAuthorize>
					</div>
					<div class="single-account-contain">
						<div class="spin-content">
							<div class="single-accout-card">
								<div class="single-accout-cardItem account-type"
								     v-for="(item, index) in storeIndicatorsData">
									<span>{{item.title}}
										<a-tooltip placement="right" v-if="item.des">
						                    <template slot="title">
						                      <span>{{item.des}}</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{item.count}}</p>
									<div>
										<span v-if="item.status !=0">比前日</span>
										<span v-if="item.status ==0">与前日持平</span>
										<img v-if="item.status==2"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='item.status==1'
										     src="../../../assets/home/img/arrowup.png"/>
										<span v-if="item.status !=0">{{item.per}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="card-filter-contain">
							<template>
								<a-tabs @change="changeTab" type="card"
								        style="background-color: #FFF;">
									<a-tab-pane tab="活码TOP10" key="1">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div style="margin-left: 5px;"
													     class="day-picker-contain picker-contain">
														<a-button :class="timeType== '1'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType1(1)">
															按日
														</a-button>
														<a-range-picker
																style="width: 270px;"
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType=='1'"
																v-model="dayDate"
																@change="changeFansTime1"
														/>
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType1(2)">
															按周
														</a-button>
														<a-week-picker
																:allowClear='false'
																:value='weekStart'
																:disabledDate="disabledDateWeek"
																v-if="timeType=='2'"
																@change="changeFansStartWeek1"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd'
																:disabledDate="disabledDateWeek"
																v-if="timeType=='2'"
																@change="changeFansEndWeek1"
														/>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType1(3)">
															按月
														</a-button>
													</div>
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 200px;margin-left: 10px;"
															placeholder='所有活码'
															@change="changeSearchType"
															v-model="searchType"
													>
														<template>
															<a-select-option :value="1">
																所有活码
															</a-select-option>
															<a-select-option :value="2">
																分组
															</a-select-option>
														</template>
													</a-select>
													<a-tree-select
															v-if="searchType == 2"
															style="width: 300px;margin-left: 10px;"
															:dropdownStyle="{ maxHeight: '300px',maxWidth: '300px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='所有分组'
															treeDefaultExpandAll
															@change="get1(0)"
															v-model="selectGroupId"
													>
													</a-tree-select>
												</div>
											</div>
											<div class="fans-data-trend">
												<div style="text-align: center;">
													<span style="cursor: pointer;" @click="changeBarType(1)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 1 ? '#3398DB' : '#CCC' }"></span>
														新增客户数</span>
													<span style="cursor: pointer;" @click="changeBarType(2)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 2 ? '#AD85F4' : '#CCC' }"></span>
														被客户拉黑/删除人数</span>
													<span style="cursor: pointer;" @click="changeBarType(3)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 3 ? '#FFC71B' : '#CCC' }"></span>
														删除人数</span>
													<span style="cursor: pointer;" @click="changeBarType(4)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 4 ? '#FA78AF' : '#CCC' }"></span>
														净增人数</span>
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
													          icon="download">
														导出数据
													</a-button>
												</div>
												<div class="content-bd">
													<a-table
															:columns="searchType == 1 ? fansTable.columns : (searchType == 2 && this.selectGroupId == '' ? fansTable.columns1 : fansTable.columns)"
															:dataSource="fansTable.list"
															:rowClassName="rowClassName"
															:pagination="false">
														<span slot="all_num">
															<span v-if="fansAdd.data_Type == 1">新增客户数</span>
															<span v-if="fansAdd.data_Type == 2">被客户删除/拉黑人数</span>
															<span v-if="fansAdd.data_Type == 3">删除人数</span>
															<span v-if="fansAdd.data_Type == 4">净增人数</span>
										                </span>
													</a-table>
													<div style="width: 100%;" v-show="fansTable.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable.total}}</span>
															条
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
									<a-tab-pane tab="客户增长" key="2">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div style="margin-left: 5px;"
													     class="day-picker-contain picker-contain">
														<a-button :class="timeType2== '1'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType2(1)">
															按日
														</a-button>
														<a-range-picker
																style="width: 270px;"
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType2=='1'"
																v-model="dayDate2"
																@change="changeFansTime2"
														/>
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType2== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType2(2)">
															按周
														</a-button>
														<a-week-picker
																:allowClear='false'
																:value='weekStart2'
																:disabledDate="disabledDateWeek"
																v-if="timeType2=='2'"
																@change="changeFansStartWeek2"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd2'
																:disabledDate="disabledDateWeek"
																v-if="timeType2=='2'"
																@change="changeFansEndWeek2"
														/>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType2== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType2(3)">
															按月
														</a-button>
													</div>
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 200px;margin-left: 10px;"
															placeholder='所有活码'
															@change="changeSearchType2"
															v-model="searchType2"
													>
														<template>
															<a-select-option :value="1">
																所有活码
															</a-select-option>
															<a-select-option :value="2">
																分组
															</a-select-option>
														</template>
													</a-select>
													<a-tree-select
															v-if="searchType2 == 2"
															style="width: 300px;margin-left: 10px;"
															:dropdownStyle="{ maxHeight: '300px',maxWidth: '300px', overflow: 'auto' }"
															:treeData="groupList2"
															placeholder='所有分组'
															treeDefaultExpandAll
															@change="get2(0)"
															v-model="selectGroupId2"
													>
													</a-tree-select>
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
													          icon="download">
														导出数据
													</a-button>
												</div>
												<div class="content-bd">
													<a-table :columns="fansTable2.columns" :dataSource="fansTable2.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
														<span slot="per">
															流失率
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 250px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">（被客户删除/拉黑人数+员工删除客户人数） / 当前总客户人数</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="increaseCnt">
															净增人数
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 250px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">新增人数-被客户删除/拉黑人数</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
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
									<a-tab-pane tab="客户属性" key="3">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<a-range-picker
															style="width: 270px;"
															:allowClear='false'
															:disabledDate="disabledDateDay"
															:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
															format="YYYY-MM-DD"
															@change="changeFansTime3"
													/>
													<a-tree-select
															style="width: 300px;margin-left: 10px;"
															:dropdownStyle="{ maxHeight: '300px',maxWidth: '300px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='所有分组'
															treeDefaultExpandAll
															@change="get3(0)"
															v-model="selectGroupId3"
													>
													</a-tree-select>
												</div>
											</div>
										</div>
										<div class="sec-card-caledar down-text"
										     style="border-top: 0px;">
											<p style="margin-bottom: 0px;">
												这段时间里，新增客户
												<span>{{increaseCount}}</span>
												人，客户占比
												<span>{{per}}</span>
											</p>
										</div>
										<div class="fans-data-trend">
											<div class="fans-type">
												<button :class="fansAttrAddSourceEChartsType?'fans-type-selected' : ''"
												        @click="changeFansAttrAddSourceEChartsType(true)">
													饼图
												</button>
												<button :class="!fansAttrAddSourceEChartsType?'fans-type-selected' : ''"
												        @click="changeFansAttrAddSourceEChartsType(false)">
													折线图
												</button>
											</div>
											<div>
												<PieCharts
														v-if="fansAttrAddSourceEChartsType && fansAdd3.pie.seriesData.length > 0"
														:options="fansAdd3.pie"
												>
												</PieCharts>
												<LineCharts
														v-if="!fansAttrAddSourceEChartsType && fansAdd3.line.seriesData.length > 0"
														:options="fansAdd3.line"
												>
												</LineCharts>
												<a-empty
														v-show="fansAdd3.line.seriesData.length == 0 || fansAdd3.pie.seriesData.length == 0"
														style="margin-top: 30px;">
													<span slot="description" style="color: #999;">暂无数据</span>
												</a-empty>
											</div>
										</div>
										<div class="fans-data-detail">
											<div class="title-contain">
												<p>详细数据</p>
												<a-button @click="exportFansIncrease3" type="primary"
												          icon="download">
													导出数据
												</a-button>
											</div>
											<div class="content-bd">
												<a-table :columns="fansTable3.columns" :dataSource="fansTable3.list"
												         :rowClassName="rowClassName"
												         :pagination="false">
												</a-table>
												<!--												<div style="width: 100%;" v-show="fansTable3.total > 0">-->
												<!--													<div style="height: 32px;display: inline-block;margin-top: 25px;">-->
												<!--														共-->
												<!--														<span style="color: blue">{{fansTable3.total}}</span>条-->
												<!--													</div>-->
												<!--													<div class="pagination" style="margin-top: 20px;float: right;">-->
												<!--														<a-pagination :total="fansTable3.total" showSizeChanger-->
												<!--														              :showQuickJumper="fansTable3.quickJumper"-->
												<!--														              :current="fansTable3.page"-->
												<!--														              :pageSize="fansTable3.pageSize"-->
												<!--														              :pageSizeOptions="['10','20','30','60']"-->
												<!--														              @change="changeFansPage3"-->
												<!--														              @showSizeChange="showFansSizeChange3"/>-->
												<!--													</div>-->
												<!--												</div>-->
											</div>
										</div>
										<div class="newfans-sexy">
											<div class="fans-type">
												<button :class="fansAttrAddSexEChartsType?'fans-type-selected' : ''"
												        @click="changeFansAttrAddSexEChartsType(true)">
													饼图
												</button>
												<button :class="!fansAttrAddSexEChartsType?'fans-type-selected' : ''"
												        @click="changeFansAttrAddSexEChartsType(false)">
													折线图
												</button>
											</div>
											<div>
												<PieCharts
														v-if="fansAttrAddSexEChartsType"
														:options="fansAdd3.sexPie"
												>
												</PieCharts>
												<LineCharts
														v-if="!fansAttrAddSexEChartsType"
														:options="fansAdd3.sexLine"
												>
												</LineCharts>
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
		<!--部门选择框-->
		<chooseDepartment :show="showModalDepartment" :chooseNum="chooseNumber"
		                  :callback="modalVisibleChange3" :is_external="1" :is_special="1"></chooseDepartment>
	</div>
</template>

<script>
	import LineCharts from '../../../components/echarts/LineCharts'
	import BarCharts from '../../../components/echarts/BarCharts'
	import PieCharts from '../../../components/echarts/PieCharts'
	import MapCharts from '../../../components/echarts/MapChart'
	import BarShadowCharts from "../../../components/echarts/BarShadowCharts"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import corpAuthorize from "@/components/CorpAuthorize.vue"
	import moment from 'moment'


	export default {
		name      : 'HomeLeftContain',
		components: {
			LineCharts,
			BarCharts,
			chooseDepartment,
			corpAuthorize,
			PieCharts,
			MapCharts,
			BarShadowCharts
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				chooseNumber       : 0,//整合后传给组件的值
				corpId             : corpId,//企业微信选中的id
				suite_id           : '',
				// 滚动条 ↓
				showWxModal        : false,
				spinning           : false,
				mouseEnterFlag     : false,
				scrollFlag         : true,
				scroRight          : true,
				//滚动条 ↑
				// 总指标总览
				totalIndicatorsData: {},
				// 店铺指标总览数据
				storeIndicatorsData: [
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 1, per: "80.0%"},
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 0, per: "100.0%"}
				],
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
				/* 活码TOP10 */
				wheelFlag          : true,
				fansAddTime        : {
					ds_date: moment().subtract(8, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate            : [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
				weekStart          : moment().subtract(7, 'days'),
				weekEnd            : moment().subtract(7, 'days'),
				s_week             : '',
				searchType         : 1,
				selectGroupId      : 0,
				groupList          : [],
				groupList2         : [],
				fileType           : 0,
				timeType           : 1,  //活码TOP10tab时间类型选择
				// 活码TOP10折线图
				fansAdd            : {
					title     : '活码TOP10',
					xAxisData : [],
					data_Type : 1,
					name      : '新增客户数',
					seriesData: [
						{
							data  : [],
							name  : "活码TOP10",
							smooth: true,
							type  : "line"
						}
					]
				},
				// 活码TOP10表格
				fansTableList      : [],
				fansTable          : {
					columns1   : [
						{
							title    : "排行",
							dataIndex: "sort",
							key      : "sort",
						},
						{
							title    : "所属分组",
							dataIndex: "group_name",
							key      : "group_name",
						},
						{
							slots    : {title: "all_num"},
							dataIndex: "all_num",
							key      : "all_num",
						}
					],
					columns    : [
						{
							title    : "排行",
							dataIndex: "sort",
							key      : "sort",
						},
						{
							title    : "活码名称",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "所属分组",
							dataIndex: "group_name",
							key      : "group_name",
						},
						{
							slots    : {title: "all_num"},
							dataIndex: "all_num",
							key      : "all_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 客户增长 */
				wheelFlag2    : true,
				fansAddTime2  : {
					ds_date: moment().subtract(8, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate2      : [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
				weekStart2    : moment().subtract(7, 'days'),
				weekEnd2      : moment().subtract(7, 'days'),
				s_week2       : '',
				searchType2   : 1,
				selectGroupId2: [],
				fileType2     : 0,
				name2         : '',
				timeType2     : 1,  //客户增长tab时间类型选择
				// 客户增长折线图
				fansAdd2      : {
					title     : '客户增长',
					legendData: [],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "",
							smooth: true,
							type  : "line"
						}
					]
				},
				// 客户增长表格
				fansTableList2: [],
				fansTable2    : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "新增客户数",
							dataIndex: "new_contact_cnt",
							key      : "new_contact_cnt",
						},
						{
							title    : "被客户删除/拉黑人数",
							dataIndex: "negative_feedback_cnt",
							key      : "negative_feedback_cnt",
						},
						{
							title    : "删除人数",
							dataIndex: "delete_cnt",
							key      : "delete_cnt",
						},
						{
							// title    : "流失率",
							dataIndex  : "per",
							key        : "per",
							scopedSlots: {title: "per"}
						},
						{
							// title    : "净增人数",
							dataIndex  : "increase_cnt",
							key        : "increase_cnt",
							scopedSlots: {title: "increaseCnt"}
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 客户增长 */
				wheelFlag3                  : true,
				searchType3                 : 1,
				fansAddTime3                : {
					ds_date: moment().subtract(8, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate3                    : [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
				weekStart3                  : moment().subtract(7, 'days'),
				weekEnd3                    : moment().subtract(7, 'days'),
				s_week3                     : '',
				timeType3                   : 1,  //客户增长tab时间类型选择
				name3                       : '',
				selectGroupId3              : [],
				fileType3                   : 0,
				//客户增长折线图
				fansAdd3                    : {
					line   : {
						title     : '新增客户来源',
						legendData: [],
						xAxisData : [],
						seriesData: []
					},
					pie    : {
						title     : '新增客户来源',
						formatter : "{b} {c} 占比 {d}%",
						seriesData: []
					},
					sexLine: {
						title     : '新增客户性别',
						legendData: ["男", "女", "未知"],
						xAxisData : [],
						seriesData: [
							{
								name  : "男",
								type  : "line",
								smooth: true,
								data  : []
							}, {
								name  : "女",
								type  : "line",
								smooth: true,
								data  : []
							}, {
								name  : "未知",
								type  : "line",
								smooth: true,
								data  : []
							}
						],
					},
					// 粉丝性别柱形图
					sexPie : {
						title     : '新增客户性别',
						formatter : "{b} {c} 占比 {d}%",
						seriesData: [
							{value: 0, name: "男"},
							{value: 0, name: "女"},
							{value: 0, name: "未知"}]
					},
				},
				max                         : 0,
				fansAttrAddSourceEChartsType: true,
				fansAttrAddSexEChartsType   : true,
				increaseCount               : '',
				per                         : '',
				// 客户属性表格
				fansTable3                  : {
					columns    : [
						{
							title    : "渠道",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "新增客户数",
							dataIndex: "count",
							key      : "count",
						},
						{
							title    : "客户占比",
							dataIndex: "per",
							key      : "per",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},
				changeWidthSmallFlag        : false,
				scrollOutFlag               : false,
				showModalDepartment         : false, //成员选择框显示与隐藏
			}
		},
		created () {

		},
		mounted () {
			this.initPage()
			this.getGroupList()
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
							}
						}
						that.getFansTop()
						this.get1(0)
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
				const {data: res} = await this.axios.post("work-contact-way-statistic/yesterday-statistic", {
					corp_id : this.wxId,
					suite_id: this.suite_id,
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
				this.showModalDepartment = true
				if (this.tabKey == 1) {
					this.chooseNumber = this.chooseNum1
				} else if (this.tabKey == 2) {
					this.chooseNumber = this.chooseNum2
				} else if (this.tabKey == 3) {
					this.chooseNumber = this.chooseNum3
				} else if (this.tabKey == 4) {
					this.chooseNumber = this.chooseNum4
				} else if (this.tabKey == 5) {
					this.chooseNumber = this.chooseNum5
				} else if (this.tabKey == 6) {
					this.chooseNumber = this.chooseNum6
				}
			},
			modalVisibleChange3 (event, arr, num) {
				if (event == "ok") {
					if (this.tabKey == 1) {
						this.staffValue1 = arr
						this.chooseNum1 = num
						this.get1(0)
					} else if (this.tabKey == 2) {
						this.staffValue2 = arr
						this.chooseNum2 = num
						this.get2(0)
					} else if (this.tabKey == 3) {
						this.staffValue3 = arr
						this.chooseNum3 = num
						this.get2(0)
					} else if (this.tabKey == 4) {
						this.staffValue4 = arr
						this.chooseNum4 = num
						this.get2(0)
					} else if (this.tabKey == 5) {
						this.staffValue5 = arr
						this.chooseNum5 = num
						this.get2(0)
					} else if (this.tabKey == 6) {
						this.staffValue6 = arr
						this.chooseNum6 = num
						this.get2(0)
					}
				}
				this.showModalDepartment = false
			},
			//重置
			clearDepartmentList () {
				if (this.tabKey == 1) {
					this.staffValue1 = []
					this.chooseNum1 = 0
					this.get1(0)
				} else if (this.tabKey == 2) {
					this.staffValue2 = []
					this.chooseNum2 = 0
					this.get2(0)
				} else if (this.tabKey == 3) {
					this.staffValue3 = []
					this.chooseNum3 = 0
					this.get2(0)
				} else if (this.tabKey == 4) {
					this.staffValue4 = []
					this.chooseNum4 = 0
					this.get2(0)
				}
			},

			//切换柱状图显示数据
			changeBarType (val) {
				if (val == 1) {
					this.fansAdd.name = '新增客户数'
				} else if (val == 2) {
					this.fansAdd.name = '被客户拉黑/删除人数'
				} else if (val == 3) {
					this.fansAdd.name = '删除人数'
				} else if (val == 4) {
					this.fansAdd.name = '净增人数'
				}
				this.fansAdd.data_Type = val
				this.get1(0)
			},
			changeSearchType () {
				this.get1(0)
			},
			// 活码TOP10
			async get1 (is_export, page = 1, pageSize = this.fansTable.pageSize) {
				this.spinning = true
				if (this.wxList.length == 0) {
					this.spinning = false
					return false
				}
				let s_date = ''
				let e_date = ''
				if (this.timeType == 1) {
					s_date = this.fansAddTime.ds_date
					e_date = this.fansAddTime.de_date
					this.dayDate = [moment(this.fansAddTime.ds_date), moment(this.fansAddTime.de_date)]
				} else if (this.timeType == 2) {
					s_date = this.fansAddTime.ws_date
					e_date = this.fansAddTime.we_date
				} else if (this.timeType == 3) {
					s_date = moment().startOf('month').format("YYYY-MM-DD")
					e_date = moment(new Date()).format('YYYY-MM-DD')
				}
				let that = this
				let params = {
					s_date     : s_date,
					e_date     : e_date,
					search_type: this.searchType,
					s_week     : this.fansAddTime.ws_week,
					type       : this.timeType,
					is_export  : is_export,
					corp_id    : this.wxId,
					suite_id   : this.suite_id,
					group_id   : this.selectGroupId.length == 0 ? '' : this.selectGroupId,
					data_type  : this.fansAdd.data_Type,
				}
				if (is_export == 0) {
					params['page'] = page
					params['pageSize'] = pageSize
				}
				const {data: res} = await this.axios.post("work-contact-way-statistic/top", params);
				if (res.error == 0) {
					if (is_export != 1) {
						if (page == 1) {
							that.fansAdd.seriesData = []
							if (res.data.seriesData && res.data.seriesData.length != 0) {
								that.fansAdd.seriesData = res.data.seriesData
								that.fansAdd.xAxisData = res.data.xData
							}
						}
						that.fansTable.list = res.data.wayData
						that.fansTable.total = res.data.count
						that.fansTable.page = page
						that.fansTable.pageSize = pageSize
					} else {
						window.open(res.data.url);
					}
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}
			},
			// 客户增长
			async get2 (is_export) {
				this.spinning = true
				if (this.wxList.length == 0) {
					this.spinning = false
					return false
				}
				let that = this
				let s_date = ''
				let e_date = ''
				let s_week = ''
				s_date = this.fansAddTime2.ds_date
				e_date = this.fansAddTime2.de_date
				this.dayDate2 = [moment(this.fansAddTime2.ds_date), moment(this.fansAddTime2.de_date)]
				if (this.timeType2 == 2) {
					s_date = this.fansAddTime2.ws_date
					e_date = this.fansAddTime2.we_date
				}
				s_week = this.fansAddTime2.ws_week
				let params = {
					s_date     : s_date,
					e_date     : e_date,
					s_week     : s_week,
					search_type: this.searchType2,
					group_id   : this.selectGroupId2,
					is_export  : is_export,
					suite_id   : this.suite_id,
					corp_id    : this.wxId,
					type       : this.timeType2,
				}
				const {data: res} = await this.axios.post("work-contact-way-statistic/increase", params);
				if (res.error == 0) {
					if (is_export != 1) {
						that.fansAdd2.legendData = res.data.legData
						that.fansAdd2.seriesData = res.data.seriesData
						that.fansAdd2.xAxisData = res.data.xData
						that.fansTableList2 = res.data.wayData
						let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
						that.fansTable2.total = that.fansTableList2.length
						that.fansTable2.list = table.list
						that.fansTable2.page = table.page
					} else {
						window.open(res.data.url);
					}
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}

			},
			// 客户属性
			async get3 (is_export) {
				this.spinning = true
				if (this.wxList.length == 0) {
					this.spinning = false
					return false
				}
				let params = {
					s_date   : this.fansAddTime3.ds_date,
					e_date   : this.fansAddTime3.de_date,
					group_id : this.selectGroupId3,
					is_export: is_export,
					suite_id : this.suite_id,
					corp_id  : this.wxId,
				}
				const {data: res} = await this.axios.post("work-contact-way-statistic/attribute", params);
				if (res.error == 0) {
					if (is_export != 1) {
						this.increaseCount = res.data.increaseCount
						this.per = res.data.per
						this.fansAdd3.line.legendData = res.data.legData2
						this.fansAdd3.line.seriesData = res.data.seriesData2
						this.fansAdd3.line.xAxisData = res.data.xData
						this.fansAdd3.pie.seriesData = res.data.pieData2
						this.fansAdd3.sexLine.legendData = res.data.legData1
						this.fansAdd3.sexLine.xAxisData = res.data.xData
						this.fansAdd3.sexLine.seriesData = res.data.seriesData1
						this.fansAdd3.sexPie.seriesData = res.data.pieData1
						this.fansTable3.list = res.data.sourceDetail
						this.spinning = false
					} else {
						this.spinning = false
						window.open(res.data.url);
					}

				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}

			},
			// 活码TOP10页码改变
			changeFansPage1 (val) {
				this.get1(0, val, this.fansTable.pageSize)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 800)
				})
			},
			// 活码TOP10表格分页pageSize改变
			showFansSizeChange1 (page, pageSize) {
				this.get1(0, 1, pageSize)
			},

			// 新增群页码改变
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
					document.getElementsByClassName('scroll')[0].scrollTo(0, 800)
				})
			},
			// 新增群表格分页pageSize改变
			showFansSizeChange2 (page, pageSize) {
				let that = this
				that.fansTable2.pageSize = pageSize
				let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
				that.fansTable2.list = table.list
				that.fansTable2.page = table.page
				if (this.fansTable2.list.length > 10) {
					this.wheelFlag2 = false
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

			// 活码TOP10时间类型切换
			changeFansTimeType1 (type) {
				if (this.timeType != type) {
					this.spinning = true
					this.timeType = type;
					this.get1(0)
				}

			},
			async getGroupList () {
				let params = {
					uid    : localStorage.getItem('uid'),
					corp_id: this.wxId
				}
				const {data: res} = await this.axios.post("work-contact-way/group", params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					this.groupList2 = JSON.parse(JSON.stringify(res.data.group))
					this.groupList.unshift({
						id          : "",
						key         : "",
						value       : "",
						title       : "所有分组",
						status      : 1,
						is_not_group: 0,
						scopedSlots : {
							title: "custom"
						},
						children    : []
					})

					this.selectGroupId = this.groupList[0].id
					this.selectGroupId3 = this.groupList[0].id
					if (this.groupList2.length > 0) {
						this.selectGroupId2 = this.groupList2[0].id
					}

				}
			},
			// 活码TOP10时间值
			changeFansTime1 (date, dateString) {
				this.spinning = true
				if (this.timeType == 1) {
					this.fansAddTime.ds_date = dateString[0]
					this.fansAddTime.de_date = dateString[1]
				}
				this.get1(0)
			},
			// 活码TOP10改变起始周
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
				this.get1(0)
			},
			// 活码TOP10改变结束周
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
				this.get1(0)
			},
			// 活码TOP10表格导出
			exportFansIncrease1 () {
				this.get1(1)
			},

			changeSearchType2 () {
				this.get2(0)
			},
			// 新增群时间类型切换
			changeFansTimeType2 (type) {
				if (this.timeType2 != type) {
					this.spinning = true
					this.timeType2 = type;
					this.get2(0)
				}

			},
			// 新增群时间值
			changeFansTime2 (date, dateString) {
				this.spinning = true
				if (this.timeType2 == 1) {
					this.fansAddTime2.ds_date = dateString[0]
					this.fansAddTime2.de_date = dateString[1]
				}
				this.get2(0)
			},
			//  新增群改变起始周
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
				this.get2(0)
			},
			//  新增群改变结束周
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
				this.get2(0)
			},
			//  新增群表格导出
			exportFansIncrease2 () {
				this.get2(1)
			},

			// 粉丝属性新增粉丝来源图切换
			changeFansAttrAddSourceEChartsType (flag) {
				if (this.fansAttrAddSourceEChartsType != flag) {
					this.fansAttrAddSourceEChartsType = flag
				}
			},
			// 粉丝属性新增粉丝性别图切换
			changeFansAttrAddSexEChartsType (flag) {
				if (this.fansAttrAddSexEChartsType != flag) {
					this.fansAttrAddSexEChartsType = flag
				}
			},
			//  客户增长时间值
			changeFansTime3 (date, dateString) {
				this.spinning = true
				if (this.timeType3 == 1) {
					this.fansAddTime3.ds_date = dateString[0]
					this.fansAddTime3.de_date = dateString[1]
				}
				this.get3(0)
			},
			// 客户增长表格导出
			exportFansIncrease3 () {
				this.get3(1)
			},
			// 切换企业微信
			changeStoreId (id) {
				this.spinning = true
				this.wxId = id;
				this.storeList.map((x) => {
					if (id == x.corpid) {
						this.$store.dispatch("changeCorp", x);
					}
				})
				this.getFansTop()
				if (this.tabKey == 1) {
					this.get1(0)
				} else if (this.tabKey == 2) {
					this.get2(0)
				} else if (this.tabKey == 3) {
					this.get2(0)
				} else if (this.tabKey == 4) {
					this.get2(0)
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
				if (key == 1) {
					this.get1(0)
				} else if (key == 2) {
					this.get2(0)
				} else if (key == 3) {
					this.get3(0)
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

	.home-left-contain {
		float: left;
		width: 100%;
		width: calc(100% - 12px);
		width: -moz-calc(100% - 12px);
		width: -webkit-calc(100% - 12px);
		background-color: #F8F8F8;
	}

	.spinning-true {
		width: 100%;
	}

	/*.spinning-false {*/
	/*	height: auto;*/
	/*}*/

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
		background: #F9F9F9;
	}

	.single-accout-card .single-accout-cardItem {
		width: 100%;
		height: 111px;
		padding: 20px 0px 20px 20px;
		background: #F9F9F9;
		border: 1px solid #E9E9E9;
		border-left: 0;
	}

	.single-accout-card .single-accout-cardItem:first-child {
		border: 1px solid #E9E9E9;
	}

	.single-accout-card .single-accout-cardItem span {
		font-size: 14px;
		color: #1A1A1A;
	}

	.single-accout-card .single-accout-cardItem p {
		font-family: DINAlternate-Bold;
		font-size: 20px;
		margin-bottom: 0px;
	}

	.single-accout-card .single-accout-cardItem span {
		font-size: 12px;
		color: #1A1A1A;
	}

	.single-account-contain .single-accout-card1 {
		width: 100%;
		background: #F9F9F9;
	}

	.single-accout-card1 .single-accout-cardItem {
		display: inline-block;
		width: 25%;
		height: 111px;
		padding: 20px 0px 20px 20px;
		background: #F9F9F9;
		border: 1px solid #E9E9E9;
		border-left: 0;
	}

	/*.single-accout-card1 .single-accout-cardItem:last-child {*/
	/*	display: inline-block;*/
	/*	width: 25%;*/
	/*	height: 111px;*/
	/*	padding: 20px 0px 20px 20px;*/
	/*	background: #F9F9F9;*/
	/*	border: 1px solid #E9E9E9;*/
	/*	border-left: 0;*/
	/*}*/
	.single-accout-card1 .single-accout-cardItem:first-child {
		border: 1px solid #E9E9E9;
	}

	.single-accout-card1 .single-accout-cardItem span {
		font-size: 14px;
		color: #1A1A1A;
	}

	.single-accout-card1 .single-accout-cardItem p {
		font-family: DINAlternate-Bold;
		font-size: 20px;
		margin-bottom: 0px;
	}

	.single-accout-card1 .single-accout-cardItem span {
		font-size: 12px;
		color: #1A1A1A;
	}

	.single-accout-cardItem img {
		margin: 0px 5px 3px;
		width: 9px;
	}

	.single-account-contain .card-filter-contain {
		margin-top: 24px;
	}

	.fansgrow-contain .card-caledar {
		line-height: 50px;
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
		boder: 0;
		border-right: 1px solid #3B74FF;
		background: #3B74FF;
		border-radius: 0;
		color: #FFF;
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
		color: #1890FF;
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

	.sec-card-caledar {
		height: auto;
		padding: 16px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		background: #F7F7F7;
		border: 1px solid #E9E9E9;
	}

	.sec-card-caledar.down-text {
		background: #FFFFFF;
		border: 1px solid #E9E9E9;
		border-bottom: 0;
	}

	.sec-card-caledar.down-text p {
		color: #1A1A1A !important;
	}

	.fans-type {
		margin-bottom: 20px;
	}

	.fans-type button, .loyalty-btn {
		padding: 3px 6px;
		background-color: #FFF;
		border: 1px solid #D8D8D8;
		cursor: pointer;
		outline: none;
	}

	.fans-type-selected {
		padding: 3px 6px;
		border: 1px solid #3B74FF !important;
		color: #3B74FF;
		cursor: pointer;
		outline: none;
	}

	.newfans-sexy {
		margin-top: 24px;
		border: 1px solid #E9E9E9;
		padding: 24px;
	}
</style>
