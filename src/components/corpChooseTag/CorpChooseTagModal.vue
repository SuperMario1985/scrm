<template>
	<div class="tabBox">
		<a-empty v-show="groupList.length == 0 && isNotAdd == 1">
			<span slot="description">
				尚未创建标签，无法选择标签
			</span>
		</a-empty>
		<!--企业微信带部门的多选标签-->
		<template v-for="(item,index) in groupList">
			<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
			             v-if="isMore || !isMore && index < 5">
				<span slot="label" class="group-name">
					<a-popover trigger="hover"
					           v-if="item.name && item.name != ''">
						<span slot="content"
						      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
							{{item.name}}
						</span>
						{{item.name}}
					</a-popover>

				</span>
				<span v-for="(tag,tagIndex) in item.data">
					<a-checkable-tag v-model="item.checked[tagIndex]" v-if="!item.disabled[tagIndex]"
					                 @change="changeTags(tag.id,index, tag.tagname)">
						{{tag.tagname}}
					</a-checkable-tag>
					<a-button
							style="margin: 5px;line-height: 26px;font-size: 12px;height: auto !important;padding: 0 7px;"
							:disabled="item.disabled[tagIndex] && isDisabled == 1"
							v-if="item.disabled[tagIndex] && isDisabled == 1">
						{{tag.tagname}}
					</a-button>
				</span>
				<!--				<span v-if="item.data.length == 0" style="margin-right:8px;">暂无</span>-->
				<a-button icon="plus" style="font-size:13px; height: 26px"
				          @click="createTag(item.id)" v-has="'client-tag-add'" v-if="isNotAdd != 1">
					新建标签
				</a-button>
			</a-form-item>
		</template>
		<a-button icon="plus" style="font-size:13px; height: 26px;margin-right: 10px;margin-left: 16.7%;"
		          @click="addTagGroup" v-has="'client-tag-group-add'" v-if="groupList.length > 0 && isNotAdd != 1">
			新建标签组
		</a-button>
		<div style="font-size:13px; height: 26px; color: #01b065;text-align: center;cursor: pointer;"
		     @click="showMore" v-if="groupList.length > 5">
			<template v-if="!isMore">更多</template>
			<template v-if="isMore">收起</template>
			<a-icon :type="isMore? 'arrow-up' : 'arrow-down'"></a-icon>
		</div>

		<a-modal title="新建标签" v-model="visible" @ok="handleOk(inputValue)" :zIndex="99999"
		         :confirmLoading="confirmLoading3" @cancel="cancel" width="550px">
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					选择分组
				</template>
				<a-select showSearch v-model="group_id"
				          optionFilterProp="children" disabled style="width: 250px;">
					<a-select-option v-for="item in groupList" :value="item.id">
						{{item.name}}
					</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					标签名称
				</template>
				<p style="margin: 0px;font-size: 13px; color: #909399;">
					每个标签名称最多15个字。同时新建多个标签时，请用“空格”隔开</p>
				<a-input placeholder="请输入标签（不得超过15个字符）" v-model="inputValue"/>
			</a-form-item>
		</a-modal>
		<a-modal
				:zIndex="99999"
				title="新建标签组"
				:visible="groupVisible"
				@ok="handleOk2"
				:confirmLoading="confirmLoading"
				@cancel="handleCancel" class="add-tag-group"
		>
			<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
				<template slot="label">
					<span style="color: red;">*</span>分组名称
				</template>
				<a-input placeholder="请输入分组名(不得超过15个字符)" v-model="teamName" :maxLength="15">
												<span slot="suffix">
													<span>{{teamName.length}}</span>/15
												</span>
				</a-input>
			</a-form-item>
			<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
				<template slot="label">
					<span style="color: red;">*</span>标签名称
				</template>
				<p style="margin: 0px;font-size: 13px; color: #909399;">
					每个标签名称最多15个字。同时新建多个标签时，请用“空格”隔开
				</p>
				<a-input placeholder="请输入标签（不得超过15个字符）" v-model="inputValue2"/>
			</a-form-item>
		</a-modal>
	</div>
</template>

