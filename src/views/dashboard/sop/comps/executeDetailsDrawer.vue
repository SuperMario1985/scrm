<template>
	<div class="">
		<a-drawer
				:title="user_name + '客户明细'"
				:width='1100'
				:visible="visible"
				:keyboard = 'false'
				@close="onClose"
		>


			<template  slot="footer">
				<a-button @click="handleOk">关闭</a-button>
			</template >
			<div class='p-20'>
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
					<div class="bg-white">
						<a-tabs type="card" @change="paneCallback">
							<a-tab-pane :key="0" tab="未完成"></a-tab-pane>
							<a-tab-pane :key="1" tab="已完成"></a-tab-pane>
						</a-tabs>
						<div class='flex items-center flex-wrap'>
							<div class="flex items-center mr-10 py-10">
								<div class="pr-10">{{!is_chat?'推送对象':'推送群聊'}}:</div>
								<div>
									<a-input class='w-120' v-model='name' :placeholder="!is_chat?'请输入推送对象':'请输入推送群聊'" />
								</div>
							</div>

							<div class="flex items-center mr-10 py-10">
								<div class="pr-10">推送时间:</div>
								<div>
									<a-range-picker :disabled-date="disabledDate" :show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"  v-model="pushTime" class='w-280' @change="onChangeAngePicker"  />
								</div>
							</div>
							<div class="mr-10 py-10">
								<a-button type="primary" @click="_initData(1)">查找</a-button>
							</div>

							<div class="mr-30 py-10">
								<a-button @click="clearSelect(1)">清空</a-button>
							</div>
						</div>
						<div class="">
							<a-table
									:pagination="false"
									:columns="columns"
									:data-source="list"
									rowKey="msg_id"
							>

								<div class='flex items-center' slot="tuser" slot-scope="text, item" v-if="!is_chat">
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
										<div v-else class='ss-break-all ss-ellipsis-1'>@微信</div>
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

								<div  slot="chat_data" slot-scope="text, {avatarData, member_num, name, ownerName}" v-if="!!is_chat">
									<div  class="">
										<chatBody :chat_item="{avatarData, member_num, name, ownerName}"></chatBody>
									</div>
								</div>

								<div slot="push_time">
									推送时间
									<a-tooltip placement="bottom">
										<template slot="title">
											<span>根据后台所设置的提醒时间，需要推送给该客户的时间点，例如企业成员2月1日新添加客户，后台所设置的提醒时间为1天后8:00提醒推送，那么推送时间则为2月2日8:00。</span>
										</template>
										<a-icon type="question-circle" class='ml-5'/>
									</a-tooltip>
								</div>

								<div slot="over_time">
									完成时间
									<a-tooltip placement="bottom">
										<template slot="title">
											<span>执行人对该条推送内容进行手动操作点击【完成】按钮的时间。</span>
										</template>
										<a-icon type="question-circle"  class='ml-5'/>
									</a-tooltip>
								</div>

								<div slot="customTitle" v-if="is_over == 0">
									<div>操作</div>
								</div>

								<div class='flex items-center' slot="action" slot-scope="text,{msg_id, is_over, can_over},index" v-if="is_over == 0">
									<div class="text-blue-501 cursor-pointer mr-10" @click='_sopMsgRemind([msg_id])'>提醒</div>
									<div class="text-blue-501 cursor-pointer" @click='sopMsgSetOver(msg_id)' v-if='can_over==1'>完成</div>
								</div>

							</a-table>
						</div>
					</div>
					<div class='flex justify-between py-20 px-20'  v-if='count>0'>
						<div>
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
				</a-spin>
			</div>
		</a-drawer>
	</div>
</template>

