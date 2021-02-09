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
			<div @click="clickAll" style="display: inline-block;margin-left: 30px;cursor: pointer"
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
				:treeData="gData" v-has="'content-list'"
		>
			<template slot="custom" slot-scope="{title,key, num, is_not_group, is_move_type, channel_type}">
				<div style="min-width: 100%;" @mouseover="showMoreIcon(key)">
					<div style="display: inline-block;" :class="key== id ? 'active': ''">{{title}}</div>
					<div style="display: inline-block;color: #C3C3C3;">（{{num}}）</div>
					<a-popover
							v-if="key == mouseOverId && is_not_group != 1 && is_move_type != 1 && is_move_type != 4 && is_move_type !=5 && isShowPop"
							placement="right"
							trigger="hover"
					>
						<template slot="content">
							<div @mouseover="clearLeave" @mouseleave="hideMoreIcon1">
								<p class="operation" v-if="is_move_type != 1" @click="addGroupModal(key)"
								   v-has="'material-group-add'">创建子分组</p>
								<p class="operation" v-if="is_move_type != 1 && is_move_type != 2 && is_move_type != 3"
								   @click="editGroupName(key, title)" v-has="'material-group-edit'">编辑分组</p>
								<p class="operation2" v-if="delFlag && is_move_type != 2 && is_move_type != 3"
								   @click="removeGroup(key, title, channel_type)" v-has="'material-group-delete'">删除分组</p>
								<p class="operation1" v-if="!delFlag && is_move_type != 2 && is_move_type != 3"
								   v-has="'material-group-delete'">删除分组</p>
							</div>
						</template>
						<img src="../../assets/more.png" @mouseover="lookOperation(key)"
						     style="position:absolute; margin-top: 2px; margin-right: 5px;"
						     :style="{'right':'-'+ getClientWidth + 'px'}">
						<!--						<a-icon type="upload" class="more-operation" @mouseover="lookOperation(key)" style="float: right; margin-right: 5px;" />-->
					</a-popover>
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
				isShowPop     : true,
			}
		},
		created () {
			if(localStorage.getItem('permissionButton') == 'all'){
				this.isShowPop = true
			}else {
				let permissionButton = JSON.stringify(localStorage.getItem('permissionButton')).split(',')
				if(permissionButton.indexOf('material-group-add') == -1 && permissionButton.indexOf('material-group-edit') == -1 && permissionButton.indexOf('material-group-delete') == -1){
					this.isShowPop = false
				}
			}
			if (this.$route.query.g) {
				this.id = this.$route.query.g
			}
		},
		mounted () {
			this.getGroupList()
			window.document.getElementsByClassName("group-tree1")[0].addEventListener('scroll', this.handleScroll);
		},
		methods: {
			handleScroll () {
				//变量scrollTop是滚动条滚动时，距离左边的距离
				this.getClientWidth = document.getElementsByClassName("group-tree1")[0].scrollLeft;
			},
			clickAll () {
				this.id = 0
				this.$emit("changeGroupId", [], "")
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
			removeGroup (key, title, channel_type) {
				this.mouseOverId = ''
				let that = this;
				that.$confirm({
					title     : "【" + title + "】一旦删除，归属于该分组的资料都将被移至【未分组】，确定删除分组吗?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delGroup(key, channel_type);
					}
				});
			},
			async delGroup (key,channel_type) {
				const {data: res} = await this.axios.post("attachment/group-del", {
					uid     : localStorage.getItem('uid'),
					group_id: key,
					status  : 0,
					channel_type : channel_type
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
				let is_move_type = ""
				loop(this.gData, key, (item) => {
					is_move_type = item.is_move_type != 0 ? item.is_move_type : ""
					if (item.children) {
						loop1(item.children, ids, (ids) => {
						})
					}
				})
				this.$emit("changeGroupId", ids, is_move_type)
			},
			// 获取分组
			async getGroupList () {
				const {data: res} = await this.axios.post("attachment/group", {
					uid: localStorage.getItem('uid')
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
						this.$emit('changeGroupId', [], "")
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
				let that = this
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
					let j;
					let data1;
					loop(data, dropKey, (item, index, arr, parentKey) => {
						ar = arr;
						parentId = parentKey  // 移动到别的分组时的父id
						j = index;
					});
					// 移动到某个分组有排序 ar改分组下加上移动的children数据
					if (dropPosition === -1) {
						ar.splice(j, 0, dragObj);
						groupList = ar
					} else {
						ar.splice(j + 1, 0, dragObj);
						groupList = ar
					}
				}
				let flag = false
				// 渠道码、最外面未分组不可移到别的分组或移入分组
				for(let i = 0; i < this.gData.length; i++) {
					if(this.gData[i].is_not_group == 1) {
						if(parentId == this.gData[i].key) {
							that.$message.warning(that.gData[i].title + "不可加入其他分组！")
							flag = true
						} else {
							if(parentId != '') {
								groupList.forEach((item) => {
									if(item.key == that.gData[i].key) {
										this.$message.warning(that.gData[i].title + "不可移入其他分组！")
										flag = true
										return false
									}
								})
							}
						}
					}
					if(this.gData[i].is_move_type == 1) {
						if(parentId == this.gData[i].key) {
							groupList.forEach((item) => {
								if(item.is_move_type != 2 && item.is_move_type != 3 ) {
									that.$message.warning(that.gData[i].title + "不可加入其他分组！")
									flag = true
									return false
								}
							})
						} else {
							if(parentId != '') {
								groupList.forEach((item) => {
									if(item.key == that.gData[i].key) {
										this.$message.warning(that.gData[i].title + "不可移入其他分组！")
										flag = true
										return false
									}
								})
							}
						}
					}
				}
				if (flag) {
					return false
				}
				// 查询key的对象
				const loop3 = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.key === key) {
							return callback(item2)
						}
						if (item2.children) {
							return loop3(item2.children, key, callback)
						}
					})
				}
				if (flag) {
					return false
				}
				loop3(that.gData, parentId, (item) => {
					if(item.is_move_type == 4 || item.is_move_type == 5) {
						that.$message.warning(item.title + "不可加入其他分组！")
						flag = true
						return false
					}
				})
				if (flag) {
					return false
				}
				for (let group of groupList) {
					loop3(that.gData, group.key, (item) => {
						if (item.is_move_type == 2 || item.is_move_type == 3) {
							for (let d of that.gData) {
								if (d.is_move_type == 1) {
									if (d.key != parentId) {
										that.$message.warning(item.title + "不可移入其他分组！")
										flag = true
										return false
									}
								}
							}
						}
						if (item.is_move_type == 4 || item.is_move_type == 5) {
							that.gData.forEach((d1) => {
								if (d1.is_move_type == 1) {
									d1.children.forEach((wx) => {
										if (item.is_move_type == 4) {
											if (wx.is_move_type == 2) {
												if (wx.key != parentId) {
													that.$message.warning(item.title + "不可移入其他分组！")
													flag = true
													return false
												}
											}
										} else if (item.is_move_type == 5) {
											if (wx.is_move_type == 3) {
												if (wx.key != parentId) {
													that.$message.warning(item.title + "不可移入其他分组！")
													flag = true
													return false
												}
											}
										}

									})
								}
							})
						}
					});
				}
				if (flag) {
					return false
				}
				loop3(that.gData, parentId, (item) => {
					if(item.is_move_type) {
						groupList.forEach(data => {
							if(!data.is_move_type) {
								that.$message.warning("不可移入至渠道码分组")
								flag = true
								return false
							}
						})
					}

				})
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
		color: #1890FF;
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
</style>