<template>
	<div>
		<a-modal v-if="visible" v-model="visible" width="888px!important" title="选择标签" @cancel="cancelGroup">
			<template slot="footer">
				<a-button key="back" @click="cancelGroup">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="comfirmLoading"
						@click="updateGroup"
				>确定
				</a-button>
			</template>
			<div style="display: inline-block; border-right: 1px solid #E2E2E2; width: 50%;">
				<div style="margin-bottom: 5px; color: #ff562D;">{{noticeTitle}}</div>
				<a-input style="width: 230px; display: block;" @input="selectStore" v-model="searchName"
				         placeholder="请输入标签名进行查找"/>
				<div class="group-tree2" style="height: 350px; overflow: auto;" @scroll="handleScroll">
					<div v-show="searchName != ''" class="tag-list">
						<a-empty v-show="tagList.length == 0 && !isLoading"/>
						<a-spin tip="Loading..." class="tag-spin" :spinning="isLoading"></a-spin>
						<div class="spin-zhezhao" v-if="isLoading"></div>
						<div class="tag-item" :class="tagsDisabled.includes(item.id + '-s') ? 'tag-disabled' : ''" @click="selectId(item.id + '-s', item.tagname)" v-for="item in tagList">
							<a-icon type="tags" style="color: #01b065;"></a-icon>
							{{item.tagname}}<span style="color: rgba(0, 0, 0, 0.3)">（{{item.group_name}}）</span>
							<a-icon style="color: #01b065;margin-left: 10px;" type="check"
							        v-if="ids.includes(item.id + '-s')"></a-icon>
						</div>

					</div>

					<a-tree v-if="searchName == ''"
					        class="draggable-tree"
					        @select="onselect"
					        :treeData="gData"
					        :load-data="onLoadData"
					>
						<template slot="custom" slot-scope="{title, count, key, tag}">
							<span :class="tagsDisabled.includes(key) ? 'tag-disabled' : ''">
								<a-icon v-if="tag" type="tags" style="color: #01b065;"></a-icon>
								<img v-if="!tag" src="../../assets/team.png">
								{{title}}
								<template v-if="!tag">（{{count}}）</template>
							</span>
							<a-icon style="color: #01b065;margin-left: 10px;" :class="tagsDisabled.includes(key) ? 'tag-disabled' : ''" type="check"
							        v-if="ids.includes(key)"></a-icon>
						</template>
					</a-tree>
				</div>
			</div>
			<div style="display: inline-block; width: calc(50% - 5px); vertical-align: top; overflow: auto; padding: 4px 20px 10px 20px;"
			:style="{maxHeight : noticeTitle != '' ? '430px' : '386px'}">
				已选择的标签
				<div v-for="(item, index) in tags" style="margin: 10px 0">
					<a-icon v-if="item.tag" type="tags" style="color: #01b065;"></a-icon>
					<img v-if="!item.tag" src="../../assets/team.png">
					{{item.title}}
					<a-icon @click="deleteStore(index)" v-if="!tagsDisabled.includes(item.id)"
					        style="cursor: pointer; margin-top: 3px; color: rgba(0, 0, 0, 0.65); float: right;"
					        type="close"></a-icon>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
	export default {
		name   : "Team",
		props  : {
			noticeTitle: {
				type : String,
				default: ''
			},
			groupVisible: {
				type   : Boolean,
				default: false
			},
			tagIds    : {
				type   : Array,
				default: () => [],
			},
			tagDetail : {
				type   : Array,
				default: () => [],
			},
			tagsDisabled : {
				type   : Array,
				default: () => []
			},
		},
		watch  : {
			tagIds (newVal, oldVal) {
				this.ids = newVal
			},
			tagDetail (newVal, oldVal) {
				this.tags = newVal
			},
			groupVisible (newVal, oldVal) {
				this.visible = newVal
				if (this.visible) {
					this.getGroupList()
				}
			}
		},
		data () {
			let corpId =
				localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId    : corpId,
				searchName: '',
				ids       : '', //选中的id数组
				tags    : [], // 选中的门店数据
				gData     : [], // tree数据
				groupData : [], // 子分组列表数据
				visible   : false, // 弹窗是否显示
				timeInter : 0,
				isLoading : false,
				tagList   : [],
				page      : 1,
				count     : 0,
				comfirmLoading: false
			}
		},
		mounted () {
			this.ids = this.tagIds
			this.tags = this.tagDetail
			this.visible = this.groupVisible
			this.getGroupList();
		},
		methods: {
			isDisabled(id) {
				return this.tagsDisabled.includes(id)
			},
			handleScroll () {
				if (this.searchName != '' && !this.isLoading) {
					//变量scrollTop是滚动条滚动时，距离左边的距离
					let tagList = document.getElementsByClassName("group-tree2")[0]
					//变量scrollTop是滚动条滚动时，距离顶部的距离
					let scrollTop = tagList.scrollTop;
					//变量windowHeight是可视区的高度
					let windowHeight = tagList.clientHeight
					//变量scrollHeight是滚动条的总高度
					let scrollHeight = tagList.scrollHeight
					//滚动条到底部的条件
					if (scrollTop + windowHeight == scrollHeight) {
						if (this.count > this.tagList.length) {
							this.isLoading = true
							this.selectTagList(this.page + 1)
						}
					}
				}
			},
			selectStore (e) {
				if (e.val == '') {
					this.tagList = []
					this.page = 1
				}
				clearTimeout(this.timeInter)
				this.timeInter = setTimeout(this.selectTagList, 500)
			},
			async selectTagList (page = 1) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-tag/list", {
					corp_id  : this.corpId,
					group_id : '',
					name     : this.searchName,
					page     : page,
					page_size: 15,
					suite_id : 1,
					type     : 3
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					if (page == 1) {
						this.tagList = res.data.info;
						this.count = parseInt(res.data.count)
					} else {
						this.tagList = JSON.parse(JSON.stringify(this.tagList.concat(res.data.info)))
					}
					this.page = page;
					this.isLoading = false;
				}
			},
			// 取消选择分组
			cancelGroup () {
				this.searchName = ''
				this.page = 1
				this.count = 0
				this.tagList = []
				this.$emit("setGroupId", 'cancle')
			},
			// 提交分组
			updateGroup () {
				this.searchName = ''
				this.page = 1
				this.count = 0
				this.tagList = []
				this.comfirmLoading = true
				this.$emit("setGroupId", 'ok', this.ids, this.tags)
			},
			// 加载子分组
			onLoadData (treeNode) {
				return new Promise(resolve => {
					Promise.all([
						this.getGroupList(treeNode.dataRef.key)
					]).then(res => {
						treeNode.dataRef.children = this.groupData;
						let a = this.gData
						this.gData = [...this.gData];
						a = []
						resolve();
					}).catch(e => {
					})
				});
			},
			// 查询key的对象
			loopObjByKey (data, key, callback) {
				let that = this
				data.forEach((item2) => {
					if (item2.key == key) {
						return callback(item2)
					} else if (item2.children && item2.children.length > 0 && !item2.isLeaf) {
						return that.loopObjByKey(item2.children, key, callback)
					}
				})
			},
			// 获取分组
			async getGroupList (parentId) {
				const {data: res} = await this.axios.post("work-attachment-tag/get-group-list", {
					uid      : localStorage.getItem('uid'),
					corp_id  : this.corpId,
					parent_id: parentId ? parentId : this.id,
					tag      : 1,
					// choose   : 1
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					if (parentId) {
						//选择部门返回下一级数据
						this.groupData = res.data.data
					} else {
						this.gData = res.data.data;
					}
					this.isLoading = false;
				}
			},
			selectId (id, name) {
				if(this.tagsDisabled.includes(id)) {
					return false
				}
				let index = this.ids.findIndex(key => key == id)
				if (index > -1) {
					this.ids.splice(index, 1)
					this.tags.splice(index, 1)
				} else {
					this.ids.push(id)
					let tag = {
						id   : id,
						tag  : true,
						title: name
					}
					this.tags.push(tag)
				}
			},
			// 点击分组
			onselect (e, event) {
				if (e.length > 0 && this.id != e[0]) {
					if(this.tagsDisabled.includes(e[0])) {
						return false
					}
					let index = this.ids.findIndex(id => id == e[0])
					if (index > -1) {
						this.ids.splice(index, 1)
						this.tags.splice(index, 1)
					} else {
						this.ids.push(e[0])
						let that = this
						let tag = {
							id   : e[0],
							tag  : event.node.dataRef.tag,
							title: event.node.dataRef.title
						}
						that.tags.push(tag)
					}
				}
			},
			// 右侧删除分组
			deleteStore (index) {
				this.ids.splice(index, 1)
				this.tags.splice(index, 1)
			}
		}
	}