<script>
    import moment from 'moment';
    import chatBody from './chatBody'
    export default {
        name: "executeDetailsDrawer",
        components: {chatBody},
        props: {
            sop_id: { // 规则id
                type: Number,
                default(){
                    return 0
                }
            },
            sop_time_id	: { // SOP时间规则id
                type: Number,
                default(){
                    return 0
                }
            },
            user_ids: {
                type: Array,
                default(){
                    return []
                }
            },
            user_name: { //  执行人昵称
                type: String,
	            default(){
                    return ''
	            }
            },
            is_chat: { // 是否是群聊 0 不是 1 是
                type: [String, Number],
                default() {
                    return 0
                }
            },

        },
        data() {
            return {
                visible: false,
                corp_id: localStorage.getItem('corpId') || "", // 企业微信id
                columns: [
                    {
                        title: '推送对象',
                        scopedSlots: {customRender: 'tuser'},
                    },

                    {
                        /*title: '推送时间',*/
                        dataIndex: 'push_time',
                        scopedSlots: {title: 'push_time'},
                    },


                    {
                        dataIndex: 'action',
                        key: 'action',
                        width: 80,
                        slots: {title: 'customTitle'},
                        scopedSlots: {customRender: 'action'},
                    },
                ],

                chat_data_colum: { // 群聊
                    title: '推送群聊',
                    scopedSlots: {customRender: 'chat_data'},
                    width: 200
                },

                over_time_colum:  {
                    /*title: '完成时间',*/
                    dataIndex: 'over_time',
                    scopedSlots: {title: 'over_time'},
                },

                pushTime: null, // 推送时间
                name: '',//
                stime: '', // 开始时间
                etime: '', // 结束时间
                is_over: 0, // 0未完成1已完成

                list:[], // table 列表
                page_size: 10,
                count: 0,
                page: 1,
                isLoading: true, // 是否在加载中
            };
        },
        watch:{
            is_chat: {
                handler(v){
                    if (v == 1) {
                        this.columns[0] = this.chat_data_colum
                    }
                },
                immediate: true
            },
            visible: {
                handler(v) {
                    if (v) {
                        this.clearSelect(1)
                    }
                },
                immediate: true
            },
            is_over: {
                handler(v) {
                    if (v == 0) {
                        this.columns = _.filter(this.columns, function(o) { return o.dataIndex !== 'over_time'; });
                    } else if (v == 1) {
                        this.columns.splice(2, 0, this.over_time_colum)
                    }
                },
                immediate: true
            },
        },
	    mounted() {

        },
        methods: {
            moment,
            async _initData(page = '',) { // 初始化数据
                page && (this.page = page)
                return new Promise(async (resolve, reject) => {
                    this.isLoading = true
                    var params = {
                        corp_id: this.corp_id,
                        sop_id: this.sop_id,
                        is_over: this.is_over,
                        name: this.name,
                        user_ids: this.user_ids,
                        stime: this.stime,
                        etime: this.etime,
                        sop_time_id: this.sop_time_id,
                        page: page?page:this.page,
                        page_size: this.page_size,
                    }
                    const {data: res} = await this.axios.post(`work-sop/sop${this.is_chat==1?'-chat':''}-msg-list`, params);
                    this.isLoading = false
                    if (res.error == 0) {
                        this.list = res.data.list
                        this.count = res.data.count * 1
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            async sopMsgSetOver(msg_id){ // 设置消息完成
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


            paneCallback(key) {
                this.is_over = key
                this.page = 1
                this.clearSelect()
            },

            disabledDate (current) {
                return current && current > moment().endOf('day');
            },

            onChangeAngePicker(date, dateString){ // 日期选择
                this.stime = dateString[0]
                this.etime = dateString[1]
            },


            clearSelect(page = ''){
                this.stime = ''
                this.etime = ''
                this.name = ''
                this.pushTime = null
                this._initData(page)
            },

            onShowSizeChange(page, page_size) {
                this.page = page
                this.page_size = page_size
                this._initData()
            },

            changePage (page, page_size) {
                this.page = page
                this.page_size = page_size
                this._initData()
            },

            handleOk(e) {
                this.callback('cancel')
            },

            onClose() {
                this.visible = false;
            },

        },
    }
</script>

<style scoped>
	.w-280{width: 280px!important;}
	>>> .ant-drawer-content-wrapper {width: 780px!important;}
	>>> .ant-drawer-wrapper-body{height:  calc(100vh - 64px)}

	>>> .ant-tabs-top-content{height: 0}
	>>> .ant-tabs-top-content{padding-bottom: 0}
</style>
