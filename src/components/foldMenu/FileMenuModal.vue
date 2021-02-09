<template>
	<div class="group-tree1" style="position: absolute; width: 100%; height: 100%; overflow: auto;">
		<div class="team-add" style="">
			<span class="team-add-title" style="position:absolute;" :style="{'left': getClientWidth + 'px'}">分组管理</span>
			<span style="color: #01b065;margin-left: 5px; cursor: pointer;position:absolute;margin-right: 5px;"
			      :style="{'right':'-'+ getClientWidth + 'px'}"
			      @click="addGroupModal('')" v-has="'content-add'"><a-icon class="team-add-icon" type="plus"
			                                                               @click="addGroupModal('')"></a-icon>添加分组</span>

		</div>
		<div style="margin-bottom: 6px;">
			<div @click="clickAll" style="display: inline-block;margin-left: 30px;cursor: pointer;"
			     :class="id== 0 ? 'active': ''">所有
			</div>
			<div style="display: inline-block;color: #C3C3C3;">（{{count}}）</div>
		</div>
		<a-tree
				class="draggable-tree"
				draggable
				@dragenter="onDragEnter"
				@mouseleave="hideMoreIcon"
				@drop="onDrop"
				@dragstart="dragstart"
				@select="onselect"
				:treeData="gData"
		>
			<template slot="custom" slot-scope="{title,key, num, is_not_group}">
				<div style="min-width: 100%;">
					<div style="display: inline-block;" :class="key== id ? 'active': ''">{{title}}</div>
					<div style="display: inline-block;color: #C3C3C3;">（{{num}}）</div>
				</div>
			</template>
		</a-tree>

		<a-modal
				:title="groupTitle"
				:destroyOnClose='true'
				:visible="visible"
				@ok="handleOk"
				:confirmLoading="confirmLoading"
				@cancel="handleCancel"
		>
			<a-input v-model="groupName"
			         placeholder="请输入分组名(不得超过15个字符)" :maxLength="15">
				<span slot="suffix">
					<span>{{groupName.length}}</span>/15
				</span>
			</a-input>
			<!--			<a-input placeholder="请输入分组名(不得超过15个字符)" :maxLength="15" v-model="groupName"></a-input>-->
		</a-modal>
	</div>
</template>

