<template>
	<div style="width: 100%; height: 100%; overflow-y: scroll;position: absolute;" class="scroll">
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
								<div class="single-accout-cardItem account-type">
									<span>昨日搜索次数
										<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>被员工搜索的次数</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{storeIndicatorsData.search_num}}</p>
									<div>
										<span v-if="storeIndicatorsData.search_type !=0">比前日</span>
										<span v-if="storeIndicatorsData.search_type ==0">与前日持平</span>
										<img v-if="storeIndicatorsData.search_type==2"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='storeIndicatorsData.search_type==1'
										     src="../../../assets/home/img/arrowup.png"/>
										<span v-if="storeIndicatorsData.search_type !=0">{{storeIndicatorsData.search}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>昨日发送次数
									<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>被员工发送的次数</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="color: rgb(59, 116, 255);">{{storeIndicatorsData.send_num}}</p>
									<div>
										<span v-if="storeIndicatorsData.send_type !=0">比前日</span>
										<span v-if="storeIndicatorsData.send_type ==0">与前日持平</span>
										<img v-if="storeIndicatorsData.send_type==2"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='storeIndicatorsData.send_type==1'
										     src="../../../assets/home/img/arrowup.png"/>
										<span v-if="storeIndicatorsData.send_type !=0">{{storeIndicatorsData.send}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>昨日客户打开次数
									<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>被同一客户打开多次，会重复计算</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="color: rgb(59, 116, 255);">{{storeIndicatorsData.open_num}}</p>
									<div>
										<span v-if="storeIndicatorsData.open_type !=0">比前日</span>
										<span v-if="storeIndicatorsData.open_type ==0">与前日持平</span>
										<img v-if="storeIndicatorsData.open_type==2"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='storeIndicatorsData.open_type==1'
										     src="../../../assets/home/img/arrowup.png"/>
										<span v-if="storeIndicatorsData.open_type !=0">{{storeIndicatorsData.open}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="card-filter-contain">
							<template>
								<a-tabs @change="changeTab" type="card"
								        style="background-color: #FFF;">
									<a-tab-pane tab="内容TOP10" key="1">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<a-tree-select
															style="width: 300px;margin-left: 10px;"
															:dropdownStyle="{ maxHeight: '300px',maxWidth: '300px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='所有分组'
															treeDefaultExpandAll
															@change="getFansIncrease(0)"
															v-model="selectGroupId"
													>
													</a-tree-select>
													<!--													@change="handleChangeType"-->
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 200px;margin-left: 10px;"
															placeholder='内容类型'
															@change="getFansIncrease(0)"
															v-model="fileType"
													>
														<template>
															<a-select-option :value="0">
																所有类型
															</a-select-option>
															<a-select-option :value="6">
																文本
															</a-select-option>
															<a-select-option :value="1">
																图片
															</a-select-option>
															<a-select-option :value="4">
																图文
															</a-select-option>
															<a-select-option :value="2">
																音频
															</a-select-option>
															<a-select-option :value="3">
																视频
															</a-select-option>
															<a-select-option :value="7">
																小程序
															</a-select-option>
															<a-select-option :value="5">
																文件
															</a-select-option>
														</template>
													</a-select>
													<div class="month-picker-contain picker-contain">
														<a-button style="margin-right: 5px;"
														          @click="showDepartmentList">
															<span v-if="chooseNum1 == 0">选择部门成员</span>
															<span v-if="chooseNum1 > 0">已选择{{chooseUserNum1}}名成员，{{chooseDepartmentNum1}}个部门</span>
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
																:defaultValue="[moment(moment().subtract(6, 'days'), 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType=='1'"
																v-model = 'dayDate'
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
														搜索次数</span>
													<span style="cursor: pointer;" @click="changeBarType(2)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 2 ? '#AD85F4' : '#CCC' }"></span>
														发送次数</span>
													<span style="cursor: pointer;" @click="changeBarType(3)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd.data_Type == 3 ? '#FFC71B' : '#CCC' }"></span>
														打开次数</span>
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
														<span slot="times">
															<span v-if="fansAdd.data_Type == 1">搜索次数</span>
															<span v-if="fansAdd.data_Type == 2">发送次数</span>
															<span v-if="fansAdd.data_Type == 3">打开次数</span>
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
									<a-tab-pane tab="员工TOP10" key="5">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<a-tree-select
															style="width: 300px;margin-left: 10px;"
															:dropdownStyle="{ maxHeight: '300px',maxWidth: '300px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='所有分组'
															treeDefaultExpandAll
															@change="get3(0)"
															v-model="selectGroupId5"
													>
													</a-tree-select>
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 200px;margin-left: 10px;"
															placeholder='内容类型'
															@change="get3(0)"
															v-model="fileType5"
													>
														<template>
															<a-select-option :value="0">
																所有类型
															</a-select-option>
															<a-select-option :value="6">
																文本
															</a-select-option>
															<a-select-option :value="1">
																图片
															</a-select-option>
															<a-select-option :value="4">
																图文
															</a-select-option>
															<a-select-option :value="2">
																音频
															</a-select-option>
															<a-select-option :value="3">
																视频
															</a-select-option>
															<a-select-option :value="7">
																小程序
															</a-select-option>
															<a-select-option :value="5">
																文件
															</a-select-option>
														</template>
													</a-select>
													<div style="margin-left: 5px;"
													     class="day-picker-contain picker-contain">
														<a-button :class="timeType5== '1'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType5(1)">
															按日
														</a-button>
														<a-range-picker
																style="width: 270px;"
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(6, 'days'), 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType5=='1'"
																v-model = 'dayDate5'
																@change="changeFansTime5"
														/>
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType5 == '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType5(2)">
															按周
														</a-button>
														<a-week-picker
																:allowClear='false'
																:value='weekStart5'
																:disabledDate="disabledDateWeek"
																v-if="timeType5=='2'"
																@change="changeFansStartWeek5"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd5'
																:disabledDate="disabledDateWeek"
																v-if="timeType5=='2'"
																@change="changeFansEndWeek5"
														/>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType5== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType5(3)">
															按月
														</a-button>
													</div>
												</div>
											</div>
											<div class="fans-data-trend">
												<div style="text-align: center;">
													<span style="cursor: pointer;" @click="changeBarType5(1)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd5.data_Type == 1 ? '#3398DB' : '#CCC' }"></span>
															员工贡献内容
															<a-tooltip placement="top">
																<span slot="title">
																	统计具有创建内容权限的子账户，其贡献内容的数量
																</span>
																<a-icon type="question-circle" style="margin-left:5px;"/>
															</a-tooltip>
														</span>
													<span style="cursor: pointer;" @click="changeBarType5(2)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd5.data_Type == 2 ? '#AD85F4' : '#CCC' }"></span>
														员工发送
														<a-tooltip placement="top">
																<span slot="title">
																	统计企业微信成员发送的次数
																</span>
																<a-icon type="question-circle" style="margin-left:5px;"/>
															</a-tooltip>
													</span>
												</div>
												<BarCharts v-if="tabKey == 5" style="width:100%;" :options="fansAdd5"
												           v-show="fansAdd5.seriesData.length != 0"
												>
												</BarCharts>
												<a-empty v-show="fansAdd5.seriesData.length == 0"
												         style="margin-top: 30px;">
													<span slot="description" style="color: #999;">暂无排行榜</span>
												</a-empty>
											</div>
											<div class="fans-data-detail">
												<div class="title-contain">
													<p>详细数据</p>
													<a-button @click="exportFansIncrease5" type="primary"
													          >
														导出数据
													</a-button>
												</div>
												<div class="content-bd">
													<a-table :columns="fansTable5.columns" :dataSource="fansTable5.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
														<span slot="times">
															<span v-if="fansAdd5.data_Type == 1">贡献内容</span>
															<span v-if="fansAdd5.data_Type == 2">发送次数</span>
										                </span>
													</a-table>
													<div style="width: 100%;" v-show="fansTable5.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable5.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable5.total" showSizeChanger
															              :showQuickJumper="fansTable5.quickJumper"
															              :current="fansTable5.page"
															              :pageSize="fansTable5.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage5"
															              @showSizeChange="showFansSizeChange5"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="搜索词TOP10" key="6">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div style="margin-left: 5px;"
													     class="day-picker-contain picker-contain">
														<a-button :class="timeType6== '1'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType6(1)">
															按日
														</a-button>
														<a-range-picker
																style="width: 270px;"
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(6, 'days'), 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType6=='1'"
																v-model = 'dayDate6'
																@change="changeFansTime6"
														/>
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType6== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType6(2)">
															按周
														</a-button>
														<a-week-picker
																:allowClear='false'
																:value='weekStart6'
																:disabledDate="disabledDateWeek"
																v-if="timeType6=='2'"
																@change="changeFansStartWeek6"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd6'
																:disabledDate="disabledDateWeek"
																v-if="timeType6=='2'"
																@change="changeFansEndWeek6"
														/>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType6== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType6(3)">
															按月
														</a-button>
													</div>
												</div>
											</div>
											<div class="fans-data-trend">
												<BarCharts v-if="tabKey == 6" style="width:100%;" :options="fansAdd6"
												           v-show="fansAdd6.seriesData.length != 0"
												>
												</BarCharts>
												<a-empty v-show="fansAdd6.seriesData.length == 0"
												         style="margin-top: 30px;">
													<span slot="description" style="color: #999;">暂无排行榜</span>
												</a-empty>
											</div>
											<div class="fans-data-detail">
												<div class="title-contain">
													<p>详细数据</p>
													<a-button @click="exportFansIncrease6" type="primary"
													          >
														导出数据
													</a-button>
												</div>
												<div class="content-bd">
													<a-table :columns="fansTable6.columns" :dataSource="fansTable6.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
													<div style="width: 100%;" v-show="fansTable6.total > 0">
														<div style="height: 32px;display: inline-block;margin-top: 25px;">
															共
															<span style="color: blue">{{fansTable6.total}}</span>条
														</div>
														<div class="pagination" style="margin-top: 20px;float: right;">
															<a-pagination :total="fansTable6.total" showSizeChanger
															              :showQuickJumper="fansTable6.quickJumper"
															              :current="fansTable6.page"
															              :pageSize="fansTable6.pageSize"
															              :pageSizeOptions="['10','20','30','60']"
															              @change="changeFansPage6"
															              @showSizeChange="showFansSizeChange6"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="搜索次数" key="2">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<a-input-search
															placeholder="输入搜索内容"
															v-model="name2"
															:allowClear=true
															enterButton="搜索"
															@search="get2(0)"
															style="width: 200px;margin-left: 10px;"
													/>
													<a-tree-select
															style="margin-left: 10px; width: 300px; padding: 9px 0px;"
															:dropdownStyle="{ maxHeight: '300px',maxWidth: '300px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='所有分组'
															treeDefaultExpandAll
															@change="get2(0)"
															v-model="selectGroupId2"
													>
													</a-tree-select>
													<!--													@change="handleChangeType"-->
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 200px;margin-left: 10px;"
															placeholder='内容类型'
															@change="get2(0)"
															v-model="fileType2"
													>
														<template>
															<a-select-option :value="0">
																所有类型
															</a-select-option>
															<a-select-option :value="6">
																文本
															</a-select-option>
															<a-select-option :value="1">
																图片
															</a-select-option>
															<a-select-option :value="4">
																图文
															</a-select-option>
															<a-select-option :value="2">
																音频
															</a-select-option>
															<a-select-option :value="3">
																视频
															</a-select-option>
															<a-select-option :value="7">
																小程序
															</a-select-option>
															<a-select-option :value="5">
																文件
															</a-select-option>
														</template>
													</a-select>
													<!--													@search="onSearch"-->
													<div class="month-picker-contain picker-contain">
														<a-button style="margin-right: 5px;"
														          @click="showDepartmentList">
															<span v-if="chooseNum2 == 0">选择部门成员</span>
															<span v-if="chooseNum2 > 0">已选择{{chooseUserNum2}}名成员，{{chooseDepartmentNum2}}个部门</span>
														</a-button>
													</div>
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
																:defaultValue="[moment(moment().subtract(6, 'days'), 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType2=='1'"
																v-model = 'dayDate2'
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
											<div class="sec-card-caledar down-text"
											     style="border-top: 0px;">
												<p style="margin-bottom: 0px;">
													这段时间里，共搜索
													<span>{{timeSum}}</span>
													次
												</p>
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
									<a-tab-pane tab="发送次数" key="3">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<a-input-search
															placeholder="输入搜索内容"
															v-model="name3"
															:allowClear=true
															@search="get2(0)"
															enterButton="搜索"
															style="width: 200px;margin-left: 10px;"
													/>
													<a-tree-select
															style="margin-left: 10px; width: 300px; padding: 9px 0px;"
															:dropdownStyle="{ maxHeight: '300px',maxWidth: '300px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='所有分组'
															treeDefaultExpandAll
															@change="get2(0)"
															v-model="selectGroupId3"
													>
													</a-tree-select>
													<!--													@change="handleChangeType"-->
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 200px;margin-left: 10px;"
															placeholder='内容类型'
															@change="get2(0)"
															v-model="fileType3"
													>
														<template>
															<a-select-option :value="0">
																所有类型
															</a-select-option>
															<a-select-option :value="6">
																文本
															</a-select-option>
															<a-select-option :value="1">
																图片
															</a-select-option>
															<a-select-option :value="4">
																图文
															</a-select-option>
															<a-select-option :value="2">
																音频
															</a-select-option>
															<a-select-option :value="3">
																视频
															</a-select-option>
															<a-select-option :value="7">
																小程序
															</a-select-option>
															<a-select-option :value="5">
																文件
															</a-select-option>
														</template>
													</a-select>
													<div class="month-picker-contain picker-contain">
														<a-button style="margin-right: 5px;"
														          @click="showDepartmentList">
															<span v-if="chooseNum3 == 0">选择部门成员</span>
															<span v-if="chooseNum3 > 0">已选择{{chooseUserNum3}}名成员，{{chooseDepartmentNum3}}个部门</span>
														</a-button>
													</div>
													<div style="margin-left: 5px;"
													     class="day-picker-contain picker-contain">
														<a-button :class="timeType3== '1'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType3(1)">
															按日
														</a-button>
														<a-range-picker
																style="width: 270px;"
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(6, 'days'), 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType3=='1'"
																v-model = 'dayDate3'
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
											<div class="sec-card-caledar down-text"
											     style="border-top: 0px;">
												<p style="margin-bottom: 0px;">
													这段时间里，共发送
													<span>{{timeSum}}</span>
													次
												</p>
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
									<a-tab-pane tab="打开次数" key="4">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<a-input-search
															placeholder="输入搜索内容"
															v-model="name4"
															:allowClear=true
															@search="get2(0)"
															enterButton="搜索"
															style="width: 200px;margin-left: 10px;"
													/>
													<a-tree-select
															style="margin-left: 10px; width: 300px;padding: 9px 0;"
															:dropdownStyle="{ maxHeight: '300px',maxWidth: '300px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='所有分组'
															@change="get2(0)"
															treeDefaultExpandAll
															v-model="selectGroupId4"
													>
													</a-tree-select>
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 200px;margin-left: 10px;"
															placeholder='内容类型'
															@change="get2(0)"
															v-model="fileType4"
													>
														<template>
															<a-select-option :value="0">
																所有类型
															</a-select-option>
															<a-select-option :value="1">
																图片
															</a-select-option>
															<a-select-option :value="4">
																图文
															</a-select-option>
															<a-select-option :value="3">
																视频
															</a-select-option>
														</template>
													</a-select>
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
																:defaultValue="[moment(moment().subtract(6, 'days'), 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType4=='1'"
																v-model = 'dayDate4'
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
											<div class="sec-card-caledar down-text"
											     style="border-top: 0px;">
												<p style="margin-bottom: 0px;">
													这段时间里，共打开
													<span>{{timeSum}}</span>
													次
												</p>
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
		<!--部门选择框-->
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNumber"
		                  :callback="modalVisibleChange3" :is_special="1"></chooseDepartment>
	</div>
</template>

<script>
	import LineCharts from '../../../components/echarts/LineCharts'
	import BarCharts from '../../../components/echarts/BarCharts'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import corpAuthorize from "@/components/CorpAuthorize.vue"
	import moment from 'moment'


	export default {
		name      : 'filingCabinetStatisticsNew',
		components: {
			LineCharts,
			BarCharts,
			chooseDepartment,
			corpAuthorize
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				chooseNumber       : 0,//整合后传给组件的值
				corpId             : corpId,//企业微信选中的id
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
				storeIndicatorsData: {
					search_num : "0",
					send_num   : "0",
					open_num   : "0",
					search     : "0%",
					search_type: "0",
					send       : "0%",
					send_type  : "0",
					open       : "0%",
					open_type  : "0"
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
				timeSum            : 0,
				/* 内容TOP10 */
				wheelFlag          : true,
				fansAddTime        : {
					ds_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
					de_date: moment().format('YYYY-MM-DD'),
					ws_date: moment().weekday(0).format('YYYY-MM-DD'),
					we_date: moment().weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() || 52
				},
				dayDate   : [moment().subtract(8, 'days'),  moment().subtract(1, 'days')],
				weekStart          : moment(),
				weekEnd            : moment(),
				s_week             : '',
				selectGroupId      : [],
				groupList          : [],
				fileType           : 0,
				timeType           : 1,  //内容TOP10tab时间类型选择
				// 内容TOP10折线图
				fansAdd            : {
					title     : '内容TOP10',
					xAxisData : [],
					data_Type : 1,
					name      : '搜索次数',
					seriesData: [
						{
							data  : [],
							name  : "内容TOP10",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue1        : [],//内容TOP10-选择的成员id数组
				checkedList1       : [],
				chooseNum1         : 0,//内容TOP10-已选择的内容数量
				chooseUserNum1      : 0,//成员个数
				chooseDepartmentNum1: 0,//部门个数
				// 内容TOP10表格
				fansTableList      : [],
				fansTable          : {
					columns    : [
						{
							title    : "排行",
							dataIndex: "sort",
							key      : "sort",
						},
						{
							title    : "内容标题",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "内容类型",
							dataIndex: "type_name",
							key      : "type_name",
						},
						{
							slots    : {title: "times"},
							dataIndex: "times",
							key      : "times",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},
				// 员工TOP10
				wheelFlag5         : true,
				fansAddTime5       : {
					ds_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
					de_date: moment().format('YYYY-MM-DD'),
					ws_date: moment().weekday(0).format('YYYY-MM-DD'),
					we_date: moment().weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() || 52
				},
				dayDate5   : [moment().subtract(8, 'days'),  moment().subtract(1, 'days')],
				weekStart5         : moment(),
				weekEnd5           : moment(),
				s_week5            : '',
				selectGroupId5     : [],
				fileType5          : 0,
				timeType5          : 1,  //员工TOP10tab时间类型选择
				// 员工TOP10折线图
				fansAdd5           : {
					title     : '员工TOP10',
					xAxisData : [],
					data_Type : 1,
					name      : '贡献内容',
					seriesData: [
						{
							data  : [],
							name  : "员工TOP10",
							smooth: true,
							type  : "line"
						}
					]
				},
				// 员工TOP10表格
				fansTableList5     : [],
				fansTable5         : {
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
							slots    : {title: "times"},
							dataIndex: "sum",
							key      : "sum",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 搜索词TOP10 */
				wheelFlag6    : true,
				fansAddTime6  : {
					ds_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
					de_date: moment().format('YYYY-MM-DD'),
					ws_date: moment().weekday(0).format('YYYY-MM-DD'),
					we_date: moment().weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() || 52
				},
				dayDate6   : [moment().subtract(8, 'days'),  moment().subtract(1, 'days')],
				weekStart6    : moment(),
				weekEnd6      : moment(),
				s_week6       : '',
				timeType6     : 1,  //搜索词TOP10tab时间类型选择
				// 搜索词TOP10折线图
				fansAdd6      : {
					title     : '搜索词TOP10',
					legendData: ["搜索词TOP10"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "搜索次数",
							smooth: true,
							type  : "bar"
						}
					]
				},
				// 搜索词TOP10表格
				fansTableList6: [],
				fansTable6    : {
					columns    : [
						{
							title    : "排行",
							dataIndex: "sort",
							key      : "sort",
						},
						{
							title    : "搜索词",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "次数",
							dataIndex: "sum",
							key      : "sum",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 搜索次数 */
				wheelFlag2    : true,
				fansAddTime2  : {
					ds_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
					de_date: moment().format('YYYY-MM-DD'),
					ws_date: moment().weekday(0).format('YYYY-MM-DD'),
					we_date: moment().weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() || 52
				},
				dayDate2   : [moment().subtract(8, 'days'),  moment().subtract(1, 'days')],
				weekStart2    : moment(),
				weekEnd2      : moment(),
				s_week2       : '',
				selectGroupId2: [],
				fileType2     : 0,
				name2         : '',
				timeType2     : 1,  //搜索次数tab时间类型选择
				// 搜索次数折线图
				fansAdd2      : {
					title     : '搜索次数',
					legendData: ["搜索次数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "搜素次数",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue2   : [],//搜索次数-选择的内容id数组
				checkedList2  : [],
				chooseNum2    : 0,//搜索次数-已选择的内容数量
				chooseUserNum2      : 0,//成员个数
				chooseDepartmentNum2: 0,//部门个数
				// 搜索次数表格
				fansTableList2: [],
				fansTable2    : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "搜索次数",
							dataIndex: "times",
							key      : "times",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 发送次数 */
				wheelFlag3    : true,
				fansAddTime3  : {
					ds_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
					de_date: moment().format('YYYY-MM-DD'),
					ws_date: moment().weekday(0).format('YYYY-MM-DD'),
					we_date: moment().weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() || 52
				},
				dayDate3   : [moment().subtract(8, 'days'),  moment().subtract(1, 'days')],
				weekStart3    : moment(),
				weekEnd3      : moment(),
				s_week3       : '',
				timeType3     : 1,  //发送次数tab时间类型选择
				name3         : '',
				selectGroupId3: [],
				fileType3     : 0,
				// 发送次数折线图
				fansAdd3      : {
					title     : '发送次数',
					legendData: ["发送次数"],
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
				staffValue3   : [],//发送次数-选择的内容id数组
				checkedList3  : [],
				chooseNum3    : 0,//发送次数-已选择的内容数量
				chooseUserNum3      : 0,//成员个数
				chooseDepartmentNum3: 0,//部门个数
				// 发送次数表格
				fansTableList3: [],
				fansTable3    : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "发送次数",
							dataIndex: "times",
							key      : "times",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 打开次数 */
				wheelFlag4    : true,
				fansAddTime4  : {
					ds_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
					de_date: moment().format('YYYY-MM-DD'),
					ws_date: moment().weekday(0).format('YYYY-MM-DD'),
					we_date: moment().weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() || 52
				},
				dayDate4   : [moment().subtract(8, 'days'),  moment().subtract(1, 'days')],
				weekStart4    : moment(),
				weekEnd4      : moment(),
				s_week4       : '',
				timeType4     : 1,  //打开次数tab时间类型选择
				name4         : '',
				selectGroupId4: [],
				fileType4     : 0,
				// 打开次数折线图
				fansAdd4      : {
					title     : '打开次数',
					legendData: ["打开次数"],
					xAxisData : [],
					seriesData: [
						{
							data  : [],
							name  : "打开次数",
							smooth: true,
							type  : "line"
						}
					]
				},
				staffValue4   : [],//打开次数-选择的内容id数组
				checkedList4  : [],
				chooseNum4    : 0,//打开次数-已选择的内容数量
				chooseUserNum4      : 0,//成员个数
				chooseDepartmentNum4: 0,//部门个数
				// 打开次数表格
				fansTableList4: [],
				fansTable4    : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "打开次数",
							dataIndex: "times",
							key      : "times",
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
				const {data: res} = await this.axios.post("attachment/get-times", {
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
				if(this.wxList.length == 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.warning('请授权企业微信')
					return false
				}
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
					this.checkedList2 = []
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
				this.fansAdd.data_Type = val
				if (val == 1) {
					this.fansAdd.name = '搜索次数'
				} else if (val == 2) {
					this.fansAdd.name = '发送次数'
				} else if (val == 3) {
					this.fansAdd.name = '打开次数'
				}
				this.getFansIncrease(0)
			},

			// 内容TOP10
			async getFansIncrease (is_export, page = 1, pageSize) {
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
					this.dayDate =  [moment(this.fansAddTime.ds_date),  moment(this.fansAddTime.de_date)]
				} else if (this.timeType == 2) {
					s_date = this.fansAddTime.ws_date
					e_date = this.fansAddTime.we_date
				} else if (this.timeType == 3) {
					s_date = moment().startOf('month').format("YYYY-MM-DD")
					e_date = moment(new Date()).format('YYYY-MM-DD')
				}
				let that = this
				let params = {
					s_date    : s_date,
					e_date    : e_date,
					s_week    : this.fansAddTime.ws_week,
					type      : 1,
					date_type : this.timeType,
					is_export : is_export,
					corp_id   : this.wxId,
					group_id  : this.selectGroupId.length == 0 ? '' : this.selectGroupId,
					user_ids  : this.staffValue1,
					times_type: this.fansAdd.data_Type,
					file_type : this.fileType
				}
				if (is_export != 1) {
					if (this.tabKey == 1) {
						params['page'] = page
						params['pageSize'] = pageSize || that.fansTable.pageSize
					}
				}
				const {data: res} = await this.axios.post("attachment/sum-list", params);
				if (res.error == 0) {
					if (is_export != 1) {
						if (page == 1) {
							this.timeSum = res.data.timeSum
							if (res.data.seriesData && res.data.seriesData.length != 0 && res.data.seriesData[0].data) {
								that.fansAdd.seriesData = res.data.seriesData[0].data
							}
							that.fansAdd.xAxisData = res.data.xData
						}
						that.fansTable.total = parseInt(res.data.count)
						that.fansTable.list = res.data.fileData
						that.fansTable.page = page
						that.fansTable.pageSize = pageSize || that.fansTable.pageSize
					} else {
						window.open(res.data.url);
					}
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}

			},
			// 内容TOP10页码改变
			changeFansPage1 (val) {
				this.getFansIncrease(0, val, this.fansTable.pageSize)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 700)
				})
			},
			// 内容TOP10表格分页pageSize改变
			showFansSizeChange1 (page, pageSize) {
				this.getFansIncrease(0, 1, pageSize)
			},

			// 搜索次数、发送次数、打开次数
			async get2 (is_export) {
				if (this.wxList.length == 0) {
					this.spinning = false
					return false
				}
				let that = this
				let user_ids = []
				let name = ''
				let group_id = ''
				let s_date = ''
				let e_date = ''
				let s_week = ''
				let fileType = ''
				let timeType = ''
				if (this.tabKey == 2) {
					s_date = this.fansAddTime2.ds_date
					e_date = this.fansAddTime2.de_date
					this.dayDate2 =  [moment(this.fansAddTime2.ds_date),  moment(this.fansAddTime2.de_date)]
					if (this.timeType2 == 2) {
						s_date = this.fansAddTime2.ws_date
						e_date = this.fansAddTime2.we_date
					}
					group_id = this.selectGroupId2.length == 0 ? '' : this.selectGroupId2,
						name = this.name2
					timeType = this.timeType2
					s_week = this.fansAddTime2.ws_week
					fileType = this.fileType2
					user_ids = this.staffValue2
				} else if (this.tabKey == 3) {
					s_date = this.fansAddTime3.ds_date
					e_date = this.fansAddTime3.de_date
					this.dayDate3 =  [moment(this.fansAddTime3.ds_date),  moment(this.fansAddTime3.de_date)]
					if (this.timeType3 == 2) {
						s_date = this.fansAddTime3.ws_date
						e_date = this.fansAddTime3.we_date
					}
					group_id = this.selectGroupId3.length == 0 ? '' : this.selectGroupId3,
						name = this.name3
					timeType = this.timeType3
					s_week = this.fansAddTime3.ws_week
					fileType = this.fileType3
					user_ids = this.staffValue3
				} else if (this.tabKey == 4) {
					s_date = this.fansAddTime4.ds_date
					e_date = this.fansAddTime4.de_date
					this.dayDate4 =  [moment(this.fansAddTime4.ds_date),  moment(this.fansAddTime4.de_date)]
					if (this.timeType4 == 2) {
						s_date = this.fansAddTime4.ws_date
						e_date = this.fansAddTime4.we_date
					}
					group_id = this.selectGroupId4.length == 0 ? '' : this.selectGroupId4,
						name = this.name4
					timeType = this.timeType4
					s_week = this.fansAddTime4.ws_week
					fileType = this.fileType4
					user_ids = this.staffValue4
				}
				let params = {
					s_date   : s_date,
					e_date   : e_date,
					s_week   : s_week,
					type     : this.tabKey,
					file_name: name,
					group_id : group_id,
					is_export: is_export,
					file_type: fileType,
					corp_id  : this.wxId,
					date_type: timeType,
					user_ids : user_ids
				}
				const {data: res} = await this.axios.post("attachment/sum-list", params);
				if (res.error == 0) {
					if (is_export != 1) {
						this.timeSum = res.data.timeSum
						if (this.tabKey == 2) {
							// that.fansAdd2.legendData = res.data.xData
							that.fansAdd2.seriesData = res.data.seriesData
							that.fansAdd2.xAxisData = res.data.xData
							that.fansTableList2 = res.data.fileData
							let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
							that.fansTable2.total = that.fansTableList2.length
							that.fansTable2.list = table.list
							that.fansTable2.page = table.page
						} else if (this.tabKey == 3) {
							// that.fansAdd3.legendData = res.data.xData
							that.fansAdd3.seriesData = res.data.seriesData
							that.fansAdd3.xAxisData = res.data.xData
							that.fansTableList3 = res.data.fileData
							let table = that.getPageData(that.fansTableList3, that.fansTable3.page, that.fansTable3.pageSize)
							that.fansTable3.total = that.fansTableList3.length
							that.fansTable3.list = table.list
							that.fansTable3.page = table.page
						} else if (this.tabKey == 4) {
							// that.fansAdd4.legendData = res.data.xData
							that.fansAdd4.seriesData = res.data.seriesData
							that.fansAdd4.xAxisData = res.data.xData
							that.fansTableList4 = res.data.fileData
							let table = that.getPageData(that.fansTableList4, that.fansTable4.page, that.fansTable4.pageSize)
							that.fansTable4.total = that.fansTableList4.length
							that.fansTable4.list = table.list
							that.fansTable4.page = table.page
						}
					} else {
						window.open(res.data.url);
					}
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}

			},
			// 搜索次数页码改变
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
					document.getElementsByClassName('scroll')[0].scrollTo(0, 850)
				})
			},
			// 搜索次数表格分页pageSize改变
			showFansSizeChange2 (page, pageSize) {
				let that = this
				that.fansTable2.pageSize = pageSize
				let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
				that.fansTable2.list = table.list
				that.fansTable2.page = table.page
				if (this.fansTable2.list.length > 10) {
					this.wheelFlag2 = false
				}
			},// 搜索次数

			// 发送次数页码改变
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
					document.getElementsByClassName('scroll')[0].scrollTo(0, 850)
				})
			},
			// 发送次数表格分页pageSize改变
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

			// 打开次数页码改变
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
					document.getElementsByClassName('scroll')[0].scrollTo(0, 850)
				})
			},
			// 打开次数表格分页pageSize改变
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
			// 内容TOP10页码改变
			changeFansPage5 (val) {
				this.get3(0, val, this.fansAdd5.pageSize)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 850)
				})
			},
			// 内容TOP10表格分页pageSize改变
			showFansSizeChange5 (page, pageSize) {
				this.get3(0, 1, pageSize)
			},
			// 内容TOP10页码改变
			changeFansPage6 (val) {
				this.get3(0, val, this.fansAdd6.pageSize)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 850)
				})
			},
			// 内容TOP10表格分页pageSize改变
			showFansSizeChange6 (page, pageSize) {
				this.get3(0, 1, pageSize)
			},
			disabledDateHours (current) {
				return current > moment().endOf('day') || current < moment().subtract(3, "days");
			},
			disabledDateDay (current) {
				return current.valueOf() > new Date().getTime() || current < moment().subtract(30, "days");
			},
			disabledDateWeek (current) {
				return current.valueOf() > moment(new Date()).weekday(6) || current < moment().subtract(365, "days");
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
					uid: localStorage.getItem('uid')
				}
				const {data: res} = await this.axios.post("attachment/group", params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					let g = {
						key         : "",
						value       : "0",
						parent_id   : null,
						title       : "所有分组",
						sort        : 0,
						is_not_group: 0,
						scopedSlots : {
							title: "custom"
						},
						children    : []
					}
					this.groupList.splice(0, 0, g)
					this.selectGroupId = '0'
					this.selectGroupId2 = '0'
					this.selectGroupId3 = '0'
					this.selectGroupId4 = '0'
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

			// 搜索次数时间类型切换
			changeFansTimeType2 (type) {
				if (this.timeType2 != type) {
					this.spinning = true
					this.timeType2 = type;
					this.get2(0)
				}

			},
			// 搜索次数时间值
			changeFansTime2 (date, dateString) {
				this.spinning = true
				if (this.timeType2 == 1) {
					this.fansAddTime2.ds_date = dateString[0]
					this.fansAddTime2.de_date = dateString[1]
				}
				this.get2(0)
			},
			// 搜索次数改变起始周
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
			// 搜索次数改变结束周
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
			// 搜索次数表格导出
			exportFansIncrease2 () {
				this.get2(1)

			},

			// 发送次数时间类型切换
			changeFansTimeType3 (type) {
				if (this.timeType3 != type) {
					this.spinning = true
					this.timeType3 = type;
					this.get2(0)
				}

			},
			// 发送次数时间值
			changeFansTime3 (date, dateString) {
				this.spinning = true
				if (this.timeType3 == 1) {
					this.fansAddTime3.ds_date = dateString[0]
					this.fansAddTime3.de_date = dateString[1]
				}
				this.get2(0)
			},
			// 发送次数改变起始周
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
			// 发送次数改变结束周
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
			// 发送次数表格导出
			exportFansIncrease3 () {
				this.get2(1)

			},

			// 打开次数时间类型切换
			changeFansTimeType4 (type) {
				if (this.timeType4 != type) {
					this.spinning = true
					this.timeType4 = type;
					this.get2(0)
				}

			},
			// 打开次数时间值
			changeFansTime4 (date, dateString) {
				this.spinning = true
				if (this.timeType4 == 1) {
					this.fansAddTime4.ds_date = dateString[0]
					this.fansAddTime4.de_date = dateString[1]
				}
				this.get2(0)
			},
			// 打开次数改变起始周
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
			// 打开次数改变结束周
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
			// 打开次数表格导出
			exportFansIncrease4 () {
				this.get2(1)

			},

			// 员工TOP10时间类型切换
			changeFansTimeType5 (type) {
				if (this.timeType5 != type) {
					this.spinning = true
					this.timeType5 = type;
					this.get3(0)
				}

			},
			//切换柱状图显示数据
			changeBarType5 (val) {
				this.fansAdd5.data_Type = val
				if (val == 1) {
					this.fansAdd5.name = ' 贡献内容'
				} else if (val == 2) {
					this.fansAdd5.name = '员工发送'
				}
				this.get3(0)
			},
			async get3 (is_export, page = 1, pageSize) {
				this.spinning = true
				if (this.wxList.length == 0) {
					this.spinning = false
					return false
				}
				let params = {
					uid      : localStorage.getItem('uid'),
					type     : this.tabKey,
					is_export: is_export,
					corp_id  : this.wxId,
				}
				if (is_export != 1) {
					params['page'] = page
					if (this.tabKey == 5) {
						params['pageSize'] = pageSize || this.fansTable5.pageSize
					} else if (this.tabKey == 6) {
						params['pageSize'] = pageSize || this.fansTable6.pageSize
					}
				}
				let s_date = ''
				let e_date = ''
				if (this.tabKey == 5) {
					if (this.timeType5 == 1) {
						s_date = this.fansAddTime5.ds_date
						e_date = this.fansAddTime5.de_date
						this.dayDate5 =  [moment(this.fansAddTime5.ds_date),  moment(this.fansAddTime5.de_date)]
					} else if (this.timeType5 == 2) {
						s_date = this.fansAddTime5.ws_date
						e_date = this.fansAddTime5.we_date
					} else if (this.timeType5 == 3) {
						s_date = moment().startOf('month').format("YYYY-MM-DD")
						e_date = moment(new Date()).format('YYYY-MM-DD')
					}
					params['times_type'] = this.fansAdd5.data_Type
					params['s_week'] = this.fansAddTime5.ws_week
					params['date_type'] = this.timeType5
					params['file_type'] = this.fileType5
					params['group_id'] = this.selectGroupId5.length == 0 ? '' : this.selectGroupId5
				} else if (this.tabKey == 6) {
					if (this.timeType6 == 1) {
						s_date = this.fansAddTime6.ds_date
						e_date = this.fansAddTime6.de_date
						this.dayDate6 =  [moment(this.fansAddTime6.ds_date),  moment(this.fansAddTime6.de_date)]
					} else if (this.timeType6 == 2) {
						s_date = this.fansAddTime6.ws_date
						e_date = this.fansAddTime6.we_date
					} else if (this.timeType6 == 3) {
						s_date = moment().startOf('month').format("YYYY-MM-DD")
						e_date = moment(new Date()).format('YYYY-MM-DD')
					}
					params['times_type'] = this.fansAdd6.data_Type
					params['s_week'] = this.fansAddTime6.ws_week
					params['date_type'] = this.timeType6
				}
				params['s_date'] = s_date
				params['e_date'] = e_date
				let that = this

				const {data: res} = await this.axios.post("attachment/top10", params);
				if (res.error == 0) {
					if (is_export != 1) {
						if (this.tabKey == 5) {
							if (page == 1) {
								if (res.data.seriesData && res.data.seriesData.length != 0 && res.data.seriesData[0].data) {
									that.fansAdd5.seriesData = res.data.seriesData[0].data
								}
								that.fansAdd5.xAxisData = res.data.xData
							}
							that.fansTable5.total = parseInt(res.data.count)
							that.fansTable5.list = res.data.fileData
							that.fansTable5.page = res.data.fileData.count
							that.fansTable5.pageSize = pageSize || this.fansTable5.pageSize
						} else if (this.tabKey == 6) {
							if (page == 1) {
								if (res.data.seriesData && res.data.seriesData.length != 0 && res.data.seriesData[0].data) {
									that.fansAdd6.seriesData = res.data.seriesData[0].data
								}
								that.fansAdd6.xAxisData = res.data.xData
							}
							that.fansTable6.total = parseInt(res.data.count)
							that.fansTable6.list = res.data.fileData
							that.fansTable6.page = page
							that.fansTable6.pageSize = pageSize || this.fansTable6.pageSize
						}
					} else {
						window.open(res.data.url);
					}
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}
			},
			// 员工TOP10时间值
			changeFansTime5 (date, dateString) {
				this.spinning = true
				if (this.timeType5 == 1) {
					this.fansAddTime5.ds_date = dateString[0]
					this.fansAddTime5.de_date = dateString[1]
				}
				this.get3(0)
			},
			// 员工TOP10改变起始周
			changeFansStartWeek5 (date, dateString) {
				this.spinning = true
				if (date > this.weekEnd5) {
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
				this.get3(0)
			},
			// 员工TOP10改变结束周
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
					this.we_week5 = weekDay
				}
				this.get3(0)
			},
			// 员工TOP10表格导出
			exportFansIncrease5 () {
				this.get3(1)
			},

			// 打开次数时间类型切换
			changeFansTimeType6 (type) {
				if (this.timeType6 != type) {
					this.spinning = true
					this.timeType6 = type;
					this.get3(0)
				}

			},
			// 打开次数时间值
			changeFansTime6 (date, dateString) {
				this.spinning = true
				if (this.timeType6 == 1) {
					this.fansAddTime6.ds_date = dateString[0]
					this.fansAddTime6.de_date = dateString[1]
				}
				this.get3(0)
			},
			// 打开次数改变起始周
			changeFansStartWeek6 (date, dateString) {
				this.spinning = true
				if (date > this.weekEnd6) {
					this.weekStart6 = moment(JSON.parse(JSON.stringify(this.weekEnd6)))
					this.weekEnd6 = moment(JSON.parse(JSON.stringify(date)))
					let weekOfday = moment(this.weekStart6).format('E')
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
				this.get3(0)
			},
			// 打开次数改变结束周
			changeFansEndWeek6 (date, dateString) {
				this.spinning = true
				if (date < this.weekStart6) {
					this.weekEnd6 = moment(JSON.parse(JSON.stringify(this.weekStart6)))
					this.weekStart4 = moment(JSON.parse(JSON.stringify(date)))
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
				this.get3(0)
			},
			// 打开次数表格导出
			exportFansIncrease6 () {
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
					this.getFansIncrease(0)
				} else if (this.tabKey == 2 || this.tabKey == 3 || this.tabKey == 4) {
					this.get2(0)
				} else if (this.tabKey == 5 || this.tabKey == 6) {
					this.get3(0)
				}
				// if (localStorage.getItem('isMasterAccount') == 2) {
				// 	this.$store.dispatch('getPermissionButton')
				// }
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
				} else if (key == 2 || key == 3 || key == 4) {
					this.get2(0)
				} else if (key == 5 || key == 6) {
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
		border: 0;
		border: 1px solid #01b065;
		background: #01b065;
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
