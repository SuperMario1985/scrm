<template>
	<div class="sider-one">
		<div class="team-add" style="">
			<span class="team-add-title">分组管理</span>
			<span style="color: #01b065;float: right;margin-right: 10px; cursor: pointer;"
			      @click="addGroupModal">添加分组</span>
			<a-icon class="team-add-icon" type="plus" @click="addGroupModal"></a-icon>
		</div>
		<div ref="scroll" @mousewheel="scrollWheel" class="sider-content scroll-content"
		     style=""
		     @mouseover="scrollOver" @mouseout="scrollOut" @mousemove="scroLineMove" @mouseup="scroLineUp">
			<div ref="scroLeft"
			     class="sider-content">
				<div style="width: 100%;padding: 0 10px;">
					<!--					@drop="drop" @dragover="allowDrop"-->
					<vuedraggable v-model="groupList" :chang="changeGroupSort">
						<template v-for="(item,index) in groupList">
							<div class="team" @mouseover="showIcon(index)" @mouseout="hideIcon(index)"
							     @click="selectTeam(index)" :id="item.id"
							     :class="{ active:groupId == item.id}"
							>
								<label class="team-name">{{item.title}}</label>
								<div style="display: inline-block;float: right; cursor: pointer;width: 46px; height: 46px;"
								     v-show="(iconFlag[index] || item.id == groupId) && item.is_not_group != 1">
									<a-icon type="edit" @click="editGroupName(index)"/>
									<a-icon type="delete" style="margin-left: 10px;" @click="removeGroup(index)"/>
								</div>
							</div>
						</template>
					</vuedraggable>
				</div>
			</div>
			<div ref="scroRight" class="scro-right" @mouseup="jumpScroll">
				<div v-show="scrollFlag && scroRight" ref="scroLine" class="scro-line"
				     @mousedown="scroLineDown">
				</div>
			</div>
		</div>
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
	import vuedraggable from "vuedraggable"

	export default {
		name      : "team",
		props     : {
			callback: {
				type   : Function,
				default: null
			}
		},
		components: {
			vuedraggable
		},
		watch: {
			groupList(newVal, oldVal) {
				if(newVal.toString() === this.oldGroupList.toString()) {
					this.getNewGroupList(newVal,oldVal)
				}

			}
		},
		data () {
			return {
				//滚动条
				mouseEnterFlag: false,
				startY        : 0,
				scrollFlag    : false,
				scroRight     : true,
				scrollOutFlag : false,
				suite_id      : 1,//应用ID
				visible       : false,//添加分组弹窗显示与隐藏
				groupList     : [],
				oldGroupList  : [],
				groupId       : '',//选中的分组id
				editGroupId     : '', // 编辑的分组id
				groupTitle      : '', // 新建编辑分组弹窗标题
				iconFlag      : [], // 编辑删除图标是否显示
				confirmLoading: false,//新建分组确认键的加载
				type          : 1,//0客户管理标签,1通讯录成员标签
				groupName     : '',//新建分组输入的分组名
			}
		},
		created () {
			//滚动条
			this.getGroupList()
		},
		mounted () {
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

			},
			showIcon (index) {
				this.iconFlag[index] = true
			},
			hideIcon (index) {
				this.iconFlag[index] = false
			},
			//拖拽
			// allowDrop (ev) {
			// 	ev.preventDefault();
			// },
			// drop (ev) {
			// 	ev.preventDefault();
			// 	if (this.groupId == ev.currentTarget.id) {
			// 		return
			// 	}
			// 	let groupId = ev.currentTarget.id
			// 	let material_id = ev.dataTransfer.getData("material_id")
			// 	if (!groupId || !material_id) {
			// 		return
			// 	}
			// 	let data = {
			// 		groupId : groupId,
			// 		material_id : material_id
			// 	}
			// 	this.$emit("changeMaterial2Group", data)
			// },
			//添加分组
			addGroupModal () {
				this.groupName = ''
				this.groupTitle = '新建分组'
				this.visible = true
			},
			handleOk () {
				this.addGroup()
			},
			async addGroup () {
				if (!this.groupName) {
					this.$message.warning("分组名不能为空")
					return false
				}
				const {data: res} = await this.axios.post("attachment/group-add", {
					group_id : this.editGroupId,
					isMasterAccount:localStorage.getItem('isMasterAccount'),
					sub_id  : localStorage.getItem('sub_id'),
					uid  : localStorage.getItem('uid'),
					title: this.groupName,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if(this.editGroupId) {
						this.$message.success("修改成功")
						for(let i = 0; i < this.groupList.length; i++) {
							if(this.editGroupId == this.groupList[i].id) {
								this.groupList[i].title = this.groupName
								break
							}
						}
						this.oldGroupList = JSON.parse(JSON.stringify(this.groupList))
					} else {
						this.$message.success("添加成功")
						this.getGroupList()
					}
					this.groupName = ''
					this.editGroupId = ''
					this.visible = false
				}
			},
			handleCancel () {
				this.groupName = ''
				this.editGroupId = ''
				this.visible = false
			},
			selectTeam (index) {
				if (this.groupList[index].id == this.groupId) {
					return false
				}
				this.groupId = this.groupList[index].id
				this.$emit('changeGroupId', this.groupId)
			},
			editGroupName (index) {
				if (this.groupId != this.groupList[index].id) {
					this.$emit('changeGroupId', this.groupList[index].id)
					this.groupId = this.groupList[index].id
				}
				this.editGroupId = this.groupList[index].id
				this.groupName = this.groupList[index].title
				this.groupTitle = '编辑分组'
				this.visible = true
			},
			removeGroup (index) {
				let that = this;
				that.$confirm({
					title     : "确定删除“" + this.groupList[index].title + "”小组?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delTeam(index);
					}
				});
			},
			async delTeam (index) {
				const {data: res} = await this.axios.post("attachment/group-del", {
					uid     : localStorage.getItem('uid'),
					isMasterAccount:localStorage.getItem('isMasterAccount'),
					sub_id  : localStorage.getItem('sub_id'),
					group_id: this.groupList[index].id,
					status  : 0
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success("删除成功")
					if(this.groupId == this.groupList[index].id) {
						this.getGroupList()
					} else {
						this.groupList.splice(index, 1)
					}
				}
			},
			//获取分组列表
			async getGroupList () {
				const {data: res} = await this.axios.post("attachment/group", {
					uid: localStorage.getItem('uid'),
					isMasterAccount:localStorage.getItem('isMasterAccount'),
					sub_id  : localStorage.getItem('sub_id'),
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.groupList = res.data.group;
					this.oldGroupList = JSON.parse(JSON.stringify(this.groupList))
					this.groupId = this.groupList[0].id
					this.iconFlag = new Array(res.data.group.length).fill(false)
					this.$emit('changeGroupId', this.groupId)
				}
			},
			async getNewGroupList(newVal,oldVal){
				let sort = []
				newVal.map(item => {
					sort.push(item.id)
				})
				const {data: res} = await this.axios.post("attachment/group-sort", {
					uid: localStorage.getItem('uid'),
					isMasterAccount:localStorage.getItem('isMasterAccount'),
					sub_id  : localStorage.getItem('sub_id'),
					sort: sort
				});
				if (res.error != 0) {
					this.groupList = JSON.parse(JSON.stringify(oldVal))
					this.$message.error(res.error_msg);
				} else {
					this.oldGroupList = JSON.parse(JSON.stringify(newVal))
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
		/*padding: 0 20px;*/
		width: 100%;
		height: calc(100% - 50px);
		overflow: hidden;
		position: absolute;
		top: 50px;
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
		padding: 0 !important;
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
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #F5F5F5;
	}

	.team-name {
		display: inline-block;
		width: 140px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.team-add-title {
		display: inline-block;
		margin-left: 10px;
	}

	.team-add-icon {
		float: right;
		color: #01b065;
		margin-top: 18px;
		margin-right: 5px;
		cursor: pointer;
	}

	.team-operation {
		cursor: pointer;
		margin-bottom: 4px !important;
	}

	.active-key {
		border-bottom: 2px solid #01b065;
		color: #01b065;
	}

	.moreIcon {
		color: #000;
	}

	.active {
		background: #01b065;
		color: white;
	}

	/deep/ .ant-tooltip-placement-bottom .ant-tooltip-arrow {
		display: none !important;
	}
</style>