<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y:auto;" id="components-layout-demo-basic">
		<a-layout-content>	
			<div style="font-size:16px;font-weight:700;color:#333333">自定义属性</div>
			<div style="padding: 20px 20px 0 0;">
				<span @click="changeTab('1')" class="tabBtn" :class="{activeBtn:tabKey == 1}"
							v-has="hasHignAttribute">高级属性</span>
				<span @click="changeTab('2')" class="tabBtn" :class="{activeBtn:tabKey == 2}"
							v-has="hasFollowStatus">跟进状态</span>
			</div>
			<div v-show="tabKey == 1" style="background: #FFF;">
				<div class="content-msg">
	<!--				{{$store.state.siteName}}-->
				<p style="margin-bottom: 0;box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
					本系统提供手机号、姓名、公司、年龄、性别、行业、爱好、生日及所在区域等15个通用属性字段，属性类型包括文本、单选、多选、日期等。系统通用字段只可修改使用状态和排序顺序（数值越大，在手机端展示越靠前）。</p>
			</div>
				<a-row style="margin-bottom:20px;padding:0 20px;">
					<a-col style="float: left;">
						<a-select defaultValue="2" style="width: 120px" @change="selectStatus">
							<a-select-option value="2">全部状态</a-select-option>
							<a-select-option value="1">开启</a-select-option>
							<a-select-option value="0">关闭</a-select-option>
						</a-select>
					</a-col>
					<a-col style="float: right;">
						<a-button @click="addModel" v-if="allVisible" v-has="hasAddName" style="margin-right: 15px;">新增属性
						</a-button>
						<a-button type="primary" @click="editAll" v-if="allVisible" v-has="hasEditName">批量修改
						</a-button>
						<a-button type="primary"
											@click="submit"
											v-if="!allVisible" style="margin-right:15px;" :disabled="submitDisabled">提交
						</a-button>
						<a-button @click="cancelEditAll" v-if="!allVisible">取消
						</a-button>
					</a-col>
				</a-row>
				<!-- 表格部分 -->
				<div class="content-bd">
					<a-spin tip="加载中..." size="large" :spinning="isLoading">
						<div class="spin-content">
							<a-table :key="tableKey"
											:columns="columns"
											:dataSource="managentList"
											:pagination="false"
											:rowClassName="rowClassName"
											v-has="hasListName"
							>
								<template
										v-for="col in ['status', 'chat_status', 'titleMsg','type','optionVal','sort','action']"
										:slot="col"
										slot-scope="text, record, index"
								>
									<div :key="col">
										<template v-if="col == 'status'">
											<a-switch :defaultChecked="text == 0 ? false : true"
																@click="e => changeStatus(e, index)"
																v-if="!record.flag && record.key != 'sex'"/>
											<template v-else>
												<span v-if="text == 1">开启</span>
												<span v-if="text == 0">关闭</span>
											</template>
										</template>
										<template v-if="col == 'chat_status'">
											<a-switch :defaultChecked="text == 0 ? false : true"
																@click="e => changeChatStatus(e, index)"
																v-if="!record.flag && record.key != 'sex'"/>
											<template v-else>
												<span v-if="text == 1">开启</span>
												<span v-if="text == 0">关闭</span>
											</template>
										</template>
										<template v-if="col == 'titleMsg'">
											<template v-if="!record.flag">
												<span v-if="record.is_define == 0">{{text}}</span>
												<a-input :value="text" placeholder="请输入字段名称"
																v-if="record.is_define == 1"
																:maxLength="8"
																@change="e => handleChange(e.target.value, record.key)">
																	<span slot="suffix">
											<span>{{managentList[index].title.length}}</span>/8
										</span>
												</a-input>
											</template>
											<template v-else>
												{{text}}
											</template>
										</template>
										<template v-if="col == 'type'">
											<template v-if="!record.flag">
												<span v-if="!record.addFlag">
													<span v-if="text == 1">文本</span>
													<span v-if="text == 2">单选</span>
													<span v-if="text == 3">多选</span>
													<span v-if="text == 4">日期</span>
													<span v-if="text == 5">手机号</span>
													<span v-if="text == 6">邮箱</span>
													<span v-if="text == 7">区域</span>
													<span v-if="text == 8">图片</span>
												</span>
												<a-select :defaultValue="text" style="width: 120px;"
																	@change="e => handleChange2(e, record.key, col)"
																	v-if="record.addFlag && record.is_define == 1">
													<a-select-option value="1">文本</a-select-option>
													<a-select-option value="2">单选</a-select-option>
													<a-select-option value="3">多选</a-select-option>
													<a-select-option value="4">日期</a-select-option>
													<a-select-option value="5">手机号</a-select-option>
													<a-select-option value="6">邮箱</a-select-option>
													<a-select-option value="7">区域</a-select-option>
													<a-select-option value="8">图片</a-select-option>
												</a-select>
											</template>
											<template v-else>
												<span v-if="text == 1">文本</span>
												<span v-if="text == 2">单选</span>
												<span v-if="text == 3">多选</span>
												<span v-if="text == 4">日期</span>
												<span v-if="text == 5">手机号</span>
												<span v-if="text == 6">邮箱</span>
												<span v-if="text == 7">区域</span>
												<span v-if="text == 8">图片</span>
											</template>
										</template>
										<template v-if="col == 'optionVal'">
											<template v-if="!record.flag">
												<span v-if="record.is_define == 0">
													<span v-show="text == '' || text == null">--</span>
													<a-tooltip>
													<template slot="title">
														{{text}}
													</template>
													<span v-show="text != '' && text != null"
																class="optionVal-text">{{text}}</span>
												</a-tooltip>
												</span>
												<span v-if="record.is_define == 1">
													<span v-if="record.type == 2 || record.type == 3">
														<a-tag closable @close="e => delTag(e, tag,record.key)" v-for="tag in record.optionVal2" style="margin-bottom: 5px;">{{tag}}
														</a-tag>
														<a-textarea :rows="2"
																				@change="e => handleChange3(e.target.value, record.key,col)"
																				placeholder="请输入选项内容"/>
														<div>用“,”新增选项内容，每个选项内容不超过12个字</div>
													</span>
													<span v-else>--</span>
												</span>
											</template>
											<template v-if="record.flag">
												<span v-if="text == '' || text == null">--</span>
												<a-tooltip>
													<template slot="title">
														{{text}}
													</template>
													<span v-if="text != '' && text != null"
																class="optionVal-text">{{text}}</span>
												</a-tooltip>
											</template>
										</template>
										<template v-if="col == 'sort'">
											<template v-if="!record.flag">
												<a-input :value="text" placeholder="请输入排序展示"
																@change="e => handleChange4(e.target.value, record.key)">
												</a-input>
												<span style="color: red;">数值越大，在手机端展示越靠前</span>
											</template>
											<template v-else>
												{{text}}
											</template>
										</template>
										<template v-if="col == 'action'">
											<template v-if="!record.flag">
												<template v-if="!allVisible && record.is_define == 1">
													<a-button
															style="margin-left:5px;"
															@click="deleteOne(index)"
															v-has="hasDeleteName">
														删除
													</a-button>
												</template>
											</template>
											<template v-else>
												<a-popconfirm
														title="确定开启吗?"
														@confirm="submitOne(record, 1, 0)"
														okText="确定"
														cancelText="取消"
												>
													<a-button style="margin:0 0px 5px 5px;"
																		v-if="record.status == 0 && record.key != 'sex'">客户开启
													</a-button>
												</a-popconfirm>
												<a-popconfirm
														title="确定关闭吗?"
														@confirm="submitOne(record, 0, 0)"
														okText="确定"
														cancelText="取消"
												>
													<a-button style="margin:0 0px 5px 5px;"
																		v-if="record.status == 1 && record.key != 'sex'">客户关闭
													</a-button>
												</a-popconfirm>
												<a-popconfirm
														title="确定开启吗?"
														@confirm="submitOne(record, 1, 1)"
														okText="确定"
														cancelText="取消"
												>
													<a-button style="margin:0 0px 5px 5px;"
																		v-if="record.chat_status == 0 && record.key != 'sex'">群开启
													</a-button>
												</a-popconfirm>
												<a-popconfirm
														title="确定关闭吗?"
														@confirm="submitOne(record,0, 1)"
														okText="确定"
														cancelText="取消"
												>
													<a-button style="margin:0 0px 5px 5px;"
																		v-if="record.chat_status == 1 && record.key != 'sex'">群关闭
													</a-button>
												</a-popconfirm>
												<a-button style="margin:0 0px 5px 5px;" @click="edit(record,index)"
																	v-has="hasEditName">编辑
												</a-button>
												<a-popconfirm
														title="确定删除吗?"
														@confirm="submitOne(record,2)"
														okText="确定"
														cancelText="取消"
												>
													<a-button style="margin:0 0px 5px 5px;"
																		v-if="record.is_define == 1" v-has="hasDeleteName">
														删除
													</a-button>
												</a-popconfirm>
											</template>
										</template>
									</div>
								</template>
							</a-table>

							<div v-if="managentList.length > 0" style="margin-top: 20px;">
								<a-button type="link"
													@click="addLine"
													v-if="!allVisible" v-has="hasAddName">+ 增加自定义注册项
								</a-button>
							</div>
							<div v-if="managentList.length > 0" style="text-align: center;">
								<a-button @click="cancelEditAll" v-if="!allVisible"
													style="width: 100px;margin: 20px 20px 20px 0;z-index:999;">取消
								</a-button>
								<a-button type="primary"
													style="width: 100px;margin: 20px;z-index:999;"
													@click="submit"
													v-if="!allVisible" :disabled="submitDisabled">提交
								</a-button>
							</div>
						</div>
					</a-spin>
				</div>
				<!-- 新增弹窗 -->
				<a-modal :title="modelTitle" v-model="addVisible" @ok="addHandleOk" @cancel="addHandleCancel"
								width="565px">
					<a-form-model :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
						<a-form-model-item label="字段名称">
							<a-input v-model="form.title" placeholder="请输入字段名称"
											:maxLength="8" v-if="form.is_define == 1">
								<span slot="suffix">
																	<span>{{form.title.length}}</span>/8
								</span>
							</a-input>
							<span v-if="form.is_define == 0">{{form.title}}</span>
						</a-form-model-item>
						<a-form-model-item label="字段类型">
							<a-select v-model="form.type" v-if="!form.addFlag && form.is_define == 1">
								<a-select-option value="1">文本</a-select-option>
								<a-select-option value="2">单选</a-select-option>
								<a-select-option value="3">多选</a-select-option>
								<a-select-option value="4">日期</a-select-option>
								<a-select-option value="5">手机号</a-select-option>
								<a-select-option value="6">邮箱</a-select-option>
								<a-select-option value="7">区域</a-select-option>
								<a-select-option value="8">图片</a-select-option>
							</a-select>
							<template v-if="form.addFlag || form.is_define == 0">
								<span v-if="form.type == 1">文本</span>
								<span v-if="form.type == 2">单选</span>
								<span v-if="form.type == 3">多选</span>
								<span v-if="form.type == 4">日期</span>
								<span v-if="form.type == 5">手机号</span>
								<span v-if="form.type == 6">邮箱</span>
								<span v-if="form.type == 7">区域</span>
								<span v-if="form.type == 8">图片</span>
							</template>
						</a-form-model-item>
						<a-form-model-item label="选项内容" v-if="form.type == 2 || form.type == 3">
							<a-tag closable @close="e => delTag(e, tag)" v-for="tag in form.optionVal2"
										style="margin-bottom: 5px;" v-if="form.is_define == 1">{{tag}}
							</a-tag>
							<a-tag v-for="tag in form.optionVal2"
										style="margin-bottom: 5px;" v-if="form.is_define == 0">{{tag}}
							</a-tag>
							<a-input v-model="form.optionVal" type="textarea" placeholder="请输入选项内容"
											style="margin-top:3px;" v-if="form.is_define == 1"/>
							<div v-if="form.is_define == 1">用“,”新增选项内容，每个选项内容不超过12个字</div>
						</a-form-model-item>
						<a-form-model-item label="排序展示">
							<a-input v-model="form.sort" placeholder="请输入排序展示"
											style="margin-top:3px;"/>
							<span style="color: red;">数值越大，在手机端展示越靠前</span>
						</a-form-model-item>
						<a-form-model-item label="客户画像显示">
							<a-radio-group v-model="form.status" v-if="form.key != 'sex'">
								<a-radio value="1">开启</a-radio>
								<a-radio value="0">关闭</a-radio>
							</a-radio-group>
							<span v-if="form.key == 'sex'">开启</span>
						</a-form-model-item>
						<a-form-model-item label="群画像显示">
							<a-radio-group v-model="form.chat_status" v-if="form.key != 'sex'">
								<a-radio value="1">开启</a-radio>
								<a-radio value="0">关闭</a-radio>
							</a-radio-group>
							<span v-if="form.key == 'sex'">关闭</span>
						</a-form-model-item>
					</a-form-model>
				</a-modal>
			</div>
			<div v-show="tabKey == 2" style="background: #FFF;padding: 20px 0;margin: 0 20px;">
				<a-row style="margin-top: 10px; margin-left: 4.16%;">
					<template v-for="(item,index) in follows">
						<a-col :span="2"
									:style="{float : (index % 16 > 7 ? 'right' : 'left' ), marginRight : (index % 16 == 8 ? '4.17%' : '' )}">
							<a-button
									style="border: 1px solid #01b065; color: #01b065;width: 100%;overflow: hidden; text-overflow: ellipsis;">
								{{item.title}}
							</a-button>
						</a-col>
						<a-col :span="1" v-if="index % 8 != 7 && index != follows.length - 1"
									style="padding: 2px 0;text-align: center;"
									:style="{float : (index % 16 > 7 ? 'right' : 'left' )}">
							<div v-if="index % 16 > 7"
									class="arrow-left"></div>
							<div class="line"></div>
							<div v-if="index % 16 < 7"
									class="arrow-right"></div>
						</a-col>
						<a-col :span="23" v-if="index % 16 == 7 && index != follows.length - 1" style="margin-top: 10px;">
							<div class="line-right"></div>
						</a-col>
						<a-col :span="23" v-if="index % 16 == 7 && index != follows.length - 1"
									style="margin-bottom: 5px;">
							<div class="arrow-bottom arrow-bottom-right"></div>
						</a-col>
						<a-col :span="23" v-if="index % 16 == 15 && index != follows.length - 1" style="margin-top: 10px;">
							<div class="line-left"></div>
						</a-col>
						<a-col :span="23" v-if="index % 16 == 15 && index != follows.length - 1"
									style="margin-bottom: 5px;">
							<div class="arrow-bottom arrow-bottom-left"></div>
						</a-col>
					</template>
				</a-row>
				<div style="height: 40px; line-height: 40px;margin: 20px 0 10px 0;">
					<span style="color: #FF562D;margin-left: 20px;">鼠标移动面板更改状态排序</span>
					<a-button type="primary"@click="addFollow"
										style="margin-right: 20px;vertical-align: middle;float: right;">新增
					</a-button>
				</div>
				<a-spin tip="加载中..." size="large" :spinning="isLoading1">
					<a-table :columns="columns1" :dataSource="follows" class="follow-table" style="margin: 20px;"
									:pagination="false" :rowClassName="rowClassName">
						<span slot="sort" slot-scope="text, record,index">
							{{index + 1}}
						</span>
						<span slot="describe" slot-scope="text, record,index">
								{{record.describe || '--'}}
							</span>
						<span slot="action" slot-scope="text, record,index">
							<a-button style="margin-right: 5px;"
												@click="editFollow(record.id, record.title, record.describe)">
								编辑
							</a-button>
							<a-button @click="delFollow(record.id)">
								删除
							</a-button>
							</span>
					</a-table>
				</a-spin>
			</div>
		</a-layout-content>
		<a-modal :visible="followVisible" :title="addOrEditTitle" @cancel="handleCancelFollow"
		         width="720px">
			<template slot="footer">
				<a-button @click="handleCancelFollow">取消</a-button>
				<a-button :loading="isLoading2" type="primary" @click="handleFollow">确定</a-button>
			</template>
			<a-form>
				<a-form-item label="状态名称" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-input :maxLength="8" v-model="title" placeholder="请输入状态名称，8个字以内">
						<span slot="suffix">
		                    <span>{{title.length}}</span>/8
						</span>
					</a-input>
				</a-form-item>
				<a-form-item label="状态描述" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-input :maxLength="50" v-model="desc" placeholder="请输入状态描述，50个字以内">
						<span slot="suffix">
		                    <span>{{desc.length}}</span>/50
						</span>
					</a-input>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>

	import TemplateList from "../template/List";

	const columns = [
		{
			title      : "字段名称",
			dataIndex  : "title",
			key        : "title",
			width      : '15%',
			scopedSlots: {customRender: "titleMsg"}
		},
		{
			title      : "字段格式",
			dataIndex  : "type",
			key        : "type",
			width      : '10%',
			scopedSlots: {customRender: "type"}
		},
		{
			title      : "选项内容",
			dataIndex  : "optionVal",
			key        : "optionVal",
			width      : '25%',
			scopedSlots: {customRender: "optionVal"}
		},
		{
			title      : "排序展示",
			dataIndex  : "sort",
			key        : "sort",
			width      : '15%',
			scopedSlots: {customRender: "sort"}
		},
		{
			title      : "客户画像显示",
			dataIndex  : "status",
			key        : "status",
			width      : '10%',
			scopedSlots: {customRender: "status"}
		},
		{
			title      : "群画像显示",
			dataIndex  : "chat_status",
			key        : "chat_status",
			width      : '10%',
			scopedSlots: {customRender: "chat_status"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];
	const columns1 = [
		{
			title      : "排序",
			dataIndex  : "sort",
			key        : "sort",
			scopedSlots: {customRender: "sort"}
		},
		{
			title    : "客户阶段",
			dataIndex: "title",
			key      : "title",
		},
		{
			title      : "阶段描述",
			dataIndex  : "describe",
			key        : "describe",
			scopedSlots: {customRender: "describe"}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		components: {TemplateList},
		data () {
			return {
				isLoading       : false, //Loading 组件显示与隐藏
				isLoading1      : false, // 跟进状态表格加载
				commonUrl       : this.$store.state.commonUrl,//公共的链接
				allVisible      : true,//修改全部按钮的显示与隐藏
				tableKey        : 0,
				managentList    : [],//列表
				cacheData       : [],
				arr             : [],
				editingKey      : '',//修改的数据的index值
				//表格部分
				columns,
				columns1,
				addVisible      : false,//新增弹窗的显示与隐藏
				form            : {
					title      : '',
					type       : '1',
					optionVal  : '',
					status     : '1',
					chat_status: '1',
					sort       : 0,
					is_define  : 0,
					addFlag    : false,//判断打开弹窗是新增还是编辑，编辑为true，新增为false
				},
				modelTitle      : '新增属性',//弹窗名称
				id              : '',//单独编辑某一条的属性id
				key             : 0,//新增行的虚拟key,防止报错
				submitDisabled  : false,//提交按钮的置灰
				visible         : true,
				status          : '2',//2全部，0关闭，1开启
				follows         : [],//跟进记录状态列表
				startId         : '',
				endId           : '',
				tabKey          : '1',//1高级属性，2跟进状态
				hasHignAttribute: '',//高级属性的权限名，企业微信“hignAttribute”，“hignAttributeFans”
				hasFollowStatus : '',//跟进状态的权限名，企业微信“followStatus”，“followStatusFans”
				hasAddName      : '',//新增属性的权限名，企业微信“customerAttribute-add”，“customerFansAttribute-add”
				hasEditName     : '',//修改属性的权限名，企业微信“customerAttribute-edit”，“customerFansAttribute-edit”
				hasListName     : '',//列表属性的权限名，企业微信“customerAttribute-list”，“customerFansAttribute-list”
				hasDeleteName   : '',//删除属性的权限名，企业微信“customerAttribute-del”，“customerFansAttribute-del”
				followId        : '',//编辑状态
				title           : '',// 状态名称
				desc            : '',// 状态描述
				followVisible   : false,
				isLoading2      : false,
				addOrEditTitle  : '',
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
			//筛选状态
			selectStatus (e) {
				this.status = e
				this.getList()
			},
			//判断之前有没有输入过sign,并获取表格内容
			async getList () {
				this.isLoading = true;
				const {data: res} = await this.axios.post(
					"custom-field/field-list",
					{
						uid   : localStorage.getItem("uid"),
						status: this.status
					}
				);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false;
					this.allVisible = true

					this.managentList = res.data.field
					const newData = [...this.managentList];
					newData.map(x => {
						if (x.type == 2 || x.type == 3) {
							x.optionVal2 = x.optionVal.split(',')
						}
						x.flag = true;
					})
					this.managentList = newData;
					this.cacheData = this.managentList.map(item => ({...item}));
					this.arr = this.managentList.map(item => ({...item}));
					this.$forceUpdate()
				}
			},
			//新增属性
			addModel () {
				this.modelTitle = '新增属性'
				this.form = {
					title      : '',
					type       : '1',
					optionVal  : '',
					status     : '1',
					chat_status: '1',
					sort       : 0,
					is_define  : 1,
					addFlag    : false
				}
				this.addVisible = true
			},
			//确定新增
			addHandleOk () {
				if (this.form.title.trim() == '') {
					this.$message.error('请填写字段名称');
					return false
				}
				if (!this.form.addFlag) {
					if (this.form.type == 2 || this.form.type == 3) {
						if (this.form.optionVal == '') {
							this.$message.error('请填写选项内容');
							return false
						}
					}
				}
				var reg = /^(?:0|[1-9][0-9]?|100)$/
				if (!reg.test(this.form.sort)) {
					this.$message.warning("排序展示必须为0-100正整数")
					return false;
				}
				this.add()
			},
			//弹窗取消按钮
			addHandleCancel () {
				this.addVisible = false
				this.id = ''
				this.form = {
					title    : '',
					type     : '1',
					optionVal: '',
					status   : '1',
					sort     : 0,
					is_define: 0,
					addFlag  : false
				}
			},
			//判断之前有没有输入过sign,并获取表格内容
			async add () {
				let optionVal = ''
				if (this.form.type == 2 || this.form.type == 3) {
					if (!this.form.optionVal2 || this.form.optionVal2.length == 0) {
						optionVal = this.form.optionVal.replace(/，/g, ',')
					} else {
						this.form.optionVal = this.form.optionVal.replace(/，/g, ',')
						optionVal = this.form.optionVal2.join(',') + ',' + this.form.optionVal
					}
					let optionVal3 = optionVal.split(',')
					for (let i = 0; i < optionVal3.length; i++) {
						if (optionVal3[i].length > 12) {
							this.$message.error('每个选项内容不超过12个字')
							return false
						}
					}
				}
				const {data: res} = await this.axios.post(
					"custom-field/set-field",
					{
						uid        : localStorage.getItem("uid"),
						id         : this.id,
						title      : this.form.title,
						type       : this.form.type,
						optionVal  : optionVal,
						sort       : this.form.sort,
						status     : this.form.status,
						chat_status: this.form.chat_status
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.addVisible = false
					this.id = ''
					this.form = {
						title    : '',
						type     : '1',
						optionVal: '',
						status   : '1',
						sort     : 0,
						is_define: 0,
					}
					this.getList()
				}
			},
			//修改全部
			editAll () {
				this.allVisible = false
				this.cacheData = this.arr.map(item => ({...item}));
				this.managentList.map(x => {
					x.flag = false
					x.addFlag = false
					if (x.type == 2 || x.type == 3) {
						x.optionVal2 = x.optionVal.split(',')
						x.optionVal = ''
					}
				})
			},
			//取消修改全部
			cancelEditAll () {
				this.allVisible = true
				this.managentList = [...this.cacheData];
				this.managentList.map(x => {
					x.flag = true
					x.addFlag = true
				})
				this.key = 0
				this.tableKey++
			},
			//修改状态
			changeStatus (checked, index) {
				const newData = [...this.managentList];
				if (checked) {
					newData[index].status = '1';
				} else {
					newData[index].status = '0';
				}
				this.managentList = newData;
			},
			changeChatStatus (checked, index) {
				const newData = [...this.managentList];
				if (checked) {
					newData[index].chat_status = '1';
				} else {
					newData[index].chat_status = '0';
				}
				this.managentList = newData;
			},
			//修改单独一条
			edit (record, index) {
				this.editingKey = index
				this.modelTitle = '编辑属性'
				this.form.title = record.title
				this.form.type = record.type
				this.form.is_define = record.is_define
				if (record.type == 2 || record.type == 3) {
					this.form.optionVal2 = record.optionVal.split(',')
				}
				this.form.status = record.status
				this.form.chat_status = record.chat_status
				this.form.sort = record.sort
				this.id = record.id
				this.addVisible = true
				this.form.addFlag = true
				this.form.key = record.key

				// this.cacheData = this.managentList.map(item => ({...item}));
				// const newData = [...this.managentList];
				// record.flag = false;
				// this.editingKey = index
				// this.managentList = newData;
				// for (let i = 0; i < this.managentList.length; i++) {
				// 	if (!this.managentList[i].flag) {
				// 		this.allVisible = false
				// 		return false
				// 	} else {
				// 		this.allVisible = true
				// 	}
				// }
			},
			//删除单独一条
			deleteOne (index) {
				this.managentList.splice(index, 1)
			},
			//删除/修改单独某一条状态
			async submitOne (record, status, type) {
				const {data: res} = await this.axios.post(
					"custom-field/set-field-status",
					{
						uid      : localStorage.getItem("uid"),
						id       : record.id,
						is_define: record.is_define,
						status   : status, //0关闭，1开启，2删除
						type     : type
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.getList()
				}
			},
			//修改字段名称
			handleChange (value, key) {
				const newData = [...this.managentList];
				const target = newData.filter(item => key === item.key)[0];
				if (target) {
					target['title'] = value;
					this.managentList = newData;
				}
			},
			//修改填写格式
			handleChange2 (value, key, column) {
				const newData = [...this.managentList];
				const target = newData.filter(item => key === item.key)[0];
				if (target) {
					target[column] = value;
					this.managentList = newData;
				}
			},
			//修改选项内容
			handleChange3 (value, key, column) {
				const newData = [...this.managentList];
				const target = newData.filter(item => key === item.key)[0];
				if (target) {
					target[column] = value;
					this.managentList = newData;
				}
			},
			//修改排序展示
			handleChange4 (value, key) {
				const newData = [...this.managentList];
				const target = newData.filter(item => key === item.key)[0];
				if (target) {
					target['sort'] = value;
					this.managentList = newData;
				}
			},
			//批量提交
			async submit () {
				// this.submitDisabled = true
				var reg = /^(?:0|[1-9][0-9]?|100)$/
				this.managentList.map(x => {
					if (x.type == 2 || x.type == 3) {
						if (!x.optionVal2 || x.optionVal2.length == 0) {
							x.optionVal = x.optionVal.replace(/，/g, ',')
						} else if (x.optionVal == '') {
							x.optionVal = x.optionVal2.join(',')
						} else {
							x.optionVal = x.optionVal2.join(',') + ',' + x.optionVal.replace(/，/g, ',')
						}
					}
				})
				let msgData = [...this.managentList]
				for (let i = 0; i < msgData.length; i++) {
					if (msgData[i].is_define == 1) {
						if (msgData[i].type == 2 || msgData[i].type == 3) {
							if (msgData[i].optionVal != '' && msgData[i].optionVal.split(',') != null && msgData[i].optionVal != null) {
								msgData[i].optionVal3 = msgData[i].optionVal.split(',')
								for (let j = 0; j < msgData[i].optionVal3.length; j++) {
									if (msgData[i].optionVal3[j].length > 12) {
										this.$message.error('每个选项内容不超过12个字')
										return false
									}
								}
							}
						}
					}
					if (!reg.test(msgData[i].sort)) {
						this.$message.warning("排序展示必须为0-100正整数")
						return false;
					}
				}
				const {data: res} = await this.axios.post(
					"custom-field/set-field-batch",
					{
						uid    : localStorage.getItem("uid"),
						msgData: msgData
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.submitDisabled = false
				} else {
					this.submitDisabled = false
					this.getList()
				}
			},
			//删除选项内容标签
			delTag (e, tag, key) {
				e.preventDefault();
				if (!this.addVisible) {
					// this.cacheData = JSON.parse(JSON.stringify(this.managentList))
					this.managentList.map(x => {
						if (x.key == key) {
							x.optionVal2.splice(x.optionVal2.indexOf(tag), 1)
						}
					})
				} else {
					if (this.form.optionVal2.indexOf(tag) != -1) {
						this.form.optionVal2.splice(this.form.optionVal2.indexOf(tag), 1)
					}
				}
				this.$forceUpdate()
			},
			//增加自定义注册项(增加一行)
			addLine () {
				const newData = [...this.managentList];
				newData.push({
					key      : this.key,
					title    : "",
					type     : "1",
					is_define: "1",
					status   : "1",
					optionVal: "",
					flag     : false,
					addFlag  : true
				})
				this.key++
				this.managentList = newData;
			},
			changeTab (val) {
				this.tabKey = val
			},
			// 删除跟进状态
			delFollow (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该状态?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.delF(id);
					}
				});
			},
			async delF (id) {
				const {data: res} = await this.axios.post(
					"custom-field/del-follow",
					{
						uid: localStorage.getItem("uid"),
						id : id
					}
				);
				if (res.error != 0) {
					this.isLoading1 = false
					this.$message.error(res.error_msg)
				} else {
					this.getFollowStatus()
				}
			},
			editFollow (id, title, desc) {
				this.followId = id
				this.title = title
				this.desc = desc
				this.addOrEditTitle = '编辑状态'
				this.followVisible = true
			},
			// 添加状态
			addFollow () {
				this.followId = ''
				this.title = ''
				this.desc = ''
				this.addOrEditTitle = '新建状态'
				this.followVisible = true
			},
			async handleFollow () {
				this.isLoading2 = true
				if (this.title == '') {
					this.isLoading2 = false
					this.$message.destroy()
					this.$message.warning('请填写状态名称')
					return false
				}
				const {data: res} = await this.axios.post(
					"custom-field/add-follow",
					{
						uid     : localStorage.getItem("uid"),
						id      : this.followId,
						title   : this.title,
						describe: this.desc
					}
				);
				if (res.error != 0) {
					this.isLoading2 = false
					this.$message.error(res.error_msg)
				} else {
					this.followVisible = false
					this.isLoading2 = false
					this.getFollowStatus()
				}
			},
			handleCancelFollow () {
				this.followId = ''
				this.title = ''
				this.desc = ''
				this.addOrEditTitle = '新建状态'
				this.followVisible = false
			},
			async getFollowStatus () {
				this.isLoading1 = true
				const {data: res} = await this.axios.post(
					"custom-field/follow",
					{
						uid   : localStorage.getItem("uid"),
						status: 1
					}
				);
				if (res.error != 0) {
					this.isLoading1 = false
					this.$message.error(res.error_msg)
				} else {
					this.follows = res.data.follow
					let that = this
					this.$nextTick(function () {
						let trs = document.getElementsByClassName('follow-table')[0].getElementsByTagName('tr')
						for (let i = 1; i < trs.length; i++) {
							trs[i].setAttribute('draggable', true)
							trs[i].setAttribute('data-id', that.follows[i - 1].id)
							trs[i].addEventListener('dragstart', that.dragStart)
							trs[i].addEventListener('drop', that.drop)
							trs[i].addEventListener('dragover', that.dragOver)
						}
					})
					this.isLoading1 = false
				}
			},
			dragOver (ev) {
				ev.preventDefault();
			},
			dragStart (e) {
				this.startId = e.currentTarget.attributes['data-id'].value
			},
			drop (e) {
				this.endId = e.currentTarget.attributes['data-id'].value
				let startIndex = this.follows.findIndex(x => x.id == this.startId)
				let endIndex = this.follows.findIndex(x => x.id == this.endId)
				if (endIndex < startIndex) {
					let startFollow = JSON.parse(JSON.stringify(this.follows[startIndex]))
					for (let i = startIndex; i > endIndex; i--) {
						this.follows[i] = JSON.parse(JSON.stringify(this.follows[i - 1]))
					}
					this.follows[endIndex] = JSON.parse(JSON.stringify(startFollow))
				} else {
					let startFollow = JSON.parse(JSON.stringify(this.follows[startIndex]))
					for (let i = startIndex; i < endIndex; i++) {
						this.follows[i] = JSON.parse(JSON.stringify(this.follows[i + 1]))
					}
					this.follows[endIndex] = JSON.parse(JSON.stringify(startFollow))
				}
				// this.follows = JSON.parse(JSON.stringify(this.follows))
				let ids = []
				for (let follow of this.follows) {
					ids.push(follow.id)
				}
				this.followSort(ids)
			},
			async followSort (ids) {
				const {data: res} = await this.axios.post(
					"custom-field/follow-sort",
					{
						uid: localStorage.getItem("uid"),
						ids: ids
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					let trs = document.getElementsByClassName('follow-table')[0].getElementsByTagName('tr')
					for (let i = 1; i < trs.length; i++) {
						trs[i].removeEventListener('dragstart', this.dragStart)
						trs[i].removeEventListener('drop', this.drop)
						trs[i].removeEventListener('dragover', this.dragOver)
					}
					this.getFollowStatus()
				}
			}
		},

		created () {
			if (this.$route.path == '/corpCustomerAttribute/management') {
				//企业微信客户管理下
				this.hasHignAttribute = 'hignAttribute'
				this.hasFollowStatus = 'followStatus'
				this.hasAddName = 'customerAttribute-add'
				this.hasEditName = 'customerAttribute-edit'
				this.hasListName = 'customerAttribute-list'
				this.hasDeleteName = 'customerAttribute-del'
				if (localStorage.getItem('isMasterAccount') == 2) {
					let permissionButton = localStorage.getItem('permissionButton').split(',')
					let that = this
					if (permissionButton.indexOf('hignAttribute') != -1) {
						that.tabKey = '1'
					} else {
						that.tabKey = '2'
					}
					that.$forceUpdate()
				} else {
					this.tabKey = '1'
				}
			} else if (this.$route.path == '/fansCustomerAttribute/management') {
				//公众号粉丝管理下
				this.hasHignAttribute = 'hignAttributeFans'
				this.hasFollowStatus = 'followStatusFans'
				this.hasAddName = 'customerFansAttribute-add'
				this.hasEditName = 'customerFansAttribute-edit'
				this.hasListName = 'customerFansAttribute-list'
				this.hasDeleteName = 'customerFansAttribute-del'
				if (localStorage.getItem('isMasterAccount') == 2) {
					let permissionButton = localStorage.getItem('permissionButton').split(',')
					let that = this
					if (permissionButton.indexOf('hignAttributeFans') != -1) {
						that.tabKey = '1'
					} else {
						that.tabKey = '2'
					}
					that.$forceUpdate()
				} else {
					this.tabKey = '1'
				}
			}

			this.getList()
			this.getFollowStatus()
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

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

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		text-align: left;
		margin: 0 0 20px;
	}

	.optionVal-text {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 200px;
		display: inline-block;
	}

	.status-index {
		display: inline-block;
		width: 40px;
		height: 40px;
		line-height: 38px;
		border-radius: 20px;
		border: 1px solid #01b065;
		font-size: 16px;
		color: #01b065
	}

	.name-input {
		width: 60%;
		margin-left: 40px;
		margin-top: -11px;
	}

	.add-btn {
		width: 60%;
		margin-left: 100px;
		text-align: center;
	}

	.save-btn {
		margin: 0 auto;
		text-align: center;
		margin-top: 40px;
	}

	.delete-btn {
		margin-left: 20px;
		margin-top: -11px;
	}

	.tabBtn {
		margin: 0;
		margin-right: 2px;
		padding: 10px 16px;
		line-height: 38px;
		background: #FAFAFA;
		border: 1px solid #E8E8E8;
		border-bottom: 0;
		border-radius: 4px 4px 0 0;
		cursor: pointer;
	}

	.activeBtn {
		color: #01b065;
		background: #FFF;
	}

	.arrow-left {
		vertical-align: middle;
		display: inline-block;
		width: 0;
		height: 0;
		border: 5px solid;
		border-color: transparent #01b065 transparent transparent;
	}

	.arrow-right {
		vertical-align: middle;
		display: inline-block;
		width: 0;
		height: 0;
		border: 5px solid;
		border-color: transparent transparent transparent #01b065;
	}

	.line {
		display: inline-block;
		height: 0;
		width: calc(100% - 10px);
		border-top: 2px solid #01b065;
		vertical-align: middle;
	}

	.line-right {
		height: 20px;
		width: 0;
		border-right: 2px solid #01b065;
		margin-right: 4.17%;
		float: right;
	}

	.line-left {
		height: 20px;
		width: 0;
		border-right: 2px solid #01b065;
		margin-left: 4.17%;
		float: left;
	}

	.arrow-bottom {
		display: inline-block;
		color: #C3C3C3;
		-moz-transform: rotate(90deg);
		-webkit-transform: rotate(90deg);
		-o-transform: rotate(90deg);
		transform: rotate(90deg);
		width: 0;
		height: 0;
		border: 5px solid;
		border-color: transparent transparent transparent #01b065;
	}

	.arrow-bottom-right {
		line-height: 10px;
		float: right;
		margin-right: calc(4.17% - 4px);
	}

	.arrow-bottom-left {
		line-height: 9px;
		float: left;
		margin-left: calc(4.17% - 4px);
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 20px 20px;
		min-width: 885px;
		padding-right: 40px;
		background-color: #ffffff;
		margin-top: 16px;
		padding: 16px;
	}
</style>