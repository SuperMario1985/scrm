<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">企业微信管理</label>
			</a-card>
			<a-row style="margin-bottom:20px;padding:0 20px;">
				<a-col style="float:left;">
					<a-input-search
							placeholder="搜索企业微信名称"
							style="width: 200px;margin-right:15px;"
							@search="onSearch"
							v-model="searchInput"
					/>
					<a-button type="primary" style="margin-right:15px;" @click="find">查找</a-button>
					<a-button @click="clear">清空</a-button>
				</a-col>
				<a-col style="float:right;">
					<a-button
							type="primary"
							icon="plus"
							style="width: 150px;font-size:14px;"
							@click="addAuthAccount" v-has="'work-management-add'"
					>添加企业微信号
					</a-button>
				</a-col>
			</a-row>

			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="Loading..." size="large" :spinning="isLoading">
					<div class="spin-content">
						<a-table
								:columns="columns"
								:dataSource="accountList"
								:pagination="false"
								:rowClassName="rowClassName" v-has="'work-management-list'"
						>
							<template slot="name" slot-scope="text, record, index">
								<img style="height: 32px;border-radius: 4px;" src="../../assets/WeChatLogo.png"/>
								<span style="margin-left: 10px;">{{record.corp_full_name || record.corp_name}}</span>
							</template>
							<template slot="action" slot-scope="text, record, index">
								<template v-if="record.auth_type == ''">
									<a-button style="margin: 10px 5px 0 0;" @click="SeeCorp(record)">查看</a-button>
									<a-button @click="editCorp(record)">设置</a-button>
								</template>
								<template v-else>
									<a-button v-if="record.auth_type == 'cancel_auth'" @click="reAuthAccount">
										重新授权
									</a-button>
									<a-button v-else @click="refreshCorp(record.id)">刷新</a-button>
								</template>
							</template>
						</a-table>
					</div>
				</a-spin>
			</div>
		</div>
		<!-- 点击添加企业微信号弹窗 -->
		<a-modal
				:title="titleTip"
				v-model="showWxModal"
				@cancel="handleCancel"
				@ok="handleOk"
				width="750px"
				:confirmLoading="corpOkDisabled"
				:okButtonProps="{ props: {disabled: corpOkDisabled} }"
				:footer="is_footer == 1 ? footer : null">
			<div style="padding: 10px 0px;min-height: 300px;overflow: auto;">
				<!-- 企业名称 -->
				<a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
					<span slot="label">
	                    <span style="color: red;"> * </span>企业名称
	                </span>
					<div v-show="is_select == 1">
						<a-select :disabled="corpname_disabled" v-model="corpid"
						          style="width: 150px;margin-right:15px;">
							<template v-for="(item,index) in notBindList" style="display: inline-block;">
								<a-select-option :value="item.corpid"
								                 @click="changeCorpTitle(item.corp_id,item.corpid,item.corp_name)">
									{{item.corp_name}}
								</a-select-option>
							</template>
						</a-select>
						<span v-show="is_edit == 0" @click="changeSelect(0)" style="cursor: pointer">新建</span>
					</div>
					<div v-show="is_select == 0">
						<a-input :disabled="corpname_disabled" v-model="corp_name" style="width: calc(100% - 100px)"
						         placeholder="请输入企业名称"/>
						<span v-show="is_footer == 0 && is_edit == 0 && notBindList.length > 0" @click="changeSelect(1)"
						      style="cursor: pointer;margin-left:5px;">返回绑定</span>
					</div>
				</a-form-item>
				<!-- 企业ID -->
				<a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="padding-top: 10px;">
					<span slot="label">
	                    <span style="color: red;"> * </span>企业ID（CorpID）
	                </span>
					<a-input :disabled="corpid_disabled" v-model="corpid" style="width: calc(100% - 100px)"
					         placeholder="请输入企业ID" :maxLength="20"/>
					<!--					<div>-->
					<a style="margin-left: 5px;" target="_blank"
					   href="https://support.qq.com/products/104790/faqs/61151">如何获取？</a>
					<!--					</div>-->
				</a-form-item>
				<!-- Token -->
				<a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="padding-top: 10px;">
					<span slot="label">Token</span>
					<a-input style="width: calc(100% - 100px);"
					         v-if="typeof corpToken !== 'undefined' && corpToken.length >0" v-model="corpToken"
					         disabled>
					</a-input>
					<a-button style="margin-left: 5px;" type="primary"
					          v-if="typeof corpToken !== 'undefined' && corpToken.length >0"
					          @click="copyText(corpToken)">复制
					</a-button>
					<span v-if="typeof corpToken === 'undefined' || corpToken.length == 0">--</span>
				</a-form-item>
				<!-- EncodingAESKey -->
				<a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="padding-top: 10px;">
					<span slot="label">EncodingAESKey</span>
					<a-input-search style="width: calc(100% - 100px);"
					                v-if="typeof corpEncodingAESKey !== 'undefined' && corpEncodingAESKey.length >0"
					                v-model="corpEncodingAESKey" disabled>
					</a-input-search>
					<a-button style="margin-left: 5px;" type="primary"
					          v-if="typeof corpEncodingAESKey !== 'undefined' && corpEncodingAESKey.length >0"
					          @click="copyText(corpEncodingAESKey)">复制
					</a-button>
					<span v-if="typeof corpEncodingAESKey === 'undefined' || corpEncodingAESKey.length == 0">--</span>
				</a-form-item>
				<!-- 通讯录管理secret -->
				<a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="padding-top: 10px;">
					<span slot="label">
	                    <span style="color: red;"> * </span>通讯录管理secret
	                </span>
					<a-input :disabled="book_disabled" v-model="book_secret" style="width: calc(100% - 100px)"
					         placeholder="请输入通讯录管理secret"/>
					<!--					<div>-->
					<a style="margin-left: 5px;" target="_blank"
					   href="https://support.qq.com/products/104790/faqs/61151">如何获取？</a>
					<!--					</div>-->
				</a-form-item>
				<!-- 通讯录管理事件 -->
				<a-form-item v-show="showEvent" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
				             style="padding-top: 10px;">
					<span slot="label">通讯录事件服务</span>
					<a-radio-group name="bookStatus" :disabled="book_secret.length == 0 || bookEventDisabled"
					               v-model="bookStatus">
						<a-radio :value="0">不开启</a-radio>
						<a-radio :value="1">开启</a-radio>
					</a-radio-group>
					<div style="line-height: 20px;font-size: 13px;width: 480px; color: #F56C6C">
						开启后，可以将成员、部门的增删改以及成员的标签变更实时的同步到{{$store.state.siteName}}，无需手动更新同步。
					</div>
				</a-form-item>
				<a-form-item v-show="showEvent && bookStatus == 1" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
				             style="padding-top: 10px;">
					<span slot="label">通讯录事件地址</span>
					<span>{{bookUrl}}</span>
				</a-form-item>
				<!-- 外部联系人管理secret -->
				<a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="padding-top: 10px;">
					<span slot="label">
	                    <span style="color: red;"> * </span>外部联系人管理secret
	                </span>
					<a-input :disabled="external_disabled" v-model="external_secret" style="width: calc(100% - 100px)"
					         placeholder="请输入外部联系人管理secret"/>
					<!--					<div>-->
					<a style="margin-left: 5px;" target="_blank"
					   href="https://support.qq.com/products/104790/faqs/61151">如何获取？</a>
					<!--					</div>-->
				</a-form-item>
				<!-- 外部联系人管理事件 -->
				<a-form-item v-if="showEvent" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
				             style="padding-top: 10px;">
					<span slot="label">外部联系人事件服务</span>
					<a-radio-group name="externalStatus"
					               :disabled="external_secret.length == 0 || externalEventDisabled"
					               v-model="externalStatus">
						<a-radio :value="0">不开启</a-radio>
						<a-radio :value="1">开启</a-radio>
					</a-radio-group>
					<div style="line-height: 20px;font-size: 13px; width: 480px; color: #F56C6C">
						开启后，可以将企业客户的添加、编辑以及主动删除客户和被动被客户删除实时的同步到{{$store.state.siteName}}，无需手动更新同步。
					</div>
				</a-form-item>
				<a-form-item v-show="showEvent && externalStatus == 1" :label-col="{ span: 6 }"
				             :wrapper-col="{ span: 18 }" style="padding-top: 10px;">
					<span slot="label">外部联系人事件地址</span>
					<span>{{externalUrl}}</span>
				</a-form-item>
			</div>
		</a-modal>

		<corpAuthorize :show="showAuthModal" @cancel="cancel"></corpAuthorize>
	</div>
