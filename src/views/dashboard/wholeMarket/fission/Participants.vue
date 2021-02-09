<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<div style="height: 50px;line-height: 50px;background-color: #FFFFFF;">
				<label style="margin-left: 20px;">
					{{title}}：
				</label>
				<a-button type="primary" style="float: right; margin: 9px 20px 0 0;" icon="rollback" @click="rollback">
					返回列表
				</a-button>
			</div>
		</div>
		<div class="content-msg" v-if="type == 3">
			<a-collapse expand-icon-position="right">
				<a-collapse-panel key="1">
					<template slot="header">
						<p style="margin-bottom: 2px;">
							基于公众号+企业微信的裂变模式，即关注公众号并且加员工企业微信为好友才算助力成功，一举双雕，不仅给公众号涨粉，还能给员工的企业微信号带来大量的客户，是一把引流的利器。
						</p>
						<p style="margin-bottom: 18px;">
							「参与活动人数」和「完成任务人数」是随活动进行实时自动统计。如果以红包作为奖品，只要微信支付商户平台账户余额充足，当参与人完成任务，即自动发放至用户的个人零钱里。若出现账户不足，红包无法发放，待补足账户余额后，需手动「标记为」已发奖，同时将把红包发补发出去，「发放奖品人数」数据才会随之变化。
						</p>
						<p style="margin-bottom: 2px;font-weight: 700">
							参与者身份，分为新用户参与和老用户参与。
						</p>
						<p style="margin-bottom: 2px; text-indent:2em;">
							a、新用户，尚未添加过活动所设置的企业成员，扫码关注或是回复关键词后，推送员工的企业微信二维码，添加后，欢迎语推送专属个人海报（内含关注公众号的二维码），即新用户参与。
						</p>
						<p style="margin-bottom: 2px; text-indent:2em;">
							b、老用户，曾经通过其他渠道添加过该活动所设置的企业成员，不论当前是否已将该成员删除/拉黑。通过扫码关注或是回复关键词后，自动推送带其专属个人海报（内含关注公众号的二维码），即老用户参与。
						</p>
						<p style="margin-bottom: 2px; text-indent:2em;">
							另外，参与人已添加上某场活动所设置的企业成员，中途更换企业成员，不影响参与者继续邀请好友。当该活动设置成员A和B，参与者之前加过A，但没添加过B，依然作为老用户参与。
						</p>
					</template>
					<p style="margin-bottom: 2px; font-weight: 700;">
						助力者身份，分为新用户助力和老用户助力。
					</p>
					<p style="margin-bottom: 2px; text-indent:2em;">
						a、新用户助力，尚未添加过活动所设置的企业成员，通过好友海报，扫码关注公众号后，推送员工的企业微信二维码，添加后，即助力成功。若用户再帮他人助力，则提示老用户助力无效。若中途更换企业成员，可以再帮他人助力，助力成功后，再帮他人助力，则提示老用户助力无效。
					</p>
					<p style="margin-bottom: 2px; text-indent:2em;">
						b、老用户助力，曾经通过其他渠道添加过该活动所设置的企业成员，不论当前是否已将该成员删除/拉黑。通过好友海报，扫码关注公众号后，提示老用户无法助力。若中途更换企业成员，可以再帮他人助力，助力成功后，再帮他人助力，则提示老用户助力无效。
					</p>
				</a-collapse-panel>
			</a-collapse>
		</div>
		<div class="content-msg" v-else>
			<p style="margin-bottom: 18px;">
				「参与活动人数」和「完成任务人数」是随活动进行实时自动统计。如果以红包作为奖品，只要微信支付商户平台账户余额充足，当参与人完成任务，即自动发放至用户的个人零钱里。若出现账户不足，红包无法发放，待补足账户余额后，需手动「标记为」已发奖，同时将把红包发补发出去，「发放奖品人数」数据才会随之变化。
			</p>
		</div>
		<ul class="statistics-ul">
			<li style="background: #40A9FF;">
				<p>参与活动人数</p>
				<p class="number">{{fansCount}}</p>
				<p class="count"></p>
			</li>
			<li style="background: #FFC71B;">
				<p>
					完成任务人数
				</p>
				<p class="number">{{levelCount}}</p>
				<!--				<p class="count">-->
				<!--					<span v-if="oneCount != null">一阶：{{oneCount}}</span>-->
				<!--					<span v-if="twoCount != null">二阶：{{twoCount}}</span>-->
				<!--					<span v-if="threeCount != null">三阶：{{threeCount}}</span>-->
				<!--				</p>-->
			</li>
			<li style="background: #FF688E;">
				<p>
					发放奖品人数
				</p>
				<p class="number">{{prizeCount}}</p>
				<!--				<p class="count">-->
				<!--					<span v-if="prizeOneCount != null">一阶：{{prizeOneCount}}</span>-->
				<!--					<span v-if="prizeTwoCount != null">二阶：{{prizeTwoCount}}</span>-->
				<!--					<span v-if="prizeThreeCount != null">三阶：{{prizeThreeCount}}</span>-->
				<!--				</p>-->
			</li>
		</ul>
		<div class="participants">
			<div style="margin: 10px 0px;padding: 10px 20px 0 20px;">
				<a-select
						showSearch
						optionFilterProp="children"
						placeholder="完成状态"
						style="width: 200px;margin-bottom: 20px;margin-right: 10px;"
						v-model="success"
				>
					<a-select-option :value="0">全部完成状态</a-select-option>
					<a-select-option :value="1">已完成</a-select-option>
					<a-select-option :value="2">未完成</a-select-option>
				</a-select>
				<a-select
						optionFilterProp="children"
						style="width: 200px;margin-bottom: 20px;margin-right: 10px;"
						v-model="success_prize"
				>
					<a-select-option :value="0">全部发奖状态</a-select-option>
					<a-select-option :value="1">已发奖</a-select-option>
					<a-select-option :value="2">未发奖</a-select-option>
				</a-select>
