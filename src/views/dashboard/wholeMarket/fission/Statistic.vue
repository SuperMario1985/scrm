<template>
	<div style="width: 100%; height: 100%; overflow-y: scroll;position: absolute;" class="scroll">
		<div class="home-left-contain">
			<a-spin :spinning="spinning" tip="Loading..." size="large"
			        :class="spinning?'spinning-true':'spinning-false'">
				<div style="height: 50px;font-size: 16px;background-color: #FFFFFF; line-height: 50px;padding: 0 20px;">
					{{title}}
					<a-button style="float:right;margin-top: 9px;" type="primary" @click="goBack" icon="rollback">返回列表
					</a-button>
				</div>
				<div class="tabs-contain" style="margin-top: 20px">
					<div class="single-account-contain">
						<div class="spin-content" v-if="type == 0">
							<div class="single-accout-card">
								<div class="single-accout-cardItem account-type">
									<span>
										今日新增粉丝
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日参加活动且首次新关注的粉丝（在今日前，关注再取关，然后在今日再关注，不计入）</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_new_fans}}</p>
									<div>
										<span>昨日全天：{{new_last_fans}}  累计：{{new_fans}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日净增新粉丝
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日新增粉丝 - 今日取关新粉丝</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_participation}}</p>
									<div>
										<span>昨日全天：{{last_participation}}  累计：{{participation}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日参与人
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日生成了自己的专属海报即算参与人。</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{net_now_fans}}</p>
									<div>
										<span>昨日全天：{{net_last_fans}}  累计：{{net_fans}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日取关新粉丝
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日参加活动且首次新关注再取关的粉丝（在今日前，关注再取关，然后在今日关注再取消，不计入）</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_not_day}}</p>
									<div>
										<span>昨日全天：{{last_now_not_day}}  累计：{{not_day_count}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日完成任务
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日参与人中完成任务的人数</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_success}}</p>
									<div>
										<span>昨日全天：{{last_success}}  累计：{{success}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="spin-content" v-if="type == 1">
							<div class="single-accout-card">
								<div class="single-accout-cardItem account-type">
									<span>
										今日新添加好友
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">添加员工企业微信的好友数量</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_new_add}}</p>
									<div>
										<span>昨日全天：{{last_add}}  累计：{{new_add}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日流失好友
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">添加完后，今日又删除企业微信好友的数量</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_lose_fans}}</p>
									<div>
										<span>昨日全天：{{last_lose_fans}}  累计：{{lose_fans}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日好友留存率
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">（今日新添加好友数 - 今日流失好友数）/ 今日新添加好友数</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_keep}}%</p>
									<div>
										<span>昨日全天：{{last_keep}}%  累计：{{keep}}%</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日完成任务
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日参与人中完成任务的人数</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_success}}</p>
									<div>
										<span>昨日全天：{{last_success}}  累计：{{success}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="spin-content" v-if="type == 2">
							<div class="single-accout-card">
								<div class="single-accout-cardItem account-type">
									<span>
										今日新增粉丝
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日参加活动且首次新关注的粉丝（在今日前，关注再取关，然后在今日再关注，不计入）</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_new_fans}}</p>
									<div>
										<span>昨日全天：{{new_last_fans}}  累计：{{new_fans}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日净增新粉丝
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日新增粉丝 - 今日取关新粉丝</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_participation}}</p>
									<div>
										<span>昨日全天：{{last_participation}}  累计：{{participation}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日参与人
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日生成了自己的专属海报即算参与人。</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{net_now_fans}}</p>
									<div>
										<span>昨日全天：{{net_last_fans}}  累计：{{net_fans}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日取关新粉丝
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日参加活动且首次新关注再取关的粉丝（在今日前，关注再取关，然后在今日关注再取消，不计入）</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_not_day}}</p>
									<div>
										<span>昨日全天：{{last_now_not_day}}  累计：{{not_day_count}}</span>
									</div>
								</div>
							</div>
							<div class="single-accout-card">
								<div class="single-accout-cardItem account-type">
									<span>
										今日新添加好友
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日通过公众号添加企业微信的好友数量</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_new_add}}</p>
									<div>
										<span>昨日全天：{{last_add}}  累计：{{new_add}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日流失好友
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">添加完后，今日又删除企业微信好友的数量</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_lose_fans}}</p>
									<div>
										<span>昨日全天：{{last_lose_fans}}  累计：{{lose_fans}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日好友留存率
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">（今日新添加好友数 - 今日流失好友数）/ 今日新添加好友数</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_keep}}%</p>
									<div>
										<span>昨日全天：{{last_keep}}%  累计：{{keep}}%</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>
										今日完成任务
										<a-tooltip placement="top">
						                    <template slot="title">
							                    <div style="width: 240px;">
							                        <p style="margin-bottom: 0;line-height: 25px;">今日参与人中完成任务的人数</p>
							                    </div>
						                    </template>
						                    <a-icon type="question-circle"
						                            style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{now_success}}</p>
									<div>
										<span>昨日全天：{{last_success}}  累计：{{success}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="card-filter-contain">
							<template>
								<a-tabs @change="changeTab" type="card"
								        style="background-color: #FFF;">
									<a-tab-pane tab="任务趋势" key="1">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div style="margin-left: 5px;"
													     class="day-picker-contain picker-contain">
														<a-button :class="timeType== '0'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType1(0)">
															按时
														</a-button>
														<a-range-picker
																:allowClear='false'
																:disabledDate="disabledDateHours"
																:defaultValue="[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType=='0'"
																v-model="HourDate"
																@change="changeFansHourTime1"
														/>
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
												</div>
											</div>
											<div class="fans-data-trend">
												<LineCharts v-if="tabKey == 1 && fansAdd.seriesData.length > 0"
												            :options="fansAdd" style="width:100%;"
												>
												</LineCharts>
												<a-empty v-show="tabKey == 1 && fansAdd.seriesData.length == 0"
												         style="margin-top: 30px;">
													<span slot="description" style="color: #999;">暂无趋势图</span>
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
															:columns="type == 2 ? fansTable.columns2 : (type == 1 ? fansTable.columns1 : fansTable.columns)"
															:dataSource="fansTable.list"
															:rowClassName="rowClassName"
															:pagination="false">
														<span slot="new_fans">
															新增粉丝
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">参加活动且首次新关注的粉丝（在活动前，关注再取关，然后在活动期间再关注，不计入）</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="participation">
															净增新粉丝
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">新增粉丝 - 取关新粉丝</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="now_not_day">
															取关新粉丝
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">参加活动且首次新关注再取关的粉丝（在活动前，关注再取关，然后在活动期间关注再取消，不计入）</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="net_fans">
															参与人
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">生成了自己的专属海报即算参与人。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="success">
															完成任务
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">参与人中完成任务的人数</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="new_add">
															新添加好友
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                         <p v-if="type == 1" style="margin-bottom: 0;line-height: 25px;">添加员工企业微信的好友数量</p>
												                        <p v-if="type == 2" style="margin-bottom: 0;line-height: 25px;">通过公众号添加企业微信的好友数量</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="lose_fans">
															流失好友
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">添加完后，又删除企业微信好友的数量</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="keep">
															好友留存率（%）
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">（新添加好友数 - 流失好友数）/ 新添加好友数</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
															</a-tooltip>
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
									<a-tab-pane tab="运营指标" key="2">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div style="margin-left: 5px;"
													     class="day-picker-contain picker-contain">
														<a-button :class="timeType2== '0'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType2(0)">
															按时
														</a-button>
														<a-range-picker
																:allowClear='false'
																:disabledDate="disabledDateHours"
																:defaultValue="[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType2=='0'"
																v-model="HourDate2"
																@change="changeFansHourTime2"
														/>
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
												</div>
											</div>
											<div class="fans-data-trend">
												<div>
													<label>
														活动完成详情
													</label>
													<!--													<div style="cursor: pointer;text-align: center;">-->
													<!--														<a-radio-group v-model="fansAdd2Pie.level"-->
													<!--														               @change="changeDateType" button-style="solid">-->
													<!--															<a-radio-button :value="0">-->
													<!--																全部-->
													<!--															</a-radio-button>-->
													<!--															<a-radio-button :value="1">-->
													<!--																一阶-->
													<!--															</a-radio-button>-->
													<!--															<a-radio-button :value="2">-->
													<!--																二阶-->
													<!--															</a-radio-button>-->
													<!--															<a-radio-button :value="3">-->
													<!--																三阶-->
													<!--															</a-radio-button>-->
													<!--														</a-radio-group>-->
													<!--													</div>-->
													<PieCharts
															v-if="tabKey == 2"
															:options="fansAdd2Pie"
													>
													</PieCharts>
												</div>
												<div>
													<label>活动裂变层级统计</label>
													<BarCharts v-if="tabKey == 2 && fansAdd2.seriesData.length > 0"
													           style="width:100%;" :options="fansAdd2">
													</BarCharts>
													<a-empty v-show="tabKey == 2 && fansAdd2.seriesData.length == 0"
													         style="margin-top: 30px;">
														<span slot="description" style="color: #999;">暂无统计</span>
													</a-empty>
												</div>
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
													<a-table :columns="type == 2 ? fansTable2.columns2 : (type == 1 ? fansTable2.columns1 : fansTable2.columns)" :dataSource="fansTable2.list"
													         :rowClassName="rowClassName"
													         :pagination="false">
														<span slot="userFansCount">
															参与未推广
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">邀请人数=0。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="userFans">
															推广未完成
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">0&lt邀请人数&ltN，N为一阶任务目标。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="successUserFans">
															完成任务
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">邀请人数≥N，N为一阶任务目标。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="accumulated">
															累计参与
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">生成了自己的专属海报即算参与人。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="success_people">
															任务完成率（%）
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">完成任务人数 / 累计参与人数。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="band_new">
															带新系数（%）
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">本次活动新关注 / 累计参与人数  该值越大代表活动拉新效果越好。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="new_fans">
															新关注粉丝
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">参加活动且首次新关注的粉丝（在活动前，关注再取关，然后在活动期间再关注，不计入）。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="now_not_day">
															取关新粉丝
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">参加活动且首次新关注再取关的粉丝（在活动前，关注再取关，然后在活动期间关注再取消，不计入）。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="participation">
															净增新粉丝
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">新增粉丝-取关新粉丝。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="cancel">
															新粉丝取关率（%）
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">取关新粉丝 / 新关注粉丝。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="new_cancel">
															新粉丝占比（%）
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">新关注粉丝 / 累计参与。</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="new_add">
															新添加好友
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p v-if="type == 1" style="margin-bottom: 0;line-height: 25px;">添加员工企业微信的好友数量</p>
												                        <p v-if="type == 2" style="margin-bottom: 0;line-height: 25px;">通过公众号添加企业微信的好友数量</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="lose_fans">
															流失好友
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
													                    <p style="margin-bottom: 0;line-height: 25px;">添加完后，又删除企业微信好友的数量</p>
												                    </div>
											                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
											                  </a-tooltip>
														</span>
														<span slot="keep">
															好友留存率（%）
															<a-tooltip placement="top">
											                    <template slot="title">
												                    <div style="width: 240px;">
												                        <p style="margin-bottom: 0;line-height: 25px;">（新添加好友数-流失好友数）/ 新添加好友数。</p>
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
								</a-tabs>
							</template>
						</div>
					</div>
				</div>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import LineCharts from '@/components/echarts/LineCharts'
	import BarCharts from '@/components/echarts/BarCharts'
	import PieCharts from '@/components/echarts/PieCharts'
	import moment from 'moment'


	export default {
		name      : 'HomeLeftContain',
		components: {
			LineCharts,
			BarCharts,
			PieCharts,
		},
		data () {
			return {
				spinning          : false,
				title             : '',
				type              : 0,
				now_new_fans      : 0, // 今日新增粉丝
				now_participation : 0, // 今日净增
				net_now_fans      : 0, // 今日参与
				now_not_day       : 0, // 今日取关
				now_new_add       : 0, // 今日新加
				now_lose_fans     : 0, // 今日流失
				now_keep          : 0, // 今日留存
				now_success       : 0, // 今日完成
				last_now_not_day  : 0, // 昨日取关
				not_day_count     : 0, // 累计取关
				new_fans          : 0, // 新增粉丝
				new_last_fans     : 0, // 昨日新增粉丝
				new_add           : 0, // 新增好友
				last_add          : 0, // 昨日新增好友
				lose_fans         : 0, // 昨日流失好友
				last_lose_fans    : 0, // 流失好友
				success           : 0, // 完成任务
				last_success      : 0, // 昨日完成任务
				participation     : 0, // 净增
				last_participation: 0, // 昨日净增
				keep              : 0, // 留存率
				last_keep         : 0, // 昨日留存率
				net_fans          : 0, // 参与
				net_last_fans     : 0, // 昨日参与
				tabKey            : 1,
				/* 任务趋势 */
				fansAddTime       : {
					hs_date: moment().format('YYYY-MM-DD'),
					he_date: moment().format('YYYY-MM-DD'),
					ds_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
					de_date: moment().format('YYYY-MM-DD'),
					ws_date: moment().weekday(0).format('YYYY-MM-DD'),
					we_date: moment().weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week()
				},
				HourDate          : [moment(), moment()],
				dayDate           : [moment().subtract(6, 'days'), moment().subtract(0, 'days')],
				weekStart         : moment(),
				weekEnd           : moment(),
				s_week            : '',
				timeType          : 0,  //任务趋势tab时间类型选择
				// 任务趋势折线图
				fansAdd           : {
					title     : '',
					xAxisData : [],
					name      : '',
					seriesData: [],
					legendData: []
				},
				// 任务趋势表格
				fansTableList     : [],
				fansTable         : {
					columns2    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							// title    : "新增粉丝",
							dataIndex  : "new_fans",
							key        : "new_fans",
							scopedSlots: {title: "new_fans"}
						},
						{
							// title    : "净增新粉丝",
							dataIndex  : "participation",
							key        : "participation",
							scopedSlots: {title: "participation"}
						},
						{
							// title    : "取关新粉丝",
							dataIndex  : "now_not_day",
							key        : "now_not_day",
							scopedSlots: {title: "now_not_day"}
						},
						{
							// title    : "参与人",
							dataIndex  : "net_fans",
							key        : "net_fans",
							scopedSlots: {title: "net_fans"}
						},
						{
							// title    : "完成任务",
							dataIndex  : "success",
							key        : "success",
							scopedSlots: {title: "success"}
						},
						{
							// title    : "新添加好友",
							dataIndex  : "new_add",
							key        : "new_add",
							scopedSlots: {title: "new_add"}
						},
						{
							// title    : "流失好友",
							dataIndex  : "lose_fans",
							key        : "lose_fans",
							scopedSlots: {title: "lose_fans"}
						},
						{
							// title      : "好友留存率",
							dataIndex  : "keep",
							key        : "keep",
							scopedSlots: {title: "keep"}
						},
					],
					columns1    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							// title    : "参与人",
							dataIndex  : "net_fans",
							key        : "net_fans",
							scopedSlots: {title: "net_fans"}
						},
						{
							// title    : "完成任务",
							dataIndex  : "success",
							key        : "success",
							scopedSlots: {title: "success"}
						},
						{
							// title    : "新添加好友",
							dataIndex  : "new_add",
							key        : "new_add",
							scopedSlots: {title: "new_add"}
						},
						{
							// title    : "流失好友",
							dataIndex  : "lose_fans",
							key        : "lose_fans",
							scopedSlots: {title: "lose_fans"}
						},
						{
							// title      : "好友留存率",
							dataIndex  : "keep",
							key        : "keep",
							scopedSlots: {title: "keep"}
						},
					],
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							// title    : "新增粉丝",
							dataIndex  : "new_fans",
							key        : "new_fans",
							scopedSlots: {title: "new_fans"}
						},
						{
							// title    : "净增新粉丝",
							dataIndex  : "participation",
							key        : "participation",
							scopedSlots: {title: "participation"}
						},
						{
							// title    : "取关新粉丝",
							dataIndex  : "now_not_day",
							key        : "now_not_day",
							scopedSlots: {title: "now_not_day"}
						},
						{
							// title    : "参与人",
							dataIndex  : "net_fans",
							key        : "net_fans",
							scopedSlots: {title: "net_fans"}
						},
						{
							// title    : "完成任务",
							dataIndex  : "success",
							key        : "success",
							scopedSlots: {title: "success"}
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 运营指标 */
				wheelFlag2          : true,
				fansAddTime2        : {
					hs_date: moment().format("YYYY-MM-DD"),
					he_date: moment().format("YYYY-MM-DD"),
					ds_date: moment().subtract(6, 'days').format('YYYY-MM-DD'),
					de_date: moment().format('YYYY-MM-DD'),
					ws_date: moment().weekday(0).format('YYYY-MM-DD'),
					we_date: moment().weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week()
				},
				HourDate2           : [moment(), moment()],
				dayDate2            : [moment().subtract(6, 'days'), moment()],
				weekStart2          : moment(),
				weekEnd2            : moment(),
				s_week2             : '',
				timeType2           : 0,  //运营指标tab时间类型选择
				// 运营指标折线图
				fansAdd2            : {
					title     : '',
					legendData: [],
					xAxisData : [],
					seriesData: []
				},
				fansAdd2Pie         : {
					level     : 0,
					title     : '',
					formatter : "{b} {c} 占比 {d}%",
					seriesData: [{value: 0, name: "参与未推广"},
						{value: 0, name: "推广未完成"},
						{value: 0, name: "已完成"},
					]
				},
				// 运营指标表格
				fansTableList2      : [],
				fansTable2          : {
					columns2    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							// title      : "参与未推广",
							dataIndex  : "userFansCount",
							key        : "userFansCount",
							scopedSlots: {title: "userFansCount"}
						},
						{
							// title      : "推广未完成",
							dataIndex  : "userFans",
							key        : "userFans",
							scopedSlots: {title: "userFans"}
						},
						{
							// title      : "完成任务",
							dataIndex  : "successUserFans",
							key        : "successUserFans",
							scopedSlots: {title: "successUserFans"}
						},
						{
							// title    : "累计参与",
							dataIndex  : "accumulated",
							key        : "accumulated",
							scopedSlots: {title: "accumulated"}
						},
						{
							// title      : "任务完成率",
							dataIndex  : "success_people",
							key        : "success_people",
							scopedSlots: {title: "success_people"}
						},
						{
							// title      : "带新系数",
							dataIndex  : "band_new",
							key        : "band_new",
							scopedSlots: {title: "band_new"}
						},
						{
							// title    : "新关注粉丝",
							dataIndex  : "new_fans",
							key        : "new_fans",
							scopedSlots: {title: "new_fans"}
						},
						{
							// title    : "取关新粉丝",
							dataIndex  : "now_not_day",
							key        : "now_not_day",
							scopedSlots: {title: "now_not_day"}
						},
						{
							// title    : "净增新粉丝",
							dataIndex  : "participation",
							key        : "participation",
							scopedSlots: {title: "participation"}
						},
						{
							// title    : "新粉丝取关率",
							dataIndex  : "cancel",
							key        : "cancel",
							scopedSlots: {title: "cancel"}
						},
						{
							// title    : "新粉丝占比",
							dataIndex  : "new_cancel",
							key        : "new_cancel",
							scopedSlots: {title: "new_cancel"}
						},
						{
							// title      : "新添加好友",
							dataIndex  : "new_add",
							key        : "new_add",
							scopedSlots: {title: "new_add"}
						},
						{
							// title      : "流失好友",
							dataIndex  : "lose_fans",
							key        : "lose_fans",
							scopedSlots: {title: "lose_fans"}
						},
						{
							// title    : "好友留存率",
							dataIndex  : "keep",
							key        : "keep",
							scopedSlots: {title: "keep"}
						},
					],
					columns1    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							// title      : "参与未推广",
							dataIndex  : "userFansCount",
							key        : "userFansCount",
							scopedSlots: {title: "userFansCount"}
						},
						{
							// title      : "推广未完成",
							dataIndex  : "userFans",
							key        : "userFans",
							scopedSlots: {title: "userFans"}
						},
						{
							// title      : "完成任务",
							dataIndex  : "successUserFans",
							key        : "successUserFans",
							scopedSlots: {title: "successUserFans"}
						},
						{
							// title    : "累计参与",
							dataIndex  : "accumulated",
							key        : "accumulated",
							scopedSlots: {title: "accumulated"}
						},
						{
							// title      : "任务完成率",
							dataIndex  : "success_people",
							key        : "success_people",
							scopedSlots: {title: "success_people"}
						},
						{
							// title      : "新添加好友",
							dataIndex  : "new_add",
							key        : "new_add",
							scopedSlots: {title: "new_add"}
						},
						{
							// title      : "流失好友",
							dataIndex  : "lose_fans",
							key        : "lose_fans",
							scopedSlots: {title: "lose_fans"}
						},
						{
							// title    : "好友留存率",
							dataIndex  : "keep",
							key        : "keep",
							scopedSlots: {title: "keep"}
						},
					],
					columns    : [
						{
							title    : "时间",
							dataIndex: "time",
							key      : "time",
						},
						{
							// title      : "参与未推广",
							dataIndex  : "userFansCount",
							key        : "userFansCount",
							scopedSlots: {title: "userFansCount"}
						},
						{
							// title      : "推广未完成",
							dataIndex  : "userFans",
							key        : "userFans",
							scopedSlots: {title: "userFans"}
						},
						{
							// title      : "完成任务",
							dataIndex  : "successUserFans",
							key        : "successUserFans",
							scopedSlots: {title: "successUserFans"}
						},
						{
							// title    : "累计参与",
							dataIndex  : "accumulated",
							key        : "accumulated",
							scopedSlots: {title: "accumulated"}
						},
						{
							// title      : "任务完成率",
							dataIndex  : "success_people",
							key        : "success_people",
							scopedSlots: {title: "success_people"}
						},
						{
							// title      : "带新系数",
							dataIndex  : "band_new",
							key        : "band_new",
							scopedSlots: {title: "band_new"}
						},
						{
							// title    : "新关注粉丝",
							dataIndex  : "new_fans",
							key        : "new_fans",
							scopedSlots: {title: "new_fans"}
						},
						{
							// title    : "取关新粉丝",
							dataIndex  : "now_not_day",
							key        : "now_not_day",
							scopedSlots: {title: "now_not_day"}
						},
						{
							// title    : "净增新粉丝",
							dataIndex  : "participation",
							key        : "participation",
							scopedSlots: {title: "participation"}
						},
						{
							// title    : "新粉丝取关率",
							dataIndex  : "cancel",
							key        : "cancel",
							scopedSlots: {title: "cancel"}
						},
						{
							// title    : "新粉丝占比",
							dataIndex  : "new_cancel",
							key        : "new_cancel",
							scopedSlots: {title: "new_cancel"}
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
			this.title = decodeURIComponent(this.$route.query.title)
			this.type = this.$route.query.type
			this.initPage()
		},
		methods   : {
			goBack () {
				if (localStorage.getItem('type') == 1) {
					this.$router.push("/wholeMarket/fissionList?isRefresh=1")
				} else {
					this.$router.push("/wholeMarket/fissionList1?isRefresh=1")
				}
			},
			initPage () {
				this.getFansTop()
				this.get1(0)
			},
			// 总览
			async getFansTop () {
				const {data: res} = await this.axios.post("work-activity-public/activity-statistics", {
					activity_id: this.$route.query.id
				});
				if (res.error == 0) {
					this.now_new_fans = res.data.now_new_fans
					this.now_participation = res.data.now_participation
					this.net_now_fans = res.data.net_now_fans
					this.now_new_add = res.data.now_new_add
					this.now_lose_fans = res.data.now_lose_fans
					this.now_keep = res.data.now_keep
					this.now_success = res.data.now_success
					this.now_not_day = res.data.now_not_day
					this.last_now_not_day = res.data.last_now_not_day
					this.not_day_count = res.data.not_day_count
					this.new_fans = res.data.new_fans
					this.new_last_fans = res.data.new_last_fans
					this.new_add = res.data.new_add
					this.last_add = res.data.last_add
					this.lose_fans = res.data.lose_fans
					this.last_lose_fans = res.data.last_lose_fans
					this.success = res.data.success
					this.last_success = res.data.last_success
					this.participation = res.data.participation
					this.last_participation = res.data.last_participation
					this.keep = res.data.keep
					this.last_keep = res.data.last_keep
					this.net_fans = res.data.net_fans
					this.net_last_fans = res.data.net_last_fans
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

			changeSearchType () {
				this.get1(0)
			},
			// 任务趋势
			async get1 (is_export) {
				this.spinning = true
				let s_date = ''
				let e_date = ''
				if (this.timeType == 0) {
					s_date = this.fansAddTime.hs_date
					e_date = this.fansAddTime.he_date
					this.hourDate = [moment(this.fansAddTime.hs_date), moment(this.fansAddTime.he_date)]
				} else if (this.timeType == 1) {
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
					activity_id: this.$route.query.id,
					start_time : s_date,
					end_time   : e_date,
					s_week     : this.fansAddTime.ws_week,
					type       : this.timeType,
					is_export  : is_export,
				}
				const {data: res} = await this.axios.post("work-activity-public/activity-statistics-day", params);
				if (res.error == 0) {
					if (is_export != 1) {
						that.fansAdd.seriesData = res.data.seriesData
						that.fansAdd.xAxisData = res.data.xData
						that.fansAdd.legendData = res.data.legData
						that.fansTableList = res.data.wayData.reverse()
						let table = that.getPageData(that.fansTableList, that.fansTable.page, that.fansTable.pageSize)
						that.fansTable.list = table.list
						that.fansTable.total = that.fansTableList.length
						that.fansTable.page = table.page
					} else {
						window.open(res.data.url);
					}
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}
			},
			// 运营指标完成情况
			async get2 () {
				this.spinning = true
				let that = this
				let s_date = ''
				let e_date = ''
				let s_week = ''
				s_date = this.fansAddTime2.ds_date
				e_date = this.fansAddTime2.de_date
				this.dayDate2 = [moment(this.fansAddTime2.ds_date), moment(this.fansAddTime2.de_date)]
				if (this.timeType2 == 0) {
					s_date = this.fansAddTime2.hs_date
					e_date = this.fansAddTime2.he_date
				} else if (this.timeType2 == 2) {
					s_date = this.fansAddTime2.ws_date
					e_date = this.fansAddTime2.we_date
				}
				s_week = this.fansAddTime2.ws_week
				let params = {
					s_date     : s_date,
					e_date     : e_date,
					s_week     : s_week,
					type       : this.timeType2,
					level      : this.fansAdd2Pie.level,
					activity_id: this.$route.query.id
				}
				const {data: res} = await this.axios.post("work-activity-public/activity-statistics-indicator", params);
				if (res.error == 0) {
					this.fansAdd2Pie.seriesData = res.data
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}

			},
			// 运营指标完成情况
			async get3 () {
				this.spinning = true
				let that = this
				let s_date = ''
				let e_date = ''
				let s_week = ''
				s_date = this.fansAddTime2.ds_date
				e_date = this.fansAddTime2.de_date
				this.dayDate2 = [moment(this.fansAddTime2.ds_date), moment(this.fansAddTime2.de_date)]
				if (this.timeType2 == 0) {
					s_date = this.fansAddTime2.hs_date
					e_date = this.fansAddTime2.he_date
				} else if (this.timeType2 == 2) {
					s_date = this.fansAddTime2.ws_date
					e_date = this.fansAddTime2.we_date
				}
				s_week = this.fansAddTime2.ws_week
				let params = {
					s_date     : s_date,
					e_date     : e_date,
					s_week     : s_week,
					type       : this.timeType2,
					activity_id: this.$route.query.id
				}
				const {data: res} = await this.axios.post("work-activity-public/activity-statistics-tier", params);
				if (res.error == 0) {
					this.fansAdd2.seriesData = res.data.seriesData
					this.fansAdd2.xAxisData = res.data.xData
					// this.fansAdd2.legendData = res.data.legendData
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}

			},
			// 运营指标完成情况
			async get4 (is_export) {
				this.spinning = true
				let that = this
				let s_date = ''
				let e_date = ''
				let s_week = ''
				s_date = this.fansAddTime2.ds_date
				e_date = this.fansAddTime2.de_date
				this.dayDate2 = [moment(this.fansAddTime2.ds_date), moment(this.fansAddTime2.de_date)]
				if (this.timeType2 == 0) {
					s_date = this.fansAddTime2.hs_date
					e_date = this.fansAddTime2.he_date
				} else if (this.timeType2 == 2) {
					s_date = this.fansAddTime2.ws_date
					e_date = this.fansAddTime2.we_date
				}
				s_week = this.fansAddTime2.ws_week
				let params = {
					s_date     : s_date,
					e_date     : e_date,
					s_week     : s_week,
					type       : this.timeType2,
					is_export  : is_export,
					activity_id: this.$route.query.id
				}
				const {data: res} = await this.axios.post("work-activity-public/activity-statistics-detail", params);
				if (res.error == 0) {
					if (is_export != 1) {
						this.fansTableList2 = res.data.reverse()
						let table = this.getPageData(this.fansTableList2, this.fansTable2.page, this.fansTable2.pageSize)
						this.fansTable2.total = this.fansTableList2.length
						this.fansTable2.list = table.list
						this.fansTable2.page = table.page

					} else {
						window.open(res.data.url);
					}
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}

			},
			// 任务趋势页码改变
			changeFansPage1 (val) {
				document.getElementsByClassName('scroll')[0].scrollTo(0, 750)
				let that = this
				that.fansTable.page = val
				let table = that.getPageData(that.fansTableList, that.fansTable.page, that.fansTable.pageSize)
				that.fansTable.list = table.list
				that.fansTable.page = table.page
			},
			// 任务趋势表格分页pageSize改变
			showFansSizeChange1 (page, pageSize) {
				document.getElementsByClassName('scroll')[0].scrollTo(0, 750)
				let that = this
				that.fansTable.pageSize = pageSize
				let table = that.getPageData(that.fansTableList, that.fansTable.page, that.fansTable.pageSize)
				that.fansTable.list = table.list
				that.fansTable.page = table.page
			},

			// 运营指标页码改变
			changeFansPage2 (val) {
				document.getElementsByClassName('scroll')[0].scrollTo(0, 1150)
				let that = this
				that.fansTable2.page = val
				let table = that.getPageData(that.fansTableList2, that.fansTable2.page, that.fansTable2.pageSize)
				that.fansTable2.list = table.list
				that.fansTable2.page = table.page
				if (this.fansTable2.list.length > 10) {
					this.wheelFlag2 = false
				}
			},
			// 运营指标表格分页pageSize改变
			showFansSizeChange2 (page, pageSize) {
				document.getElementsByClassName('scroll')[0].scrollTo(0, 1150)
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
				return current.valueOf() > new Date().getTime() || current < moment().subtract(30, "days");
			},
			disabledDateWeek (current) {
				let weekOfday = moment(new Date()).format('E')
				return current.valueOf() > moment(new Date()) || current < moment().subtract(365, "days");
			},

			// 任务趋势时间类型切换
			changeFansTimeType1 (type) {
				if (this.timeType != type) {
					this.spinning = true
					this.timeType = type;
					this.get1(0)
				}
			},
			changeFansHourTime1 (date, dateString) {
				this.spinning = true
				if (this.timeType == 0) {
					this.fansAddTime.hs_date = dateString[0]
					this.fansAddTime.he_date = dateString[1]
				}
				this.get1(0)
			},
			// 任务趋势时间值
			changeFansTime1 (date, dateString) {
				this.spinning = true
				if (this.timeType == 1) {
					this.fansAddTime.ds_date = dateString[0]
					this.fansAddTime.de_date = dateString[1]
				}
				this.get1(0)
			},
			// 任务趋势改变起始周
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
			// 任务趋势改变结束周
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
			// 任务趋势表格导出
			exportFansIncrease1 () {
				this.get1(1)
			},

			changeSearchType2 () {
				this.get2()
				this.get3()
				this.get4(0)

			},
			// 运营指标时间类型切换
			changeFansTimeType2 (type) {
				if (this.timeType2 != type) {
					this.spinning = true
					this.timeType2 = type;
					this.get2()
					this.get3()
					this.get4(0)
				}

			},
			changeFansHourTime2 (date, dateString) {
				this.spinning = true
				if (this.timeType2 == 0) {
					this.fansAddTime2.hs_date = dateString[0]
					this.fansAddTime2.he_date = dateString[1]
				}
				this.get2()
				this.get3()
				this.get4(0)
			},
			// 运营指标时间值
			changeFansTime2 (date, dateString) {
				this.spinning = true
				if (this.timeType2 == 1) {
					this.fansAddTime2.ds_date = dateString[0]
					this.fansAddTime2.de_date = dateString[1]
				}
				this.get2()
				this.get3()
				this.get4(0)
			},
			//  运营指标改变起始周
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
				this.get2()
				this.get3()
				this.get4(0)
			},
			//  运营指标改变结束周
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
				this.get2()
				this.get3()
				this.get4(0)
			},
			changeDateType (e) {
				this.fansAdd2Pie.level = e.target.value
				this.get2()
			},
			//  运营指标表格导出
			exportFansIncrease2 () {
				this.get4(1)
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
					this.get2()
					this.get3()
					this.get4(0)
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

	.tabs-contain {
		padding: 0px 8px 0px 20px;
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
		border-right: 1px solid #01b065;
		background: #01b065;
		border-radius: 0;
		color: #FFF;
	}

	.fansgrow-contain .card-caledar .picker-contain button {
		margin: 0px 0px 0px 5px;
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

	.fans-active-avg span {
		display: inline-block;
		width: 14.28%;
		padding: 16px;
	}

	.card-filter-contain p span {
		color: #FF562D;
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

	.fans-type button, .loyalty-btn {
		padding: 3px 6px;
		background-color: #FFF;
		border: 1px solid #D8D8D8;
		cursor: pointer;
		outline: none;
	}

	/deep/ .ant-radio-button-wrapper {
		margin: 0;
		width: 60px;
	}
</style>
