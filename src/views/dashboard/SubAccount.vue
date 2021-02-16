<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;" class="scroll">
		<div id="components-layout-demo-basic"> 
			<a-layout-content>
				<div style="font-size:16px;font-weight:700;color:#333333">子账户列表</div>
				<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
					<p style="margin-bottom: 2px;color: #FF562D;">
						1、针对已绑定在本系统的企业微信，可前往通讯录管理-企业成员-同步企业微信通讯录，同步后的企业成员名单在子账户未启用列表展示，再对其进行相关操作。与此同时，日后每新增一个企业成员，则自动进入到子账户未启用列表。</p>
					<p style="margin-bottom: 2px;">
						2、当某手机号存在子账户未启用列表中，若依然使用该手机号手动添加子账户，添加后，自动将该未启用的子账户去除。</p>
					<p style="margin-bottom: 2px;">
						3、当某手机号存在多个企业微信，若同步多个企业微信的通讯录，未启用的子账户列表以手机号作为唯一性去重展示。</p>
					<p style="margin-bottom: 2px;">
						4、若在尚未“同步企业微信通讯录”的名单时，手动添加子账户（进入子账户启用列表），再去“同步”，此时只要两边手机号为一致，则该子账户的原有状态不变。</p>
				</div>
				<a-col style="position: absolute;right: 56px;z-index: 999;">
					<a-button
							type="primary"
							
							style="width: 150px;font-size:14px;"
							@click="addSubAccount" v-has="'subAccount-add'"
					>添加子账户
					</a-button>
				</a-col>
				<a-tabs @change="changeStatus" type="card">
					<a-tab-pane tab="启用" key="1">
						<a-col style="border: 1px solid #E2E2E2;background: #FFF;padding: 10px;margin: 0 20px;border-bottom: 0;">
							<a-input placeholder="请输入手机号或名称" @keyup.enter="find" style="width: 170px;margin-left: 5px;"
											v-model="inputValue"
											autoComplete="off"/>
							<a-button type="primary" style="margin-left: 10px;" @click="find">查询</a-button>
							<a-button style="margin-left: 10px;" @click="clear">重置</a-button>
						</a-col>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading">
								<div class="spin-content">
									<a-table
											:columns="columns"
											:dataSource="subAccountList"
											:pagination="false"
											:rowClassName="rowClassName" v-has="'subAccount-list'"
									>
										<template slot="name" slot-scope="text, record, index">
											{{record.name}}
											<a-icon slot="prefix" type="man" style="margin-left: 10px;color: #427EBA;"
															v-if="record.sex==1"/>
											<a-icon
													slot="prefix"
													type="woman"
													style="margin-left: 10px;color: #ED4997;"
													v-if="record.sex==2"
											/>
										</template>
										<template slot="department" slot-scope="text, record, index">
											<span v-if="text == ''">--</span>
											<span v-if="text != ''">{{text}}</span>
										</template>
										<template slot="position" slot-scope="text, record, index">
											<span v-if="text == ''">--</span>
											<span v-if="text != ''">{{text}}</span>
										</template>
										<template slot="status" slot-scope="text, record, index">
											<span v-if="record.type == 0 && text == 0">未启用</span>
											<span v-if="record.type == 0 && text == 1">正常</span>
											<span v-if="record.type == 0 && text == 2">禁用</span>
											<span v-if="record.type == 1 && text == 1">正常（永远正常）</span>
										</template>
										<template slot="action" slot-scope="text, record, index">
											<a-button style="margin-left:5px;" @click="detail(record)"
																v-has="'subAccount-info'">详情
											</a-button>
											<a-button style="margin-left:5px;" @click="editSubAccount(record)"
																v-has="'subAccount-modify'"
																v-if="isMasterAccount == 1 || isMasterAccount == 2 && record.type == 0">
												修改
											</a-button>
											<a-button style="margin-left:5px;"
																v-if="masterAccountId != record.id && record.id != sub_id && record.status == 1"
																@click="showWarnVisible(record)" v-has="'subAccount-status'">禁用
											</a-button>
											<a-button style="margin-left:5px;"
																v-if="masterAccountId != record.id && record.id != sub_id && record.status == 2"
																@click="showStartVisible(record)" v-has="'subAccount-status'">启用
											</a-button>
											<a-button style="margin-left:5px;" @click="editPassword(record.id)"
																v-has="'subAccount-modify-pass'"
																v-if="record.password != '' && isMasterAccount == 1 || isMasterAccount == 2 && record.type == 0 && record.password != ''">
												重置密码
											</a-button>
										</template>
									</a-table>

									<!-- 分页 -->
									<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total > 0"
											v-has="'subAccount-list'">
										<span style="float:left;margin-left: 20px;">共{{total}}条</span>
										<a-pagination
												:total="total"
												showSizeChanger
												:showQuickJumper="quickJumper"
												:current="page"
												:pageSize="page_size"
												:pageSizeOptions="['1','2','15','30','50','100']"
												@change="changePage"
												@showSizeChange="showSizeChange"
												style="float: right;margin-right: 20px;"
										/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-tab-pane>
					<a-tab-pane tab="未启用" key="2">
						<a-col style="border: 1px solid #E2E2E2;background: #FFF;padding: 10px;margin: 0 20px;border-bottom: 0;">
							<a-input placeholder="请输入手机号或名称" @keyup.enter="find" style="width: 170px;margin-left: 5px;"
											v-model="inputValue2"
											autoComplete="off"/>
							<a-button type="primary" style="margin-left: 10px;" @click="find">查询</a-button>
							<a-button style="margin-left: 10px;" @click="clear">重置</a-button>
						</a-col>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="加载中..." size="large" :spinning="isLoading2">
								<div class="spin-content">
									<a-table
											:columns="columns"
											:dataSource="subAccountList2"
											:pagination="false"
											:rowClassName="rowClassName" v-has="'subAccount-list'"
									>
										<template slot="name" slot-scope="text, record, index">
											{{record.name}}
											<a-icon slot="prefix" type="man" style="margin-left: 10px;color: #427EBA;"
															v-if="record.sex==1"/>
											<a-icon
													slot="prefix"
													type="woman"
													style="margin-left: 10px;color: #ED4997;"
													v-if="record.sex==2"
											/>
										</template>
										<template slot="department" slot-scope="text, record, index">
											<span v-if="text == ''">--</span>
											<span v-if="text != ''">{{text}}</span>
										</template>
										<template slot="position" slot-scope="text, record, index">
											<span v-if="text == ''">--</span>
											<span v-if="text != ''">{{text}}</span>
										</template>
										<template slot="status" slot-scope="text, record, index">
											<span v-if="text == 0">未启用</span>
											<span v-if="text == 1">正常</span>
											<span v-if="text == 2">禁用</span>
										</template>
										<template slot="action" slot-scope="text, record, index">
											<a-button style="margin-left:5px;" @click="detail(record)"
																v-has="'subAccount-info'">详情
											</a-button>
											<a-button style="margin-left:5px;" @click="editSubAccount(record)"
																v-has="'subAccount-modify'">修改
											</a-button>
											<a-button style="margin-left:5px;"
																v-if="masterAccountId != record.id && record.id != sub_id && record.status == 0"
																@click="editSubAccount(record)" v-has="'subAccount-status'">启用
											</a-button>
										</template>
									</a-table>

									<!-- 分页 -->
									<div class="pagination" style="margin: 20px auto;height: 32px;" v-show="total2 > 0"
											v-has="'subAccount-list'">
										<span style="float:left;margin-left: 20px;">共{{total2}}条</span>
										<a-pagination
												:total="total2"
												showSizeChanger
												:showQuickJumper="quickJumper2"
												:current="page2"
												:pageSize="page_size2"
												:pageSizeOptions="['1','2','15','30','50','100']"
												@change="changePage"
												@showSizeChange="showSizeChange"
												style="float: right;margin-right: 20px;"
										/>
									</div>
								</div>
							</a-spin>
						</div>
					</a-tab-pane>
				</a-tabs>
			</a-layout-content>

			<!--修改密码弹窗-->
			<a-modal
					:title="passwordTitle"
					:visible="editPasswordVisible"
					@ok="editPasswordOk"
					:confirmLoading="editPasswordLoading"
					@cancel="editPasswordCancel"
			>
				<a-input-password placeholder="请输入密码" v-model="password" autoComplete="new-password"
				                  v-if="passwordInputVisible"/>
				<a-input placeholder="请输入验证码" style="width: 60%;" autoComplete="off" v-if="!passwordInputVisible"
				         :maxLength="6" v-model="passwordCode"/>
				<a-button type="link" style="margin-left: 20px;" @click="sendCode" :disabled="sendDisabled"
				          v-if="!passwordInputVisible">{{this.btnTitle}}
				</a-button>
			</a-modal>

			<!--添加/修改子账户/详情弹窗-->
			<a-drawer
					:title="addSubAccountTitle"
					placement="right"
					:closable="false"
					@close="detailClose"
					:visible="detailVisible"
					width="700px!important"
			>
				<a-spin tip="加载中..." size="large" :spinning="isDrawLoading" class="draw-loading">
					<a-tabs v-model="activeKey" @change="changeTab2">
						<a-tab-pane tab="基本信息" key="1">
							<!--详情-->
							<template v-if="isFlag == 2">
								<a-form>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="账户ID">
										<div style="display: inline-block;width: 70%;">
											{{actionId}}
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="员工姓名">
										<div style="display: inline-block;width: 70%;">
											{{staffName}}
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="手机号码">
										<div style="display: inline-block;width: 70%;">
											{{phoneNumber}}（登录账号）
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="性别">
										<div style="display: inline-block;width: 70%;">
											<span v-if="sex == 1">男</span>
											<span v-if="sex == 2">女</span>
											<span v-if="sex == 0">未知</span>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="部门">
										<div style="display: inline-block;width: 70%;">
											<template v-if="department == ''">--</template>
											<template v-if="department != ''">{{department}}</template>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="职务">
										<div style="display: inline-block;width: 70%;">
											<template v-if="post == ''">--</template>
											<template v-if="post != ''">{{post}}</template>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="员工状态">
										<div style="display: inline-block;width: 70%;">
											<span v-if="addStatus == 0">未启用</span>
											<span v-if="addStatus == 1">正常</span>
											<span v-if="addStatus == 2">禁用</span>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="添加时间">
										<div style="display: inline-block;width: 70%;">
											{{detailAddTime}}
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="企业名称"
									             v-if="businessName != ''">
										<div style="display: inline-block;width: 70%;">
											{{businessName}}
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="企业logo"
									             v-if="businessName != ''">
										<div style="display: inline-block;width: 70%;">
											<img :src="commonUrl + imageUrl" alt="" style="width: 83px;">
										</div>
									</a-form-item>
								</a-form>
								<div class="bottom">
									<a-button :style="{marginRight: '8px'}" @click="detailOk" type="primary"
									          v-has="'subAccount-modify'"
									          v-if="isMasterAccount == 1 || isMasterAccount == 2 && record.type == 0">
										修改
									</a-button>
									<a-button @click="detailClose" v-if="record.type == 1">取消</a-button>
									<a-button @click="showWarnVisible(record)" v-if="addStatus == 1 && record.type == 0"
									          v-has="'subAccount-status'">禁用
									</a-button>
									<a-button @click="showStartVisible(record)"
									          v-if="addStatus == 0 && record.type == 0 || addStatus == 2 && record.type == 0"
									          v-has="'subAccount-status'">启用
									</a-button>
								</div>
							</template>
							<!--修改、添加-->
							<template v-if="isFlag == 1">
								<a-form>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<span slot="label">
												<span style="color: red;">*</span>
												<span>员工姓名</span>
											</span>
										<div style="display: inline-block;width: 70%;">
											<a-input v-model="staffName"
											         placeholder="请输入员工姓名" :maxLength="30"/>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<span slot="label">
												<span style="color: red;">*</span>
												<span>手机号码</span>
											</span>
										<div style="display: inline-block;width: 70%;">
											<span v-if="editFlag || enterpriseName == 0">{{phoneNumber}}</span>
											<a-input
													:value="phoneNumber"
													@change="phoneChange"
													placeholder="请输入手机号码"
													:maxLength="11"
													v-if="!editFlag"
											/>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<span slot="label">
												<span style="color: red;">*</span>
												<span>性别</span>
											</span>
										<div style="display: inline-block;width: 70%;">
											<a-radio-group v-model="sex">
												<a-radio :value="1">男</a-radio>
												<a-radio :value="2">女</a-radio>
											</a-radio-group>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="部门">
										<div style="display: inline-block;width: 70%;">
											<a-input v-model="department"
											         placeholder="请输入部门名称" :maxLength="30"/>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="职务">
										<div style="display: inline-block;width: 70%;">
											<a-input v-model="post"
											         placeholder="请输入部门职务名称，例如：销售顾问"
											         :maxLength="20" autoComplete="off" :disabled="statusDisabled"/>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
									             v-if="enterpriseName != 0" v-has="'subAccount-status'">
										<span slot="label">
												<span style="color: red;">*</span>
												<span>状态</span>
											</span>
										<div style="display: inline-block;width: 70%;">
											<a-radio-group v-model="addStatus" :disabled="statusDisabled"
											               @change="clearPassword">
												<a-radio :value="1">正常</a-radio>
												<a-radio :value="2">禁用</a-radio>
												<a-radio :value="0" v-show="addStatus2 == 0">未启用</a-radio>
											</a-radio-group>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
									             v-if="enterpriseName != 0 && passwordFlag && addStatus == 1">
										<span slot="label">
												<span style="color: red;"
												      v-show="addStatus == 0 || addStatus == 1">*</span>
												<span>登录密码</span>
											</span>
										<div style="display: inline-block;width: 70%;">
											<a-input-password placeholder="请填写6-20位密码" v-model="addPassword"
											                  autoComplete="new-password" :maxLength="20"/>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
									             v-if="enterpriseName == 0 || businessName != ''">
										<span slot="label">
												<span style="color: red;">*</span>
												<span>企业名称</span>
											</span>
										<div style="display: inline-block;width: 70%;">
											<a-input v-model="businessName"
											         placeholder="请输入企业名称" :maxLength="30"/>
										</div>
									</a-form-item>
									<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="企业logo"
									             v-if="enterpriseName == 0 || businessName != ''">
										<div style="display: inline-block;width: 100%;">
											<a-upload
													name="avatar"
													listType="picture-card"
													class="avatar-uploader"
													:showUploadList="false"
													action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
													:beforeUpload="beforeUpload"
													:customRequest="selfUpload"
													@change="changeLogo"
											>
												<img v-if="imageUrl" :src="commonUrl + imageUrl" alt="上传中..."
												     style="max-width:100%;max-height:100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);"/>
												<div v-else style="padding-top: 25px;">
													<a-icon type="plus"/>
													<div class="ant-upload-text">点击上传</div>
												</div>
											</a-upload>
											<span style="color: #AAA;font-size: 12px;display: inline-block;vertical-align: bottom;">（图片大小：200*200。若不填写，则系统提供默认logo。）</span>
										</div>
									</a-form-item>
								</a-form>
								<div class="bottom">
									<a-button :style="{marginRight: '8px'}" @click="addSubAccountOk" type="primary"
									          v-if="enterpriseName == 0">
										确定
									</a-button>
									<a-button :style="{marginRight: '8px'}" @click="addSubAccountOk" type="primary"
									          v-else>
										确定
									</a-button>
									<a-button @click="detailCancel" v-if="enterType == 1">取消</a-button>
									<a-button @click="detailClose" v-if="enterType == 2">取消</a-button>
								</div>
							</template>
						</a-tab-pane>
						<a-tab-pane tab="权限设置" key="2" v-if="tabVisible">
							<div style="width: 46%;height: 100%;border-right: 1px solid #E9E9E9;float:left;">
								<a-tabs v-model="tabType" @change="changeTab">
									<a-tab-pane tab="公众号" key="1">
										<a-tabs v-model="tabType2" @change="changeWxMini" v-if="miniInfo.length > 0">
											<a-tab-pane tab="公众号" key="1" v-if="wxInfo.length > 0">
												<div class="sider-one">
													<div class="sider-one-txt">选择公众号</div>
													<!--												<a-select showSearch optionFilterProp="children"-->
													<!--												          style="width: 200px;margin-bottom: 20px;"-->
													<!--												          @change="handleChange" v-model="changeBackground"-->
													<!--												          v-if="wxInfo[0]">-->
													<!--													<template v-for="item in wxInfo">-->
													<!--														<a-select-option :value="item.id">{{item.nick_name}}-->
													<!--														</a-select-option>-->
													<!--													</template>-->
													<!--												</a-select>-->
													<div class="wx-info" ref="wxInfo">
														<template v-for="(item,index) in wxInfo">
															<div @click="selectWx(item.id)" class="selectWx"
															     :class="{ active:changeBackground == item.id}">
																<a-avatar :src="item.head_img" shape="square"/>
																{{item.nick_name}}
															</div>
														</template>
													</div>
												</div>
											</a-tab-pane>
											<a-tab-pane tab="小程序" key="2" v-if="miniInfo.length > 0">
												<div class="sider-one">
													<div class="sider-one-txt">选择小程序</div>
													<div class="wx-info" ref="miniInfo">
														<template v-for="(item,index) in miniInfo">
															<div @click="selectWx4(item.id)" class="selectWx"
															     :class="{ active:changeBackground4 == item.id}">
																<a-avatar :src="item.head_img" shape="square"/>
																{{item.nick_name}}
															</div>
														</template>
													</div>
												</div>
											</a-tab-pane>
										</a-tabs>
										<div class="sider-one" v-if="miniInfo.length == 0 && wxInfo.length > 0">
											<div class="sider-one-txt">选择公众号</div>
											<!--												<a-select showSearch optionFilterProp="children"-->
											<!--												          style="width: 200px;margin-bottom: 20px;"-->
											<!--												          @change="handleChange" v-model="changeBackground"-->
											<!--												          v-if="wxInfo[0]">-->
											<!--													<template v-for="item in wxInfo">-->
											<!--														<a-select-option :value="item.id">{{item.nick_name}}-->
											<!--														</a-select-option>-->
											<!--													</template>-->
											<!--												</a-select>-->
											<div class="wx-info" ref="wxInfo">
												<template v-for="(item,index) in wxInfo">
													<div @click="selectWx(item.id)" class="selectWx"
													     :class="{ active:changeBackground == item.id}">
														<a-avatar :src="item.head_img" shape="square"/>
														{{item.nick_name}}
													</div>
												</template>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="企业微信" key="2" v-if="wxInfo2.length > 0">
										<div class="sider-one">
											<div class="sider-one-txt">选择企业微信</div>
											<!--										<a-select showSearch optionFilterProp="children"-->
											<!--										          style="width: 200px;margin-bottom: 20px;"-->
											<!--										          @change="handleChange2" v-model="changeBackground2" v-if="wxInfo2[0]">-->
											<!--											<template v-for="item in wxInfo2">-->
											<!--												<a-select-option :value="item.id">{{item.corp_name}}</a-select-option>-->
											<!--											</template>-->
											<!--										</a-select>-->
											<div class="wx-info" ref="wxInfo2">
												<template v-for="(item,index) in wxInfo2">
													<div @click="selectWx2(item.id)" class="selectWx"
													     :class="{ active:changeBackground2 == item.id}">
														<img src="../../assets/WeChatLogo.png" alt=""
														     style="width: 32px;">
														{{item.corp_name}}
													</div>
												</template>
											</div>
										</div>
									</a-tab-pane>
									<a-tab-pane tab="公共模块" key="3">
										<div class="sider-one">
											<div class="sider-one-txt">选择公共模块</div>
											<div class="wx-info" ref="wxInfo">
												<div class="selectWx active">
													公共模块
												</div>
											</div>
										</div>
									</a-tab-pane>
								</a-tabs>
							</div>
							<!--详情-->
							<div style="width: 54%;height: 100%;float:right;overflow-y: auto;" v-if="isFlag == 2">
								<a-tree
										:treeData="accountTreeList2.wx"
										v-if="tabType == 1 && tabType2 == 1"
								/>
								<a-tree
										:treeData="accountTreeList2.mini"
										v-if="tabType == 1 && tabType2 == 2"
								/>
								<a-tree
										:treeData="wechatTreeList2"
										v-if="tabType == 2"
								/>
								<a-tree
										:treeData="commonTreeList2"
										v-if="tabType == 3"
								/>
								<a-empty v-if="isEmpty">
									<span slot="description">暂无权限</span>
								</a-empty>
							</div>
							<!--修改、添加-->
							<div style="width: 54%;height: 100%;float:right;overflow-y: auto;" v-if="isFlag == 1">
								<a-tree
										checkable
										:checkedKeys="checkedKeys1"
										:treeData="accountTreeList.wx"
										@check="onCheck1"
										v-if="tabType == 1 && tabType2 == 1"
								/>
								<a-tree
										checkable
										:checkedKeys="checkedKeys4"
										:treeData="accountTreeList.mini"
										@check="onCheck4"
										v-if="tabType == 1 && tabType2 == 2"
								/>
								<a-tree
										checkable
										:checkedKeys="checkedKeys2"
										:treeData="wechatTreeList"
										@check="onCheck2"
										v-if="tabType == 2"
								/>
								<a-tree
										checkable
										:checkedKeys="checkedKeys3"
										:treeData="commonTreeList"
										@check="onCheck3"
										v-if="tabType == 3"
								/>
								<a-empty v-if="isEmpty2">
									<span slot="description">暂无权限</span>
								</a-empty>
							</div>
							<div class="bottom">
								<a-button :style="{marginRight: '8px'}" @click="limitsOk" type="primary"
								          v-if="isFlag == 1">
									确定
								</a-button>
								<a-button :style="{marginRight: '8px'}" @click="detailOk" type="primary"
								          v-if="isFlag == 2"
								          v-has="'subAccount-modify'">
									修改
								</a-button>
								<a-button @click="detailCancel" v-if="enterType == 1">取消</a-button>
								<a-button @click="detailClose" v-if="enterType == 2">取消</a-button>
							</div>
						</a-tab-pane>
						<a-tab-pane tab="数据可见范围" key="3" v-if="tabVisible">
							<div style="overflow: hidden;">
								<div style="width: 46%;height: calc(100% - 100px);border-right: 1px solid #E9E9E9;float:left;position: absolute;">
									<div class="sider-one">
										<div class="sider-one-txt">选择企业微信</div>
										<div>
											<template v-for="(item,index) in wxInfo2">
												<div @click="selectWx5(item.corpid,index)" class="selectWx"
												     :class="{ active:dataCorpId == item.corpid}">
													<img src="../../assets/WeChatLogo.png" alt=""
													     style="width: 32px;">
													{{item.corp_name}}
												</div>
											</template>
										</div>
									</div>
								</div>
								<!--详情-->
								<div style="width: 54%;height: 100%;float:right;overflow-y: auto;    padding: 20px;"
								     v-if="isFlag == 2">
									<template v-for="(data,dataIndex) in treeList[3]">
										<template v-if="chooseIndex == dataIndex">
											<div v-if="data.type.indexOf(1) > -1" style="margin-bottom: 10px;">全员</div>
											<div v-if="data.type.indexOf(4) > -1 || data.type.indexOf(3) > -1" style="margin-bottom: 10px;">部分员工
												<div>
													<template v-for="user in data.checkedList">
														<a-tag v-if="user.scopedSlots.title !='title'" color="orange"
														       style="margin-top: 5px;">{{user.title}}
														</a-tag>
													</template>
													<template v-for="user in data.checkedList">
														<a-tag v-if="user.scopedSlots.title=='title'" color="blue"
														       style="margin-top: 5px;">{{user.title}}
														</a-tag>
													</template>
												</div>
											</div>
											<div>自己</div>
										</template>
									</template>
								</div>
								<!--修改、添加-->
								<div style="width: 54%;height: 100%;float:right;overflow-y: auto;    padding: 20px;"
								     v-if="isFlag == 1">
									<template v-for="(data,dataIndex) in list[3].list">
										<template v-if="chooseIndex == dataIndex">
											<a-checkbox-group :value="list[3].list[dataIndex].type" :key="dataIndex">
												<a-checkbox :value="1"
												            style="display: block;margin: 5px 0px;height: 33px; line-height: 33px;"
												            @click="chooseType(1,dataIndex)">
													全员
												</a-checkbox>
												<div>
													<a-checkbox :value="4"
													            style="margin: 5px 0px;height: 33px; line-height: 33px;"
													            :disabled="list[3].list[dataIndex].type.indexOf(1) > -1"
													            @click="chooseType(4,dataIndex)">
														部分员工
														<a-button style="margin-left: 10px;"
														          v-if="list[3].list[dataIndex].type.indexOf(4) > -1 || list[3].list[dataIndex].type.indexOf(3) > -1"
														          @click="showDepartmentList(dataIndex)">
															选择
														</a-button>
														<span style="margin-left: 5px"
														      v-show="list[3].list[dataIndex].user_key.length + list[3].list[dataIndex].department_id.length > 0">已选择{{list[3].list[dataIndex].user_key.length}}名员工、{{list[3].list[dataIndex].department_id.length}}部门</span>
													</a-checkbox>
												</div>
											</a-checkbox-group>
											<a-checkbox :checked="true" :disabled="true"
											            style="display: block;margin: 5px 0px;height: 33px; line-height: 33px;"
											>
												自己
											</a-checkbox>
										</template>
									</template>
								</div>
							</div>
							<div class="bottom">
								<a-button :style="{marginRight: '8px'}" @click="addSubAccountOk" type="primary"
								          v-if="isFlag == 1">
									确定
								</a-button>
								<a-button :style="{marginRight: '8px'}" @click="detailOk" type="primary"
								          v-if="isFlag == 2" v-has="'subAccount-modify'">
									修改
								</a-button>
								<a-button @click="detailCancel" v-if="enterType == 1">取消</a-button>
								<a-button @click="detailClose" v-if="enterType == 2">取消</a-button>
							</div>
						</a-tab-pane>
					</a-tabs>
				</a-spin>
			</a-drawer>
		</div>
		<!--部门选择框-->
		<chooseDepartment ref="user" :show="showModalDepartment"
		                  :chooseNum="chooseNum"
		                  :callback="modalVisibleChange"></chooseDepartment>
	</div>
