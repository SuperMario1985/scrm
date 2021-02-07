<template>
	<div>
		<a-select showSearch optionFilterProp="children"
		          v-model="userId" style="width:100%;" :filterOption="false"
		          placeholder="请选择企业成员" @focus="focusSelect" @select="changeSelect" @popupScroll="popScroll"
		          @search="searchName"
		          :disabled="disabled"
		>
			<div slot="dropdownRender" slot-scope="menu">
				<v-nodes :vnodes="menu"/>
				<a-spin tip="Loading..." size="large" :spinning="isLoading"
				        style="position: absolute;bottom: 50%;left: 0;right: 0;">
				</a-spin>
			</div>
			<a-select-option v-for="(user, userIndex) in userList" :key="user.id">
				{{user.name}}
			</a-select-option>
		</a-select>
	</div>
</template>

<script>
	export default {
		props     : {
			callback      : {
				type   : Function,
				default: null
			},
			index         : {
				type   : Number,
				default: ''
			},
			index2        : {
				type   : Number,
				default: ''
			},
			disabled      : {
				type   : Boolean,
				default: false
			},
			getFisrstStaff: {
				type   : Boolean,
				default: false
			},
			type          : {
				type   : Number,
				default: 0,//0默认，1具有外部联系人权限
			}
		},
		components: {
			VNodes: {
				functional: true,
				render    : (h, ctx) => ctx.props.vnodes,
			},
		},
		data () {
			let corpId =
				localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId   : corpId,
				userList : [],
				userId   : [],//选择的成员id
				userName : '',//输入搜索的成员名称
				page     : 1, //页码
				count    : 0,//总数
				isLoading: false,
			}
		},
		created () {
			this.$nextTick(() => {
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
				let param = {
					corp_id: this.corpId,
					name   : this.userName,
					user_id: this.userId,
					is_all : 0,//带分页
					page   : page
				}
				if (this.type == 1) {
					//具有外部联系人权限
					param.sub_id = localStorage.getItem('sub_id')
					param.isMasterAccount = localStorage.getItem('isMasterAccount')
				}
				const {data: userRes} = await this.axios.post('work-user/get-all-user', param)

				if (userRes.error != 0) {
					this.isLoading = false
					this.$message.error(userRes.error_msg)
				} else {
					this.isLoading = false
					this.count = userRes.data.count
					if (this.getFisrstStaff) {
						this.userId = userRes.data.info[0].id
						if (this.callback !== null && typeof this.callback === "function") {
							if (this.index === '' && this.index2 === '') {
								this.callback("ok", userRes.data.info[0].id);
							} else {
								this.callback("ok", userRes.data.info[0].id, this.index, this.index2);
							}
						}
					}
					if (page == 1) {
						this.userList = userRes.data.info
					} else {
						this.userList = this.userList.concat(userRes.data.info)
					}
					this.page = page;
				}
			},
			//选择成员
			changeSelect (value) {
				if (this.callback !== null && typeof this.callback === "function") {
					if (this.index === '' && this.index2 === '') {
						this.callback("ok", value);
					} else {
						this.callback("ok", value, this.index, this.index2);
					}
				}
			},
			focusSelect () {
				if (this.userName != '') {
					this.page = 1
					this.userList = []
					this.userName = ''
					this.getAllStaffList()
				}
			},
			//搜索成员
			searchName (value) {
				this.userName = value
				this.getAllStaffList()
			},
			//下拉框滚动事件
			popScroll (e) {
				let target = e.target
				if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
					//到底了，加载下一页
					if (this.userList.length < this.count) {
						this.page++
						this.getAllStaffList(this.page)
					}
				}
			},
		},
		watch     : {
			userId        : {
				handler (newVal) {
					this.getAllStaffList()
				},
				deep: true
			},
			getFisrstStaff: {
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