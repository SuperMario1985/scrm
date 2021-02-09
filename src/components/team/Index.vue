<!-- 仅与uid有关的分组 -->
<template>
	<div class="sider-one">
		<div class="team-add" style="">
			<span class="team-add-title">分组管理</span>
			<a-icon class="team-add-icon" type="plus" @click="addTeamModal" v-has="hasAddName"></a-icon>
		</div>
		<div ref="scroll" @mousewheel="scrollWheel" class="sider-content scroll-content"
		     style=""
		     @mouseover="scrollOver" @mouseout="scrollOut" @mousemove="scroLineMove" @mouseup="scroLineUp"
		     v-has="hasGroupName">
			<div ref="scroLeft"
			     class="sider-content">
				<div style="width: 100%;cursor: pointer;">
					<div class="team"
					     @click="selectTeam(0, '所有分组')"
					     :class="{ active:teamId == 0}"
					>
						<label class="team-name">所有分组</label>
					</div>
					<vuedrag v-model="teamsList1" @end="changeGroupSort">
						<template v-for="(item,index) in teamsList1">
							<div class="team"
							     @click="selectTeam(item.id, item.title)"
							     @mouseleave="hideTip"
							     :class="{ active:teamId == item.id}" @mouseover="showOperation(item.id)"
							>
								<span class="team-name">
									{{item.title}}
									<span v-if="item.is_forbid == 1 && isForbid == 1">（系统）</span>
								</span>
								<a-popover
										v-if="mouseOverId == item.id && item.title != '未分组' && item.is_forbid != 1 && isShow"
										placement="right"
										trigger="hover"
										style="display: inline-block;float: right;cursor: pointer;">
									<template slot="content">
										<div @mouseover="showTip" @mouseleave="hidePopover"
										     style="width: 100%; text-align: center;">
											<p @click="editTeamName(index)" class="team-operation" v-has="hasEditName">
												编辑小组</p>
											<p @click="removeTeam(item.id, item.title)" class="team-operation1"
											   v-has="hasDeleteName">
												删除小组</p>
										</div>
									</template>
									<img src="../../assets/more.png"
									     style="float: right;vertical-align: middle;margin-top: 14px;">
								</a-popover>
							</div>
						</template>
					</vuedrag>
				</div>
			</div>
			<div ref="scroRight" class="scro-right" @mouseup="jumpScroll">
				<div v-show="scrollFlag && scroRight" ref="scroLine" class="scro-line"
				     @mousedown="scroLineDown">
				</div>
			</div>
		</div>
		<a-modal
				:title="title"
				:destroyOnClose='true'
				:visible="visible"
				@ok="handleOk"
				:confirmLoading="confirmLoading"
				@cancel="handleCancel"
		>
			<!--			<a-input placeholder="请输入分组名(不得超过15个字符)" :maxLength="15" v-model="teamName"></a-input>-->
			<a-input placeholder="请输入分组名(不得超过15个字符)" v-model="teamName" :maxLength="15">
												<span slot="suffix">
													<span>{{teamName.length}}</span>/15
												</span>
			</a-input>
		</a-modal>
	</div>
</template>

