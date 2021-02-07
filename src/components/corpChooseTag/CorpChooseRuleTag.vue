<template>
	<div class="tabBox" v-has="'client-tag-list'">
		<a-empty v-show="groupList.length == 0">
			<span slot="description">
				尚未创建标签规则，无法选择标签
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
					                 @change="changeTags(tag.id,index)">
						{{tag.tagname}}
					</a-checkable-tag>
					<a-button
							style="margin: 5px;line-height: 26px !important;font-size: 12px;height: auto !important;padding: 0 7px;"
							:disabled="item.disabled[tagIndex] && isDisabled == 1"
							v-if="item.disabled[tagIndex] && isDisabled == 1">
						{{tag.tagname}}
					</a-button>
				</span>
			</a-form-item>
		</template>
		<div style="font-size:13px; height: 26px; color: #1890FF;text-align: center;cursor: pointer;"
		     @click="showMore" v-if="groupList.length > 5">
			<template v-if="!isMore">更多</template>
			<template v-if="isMore">收起</template>
			<a-icon :type="isMore? 'arrow-up' : 'arrow-down'"></a-icon>
		</div>

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
			isDisabled : {
				type   : Number,
				default: 0
			},
			disabledTag: {
				type   : Array,
				default: () => {
				}
			},
			id         : {
				type   : String,
				default: ''
			}
		},
		data () {
			return {
				corpId   : '',//企业微信选中的id
				groupList: [], //标签分组列表
				tag_arr  : [], //标签值数组
				tag_ids  : "", //标签值
				group_id : [],//选择标签的分组
				checked  : [],
				isMore   : false,//是否展示更多
				//新建标签组弹窗

			};
		},
		watch  : {
			hasChoose  : {
				handler (newVal) {
					if (typeof newVal != 'undefined' && this.groupList.length) {
						this.tag_arr = newVal
						this.tag_ids = newVal.join()
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
				},
				deep: true
			},
			id  : {
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
				const {data: res} = await this.axios.post("work-tag-keyword-rule/get-rule-tag", {
					corp_id: this.corpId
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
			changeTags (key, index) {
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
					this.tag_arr.remove(key2)
				} else {
					if (this.tag_arr.length + 1 > 20) {
						this.$message.warning('不可选中，粉丝标签数量上限20个')
						for (let i = 0; i < this.groupList[index].data.length; i++) {
							if (this.groupList[index].data[i].id == key2) {
								this.groupList[index].checked[i] = false
							}
						}
					} else {
						this.tag_arr.push(key2)
					}
				}
				this.$forceUpdate()
				this.tag_ids = this.tag_arr.join()
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("ok", this.tag_ids);
				}
			},
			//显示更多
			showMore () {
				this.isMore = !this.isMore
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
</style>
