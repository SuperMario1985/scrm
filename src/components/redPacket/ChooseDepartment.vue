<template>
	<div>
		<!--部门选择框-->
		<a-modal :visible="showModal" title="选择企业成员" @ok="handleDepartment"
		         @cancel="handleCancelDepartment" width="800px">
			<a-spin tip="加载中..." size="large" :spinning="isLoading2">
				<div style="width: 50%;height: 450px;float: left;border-right:1px solid #D9D9D9;overflow-y: auto;overflow-x: hidden;">
					<div class="content-msg" v-if="tipType == '0'">
						对拥有发放红包权限的企业员工配置发放红包限额。只有在企业微信官方后台创建自建应用时所设置的可见成员才拥有发放红包的权限。
					</div>
					<div class="content-msg" v-if="tipType == '1'">
						只展示在企业微信官方后台创建自建应用时，所设置的可见成员，只有他们才拥有接收跟进提醒的权限。
					</div>
					<div class="content-msg" v-if="tipType == '2'">
						只展示在企业微信官方后台创建自建应用时，所设置的可见成员，只有他们才拥有接收违规提醒的权限。
					</div>
					<div class="content-msg" v-if="tipType == '4'">
						当前只显示自建应用下可见范围内的成员，即可在企业微信收到添加好友的任务。
					</div>
					<div class="content-msg" v-if="tipType == '5'">
						只展示在企业微信官方后台创建自建应用时，所设置的可见成员，只有他们才拥有接收员工删人提醒的权限。
					</div>
					<div class="content-msg" v-if="tipType == '6'">
						只展示在企业微信官方后台创建自建应用时，所设置的可见成员，只有他们才拥有接收待办提醒的权限。
					</div>
					<div class="content-msg" v-if="tipType == '3'">

					</div>
					<a-input-search style="margin-bottom: 8px;width: 75%;" placeholder="搜索"
					                @change="onChange" v-model="searchVal"/>
					<div v-if="searchVisible" style="padding: 10px 10px 10px 0;">
						<a-tree
								showIcon checkable
								@expand="onExpand"
								:expandedKeys="expandedKeys"
								:autoExpandParent="autoExpandParent"
								@check="onSelect2"
								:treeData="searchValue"
								v-model="checkedKeys"
						>
							<template slot="title" slot-scope="{title,key}">
								<a-icon type="folder-open" style="margin-right: 10px;"/>
								<span>{{title}}</span>
							</template>
							<template slot="custom" slot-scope="{title}">
								<span>{{title}}</span>
							</template>
						</a-tree>
						<a-empty v-show="searchValue.length == 0"/>
					</div>
					<a-tree
							showIcon checkable
							@expand="onExpand"
							:expandedKeys="expandedKeys"
							:autoExpandParent="autoExpandParent"
							@check="onSelect"
							:treeData="departmentList"
							v-if="!searchVisible"
							v-model="checkedKeys"
					>
						<template slot="title" slot-scope="{title,key}">
							<a-icon type="folder-open" style="margin-right: 10px;"/>
							<span>{{title}}</span>
						</template>
						<template slot="custom" slot-scope="{title}">
							<span>{{title}}</span>
						</template>
					</a-tree>
					<a-empty v-show="departmentList.length == 0 && !searchVisible"/>
				</div>
				<div style="width: 50%;height: 450px;float: left;padding-left: 20px;overflow-y: auto;overflow-x: hidden;">
					<p>已选择{{this.staffList.length}}名成员</p>
					<a-list itemLayout="horizontal" :dataSource="this.staffList">
						<a-list-item slot="renderItem" slot-scope="item, index">
							<a-list-item-meta>
								<div slot="title">{{item.title}}</div>
							</a-list-item-meta>
							<a-icon type="close-circle" style="font-size: 16px;"
							        @click="clickDelete(index,item.title)"/>
						</a-list-item>
					</a-list>
				</div>
			</a-spin>
		</a-modal>
	</div>
