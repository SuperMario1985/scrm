<template>
	<div class="content-hd">
		<a-col>
			<a-select
					v-if="corpLen > 1"
					showSearch
					optionFilterProp="children"
					style="width: 170px;margin-right: 5px;"
					@change="handleWxId"
					v-model="corpId"
			>
				<template v-for="item in corpInfo">
					<a-select-option :value="item.corpid">{{item.corp_full_name ||
						item.corp_name}}
					</a-select-option>
				</template>
			</a-select>
			<a-button @click="showChooseTag(-1)"
			          style="width: 170px;margin-right: 5px;">
				<span v-if="tags.length > 0">已选择{{tags.length}}个标签</span>
				<span v-else>选择标签</span>
			</a-button>
			<a-button type="primary" style="margin: 0px 5px;" @click="find">查询</a-button>
			<a-button @click="clear">重置</a-button>
			<a-button @click="addTagRules" class="btn-primary" style="float: right;"type="primary" v-has="'chatTag-rule-add'">
				添加标签规则
			</a-button>
		</a-col>
		<div style="margin: 15px 0;">
			共
			<span style="color: blue">{{total}}</span>
			条
		</div>
		<!-- 表格部分 -->
		<div class="content-bd">
			<a-spin tip="加载中..." size="large" :spinning="isLoading">
				<a-table :columns="columns" :dataSource="tagRuleList" :pagination="false"
				         :rowClassName="rowClassName" v-has="'chatTag-rule-list'">
					<span slot="checkedBoxTitle">
					</span>
<!--					<span slot="external_num">-->
<!--						已打客户数-->
<!--						<a-tooltip placement="bottom">-->
<!--		                    <template slot="title">-->
<!--		                        <span>只统计实际已打客户数，若打上该标签，再移除，不计入统计。</span>-->
<!--		                    </template>-->
<!--		                    <a-icon type="question-circle" style="margin-left:5px;"/>-->
<!--	                    </a-tooltip>-->
<!--					</span>-->
					<span slot="checkedBox" slot-scope="text, record, index">
						<a-checkbox style=""
						            v-model="checkBoxValue[index]"
						            @click="changeSelectKey(record.key)"></a-checkbox>
					</span>
					<span slot="tagData" slot-scope="text, record, index">
						<span v-if="record.tagData.length == 0">--</span>
		                    <a-tag v-for="item in record.tagData" color="orange"
		                           style="margin-bottom: 5px;cursor: pointer;">
			                    {{item.title}}
		                    </a-tag>
					</span>
					<span slot="keyword" slot-scope="text, record, index">
						<span v-if="record.keyword.length == 0">--</span>
						<span>聊天中提到含 </span>
	                    <a-tag v-for="item in record.keyword" color="blue"
	                           style="cursor: pointer;">
		                    {{item}}
	                    </a-tag>
						<span>关键词将自动打上标签</span>
					</span>
					<template slot="userInfo" slot-scope="text, record, index">
						{{record.user_num}}个
					</template>
					<span slot="action" slot-scope="text, record, index">
						<a-button @click="edit(index)"
						          style="margin: 0 5px 5px 0" v-has="'chatTag-rule-edit'">编辑</a-button>
						<a-button @click="changeStatus(record.id, 0)"
						          style="margin: 0 5px 5px 0" v-has="'chatTag-rule-delete'">删除</a-button>
					</span>
				</a-table>

				<!-- 分页 -->
				<div class="pagination" style="margin: 20px 15px;overflow: hidden;"
				     v-show="total > 0" v-has="'chatTag-rule-list'">
					<div style="float: left;">
						<a-checkbox v-model="batchTypeValue"
						            @click="batchTypeChange"></a-checkbox>
						<a-select optionFilterProp="children"
						          v-model="batchType"
						          @change="changeBatchType"
						          style="width: 150px; margin: 0 5px;">
							<a-select-option value="0">选择当前页</a-select-option>
							<a-select-option value="1">选择所有</a-select-option>
						</a-select>
						<a-button class="btn-primary" icon="delete"
						          @click="deleteUser"
						          :disabled="selectedRowKeys.length == 0" type="primary" v-has="'chatTag-rule-delete'">
							批量删除
						</a-button>
