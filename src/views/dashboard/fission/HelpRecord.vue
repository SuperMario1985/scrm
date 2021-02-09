<template>
	<div style="width: 100%;height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div style="height: 50px; line-height: 50px;background-color: #ffffff;">
			<label style="margin-left: 20px">{{name}}</label>
			<a-button style="float: right;margin: 9px 20px 0;" type="primary" icon="rollback" @click="rollback">返回列表</a-button>
		</div>
		<div style="margin: 10px 20px; background-color: #FFFFFF">
			<a-spin tip="加载中..." size="large" :spinning="isLoading2">
				<a-table :columns="columns3" :dataSource="hlepRecordList" :pagination="false"
				         :rowClassName="rowClassName">
				<span slot="user" slot-scope="text, record">
					<a-avatar v-if="record.avatar" shape="square" :size="42" :src="record.avatar"
					          style="float: left;"/>
							<img style="width: 42px;height: 42px;float: left;" v-if="!record.avatar"
							     src="../../../assets/useradvart.png"/>
							<div class="participant-name">
									{{record.name}}
							</div>
				</span>
				</a-table>
				<!-- 分页 -->
				<div class="pagination" style="width: 100%;position: absolute;margin: 20px 0px;"
				     v-show="total3 > 0">
					<div style="height: 32px;float: left;line-height: 32px;">
						共
						<span style="color: blue">{{total3}}</span>条
					</div>
					<div class="pagination" style="height: 32px;float: right;">
						<a-pagination :total="total3" showSizeChanger :showQuickJumper="quickJumper3"
						              :current="page3"
						              :pageSize="pageSize3" :pageSizeOptions="['15','30','50','100']"
						              @change="changePage3"
						              @showSizeChange="showSizeChange3"/>
					</div>
				</div>
			</a-spin>
		</div>
	</div>
</template>

<script>
	const columns3 = [
		{
			title      : "助力人",
			dataIndex  : "user",
			key        : "user",
			scopedSlots: {customRender: "user"}
		},
		{
			title    : "助力时间",
			dataIndex: "help_time",
			key      : "help_time",
		},
	]
	export default {
		name   : "HelpRecord",
		data () {
			return {
				columns3,
				name: '',
				jid              : 0, // 参与者id
				isLoading2       : false,  // 助力记录列表加载
				hlepRecordVisible: false, // 助力记录弹窗是否显示
				hlepRecordList   : [],  // 助力记录列表
				total3           : 0,
				page3            : 1,
				pageSize3        : 15,
				quickJumper3     : false,
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
			// 助力记录
			async helpRecord (page = 1, pageSize = this.pageSize3) {
				this.isLoading2 = true
				const {data: res} = await this.axios.post("fission/help-list", {
					uid     : localStorage.getItem("uid"),
					jid     : this.jid,
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading2 = false;
					this.$message.error(res.error_msg);
				} else {
					this.hlepRecordList = res.data.helpList
					this.page3 = page
					this.pageSize3 = pageSize
					this.total3 = parseInt(res.data.count)
					this.isLoading2 = false
				}
			},
			changePage3 (page, pageSize) {
				this.helpRecord(page, this.pageSize3)
				document.getElementsByClassName('scroll')[0].scrollTo(0, 0)
			},
			showSizeChange3 (page, pageSize) {
				this.helpRecord(this.page3, pageSize)
			},
		},
		created () {
			this.name = this.$route.query.name
			this.jid = this.$route.query.jid
			this.helpRecord()
		}
	}
</script>

<style scoped>
	.participant-name {
		float: left;
		margin-left: 10px;
		line-height: 42px;
		max-width: 100px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>