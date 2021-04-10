<template>
	<div>
		<a-modal
				title="添加内容规则"
				:width='1100'
				:visible="true"
				@ok="handleOk"
				@cancel="handleCancel"
		>
			<div class=" relative clearfix">
				<div class='sticky top-0 z-3 w-375 float-left '>
					<img src="../../../../assets/wxHeader.png" class="w-full block" />
					<div class="ss-prev-box px-20">
						<rulesPay :rules='rulesAddClone.contentData' :is-add='1'></rulesPay>
					</div>
				</div>

				<div class="" style="width: 640px; margin-left: 400px">
					<div class="text-14 font-bold text-gray-900 relative b-line py-10">设置提醒时间</div>
					<div class="py-20">
						<a-radio-group class='ss-sz-time' name="radioGroup" :value ='rulesAddClone.time_type' @change='radioChange'>


							<a-radio :value="1" v-if='is_chat == 1' >
								<div class="flex items-center py-5">
									<span v-if="!is_chat">
										<span class="text-14 text-gray-900" v-if="type==1">客户添加企微客服后</span>
										<span class="text-14 text-gray-900" v-else>当客户在 <span class="text-blue-501">【{{follow_name}}】</span>跟进状态后</span>
									</span>
									<span v-else>
										<span class="text-14 text-gray-900">加入内容规则后，</span>
									</span>

									<a-input-number class="w-80 mx-10" :min="0" :max="23" :disabled = 'rulesAddClone.time_type==2' :value="rulesAddClone.time_type==1?rulesAddClone.time_one:1" @change="onChangeValue($event, 'time_one')" />
									<span class="text-14 text-gray-900">小时</span>
									<a-input-number class="w-80 mx-10" :min="0" :max="59" :disabled = 'rulesAddClone.time_type==2' :value='rulesAddClone.time_type==1?rulesAddClone.time_two:0' @change="onChangeValue($event, 'time_two')" />
									<span class="text-14 text-gray-900">分钟后提醒推送</span>
								</div>
							</a-radio>

							<a-radio :value="2" :class="{'ss-radio-btn' : is_chat == 0}">
								<div class="flex items-center py-5">
									<span v-if="!is_chat">
										<span class="text-14 text-gray-900" v-if="type==1">客户添加企微客服后</span>
										<span class="text-14 text-gray-900" v-else>当客户在 <span class="text-blue-501">【{{follow_name}}】</span>跟进状态后</span>
									</span>
									<span v-else>
										<span class="text-14 text-gray-900">加入内容规则后，</span>
									</span>

									<a-input-number class="w-80 mx-10" :min="1" :disabled = 'rulesAddClone.time_type==1' :value='rulesAddClone.time_type==2?rulesAddClone.time_one : 1' @change="onChangeValue($event, 'time_one')" />
									<span class="text-14 text-gray-900">天后，当日</span>
									<a-time-picker :inputReadOnly='true' class="mx-10" @change="onChangeTimePicker" :disabled = 'rulesAddClone.time_type==1' :default-value="moment(rulesAddClone.time_type==2?rulesAddClone.time_two:'00:00', 'HH:mm')" format="HH:mm" />
									<span class="text-14 text-gray-900">提醒推送</span>
								</div>
							</a-radio>
						</a-radio-group>
					</div>

					<div class="text-14 font-bold text-gray-900 relative b-line py-10">推送内容</div>
					<div>

						<!--暂时去掉-->
						<!--<div class="ss-sop-pop-tip px-20 py-15 br10 text-yellow-900 mt-10">
							<div v-if="!is_chat">
								<span v-if="type == 1">当客户添加企微客服后，系统将在侧边栏任意应用页面中提醒发送该规则内容</span>
								<span v-else>当更改客户的跟踪状态后，系统将在侧边栏任意应用页面中提醒发送该规则内容</span>
							</div>
							<div v-else>
								<span>当客户群加入该规则后，系统将在侧边栏任意应用页面中提醒群主发送该规则内容</span>
							</div>
						</div>-->

						<div class="flex mb-10" v-for="(item, index) in rulesAddClone.contentData" :key='index'>
							<div class="py-15 w-60">消息{{index +1 }}：</div>
							<div class="w-full">
								<div class="pt-5">
									<publishContent :is-one-img='1' :is-sop='1' title='' :detailData="item" :callback="contentReply" :index='index'>
										<a-button size='small' class="" type="danger" @click="delMsg(index)" v-if='rulesAddClone.contentData.length!==1'>
											删除
										</a-button>
									</publishContent>
								</div>
							</div>
						</div>

						<div class='py-20 ml-60'>
							<a-button type="primary" @click="addMsg">添加消息</a-button>
						</div>

					</div>
				</div>
			</div>
		</a-modal>




	</div>
</template>

