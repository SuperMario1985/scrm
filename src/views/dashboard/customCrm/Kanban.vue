<template>
	<div style="width: 100%;height:100%;">
		<div style="height:100%;">
			<!-- <a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">客户看板</label>
			</a-card> -->
			<div style="padding: 20px 20px 0;">
				<span @click="changeTab(1)" class="tabBtn" :class="{activeBtn:tabKey == 1}">企微客户</span>
				<span @click="changeTab(2)" class="tabBtn" :class="{activeBtn:tabKey == 2}">非企微客户</span>
			</div>
			<div v-show="tabKey == 1" style="height: calc(100% - 122px);">
				<a-row style="margin:0 20px 20px;padding:20px 20px 5px;background: #FFF;line-height: 40px;"
				       ref="searchArea">
				<span class="select-option">
					<label style="margin-right: 5px;">客户类型：</label>
					<a-cascader :options="customerType"
					            v-model="corpType"
					            change-on-select
					            :show-search="{ filter }"
					            placeholder="请选择"
					            style="margin-right: 5px;width: 210px;"/>
					<!--					<label style="margin-right: 5px;">企业微信：</label>-->
					<!--					<a-select-->
					<!--							showSearch-->
					<!--							optionFilterProp="children"-->
					<!--							style="width: 210px;margin-right: 5px;"-->
					<!--							@change="changeWx"-->
					<!--							v-model="corpId"-->
					<!--							v-if="corpLen > 1"-->
					<!--					>-->
					<!--						<template v-for="item in corpInfo">-->
					<!--							<a-select-option :value="item.corpid">-->
					<!--								{{item.corp_name}}-->
					<!--							</a-select-option>-->
					<!--						</template>-->
					<!--					</a-select>-->
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">关键词：</label>
				<a-input
						@keyup.enter="find"
						placeholder="客户姓名/昵称/备注/公司名称"
						style="width: 210px;margin-right: 5px;"
						v-model="name"
				/>
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">手机号：</label>
				<a-input
						@keyup.enter="find"
						placeholder="请输入手机号码"
						style="width: 210px;margin-right: 5px;"
						v-model="phone"
				/>
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">是否粉丝：</label>
				<a-select
						showSearch
						optionFilterProp="children"
						style="width: 210px;margin-right: 5px;"
						v-model="is_fans"
				>
										<a-select-option :value="0">全部</a-select-option>
										<a-select-option :value="1">是</a-select-option>
										<a-select-option :value="2">否</a-select-option>
									</a-select>
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">联系时间：</label>
				<a-select
						style="width: 210px;margin-right: 5px;"
						v-model="timeType"
						:dropdownStyle="{width:'200px'}"
				>
					<a-select-option :value="0">全部客户</a-select-option>
					<a-select-option :value="1">一直未沟通</a-select-option>
					<a-select-option :value="2">近3天未联系</a-select-option>
					<a-select-option :value="3">近7天未联系</a-select-option>
					<a-select-option :value="4">近15天未联系</a-select-option>
					<a-select-option :value="5">近30天未联系</a-select-option>
					<a-select-option :value="6">近90天未联系</a-select-option>
					<a-select-option :value="7">近180天未联系</a-select-option>
					<a-select-option :value="8">近一年未联系</a-select-option>
					<a-select-option :value="9">一年以上未联系</a-select-option>
				</a-select>
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">排序方式：</label>
				<a-select
						style="width: 210px;margin-right: 5px;"
						v-model="sortType"
				>
					<a-select-option :value="0">创建时间从近到远</a-select-option>
					<a-select-option :value="1">创建时间从远到近</a-select-option>
					<a-select-option :value="2">最后一次跟进时间从近到远</a-select-option>
					<a-select-option :value="3">最后一次跟进时间从远到近</a-select-option>
				</a-select>
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">是否保护：</label>
				<a-select
						style="width: 210px;margin-right: 5px;"
						v-model="other_way"
				>
					<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="1">已保护</a-select-option>
										<a-select-option :value="0">未保护</a-select-option>
				</a-select>
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">部门成员：</label>
				<a-button @click="showDepartmentList" style="width: 210px;margin: 0 10px 10px 0;">
					<span v-if="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
					<span v-else>选择成员</span>
				</a-button>
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">加入时间：</label>
					<a-range-picker
							:show-time="{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }"
							format="YYYY-MM-DD HH:mm:ss"
							allowClear
							style="width:320px;margin-right: 5px;"
							:disabled-date="disabledDate"
							v-model="joinTime"
							@change="changeTime"
					/>
				</span>
					<a-button type="primary" style="margin: 0 10px 10px 0;" @click="find">查找</a-button>
					<a-button @click="clear">清空</a-button>
				</a-row>

				<!-- 表格部分 -->
				<div class="content-bd" ref="scroll">
					<a-spin tip="Loading..." size="large" :spinning="isLoading">
						<a-empty v-show="list.length == 0" style="margin: 100px auto 0;"/>
						<div class="part" v-for="(item,index) in list" :id="'part'+ item.id" v-show="list.length > 0">
							<a-spin tip="Loading..." :spinning="item.isLoading">
								<div class="part-title">
									<span class="part-title-left">{{item.title}}（{{item.count}}）</span>
									<a-tag color="red" v-if="item.status == 0" style="margin: 3px;">已删除</a-tag>
									<!--							<a-icon type="export" class="part-title-right" v-if="item.status != 0"-->
									<!--							        @click="groupSend(item.id)"/>-->
								</div>
								<a-row
										class="part-body"
										:ref="'part_body_' + item.id"
										:id="'partBody' + item.id"
										v-perfect-scroll-bar="perfectScrollBarOptions"
										@ps-scroll-down="handleScroll(item.id)"
										@ps-scroll-y="e=>changeScrollPosition(e,item.id)" style="position: absolute;">
									<a-empty v-if="item.members && item.members.length == 0"/>
									<div class="part-body-card" v-for="part in item.members"
									     v-if="item.members && item.members.length > 0"
									     @click="isJumpCustomDetail ? customDetail(part.cid,item.id) : ''"
									     :ref="'part_body_card_' + part.cid" :id="part.cid">
										<div style="overflow: hidden;padding: 10px 5px 10px 10px;">
											<img :src="part.avatar" alt="" v-if="part.avatar"
											     style="float: left;width: 47px;margin-right: 5px;height:47px;border-radius: 5px;">
											<img src="../../../assets/useradvart.png" alt="" v-if="!part.avatar"
											     style="float: left;width: 47px;margin-right: 5px;height:47px;border-radius: 5px;">
											<div style="float: left;width: 135px;font-size:12px;">
												<div style="word-wrap:break-word;word-break:break-all;white-space: normal;">
													<a-popover placement="top">
														<template slot="content">
															<p>{{part.name}}</p>
														</template>
														<span>{{part.nickname}}</span>
														<span :class="part.corp_name != null ? 'corp-name' : 'wx-name'">
														<template
																v-if="part.corp_name != null">@{{part.corp_name}}</template>
														<template v-else>@微信</template>
													</span>
													</a-popover>
													<a-tag color="green" v-if="part.is_protect == 1">已保护</a-tag>
												</div>
												<p style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"
												   v-if="part.wx_name && part.wx_name != ''">
													公众号：{{part.wx_name}}</p>
												<a-tag color="orange"
												       style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;max-width: 100%;margin-top: 5px;"
												       v-if="part.company_name!= ''">
													{{part.company_name}}
												</a-tag>
											</div>
											<a-progress type="circle" :percent="Number(part.close_rate)" :width="40"
											            style="float: left;margin-left:5px;font-size:12px;margin-right: 5px;"/>
											<a-popover placement="right" v-if="isShowMore">
												<template slot="content">
													<div>
														<p class="url-btn"
														   @click="addRecord(part.cid,item.id,part.close_rate,part.nickname,part)"
														   style="margin-bottom: 6px;" v-has="'client-addFollow'">
															添加跟进</p>
														<p class="url-btn" @click="customDetail(part.cid,item.id)"
														   style="margin-bottom: 6px;" v-has="'client-info'">
															客户详情</p>
														<p class="url-btn" @click="handleMenuClick(part,item.id,1)"
														   style="margin-bottom: 6px;" v-if="part.is_protect == 0"
														   v-has="'client-assign'">
															客户转交给成员</p>
														<p class="url-btn" @click="assignHighSea(part,item.id,1)"
														   style="margin-bottom: 6px;" v-if="part.is_protect == 0"
														   v-has="'client-backHighSea'">
															客户退回公海</p>
														<p class="url-btn" @click="setProtect(part,item.id,1)"
														   v-if="part.is_protect == 0 && part.is_show == 1 && part.is_rest == 1"
														   v-has="'client-protect'">
															设为保护对象</p>
														<p class="url-btn" @click="cancelProtect(part,item.id,1)"
														   v-if="part.is_protect == 1" v-has="'client-protect'">
															取消保护</p>
													</div>
												</template>
												<a-icon type="more" style="font-size: 18px;"/>
											</a-popover>
										</div>
										<div style="color:red;padding: 0 10px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
											<span v-if="item.lose_one==1&&part.context&&part.context!=''">输单原因：{{part.context}}</span>
										</div>
										<template v-if="part.tag_name.length > 0 && part.per_name.length == 0">
											<div style="cursor:pointer;width: 100%;padding: 0 10px;margin-bottom: 10px;white-space: normal;">
												<a-popover v-if="part.tag_name.length>4">
													<template slot="content">
														  <div class="over-width-300">
                                <a-tag color="blue"
                                       v-for="tag in part.tag_name"
                                       style="margin-bottom: 5px;">
                                  {{tag}}
                                </a-tag>
                              </div>
													</template>
													<div>
														<a-tag color="blue"
														       v-for="(tag,i) in part.tag_name"
														       v-if="i<4"
														       style="margin-bottom: 5px;cursor: pointer">
															{{tag}}
														</a-tag>
														<div>等{{part.tag_name.length}}个标签</div>
													</div>
												</a-popover>
												<a-tag color="blue" v-if="part.tag_name.length<=4"
												       v-for="tag in part.tag_name"
												       style="margin-bottom: 5px;">
													{{tag}}
												</a-tag>
											</div>
										</template>
										<template v-else>
											<div style="width: 100%;padding: 0 10px;margin-bottom: 10px;white-space: normal;"
											     v-if="part.tag_name.length > 0">
												公有标签：
												<a-popover v-if="part.tag_name.length>4">
													<template slot="content">
														<a-tag color="blue"
														       v-for="tag in part.tag_name"
														       style="margin-bottom: 5px;">
															{{tag}}
														</a-tag>
													</template>
													<div>
														<a-tag color="blue"
														       v-for="(tag,i) in part.tag_name"
														       v-if="i<4"
														       style="margin-bottom: 5px;cursor: pointer">
															{{tag}}
														</a-tag>
														<div>等{{part.tag_name.length}}个标签</div>
													</div>
												</a-popover>
												<a-tag color="blue" v-if="part.tag_name.length<=4"
												       v-for="tag in part.tag_name"
												       style="margin-bottom: 5px;">
													{{tag}}
												</a-tag>
											</div>
											<div style="width: 100%;padding: 0 10px;margin-bottom: 10px;white-space: normal;"
											     v-if="part.per_name.length > 0">
												私有标签：
												<a-popover v-if="part.per_name.length>4">
													<template slot="content">
														<a-tag color="blue"
														       v-for="tag in part.per_name"
														       style="margin-bottom: 5px;">
															{{tag}}
														</a-tag>
													</template>
													<div>
														<a-tag color="blue"
														       v-for="(tag,i) in part.per_name"
														       v-if="i<4"
														       style="margin-bottom: 5px;cursor: pointer">
															{{tag}}
														</a-tag>
														<div>等{{part.per_name.length}}个标签</div>
													</div>
												</a-popover>
												<a-tag color="blue" v-if="part.per_name.length<=4"
												       v-for="tag in part.per_name"
												       style="margin-bottom: 5px;">
													{{tag}}
												</a-tag>
											</div>
										</template>
										<div style="background: #F3F3F3;padding: 7px 10px;overflow:hidden;font-size: 12px;">
									<span style="float: left;color: red;"
									      v-if="part.chat == '一直未沟通'">{{part.chat}}</span>
											<span style="float: left;"
											      v-if="part.chat != '一直未沟通'"><span
													style="color: #01b065;">{{part.chat}}</span>  沟通过</span>
											<span style="float: right;" v-if="!part.has_remark">{{part.employee}}</span>
											<span style="float: right;width: calc(100% - 100px);white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;"
											      v-else>{{part.employee + '（备注：' + part.remark + '）'}}</span>
										</div>
									</div>
								</a-row>
							</a-spin>
						</div>
					</a-spin>
				</div>
			</div>
			<div v-show="tabKey == 2" style="height: calc(100% - 122px);">
				<a-row style="margin:0 20px 20px;padding:20px 20px 5px;background: #FFF;line-height: 40px;"
				       ref="searchArea2">
					<span class="select-option">
						<label style="margin-right: 5px;">关键词：</label>
						<a-input
								@keyup.enter="find2"
								placeholder="客户姓名/备注/公司名称"
								style="width: 210px;margin-right: 5px;"
								v-model="name2"
						/>
					</span>
					<span class="select-option">
						<label style="margin-right: 5px;">手机号：</label>
							<a-input
									@keyup.enter="find2"
									placeholder="请输入手机号码"
									style="width: 210px;margin-right: 5px;"
									v-model="phone2"
							/>
					</span>
					<span class="select-option">
						<label style="margin-right: 5px;">联系时间：</label>
							<a-select style="width: 210px;margin-right: 5px;"
							          v-model="timeType2"
							          :dropdownStyle="{width:'200px'}">
								<a-select-option :value="0">全部客户</a-select-option>
								<a-select-option :value="1">一直未沟通</a-select-option>
								<a-select-option :value="2">近3天未联系</a-select-option>
								<a-select-option :value="3">近7天未联系</a-select-option>
								<a-select-option :value="4">近15天未联系</a-select-option>
								<a-select-option :value="5">近30天未联系</a-select-option>
								<a-select-option :value="6">近90天未联系</a-select-option>
								<a-select-option :value="7">近180天未联系</a-select-option>
								<a-select-option :value="8">近一年未联系</a-select-option>
								<a-select-option :value="9">一年以上未联系</a-select-option>
							</a-select>
					</span>
					<span class="select-option">
						<label style="margin-right: 5px;">排序方式：</label>
							<a-select style="width: 210px;margin-right: 5px;"
							          v-model="sortType2">
								<a-select-option :value="0">创建时间从近到远</a-select-option>
								<a-select-option :value="1">创建时间从远到近</a-select-option>
								<a-select-option :value="2">最后一次跟进时间从近到远</a-select-option>
								<a-select-option :value="3">最后一次跟进时间从远到近</a-select-option>
							</a-select>
					</span>
					<span class="select-option">
					<label style="margin-right: 5px;">是否保护：</label>
				<a-select
						style="width: 210px;margin-right: 5px;"
						v-model="other_way2"
				>
					<a-select-option :value="-1">全部</a-select-option>
										<a-select-option :value="1">已保护</a-select-option>
										<a-select-option :value="0">未保护</a-select-option>
				</a-select>
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">部门成员：</label>
				<a-button @click="showDepartmentList" style="width: 210px;margin: 0 10px 10px 0;">
					<span v-if="chooseNum2 > 0">已选择{{chooseUserNum2}}名成员，{{chooseDepartmentNum2}}个部门</span>
					<span v-else>选择成员</span>
				</a-button>
				</span>
					<span class="select-option">
					<label style="margin-right: 5px;">加入时间：</label>
					<a-range-picker
							:show-time="{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }"
							format="YYYY-MM-DD HH:mm:ss"
							allowClear
							style="width:320px;margin-right: 5px;"
							:disabled-date="disabledDate"
							v-model="joinTime2"
							@change="changeTime"
					/>
				</span>
					<a-button type="primary" style="margin: 0 10px 10px 0;" @click="find2">查找</a-button>
					<a-button @click="clear2">清空</a-button>
				</a-row>

				<!-- 表格部分 -->
				<div class="content-bd" ref="scroll2">
					<a-spin tip="Loading..." size="large" :spinning="isLoading2">
						<a-empty v-show="list2.length == 0" style="margin: 100px auto 0;"/>
						<div class="part" v-for="(item,index) in list2" :id="'part'+ item.id" v-show="list2.length > 0">
							<a-spin tip="Loading..." :spinning="item.isLoading">
								<div class="part-title">
									<span class="part-title-left">{{item.title}}（{{item.count}}）</span>
									<a-tag color="red" v-if="item.status == 0" style="margin: 3px;">已删除</a-tag>
									<!--							<a-icon type="export" class="part-title-right" v-if="item.status != 0"-->
									<!--@click="groupSend(item.id)"/>-->
								</div>
								<a-row
										class="part-body"
										:ref="'part_body2_' + item.id"
										:id="'partBody' + item.id"
										v-perfect-scroll-bar="perfectScrollBarOptions"
										@ps-scroll-down="handleScroll(item.id)"
										@ps-scroll-y="e=>changeScrollPosition(e,item.id)" style="position: absolute;">
									<a-empty v-if="item.members && item.members.length == 0"
									         style="margin-top: 100px;"/>
									<div class="part-body-card2" v-for="part in item.members"
									     v-if="item.members && item.members.length > 0"
									     @click="isJumpCustomDetail ? customDetail2(part.cid,item.id) : ''"
									     :ref="'part_body2_card_' + part.cid" :id="part.cid">
										<div style="overflow: hidden;padding: 10px 5px 10px 10px;">
											<a-avatar :src="avatar" shape="square"
											          style="float: left;width: 47px;margin-right: 5px;height:47px;"/>
											<div style="float: left;width: 135px;font-size:12px;">
												<div style="word-wrap:break-word;word-break:break-all;white-space: normal;">
													<a-popover placement="top">
														<template slot="content">
															<p>{{part.name}}</p>
														</template>
														<span>{{part.name}}</span>
													</a-popover>
													<a-tag color="green" v-if="part.is_protect == 1"
													       style="margin: 0 0 0 5px;">已保护
													</a-tag>
												</div>
												<a-tag color="orange"
												       style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;max-width: 100%;margin-top: 5px;"
												       v-if="part.company_name!= ''">
													{{part.company_name}}
												</a-tag>
											</div>
											<a-progress type="circle" :percent="Number(part.close_rate)" :width="40"
											            style="float: left;margin-left:5px;font-size:12px;margin-right: 5px;"/>
											<a-popover placement="right" v-if="isShowMore">
												<template slot="content">
													<div>
														<p class="url-btn"
														   @click="addRecord(part.cid,item.id,part.close_rate,part.nickname)"
														   style="margin-bottom: 6px;" v-has="'client-addFollow'">
															添加跟进</p>
														<p class="url-btn" style="margin-bottom: 6px;"
														   @click="customDetail2(part.cid,item.id)"
														   v-has="'client-info'">
															客户详情</p>
														<p class="url-btn" @click="handleMenuClick(part,item.id,0)"
														   style="margin-bottom: 6px;" v-if="part.is_protect == 0"
														   v-has="'client-assign'">
															客户转交给成员</p>
														<p class="url-btn" @click="assignHighSea(part,0)"
														   style="margin-bottom: 6px;" v-if="part.is_protect == 0"
														   v-has="'client-backHighSea'">
															客户退回公海</p>
														<p class="url-btn" @click="setProtect(part,item.id,0)"
														   v-if="part.is_protect == 0 && part.is_show == 1 && part.is_rest == 1"
														   v-has="'client-protect'">
															设为保护对象</p>
														<p class="url-btn" @click="cancelProtect(part,item.id,0)"
														   v-if="part.is_protect == 1" v-has="'client-protect'">
															取消保护</p>
													</div>
												</template>
												<a-icon type="more" style="font-size: 18px;"/>
											</a-popover>
										</div>
										<div style="color:red;padding: 0 10px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
											<span v-if="item.lose_one==1&&part.context&&part.context!=''">输单原因：{{part.context}}</span>
										</div>
										<template v-if="part.tag_name.length > 0">
											<div style="width: 100%;padding: 0 10px;margin-bottom: 10px;white-space: normal;">
												<a-popover v-if="part.tag_name.length>4">
													<template slot="content">
														  <div class="over-width-300">
                                <a-tag color="blue"
                                       v-for="tag in part.tag_name"
                                       style="margin-bottom: 5px;">
                                  {{tag}}
                                </a-tag>
                              </div>
													</template>
													<div>
														<a-tag color="blue"
														       v-for="(tag,i) in part.tag_name"
														       v-if="i<4"
														       style="margin-bottom: 5px;cursor: pointer">
															{{tag}}
														</a-tag>
														<div>等{{part.tag_name.length}}个标签</div>
													</div>
												</a-popover>
												<a-tag color="blue" v-if="part.tag_name.length<=4"
												       v-for="tag in part.tag_name"
												       style="margin-bottom: 5px;">
													{{tag}}
												</a-tag>
											</div>
										</template>
										<div style="background: #F3F3F3;padding: 7px 10px;overflow:hidden;font-size: 12px;">
									<span style="float: left;color: red;"
									      v-if="part.chat == '一直未沟通'">{{part.chat}}</span>
											<span style="float: left;"
											      v-if="part.chat != '一直未沟通'"><span
													style="color: #01b065;">{{part.chat}}</span>  沟通过</span>
											<span style="float: right;" v-if="!part.remark">{{part.employee}}</span>
											<span style="float: right;width: calc(100% - 100px);white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;"
											      v-else>{{part.employee + '（备注：' + part.remark + '）'}}</span>
										</div>
									</div>
								</a-row>
							</a-spin>
						</div>
					</a-spin>
				</div>
			</div>
			<!-- 添加跟进记录抽屉 -->
			<a-drawer
					:title="drawTitle"
					placement="right"
					:closable="false"
					:visible="recordVisible"
					@close="onClose"
					width="460px!important"
			>
				<div style="height: calc(100% - 51px);overflow:auto;">
					<div style="padding: 20px 20px 0;">
						跟进状态：
						<a-select style="width: 220px" @change="changeState"
						          v-model="status">
							<a-select-option v-for="(item,index) in follows" :value="item.id" :key="index"
							                 :disabled="canEdit == 1 ? false : true">
								{{item.title}}
							</a-select-option>
						</a-select>
					</div>
					<div style="margin: 20px 20px;" v-if="followItem.lose_one==1">
						输单原因：
						<a-select v-model="lose" style="width: 220px" placeholder="请选择输单原因"
						          @change="changeLose">
							<a-select-option v-for="(item,index) in loseReason"
							                 :value="item.id">
								{{item.context}}
							</a-select-option>
						</a-select>
					</div>
					<div style="padding: 20px;">
						预估成交率：
						<a-input-number v-model="close_rate"
						                style="width: 165px;margin-right: 5px;" placeholder="请输入预估成交率"/>
						%
					</div>
					<div class="textArea">
						<a-textarea
								placeholder="添加跟进记录，1000字以内"
								:auto-size="{ minRows: 5, maxRows: 20 }"
								:maxLength="1000"
								@change="changeText"
								v-if="showTextArea"
						/>
						<div style="text-align: right;margin-top: 10px;">{{followMsg.length}}/1000
						</div>
					</div>
					<div class="textArea-btn">
						<a-upload
								class="upload-file"
								action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								listType="picture-card"
								@preview="handlePreview2"
								:beforeUpload="beforeUpload2"
								@change="e => changeMsg2(e)"
								:fileList="imageUrl2"
						>
							<div v-if="imageUrl2.length < 9">
								<a-button>
									<a-icon type="link"/>
									图片 {{imgNum2}}/9
								</a-button>
							</div>
						</a-upload>
						<a-modal :visible="previewVisible2" :footer="null"
						         @cancel="handleCancel2">
							<img alt="example" style="width: 100%" :src="previewImage2"/>
						</a-modal>
					</div>
					<div style="padding: 0 0 20px 20px;" v-has="'client-add-tag'">
						<div style="margin-bottom:10px;">客户标签：</div>
						<corpChooseTag :callback="modalVisibleChange4" :hasChoose="tag_arr"
						               ref="chooseTag"></corpChooseTag>
					</div>
				</div>
				<div class="footer">
					<a-button style="marginRight: 8px" @click="onClose">
						取消
					</a-button>
					<a-button type="primary" @click="onSure">
						确定
					</a-button>
				</div>
			</a-drawer>
		</div>
		<!--部门选择框-->
		<chooseDepartment :show="showModalDepartment" :chooseNum="chooseNum" ref="user"
		                  :callback="modalVisibleChange" :is_special="1"></chooseDepartment>
		<!-- 选择成员组件-单选 -->
		<a-modal
				title="选择成员"
				v-model="showModalStaff" @cancel="chooseStaffCancel" @ok="chooseStaffHandel">
			<div style="color: red;margin-bottom: 10px;">指定分配给具有外部联系人权限的成员</div>
			<chooseStaffSelect v-if="showModalStaff" style="" :index="0" :index2="0" ref="staff" :type="1"
			                   :callback="selectStaffCallback"></chooseStaffSelect>
		</a-modal>
	</div>
