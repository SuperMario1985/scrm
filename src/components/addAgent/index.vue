<template>
	<div>
		<!-- 添加自建应用 -->
		<a-modal title="关联应用" v-model="showAddAgentModal" @ok="addAgentOk"
		         @cancel="addAgentCancel" width="600px">
			<div class="content-msg" style="margin-top: 0;margin-bottom: 15px;">
				<p style="margin-bottom: 5px;">
					请登录企业微信官方后台，在应用管理-应用-自建应用，找到您已建好应用的AgentId和Secret，并复制到下面的输入框。提交后将该应用添加到本系统里。
				</p>
				<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a
						target="_blank"
						href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
					企业微信后台</a>创建自建应用。<a target="_blank"
				                        href="https://support.qq.com/products/104790/faqs/63937">
					教程</a></p>
				<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">
					2、选择此应用，请确认已设置过应用的可信域名。
					<a :href="$store.state.commonUrl+'/upload/slider.png'" target="_blank"
					   class="el-link el-link--primary">
						<span class="el-link--inner">查看图示</span>
					</a>
				</p>
			</div>
			<a-form-item
					:label-col="{ span: 4 }"
					:wrapper-col="{ span: 18 }" v-if="agentList.length > 0">
				<template slot="label">选择应用
				</template>
				<a-radio-group v-model="agentType">
					<a-radio :value="1">选择已有</a-radio>
					<a-radio :value="2">新建应用</a-radio>
				</a-radio-group>
			</a-form-item>

			<template v-if="agentType == 1">
				<a-select
						showSearch
						optionFilterProp="children"
						style="width: 200px;margin-left: 90px;"
						v-model="agent_id">
					<template v-for="item in agentList">
						<a-select-option :value="item.id">{{item.name}}
						</a-select-option>
					</template>
				</a-select>
			</template>

			<template v-if="agentType == 2">
				<a-form-item
						:label-col="{ span: 4 }"
						:wrapper-col="{ span: 18 }">
					<template slot="label">
						<span style="color: red;"> * </span>应用Id
					</template>
					<a-input placeholder="请输入自建应用的AgentId" v-model="addAgentId"/>
				</a-form-item>

				<a-form-item
						:label-col="{ span: 4 }"
						:wrapper-col="{ span: 18 }">
					<template slot="label">
						<span style="color: red;"> * </span>应用Secret
					</template>
					<a-input placeholder="请输入自建应用的Secret" v-model="addAgentSecret"/>
				</a-form-item>
			</template>
		</a-modal>
	</div>
</template>

<script>
	export default {
		props  : {
			showAddAgent  : {
				type   : Boolean,
				default: false
			},
			agent_is_money: {
				type   : Number,
				default: 1,
			},
			corpId: {
				type   : String,
				default: localStorage.getItem('corpId'),
			}
		},
		name   : "index",
		data () {
			return {
				addAgentId       : '', // 应用Id（AgentId）
				addAgentSecret   : '', // 应用Secret（Secret）
				agentList        : [], // 应用
				agent_id         : '',//选择的应用id
				suite_id         : 1,//应用ID
				agentType        : 1,
				showAddAgentModal: false,
			}
		},
		mounted () {
			this.showAddAgentModal = this.showAddAgent
		},
		methods: {
			//获取应用列表
			async getAgentList () {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.corpId,
					suite_id  : this.suite_id,
					agent_type: 2
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if (res.data && res.data.length > 0) {
						this.agentList = res.data
						this.agent_id = this.agentList[0].id
						this.agentType = 1
					} else {
						this.agentType = 2
					}
				}
			},
			//添加自建应用
			addAgentOk () {
				if (this.agentType == 1) {
					this.linkAgent()
				} else if (this.agentType == 2) {
					if (this.addAgentId == '') {
						this.$message.error('请输入应用Id！');
						return false;
					}
					if (this.addAgentSecret == '') {
						this.$message.error('请输入应用Secret！');
						return false;
					}
					this.addAgent()
				}
			},
			async linkAgent () {
				const {data: res} = await this.axios.post('work-agent/update-agent-use', {
					corp_id       : this.corpId,
					agent_id      : this.agent_id,
					agent_is_money: this.agent_is_money, //1是在红包里创建的应用，默认0是其他地方创建
				})

				if (res.error != 0) {
					this.$message.error('关联失败，请检查是否正确！')
				} else {
					this.$message.success('关联成功！')
					this.$emit('linkOk')
				}
			},
			async addAgent () {
				const {data: res} = await this.axios.post('work-agent/add', {
					corp_id       : this.corpId,
					agent_id      : this.addAgentId,
					agent_secret  : this.addAgentSecret,
					agent_is_money: this.agent_is_money,//1是在红包里创建的应用，默认0是其他地方创建
				})

				if (res.error != 0) {
					this.$message.error('添加失败，请检查是否正确！')
				} else {
					const {data: getRes} = await this.axios.post('work-agent/get', {
						corp_id : this.corpId,
						agent_id: res.data.agent_id,
					})

					if (getRes.error != 0) {
						this.$message.error('添加失败，请检查是否正确！错误描述：' + getRes.error_msg)
					} else {
						this.addAgentId = ''
						this.addAgentSecret = ''
						this.$message.success('添加成功！')
						this.$emit('addOk')
					}
				}
			},
			addAgentCancel () {
				this.addAgentId = ''
				this.addAgentSecret = ''
				this.$emit('addCancel')
			},
		},
		watch  : {
			showAddAgent: {
				handler (newVal) {
					this.showAddAgentModal = newVal;
					this.getAgentList()
				},
				deep: true
			}
		},
	}
</script>

<style scoped>

</style>