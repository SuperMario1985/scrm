<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden">
				<!-- 左侧 -->
				<a-layout-sider v-if="wxLen > 1">
					<!-- 公众号 -->
					<div class="sider-one">
						<div class="sider-one-txt">选择公众号</div>
						<a-select showSearch optionFilterProp="children" style="width: 200px;margin-bottom: 20px;"
						          @change="handleChange" v-model="changeBackground" v-if="wxInfo[0]">
							<template v-for="item in wxInfo">
								<a-select-option :value="item.wx_id">{{item.nick_name}}</a-select-option>
							</template>
						</a-select>
						<div class="wx-info" ref="wxInfo" style="" @mousemove="wxInfoMouseOver"
						     @mouseout="wxInfoMouseOut">
							<template v-for="(item,index) in wxInfo">

								<div @click="selectWx(item.wx_id,item.authorizer_type,item.nick_name, item.verify_type)" class="selectWx"
								     :class="{ active:changeBackground == item.wx_id}">
									<a-avatar :src="item.head_img" shape="square"/>
									<span style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;float: right;width: calc(100% - 35px);">{{item.nick_name}}</span>
								</div>
							</template>
						</div>
					</div>
				</a-layout-sider>
				<a-layout style="position: absolute;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;"
				          :style="wxLen > 1 ? {left: '250px'} : {left: '0px'}"
				          class="scroll">
					<!-- 头部 -->
					<a-layout-header>标签管理</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								1、在本系统内创建的标签会自动同步到微信公众平台，微信公众平台产生的标签需要进行手动同步到本系统内，标签的同步保证了粉丝数据的一致性。</p>
							<p style="margin-bottom: 2px;">
								2、若公众平台已存在某微信标签，而在本系统内又尚无手动同步过该标签。此时，在本系统内新建该标签名，则会提示“该标签名称与微信标签重复，请手动同步微信标签即可。”</p>
							<p style="margin-bottom: 0;">3、标签总数量最多为 100 个，每个粉丝最多被打上 20 个标签。</p>
						</div>
						<div class="content-hd">
							<div class="content-hd-left">
								共有
								<span style="color: blue">{{total}}</span>个标签
							</div>
							<div class="content-hd-right">
								<label v-if="lastTagTime">最后一次同步时间：{{lastTagTime}}</label>
								<a-button class="btn-primary" icon="reload" @click="sysTag()"
								          v-if="this.$store.state.authorizer_type != 'unauthorized' && verify_service" v-has="'tag-wx-sync'">
									同步微信标签
								</a-button>
								<a-button class="btn-primary" icon="reload" @click="showConfirmWx"
								          v-if="this.$store.state.authorizer_type == 'unauthorized' || !verify_service" v-has="'tag-wx-sync'">
									同步微信标签
								</a-button>
								<a-button class="btn-primary" icon="plus" @click="showModal('add')" type="primary"
								          v-if="this.$store.state.authorizer_type != 'unauthorized' && verify_service" v-has="'tag-add'">
									新建标签
								</a-button>
								<a-button class="btn-primary" icon="plus" @click="showConfirmWx" type="primary"
								          v-if="this.$store.state.authorizer_type == 'unauthorized' || !verify_service" v-has="'tag-add'">
									新建标签
								</a-button>
								<a-modal title="新建标签" v-model="visible" @ok="handleOk(inputValue)"
								         :confirmLoading="confirmLoading3" @cancel="cancel">
									<p style="margin: 0px 0px 10px 0;font-size: 13px; color: #909399;">
										每个标签名称最多6个字。同时新建多个标签时，请用“空格”隔开</p>
									<a-input placeholder="请输入标签（不得超过6个字符）" v-model="inputValue"/>

								</a-modal>
							</div>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="tagsList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'tag-list'">
                <span slot="customTitle">
                  微信后台粉丝数
                  <a-tooltip placement="bottom">
                    <template slot="title">
                      <span>在本系统上操作的标签，可以自动同步到微信后台。如因在其他平台操作所导致的差别较大，请手动同步粉丝。</span>
                    </template>
                    <a-icon type="question-circle" style="margin-left:5px;"/>
                  </a-tooltip>
                </span>
				<span slot="tags" slot-scope="name">
                  <a-tag color="#2db7f5" class="tag-name" style="">{{name}}</a-tag>
                </span>
				<span slot="action" slot-scope="text, record">
                  <span @click="showModal2(text, record)"
                        style="color: #01b065;margin-right: 25px;cursor: pointer;" v-if="$store.state.authorizer_type != 'unauthorized' && verify_service" v-has="'tag-edit'">编辑</span>
					<span @click="showConfirmWx" style="color: #01b065;margin-right: 25px;cursor: pointer;" v-if="$store.state.authorizer_type == 'unauthorized' || !verify_service" v-has="'tag-edit'">编辑</span>
                  <span @click="showModal3(text, record)" style="color: #01b065;cursor: pointer;" v-if="$store.state.authorizer_type != 'unauthorized' && verify_service" v-has="'tag-delete'">删除</span>
					<span @click="showConfirmWx" style="color: #01b065;cursor: pointer;" v-if="$store.state.authorizer_type == 'unauthorized' || !verify_service" v-has="'tag-delete'">删除</span>
                </span>
								</a-table>

								<!-- 编辑按钮弹窗 -->
								<a-modal title="修改标签名称" v-model="visible2" @ok="handleOk2"
								         :confirmLoading="confirmLoading">
									<a-input placeholder="请输入标签" v-model="inputValue2" :maxLength="6">
                  <span slot="suffix">
                    <span>{{inputValue2.length}}</span>/6
                  </span>
									</a-input>
								</a-modal>
								<!-- 删除按钮弹窗 -->
								<a-modal title="删除粉丝标签" v-model="visible3" @ok="handleOk3"
								         :confirmLoading="confirmLoading2">
									<div style="margin: 19px 0px;">
										<a-icon type="exclamation-circle"
										        style="color: #F7BA2A; font-size: 25px;margin-right: 10px;"/>
										<span style="display: inline-block;width:90%;line-height: 26px;vertical-align: top;white-space: normal;word-break: break-all;"><span
												style="color: red;">{{inputValue3}}</span>  标签删除后，则相应的用户失去了该标签属性。确定删除吗？</span>
									</div>
								</a-modal>
								<!-- 分页 -->
								<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0" v-has="'tag-list'">
									<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
									              :current="page"
									              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
									              @change="changePage"
									              @showSizeChange="showSizeChange"/>
								</div>
							</a-spin>
						</div>
					</a-layout-content>

				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";

	const columns = [
		{
			title      : "标签名称",
			dataIndex  : "name",
			width      : "25%",
			scopedSlots: {customRender: "tags"},
			key        : "name"
		},
		{
			title    : "粉丝数",
			dataIndex: "fans_num",
			width    : "25%",
			key      : "fans_num"
		},
		{
			dataIndex  : "wx_fans_num",
			key        : "wx_fans_num",
			slots      : {title: "customTitle"},
			scopedSlots: {customRender: "wx_fans_num"}
		},

		{
			title      : "操作",
			dataIndex  : "action",
			width      : "25%",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		data () {
			let changeBackground = localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				lastTagTime     : '',
				tagsList        : [], //表格信息
				isLoading       : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				wxLen           : JSON.parse(localStorage.getItem('wxArr')).length,
				wxInfo          : [], //微信公众号列表
				verify_service    : false,
				visible         : false, //新建标签
				inputValue      : "", //新建标签输入框值
				newTagList      : [], //新建标签数组
				visible2        : false, //编辑按钮
				inputValue2     : "", //编辑标签的内容
				tagId           : "", //标签id
				visible3        : false, //删除按钮
				inputValue3     : "", //删除标签的内容
				//分页
				total           : 1, //总条数
				quickJumper     : false, // 是否显示快速跳转的控件
				page            : 1, //页码
				page_size       : 15, //每页数据量，默认15
				pageSize        : 15, //每页数据条数
				changeBackground: changeBackground, //选中背景色
				confirmLoading  : false, //编辑弹框加载
				confirmLoading2 : false, //删除弹框加载
				confirmLoading3 : false, //新建标签弹框加载
				oldValue        : '',//编辑之前的标签名
			};
		},

		methods: {
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			wxInfoMouseOver () {
				this.$refs.wxInfo.style.overflowY = "auto";
			},
			wxInfoMouseOut () {
				this.$refs.wxInfo.style.overflowY = "hidden";
			},
			// 公众号
			handleChange (value) {
				this.verify_service = false
				this.wxInfo.map((x)=>{
					if(value == x.wx_id){
						this.$store.commit("changeAuthorizerType", x.authorizer_type);
						this.$store.commit("changeWxNickName", x.nick_name);
						if (x.verify_type == '已认证') {
							this.verify_service = true
						}
					}
				})
				this.$store.dispatch("changeWxNum", value);
				this.getTags();
				this.isLoading = true;
				this.changeBackground = value
				if(localStorage.getItem('isMasterAccount') == 2){
					this.$store.dispatch('getPermissionButton')
				}
			},
			selectWx (id, authorizer_type, nick_name, verify_type) {
				this.verify_service = false
				if (verify_type == '已认证') {
					this.verify_service = true
				}
				this.$store.dispatch("changeWxNum", id);
				this.getTags();
				this.isLoading = true;
				this.changeBackground = id
				this.$store.commit("changeAuthorizerType", authorizer_type);
				this.$store.commit("changeWxNickName", nick_name);
				if(localStorage.getItem('isMasterAccount') == 2){
					this.$store.dispatch('getPermissionButton')
				}
			},
			showConfirmWx () {
				if(this.$store.state.authorizer_type == 'unauthorized') {
					this.$success({
						title: this.$store.state.wxNickName + '已取消授权，无法操作',
					});
				} else {
					this.$success({
						title: '仅针对认证的订阅号或服务号开放使用',
					});
					return false
				}
			},
			// 新建标签
			showModal () {
				this.visible = true;
			},
			handleOk (val) {
				let that = this
				that.confirmLoading3 = true
				if (that.tagsList.length >= 100) {
					that.$message.warning("每个公众号最多添加100个标签！");
					that.confirmLoading3 = false;
					return false;
				}
				if (val == "") {
					that.$message.warning("不能为空");
					that.confirmLoading3 = false;
					return false;
				} else {
					for (var i = 0; i < val.split(" ").length; i++) {
						if (val.split(" ")[i].length > 6) {
							that.$message.error("每个标签最多6个字");
							that.confirmLoading3 = false
							that.inputValue = "";
							return false;
						} else if (
							val.split(" ")[i].length > 0
						) {
							that.newTagList.push(val.split(" ")[i]);
							that.confirmLoading3 = false;
						}
					}
					that.addTags();
					that.newTagList = []
					that.inputValue = ""
				}
			},
			async addTags () {
				const {data: res} = await this.axios.post("tags/tags-create", {
					wx_id:localStorage.getItem('wxNum'),
					tag_name: this.newTagList
				});
				if (res.error != 0) {
					if (res.error_msg == '标签名非法，请注意不能和其他标签重名') {
						this.$message.error('该标签名称与微信标签重复，请手动同步微信标签即可。');
					} else {
						this.$message.error(res.error_msg);
					}
				} else {
					this.isLoading = true;
					this.getTags();
					this.inputValue = "";
					this.newTagList = []
				}
			},
			cancel(){
				this.inputValue = ''
				this.visible = false
			},
			//编辑按钮
			showModal2 (text, record) {
				this.visible2 = true;
				this.oldValue = record.name;
				this.inputValue2 = record.name
				this.tagId = record.key;
			},
			handleOk2 (e) {
				this.confirmLoading = true
				if (this.inputValue2 == '') {
					this.$message.error('请填写标签名称');
					this.confirmLoading = false
					return false
				} else if (this.inputValue2 == this.oldValue) {
					this.$message.success('提交成功');
					this.confirmLoading = false
					this.visible2 = false
				} else {
					this.editTag();
				}
			},
			async editTag () {
				const {data: res} = await this.axios.post("tags/tags-update", {
					wx_id:localStorage.getItem('wxNum'),
					tag_name: this.inputValue2,
					tag_id  : this.tagId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.$message.success('修改成功');
					this.getTags(this.page, this.pageSize);
				}
			},
			//删除按钮
			showModal3 (text, record) {
				// console.log(record)
				this.visible3 = true;
				this.tagId = record.key;
				this.inputValue3 = record.name;
			},
			handleOk3 (e) {
				this.confirmLoading2 = true
				this.deleteTags();
			},
			async deleteTags () {
				const {data: res} = await this.axios.post("tags/tags-del", {
					wx_id:localStorage.getItem('wxNum'),
					tag_id: this.tagId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading2 = false
				} else {
					if(this.page > 1 && this.tagsList.length == 1) {
						this.getTags(this.page - 1, this.pageSize);
					} else {
						this.getTags(this.page, this.pageSize);
					}

				}
			},

			//同步标签
			async sysTag () {
				this.isLoading = true
				const {data: res} = await this.axios.post("tags/refresh-tags-list",{
					wx_id:localStorage.getItem('wxNum'),
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message
						.info("已进入后台刷新中，请耐心等待...", 2.5)
						.then(() => this.$message.error(res.error_msg, 2.5))
				} else {
					message.info("已进入后台刷新中，请耐心等待...");

					this.getTags();
				}
			},
			//获取表格内容
			async getTags (page = 1, pageSize = this.pageSize) {
				this.wxInfo = this.$store.state.wxArr;
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id:localStorage.getItem('wxNum'),
					page    : page,
					pageSize: pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.tagsList = res.data.info;
					this.lastTagTime = res.data.last_tag_time;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					this.confirmLoading = false
					this.visible2 = false;
					this.confirmLoading2 = false
					this.visible3 = false;
					this.confirmLoading3 = false
					this.visible = false;
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getTags(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,120)
				})
			},
			showSizeChange (page, pageSize) {
				this.getTags(1, pageSize);
			}
		},

		created () {
			this.$store.dispatch('getWx', (info) => {
				this.wxInfo = info;
				if (!this.changeBackground && this.wxInfo.length > 0) {
					this.changeBackground = this.$store.state.wxNum;
				}
			});
			this.verify_service = this.wxInfo[this.$store.state.wxNumIndex].verify_type === '已认证';
			this.getTags();
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.wx-info {
		width: 100%;
		position: absolute;
		left: 0;
		top: 100px;
		bottom: 0;
		overflow: hidden;
	}

	.wx-info::-webkit-scrollbar {
		width: 2px;
		height: 100%;
	}

	.wx-info::-webkit-scrollbar-track-piece {
		background-color: #FFFFFF;
	}

	.wx-info::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #FFFFFF;
	}

	/*.wx-info::-webkit-scrollbar-track*/
	/*{*/
	/*	border-radius: 10px;  !*滚动条的背景区域的圆角*!*/
	/*	background-color: white;!*滚动条的背景颜色*!*/
	/*}*/
	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}


	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
		border-right: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}

	.content-hd {
		height: 60px;
		width: 100%;
		min-width: 885px;
		line-height: 60px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

	.msg-info {
		color: #FFDDA6;
		margin-right: 10px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		width: 100%;
	}

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
	}

	.list,
	.ant-layout.ant-layout-has-sider {
		height: 100%;
	}

	.content-hd-left {
		float: left;
	}

	.content-hd-right {
		float: right;
	}

	.btn-primary {
		/*width: 145px;*/
		/*height: 30px;*/
		margin-left: 20px;
		/*text-align: left;*/
		/*padding: 0;*/

		/*span {*/
		/*	display: inline-block;*/
		/*	width: 90px;*/
		/*	height: 30px;*/
		/*	line-height: 30px;*/
		/*	text-align: center;*/
		/*}*/
	}

	.sider-one {
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.selectWx {
		width: 200px;
		margin-left: 20px;
		/*margin: auto;*/
		height: 50px;
		line-height: 50px;
		cursor: pointer;
		padding-left: 10px;
	}

	.active {
		background: #01b065;
		color: white;
	}

	.tag-name {
		padding: 6px 14px;
		height: 34px;
		font-size: 13px;
		border: 1px solid #D9D9D9;
		background-color: transparent !important;
		color: rgba(0, 0, 0, 0.65);
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}
</style>
