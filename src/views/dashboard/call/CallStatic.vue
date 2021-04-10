<template>
	<div class="list">
		<a-layout class="fans-content">
			<!-- 头部 -->
			<a-layout-header>
				{{isDetail?name:'呼叫统计'}}
				<a-button type="primary" icon="rollback" style="margin:9px 0;font-size: 14px;float: right;"
				          v-if="isDetail"
				          @click="goBack">返回列表
				</a-button>
			</a-layout-header>
			<a-layout-content>
				<div class="header" v-show="!isDetail">
					<div class="static">
						<div class="static_content" v-if="statisList.total">
							<div style="font-size:14px">昨日总拨打次数(次)
								<a-tooltip placement="right">
									<template slot="title">
										<div>拨打电话的总次数（包含未接通）</div>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-tooltip>
							</div>
							<div style="font-size:18px;font-weight: 700">{{statisList.total.count}}</div>
							<div style="display: flex;justify-content: flex-start;align-items: center;">
								<span>比前日</span>
								<img src="../../../assets/home/img/arrowdown.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.total.status==-1"/>
								<img src="../../../assets/home/img/arrowup.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.total.status==1"/>
								<span>{{statisList.total.per}}</span>
							</div>
							<div>
								<span>{{statisList.total.text}}</span>
							</div>
						</div>
						<div class="static_content" v-if="statisList.connect">
							<div style="font-size:14px">昨日接通数
								<a-tooltip placement="right">
									<template slot="title">
										<div>电话接通的次数</div>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-tooltip>
							</div>
							<div style="font-size:18px;font-weight: 700">{{statisList.connect.count}}</div>
							<div style="display: flex;justify-content: flex-start;align-items: center;">
								<span>比前日</span>
								<img src="../../../assets/home/img/arrowdown.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.connect.status==-1"/>
								<img src="../../../assets/home/img/arrowup.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.connect.status==1"/>
								<span>{{statisList.connect.per}}</span>
							</div>
							<div>
								<span>{{statisList.connect.text}}</span>
							</div>
						</div>
						<div class="static_content" v-if="statisList.unconnect">
							<div style="font-size:14px">昨日未接通数
								<a-tooltip placement="right">
									<template slot="title">
										<div>电话未接通的次数</div>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-tooltip>
							</div>
							<div style="font-size:18px;font-weight: 700">{{statisList.unconnect.count}}</div>
							<div style="display: flex;justify-content: flex-start;align-items: center;">
								<span>比前日</span>
								<img src="../../../assets/home/img/arrowdown.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.unconnect.status==-1"/>
								<img src="../../../assets/home/img/arrowup.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.unconnect.status==1"/>
								<span>{{statisList.unconnect.per}}</span>
							</div>
							<div>
								<span>{{statisList.unconnect.text}}</span>
							</div>
						</div>
						<div class="static_content" v-if="statisList.connect_prob">
							<div style="font-size:14px">昨日接通率
								<a-tooltip placement="right">
									<template slot="title">
										<div>接通次数/拨打次数</div>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-tooltip>
							</div>
							<div style="font-size:18px;font-weight: 700">{{statisList.connect_prob.count}}</div>
							<div style="display: flex;justify-content: flex-start;align-items: center;">
								<span>比前日</span>
								<img src="../../../assets/home/img/arrowdown.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.connect_prob.status==-1"/>
								<img src="../../../assets/home/img/arrowup.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.connect_prob.status==1"/>
								<span>{{statisList.connect_prob.per}}</span>
							</div>
							<div>
								<span>{{statisList.connect_prob.text}}</span>
							</div>
						</div>
						<div class="static_content" v-if="statisList.duration">
							<div style="font-size:14px">昨日计费通话时长
								<a-tooltip placement="right">
									<template slot="title">
										<div>通话时长不满1分钟，则按1分钟计时</div>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-tooltip>
							</div>
							<div style="font-size:18px;font-weight: 700">
								{{statisList.duration.count?statisList.duration.count:0}}
							</div>
							<div style="display: flex;justify-content: flex-start;align-items: center;">
								<span>比前日</span>
								<img src="../../../assets/home/img/arrowdown.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.duration.status==-1"/>
								<img src="../../../assets/home/img/arrowup.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.duration.status==1"/>
								<span>{{statisList.duration.per}}</span>
							</div>

							<div>
								<span>{{statisList.duration.text}}</span>
							</div>
						</div>
						<div class="static_content" v-if="statisList.avg_duration">
							<div style="font-size:14px">昨日平均计费通话时长
								<a-tooltip placement="right">
									<template slot="title">
										<div>计费通话时长/接通数。通话时长不满1分钟，则按1分钟计时</div>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-tooltip>
							</div>
							<div style="font-size:18px;font-weight: 700">
								{{statisList.avg_duration.count?statisList.avg_duration.count:0}}
							</div>
							<div style="display: flex;justify-content: flex-start;align-items: center;">
								<span>比前日</span>
								<img src="../../../assets/home/img/arrowdown.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.avg_duration.status==-1"/>
								<img src="../../../assets/home/img/arrowup.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.avg_duration.status==1"/>

								<span>{{statisList.avg_duration.per}}</span>
							</div>
							<div>
								<span>{{statisList.avg_duration.text}}</span>
							</div>
						</div>
					</div>

					<div class="static" style="justify-content: flex-start;margin-top: 0.5rem">
						<div class="static_content" style="margin:7px 16px 10px 7px" v-if="statisList.duration_turth">
							<div style="font-size:14px">昨日实际通话时长
								<a-tooltip placement="right">
									<template slot="title">
										<div>实际通话时长</div>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-tooltip>
							</div>
							<div style="font-size:18px;font-weight: 700">
								{{statisList.duration_turth.count?statisList.duration_turth.count:0}}
							</div>
							<div style="display: flex;justify-content: flex-start;align-items: center;">
								<span>比前日</span>
								<img src="../../../assets/home/img/arrowdown.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.duration_turth.status==-1"/>
								<img src="../../../assets/home/img/arrowup.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.duration_turth.status==1"/>

								<span>{{statisList.duration_turth.per}}</span>
							</div>
							<div>
								<span>{{statisList.duration_turth.text}}</span>
							</div>
						</div>
						<div class="static_content" v-if="statisList.avg_duration_turth">
							<div style="font-size:14px">昨日平均实际通话时长
								<a-tooltip placement="right">
									<template slot="title">
										<div>实际通话时长/接通数</div>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-tooltip>
							</div>
							<div style="font-size:18px;font-weight: 700">
								{{statisList.avg_duration_turth.count?statisList.avg_duration_turth.count:0}}
							</div>
							<div style="display: flex;justify-content: flex-start;align-items: center;">
								<span>比前日</span>
								<img src="../../../assets/home/img/arrowdown.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.avg_duration_turth.status==-1"/>
								<img src="../../../assets/home/img/arrowup.png" style="width: 10px;margin: 0 3px"
								     v-if="statisList.avg_duration_turth.status==1"/>
								<span>{{statisList.avg_duration_turth.per}}</span>
							</div>
							<div>
								<span>{{statisList.avg_duration_turth.text}}</span>
							</div>
						</div>
					</div>

					<div class="head_search">
						<!--						<a-button :class="listQuery.staffType== 0? 'caledar-btn-selected': '' "-->
						<!--						          @click="changeType('staffType',0)">-->
						<!--							员工-->
						<!--						</a-button>-->

						<!--						<a-button :class="listQuery.staffType== 1? 'caledar-btn-selected': '' "-->
						<!--						          style="margin: 0 10px"-->
						<!--						          @click="changeType('staffType',1)">-->
						<!--							部门-->
						<!--						</a-button>-->
						<div class="search_card">
							<div class="search_content">
								<a-select
										showSearch allowClear
										placeholder="请选择时间段"
										optionFilterProp="children"
										v-model="listQuery.timeRange">
									<template v-for="item in timeList">
										<a-select-option :value="item.value">
											{{ item.title }}
										</a-select-option>
									</template>
								</a-select>
							</div>
							<div class="search_content">
								<a-select
										showSearch allowClear
										placeholder="请选择时长"
										optionFilterProp="children"
										v-model="listQuery.timeScope">
									<template v-for="item in timeRangeList">
										<a-select-option :value="item.value">
											{{ item.title }}
										</a-select-option>
									</template>
								</a-select>
							</div>
							<div class="search_content" style="width: auto;margin-right: 0.5rem">
								<a-button style="overflow: hidden;text-overflow: ellipsis;"
								          @click="showDepartmentModel()">
									<span v-if="listQuery.staffList&&listQuery.staffList.length > 0">
										已选择{{listQuery.staff_userNum}}名成员，{{listQuery.staff_departmentNum}}个部门
									</span>
									<span v-else>选择成员</span>
								</a-button>
							</div>
							<div class="search_content" style="width: 20%">
								<a-range-picker v-model="time" @change="handleTimeChange"
								                style="width: 94%;padding: 0"/>
							</div>
							<div class="search_content" style="width: auto;margin-right: 0.5rem;">
									<span>
										<a-radio-group v-model="last_time" @change="handleTimeRange">
											<a-radio-button :value="0">昨日</a-radio-button>
											<a-radio-button :value="1">今日</a-radio-button>
											<a-radio-button :value="2">本周</a-radio-button>
											<a-radio-button :value="3">本月</a-radio-button>
											<a-radio-button :value="4">自定义</a-radio-button>
										</a-radio-group>
									</span>
								<!--							<span>时间筛选：</span>-->
							</div>

							<div class="search_content" style="width:auto;text-align: left">
								<a-button type="primary" @click="search">查找
								</a-button>
								<a-button style="margin:0 0.5rem" @click="clear">清空</a-button>
							</div>
						</div>

						<div style="margin: 1rem 0 0 0;background-color: #F5F5F5;height: 40px">
							<span @click="changeType('chartType',0)" class="tabBtn"
							      :class="{activeBtn:listQuery.chartType == 0}">排行榜</span>
							<span @click="changeType('chartType',1)" class="tabBtn"
							      :class="{activeBtn:listQuery.chartType == 1}">趋势图</span>
							<span @click="changeType('chartType',2)" class="tabBtn"
							      :class="{activeBtn:listQuery.chartType == 2||listQuery.chartType == 3}">地区分布</span>
						</div>
					</div>

					<a-spin tip="Loading..." size="large" :spinning="listLoading">
						<div class="chart">
							<div style="text-align: center;" v-if="listQuery.chartType!==2">
									<span style="cursor: pointer;" @click="changeType('dataType','total','总拨打次数')">
										<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
										      :style="{ 'background': listQuery.dataType == 'total' ? '#3398DB' : '#CCC' }"></span>
									总拨打次数</span>
								<span style="cursor: pointer;" @click="changeType('dataType','connect','接通数')">
										<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
										      :style="{ 'background': listQuery.dataType == 'connect' ? '#3398DB' : '#CCC' }"></span>
									接通数</span>
								<span style="cursor: pointer;" @click="changeType('dataType','unconnect','未接通数')">
										<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
										      :style="{ 'background': listQuery.dataType == 'unconnect' ? '#3398DB' : '#CCC' }"></span>
									未接通数</span>
								<span style="cursor: pointer;" @click="changeType('dataType','connect_prob','接通率')"
								      v-if="listQuery.chartType!==3">
										<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
										      :style="{ 'background': listQuery.dataType == 'connect_prob' ? '#3398DB' : '#CCC' }"></span>
									接通率</span>

								<span style="cursor: pointer;" @click="changeType('dataType','duration','计费通话时长')"
								      v-if="listQuery.chartType!==3">
										<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
										      :style="{ 'background': listQuery.dataType == 'duration' ? '#3398DB' : '#CCC' }"></span>
									计费通话时长</span>
								<span style="cursor: pointer;" @click="changeType('dataType','avg_duration','平均计费通话时长')"
								      v-if="listQuery.chartType!==3">
										<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
										      :style="{ 'background': listQuery.dataType == 'avg_duration' ? '#3398DB' : '#CCC' }"></span>
									平均计费通话时长</span>
								<span style="cursor: pointer;"
								      @click="changeType('dataType','duration_turth','实际通话时长')"
								      v-if="listQuery.chartType!==3">
										<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
										      :style="{ 'background': listQuery.dataType == 'duration_turth' ? '#3398DB' : '#CCC' }"></span>
									实际通话时长</span>
								<span style="cursor: pointer;"
								      @click="changeType('dataType','avg_duration_turth','平均实际通话时长')"
								      v-if="listQuery.chartType!==3">
										<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"
										      :style="{ 'background': listQuery.dataType == 'avg_duration_turth' ? '#3398DB' : '#CCC' }"></span>
									平均实际通话时长</span>
								<!--								<span style="cursor: pointer;" @click="changeType('dataType','satisfy')"-->
								<!--								      v-if="listQuery.chartType!==3">-->
								<!--										<span style="width: 20px;height: 12px;display: inline-block;margin: 0 5px 0 10px;"-->
								<!--										      :style="{ 'background': listQuery.dataType == 'satisfy' ? '#3398DB' : '#CCC' }"></span>-->
								<!--									满意度-->
								<!--								</span>-->

							</div>
							<div v-if="listQuery.chartType==2" style="text-align: center">
								<a-button :class="listQuery.dataType== 'total'? 'caledar-btn-selected': '' "
								          @click="changeType('dataType','total','全部')">
									全部
								</a-button>
								<a-button :class="listQuery.dataType== 'connect'? 'caledar-btn-selected': '' "
								          style="margin: 0 10px"
								          @click="changeType('dataType','connect','接通')">
									接通
								</a-button>
								<a-button :class="listQuery.dataType== 'unconnect'? 'caledar-btn-selected': '' "
								          @click="changeType('dataType','unconnect','未接通')">
									未接通
								</a-button>
							</div>

							<div v-if="listQuery.chartType==2||listQuery.chartType==3"
							     style="text-align: center;margin-top: 10px">
								<span @click="changeType('chartType',2)" class="tabLine"
								      :class="{activeLine:listQuery.chartType == 2}">饼图</span>
								<span @click="changeType('chartType',3)" class="tabLine"
								      :class="{activeLine:listQuery.chartType == 3}">柱状图</span>
							</div>

							<BarCharts style="width:100%;" :options="barData"
							           v-if="this.listQuery.chartType==0||listQuery.chartType==3">
							</BarCharts>

							<LineCharts v-if="this.listQuery.chartType==1"
							            :options="lineData" style="width:100%;"
							>
							</LineCharts>

							<PieCharts v-if="this.listQuery.chartType==2"
							           :options="pieData"
							>
							</PieCharts>

						</div>
						<div v-if="listQuery.chartType==1">
							<span style="font-weight: 700;font-size: 14px;margin-left: 0.8rem">
								当前结果:</span>
							<span>{{result}}</span>
						</div>
						<div style="float: right">
							<a-button type="primary" icon="download" style="margin: 0 15px 10px 0;" @click="exportData">
								导出
							</a-button>
						</div>
						<div class="content_table">
							<div style="margin-bottom: 10px" v-if="listQuery.chartType==1">
								<a-button :class="listQuery.sortType== 0? 'caledar-btn-selected': '' "
								          @click="changeType('sortType',0)">
									按时间
								</a-button>
								<a-button :class="listQuery.sortType== 1? 'caledar-btn-selected': '' "
								          @click="changeType('sortType',1)" v-if="listQuery.staffType==0">
									按成员
								</a-button>
								<a-button :class="listQuery.sortType== 2? 'caledar-btn-selected': '' "
								          @click="changeType('sortType',2)" v-if="listQuery.staffType==1">
									按部门
								</a-button>
							</div>

							<a-table :data-source="tableList" :pagination="false"
							         @change="sortTable" :rowClassName="rowClassName">
								<a-table-column key="ranking" title="排行" data-index="ranking"
								                v-if="listQuery.chartType != 1">
									<template slot-scope="text,record">
										<span>{{record.ranking}}</span>
									</template>
								</a-table-column>
								<a-table-column key="duration_date" title="时间" data-index="duration_date"
								                v-if="listQuery.chartType == 0">
									<template slot-scope="text,record">
										<span>{{record.duration_date?record.duration_date:'--'}}</span>
									</template>
								</a-table-column>

								<a-table-column key="total" title="总拨打次数" data-index="total" sorter="true"
								                v-if="listQuery.chartType == 0&&listQuery.dataType=='total'">
									<template slot-scope="text,record">
										<span>{{record.total}}</span>
									</template>
								</a-table-column>
								<a-table-column key="connect" title="接通数" data-index="connect" sorter="true"
								                v-if="listQuery.chartType == 0&&listQuery.dataType=='connect'">
									<template slot-scope="text,record">
										<span>{{record.connect}}</span>
									</template>
								</a-table-column>
								<a-table-column key="unconnect" title="未接通数" data-index="unconnect" sorter="true"
								                v-if="listQuery.chartType == 0&&listQuery.dataType=='unconnect'">
									<template slot-scope="text,record">
										<span>{{record.unconnect}}</span>
									</template>
								</a-table-column>

								<a-table-column key="connect_prob" title="接通率" data-index="connect_prob" sorter="true"
								                v-if="listQuery.chartType == 0&&listQuery.dataType=='connect_prob'">
									<template slot-scope="text,record">
										<span>{{record.connect_prob}}</span>
									</template>
								</a-table-column>
								<a-table-column key="duration" title="计费通话时长" data-index="duration" sorter="true"
								                v-if="listQuery.chartType == 0&&listQuery.dataType=='duration'">
									<template slot-scope="text,record">
										<span>{{record.duration}}</span>
									</template>
								</a-table-column>
								<a-table-column key="avg_duration" title="平均计费通话时长" data-index="avg_duration"
								                sorter="true"
								                v-if="listQuery.chartType == 0&&listQuery.dataType=='avg_duration'">
									<template slot-scope="text,record">
										<span>{{record.avg_duration}}</span>
									</template>
								</a-table-column>

								<a-table-column key="duration_turth" title="实际通话时长" data-index="duration_turth"
								                sorter="true"
								                v-if="listQuery.chartType == 0&&listQuery.dataType=='duration_turth'">
									<template slot-scope="text,record">
										<span>{{record.duration_turth}}</span>
									</template>
								</a-table-column>
								<a-table-column key="avg_duration_turth" title="平均实际通话时长"
								                data-index="avg_duration_turth"
								                sorter="true"
								                v-if="listQuery.chartType == 0&&listQuery.dataType=='avg_duration_turth'">
									<template slot-scope="text,record">
										<span>{{record.avg_duration_turth}}</span>
									</template>
								</a-table-column>

								<a-table-column key="name" title="成员" data-index="name"
								                v-if="listQuery.chartType == 0">
									<template slot-scope="text,record">
										<a-tag color="orange">
											{{record.name}}
										</a-tag>
									</template>
								</a-table-column>
								<a-table-column key="duration_date" title="日期" data-index="duration_date" sorter="true"
								                v-if="listQuery.chartType == 1&&listQuery.sortType==0">
									<template slot-scope="text,record">
										<span>{{record.key?record.key:'--'}}</span>
									</template>
								</a-table-column>
								<a-table-column key="name" title="成员" data-index="name" sorter="true"
								                v-if="listQuery.chartType == 1&&listQuery.sortType==1">
									<template slot-scope="text,record">
										<span>{{record.name}}</span>
									</template>
								</a-table-column>
								<a-table-column key="name" title="部门" data-index="name" sorter="true"
								                v-if="listQuery.chartType == 1&&listQuery.sortType==2">
									<template slot-scope="text,record">
										<span>{{record.name}}</span>
									</template>
								</a-table-column>
								<a-table-column key="total" title="总拨打次数" data-index="total" sorter="true"
								                v-if="listQuery.chartType == 1">
									<template slot-scope="text,record">
										<span>{{record.total}}</span>
									</template>
								</a-table-column>
								<a-table-column key="connect" title="接通数" data-index="connect" sorter="true"
								                v-if="listQuery.chartType == 1">
									<template slot-scope="text,record">
										<span>{{record.connect}}</span>
									</template>
								</a-table-column>
								<a-table-column key="unconnect" title="未接通数" data-index="unconnect" sorter="true"
								                v-if="listQuery.chartType == 1">
									<template slot-scope="text,record">
										<span>{{record.unconnect}}</span>
									</template>
								</a-table-column>
								<a-table-column key="connect_prob" title="接通率" data-index="connect_prob" sorter="true"
								                v-if="listQuery.chartType == 1">
									<template slot-scope="text,record">
										<span>{{record.connect_prob}}</span>
									</template>
								</a-table-column>
								<a-table-column key="duration_turth" title="实际总通话时长" data-index="duration_turth"
								                sorter="true"
								                v-if="listQuery.chartType == 1">
									<template slot-scope="text,record">
										<span>{{record.duration_turth?record.duration_turth:'--'}}</span>
									</template>
								</a-table-column>

								<a-table-column key="avg_duration_turth" title="平均实际通话时长"
								                data-index="avg_duration_turth"
								                sorter="true"
								                v-if="listQuery.chartType == 1">
									<template slot-scope="text,record">
										<span>{{record.avg_duration_turth?record.avg_duration_turth:'--'}}</span>
									</template>
								</a-table-column>

								<a-table-column key="duration" title="总计费通话时长" data-index="duration" sorter="true"
								                v-if="listQuery.chartType == 1">
									<template slot-scope="text,record">
										<span>{{record.duration?record.duration:'--'}}</span>
									</template>
								</a-table-column>

								<a-table-column key="avg_duration" title="平均计费通话时长" data-index="avg_duration"
								                sorter="true"
								                v-if="listQuery.chartType == 1">
									<template slot-scope="text,record">
										<span>{{record.avg_duration?record.avg_duration:'--'}}</span>
									</template>
								</a-table-column>
								<!--								<a-table-column key="satisfy" title="满意度" data-index="satisfy" sorter="true"-->
								<!--								                v-if="listQuery.chartType == 1">-->
								<!--									<template slot-scope="text,record">-->
								<!--										<span>{{record.satisfy?record.satisfy:'&#45;&#45;'}}</span>-->
								<!--									</template>-->
								<!--								</a-table-column>-->
								<a-table-column key="province" title="地区" data-index="province"
								                v-if="listQuery.chartType == 2||listQuery.chartType == 3">
									<template slot-scope="text,record">
										<span>{{record.province}}</span>
									</template>
								</a-table-column>
								<a-table-column key="num" title="总拨打次数" data-index="num" sorter="true"
								                v-if="(listQuery.chartType == 2||listQuery.chartType == 3)&&listQuery.dataType=='total'">
									<template slot-scope="text,record">
										<span>{{record.num}}</span>
									</template>
								</a-table-column>
								<a-table-column key="connect" title="接通数" data-index="connect" sorter="true"
								                v-if="(listQuery.chartType == 2||listQuery.chartType == 3)&&listQuery.dataType=='connect'">
									<template slot-scope="text,record">
										<span>{{record.num}}</span>
									</template>
								</a-table-column>
								<a-table-column key="unconnect" title="未接通数" data-index="unconnect" sorter="true"
								                v-if="(listQuery.chartType == 2||listQuery.chartType == 3)&&listQuery.dataType=='unconnect'">
									<template slot-scope="text,record">
										<span>{{record.num}}</span>
									</template>
								</a-table-column>
								<a-table-column key="pre" title="占比" data-index="pre" sorter="true"
								                v-if="listQuery.chartType == 2||listQuery.chartType == 3">
									<template slot-scope="text,record">
										<span>{{record.pre}}</span>

									</template>
								</a-table-column>
								<a-table-column key="action" title="操作" data-index="action"
								                v-if="listQuery.chartType == 1">
									<template slot-scope="text,record">
										<a-button @click="checkDetail(record)">查看详情</a-button>
									</template>
								</a-table-column>
							</a-table>
							<div class="pagination" style="display: flex;justify-content: space-between;margin: 20px 0"
							     v-if="tableList.length>0">
								<div style="height: 32px;line-height: 32px;">
									共<span style="color: blue">{{ total }}</span>条
								</div>
								<div style="height: 32px;">
									<a-pagination :total="total" showSizeChanger :showQuickJumper="false"
									              v-model="listQuery.page"
									              :current="1"
									              :pageSize="listQuery.page_size"
									              :pageSizeOptions="['15','30','50','100']"
									              @change="changePage"
									              @showSizeChange="showSizeChange"/>
								</div>
							</div>
						</div>
					</a-spin>
				</div>
				<div class="header" v-show="isDetail">
					<div style="float: right">
						<a-button type="primary" icon="download" style="margin: 0 15px 10px 0;" @click="exportData1">
							导出
						</a-button>
					</div>
					<a-table :data-source="detailList" :pagination="false"
					         @change="sortTable1" :rowClassName="rowClassName">
						<a-table-column key="name" title="成员" data-index="name"
						                v-if="listQuery.sortType == 0">
							<template slot-scope="text,record">
								<span>{{record.name}}</span>
							</template>
						</a-table-column>
						<a-table-column key="key" title="时间" data-index="key"
						                v-if="listQuery.sortType != 0" sorter="true">
							<template slot-scope="text,record">
								<span>{{record.key?record.key:'--'}}</span>
							</template>
						</a-table-column>

						<a-table-column key="total" title="总拨打次数" data-index="total" sorter="true">
							<template slot-scope="text,record">
								<span>{{record.total}}</span>
							</template>
						</a-table-column>

						<a-table-column key="connect" title="接通数" data-index="connect" sorter="true">
							<template slot-scope="text,record">
								<span>{{record.connect}}</span>
							</template>
						</a-table-column>
						<a-table-column key="unconnect" title="未接通数" data-index="unconnect" sorter="true">
							<template slot-scope="text,record">
								<span>{{record.unconnect}}</span>
							</template>
						</a-table-column>
						<a-table-column key="connect_prob" title="接通率" data-index="connect_prob" sorter="true">
							<template slot-scope="text,record">
								<span>{{record.connect_prob}}</span>
							</template>
						</a-table-column>

						<a-table-column key="duration_turth" title="实际总通话时长" data-index="duration_turth" sorter="true">
							<template slot-scope="text,record">
								<span>{{record.duration_turth?record.duration_turth:'--'}}</span>
							</template>
						</a-table-column>

						<a-table-column key="avg_duration_turth" title="平均实际通话时长" data-index="avg_duration_turth"
						                sorter="true">
							<template slot-scope="text,record">
								<span>{{record.avg_duration_turth?record.avg_duration_turth:'--'}}</span>
							</template>
						</a-table-column>

						<a-table-column key="duration" title="总计费通话时长" data-index="duration" sorter="true">
							<template slot-scope="text,record">
								<span>{{record.duration_turth?record.duration_turth:'--'}}</span>
							</template>
						</a-table-column>

						<a-table-column key="avg_duration" title="平均计费通话时长" data-index="avg_duration"
						                sorter="true">
							<template slot-scope="text,record">
								<span>{{record.avg_duration?record.avg_duration:'--'}}</span>
							</template>
						</a-table-column>
					</a-table>
					<div class="pagination" style="display: flex;justify-content: space-between;margin: 20px 0"
					     v-if="detailList.length>0">
						<div style="height: 32px;line-height: 32px;">
							共<span style="color: blue">{{ total1 }}</span>条
						</div>
						<div style="height: 32px;">
							<a-pagination :total="total1" showSizeChanger :showQuickJumper="false"
							              v-model="detailQuery.page"
							              :current="1"
							              :pageSize="detailQuery.page_size"
							              :pageSizeOptions="['15','30','50','100']"
							              @change="changePage1"
							              @showSizeChange="showSizeChange1"/>
						</div>
					</div>
				</div>
			</a-layout-content>
		</a-layout>

		<chooseDepartment :show="showDepartment" :chooseNum="chooseNum" ref="user"
		                  :callback="departmentChange" :is_from="11" :is_special="1"></chooseDepartment>
	</div>