<script>
	import vuedrag from "vuedraggable"

	export default {
		name      : "team",
		components: {
			vuedrag
		},
		props     : {
			callback: { // 回调
				type   : Function,
				default: null
			},
			listUrl : { // 列表接口名
				type   : String,
				default: ''
			},
			sortUrl : { // 排序接口名
				type   : String,
				default: ''
			},
			addUrl  : { // 添加接口名
				type   : String,
				default: ''
			},
			editUrl : { // 编辑接口名
				type   : String,
				default: ''
			},
			delUrl  : { // 删除接口名
				type   : String,
				default: ''
			},
			name    : { // 文案名称
				type   : String,
				default: ''
			},
			isForbid: { // 是否是系统（违规监控 敏感词词库）
				type   : Number,
				default: 0
			},
			isSystem: { // 是否包含系统（违规监控 敏感词词库）
				type   : Number,
				default: 0
			}
		},
		data () {
			return {
				isShow        : true,//编辑删除的pop的显示与隐藏
				//滚动条
				mouseEnterFlag: false,
				startY        : 0,
				scrollFlag    : false,
				scroRight     : true,
				scrollOutFlag : false,
				corpInfo      : [], //企业微信列表
				suite_id      : 1,//应用ID
				key           : 1,//分组1、通用2
				visible       : false,//添加分组弹窗显示与隐藏
				editGroupId   : '', // 修改分组的id
				title         : '新建分组', // 分组弹窗标题
				teamsList     : [], // 分组数据
				teamsList1    : [], // 分组移动后的数据
				tipVisible    : false, // 更多操作弹窗是否显示
				timeOut       : '',
				teamId        : 0,//选中的分组id
				mouseOverId   : '', // 鼠标指向的id
				editFlag      : false,//是否编辑输入框的显示与隐藏
				confirmLoading: false,//新建分组确认键的加载
				type          : 1,//0客户管理标签,1通讯录成员标签
				teamName      : '',//新建分组输入的分组名
				hasDeleteName : '',//删除标签分组,通讯录成员标签'work-tag-group-delete',客户管理页面'client-tag-group-del'，客户群列表'groupList-del',敏感词词库'sensitive-words-group-delete'
				hasEditName   : '',//编辑标签分组,通讯录成员标签'work-tag-group-edit',客户管理页面'client-tag-group-edit'，客户群列表'groupList-edit',敏感词词库'sensitive-words-group-edit'
				hasAddName    : '',//新建标签分组,通讯录成员标签'work-tag-group-add',客户管理页面'client-tag-group-add'，客户群列表'groupList-add',敏感词词库'sensitive-words-group-add'
				hasGroupName  : '',//标签分组列表,通讯录成员标签'work-tag-group',客户管理页面'client-tag-group'，客户群列表'groupList-group',敏感词词库'sensitive-words-group-list'
			}
		},
		created () {
			if (this.$route.path == '/label/list') {
				this.type = 1
				this.hasDeleteName = 'work-tag-group-delete'
				this.hasEditName = 'work-tag-group-edit'
				this.hasAddName = 'work-tag-group-add'
				this.hasGroupName = 'work-tag-group'
			} else if (this.$route.path == '/customTags/list') {
				this.type = 0
				this.hasDeleteName = 'client-tag-group-del'
				this.hasEditName = 'client-tag-group-edit'
				this.hasAddName = 'client-tag-group-add'
				this.hasGroupName = 'client-tag-group'
			} else if (this.$route.path == '/group/list') {
				this.type = 2
				this.hasDeleteName = 'groupList-del'
				this.hasEditName = 'groupList-edit'
				this.hasAddName = 'groupList-add'
				this.hasGroupName = 'groupList-group'
			} else if (this.$route.path == '/archive/sensitive') {
				this.type = 3
				this.hasDeleteName = 'sensitive-words-group-delete'
				this.hasEditName = 'sensitive-words-group-edit'
				this.hasAddName = 'sensitive-words-group-add'
				this.hasGroupName = 'sensitive-words-group-list'
			}
			if(localStorage.getItem('isMasterAccount') == 2){
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				if(permissionButton.indexOf(this.hasEditName) == -1 && permissionButton.indexOf(this.hasDeleteName) == -1){
					this.isShow = false
				}else {
					this.isShow = true
				}
			}else {
				this.isShow = true
			}
		},
		mounted () {
			this.getTeamsList()
			//滚动条
			let observer = new MutationObserver(this.setScroLineHeight)
			observer.observe(this.$refs.scroLine, {
				attributes       : true,
				attributeFilter  : ['style'],
				attributeOldValue: true
			})
			this.setScroLineHeight()
			this.initFirefoxScroll()
		},
		methods   : {
			changeGroupSort () {
				this.sortGroup()
			},
			async sortGroup () {
				let groupIds = []
				this.teamsList1.map((item) => {
					groupIds.push(item.id)
				})
				// let url = ''
				// if (this.type == 2) {
				// 	url = 'work-chat/chat-group-sort'
				// } else if (this.type == 1 || this.type == 0) {
				// 	url = "work-tag-group/group-sort"
				// }
				const {data: res} = await this.axios.post(this.sortUrl, {
					ids: groupIds,
					uid: localStorage.getItem('uid'),
				})
				this.getTeamsList(this.teamId)
			},
			// 鼠标移入分组
			showOperation (id) {
				clearTimeout(this.timeOut)
				this.mouseOverId = id
			},
			// 进入操作框取消隐藏操作按钮和框
			showTip () {
				clearTimeout(this.timeOut)
			},
			// 延时隐藏操作按钮和框
			hideTip () {
				let that = this
				this.timeOut = setTimeout(function () {
					that.mouseOverId = ''
				}, 500)
			},
			// 直接隐藏操作按钮和框
			hidePopover () {
				this.mouseOverId = ''
			},
			//添加分组
			addTeamModal () {
				this.title = '新增分组'
				this.teamName = ''
				this.visible = true
			},
			// 添加编辑分组提交
			handleOk () {
				String.prototype.Trim = function () {
					return this.replace(/(^\s*)|(\s*$)/g, "");
				}
				this.teamName = this.teamName.Trim()
				if (!this.teamName) {
					this.$message.error("请输入分组名")
					return false
				}
				if (this.editGroupId) {
					this.sureRemark()
				} else {
					this.addTeam()
				}
			},
			// 添加分组接口
			async addTeam () {
				// let url = ''
				// if (this.type == 2) {
				// 	url = 'work-chat/chat-group-add'
				// } else if (this.type == 1 || this.type == 0) {
				// 	url = "work-tag-group/add"
				// }
				const {data: res} = await this.axios.post(this.addUrl, {
					uid  : localStorage.getItem('uid'),
					id   : this.editGroupId,
					title: this.teamName,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.teamName = ''
					this.visible = false
					this.getTeamsList(this.teamId)
				}
			},
			// 取消分组添加或编辑
			handleCancel () {
				this.editGroupId = ''
				this.visible = false
			},
			// 企业微信
			handleChange (value) {
				this.corpInfo.map((x) => {
					if (value == x.corpid) {
						this.$store.dispatch("changeCorp", x);
					}
				})
				this.isLoading = true;
				this.teamId = ''
				this.getTeamsList(0)
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			//分组、通用
			changetype (key) {
				this.key = key
			},
			// 切换分组
			selectTeam (teamId, teamName) {
				if (teamId == this.teamId) {
					return false
				}
				this.editFlag = false
				this.teamId = teamId
				this.teamName = teamName
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback(this.suite_id, this.type, this.teamId, teamName);
				}
			},
			// 编辑分组名提交
			async sureRemark () {
				// let url = ''
				// if (this.type == 2) {
				// 	url = 'work-chat/chat-group-update'
				// } else if (this.type == 1 || this.type == 0) {
				// 	url = "work-tag-group/update"
				// }
				const {data: res} = await this.axios.post(this.editUrl, {
					uid  : localStorage.getItem('uid'),
					id   : this.editGroupId,
					title: this.teamName,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.visible = false
					this.getTeamsList(this.editGroupId)
					this.editGroupId = ''
				}
			},
			// 编辑分组操作
			editTeamName (index) {
				this.mouseOverId = ""
				this.editGroupId = this.teamsList[index].id
				this.title = '编辑分组'
				this.teamName = this.teamsList[index].title
				this.tipVisible = false
				this.visible = true
			},
			// 删除分组操作
			removeTeam (id, name) {
				this.mouseOverId = ''
				let that = this;
				that.$confirm({
					title     : "【" + name + "】一旦删除，归属于该分组的" + this.name + "都将被移至【未分组】，确定删除分组吗?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delTeam(id);
					}
				});
			},
			// 删除分组操作
			async delTeam (id) {
				// let url = ''
				// if (this.type == 2) {
				// 	url = 'work-chat/chat-group-delete'
				// } else if (this.type == 1 || this.type == 0) {
				// 	url = "work-tag-group/delete"
				// }
				const {data: res} = await this.axios.post(this.delUrl, {
					uid: localStorage.getItem('uid'),
					id : id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (this.teamId == id) {
						id = 0
						this.teamId = 0
					}
					this.getTeamsList(id)
				}
			},
			//获取分组列表
			async getTeamsList (id) {
				const {data: res} = await this.axios.post(this.listUrl, {
					uid      : localStorage.getItem('uid'),
					is_system: this.isSystem,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.teamsList = res.data.group;
					this.teamsList1 = JSON.parse(JSON.stringify(this.teamsList))
					if (!this.teamId) {
						this.teamId = 0
						this.teamName = '所有分组'
					} else {
						this.teamId = id
						this.teamName = id == 0 ? '所有分组' : this.teamsList.find(team => team.id == id).title
					}
					if (this.callback !== null && typeof this.callback === "function") {
						this.callback(this.suite_id, this.type, this.teamId, this.teamName);
					}
				}
			},
			// 滚动条高度
			setScroLineHeight () {
				let that = this
				let winHeight = 0;
				winHeight = that.$refs.scroLeft.clientHeight;
				if (winHeight >= that.$refs.scroLeft.scrollHeight) {
					that.scroRight = false
				} else {
					// that.$refs.scroLine.style.height = "200px"
					that.$refs.scroLine.style.height = (winHeight - 50) / that.$refs.scroLeft.scrollHeight * (that.$refs.scroRight.scrollHeight - 50) + "px";
					that.scroRight = true
				}
			},
			// 滑轮滚动（火狐）
			initFirefoxScroll () {
				let that = this
				if (document.addEventListener) {
					document.addEventListener('DOMMouseScroll', function (e) {
						let event1 = window.event || e;
						let Y = that.$refs.scroLeft.scrollTop;
						let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
						if (event1.detail >= 0) {
							Y = Y + 80
						} else {
							Y = Y - 80
						}
						if (Y < 0) Y = 0;
						if (Y > H - 50) Y = H;
						that.$refs.scroLeft.scrollTop = Y;
						let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
						if (Y > 0 && Y < H - 50) {
							SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
						}
						if (SH > this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight) {
							SH = this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight
						}
						if (SH < 0) SH = 0;
						that.$refs.scroLine.style.top = SH + "px";
					}, false)
				}
			},
			// 滑轮滚动
			scrollWheel () {
				var event = event ? event : (window.event ? window.event : null);
				let Y = this.$refs.scroLeft.scrollTop;
				let H = this.$refs.scroLeft.scrollHeight - this.$refs.scroLeft.clientHeight;
				if (event.wheelDelta >= 120) {
					Y = Y - event.wheelDelta * 0.5
				} else {
					Y = Y - event.wheelDelta * 0.5
				}
				if (Y < 0) Y = 0;
				if (Y > H) Y = H;
				this.$refs.scroLeft.scrollTop = Y;
				let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
				if (Y > 0 && Y < H) {
					SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
				}
				if (SH < 0) SH = 0;
				this.$refs.scroLine.style.top = SH + "px";
			},
			// 滚动栏点击跳转
			jumpScroll () {
				let that = this
				if (!that.mouseEnterFlag) {
					var event = event ? event : (window.event ? window.event : null);
					let Y = that.$refs.scroLeft.scrollTop;
					let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
					if (event.y - that.startY >= 0) {
						Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
					} else {
						Y = Y + (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight
					}
					that.$refs.scroLeft.scrollTop = Y;
					if (Y < 0) {
						Y = 0;
					}
					if (Y > H) {
						Y = H;
					}
					let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
					if (Y > 0 && Y < H) {
						SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
					}
					if (SH < 0) SH = 0;
					that.$refs.scroLine.style.top = SH + "px";
					that.startY = event.y
				}
			},
			// 滚动条点击
			scroLineDown () {
				this.mouseEnterFlag = true
				this.startY = event.y;  // 按下鼠标指针的y轴坐标
				if (window.addEventListener) {
					window.addEventListener('mouseup', this.scroLineUp, false)
					window.addEventListener('mousemove', this.scroLineMove, false)
				}
				this.$emit('banUserSelect')
			},
			// 滚动条长按移动
			scroLineMove () {
				let that = this
				if (that.mouseEnterFlag) {
					var event = event ? event : (window.event ? window.event : null);
					let Y = that.$refs.scroLeft.scrollTop;
					let H = that.$refs.scroLeft.scrollHeight - that.$refs.scroLeft.clientHeight;
					let CH = (event.y - that.startY) / that.$refs.scroLeft.clientHeight * that.$refs.scroLeft.scrollHeight;
					Y = Y + CH;
					that.$refs.scroLeft.scrollTop = Y;
					if (Y < 0) {
						Y = 0;
					}
					if (Y > H) {
						Y = H;
					}
					let SH = Y / H * this.$refs.scroRight.clientHeight - this.$refs.scroLine.clientHeight;
					if (Y > 0 && Y < H) {
						SH = Y / this.$refs.scroLeft.scrollHeight * this.$refs.scroRight.clientHeight
					}
					if (SH < 0) SH = 0;
					that.$refs.scroLine.style.top = SH + "px";

					that.startY = event.y;
				}
			},
			// 鼠标左击抬起
			scroLineUp () {
				if (this.mouseEnterFlag == true) {
					var event = event ? event : (window.event ? window.event : null);
					this.mouseEnterFlag = false
					if (this.changeWidthSmallFlag) {
						this.changeWidthSmall()
						this.changeWidthSmallFlag = false
					}
					if (this.scrollOutFlag) {
						this.scrollOut()
						this.scrollOutFlag = false
					}
					if (window.removeEventListener) {
						window.removeEventListener('mouseup', this.scroLineUp, false)
						window.removeEventListener('mousemove', this.scroLineMove, false)
					}
					this.$emit('userSelect')
				}
			},
			// 鼠标进入左边页面
			scrollOver () {
				this.scrollFlag = true
			},
			// 鼠标移出左边页面
			scrollOut () {
				if (!this.mouseEnterFlag) {
					this.scrollFlag = false
				}
				this.scrollOutFlag = true
			},
		}
	}
</script>

<style scoped>
	.sider-content {
		float: left;
		width: 100%;
		width: calc(100% - 3px);
		width: -moz-calc(100% - 3px);
		width: -webkit-calc(100% - 3px);
		height: 100%;
		max-height: 100%;
		overflow: hidden;
	}

	.scroll-content {
		width: calc(100% - 20px) !important;
		height: calc(100% - 60px);
		overflow: hidden;
		position: absolute;
		top: 60px;
	}

	/*滚动条背景*/
	.scro-right {
		position: relative;
		float: right;
		height: 100%;
		width: 3px;
		background-color: #FFF;
		overflow: hidden;
	}

	/*滚动条*/
	.scro-line {
		position: absolute;
		z-index: 1;
		top: 0px;
		right: 0px;
		width: 3px;
		border-radius: 3px;
		overflow: hidden;
		background-color: #D3D3D3;
	}

	.sider-one {
		padding: 0 10px 0 10px !important;
		height: 100%;
		overflow-y: hidden;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
		overflow-y: hidden;
	}

	.team {
		width: 100%;
		height: 50px;
		line-height: 50px;
		/*cursor: pointer;*/
		padding: 0 10px;
	}

	.team-type {
		display: inline-block;
		height: 50px;
		line-height: 50px;
		margin-right: 20px;
		min-width: 60px;
		text-align: center;
	}

	.team-add {
		width: calc(100% - 3px);
		height: 50px;
		line-height: 50px;
		margin-top: 10px;
		background-color: #F5F5F5;
	}

	.team-name {
		display: inline-block;
		width: 160px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		cursor: pointer;
	}

	.team-add-title {
		display: inline-block;
		margin-left: 76px;
	}

	.team-add-icon {
		float: right;
		color: #01b065;
		margin-top: 18px;
		margin-right: 20px;
		cursor: pointer;
	}

	.team-operation {
		margin-top: 4px;
		cursor: pointer;
		margin-bottom: 8px !important;
	}

	.team-operation1 {
		margin-top: 4px;
		cursor: pointer;
		margin-bottom: 4px !important;
	}

	.team-operation:hover {
		color: #1890FF;
	}

	.active-key {
		border-bottom: 2px solid #1E90FF;
		color: #1E90FF;
	}

	.active {
		background: #1E90FF;
		color: white;
	}

	/deep/ .ant-tooltip-placement-bottom .ant-tooltip-arrow {
		display: none !important;
	}

	/deep/ .ant-popover-inner .ant-popover-inner-content .ant-popover-buttons {
		display: none !important;
	}
</style>