<script>
	export default {
		props  : {
			comefrom: {
				type   : String,
				default: '0',
			},
			fileType: {
				type   : Number,
				default: 1
			}
		},
		data () {
			return {
				id            : '', //点击的id
				currentId     : '', // 移动的id
				parentId      : '',
				gData         : [],
				groupName     : '',
				groupTitle    : '',
				visible       : false,
				confirmLoading: false,
				editGroupId   : '',
				count         : '',
				hovered       : false,
				delFlag       : false,
				mouseOverId   : "",
				timeout       : '',
				getClientWidth: '0',
			}
		},
		created () {
			this.getGroupList()
		},
		mounted () {
			window.document.getElementsByClassName("group-tree1")[0].addEventListener('scroll', this.handleScroll);
		},
		methods: {
			handleScroll () {
				//变量scrollTop是滚动条滚动时，距离左边的距离
				this.getClientWidth = document.getElementsByClassName("group-tree1")[0].scrollLeft;
			},
			clickAll () {
				this.id = 0
				this.$emit("changeGroupId", [])
			},
			// 分组操作
			lookOperation (key) {
				let that = this
				this.hovered = true
				// 查询key的对象
				const loop = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.key === key) {
							return callback(item2)
						}
						if (item2.children) {
							return loop(item2.children, key, callback)
						}
					})
				}
				loop(this.gData, key, (item) => {
					if (item.children && item.children.length > 0) {
						that.delFlag = false
					} else {
						that.delFlag = true
					}
				})
			},
			// 展示竖三点图标
			showMoreIcon (key) {
				if (!isNaN(key)) {
					clearTimeout(this.timeout)
					this.mouseOverId = key
				}
			},
			// 鼠标进入编辑新增删除分组操作框，取消隐藏图标
			clearLeave () {
				clearTimeout(this.timeout)
			},
			// 鼠标离开tree
			hideMoreIcon () {
				let that = this
				this.timeout = setTimeout(function () {
					that.mouseOverId = ''
				}, 300)
			},
			// 直接隐藏图标
			hideMoreIcon1 () {
				this.mouseOverId = ''
			},
			//添加分组
			addGroupModal (id) {
				this.mouseOverId = ''
				this.parentId = id
				this.editGroupId = ''
				this.groupName = ''
				this.groupTitle = '新建分组'
				this.visible = true
			},
			// 编辑分组
			editGroupName (id, title) {
				this.mouseOverId = ''
				this.parentId = ""
				this.editGroupId = id
				this.groupName = title
				this.groupTitle = '编辑分组'
				this.visible = true
			},
			// 删除分组
			removeGroup (key, title) {
				this.mouseOverId = ''
				let that = this;
				that.$confirm({
					title     : "【" + title + "】一旦删除，归属于该分组的资料都将被移至【未分组】，确定删除分组吗?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delGroup(key);
					}
				});
			},
			async delGroup (key) {
				const {data: res} = await this.axios.post("attachment/group-del", {
					uid     : localStorage.getItem('uid'),
					group_id: key,
					status  : 0
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success("删除成功")
					if (this.id == key) {
						this.id = ''
						this.getGroupList()
					} else {
						this.getGroupList()
					}

				}
			},
			// 提交分组
			handleOk () {
				this.addGroup()
			},
			async addGroup () {
				if (!this.groupName) {
					this.$message.warning("分组名不能为空")
					return false
				}
				if (this.groupName == '未分组') {
					this.$message.warning("分组名不能为“未分组”，请更换名称！")
					return false
				}
				const {data: res} = await this.axios.post("attachment/group-add", {
					group_id : this.editGroupId,
					uid      : localStorage.getItem('uid'),
					parent_id: this.parentId,
					title    : this.groupName,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (this.editGroupId) {
						this.$message.success("修改成功")
					} else {
						this.$message.success("添加成功")
					}
					this.getGroupList()
					this.groupName = ''
					this.editGroupId = ''
					this.visible = false
				}
			},
			// 关闭分组弹窗
			handleCancel () {
				this.groupName = ''
				this.editGroupId = ''
				this.visible = false
			},
			// 根据key获取该分组及所有孩子id
			getChildrenId (key) {
				let ids = []
				ids.push(key)
				// 查询key的对象
				const loop = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.key === key) {
							return callback(item2)
						}
						if (item2.children) {
							return loop(item2.children, key, callback)
						}
					})
				}
				// 获取所有children key
				const loop1 = (data, ids, callback) => {
					data.forEach((item2, index, arr) => {
						ids.push(item2.key)
						if (item2.children) {
							return loop1(item2.children, ids, callback)
						}
					})
					return callback(ids)
				}
				loop(this.gData, key, (item) => {
					if (item.children) {
						loop1(item.children, ids, (ids) => {
						})
					}
				})
				this.$emit("changeGroupId", ids)
			},
			// 获取分组
			async getGroupList () {
				const {data: res} = await this.axios.post("attachment/group", {
					uid      : localStorage.getItem('uid'),
					comefrom : this.comefrom,
					file_type: this.fileType
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.gData = res.data.group;
					this.count = res.data.count
					if (!this.id) {
						this.id = 0
						this.$emit("changeGroupId", [])
					} else {
						this.getChildrenId(this.id)
					}
				}
			},

			// 点击分组
			onselect (e, event) {
				if (e.length > 0 && this.id != e[0]) {
					this.id = e[0]
					this.getChildrenId(this.id)
				}
			},

			// 移动
			dragstart (e) {
				this.currentId = e.node.eventKey
			},
			onDragEnter (info) {
				this.expandedKeys = info.expandedKeys
			},
			onDrop (info) {
				const dropKey = info.node.eventKey
				const dragKey = info.dragNode.eventKey
				const dropPos = info.node.pos.split('-')

				const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
				const loop = (data, key, callback) => {
					let parentKey = ''
					if (data[0]) {
						data.forEach((item, index, arr) => {
							if (item.key === key) {
								return callback(item, index, arr, parentKey)
							}
							if (item.children) {
								item.children.forEach((item1, index, arr) => {
									if (item1.key === key) {
										return callback(item1, index, arr, item.key)
									}
									if (item1.children) {
										return loop(item1, key, callback)
									}
								})
							}
						})
					} else {
						data.children.forEach((item2, index, arr) => {
							if (item2.key === key) {
								return callback(item2, index, arr, data.key)
							}
							if (item2.children) {
								return loop(item2, key, callback)
							}
						})
					}

				}
				const data = JSON.parse(JSON.stringify(this.gData))
				let parentId = ''
				let groupList = []
				// Find dragObject
				let dragObj
				loop(data, dragKey, (item, index, arr) => {
					arr.splice(index, 1)
					dragObj = item
				})
				if (!info.dropToGap) {
					// Drop on the content
					loop(data, dropKey, (item, index, arr, parentkey) => {
						item.children = item.children || [];
						// where to insert 示例添加到头部，可以是随意位置
						parentId = item.key
						item.children.splice(0, 0, dragObj);
						groupList = item.children
					});
				} else if (  // 某个空分组添加分组
					(info.node.children || []).length > 0 // Has children
					&& info.node.expanded // Is expanded
					&& dropPosition === 1 // On the bottom gap
				) {
					loop(data, dropKey, (item, index, arr, parentkey) => {
						item.children = item.children || [];
						// item.key 该分组id
						parentId = item.key
						item.children.unshift(dragObj);
						groupList = item.children
					});
				} else { //移动到别的分组
					let ar;
					let i;
					let data1;
					loop(data, dropKey, (item, index, arr, parentKey) => {
						ar = arr;
						parentId = parentKey  // 移动到别的分组时的父id
						i = index;
					});
					// 移动到某个分组有排序 ar改分组下加上移动的children数据
					if (dropPosition === -1) {
						ar.splice(i, 0, dragObj);
						groupList = ar
					} else {
						ar.splice(i + 1, 0, dragObj);
						groupList = ar
					}
				}
				var flag = false
				for (let i = 0; i < this.gData.length; i++) {
					if (this.gData[i].is_not_group == 1) {
						if (parentId == this.gData[i].key) {
							this.$message.warning(this.gData[i].title + "不可加入其他分组！")
							flag = true
						} else {
							if (parentId != '') {
								groupList.forEach((item) => {
									if (item.key == this.gData[i].key) {
										this.$message.warning(this.gData[i].title + "不可移入其他分组！")
										flag = true
									}
								})
							}
						}
					}
				}
				if (flag) {
					return false
				}
				let groupIdList = []
				groupList.forEach((item) => {
					groupIdList.push(item.key)
				})
				this.moveGroup(parentId, groupIdList, data)
			},
			async moveGroup (parentId, groupIdList, data) {
				const {data: res} = await this.axios.post("attachment/group-sort", {
					uid      : localStorage.getItem('uid'),
					parent_id: parentId,
					group_id : this.currentId,
					sort     : groupIdList
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.getGroupList()
				}
			},
		},
	}
</script>

<style scoped>
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
		color: #01b065;
		margin-left: 10px;
		cursor: pointer;
		display: inline-block;
		vertical-align: initial;
	}

	.group-tree1::-webkit-scrollbar {
		width: 4px;
		height: 6px;
	}

	.group-tree1::-webkit-scrollbar-track-piece {
		background-color: #FFFFFF;
	}

	.group-tree1::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #D3D3D3;
	}

	.active {
		color: #01b065;
	}

	.operation {
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
</style>