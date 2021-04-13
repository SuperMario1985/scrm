<template>
	<a-spin tip="Loading..." size="large" :spinning="isLoading" class='h-full ss-sop-list-content'>
		<div class='flex flex-col h-full'>
			<div class='bg-white px-16 py-15 sticky  b-line  ss-content-top top-0 flex items-center'>
				<div class='text-16 text-gray-900'>{{is_chat?"客户群SOP":"客户SOP"}}</div>
				<!-- <div class='text-14 text-gray-501 pl-10'><a target='_blank' :href="is_chat==1?'https://support.qq.com/products/104790/faqs/89642':'https://support.qq.com/products/104790/faqs/89640'">帮助文档</a></div> -->
			</div>

			<div class="flex h-full ">
				<div class="flex-none w-240 bg-white r-line z-2 ss-content-left" v-if="!is_chat">

					<div class='flex text-gray-501 items-center p-20'>
						SOP场景
						<a-tooltip placement="bottom">
							<template slot="title">
								<span>对于符合条件的客户（如新添加客户，或者停留在某特定生命周期阶段的客户），SOP则会自动触发提醒员工在什么时间点对哪些客户发送哪些内容，完成新客户的培育和客户转化，提高每个私域用户的生命价值。</span>
							</template>
							<a-icon type="question-circle" class='ml-5' />
						</a-tooltip>
					</div>

					<div class="">
						<div class="text-center py-15 ss-type-tabs cursor-pointer text-gray-900" :class="{active: type ==item.value }" @click="chooseType(item.value)" v-for="(item, index) in types" :key="index">{{item.text}}</div>
					</div>
				</div>



				<div class='pb-60 ss-content' ref='DOM' :style="{'left':is_chat==1?'0px':'240px'}">
					<div class='m-20'>
						<div class='bg-white p-20 mb-20 flex items-center flex-wrap ss-box-border'>
							<div class="flex items-center mr-30 py-10">
								<div class="pr-10">规则名称:</div>
								<div>
									<a-input class='w-200' placeholder="请输入规则名称" v-model='title' />
								</div>
							</div>

							<div class="flex items-center mr-30 py-10">
								<div class="pr-10">创建人:</div>
								<div>
									<a-button @click="showDepartmentList(0, 0)" class='w-200'>
										<span v-if="chooseUserNum0 +  chooseDepartmentNum0> 0">已选择{{chooseUserNum0}}名成员{{chooseDepartmentNum0}}个部门</span>
										<span v-else>选择部门成员</span>
									</a-button>
								</div>
							</div>

							<div class="flex items-center mr-30 py-10">
								<div class="pr-10">{{is_chat==0? '选择执行人' : '选择群主' }}:</div>
								<div>
									<a-button @click="showDepartmentList(1, 1)" class='w-200'>
										<span v-if="chooseUserNum1 +  chooseDepartmentNum1> 0">已选择{{chooseUserNum1}}名成员{{chooseDepartmentNum1}}个部门</span>
										<span v-else>{{is_chat==0? '选择部门成员' : '选择群主' }}</span>
									</a-button>
								</div>
							</div>

							<div class="flex items-center mr-30 py-10" v-if='this.type == 2 && this.is_chat == 0'>
								<div class="pr-10">跟进状态:</div>
								<div>
									<a-select
											class='w-200'
											showSearch
											allowClearf
											placeholder="请选择跟进状态"
											optionFilterProp="children"
											v-model='follow_id'
									>
										<template v-for="(item,index) in follows">
											<a-select-option :value="item.id">
												{{item.title}}
											</a-select-option>
										</template>
									</a-select>
								</div>
							</div>

							<div class="flex items-center mr-30 py-10">
								<div class="pr-10">SOP状态:</div>
								<div>
									<a-select class='w-200' :value="status" @change="(e) => {status = e}">
										<a-select-option :value="item.value" v-for="(item, index) in sopStatus" :key="index">
											{{item.text}}
										</a-select-option>
									</a-select>
								</div>
							</div>

							<div class="flex items-center mr-30 py-10">
								<div class="pr-10">创建时间:</div>
								<div>
									<a-range-picker :disabled-date="disabledDate" :show-time="{ defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')], format:'HH:mm'  }"  v-model="createTime" class='w-200' @change="onChangeAngePicker"  />
								</div>
							</div>

							<div class="mr-10 py-10">
								<a-button type="primary" @click='_initData(1)'>查找</a-button>
							</div>

							<div class="mr-10 py-10">
								<a-button @click='clearSelect'>清空</a-button>
							</div>


						</div>

						<div class='flex justify-end mb-20' >
							<div>
								<a-button icon="reload" @click="syncFollowUser">同步配置了外部联系权限的联系人</a-button>
							</div>
							<a-button type="primary" @click='toCustomSopAddRules()' class='ml-10' v-has="is_chat==1? 'chatSopList-addRules':'customSopList-addRules'">
								<div>
									<a-icon type="plus" :style="{color: '#fff'}" />
									<span>创建SOP规则</span>
								</div>
							</a-button>
						</div>

						<div>
							<div  v-has="is_chat==1? 'chatSopList-list':'customSopList-list'" >
								<div class="bg-white ss-box-border">
									<a-table rowKey="sop_id" :columns="columns" :data-source="list" :pagination="false" >

										<div  slot="titles" slot-scope="text, {title}">
											<span>{{title.slice(0, 10)}}<br>{{title.slice(10, title.length)}}</span>
										</div>
										<div class="flex flex-wrap"  slot="user_names" slot-scope="text, {user_name}" v-if="!is_chat">
											<div  class="py-5"  v-for="(item, index) in  user_name" :key="index" v-if='user_name.length<=4'>
												<div v-if="item.scopedSlots.title == 'title'">
													<a-tag color="blue" >{{item.title}}</a-tag>
												</div>
												<div v-if="item.scopedSlots.title == 'custom'">
													<a-tag color="orange" >{{item.title}}</a-tag>
												</div>
											</div>

											<a-popover trigger="hover" v-if='user_name.length>4'>
												<template slot='content'>
													<div class="flex flex-wrap ss-usernames">
														<div  class="py-5"  v-for="(item, index) in  user_name" :key="index">
															<div v-if="item.scopedSlots.title == 'title'">
																<a-tag color="blue" >{{item.title}}</a-tag>
															</div>
															<div v-if="item.scopedSlots.title == 'custom'">
																<a-tag color="orange" >{{item.title}}</a-tag>
															</div>
														</div>
													</div>
												</template>
												<template >
													<div class="flex flex-wrap">
														<div  class="py-5"  v-for="(item, index) in  user_name.slice(0, 4)" :key="index" >
															<div v-if="item.scopedSlots.title == 'title'">
																<a-tag color="blue" >{{item.title}}</a-tag>
															</div>
															<div v-if="item.scopedSlots.title == 'custom'">
																<a-tag color="orange" >{{item.title}}</a-tag>
															</div>
														</div>
													</div>

													<span>等共计{{  user_name |  user_name_len()[0] }}个成员及{{  user_name | user_name_len()[1] }}部门</span>
												</template>
											</a-popover>
										</div>

										<div  slot="chat_data" slot-scope="text, {chat_data}" v-if="!!is_chat">
											<div  class="mr-10 py-5" v-for="(item, index) in chat_data" :key="index" v-if='chat_data.length<=2'>
												<div class="flex">
													<chatBody :chat_item="item"></chatBody>
												</div>
											</div>

											<a-popover trigger="hover" v-if='chat_data.length>2'>
												 <template slot='content'>
													 <div  class="mr-10 py-5" v-for="(item, index) in chat_data" :key="index">
														 <div class="flex">
															 <chatBody :chat_item="item"></chatBody>
														 </div>
													 </div>
												 </template>
												 <template >
													 <div  class="mr-10 py-5" v-for="(item, index) in chat_data.slice(0, 2)" :key="index">
														 <div class="flex">
															 <chatBody :chat_item="item"></chatBody>
														 </div>
													 </div>
													 <span>等共计{{chat_data.length}}个群聊</span>
												 </template>
											</a-popover>

										</div>
										<div  slot="status" slot-scope="text, {status, sop_id, can_edit}">
											<a-switch :disabled= 'can_edit == 0' :checked ='status == 1' @change='onChangeStatus($event, sop_id)' v-if='can_edit == 1 && is_show_status' />
											<div v-else>
												<span v-if='status == 1' class='text-14 text-gray-900'>已开启</span>
												<span v-else class='text-14 text-gray-900'>已关闭</span>
											</div>
										</div>

										<div slot="create_times" slot-scope="text, {create_time}">
											<span>{{create_time.split(' ')[0]}}<br>{{create_time.split(' ')[1]}}</span>
										</div>

										<div class='flex items-center' slot="action" slot-scope="text, {sop_id, can_edit}">
											<overConditionPop :is_chat='is_chat' :sop_id = 'sop_id * 1' v-has="is_chat==1? 'chatSopList-process':'customSopList-process'">
												<a-button class='mx-2'>完成情况</a-button>
											</overConditionPop>
											<detailDrawer :is_chat='is_chat' :sop_id="sop_id * 1"  v-has="is_chat==1? 'chatSopList-detail':'customSopList-detail'">
												<a-button class='mx-2'>查看详情</a-button>
											</detailDrawer>
											<a-button  class='mx-2' @click='toCustomSopAddRules(sop_id)' v-if='can_edit!=0'  v-has="is_chat==1? 'chatSopList-edit':'customSopList-edit'">编辑</a-button>
											<a-button  class='mx-2' @click="delHandle(sop_id)" v-if='can_edit!=0' v-has="is_chat==1? 'chatSopList-delete':'customSopList-delete'">删除</a-button>
										</div>
									</a-table>
								</div>
								<div class='flex justify-between py-20' v-if='count>0'>
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
							</div>


						</div>

					</div>

				</div>
			</div>

			<!--部门选择框-->
			<chooseDepartment
					ref="user"
					:show="showModalDepartment"
					:callback="modalVisibleChange"
					:is_special="is_special"
					:is_external = 'is_external'
			></chooseDepartment>
		</div>

	</a-spin>
