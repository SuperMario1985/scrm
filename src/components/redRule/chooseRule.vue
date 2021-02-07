<template>
	<div>
		<a-select showSearch optionFilterProp="children"
		          v-model="ruleId" style="width:100%;" :filterOption="false"
		          placeholder="请选择红包规则" @focus="focusSelect" @select="changeSelect" @popupScroll="popScroll"
		          @search="searchName"
		          :disabled="disabled"
		>
			<div slot="dropdownRender" slot-scope="menu">
				<v-nodes :vnodes="menu"/>
				<a-spin tip="Loading..." size="large" :spinning="isLoading"
				        style="position: absolute;bottom: 50%;left: 0;right: 0;">
				</a-spin>
			</div>
			<a-select-option v-for="(rule, index) in ruleList" :key="rule.id">
				{{rule.name}}
			</a-select-option>
		</a-select>
	</div>
</template>

<script>
	export default {
		props     : {
			rule_id : {
				type   : Number,
				default: 0
			},
			disabled: {
				type   : Boolean,
				default: false
			},
		},
		components: {
			VNodes: {
				functional: true,
				render    : (h, ctx) => ctx.props.vnodes,
			},
		},
		watch     : {
			rule_id: {
				handler (newVal) {
					this.ruleId = newVal == 0 ? [] : newVal
				},
				deep: true
			}
		},
		data () {
			let corpId =
				localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId   : corpId,
				ruleList : [],
				ruleId   : [],//选择的成员id
				name     : '',//输入搜索的成员名称
				page     : 1, //页码
				count    : 0,//总数
				isLoading: false,
			}
		},
		created () {
			this.$nextTick(() => {
				this.ruleId = this.rule_id == 0 ? [] : this.rule_id
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
				const {data: res} = await this.axios.post('red-pack-rule/rule-list', {
					uid    : localStorage.getItem('uid'),
					name   : this.name,
					rule_id: typeof this.ruleId == 'object' || this.ruleId == 0 ? '' : this.ruleId,
					page   : page
				})

				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false
					this.count = res.data.count
					if (page == 1) {
						this.ruleList = res.data.list
					} else {
						this.ruleList = this.ruleList.concat(res.data.list)
					}
					this.page = page;
				}
			},
			//选择成员
			changeSelect (value) {
				this.$emit("changeSelect", value);
			},
			focusSelect () {
				if (this.name != '') {
					this.page = 1
					this.ruleList = []
					this.name = ''
					this.getAllStaffList()
				}
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
					if (this.ruleList.length < this.count) {
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