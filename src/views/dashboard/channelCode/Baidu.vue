<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative; height: 100%; overflow: hidden">
				<!-- 左侧 -->
				<!--				<a-layout-sider>-->
				<!--					<Menu ref="menu" @changeGroupId='changeGroupId'></Menu>-->
				<!--					&lt;!&ndash;					&lt;!&ndash; 企业微信 &ndash;&gt;&ndash;&gt;-->
				<!--					&lt;!&ndash;					<eWechat @changeWxId="handleWxId"></eWechat>&ndash;&gt;-->
				<!--				</a-layout-sider>-->
				<a-layout
						style="position: absolute;left:0px;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;"
						class="scroll">
					<!-- 头部 -->
					<!-- <a-layout-header>百度统计</a-layout-header> -->
					<!-- 内容 -->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">百度统计</div>
						<div class="content-msg"  style="box-shadow: 0px 1px 4px 0px #D7D7D7">
							<p style="margin-bottom: 2px;">
								1、可以生成带参数的二维码名片，支持活码功能，即随机选取设置的活码成员推给用户。加企业微信为好友后，可以给微信联系人自动回复相应欢迎消息和打标签。
							</p>
							<p style="margin-bottom: 2px;">
								2、<span style="color: #F56C6C;">受限于官方，单人类型的渠道码创建后尽量不要再修改成员，否则会造成列表中，该二维码中间的头像与配置的成员头像不一致，但是并不影响功能使用。</span>
							</p>
							<p style="margin-bottom: 0px;">
								3、<span style="color: #F56C6C;">如果企业在企业微信后台为相关成员配置了可用的欢迎语，使用第三方系统配置欢迎语，则均不起效，推送的还是企业微信官方的。</span>
							</p>
						</div>
						<div class="content-hd">
							<a-col style="float: left;">
								<a-input style="width: 180px;" placeholder="搜索活码名称" allowClear v-model="title"/>
								<a-select v-model="type" style="width: 120px;margin-left: 10px;">
									<a-select-option value="0">活码类型</a-select-option>
									<a-select-option value="1">单人</a-select-option>
									<a-select-option value="2">多人</a-select-option>
								</a-select>
								<a-button style="margin-left: 10px;" @click="selectTitle" type="primary">查找</a-button>
								<a-button style="margin-left: 10px;" @click="clearTitle">清空</a-button>
							</a-col>
							<a-col style="float:right;">
								<a-button class="btn-primary" icon="setting"
								          @click="addSetting" type="primary" v-has="'channelCodeBaidu-add'">
									配置token
								</a-button>
								<a-button class="btn-primary" icon="reload" @click="syncFollowUser"
								          v-has="'channelCodeBaidu-sync'">
									同步配置了外部联系权限的联系人
								</a-button>
								<a-button class="btn-primary" icon="plus" @click="showModal('add')" type="primary"
								          v-has="'channelCodeBaidu-add'"
								>
									新建
								</a-button>
							</a-col>
						</div>
						<!-- 表格部分 -->
						<div class="content-bd">
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<a-table :columns="columns" :dataSource="wayList" :pagination="false"
								         :rowClassName="rowClassName" v-has="'channelCodeBaidu-list'">
									<span slot="local_path" slot-scope="text, record, index">
										<img width="100" height="100" :src="$store.state.commonUrl + text">
										<div style="text-align: center;">
											<span v-if="record.type == 1">
												单人
											</span>
											<span v-else>
												多人
											</span>
										</div>
									</span>
									<span slot="select" slot-scope="text, record, index">
										<a-checkbox style="float: right"
										            v-model="checkBoxValue[index]"
										            @click="changeSelectKey(record.key)"></a-checkbox>
									</span>
									<span slot="type" slot-scope="text">
										<template v-if="text == 1">单人</template>
										<template v-else>多人</template>
									</span>
									<span slot="remark" slot-scope="text">
										<template v-if="text == '' || text == null">--</template>
										<template v-else>{{text}}</template>
									</span>

									<span slot="user" slot-scope="text, record">
										<span style="color: #01b065; cursor: pointer;"
										      @click="preview(record.id, record.type, 0)">预览</span>
										<!--										<template v-if="record.type == 1">-->
										<!--											<a-tag style="margin-bottom: 5px;" v-for="(user,uindex) in record.user"-->
										<!--											       color="orange">{{record.user[0].name}}</a-tag>-->
										<!--										</template>-->
										<!--										<template v-else>-->
										<!--											<a-tag style="margin-bottom: 5px;" v-for="(user,uindex) in record.user"-->
										<!--											       color="orange">{{user.name}}</a-tag>-->
										<!--											<a-tag style="margin-bottom: 5px;"-->
										<!--											       v-for="(party,pindex) in record.department" color="blue">{{party.name}}</a-tag>-->
										<!--										</template>-->
									</span>

									<span slot="skip_verify" slot-scope="text">
										<template v-if="text == 1">是</template>
										<template v-else>否</template>
									</span>

									<span slot="tag_ids" slot-scope="text,record">
											<span v-if="!record.tag_ids || record.tag_ids.length == 0">--</span>
					                    <a-tag v-for="tag in record.tag_ids" color="blue" style="margin-bottom: 5px;"
					                           :key="tag.id">{{tag}}</a-tag>
					                </span>

									<span slot="action" slot-scope="text, record">
										<a-button @click="modifyWay(record.id)" class="actionBtn"
										          v-has="'channelCodeBaidu-edit'"
										>编辑</a-button>
										<a-button @click="customer(record.id)" class="actionBtn"
										          v-has="'channelCodeBaidu-look'"
										>客户</a-button>
										<a-button @click="copyUrl(record.url)" class="actionBtn"
										          v-has="'channelCodeBaidu-list'"
										>复制链接</a-button>
									</span>
								</a-table>
								<!-- 分页 -->
								<div class="pagination"
								     style="float: right; margin: 20px auto;height: 32px;width: 100%;"
								     v-show="total > 0" v-has="'channelCodeBaidu-list'">
									<div style="height: 32px;display: inline-block;line-height: 32px;margin-bottom: 10px;"
									     v-if="isShowChoose">
										<a-checkbox v-model="batchTypeValue" @click="batchTypeChange"></a-checkbox>
										<a-select optionFilterProp="children" v-model="batchType"
										          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
											<a-select-option value="0">选择当前页</a-select-option>
											<a-select-option value="1">选择所有</a-select-option>
										</a-select>
										<a-popover trigger="hover">
											<template slot="content">
												<p @click="batchEdit(1)"
												   style="margin-bottom: 2px;text-align: center; cursor: pointer;">
													按周期编辑</p>
												<p @click="batchEdit(2)"
												   style="margin-bottom: 2px;text-align: center; cursor: pointer;">
													按特殊时期编辑</p>
											</template>
											<a-button style="margin-right: 5px"
											          v-if="selectedRowKeys.length != 0">
												<a-icon type="team"/>
												批量编辑成员
											</a-button>
										</a-popover>
										<a-button v-if="selectedRowKeys.length == 0" style="margin-right: 5px"
										          :disabled="selectedRowKeys.length == 0">
											<a-icon type="team"/>
											批量编辑成员
										</a-button>
										<a-button @click="batchEditWelCome()" style="margin-right: 5px"
										          :disabled="selectedRowKeys.length == 0">
											<a-icon type="message"/>
											批量编辑欢迎语
										</a-button>
									</div>
									<a-pagination style="text-align: right;margin-bottom: 20px;" :total="total"
									              showSizeChanger :showQuickJumper="quickJumper"
									              :current="page"
									              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
									              @change="changePage"
									              @showSizeChange="showSizeChange"/>
								</div>
							</a-spin>
						</div>
						<!-- 高级设置弹窗 -->
						<a-modal title="配置token" v-model="settingVisible" width="700px !important"
						         @cancel="handleCancel">
							<template slot="footer">
								<a-button key="back" @click="handleCancel">取消</a-button>
								<a-button
										key="submit"
										type="primary"
										:loading="settingLoading"
										@click="handleOk"
								>提交
								</a-button>
							</template>
							<label style="width: 100px;">token：</label>
							<a-input style="width: calc(100% - 50px);" v-model="editToken"
							         placeholder="请输入token"></a-input>
							<p style="color: #01b065;margin: 10px 0;">如何获取：</p>
							<img style="width: 650px;" src="../../../assets/baidu/token.png">
							<p style="margin: 10px 0;">广告主可以在百度商业开发者中心的个人中心获取oCPC API转化数据接入的token授权码。</p>
							<p style="margin: 0;">百度商业开发者中心的个人中心URL：<a
									href="http://dev2.baidu.com/newdev2/dist/index.html#/personal-center/API-authority-manage"
									target="_blank">http://dev2.baidu.com/newdev2/dist/index.html#/personal-center/API-authority-manage</a>
							</p>
						</a-modal>
						<!-- 用户列表弹窗 -->
						<a-modal title="扫码用户" v-model="usersVisible" :footer="null" width="550">
							<a-spin tip="Loading..." size="large" :spinning="isLoading3">
								<a-table :columns="columns2" :dataSource="usersList2" :pagination="false"
								         :rowClassName="rowClassName">
								</a-table>
								<!--								 分页 -->
								<div style="width: 100%;height: 32px;margin-top: 20px;" v-show="total2 > 0">
									<div style="height: 32px;float: left;line-height: 32px;">
										共有
										<span style="color: blue">{{total2}}</span>个用户
									</div>
									<div class="pagination" style="height: 32px;float: right;">
										<a-pagination :total="total2" showSizeChanger :showQuickJumper="quickJumper2"
										              :current="page2"
										              :pageSize="pageSize2" :pageSizeOptions="['15','30','50','100']"
										              @change="changePage2"
										              @showSizeChange="showSizeChange2"/>
									</div>
								</div>
							</a-spin>
						</a-modal>
					</a-layout-content>

				</a-layout>
			</a-layout>
		</div>
		<a-modal v-model="specialModal" :title="specialModalTitle" width="888px" @cancel="cancelChangeSpecialTime">
			<template slot="footer">
				<a-button key="back" v-if="!batchEditType" @click="cancelChangeSpecialTime">关闭</a-button>
				<a-button key="back" v-if="batchEditType" @click="cancelChangeSpecialTime">取消</a-button>
				<a-button
						v-if="batchEditType"
						key="submit"
						type="primary"
						:loading="groupLoading"
						@click="handleChangeSpecialTime"
				>提交
				</a-button>
			</template>
			<a-form>
				<!-- 排班 -->
				<a-form-item label="企业成员" :label-col="{ span: 2 }" v-if="specialType == 1 || specialType == 0">
					<div>
						<a-button
								v-show="batchEditType && specialWeekList[0].mon.length == 0 || specialWeekList[0].tues.length == 0 || specialWeekList[0].wednes.length == 0 || specialWeekList[0].thurs.length == 0 || specialWeekList[0].fri.length == 0 || specialWeekList[0].satur.length == 0 || specialWeekList[0].sun.length == 0 "
								@click="addSpecialTime" icon="plus">
							添加
						</a-button>
					</div>
				</a-form-item>
				<a-form-item v-if="specialType == 1 || specialType == 0">
					<a-table
							:columns="specialWeekColumns"
							:dataSource="specialWeekList"
							:pagination="false"
							:rowClassName="rowClassName"
							style="max-width: 98%;margin-left: 1%;"
					>
							<span slot="mon">
								周一<a-icon type="edit" @click='editSpecialTime("mon")'
								          v-show="specialWeekList[0].mon.length != 0 && batchEditType"
								          style="cursor: pointer"/>
							</span>
						<span slot="tues">
								周二<a-icon type="edit" @click='editSpecialTime("tues")'
								          v-show="specialWeekList[0].tues.length != 0 && batchEditType"
								          style="cursor: pointer"/>
							</span>
						<span slot="wednes">
								周三<a-icon type="edit" @click='editSpecialTime("wednes")'
								          v-show="specialWeekList[0].wednes.length != 0 && batchEditType"
								          style="cursor: pointer"/>
							</span>
						<span slot="thurs">
								周四<a-icon type="edit" @click='editSpecialTime("thurs")'
								          v-show="specialWeekList[0].thurs.length != 0 && batchEditType"
								          style="cursor: pointer"/>
							</span>
						<span slot="fri">
								周五<a-icon type="edit" @click='editSpecialTime("fri")'
								          v-show="specialWeekList[0].fri.length != 0 && batchEditType"
								          style="cursor: pointer"/>
							</span>
						<span slot="satur">
								周六<a-icon type="edit" @click='editSpecialTime("satur")'
								          v-show="specialWeekList[0].satur.length != 0 && batchEditType"
								          style="cursor: pointer"/>
							</span>
						<span slot="sun">
								周日<a-icon type="edit" @click='editSpecialTime("sun")'
								          v-show="specialWeekList[0].sun.length != 0 && batchEditType"
								          style="cursor: pointer"/>
							</span>
						<span slot="mon" slot-scope="text, record, index">
							<div v-for="item in record.mon" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> <template
														v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> <template
													v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
										</div>
									</a-tooltip>
									<a-tooltip placement="top">
										<template slot="title">
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange" style="margin-bottom: 5px;"
												       v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
											</template>
										</template>
										<div>
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange"
												       v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
											</template>
											<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
										</div>
									</a-tooltip>
								</div>
							</div>
							<div v-for="item in record.mon" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.mon.length == 0">--</div>
						</span>
						<span slot="tues" slot-scope="text, record, index">
							<div v-for="item in record.tues" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> <template
														v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> <template
													v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
										</div>
									</a-tooltip>
									<a-tooltip placement="top">
										<template slot="title">
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange" style="margin-bottom: 5px;"
												       v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
											</template>
										</template>
										<div>
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange"
												       v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
											</template>
											<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
										</div>
									</a-tooltip>
								</div>
							</div>
							<div v-for="item in record.tues" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.tues.length == 0">--</div>
						</span>
						<span slot="wednes" slot-scope="text, record, index">
							<div v-for="item in record.wednes" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> <template
														v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> <template
													v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
										</div>
									</a-tooltip>
									<a-tooltip placement="top">
										<template slot="title">
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange" style="margin-bottom: 5px;"
												       v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
											</template>
										</template>
										<div>
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange"
												       v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
											</template>
											<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
										</div>
									</a-tooltip>
								</div>
							</div>
							<div v-for="item in record.wednes" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.wednes.length == 0">--</div>
						</span>
						<span slot="thurs" slot-scope="text, record, index">
							<div v-for="item in record.thurs" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> <template
														v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> <template
													v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
										</div>
									</a-tooltip>
									<a-tooltip placement="top">
										<template slot="title">
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange" style="margin-bottom: 5px;"
												       v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
											</template>
										</template>
										<div>
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange"
												       v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
											</template>
											<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
										</div>
									</a-tooltip>
								</div>
							</div>
							<div v-for="item in record.thurs" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.thurs.length == 0">--</div>
						</span>
						<span slot="fri" slot-scope="text, record, index">
							<div v-for="item in record.fri" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> <template
														v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> <template
													v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
										</div>
									</a-tooltip>
									<a-tooltip placement="top">
										<template slot="title">
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange" style="margin-bottom: 5px;"
												       v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
											</template>
										</template>
										<div>
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange"
												       v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
											</template>
											<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
										</div>
									</a-tooltip>
								</div>
							</div>
							<div v-for="item in record.fri" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.fri.length == 0">--</div>
						</span>
						<span slot="satur" slot-scope="text, record, index">
							<div v-for="item in record.satur" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> <template
														v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> <template
													v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
										</div>
									</a-tooltip>
									<a-tooltip placement="top">
										<template slot="title">
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange" style="margin-bottom: 5px;"
												       v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
											</template>
										</template>
										<div>
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange"
												       v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
											</template>
											<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
										</div>
									</a-tooltip>
								</div>
							</div>
							<div v-for="item in record.satur" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.satur.length == 0">--</div>
						</span>
						<span slot="sun" slot-scope="text, record, index">
							<div v-for="item in record.sun" v-if="editType == 2">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<a-tooltip placement="top">
										<template slot="title">
											<div>
												<span v-for="user in item.userList"> <template
														v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
											</div>
										</template>
										<div style="width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
											<span v-for="user in item.userList"> <template
													v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
										</div>
									</a-tooltip>
									<a-tooltip placement="top">
										<template slot="title">
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange" style="margin-bottom: 5px;"
												       v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
											</template>
										</template>
										<div>
											<template v-for="(user, index) in item.userList">
												<a-tag color="orange"
												       v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(item.userList) >= index">{{user.title}}</a-tag>
											</template>
											<template v-if="getPartyNum(item.userList) > 3">等{{getPartyNum(item.userList)}}个部门</template>
										</div>
									</a-tooltip>
								</div>
							</div>
							<div v-for="item in record.sun" v-if="editType == 1">
								<div>
									{{item.start_time}}~{{item.end_time}}
									<div>
										<a-select showSearch optionFilterProp="children"
										          :disabled="true"
										          :showArrow="false"
										          :mode="editType == 1 ? 'default' : 'multiple'"
										          v-model="item.userList"
										          style="width: 100%"
										          placeholder="请选择企业成员"
										>
											<a-select-option v-for="(user, userid) in user"
											                 :key="user.id">
												{{user.name}}
											</a-select-option>
										</a-select>
									</div>
								</div>
							</div>
							<div v-if="record.sun.length == 0">--</div>
						</span>
					</a-table>
				</a-form-item>
				<a-form-item label="特殊时期" :label-col="{ span: 2 }" v-if="specialType == 2 || specialType == 0"
				             :wrapper-col="{ span: 21 }">
					<a-switch :disabled="specialType == 0" :checked="specialTime == 1 ? true:false"
					          @click="changeSpecilTime"></a-switch>
					<span style="color: #F56C6C;margin-left: 10px;">如遇到国家节假日或是企业自身重要日子，在特殊时期内，需要更换活码成员</span>
					<div v-if="specialTime == 1" class="content-msg">
						<p style="margin-bottom: 2px;line-height: 20px;">
							1、系统默认生成一条每日24小时（00:00~00:00）数据，当时间点不在所新增的时段内，客户扫码后，添加的是“24小时”的企业成员。
						</p>
						<p style="margin-bottom: 0px;line-height: 20px;color: #FF562D"
						   v-if="editType == 2 && batchEditType">
							2、渠道活码设置部门时，请确保设置的部门具有外部联系人权限，否则会导致该区间段的活码设置失效。
						</p>
					</div>
					<div v-if="specialTime == 1" v-for="(item, index) in specialDateList"
					     style="padding: 10px 10px 40px 10px;"
					     :class="index!=specialDateList.length - 1 ? 'border-dashed' : ''">
						<label>特殊时期{{index + 1}}：</label>
						<a-range-picker
								style="width: 200px;"
								:allowClear="false"
								:disabled="!batchEditType"
								:disabledDate="disabledDateDay"
								:value="item.specialDate"
								:defaultValue="[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]"
								format="YYYY-MM-DD"
								@change="e => changeSpecialDate(e,index)"
						/>
						<div v-for="(time, timeIndex) in item.time" style="margin-left: 78px;">
							<a-time-picker :disabled='timeIndex == 0 || !batchEditType' :allowClear="false"
							               style="width: 100px;"
							               v-model="time.startTime"
							               :minuteStep="60"
							               @change="e => changeSpecialStartTime(e, index, timeIndex)"
							               :defaultOpenValue="moment('00:00', 'HH:mm')"
							               format="HH:mm">
							</a-time-picker>
							~
							<a-time-picker :disabled='timeIndex == 0 || !batchEditType' :allowClear="false"
							               style="width: 100px;"
							               v-model="time.endTime"
							               :minuteStep="60"
							               @change="e => changeSpecialEndTime(e, index, timeIndex)"
							               :defaultOpenValue="moment('00:00', 'HH:mm')"
							               format="HH:mm">
							</a-time-picker>
							<a-button style="margin-left: 10px;"
							          @click="showDepartmentList(index, 0, timeIndex)"
							          v-if="editType == 2 && batchEditType">
								选择企业成员
							</a-button>
							<span style="margin-left: 10px;" v-if="editType == 2">
								<a-tooltip placement="top">
									<template slot="title">
										<div>
											<span v-for="user in time.userList"> <template
													v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
										</div>
									</template>
									<span v-if="time.userList.length > 0"
									      style="display: inline-block; width: 80px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;vertical-align: middle;">
										<span v-for="user in time.userList"> <template
												v-if="user.scopedSlots.title == 'custom'"> {{user.title}} </template></span>
									</span>
								</a-tooltip>
								<a-tooltip placement="top">
									<template slot="title">
										<template v-for="(user, index) in time.userList">
											<a-tag color="orange" style="margin-bottom: 5px;"
											       v-if="user.scopedSlots.title != 'custom'">{{user.title}}</a-tag>
										</template>
									</template>
									<span v-if="time.userList.length > 0"
									      style="display: inline-block; vertical-align: middle;">
										<template v-for="(user, index) in time.userList">
											<a-tag color="orange"
											       v-if="user.scopedSlots.title != 'custom' && getThreePartyIndex(time.userList) >= index">{{user.title}}</a-tag>
										</template>
										<template v-if="getPartyNum(time.userList) > 3">等{{getPartyNum(time.userList)}}个部门</template>
									</span>
								</a-tooltip>
							</span>
							<a-tooltip placement="top" v-if="editType == 2 && timeIndex == item.time.length - 1">
								<template slot="title">
									选择企业成员和选择部门必须选择一个。选择部门后，扫码后最多可添加当前部门的企业成员。如原来某部门是5人，后新增1人，则客户最多可添加该部门6位企业成员
								</template>
								<span style="margin-left: 10px;">
															<a-icon type="question-circle"></a-icon>
														</span>
							</a-tooltip>
							<chooseStaffSelect ref="staffSelect"
							                   style="width: 160px;margin-left: 10px;display: inline-block;"
							                   v-if="editType == 1 && specialModal" :index="index" :index2="timeIndex"
							                   :callback="selectStaffCallback"
							                   :disabled="staffSelectDisabled"></chooseStaffSelect>
							<!--						<a style="margin-left: 10px;" v-show="item.userList.length > 0"-->
							<!--						   @click="clearDepartmentList(index, 1)">-->
							<!--							重置-->
							<!--						</a>-->
							<div>
								<span style="color:#01b065; cursor: pointer; margin-right: 10px;"
								      v-show="batchEditType && timeIndex == item.time.length - 1"
								      @click="addSpecialDateTimeList(index,timeIndex)">
									 添加
								</span>
								<span style="cursor: pointer;color:#F56C6C;"
								      v-show="timeIndex != 0 && batchEditType"
								      @click="deleteSpecialDateTimeList(index, timeIndex)">删除
								</span>
							</div>
						</div>
						<div style="float: right;margin-right: 240px">
							<a-button type="primary"
							          style="height: 26px;width: 94px;padding: 0px 5px;margin-right: 10px; font-size: 12px;"
							          icon="plus" v-show="index == specialDateList.length - 1 && batchEditType"
							          @click="addSpecialDate(index)">
								添加时期
							</a-button>
							<a-icon v-show="(index != 0 || specialDateList.length > 1) && batchEditType"
							        style="color: #F56C6C; margin-left: 10px" type="delete"
							        @click="deleteSpecialDate(index)"/>
						</div>
					</div>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal v-model="welComeVisible" title="编辑欢迎语" @ok="handleWelcome"
		         @cancel="handleCancleWelcome" width="888px">
			<div class="wrap left-sider-content">
				<img src="../../../assets/wxHeader.png" alt
				     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
				<div class="msg_content_body">
					<!--文本-->
					<div v-if="textAreaValueHeader && pushValue" class="mt">
						<a-avatar
								src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
								:size="36" style="margin-right: 10px;float: left;"/>
						<span v-html="textAreaValueHeader" class="item-info msg_content_txt"
						      style="display:block;white-space: pre-wrap;word-wrap: break-word;"></span>
					</div>
					<!--图片-->
					<div v-if="img && pushValue" class="mt">
						<a-avatar
								src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
								:size="36" style="margin-right: 10px;float: left;object-fit: cover;"/>
						<img :src="commonUrl+img" alt
						     style="width: 150px;border-radius: 4px;"/>
					</div>
					<!--网址-->
					<div v-if="modalUrlOk && pushValue" class="mt">
						<a-avatar
								src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
								:size="36" style="margin-right: 10px;float: left;"/>
						<div class="item-info msg_content_txt">
							<p class="url-title">{{inputTitle}}</p>
							<div style="overflow: hidden;">
								<div class="url-text">{{digest}}</div>
								<img :src="commonUrl+msgUrl" alt=""
								     style="float: right;width: 64px;height: 64px;object-fit: cover;">
							</div>
						</div>
					</div>
					<!--小程序-->
					<div v-if="modalAppletOk && pushValue" class="mt">
						<a-avatar
								src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
								:size="36" style="margin-right: 10px;float: left;"/>
						<div class="item-info msg_content_txt">
							<p class="applet-title">{{appletInputTitle}}</p>
							<img :src="commonUrl+appletUrl" alt=""
							     style="width: 100%;object-fit: cover;">
						</div>
					</div>
				</div>
			</div>
			<div style="display: inline-block; width: calc(100% - 255px);">
				<!-- 渠道欢迎语 -->
				<a-form-item label="扫码推送" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-switch :checked="pushValue" @click="changeStatus"/>
					（关闭后，客户扫该百度活码，依然可对该客户自动打标签，但仅收到系统的【欢迎语】消息）
				</a-form-item>
				<!-- 推送内容 -->
				<!-- 内容 -->
				<a-form-item v-if="pushValue" label="欢迎语" :label-col="{ span: 5 }"
				             :wrapper-col="{ span: 19 }">
					<div class="pull-right fl">
						<editor :text="textContent"
						        :textValue="textAreaValueHeader"
						        :isEmoji="false"
						        @changeText="changeText">
						</editor>
						<div v-if="!img && !modalUrlOk && !modalAppletOk"
						     style="margin: 10px 0;cursor: pointer;" :key="popoverKey">
							<a-popover :getPopupContainer="getPopupContainer2" @visibleChange="visibleChange"
							           :destroyTooltipOnHide="true" trigger="click" v-model="popVisible"
							           placement="top">
								<template slot="content">
									<div class="popover-menu" @click="choosePic(1)">
										<a-icon type="picture"/>
										<p>图片</p>
									</div>
									<div class="popover-menu  popover-menu1"
									     @click="chooseUrl(2)">
										<a-icon type="link"/>
										<p>图文</p>
									</div>
									<div class="popover-menu popover-menu2"
									     @click="chooseApplet(3)">
										<MyIcon type="icon-miniapp"></MyIcon>
										<p>小程序</p>
									</div>
								</template>
								<a-icon type="plus"></a-icon>
								添加图片/图文/小程序消息
							</a-popover>
						</div>
						<!-- 图片 -->
						<div v-if="img"
						     style="margin: 10px 0;cursor: pointer;float:left;"
						     @click="choosePic(1)">
							<a-icon type="picture" style="margin-right: 7px;"/>
							{{fileName}}
						</div>
						<!-- 网址 -->
						<div v-if="modalUrlOk"
						     style="margin: 10px 0;cursor: pointer;float:left;max-width: 200px;overflow: hidden;height: 40px;text-overflow: ellipsis;white-space: nowrap;"
						     @click="chooseUrl(2)">
							<a-icon type="link" style="margin-right: 7px;"/>
							{{inputTitle}}
						</div>
						<!-- 小程序 -->
						<div v-if="modalAppletOk"
						     style="margin: 10px 0;cursor: pointer;float:left;max-width: 200px;overflow: hidden;height: 40px;text-overflow: ellipsis;white-space: nowrap;"
						     @click="chooseApplet(3)">
							<MyIcon type="icon-miniapp"></MyIcon>
							{{appletInputTitle}}
						</div>

						<div v-if="img || modalUrlOk || modalAppletOk"
						     style="float:left;margin: 10px 0 0 10px;cursor: pointer;"
						     @click="deleteWelcome">
							<a-icon type="close"/>
						</div>
					</div>
				</a-form-item>
			</div>
		</a-modal>
		<a-modal :visible="specialTimeVisible" :title="specialTimeTitle" @ok="handleSpecialTime"
		         @cancel="handleCancelSpecialTime"
		         width="888px" :confirmLoading="addSpecialTimeLoading">
			<div class="content-msg">
				<p style="margin-bottom: 2px;line-height: 20px;">
					1、系统默认生成一条每日24小时（00:00~00:00）数据，当时间点不在所新增的时段内，客户扫码后，添加的是“24小时”的企业成员。
				</p>
				<p style="margin-bottom: 0px;line-height: 20px;color: #FF562D" v-if="editType == 2">
					2、渠道活码设置部门时，请确保设置的部门具有外部联系人权限，否则会导致该区间段的活码设置失效。
				</p>
			</div>
			<a-form-item label="固定时段" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<div>
					<div v-for="(item,index) in specialTimeList">
						<a-time-picker :disabled="index == 0" :allowClear="false" style="width: 100px;"
						               v-model="item.startTime"
						               :minuteStep="60"
						               @change="e => changeStartTime(e, index)"
						               :defaultOpenValue="moment('00:00', 'HH:mm')" format="HH:mm">
						</a-time-picker>
						~
						<a-time-picker :disabled="index == 0" :allowClear="false" style="width: 100px;"
						               v-model="item.endTime"
						               :minuteStep="60"
						               @change="e => changeEndTime(e, index)"
						               :defaultOpenValue="moment('00:00', 'HH:mm')"
						               format="HH:mm">
						</a-time-picker>
						<a-tooltip placement="top" v-if="editType == 2">
							<template slot="title">
								<span v-for="item1 in item.userList">{{item1.name}} </span>
							</template>
							<span style="display: inline-block; max-width: 190px;vertical-align: bottom; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left: 10px;">
								<span v-for="item1 in item.userList">{{item1.name}} </span>
							</span>
						</a-tooltip>
						<chooseStaffSelect ref="staffSelect2"
						                   style="width: 160px;margin-left: 10px;display: inline-block;"
						                   v-if="editType == 1 && specialTimeVisible" :index="index" :index2="0"
						                   :callback="selectStaffCallback2"></chooseStaffSelect>
						<a-button style="margin-left: 10px;" @click="showDepartmentList(index, 1)"
						          v-if="editType == 2">
							选择企业成员
						</a-button>
						<span style="margin-left: 5px"
						      v-if="editType == 2 && item.userList.length + item.party.length> 0">已选择{{getUserNum(item.userList)}}名成员，{{item.party.length}}个部门</span>
						<a-tooltip placement="top" v-if="editType == 2 && index == specialTimeList.length - 1">
							<template slot="title">
								选择企业成员和选择部门必须选择一个。选择部门后，扫码后最多可添加当前部门的企业成员。如原来某部门是5人，后新增1人，则客户最多可添加该部门6位企业成员
							</template>
							<span style="margin-left: 10px;">
									<a-icon type="question-circle"></a-icon>
								</span>
						</a-tooltip>
						<div>
							<span @click="addTime(index)" style="color:#01b065; cursor: pointer;margin-right: 10px;"
							      v-show="index == specialTimeList.length - 1">添加</span>
							<span style="cursor: pointer;color:#F56C6C;" v-show="index != 0"
							      @click="deleteTime(index)">删除
							</span>
						</div>
					</div>
				</div>
			</a-form-item>
			<a-form-item label="适用周期" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<template v-for="(item,index) in weekList">
					<a-checkable-tag v-model="weekChecked[index]" style="cursor: pointer;"
					                 @change="changeWeekDay(item.key)">
						{{item.name}}
					</a-checkable-tag>
				</template>
			</a-form-item>
		</a-modal>
		<a-modal v-model="groupVisible" title="分组移动" width="720px" @cancel="cancelChangeGroup">
			<template slot="footer">
				<a-button key="back" @click="cancelChangeGroup">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="groupLoading"
						@click="handleChangeGroup"
				>提交
				</a-button>
			</template>
			<div class="group-tree" style="height: 270px;width: 100%; overflow-x: auto;">
				<a-tree
						class="draggable-tree"
						@select="onselect"
						:treeData="groupList"
				>
					<template slot="custom" slot-scope="{title,key}">
						<div style="width: 100%;" :dataKey="key">
							<span :class="key== group ? 'active1': ''">{{title}}</span>
						</div>
					</template>
				</a-tree>
			</div>
		</a-modal>
		<!-- 选择成员 -->
		<chooseDepartment ref="user" :show="showModalDepartment" :is_from="7" :chooseNum="chooseDepartmentNum"
		                  :callback="modalVisibleChange3"></chooseDepartment>
		<chooseMsg :show="showModal3" :type="typeValue2" :news_type="news_type"
		           :callback="modalVisibleChange2" :sketchType="'1'" :comefrom='comefrom'
		           :chooseId="chooseId"></chooseMsg>
		<chooseMinipro :show="showModalMinipro" :type="typeValue2"
		               :callback="modalVisibleChange2" :chooseId="chooseId"></chooseMinipro>
		<!-- 图文 -->
		<a-modal :visible="showModalUrl" title="图文" @ok="handleUrl" @cancel="handleCancelUrl"
		         width="720px" :confirmLoading="confirmLoading">
			<!-- 图片封面 -->
			<!-- 选中前 -->
			<a-form-item label="添加方式" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<a-radio-group name="radioGroup" @change="changeSketchAddType()"
				               v-model="sketchAddType">
					<a-radio :value="1">新建</a-radio>
					<a-radio :value="0">导入</a-radio>
				</a-radio-group>
			</a-form-item>
			<template v-if="sketchAddType == 1">
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="closeShowModal3==false">
					<template slot="label"><span
							style="color: red">*</span>图片封面
					</template>
					<div class="upload-wrap"
					     @click="choosePic(2)">
						<a-icon type="plus" class="upload-plus"/>
					</div>
				</a-form-item>
				<!-- 选中后 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="closeShowModal3">
					<template slot="label"><span
							style="color: red">*</span>图片封面
					</template>
					<div class="upload-wrap">
						<img :src="commonUrl+msgUrl1" alt=""
						     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
					</div>
					<span
							style="color: blue;cursor: pointer;margin: 67px 0 0px 10px;float: left;"
							@click="choosePic(2)">重新上传</span>
				</a-form-item>
				<!-- 填写标题 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<template slot="label"><span
							style="color: red">*</span>填写标题
					</template>
					<a-input v-model="inputTitle1"
					         :maxLength="32">
																	<span slot="suffix">
	                    <span>{{inputTitle1.length}}</span>/32
	                  </span>
					</a-input>
				</a-form-item>
				<!-- 添加描述 -->
				<a-form-item label="添加描述" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-textarea placeholder="填写图文描述" :rows="4"
					            style="resize: none;"
					            v-model="digest1"
					            :maxLength="128"/>
					<div style="float:right;">
						<span>{{digest1.length}}</span>/128
					</div>
				</a-form-item>
				<a-form-item label="素材同步" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-radio-group
							v-model="materialSync1" @change="changeMaterialSync()"
							:disabled="disabledSync1 == 1 ? true : false">
						<a-radio :value="0">不同步</a-radio>
						<a-radio :value="1"
						         :style="{ 'display': materialSync1 == 1 ? 'block' : '' }">
							同步至【内容引擎】
							<div v-show="materialSync1 == 1"
							     style="margin-top: 10px;">
								选择分组：
								<a-tree-select
										style="width: 225px"
										:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
										:treeData="groupList1"
										placeholder='Please select'
										treeDefaultExpandAll
										v-model="selectGroupId1"
								>
								</a-tree-select>
							</div>
						</a-radio>
					</a-radio-group>
				</a-form-item>
				<!-- 点击跳转 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<template slot="label"><span
							style="color: red">*</span>点击跳转
					</template>
					<a-input
							placeholder="请输入跳转链接，且必须以http://或https://开头"
							style="margin-bottom: 10px;"
							v-model="url1">
					</a-input>
				</a-form-item>
			</template>
			<template v-if="sketchAddType == 0">
				<!-- 选中前 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="material_id11 == ''">
					<template slot="label"><span
							style="color: red">*</span>图文
					</template>
					<div class="upload-border"
					     @click="openShowModal()">
						<a-icon type="plus" class="upload-plus"/>
						<span>选择图文</span>
					</div>
				</a-form-item>
				<!-- 选中后 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="material_id11">
					<template slot="label"><span
							style="color: red">*</span>图文
					</template>
					<div class="upload-border"
					     @click="openShowModal()">
						<img src="../../../assets/circle.png" alt/>
						已选择1条图文
						<p style="color: blue;margin: 14px;"
						   @click="openShowModal()">
							[修改]</p>
					</div>
				</a-form-item>
			</template>
		</a-modal>
		<!-- 小程序 -->
		<a-modal :visible="showModalApplet" title="小程序" @ok="handleApplet"
		         @cancel="handleCancelApplet"
		         width="720px" :confirmLoading="confirmLoading">
			<a-form-item label="添加方式" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<a-radio-group name="radioGroup" @change="changeMiniproAddType()"
				               v-model="miniproAddType">
					<a-radio :value="1">新建</a-radio>
					<a-radio :value="0">导入</a-radio>
				</a-radio-group>
			</a-form-item>
			<template v-if="miniproAddType == 1">
				<div class="content-msg1">
					<p style="margin-bottom: 2px;line-height: 20px;">
						在企业微信里发送小程序（必须在微信公众平台通过审核和发布的），请先将其关联到企业微信（
						<a target="_blank" href="https://support.qq.com/products/104790/faqs/61672">
							如何关联</a>
						），再到本系统添加该小程序，否则发送失败，客户接收不到。
					</p>
					<p style="margin-bottom: 2px;line-height: 20px;">
						如果没有微信小程序，请前往微信小程序进行注册。
						<a target="_blank" href="https://support.qq.com/products/104790/faqs/61672">
							立即前往
						</a>
					</p>
					<p style="margin-bottom: 0px;color: #FF562D;">
						小程序路径必须以“.html”结尾。
					</p>
				</div>
				<!-- 图片封面 -->
				<!-- 选中前 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="closeModalApplet==false">
					<template slot="label"><span
							style="color: red">*</span>图片封面
					</template>
					<div class="upload-wrap" style="display: inline-block"
					     @click="choosePic(3)">
						<a-icon type="plus" class="upload-plus"/>
					</div>
					<span style="display: inline-block;margin-top: 64px;">（上传图片不超过1M，尺寸必须为1080*864像素，支持jpg/jpeg/png格式）</span>
				</a-form-item>
				<!-- 选中后 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="closeModalApplet">
					<template slot="label"><span
							style="color: red">*</span>图片封面
					</template>
					<div class="upload-wrap">
						<img :src="commonUrl+appletUrl1" alt=""
						     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
					</div>
					<span
							style="color: blue;cursor: pointer;margin: 67px 0 0px 10px;float: left;"
							@click="choosePic(3)">重新上传</span>
				</a-form-item>
				<!-- 填写标题 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<template slot="label"><span
							style="color: red">*</span>填写标题
					</template>
					<a-input v-model="appletInputTitle1"
					         :maxLength="12" placeholder="请填写小程序标题（4-12个字符）" @blur="checkout(appletInputTitle1)">
																	<span slot="suffix">
	                    <span>{{appletInputTitle1.length}}</span>/12
	                  </span>
					</a-input>
				</a-form-item>
				<!-- appid -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<template slot="label"><span
							style="color: red">*</span>AppID
					</template>
					<a-input v-model="appid1" placeholder="请填写小程序AppID，必须是关联到企业的小程序应用"/>
				</a-form-item>
				<!-- page路径 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<template slot="label"><span
							style="color: red">*</span>page路径
					</template>
					<a-input style="margin-bottom: 10px;"
					         v-model="pageUrl1" placeholder="必须以“.html”结尾，例如：pages/index.html">
					</a-input>
				</a-form-item>
				<a-form-item label="素材同步" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<a-radio-group
							v-model="materialSync1" @change="changeMaterialSync"
							:disabled="disabledSync1 == 1 ? true : false">
						<a-radio :value="0">不同步</a-radio>
						<a-radio :value="1"
						         :style="{ 'display': materialSync1 == 1 ? 'block' : '' }">
							同步至【内容引擎】
							<div v-show="materialSync1 == 1"
							     style="margin-top: 10px;">
								选择分组：
								<a-tree-select
										style="width: 225px"
										:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
										:treeData="groupList1"
										placeholder='Please select'
										treeDefaultExpandAll
										v-model="selectGroupId1"
								>
								</a-tree-select>
							</div>
						</a-radio>
					</a-radio-group>
				</a-form-item>
			</template>
			<template v-if="miniproAddType == 0">
				<!-- 选中前 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="material_id31 == ''">
					<template slot="label"><span
							style="color: red">*</span>小程序
					</template>
					<div class="upload-border"
					     @click="openShowModalMinipro()">
						<a-icon type="plus" class="upload-plus"/>
						<span>选择小程序</span>
					</div>
				</a-form-item>
				<!-- 选中后 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="material_id31">
					<template slot="label"><span
							style="color: red">*</span>小程序
					</template>
					<div class="upload-border"
					     @click="openShowModalMinipro()">
						<img src="../../../assets/circle.png" alt/>
						已选择1条小程序
						<p style="color: blue;margin: 14px;"
						   @click="openShowModalMinipro()">
							[修改]</p>
					</div>
				</a-form-item>
			</template>
		</a-modal>
		<!-- 小程序封面图片裁剪 -->
		<cropperModal ref="cropper" @ok="uploadAppletPic" @cancel="cancleAppletPic"></cropperModal>
	</div>
