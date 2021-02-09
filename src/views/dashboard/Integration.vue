<template>
	<div>
		<div>
			<a-tabs @change="changeTab" type="card">
				<a-tab-pane tab="智慧店铺" key="1">
					<a-col style="border: 1px solid #E2E2E2;background: #FFF;padding: 0 10px 20px;margin: 0 20px;">
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								将指定SaaS平台的标识正确填入输入框，可获取到其指定的通用页面地址，通过企业微信的聊天侧边栏发送给客户。（暂不支持其他第三方平台）</p>
							<p style="margin-bottom: 2px;">
								步骤：</p>
							<p style="margin-bottom: 2px;">
								1，请登录<a :href="$store.state.cashierUrl + '/cashier/merchants.php?m=Index&c=login&a=index'"
								        target="_blank">智慧店铺系统</a>--商家配置--商家资料--复制标识</p>
							<p style="margin-bottom: 2px;">
								2，将已复制的标识粘贴在应用集成-智慧店铺卡券里，提交即可。（由于系统无法判断您填写的标识是否是正确，故一旦没有按照文档要求填写，则客户无法打开。）</p>
						</div>
						<div>
							第三方标识：
							<a-input placeholder="请填写第三方的标识，提交获取“智慧店铺”的通用地址" style="margin-left: 5px;width: 500px;"
							         v-model="inputValue"
							         autoComplete="off"/>
							<a-button type="primary" style="margin-left: 10px;" @click="find">提交</a-button>
						</div>
					</a-col>

					<!-- 表格部分 -->
					<div class="content-bd" style="border-top: 0;">
						<a-spin tip="加载中..." size="large" :spinning="isLoading">
							<div class="spin-content">
								<a-button type="primary" style="float: right;margin: 8px 20px;z-index:999;"
								          @click="editAll"
								          v-if="allVisible">批量修改
								</a-button>
								<a-button style="float: right;margin: 8px 20px;z-index:999;" @click="cancelEditAll"
								          v-if="!allVisible">取消
								</a-button>
								<template v-if="integrationList.length > 0">
									<a-button type="primary"
									          style="width: 100px;margin: 8px 0 8px 20px;float: right;z-index:999;"
									          @click="submit"
									          v-if="!allVisible || allFlag">提交
									</a-button>
								</template>
								<a-table
										:columns="columns"
										:dataSource="integrationList"
										:pagination="false"
										:rowClassName="rowClassName">
									<template
											v-for="col in ['titleMsg','content','group_name','img','status','action']"
											:slot="col"
											slot-scope="text, record, index"
									>
										<div :key="col">
											<template v-if="col == 'titleMsg'">
												<template v-if="!record.flag">
													<a-textarea :rows="1" :value="text"
													            @change="e => handleChange3(e.target.value, record.key)"
													            :maxLength="32" style="width: calc(100% - 39px);"/>
													<span style="margin-left: 3px;">{{text.length}}</span>/32
												</template>
												<template v-else>
													<span v-if="text == '' || text == null">--</span>
													<span v-if="text != ''">{{text}}</span>
												</template>
											</template>
											<template v-if="col == 'content'">
												<template v-if="!record.flag">
													<a-textarea :rows="1" :value="text"
													            @change="e => handleChange(e.target.value, record.key,col)"
													            :maxLength="128" style="width: calc(100% - 55px);"/>
													<span style="margin-left: 3px;">{{text.length}}</span>/128
												</template>
												<template v-else>
													<span v-if="text == '' || text == null">--</span>
													<span v-if="text != ''">{{text}}</span>
												</template>
											</template>
											<template v-if="col == 'group_name'">
												<a-tree-select
														style="width: 250px"
														:dropdownStyle="{ maxHeight: '300px', overflow: 'auto',maxWidth: '250px' }"
														:treeData="groupList"
														treeDefaultExpandAll
														v-model="record.group_id"
														v-if="!record.flag"
														@change="e => handleChange2(e, record.key, col)"
												>
												</a-tree-select>
												<template v-else>
													<span v-if="text == '' || text == null">--</span>
													<span v-if="text != ''">{{text}}</span>
												</template>
											</template>
											<template v-if="col == 'img'">
												<template v-if="!record.flag">
													<a-upload
															name="avatar"
															listType="picture-card"
															:showUploadList="false"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															:beforeUpload="beforeUpload"
															:customRequest="selfUpload"
															@change="openImgModal(record.key)"
													>
														<img :src="text" alt="avatar"
														     style="width: 60px;height: 60px;"/>
													</a-upload>
												</template>
												<template v-else>
													<a-avatar shape="square" :src="text"
													          style="width: 60px;height: 60px;"/>
												</template>
											</template>
											<template v-if="col == 'status'">
												<a-switch :defaultChecked="text == 0 ? false : true"
												          @click="e => changeStatus(e, index)" v-if="!record.flag"/>
												<template v-else>
													<span v-if="text == 1">开启</span>
													<span v-if="text == 0">关闭</span>
												</template>
											</template>
											<template v-if="col == 'action'">
												<template v-if="!allVisible">
													--
												</template>
												<template v-if="allVisible">
													<template v-if="!record.flag">
														<a-button style="margin-left:5px;" @click="edit(record,index)"
														          v-if="record.flag">修改
														</a-button>
														<a-button style="margin-left:5px;"
														          @click="cancelEdit(record,index)"
														          v-if="!record.flag">取消
														</a-button>
													</template>
													<template v-else>
														<a-button style="margin-left:5px;" @click="edit(record,index)"
														          v-if="record.flag">修改
														</a-button>
														<a-button style="margin-left:5px;"
														          @click="cancelEdit(record,index)"
														          v-if="!record.flag">取消
														</a-button>
														<a-popconfirm
																title="确定开启吗?"
																@confirm="start(index)"
																okText="确定"
																cancelText="取消"
														>
															<a-button style="margin-left:5px;"
															          v-if="record.status == 0">开启
															</a-button>
														</a-popconfirm>
														<a-popconfirm
																title="确定关闭吗?"
																@confirm="close(index)"
																okText="确定"
																cancelText="取消"
														>
															<a-button style="margin-left:5px;"
															          v-if="record.status == 1">关闭
															</a-button>
														</a-popconfirm>
													</template>
												</template>
											</template>
										</div>
									</template>
								</a-table>
								<div v-if="integrationList.length > 0" style="text-align: center;">
									<a-button type="primary"
									          style="width: 100px;margin: 20px;z-index:999;"
									          @click="submit"
									          v-if="!allVisible || allFlag">提交
									</a-button>
								</div>
							</div>
						</a-spin>
					</div>
				</a-tab-pane>
				<a-tab-pane tab="电商" key="2">
					<a-col style="border: 1px solid #E2E2E2;background: #FFF;padding: 0 10px 20px;margin: 0 20px;">
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								将指定SaaS平台的标识正确填入输入框，可获取到其指定的通用页面地址，通过企业微信的聊天侧边栏发送给客户。（暂不支持其他第三方平台）</p>
							<p style="margin-bottom: 2px;">
								步骤：</p>
							<p style="margin-bottom: 2px;">
								1，请登录<a :href="$store.state.cashierUrl + '/cashier/merchants.php?m=Index&c=login&a=index'"
								        target="_blank">智慧店铺系统</a>--顶部导航电商分销--首页--复制店铺ID
								<a-tooltip placement="right">
									<template slot="title">
										<img src="../../assets/dianshang.png" alt="" style="width: 100%;">
									</template>
									<a-icon type="question-circle"/>
								</a-tooltip>
							</p>
							<p style="margin-bottom: 2px;">
								2，将已复制的标识粘贴在应用集成-智慧店铺卡券里，提交即可。（由于系统无法判断您填写的标识是否是正确，故一旦没有按照文档要求填写，则客户无法打开。）</p>
						</div>
						<div>
							第三方标识：
							<a-input placeholder="请填写第三方的标识，提交获取“电商”的通用地址" style="margin-left: 5px;width: 500px;"
							         v-model="inputValue2"
							         autoComplete="off"/>
							<a-button type="primary" style="margin-left: 10px;" @click="find">提交</a-button>
						</div>
					</a-col>
					<!-- 表格部分 -->
					<div class="content-bd" style="border-top: 0;">
						<a-spin tip="加载中..." size="large" :spinning="isLoading">
							<div class="spin-content">
								<a-button type="primary" style="float: right;margin: 8px 20px;z-index:999;"
								          @click="editAll"
								          v-if="allVisible">批量修改
								</a-button>
								<a-button style="float: right;margin: 8px 20px;z-index:999;" @click="cancelEditAll"
								          v-if="!allVisible">取消
								</a-button>
								<template v-if="integrationList2.length > 0">
									<a-button type="primary"
									          style="width: 100px;margin: 8px 0 8px 20px;float: right;z-index:999;"
									          @click="submit"
									          v-if="!allVisible || allFlag2">提交
									</a-button>
								</template>
								<a-table
										:columns="columns"
										:dataSource="integrationList2"
										:pagination="false"
										:rowClassName="rowClassName">
									<template
											v-for="col in ['titleMsg','content','group_name','img','status','action']"
											:slot="col"
											slot-scope="text, record, index"
									>
										<div :key="col">
											<template v-if="col == 'titleMsg'">
												<template v-if="!record.flag">
													<a-textarea :rows="1" :value="text"
													            @change="e => handleChange3(e.target.value, record.key)"
													            :maxLength="32" style="width: calc(100% - 39px);"/>
													<span style="margin-left: 3px;">{{text.length}}</span>/32
												</template>
												<template v-else>
													<span v-if="text == '' || text == null">--</span>
													<span v-if="text != ''">{{text}}</span>
												</template>
											</template>
											<template v-if="col == 'content'">
												<template v-if="!record.flag">
													<a-textarea :rows="1" :value="text"
													            @change="e => handleChange(e.target.value, record.key,col)"
													            :maxLength="128" style="width: calc(100% - 55px);"/>
													<span style="margin-left: 3px;">{{text.length}}</span>/128
												</template>
												<template v-else>
													<span v-if="text == '' || text == null">--</span>
													<span v-if="text != ''">{{text}}</span>
												</template>
											</template>
											<template v-if="col == 'group_name'">
												<a-tree-select
														style="width: 250px"
														:dropdownStyle="{ maxHeight: '300px', overflow: 'auto',maxWidth: '250px' }"
														:treeData="groupList"
														treeDefaultExpandAll
														v-model="record.group_id"
														v-if="!record.flag"
														@change="e => handleChange2(e, record.key, col)"
												>
												</a-tree-select>
												<template v-else>
													<span v-if="text == '' || text == null">--</span>
													<span v-if="text != ''">{{text}}</span>
												</template>
											</template>
											<template v-if="col == 'img'">
												<template v-if="!record.flag">
													<a-upload
															name="avatar"
															listType="picture-card"
															:showUploadList="false"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															:beforeUpload="beforeUpload"
															:customRequest="selfUpload"
															@change="openImgModal(record.key)"
													>
														<img :src="text" alt="avatar"
														     style="width: 60px;height: 60px;"/>
													</a-upload>
												</template>
												<template v-else>
													<a-avatar shape="square" :src="text"
													          style="width: 60px;height: 60px;"/>
												</template>
											</template>
											<template v-if="col == 'status'">
												<a-switch :defaultChecked="text == 0 ? false : true"
												          @click="e => changeStatus(e, index)" v-if="!record.flag"/>
												<template v-else>
													<span v-if="text == 1">开启</span>
													<span v-if="text == 0">关闭</span>
												</template>
											</template>
											<template v-if="col == 'action'">
												<template v-if="!allVisible">
													--
												</template>
												<template v-if="allVisible">
													<template v-if="!record.flag">
														<a-button style="margin-left:5px;" @click="edit(record,index)"
														          v-if="record.flag">修改
														</a-button>
														<a-button style="margin-left:5px;"
														          @click="cancelEdit(record,index)"
														          v-if="!record.flag">取消
														</a-button>
													</template>
													<template v-else>
														<a-button style="margin-left:5px;" @click="edit(record,index)"
														          v-if="record.flag">修改
														</a-button>
														<a-button style="margin-left:5px;"
														          @click="cancelEdit(record,index)"
														          v-if="!record.flag">取消
														</a-button>
														<a-button style="margin-left:5px;" @click="start(index)"
														          v-if="record.status == 0">
															开启
														</a-button>
														<a-button style="margin-left:5px;" @click="close(index)"
														          v-if="record.status == 1">
															关闭
														</a-button>
													</template>
												</template>
											</template>
										</div>
									</template>
								</a-table>
								<div v-if="integrationList2.length > 0" style="text-align: center;">
									<a-button type="primary"
									          style="width: 100px;margin: 20px;z-index:999;"
									          @click="submit"
									          v-if="!allVisible || allFlag2">提交
									</a-button>
								</div>
							</div>
						</a-spin>
					</div>
				</a-tab-pane>
				<a-tab-pane tab="教育培训" key="3">
					<a-col style="border: 1px solid #E2E2E2;background: #FFF;padding: 0 10px 20px;margin: 0 20px;">
						<div class="content-msg">
							<p style="margin-bottom: 2px;">
								将指定SaaS平台的标识正确填入输入框，可获取到其指定的通用页面地址，通过企业微信的聊天侧边栏发送给客户。（暂不支持其他第三方平台）</p>
							<p style="margin-bottom: 2px;">
								步骤：</p>
							<p style="margin-bottom: 2px;">
								1，请登录<a :href="$store.state.qxyUrl + '/web.php#/login'" target="_blank">教育培训</a>--首页--复制右上角ID
								<a-tooltip placement="right">
									<template slot="title">
										<img src="../../assets/qinxiaoyun.png" alt="" style="width: 100%;">
									</template>
									<a-icon type="question-circle"/>
								</a-tooltip>
							</p>
							<p style="margin-bottom: 2px;">
								2，将已复制的标识粘贴在应用集成-教育培训里，提交即可。（由于系统无法判断您填写的标识是否是正确，故一旦没有按照文档要求填写，则客户无法打开。）</p>
						</div>
						<div>
							第三方标识：
							<a-input placeholder="请填写第三方的标识，提交获取“教育培训”的通用地址" style="margin-left: 5px;width: 500px;"
							         v-model="inputValue3"
							         autoComplete="off"/>
							<a-button type="primary" style="margin-left: 10px;" @click="find">提交</a-button>
						</div>
					</a-col>
					<!-- 表格部分 -->
					<div class="content-bd" style="border-top: 0;">
						<a-spin tip="加载中..." size="large" :spinning="isLoading">
							<div class="spin-content">
								<a-button type="primary" style="float: right;margin: 8px 20px;z-index:999;"
								          @click="editAll"
								          v-if="allVisible">批量修改
								</a-button>
								<a-button style="float: right;margin: 8px 20px;z-index:999;" @click="cancelEditAll"
								          v-if="!allVisible">取消
								</a-button>
								<template v-if="integrationList3.length > 0">
									<a-button type="primary"
									          style="width: 100px;margin: 8px 0 8px 20px;float: right;z-index:999;"
									          @click="submit"
									          v-if="!allVisible || allFlag3">提交
									</a-button>
								</template>
								<a-table
										:columns="columns"
										:dataSource="integrationList3"
										:pagination="false"
										:rowClassName="rowClassName">
									<template
											v-for="col in ['titleMsg','content','group_name','img','status','action']"
											:slot="col"
											slot-scope="text, record, index"
									>
										<div :key="col">
											<template v-if="col == 'titleMsg'">
												<template v-if="!record.flag">
													<a-textarea :rows="1" :value="text"
													            @change="e => handleChange3(e.target.value, record.key)"
													            :maxLength="32" style="width: calc(100% - 39px);"/>
													<span style="margin-left: 3px;">{{text.length}}</span>/32
												</template>
												<template v-else>
													<span v-if="text == '' || text == null">--</span>
													<span v-if="text != ''">{{text}}</span>
												</template>
											</template>
											<template v-if="col == 'content'">
												<template v-if="!record.flag">
													<a-textarea :rows="1" :value="text"
													            @change="e => handleChange(e.target.value, record.key,col)"
													            :maxLength="128" style="width: calc(100% - 55px);"/>
													<span style="margin-left: 3px;">{{text.length}}</span>/128
												</template>
												<template v-else>
													<span v-if="text == '' || text == null">--</span>
													<span v-if="text != ''">{{text}}</span>
												</template>
											</template>
											<template v-if="col == 'group_name'">
												<a-tree-select
														style="width: 250px"
														:dropdownStyle="{ maxHeight: '300px', overflow: 'auto',maxWidth: '250px' }"
														:treeData="groupList"
														treeDefaultExpandAll
														v-model="record.group_id"
														v-if="!record.flag"
														@change="e => handleChange2(e, record.key, col)"
												>
												</a-tree-select>
												<template v-else>
													<span v-if="text == '' || text == null">--</span>
													<span v-if="text != ''">{{text}}</span>
												</template>
											</template>
											<template v-if="col == 'img'">
												<template v-if="!record.flag">
													<a-upload
															name="avatar"
															listType="picture-card"
															:showUploadList="false"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															:beforeUpload="beforeUpload"
															:customRequest="selfUpload"
															@change="openImgModal(record.key)"
													>
														<img :src="text" alt="avatar"
														     style="width: 60px;height: 60px;"/>
													</a-upload>
												</template>
												<template v-else>
													<a-avatar shape="square" :src="text"
													          style="width: 60px;height: 60px;"/>
												</template>
											</template>
											<template v-if="col == 'status'">
												<a-switch :defaultChecked="text == 0 ? false : true"
												          @click="e => changeStatus(e, index)" v-if="!record.flag"/>
												<template v-else>
													<span v-if="text == 1">开启</span>
													<span v-if="text == 0">关闭</span>
												</template>
											</template>
											<template v-if="col == 'action'">
												<template v-if="!allVisible">
													--
												</template>
												<template v-if="allVisible">
													<template v-if="!record.flag">
														<a-button style="margin-left:5px;" @click="edit(record,index)"
														          v-if="record.flag">修改
														</a-button>
														<a-button style="margin-left:5px;"
														          @click="cancelEdit(record,index)"
														          v-if="!record.flag">取消
														</a-button>
													</template>
													<template v-else>
														<a-button style="margin-left:5px;" @click="edit(record,index)"
														          v-if="record.flag">修改
														</a-button>
														<a-button style="margin-left:5px;"
														          @click="cancelEdit(record,index)"
														          v-if="!record.flag">取消
														</a-button>
														<a-button style="margin-left:5px;" @click="start(index)"
														          v-if="record.status == 0">
															开启
														</a-button>
														<a-button style="margin-left:5px;" @click="close(index)"
														          v-if="record.status == 1">
															关闭
														</a-button>
													</template>
												</template>
											</template>
										</div>
									</template>
								</a-table>
								<div v-if="integrationList3.length > 0" style="text-align: center;">
									<a-button type="primary"
									          style="width: 100px;margin: 20px;z-index:999;"
									          @click="submit"
									          v-if="!allVisible || allFlag3">提交
									</a-button>
								</div>
							</div>
						</a-spin>
					</div>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>

