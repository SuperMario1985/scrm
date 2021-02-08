<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider>
					<!-- 公众号 -->
					<eWechatTeam :callback="modalVisibleChange"></eWechatTeam>
				</a-layout-sider>
				<a-layout style="position: absolute;left:250px;top:0;bottom:0;right:0;overflow-x: hidden; overflow-y: auto;"
				          class="scroll">
					<!-- 头部 -->
					<a-layout-header>企业标签管理</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								1、标签分组名称不能重复。</p>
							<p style="margin-bottom: 2px;">
								2、标签总数量不限制，但给每个企业成员打标签最多为20个。</p>
							<p style="margin-bottom: 2px;">3、标签分组一旦被删除，归属于该分组的标签均将移至【未分组】。</p>
							<p style="margin-bottom: 0;">4、【未分组】为固定存在，不可修改名称，亦不可删除。</p>
						</div>
						<div class="content-hd">
							<div class="content-hd-right">
								<label v-if="lastTagTime">最后一次同步时间：{{lastTagTime}}</label>
								<a-button class="btn-primary" icon="reload" @click="sysTag()" v-has="'work-tag-sync'">
									同步企业微信标签
								</a-button>
								<a-button class="btn-primary" icon="delete" @click="deleteCoustomTags()"
								          :disabled="selectedRowKeys.length == 0" type="primary"
								          v-has="'work-tag-delete'">
									删除标签
								</a-button>
								<a-button class="btn-primary" icon="retweet" @click="showModalGroup()"
								          :disabled="selectedRowKeys.length == 0" type="primary"
								          v-has="'work-tag-remove'">
									移动标签
								</a-button>
								<a-button class="btn-primary" icon="plus" @click="showModal('add')" type="primary"
								          v-has="'work-tag-add'">
									新建标签
								</a-button>
								<a-modal title="新建标签" v-model="visible" @ok="handleOk(inputValue)"
								         :confirmLoading="confirmLoading3" @cancel="cancel">
									<a-form-item :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<template slot="label">
											选择分组
										</template>
										<a-select showSearch optionFilterProp="children" v-model="editGroupId"
										          style="width: 180px"
										          :dropdownStyle="{ overflow: 'hidden' }">
											<a-select-option v-for="item in groupList" :value="item.id">
												{{item.group_name}}
											</a-select-option>
										</a-select>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }"
									             :wrapper-col="{ span: 20 }">
										<template slot="label">
											标签名称
										</template>
										<p style="margin: 0px;font-size: 13px; color: #909399;">
											每个标签名称最多15个字。同时新建多个标签时，请用“空格”隔开</p>
										<a-input placeholder="请输入标签（不得超过15个字符）" v-model="inputValue"/>
									</a-form-item>

								</a-modal>
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<div class="spin-content">
									<a-table :columns="columns" :dataSource="tagsList" :pagination="false"
									         :rowSelection="rowSelection" :rowClassName="rowClassName"
									         v-has="'work-tag-list'">
                									<span slot="tags" slot-scope="name">
                  <a-tag color="#2db7f5" class="tag-name" style="">
	                  {{name}}
                  </a-tag>
                </span>
										<span slot="action" slot-scope="text, record">
                  <span @click="showModal2(record)"
                        style="color: #1890FF;margin-right: 25px;cursor: pointer;" v-has="'work-tag-edit'">编辑</span>
                  <span @click="showModal3(text, record)" style="color: #1890FF;cursor: pointer;"
                        v-has="'work-tag-delete'">删除</span>
                </span>
									</a-table>
									<!-- 分页 -->
									<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0"
									     v-has="'work-tag-list'">
										<div style="height: 32px;float: left;line-height: 32px;margin-left: 10px;">
											共有
											<span style="color: blue">{{total}}</span>个标签
										</div>
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
											              :current="page"
											              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
											              @change="changePage"
											              @showSizeChange="showSizeChange"/>
										</div>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>
					<!-- 编辑按钮弹窗 -->
					<a-modal title="修改标签名称" v-model="visible2" @ok="handleOk2"
					         :confirmLoading="confirmLoading">
						<a-form-item :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							<template slot="label">
								选择分组
							</template>
							<a-select showSearch optionFilterProp="children" v-model="editGroupId"
							          style="width: 180px"
							          :dropdownStyle="{ overflow: 'hidden' }" :disabled="groupDisabled">
								<a-select-option v-for="item in groupList" :value="item.id">
									{{item.group_name}}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item :label-col="{ span: 4 }"
						             :wrapper-col="{ span: 20 }">
							<template slot="label">
								标签名称
							</template>
							<a-input placeholder="请输入标签" v-model="inputValue2" :maxLength="15">
						                  <span slot="suffix">
						                    <span>{{inputValue2.length}}</span>/15
						                  </span>
							</a-input>
						</a-form-item>

					</a-modal>
					<!-- 删除按钮弹窗 -->
					<a-modal title="删除标签" v-model="visible3" @ok="handleOk3"
					         :confirmLoading="confirmLoading2">
						<div style="margin: 19px 0px;">
							<a-icon type="exclamation-circle"
							        style="color: #F7BA2A; font-size: 22px;margin-right: 10px;"/>
							<span style="font-size: 16px;display: inline-block;width:90%;line-height: 22px;vertical-align: top;white-space: normal;word-break: break-all;"><span
									style="color: red;">{{inputValue3}}</span>  标签删除后，则相应的用户失去了该标签属性。确定删除吗？</span>
						</div>
					</a-modal>

					<a-modal title="选择分组" v-model="visibleGroup" @ok="handleGroupOk" @cancel="handleCancel"
					         width="888">
						<div style="height: 340px;">
							<a-select
									showSearch
									optionFilterProp="children"
									style="width: 200px;margin-bottom: 20px;margin-left: 5px;"
									@change="changeGroup"
									v-model="moveGroupId"
							>
								<template v-for="item in groupList">
									<a-select-option :value="item.id">
										{{item.group_name}}
									</a-select-option>
								</template>
							</a-select>
							<div style="height: 300px;" class="wxtpl">
								<template v-for="(item,index) in groupList" style="display: inline-block;">
									<template>
										<a-radio-group @change="changeGroup(item.id)" v-model="moveGroupId">
											<a-radio-button :value="item.id">
												<div>
													<span style="display: inline-block; width: 100%;margin-left: 5px; white-space:nowrap;text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow: hidden;vertical-align: middle;">{{item.group_name}}</span>
												</div>
											</a-radio-button>
										</a-radio-group>
									</template>
								</template>
							</div>
						</div>
					</a-modal>

				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import eWechatTeam from "@/components/eWeChat/team.vue";

	const columns = [
		{
			title      : "标签名称",
			dataIndex  : "tagname",
			scopedSlots: {customRender: "tags"},
			key        : "tagname"
		},
		{
			title    : "员工数",
			dataIndex: "num",
			key      : "num"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		components: {eWechatTeam},
		data () {
			return {
				corpId         : '',//企业微信选中的id
				suite_id       : '',//应用ID
				type           : '',//0客户管理标签,1通讯录成员标签
				group_id       : '',//选中的分组
				lastTagTime    : '',
				tagsList       : [], //表格信息
				isLoading      : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				visible        : false, //新建标签
				inputValue     : "", //新建标签输入框值
				newTagList     : [], //新建标签数组
				visible2       : false, //编辑按钮
				inputValue2    : "", //编辑标签的内容
				tagId          : "", //标签id
				visible3       : false, //删除按钮
				inputValue3    : "", //删除标签的内容
				//分页
				total          : 1, //总条数
				quickJumper    : false, // 是否显示快速跳转的控件
				page           : 1, //页码
				pageSize       : 15, //每页数据条数
				confirmLoading : false, //编辑弹框加载
				confirmLoading2: false, //删除弹框加载
				confirmLoading3: false, //新建标签弹框加载
				oldValue       : '',//编辑之前的标签名
				selectedRowKeys: [],
				agKeys         : [],
				visibleGroup   : false,
				moveGroupId    : '',
				editGroupId    : '',
				groupList      : [],
				groupDisabled  : false,//编辑弹窗中选择分组的置灰
			};
		},

		computed: {
			rowSelection () {
				let that = this
				const {selectedRowKeys} = this;
				return {
					selectedRowKeys,
					onChange             : this.onSelectChange,
					hideDefaultSelections: true,
					// onSelect             : this.onSelectRow,
					selections           : [
						{
							key     : "current-data",
							text    : "当前页",
							onSelect: changableRowKeys => {
								let that = this
								this.tagsList.map(item => {
									let index = that.selectedRowKeys.findIndex((id) => id === item.id);
									if (index >= 0) {
										that.selectedRowKeys.splice(index, 1)
									}
								})
								for (let i = 0; i < changableRowKeys.length; i++) {
									that.selectedRowKeys.push(changableRowKeys[i])
								}
							}
						},
						{
							key     : "all-data",
							text    : "选择所有项",
							onSelect: () => {
								that.selectedRowKeys = [...that.tagKeys.valueOf()]
							}
						}
					],
					onSelection          : this.onSelection
				};
			}
		},

		methods: {
			unique (arr) {
				return Array.from(new Set(arr))
			},
			handleGroupOk () {
				this.moveGroupIds()
			},
			handleCancel () {
				this.visibleGroup = false
			},
			async moveGroupIds () {
				const {data: res} = await this.axios.post("work-tag/remove-tag", {
					new_group_id: this.moveGroupId,
					tag_id      : this.selectedRowKeys,
					type        : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.visibleGroup = false
					this.selectedRowKeys = []
					this.$message.success('移动成功')
					this.getTags()
				}
			},
			changeGroup (id) {
				this.moveGroupId = id
			},
			showModalGroup () {
				this.getTeamsList()
				this.visibleGroup = true
			},
			async getTeamsList () {
				const {data: res} = await this.axios.post("work-tag-group/list", {
					corp_id : this.corpId,
					type    : this.type,
					suite_id: this.suite_id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.info
					this.moveGroupId = this.group_id
					this.editGroupId = this.group_id
				}
			},
			deleteCoustomTags () {
				let that = this;
				that.$confirm({
					title     : "确定删除选中的标签?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.removeCoustomTags();
					}
				});
			},
			async removeCoustomTags () {
				const {data: res} = await this.axios.post("work-tag/delete-more", {
					ids: this.selectedRowKeys,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.visibleGroup = false
					this.selectedRowKeys = []
					this.$message.success('删除成功')
					this.getTags()
				}
			},
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			modalVisibleChange (corpId, suite_id, type, teamId) {
				this.selectedRowKeys = []
				this.corpId = corpId
				this.suite_id = suite_id
				this.type = type
				this.group_id = teamId
				this.getTags();
			}
			,
			// 新建标签
			showModal () {
				this.getTeamsList()
				this.visible = true;
			},
			handleOk (val) {
				let that = this
				that.confirmLoading3 = true
				if (that.tagsList.length >= 3000) {
					that.$message.warning("最多添加3000个标签！");
					that.confirmLoading3 = false;
					return false;
				}
				if (val == "") {
					that.$message.warning("不能为空");
					that.confirmLoading3 = false;
					return false;
				} else {
					for (var i = 0; i < val.split(" ").length; i++) {
						if (val.split(" ")[i].length > 15) {
							that.$message.error("每个标签最多15个字");
							that.confirmLoading3 = false
							that.inputValue = "";
							return false;
						} else if (
							val.split(" ")[i].length > 0
						) {
							that.newTagList.push(val.split(" ")[i]);
							that.confirmLoading3 = false;
						}
					}
					that.addTags();
					that.newTagList = []
					that.inputValue = ""
				}
			},
			async addTags () {
				const {data: res} = await this.axios.post("work-tag/add", {
					corp_id : this.corpId,
					suite_id: this.suite_id,
					type    : this.type,
					group_id: this.editGroupId,
					name    : this.newTagList
				});
				if (res.error != 0) {
					if (res.error_msg == '标签名非法，请注意不能和其他标签重名') {
						this.$message.error('该标签名称与微信标签重复，请手动同步微信标签即可。');
					} else {
						this.$message.error(res.error_msg);
					}
					this.confirmLoading3 = false;
				} else {
					this.isLoading = true;
					this.getTags();
					this.inputValue = "";
					this.newTagList = []
				}
			},
			cancel () {
				this.inputValue = ''
				this.visible = false
			},
			//编辑按钮
			showModal2 (record) {
				this.getTeamsList()
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.length == 1 && list[0] === "all") {
					this.groupDisabled = false
				} else {
					if (list.indexOf('work-tag-remove') != -1) {
						//存在
						this.groupDisabled = false
					} else {
						this.groupDisabled = true
					}
				}
				this.visible2 = true;
				this.oldValue = record.tagname;
				this.inputValue2 = record.tagname
				this.tagId = record.key;
			},
			handleOk2 (e) {
				this.confirmLoading = true
				if (this.inputValue2 == '') {
					this.$message.error('请填写标签名称');
					this.confirmLoading = false
					return false
				} else {
					this.confirmLoading = false
					this.visible2 = false
					this.editTag();
				}
			},
			async editTag () {
				const {data: res} = await this.axios.post("work-tag/update", {
					name    : this.inputValue2,
					id      : this.tagId,
					type    : this.type,
					group_id: this.editGroupId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.$message.success('修改成功');
					this.confirmLoading = false
					this.isLoading = true
					if(this.editGroupId != this.groupId && this.tagsList.length == 1 && this.page > 1) {
						this.getTags(this.page - 1, this.pageSize)
					} else {
						this.getTags(this.page, this.pageSize)
					}
					this.editGroupId = ""
				}
			},
			//删除按钮
			showModal3 (text, record) {
				// console.log(record)
				this.visible3 = true;
				this.tagId = record.key;
				this.inputValue3 = record.tagname;
			},
			handleOk3 (e) {
				this.confirmLoading2 = true
				this.deleteTags();
			},
			async deleteTags () {
				const {data: res} = await this.axios.post("work-tag/delete", {
					id: this.tagId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading2 = false
				} else {
					this.confirmLoading2 = false
					if(this.tagsList.length == 1 && this.page > 1) {
						this.getTags(this.page - 1, this.pageSize)
					} else {
						this.getTags(this.page, this.pageSize)
					}
				}
			},

			//同步标签
			async sysTag () {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-tag/sync-work-tag", {
					corp_id : this.corpId,
					suite_id: this.suite_id,
					group_id: this.group_id,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message
						.info("已进入后台刷新中，请耐心等待...", 2.5)
						.then(() => this.$message.error(res.error_msg, 2.5))
				} else {
					message.info("已进入后台刷新中，请耐心等待...");

					this.getTags();
				}
			},
			//获取表格内容
			async getTags (page = 1, pageSize = this.pageSize) {
				let groupId = []
				groupId.push(String(this.group_id))
				const {data: res} = await this.axios.post("work-tag/list", {
					corp_id : this.corpId,
					suite_id: this.suite_id,
					type    : this.type,
					group_id: groupId,
					page    : page,
					pageSize: pageSize,
					is_all  : 0,//0 不展示所有（带分页的）  1 展示所有（不带分页的
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.tagsList = res.data.info;
					this.tagKeys = res.data.tag_ids
					this.lastTagTime = res.data.last_sys_time;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					this.confirmLoading = false
					this.visible2 = false;
					this.confirmLoading2 = false
					this.visible3 = false;
					this.confirmLoading3 = false
					this.visible = false;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getTags(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,140)
				})
			},
			showSizeChange (page, pageSize) {
				this.getTags(1, pageSize);
			}
		},

		created () {
		}
	};
</script>

<style lang='less' scoped>
	.wx-info {
		width: 100%;
		position: absolute;
		left: 0;
		top: 100px;
		bottom: 0;
		overflow: hidden;
	}

	.wx-info::-webkit-scrollbar {
		width: 2px;
		height: 100%;
	}

	.wx-info::-webkit-scrollbar-track-piece {
		background-color: #FFFFFF;
	}

	.wx-info::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #FFFFFF;
	}

	/*.wx-info::-webkit-scrollbar-track*/
	/*{*/
	/*	border-radius: 10px;  !*滚动条的背景区域的圆角*!*/
	/*	background-color: white;!*滚动条的背景颜色*!*/
	/*}*/
	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}


	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
		border-right: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 10px;
		margin-top: 12px;
	}

	.msg-info {
		color: #FFDDA6;
		margin-right: 10px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.content-hd-left {
		float: left;
	}

	.content-hd-right {
		float: right;
	}

	.btn-primary {
		/*width: 145px;*/
		/*height: 30px;*/
		margin-left: 20px;
		/*text-align: left;*/
		/*padding: 0;*/

		/*span {*/
		/*	display: inline-block;*/
		/*	width: 90px;*/
		/*	height: 30px;*/
		/*	line-height: 30px;*/
		/*	text-align: center;*/
		/*}*/
	}

	.sider-one {
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.selectWx {
		width: 200px;
		margin-left: 20px;
		/*margin: auto;*/
		height: 50px;
		line-height: 50px;
		cursor: pointer;
		padding-left: 10px;
	}

	.active {
		background: #1E90FF;
		color: white;
	}

	.tag-name {
		padding: 6px 14px;
		height: 34px;
		font-size: 13px;
		border: 1px solid #D9D9D9;
		background-color: transparent !important;
		color: rgba(0, 0, 0, 0.65);
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 47px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .wxtpl .ant-radio-button-wrapper-checked {
		border: 2px solid #1890FF !important;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}
</style>