</template>

<script>
	import corpAuthorize from "@/components/AuthorizeCorp.vue"

	const columns = [
		{
			title      : "企业名称",
			dataIndex  : "name",
			width      : "15%",
			key        : "name",
			scopedSlots: {customRender: "name"}
		},
		{
			title    : "企业ID",
			dataIndex: "corpid",
			width    : "10%",
			key      : "corpid"
		},
		{
			title    : "应用秘钥",
			dataIndex: "suite_secret",
			width    : "15%",
			key      : "suite_secret"
		},
		{
			title    : "绑定时间",
			dataIndex: "bind_time",
			width    : "15%",
			key      : "bind_time"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			width      : "15%",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		data () {
			return {
				titleTip             : '添加企业微信号',//名称
				corp_name            : '',//企业名称
				corpid               : '',//企业ID
				corpToken            : '',//企业Token
				corpEncodingAESKey   : '',//企业EncodingAESKey
				book_secret          : '',//通讯录管理secret
				bookUrl              : '',//通讯录事件地址
				externalUrl          : '',//外部联系人事件地址
				external_secret      : '',//外部联系人管理secret
				is_footer            : 1,//是否显示底部按钮
				is_edit              : 0,//是否是编辑
				is_select            : 0,//是否显示绑定微信下拉框
				notBindList          : [],//未绑定的微信列表数据
				corp_id              : '',//要绑定的企业微信id
				corpname_disabled    : false,//是否disabled
				corpid_disabled      : false,//是否disabled
				book_disabled        : false,//是否disabled
				bookEventDisabled    : false,//是否通讯录disabled
				external_disabled    : false,//是否disabled
				externalEventDisabled: false,//是否外部联系人disabled
				showEvent            : false,//是否展现事件
				bookStatus           : 0,//是否开启通讯录事件
				externalStatus       : 0,//是否开启外部联系人事件

				showTransition: 1,
				nick_name     : "", //企业微信名称
				accountList   : [], //表格信息
				canAdd        : 1, //是否达到上线
				flag          : false, //暂无数据 的显示与隐藏
				searchInput   : "", //输入框的值
				isLoading     : true, //Loading 组件显示与隐藏
				commonUrl     : this.$store.state.commonUrl,//公共的链接
				showWxModal   : false, //添加企业微信对话框的显示与隐藏
				showAuthModal : false, //添加企业微信对话框的显示与隐藏
				corpOkDisabled: false, //防止重复添加
				//表格部分
				columns,
				page          : 1, //页码
				page_size     : 15, //每页数据量，默认15
				//分页
				total         : 0, //总条数
				quickJumper   : false, // 是否显示快速跳转的控件
			};
		},
		components: {
			corpAuthorize
		},
		mounted () {
			this.initHelp()
		},
		methods   : {
			//复制链接
			copyText (copyText) {
				let oInput = document.createElement("input");
				oInput.value = copyText;
				document.body.appendChild(oInput);
				oInput.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				oInput.className = "oInput";
				oInput.style.display = "none";
				this.$message.success('复制成功')
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 点我帮助动画

			initHelp () {
				let that = this
				setInterval(function () {
					that.showTransition = (that.showTransition + 1) % 5;
				}, 1000)
			},
			//搜索输入框
			onSearch (value3) {
				this.nick_name = value3;
				this.getAccount();
			},
			footer () {

			},
			//获取表格内容
			async getAccount (page = 1, pageSize = this.page_size) {
				const {data: res} = await this.axios.post(
					"work-corp/list",
					{
						uid            : localStorage.getItem("uid"),
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem('sub_id'),
						corp_name      : this.nick_name,
						page           : page,
						pageSize       : pageSize
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.message);
				} else {
					this.canAdd = res.data.canAdd
					this.accountList = res.data.info;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.page_size = pageSize;
					this.quickJumper = this.total > this.page_size;
					this.isLoading = false;
					this.notBindList = res.data.notBindList;
					if (this.notBindList.length > 0) {
						this.is_select = 1;
						this.corp_id = this.notBindList[0].corp_id;
						this.corpid = this.notBindList[0].corpid;
						this.corp_name = this.notBindList[0].corp_name;
						this.corpToken = this.notBindList[0].corp_token;
						this.corpEncodingAESKey = this.notBindList[0].corp_encoding_AES_key;
						this.corpid_disabled = true;
					} else {
						this.is_select = 0;
						this.corpid_disabled = false;
					}
					this.titleTip = '新增企业微信号';
					this.is_footer = 1;
					this.is_edit = 0;
					this.corpname_disabled = false;
					this.book_disabled = false;
					this.bookEventDisabled = false;
					this.external_disabled = false;
					this.externalEventDisabled = false;
				}
				//   console.log(this.accountList);
				if (this.accountList.length == 0) {
					this.flag = true;
				}
			},
			//点击搜索
			find () {
				this.nick_name = this.searchInput;
				this.getAccount();
			},
			//点击清空
			clear () {
				//location.reload();
				this.searchInput = '';
				this.nick_name = '';
				this.getAccount();
				this.flag = false;
			},
			changePage (page, page_size) {
				this.getAccount(page, page_size);
			},
			changeSelect (is_select) {
				this.corpname_disabled = false;
				if (is_select == 0) {
					this.corpid = '';
					this.corp_name = '';
					this.corpid_disabled = false;
				} else {
					this.corp_id = this.notBindList[0].corp_id;
					this.corpid = this.notBindList[0].corpid;
					this.corp_name = this.notBindList[0].corp_name;
					this.corpid_disabled = true;
				}
				this.book_secret = '';
				this.external_secret = '';
				this.is_select = is_select;
			},
			changeCorpTitle (id, corpid, name) {
				this.corp_id = id;
				this.corpid = corpid;
				this.corp_name = name;
			},
			SeeCorp (record) {
				this.titleTip = '查看企业微信号';
				this.is_footer = 0;
				this.is_edit = 1;
				this.is_select = 0;
				this.corp_id = record.corp_id;
				this.corpid = record.corpid;
				this.corp_name = record.corp_name;
				this.corpToken = record.corp_token;
				this.corpEncodingAESKey = record.corp_encoding_AES_key;
				this.book_secret = record.book_secret;
				this.external_secret = record.external_secret;
				this.bookStatus = record.book_status;
				this.bookUrl = record.book_url;
				this.externalStatus = record.external_status;
				this.externalUrl = record.external_url;
				this.corpname_disabled = true;
				this.corpid_disabled = true;
				this.book_disabled = true;
				this.bookEventDisabled = true;
				this.external_disabled = true;
				this.externalEventDisabled = true;
				this.showEvent = true;
				this.showWxModal = true;

			},
			editCorp (record) {
				this.titleTip = '编辑企业微信号';
				this.is_footer = 1;
				this.is_edit = 1;
				this.is_select = 0;
				this.corp_id = record.corp_id;
				this.corpid = record.corpid;
				this.corp_name = record.corp_name;
				this.corpToken = record.corp_token;
				this.corpEncodingAESKey = record.corp_encoding_AES_key;
				this.book_secret = record.book_secret;
				this.external_secret = record.external_secret;
				this.bookStatus = record.book_status;
				this.bookUrl = record.book_url;
				this.externalStatus = record.external_status;
				this.externalUrl = record.external_url;
				this.corpname_disabled = true;
				this.corpid_disabled = true;
				this.book_disabled = false;
				this.bookEventDisabled = false;
				this.external_disabled = false;
				this.externalEventDisabled = false;
				this.showEvent = true;
				this.showWxModal = true;
			},
			async refreshCorp (id) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-corp/refresh-corp", {
					id: id,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.getAccount(this.page, this.page_size)
				}
			},
			showSizeChange (page, page_size) {
				this.getAccount(1, page_size);
			},
			reAuthAccount () {
				this.showAuthModal = true;
			},
			addAuthAccount () {
				if (this.canAdd == 0) {
					this.$message.warning("添加数量已达上限，请联系渠道经理。")
					return false
				}
				this.showAuthModal = true;
			},
			cancel () {
				this.showAuthModal = false
			},
			//点击添加公众号
			addAccount () {
				if (this.canAdd == 0) {
					this.$message.warning("添加数量已达上限，请联系渠道经理。")
					return false
				}
				this.titleTip = '添加企业微信号';
				this.is_edit = 0;
				this.is_footer = 1;
				this.corpname_disabled = false;
				this.book_disabled = false;
				this.bookEventDisabled = false;
				this.external_disabled = false;
				this.externalEventDisabled = false;
				this.book_secret = '';
				this.external_secret = '';
				this.bookStatus = 0;
				this.bookUrl = '';
				this.externalStatus = 0;
				this.externalUrl = '';
				if (this.notBindList.length > 0) {
					this.is_select = 1;
					this.corp_id = this.notBindList[0].corp_id;
					this.corpid = this.notBindList[0].corpid;
					this.corpToken = this.notBindList[0].corp_token;
					this.corpEncodingAESKey = this.notBindList[0].corp_encoding_AES_key;
					this.corp_name = this.notBindList[0].corp_name;
					this.corpid_disabled = true;
				} else {
					this.is_select = 0;
					this.corp_name = '';
					this.corpid = '';
					this.corpToken = '';
					this.corpEncodingAESKey = '';
					this.corpid_disabled = false;
				}

				this.showEvent = false;
				this.showWxModal = true;
				this.corpOkDisabled = false
			},
			handleCancel () {
				this.showWxModal = false
				this.corpOkDisabled = false
			},
			handleOk () {
				this.corpOkDisabled = true
				if (this.corp_name == '') {
					this.$message.error('请输入企业名称！');
					this.corpOkDisabled = false
					return false;
				}
				if (this.corpid == '') {
					this.$message.error('请输入企业ID！');
					this.corpOkDisabled = false
					return false;
				}
				if (this.book_secret == '') {
					this.$message.error('请输入通讯录管理secret！');
					this.corpOkDisabled = false
					return false;
				}
				if (this.external_secret == '') {
					this.$message.error('请输入外部联系人管理secret！');
					this.corpOkDisabled = false
					return false;
				}
				this.corpBind();
			},
			async corpBind () {
				const {data: res} = await this.axios.post("work-corp/bind", {
					uid            : localStorage.getItem("uid"),
					is_edit        : this.is_edit,
					is_select      : this.is_select,
					corpid         : this.corpid,
					corp_name      : this.corp_name,
					book_secret    : this.book_secret,
					external_secret: this.external_secret,
					book_status    : this.bookStatus,
					external_status: this.externalStatus
				});
				if (res.error != 0) {
					this.corpOkDisabled = false;
					this.$message.error(res.error_msg);
				} else {
					this.showWxModal = false;
					this.$message.success('操作成功');
					if (this.corpid) {
						this.getAccount(this.page, this.page_size);
					} else {
						this.nick_name = ''
						this.searchInput = ''
						this.getAccount();
					}
					this.flag = false;
					this.corpOkDisabled = false
				}
			}
		},

		created () {
			this.getAccount();
		}
	};
</script>

<style lang='less' scoped>
	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.help {
		float: left;
		margin-left: 18px;
		/*margin-top: 3px;*/
	}

	.help-icon {
		margin-right: 5px;
		font-size: 14px;
		margin-top: 4px;
	}

	.help-transition {
		animation: help 1s infinite;
	}

	.help a {
		font-size: 14px;
	}

	.help a:link {
		color: #1890FF;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.help a:visited {
		color: #1890FF;
		text-decoration: none;
	}

	//已访问：紫色、无下划线
	.help-transition1 {
		animation: help1 1s infinite;
	}

	@keyframes help {
		0% {
			transform: translate(0px, 0px);
		}
		50% {
			transform: translate(0px, -8px);
		}
		100% {
			transform: translate(0px, 3px);
		}
	}

	@keyframes help1 {
		0% {
			transform: translate(0px, 3px);
		}
		50% {
			transform: translate(0px, -4px);
		}
		100% {
			transform: translate(0px, 0px);
		}
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		margin: 0 20px;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	a:link {
		text-decoration: none;
	}

	a:visited {
		text-decoration: none;
	}

	a:hover {
		text-decoration: none;
	}

	a:active {
		text-decoration: none;
	}
</style>