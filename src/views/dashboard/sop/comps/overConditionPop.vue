<template>
	<div>
		<a-modal
				title="完成情况"
				:width='1100'
				:visible="visible"
				@ok="handleOk"
				@cancel="handleCancel"
		>
			<template slot="footer">
				<a-button @click="handleOk">关闭</a-button>
			</template>
			<div class="">
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
					<div>
						<a-tabs type="card" @change="paneCallback">
							<a-tab-pane :key="0" tab="未完成"></a-tab-pane>
							<a-tab-pane :key="1" tab="已完成"></a-tab-pane>
						</a-tabs>
						<div>
							<div class='w-full'>
								<div class='bg-white'>
									<div class='flex items-center flex-wrap'>
										<div class="flex items-center mr-10 py-10">
											<div class="pr-10">{{is_chat==0? '选择执行人' : '选择群主' }}:</div>
											<div>
												<a-button @click="showDepartmentList" class='w-180'>
													<span v-if="chooseUserNum +  chooseDepartmentNum> 0">已选择{{chooseUserNum}}名成员</span>
													<span v-else>{{is_chat==0? '选择部门成员' : '选择群主' }}</span>
												</a-button>
											</div>
										</div>

										<div class="flex items-center mr-10 py-10">
											<div class="pr-10">{{!is_chat?'推送对象':'推送群聊'}}:</div>
											<div>
												<a-input class='w-160' v-model='name' :placeholder="!is_chat?'请输入推送对象':'请输入推送群聊'" />
											</div>
										</div>

										<div class="flex items-center mr-10 py-10">
											<div class="pr-10">推送时间:</div>
											<div>
												<a-range-picker :disabled-date="disabledDate" :show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }" v-model="pushTime" class='w-280' @change="onChangeAngePicker" />
											</div>
										</div>

										<div class="mr-10 py-10">
											<a-button type="primary" @click="_initData(1)">查找</a-button>
										</div>

										<div class="mr-30 py-10">
											<a-button @click="clearSelect(1)">清空</a-button>
										</div>
									</div>


									<div class="mt-10">
										<a-table
												:pagination="false"
												:columns="columns"
												:data-source="list"
												rowKey="msg_id"
												:row-selection="rowSelection"
										>

											<div slot="chat_data" slot-scope="text, {avatarData, member_num, name, ownerName}" v-if="!!is_chat">
												<div class="">
													<chatBody :chat_item="{avatarData, member_num, name, ownerName}"></chatBody>
												</div>
											</div>


											<div slot="push_time">
												推送时间
												<a-tooltip placement="bottom">
													<template slot="title">
														<span>根据后台所设置的提醒时间，需要推送给该客户的时间点，例如企业成员2月1日新添加客户，后台所设置的提醒时间为1天后8:00提醒推送，那么推送时间则为2月2日8:00。</span>
													</template>
													<a-icon type="question-circle" class='ml-5' />
												</a-tooltip>
											</div>

											<div slot="over_time">
												完成时间
												<a-tooltip placement="bottom">
													<template slot="title">
														<span>执行人对该条推送内容进行手动操作点击【完成】按钮的时间。</span>
													</template>
													<a-icon type="question-circle" class='ml-5' />
												</a-tooltip>
											</div>


											<div slot="customTitle" v-if="is_over == 0">
												<div>操作</div>
											</div>


											<div class='flex items-center' slot="tnickname" slot-scope="text, item">
												<div>
													<img v-if='item.avatar' class="w-40 h-40" :src="item.avatar" alt="">
													<img v-else class="w-40 h-40" src="../../../../assets/useradvart.png" alt="">
												</div>
												<div class="text-12 text-gray-900 pl-10 ss-break-all ss-ellipsis-1">{{item.nickname}}</div>
												<div :class="item.corp_name != null ? 'corp-name' : 'wx-name'">
													<div
															class='ss-break-all ss-ellipsis-1'
															v-if="item.corp_name != null">@{{text.corp_name}}
													</div>
													<div v-else  class='ss-break-all ss-ellipsis-1'>@微信</div>
												</div>
												<a-icon type="man"
												        style="color: #427EBA;"
												        v-if="item.gender=='男性'" />
												<a-icon
														type="woman"
														style="color: #ED4997;"
														v-if="item.gender=='女性'"
												/>
											</div>

											<div class='flex items-center' slot="tcontent" slot-scope="text, item">
												<prevRulesPop :timeData='JSON.parse(item.content)'>
													<div class="text-blue-501 cursor-pointer">预览</div>
												</prevRulesPop>
											</div>
											<div class='flex items-center' slot="action" slot-scope="text,{msg_id, is_over, can_over},index" v-if="is_over == 0">
												<div class="text-blue-501 cursor-pointer mr-10" @click='_sopMsgRemind([msg_id])'>
													提醒
												</div>
												<div class="text-blue-501 cursor-pointer" @click='sopMsgSetOver(msg_id)' v-if='can_over==1'>
													完成
												</div>
											</div>

										</a-table>
									</div>

									<div class='flex justify-between py-20'  v-if='count>0'>
										<div class="flex items-center">
											<div class='pr-10 flex items-center' v-if="is_over == 0">

												<a-checkbox v-model="allCheck" @click="allCheckChange" class="mr-10"></a-checkbox>

												<div class="pr-10">
													<a-select class='w-80' :value='is_all' @change="isAllChange">
														<a-select-option :value="0">当前页</a-select-option>
														<a-select-option :value="1">全部</a-select-option>
													</a-select>
												</div>

												<a-button type="primary" :disabled='isDisabled' @click="_sopMsgRemind(is_all?selectedRowKeys:currentSelectedRowKeys)">
													批量提醒
												</a-button>
											</div>
											<span>共<span class='text-blue-501'>{{count}}</span>条</span>
										</div>
										<a-pagination
												show-size-changer
												v-model="page"
												:total="count"
												:pageSize='page_size'
												@change="changePage"
												@showSizeChange="onShowSizeChange"
										/>
									</div>

								</div>

							</div>
						</div>
					</div>
				</a-spin>
			</div>
		</a-modal>

		<!--部门选择框-->
		<chooseDepartment
				ref="user"
				:show="showModalDepartment"
				:callback="modalVisibleChange"
				:departmentDisabled="1"
				:is_special="1"
				:is_external='1'
		></chooseDepartment>


		<div @click='visible = true'>
			<slot></slot>
		</div>
	</div>