</template>

<script>
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import {message} from "ant-design-vue";
	import eWechat from "@/components/eWeChat/eWechat.vue";
	import moment from "moment";
	import "moment/locale/zh-cn";
	import Menu from '@/components/channelGroupMenu/Menu.vue'
	import chooseMsg from "@/components/ChooseMsg"
	import MyIcon from "@/components/MyIcon.vue"
	import chooseMinipro from '@/components/FilingCabinet/Miniprogram.vue'
	import cropperModal from '../../../components/picCropper/CropperModal'
	import editor from '../../../components/editor/index'
	import chooseStaffSelect from "@/components/ChooseStaffSelect"

	const columns = [
		{
			title      : '',
			key        : 'select',
			width      : "60px;",
			scopedSlots: {customRender: 'select'},
		},
		// {
		// 	title      : '二维码',
		// 	dataIndex  : "local_path",
		// 	width      : "9%",
		// 	key        : "local_path",
		// 	scopedSlots: {customRender: 'local_path'},
		// },
		{
			title    : '活码名称',
			dataIndex: "title",
			width    : "16%",
			key      : "title"
		},
		// {
		// 	title      : '类型',
		// 	dataIndex  : "type",
		// 	width      : "12%",
		// 	scopedSlots: {customRender: 'type'},
		// },
		// {
		// 	title    : '分组',
		// 	dataIndex: "way_group_name",
		// 	width    : "12%",
		// 	key      : "way_group_name"
		// },
		{
			title      : '活码成员',
			dataIndex  : "user",
			width      : "16%",
			scopedSlots: {customRender: 'user'},
		},
		{
			title      : '添加验证',
			dataIndex  : "skip_verify",
			width      : "8%",
			key        : "skip_verify",
			scopedSlots: {customRender: 'skip_verify'},
		},
		{
			title      : '标签',
			dataIndex  : 'tag_ids',
			width      : '28%',
			scopedSlots: {customRender: 'tag_ids'},
		},
		{
			title    : '客户数',
			dataIndex: "add_num",
			width    : "8%",
			key      : "add_num"
		},
		{
			title      : '操作',
			key        : 'action',
			width      : "20%",
			scopedSlots: {customRender: 'action'},
		},
	];
	const columns2 = [
		{
			title    : "客户名称",
			dataIndex: "name",
			key      : "name"
		},
		{
			title    : "归属成员",
			dataIndex: "department_name",
			key      : "department_name",
			// scopedSlots: {customRender: "is_new"}
		},
		{
			title    : "添加时间",
			dataIndex: "create_time",
			key      : "create_time"
		}
	]

	export default {
		name      : "channelCodeBaiduList",
		components: {
			Menu,
			chooseDepartment,
			chooseMsg,
			MyIcon,
			chooseMinipro,
			cropperModal,
			editor, chooseStaffSelect
		},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				settingVisible       : false,
				settingLoading       : false,
				tokenId              : '',
				token                : '',
				editToken            : '',
				textAreaValueHeader  : '',
				textContent          : '',
				popoverKey           : 0,
				commonUrl            : this.$store.state.commonUrl, //公共的链接
				groupVisible         : false,
				groupLoading         : false,
				groupList            : [],
				group                : '',
				qrCodeId             : '',
				previewModal         : false,
				specialType          : 1,
				batchMoveType        : '',
				editType             : 1,
				specialModal         : false,
				specialModalTitle    : '批量编辑成员',
				specialTimeVisible   : false,
				showModalDepartment  : false,
				chooseDepartmentNum  : 0,
				addSpecialTimeLoading: false,
				weekList             : [
					{
						key : 'mon',
						name: '周一'
					},
					{
						key : 'tues',
						name: '周二'
					},
					{
						key : 'wednes',
						name: '周三'
					},
					{
						key : "thurs",
						name: '周四'
					},
					{
						key : 'fri',
						name: '周五'
					},
					{
						key : 'satur',
						name: '周六'
					},
					{
						key : 'sun',
						name: '周日'
					}
				],
				weekDayKey           : [],
				weelArr              : {
					mon   : 0,
					tues  : 1,
					wednes: 2,
					thurs : 3,
					fri   : 4,
					satur : 5,
					sun   : 6
				},
				batchEditType        : false,
				staffSelectDisabled  : false,//特殊时期选择成员下拉框禁选
				weekChecked          : new Array(7).fill(false),
				specialWeekColumns   : [
					{
						slots      : {title: 'mon'},
						// title      : "周一",
						dataIndex  : "mon",
						width      : '14%',
						key        : "mon",
						scopedSlots: {customRender: "mon"}
					},
					{
						slots      : {title: 'tues'},
						// title      : "周二",
						dataIndex  : "tues",
						width      : '14%',
						key        : "tues",
						scopedSlots: {customRender: "tues"}
					},
					{
						slots      : {title: 'wednes'},
						// title      : "周三",
						dataIndex  : "wednes",
						width      : '14%',
						key        : "wednes",
						scopedSlots: {customRender: "wednes"}
					},
					{
						slots      : {title: 'thurs'},
						// title      : "周四",
						dataIndex  : "thurs",
						width      : '14%',
						key        : "thurs",
						scopedSlots: {customRender: "thurs"}
					},
					{
						slots      : {title: 'fri'},
						// title      : "周五",
						dataIndex  : "fri",
						width      : '14%',
						key        : "fri",
						scopedSlots: {customRender: "fri"}
					},
					{
						slots      : {title: 'satur'},
						// title      : "周六",
						dataIndex  : "satur",
						width      : '14%',
						key        : "satur",
						scopedSlots: {customRender: "satur"}
					},
					{
						slots      : {title: 'sun'},
						// title      : "周日",
						dataIndex  : "sun",
						width      : '14%',
						key        : "sun",
						scopedSlots: {customRender: "sun"}
					},
				],
				specialTimeTitle     : '添加',
				specialWeekList      : [
					{
						mon   : [],
						tues  : [],
						wednes: [],
						thurs : [],
						fri   : [],
						satur : [],
						sun   : [],
					},
				],
				specialTime          : 0,
				pushValue            : true,
				text                 : '',
				specialTimeList      : [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : []
					},
				],
				specialDateList      : [
					{
						specialDate: [moment(new Date()), moment(new Date())],
						date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
						time       : [
							{
								startTime : moment('00:00', 'HH:mm'),
								endTime   : moment('00:00', 'HH:mm'),
								start_time: '00:00',
								end_time  : '00:00',
								userList  : [],
								party     : []
							}
						],
					}
				],
				user                 : [],
				party                : [],
				type                 : '0',
				title                : '',
				corpId               : corpId,//企业微信选中的id
				wayList              : [],
				wayKeys              : [],
				selectedRowKeys      : [],
				checkBoxValue        : [],
				batchTypeValue       : false,
				batchType            : '1',
				wayInfo              : [],
				isLoading            : true, //Loading 组件显示与隐藏
				urlId                : '',//选中的二维码的id
				//表格部分
				columns,
				//分页
				total                : 1, //总条数
				quickJumper          : false, // 是否显示快速跳转的控件
				page                 : 1, //页码
				pageSize             : 15, //每页数据条数，默认15
				usersVisible         : false,//用户列表弹窗的显示与隐藏
				usersList            : [],//接口获取的用户列表
				usersList2           : [],//页面显示的用户列表
				//用户列表分页
				page2                : 1, //页数
				pageSize2            : 15, //每页个数
				total2               : 0, //总条数
				quickJumper2         : false, // 是否显示快速跳转的控件
				//用户列表表格部分
				columns2,
				isLoading3           : false,//用户列表页的加载
				groupList1           : [], // 内容引擎分组
				img                  : false, // 图片url
				showModal3           : false,//选择图片弹窗的显示与隐藏
				welComeVisible       : false,
				typeValue2           : 2,  // 1.图文 2.图片
				material_id1         : '',
				news_type            : 1,
				chooseId             : 0,//选择的图片id
				showModalUrl         : false,//网址弹窗
				sketchAddType        : 1, // 新建或导入
				sketchAddType1       : 1,
				url                  : '',//网址弹窗输入的网址
				closeShowModal3      : false,//网址弹窗封面选没选好
				msgUrl               : '',//网址弹窗封面选好的url
				inputTitle           : '',//网址弹窗输入标题
				digest               : '',//网址弹窗输入描述
				confirmLoading       : false,//网址弹窗确认按钮的Loading
				popVisible           : false,//控制选择图片、网址、小程序的popover的显示与隐藏
				index                : 0,//判断是图片打开素材弹窗还是链接打开，1是图片，2是链接，3是小程序
				modalUrlOk           : false,//判断网址弹窗关闭时是否成功选择
				showModalApplet      : false,//小程序弹窗的显示与隐藏
				miniproAddType       : 1, // 新建或导入
				miniproAddType1      : 1,
				material_id3         : '',
				showModalMinipro     : false, // 导入框
				appletUrl            : '',//小程序的封面链接
				appletInputTitle     : '',//小程序的标题
				appid                : '',//小程序的appid
				pageUrl              : '',//小程序page路径
				closeModalApplet     : false,//小程序弹窗封面选没选好
				modalAppletOk        : false,//判断小程序弹窗关闭时是否成功选择
				disabledSync         : 0,
				materialSync         : 0,
				materialSync1        : 0,
				disabledSync1        : 0,
				material_id0         : '',
				msgUrl1              : '',
				inputTitle1          : '',
				digest1              : '',
				url1                 : '',
				material_id11        : '',
				selectGroupId1       : '',
				appletUrl1           : '',
				appletInputTitle1    : '',
				appid1               : '',
				pageUrl1             : '',
				material_id31        : '',
				comefrom             : '',
				isShowChoose         : true,//是否展示最下面的选择分页
			};
		},

		methods: {
			moment,
			//左侧企业微信
			// handleWxId (value) {
			// 	this.isLoading = true
			// 	this.corpId = value
			// 	this.getWayList()
			// },
			// changeGroupId (corpId, groupId) {
			// 	if (this.corpId != corpId) {
			// 		this.getUserList()
			// 		this.getPartyList()
			// 	}
			// 	this.isLoading = true
			// 	this.corpId = corpId
			// 	this.groupId = groupId
			// 	this.selectedRowKeys = []
			// 	this.getWayList()
			// },

			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			// 多选框选择
			changeSelectKey (key) {
				for (let i = 0; i < this.selectedRowKeys.length; i++) {
					if (key == this.selectedRowKeys[i]) {
						this.selectedRowKeys.splice(i, 1)
						this.setCheckedBox(this.wayList)
						return false
					}
				}
				this.selectedRowKeys.push(key)
				this.setCheckedBox(this.wayList)
			},
			batchTypeChange () {
				if (!this.batchTypeValue) {
					// 添加
					if (this.batchType == 0) {
						// 当前页
						this.addKey(this.wayList)
						this.setCheckedBox(this.wayList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = [...this.wayKeys.valueOf()]
						this.setCheckedBox(this.wayList)
						// this.setCheckedBox(this.materialList2)
					}
				} else {
					// 移除
					if (this.batchType == 0) {
						// 当前
						this.removeKey(this.wayList)
						this.setCheckedBox(this.wayList)
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
						this.setCheckedBox(this.wayList)
					}
				}
			},
			changeBatchType () {
				this.batchTypeValue = false
				this.selectedRowKeys = []
				this.setCheckedBox(this.wayList)
			},
			// 增加当前页key
			addKey (materialList) {
				for (let i = 0; i < materialList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === materialList[i].key);
					if (index == -1) {
						this.selectedRowKeys.push(materialList[i].key)
					}
				}
			},
			// 删除当前页key
			removeKey (materialList) {
				for (let i = 0; i < materialList.length; i++) {
					let index = this.selectedRowKeys.findIndex((id) => id === materialList[i].key);
					if (index != -1) {
						this.selectedRowKeys.splice(index, 1)
					}
				}
			},
			// 设置列表卡片多选框选中状态
			setCheckedBox (materialList) {
				this.checkBoxValue = new Array(materialList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < materialList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys.length; j++) {
						if (materialList[i].key == this.selectedRowKeys[j]) {
							this.checkBoxValue[i] = true
						}
					}
				}
				if (this.batchType == 0) {
					this.batchTypeValue = true
					this.checkBoxValue.map(item => {
						if (!item) {
							this.batchTypeValue = false
						}
					})
				} else {
					if (this.selectedRowKeys.length == this.wayKeys.length) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}
			},
			// 高级设置
			addSetting () {
				this.editToken = this.token
				this.settingVisible = true
			},
			async handleOk () {
				this.settingLoading = true
				if (this.editToken == "") {
					this.$message.destroy()
					this.$message.error('请输入token!')
					this.settingLoading = false
					return false
				}
				const {data: res} = await this.axios.post('user/set-token', {
					uid     : localStorage.getItem('uid'),
					token_id: this.tokenId,
					token   : this.editToken
				})

				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg)
					this.settingLoading = false
				} else {
					this.settingLoading = false
					this.$message.success('设置成功')
					this.settingVisible = false
					this.getWayList(this.page, this.pageSize)
				}
			},
			handleCancel () {
				this.editToken = this.token
				this.settingLoading = false
				this.settingVisible = false
			},
			//同步配置了外部联系权限的联系人
			async syncFollowUser () {
				this.selectedRowKeys = []
				this.isLoading = true
				this.$message.info("已进入后台刷新中，请耐心等待...");
				const {data: res} = await this.axios.post('work-follow-user/refresh-follow-user', {
					suite_id: 1,
					corp_id : this.corpId,
				})

				if (res.error != 0) {
					this.$message.destroy()
					this.$message.error(res.error_msg)
					this.isLoading = false
				} else {
					this.$message.destroy()
					this.$message.success("同步完成！");
					this.isLoading = true
					this.getWayList()
				}
			},
			// 新建统计
			showModal () {
				this.$router.push('/channelCode/baiduAdd')
			},
			//获取表格内容
			async getWayList (page = 1, pageSize = this.pageSize) {
				const {data: res} = await this.axios.post("work-contact-way-baidu/list", {
					uid     : localStorage.getItem('uid'),
					suite_id: 1,
					corp_id : this.corpId,
					page    : page,
					pageSize: pageSize,
					type    : this.type,
					title   : this.title,
					// way_group_id: this.groupId
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
					this.confirmLoading = false
				} else {
					this.tokenId = res.data.token_id
					this.token = res.data.token
					this.wayKeys = res.data.keys
					this.wayList = res.data.contact_way_list;
					this.isLoading = false;
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					this.confirmLoading = false
					this.selectedRowKeys = []
					this.setCheckedBox(this.wayList)
					this.setCheckedBox(this.wayList)
				}
			},
			// 筛选
			selectTitle () {
				this.selectedRowKeys = []
				this.isLoading = true
				this.getWayList(1, this.pageSize);
			},
			clearTitle () {
				this.type = '0'
				this.title = ''
				this.selectedRowKeys = []
				this.isLoading = true
				this.getWayList(this.page, this.pageSize);
			},
			// 分页
			changePage (page, pageSize) {
				this.isLoading = true
				this.getWayList(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 100)
				})
			},
			showSizeChange (page, pageSize) {
				this.isLoading = true
				this.getWayList(1, pageSize);
			},
			//下载
			download (href, name) {
				let eleLink = document.createElement('a')
				eleLink.download = name
				eleLink.href = href
				eleLink.click()
				eleLink.remove()
			},
			downLoadWay (e) {
				let that = this
				let image = new Image()
				image.setAttribute('crossOrigin', 'anonymous')
				image.src = e.target.dataset.url
				image.onload = () => {
					let canvas = document.createElement('canvas')
					canvas.width = image.width
					canvas.height = image.height
					let ctx = canvas.getContext('2d')
					ctx.drawImage(image, 0, 0, image.width, image.height)
					canvas.toBlob((blob) => {
						let url = URL.createObjectURL(blob)
						that.download(url, e.target.dataset.name)
						// 用完释放URL对象
						URL.revokeObjectURL(url)
					})
				}
				// let url = e.target.dataset.url;
				//
				// let a = document.createElement('a')
				// let event = new MouseEvent('click')
				// // 下载图名字
				// a.download = e.target.dataset.name
				// //url
				// a.href = url
				// //合成函数，执行下载
				// a.dispatchEvent(event)

				// this.getBase64(url)
			},
			getBase64 (img) {
				var image = new Image();
				image.crossOrigin = 'anonymous';
				image.src = img;
				this.getBase64Image(image)
			},
			getBase64Image (img, width, height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
				var canvas = document.createElement("canvas");
				canvas.width = width ? width : img.width;
				canvas.height = height ? height : img.height;
				console.log(img, 'img')
				console.log(canvas, 'canvas')
				var ctx = canvas.getContext("2d");
				console.log(ctx, 'ctx')
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				var dataURL = canvas.toDataURL();
				console.log(dataURL, 'dataURL')
				return dataURL;
			},

			//客户
			customer (urlId) {
				this.usersVisible = true
				this.isLoading3 = true
				this.urlId = urlId
				this.page2 = 1
				this.pageSize2 = 15
				this.getCustomer()
			},
			//复制链接
			copyUrl (inputUrl) {
				var Url2 = inputUrl;
				var oInput = document.createElement("input");
				oInput.value = Url2;
				document.body.appendChild(oInput);
				oInput.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				oInput.className = "oInput";
				oInput.style.display = "none";
				this.$message.success('复制成功')
			},
			// statistics (id, title) {
			// 	this.$router.push({path: "/channelCode/statistics", query: {id: id, title: encodeURIComponent(title)}});
			// },
			async getCustomer (page = 1, pageSize = this.pageSize2) {
				const {data: res} = await this.axios.post('work-contact-way-baidu/get-custom', {
					way_id  : this.urlId,
					page    : page,
					pageSize: pageSize
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading3 = false
				} else {
					this.usersList2 = res.data.contact_way_list
					this.total2 = parseInt(res.data.count)
					this.isLoading3 = false
					this.page2 = page;
					this.pageSize2 = pageSize;
					this.quickJumper2 = this.total2 > this.pageSize2;
				}
			}
			,
			// 用户列表分页
			changePage2 (page, pageSize) {
				this.isLoading3 = true
				this.getCustomer(page, pageSize);
			}
			,
			showSizeChange2 (page, pageSize) {
				this.isLoading3 = true
				this.getCustomer(1, pageSize);
			}
			,
			//详情
			async getWayInfo (urlId) {
				const {data: res} = await this.axios.post('work-contact-way-baidu/get-info', {
					suite_id : 1,
					corp_id  : this.corpId,
					config_id: urlId,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.wayInfo = res.data.external_info[0]
					// console.log(this.wayInfo)
				}
			}
			,
			async preview (id, type, specialType) {
				const {data: res} = await this.axios.post('work-contact-way-baidu/get', {
					suite_id : 1,
					corp_id  : this.corpId,
					config_id: id,
					id       : id
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.batchEditType = false
					this.editType = type
					let wayInfo = res.data.contact_way
					this.specialTime = wayInfo.specialTime
					this.specialDateList = wayInfo.specialDateList
					this.specialWeekList = wayInfo.specialWeekList
					for (let i = 0; i < this.specialDateList.length; i++) {
						this.specialDateList[i]['specialDate'] = [new Date(), new Date()]
						this.specialDateList[i]['specialDate'][0] = moment(this.specialDateList[i].date[0], "YYYY-MM-DD")
						this.specialDateList[i]['specialDate'][1] = moment(this.specialDateList[i].date[1], "YYYY-MM-DD")
						for (let j = 0; j < this.specialDateList[i].time.length; j++) {
							this.specialDateList[i].time[j]['startTime'] = moment(new Date())
							this.specialDateList[i].time[j]['endTime'] = moment(new Date())
							this.specialDateList[i].time[j]['startTime'] = moment(this.specialDateList[i].time[j]['start_time'], "HH:mm")
							this.specialDateList[i].time[j]['endTime'] = moment(this.specialDateList[i].time[j]['end_time'], "HH:mm")
						}
					}
					let weekDay = ['mon', 'tues', 'wednes', 'thurs', 'fri', 'satur', 'sun']
					for (let k = 0; k < 7; k++) {
						let times = this.specialWeekList[0][weekDay[k]]
						for (let l = 0; l < times.length; l++) {
							times[l]['startTime'] = moment(times[l]['start_time'], 'HH:mm')
							times[l]['endTime'] = moment(times[l]['end_time'], 'HH:mm')
						}
					}
					this.specialModalTitle = '预览'
					this.specialType = specialType
					this.specialModal = true

					this.staffSelectDisabled = true
					if (this.editType == 1 && this.specialTime == 1) {
						let that = this
						let arr = []
						that.specialDateList.map((item, index) => {
							item.time.map((item2, index2) => {
								arr.push(item2.userList)
							})
						})
						that.$nextTick(() => {
							arr.map((item, index) => {
								that.$refs.staffSelect[index].userId = item
							})
						})
					}
				}
			},
			// moveQrcode (id, group, type) {
			// 	this.batchMoveType = type
			// 	this.qrCodeId = id
			// 	this.group = group
			// 	this.getGroupList()
			// 	this.groupVisible = true
			// },
			downLoad () {
				if (this.selectedRowKeys.length == 0) {
					return false
				}
				let that = this;
				that.$confirm({
					title     : "确定下载选中的二维码吗？",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.uploadQrcode();
					}
				});
			},
			async batchEdit (type) {
				const {data: res} = await this.axios.post("work-contact-way-baidu/edit-all", {
					ids : this.selectedRowKeys,
					type: 0
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.batchEditType = true
					this.editType = res.data.type
					this.specialTimeTitle = '添加'
					this.weekChecked = []
					this.specialWeekList = [
						{
							mon   : [],
							tues  : [],
							wednes: [],
							thurs : [],
							fri   : [],
							satur : [],
							sun   : [],
						},
					]
					this.specialTimeList = [
						{
							startTime : moment('00:00', 'HH:mm'),
							endTime   : moment('00:00', 'HH:mm'),
							start_time: '00:00',
							end_time  : '00:00',
							userList  : [],
							party     : []
						}
					]
					this.specialDateList = [
						{
							specialDate: [moment(new Date()), moment(new Date())],
							date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
							time       : [
								{
									startTime : moment('00:00', 'HH:mm'),
									endTime   : moment('00:00', 'HH:mm'),
									start_time: '00:00',
									end_time  : '00:00',
									userList  : [],
									party     : []
								}
							],
						}
					]
					this.specialTime = 1
					this.specialType = type
					this.specialModalTitle = '批量编辑成员'
					this.specialModal = true

					this.staffSelectDisabled = false
					let that = this
					if (type == 2) {
						that.$nextTick(() => {
							if (that.editType == 1 && that.$refs.staffSelect) {
								that.$refs.staffSelect.userId = []
							}
						})
					}
				}
			},
			async handleChangeSpecialTime () {
				if (this.specialType == 1) {
					this.specialTime = 0
					let weekList = this.specialWeekList[0]
					if (weekList.mon.length == 0 || weekList.tues.length == 0 || weekList.wednes.length == 0 || weekList.thurs.length == 0 || weekList.fri.length == 0 || weekList.satur.length == 0 || weekList.sun.length == 0) {
						this.$message.warning('周成员缺失')
						this.createDisabled = false
						return false
					}
				}
				if (this.specialType == 2 && this.specialTime == 1) {
					let dateFlag = false
					for (let i = 0; i < this.specialDateList.length; i++) {
						for (let j = i + 1; j < this.specialDateList.length; j++) {
							let dateList = this.specialDateList
							if ((dateList[j].date[0] >= dateList[i].date[0] && dateList[j].date[0] <= dateList[i].date[1]) || (dateList[j].date[1] >= dateList[i].date[0] && dateList[j].date[1] <= dateList[i].date[1])) {
								this.$message.warning('特殊时期' + (i + 1) + '和特殊时期' + (j + 1) + '存在冲突，请修改')
								dateFlag = true
								this.createDisabled = false
								return false
							}
						}
						for (let k = 0; k < this.specialDateList[i].time.length; k++) {
							// 判断开始时间是否小于结束时间
							if (this.specialDateList[i].time[k].start_time >= this.specialDateList[i].time[k].end_time && this.specialDateList[i].time[k].end_time != '00:00') {
								this.$message.warning("特殊时期" + (i + 1) + "的第" + (k + 1) + "个时间段开始时间需早于结束时间，请修改")
								dateFlag = true
								this.createDisabled = false
								return false
							}
							if (this.editType == 2 && this.specialDateList[i].time[k].userList.length == 0 && this.specialDateList[i].time[k].party.length == 0) {
								this.$message.warning('特殊时期' + (i + 1) + '的第' + (k + 1) + '个时间段请选择企业成员或企业部门')
								dateFlag = true
								this.createDisabled = false
								return false
							}
							if (this.editType == 1 && this.specialDateList[i].time[k].userList.length == 0) {
								this.$message.warning('特殊时期' + (i + 1) + '的第' + (k + 1) + '个时间段请选择企业成员')
								dateFlag = true
								this.createDisabled = false
								return false
							}
							for (let l = k + 1; l < this.specialDateList[i].time.length; l++) {
								if (this.specialDateList[i].time[l].start_time == '00:00' && this.specialDateList[i].time[l].end_time == '00:00') {
									this.$message.warning("特殊时期" + (i + 1) + "的第" + (l + 1) + "个时间段不能与默认时间段相同，请修改")
									dateFlag = true
									this.createDisabled = false
									return false
								}
								if (k != 0) {
									let startTime = this.specialDateList[i].time[k].start_time
									let endTime = this.specialDateList[i].time[k].end_time
									let startTime1 = this.specialDateList[i].time[l].start_time
									let endTime1 = this.specialDateList[i].time[l].end_time
									if ((startTime >= startTime1 && startTime < endTime1) || (endTime > startTime1 && endTime <= endTime1) || (startTime >= startTime1 && endTime1 == '00:00') || (endTime > startTime1 && endTime1 == '00:00') || (startTime1 >= startTime && startTime1 < endTime) || (endTime1 > startTime && endTime >= endTime1) || (startTime1 >= startTime && endTime == '00:00') || (endTime1 > startTime && endTime == '00:00')) {
										this.$message.warning("特殊时期" + (i + 1) + "的第" + (k + 1) + "个时间段与第" + (l + 1) + "个时间段存在冲突，请修改")
										dateFlag = true
										this.createDisabled = false
										return false
									}
								}
							}
							if (dateFlag) {
								this.createDisabled = false
								return false
							}
						}
						if (dateFlag) {
							this.createDisabled = false
							return false
						}
					}
					if (dateFlag) {
						this.createDisabled = false
						return false
					}
				}
				const {data: res} = await this.axios.post("work-contact-way-baidu/edit-all", {
					ids            : this.selectedRowKeys,
					type           : 1,
					specialType    : this.specialType,
					specialTime    : this.specialTime,
					specialWeekList: this.specialWeekList,
					specialDateList: this.specialDateList
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.$message.success("编辑成功")
					this.specialModal = false
					this.isLoading = true
					this.getWayList(this.page, this.pageSize)
				}
			},
			cancelChangeSpecialTime () {
				this.specialModal = false
			},
			// 特殊时间弹窗
			addSpecialTime () {
				this.specialTimeTitle = '新建'
				this.specialTimeVisible = true
				let that = this
				that.$nextTick(() => {
					if (that.editType == 1 && that.$refs.staffSelect2) {
						that.$refs.staffSelect2.userId = []
					}
				})
			},

			editSpecialTime (weekDay) {
				this.specialTimeTitle = '编辑'
				this.specialTimeList = JSON.parse(JSON.stringify(this.specialWeekList[0][weekDay]))
				this.specialTimeList.map((item) => {
					item.startTime = moment(item.start_time, 'HH:mm')
					item.endTime = moment(item.end_time, 'HH:mm')
				})
				this.weekChecked[this.weelArr[weekDay]] = true
				this.weekDayKey.push(weekDay)
				this.specialTimeVisible = true
				let that = this
				that.$nextTick(() => {
					that.specialTimeList.map((item, index) => {
						if (that.editType == 1) {
							that.$refs.staffSelect2[index].userId = item.userList
						}
					})
				})
			},
			handleSpecialTime () {
				this.addSpecialTimeLoading = true
				if (this.weekDayKey.length == 0) {
					this.$message.warning("请选择适用周期")
					this.addSpecialTimeLoading = false
					return false
				}
				for (let item of this.specialTimeList) {
					if (item.userList.length == 0 && item.party.length == 0 && this.type == 2) {
						this.$message.warning("请选择成员或企业微信部门")
						this.addSpecialTimeLoading = false
						return false
					}
					if (item.userList.length == 0 && this.type == 1) {
						this.$message.warning("请选择成员")
						this.addSpecialTimeLoading = false
						return false
					}
				}
				let flag = false
				for (let j = 1; j < this.specialTimeList.length; j++) {
					if (this.specialTimeList[j].start_time >= this.specialTimeList[j].end_time && this.specialTimeList[j].end_time != '00:00') {
						this.$message.warning("第" + (j + 1) + "个时间段开始时间需早于结束时间，请修改")
						flag = true
						this.addSpecialTimeLoading = false
						return false
					}
					if (this.specialTimeList[j].start_time == '00:00' && this.specialTimeList[j].end_time == '00:00') {
						this.$message.warning("第" + (j + 1) + "个时间段不能与默认时间段相同，请修改")
						flag = true
						this.addSpecialTimeLoading = false
						return false
					}
					for (let k = j + 1; k < this.specialTimeList.length; k++) {
						let startTime = this.specialTimeList[j].start_time
						let endTime = this.specialTimeList[j].end_time
						let startTime1 = this.specialTimeList[k].start_time
						let endTime1 = this.specialTimeList[k].end_time
						if ((startTime >= startTime1 && startTime < endTime1) || (endTime > startTime1 && endTime <= endTime1) || (startTime >= startTime1 && endTime1 == '00:00') || (endTime > startTime1 && endTime1 == '00:00') || (startTime1 >= startTime && startTime1 < endTime) || (endTime1 > startTime && endTime >= endTime1) || (startTime1 >= startTime && endTime == '00:00') || (endTime1 > startTime && endTime == '00:00')) {
							this.$message.warning("第" + (j + 1) + "个时间段与第" + (k + 1) + "个时间段存在冲突，请修改")
							flag = true
							this.addSpecialTimeLoading = false
							return false
						}
					}
				}
				if (flag) {
					return false
				}
				for (let weekDay of this.weekDayKey) {
					this.specialWeekList[0][weekDay] = []
					this.specialWeekList[0][weekDay] = this.specialTimeList
				}
				this.specialTimeVisible = false
				this.addSpecialTimeLoading = false
				this.weekDayKey = []
				this.weekChecked = new Array(7).fill(false)
				this.specialTimeList = [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : []
					}
				]
			},
			handleCancelSpecialTime () {
				this.specialTimeVisible = false
				this.weekDayKey = []
				this.weekChecked = new Array(7).fill(false)
				this.specialTimeUserList = []
				this.specialTimeList = [
					{
						startTime : moment('00:00', 'HH:mm'),
						endTime   : moment('00:00', 'HH:mm'),
						start_time: '00:00',
						end_time  : '00:00',
						userList  : [],
						party     : []
					}
				]
			},
			// 修改特殊开始时间
			changeStartTime (e, index) {
				this.specialTimeList[index].startTime = e
				this.specialTimeList[index].start_time = moment(this.specialTimeList[index].startTime).format("HH:mm")
				if (this.specialTimeList[index].start_time >= this.specialTimeList[index].end_time && this.specialTimeList[index].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
				this.$forceUpdate()
			},
			// 修改特殊结束时间
			changeEndTime (e, index) {
				this.specialTimeList[index].endTime = e
				this.specialTimeList[index].end_time = moment(this.specialTimeList[index].endTime).format("HH:mm")
				if (this.specialTimeList[index].start_time >= this.specialTimeList[index].end_time && this.specialTimeList[index].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
			},
			// 添加时间
			addTime (index) {
				let special = {
					start_time: '00:00',
					end_time  : '00:00',
					startTime : moment("00:00", "HH:mm"),
					endTime   : moment("00:00", "HH:mm"),
					userList  : [],
					party     : []
				}
				this.specialTimeList.splice(index + 1, 0, special)
			},
			deleteTime (index) {
				this.specialTimeList.splice(index, 1)
			},
			changeWeekDay (key) {
				Array.prototype.indexOf = function (val) {
					for (let i = 0; i < this.length; i++) {
						if (this[i] == val) return i
					}
					return -1
				}
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val)
					if (index > -1) {
						this.splice(index, 1)
					}
				}
				if (this.weekDayKey.indexOf(key) != -1) {
					this.weekDayKey.remove(key)
				} else {
					this.weekDayKey.push(key)
				}
			},
			// 特殊时间切换
			changeSpecilTime () {
				this.specialTime = (this.specialTime + 1) % 2
			},
			disabledDateDay (current) {
				return current.valueOf() < new Date().getTime() - 86400000;
			},
			changeSpecialDate (e, index) {
				if (e && e.length > 1) {
					this.specialDateList[index].specialDate = e
					this.specialDateList[index].date = [moment(e[0]).format("YYYY-MM-DD"), moment(e[1]).format("YYYY-MM-DD")]
				}
				this.$forceUpdate()
			},
			changeSpecialStartTime (e, index, timeIndex) {
				this.specialDateList[index].time[timeIndex].startTime = e
				this.specialDateList[index].time[timeIndex].start_time = moment(e).format("HH:mm")
				if (this.specialDateList[index].time[timeIndex].start_time >= this.specialDateList[index].time[timeIndex].end_time && this.specialDateList[index].time[timeIndex].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
				this.$forceUpdate()
			},
			changeSpecialEndTime (e, index, timeIndex) {
				this.specialDateList[index].time[timeIndex].endTime = e
				this.specialDateList[index].time[timeIndex].end_time = moment(e).format("HH:mm")
				if (this.specialDateList[index].time[timeIndex].start_time >= this.specialDateList[index].time[timeIndex].end_time && this.specialDateList[index].time[timeIndex].end_time != '00:00') {
					this.$message.warning('开始时间需早于结束时间')
				}
				this.$forceUpdate()
			},
			//选择成员组件回调->按特殊时期编辑
			selectStaffCallback (event, id, index, index2) {
				if (event == "ok") {
					this.specialDateList[index].time[index2].userList = id
				}
			},
			//选择成员组件回调->按周期编辑
			selectStaffCallback2 (event, id, index) {
				if (event == "ok") {
					this.specialTimeList[index].userList = id
				}
			},
			addSpecialDateTimeList (index, timeIndex) {
				let time = {
					startTime : moment('00:00', 'HH:mm'),
					endTime   : moment('00:00', 'HH:mm'),
					start_time: '00:00',
					end_time  : '00:00',
					userList  : [],
					party     : []
				}
				this.specialDateList[index].time.splice(timeIndex + 1, 0, time)
			},
			deleteSpecialDateTimeList (index, timeIndex) {
				this.specialDateList[index].time.splice(timeIndex, 1)
			},
			addSpecialDate (index) {
				let specialDate = {
					specialDate: [moment(new Date()), moment(new Date())],
					date       : [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
					time       : [
						{
							startTime : moment('00:00', 'HH:mm'),
							endTime   : moment('00:00', 'HH:mm'),
							start_time: '00:00',
							end_time  : '00:00',
							userList  : [],
							party     : []
						}
					],
				}
				this.specialDateList.splice(index + 1, 0, specialDate)
			},
			deleteSpecialDate (index) {
				this.specialDateList.splice(index, 1)
			},
			getUserNum (userList) {
				let num = 0
				for (let i = 0; i < userList.length; i++) {
					if (userList[i].scopedSlots.title == "custom") {
						num++
					}
				}
				return num
			},
			getPartyNum (userList) {
				let num = 0
				for (let i = 0; i < userList.length; i++) {
					if (userList[i].scopedSlots.title != "custom") {
						num++
					}
				}
				return num
			},

			getThreePartyIndex (userList) {
				let num = 0
				let index = 0
				for (let i = 0; i < userList.length; i++) {
					index = i
					if (num < 2) {
						if (userList[i].scopedSlots.title != "custom") {
							num++
						}
					} else {
						return index
					}
				}
				return index
			},
			// 选择成员弹窗显示
			showDepartmentList (index, type, timeIndex) {
				if (type == 1) {
					this.currentIndex = index
					this.currentType = type
					let arr = []
					this.specialTimeList[index].userList.map(x => {
						arr.push(x.id)
					})
					this.chooseDepartmentNum = this.specialTimeList[index].userList.length
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.specialTimeList[index].userList))
				} else {
					this.currentIndex = index
					this.timeIndex = timeIndex
					this.currentType = type
					let arr = []
					this.specialDateList[index].time[timeIndex].userList.map(x => {
						arr.push(x.id)
					})
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.specialDateList[index].time[timeIndex].userList))
				}
				this.specialTimeVisible = false
				this.showModalDepartment = true
			},
			setUser (users) {
				let that = this
				let checkedKeys = []
				let user = []
				let selectUser = []
				let u = {
					avatar     : "",
					disabled   : false,
					id         : '',
					key        : '',
					scopedSlots: {
						title: "custom"
					},
					title      : ''
				}
				if (users.length > 0) {
					users.map(item => {
						u.avatar = item.avatar
						u.id = item.id
						u.title = item.name
						if (item.user_key.toString().indexOf(",") > 0) {
							let arr = item.user_key.split(',')
							checkedKeys = checkedKeys.concat(arr)
							u.key = arr[0]
							user.push(JSON.parse(JSON.stringify(u)))
							u.key = item.user_key
							selectUser.push(JSON.parse(JSON.stringify(u)))
						} else {
							checkedKeys.push(item.user_key)
							u.key = item.user_key
							user.push(JSON.parse(JSON.stringify(u)))
							selectUser.push(JSON.parse(JSON.stringify(u)))
						}
					})
				}
				that.$refs.user.checkedKeys = checkedKeys
				that.$refs.user.checkedKeysArr = checkedKeys
				that.$refs.user.checkedNodes = checkedKeys
				that.$refs.user.staffListArr = user
				that.chooseDepartmentNum = user.length
				that.$refs.user.keyList = selectUser
			},
			// 重置成员
			clearDepartmentList (index, type) {
				if (type == 1) {
					this.specialTimeList[index].userList = []
				} else if (type == 2) {
					this.specialTimeUserList = []
				} else {
					this.chooseNum = 0
				}
				this.$refs.user.checkedKeys = []
				this.$refs.user.staffList = []
				this.$refs.user.keyList = []
				this.$refs.user.staffListArr = []
				// this.getCustomList()
			},
			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.currentType == 1) {
						this.specialTimeList[this.currentIndex].userList = []
						if (userNum + departmentNum > 0) {
							list.map(item => {
								this.specialTimeList[this.currentIndex].userList.push(JSON.parse(JSON.stringify(item)))
								if (item.scopedSlots.title != "custom") {
									this.specialTimeList[this.currentIndex].party.push(item.ids)
								}
							})
						}
						this.specialTimeVisible = true
					} else {
						this.specialDateList[this.currentIndex].time[this.timeIndex].userList = []
						if (userNum + departmentNum > 0) {
							list.map(item => {
								this.specialDateList[this.currentIndex].time[this.timeIndex].userList.push(JSON.parse(JSON.stringify(item)))
								if (item.scopedSlots.title != "custom") {
									this.specialDateList[this.currentIndex].time[this.timeIndex].party.push(item.ids)
								}
							})
						}
					}
				} else {
					if (this.currentType == 1) {
						this.specialTimeVisible = true
					}
				}
				this.showModalDepartment = false
			},
			async getUserList () {
				const {data: res} = await this.axios.post('work-user/get-all-user', {
					suite_id: 1,
					corp_id : this.corpId,
					is_all  : 1,//不带分页
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.isLoading = false;
				} else {
					this.user = res.data.info
				}
			},
			async getPartyList () {
				const {data: res} = await this.axios.post('work-contact-way/get-party-list', {
					suite_id: 1,
					corp_id : this.corpId,
				})

				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false;
					this.party = res.data.party_list
				}
			},
			async uploadQrcode () {
				const {data: res} = await this.axios.post("attachment/batch-down", {
					uid    : localStorage.getItem("uid"),
					corp_id: this.corpId,
					ids    : this.selectedRowKeys,
					type   : 1
				}, {
					responseType: 'blob'
				});
				if (res.size == 0) {
					this.$message.error("下载失败！")
				} else {
					const blob = res
					const reader = new FileReader()
					reader.readAsDataURL(blob);
					reader.onload = (e) => {
						const a = document.createElement('a')
						let name = moment(new Date()).format("YYYYMMDDHHmmss")
						a.download = name + '.zip'
						a.href = e.target.result
						document.body.appendChild(a)
						a.click()
						document.body.removeChild(a)
					};
					this.selectedRowKeys = []
					this.setCheckedBox(this.wayList)
				}
			},
			// async getGroupList () {
			// 	const {data: res} = await this.axios.post("work-contact-way-baidu/group", {
			// 		uid    : localStorage.getItem('uid'),
			// 		corp_id: this.corpId
			// 	});
			// 	if (res.error != 0) {
			// 		this.$message.error(res.error_msg);
			// 	} else {
			// 		this.groupList = res.data.group;
			// 		if (!this.group) {
			// 			this.group = this.groupList[0].key
			// 		}
			// 	}
			// },
			onselect (e) {
				if (e.length > 0) {
					this.group = e[0]
				}
			},
			handleChangeGroup () {
				if (this.batchMoveType == 0) {
					this.moveQrcode1(this.qrCodeId)
				} else {
					this.moveQrcode1(this.selectedRowKeys)
				}
			},
			async moveQrcode1 (id) {
				const {data: res} = await this.axios.post("work-contact-way-baidu/group-change", {
					uid     : localStorage.getItem('uid'),
					corp_id : this.corpId,
					group_id: this.group,
					way_id  : id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.batchTypeValue = false
					this.batchType = '1'
					this.qrCodeId = ''
					this.selectedRowKeys = []
					this.group = ''
					this.groupVisible = false
					this.isLoading = true
					this.selectedRowKeys = []
					this.setCheckedBox(this.wayList)
					this.getWayList(1, this.pageSize)
					// this.$refs.menu.getGroupList()
				}
			},
			cancelChangeGroup () {
				this.qrCodeId = ''
				this.group = ''
				this.groupVisible = false
			},
			//编辑
			modifyWay (urlId) {
				this.$router.push({path: "/channelCode/baiduAdd", query: {id: urlId}});
			}
			,
			async batchEditWelCome () {
				this.resetWelcome()
				this.welComeVisible = true
			},
			resetWelcome () {
				this.pushValue = true
				this.img = false
				this.textAreaValueHeader = ''
				this.textContent = ''
				this.chooseId = 0//选择的图片id
				this.sketchAddType = 1 // 新建或导入
				this.sketchAddType1 = 1
				this.url = ''//网址弹窗输入的网址
				this.closeShowModal3 = false//网址弹窗封面选没选好
				this.msgUrl = ''//网址弹窗封面选好的url
				this.inputTitle = ''//网址弹窗输入标题
				this.digest = ''//网址弹窗输入描述
				this.index = 0//判断是图片打开素材弹窗还是链接打开，1是图片，2是链接，3是小程序
				this.modalUrlOk = false//判断网址弹窗关闭时是否成功选择
				this.showModalApplet = false//小程序弹窗的显示与隐藏
				this.miniproAddType = 1 // 新建或导入
				this.miniproAddType1 = 1
				this.material_id3 = ''
				this.showModalMinipro = false // 导入框
				this.appletUrl = ''//小程序的封面链接
				this.appletInputTitle = ''//小程序的标题
				this.appid = ''//小程序的appid
				this.pageUrl = ''//小程序page路径
				this.closeModalApplet = false//小程序弹窗封面选没选好
				this.modalAppletOk = false//判断小程序弹窗关闭时是否成功选择
				this.disabledSync = 0
				this.materialSync = 0
				// this.materialSync1 = 0
				// this.disabledSync1 = 0
				// this.material_id0 = ''
				// this.msgUrl1 = ''
				// this.inputTitle1 = ''
				// this.digest1 = ''
				// this.url1 = ''
				// this.material_id11 = ''
				// this.selectGroupId1 = ''
				// this.appletUrl1 = ''
				// this.appletInputTitle1 = ''
				// this.appid1 = ''
				// this.pageUrl1 = ''
				// this.material_id31 = ''
			},
			//扫码推送
			changeStatus (value) {
				// console.log(value)
				this.pushValue = value
			}
			,
			//素材同步
			changeMaterialSync () {
				if (this.materialSync1 == 1) {
					this.getGroup()
				}
			},
			//获取内容引擎分组列表
			async getGroup (key) {
				const {data: res} = await this.axios.post("attachment/group", {
					uid       : localStorage.getItem('uid'),
					is_channel: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList1 = res.data.group
					this.selectGroupId1 = key || this.groupList1[0].key
				}
			},
			async handleWelcome () {
				if (this.pushValue && this.textAreaValueHeader == "" && this.img == "" && !this.modalUrlOk && !this.modalAppletOk) {
					this.$message.warning("内容不能为空")
					this.createDisabled = false
					return false
				}
				let sendData = {}
				sendData.uid = localStorage.getItem('uid')
				sendData.status = this.pushValue ? 1 : 0
				sendData.add_type = this.index
				sendData.text_content = this.textContent
				sendData.media_id = this.material_id
				sendData.link_title = this.inputTitle
				sendData.link_attachment_id = this.material_id
				sendData.link_desc = this.digest
				sendData.link_url = this.url
				sendData.mini_title = this.appletInputTitle
				sendData.mini_pic_media_id = this.material_id
				sendData.mini_appid = this.appid
				sendData.mini_page = this.pageUrl
				sendData.attachment_id = this.material_id3 || this.material_id1
				sendData.materialSync = this.materialSync
				sendData.groupId = this.selectGroupId
				sendData.ids = this.selectedRowKeys
				const {data: res} = await this.axios.post("work-contact-way-baidu/edit-welcome", sendData);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$message.success("编辑成功")
					this.welComeVisible = false
					this.isLoading = true
					this.resetWelcome()
					this.getWayList(this.page, this.pageSize)
				}
			},
			handleCancleWelcome () {
				this.resetWelcome()
				this.welComeVisible = false
			},
			//让颜色插件浮层渲染到父节点上
			getPopupContainer2 (trigger) {
				return trigger;
			},
			visibleChange (val) {
				if (!val) {
					this.popoverKey++
				}
			},
			//选择图片、选择网址封面
			choosePic (index) {
				if (index == 3) {
					this.comefrom = '3'
				} else {
					this.comefrom = '1'
				}
				if (index == 1) {
					this.chooseId = Number(this.material_id || 0)
				} else {
					this.chooseId = Number(this.material_id0 || 0)
				}
				// this.chooseId = Number(this.material_id0 || 0)
				this.typeValue2 = 2
				this.showModal3 = true
				this.popVisible = false
				this.showModalUrl = false
				this.showModalApplet = false
				this.index = index
			},
			// 图文新建/导入
			changeSketchAddType () {
				if (this.sketchAddType == 0) {
					this.materialSync1 = 0
				}
				this.disabledSync1 = 0
				this.msgUrl1 = ''
				this.inputTitle1 = ''
				this.digest1 = ''
				this.url1 = ''
				this.closeShowModal3 = false
				// this.modalUrlOk = false
				this.material_id0 = ''
				this.material_id11 = ''
			},
			// 小程序新建/导入
			changeMiniproAddType () {
				if (this.sketchAddType == 0) {
					this.materialSync = 0
				}
				this.disabledSync1 = 0
				// this.modalAppletOk = false
				this.appletUrl1 = ''
				this.appletInputTitle1 = ''
				this.appid1 = ''
				this.pageUrl1 = ''
				this.closeShowModal3 = false
				this.closeModalApplet = false
				// this.modalUrlOk = false
				this.material_id0 = ''
				this.material_id31 = ''
			},
			//打开网址弹窗
			chooseUrl (index) {
				this.showModalUrl = true
				this.popVisible = false
				if (this.index !== index) {
					this.msgUrl = ''
					this.inputTitle = ''
					this.digest = ''
					this.url = ''
					this.closeShowModal3 = false
					this.modalUrlOk = false
					this.material_id = ''
					this.material_id1 = ''
					this.selectGroupId = ""
					this.materialSync = 0
					this.disabledSync = 0
				}
				if (this.sketchAddType1 == 1 && this.msgUrl) {
					this.closeShowModal3 = true
				}
				this.msgUrl1 = this.msgUrl
				this.inputTitle1 = this.inputTitle
				this.digest1 = this.digest
				this.url1 = this.url
				this.material_id0 = this.material_id
				this.material_id11 = this.material_id1
				this.sketchAddType = this.sketchAddType1
				this.selectGroupId1 = this.selectGroupId
				this.materialSync1 = this.materialSync
				this.disabledSync1 = this.disabledSync
				this.index = index
			},
			// 素材弹窗
			openShowModal () {
				this.comefrom = '1'
				if (this.material_id11) {
					this.chooseId = Number(this.material_id11)
				} else {
					this.chooseId = 0
				}
				this.comefrom = '1'
				this.typeValue2 = 1
				this.showModal3 = true
				this.popVisible = false
				this.showModalUrl = false
			},
			// 打开小程序素材弹窗
			openShowModalMinipro () {
				if (this.material_id31) {
					this.chooseId = Number(this.material_id31)
				} else {
					this.chooseId = 0
				}
				this.typeValue2 = 7
				this.showModalMinipro = true
				this.popVisible = false
				this.showModalUrl = false
			},
			// 图文弹窗确认
			handleUrl () {
				let reg = /^([hH][tT]{2}[pP]:|[hH][tT]{2}[pP][sS]:)((\\|\/)+)/;
				if (this.sketchAddType == 1) {
					if (this.msgUrl1 == '') {
						this.$message.error('请选择图片封面')
						return false;
					} else if (this.inputTitle1 == '') {
						this.$message.error('请填写标题')
						return false;
					} else if (!reg.test(this.url1)) {
						this.$message.error('请检查跳转链接格式是否正确(https://或http://开头)')
						return false;
					}
				} else {
					if (this.material_id11 == '') {
						this.$message.error('请选择图文')
						return false;
					}
				}
				this.sketchAddType1 = this.sketchAddType
				this.msgUrl = this.msgUrl1
				this.inputTitle = this.inputTitle1
				this.digest = this.digest1
				this.url = this.url1
				this.materialSync = this.materialSync1
				this.selectGroupId = this.selectGroupId1
				this.material_id1 = this.material_id11
				this.material_id = this.material_id0
				this.selectGroupId1 = this.selectGroupId
				this.showModalUrl = false
				this.modalUrlOk = true
			},
			// 图文弹窗取消啊
			handleCancelUrl () {
				if (!this.modalUrlOk) {
					this.material_id1 = ''
					this.msgUrl = ''
					this.inputTitle = ''
					this.digest = ''
					this.url = ''
					this.closeShowModal3 = false
					this.index = 0
				}
				this.showModalUrl = false
			},
			// 选择小程序回调
			modalVisibleChange2 (event, e, id, item) {
				if (event == "ok") {
					if (this.index == 3 && this.miniproAddType == 1) {
						this.$refs.cropper.edit(item.local_path, item.file_name)
					} else if (this.index == 3 && this.miniproAddType == 0) {
						this.appletInputTitle1 = item.file_name
						this.appletUrl1 = item.local_path
						this.material_id31 = id
						this.closeModalApplet = true
						this.showModalApplet = true
					} else {
						this.uploadMedia(id)
					}
				} else {
					if (this.index == 1) {
						if (!this.img) {
							this.index = 0
						}
					} else if (this.index == 2) {
						this.showModalUrl = true
						// this.closeShowModal3 = false
					} else if (this.index == 3) {
						// this.closeModalApplet = false
						this.showModalApplet = true
					}
				}
				this.showModalMinipro = false
				this.showModal3 = false
			},
			// 小程序封面裁剪取消
			cancleAppletPic () {
				this.showModalApplet = true
			},
			// 小程序封面裁剪上传
			uploadAppletPic (id, url) {
				this.uploadMedia(id)
			},
			//上传素材，将素材传给企业微信
			async uploadMedia (id) {
				const {data: res} = await this.axios.post("work-material/upload-media", {
					corp_id      : this.corpId,
					suite_id     : this.suite_id,
					attachment_id: id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if (isNaN(id) || id == '') {
						this.$message.error('请选择素材')
					} else {
						if (this.index == 1) {
							//图片选择素材
							this.material_id = res.data.id
							this.img = res.data.local_path
							this.fileName = res.data.file_name
						} else if (this.index == 2) {
							if (this.sketchAddType == 0) {
								this.material_id11 = id
								this.msgUrl1 = res.data.artList[0].qy_local_path
								this.url1 = res.data.artList[0].content_source_url
								this.inputTitle1 = res.data.artList[0].title
								this.digest1 = res.data.artList[0].digest
								// this.url = res.data.artList[0].local_path
							} else {
								this.material_id0 = id
								this.msgUrl1 = res.data.local_path
							}
							this.showModalUrl = true
							this.closeShowModal3 = true
						} else if (this.index == 3) {
							this.material_id0 = id
							this.appletUrl1 = res.data.local_path
							this.closeModalApplet = true
							this.showModalApplet = true
						}
					}
				}
			},
			//打开小程序弹窗
			chooseApplet (index) {
				this.showModalApplet = true
				this.popVisible = false
				if (this.index !== index) {
					this.appletUrl = ''
					this.appletInputTitle = ''
					this.appid = ''
					this.pageUrl = ''
					this.closeModalApplet = false
					this.materialSync = 0
					this.disabledSync = 0
				}
				if (this.miniproAddType1 == 1 && this.appletUrl) {
					this.closeModalApplet = true
				}
				this.appletUrl1 = this.appletUrl
				this.appletInputTitle1 = this.appletInputTitle
				this.appid1 = this.appid
				this.pageUrl1 = this.pageUrl
				this.material_id0 = this.material_id
				this.material_id31 = this.material_id3
				this.selectGroupId1 = this.selectGroupId
				this.miniproAddType = this.miniproAddType1
				this.materialSync1 = this.materialSync
				this.disabledSync1 = this.disabledSync
				this.index = index
			},
			// 小程序弹窗确认
			handleApplet () {
				if (this.miniproAddType == 1) {
					if (this.appletUrl1 == '') {
						this.$message.error('请选择图片封面')
						return false;
					} else if (this.appletInputTitle1 == '') {
						this.$message.error('请填写标题')
						return false;
					} else if (this.appletInputTitle1.length < 4) {
						this.$message.error('小程序标题长度需在4-12个字符')
						return false;
					} else if (this.appid1 == '') {
						this.$message.error('请填写小程序AppID')
						return false;
					} else if (this.pageUrl1 == '') {
						this.$message.error('请填写小程序路径')
						return false;
					}
				} else {
					if (this.material_id31 == '') {
						this.$message.error('请选择小程序')
						return false;
					}
				}
				this.miniproAddType1 = this.miniproAddType
				this.appletUrl = this.appletUrl1
				this.appletInputTitle = this.appletInputTitle1
				this.appid = this.appid1
				this.pageUrl = this.pageUrl1
				this.material_id3 = this.material_id31
				this.material_id = this.material_id0
				this.selectGroupId = this.selectGroupId1
				this.materialSync = this.materialSync1

				this.showModalApplet = false
				this.modalAppletOk = true
			},
			// 小程序弹窗取消
			handleCancelApplet () {
				this.showModalApplet = false
				if (!this.modalAppletOk) {
					this.material_id3 = ''
					this.appletUrl = ''
					this.appletInputTitle = ''
					this.appid = ''
					this.pageUrl = ''
					this.closeModalApplet = false
					this.index = 0
				}
			},
			// 校验小程序标题长度
			checkout (title) {
				if (title.length < 4) {
					this.$message.warning('小程序标题长度需在4-12个字符')
				}
			},
			//小叉号删除选中的图片、网址、小程序
			deleteWelcome () {
				this.disabledSync = 0
				this.img = ''
				this.msgUrl = ''
				this.inputTitle = ''
				this.digest = ''
				this.url = ''
				this.index = 0
				this.closeShowModal3 = false
				this.modalUrlOk = false
				this.appletUrl = ''
				this.appletInputTitle = ''
				this.appid = ''
				this.pageUrl = ''
				this.closeModalApplet = false
				this.modalAppletOk = false
				this.material_id = ''
				this.material_id1 = ''
				this.material_id3 = ''
			},
			// 初始化文本信息的格式
			initTextMsgContent (content) {
				const _this = this
				if (content.search(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g) !== -1) {
					WEmoji.wechatEmojiKey.map(alt => {
						let preg = new RegExp(_this.utils.addslashes(alt), "g")
						let emojiUrl = WEmoji.getEmojiUrl(alt)
						content = content.replace(
							preg,
							'<img src="' +
							emojiUrl +
							'" alt="' +
							alt +
							'" height="21" width="21"/>'
						)
					})
				}

				return content.replace(/[\r\n|\n]/g, "<br/>")
			}
			,
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
			}
			,
			changeText (text, textVale) {
				this.textContent = text
				this.textAreaValueHeader = textVale
			}
		},

		created () {
			let that = this
			document.addEventListener("selectionchange", function () {
				that.getCursor(self)
			})
			if (localStorage.getItem('permissionButton') == 'all') {
				this.isShowChoose = true
			} else {
				let permissionButton = localStorage.getItem('permissionButton').split(',')
				if (permissionButton.indexOf('channel-group-move') == -1 && permissionButton.indexOf('channel-down') == -1 && permissionButton.indexOf('channel-edit') == -1) {
					this.isShowChoose = false
				} else {
					this.isShowChoose = true
				}
			}
			this.getWayList()
			this.getUserList()
			this.getPartyList()
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/channelCode/baiduAdd' && (typeof to.query.groupId != 'undefined' || to.query.isRefresh == 1)) {
				next(vm => {
					vm.getWayList(vm.page, vm.pageSize);
				});
			} else {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.type = '0'
					vm.title = ''
					vm.selectedRowKeys = []
					vm.isLoading = true
					vm.page = 1
					vm.pageSize = 15
					vm.groupId = ''
					vm.batchType = '1'
					vm.batchTypeValue = false
					vm.getWayList();
				});
			}

			next()
		},
	}
	;
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		border: 1px solid #D9D9D9;
		height: 110px;
		overflow: auto;

		/deep/ p {
			margin: 0;
			/*display: inline-block;*/
			word-break: break-word;
		}
	}

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

	.content-msg1 {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 0px 0px 5px 10px;
		text-align: left;
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

	.actionBtn {
		margin-right: 5px;
		margin-bottom: 5px;
	}

	/deep/ .ant-checkbox-inner {
		width: 23px;
		height: 23px;
	}

	/deep/ .ant-checkbox-inner:after {
		width: 6px;
		height: 12px;
		transform: rotate(45deg) scale(1) translate(-45%, -62%);
	}

	.active1 {
		color: #01b065;
	}

	/deep/ .ant-tree-switcher-icon {
		vertical-align: initial;
	}

	/deep/ .ant-tree-node-content-wrapper.ant-tree-node-selected {
		background-color: #FFFFFF !important;
	}

	.group-tree::-webkit-scrollbar {
		width: 4px;
		height: 4px;
	}

	.group-tree::-webkit-scrollbar-track-piece {
		background-color: #FFFFFF;
	}

	.group-tree::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
		background: #FFFFFF;
	}

	.border-dashed {
		border-bottom: 1px dashed #E2E2E2;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	.pull-right {
		width: 400px;
		max-height: 630px;
		height: 360px;
		background: #FFF;
		border: 1px solid #D8D8D8;
		padding: 24px;
		overflow: hidden;
	}

	.fl {
		float: left;
	}

	.url-text {
		float: left;
		max-width: calc(100% - 74px);
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		color: #A3A3A3;
	}

	.msg_content_txt {
		width: calc(100% - 46px);
		border: 1px solid #E9E9E9;
		padding: 10px 16px;
		border-radius: 4px;
		font-size: 14px;
		color: #1A1A1A;
		background: #FFF;
		float: left;
		word-break: break-word;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	.upload-wrap {
		width: 96px;
		height: 96px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		background: #FFF;
		cursor: pointer;
		margin-bottom: 10px;
		float: left;
	}

	.upload-plus {
		font-size: 32px;
		line-height: 96px;
		font-weight: 300;
		color: #686868;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
		margin-bottom: 10px;
	}

	.upload-border {
		background: #FFFFFF;
		border: 1px dotted #D8D8D8;
		height: 110px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		margin-bottom: 10px;
	}

	/deep/ .ant-form-item-children {
		display: block;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	.popover-menu {
		cursor: pointer;
		text-align: center;
		display: inline-block;
		width: 80px;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}

	.popover-menu1, .popover-menu2 {
		margin-left: 10px;
	}

	.popover-menu p {
		margin-bottom: 5px;
	}

	.content {
		border: 1px solid #E2E2E2;
		min-width: 760px;
		position: absolute;
		top: 20px;
		left: 20px;
		right: 20px;
		background-color: #FAFAFA;
		margin-bottom: 20px;
	}

	.wrap {
		display: inline-block;
		border: 1px solid #E2D6D6;
		margin: auto;
		height: 445px;
		width: 250px;
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
	}

	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
	}
</style>
