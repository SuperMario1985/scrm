<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;font-size: 16px;">
				<label class="tpl-title">通知</label>
			</a-card>

			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-row>
							<div class="content-msg">
								<p style="margin-bottom: 2px;">
									用于将规则内的消息通过选择的应用提醒给规则接收者</p>
							</div>
						</a-row>

						<a-row style="margin-bottom:20px;padding:0 20px;">
							<a-col v-if="corpInfo.length > 1" style="float:left;">
								<a-select
										showSearch
										optionFilterProp="children"
										style="width: 200px;"
										@change="handleChange"
										v-model="corpId"
								>
									<template v-for="item in corpInfo">
										<a-select-option :value="item.corpid">
											{{item.corp_full_name || item.corp_name}}
										</a-select-option>
									</template>
								</a-select>
							</a-col>

							<a-col style="float:right;">
								<a-button
										type="primary"
										
										:disabled="forbidden"
										@click="add"
										style="width: 150px;font-size:14px;" v-has="'redirect-add'">
									新建
								</a-button>
							</a-col>
						</a-row>

						<a-row style="margin-bottom:20px;padding:0 20px;">
							<a-col>
								<!-- 表格部分 -->
								<div class="content-bd">
									<a-spin tip="加载中..." size="large" :spinning="isTabLoading">
										<a-table :columns="columns" :dataSource="relationList" :pagination="false"
										         :rowClassName="rowClassName" v-has="'redirect-list'">
											<template slot="notice_name" slot-scope="text, record, index">
												<span>{{record.notice_name}}</span>
											</template>

											<template slot="agent_name" slot-scope="text, record, index">
												<template v-for="item in record.info">
													<a-avatar
															v-if="item.agent_info.square_logo_url"
															shape="square"
															:src="item.agent_info.square_logo_url"
															style="float: left;"/>
													<img
															style="width: 32px;height: 32px;float: left;"
															v-if="!item.agent_info.square_logo_url"
															src="../../../assets/useradvart.png"/>
													<div style="float: left;max-width: 230px;word-wrap:break-word;line-height: 32px; height: 32px;">
														<p style="margin-left: 10px;">{{item.agent_info.name}}</p>
													</div>
												</template>
											</template>

											<template slot="categories" slot-scope="text, record, index">
												<a-tag v-for="item in relationCategoryList['rule_' + record.id]"
												       color="orange">
													{{item}}
												</a-tag>
											</template>

											<template slot="notice_user" slot-scope="text, record, index">
												<a-tag v-for="item in relationUserList['rule_' + record.id]"
												       color="blue">
													{{item}}
												</a-tag>
											</template>

											<template slot="status" slot-scope="text, record, index">
												<span v-if="record.status == 0">已关闭</span>
												<span v-if="record.status == 1">已开启</span>
											</template>

											<template slot="action" slot-scope="text, record,index">
												<!--<a-button
														style="margin: 0px 5px 5px 0px;"
														@click="edit(index)">
													编辑
												</a-button>-->
												<a-popconfirm
														title="确定开启吗?"
														@confirm="changeRelation(record.id, 1)"
														okText="确定"
														cancelText="取消"
												>
													<a-button
															v-if="record.status == 0"
															style="margin: 0px 5px 5px 0px;" v-has="'redirect-close'">
														开启
													</a-button>
												</a-popconfirm>
												<a-popconfirm
														title="确定关闭吗?"
														@confirm="changeRelation(record.id, 0)"
														okText="确定"
														cancelText="取消"
												>
													<a-button
															v-if="record.status == 1"
															style="margin: 0px 5px 5px 0px;" v-has="'redirect-close'">
														关闭
													</a-button>
												</a-popconfirm>
												<a-popconfirm
														title="确定删除吗?"
														@confirm="delRelation(record.id)"
														okText="确定"
														cancelText="取消"
												>
													<a-button
															style="margin: 0px 5px 5px 0px;" v-has="'redirect-delete'">
														删除
													</a-button>
												</a-popconfirm>
											</template>
										</a-table>
									</a-spin>
								</div>

								<a-modal
										title="新建通知关系"
										v-model="showAddModal"
										@cancel="handleCancel"
										@ok="handleOk"
										width="750px">
									<div style="padding: 30px 10px;min-height: 300px;overflow: auto;">
										<a-form-item
												:label-col="{ span: 6 }"
												:wrapper-col="{ span: 18 }"
												style="padding-top: 15px;">
											<span slot="label">
												<span style="color: red;"> * </span>规则名称
											</span>

											<a-input
													v-model="noticeName"
													placeholder="请填写规则名称"
													:maxLength="16"
													style="width: 60%">
												<span slot="suffix">
													<span>{{noticeName.length}}</span>/16
												</span>
											</a-input>
										</a-form-item>

										<a-form-item
												:label-col="{ span: 6 }"
												:wrapper-col="{ span: 18 }"
												style="padding-top: 15px;">
											<span slot="label">
												<span style="color: red;"> * </span>消息类别
											</span>

											<template v-for="(category, categoryId) in categories">
												<a-checkable-tag
														:key="category"
														:checked="selectedCategories.indexOf(category) > -1"
														@change="checked => handleChangeCategory(category, checked, categoryId)"
												>
													{{ category }}
												</a-checkable-tag>
											</template>

										</a-form-item>
										<a-form-item
												:label-col="{ span: 6 }"
												:wrapper-col="{ span: 18 }"
												style="padding-top: 15px;">
											<span slot="label">
												<span style="color: red;"> * </span>发送应用
											</span>

											<a-select showSearch optionFilterProp="children"
											          v-model="agentId"
											          style="width: 60%"
											          placeholder="请选择发送应用"
											>
												<a-select-option v-for="(info, agentIndex) in agentList" :key="info.id">
													{{info.name}}
												</a-select-option>
											</a-select>
											<div>
												<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a
														target="_blank"
														href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
													企业微信后台</a>创建自建应用。
													<!-- <a target="_blank"
												                        href="https://support.qq.com/products/104790/faqs/63937">
													教程</a> -->
													</p>
												<p style="height: 20px; line-height: 20px; margin-bottom: 2px">
													2、选择此应用，请确认已设置过应用的可信域名。<a
														:href="$store.state.commonUrl+'/upload/slider.png'"
														target="_blank"
														class="el-link el-link--primary">
													<span class="el-link--inner">查看图示</span>
												</a></p>
											</div>
										</a-form-item>

										<a-form-item
												:label-col="{ span: 6 }"
												:wrapper-col="{ span: 18 }"
												style="padding-top: 15px;">
											<span slot="label">
												<span style="color: red;"> * </span>接收成员
											</span>

											<a-select
													showSearch
													mode="multiple"
													:value="userIds"
													optionFilterProp="children"
													placeholder="请选择"
													style="width: 60%"
													@change="handleChangeUser"
											>
												<a-select-option v-for="user in userList" :key="user.id">
													{{user.name}}
												</a-select-option>
											</a-select>
										</a-form-item>


										<template v-if="agentId != ''">
											<a-form-item>
												<a-alert banner>
													<span slot="message">
														请务必保证该应用已开启 <b>接收消息</b> 并且已经将下边的信息配置到 <b>API接收消息</b>
													</span>
												</a-alert>
											</a-form-item>

											<a-form-item
													:label-col="{ span: 6 }"
													:wrapper-col="{ span: 18 }">
												<span slot="label">应用接收消息URL</span>
												<a-input style="width: calc(100% - 100px);" v-model="$store.state.commonUrl + '/work/event/agent/' + agentId"
												         disabled>
												</a-input>
												<a-button style="margin-left: 5px;" type="primary" @click="copyText($store.state.commonUrl + '/work/event/agent/' + agentId)">复制</a-button>
											</a-form-item>

											<a-form-item
													:label-col="{ span: 6 }"
													:wrapper-col="{ span: 18 }">
												<span slot="label">Token</span>
												<a-input style="width: calc(100% - 100px);" v-model="agentToken"
												         disabled>
												</a-input>
												<a-button style="margin-left: 5px;" type="primary" @click="copyText(agentToken)">复制</a-button>
											</a-form-item>

											<a-form-item
													:label-col="{ span: 6 }"
													:wrapper-col="{ span: 18 }">
												<span slot="label">EncodingAESKey</span>
												<a-input style="width: calc(100% - 100px);" v-model="agentEncodingAESKey"
												         disabled>
												</a-input>
												<a-button style="margin-left: 5px;" type="primary" @click="copyText(agentEncodingAESKey)">复制</a-button>
											</a-form-item>
										</template>
									</div>
								</a-modal>
							</a-col>
						</a-row>
					</div>
				</a-spin>
			</div>
		</div>
	</div>
