<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<div style="padding: 0 20px;height: 50px; line-height: 50px; font-size: 16px; background-color: #FFFFFF;">
				门店管理
				<!--				<label v-if="isMasterAccount == 1" style="margin: 0 10px 0 20px;font-size: 15px;">门店状态</label> <a-switch v-if="isMasterAccount == 1" :checked="storeStatus == 1" @click="changeStoreStatus"></a-switch>-->
			</div>
			<div style="padding: 20px 0 0 20px;height: calc(100% - 50px);">
				<div class="content-msg">
					<p style="margin-bottom: 2px;">
						1、门店成员列表只显示具有外部联系人权限的人。</p>
					<p style="margin-bottom: 0px; color: #FF562D;">
						2、添加门店成员时，由于官方接口有一定的延迟，可能会导致门店码里的成员不能及时更新，和导购码不能下载，请手动刷新页面即可。</p>
				</div>
				<div>
					<div v-has="'storeList-staff-list'" @click="changeTab(1)" class="tabBtn"
					     :class="storeType == 0 ? '' : 'activeBtn'">
						门店成员
					</div>
					<div v-has="'storeList-manage-list'" @click="changeTab(0)" class="tabBtn"
					     :class="storeType == 0 ? 'activeBtn' : ''">
						门店管理
					</div>
				</div>
				<a-layout v-has="'storeList-manage-list'" v-show="storeType == 0"
				          style="position: relative; height: calc(100% - 125px);">
					<!-- 左侧 -->
					<a-layout-sider>
						<!-- 公众号 -->
						<storeTeam :key="storeType" ref="group" @changeGroupId="modalVisibleChange"></storeTeam>
					</a-layout-sider>
					<a-layout
							style="position: absolute;left:250px;top:0;bottom:0;right:0;overflow-x: hidden; overflow-y: auto;"
							class="scroll">
						<!-- 内容 -->
						<a-layout-content>
							<div class="content-hd">
								<a-select
										optionFilterProp="children"
										style="width: 200px;margin-bottom: 20px;"
										v-model="status"
								>
									<a-select-option :value="''">全部状态</a-select-option>
									<a-select-option :value="'1'">开启</a-select-option>
									<a-select-option :value="'0'">关闭</a-select-option>
								</a-select>
								<a-input style="width: 240px; margin-left: 10px;" placeholder="请输入门店名称或地址进行查找"
								         v-model="searchName"/>
								<a-button style="margin-left: 10px" type="primary" @click="findStore">
									查找
								</a-button>
								<a-button style="margin-left: 10px" @click="clearFind">
									清空
								</a-button>
								<div class="content-hd-right">
									<a-button style="margin-right: 10px;" icon="reload" @click="syncFollowUser">
										同步配置了外部联系权限的联系人
									</a-button>
									<a-button v-has="'storeList-manage-import'" type="primary"
									          style="margin-right: 10px;" @click="importExcel">
										本地导入
									</a-button>
									<a-button v-has="'storeList-manage-import'" icon="plus" type="primary"
									          @click="addStore">
										创建门店
									</a-button>
								</div>
							</div>
							<div style="height: 38px;">
								共有
								<span style="color: blue">{{total}}</span>个
							</div>
							<!-- 表格部分 -->
							<div class="content-bd">
								<a-spin tip="Loading..." size="large" :spinning="isLoading">
									<div class="spin-content">
										<a-table :columns="columns" :dataSource="storeList" :pagination="false"
										         :rowClassName="rowClassName">
											<span slot="name">
												所属分组
												<a-popover placement="bottom">
								                    <template slot="content">
								                        <span>当存在多级分组时，只显示门店的一级分组+当前门店所在的分组。</span>
								                    </template>
								                    <a-icon type="question-circle" style="margin-left:5px;"/>
												</a-popover>
											</span>
											<span slot="user_count">
												员工数量
												<a-popover placement="bottom">
								                    <template slot="content">
								                        <span>只显示具有外部联系人权限的成员数量。</span>
								                    </template>
								                    <a-icon type="question-circle" style="margin-left:5px;"/>
												</a-popover>
											</span>
											<span slot="user_add">
												今日新增/累计新增客户
												<a-popover placement="bottom">
								                    <template slot="content">
									                    <div style="max-width: 500px;">
									                        <p style="margin-bottom: 10px; line-height: 25px;">今日新增客户：通过门店码或导购码，仅计入今日该门店添加的全新客户，即门店成员尚未添加过该客户，（不含删除后再添加）；且同一门店不同成员，添加同一个客户，只计入新增1人。</p>
									                        <p style="margin-bottom: 0px; line-height: 25px;">累计新增客户： 通过门店码或导购码，累计该门店添加的客户。该门店员工反复添加同一个客户，只计入1人；且同一门店不同成员，添加同一个客户，只计入1人。</p>
									                    </div>
								                    </template>
								                    <a-icon type="question-circle" style="margin-left:5px;"/>
												</a-popover>
											</span>
											<span slot="user_del">
												今日流失/累计流失客户
												<a-popover placement="bottom">
								                    <template slot="content">
									                    <div style="max-width: 500px;">
									                        <p style="margin-bottom: 10px; line-height: 25px;">今日流失客户：通过门店码或导购码，员工添加客户后，在今日客户删除员工/员工删除客户的客户人数。若同一门店不同员工，添加同一个客户，仅是其中一个员工和客户解除好友关系，不计入流失客户数，只有全部解除后，才计入。</p>
									                        <p style="margin-bottom: 0px; line-height: 25px;">累计流失客户：通过门店码或导购码，员工添加客户后，累计客户删除员工/员工删除客户的客户人数。若同一门店不同员工，添加同一个客户，仅是其中一个员工和客户解除好友关系，不计入流失客户数，只有全部解除后，才计入。</p>
									                    </div>
								                    </template>
								                    <a-icon type="question-circle" style="margin-left:5px;"/>
												</a-popover>
											</span>
											<span slot="select" slot-scope="text, record, index">
												<a-checkbox style="float: right"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.id)"></a-checkbox>
											</span>
											<span slot="province" slot-scope="text, record">
												{{record.province}}-{{record.city}}-{{record.district}}
											</span>
											<span slot="status" slot-scope="text, record">
												<a-switch :checked="record.status == 1" :disabled="disableOpen"
												          @click="changeStore(record.id, record.status, record.shop_name)"/>
											</span>
											<span slot="userAdd" slot-scope="text, record">
												{{record.user_add_now}} / {{record.user_add_all}}
							                </span>
											<span slot="userDel" slot-scope="text, record">
												{{record.user_del_now}} / {{record.user_del_all}}
							                </span>
											<span slot="action" slot-scope="text, record">
												<div style="display: inline-block">
													<a-button v-has="'storeList-staff-add'" style="margin: 3px;"
													          v-if="record.status == 1" @click="addEmployee(record.id)">添加员工</a-button>
												</div>
												<div style="display: inline-block">
													<a-button v-has="'storeList-manage-downLoad'" style="margin: 3px;"
													          v-if="record.qc_url"
													          @click="qrLoad(record.qc_url)">门店码下载</a-button>
												</div>
												<div style="display: inline-block">
													<a-button v-has="'storeList-manage-edit'" style="margin: 3px;"
													          @click="editStore(record)">编辑</a-button>
												</div>
												<div style="display: inline-block">
													<a-button v-has="'storeList-manage-del'" style="margin: 3px;"
													          @click="delStore(record.id, record.shop_name)">删除</a-button>
												</div>
							                </span>
										</a-table>
									</div>
								</a-spin>
							</div>
							<!-- 分页 -->
							<div class="pagination" style="margin: 20px auto;padding-bottom: 20px; height: 52px;"
							     v-show="total > 0">
								<div style="height: 32px;float: left;line-height: 32px;margin-left: 10px;">
									<a-checkbox v-model="batchTypeValue"
									            @click="batchTypeChange"></a-checkbox>
									<a-select optionFilterProp="children"
									          v-model="batchType"
									          @change="changeBatchType"
									          style="width: 150px; margin: 0 5px;">
										<a-select-option value="0">选择当前页</a-select-option>
										<a-select-option value="1">选择所有</a-select-option>
									</a-select>
									<a-button v-has="'storeList-manage-status'" class="btn-primary" icon="unlock"
									          :disabled="selectedRowKeys.length == 0"
									          @click="releaseFollow" type="primary">
										批量开启
									</a-button>
									<a-button v-has="'storeList-manage-status'" class="btn-primary" icon="lock"
									          :disabled="selectedRowKeys.length == 0"
									          @click="failure" type="primary">
										批量关闭
									</a-button>
								</div>
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total" showSizeChanger
									              :showQuickJumper="quickJumper"
									              :current="page"
									              :pageSize="pageSize"
									              :pageSizeOptions="['15','30','50','100']"
									              @change="changePage"
									              @showSizeChange="showSizeChange"/>
								</div>
							</div>
						</a-layout-content>
					</a-layout>
				</a-layout>
				<a-layout v-has="'storeList-staff-list'" v-show="storeType == 1"
				          style="position: relative; height: calc(100% - 125px);">
					<!-- 左侧 -->
					<a-layout-sider>
						<storeTeam :key="storeType" ref="userGroup" :storeType="storeType"
						           @changeGroupId="modalVisibleChange"></storeTeam>
					</a-layout-sider>
					<a-layout
							style="position: absolute;left:250px;top:0;bottom:0;right:0;overflow-x: hidden; overflow-y: auto;"
							class="scroll">
						<!-- 内容 -->
						<a-layout-content>
							<div class="content-hd">
								<a-input style="width: 240px;" placeholder="请输入名称或手机号进行查找"
								         v-model="searchName1"/>
								<a-button style="margin-left: 10px" type="primary" @click="findUser">
									查找
								</a-button>
								<a-button style="margin-left: 10px" @click="clear">
									清空
								</a-button>
								<div class="content-hd-right">
									<a-button style="margin-right: 10px;" icon="reload" @click="syncFollowUser">
										同步配置了外部联系权限的联系人
									</a-button>
									<a-button v-has="'storeList-staff-add'" icon="plus" type="primary" @click="addUser">
										添加门店成员
									</a-button>
								</div>
							</div>
							<div style="height: 38px;">
								共有
								<span style="color: blue">{{total1}}</span>个
							</div>
							<!-- 表格部分 -->
							<div class="content-bd">
								<a-spin tip="Loading..." size="large" :spinning="isLoading">
									<div class="spin-content">
										<a-table :columns="columns1" :dataSource="userList" :pagination="false"
										         :rowClassName="rowClassName">
											<span slot="userInfo" slot-scope="text, record">
												<a-avatar v-if="record.avatar" shape="square" :src="record.avatar"
												          style="float: left;"/>
												<img style="width: 32px;height: 32px;float: left;"
												     v-if="!record.avatar" src="../../../assets/useradvart.png"/>
												<div style="max-width: 300px;word-wrap:break-word;display: inline-block;line-height: 32px;">
													<a-popover placement="top">
														<span slot="content">
															{{record.name}}<span v-if="record.department_name">-</span>{{record.department_name}}
														</span>
														<p style="cursor: pointer; display: inline-block; margin-left: 10px;max-width: 170px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-bottom: 0px;">
															{{record.name}}<span v-if="record.department_name">-</span>{{record.department_name}}
														</p>
													</a-popover>
												</div>
												<span style="display: inline-block; line-height: 32px; vertical-align: top">
													<a-icon slot="prefix" type="man"
													        style="margin-left: 10px;color: #427EBA;"
													        v-if="record.gender==1"/>
													<a-icon
															slot="prefix"
															type="woman"
															style="margin-left: 10px;color: #ED4997;"
															v-if="record.gender==2"
													/>
												</span>
												<div v-if="record.is_external != 1"
												     style="color: #E6A500;">外部联系人权限被取消</div>
											</span>
											<span slot="action" slot-scope="text, record">
												<a-button v-has="'storeList-staff-downLoad'" style="margin: 3px;"
												          v-if="record.qc_url && record.is_external == 1"
												          @click="qrLoad(record.qc_url)">导购码下载</a-button>
												<a-button v-has="'storeList-staff-transfer'" style="margin: 3px;"
												          v-if="record.is_external == 1"
												          @click="changeUser(record.id, record.store_id, record.user_id, record.name, record.shop_name)">转移门店</a-button>
												<a-button v-has="'storeList-staff-remove'" style="margin: 3px;"
												          @click="deleteOneUser(record.id, record.store_id, record.user_id, record.name, record.shop_name)">移除成员</a-button>
							                </span>
										</a-table>
									</div>
								</a-spin>
							</div>
							<!-- 分页 -->
							<div class="pagination" style="margin: 20px auto; padding-bottom: 20px; height: 52px;"
							     v-show="total1 > 0">
								<div class="pagination" style="height: 32px;float: right;">
									<a-pagination :total="total1" showSizeChanger
									              :showQuickJumper="quickJumper"
									              :current="page1"
									              :pageSize="pageSize1"
									              :pageSizeOptions="['15','30','50','100']"
									              @change="changePage1"
									              @showSizeChange="showSizeChange1"/>
								</div>
							</div>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</div>
		</div>
		<a-modal v-model="visible" width="888px!important" :title="title" @cancel="cancelUpdate">
			<template slot="footer">
				<a-button key="back" @click="cancelUpdate">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading"
						@click="updateStore"
				>提交
				</a-button>
			</template>
			<a-form>
				<a-form-item label="门店名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
					<a-input placeholder="请输入门店名称"
					         v-model="storeName" :maxLength="30">
						<span slot="suffix">
							<span>{{storeName.length}}</span>/30
						</span>
					</a-input>
					<div style="color: #FF562D;">提交后过滤空格</div>
				</a-form-item>
				<a-form-item label="所属分组" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
					<a-button @click="selectGroup" type="link">{{storeGroup.title || '选择分组'}}</a-button>
				</a-form-item>
				<a-form-item label="门店地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
					<div>{{addressName}}</div>
					<a-select
							show-search
							v-model="index"
							style="margin: 10px 0;"
							placeholder="请输入关键词进行搜索"
							:default-active-first-option="false"
							:show-arrow="false"
							:filter-option="false"
							:not-found-content="addrLoading ? undefined : null"
							@search="handleSearch"
							@change="handleChange"
							@popupScroll="popScroll"
					>
						<a-spin v-if="addrLoading" slot="notFoundContent" size="small"/>
						<a-select-option v-for="(addr,index) in address" :key="index">
							{{addr.title}}
							<span style="margin-left: 10px;color: #E2E2E2">
								<template v-if="addr.province">
									{{addr.province}}
								</template>
								<template v-if="addr.province && addr.city">
									-{{addr.city}}
								</template>
								<template v-if="addr.province && addr.city && addr.district">
									-{{addr.district}}
								</template>
							</span>
						</a-select-option>
					</a-select>
					<div id="map"></div>
				</a-form-item>
			</a-form>
		</a-modal>
		<remote-js
				:src="'https://map.qq.com/api/gljs?libraries=tools&v=1.exp&key=' + this.$store.state.txMapKey"></remote-js>
		<group :groupVisible="groupVisible" :store="storeGroup"
		       @changeGroupId="changeGroupId"></group>
		<!-- 上传表格弹窗 -->
		<a-modal
				title="上传表格"
				v-model="upLoadShowModal"
				@cancel="upLoadHandleCancel"
				@ok="upLoadHandleOk"
				width="750px"
				:confirmLoading="modalLoading">
			<div style="padding: 10px 0px;overflow: auto;">
				<div style="color:red;">下载导入模板，填写门店相关信息后导入，可以快捷录入门店信息。为了避免导入时出现等待时间过长，建议单次上传不超过2000条，最多可支持3000条。</div>
				<!-- 选择表格 -->
				<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
					<span slot="label">
	                    <span style="color: red;"> * </span>选择表格
	                </span>
					<a-upload
							name="avatar"
							:showUploadList="false"
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							:beforeUpload="beforeUpload"
					>
						<a-button type="primary"
						          style="height: 28px;font-size: 14px;">上传Excel
						</a-button>
					</a-upload>
					<template v-if="file_name != ''">
						<span style="margin-left: 5px;">{{file_name}}</span>
						<a-icon type="close-circle" style="vertical-align: text-top;margin-left: 3px;"
						        @click="closeExcel"/>
					</template>
					<div style="line-height: normal;margin-bottom: 5px;color: #999;">
						1、<a :href="$store.state.commonUrl+'/upload/门店default.xlsx'">下载导入模板</a>
						。根据模板填写门店名称、门店地址、分组名称，<span style="color: #FF562D;">提交后过滤空格。</span>
					</div>
					<div style="line-height: normal;margin-bottom: 5px;color: #999;">
						2、门店地址请按照「xxx省xxx市xxx区」格式填写详细地址，以便系统录入。
					</div>
					<div style="line-height: normal;margin-bottom: 20px;color: #999;">
						3、若导入的门店（名称和门店地址），已存在系统中，或者填写的分组名称，在系统中不存在，这些门店数据系统将自动过滤。
					</div>
				</a-form-item>
			</div>
		</a-modal>

		<!-- 上传进度条弹窗 -->
		<a-modal v-model="progressVisible" title="上传进度" :footer="false" @cancel="cancelProgress"
		         :closable="progressFlag" :maskClosable="false"
		         :maskStyle="{'left':leftSiderWidth}" :wrapClassName="'mask-dialog'">
			<div style="text-align: center;">
				<a-progress stroke-linecap="square" :percent="progressNum" type="circle"/>
				<div v-if="progressNum != 100">
					<img src="../../../assets/loadingGif.gif" alt="">
				</div>
				<p v-if="failNum > 0" style="margin: 0 auto 20px;">{{failMsg}}</p>
			</div>
		</a-modal>
		<!--  添加门店成员  -->
		<a-modal width="666px!important" v-model="userVisible" :title="userTitle" @cancel="cancelUser">
			<template slot="footer">
				<a-button key="back" @click="cancelUser">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading"
						@click="updateUser"
				>提交
				</a-button>
			</template>
			<a-form>
				<a-form-item :label="transfer == 1 ? '成员名称' : '选择成员'" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 20 }">
					<a-button v-if="transfer == 0" type="link" @click="showDepartmentList">
						<template v-if="chooseNum == 0" type="link">选择成员</template>
						<template
								v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseNum - chooseUserNum}}个部门
						</template>
					</a-button>
					<a v-if="transfer == 0" style="margin-left: 10px;" v-show="chooseNum > 0"
					   @click="clearDepartmentList">
						重置
					</a>
					<span>{{userName}}</span>
				</a-form-item>
				<a-form-item label="选择门店" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
					<template v-if="storeIds.length == 0">
						<a-button @click="showStoreModal" type="link">
							选择门店
						</a-button>
					</template>
					<template v-if="storeIds.length > 0">
						<a-popover placement="right">
							<span slot="content">
								<div style="max-width: 375px;">
									<a-tag color="orange" v-for="item in storeDetail"
									       style="display: inline-block; margin: 0 10px 5px 0;">
										{{item.title}}
									</a-tag>
								</div>
							</span>
							<a-button @click="showStoreModal" type="link">
								已选择{{storeIds.length}}个门店
							</a-button>
						</a-popover>
					</template>
					<a style="margin-left: 10px;" v-show="storeIds.length > 0"
					   @click="clearStoreList">
						重置
					</a>
				</a-form-item>
			</a-form>
		</a-modal>
		<!--部门选择框-->
		<chooseDepartment ref="user" :show="showModalDepartment"
		                  :chooseNum="chooseNum" :is_external="1"
		                  :is_from="7"
		                  :callback="modalVisibleChange3"
		                  noticeTitle="只显示具有外部联系人权限的成员"></chooseDepartment>
		<store-list :groupVisible="storeVisible" :storeIds="JSON.parse(JSON.stringify(storeIds))"
		            :storeDetail="JSON.parse(JSON.stringify(storeDetail))"
		            @setGroupId="setGroupId"></store-list>
	</div>
