<template>
	<div class="label_box">
		<a-form-model ref="ruleForm" layout="horizontal" :model="labelForm">
			<div class="title">
				<span>目标客户筛选条件</span>
				<span>（符合条件约<span style="color: red">{{total}}</span>人）</span>
			</div>
			<a-divider></a-divider>
			<a-form-model-item label="区域" :label-col="{span: 5}"
			                   :wrapper-col="{span: 10} ">
				<a-cascader
						:allowClear="true"
						:options="cityData"
						@change="passData"
						v-model="labelForm.location"
						placeholder="请选择区域"
						style="width: 195px;text-align: left;"
				/>
			</a-form-model-item>
			<a-form-model-item label="性别" :label-col="{span: 5}"
			                   :wrapper-col="{span: 10} ">
				<a-radio-group v-model="labelForm.sex"
				               @change="passData"
				               :options="[{label: '全部', value: -1},{label: '男', value: 1},
										{label: '女', value: 2},{label: '未知', value: 3}]"
				               :default-value="0"/>
			</a-form-model-item>
			<div v-for="(item,index) in selectList">

				<!--				单选/多选-->
				<a-form-model-item :label="item.label" :label-col="{span: 5}"
				                   v-if="(item.type==2||item.type==3)&&item.label!='性别'"
				                   :wrapper-col="{span: 10} ">
					<a-select
							showSearch
							allowClear
							@change="passData"
							:placeholder="'请选择'+item.label"
							optionFilterProp="children"
							v-model="labelForm[item.id]"
							:mode="item.type==3?'multiple':'default'"
					>
						<template v-for="(item2,index2) in item.option">
							<a-select-option :value="item2">
								{{item2}}
							</a-select-option>
						</template>
					</a-select>
				</a-form-model-item>
			</div>

			<a-form-model-item label="绑定店铺" :label-col="{span: 5}"
			                   :wrapper-col="{span: 10} ">
				<a-select @change="passData"
				          showSearch
				          allowClear
				          placeholder="请选择绑定店铺"
				          optionFilterProp="children"
				          v-model="labelForm.signId"
				>
					<template v-for="(item,index) in bindStoreList">
						<a-select-option :value="item.key">
							{{item.username}}
						</a-select-option>
					</template>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="跟进状态" :label-col="{span: 5}"
			                   :wrapper-col="{span: 10} ">
				<a-select @change="passData"
				          showSearch
				          allowClear
				          placeholder="请选择跟进状态"
				          optionFilterProp="children"
				          v-model="labelForm.follow_status"
				>
					<template v-for="(item,index) in follows">
						<a-select-option :value="item.id">
							{{item.title}}
						</a-select-option>
					</template>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="是否选择公众号粉丝" :label-col="{span: 5}"
			                   :wrapper-col="{span: 10} ">
				<a-radio-group v-model="labelForm.isPublic"
				               @change="passData"
				               :options="[{label: '是', value: 1},
										{label: '否', value: 0}]"
				               :default-value="1"/>
			</a-form-model-item>
			<a-form-model-item label="标签"
			                   :label-col="{ span: 4 }"
			                   :wrapper-col="{ span: 20 }">
				<corpChooseTag :callback="labelCallBack"
				               :show_task="0"
				               :hasChoose="tag_arr"
				               v-if="isShowTag"></corpChooseTag>
			</a-form-model-item>
		</a-form-model>
	</div>

</template>

<script>
    import cityData from "../common/js/citydata";
    import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"

    const defaultQuery = {
        sex     : -1,
        isPublic: 0
    }
    export default {
        name      : "selectCondition",
        components: {corpChooseTag},
        props     : {
            user_ids : {
                type   : Array,
                default: () => [],
            },
            condition: {
                type   : Object,
                default: () => {},
            },
            callback : {
                type   : Function,
                default: null
            }
        },
        watch     : {
            condition: {
                handler (newVal) {
                    this.tag_arr = []
                    if (this.condition) {
                        this.labelForm = this.condition
                        this.tag_arr = this.condition.tag_arr
                    }
                    this.getStaffNum()
                },
                deep: true
            },
        },

        data () {
            return {
                labelForm      : Object.assign({}, defaultQuery),
                cityData, //区域选择框
                tag_arr        : [], // 选中标签数组
                isShowTag      : true,
                selectList     : [],
                follows        : [],//跟进状态
                bindStoreList  : [],//绑定店铺列表
                total          : 0,
                corp_id        : localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
                isMasterAccount: localStorage.getItem('isMasterAccount') ? localStorage.getItem('isMasterAccount') : "",
                uid            : localStorage.getItem('uid') ? localStorage.getItem('uid') : "",
                sub_id         : localStorage.getItem('sub_id') ? localStorage.getItem('sub_id') : "",

            }
        },
        beforeMount () {
            this.getSelectInfo()
            this.getFollowStatus()
            this.handleChangeSign()
        },
        mounted () {
            this.initLabel()
            this.getStaffNum()

        },
        methods: {
            initLabel () {
                if (this.condition) {
                    this.labelForm = this.condition
                    this.tag_arr = this.condition.tag_arr
                }
            },

            async getSelectInfo () {
                const {data: res} = await this.axios.post('custom-field/filter-condition', {
                    uid : localStorage.getItem('uid') ? localStorage.getItem('uid') : "",
                    type: 0
                })
                if (res.error != 0) {
                    this.$message.error(res.error_msg);
                } else {
                    this.selectList = res.data.field
                }
            },
            //获取绑定店铺列表
            async handleChangeSign (value) {
                const {data: res} = await this.axios.post("third-store/get-merchants", {
                    storeType: [],
                    status   : '1',
                    storeName: value,
                    uid      : localStorage.getItem('uid'),
                    isAll    : 1
                });
                if (res.error != 0) {
                    this.$message.error(res.error_msg);
                } else {
                    this.bindStoreList = res.data.info;
                }
            },
            //获取跟进状态列表
            async getFollowStatus () {
                const {data: res} = await this.axios.post("custom-field/follow", {
                    uid: localStorage.getItem("uid")
                });
                if (res.error != 0) {
                    this.$message.error(res.error_msg);
                } else {
                    this.follows = res.data.follow
                }
            },
            // 获取符合条件人数
            async getStaffNum () {
                let data = JSON.parse(JSON.stringify(this.labelForm))
                data.user_ids = this.user_ids
                data.corp_id = this.corp_id
                data.suite_id = 1
                data.isMasterAccount = this.isMasterAccount
                data.uid = this.uid
                data.sub_id = this.sub_id
                const {data: res} = await this.axios.post("work-task/task-tag-members", data);
                if (res.error != 0) {
                    this.$message.error(res.error_msg);
                } else {
                    this.total = res.data.count
                }
            },
            //标签
            labelCallBack (event, arr) {
                if (event == "ok") {
                    this.tag_arr = arr.split(',')
                    if (arr.split(',')[0] == '') this.tag_arr = []
                    this.labelForm.tag_arr = this.tag_arr
                    this.callback("ok", this.labelForm);
                }
            },

            passData () {
                // this.getStaffNum()
                this.callback("ok", this.labelForm);
            },
        }
    }
</script>

<style scoped>
	.label_box {
		width: 100%;
		padding: 1rem;
	}

	.title {
		font-size: 15px;
		font-weight: 600;
	}

	.ant-divider-horizontal {
		margin: 0.64rem 0;
	}
</style>
