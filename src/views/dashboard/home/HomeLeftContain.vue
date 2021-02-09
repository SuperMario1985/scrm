<template>
	<!--	首页（内容+滚动条）	-->
	<div class="spin-content" ref="scroll" @mousewheel="scrollWheel"
	     style="width: 100%; height: 100%;overflow: hidden;"
	     @mouseover="scroll" @mouseout="scrollOut" @mousemove="scroLineMove" @mouseup="scroLineUp">
		<!--	页面内容    -->
		<div ref="scroLeft" class="home-left-contain">
			<a-spin :spinning="spinning" tip="Loading..." size="large"
			        :class="spinning?'spinning-true':'spinning-false'">
				<!-- <div style="padding:20px;">
					<div class="measure#FFFrview">
						<div class="card-title">
							<p style="margin-top: -5px;">
								指标总览
							</p>
							<span>（所有认证号昨日指标）</span>
							<div class="card-title-right">
								 <div >
								<a-tooltip placement="top">
									<template slot="title">
										<span>一键导出所有认证号昨日指标数据</span>
									</template>
									<a-button>
										<a-icon type="download" style='vertical-align: middle;'/>
										导出数据
									</a-button>
								</a-tooltip>
								 </div>
							</div>
						</div>
							<div class="spin-content">
								<div class="card-items-contain">
									<div class="card-item">
										<p class="card-item-name">昨日新增</p>
										<p class="card-item-Numerical" style="color: rgb(255, 86, 45);">
											{{totalIndicatorsData.add.num}}</p>
										<div class="card-item-rate">
											<span>比前日</span>
											<img v-if="totalIndicatorsData.add.ratio<0"
												 src="../../../assets/home/img/arrowdown.png"/>
											<img v-if='totalIndicatorsData.add.ratio>=0'
												 src="../../../assets/home/img/arrowup.png"/>
											<span>{{Math.abs(totalIndicatorsData.add.ratio)}}%</span>
										</div>
									</div>
									<div class="card-item">
										<p class="card-item-name">昨日取关</p>
										<p class="card-item-Numerical" style="color: rgb(59, 116, 255);">
											{{totalIndicatorsData.takeOff.num}}</p>
										<div class="card-item-rate">
											<span>比前日</span>
											<img v-if="totalIndicatorsData.takeOff.ratio<0"
												 src="../../../assets/home/img/arrowdown.png"/>
											<img v-if='totalIndicatorsData.takeOff.ratio>=0'
												 src="../../../assets/home/img/arrowup.png"/>
											<span>{{Math.abs(totalIndicatorsData.takeOff.ratio)}}%</span>
										</div>
									</div>
									<div class="card-item">
										<p class="card-item-name">昨日净增</p>
										<p class="card-item-Numerical" style="color: rgb(59, 116, 255);">
											{{totalIndicatorsData.net.num}}</p>
										<div class="card-item-rate">
											<span>比前日</span>
											<img v-if="totalIndicatorsData.net.ratio<0"
												 src="../../../assets/home/img/arrowdown.png"/>
											<img v-if='totalIndicatorsData.net.ratio>=0'
												 src="../../../assets/home/img/arrowup.png"/>
											<span>{{Math.abs(totalIndicatorsData.net.ratio)}}%</span>
										</div>
									</div>
									<div class="card-item">
										<p class="card-item-name">昨日活跃</p>
										<p class="card-item-Numerical" style="color: rgb(255, 86, 45);">
											{{totalIndicatorsData.active.num}}</p>
										<div class="card-item-rate">
											<span>比前日</span>
											<img v-if="totalIndicatorsData.active.ratio<0"
												 src="../../../assets/home/img/arrowdown.png"/>
											<img v-if='totalIndicatorsData.active.ratio>=0'
												 src="../../../assets/home/img/arrowup.png"/>
											<span>{{Math.abs(totalIndicatorsData.active.ratio)}}%</span>
										</div>
									</div>
									<div class="card-item">
										<p class="card-item-name">总粉丝</p>
										<p class="card-item-Numerical" style="color: rgb(59, 116, 255);">
											{{totalIndicatorsData.fansTotal.num}}</p>
										<div class="card-item-rate">
											<span>比前日</span>
											<img v-if="totalIndicatorsData.fansTotal.ratio<0"
												 src="../../../assets/home/img/arrowdown.png"/>
											<img v-if='totalIndicatorsData.fansTotal.ratio>=0'
												 src="../../../assets/home/img/arrowup.png"/>
											<span>{{Math.abs(totalIndicatorsData.fansTotal.ratio)}}%</span>
										</div>
									</div>
								</div>
							</div>
					</div>
				</div> -->
				<div class="tabs-contain" style="margin-top: 20px">
					<div class="account-filter" style="overflow:hidden;" v-if="wxList && wxList.length > 0">
						<a-tabs class="wx-list-tab" type="card" v-model="wxId" @change="handleChange"
						        style="width: 100%;">
							<a-tab-pane v-for="(item, index) in wxList" :key="item.wx_id">
								<div slot="tab" class="tabBox">
									<a-tooltip placement="top">
										<template slot="title">
											<span>{{item.nick_name}}</span>
										</template>
										<a-avatar :size="24" shape="square" :src="item.head_img"/>
										{{item.nick_name}}
									</a-tooltip>
								</div>
							</a-tab-pane>
							<template slot="tabBarExtraContent">
								<a-select
										showSearch
										placeholder="搜索公众号"
										optionFilterProp="children"
										style="width: 223px; margin-right: 10px; margin-top: 8px;"
										@change="handleChange"
										:filterOption="filterOption" allowClear
								>
									<a-select-option v-for="d in wxList" :value="d.wx_id">{{d.nick_name}}
									</a-select-option>
								</a-select>
							</template>
						</a-tabs>
					</div>
					<div style="background-color: #FFF;text-align: center;padding-top: 20px;" v-if="wxList.length == 0">
						<p style="font-weight: 700;font-size: 18px;margin-top: 10px;">尚未授权已认证的公众号，该功能无法使用</p>
						<p style="font-size: 16px;color: #999999;">请点击下方授权按钮前往授权</p>
						<a-button type="primary" class="btn" @click="addAccount">立即授权</a-button>
						<authorize :show="showWxModal" @cancel="cancel"></authorize>
					</div>
					<div class="single-account-contain" v-has="'operationCenter'">
						<div class="spin-content">
							<div class="single-accout-card">
								<div class="single-accout-cardItem account-type">
									<span>昨日新增</span>
									<p style="color: rgb(255, 86, 45);">{{storeIndicatorsData.one.count}}</p>
									<div>
										<span>比前日</span>
										<img v-if="storeIndicatorsData.one.status==0"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='storeIndicatorsData.one.status==1'
										     src="../../../assets/home/img/arrowup.png"/>
										<span>{{storeIndicatorsData.one.per}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>昨日取关</span>
									<p style="color: rgb(59, 116, 255);">{{storeIndicatorsData.two.count}}</p>
									<div>
										<span>比前日</span>
										<img v-if="storeIndicatorsData.two.status==0"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='storeIndicatorsData.two.status==1'
										     src="../../../assets/home/img/arrowup.png"/>
										<span>{{storeIndicatorsData.two.per}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>昨日净增</span>
									<p style="color: rgb(59, 116, 255);">{{storeIndicatorsData.three.count}}</p>
									<div>
										<span>比前日</span>
										<img v-if="storeIndicatorsData.three.status==0"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='storeIndicatorsData.three.status==1'
										     src="../../../assets/home/img/arrowup.png"/>
										<span>{{storeIndicatorsData.three.per}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>昨日活跃</span>
									<p style="color: rgb(255, 86, 45);">{{storeIndicatorsData.four.count}}</p>
									<div>
										<span>比前日</span>
										<img v-if="storeIndicatorsData.four.status==0"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='storeIndicatorsData.four.status==1'
										     src="../../../assets/home/img/arrowup.png"/>
										<span>{{storeIndicatorsData.four.per}}</span>
									</div>
								</div>
								<div class="single-accout-cardItem account-type">
									<span>昨日总粉丝</span>
									<p style="color: rgb(59, 116, 255);">{{storeIndicatorsData.five.count}}</p>
									<div>
										<span>比前日</span>
										<img v-if="storeIndicatorsData.five.status==0"
										     src="../../../assets/home/img/arrowdown.png"/>
										<img v-if='storeIndicatorsData.five.status==1'
										     src="../../../assets/home/img/arrowup.png"/>
										<span>{{storeIndicatorsData.five.per}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="card-filter-contain">
							<template>
								<a-tabs @change="changeTab" type="card"
								        style="background-color: #FFF;">
									<a-tab-pane tab="粉丝增长" key="1">
										<div class="fansgrow-contain">
											<div class="all-card-calendar">
												<div class="card-caledar">
													<div class="hour-picker-contain picker-contain">
														<a-button :class="timeType== '1'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType(1)">
															按时
														</a-button>
														<a-range-picker
																:allowClear='false'
																:disabledDate="disabledDateHours"
																:defaultValue="[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-if="timeType=='1'"
																@change="changeFansTime"

														/>
													</div>
													<div class="day-picker-contain picker-contain">
														<a-button :class="timeType== '2'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType(2)">
															按日
														</a-button>
														<a-range-picker
																:allowClear='false'
																:disabledDate="disabledDateDay"
																:defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
																format="YYYY-MM-DD"
																v-model='dayDate'
																v-if="timeType=='2'"
																@change="changeFansTime"
														/>
													</div>
													<div class="week-picker-contain picker-contain">
														<a-button :class="timeType== '3'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType(3)">
															按周
														</a-button>
														<a-week-picker
																:allowClear='false'
																:value='weekStart'
																:disabledDate="disabledDateWeek"
																v-if="timeType=='3'"
																@change="changeFansStartWeek"
														/>
														<a-week-picker
																:allowClear='false'
																:value='weekEnd'
																:disabledDate="disabledDateWeek"
																v-if="timeType=='3'"
																@change="changeFansEndWeek"
														/>
													</div>
													<div class="month-picker-contain picker-contain">
														<a-button :class="timeType== '4'? 'caledar-btn-selected': '' "
														          @click="changeFansTimeType(4)">
															按月
														</a-button>
													</div>
												</div>
											</div>
											<div class="card-caledar down-text" style="border-top: 0px;">
												<p>这段时间里，共有
													<span class="color-red">{{fans_stat.fans_new}}</span>
													人新关注，
													<span class="color-red">{{fans_stat.fans_cancel}}</span>
													人取关，取关率
													<span class="color-red">{{fans_stat.cancel_per}}</span>
													，净增长
													<span class="color-red">{{fans_stat.fans_increase}}</span>
													人，平均每天增长
													<span class="color-red">{{fans_stat.perDay}}</span>
													人
												</p>
												<a-tooltip placement="top">
													<template slot="title">
														<span>取关率=取消关注粉丝数/(总粉丝数+取消关注粉丝数）</span>
													</template>
													<a-icon type="question-circle"/>
												</a-tooltip>
											</div>
											<div class="fans-data-trend">
												<LineCharts v-if="tabKey == 1"
												            :options="fansAdd" style="width:100%;"
												>
												</LineCharts>
											</div>
											<div class="fans-data-detail">
												<div class="title-contain">
													<p>详细数据</p>
													<a-button @click="exportFansIncrease" type="primary"
													          icon="download">
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
															              @change="changeFansPage"
															              @showSizeChange="showFansSizeChange"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="粉丝属性" key="2">
										<div class="fansAttribute">
											<div class="card-attention" v-if="fansAttrModule.length > 0">
												<a-icon type="question-circle"
												        style="font-size: 14px;color: #AAA;margin-right: 8px;"/>
												观察新增粉丝来源，可以总结出最为有效的粉丝增量渠道，使用
												<span>
														<router-link :to='item.url'
														             v-for="item in fansAttrModule">【{{item.title}}】</router-link>
													</span>功能，更精细地利用关注场景。
											</div>
											<div class="fans-type">
												<button :class="fansAttrType?'fans-type-selected' : ''"
												        @click="changeFansAttrType(true)">
													新增粉丝
												</button>
												<button :class="!fansAttrType?'fans-type-selected' : ''"
												        @click="changeFansAttrType(false)">
													全部粉丝
												</button>
											</div>
											<div class="sec-card-caledar" v-show="fansAttrType">
												<a-range-picker style="width: 240px;"
												                :allowClear='false'
												                :disabledDate="disabledDateDay"
												                :defaultValue="[moment(moment().subtract(8, 'days'), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
												                format="YYYY-MM-DD"
												                @change="changeFansAttrTime"
												/>
											</div>
											<div v-show="fansAttrType" class="sec-card-caledar down-text"
											     style="border-top: 0px;">
												<p style="margin-bottom: 0px;">这段时间里，新增粉丝
													<span>{{fansAttr.fans_count}}</span>
													人，男粉丝
													<span>{{fansAttr.fans_male}}</span>
													人，占比
													<span>{{fansAttr.fans_male_per}}</span>
													, 女粉丝
													<span>{{fansAttr.fans_female}}</span>
													人，占比
													<span>{{fansAttr.fans_female_per}}</span>
												</p>
											</div>
											<div class="fans-source">
												<div class="fans-type" v-if="fansAttrType">
													<button :class="fansAttrAddSourceEChartsType?'fans-type-selected' : ''"
													        @click="changeFansAttrAddSourceEChartsType(true)">
														饼图
													</button>
													<button :class="!fansAttrAddSourceEChartsType?'fans-type-selected' : ''"
													        @click="changeFansAttrAddSourceEChartsType(false)">
														折线图
													</button>
												</div>
												<div v-if="fansAttrType && tabKey == 2">
													<PieCharts
															v-if="fansAttrAddSourceEChartsType"
															:options="fansAttrAddSourcePie"
													>
													</PieCharts>
													<LineCharts
															v-if="!fansAttrAddSourceEChartsType"
															:options="fansAttrAddSource"
													>
													</LineCharts>
												</div>
												<div v-if="!fansAttrType && tabKey == 2">
													<PieCharts
															:options="fansAttrAddSourcePie"
													>
													</PieCharts>
												</div>
											</div>
											<div class="detail-data-table">
												<div class="title-contain">
													<p class="title">详细数据</p>
													<a-button type="primary" @click="exportFansAttribute"
													          icon="download">
														导出数据
													</a-button>
												</div>
												<div class="content-bd" style="margin-top: 20px;">
													<a-table :columns="fansAddSourceTable.columns"
													         :dataSource="fansAddSourceTable.list"
													         :rowKey="record => record.id"
													         :rowClassName="rowClassName"
													         :pagination="false">
													</a-table>
												</div>
											</div>
											<div class="newfans-sexy">
												<div class="fans-type" v-if="fansAttrType">
													<button :class="fansAttrAddSexEChartsType?'fans-type-selected' : ''"
													        @click="changeFansAttrAddSexEChartsType(true)">
														饼图
													</button>
													<button :class="!fansAttrAddSexEChartsType?'fans-type-selected' : ''"
													        @click="changeFansAttrAddSexEChartsType(false)">
														折线图
													</button>
												</div>
												<div v-if="fansAttrType && tabKey == 2">
													<PieCharts
															v-if="fansAttrAddSexEChartsType"
															:options="fansAddAttrSexPie"
													>
													</PieCharts>
													<LineCharts
															v-if="fansAttrType && !fansAttrAddSexEChartsType && tabKey == 2"
															:options="fansAddAttrSex"
													>
													</LineCharts>
												</div>
												<div v-if="!fansAttrType && tabKey == 2">
													<PieCharts
															:options="fansAddAttrSexPie"
													>
													</PieCharts>
												</div>
											</div>
											<div class="new-fansarea">
												<div style="height: 500px;">
													<div v-if="fansAttrType"
													     style="font-size: 12px; width: 50%; display: inline-block;">
														新增粉丝地域统计
													</div>
													<div v-if="!fansAttrType"
													     style="font-size: 12px; width: 50%; display: inline-block;">
														全部粉丝地域统计
													</div>
													<div v-if="fansAttrType"
													     style="font-size: 12px; width: 50%; display: inline-block;">
														新增粉丝地域分布TOP10
													</div>
													<div v-if="!fansAttrType"
													     style="font-size: 12px; width: 50%; display: inline-block;">
														全部粉丝地域分布TOP10
													</div>
													<MapCharts style="display: inline-block;width: 50%;"
													           :max='max'
													           :seriesData="fansAddAreaData"
													           v-if="tabKey == 2"></MapCharts>
													<BarShadowCharts style="display: inline-block;width: 50%;"
													                 v-if="tabKey == 2"
													                 :options="fansAddAreaBarData"
													></BarShadowCharts>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="活跃度" key="3">
										<div class="card-attention" v-if="activeModule.length > 0">
											<a-icon type="question-circle"
											        style="font-size: 14px;color: #AAA;margin-right: 8px;"/>
											活跃粉丝的价值非常高，可以使用
											<span>
														<router-link :to='item.url'
														             v-for="item in activeModule">【{{item.title}}】</router-link>
													</span>等功能，在不占用每日群发次数的情况下，为48小时内的活跃粉丝推送消息。
										</div>
										<div class="sec-card-caledar">
											<a-range-picker style="width: 240px;"
											                :allowClear='false'
											                :disabledDate="disabledDateDay"
											                :defaultValue="[moment(moment().subtract(8, 'days').calendar(), 'YYYY-MM-DD'), moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')]"
											                format="YYYY-MM-DD"
											                @change="changeFansActiveTime"
											/>
										</div>
										<div class="sec-card-caledar down-text"
										     style="border-top: 0px;">
											<p style="margin-bottom: 0px;">这段时间里，平均每天有
												<span>{{fansActive.every_day_count}}</span>
												个活跃粉丝，平均活跃比例为
												<span>{{fansActive.every_day_per}}</span>
											</p>
										</div>
										<div class="fans-data-trend">
											<div>
												{{fansActiveLine.lineTitle}}
												<a-tooltip placement="top">
													<template slot="title">
														<span>活跃粉丝有过以下互动：关注，发送各种消息，扫描渠道二维码或者点击菜单。</span>
													</template>
													<a-icon type="question-circle"
													        style="font-size: 14px;color: #AAA;margin-left: 8px;"/>
												</a-tooltip>
											</div>
											<LineCharts v-if="tabKey == 3"
											            :options="fansActiveLine"
											></LineCharts>
										</div>
										<div class="fans-data-detail">
											<div class="title-contain">
												<p>详细数据</p>
												<a-button type="primary" @click="exportFansActive" icon="download">导出数据
												</a-button>
											</div>
											<div class="content-bd fans-active-table">
												<a-table :columns="fansActiveTable.columns"
												         :dataSource="fansActiveTable.list"
												         :rowKey="record => record.id"
												         :rowClassName="rowClassName"
												         :pagination="false">
												</a-table>
												<div v-if="fansActiveAvg" class="fans-active-avg">
															<span>
																{{fansActiveAvg.date}}
															</span>
													<span>
																{{fansActiveAvg.active_day}}
															</span>
													<span>
																{{fansActiveAvg.active_48h}}
															</span>
													<span>
																{{fansActiveAvg.active_7d}}
															</span>
													<span>
																{{fansActiveAvg.active_15d}}
															</span>
													<span>
																{{fansActiveAvg.total}}
															</span>
													<span>
																{{fansActiveAvg.active_per}}
															</span>
												</div>
												<div style="width: 100%;" v-show="fansActiveTable.total > 0">
													<div style="height: 32px;display: inline-block;margin-top: 25px;">
														共
														<span style="color: blue">{{fansActiveTable.total}}</span>条
													</div>
													<div class="pagination" style="margin-top: 20px;float: right;">
														<a-pagination :total="fansActiveTable.total" showSizeChanger
														              :showQuickJumper="fansActiveTable.quickJumper"
														              :current="fansActiveTable.page"
														              :pageSize="fansActiveTable.pageSize"
														              :pageSizeOptions="['10','20','30','60']"
														              @change="changefansActivePage"
														              @showSizeChange="showfansActiveSizeChange"/>
													</div>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="忠诚度" key="4">
										<!--										<div class="card-attention" v-if="loyaltyModule.length > 0">-->
										<!--											<a-icon type="question-circle"-->
										<!--											        style="font-size: 14px;color: #AAA;margin-right: 8px;"/>-->
										<!--											互动宝提供强大的素材共享功能，去-->
										<!--											<span>-->
										<!--														<router-link :to='item.url'-->
										<!--														             v-for="item in loyaltyModule">【{{item.title}}】</router-link>-->
										<!--													</span>编辑优质图文提高粉丝忠诚度。-->
										<!--										</div>-->
										<div class="sec-card-caledar">
											<a-date-picker style="width: 240px;"
											               :allowClear='false'
											               :disabledDate="disabledDateDay"
											               :defaultValue="moment(moment().subtract(1, 'days'), 'YYYY-MM-DD')"
											               format="YYYY-MM-DD"
											               @change="changeFansLoyaltyTime"
											/>
										</div>
										<div class="fans-stash" style="border-bottom: 0px;padding-bottom: 0px">
											<div style="display: flex; align-items: center;">
												<p class="title" style="display: flex; align-items: center;">
													粉丝留存率统计
													<a-tooltip placement="top">
														<template slot="title">
															<span>留存率越高，说明新增的粉丝更可能是您的目标用户，粉丝质量越好。其中，2天留存（即次日留存）最直观反映新增粉丝对公众号的认可度；7天留存则比较接近稳定的长期留存数。</span>
														</template>
														<a-icon type="question-circle"
														        style="font-size: 14px;color: #AAA;margin-left: 8px;"/>
													</a-tooltip>
												</p>
											</div>
										</div>
										<div class="fans-data-detail" style="border-top: 0px; padding-top: 0px;">
											<div class="title-contain" style="margin-bottom: 20px;">
												<p>
													<button class="loyalty-btn"
													        :class="fansLoyaltyType?'fans-type-selected' : ''"
													        @click="changeFansLoyaltyType(true)">
														显示百分比
													</button>
													<button class="loyalty-btn"
													        :class="!fansLoyaltyType?'fans-type-selected' : ''"
													        @click="changeFansLoyaltyType(false)">
														显示关注数
													</button>
												</p>
												<a-button type="primary" @click="exportFansLoyalty" icon="download">导出数据
												</a-button>
											</div>

											<a-table :columns="fansLoyaltyTable.columns"
											         :dataSource="fansLoyaltyTable.list"
											         :rowKey="record => record.id"
											         :rowClassName="rowClassName"
											         :pagination="false">
											</a-table>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="互动消息" key="5">
										<div class="fans-type">
											<button :class="interactiveType?'fans-type-selected' : ''"
											        @click="changeInteractiveType(true)">
												互动时段
											</button>
											<button :class="!interactiveType?'fans-type-selected' : ''"
											        @click="changeInteractiveType(false)">
												互动类型
											</button>
											<a-tooltip placement="top">
												<template slot="title">
													<span>互动消息包括了取关消息；但在平台其他功能处，互动粉丝（活跃粉丝）定义为有以下行为的粉丝：1、用户发送信息 2、点击自定义菜单 3、关注公众号 4、扫描二维码 5、支付成功 6、用户维权</span>
												</template>
												<a-icon type="question-circle"
												        style="font-size: 14px;color: #AAA;margin-left: 8px;"/>
											</a-tooltip>
										</div>
										<!--										<div class="card-attention" v-show="interactiveType">-->
										<!--											<a-icon type="question-circle"-->
										<!--											        style="font-size: 14px;color: #AAA;margin-right: 8px;"/>-->
										<!--											在粉丝活跃时段设置定时发送 ，效果最好-->
										<!--										</div>-->
										<!--										<div class="card-attention"-->
										<!--										     v-show="!interactiveType && interactiveModule.length > 0">-->
										<!--											<a-icon type="question-circle"-->
										<!--											        style="font-size: 14px;color: #AAA;margin-right: 8px;"/>-->
										<!--											取关消息是粉丝最常用的与你沟通的方式，取关的粉丝有点多呢，去-->
										<!--											<span>-->
										<!--														<router-link :to='item.url'-->
										<!--														             v-for="item in interactiveModule">【{{item.title}}】</router-link>-->
										<!--													</span>看看粉丝喜欢的好素材-->
										<!--										</div>-->
										<div class="sec-card-caledar">
											<a-range-picker style="width: 240px;"
											                :allowClear='false'
											                :disabledDate="disabledDateDay1"
											                :defaultValue="[moment(moment().subtract(7, 'days').calendar(), 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]"
											                format="YYYY-MM-DD"
											                @change="changeInteractiveTime"
											/>
										</div>
										<div class="fans-data-trend" v-if="interactiveType && tabKey == 5">
											<div>
												{{fansInteractive.lineTitle}}
												<a-tooltip placement="top">
													<template slot="title">
														<span>将所选时间内粉丝的各种互动行为消息数量叠加，按一天中各个时段取平均值，可看出真实的粉丝活跃时间</span>
													</template>
													<a-icon type="question-circle"
													        style="font-size: 14px;color: #AAA;margin-left: 8px;"/>
												</a-tooltip>
											</div>
											<LineCharts
													:options="fansInteractive"
											></LineCharts>
										</div>
										<div class="fans-data-trend" v-if="!interactiveType && tabKey == 5">
											<div>{{fansInteractivePie.pieTitle}}</div>
											<PieCharts
													:options="fansInteractivePie"
											></PieCharts>
										</div>
										<div class="fans-data-detail" v-show="interactiveType">
											<div class="title-contain">
												<p>详细数据</p>
												<a-button type="primary" @click="exportInteractive" icon="download">导出数据
												</a-button>
											</div>
											<div class="content-bd">
												<a-table :columns="interactiveTable.columns"
												         :dataSource="interactiveTable.list"
												         :rowClassName="rowClassName"
												         :pagination="false">
												</a-table>
												<div style="width: 100%;" v-show="interactiveTable.total > 0">
													<div style="height: 32px;display: inline-block;margin-top: 25px;">
														共
														<span style="color: blue">{{interactiveTable.total}}</span>条
													</div>
													<div class="pagination" style="margin-top: 20px;float: right;">
														<a-pagination :total="interactiveTable.total" showSizeChanger
														              :showQuickJumper="interactiveTable.quickJumper"
														              :current="interactiveTable.page"
														              :pageSize="interactiveTable.pageSize"
														              :pageSizeOptions="['10','20','30','60']"
														              @change="changeInteractivePage"
														              @showSizeChange="showInteractiveSizeChange"/>
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
		<div ref="scroRight" class="scro-right" @mouseover="changeWidthBig"
		     @mouseout="changeWidthSmall" @mouseup="jumpScroll">
			<!--	滚动条滑块	-->
			<div v-show="scrollFlag && scroRight" ref="scroLine" class="scro-line" @mousedown="scroLineDown">

			</div>
		</div>


	</div>
</template>

<script>
	import LineCharts from '../../../components/echarts/LineCharts'
	import PieCharts from '../../../components/echarts/PieCharts'
	import MapCharts from '../../../components/echarts/MapChart'
	import BarShadowCharts from "../../../components/echarts/BarShadowCharts"
	import authorize from "@/components/Authorize.vue"
	import moment from 'moment'


	export default {
		name      : 'HomeLeftContain',
		components: {
			LineCharts,
			PieCharts,
			MapCharts,
			BarShadowCharts,
			authorize
		},
		data () {
			return {
				// 滚动条 ↓
				showWxModal        : false,
				spinning           : true,
				mouseEnterFlag     : false,
				startY             : 0,
				scrollFlag         : true,
				scroRight          : true,
				//滚动条 ↑
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
				wxList             : [], // 微信列表
				// 公众号列表
				iconType           : 'search', // 搜索公众号选择器icon

				/* 粉丝增长 */
				wheelFlag     : true,
				fansAddTime   : {
					hs_date: moment(new Date()).format('YYYY-MM-DD'),
					he_date: moment(new Date()).format('YYYY-MM-DD'),
					ds_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
					de_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					ws_date: moment().subtract(7, 'days').weekday(0).format('YYYY-MM-DD'),
					we_date: moment().subtract(7, 'days').weekday(6).format('YYYY-MM-DD'),
					ws_week: moment(new Date()).week() - 1 || 52
				},
				dayDate       : [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
				weekStart     : moment().subtract(7, 'days'),
				weekEnd       : moment().subtract(7, 'days'),
				s_week        : '',
				timeType      : 1,  //粉丝增长tab时间类型选择
				fans_stat     : {
					fans_new     : '--',
					fans_cancel  : '--',
					fans_increase: '--',
					cancel_per   : '--',
					perDay       : '--'
				},
				// 粉丝增长折线图
				fansAdd       : {
					title     : '粉丝数据趋势',
					legendData: ["净增长", "取消关注", "新增关注"],
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
				// 表格
				fansTableList : [],
				fansTable     : {
					columns    : [
						{
							title    : "时间",
							dataIndex: "hour",
							key      : "hour",
							width    : "20%"
						},
						{
							title    : "新关注粉丝",
							dataIndex: "new",
							key      : "new",
							width    : "20%"
						},
						{
							title    : "取关粉丝",
							dataIndex: "cancel",
							key      : "cancel",
							width    : "20%"
						},
						{
							title    : "取关率",
							dataIndex: "per",
							key      : "per",
							width    : "20%"
						},
						{
							title    : "净增长",
							dataIndex: "new_incre",
							key      : "new_incre",
							width    : "20%"
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},
				/* 粉丝属性 */
				// 粉丝属性跳转数据
				fansAttrModule: [{
					url  : '/scene/list',
					title: '渠道二维码'
				}],
				// true 新粉丝数据 false 全部粉丝
				fansAttrType  : true,
				fansAttrTime  : {
					s_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
					e_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
				},
				// 新粉丝数据
				fansAttr      : {
					fans_count      : '--',
					fans_female     : '--',
					fans_female_per : '--%',
					fans_male       : '--',
					fans_male_per   : '--%',
					fans_unknown    : '--',
					fans_unknown_per: '--%'
				},

				fansAttrAddSourceEChartsType: true,

				// 新增粉丝来源折线图
				fansAttrAddSource        : {
					title     : '新增粉丝来源',
					legendData: ["公众号搜索", "公众号迁移", "名片分享", "扫描二维码", "图文页内名称点击", "图文页右上角菜单", "支付后关注", "其他"],
					xAxisData : [],
					seriesData: [
						{
							name  : "公众号搜索",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "公众号迁移",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "名片分享",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "扫描二维码",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "图文页内名称点击",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "图文页右上角菜单",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "支付后关注",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "其他",
							type  : "line",
							smooth: true,
							data  : []
						}
					]
				},
				// 粉丝来源饼图
				fansAttrAddSourcePie     : {
					title     : '新增粉丝来源',
					formatter : "{b} {c} 占比 {d}%",
					seriesData: [{value: 0, name: "公众号搜索"},
						{value: 0, name: "公众号迁移"},
						{value: 0, name: "名片分享"},
						{value: 0, name: "扫描二维码"},
						{value: 0, name: "图文页内名称点击"},
						{value: 0, name: "图文页右上角菜单"},
						{value: 0, name: "支付后关注"},
						{value: 0, name: "其他"}
					]
				},
				// 新增粉丝来源表格
				fansAddSourceTable       : {
					columns: [
						{
							title    : "渠道",
							dataIndex: "name",
							key      : "name"
						},
						{
							title    : "关注量",
							dataIndex: "count",
							key      : "count"
						},
						{
							title    : "关注量占比",
							dataIndex: "per",
							key      : "per"
						}
					],
					list   : [],
				},
				fansAttrAddSexEChartsType: true,
				// 新增粉丝性别 折线图
				fansAddAttrSex           : {
					title     : '新增粉丝性别',
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
				fansAddAttrSexPie        : {
					title     : '新增粉丝性别',
					formatter : "{b} {c} 占比 {d}%",
					seriesData: [
						{value: 0, name: "男"},
						{value: 0, name: "女"},
						{value: 0, name: "未知"}]
				},
				// 粉丝地域统计数据地图
				max                      : 0,
				fansAddAreaData          : [],
				// 粉丝地域统计数据柱形图
				fansAddAreaBarData       : {
					max       : 0,
					seriesData: [],
					nums      : []
				},

				fansActiveTime      : {
					s_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
					e_date: moment().subtract(1, 'days').format('YYYY-MM-DD')
				},
				/* 活跃度 */
				activeModule        : [
					// 	{
					// 	url  : '',
					// 	title: '智能互动'
					// },
					{
						url  : '/customer/list',
						title: '客服消息'
					}],
				// 文案数据
				fansActive          : {
					every_day_count: "--",
					every_day_per  : "--%"
				},
				// 折线图
				fansActiveLine      : {
					lineTitle : '粉丝活跃度统计',
					legendData: ["48小时内互动", "7天内互动", "15天内互动"],
					xAxisData : [],
					seriesData: [
						{
							name  : "48小时内互动",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "7天内互动",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "15天内互动",
							type  : "line",
							smooth: true,
							data  : []
						}
					],
				},
				// 表格
				fansActiveTableList : [],
				fansActiveAvg       : {},
				fansActiveTable     : {
					columns    : [
						{
							title    : "日期",
							dataIndex: "date",
							key      : "date",
							width    : "14%"
						},
						{
							title    : "当日活跃粉丝数",
							dataIndex: "active_day",
							key      : "active_day",
							width    : "14%"
						},
						{
							title    : "48小时内互动粉丝数",
							dataIndex: "active_48h",
							key      : "active_48h",
							width    : "14%"
						},
						{
							title    : "7天内互动粉丝数",
							dataIndex: "active_7d",
							key      : "active_7d",
							width    : "14%"
						},
						{
							title    : "15天内互动粉丝数",
							dataIndex: "active_15d",
							key      : "active_15d",
							width    : "14%"
						},
						{
							title    : "总粉丝数",
							dataIndex: "total",
							key      : "total",
							width    : "14%"
						},
						{
							title    : "活跃比例",
							dataIndex: "active_per",
							key      : "active_per",
							width    : "14%"
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},
				/* 忠诚度 */
				loyaltyModule       : [{
					url  : '/material',
					title: '素材库'
				}],
				fansLoyaltyTime     : moment(moment().subtract(1, 'days')).format('YYYY-MM-DD'),
				fansLoyaltyType     : true,
				fansLoyaltyTable    : {
					columns: [
						{
							title    : "日期",
							dataIndex: "date",
							key      : "date"
						},
						{
							title    : "当天关注粉丝",
							dataIndex: "current_day_subscribe_fans",
							key      : "current_day_subscribe_fans"
						},
						{
							title    : "当天留存",
							dataIndex: "current_day_stay_fans",
							key      : "current_day_stay_fans"
						},
						{
							title    : "2天留存",
							dataIndex: "two_stay_fans",
							key      : "two_stay_fans",
						},
						{
							title    : "3天留存",
							dataIndex: "three_stay_fans",
							key      : "three_stay_fans",
						},
						{
							title    : "4天留存",
							dataIndex: "four_stay_fans",
							key      : "four_stay_fans"
						},
						{
							title    : "5天留存",
							dataIndex: "five_stay_fans",
							key      : "five_stay_fans"
						},
						{
							title    : "6天留存",
							dataIndex: "six_stay_fans",
							key      : "six_stay_fans",
						},
						{
							title      : "7天留存",
							dataIndex  : "seven_stay_fans",
							key        : "seven_stay_fans",
							scopedSlots: {customRender: "twoRetained"}
						}
					],
					list   : []
				},
				/* 互动消息 */
				interactiveType     : true,
				interactiveTime     : {
					s_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
					e_date: moment(new Date()).format('YYYY-MM-DD')
				},
				interactiveModule   : [{
					url  : '/fans/msg',
					title: '粉丝对话'
				}],
				fansInteractive     : {
					lineTitle : '收到消息时段分布图',
					legendData: ["菜单点击", "扫描二维码", "关注", "取关", "粉丝消息"],
					xAxisData : [],
					seriesData: [
						{
							name  : "菜单点击",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "扫描二维码",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "关注",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "取关",
							type  : "line",
							smooth: true,
							data  : []
						}, {
							name  : "粉丝消息",
							type  : "line",
							smooth: true,
							data  : []
						}
					],
				},
				fansInteractivePie  : {
					pieTitle  : '互动类型分析',
					formatter : "{b} {c} 占比 {d}%",
					seriesData: [
						{value: 0, name: "粉丝消息"},
						{value: 0, name: "关注消息"},
						{value: 0, name: "取关消息"},
						{value: 0, name: "扫描二维码"},
						{value: 0, name: "点击菜单"}
					],
				},
				interactiveTableList: [],
				interactiveTable    : {
					columns    : [
						{
							title    : "时间段",
							dataIndex: "hour",
							key      : "hour"
						},
						{
							title    : "粉丝消息",
							dataIndex: "message",
							key      : "message"
						},
						{
							title    : "关注",
							dataIndex: "subscribe",
							key      : "subscribe"
						},
						{
							title    : "取关",
							dataIndex: "unsubscribe",
							key      : "unsubscribe",
						},
						{
							title    : "扫描二维码",
							dataIndex: "scan",
							key      : "scan",
						},
						{
							title    : "菜单点击",
							dataIndex: "click",
							key      : "click"
						},
						{
							title    : "总计",
							dataIndex: "total",
							key      : "total"
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},
				changeWidthSmallFlag: false,
				scrollOutFlag       : false
			}
		},
		created () {

		},
		mounted () {
			this.initPage()
			this.setScroLineHeight()
			this.initFirefoxScroll()
			this.startY = 65
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

			initPage () {
				let that = this
				this.$store.dispatch('getWx', (info) => {
					that.wxList = info
					// for(let i = 0; i < 30; i++) {
					// 	let wx = {
					// 		wx_id: i,
					// 		nick_name: i
					// 	}
					// 	that.wxList.push(wx)
					// }
					if (info.length == 0) {
						that.spinning = false
					} else {
						if (that.$store.state.wxNum) {
							that.wxId = that.$store.state.wxNum
						} else {
							if (that.wxList && that.wxList.length > 0) {
								that.wxId = that.wxList[0].id
								that.$store.dispatch("changeWxNum", that.wxId)
							}
						}
						that.getFansTop()
						that.fansAddTime.hs_date = moment(new Date()).format('YYYY-MM-DD')
						that.fansAddTime.he_date = moment(new Date()).format('YYYY-MM-DD')
						that.getFansIncrease(that.timeType, that.fansAddTime.hs_date, that.fansAddTime.he_date, "", 0)
					}
				});
			},
			// 粉丝增长
			async getFansIncrease (type, s_date, e_date, s_week, is_export) {
				let that = this
				let params = {
					s_date   : s_date,
					e_date   : e_date,
					s_week   : s_week,
					type     : type,
					is_export: is_export,
					wx_id    : localStorage.getItem('wxNum')
				}
				const {data: res} = await this.axios.post("index/fans-increase", params);
				if (res.error == 0) {
					if (is_export != 1) {
						that.fans_stat = res.data.fans_stat
						that.fansAdd.legendData = res.data.legData
						that.fansAdd.seriesData = res.data.seriesData
						that.fansAdd.xAxisData = res.data.xData
						that.fansTableList = res.data.fans_data
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
			// 总览
			async getFansTop () {
				let that = this
				const {data: res} = await this.axios.post("index/fans-top", {
					wx_id: localStorage.getItem('wxNum')
				});
				if (res.error == 0) {
					that.storeIndicatorsData = res.data
				}
			},
			// 粉丝属性
			async getFansAttribute (s_date, e_date, type, is_export) {
				let that = this
				let params = {
					s_date   : s_date,
					e_date   : e_date,
					type     : type,
					is_export: is_export,
					wx_id:localStorage.getItem('wxNum')
				}
				const {data: res} = await this.axios.post("index/fans-attribute", params);
				if (res.error == 0) {
					if (is_export != 1) {
						that.fansAttr = res.data.sexData
						that.fansAttrAddSource.legendData = res.data.legData2
						that.fansAttrAddSource.seriesData = res.data.seriesData2
						that.fansAttrAddSource.xAxisData = res.data.xData
						that.fansAttrAddSourcePie.seriesData = res.data.pieData2
						that.fansAddAttrSex.legendData = res.data.legData1
						that.fansAddAttrSex.xAxisData = res.data.xData
						that.fansAddAttrSex.seriesData = res.data.seriesData1
						that.fansAddAttrSexPie.seriesData = res.data.pieData1
						that.fansAddAreaBarData.yAxisData = res.data.province.reverse()
						let pd = res.data.provinceData

						let sum = 0
						for (let i = 0; i < pd.length; i++) {
							sum += pd[i]
						}
						for (let i = 0; i < pd.length; i++) {
							pd[i] = (pd[i] / parseFloat(sum) * 100).toFixed(2)
						}
						that.fansAddAreaBarData.seriesData = pd.reverse()
						that.max = res.data.max
						that.fansAddAreaData = res.data.countryData
						that.fansAddSourceTable.list = res.data.sourceDetail
					} else {
						window.open(res.data.url)
					}
				} else {
					this.$message.error(res.error_msg);
				}
				this.spinning = false
			},
			// 活跃度
			async getFansActive (s_date, e_date, is_export) {
				let that = this
				let params = {
					s_date   : s_date,
					e_date   : e_date,
					is_export: is_export,
					wx_id:localStorage.getItem('wxNum')
				}
				const {data: res} = await this.axios.post("index/fans-active", params);
				if (res.error == 0) {
					if (is_export != 1) {
						that.fansActive.every_day_count = res.data.every_day_count
						that.fansActive.every_day_per = res.data.every_day_per
						that.fansActiveLine.legendData = res.data.legData
						that.fansActiveLine.xAxisData = res.data.xData
						that.fansActiveLine.seriesData = res.data.seriesData
						if (res.data.detail && res.data.detail.length > 0) {
							this.fansActiveAvg = res.data.detail[res.data.detail.length - 1]
						}
						res.data.detail.splice(res.data.detail.length - 1, 1)
						that.fansActiveTableList = res.data.detail
						this.fansActiveTable.total = this.fansActiveTableList.length
						let table = this.getPageData(this.fansActiveTableList, this.fansActiveTable.page, this.fansActiveTable.pageSize)
						this.fansActiveTable.page = table.page
						this.fansActiveTable.list = table.list
					} else {
						window.open(res.data.url)
					}
				} else {
					this.$message.error(res.error_msg);
				}
				this.spinning = false
			},
			// 忠诚度
			async getFansLoyalty (date, type, is_export) {
				let that = this
				let params = {
					date     : date,
					type     : type,
					is_export: is_export,
					wx_id:localStorage.getItem('wxNum')
				}
				const {data: res} = await this.axios.post("index/fans-loyalty", params);
				if (res.error == 0) {
					if (is_export != 1) {
						res.data
						this.fansLoyaltyTable.list = res.data
						this.fansLoyaltyTable.total = res.data.length
					} else {
						window.open(res.data.url)
					}
				} else {
					this.$message.error(res.error_msg);
				}
				this.spinning = false
			},
			// 互动消息
			async getFansMessage (s_date, e_date, type, is_export) {
				let that = this
				let params = {
					s_date   : s_date,
					e_date   : e_date,
					type     : type,
					is_export: is_export,
					wx_id:localStorage.getItem('wxNum')
				}
				const {data: res} = await this.axios.post("index/fans-message", params);
				if (res.error == 0) {
					if (is_export != 1) {
						that.fansInteractive.legendData = res.data.legData
						that.fansInteractive.xAxisData = res.data.xData
						that.fansInteractive.seriesData = res.data.seriesData
						that.fansInteractivePie.seriesData = res.data.pieData
						if (type == 1) {
							that.interactiveTableList = res.data.detail
							that.interactiveTable.total = res.data.detail.length
							let table = this.getPageData(that.interactiveTableList, that.interactiveTable.page, that.interactiveTable.pageSize)
							that.interactiveTable.page = table.page
							that.interactiveTable.list = table.list
						}

					} else {
						window.open(res.data.url)
					}
				} else {
					this.$message.error(res.error_msg);
				}
				this.spinning = false
			},
			// 表格颜色
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 互动消息改变页
			changeInteractivePage (page, pageSize) {
				this.interactiveTable.page = page
				let table = this.getPageData(this.interactiveTableList, this.interactiveTable.page, this.interactiveTable.pageSize)
				this.interactiveTable.page = table.page
				this.interactiveTable.list = table.list
				this.$nextTick(() => {
					if(document.getElementsByClassName('ant-layout').length > 1) {
						document.getElementsByClassName('ant-layout')[2].scrollTo(0, 900)
					}
				})
			},
			// 互动消息改变页码
			showInteractiveSizeChange (page, pageSize) {
				this.interactiveTable.pageSize = pageSize
				let table = this.getPageData(this.interactiveTableList, this.interactiveTable.page, this.interactiveTable.pageSize)
				this.interactiveTable.page = table.page
				this.interactiveTable.list = table.list
			},
			// 互动时间段
			changeInteractiveTime (date, dateString) {
				this.interactiveTime.s_date = dateString[0]
				this.interactiveTime.e_date = dateString[1]
				let type = 1
				if (!this.interactiveType) {
					type = 2
				}
				this.spinning = true
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.getFansMessage(this.interactiveTime.s_date, this.interactiveTime.e_date, type, 0)
			},
			// 互动消息互动类型
			changeInteractiveType (flag) {
				if (this.interactiveType != flag) {
					this.interactiveType = flag
					let type = 1
					if (!this.interactiveType) {
						type = 2
					}
					this.spinning = true
					if (this.wxList.length == 0) {
						this.spinning = false
						return
					}
					this.getFansMessage(this.interactiveTime.s_date, this.interactiveTime.e_date, type, 0)
				}
			},
			// 互动消息导出
			exportInteractive () {
				let type = 1
				if (!this.interactiveType) {
					type = 2
				}
				this.getFansMessage(this.interactiveTime.s_date, this.interactiveTime.e_date, type, 1)
			},
			// 忠诚度百分比或关注数切换
			changeFansLoyaltyType (flag) {
				if (this.fansLoyaltyType != flag) {
					this.fansLoyaltyType = flag
					let type = 1
					if (!flag) {
						type = 2
					}
					this.spinning = true
					if (this.wxList.length == 0) {
						this.spinning = false
						return
					}
					this.getFansLoyalty(this.fansLoyaltyTime, type, 0)
				}
			},
			// 忠诚度导出
			exportFansLoyalty () {
				this.spinning = true
				let type = 1
				if (!this.fansLoyaltyType) {
					type = 2
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.getFansLoyalty(this.fansLoyaltyTime, type, 1)
			},
			// 忠诚度时间
			changeFansLoyaltyTime (date, dateString) {
				this.fansLoyaltyTime = dateString
				let type = 1
				if (!this.fansLoyaltyType) {
					type = 2
				}
				this.spinning = true
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.getFansLoyalty(this.fansLoyaltyTime, type, 0)
			},
			// 活跃度表格页码改变
			changefansActivePage (page, pageSize) {
				this.fansActiveTable.page = page
				let table = this.getPageData(this.fansActiveTableList, this.fansActiveTable.page, this.fansActiveTable.pageSize)
				this.fansActiveTable.page = table.page
				this.fansActiveTable.list = table.list
				this.$nextTick(() => {
					if(document.getElementsByClassName('ant-layout').length > 1) {
						document.getElementsByClassName('ant-layout')[2].scrollTo(0, 1000)
					}
				})
			},
			// 活跃度pageSize改变
			showfansActiveSizeChange (page, pageSize) {
				this.fansActiveTable.pageSize = pageSize
				let table = this.getPageData(this.fansActiveTableList, this.fansActiveTable.page, this.fansActiveTable.pageSize)
				this.fansActiveTable.page = table.page
				this.fansActiveTable.list = table.list
			},
			// 活跃度表格导出
			exportFansActive () {
				this.getFansActive(this.fansActiveTime.s_date, this.fansActiveTime.e_date, 1)
			},
			// 活跃度时间改变
			changeFansActiveTime (date, dateString) {
				this.spinning = true
				this.fansActiveTime.s_date = dateString[0]
				this.fansActiveTime.e_date = dateString[1]
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.getFansActive(this.fansActiveTime.s_date, this.fansActiveTime.e_date, 0)
			},
			// 粉丝属性新增粉丝性别图切换
			changeFansAttrAddSexEChartsType (flag) {
				if (this.fansAttrAddSexEChartsType != flag) {
					this.fansAttrAddSexEChartsType = flag
				}
			},
			// 粉丝属性来源导出
			exportFansAttribute () {
				let type = 2
				if (this.fansAttrType) {
					type = 1
				}
				this.getFansAttribute(this.fansAttrTime.s_date, this.fansAttrTime.e_date, type, 1)
			},
			// 粉丝属性新增粉丝来源图切换
			changeFansAttrAddSourceEChartsType (flag) {
				if (this.fansAttrAddSourceEChartsType != flag) {
					this.fansAttrAddSourceEChartsType = flag
				}
			},
			// 粉丝属性时间选择
			changeFansAttrTime (date, dateString) {
				this.spinning = true
				this.fansAttrTime.s_date = dateString[0]
				this.fansAttrTime.e_date = dateString[1]
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.getFansAttribute(this.fansAttrTime.s_date, this.fansAttrTime.e_date, 1, 0)
			},
			// 新粉丝全部粉丝切换
			changeFansAttrType (flag) {
				if (this.fansAttrType != flag) {
					this.fansAttrType = flag
					let type = 2
					this.fansAttrAddSource.title = '全部粉丝来源'
					this.fansAttrAddSourcePie.title = '全部粉丝来源'
					this.fansAddAttrSex.title = '全部粉丝性别'
					this.fansAddAttrSexPie.title = '全部粉丝性别'
					if (flag) {
						type = 1
						this.fansAttrAddSource.title = '新增粉丝来源'
						this.fansAttrAddSourcePie.title = '新增粉丝来源'
						this.fansAddAttrSex.title = '新增粉丝性别'
						this.fansAddAttrSexPie.title = '新增粉丝性别'
					}
					this.spinning = true
					if (this.wxList.length == 0) {
						this.spinning = false
						return
					}
					this.getFansAttribute(this.fansAttrTime.s_date, this.fansAttrTime.e_date, type, 0)
				}
			},
			// 粉丝页码改变
			changeFansPage (val) {
				let that = this
				that.fansTable.page = val
				let table = that.getPageData(that.fansTableList, that.fansTable.page, that.fansTable.pageSize)
				that.fansTable.list = table.list
				that.fansTable.page = table.page
				if (this.fansTable.list.length > 10) {
					this.wheelFlag = false
				}
				this.$nextTick(() => {
					if(document.getElementsByClassName('ant-layout').length > 1) {
						document.getElementsByClassName('ant-layout')[2].scrollTo(0, 1000)
					}
				})
			},
			// 粉丝表格分页pageSize改变
			showFansSizeChange (page, pageSize) {
				let that = this
				that.fansTable.pageSize = pageSize
				let table = that.getPageData(that.fansTableList, that.fansTable.page, that.fansTable.pageSize)
				that.fansTable.list = table.list
				that.fansTable.page = table.page
				if (this.fansTable.list.length > 10) {
					this.wheelFlag = false
				}
			},
			disabledDateHours (current) {
				return current > moment().endOf('day') || current < moment().subtract(3, "days");
			},
			disabledDateDay (current) {
				return current.valueOf() > new Date().getTime() - 86400000 || current < moment().subtract(31, "days");
			},
			disabledDateDay1 (current) {
				return current.valueOf() > new Date().getTime() || current < moment().subtract(30, "days");
			},
			disabledDateWeek (current) {
				let weekOfday = moment(new Date()).format('E')
				return current.valueOf() > moment(new Date()).subtract(weekOfday, 'days') || current < moment().subtract(365, "days");
			},
			// 禁止选择今天后的日期
			disabledDate (current) {
				// Can not select days before today and today
				return current > moment().endOf('day');
			},
			// 粉丝增长时间类型切换
			changeFansTimeType (type) {
				if (this.timeType != type) {
					this.spinning = true
					this.timeType = type;
					let s_date = ''
					let e_date = ''
					if (type == 1) {
						s_date = this.fansAddTime.hs_date
						e_date = this.fansAddTime.he_date
					} else if (type == 2) {
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
			// 粉丝增长时间值
			changeFansTime (date, dateString) {
				this.spinning = true
				if (this.timeType == 1) {
					this.fansAddTime.hs_date = dateString[0]
					this.fansAddTime.he_date = dateString[1]
				} else if (this.timeType == 2) {
					this.fansAddTime.ds_date = dateString[0]
					this.fansAddTime.de_date = dateString[1]
				}
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.getFansIncrease(this.timeType, dateString[0], dateString[1], this.fansAddTime.ws_week, 0)
			},
			// 粉丝增长改变起始周
			changeFansStartWeek (date, dateString) {
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
			// 粉丝增长改变结束周
			changeFansEndWeek (date, dateString) {
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
			// 粉丝增长表格导出
			exportFansIncrease () {
				let s_date = ''
				let e_date = ''
				if (this.timeType == 1) {
					s_date = this.fansAddTime.hs_date
					e_date = this.fansAddTime.he_date
				} else if (this.timeType == 2) {
					s_date = this.fansAddTime.ds_date
					e_date = this.fansAddTime.de_date
				} else if (this.timeType == 3) {
					if (moment().weekday(6).format('YYYY-MM-DD') > moment().format("YYYY-MM-DD")) {
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
			// 切换店铺
			changeStoreId (wx) {
				this.spinning = true
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				this.wxId = wx.wx_id;
				this.$store.dispatch("changeWxNum", wx.wx_id)
				this.$store.commit("changeAuthorizerType", wx.authorizer_type);
				this.$store.commit("changeWxNickName", wx.nick_name);
				this.getFansTop()
				if (this.tabKey == 1) {
					let s_date = this.fansAddTime.hs_date
					let e_date = this.fansAddTime.he_date
					if (this.timeType == 2) {
						s_date = this.fansAddTime.ds_date
						e_date = this.fansAddTime.de_date
					} else if (this.timeType == 3) {
						s_date = this.fansAddTime.ws_date
						e_date = this.fansAddTime.we_date
					}
					this.getFansIncrease(this.timeType, s_date, e_date, this.fansAddTime.ws_week, 0)
				} else if (this.tabKey == 2) {
					let type = 2
					if (this.fansAttrType) {
						type = 1
					}
					this.getFansAttribute(this.fansAttrTime.s_date, this.fansAttrTime.e_date, type, 0)
				} else if (this.tabKey == 3) {
					this.getFansActive(this.fansActiveTime.s_date, this.fansActiveTime.e_date, 0)
				} else if (this.tabKey == 4) {
					let type = 1
					if (!this.fansLoyaltyType) {
						type = 2
					}
					this.getFansLoyalty(this.fansLoyaltyTime, type, 0)
				} else if (this.tabKey == 5) {
					let type = 1
					if (!this.interactiveType) {
						type = 2
					}
					this.getFansMessage(this.interactiveTime.s_date, this.interactiveTime.e_date, type, 0)
				}
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			// 查找公众号

			handleChange (value) {
				if (typeof value != 'undefined') {
					this.wxList.map(x => {
						if (x.wx_id == value) {
							this.wxId = x
						}
					})
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
				that.$nextTick(function () {
					that.setScroLineHeight()
					this.startY = 0
				})
				if (this.wxList.length == 0) {
					this.spinning = false
					return
				}
				if (key == 1) {
					let s_date = this.fansAddTime.hs_date
					let e_date = this.fansAddTime.he_date
					if (this.timeType == 2) {
						s_date = this.fansAddTime.ds_date
						e_date = this.fansAddTime.de_date
					} else if (this.timeType == 3) {
						s_date = this.fansAddTime.ws_date
						e_date = this.fansAddTime.we_date
					}
					this.getFansIncrease(this.timeType, s_date, e_date, this.fansAddTime.ws_week, 0)
				} else if (key == 2) {
					let type = 2
					if (this.fansAttrType) {
						type = 1
					}
					this.getFansAttribute(this.fansAttrTime.s_date, this.fansAttrTime.e_date, type, 0)
				} else if (key == 3) {
					this.getFansActive(this.fansActiveTime.s_date, this.fansActiveTime.e_date, 0)
				} else if (key == 4) {
					let type = 1
					if (!this.fansLoyaltyType) {
						type = 2
					}
					this.getFansLoyalty(this.fansLoyaltyTime, type, 0)
				} else if (key == 5) {
					let type = 1
					if (!this.interactiveType) {
						type = 2
					}
					this.getFansMessage(this.interactiveTime.s_date, this.interactiveTime.e_date, type, 0)
				}
			},
			// 表格分页
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
			// 滚动条高度
			setScroLineHeight () {
				let that = this
				let winHeight = 0;
				this.$refs.scroLeft.clientHeight
				if (window.innerHeight) {
					winHeight = window.innerHeight;
				} else if ((document.body) && (document.body.clientHeight)) {
					winHeight = document.body.clientHeight;
				}
				if (winHeight >= that.$refs.scroLeft.scrollHeight) {
					that.scroRight = false
				} else {
					that.$refs.scroLine.style.height = winHeight / that.$refs.scroLeft.scrollHeight * that.$refs.scroRight.scrollHeight + "px";
					that.scroRight = true
				}
			},
			// 滚动条变宽
			changeWidthBig () {
				this.$refs.scroLine.style.width = "10px";
				this.$refs.scroLine.style.backgroundColor = '#AAAAAA'
			},
			// 滚动条变窄
			changeWidthSmall () {
				if (!this.mouseEnterFlag) {
					this.$refs.scroLine.style.width = "5px";
					this.$refs.scroLine.style.backgroundColor = '#D3D3D3';
				}
				this.changeWidthSmallFlag = true
				// this.mouseEnterFlag = false;
			},
			// 滑轮滚动（火狐）
			initFirefoxScroll () {
				let that = this
				if (document.addEventListener) {
					document.addEventListener('DOMMouseScroll', this.DOMScrollWheel, false)
				}
			},
			DOMScrollWheel () {
				let that = this
				let event1 = window.event || e;
				let Y = that.$refs.scroLeft.scrollTop;
				let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
				if (event1.detail >= 0) {
					Y = Y + 120
				} else {
					Y = Y - 120
				}
				if (Y < 0) Y = 0;
				if (Y > H) Y = H;
				that.$refs.scroLeft.scrollTop = Y;
				let SH = Y / H * that.$refs.scroRight.clientHeight - that.$refs.scroLine.clientHeight;
				if (SH < 0) SH = 0;
				that.$refs.scroLine.style.top = SH + "px";
			},
			// 滑轮滚动
			scrollWheel () {
				let event = event ? event : (window.event ? window.event : null);
				let Y = this.$refs.scroLeft.scrollTop;
				let H = this.$refs.scroLeft.scrollHeight - this.$refs.scroLeft.clientHeight;
				if (event.wheelDelta >= 120) {
					Y = Y - event.wheelDelta * 0.7
				} else {
					Y = Y + event.wheelDelta * 0.7
				}
				if (Y < 0) Y = 0;
				if (Y > H) Y = H;
				this.$refs.scroLeft.scrollTop = Y;
				let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
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
					let SH = Y / H * that.$refs.scroRight.clientHeight - that.$refs.scroLine.clientHeight;
					if (SH < 0) SH = 0;
					that.$refs.scroLine.style.top = SH + "px";
					that.startY = event.y
				}
			},
			// 滚动条鼠标按下
			scroLineDown () {
				this.mouseEnterFlag = true
				this.startY = event.y;  // 按下鼠标指针的y轴坐标
				if (window.addEventListener) {
					window.addEventListener('mouseup', this.scroLineUp, false)
					window.addEventListener('mousemove', this.scroLineMove, false)
				}
				this.$emit('banUserSelect', {});
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
					let SH = Y / H * that.$refs.scroRight.clientHeight - that.$refs.scroLine.clientHeight;
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
					this.$emit("userSelect", {})
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
		margin-top: -1px !important;
		border-bottom: 1px solid #E9E9E9 !important;
		border: 0px !important;
		background-color: #F5F5F5 !important;
	}

	.wx-list-tab >>> .ant-tabs-tab-active {
		background-color: #FFFFFF !important;
	}

	.wx-list-tab >>> .ant-tabs-tab-active div {
		max-width: 190px;
		min-width: 120px;
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
		width: calc(100% - 12px);
		width: -moz-calc(100% - 12px);
		width: -webkit-calc(100% - 12px);
		height: 100%;
		background-color: #E9E9E9;
		max-height: 100%;
		overflow: hidden;
		/*overflow-y: scroll;*/
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
		/*overflow: visible !important;*/
		border-top: 1px solid #E9E9E9;
		border-right: 1px solid #E9E9E9;
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

	.card-filter-contain .fans-data-detail, .fansAttribute .detail-data-table {
		padding: 24px 24px 20px 24px;
		border: 1px solid #E9E9E9;
		border-top: 0;
	}

	.card-filter-contain .fans-data-detail .title-contain, .fansAttribute .detail-data-table .title-contain {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.card-filter-contain .fans-data-detail .title-contain p, .fansAttribute .detail-data-table .title-contain p {
		font-family: PingFangSC-Medium;
		color: #1A1A1A;
		font-size: 14px;
		margin-bottom: 0px;
		vertical-align: center;
	}

	.card-filter-contain .fans-data-detail .title-contain button, .fansAttribute .detail-data-table .title-contain button {
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

	.card-filter-contain .card-attention {
		padding: 10px 16px;
		background: #E6F7FF;
		border: 1px solid #91D5FF;
		margin-bottom: 16px;
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

	.card-filter-contain p span {
		color: #FF562D;
	}

	.fansAttribute .fans-source {
		padding: 24px 0 32px 24px;
		border: 1px solid #E9E9E9;
	}

	.fansAttribute .newfans-sexy {
		margin-top: 24px;
		border: 1px solid #E9E9E9;
		padding: 24px;
	}

	.fansAttribute .new-fansarea {
		margin-top: 24px;
		padding: 24px;
		border: 1px solid #E9E9E9;
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

	.tabBox > span:first-child {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
