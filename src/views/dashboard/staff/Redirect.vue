<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;font-size: 16px;">
				<label class="tpl-title">消息互通</label>
				<help-icon help-url="https://support.qq.com/products/104790/faqs/64893"></help-icon>
			</a-card>

			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-row>
							<div class="content-msg">
								<p style="margin-bottom: 2px;">
									用于将公众号的粉丝消息和小程序的用户消息自动通过自建应用提醒到相应的企业微信成员。</p>
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
								<a-dropdown>
									<a-menu slot="overlay" @click="add">
										<a-menu-item key="1">公众号</a-menu-item>
										<a-menu-item key="2">小程序</a-menu-item>
									</a-menu>
									<a-button
											type="primary"
											icon="plus"
											style="width: 150px;font-size:14px;" v-has="'redirect-add'">
										新建
										<a-icon type="down"/>
									</a-button>
								</a-dropdown>
							</a-col>
						</a-row>

						<a-row style="margin-bottom:20px;padding:0 20px;">
							<a-col>
								<!-- 表格部分 -->
								<div class="content-bd">
									<a-spin tip="加载中..." size="large" :spinning="isTabLoading">
										<a-table :columns="columns" :dataSource="relationList" :pagination="false"
										         :rowClassName="rowClassName" v-has="'redirect-list'">
											<template slot="name" slot-scope="text, record, index">
												<a-avatar
														v-if="record.user.thumb_avatar"
														shape="square"
														:src="record.user.thumb_avatar"
														style="float: left;"/>
												<img
														style="width: 32px;height: 32px;float: left;"
														v-if="!record.user.thumb_avatar"
														src="../../../assets/useradvart.png"/>
												<div style="float: left;max-width: 270px;word-wrap:break-word;">
													<div style="display: inline-block; margin-left: 10px;max-width: 140px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{record.user.name}}</div>
													<div style="display: inline-block; margin-left: 10px;max-width: 140px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-show="record.user.position !== ''">
														（{{record.user.position}}）
													</div>
												</div>
												<span style="vertical-align: sub;">
												<a-icon
														slot="prefix"
														type="man"
														style="margin-left: 10px;color: #427EBA;"
														v-if="record.user.gender==1"/>
												<a-icon
														slot="prefix"
														type="woman"
														style="margin-left: 10px;color: #ED4997;"
														v-if="record.user.gender==2"/>
											</span>
											</template>

											<span slot="department_name" slot-scope="text, record, index">{{record.user.department_name}}</span>

											<template slot="author_name" slot-scope="text, record, index">
												<a-avatar
														v-if="record.author.head_img"
														shape="square"
														:src="record.author.head_img"
														style="float: left;"/>
												<img
														style="width: 32px;height: 32px;float: left;"
														v-if="!record.author.head_img"
														src="../../../assets/useradvart.png"/>
												<div style="float: left;max-width: 230px;word-wrap:break-word;line-height: 32px; height: 32px;">
													<p style="margin-left: 10px;">
														{{record.author.nick_name}}(
														{{record.author.auth_type == 0 ? '公众号' : '小程序'}}
														)</p>
												</div>
											</template>

											<template slot="agent_name" slot-scope="text, record, index">
												<a-avatar
														v-if="record.agent.square_logo_url"
														shape="square"
														:src="record.agent.square_logo_url"
														style="float: left;"/>
												<img
														style="width: 32px;height: 32px;float: left;"
														v-if="!record.agent.square_logo_url"
														src="../../../assets/useradvart.png"/>
												<div style="float: left;max-width: 230px;word-wrap:break-word;line-height: 32px; height: 32px;">
													<p style="margin-left: 10px;">{{record.agent.name}}</p>
												</div>
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
														@confirm="changeRelation(record.key, 1, index)"
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
														@confirm="changeRelation(record.key, 0, index)"
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
														@confirm="delRelation(record.key, index)"
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
										title="新建转发关系"
										v-model="showRedirectModal"
										@cancel="handleCancel"
										@ok="handleOk"
										width="750px">
									<div style="padding: 30px 10px;min-height: 300px;overflow: auto;">
										<a-form-item
												:label-col="{ span: 6 }"
												:wrapper-col="{ span: 18 }"
												style="padding-top: 15px;">
											<span slot="label">
												<span style="color: red;"> * </span>企业成员
											</span>

											<chooseStaffSelect style="width: 60%" :index="0" :index2="0" :callback="selectStaffCallback"></chooseStaffSelect>
										</a-form-item>

										<a-form-item
												v-if="addType==1"
												:label-col="{ span: 6 }"
												:wrapper-col="{ span: 18 }"
												style="padding-top: 15px;">
											<span slot="label">
												<span style="color: red;"> * </span>公众号
											</span>

											<a-select showSearch optionFilterProp="children"
											          v-model="wxNum"
											          style="width: 60%"
											          placeholder="请选择公众号"
											>
												<a-select-option v-for="(info, indexKey) in wxInfo" :key="info.id">
													{{info.nick_name}}
												</a-select-option>
											</a-select>
										</a-form-item>

										<a-form-item
												v-if="addType == 2"
												:label-col="{ span: 6 }"
												:wrapper-col="{ span: 18 }"
												style="padding-top: 15px;">
											<span slot="label">
												<span style="color: red;"> * </span>小程序
											</span>

											<a-select showSearch optionFilterProp="children"
											          v-model="miniNum"
											          style="width: 60%"
											          placeholder="请选择小程序"
											>
												<a-select-option v-for="(info, indexKey) in miniInfo" :key="info.id">
													{{info.nick_name}}
												</a-select-option>
											</a-select>
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
												<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a target="_blank" href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
													企业微信后台</a>创建自建应用。<a target="_blank" href="https://support.qq.com/products/104790/faqs/63937">
													教程</a></p>
												<p style="height: 20px; line-height: 20px; margin-bottom: 2px">2、选择此应用，请确认已设置过应用的可信域名。<a :href="$store.state.commonUrl+'/upload/slider.png'" target="_blank"
												                             class="el-link el-link--primary">
													<span class="el-link--inner">查看图示</span>
												</a></p>
											</div>
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
													:wrapper-col="{ span: 18 }"
													style="padding-top: 15px;">
												<span slot="label">应用接收消息URL</span>
												<a-input style="width: calc(100% - 100px);" v-model="$store.state.commonUrl + '/work/event/agent/' + agentId"
												         disabled>
												</a-input>
												<a-button style="margin-left: 5px;" type="primary" @click="copyText($store.state.commonUrl + '/work/event/agent/' + agentId)">复制</a-button>
											</a-form-item>

											<a-form-item
													:label-col="{ span: 6 }"
													:wrapper-col="{ span: 18 }"
													style="padding-top: 15px;">
												<span slot="label">Token</span>
												<a-input style="width: calc(100% - 100px);" v-model="agentToken"
												         disabled>
												</a-input>
												<a-button style="margin-left: 5px;" type="primary" @click="copyText(agentToken)">复制</a-button>
											</a-form-item>

											<a-form-item
													:label-col="{ span: 6 }"
													:wrapper-col="{ span: 18 }"
													style="padding-top: 15px;">
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
	import helpIcon from "@/components/helpIcon"
	import chooseStaffSelect from "@/components/ChooseStaffSelect"

	const columns = [
		{
			title      : "企业成员",
			dataIndex  : "name",
			width      : 270,
			key        : "name",
			scopedSlots: {customRender: "name"}
		},
		{
			title      : "所属部门",
			dataIndex  : "department_name",
			key        : "department_name",
			scopedSlots: {customRender: "department_name"}
		},
		{
			title      : "公众号/小程序",
			dataIndex  : "author_name",
			key        : "author_name",
			scopedSlots: {customRender: "author_name"},
		},
		{
			title      : "发送应用",
			dataIndex  : "agent_name",
			key        : "agent_name",
			scopedSlots: {customRender: "agent_name"},
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
		name      : "list",
		components: {
			helpIcon,chooseStaffSelect
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				isLoading          : true,
				isTabLoading       : false,
				wxIndex            : '',// 选中的公众号
				wxNum              : [],// 选中的公众号
				wxInfo             : [], // 微信公众号列表
				miniNum            : [],// 选中的小程序
				miniInfo           : [], // 微信小程序列表
				corpId             : corpId,// 企业微信选中的id
				corpInfo           : [], // 企业微信列表
				agentId            : [],
				agentList          : [],
				agentToken         : '',
				agentEncodingAESKey: '',
				userId             : [],
				columns,    //表格部分
				relationList       : [],    // 关系数据
				showRedirectModal  : false,
				addType            : 1  // 1：公众号；2：小程序
			}
		},
		methods   : {
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
			add (e) {
				this.isLoading = true
				Promise.all([
					this.$store.dispatch('getWx', (info) => {
						this.wxInfo = info;
					}),
					this.$store.dispatch('getMini', (info) => {
						this.miniInfo = info;
					}),
				]).then(res => {
					this.$nextTick(() => {
						this.addType = e.key
						this.addFunction()
					})
				}).catch(e => {
					this.isLoading = false
				})
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

				this.showRedirectModal = true
			},
			//选择成员组件回调
			selectStaffCallback(event,id){
				if (event == "ok"){
					this.userId = id
				}
			},
			handleCancel () {
				this.showRedirectModal = false
				this.wxIndex = ''
				this.wxNum = []
				this.miniNum = []
				this.userId = []
				this.agentId = []
				this.addType = 1
			},
			async handleOk () {
				const {data: res} = await this.axios.post('work-author/set', {
					corp_id  : this.corpId,
					user_id  : this.userId,
					author_id: this.addType == 1 ? this.wxNum : this.miniNum,
					agent_id : this.agentId,

				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.$message.success('添加成功')
					this.relationList.push(res.data)

					this.handleCancel()
				}
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
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			async getList () {
				const {data: res} = await this.axios.post('work-author/list', {
					corp_id: this.corpId,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.relationList = res.data
					this.isLoading = false
					this.isTabLoading = false
				}
			},
			async changeRelation (relationId, status, keyIndex) {
				const {data: res} = await this.axios.post('work-author/change', {
					corp_id    : this.corpId,
					relation_id: relationId,
					status     : status,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.relationList[keyIndex].status = status;
				}
			},
			async delRelation (relationId, keyIndex) {
				const {data: res} = await this.axios.post('work-author/del', {
					corp_id    : this.corpId,
					relation_id: relationId,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.relationList.splice(keyIndex, 1)
				}
			}
		},
		created () {
			this.$store.dispatch('getCorp', (info) => {
				this.corpInfo = info;
				this.$emit('changeCorpId', this.corpId)

				this.getList()
			});
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