<template>
	<div>
		<a-drawer
				title="查看详情"
				placement="right"
				:visible="visible"
				:keyboard = 'false'
				@close="onClose"
		>
			<div>
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
					<div class="m-20 px-30 py-10 bg-white mb-20" >
						<div class="text-16 font-bold pb-10">基本信息</div>
						<div>
							<div class="flex items-center py-10 text-gray-900">
								<div class="w-120 text-right ">创建人：</div>
								<div class="">{{detailData.creat_name}}</div>
							</div>

							<div v-if="!detailData.is_chat">
								<div class="flex py-10 text-gray-900 items-center">
									<div class="w-120 text-right flex-none"> 执行人：</div>
									<div class="flex flex-wrap">
										<div  class="py-5"  v-for="(item, index) in  detailData.user_names" :key="index">
											<div v-if="item.scopedSlots.title == 'title'">
												<a-tag color="blue" >{{item.title}}</a-tag>
											</div>
											<div v-if="item.scopedSlots.title == 'custom'">
												<a-tag color="orange" >{{item.title}}</a-tag>
											</div>
										</div>
									</div>
								</div>

								<!--//////////////////////////////-->
								<!--<div class="flex items-center py-15 text-gray-900" v-if="detailData.type == 1">
									<div class="w-120 text-right ">目标客户：</div>
									<div class="" v-if="detailData.is_all == 1">全部客户</div>
									<div class="" v-else><span class="text-red-501 font-bold">{{member_num}}</span>客户</div>
								</div>-->

								<div class="flex items-center py-15 text-gray-900" v-if="detailData.type == 2">
									<div class="w-120 text-right ">跟进状态：</div>
									<div class="" >{{detailData.follow_name}}</div>
								</div>
							</div>


							<div class="flex py-15 text-gray-900 items-center" v-else>
								<div class="w-120 text-right flex-none"> 已选群聊：</div>
								<div class="flex flex-wrap">
									<div  class="mr-10 py-5" v-for="(item, index) in  detailData.chat_data" :key="index">
										<div class="flex">
											<chatBody :chat_item="item"></chatBody>
										</div>
									</div>
								</div>
							</div>

							<!--<div class="flex items-center py-15 text-gray-900">
								<div class="w-120 text-right ">不推送时间段：</div>
								<div class="" v-if='detailData.no_send_type == 1'>{{detailData.no_send_stime}}至
									{{detailData.no_send_etime}}期间不推送
								</div>
								<div v-else>无限制</div>
							</div>-->

						</div>

						<div class="text-16 font-bold pb-30 pt-30">推送内容</div>

						<div>
							<rulesList :is_chat="detailData.is_chat" :follow_name='detailData.follow_name' :type='detailData.type' @executeHandle='executeHandle' :rulesData="detailData.timeData" :is_edit='false'></rulesList>
						</div>
					</div>
				</a-spin>
			</div>
		</a-drawer>

		<executeDrawer :is_chat="detailData.is_chat" :sop_id='sop_id' :sop_time_id='sop_time_id' ref='executeDrawer'></executeDrawer>

		<div @click="visible = true">
			<slot></slot>
		</div>
	</div>
</template>

<script>
    import rulesList from '../comps/rulesList'
    import executeDrawer from '../comps/executeDrawer'
    import chatBody from '../comps/chatBody'

    export default {
        name: "detailDrawer",
        components: {rulesList, executeDrawer, chatBody},
        props: {
            sop_id: {
                type: Number,
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
        data() {
            return {
                visible: false,
                corp_id: localStorage.getItem('corpId') || "", // 企业微信id
                sop_time_id: 0, // 要查看员工执行情况的id
                detailData: {}, // 详情数据
                isLoading: true,
                member_num: 0, // 符合要求的客户
            };
        },
        watch: {
            visible: {
                handler(v) {
                    if (v) {
                        this._sopDetail().then((res)=>{
                            if (res.type == 2 && res.is_all == 0) {
                                this._taskTagMemberNum(res.task_id)
                            }
                        })
                    }
                },
                immediate: true
            }
        },
        methods: {
            async _taskTagMemberNum(task_id) { // 标签客户数
                return new Promise(async (resolve, reject) => {
                    var params = {
                        corp_id: this.corp_id,
                        task_id
                    }
                    const {data: res} = await this.axios.post("work-sop/task-tag-member-num", params);
                    if (res.error == 0) {
                        this.member_num = res.data.member_num
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            async _sopDetail() { // 初始化数据
                return new Promise(async (resolve, reject) => {
                    this.isLoading = true
                    var params = {
                        corp_id: this.corp_id,
                        sop_id: this.sop_id,
                    }

                    const {data: res} = await this.axios.post("work-sop/sop-detail", params);
                    this.isLoading = false
                    if (res.error == 0) {
                        this.detailData = res.data.sopInfo
                        resolve(this.detailData)
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            executeHandle(e) { // 查看员工执行情况
                this.sop_time_id = e.sop_time_id * 1
                this.$refs.executeDrawer.visible = true
            },

            onClose() {
                this.visible = false;
            },
        },
    }
</script>

<style scoped>
	>>> .ant-drawer-content-wrapper {width: 820px !important;}
	>>> .ant-drawer-wrapper-body {height: calc(100vh - 64px)}
</style>
