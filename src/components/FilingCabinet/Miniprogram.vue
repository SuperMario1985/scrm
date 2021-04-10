<template>
	<div>
		<!-- 选择消息弹窗 -->
		<a-modal :visible="showVisible" title="选择素材" @ok="handleOk" @cancel="handleCancel" width="888">
			<div style="height: 600px;width: 840px;" class="choose-msg">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<a-tree-select
							style="width: 280px"
							:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
							:treeData="groupList"
							placeholder='所有分组'
							treeDefaultExpandAll
							allowClear
							@change="changeGroup"
					>
					</a-tree-select>
					<a-button style="margin-left: 10px;" @click="showSelectTag">
						<template v-if="selectTagIds.length == 0">选择内容标签</template>
						<template v-if="selectTagIds.length > 0">
							已选择
							<template v-if="getGroupNum(selectTagDetail) > 0">{{getGroupNum(selectTagDetail)}}个分组
							</template>
							<template
									v-if="getGroupNum(selectTagDetail) > 0 && selectTagDetail.length != getGroupNum(selectTagDetail)">
								，
							</template>
							<template v-if="selectTagDetail.length != getGroupNum(selectTagDetail)">
								{{selectTagDetail.length - getGroupNum(selectTagDetail)}}个标签
							</template>
						</template>
					</a-button>
					<a-input
							placeholder="输入要搜索的内容"
							v-model="name"
							:allowClear=true
							style="width: 260px;margin-left: 10px;"
					></a-input>
					<a-button type='primary' @click="onSearch" style="margin-left: 10px;">
						搜索
					</a-button>
					<a-button @click="clearInput" style="margin-left: 10px;">
						清空
					</a-button>
					<div class="content-msg">
						<p style="margin-bottom: 0px;">
							在企业微信里发送小程序，务必先将其关联到企业微信，否则发送失败，客户接收不到
						</p>
					</div>
					<div>
						<div
								style="margin: 100px;height: 400px;text-align: center;"
								v-show="materialList.length == 0?true:false"
						>
							<img
									src="../../assets/null.png"
									style="width: 150px;display: block;margin: auto;"
							/>
							<p style="text-align: center;">暂无数据</p>
						</div>
						<!--										:id="item5.id" draggable="true" @dragstart="drag"-->
						<div style="margin-top: 5px;overflow: hidden;">
							<div v-for="(item,index) in materialList" :key="item.id" class="imgSize"
							     :class="materialList[index].id == id?'active' :''" @click="chooseArt(item.id,index)">
								<a-popover>
									<template slot="content">
										素材来源：{{item.group_name}}
									</template>
									<div class="imgSize-title">素材来源：{{item.group_name}}</div>
								</a-popover>
								<!--									<div style="width: 90%;margin:auto;">-->
								<!--										上传者：{{item.username}}-->
								<!--									</div>-->
								<!--									<div style="width: 90%;margin:auto; color: rgba(0,0,0, 0.2)">-->
								<!--										新增于{{item.create_time}}-->
								<!--									</div>-->
								<a-card
										hoverable
										style="width: 90%;margin:auto;"
										:title="item.file_name"
								>
									<img
											alt="example"
											:src="commonUrl+(item.s_local_path || item.local_path)"
											slot="cover"
									/>
									<div style="color: rgba(0,0,0,0.5)">
										<MyIcon type="icon-miniapp"></MyIcon>
										小程序
									</div>
								</a-card>
							</div>
						</div>
					</div>
					<!-- 小程序分页 -->
					<div style="width: 100%;padding: 0 20px 20px;" v-show="total>0">
						<div style="height: 32px;display: inline-block;line-height: 32px;">
							共有
							<span style="color: blue">{{total}}</span>个素材
						</div>
						<div class="pagination" style="height: 32px;float: right;">
							<a-pagination
									:total="total"
									showSizeChanger
									:showQuickJumper="quickJumper"
									:current="page"
									:pageSize="pageSize"
									:pageSizeOptions="['15','30','50','100']"
									@change="changePage"
									@showSizeChange="showSizeChange"
							/>
						</div>
					</div>
				</a-spin>
			</div>
		</a-modal>
		<tagCheckedBox ref="tagCheckedBox" @setGroupId="setGroupId" v-if="tagGroupVisible"
		               :groupVisible="tagGroupVisible"
		               :tagDetail="JSON.parse(JSON.stringify(selectTagDetail))"
		               :tagIds="JSON.parse(JSON.stringify(selectTagIds))">
		</tagCheckedBox>
	</div>
</template>