</template>

<script>
	import chooseDepartment from "@/components/ChooseDepartment.vue"

	import axios from "axios";

	const columns = [
		{
			title    : "序号",
			dataIndex: "key",
			key      : "key",
		},
		{
			title      : "企业成员",
			dataIndex  : "name",
			key        : "name",
			width      : '180px',
			scopedSlots: {customRender: "name"}
		},
		{
			title      : "所属部门",
			dataIndex  : "department",
			key        : "department",
			width      : '180px',
			scopedSlots: {customRender: "department"}
		},
		{
			title      : "职务",
			dataIndex  : "position",
			key        : "position",
			width      : '180px',
			scopedSlots: {customRender: "position"}
		},
		{
			title    : "手机号（登录账号）",
			dataIndex: "account",
			key      : "account"
		},
		{
			title      : "状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: "status"}
		},
		{
			title    : "添加时间",
			dataIndex: "create_time",
			key      : "create_time"
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : "30%",
			scopedSlots: {customRender: "action"}
		}
	];

	export default {
		components: {chooseDepartment},
		data () {
			let codeFlag = JSON.parse(localStorage.getItem('twoHourCode')) ? JSON.parse(localStorage.getItem('twoHourCode')) : false
			let codeTime = Number(localStorage.getItem('codeTime')) ? Number(localStorage.getItem('codeTime')) : Date.parse(new Date()) / 1000
			return {
				isMasterAccount     : 1,//登录账户，1主账户，2子账户
				sub_id              : '',//登录账户的id
				isLoading           : false, //启用Loading 组件显示与隐藏
				isLoading2          : false, //未启用Loading 组件显示与隐藏
				isDrawLoading       : false,//抽屉加载的显示与隐藏
				commonUrl           : this.$store.state.commonUrl,//公共的链接
				//表格部分
				columns,
				masterAccountId     : '',//当前登录账户的主账户id
				page                : 1, //页码
				page_size           : 15, //每页数据量，默认15
				//分页
				total               : 0, //总条数
				quickJumper         : false, // 是否显示快速跳转的控件
				//未启用
				page2               : 1, //页码
				page_size2          : 15, //每页数据量，默认15
				//分页
				total2              : 0, //总条数
				quickJumper2        : false, // 是否显示快速跳转的控件
				subAccountList      : [], //启用表格信息
				subAccountList2     : [], //未启用表格信息
				inputValue          : '',//启用搜索输入框的值
				inputValue2         : '',//未启用搜索输入框的值
				status              : 1,//1启用 2 未启用
				actionId            : '',//被选择进行操作的账户id
				//修改密码弹窗
				passwordTitle       : '重置密码',//修改密码弹窗的标题
				editPasswordVisible : false,//修改密码弹窗的显示与隐藏
				editPasswordLoading : false,//修改密码弹窗的Loading
				password            : '',//修改时填写的密码
				btnTitle            : "获取验证码",
				passwordCode        : "", //短信验证码
				sendDisabled        : false,//获取验证码按钮的置灰
				passwordInputVisible: false,//修改时输入密码框的显示与隐藏
				codeTime            : codeTime,//获取时间的时间戳
				codeFlag            : codeFlag,//记录2小时内有没有验证过验证码
				timer               : null,//计时器的名称

				isFlag             : 1,//1添加/修改，2详情展示
				//修改、添加、员工详情弹窗
				enterpriseName     : '',//主账户有无完善企业名称，0没有，1有
				staffName          : '',//员工姓名
				phoneNumber        : '',//手机号码
				sex                : 1,//性别
				department         : '',//部门
				post               : '',//职务
				addStatus          : 1,//状态
				addStatus2         : 1,//未启用状态的显示状态
				addPassword        : '',//密码
				businessName       : '',//企业名称
				imageUrl           : "",//企业logo
				local_path         : '',//企业logo，接口返回的图片链接
				fileInfo           : {}, //上传图片的文件信息
				editFlag           : false,//true为修改，false为添加
				enterType          : 1,//1修改进入，2详情、新增进入
				passwordFlag       : false,//修改状态下密码框，true为出现，false为不出现
				addSubAccountTitle : '添加子账户',//弹窗的标题
				detailVisible      : false,//员工详情弹窗的显示与隐藏
				detailAddTime      : '',//添加时间
				record             : {},//详情时选择操作的那一行的数据
				statusDisabled     : false,//状态的不可更改操作
				//单独点击禁用、启用按钮的判断
				aloneChangeStatus  : false,
				aloneStatus        : '',//单独点击禁用、启用按钮的状态
				warnVisible        : false,//禁用确认框的显示与隐藏
				startVisible       : false,//启用确认框的显示与隐藏
				//权限设置
				tabType            : '1',//1公众号，2企业微信,3公共模块
				tabType2           : '1',//1公众号，2小程序
				wxInfo             : [], //微信公众号列表
				changeBackground   : '', //微信公众号选中背景色
				miniInfo           : [], //小程序列表
				changeBackground4  : '', //小程序选中背景色
				wxInfo2            : [], //企业微信列表
				changeBackground2  : '', //企业微信选中背景色
				checkedKeys1       : [],//公众号里公众号选中的权限id
				checkedKeys2       : [],//企业微信选中的权限id
				checkedKeys3       : [],//公共模块选中的权限id
				checkedKeys4       : [],//公众号里小程序选中的权限id
				accountTreeList    : [],//公众号树状图
				wechatTreeList     : [],//企业微信树状图
				commonTreeList     : [],//公共模块树状图
				treeList           : [],//详情时总树状图数据
				accountTreeList2   : [],//详情时公众号树状图
				wechatTreeList2    : [],//详情时内容引擎树状图
				commonTreeList2    : [],//详情时公共模块树状图
				list               : [
					{
						type: 1,//公众号
						list: {
							wx  : [],
							mini: []
						}
					},
					{
						type: 2,//企业微信
						list: []
					},
					{
						type: 3,//公共模块
						list: [
							{
								id  : 0,
								list: []
							}
						]
					},
					{
						type: 4,//数据可见范围
						list: []
					},
				],//传给后台的权限
				activeKey          : '1',//1基本信息，2权限设置，3数据可见范围
				isEmpty            : false,//详情时权限空的显示与隐藏
				isEmpty2           : false,//修改与添加时权限空的显示与隐藏
				tabVisible         : false,//权限设置的显示与隐藏
				accountTree        : ['fans-look', 'tag-list', 'reply-list', 'message-list', 'code-list', 'customer-list', 'senior-send-list', 'template-list', 'account-list', 'customerFansAttribute-list', 'followFansStatus-list', 'wxWholeMarketFission-list'],//公众号模块权限的关联关系
				miniTree           : ['mini-list'],//小程序模块权限的关联关系
				wechatTree         : ['staff-list', 'work-tag-group', 'work-tag-list', 'client-list', 'client-tag-group', 'client-tag-list', 'channel-list', 'welcome-list', 'group-sending-list', 'work-management-list', 'agent-list', 'channel-group-list', 'records-list', 'redPacket-list', 'employee-list', 'store-list', 'store-order-list', 'redirect-list', 'customerAttribute-list', 'followStatus-list', 'groupList-list', 'groupList-group', 'groupAutoCreate-list', 'groupAutoCreate-group', 'groupWelcome-list', 'follow-list', 'groupTags-list', 'sensitive-words-list', 'sensitive-words-group-list', 'violations-employee-list', 'violations-chat-list', 'channelCodeBaidu-list', 'chatTag-employee-list', 'chatTag-rule-list', 'highSeasCustomerRecyclingRules-list', 'highSeasCustomerList-list', 'deleteCustomer-list', 'wholeMarketFission-list', 'redFission-list', 'fission-list', 'raffle-list', 'redForNewList-list', 'redRuleList-list', 'circleOfFriends-list', 'todoManagementRemind-list', 'todoManagementSetting-look', 'todoLevel-list', 'todoManagementCustomizeNew-list', 'groupClockIn-list', 'customRecord-list'], //企业微信模块权限的关联关系
				commonTree         : ['content-list', 'material-list', 'sending-list', 'user-list', 'sms-template-list', 'sign-list', 'subAccount-list', 'integration-list', 'customerAttribute-list', 'followStatus-list'],//公共模块权限的关联关系
				//数据可见范围
				dataCorpId         : '',//企业微信id
				partyList          : [], // 部门列表
				showModalDepartment: false, //成员选择框显示与隐藏
				chooseNum          : 0,//已选择的成员数量
				chooseIndex        : 0,//选中的第几个可见范围
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
			//获取表格内容
			async getSubAccountList (page = 1, pageSize = this.page_size) {
				this.isLoading = true;
				let name = ''
				if (this.status == 1) {
					name = this.inputValue
				} else if (this.status == 2) {
					name = this.inputValue2
				}
				const {data: res} = await this.axios.post(
					"sub-user/list",
					{
						uid     : localStorage.getItem("uid"),
						status  : this.status,
						page    : page,
						pageSize: pageSize,
						name    : name
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if (this.status == 1) {
						this.subAccountList = res.data.info;
						this.subAccountList.map(x => {
							if (x.type == 1) {
								this.masterAccountId = x.id
							}
						})
						this.total = parseInt(res.data.count);
						this.page = page;
						this.page_size = pageSize;
						this.quickJumper = this.total > this.page_size;
						this.isLoading = false;
					} else {
						this.subAccountList2 = res.data.info;
						this.total2 = parseInt(res.data.count);
						this.page2 = page;
						this.page_size2 = pageSize;
						this.quickJumper2 = this.total > this.page_size;
						this.isLoading2 = false;
					}
				}
				//   console.log(this.accountList);
			},
			changePage (page, page_size) {
				this.getSubAccountList(page, page_size);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 140)
				})
			},
			showSizeChange (page, page_size) {
				this.getSubAccountList(1, page_size);
			},
			//切换启用状态
			changeStatus (value) {
				this.status = value
				this.inputValue = ''
				this.inputValue2 = ''
				this.getSubAccountList()
			},
			//查找
			find () {
				this.getSubAccountList()
			},
			//清空
			clear () {
				this.inputValue = ''
				this.inputValue2 = ''
				this.getSubAccountList()
			},
			//点击添加子账户
			addSubAccount () {
				this.actionId = ''
				this.hasEnterpriseName()
			},
			//修改子账户
			editSubAccount (record) {
				this.isLoading = true
				if (record.type == 1) {
					this.statusDisabled = true
					this.tabVisible = false
					this.businessName = record.company_name
					if (record.company_logo != null && record.company_logo != '') {
						this.imageUrl = record.company_logo
					}
				} else if (record.type == 0) {
					this.tabVisible = true
					if (record.id == this.sub_id) {
						this.tabVisible = false
					}
				}
				this.enterType = 2
				this.activeKey = '1'
				this.addSubAccountTitle = '修改子账户'
				this.isFlag = 1
				this.enterpriseName = 1
				this.staffName = record.name
				this.phoneNumber = record.account
				if (record.sex == '' || record.sex == 0) {
					this.sex = 1
				} else {
					this.sex = record.sex
				}
				this.department = record.department
				this.post = record.position
				this.addStatus = record.status
				this.addStatus2 = record.status
				this.actionId = record.id
				if (record.password == '') {
					this.passwordFlag = true
				} else {
					this.passwordFlag = false
				}
				this.editFlag = true
				this.record = record
				if (this.wxInfo2.length > 0) {
					this.list[3].list = []
					this.wxInfo2.map(x => {
						this.list[3].list.push({
							corp_id      : x.id,
							type         : [2],
							user_key     : [],
							department_id: [],
							checkedList  : [],
							chooseNum    : 0
						})
					})
				}
				this.getWxList()
				this.getDetailWxList()
			},
			//判断主账号有没有完善企业名称
			async hasEnterpriseName () {
				const {data: res} = await this.axios.post(
					"sub-user/get-company-info",
					{
						uid: localStorage.getItem("uid"),
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.isFlag = 1
					this.enterpriseName = res.data.info;
					if (this.enterpriseName == 0) {
						this.tabVisible = false
						this.editFlag = true
						this.enterType = 2
						this.addSubAccountTitle = '完善主账户信息'
						this.staffName = res.data.user.nick_name
						this.phoneNumber = res.data.user.phone
						if (res.data.user.sex == '' || res.data.user.sex == 0) {
							this.sex = 1
						} else {
							this.sex = res.data.user.sex
						}
						this.department = res.data.user.department
						this.post = res.data.user.position
						let imgUrl = res.data.user.company_logo
						if (imgUrl == null) {
							this.imageUrl = ''
						} else {
							if (imgUrl == '') {
								this.imageUrl = ''
							} else {
								this.imageUrl = imgUrl
							}
						}
						this.statusDisabled = true
					} else {
						this.tabVisible = true
						this.enterType = 2
						this.addSubAccountTitle = '添加子账户'
						this.staffName = ''
						this.phoneNumber = ''
						this.sex = 1
						this.department = ''
						this.post = ''
						this.addStatus = 1
						this.addStatus2 = 1
						this.addPassword = ''
						this.businessName = ''
						this.fileInfo = {}
						this.local_path = ''
						this.imageUrl = ''
						this.passwordFlag = true
						this.statusDisabled = false
					}
					this.activeKey = '1'
					this.getPartyList()
					this.detailVisible = true
				}
			},
			addSubAccountOk () {
				if (this.enterpriseName == 0) {
					this.setUser()
				} else {
					if (this.tabVisible) {
						let hasOne = false
						this.list.map(x => {
							if (!Array.isArray(x.list)) {
								if (x.list.wx.length > 0) {
									x.list.wx.map(i => {
										if (i.list.length > 0) {
											hasOne = true
										}
									})
								}
								if (x.list.mini.length > 0) {
									x.list.mini.map(j => {
										if (j.list.length > 0) {
											hasOne = true
										}
									})
								}
							} else {
								if (x.type != 4) {
									x.list.map(y => {
										if (y.list.length > 0) {
											hasOne = true
										}
									})
								}
							}
						})
						if (!hasOne) {
							this.$message.warn('至少选择一条权限')
						} else {
							if (this.actionId == '') {
								this.addUser(0)
							} else {
								this.addUser(this.actionId)
							}
						}
					} else {
						if (this.actionId == '') {
							this.addUser(0)
						} else {
							this.addUser(this.actionId)
						}
					}
				}
			},
			clearPassword () {
				this.addPassword = ''
			},
			//完善主账户信息
			async setUser () {
				this.isDrawLoading = true
				const {data: res} = await this.axios.post(
					"user/set-user-info",
					{
						uid         : localStorage.getItem("uid"),
						company_name: this.businessName,
						local_path  : this.local_path,
						nick_name   : this.staffName,
						phone       : this.phoneNumber,
						sex         : this.sex,
						position    : this.post,
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					let that = this
					setTimeout(function () {
						that.isDrawLoading = false
					}, 1000)
					that.enterpriseName = 1
					that.staffName = ''
					that.imageUrl = ''
					that.phoneNumber = ''
					that.sex = 1
					that.department = ''
					that.post = ''
					that.addStatus = 1
					that.addStatus2 = 1
					that.businessName = ''
					that.fileInfo = {}
					that.local_path = ''
					that.addSubAccountTitle = '添加子账户'
					that.editFlag = false
					that.tabVisible = true
					that.passwordFlag = true
					that.editFlag = false
					that.enterType = 2
					that.statusDisabled = false
				}
			},
			//添加、修改子账户
			async addUser (sub_id) {
				let company_name = ''
				let source = ''
				if (this.record.type == 1) {
					company_name = this.businessName
					source = 1
				} else if (this.record.type == 0) {
					source = 0
				}
				if (this.local_path == '') {
					this.local_path = this.imageUrl
				}
				// console.log(this.list[0].list,'确定')

				//数据可见范围类型
				for (let i = 0; i < this.list[3].list.length; i++) {
					// if (this.list[3].list[i].type.indexOf(3) > -1) {
					// 	//选择部门
					// 	if (this.list[3].list[i].department_id.length == 0) {
					// 		this.$message.warn('请选择部门')
					// 		return false
					// 	}
					// }
					if (this.list[3].list[i].type.indexOf(4) > -1) {
						//选择成员
						if (this.list[3].list[i].checkedList.length == 0) {
							this.$message.warn('请选择成员')
							return false
						}
					}
				}

				const {data: res} = await this.axios.post(
					"sub-user/add", {
						uid          : localStorage.getItem("uid"),
						sub_id       : sub_id,
						name         : this.staffName,
						account      : this.phoneNumber,
						sex          : this.sex,
						department   : this.department,
						position     : this.post,
						status       : this.addStatus,
						password     : this.addPassword,
						authority_ids: this.list,
						company_name : company_name,
						local_path   : this.local_path,
						source       : source,//0是子账户修改，1是主账户修改
					}
					)
				;
				//   console.log(res);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (this.editFlag) {
						this.$message.success('修改成功');
					} else {
						this.$message.success('添加成功');
					}
					this.getSubAccountList(this.page, this.page_size)
					this.detailVisible = false
					this.enterpriseName = 1
					this.staffName = ''
					this.phoneNumber = ''
					this.sex = 1
					this.department = ''
					this.post = ''
					this.addStatus = 1
					this.addStatus2 = 1
					this.addSubAccountTitle = '添加子账户'
					this.editFlag = false
					this.passwordFlag = false
					this.list = [
						{
							type: 1,//公众号
							list: {
								wx  : [],
								mini: []
							}
						},
						{
							type: 2,//企业微信
							list: []
						},
						{
							type: 3,//公共模块
							list: [
								{
									id  : 0,
									list: []
								}
							]
						},
						{
							type: 4,//数据可见范围
							list: []
						},
					]
					this.wxInfo.map(x => {
						this.list[0].list.wx.push({
							id  : Number(x.id),
							list: []
						})
					})
					this.miniInfo.map(x => {
						this.list[0].list.mini.push({
							id  : Number(x.id),
							list: []
						})
					})
					this.wxInfo2.map(x => {
						this.list[1].list.push({
							id  : Number(x.id),
							list: []
						})
					})
					this.checkedKeys1 = []
					this.checkedKeys2 = []
					this.checkedKeys3 = []
					this.checkedKeys4 = []
					if (this.wxInfo.length > 0) {
						this.changeBackground = this.wxInfo[0].id
					} else {
						this.changeBackground = ''
					}
					if (this.miniInfo.length > 0) {
						this.changeBackground4 = this.miniInfo[0].id
					} else {
						this.changeBackground4 = ''
					}
					if (this.wxInfo2.length > 0) {
						this.changeBackground2 = this.wxInfo2[0].id
						this.dataCorpId = this.wxInfo2[0].corpid
					} else {
						this.changeBackground2 = ''
						this.dataCorpId = ''
					}
					this.tabType = '1'
					this.tabType2 = '1'
					this.activeKey = '1'
					this.statusDisabled = false
				}
			},
			//禁用、启用
			showWarnVisible (record) {
				let that = this
				that.$confirm({
					title: '一旦禁用后，员工的所有权限都无法使用，无法登陆系统后台，确定禁用吗？',
					onOk () {
						that.changeAddStatus(record, 2)
					},
					onCancel () {
					},
				});
			},
			showStartVisible (record) {
				let that = this
				that.$confirm({
					title: '一旦启用后，员工之前的所有操作权限恢复，确定要启用吗？',
					onOk () {
						that.changeAddStatus(record, 1)
					},
					onCancel () {
					},
				});
			},
			changeAddStatus (record, status) {
				this.actionId = record.id
				this.aloneChangeStatus = true
				this.aloneStatus = status
				if (record.password == '') {
					this.passwordTitle = '完善密码'
					this.editPasswordVisible = true
				} else {
					this.changeAddStatus2()
				}
			},
			async changeAddStatus2 (status) {
				const {data: res} = await this.axios.post(
					"sub-user/update-status",
					{
						id    : this.actionId,
						status: this.aloneStatus,
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.actionId = ''
					this.aloneStatus = ''
					this.aloneChangeStatus = false
					this.passwordFlag = false
					this.detailVisible = false
					this.tabType = '1'
					this.activeKey = '1'
					this.getSubAccountList(this.page, this.page_size)
				}
			},
			// 更换logo
			changeLogo () {
				this.uploadMaterial(this.fileInfo);
			},
			async uploadMaterial (materialData) {
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", materialData);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.local_path = res.data.local_path
						this.imageUrl = res.data.local_path
					}
				} else {
					this.local_path = this.imageUrl
					this.$message.error(res.error_msg)
				}
			},
			//企业logo
			selfUpload ({action, file, onSuccess, onError, onProgress}) {
				const base64 = new Promise(resolve => {
					const fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					fileReader.onload = () => {
						resolve(fileReader.result);
						this.imageUrl = fileReader.result;
					};
				});
				this.fileInfo = file;
			},
			beforeUpload (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					return false;
				}
				return isLt2M;
			},
			//修改密码
			editPassword (id) {
				this.passwordTitle = '重置密码'
				this.editPasswordVisible = true
				this.actionId = id

				if ((Date.parse(new Date()) / 1000 - this.codeTime < 7200) && this.codeFlag) {
					this.passwordInputVisible = true
				} else {
					this.passwordInputVisible = false
					clearInterval(this.timer);
					this.timer = null;
					this.sendDisabled = false;
					this.btnTitle = "获取验证码";
				}
			},
			editPasswordCancel () {
				this.password = ''
				this.passwordCode = ''
				this.editPasswordVisible = false
			},
			editPasswordOk () {
				this.editPasswordLoading = true
				if (this.passwordInputVisible) {
					this.modifyPassword()
				} else {
					this.checkCode()
				}
			},
			async modifyPassword () {
				const {data: res} = await this.axios.post(
					"sub-user/modify-password",
					{
						id      : this.actionId,
						password: this.password,
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.editPasswordLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.password = ''
					this.editPasswordLoading = false
					this.editPasswordVisible = false
					if (this.aloneChangeStatus) {
						this.changeAddStatus2()
					}
				}
			},
			//给主账户发送短信验证码
			async sendCode () {
				//倒计时
				let time = 60;
				let that = this
				that.timer = setInterval(() => {
					if (time == 0) {
						clearInterval(that.timer);
						that.sendDisabled = false;
						that.btnTitle = "获取验证码";
					} else {
						that.btnTitle = time + '秒后重试';
						that.sendDisabled = true;
						time--
					}
				}, 1000)
				let type = ''
				let isMasterAccount = localStorage.getItem('isMasterAccount')
				if (isMasterAccount == 1) {
					type = "mainModifyPassword"
				} else if (isMasterAccount == 2) {
					type = "subModifyPassword"
				}
				const {data: res} = await this.axios.post(
					"login/get-code",
					{
						account: localStorage.getItem('masterAccountPhone'),
						type   : type
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success('发送成功')
					this.codeTime = Date.parse(new Date()) / 1000
					localStorage.setItem('codeTime', this.codeTime)
				}
			},
			//验证验证码正确性
			async checkCode () {
				const {data: res} = await this.axios.post(
					"sub-user/verify-code",
					{
						account        : localStorage.getItem('masterAccountPhone'),
						code           : this.passwordCode,
						isMasterAccount: localStorage.getItem('isMasterAccount')
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.editPasswordLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.editPasswordLoading = false
					this.passwordInputVisible = true
					this.passwordCode = ''
					this.codeFlag = true
					localStorage.setItem('twoHourCode', this.codeFlag)
				}
			},
			//详情
			detail (record) {
				this.isLoading = true
				if (record.type == 1) {
					this.tabVisible = false
					this.businessName = record.company_name
					if (record.company_logo != null && record.company_logo != '') {
						this.imageUrl = record.company_logo
					}
				} else if (record.type == 0) {
					this.tabVisible = true
				}
				this.enterType = 2
				this.activeKey = '1'
				this.addSubAccountTitle = record.name + '详情'
				this.isFlag = 2
				this.actionId = record.id
				this.staffName = record.name
				this.phoneNumber = record.account
				if (record.sex == '' || record.sex == 0) {
					this.sex = 1
				} else {
					this.sex = record.sex
				}
				this.department = record.department
				this.post = record.position
				this.addStatus = record.status
				this.addStatus2 = record.status
				this.detailAddTime = record.create_time
				if (record.password == '') {
					this.passwordFlag = true
				} else {
					this.passwordFlag = false
				}
				this.record = record
				this.getPartyList()
				this.getDetailWxList()
			},
			detailClose () {
				this.detailVisible = false
				this.isFlag = 1
				this.passwordFlag = false
				this.imageUrl = ''
				this.enterpriseName = ''
				this.staffName = ''
				this.phoneNumber = ''
				this.sex = 1
				this.department = ''
				this.post = ''
				this.addStatus = 1
				this.addStatus2 = 1
				this.businessName = ''
				this.addPassword = ''
				this.fileInfo = {}
				this.local_path = ''
				this.addSubAccountTitle = '修改子账户'
				this.editFlag = false
				this.passwordFlag = false
				this.list = [
					{
						type: 1,//公众号
						list: {
							wx  : [],
							mini: []
						}
					},
					{
						type: 2,//企业微信
						list: []
					},
					{
						type: 3,//公共模块
						list: [
							{
								id  : 0,
								list: []
							}
						]
					},
					{
						type: 4,//数据可见范围
						list: []
					},
				]
				this.miniInfo.map(x => {
					this.list[0].list.mini.push({
						id  : Number(x.id),
						list: []
					})
				})
				this.wxInfo.map(x => {
					this.list[0].list.wx.push({
						id  : Number(x.id),
						list: []
					})
				})
				this.wxInfo2.map(x => {
					this.list[1].list.push({
						id  : Number(x.id),
						list: []
					})
					this.list[3].list.push({
						corp_id      : x.id,
						type         : [2],
						user_key     : [],
						department_id: [],
						checkedList  : [],
						chooseNum    : 0
					})
				})
				this.checkedKeys1 = []
				this.checkedKeys2 = []
				this.checkedKeys3 = []
				this.checkedKeys4 = []
				if (this.wxInfo.length > 0) {
					this.changeBackground = this.wxInfo[0].id
				} else {
					this.changeBackground = ''
				}
				if (this.miniInfo.length > 0) {
					this.changeBackground4 = this.miniInfo[0].id
				} else {
					this.changeBackground4 = ''
				}
				if (this.wxInfo2.length > 0) {
					this.changeBackground2 = this.wxInfo2[0].id
					this.dataCorpId = this.wxInfo2[0].corpid
				} else {
					this.changeBackground2 = ''
					this.dataCorpId = ''
				}
				this.tabType = '1'
				this.activeKey = '1'
				this.partyList = []
				this.showModalDepartment = false
				this.chooseNum = 0
				this.statusDisabled = false
			},
			detailCancel () {
				this.isFlag = 2
				this.addSubAccountTitle = '员工详情'
				this.statusDisabled = false
				if (this.record.type == 1) {
					this.tabVisible = false
				} else if (this.record.type == 0) {
					this.tabVisible = true
				}
				this.enterType = 2
				if (this.activeKey == 2) {
					if (this.isFlag == 2) {
						if (this.tabType == 1) {
							if (this.tabType2 == 1) {
								if (this.accountTreeList2.wx.length == 0) {
									this.isEmpty = true
								} else {
									this.isEmpty = false
								}
							} else if (this.tabType2 == 2) {
								if (this.accountTreeList2.mini.length == 0) {
									this.isEmpty = true
								} else {
									this.isEmpty = false
								}
							}
						} else if (this.tabType == 2) {
							if (this.wechatTreeList2.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						} else if (this.tabType == 3) {
							if (this.commonTreeList2.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						}
					} else {
						if (this.tabType == 1) {
							if (this.tabType2 == 1) {
								if (this.accountTreeList.wx.length == 0) {
									this.isEmpty2 = true
								} else {
									this.isEmpty2 = false
								}
							} else if (this.tabType2 == 2) {
								if (this.accountTreeList.mini.length == 0) {
									this.isEmpty2 = true
								} else {
									this.isEmpty2 = false
								}
							}
						} else if (this.tabType == 2) {
							if (this.wechatTreeList.length == 0) {
								this.isEmpty2 = true
							} else {
								this.isEmpty2 = false
							}
						} else if (this.tabType == 3) {
							if (this.commonTreeList.length == 0) {
								this.isEmpty2 = true
							} else {
								this.isEmpty2 = false
							}
						}
					}
				}
			},
			detailOk () {
				this.enterType = 1
				this.addSubAccountTitle = '修改子账户'
				this.enterpriseName = 1
				this.editFlag = true
				this.isFlag = 1
				if (this.record.type == 1) {
					this.statusDisabled = true
					this.businessName = this.record.company_name
					if (this.record.company_logo != null && this.record.company_logo != '') {
						this.imageUrl = this.record.company_logo
					}
				} else if (this.record.type == 0) {
					if (this.record.id == this.sub_id) {
						this.tabVisible = false
						this.activeKey = '1'
					}
				}
				if (this.treeList[0].list.wx.length != 0) {
					this.treeList[0].list.wx.map(x => {
						if (x.id == this.changeBackground) {
							this.checkedKeys1 = x.list.map(Number)
						}
					})
				}
				if (this.treeList[0].list.mini.length != 0) {
					this.treeList[0].list.mini.map(x => {
						if (x.id == this.changeBackground4) {
							this.checkedKeys4 = x.list.map(Number)
						}
					})
				}
				if (this.treeList[1].list.length != 0) {
					this.treeList[1].list.map(x => {
						if (x.id == this.changeBackground2) {
							this.checkedKeys2 = x.list.map(Number)
						}
					})
				}
				if (this.treeList[2].list.length != 0) {
					this.checkedKeys3 = this.treeList[2].list[0].list.map(Number)
				}
			},
			phoneChange (e) {
				const {value} = e.target;
				const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
				if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
					this.phoneNumber = value;
				}
			},
			//权限设置
			limitsOk () {
				let hasOne = false
				this.list.map(x => {
					if (!Array.isArray(x.list)) {
						if (x.list.wx.length > 0) {
							x.list.wx.map(i => {
								if (i.list.length > 0) {
									hasOne = true
								}
							})
						}
						if (x.list.mini.length > 0) {
							x.list.mini.map(j => {
								if (j.list.length > 0) {
									hasOne = true
								}
							})
						}
					} else {
						if (x.type != 4) {
							x.list.map(y => {
								if (y.list.length > 0) {
									hasOne = true
								}
							})
						}
					}
				})
				if (!hasOne) {
					this.$message.warn('至少选择一条权限')
				} else {
					if (this.actionId == '') {
						this.addUser(0)
					} else {
						this.addUser(this.actionId)
					}
				}
			},
			//切换基本信息与权限设置
			changeTab2 () {
				if (this.activeKey == 2) {
					if (this.wxInfo.length == 0) {
						if (this.wxInfo2.length == 0) {
							this.tabType = '3'
						} else {
							this.tabType = '2'
						}
					}
					if (this.isFlag == 2) {
						if (this.tabType == 1) {
							if (this.tabType2 == 1) {
								if (this.accountTreeList2.wx.length == 0) {
									this.isEmpty = true
								} else {
									this.isEmpty = false
								}
							} else {
								if (this.accountTreeList2.mini.length == 0) {
									this.isEmpty = true
								} else {
									this.isEmpty = false
								}
							}
						} else if (this.tabType == 2) {
							if (this.wechatTreeList2.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						} else if (this.tabType == 3) {
							if (this.accountTreeList2.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						}
					} else {
						if (this.tabType == 1) {
							if (this.tabType2 == 1) {
								if (this.accountTreeList.wx.length == 0) {
									this.isEmpty2 = true
								} else {
									this.isEmpty2 = false
								}
							} else {
								if (this.accountTreeList.mini.length == 0) {
									this.isEmpty2 = true
								} else {
									this.isEmpty2 = false
								}
							}
						} else if (this.tabType == 2) {
							if (this.wechatTreeList.length == 0) {
								this.isEmpty2 = true
							} else {
								this.isEmpty2 = false
							}
						} else if (this.tabType == 3) {
							if (this.commonTreeList.length == 0) {
								this.isEmpty2 = true
							} else {
								this.isEmpty2 = false
							}
						}
					}
				} else if (this.activeKey == 3) {
					console.log(this.chooseIndex, 'chooseIndex')
				}
			},
			//切换公众号与微信
			changeTab (e) {
				this.tabType = e
				if (this.isFlag == 2) {
					if (this.tabType == 1) {
						if (this.tabType2 == 1) {
							if (this.accountTreeList2.wx.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						} else {
							if (this.accountTreeList2.mini.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						}
					} else if (this.tabType == 2) {
						if (this.wechatTreeList2.length == 0) {
							this.isEmpty = true
						} else {
							this.isEmpty = false
						}
					} else if (this.tabType == 3) {
						if (this.commonTreeList2.length == 0) {
							this.isEmpty = true
						} else {
							this.isEmpty = false
						}
					}
				} else {
					if (this.tabType == 1) {
						if (this.tabType2 == 1) {
							if (this.accountTreeList.wx.length == 0) {
								this.isEmpty2 = true
							} else {
								this.isEmpty2 = false
							}
						} else {
							if (this.accountTreeList.mini.length == 0) {
								this.isEmpty2 = true
							} else {
								this.isEmpty2 = false
							}
						}
					} else if (this.tabType == 2) {
						if (this.wechatTreeList.length == 0) {
							this.isEmpty2 = true
						} else {
							this.isEmpty2 = false
						}
					} else if (this.tabType == 3) {
						if (this.commonTreeList.length == 0) {
							this.isEmpty2 = true
						} else {
							this.isEmpty2 = false
						}
					}
				}
			},
			//切换公众号与小程序
			changeWxMini (e) {
				this.tabType2 = e
				if (this.isFlag == 2) {
					if (this.tabType2 == 1) {
						if (this.accountTreeList2.wx.length == 0) {
							this.isEmpty = true
						} else {
							this.isEmpty = false
						}
					} else {
						if (this.accountTreeList2.mini.length == 0) {
							this.isEmpty = true
						} else {
							this.isEmpty = false
						}
					}
				} else {
					if (this.tabType2 == 1) {
						if (this.accountTreeList.wx.length == 0) {
							this.isEmpty2 = true
						} else {
							this.isEmpty2 = false
						}
					} else {
						if (this.accountTreeList.mini.length == 0) {
							this.isEmpty2 = true
						} else {
							this.isEmpty2 = false
						}
					}
				}
			},
			//获取所有权限
			async getWxList () {
				let disabled = 0
				let wxArr = JSON.parse(localStorage.getItem('wxArr'))
				let corpArr = JSON.parse(localStorage.getItem('corpArr'))
				if (wxArr.length > 0 && corpArr.length > 0) {
					disabled = 0
				} else if (wxArr.length == 0 && corpArr.length > 0) {
					disabled = 1
				} else if (wxArr.length > 0 && corpArr.length == 0) {
					disabled = 2
				} else if (wxArr.length == 0 && corpArr.length == 0) {
					disabled = 3
				}
				const {data: res} = await this.axios.post(
					"sub-user/get-all-authority",
					{
						id      : this.actionId,
						disabled: disabled,//0是正常，1置灰公众号权限选择，2置灰企业微信权限选择
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (!this.editFlag) {
						this.accountTreeList = res.data.account
						this.wechatTreeList = res.data.wechat
						this.commonTreeList = res.data.common
					}
				}
			},
			//获取详情时每个人的权限
			async getDetailWxList () {
				const {data: res} = await this.axios.post(
					"sub-user/detail",
					{
						id: this.actionId,
					}
				);
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.treeList = res.data
					if (this.isFlag == 2) {
						//详情
						if (this.treeList[0].list.wx.length != 0) {
							this.accountTreeList2.wx = this.treeList[0].list.wx[0].content
						} else {
							this.accountTreeList2.wx = []
						}
						if (this.treeList[0].list.mini.length != 0) {
							this.accountTreeList2.mini = this.treeList[0].list.mini[0].content
						} else {
							this.accountTreeList2.mini = []
						}
						if (this.treeList[1].list.length != 0) {
							this.wechatTreeList2 = this.treeList[1].list[0].content
						} else {
							this.wechatTreeList2 = []
						}
						if (this.treeList[2].list.length != 0) {
							this.commonTreeList2 = this.treeList[2].list[0].content
						} else {
							this.commonTreeList2 = []
						}
						if (this.treeList[3].length != 0) {
							let that = this
							that.treeList[3].map(x => {
								if (x.type.indexOf(3) > -1) {
									x.departmentName = []
									x.department_id.map(j => {
										that.partyList.map(y => {
											if (j == y.id) {
												x.departmentName.push(y.name)
											}
										})
									})
								}
							})
						} else {
							if (this.wxInfo2.length > 0) {
								let obj = {
									type: []
								}
								this.wxInfo2.map(x => {
									this.treeList[3].push(obj)
								})
							}
						}
					} else {
						//修改、添加
						if (this.treeList[0].list.wx.length != 0) {
							this.checkedKeys1 = this.treeList[0].list.wx[0].list.map(Number)
						}
						if (this.treeList[0].list.mini.length != 0) {
							this.checkedKeys4 = this.treeList[0].list.mini[0].list.map(Number)
						}
						if (this.treeList[1].list.length != 0) {
							this.checkedKeys2 = this.treeList[1].list[0].list.map(Number)
						}
						if (this.treeList[2].list.length != 0) {
							this.checkedKeys3 = this.treeList[2].list[0].list.map(Number)
						}
					}
					this.getPartyList()
					if (this.treeList.length > 0) {
						for (let i = 0; i < this.treeList.length - 1; i++) {
							if (!Array.isArray(this.treeList[i].list)) {
								for (let j = 0; j < this.treeList[i].list.mini.length; j++) {
									this.list[i].list.mini[j].list = this.treeList[i].list.mini[j].list
								}
								for (let x = 0; x < this.treeList[i].list.wx.length; x++) {
									this.list[i].list.wx[x].list = this.treeList[i].list.wx[x].list
								}
							} else {
								if (this.treeList[i].list.length > 0) {
									for (let j = 0; j < this.treeList[i].list.length; j++) {
										this.list[i].list[j].list = this.treeList[i].list[j].list
									}
								}
							}
						}
						if (this.treeList[3].length == 0 && typeof this.treeList[3] == 'object') {
							this.wxInfo2.map(x => {
								let obj = {
									type         : [2],
									corp_id      : x.id,
									checkedList  : [],
									user_key     : [],
									chooseNum    : 0,
									department_id: []
								}
								this.treeList[3].push(obj)
							})
						}

						this.list[3].list = JSON.parse(JSON.stringify(this.treeList[3]))
						this.list[3].list.map((x,index)=>{
							if(typeof x.type == 'object' && x.type.length > 0){
								if(x.type.indexOf(3) > -1){
									if(x.type.indexOf(4) > -1){
										x.type.splice(index,1)
									}else {
										x.type.splice(index,1)
										x.type.push(4)
									}
								}
							}
						})
						if (this.wxInfo2.length > 0) {
							this.$refs.user.changeCorpId = this.wxInfo2[0].corpid
						}
					}
					this.chooseIndex = 0
					this.detailVisible = true
					this.isLoading = false
				}
			},
			// 公众号里公众号
			handleChange (value) {
				this.changeBackground = value
				this.checkedKeys1 = []
				if (this.isFlag == 1) {
					if (!this.editFlag) {
						this.list[0].list.map(x => {
							if (x.id == value) {
								this.checkedKeys1 = x.list
							}
						})
					} else {
						if (this.treeList[0].list.length != 0 && this.tabType == 1) {
							this.treeList[0].list.map(y => {
								if (y.id == value) {
									this.checkedKeys1 = y.list.map(Number)
								}
							})
						}
					}
				} else {
					if (this.treeList[0].list.length != 0 && this.tabType == 1) {
						this.treeList[0].list.map(y => {
							if (y.id == value) {
								this.accountTreeList2 = y.content
							}
						})
					}
					if (this.accountTreeList2.length == 0) {
						this.isEmpty = true
					} else {
						this.isEmpty = false
					}
				}
			},
			selectWx (id) {
				this.changeBackground = id
				this.checkedKeys1 = []
				if (this.isFlag == 1) {
					if (!this.editFlag) {
						this.list[0].list.wx.map(x => {
							if (x.id == id) {
								this.checkedKeys1 = x.list
							}
						})
					} else {
						if (this.list[0].list.wx.length != 0 && this.tabType == 1) {
							this.list[0].list.wx.map(y => {
								if (y.id == id) {
									this.checkedKeys1 = y.list.map(Number)
								}
							})
						}
					}
				} else {
					if (this.treeList[0].list.wx.length != 0 && this.tabType == 1 && this.tabType2 == 1) {
						this.treeList[0].list.wx.map(y => {
							if (y.id == id) {
								this.accountTreeList2.wx = y.content
							}
						})
						if (this.accountTreeList2.wx) {
							if (this.accountTreeList2.wx.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						} else {
							this.isEmpty = true
						}
					}
					if (this.treeList[0].list.mini.length != 0 && this.tabType == 1 && this.tabType2 == 2) {
						this.treeList[0].list.mini.map(y => {
							if (y.id == id) {
								this.accountTreeList2.mini = y.content
							}
						})
						if (this.accountTreeList2.mini) {
							if (this.accountTreeList2.mini.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						} else {
							this.isEmpty = true
						}
					}
				}
			},
			onCheck1 (e, val) {
				let checkId = val.node.eventKey
				//勾选的权限名
				let checkRoute = ''
				console.log(checkId, '公众号里公众号')
				let arr = []
				let arr1 = []
				let arr3 = []
				let arr4 = []
				//arr存储checkId的该组的完整值
				const loop = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.id === key) {
							return callback(data, item2.route)
						} else {
							if (item2.children) {
								return loop(item2.children, key, callback)
							}
						}
					})
				}
				loop(this.accountTreeList.wx, checkId, (item, route) => {
					arr = item
					checkRoute = route
				})
				console.log(checkRoute, '公众号checkRoute')
				if (arr.length > 0) {
					arr.map(x => {
						//arr4存储checkId的该组所有权限名的数组
						arr4.push(x.id)
						if (this.accountTree.indexOf(x.route) != -1) {
							//arr1存储checkId的该组下需要联动勾选的权限名的数组
							arr1.push(x.route)
						}
					})
				}

				function uniqueArr (array) {
					var n = [];
					for (var i = 0; i < array.length; i++) {
						if (n.indexOf(array[i]) == -1) n.push(array[i]);
					}
					return n;
				}

				//e为勾选的权限的id，找出对应权限的权限名，保存在数组arr5中
				let arr5 = []
				const loop2 = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.route === key) {
							return callback(item2.id)
						} else {
							if (item2.children) {
								return loop2(item2.children, key, callback)
							}
						}
					})
				}
				arr1.map(x => {
					loop2(this.accountTreeList.wx, x, (item) => {
						arr5.push(item)
					})
				})

				let arr2 = e.concat(arr5)
				arr3 = uniqueArr(arr2)

				//判断特殊情况，点击权限，获取需要联动的权限id
				let specialId = ''
				const loop3 = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.route === key) {
							return callback(item2.id)
						} else {
							if (item2.children) {
								return loop3(item2.children, key, callback)
							}
						}
					})
				}

				//是不是单独选取展示列表
				let intersection = arr3.filter(function (val) {
					return arr4.indexOf(val) > -1
				})
				if (intersection.length == 1 && intersection[0] == checkId && this.checkedKeys1.indexOf(checkId) != -1) {
					arr3.splice(arr3.indexOf(checkId), 1)
				} else if (intersection.length == 1 && intersection[0] == checkId && this.checkedKeys1.indexOf(checkId) == -1) {
					// arr3.push(checkId)
				} else {
					if (this.accountTree.indexOf(checkRoute) != -1) {
						arr3.splice(arr3.indexOf(checkId), 1)
						arr.map(x => {
							arr3.map((y, yIndex) => {
								if (x.id == y) {
									arr3.splice(yIndex, 1)
								}
							})
						})
					}
				}
				this.checkedKeys1 = arr3

				//新裂变引流特殊情况
				if (checkRoute == 'wxWholeMarketFission-award') {
					loop3(this.accountTreeList.wx, 'wxWholeMarketFission-info', (id) => {
						specialId = id
					})
					if (this.checkedKeys1.indexOf(specialId) == -1) {
						this.checkedKeys1.push(specialId)
					}
				}
				if (checkRoute == 'wxWholeMarketFission-info') {
					loop3(this.accountTreeList.wx, 'wxWholeMarketFission-list', (id) => {
						specialId = id
					})
					if (this.checkedKeys1.indexOf(specialId) == -1) {
						this.checkedKeys1.push(specialId)
					}
				}
				if (checkRoute == 'wxWholeMarketFission-info') {
					loop3(this.accountTreeList.wx, 'wxWholeMarketFission-award', (id) => {
						specialId = id
					})
					if (this.checkedKeys1.indexOf(specialId) != -1) {
						this.checkedKeys1.splice(this.checkedKeys1.indexOf(specialId), 1)
					}
				}

				for (let i = 0; i < this.list[0].list.wx.length; i++) {
					if (this.list[0].list.wx[i].id == this.changeBackground) {
						this.list[0].list.wx[i].list = this.checkedKeys1
					}
				}
			},
			// 公众号里小程序
			selectWx4 (id) {
				this.changeBackground4 = id
				this.checkedKeys4 = []
				if (this.isFlag == 1) {
					if (!this.editFlag) {
						this.list[0].list.mini.map(x => {
							if (x.id == id) {
								this.checkedKeys4 = x.list
							}
						})
					} else {
						if (this.list[0].list.mini.length != 0 && this.tabType == 1) {
							this.list[0].list.mini.map(y => {
								if (y.id == id) {
									this.checkedKeys4 = y.list.map(Number)
								}
							})
						}
					}
				} else {
					if (this.treeList[0].list.wx.length != 0 && this.tabType == 1 && this.tabType2 == 1) {
						this.treeList[0].list.wx.map(y => {
							if (y.id == id) {
								this.accountTreeList2.wx = y.content
							}
						})
						if (this.accountTreeList2.wx) {
							if (this.accountTreeList2.wx.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						} else {
							this.isEmpty = true
						}
					}
					if (this.treeList[0].list.mini.length != 0 && this.tabType == 1 && this.tabType2 == 2) {
						this.treeList[0].list.mini.map(y => {
							if (y.id == id) {
								this.accountTreeList2.mini = y.content
							}
						})
						if (this.accountTreeList2.mini) {
							if (this.accountTreeList2.mini.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						} else {
							this.isEmpty = true
						}
					}
				}
			},
			onCheck4 (e, val) {
				let checkId = val.node.eventKey
				//勾选的权限名
				let checkRoute = ''
				console.log(checkId, '公众号小程序')
				let arr = []
				let arr1 = []
				let arr3 = []
				let arr4 = []
				//arr存储checkId的该组的完整值
				const loop = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.id === key) {
							return callback(data, item2.route)
						} else {
							if (item2.children) {
								return loop(item2.children, key, callback)
							}
						}
					})
				}
				loop(this.accountTreeList.mini, checkId, (item, route) => {
					arr = item
					checkRoute = route
				})
				// console.log(arr,'arr')
				if (arr.length > 0) {
					arr.map(x => {
						//arr4存储checkId的该组所有权限名的数组
						arr4.push(x.id)
						if (this.miniTree.indexOf(x.route) != -1) {
							//arr1存储checkId的该组下需要联动勾选的权限名的数组
							arr1.push(x.route)
						}
					})
				}

				function uniqueArr (array) {
					var n = [];
					for (var i = 0; i < array.length; i++) {
						if (n.indexOf(array[i]) == -1) n.push(array[i]);
					}
					return n;
				}

				//e为勾选的权限的id，找出对应权限的权限名，保存在数组arr5中
				let arr5 = []
				const loop2 = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.route === key) {
							return callback(item2.id)
						} else {
							if (item2.children) {
								return loop2(item2.children, key, callback)
							}
						}
					})
				}
				arr1.map(x => {
					loop2(this.accountTreeList.mini, x, (item) => {
						arr5.push(item)
					})
				})

				let arr2 = e.concat(arr5)
				arr3 = uniqueArr(arr2)
				//是不是单独选取展示列表
				let intersection = arr3.filter(function (val) {
					return arr4.indexOf(val) > -1
				})
				if (intersection.length == 1 && intersection[0] == checkId && this.checkedKeys4.indexOf(checkId) != -1) {
					arr3.splice(arr3.indexOf(checkId), 1)
				} else if (intersection.length == 1 && intersection[0] == checkId && this.checkedKeys4.indexOf(checkId) == -1) {
					// arr3.push(checkId)
				} else {
					if (this.miniTree.indexOf(checkRoute) != -1) {
						arr3.splice(arr3.indexOf(checkId), 1)
						arr.map(x => {
							arr3.map((y, yIndex) => {
								if (x.id == y) {
									arr3.splice(yIndex, 1)
								}
							})
						})
					}
				}
				this.checkedKeys4 = arr3

				for (let i = 0; i < this.list[0].list.mini.length; i++) {
					if (this.list[0].list.mini[i].id == this.changeBackground4) {
						this.list[0].list.mini[i].list = this.checkedKeys4
					}
				}
			},
			// 企业微信
			handleChange2 (value) {
				this.changeBackground2 = value
				this.checkedKeys2 = []
				if (this.isFlag == 1) {
					if (!this.editFlag) {
						this.list[1].list.map(x => {
							if (x.id == value) {
								this.checkedKeys2 = x.list
							}
						})
					} else {
						if (this.treeList[1].list.length != 0 && this.tabType == 2) {
							this.treeList[1].list.map(y => {
								if (y.id == value) {
									this.checkedKeys2 = y.list.map(Number)
								}
							})
						}
					}
				} else {
					if (this.treeList[1].list.length != 0 && this.tabType == 2) {
						this.treeList[1].list.map(y => {
							if (y.id == value) {
								this.wechatTreeList2 = y.content
							}
						})
					}
					if (this.wechatTreeList2.length == 0) {
						this.isEmpty = true
					} else {
						this.isEmpty = false
					}
				}
			},
			selectWx2 (id) {
				this.changeBackground2 = id
				this.checkedKeys2 = []
				if (this.isFlag == 1) {
					if (!this.editFlag) {
						this.list[1].list.map(x => {
							if (x.id == id) {
								this.checkedKeys2 = x.list
							}
						})
					} else {
						if (this.list[1].list.length != 0 && this.tabType == 2) {
							this.list[1].list.map(y => {
								if (y.id == id) {
									this.checkedKeys2 = y.list.map(Number)
								}
							})
						}
					}
				} else {
					if (this.treeList[1].list.length != 0 && this.tabType == 2) {
						this.treeList[1].list.map(y => {
							if (y.id == id) {
								this.wechatTreeList2 = y.content
							}
						})
						if (this.wechatTreeList2) {
							if (this.wechatTreeList2.length == 0) {
								this.isEmpty = true
							} else {
								this.isEmpty = false
							}
						} else {
							this.isEmpty = true
						}
					}
				}
			},
			onCheck2 (e, val) {
				let checkId = val.node.eventKey
				//勾选的权限名
				let checkRoute = ''
				console.log(checkId, '企业微信')
				let arr = []
				let arr1 = []
				let arr3 = []
				let arr4 = []
				//arr存储checkId的该组的完整值
				const loop = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.id === key) {
							return callback(data, item2.route)
						} else {
							if (item2.children) {
								return loop(item2.children, key, callback)
							}
						}
					})
				}
				loop(this.wechatTreeList, checkId, (item, route) => {
					arr = item
					checkRoute = route
				})
				console.log(checkRoute, '企业微信checkRoute')
				if (arr.length > 0) {
					arr.map(x => {
						//arr4存储checkId的该组所有权限名的数组
						arr4.push(x.id)
						if (this.wechatTree.indexOf(x.route) != -1) {
							//arr1存储checkId的该组下需要联动勾选的权限名的数组
							arr1.push(x.route)
						}
					})
				}

				function uniqueArr (array) {
					var n = [];
					for (var i = 0; i < array.length; i++) {
						if (n.indexOf(array[i]) == -1) n.push(array[i]);
					}
					return n;
				}

				//e为勾选的权限的id，找出对应权限的权限名，保存在数组arr5中
				let arr5 = []
				const loop2 = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.route === key) {
							return callback(item2.id)
						} else {
							if (item2.children) {
								return loop2(item2.children, key, callback)
							}
						}
					})
				}
				arr1.map(x => {
					loop2(this.wechatTreeList, x, (item) => {
						arr5.push(item)
					})
				})

				let arr2 = e.concat(arr5)
				arr3 = uniqueArr(arr2)

				// console.log(arr, 'arr')
				// console.log(arr1, 'arr1')
				// console.log(arr2, 'arr2')
				// console.log(arr3, 'arr3')
				// console.log(arr4, 'arr4')


				//判断特殊情况，点击权限，获取需要联动的权限id
				let specialId = ''
				const loop3 = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.route === key) {
							return callback(item2.id)
						} else {
							if (item2.children) {
								return loop3(item2.children, key, callback)
							}
						}
					})
				}

				//是不是单独选取展示列表
				let intersection = arr3.filter(function (val) {
					return arr4.indexOf(val) > -1
				})

				if (intersection.length == 1 && intersection[0] == checkId && this.checkedKeys2.indexOf(checkId) != -1) {
					arr3.splice(arr3.indexOf(checkId), 1)
				} else if (intersection.length == 1 && intersection[0] == checkId && this.checkedKeys2.indexOf(checkId) == -1) {
					// arr3.push(checkId)
				} else {
					//渠道活码、客户标签、员工标签、客户群列表、自动拉群特殊情况
					if (checkRoute == 'channel-list' || checkRoute == 'channel-group-list' || checkRoute == 'client-tag-list' || checkRoute == 'client-tag-group' || checkRoute == 'work-tag-list' || checkRoute == 'work-tag-group' || checkRoute == 'groupList-list' || checkRoute == 'groupList-group' || checkRoute == 'groupAutoCreate-list' || checkRoute == 'groupAutoCreate-group' || checkRoute == 'sensitive-words-list' || checkRoute == 'sensitive-words-group-list') {
						if (this.checkedKeys2.indexOf(checkId) != -1) {
							arr4.map(x => {
								if (arr3.indexOf(x) != -1) {
									arr3.splice(arr3.indexOf(x), 1)
								}
							})
						}
					} else {
						if (this.wechatTree.indexOf(checkRoute) != -1) {
							arr3.splice(arr3.indexOf(checkId), 1)
							arr.map(x => {
								arr3.map((y, yIndex) => {
									if (x.id == y) {
										arr3.splice(yIndex, 1)
									}
								})
							})
						}
					}
				}
				this.checkedKeys2 = arr3

				//新裂变引流特殊情况
				if (checkRoute == 'wholeMarketFission-award') {
					loop3(this.wechatTreeList, 'wholeMarketFission-info', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'wholeMarketFission-info') {
					loop3(this.wechatTreeList, 'wholeMarketFission-list', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'wholeMarketFission-info') {
					loop3(this.wechatTreeList, 'wholeMarketFission-award', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) != -1) {
						this.checkedKeys2.splice(this.checkedKeys2.indexOf(specialId), 1)
					}
				}
				//裂变引流特殊情况
				if (checkRoute == 'fission-reward') {
					loop3(this.wechatTreeList, 'fission-part', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'fission-part') {
					loop3(this.wechatTreeList, 'fission-list', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'fission-part') {
					loop3(this.wechatTreeList, 'fission-reward', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) != -1) {
						this.checkedKeys2.splice(this.checkedKeys2.indexOf(specialId), 1)
					}
				}
				//抽奖引流特殊情况
				if (checkRoute == 'player-list' || checkRoute == 'record-destroy' || checkRoute == 'record-list') {
					loop3(this.wechatTreeList, 'raffle-part', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'raffle-part') {
					loop3(this.wechatTreeList, 'player-list', (id) => {
						if (this.checkedKeys2.indexOf(id) != -1) {
							this.checkedKeys2.splice(this.checkedKeys2.indexOf(id), 1)
						}
					})
					loop3(this.wechatTreeList, 'record-destroy', (id) => {
						if (this.checkedKeys2.indexOf(id) != -1) {
							this.checkedKeys2.splice(this.checkedKeys2.indexOf(id), 1)
						}
					})
					loop3(this.wechatTreeList, 'record-list', (id) => {
						if (this.checkedKeys2.indexOf(id) != -1) {
							this.checkedKeys2.splice(this.checkedKeys2.indexOf(id), 1)
						}
					})
				}
				if (checkRoute == 'record-destroy') {
					loop3(this.wechatTreeList, 'record-list', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'record-list') {
					loop3(this.wechatTreeList, 'record-destroy', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) != -1) {
						this.checkedKeys2.splice(this.checkedKeys2.indexOf(specialId), 1)
					}
				}
				//群打卡特殊情况
				if (checkRoute == 'groupClockIn-detail-list' || checkRoute == 'groupClockIn-detail-send') {
					loop3(this.wechatTreeList, 'groupClockIn-detail', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'groupClockIn-detail') {
					loop3(this.wechatTreeList, 'groupClockIn-list', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'groupClockIn-detail') {
					loop3(this.wechatTreeList, 'groupClockIn-detail-list', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) != -1) {
						this.checkedKeys2.splice(this.checkedKeys2.indexOf(specialId), 1)
					}
				}
				if (checkRoute == 'groupClockIn-detail') {
					loop3(this.wechatTreeList, 'groupClockIn-detail-send', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) != -1) {
						this.checkedKeys2.splice(this.checkedKeys2.indexOf(specialId), 1)
					}
				}
				//客户群-群详情特殊情况
				if (checkRoute == 'groupList-add-tag' || checkRoute == 'groupList-remove-tag' || checkRoute == 'groupList-addFollow' || checkRoute == 'groupList-editInfo') {
					loop3(this.wechatTreeList, 'groupList-info', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'groupList-info') {
					loop3(this.wechatTreeList, 'groupList-list', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) == -1) {
						this.checkedKeys2.push(specialId)
					}
				}
				if (checkRoute == 'groupList-info') {
					loop3(this.wechatTreeList, 'groupList-add-tag', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) != -1) {
						this.checkedKeys2.splice(this.checkedKeys2.indexOf(specialId), 1)
					}
				}
				if (checkRoute == 'groupList-info') {
					loop3(this.wechatTreeList, 'groupList-remove-tag', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) != -1) {
						this.checkedKeys2.splice(this.checkedKeys2.indexOf(specialId), 1)
					}
				}
				if (checkRoute == 'groupList-info') {
					loop3(this.wechatTreeList, 'groupList-addFollow', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) != -1) {
						this.checkedKeys2.splice(this.checkedKeys2.indexOf(specialId), 1)
					}
				}
				if (checkRoute == 'groupList-info') {
					loop3(this.wechatTreeList, 'groupList-editInfo', (id) => {
						specialId = id
					})
					if (this.checkedKeys2.indexOf(specialId) != -1) {
						this.checkedKeys2.splice(this.checkedKeys2.indexOf(specialId), 1)
					}
				}

				for (let i = 0; i < this.list[1].list.length; i++) {
					if (this.list[1].list[i].id == this.changeBackground2) {
						this.list[1].list[i].list = this.checkedKeys2
					}
				}
			},
			//公共模块
			onCheck3 (e, val) {
				let checkId = val.node.eventKey
				//勾选的权限名
				let checkRoute = ''
				console.log(checkId, '公共')
				let arr = []
				let arr1 = []
				let arr3 = []
				let arr4 = []
				//arr存储checkId的该组的完整值
				const loop = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.id === key) {
							return callback(data, item2.route)
						} else {
							if (item2.children) {
								return loop(item2.children, key, callback)
							}
						}
					})
				}
				loop(this.commonTreeList, checkId, (item, route) => {
					arr = item
					checkRoute = route
				})
				console.log(checkRoute, '公共模块checkRoute')
				if (arr.length > 0) {
					arr.map(x => {
						//arr4存储checkId的该组所有权限名的数组
						arr4.push(x.id)
						if (this.commonTree.indexOf(x.route) != -1) {
							//arr1存储checkId的该组下需要联动勾选的权限名的数组
							arr1.push(x.route)
						}
					})
				}

				function uniqueArr (array) {
					var n = [];
					for (var i = 0; i < array.length; i++) {
						if (n.indexOf(array[i]) == -1) n.push(array[i]);
					}
					return n;
				}

				//e为勾选的权限的id，找出对应权限的权限名，保存在数组arr5中
				let arr5 = []
				const loop2 = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.route === key) {
							return callback(item2.id)
						} else {
							if (item2.children) {
								return loop2(item2.children, key, callback)
							}
						}
					})
				}
				arr1.map(x => {
					loop2(this.commonTreeList, x, (item) => {
						arr5.push(item)
					})
				})

				let arr2 = e.concat(arr5)
				arr3 = uniqueArr(arr2)

				//判断特殊情况，点击权限，获取需要联动的权限id
				let specialId = ''
				const loop3 = (data, key, callback) => {
					data.forEach((item2) => {
						if (item2.route === key) {
							return callback(item2.id)
						} else {
							if (item2.children) {
								return loop3(item2.children, key, callback)
							}
						}
					})
				}

				//是不是单独选取展示列表
				let intersection = arr3.filter(function (val) {
					return arr4.indexOf(val) > -1
				})

				if (intersection.length == 1 && intersection[0] == checkId && this.checkedKeys3.indexOf(checkId) != -1) {
					arr3.splice(arr3.indexOf(checkId), 1)
				} else if (intersection.length == 1 && intersection[0] == checkId && this.checkedKeys3.indexOf(checkId) == -1) {
					// arr3.push(checkId)
				} else {
					//内容引擎特殊情况
					if (checkRoute == 'material-list' || checkRoute == 'content-list') {
						if (this.checkedKeys3.indexOf(checkId) != -1) {
							arr4.map(x => {
								if (arr3.indexOf(x) != -1) {
									arr3.splice(arr3.indexOf(x), 1)
								}
							})
						}
					} else {
						if (this.commonTree.indexOf(checkRoute) != -1) {
							arr3.splice(arr3.indexOf(checkId), 1)
							arr.map(x => {
								arr3.map((y, yIndex) => {
									if (x.id == y) {
										arr3.splice(yIndex, 1)
									}
								})
							})
						}
					}
				}
				this.checkedKeys3 = arr3

				this.list[2].list[0].list = this.checkedKeys3
			},
			//获取公众号列表
			async getWx () {
				const {data: res} = await axios.post(
					"wx-authorize-info/get-authrize-info",
					{
						uid: localStorage.getItem("uid"),
					}
				);
				if (res.error == 0) {
					this.wxInfo = res.data.info
					if (!this.changeBackground && this.wxInfo.length > 0) {
						this.changeBackground = this.wxInfo[0].id;
					}
					this.wxInfo.map(x => {
						this.list[0].list.wx.push({
							id  : Number(x.id),
							list: []
						})
					})
				} else {
					this.$message.error('获取公众号列表失败！')
				}
			},
			//获取小程序列表
			async getMini () {
				const {data: res} = await axios.post(
					"wx-authorize-info/get-authrize-info",
					{
						uid : localStorage.getItem("uid"),
						type: 1
					}
				);
				if (res.error == 0) {
					this.miniInfo = res.data.info
					if (!this.changeBackground4 && this.miniInfo.length > 0) {
						this.changeBackground4 = this.miniInfo[0].id;
					}
					this.miniInfo.map(x => {
						this.list[0].list.mini.push({
							id  : Number(x.id),
							list: []
						})
					})
				} else {
					this.$message.error('获取小程序列表失败！')
				}
			},
			//获取企业微信列表
			async getCorp () {
				const {data: res} = await axios.post(
					"work-corp/list",
					{
						uid: localStorage.getItem("uid"),
					}
				);
				if (res.error == 0) {
					this.wxInfo2 = res.data.info;
					if (!this.changeBackground2 && this.wxInfo2.length > 0) {
						this.changeBackground2 = this.wxInfo2[0].id;
						this.dataCorpId = this.wxInfo2[0].corpid;
					}
					this.list[3].list = []
					this.wxInfo2.map(x => {
						this.list[1].list.push({
							id  : Number(x.id),
							list: []
						})
						this.list[3].list.push({
							corp_id      : x.id,
							type         : [2],
							user_key     : [],
							department_id: [],
							checkedList  : [],
							chooseNum    : 0
						})
					})
				} else {
					this.$message.error('获取企业微信列表失败！')
				}
			},
			//数据可见范围
			selectWx5 (id, index) {
				this.dataCorpId = id
				this.chooseIndex = index
				this.getPartyList()
				if (this.isFlag == 1) {
					this.$refs.user.changeCorpId = id
					this.$refs.user.getDepartmentList()
				}
			},
			//类型选择
			chooseType (type, dataIndex) {
				if (type == 1) {
					//全员
					if (this.list[3].list[dataIndex].type.length > 0 && this.list[3].list[dataIndex].type.indexOf(1) > -1) {
						this.list[3].list[dataIndex].type = []
					} else {
						this.list[3].list[dataIndex].type = [1, 2]
						this.list[3].list[dataIndex].checkedList = []
						this.list[3].list[dataIndex].chooseNum = 0
						this.list[3].list[dataIndex].department_id = []
					}
				} else {
					Array.prototype.indexOf = function (val) {
						for (let i = 0; i < this.length; i++) {
							if (this[i] == val) return i;
						}
						return -1;
					};
					let i = this.list[3].list[dataIndex].type.indexOf(type)
					if (i > -1) {
						this.list[3].list[dataIndex].type.splice(i, 1)
						if(this.list[3].list[dataIndex].type.indexOf(3) > -1){
							this.list[3].list[dataIndex].type.splice(this.list[3].list[dataIndex].type.indexOf(3), 1)
						}
						this.list[3].list[dataIndex].department_id = []
						this.list[3].list[dataIndex].checkedList = []
						this.list[3].list[dataIndex].chooseNum = 0
						this.list[3].list[dataIndex].user_key = []
					} else {
						this.list[3].list[dataIndex].type.push(type)
					}
				}
			},
			// 获取部门列表
			async getPartyList () {
				const {data: res} = await this.axios.post('work-follow-msg/get-party-list', {
					suite_id: 1,
					corp_id : this.dataCorpId
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.partyList = res.data.party_list
				}
			},
			//部门成员选择弹窗组件
			showDepartmentList (dataIndex) {
				let arr = []
				this.list[3].list[dataIndex].checkedList.map(x => {
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.list[3].list[dataIndex].checkedList))
				this.chooseNum = this.list[3].list[dataIndex].chooseNum
				this.showModalDepartment = true
			},
			// 成员赋值
			modalVisibleChange (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					// this.checkedList = arr
					this.list[3].list[this.chooseIndex].department_id = []
					this.list[3].list[this.chooseIndex].user_key = []
					if(list.length > 0){
						list.map(x => {
							if (x.scopedSlots.title == 'title') {
								this.list[3].list[this.chooseIndex].department_id.push(x.id.replace('d-', ''))
							} else {
								this.list[3].list[this.chooseIndex].user_key.push(x.id)
							}
						})
					}
					this.list[3].list[this.chooseIndex].chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.list[3].list[this.chooseIndex].checkedList = JSON.parse(JSON.stringify(list))
				}
				this.showModalDepartment = false
			},
			//重置
			clearDepartmentList (dataIndex) {
				this.list[3].list[dataIndex].checkedList = []
				this.list[3].list[dataIndex].chooseNum = 0
				this.list[3].list[dataIndex].user_key = []
			},
		},

		created () {
			this.getSubAccountList();
			this.getWx()
			this.getMini()
			this.getCorp()
			this.getWxList()
			this.isMasterAccount = localStorage.getItem('isMasterAccount')
			this.sub_id = localStorage.getItem('sub_id')

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
		display: inline-block;
		margin-bottom: 0px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		display: block;
	}

	/deep/ .ant-form {
		padding: 0 20px;
	}

	/deep/ .ant-tabs-bar {
		padding: 0 20px !important;
		background: none !important;
		margin: 0 !important;
	}

	.bottom {
		position: absolute;
		left: 0;
		bottom: 5px;
		width: 100%;
		border-top: 1px solid #E9E9E9;
		padding: 10px 16px;
		background: #FFF;
		text-align: right;
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

	.sider-one {
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	.selectWx {
		height: 50px;
		line-height: 50px;
		cursor: pointer;
		padding-left: 10px;
		overflow: hidden;
	}

	.active {
		background: #01b065;
		color: white;
	}

	/deep/ .ant-tabs-nav .ant-tabs-tab {
		margin: 0 !important;
	}

	.wx-info {
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		top: 105px;
		bottom: 0;
		overflow: hidden;
		padding: 0 20px;
		overflow-y: auto;
	}

	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		text-align: left;
		margin: 12px 20px 20px;
	}

	.draw-loading, .draw-loading /deep/ .ant-spin-container {
		height: 100%;
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