</template>

<script>

    import moment from 'moment';
    import ChooseDepartment from '../../../../components/ChooseDepartment'
    import prevRulesPop from './prevRulesPop'
    import chatBody from '../comps/chatBody'
    import groupChat from "../../../../components/GroupChat.vue"
    import _ from 'lodash'

    export default {
        name: "overCondition",
        components: {ChooseDepartment, prevRulesPop, chatBody, groupChat},
        props: {
            sop_id: { // SOP规则id
                type: [Number, String],
                default() {
                    return 0
                }
            },
            is_chat: { // 是否是群聊 0 不是 1 是
                type: [String, Number],
                default() {
                    return 0
                }
            }
        },
        computed: {
            rowSelection() {
                return {
                    selectedRowKeys: this.selectedRowKeys,
                    onChange: this.onSelectChange,
                    columnTitle: ' ',
                    hideDefaultSelections: true,
                };
            },
            isDisabled() { //
                if (this.is_all) {
                    return this.selectedRowKeys.length == 0 ? true : false
                } else {
                    return this.currentSelectedRowKeys.length == 0 ? true : false
                }
            }
        },
        data() {
            return {
                selectedRowKeys: [],
                visible: false,
                corp_id: localStorage.getItem('corpId') || "", // 企业微信id
                columns: [
                    {
                        title: '执行人',
                        dataIndex: 'user_name',
                    },

                    {
                        title: '推送对象',
                        scopedSlots: {customRender: 'tnickname'},
                    },

                    {
                        title: '推送内容',
                        scopedSlots: {customRender: 'tcontent'},
                    },

                    {
                        // title: '推送时间',
                        dataIndex: 'push_time',
                        scopedSlots: {title: 'push_time'},
                    },


                    {
                        dataIndex: 'action',
                        key: 'action',
                        width: 120,
                        slots: {title: 'customTitle'},
                        scopedSlots: {customRender: 'action'},
                    },

                ],
                chat_data_colum: { // 群聊
                    title: '推送群聊',
                    scopedSlots: {customRender: 'chat_data'},
                    width: 200
                },
                over_time_colum: {
                    // title: '完成时间',
                    dataIndex: 'over_time',
                    scopedSlots: {title: 'over_time'},
                },
                chooseUserNum: 0,//已选择的成员个数
                chooseDepartmentNum: 0, // 已选择的部门成员总个数
                pushTime: null, // 推送时间
                is_over: 0, // 0未完成1已完成
                name: '', // 客户昵称
                user_ids: [], // 执行人集合
                stime: '', // 开始时间
                etime: '', // 结束时间
                is_all: 0, // 是否选择当前页
                all_msg: [], // 选择所有的信息(个人的sop)
                showModalDepartment: false, // 是否显示选择部门成员弹框
                userList: [], // 选中的人
                list: [], // table 列表
                page_size: 10,
                count: 0,
                page: 1,
                isLoading: true, // 是否在加载中
                chatVisible: false,
                allCheck: false, // 是否是多选
                currentSelectedRowKeys: [], // 当前页面选中的
            }
        },

        watch: {
            visible: {
                handler(v) {
                    if (v) {
                        this.is_all = 0
                        this.selectedRowKeys = []
                        this.clearSelect(1)
                    }
                },
                immediate: true
            },
            is_chat: {
                handler(v) {
                    if (v == 1) {
                        this.columns[0].title = '群主'
                        this.columns[0].dataIndex = 'ownerName'
                        this.columns[1] = this.chat_data_colum
                    }
                },
                immediate: true
            },

            is_over: {
                handler(v) {
                    if (v == 0) {
                        this.columns = _.filter(this.columns, function (o) {
                            return o.dataIndex !== 'over_time';
                        });
                    } else if (v == 1) {
                        this.columns.splice(4, 0, this.over_time_colum)
                    }
                },
                immediate: true
            },

            selectedRowKeys: {
                handler(v) {
                    this.isAllSelect() // 是否全选的
                },
            }
        },

        methods: {
            moment,
            isAllSelect() { //
                this.currentSelectedRowKeys = _.intersection(this.selectedRowKeys, _.map(this.list, 'msg_id'));
                if (this.is_all) { // 全选的
                    if (this.selectedRowKeys.length == this.all_msg.length) {
                        this.allCheck = true
                    } else {
                        this.allCheck = false
                    }
                } else {
                    if (this.currentSelectedRowKeys.length == this.list.length && this.list.length > 0) {
                        this.allCheck = true
                    } else {
                        this.allCheck = false
                    }
                }
            },

            allCheckChangeHandle() { // 点击底部的全选
                if (this.is_all) { // 全选的
                    if (this.allCheck) {
                        this.selectedRowKeys = this.all_msg
                    } else {
                        this.selectedRowKeys = _.difference(this.selectedRowKeys, _.map(this.list, 'msg_id')) // 第一个里面去掉第二个里面的
                    }
                } else {
                    if (this.allCheck) {
                        var arr1 = _.intersection(this.all_msg, _.map(this.list, 'msg_id')); // 交集
                        var arr2 = _.union(this.selectedRowKeys, arr1) // 并级并去掉重复的
                        this.selectedRowKeys = arr2
                    } else {
                        this.selectedRowKeys = _.difference(this.selectedRowKeys, _.map(this.list, 'msg_id')) // 第一个里面去掉第二个里面的
                        this.currentSelectedRowKeys = []
                    }
                }
                this.currentSelectedRowKeys = _.intersection(this.selectedRowKeys, _.map(this.list, 'msg_id'));
            },

            async _initData(page = '',) { // 初始化数据
                page && (this.page = page)
                this.isLoading = true
                return new Promise(async (resolve, reject) => {
                    var params = {
                        corp_id: this.corp_id,
                        sop_id: this.sop_id,
                        is_over: this.is_over,
                        name: this.name,
                        user_ids: this.user_ids,
                        stime: this.stime,
                        etime: this.etime,
                        page: page ? page : this.page,
                        page_size: this.page_size,
                    }

                    const {data: res} = await this.axios.post(`work-sop/sop${this.is_chat == 1 ? '-chat' : ''}-msg-list`, params);
                    this.isLoading = false
                    if (res.error == 0) {
                        this.list = res.data.list
                        this.count = res.data.count * 1
                        this.all_msg = _.map(res.data.all_msg, (o) => o + '')
                        this.isAllSelect()
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            allCheckChange(e) { // 底部的全选
                this.allCheck = e.target.checked
                this.allCheckChangeHandle()
            },

            async sopMsgSetOver(msg_id) { // 设置消息完成
                const {data: res} = await this.axios.post("work-sop/sop-msg-set-over", {
                        corp_id: this.corp_id,
                        msg_id
                    }
                );
                if (res.error == 0) {
                    this.$message.success('操作成功');
                    this._initData()
                }
            },

            _sopMsgRemind(msg_ids) { // 消息提醒
                if (msg_ids.length == 0) return this.$message.error('至少选择一项');
                return new Promise(async (resolve, reject) => {
                    var params = {
                        corp_id: this.corp_id,
                        msg_ids,
                    }
                    const {data: res} = await this.axios.post("work-sop/sop-msg-remind", params);
                    if (res.error == 0) {
                        this.$message.success('操作成功');
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            //部门选择弹窗组件
            showDepartmentList() { // 打开选择部门成员的弹框
                this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.user_ids))
                this.$refs.user.rightList = JSON.parse(JSON.stringify(this.userList))
                this.showModalDepartment = true
            },

            modalVisibleChange(event, arr, userNum, departmentNum, list) { // 选择部门成员的回调
                if (event == "ok") {
                    if (arr.length > 0) {
                        this.user_ids = JSON.parse(JSON.stringify(arr))
                        this.userList = JSON.parse(JSON.stringify(list))
                        this.chooseUserNum = userNum
                        this.chooseDepartmentNum = departmentNum
                    } else {
                        this.user_ids = []
                        this.userList = []
                        this.chooseUserNum = 0
                        this.chooseDepartmentNum = 0
                    }
                }
                this.showModalDepartment = false
            },

            clearSelect(page = '') {
                this.name = ''
                this.stime = ''
                this.etime = ''
                this.chooseUserNum = 0
                this.chooseDepartmentNum = 0
                this.pushTime = null
                this.user_ids = []
                this.userList = []
                this._initData(page)
            },

            disabledDate(current) {
                return current && current > moment().endOf('day');
            },
            onChangeAngePicker(date, dateString) { // 日期选择
                this.stime = dateString[0]
                this.etime = dateString[1]
            },

            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys;
            },

            onShowSizeChange(page, page_size) {
                this.page = page
                this.page_size = page_size
                this._initData()
            },

            changePage(page, page_size) {
                this.page = page
                this.page_size = page_size
                this._initData()
            },

            paneCallback(key) {
                this.is_over = key
                this.page = 1
                this.clearSelect()
            },
            showModal() {
                this.visible = true;
            },
            handleOk(e) {
                this.visible = false;
            },
            handleCancel(e) {
                this.visible = false;
            },
            isAllChange(e) { // 是否选中所有的
                this.is_all = e
                this.isAllSelect()
            }
        },
    }
</script>

<style scoped>
	.w-280 {width: 280px !important;}
	>>> .ant-tabs-top-content {height: 0}
	>>> .ant-tabs-top-content {padding-bottom: 0}
	>>> .ant-modal {max-width: 1200px !important;}
	/*>>> .ant-table-thead > tr > th:first-child .ant-table-header-column{display: none}*/
</style>
