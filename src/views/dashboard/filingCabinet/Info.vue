<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<div style="height: 60px; line-height: 60px;background-color: #FFFFFF;border-bottom: 1px solid #E2E2E2;font-size: 16px;padding: 0px 20px;">
				{{attachment.type}} 素材 {{attachment.title}}
				<router-link to="/filingCabinet/list" style="font-size: 16px;float: right;">
					<a-button type="primary" icon="rollback">返回列表</a-button>
				</router-link>
			</div>
			<div class="content-msg">
				<p style="margin-bottom: 2px;">
					目前，仅对通过聊天侧边栏搜索、发送以及打开内容的行为做统计。
				</p>
			</div>
			<div class="content-bd" style="margin-top: 10px;">
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-row style="margin-bottom:20px;padding:0 20px;">
							<a-col :span="24">
								<a-card>
<!--									<span slot="title">-->
<!--										{{attachment.type}} 素材 {{attachment.title}}-->
<!--									</span>-->

									<div style="padding: 32px 32px 20px 32px;">
										<a-row :gutter="16">
											<a-col :span="8" style="padding: 0px;">
												<a-card :bodyStyle="{background: '#f9f9f9', padding: '24px !important'}">
													<a-statistic
															:value="searchNum"
															:valueStyle="{ color: '#3F8600', textAlign: 'right'}"
													>
														<template slot="title">
															搜索次数
															<a-tooltip placement="top">
																<template slot="title">
																	<span>被员工搜索的次数</span>
																</template>
																<a-icon type="question-circle" style="margin-left:5px;"/>
															</a-tooltip>
														</template>
													</a-statistic>
												</a-card>
											</a-col>
											<a-col :span="8" style="padding: 0px;">
												<a-card :bodyStyle="{background: '#f9f9f9', padding: '24px !important'}">
													<a-statistic
															:value="sendNum"
															:valueStyle="{ color: '#3F8600', textAlign: 'right'}"
															style="background: #f9f9f9"
													>
														<template slot="title">
															发送次数
															<a-tooltip placement="top">
																<template slot="title">
																	<span>被员工发送的次数</span>
																</template>
																<a-icon type="question-circle" style="margin-left:5px;"/>
															</a-tooltip>
														</template>
													</a-statistic>
												</a-card>
											</a-col>
											<a-col :span="8" style="padding: 0px;" v-if="type == 4 || type == 1 || type == 3">
												<a-card :bodyStyle="{background: '#f9f9f9', padding: '24px !important'}">
													<a-statistic
															:value="openNum"
															:valueStyle="{ color: '#3F8600', textAlign: 'right'}"
															style="background: #f9f9f9"
													>
														<template slot="title">
															打开次数
															<a-tooltip placement="top">
																<template slot="title">
																	<span>被同一客户打开多次，会重复计算</span>
																</template>
																<a-icon type="question-circle" style="margin-left:5px;"/>
															</a-tooltip>
														</template>
													</a-statistic>
												</a-card>
											</a-col>
										</a-row>
									</div>
									<div style="padding: 32px 32px 20px 32px;">
										<a-tabs
												type="card"
												:default-active-key="attachmentType"
												v-model="attachmentType"
												@change="changeType">
											<a-tab-pane :key="1">
												<span slot="tab">
													<a-icon type="search"/>
													搜索详情
												</span>

												<a-spin tip="Loading..." size="large" :spinning="attachmentLoading">
													<div class="spin-content">
														<a-empty v-if="!attachmentLoading && searchList.length == 0"/>
														<template v-if="!attachmentLoading && searchList.length > 0">
															<a-timeline style="margin-top: 20px;">
																<a-timeline-item v-for="(item, key) in searchList"
																                 :key="key">
																	<div style="min-height: 40px;">
																		<div class="time-line-time">{{item.event_time}}</div>
																		<div class="time-line-title">{{item.content}}</div>
																	</div>
																</a-timeline-item>
																<a-timeline-item v-if="searchNoMore" key="searchNoMore">
																	没有更多了
																</a-timeline-item>
															</a-timeline>

															<a-button
																	v-if="!((searchList.length > 0 && searchList.length < pageSize) || searchNoMore)"
																	type="primary"
																	style="margin-top: 16px"
																	:loading="pending"
																	@click="loadMore(1)">
																加载更多
															</a-button>
														</template>
													</div>
												</a-spin>
											</a-tab-pane>
											<a-tab-pane :key="2">
												<span slot="tab">
													<a-icon type="right-square"/>
													发送详情
												</span>

												<a-spin tip="Loading..." size="large" :spinning="attachmentLoading">
													<div class="spin-content">
														<a-empty v-if="!attachmentLoading && sendList.length == 0"/>
														<template v-if="!attachmentLoading && sendList.length > 0">
															<a-timeline style="margin-top: 20px;">
																<a-timeline-item v-for="(item, key) in sendList"
																                 :key="key">
																	<div style="min-height: 40px;">
																		<div class="time-line-time">{{item.event_time}}</div>
																		<div class="time-line-title">{{item.content}}</div>
																	</div>
																</a-timeline-item>
																<a-timeline-item v-if="sendNoMore" key="sendNoMore">
																	没有更多了
																</a-timeline-item>
															</a-timeline>

															<a-button
																	v-if="!((sendList.length > 0 && sendList.length < pageSize) || sendNoMore)"
																	type="primary"
																	style="margin-top: 16px"
																	:loading="pending"
																	@click="loadMore(2)">
																加载更多
															</a-button>
														</template>
													</div>
												</a-spin>
											</a-tab-pane>
											<a-tab-pane :key="3" v-if="type == 4 || type == 1 || type == 3">
												<span slot="tab">
													<a-icon type="eye"/>
													打开详情
												</span>

												<a-spin tip="Loading..." size="large" :spinning="attachmentLoading">
													<div class="spin-content">
														<a-empty v-if="!attachmentLoading && openList.length == 0"/>
														<template v-if="!attachmentLoading && openList.length > 0">
															<a-timeline style="margin-top: 20px;">
																<a-timeline-item v-for="(item, key) in openList"
																                 :key="key">
																	<div style="min-height: 40px;">
																		<span class="time-line-time">{{item.event_time}}
																		<span class="time-line-title">{{item.content}}</span></span>
																	</div>
																</a-timeline-item>
																<a-timeline-item v-if="openNoMore" key="openNoMore">
																	没有更多了
																</a-timeline-item>
															</a-timeline>

															<a-button
																	v-if="!((openList.length > 0 && openList.length < pageSize) || openNoMore)"
																	type="primary"
																	style="margin-top: 16px"
																	:loading="pending"
																	@click="loadMore(3)">
																加载更多
															</a-button>
														</template>
													</div>
												</a-spin>
											</a-tab-pane>
										</a-tabs>
									</div>
								</a-card>
							</a-col>
						</a-row>
					</div>
				</a-spin>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name   : "Info",
		data () {
			return {
				isLoading        : true,   // loading状态
				attachmentLoading: true,   // 素材loading状态
				attachmentId     : 0,  // 素材ID
				attachmentType   : 1,  // 素材类别：1：搜索；2：发送；3：打开
				page             : 1,  // 页码
				pageSize         : 15, // 每页数量
				attachment       : {
					type : '',   // 素材类型
					title: '',  // 素材标题
				},  // 素材信息
				searchNum        : 0,  // 搜索次数
				sendNum          : 0,  // 发送次数
				openNum          : 0,  // 打开次数
				searchList       : [], // 搜索详细
				sendList         : [], // 发送详细
				openList         : [], // 打开详细
				searchNoMore     : false,  // 是否还有搜索信息
				sendNoMore       : false,  // 是否还有发送信息
				openNoMore       : false,  // 是否还有打开信息
				pending          : false, // 是否显示加载中
				type             : '',
			}
		},
		methods: {
			async getInfo () {
				const {data: res} = await this.axios.post('attachment/statistic', {
					attachment_id: this.attachmentId,
					type         : this.attachmentType,
					p            : this.page,
					size         : this.pageSize,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.isLoading = false
					this.attachmentLoading = false
					this.pending = false
				} else {
					this.searchNum = res.data.info.search
					this.sendNum = res.data.info.send
					this.openNum = res.data.info.open

					this.attachment.type = res.data.attachment.type
					this.attachment.title = res.data.attachment.title

					if (res.data.search_list.length > 0) {
						this.searchList = this.searchList.concat(res.data.search_list)
						this.searchNoMore = res.data.search_list.length < this.pageSize
					} else if (this.attachmentType == 1) {
						this.searchNoMore = true
					}

					if (res.data.send_list.length > 0) {
						this.sendList = this.sendList.concat(res.data.send_list)
						this.sendNoMore = res.data.send_list.length < this.pageSize
					} else if (this.attachmentType == 2) {
						this.sendNoMore = true
					}

					if (res.data.open_list.length > 0) {
						this.openList = this.openList.concat(res.data.open_list)
						this.openNoMore = res.data.open_list.length < this.pageSize
					} else if (this.attachmentType == 3) {
						this.openNoMore = true
					}

					this.isLoading = false
					this.attachmentLoading = false
					this.pending = false

				}
			},
			changeType () {
				this.attachmentLoading = true

				this.searchList = []
				this.sendList = []
				this.openList = []

				this.pending = false
				this.page = 1

				this.getInfo()
			},
			loadMore (attachmentType) {
				this.attachmentType = attachmentType
				this.pending = true
				this.page++

				this.getInfo()
			}
		},
		created () {
			this.attachmentId = this.$route.query.id
			this.type = this.$route.query.type
			if (typeof this.attachmentId != "undefined") {
				this.getInfo()
			} else {
				this.$router.back()
			}
		},
		destroyed () {
		}
	}
</script>

<style lang="less" scoped>
	@import '../../../style/_style.less';
	.time-line-time {
		display: inline-block;
		vertical-align: top;
		margin-left: 10px;
		color: rgba(0, 0, 0, 0.5);
	}

	.time-line-title {
		display: inline-block ;
		max-width: 80%;
		text-align: left;
		white-space: pre-line;
		word-break: break-all;
		word-wrap: break-word;
		margin-left: 30px;
		color: rgba(0, 0, 0, 0.8);
	}
	.content-msg {
		min-width: 845px;
		width: calc(100% - 40px);
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 10px 20px;
		text-align: left;

	}
</style>