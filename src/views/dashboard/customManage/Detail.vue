<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">客户详情</label>
				<a-button type="primary" style="font-size: 14px;float: right;" @click="goBack">返回列表
				</a-button>
			</a-card>

			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<div class="custom-info">
						<a-avatar shape="square" :size="132"
						          :src="avatar"
						          style="vertical-align: top;"/>
						<div class="custom-info-text">
							<div class="col">
								<span style="font-size: 20px;font-weight: 700;">{{name}}
									<span v-if="corp_name != ''" :class="corp_name != null ? 'corp-name' : 'wx-name'">
										<template v-if="corp_name != null">@{{corp_name}}</template>
										<template v-else>@微信</template>
									</span>
								<span v-if="!remarkVisible && nickname != ''">（{{nickname}}）</span>
									<a-icon slot="prefix" type="man" style="color: #427EBA;" v-if="gender == '男性'"/>
									<a-icon
											slot="prefix"
											type="woman"
											style="color: #ED4997;" v-if="gender == '女性'"
									/>
								</span>
								<a-icon type="edit" @click="modifyRemark" v-if="!remarkVisible"
								        style="margin-left: 10px;"/>
								<a-input-search
										style="width: 260px;margin-left: 10px;"
										v-model="nickname"
										placeholder="输入用户的备注"
										@search="setRemark"
										:maxLength="10"
										v-if="remarkVisible">
									<span slot="suffix">
                                        <span>{{nickname.length}}</span>/10
                                    </span>
									<a-button
											slot="enterButton"
											type="primary">
										<a-icon type="check"/>
									</a-button>
								</a-input-search>
								<a-tag color="#67c23a"
								       style="float: right;margin-right: 0;height: 25px;line-height: 25px;"
								       v-if="followTitle">{{followTitle}}
								</a-tag>
							</div>
							<div class="col">
								<label v-if="is_hide_phone != 1">
									手机：<span v-if="phone && phone != ''">{{phone}}</span><span v-else>暂无</span>
								</label>
								<span style="margin:0 1rem" v-if="dialout_exten&&dialout_phone">
										<a-button type="primary" @click="contact">
											联系TA
										</a-button>
									</span>

								<span v-if="dialout_exten&&dialout_phone">
										<a-tooltip placement="bottom">
											<template slot="title">
												<p>根据相关法律法规和监管部门的要求，拨打商业性电话前请您阅读并严格遵守以下内容：</p>
												<p style="margin-bottom: 2px;font-size: 13px;">
													1、禁止在非工作时间拨打商业性电话，具体可外呼时间段请咨询您所在企业管理员或线路服务商；</p>
												<p style="margin-bottom: 10px;font-size: 13px;"></p>
												<p style="margin-bottom: 2px;font-size: 13px;">
													2、禁止对同一号码在24小时内发起多次呼叫，同一号码可被外呼频次请咨询您所在企业管理员或在用线路服务商；</p>
												<p style="margin-bottom: 10px;font-size: 13px;"></p>
												<p style="margin-bottom: 2px;font-size: 13px;">3、拨打商业性营销电话须事先经过用户本人同意，运营商可能会拦截对已申明不愿意接受商业性电话的用户外呼请求；</p>
												<p style="margin-bottom: 10px;font-size: 13px;"></p>
												<p style="margin-bottom: 0;font-size: 13px;">
													4、禁止使用云呼叫功能开展分裂国家、传播宗教极端思想、煽动民族仇恨、破坏民族团结、扰乱社会秩序、传播封建迷信、诈骗等活动或其他违反国家法律法规、违背社会公序良俗的活动。</p>
											</template>
											<a-icon type="question-circle"/>
										</a-tooltip>
									</span>
							</div>
							<div class="col">
								<label>
									所在地：<span v-if="area && area != ''">{{area}}</span><span v-else>暂无</span>
								</label>
							</div>
							<div class="col">
								<span>
									<label>标签：</label>
									<span style="display: inline-block;width: calc(100% - 45px);vertical-align: text-top;">