</template>

<script>
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import infiniteScroll from 'vue-infinite-scroll';
	import moment from 'moment';
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import avatar from "../../../assets/useradvart.png"
	import chooseStaffSelect from "@/components/ChooseStaffSelect.vue"

	function getBase64 (file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			// reader.onerror = error => reject(error);
		});
	}

	export default {
		directives: {infiniteScroll},
		name      : "customCrmKanban",
		components: {chooseDepartment, corpChooseTag, chooseStaffSelect},
		data () {
			let corpId =
				localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				customerType       : [],
				corpType           : [0],
				lose               : undefined,
				loseReason         : [],
				followItem         : {},
				moment,
				corpInfo           : [], //企业微信列表
				corpId             : corpId, //修改后的企业微信id值
				corpLen            : JSON.parse(localStorage.getItem('corpArr')).length,
				isLoading          : false,//Loading组件的显示与隐藏
				name               : '',//搜索客户姓名、昵称、公司名称
				phone              : '',//手机号
				is_fans            : 0,//是否粉丝，0全部，1是，2否
				timeType           : 0,//时间类型
				sortType           : 2,//排序类型
				other_way          : -1,//是否保护，-1全部，1已保护，0未保护
				joinTime           : null, // 添加客户时间
				showModalDepartment: false, //成员选择框显示与隐藏
				chooseNum          : 0,//部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				checkedList        : [],//选择的成员id数组
				user               : [],//选择成员数据
				startX             : 0,//按下鼠标指针的x轴坐标
				scrollX            : 0,
				//添加跟进记录抽屉
				recordVisible      : false,//显示与隐藏
				showTextArea       : false,//输入框的显示与隐藏
				status             : [],//跟进状态
				follows            : [],
				followMsg          : '',//跟进记录输入框内容
				followMsgTimeout   : "",
				imageUrl2          : [],//上传的图片文件类型
				file2              : [],//上传的图片链接地址
				imgNum2            : 0,//上传的图片的数量
				previewVisible2    : false,//预览图片弹窗显示与隐藏
				previewImage2      : '',//预览的图片链接
				isImg2             : true,//上传图片符不符合规则
				submitDisabled2    : true,//提交按钮的置灰
				close_rate         : '',//预估成交率

				list                   : [],//裂变数据
				timeout                : '',
				page                   : 1,//分页
				id                     : '',//当前在滚动的列的id
				count                  : '',//当前在滚动的列的总数
				cid                    : '',//正在操作客户的id
				drawTitle              : '',//添加跟进记录抽屉弹窗标题
				isMasterAccount        : localStorage.getItem('isMasterAccount') ? localStorage.getItem('isMasterAccount') : '',//主账户1，子账户2
				customItem             : {
					corpId             : localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					name               : '',
					phone              : '',
					timeType           : 0,
					sortType           : 2,
					other_way          : -1,
					checkedList        : [],
					user               : [],
					chooseNum          : 0,
					chooseUserNum      : 0,
					chooseDepartmentNum: 0,
					joinTime           : null
				},
				perfectScrollBarOptions: {
					suppressScrollX   : true,  // 禁用 X 轴的滚动条
					minScrollbarLength: 15  // 最小的滚动条大小
				},
				scrollData             : [],    // 滚动条位置
				isJumpCustomDetail     : true,//是否可以跳转客户详情页面
				tag_arr                : [], //标签值
				tabKey                 : 1,//1企微客户，2非企微客户
				//非企微客户
				isLoading2             : false,//Loading组件的显示与隐藏
				list2                  : [],//裂变数据
				page2                  : 1,//分页
				id2                    : '',//当前在滚动的列的id
				count2                 : '',//当前在滚动的列的总数
				scrollData2            : [],    // 滚动条位置
				cid2                   : '',//正在操作客户的id
				avatar                 : avatar,//头像
				name2                  : '',//搜索客户姓名、昵称、公司名称
				phone2                 : '',//手机号
				timeType2              : 0,//时间类型
				sortType2              : 2,//排序类型
				other_way2             : -1,//是否保护，-1全部，1已保护，0未保护
				joinTime2              : null, // 添加客户时间
				chooseNum2             : 0,//部门成员总个数
				chooseUserNum2         : 0,//成员个数
				chooseDepartmentNum2   : 0,//部门个数
				checkedList2           : [],//选择的成员id数组
				user2                  : [],//选择成员数组
				customItem2            : {
					name               : '',
					phone              : '',
					timeType           : 0,
					sortType           : 2,
					other_way          : -1,
					checkedList        : [],
					user               : [],
					chooseNum          : 0,
					chooseUserNum      : 0,
					chooseDepartmentNum: 0,
					joinTime           : null
				},
				//成员转交
				assignType             : 1,//0非企微客户、1企微客户
				assignRecord           : '',//成员转交的该行信息
				showModalStaff         : false,//选择成员弹窗的显示与隐藏
				userId                 : [],//选择的成员id
				userName               : [],//选择的成员name
				canEdit                : 1,//是否可以编辑客户跟进状态,1可以，0不可以
				isShowMore             : true,//是否显示右上角更多操作按钮
			};
		},
		methods   : {
			// 获取企业微信
			async getCorpWx () {
				const {data: res} = await this.axios.post("work-external-contact-follow-user/enterprise-type", {
					corp_id: this.corpId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.customerType = [{value: 0, label: '全部',},
						{value: 1, label: '个人微信',},
						{
							value: 2, label: '企业微信', children: [
								{value: '', label: '全部'}
							]
						},]
					for (let item of res.data) {
						let {corp_full_name: label, corp_name: value} = item
						this.customerType[2].children.push({value, label})
					}
				}
			},
			// 客戶类型
			filter (inputValue, path) {
				return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
			},
			changeState (item) {
				let index = this.follows.findIndex(x => x.id == this.status)
				this.followItem = this.follows[index]
			},
			changeLose () {

			},
			async getLoseReason () {
				const {data: res} = await this.axios.post("custom-field/get-lose-msg", {
						corp_id: localStorage.getItem("corpId"),
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.loseReason = res.data
				}
			},
			//切换企业微信
			changeWx (value) {
				this.corpId = value;
			},
			//部门选择弹窗组件
			showDepartmentList () {
				if (this.tabKey == 1) {
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				} else if (this.tabKey == 2) {
					this.$refs.user.rightIdList = JSON.parse(JSON.stringify(this.checkedList2))
					this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user2))
				}
				this.showModalDepartment = true
			},
			modalVisibleChange (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					if (this.tabKey == 1) {
						this.checkedList = arr
						this.user = list
						this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum = userNum
						this.chooseDepartmentNum = departmentNum
					} else if (this.tabKey == 2) {
						this.checkedList2 = arr
						this.user2 = list
						this.chooseNum2 = parseInt(userNum) + parseInt(departmentNum)
						this.chooseUserNum2 = userNum
						this.chooseDepartmentNum2 = departmentNum
					}
				}
				this.showModalDepartment = false
			},
			//加入时间
			disabledDate (current) {
				return current && current > moment().endOf('day');
			},
			changeTime (data, dataString) {
				this.joinTime = data
			},
			//点击搜索
			find () {
				this.id = ''
				this.customItem.corpId = this.corpId
				this.customItem.name = this.name
				this.customItem.phone = this.phone
				this.customItem.timeType = this.timeType
				this.customItem.sortType = this.sortType
				this.customItem.other_way = this.other_way
				this.customItem.checkedList = this.checkedList
				this.customItem.user = this.user
				this.customItem.chooseNum = this.chooseNum
				this.customItem.chooseUserNum = this.chooseUserNum
				this.customItem.chooseDepartmentNum = this.chooseDepartmentNum
				this.customItem.joinTime = this.joinTime
				this.scrollData = []
				this.cid = ''
				this.getAccount();
				this.$nextTick(() => {
					this.list.map(x => {
						this.changeScrollTop(false, 0, x.id);
					})
				})
				var elements = document.getElementsByClassName('part-body-card')
				Array.prototype.forEach.call(elements, function (element) {
					element.style.border = ''
				});
			},
			//点击清空
			clear () {
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
				this.corpType = [0]
				this.name = '';
				this.id = '';
				this.cid = ''
				this.phone = '';
				this.is_fans = 0;
				this.timeType = 0;
				this.sortType = 2;
				this.other_way = -1
				this.checkedList = []
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.joinTime = null
				this.customItem.corpId = this.corpId
				this.customItem.name = this.name
				this.customItem.phone = this.phone
				this.customItem.timeType = this.timeType
				this.customItem.sortType = this.sortType
				this.customItem.other_way = this.other_way
				this.customItem.checkedList = this.checkedList
				this.customItem.user = this.user
				this.customItem.chooseNum = this.chooseNum
				this.customItem.chooseUserNum = this.chooseUserNum
				this.customItem.chooseDepartmentNum = this.chooseDepartmentNum
				this.customItem.joinTime = this.joinTime
				this.scrollData = []
				this.getAccount();
				this.$nextTick(() => {
					this.list.map(x => {
						this.changeScrollTop(false, 0, x.id);
					})
				})
				var elements = document.getElementsByClassName('part-body-card')
				Array.prototype.forEach.call(elements, function (element) {
					element.style.border = ''
				});
			},
			//群发
			groupSend (id) {
				this.customItem.id = id
				this.$router.push({
					path: "/massMessage/add", query: {
						item: this.customItem
					}
				});
			},
			//添加跟进
			addRecord (cid, id, close_rate, name, part) {
				if (this.tabKey == 1) {
					this.cid = cid
					this.id = id
				} else if (this.tabKey == 2) {
					this.cid2 = cid
					this.id2 = id
				}
				this.status = 1
				this.getFollowStatus(id, close_rate)
				this.canEditFollow(cid)
				this.drawTitle = name
				this.followMsg = ''
				var elements = document.getElementsByClassName('part-body-card')
				Array.prototype.forEach.call(elements, function (element) {
					element.style.border = ''
				});
			},
			changeText (e) {
				//输入框内容处理占内存，渲染很慢，给延迟保证输入框内容快速渲染
				clearTimeout(this.followMsgTimeout)
				this.followMsgTimeout = setTimeout(() => {
					this.followMsg = e.target.value
				}, 3)
			},
			//客户标签
			modalVisibleChange4 (event, str) {
				if (event == "ok") {
					if (str != '') {
						this.tag_arr = str.split(',')
					}
				}
			},
			async onSure () {
				if (this.followItem.lose_one == 0) {
					if (this.followMsg.trim() == '' && this.file2.length == 0) {
						this.$message.error('跟进内容不能为空！')
						return false
					}
					if (this.status == '') {
						this.$message.warning('请选择跟进状态！')
						return false
					}
					let reg = /^(?:0|[1-9][0-9]?|100)$/
					if (this.close_rate != null && this.close_rate != '' && (this.close_rate < 0 || this.close_rate > 100 || !reg.test(this.close_rate))) {
						this.$message.warning('成交率必须为0-100正整数')
						return false
					}
				} else {
					if (!this.lose) {
						this.$message.error('输单原因不能为空！')
						return false
					}
				}

				let url = ''
				let cid = ''
				if (this.tabKey == 1) {
					url = "work-external-contact-follow-user/custom-follow-record-set"
					cid = this.cid
				} else if (this.tabKey == 2) {
					url = "public-sea-customer/follow-record-set"
					cid = this.cid2
				}

				const {data: res} = await this.axios.post(url, {
					isMasterAccount: this.isMasterAccount,
					uid            : localStorage.getItem('uid'),
					cid            : cid,
					sub_id         : localStorage.getItem("sub_id"),
					record_id      : this.record_id,
					record         : this.followMsg,
					file           : this.file2,
					follow_id      : this.status,
					close_rate     : this.close_rate,
					corp_id        : this.corpId,
					tag_ids        : this.tag_arr,
					lose           : this.lose,

				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.recordVisible = false
					this.canEditFollow(cid)
					if (this.tabKey == 1) {
						if (this.id == this.status) {
							this.getAccount(this.id)
						} else {
							this.getAccount(this.id)
							this.getAccount(this.status)
						}
					} else if (this.tabKey == 2) {
						if (this.id2 == this.status) {
							this.getCustomList(this.id2)
						} else {
							this.getCustomList(this.id2)
							this.getCustomList(this.status)
						}
					}
					// this.status = 1
					this.followMsg = ''
					this.file2 = []
					this.lose = undefined
					this.imageUrl2 = []
					this.imgNum2 = 0
					this.close_rate = ''
					this.showTextArea = false
				}
			},
			onClose () {
				this.recordVisible = false
				this.status = 1
				this.followMsg = ''
				this.file2 = []
				this.imageUrl2 = []
				this.imgNum2 = 0
				this.close_rate = ''
				this.tag_arr = []
				this.showTextArea = false
				this.id = ''
				this.id2 = ''
				this.cid = ''
				this.cid2 = ''
				this.lose = undefined
			},
			changeMsg2 (value) {
				if (this.imageUrl2.indexOf(value.file) != -1) {
					this.file2.splice(this.imageUrl2.indexOf(value.file), 1)
				}
				if (this.isImg2) {
					this.imageUrl2 = value.fileList;
					this.imgNum2 = value.fileList.length
				}
				for (let f of this.imageUrl2) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
			},
			async uploadMaterial2 (materialData) {
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", materialData);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.file2.push(res.data.local_path)
					}
				} else {
					this.$message.error(res.error_msg)
				}
			},
			beforeUpload2 (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.isImg2 = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.isImg2 = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.isImg2 = false
					return false;
				}
				this.isImg2 = true
				this.uploadMaterial2(file);
				return isLt2M;
			},
			//上传图片
			handleCancel2 () {
				this.previewVisible2 = false;
			}
			,
			async handlePreview2 (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage2 = file.url || file.preview;
				this.previewVisible2 = true;
			}
			,
			//客户详情
			customDetail (cid, id) {
				this.cid = cid
				this.id = id
				this.$forceUpdate()
				var elements = document.getElementsByClassName('part-body-card')
				Array.prototype.forEach.call(elements, function (element) {
					element.style.border = ''
				});
				this.$router.push('/customManage/detail?id=' + cid)
			},
			//客户转交给成员
			handleMenuClick (record, id, type) {
				this.assignRecord = record
				this.assignType = type
				if (type == 1) {
					//企微
					this.id = id
					this.cid = record.cid
				} else if (type == 0) {
					//非企微
					this.id2 = id
					this.cid2 = record.cid
				}
				this.showModalStaff = true
				var all = document.getElementsByClassName('ant-popover')
				for (var i = 0; i < all.length; i++) {
					all[i].style.display = 'none';
				}
			},
			// 选择成员回调
			selectStaffCallback (event, id) {
				if (event == "ok") {
					this.userId = id
					this.$nextTick(() => {
						this.userName = this.$refs.staff.$el.innerText
					})
				}
			},
			chooseStaffCancel () {
				this.userId = ''
				this.userName = ''
				this.assignRecord = ''
				if (this.showModalStaff) {
					this.$refs.staff.userId = []
					this.showModalStaff = false
				}
				this.id = ''
				this.id2 = ''
				this.cid = ''
				this.cid2 = ''
			},
			chooseStaffHandel () {
				let that = this;
				let title = ""
				if (this.userId.length == 0) {
					this.$message.error('请先选择成员');
					return false
				}
				//单个分配
				if (this.assignType == 0) {
					//非企微客户
					title = "一旦确定将【" + that.assignRecord.name + "】转交给【" + this.userName + "】，则进入该成员的客户列表。确定转交吗？"
				} else if (this.assignType == 1) {
					//企微客户
					title = "一旦确定将【" + that.assignRecord.nickname + "】转交给【" + this.userName + "】，则进入该成员的客户列表。确定转交吗？"
				}
				that.showModalStaff = false
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.assignStaff()
					},
					onCancel () {
						that.userId = []
						that.userName = ''
						that.showModalStaff = true
					},
				});
			},
			//成员转交给成员
			async assignStaff () {
				const {data: res} = await this.axios.post("public-sea-customer/transfer", {
					uid      : localStorage.getItem("uid"),
					corp_id  : this.corpId,
					user_id  : this.userId,
					type     : this.assignType,//0非企微客户、1企微客户
					follow_id: this.assignRecord.cid
				});
				if (res.error != 0) {
					this.userId = []
					this.userName = ''
					this.$message.error(res.error_msg);
				} else {
					let that = this
					this.$success({
						title: res.data.textHtml,
						onOk () {
							that.id = ''
							that.id2 = ''
							that.cid = ''
							that.cid2 = ''
							that.userId = []
							that.userName = ''
						},
					});
					this.chooseStaffCancel()
					if (this.assignType == 0) {
						//非企微客户
						this.getCustomList()
					} else if (this.assignType == 1) {
						//企微客户
						this.getAccount()
					}
				}
			},
			//成员转交给公海池
			async assignHighSea (record, id, type) {
				let that = this
				that.$confirm({
					title     : '确定退回公海池吗？',
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.assignHighSea2(record, id, type)
					},
				});
			},
			async assignHighSea2 (record, id, type) {
				if (type == 0) {
					//非企微客户
					this.id2 = id
					this.cid2 = record.cid
				} else if (type == 1) {
					//企微客户
					this.id = id
					this.cid = record.cid
				}
				const {data: res} = await this.axios.post("public-sea-customer/give-up", {
					uid      : localStorage.getItem("uid"),
					corp_id  : this.corpId,
					type     : type,//0非企微客户、1企微客户
					follow_id: record.cid
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$success({
						title: res.data.textHtml,
					});
					this.id = ''
					this.id2 = ''
					this.cid = ''
					this.cid2 = ''
					if (type == 0) {
						//非企微客户
						this.getCustomList()
					} else if (type == 1) {
						//企微客户
						this.getAccount()
					}
				}
			},
			//设为保护对象
			setProtect (record, id, type) {
				this.assignType = type
				this.assignRecord = record
				if (type == 1) {
					//企微
					this.cid = record.cid
					this.id = id
				} else if (type == 0) {
					//非企微
					this.cid2 = record.cid
					this.id2 = id
				}
				var all = document.getElementsByClassName('ant-popover')
				for (var i = 0; i < all.length; i++) {
					all[i].style.display = 'none';
				}
				let that = this;
				let title = ""
				//单个分配
				if (record.is_rest == 1) {
					if (this.assignType == 1) {
						//企微
						title = "确定保护【" + record.nickname + "】永不进入公海池吗？"
					} else {
						//非企微
						title = "确定保护【" + record.name + "】永不进入公海池吗？"
					}
				} else {
					title = "永不进入公海池的客户数已达上限，无法再设置。"
				}
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.protectStaff()
					},
					onCancel () {
						that.cid = ''
						that.id = ''
						that.cid2 = ''
						that.id2 = ''
					},
				});
			},
			//成员保护
			async protectStaff () {
				const {data: res} = await this.axios.post("public-sea-customer/protect", {
					uid            : localStorage.getItem("uid"),
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
					corp_id        : this.corpId,
					type           : this.assignType,//0非企微客户、1企微客户
					follow_id      : this.assignRecord.cid
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$success({
						title: res.data.textHtml,
					});
					this.assignRecord = ''
					if (this.assignType == 0) {
						//非企微客户
						this.getCustomList()
					} else if (this.assignType == 1) {
						//企微客户
						this.getAccount()
					}
				}
			},
			//取消保护
			cancelProtect (record, id, type) {
				this.assignType = type
				this.assignRecord = record
				if (type == 1) {
					//企微
					this.cid = record.cid
					this.id = id
				} else if (type == 0) {
					//非企微
					this.cid2 = record.cid
					this.id2 = id
				}
				var all = document.getElementsByClassName('ant-popover')
				for (var i = 0; i < all.length; i++) {
					all[i].style.display = 'none';
				}
				let that = this;
				let title = "一旦取消保护，当符合客户回收规则后，客户将自动进入公海池，被其他同事认领，确定取消保护吗？"
				that.$confirm({
					title     : title,
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.cancelProtectStaff()
					},
					onCancel () {
						that.cid = ''
						that.id = ''
						that.cid2 = ''
						that.id2 = ''
					},
				});
			},
			async cancelProtectStaff () {
				const {data: res} = await this.axios.post("public-sea-customer/no-protect", {
					uid            : localStorage.getItem("uid"),
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
					corp_id        : this.corpId,
					type           : this.assignType,//0非企微客户、1企微客户
					follow_id      : this.assignRecord.cid
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.$success({
						title: res.data.textHtml,
					});
					this.assignRecord = ''
					if (this.assignType == 0) {
						//非企微客户
						this.getCustomList()
					} else if (this.assignType == 1) {
						//企微客户
						this.getAccount()
					}
				}
			},
			//获取表格内容
			async getAccount (id) {
				if (this.id == '') {
					this.isLoading = true;
				} else {
					for (let i = 0; i < this.list.length; i++) {
						this.list[i].isLoading = false
						if (this.list[i].id == this.id || this.list[i].id == id) {
							this.list[i].isLoading = true
						}
					}
				}
				this.$forceUpdate()
				let page = 1
				if (this.id != '' && this.list.length > 0) {
					for (let i = 0; i < this.list.length; i++) {
						if (this.list[i].id == this.id) {
							page = this.list[i].page
						}
						if (this.list[i].id == id) {
							this.list[i].page = 1
							page = 1
						}
					}
				} else {
					page = 1
				}
				if (id) {
					this.cid = ''
				}
				const {data: res} = await this.axios.post(
					"work-external-contact-follow-user/custom-board",
					{
						uid            : localStorage.getItem("uid"),
						isMasterAccount: this.isMasterAccount,
						sub_id         : localStorage.getItem('sub_id'),
						corp_id        : this.corpId,
						name           : this.name,
						phone          : this.phone,
						is_fans        : this.is_fans,
						user_ids       : this.checkedList,
						sort           : this.sortType,
						is_protect     : this.other_way,
						day            : this.timeType,
						page           : page,
						id             : id ? id : this.id,
						cid            : this.cid,
						start_time     : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[0].format("YYYY-MM-DD HH:mm:ss") : '') : '',
						end_time       : this.joinTime ? (this.joinTime.length > 1 ? this.joinTime[1].format("YYYY-MM-DD HH:mm:ss") : '') : '',
						corp_type      : this.corpType[0],
						corp_name      : this.corpType[1],
					}
				);
				if (res.error != 0) {
					if (this.id == '') {
						this.isLoading = false;
					} else {
						for (let i = 0; i < this.list.length; i++) {
							if (this.list[i].id == this.id) {
								this.list[i].isLoading = false
							}
						}
					}
					this.$message.error(res.message);
				} else {
					let that = this
					if (this.cid == '') {
						if (page == 1) {
							if (id) {
								for (let i = 0; i < that.list.length; i++) {
									if (that.list[i].id == id) {
										that.list[i].members = res.data[0].members
										that.list[i].count = res.data[0].count
										that.list[i]['isLoading'] = false
									}
								}
							} else if (this.id) {
								for (let i = 0; i < that.list.length; i++) {
									if (that.list[i].id == this.id) {
										that.list[i].members = res.data[0].members
										that.list[i].count = res.data[0].count
										that.list[i]['isLoading'] = false
									}
								}
							} else {
								that.list = res.data
								that.list.map((x, index) => {
									x.page = 1
									x.isLoading = false
									that.scrollData[index] = {
										position: null
									}
								})
							}
						}
						if (page > 1) {
							that.list.map((x, index) => {
								if (x.id && x.id == that.id) {
									x.isLoading = false
									if (x.members.length < x.count) {
										x.members = x.members.concat(res.data[0].members)
									}
								}
							})
						}
					} else {
						for (let i = 0; i < that.list.length; i++) {
							if (that.list[i].id == that.id) {
								that.list[i].isLoading = false
								for (let j = 0; j < that.list[i].members.length; j++) {
									if (that.list[i].members[j].cid == that.cid) {
										that.list[i].members[j] = JSON.parse(JSON.stringify(res.data[0]))
									}
								}
							}
						}
					}
					if (id == localStorage.getItem('followid')) {
						localStorage.removeItem('followid')
					}
					that.isLoading = false;
					this.$forceUpdate()
					let searchAreaHeight = this.$refs.searchArea.$el.clientHeight
					this.$refs.scroll.style.height = 'calc(100% - ' + searchAreaHeight + 'px)'
					if (this.cid != '') {
						this.$nextTick(() => {
							const card = this.$refs['part_body_card_' + this.cid][0]
							card.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, .12)'
							card.style.border = '2px solid #01b065'
						})
					}
				}
			},
			handleScroll (eleId) {
				if (this.tabKey == 1) {
					const scrollYReach = this.$refs['part_body_' + eleId][0].$el._ps_.reach.y;
					if (eleId != this.id) {
						this.id = eleId
						this.list.map(x => {
							if (x.id == this.id) {
								this.page = x.page
							}
						})
					}
					this.list.map(x => {
						if (x.id == this.id) {
							this.count = x.count
						}
					})
					if (scrollYReach === 'end') {
						if (this.count / 15 > this.page) {
							++this.page
							this.list.map(x => {
								if (x.id == this.id) {
									x.page = this.page
								}
							})
							this.cid = ''
							this.corpId = this.customItem.corpId
							this.name = this.customItem.name
							this.phone = this.customItem.phone
							this.timeType = this.customItem.timeType
							this.sortType = this.customItem.sortType
							this.other_way = this.customItem.other_way
							this.checkedList = this.customItem.checkedList
							this.user = this.customItem.user
							this.chooseNum = this.customItem.chooseNum
							this.chooseUserNum = this.customItem.chooseUserNum
							this.chooseDepartmentNum = this.customItem.chooseDepartmentNum
							this.joinTime = this.customItem.joinTime
							this.getAccount();
						}
					}
				} else if (this.tabKey == 2) {
					const scrollYReach = this.$refs['part_body2_' + eleId][0].$el._ps_.reach.y;
					if (eleId != this.id2) {
						this.id2 = eleId
						this.list2.map(x => {
							if (x.id == this.id2) {
								this.page2 = x.page
							}
						})
					}
					this.list2.map(x => {
						if (x.id == this.id2) {
							this.count2 = x.count
						}
					})
					if (scrollYReach === 'end') {
						if (this.count2 / 15 > this.page2) {
							++this.page2
							this.list2.map(x => {
								if (x.id == this.id2) {
									x.page = this.page2
								}
							})
							this.cid2 = ''
							this.name2 = this.customItem2.name
							this.phone2 = this.customItem2.phone
							this.timeType2 = this.customItem2.timeType
							this.sortType2 = this.customItem2.sortType
							this.other_way2 = this.customItem2.other_way
							this.checkedList2 = this.customItem2.checkedList
							this.user2 = this.customItem2.user
							this.chooseNum2 = this.customItem2.chooseNum
							this.chooseUserNum2 = this.customItem2.chooseNum
							this.chooseUserNum2 = this.customItem2.chooseNum
							this.joinTime2 = this.customItem2.joinTime
							this.getCustomList();
						}
					}
				}

			},
			//获取跟进记录状态
			async getFollowStatus (id, close_rate) {
				const {data: res} = await this.axios.post(
					"custom-field/follow",
					{
						uid   : localStorage.getItem("uid"),
						status: 1,
						// id    : id
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {

					this.follows = res.data.follow

					for (let i = 0; i < this.follows.length; i++) {
						if (this.follows[i].id == id) {
							this.status = Number(id)
							this.followItem = this.follows[i]
							break
						}
					}
					if (this.status == '') {
						this.status = Number(this.follows[0].id)
					}
					this.close_rate = close_rate
					this.recordVisible = true
					this.getLoseReason()
					this.tag_arr = []
					this.showTextArea = true
					var all = document.getElementsByClassName('ant-popover')
					for (var i = 0; i < all.length; i++) {
						all[i].style.display = 'none';
					}
				}
			},
			// 记录最后一次滚动条的位置
			changeScrollPosition (e, id) {
				let that = this
				that.list.map((x, index) => {
					if (x.id == id) {
						if (that.scrollData.length > 0 && typeof that.scrollData[index].position != 'undefined') {
							that.scrollData[index].position = e.srcElement.scrollTop;
						}
					}
				})
			},
			// 修改滚动条位置
			changeScrollTop (change = false, scrollPosition = null, id) {
				if (this.tabKey == 1) {
					this.$nextTick(() => {
						this.$refs['part_body_' + id][0].$el.scrollTop = scrollPosition;
					});
				} else if (this.tabKey == 2) {
					this.$nextTick(() => {
						this.$refs['part_body2_' + id][0].$el.scrollTop = scrollPosition;
					});
				}
			},
			//切换tab
			changeTab (e) {
				this.tabKey = e
				this.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
				if (this.tabKey == 1) {
					this.clear()
				} else if (this.tabKey == 2) {
					this.clear2()
				}
			},
			//获取非企微客户列表数据
			//获取表格内容
			async getCustomList (id) {
				if (this.id2 == '') {
					this.isLoading2 = true;
				} else {
					for (let i = 0; i < this.list2.length; i++) {
						this.list2[i].isLoading = false
						if (this.list2[i].id == this.id2 || this.list2[i].id == id) {
							this.list2[i].isLoading = true
						}
					}
				}
				this.$forceUpdate()
				let page = 1
				if (this.id2 != '' && this.list2.length > 0) {
					for (let i = 0; i < this.list2.length; i++) {
						if (this.list2[i].id == this.id2) {
							page = this.list2[i].page
						}
						if (this.list2[i].id == id) {
							this.list2[i].page = 1
							page = 1
						}
					}
					// this.list2.map(x => {
					// 	if (x.id == this.id2) {
					// 		page = x.page
					// 	}
					// })
				} else {
					page = 1
				}
				if (id) {
					this.cid2 = ''
				}
				const {data: res} = await this.axios.post(
					"public-sea-customer/custom-board",
					{
						uid            : localStorage.getItem("uid"),
						isMasterAccount: this.isMasterAccount,
						sub_id         : localStorage.getItem('sub_id'),
						corp_id        : localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
						name           : this.name2,
						phone          : this.phone2,
						user_ids       : this.checkedList2,
						sort           : this.sortType2,
						is_protect     : this.other_way2,
						day            : this.timeType2,
						page           : page,
						id             : id ? id : this.id2,
						cid            : this.cid2,
						start_time     : this.joinTime2 ? (this.joinTime2.length > 1 ? this.joinTime2[0].format("YYYY-MM-DD HH:mm:ss") : '') : '',
						end_time       : this.joinTime2 ? (this.joinTime2.length > 1 ? this.joinTime2[1].format("YYYY-MM-DD HH:mm:ss") : '') : '',
						corp_type      : this.corpType,
					}
				);
				if (res.error != 0) {
					if (this.id2 == '') {
						this.isLoading2 = false;
					} else {
						for (let i = 0; i < this.list2.length; i++) {
							if (this.list2[i].id == this.id2) {
								this.list2[i].isLoading = false
							}
						}
					}
					this.$message.error(res.message);
				} else {
					let that = this
					if (this.cid2 == '') {
						if (page == 1) {
							if (id) {
								for (let i = 0; i < that.list2.length; i++) {
									if (that.list2[i].id == id) {
										that.list2[i].members = JSON.parse(JSON.stringify(res.data[0].members))
										that.list2[i].count = res.data[0].count
										that.list2[i]['isLoading'] = false
									}
								}
							} else if (this.id2) {
								for (let i = 0; i < that.list2.length; i++) {
									if (that.list2[i].id == this.id2) {
										that.list2[i].members = JSON.parse(JSON.stringify(res.data[0].members))
										that.list2[i].count = res.data[0].count
										that.list2[i]['isLoading'] = false
									}
								}
							} else {
								that.list2 = res.data
								that.list2.map((x, index) => {
									x.page = 1
									x.isLoading = false
									that.scrollData2[index] = {
										position: null
									}
								})
							}
						}
						if (page > 1) {
							that.list2.map((x, index) => {
								if (x.id && x.id == that.id2) {
									x.isLoading = false
									if (x.members.length < x.count) {
										x.members = x.members.concat(res.data[0].members)
									}
								}
							})
						}
					} else {
						for (let i = 0; i < that.list2.length; i++) {
							if (that.list2[i].id == that.id2) {
								that.list2[i].isLoading = false
								for (let j = 0; j < that.list2[i].members.length; j++) {
									if (that.list2[i].members[j].cid == that.cid2) {
										that.list2[i].members[j] = JSON.parse(JSON.stringify(res.data[0]))
									}
								}
							}
						}
					}
					if (id == localStorage.getItem('followid')) {
						localStorage.removeItem('followid')
					}
					that.isLoading2 = false;
					this.$forceUpdate()
					let searchAreaHeight = this.$refs.searchArea2.$el.clientHeight
					this.$refs.scroll2.style.height = 'calc(100% - ' + searchAreaHeight + 'px)'
					if (this.cid2 != '') {
						this.$nextTick(() => {
							const card = this.$refs['part_body2_card_' + this.cid2][0]
							card.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, .12)'
							card.style.border = '2px solid #01b065'
						})
					}
				}
			},
			//客户详情
			customDetail2 (cid, id) {
				this.cid2 = cid
				this.id2 = id
				this.$forceUpdate()
				var elements = document.getElementsByClassName('part-body-card')
				Array.prototype.forEach.call(elements, function (element) {
					element.style.border = ''
				});
				this.$router.push('/customManage/noCustomDetail?id=' + cid)
			},
			//点击搜索
			find2 () {
				this.id2 = ''
				this.scrollData2 = []
				this.cid2 = ''
				this.customItem2.name = this.name2
				this.customItem2.phone = this.phone2
				this.customItem2.timeType = this.timeType2
				this.customItem2.sortType = this.sortType2
				this.customItem2.other_way = this.other_way2
				this.customItem2.checkedList = this.checkedList2
				this.customItem2.user = this.user2
				this.customItem2.chooseNum = this.chooseNum2
				this.customItem2.chooseUserNum = this.chooseUserNum2
				this.customItem2.chooseDepartmentNum = this.chooseDepartmentNum2
				this.customItem2.joinTime = this.joinTime2
				this.getCustomList();
				this.$nextTick(() => {
					this.list2.map(x => {
						this.changeScrollTop(false, 0, x.id);
					})
				})
				var elements = document.getElementsByClassName('part-body-card2')
				Array.prototype.forEach.call(elements, function (element) {
					element.style.border = ''
				});
			},
			//点击清空
			clear2 () {
				this.name2 = '';
				this.id2 = '';
				this.cid2 = ''
				this.phone2 = '';
				this.timeType2 = 0;
				this.sortType2 = 2;
				this.other_way2 = -1;
				this.checkedList2 = []
				this.user2 = []
				this.chooseNum2 = 0
				this.chooseUserNum2 = 0
				this.chooseDepartmentNum2 = 0
				this.joinTime2 = null
				this.scrollData2 = []
				this.customItem2.name = this.name2
				this.customItem2.phone = this.phone2
				this.customItem2.timeType = this.timeType2
				this.customItem2.sortType = this.sortType2
				this.customItem2.other_way = this.other_way2
				this.customItem2.checkedList = this.checkedList2
				this.customItem2.user = this.user2
				this.customItem2.chooseNum = this.chooseNum2
				this.customItem2.chooseUserNum = this.chooseUserNum2
				this.customItem2.chooseDepartmentNum = this.chooseDepartmentNum2
				this.customItem2.joinTime = this.joinTime2
				this.getCustomList();
				this.$nextTick(() => {
					this.list2.map(x => {
						this.changeScrollTop(false, 0, x.id);
					})
				})
				var elements = document.getElementsByClassName('part-body-card2')
				Array.prototype.forEach.call(elements, function (element) {
					element.style.border = ''
				});
			},
			//是否可以编辑客户跟进状态
			async canEditFollow (id) {
				const {data: res} = await this.axios.post(
					"wait-project/can-edit-follow",
					{
						cid : id,
						type: this.tabKey == 1 ? 1 : 0
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.canEdit = res.data.can_edit_follow
				}
			},
		},

		created () {
			if (this.tabKey == 1) {
				this.$store.dispatch("getCorp", info => {
					this.corpInfo = info
					this.cid = ''
					// this.getAccount()
					this.getCorpWx()
				});
				if (localStorage.getItem('permissionButton') == 'all') {
					this.isJumpCustomDetail = true
				} else {
					let permissionButton = localStorage.getItem('permissionButton').split(',')
					this.isJumpCustomDetail = permissionButton.includes('client-info')
					if (permissionButton.indexOf('client-addFollow') == -1 && permissionButton.indexOf('client-info') == -1 && permissionButton.indexOf('client-assign') == -1 && permissionButton.indexOf('client-backHighSea') == -1 && permissionButton.indexOf('client-protect') == -1) {
						this.isShowMore = false
					} else {
						this.isShowMore = true
					}
				}
			}
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建

			if (from.path == '/customManage/detail') {
				next(vm => {
					vm.tabKey = 1;
					vm.corpId = vm.customItem.corpId
					vm.name = vm.customItem.name
					vm.phone = vm.customItem.phone
					vm.is_fans = vm.customItem.is_fans
					vm.timeType = vm.customItem.timeType
					vm.sortType = vm.customItem.sortType
					vm.other_way = vm.customItem.other_way
					vm.checkedList = vm.customItem.checkedList
					vm.user = vm.customItem.user
					vm.chooseNum = vm.customItem.chooseNum
					vm.chooseUserNum = vm.customItem.chooseUserNum
					vm.chooseDepartmentNum = vm.customItem.chooseDepartmentNum
					vm.joinTime = vm.customItem.joinTime
					if (vm.id == localStorage.getItem('followid') || !localStorage.getItem('followid')) {
						vm.getAccount()
						vm.list.map((x, index) => {
							if (typeof vm.$refs['part_body_' + x.id][0] !== 'undefined' && typeof vm.scrollData[index] !== 'undefined' && vm.scrollData[index].position !== null) {
								vm.changeScrollTop(false, vm.scrollData[index].position, x.id);
							}
						})
					} else {
						vm.getAccount(vm.id)
						vm.getAccount(localStorage.getItem('followid'))
					}
				});
			} else if (from.path == '/customManage/noCustomDetail') {
				next(vm => {
					vm.tabKey = 2;
					vm.id3 = '';
					vm.cid3 = ''
					vm.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : ""
					vm.name2 = vm.customItem2.name
					vm.phone2 = vm.customItem2.phone
					vm.timeType2 = vm.customItem2.timeType
					vm.sortType2 = vm.customItem2.sortType
					vm.other_way2 = vm.customItem2.other_way
					vm.checkedList2 = vm.customItem2.checkedList
					vm.user2 = vm.customItem2.user
					vm.chooseNum2 = vm.customItem2.chooseNum
					vm.chooseUserNum2 = vm.customItem2.chooseUserNum
					vm.chooseDepartmentNum2 = vm.customItem2.chooseDepartmentNum
					vm.joinTime2 = vm.customItem2.joinTime
					if (vm.id == localStorage.getItem('followid') || !localStorage.getItem('followid')) {
						vm.getCustomList()
						vm.list2.map((x, index) => {
							if (typeof vm.$refs['part_body2_' + x.id][0] !== 'undefined' && typeof vm.scrollData[index] !== 'undefined' && vm.scrollData[index].position !== null) {
								vm.changeScrollTop(false, vm.scrollData[index].position, x.id);
							}
						})
					} else {
						vm.getCustomList(vm.id2)
						vm.getCustomList(localStorage.getItem('followid'))
					}

				});
			} else {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
					vm.id = '';
					vm.cid = ''
					vm.tabKey = 1;
					vm.name = '';
					vm.phone = '';
					vm.is_fans = 0;
					vm.timeType = 0;
					vm.sortType = 2;
					vm.checkedList = []
					vm.user = []
					vm.chooseNum = 0
					vm.chooseUserNum = 0
					vm.chooseDepartmentNum = 0
					vm.joinTime = null
					vm.other_way = -1
					vm.getAccount();
				});
			}

			next()
		},
	};
