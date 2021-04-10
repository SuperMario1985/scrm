<template>
	<div>
		<a-modal v-if="visible" v-model="visible" width="888px!important" title="选择门店" @cancel="cancelGroup">
			<template slot="footer">
				<a-button key="back" @click="cancelGroup">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						@click="updateGroup"
				>确定
				</a-button>
			</template>
			<div style="display: inline-block; border-right: 1px solid #E2E2E2; width: 50%;">
				<a-input style="width: 230px; display: block;" @input="selectStore" v-model="searchName" placeholder="请输入门店名称或地址进行查找"/>
				<div class="group-tree2" style="height: 350px; overflow: auto;" @scroll="handleScroll">
					<div v-show="searchName != ''" class="store-list">
						<a-empty v-show="storeList.length == 0 && !isLoading"/>
						<a-spin tip="Loading..." class="store-spin" :spinning="isLoading"></a-spin>
						<div class="spin-zhezhao" v-if="isLoading"></div>
						<div class="store-item" @click="selectId(item.id + '-s', item.shop_name, item.status)" v-for="item in storeList">
							{{item.shop_name}}<template v-if="item.status == 0">（门店已关闭）</template><span style="color: rgba(0, 0, 0, 0.3)">（{{item.name}}）</span>
							<a-icon style="color: #1890FF;margin-left: 10px;" type="check" v-if="ids.includes(item.id + '-s')"></a-icon>
						</div>

					</div>

					<a-tree v-if="searchName == ''"
							class="draggable-tree"
							@select="onselect"
							:treeData="gData"
							:load-data="onLoadData"
					>
						<template slot="custom" slot-scope="{title, count, key, store}">
							{{title}}<template v-if="!store">（{{count}}）</template>
							<a-icon style="color: #1890FF;margin-left: 10px;" type="check" v-if="ids.includes(key)"></a-icon>
						</template>
					</a-tree>
				</div>
			</div>
			<div style="display: inline-block; width: calc(50% - 5px); height: 390px; overflow: auto; padding: 4px 20px 10px 20px;">
				已选择的门店
				<div v-for="(item, index) in stores" style="margin: 10px 0">
					{{item.title}}
					<a-icon @click="deleteStore(index)" style="cursor: pointer; margin-left: 5px;color: rgba(0, 0, 0, 0.65); float: right;" type="close"></a-icon>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
	export default {
		name   : "Team",
		props  : {
			groupVisible : {
				type: Boolean,
				default: false
			},
			storeIds: {
				type   : Array,
				default: () => [],
			},
			storeDetail : {
				type   : Array,
				default: () => [],
			}
		},
		watch  : {
			storeIds (newVal, oldVal) {
				this.ids = newVal
			},
			storeDetail (newVal, oldVal) {
				this.stores = newVal
			},
			groupVisible(newVal, oldVal) {
				this.visible = newVal
				if(this.visible) {
					this.getGroupList()
				}
			}
		},
		data () {
			let corpId =
				localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId        : corpId,
				searchName    : '',
				ids           : '', //选中的id数组
				stores        : [], // 选中的门店数据
				gData         : [], // tree数据
				groupData     : [], // 子分组列表数据
				visible       : false, // 弹窗是否显示
				timeInter     : 0,
				isLoading     : false,
				storeList     : [],
				page          : 1,
				count         : 0
			}
		},
		mounted () {
			this.ids = this.storeIds
			this.stores = this.storeDetail
			this.visible = this.groupVisible
			this.getGroupList();
		},
		methods: {
			handleScroll () {
				if(this.searchName != '' && !this.isLoading) {
					//变量scrollTop是滚动条滚动时，距离左边的距离
					let storeList = document.getElementsByClassName("group-tree2")[0]
					//变量scrollTop是滚动条滚动时，距离顶部的距离
					let scrollTop = storeList.scrollTop;
					//变量windowHeight是可视区的高度
					let windowHeight = storeList.clientHeight
					//变量scrollHeight是滚动条的总高度
					let scrollHeight = storeList.scrollHeight
					//滚动条到底部的条件
					if (scrollTop + windowHeight == scrollHeight) {
						if (this.count > this.storeList.length) {
							this.isLoading = true
							this.selectStoreList(this.page + 1)
						}
					}
				}
			},
			selectStore(e) {
				if(e.val == '') {
					this.storeList = []
					this.page = 1
				}
				clearTimeout(this.timeInter)
				this.timeInter = setTimeout(this.selectStoreList, 500)
			},
			async selectStoreList(page = 1) {
				this.isLoading = true
				const {data: res} = await this.axios.post("auth-store/get-store-list", {
					corp_id    : this.corpId,
					group_id   : '',
					uid        : localStorage.getItem('uid'),
					status     : '',
					search_name: this.searchName,
					page       : page,
					page_size  : 20
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					if(page == 1) {
						this.storeList = res.data.data;
						this.count = parseInt(res.data.count)
					} else {
						this.storeList = JSON.parse(JSON.stringify(this.storeList.concat(res.data.data)))
					}
					this.page = page;
					this.isLoading = false;
				}
			},
			// 取消选择分组
			cancelGroup() {
				this.searchName = ''
				this.page = 1
				this.count = 0
				this.storeList = []
				this.$emit("setGroupId", 'cancle')
			},
			// 提交分组
			updateGroup() {
				this.searchName = ''
				this.page = 1
				this.count = 0
				this.storeList = []
				this.$emit("setGroupId", 'ok', this.ids, this.stores)
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
				const {data: res} = await this.axios.post("auth-store/get-group-list", {
					uid      : localStorage.getItem('uid'),
					corp_id  : this.corpId,
					parent_id: parentId ? parentId : '',
					store    : 2,
					choose   : 1,
					status   : 1
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
			selectId(id, name, status) {
				if(status == 0) {
					return false
				}
				let index = this.ids.findIndex(key => key == id)
				if(index > -1) {
					this.ids.splice(index, 1)
					this.stores.splice(index, 1)
				} else {
					this.ids.push(id)
					let store = {
						id : id,
						title : name
					}
					this.stores.push(store)
				}
			},
			// 点击分组
			onselect (e, event) {
				if (e.length > 0 && this.id != e[0]) {
					let index = this.ids.findIndex(id => id == e[0])
					if(index > -1) {
						this.ids.splice(index, 1)
						this.stores.splice(index, 1)
					} else {
						this.ids.push(e[0])
						let that = this
						let store = {
							id : e[0],
							title : event.node.dataRef.title
						}
						that.stores.push(store)
					}
				}
			},
			// 右侧删除分组
			deleteStore(index) {
				this.ids.splice(index, 1)
				this.stores.splice(index, 1)
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
		background-color: #1890FF;
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
	.store-list {
		max-width: 350px;
		margin-top: 10px;
	}
	.store-item {
		margin:  5px 0;
		cursor: pointer;
	}
	.store-spin {
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
		background-color: rgba(0,0,0, 0.04);
	}
</style>