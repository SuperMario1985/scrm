<template>
	<div class="">
		<a-drawer
				title="员工执行情况"
				placement="right"
				:visible="visible"w o
				:keyboard = 'false'
				@close="onClose"
		>
			 <div class=' '>
				 <a-spin tip="Loading..." size="large" :spinning="isLoading">
					 <div class="p-20 bg-white">

						 <div class='flex items-center flex-wrap'>
							 <div class="flex items-center mr-10 py-10">
								 <div class="pr-10">执行人:</div>
								 <div>
									 <a-button @click="showDepartmentList" class='w-200'>
										 <span v-if="chooseUserNum +  chooseDepartmentNum> 0">已选择{{chooseUserNum}}名成员</span>
										 <span v-else>{{is_chat==0? '选择部门成员' : '选择群主' }}</span>
									 </a-button>
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
								:columns="columns"
								:data-source="list"
								rowKey="user_id"
								:pagination="false"
							 >

								 <div class='flex items-center' slot="over_status" slot-scope="text, {not_over_num, over_num}">
									 <div class="text-blue-501">{{not_over_num}}/{{over_num}}</div>
								 </div>
								 <div class='flex items-center' slot="action" slot-scope="text, {user_id, user_name}">
									 <div class="text-blue-501 cursor-pointer" @click="lookExecuteDetailsDrawer(user_id, user_name)">客户明细</div>
								 </div>

							 </a-table>
						 </div>
					 </div>

					 <div class='flex justify-between py-20 px-20' v-if='count>0'>
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


					 <!--部门选择框-->
					 <chooseDepartment
							 ref="user"
							 :show="showModalDepartment"
							 :callback="modalVisibleChange"
							 :departmentDisabled="1"
							 :is_special="1"
							 :is_external = '1'
					 ></chooseDepartment>
				</a-spin>

			 </div>


		</a-drawer>
		<executeDetailsDrawer ref='executeDetailsDrawer'  :is_chat = "is_chat" :sop_id = 'sop_id' :user_ids = 'look_user_ids' :user_name='look_user_name'  :sop_time_id = 'sop_time_id'></executeDetailsDrawer>



	</div>
</template>

<script>
    import ChooseDepartment from '../../../../components/ChooseDepartment'
    import executeDetailsDrawer from './executeDetailsDrawer'


    export default {
        name: "detailDrawer",
	    components: {ChooseDepartment, executeDetailsDrawer},
	    props: {
            sop_id: { // 规则id
                type: Number,
                default(){
                    return 0
                }
            },
            sop_time_id: {
                type: Number,
	            default(){
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
                detailData: {}, // 详情数据

                user_ids: [], // 执行人
                userList: [], // 选中的人
                user_name: '', // 执行人昵称
                showModalDepartment: false, // 是否显示选择部门成员弹框

                columns: [
                    {
                        title: '执行人',
                        dataIndex: 'user_name',
                    },

                    {
                        title: '完成情况(未完成/已完成)',
                        scopedSlots: {customRender: 'over_status'},
                    },

                    {
                        title: '操作',
                        scopedSlots: {customRender: 'action'},
                    },


                ],


                look_user_ids: [], // 看具体哪个客户的
                look_user_name: '', //
                chooseUserNum : 0,//已选择的成员个数
                chooseDepartmentNum: 0, // 已选择的部门成员总个数
                list:[], // table 列表
                page_size: 10,
                count: 0,
                page: 1,
                isLoading: true, // 是否在加载中
            };
        },
	    watch:{
            visible: {
                handler(v) {
                    if (v) {
                        this.clearSelect(1)
                    }
                },
	            immediate: true
            }
	    },
        methods: {
            async _initData(page = '',) { // 初始化数据
                page && (this.page = page)
                return new Promise(async (resolve, reject) => {
                    this.isLoading = true
                    var params = {
                        corp_id: this.corp_id,
                        sop_time_id: this.sop_time_id,
                        user_ids: this.user_ids,
                        page: page?page:this.page,
                        page_size: this.page_size,
                    }

                    const {data: res} = await this.axios.post("work-sop/sop-time-user-list", params);
                    this.isLoading = false
                    if (res.error == 0) {
                        this.list = res.data.list
                        this.count = res.data.count * 1
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            lookExecuteDetailsDrawer(e, n) {
	            this.look_user_ids = [e]
	            this.look_user_name = n
	            this.$refs.executeDetailsDrawer.visible = true
            },

            //部门选择弹窗组件
            showDepartmentList () { // 打开选择部门成员的弹框
                this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.user_ids))
                this.$refs.user.rightList = JSON.parse(JSON.stringify(this.userList))
                this.showModalDepartment = true
            },


            modalVisibleChange (event, arr, userNum, departmentNum, list) { // 选择部门成员的回调
                if (event == "ok") {
                    if (arr.length > 0) {
                        this.user_ids = JSON.parse(JSON.stringify(arr))
                        this.userList =  JSON.parse(JSON.stringify(list))
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

            clearSelect(page = ''){
                this.user_ids = []
                this.userList = []
                this.chooseUserNum = 0
                this.chooseDepartmentNum = 0
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

            onClose() {
                this.visible = false;
            },
        },
    }
</script>

<style scoped>
	>>> .ant-drawer-content-wrapper {width: 800px!important;}
	>>> .ant-drawer-wrapper-body{height:  calc(100vh - 64px)}
</style>
