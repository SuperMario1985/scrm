<template>
	<a-modal
			title="添加任务标签"
			:width='1100'
			:visible="true"
			:cancelText = "isGet? '删除': '取消'"
			:class="{'isGetPopClass': isGet}"
			@ok="handleOk"
			@cancel="handleCancel"
	>
		<a-spin tip="Loading..." size="large" :spinning="isLoading">
			<div class="p-1rem">
				<a-row type="flex" class='items-center' v-if='!isGet'>
					<a-col :span="5">
						<div class="text-right text-gray-900"><span class="text-red-501">*</span>任务标签名称：</div>
					</a-col>
					<a-col :span="10">
						<a-input class='w-200' v-model='name' placeholder="请输入任务标签名称" />
					</a-col>
				</a-row>

				<a-row type="flex" class='py-10 relative b-line' v-else>
					<a-col :span="5">
						<div class="text-right text-gray-900 py-8"><span class="text-red-501">*</span>任务标签：</div>
					</a-col>
					<a-col :span="18">
						<div class="clearfix" v-if="tags.length>0">
							<div
								v-for="(item, index) in tags"
								class="float-left text-gray-501 bg-gray-201 br1000 px-20 py-5 mr-10 my-5 my-5 ss-tag-item cursor-pointer"
								:class="{'active': chooseItem&&chooseItem.tag_id == item.tag_id}"
								:key="index"
								@click="chooseTag(item)"
							>
								<span>{{item.tagname}}</span>
							</div>
						</div>
						<div v-else class="py-8">暂无标签</div>
					</a-col>
				</a-row>
			</div>

			<selectCondition :condition = 'condition' :callback="getLabelInfo"></selectCondition>
		</a-spin>
	</a-modal>
</template>

<script>
    import selectCondition from '../../../../components/selectCondition'
    export default {
        name: "conditionPop",
	    components: {selectCondition},
	    props: {
            isGet: { // 是否获取标签
                type: Boolean,
	            default(){
                    return false
	            }
            },
            task_id: { // 上级初始化的标签id
                type: Number,
                default(){
                    return 0
                }
            },
            callback : {
                type   : Function,
                default: null
            },
	    },
	    data(){
            return {
                corp_id: localStorage.getItem('corpId') ||  "", // 企业微信id
                name: '', // 添加标签需要的参数
                condition: {}, // 标签数据的集合
                tags: [], // 所有的标签的列表
                chooseItem: {}, // 选中的某个标签
                isLoading: true,
            }
	    },
	    watch: {
            isGet: {
                handler(v){
                    v && this.taskTags().then(()=>{
                        this.isLoading = false
                        for (var item of this.tags) {
                            if (item.id == this.task_id) {
                                this.chooseItem = item
	                            this.condition = item.condition
                            }
                        }
                    })
	                !v && (this.isLoading = false)
                },
	            immediate: true
            },
	    },
	    methods: {
            handleCancel(e) {

                if (/ant-btn/.test(e.target.className) && this.isGet) { // 点击了自由容器
					this.taskTagDelHandle()
                    return
                }

				this.callback('cancel')
            },
            handleOk() {
                if (!this.isGet) {
                    if (this.$test.empty(this.name)) {
                        return  this.$message.warn('标签名称不能为空');
                    }
                }

                if (this.isGet) {
                    if (this.$test.empty(this.chooseItem)) {
                        return  this.$message.warn('请选择一个标签');
                    }
                }

                if (this.$test.empty(this.condition)) {
                    return  this.$message.warn('目标客户筛选条件不能为空');
                }

				this.taskTagAdd().then((res)=>{
					this.callback('ok', this.isGet?this.chooseItem: null)
				}) // 添加标签
            },
            getLabelInfo(e, condition) {
                if (e == 'ok') {
                    this.condition = condition
                    console.log(condition , '标签选择的集合')
                }
            },

            taskTagDelHandle () {
                if (this.$test.empty(this.chooseItem)) {
                    return  this.$message.warn('请选择一个标签');
                }
                this.$confirm({
                    title: '确定删除吗？',
                    onOk:() => {
                        this.taskTagDel()
                    }
                });


            },

            taskTagDel () {
                return new Promise(async (resolve, reject) => {
                    var params = {
                        corp_id: this.corp_id,
                        task_tag_id: this.chooseItem.task_tag_id,
                    }
                    const {data: res} = await this.axios.post("work-task/task-tag-del", params);
                    if (res.error == 0) {
                        this.taskTags()
	                    this.$emit('delTagHandle', this.chooseItem.task_tag_id)
                        this.chooseItem = {}
                        this.condition = {}
                        this.$message.success('删除成功');
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            taskTags(){
                return new Promise(async (resolve, reject) => {
                    var params = {
                        corp_id: this.corp_id,
                        task_id: null,
                        type: 0, // 0 都显示 1 仅任务标签数据， 2仅最近使用
                    }

                    const {data: res} = await this.axios.post("work-task/task-tags", params);
                    if (res.error == 0) {
                        this.tags = res.data.taskTags
	                    resolve()
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            taskTagAdd(){ // 添加标签
                return new Promise(async (resolve, reject) => {
                    var params = {
                        corp_id: this.corp_id,
	                    name: this.name,
                        condition: this.condition,
                    }

                    if (this.isGet) {
                        params = {...params,  task_tag_id: this.chooseItem.task_tag_id, name: this.chooseItem.tagname}
                    }
                    const {data: res} = await this.axios.post("work-task/task-tag-add", params);
                    if (res.error == 0) {
                        resolve()
                    } else {
                        this.$message.error(res.error_msg);
                    }
                })
            },

            chooseTag(item){
                this.chooseItem = item;
                this.condition = item.condition
            }
	    },
    }
</script>

<style scoped>
	.p-1rem{padding:0 1rem}
	.ss-tag-item.active{background: #1890ff; color: #fff}
</style>
