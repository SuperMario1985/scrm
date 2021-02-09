<template>
	<div>
		<a-select showSearch optionFilterProp="children"
		          v-model="chatId" style="width:100%;" :filterOption="false"
		          placeholder="请选择群" @focus="focusSelect" @select="changeSelect" @popupScroll="popScroll" @search="searchName"
		          :disabled="disabled"
		>
			<div slot="dropdownRender" slot-scope="menu">
				<v-nodes :vnodes="menu"/>
				<a-spin tip="加载中..." size="large" :spinning="isLoading"
				        style="position: absolute;bottom: 50%;left: 0;right: 0;">
				</a-spin>
			</div>
			<a-select-option :value="''">
				所有群
			</a-select-option>
			<a-select-option v-for="(rule, index) in chatList" :value="rule.chat_id">
				{{rule.name}}
			</a-select-option>
		</a-select>
	</div>
</template>

<script>
	export default {
		props     : {
			chat_id : {
				type: String,
				default: 0
			},
			disabled: {
				type   : Boolean,
				default: false
			},
			corp_id : {
				type: String,
				default: 0
			}
		},
		components: {
			VNodes: {
				functional: true,
				render    : (h, ctx) => ctx.props.vnodes,
			},
		},
		watch  : {
			chat_id: {
				handler (newVal) {
					this.chatId = newVal == 0 ? [] : newVal
				},
				deep: true
			},
			corp_id: {
				handler (newVal) {
					this.chatId = 0
				},
				deep: true
			}
		},
		data () {
			return {
				selectKey : 0,
				chatList : [],
				chatId   : [],//选择的成员id
				name : '',//输入搜索的成员名称
				page     : 1, //页码
				count    : 0,//总数
				isLoading: false,
			}
		},
		created () {
			this.$nextTick(()=>{
				this.chatId = this.chat_id ? this.chat_id : ''
				this.getAllStaffList()
			})
		},
		mounted () {
			// window.document.getElementsByClassName("group-tree1")[0].addEventListener('scroll', this.handleScroll);
		},
		methods   : {
			// 获取所有成员
			async getAllStaffList (page = 1) {
				this.isLoading = true
				const {data: res} = await this.axios.post('work-chat/chat-list', {
					uid: localStorage.getItem('uid'),
					name   : this.name,
					corp_id : this.corp_id,
					chat_id: typeof this.chatId == 'object' || this.chatId == 0 ? '' : this.chatId,
					page   : page,
					page_size : 10,
				})

				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false
					this.count = res.data.count
					if (page == 1) {
						this.chatList = res.data.list
					} else {
						this.chatList = this.chatList.concat(res.data.list)
					}
					this.page = page;
				}
			},
			focusSelect() {
				if(this.name != '') {
					this.page = 1
					this.chatList = []
					this.name = ''
					this.getAllStaffList()
				}
			},
			//选择成员
			changeSelect (value) {
				this.$emit("changeSelect", value);
			},
			//搜索成员
			searchName (value) {
				this.name = value
				this.getAllStaffList()
			},
			//下拉框滚动事件
			popScroll (e) {
				let target = e.target
				if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
					//到底了，加载下一页
					if (this.chatList.length < this.count) {
						this.page++
						this.getAllStaffList(this.page)
					}
				}
			},
		},
		watch     : {
			ruleId: {
				handler (newVal) {
					this.getAllStaffList()
				},
				deep: true
			}
		}
	}
</script>

<style scoped>

</style>