</template>

<script>
    import ChooseDepartment from '../../../components/ChooseDepartment'
    import overConditionPop from './comps/overConditionPop'
    import detailDrawer from './comps/detailDrawer'
    import chatBody from './comps/chatBody'
    import moment from 'moment';
    import _ from 'lodash'

    export default {
        name: "sopList",
        components: {
            overConditionPop,
            detailDrawer,
            ChooseDepartment,
            chatBody,
            VNodes: {
                functional: true,
                render: (h, ctx) => ctx.props.vnodes,
            },
        },
	    props: {
            is_chat: { // 是否是群聊
                type:  [Number, String],
	            default (){
                    return 0
	            }
            },
            type: { // SOP类型：1新客培育、2客户生命周期
                type: [Number, String],
                default (){
                    return ''
                }
            }
	    },
        data() {
            return {
                types: [
	                {text: '新客培育', value: 1},
	                {text: '客户生命周期', value: 2},
                ],
                columns: [
                    {
                        title: '规则名称',
                        scopedSlots: {customRender: 'titles'},
                        width: 250
                    },
                    {
                        title: '创建人',
                        dataIndex: 'creat_name',
                        width: 100
                    },
                    {
                        title: '执行人',
                        dataIndex: 'user_names',
                        scopedSlots: {customRender: 'user_names'},
                        width: 300
                    },
                    {
                        title: 'SOP状态',
	                    type: 'status',
                        scopedSlots: {customRender: 'status'},
                        width: 120
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'create_times',
                        scopedSlots: {customRender: 'create_times'},
                        width: 150
                    },
                    {
                        title: '操作',
                        scopedSlots: {customRender: 'action'},
                        width: 100
                    },
                ],
	            chat_data_colum: { // 群聊
                    title: '群聊',
                    scopedSlots: {customRender: 'chat_data'},
                    width: 300
                },

                follow_name: { // 生命周期跟进状态
                    title: '跟进状态',
                    dataIndex: 'follow_name',
                    width: 200
                },

                list:[], // table 列表
                showModalDepartment: false, // 是否显示选择部门成员弹框
                corp_id: localStorage.getItem('corpId') || "", // 企业微信id
                sub_id: [], // 子账户ID, // 创建人id:-1全部0总经理 (可选)
                user_ids: [], // 执行人id(可选)
                title: '', // 规则名称(可选)
                status: -1, // 状态:-1全部1开启0关闭(可选)
                stime: '', // 开始时间（可选）
                etime: '', // 结束时间（可选）
                page: 1, // 页码 (可选)
                page_size: 10, // 页数 (可选)
                count: 0, // 页码总数
                chooseUserNum0 : 0,//已选择的成员个数
                chooseUserNum1 : 0,//已选择的成员个数
                chooseDepartmentNum0: 0, // 已选择的部门成员总个数
                chooseDepartmentNum1: 0, // 已选择的部门成员总个数
                sopStatus: [{value: -1, text: '全部'}, {value: 1, text: '开启'},{value: 0, text: '关闭'},],
                createTime: null, // 创建时间
                isLoading: true, // 是否在加载中
                userList0: [], // 选中的人
                userList1: [], // 选中的人
                user_page: 1, // 用户当前页
                subUserList: [], // 创建人
                is_loading_user: true, // 是否显示更多列表
                user_is_more: true, // 是否有更多
                chooseDepartmentType: 0, // 选择的类型
                is_external: 0, // 是否是外部联系人
                is_special: 0, //数据可见范围限制，0不限制，1限制
                follow_id: '', // 跟进状态
                follows: [], // 跟进列表
                is_show_status: true, // 是否显示开关
            }
        },
	    created() {
            this.$nextTick(()=>{
                this.getData()
            })
        },
	    filters: {
            user_name_len(v) {
                return [
                   _.reject(v, (o) => {
                       return o.scopedSlots.title == 'title'
                   }).length,
                    _.reject(v, (o) => {
                        return o.scopedSlots.title == 'custom'
                    }).length
                ]
            },
	    },

        methods: {
            moment,

	        getData () {
                if (this.is_chat == 1) {
                    this.columns[2] = this.chat_data_colum
                }
                if (this.type == 2) {
                    this.getFollowStatus() //
                    this.columns.splice(3, 0 , this.follow_name)
                } else if (this.type == 1)  {
                    _.remove(this.columns, (n)=>{
                        return n.dataIndex == 'follow_name'
                    })
                }
                let permissionButton = localStorage.getItem('permissionButton').split(",") // 权限的操作
                if(permissionButton.indexOf('all')==-1) {
                    if ((this.is_chat == 0 && permissionButton.indexOf('customSopList-status')==-1) || (this.is_chat == 1 && permissionButton.indexOf('chatSopList-status')==-1)) {
                        this.is_show_status = false
                    }
                }

                this.clearSelect()
	        },

            disabledDate (current) {
                return current && current > moment().endOf('day');
            },

            async getFollowStatus() { // 获取跟进状态
                const {data: res} = await this.axios.post("custom-field/follow", {
                        uid: localStorage.getItem("uid"),
                        status: 1
                    }
                );
                if (res.error != 0) {
                    this.$message.error(res.error_msg);
                } else {
                    this.follows = [{title: '全部', id: ''},...res.data.follow]
                }
            },

            async syncFollowUser () {
                this.isLoading = true
                this.$message.info("已进入后台刷新中，请耐心等待...");
                const {data: res} = await this.axios.post('work-follow-user/refresh-follow-user', {
                    suite_id: 1,
                    corp_id : this.corp_id,
                })

                if (res.error != 0) {
                    this.$message.destroy()
                    this.$message.error(res.error_msg)
                    this.isLoading = false
                } else {
                    this.$message.destroy()
                    this.$message.success("同步完成！");
                    this.isLoading = true
                    this._initData(1)
                }
            },


            async _initData(page = '', is_scroll = true) { // 初始化数据
                page == 1 && (this.page = page)
                this.isLoading = true
	            if (this.is_chat == 0 && this.type == '') return
                return new Promise(async (resolve, reject) => {
                    var params = {
                        corp_id: this.corp_id,
                        type: this.type,
	                    title: this.title,
                        sub_id: this.sub_id,
                        user_ids: this.user_ids,
                        status: this.status,
                        stime: this.stime,
                        etime: this.etime,
                        page: page?page:this.page,
                        page_size: this.page_size,
                        is_chat: this.is_chat
                    }

                    if(this.type == 2 && this.is_chat == 0) {
                        params = {
                            ...params,
                            follow_id: this.follow_id
                        }
                    }

                    const {data: res} = await this.axios.post("work-sop/sop-list", params);
                    this.isLoading = false
                    if (res.error == 0) {
						this.list = res.data.list
	                    this.count = res.data.count * 1
                        is_scroll&&this.toTop()
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            _sopStatusSet (sop_id, status) { // 规则状态变更
                return new Promise(async (resolve, reject) => {
                    var params = {
                        corp_id: this.corp_id,
                        sop_id,
                        status, // 0关闭1开启2删除
                    }
                    const {data: res} = await this.axios.post("work-sop/sop-status-set", params);
                    if (res.error == 0) {
                        this._initData(this.page, false)
                        if (status == 2) {
                            this.$message.success('删除成功')
                        }
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },



            onChangeStatus(e, sop_id){ // 修改状态
                var status = e ? 1 : 0
                this._sopStatusSet(sop_id,status)
            },

            delHandle(sop_id) { // 删除某一项
                this.$confirm({
                    title: '确定删除吗？',
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                       this._sopStatusSet(sop_id, 2)
                    },
                });
            },

            changePage (page, page_size) {
                this.page = page
	            this.page_size = page_size
                this._initData()
            },

            toCustomSopAddRules(sop_id){ // 去创建sop规则
                var url = ''
	            if (!!this.is_chat) {
                    url = '/chatSop/addRules'
                } else {
                    url = '/sop/addRules'
	            }
                var url = !sop_id ? `${url}?type=${this.type}` : `${url}?sop_id=${sop_id}&type=${this.type}`
                this.$router.push(url)
            },


            onChangeAngePicker(date, dateString){ // 日期选择
                this.stime = dateString[0]
                this.etime = dateString[1]
            },

	        clearSelect(){ // 清空选项
                this.title = ''
                this.status = -1
                this.stime = ''
                this.etime = ''
                this.chooseUserNum0 = 0
                this.chooseUserNum1 = 0
                this.chooseDepartmentNum0 = 0
                this.chooseDepartmentNum1 = 0
                this.createTime = null
		        this.follow_id = ''
                this.sub_id = []
                this.user_ids = []
                this.userList0 = []
                this.userList1 = []
		        this._initData(1)
	        },

            //部门选择弹窗组件
            showDepartmentList (type, is_special) { // 打开选择部门成员的弹框
                this.chooseDepartmentType = type
                this.is_external = type
                this.is_special = is_special
	            if (this.chooseDepartmentType == 0) {
                    this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.sub_id))
                    this.$refs.user.rightList = JSON.parse(JSON.stringify(this.userList0))

	            } else {
                    this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.user_ids))
                    this.$refs.user.rightList = JSON.parse(JSON.stringify(this.userList1))
	            }

                this.showModalDepartment = true
            },

            modalVisibleChange (event, arr, userNum, departmentNum, list) { // 选择部门成员的回调
                if (event == "ok") {
                    if (arr.length > 0) {
                        if (this.chooseDepartmentType == 0) {
                            this.sub_id = JSON.parse(JSON.stringify(arr))
                        } else {
                            this.user_ids = JSON.parse(JSON.stringify(arr))
                        }
	                    this['userList' + this.chooseDepartmentType] =  JSON.parse(JSON.stringify(list))
                        this['chooseUserNum'+this.chooseDepartmentType] = userNum
                        this['chooseDepartmentNum'+this.chooseDepartmentType]  = departmentNum
                    } else {
                        if (this.chooseDepartmentType == 0) {
                            this.sub_id =  []
                        } else {
                            this.user_ids = []
                        }
                        this.user_ids = []
                        this['userList' + this.chooseDepartmentType] = []
                        this['chooseUserNum'+this.chooseDepartmentType] = 0
                        this['chooseDepartmentNum'+this.chooseDepartmentType]  = 0
                    }
                }
                this.showModalDepartment = false
            },

            onShowSizeChange(page, page_size) {
                this.page = page
                this.page_size = page_size
                this._initData()
            },

	        toTop(){ // 当前页面滚动到最顶部
                this.$nextTick(() => {
                    try {
                        this.$refs.DOM.scrollTo(100,0);
                    } catch (e) {

                    }
                })
	        },
            chooseType(type) { // 修改类型
                this.$emit('update:type', type)
	            this.$nextTick(()=>{
                    this.getData()
	            })

            },
            /*onClickStatus(can_edit){
                console.log(can_edit)
                if (!can_edit) {
                    this.$message.warning('非创建人本人不可变更sop状态');
                }
            },*/

        }
    }
</script>

<style scoped>
	.ss-content-top{z-index: 100}
	.ss-content{top: 52px;  position: absolute; overflow: auto; bottom: 0}
	.ss-type-tabs{}
	.ss-type-tabs.active{color: #fff; background: #1890ff}
	.ss-usernames{max-width: 800px;}
	>>> .ant-spin-container{height: 100%}
</style>

<style>
</style>