<!--										<a-tag v-for="item in hasTagsValue" color="blue" style="margin-bottom: 5px;"-->
<!--										       v-if="hasTagsValue && hasTagsValue.length > 0">{{item}}</a-tag>-->
										<span v-if="hasTagsValue.length == 0">暂无</span>

                    <span  v-if="hasTagsValue &&hasTagsValue.length > 5">
                        <a-popover>
                            <span slot="content">
                                <div class="over-width"> <a-tag style="margin-bottom: 5px;"  color="blue" v-for="item in hasTagsValue">{{item}}</a-tag></div>
                            </span>
                            <span v-for="(item1,index1) in hasTagsValue">
                                 <a-tag v-if="index1<5" style="margin-bottom: 5px;"  color="blue">{{item1}}</a-tag>
                            </span>
                        </a-popover>
                        <span>等{{hasTagsValue.length}}个标签</span>
                    </span>
                    <span v-if="hasTagsValue &&hasTagsValue.length <=5">
                           <a-tag style="margin-bottom: 5px;" color="blue" v-for="(item1) in hasTagsValue" >{{item1}}</a-tag>
                    </span>
										<a-icon @click="showModal" type="edit" style="margin-left: 5px;"
										        v-if="isShowTag"/>
									</span>
								</span>
							</div>
							<div class="col">
								<span>
									<label>描述：</label>
									<span v-if="des && des != ''">{{des}}</span>
									<span v-if="des == ''">暂无</span>
									<img v-if="file3" :src="this.commonUrl+file3" alt="avatar"
									     style="max-width: 100px;max-height: 100px;margin: 0 0 10px 10px;"/>
								</span>
								<a-icon type="edit" @click="showDesVisible" style="margin-left: 10px;"/>
								<a-modal title="修改描述" :visible="desVisible" @cancel="desVisibleCancel" @ok="setDetail">
									<div class="textArea">
										<a-textarea
												v-model="desText"
												@change="changeTextarea"
												placeholder="请输入用户的描述，150字以内"
												:autoSize="{ minRows: 4, maxRows: 4 }"
												:maxLength="150"
										/>
										<div style="text-align: right;margin-top: 10px;">{{desText.length}}/150
										</div>
									</div>
									<!--									<a-upload-->
									<!--											name="avatar"-->
									<!--											list-type="picture-card"-->
									<!--											class="avatar-uploader"-->
									<!--											:show-upload-list="false"-->
									<!--											action="https://www.mocky.io/v2/5cc8019d300000980a055e76"-->
									<!--											:before-upload="beforeUpload3"-->
									<!--									>-->
									<!--										<img v-if="imageUrl3" :src="this.commonUrl+imageUrl3" alt="avatar"-->
									<!--										     style="max-width: 102px;max-height: 102px;"/>-->
									<!--										<div v-else>-->
									<!--											<a-icon :type="desImgLoading ? 'loading' : 'plus'"/>-->
									<!--											<div style="margin-top: 5px;font-size: 12px;color: #999;">-->
									<!--												名片或相关图片-->
									<!--											</div>-->
									<!--										</div>-->
									<!--									</a-upload>-->
								</a-modal>
							</div>
						</div>
						<div class="custom-info-box">
							<div class="box">
								<p class="box-first">预计成交率</p>
								<p class="box-second">
									<span v-if="!closeRateVisible && close_rate !== null">{{close_rate}} %</span>
									<span v-if="!closeRateVisible && close_rate === null">暂无</span>
									<a-icon type="edit" @click="modifyCloseRate"
									        v-if="!closeRateVisible"
									        style="margin-left: 10px;"/>
									<a-input-search
											style="width: 200px;"
											:defaultValue="close_rate"
											placeholder="输入预计成交率"
											@search="setCloseRate"
											:maxLength="10"
											v-if="closeRateVisible">
										<span slot="suffix">%</span>
										<a-button
												slot="enterButton"
												type="primary">
											<a-icon type="check"/>
										</a-button>
									</a-input-search>
								</p>
							</div>
							<div class="box">
								<p class="box-first">所在群<span v-if="chatName.length > 2">（{{chatName.length}}个）</span>
								</p>
								<p class="box-second" v-for="item in chatName"
								   v-if="chatName && chatName.length > 0">
									<a-popover placement="top">
										<template slot="content">
											<div style="max-width: 300px;text-overflow: ellipsis;overflow: hidden auto;">
												{{item.name}}（{{item.join_time}}）
											</div>
										</template>
										<span style="cursor: pointer; display: inline-block; max-width: 180px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{item.name}}（{{item.join_time}}）</span>
									</a-popover>
								</p>
								<p class="box-second" v-if="!chatName || chatName.length == 0">暂无</p>
							</div>
							<div class="box">
								<p class="box-first">上次联系</p>
								<p class="box-second">
									<span v-if="follow_time && follow_time != ''">{{follow_time}}</span>
									<span v-else>暂无</span>
								</p>
							</div>
							<div class="box">
								<p class="box-first">联系次数</p>
								<p class="box-second">
									<a-popover placement="top">
										<template slot="content">
											<div style="max-height: 300px;overflow-y: auto;">
												<div v-for="item in follow_times">{{item.name}}：{{item.follow_num}}次
												</div>
											</div>
										</template>
										<span v-if="follow_num && follow_num != ''" style="cursor: pointer;">{{follow_num}}</span>
									</a-popover>
									<span v-if="follow_num == '' || follow_num == null">暂无</span>
								</p>
							</div>
							<div class="box">
								<p class="box-first">归属企业成员</p>
								<p class="box-second" v-for="item in memberInfo"
								   v-if="memberInfo && memberInfo.length > 0">
									<a-popover placement="top">
										<template slot="content">
											{{item.member}}({{item.create_time}})
										</template>
										<span style="display: inline-block; max-width: 250px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;cursor: pointer;">
											{{item.member}}({{item.create_time}})
										</span>
									</a-popover>
								</p>
								<p v-else>暂无</p>
							</div>
						</div>
						<div class="custom-info-project single-accout-card" v-if="projectList.length > 0">
							<a-steps progress-dot :current="projectList.length-1">
								<a-step v-for="item in projectList">
									<template slot="title">
										{{item.project_name}}
									</template>
									<div slot="description">
										<div v-if="item.status == 3">项目实际完成：{{item.finish_time}}
											<span v-if="item.is_finish == 1">（按时完成）</span>
											<span style="color: red;" v-if="item.is_finish == 2">（逾期{{item.delay_days}}天完成）</span>
											<span v-if="item.is_finish == 3">（提前{{item.pre_days}}天完成）</span>
										</div>
										<div v-if="item.status != 1">项目开始时间：{{item.start_time}}</div>
										<div v-if="item.status != 1">预计截止时间：{{item.end_time}}</div>
										<div v-if="item.status == 1">项目规则：接到任务起，需要在{{item.days}}天内完成</div>
										<div>项目处理人：{{item.name}}</div>
									</div>
								</a-step>
							</a-steps>
						</div>
						<div class="custom-info-tab">
							<a-tabs v-model="tabKey" type="card" @change="changeTab">
								<a-tab-pane tab="跟进记录" key="1">
									<div class="time">
										<div v-has="'client-addFollow'">
											<div style="margin: 20px 0;">
												跟进状态：
												<a-select style="width: 220px" v-model="follow_id"
												          @change="changeState">
													<a-select-option :disabled="canEdit == 1 ? false : true"
													                 v-for="item in follows" :value="item.id">
														{{item.title}}
													</a-select-option>
												</a-select>
											</div>
											<div style="margin: 20px 0;" v-if="followItem.lose_one==1">
												输单原因：
												<a-select v-model="lose" style="width: 220px" placeholder="请选择输单原因"
												          @change="changeLose">
													<a-select-option v-for="(item,index) in loseReason" :key="index"
													                 :value="item.id">
														{{item.context}}
													</a-select-option>
												</a-select>
											</div>
											<div class="textArea">
												<span style="color:red;display: inline-block;width: 2%;margin-bottom: 7%;"
												      v-if="followItem.lose_one!=1"> * </span>
												<a-textarea
														style="display: inline-block;width: 95%"
														v-model="msg"
														@change="changeTextarea"
														placeholder="添加跟进记录，1000字以内"
														:autoSize="{ minRows: 5, maxRows: 5 }"
														:maxLength="1000"
												/>
												<div style="text-align: right;margin-top: 10px;">{{msg.length}}/1000
												</div>
											</div>
											<div class="textArea-btn">
												<a-upload
														class="upload-file"
														action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
														listType="picture-card"
														@preview="handlePreview"
														:beforeUpload="beforeUpload"
														@change="e => changeMsg(e)"
														:fileList="imageUrl"
												>
													<div v-if="imageUrl.length < 9">
														<a-button>
															<a-icon type="link"/>
															图片 {{imgNum}}/9
														</a-button>
													</div>
												</a-upload>


												<a-button type="primary" style="left: 50%;width: 110px;"
												          :disabled="submitDisabled"
												          @click="submitFollowRecord">
													提交
												</a-button>
											</div>
										</div>
										<a-timeline class="time-line">
											<a-timeline-item v-for="(item,index) in followRecord">
												<div class="time-line-time">{{item.time}}</div>
												<img slot="dot" src="../../../assets/icon/8.png"
												     style="width: 18px;" v-if="item.record_type!=1"/>
												<img slot="dot" src="../../../assets/call.png"
												     style="width: 18px;" v-if="item.record_type==1"/>
												<div v-if="item.record_type!=1">
													<div style="margin: 10px 0;"><span
															style="color: #1989FA;">{{item.name}}</span> 发表：
														<span style="color: red;" v-if="item.follow_status != ''">【{{item.follow_status}}】</span>
														<span style="float:right;"><a-icon type="edit"
														                                   v-if="item.can_edit == 1"
														                                   @click="editFollowRecord(item)"
														                                   v-has="'client-addFollow'"/></span>
													</div>
													<div class="time-line-title">
														<p style="color: red;" v-if="item.context">
															输单原因：{{item.context}}</p>
														<p>{{item.record}}</p>
														<div v-if="item.file.length > 0"
														     style="margin-top: 5px;overflow: hidden;">
															<div v-for="url in item.file" class="preview-box">
																<div class="preview-cover">
																	<img :src="commonUrl + url" alt="">
																</div>
																<span class="preview-cover-icon"
																      @click="previewHasImg(commonUrl + url)"><a-icon
																		type="eye"/></span>
															</div>
														</div>
													</div>
												</div>
												<div v-if="item.record_type==1">
													<div style="margin: 10px 0;"><span
															style="color: #1989FA;">{{item.name}}</span>
														<span style="color:red">【打电话】</span>
														<span>联系了他</span>
													</div>
													<div v-if="item.call_info.state == 0" style="color: red">
														{{item.call_info.msg}}
													</div>
													<!--													<audio-player-->
													<!--															v-if="item.call_info.state == 1"-->
													<!--															ref="audioPlayer"-->
													<!--															:show-prev-button="false"-->
													<!--															:show-next-button="false"-->
													<!--															:audio-list="[item.call_info.file]"-->
													<!--															theme-color="#01b065"-->
													<!--													/>-->
													<div class="audio" v-if="item.call_info.state == 1">
														<div class="audio_container">
															<div class="audio">
																<div class="audio_box" style="float: left;"
																     @click="playMusic(index, true)"
																     v-show="clickIndex != index">
																	<div class="wifi-symbol">
																		<div class="wifi-circle first"></div>
																		<div class="wifi-circle second"></div>
																		<div class="wifi-circle third"></div>
																	</div>
																	<audio :name="index" :data-index="index"
																	       @canplay="oncanplay">
																		<source
																				:src="item.call_info.file"
																				type="audio/mpeg"
																		/>
																	</audio>
																</div>
																<div class="audio_box" style="float: left;"
																     v-show="clickIndex == index"
																     @click="playMusic(index, false)">
																	<div class="wifi-symbol">
																		<div class="wifi-circle first"></div>
																		<div class="wifi-circle second1"></div>
																		<div class="wifi-circle third1"></div>
																	</div>
																</div>
																<span>{{playTime[index] | dateFormat}}</span>
															</div>
														</div>
													</div>

												</div>
											</a-timeline-item>
										</a-timeline>
										<!--分页 -->
										<div class="pagination"
										     style="margin: 20px 0;box-sizing: border-box;overflow: hidden;"
										     v-show="total > 0">
											<div style="height: 32px;float: left;line-height: 32px;">
												共
												<span style="color: blue">{{total}}</span>条
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
										<!--修改弹窗-->
										<a-modal title="修改跟进记录" v-model="editVisible" @ok="submitFollowRecord"
										         @cancel="cancelFollowRecord" width="800px">
											<div style="margin: 20px 0;">
												跟进状态：
												<a-select style="width: 220px" @change="changeState1"
												          v-model="status">
													<a-select-option v-for="item in follows" :value="item.id"
													                 :disabled="canEdit == 1 ? false : true">
														{{item.title}}
													</a-select-option>
												</a-select>
											</div>
											<div style="margin: 20px 0;"
											     v-if="followItem.lose_one==1">
												输单原因：
												<a-select v-model="followItem.lose_id" style="width: 220px"
												          placeholder="请选择输单原因">
													<a-select-option v-for="(item,index) in loseReason" :key="index"
													                 :value="item.id">
														{{item.context}}
													</a-select-option>
												</a-select>
											</div>
											<div class="textArea">
												<span style="color:red;display: inline-block;width: 2%;margin-bottom: 12%;"
												      v-if="followItem.lose_one!=1"> * </span>
												<a-textarea
														style="display: inline-block;width: 95%"
														v-model="msg2"
														placeholder="添加跟进记录，1000字以内"
														:autoSize="{ minRows: 5, maxRows: 5 }"
														:maxLength="1000"
												/>
												<div style="text-align: right;margin-top: 10px;">{{msg2.length}}/1000
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
										</a-modal>
									</div>
								</a-tab-pane>
								<a-tab-pane tab="互动轨迹" key="2">
									<a-timeline class="time-line" style="margin: 20px;">
										<a-timeline-item v-for="item in interactList">
											<a-icon type="pay-circle" slot="dot" v-if="item.icon==13"/>
											<div style="min-height: 40px;">
												<div class="time-line-time">{{item.event_time}}</div>
												<div class="time-line-title">{{item.content}}<a v-if="item.icon==20"
												                                                class="time-line-detail"
												                                                @click="toTimeLineDetail(item)">详情</a>
												</div>
											</div>
										</a-timeline-item>
									</a-timeline>
									<div style="text-align: center;">
										<a-button type="primary" v-if="btnFlag==1" @click="loadMore">加载更多</a-button>
										<span type="primary" v-if="btnFlag==2">没有更多数据了</span>
									</div>
								</a-tab-pane>
								<a-tab-pane tab="用户画像" key="3">
									<div style="overflow:hidden;margin-bottom: 10px;">
										<div style="float:right;" v-has="'client-editInfo'">
											<a-button type="primary" @click="editBadicInfo" v-if="!badicInfoVisible">编辑
											</a-button>
											<a-button @click="cancleBadicInfo" v-if="badicInfoVisible"
											          style="margin-right: 15px;">取消
											</a-button>
											<a-button type="primary" @click="submitBadicInfo" v-if="badicInfoVisible">提交
											</a-button>
										</div>
									</div>
									<div class="col2">
										<div class="half" v-for="(item, index) in field_list"
										     v-if="item.key == 'phone' && is_hide_phone != 1 || item.key != 'phone'">
											<a-tag color="#01b065">{{item.title}}</a-tag>
											<span class="half-text"
											      v-if="!badicInfoVisible && item.value != '' && item.type != 8 && item.key != 'phone' && item.key != 'company'">{{item.value}}</span>
											<span class="half-text"
											      v-if="!badicInfoVisible && item.key == 'phone'">
												<span v-if="phone != ''">{{phone}}</span>
												<span v-if="phone == ''">暂无</span>
											</span>
											<span class="half-text"
											      v-if="!badicInfoVisible && item.key == 'company'">
												<span v-if="company != ''">{{company}}</span>
												<span v-if="company == ''">暂无</span>
											</span>
											<span class="half-text"
											      v-if="!badicInfoVisible && item.value.length != 0 && item.type == 8">
												<img v-for="item1 in item.value" @click="preview(commonUrl + item1.url)"
												     :src="commonUrl + item1.url"
												     style="max-width: 70px; max-height: 70px;margin: 2px;line-height: 0px;cursor: pointer;">
											</span>
											<span class="half-text"
											      v-if="!badicInfoVisible && (item.value == '' || item.value.length == 0) && item.key != 'phone' && item.key != 'company'">暂无</span>
											<template v-if="badicInfoVisible">
												<!--单选-->
												<a-select :defaultValue="item.hasOption"
												          style="width: 35%;float: right;margin-top:4px;"
												          @change="e => handleChange(e,item.fieldid)"
												          v-if="item.type == 2" :placeholder="'请选择'+item.title"
												          allowClear>
													<a-select-option :value="option" v-for="option in item.optionVal2">
														{{option}}
													</a-select-option>
												</a-select>
												<!--多选-->
												<a-select
														mode="multiple"
														:defaultValue="item.hasOption"
														style="width: 35%;float: right;margin-top:4px;"
														@change="e => handleChange2(e,item.fieldid)"
														v-if="item.type == 3" :placeholder="'请选择'+item.title"
												>
													<a-select-option :value="option" v-for="option in item.optionVal2">
														{{option}}
													</a-select-option>
												</a-select>
												<!--图片-->
												<span v-if="item.type == 8" class="clearfix"
												      style="width: 35%;float: right;margin-top:4px;line-height: 0px;">
													<a-upload
															class="upload-pic"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															list-type="picture-card"
															:fileList="item.picUrl || []"
															@preview="handlePreview"
															:beforeUpload="beforeUploadPic"
															@change="e => handleChangePic(e, index)"
													>
														<div>
															<a-icon type="plus"/>
															<div class="ant-upload-text" style="font-size: 12px;">
																上传图片
															</div>
														</div>
													</a-upload>
												</span>
												<!--输入框-->
												<a-input
														v-if="item.type != 2 && item.type != 3 && item.type != 7 && item.type != 4 && item.type != 8 && item.key != 'phone' && item.key != 'company'"
														style="width: 35%;float: right;margin-top: 4px;"
														:defaultValue="item.value"
														@change="e => changeInput(e.target.value,item.fieldid)"
														:placeholder="'请输入'+item.title"/>
												<!--手机号-->
												<a-input
														v-if="item.type != 2 && item.type != 3 && item.type != 7 && item.type != 4 && item.type != 8 && item.key == 'phone'"
														style="width: 35%;float: right;margin-top: 4px;"
														:defaultValue="phone2"
														@change="e => changeSpecialInput(e.target.value,item.key)"
														placeholder="请输入手机号"/>
												<!--公司-->
												<a-input
														v-if="item.type != 2 && item.type != 3 && item.type != 7 && item.type != 4 && item.type != 8 && item.key == 'company'"
														style="width: 35%;float: right;margin-top: 4px;"
														:defaultValue="company2"
														@change="e => changeSpecialInput(e.target.value,item.key)"
														placeholder="请输入公司"/>
												<!--地区-->
												<a-cascader v-if="item.type == 7"
												            :options="cityData"
												            :defaultValue="item.provice"
												            @change="e => changeArea(e,item.fieldid)"
												            :placeholder="'请选择'+item.title"
												            style="width: 35%;float: right;margin-top: 4px;"
												/>
												<!--日期-->
												<template v-if="item.type == 4">
													<a-date-picker v-if="item.data == ''"
													               style="width: 35%;float: right;margin-top: 4px;"
													               :placeholder="'请选择'+item.title"
													               @change="e => selectDate(e,item.fieldid)"
													               :allowClear="false"/>
													<a-date-picker v-if="item.data != ''"
													               style="width: 35%;float: right;margin-top: 4px;"
													               :placeholder="'请选择'+item.title"
													               @change="e => selectDate(e,item.fieldid)"
													               :defaultValue="moment(item.data)"
													               :allowClear="false"/>
												</template>
											</template>
										</div>
									</div>
								</a-tab-pane>
							</a-tabs>
						</div>
					</div>
				</a-spin>
			</div>
		</div>
		<!--图片预览-->
		<a-modal :visible="previewVisible" :footer="null"
		         @cancel="handleCancel">
			<img alt="example" style="width: 100%" :src="previewImage"/>
		</a-modal>
		<!--	打标签   -->
		<a-modal title="打标签" v-model="visible" @ok="handleOk"
		         :confirmLoading="confirmLoading2" @cancel="cancelVisible" width="800px">
			<corpChooseTag :callback="modalVisibleChange4" :hasChoose="tagCheckValue"></corpChooseTag>
		</a-modal>
		<!--  查看浏览详情	-->
		<div class="moment_detail">
			<a-modal style="height:20rem;overflow:hidden!important;" :visible="momentDetailDialog" width="30%"
			         title="查看浏览详情" @cancel="handleCancel4">
				<template slot="footer">
					<a-button key="back" @click="handleCancel4">取消
					</a-button>
				</template>
				<div v-if="momentDetailDialog">
					<a-row>
						<a-col :span="3">
							<a-avatar style="width: 50px;height: 50px" size="large" shape="square"
							          :src="userMomentDetail.heard_img.substr(0,1)=='/'?commonUrl+userMomentDetail.heard_img:userMomentDetail.heard_img"/>
						</a-col>
						<a-col :span="19">
							<div>
								<a-row>
									<span style=" font-size: 18px; color: #5077B7;font-weight: 900;">{{userMomentDetail.name}}
									</span>
								</a-row>
								<a-row v-if="userMomentDetail.context"
								       style="align-items:center;margin: 0 0 3px 0;white-space:pre-line">
									<a-popover placement="top" style="margin-bottom: 6px;max-height: 10rem;">
										<div style="overflow : hidden;text-overflow: ellipsis;
													display: -webkit-box;-webkit-line-clamp: 6;
													-webkit-box-orient: vertical;">{{userMomentDetail.context}}
										</div>
										<pre slot="content"
										     style="white-space: pre-wrap;word-wrap: break-word;line-height: 20px;color: #000;max-width: 600px;margin-bottom: -3px">{{userMomentDetail.context}}</pre>
									</a-popover>
								</a-row>
								<div class="covers" v-if="userMomentDetail.type==2">
									<div class="cover" v-for="(item,index) in userMomentDetail.info" :key='index'
									     v-if="item.local_path">
										<img :src="item.s_local_path?commonUrl+item.s_local_path:commonUrl+item.local_path"
										     @click="previewPic(userMomentDetail.info,index)"
										     width="95%" class="min" alt="">
									</div>
								</div>
							</div>
							<div v-if="userMomentDetail.type==3" style="margin: 0 0 10px 0">
								<a-form>
									<a-form-item :label-col="{ span:3 }"
									             :wrapper-col="{ span: 21 }">
										<video-player
												class="video-player vjs-custom-skin"
												ref="videoPlayer"
												style="width: 200px;"
												:playsinline="true"
												:options="playerOptions"
										></video-player>
									</a-form-item>
								</a-form>
							</div>
							<div v-if="userMomentDetail.type==4" style="margin: 10px 0 10px 0">
								<a-form>
									<a-form-item :label-col="{ span:3 }"
									             :wrapper-col="{ span: 22 }">
										<div v-if="userMomentDetail.info!={} && userMomentDetail.info!=null"
										     style="width: 100%;">
											<div style="width: 100%; display: flex;height: 70px;background: #F1F3F5;">
												<div style="width:70px;height: 70px;padding: 10px">
													<img v-if="userMomentDetail.info[0].pic_url!=''"
													     class="input_img2"
													     :src="userMomentDetail.info[0].pic_url.substr(0,1)=='/'?commonUrl+userMomentDetail.info[0].pic_url:userMomentDetail.info[0].pic_url"
													     alt=""/>
													<img v-if="userMomentDetail.info[0].pic_url==''"
													     class="input_img2"
													     src="../../../assets/url.png" alt=""/>

												</div>
												<div style="flex-grow: 1;height: 70px;">
													<div class="inp_title">
														{{userMomentDetail.info[0].title}}
													</div>
													<div class="input_text3">
														{{userMomentDetail.info[0].description}}
													</div>
												</div>
											</div>
										</div>
									</a-form-item>
								</a-form>
							</div>
							<a-row>
								<a-col :span="16">{{userMomentDetail.create_time}}</a-col>
							</a-row>
						</a-col>

					</a-row>

					<a-tabs default-active-key="1" class="moment_detail_tab">
						<a-tab-pane key="1" tab="朋友圈"
						            v-if="userMomentDetail.goods.name.length>0||userMomentDetail.reply.length>0">
							<div class="moment_detail_zan" :class="userMomentDetail.goods.status==1?'':'no-active-zan'"
							     v-if="userMomentDetail.goods.name.length>0">
								<svg t="1609928721591" v-if="userMomentDetail.goods.status==1"
								     class="icon moment_detail_zan_icon" viewBox="0 0 1024 1024" version="1.1"
								     xmlns="http://www.w3.org/2000/svg" p-id="2698" width="16" height="16">
									<path d="M705.403848 64.46829c-76.854389 0-148.311861 38.554084-195.34506 102.123912-47.007617-63.587224-118.448716-102.123912-195.344037-102.123912-138.54031 0-251.251348 123.228579-251.251348 274.711665 0 90.369194 40.368406 153.767106 72.820516 204.702172 94.311992 147.95268 331.443761 332.071048 341.487511 339.834872 9.676383 7.479345 20.989033 11.222599 32.275077 11.222599 11.31265 0 22.607904-3.744277 32.270984-11.222599 10.057053-7.763824 247.205195-191.882192 341.488535-339.834872 32.466436-50.939159 72.849168-114.332978 72.849168-204.702172C956.655196 187.69687 843.939041 64.46829 705.403848 64.46829L705.403848 64.46829zM837.929164 508.917802c-89.77056 140.875494-327.883679 324.878229-327.883679 324.878229s-238.086513-184.002734-327.887772-324.878229c-33.120328-52.005444-62.774719-101.438297-62.774719-169.736822 0-117.939109 87.443561-213.58447 195.331757-213.58447 79.730902 0 148.175761 52.308343 178.538279 127.194914l0-0.37146 0.080841 0c2.26253 7.806803 8.857738 13.501502 16.711614 13.501502 7.880481 0 14.474666-5.694699 16.720823-13.501502l0.230244 0c30.435173-74.66349 98.785887-126.823454 178.406273-126.823454 107.86159 0 195.331757 95.64536 195.331757 213.58447C900.734582 407.479505 871.075075 456.911334 837.929164 508.917802L837.929164 508.917802zM837.929164 508.917802"
									      p-id="2699" fill="#6e7c9a"></path>
								</svg>
								<svg t="1610523854710" v-if="userMomentDetail.goods.status==0"
								     class="icon moment_detail_zan_icon" viewBox="0 0 1024 1024" version="1.1"
								     xmlns="http://www.w3.org/2000/svg" p-id="7763" width="16" height="16">
									<path d="M705.386667 177.536c56.682667 0 109.546667 22.122667 148.8 62.272 76.522667 78.272 72.490667 207.232-9.002667 287.424L509.738667 857.493333 174.250667 527.253333c-81.472-80.213333-85.525333-209.152-9.002667-287.424 39.274667-40.170667 92.117333-62.272 148.8-62.272 55.189333 0 107.029333 21.12 145.962667 59.413334l49.706666 48.938666 49.706667-48.938666a206.741333 206.741333 0 0 1 145.962667-59.434667M314.069333 106.688c-72.512 0-144.981333 27.861333-199.488 83.605333-105.024 107.456-97.109333 282.048 9.962667 387.456L476.586667 924.288a47.125333 47.125333 0 0 0 66.261333 0l352.021333-346.538667c107.093333-105.408 114.986667-280.021333 9.962667-387.456-54.485333-55.744-126.997333-83.605333-199.488-83.605333-70.826667 0-141.610667 26.602667-195.648 79.786667-53.973333-53.205333-124.821333-79.786667-195.626667-79.786667z"
									      fill="#c7c7c7" p-id="7764"></path>
								</svg>
								<div style="padding-left:12px;">
									<i class="moment_detail_zan_name"
									   v-for="(item,index) in userMomentDetail.goods.heard_img">
										<img :src="item"/>
									</i>
								</div>
							</div>
							<div class="reply-all-box" v-show="userMomentDetail.reply.length>0">
								<div class="reply-all-box-left">
									<svg t="1611578413166" class="icon reply-icon" viewBox="0 0 1058 1024" version="1.1"
									     xmlns="http://www.w3.org/2000/svg" p-id="1865" width="200" height="200">
										<path d="M330.744242 885.372121l194.779798-129.861818 16.665859-11.106263h383.844848c36.486465 0 66.19798-29.659798 66.19798-66.146262v-529.19596c0-36.434747-29.711515-66.107475-66.19798-66.107475H132.305455c-36.486465 0-66.146263 29.659798-66.146263 66.107475v529.19596c0 36.486465 29.659798 66.146263 66.146263 66.146262h198.438787v140.968081m-66.146262 123.578182V810.550303H132.305455c-73.024646 0-132.305455-59.216162-132.305455-132.292525v-529.19596C0 76.024242 59.267879 16.808081 132.305455 16.808081h793.742222c73.076364 0 132.357172 59.216162 132.357171 132.240808v529.195959c0 73.076364-59.267879 132.292525-132.357171 132.292526h-363.830303L264.59798 1008.950303z m0 0"
										      p-id="1866" fill="#6e7c9a"></path>
									</svg>
								</div>
								<div class="reply-all-box-right">
									<div class="moment_detail_list" v-for="item in userMomentDetail.reply">
										<div v-if="item.reply_name==''" style="width:100%;">
											<div class="flexBox">
												<div class="leftBox"><img :src="item.reply_avatar"
												                          class="reply_avatar"/></div>
												<div style="margin-left:5px;width:100%;">
													<p class="moment_name_box"><i class="moment_detail_list_name">{{item.one_name}}</i><i
															style="margin-right:6px;">{{item.create_time}}</i></p>
													<div style="margin-left:5px;width:100%;">
														<p v-html="item.content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi,emotion)"
														   style="padding-right: 10px;float: left;width: 85%;"></p>
														<p v-if="item.status==0"
														   style="color: rgb(232, 100, 100);display: inline-block;width: 50px;">
															已删除</p>
													</div>
												</div>
											</div>
										</div>
										<div v-if="item.reply_name!=''" style="width:100%;">
											<div class="flexBox">
												<div class="leftBox"><img :src="item.reply_avatar"
												                          class="reply_avatar"/></div>
												<div style="padding-left: 5px;width: 100%;">
													<div class="moment_name_box"><i class="moment_detail_list_name">{{item.one_name}}</i><i
															style="margin-right:6px;">{{item.create_time}}</i></div>
													<div style="width:100%" class="moment_name_box">
														<div style="float: left;width: 86%;">
															<i class="moment_detail_list_reply_text">回复</i>
															<i class="moment_detail_list_name">{{item.reply_name}}</i>
															<i v-html="item.content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi,emotion)"></i>
														</div>
														<p v-if="item.status==0"
														   style="color: rgb(232, 100, 100);display: inline-block;width: 46px;">
															已删除</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</a-tab-pane>
					</a-tabs>
				</div>
			</a-modal>
		</div>
	</div>
