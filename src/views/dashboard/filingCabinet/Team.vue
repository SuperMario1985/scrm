<template>
	<div class="group-tree1" style="position: absolute; width: 100%; height: 100%;">
		<a-spin tip="Loading..." size="large" :spinning="isLoading">
			<div class="team-add" style="margin-top: 0px;">
				<span class="team-add-title" style="position:absolute; margin-left: 97px;">分组管理</span>
				<span style="color: #01b065;margin-left: 5px; cursor: pointer;position:absolute;margin-right: 10px; right: 10px;"
				      @click="addGroupModal('', [])" v-has="'filingCabinetTag-group-add'">
					<a-tooltip placement="bottom">
	                    <template slot="title">
	                      <span>添加分组</span>
	                    </template>
						<a-icon class="team-add-icon" type="plus" @click="addGroupModal('', [])"></a-icon>
					</a-tooltip>
				</span>
			</div>
			<div style="position: absolute; width: 100%; overflow: auto; white-space: nowrap;"
			     class="store-team">
				<div style="margin-bottom: 6px;">
					<div @click="clickAll" style="display: inline-block;margin-left: 30px;cursor: pointer"
					     :class="id== '' ? 'active': ''">所有
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
						:load-data="onLoadData"
				>
					<template slot="custom" slot-scope="{title,key, pid_all, count}">
						<div style="min-width: 100%;" @mouseover="showMoreIcon(key)">
							<div style="display: inline-block;" :class="key== id ? 'active': ''">{{title}}
							</div>
							<div style="display: inline-block;color: #C3C3C3;">（{{count}}）</div>
							<a-popover v-if="key == mouseOverId && title != '未分组'"
							           placement="right"
							           trigger="hover"
							>
								<template slot="content">
									<div @mouseover="clearLeave" @mouseleave="hideMoreIcon1">
										<p class="operation" @click="addGroupModal(key)"
										   v-has="'filingCabinetTag-group-create'">
											创建子分组</p>
										<p class="operation" @click="editGroupName(key, title)"
										   v-has="'filingCabinetTag-group-edit'">
											编辑分组</p>
										<p class="operation2" v-if="delFlag"
										   @click="removeGroup(key, title, count)"
										   v-has="'filingCabinetTag-group-del'">删除分组</p>
										<p class="operation1" v-if="!delFlag" v-has="'filingCabinetTag-group-del'">删除分组</p>
									</div>
								</template>
								<img src="../../../assets/more.png" @mouseover="lookOperation(key)" v-if="hasPermission"
								     style="position:absolute; margin-top: 2px; margin-right: 5px;"
								     :style="{'right':'-'+ getClientWidth + 'px'}">
							</a-popover>
						</div>
					</template>
				</a-tree>
			</div>
		</a-spin>
		<a-modal
				width="666px!important;"
				:title="groupTitle"
				:destroyOnClose='true'
				:visible="visible"
				@ok="handleOk"
				:confirmLoading="confirmLoading"
				@cancel="handleCancel"
		>
			<a-form-item label="分组名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
				<div style="color: #FF562D;">提交后过滤空格</div>
				<a-input v-model="groupName"
				         placeholder="请输入分组名(不得超过15个字符)" :maxLength="15">
					<span slot="suffix">
						<span>{{groupName.length}}</span>/15
					</span>
				</a-input>
			</a-form-item>
			<a-form-item v-has="'filingCabinetTag-add'" v-if="!editGroupId" label="标签名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
				<diyInput :maxLength="15" style="border: 1px solid #E2E2E2;" key="equalKeyword" @func="getTags" :msg="tagName"
				          placeholder="请输入标签名称，按回车键可输入多个标签"></diyInput>
			</a-form-item>
		</a-modal>
	</div>
</template>

