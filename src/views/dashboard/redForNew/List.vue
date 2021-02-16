<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden; ">
				<a-layout
						style="position: absolute; top:0; bottom:0;left: 0; right:0; overflow-x: hidden; overflow-y: auto;"
						class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>红包拉新</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">红包拉新</div>
						<div class="content-msg"  style="box-shadow: 0px 1px 4px 0px #D7D7D7">
							<p style="margin-bottom: 2px;">
								新客发红包，在有效的时间段内，通过渠道活码添加企业成员，自动推送红包页面，借助红包激励，实现快速拉新的目的。
							</p>
							<p style="margin-bottom: 2px;">
								1、若用户之前已添加过某员工的企业微信，删除后，通过渠道码再次添加该员工，则不能领取红包。
							</p>
							<p style="margin-bottom: 2px; color: #FF562D;">
								2、若红包已发送到客户里，但客户尚未领取，此时微信支付商户平台出现账户余额不足时，客户打开红包页面无法领取，请务必保证账户余额充足，避免客户投诉。
							</p>
							<p style="margin: 10px 0 2px;color: #FF562D;">
								商户需完成以下配置，才能使用派发红包功能：：
							</p>
							<p style="margin-bottom: 2px;">
								1、前往<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
								       target="_blank">【微信支付商户平台】</a>注册微信支付商户号
							</p>
							<p style="margin-bottom: 2px;">
								2、登录<a href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu"
								       target="_blank">【企业微信后台】</a>开通企业支付，绑定已有商户号（<a
									href="https://support.qq.com/products/104790/faqs/66072" target="_blank">查看教程</a>）
							</p>
							<p style="margin-bottom: 2px;">
								3、登录<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
								       target="_blank">【微信支付商户平台】</a>开通【企业付款到零钱】（<a
									href="https://support.qq.com/products/104790/faqs/66076" target="_blank">查看教程</a>）
							</p>
							<p style="margin-bottom: 2px;">
								4、在本系统，进入【应用中心】--【企业支付】，点击，填入企业支付的应用ID和Secret
							</p>
							<p style="margin-bottom: 2px;">
								5、在本系统，进入【应用中心】--【企业支付】，点击，完成支付配置。（<a
									href="https://support.qq.com/products/104790/faqs/66058" target="_blank">查看教程</a>）
							</p>
						</div>
						<div class="content-hd">
							<a-col style="float:left;">
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 210px;margin-right: 10px;"
										@change="handleChange"
										v-model="corpId"
										v-if="corpLen > 1"
								>
									<template v-for="item in corpInfo">
										<a-select-option :value="item.corpid">{{item.corp_full_name ||
											item.corp_name}}
										</a-select-option>
									</template>
								</a-select>
								<a-select v-model="status" style="width: 120px;" placeholder="活动状态" allowClear>
									<a-select-option value="1">未开始</a-select-option>
									<a-select-option value="2">进行中</a-select-option>
									<a-select-option value="3">已结束</a-select-option>
								</a-select>
								<a-input placeholder="搜索活动名称" @keyup.enter="find" v-model="title"
								         style="width: 150px;margin: 0px 10px;"/>
								<a-range-picker style="width: 300px" v-model="activityTime" @change="changeTime"/>
								<a-button type="primary" style="margin: 0px 10px;" @click="find">查询</a-button>
								<a-button @click="clear">重置</a-button>
							</a-col>
							<a-col style="float:right;" v-has="'redForNewList-add'">
								<a-button class="btn-primary"@click="addRedActivity" type="primary">
									新建红包拉新
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="activityList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'redForNewList-list'">
									<span slot="qr_code" slot-scope="text, record, index">
										<img style="width: 100px; height: 100px;" :src="commonUrl + record.local_path"/>
									</span>
									<span slot="rule_type" slot-scope="text, record">
										<div style="margin-bottom: 10px;">规则：{{record.rule_name}}</div>
										类型：<span v-if="record.rule_type == 1">定额{{record.rule_fixed_amount}}元</span>
										<span v-if="record.rule_type == 2">拼手气{{record.rule_min_random_amount}}-{{record.rule_max_random_amount}}元</span>
									</span>
									<span slot="member_str" slot-scope="text, record">
										<span style="color: #01b065; cursor: pointer;"
										      @click="preview(record.id, record.corp_id)">预览</span>
									</span>
									<span slot="time" slot-scope="text, record">
										<div v-if="record.time_type == 2" style="width: 125px;">{{record.start_time}}至{{record.end_time}}</div>
										<div v-if="record.time_type == 1" style="width: 125px;">永久有效</div>
									</span>
									<span slot="redpacket_amount" slot-scope="text, record">
										{{record.redpacket_amount}}元
									</span>
									<span slot="addNum">
										拉新人数
										<a-tooltip placement="top">
											<template slot="title">
												<span>统计该渠道活码添加了多少员工，含客户重复添加，与红包是否已投放完无关。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<span slot="add_num" slot-scope="text, record">
										{{record.add_num}}人
									</span>
									<span slot="receive_snum" slot-scope="text, record">
										{{record.receive_snum}}元（{{record.receive_num}}人）
									</span>
									<span slot="notReceiveSnum">
										未领取金额/人数
										<a-tooltip placement="top">
											<template slot="title">
												<span>在24小时内尚未领取和超过24小时已过期情况下，统称为“未领取”。</span>
											</template>
											<a-icon type="question-circle" style="margin-left:5px;"/>
										</a-tooltip>
									</span>
									<span slot="not_receive_snum" slot-scope="text, record">
										{{record.not_receive_snum}}元（{{record.not_receive_num}}人）
									</span>
									<span slot="expired_snum" slot-scope="text, record">
										{{record.expired_snum}}元（{{record.expired_num}}人）
									</span>
									<span slot="redpacket_status" slot-scope="text, record">
										<span v-if="record.redpacket_status == 1">未发布</span>
										<span v-if="record.redpacket_status == 2">进行中</span>
										<span v-if="record.redpacket_status == 3">已失效（活动结束）</span>
										<span v-if="record.redpacket_status == 4">已失效（活码失效）</span>
									</span>
									<span slot="action" slot-scope="text, record, index">
										<div style="width: 150px;">
											<div style="display: inline-block">
												<a-button @click="failure(record.id, record.name)"
										          v-if="record.redpacket_status == 2"
										          v-has="'redForNewList-invalid'"
										          style="margin: 0 5px 5px 0">使失效</a-button>
											</div>
											<div style="display: inline-block">
												<a-button v-has="'redForNewList-release'"
										          @click="releaseActivity(record.id, record.name)"
										          v-if="record.redpacket_status == 1"
										          style="margin: 0 5px 5px 0">发布</a-button>
											</div>
											<div style="display: inline-block">
												<a-button v-has="'redForNewList-edit'" @click="edit(record.id, record.corp_id)"
										          v-if="record.redpacket_status == 1 || record.redpacket_status == 2"
										          style="margin: 0 5px 5px 0">编辑</a-button>
											</div>
											<!--										<a-button @click="detailActivity(record.id)"-->
											<!--										          style="margin: 0 5px 5px 0">详情</a-button>-->
											<div style="display: inline-block">
												<a-button v-has="'redForNewList-info'"
										          @click="participants(record.id,record.name, record.corp_id)"
										          style="margin: 0 5px 5px 0">拉新记录</a-button>
											</div>
											<div style="display: inline-block">
												<a-button v-has="'redForNewList-statistic'"
										          @click="statistical(record.id, record.corp_id, record.name)"
										          style="margin: 0 5px 5px 0">红包统计</a-button>
											</div>
											<div style="display: inline-block">
												<a-button @click="deleteActivity(record.id, record.name)"
										          style="margin: 0 5px 5px 0"
										          v-has="'redForNewList-delete'"
										          v-if="record.redpacket_status != 2">删除</a-button>
											</div>
											<div style="display: inline-block">
												<a-button v-has="'redForNewList-down'" :data-url="commonUrl + record.local_path"
										          :data-name="record.name"
										          @click="downLoadWay" class="actionBtn"
										          v-if="record.redpacket_status == 2">下载</a-button>
											</div>
										</div>
									</span>
								</a-table>

								<!-- 分页 -->
								<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
								     v-show="total > 0" v-has="'redForNewList-list'">
									<div style="height: 32px;float: left;line-height: 32px;">
										共
										<span style="color: blue">{{total}}</span>条
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
										              :current="page"
										              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
										              @change="changePage"
										              @showSizeChange="showSizeChange"/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>

				</a-layout>
			</a-layout>
		</div>
		<a-modal v-model="specialModal" title="预览" width="888px" @cancel="cancelChangeSpecialTime">
			<template slot="footer">
				<a-button key="back" @click="cancelChangeSpecialTime">关闭</a-button>
			</template>
			<a-form>
				<!-- 排班 -->
				<a-form-item label="企业成员" :label-col="{ span: 2 }">
				</a-form-item>
				<a-form-item>
					<a-table
							:columns="specialWeekColumns"
							:dataSource="specialWeekList"
							:pagination="false"
							:rowClassName="rowClassName"
							style="max-width: 98%;margin-left: 1%;"
					>
						<span slot="mon">
							周一
						</span>
						<span slot="tues">
							周二
						</span>
						<span slot="wednes">
							周三
						</span>
						<span slot="thurs">
							周四
						</span>
						<span slot="fri">
							周五
						</span>
						<span slot="satur">
							周六
						</span>
						<span slot="sun">
							周日
						</span>
						<span slot="mon" slot-scope="text, record, index">
							<div v-for="item in record.mon" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> {{user.name}} </span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> {{user.name}} </span>
										</div>
									</a-tooltip>
									<a-select v-show="item.party.length > 0"
									          :disabled='true'
									          optionFilterProp="children"
									          mode="multiple"
									          v-model="item.party"
									          style="width: 80px"
									          placeholder="选择部门"
									>
										<a-select-option v-for="(name, departmentId) in party"
										                 :key="departmentId">
											{{name}}
										</a-select-option>
									</a-select>
								</div>
							</div>
							<div v-for="item in record.mon" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.mon.length == 0">--</div>
						</span>
						<span slot="tues" slot-scope="text, record, index">
							<div v-for="item in record.tues" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> {{user.name}} </span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> {{user.name}} </span>
										</div>
									</a-tooltip>
									<a-select v-show="item.party.length > 0"
									          :disabled='true'
									          optionFilterProp="children"
									          mode="multiple"
									          v-model="item.party"
									          style="width: 80px"
									          placeholder="选择部门"
									>
										<a-select-option v-for="(name, departmentId) in party"
										                 :key="departmentId">
											{{name}}
										</a-select-option>
									</a-select>
								</div>
							</div>
							<div v-for="item in record.tues" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.tues.length == 0">--</div>
						</span>
						<span slot="wednes" slot-scope="text, record, index">
							<div v-for="item in record.wednes" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> {{user.name}} </span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> {{user.name}} </span>
										</div>
									</a-tooltip>
									<a-select v-show="item.party.length > 0"
									          :disabled='true'
									          optionFilterProp="children"
									          mode="multiple"
									          v-model="item.party"
									          style="width: 80px"
									          placeholder="选择部门"
									>
										<a-select-option v-for="(name, departmentId) in party"
										                 :key="departmentId">
											{{name}}
										</a-select-option>
									</a-select>
								</div>
							</div>
							<div v-for="item in record.wednes" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.wednes.length == 0">--</div>
						</span>
						<span slot="thurs" slot-scope="text, record, index">
							<div v-for="item in record.thurs" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> {{user.name}} </span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> {{user.name}} </span>
										</div>
									</a-tooltip>
									<a-select v-show="item.party.length > 0"
									          :disabled='true'
									          optionFilterProp="children"
									          mode="multiple"
									          v-model="item.party"
									          style="width: 80px"
									          placeholder="选择部门"
									>
										<a-select-option v-for="(name, departmentId) in party"
										                 :key="departmentId">
											{{name}}
										</a-select-option>
									</a-select>
								</div>
							</div>
							<div v-for="item in record.thurs" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.thurs.length == 0">--</div>
						</span>
						<span slot="fri" slot-scope="text, record, index">
							<div v-for="item in record.fri" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> {{user.name}} </span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> {{user.name}} </span>
										</div>
									</a-tooltip>
									<a-select v-show="item.party.length > 0"
									          :disabled='true'
									          optionFilterProp="children"
									          mode="multiple"
									          v-model="item.party"
									          style="width: 80px"
									          placeholder="选择部门"
									>
										<a-select-option v-for="(name, departmentId) in party"
										                 :key="departmentId">
											{{name}}
										</a-select-option>
									</a-select>
								</div>
							</div>
							<div v-for="item in record.fri" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.fri.length == 0">--</div>
						</span>
						<span slot="satur" slot-scope="text, record, index">
							<div v-for="item in record.satur" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> {{user.name}} </span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> {{user.name}} </span>
										</div>
									</a-tooltip>
									<a-select v-show="item.party.length > 0"
									          :disabled='true'
									          optionFilterProp="children"
									          mode="multiple"
									          v-model="item.party"
									          style="width: 80px"
									          placeholder="选择部门"
									>
										<a-select-option v-for="(name, departmentId) in party"
										                 :key="departmentId">
											{{name}}
										</a-select-option>
									</a-select>
								</div>
							</div>
							<div v-for="item in record.satur" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.satur.length == 0">--</div>
						</span>
						<span slot="sun" slot-scope="text, record, index">
							<div v-for="item in record.sun" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> {{user.name}} </span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> {{user.name}} </span>
										</div>
									</a-tooltip>
									<a-select v-show="item.party.length > 0"
									          :disabled='true'
									          optionFilterProp="children"
									          mode="multiple"
									          v-model="item.party"
									          style="width: 80px"
									          placeholder="选择部门"
									>
										<a-select-option v-for="(name, departmentId) in party"
										                 :key="departmentId">
											{{name}}
										</a-select-option>
									</a-select>
								</div>
							</div>
							<div v-for="item in record.sun" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.sun.length == 0">--</div>
						</span>
					</a-table>
				</a-form-item>
				<a-form-item label="特殊时期" :label-col="{ span: 2 }"
				             :wrapper-col="{ span: 21 }">
					<a-switch :disabled="true" :checked="specialTime == 1 ? true:false"></a-switch>
					<span style="color: #F56C6C;margin-left: 10px;">如遇到国家节假日或是企业自身重要日子，在特殊时期内，需要更换活码成员</span>
					<div v-if="specialTime == 1" class="content-msg">
						<p style="margin-bottom: 2px;line-height: 20px;">
							1、系统默认生成一条每日24小时（00:00~00:00）数据，当时间点不在所新增的时段内，客户扫码后，添加的是“24小时”的企业成员。
						</p>
						<p style="margin-bottom: 0px;line-height: 20px;color: #FF562D">
							2、批量设置企业成员（含指定成员+部门成员【动态数据】）后，若您当前所勾选的渠道活码当中，已开启过“员工添加客户上限“，则对新设置的指定成员，添加客户上限默认为100人，而因受官方限制，无法对动态部门的员工设置添加好友上限。
						</p>
						<p style="margin-bottom: 0px;line-height: 20px;color: #FF562D">
							3、渠道活码设置部门时，请确保设置的部门具有外部联系人权限，否则会导致该区间段的活码设置失效。
						</p>
					</div>
					<div v-if="specialTime == 1" v-for="(item, index) in specialDateList"
					     style="padding: 10px 10px 40px 10px;"
					     :class="index!=specialDateList.length - 1 ? 'border-dashed' : ''">
						<label>特殊时期{{index + 1}}：</label>
						<a-range-picker
								style="width: 200px;"
								:allowClear="false"
								:disabled="true"
								:value="item.specialDate"
								format="YYYY-MM-DD"
						/>
						<div v-for="(time, timeIndex) in item.time" style="margin-left: 78px;">
							<a-time-picker :disabled='true' :allowClear="false"
							               style="width: 100px;"
							               v-model="time.startTime"
							               :minuteStep="60"
							               format="HH:mm">
							</a-time-picker>
							~
							<a-time-picker :disabled='true' :allowClear="false"
							               style="width: 100px;"
							               v-model="time.endTime"
							               :minuteStep="60"
							               :defaultOpenValue="moment('00:00', 'HH:mm')"
							               format="HH:mm">
							</a-time-picker>
							<span style="margin-left: 10px;" v-if="editType == 2">
								<span v-for="item1 in time.userList">{{item1.name}} </span>
							</span>
							<div v-if="editType == 2 && time.party && time.party.length > 0">
								<a-select
										showSearch
										optionFilterProp="children"
										mode="multiple"
										:disabled="true"
										v-model="time.party"
										style="width: 300px;"
										placeholder="选择部门"
								>
									<a-select-option v-for="(name, departmentId) in party"
									                 :key="departmentId">
										{{name}}
									</a-select-option>
								</a-select>
								<a-tooltip placement="top" v-if="editType == 2 && timeIndex == item.time.length - 1">
									<template slot="title">
										选择企业成员和选择部门必须选择一个。选择部门后，扫码后最多可添加当前部门的企业成员。如原来某部门是5人，后新增1人，则客户最多可添加该部门6位企业成员
									</template>
									<span style="margin-left: 10px;">
																<a-icon type="question-circle"></a-icon>
															</span>
								</a-tooltip>
							</div>
							<chooseStaffSelect ref="staffSelect"
							                   style="width: 160px;margin-left: 10px;display: inline-block;"
							                   v-if="editType == 1 && specialModal" :index="index" :index2="timeIndex"
							                   :disabled="true"></chooseStaffSelect>
							<div>
							</div>
						</div>
					</div>
				</a-form-item>
				<a-form-item label="员工添加上限" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-switch :checked="is_limit == 2 ? true : false"
					          :disabled="true"></a-switch>
					<span style="color: #F56C6C;">（因受官方限制，无法对动态部门的员工设置添加好友上限，只可针对指定活码成员进行设置）</span>
					<a-table
							v-if="is_limit == 2"
							:scroll="{ y: 450 }"
							:columns="previewUserColumns"
							:dataSource="userLimitList"
							:pagination="false"
							:rowClassName="rowClassName"
							style="max-width: 100%;"
					>
						<span slot="limit" slot-scope="text, record, index">
							<a-input
									style="width: 120px"
									:disabled="true"
									v-model="record.limit"></a-input>
						</span>
					</a-table>
				</a-form-item>
				<a-form-item v-if="is_limit == 2" style="padding-bottom: 20px;" label="备用员工"
				             :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<template v-if="editType == 2">
						<a-button :disabled="true" style="margin-left: 10px;">
							<template v-if="spare_employee.length == 0">选择企业成员</template>
							<template v-else>已选择{{spare_employee.length}}名员工</template>
						</a-button>
						<a-tooltip placement="right">
							<template slot="title">
								<span v-for="item in spare_employee">{{item.name}} </span>
							</template>
							<span v-if="editType == 2"
							      style="display: inline-block; max-width: 300px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;vertical-align: middle;margin-left: 10px;">
								<span v-for="item in spare_employee">{{item.name}} </span>
							</span>
						</a-tooltip>
					</template>
					<chooseStaffSelect ref="staffSelect4"
					                   style="width: 160px;margin-left: 10px;display: inline-block;"
					                   v-show="editType == 1" :index="10"
					                   :index2="-1"
					                   :disabled="true"></chooseStaffSelect>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
	import MyIcon from "@/components/MyIcon.vue"
	import moment from 'moment';
	import QRCode from 'qrcodejs2'
	import chooseStaffSelect from "@/components/ChooseStaffSelect"

	// 活动列表
	const columns = [
		{
			title      : "二维码",
			dataIndex  : "qr_code",
			key        : "qr_code",
			width      : "9%",
			scopedSlots: {customRender: "qr_code"}
		},
		{
			title    : "活动名称",
			dataIndex: "name",
			key      : "name",
			width    : '180px'
		},
		{
			title      : "发放规则",
			dataIndex  : "rule_type",
			key        : "rule_type",
			width      : '180px',
			scopedSlots: {customRender: "rule_type"}
		},
		{
			title      : "引流成员",
			dataIndex  : "member_str",
			key        : "member_str",
			scopedSlots: {customRender: "member_str"}
		},
		{
			title      : "活动时间",
			dataIndex  : "time",
			key        : "time",
			scopedSlots: {customRender: "time"}
		},
		{
			title      : "投放金额",
			dataIndex  : "redpacket_amount",
			key        : "redpacket_amount",
			scopedSlots: {customRender: "redpacket_amount"}
		},
		{
			// title    : "拉新人数",
			dataIndex  : "add_num",
			key        : "add_num",
			slots      : {title: 'addNum'},
			scopedSlots: {customRender: "add_num"}
		},
		{
			title      : "已领取金额/人数",
			dataIndex  : "receive_snum",
			key        : "receive_snum",
			scopedSlots: {customRender: "receive_snum"}
		},
		{
			// title      : "未领取金额/人数",
			dataIndex  : "not_receive_snum",
			key        : "not_receive_snum",
			slots      : {title: 'notReceiveSnum'},
			scopedSlots: {customRender: "not_receive_snum"}
		},
		{
			title      : "活动状态",
			dataIndex  : "redpacket_status",
			key        : "redpacket_status",
			scopedSlots: {customRender: "redpacket_status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '10%',
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name      : "redForNewList",
		components: {MyIcon, chooseStaffSelect},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				suite_id          : 1,//应用ID
				corpId            : corpId,//企业微信选中的id
				corpInfo          : [], //企业微信列表
				status            : [], // 0全部 1未开始 2进行中 3已结束
				title             : '',// 输入框内容
				commonUrl         : this.$store.state.commonUrl,//公共的链接
				activityTime      : [], // 时间
				activityList      : [],// 表格数组
				isLoading         : true, //Loading 组件显示与隐藏
				corpLen           : JSON.parse(localStorage.getItem('corpArr')).length,
				user              : [],
				party             : [],
				//表格部分
				columns,
				//分页
				total             : 0, //总条数
				quickJumper       : false, // 是否显示快速跳转的控件
				page              : 1, //页码
				page_size         : 15, //每页数据量，默认15
				pageSize          : 15, //每页数据条数
				specialTime       : 0,
				specialTimeList   : [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : []
					},
				], // 特殊时期成员
				specialDateList   : [
					{
						specialDate: [moment(new Date()), moment(new Date())],
						date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
						time       : [
							{
								startTime : moment('00:00', 'HH:mm'),
								endTime   : moment('00:00', 'HH:mm'),
								start_time: '00:00',
								end_time  : '00:00',
								userList  : [],
								party     : []
							}
						],
					}
				], // 周期成员
				specialWeekList   : [
					{
						mon   : [],
						tues  : [],
						wednes: [],
						thurs : [],
						fri   : [],
						satur : [],
						sun   : [],
					},
				],
				is_limit          : 1,
				userLimitList     : [],
				spare_employee    : [],
				specialModal      : false,
				editType          : 1,
				specialWeekColumns: [
					{
						slots      : {title: 'mon'},
						// title      : "周一",
						dataIndex  : "mon",
						width      : '14%',
						key        : "mon",
						scopedSlots: {customRender: "mon"}
					},
					{
						slots      : {title: 'tues'},
						// title      : "周二",
						dataIndex  : "tues",
						width      : '14%',
						key        : "tues",
						scopedSlots: {customRender: "tues"}
					},
					{
						slots      : {title: 'wednes'},
						// title      : "周三",
						dataIndex  : "wednes",
						width      : '14%',
						key        : "wednes",
						scopedSlots: {customRender: "wednes"}
					},
					{
						slots      : {title: 'thurs'},
						// title      : "周四",
						dataIndex  : "thurs",
						width      : '14%',
						key        : "thurs",
						scopedSlots: {customRender: "thurs"}
					},
					{
						slots      : {title: 'fri'},
						// title      : "周五",
						dataIndex  : "fri",
						width      : '14%',
						key        : "fri",
						scopedSlots: {customRender: "fri"}
					},
					{
						slots      : {title: 'satur'},
						// title      : "周六",
						dataIndex  : "satur",
						width      : '14%',
						key        : "satur",
						scopedSlots: {customRender: "satur"}
					},
					{
						slots      : {title: 'sun'},
						// title      : "周日",
						dataIndex  : "sun",
						width      : '14%',
						key        : "sun",
						scopedSlots: {customRender: "sun"}
					},
				],
				previewUserColumns: [
					{
						title    : "名称",
						dataIndex: "name",
						key      : "name",
					},
					{
						title      : "上限",
						dataIndex  : "limit",
						key        : "limit",
						scopedSlots: {customRender: "limit"}
					}
				],
			};
		},

		methods: {
			moment,
			cancelChangeSpecialTime () {
				this.specialModal = false
			},
			//左侧企业微信
			handleChange (value) {
				this.corpId = value
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			async getUserList () {
				const {data: res} = await this.axios.post('work-user/get-all-user', {
					suite_id: 1,
					corp_id : this.corpId,
					is_all  : 1,//不带分页
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.isLoading = false;
				} else {
					this.user = res.data.info
				}
			},
			async getPartyList () {
				const {data: res} = await this.axios.post('work-contact-way/get-party-list', {
					suite_id: 1,
					corp_id : this.corpId,
				})

				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false;
					this.party = res.data.party_list
				}
			},
			changeTime (data, dataString) {
				this.activityTime = data
			},
			// 点击搜索
			find () {
				this.getActivityList()
			},
			// 点击清空
			clear () {
				this.status = []
				this.title = ''
				this.activityTime = []
				this.page = 1
				this.pageSize = 15
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
				this.getActivityList()
			},
			// 新建标签
			addRedActivity () {
				this.$router.push('/redForNew/add')
			},
			// 获取表格内容
			async getActivityList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-contact-way-redpacket/get-redpacket-list", {
					uid       : localStorage.getItem('uid'),
					corp_id   : this.corpId,
					status    : this.status,
					name      : this.title,
					start_date: this.activityTime.length > 0 ? moment(this.activityTime[0]).format("YYYY-MM-DD") : "",
					end_date  : this.activityTime.length > 0 ? moment(this.activityTime[1]).format("YYYY-MM-DD") : "",
					page      : page,
					pageSize  : pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.activityList = res.data.list;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;

				}
			},
			async preview (id, corp_id) {
				this.isLoading = true
				const {data: res} = await this.axios.post('work-contact-way-redpacket/get-redpacket-user', {
					corp_id: corp_id,
					id     : id
				})
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.editType = res.data.contact_way.type
					let wayInfo = res.data.contact_way
					this.specialTime = wayInfo.specialTime
					this.specialDateList = wayInfo.specialDateList
					this.specialWeekList = wayInfo.specialWeekList
					for (let i = 0; i < this.specialDateList.length; i++) {
						this.specialDateList[i]['specialDate'] = [new Date(), new Date()]
						this.specialDateList[i]['specialDate'][0] = moment(this.specialDateList[i].date[0], "YYYY-MM-DD")
						this.specialDateList[i]['specialDate'][1] = moment(this.specialDateList[i].date[1], "YYYY-MM-DD")
						for (let j = 0; j < this.specialDateList[i].time.length; j++) {
							this.specialDateList[i].time[j]['startTime'] = moment(new Date())
							this.specialDateList[i].time[j]['endTime'] = moment(new Date())
							this.specialDateList[i].time[j]['startTime'] = moment(this.specialDateList[i].time[j]['start_time'], "HH:mm")
							this.specialDateList[i].time[j]['endTime'] = moment(this.specialDateList[i].time[j]['end_time'], "HH:mm")
						}
					}
					let weekDay = ['mon', 'tues', 'wednes', 'thurs', 'fri', 'satur', 'sun']
					for (let k = 0; k < 7; k++) {
						let times = this.specialWeekList[0][weekDay[k]]
						for (let l = 0; l < times.length; l++) {
							times[l]['startTime'] = moment(times[l]['start_time'], 'HH:mm')
							times[l]['endTime'] = moment(times[l]['end_time'], 'HH:mm')
						}
					}
					this.is_limit = res.data.contact_way.is_limit
					this.userLimitList = res.data.contact_way.user_limit
					this.spare_employee = res.data.contact_way.spare_employee
					this.isLoading = false
					this.specialModal = true
					if (this.editType == 1 && this.specialTime == 1) {
						let that = this
						let arr = []
						that.specialDateList.map((item, index) => {
							item.time.map((item2, index2) => {
								arr.push(item2.userList)
							})
						})
						that.$nextTick(() => {
							arr.map((item, index) => {
								that.$refs.staffSelect[index].userId = item
							})
						})
					}
					if (this.editType == 1) {
						this.$nextTick(() => {
							this.$refs.staffSelect4.userId = this.spare_employee
						})
					}
				}
			},
			// 使失效
			failure (id, name) {
				let that = this;
				that.$confirm({
					title     : "确定结束活动【" + name + "】？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 3)
					}
				});
			},
			// 发布
			releaseActivity (id, name) {
				let that = this;
				that.$confirm({
					title     : "确定发布活动【" + name + "】？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 2)
					}
				});
			},
			//删除
			deleteActivity (id, name) {
				let that = this;
				that.$confirm({
					title     : "确定删除该活动【" + name + "】？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(id, 5)
					}
				});
			},
			async changeStatus (id, status) {
				const {data: res} = await this.axios.post("work-contact-way-redpacket/change-redpacket-status", {
					uid   : localStorage.getItem("uid"),
					id    : id,
					status: status
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					if (status == 5) {
						//删除判断最后一页是否只有一条
						if (this.activityList.length == 1 && this.page > 1) {
							this.getActivityList(this.page - 1, this.pageSize)
						} else {
							this.getActivityList(this.page, this.pageSize)
						}
					} else {
						this.getActivityList(this.page, this.pageSize)
					}
				}
			},
			downLoadWay (e) {
				let that = this
				let image = new Image()
				image.setAttribute('crossOrigin', 'anonymous')
				image.src = e.target.dataset.url
				image.onload = () => {
					let canvas = document.createElement('canvas')
					canvas.width = 200
					canvas.height = 200
					let ctx = canvas.getContext('2d')
					ctx.drawImage(image, 0, 0, 200, 200)
					canvas.toBlob((blob) => {
						let url = URL.createObjectURL(blob)
						that.download(url, e.target.dataset.name)
						// 用完释放URL对象
						URL.revokeObjectURL(url)
					})
				}
			},
			download (href, name) {
				let eleLink = document.createElement('a')
				eleLink.download = name
				eleLink.href = href
				eleLink.click()
				eleLink.remove()
			},
			// 编辑
			edit (id, corp_id) {
				this.$router.push("/redForNew/add?id=" + id + "&id1=" + encodeURIComponent(corp_id))
			},
			participants (id, name, corp_id) {
				let id2 = encodeURIComponent(id)
				let title2 = encodeURIComponent(name.replace(/%/g, '%25'))
				this.$router.push("/redForNew/participants?id=" + id2 + "&title=" + title2 + "&corp_id=" + encodeURIComponent(corp_id))
			},
			// 统计
			async statistical (id, corp_id, name) {
				this.$router.push("/redForNew/statistics?id=" + id + "&id1=" + encodeURIComponent(corp_id) + '&title=' + encodeURIComponent(name))
			},
			// 分页
			changePage (page, pageSize) {
				this.getActivityList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 270)
				})
			},
			showSizeChange (page, pageSize) {
				this.getActivityList(1, pageSize);
			}
		},

		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.getUserList();
				this.getPartyList()
				this.corpInfo = info;
				this.getActivityList()
			});
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if ((from.path == '/redForNew/add' || from.path == '/redForNew/statistics' || from.path == '/redForNew/participants') && typeof to.query.isRefresh != 'undefined' && to.query.isRefresh == '1') {
				next(vm => {
					//编辑回来
					vm.getActivityList(vm.page, vm.pageSize)
				});
			} else {
				next(vm => {
					vm.clear()
				})
			}
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
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
		margin: 0 20px 20px;
		min-width: 885px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
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

	.btn-primary {
		margin-left: 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 90px;
		margin: 0px;
		text-align: center;
	}
</style>
