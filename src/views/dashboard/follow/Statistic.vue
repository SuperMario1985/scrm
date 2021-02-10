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
						<div style="margin-bottom:10px;padding:20px;background: #F7F7F7;border: 1px solid #E9E9E9;">
							<div>
								<span class="month-picker-contain picker-contain">
									<a-button style="margin-right: 5px;"
									          @click="showDepartmentList">
										<span v-if="chooseNum == 0">选择部门成员</span>
										<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
									</a-button>
								</span>
								<a-range-picker :allowClear="false"
								                @change="changeTime"
								                :value="dateValue"
								                :disabled-date="disabledDate"
								                format="YYYY-MM-DD"/>
								<a-radio-group v-model="cycleType" button-style="solid" @change="changeCycleType">
									<a-radio-button value="1">
										上一周
									</a-radio-button>
									<a-radio-button value="2" style="margin-left: 5px;">
										上一月
									</a-radio-button>
									<a-radio-button value="3" style="margin-left: 5px;">
										本周
									</a-radio-button>
									<a-radio-button value="4" style="margin-left: 5px;">
										本月
									</a-radio-button>
									<a-radio-button value="5" style="margin-left: 5px;">
										自定义
									</a-radio-button>
								</a-radio-group>
								<span style="margin-left: 15px;">