<script>
	import diyInput from '../../../components/InputRecommended'

	export default {
		name   : "Team",
		components: {diyInput},
		props  : {},
		data () {
			let corpId =
				localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				isLoading          : false,
				corpId             : corpId,
				id                 : '', //点击的id
				defaultName        : '', // 未分组的name
				defaultId          : '', // 未分组的id
				editId             : '', // 添加标签的默认分组id
				editName           : '', // 添加标签的默认分组名
				currentId          : '', // 移动的id
				parentId           : '', // 加载子分组的父ID
				gData              : [], // 树状图数据
				groupData          : [], // 下一级分组数据
				tagName            : [], // 添加分组的标签名称
				tagNameTitle       : '',
				groupName          : '', // 添加分组名称
				groupTitle         : '',  // 分组弹窗标题
				visible            : false, // 分组弹窗是否显示
				confirmLoading     : false, // 分组弹窗确认按钮loading
				editGroupId        : '', // 编辑分组 id
				count              : '', // 所有分组数量
				delFlag            : false, // 是否允许删除
				mouseOverId        : "",  // 鼠标所在分组显示更多操作图标
				timeout            : '',  // 更多操作延迟隐藏事件
				getClientWidth     : '0', // x轴滚动条偏移量
				allObj             : [], // 所有对象的引用地址
				loading            : false,
				hasPermission      : true // 是否有操作分组的权限
			}
		},
		mounted () {
			this.isLoading = true
			this.getGroupList();
			window.document.getElementsByClassName("store-team")[0].addEventListener('scroll', this.handleScroll)
			if (localStorage.getItem('isMasterAccount') == 2) {
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				if (permissionButton.indexOf('filingCabinetTag-group-create') != -1 || permissionButton.indexOf('filingCabinetTag-group-edit') != -1 || permissionButton.indexOf('filingCabinetTag-group-del') != -1) {
					this.hasPermission = true
				} else {
					this.hasPermission = false
				}
			}
		},
		methods: {
			handleScroll () {
				//变量scrollTop是滚动条滚动时，距离左边的距离
				this.getClientWidth = document.getElementsByClassName("store-team")[0].scrollLeft;
			},
			// 点击所有
			clickAll () {
				this.id = ''
				this.editId = this.defaultId
				this.editName = this.defaultName
				this.$emit("changeGroupId", this.corpId, this.id, this.editId, this.editName)
			},
			// 分组操作
			lookOperation (key) {
				let that = this
				that.delFlag = this.allObj['s_' + key].isLeaf
			},
			// 展示竖三点图标
			showMoreIcon (key) {
				clearTimeout(this.timeout)
				this.mouseOverId = key
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
			removeGroup (key, title, count) {
				this.mouseOverId = ''
				let that = this;
				that.$confirm({
					title     : "【" + title + "】一旦删除，归属于该分组的标签都将被移至【未分组】，确定删除分组吗?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delGroup(key, count);
					}
				});
			},
			// 删除分组
			async delGroup (key, count) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-attachment-tag/add-group", {
					uid    : localStorage.getItem('uid'),
					id     : key,
					corp_id: this.corpId,
					status : 0
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.$message.destroy()
					this.$message.success("删除成功")
					let fpid = this.allObj['s_' + key].pid
					if (fpid != 0) {
						this.allObj['s_' + fpid].children.splice(this.allObj['s_' + fpid].children.findIndex(c => c.id == key), 1)
						if (this.allObj['s_' + fpid].children.length == 0) {
							this.allObj['s_' + fpid].isLeaf = true
						}
						while (fpid != 0) {
							this.allObj['s_' + fpid].count = this.allObj['s_' + fpid].count - count
							fpid = this.allObj['s_' + fpid].pid
						}
					} else {
						this.gData.splice(this.gData.findIndex(g => g.id == key), 1)
					}
					let notGroup = this.gData.find(g => g.title == '未分组')
					notGroup.count = notGroup.count + count
					this.gData = [...this.gData]
					this.allObj = []
					this.loopAllObj(this.gData)
					if (this.id == key) {
						this.id = ''
						this.editId = this.defaultId
						this.editName = this.defaultName
					}
					this.$emit("changeGroupId", this.corpId, this.id, this.editId, this.editName)
					this.isLoading = false
				}
			},
			getTags (list, title) {
				this.tagNameTitle = title.replace(/\s+/g, '')
				this.tagName = []
				for(let i = 0; i < list.length; i++) {
					this.tagName.push(list[i].replace(/\s+/g, ''))
				}
			},
			// 提交分组
			handleOk () {
				this.addGroup()
			},
			// 添加、编辑分组
			async addGroup () {
				this.isLoading = true
				if (!this.groupName.trim()) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.warning("分组名不能为空")
					return false
				}
				if (this.groupName == '未分组') {
					this.isLoading = false
					this.$message.destroy()
					this.$message.warning("分组名不能为“未分组”，请更换名称！")
					return false
				}
				let tagName = JSON.parse(JSON.stringify(this.tagName))
				if(typeof this.tagNameTitle != 'undefined' && this.tagNameTitle.trim() != '') {
					tagName.push(this.tagNameTitle.trim())
				}
				let groupName = this.groupName.replace(/\s+/g, '')
				const {data: res} = await this.axios.post("work-attachment-tag/add-group", {
					id        : this.editGroupId,
					uid       : localStorage.getItem('uid'),
					pid       : this.parentId,
					tag_name  : tagName,
					group_name: groupName,
					corp_id   : this.corpId,
					status    : 1,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					if (this.editGroupId) {
						// 编辑 修改名称
						this.allObj['s_' + this.editGroupId].title = this.groupName.replace(/\s+/g, '')
						this.$message.destroy()
						this.$message.success("修改成功")
					} else {
						let group = {
							count      : 0,
							id         : res.id.toString(),
							isLeaf     : true,
							key        : res.id.toString(),
							pid        : this.parentId || '0',
							scopedSlots: {
								title: "custom"
							},
							title      : groupName
						}
						if (this.parentId == '') {
							// 增加一级分组
							this.gData.push(group)
							this.allObj['s_' + res.id] = this.gData[this.gData.length - 1]
						} else {
							if (this.allObj['s_' + group.pid] && this.allObj['s_' + group.pid]['children']) {
								this.allObj['s_' + group.pid].children.push(group)
							} else {
								let a = []
								a.push(group)
								this.allObj['s_' + group.pid]['children'] = a
								this.allObj['s_' + group.pid].isLeaf = false
							}
							this.allObj['s_' + group.pid].isLeaf = false
							this.allObj['s_' + res.id] = this.allObj['s_' + group.pid].children[this.allObj['s_' + group.pid].children.length - 1]
						}
						this.gData = [...this.gData]
						this.allObj = []
						this.loopAllObj(this.gData)
						this.updateCount([], res.new_pid, tagName.length)
						this.$message.destroy()
						this.$message.success("添加成功")
					}
					this.$emit('changeGroupId', this.corpId, this.id, this.editId, this.editName)
					// this.getGroupList()
					this.groupName = ''
					this.tagName = []
					this.tagNameTitle = ''
					this.editGroupId = ''
					this.visible = false
					this.isLoading = false
				}
			},
			// 关闭分组弹窗
			handleCancel () {
				this.groupName = ''
				this.tagName = []
				this.tagNameTitle = ''
				this.editGroupId = ''
				this.visible = false
			},
			// 定义引用地址
			loopAllObj (data) {
				let that = this
				data.forEach((item2) => {
					that.allObj['s_' + item2.id] = item2
					if (item2.children && item2.children.length > 0 && !item2.isLeaf) {
						return that.loopAllObj(item2.children)
					}
				})
			},
			// 父分组加载子分组
			onLoadData (treeNode) {
				return new Promise(resolve => {
					Promise.all([
						this.getGroupList(treeNode.dataRef.key)
					]).then(res => {
						treeNode.dataRef.children = this.groupData;
						// let a = this.gData
						this.gData = [...this.gData];
						this.allObj = []
						this.loopAllObj(this.gData)
						// a = []
						resolve();
					}).catch(e => {
					})
				});
			},
			// 获取分组
			async getGroupList (parentId, parent_key = '') {
				const {data: res} = await this.axios.post("work-attachment-tag/get-group-list", {
					uid      : localStorage.getItem('uid'),
					corp_id  : this.corpId,
					parent_id: parentId ? parentId : this.id
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
						// 一级分组数据
						this.gData = res.data.data;
						for (let i = 0; i < this.gData.length; i++) {
							this.allObj['s_' + this.gData[i].key] = this.gData[i]
							if (this.gData[i].title == '未分组') {
								this.defaultName = '未分组'
								this.defaultId = this.gData[i].id
								this.editName = '未分组'
								this.editId = this.gData[i].id
							}
						}
						this.count = res.data.count
						this.$emit('changeGroupId', this.corpId, this.id, this.editId, this.editName)
					}
					this.isLoading = false;
				}
			},

			// 点击分组
			onselect (e, event) {
				if (e.length > 0 && this.id != e[0]) {
					this.id = e[0]
					this.editId = e[0]
					let pid = event.node.dataRef.pid
					if(pid == 0) {
						this.editName = event.node.dataRef.title
					} else {
						while(this.allObj['s_' + pid].pid != 0) {
							pid = this.allObj['s_' + pid].pid
						}
						this.editName = this.allObj['s_' + pid].title + '--' + event.node.dataRef.title
					}
					this.$emit("changeGroupId", this.corpId, this.id, this.editId, this.editName)
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
				this.isLoading = true
				/**
				 *    移动的分组 info.dragNode
				 *    移动后的分组 info.node
				 **/
				if(!info.dragNode || !info.node) {
					this.isLoading = false
					return false
				}
				const dropPos = info.node.pos.split('-')
				const dragItem = info.dragNode.dataRef
				const dropItem = info.node.dataRef
				const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
				const data = JSON.parse(JSON.stringify(this.gData))
				let parentId = ''
				let groupList = []
				let count = dragItem.count
				let index = 0
				if (!info.dropToGap) {
					// Drop on the content
					groupList = JSON.parse(JSON.stringify(dropItem.children || []))
					groupList.splice(0, 0, dragItem);
					parentId = dropItem.id
				} else if (  // 某个空分组添加分组
					info.node.isLeaf // Has children
					&& info.node.expanded // Is expanded
					&& dropPosition === 1 // On the bottom gap
				) {
					let item = JSON.parse(JSON.stringify(dropItem))
					item['children'] = item.children || [];
					// item.key 该分组id
					parentId = item.key
					item.children.unshift(dragItem);
					groupList = item.children
				} else { //移动到别的分组
					let ar;
					let i;
					if (dropItem.pid == 0) {
						ar = JSON.parse(JSON.stringify(data))
					} else {
						ar = JSON.parse(JSON.stringify(this.allObj['s_' + dropItem.pid].children))
					}
					let idx = ar.findIndex(a=> a.key == dragItem.id)
					if(idx > -1) {
						ar.splice(idx, 1)
					}
					i = ar.findIndex(a => a.key == dropItem.key)
					parentId = dropItem.pid == 0 ? '' : dropItem.pid
					// 移动到某个分组有排序 ar该分组下加上移动的children数据
					if (ar.length > 0) {
						// let idx = ar.findIndex(a => a.key == dragItem.key)
						// ar.splice(idx, 1)
						if (dropPosition === -1) {
							ar.splice(i, 0, dragItem);
							groupList = ar
							index = i
						} else {
							ar.splice(i + 1, 0, dragItem);
							groupList = ar
							index = i + 1
						}
					}
				}
				var flag = false
				for (let i = 0; i < this.gData.length; i++) {
					if (this.gData[i].title == '未分组') {
						if (parentId == this.gData[i].key) {
							this.$message.destroy()
							this.$message.warning(this.gData[i].title + "不可加入其他分组！")
							this.isLoading = false
							flag = true
						} else {
							if (parentId != '') {
								groupList.forEach((item) => {
									if (item.key == this.gData[i].key) {
										this.$message.destroy()
										this.$message.warning(this.gData[i].title + "不可移入其他分组！")
										this.isLoading = false
										flag = true
									}
								})
							}
						}
					}
				}
				if (flag) {
					this.isLoading = false
					return false
				}
				let groupIdList = []
				if (groupList && groupList.length > 0) {
					groupList.forEach((item) => {
						groupIdList.push(item.key)
					})
				}
				this.moveGroup(parentId, groupIdList, count, dragItem.key, index)
			},
			/**
			 *      移动分组请求接口
			 *      parentId String 移动后的父id
			 *      groupIdList Array 移动后当前父组件的子组件列表，有排序的
			 *      count Interger 移动组件的count
			 *      key String 移动组件的key
			 *      oldAllId Array 组件移动前的所有父组件id
			 *      newAllId Array 组件移动后的所有父组件id及自身
			 *      index Interger 组件移动后新的父组件的children位置
			 * */
			async moveGroup (parentId, groupIdList, count, key, index) {
				const {data: res} = await this.axios.post("work-attachment-tag/group-sort", {
					uid      : localStorage.getItem('uid'),
					parent_id: parentId,
					group_id : this.currentId,
					sort     : groupIdList,
					corp_id  : this.corpId
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.move (parentId, count, key, index)
					this.$emit("changeGroupId", this.corpId, this.id, this.editId, this.editName)
					this.isLoading = false
				}
			},
			move (parentId, count, key, index) {
				let fpid = parentId
				// 移动后的所有父分组count改变
				if (fpid != 0) {
					this.allObj['s_' + fpid]['children'] = this.allObj['s_' + fpid]['children'] || []
					this.allObj['s_' + fpid].isLeaf = false
					while (fpid != 0) {
						this.allObj['s_' + fpid].count = this.allObj['s_' + fpid].count + count
						fpid = this.allObj['s_' + fpid].pid
					}
				}
				fpid = this.allObj['s_' + key].pid
				// 移动分组后父分组count改变，改变分组pid，分组及子分组的引用地址重新定义 区分移动前后是不是一级分组
				if (fpid != 0) {
					let newChild = {}
					let childrens = this.allObj['s_' + fpid].children
					let idx = childrens.findIndex(c => c.id == key)
					newChild = JSON.parse(JSON.stringify(childrens[idx]))
					childrens.splice(idx, 1)
					// 分组改变位置
					if (parentId) {
						newChild.pid = parentId
						this.allObj['s_' + parentId].children.splice(index, 0, newChild)
					} else {
						newChild.pid = '0'
						this.gData.splice(index, 0, newChild)
					}
					this.loopAllObj([newChild])
					if (this.allObj['s_' + fpid].children.length == 0) {
						this.allObj['s_' + fpid].isLeaf = true
					}
					while (fpid != 0) {
						this.allObj['s_' + fpid].count = this.allObj['s_' + fpid].count - count
						fpid = this.allObj['s_' + fpid].pid
					}
				} else {
					let idx = this.gData.findIndex(g => g.id == key)
					let child = JSON.parse(JSON.stringify(this.gData[idx]))
					this.gData.splice(idx, 1)
					if (parentId) {
						child.pid = parentId
						this.allObj['s_' + parentId].children.splice(index, 0, child)
						this.allObj['s_' + parentId].isLeaf = false
					} else {
						child.pid = '0'
						this.gData.splice(index, 0, child)
					}
					this.loopAllObj([child])
				}

				this.gData = [...this.gData]
				this.allObj = []
				this.loopAllObj(this.gData)
			},
			updateMoreCount (oldPid, count) {
				this.count = this.count - count
				let keys = Object.keys(oldPid)
				for (let key of keys) {
					this.deleteCount([key], oldPid[key])
				}
			},
			// 批量删除改变count
			deleteCount (oldPid = [], count = 1) {
				this.isLoading = true
				if (oldPid.length != 0) {
					for (let i = 0; i < oldPid.length; i++) {
						if (this.allObj['s_' + oldPid[i]]) {
							this.allObj['s_' + oldPid[i]].count -= count
						}
					}
				}
				this.isLoading = false
			},
			otherUserMove (group_id, parentId, sort) {
				this.isLoading = true
				let count = this.allObj['s_' + group_id].count
				let keys = Object.keys(sort)
				let index = 0
				for (let i = 0; i < keys.length; i++) {
					if (sort[i] == group_id) {
						index = i
					}
				}
				this.move(parentId, count, group_id, index)
				this.isLoading = false
			},
			// 删除、编辑、添加门店改变count
			updateCount (oldPid = [], newPid = [], count = 1) {
				this.isLoading = true
				if (oldPid.length != 0) {
					for (let i = 0; i < oldPid.length; i++) {
						if (this.allObj['s_' + oldPid[i]]) {
							this.allObj['s_' + oldPid[i]].count -= count
						}
					}
					this.count -= count
				}
				if (newPid != '') {
					for (let i = 0; i < newPid.length; i++) {
						if (this.allObj['s_' + newPid[i]]) {
							this.allObj['s_' + newPid[i]].count += count
						}
					}
					this.count += count
				}

				this.isLoading = false
			},
			// 批量添加count
			updateBatchAddCount (arr) {
				for (let i = 0; i < arr.length; i++) {
					arr[i].pid_all.push(arr[i].store)
					this.updateCount([], arr[i].pid_all, arr[i].num)
				}
			},
			// 移动时批量增加及减少
			updateBatchMoveCount (arr) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].old_pid_all.length != 0) {
						arr[i].old_pid_all.push(arr[i].store_old)
					}
					arr[i].pid_all.push(arr[i].store)
					this.updateCount(arr[i].old_pid_all, arr[i].pid_all, arr[i].num)
				}
			},
			// 删除count
			updateBatchDelCount (arr) {
				for (let i = 0; i < arr.length; i++) {
					arr[i].pid_all.push(arr[i].store)
					this.updateCount(arr[i].pid_all, [], arr[i].num)
				}
			}
		}
	}
</script>

<style scoped>
	.store-team {
		height: calc(100% - 50px);
	}

	.user-team {
		height: 100%;
		padding-top: 17px;
	}

	.group-tree1 /deep/ .ant-spin-nested-loading {
		height: 100%;
	}

	.group-tree1 /deep/ .ant-spin-container {
		height: 100%;
	}

	.tab {
		width: 50%;
		display: inline-block;
		text-align: center;
		height: 40px;
		line-height: 40px;
	}

	.active {
		/*background-color: #01b065;*/
		color: #01b065;
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
</style>