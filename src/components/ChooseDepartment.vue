<template>
	<div>
		<!--部门选择框-->
		<a-modal v-if="showModal" :visible="showModal" title="选择企业成员" @ok="handleDepartment" :zIndex="9999"
		         @cancel="handleCancelDepartment" width="800px">
			<a-spin tip="Loading..." size="large" :spinning="isLoading2">
				<div style="width: 50%;height: 450px;float: left;border-right:1px solid #D9D9D9;overflow: auto;">
					<p v-if="noticeTitle != '' || isAudit == 1" style="margin-bottom: 10px;">
						<span v-if="noticeTitle != ''" style="color: red;margin-bottom: 10px;">{{noticeTitle}}</span>
						<span v-if="isAudit == 1 || isAudit == 2" style="color: #1890FF;cursor: pointer;"
						      @click="confirm">
							<a-icon type="redo" v-if="!loading"/><a-icon v-if="loading" type="sync"
							                                             style="color: #1890FF;" spin/>同步成员</span>
					</p>
					<a-input-search style="margin-bottom: 8px;width: 75%;" placeholder="搜索成员、部门"
					                @change="onChange" v-model="name" @pressEnter="searchEnter" />
					<div v-if="searchVisible" style="padding: 10px 10px 10px 0;">
						<!--搜索结果的树状图-->
						<template v-if="searchDepartmentList.workUser && searchDepartmentList.workUser.length > 0">
							<div class="title-type">人员</div>
							<template v-for="item in searchDepartmentList.workUser">
								<a-popover placement="top" :overlayStyle="{'z-index':99999}">
									<span slot="content" v-html="item.departmentNameAll">
									</span>
									<div class="content-line"
									     @click="item.disabled ? '' : onCheck(item.title,item.key,item.id,item.scopedSlots,item.isLeaf,item.ids)"
									     :style="{'color': item.disabled ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.65)','cursor': item.disabled ? 'not-allowed' : 'pointer'}">
										<div class="title-left">
											<a-icon type="user" style="margin-right: 10px;"/>
											{{item.title}}
											<a-icon type="check" style="margin-left: 10px;color: #1890FF;"
											        v-if="rightIdList.indexOf(item.id) > -1"/>
										</div>
										<div class="title-right">{{item.departmentName}}</div>
									</div>
								</a-popover>
							</template>
						</template>
						<template v-if="searchDepartmentList.department && searchDepartmentList.department.length > 0">
							<div class="title-type">部门</div>
							<template v-for="item in searchDepartmentList.department">
								<a-popover placement="top" :overlayStyle="{'z-index':99999}">
									<span slot="content" v-html="item.titleAll">
									</span>
									<div style="padding: 10px 0;"
									     @click="item.disabled ? '' : onCheck(item.title,item.key,item.id,item.scopedSlots,item.isLeaf,item.ids)"
									     :style="{'color': item.disabled ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.65)','cursor': item.disabled ? 'not-allowed' : 'pointer'}">
										<div style="white-space: nowrap;">
											<a-icon type="apartment" style="margin-right: 10px;color: #1890FF;"/>
											{{item.title}}
											<a-icon type="check" style="margin-left: 10px;color: #1890FF;"
											        v-if="rightIdList.indexOf(item.id) > -1"/>
										</div>
									</div>
								</a-popover>
							</template>
						</template>
						<a-empty
								v-show="searchDepartmentList.workUser && searchDepartmentList.workUser.length == 0 && searchDepartmentList.department && searchDepartmentList.department.length == 0"/>
					</div>
					<!--不搜索时的树状图-->
					<a-tree
							showIcon
							@expand="onExpand"
							:expandedKeys="expandedKeys"
							:treeData="departmentList"
							v-if="!searchVisible"
							:load-data="onLoadData"
					>
						<div slot="title" slot-scope="{title,key,id,scopedSlots,isLeaf,disabled,ids}"
						     @click="disabled ? '' : onCheck(title,key,id,scopedSlots,isLeaf,ids)">
							<a-icon type="apartment" style="margin-right: 10px;color: #1890FF;"/>
							<span>{{title}}</span>
							<a-icon type="check" style="margin-left: 10px;color: #1890FF;"
							        v-if="rightIdList.indexOf(id) > -1"/>
						</div>
						<div slot="custom" slot-scope="{title,key,id,scopedSlots,isLeaf,disabled,ids}"
						     @click="disabled ? '' : onCheck(title,key,id,scopedSlots,isLeaf,ids)">
							<a-icon type="user" style="margin-right: 10px;"/>
							<span>{{title}}</span>
							<a-icon type="check" style="margin-left: 10px;color: #1890FF;"
							        v-if="rightIdList.indexOf(id) > -1"/>
						</div>
					</a-tree>
					<a-empty v-show="departmentList.length == 0 && !searchVisible"/>
				</div>
				<div style="width: 50%;height: 450px;float: left;padding-left: 20px;overflow: auto;">
					<p>已选择的部门或成员</p>
					<a-list itemLayout="horizontal" :dataSource="rightList">
						<a-list-item slot="renderItem" slot-scope="item, index">
							<a-list-item-meta>
								<div slot="title" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
									<a-icon type="apartment" style="margin-right: 10px;color: #1890FF;"
									        v-if="item.scopedSlots.title == 'title'"/>
									<a-icon type="user" style="margin-right: 10px;"
									        v-if="item.scopedSlots.title == 'custom'"/>
									{{item.title}}
								</div>
							</a-list-item-meta>
							<a-icon type="close-circle" style="font-size: 16px;"
							        @click="clickDelete(item.id)"/>
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
			from_channel      : {
				type   : Number,
				default: 0   // 1渠道活码多人
			},
			show              : {
				type   : Boolean,
				default: false
			},
			callback          : {
				type   : Function,
				default: null
			},
			welcome_id        : {
				type   : Number,
				default: 0
			},
			disabledVal       : {
				type   : Number,
				default: 0 //判断是否返回成员有没有被创建过欢迎语字段，0不返回，1返回
			},
			chooseNum         : {
				type   : Number,
				default: 0 //判断是否重置过
			},
			isAudit           : {
				type   : String,
				default: '' // 1会话存档成员
			},
			isAuditEdit       : {
				type   : Number,
				default: 0
			},
			is_all            : {
				type   : Boolean,
				default: false,// 是否全选
			},
			noticeTitle       : {
				type   : String,
				default: ''// 最上头的提示语
			},
			isAuditUserAll    : {
				type   : Number,
				default: 0
			},
			id                : {
				type   : String,
				default: ''//成员随企业筛选框变化的corpid
			},
			is_del            : {
				type   : Number,
				default: 0
			},
			is_special        : {
				type   : Number,
				default: 0//数据可见范围限制，0不限制，1限制
			},
			is_from           : {
				type   : Number,
				default: 0 //来源，1客户回收设置,2员工删人，3员工待办，4跟进提醒-推送成员，5群打卡，6渠道活码，7组织架构：无外部联系人权限加（无权限），8客户群，9跟进提醒-跟进数据
			},
			from_id           : {
				type   : Number,
				default: 0 //来源的id
			},
			is_from_edit      : {
				type   : Number,
				default: 0 //是否添加修改,1添加修改，0列表中筛选
			},
			is_external       : {
				type   : Number,
				default: 0, // 是否外部联系人权限 0所有 1外部联系人
			},
			disabled_id       : {
				type   : Array,
				default: () => [], //外部传值需要禁选的id，包含部门、成员
			},
			agentid           : {
				type   : String|Number,
				default: ''
			},
			departmentDisabled: {//部门是否直接禁选,1禁选
				type   : Number,
				default: 0
			},
			userDisabled      : {//成员是否直接禁选,1禁选
				type   : Number,
				default: 0
			}
		},
		data () {
			return {
				suite_id            : 1,//应用ID
				corpId              : '',//企业微信选中的id
				showModal           : false, //成员选择框显示与隐藏
				departmentList      : [],//成员选择列表
				isLoading2          : true,//部门弹窗Loading的显示与隐藏
				loading             : false,
				searchVisible       : false,//搜索与否
				name                : '',//搜索的输入值
				//部门树状图
				expandedKeys        : [],
				departmentData      : [],//部门返回的下一级暂存数据
				//搜索结果树
				searchDepartmentList: [],//搜索结果的树结构
				searchTimeout       : '',
				//右侧数据
				rightList           : [],//右侧已选的数据
				rightIdList         : [],//右侧已选的id数据
				//默认全选
				total               : 0,//全选状态下返回，所有勾选上的数量
				changeCorpId        : '',//变动的corp_id，不取系统值，子账户管理页面用
			};
		},

		methods: {
			//同步客户气泡提示
			confirm () {
				if (this.loading) {
					this.$message.destroy()
					this.$message.info("正在后台刷新中，请耐心等待...", 2)
					return false
				}
				this.loading = true
				this.refreshFans()
				this.$message.destroy()
				this.$message.info("已进入后台刷新中，请耐心等待...", 2)
				// message.info("已进入后台刷新中，请耐心等待...", 4, this.refreshFans)
			},
			async refreshFans () {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-msg-audit/get-permit-user-list", {
					corp_id: this.corpId,
					refresh: 1,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.destroy()
					this.loading = false
					this.$message.error(res.error_msg)
				} else {
					this.$message.destroy()
					this.loading = false
					this.getDepartmentList();
				}
			},
			//部门树状图搜索
			onChange (e) {
				if (e.target.value != '') {
					this.isLoading2 = true;
					clearTimeout(this.searchTimeout)
					this.searchTimeout = setTimeout(() => {
						this.getSearchDepartmentList()
					}, 500)
					this.searchVisible = true
				} else {
					this.searchVisible = false
					this.searchDepartmentList = []
					if (typeof this.departmentList[0] != "undefined" && typeof this.departmentList[0].children != "undefined" && typeof this.departmentList[0].children[0] != "undefined" && typeof this.departmentList[0].children[0].key != "undefined") {
						this.expandedKeys.push(this.departmentList[0].key)
					}
				}
			},
			searchEnter(){
				this.getSearchDepartmentList()
			},
			async getSearchDepartmentList () {
				if (this.changeCorpId != '') {
					this.corpId = this.changeCorpId
				} else {
					this.corpId = this.id || localStorage.getItem('corpId')
				}
				const {data: res} = await this.axios.post("work-party/search-department-or-user", {
						uid               : localStorage.getItem('uid'),
						welcome_id        : this.welcome_id,
						suite_id          : this.suite_id,
						corp_id           : this.corpId,
						disabled          : this.disabledVal,
						is_audit          : this.isAudit,
						is_audit_edit     : this.isAuditEdit,
						is_audit_user_all : this.isAuditUserAll,
						get_users         : 1,
						is_del            : this.is_del,
						is_special        : this.is_special,
						is_from           : this.is_from,
						is_from_edit      : this.is_from_edit,
						from_id           : this.from_id,
						is_external       : this.is_external,
						name              : this.name,
						agentid           : this.agentid,
						departmentDisabled: this.departmentDisabled,
						userDisabled      : this.userDisabled
					})
				;
				if (res.error != 0) {
					this.isLoading2 = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.searchDepartmentList = res.data
					if (this.disabled_id.length > 0) {
						this.disabled_id.map(x => {
							if (this.searchDepartmentList.department.length > 0) {
								this.searchDepartmentList.department.map(y => {
									if (y.id == x) {
										y.disabled = true
									}
								})
							}
							if (this.searchDepartmentList.workUser.length > 0) {
								this.searchDepartmentList.workUser.map(z => {
									if (z.id == x) {
										z.disabled = true
									}
								})
							}
						})
					}
					this.isLoading2 = false;
				}
			},
			async getDepartmentList (parentId) {
				if (this.changeCorpId != '') {
					this.corpId = this.changeCorpId
				} else {
					this.corpId = this.id || localStorage.getItem('corpId')
				}
				const {data: res} = await this.axios.post("work-party/get-all-department-user", {
						uid               : localStorage.getItem('uid'),
						welcome_id        : this.welcome_id,
						suite_id          : this.suite_id,
						corp_id           : this.corpId,
						disabled          : this.disabledVal,
						is_audit          : this.isAudit,
						is_audit_edit     : this.isAuditEdit,
						is_audit_user_all : this.isAuditUserAll,
						get_users         : 1,
						parentId          : parentId,
						is_del            : this.is_del,
						is_special        : this.is_special,
						is_from           : this.is_from,
						is_from_edit      : this.is_from_edit,
						from_id           : this.from_id,
						is_external       : this.is_external,
						agentid           : this.agentid,
						departmentDisabled: this.departmentDisabled,
						userDisabled      : this.userDisabled,
					})
				;
				if (res.error != 0) {
					this.isLoading2 = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
					this.departmentList = []
				} else {
					if (parentId == '' || typeof parentId == 'undefined') {
						this.departmentList = []
						this.departmentList = res.data;
						if (this.disabled_id.length > 0) {
							this.disabled_id.map(x => {
								this.departmentList.map(y => {
									if (y.id == x) {
										y.disabled = true
									}
									if (y.children.length > 0) {
										y.children.map(z => {
											if (z.id == x) {
												z.disabled = true
											}
										})
									}
								})
							})
						}

						if (typeof this.departmentList[0] != "undefined") {
							this.expandedKeys.push(this.departmentList[0].key)
						}
						this.isLoading2 = false;
					} else {
						//选择部门返回下一级数据
						this.departmentData = res.data
						this.disabled_id.map(x => {
							this.departmentData.map(y => {
								if (y.id == x) {
									y.disabled = true
								}
							})
						})
					}
				}
			},
			onExpand (expandedKeys) {
				this.expandedKeys = expandedKeys
			},
			async onLoadData (treeNode) {
				return new Promise(resolve => {
					if (treeNode.dataRef.children) {
						resolve();
						return;
					}
					Promise.all([
						this.getDepartmentList(treeNode.dataRef.department_id)
					]).then(res => {
						treeNode.dataRef.children = this.departmentData;
						this.departmentList = [...this.departmentList];
						resolve();
					}).catch(e => {
					})
				});
			},
			//确定
			handleDepartment () {
				this.showModal = false
				this.expandedKeys = []
				let userNum = 0
				let departmentNum = 0
				this.rightList.map(x => {
					if (x.scopedSlots.title == 'custom') {
						userNum++
					} else if (x.scopedSlots.title == 'title') {
						departmentNum++
					}
				})
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("ok", this.rightIdList, userNum, departmentNum, this.rightList, this.total);
				}
			},
			//取消
			handleCancelDepartment () {
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("cancel");
				}
				this.showModal = false
				this.searchVisible = false
				this.name = ''
				this.departmentData = []
				this.rightList = []
				this.rightIdList = []
				this.expandedKeys = []
			},
			onCheck (title, key, id, scopedSlots, isLeaf, ids) {
				this.searchVisible = false
				this.name = ''
				if (this.rightIdList.indexOf(id) == -1) {
					this.rightIdList.push(id)
					let obj = {
						title      : title,
						avatar     : '',
						department : '',
						key        : key,
						id         : id,
						ids        : ids,
						scopedSlots: scopedSlots,
						isLeaf     : typeof isLeaf == 'undefined' ? false : true
					}
					this.rightList.push(obj)
				} else {
					this.rightIdList.splice(this.rightIdList.indexOf(id), 1);
					for (let i = 0; i < this.rightList.length; i++) {
						if (this.rightList[i].id == id) {
							this.rightList.splice(i, 1)
							return false
						}
					}
				}
			},
			//删除选中的成员
			clickDelete (id) {
				this.rightIdList.splice(this.rightIdList.indexOf(id), 1);
				for (let i = 0; i < this.rightList.length; i++) {
					if (this.rightList[i].id == id) {
						this.rightList.splice(i, 1)
						return false
					}
				}
			},
		},
		watch  : {
			show (newValue) {
				this.showModal = newValue;
				if (this.showModal) {
					this.isLoading2 = true
					this.name = ''
					this.expandedKeys = []
					this.searchVisible = false
					this.corpId = this.id || localStorage.getItem('corpId')
					this.getDepartmentList()
				}
			},
			id: {
				handler (newVal) {
					if (typeof newVal != '') {
						this.corpId = newVal
						this.getDepartmentList()
					}
				}
				,
				deep: true
			}
			,
		},

		created () {
			if (this.is_all) {
				//接收后台实时返回的导入进度结果
				this.ws.setCallback(this.websocketOnMessage)
				this.getDepartmentList()
			}
		}
	}
	;
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

	/deep/ .ant-list-item-meta {
		max-width: 93%;
	}

	/deep/ .ant-list-item-meta-content {
		max-width: 100%;
	}

	/deep/ .ant-list-item-meta-title {
		font-weight: 400;
		line-height: 32px;
		white-space: nowrap;
		max-width: 100%;
	}

	/deep/ .ant-tree li span.ant-tree-checkbox {
		margin: 4px 20px 0 2px;
	}

	.title-type {
		background: #1890FF;
		color: #FFF;
		padding: 5px;
	}

	.title-left {
		float: left;
		max-width: 50%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		display: block;
	}

	.title-right {
		float: right;
		max-width: 50%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		display: block;
	}

	.content-line {
		overflow: hidden;
		padding: 10px 0;
		cursor: pointer;
	}

	.content-line:hover {
		background: #E6F7FF;
	}
</style>
