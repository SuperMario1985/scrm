<template>
	<div>
		<a-modal v-if="visible" v-model="visible" width="600px!important" title="选择分组" @cancel="cancelGroup">
			<template slot="footer">
				<a-button key="back" @click="cancelGroup">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						@click="updateGroup"
				>确定
				</a-button>
			</template>
			<div style="margin-bottom: 10px; font-weight: 700;">已选择分组： {{title || '未分组'}}</div>
			<div class="group-tree1" style="height: 350px;overflow: auto;">
				<a-tree
						class="draggable-tree"
						@select="onselect"
						:treeData="gData"
						:load-data="onLoadData"
				>
					<template slot="custom" slot-scope="{title,key}">
						<div style="min-width: 100%;">
							<div style="display: inline-block;" :class="key== id ? 'active': ''">{{title}}</div>
						</div>
					</template>
				</a-tree>
			</div>
		</a-modal>
	</div>
</template>

<script>
	export default {
		name   : "Team",
		props  : {
			groupVisible: {
				type   : Boolean,
				default: false
			},
			tag         : {
				type   : Object,
				default: {
					id   : '',
					title: ''
				}
			}
		},
		watch  : {
			tag (newVal, oldVal) {
				if (newVal.id == '') {
					let g = this.gData.find(g => g.title == '未分组')
					this.id = g.id
					this.title = g.title
				} else {
					this.id = newVal.id
					this.title = newVal.title
				}
			},
			groupVisible (newVal, oldVal) {
				this.visible = newVal
				if (this.visible) {
					this.id = this.tag.id
					this.title = this.tag.title
					this.getGroupList()
				}
			}
		},
		data () {
			let corpId =
				localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId   : corpId,
				id       : '', //点击的id
				title    : '', // 点击的分组名
				currentId: '', // 移动的id
				gData    : [], // tree数据
				groupData: [], // 子分组数据
				allObj : {}, // 分组的引用地址
				visible  : false, // 弹窗是否显示
			}
		},
		methods: {
			// 取消分组
			cancelGroup () {
				this.$emit("changeGroupId", 'cancle')
			},
			// 提交分组
			updateGroup () {
				this.$emit("changeGroupId", 'ok', this.id, this.title)
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
			// 获取分组
			async getGroupList (parentId) {
				const {data: res} = await this.axios.post("work-attachment-tag/get-group-list", {
					uid      : localStorage.getItem('uid'),
					corp_id  : this.corpId,
					parent_id: parentId ? parentId : '',
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					if (parentId) {
						//选择部门返回下一级数据
						this.groupData = res.data.data
						for (let i = 0; i < res.data.data.length; i++) {
							this.allObj['s_' + res.data.data[i].id] = res.data.data[i]
						}
					} else {
						this.gData = res.data.data;
						for (let i = 0; i < this.gData.length; i++) {
							this.allObj['s_' + this.gData[i].key] = this.gData[i]
						}
						if (this.tag.id == '' && this.id == '') {
							let g = this.gData.find(g => g.title == '未分组')
							this.id = g.id
							this.title = g.title
						}
					}
					this.isLoading = false;
				}
			},

			// 点击分组
			onselect (e, event) {
				if (e.length > 0 && this.id != e[0]) {
					this.id = e[0]

					let pid = event.node.dataRef.pid
					if(pid == 0) {
						this.title = event.node.dataRef.title
					} else {
						while(this.allObj['s_' + pid].pid != 0) {
							pid = this.allObj['s_' + pid].pid
						}
						this.title = this.allObj['s_' + pid].title + '--' + event.node.dataRef.title
					}
				}
			},
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
		color: #1890FF;
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
		color: #1890FF;
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
		color: #1890FF;
	}

	/deep/ li.ant-tree-treenode-disabled > .ant-tree-node-content-wrapper span {
		color: rgba(0, 0, 0, 0.65) !important;
	}
</style>