</template>

<script>
	import cityData from "../../../common/js/citydata2.js";
	import moment from "moment";
	import "moment/locale/zh-cn";
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"
	import {videoPlayer} from "vue-video-player";
	import PubSub from 'pubsub-js';
	import AudioPlayer from '@liripeng/vue-audio-player'
	import '@liripeng/vue-audio-player/lib/vue-audio-player.css'

	moment.locale("zh-cn");

	function getBase64 (file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			// reader.onerror = error => reject(error);
		});
	}

	export default {
		components: {videoPlayer, corpChooseTag, AudioPlayer},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				loseReason      : [],
				lose            : undefined,
				followItem      : {},
				dialout_phone   : '',
				dialout_exten   : '',
				corpId          : corpId,//企业微信选中的id
				is_hide_phone   : 0,
				isLoading       : false, //Loading 组件显示与隐藏
				commonUrl       : this.$store.state.commonUrl,//公共的链接
				remarkVisible   : false,//是否修改备注
				confirmLoading2 : false,//打标签对话框的确认按钮加载
				id              : '',//客户id
				avatar          : '',//头像
				name            : '',//名称
				corp_name       : '',//企业名称
				nickname        : '',//设置的昵称
				gender          : '',//性别
				followTitle     : '',
				is_follow_del   : '',//当前跟进状态是否为已删除，1是
				phone           : '',//手机号
				phone2          : '',//暂存的手机号，方便取消时赋值
				company         : '',//公司
				company2        : '',//暂存的公司，方便取消时赋值
				area            : '',//地区
				des             : '',//描述
				//打标签
				visible         : false,
				hasTags         : [],//在别的地方打的已有的标签id
				hasTagsValue    : [],//在别的地方打的已有的标签名称
				tagCheckValue   : [],//该客户已有标签
				tagCheckValue2  : [],//该客户已有标签
				disabled        : [],//禁选标签
				tagsList        : [], //标签列表
				tagValue        : [],//新建标签的数组
				addTagVisible   : false,//新建标签弹窗显示与隐藏
				confirmLoading3 : false, //新建标签弹框加载
				inputValue      : '',//新建标签输入框值
				editGroupId     : '',//新建标签弹窗里的选中的分组id
				groupList       : [], // 小组列表
				groupId         : '-1', // 选中的小组id
				tagLoading      : false,//增加标签弹窗加载的显示与隐藏
				desVisible      : false,//修改描述弹窗的显示与隐藏
				imageUrl3       : '',//修改描述弹窗中图片链接地址
				file3           : '',//页面展示的修改描述图片链接地址
				desImgLoading   : false,//描述图片上传加载的显示与隐藏
				desText         : '',//修改的描述字段
				follow_id       : '',//展示的跟进状态
				followStatus    : '',
				follows         : [],
				closeRateVisible: false,//是否修改成交率
				close_rate      : '',//成交率
				follow_time     : '',//上次联系
				follow_times    : [],//上次联系详细信息
				follow_num      : '',//联系次数
				memberInfo      : '',//归属企业成员
				chatName        : [], // 所在群
				field_list      : [],//基础信息
				fieldData       : [],//编辑基础信息参数
				badicInfoVisible: false,//基础信息是否编辑状态
				projectList     : [],//项目列表
				// 地域
				cityData,
				moment, //时间选择器
				//跟进记录
				followRecord    : [],//跟进记录数据
				imageUrl        : [],//上传的图片文件类型
				file            : [],//上传的图片链接地址
				imgNum          : 0,//上传的图片的数量
				msg             : '',//跟进记录输入框内容
				previewVisible  : false,//预览图片弹窗显示与隐藏
				previewImage    : '',//预览的图片链接
				isImg           : true,//上传图片符不符合规则
				submitDisabled  : true,//提交按钮的置灰
				record_id       : '',//选择编辑的记录id

				//修改跟进记录弹窗
				editVisible    : false,//修改跟进记录弹窗的显示与隐藏
				imageUrl2      : [],//上传的图片文件类型
				file2          : [],//上传的图片链接地址
				imgNum2        : 0,//上传的图片的数量
				msg2           : '',//跟进记录输入框内容
				previewVisible2: false,//预览图片弹窗显示与隐藏
				previewImage2  : '',//预览的图片链接
				isImg2         : true,//上传图片符不符合规则
				submitDisabled2: true,//提交按钮的置灰
				//分页
				total          : 1, //总条数
				quickJumper    : false, // 是否显示快速跳转的控件
				page           : 1, //页码
				pageSize       : 15, //每页数据条数
				status         : [],//跟进状态
				//互动轨迹
				interactList   : [],//互动轨迹数据列表

				picFile           : {},
				isImg3            : true,
				//分页
				page2             : 1, //页码
				btnFlag           : 1,//1加载更多，2没有更多数据
				tabKey            : '1',
				isMasterAccount   : localStorage.getItem('isMasterAccount'),
				canEdit           : 1,//是否可以编辑客户跟进状态,1可以，0不可以
				momentDetailDialog: false,
				userMomentDetail  : {},//当前用户互动轨迹详情
				videoIndex        : null,
				playerOptions     : [],
				publicOptions     : {
					playbackRates      : [0.7, 1.0, 1.5, 2.0], //播放速度
					autoplay           : false, //如果true,浏览器准备好时开始回放。
					muted              : false, // 默认情况下将会消除任何音频。
					loop               : false, // 导致视频一结束就重新开始。
					preload            : "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
					language           : "zh-CN",
					aspectRatio        : "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
					fluid              : true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
					notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
					controlBar         : {
						timeDivider         : true,
						durationDisplay     : true,
						remainingTimeDisplay: false,
						fullscreenToggle    : true //全屏按钮
					}
				},
				isShowTag         : true,//根据权限判断是否展示打标签或移除标签
				clickIndex        : -1,
				flag              : false,
				playTime          : [],
				t1                : [],
			};
		},

		methods: {
			contact () {
				let that = this
				this.$confirm({
					title     : '是否拨打电话',
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						PubSub.publish('showCall', {
							showCall : true,
							avatar   : that.avatar,
							nickname : that.nickname,
							follow_id: that.id,
							phone    : that.phone,
							type     : 0,
							from     : 0, // 来自企微
						});
					}
				});
			},

			//播放音频
			playMusic (index, flag) {
				clearInterval(this.t1);
				if (this.clickIndex != -1) {
					document.getElementsByName(index)[0].pause();
				}
				if (!flag) {
					this.clickIndex = -1
					this.flag = !this.flag
					return
				}
				console.log(document.getElementsByName(index)[0])
				document.getElementsByName(index)[0].play();
				this.clickIndex = index;
				this.t1 = setInterval(() => {
					this.playTime[index]--;
					this.$set(this.playTime, index, this.playTime[index]);
					if (this.playTime[index] <= 0) {
						this.clickIndex = -1
						clearInterval(this.t1);
						this.$set(
							this.playTime,
							index,
							Math.ceil(document.getElementsByName(index)[0].duration)
						);
					}
				}, 1000);
			},
			oncanplay (res) {
				//   console.log(res.target.duration);
				const audioIndex = res.target.dataset.index;
				this.$set(this.playTime, audioIndex, Math.ceil(res.target.duration));
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
			emotion (res) {//处理评论的表情
				let word = res.replace(/\#|\;/gi, '')
				const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手']
				let index = list.indexOf(word)
				return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
			},
			handleCancel4 () {//点击详情的关闭按钮
				this.momentDetailDialog = false
			},
			async toTimeLineDetail (item) {//点击跳转到当前轨迹的详情（只限历史朋友圈）
				const {data: res} = await this.axios.post('moment/moment-info', {
					corpid : localStorage.getItem('corpId'),
					line_id: item.line_id,
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.isLoading = false
				} else {
					if (res.data.default_heard == 1) {
						res.data.heard_img = this.commonUrl + res.data.heard_img
					}
					this.userMomentDetail = res.data
					this.isLoading = false
					this.momentDetailDialog = true
					let obj = res.data.info
					if (res.data.type == 3 && obj != null && obj != '' && obj != []) {
						this.playerOptions = {
							...this.publicOptions,
							sources: [
								{
									src : obj[0].local_path.substr(0, 1) == '/' ? this.commonUrl + obj[0].local_path : obj[0].local_path, // 路径
									type: "video/mp4" // 类型
								}
							]
						};
					}
				}

			},
			goBack () {
				this.$router.go(-1)
			},
			//获取信息
			async getInfo () {
				this.isLoading = true;
				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-detail", {
					uid            : localStorage.getItem('uid'),
					cid            : this.id,
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
				})

				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.message)
				} else {
					this.isLoading = false
					this.avatar = res.data.avatar
					this.name = res.data.name
					this.corp_name = res.data.corp_name
					this.nickname = res.data.nickname
					this.gender = res.data.gender
					this.phone = res.data.phone
					this.company = res.data.company
					this.followTitle = res.data.follow_title
					this.is_follow_del = res.data.is_follow_del
					this.area = res.data.area
					this.des = res.data.des
					this.file3 = res.data.path
					this.hasTags = []
					this.tagCheckValue = []
					this.hasTagsValue = []
					res.data.tag_name.map(x => {
						this.hasTags.push(x.tid)
						this.tagCheckValue.push(x.tid)
						this.hasTagsValue.push(x.tname)
					})
					this.follow_id = JSON.parse(JSON.stringify(res.data.follow_id))
					if (this.follow_id == '') {
						this.follow_id = this.follows[0] ? (this.follows[0].id ? this.follows[0].id : '') : ''
					}

					this.status = this.follow_id
					this.followStatus = this.follow_id
					this.close_rate = res.data.close_rate
					this.follow_time = res.data.follow_time
					this.follow_times = res.data.follow_times
					this.follow_num = res.data.follow_num
					this.memberInfo = res.data.memberInfo
					this.chatName = res.data.chat_name
					this.is_hide_phone = res.data.is_hide_phone
					this.dialout_phone = res.data.dialout_phone
					this.dialout_exten = res.data.dialout_exten

					this.getFollowStatus()

					this.field_list = res.data.field_list
					// this.field_list.unshift({
					// 	fieldid: "83",
					// 	key: "2_61",
					// 	title: "图片",
					// 	type: "8",
					// 	sort: "100",
					// 	optionVal: "",
					// 	value: [
					// 		{
					// 			url:"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
					// 			status: 'done'
					// 		}
					// 	],
					// })
					this.field_list.map(x => {
						if (x.type == 2 || x.type == 3) {
							x.optionVal2 = x.optionVal.split(',')
							if (x.type == 2) {
								if (x.value == '') {
									x.hasOption = x.value.split('')
								} else {
									x.hasOption = x.value
								}
							} else if (x.type == 3 && x.value != '') {
								x.hasOption = x.value.split(',')
							}
						} else if (x.type == 7) {
							if (x.value == '') {
								x.provice = []
							} else {
								x.provice = x.value.split('-')
							}
						} else if (x.type == 4) {
							x.data = x.value
						}
					})
					this.fieldData = res.data.field_list
					this.projectList = res.data.project
				}
			},
			//修改备注
			modifyRemark () {
				this.remarkVisible = !this.remarkVisible;
			},
			setRemark (remark) {
				let that = this
				if (remark.length > 10) {
					that.$message.warning("备注不可超过10个字")
					return false;
				}
				this.editInfo(remark, 'nickname')
			},
			//修改信息
			async editInfo (value, type) {
				const {data: res} = await this.axios.post('work-external-contact-follow-user/custom-update', {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem("sub_id"),
					cid            : this.id,
					type           : type,
					value          : value,
					path           : this.imageUrl3
				});
				if (res.error == 0) {
					if (type == 'nickname') {
						this.remarkVisible = !this.remarkVisible
					} else if (type == 'des') {
						this.desVisible = false
					} else if (type == 'close_rate') {
						this.closeRateVisible = !this.closeRateVisible;
					}
					this.getInfo()
					if (this.tabKey == 2) {
						this.getInteract()
					}
				} else {
					this.$message.error(res.error_msg);
				}
			},
			// 打标签
			showModal () {
				this.groupId = '-1'
				this.visible = true;
				this.tagCheckValue = JSON.parse(JSON.stringify(this.hasTags))
			},
			//客户标签
			modalVisibleChange4 (event, str) {
				if (event == "ok") {
					if (str == '') {
						this.tagCheckValue = []
					} else {
						this.tagCheckValue = str.split(',')
					}
				}
			},
			async handleOk () {
				this.confirmLoading2 = true;
				const {data: res} = await this.axios.post("work-user/give-user-tags", {
					tag_ids  : this.tagCheckValue,
					user_ids : this.id,
					type     : 0,
					s_type   : 2,//1通讯录，2客户管理
					bitch_all: 1,//1区分不同组件，增删一体
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.confirmLoading2 = false;
				} else {
					this.$message.success(res.error_msg);
					this.visible = false
					this.confirmLoading2 = false;
					this.getInfo();
				}
			},
			cancelVisible () {
				this.visible = false
				this.tagCheckValue = []
			},
			//修改描述
			showDesVisible () {
				this.desText = this.des
				this.imageUrl3 = this.file3
				this.desVisible = true
			},
			desVisibleCancel () {
				this.desVisible = false
			},
			setDetail () {
				if (this.desText.length > 150) {
					this.$message.warning("描述不可超过150个字")
					return false;
				}
				this.editInfo(this.desText, 'des')
			},
			async uploadMaterial3 (materialData) {
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", materialData);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.imageUrl3 = res.data.local_path
						this.desImgLoading = false
					}
				} else {
					this.$message.error(res.error_msg)
					this.desImgLoading = false
				}
			}
			,
			beforeUpload3 (file) {
				this.desImgLoading = true
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.desImgLoading = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.desImgLoading = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.desImgLoading = false
					return false;
				}
				this.uploadMaterial3(file);
				return isLt2M;
			}
			,
			//修改成交率
			modifyCloseRate () {
				this.closeRateVisible = !this.closeRateVisible;
			},
			setCloseRate (close_rate) {
				let reg = /^(?:0|[1-9][0-9]?|100)$/
				if (close_rate > 100) {
					this.$message.warning("成交率不可超过100")
					return false;
				}

				if (close_rate != null && close_rate != '' && !reg.test(close_rate)) {
					this.$message.warning("成交率必须为0-100正整数")
					return false;
				}
				this.editInfo(close_rate, 'close_rate')
			},
			//编辑基础信息
			editBadicInfo () {
				this.fieldData = JSON.parse(JSON.stringify(this.field_list))
				for (let i = 0; i < this.field_list.length; i++) {
					this.field_list[i]['picUrl'] = []
					if (this.field_list[i].type == 8) {
						if (this.field_list[i].value) {
							for (let v of this.field_list[i].value) {
								this.field_list[i]['picUrl'].push({
									uid   : v.uid,
									url   : this.commonUrl + v.url,
									status: v.status,
									name  : 'image.png'
								})
							}
						}
					}
					if (this.field_list[i].key == 'phone') {
						//手机号
						if (this.phone) {
							let val = JSON.parse(JSON.stringify(this.phone))
							this.phone2 = val.replace(/,/g, " ")
						}
					}
					if (this.field_list[i].key == 'company') {
						//公司
						if (this.company) {
							this.company2 = JSON.parse(JSON.stringify(this.company))
						}
					}
				}
				this.badicInfoVisible = true
			},
			//单选
			handleChange (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value;
					this.field_list = newData;
				}
			},
			//多选
			handleChange2 (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value.join(',');
					this.field_list = newData;
				}
			},
			//输入框
			changeInput (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value;
					this.field_list = newData;
				}
			},
			//特殊输入框（手机号、公司）
			changeSpecialInput (value, key) {
				if (key == 'phone') {
					this.phone2 = value
				} else if (key == 'company') {
					this.company2 = value
				}
			},
			// 地区
			changeArea (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value.join('-');
					this.field_list = newData;
				}
			},
			//日期
			selectDate (value, id) {
				const newData = [...this.field_list];
				const target = newData.filter(item => id === item.fieldid)[0];
				if (target) {
					target.value = value.format("YYYY-MM-DD");
					this.field_list = newData;
				}
			},
			disabledStartDate (date2) {
				//打开开始时间面板调用的函数
				return date2.valueOf() > new Date().getTime(); //大于今天的日期一律返回true，禁止选择
			},
			//提交基础信息修改
			async submitBadicInfo () {
				let phoneReg = /^1[345678]{1}\d{9}$/
				let phoneReg2 = /^0\d{2,3}-?\d{7,8}$/
				//只能输入数字与+-
				let phoneReg3 = /[^+|-|\d]/
				let postBoxReg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
				let field_list = JSON.parse(JSON.stringify(this.field_list))
				let flag = true
				for (let i = 0; i < this.field_list.length; i++) {
					if (this.field_list[i].key == 'phone') {
						let PhoneArr = this.phone2.split(' ')
						for (let i = PhoneArr.length - 1; i >= 0; i--) {
							if (PhoneArr[i] == '') {
								PhoneArr.splice(i, 1);
							}
						}
						if (PhoneArr.length > 5) {
							this.$message.error('手机号不能多于5个！')
							flag = false
							return false
						}
						for (let j = 0; j < PhoneArr.length; j++) {
							if (phoneReg3.test(PhoneArr[j])) {
								this.$message.error('手机号格式不正确！')
								flag = false
								return false
							}
						}
						if (!flag) {
							return false
						}
						field_list[i].value = PhoneArr.join()
					}
					if (this.field_list[i].key == 'company') {
						field_list[i].value = this.company2
					}
					if (field_list[i].type == 6 && field_list[i].value != '') {
						if (!postBoxReg.test(field_list[i].value)) {
							this.$message.error('邮箱格式不正确！')
							flag = false
							return false
						}
					}
					if (field_list[i].type == 8) {
						for (let picUrl of field_list[i].picUrl) {
							picUrl.url = picUrl.url.replace(this.commonUrl, "")
							delete picUrl.response
							delete picUrl.xhr
							delete picUrl.percent
						}
						field_list[i].value = JSON.parse(JSON.stringify(field_list[i].picUrl))
						delete field_list[i].picUrl
					}
					if (typeof field_list[i].value == 'undefined') {
						field_list[i].value = ''
					}
				}
				if (!flag) {
					return false
				}
				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-field-update", {
					uid      : localStorage.getItem('uid'),
					cid      : this.id,
					fieldData: field_list
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.badicInfoVisible = false
					this.getInfo()
				}
			},
			cancleBadicInfo () {
				this.badicInfoVisible = false
				this.field_list = JSON.parse(JSON.stringify(this.fieldData))
				// this.phone = JSON.parse(JSON.stringify(this.phone2))
				// this.company = JSON.parse(JSON.stringify(this.company2))
			},
			//切换tab
			changeTab (e) {
				if (e == 2) {
					this.btnFlag = 1
					this.getInteract(1)
				} else if (e == 1) {
					this.getFollowRecord()
				}
			},
			//获取跟进记录
			async getFollowRecord (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-follow-record", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					uid            : localStorage.getItem('uid'),
					corp_id        : this.corpId,
					cid            : this.id,
					sub_id         : localStorage.getItem("sub_id"),
					page           : page,
					page_size      : pageSize,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					this.followRecord = res.data.followRecord
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getFollowRecord(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getFollowRecord(1, pageSize);
			},
			//输入框
			changeTextarea () {
				if (this.followItem.lose_one == 0) {
					if (this.msg == '' && this.file.length == 0) {
						this.submitDisabled = true
					} else {
						this.submitDisabled = false
					}
				}
			},
			//上传图片
			handleCancel () {
				this.previewVisible = false;
			},
			async beforeUploadPic (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.isImg3 = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.isImg3 = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.isImg3 = false
					return false;
				}
				this.isImg3 = true
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", file);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.picFile = {
							uid   : file.uid,
							url   : this.commonUrl + res.data.local_path,
							status: 'done'
						}
						return isLt2M;
					}
				} else {
					this.$message.error(res.error_msg)
				}

			},
			handleChangePic (e, index) {
				if (e.file.status == 'removed') {
					this.field_list[index]['picUrl'].splice(this.field_list[index]['picUrl'].findIndex(x => x.url == e.file.url), 1)
				}
				if (this.picFile.status == 'done') {
					let i = this.field_list[index]['picUrl'].findIndex(x => e.file == x)
					if (i != -1) {
						this.field_list[index]['picUrl'].splice(i, 1)
					} else {
						this.field_list[index]['picUrl'].push(this.picFile)
					}
				}
				for (let f of this.field_list[index]['picUrl']) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
				this.picFile = {}
			}
			,
			preview (url) {
				this.previewImage = url
				this.previewVisible = true;
			},
			async handlePreview (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage = file.url || file.preview;
				this.previewVisible = true;
			}
			,
			changeMsg (value) {
				if (this.imageUrl.indexOf(value.file) != -1) {
					this.file.splice(this.imageUrl.indexOf(value.file), 1)
				}
				if (this.isImg) {
					this.imageUrl = value.fileList;
					this.imgNum = value.fileList.length
				}
				for (let f of this.imageUrl) {
					if (f.status == 'error') {
						f.status = 'done'
					}
				}
				if (this.file.length == 0 && this.msg == '') {
					this.submitDisabled = true
				}
			}
			,
			async uploadMaterial (materialData) {
				let params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", materialData);
				const {data: res} = await this.axios.post("sub-user/upload-image", params)
				if (res.error == 0) {
					if (res.data) {
						this.file.push(res.data.local_path)
						if (this.followItem.lose_one == 1 && !this.lose) {
							this.submitDisabled = true
						} else {
							this.submitDisabled = false
						}
					}
				} else {
					this.$message.error(res.error_msg)
					if (this.followItem.lose_one == 1 && !this.lose) {
						this.submitDisabled = true
					} else {
						this.submitDisabled = false
					}
				}
				// console.log(this.file,'this.file')
			}
			,
			beforeUpload (file) {
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					this.isImg = false
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					this.isImg = false
					return false;
				} else if (file.size < 5) {
					this.$message.error("上传文件大小不符！");
					this.isImg = false
					return false;
				}
				this.isImg = true
				this.uploadMaterial(file);
				return isLt2M;
			}
			,
			//预览图片
			previewHasImg (url) {
				this.previewImage = url;
				this.previewVisible = true;
			},
			changeState (item) {
				let index = this.follows.findIndex(x => x.id == this.follow_id)
				this.followItem = this.follows[index]
				this.submitDisabled = false
				if (this.followItem.lose_one == 1 && (!this.lose || this.lose == '')) {
					this.submitDisabled = true
				} else if (this.followItem.lose_one == 0) {
					if ((!this.msg && this.msg == '') && this.file.length <= 0) {
						this.submitDisabled = true
					} else {
						this.submitDisabled = false
					}
				}
			},
			changeState1 (item) {
				let index = this.follows.findIndex(x => x.id == this.status)
				this.followItem.lose_one = this.follows[index].lose_one
			},
			changeLose () {
				if (this.followItem.lose_one == 1) {
					if (!this.lose || this.lose == '') {
						this.submitDisabled = true
					} else {
						this.submitDisabled = false
					}
				}
			},
			//提交跟进记录
			async submitFollowRecord () {
				let record = ''
				let file = []
				if (this.record_id == '') {
					//新建
					record = this.msg
					file = this.file
				} else {
					//修改
					record = this.msg2
					file = this.file2
				}
				if (this.followItem.lose_one == 0) {
					if (record.trim() == '' && file.length == 0) {
						this.$message.error('跟进内容和图片至少要填写一个！')
						return false
					}
				} else {
					if (this.lose == '') {
						this.$message.error('请选择原因！')
						return false
					}
				}
				let followStatus = 0
				let lose
				if (!this.editVisible) {
					followStatus = this.follow_id
					lose = this.followItem.lose_one == 1 ? this.lose : ''
				} else {
					followStatus = this.status
					let index = this.follows.findIndex(x => x.id == this.status)
					let item = this.follows[index]
					lose = item.lose_one == 1 ? this.followItem.lose_id : ''

					if (item.lose_one == 1 && (!lose || lose == '')) {
						this.$message.error('请选择原因！')
						return false
					}
				}
				if (followStatus == '') {
					this.$message.warning('请选择跟进状态！')
					return false
				}

				for (let i = 0; i < this.follows.length; i++) {
					if (this.follows[i].id == followStatus) {
						if (this.follows[i].status == 0) {
							this.$message.warning('跟进状态已被删除，请更换！')
							return false
						} else {
							break;
						}
					}
				}

				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-follow-record-set", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					corp_id        : this.corpId,
					uid            : localStorage.getItem('uid'),
					cid            : this.id,
					sub_id         : localStorage.getItem("sub_id"),
					record_id      : this.record_id,
					record         : record,
					file           : file,
					follow_id      : followStatus,
					lose           : lose,
				})

				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					localStorage.setItem('followid', followStatus)
					this.submitDisabled = true
					this.msg = ''
					this.file = []
					this.record_id = ''
					this.imageUrl = []
					this.imgNum = 0
					this.msg2 = ''
					this.file2 = []
					this.lose = undefined
					this.imageUrl2 = []
					this.imgNum2 = 0
					this.editVisible = false
					this.getFollowRecord()
					this.canEditFollow()
					this.getInfo()
				}
			},

			//修改跟进记录
			editFollowRecord (item) {
				this.followItem = item
				this.status = parseInt(this.followItem.follow_id)
				let index = this.follows.findIndex(x => x.id == this.status)
				this.followItem.lose_one = this.follows[index].lose_one

				this.editVisible = true
				this.record_id = item.id
				this.msg2 = item.record
				this.file2 = JSON.parse(JSON.stringify(item.file))
				item.file.map((x, index) => {
					let url = {
						uid   : index,
						name  : 'image.png',
						status: 'done',
						url   : this.commonUrl + x
					}
					this.imageUrl2.push(url)
				})
				this.imgNum2 = item.file.length
			},
			cancelFollowRecord () {
				this.editVisible = false
				this.record_id = ''
				this.status = this.followStatus
				this.msg2 = ''
				this.file2 = []
				this.lose = undefined
				this.imageUrl2 = []
				this.imgNum2 = 0
			},
			//上传图片
			handleCancel2 () {
				this.previewVisible2 = false;
			},
			async handlePreview2 (file) {
				if (!file.url && !file.preview) {
					file.preview = await getBase64(file.originFileObj);
				}
				this.previewImage2 = file.url || file.preview;
				this.previewVisible2 = true;
			}
			,
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
			}
			,
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
				// console.log(this.file,'this.file')
			}
			,
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
			}
			,
			//获取互动轨迹
			async getInteract (page = 1) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-track", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					uid            : localStorage.getItem('uid'),
					corp_id        : this.corpId,
					cid            : this.id,
					sub_id         : localStorage.getItem("sub_id"),
					page           : page,
					page_size      : 15,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false
					this.page2 = page;
					if (res.data.length < 15) {
						this.btnFlag = 2
					} else {
						this.btnFlag = 1
					}
					if (page == 1) {
						this.interactList = res.data
					} else {
						this.interactList = this.interactList.concat(res.data)
					}
				}
			}
			,

			//加载更多
			loadMore () {
				this.page2++
				this.page2++
				this.getInteract(this.page2)
			}
			,
			async getFollowStatus () {
				const {data: res} = await this.axios.post(
					"custom-field/follow",
					{
						uid    : localStorage.getItem("uid"),
						status : 1,
						corp_id: localStorage.getItem("corpId"),
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.follows = res.data.follow
					if (this.is_follow_del == 1) {
						let obj = {
							id    : this.follow_id,
							title : this.followTitle,
							status: 0
						}
						this.follows.unshift(obj)
					}
					let index = this.follows.findIndex(x => x.id == this.follow_id)
					this.followItem = this.follows[index]
				}
			}
			,
			//是否可以编辑客户跟进状态
			async canEditFollow () {
				const {data: res} = await this.axios.post(
					"wait-project/can-edit-follow",
					{
						cid : this.id,
						type: 1
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
			if (localStorage.getItem('permissionButton') == 'all') {
				this.isShowTag = true
			} else {
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.indexOf('client-add-tag') > -1 && list.indexOf('client-remove-tag') > -1) {
					this.isShowTag = true
				} else {
					this.isShowTag = false
				}
			}
			this.id = this.$route.query.id
			this.getFollowRecord()
			this.canEditFollow()
			this.getLoseReason()
			this.getInfo();

		}
	}
	;
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';

	.audio_box {
		float: left;
		overflow: auto;
		cursor: pointer;
	}

	.wifi-symbol {
		width: 20px;
		height: 20px;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(132deg);
		position: absolute;
		left: 13px;
		top: 6px;
	}

	.wifi-circle {
		border: 2px solid #FFF;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 5px;
		height: 5px;
		background: #FFF;
		top: 15px;
		left: 15px;
	}

	.second {
		width: 15px;
		height: 15px;
		top: 10px;
		left: 10px;
	}

	.third {
		width: 24px;
		height: 24px;
		top: 5px;
		left: 5px;
	}

	.second1 {
		width: 15px;
		height: 15px;
		top: 10px;
		left: 10px;
		animation: fadeInOut 1s infinite 0.2s;
	}

	.third1 {
		width: 24px;
		height: 24px;
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

	.audio_container {
		width: 140px;
		height: 30px;
		line-height: 30px;
		background-color: #3291F8;
		color: #FFF;
		text-align: center;
		border-radius: 10px;
		position: relative;
	}

	.no-active-zan {
		color: #C7C7C7 !important;
	}

	.covers {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.cover {
		display: flex;
		justify-content: center;
		width: 33%;
		margin: 10px 0;
	}

	/deep/ .moment_detail_tab .ant-tabs-bar {
		margin: 0 0 16px;
		border-bottom: 1px solid #E8E8E8;
		outline: none;
		background: #FFF;
	}

	.moment_detail_tab {
		padding: 15px 30px 0px 62px;
	}

	/deep/ .moment_detail_tab .ant-tabs-nav .ant-tabs-tab {
		margin: 0;
	}

	.moment_detail_zan {
		position: relative;
		background: #F7F7F7;
		color: #6C7A99;
		padding: 5px;
		padding-left: 30px;
	}

	.moment_detail_zan_icon {
		position: absolute;
		top: 18px;
		left: 12px;
	}

	.moment_detail_zan_name {
		margin: 0px 3px;
		font-style: normal;
	}

	.moment_detail_list {
		background: #F7F7F7;
		padding: 10px 10px 0px 0px;
		justify-content: space-between;
		display: flex;
		flex-wrap: wrap;
		word-break: break-all;
		position: relative;
	}

	.moment_detail_list i {
		font-style: normal;
	}

	.moment_detail_list_name {
		color: #6C7A99;
		padding: 0px 3px;
		font-weight: bold;
	}

	.moment_detail_list_reply_text {
		margin: 2px;
	}

	.moment_detail_list_delbox {
		color: #8A8A8A;
		font-size: 14px;
		cursor: pointer;
	}

	/deep/ .moment_detail_list_delbox.ant-popover-message {
		padding: 4px 0 4px;
	}

	/deep/ .moment_detail_list_delbox p {
		margin-bottom: 0em;
	}

	/deep/ .moment_detail_delbox .ant-popover-inner-content {
		padding: 12px 14px 10px;
	}

	.moment_detail_list p {
		margin-bottom: 0em;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 20px 0 0 0;
	}

	.title_lh {
		line-height: 20px !important;
		margin-top: 10px;
		color: #000;
	}

	.input_img2 {
		width: 50px;
		height: 50px;
	}

	.input_text3 {
		max-width: 200px;
		line-height: 16px;
		font-size: 12px;
		display: -webkit-box;
		/*margin-top: 15px;*/
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		word-break: break-all;
	}

	.inp_title {
		max-width: 138px;
		line-height: 25px;
		margin-top: 3px;
		font-weight: bold;
		color: #000;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
	}

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

	.custom-info {
		padding: 20px;
	}

	.custom-info-text {
		width: calc(100% - 132px);
		display: inline-block;
		height: 132px;
		padding: 0 15px;
	}

	.col {
		margin-bottom: 5px;
	}

	.custom-info-box {
		margin-top: 20px;
		overflow: hidden;
		text-align: center;
	}

	.box {
		padding: 20px 20px 0;
		height: 115px;
		width: 20%;
		border: 1px solid #E9E9E9;
		background-color: #F9F9F9;
		float: left;
		overflow: auto;
	}

	.box:nth-child(1), .box:nth-child(2), .box:nth-child(3) {
		border-right: 0;
	}

	.box-first {
		font-size: 16px;
	}

	.box-second {
		padding: 0;
		margin: 0;
		overflow: hidden;
	}

	.custom-info-tab {
		margin-top: 20px;
	}

	.col2 {
		overflow: hidden;
	}

	.half {
		width: 50%;
		float: left;
		line-height: 40px;
		padding: 0 20px;
		border-top: 1px solid #E9E9E9;
	}

	.half-text {
		float: right;
		word-break: break-all;
		max-width: calc(100% - 120px);
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0;
	}

	.time {
		border: 1px solid #E9E9E9;
		padding: 20px 20px 0;
	}

	.textArea-btn {
		padding: 20px 0 10px;
		overflow: hidden;
	}

	.upload-file /deep/ .ant-upload-picture-card-wrapper {
		display: inline;
	}

	.upload-file /deep/ .ant-upload.ant-upload-select-picture-card {
		background-color: #FFF;
		border: 0;
		height: 32px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0;
	}

	.time-line-title {
		background: #F9F9F9;
		padding: 10px;
		margin-top: 5px;
	}

	.preview-box {
		width: 104px;
		height: 104px;
		margin: 0 8px 8px 0;
		padding: 8px;
		border: 1px solid #D9D9D9;
		border-radius: 4px;
		position: relative;
		float: left;
	}

	.preview-cover, .preview-cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: relative;
	}

	.preview-cover::before {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: all 0.3s;
		content: ' ';
	}

	.preview-cover-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 10;
		white-space: nowrap;
		transform: translate(-50%, -50%);
		opacity: 0;
		transition: all 0.3s;
		cursor: pointer;
		color: #FFF;
		font-size: 18px;
	}

	.preview-box:hover .preview-cover::before, .preview-box:hover .preview-cover-icon {
		opacity: 1;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 58px;
	}

	.upload-pic /deep/ .ant-upload.ant-upload-select-picture-card, .upload-pic /deep/ .ant-upload-list-picture-card .ant-upload-list-item, .upload-pic /deep/ .ant-upload-list-picture-card-container {
		width: 70px;
		height: 70px;
	}

	.upload-pic /deep/ .ant-upload-select-picture-card i {
		font-size: 32px;
		color: #999;
	}

	.upload-pic /deep/ .ant-upload-select-picture-card .ant-upload-text {
		margin-top: 8px;
		color: #666;
	}

	/deep/ .ant-input-group-addon {
		padding: 0;
	}

	.custom-info-project {
		border: 1px solid #E9E9E9;
		background-color: #F9F9F9;
		margin-top: 20px;
		padding: 20px;
		overflow-x: auto;
	}

	/deep/ .ant-steps-dot .ant-steps-item-process .ant-steps-item-icon, .ant-steps-dot.ant-steps-small .ant-steps-item-process .ant-steps-item-icon {
		width: 8px;
		height: 8px;
	}

	/deep/ .ant-steps-dot .ant-steps-item-content, .ant-steps-dot.ant-steps-small .ant-steps-item-content {
		width: 200px;
	}

	/deep/ .ant-steps-dot .ant-steps-item-icon, .ant-steps-dot.ant-steps-small .ant-steps-item-icon {
		margin-left: 97px;
	}

	/deep/ .ant-steps-dot .ant-steps-item-tail, .ant-steps-dot.ant-steps-small .ant-steps-item-tail {
		margin: 0 0 0 100px;
	}

	.single-accout-card::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
		height: 10px;
	}

	/deep/ .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
		color: rgba(0, 0, 0, 0.85);
	}

	/deep/ .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description {
		color: rgba(0, 0, 0, 0.65);
	}

	.time-line-detail {
		margin-left: 20px;
	}

	.moment_detail_zan_name {
		font-style: normal;
	}

	.moment_detail_zan_name img {
		width: 30px;
		height: 30px;
		border-radius: 3px;
		margin: 5px 5px 5px 0px;
	}

	.reply_avatar {
		wdith: 30px;
		height: 30px;
		border-radius: 3px;
		margin-top: 5px;
	}

	.flexBox {
		width: 100%;
		display: flex;
	}

	.leftBox {
		position: relative;
	}

	.reply-all-box-left {
		width: 10%;
		text-align: center;
		padding-top: 23px;
		background: #F7F7F7;
	}

	.reply-icon {
		width: 13px;
		height: 14px;
	}

	.reply-all-box-right {
		width: 93%;
		background: #F7F7F7;
		padding: 0px 0px 10px 0px;
	}

	.reply-all-box {
		display: flex;
	}

	.moment_name_box {
		display: flex;
		justify-content: space-between;
	}
  .over-width{
    width: 500px!important;
    max-height: 400px!important;
    overflow-y: auto!important;
  }
</style>