<!--				<a-select-->
<!--						optionFilterProp="children"-->
<!--						style="width: 200px;margin-bottom: 20px;margin-right: 10px;"-->
<!--						v-model="status"-->
<!--				>-->
<!--					<a-select-option :value="0">全部状态</a-select-option>-->
<!--					<a-select-option v-if="!(type == 2)" :value="1">已关注</a-select-option>-->
<!--					<a-select-option v-if="!(type == 2)" :value="2">未关注</a-select-option>-->
<!--					<a-select-option v-if="!(type == 1)" :value="3">已添加</a-select-option>-->
<!--					<a-select-option v-if="!(type == 1)" :value="4">未删除</a-select-option>-->
<!--				</a-select>-->
				<a-select
						v-if="action_type == 1"
						optionFilterProp="children"
						style="width: 200px;margin-bottom: 20px;margin-right: 10px;"
						v-model="is_form"
				>
					<a-select-option :value="0">全部填写状态</a-select-option>
					<a-select-option :value="1">已填写</a-select-option>
					<a-select-option :value="2">未填写</a-select-option>
				</a-select>
				<a-input placeholder="搜索参与者名称" v-model="name" @keydown.enter="searchFans"
				         style="width: 170px;margin-right: 10px;"/>
				<a-button type="primary" @click="searchFans">查询</a-button>
				<a-button style="margin-left: 10px;" @click="reloadParticipants">清除</a-button>
