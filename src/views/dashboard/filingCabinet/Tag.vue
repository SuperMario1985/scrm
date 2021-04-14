<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<div style="padding: 0 20px;height: 50px; line-height: 50px; font-size: 16px; background-color: #FFFFFF;">
				内容标签
			</div>
			<div style="padding: 20px 0 0 20px;height: calc(100% - 50px);">
				<a-layout style="position: relative; height: calc(100% - 20px);">
					<!-- 左侧 -->
					<a-layout-sider>
						<!-- 公众号 -->
						<tagTeam v-has="'filingCabinetTag-group-list'" ref="group" @changeGroupId="modalVisibleChange"></tagTeam>
					</a-layout-sider>
					<a-layout
							style="position: absolute;left:250px;top:0;bottom:0;right:0;overflow-x: hidden; overflow-y: auto;"
							class="scroll">
						<!-- 内容 -->
						<a-layout-content>
							<div class="content-hd">
								<a-input style="width: 240px;" placeholder="请输入标签名称进行查找"
								         v-model="searchName"/>
								<a-button style="margin-left: 10px" type="primary" @click="findTags">
									查找
								</a-button>
								<a-button style="margin-left: 10px" @click="clearFind">
									清空
								</a-button>
								<div class="content-hd-right">
									<a-button v-has="'filingCabinetTag-add'" icon="plus" type="primary" @click="addTags">
										新建标签
									</a-button>
								</div>
							</div>
							<div style="margin-bottom: 10px;">
								共有
								<span style="color: blue">{{total}}</span>
								个
							</div>
							<!-- 表格部分 -->
							<div class="content-bd">
								<a-spin tip="Loading..." size="large" :spinning="isLoading">
									<div class="spin-content">
										<a-table :columns="columns" :dataSource="tagList" :pagination="false"
										         :rowClassName="rowClassName" v-has="'filingCabinetTag-list'">
											<span slot="select" slot-scope="text, record, index">
												<a-checkbox style="float: right"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.id)"></a-checkbox>
											</span>
											<span slot="action" slot-scope="text, record">
												<a-button v-has="'filingCabinetTag-edit'" style="margin: 3px;" @click="editTags(record)">编辑</a-button>
												<a-button v-has="'filingCabinetTag-delete'" style="margin: 3px;"
												          @click="delOneTags(record.id, record.tagname)">删除</a-button>
							                </span>
										</a-table>
									</div>
								</a-spin>
							</div>
							<!-- 分页 -->
							<div class="pagination" v-has="'filingCabinetTag-list'" style="margin: 20px auto;height: 32px;"
							     v-show="total > 0">
								<div style="height: 32px;float: left;line-height: 32px;margin-left: 10px;">
									<a-checkbox v-model="batchTypeValue"
									            @click="batchTypeChange"></a-checkbox>
									<a-select optionFilterProp="children"
									          v-model="batchType"
									          @change="changeBatchType"
									          style="width: 150px; margin: 0 5px;">
										<a-select-option value="0">选择当前页</a-select-option>
										<a-select-option value="1">选择所有</a-select-option>
									</a-select>
									<a-button v-has="'filingCabinetTag-delete'" class="btn-primary" icon="lock"
									          :disabled="selectedRowKeys.length == 0"
									          @click="delMoreTags" type="primary">
										批量删除
									</a-button>
								</div>
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total" showSizeChanger
									              :showQuickJumper="quickJumper"
									              :current="page"
									              :pageSize="pageSize"
									              :pageSizeOptions="['15','30','50','100']"
									              @change="changePage"
									              @showSizeChange="showSizeChange"/>
								</div>
							</div>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</div>
		</div>
		<!--添加标签-->
		<a-modal width="666px!important" v-model="tagVisible" title="新建标签" @cancel="cancelTag">
			<template slot="footer">
				<a-button key="back" @click="cancelTag">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading"
						@click="updateTag"
				>提交
				</a-button>
			</template>
			<a-form>
				<a-form-item label="选择分组" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
					<a-button @click="showGroupModal" type="link">
						<template v-if="!tag.id">选择分组</template>
						<template
								v-if="tag.id">{{tag.title}}
						</template>
					</a-button>
				</a-form-item>
				<a-form-item label="标签名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
					<diyInput style="border: 1px solid #E2E2E2;" v-if="tagVisible" :maxLength="15" key="equalKeyword" @func="getTags" :msg="tagName"
					          placeholder="输入标签名称，按回车键可输入多个标签"></diyInput>
				</a-form-item>
			</a-form>

		</a-modal>
		<!--编辑标签-->
		<a-modal width="666px!important" v-model="updateVisible" title="编辑标签" @cancel="cancelTag">
			<template slot="footer">
				<a-button key="back" @click="cancelTag">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading"
						@click="updateTag"
				>提交
				</a-button>
			</template>
			<a-form>
				<a-form-item label="选择分组" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
					<a-button @click="showGroupModal" type="link">
						<template v-if="!tag.id">选择分组</template>
						<template
								v-if="tag.id">{{tag.title}}
						</template>
					</a-button>
				</a-form-item>
				<a-form-item label="标签名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
					<a-input placeholder="请输入标签名称" v-model="tagName1" :maxLength="15">
						<span slot="suffix">
							<span>{{tagName1.length || 0}}</span>/15
						</span>
					</a-input>
					<div style="color: #FF562D;">提交后过滤空格</div>
				</a-form-item>
			</a-form>

		</a-modal>
		<tag-one-team :groupVisible="teamVisible" :tag="tag" @changeGroupId="changeGroupId"></tag-one-team>
	</div>