</template>

<script>
	export default {
		name : "chooseDepartment",
		props: {
			userSendMoney : {
				type   : Number,
				default: 0   // 外部联系人
			},
			is_external : {
				type   : Number,
				default: 0   // 外部联系人
			},
			from_channel: {
				type   : Number,
				default: 0   // 1渠道活码多人
			},
			show        : {
				type   : Boolean,
				default: false
			},
			callback    : {
				type   : Function,
				default: null
			},
			disabledVal : {
				type   : Number,
				default: 0 //判断是否返回成员有没有被创建过欢迎语字段，0不返回，1返回
			},
			chooseNum   : {
				type   : Number,
				default: 0 //判断是否重置过
			},
			welcome_id  : {
				type   : Number,
				default: 0
			},
			agentid     : {
				type   : String,
				default: ''
			},
			id          : {
				type   : String,
				default: localStorage.getItem("corpId")
			},
			tipType     : {
				type   : String,
				default: '0' // 文案类型  '0' 员工管理选择成员 '1' 跟进提醒规则选择成员
			},
			followMsg   : {
				type   : Number,
				default: 0
			},
			userDel     : {  // 员工删人规则
				type   : Number,
				default: 0
			},
			remind      : {  // 待办提醒
				type   : Number,
				default: 0
			},
		},
		data () {
			return {
				corpId          : '',
				suite_id        : 1,//应用ID
				showModal       : false, //成员选择框显示与隐藏
				departmentList  : [],//成员选择列表
				isLoading2      : false,//部门弹窗Loading的显示与隐藏
				department_id   : [],//部门id
				//部门树状图
				expandedKeys    : [],
				autoExpandParent: true,
				checkedKeys     : [],
				checkedNodes    : [],
				selectedKeys    : [],
				searchVal       : '',//部门搜索框输入的值
				searchValue     : [],//部门搜索框搜索后的数据
				searchVisible   : false,//搜索与否
				staffList       : [],//部门树状图右侧成员列表
				checkedList     : [],//部门树状图右侧成员列表选中的
				checkedKeysArr  : [],//再次进入时暂时保存的左侧已选的key
				staffListArr    : [],//再次进入时暂时保存的右侧已选的key
				keyList         : [],
			};
		},

		methods: {
			//部门树状图搜索
			onChange (e) {
				const value = e.target.value;
				if (value != '') {
					this.searchVisible = true
					this.searchValue = []
				} else {
					this.searchVisible = false
					this.expandedKeys = []
					this.checkedKeys = []
					this.checkedKeys = JSON.parse(JSON.stringify(this.checkedNodes))
					/*this.keyList.map(x => {
						this.checkedKeys.push(x.key)
					})*/

					if (typeof this.departmentList[0] != 'undefined' && typeof this.departmentList[0].children != 'undefined' && typeof this.departmentList[0].children[0] != 'undefined' && typeof this.departmentList[0].children[0].key != 'undefined') {
						this.expandedKeys.push(this.departmentList[0].children[0].key)
					}
				}
				let objs = []
				const loop = (data, objs, s) => {
					data.forEach((item) => {
						if (item.title.indexOf(s) > -1) {
							let obj = {
								key        : item.key,
								title      : item.title,
								scopedSlots: {title: item.scopedSlots.title},
								children   : item.children
							}
							objs.push(obj)
						} else {
							if (item.children) {
								return loop(item.children, objs, s)
							}
						}
					})
					return objs
				}
				var arr = loop(this.departmentList, objs, value)
				for (var i = 0; i < arr.length; i++) {
					for (var j = i + 1; j < arr.length; j++) {
						if (arr[i].title == arr[j].title) {
							arr.splice(j, 1);
							j--;
						}
					}
				}
				this.searchValue = arr
			},
			async getDepartmentList () {
				this.departmentList = []
				const {data: res} = await this.axios.post("send-money-manage/get-select-department", {
					welcome_id  : this.welcome_id,
					suite_id    : this.suite_id,
					corp_id     : this.corpId,
					disabled    : this.disabledVal,
					from_channel: this.from_channel,
					get_users   : 1,
					parentId    : this.department_id,
					agentid     : this.agentid,
					followMsg   : this.followMsg,
					userDel     : this.userDel,
					remind      : this.remind,
					is_external : this.is_external,
					userSendMoney:this.userSendMoney
				});
				if (res.error != 0) {
					this.isLoading2 = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.departmentList = res.data;
					if (typeof this.departmentList[0] != 'undefined' && typeof this.departmentList[0].children != 'undefined' && typeof this.departmentList[0].children[0] != 'undefined' && typeof this.departmentList[0].children[0].key != 'undefined') {
						this.expandedKeys.push(this.departmentList[0].children[0].key)
					}
					if (this.chooseNum == 0) {
						//重置过进入
						// this.expandedKeys = []
						this.autoExpandParent = true
						this.checkedKeys = []
						this.selectedKeys = []
						this.searchValue = []
						this.staffList = []
						this.checkedKeys = []
						this.keyList = []
					} else {
						this.staffList = JSON.parse(JSON.stringify(this.staffListArr))
					}
					this.isLoading2 = false;
				}
			},
			onExpand (expandedKeys) {
				this.expandedKeys = expandedKeys
				this.autoExpandParent = false
			},
			//确定
			handleDepartment () {
				this.showModal = false
				var arr = []
				this.staffList.map(x => {
					arr.push(x.id)
				})
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("ok", arr, this.staffList.length, this.keyList);
				}
				this.checkedKeysArr = this.checkedKeys
				this.staffListArr = this.staffList
			},
			//取消
			handleCancelDepartment () {
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("cancel");
				}
				// this.expandedKeys = []
				// this.autoExpandParent = true
				// this.checkedKeys = []
				// this.selectedKeys = []
				this.showModal = false
				this.searchVal = ''
				this.searchVisible = false
				this.searchValue = []
				this.staffList = this.staffListArr
				this.checkedKeys = this.checkedKeysArr
			},
			//部门树状图右侧成员
			onSelect (selectedKeys, e) {
				this.checkedNodes = []
				if (e.checkedNodes.length > 0) {
					e.checkedNodes.map((checkedNode) => {
						this.checkedNodes.push(checkedNode.key)
					})
				}
				this.staffList = []
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
						// ids.push(item2.key)
						if (item2.children) {
							return loop1(item2.children, ids, callback)
						}
					})
					return callback(ids)
				}
				selectedKeys.map(x => {
					loop(this.departmentList, x, (item) => {
						if (item.scopedSlots.title == 'custom') {
							this.staffList.push(item)
						}
						if (item.children) {
							loop1(item.children, x, (ids) => {
							})
						}
					})
				})
				this.keyList = JSON.parse(JSON.stringify(this.staffList))
				for (var i = 0; i < this.staffList.length; i++) {
					for (var j = i + 1; j < this.staffList.length; j++) {
						if (this.staffList[i].id == this.staffList[j].id) {
							if (this.keyList[i].key.indexOf(this.keyList[j].key) >= 0) {

							} else if (this.keyList[j].key.indexOf(this.keyList[i].key) >= 0) {
								this.keyList[i].key = this.keyList[j].key
							} else {
								this.keyList[i].key += "," + this.keyList[j].key
							}
							this.staffList.splice(j, 1);
							this.keyList.splice(j, 1);
							j--;
						}
					}
				}
			},
			onSelect2 (selectedKeys, e) {
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
					data.forEach((item2) => {
						ids.push(item2.key)
						if (item2.children) {
							return loop1(item2.children, ids, callback)
						}
					})
					return callback(ids)
				}
				if (e.checked) {
					if (e.node.eventKey.split('-').length == 2) {
						this.checkedNodes.push(e.node.eventKey)
					} else {
						let checkedNode = []
						loop(this.searchValue, e.node.eventKey, (item) => {
							if (item.children.length > 0) {
								loop1(item.children, [e.node.eventKey], (ids) => {
									checkedNode = ids
								})
							}
						})

						if (checkedNode.length > 0) {
							this.checkedNodes = this.checkedNodes.concat(checkedNode)
						}
					}
				} else {
					if (e.node.eventKey.split('-').length == 2) {
						let nodeKey = this.checkedNodes.indexOf(e.node.eventKey)
						this.checkedNodes.splice(nodeKey, 1)
					} else {
						let checkedNode = []
						loop(this.searchValue, e.node.eventKey, (item) => {
							if (item.children.length > 0) {
								loop1(item.children, [e.node.eventKey], (ids) => {
									checkedNode = ids
								})
							}
						})

						if (checkedNode.length > 0) {
							checkedNode.map((key) => {
								let nodeKey = this.checkedNodes.indexOf(key)
								this.checkedNodes.splice(nodeKey, 1)
							})
						}
					}
				}

				this.checkedNodes = [...new Set(this.checkedNodes)]

				this.staffList = []
				if (this.checkedNodes.length > 0) {
					this.checkedNodes.map(x => {
						loop(this.departmentList, x, (item) => {
							if (item.scopedSlots.title == 'custom') {
								this.staffList.push(item)
							}
							if (item.children) {
								loop1(item.children, [x], (ids) => {
								})
							}
						})
					})
				}

				this.keyList = JSON.parse(JSON.stringify(this.staffList))
				for (var i = 0; i < this.staffList.length; i++) {
					for (var j = i + 1; j < this.staffList.length; j++) {
						if (this.staffList[i].id == this.staffList[j].id) {
							if (this.keyList[i].key.indexOf(this.keyList[j].key) >= 0) {

							} else if (this.keyList[j].key.indexOf(this.keyList[i].key) >= 0) {
								this.keyList[i].key = this.keyList[j].key
							} else {
								this.keyList[i].key += "," + this.keyList[j].key
							}
							this.staffList.splice(j, 1);
							this.keyList.splice(j, 1);
							j--;
						}
					}
				}
			},
			//删除选中的成员
			clickDelete (index, title) {
				this.staffList.splice(index, 1);
				this.keyList.splice(index, 1);
				let objs = []
				const loop = (data, objs, s) => {
					data.forEach((item) => {
						if (item.title == s) {
							objs.push(item.key)
						}
						if (item.children) {
							return loop(item.children, objs, s)
						}
					})
					return objs
				}
				var arr = loop(this.departmentList, objs, title)
				let arr2 = this.checkedKeys.filter(item => {
					return arr.every(item2 => {
						return item != item2;
					})
				})
				//去掉数组中的部门的key值
				var arr3 = []
				arr2.map(x => {
					if (x.length > 1) {
						arr3.push(x)
					}
				})
				this.checkedKeys = arr3
			},
		},
		watch  : {
			show (newValue) {
				this.showModal = newValue;
				if (this.showModal) {
					this.isLoading2 = true
					this.searchVal = ''
					this.searchVisible = false
					if (this.chooseNum == 0) {
						//重置过进入
						this.expandedKeys = []
						this.autoExpandParent = true
						this.checkedKeys = []
						this.selectedKeys = []
						this.searchValue = []
						this.staffList = []
						this.keyList = []
						this.checkedNodes = []
					} else {
						this.staffList = JSON.parse(JSON.stringify(this.staffListArr))
					}
					this.corpId = this.id
					this.getDepartmentList()
				}
			},
			id: {
				handler (newVal) {
					if (typeof newVal != '') {
						this.corpId = newVal
						this.getDepartmentList()
					}
				},
				deep: true
			},
		},

		created () {
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

</style>
