<template>
	<div>
		<div class="search">
			<a-input-search
					placeholder="输入要搜索的内容"
					:allowClear=true
					enterButton="搜索"
					style="width: 96%"
					@search="onSearch"
			/>
		</div>
		<div class="group-list">
			<a-form-item :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<a-row :gutter="16">
					<a-col :span="15">
						<a-tree-select
								:style="{width:'100%'}"
								:dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
								:treeData="groupList"
								placeholder='Please select'
								v-model="selectGroupId"
								@select="onSelect"
						>
						</a-tree-select>
					</a-col>
					<a-col :span="6">
						<a-button
								type="primary"
								@click="addQuick">
							添加
						</a-button>
					</a-col>
				</a-row>
			</a-form-item>
		</div>
		<div>
			<a-tabs defaultActiveKey="1" @change="changeTab">
				<a-tab-pane
						tab="文本"
						key="1">
					<a-row
							v-if="tabKey == 1"
							class="demo-infinite-container"
							ref="quick_box"
							v-perfect-scroll-bar="perfectScrollBarOptions"
							@ps-scroll-down="handleInfiniteOnLoad">
						<a-col :span="24">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-list :dataSource="list" class="quick-text-box">
									<a-list-item slot="renderItem" slot-scope="item, index" class="quick-box">
										<a-list-item-meta>
											<div slot="title">{{item.file_name}}
												<div class="quick-btn">
													<a-tooltip placement="top" v-if="sendDisplay==1">
														<template slot="title">
															<span>发送</span>
														</template>
														<span class="quick-btn-item" @click="quickSend(1,item.content)">
														<a-icon type="right-square"/>
													</span>
													</a-tooltip>

													<a-tooltip placement="top">
														<template slot="title">
															<span>编辑</span>
														</template>
														<span class="quick-btn-item"
														      @click="openQuickModify(item.id, index)">
														<a-icon :data-key="item.id" type="edit" alt=""/>
													</span>
													</a-tooltip>

													<a-popconfirm
															placement="leftTop"
															title="确定删除？"
															@confirm="quickDel(item.id)">
														<a-icon
																slot="icon"
																type="question-circle-o"
																style="color: red"/>
														<span class="quick-btn-item">
														<a-tooltip placement="top">
															<template slot="title">
																<span>删除</span>
															</template>
															<a-icon :data-key="item.id" type="delete" alt=""/>
														</a-tooltip>
													</span>
													</a-popconfirm>
												</div>
											</div>
											<div slot="description" class="quick-description"
											     v-html="item.content.replace(/[(\r\n)|\r|\n]/g, '<br/>')"></div>
										</a-list-item-meta>
									</a-list-item>
								</a-list>
							</a-spin>
						</a-col>
					</a-row>
				</a-tab-pane>
				<a-tab-pane
						tab="图片"
						key="2">
					<a-row
							v-if="tabKey == 2"
							class="demo-infinite-container"
							ref="quick_box"
							v-perfect-scroll-bar="perfectScrollBarOptions"
							@ps-scroll-down="handleInfiniteOnLoad">
						<a-col :span="24">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-list :dataSource="list" class="quick-text-box">
									<a-list-item slot="renderItem" slot-scope="item, index" class="quick-box">
										<a-list-item-meta>
											<div slot="title">{{item.file_name}}
												<div class="quick-btn">
													<a-tooltip placement="top">
														<template slot="title">
															<span>发送</span>
														</template>
														<span class="quick-btn-item"
														      @click="quickSend(2,item.local_path,item)">
													<a-icon type="right-square"/>
												</span>
													</a-tooltip>

													<a-popconfirm
															placement="leftTop"
															title="确定删除？"
															@confirm="quickDel(item.id)">
														<a-icon
																slot="icon"
																type="question-circle-o"
																style="color: red"/>
														<span class="quick-btn-item">
																<a-tooltip placement="top">
															<template slot="title">
																<span>删除</span>
															</template>
																	<a-icon :data-key="item.id" type="delete" alt=""/>
														</a-tooltip>
																</span>
													</a-popconfirm>

												</div>
											</div>

											<a-avatar
													v-if="item.local_path"
													slot="avatar"
													shape="square"
													size="large"
													:src="commonUrl + item.local_path"
													alt="">
											</a-avatar>
										</a-list-item-meta>
									</a-list-item>
								</a-list>
							</a-spin>
						</a-col>
					</a-row>
				</a-tab-pane>
				<a-tab-pane
						v-if="this.comeFrom == 'wx'"
						tab="图文"
						key="3">
					<a-row
							v-if="tabKey==3"
							class="demo-infinite-container"
							ref="quick_box"
							v-perfect-scroll-bar="perfectScrollBarOptions"
							@ps-scroll-down="handleInfiniteOnLoad">
						<a-col :span="24">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-list :dataSource="list" class="quick-text-box">
									<a-list-item slot="renderItem" slot-scope="item, index" class="quick-box">
										<a-list-item-meta>
											<div slot="title">
												<template v-if="item.artList">{{item.artList[0].title}}</template>
												<div class="quick-btn">
													<a-tooltip placement="top">
														<template slot="title">
															<span>发送</span>
														</template>
														<template v-if="item.artList[0].s_local_path">
														<span class="quick-btn-item"
														      @click="quickSend(3,item.artList[0].s_local_path,item)">

															<a-icon type="right-square"/>
														</span>
														</template>
														<template v-else>
														<span class="quick-btn-item"
														      @click="quickSend(3,item.artList[0].local_path,item)">
															<a-icon type="edit" alt=""/>
														</span>
														</template>
													</a-tooltip>
												</div>
											</div>
											<template v-if="item.artList">
												<template v-if="item.artList[0].s_local_path">
													<a-avatar
															slot="avatar"
															shape="square"
															size="large"
															:src="commonUrl+item.artList[0].s_local_path"
															alt="">
													</a-avatar>
												</template>
												<template v-else>
													<a-avatar
															slot="avatar"
															shape="square"
															size="large"
															:src="commonUrl+item.artList[0].local_path"
															alt="">
													</a-avatar>
												</template>
											</template>
										</a-list-item-meta>
									</a-list-item>
								</a-list>
							</a-spin>
						</a-col>
					</a-row>
				</a-tab-pane>
				<a-tab-pane
						v-if="this.comeFrom == 'wx'"
						tab="音频"
						key="4">
					<a-row
							v-if="tabKey == 4"
							class="demo-infinite-container"
							ref="quick_box"
							v-perfect-scroll-bar="perfectScrollBarOptions"
							@ps-scroll-down="handleInfiniteOnLoad">
						<a-col :span="24">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-list :dataSource="list" class="quick-text-box">
									<a-list-item slot="renderItem" slot-scope="item, index" class="quick-box">
										<a-list-item-meta>
											<div slot="title">{{item.file_name}}
												<div class="quick-btn">
													<a-tooltip placement="top">
														<template slot="title">
															<span>发送</span>
														</template>
														<span class="quick-btn-item" @click="quickSend(4,item,item)">
													<a-icon type="right-square"/>
												</span>
													</a-tooltip>

													<a-popconfirm
															placement="leftTop"
															title="确定删除？"
															@confirm="quickDel(item.id)">
														<a-icon
																slot="icon"
																type="question-circle-o"
																style="color: red"/>
														<span class="quick-btn-item">
																<a-tooltip placement="top">
															<template slot="title">
																<span>删除</span>
															</template>
																	<a-icon :data-key="item.id" type="delete" alt=""/>
														</a-tooltip>
																</span>
													</a-popconfirm>

												</div>
											</div>
										</a-list-item-meta>
									</a-list-item>
								</a-list>
							</a-spin>
						</a-col>
					</a-row>
				</a-tab-pane>
				<a-tab-pane
						v-if="this.comeFrom == 'wx'"
						tab="视频"
						key="5">
					<a-row
							v-if="tabKey == 5"
							class="demo-infinite-container"
							ref="quick_box"
							v-perfect-scroll-bar="perfectScrollBarOptions"
							@ps-scroll-down="handleInfiniteOnLoad">
						<a-col :span="24">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-list :dataSource="list" class="quick-text-box">
									<a-list-item slot="renderItem" slot-scope="item, index" class="quick-box">
										<a-list-item-meta>
											<div slot="title">{{item.file_name}}
												<div class="quick-btn">
													<a-tooltip placement="top">
														<template slot="title">
															<span>发送</span>
														</template>
														<span class="quick-btn-item" @click="quickSend(5,item,item)">
													<a-icon type="right-square"/>
												</span>
													</a-tooltip>

													<a-popconfirm
															placement="leftTop"
															title="确定删除？"
															@confirm="quickDel(item.id)">
														<a-icon
																slot="icon"
																type="question-circle-o"
																style="color: red"/>
														<span class="quick-btn-item">
																<a-tooltip placement="top">
															<template slot="title">
																<span>删除</span>
															</template>
																	<a-icon :data-key="item.id" type="delete" alt=""/>
														</a-tooltip>
																</span>
													</a-popconfirm>

												</div>
											</div>
										</a-list-item-meta>
									</a-list-item>
								</a-list>
							</a-spin>
						</a-col>
					</a-row>
				</a-tab-pane>
				<a-tab-pane
						v-if="this.comeFrom == 'wx'"
						tab="小程序"
						key="6">
					<a-row
							v-if="tabKey == 6"
							class="demo-infinite-container"
							ref="quick_box"
							v-perfect-scroll-bar="perfectScrollBarOptions"
							@ps-scroll-down="handleInfiniteOnLoad">
						<a-col :span="24">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-list :dataSource="list" class="quick-text-box">
									<a-list-item slot="renderItem" slot-scope="item, index" class="quick-box">
										<a-list-item-meta>
											<div slot="title">{{item.file_name}}
												<div class="quick-btn">
													<a-tooltip placement="top">
														<template slot="title">
															<span>发送</span>
														</template>
														<span class="quick-btn-item" @click="quickSend(6,item,item)">
													<a-icon type="right-square"/>
												</span>
													</a-tooltip>

													<a-popconfirm
															placement="leftTop"
															title="确定删除？"
															@confirm="quickDel(item.id)">
														<a-icon
																slot="icon"
																type="question-circle-o"
																style="color: red"/>
														<span class="quick-btn-item">
																<a-tooltip placement="top">
															<template slot="title">
																<span>删除</span>
															</template>
																	<a-icon :data-key="item.id" type="delete" alt=""/>
														</a-tooltip>
																</span>
													</a-popconfirm>

												</div>
											</div>

											<a-avatar
													v-if="item.local_path"
													slot="avatar"
													shape="square"
													size="large"
													:src="commonUrl + item.local_path"
													alt="">
											</a-avatar>
										</a-list-item-meta>
									</a-list-item>
								</a-list>
							</a-spin>
						</a-col>
					</a-row>
				</a-tab-pane>
			</a-tabs>
		</div>

		<a-drawer
				:title="(modifyIndex == -1 ? '添加' : '编辑') + '文本回复'"
				placement="right"
				:closable="false"
				:visible="showQuickBox"
				:getContainer="container"
				@close="onClose">

			<a-form
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 15 }"
					:style="{marginTop: '10px'}">
				<a-form-item label="选择分组">
					<a-tree-select
							:dropdownStyle="{maxHeight: '150px', overflow: 'auto'}"
							:treeData="addGroupList"
							placeholder='请选择'
							v-model="quickSelectGroupId"
					>
					</a-tree-select>
				</a-form-item>

				<a-form-item label="文本标题">
					<a-input
							v-model="textTitle"
							placeholder="请填写文本标题，仅供备注，不会发送给客户"
							:maxLength="50">
											<span slot="suffix">
												{{textTitle === null ? 0 : textTitle.length}} / 50
											</span>
					</a-input>
				</a-form-item>

				<a-form-item label="文本内容">
					<div style="margin: 5px 0px;">
						<medium-editor
								ref="medium_editor"
								class="content-editable"
								:text="textValue"
								:options="options"
								@editorCreated="editorCreated"
								@edit="changeContentInput" custom-tag="div"/>

					</div>
					<div style="padding: 0 15px;">
						点击插入：
						<a-popover
								trigger="click"
								:destroyTooltipOnHide="true"
								v-model="emojiShow">
							<VEmojiPicker
									slot="content"
									:showSearch="false"
									@select="onSelectEmoji"/>
							<a-icon
									type="smile"
									class="icon-btn"
									style="cursor: pointer;"/>
						</a-popover>
						<div style="float: right;">
							{{wordNum}}/{{wordLimit}}
						</div>
					</div>
				</a-form-item>
			</a-form>

			<div :style="{
									position: 'absolute',
									bottom: '64px',
									width: '100%',
									borderTop: '1px solid #e8e8e8',
									padding: '10px 16px',
									textAlign: 'right',
									left: 0,
									background: '#FFF',
									borderRadius: '0 0 4px 4px',
									}">
				<a-button :style="{marginRight: '8px'}" @click="onClose">
					取消
				</a-button>
				<a-button :loading="quickLoading" @click="uploadText" type="primary">
					确定
				</a-button>
			</div>
		</a-drawer>
	</div>