<script>
	import axios from "axios";
	import MyIcon from "../MyIcon";
	import tagCheckedBox from '../materialTagGroup/CheckboxIndex.vue'

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	function getBase64 (img, callback) {
		const reader = new FileReader();
		reader.addEventListener("load", () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	export default {
		name      : "chooseMsg",
		components: {
			MyIcon, tagCheckedBox
		},
		props     : {
			show       : {
				type   : Boolean,
				default: false
			},
			type       : {
				type   : [Number, Array],
				default: 0
			},
			news_type  : {
				type   : Number,
				default: 0
			},
			chooseId   : {
				type   : Number,
				default: 0
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
				selectTagIds      : [],
				selectTagDetail   : [],
				tagGroupVisible   : false,
				id                : '',
				choseItem         : {},
				isLoading         : false,
				showVisible       : false,
				name              : '',
				materialList      : [],
				commonUrl         : this.$store.state.commonUrl,//公共的链接
				miniprogram1      : {
					appId      : '',
					linkUrl    : '',
					title      : '',
					material_id: '',
					local_path : {
						img  : require('../../assets/img.png'),
						audio: ""
					},
				}, // 上传小程序
				page              : 1, //小程序素材页数
				pageSize          : 15, //小程序素材每页个数
				total             : 0, //小程序素材总条数
				quickJumper       : false,
				miniprogramVisible: '',
				groupList         : '',
				selectGroupId     : '',
				selectedRowKeys   : []
			};
		},
		computed  : {
			itemWidth () {
				return 270
			},
			gutterWidth () {
				return 10
			}
		},
		methods   : {
			setGroupId (even, ids, tags) {
				if (even == 'ok') {
					this.selectTagIds = ids
					this.selectTagDetail = tags
					this.$refs.tagCheckedBox.comfirmLoading = false
				}
				this.tagGroupVisible = false
			},
			getGroupNum (selectTagDetail) {
				let count = 0
				for (let i = 0; i < selectTagDetail.length; i++) {
					if (!selectTagDetail[i].tag) {
						count++
					}
				}
				return count
			},
			// 选择内容标签
			showSelectTag () {
				this.tagGroupVisible = true
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
									_this.callback("ok", e, _this.id, _this.choseItem);
								},
								onCancel () {
									_this.showVisible = true;
								},
								class  : 'choose-confirm-modal',
							});
						} else {
							this.callback("ok", e, this.id, this.choseItem);
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
				this.id = 0
				this.selectedRowKeys = []
				this.isLoading = true
				const {data: res} = await this.axios.post("attachment/list", {
					uid      : localStorage.getItem('uid'),
					comefrom : 1,
					group_id : this.selectGroupId,
					file_type: this.type,
					news_type: this.news_type,
					tag_ids  : this.selectTagIds,
					page     : page,
					pageSize : pageSize,
					name     : this.name
				});
				if (res.error == 0) {
					this.isLoading = false
					this.materialList = res.data.attachment
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
			//改变分组
			changeGroup (e) {
				this.selectGroupId = e
				this.getMaterial()
			},
			onSearch () {
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
			chooseArt (id, index) {
				this.id = parseInt(id)
				this.choseItem = this.materialList[index]
			},
			// 分页
			changePage (page, pageSize) {
				this.getMaterial(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getMaterial(1, pageSize);
			},
			//获取分组列表
			async getGroupList () {
				const {data: res} = await this.axios.post("attachment/group", {
					uid       : localStorage.getItem('uid'),
					is_channel: 1
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
				this.choseItem = {};
				this.selectTagIds = []
				this.selectTagDetail = []
				if (this.show) {
					// console.log(this.type, "type");
					this.getMaterial();
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
			this.getGroupList()
		}
	};
</script>

<style lang='less' scoped>
	@import '../../style/_style.less';
	@import "../../style/default.css";

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 10px 0px 0px 0px;
		text-align: left;

	}

	.content-hd {
		padding: 0;
		margin: 8px 0;
		text-align: left;
	}

	.imgSize {
		margin-top: 5px;
		padding-bottom: 5px;
		background-color: #FFF;
		float: left;
		width: 195px;
		height: 230px;
		margin-bottom: 15px;
		margin-left: 13px;
		/*display: flex;*/
		/*align-items: center;*/
		/*justify-content: center;*/
		overflow: hidden;
		border: 1px solid #E9E9E9;
		cursor: pointer;
		border-radius: 6px;
		position: relative;

		.imgSize-title {
			color: #999;
			height: 22px;
			line-height: 22px;
			font-size: 14px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			border-bottom: 1px solid #E9E9E9;
		}

		.imgSize-img {
			display: flex;
			align-items: center;
			justify-content: center;
			/*width: 156.8px;*/
			/*height: 152px;*/
		}

		img {
			width: 172px;
			height: 136px;
		}
	}

	.imgSize:nth-child(5n+0) {
		margin-right: 0;
	}

	.active {
		border: 1px solid #3B74FF;
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

	/deep/ .ant-card-head-title {
		padding: 6px 0;
		color: #999;
		font-size: 14px;
	}

	/deep/ .ant-card-head {
		padding: 0 10px;
		min-height: 36px;
		border-bottom: 0;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card {
		display: inline-block;
		margin-bottom: 0px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card .anticon {
		font-size: 16px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		display: block;
	}

	.audio {
		width: 100%;
		height: 52px;
	}

	.box {
		float: right;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
		border: 2px solid #01b065;
	}

	.wifi-symbol {
		width: 30px;
		height: 30px;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(135deg);
		position: absolute;
		left: 13px;
		top: 6px;
	}

	.wifi-circle {
		border: 2px solid #01b065;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 5px;
		height: 5px;
		background: #01b065;
		top: 25px;
		left: 25px;
	}

	.second {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
	}

	.third {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
	}

	.second1 {
		width: 25px;
		height: 25px;
		top: 15px;
		left: 15px;
		animation: fadeInOut 1s infinite 0.2s;
	}

	.third1 {
		width: 40px;
		height: 40px;
		top: 5px;
		left: 5px;
		animation: fadeInOut 1s infinite 0.4s;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	/deep/ .video-js {
		max-width: 100%;
		height: 112.5px;
	}
</style>