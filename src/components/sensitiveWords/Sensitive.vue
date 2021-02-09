<template>
	<div class="page-spinning">
		<!--部门选择框-->
		<a-spin tip="加载中..." size="large" :spinning="isLoading">
			<div style="width: 100%;">
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
					</a-tree>
					<a-empty v-show="searchValue.length == 0 && !isLoading"/>
				</div>
				<a-tree
						showIcon checkable
						@expand="onExpand"
						:expandedKeys="expandedKeys"
						:autoExpandParent="autoExpandParent"
						@check="onSelect"
						:treeData="sensitiveList"
						v-if="!searchVisible"
						v-model="checkedKeys"
				>

				</a-tree>
				<a-empty v-show="sensitiveList.length == 0 && !isLoading"/>
			</div>
		</a-spin>
	</div>
</template>

<script>
	export default {
		name : "chooseDepartment",
		props: {
			show        : {
				type   : Boolean,
				default: false
			},
			callback    : {
				type   : Function,
				default: null
			},
			chooseNum   : {
				type   : Number,
				default: 0 //判断是否重置过
			},
			isSystem   : {
				type   : Number,
				default: 0//客户群传1
			},
			isClose : {
				type   : Number,
				default: 0// 不显示已关闭敏感词
			}
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				isLoading       : false,
				suite_id        : 1,//应用ID
				corpId          : corpId,//企业微信选中的id
				showModal       : false, //成员选择框显示与隐藏
				sensitiveList  : [],//成员选择列表
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
					if (typeof this.sensitiveList[0] != "undefined" && typeof this.sensitiveList[0].children != "undefined" && typeof this.sensitiveList[0].children[0] != "undefined" && typeof this.sensitiveList[0].children[0].key != "undefined") {
						this.expandedKeys.push(this.sensitiveList[0].children[0].key)
					}
				}
				let objs = []
				const loop = (data, objs, s) => {
					data.forEach((item) => {
						if (item.title.indexOf(s) > -1) {
							let obj = {
								key        : item.key,
								title      : item.title,
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
				var arr = loop(this.sensitiveList, objs, value)
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
			isFlod(id) {
				for(let i = 0; i < this.sensitiveList.length; i++) {
					if(this.sensitiveList[i].key == id) {
						return true
					}
				}
				return false
			},
			async getSensitiveList () {
				this.sensitiveList = []
				this.corpId = localStorage.getItem('corpId')
				const {data: res} = await this.axios.post("limit-word/word-group", {
					uid: localStorage.getItem('uid'),
					is_system: this.isSystem,
					is_close : this.isClose
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.sensitiveList = res.data;

					if (typeof this.sensitiveList[0] != "undefined" && typeof this.sensitiveList[0].children != "undefined" && typeof this.sensitiveList[0].children[0] != "undefined" && typeof this.sensitiveList[0].children[0].key != "undefined") {
						this.expandedKeys.push(this.sensitiveList[0].children[0].key)
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
					this.isLoading = false;
					this.callback([], false)
				}
			},
			onExpand (expandedKeys) {
				this.expandedKeys = expandedKeys
				this.autoExpandParent = false
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
					loop(this.sensitiveList, x, (item) => {
						if (!this.isFlod(item.key)) {
							this.staffList.push(item)
						}
						if (item.children) {
							loop1(item.children, x, (ids) => {
							})
						}
					})
				})
				this.callback(this.staffList, selectedKeys.length > 0)
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
					if (!this.isFlod(e.node.eventKey)) {
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
					if (!this.isFlod(e.node.eventKey)) {
						let nodeKey = this.checkedNodes.indexOf(e.node.eventKey)
						this.checkedNodes.splice(nodeKey, 1)
					} else {
						let that = this
						let checkedNode = []
						loop(this.searchValue, e.node.eventKey, (item) => {
							if (item.children.length > 0) {
								loop1(item.children, [e.node.eventKey], (ids) => {
									checkedNode = ids
									if (checkedNode.length > 0) {
										checkedNode.map((key) => {
											let nodeKey = this.checkedNodes.indexOf(key)
											this.checkedNodes.splice(nodeKey, 1)
										})
									}
								})
							}
						})
					}
				}

				this.checkedNodes = [...new Set(this.checkedNodes)]
				this.staffList = []
				if (this.checkedNodes.length > 0) {
					this.checkedNodes.map(x => {
						loop(this.sensitiveList, x, (item) => {
							if (!this.isFlod(item.key)) {
								this.staffList.push(item)
							}
							if (item.children) {
								loop1(item.children, [x], (ids) => {
								})
							}
						})
					})
				}
				this.callback(this.staffList, this.checkedNodes.length > 0)
			},
		},
		mounted () {
			this.isLoading = true
			this.getSensitiveList()
		}
	};
</script>

<style lang='less' scoped>

	/deep/ .ant-form-item-control {
		margin-left: 15px !important;
		margin-bottom: 10px !important;
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
		float: right;
	}
	.page-spinning /deep/ .ant-spin-spinning {
		margin-top: 150px;
	}
	/deep/ .ant-tree-title {
		display: inline-block;
		width: 155px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