<!--				<div style="height: 60px;line-height: 60px;float: right">-->
<!--					<a-dropdown>-->
<!--						<a-menu slot="overlay" @click="chooseDownType">-->
<!--							<a-menu-item key="0">当前页导出</a-menu-item>-->
<!--							<a-menu-item key="1">全部导出</a-menu-item>-->
<!--						</a-menu>-->
<!--						<a-button type="primary" icon="download" style="margin: 0 0 10px 0;">导出-->
<!--							<a-icon style="color: #FFFFFF;" type="down"/>-->
<!--						</a-button>-->
<!--					</a-dropdown>-->
<!--				</div>-->
			</div>
			<div style="height: 32px;line-height: 32px;padding-left: 20px;">
				共
				<span style="color: blue">{{total2}}</span>条
			</div>
			<div style="padding: 0 20px 20px;">
				<a-spin tip="加载中..." size="large" :spinning="isLoading1">
					<a-table
							:columns="type == 1 && action_type == 1 ? columns0 : (type == 1 && action_type != 1 ? columns : (type == 3 && action_type == 1 ? columns1 : (type == 3 && action_type != 1) ? columns2 : (type == 2 && action_type == 1 ? columns7 : columns8)))"
							:dataSource="participantsList"
							:pagination="false"
							:rowClassName="rowClassName">
						<span slot="activity_num">
							有效助力人数
							<a-popover placement="top">
			                    <template slot="content">
				                    <div style="width: 240px;">
				                        <p style="margin-bottom: 0;line-height: 25px;">与当前活动对有效助力人数的定义有关。如本场活动配置为“好友取关扣除有效助力人数”，那么，当前人气，即为扣除取关人数，才算好友有效助力。</p>
				                    </div>
			                    </template>
			                    <a-icon type="question-circle"
			                            style="margin-left:5px;"/>
							</a-popover>
						</span>
						<span slot="friendStatus">
							好友状态
							<a-popover placement="top">
			                    <template slot="content">
				                    <p style="margin-bottom: 2px;">已添加：a、参与人曾经通过其他渠道添加过该活动所设置的企业成员，默认标记上</p>
				                    <p style="margin-bottom: 2px;text-indent: 4em;"> b、参与人刚参与该场活动新添加上</p>
				                    <p style="margin-bottom: 2px;">已删除：企业成员被参与人删除/拉黑</p>
									<p style="margin-bottom: 2px;"> 未知（--）：参与人已添加上某场活动所设置的企业成员后，中途更换企业成员，不影响参与者继续邀请好友，好友状态显示“--”。</p>
			                    </template>
			                    <a-icon type="question-circle"
			                            style="margin-left:5px;"/>
							</a-popover>
						</span>
						<!--						<span slot="oldCount">-->
						<!--							累计助力-->
						<!--							<a-tooltip placement="top">-->
						<!--			                    <template slot="title">-->
						<!--				                    <div style="width: 240px;">-->
						<!--				                        <p style="margin-bottom: 0;line-height: 25px;">所有好友助力的人数，包含好友取关、被好友删除/拉黑。</p>-->
						<!--				                    </div>-->
						<!--			                    </template>-->
						<!--			                    <a-icon type="question-circle"-->
						<!--			                            style="margin-left:5px;"/>-->
						<!--							</a-tooltip>-->
						<!--						</span>-->
						<span slot="checkedBox" slot-scope="text, record, index">
							<a-checkbox style="" :disabled="record.status != 0"
							            v-model="checkBoxValue[index]"
							            @click="changeSelectKey(record.id)"></a-checkbox>
						</span>
						<span slot="user" slot-scope="text, record">
							<a-avatar v-if="record.headerimg" shape="square" :size="42" :src="record.headerimg"
							          style="float: left;"/>
							<img style="width: 42px;height: 42px;float: left;" v-if="!record.headerimg"
							     src="../../../../assets/useradvart.png"/>
							<a-popover placement="right">
								<span slot="content">
									{{record.nickname}}
								</span>
								<span class="participant-name">
									{{record.nickname}}
								</span>
							</a-popover>
						</span>
						<span slot="subscribe" slot-scope="text, record">
							<span v-if="record.subscribe == 1">已关注</span>
							<span v-if="record.subscribe == 0">未关注</span>
							<span v-if="record.subscribe != 0 && record.subscribe != 1">{{text}}</span>
						</span>
						<span slot="complete_time" slot-scope="text, record">
							<span v-if="record.status == 2">{{record.complete_time}}</span>
							<span v-if="record.status != 2">--</span>
						</span>
						<span slot="success" slot-scope="text, record">
							<span v-if="record.status == null">未完成</span>
							<span v-else>已完成</span>
						</span>
						<span slot="status" slot-scope="text, record">
							<span v-if="record.status == null">--</span>
							<span v-if="record.status == 0">未发放</span>
							<span v-if="record.status == 1">已发放</span>
						</span>
						<span slot="action" slot-scope="text, record">
							<a-button @click="helpRecord(record.id, record.nickname)"
							          style="margin: 0 5px 5px 0">助力记录</a-button>
							<a-button v-has="menuType == 1 ? 'wholeMarketFission-award' : 'wxWholeMarketFission-award'"
							          v-if="record.status == 0" @click="signOne(1, record.id, record.nickname)"
							          style="margin: 0 5px 5px 0">标记为已发奖品</a-button>
						</span>
						<span slot="is_form" slot-scope="text, record, index">
							<span v-if="!record.is_form">未填写</span>
							<span v-else>已填写（<span style="cursor: pointer; color: #01b065;"
							                       @click="lookForm(index)">查看</span>）</span>
						</span>
					</a-table>
					<!-- 分页 -->
					<div class="pagination" style="width: 100%;position: absolute;margin: 40px 0px 20px;"
					     v-show="total2 > 0">
						<div style="height: 32px;float: left;line-height: 32px;">
							<a-checkbox
									v-has="menuType == 1 ? 'wholeMarketFission-award' : 'wxWholeMarketFission-award'"
									:disabled="participantsKeys.length == 0 || isCurrentPageDisabled"
									v-model="batchTypeValue"
									@click="batchTypeChange"></a-checkbox>
							<a-select v-has="menuType == 1 ? 'wholeMarketFission-award' : 'wxWholeMarketFission-award'"
							          optionFilterProp="children"
							          :disabled="participantsKeys.length == 0 || isCurrentPageDisabled"
							          v-model="batchType"
							          @change="changeBatchType"
							          style="width: 150px; margin: 0 5px;">
								<a-select-option value="0">选择当前页</a-select-option>
								<a-select-option value="1">选择所有</a-select-option>
							</a-select>
							<!--							<a-popover placement="bottom">-->
							<!--								<span slot="content">-->
							<a-button v-has="menuType == 1 ? 'wholeMarketFission-award' : 'wxWholeMarketFission-award'"
							          :disabled="selectedRowKeys.length == 0" @click="sign(1)">标记为已发奖品
							</a-button>
							<!--									<p @click="sign(2)" class="sign">已发二阶奖品</p>-->
							<!--									<p @click="sign(3)" class="sign">已发三阶奖品</p>-->
							<!--								</span>-->
							<!--								<a-button v-if="selectedRowKeys.length != 0" type="primary">标记为-->
							<!--									<a-icon type="down"></a-icon>-->
							<!--								</a-button>-->
							<!--							</a-popover>-->
							<!--							<a-button v-if="selectedRowKeys.length == 0" :disabled="true" type="primary">标记为-->
							<!--								<a-icon type="down"></a-icon>-->
							<!--							</a-button>-->
						</div>
						<div class="pagination" style="height: 32px;float: right;">
							<a-pagination :total="total2" showSizeChanger :showQuickJumper="quickJumper2"
							              :current="page2"
							              :pageSize="pageSize2" :pageSizeOptions="['15','30','50','100']"
							              @change="changePage2"
							              @showSizeChange="showSizeChange2"/>
						</div>
					</div>
				</a-spin>
			</div>
		</div>
		<a-drawer placement="right" :closable="false" @close="onClose" width="888px!important" :visible="visible">
			<div style="padding-bottom: 100px;">
				<div style="height: 50px; line-height: 50px;border-bottom: 1px solid #E8E8E8;">
					<label style="margin-left: 20px; font-weight: 700;">{{participantName}}</label>
				</div>
				<div style="padding: 0 20px;margin-top: 10px;">
					<span @click="changeTabs('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}">助力记录</span>
					<span @click="changeTabs('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}">裂变层级</span>
				</div>
				<div style="padding: 10px 20px; margin: 0 20px; border: 1px solid #E8E8E8">
					<a-spin tip="加载中..." size="large" :spinning="isLoading2">
						<div class="content-msg1" v-if="tabKey == 2">
							<p style="margin-bottom: 2px;">裂变层级越多，代表参与者的人脉越广，传播效果越好。</p>
							<p style="margin-bottom: 2px;">活动裂变层级一级：在公众号后台回复关键词参加活动+扫描推广码参加活动。在助力记录中不显示该层级。</p>
							<p style="margin-bottom: 2px;">二级是扫描一级粉丝海报二维码参加活动的，三级四级以此类推。</p>
							<p style="margin-bottom: 0px; color: #F56C6C;">
								系统在第14级后，用【其他】代替层级，也就是说第1级、第2级。。。。第14级、其他。</p>
						</div>
						<div style="margin-bottom: 20px;" v-if="tabKey == 2">
							<div>
								<BarCharts style="width:100%;"
								           :options="fansLineData"
								></BarCharts>
							</div>
							<div>
								<a-table :columns="columns4" :dataSource="fansList" :pagination="false"
								         :rowClassName="rowClassName">
									<span slot="value" slot-scope="text, record, index">
										{{record.value}}%
									</span>
								</a-table>
							</div>
						</div>
						<a-row style="margin-bottom: 10px;" v-if="tabKey == 1">
							<a-input :allowClear="true" v-model="helpName" @keydown.enter="helpRecord1(1, 15)"
							         placeholder="搜索助力人名称" style="width: 170px;margin-right: 10px;"></a-input>
							<a-button type="primary" @click="helpRecord1(1, 15)">搜索</a-button>
						</a-row>
						<a-table v-if="tabKey == 1"
						         :columns="activityType == 1 ? columns3 : activityType == 2 ? columns5 : columns6"
						         :dataSource="hlepRecordList" :pagination="false"
						         :rowClassName="rowClassName">
							<span slot="user" slot-scope="text, record">
								<a-avatar v-if="record.headerimg" shape="square" :size="42" :src="record.headerimg"
								          style="float: left;"/>
								<img style="width: 42px;height: 42px;float: left;" v-if="!record.headerimg"
								     src="../../../../assets/useradvart.png"/>
								<a-popover placement="right">
									<span slot="content">
										{{record.nickname}}
									</span>
									<span class="participant-name">
										{{record.nickname}}
									</span>
								</a-popover>
							</span>
							<span slot="type" slot-scope="text, record">
								<span v-if="record.type == null">助力成功</span>
								<span v-if="record.type == 1">老客户参与，助力无效</span>
								<span v-if="record.type == 2">因取关，助力无效</span>
								<span v-if="record.type == 3">因取关+被客户删除/拉黑，助力无效</span>
								<span v-if="record.type == 4">被客户删除/拉黑，助力无效</span>
								<span v-if="record.type == 5">助力未完成</span>
							</span>
						</a-table>
						<!-- 分页 -->
						<div class="pagination" style="width: 100%;margin: 20px 0px;"
						     v-if="total3 > 0 && tabKey == 1">
							<div style="height: 32px;display: inline-block; line-height: 32px;">
								共
								<span style="color: blue">{{total3}}</span>条
							</div>
							<div class="pagination" style="height: 32px;float: right;">
								<a-pagination :total="total3" showSizeChanger :showQuickJumper="quickJumper3"
								              :current="page3"
								              :pageSize="pageSize3" :pageSizeOptions="['15','30','50','100']"
								              @change="changePage3"
								              @showSizeChange="showSizeChange3"/>
							</div>
						</div>
					</a-spin>
				</div>
			</div>
		</a-drawer>
		<a-modal title="表单填写" v-model="formVisible" @close="handleCancel" width="666px!important">
			<template slot="footer">
				<a-button key="back" @click="handleCancel">关闭</a-button>
			</template>
			<a-form>
				<a-form-item label="姓名" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
					{{nickname}}
				</a-form-item>
				<a-form-item label="手机号码" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
					{{mobile}}
				</a-form-item>
				<a-form-item label="收货地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
					<span style="word-break: break-all;">{{address}}</span>
				</a-form-item>
				<a-form-item label="备注" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
					{{remark}}
				</a-form-item>
			</a-form>
		</a-modal>
		<!-- 导出进度条弹窗 -->
		<a-modal v-model="progressVisible" title="导出进度" :footer="false" :closable="progressCloseable"
		         :maskClosable="false"
		         :maskStyle="{'left':leftSiderWidth}" :wrapClassName="'mask-dialog'" @cancel="progressCancel">
			<div style="text-align: center;">
				<a-progress class="download-progress" stroke-linecap="square" :percent="progressNum" type="circle"
				            :width="progressWidth"/>
				<p style="margin: 20px auto;" v-if="progressNum == 100">已导出成功，请点击<span
						style="color: #01b065;cursor: pointer;" @click="progressDownload">下载</span></p>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import BarCharts from '../../../../components/echarts/BarCharts'

	// 参与者列表
	const columns0 = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "60px",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "参与人",
			dataIndex  : "user",
			key        : "user",
			width      : "200px",
			scopedSlots: {customRender: "user"}
		},
		{
			title      : "关注状态",
			dataIndex  : "subscribe",
			key        : "subscribe",
			scopedSlots: {customRender: "subscribe"}
		},
		{
			// title    : "当前人气",
			dataIndex  : "activity_num",
			key        : "activity_num",
			scopedSlots: {title: "activity_num"}
		},
		{
			title    : "所属公众号",
			dataIndex: "nick_name",
			key      : "nick_name"
		},
		{
			title      : "完成状况",
			dataIndex  : "success",
			key        : "success",
			scopedSlots: {customRender: "success"}
		},
		{
			title      : "发奖状况",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "是否填写表单",
			dataIndex  : "is_form",
			key        : "is_form",
			width      : '180px',
			scopedSlots: {customRender: "is_form"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '15%',
			scopedSlots: {customRender: "action"}
		}
	];
	const columns = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "60px",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "参与人",
			dataIndex  : "user",
			key        : "user",
			width      : "200px",
			scopedSlots: {customRender: "user"}
		},
		{
			title      : "关注状态",
			dataIndex  : "subscribe",
			key        : "subscribe",
			scopedSlots: {customRender: "subscribe"}
		},
		{
			// title    : "当前人气",
			dataIndex  : "activity_num",
			key        : "activity_num",
			scopedSlots: {title: "activity_num"}
		},
		{
			title    : "所属公众号",
			dataIndex: "nick_name",
			key      : "nick_name"
		},
		{
			title      : "完成状况",
			dataIndex  : "success",
			key        : "success",
			scopedSlots: {customRender: "success"}
		},
		{
			title      : "发奖状况",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '15%',
			scopedSlots: {customRender: "action"}
		}
	];
	const columns1 = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "60px",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "参与人",
			dataIndex  : "user",
			key        : "user",
			width      : "200px",
			scopedSlots: {customRender: "user"}
		},
		{
			title      : "关注状态",
			dataIndex  : "subscribe",
			key        : "subscribe",
			scopedSlots: {customRender: "subscribe"}
		},
		{
			// title    : "好友状态",
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {title: 'friendStatus'},
		},
		{
			// title    : "当前人气",
			dataIndex  : "activity_num",
			key        : "activity_num",
			scopedSlots: {title: "activity_num"}
		},
		{
			title    : "所属公众号",
			dataIndex: "nick_name",
			key      : "nick_name"
		},
		{
			title      : "完成状况",
			dataIndex  : "success",
			key        : "success",
			scopedSlots: {customRender: "success"}
		},
		{
			title      : "发奖状况",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "是否填写表单",
			dataIndex  : "is_form",
			key        : "is_form",
			width      : '180px',
			scopedSlots: {customRender: "is_form"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '15%',
			scopedSlots: {customRender: "action"}
		}
	];
	const columns2 = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "60px",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "参与人",
			dataIndex  : "user",
			key        : "user",
			width      : "200px",
			scopedSlots: {customRender: "user"}
		},
		{
			title      : "关注状态",
			dataIndex  : "subscribe",
			key        : "subscribe",
			scopedSlots: {customRender: "subscribe"}
		},
		{
			// title    : "好友状态",
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {title: 'friendStatus'},
		},
		{
			// title    : "当前人气",
			dataIndex  : "activity_num",
			key        : "activity_num",
			scopedSlots: {title: "activity_num"}
		},
		{
			title    : "所属公众号",
			dataIndex: "nick_name",
			key      : "nick_name"
		},
		{
			title      : "完成状况",
			dataIndex  : "success",
			key        : "success",
			scopedSlots: {customRender: "success"}
		},
		{
			title      : "发奖状况",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '15%',
			scopedSlots: {customRender: "action"}
		}
	];
	const columns7 = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "60px",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "参与人",
			dataIndex  : "user",
			key        : "user",
			width      : "200px",
			scopedSlots: {customRender: "user"}
		},
		{
			// title    : "好友状态",
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {title: 'friendStatus'},
		},
		{
			// title    : "当前人气",
			dataIndex  : "activity_num",
			key        : "activity_num",
			scopedSlots: {title: "activity_num"}
		},
		{
			title      : "完成状况",
			dataIndex  : "success",
			key        : "success",
			scopedSlots: {customRender: "success"}
		},
		{
			title      : "发奖状况",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "是否填写表单",
			dataIndex  : "is_form",
			key        : "is_form",
			width      : '180px',
			scopedSlots: {customRender: "is_form"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '15%',
			scopedSlots: {customRender: "action"}
		}
	];
	const columns8 = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "60px",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "参与人",
			dataIndex  : "user",
			key        : "user",
			width      : "200px",
			scopedSlots: {customRender: "user"}
		},
		{
			// title    : "好友状态",
			dataIndex  : "user_name",
			key        : "user_name",
			scopedSlots: {title: 'friendStatus'},
		},
		{
			// title    : "当前人气",
			dataIndex  : "activity_num",
			key        : "activity_num",
			scopedSlots: {title: "activity_num"}
		},
		{
			title      : "完成状况",
			dataIndex  : "success",
			key        : "success",
			scopedSlots: {customRender: "success"}
		},
		{
			title      : "发奖状况",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '15%',
			scopedSlots: {customRender: "action"}
		}
	];
	const columns3 = [
		{
			title      : "助力人",
			dataIndex  : "user",
			key        : "user",
			scopedSlots: {customRender: "user"}
		},
		{
			title      : "助力状态",
			dataIndex  : "type",
			key        : "type",
			scopedSlots: {customRender: "type"}
		},
		{
			title    : "关注时间",
			dataIndex: "f_time",
			key      : "f_time"
		},
		{
			title    : "助力时间",
			dataIndex: "create_time",
			key      : "create_time"
		}
	];
	const columns5 = [
		{
			title      : "助力人",
			dataIndex  : "user",
			key        : "user",
			scopedSlots: {customRender: "user"}
		},
		{
			title    : "添加企业成员",
			dataIndex: "work_user_name",
			key      : "work_user_name"
		},
		{
			title      : "助力状态",
			dataIndex  : "type",
			key        : "type",
			scopedSlots: {customRender: "type"}
		},
		{
			title    : "助力时间",
			dataIndex: "create_time",
			key      : "create_time"
		}
	];
	const columns6 = [
		{
			title      : "助力人",
			dataIndex  : "user",
			key        : "user",
			scopedSlots: {customRender: "user"}
		},
		{
			title    : "添加企业成员",
			dataIndex: "work_user_name",
			key      : "work_user_name"
		},
		{
			title      : "助力状态",
			dataIndex  : "type",
			key        : "type",
			scopedSlots: {customRender: "type"}
		},
		{
			title    : "关注时间",
			dataIndex: "f_time",
			key      : "f_time"
		},
		{
			title    : "助力时间",
			dataIndex: "create_time",
			key      : "create_time"
		}
	];
	const columns4 = [
		{
			title    : "层级",
			dataIndex: "name",
			key      : "name"
		},
		{
			title    : "人数",
			dataIndex: "proportion",
			key      : "proportion"
		},
		{
			title      : "占比",
			dataIndex  : "value",
			key        : "value",
			scopedSlots: {customRender: "value"}
		},
	];
	export default {
		name      : "makrketFissionParticipants",
		data () {
			return {
				progressVisible      : false,//进度条弹窗显示与隐藏
				progressNum          : 0,//进度条进度
				leftSiderWidth       : document.getElementsByClassName('menu-sider')[0].style.width,
				downLoadUrl          : '',//下载链接
				progressWidth        : 120,//进度条的宽度
				progressCloseable    : false, // 导出关闭
				menuType             : 1, // 公众号/企业微信  菜单
				formVisible          : false, // 表单填写弹窗是否显示
				type                 : 1, // 活动类型  公众号/企业微信/公众号+企业微信
				action_type          : 1, // 是否显示填写表单
				title                : '', // 活动名称
				columns0,
				columns,
				columns1,
				columns2,
				columns7,
				columns8,
				is_all               : 0, // 参与者是否获取所有数据
				is_export            : 0, // 导出列表字段 0 获取列表 1 导出列表
				address              : '', // 表单地址
				remark               : '', // 表单备注
				mobile               : '', // 表单手机号
				nickname             : '', // 表单姓名
				name                 : '', // 参与者姓名搜索
				fansCount            : 0, // 参与活动人数
				levelCount           : 0, // 完成任务人数
				oneCount             : 0, // 一阶完成任务人数 暂未使用
				twoCount             : 0, // 二阶完成任务人数 暂未使用
				threeCount           : 0, // 三阶完成任务人数 暂未使用
				prizeCount           : 0, // 发放奖品人数
				prizeOneCount        : 0, // 一阶发放奖品人数 暂未使用
				prizeTwoCount        : 0, // 二阶发放奖品人数 暂未使用
				prizeThreeCount      : 0, // 三阶发放奖品人数 暂未使用
				success              : 0, // 参与者搜索完成状态搜索
				success_prize        : 0, // 参与者搜索发奖状态
				is_form              : 0, // 参与者搜索填写表单
				isLoading1           : false, // 参与者列表加载loading
				is_end               : 0,
				prize_send_type      : 1,
				isCurrentPageDisabled: true,
				participantsList     : [], // 参与者列表
				checkBoxValue        : [],
				activityId           : '', // 活动id
				total2               : 0, // 参与者总数
				page2                : 1,
				pageSize2            : 15,
				quickJumper2         : false,
				batchType            : '0',       //0当前页 1所有
				batchTypeValue       : false,     //当前页/所有 是否选中
				selectedRowKeys      : [], // 多选id
				participantsKeys     : [], // 所有id
				visible              : false,
				tabKey               : 1, // 助力记录tab
				participantName      : '', // 助力记录标题 -- 参与者名称
				jid                  : '', // 助力记录 粉丝id
				columns4,
				columns3,
				columns5,
				columns6,
				isLoading2           : false,  // 助力记录列表加载
				helpName             : '', // 助力记录 粉丝名称搜索
				activityType         : '', // 助力记录 活动类型
				hlepRecordList       : [],  // 助力记录列表
				fansList             : [], // 助力记录列表
				fansLineData         : {
					title     : '助力层级',
					xAxisData : [],
					name      : '助力层级',
					seriesData: []
				},
				total3               : 0,
				page3                : 1,
				pageSize3            : 15,
				quickJumper3         : false,
			}
		},
		components: {
			BarCharts
		},
		methods   : {
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			isCurrentDisabled () {
				if (this.participantsList.length == 0) {
					this.isCurrentPageDisabled = true
				}
				for (let i = 0; i < this.participantsList.length; i++) {
					if (this.participantsList[i].status == 0) {
						this.isCurrentPageDisabled = false
					}
				}
			},
			// 卡片选择
			changeSelectKey (key) {
				for (let i = 0; i < this.selectedRowKeys.length; i++) {
					if (key == this.selectedRowKeys[i]) {
						this.selectedRowKeys.splice(i, 1)
						this.setBox()
						return false
					}
				}
				this.selectedRowKeys.push(key)
				this.setBox()
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					// 添加
					if (this.batchType == 0) {
						// 当前页
						this.addKey(this.participantsList)
						this.setCheckedBox(this.participantsList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = JSON.parse(JSON.stringify(this.participantsKeys))
						this.setBox()
					}
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						// 当前
						this.removeKey(this.participantsList)
						this.setCheckedBox(this.participantsList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
						this.setBox()
					}
					this.batchTypeValue = false
				}
			},
			setBox () {
				this.setCheckedBox(this.participantsList)
			},
			// 设置列表卡片多选框选中状态
			setCheckedBox (participantsList) {
				this.checkBoxValue = new Array(participantsList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < participantsList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (participantsList[i].id == this.selectedRowKeys[j]) {
							this.checkBoxValue[i] = true
						}
					}
				}
				if (this.batchType == 0) {
					this.batchTypeValue = true
					for (let i = 0; i < this.checkBoxValue.length; i++) {
						if (!this.checkBoxValue[i] && participantsList[i].status == 0) {
							this.batchTypeValue = false
						}
					}
					if (this.selectedRowKeys.length == 0) {
						this.batchTypeValue = false
					}
				} else {
					if (this.selectedRowKeys.length == this.participantsKeys.length && this.participantsKeys.length != 0) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}
				if (participantsList.length == 0) {
					this.batchTypeValue = false
				}

			},
			// 当前/所有 类型选择框变化
			changeBatchType (type) {
				this.batchType = type
				if (this.batchTypeValue) {
					if (this.batchType == 0) {
						this.selectedRowKeys = []
					}
					this.batchTypeValue = false
					this.batchTypeChange()
				} else {
					this.setBox()
				}
			},
			// 增加当前页key
			addKey (participantsList) {
				for (let i = 0; i < participantsList.length; i++) {
					if (participantsList[i].status == 0) {
						let index = this.selectedRowKeys.findIndex((id) => id === participantsList[i].id)
						if (index == -1) {
							this.selectedRowKeys.push(participantsList[i].id)
						}
					}
				}
			},
			// 删除当前页key
			removeKey (participantsList) {
				for (let i = 0; i < participantsList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === participantsList[i].id);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			rollback () {
				if (localStorage.getItem('type') == 1) {
					this.$router.push("/wholeMarket/fissionList?isRefresh=1")
				} else {
					this.$router.push("/wholeMarket/fissionList1?isRefresh=1")
				}
			},
			// 查找粉丝
			searchFans () {
				this.is_all = '0'
				this.is_export = 0
				this.participants(1, 15)
			},
			sign (type) {
				let that = this;
				that.$confirm({
					title     : "确定标记选中的参与人？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.changeStatus(type, that.selectedRowKeys)
					}
				});
			},
			signOne (type, id, name) {
				let that = this;
				that.$confirm({
					title     : "确定标记【" + name + "】？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						let ids = []
						ids.push(id)
						that.changeStatus(type, ids)
					}
				});
			},
			async changeStatus (type, selectedRowKeys) {
				const {data: res} = await this.axios.post("work-activity-public/activity-prize", {
					prize_id   : selectedRowKeys,
					level      : type,
					activity_id: this.activityId
				});
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('标记成功')
					this.selectedRowKeys = []
					this.is_all = '0'
					this.is_export = 0
					this.participants(this.page2, this.pageSize3)
				}
			},
			// 清除
			reloadParticipants () {
				this.name = ''
				this.success = 0
				this.success_prize = 0
				this.is_form = 0
				this.is_all = '0'
				this.is_export = 0
				this.participants(1, 15)
			},
			//选择下载方式
			chooseDownType (e) {
				this.is_all = e.key
				this.is_export = 1
				this.progressVisible = true
				this.progressCloseable = false
				this.progressNum = 0
				this.progressWidth = 120
				this.moveMask()
				this.participants()
			},
			moveMask () {
				this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
				this.$nextTick(() => {
					document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
				})
			},
			// 参与者
			async participants (page = 1, pageSize = this.pageSize2) {
				this.isLoading1 = true
				const {data: res} = await this.axios.post("work-activity-public/get-activity-detail", {
					// uid     : localStorage.getItem("uid"),
					activity_id  : this.activityId,
					nickname     : this.name,
					success      : this.success,
					success_prize: this.success_prize,
					is_form      : this.is_form,
					page         : page,
					pageSize     : pageSize,
					is_export    : this.is_export,
					is_all       : this.is_all
				});
				if (res.error != 0) {
					this.isLoading1 = false;
					this.$message.error(res.error_msg);
				} else {
					if (this.is_export == 0) {
						this.type = res.data.type
						this.action_type = res.data.action_type
						this.page2 = page
						this.pageSize2 = pageSize
						this.participantsList = res.data.fans
						this.participantsKeys = res.data.fansIds
						this.isCurrentDisabled()
						this.setCheckedBox(this.participantsList)
						this.fansCount = res.data.fansCount
						this.levelCount = res.data.levelCount
						this.oneCount = res.data.oneCount
						this.twoCount = res.data.twoCount
						this.threeCount = res.data.threeCount
						this.prizeCount = res.data.prizeCount
						this.prizeOneCount = res.data.prizeOneCount
						this.prizeTwoCount = res.data.prizeTwoCount
						this.prizeThreeCount = res.data.prizeThreeCount
						// this.participantsKeys = res.data.keys
						this.total2 = parseInt(res.data.count)
						this.isLoading1 = false
					} else {
						this.isLoading1 = false
					}
					// else {
					// 	window.open(res.data.url)
					// 	this.isLoading1 = false
					// }
				}

			},
			// 参与者切换分页
			changePage2 (page, pageSize) {
				this.is_all = '0'
				this.is_export = 0
				this.participants(page, this.pageSize2)
			},
			showSizeChange2 (page, pageSize) {
				this.is_all = '0'
				this.is_export = 0
				this.participants(this.page2, pageSize)
			},
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
			},
			lookForm (index) {
				this.address = this.participantsList[index].address
				this.remark = this.participantsList[index].remark
				this.mobile = this.participantsList[index].mobile
				this.nickname = this.participantsList[index].name
				this.formVisible = true
			},
			handleCancel () {
				this.formVisible = false
				this.address = ''
				this.remark = ''
				this.mobile = ''
				this.nickname = ''
			},
			helpRecord (jid, name) {
				this.jid = jid
				this.participantName = name
				this.helpRecord1()
				this.visible = true
			},
			onClose () {
				this.visible = false
				this.helpName = ''
				this.tabKey = 1
			},
			changeTabs (key) {
				this.tabKey = key
			},
			// 助力记录
			async helpRecord1 (page = 1, pageSize = this.pageSize3) {
				this.isLoading2 = true
				const {data: res} = await this.axios.post("work-activity-public/activity-trace", {
					uid        : localStorage.getItem("uid"),
					fans_id    : this.jid,
					activity_id: this.activityId,
					name       : this.helpName,
					page       : page,
					pageSize   : pageSize
				});
				if (res.error != 0) {
					this.isLoading2 = false;
					this.$message.error(res.error_msg);
				} else {
					this.fansLineData.xAxisData = []
					this.fansLineData.seriesData = []
					this.hlepRecordList = res.data.user
					this.activityType = res.data.type
					this.fansList = res.data.fansUsers
					for (let s of this.fansList) {
						this.fansLineData.xAxisData.push(s.name)
						this.fansLineData.seriesData.push(s.proportion)
					}
					this.page3 = page
					this.pageSize3 = pageSize
					this.total3 = parseInt(res.data.count)
					this.isLoading2 = false
				}
			},
			changePage3 (page, pageSize) {
				this.helpRecord1(page, this.pageSize3)
			},
			showSizeChange3 (page, pageSize) {
				this.helpRecord1(1, pageSize)
			},
			//后台返回导入进度数据处理
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'export_activity') {
					this.progressVisible = true
					this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
					this.$nextTick(() => {
						document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
					})
					this.progressNum = parseInt(data.export_num / data.num * 100)
					if (this.progressNum == 100) {
						this.progressWidth = 100
						this.downLoadUrl = data.url
						this.progressCloseable = true
					}
					if (data.url != '') {
						sessionStorage.setItem('fissionDownLoadUrl', this.downLoadUrl)
					}
				}
			},
			//下载
			progressDownload () {
				window.open(this.downLoadUrl)
				this.progressCancel()
			},
			progressCancel () {
				sessionStorage.removeItem('fissionDownLoadUrl')
				this.progressVisible = false
			},
		},
		mounted () {
			this.title = decodeURIComponent(this.$route.query.title)
			this.activityId = decodeURIComponent(this.$route.query.id)
			this.menuType = localStorage.getItem('type')
			this.is_all = '0'
			this.is_export = 0
			this.participants()
			this.ws.setCallback(this.websocketOnMessage)
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.ws.setCallback(vm.websocketOnMessage)
				if (sessionStorage.getItem('fissionDownLoadUrl')) {
					vm.progressCloseable = true
					vm.progressNum = 100
					vm.progressWidth = 100
					vm.downLoadUrl = sessionStorage.getItem('fissionDownLoadUrl')
					vm.progressVisible = true
					vm.moveMask()
				}
			})
		},
		beforeRouteLeave (to, form, next) {
			this.ws.setCallback()
			this.progressVisible = false
			next()
		},
	}
