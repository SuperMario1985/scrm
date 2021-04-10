<template>
	<div>
		<div class="flex" v-for="(o_item, o_index) in rulesData" :key="o_index">
			<div class='ss-rules-l flex flex-col items-center mr-20 ss-rules-l-b ml-7'>
				<img src="../../../../assets/clock.png" alt="" class=''>
				<div class='h-full '></div>
			</div>
			<div class="ss-rules-box -mt-10 mb-10">
				<div class="flex justify-between items-center">
					<div class="text-15 font-bold">
						<span v-if="o_item.time_type==1">
							<span v-if="!is_chat">{{type==1? '客户添加企微客服' : '客户在【' + follow_name + '】跟进状态后'}}</span>
							<span v-else>加入内容规则后，</span>
							<span class="text-blue-501">{{o_item.time_one}}小时{{o_item.time_two}}分钟</span>后提醒推送
						</span>
						<span v-else>
							<span v-if="!is_chat">{{type==1? '客户添加企微客服' : '客户在【' + follow_name + '】跟进状态后'}}</span>
							<span v-else>加入内容规则后，</span>
							<span class="text-blue-501">{{o_item.time_one}}天后{{o_item.time_two}}</span>提醒推送
						</span>
					</div>
					<div class="flex items-center" v-if="is_edit">
						<a-button class="mr-10" type="primary" @click='openShowAddRulesPop(o_item, o_index)'>编辑</a-button>
						<a-button class="" type="danger" @click='delRules(o_index)'>删除</a-button>
					</div>
					<div class="flex items-center" v-else>
						<a-button class="mr-10"  @click='executeHandle(o_item, o_index)'>员工执行情况</a-button>
					</div>
				</div>

				<div v-if="!is_edit">
					<span>员工未完成（{{o_item.not_over_num}}）</span>
					<span>员工已完成（{{o_item.over_num}}）</span>
				</div>

				<div class='ss-rules-pay-box px-15 my-20'>
					<rulesPay :rules = 'o_item.contentData'></rulesPay>
				</div>


			</div>
		</div>
		<addRulesPop :is_chat = 'is_chat' :type='type' :follow_name='follow_name' ref='addRulesPop' :rulesAdd='rulesAdd' :index='rulesAdd_index' :callback="addRulesPopCallbackBug" v-if='isShowAddRulesPop'></addRulesPop>
	</div>
</template>

<script>

    import addRulesPop from './addRulesPop'
    import rulesPay from './rulesPay'
	import _ from 'lodash'
    export default {
        name: "rulesList",
        components: {addRulesPop, rulesPay},
        props: {
            rulesData: {
                type: Array,
                default() {
                    return []
                }
            },
	        type: {
                type: [Number, String], // 1 新客户 2 生命周期客户
                default() {
                    return 1
                }
	        },
	        is_edit: {
                type: Boolean,
                default() {
                    return true
                }
	        },
            follow_name: { // 生命周期的 名称
                type: String,
                default() {
                    return ''
                }
            },
            is_chat: { // 是否是群聊 0 不是
                type: [String, Number],
                default() {
                    return 0
                }
            }
        },

        data() {
            return {
                commonUrl: this.$store.state.commonUrl, //公共的链接
                isShowAddRulesPop: false, // 是否显示弹框
                rulesAdd: {},
                rulesAdd_index: -1
            }
        },
        methods: {
            executeHandle(e, i){ // 查看员工执行情况
                this.$emit('executeHandle', e)
            },
            addRulesPopCallbackBug(event, e, index) { // 选择规则的回调
                this.isShowAddRulesPop = false
                event == 'ok' && this.$emit('updateTimeData', e, index )

            },

            openShowAddRulesPop(o_item, o_index){
                this.rulesAdd = _.cloneDeep(o_item)
                this.rulesAdd_index = o_index
	            this.isShowAddRulesPop = true

	             this.$nextTick(()=>{
                     this.$refs.addRulesPop.visible = true
	             })

            },

            delRules(index) { // 删除
                this.$confirm({
                    title: '确定删除吗？',
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.rulesData.splice(index, 1)
                    },
                });

            },


        }
    }
</script>

<style scoped>
	.ss-rules-box {width: 720px}
	.ss-rules-l-b {width: 1px; background: url("../../../../assets/rules-l-bg.png") repeat-y}
	.ss-rules-pay-box{background: #f5f5f5;}
</style>