</template>
<script>
	import infiniteScroll from 'vue-infinite-scroll';
	import editor from "vue2-medium-editor";
	import { VEmojiPicker } from "v-emoji-picker"
	import axios from "axios";

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	export default {
		directives: {infiniteScroll},
		name      : "contentMsg",
		props     : {
			sendDisplay: {
				type   : Number,
				default: 1 //判断是否重置过
			},
			comeFrom   : {
				type   : String,
				default: 'wx'
			},
			container  : {
				type   : HTMLElement | String,
				default: 'body'
			}
		},
		components: {
			'medium-editor': editor,
			VEmojiPicker,
		},
		data () {

			return {
				selectGroupId          : '',//选择的分组id
				groupList              : [], // 分组列表
				addGroupList           : [], // 不包含渠道码的分组列表
				isLoading              : true, //Loading 组件显示与隐藏
				material_type          : '6', //4图文，1图片，2音频，3视频, 7小程序，5文件，6文本
				file_type              : 6, //
				news_type              : 1, //
				comefrom               : 2, //
				groupId                : [], // 选中的小组id
				list                   : [], //当前页显示所有的数据
				gData                  : [], //分组
				id                     : '', //点击的id
				name                   : '', //搜索的内容
				length                 : 0, //当前所有页的长度
				data                   : [],
				page                   : 1,
				pageSize               : 15,
				tabKey                 : 1,
				commonUrl              : this.$store.state.commonUrl,//公共的链接
				showQuickBox           : false,   // 是否显示快捷回复的编辑区域
				mediumEditor           : [],  // 初始化的medium-editor
				options                : {
					toolbar    : false,
					placeholder: {
						text       : '请输入……',
						hideOnClick: true
					}
				},  // 输入框的 options
				wordNum                : 0,   //编辑框的字数
				wordLimit              : 1000,    //  编辑框文字限制
				textTitle              : '',  //文本弹窗新建标题
				textValue              : '',  //文本内容
				textContent            : '',  //编辑框传给后台的内容
				emojiShow              : false,  // emoji 表情选择框是否显示
				attachmentId           : 0, // 附件id
				quickSelectGroupId     : '', // 附件分组id
				quickLoading           : false, // 快捷加载
				modifyIndex            : -1,
				noGroupId              : -1,   // 未分组ID
				perfectScrollBarOptions: {
					suppressScrollX   : true,  // 禁用 X 轴的滚动条
					minScrollbarLength: 15  // 最小的滚动条大小
				},   // 滚动条的配置
			}
		},
		methods   : {
			async getGroupList (page = 1) {
				const {data: res} = await this.axios.post("attachment/group", {
					uid: localStorage.getItem('uid'),
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					this.addGroupList = []
					this.groupList.map((group) => {
						if (group.is_not_group != 2) {
							this.addGroupList.push(group)
						}

						if (group.is_not_group == 1) {
							this.noGroupId = group.key
						}
					})
					let g = {
						key: "",
						value: "",
						parent_id: null,
						title: "所有",
						sort: 0,
						is_not_group: 0,
						scopedSlots: {
							title: "custom"
						},
						children: []
					}
					this.groupList.splice(0, 0, g)
					if (!this.selectGroupId) {
						this.selectGroupId = this.groupList[0].key;
						this.groupId=[]
					}

					if (!this.id) {
						this.id = this.groupList[0].key
						this.getMaterial(1)
					} else {
						this.getChildrenId(this.id, page)
					}
					this.gData = res.data.group;

				}
			},

			// 计算音频时长
			oncanplay (res) {
				const audioIndex = res.target.dataset.index;
				this.$set(this.playTime, audioIndex, Math.ceil(res.target.duration));
			},

			changeTab (value) {
				this.material_type = value;
				this.tabKey = value;
				if (value == 1) {
					this.material_type = 6;
					this.file_type = 6;
				} else if (value == 2) {
					this.material_type = 1;
					this.file_type = 2;
				} else if (value == 3) {
					this.material_type = 4;
					this.file_type = 1;
				} else if (value == 4) {
					this.material_type = 2;
					this.file_type = 3;
				} else if (value == 5) {
					this.material_type = 3;
					this.file_type = 4;
				} else if (value == 6) {
					this.material_type = 7;
					this.file_type = 7;
				}
				this.list = [];
				this.page = 1;
				this.getMaterial();
			},

			quickSend (value, content = '', item = '') {
				this.$emit('replyMsg', value, content, item);
			},

			// 点击分组
			onSelect (e) {
				if (e.length > 0 && this.id != e) {
					this.id = e
					this.getChildrenId(this.id)
				} else if(e == '') {
					this.id = ''
					this.groupId = []
					this.getMaterial(1)
				}
			},

			//点击搜索
			onSearch (value) {
				this.name = value;
				this.getMaterial();
			},

			// 根据key获取该分组及所有孩子id
			getChildrenId (key, page = 1) {
				let ids = []
				ids.push(key)
				// 查询key的对象
				const loop = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.key === key) {
							return callback(item2)
						}
						if (item2.children) {
							return loop(item2.children, key, callback)
						}
					})
				}
				// 获取所有children key
				const loop1 = (data, ids, callback) => {
					data.forEach((item2, index, arr) => {
						ids.push(item2.key)
						if (item2.children) {
							return loop1(item2.children, ids, callback)
						}
					})
					return callback(ids)
				}
				loop(this.gData, key, (item) => {
					if (item.children) {
						loop1(item.children, ids, (ids) => {
						})
					}
				})
				this.groupId = ids;
				this.getMaterial(page)
			},

			//获取素材列表
			async getMaterial (page = 1) {
				this.isLoading = true
				const {data: res} = await this.axios.post("attachment/list", {
					uid      : localStorage.getItem('uid'),
					file_type: this.file_type,
					comefrom : this.comefrom,
					news_type: this.news_type,
					group_id : this.groupId,
					page     : page,
					pageSize : this.pageSize,
					name     : this.name,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if (this.material_type == 4) {
						this.$nextTick(() => {
							let info = [...res.data.attachment.single.list, ...res.data.attachment.double.list]
							if (page == 1) {
								this.list = info;
							} else {
								this.list = this.list.concat(info)
							}
							this.length = res.data.count;
							this.isLoading = false;
							this.loading = false;
						})
					} else if (this.material_type == 1 || this.material_type == 2 || this.material_type == 3 || this.material_type == 7 || this.material_type == 5 || this.material_type == 6) {
						this.$nextTick(() => {
							if (page == 1) {
								this.list = res.data.attachment;
							} else {
								this.list = this.list.concat(res.data.attachment)
							}
							this.length = res.data.count;
							this.isLoading = false;
							this.loading = false;
						})
					}
				}
			},


			handleInfiniteOnLoad () {
				const scrollYReach = this.$refs.quick_box.$el._ps_.reach.y;
				const data = this.list;

				if (scrollYReach === 'end') {
					if (data.length >= this.length) {
						this.$message.destroy()
						this.$message.warning('没有更多了')
						this.isLoading = false
					} else {
						this.isLoading = true
						this.page++;
						if(!this.selectGroupId) {
							this.getMaterial(this.page)
						} else {
							this.getChildrenId(this.selectGroupId, this.page)
						}

						// this.getGroupList(this.page);
					}
				}
			},

			// 删除内容引擎
			async quickDel (id) {
				const {data: res} = await this.axios.post("attachment/delete", {
					uid          : localStorage.getItem('uid'),
					attachment_id: id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.$message.success("删除成功");
					this.isLoading = false;
					this.getGroupList();
				}

			},

			addQuick () {
				this.quickLoading = false

				this.modifyIndex = -1
				this.attachmentId = 0
				this.quickSelectGroupId = this.noGroupId
				this.textTitle = ''
				this.textValue = ''
				this.textContent = ''
				this.wordNum = 0
				this.showQuickBox = true
			},
			openQuickModify (attachmentId, index) {
				this.quickLoading = false

				this.modifyIndex = index
				this.attachmentId = attachmentId
				this.quickSelectGroupId = this.list[index].group_id
				this.textTitle = this.list[index].file_name
				this.textValue = this.list[index].content.replace(/\n/g, '<br>')
				this.textContent = this.list[index].content
				this.wordNum = this.textContent.replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '').length
				this.showQuickBox = true
			},
			onClose () {
				this.quickLoading = false

				this.modifyIndex = -1
				this.attachmentId = 0
				this.quickSelectGroupId = ''
				this.textTitle = ''
				this.textValue = ''
				this.textContent = ''
				this.wordNum = 0
				this.showQuickBox = false
			},
			uploadText () {
				this.quickLoading = true
				if (this.textTitle == '') {
					this.quickLoading = false
					this.$message.warning('请输入文本标题！')
					return false
				}
				if (!this.textContent) {
					this.quickLoading = false
					this.$message.warning('请输入文本内容！')
					return false
				}
				this.uploadMaterial()
			},
			async uploadMaterial () {
				this.quickLoading = true
				let params = {
					uid            : localStorage.getItem('uid'),
					sub_id         : localStorage.getItem('sub_id'),
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					file_type      : 6,
					group_id       : this.quickSelectGroupId,
					content        : this.textContent,
					text_title     : this.textTitle,
					attachment_id  : this.attachmentId,
				}
				const {data: res} = await this.axios.post("attachment/add", params, {cancelToken: source.token})
				if (res.error == 0) {
					this.quickLoading = false
					if (this.modifyIndex == -1) {
						this.getGroupList()
					} else {
						this.list[this.modifyIndex].group_id = this.quickSelectGroupId
						this.list[this.modifyIndex].file_name = this.textTitle
						this.list[this.modifyIndex].content = this.textContent
						this.list[this.modifyIndex].group_id = this.quickSelectGroupId
					}

					this.onClose()
				} else {
					this.$message.error(res.error_msg)
					this.quickLoading = false
				}
			},

			// 插入自定义HTML
			insertHTMLCommand (doc, html) {
				if (typeof self.lastNode === 'undefined' || !self.lastNode.classList.contains("content-editable")) {
					return false
				}

				let range, toReplace, el, fragment, node, lastNode, ecArgs = ['insertHTML', false, html]

				range = self.lastRange
				toReplace = range.commonAncestorContainer

				if (editor.MediumEditor.util.isMediumEditorElement(toReplace) && !toReplace.firstChild) {
					range.selectNode(toReplace.appendChild(doc.createTextNode('')))
				} else if ((toReplace.nodeType === 3 && range.startOffset === 0 && range.endOffset === toReplace.nodeValue.length) ||
					(toReplace.nodeType !== 3 && toReplace.innerHTML === range.toString())) {
					// Ensure range covers maximum amount of nodes as possible
					// By moving up the DOM and selecting ancestors whose only child is the range
					while (!editor.MediumEditor.util.isMediumEditorElement(toReplace) &&
					toReplace.parentNode &&
					toReplace.parentNode.childNodes.length === 1 &&
					!editor.MediumEditor.util.isMediumEditorElement(toReplace.parentNode)) {
						toReplace = toReplace.parentNode
					}
					range.selectNode(toReplace)
				}
				range.deleteContents()

				el = doc.createElement('div')
				el.innerHTML = html
				fragment = doc.createDocumentFragment()
				while (el.firstChild) {
					node = el.firstChild
					lastNode = fragment.appendChild(node)
				}
				range.insertNode(fragment)

				// Preserve the selection:
				if (lastNode) {
					range = range.cloneRange()
					range.setStartAfter(lastNode)
					range.collapse(true)
					editor.MediumEditor.selection.selectRange(doc, range)
				}

				if (doc.execCommand.callListeners) {
					doc.execCommand.callListeners(ecArgs, true)
				}
				this.wordNum = self.lastNode.textContent.length
				if (this.wordNum <= this.wordLimit) {
					this.textValue = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.textContent = self.lastNode.innerHTML.replace(/<br([^>]*)>/g, '\n').replace(/&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
				}

				let event = {
					currentTarget: this.mediumEditor.origElements
				}
				this.mediumEditor.events.updateInput(event.currentTarget, event);
			},
			invlideText () {
				const customNode = this.$refs.medium_editor.$el
				const {startNode, startOffset, endNode, endOffset} = this.global.getRangeInfo(customNode, this.wordLimit);

				if (typeof startNode.nodeValue !== 'undefined') {
					let newRange = document.createRange()
					newRange.setStart(startNode, startOffset);
					newRange.setEnd(endNode, endOffset);
					// newSelection.removeAllRanges();
					// newSelection.addRange(newRange)
					newRange.deleteContents()

					this.textValue = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.textContent = self.lastNode.innerHTML.replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					this.wordNum = this.wordLimit

				}
				var divscll = document.getElementsByClassName('content-editable')[0];
				divscll.scrollTop = divscll.clientHeight
			},
			// 文本域获取焦点
			editableFocus (e) {
				if (e.target.innerHTML === '' || e.target.innerHTML == '<p></p>' || e.target.innerHTML == '<br>') {
					e.target.innerHTML = '<p><br/></p>';
				}
			},
			//监听键盘事件，超过300字，不让输入
			editableKeydown (event) {
				if (this.wordNum >= this.wordLimit && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && !(event.keyCode == 65 && (event.metaKey || event.ctrlKey))) {
					event.preventDefault();
				}

				if (event.keyCode == 86 && (event.metaKey || event.ctrlKey)) {
					console.log(123)
				}
			},
			//监听粘贴事件
			editablePaste (event, target) {
				this.invlideText()
			},
			// 插件初始化成功的回调
			editorCreated (mediumEditor) {
				this.mediumEditor = mediumEditor
				this.mediumEditor.subscribe('focus', this.editableFocus);
				this.mediumEditor.subscribe('editableKeydown', this.editableKeydown);
				this.mediumEditor.subscribe('editablePaste', this.editablePaste);

				delete self.lastRange
				delete self.lastNode
			},
			changeContentInput (operation) {
				if (operation.api.origElements.innerHTML == '' || operation.api.origElements.innerHTML == '<br>') {
					operation.api.origElements.innerHTML = '<p><br/></p>'
				}
				//判断链接格式
				var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
				if (reg.test(operation.api.origElements.innerHTML)) {
					this.$message.error('请填写正确的链接')
					this.mediumEditor.execAction('unlink')
				}

				if (typeof self.lastNode !== "undefined") {
					this.wordNum = self.lastNode.textContent.length
					if (this.wordNum <= this.wordLimit) {
						this.textContent = self.lastNode.innerHTML.replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
						this.textValue = operation.api.origElements.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					} else {
						this.invlideText();
					}
				}
			},
			// 修改emoji的显示与否的参数
			toggleDialogEmoji () {
				this.emojiShow = !this.emojiShow
			},
			// 选择emoji表情的事件
			onSelectEmoji (dataEmoji) {
				var dom = this.mediumEditor.options.ownerDocument
				if (this.wordLimit - this.wordNum >= 2) {
					this.insertHTMLCommand(dom, dataEmoji.data)
				}
				// Optional
				this.toggleDialogEmoji()
			},
			// 获取最后的文本选择框焦点
			getCursor (self) {
				let sel = getSelection()
				if (!sel) {
					return
				}
				let node = sel.anchorNode
				let isIn = false
				while (node && node.nodeType != node.DOCUMENT_NODE) {
					var cls = node.classList
					if (cls && cls.contains("content-editable")) {
						isIn = true
						break
					}
					node = node.parentNode
				}
				if (!isIn) return
				self.lastRange = sel.getRangeAt(0)
				self.lastNode = node
			},

		},
		mounted () {
			this.getGroupList();
		},
		created () {
			let _this = this
			document.addEventListener("selectionchange", function () {
				_this.getCursor(self)
			})
		},
	}