<script>

	const columns = [
		{
			title      : "分享图片",
			dataIndex  : "img",
			key        : "img",
			width      : '80px',
			scopedSlots: {customRender: "img"}
		},
		{
			title      : "链接名称",
			dataIndex  : "title",
			key        : "title",
			width      : '20%',
			scopedSlots: {customRender: "titleMsg"}
		},
		{
			title      : "描述",
			dataIndex  : "content",
			key        : "content",
			width      : '25%',
			scopedSlots: {customRender: "content"}
		},
		{
			title      : "同步到内容引擎",
			dataIndex  : "group_name",
			key        : "group_name",
			width      : '20%',
			scopedSlots: {customRender: "group_name"}
		},
		{
			title      : "状态",
			dataIndex  : "status",
			key        : "status",
			width      : '70px',
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '200px',
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		components: {},
		data () {
			return {
				isLoading       : false, //Loading 组件显示与隐藏
				commonUrl       : this.$store.state.commonUrl,//公共的链接
				site_type       : 1,//1智慧店铺，2电商，3教育培训
				allVisible      : true,//修改全部按钮的显示与隐藏
				//表格部分
				columns,
				inputValue      : '',//智慧店铺输入的第三方标识
				inputValue2     : '',//电商输入的第三方标识
				inputValue3     : '',//教育培训输入的第三方标识
				//智慧店铺
				integrationList : [],//智慧店铺应用集成列表
				cacheData       : [],
				arr             : [],
				editingKey      : '',//修改的数据的index值
				allFlag         : false,//表格中是否有修改状态
				//电商
				integrationList2: [],//电商应用集成列表
				cacheData2      : [],
				arr2            : [],
				editingKey2     : '',//修改的数据的index值
				allFlag2        : false,//表格中是否有修改状态
				//教育培训
				integrationList3: [],//教育培训应用集成列表
				cacheData3      : [],
				arr3            : [],
				editingKey3     : '',//修改的数据的index值
				allFlag3        : false,//表格中是否有修改状态

				groupList: [],//分组列表
				msgData  : [],//修改时传给后台数据
				imgKey   : '',//选择图片一行的key
				fileInfo : {}, //上传图片的文件信息
				list     : [],//关闭、开启时的过渡数据
			};
		},
		methods   : {
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			//切换tab
			changeTab (e) {
				this.site_type = e
				this.allVisible = true
				this.getList()
			},
			//判断之前有没有输入过sign,并获取表格内容
			async getList () {
				this.isLoading = true;
				const {data: res} = await this.axios.post(
					"attachment/application-list",
					{
						uid      : localStorage.getItem("uid"),
						site_type: this.site_type,
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.allVisible = true
					if (this.site_type == 1) {
						this.inputValue = res.data.sign
						this.integrationList = res.data.application
						const newData = [...this.integrationList];
						newData.map(x => {
							x.flag = true;
						})
						this.integrationList = newData;
						this.cacheData = this.integrationList.map(item => ({...item}));
						this.arr = this.integrationList.map(item => ({...item}));
					} else if (this.site_type == 2) {
						this.inputValue2 = res.data.sign
						this.integrationList2 = res.data.application
						const newData = [...this.integrationList2];
						newData.map(x => {
							x.flag = true;
						})
						this.integrationList2 = newData;
						this.cacheData2 = this.integrationList2.map(item => ({...item}));
						this.arr2 = this.integrationList2.map(item => ({...item}));
					} else if (this.site_type == 3) {
						this.inputValue3 = res.data.sign
						this.integrationList3 = res.data.application
						const newData = [...this.integrationList3];
						newData.map(x => {
							x.flag = true;
						})
						this.integrationList3 = newData;
						this.cacheData3 = this.integrationList3.map(item => ({...item}));
						this.arr3 = this.integrationList3.map(item => ({...item}));
					}
				}
			},
			//提交第三方标识
			async find () {
				let sign = ''
				if (this.site_type == 1) {
					if (this.inputValue == '') {
						this.$message.error('请填写第三方的标识，提交获取“智慧店铺”的通用地址');
						return false
					} else {
						sign = this.inputValue
					}
				} else if (this.site_type == 2) {
					if (this.inputValue2 == '') {
						this.$message.error('请填写第三方的标识，提交获取“电商”的通用地址');
						return false
					} else {
						sign = this.inputValue2
					}
				} else if (this.site_type == 3) {
					if (this.inputValue3 == '') {
						this.$message.error('请填写第三方的标识，提交获取“教育培训”的通用地址');
						return false
					} else {
						sign = this.inputValue3
					}
				}
				this.isLoading = true;
				const {data: res} = await this.axios.post(
					"attachment/application-sign-add",
					{
						uid      : localStorage.getItem("uid"),
						site_type: this.site_type,
						sign     : sign
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.getList()
				}
			},
			//修改全部
			editAll () {
				this.allVisible = false
				if (this.site_type == 1) {
					this.cacheData = this.arr.map(item => ({...item}));
					this.integrationList.map(x => {
						x.flag = false
					})
				} else if (this.site_type == 2) {
					this.cacheData2 = this.arr2.map(item => ({...item}));
					this.integrationList2.map(x => {
						x.flag = false
					})
				} else if (this.site_type == 3) {
					this.cacheData3 = this.arr3.map(item => ({...item}));
					this.integrationList3.map(x => {
						x.flag = false
					})
				}
			},
			//取消修改全部
			cancelEditAll () {
				this.allVisible = true
				if (this.site_type == 1) {
					this.integrationList = [...this.cacheData];
					this.integrationList.map(x => {
						x.flag = true
					})
				} else if (this.site_type == 2) {
					this.integrationList2 = [...this.cacheData2];
					this.integrationList2.map(x => {
						x.flag = true
					})
				} else if (this.site_type == 3) {
					this.integrationList3 = [...this.cacheData3];
					this.integrationList3.map(x => {
						x.flag = true
					})
				}
			},
			//修改单独一条
			edit (record, index) {
				if (this.site_type == 1) {
					this.cacheData = this.integrationList.map(item => ({...item}));
					const newData = [...this.integrationList];
					record.flag = false;
					this.editingKey = index
					this.integrationList = newData;
					for (let i = 0; i < this.integrationList.length; i++) {
						if (!this.integrationList[i].flag) {
							this.allFlag = true
							return false
						} else {
							this.allFlag = false
						}
					}
				} else if (this.site_type == 2) {
					this.cacheData2 = this.integrationList2.map(item => ({...item}));
					const newData = [...this.integrationList2];
					record.flag = false;
					this.editingKey2 = index
					this.integrationList2 = newData;
					for (let i = 0; i < this.integrationList2.length; i++) {
						if (!this.integrationList2[i].flag) {
							this.allFlag2 = true
							return false
						} else {
							this.allFlag2 = false
						}
					}
				} else if (this.site_type == 3) {
					this.cacheData3 = this.integrationList3.map(item => ({...item}));
					const newData = [...this.integrationList3];
					record.flag = false;
					this.editingKey3 = index
					this.integrationList3 = newData;
					for (let i = 0; i < this.integrationList3.length; i++) {
						if (!this.integrationList3[i].flag) {
							this.allFlag3 = true
							return false
						} else {
							this.allFlag3 = false
						}
					}
				}
			},
			//取消修改单独一条
			cancelEdit (record, index) {
				if (this.site_type == 1) {
					const newData = [...this.integrationList];
					this.editingKey = ''
					const target = newData.filter(item => record.key === item.key)[0];
					if (target) {
						Object.assign(target, this.cacheData.filter(item => record.key === item.key)[0]);
						target.flag = true;
						this.integrationList = newData;
					}
					for (let i = 0; i < this.integrationList.length; i++) {
						if (!this.integrationList[i].flag) {
							this.allFlag = true
							return false
						} else {
							this.allFlag = false
						}
					}
				} else if (this.site_type == 2) {
					const newData = [...this.integrationList2];
					this.editingKey2 = ''
					const target = newData.filter(item => record.key === item.key)[0];
					if (target) {
						Object.assign(target, this.cacheData2.filter(item => record.key === item.key)[0]);
						target.flag = true;
						this.integrationList2 = newData;
					}
					for (let i = 0; i < this.integrationList2.length; i++) {
						if (!this.integrationList2[i].flag) {
							this.allFlag2 = true
							return false
						} else {
							this.allFlag2 = false
						}
					}
				} else if (this.site_type == 3) {
					const newData = [...this.integrationList3];
					this.editingKey3 = ''
					const target = newData.filter(item => record.key === item.key)[0];
					if (target) {
						Object.assign(target, this.cacheData3.filter(item => record.key === item.key)[0]);
						target.flag = true;
						this.integrationList3 = newData;
					}
					for (let i = 0; i < this.integrationList3.length; i++) {
						if (!this.integrationList3[i].flag) {
							this.allFlag3 = true
							return false
						} else {
							this.allFlag3 = false
						}
					}
				}
			},
			//开启单独一条
			start (index) {
				this.isLoading = true
				if (this.site_type == 1) {
					this.list = JSON.parse(JSON.stringify(this.integrationList))
					this.integrationList[index].status = 1
				} else if (this.site_type == 2) {
					this.list = JSON.parse(JSON.stringify(this.integrationList2))
					this.integrationList2[index].status = 1
				}
				if (this.site_type == 3) {
					this.list = JSON.parse(JSON.stringify(this.integrationList3))
					this.integrationList3[index].status = 1
				}
				this.submit()
			},
			//关闭单独一条
			close (index) {
				this.isLoading = true
				if (this.site_type == 1) {
					this.list = JSON.parse(JSON.stringify(this.integrationList))
					this.integrationList[index].status = 0
				} else if (this.site_type == 2) {
					this.list = JSON.parse(JSON.stringify(this.integrationList2))
					this.integrationList2[index].status = 0
				}
				if (this.site_type == 3) {
					this.list = JSON.parse(JSON.stringify(this.integrationList3))
					this.integrationList3[index].status = 0
				}
				this.submit()
			},
			//获取分组
			async getGroupList () {
				const {data: res} = await this.axios.post("attachment/group", {
					uid       : localStorage.getItem('uid'),
					is_channel: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
				}
			},
			//修改链接名称
			handleChange3 (value, key) {
				if (this.site_type == 1) {
					const newData = [...this.integrationList];
					const target = newData.filter(item => key === item.key)[0];
					if (target) {
						target['title'] = value;
						this.integrationList = newData;
					}
				} else if (this.site_type == 2) {
					const newData = [...this.integrationList2];
					const target = newData.filter(item => key === item.key)[0];
					if (target) {
						target['title'] = value;
						this.integrationList2 = newData;
					}
				} else if (this.site_type == 3) {
					const newData = [...this.integrationList3];
					const target = newData.filter(item => key === item.key)[0];
					if (target) {
						target['title'] = value;
						this.integrationList3 = newData;
					}
				}
			},
			//修改描述
			handleChange (value, key, column) {
				if (this.site_type == 1) {
					const newData = [...this.integrationList];
					const target = newData.filter(item => key === item.key)[0];
					if (target) {
						target[column] = value;
						this.integrationList = newData;
					}
				} else if (this.site_type == 2) {
					const newData = [...this.integrationList2];
					const target = newData.filter(item => key === item.key)[0];
					if (target) {
						target[column] = value;
						this.integrationList2 = newData;
					}
				} else if (this.site_type == 3) {
					const newData = [...this.integrationList3];
					const target = newData.filter(item => key === item.key)[0];
					if (target) {
						target[column] = value;
						this.integrationList3 = newData;
					}
				}
			},
			//修改分组
			handleChange2 (value, key, column) {
				if (this.site_type == 1) {
					const newData = [...this.integrationList];
					const target = newData.filter(item => key === item.key)[0];
					if (target) {
						target[column] = value;
						this.integrationList = newData;
					}
				} else if (this.site_type == 2) {
					const newData = [...this.integrationList2];
					const target = newData.filter(item => key === item.key)[0];
					if (target) {
						target[column] = value;
						this.integrationList2 = newData;
					}
				} else if (this.site_type == 3) {
					const newData = [...this.integrationList3];
					const target = newData.filter(item => key === item.key)[0];
					if (target) {
						target[column] = value;
						this.integrationList3 = newData;
					}
				}
			},
			//修改图片
			openImgModal (key) {
				this.imgKey = key
				this.uploadMaterial()
			},
			async uploadMaterial () {
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", this.fileInfo);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (this.site_type == 1) {
						const newData = [...this.integrationList];
						const target = newData.filter(item => this.imgKey === item.key)[0];
						if (target) {
							target['img'] = this.commonUrl + res.data.local_path;
							this.integrationList = newData;
						}
					} else if (this.site_type == 2) {
						const newData = [...this.integrationList2];
						const target = newData.filter(item => this.imgKey === item.key)[0];
						if (target) {
							target['img'] = this.commonUrl + res.data.local_path;
							this.integrationList2 = newData;
						}
					} else if (this.site_type == 3) {
						const newData = [...this.integrationList3];
						const target = newData.filter(item => this.imgKey === item.key)[0];
						if (target) {
							target['img'] = this.commonUrl + res.data.local_path;
							this.integrationList3 = newData;
						}
					}
				} else {
					this.$message.error(res.error_msg)
				}
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

				let isLt2M = file.size / 1024 / 1024 < 2;

				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				return isLt2M;
			},
			//修改状态
			changeStatus (checked, index) {
				if (this.site_type == 1) {
					const newData = [...this.integrationList];
					if (checked) {
						newData[index].status = '1';
					} else {
						newData[index].status = '0';
					}
					this.integrationList = newData;
				} else if (this.site_type == 2) {
					const newData = [...this.integrationList2];
					if (checked) {
						newData[index].status = '1';
					} else {
						newData[index].status = '0';
					}
					this.integrationList2 = newData;
				} else if (this.site_type == 3) {
					const newData = [...this.integrationList3];
					if (checked) {
						newData[index].status = '1';
					} else {
						newData[index].status = '0';
					}
					this.integrationList3 = newData;
				}
			},
			//提交
			async submit () {
				let msgData = []
				if (this.site_type == 1) {
					msgData = [...this.integrationList]
				} else if (this.site_type == 2) {
					msgData = [...this.integrationList2]
				} else if (this.site_type == 3) {
					// console.log(this.integrationList3, 'integrationList3')
					msgData = [...this.integrationList3]
				}
				const {data: res} = await this.axios.post(
					"attachment/application-attachment",
					{
						uid      : localStorage.getItem("uid"),
						site_type: this.site_type,
						msgData  : msgData
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					if (this.site_type == 1) {
						this.integrationList = JSON.parse(JSON.stringify(this.list))
					} else if (this.site_type == 2) {
						this.integrationList2 = JSON.parse(JSON.stringify(this.list))
					}
					if (this.site_type == 3) {
						this.integrationList3 = JSON.parse(JSON.stringify(this.list))
					}
				} else {
					this.getList()
				}
				this.isLoading = false
			},
		},

		created () {
			this.getList()
			this.getGroupList()
		}
	};
</script>

<style lang='less' scoped>
	@import '../../style/_style.less';

	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
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

	/deep/ .ant-upload.ant-upload-select {
		margin-right: 10px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card {
		width: 60px;
		height: 60px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0;
	}

	/deep/ .ant-form {
		padding: 0 20px;
	}

	/deep/ .ant-tabs-bar {
		padding: 0 20px !important;
		background: none !important;
		margin: 0 !important;
	}

	/deep/ .ant-form-item {
		padding: 0px 20px;
	}

	/deep/ .ant-form-item:first-child {
		padding-top: 10px;
	}

	/deep/ .ant-form-item:last-child {
		padding-top: 10px;
	}

	/deep/ .ant-tabs-nav .ant-tabs-tab {
		margin: 0 !important;
	}

	.img-box {
		width: 60px;
		height: 60px;
		cursor: pointer;
	}

	.img-size {
		width: 100%;
		height: 100%;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
		text-align: left;
		margin-bottom: 20px;
	}

	/deep/ .ant-table-fixed-header .ant-table-scroll .ant-table-header {
		margin-right: -5px;
	}

	/deep/ .ant-tooltip-content {
		width: 350px;
	}
</style>