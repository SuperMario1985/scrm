<template>
	<div class="tabBox" :key="key">
		<!--企业微信带部门的多选敏感词-->
		<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
				<span slot="label" class="group-name">
					<a-popover trigger="hover">
						<span slot="content"
						      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
							所有分组
						</span>
						所有分组
					</a-popover>

				</span>
			<a-checkable-tag style="cursor: pointer;" v-model="checkedAll"
			                 @change="changeAllWords(checkedAll)">
				全部
			</a-checkable-tag>
		</a-form-item>
		<template v-for="(item,index) in groupList">
			<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
			             v-if="isMore || !isMore && index < 5">
				<span slot="label" class="group-name">
					<a-popover trigger="hover"
					           v-if="item.title && item.title != ''">
						<span slot="content"
						      style="display: inline-block;max-width: 500px;word-wrap: break-word;word-break: break-all;">
							{{item.title}}
						</span>
						{{item.title}}
					</a-popover>

				</span>
				<a-checkable-tag style="cursor: pointer;" v-if="item.children.length > 0" v-model="item.checkedAll"
				                 @change="changeTeamWords(item.children, item.checkedAll)">
					全部
				</a-checkable-tag>
				<a-checkable-tag style="cursor: pointer;" v-model="item.checked[wordIndex]"
				                 @change="changeWords(word.id,index)" v-for="(word,wordIndex) in item.children">
					{{word.title}}
				</a-checkable-tag>
				<!--				<span v-if="item.data.length == 0" style="margin-right:8px;">暂无</span>-->
				<a-button style="font-size:13px; height: 28px; padding: 3px 15px;"
				          @click="createWord(item.id)" v-has="'sensitive-words-add'">
					新建敏感词
				</a-button>
			</a-form-item>
		</template>
		<a-button style="font-size:13px; height: 28px;padding: 3px 15px;margin-right: 10px;margin-left: 16.7%;" @click="addWordGroup" v-if="groupList.length > 0" v-has="'sensitive-words-group-add'">
			新建敏感词分组
		</a-button>
		<div style="font-size:13px; height: 26px; color: #01b065;text-align: center;cursor: pointer;"
		     @click="showMore" v-if="groupList.length > 5">
			<template v-if="!isMore">更多</template>
			<template v-if="isMore">收起</template>
			<a-icon :type="isMore? 'arrow-up' : 'arrow-down'"></a-icon>
		</div>

		<a-modal title="新建敏感词" v-model="visible" @ok="handleOk(inputValue)"
		         :confirmLoading="confirmLoading3" @cancel="cancel" width="550px">
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					选择分组
				</template>
				<a-select showSearch v-model="group_id"
				          optionFilterProp="children" disabled style="width: 250px;">
					<a-select-option v-for="item in groupList" :value="item.id">
						{{item.title}}
					</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					敏感词名称
				</template>
				<p style="margin: 0px 0px 10px 0;font-size: 13px; color: #909399;">
					每个敏感词名称最多6个字。同时新建多个敏感词时，请用“空格”隔开</p>
				<a-input placeholder="请输入敏感词（不得超过6个字符）" v-model="inputValue"/>
			</a-form-item>
		</a-modal>
		<a-modal
				title="新建敏感词分组"
				:visible="groupVisible"
				@ok="handleOk2"
				:confirmLoading="confirmLoading"
				@cancel="handleCancel"
		>
			<a-input placeholder="请输入分组名(不得超过15个字符)" v-model="teamName" :maxLength="15">
												<span slot="suffix">
													<span>{{teamName.length}}</span>/15
												</span>
			</a-input>
		</a-modal>
	</div>
</template>