<script>
	export default {
		name   : "chooseDepartment",
		props  : {
			callback   : {
				type   : Function,
				default: null
			},
			hasChoose  : {
				type   : Array,
				default: () => {
				}
			},
			tagname    : {
				type   : Array,
				default: () => {
				}
			},
			isDisabled : {
				type   : Number,
				default: 0
			},
			disabledTag: {
				type   : Array,
				default: () => {
				}
			},
			isNotAdd   : {
				type   : Number,
				default: 0
			},
			id         : {
				type   : String,
				default: ''
			}
		},
		data () {
			return {
				corpId         : '',//企业微信选中的id
				groupList      : [], //标签分组列表
				tag_arr        : [], //标签值数组
				tag_ids        : "", //标签值
				tagName        : [],
				group_id       : [],//选择标签的分组
				checked        : [],
				visible        : false, //新建标签弹窗显示与隐藏
				confirmLoading3: false, //新建标签弹框加载
				inputValue     : "", //新建标签输入框值
				newTagList     : [],//新建标签传给后台参数
				isMore         : false,//是否展示更多
				//新建标签组弹窗
				groupVisible   : false,//新建标签组弹窗的显示与隐藏
				confirmLoading : false,//加载
				teamName       : '',//标签组名
				inputValue2    : "", //新建标签组输入框值
				newTagList2    : [], //新建标签组数组

			};
		},
		watch  : {
			hasChoose  : {
				handler (newVal) {
					if (typeof newVal != 'undefined' && this.groupList.length) {
						this.tag_arr = newVal
						this.tag_ids = newVal.join()
						this.tagName = JSON.parse(JSON.stringify(this.tagname))
						this.hasChoose.map(x => {
							this.groupList.map(y => {
								y.data.map((i, index) => {
									if (x == i.id) {
										y.checked[index] = true
									}
								})
							})
						})
						if (newVal.length == 0) {
							this.groupList.map(j => {
								j.checked = []
							})
						}
						this.$forceUpdate()
					}
				},
				deep: true
			},
			id         : {
				handler (newVal) {
					if (typeof newVal != '') {
						this.corpId = newVal
						this.getTags()
					}
				},
				deep: true
			},
			disabledTag: {
				handler (newVal) {
					if (typeof newVal != 'undefined' && this.groupList.length) {
						this.disabledTag.map(x => {
							this.groupList.map(y => {
								y.data.map((i, index) => {
									if (x == i.id) {
										y.disabled[index] = true
									}
								})
							})
						})
						this.$forceUpdate()
					}
				},
				deep: true
			}
		},
		methods: {
			//获取标签
			async getTags () {
				const {data: res} = await this.axios.post("work-tag-group/tag-group", {
					corp_id   : this.corpId || localStorage.getItem('corpId'),
					is_not_add: this.isNotAdd
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.groupList = res.data
					this.groupList.map(x => {
						x.checked = []
						x.disabled = []
					})
					if (typeof this.disabledTag != 'undefined' && this.disabledTag.length > 0) {
						this.disabledTag.map(x => {
							this.groupList.map(y => {
								y.data.map((i, index) => {
									if (x == i.id) {
										y.disabled[index] = true
									}
								})
							})
						})
					}
					if (typeof this.hasChoose != 'undefined' && this.hasChoose.length > 0) {
						this.tag_arr = this.hasChoose
						this.tag_ids = this.hasChoose.join()
						this.tagName = JSON.parse(JSON.stringify(this.tagname))
						this.hasChoose.map(x => {
							this.groupList.map(y => {
								y.data.map((i, index) => {
									if (x == i.id) {
										y.checked[index] = true
									}
								})
							})
						})
						this.$forceUpdate()
					}
				}
			},
			changeTags (key, index, tagName) {
				Array.prototype.indexOf = function (val) {
					for (let i = 0; i < this.length; i++) {
						if (this[i] == val) return i
					}
					return -1
				}
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val)
					if (index > -1) {
						this.splice(index, 1)
					}
				}
				let key2 = String(key)
				if (this.tag_arr.includes(key2)) {
					this.tagName.splice(this.tag_arr.indexOf(key2), 1)
					this.tag_arr.remove(key2)
				} else {
					if (this.tag_arr.length + 1 > 9999) {
						this.$message.warning('不可选中，客户标签数量上限9999个')
						for (let i = 0; i < this.groupList[index].data.length; i++) {
							if (this.groupList[index].data[i].id == key2) {
								this.groupList[index].checked[i] = false
							}
						}
					} else {
						this.tag_arr.push(key2)
						this.tagName.push(tagName)
					}
				}
				this.$forceUpdate()
				this.tag_ids = this.tag_arr.join()
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("ok", this.tag_ids, this.tagName);
				}
			},
			//新建标签
			createTag (id) {
				this.group_id = id
				let count = 0
				this.groupList.map(x => {
					count += x.data.length
				})
				if (count >= 9999) {
					this.$message.warning("标签数量已超过上限9999个，无法创建")
					return false
				} else {
					this.visible = true
				}
			},
			// 新建标签确认
			handleOk (val) {
				let that = this
				that.confirmLoading3 = true
				if (val == "") {
					that.$message.warning("不能为空")
					that.confirmLoading3 = false
					return false
				} else {
					for (var i = 0; i < val.split(" ").length; i++) {
						if (val.split(" ")[i].length > 15) {
							that.$message.error("每个标签最多15个字")
							that.confirmLoading3 = false
							return false
						} else if (
							val.split(" ")[i].length > 0
						) {
							that.newTagList.push(val.split(" ")[i])
						}
					}
					that.addTags()
					that.inputValue = "";
					that.newTagList = []
					that.confirmLoading3 = false
				}
			}
			,
			// 添加标签接口
			async addTags () {
				const {data: res} = await this.axios.post("work-tag/add", {
					corp_id : this.corpId || localStorage.getItem('corpId'),
					suite_id: 1,
					type    : 0,
					group_id: this.group_id,
					name    : this.newTagList
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.confirmLoading3 = false
				} else {
					this.isLoading = false
					this.visible = false
					this.confirmLoading3 = false
					this.getTags()
					this.inputValue = ""
					this.newTagList = []
				}
			},
			// 新建标签取消
			cancel () {
				this.visible = false
				this.inputValue = ''
			},
			//显示更多
			showMore () {
				this.isMore = !this.isMore
			},
			//新建标签组
			addTagGroup () {
				this.groupVisible = true
			},
			handleCancel () {
				this.groupVisible = false
				this.teamName = ''
				this.newTagList2 = []
				this.inputValue2 = ""
			},
			async handleOk2 () {
				String.prototype.Trim = function () {
					return this.replace(/(^\s*)|(\s*$)/g, "");
				}
				this.teamName = this.teamName.Trim()
				if (!this.teamName) {
					this.$message.error("请输入分组名")
					return false
				}
				if (this.inputValue2 == "") {
					this.$message.warning("标签名称不能为空");
					return false;
				} else {
					let arr = JSON.parse(JSON.stringify(this.inputValue2)).split(" ")
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].length > 15) {
							this.$message.error("每个标签最多15个字");
							this.inputValue2 = "";
							return false;
						} else if (arr[i].length > 0) {
							this.newTagList2.push(arr[i]);
						}
					}
				}
				this.confirmLoading = true
				const {data: res} = await this.axios.post("work-tag-group/add", {
					corp_id        : this.corpId || localStorage.getItem('corpId'),
					suite_id       : 1,
					name           : this.teamName,
					type           : 0,
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
					tag_name       : this.newTagList2
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.teamName = ''
					this.newTagList2 = []
					this.inputValue2 = ""
					this.groupVisible = false
					this.getTags()
				}
				this.confirmLoading = false
			},
		},

		mounted () {
			this.corpId = this.id || localStorage.getItem('corpId')
			// 获取标签列表
			this.getTags()
		}
	};