</template>
<script>
	import storeTeam from "./Team.vue";
	import group from "../../../components/storeGroup/Index"
	import remoteJs from '../../../components/remote-js.vue'
	import {jsonp} from 'vue-jsonp'
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import storeList from '../../../components/storeGroup/CheckboxIndex'

	const columns = [
		{
			title      : "",
			key        : 'select',
			scopedSlots: {customRender: 'select'},
		},
		// {
		// 	title    : "门店ID",
		// 	dataIndex: "id",
		// 	key      : "id"
		// },
		{
			title    : "门店名称",
			dataIndex: "shop_name",
			key      : "shop_name",
			width    : '180px'
		},
		{
			title      : "所属区域",
			dataIndex  : "province",
			key        : "province",
			width      : '180px',
			scopedSlots: {customRender: 'province'},
		},
		{
			title    : "门店地址",
			dataIndex: "address",
			key      : "address",
			width    : '180px'
		},
		{
			// title    : "所属分组",
			dataIndex  : "name",
			key        : "name",
			scopedSlots: {title: 'name'}
		},
		{
			title      : "门店状态",
			dataIndex  : "status",
			key        : "status",
			scopedSlots: {customRender: 'status'},
		},
		{
			// title    : "员工数量",
			dataIndex  : "user_count",
			key        : "user_count",
			scopedSlots: {title: 'user_count'}
		},
		{
			// title      : "今日新增客户/累计新增客户",
			dataIndex  : "userAdd",
			key        : "userAdd",
			scopedSlots: {customRender: 'userAdd', title: 'user_add'}
		},
		{
			// title      : "今日流失客户/累计流失客户",
			dataIndex  : "userDel",
			key        : "userDel",
			scopedSlots: {customRender: 'userDel', title: 'user_del'}
		},
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '200px',
			scopedSlots: {customRender: "action"}
		}
	];
	const columns1 = [
		{
			title      : "成员列表",
			dataIndex  : "userInfo",
			key        : "userInfo",
			scopedSlots: {customRender: 'userInfo'},
		},
		{
			title    : "手机号",
			dataIndex: "mobile",
			key      : "mobile",
		},
		{
			title    : "所属门店",
			dataIndex: "shop_name",
			key      : "shop_name"
		},
		// {
		// 	title    : "角色",
		// 	dataIndex: "address",
		// 	key      : "address",
		// },
		// {
		// 	title    : "数据可见范围",
		// 	dataIndex: "name",
		// 	key      : "name"
		// },
		{
			title      : "操作",
			dataIndex  : "action",
			key        : "action",
			width      : '350px',
			scopedSlots: {customRender: "action"}
		}
	];
	export default {
		components: {remoteJs, storeTeam, group, chooseDepartment, storeList},
		data () {
			return {
				storeStatus        : '',
				isMasterAccount    : localStorage.getItem('isMasterAccount'),
				disableOpen        : false,
				storeType          : 1, // 0 门店管理 1 成员管理
				corpId             : '',//企业微信选中的id
				suite_id           : '',//应用ID
				type               : '',//0客户管理标签,1通讯录成员标签
				groupId            : '',//选中的分组
				status             : '', // 门店状态搜索
				searchName         : '',  // 门店名搜索
				storeList          : [], //表格信息
				isLoading          : true, //Loading 组件显示与隐藏
				//表格部分
				columns,
				columns1,
				//分页
				total              : 0, //总条数
				quickJumper        : false, // 是否显示快速跳转的控件
				page               : 1, //页码
				pageSize           : 15, //每页数据条数
				selectedRowKeys    : [], // 多选ids
				checkBoxValue      : [], // 门店选择框
				batchType          : '0', //0当前页 1所有
				batchTypeValue     : false, //当前页/所有 是否选中
				visible            : false, // 门店弹窗是否显示
				title              : '创建门店', // 门店弹窗标题
				loading            : false, // 门店弹窗提交按钮loading
				storeName          : '', // 门店名
				// 门店所属分组
				storeGroup         : {
					id   : '',
					title: '',
				},
				groupVisible       : false,
				map                : null, // 地图对象
				infoWindow         : null, // 地图信息弹窗对象
				marker             : null, // 地图的点标注对象
				editId             : '', // 编辑门店的id
				// 经纬度
				lat                : 31.832473286033732,
				lng                : 117.21106041882322,
				index              : [], // 位置搜索选择的index
				address            : [], // 位置搜索的列表
				addressName        : '', // 位置选择的地址名
				name               : '',
				addrLoading        : false, // 位置搜索下拉加载loading
				searchInter        : 0, // 位置搜索定时器id
				key                : this.$store.state.txMapKey,
				//上传表格
				upLoadShowModal    : false,//弹窗的显示与隐藏
				modalLoading       : false,//弹窗确认键的加载
				fileInfo           : {}, //上传excel的文件信息
				file_name          : '', //上传excel的名称
				tag_arr3           : [], //标签值
				//上传进度条弹窗
				progressVisible    : false,//进度条弹窗显示与隐藏
				progressNum        : 0,//进度条进度
				leftSiderWidth     : document.getElementsByClassName('menu-sider')[0].style.width,
				successNum         : 0,//成功上传人数
				failMsg            : '', // 失败原因
				failNum            : 0,//失败上传人数
				notImportNum       : 0,//待上传人数
				userList           : [], // 成员列表
				searchName1        : '', // 名称搜索
				total1             : 0, // 成员总条数
				page1              : 1, // 成员列表页码
				pageSize1          : 15, //成员列表每页数据条数
				progressFlag       : false, // 上传进度弹窗是否允许关闭
				userVisible        : false, // 添加成员
				userTitle          : '添加门店成员',
				transfer           : 0, // 1、转移门店 0、添加、移除成员
				userName           : '', // 转移门店的成员名
				editIds            : [], // 转移成员ids
				checkedList        : [], // 选择的成员列表
				storeAdd           : 0, // 是否添加员工
				storeIds           : [], // 选择的门店列表
				storeDetail        : [], // 选择门店弹窗的数据
				storeVisible       : false, // 选择门店弹窗显示
				showModalDepartment: false, // 选择成员弹窗显示
				chooseNum          : 0, // 选择成员成员+部门数量
				chooseUserNum      : 0, // 选择成员数量
			};
		},
		methods   : {
			changeTab (key) {
				this.storeType = key
			},
			//同步配置了外部联系权限的联系人
			async syncFollowUser () {
				this.selectedRowKeys = []
				this.isLoading = true
				this.$message.info("已进入后台刷新中，请耐心等待...");
				const {data: res} = await this.axios.post('work-follow-user/refresh-follow-user', {
					suite_id: 1,
					corp_id : this.corpId,
					from    : 1
				})

				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg)
					this.isLoading = false
				} else {
					this.$message.destroy()
					this.$message.success("同步完成！");
					if (this.storeType == 0) {
						this.getStoreList();
					} else {
						this.getUserList();
					}
				}
			},
			// 添加门店
			async addStore () {
				this.id = ''
				let that = this
				const result = await jsonp("https://apis.map.qq.com/ws/location/v1/ip?&key=" + this.key + "&get_poi=1&output=jsonp")
				if (result.status != 0) {
					this.$message.destroy()
					this.$message.error(result.error_msg)
				} else {
					this.lat = result.result.location.lat
					this.lng = result.result.location.lng
					this.visible = true
					let interMap = setInterval(async function () {
						if (typeof TMap != "undefined") {
							clearInterval(interMap)
							that.initMap()
							const res = await jsonp("https://apis.map.qq.com/ws/geocoder/v1/?location=" + that.lat + "," + that.lng + "&key=MIWBZ-ECBCD-RSK4W-PCPUC-G6ETT-MMFLL&get_poi=1&output=jsonp")
							if (res.status == 0) {
								let center = new TMap.LatLng(that.lat, that.lng)
								that.initMakert(center)
								that.addressName = res.result.address + ' - ' + (res.result.formatted_addresses.recommend || res.result.formatted_addresses.rough)
								that.initInfoWindow(center, '<div style="height: 20px">' + res.result.address + '</div><div style="height: 30px">' + (res.result.formatted_addresses.recommend || res.result.formatted_addresses.rough) + '</div>')
							} else {
								that.addressName = ''
							}
						}

					})

				}
			},
			// 编辑门店
			editStore (item) {
				this.storeGroup = {
					id   : item.group_id,
					title: item.name
				}
				this.storeName = item.shop_name
				this.lat = item.lat
				this.lng = item.lng
				this.editId = item.id

				this.addressName = item.address
				this.visible = true
				let that = this
				let interMap = setInterval(async function () {
					if (TMap) {
						let center = new TMap.LatLng(that.lat, that.lng)
						clearInterval(interMap)
						that.initMap(that.initMakertAndInfo)
					}
				})
			},
			// 编辑时初始化地图点标注和信息弹窗
			initMakertAndInfo (center) {
				this.initMakert(center)
				this.initInfoWindow(center, '<div style="height: 30px">' + this.addressName + '</div>')
			},
			// 初始化地图
			initMap (callback) {
				let that = this
				this.$nextTick(() => {
					let center = new TMap.LatLng(that.lat, that.lng)
					// 定义map变量，调用 TMap.Map() 构造函数创建地图
					that.map = new TMap.Map(document.getElementById('map'), {
						zoom  : 17.2,   //设置地图缩放级别
						pitch : 43.5,  //设置俯仰角
						center: center//设置地图中心点坐标
					});
					if (typeof callback == 'function') {
						callback(center)
					}
					that.map.on("click", async function (evt) {
						if (evt.poi && evt.poi.name) {
							that.lat = evt.latLng.getLat()
							that.lng = evt.latLng.getLng()
							that.initMakert(evt.latLng)
							const result = await jsonp("https://apis.map.qq.com/ws/geocoder/v1/?location=" + that.lat + "," + that.lng + "&key=MIWBZ-ECBCD-RSK4W-PCPUC-G6ETT-MMFLL&get_poi=1&output=jsonp")
							if (result.status == 0) {
								that.addressName = result.result.address + ' - ' + evt.poi.name
								that.initInfoWindow(evt.latLng, '<div style="height: 20px">' + result.result.address + '</div><div style="height: 30px">' + evt.poi.name + '</div>')
							} else {
								that.addressName = evt.poi.name
								that.initInfoWindow(evt.latLng, evt.poi.name)
							}
						}
					})
				})
			},
			// 地图点标注
			initMakert (latLng) {
				let that = this
				if (that.marker) {
					that.marker.setMap(null);
					that.marker = null;
					let inter = setInterval(function () {
						if (!that.marker) {
							clearInterval(inter)
							that.marker = new TMap.MultiMarker({
								id        : "marker-layer", //图层id
								map       : that.map,
								styles    : { //点标注的相关样式
									marker: new TMap.MarkerStyle({
										width : 25,
										height: 35,
										anchor: {x: 10, y: 32},
										src   : "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/marker-pink.png"
									})
								},
								geometries: [{ //点标注数据数组
									id        : "demo",
									styleId   : "marker",
									position  : latLng,
									properties: {
										title: "marker"
									}
								}]
							});
							that.marker.on("click", function (evt) {
								that.infoWindow.open(); //打开信息窗
							})
						}
					}, 100)
				} else {
					that.marker = new TMap.MultiMarker({
						id        : "marker-layer", //图层id
						map       : that.map,
						styles    : { //点标注的相关样式
							marker: new TMap.MarkerStyle({
								width : 25,
								height: 35,
								anchor: {x: 10, y: 32},
								src   : "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/marker-pink.png"
							})
						},
						geometries: [{ //点标注数据数组
							id        : "demo",
							styleId   : "marker",
							position  : latLng,
							properties: {
								title: "marker"
							}
						}]
					});
					that.marker.on("click", function (evt) {
						that.initInfoWindow(evt.latLng)
					})
				}
			},
			// 地图信息弹窗
			initInfoWindow (latLng, name) {
				let that = this
				if (that.infoWindow) {
					that.infoWindow.open();
					that.infoWindow.setPosition(latLng);//设置信息窗位置
					that.infoWindow.setContent(name);//设置信息窗内容
				} else {
					that.infoWindow = new TMap.InfoWindow({
						content : name, //信息窗口内容
						position: latLng,//显示信息窗口的坐标
						map     : that.map,
						offset  : {x: 10, y: -25}, //向上偏移35像素坐标，向左偏移3像素坐标
					});
				}
			},
			// 门店弹窗关闭
			cancelUpdate () {
				this.visible = false
				this.storeName = ''
				this.addressName = ''
				this.editId = ''
				this.storeGroup = {
					id   : '',
					title: '',
				}
				this.marker.setMap(null);
				this.marker = null;
				this.infoWindow.setMap(null)
				this.infoWindow = null
				this.map.destroy()
				document.getElementById('map').innerText = ''
			},
			// 门店弹窗提交
			async updateStore () {
				this.loading = true
				if (this.storeName.trim() == '') {
					this.loading = false
					this.$message.destroy()
					this.$message.warning('请填写门店名称')
					return false
				} else if (this.storeGroup.id == '') {
					this.loading = false
					this.$message.destroy()
					this.$message.warning('请选择门店分组')
					return false
				}
				const {data: res} = await this.axios.post("auth-store/add-store", {
					id       : this.editId,
					corp_id  : this.corpId,
					group_id : this.storeGroup.id,
					shop_name: this.storeName,
					address  : this.addressName,
					uid      : localStorage.getItem('uid'),
					lat      : this.lat,
					lng      : this.lng,
				});
				if (res.error != 0) {
					this.loading = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.loading = false
					this.cancelUpdate()
					this.$refs.group.updateCount(res.old_pid, res.new_pid)
					this.getStoreList()

				}
			},
			// 选择分组
			selectGroup () {
				this.visible = false
				this.groupVisible = true
			},
			// 切换所属分组
			changeGroupId (event, id, title) {
				if (event == 'ok') {
					this.storeGroup = {
						id   : id,
						title: title,
					}
				}
				this.visible = true
				this.groupVisible = false
			},
			// 位置关键词搜索
			handleSearch (value) {
				this.name = value
				this.index = []
				let that = this
				if (this.searchInter) {
					clearTimeout(this.searchInter)
				}
				this.searchInter = setTimeout(async function () {
					that.getAddressList()
				}, 500)
			},
			// 获取关键词搜索位置列表
			async getAddressList (page = 1) {
				if (!this.name && this.name !== '0') {
					return false
				}
				this.addrLoading = true
				const result = await jsonp("https://apis.map.qq.com/ws/place/v1/suggestion?keyword=" + this.name + "&page_size=15&page_index=" + page + "&key=MIWBZ-ECBCD-RSK4W-PCPUC-G6ETT-MMFLL&get_poi=1&output=jsonp")
				if (result.status == 0) {
					if (page == 1) {
						this.address = result.data
					} else {
						this.address = this.address.concat(result.data)
					}
					this.count = result.count
					this.page = page
					this.addrLoading = false
				} else {
					this.addrLoading = false
					this.$message.destroy()
					this.$message.error(result.error_msg)
				}
			},
			// 关键词搜索下拉框下拉事件
			popScroll (e) {
				let target = e.target
				if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
					//到底了，加载下一页
					if (this.address.length < this.count) {
						this.getAddressList(this.page + 1)
					}
				}
			},
			// 关键词搜素选择位置
			async handleChange (index) {
				let addr = this.address[index]
				this.lat = addr.location.lat
				this.lng = addr.location.lng
				let center = new TMap.LatLng(this.lat, this.lng)
				this.initMakert(center)
				const result = await jsonp("https://apis.map.qq.com/ws/geocoder/v1/?location=" + this.lat + "," + this.lng + "&key=MIWBZ-ECBCD-RSK4W-PCPUC-G6ETT-MMFLL&get_poi=1&output=jsonp")
				if (result.status == 0) {
					this.addressName = result.result.address + ' - ' + (result.result.formatted_addresses.recommend || result.result.formatted_addresses.rough)
					this.initInfoWindow(center, '<div style="height: 30px">' + result.result.address + '</div><div style="height: 30px">' + (result.result.formatted_addresses.recommend || result.result.formatted_addresses.rough) + '</div>')
				}
				this.map.setCenter(center)
				this.initMakert(center)
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 列表切换分组
			modalVisibleChange (corpId, teamId) {
				this.selectedRowKeys = []
				this.corpId = corpId
				this.groupId = teamId
				if (this.storeType == 0) {
					this.getStoreList();
				} else {
					this.getUserList();
				}
			},
			// 查找门店
			findStore () {
				this.getStoreList()
			},
			// 门店搜索清空
			clearFind () {
				this.status = ''
				this.searchName = ''
				this.getStoreList()
			},
			//获取表格内容
			async getStoreList (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("auth-store/get-store-list", {
					corp_id    : this.corpId,
					group_id   : this.groupId,
					uid        : localStorage.getItem('uid'),
					status     : this.status,
					search_name: this.searchName,
					page       : page,
					page_size  : pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.storeList = res.data.data;
					this.storeIds = res.data.store_ids
					this.setCheckedBox(this.storeList)
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 批量开启
			releaseFollow () {
				let that = this;
				that.$confirm({
					title     : "确定开启选中的门店?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeStatus(1, that.selectedRowKeys)
					}
				});
			},
			// 批量关闭
			failure () {
				let that = this;
				that.$confirm({
					title     : "确定关闭选中的门店?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						that.changeStatus(0, that.selectedRowKeys)
					}
				});
			},
			// 单个开启关闭门店
			changeStore (id, status, shopName) {
				status = (parseInt(status) + 1) % 2
				let that = this;
				let title = '开启'
				if (status == 0) {
					title = '关闭'
				}
				that.$confirm({
					title     : "确定" + title + "选中的门店【" + shopName + "】?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						let ids = []
						ids.push(id)
						that.changeStatus(status, ids)
					}
				});
			},
			// 改变门店状态
			async changeStatus (status, selectedRowKeys) {
				const {data: res} = await this.axios.post("auth-store/close-store", {
					corp_id : this.corpId,
					store_id: selectedRowKeys,
					status  : status
				});
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					let message = ''
					if (status == 0) {
						message = '关闭成功'
						this.getStoreList(this.page, this.pageSize)
					} else if (status == 1) {
						message = '开启成功'
						this.getStoreList(this.page, this.pageSize)
					}
					this.$message.destroy()
					this.$message.success(message)
				}
			},
			// 删除门店
			delStore (id, shopName) {
				let that = this
				that.$confirm({
					title     : "确定删除选中的门店【" + shopName + "】?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delOneStore(id)
					}
				});
			},
			async delOneStore (id) {
				const {data: res} = await this.axios.post("auth-store/store-del", {
					uid     : localStorage.getItem('uid'),
					corp_id : this.corpId,
					store_id: id,
				});
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.selectedRowKeys = []
					this.$message.destroy()
					this.$message.success('删除成功')
					this.$refs.group.updateCount(res.old_pid)
					this.getStoreList()
				}
			},
			// qrLoad (url) {
			// 	window.location.href = this.$store.state.commonUrl + url
			// },

			addEmployee (id) {
				this.storeAdd = 1
				this.storeIds = [id]
				this.transfer = 0
				this.showModalDepartment = true
			},
			// 二维码下载
			qrLoad (qc_url) {
				let url = this.$store.state.commonUrl + qc_url
				let that = this
				let image = new Image()
				let arr = url.split('\/')
				let name = 'qc.png'
				if (arr.length > 0) {
					name = arr[arr.length - 1]
				}
				image.setAttribute('crossOrigin', 'anonymous')
				image.src = url
				image.onload = () => {
					let canvas = document.createElement('canvas')
					canvas.width = 200
					canvas.height = 200
					let ctx = canvas.getContext('2d')
					ctx.drawImage(image, 0, 0, 200, 200)
					canvas.toBlob((blob) => {
						let url = URL.createObjectURL(blob)
						that.download(url, name)
						// 用完释放URL对象
						URL.revokeObjectURL(url)
					})
				}
			},
			download (href, name) {
				let eleLink = document.createElement('a')
				eleLink.download = name
				eleLink.href = href
				eleLink.click()
				eleLink.remove()
			},
			// 分页
			changePage (page, pageSize) {
				this.getStoreList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 140)
				})
			},
			showSizeChange (page, pageSize) {
				this.getStoreList(1, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 140)
				})
			},
			//导入Excel
			importExcel () {
				this.file_name = ''
				this.fileInfo = {}
				this.tag_arr3 = []
				this.isShowTag = true
				this.upLoadShowModal = true
			},
			// 导入选择门店
			beforeUpload (file) {
				const extension = file.name.substr(file.name.lastIndexOf(".")).toLowerCase() === '.xls'
				const extension2 = file.name.substr(file.name.lastIndexOf(".")).toLowerCase() === '.xlsx'
				const isLt5M = file.size / 1024 / 1024 < 5
				if (!extension && !extension2) {
					this.$message.warning('上传模板只能是 xls、xlsx格式!')
					return
				}
				if (!isLt5M) {
					this.$message.warning('上传模板大小不能超过 5MB!')
					return
				}
				this.fileInfo = file;
				this.file_name = file.name;
				return false; // 返回false不会自动上传
			},
			//删除Excel
			closeExcel () {
				this.fileInfo = {}
				this.file_name = ''
			},
			// 导入提交
			async upLoadHandleOk () {
				this.modalLoading = true
				this.progressFlag = false
				if (JSON.stringify(this.fileInfo) == '{}') {
					this.$message.error('请选择上传Excel');
					this.modalLoading = false
					return false;
				}
				this.$message.info("已进入后台导入中，请耐心等待...");
				this.progressNum = 0
				this.successNum = 0
				this.failNum = 0
				this.notImportNum = 0
				this.upLoadShowModal = false
				this.progressVisible = true
				this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
				this.$nextTick(() => {
					document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
				})
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				param.append("corp_id", this.corpId);
				param.append("importFile", this.fileInfo);
				const {data: res} = await this.axios.post(
					"auth-store/exec-l-add-store", param
				);
				if (res.error != 0) {
					this.modalLoading = false;
					this.progressVisible = false
					this.$message.error(res.error_msg);
				} else {
					this.modalLoading = false;
				}
			},
			// 取消导入
			upLoadHandleCancel () {
				this.fileInfo = {}
				this.file_name = ''
				this.tag_arr3 = []
				this.isShowTag = false
				this.modalLoading = false;
				this.upLoadShowModal = false
			},
			//后台返回导入进度数据处理
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'export_store_sort') {
					this.$refs.group.otherUserMove(data.group_id, data.parentId, data.sort)
				}
				if (typeof data.type != 'undefined' && data.type == 'export_store_add') {
					this.progressVisible = true
					this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
					this.$nextTick(() => {
						document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
					})
					if (data.hair == 1) {
						let keys = Object.keys(data.pid_all)
						if (keys.length != 0) {
							let pidAll = []
							for (let key in keys) {
								pidAll.push(data.pid_all[key])
							}
							this.$refs.group.updateCount([], pidAll)
						}
					}
					this.failMsg = data.error_msg
					this.successNum = data.success
					this.failNum = data.error
					this.notImportNum = data.num - data.success - data.error
					this.progressNum = parseInt((data.success + data.error) / data.num * 100)
					if (this.progressNum == 100) {
						this.progressFlag = true
					}
				}
			},
			cancelProgress () {
				this.getStoreList()
				this.progressVisible = false
			},
			// 列表选择
			changeSelectKey (key) {
				for (let i = 0; i < this.selectedRowKeys.length; i++) {
					if (key == this.selectedRowKeys[i]) {
						this.selectedRowKeys.splice(i, 1)
						this.setCheckedBox(this.storeList)
						return false
					}
				}
				this.selectedRowKeys.push(key)
				this.setCheckedBox(this.storeList)
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					// 添加
					if (this.batchType == 0) {
						// 当前页
						this.addKey(this.storeList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = JSON.parse(JSON.stringify(this.storeIds))
					}
					this.setCheckedBox(this.storeList)
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						// 当前
						this.removeKey(this.storeList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
					}
					this.setCheckedBox(this.storeList)
					this.batchTypeValue = false
				}
			},
			// 设置列表多选框选中状态
			setCheckedBox (storeList) {
				this.checkBoxValue = new Array(storeList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < storeList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (storeList[i].id == this.selectedRowKeys[j]) {
							this.checkBoxValue[i] = true
						}
					}
				}
				if (this.batchType == 0) {
					this.batchTypeValue = true
					for (let i = 0; i < this.checkBoxValue.length; i++) {
						if (!this.checkBoxValue[i]) {
							this.batchTypeValue = false
						}
					}
				} else {
					if (this.selectedRowKeys.length == this.storeIds.length && this.storeIds.length != 0) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}
				if (storeList.length == 0) {
					this.batchTypeValue = false
				}

			},
			// 当前/所有 类型选择框变化
			changeBatchType (type) {
				this.batchType = type
				if (this.batchTypeValue) {
					if (this.batchType == 0) {
						this.selectedRowKeys = []
					}
					this.batchTypeValue = false
					this.batchTypeChange()
				} else {
					this.setCheckedBox(this.storeList)
				}
			},
			// 增加当前页key
			addKey (storeList) {
				for (let i = 0; i < storeList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === storeList[i].id)
					if (index == -1) {
						this.selectedRowKeys.push(storeList[i].id)
					}
				}
			},
			// 删除当前页key
			removeKey (storeList) {
				for (let i = 0; i < storeList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === storeList[i].id);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			// 成员列表 查找
			findUser () {
				this.getUserList()
			},
			// 成员列表 清空
			clear () {
				this.searchName1 = ''
				this.getUserList()
			},
			// 转移成员
			changeUser (id, storeId, userId, name, shopName) {
				this.userTitle = '转移成员'
				this.transfer = 1
				this.userName = name
				this.checkedList = [userId]
				this.editIds = [id]
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.storeIds = []
				this.storeDetail = []
				this.userVisible = true
			},
			// 删除成员
			deleteOneUser (id, storeId, userId, name, shopName) {
				let that = this;
				that.$confirm({
					title     : "确定将成员【" + name + "】从门店【" + shopName + "】中移除?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true
						let userIds = []
						userIds.push(userId)
						let storeIds = []
						storeIds.push(storeId)
						that.deleteUser(id, storeIds, userIds)
					}
				});
			},
			// 删除成员确认
			async deleteUser (id, storeIds, userIds) {
				const {data: res} = await this.axios.post("auth-store/add-store-user", {
					uid     : localStorage.getItem('uid'),
					corp_id : this.corpId,
					store_id: storeIds,
					user_ids: userIds,
					ids     : [id],
					is_del  : 1,
				});
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.$refs.userGroup.updateBatchDelCount(res.data)
					this.getUserList()
				}
			},
			// 添加门店成员
			addUser () {
				this.userTitle = '添加门店成员'
				this.checkedList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.storeIds = []
				this.storeDetail = []
				this.userVisible = true
			},
			// 成员弹窗取消
			cancelUser () {
				this.userVisible = false
				this.transfer = 0
				this.userName = ''
				this.checkedList = []
				this.editIds = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.storeIds = []
				this.storeDetail = []
				this.userTitle = '添加门店成员'
				this.storeAdd = 0
			},
			// 成员弹窗提交
			async updateUser () {
				this.loading = true
				if (this.chooseNum == 0 && this.transfer == 0) {
					this.loading = false
					this.$message.destroy()
					this.$message.warning('请选择成员')
					return false
				} else if (this.storeIds.length == 0) {
					this.loading = false
					this.$message.destroy()
					this.$message.warning('请选择门店')
					return false
				}
				let user_ids = []
				if (this.transfer == 0) {
					for (let i = 0; i < this.checkedList.length; i++) {
						user_ids.push(this.checkedList[i].id)
					}
				} else {
					user_ids = this.checkedList
				}
				const {data: res} = await this.axios.post("auth-store/add-store-user", {
					uid     : localStorage.getItem('uid'),
					corp_id : this.corpId,
					store_id: this.storeIds,
					user_ids: user_ids,
					transfer: this.transfer,
					ids     : this.editIds,
				});
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.loading = false
					if (res.data.length > 0) {
						if(this.storeAdd == 1) {
							this.getStoreList()
						} else {
							if (this.transfer == 0) {
								this.$refs.userGroup.updateBatchAddCount(res.data)
							} else {
								this.$refs.userGroup.updateBatchMoveCount(res.data)
							}
							this.getUserList()
							this.cancelUser()
						}
					} else {
						this.$message.destroy()
						this.$message.warning('该门店下已有该成员')
					}
					if(this.storeAdd == 1) {
						this.$refs.user.rightIdList = []
						this.$refs.user.rightList = []
						this.cancelUser()
					}
				}
			},
			// 选择成员
			showDepartmentList () {
				this.showModalDepartment = true
				let arr = []
				this.checkedList.map(x => {
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.checkedList))
			},
			// 选择成员确认
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					if (this.chooseNum > 0) {
						this.checkedList = JSON.parse(JSON.stringify(list))
					} else {
						this.checkedList = []
					}
					if (this.storeAdd == 1) {
						this.updateUser()
					}
					this.showModalDepartment = false
				} else {
					this.showModalDepartment = false
				}

			},
			//重置
			clearDepartmentList () {
				this.checkedList = []
				this.chooseNum = 0
				this.chooseUserNum = 0
			},
			clearStoreList () {
				this.storeIds = []
				this.storeDetail = []
			},
			// 展示门店列表弹窗
			showStoreModal () {
				this.userVisible = false
				this.storeVisible = true
			},
			// 确认门店回调
			setGroupId (evt, ids, stores) {
				if (evt == 'ok') {
					this.storeIds = JSON.parse(JSON.stringify(ids))
					this.storeDetail = JSON.parse(JSON.stringify(stores))
				}
				this.userVisible = true
				this.storeVisible = false
			},
			// 成员列表
			async getUserList (page = 1, pageSize = this.pageSize1) {
				this.isLoading = true
				const {data: res} = await this.axios.post("auth-store/get-group-user-list", {
					corp_id    : this.corpId,
					id         : this.groupId,
					uid        : localStorage.getItem('uid'),
					search_name: this.searchName1,
					page       : page,
					page_size  : pageSize
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.destroy()
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.userList = res.data.data;
					this.isLoading = false;
					this.total1 = parseInt(res.data.count);
					this.page1 = page;
					this.pageSize1 = pageSize;
					this.quickJumper = this.total > this.pageSize;
				}
			},
			// 成员列表切换分页
			changePage1 (page, pageSize) {
				this.getUserList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 140)
				})
			},
			showSizeChange1 (page, pageSize) {
				this.getUserList(1, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 140)
				})
			},
			// 获取门店状态
			async getStoreStatus (status) {
				const {data: res} = await this.axios.post("auth-store/get-store-status", {
					corp_id: localStorage.getItem('corpId'),
					status : status,
				})
				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg);
				} else {
					this.storeStatus = res.data.status
				}
			},
			// 改变门店状态
			changeStoreStatus () {
				this.getStoreStatus((this.storeStatus + 1) % 2)
			}
		},

		mounted () {
			let that = this
			if (localStorage.getItem('isMasterAccount') == 2) {
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				let that = this
				if (permissionButton.indexOf('storeList-staff-list') != -1) {
					that.storeType = 1
				} else if (permissionButton.indexOf('storeList-manage-list') != -1) {
					that.storeType = 0
				}
				if (permissionButton.indexOf('storeList-manage-status') != -1) {
					that.disableOpen = false
				} else {
					that.disableOpen = true
				}
				that.$forceUpdate()
			} else {
				that.storeType = 1
			}
			// this.getStoreStatus(this.storeStatus)
			this.ws.setCallback(this.websocketOnMessage)
		}
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.content-msg {
		min-width: 845px;
		width: calc(100% - 25px);
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		text-align: left;
		margin-bottom: 20px;
	}

	.tabBtn {
		margin: 0;
		width: 125px;
		height: 38px;
		line-height: 38px;
		text-align: center;
		display: inline-block;
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

	/deep/ .logo-text {
		display: none !important;
	}

	/deep/ #map a {
		display: none !important;
	}

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
		width: 100%;
		padding-right: 40px;
	}

	.content-hd {
		height: 50px;
		width: 100%;
		min-width: 885px;
	}

	.msg-info {
		color: #FFDDA6;
		margin-right: 10px;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		min-width: 885px;
		width: 100%;
		border: 1px solid rgba(0, 0, 0, 0.05);
		border-bottom: 0;
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
		margin-left: 10px;
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
		background: #1E90FF;
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

	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 47px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .wxtpl .ant-radio-button-wrapper-checked {
		border: 2px solid #01b065 !important;
	}

	/deep/ .ant-dropdown-trigger > .anticon.anticon-down {
		font-size: 14px;
		color: black;
	}

	/deep/ .ant-table-tbody > tr > td, /deep/ .ant-table-thead > tr > th {
		border-bottom: 1px solid rgba(0, 0, 0, 0.02);
	}

	/deep/ .ant-table table {
		box-shadow: none !important;
	}
</style>
