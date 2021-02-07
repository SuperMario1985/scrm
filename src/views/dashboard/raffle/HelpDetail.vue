<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div>
			<div style="height: 50px;line-height: 50px;background-color: #FFFFFF;">
				<label style="margin-left: 20px;">
					{{title}}
				</label>
				<a-button type="primary" style="float: right; margin: 9px 20px 0 0;" icon="rollback" @click="rollback">
					返回列表
				</a-button>
			</div>
		</div>
		<div class="participants">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<a-table :columns="columns" :dataSource="helpList" :pagination="false"
				         :rowClassName="rowClassName">
				</a-table>
				<!-- 分页 -->
				<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
				     v-show="total > 0">
					<div style="height: 32px;float: left;line-height: 32px;">
						共
						<span style="color: blue">{{total}}</span>条
					</div>
					<div class="pagination" style="height: 32px;float: right;">
						<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
						              :current="page"
						              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
						              @change="changePage"
						              @showSizeChange="showSizeChange"/>
					</div>
				</div>
			</a-spin>
		</div>
	</div>
</template>

<script>
	const columns = [
		{
			title    : "助力人",
			dataIndex: "nick_name",
			key      : "nick_name",
		},
		{
			title    : "助力时间",
			dataIndex: "create_time",
			key      : "create_time"
		}
	];

	export default {
		name   : "HelpDetail",
		data () {
			return {
				isLoading  : false,//loading组件的显示与隐藏
				title      : '',
				join_id    : '',
				helpList   : [],
				//表格
				columns,
				//分页
				total      : 0, //总条数
				quickJumper: false, // 是否显示快速跳转的控件
				page       : 1, //页码
				pageSize   : 15, //每页数据条数
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
			rollback () {
				this.$router.go(-1)
			},
			//获取获奖名单列表
			async getHelpList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true;
				const {data: res} = await this.axios.post("awards-activity/help", {
					id      : this.join_id,
					page    : page,
					pageSize: pageSize,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.helpList = res.data.info
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getHelpList(page, pageSize);
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange (page, pageSize) {
				this.getHelpList(1, pageSize);
			},
		},
		mounted () {
			this.join_id = this.$route.query.join_id
			this.title = this.$route.query.title
			this.getHelpList()
		},
	}
</script>

<style lang="less" scoped>
	.participants {
		margin: 10px 20px;
		background-color: #FFFFFF;
	}
</style>