<!--									<a-button type="primary" style="margin-right:15px;" @click="find">查询</a-button>-->
									<a-button @click="clear">重置</a-button>
								</span>
							</div>

						</div>
						<div class="spin-content">
							<a-row class="single-accout-card">
								<a-col :span="6" class="single-accout-cardItem">
									<span>今日客户跟进人数
										<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>今日跟进的客户人数。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{todayUserCount}}</p>
								</a-col>
								<a-col :span="6" class="single-accout-cardItem">
									<span>今日客户跟进记录
										<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>今日添加客户跟进的条数，同一客户可添加多条。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{todayRecordCount}}</p>
								</a-col>
								<a-col :span="6" class="single-accout-cardItem">
									<span>客户跟进人数
										<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>周期内对客户跟进的人数，同一客户被多个员工跟进，重复计入。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{userCount}}</p>
								</a-col>
								<a-col :span="6" class="single-accout-cardItem">
									<span>客户跟进记录
										<a-tooltip placement="right">
						                    <template slot="title">
						                      <span>今日添加客户跟进的条数，同一客户可添加多条。</span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
									</span>
									<p style="color: rgb(255, 86, 45);">{{recordCount}}</p>
								</a-col>
							</a-row>
							<a-row class="single-accout-card follow-status"
							       style="layout:fit; width: 100%; overflow-y: hidden; overflow-x: auto;white-space: nowrap;flex-wrap: nowrap;display: flex;"
							       :style="{height: followState.length > 4 ? '150px': '144px'}">
								<a-col class="single-accout-cardItem"
								       :style="{height: followState.length > 4 ? '150px': '144px'}"
								       v-for="(item, index) in followState" :lg="lgNum[index]" :xl="xlNum[index]"
								       :xxl="xxlNum[index]">
									<div>
										<span>{{item.title}}</span>
										<p style="color: rgb(255, 86, 45);">{{item.num}}</p>
									</div>
									<div style="text-align: right;padding-right: 15px;">
										<span style="text-align: right;">转化人数</span>
										<p style="color: #01b065;text-align: right">{{item.next_num}}</p>
									</div>
								</a-col>
							</a-row>
							<!--						<div class="single-accout-cardItem" :style="{height: followState.length > 4 ? '126px': '120px'}"-->
							<!--								     v-for="(item, index) in followState">-->
							<!--									<div style="width:50%; float: left">-->
							<!--										<span>{{item.title}}</span>-->
							<!--										<p style="color: rgb(255, 86, 45);">{{item.num}}</p>-->
							<!--									</div>-->
							<!--									<div style="width:50%; float: left; text-align: right;padding-right: 15px;margin-top: 28px;">-->
							<!--										<span style="text-align: right;">转到下一阶段</span>-->
							<!--										<p style="color: #01b065;text-align: right">{{item.next_num}}</p>-->
							<!--									</div>-->
							<!--									&lt;!&ndash;									<p style="color: rgb(255, 86, 45);">{{item.next_num}}</p>&ndash;&gt;-->
							<!--								</div>-->
						</div>
						<div class="card-filter-contain">
							<template>
								<a-tabs @change="changeTab" type="card"
								        style="background-color: #FFF;">
									<a-tab-pane tab="跟进转化漏斗" key="3">
										<div class="fansgrow-contain">
											<div class="fans-data-trend">
												<div style="margin-bottom: 20px;">
													<h4>在{{startValue}}至{{endValue}}内，<span style="color: #FF562D;">{{username}}</span>漏斗分析
													</h4>
												</div>
												<FunnelCharts v-show="hasCorp"
												              :options="fansAdd3" style="width:100%;"
												>
												</FunnelCharts>
												<a-empty
														v-show="!hasCorp"
														style="margin-top: 30px;">
													<span slot="description" style="color: #999;">暂无数据</span>
												</a-empty>
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
														<span slot="num">
															客户数
															<a-tooltip placement="right">
											                    <template slot="title">
											                        <span>
												                        在周期内所新增客户中，截止至筛选的最后一天，停留在该阶段的客户数，不计入流失的客户。（比如1号-10号新增20人，在11日筛选这段时间，以10日停留在该阶段的5人为统计）
											                        </span>
											                    </template>
										                        <a-icon type="question-circle"
										                                style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="per">
															所占比例
															<a-tooltip placement="right">
											                    <template slot="title">
											                        <span>
												                        在周期内所新增客户中，截止至筛选的最后一天，停留在该阶段的客户数 / 新增的客户数  （不计入流失的客户）
											                        </span>
											                    </template>
										                        <a-icon type="question-circle"
										                                style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="rate">
															阶段转化率
															<a-tooltip placement="left">
											                    <template slot="title">
											                        <span>
												                        在周期内所新增客户中，截止至筛选的最后一天，转化人数 / 转化之前停留在该阶段的客户数  （不计入流失的客户）
											                        </span>
											                    </template>
										                        <a-icon type="question-circle"
										                                style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="day">
															最长停留天数
															<a-tooltip placement="left">
											                    <template slot="title">
											                        <p style="margin-bottom: 5px;">
												                        在周期内所新增客户中，停留在截止至筛选的最后一天，取其中客户停留最长的天数，时长超过半天计入1天。
											                        </p>
												                     <p style="margin-bottom: 5px;">
												                        例如，1号-10号新增ABC三位客户，均在2号同时添加进来。
											                        </p>
												                    <p style="margin-bottom: 0px">
													                    A在2号转走；B在9号转走；C10号时未转走，但在11号转走，那么在该时间段内，C就是最长时间停留的客户，天数为8天
												                    </p>
											                    </template>
										                        <a-icon type="question-circle"
										                                style="margin-left:5px;"/>
															</a-tooltip>
														</span>
														<span slot="everyDay">
															平均停留天数
															<a-tooltip placement="left">
											                    <template slot="title">
												                     <p style="margin-bottom: 5px;">
												                        在周期内所新增客户中，每个客户停留在截止至筛选的最后一天的最长时间停留天数 / 新增的客户数。
											                        </p>
												                     <p style="margin-bottom: 5px;">
												                        例如，1号-10号新增ABC三位客户，均在2号同时添加进来。
											                        </p>
												                    <p style="margin-bottom: 0px">
													                    A在2号转走；B在9号转走；C10号时未转走，但在11号转走，那么在该时间段内，平均停留天数为 【0天（A客户）+7天（B客户）+8天（C客户）】/ 3人=5天/人
												                    </p>
											                    </template>
										                        <a-icon type="question-circle"
										                                style="margin-left:5px;"/>
															</a-tooltip>
														</span>
													</a-table>
												</div>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="成员TOP10" key="1">
										<div class="fansgrow-contain">
											<div class="fans-data-trend">
												<div style="margin-bottom: 15px;">
													<h4>在{{startValue}}至{{endValue}}内，<span style="color: #FF562D;">{{username}}</span>跟进排行情况
													</h4>
												</div>
												<div style="text-align: center;">
													<span style="cursor: pointer;" @click="changeBarType(1)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 20px;"
														      :style="{ 'background': fansAdd.data_Type == 1 ? '#3398DB' : '#CCC' }">
														</span>
														未跟进客户数
														<a-tooltip placement="top">
										                    <template slot="title">
										                      <span>
											                      距上次添加跟进记录的时间到当前筛选时间的最后一天，超过天数未跟进的客户人数。例如：上次跟进时间是1号10:30，筛选时间是从4号~10号，那么截止在10日，该客户最长已有9天未联系。
										                      </span>
										                    </template>
										                    <a-icon type="question-circle" style="margin: 0 5px;"/>
														</a-tooltip>
													</span>
													<a-select v-if="fansAdd.data_Type == 1"
													          style="width: 130px;height: 30px;"
													          v-model="fansAdd.follow_status"
													          :dropdownStyle="{width: '130px'}"
													          @change="getTop10(0)"
													          placeholder="全部状态"
													>
														<a-select-option :value="0">全部状态</a-select-option>
														<a-select-option v-for="item in follows" :value="item.id">
															{{item.title}}
														</a-select-option>
													</a-select>
													<span style="cursor: pointer;" @click="changeBarType(2)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 20px;"
														      :style="{ 'background': fansAdd.data_Type == 2 ? '#AD85F4' : '#CCC' }">
														</span>
														跟进客户数
														<a-tooltip placement="top">
										                    <template slot="title">
										                      <span>
											                      统计周期内对客户跟进的人数，同一客户被多个员工跟进，重复计入。
										                      </span>
										                    </template>
										                    <a-icon type="question-circle" style="margin: 0 5px;"/>
														</a-tooltip>
													</span>
													<span style="cursor: pointer;" @click="changeBarType(3)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 20px;"
														      :style="{ 'background': fansAdd.data_Type == 3 ? '#FFC71B' : '#CCC' }">
														</span>
														跟进次数
														<a-tooltip placement="top">
										                    <template slot="title">
										                      <span>
											                      统计周期内对客户添加跟进的次数，同一客户多次添加，重复计入。
										                      </span>
										                    </template>
										                    <a-icon type="question-circle" style="margin-left:5px;"/>
														</a-tooltip>
													</span>
												</div>
												<div style="text-align: center;margin-top: 26px;"
												     v-if="fansAdd.data_Type == 1">
													<span
															style="cursor: pointer;margin: 0 10px;"
															@click="changeDayId(-1, '全部未跟进客户数')">
														<span :style="{ 'color': fansAdd.dayid == -1 ? '#3398DB' : '#CCC' }">
															-<span
																style="width: 12px;height: 12px;display: inline-block;margin: -2px 0 0;border-radius: 50%;vertical-align: middle;"
																:style="{ 'border' : ('1px solid ' + (fansAdd.dayid == -1 ? '#3398DB' : '#CCC')) }">
															</span>-
														</span>
														全部未跟进
													</span>
													<span v-for="item in notFollowDay"
													      style="cursor: pointer;margin: 0 10px;"
													      @click="changeDayId(item.id, item.name+'客户数')">
														<span :style="{ 'color': fansAdd.dayid == item.id ? '#3398DB' : '#CCC' }">
															-<span
																style="width: 12px;height: 12px;display: inline-block;margin: -2px 0 0;border-radius: 50%;vertical-align: middle;"
																:style="{ 'border' : ('1px solid ' + (fansAdd.dayid == item.id ? '#3398DB' : '#CCC')) }">
															</span>-
														</span>
														{{item.name}}
													</span>
												</div>
												<BarCharts v-if="tabKey == 1" style="width:100%;margin-top: 20px;"
												           :options="fansAdd"
												           v-show="fansAdd.seriesData.length != 0 && hasCorp"
												>
												</BarCharts>
												<a-empty v-show="!hasCorp || fansAdd.seriesData.length == 0"
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
													<a-table
															:columns="fansAdd.data_Type == 1 ? (fansAdd.dayid == -1 ? fansTable.columns1 : fansTable.columns ): fansTable.columns1"
															:dataSource="fansTable.list"
															:rowClassName="rowClassName"
															:pagination="false">

														<span slot="all_num">
															<span v-if="fansAdd.data_Type == 1">
																未跟进客户数
																<a-tooltip placement="top">
												                    <template slot="title">
												                        <span>
													                        距上次添加跟进记录的时间到当前筛选时间的最后一天，超过天数未跟进的客户人数。例如：上次跟进时间是1号10:30，筛选时间是从4号~10号，那么截止在10日，该客户最长已有9天未联系。
												                        </span>
												                    </template>
											                    <a-icon type="question-circle"
											                            style="margin-left:5px;"/>
														</a-tooltip>
															</span>
															<span v-if="fansAdd.data_Type == 2">
																跟进客户数
																<a-tooltip placement="top">
												                    <template slot="title">
												                      <span>
													                      统计周期内对客户跟进的人数，同一客户被多个员工跟进，重复计入。
												                      </span>
												                    </template>
												                    <a-icon type="question-circle"
												                            style="margin-left:5px;"/>
																</a-tooltip>
															</span>
															<span v-if="fansAdd.data_Type == 3">
																跟进次数
																<a-tooltip placement="top">
												                    <template slot="title">
												                      <span>
													                      统计周期内对客户添加跟进的次数，同一客户多次添加，重复计入。
												                      </span>
												                    </template>
												                    <a-icon type="question-circle"
												                            style="margin-left:5px;"/>
																</a-tooltip>
															</span>
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
									<a-tab-pane tab="跟进走势" key="2">
										<div class="fans-data-trend">
											<div style="margin-bottom: 20px;">
												<h4>在{{startValue}}至{{endValue}}内，<span style="color: #FF562D;">{{username}}</span>跟进走势情况
												</h4>
											</div>
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
											<div style="text-align: center;margin-bottom: 20px;">
													<span v-for="item in notFollowDay"
													      style="cursor: pointer;margin: 0 10px;"
													      @click="changeDayId2(item.id)">
														<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
														      :style="{ 'background': fansAdd2.dayid == item.id ? '#3398DB' : '#CCC' }">
														</span>
														{{item.name}}
													</span>
											</div>
											<div>
												<PieCharts
														v-if="fansAttrAddSourceEChartsType && fansAdd2.pie.seriesData.length > 0 && hasCorp"
														:options="fansAdd2.pie"
												>
												</PieCharts>
												<LineChartsForLegend
														v-if="!fansAttrAddSourceEChartsType && fansAdd2.line.seriesData.length > 0 && hasCorp"
														:options="fansAdd2.line"
												>
												</LineChartsForLegend>
												<a-empty
														v-show="!hasCorp"
														style="margin-top: 30px;">
													<span slot="description" style="color: #999;">暂无数据</span>
												</a-empty>
											</div>
										</div>
										<div class="fans-data-detail notFollowTable">
											<div class="title-contain">
												<div class="fans-type">
													<button :class="notFollowType == 2 ? 'fans-type-selected' : ''"
													        @click="changeNotFollowType(2)">
														按日期
													</button>
													<button :class="notFollowType == 1 ? 'fans-type-selected' : ''"
													        @click="changeNotFollowType(1)">
														按员工
													</button>
												</div>
												<a-button @click="exportNotFollow" type="primary"
												          >
													导出数据
												</a-button>
											</div>
											<div>
												<a-select
														style="width: 210px; margin-bottom: 10px;"
														v-model="fansAdd2.notFollow_status"
														:dropdownStyle="{width: '200px'}"
														@change="getNotFollowList(0)"
														placeholder="全部状态"
												>
													<a-select-option :value="0">全部状态</a-select-option>
													<a-select-option v-for="item in follows" :value="item.id">
														{{item.title}}
													</a-select-option>
												</a-select>
											</div>
											<div>
												<h4>在{{startValue}}至{{endValue}}内，<span style="color: #FF562D;">{{username}}</span>未跟进的情况
												</h4>
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
										<div class="newfans-sexy">
											<LineCharts
													v-if="hasCorp"
													:options="fansAdd2.followLine"
											>
											</LineCharts>
											<a-empty
													v-show="!hasCorp"
													style="margin-top: 30px;">
												<span slot="description" style="color: #999;">暂无数据</span>
											</a-empty>
										</div>
										<div class="fans-data-detail">
											<div class="title-contain">
												<div class="fans-type">
													<button :class="followType == 1?'fans-type-selected' : ''"
													        @click="changeFollowType(1)">
														按日期
													</button>
													<button :class="followType == 2?'fans-type-selected' : ''"
													        @click="changeFollowType(2)">
														按员工
													</button>
												</div>
												<a-button @click="exportFollow" type="primary"
												          >
													导出数据
												</a-button>
											</div>
											<div>
												<h4>在{{startValue}}至{{endValue}}内，<span style="color: #FF562D;">{{username}}</span>跟进的情况
												</h4>
											</div>
											<div class="content-bd">
												<a-table :columns="fansTable2Follow.columns"
												         :dataSource="fansTable2Follow.list"
												         :rowClassName="rowClassName"
												         :pagination="false">
													<span slot="name">
															<span v-if="followType == 2">员工名称</span>
															<span v-if="followType == 1">时间</span>
										                </span>
												</a-table>
												<div style="width: 100%;" v-show="fansTable2Follow.total > 0">
													<div style="height: 32px;display: inline-block;margin-top: 25px;">
														共
														<span style="color: blue">{{fansTable2Follow.total}}</span>条
													</div>
													<div class="pagination" style="margin-top: 20px;float: right;">
														<a-pagination :total="fansTable2Follow.total" showSizeChanger
														              :showQuickJumper="fansTable2Follow.quickJumper"
														              :current="fansTable2Follow.page"
														              :pageSize="fansTable2Follow.pageSize"
														              :pageSizeOptions="['10','20','30','60']"
														              @change="changeFansPage2Follow"
														              @showSizeChange="showFansSizeChange2Follow"/>
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
	import LineChartsForLegend from '../../../components/echarts/LineChartsForLegend'
	import BarCharts from '../../../components/echarts/BarCharts'
	import PieCharts from '../../../components/echarts/PieCharts'
	import FunnelCharts from "../../../components/echarts/FunnelCharts";
	import MapCharts from '../../../components/echarts/MapChart'
	import BarShadowCharts from "../../../components/echarts/BarShadowCharts"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import corpAuthorize from "@/components/CorpAuthorize.vue"
	import moment from 'moment'

	let now = new Date(); //当前日期
	let nowDayOfWeek = now.getDay(); //今天本周的第几天
	let nowDay = now.getDate(); //当前日
	let nowMonth = now.getMonth(); //当前月
	let nowYear = now.getYear(); //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //

	let lastMonthDate = new Date(); //上月日期
	lastMonthDate.setDate(1);
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
	let lastMonth = lastMonthDate.getMonth();

	//获得某月的天数
	function getMonthDays (myMonth) {
		let monthStartDate = new Date(nowYear, myMonth, 1);
		let monthEndDate = new Date(nowYear, myMonth + 1, 1);
		let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
		return days;
	}

	//获得本周的开端日期
	function getWeekStartDate () {
		if (nowDayOfWeek == 0) {
			nowDayOfWeek = 7
		}
		let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
		return formatDateTime(weekStartDate);
	}

	/*时间戳改日期--不传第二个参数返回年月日,传第二个参数返回年月日时分秒*/
	function formatDateTime (inputTime, type) {
		let date = new Date(inputTime);
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		let minute = date.getMinutes();
		let second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		if (type) {
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//2017-12-12 12:23:34
		} else {
			return y + '-' + m + '-' + d; //2017-12-12
		}
	}

	//获得本周的停止日期
	function getWeekEndDate () {
		let weekEndDate = new Date(nowYear, nowMonth, nowDay);
		return formatDateTime(weekEndDate);
	}

	//获得本月的开端日期
	function getMonthStartDate () {
		let monthStartDate = new Date(nowYear, nowMonth, 1);
		return formatDateTime(monthStartDate);
	}

	//获得本月的停止日期
	function getMonthEndDate () {
		let monthEndDate = new Date(nowYear, nowMonth, nowDay);
		return formatDateTime(monthEndDate);
	}

	//获得上周开端时候
	function getLastWeekStartDate () {
		let lastWeekStartDate = moment().day(-6).format('YYYY-MM-DD')
		return lastWeekStartDate;
	}

	//获得上周停止时候
	function getLastWeekEndDate () {
		let lastWeekEndDate = moment().day(0).format('YYYY-MM-DD')
		return lastWeekEndDate;
	}

	//获得上月开端时候
	function getLastMonthStartDate () {
		let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
		if(lastMonth == 11) {
			lastMonthStartDate = new Date(nowYear - 1, lastMonth, 1);
		}
		return formatDateTime(lastMonthStartDate);
	}

	//获得上月停止时候
	function getLastMonthEndDate () {
		let lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
		if(lastMonth == 11) {
			lastMonthEndDate = new Date(nowYear - 1, lastMonth, getMonthDays(lastMonth));
		}
		return formatDateTime(lastMonthEndDate);
	}

	export default {
		name      : 'HomeLeftContain',
		components: {
			LineCharts,
			LineChartsForLegend,
			BarCharts,
			chooseDepartment,
			corpAuthorize,
			PieCharts,
			MapCharts,
			BarShadowCharts,
			FunnelCharts
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				chooseNumber       : 0,  //整合后传给组件的值
				chooseNum          : 0, // 部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				checkedList        : [], // 成员id列表
				user:[],//选择成员数组
				corpId             : corpId, //企业微信选中的id
				suite_id           : '',
				showWxModal        : false, // 授权弹窗
				hasCorp            : false,
				spinning           : false,
				cycleType          : '3',  // 日期类型
				startValue         : '',   // 开始时间
				endValue           : '',   // 结束时间
				username           : '所有成员',
				dateValue          : null, // 时间插件数组
				// 店铺指标总览数据
				userCount          : 0, // 客户跟进总数
				recordCount        : 0, // 跟进记录数
				todayUserCount     : 0, // 今日客户跟进人数
				todayRecordCount   : 0, // 今日客户跟进记录
				lgNum              : [],
				xlNum              : [],
				xxlNum             : [],
				followState        : [], // 状态数据
				type               : 1,//数据可见范围，1全部，2有筛选，3自己
				user_ids           : [],//筛选后的成员
				// 展示公众号id
				wxId               : "",
				tabKey             : 3,
				// 微信号左右换页
				wxList             : [], // 微信列表
				/* 成员TOP10 */
				wheelFlag          : true,
				notFollowDay       : [], // 未跟进天数
				follows            : [],
				// 成员TOP10折线图
				fansAdd            : {
					title        : '成员TOP10',
					xAxisData    : [],
					data_Type    : 1,
					dayid        : -1,
					follow_status: [],
					name         : '未跟进客户数',
					seriesData   : [
						{
							data  : [],
							name  : "成员TOP10",
							smooth: true,
							type  : "line"
						}
					]
				},
				// 成员TOP10表格
				fansTableList      : [],
				fansTable          : {
					columns1   : [
						{
							title    : "排行",
							dataIndex: "sort",
							key      : "sort",
						},
						{
							title    : "员工名称",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "跟进阶段",
							dataIndex: "status",
							key      : "status",
						},
						{
							slots    : {title: "all_num"},
							dataIndex: "count",
							key      : "count",
						}
					],
					columns    : [
						{
							title    : "排行",
							dataIndex: "sort",
							key      : "sort",
						},
						{
							title    : "员工名称",
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "跟进阶段",
							dataIndex: "status",
							key      : "status",
						},
						{
							title    : "未跟进天数",
							dataIndex: "days",
							key      : "days",
						},
						{
							slots    : {title: "all_num"},
							dataIndex: "count",
							key      : "count",
						}
					],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},

				/* 客户增长 */
				wheelFlag3    : true,
				// 客户增长折线图
				fansAdd3      : {
					title     : '销售转化漏斗',
					legendData: [],
					seriesData: [
						{
							minSize: '5%',
							name   : '当前阶段销售机会数量',
							data   : []
						}
					]
				},
				// 客户增长表格
				fansTableList3: [],
				fansTable3    : {
					columns: [
						{
							title    : "跟进阶段",
							dataIndex: "name",
							key      : "name",
						},
						{
							// title    : "客户数",
							slots    : {title: "num"},
							dataIndex: "num",
							key      : "num",
						},
						{
							// title    : "所占比例",
							slots    : {title: "per"},
							dataIndex: "per",
							key      : "per",
						},
						{
							// title    : "阶段转化率",
							slots    : {title: "rate"},
							dataIndex: "rate",
							key      : "rate",
						},
						{
							// title    : "最长停留天数",
							slots    : {title: "day"},
							dataIndex: "day",
							key      : "day"
						},
						{
							// title    : "平均停留天数",
							slots    : {title: "everyDay"},
							dataIndex: "everyDay",
							key      : "everyDay"
						}
					],
					list   : [],
				},

				/* 客户增长 */
				wheelFlag2                  : true,
				//客户增长折线图
				fansAdd2                    : {
					notFollow_status: [],
					// follow_status: [],
					dayid           : '',
					line            : {
						title     : '未跟进情况',
						legendData: ["未跟进", "已跟进"],
						xAxisData : [],
						seriesData: [
							{
								name  : "未跟进",
								type  : "line",
								smooth: true,
								data  : []
							}, {
								name  : "已跟进",
								type  : "line",
								smooth: true,
								data  : []
							}
						]
					},
					pie             : {
						title     : '未跟进情况',
						formatter : "{b} {c} 占比 {d}%",
						seriesData: []
					},
					followLine      : {
						title     : '已跟进情况',
						legendData: [],
						xAxisData : [],
						seriesData: [],
					},
				},
				notFollowType               : 2,
				followType                  : 1,
				fansAttrAddSourceEChartsType: true,
				increaseCount               : '',
				per                         : '',
				// 未跟进表格
				fansTable2                  : {
					columns    : [],
					list       : [],
					total      : 0,
					page       : 1,
					pageSize   : 10,
					quickJumper: false
				},
				fansTable2Follow            : {
					columns    : [
						{
							slots    : {title: "name"},
							dataIndex: "name",
							key      : "name",
						},
						{
							title    : "跟进客户",
							dataIndex: "userNum",
							key      : "userNum",
						},
						{
							title    : "跟进次数",
							dataIndex: "recordNum",
							key      : "recordNum",
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
			// 初始化时间
			this.startValue = getWeekStartDate()
			this.endValue = getWeekEndDate()
			this.dateValue = [moment(this.startValue, 'YYYY-MM-DD'), moment(this.endValue, 'YYYY-MM-DD')]
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
			initPage () {
				let that = this
				this.$store.dispatch('getCorp', (info) => {
					that.wxList = info
					if (that.wxList.length == 0) {
						that.hasCorp = false
						that.spinning = false
					} else {
						this.hasCorp = true
						if (that.$store.state.corpId) {
							that.wxId = that.$store.state.corpId
						} else {
							if (that.wxList && that.wxList.length > 0) {
								that.wxId = that.wxList[0].corpid
								that.wxList.map((x) => {
									if (that.wxId == x.corpid) {
										this.$store.dispatch("changeCorp", x);
									}
								})
							}
						}
						this.getNotFollowDay()
						that.getFansTop()
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
				if (!this.hasCorp) {
					this.spinning = false
					return false
				}
				const {data: res} = await this.axios.post("follow-statistic/report", {
					corp_id : this.wxId,
					uid     : localStorage.getItem('uid'),
					user_ids: this.checkedList,
					s_date  : this.startValue,
					e_date  : this.endValue
				});
				if (res.error == 0) {
					this.userCount = res.data.userCount
					this.recordCount = res.data.recordCount
					this.todayUserCount = res.data.todayUserCount
					this.todayRecordCount = res.data.todayRecordCount
					this.followState = res.data.followState
					this.type = res.data.type
					this.user_ids = res.data.user_ids
					if (this.checkedList.length == 0) {
						if (localStorage.getItem('isMasterAccount') == 1) {
							this.username = '所有成员'
						} else {
							this.username = ''
							if (this.type == 1) {
								this.username = '所有成员'
							} else if (this.type == 2) {
								if(this.user_ids.user.length <= 3 && this.user_ids.user.length > 0){
									for (let l of this.user_ids.user) {
										this.username = this.username + l + '、'
									}
									this.username = this.username.substring(0, this.username.length - 1)
								}else if(this.user_ids.user.length > 3){
									this.username = this.user_ids.user[0] + '、' + this.user_ids.user[1] + '、' + this.user_ids.user[2]+ '等' + this.user_ids.user.length + '人'
								}

								let tip = ''
								if(this.user_ids.department.length <= 3 && this.user_ids.department.length > 0){
									for (let l of this.user_ids.department) {
										tip = tip + l + '、'
									}
									tip = tip.substring(0, tip.length - 1)
								}else if(this.user_ids.department.length > 3) {
									tip = this.user_ids.department[0] + '、' + this.user_ids.department[1] + '、' + this.user_ids.department[2] + '等' + this.user_ids.department.length + '部门'
								}

								if(this.username != ''){
									if(tip != ''){
										this.username = this.username + '；' + tip
									}
								}else {
									this.username = tip
								}

							} else if (this.type == 3) {
								this.username = ''
							}
						}
					}
					if (this.followState.length >= 8) {
						this.lgNum = new Array(this.followState.length).fill(4)
						this.xlNum = new Array(this.followState.length).fill(4)
						this.xxlNum = new Array(this.followState.length).fill(3)
					} else if (this.followState.length == 7) {
						this.lgNum = new Array(this.followState.length).fill(4)
						this.xlNum = new Array(this.followState.length).fill(4)
						// this.xxlNum = new Array(this.followState.length).fill(4)
						this.xxlNum = [3, 3, 4, 4, 4, 3, 3]
					} else if (this.followState.length == 5) {
						this.lgNum = [5, 5, 4, 5, 5]
						this.xlNum = [5, 5, 4, 5, 5]
						this.xxlNum = [5, 5, 4, 5, 5]
					} else {
						this.lgNum = new Array(this.followState.length).fill(24 / (this.followState.length || 1))
						this.xlNum = new Array(this.followState.length).fill(24 / (this.followState.length || 1))
						this.xxlNum = new Array(this.followState.length).fill(24 / (this.followState.length || 1))
					}
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
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
				this.chooseNumber = this.chooseNum
			},
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.checkedList = arr
					this.user = list
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					this.username = ''
					if (this.chooseNum == 0) {
						if (localStorage.getItem('isMasterAccount') == 1) {
							this.username = '所有成员'
						} else {
							if (this.type == 1) {
								this.username = '所有成员'
							} else if (this.type == 2) {
								if(this.user_ids.user.length <= 3 && this.user_ids.user.length > 0){
									for (let l of this.user_ids.user) {
										this.username = this.username + l + '、'
									}
									this.username = this.username.substring(0, this.username.length - 1)
								}else if(this.user_ids.user.length > 3){
									this.username = this.user_ids.user[0] + '、' + this.user_ids.user[1] + '、' + this.user_ids.user[2]+ '等' + this.user_ids.user.length + '人'
								}

								let tip = ''
								if(this.user_ids.department.length <= 3 && this.user_ids.department.length > 0){
									for (let l of this.user_ids.department) {
										tip = tip + l + '、'
									}
									tip = tip.substring(0, tip.length - 1)
								}else if(this.user_ids.department.length > 3) {
									tip = this.user_ids.department[0] + '、' + this.user_ids.department[1] + '、' + this.user_ids.department[2] + '等' + this.user_ids.department.length + '部门'
								}

								if(this.username != ''){
									if(tip != ''){
										this.username = this.username + '；' + tip
									}
								}else {
									this.username = tip
								}
							} else if (this.type == 3) {
								this.username = ''
							}
						}
					} else if (this.chooseNum <= 3) {
						for (let l of list) {
							this.username = this.username + l.title + '、'
						}
						this.username = this.username.substring(0, this.username.length - 1)
					} else if (this.chooseNum > 3) {
						let userArr = []
						let departmentArr = []
						list.map(x=>{
							if(x.scopedSlots.title == 'custom'){
								userArr.push(x)
							}else if(x.scopedSlots.title == 'title'){
								departmentArr.push(x)
							}
						})
						if(userArr.length <= 3 && userArr.length > 0){
							for (let l of userArr) {
								this.username = this.username + l.title + '、'
							}
							this.username = this.username.substring(0, this.username.length - 1)
						}else if(userArr.length > 3) {
							this.username = userArr[0].title + '、' + userArr[1].title + '、' + userArr[2].title + '等' + userArr.length + '人'
						}

						let tip = ''
						if(departmentArr.length <= 3 && departmentArr.length > 0){
							for (let l of departmentArr) {
								tip = tip + l.title + '、'
							}
							tip = tip.substring(0, tip.length - 1)
						}else if(departmentArr.length > 3) {
							tip = departmentArr[0].title + '、' + departmentArr[1].title + '、' + departmentArr[2].title + '等' + departmentArr.length + '部门'
						}

						if(this.username != ''){
							if(tip != ''){
								this.username = this.username + '；' + tip
							}
						}else {
							this.username = tip
						}
					}
				}
				this.showModalDepartment = false
				this.find()
			},
			//重置
			clearDepartmentList () {
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				if (this.tabKey == 1) {
					this.getTop10(0)
				} else if (this.tabKey == 2) {
					this.getPie()
					this.getNotFollowList(0)
					this.getFollowList(0)
				} else if (this.tabKey == 3) {
					this.get3(0)
				}
			},

			//切换柱状图显示数据
			changeBarType (val) {
				if (val == 1) {
					this.fansAdd.name = '未跟进客户数'
				} else if (val == 2) {
					this.fansAdd.name = '跟进客户数'
				} else if (val == 3) {
					this.fansAdd.name = '跟进次数'
				}
				this.fansAdd.data_Type = val
				this.getTop10(0)
			},
			changeDayId (id, name) {
				this.fansAdd.dayid = id
				this.fansAdd.name = name
				this.getTop10(0)
			},
			// 成员TOP10
			async getTop10 (is_export, page = 1, pageSize = this.fansTable.pageSize) {
				this.spinning = true
				if (!this.hasCorp) {
					this.spinning = false
					return false
				}
				let that = this
				let params = {
					corp_id  : this.wxId,
					uid      : localStorage.getItem('uid'),
					user_ids : this.checkedList,
					s_date   : this.startValue,
					e_date   : this.endValue,
					follow_id: this.fansAdd.data_Type == 1 ? (this.fansAdd.follow_status ? this.fansAdd.follow_status : '0') : '0',
					is_export: is_export,
					type     : this.fansAdd.data_Type,
					status_id: this.fansAdd.dayid
				}
				if (is_export == 0) {
					params['page'] = page
					params['pageSize'] = pageSize
				}
				const {data: res} = await this.axios.post("follow-statistic/top", params);
				if (res.error == 0) {

					if (is_export != 1) {
						if (page == 1) {
							that.fansAdd.seriesData = []
							if (res.data.seriesData && res.data.seriesData.length != 0) {
								that.fansAdd.seriesData = res.data.seriesData
								that.fansAdd.xAxisData = res.data.xData
							}
						}
						that.fansTable.list = res.data.allData
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
			// 跟进走势饼图数据
			async getPie () {
				if (!this.hasCorp) {
					this.spinning = false
					return false
				}
				let that = this
				let params = {
					corp_id  : this.wxId,
					uid      : localStorage.getItem('uid'),
					user_ids : this.checkedList,
					s_date   : this.startValue,
					e_date   : this.endValue,
					status_id: this.fansAdd2.dayid
				}
				const {data: res} = await this.axios.post("follow-statistic/analysis-one", params);
				if (res.error == 0) {
					that.fansAdd2.line.legendData = res.data.legData
					that.fansAdd2.line.seriesData = res.data.seriesData
					that.fansAdd2.line.xAxisData = res.data.xData
					that.fansAdd2.pie.seriesData = res.data.pieData
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}
			},
			// 未跟进表格数据
			async getNotFollowList (is_export, page = 1, pageSize = this.fansTable2.pageSize) {
				if (!this.hasCorp) {
					this.spinning = false
					return false
				}
				this.spinning = true
				let params = {
					corp_id  : this.wxId,
					uid      : localStorage.getItem('uid'),
					user_ids : this.checkedList,
					s_date   : this.startValue,
					e_date   : this.endValue,
					follow_id: this.fansAdd2.notFollow_status ? this.fansAdd2.notFollow_status : '0',
					is_export: is_export,
					type     : this.notFollowType,
				}
				if (is_export == 0) {
					params['page'] = page
					params['pageSize'] = pageSize
				}
				const {data: res} = await this.axios.post("follow-statistic/analysis-two", params);
				if (res.error == 0) {
					if (is_export != 1) {
						this.fansTable2.columns = res.data.columns
						if (this.notFollowType == 1) {
							this.fansTable2.list = res.data.userData
						} else {
							this.fansTable2.list = res.data.dateData
						}
						this.fansTable2.page = page
						this.fansTable2.pageSize = pageSize
						this.fansTable2.total = res.data.count
					} else {
						window.open(res.data.url);
					}
					this.spinning = false
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}

			},
			// 已跟进情况
			async getFollowList (is_export, page = 1, pageSize = this.fansTable2Follow.pageSize) {
				this.spinning = true
				if (!this.hasCorp) {
					this.spinning = false
					return false
				}
				let that = this
				let params = {
					corp_id  : this.wxId,
					uid      : localStorage.getItem('uid'),
					user_ids : this.checkedList,
					s_date   : this.startValue,
					e_date   : this.endValue,
					// follow_id: this.fansAdd2.follow_status ? this.fansAdd2.follow_status : '0',
					is_export: is_export,
					type     : this.followType,
				}
				if (is_export == 0) {
					params['page'] = page
					params['pageSize'] = pageSize
				}
				const {data: res} = await this.axios.post("follow-statistic/analysis-three", params);
				if (res.error == 0) {
					if (is_export != 1) {
						that.fansAdd2.followLine.legendData = res.data.legData
						that.fansAdd2.followLine.seriesData = res.data.seriesData
						that.fansAdd2.followLine.xAxisData = res.data.xData
						that.fansTable2Follow.total = res.data.count
						if (this.followType == 1) {
							that.fansTable2Follow.list = res.data.allData
						} else if (this.followType == 2) {
							that.fansTable2Follow.list = res.data.users
						}
						that.fansTable2Follow.page = page
						that.fansTable2Follow.pageSize = pageSize
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
				if (!this.hasCorp) {
					this.spinning = false
					return false
				}
				let params = {
					corp_id  : this.wxId,
					uid      : localStorage.getItem('uid'),
					user_ids : this.checkedList,
					s_date   : this.startValue,
					e_date   : this.endValue,
					is_export: is_export,
				}
				const {data: res} = await this.axios.post("follow-statistic/hopper", params);
				if (res.error == 0) {
					if (is_export != 1) {
						this.fansAdd3.legendData = res.data.legend
						this.fansAdd3.seriesData[0].data = res.data.rate

						this.fansTable3.list = res.data.info
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
			// 成员TOP10页码改变
			changeFansPage1 (val) {
				this.getTop10(0, val, this.fansTable.pageSize)
				this.$nextTick(() => {
					let height = document.getElementsByClassName('follow-status')[0].clientHeight
					document.getElementsByClassName('scroll')[0].scrollTo(0, 850 + height)
				})
			},
			// 成员TOP10表格分页pageSize改变
			showFansSizeChange1 (page, pageSize) {
				this.getTop10(0, 1, pageSize)
			},
			// 跟进分析未跟进页码改变
			changeFansPage2 (val) {
				this.getNotFollowList(0, val, this.fansTable2.pageSize)
				this.$nextTick(() => {
					let height = document.getElementsByClassName('follow-status')[0].clientHeight
					document.getElementsByClassName('scroll')[0].scrollTo(0, 850 + height)
				})
			},
			// 跟进分析未跟进表格分页pageSize改变
			showFansSizeChange2 (page, pageSize) {
				this.getNotFollowList(0, 1, pageSize)
			},

			// 跟进分析已跟进页码改变
			changeFansPage2Follow (val) {
				this.getFollowList(0, val, this.fansTable2Follow.pageSize)
				this.$nextTick(() => {
					let height = document.getElementsByClassName('follow-status')[0].clientHeight
					let clientHeight = document.getElementsByClassName('notFollowTable')[0].clientHeight
					document.getElementsByClassName('scroll')[0].scrollTo(0, 1350 + clientHeight + height)
				})
			},
			// 跟进分析已跟进分页pageSize改变
			showFansSizeChange2Follow (page, pageSize) {
				this.getFollowList(0, 1, pageSize)
			},

			// 成员TOP10表格导出
			exportFansIncrease1 () {

				this.getTop10(1)
			},

			//  跟进分析未跟进表格导出
			exportNotFollow () {

				this.getNotFollowList(1)
			},
			// 跟进分析已跟进表格导出
			exportFollow () {
				this.getFollowList(1)
			},
			// 未跟进表格数据
			changeNotFollowType (type) {
				this.notFollowType = type
				this.getNotFollowList(0)
			},
			// 跟进分析已跟进员工日期
			changeFollowType (type) {
				this.followType = type
				this.getFollowList()
			},
			changeDayId2 (id) {
				this.fansAdd2.dayid = id
				this.getPie(0)
			},
			// 粉丝属性新增粉丝来源图切换
			changeFansAttrAddSourceEChartsType (flag) {
				if (this.fansAttrAddSourceEChartsType != flag) {
					this.fansAttrAddSourceEChartsType = flag
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
				this.wxList.map((x) => {
					if (id == x.corpid) {
						this.$store.dispatch("changeCorp", x);
					}
				})
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.getFansTop()
				if (this.tabKey == 1) {
					this.getTop10(0)
				} else if (this.tabKey == 2) {
					this.getPie(0)
					this.getNotFollowList(0)
					this.getFollowList(0)
				} else if (this.tabKey == 3) {
					this.get3(0)
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
			// 起止时间
			changeTime (date, dateString) {
				this.dateValue = date
				this.cycleType = '5'
				this.startValue = dateString[0]
				this.endValue = dateString[1]
				this.find()
			},
			disabledDate (current) {
				return current.valueOf() > new Date().getTime() || current < moment().subtract(60, "days");
			},
			//切换周期
			changeCycleType () {
				if (this.cycleType == 1) {
					this.startValue = getLastWeekStartDate()
					this.endValue = getLastWeekEndDate()
				} else if (this.cycleType == 2) {
					this.startValue = getLastMonthStartDate()
					this.endValue = getLastMonthEndDate()
				} else if (this.cycleType == 3) {
					this.startValue = getWeekStartDate()
					this.endValue = getWeekEndDate()
				} else if (this.cycleType == 4) {
					this.startValue = getMonthStartDate()
					this.endValue = getMonthEndDate()
				} else if (this.cycleType == 5) {
					this.startValue = getWeekStartDate()
					this.endValue = getWeekEndDate()
				}
				this.dateValue = [moment(this.startValue, 'YYYY-MM-DD'), moment(this.endValue, 'YYYY-MM-DD')]
				this.find()
			},
			// 查找
			find () {
				if (!this.hasCorp) {
					return false
				}
				this.getFansTop()
				if (this.tabKey == 1) {
					this.getTop10(0)
				} else if (this.tabKey == 2) {
					this.getPie(0)
					this.getNotFollowList(0)
					this.getFollowList(0)
				} else if (this.tabKey == 3) {
					this.get3(0)
				}
			},
			// 清空
			clear () {
				if (localStorage.getItem('isMasterAccount') == 1) {
					this.username = '所有成员'
				} else {
					if (this.type == 1) {
						this.username = '所有成员'
					} else if (this.type == 2) {
						if(this.user_ids.user.length <= 3 && this.user_ids.user.length > 0){
							for (let l of this.user_ids.user) {
								this.username = this.username + l + '、'
							}
							this.username = this.username.substring(0, this.username.length - 1)
						}else if(this.user_ids.user.length > 3){
							this.username = this.user_ids.user[0] + '、' + this.user_ids.user[1] + '、' + this.user_ids.user[2]+ '等' + this.user_ids.user.length + '人'
						}

						let tip = ''
						if(this.user_ids.department.length <= 3 && this.user_ids.department.length > 0){
							for (let l of this.user_ids.department) {
								tip = tip + l + '、'
							}
							tip = tip.substring(0, tip.length - 1)
						}else if(this.user_ids.department.length > 3) {
							tip = this.user_ids.department[0] + '、' + this.user_ids.department[1] + '、' + this.user_ids.department[2] + '等' + this.user_ids.department.length + '部门'
						}

						if(this.username != ''){
							if(tip != ''){
								this.username = this.username + '；' + tip
							}
						}else {
							this.username = tip
						}
					} else if (this.type == 3) {
						this.username = ''
					}
				}
				this.startValue = getWeekStartDate()
				this.endValue = getWeekEndDate()
				this.dateValue = [moment(this.startValue, 'YYYY-MM-DD'), moment(this.endValue, 'YYYY-MM-DD')]
				this.cycleType = '3'
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				if (!this.hasCorp) {
					return false
				}
				this.getFansTop()
				if (this.tabKey == 1) {
					this.getTop10(0)
				} else if (this.tabKey == 2) {
					this.getPie(0)
					this.getNotFollowList(0)
					this.getFollowList(0)
				} else if (this.tabKey == 3) {
					this.get3(0)
				}
			},
			// 切换tabs
			changeTab (key) {
				if (!this.hasCorp) {
					return false
				}
				this.spinning = true
				this.tabKey = key
				if (key == 1) {
					this.getTop10(0)
				} else if (key == 2) {
					this.getPie(0)
					this.getNotFollowList(0)
					this.getFollowList(0)
				} else if (key == 3) {
					this.get3(0)
				}
				this.spinning = false
			},
			async getNotFollowDay () {
				if (!this.hasCorp) {
					this.spinning = false
					return false
				}
				const {data: res} = await this.axios.post("follow-statistic/days",
					{
						corp_id: localStorage.getItem('corpId'),
						uid    : localStorage.getItem('uid')
					}
				);
				if (res.error == 0) {
					this.notFollowDay = res.data
					this.fansAdd.dayid = -1
					this.fansAdd2.dayid = this.notFollowDay.length > 0 ? this.notFollowDay[0].id : ''
					this.fansAdd.name = this.notFollowDay.length > 0 ? this.notFollowDay[0].name : ''
				} else {
					this.spinning = false
					this.$message.error(res.error_msg);
				}
				this.getFollowStatus()
			},
			// 获取跟进状态
			async getFollowStatus () {
				if (!this.hasCorp) {
					this.spinning = false
					return false
				}
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
					this.fansAdd.follow_status = 0
					this.fansAdd2.notFollow_status = 0
					// this.fansAdd2.follow_status = 0
					this.get3(0)
				}
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
		width: 100%;
		background: #F9F9F9;
	}

	.single-accout-card::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
		height: 10px;
	}

	.single-accout-card .single-accout-cardItem {
		/*width: 25%;*/
		display: inline-block;
		height: 120px;
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
		padding: 19px 24px;
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

	/deep/ .ant-radio-button-wrapper {
		padding: 0 10px;
		width: auto;
	}

	/deep/ .ant-select-dropdown {
		z-index: 99999999999;
	}
</style>