</script>

<style lang='less' scoped>
	/deep/ .ant-card-bordered {
		border: 0;
	}

	.content-bd::-webkit-scrollbar { /*滚动条整体样式*/
		width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
		height: 10px;
	}

	.content-bd::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: #535353;
	}

	p {
		margin-bottom: 0;
	}

	.select-option {
		display: inline-block;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.select-option label {
		display: inline-block;
		text-align: right;
		width: 100px;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.content-bd {
		/*height: calc(100% - 215px);*/
		min-width: 885px;
		margin: 0 20px;
		overflow-y: hidden;
		overflow-x: auto;
		white-space: nowrap;
		padding-bottom: 20px;
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

	/*/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container {*/
	/*	height: 100%;*/
	/*}*/

	.part {
		width: 300px;
		height: 100%;
		display: inline-block;
		background: #F7F7F7;
		margin-right: 15px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		position: relative;
		cursor: grabbing;
	}

	.part:hover {
		background: #F9F9F9;
	}

	.part-title {
		padding: 15px;
		overflow: hidden;
		height: 56px;
		width: 100%;
		position: absolute;
	}

	.part-body {
		/*height: calc(100% - 57px);*/
		padding: 0 16px;
		box-sizing: border-box;
		overflow: auto;
		position: absolute;
		top: 57px;
		bottom: 0;
		width: 300px;
	}

	.part-title-left {
		float: left;
		color: rgba(0, 0, 0, 0.6);
		font-size: 16px;
		font-weight: 700;
	}

	.part-title-right {
		float: right;
		margin-top: 4.5px;
		font-size: 18px;
		cursor: pointer;
	}

	.part-body-card, .part-body-card2 {
		background: #FFF;
		margin-bottom: 15px;
		box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .08);
		width: 100%;
	}

	.part-body-card:hover, .part-body-card2:hover {
		box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .12);
	}

	.url-btn {
		cursor: pointer;
	}

	.url-btn:hover, .part-title-right:hover {
		color: #01b065;
	}

	.textArea {
		padding: 0 20px;
	}

	.textArea-btn {
		padding: 20px;
		overflow: hidden;
	}

	.upload-file /deep/ .ant-upload.ant-upload-select-picture-card {
		background-color: #FFF;
		border: 0;
		height: 32px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0;
	}

	.footer {
		position: absolute;
		bottom: 63px;
		width: 100%;
		border-top: 1px solid #E8E8E8;
		padding: 10px 16px;
		text-align: right;
		background: #FFF;
	}

	/deep/ .ant-spin-spinning:first-child {
		width: 100%;
		margin-top: 100px;
	}

	/deep/ .ant-spin-nested-loading:first-child {
		height: 100%;
	}

	/deep/ .ant-spin-container {
		height: 100%;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-popover-inner-content {
		padding: 8px 16px;
	}

	.content-bd /deep/ .ant-spin-container:first-child {
		display: flex;
	}

	.part /deep/ .ant-spin-container {
		width: 300px;
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
  .over-width-300{
    width: 300px!important;
    max-height: 200px!important;
    overflow-y: auto!important;
  }
</style>