</script>

<style lang="less" scoped>
	@import '../../../../style/_style.less';

	.content-msg {
		min-width: 845px;
		width: calc(100% - 40px);
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 20px 0px 20px 20px;
		text-align: left;
	}

	/deep/ .ant-collapse-arrow svg {
		color: #01b065;
		width: 20px;
		height: 20px;
		/*display: none !important;*/
	}

	/deep/ .ant-collapse, /deep/ .ant-collapse-content, /deep/ .ant-collapse-item {
		background: @color-bgc;
		border: 0px;
	}

	/deep/ .ant-collapse-content {
		color: rgba(0, 0, 0, 0.85);
	}

	/deep/ .ant-collapse-header {
		background: @color-bgc;
		border: 0px;
		padding: 0 16px !important;
	}

	.content-msg1 {
		width: calc(100% - 40px);
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 20px 0px 20px 20px;
		text-align: left;
	}

	.statistics-ul {
		overflow: hidden;
		padding: 0 20px;
		margin: 20px 0;
		display: flex;
		justify-content: space-between;

		li {
			width: 30%;
			height: 105px;
			color: #FFF;
			padding: 10px;

			p {
				margin-bottom: 0;
			}

			.number {
				font-size: 30px;
			}

			.count {
				float: right;
			}
		}
	}

	.participants {
		margin: 10px 20px;
		background-color: #FFFFFF;
	}

	/deep/ .ant-tabs-card-content {
		padding-bottom: 0px !important;
	}

	.participant-name {
		display: inline-block;;
		float: left;
		margin-left: 10px;
		line-height: 42px;
		max-width: 100px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.sign {
		margin-top: 5px;
		margin-bottom: 0px;
		color: #01b065;
		cursor: pointer;
	}

	.sign:first-child {
		margin-top: 0px;
	}

	.sign:hover {
		text-decoration: underline;
	}

	.barshadow {
		height: 470px;
		z-index: 9999;
	}

	.tabBtn {
		margin: 0;
		margin-right: 2px;
		padding: 10px 16px;
		line-height: 38px;
		background: #FAFAFA;
		border: 1px solid #E8E8E8;
		border-bottom: 0;
		border-radius: 4px 4px 0 0;
		cursor: pointer;
	}

	.activeBtn {
		color: #01b065;
		background: #FFF;
	}
</style>