</script>

<style lang='less' scoped>
	/deep/ .ant-tree-checkbox {
		float: right;
	}

	/deep/ .ant-tree-iconEle {
		display: none !important;
	}

	/deep/ .ant-tree-node-content-wrapper.ant-tree-node-selected {
		background-color: #FFFFFF !important;
	}

	/deep/ .ant-list-item {
		border-bottom: 0;
		padding: 0;
	}

	/deep/ .ant-list-item-meta-title {
		font-weight: 400;
		line-height: 32px;
	}

	/deep/ .ant-tree li span.ant-tree-checkbox {
		margin: 4px 20px 0 2px;
	}

	.content-msg {
		color: red;
		margin: 0 20px 12px 0;
	}

	.group-name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: calc(100% - 4px);
		display: inline-block;
		vertical-align: bottom;
	}

	.tabBox {
		background: #FFF;
		padding: 10px;
		box-sizing: border-box;
		margin-right: 20px;
		border: 1px solid #D8D8D8;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		height: 26px;
		line-height: 25px;
		/*margin: 0 5px;*/
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	/deep/ .ant-col-20 {
		margin-left: 20px;
		width: calc(83.33333333% - 20px);
	}

	.add-tag-group /deep/ .ant-col-20 {
		margin-left: 0;
		width: 83.33333333%;
	}
</style>