</template>

<script>
	import LineCharts from "../../../components/echarts/LineCharts";
	import BarCharts from "../../../components/echarts/BarCharts";
	import PieCharts from "../../../components/echarts/PieCharts";
	import moment from "moment";
	import chooseDepartment from "@/components/ChooseDepartment.vue"

	const defaultQuery = {
		corp_id  : localStorage.getItem('corpId'),
		page     : 1,
		page_size: 15,
		timeType : 0, // 时间类型 0-按日 1-按周 2-按月
		staffType: 0, //0-员工 1-部门
		chartType: 0,// 0-排行榜 1-趋势图 2-地区分布
		dataType : 'total', //排行榜+趋势图+地区分布(柱状图) 0-总拨打次数
		pieType  : 0,//地区分布饼图 0-全部 1-接通 2-未接通
		sortType : 0, // 趋势图下表格 0-按时间 1-按成员
		timeRange: 0, // 时间段
		timeScope: 0, //时长
		staffList: [],
		staffArr : [],
		sdate    : moment().startOf('week').format('YYYY-MM-DD'),
		edate    : moment().endOf('week').format('YYYY-MM-DD')
	}

	export default {
		components: {
			LineCharts,
			BarCharts,
			PieCharts,
			chooseDepartment
		},
		data () {
			return {
				listQuery     : Object.assign({}, defaultQuery),//查询条件
				listLoading   : false,
				total         : 0,
				timeList      : [
					{value: 0, title: '全部时间段'}, {value: 1, title: '00:00-05:59'},
					{value: 2, title: '06:00-11:59'}, {value: 3, title: '12:00-17:59'},
					{value: 4, title: '18:00-11:59'},
				], //时间段列表
				timeRangeList : [
					{value: 0, title: '全部时长'}, {value: 1, title: '0分钟至5分钟'},
					{value: 2, title: '6分钟至10分钟'}, {value: 3, title: '11分钟至30分钟'},
					{value: 4, title: '31分钟至1小时'}, {value: 5, title: '1小时以上'},
				],//时长列表
				statisList    : {},//统计数据
				time          : [moment().startOf('week'), moment().endOf('week')],
				last_time     : 2,
				sweek         : moment().startOf('week'),
				eweek         : moment().endOf('week'),
				smonth        : moment().startOf('month'),
				emonth        : moment().endOf('month'),
				showDepartment: false,
				chooseNum     : 0,
				tableList     : [],
				result        : '',
				barData       : {
					title     : '',
					xAxisData : [],
					data_Type : 1,
					name      : '总拨打次数',
					seriesData: [],
				},
				lineData      : {
					title     : '',
					xAxisData : [],
					seriesData: []
				},
				pieData       : {
					title     : '',
					formatter : "{b} 占比 {d}%",
					seriesData: []
				},
				isDetail      : false,
				detailQuery   : {},
				detailList    : [],
				total1        : 0,
				name          : ''
			}
		},
		mounted () {
			this.getstatis()
			this.getChart()
			this.getTable()
		},

		methods: {
			async checkDetail (record) {
				this.isDetail = true
				this.name = record.name
				this.detailQuery = JSON.parse(JSON.stringify(this.listQuery))
				if (this.listQuery.sortType !== 0) {
					this.detailQuery.staffList = [record.id]
					this.detailQuery.sortType = 0
				} else {
					this.detailQuery.sortType = 1
				}
				this.getDetail()

			},
			async getDetail () {
				this.listLoading = true
				const {data: res} = await this.axios.post("dialout/table", this.detailQuery);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					if (this.detailQuery.is_export == 1) {
						this.detailQuery.is_export = 0
					} else {
						this.total1 = parseInt(res.data.count)
						this.detailList = res.data.list
					}
				}
				this.listLoading = false
			},

			async getChart () {
				this.listLoading = true
				const {data: res} = await this.axios.post("dialout/chart", this.listQuery);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					//排行榜
					if (this.listQuery.chartType == 0 || this.listQuery.chartType == 3) {
						this.barData.xAxisData = res.data.xData
						this.barData.seriesData = res.data.seriesData
						this.barData.name = res.data.name

						let that = this
						switch (this.listQuery.dataType) {

							case 'duration':
								this.barData.formatter = "{a}: {c}分钟"
								break
							case 'avg_duration':
								this.barData.formatter = "{a}: {c}分钟"
								break
							case 'duration_turth':
								this.barData.formatter = (value) => {
									let data = this.barData.name + ':' + that.getDuration(value[0].value)
									return data
								}
								break
							case 'avg_duration_turth':
								this.barData.formatter = (value) => {
									let data = this.barData.name + ':' + that.getDuration(value[0].value)
									return data
								}
								break
							default:
								this.barData.formatter = "{a}: {c}"
								break
						}
					} else if (this.listQuery.chartType == 1) {
						this.lineData.xAxisData = res.data.xData
						this.lineData.seriesData = res.data.seriesData
					} else if (this.listQuery.chartType == 2) {
						this.pieData.seriesData = res.data.seriesData
					} else if (this.listQuery.is_export == 1) {
						this.listQuery.is_export = 0
					}
				}
				this.listLoading = false
			},


			async getstatis () {
				this.listLoading = true
				const {data: res} = await this.axios.post("dialout/yesterday", {
					corp_id: localStorage.getItem('corpId')
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.statisList = res.data
				}
				this.listLoading = false
			},

			async getTable () {
				this.listLoading = true
				const {data: res} = await this.axios.post("dialout/table", this.listQuery);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					if (this.listQuery.is_export == 1) {
						this.listQuery.is_export = 0
						this.getTable()
					} else {
						this.total = parseInt(res.data.count)
						this.tableList = res.data.list
					}
				}
				this.listLoading = false
			},
			async getCurrentResult () {
				const {data: res} = await this.axios.post("dialout/current-result", {
					corp_id  : localStorage.getItem('corpId'),
					sdate    : this.listQuery.sdate,
					edate    : this.listQuery.edate,
					timeRange: this.listQuery.timeRange,
					timeScope: this.listQuery.timeScope,
					staffList: this.listQuery.staffList,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.result = res.data.data
				}
			},
			async sortTable (pagination, filters, sorter) {
				if (sorter.columnKey == 'num' || sorter.columnKey == 'pre') {
					this.listQuery.sortFiled = sorter.columnKey
				} else {
					this.listQuery.dataType = sorter.columnKey
				}
				if (sorter.order == 'ascend') {
					this.listQuery.order = 'asc'
				} else if (sorter.order == 'descend') {
					this.listQuery.order = 'desc'
				} else {
					this.listQuery.order = ''
				}
				this.getTable()
			},

			async sortTable1 (pagination, filters, sorter) {
				let data = JSON.parse(JSON.stringify(this.detailQuery))
				this.detailQuery.dataType = sorter.columnKey
				if (sorter.order == 'ascend') {
					this.detailQuery.order = 'asc'
				} else if (sorter.order == 'descend') {
					this.detailQuery.order = 'desc'
				} else {
					this.detailQuery.order = ''
				}
				this.getDetail()
			},

			async exportData () {
				let data = JSON.parse(JSON.stringify(this.listQuery))
				data.is_export = 1
				const {data: res} = await this.axios.post("dialout/table", data);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.ws.setCallback(this.websocketOnMessage)// 监听socket
				}
			},
			async exportData1 () {
				let data = JSON.parse(JSON.stringify(this.detailQuery))
				data.is_export = 1
				const {data: res} = await this.axios.post("dialout/table", data);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.ws.setCallback(this.websocketOnMessage)// 监听socket
				}
			},
			websocketOnMessage (data) { // 监听socket
				if (data.url) {
					window.open(data.url);
					this.ws.setCallback()
				}
			},

			changeType (model, type, name) {
				if (model == 'chartType') {
					this.listQuery[model] = type
					this.listQuery.dataType = 'total'
					this.getChart()
					this.getTable()
					return
					if (this.listQuery.chartType == 1) {
						this.getCurrentResult()
					}
					if (this.listQuery.chartType == 3) return;
					this.getTable()
					return
				} else if (model == 'dataType') {
					this.listQuery[model] = type
					this.barData.name = name
					this.getChart()
					// if(this.listQuery.chartType==3) return;
					this.getTable()

					return
				} else if (model == 'sortType') {
					this.listQuery[model] = type
					this.getTable()
					return
				}
				if (model == 'timeType' && type == 1) {
					this.listQuery.sdate = this.sweek.format('YYYY-MM-DD')
					this.listQuery.edate = this.eweek.format('YYYY-MM-DD')
				} else if (model == 'timeType' && type == 2) {
					this.listQuery.sdate = this.smonth.format('YYYY-MM-DD')
					this.listQuery.edate = this.emonth.format('YYYY-MM-DD')
				}
				this.listQuery[model] = type
			},
			handleTimeChange (date, dateString) {
				this.listQuery.sdate = dateString[0]
				this.listQuery.edate = dateString[1]
				this.last_time = 4
			},
			handleTimeRange () {
				this.listQuery.sdate = moment()
				switch (this.last_time) {
					case 0:
						let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
						this.time = [yesterday, yesterday]
						this.listQuery.sdate = yesterday
						this.listQuery.edate = yesterday
						break
					case 1:
						this.time = [moment().startOf('day'), moment().endOf('day')]
						this.listQuery.sdate = moment().startOf('day').format('YYYY-MM-DD')
						this.listQuery.edate = moment().endOf('day').format('YYYY-MM-DD')
						break
					case 2:
						this.time = [moment().startOf('week'), moment().endOf('week')]
						this.listQuery.sdate = moment().startOf('week').format('YYYY-MM-DD')
						this.listQuery.edate = moment().endOf('week').format('YYYY-MM-DD')
						break
					case 3:
						this.time = [moment().startOf('month'), moment().endOf('month')]
						this.listQuery.sdate = moment().startOf('month').format('YYYY-MM-DD')
						this.listQuery.edate = moment().endOf('month').format('YYYY-MM-DD')
						break
					case 4:
						this.time = []
						this.listQuery.sdate = moment('2021-01-01').format('YYYY-MM-DD')
						this.listQuery.edate = moment().endOf('day').format('YYYY-MM-DD')
						break
				}
			},


			// 部门弹框
			showDepartmentModel () {
				if (this.listQuery.staffList) {
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.listQuery.staffList))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.listQuery.staffArr))
				}
				this.showDepartment = true
			},

			departmentChange (event, arr, userNum, departmentNum, list) {
				this.listQuery.staffList = arr
				this.listQuery.staff_userNum = userNum
				this.listQuery.staff_departmentNum = departmentNum
				this.listQuery.staffArr = list
				this.showDepartment = false
			},
			search () {
				this.getChart()
				this.getTable()
				if (this.listQuery.chartType == 1) {
					this.getCurrentResult()
				}

			},
			clear () {
				this.listQuery = Object.assign({}, defaultQuery)
				this.time = [moment().startOf('week'), moment().endOf('week')]
				this.last_time = 2
				this.getChart()
				this.getTable()
				if (this.listQuery.chartType == 1) {
					this.getCurrentResult()
				}
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			goBack () {
				this.isDetail = false
			},
			// 分页
			changePage () {
				this.getTable()
			},

			showSizeChange (current, page_size) {
				this.listQuery.page_size = page_size
				this.getTable()
			},

			changePage1 () {
				this.getDetail()
			},
			showSizeChange1 (current, page_size) {
				this.detailQuery.page_size = page_size
				this.getDetail()
			},
			getDuration (second) {
				var duration
				var days = Math.floor(second / 86400);
				var hours = Math.floor((second % 86400) / 3600);
				var minutes = Math.floor(((second % 86400) % 3600) / 60);
				var seconds = Math.floor(((second % 86400) % 3600) % 60);
				if (days > 0) duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
				else if (hours > 0) duration = hours + "小时" + minutes + "分" + seconds + "秒";
				else if (minutes > 0) duration = minutes + "分" + seconds + "秒";
				else if (seconds > 0) duration = seconds + "秒";
				return duration;
			},
		},

	}
