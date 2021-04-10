<template>
	<div>
		<!-- 选择消息弹窗 -->
		<a-modal :visible="showVisible" title="选择素材" @ok="handleOk" @cancel="handleCancel" width="888">
			<div style="height: 600px;width: 840px;" class="choose-msg">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<a-tree-select
							style="width: 350px"
							:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
							:treeData="groupList"
							placeholder='所有分组'
							v-model="selectGroupId"
							treeDefaultExpandAll
							allowClear
							@change="changeGroup"
					>
					</a-tree-select>
					<div class="content-hd" style="display: inline-block;margin-left: 10px;">
						<a-input-search
								placeholder="输入要搜索的内容"
								@search="onSearch"
								v-model="name"
								:allowClear=true
								enterButton="搜索"
								style="width: 260px;"
						/>
						<a-button @click="clearInput" style="margin-left: 10px;">
							清空
						</a-button>
					</div>
					<!-- 图片 -->
					<div style="overflow: hidden;float: right;margin-top: 8px;">
						<a-upload
								name="avatar"
								:showUploadList="false"
								action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								:beforeUpload="beforeUpload"
								:customRequest="selfUpload" @change="uploadImg" style="float: right;"
						>
							<a-button>
								<a-icon type="cloud-upload"/>
								本地上传
							</a-button>
						</a-upload>
						<!--							<div style="color:rgb(153, 153, 153);float: left;height: 32px;line-height: 32px;margin-left: 15px;">-->
						<!--								请确保您选择的图片不会有版权纠纷，建议尺寸200px*200px以上-->
						<!--							</div>-->
					</div>
					<div style="margin-top: 15px;">
						<div style="width: 100%;margin-top: 100px;" v-show="materialList.length == 0?true:false">
							<img src="../assets/null.png" style="width: 100px;display: block;margin: auto;"/>
							<p style="text-align: center;">暂无数据</p>
						</div>
						<div style="margin-top: 15px;overflow: hidden;">
							<div v-for="(item,index) in materialList" :key="item.id" class="imgSize"
							     :class="materialList[index].id == id?'active' :''" @click="chooseArt(item.id,index)">
								<img v-lazy="commonUrl+(item.s_local_path || item.local_path)" alt="">
								<div
										style="position: absolute;width: 100%;height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;margin-top: 60px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;bottom: 0;"
								>{{item.file_name}}
								</div>
							</div>
						</div>
						<!-- 图片分页 -->
						<div style="width: 100%;position: absolute;margin-top: 12px;">
							<div class="pagination" style="height: 32px;float: right;">
								<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
								              :current="page"
								              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
								              @change="changePage"
								              @showSizeChange="showSizeChange"/>
							</div>
						</div>
					</div>
				</a-spin>
			</div>
		</a-modal>
	</div>
</template>