</template>

<script>
	const columns = [
		{
			title      : "规则名称",
			dataIndex  : "notice_name",
			width      : 200,
			key        : "notice_name",
			scopedSlots: {customRender: "notice_name"}
		},
		{
			title      : "发送应用",
			dataIndex  : "agent_name",
			key        : "agent_name",
			scopedSlots: {customRender: "agent_name"},
		},
		{
			title      : "类别",
			dataIndex  : "categories",
			key        : "categories",
			scopedSlots: {customRender: "categories"}
		},
		{
			title      : "通知人",
			dataIndex  : "notice_user",
			key        : "notice_user",
			scopedSlots: {customRender: "notice_user"},
		},
		{
			title      : "状态",
			dataIndex  : "status",
			width      : 80,
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			width      : "18%",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		name   : "Rule",
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				forbidden           : false,
				isLoading           : true,
				isTabLoading        : false,
				corpId              : corpId,// 企业微信选中的id
				corpInfo            : [], // 企业微信列表
				categories          : [], // 会话存档类别
				selectedCategories  : [],
				selectedCategoryIds : [],
				agentId             : [],
				agentList           : [],
				agentToken          : '',
				agentEncodingAESKey : '',
				noticeName          : "",
				userIds             : [],
				userList            : [],
				columns,    //表格部分
				relationList        : [],    // 关系数据
				relationCategoryList: [],    // 关系类别数据
				relationUserList    : [],    // 关系用户数据
				showAddModal        : false,
			}
		},
		methods: {
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			async getList () {
				const {data: res} = await this.axios.post('work-msg-audit/get-rule-list', {
					corp_id: this.corpId,
				})

				if (res.error != 0) {
					this.forbidden = true
					this.$message.destroy()
					this.$message.error(res.error_msg)
				} else {
					this.forbidden = false
					this.relationList = res.data

					let _this = this
					_this.relationList.map((relation) => {
						if (typeof _this.relationCategoryList['rule_' + relation.id] == "undefined") {
							_this.relationCategoryList['rule_' + relation.id] = [];
						}

						if (typeof _this.relationUserList['rule_' + relation.id] == "undefined") {
							_this.relationUserList['rule_' + relation.id] = [];
						}

						for (let noticeInfo in relation.info) {
							for (let cate in relation.info[noticeInfo].notice_info) {
								if (_this.relationCategoryList['rule_' + relation.id].indexOf(relation.info[noticeInfo].notice_info[cate].category_name) == -1) {
									_this.relationCategoryList['rule_' + relation.id].push(relation.info[noticeInfo].notice_info[cate].category_name)
								}

								for (let user in relation.info[noticeInfo].notice_info[cate].user_info) {
									if (_this.relationUserList['rule_' + relation.id].indexOf(relation.info[noticeInfo].notice_info[cate].user_info[user].user_info.name) == -1) {
										_this.relationUserList['rule_' + relation.id].push(relation.info[noticeInfo].notice_info[cate].user_info[user].user_info.name)
									}
								}
							}
						}
					})
				}


				this.isLoading = false
				this.isTabLoading = false
			},
			async getCategories () {
				const {data: res} = await this.axios.post('work-msg-audit/get-categories')

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.categories = res.data
				}
			},
			handleChange (value) {
				this.corpInfo.map((x) => {
					if (value == x.corpid) {
						this.$store.commit("changeCorpAuthType", x.auth_type)
						this.$store.commit("changeCorpName", x.corp_name)
					}
				})
				this.$store.commit("changeCorpId", value)
				this.isTabLoading = true

				this.getList()
				if (localStorage.getItem('isMasterAccount') == 2) {
					this.$store.dispatch('getPermissionButton')
				}
			},
			add () {
				this.isLoading = true
				this.addFunction()
			},
			async addFunction () {
				const {data: agentRes} = await this.axios.post('work-agent/list', {
					corp_id: this.corpId,
				})

				if (agentRes.error != 0) {
					this.$message.error(agentRes.error_msg)
				} else {
					this.isLoading = false
					if (agentRes.data.normal.custom.length > 0) {
						this.agentList = agentRes.data.normal.custom
						this.agentToken = agentRes.data.normal.token
						this.agentEncodingAESKey = agentRes.data.normal.encoding_AES_key
					} else {
						let _this = this
						this.$confirm({
							title  : '无法创建',
							content: "你还没有创建可用的自建应用，前往【应用中心】创建",
							onOk () {
								_this.$router.push('/agent/list')
							},
							onCancel () {
								console.log('cancel')
							},
							class  : 'choose-confirm-modal',
						});

						return false
					}
				}

				this.showAddModal = true
			},
			async getAgentUser () {
				const {data: res} = await this.axios.post('work-agent/get-user', {
					corp_id : this.corpId,
					agent_id: this.agentId,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.userIds = []
					this.userList = res.data.user_info
				}
			},
			handleCancel () {
				this.showAddModal = false
				this.noticeName = ''
				this.userIds = []
				this.agentId = []
				this.agentList = []
				this.userList = []
				this.selectedCategories = []
				this.selectedCategoryIds = []
			},
			async handleOk () {
				if (this.noticeName == '') {
					this.$message.error("规则名称不能为空")

					return false
				}
				if (this.selectedCategoryIds.length == 0) {
					this.$message.error("请选择消息类别")

					return false
				}
				if (this.agentId == '') {
					this.$message.error("请选择发送应用")

					return false
				}
				if (this.userIds.length == 0) {
					this.$message.error("请选择接收成员")

					return false
				}


				const {data: res} = await this.axios.post('work-msg-audit/set-rule', {
					corp_id     : this.corpId,
					title       : this.noticeName,
					agent_id    : this.agentId,
					category_ids: this.selectedCategoryIds.join(','),
					users       : this.userIds.join(','),
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.$message.success('添加成功')

					this.getList()

					this.handleCancel()
				}
			},
			async changeRelation (relationId, status) {
				const {data: res} = await this.axios.post('work-msg-audit/change-rule', {
					corp_id: this.corpId,
					rule_id: relationId,
					status : status,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.getList()
				}
			},
			async delRelation (relationId) {
				const {data: res} = await this.axios.post('work-msg-audit/del-rule', {
					corp_id: this.corpId,
					rule_id: relationId,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.getList()
				}
			},
			handleChangeCategory (category, checked, categoryId) {
				const {selectedCategories, selectedCategoryIds} = this;
				const nextSelectedCategories = checked
					? [...selectedCategories, category]
					: selectedCategories.filter(t => t !== category);

				const nextSelectedCategoryIds = checked
					? [...selectedCategoryIds, categoryId]
					: selectedCategoryIds.filter(t => t !== categoryId);

				this.selectedCategories = nextSelectedCategories;
				this.selectedCategoryIds = nextSelectedCategoryIds;
			},
			handleChangeUser (value) {
				this.userIds = value
			},
			//复制链接
			copyText (value) {
				let that = this
				const input = document.createElement('input')
				document.body.appendChild(input)
				input.setAttribute('value', value)
				input.select()
				if (document.execCommand('copy')) {
					document.execCommand('copy')
					that.$message.success("复制成功！")
				}
				document.body.removeChild(input)
			},
		},
		created () {
			this.getCategories()
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.$emit('changeCorpId', this.corpId)

				this.getList()
			});
		},
		watch  : {
			agentId (newValue, oldValue) {
				if (newValue != '' && newValue != oldValue) {
					this.getAgentUser()
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.content-msg {
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 10px;
		margin: 0px 20px 20px 20px;
	}
</style>