</script>

<style scoped>
	.tab {
		width: 50%;
		display: inline-block;
		text-align: center;
		height: 40px;
		line-height: 40px;
	}

	.active {
		background-color: #01b065;
		color: #FFFFFF;
	}

	.team-add {
		width: 100%;
		height: 50px;
		line-height: 50px;
		/*background-color: #F5F5F5;*/
	}

	.team-add-title {
		display: inline-block;
		margin-left: 10px;
	}

	.team-add-icon {
		color: #1E90FF;
		margin-left: 10px;
		cursor: pointer;
		display: inline-block;
		vertical-align: initial;
	}

	/deep/ .ant-tree-node-content-wrapper {
		display: inline-block;
		width: calc(100% - 25px);
	}

	/deep/ .ant-tree-switcher-icon {
		vertical-align: initial;
	}

	/deep/ .ant-tree-node-content-wrapper.ant-tree-node-selected {
		background-color: #FFFFFF !important;
	}

	/deep/ .ant-popover-inner .ant-popover-inner-content .ant-popover-buttons {
		display: none !important;
	}

	.more-operation:hover {
		color: #01b065;
	}

	/deep/ .ant-tree li .ant-tree-node-content-wrapper:hover {
		background-color: #FFFFFF;
	}

	/deep/ .ant-tree li span[draggable], .ant-tree li span[draggable='true'] {
		line-height: 25px;
		height: 30px;
	}

	/deep/ .ant-tree li span.ant-tree-switcher {
		vertical-align: sub;
	}

	.operation {
		margin-bottom: 8px;
		cursor: pointer;
	}

	.operation2 {
		margin-bottom: 0px;
		cursor: pointer;
	}

	.operation1 {
		margin-bottom: 0px;
		color: #E2E2E2;
	}

	.operation:hover {
		color: #01b065;
	}

	/deep/ li.ant-tree-treenode-disabled > .ant-tree-node-content-wrapper span {
		color: rgba(0, 0, 0, 0.65) !important;
	}

	.tag-list {
		margin-top: 10px;
	}

	.tag-item {
		margin: 5px 0;
		cursor: pointer;
	}

	.tag-spin {
		position: fixed;
		margin-top: 140px;
		margin-left: 160px;
		z-index: 9999;
	}

	.spin-zhezhao {
		position: fixed;
		z-index: 999;
		width: 417px;
		height: 350px;
		margin-top: -10px;
		background-color: rgba(0, 0, 0, 0.04);
	}
	.tag-disabled {
		opacity: 0.5 !important;
	}
</style>