<script>
	const columns = [
		{
			title      : '名称',
			dataIndex  : 'file_name',
			key        : 'file_name',
			scopedSlots: {customRender: "file_name"}
		},
		{
			title    : '创建时间',
			dataIndex: 'create_time',
			key      : 'create_time',
		}
	];
	export default {
		name    : "chooseMsg",
		props   : {
			comefrom   : {
				type   : String,
				default: ''
			},
			show       : {
				type   : Boolean,
				default: false
			},
			chooseId   : {
				type   : Number,
				default: 0
			},
			type       : {
				type   : String,
				default: 1
			},
			groupId    : {
				type   : Array,
				default: []
			},
			needConfirm: {
				type   : Boolean,
				default: false
			},
			callback   : {
				type   : Function,
				default: null
			}
		},
		data () {
			return {
				lastType       : 0, // 上次选择的
				showVisible    : false, //弹窗显示与隐藏
				materialList   : [], //获取素材数组
				isLoading      : false,//加载的显示与隐藏
				name           : '',
				col            : 3,//图文瀑布流分几列
				headers        : {
					authorization: 'authorization-text',
				},
				id             : 0,//选中的素材id值
				choseItem      : {}, // 选中的素材item
				//表格部分
				columns,
				//分页
				page           : 1, //页数
				pageSize       : 15, //每页个数
				total          : 0, //总条数
				quickJumper    : false, // 是否显示快速跳转的控件
				commonUrl      : this.$store.state.commonUrl,//公共的链接
				defaultValue   : 0, //默认上传素材类型，1为永久，0为临时
				fileInfo       : {}, //上传图片的文件信息
				selectedRowKeys: [],
				groupList      : [],
				selectGroupId  : '',

			};
		},
		computed: {
			itemWidth () {
				return 270
			},
			gutterWidth () {
				return 10
			}
		},
		methods : {
			changeGroup (e) {
				this.selectGroupId = e
				this.getMaterial()
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			handleOk (e) {
				if (this.id !== 0) {
					this.showVisible = false;
					if (this.callback !== null && typeof this.callback === "function") {
						if (this.needConfirm) {
							let _this = this
							this.$confirm({
								title  : '确定选择这个吗？',
								content: h => h('div',
									[
										h('img', {
											attrs: {
												src: this.$store.state.commonUrl + this.choseItem.local_path
											},
											style: {
												maxWidth : '100%',
												maxHeight: '300px',
												marginTop: '10px'
											}
										})
									]),
								onOk () {
									_this.callback("ok", e, _this.id, _this.choseItem.local_path, _this.choseItem.file_name);
								},
								onCancel () {
									_this.showVisible = true;
								},
								class  : 'choose-confirm-modal',
							});
						} else {
							this.callback("ok", e, this.id, this.choseItem.local_path, this.choseItem.file_name);
						}
					}
				} else {
					this.$message.warning('请选择素材')
				}
			},
			handleCancel (e) {
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("cancel", e);
				}
				this.showVisible = false;
			},
			//获取素材
			async getMaterial (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("attachment/list", {
					uid      : localStorage.getItem('uid'),
					file_type: 1,
					comefrom : this.comefrom,
					group_id : this.selectGroupId,
					page     : page,
					pageSize : pageSize,
					name     : this.name,
					is_radar  : 0,
					show_radar: 0
				});
				if (res.error == 0) {
					this.isLoading = false
					this.materialList = res.data.attachment;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				} else {
					this.isLoading = false
					this.$message.error(res.error_msg);
				}
				// console.log(res,222);
			},
			scroll (scrollData) {
				// console.log(scrollData)
			},
			loadmore (index) {
				this.materialList = this.materialList.concat(this.materialList)
			},
			//上传图片
			uploadImg (info) {
				if (!this.fileInfo.uid) {
					return false
				}
				this.isLoading = true
				this.uploadPic2();
			},
			selfUpload ({action, file, onSuccess, onError, onProgress}) {
				const base64 = new Promise(resolve => {
					const fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					fileReader.onload = () => {
						resolve(fileReader.result);
					};
				});
				this.fileInfo = file;
			},
			beforeUpload (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					return false;
				}
				let isLt2M = file.size / 1024 / 1024 <= 2;
				if (this.comefrom == '3') {
					isLt2M = file.size / 1024 / 1024 <= 1;
				}

				if (!isLt2M) {
					if (this.comefrom == '3') {
						this.$message.error("图片不超过1M！");
					} else {
						this.$message.error("图片不超过2M！");
					}
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				return isLt2M;
			},
			async uploadPic2 () {
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				param.append("sub_id", localStorage.getItem('sub_id'));
				param.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
				if (!this.selectGroupId) {
					let groupId = this.groupList[this.groupList.findIndex(x => x.is_not_group == 1)].key
					param.append("group_id", groupId);
				} else {
					param.append("group_id", this.selectGroupId);
				}
				param.append("file_type", this.type);
				param.append("fileInfo", this.fileInfo);
				const {data: res} = await this.axios.post("attachment/add", param);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading = false
				} else {
					this.$message.success("上传成功");
					this.getMaterial();
				}
			},
			onSearch (value) {
				this.name = value;
				this.materialList = []
				this.page = 1
				this.pageSize = 15
				this.getMaterial(this.page, this.pageSize);
			},
			// 清空按钮
			clearInput () {
				this.name = "";
				this.materialList = []
				this.page = 1
				this.pageSize = 15
				this.getMaterial(this.page, this.pageSize);
			},
			//选择图文、图片素材
			chooseArt (id, index) {
				this.id = parseInt(id)
				this.choseItem = this.materialList[index]
			},
			//选择音频素材、视频素材
			onSelectChange (id, selectedRows) {
				this.selectedRowKeys = []
				this.id = parseInt(id[0])
				this.choseItem = selectedRows[0]
				this.selectedRowKeys.push(id[0])
			},
			// 分页
			changePage (page, pageSize) {
				this.getMaterial(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getMaterial(1, pageSize);
			},
			async getGroupList () {
				const {data: res} = await this.axios.post("attachment/group", {
					uid: localStorage.getItem('uid'),
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					let g = {
						key         : "",
						value       : "0",
						parent_id   : null,
						title       : "所有",
						sort        : 0,
						is_not_group: 0,
						scopedSlots : {
							title: "custom"
						},
						children    : []
					}
					this.groupList.splice(0, 0, g)
				}
			},
		},

		watch: {
			show (newValue) {
				this.name = ''
				this.showVisible = newValue;
				// this.choseItem = {};
				if (this.show) {
					this.selectGroupId = []
					// console.log(this.type, "type");
					this.getMaterial();
					this.getGroupList()
					this.isLoading = true
				}
				if (this.chooseId != this.id) {
					this.id = this.chooseId
					this.selectedRowKeys = []
					this.selectedRowKeys.push(this.chooseId.toString())
				}
			},
			chooseId (newValue) {
				if (newValue != this.id) {
					this.id = newValue;
					let a = this.id.toString()
					this.selectedRowKeys = []
					this.selectedRowKeys.push(a)
				}
			},
			type (newValue) {
				if (this.lastType != newValue) {
					this.materialList = []
					this.lastType = newValue
				}
			}
		},

		created () {
		}
	};
</script>

<style lang='less' scoped>
	.content-hd {
		padding: 0;
		margin: 8px 0;
		text-align: left;
	}

	.imgSize {
		background-color: #FFF;
		float: left;
		width: 156.8px;
		height: 152px;
		margin-bottom: 15px;
		margin-right: 13px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 1px solid #E9E9E9;
		cursor: pointer;
		border-radius: 6px;
		position: relative;

		img {
			max-width: 100%;
			max-height: 100%;
		}
	}

	.imgSize:nth-child(5n+0) {
		margin-right: 0;
	}

	.active {
		border: 2px solid #3B74FF;
	}

	.active::after {
		content: '';
		width: 20px;
		height: 20px;
		background-image: url(https://s.weituibao.com/static/1544152635969/select.png);
		background-size: 20px 20px;
		position: absolute;
		top: 0;
		right: 0;
	}

	/deep/ .vue-waterfall {
		height: auto !important;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-spin-nested-loading {
		height: 100%;
	}

	/deep/ .ant-spin-container {
		height: 100%;
	}
</style>