</script>
<style lang='less' scoped>
	.search {
		padding-left: 10px;
		padding-top: 20px;
		padding-bottom: 20px;
		border-bottom: 1px dashed #e2e2e2;
	}

	.group-list {
		padding-left: 10px;
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.demo-infinite-container {
		overflow: auto;
		padding: 8px 15px;
		position: fixed;
		top: 245px;
		bottom: 0;
		width: 19.27%;

		/deep/ .ant-spin-spinning {
			top: calc(100% - 540px);
		}
	}

	.demo-loading-container {
		position: absolute;
		bottom: 40px;
		width: 100%;
		text-align: center;
	}

	.quick-title {
		display: inline-block;
		float: left;
	}

	.quick-box {
		padding: 15px 10px;
		position: relative;
		cursor: pointer;

		/deep/ .ant-list-item-meta-avatar {
			+ .ant-list-item-meta-content {
				width: calc(100% - 56px) !important;
			}
		}

		/deep/ .ant-list-item-meta-title {
			word-break: normal;
			word-wrap: break-word;
			overflow-wrap: break-word;
		}

		/deep/ .ant-list-item-meta {
			width: 100%;

			.ant-list-item-meta-content {
				width: 100%;

				.quick-description {
					word-break: normal;
					word-wrap: break-word;
					overflow-wrap: break-word;
				}
			}
		}
	}

	.quick-btn {
		position: absolute;
		top: 0;
		right: 0;
		display: none;

		.quick-btn-item {
			background-color: rgba(0, 0, 0, 0.8);
			color: white;
			padding: 5px;
			display: inline-block;
			margin-left: 5px;
			font-size: 14px;
			line-height: 14px;
			width: 24px;
			height: 24px;
			cursor: pointer;
		}
	}

	.quick-box:hover {
		background-color: #FAFAFA;
		.quick-btn {
			display: block;
		}
	}
	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		height: 110px;
		overflow: auto;
		border: 1px solid rgba(0, 0, 0, 0.15);

		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

</style>