</template>
<script>
	import tagTeam from "./Team.vue";
	import tagOneTeam from "../../../components/materialTagGroup/Index.vue"
	import diyInput from '../../../components/InputRecommended'

	const columns = [
		{
			title      : "",
			key        : 'select',
			width      : '100px',
			scopedSlots: {customRender: 'select'},
		},
		{
			title    : "标签名称",
			dataIndex: "tagname",
			key      : "tagname",
			width    : '25%'
		},
		{
			title    : "所属分组",
			dataIndex: "group_name",
			key      : "group_name",
			width    : '25%'
		},
		{
			title    : "内容数",
			dataIndex: "num",
			key      : "num",
			width    : '25%'
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '25%',
			scopedSlots: {customRender: "action"}
		}
	];
	export default {
		components: {tagTeam, tagOneTeam, diyInput},
		data () {
			return {
				corpId         : '',//企业微信选中的id
				suite_id       : 1,//应用ID
				groupId        : '',//选中的分组
				defaultId      : '', // 添加标签默认分组id
				defaultName    : '', // 添加标签默认分组名
				searchName     : '',  // 标签名搜索
				tagList        : [], //表格信息
				isLoading      : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				//分页
				total          : 1, //总条数
				quickJumper    : false, // 是否显示快速跳转的控件
				page           : 1, //页码
				pageSize       : 15, //每页数据条数
				selectedRowKeys: [], // 多选ids
				checkBoxValue  : [], // 标签选择框
				batchType      : '0', //0当前页 1所有
				batchTypeValue : false, //当前页/所有 是否选中
				tagVisible     : false, // 添加分组弹窗是否显示
				teamVisible    : false, // 选择分组弹窗是否显示
				loading        : false, // 添加标签弹窗提交loading
				tag            : {      // 添加标签选择的分组信息
					id   : '',
					title: ''
				},
				tagName        : [],
				tagName1       : '',
				tagNameTitle   : '',
				tagEditId      : '',
				updateVisible  : false
			};
		},
		methods   : {
			// 添加标签
			async addTags () {
				this.tag = {      // 添加标签选择的分组信息
					id   : this.defaultId,
					title: this.defaultName
				}
				this.tagName = []
				this.tagVisible = true
			},
			// 选择分组按钮
			showGroupModal () {
				this.tagVisible = false
				this.updateVisible = false
				this.teamVisible = true
			},
			// 改变弹窗分组
			changeGroupId (event, id, title) {
				if (event == 'ok') {
					this.tag = {
						id   : id,
						title: title,
					}
				}
				if (this.tagEditId) {
					this.updateVisible = true
				} else {
					this.tagVisible = true
				}

				this.teamVisible = false
			},
			getTags (list, title) {
				this.tagNameTitle = title.replace(/\s+/g, '')
				this.tagName = []
				for(let i = 0; i < list.length; i++) {
					this.tagName.push(list[i].replace(/\s+/g, ''))
				}
				// this.tagName = list
			},
			// 添加标签
			async updateTag () {
				this.loading = true
				if (!this.tag.id) {
					this.$message.destroy()
					this.$message.warning('请选择分组')
					this.loading = false
					return false
				}
				let tagName = JSON.parse(JSON.stringify(this.tagName))
				let url = 'work-tag/update'
				let title = '修改成功'
				if (!this.tagEditId) {
					title = '添加成功'
					if (this.tagName.length == 0 && !this.tagNameTitle) {
						this.$message.destroy()
						this.$message.warning('请填写标签名称')
						this.loading = false
						return false
					}
					if (typeof this.tagNameTitle != 'undefined' && this.tagNameTitle.trim() != '') {
						tagName.push(this.tagNameTitle.trim())
					}
					url = 'work-tag/add'
				} else {
					tagName = this.tagName1
					if (this.tagName1.trim() === '') {
						this.$message.destroy()
						this.$message.warning('请填写标签名称')
						this.loading = false
						return false
					}
					tagName = tagName.replace(/\s+/g, '')
				}
				const {data: res} = await this.axios.post(url, {
					id      : this.tagEditId,
					corp_id : this.corpId,
					suite_id: this.suite_id,
					type    : 3,
					group_id: this.tag.id,
					name    : tagName
				});
				if (res.error != 0) {
					this.loading = false
					this.$message.destroy()
					this.$message.error(res.error_msg)
				} else {
					this.loading = false
					this.$message.destroy()
					this.$message.success(title)
					if (!this.tagEditId) {
						this.$refs.group.updateCount(res.old_pid || [], res.new_pid || [], tagName.length)
					} else {
						this.$refs.group.updateCount(res.old_pid || [], res.new_pid || [], 1)
					}
					this.cancelTag()
					this.getTagList()
				}
			},
			// 添加、编辑标签取消
			cancelTag () {
				this.tagVisible = false
				this.updateVisible = false
				this.tagName = []
				this.tagName1 = ''
				this.tagNameTitle = ''
				this.tag = {      // 添加标签选择的分组信息
					id   : '',
					title: ''
				}
				this.tagEditId = ''
			},
			// 编辑标签
			editTags (item) {
				this.tagEditId = item.id
				this.tagName1 = item.tagname
				this.tag = {
					id   : item.group_id,
					title: item.group_name
				}
				this.updateVisible = true
			},

			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 列表切换分组
			modalVisibleChange (corpId, teamId, defaultId, defaultName) {
				this.selectedRowKeys = []
				this.corpId = corpId
				this.groupId = teamId
				this.defaultId = defaultId
				this.defaultName = defaultName
				this.getTagList()
			},
			// 查找标签
			findTags () {
				this.getTagList()
			},
			// 标签搜索清空
			clearFind () {
				this.status = ''
				this.searchName = ''
				this.getTagList()
			},
			//获取表格内容
			async getTagList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-tag/list", {
					corp_id : this.corpId,
					group_id: this.groupId,
					suite_id: this.suite_id,
					type    : 3,
					name    : this.searchName,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg)
					this.confirmLoading = false
				} else {
					this.tagList = res.data.info
					this.tagIds = res.data.tag_ids
					this.setCheckedBox(this.tagList)
					this.isLoading = false
					this.total = parseInt(res.data.count)
					this.page = page
					this.pageSize = pageSize
					this.quickJumper = this.total > this.pageSize
				}
			},
			// 批量删除
			delMoreTags () {
				let that = this;
				that.$confirm({
					title     : "确定删除选中的标签?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.delTags(that.selectedRowKeys)
					}
				});
			},

			// 删除标签
			delOneTags (id, tagName) {
				let that = this
				that.$confirm({
					title     : "一旦删除内容标签【" + tagName + "】，已打上该标签的内容将不再具有，确定删除吗?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delTags([id])
					}
				});
			},
			// 删除标签接口
			async delTags (ids) {
				const {data: res} = await this.axios.post("work-tag/delete-more", {
					corp_id: this.corpId,
					ids    : ids,
				});
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.$message.destroy()
					this.$message.success('删除成功')
					this.$refs.group.updateMoreCount(res.data.old_pid, ids.length)
					this.getTagList()
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getTagList(page, pageSize)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 140)
				})
			},
			showSizeChange (page, pageSize) {
				this.getTagList(1, pageSize)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 140)
				})
			},

			// 列表选择
			changeSelectKey (key) {
				for (let i = 0; i < this.selectedRowKeys.length; i++) {
					if (key == this.selectedRowKeys[i]) {
						this.selectedRowKeys.splice(i, 1)
						this.setCheckedBox(this.tagList)
						return false
					}
				}
				this.selectedRowKeys.push(key)
				this.setCheckedBox(this.tagList)
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					// 添加
					if (this.batchType == 0) {
						// 当前页
						this.addKey(this.tagList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = JSON.parse(JSON.stringify(this.tagIds))
					}
					this.setCheckedBox(this.tagList)
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						// 当前
						this.removeKey(this.tagList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
					}
					this.setCheckedBox(this.tagList)
					this.batchTypeValue = false
				}
			},
			// 设置列表多选框选中状态
			setCheckedBox (tagList) {
				this.checkBoxValue = new Array(tagList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < tagList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (tagList[i].id == this.selectedRowKeys[j]) {
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
					if (this.selectedRowKeys.length == this.tagIds.length && this.tagIds.length != 0) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}
				if (tagList.length == 0) {
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
					this.setCheckedBox(this.tagList)
				}
			},
			// 增加当前页key
			addKey (tagList) {
				for (let i = 0; i < tagList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === tagList[i].id)
					if (index == -1) {
						this.selectedRowKeys.push(tagList[i].id)
					}
				}
			},
			// 删除当前页key
			removeKey (tagList) {
				for (let i = 0; i < tagList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === tagList[i].id)
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			//后台返回导入进度数据处理
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'attachment_tag_sort') {
					this.$refs.group.otherUserMove(data.group_id, data.parentId, data.sort)
				}
			},
		},

		mounted () {
			this.ws.setCallback(this.websocketOnMessage)
		}
	};
</script>

<style lang='less' scoped>
	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}


	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
		border-right: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		width: 100%;
		padding-right: 40px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 10px;
		margin-top: 12px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		min-width: 885px;
		width: 100%;
		border: 1px solid rgba(0, 0, 0, 0.05);
		border-bottom: 0px !important;
	}

	/deep/ .ant-table-thead > tr > th, /deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid rgba(0, 0, 0, 0.02);
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.content-hd-right {
		float: right;
	}

	.btn-primary {
		margin-left: 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 47px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .wxtpl .ant-radio-button-wrapper-checked {
		border: 2px solid #01b065 !important;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}
</style>