</script>

<style scoped lang="less">
	.list {
		overflow: hidden;
		height: 100%;

	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.fans-content {
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}


	.ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
		font-size: 16px;
		padding: 0 20px;
	}

	.header {
		width: 98%;
		background-color: #FFF;
		padding: 24px;
		margin: 1rem auto;

	}

	.static {
		display: flex;
		justify-content: space-around;
		align-items: center;
		/*background-color: #F9F9F9;*/

		.static_content {
			width: 15.6%;
			background-color: #F9F9F9;
			padding: 0.64rem 1.067rem;
			/*border: 1px solid #E9E9E9;*/
			line-height: 30px;
		}
	}

	.head_search {
		margin: 10px 0;

		.ant-radio-button-wrapper {
			margin: 0;
			width: 4rem !important;
			text-align: center !important;
		}
	}

	.caledar-btn-selected {
		boder: 0;
		border-right: 1px solid #3B74FF;
		background: #3B74FF;
		border-radius: 0;
		color: #FFF;
	}

	.ant-calendar-picker {
		width: 20%;
		margin: 0 10px;
	}

	.search_card {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 10px;

		.search_content {
			width: 10%;

			.ant-input {
				width: 96%;

			}

			.ant-select {
				width: 95%;
			}


		}
	}

	.chart {
		padding: 24px;
	}

	.content_table {
		width: 98%;
		margin: 1rem auto;
		margin-bottom: 10px;
	}

	.tabBtn {
		margin: 0;
		margin-right: 2px;
		padding: 10px 16px;
		line-height: 42px;
		background: #FAFAFA;
		border: 1px solid #E8E8E8;
		border-radius: 4px 4px 0 0;
		cursor: pointer;
		border: 1px solid #E8E8E8;
	}

	.activeBtn {
		color: #1890FF;
		background: #FFF;
		border-bottom: none;
	}

	.tabLine {
		font-size: 17px;
		font-weight: 700;
		cursor: pointer;
		margin: 20px;
	}

	.activeLine {
		color: #3291F8;
		font-weight: 700;
		border-bottom: 3px solid #3291F8;
	}
</style>