<script>
    import publishContent from '../../../../components/publishContent'
    import rulesPay from './rulesPay'
    import _ from 'lodash'
    import moment from 'moment';

    export default {
        name: "addRulesPop",
        components: {
            publishContent, rulesPay
        },
        props: {
            rulesAdd: { // 列表数据
                type: Object,
                default() {
                    return {
                        time_type: 1,
                        time_one: '1',
                        time_two: '0',
                        contentData: [{
                        }]
                    }
                }
            },
            callback: { // 返回的数据回调
                type: Function,
                default: null
            },
            index: { // 修改的是第几个元素（如果没有传就是添加）
                type: Number,
                default: -1
            },
            type: {
                type: [Number, String],
	            default() {
                    return 1
                }
            },
            follow_name: {
                type: [Number, String],
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


	    computed: {
            contentData () {
                return this.rulesAddClone.contentData
            }
	    },

        data() {
            return {
                rulesAddClone: {},
                isShowAddRulesPopf: true
            }
        },
	    watch:{
            index: {
                handler(v){
                    this.rulesAddClone = this.rulesAdd
                },
	            immediate: true
            }
	    },
        methods: {
            radioChange(e){
                var v = e.target.value
                this.rulesAddClone.time_type = v
                this.rulesAddClone.time_one = '1'
                if (v==1){
                    this.rulesAddClone.time_two = '0'
                } else {
                    this.rulesAddClone.time_two = '00:00'
                }
            },
            moment,


            onChangeTimePicker(e1, e2,) { // 时间选择
                this.rulesAddClone.time_two = e2
            },

            onChangeValue(e, t) { // 其他值得回调
                e = e + ''
                // 小数 0.1
                var regex = /^(\d*)\.\d*$/
                switch (t) {
					case 'time_one':
					    e = e.replace(regex, "$1")
					    break
				    case 'time_two':
				        if (this.rulesAddClone.time_type == 1) {
                            e = e.replace(regex, "$1")
				        }
				        break
                }
                let rulesAddClone = this.rulesAddClone
                rulesAddClone[t] = e
	            this.rulesAddClone = rulesAddClone
            },

            addMsg() { // 添加
                this.rulesAddClone.contentData.push({})
            },

            delMsg(index) { // 删除
                this.$confirm({
                    title: '确定删除吗？',
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        var contentData =  _.cloneDeep(this.rulesAddClone.contentData)
                        contentData.splice(index, 1)
	                    this.rulesAddClone.contentData = [] // 太坑了
	                    this.$nextTick(()=>{
                            this.rulesAddClone.contentData = contentData
	                    })
                    },
                });

            },


            async handleOk() {
                let contentData = _.cloneDeep(this.rulesAddClone.contentData)
                for (let i=0; i<contentData.length; i++ ) {
                    var data = contentData[i]

                    if (this.$test.empty(data)) {
                        contentData.splice(i, 1)
                    }

                    switch (data.file_type * 1) {
                        case 1: // 图片
                            if (this.$test.empty(data.uploadImg) && this.$test.empty(data.context) ) {
                                contentData.splice(i, 1)
                            }
                            break;
                        case 3: // 视频
                            if (data.add_type == 0) { // 自己上传
                                if (this.$test.empty(data.uploadVideo) && this.$test.empty(data.context) ) {
                                    contentData.splice(i, 1)
                                }
                            } else { // 素材库
                                if (this.$test.empty(data.materialVideo) && this.$test.empty(data.context) ) {
                                    contentData.splice(i, 1)
                                }
                            }
                            break;
                        case 4: // 图文
                            if (data.add_type == 0) { // 自己上传
                                console.log(data.uploadText, '@@@')
                                if (this.$test.empty(data.uploadText) && this.$test.empty(data.context) ) {
                                    contentData.splice(i, 1)
                                }
                            } else { // 素材库
                                if (this.$test.empty(data.materialText) && this.$test.empty(data.context) ) {
                                    contentData.splice(i, 1)
                                }
                            }
                            break;
                        default:

                    }
                }

                if (this.rulesAddClone.time_type == 2 &&  this.rulesAddClone.time_two == '') {
                    this.rulesAddClone.time_two = '00:00'
                }

                if ( this.rulesAddClone.time_type == 1 && (this.rulesAddClone.time_one + this.rulesAddClone.time_two == 0)) {
                    return  this.$message.warning('最小时间为0小时1分钟')
                } else if (this.rulesAddClone.time_type == 2 && (this.rulesAddClone.time_one == 0 )) {
                    return  this.$message.warning('至少1天后')
                } else if (this.$test.empty(contentData)) {
                    return  this.$message.warning('消息内容未填写')
                } else {
                    this.rulesAddClone.contentData = contentData
	                this.isShowAddRulesPopf = false
                    this.callback('ok', this.rulesAddClone, this.index)
                }
            },

            // 选择素材的回调
            contentReply(e, data, index) { //
                console.log(e, data, index, '22')
                var contentData = this.rulesAddClone.contentData
                contentData[index] = data
                this.rulesAddClone.contentData = _.cloneDeep(contentData)
	            if (!this.isShowAddRulesPopf) {
                    this.callback('ok', this.rulesAddClone, this.index)
	            }
            },

            handleCancel(e) {
                this.callback('cancel', this.rulesAddClone, this.index)
            },
        },
    }
</script>

<style scoped>
	.w-375{width: 375px}
	.ss-prev-box{background: #f7f7f7; height: 550px; overflow: auto}
	.ss-sz-time >>> .ant-radio-wrapper {display: flex;align-items: center}
	>>> .ant-modal {max-width: 1100px!important;}
	.ss-sop-pop-tip{background: #fff2db}

	.ss-radio-btn >>> .ant-radio{display: none!important;}
	.ss-radio-btn >>> span.ant-radio + *{padding: 0!important;}
</style>
