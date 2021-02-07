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
								     v-for="(item, index) in storeIndicatorsData" v-if="index < 4">
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
							<div class="single-accout-card1">
								<div class="single-accout-cardItem account-type"
								     v-for="(item, index) in storeIndicatorsData" v-if="index >= 4">
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
										<span v-if="item.status != 0">比前日</span>
										<span v-if="item.status == 0">与前日持平</span>
										<img v-if="item.status == 2"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='item.status == 1'
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
									<a-tab-pane tab="群TOP10" key="1">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 200px;margin-left: 10px;"
															placeholder='所有群'
															@change="changeSearchType"
															v-model="searchType"
													>
														<template>
															<a-select-option :value="1">
																所有群
															</a-select-option>
															<a-select-option :value="2">
																分组
															</a-select-option>
															<a-select-option :value="3">
																群主
															</a-select-option>
														</template>
													</a-select>
													<a-select
															v-if="searchType == 2"
															showSearch
															optionFilterProp="children"
															style="width: 200px;margin-left: 10px;"
															placeholder='所有分组'
															@change="getFansIncrease(0)"
															v-model="selectGroupId"
													>
														<template>
															<a-select-option v-for="item in groupList" :value="item.id">
																{{item.group_name}}
															</a-select-option>
														</template>
													</a-select>
													<div v-if="searchType == 3"
													     class="month-picker-contain picker-contain">
														<a-button style="margin-right: 5px;"
														          @click="showDepartmentList">
															<span v-if="chooseNum1 == 0">选择群主</span>
															<span v-else>已选择{{chooseUserNum1}}名群主，{{chooseDepartmentNum1}}个部门</span>
														</a-button>
													</div>
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
																v-model='dayDate'
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
												</div>
											</div>
											<div class="fans-data-trend">
												<div style="text-align: center;">
													<span style="cursor: pointer;" @click="changeBarType(1)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 1 ? '#3398DB' : '#CCC' }"></span>
														新增群成员数</span>
													<span style="cursor: pointer;" @click="changeBarType(3)"
													      v-if="searchType == 3">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 3 ? '#FFC71B' : '#CCC' }"></span>
														群聊天消息总数</span>
													<span style="cursor: pointer;" @click="changeBarType(2)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 2 ? '#AD85F4' : '#CCC' }"></span>
														退群人数</span>
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
															:columns="searchType == 1 ? fansTable.columns : (searchType == 2 ? fansTable.columns : fansTable.columns2)"
															:dataSource="fansTable.list"
															:rowClassName="rowClassName"
															:pagination="false">
														<span slot="all_num">
															<span v-if="fansAdd.data_Type == 1">新增群成员数</span>
															<span v-if="fansAdd.data_Type == 4">群成员总数</span>
															<span v-if="fansAdd.data_Type == 3">群聊天消息总数</span>
															<span v-if="fansAdd.data_Type == 2">退群人数</span>
										                </span>
														<span slot="name" slot-scope="text, record">
															<span v-if="record.name != ''">{{record.name}}</span>
															<span v-else>--</span>
														</span>
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
									<a-tab-pane tab="群聊" key="2">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div
															class="day-picker-contain picker-contain">
														<div
																class="month-picker-contain picker-contain">
															<a-button style="margin-right: 5px"
															          @click="showDepartmentList">
																<span v-if="chooseNum2 == 0">选择成员</span>
																<span v-else>已选择{{chooseUserNum2}}名成员，{{chooseDepartmentNum2}}个部门</span>
															</a-button>
														</div>
														<a-button v-if="chooseNum2 != 0" style="margin-right: 5px"
														          @click="clearDepartmentList">
															重置
														</a-button>
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
																v-model='dayDate2'
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
												</div>
											</div>
											<div class="fans-data-trend">
												<div style="text-align: center;">
													<span style="cursor: pointer;" @click="changeLineType(1)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': groupIndex == 1 ? '#3398DB' : '#CCC' }"></span>
														群聊总数</span>
													<span style="cursor: pointer;" @click="changeLineType(2)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': groupIndex == 2 ? '#3398DB' : '#CCC' }"></span>
														新增群聊数</span>
													<span style="cursor: pointer;" @click="changeLineType(3)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': groupIndex == 3? '#3398DB' : '#CCC' }"></span>
														有过消息的群聊数</span>
												</div>
												<LineCharts v-if="tabKey == 2"
												            :options="groupIndex == 1 ? fansAdd2 : (groupIndex == 2 ? fansAdd2b : fansAdd2c)"
												            style="width:100%;"
												>
												</LineCharts>
												<!--												<LineCharts v-if="tabKey == 2 && groupIndex==2"-->
												<!--												            :options="fansAdd2b" style="width:100%;"-->
												<!--												>-->
												<!--												</LineCharts>-->
												<!--												<LineCharts v-if="tabKey == 2 && groupIndex==3"-->
												<!--												            :options="fansAdd2c" style="width:100%;"-->
												<!--												>-->
												<!--												</LineCharts>-->
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
													<a-table v-if="groupIndex==1" :columns="fansTable2.columns"
													         :dataSource="fansTable2.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<a-table v-if="groupIndex==2" :columns="fansTable2b.columns"
													         :dataSource="fansTable2b.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<a-table v-if="groupIndex==3" :columns="fansTable2c.columns"
													         :dataSource="fansTable2c.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<div v-if="groupIndex==1" style="width: 100%;"
													     v-show="fansTable2.total > 0">
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
													<div v-if="groupIndex==2" style="width: 100%;"
													     v-show="fansTable2b.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable2b.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable2b.total" showSizeChanger
															              :showQuickJumper="fansTable2b.quickJumper"
															              :current="fansTable2b.page"
															              :pageSize="fansTable2b.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage2"
															              @showSizeChange="showFansSizeChange2"/>
														</div>
													</div>
													<div v-if="groupIndex==3" style="width: 100%;"
													     v-show="fansTable2c.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable2c.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable2c.total" showSizeChanger
															              :showQuickJumper="fansTable2c.quickJumper"
															              :current="fansTable2c.page"
															              :pageSize="fansTable2c.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage2"
															              @showSizeChange="showFansSizeChange2"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="群成员" key="3">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div
															class="month-picker-contain picker-contain">
														<a-button style="margin-right: 5px;"
														          @click="showDepartmentList">
															<span v-if="chooseNum3 == 0">选择成员</span>
															<span v-else>已选择{{chooseUserNum3}}名成员，{{chooseDepartmentNum3}}个部门</span>
														</a-button>
													</div>
													<a-button v-if="chooseNum3 != 0" style="margin:0 5px"
													          @click="clearDepartmentList">
														重置
													</a-button>
													<div
															class="day-picker-contain picker-contain">
														<a-button :class="timeType3== '1'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType3(1)">
															按日
														</a-button>
														<a-range-picker
																style="width: 270px;"
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType3=='1'"
																v-model='dayDate3'
																@change="changeFansTime3"
														/>
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType3== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType3(2)">
															按周
														</a-button>
														<a-week-picker
																:allowClear='false'
																:value='weekStart3'
																:disabledDate="disabledDateWeek"
																v-if="timeType3=='2'"
																@change="changeFansStartWeek3"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd3'
																:disabledDate="disabledDateWeek"
																v-if="timeType3=='2'"
																@change="changeFansEndWeek3"
														/>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType3== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType3(3)">
															按月
														</a-button>
													</div>
												</div>
											</div>

											<div class="fans-data-trend">
												<div style="text-align: center;">
													<span style="cursor: pointer;" @click="changeLineType2(4)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': groupIndex2 == 4 ? '#3398DB' : '#CCC' }"></span>
														群成员总数</span>
													<span style="cursor: pointer;" @click="changeLineType2(5)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': groupIndex2 == 5 ? '#3398DB' : '#CCC' }"></span>
														新增群成员数</span>
													<span style="cursor: pointer;" @click="changeLineType2(6)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': groupIndex2 == 6 ? '#3398DB' : '#CCC' }"></span>
														发过消息的群成员数</span>
													<span style="cursor: pointer;" @click="changeLineType2(8)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': groupIndex2 == 8 ? '#3398DB' : '#CCC' }"></span>
														退群人数</span>
												</div>
												<LineCharts v-if="tabKey == 3 && groupIndex2==4"
												            :options="fansAdd3" style="width:100%;"
												>
												</LineCharts>
												<LineCharts v-if="tabKey == 3 && groupIndex2==5"
												            :options="fansAdd3b" style="width:100%;"
												>
												</LineCharts>
												<LineCharts v-if="tabKey == 3 && groupIndex2==6"
												            :options="fansAdd3c" style="width:100%;"
												>
												</LineCharts>
												<LineCharts v-if="tabKey == 3 && groupIndex2==8"
												            :options="fansAdd3d" style="width:100%;"
												>
												</LineCharts>
											</div>
											<div class="fans-data-detail">
												<div class="title-contain">
													<p>详细数据</p>
													<a-button @click="exportFansIncrease3" type="primary"
													          icon="download">
														导出数据
													</a-button>
												</div>
												<div v-if="groupIndex2==4" class="content-bd">
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
												<div v-if="groupIndex2==5" class="content-bd">
													<a-table :columns="fansTable3b.columns"
													         :dataSource="fansTable3b.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<div style="width: 100%;" v-show="fansTable3b.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable3b.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable3b.total" showSizeChanger
															              :showQuickJumper="fansTable3b.quickJumper"
															              :current="fansTable3b.page"
															              :pageSize="fansTable3b.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage3"
															              @showSizeChange="showFansSizeChange3"/>
														</div>
													</div>
												</div>
												<div v-if="groupIndex2==6" class="content-bd">
													<a-table :columns="fansTable3c.columns"
													         :dataSource="fansTable3c.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<div style="width: 100%;" v-show="fansTable3c.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable3c.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable3c.total" showSizeChanger
															              :showQuickJumper="fansTable3c.quickJumper"
															              :current="fansTable3c.page"
															              :pageSize="fansTable3c.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage3"
															              @showSizeChange="showFansSizeChange3"/>
														</div>
													</div>
												</div>
												<div v-if="groupIndex2==8" class="content-bd">
													<a-table :columns="fansTable3d.columns"
													         :dataSource="fansTable3d.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<div style="width: 100%;" v-show="fansTable3d.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable3d.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable3d.total" showSizeChanger
															              :showQuickJumper="fansTable3d.quickJumper"
															              :current="fansTable3d.page"
															              :pageSize="fansTable3d.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage3"
															              @showSizeChange="showFansSizeChange3"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="群消息" key="4">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div
															class="month-picker-contain picker-contain">
														<a-button
																@click="showDepartmentList">
															<span v-if="chooseNum4 == 0">选择成员</span>
															<span v-else>已选择{{chooseUserNum4}}名成员，{{chooseDepartmentNum4}}个部门</span>
														</a-button>
													</div>
													<a-button v-if="chooseNum4 != 0" style="margin-left: 10px"
													          @click="clearDepartmentList">
														重置
													</a-button>
													<div style="margin-left: 5px;"
													     class="day-picker-contain picker-contain">
														<a-button :class="timeType4== '1'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType4(1)">
															按日
														</a-button>
														<a-range-picker
																style="width: 270px;"
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType4=='1'"
																v-model='dayDate4'
																@change="changeFansTime4"
														/>
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType4== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType4(2)">
															按周
														</a-button>
														<a-week-picker
																:allowClear='false'
																:value='weekStart4'
																:disabledDate="disabledDateWeek"
																v-if="timeType4=='2'"
																@change="changeFansStartWeek4"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd4'
																:disabledDate="disabledDateWeek"
																v-if="timeType4=='2'"
																@change="changeFansEndWeek4"
														/>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType4== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType4(3)">
															按月
														</a-button>
													</div>
												</div>
											</div>
											<div class="fans-data-trend">
												<div style="text-align: center;">
													<span style="cursor: pointer;" @click="changeLineType3(7)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': groupIndex3 == 7 ? '#3398DB' : '#CCC' }"></span>
														群聊消息总数</span>
												</div>
												<LineCharts v-if="tabKey == 4 && groupIndex3==7"
												            :options="fansAdd4" style="width:100%;"
												>
												</LineCharts>
											</div>
											<div class="fans-data-detail">
												<div class="title-contain">
													<p>详细数据</p>
													<a-button @click="exportFansIncrease4" type="primary"
													          icon="download">
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
	import corpAuthorize from "@/components/CorpAuthorize.vue"
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
				chooseNumber        : 0,//整合后传给组件的值
				corpId              : corpId,//企业微信选中的id
				// 滚动条 ↓
				showWxModal         : false,
				spinning            : false,
				mouseEnterFlag      : false,
				scrollFlag          : true,
				scroRight           : true,
				//滚动条 ↑
				// 总指标总览
				totalIndicatorsData : {},
				// 店铺指标总览数据
				storeIndicatorsData : [
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 1, per: "80.0%"},
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 0, per: "100.0%"},
					{status: 0, count: 0, per: "100.0%"}
				],
				// 展示公众号id
				wxId                : "",
				tabKey              : 1,
				// 微信号左右换页
				wxPage              : 1,
				wxPageSize          : 5,
				wxMaxPage           : 0,
				wxList              : [], // 微信列表
				// 企业微信列表
				storeList           : [],
				timeSum             : 0,
				/* 内容TOP10 */
				wheelFlag           : true,
				fansAddTime         : {
					ds_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate             : [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
				weekStart           : moment().subtract(7, 'days'),
				weekEnd             : moment().subtract(7, 'days'),
				s_week              : '',
				searchType          : 1,
				selectGroupId       : 0,
				groupList           : [],
				fileType            : 0,
				timeType            : 1,  //内容TOP10tab时间类型选择
				// 内容TOP10折线图
				fansAdd             : {
					title     : '群TOP10',
					xAxisData : [],
					data_Type : 1,
					name      : '新增群成员数',
					seriesData: [
						{
							data  : [],
							name  : "群TOP10",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue1         : [],//内容TOP10-选择的成员id数组
				chooseNum1          : 0,//内容TOP10-已选择的内容数量
				chooseUserNum1      : 0,//成员个数
				chooseDepartmentNum1: 0,//部门个数
				// 内容TOP10表格
				fansTableList       : [],
				fansTable           : {
					columns1   : [
						{
							title    : "排行",
							dataIndex: "sort",
							key      : "sort",
						},
						{
							title    : "群分组",
							dataIndex: "group_name",
							key      : "group_name",
						},
						{
							slots    : {title: "all_num"},
							dataIndex: "all_num",
							key      : "all_num",
						}
					],
					columns2   : [
						{
							title    : "排行",
							dataIndex: "sort",
							key      : "sort",
						},
						{
							title    : "群主名称",
							dataIndex: "name",
							key      : "name",
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
							title      : "群名称",
							dataIndex  : "name",
							key        : "name",
							scopedSlots: {customRender: "name"}
						},
						{
							title    : "分组名称",
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
				/* 群聊折线图区域 */
				wheelFlag2          : true,
				groupIndex          : 1,
				fansAddTime2        : {
					ds_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate2            : [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
				weekStart2          : moment().subtract(7, 'days'),
				weekEnd2            : moment().subtract(7, 'days'),
				s_week2             : '',
				fileType2           : 0,
				name2               : '',
				timeType2           : 1,  //群聊tab时间类型选择
				// 群聊tab下折线图
				fansAdd2            : {
					title     : '群聊总数',
					groupIndex: 1,
					legendData: ["群聊总数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "群聊总数",
							smooth: true,
							type  : "line"
						}
					]
				}, fansAdd2b        : {
					title     : '新增群聊数',
					groupIndex: 2,
					legendData: ["新增群聊数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "新增群聊数",
							smooth: true,
							type  : "line",
						}
					]
				}, fansAdd2c        : {
					groupIndex: 3,
					title     : '有过消息的群聊数',
					legendData: ["有过消息的群聊数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "有过消息的群聊数",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue2         : [],//新增群成员数-选择的内容id数组
				chooseNum2          : 0,//新增群成员数-已选择的内容数量
				chooseUserNum2      : 0,//成员个数
				chooseDepartmentNum2: 0,//部门个数
				// 群聊表格
				fansTableList2      : [],
				fansTable2          : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "群聊总数",
							dataIndex: "add_num",
							key      : "add_num",
						},

					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},
				fansTable2b         : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "新增群聊数",
							dataIndex: "add_num",
							key      : "add_num",
						},
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},
				fansTable2c         : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "有过消息的群聊数",
							dataIndex: "add_num",
							key      : "add_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 群成员tab */
				groupIndex2         : 4,
				wheelFlag3          : true,
				fansAddTime3        : {
					ds_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate3            : [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
				weekStart3          : moment().subtract(7, 'days'),
				weekEnd3            : moment().subtract(7, 'days'),
				s_week3             : '',
				timeType3           : 1,  //群成员tab时间类型选择
				name3               : '',
				selectGroupId3      : [],
				fileType3           : 0,
				//群成员tab下折线图
				fansAdd3            : {
					title     : '群成员总数',
					legendData: ["群成员总数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "群成员总数",
							smooth: true,
							type  : "line"
						},
					]
				}, fansAdd3b        : {
					title     : '新增群成员数',
					legendData: ["新增群成员数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "新增群成员数",
							smooth: true,
							type  : "line"
						},
					]
				}, fansAdd3c        : {
					title     : '发过消息的群成员数',
					legendData: ["发过消息的群成员数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "发过消息的群成员数",
							smooth: true,
							type  : "line"
						},
					]
				}, fansAdd3d        : {
					title     : '退群人数',
					legendData: ["退群人数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "退群人数",
							smooth: true,
							type  : "line"
						},
					]
				},
				staffValue3         : [],//新增群成员数-选择的内容id数组
				chooseNum3          : 0,//新增群成员数-已选择的内容数量
				chooseUserNum3      : 0,//成员个数
				chooseDepartmentNum3: 0,//部门个数
				// 新增群成员数表格
				fansTableList3      : [],
				fansTable3          : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "群成员总数",
							dataIndex: "add_num",
							key      : "add_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				}, fansTable3b      : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "新增群成员数",
							dataIndex: "add_num",
							key      : "add_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				}, fansTable3c      : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "有过消息的群成员数",
							dataIndex: "add_num",
							key      : "add_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				}, fansTable3d      : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "退群人数",
							dataIndex: "add_num",
							key      : "add_num",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 群消息 */
				wheelFlag4          : true,
				groupIndex3         : 7,
				fansAddTime4        : {
					ds_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate4            : [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
				weekStart4          : moment().subtract(7, 'days'),
				weekEnd4            : moment().subtract(7, 'days'),
				s_week4             : '',
				timeType4           : 1,  //群聊天消息总数tab时间类型选择
				name4               : '',
				searchType4         : 3,
				selectGroupId4      : [],
				fileType4           : 0,
// 群聊天消息总数折线图
				fansAdd4            : {
					title     : '群聊消息总数',
					legendData: ["群聊消息总数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "群聊消息总数",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue4         : [],//群聊天消息总数-选择的内容id数组
				chooseNum4          : 0,//群聊天消息总数-已选择的内容数量
				chooseUserNum4      : 0,//成员个数
				chooseDepartmentNum4: 0,//部门个数
				// 群聊天消息总数表格
				fansTableList4      : [],
				fansTable4          : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							title    : "群聊消息总数",
							dataIndex: "add_num",
							key      : "add_num",
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
				checkedList1        : [],
				checkedList2        : [],
				checkedList3        : [],
				checkedList4        : [],
			}
		},
		created () {

		},
		mounted () {
			this.initPage()
			this.getGroupList()
		},
		methods   : {
			// 切换群聊tab下折线图显示数据
			changeLineType (val) {
				if (val != this.groupIndex) {
					this.groupIndex = val
				}
				this.fansTable2.page = 1
				this.get2()
			},
			// 切换群成员tab下折线图显示数据
			changeLineType2 (val) {
				if (val != this.groupIndex2) {
					this.groupIndex2 = val
				}
				this.fansTable3.page = 1
				this.get2()
			},
			// 切换群成员tab下折线图显示数据
			changeLineType3 (val) {
				if (val != this.groupIndex3) {
					this.groupIndex3 = val
				}
				this.get2()
			},

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
				that.spinning = true
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
						this.getFansIncrease(0)
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
				that.spinning = true
				const {data: res} = await this.axios.post("work-chat/chat-statistic-yesterday", {
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
				if (this.tabKey == 1) {
					this.chooseNumber = this.chooseNum1
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.staffValue1))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList1))
				} else if (this.tabKey == 2) {
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
					if (this.tabKey == 1) {
						this.staffValue1 = arr
						this.chooseNum1 = parseInt(userNum) + parseInt(departmentNum)
						this.checkedList1 = list
						this.chooseUserNum1 = userNum
						this.chooseDepartmentNum1 = departmentNum
						this.getFansIncrease(0)
					} else if (this.tabKey == 2) {
						this.staffValue2 = arr
						this.chooseNum2 = parseInt(userNum) + parseInt(departmentNum)
						this.checkedList2 = list
						this.chooseUserNum2 = userNum
						this.chooseDepartmentNum2 = departmentNum
						this.get2(0)
					} else if (this.tabKey == 3) {
						this.staffValue3 = arr
						this.chooseNum3 = parseInt(userNum) + parseInt(departmentNum)
						this.checkedList3 = list
						this.chooseUserNum3 = userNum
						this.chooseDepartmentNum3 = departmentNum
						this.get2(0)
					} else if (this.tabKey == 4) {
						this.staffValue4 = arr
						this.chooseNum4 = parseInt(userNum) + parseInt(departmentNum)
						this.checkedList4 = list
						this.chooseUserNum4 = userNum
						this.chooseDepartmentNum4 = departmentNum
						this.get2(0)
					}
				}
				this.showModalDepartment = false
			},
			//重置
			clearDepartmentList () {
				if (this.tabKey == 1) {
					this.staffValue1 = []
					this.checkedList1 = []
					this.chooseNum1 = 0
					this.chooseUserNum1 = 0
					this.chooseDepartmentNum1 = 0
					this.getFansIncrease(0)
				} else if (this.tabKey == 2) {
					this.staffValue2 = []
					this.checkedList1 = []
					this.chooseNum2 = 0
					this.chooseUserNum2 = 0
					this.chooseDepartmentNum2 = 0
					this.get2(0)
				} else if (this.tabKey == 3) {
					this.staffValue3 = []
					this.checkedList3 = []
					this.chooseNum3 = 0
					this.chooseUserNum3 = 0
					this.chooseDepartmentNum3 = 0
					this.get2(0)
				} else if (this.tabKey == 4) {
					this.staffValue4 = []
					this.checkedList4 = []
					this.chooseNum4 = 0
					this.chooseUserNum4 = 0
					this.chooseDepartmentNum4 = 0
					this.get2(0)
				}
			},


			//切换柱状图显示数据
			changeBarType (val) {
				if (val == 1) {
					this.fansAdd.name = '新增群成员数'
				} else if (val == 2) {
					this.fansAdd.name = '退群人数'
				} else if (val == 3) {
					this.fansAdd.name = '群聊天消息总数'
				}
				this.fansAdd.data_Type = val
				this.getFansIncrease(0)
			},
			changeSearchType () {
				if (this.searchType != 3) {
					if (this.fansAdd.data_Type == 3) {
						this.fansAdd.data_Type = 1
						this.fansAdd.name = '新增群成员数'
					}
					this.getFansIncrease(0)
				} else {
					this.getFansIncrease(0)
				}
			},
			// 内容TOP10
			async getFansIncrease (is_export) {
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
					group_id   : this.selectGroupId.length == 0 ? '' : this.selectGroupId,
					user_ids   : this.staffValue1,
					data_type  : this.fansAdd.data_Type,
				}
				const {data: res} = await this.axios.post("work-chat/chat-statistic-top", params);
				if (res.error == 0) {
					if (is_export != 1) {
						this.timeSum = res.data.timeSum
						that.fansAdd.seriesData = []
						if (res.data.seriesData && res.data.seriesData.length != 0) {
							that.fansAdd.seriesData = res.data.seriesData
						}
						that.fansAdd.xAxisData = res.data.xData
						that.fansTableList = res.data.chatData
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
			// 内容TOP10页码改变
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
					document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
				})
			},
			// 内容TOP10表格分页pageSize改变
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

			// 群聊、群成员、群消息tab下请求方法
			async get2 (is_export) {
				this.spinning = true
				if (this.wxList.length == 0) {
					this.spinning = false
					return false
				}
				let that = this
				let user_ids = []
				let s_date = ''
				let e_date = ''
				let s_week = ''
				let timeType = ''
				let tabKey = 1
				// let searchType = 0
				if (this.tabKey == 2) {
					tabKey = this.groupIndex
					s_date = this.fansAddTime2.ds_date
					e_date = this.fansAddTime2.de_date
					this.dayDate = [moment(this.fansAddTime.ds_date), moment(this.fansAddTime.de_date)]
					if (this.timeType2 == 2) {
						s_date = this.fansAddTime2.ws_date
						e_date = this.fansAddTime2.we_date
					}
					timeType = this.timeType2
					s_week = this.fansAddTime2.ws_week
					user_ids = this.staffValue2
				} else if (this.tabKey == 3) {
					tabKey = this.groupIndex2
					s_date = this.fansAddTime3.ds_date
					e_date = this.fansAddTime3.de_date
					this.dayDate3 = [moment(this.fansAddTime3.ds_date), moment(this.fansAddTime3.de_date)]
					if (this.timeType3 == 2) {
						s_date = this.fansAddTime3.ws_date
						e_date = this.fansAddTime3.we_date
					}
					timeType = this.timeType3
					s_week = this.fansAddTime3.ws_week
					user_ids = this.staffValue3
				} else if (this.tabKey == 4) {
					tabKey = this.groupIndex3
					s_date = this.fansAddTime4.ds_date
					e_date = this.fansAddTime4.de_date
					this.dayDate4 = [moment(this.fansAddTime4.ds_date), moment(this.fansAddTime4.de_date)]
					if (this.timeType4 == 2) {
						s_date = this.fansAddTime4.ws_date
						e_date = this.fansAddTime4.we_date
					}
					timeType = this.timeType4
					s_week = this.fansAddTime4.ws_week
					user_ids = this.staffValue4
				}
				let params = {
					s_date   : s_date,
					e_date   : e_date,
					s_week   : s_week,
					data_type: tabKey,
					is_export: is_export,
					corp_id  : this.wxId,
					type     : timeType,
					user_ids : user_ids,
					is_pc    : 1
				}
				const {data: res} = await this.axios.post("wap-user-desktop/work-user-chat-statistic", params);
				if (res.error == 0) {
					if (is_export != 1) {
						this.timeSum = res.data.timeSum
						if (this.tabKey == 2) {
							switch (this.groupIndex) {
								case 1:
									// that.fansAdd2.legendData = res.data.legData
									that.fansAdd2.seriesData = res.data.seriesData
									that.fansAdd2.xAxisData = res.data.xData
									that.fansTableList2 = res.data.chatData
									let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
									that.fansTable2.total = that.fansTableList2.length
									that.fansTable2.list = table.list
									that.fansTable2.page = table.page
									break;
								case 2:
									// that.fansAdd2b.legendData = res.data.legData
									that.fansAdd2b.seriesData = res.data.seriesData
									that.fansAdd2b.xAxisData = res.data.xData
									that.fansTableList2 = res.data.chatData
									let table2 = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
									that.fansTable2b.total = that.fansTableList2.length
									that.fansTable2b.list = table2.list
									that.fansTable2b.page = table2.page
									break;
								case 3:
									// that.fansAdd2c.legendData = res.data.legData
									that.fansAdd2c.seriesData = res.data.seriesData
									that.fansAdd2c.xAxisData = res.data.xData
									that.fansTableList2 = res.data.chatData
									let table3 = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
									that.fansTable2c.total = that.fansTableList2.length
									that.fansTable2c.list = table3.list
									that.fansTable2c.page = table3.page
									break;
							}

						} else if (this.tabKey == 3) {
							switch (this.groupIndex2) {
								case 4:
									// that.fansAdd3.legendData = res.data.legData
									that.fansAdd3.seriesData = res.data.seriesData
									that.fansAdd3.xAxisData = res.data.xData
									that.fansTableList3 = res.data.chatData
									let table = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
									that.fansTable3.total = that.fansTableList3.length
									that.fansTable3.list = table.list
									that.fansTable3.page = table.page
									break;
								case 5:
									// that.fansAdd3b.legendData = res.data.legData
									that.fansAdd3b.seriesData = res.data.seriesData
									that.fansAdd3b.xAxisData = res.data.xData
									that.fansTableList3 = res.data.chatData
									let table2 = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
									that.fansTable3b.total = that.fansTableList3.length
									that.fansTable3b.list = table2.list
									that.fansTable3b.page = table2.page
									break;
								case 6:
									// that.fansAdd3c.legendData = res.data.legData
									that.fansAdd3c.seriesData = res.data.seriesData
									that.fansAdd3c.xAxisData = res.data.xData
									that.fansTableList3 = res.data.chatData
									let table3 = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
									that.fansTable3c.total = that.fansTableList3.length
									that.fansTable3c.list = table3.list
									that.fansTable3c.page = table3.page
									break;
								case 8:
									// that.fansAdd3d.legendData = res.data.legData
									that.fansAdd3d.seriesData = res.data.seriesData
									that.fansAdd3d.xAxisData = res.data.xData
									that.fansTableList3 = res.data.chatData
									let table4 = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
									that.fansTable3d.total = that.fansTableList3.length
									that.fansTable3d.list = table4.list
									that.fansTable3d.page = table4.page
									break;
							}
						} else if (this.tabKey == 4) {
							this.groupIndex3 = 7
							// that.fansAdd4.legendData = res.data.legData
							that.fansAdd4.seriesData = res.data.seriesData
							that.fansAdd4.xAxisData = res.data.xData
							that.fansTableList4 = res.data.chatData
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

			// 新增群页码改变
			changeFansPage2 (val) {
				switch (this.groupIndex) {
					case 1:
						let that = this
						that.fansTable2.page = val
						let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
						that.fansTable2.list = table.list
						that.fansTable2.page = table.page
						if (this.fansTable2.list.length > 10) {
							this.wheelFlag2 = false
						}
						this.$nextTick(() => {
							document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
						})
						break;
					case 2:
						let thatb = this
						thatb.fansTable2b.page = val
						let tableb = thatb.getPageData(thatb.fansTableList2, thatb.fansTable2b.page, thatb.fansTable2b.pageSize)
						thatb.fansTable2b.list = tableb.list
						thatb.fansTable2b.page = tableb.page
						if (this.fansTable2b.list.length > 10) {
							this.wheelFlag2 = false
						}
						this.$nextTick(() => {
							document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
						})
						break;
					case 3:
						let thatc = this
						thatc.fansTable2c.page = val
						let tablec = thatc.getPageData(thatc.fansTableList2, thatc.fansTable2c.page, thatc.fansTable2c.pageSize)
						thatc.fansTable2c.list = tablec.list
						thatc.fansTable2c.page = tablec.page
						if (this.fansTable2c.list.length > 10) {
							this.wheelFlag2 = false
						}
						this.$nextTick(() => {
							document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
						})
						break;
				}

			},
			// 新增群表格分页pageSize改变
			showFansSizeChange2 (page, pageSize) {
				switch (this.groupIndex) {
					case 1:
						let that = this
						that.fansTable2.pageSize = pageSize
						let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
						that.fansTable2.list = table.list
						that.fansTable2.page = table.page
						if (this.fansTable2.list.length > 10) {
							this.wheelFlag2 = false
						}
						break;
					case 2:
						let thatb = this
						thatb.fansTable2b.pageSize = pageSize
						let tableb = thatb.getPageData(thatb.fansTableList2, thatb.fansTable2b.page, thatb.fansTable2b.pageSize)
						thatb.fansTable2b.list = tableb.list
						thatb.fansTable2b.page = tableb.page
						if (this.fansTable2b.list.length > 10) {
							this.wheelFlag2 = false
						}
						break;
					case 3:
						let thatc = this
						thatc.fansTable2c.pageSize = pageSize
						let tablec = thatc.getPageData(thatc.fansTableList2, thatc.fansTable2c.page, thatc.fansTable2c.pageSize)
						thatc.fansTable2c.list = tablec.list
						thatc.fansTable2c.page = tablec.page
						if (this.fansTable2c.list.length > 10) {
							this.wheelFlag2 = false
						}
						break;
				}

			},

			// 新增群成员数页码改变
			changeFansPage3 (val) {
				switch (this.groupIndex2) {
					case 4:
						let that = this
						that.fansTable3.page = val
						let table = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
						that.fansTable3.list = table.list
						that.fansTable3.page = table.page
						if (this.fansTable3.list.length > 10) {
							this.wheelFlag3 = false
						}
						this.$nextTick(() => {
							document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
						})
						break;
					case 5:
						let thatb = this
						thatb.fansTable3b.page = val
						let tableb = thatb.getPageData(thatb.fansTableList3, thatb.fansTable3b.page, thatb.fansTable3b.pageSize)
						thatb.fansTable3b.list = tableb.list
						thatb.fansTable3b.page = tableb.page
						if (this.fansTable3b.list.length > 10) {
							this.wheelFlag3 = false
						}
						this.$nextTick(() => {
							document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
						})
						break;
					case 6:
						let thatc = this
						thatc.fansTable3c.page = val
						let tablec = thatc.getPageData(thatc.fansTableList3, thatc.fansTable3c.page, thatc.fansTable3c.pageSize)
						thatc.fansTable3c.list = tablec.list
						thatc.fansTable3c.page = tablec.page
						if (this.fansTable3c.list.length > 10) {
							this.wheelFlag3 = false
						}
						this.$nextTick(() => {
							document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
						})
						break;
					case 8:
						let thatd = this
						thatd.fansTable3d.page = val
						let tabled = thatd.getPageData(thatd.fansTableList3, thatd.fansTable3d.page, thatd.fansTable3d.pageSize)
						thatd.fansTable3d.list = tabled.list
						thatd.fansTable3d.page = tabled.page
						if (this.fansTable3d.list.length > 10) {
							this.wheelFlag3 = false
						}
						this.$nextTick(() => {
							document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
						})
						break;

				}

			},
			// 新增群成员数表格分页pageSize改变
			showFansSizeChange3 (page, pageSize) {
				switch (this.groupIndex2) {
					case 4:
						let that = this
						that.fansTable3.page = pageSize
						let table = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
						that.fansTable3.list = table.list
						that.fansTable3.page = table.page
						if (this.fansTable3.list.length > 10) {
							this.wheelFlag3 = false
						}
						break;
					case 5:
						let thatb = this
						thatb.fansTable3b.page = pageSize
						let tableb = thatb.getPageData(thatb.fansTableList3, thatb.fansTable3b.page, thatb.fansTable3b.pageSize)
						thatb.fansTable3b.list = tableb.list
						thatb.fansTable3b.page = tableb.page
						if (this.fansTable3b.list.length > 10) {
							this.wheelFlag3 = false
						}
						break;
					case 6:
						let thatc = this
						thatc.fansTable3c.page = pageSize
						let tablec = thatc.getPageData(thatc.fansTableList3, thatc.fansTable3c.page, thatc.fansTable3c.pageSize)
						thatc.fansTable3c.list = tablec.list
						thatc.fansTable3c.page = tablec.page
						if (this.fansTable3c.list.length > 10) {
							this.wheelFlag3 = false
						}
						break;
					case 8:
						let thatd = this
						thatd.fansTable3d.page = pageSize
						let tabled = thatd.getPageData(thatd.fansTableList3, thatd.fansTable3d.page, thatd.fansTable3d.pageSize)
						thatd.fansTable3d.list = tabled.list
						thatd.fansTable3d.page = tabled.page
						if (this.fansTable3d.list.length > 10) {
							this.wheelFlag3 = false
						}
						break;
				}
			},

			// 群聊天消息总数页码改变
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
					document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
				})
			},
			// 群聊天消息总数表格分页pageSize改变
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
			// 退群人数页码改变
			changeFansPage5 (val) {
				let that = this
				that.fansTable5.page = val
				let table = that.getPageData(that.fansTableList5, that.fansTable5.page, that.fansTable5.pageSize)
				that.fansTable5.list = table.list
				that.fansTable5.page = table.page
				// if (this.fansTable5.list.length > 10) {
				// 	this.wheelFlag5 = false
				// }
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
				})
			},
			// 退群人数表格分页pageSize改变
			showFansSizeChange5 (page, pageSize) {
				let that = this
				that.fansTable5.pageSize = pageSize
				let table = that.getPageData(that.fansTableList5, that.fansTable5.page, that.fansTable5.pageSize)
				that.fansTable5.list = table.list
				that.fansTable5.page = table.page
				// if (this.fansTable5.list.length > 10) {
				// 	this.wheelFlag5 = false
				// }
			},
			// 群成员总数页码改变
			changeFansPage6 (val) {
				let that = this
				that.fansTable6.page = val
				let table = that.getPageData(that.fansTableList6, that.fansTable6.page, that.fansTable6.pageSize)
				that.fansTable6.list = table.list
				that.fansTable6.page = table.page
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 900)
				})
			},
			// 群成员总数表格分页pageSize改变
			showFansSizeChange6 (page, pageSize) {
				let that = this
				that.fansTable6.pageSize = pageSize
				let table = that.getPageData(that.fansTableList6, that.fansTable6.page, that.fansTable6.pageSize)
				that.fansTable6.list = table.list
				that.fansTable6.page = table.page
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

			// 内容TOP10时间类型切换
			changeFansTimeType1 (type) {
				if (this.timeType != type) {
					this.spinning = true
					this.timeType = type;
					this.getFansIncrease(0)
				}

			},
			async getGroupList () {
				let params = {
					corp_id: this.corpId
				}
				const {data: res} = await this.axios.post("work-chat/chat-group-list", params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.info
					if (this.groupList.length > 0) {
						this.selectGroupId = this.groupList[0].id
						this.selectGroupId3 = this.groupList[0].id
						this.selectGroupId4 = this.groupList[0].id
						this.selectGroupId5 = this.groupList[0].id
						this.selectGroupId6 = this.groupList[0].id
					}
				}
			},
			// 内容TOP10时间值
			changeFansTime1 (date, dateString) {
				this.spinning = true
				if (this.timeType == 1) {
					this.fansAddTime.ds_date = dateString[0]
					this.fansAddTime.de_date = dateString[1]
				}
				this.getFansIncrease(0)
			},
			// 内容TOP10改变起始周
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
				this.getFansIncrease(0)
			},
			// 内容TOP10改变结束周
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
				this.getFansIncrease(0)
			},
			// 内容TOP10表格导出
			exportFansIncrease1 () {
				this.getFansIncrease(1)
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

			//  新增群成员数时间类型切换
			changeFansTimeType3 (type) {
				if (this.timeType3 != type) {
					this.spinning = true
					this.timeType3 = type;
					this.get2(0)
				}

			},
			//  新增群成员数时间值
			changeFansTime3 (date, dateString) {
				this.spinning = true
				if (this.timeType3 == 1) {
					this.fansAddTime3.ds_date = dateString[0]
					this.fansAddTime3.de_date = dateString[1]
				}
				this.get2(0)
			},
			//  新增群成员数改变起始周
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
				this.get2(0)
			},
			//  新增群成员数改变结束周
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
				this.get2(0)
			},
			// 新增群成员数表格导出
			exportFansIncrease3 () {
				this.get2(1)
			},

			// 群聊天消息总数时间类型切换
			changeFansTimeType4 (type) {
				if (this.timeType4 != type) {
					this.spinning = true
					this.timeType4 = type;
					this.get2(0)
				}

			},
			// 群聊天消息总数时间值
			changeFansTime4 (date, dateString) {
				this.spinning = true
				if (this.timeType4 == 1) {
					this.fansAddTime4.ds_date = dateString[0]
					this.fansAddTime4.de_date = dateString[1]
				}
				this.get2(0)
			},
			// 群聊天消息总数改变起始周
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
				this.get2(0)
			},
			// 群聊天消息总数改变结束周
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
				this.get2(0)
			},
			// 群聊天消息总数表格导出
			exportFansIncrease4 () {
				this.get2(1)

			},

			// 退群人数时间类型切换
			changeFansTimeType5 (type) {
				if (this.timeType5 != type) {
					this.spinning = true
					this.timeType5 = type;
					this.get2(0)
				}

			},
			// 退群人数时间值
			changeFansTime5 (date, dateString) {
				this.spinning = true
				if (this.timeType5 == 1) {
					this.fansAddTime5.ds_date = dateString[0]
					this.fansAddTime5.de_date = dateString[1]
				}
				this.get2(0)
			},
			// 退群人数改变起始周
			changeFansStartWeek5 (date, dateString) {
				this.spinning = true
				if (date > this.weekEnd4) {
					this.weekStart5 = moment(JSON.parse(JSON.stringify(this.weekEnd5)))
					this.weekEnd5 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart5).format('E')
					this.fansAddTime5.ws_date = moment(this.weekStart5).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd5).format('E')
					this.fansAddTime5.we_date = moment(this.weekEnd5).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime5.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime5.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime5.ws_week = moment(this.fansAddTime5.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekStart5 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekStart5).format('E')
					this.fansAddTime5.ws_date = moment(this.weekStart5).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					this.fansAddTime5.ws_week = weekDay
				}
				this.get2(0)
			},
			// 退群人数改变结束周
			changeFansEndWeek5 (date, dateString) {
				this.spinning = true
				if (date < this.weekStart5) {
					this.weekEnd5 = moment(JSON.parse(JSON.stringify(this.weekStart5)))
					this.weekStart5 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart5).format('E')
					this.fansAddTime5.ws_date = moment(this.weekStart5).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd5).format('E')
					this.fansAddTime5.we_date = moment(this.weekEnd5).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime5.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime5.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime5.ws_week = moment(this.fansAddTime5.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekEnd5 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekEnd5).format('E')
					this.fansAddTime5.we_date = moment(this.weekEnd5).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					this.fansAddTime5.we_week = weekDay
				}
				this.get2(0)
			},
			// 退群人数表格导出
			exportFansIncrease5 () {
				this.get2(1)
			},

			// 群成员总数时间类型切换
			changeFansTimeType6 (type) {
				if (this.timeType6 != type) {
					this.spinning = true
					this.timeType6 = type;
					this.get2(0)
				}

			},
			// 群成员总数时间值
			changeFansTime6 (date, dateString) {
				this.spinning = true
				if (this.timeType6 == 1) {
					this.fansAddTime6.ds_date = dateString[0]
					this.fansAddTime6.de_date = dateString[1]
				}
				this.get2(0)
			},
			// 群成员总数改变起始周
			changeFansStartWeek6 (date, dateString) {
				this.spinning = true
				if (date > this.weekEnd6) {
					this.weekStart6 = moment(JSON.parse(JSON.stringify(this.weekEnd6)))
					this.weekEnd6 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart3).format('E')
					this.fansAddTime6.ws_date = moment(this.weekStart6).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd6).format('E')
					this.fansAddTime6.we_date = moment(this.weekEnd6).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime6.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime6.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime6.ws_week = moment(this.fansAddTime6.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekStart6 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekStart6).format('E')
					this.fansAddTime6.ws_date = moment(this.weekStart6).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					this.fansAddTime6.ws_week = weekDay
				}
				this.get2(0)
			},
			// 群成员总数改变结束周
			changeFansEndWeek6 (date, dateString) {
				this.spinning = true
				if (date < this.weekStart6) {
					this.weekEnd6 = moment(JSON.parse(JSON.stringify(this.weekStart6)))
					this.weekStart6 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart6).format('E')
					this.fansAddTime6.ws_date = moment(this.weekStart6).subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
					weekOfday = moment(this.weekEnd6).format('E')
					this.fansAddTime6.we_date = moment(this.weekEnd6).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					if (this.fansAddTime6.we_date > moment().format("YYYY-MM-DD")) {
						this.fansAddTime6.we_date = moment().format("YYYY-MM-DD")
					}
					this.fansAddTime6.ws_week = moment(this.fansAddTime6.ws_date, "YYYY-MM-DD").week()
				} else {
					this.weekEnd6 = date
					let week = dateString.split("-")[1]
					let weekDay = week.substring(0, week.length - 1)
					let weekOfday = moment(this.weekEnd6).format('E')
					this.fansAddTime6.we_date = moment(this.weekEnd6).add(7 - weekOfday, 'days').format('YYYY-MM-DD')
					this.fansAddTime6.we_week = weekDay
				}
				this.get2(0)
			},
			// 群成员总数表格导出
			exportFansIncrease6 () {
				this.get2(1)
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
					this.getFansIncrease(0)
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
				let that = this
				this.tabKey = key
				if (key == 1) {
					this.getFansIncrease(0)
				} else if (key == 2) {
					this.groupIndex = 1
					this.get2(0)
				} else if (key == 3) {
					this.groupIndex2 = 4
					this.get2(0)
				} else if (key == 4) {
					this.groupIndex3 = 7
					this.get2(0)
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
		background-color: #E9E9E9;
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
</style>