<!--						<a-button class="btn-primary" icon="unlock"-->
<!--						          :disabled="selectedRowKeys.length == 0"-->
<!--						          @click="releaseFollow" type="primary">-->
<!--							批量开启-->
<!--						</a-button>-->
<!--						<a-button class="btn-primary" icon="lock"-->
<!--						          :disabled="selectedRowKeys.length == 0"-->
<!--						          @click="failure" type="primary">-->
<!--							批量关闭-->
<!--						</a-button>-->
					</div>
					<div class="pagination" style="height: 32px;float: right;">
						<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
						              :current="page"
						              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
						              @change="changePage"
						              @showSizeChange="showSizeChange"/>
					</div>
				</div>
			</a-spin>
		</div>
		<!--    选择标签弹窗-->
		<a-modal v-model="chooseTagVisible" title="选择标签" @cancel="cancleChooseTag" :zIndex="99"
		         width="700px !important">
			<template slot="footer">
				<a-button @click="cancleChooseTag">关闭</a-button>
				<a-button @click="handleChoose">确定</a-button>
			</template>
			<corpChooseTag ref="chooseTag" :isNotAdd="isNotAdd" :id="corpId" v-if="chooseTagVisible" :disabledTag="disabledTag" :isDisabled="1"
			               :callback="modalVisibleChange"
			               :hasChoose="wordIds">
			</corpChooseTag>
		</a-modal>

		<!--	添加标签规则	-->
		<a-modal v-model="ruleVisible" title="添加标签规则" @cancel="cancleRule" :zIndex="88"
		         width="700px !important">
			<template slot="footer">
				<a-button @click="cancleRule">关闭</a-button>
				<a-button type="primary" :disabled="createRule" @click="handleSubmit">确定</a-button>
			</template>
			<a-form>
				<div v-for="(tag, index) in tagRules" style="margin-bottom: 10px;border-bottom: 1px solid #F5F5F5;">
					<a-form-item label="聊天打标签" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
						<a-button @click="showChooseTag(index)"
						          style="width: 170px;margin-right: 5px;">
							<span v-if="tag.tags.length > 0">已选择{{tag.tags.length}}个标签</span>
							<span v-else>选择标签</span>
						</a-button>
					</a-form-item>
					<a-form-item label="触发打标签规则" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
						<span style="display: inline-block;vertical-align: text-top;line-height: 20px;">聊天中包含以下关键词则自动打上标签。同时添加多个关键词，请用“空格隔开”</span>
						<a-input placeholder="请输入关键词" v-model="tag.words"></a-input>
					</a-form-item>
					<div style="text-align: center;margin: 10px;">
						<a-button style="margin-right: 10px;" v-if="tagRules.length > 1" type="danger"
						          @click="deleteTagRule(index)">删除
						</a-button>
						<a-button v-if="index == tagRules.length - 1" type="primary" @click="addTagRule">添加</a-button>
					</div>
				</div>
			</a-form>
		</a-modal>

		<!--    编辑规则    -->
		<a-modal v-model="editRuleVisible" title="编辑标签规则" @cancel="cancleEdit" :zIndex="88"
		         width="700px !important">
			<template slot="footer">
				<a-button @click="cancleEdit">关闭</a-button>
				<a-button type="primary" :disabled="editRule" @click="handleEdit">确定</a-button>
			</template>
			<a-form>
				<a-form-item label="聊天打标签" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
					<a-button @click="showChooseTag(-2)"
					          style="width: 170px;margin-right: 5px;">
						<span v-if="editTags.length > 0">已选择{{editTags.length}}个标签</span>
						<span v-else>选择标签</span>
					</a-button>
				</a-form-item>
				<a-form-item label="触发打标签规则" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
					<span style="display: inline-block;vertical-align: text-top;line-height: 20px;">聊天中包含以下关键词则自动打上标签。同时添加多个关键词，请用“空格隔开”</span>
					<a-input placeholder="请输入关键词" v-model="editWords"></a-input>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
	import linkAgent from '@/components/addAgent/index.vue'
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"

	// 活动列表
	const columns = [
		{
			dataIndex  : "checkedBox",
			key        : "checkedBox",
			width      : "60px",
			scopedSlots: {customRender: "checkedBox", title: "checkedBoxTitle"}
		},
		{
			title      : "标签规则",
			dataIndex  : "keyword",
			key        : "keyword",
			scopedSlots: {customRender: "keyword"}
		},
		{
			title      : "聊天打标签",
			dataIndex  : "tagData",
			key        : "tagData",
			scopedSlots: {customRender: "tagData"}
		},
		{
			title      : "生效员工",
			dataIndex  : "userInfo",
			key        : "userInfo",
			scopedSlots: {customRender: "userInfo"}
		},
		// {
		// 	// title    : "已打客户数",
		// 	dataIndex: "external_num",
		// 	key      : "external_num",
		// 	scopedSlots: {title: "external_num"}
		// },
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '16%',
			scopedSlots: {customRender: "action"}
		}
	];
	export default {
		name      : "TagRule",
		props: {
			id: {
				type: String,
				default: ''
			}
		},
		components: {linkAgent, corpChooseTag},
		data () {
			return {
				tagIdData           : [], // 已选择过的标签
				editRule          : false, //编辑规则确认按钮disabled
				editRuleId          : '', // 编辑规则id
				editRuleVisible     : false, // 编辑规则弹窗
				editWords           : '', // 编辑关键词
				editTags            : [], // 编辑标签
				ruleVisible         : false, // 添加规则弹窗
				createRule          : false, // 添加规则确认按钮disabled
				tagRules            : [], // 添加规则的规则数据
				wordIds             : [], // 选择标签弹窗标签数数组
				disabledTag         : [], // 禁选的标签
				checkBoxValue       : [],        // 标签规则选择框
				batchType           : '0',       //0当前页 1所有
				batchTypeValue      : false,     //当前页/所有 是否选中
				selectedRowKeys     : [],        //选中的规则key
				suite_id            : 1,         //应用ID
				corpId              : '',    //企业微信选中的id
				corpInfo            : [],        // 企业微信列表
				tags                : [],        // 筛选的标签
				tagRuleList         : [],        // 表格数组
				isLoading           : true,      //Loading 组件显示与隐藏
				corpLen             : JSON.parse(localStorage.getItem('corpArr')).length,
				//表格部分
				columns,
				//分页
				total               : 0, //总条数
				quickJumper         : false, // 是否显示快速跳转的控件
				page                : 1, //页码
				pageSize            : 15, //每页数据条数
				chooseTagVisible    : false, // 选择标签弹窗是否显示
				isNotAdd            : 0, // 是否禁止新建标签
				tagListIndex        : -1, // 天机、编辑、筛选 选择标签的标识
			}
		},
		mounted () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.isLoading = true
				this.selectedRowKeys = []
				this.corpId = this.id
				this.getTagRuleList()
			});
		},
		methods   : {
			// 关闭选择标签弹窗
			cancleChooseTag () {
				this.chooseTagVisible = false
			},
			// 选择标签按钮
			showChooseTag (index) {
				if (index == -1) {
					this.isNotAdd = 1
					this.disabledTag = []
					this.tagListIndex = -1
					this.chooseTagVisible = true
					this.wordIds = JSON.parse(JSON.stringify(this.tags))
				} else if (index == -2) {
					this.isNotAdd = 0
					this.tagListIndex = -2
					this.chooseTagVisible = true
					this.wordIds = JSON.parse(JSON.stringify(this.editTags))
				} else {
					this.isNotAdd = 0
					this.disabledTag = []
					for (let i = 0; i < this.tagRules.length; i++) {
						if (i != index) {
							this.disabledTag = this.disabledTag.concat(this.tagRules[i].tags)
						}
					}
					this.disabledTag = this.disabledTag.concat(this.tagIdData)
					this.tagListIndex = index
					this.wordIds = JSON.parse(JSON.stringify(this.tagRules[index].tags))
				}
				this.chooseTagVisible = true
			},
			// 选择标签提交
			handleChoose () {
				if (this.tagListIndex == -1) {
					this.tags = JSON.parse(JSON.stringify(this.wordIds))
				} else if(this.tagListIndex == -2) {
					this.editTags = JSON.parse(JSON.stringify(this.wordIds))
				} else {
					this.tagRules[this.tagListIndex].tags = JSON.parse(JSON.stringify(this.wordIds))
				}

				this.chooseTagVisible = false

			},
			// 选择标签回滚
			modalVisibleChange (event, ids) {
				if (event == 'ok') {
					if(ids == '') {
						this.wordIds = []
					} else {
						this.wordIds = ids.split(',')
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
						this.addKey(this.tagRuleList)
						this.setCheckedBox(this.tagRuleList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = JSON.parse(JSON.stringify(this.tagRuleKeys))
						this.setBox()
					}
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						// 当前
						this.removeKey(this.tagRuleList)
						this.setCheckedBox(this.tagRuleList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
						this.setBox()
					}
					this.batchTypeValue = false
				}
			},
			setBox () {
				this.setCheckedBox(this.tagRuleList)
			},
			// 设置列表卡片多选框选中状态
			setCheckedBox (tagRuleList) {
				this.checkBoxValue = new Array(tagRuleList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < tagRuleList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (tagRuleList[i].key == this.selectedRowKeys[j]) {
							this.checkBoxValue[i] = true
						}
					}
				}
				if (this.batchType == 0) {
					this.batchTypeValue = true
					for (let i = 0; i < this.checkBoxValue.length; i++) {
						if (!this.checkBoxValue[i]) {
							this.batchTypeValue = false
						}
					}
				} else {
					if (this.selectedRowKeys.length == this.tagRuleKeys.length && this.tagRuleKeys.length != 0) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}
				if (tagRuleList.length == 0) {
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
			addKey (tagRuleList) {
				for (let i = 0; i < tagRuleList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === tagRuleList[i].key)
					if (index == -1) {
						this.selectedRowKeys.push(tagRuleList[i].key)
					}
				}
			},
			// 删除当前页key
			removeKey (tagRuleList) {
				for (let i = 0; i < tagRuleList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === tagRuleList[i].key);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			handleWxId (value) {
				this.corpId = value
				this.tags = []
				this.$emit('changeCorpId', this.corpId)
				// this.$store.dispatch('changeCorp', this.corpInfo.find(c => c.corpid == value))
			},
			rowClassName (record, index) {
				let className = 'dark-row';
				if (index % 2 === 0) {
					className = 'light-row';
				}
				return className;
			},
			// 点击搜索
			find () {
				this.isLoading = true
				this.getTagRuleList()
			},

			// 添加标签规则
			addTagRules () {
				this.tagRules = [
					{
						words: '',
						tags : []
					}
				]
				this.ruleVisible = true
			},
			// 添加弹窗标签规则
			addTagRule () {
				this.tagRules.push({words: '', tags: []})
			},
			// 删除添加弹窗某个规则
			deleteTagRule (index) {
				this.tagRules.splice(index, 1)
			},
			// 添加标签规则提交
			async handleSubmit () {
				this.createRule = true
				for(let tagRule of this.tagRules) {
					if(tagRule.tags.length == 0) {
						this.$message.warning('请检查标签')
						this.createRule = false
						return false
					}
					if(tagRule.words == '') {
						this.$message.warning('请检查关键词')
						this.createRule = false
						return false
					}
				}
				const {data: res} = await this.axios.post("work-tag-keyword-rule/add", {
					corp_id  : this.corpId,
					tag_rules: this.tagRules
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.createRule = false
					this.$message.error(res.error_msg);
				} else {
					this.ruleVisible = false
					this.createRule = false
					this.clear()
				}
			},
			// 取消添加标签规则
			cancleRule () {
				this.ruleVisible = false
				this.tagRules = []
			},

			// 点击清空
			clear () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.isLoading = true
				this.tags = []
				this.page = 1
				this.pageSize = 15
				this.getTagRuleList()
			},
			// 获取表格内容
			async getTagRuleList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-tag-keyword-rule/list", {
					corp_id : this.corpId,
					tag_ids : this.tags,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.tagIdData = res.data.tagIdData
					this.tagRuleList = res.data.ruleData;
					this.tagRuleKeys = res.data.keys
					this.setCheckedBox(this.tagRuleList)
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 编辑
			edit (index) {
				this.editRuleId = this.tagRuleList[index].id
				this.disabledTag = JSON.parse(JSON.stringify(this.tagIdData))
				this.editWords = ''
				for (let i = 0; i < this.tagRuleList[index].keyword.length; i++) {
					this.editWords += this.tagRuleList[index].keyword[i]
					if (i != this.tagRuleList[index].keyword.length - 1) {
						this.editWords += ' '
					}
				}
				this.editTags = []
				for (let i = 0; i < this.tagRuleList[index].tagData.length; i++) {
					this.editTags.push(this.tagRuleList[index].tagData[i].id)
					this.disabledTag.splice(this.disabledTag.findIndex(x => x == this.tagRuleList[index].tagData[i].id), 1)
				}
				this.editRuleVisible = true
			},
			// 编辑提交
			async handleEdit () {
				this.editRule = true
				if(this.editTags.length == 0) {
					this.$message.warning('请检查标签')
					this.editRule = false
					return false
				}
				if(this.editWords == '') {
					this.$message.warning('请检查关键词')
					this.editRule = false
					return false
				}
				const {data: res} = await this.axios.post("work-tag-keyword-rule/update", {
					id   : this.editRuleId,
					tags : this.editTags,
					words: this.editWords
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.editRuleVisible = false
					this.editRule = false
					this.getTagRuleList(this.page, this.pageSize)
				}
			},
			// 编辑规则取消
			cancleEdit () {
				this.editWords = ''
				this.editTags = []
				this.disabledTag = []
				this.editRuleId = ''
				this.editRuleVisible = false
			},
			// 批量删除
			deleteUser () {
				let that = this;
				that.$confirm({
					title     : "确定删除选中的标签规则?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeRuleStatus(that.selectedRowKeys, 0)
					}
				});
			},
			// 关闭
			changeStatus (id, status) {
				let that = this;
				let title = ''
				if (status == 2) {
					title = '开启'
				} else if (status == 1) {
					title = '关闭'
				} else {
					title = '删除'
				}
				that.$confirm({
					title     : "确定" + title + "该标签规则？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						let ids = []
						ids.push(id)
						that.changeRuleStatus(ids, status)
					}
				});
			},
			// 改变状态
			async changeRuleStatus (ids, status) {
				const {data: res} = await this.axios.post("work-tag-keyword-rule/change-status", {
					corp_id: this.corpId,
					ids    : ids,
					status : status
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.getTagRuleList(this.page, this.pageSize)
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getTagRuleList(page, pageSize);
				this.$emit('changeScroll')
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getTagRuleList(1, pageSize);
			}
		},
	}
</script>

<style scoped>
	.btn-primary {
		margin-left: 20px;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 0 5px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}
</style>