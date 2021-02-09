<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider>
					<!-- 企业微信 -->
					<team ref="tagTeam" :callback="changeGroupId"></team>
				</a-layout-sider>
				<a-layout style="position: absolute;left:250px;top:0;bottom:0;right:0;" class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>客户标签管理</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">客户标签管理</div>
						<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
							<p style="margin-bottom: 2px;">
								1、标签分组名称不能重复。</p>
							<p style="margin-bottom: 2px;">
								2、标签总数量不限制。
<!--								，但给每个客户打标签最多为20个。-->
							</p>
							<p style="margin-bottom: 2px;">3、标签分组一旦被删除，归属于该分组的标签均将移至【未分组】。</p>
							<p style="margin-bottom: 2px;">4、【未分组】为固定存在，不可修改名称，亦不可删除。</p>
							<p style="margin-bottom: 2px;" v-if="noSecret">
								5、自建应用只能编辑/删除自建的标签，如需全量编辑/删除请填写客户联系secret</p>
							<p style="margin-bottom: 2px;" v-if="noSecret">
								6、外部联系人Secret：可在<a target="_blank" href="https://work.weixin.qq.com/wework_admin/frame">
								企业微信管理后台</a>- 客户联系 – 客户 – 点开 API 小按钮获得。
								<a-popover placement="bottom" style="margin-left: 5px;">
									<template slot="content">
										<img style="width: 700px;" src="../../../assets/customTag/secret.png"/>
									</template>
									<a-icon type="question-circle" style="margin-left:5px;"/>
								</a-popover>
							</p>
						</div>
						<div class="content-hd">
							<a-button v-if="noSecret" type="primary" icon="key" @click="addSecret()"
							          v-has="'client-tag-sync'">
								填写密钥
							</a-button>
							<div class="content-hd-right">
								<label v-if="lastTagTime && !noBindFlag">最后一次同步时间：{{lastTagTime}}</label>
								<a-button v-if="!noBindFlag" class="btn-primary" icon="reload" @click="sysTag()"
								          v-has="'client-tag-sync'">
									同步企业微信标签
								</a-button>
								<a-button class="btn-primary" icon="delete" @click="deleteCoustomTags()"
								          :disabled="selectedRowKeys.length == 0" type="primary"
								          v-has="'client-tag-delete'">
									删除标签
								</a-button>
								<a-button class="btn-primary" icon="retweet" @click="showModalGroup()"
								          :disabled="selectedRowKeys.length == 0" type="primary"
								          v-has="'client-tag-remove'">
									移动标签
								</a-button>
								<a-button class="btn-primary" icon="plus" @click="showModal('add')" type="primary"
								          v-has="'client-tag-add'">
									新建标签
								</a-button>
								<a-modal title="新建标签" v-model="visible" @ok="handleOk(inputValue)"
								         :confirmLoading="confirmLoading3" style="height: 500px" @cancel="cancel">
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
											每个标签名称最多15个字。同时新建多个标签时，请用“空格”隔开
										</p>
										<a-input placeholder="请输入标签（不得超过15个字符）" v-model="inputValue"/>
									</a-form-item>

								</a-modal>
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="tagsList" :pagination="false"
								         :rowSelection="rowSelection" :rowClassName="rowClassName"
								         v-has="'client-tag-list'">
									<!--									<span slot="group" >-->
									<!--										<span>{{groupName}}</span>-->
									<!--					                </span>-->
									<span slot="tags" slot-scope="name">
										<a-tag color="#2db7f5" class="tag-name" style="">{{name}}</a-tag>
					                </span>
									<span slot="num">
						                  客户数
						                  <a-tooltip placement="bottom">
						                    <template slot="title">
						                      <span>包含企微客户、非企微客户和导入客户。存在多个企业成员管理同一个客户，他们对该客户均打了同一个标签，则标签下的客户数重复计入。 </span>
						                    </template>
						                    <a-icon type="question-circle" style="margin-left:5px;"/>
						                  </a-tooltip>
						                </span>
									<span slot="action" slot-scope="text, record">
										<span @click="showModal2(text, record)"
										      style="color: #01b065;margin-right: 25px;cursor: pointer;"
										      v-has="'client-tag-edit'">编辑</span>
										<span @click="showModal3(text, record)" style="color: #01b065;cursor: pointer;"
										      v-has="'client-tag-delete'">删除</span>
					                </span>
								</a-table>

								<!-- 编辑按钮弹窗 -->
								<a-modal title="修改标签名称" v-model="visible2" @ok="handleOk2"
								         :confirmLoading="confirmLoading">
									<div>
										<a-form-item :label-col="{ span: 4 }"
										             :wrapper-col="{ span: 20 }">
											<template slot="label">
												选择分组
											</template>
											<a-select showSearch v-model="editGroupId" optionFilterProp="children"
											          style="width: 180px;" :disabled="groupDisabled">
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
									</div>
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
								<!-- 分页 -->
								<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0"
								     v-has="'client-tag-list'">
									<div class="content-hd-left" style="margin-left: 10px;">
										共有
										<span style="color: blue">{{total}}</span>个标签
									</div>
									<div style="float: right;">
										<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
										              :current="page"
										              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
										              @change="changePage"
										              @showSizeChange="showSizeChange"/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>

				</a-layout>
			</a-layout>
		</div>
		<a-modal title="选择分组" v-model="visibleGroup" @ok="handleGroupOk" @cancel="handleCancel" width="888">
			<a-spin tip="加载中..." size="large" :spinning="handleLoading">
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
			</a-spin>
		</a-modal>
		<a-modal title="添加外部联系人管理secret" v-model="secretVisible" @cancel="handleCancelSecret" width="666px!important">
			<template slot="footer">
				<a-button key="back" @click="handleCancelSecret">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading2"
						@click="handleSecretOk"
				>提交
				</a-button>
			</template>
			<a-form>
				<div class="content-msg">
					<p style="margin-bottom: 0px;">
						外部联系人Secret：可在<a target="_blank" href="https://work.weixin.qq.com/wework_admin/frame">
						企业微信管理后台</a>- 客户联系 – 客户 – 点开 API 小按钮获得。
						<a-popover placement="bottom" style="margin-left: 5px;">
							<template slot="content">
								<img style="width: 700px;" src="../../../assets/customTag/secret.png"/>
							</template>
							<a-icon type="question-circle" style="margin-left:5px;"/>
						</a-popover>
					</p>
				</div>
				<a-form-item style="margin-top: 10px;" label="外部联系人管理secret" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
					<a-input placeholder="填写外部联系人管理secret" v-model="secret"></a-input>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import team from '../../../components/eWeChat/team'

	const columns = [
		{
			title      : "标签名称",
			dataIndex  : "tagname",
			scopedSlots: {customRender: "tags"},
			key        : "tagname"
		},
		// {
		// 	title      : "所属分组",
		// 	dataIndex  : "group",
		// 	width      : "25%",
		// 	scopedSlots: {customRender: "group"},
		// 	key        : "group"
		// },
		{
			// title    : "客户数",
			dataIndex: "num",
			key      : "num",
			slots    : {title: "num"},
		},
		{
			title      : "客户群数",
			dataIndex  : "chatNum",
			key        : "chatNum"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];
	export default {
		components: {
			team
		},
		computed  : {
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
		data () {
			let changeBackground = localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				noSecret        : false, // 是否填写密钥
				secretVisible   : false, // 填写密钥弹窗
				secret          : '', // 密钥
				loading2        : false, // 密钥提交
				tagKeys         : [],
				selectedRowKeys : [], // 选择多少条
				suite_id        : '',
				lastTagTime     : '',
				groupId         : '',
				tagsList        : [], //表格信息
				isLoading       : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				wxInfo          : [], //微信公众号列表
				visible         : false, //新建标签
				inputValue      : "", //新建标签输入框值
				newTagList      : [], //新建标签数组
				visible2        : false, //编辑按钮
				inputValue2     : "", //编辑标签的内容
				tagId           : "", //标签id
				visible3        : false, //删除按钮
				inputValue3     : "", //删除标签的内容
				//分页
				total           : 1, //总条数
				quickJumper     : false, // 是否显示快速跳转的控件
				page            : 1, //页码
				pageSize        : 15, //每页数据条数
				changeBackground: changeBackground, //选中背景色
				confirmLoading  : false, //编辑弹框加载
				confirmLoading2 : false, //删除弹框加载
				confirmLoading3 : false, //新建标签弹框加载
				oldValue        : '',//编辑之前的标签名
				groupList       : [],
				editGroupId     : '',
				groupName       : '',
				moveGroupId     : '',
				visibleGroup    : false,
				noBindFlag      : false,
				groupDisabled   : false,//编辑弹窗中选择分组的置灰
				handleLoading   : false
			};
		},

		methods: {
			unique (arr) {
				return Array.from(new Set(arr))
			},
			handleGroupOk () {
				this.handleLoading = true
				this.moveGroupIds()
			},
			handleCancel () {
				this.handleLoading = false
				this.visibleGroup = false
			},
			async moveGroupIds () {
				const {data: res} = await this.axios.post("work-tag/remove-tag", {
					new_group_id: this.moveGroupId,
					tag_id      : this.selectedRowKeys,
					type        : 0
				});
				if (res.error != 0) {
					this.handleLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.visibleGroup = false
					this.selectedRowKeys = []
					this.$message.info(res.data.textHtml)
					this.isLoading = true
					this.handleLoading = false
					this.getTags()
				}
			},
			changeGroup (id) {
				this.moveGroupId = id
			},
			showModalGroup () {
				this.getTeamsList(2)
			},
			async addSecret() {
				this.secretVisible = true
			},
			async handleSecretOk() {
				this.loading2 = true
				if (this.secret.trim() == '' || this.secret.replace(/\n/g, '') == '') {
					this.$message.destroy()
					this.$message.warning('请输入外部联系人管理secret')
					this.loading2 = false
					return false
				}
				const {data: res} = await this.axios.post("work-corp/supply-data", {
					corp_id : this.corpId,
					external_secret : this.secret
				});
				if (res.error != 0) {
					this.loading2 = false
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('添加成功')
					setTimeout(function () {
						location.reload()
					}, 1000);

				}
			},
			handleCancelSecret() {
				this.secretVisible = false
				this.secret = ''
			},
			async sysTag () {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-tag/sync-work-tag-external", {
					corp_id : this.corpId,
					suite_id: this.suite_id,
					// group_id: this.group_id,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message
						.info("已进入后台刷新中，请耐心等待...", 2.5)
						.then(() => this.$message.error(res.error_msg, 2.5))
				} else {
					message.info("已进入后台刷新中，请耐心等待...");
					this.$refs.tagTeam.getTeamsList(this.groupId)
					// this.getTags();
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
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.visibleGroup = false
					this.selectedRowKeys = []
					this.isLoading = true
					this.$message.info(res.data.textHtml)
					this.getTags()
				}
			},
			// onSelectRow (record, selected) {
			// 	if (selected) {
			// 		this.selectedRowKeys.push(record.key)
			// 	} else {
			// 		this.selectedRowKeys.remove(record.key)
			// 	}
			// 	this.selectArr = false
			// },
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
				// debugger
				// let that = this
				// this.tagsList.map(item => {
				// 	let index = that.selectedRowKeys.findIndex((id) => id === item.id);
				// 	if(index >= 0) {
				// 		that.selectedRowKeys.splice(index, 1)
				// 	}
				// })
				// for(let i = 0; i < selectedRowKeys.length; i++) {
				// 	that.selectedRowKeys.push(selectedRowKeys[i])
				// }
			},
			//获取分组列表
			async getTeamsList (type) {
				const {data: res} = await this.axios.post("work-tag-group/list", {
					corp_id : this.corpId,
					type    : this.type,
					suite_id: this.suite_id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.info;
					this.editGroupId = this.groupId
					if (type == 1) {
						this.visible2 = true
					} else if (type == 0) {
						this.visible = true;
					} else if (type == 2) {
						this.moveGroupId = this.groupId
						this.visibleGroup = true
					}
				}
			},
			changeGroupId (corpId, suite_id, type, groupId, groupName) {
				this.selectedRowKeys = []
				this.corpId = corpId
				this.groupId = groupId
				this.suite_id = suite_id
				this.type = type
				this.groupName = groupName
				this.noBindFlag = false
				for (let i = 0; i < this.$store.state.noBindCorpArr.length; i++) {
					if (this.corpId == this.$store.state.noBindCorpArr[i].corpid) {
						this.noBindFlag = true
					}
				}
				this.isLoading = true
				this.getTags(1, this.pageSize)
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			wxInfoMouseOver () {
				this.$refs.wxInfo.style.overflowY = "auto";
			},
			wxInfoMouseOut () {
				this.$refs.wxInfo.style.overflowY = "hidden";
			},
			// 公众号
			handleChange (value) {
				this.wxInfo.map((x) => {
					if (value == x.wx_id) {
						this.$store.commit("changeAuthorizerType", x.authorizer_type);
						this.$store.commit("changeWxNickName", x.nick_name);
					}
				})
				this.$store.dispatch("changeWxNum", value);
				this.getTags();
				this.isLoading = true;
				this.changeBackground = value
			},
			selectWx (id, authorizer_type, nick_name) {
				this.$store.dispatch("changeWxNum", id);
				this.getTags();
				this.isLoading = true;
				this.changeBackground = id
				this.$store.commit("changeAuthorizerType", authorizer_type);
				this.$store.commit("changeWxNickName", nick_name);
			},
			showConfirmWx () {
				this.$success({
					title: this.$store.state.wxNickName + '已取消授权，无法操作',
				});
			},
			// 新建标签
			showModal () {
				this.getTeamsList(0);
				// this.visible = true;
			},
			handleOk (val) {
				let that = this
				that.confirmLoading3 = true
				if (val == "") {
					that.$message.warning("不能为空");
					that.confirmLoading3 = false;
					return false;
				} else {
					this.newTagList = []
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
					name    : this.newTagList,
					group_id: this.editGroupId,
					type    : this.type,
					suite_id: this.suite_id,
					corp_id : this.corpId,
				});
				if (res.error != 0) {
					if (res.error_msg == '标签名非法，请注意不能和其他标签重名') {
						this.$message.error('该标签名称与微信标签重复，请手动同步微信标签即可。');
					} else {
						this.$message.error(res.error_msg);
					}
					this.confirmLoading3 = false
				} else {
					this.$message.success('添加成功')
					this.isLoading = true;
					this.getTags(1, 15);
					this.inputValue = "";
					this.newTagList = []
				}
			},
			cancel () {
				this.inputValue = ''
				this.visible = false
			},
			//编辑按钮
			showModal2 (text, record) {
				this.getTeamsList(1)
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.length == 1 && list[0] === "all") {
					this.groupDisabled = false
				} else {
					if (list.indexOf('client-tag-remove') != -1) {
						//存在
						this.groupDisabled = false
					} else {
						this.groupDisabled = true
					}
				}
				// this.visible2 = true;
				this.oldValue = record.name;
				this.inputValue2 = record.tagname
				this.tagId = record.key;
			},
			handleOk2 (e) {
				this.confirmLoading = true
				if (this.inputValue2 == '') {
					this.$message.error('请填写标签名称');
					this.confirmLoading = false
					return false
				} else if (this.inputValue2 == this.oldValue) {
					this.$message.success('提交成功');
					this.confirmLoading = false
					this.visible2 = false
				} else {
					this.editTag();
				}
			},
			async editTag () {
				const {data: res} = await this.axios.post("work-tag/update", {
					name    : this.inputValue2,
					group_id: this.editGroupId,
					type    : this.type,
					suite_id: this.suite_id,
					corp_id : this.corpId,
					id      : this.tagId,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.$message.success('修改成功');
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
					this.isLoading = true
					if(this.tagsList.length == 1 && this.page > 1) {
						this.getTags(this.page - 1, this.pageSize)
					} else {
						this.getTags(this.page, this.pageSize)
					}
				}
			},
			//获取表格内容
			async getTags (page = 1, pageSize = this.pageSize) {
				let group_id = []
				group_id.push(String(this.groupId))
				const {data: res} = await this.axios.post("work-tag/list", {
					corp_id : this.corpId,
					suite_id: this.suite_id,
					group_id: group_id,
					type    : this.type,
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
					this.lastTagTime = res.data.last_customer_tag_time;
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
				this.isLoading = true
				this.getTags(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,140)
				})
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getTags(1, pageSize);
			}
		},
		created () {
			this.noSecret = JSON.parse(localStorage.getItem('corpArr')).find(corp => corp.corpid == localStorage.getItem('corpId')).is_supply == 1
			// this.$store.dispatch('getWx', (info) => {
			// 	this.wxInfo = info;
			// 	if (!this.changeBackground && this.wxInfo.length > 0) {
			// 		this.changeBackground = this.$store.state.wxNum;
			// 	}
			// });
			// this.getTags();
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

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
		border: 1px solid @border-color;
		background: @color-bgc;
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
		background: #01b065;
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
		border: 2px solid #01b065 !important;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}
</style>