<script>
	export default {
		name : "corpSensitiveWord",
		props: {
			callback : {
				type   : Function,
				default: null
			},
			hasChoose: {
				type   : Array,
				default: () => {
				}
			},
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				key            : 0,
				checkedAll     : false, // 所有分组全部
				corpId         : corpId,//企业微信选中的id
				groupList      : [], //敏感词分组列表
				word_arr        : [], //敏感词值数组
				group_id       : [],//选择敏感词的分组
				checked        : [],
				visible        : false, //新建敏感词弹窗显示与隐藏
				confirmLoading3: false, //新建敏感词弹框加载
				inputValue     : "", //新建敏感词输入框值
				newWordList     : [],//新建敏感词传给后台参数
				isMore         : false,//是否展示更多
				//新建敏感词组弹窗
				groupVisible   : false,//新建敏感词组弹窗的显示与隐藏
				confirmLoading : false,//加载
				teamName       : '',//敏感词组名

			};
		},
		watch  : {
			hasChoose: {
				handler (newVal) {
					if (typeof newVal != 'undefined' && this.groupList.length) {
						this.word_arr = JSON.parse(JSON.stringify(newVal))
						let len = 0
						this.checkedAll = false
						if(this.hasChoose.length > 0) {
							this.hasChoose.map(x => {
								this.groupList.map(y => {
									y.children.map((i, index) => {
										if (x == i.id) {
											y.checked[index] = true
										}
									})
									y.checkedAll = true
									if(y.checked.length != y.children.length) {
										y.checkedAll = false
									}
									for(let c of y.checked) {
										if(!c) {
											y.checkedAll = false
										}
									}
								})
							})
							this.groupList.map(y => {
								len += y.children.length
							})
							if(len == this.hasChoose.length && len != 0) {
								this.checkedAll = true
							}
						} else {
							this.groupList.map(y => {
								y.checked = []
								y.checkedAll = false
							})
						}
						this.groupList = JSON.parse(JSON.stringify(this.groupList))
						this.key++
					}
				},
				deep: true
			}
		},
		methods: {
			//获取敏感词
			async getWords () {
				const {data: res} = await this.axios.post("limit-word/word-group", {
					uid: localStorage.getItem('uid'),
					is_system : 0
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.groupList = res.data
					this.groupList.map(x => {
						x.checkedAll = false
						x.checked = []
					})
					this.checkedAll = false
					let len = 0
					if (typeof this.hasChoose != 'undefined' && this.hasChoose.length > 0) {
						this.word_arr = this.hasChoose
						this.hasChoose.map(x => {
							this.groupList.map(y => {
								y.children.map((i, index) => {
									if (x == i.id) {
										y.checked[index] = true
									}
								})
								y.checkedAll = true
								if(y.checked.length != y.children.length) {
									y.checkedAll = false
								}
								for(let c of y.checked) {
									if(!c) {
										y.checkedAll = false
									}
								}
							})
						})
						this.groupList.map(y => {
							len += y.children.length
						})
						if(len == this.hasChoose.length && len != 0) {
							this.checkedAll = true
						}
					} else {
						this.groupList.map(y => {
							y.checked = []
							y.checkedAll = false
						})
					}
					this.$forceUpdate()
				}
			},
			changeAllWords(bool) {
				if(bool) {
					this.word_arr = []
					this.groupList.map(y => {
						y.children.map((i, index) => {
							this.word_arr.push(i.id)
						})
					})
				} else {
					this.word_arr = []
				}
				this.groupList = JSON.parse(JSON.stringify(this.groupList))
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("ok", this.word_arr);
				}
			},
			changeTeamWords(item, bool) {
				Array.prototype.indexOf = function (val) {
					for (let i = 0; i < this.length; i++) {
						if (this[i] == val) return i
					}
					return -1
				}
				Array.prototype.remove = function (val) {
					let index = this.indexOf(val)
					if (index > -1) {
						this.splice(index, 1)
					}
				}
				if(bool) {
					for(let i of item) {
						if(this.word_arr.indexOf(i.id) == -1) {
							this.word_arr.push(i.id)
						}
					}
				} else {
					for(let i of item) {
						let index = this.word_arr.indexOf(i.id)
						if(index > -1) {
							this.word_arr.splice(index, 1)
						}
					}
				}
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("ok", this.word_arr);
				}
			},
			changeWords (key, index) {
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
				if (this.word_arr.includes(key2)) {
					this.word_arr.remove(key2)
				} else {
					this.word_arr.push(key2)
				}
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("ok", this.word_arr);
				}
			},
			//新建敏感词
			createWord (id) {
				this.group_id = id
				this.visible = true
			},
			// 新建敏感词确认
			handleOk (val) {
				let that = this
				that.confirmLoading3 = true
				if (val == "") {
					that.$message.warning("不能为空")
					that.confirmLoading3 = false
					return false
				} else {
					for (var i = 0; i < val.split(" ").length; i++) {
						if (val.split(" ")[i].length > 6) {
							that.$message.error("每个敏感词最多6个字")
							that.confirmLoading3 = false
							return false
						} else if (
							val.split(" ")[i].length > 0
						) {
							that.newWordList.push(val.split(" ")[i])
						}
					}
					that.addWords()
					that.inputValue = "";
					that.newWordList = []
					that.confirmLoading3 = false
				}
			}
			,
			// 添加敏感词接口
			async addWords () {
				const {data: res} = await this.axios.post("limit-word/set", {
					uid     : localStorage.getItem('uid'),
					group_id: this.group_id,
					title   : this.newWordList
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.confirmLoading3 = false
				} else {
					this.isLoading = false
					this.visible = false
					this.confirmLoading3 = false
					this.getWords()
					this.checkedAll = false
					this.inputValue = ""
					this.newWordList = []
				}
			},
			// 新建敏感词取消
			cancel () {
				this.visible = false
				this.inputValue = ''
			},
			//显示更多
			showMore () {
				this.isMore = !this.isMore
			},
			//新建敏感词组
			addWordGroup () {
				this.groupVisible = true
			},
			handleCancel(){
				this.groupVisible = false
				this.teamName = ''
			},
			async handleOk2(){
				String.prototype.Trim = function () {
					return this.replace(/(^\s*)|(\s*$)/g, "");
				}
				this.teamName = this.teamName.Trim()
				if (!this.teamName) {
					this.$message.error("请输入分组名")
					return false
				}
				this.confirmLoading = true
				const {data: res} = await this.axios.post("limit-word/group-add", {
					uid  : localStorage.getItem('uid'),
					title: this.teamName
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.teamName = ''
					this.groupVisible = false
					this.getWords()
				}
				this.confirmLoading = false
			},
		},

		mounted () {
			// 获取敏感词列表
			this.getWords()
		}
	};
</script>

<style lang='less' scoped>
	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065 !important;
		border-color: #01b065 !important;
		color: #FFFFFF !important;
	}
	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 0 5px;
		padding: 3px 15px;
		cursor: pointer;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
		margin-bottom: 10px;
	}
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
		background: #fff;
		padding: 10px;
		box-sizing: border-box;
		margin-right: 20px;
		border: 1px solid #d8d8d8;
	}
</style>
